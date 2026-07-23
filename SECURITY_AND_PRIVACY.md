# Security and Privacy Proposal

Status: Accepted boundaries plus unapproved implementation details.

Last updated: 2026-07-23

## Accepted privacy boundaries

- No PHI or real patient records
- No advertising
- No sale or marketing use of data
- No third-party behavioral tracking
- No gameplay telemetry
- No detailed clinical-answer research collection
- No human-subjects research during the initial pilot
- Optional manual feedback only
- Essential security and error logging only, with a defined retention period
- Research functionality disabled by default

## Pilot account information

Accepted account direction:

- Invite-only access
- Verified email
- Chosen display name
- One confirmed learning timezone
- Hidden internal account ID
- Cloud saves across devices
- No institutional login requirement
- MFA for administrators
- Authentication data separated from gameplay and learning records

### Player notice

Before account creation, plain language should explain:

> Your email is used only for your pilot invitation, account verification,
> sign-in, password recovery, important account-security notices, and helping
> prevent duplicate pilot accounts. It will not be used for advertising or
> marketing.

Melissa approved these email purposes by selecting verified-email and passphrase
authentication. Final notice wording must also identify retention and deletion
behavior before the pilot begins.

Email can enforce one account per normalized address or single-use invitation, but it cannot prove one account per human. The system must not make a stronger promise.

## Accepted player authentication

The accepted player mechanism is:

- A single-use invitation linked to one verified email
- Supabase Auth
- Verified email as the sign-in identifier
- A user-created permanent passphrase
- At least 15 characters for a single-factor passphrase
- Support for long passphrases, spaces, password managers, and paste
- No arbitrary uppercase, number, or symbol composition rules
- Rejection of known-compromised or extremely common values when supported
- No routine expiration; require a change when compromise is suspected
- Long-lived but revocable sessions on trusted personal devices
- Clear sign-out and device/session revocation controls
- Email-based password recovery
- Generic login errors that do not reveal whether an email is registered
- Rate limiting and progressive delays

A short four-letter/four-digit secret is prohibited as a standalone internet
password. Exact session lifetime remains open.

## Data separation

Authentication records map email to an internal account ID. Player-facing systems use only the internal ID.

The learning timezone is a required gameplay preference, not authentication or
research data. It is used to calculate mastery dates and same-date educational
limits. Historical reviews preserve the timezone and date actually applied;
future preference changes do not rewrite learning history.

Recommended permission boundaries:

- Authentication service can resolve identity.
- Player runtime can access only the signed-in player's campaigns.
- Clinical authors cannot browse player emails by default.
- Gameplay/support tools do not display email unless required for an account-support action.
- Published content contains no player identity.
- Administrator publishing credentials cannot be used from the player application.

## Administrator security

- Individual administrator accounts; no shared credentials
- Supabase Auth with TOTP MFA required
- Melissa-only clinical approval permission
- Melissa-only pilot authority for clinical withdrawal, evidence-validity
  classification, correction approval, and reactivation
- Least-privilege editor and balance roles
- Local-only administrator application during the vertical slice
- Separate protected administrator deployment behind an outer access gate
  before a hosted pilot
- Server-side publishing actions
- Audit records for approval, publishing, rollback, role changes, and emergency withdrawal
- Secrets in managed secret storage, never source files
- Recovery factors stored separately from primary MFA
- Permission tests that prove player accounts and lower-privilege roles cannot
  perform protected actions

This accepted security architecture is recorded in
[ADR 0010](docs/adr/0010-staged-admin-security.md). Exact access-gate provider,
administrator session lifetime, and incident-response procedures remain open.

Withdrawal directives, review-validity annotations, learning-state repairs,
availability waivers, and targeted player correction notices are permitted
operational clinical-safety records. They must be access-controlled, limited to
affected items and accounts, retained with the underlying immutable evidence,
and excluded from research or behavioral-analytics exports.

## Accepted AI-authoring boundary; provider unapproved

AI assistance is limited to the protected administrator authoring workflow.
The live player application sends no clinical prompt to an AI provider and
receives no invented runtime clinical material.

Before any provider is connected, Melissa must approve:

- Owner-controlled provider account, billing, and API-secret storage
- Exact source and draft fields permitted to leave the system
- Provider retention, training-use, and deletion terms
- Copyright and licensed-source handling
- No-PHI checks and incident response
- Model and prompt-version provenance
- Cost limits and failure behavior

AI output can create only a Draft revision. It has no clinical-approval,
publishing, withdrawal, correction, or administrator-role authority.

## Pilot gameplay-integrity boundary

The active browser computes ordinary facility progress during the private
pilot. The server still enforces identity, campaign ownership, one active
writer, save revisions, protected publications, administrator permissions,
clinical withdrawals, and cross-account isolation.

A determined player could manipulate their own browser-computed facility state.
The pilot therefore must not describe its facility results as tamper-resistant
and must not use them for leaderboards, prizes, assessment, credentialing, or
research-quality outcome measurement. Any such use requires a new RED
architecture and privacy/research review. This limitation does not permit
secrets, administrative authority, or access to another player's records in the
browser.

## Security and error logging

Permitted logs should be restricted to what is needed to detect abuse, diagnose failures, and restore service. Potential fields require review but may include timestamp, internal account ID, action category, success/failure, application version, and sanitized error code.

Logs must not include:

- Clinical question text or answer details unless temporarily necessary to diagnose a specifically approved defect
- Free-text clinical drafts
- Authentication secrets
- Full session tokens
- PHI
- Hidden behavioral analytics derived from security events

Retention duration, IP-address handling, and deletion procedures remain open decisions.

## Research boundary

The architecture may remain capable of adding a separately approved research module later, but no research events, exports, dashboards, consent claims, or dormant collection should be enabled now.

Before future research collection:

1. Define the exact question and fields.
2. Determine institutional and IRB requirements.
3. Approve consent language.
4. Approve retention, access, and deletion.
5. Separate research data from operational systems.
6. Verify that nonparticipants are not silently included.

## Open privacy/security decisions

- Session duration and trusted-device behavior
- Account deletion workflow and backup expiry
- Transactional authentication-email provider
- Security-log fields and retention
- IP-address handling
- Manual-feedback location and retention
- Administrator outer access-gate provider
- Incident-response contacts and procedure

## Current security references

- [NIST SP 800-63B authentication guidance](https://pages.nist.gov/800-63-4/sp800-63b.html)
- [NIST password guidance](https://pages.nist.gov/800-63-4/sp800-63b/passwords/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Supabase passwordless email documentation](https://supabase.com/docs/guides/auth/auth-email-passwordless)

These sources support long passphrases rather than arbitrary complexity rules, rate limiting, generic authentication errors, and one-time email links as a possible low-friction mechanism. Provider selection remains unapproved.
