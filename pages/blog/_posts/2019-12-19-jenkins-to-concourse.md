---
layout: blogpost
permalink: /blog/replacing-jenkins-with-concourse/
title: "We killed the butler: Replacing Jenkins with Concourse"
date: 2019-12-19
tags: infrastructure cicd
author: <a href="https://www.linkedin.com/in/annaken">Anna Kennedy</a>
---

We decided to replace our [Jenkins](https://jenkins.io/) server some time ago for various reasons, but the main one being that the clicky-UI interface goes completely against the infrastructure-as-code principle that we try to adhere to.

![Jenkins](/img/blog/jenkins-to-concourse/jenkins.png)

Having to configure a service by navigating a web ui means that a service like Jenkins is difficult to maintain, redeploy, and upgrade. We try to do all of our infrastructure configuration via [gitops](https://www.gitops.tech/), and Jenkins has been a bad fit for us here.

We spent time investigating other options, and eventually settled on **[Concourse](https://concourse-ci.org/), a cloud-native CI/CD server where tasks are deployed in containers, and config is stored as yaml**.


## Infrastructure as code

We run Concourse in kubernetes, so the setup and configuration itself is all done with yaml files and kubectl. It's fast and easy to upgrade and redeploy.

Within Concourse, the pipeline configuration is entirely yaml-based; there are no buttons in the UI except for an abort/re-run button.

```
jobs:
- name: run-acceptance-tests-staging
  plan:
  - task: run-tests
    config:
      inputs:
      - name: monorepo
      run:
        path: /bin/bash -c runtests.sh
    on_failure:
      put: notify-slack-ci
```

![Concourse task](/img/blog/jenkins-to-concourse/concourse_task.png)

Pipelines are made up of jobs that run in series or parallel; jobs consist of tasks.
Pipelines, jobs and tasks are described in code and automatically visualised in the UI.
Changes to pipelines are applied by updating the yaml file and running Concourse's [fly cli](https://concourse-ci.org/fly.html) tool.

![Concourse pipeline](/img/blog/jenkins-to-concourse/concourse_pipeline.png)


## Containerised deployment

Concourse runs every job in its own container, which means that every job uses an entirely clean, reproducible environment. Any dependencies required for a task can be pre-installed in the image.

We use docker containers, and we also run Concourse itself as a container, which means a bit of docker-in-docker inception. This has gone surprisingly smoothly for us on the whole, the only drawback being that we have to run images in privileged mode, but in our self-managed kubernetes cluster this isn't an issue.

## Debugging

Since the tasks all run in containers, it's easy to debug issues locally by running the same image on the laptop. The fly intercept tool also allows us to log into a container currently running in concourse.

```
$ fly intercept -j ecs-services
1: build #27, step: monorepo, type: get
2: build #27, step: notify-slack-ci, type: get
3: build #27, step: notify-slack-ci, type: put
4: build #27, step: run-acceptance-tests-staging, type: task
choose a container: 4
root@02f69d15-b7be-4f2e-43f7-24f549071bb1:/tmp/build/3a58ea39#

```

## Resource types and pipelines

There are a large number of [resource types](https://github.com/concourse/concourse/wiki/Resource-Types) available for Concourse, making it pretty easy to configure pipelines.

Right now we have jobs like:

* run unit tests on each pull request
* build and run integration tests with bazel on every merge to the monorepo
* build container images and upload them to the registry
* scan all images for security flaws
* run acceptance tests in the staging environment
* sync secrets between different sources
* notify slack if changes are made in kubernetes

## Learning curve

The move from Jenkins to Concourse has overall been a very positive step for us. If there has been any drawback it's that implementing any brand new system usually means something of a learning curve, and Concourse is no exception.

The documentation has been a little sparse at times, but now that we have a number of pipelines up and running we're finding it easier and easier to add more. The clean UI and the ability to have the entire deployment in code are two of our favourite features.
