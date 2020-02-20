---
layout: blogpost
permalink: /blog/extending-k8s/
title: "Extending Kubernetes for our needs"
date: 2020-01-28
tags: infrastructure kubernetes operator operator-framework networking aws
author: <a href="https://www.linkedin.com/in/hihrig/">Holger Ihrig</a>
---

We are using Kubernetes as our cluster scheduler and this serves us well. However we have a 
few cases where we need to do some additional work.

One case for example is that we have to use static IPs for some of our services to connect to
Telecom companies as they expect a single IP address to bind to. This address needs to be fixed and
DNS records are not accepted either. We are running in AWS as well, so the reader might ask why are we not
using Elastic IPs and adding them to the services? Good idea, but Telecom operators will not whitelist
an Elastic IP for you as there are no guarantees that it will belong to your Infrastructure forever.

We are a member of RIPE and do have a small subnet block for our own use, so we thought we could make use of 
that. As we own the block and AWS supports BYOIR (Bring your own IP-range), we created a special subnet with
some Kubernetes nodes in it. This was not enough to make this work since we depended on a service always having
the same IP attached to it, as well as the node running a pod having some very specific Routes set.

With this scenario in mind we set out to find solutions and all solutions we could think of required haggling
with Kubernetes.

## Extending Kubernetes

There are several ways to extend Kubernetes. All functionality in Kubernetes is build upon very nice and clean
public APIs, or to say it with other words: There is no private API magic hidden somewhere. So lets look at
two ways on how to extend kubernetes.

Possible ways to go forward:
- Adding a scheduler extender
- Creating an operator/controller

There are more ways to extend kubernetes, but these two ways will be the one we shall look at. Just for completeness
you can as well also add another scheduler or change kubernetes itself. However these possibilities have some serious
downsides.

### Adding a scheduler extender
The kubernetes scheduler checks for certain requirements before it schedules a pod onto a node. Some of these requirements
are hard requirements, like cpu, memory and number of pods. Other requirements are more soft, like if the pods are allowed to
be packed together or in which AZ they are gonna run. All of those requirements are collected and points given to each
node on how good they meet the requirements. The Node that fits best, gets chosen.

All of that are things the scheduler will do for you automatically, however it is also possible to give the cluster a 
`KubeSchedulerConfiguration` object that will tell the scheduler to also reach out to a service for additional point scoring.
The SchedulerConfiguration is a JSON file and for further explanations, please have a look at this 
excellent [blog post](https://developer.ibm.com/articles/creating-a-custom-kube-scheduler/).

In our case, we could have written a service that checks which IP Addresses are assigned to the Nodes and moved the Pods
onto those nodes. This would have required us to make sure that those Nodes had all needed IP-Addresses all the time.
That sounded not very enticing when doing cluster upgrades as it would have needed to be at least a semi-manual process.
So we decided against this approach.

### Creating an operator
An Operator/Controller on the other hand is a component observing resources and then try to create the described resources.
The difference between a controller and an operator is basically that an operator is handling the lifecycle of an
application, whereas a controller may control a specific resource that is not associated with a specific application.
They both use the controller pattern though and both can be implemented with the same toolset, so for simplicity sake in the
context of this article, we will consider them to be equal.

Operators usually consists at least out of a CRD(CustomResourceDefinition), an Event Listener and a Reconciliation Loop.
The CRD defines the object that shall be created, e.g. a Redis deployment. The whole description on what this deployment
needs to look like and all its abilities need to be defined in the CRD. The Operator will create an Event Listener for that
CRD as the primary resource and additional event listeners for the secondary resource (most likely pods in this example).
The Event Listener will let the Reconciliation Loop know once a CRUD operation has been requested on either the primary or
secondary resource. The Loop will then try to bring the CRD into the desired state, depending on what operation has been
requested. So in the Redis example it will either create the pods, update the pods, in the case of an upgrade it might blue/green
the pods or delete the pods. Basically things a human operator would do in this case, just in programmatic form, taking it
from a declarative form into existing resources.

As our initial problem was making services available on static IP addresses, we chose to explore this approach further, 
basically attaching additional IP addresses to the nodes running specific Pods.

## Building an Operator/Controller
For building an operator, there are several frameworks out there, but we will only look at the [operator-framework](https://github.com/operator-framework/operator-sdk) in
this article.

### Operator-SDK
The Operator framework is a project that is designed to help you get started on creating an operator. To achieve that,
it will generate quite a bit of boilerplate.

The Operator-SDK supports three different models of creating an operator:
- Helm
- Ansible
- Golang

Depending on your choice of tool, you will be able to integrate deeper into Kubernetes or not.

![operator-sdk-capabilites](/img/blog/operator/operator-capability-level.png "Operator sdk capabilities (Taken from the operator-sdk repo)")
*[Operator sdk capabilities][1]*

As we didn't want to be limited by our choice later on and wanted to expose metrics from our operator, we chose to
implement our operator in golang. We will be using the operator-sdk in the version 0.12 for this.

### What we want to do
Looking at the problem again, we need some way to make sure that a node that runs a specific pod, needs to
have an IP address attached to it. This IP address will be given to connecting parties as a entry point to our 
system and thus cannot change.

Features it needs to support
- Reserve IP Address from Range
- Attach IP Address to node running pod
- Detach IP Address from node that is not running pod
- Move IP Addresses around in case of node failure

This feature list already shows some things we will not and most likely cannot support. For example autoscaling of 
replica sets will not work as an IP address is bound to a node with an assigned pod. There is
a 1-1 association here. However it is still possible to use the self-healing features of Deployments
in this case.

When thinking about modelling this behaviour, we basically decided on the following approach:
- Create a IP kind (for reserving the IP Address in the Range)
- Use Annotations to attach the IP Address to a pod

We also thought about creating StaticIPDeployment kind, but at the end decided against it, as
we feared that the lifecycle management would be way more complicated if we needed to manage a Deployment
instead of just controlling the assignment of an IP Address.

After all this is the first Operator we are going to write and didnt want to drown in complexity from day one.
We would rather iterate and scrap everything after we tried it, then going too complex from the start.


### Implementation

The first thing you do when starting off a new operator, is that you initialize the directory of your
operator with the following command:

```
operator-sdk new app-operator --repo <YOURREPO>
```

This will create some boilerplate folders and files for you and will look roughly like this:
![operator-fs-structure](img/blog/operator/operator-structure.png)

The next thing you might want to do is then add the boilerplate for a CRD and a Controller:

```
operator-sdk add api --api-version=ip.wgtwo.com/v1alpha1 --kind=IP
operator-sdk add controller --api-version=ip.wgtwo.com/v1alpha1 --kind=IP
```

After creating the boilerplate, your folder structure will look a lot like this:
![operator-fs-structure-expanded](img/blog/operator/operator-structure-expanded.png)

The most important files right now are in:
- cmd/manager/main.go (the main program that will run in the cluster)
- pkg/apis/ip/v1alpha1/ip_types.go (definition of the CRD)
- pkg/controller/ip_controller.go (event listener and reconciliation loop)

#### Creating the CRD

To start off, we define how our CRD should look like to be able to manage our IP Address. We do this,
by creating structs in go that have all the fields our CRD shall have. This includes metadata, a Spec and
Status fields.

There is also a bit of operator-sdk specific code we need to add. This is so that the sdk can generate the
openapi spec and other boilerplate code.

```
// +k8s:openapi-gen=true
// +kubebuilder:subresource:status
// +kubebuilder:resource:path=ips,scope=Cluster
type IP struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   IPSpec   `json:"spec,omitempty"`
	Status IPStatus `json:"status,omitempty"`
}
```

The Spec needs to contain all information the Controller needs to create the resource.
The Status part needs to contain all the bookkeeping information the Controller needs to work. In a way the
status fields are used as a database for operating kubernetes (yes, this is oversimplified).

```
// +k8s:openapi-gen=true
type IPSpec struct {
	Address string `json:"address"`
	Reassign bool `json:"reassign,omitempty"`
}

// IPStatus defines the observed state of IP
// +k8s:openapi-gen=true
type IPStatus struct {
	Assigned bool   `json:"assigned"`
	Claimed  bool   `json:"claimed"`
	Node     string `json:"node,omitempty"`
	Pod      string `json:"pod,omitempty"`
	Original IPSpec `json:"original,omitempty"`
}
```

As you can see our new IP Resource type, as defined by the CRD that we are gonna create from these structs, is
going to have two fields: "Address" and "Reassign"
The corresponding Status part of the resource, has a lot more fields, which we are using for bookkeeping.

After we have created those structs and know how the CRD needs to look like, we actually autogenerate the CRD yaml:
```
operator-sdk generate k8s
operator-sdk generate openapi
```
NB: This changed since operator-sdk 0.15

#### Creating the controller




## Resources / Further Reading

- Programming Kubernetes by Stefan Schimanski and Michael Hausenblas
- [Creating a custom kube-scheduler](https://developer.ibm.com/articles/creating-a-custom-kube-scheduler/)
- [Operator SDK](https://github.com/operator-framework/operator-sdk)

[1]: https://github.com/operator-framework/operator-sdk/blob/master/README.md