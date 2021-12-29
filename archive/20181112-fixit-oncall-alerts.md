# FIXIT: Let’s making alerting great again

## Background 

As of November 2018, WG2 has over 70+ on-call alerts. This alone is a great accomplishment as we have the ability to proactively fix connectivity issues in our services or network.

However, we found out that creating a good on-call alert can be tricker then expected. Many of our alerts were either incomplete with missing links to dashboards and playbooks, or playbooks were not specific to the alert. In turn, this made it challenging for an on-call engineer to properly investigate and escalate the problem. 

So how did we “fix” this problem? A FIXIT!

A FIXIT is a process where we all pull together to spend an afternoon to fix a simple and fundamental problem. 

## On-call alerts

Before we can fix a problem, we need to better understand what the problem is.  

There is a lot of information in the [Google SRE book](https://landing.google.com/sre/sre-book/chapters/monitoring-distributed-systems/) on the topic of monitoring. 

Summed up by @dape, these questions reflect a fundamental philosophy on pages and pagers:
* Every time the pager goes off, I should be able to react with a sense of urgency. I can only react with a sense of urgency a few times a day before I become fatigued.
* Every page should be actionable.
* Every page response should require intelligence. If a page merely merits a robotic response, it shouldn’t be a page.
* Pages should be about a novel problem or an event that hasn’t been seen before.

> So essentially, on-call alerts (pages) are **actionable** and should **require intelligence** - investigate then escalate.

## Playbooks
To help perform the investigation process, playbooks are used. A playbook for an OCE alert should follow these guidelines:

1. It should be actionable, i.e. it is clear what the OCE should do in order to:  
    a. Determine if the problem is real.  
    b. Escalate to the right party, or – failing to determine that – the alarm owner!   
2. It should aid the investigation:  
   a. Links to a dashboard where the problem is visible.  
   b. Pointers to related systems, and briefly describe their relationship.  
3. It should describe the potential consequence of the outage.

Now having the understanding of what makes a good on-call alert and how to write good playbooks, let’s fix it!

## So let’s make alerting great again! - FIXIT style

During our Friday afternoon FIXIT, we managed to address more then half of the current on-call alerts. With 13 PRs, we made changes to:
- Creating new playbooks with the purpose of aiding an investigation
- Updating old playbooks
- Downgrading on-call alerts to chat if they weren’t 
- Creating and adding links to dashboards

While there is still more work to be done, it is key that each team takes ownership over the on-call alerts related to their services. 

Special thanks for everyone that participated and helped try to make the alerts better!

Useful links:
- Fixit issue: https://github.com/omnicate/loltel/issues/2871
- List of on-call alerts and status: https://docs.google.com/spreadsheets/d/186_cslELmhw9ob2lUWOhnFkILH82zYCJpoApBn_yFb0/edit#gid=0 
