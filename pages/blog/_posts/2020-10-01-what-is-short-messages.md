---
layout: blogpost
permalink: /blog/what-is-a-short-message
title: What the f* is a short message?
date: 2020-10-01
tags: telco SIGTRAN SMS
author: <a href="https://www.linkedin.com/in/sebastian-weddmark-olsson/">Sebastian Weddmark Olsson</a>, Telco newb
---

There might be many things in this blog post that might not be
true. This is because of my knowledge of this stuff is limited.

I will try as best as I can to give an explanation of what happens
when you send an SMS from your phone.

Disclaimer: Telco stuff is hard.

Also disclaimer: this blog post will also contain alot of ackronyms,
after all, it is telco.

_Aaand down the rabbit hole we go..._

# Where to even start

In the *SS7* (telco/telecom/telecommunications) network there are many
different nodes (servers), with different kinds of tasks.

The group of protocols that are used to send signals between these
nodes is called *SIGTRAN*.

It is transported over *IP*/*SCTP* (Stream Control Transmission Protocol)
which is like a mix between *UDP* and *TCP*. It is supposed to be quicker
than *TCP*, but more reliable than *UDP*.

The signalling I'm going to talk about is the highest layer in the
*SIGTRAN* protocol stack, the *MAP* (Mobile Application Part) as well as
the *TCAP* (Transaction Capabilities Application Part). The protocol
layers between *SCTP* and *MAP* are *M3UA* (Message Transfer Part 3 User
Adaptation Layer) and *SCCP* (Signalling Connection Control Part) which
both handles handshaking, routing, and resilience.

The *MAP* layer is used when talking to some of the telco nodes such
as *HLR* (Home location registry), *VLR* (Visitor location registry),
*MSC* (Mobile switching center), *SGSN* (Serving *GPRS* [ackronym in
ackronyms; go telco!] support node) and the *SMSC* (Short message
service center).

# MAP versions and TCAP dialogues

There are three iterations of *MAP*, v1, v2, and v3, and all messages
almost always comes in pair, an acknowledgement for each sent message
(so called `Invoke` and `ReturnResult`).

To determine which version to use between two nodes, the sending node
tries to start the transaction (called a dialogue) by sending a *TCAP*
`Begin` message with the *MAP* message and it's highest compatible
version. If the receiving node cannot talk that version, it sends a
*TCAP* `Abort` message with it's highest compatible version. For v1 there
might not even be a reason, but the sending node might try to send the
*MAP* message as v1 anyway.

In my head it goes like this:

```
Node 1: "Hi, I want to talk to you about this in the latest version"
Node 2: "No I don't understand you, but we can talk about version 2 instead"
Node 1: "Ok, then I want to talk to you about this in version 2 instead"
Node 2: "Aah, now I see..."
```

Or maybe

```
Node 1: "Hi, I want to talk to you about this in the latest version"
Node 2: "No"
Node 1: "Ok, then I want to talk to you about this in version 1 instead"
Node 2: "Maybe I will talk to you, maybe I will not"
```

For *TCAP* dialogues there are (mainly) four message types.  `Begin`,
`Continue`, `End`, `Abort`. Each of the types have an ID (or two, as I
said, telco is complicated), a component and a dialogue part. The
component contains the *MAP* messages, and the dialogue part contains
the version negotiation, but it is only used in the first message from
both nodes for the version negotiation.

_I think this covers most of it, let's get back to the fun part._

# How does SMS work?

*SMS* was initally implemented because of the wish to send text
messages to pagers using the phoneline when it was not in use for
phonecalls. It was decided at a meeting in Oslo to be released to the
public when some French and German company understood it's
value. (Don't quote me on any of this).

When you send an *SMS*, a signal goes towards the *SMSC* node in your
current *SS7* network. This signal is in a form of a packet, and is
called `MO-Forward-SM`. It stands for "Mobile Originating Forward Short
Message" meaning it started from your (mobile-)phone.

The *SMSC* then takes your *SMS* and tries to find out where to send
it. For instance if the recipient's phone is on the same
operator/network or if it should route it to another operators
*SMSC*. When it is clear where it should be sent, it goes out as another
packet, a `MT-Forward-SM`. In this case *MT* stands for Mobile Terminated,
meaning it goes towards the recipients phone.

The similarities in *MO* and *MT* requests are that they both contain the
origin and destination addresses as well as the user data (your actual
text message), and a correlation id which is basically a mapping
between your sim-card and a temporary id and it is used for privacy
purposes; you might not want other networks and hackers to know about
who you are.

For *MT* requests there is also a flag which is called
`moreMessagesToSend` which is used if (god forbid) you would break the
protocol and send a text message longer than 115 bytes. The message is
then breaked up into chunks which starts with an empty *TCAP* `Begin`
message followed with the actual text message in `Continue`
messages. In the end (_hehe_) the `End` message is transmitted as a
response and the transaction is finished.

When one of these chunk (or the full message if lesser than 115 bytes)
is delivered to the recipient, a response is sent back with the
`MT-Forward-SM` containing a delivery status.

OR, in the case that you are sending an *SMS* to a recipient in another
network and the recipient is not available, it might contain the time
the receiving *SMSC* will hold the message and retry to send it to the
recipient.

_At least this is main idea I think..._

# Differences in MAP versions for SMS

The `moreMessagesToSend` flag was implemented for version 2, so it exist
only after version 1.

In version 1, the dialogue portion was not invented and all chunks are
sent in new *TCAP* dialogues. The size of the user data could then
be 140 bytes.

In version 1 and version 2 there is no difference between *MT* and
*MO*. Everything is sent as another type of message `Forward-SM`,
which does not include any privacy correlation ids, and there are no
fancy responses with delivery status. There is still an
acknowledgement, but is in a form of an empty message.

Ok, to recap, what do we have now

- `Begin`, `Continue`, `End`, `Abort` messages.
- Dialogue handshake in the first request/response messages sent.
- `MT-Forward-SM`, `MO-Forward-SM`, `Forward-SM`
- Mobile phones and *SMSCs*

_Let's talk a bit about the last item_

# Different SMSCs

So you are either on your home network or on a different (roaming)
network. If you are not on your operators network you are a visitor
and thus roaming. The same goes for the recipient of the *SMS*.

So the mobile originating message is sent to the *SMSC* in the network
you are in. That *SMSC* then sends a mobile terminating message to the
*SMSC* in the recipients network, which in turn sends a mobile
terminating message to the recipient.

# What about 4G/LTE networks?

_Ouch._

*LTE* networks does not use any of the *M3UA*, *SCCP*, *TCAP*, *MAP*
protocols. In *LTE* networks the main message type is Diameter which
doesn't contain fragmentation and can contain larger
messages. Everything is sent in one request and every request is
answered with a response.

To make *SMSes* work on *LTE* networks a new node was invented which
translates Diameter messages to *SIGTRAN* messages. This node sits in
between the *SMSC* and the other telco Diameter *LTE* nodes (now called
agents).

