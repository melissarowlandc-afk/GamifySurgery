# Flags4: coherent refeeding mechanism options

## Goal and authority

Implement the manager's bounded F4-01 owner-flag brief (2026-11-08).
Melissa Rowland's note on the live
`question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3` is:
"Answer choices don't make sense". Produce a candidate and technical review
packet, then stop for independent review. No manifest acceptance or release.

## Scope and constraints

Own only new flags4 clinical-content, question-quality tooling, research and
plan files, plus an additive current-thread handoff. Preserve every existing
clinical source, default/canonical release, manifest, timing binding and
previous owner-approved version. No Git, agents, installs, network, deployment,
source retrieval, Level 5 rebind, save/cloud, Supabase or domain edits. The
working tree is shared; the cloud worker's changes are outside this lane.

All new clinical objects remain `needs_clinician_review`. Reuse the recorded
atomic facts and actual source access/check dates; do not imply a fresh source
verification. No exact feeding, laboratory or diagnostic threshold is added.
Preserve the stable concept because its existing objective already includes
insulin-associated cellular phosphate uptake after carbohydrate reintroduction.

## Intake and decision

The current one-node case supplies the catabolic-to-anabolic interpretation
before asking for it. Its four options repeat permutations of catabolic and
anabolic states. The explanation refers to a phosphate course that is not
actually displayed. Capture that exact case, question, concept and evidence
before editing. The existing mechanism claim directly supports a focused
question about the response to carbohydrate reintroduction. It does not support
diagnosing refeeding syndrome from hypophosphatemia in isolation.

Use a short named-patient presentation and qualitative observed phosphate
decline after nutrition resumes. Ask precisely for the mechanism linking the
carbohydrate exposure to that decline. Compare three phosphate-handling
processes, with parallel grammar and comparable specificity: cellular uptake,
renal excretion and intestinal absorption. Do not invent alternative-cause
diagnostic criteria, exclusions, management protocols or numeric values.
Explain insulin and the anabolic transition after answering. Expose likely
foundational difficulty honestly; do not claim independent PASS or calibration.

## Milestones and acceptance criteria

1. Capture exact intake and protected-source/default hashes (immutable fixture).
2. Add a direct-import retained source view, new exact question version,
   evidence mapping and draft metadata. No barrel/default registration.
3. Generate before/after review JSON, full source ledger, raw advisory lint and
   manual rubric responses. Review-only key-first options are explicitly marked.
4. Validate candidate/source preservation, full clinical tests with threads,
   cue-linter tests and seven root workspace typechecks. Record exact output.
5. Write the bounded handoff and append the shared handoff without changing
   its existing bytes. List changed Level 5 bound inputs (expected: none).

## Progress

- Read the root instructions, existing flags3 candidate conventions, current
  handoff and authoring standard. Located the exact live v3 and its metadata.
- Confirmed existing recorded mechanism and anabolic-transition claims use
  Zhang et al. (2023); the safety boundary uses AuSPEN (2025). No network used.
- Captured the exact live source and 1,327 protected existing paths; the intake
  capture is immutable. Added a single-node direct-import draft with the stable
  concept and new exact v3.r1 question version. No existing source edit.
- Generated the before/after packet, full two-source/three-basis/three-application
  ledger, exact frozen hashes, raw lint and manual self-check. Lint: 1 before,
  0 after; no suppression. Hold status none; foundational difficulty disclosed.
- Final validation: clinical 126 files / 1,576 tests pass (41.03 s), all seven
  workspace typechecks pass, linter 33 pass / 0 fail (3,287.6033 ms). Ten new
  clinical tests are included. Generation and packet --check pass.
- Live/default/catalog/manifest/global timing are unchanged. No existing Level 5
  bound input changed. Completed the bounded handoff, appended the current-thread
  entry with its original prefix preserved, and recorded all 19 new files.
- Milestone complete. Next action belongs to the manager: independent review
  of the exact candidate, then a separate acceptance/integration decision.
