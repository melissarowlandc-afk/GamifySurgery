# ADR 0015: Controlled Forward Clinical Releases

Status: Accepted

Date: 2026-07-23

Decision owner: Melissa

Severity: RED

## Context

Clinical content will continue growing after players start campaigns. Keeping
every campaign forever on its initial clinical release would prevent compatible
new cases, variants, questions, decisions, and concepts from reaching those
players. At the same time, mutable live content or unordered expansion overlays
would undermine reproducibility, restoration, clinical approval, stable
mastery denominators, and exact learning-history audits.

Clinical, core-concept, and balance data must remain separate published systems.
Existing campaign foundations cannot change merely because clinical material is
added.

## Decision

### Complete independent releases

- Publish clinical releases, core-concept sets, and balance releases
  independently.
- Every published release is complete, immutable, validated, recoverable,
  exportable, numbered for humans, identified internally by a permanent opaque
  ID, schema-versioned, and checksummed.
- A complete clinical release is a full manifest of exact immutable clinical
  item revisions. Unchanged item revisions may be referenced by several
  releases internally, so logical completeness does not require duplicating
  their stored content.
- Existing published item revisions are never edited in place.

### Permanent campaign foundations

Each campaign permanently retains its:

- Core-concept set and mastery denominator
- Balance release
- Scheduler integration, algorithm, and resolved parameters
- Save-schema version
- Random-generator version
- Campaign seed

The campaign stores both its initial and current clinical release.

### Controlled complete-release advancement

- A campaign advances to one newer complete clinical release rather than
  accumulating its original release plus an ordered expansion stack.
- Advancement requires an explicit directed compatibility edge from the
  campaign's current release to the proposed release, or a fully validated
  compatible path.
- Compatibility is not inferred from consecutive version numbers.
- A compatibility record preserves classification, allowed distribution modes,
  validator report and version, migration version, approver, and checksums.
- Passing compatibility validation makes adoption eligible but does not itself
  trigger rollout.
- Melissa selects whether an eligible release is automatic,
  player-approved, administrator-initiated, or unavailable to existing
  campaigns.

Automatic additive compatibility requires:

- Every predecessor clinical item revision and stable identifier remains
  unchanged.
- Existing clinical concepts preserve their meaning and lineage.
- New content works with the campaign's pinned balance, schema, runtime
  mechanics, and progression rules.
- The campaign's core mastery denominator, existing mastery, and
  progression/inspection/victory eligibility remain unchanged.
- Supplemental content cannot starve required educational material or create
  an obvious economic, XP, or queue exploit.
- Generated or started episodes require no mutation.
- Deterministic validation and simulation pass.

### Immutable adoption history

Each adoption is one atomic campaign transaction that stores:

- Prior clinical release
- New clinical release
- Trusted adoption timestamp
- Automatic, player-approved, or administrator-initiated mode
- Actor or protected process
- Campaign and save revision
- Unique operation identifier
- Compatibility validator and migration versions

Adoption never rewrites historical saves, reviews, cards, or patient episodes.

### Supplemental concepts

- A newly added concept begins with no prior FSRS history in that campaign.
- It may appear in newly generated encounters and participate in ordinary
  learning and appropriate rewards under the pinned balance release.
- It is supplemental relative to the campaign's fixed core set.
- It cannot enlarge that campaign's mastery denominator or become a new
  requirement for progression, inspection, or victory.
- A future campaign created with a later core-concept set may classify the same
  concept as core.

### Frozen clinical evidence

- At generation, each patient episode freezes the clinical release and exact
  case, patient-variant, decision, and question revisions used.
- Later adoption applies only to newly generated material unless a separately
  validated safe migration exists.
- Every scored review records the exact clinical release and scored-decision
  and question revisions the learner saw.
- Every referenced release and item revision is retained for audit and
  restoration.

### Rollback and incompatible changes

- Moving a current-release pointer backward controls new campaigns only.
- Reversing an already adopted campaign requires an explicit migration or
  withdrawal because supplemental learning evidence may already exist.
- Corrections, withdrawals, concept redefinitions, deletions, incompatible
  replacements, and schema changes are not additive adoption. Their
  subsequently accepted treatment is defined by ADR 0016.

### Start Over

When Start Over creates a retry, the prior campaign's current adopted clinical
release becomes the retry's initial clinical release. The retry retains the
accepted permanent core, balance, scheduler, schema, randomness, and seed
foundations, starts new campaign-scoped FSRS state, and develops its own later
clinical-adoption history.

## Benefits

- Compatible new clinical material can reach active campaigns without
  restarting them.
- One current complete release is simpler to administer, validate, restore, and
  explain than a growing ordered overlay stack.
- Existing mastery denominators, balance behavior, and technical foundations
  remain stable.
- Supplemental learning can grow without revoking earned progress.
- Exact item revisions and adoption events make past learner experiences
  reproducible and auditable.
- Logical complete snapshots provide clarity while shared immutable revisions
  avoid needless physical duplication.

## Risks and limitations

- Compatible additions can still change future patient variety, educational
  workload, queues, rewards, and seeded selection after the adoption event.
- Compatibility validation must include simulation and game-rule checks, not
  just database shape.
- Supporting several historical predecessor releases requires retained
  validators, fixtures, and releases.
- Forward adoption is one-way by default; reversing it is a controlled
  migration rather than a simple pointer edit.
- Emergency correction and withdrawal behavior adds significant safety,
  evidence-repair, and campaign-waiver maintenance under subsequently accepted
  ADR 0016.

## Alternatives considered

1. Keep each campaign forever on its initial clinical release.
2. Keep the initial release plus an ordered list of immutable additive
   expansions.
3. Read mutable live clinical tables.

## Cost and maintenance

Storage should remain inexpensive at pilot scale. Development and ongoing
maintenance are moderate to high: complete manifests, compatibility edges,
distribution controls, immutable adoption history, retained releases, episode
freezing, restoration fixtures, and deterministic compatibility simulations.

## Cost of changing later

Very expensive. This model affects clinical authoring, release manifests,
campaign saves, episode generation, review evidence, FSRS-card initialization,
mastery, distribution, rollback, restoration, audit history, and administrator
workflows. An expansion-stack conversion would require reconstructing
precedence and compatibility for every adopted campaign.
