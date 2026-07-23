# Security and Privacy Proposal

Status: Accepted boundaries plus unapproved implementation details.

Last updated: 2026-07-22

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
- Hidden internal account ID
- Cloud saves across devices
- No institutional login requirement
- MFA for administrators
- Authentication data separated from gameplay and learning records

### Player notice

Before account creation, plain language should explain:

> Your email is used only to verify your account and help prevent duplicate pilot accounts. It will not be used for advertising or marketing.

This wording is not final because Melissa has currently authorized email for verification and duplicate-account control, but has not separately decided whether recovery email is allowed. The final notice must state only the approved purposes and identify retention and deletion behavior before the pilot begins.

Email can enforce one account per normalized address or single-use invitation, but it cannot prove one account per human. The system must not make a stronger promise.

## Low-friction authentication proposal

The exact mechanism is still open. The recommended direction is:

- A single-use invitation linked to one verified email
- Either passwordless email sign-in or a user-created sufficiently strong passphrase, after the permitted use of email is clarified
- Long-lived but revocable sessions on trusted personal devices
- Clear sign-out and device/session revocation
- A separately approved recovery method
- Generic login errors that do not reveal whether an email is registered
- Rate limiting and progressive delays

A short four-letter/four-digit secret is not recommended as a standalone internet password. It is vulnerable to automated guessing unless combined with strict single-use behavior, aggressive rate limits, expiration, and another verified factor.

## Data separation

Authentication records map email to an internal account ID. Player-facing systems use only the internal ID.

Recommended permission boundaries:

- Authentication service can resolve identity.
- Player runtime can access only the signed-in player's campaigns.
- Clinical authors cannot browse player emails by default.
- Gameplay/support tools do not display email unless required for an account-support action.
- Published content contains no player identity.
- Administrator publishing credentials cannot be used from the player application.

## Administrator security

- Individual administrator accounts; no shared credentials
- MFA required
- Melissa-only clinical approval permission
- Least-privilege editor and balance roles
- Separate protected admin deployment
- Server-side publishing actions
- Audit records for approval, publishing, rollback, role changes, and emergency withdrawal
- Secrets in managed secret storage, never source files
- Recovery factors stored separately from primary MFA

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

- Passwordless link versus passphrase login, including whether email may be used after initial verification
- Authentication provider
- Session duration and trusted-device behavior
- Email recovery permission and account deletion workflow
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
