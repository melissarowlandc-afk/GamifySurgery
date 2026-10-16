# GS-028 pre-Endoscopy batch: owner-delegated editorial receipt

September 28, 2026. Version `development-batch.2026-09-28.pre-endoscopy.1`.
Owner request: add another 20 concept groups using all documented rules.
Astra accepts this exact version editorially for the unapproved prototype. Clinical
approval is not granted: all new clinical records remain `needs_clinician_review`
with no named clinician sign-off. Scope is the local unapproved prototype only.

## Scope and retained requirements

20 distinct scored objectives, four substantive variants each: 80 questions and
68 encounters (56 standalone and 12 paired). Every objective has a standalone
routine presentation, preserving access when a paired sibling is not FSRS-due.
All 20 are available before Endoscopy; 19 are available by internal stage 1.
SBO completed-CT recognition is stage 2; emergency escalation never requires a
clinic CT wait. Independent cases and meaningful same-patient pairs coexist.

Families: small-bowel obstruction, primary umbilical/epigastric hernia, varicose
veins, diabetic-foot infection, burns, hidradenitis suppurativa, parastomal hernia,
stoma prolapse, Glasgow Coma Scale, and secondary lymphedema. Two narrow scored
objectives per family; full stable-ID table and fingerprints appear below.

Names, age, sex and existing characters remain coherent. Complaints are brief,
presentations describe the specific named patient, and each separated question
states its task. Choices shuffle and use comparable labels; global answer-length
and patient-story guards pass without new exceptions. Test choices, including
distractors, use central timing; no wait duration is authored as a medical fact.
Urgent scenarios escalate externally; no early onsite wound or ostomy service
is invented. Two venous-duplex result gates and three terminal test orders use
existing onsite/offsite routes. Later results stay hidden until actual return.

## Provenance and limitations

The live concept sheet was refreshed through row 162, including guidance
columns I:M and an empty-tail check. It contains 161 candidates; no sheet edit
or raw export was made. Proposed meanings were compared against the existing
183 scored objectives. Gallstone pancreatitis was excluded because the owner
reserves its sheet row for Future ED/Trauma.

The [source contract](../../execplans/gs028-pre-endoscopy-source-contract-2026-09-28.md)
records the exact roster, sheet mapping, current primary sources, factual use,
rights, and curriculum distinctions. The public SCORE 2025–2026 outline was
freshly verified (SHA256 `2b98112b218e0b612fe6ea2f8ad5cf7c6f4555d79289c2f569234aa6b5748c09`);
the ABSITE public outline remains dated January 2021. These establish domain
alignment, not question frequency. No proprietary SCORE modules or question
banks were used. No NICE material, source excerpts or full articles are stored.

Primary-midline-hernia management relies on one adequate guideline; GCS is one
official source family. Parastomal/stoma evidence and lymphedema consensus have
explicit uncertainty. Individualized care replaces universal operations, drugs,
garments or thresholds. Sources retain authority separately from reuse rights.
The full metadata and atomic original claims are in the dated clinical package.

## Before/after patient supply

Same selector, 16 fixed seeds and realistic installed capabilities; no Endoscopy
or Recovery capability. These are synthetic supply bounds, not the owner's save.

| Stage/capabilities | Eligible objectives before → after | Cases before → after | Unseen exhaustion before → after |
| --- | ---: | ---: | --- |
| 0, no capabilities | 57 → 66 | 192 → 224 | 46–51 → 54–60 |
| 1, Minor Procedure + Ultrasound + technician | 157 → 176 | 397 → 461 | 98–102 → 112–118 |
| 2, reachable diagnostics without Endoscopy | 172 → 192 | 429 → 497 | 106–109 → 122–128 |

All-not-due states correctly select no patient; a due item is prioritized.
Unresolved encounters still block their own concepts. The new standalone cases
prevent all access to a new objective being blocked by its not-due paired sibling.
The existing sustained eight-day diagnostic retains normal ticks and arrivals;
its changed sampled sequence is a content-bank effect, not a cadence adjustment.

A separate no-grant controlled earning scenario used actual tutorial/reducer
settlements and funded Examination, Minor Procedure, Ultrasound and staff. It
ended at level 1 ($407.30, 240 XP). It did not prove a natural playthrough to
Endoscopy purchase; satisfaction and room-reachability fixture limitations are
not established game defects. No economy, scheduler or arrival-rate fix is claimed.

## Integration and preservation

Admission is additive through clinical exports, synthetic release/case inventory,
and timing registry. Domain integration adds exactly three terminal-service
records: hernia ultrasound and two standalone venous reflux duplex orders.
No engine, persistence, character, balance or generator rewrite was needed.

Frozen pre-batch release SHA256:
`9439c3b50a8e8225c40933e9321d9dd40f868dfe596cf07a763c673c7129a765`.
Deep comparison preserves all old 183 concepts, 450 cases and 703 nodes exactly.
Current runtime totals are 203 concepts, 518 cases and 783 nodes. Existing
withdrawn-content guards remain in force. The 13 captured integration surfaces
changed only in the four authorized production files; nine others, including
persistence, remain unchanged in that capture window.

## Validation and accountability

Final validation passed; exact results and version fingerprints appear below.
Sol `batch_roster_sources` researched and authored the dated package and corrected
review findings. Terra `runtime_supply_audit` captured baselines/supply, implemented
additive admission/service records and actual reducer-flow tests. Terra
`authoring_reference_review` independently reviewed content and ran isolated
browser acceptance. Astra selected the roster, inspected actual content/source
and integration diffs, rejected meaning-losing mechanical label changes, reviewed
assertions and visuals, and ran integrated validation. No qualifying implementation
milestone was left undelegated; durable planning/acceptance remained with Astra.

Local artifacts are under ignored `.local-dev/gs028-20260928-baseline/`,
`.local-dev/gs028-20260928-browser-results/`, and `.local-dev/gs028-20260928-build/`.
The browser test origin is `http://127.0.0.1:4317`, with isolated synthetic storage.
Owner pathway remains `START_GAME.cmd` → `http://127.0.0.1:4173` in the usual
persistent profile. No owner-save access, commit, push, deployment or clinical
publication occurred. Say **"push to GitHub"** for an audited backup. GS-028 stays
open for future bounded batches.

## Exact batch inventory

270 case instantiation profiles, 36 evidence claims, 19 deduplicated sources and
80 timing entries. Internal stage 0/1/2 case counts: 32/32/4. Runtime authored
complaints contain 2–4 words, presentations 21–40, and question prompts 4–11.
Generated names can change displayed word counts.

| Stable scored ID | Objective | Internal stage |
| --- | --- | ---: |
| `concept.small-bowel-obstruction.ct-pattern-recognition` | Recognize mechanical SBO on completed CT | 2 |
| `concept.small-bowel-obstruction.urgent-surgical-escalation` | Escalate SBO danger features | 0 |
| `concept.umbilical-epigastric-hernia.clinical-recognition` | Recognize primary midline hernia | 0 |
| `concept.umbilical-epigastric-hernia.symptomatic-elective-referral` | Refer symptomatic primary midline hernia | 0 |
| `concept.varicose-veins.reflux-duplex-evaluation` | Venous reflux duplex evaluation | 1 |
| `concept.varicose-veins.intervention-referral-after-axial-reflux` | Referral after documented axial reflux | 1 |
| `concept.diabetic-foot-infection.clinical-recognition` | Recognize diabetic foot infection | 1 |
| `concept.diabetic-foot-ulcer.no-antibiotics-without-infection` | Avoid antibiotics for uninfected diabetic foot ulcer | 1 |
| `concept.burn.superficial-partial-thickness-recognition` | Recognize burn depth | 0 |
| `concept.burn.referral-consultation-selection` | Choose burn consultation or transfer | 0 |
| `concept.hidradenitis-suppurativa.pattern-recognition` | Recognize hidradenitis suppurativa | 0 |
| `concept.hidradenitis-suppurativa.multimodal-specialist-planning` | Plan longitudinal HS care | 0 |
| `concept.parastomal-hernia.clinical-recognition` | Recognize parastomal hernia | 1 |
| `concept.parastomal-hernia.nonurgent-stoma-specialist-management` | Plan stable parastomal hernia care | 1 |
| `concept.stoma-prolapse.viability-obstruction-assessment` | Assess stoma prolapse | 1 |
| `concept.stoma-prolapse.urgent-surgical-escalation` | Escalate complicated stoma prolapse | 1 |
| `concept.gcs.complete-component-total` | Calculate a complete GCS total | 0 |
| `concept.gcs.verbal-not-testable-documentation` | Document a non-testable GCS component | 0 |
| `concept.secondary-lymphedema.clinical-recognition` | Recognize secondary lymphedema | 1 |
| `concept.secondary-lymphedema.decongestive-therapy-referral` | Refer for decongestive lymphedema therapy | 1 |

## Exact-version fingerprints

SHA256 below uses UTF-8 source text normalized from CRLF to LF. Test files are
excluded. Any content correction requires a new amended fingerprint record.
The captured serialized final release SHA256 is
`a1dd3c479ead999fce6c28ba98310aa0a47767b3a342fd19577265f6a228a798`.

| File in dated package | Normalized SHA256 |
| --- | --- |
| `batch-helpers.ts` | `0846d35f29c7df7907b0b2ed47c9c4fe2ef5393291f36b8ebf66d359c9403e4b` |
| `burn.ts` | `0e2287eedded789a294c76278d2a6c87aca1e4c5963d61538768471912b92bbc` |
| `diabetic-foot.ts` | `1414f780ca0fd1bcf009d307612a7f9cac703c8140f878871526af0731cfb830` |
| `family-builder.ts` | `36730115471995a3e53fe654c48453f8b2693d377eb872132d0f51abbe5b3c90` |
| `glasgow-coma-scale.ts` | `79677eac606cbda6ed41f6492c1c8bbd8a0796dd029f8aaee8f014786b176230` |
| `hidradenitis-suppurativa.ts` | `92c06f9ebdc19f13796d6204879219d8d649174d14657171f506e02d970f38e7` |
| `parastomal-hernia.ts` | `5596e9da87233725090670c6b4119ea08ef9368a3fdcaac6de79d9707da9351b` |
| `pre-endoscopy-batch.ts` | `566a9084ac4e9657b2f12675bfb7c220cf1e9f77fc018ebf420810ec415ee86d` |
| `primary-midline-hernia.ts` | `22080f74dc3501eedc2a96fc4184640fdb5cda9488486e24d4e8ad93057fcee5` |
| `secondary-lymphedema.ts` | `e00d8385f18fdd40d6d0a1c340b9bcc3e6d3aea2409d36315a515aed38d18740` |
| `small-bowel-obstruction.ts` | `47c0b4e26b38c515acfa3c4ceec61acbdd10bdf3870cb3f41496e4a46b8b28e3` |
| `source-catalog.ts` | `e1c6343a49be15c2a8059f669d395abc8433b9cec3db38f44342cfa472b0b7a2` |
| `spec-utils.ts` | `eb8c1148096fd087bc5738a26edaafee525054ef379091cb88afbe745a040e07` |
| `stoma-prolapse.ts` | `4170aada08557a6024c4a72477cc8dbf10689ae49c4d08b6f5c5d9c668309326` |
| `varicose-veins.ts` | `0b8a53ded375c6f2a7283abe309462c59b9e90085b786a950b3b9700315fcf7c` |

## Final acceptance results

- Full affected suites: **199 files, 1,739 tests passed** (98.26 seconds).
  Command: `node node_modules/vitest/vitest.mjs run --exclude '.local-dev/**' --maxWorkers=2 packages/clinical-content packages/game-domain apps/player/src packages/balance-config`.
  This includes the sustained eight-day diagnostic and all admission/withdrawal
  guards. Initial stale allowlists/snapshot were corrected; none were disabled.
- New direct package checks: 10; focused authoring guards: 21; all clinical
  content: 370. These are subsets of the full acceptance, not extra totals.
- Actual domain flows include every new node with correct/wrong answers,
  corrected-forward continuation, independent selection, terminal orders,
  onsite/offsite routes, competing-resource queue/release, hidden results,
  returned updates, save/reload and patient departure.
- All eight TypeScript configurations across seven workspaces pass. Runtime
  dependency boundaries (1,018 tracked paths) and launcher protocol 1 pass.
- Isolated Vite production build passes; existing large-bundle warning remains
  (5.36 MB uncompressed main JS). Owner build output was not replaced.
- Desktop Chrome browser acceptance: **3 passed**, 59.3 seconds. Varicose
  wrong-answer/reload/returned-plan flow, standalone GCS and independent hernia
  verified. Browser does not assert post-resolution departure; domain tests do.
  Parent inspected all six screenshots. The returned decision uses the existing
  scrollable chart; final choice and feedback remain reachable and were clicked.
- Parent independently checked all 15 normalized source fingerprints and deep
  equality of every prior concept/case (including embedded nodes). Scoped
  whitespace checks pass. Final snapshot supply matches the table above.

Owned final browser server PID 47924 was stopped and port 4317 verified closed.
Final suite log: `.local-dev/gs028-final-suites-pass.log`; immutable final capture:
`.local-dev/gs028-20260928-baseline/after-final/`. Tests are technical/editorial
acceptance only and do not alter the clinical review status.
