---
layout: default
title: Our product
permalink: /our-product
---

{% include section-image.html img="our-product.jpg" heading="Our product" %}

Our primary customers are mobile operators.
Our mission is to improve the user experience of their subscribers,
as well as making it more affordable and easier to run a core network for the operator.
Our platform includes the functionality of
the <b uk-tooltip="title: Home Location Register/Home Subscriber Server">HLR/HSS</b>,
the <b uk-tooltip="title: Mobile Switching Center">G-MSC</b>,
the <b uk-tooltip="title: IP Multimedia Subsystem">IMS stack</b>,
the <b uk-tooltip="title: Short Message Service Center">SMSC</b>
and <b uk-tooltip="title: Multimedia Service Center">MMSC</b>, and
the <b uk-tooltip="title: Package Data Network Gateway">PGW</b>.

## Multi-tenant / sliced
Our core network is deployed in multi-tenant mode. Once integrated into a host network, new logical slices can be spun up to serve specific purposes. The network can also be deployed consistently across networks, countries and operators.

## Advanced services
The IMS stack including VoLTE/VoWiFi, entitlement servers, call forking, home routing of SMS and more are all part of the service, and constantly expanding.

## Aggregated benefits
As we operate our network as-a-service, we run a consistent code-base across networks. As we make improvements for one operator, this improvement propagates to other operators on the platform. In this way we generate strong platform effects for all our customers. We are convinced that many of these incremental effects will create strong differentiation over time.

## Continuously improving
We operate in a DevOps model, and the network is constantly improving for our customers.

As part of our contract we commit to developing the next “G”.
In other words, you don’t have to ask for next generation technology, it is part of the package.

We are constantly evolving our infrastructure. We improve security,
add redundancy and improve the resilience of our network every day.

Access to constant stream of innovation
As we are building the foundation for a marketplace for product and service innovation.
As this evolves, operators on our platform will get access to new products and services
available to them and their end-users, without operators having to develop or integrate these themselves.

## BSS
We have one central API for provisioning and billing related functionality.
We don’t provide BSS functionality ourselves, but we can offer pre-integrated BSS
functionality via partners. Using a pre-integrated partner can reduce cost and complexity,
and improve time-to-market.

## Our operators

<div uk-grid class="ui-grid uk-grid-match uk-grid-small">

    {% include operator.html img="vimla.png" url="https://vimla.se" description="
        We started porting Vimla subscribers to our platform in the fall of 2018.
        We aim to have hundreds of thousands of Vimla subscribers on the platform by the end of 2019.
    "%}

    {% include operator.html img="erate.png" url="https://erate.no" description="
        eRate provides a platform for multiple operators. We started integrating with them in 2019, and
        we will start onboarding their first operators shortly.
    "%}

</div>


## Integrating with us

We work with our customers to select and integrate with the host mobile network,
as well as interconnectivity, connectivity, roaming, billing and other partners.
We deliver the mobile core network as-a-service,
and integrate with partners for the remaining services.
The core network is deployed multi-tenancy from the public cloud.
We will usually deploy the packet gateway locally.

We do not own the end-users, and we do not handle the wholesale capacity agreements.

## Watch a short video explaining the concept

<div class="video-border">
    <video id="concept-video" controls poster="/img/video-poster.jpg">
    <source src="/video/promo.mp4" type="video/mp4">
        Your browser does not support HTML5 video players.
    </video>
</div>

{% include video-stats.html %}

If this video left you with a lot of questions, please head over to our [FAQ page](/faq).
