# Whole-case shipping and N3 guard integration — 2026-11-05

Goal: add an explicit `{replaces, with}` manifest relation, admit manager-accepted
G03/G05 whole-case drafts, preserve frozen legacy encounters and integrate the
reviewed N3 round-three guard patch. No new clinical authoring or approval.

Owned lane: manifest/projector/validation and their tests; strictly necessary
clinical source-view/concept/timing registrations and exact test-order bindings;
questionShipSaveCompatibility player tests; scoped research/handoff artifacts.
N3 source files, save/cloud implementation, Level 5 evidence, release worktrees,
all unrelated work are preserved. No Git, installs, network, agents or deploy.

Decisions: a replacement's `with` is an exact accepted question variant ID;
`replaces` identifies exactly one legacy case (case ID or one of its question
IDs). Complete source-case acceptance is required; no unaccepted neighbor may
enter through a whole-case relation. Invalid relations preserve legacy fallback.
The existing default projection is the only fresh-content boundary; no domain
acceptance gate or save migration is introduced.

Milestones:

1. Capture current source hashes, default content and manifest without Git.
2. Implement explicit replacement projection and build-time diagnostics, accept
   exact G03/G05 drafts and register their retained source/concept/timing/orders.
3. Apply the N3 guard patch and extend preservation guards for only the two
   manager-authorized replacements, retaining the original captures/assertions.
4. Prove default case deltas and format-3 snapshot/journal legacy completions.
5. Run full clinical and domain threads suites, root typecheck and focused
   questionShipSaveCompatibility/separateCampaign/flagFreeze player tests.
6. Record exact files, counts/hashes, validation and risks in a scoped handoff
   and append the shared current-thread handoff, then stop.

Progress: milestones 1–6 complete. Two exact whole-case replacements are active
in the default projection; original frozen nodes/history remain supported.
All 1,134 other default cases and all 598 historical concept records are exact.
No N3 acceptance or clinical approval. The N3 guard patch is integrated without
refreshing the original captures or changing budgets.

Closing validation: full clinical 1,329/1,329 (120 files); seven workspace
typechecks pass. Full domain: 5,132 pass / 32 fail / one skip (204 files),
including all 27 recorded prior failure titles and five additional room/staff
support failures from the shared-tree run. Focused player: 61 pass / one prior
separateCampaign codec-limit failure (three files); all 14 ship/save tests pass.
No edits to those unrelated failure paths, Level 5 evidence or cloud code.

Discoveries: G05's fresh encounter is intentionally one node; the board test now
asserts that exact accepted variant and completion instead of a stale result
gate. Legacy G03/G05 snapshots and journals still finish both original nodes.
Historical N3/batch2b tests needed precise later-acceptance expectations, with
the complete authorized default delta verified before reconstructing their
historical epoch. N3 clinical/runtime source files remain byte-exact.

Handoff: [question-ship-case-replacements-handoff-20261105.md](../research/question-ship-case-replacements-handoff-20261105.md).
Machine receipts: scope and validation JSONs alongside it. Next action belongs
to the manager: inspect integration, follow up unrelated failures, and schedule
the release-worktree input rebind. Worker stops; no release or next milestone.
