---
layout: blogpost
permalink: /the-worst-message-in-telecom
title: The worst message in telecom (you won't believe)
date: 2022-03-09
tags: telco diameter credit-control charging
author: <a href="https://www.linkedin.com/in/sebastian-weddmark-olsson/">Sebastian Weddmark Olsson</a> - Telco newb
---

Sorry for the click-bait title, I couldn't resist.

In this blog post I will describe online charging and go in depth on
the Credit-Control message, what it is used for, what it contains, and
where it sent.

# What is charging?

If you (a user) want to make a phone call, send sms or use data
services, the your operator wants to know that you are able to pay for
that action. This is called charging, the method of you paying for
the services you use.

There are multiple ways this can happen, for instance you might have a
prepaid sim card where you top up your saldo in advance, or you might
have a subscription plan which allows for some services for a fixed
price.

The operators might handle the user's session with regards to charging
in two ways. Either they are using offline charging, or an online
charging system.

Offline charging cannot affect user sessions in real time, it
calculates the charging records after the session finished and updates
the user's values. For instance you might get the invoice after the
month finishes with the cost of your usage.  In order to send the
invoice the operator need to collect records of the user's usage,
these records are called Charging Detail Records, and ackronymed CDRs.
The CDRs are sent from all the parts of the network that handles the
user's session. For instance the SMSGW node is collecting CDRs for
SMS-usage,
%% TODO fill in the blanks ^ mention some more nodes that collect CDRs.


The other way is to have a online charging setup, where all the telco
nodes need to ask for credits at the same time the user is using the
services. The system that gets the request is called an Online
Charging System, or OCS in telco-lingo, and recides at the operator
control.  It is called online charging because it can actively affect
the user session in real time, i.e. block or allow user actions based
on the values and calculations in the OCS. The different systems sends
a request toward the OCS asking for some action, e.g. SMSGW might ask
the OCS if the user has credits enough to send a message.

Basically the OCS is a database storing information about prices of
the operators services, as well as keeping track of the user's credits.

The pricing is based per operator and could go for example something
like this

- 100 free smses, then 1 SEK per SMS
- 60 free voice minutes, then 5:50 SEK per minute
- 2 SEK per 100 MB data transfered

All operators have different pricing models in order to compete with
each other, not one model fits all etc.

![The OCS in the network](img/blog/the-worst-message-in-telecom/ocs-in-network.svg)

This picture shows how you the subscriber and the OCS are located in
the network. Your phone connects to the base station of the visiting
network. The visiting network is the network that owns the base
stations and spectrums, aka mobile network operator or MNO. In Sweden
it is one of Telia, Tele2, Telenor, or Tre. In Germany it is Telekom,
O2, or Vodafone. Wikipedia has
[lists](https://en.wikipedia.org/wiki/List_of_mobile_network_operators#By_region)
if you want to check your country's MNOs.

When using one of the services provided a bunch of requests are sent
from the visiting network to your home network, i.e. your operators
network. This network *could* be the same network as the visiting
network, but it doesn't have to.

Between the networks there are nodes called Sigtran Transfer Point
(STP), which connects between networks and routes the messages. I'm
not going to talk about all the requests going between the networks,
but I'll do mention the CAMEL interface.  CAMEL make it possible for a
home network to receive updates of it's users actions. As an example,
when you start a call, the visiting network will use CAMEL to send an
InitialDP (user has entered a detection point) message to the home
network. The home network will then respond with either Continue or
Connect (if it accept the action) which let's the user and visiting
network to continue to set up the call, or the home network can send a
ReleaseCall message which denies the call to be set up (or disconnects
if the call is already set up).

In the picture I've also mentioned a DRA which is a Diameter Relay
Agent which connects to the user's operator OCS. This node is actually
in the home network, but in our setup (as in Working Group Two,
provider of a telco core [the home network in the picture]) it is
managed directly by the operator or possibly a third party.

The home network will apply online charging by sending a
Credit-Control-Request message to the OCS, which will lookup the
subscriber and the subscribers credits, the action the subscriber
requests and it's pricing.

# What is the problem?

Disclaimer: These are all my personal thoughts, and there are probably
reasons the interface and messages are designed the way they are.

The problem is with the implementation of the network interfaces. An
interface in is the definition of how nodes talk to each other. It
usually specifies which nodes are involved, and which messages are
allowed.  For instance the Ro interface contains
Credit-Control messages for SMS, MMS and voice calls, between the
HSS/IMS and the OCS.  There is also the Gy interface between the
Packet Gateway (PGW) and the OCS, which also carries Credit-Control
messages for data usage.

![Different OCS interfaces](img/blog/the-worst-message-in-telecom/ocs-interfaces.svg)


| Interface | Description                               | Nodes involved  |
|-----------|-------------------------------------------|-----------------|
| Ro        | Online charging for SMS, MMS, voice calls | IMS (CSCF), OCS |
| Gy        | Online charging for data services         | PGW (PCEF), OCS |

Then we have the specifications for the Credit-Control message.
Basically there are two specifications, the base Diameter defined in
RFC4006, which can be used for any Diameter application which would
want to have charging functions, as well as the 3GPP (Telco) defined
in TS 32.299, for how charging should work in telecommunication
applications like specified above.

These two specifications are similar but different, let us compare the
`Request` messages in Diameter dictionary form:


<style type="text/css">
.ccr-avps tr:nth-child(12),
.ccr-avps tr:nth-child(13),
.ccr-avps tr:nth-child(17),
.ccr-avps tr:nth-child(19),
.ccr-avps tr:nth-child(21),
.ccr-avps tr:nth-child(22),
.ccr-avps tr:nth-child(25),
.ccr-avps tr:nth-child(28),
.ccr-avps tr:nth-child(31) { color: red; }
</style>


<div class="ccr-avps" markdown=1>


| Base Credit-Control-Request           | Telco Credit-Control-Request          |
|---------------------------------------|---------------------------------------|
| < Diameter Header: 272, REQ, PXY >    | < Diameter Header: 272, REQ, PXY >    |
| < Session-Id >                        | < Session-Id >                        |
| { Origin-Host }                       | { Origin-Host }                       |
| { Origin-Realm }                      | { Origin-Realm }                      |
| { Destination-Realm }                 | { Destination-Realm }                 |
| { Auth-Application-Id }               | { Auth-Application-Id }               |
| { Service-Context-Id }                | { Service-Context-Id }                |
| { CC-Request-Type }                   | { CC-Request-Type }                   |
| { CC-Request-Number }                 | { CC-Request-Number }                 |
| [ Destination-Host ]                  | [ Destination-Host ]                  |
| [ User-Name ]                         | [ User-Name ]                         |
| [ CC-Sub-Session-Id ]                 |                                       |
| [ Acct-Multi-Session-Id ]             |                                       |
| [ Origin-State-Id ]                   | [ Origin-State-Id ]                   |
| [ Event-Timestamp ]                   | [ Event-Timestamp ]                   |
| *[ Subscription-Id ]                  | *[ Subscription-Id ]                  |
| [ Service-Identifier ]                |                                       |
| [ Termination-Cause ]                 | [ Termination-Cause ]                 |
| [ Requested-Service-Unit ]            |                                       |
| [ Requested-Action ]                  | [ Requested-Action ]                  |
|                                       | [ AoC-Request-Type ]                  |
| *[ Used-Service-Unit ]                |                                       |
| [ Multiple-Services-Indicator ]       | [ Multiple-Services-Indicator ]       |
| *[ Multiple-Services-Credit-Control ] | *[ Multiple-Services-Credit-Control ] |
| *[ Service-Parameter-Info ]           |                                       |
| [ CC-Correlation-Id ]                 | [ CC-Correlation-Id ]                 |
| [ User-Equipment-Info ]               | [ User-Equipment-Info ]               |
|                                       | [ OC-Supported-Features ]             |
| *[ Proxy-Info ]                       | *[ Proxy-Info ]                       |
| *[ Route-Record ]                     | *[ Route-Record ]                     |
|                                       | [ Service-Information ]               |
| *[ AVP ]                              | *[ AVP ]                              |

</div>

A quick guide on how to read this:

- `< AVP >` indicates a mandatory Attribute-Value Pair with a fixed position in the message.
- `{ AVP }` indicates a mandatory Attribute-Value Pair in the message.
- `[ AVP ]` indicates an optional Attribute-Value Pair in the message.
- `*AVP` indicates that multiple occurrences of an Attribute-Value Pair is possible.

Each [Attribute-Value
Pairs](https://en.wikipedia.org/wiki/Name%E2%80%93value_pair) contain
information over each field in the message, and they can contain deep
structure with multiple (grouped) fields.

The last field named `*[ AVP ]` actually means that the message can
contain other arbitrary AVPs that are not mentioned, defined by the sender.

To comment on this, the messages are similar, but not compatible
with each other.


