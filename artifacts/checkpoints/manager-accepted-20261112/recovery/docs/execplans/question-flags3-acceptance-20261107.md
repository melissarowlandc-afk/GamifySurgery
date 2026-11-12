# Flags3 bounded acceptance — 2026-11-07

## Goal and authorization

Implement the manager's flags3 acceptance decision: F3-01 unchanged; F3-02 exact
PASS; the hernia-type question and a self-contained management question as a
pair. All remain `needs_clinician_review`. No clinical approval is implied.

## Constraints and ownership

Shared tree; preserve unrelated work. Own the flags3 source/addendum, exact
manifest rows/header/replacement, accepted-only concept/timing/order wiring,
historical preservation test adapters and focused compatibility tests. No
selector, save format, cloud implementation, balance, Level 5 evidence/pins,
release-tree, source retrieval, Git, installs, agents, network or deployment.
Original authoring intake, reviewed source and original review packet stay
immutable. Retain older version/FSRS identities; the new type objective has its
own concept. Use existing projection-only acceptance mechanisms.

## Repository state

Read root AGENTS.md and current handoff; no nested lane instructions found.
At intake: 1,141 default cases, 1,452 nodes, 605 registered meanings, 69 accepted
rows and two whole-case relations. Default SHA256
`77261db946b72dbf0f001e6ce11aab75928b561a19a8a17a874274f08b185a30`.
Flags3 is a separate three-case/five-node candidate view, not yet default.

## Decisions

- Keep the round-one source/packet as historical reviewed artifacts. Add an
  explicit fixed acceptance source and review addendum.
- Only the management wording/version and the hernia shared presentation move.
  Options, type question and the two other drafts remain exact.
- Replace the earlier B2A02/B2A08 acceptance tuples rather than duplicate them;
  capture and prove the complete authorized delta to earlier test epochs.
- Frozen old encounters retain their original questions, choice order and cards.

## Milestones and acceptance criteria

1. Immutable pre-acceptance capture; minimal self-contained fix; lint/manual check.
2. Four exact manifest acceptances, source/header pins, one whole-case relation;
   accepted-only new concept, timing/order and barrel wiring.
3. Exact source/hash and complete-default delta tests; fresh admission and frozen
   format-3/journal completion tests for all three replaced live variants.
4. Full clinical/domain tests with `--pool=threads`, seven root typechecks,
   focused question player tests with preload and `--pool=threads`.
5. Decision document, acceptance handoff, exact counts/hashes/failures and changed
   Level 5 bound inputs; append current-thread handoff.

## Progress

- [x] Instructions, current handoff and integration architecture inspected.
- [x] Pre-acceptance capture and minimal repair.
- [x] Exact acceptance and compatibility coverage.
- [x] Validation and final handoff.

## Next action

Stop for manager inspection. Handoff: `docs/research/question-flags3-acceptance-handoff-20261107.md`. Clinical1362/1362; seven typechecks; player78 pass/1 known fail (31 ship-save pass); domain5159 pass/27 known fail/1skip. No rebind or release.
