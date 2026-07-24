# ADR 0002: Verified-Email Pilot Identity

Status: Accepted; authentication mechanism completed by ADR 0009

Date: 2026-07-22

Decision owner: Melissa

Severity: RED

## Context

The pilot needs secure cross-device accounts and duplicate-account controls. Melissa has accepted verified email rather than issued pseudonymous-only credentials, with a clear promise that email is not used for marketing.

## Decision

- Pilot access is invitation-only.
- A verified email supports account verification and duplicate-account controls.
- Gameplay, saves, and learning records reference a hidden internal account ID rather than using the email as their key.
- A chosen display name is separate from the email.
- The player is told that email is used for verification and helping prevent duplicate pilot accounts.
- Email is not used for advertising, marketing, sale, institutional authentication, or research.
- Administrators use MFA.

ADR 0009 later selected invite-only Supabase Auth with verified email and a
conventional permanent password, for which a long passphrase is encouraged.
Email use now includes invitations, sign-in
identification, password recovery, and important account-security notices in
addition to verification and duplicate-account control. Marketing remains
prohibited.

Email uniqueness prevents creating two accounts with the same normalized address, but it cannot prove that one person has only one account. Single-use invitations and administrative review provide the stronger pilot control.

## Benefits

- Familiar identity verification for cross-device access
- Easier revocation of a compromised pilot account
- No institutional identity provider is required

## Risks and limitations

- Email is personally identifiable information and creates privacy obligations.
- Email delivery can be delayed or filtered.
- A person can possess multiple addresses.
- Authentication data must remain separated from learning records and protected by strict permissions.

## Alternatives considered

1. Issued username and high-entropy secret with administrator-assisted recovery. This collects less personal information but is easier for testers to lose.
2. Institutional single sign-on. This simplifies institutional identity but increases integration, approval, and privacy burdens and is not desired for the pilot.

## Cost of changing later

Expensive after launch. Changing the identity anchor requires account linking, login/recovery changes, possible user re-verification, privacy-notice changes, and careful preservation of save ownership.

## Completion

See [ADR 0009](0009-verified-email-passphrase-auth.md) for the accepted
authentication provider, sign-in method, passphrase baseline, and expanded
email-purpose statement.
