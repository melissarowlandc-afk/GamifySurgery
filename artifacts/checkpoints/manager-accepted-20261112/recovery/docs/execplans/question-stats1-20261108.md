# Stats1 question overhaul - 2026-11-08

## Goal and owner direction

Rewrite every live variant in the sixteen named statistics families into short,
single-skill practice. Melissa Rowland's 2026-11-08 direction supersedes the
general two-step/difficulty default for statistics. Preserve the live release,
manifest, prior versions, stable meanings and frozen saves; candidates remain
`needs_clinician_review` for independent review and manager acceptance.

## Scope, constraints and repository state

Shared tree; preserve all unrelated work. No Git, agents, installs, network
writes, deployment, save/cloud implementation, Level 5 evidence/pins or release
worktree edits. Own stats1 source/data/evidence/tools/tests, the requested
standard section and review/handoff artifacts. Read root AGENTS.md, current
handoff and standard. No nested lane instructions found.

Initial census: 64 live variants/nodes in 64 single-node cases, four for each
named family. One PPV variant uses the accepted collection-population concept.
Four additional N2 statistics concepts fall outside the sixteen names. Optional
scope clarification received no answer; proceed with the explicitly enumerated
families as the bounded scope. Inventory the four N2 items separately and leave
them unchanged. This is a stated scope assumption, not an approval hold.

## Requirements and decisions

- Inventory exact default IDs, concepts, fields, choices and word counts before
  any authoring; capture current source hashes, live/catalog/manifest/timing.
- Update the standard first: single skill, <=45 pre-task words (hard cap60),
  compact exhibits, exact task, mental arithmetic, 2-4 feedback lines, credible
  parallel choices and runtime randomization. Count the entire authored visible
  context as well as prose so exhibits cannot hide verbosity.
- Preserve encounter kind: 52 cases are existing employee discussions and 12
  are patient encounters. Give only the patient encounters a minimal named
  age/sex clinic line; do not invent demographics for staff. Statistical data
  are in a constructed-data exhibit.
- Use existing permitted source records/atomic claims. Do not carry unrelated
  clinical teaching into the new methods exercises. Reuse actual access dates;
  add an open source only for a real support gap. No empirical performance
  numbers or invented clinical cutoffs.
- New exact question IDs, no live/default/barrel/manifest acceptance. Supply a
  retained source view and explicit future integration rows for manager review.
- All old concept IDs remain for unchanged meaning; document any material
  meaning change instead of silently transferring FSRS history.
- Historical test captures stay immutable. If the authorized standard update
  trips an old preservation guard, pin its exact delta and restore the earlier
  epoch in test-only support; do not loosen assertions or refresh captures.

## Milestones and validation

1. [x] Exact live inventory/capture; owner statistics section.
2. [x] Single-skill source candidates, claims, worked feedback and manual checks.
3. [x] Whole-candidate advisory lint, reproducible review packet, inventory and
   word-count statistics; hold unsupported keys.
4. [x] Full clinical-content `npm.cmd test -- --pool=threads`, root seven
   `npm.cmd run typecheck`, `npm.cmd run clinical:lint:test`; exact outputs.
5. [x] Handoff/files/scope receipt and append current-thread handoff; stop at
   independent review gate. No ship-manifest edit.

## Next action

Authoring and validation are complete. See
`docs/research/question-stats1-handoff-20261108.md` for the full live inventory,
per-item summary, exact validation and file list. Stop at independent review;
the manager owns acceptance. No candidate is accepted or shipped in this pass.

## Results and discoveries

- 64 new exact variants, 64 one-node cases and 18 unchanged concept IDs. S42
  retains collection-population PPV; S54 retains the versioned target-benefit
  interval meaning rather than reverting it to a generic p-value definition.
- Combined pre-task words, counting all visible exhibit data: mean 103.609375
  to 24.40625; maximum 128 to 34. Every candidate is below 45 words.
- Raw assembled cue lint 55 to 0 findings, 128 canonical/finite contexts,
  zero suppressed. All explanations have three short lines.
- Full clinical-content: 124 files / 1473 tests pass, 39.37s, exit 0. Root
  typecheck: all seven workspaces pass, exit 0. Linter tests: 33 pass, zero
  fail, exit 0. Reproducibility and scope checks pass.
- The standard update legitimately trips an older source-preservation guard.
  A two-path, hash-pinned test-only migration restores the previous epoch for
  that assertion; no old capture or assertion was refreshed or relaxed.
- Existing live/catalog/manifest/global timing hashes remain exact. No
  existing Level 5 bound input changed. The manager owns any future accepted
  source-view integration, exact acceptance rows, and release/rebind work.
