# ADR 0036: Multiple Resumable Clinics and Staged Auth Shell

Status: Accepted

Date: 2026-07-27

Decision owner: Project owner

Severity: YELLOW identity-flow and campaign-lifecycle decision

## Context

The local profile treated every campaign other than the currently open one as
archived. The revised pilot flow permits several named, resumable clinics and
requires the eventual verified-email gate without pretending that browser-only
password storage is secure.

## Decision

- Supabase verified-email/password authentication remains the hosted-pilot
  identity mechanism.
- Build the provider boundary and branded authentication screens before
  provisioning infrastructure. Tests use an in-memory adapter.
- Until an owner-controlled Supabase project is configured, local beta and
  static Pages builds use an explicit Local Prototype access path. They never
  collect, store, or pretend to validate a password.
- After account validation or prototype access, show the Campaign screen.
- The Campaign screen always offers New Campaign. Resume Clinic is hidden when
  there are no resumable clinics, opens the sole clinic directly, and opens a
  named list when several exist.
- Campaign lifecycle status is `resumable` or `archived`; the separately stored
  selected campaign ID identifies which resumable clinic is currently open.
  Opening or creating one does not archive the others.
- Clinic naming occurs only after the founder chooses Build a Surgery Clinic.
  Normalize names by trimming, collapsing repeated whitespace, and
  case-folding for uniqueness across resumable and archived campaigns.
- Restart archives the selected campaign transactionally, then returns to
  founder creation. The retry retains the prior seed and pinned releases but
  receives a new ID, facility, patients, finances, and campaign-scoped FSRS
  histories. Prior names remain reserved.
- Archived campaigns appear in a separate management area and may be restored
  only as their original state. They never merge with a retry.
- Permanent deletion remains a separate deferred action.

## Relationship to prior decisions

ADR 0009 remains authoritative for real authentication. ADR 0022 still
prohibits a fake credential system. This ADR permits a clearly labeled
non-authenticating development path while the accepted provider is
unconfigured. ADR 0012 remains authoritative for recoverable restart and is
extended to multiple simultaneously resumable clinics.

## Cost of changing later

Moderate before cloud migration and expensive afterward because lifecycle
status and normalized clinic names become account-owned data.
