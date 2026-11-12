# N4 intra-procedure and specialty-clinic content

## Goal

Author approximately twelve intra-operative, eight intra-endoscopy, eight
wound/ostomy and six useful pediatric clinic cases. Supply executable explicit
drafts, a key-first review-only packet, manual adversarial self-checks and a
handoff. No default admission or manifest acceptance occurs in this lane.

## Constraints and ownership

Read AGENTS.md, the question authoring standard v15 and the founder-consult
pathing handoff. Melissa Rowland is clinical sign-off; all new clinical records
remain `needs_clinician_review`. No invented clinical threshold, probability,
dose or mandatory timeline. Preserve source rights, original factual wording,
atomic mappings and source/check dates. No proprietary source corpus.

Shared tree. Own new `packages/clinical-content/src/question-new-n4-*` files,
`tools/question-new-n4/`, this plan, the requested packet/handoff and an append
to CURRENT_THREAD_HANDOFF.md. Do not edit game-domain runtime, ship manifest,
default registries, other question batches, player/session, GS-release,
Supabase or Level 5 evidence/pins. No agents, Git, commit, push, deploy or
installs. Prior network restriction is being clarified for targeted permitted
source verification; independent offline work continues meanwhile.

## Entry state and runtime contract

- Captured 2,080 existing files and the complete current-handoff prefix in
  `.local-dev/question-new-n4-20261110/`. Recorded catalog: 1,581 atomic claims,
  561 sources. A pre-edit full clinical suite is running.
- Default supply: zero `ambulatory_surgery` cases; six intra-endoscopy cases
  with one female/43 profile; twenty pediatric cases; no wound capability tag.
- Intra-procedure cases must be routine-eligible, nonpediatric, without a
  participant, service request or result gate. OR setting is
  `ambulatory_surgery`; endoscopy setting is `endoscopy`/`outpatient_endoscopy`.
  Operative phase is described by actual current findings, not invented schema.
- Current endoscopy affinity recognizes only five existing concept IDs; wound
  and ostomy affinities recognize ten existing IDs. New variants of those
  meanings can match without a runtime edit. New meanings outside those lists
  must be explicitly reported as an integration gap rather than mislabeled.
- Wound cases require `capability.wound_ostomy_clinic`, Level 4, setting clinic.
- Pediatric clinic requires Level 4, pediatric capability, one exact child/
  parent/art/profile binding and explicit no-test timing. Candidate bindings
  are supplied separately for later manager integration, never installed by
  default. Existing art/demographic editorial contracts can be reused.

## Milestones

- [ ] Finish source/topic and pediatric-gap assessment. Record prospective
  interpretation, consequential action, nearest competitor, deciding finding
  and counterfactual before drafting each item. Park unsupported exact keys
  with one concrete clinical question only where needed.
- [ ] Author bounded new data files with the existing case/node/profile/
  capability schema. No circular order for a procedure already in progress.
- [ ] Bind atomic facts and complete permitted source records; record all
  application limits and provenance. Reuse unchanged meanings honestly.
- [x] Exercise the authored explicit draft supply against actual consult-kind and clinic-
  affinity predicates, capability/stage eligibility and frozen scoring.
  Disposable preview-only metadata installation is isolated and restored.
- [x] Run cue lint on full visible fields and finite profiles, manually attack
  every item using the reviewer rubric, repair findings and generate the packet.
- [x] Run full clinical-content Vitest (`--pool=threads --maxWorkers=2`),
  seven-workspace typecheck and linter tests. Attribute remaining failures
  against entry and preserve unrelated work.
- [ ] Write requested handoff, any specific owner questions, exact counts,
  integration bindings and Level 5 effects; append current handoff and stop.

## Validation

```text
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2
npm.cmd run typecheck
npm.cmd run clinical:lint:test
```

## Progress and discoveries

Partial checkpoint only: 24 raw drafts, 21 provisional executable candidates
(6 intra-op, 7 endoscopy, 6 wound/ostomy, 2 pediatric), three manual construction
parks and ten unwritten source/clinical tasks. The source/topic assessment,
requested supply and final handoff milestone are not complete. The candidate
stage has 19 meanings, 18 reused and one new; it does not provide 21 new FSRS
concepts. All new records remain `needs_clinician_review`.

The authored pool reuses 73 recorded atomic facts and 53 source records / 46
distinct publications without new retrieval, new atomic facts or advanced
access/check dates. The earlier no-network instruction remains in force while
its N4 scope clarification is unanswered. Ten specific remaining tasks are in
`tools/question-new-n4/pending.mjs`; one requires a concrete owner decision.
No unverified technical key or placeholder citation was emitted for them.

The candidate linter is clean across 21 variants / 42 contexts. Manual checks
parked Barrett surveillance, simple ileostomy fluid replacement and a pouch-
contour cueing construct rather than call them moderate/hard. The other checks
are provisional author assessments, not independent PASS verdicts.

The real-source preview passed thirteen flows and reported eight cases blocked
by the existing affinity lists (seven unique concept IDs). Exact timing/order
and two child/parent/art bindings are staged separately, never globally
installed. The preview's disposable metadata overlays are restored; frozen
domain-state reopen is checked while they are present, not claimed as a full
player save-format/journal test.

The ordinary fallback admitted the cholecystectomy draft with zero service
operations and `consult: null`; the clinical setting/capability schema alone
does not constrain a current-operation case to procedure sources. The domain
owner must resolve this before shipping. No runtime/manifest/save gate was
added. The probe did not reproduce an unsourced endoscopy admission.

Final full clinical-content: 1,646 passed / 3 failed (1,649), 129 files passed /
3 failed (132), 118.00 s. Entry: 1,618 passed / the same 3 failed (1,621),
204.30 s. Same assertion/hash failures in flags3, stats1 and stats1 acceptance
are recorded by file in the handoff. N4 adds exactly 28 passing tests; focused
28/28 passes. All seven workspace typechecks and all 33 linter tests pass.
No assertion, protected pin, budget or timeout was weakened. All 560 existing
clinical source files remain byte-exact. No Level 5 bound input was edited.

## Next action

Resolve the earlier no-network constraint for targeted permitted-source
verification of the remaining ten slots, then finish the requested supply.
The 21 provisional candidates can undergo independent review now. Packet and
partial handoff are `docs/research/question-new-n4-20261110.json` and
`docs/research/question-new-n4-handoff-20261110.md`. The manifest/default release
and domain source/affinity integration remain with the manager. Do not mark the
overall milestone complete at this checkpoint.
