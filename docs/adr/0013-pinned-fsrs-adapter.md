# ADR 0013: Pinned FSRS-6 Scheduler Adapter

Status: Accepted

Date: 2026-07-23

Decision owner: Melissa

Severity: RED

## Context

Each clinical concept is one spaced-repetition card within a campaign. Incorrect
first responses map to Again and correct first responses map to Good. The game
needs a reliable implementation of FSRS while preserving campaign saves,
reproducible tests, educational auditability, and the ability to evaluate later
scheduler upgrades without coupling the entire game to one package's internal
types.

Writing the scheduling mathematics in-house would create avoidable correctness
and maintenance risk. Running a separate scheduler service would add a
deployment, network, and availability dependency that the pilot does not need.

## Decision

- Use the official open-source `ts-fsrs` TypeScript package to implement the
  FSRS-6 scheduling algorithm.
- Select and dependency-lock an exact stable package release when implementation
  is authorized. A newer major FSRS algorithm requires a new explicit review.
- Put the dependency behind a project-owned scheduler adapter. No other game
  module may import its types or call it directly.
- Keep project-owned canonical concept-card, review-input, and
  scheduling-result types at the domain boundary.
- Map only the first scored response: incorrect to Again and correct to Good.
  Explanation views, corrections, unscored practice, and APP automation do not
  call the scheduler.
- Pin every campaign to its scheduler-integration version, exact package
  version, FSRS algorithm version, and fully resolved parameter-set version.
- Disable library interval fuzz. Any constrained randomness used for encounter
  selection belongs to the game's separately versioned seeded-random system.
- Begin with validated FSRS-6 default model parameters and no individualized
  parameter optimizer. Short-term review settings remain a separate balance
  decision.
- Subsequent Decision D-024 sets the initial desired-retention target to a fixed
  0.90, stored in the immutable balance release and pinned per campaign.
- Subsequent Decision D-025 permits one alternate-variant remediation encounter
  after an Again response, eligible after 30 real-world minutes and limited to
  once per concept and learning date. It updates FSRS but does not create
  another same-date mastery date.
- Subsequent ADR 0016 permits a versioned clinical-correction repair to replay
  remaining valid immutable history through this campaign's pinned scheduler.
  The original review and transition remain preserved; the repair stores prior
  and rebuilt card state and is never a silent rescore.
- Persist immutable review evidence containing the rating mapping, UTC review
  time, pre-review and post-review canonical card states, resulting due time,
  and scheduler versions used.
- Apply a review and its updated card state once, transactionally, using a
  unique operation identifier so a network retry cannot schedule it twice.
- Do not silently change an existing campaign when a dependency or scheduler
  integration is upgraded. A proposed upgrade needs golden-history comparison,
  save and migration fixtures, simulation, and an explicit compatible
  migration before it may affect an existing campaign.
- New campaigns may use a newly approved current integration while older
  campaigns remain pinned to their existing integration.
- FSRS determines card timing and state only. The project-owned review selector
  controls category interleaving, patient-variant recency, contrast cases, and
  progression guarantees. The project-owned mastery rule remains distinct from
  the scheduler.

## Benefits

- Uses a maintained implementation instead of recreating specialized
  scheduling mathematics.
- Fits the accepted TypeScript client and shared-domain architecture without an
  additional deployed service.
- Prevents package-specific state from spreading through saves and game logic.
- Makes scored transitions auditable and reproducible.
- Protects active and archived campaigns from silent schedule changes.
- Keeps a future library replacement or algorithm migration possible through a
  defined boundary.

## Risks and limitations

- The project must monitor upstream fixes and evaluate upgrades deliberately.
- The adapter reduces but does not remove the cost of migrating saved learning
  states.
- Maintaining older campaign integrations can temporarily require more than one
  adapter or a tested migration.
- Default population parameters may not be optimal for this exact learner
  population, but individualized optimization is inappropriate without enough
  validated data and a separately approved privacy or research plan.
- Disabling library fuzz makes scheduling reproducible but removes one built-in
  way to spread reviews; the project-owned selector must handle clustering.

## Alternatives considered

1. Implement FSRS directly in project code.
2. Deploy a separate scheduler service in another language.

## Cost and maintenance

The library has no licensing fee under its current open-source license. Ongoing
maintenance is moderate: dependency monitoring, golden tests, upgrade
evaluation, retained fixtures, and migration support.

## Cost of changing later

Expensive. Replacing the scheduler foundation after pilot data exists could
require card-state conversion, due-date recalculation, save-schema migration,
archived-campaign support, mastery validation, regression simulation, and
learner-facing explanations for visible scheduling changes. The adapter and
immutable review evidence make that work safer but do not make it trivial.
