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

One case for example is that we have to use static-IPs for some of our services to connect to
Telecom companies as they expect a single IP address to bind to. This address needs to be the same and
DNS records are not accepted either. We are running in AWS as well, so the reader might ask why we are not
using Elastic IPs and add them to the services? Good idea, but Telecom operators will not whitelist
an Elastic IP for you as there are no guarantees that it will belong to your Infrastructure forever.

We are a member of RIPE and do have a small subnet block for our own use, so we thought we could make use of 
that. As we own the block and AWS supports BYOIR (Bring your own IP-range), we created a special subnet with
some Kubernetes Nodes in it. This was not enough to make this work since we depended on a service always having
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


## Building an Operator/Controller




## Resources / Further Reading

- Programming Kubernetes by Stefan Schimanski and Michael Hausenblas
- [Creating a custom kube-scheduler](https://developer.ibm.com/articles/creating-a-custom-kube-scheduler/)