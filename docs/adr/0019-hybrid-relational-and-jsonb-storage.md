# ADR 0019: Hybrid Relational and JSONB Storage

Status: Accepted

Date: 2026-07-23

Decision owner: Melissa

Severity: RED

## Context

The system contains two very different kinds of information:

1. Structured records whose identity, relationships, permissions, publication
   history, or auditability must be enforced and queried.
2. A rapidly changing operational facility state that the browser loads,
   advances, validates, and saves as a coherent whole.

Using documents for everything would weaken clinical relationships, searching,
and referential integrity. Converting every room, employee, queue entry, task,
and clock transition into independently persisted rows would add transaction
and migration complexity that does not benefit the accepted
browser-authoritative pilot simulation.

## Decision

Use a hybrid physical data boundary inside the accepted Supabase-managed
PostgreSQL architecture.

### Normalized relational records

Store records in related PostgreSQL tables when the system must search, join,
authorize, approve, publish, target, audit, or preserve them independently.
This includes:

- Authentication mapping, accounts, display profiles, and campaign ownership
- Campaign lifecycle and permanently pinned versions
- Clinical authoring records and their revisions, sources, approvals, and
  relationships
- Published clinical, core-concept, and balance releases
- Release membership, compatibility, adoption, withdrawal, and correction
  records
- Current FSRS card state and immutable educational review evidence
- Auditable money-ledger entries
- Frozen episode and scored-decision identities and exact clinical revision
  references
- Inspection attempts
- Administrator audit records
- Essential security/error records and optional manual feedback

Use primary keys, foreign keys, uniqueness constraints, check constraints,
permissions, and transactions wherever they can enforce the accepted rules.

### Versioned operational snapshot

Store the campaign's coherent, rapidly changing operational state in one
validated versioned `jsonb` snapshot. It may contain:

- Facility grid and construction state
- Room and fixture instances
- Employee operational state
- Queues and active task progress
- Patient operational positions and service progress
- Facility clock and pause state
- Random-stream states and counters
- Current maintenance, cleanliness, satisfaction, XP, objectives, and other
  operational values

The snapshot references normalized evidence and frozen clinical identities when
needed; it does not replace, edit, or become authoritative over those records.
Every field has exactly one canonical owner so relational rows and the snapshot
cannot silently compete as two sources of truth.

### Validation and transactions

- Give every snapshot an explicit save-schema version, campaign revision,
  checksum, and validated canonical structure.
- Validate it with shared application schemas and, where practical, database
  constraints or JSON-schema validation.
- Use sequential, tested, non-destructive migrations and preserve the prior
  snapshot when conversion fails.
- Write a new snapshot and any corresponding review or money evidence in one
  trusted transaction.
- Reconcile cached snapshot totals, such as cash, against their normalized
  evidence source.
- Keep draft authoring, published runtime content, operational saves, and
  protected audit data in the separately permissioned logical domains accepted
  in ADR 0008.

Published release bundles and owner-controlled exports may use canonical JSON
artifacts and checksums, but those are derived immutable artifacts rather than
an unstructured replacement for the relational authoring model.

## Benefits

- Clinical relationships, publication history, permissions, and immutable
  evidence receive database-enforced integrity.
- The administrator interface can search, filter, relate, and validate content
  without parsing opaque documents.
- Facility save/reload remains coherent and does not require dozens of database
  writes for ordinary browser simulation progress.
- Operational state can evolve through explicit save-schema migrations.
- Standard PostgreSQL tables and portable JSON exports reduce provider lock-in.

## Risks and limitations

- The ownership boundary must remain documented; duplicating an authoritative
  value in both places creates reconciliation risk.
- Nested snapshot relationships cannot rely solely on relational foreign keys,
  so shared structural validators and fixtures are mandatory.
- Atomic transactions spanning the snapshot and immutable evidence require
  careful server-side functions.
- A large snapshot must be bounded and measured; append-only history does not
  belong inside it.
- The hybrid model is designed for operational restoration, not hidden
  behavioral analytics.

## Alternatives considered

1. Normalize every facility instance and active transition into separate
   tables. This supports server-centric querying but creates substantially more
   schema, write, transaction, and migration burden for the accepted pilot.
2. Store nearly all clinical, balance, and campaign information as JSON
   documents. This is initially flexible but weakens referential integrity,
   approval queries, exact correction targeting, and administrator workflows.
3. Use complete event sourcing for all facility state. ADR 0011 already
   rejected that added replay and maintenance burden for the pilot save model.

## Cost and maintenance

There is no additional vendor charge beyond the accepted PostgreSQL service.
Development and maintenance are moderate: relational migrations and permission
tests, snapshot schemas and migrations, atomic save functions, reconciliation,
export fixtures, and restoration tests.

## Cost of changing later

Very expensive. Moving the boundary would require migrating clinical records or
campaign snapshots, changing runtime and administrator APIs, rebuilding
security policies and transactions, revising publishing and correction tools,
and retesting backups, recovery, and every supported save version.

## Technical references

- [Supabase: Managing JSON and unstructured data](https://supabase.com/docs/guides/database/json)
- [PostgreSQL: JSON types](https://www.postgresql.org/docs/current/datatype-json.html)
- [PostgreSQL: Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
