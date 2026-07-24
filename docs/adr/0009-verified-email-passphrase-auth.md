# ADR 0009: Verified Email and Password Authentication

Status: Accepted

Date: 2026-07-23

Decision owner: Melissa

Severity: RED

## Context

The invite-only pilot needs secure cross-device sign-in and account recovery.
Verified email and hidden internal account ownership were already accepted, but
the exact authentication provider, permanent credential, recovery mechanism,
and permitted email purposes remained open.

Melissa explicitly selected conventional verified-email-and-password
authentication instead of passwordless email codes.

## Decision

- Use Supabase Auth for player authentication.
- Create accounts only through an approved invitation associated with one
  normalized, verified email address.
- Use the verified email as the sign-in identifier.
- Require a user-created permanent password; encourage a long passphrase.
- Require at least 15 characters for a single-factor password.
- Permit at least 64 characters, spaces, password-manager generation, and
  paste, subject to provider capability.
- Do not impose arbitrary uppercase, lowercase, digit, or symbol composition
  rules.
- Reject known-compromised or extremely common passwords when supported.
- Do not require routine periodic password changes; require a change when
  compromise is suspected.
- Use email-based password recovery.
- Permit email use only for pilot invitations, account verification, sign-in
  identification, password recovery, important account-security notices, and
  duplicate-account control.
- Prohibit advertising, marketing, sale, institutional authentication, and
  research use of email.
- Keep campaigns, gameplay, and learning data owned by a hidden internal
  account ID rather than email.
- Keep the chosen display name separate from both email and the internal ID.
- Use generic authentication errors, rate limits, and progressive delays.
- Provide sign-out and revocable trusted-device sessions. Exact session
  lifetime remains a later security-configuration decision.
- Do not accept a permanent four-letter/four-digit credential.

Administrator MFA and the separate administrator security architecture remain
subject to the administrator-protection decision.

## Player notice

Before account creation, communicate in plain language:

> Your email is used only for your pilot invitation, account verification,
> sign-in, password recovery, important account-security notices, and helping
> prevent duplicate pilot accounts. It will not be used for advertising or
> marketing.

The final notice must also state approved retention and deletion behavior.

## Benefits

- The mechanism is familiar and directly supported by Supabase Auth.
- Testers do not depend on email delivery for every ordinary sign-in.
- Password managers can create and store a strong password across devices.
- Email recovery supports a small pilot without custom credential recovery.
- Hidden internal ownership IDs preserve a future authentication migration
  path.

## Risks and limitations

- Testers may forget, reuse, or expose their password.
- Password recovery depends on transactional-email delivery.
- Email is personally identifiable information and has an expanded permitted
  purpose.
- An attacker who controls both a tester's email and password can access the
  account.
- Email uniqueness cannot prove one account per human.
- Session lifetime, authentication-email provider, retention, deletion, and
  support verification still require approval before the hosted pilot.

## Alternatives considered

1. Passwordless sign-in using short-lived emailed codes.
2. A separate issued pseudonymous username and high-entropy secret following
   one-time email verification.

## Cost and maintenance

Supabase Auth should be included within the expected pilot database plan at the
anticipated tester count. A production-capable transactional-email provider
may add a small recurring cost.

Maintenance is moderate and includes invitation controls, password and recovery
configuration, email delivery, rate limits, session revocation, support, and
security testing.

## Cost of changing later

Expensive. Changing provider or identity method would require account linking,
tester re-verification, session and recovery replacement, permission testing,
privacy-notice changes, and careful preservation of campaign ownership.

## Terminology clarification and owner reconfirmation

This ADR originally used **passphrase** to describe the long password entered
into Supabase Auth. It did not select a separate or custom authentication
mechanism. On 2026-07-24, the owner explicitly reconfirmed conventional
email-and-password authentication with normal secure email verification and
password recovery, and rejected replacing it with pseudonymous credentials.

The current implementation direction therefore remains Supabase Auth with
verified email, a conventional user-created password, and email-based recovery.
Calling a long password a "passphrase" is password-strength guidance only.
