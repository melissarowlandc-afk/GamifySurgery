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

## Owner amendment (2026-10-14)

Melissa changed the minimum password length to **8 characters**, superseding
the original 15-character requirement. Supabase is configured to 8 and the
game's validation/help must match; longer passwords remain encouraged.

Beta 1 uses **no SMTP/email provider**. Melissa emails personal links from
Outlook. The sign-in screen directs forgotten-password requests to the person
who invited the player; it does not send a reset email. The late-evening
amendment below replaces the originally implemented provider invite/recovery
link mechanism. Invite-only membership and user-chosen passwords remain required.

## Owner amendment: personal setup links (2026-10-14, late evening)

Provider invite/recovery links can expire before a tester opens them, and email
security scanners can consume one-time provider tokens. The owner requires
links that **never expire until used or cancelled**. This supersedes provider
`generateLink` issuance and any instruction to increase email OTP expiry.

- The manager runs the local tool on the owner's PC. The owner supplies tester
  emails in chat and writes/sends the email. Successful tool output contains
  only a link; batch output contains `email<TAB>link` lines. No email template,
  automatic email, new SMTP provider or technical link handling by the owner.
- A cryptographically random 32-byte base64url code goes in the URL fragment,
  bound to one lowercase email. Only its SHA-256 hash is stored in private
  `setup_codes`; no code/password is persisted or logged. A new issue cancels
  prior codes for that email. Ten failed code attempts cancel the current code.
  Pending codes never expire; terminal records follow 90-day cleanup. Private
  email lists/links stay outside repository source and public artifacts.
- Opening a link only displays the shared setup form. The fragment is removed
  immediately, before Auth initialization/network activity, and the code remains
  in memory only. The email is read-only; the tester chooses and confirms an
  8–128-character password. No token is consumed by GET, preflight or page load.
- Explicit submission POSTs `{email, code, password}` to `claim-setup-link`.
  The single-file Dashboard Edge Function uses its built-in Supabase URL and
  service-role key, with JWT verification **off** because the tester is not yet
  signed in. Code possession is the credential. CORS permits only Pages and
  the canonical local/QA origins. The service role never enters the frontend.
- Service-only RPCs use a public invoker/private definer boundary, empty search
  paths, verified service-role claims and per-email locks. The function compares
  the hashes with a fixed-iteration comparison. A valid code is atomically
  consumed before the separate Auth admin operation, so only one claim wins.
  Failures afterward remain consumed; the manager reissues rather than replaying
  a potentially completed password change. Auth HTTP and SQL admission are
  separate transactions; cancellation cannot undo an already completed Auth call.
- Invite claims create/confirm an Auth identity with the tester's password, or
  complete a pending identity, then admit membership. The server writes the
  trusted `app_metadata.gamify_setup_admitted` marker; it does not invent a
  provider `invited_at`. Reset claims require an active membership. Finalization
  rechecks cancellation, bound identity, ban, revocation and deletion. Existing
  membership/notice/owner AAL2 checks and old provider invitations remain valid.
  New Auth identities carry a separate trusted `gamify_setup_pending` marker
  until finalization. That marker grants no client access; it lets a freshly
  issued invite recover an Auth creation whose admission failed. Finalization
  removes it. Confirmed unrelated identities cannot be invited over.
- Email possession is established by personal delivery to the known invitee and
  submission of that email-bound secret, rather than a second provider email.
  A forwarded/exposed link grants its holder that setup capability until use or
  cancellation; keep it private. Public provider sign-up stays off. Generic
  mismatch errors do not reveal whether an account exists; a used-link error
  requires a matching secret. On success the client signs in normally with the
  selected password and retains the existing account UUID/campaign ownership.

The manager must accept the new SQL and hosted create/reset/concurrency flow on
disposable identities and desktop/physical phone before real invites. Offline
tests are not provider acceptance. Local, private-phone and Pages origins retain
separate saves; these links do not provide Beta 2 cloud synchronization.
