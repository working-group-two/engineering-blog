# Secrets Management: updates and a FIXIT!

Due to requirements and feedback we received from Amazon during a recent review to become an AWS Technical Partner, we are changing how we store and use secrets during our deployment process.   This post describes the differences between the old and new process and outlines what we need to do to become compliant with Amazon's requirements.

Secrets are bits of data that we use to share information between two entities.  These bits of information are generally essential and should not be accessible to third parties.   The most common types of secrets that we use are passwords and encryption certificates.  

```text
                                       ┌───────────────────┐
┌───────────────────┐        ┌────────▶│Infra account      │
│s3://swt-secrets/  │        │         └───────────────────┘
│├── infra/         │        │         ┌───────────────────┐
│├── prod/          │◀───────┼────────▶│Production account │
│├── staging/       │        │         └───────────────────┘
│└── test/          │        │         ┌───────────────────┐
└───────────────────┘        ├────────▶│Staging account    │
                             │         └───────────────────┘
                             │         ┌───────────────────┐
                             └────────▶│Test account       │
                                       └───────────────────┘
```

At present we use an S3 bucket to store these secrets, and this bucket is accessible to all of our accounts.   We use AWS identity and access management (IAM) policies to limit the scope of access to this bucket.  However, there have been many security incidents around accidental exposure of S3 buckets,  and Amazon forbids the use of S3 for critical secret data (particularly database passwords).

To that end, we have migrated secrets from S3 to AWS Secrets Manager.  In practice, this is similar to the current S3-based workflow, with one caveat.    Due to IAM restrictions with the secrets manager, we will no longer support cross-account access to secrets.  These restrictions mean that secrets used by services in an account must be stored in the secrets manager service in that account.  If cross-account access is needed, we can address those concerns on an individual basis.

```text
┌────────────────────────────────────────────────┐
│AWS account         ┌────────────────────────┐  │
│                    │                        │  │
│                    │    Secrets Manager     │  │
│                    │        service         │  │
│                    │                        │  │
│                    └────────────────────────┘  │
│                                 ▲              │
│         ┌──────────────┬────────┴─────┐        │
│         │              │              │        │
│         ▼              ▼              ▼        │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐   │
│   │Service A │   │Service B │   │Service C │   │
│   └──────────┘   └──────────┘   └──────────┘   │
└────────────────────────────────────────────────┘
┌────────────────────────────────────────────────┐
│Other AWS account   ┌────────────────────────┐  │
│                    │                        │  │
│                    │    Secrets Manager     │  │
│                    │        service         │  │
│                    │                        │  │
│                    └────────────────────────┘  │
│                                 ▲              │
│         ┌──────────────┬────────┴─────┐        │
│         │              │              │        │
│         ▼              ▼              ▼        │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐   │
│   │Service D │   │Service E │   │Service F │   │
│   └──────────┘   └──────────┘   └──────────┘   │
└────────────────────────────────────────────────┘
```

## Using the Secrets Manager

Like everything in AWS, the Secrets Manager has an API.  Gunnar Inge introduced the Secret Replacer in a [blog post](https://wgtwo.slack.com/files/UA3H9283E/FFXGV3RTP/Secret_Replacer) several weeks ago and updated this tool to support AWS Secrets Manager in a recent [PR](https://github.com/omnicate/loltel/pull/3928).  This PR added a fourth secret source -- in addition to the old **s3**, **gopass** and **env** sources, you can now use an **awsSecret** source that reads the secret from the Secrets Manager service in the local account.

Reading secrets from Secrets Manager is quite straightforward for those that are using the Secret Replacer.    Simply change references in configuration files to use the new secret source.  Lines such as `{{ secret s3://ecs-generic/client-management/admins/smpp }}` should now look like `{{ secret awsSecret://ecs-generic/client-management/admins/smpp }}`, exchanging `s3://` for `awsSecret://`.

There are two options to create secrets.  The first is to use the AWS console and the second is to use the AWS CLI tool.    From the console, you can add, view, edit, delete and rotate secrets.  Note that rotation is beyond the scope of this post and is not enabled for any of our secrets yet.  The console only supports text-based secrets, so if you need to store binary secrets, then you need to use the CLI.

Some possibly-useful information is found in the AWS documentation:
* https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html
* https://docs.aws.amazon.com/cli/latest/reference/secretsmanager/index.html

## The FIXIT

To fully resolve the issue with Amazon, we need to stop using secrets in S3.  To do this, we must finish three main tasks:
1) update services to use Secrets Manager instead of S3
2) redeploy services 
3) remove secrets from and access to S3

The upcoming FIXIT addresses points one and two, and the infrastructure team will address point three after the FIXIT is complete and services no longer need access to the `swt-secrets` bucket.  

Gunnar Inge has put together a [PR](https://github.com/omnicate/loltel/pull/3986/files) to show how to do this using the Partner Console as an example.  

We will most likely run the FIXIT on Thursday the 7th of March.
 