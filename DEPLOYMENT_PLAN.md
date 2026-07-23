# Deployment Plan Proposal

Status: PROPOSED AND UNAPPROVED. No account, cloud resource, domain, or billing has been created.

Last updated: 2026-07-23

## Stage 0: Documentation and approval

- Reconcile requirements and open decisions.
- Approve architecture, data/versioning, vertical-slice scope, and initial deployment target.
- Create owner-controlled source history only after approval.

Recurring cost: $0.

## Stage 1: Private local vertical slice

- Run the browser application only in the development environment.
- Keep the administrator application local-only.
- Use synthetic fictional content.
- No external player accounts or data collection.
- Test desktop and phone layouts on trusted local devices.
- Demonstrate save/reopen, version pins, and real-world FSRS behavior.
- Demonstrate deterministic browser-run facility behavior independent of
  rendering frame rate.

Recurring cost: $0, excluding any optional development tools Melissa explicitly approves.

Limitations:

- Not suitable for remote testers
- No real cloud-save or authentication validation
- Local machine availability controls access

## Stage 2: Private hosted pilot

Proposed components:

- Standards-based static web hosting for the player application
- Supabase-managed PostgreSQL and trusted server-side functions, as accepted in
  ADR 0008
- Supabase Auth with verified email and permanent passphrases, as accepted in
  ADR 0009
- Invite-only verified-email accounts
- Separate staging and pilot environments
- Separately deployed administrator application behind an outer access gate,
  individual Supabase Auth accounts, TOTP MFA, and allowlisted roles
- HTTPS supplied by the hosting provider
- No custom domain required initially
- Browser-authoritative facility execution; the backend validates and stores
  revisions but no service continuously simulates each pilot facility

ADR 0008 approves the backend architecture only. It does not authorize creating
a Supabase account or project, selecting a paid plan, or enabling billing.
ADR 0010 approves the staged administrator security architecture only. It does
not authorize deploying the administrator application or creating an
access-gate account.

Expected recurring cost:

- Disposable experiment: potentially $0 with free tiers and manual backups
- Pilot data worth preserving: approximately $25-$30 per month with a managed database plan and possibly a small function-hosting plan

Costs and provider terms must be rechecked immediately before approval. No free tier should be treated as a backup strategy.

This lower-cost topology is appropriate only for a private, single-player,
nonresearch, noncompetitive pilot. A future use that depends on
tamper-resistant facility results requires a new RED server-authority decision
and revised hosting estimate.

## Stage 3: Installable PWA

- Add an application manifest, icons, update flow, and controlled asset caching.
- Retain online-required gameplay and cloud saves.
- Do not claim full offline support.
- Test stale-cache recovery and save-schema compatibility.

This can use the same deployment as Stage 2.

## Stage 4: Public web release

Not authorized. Prerequisites include:

- Public-release threat model and security review
- Privacy notice and account-deletion workflow
- Tested backup and restore procedures
- Rate limiting and abuse response
- Support and incident-response contacts
- Accessibility and browser compatibility testing
- Clinical correction and emergency-withdrawal procedures
- Cost alerts and owner-controlled billing
- Explicit public-release approval

## Stage 5: Native or store distribution

Deferred. Potential future routes include a desktop wrapper or mobile application package based on the web client.

This adds signing, installers, store review, platform-specific testing, update channels, and account ownership requirements. It should be considered only after browser-pilot evidence shows a material need.

## Ownership

Melissa should own or control:

- Source repository and organization
- Hosting and database organizations
- Authentication and email-delivery configuration
- Domain and registrar if later purchased
- Billing and cost alerts
- Backup encryption and recovery materials
- App-store accounts if ever created

Melissa and her husband should use separate accounts and MFA. They should not share passwords or administrator recovery secrets.

## Environments

Recommended environments:

1. Local development
2. Staging for owner review
3. Private pilot
4. Production only if a public release is approved

Draft clinical content must not be promoted automatically between environments.

## Update and rollback

Each deployment should identify:

- Application build
- Database migration
- Clinical release
- Balance release
- Save-schema version

Release process:

1. Validate and test in staging.
2. Back up data.
3. Deploy compatible database additions.
4. Deploy application build.
5. Verify smoke tests.
6. Move approved release pointers.
7. Monitor essential errors.

Rollback should restore the previous application build and release pointers without deleting saves. Destructive database reversal is not a normal rollback strategy.

## Backup and recovery

- Automated database backup when real pilot progress has value
- Regular owner-controlled logical exports
- Separate backup of uploaded assets
- Source mirrored in an owner-controlled private remote
- Written recovery procedure
- Periodic restore test
- Defined recovery-point and recovery-time goals before public release

## Testers

Testers receive:

- A private pilot URL
- One single-use invitation
- A verified-email and passphrase account setup flow
- Plain-language privacy and educational-use notice
- Instructions for reporting problems without sharing patient information
- A support route controlled by Melissa

Testers never receive administrator access or database credentials.
