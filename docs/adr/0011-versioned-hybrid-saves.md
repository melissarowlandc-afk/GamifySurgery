# ADR 0011: Versioned Hybrid Saves

Status: Accepted

Date: 2026-07-23

Decision owner: Melissa

Severity: RED

## Context

Campaigns must persist across desktop and phone without silent overwrite,
learning-history loss, money corruption, or dependence on an unversioned save
object. The online-required pilot does not need general offline play, but it
does need refresh recovery and safe behavior during brief connection loss.

## Decision

- Represent current facility operations in a versioned, validated campaign
  snapshot.
- Preserve first scored educational reviews in an immutable evidence log.
- Preserve financial changes in an auditable money ledger.
- Preserve inspection attempts as durable records.
- Store campaign seed; permanent core-concept, balance, save-schema,
  FSRS-integration, and random-generator versions; and the initial/current
  clinical release plus immutable clinical-adoption sequence accepted later in
  ADR 0015.
- Write a compatible snapshot and its new immutable evidence atomically.
- Give retriable operations unique identifiers so a repeated network request
  cannot duplicate a scored review, purchase, or ledger entry.
- Assign every accepted save an increasing revision number.
- Allow only one device at a time to hold a campaign writer lease.
- Require every save to include the expected current revision and reject stale
  writes.
- Require a second device to reload or explicitly take over after a warning.
- Revoke the previous writer upon takeover and pause it when revocation is
  detected.
- Prohibit automatic state merge and last-write-wins behavior.
- Keep cloud state authoritative.
- Permit the browser to retain the last cloud-acknowledged state and one
  bounded pending save for refresh or brief connection-loss recovery.
- Pause facility operations after a short unacknowledged-save grace period
  rather than becoming an offline game.
- Migrate snapshots through tested, sequential, non-destructive schema
  migrations.
- Preserve the prior snapshot whenever validation or migration fails.

Exact snapshot fields, writer-lease duration, connection-loss grace period,
autosave cadence, and final warning wording remain lower-level configuration
and usability decisions.

The separately accepted Start Over requirement will use an explicit campaign
lifecycle operation rather than silently overwriting the current snapshot. Its
archive, deletion, undo, and seed behavior remain Decision Y-008.

## Relationship to later decisions

ADR 0017 clarifies that “cloud state is authoritative” means the latest
server-accepted revision is authoritative for cross-device synchronization and
recovery. During the private pilot, the active browser computes proposed
facility transitions; the server does not continuously execute the facility.

ADR 0018 specifies that each snapshot preserves exact state and draw counters
for every initialized named random stream under the campaign's permanently
pinned randomness contract.

ADR 0019 specifies that this operational snapshot is validated versioned
`jsonb`, while independently related, protected, published, or audited records
remain normalized PostgreSQL data.

## Benefits

- Campaigns reopen quickly without discarding trustworthy learning and money
  evidence.
- Stale devices cannot silently overwrite current progress.
- Failed migrations leave a recoverable prior save.
- Idempotent operations prevent duplicate reviews and financial entries.
- The design supports refresh and brief network recovery without claiming
  general offline play.

## Risks and limitations

- Only one device can actively play a campaign at a time.
- Takeover and connection-loss pauses add occasional friction.
- Old save fixtures and migration paths require continuing maintenance.
- Local recovery state must never be mistaken for newer cloud authority.
- Correctness depends on extensive transaction, migration, concurrency, and
  recovery testing.

## Alternatives considered

1. Complete event sourcing in which every facility action is permanent and
   current state is rebuilt through replay.
2. One overwriteable save object using last-write-wins.

## Cost and maintenance

The architecture adds negligible database cost at pilot scale. Development
burden is moderate to high; ongoing maintenance is moderate and includes
migration fixtures, save round trips, concurrency tests, and recovery tests.

## Cost of changing later

Very expensive. A change would require migrating every campaign, rebuilding
synchronization and recovery, revising audit evidence, and retesting content,
balance, FSRS, randomness, and schema compatibility. Missing historical
evidence could not necessarily be reconstructed.
