---
layout: blogpost
permalink: /the-worst-message-in-telecom
title: The worst message in telecom (you won't believe)
date: 2022-01-16
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

The problem is with the implementation of the Ro interface where the
Credit-Control messages are on. Basically there are two standards for
Ro, the base Diameter Ro defined by RFC4006, as well as the 3GPP
(Telco) Ro defined by TS 32.299.

