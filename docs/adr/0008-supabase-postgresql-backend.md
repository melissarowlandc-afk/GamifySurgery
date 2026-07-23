# ADR 0008: Supabase-Managed PostgreSQL Backend

Status: Accepted

Date: 2026-07-23

Decision owner: Melissa

Severity: RED

## Context

The project needs persistent accounts and campaigns, campaign-specific learning
state, relational clinical content, independent clinical and balance releases,
protected drafts, administrator publishing, cross-device saves, migrations,
and reliable backup and restore. Melissa should not be responsible for
operating or patching a database server.

## Decision

- Use Supabase-managed PostgreSQL as the database foundation for the private
  hosted pilot.
- Keep authentication mappings, clinical authoring, clinical releases, balance
  authoring, balance releases, accounts and profiles, campaigns and learning,
  security/error records, and optional manual feedback in protected logical
  domains.
- Use PostgreSQL row-level security and least-privilege grants for any data
  reachable from the player application.
- Keep mutable drafts and administrator-only records unavailable to the player
  application.
- Use trusted server-side functions for publishing, administrator operations,
  campaign creation, revision-checked saves, and other sensitive transitions.
- Store database migrations with the compatible source and tests in the
  monorepo.
- Prefer standard PostgreSQL structures and project-owned adapters where
  practical to reduce provider lock-in.
- Maintain owner-controlled logical exports in addition to provider backups.
- Do not run continuous facility simulation on the backend.
- Decide the authentication provider and player login/recovery flow separately.

This decision approves the architecture only. It does not authorize creating a
Supabase account or project, selecting a paid plan, enabling billing, or
uploading data.

## Benefits

- PostgreSQL can enforce relationships among concepts, cases, variants,
  sources, releases, campaigns, and review records.
- Supabase manages the database infrastructure while retaining standard
  PostgreSQL tables and migrations.
- Row-level security provides defense in depth for player-owned campaigns.
- Protected functions keep publishing privileges and secrets out of the player
  application.
- Standard exports provide a migration and recovery path outside the provider.

## Risks and limitations

- Permission mistakes could expose data and require automated policy tests.
- Provider-specific functions and a future use of Supabase Auth would increase
  switching cost.
- A provider outage may temporarily prevent sign-in or saving.
- Daily backups can still lose changes made after the most recent backup.
- One pilot database provides logical rather than complete physical separation
  among domains.
- A later public release may justify separate authoring and runtime database
  projects.

## Alternatives considered

1. Managed PostgreSQL, authentication, and protected API functions assembled
   from separate providers.
2. Firebase Authentication and Cloud Firestore.
3. Self-hosted PostgreSQL and API infrastructure; rejected as an unreasonable
   operational burden for the pilot.

## Cost and maintenance

The provider currently offers a free tier without automatic backups and a paid
plan starting at approximately $25 per month with daily backups. Prices and
terms must be rechecked before any purchase. The project will not treat a free
tier as the only copy of valuable pilot data.

Ongoing maintenance is moderate and includes migrations, permission tests,
logical exports, restore tests, usage review, and provider account security.

## Cost of changing later

Moving to another PostgreSQL host is expensive but manageable if standard
migrations, exports, and adapters are maintained. Authentication sessions,
provider-specific functions, deployment automation, and permissions would
still require replacement and retesting.

Moving to a document database would be considerably more expensive and would
redesign schemas, relationships, queries, permissions, publishing,
administration, saves, migration, and backup behavior.
