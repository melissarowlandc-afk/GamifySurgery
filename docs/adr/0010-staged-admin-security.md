# ADR 0010: Staged Administrator Security

Status: Accepted

Date: 2026-07-23

Decision owner: Melissa

Severity: RED

## Context

Administrator capabilities can edit draft clinical content and balance,
clinically approve material, publish releases, roll back release pointers,
withdraw incorrect content, change permissions, and assist accounts. The player
application must never expose these capabilities. Melissa needs a usable
administrator application without placing an unnecessary internet target
online during the vertical slice.

## Decision

- Build the administrator interface as a separate application and deployment
  from the player game.
- Keep the administrator application local-only during the vertical slice.
- Before a hosted pilot, deploy the administrator application privately behind
  a separate outer access gate.
- Use individual Supabase Auth administrator identities; never share
  credentials.
- Require TOTP authenticator-app MFA for every administrator.
- Use explicitly allowlisted, least-privilege roles.
- Reserve clinical approval authority to Melissa.
- Separate clinical editing, balance editing, technical administration, and
  player-support permissions even if one person initially holds several roles.
- Recheck identity, MFA assurance, and role authorization in trusted
  server-side functions for protected actions.
- Never treat a hidden route, disabled control, or client-side check as
  authorization.
- Require explicit confirmation and audit records for approval, publishing,
  rollback, emergency withdrawal, and role changes.
- Keep secrets in managed secret storage and outside source code and browser
  bundles.
- Store MFA recovery material offline and separately from the primary
  passphrase.
- Add automated permission tests for player and administrator roles.

The exact static host, outer access-gate provider, administrator session
lifetime, and incident-response process remain later deployment and security
decisions.

This decision does not authorize an internet deployment, external access-gate
account, or paid service.

## Benefits

- The vertical slice has no remotely reachable administrator target.
- The hosted pilot receives layered protection rather than relying on one
  password or an obscure address.
- Separate builds prevent administrator code and draft-loading behavior from
  shipping with the player application.
- Roles and server checks limit the consequences of a compromised lower-level
  account.
- Audit records make high-impact content and permission changes traceable.

## Risks and limitations

- MFA and the outer gate add setup and occasional login friction.
- Losing MFA and recovery materials requires a carefully verified recovery
  process.
- A second deployment and access provider require maintenance.
- Permission mistakes remain possible and require automated tests and review.
- The local-only phase depends on the approved development environment being
  available.

## Alternatives considered

1. Include administrator pages inside the player application.
2. Keep the administrator application local-only throughout the hosted pilot.

## Cost and maintenance

Static hosting, TOTP MFA, and a small-user outer access gate may fit free tiers
for the pilot, but prices and terms must be checked before deployment.

Maintenance is moderate and includes access reviews, MFA recovery, permission
tests, audit review, account removal, incident response, and deployment
updates.

## Cost of changing later

Expensive. Combining or separating applications later would affect builds,
deployments, authentication, roles, database policies, publishing functions,
audit records, tests, and incident response. Existing administrator accounts
could require migration or MFA re-enrollment.
