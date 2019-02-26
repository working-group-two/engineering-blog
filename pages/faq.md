---
layout: default
title: Frequently asked questions
permalink: /faq
---

{% include section-image.html img="faq.jpg" heading="FAQ" %}

Operators usually have a lot of questions when they hear about our platform.
We've collected the most frequent ones here, please read through them if you're interested in contacting us.

---

<ul id="faq-acc" uk-accordion class="uk-accordion">

    {% include accordion-item.html title="What other partnerships do I need to put in place to work with you?" text="
        It depends on who you are. If you are a MNO, you mainly need to give access to the host radio network,
        and we can reuse SIMs, roaming agreements etc. This depends somewhat on the setup, but in general this is true.
        If you are a MVNO, the most important partnership you put in place is the access to radio network wholesale capacity.
        In addition you will need national and international interconnect agreements, roaming agreements, a BSS partner, a SIM vendor,
        potentially a number portability partner and a few more. We have partners that can assist you with these products and services.
    "%}

    {% include accordion-item.html title="Can I scrap my existing core network? " text="
        We are building a core network for the future, among other things that means that we don't bring every
        single legacy feature with us. In other words, if you are an existing MNO with legacy infrastructure
        you can probably not scrap your existing core network immediately, but set up our core network in
        parallel with your existing one, and migrate over time. Furthermore, we do not currently have nodes
        such as the SGSN/S-GW, VLR, MSC and MME in-house. These are possible to partner for,
        and it is likely we will develop these nodes as we go along.
    "%}

    {% include accordion-item.html title="What 'Gs' do you support?" text="
        We support all the Gs, also future ones. This includes 2G, 3G, 4G and eventually 5G.
        We are currently in final phases of developing VoLTE/VoWiFi. We also support VoIP through WebRTC protocols
        as an integrated part of the platform. We also offer some aspects of 5G through being able to
        run separate tenancies of the core network. We will continuously build and improve our network.
        Our approach is more about solving use-cases supported by the radio network as opposed to 'jumping Gs'.
    "%}

    {% include accordion-item.html title="What functionality does your network support?" text="
        We deliver user databases, voice, messaging and Internet connectivity from the core network.
        In telco terms we have the HLR/HSS, SMSC, MMSC, G-MSC and PGW.
    "%}

    {% include accordion-item.html title="What is the business model?" text="
        We charge an affordable start-up and integration fee. We then charge a fee per active user,
        as well as a revenue share on services that are monetised on top of the platform
        (or a potential cost for use of APIs to ensure that APIs are seen as valuable).
    "%}

    {% include accordion-item.html title="Can you really run telco out of the public cloud? " text="
        We know it is untraditional to run telco out of public cloud. However, we believe the 'Internet scale'
        services of the world are building infrastructure with tools and philosophies that over time will
        become more reliable and flexible than what an individual operator will be able to do.
        We are using these tools to enable us to be more flexible,
        effective and efficient than what would otherwise have been possible.
    "%}

    {% include accordion-item.html title="What about data transfer, GDPR and national data laws?" text="
        We comply with GDPR regulations. Depending on where customers are located, what data centres are
        available and the status of national regulations we believe we can comply with the demands of most potential customers.
        In countries where security law demands that data is not transferred across borders,
        we depend on our partners having operational data centres within the boarders of
        that country (and/or use alternative anonymization techniques).
    "%}

    {% include accordion-item.html title="How long does it take to get started? " text="
        This really depends. Theoretically, in a country already set up and with partners integrated, minutes.
        More realistically and practically, a few months.
        The timeline will be driven by your own readiness, the number of new integrations and the complexity of integrations.
        As a rule of thumb, we would estimate 3-6 months.
    "%}

    {% include accordion-item.html title="Does this cross-network thing really work? " text="
        We run a uniform code based deployed from public cloud. So yes, it works.
        When we publish APIs we will ensure they are based on a consistent infrastructure and code base,
        allowing developers to make things once, and only once.
    "%}

    {% include accordion-item.html title="You talk about a product eco-system, what do you mean?" text="
        We want to replicate the dynamics of app stores from the smartphone world in the world of mobile networks.
        Our ambition is to abstract the complexity of the underlying hardware (radio networks)
        by creating a uniform software layer (the core network) that works across many networks,
        open up the network level functionality and together with partners create a rich suite of
        products and services for consumers and businesses. We plan to create monetisation mechanisms
        and systems for how end-users can activate services.
        We are on our way to building great APIs with great documentation and support.
    "%}

</ul>

{% include accordion-stats.html %}
