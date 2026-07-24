# ADR 0022: Staged Local-to-Private-Pilot Delivery

Status: Accepted

Date: 2026-07-23

Decision owner: Lead development agent under ADR 0021

Severity: RED

## Context

The project needs a playable result quickly, but hosting, authentication,
administrator security, cloud saves, backups, and deployment environments add
work that does not prove whether the combined clinical and management loop is
fun.

## Decision

Use this delivery sequence:

1. A local browser prototype with synthetic fixture content and no outside
   accounts or data collection.
2. A coherent local vertical slice that adds structured content, deterministic
   simulation, scheduling, and save/reopen behavior.
3. A staging environment for owner review.
4. An invite-only private browser pilot using the accepted Supabase backend.

The hosted pilot will keep staging and pilot data separate and deploy the
player and administrator applications separately. The lead agent will select a
standards-based static web host shortly before deployment using then-current
compatibility, cost, operational simplicity, and rollback support.

No public release, paid plan, billing, domain, external account creation, or
tester invitation is authorized by this decision. Those remain owner actions.

## Consequences

- Gameplay can be tested before cloud infrastructure is complete.
- The local prototype must keep content, balance, simulation, and presentation
  boundaries clean enough to connect to the accepted backend later.
- Authentication and true cross-device saving are demonstrated in the hosted
  slice, not faked in the earliest playable build.
- Exact hosting-provider selection remains a delegated just-in-time technical
  choice rather than an owner decision gate.

## Cost of changing later

Moderate. The standards-based web build and accepted backend reduce hosting
lock-in, but moving a live pilot still requires deployment, environment,
secret, domain, and restoration work.
