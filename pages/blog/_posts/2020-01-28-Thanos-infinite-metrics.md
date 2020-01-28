---
layout: blogpost
permalink: /blog/metrics-unlimited-thanos/
title: "Towards Observability nirvana: Infinite metric retention with Thanos"
date: 2020-01-28
tags: infrastructure observability prometheus thanos kubernetes
author: <a href="https://www.linkedin.com/in/hihrig/">Holger Ihrig</a>
---
In nowadays DevOps world our industry is relying on the ability to observe and monitorize our infrastructure and 
services quite a bit. Working Group Two is no exception at this and as we are operating in the TelCo space
we wanted to know more about the usage patterns of our platform throughout days, months and even years.

Internally we have been running Prometheus for a long time with a fairly limited retention of 30 days. This did not
allow us to look back far enough to make the observations we wanted to.
Luckily for us there already was a solution out there that would fill our needs and in addition to that make our
monitoring stack more resilient. The solution is called [Thanos](https://thanos.io/).

## Thanos
Thanos was originally developed by a company called [Improbable](https://improbable.io/) to achieve long term storage
for Prometheus. It evolved into a much more complicated component wildly improving the scalability of the
Prometheus monitoring Stack.

The basic functionality however is that Thanos will upload the metrics collected by Prometheus onto any service with a 
S3-compatible API or any other Storage Target supported by the Prometheus Remote Write feature. For readability we
will only refer to it as S3 Storage as this is our storage target.

We shall briefly look at all those components before describing how we are leveraging Thanos to obtain a higher metric 
retention and higher reliability.

### Thanos Sidecar
The Sidecar runs as the name suggests in the same Pod as Prometheus and observes when Prometheus stores new storage
buckets on disk, which it does about every 2 hours. If configured to do so, it will upload those storage bucket into S3.
Another important feature however is that it extends the Prometheus Pod with an API that can be used by Thanos Querier
as a Store API endpoint to query Prometheus metrics.

### Thanos Store
Thanos Store implements the Thanos Store API and makes the metric data stored in the S3 bucket available to the
Thanos Querier. To do that it observes the configured S3 Bucket and reads the Metadata of the stored storage buckets
available in S3.

### Thanos Querier
Querier implements the Prometheus Query API and understands PromQL. It then sends the query using the aforementioned
Store API to all known Thanos Stores (discovered using service discovery) and awaits the metric information from the
stores, be it directly from Prometheus via the Sidecar or metrics stored in S3 Object storage via Thanos Store.

### Thanos Compactor
It does not make a lot of sense to keep old metrics that are scraped every 15 or 30 seconds forever. At one point those 
metrics would no longer be useful to make sense of your metrics. This is where
the Thanos Compactor comes in. It creates aggregates of old metrics based on rules. It will for example
aggregate metrics that are older than 30 days into 5 minute chunks. This saves resources and still gives you
almost the same accuracy when looking at longer timespans. After those metrics have been aggregated, they are
written back into the S3 bucket and the metadata gets updated.

### Thanos Ruler
The Ruler component is the Thanos equivalent of Recording Rules. It can look at all Store APIs and generate new metrics
according to the Recording Rules fed into the Ruler component. However since this rule processing is not done against a 
local datastore, it is possible that these new metric datapoints will not always be generated as it relies on a reliable
data source to do this in the required intervals.

## Architecture in a Cluster

![Thanos Architecture](/img/blog/thanos/thanos_architecture.png)

As we can see, there are quite a few things going on in this architectural view of the system, but on the other hand it
is fairly simple to understand as the component are nicely decoupled from each other.

An interesting thing here is that the drawing has multiple Prometheus instances with multiple Sidecars. Thanos actually
allows for deduplication of Timeseries Data. The data uploaded from the sidecars have information from which prometheus
instance the metrics are generated and adds that. The Querier can then deduplicate this data so that the metrics shown
in Grafana are consistent and do not come sometimes from Prometheus A and sometimes from Prometheus B.

This design also allows for an interesting other Use Case: Querying multiple Clusters. As
long as the storage location used by the Sidecars for uploading the metrics is identical, the Time Series data is
available to the Thanos Store and therefor the Querier and Grafana.
That even allows to run Grafana, Querier and Store in a completely different part of the world if need be.

## Is it worth it?

### Pros
- Highly Available Prometheus
- Increased Reliability (Decoupled query component)
- Infinite Metric Storage
- Query Multiple clusters from a single point
- Easy to Scale

### Cons
- More complex architecture
- Increased Resource usage

## Summary

Even though Thanos comes with an increased architectural and operational complexity, we have to say after running
with it for a while that it is totally worth it. We can make architecture decisions by looking further
back in time than before. It also has the additional Advantage that a misconfiguration of a Prometheus Deployment
does not pull down the whole stack as the Prometheus is HA and only updates one at a time. If the deployment fails, 
we can get notified and the deployment can be aborted. Also upgrades of the whole monitoring stack, can
now be done more gradual, which is also a great advantage for us!