## Jackson, Jersey and Dropwizard

This post describes an issue discovered in how POJO API objects are serialised into and deserialised from json, caused by a jersey concept known as auto-discovery. This problem exists in any module that depends on `fbcommon`, while the fix described here has only been applied to the provisor so far.

### Basics:
For those not deeply involved in writing server logic, jackson is one of the most popular libraries (or rather, a series of libraries) used for the (de)serialisation of java objects into json and vice-versa. Typically, one builds a so-called `ObjectMapper` which is the class that does this (de)serialisation. `ObjectMapper`s are highly configurable and have modules which define how particular java Classes might be (de)serialised.

Jersey is the defacto standard implementation of the java JAX-RS API. Basically, it does all the low level work required to run a server, and provides a lot of high-level APIs for doing things like routing requests to java methods, mapping java classes and exceptions to HTTP responses, etc. Jersey provides an API for registering objects which will hook into the lifecycle of the application so that you can customise, say, how a POJO will be serialised as a String into the body of an HTTP GET request. By default, it doesn't know how to convert POJOs to JSON.

Jersey also has a client API and implementation, allowing your server to make requests to other servers with a similar configuration API to the server. 

Our servers use a suite of libraries put together by a framework known as Dropwizard. These libraries simplify the configuration of an underlying Jersey server. One of the things dropwizard does out of the box is register a jackson `ObjectMapper` as the underlying mapper for `application/json` requests and responses. This mapper has several modules registered as described below and can also be configured by us. Configuration of the modules registered to Dropwizard (and then later to the underlying Jersey server) happens in the a subclass of the dropwizard `Application` object (in our case, the `ProvisorApplication`)

Dropwizard also provides a means of unit testing our endpoints (aka `Resource`s) using a JUnit `TestRule`, known as the `ResourceTestRule`. It does this by setting up standalone `Resource`s without the rest of the application.  

### At time of writing:
* dropwizard version: 1.3.14
* jersey-media-json-jackson version: 2.25.1
* jackson version: 2.9.9

### Clients, Servers and Tests.
To understand the issue, it's necessary to understand that in Jersey, clients and servers have independent configuration. This may seem obvious, but becomes important in tests, where the `ResourceTestRule` acts simultaneously as the server and provides a client. 

The `ResourceTestRule` builder also has no knowledge of the main dropwizard `Application` class, so it gives a brand new default configuration for every `ResourceTestRule` it creates. Under the hood, it still uses jersey, in particular, the `JerseyTest` class, to drive the calls to the API using an internal set of config for its server and an actual jersey client. 

Jersey has a series of configuration values which can be set on clients and servers (independently). One such value is `CommonProperties.FEATURE_AUTO_DISCOVERY_DISABLE`, which is set to false by default. Where these values get set will be covered later. 

[Auto-discovery](https://eclipse-ee4j.github.io/jersey.github.io/documentation/latest/deployment.html#deployment.autodiscoverable) is a mechanism by which certain javax extension `Feature`s will be registered with the underlying jersey `Application` (not the same as the dropwizard `Application`) *at runtime* if they exist on the classpath. 

### The problem
Prior to [this commit](https://github.com/omnicate/loltel/commit/c889350dedaf7847abd3419bc1aedb90ec31426c), we used the default jackson configuration in Dropwizard provided by the dropwizard jackson module:

```java
private static ObjectMapper configure(ObjectMapper mapper) {
    mapper.registerModule(new GuavaModule());
    mapper.registerModule(new GuavaExtrasModule());
    mapper.registerModule(new JodaModule());
    mapper.registerModule(new AfterburnerModule());
    mapper.registerModule(new FuzzyEnumModule());
    mapper.registerModule(new ParameterNamesModule());
    mapper.registerModule(new Jdk8Module());
    mapper.registerModule(new JavaTimeModule());
    mapper.setPropertyNamingStrategy(new AnnotationSensitivePropertyNamingStrategy());
    mapper.setSubtypeResolver(new DiscoverableSubtypeResolver());

    return mapper;
}
```

Notice the `JavaTimeModule` is registered here. Despite this, `java.time.Instant`s added to our API were serialised incorrectly in tests as: 

```json
"time":{
    "epochSecond":1571831715,
    "nano":353000000
}
```

where one might expect either seconds since epoch or a proper timestamp like: `2019-10-23T12:24:14.406Z`. 

Furthermore, no configuration changes would have an effect. Stranger still, if you got the object mapper from the `ResourceTestRule`, then things would be serialised correctly. 

### Cause:
After some trial-and-error by removing dependencies from the provisor's BUILD file, it became clear that the `"@maven//:org_glassfish_jersey_media_jersey_media_json_jackson"` package was to blame (introduced in the `fbcommon` library). It was introducing a `JacksonFeature` class, whose first job was to *remove all other jackson providers registered with the jersey application currently being executed*. 

Both the server and client configuration in the `ResourceTestRule` were being wiped by the auto-discovery of the `JacksonFeature`, leading to a double-negative situation where both had the same broken config, so they could talk seemlessly (until we tried to introduce `java.time` classes). We also had no integration tests against the actual config set in the production code that would have caught this potential issue.

A test that uses the `ObjectMapper` of the `ResourceTestRule` directly, rather than calling the `resource.client.request.get(ClassToDeserialise.class)`, was added to verify this issue. This ensures the intended configuration in the test is run against the actual one applied by jersey. This does NOT however, test the actual runtime configuration. For that, an integration test is required. 

### More problems:
Removing this package from the classpath or disabling auto-discovery solved the timestamp issue, but now other tests began to fail due to missing json properties in the API. It seems as if we'd been relying on the behaviour this `JacksonFeature` was providing implicitly. 

#### Different error responses:
Jersey's `JacksonFeature` added a `JsonMappingExceptionMapper` which, given an error during serialisation, would return a 400 with a (not particularly clean) error message. Without this, our null checks cause the server to think it crashed and return 500s instead.

#### Unintended APIs and hidden changes
It also turns out that if a json property had a different name to its POJO field using a `@JsonProperty` annotation, that this name was being ignored. This could be seen in the `SubscriptionSearchResult`

After removing auto-discovery, the registration of the `ParameterNamesModule` - a module registered by dropwizard on the default `ObjectMapper` - now takes affect where before this module was wiped by auto-discovery. This removes the necessity to use `@JsonCreator` and `@JsonProperty` on POJO api objects, but will now modifiy the API in the case of `SubscriptionSearchResult` (in this API object, the json properties were intended to be different than their POJO field names).

We never noticed that the API was not being named as intended, because the client `ObjectMapper` used to deserialise `SubscriptionSearchResult` in the `ProvisorSubscriptionClient.kt` had a very relaxed configuration where we call `.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)`. This property instructs jackson to try several methods of resolving json properties to POJO fields - the first of which is the constructor, and in this case, we were doing no manual verification (checking for nulls, for example) and so it would try again with different values, and pass. 

As a generalisation, when compiling model classes from a server project into a client project, (e.g. the `SubscriptionSearchResult` from provisor into partner-console), *the `ObjectMapper` used by the server needs to be considered as part of the API*. It's not enough to keep the json properties backward compatible. To prove why, imagine a scenario where the provisor is updated and deployed with `ParameterNamesModule()` configured and a API object is changed so that it ommits the `@JsonProperty` values for serialisation, as `ParameterNamesModule()` allows. If a client with an independant `ObjectMapper` without `ParameterNamesModule()` is then re-deployed, the changed API object will be included in the byte code of the client. If there are no explicit tests using the client's `ObjectMapper`, then the mismatch will not be discovered until runtime, breaking backward compatibility. 

### The fix:
The fix so far only applies to the provisor and its tests. 
* For now, auto discovery was disabled
* The `JsonMappingExceptionMapper` was registered to jersey
* A common `ResourceTestRule` was introduced in `ResourceUtils` with the same configuration as the application
* `@JsonProperty` tags were added to the current version of the API to guarantee compatibility with current clients when compiled into their code in the face of the configuration change. 
* Newer versions of the API make use of Lombok's `@Value` annotation coupled with the `ParameterNamesModule()` to reduce boiler plate

### Recommendations:
* Disable auto-discovery in any jersey server to avoid unexpected implicit behaviour
* In any Dropwizard server, use the default `ObjectMapper` provided by `Jackson.newObjectMapper()`. This contains support for `java.time`
* Where api objects are represented as POJOs and included as byte-code dependencies in clients, the `ObjectMapper` should be *considered part of the API*. That is, the same one should be used for serialisation as for deserialisation. 
* Combine the `ParameterNamesModule()` provided by Dropwizards default `ObjectMapper` in combination with lomboks `@Value` annotation. All api classes then look like:
```java
@Value
public class SimcardApiV2 {

  private final Set<String> imsis;
  private final String iccid;
  private final String bss;
  private final Instant created;
  private final Instant lastModified;
  
}
```

Notice there are no `@JsonProperty` annotations necessary!
* When a client module wants to make use of a server's api objects, then avoid making new clients for that server - use or create a common client in the server's module that can be used everywhere in the code, which makes it easier to adhere to using the correct `ObjectMapper`. For example, any library wanting to use the provisor's API and compile the api objects in it's own bytecode should make use of the client in the provisor's module, or have it's own independent classes to represent the api objects. 
* Have a few integration tests (still lacking in provisor) that test the actual API using the application config, or at least have hard-coded json files with the expected response for each endpoint from the server to test the client against
* When using dropwizards `ResourceTestRule`, ensure that it has the same configuration as what is set in the dropwizard `Application`. See provisor's `ResourceUtils` for an example.
* Move away from json for our internal libraries and start using gRPC!