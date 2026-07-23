# ADR 0016: Clinical Withdrawal and Correction

Status: Accepted

Date: 2026-07-23

Decision owner: Melissa

Severity: RED

## Context

Clinical releases and item revisions are immutable, yet a materially incorrect,
ambiguous, misleading, or unsupported item may need to stop appearing
immediately. The system must protect learners without editing sealed releases,
losing exact historical evidence, silently changing submitted answers,
corrupting FSRS, punishing players for publisher error, or making a campaign
impossible when the withdrawn material was required.

Forward-compatible additive adoption in ADR 0015 cannot be used for a
correction, withdrawal, concept redefinition, deletion, incompatible
replacement, or schema change.

## Decision

### Append-only withdrawal directive

- For the pilot, only Melissa may clinically approve withdrawal, historical
  evidence classification, replacement, reactivation, or concept redefinition.
- A withdrawal targets exact immutable clinical releases and item revisions.
- It records reason, severity, trusted time, approval, whether prior scoring may
  be invalid, directive version, active status, and supersession history.
- A directive may be superseded but is never deleted.
- The player refreshes the active withdrawal manifest at session start, resume,
  periodically, and before generating scored clinical material.
- New scored clinical generation fails closed when the safety manifest is too
  stale. Exact refresh and staleness thresholds are GREEN configuration values.

### Runtime treatment

- Withdrawn material not yet generated is never selected.
- Generated or started material remains frozen to its exact original revisions;
  it is never rewritten or replaced inside the episode.
- An affected generated node not yet presented is bypassed or cancelled
  without scoring.
- A visible affected prompt without a submitted answer is disabled and
  explained without scoring.
- An already-submitted answer and its original scheduler transition remain
  immutable.
- Publisher-caused cancellation has a neutral operational outcome: no clinical
  score, satisfaction penalty, educational reward, or exploitable extra
  patient revenue.

### New-version correction package

- A correction creates a new immutable item revision in a new complete clinical
  release.
- Melissa clinically approves the correction and its player-facing notice.
- Affected campaigns receive it only through a validated replacement or
  migration edge, not ordinary additive classification.
- The package identifies affected releases, campaigns, episodes, and reviews
  and includes validation, simulation, restoration, and audit fixtures.
- A material change to concept meaning creates a new concept identifier and
  requires an explicit campaign plan. An existing identifier is never silently
  redefined.

### Historical evidence and FSRS repair

- Original reviews, submitted answers, ratings, and scheduler transitions are
  never edited or deleted.
- The correction package classifies each affected scoring situation as still
  valid, invalid, or affected by a concept redefinition.
- An append-only review-validity annotation records the classification, reason,
  approving authority, correction package, and trusted time.
- If evidence is invalid, an approved, versioned repair replays the concept's
  remaining valid history through the campaign's pinned scheduler.
- The repair preserves excluded-review identifiers, replay checksum, prior and
  rebuilt card states, prior and recalculated current mastery status, operation
  ID, migration version, and approval.
- The player sees Review Required After Content Correction rather than a false
  failure.
- Fresh approved scored material can establish valid evidence later.
- A correction notice is unscored and does not itself alter FSRS.

### No earned-progress clawbacks

Clinical correction never removes money, XP, construction, facility level,
completed accomplishments, inspection results, recognition, or victory already
earned. Current educational mastery and APP eligibility may require fresh valid
evidence after an invalid review, but prior nonclinical progress remains
complete.

### Core-content availability waiver

- When publisher withdrawal leaves a core concept with no valid presentation,
  the concept stays in the campaign's fixed denominator.
- An audited temporary availability waiver prevents the unavailable concept
  from blocking progression, inspection, or victory.
- The waiver does not mark mastery, create recall evidence, or enable APP
  automation.
- An approved replacement closes the waiver prospectively.
- Any gate completed while the waiver was active remains completed.

### Player communication and privacy

- Players who encountered materially affected content receive a concise
  Melissa-approved correction notice.
- Safety directives, targeted notices, validity annotations, repair records, and
  waivers are operational clinical-safety data, not research telemetry.
- Access is limited to affected records and authorized roles.

## Benefits

- Materially unsafe educational content can stop appearing quickly.
- Published releases, episodes, and submitted answers remain reproducible.
- Invalid learning evidence can be removed from derived scheduling without
  deleting history or inventing a different answer.
- Publisher error cannot claw back the player's facility progress or softlock a
  campaign.
- A concept can remain visibly unmastered while a separate waiver handles game
  fairness.

## Risks and limitations

- Melissa must classify whether a defect affects presentation, scoring, concept
  meaning, or historical evidence.
- Replaying FSRS and recalculating current mastery requires exact retained logs,
  deterministic tests, and careful transactions.
- Players may see an interrupted question or a correction notice.
- Availability waivers need clear display so they are not mistaken for mastery.
- The system must retain old releases, item revisions, directives, and repair
  fixtures.

## Alternatives considered

1. Withdraw future selection but never repair contaminated historical learning
   state.
2. Edit the published item and rescore affected reviews in place.
3. Wait for a corrected release before stopping selection.

## Cost and maintenance

There is no separate vendor fee and storage should be small at pilot scale.
Development and ongoing maintenance are moderate to high: safety-manifest
refresh, fail-closed behavior, exact targeting, correction packages, FSRS
replay, mastery repair, player notices, availability waivers, and restoration
tests.

## Cost of changing later

Very expensive. This decision affects clinical releases, runtime selection,
episode state, review evidence, FSRS, mastery, progression, administrator
authority, player communication, save restoration, and audit history. Once
corrections exist, a different model would require migrating both raw evidence
and every derived repair.
