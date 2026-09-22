# Bread-and-butter concepts: owner-delegated editorial receipt

September 17, 2026. Version `development-batch.2026-09-17.bread-and-butter.1`.
The owner authorized independent creation, editorial approval and implementation.
Root accepts this version editorially for the explicitly unapproved prototype.
All new clinical records remain `needs_clinician_review`, with null clinician
review and no clinician sign-off. Public clinical release is not authorized.

## Exact scope

20 new scored concepts, four variants each: 80 questions across 52 encounters.
24 single-step and 28 two-step encounters; 16 diagnostic-result gates and 12
same-visit pairs. 208 patient profiles, 22 evidence claims, 23 sources and 80
timing entries. Case counts at internal stages 0/1/2: 28/20/4.
Emergency wound cases teach immediate transfer without outpatient test delay.

Complaints are 2-3 words, authored presentations 23-40 (median 32), prompts 5-9.
Runtime names may add a word. Names, age, sex and character remain coherent;
answers shuffle. Every diagnostic alternative, including distractors, gets a
runtime estimate. Durations remain gameplay placeholders pending the existing
future facility-dependent timing design.

| Stable scored ID | Objective | First facility level |
| --- | --- | --- |
| `concept.breast-mass.image-guided-core-biopsy` | Core biopsy of a suspicious solid breast mass | 2 |
| `concept.fibroadenoma.concordant-observation` | Observation of a concordant fibroadenoma | 2 |
| `concept.cutaneous-abscess.equivocal-ultrasound` | Ultrasound for equivocal superficial abscess | 2 |
| `concept.cutaneous-abscess.incision-drainage` | Drainage of a confirmed cutaneous abscess | 2 |
| `concept.inguinal-hernia.selected-watchful-waiting` | Watchful waiting for selected inguinal hernia | 1 |
| `concept.femoral-hernia.timely-elective-repair` | Timely elective repair planning for femoral hernia | 1 |
| `concept.inguinal-hernia.indirect-vessel-relationship` | Indirect inguinal hernia vessel relationship | 2 |
| `concept.inguinal-hernia.lateral-femoral-cutaneous-localization` | Lateral femoral cutaneous nerve sensory pattern | 2 |
| `concept.high-output-ileostomy.renal-electrolyte-magnesium-assessment` | Laboratory assessment of high-output ileostomy losses | 2 |
| `concept.high-output-ileostomy.sodium-glucose-oral-rehydration` | Sodium-glucose oral rehydration for high-output ileostomy | 2 |
| `concept.perianal-abscess.prompt-drainage` | Prompt drainage of a perianal abscess | 1 |
| `concept.perianal-abscess.selective-antibiotics` | Selective antibiotics after perianal abscess drainage | 1 |
| `concept.perioperative-medication.continue-chronic-beta-blocker` | Continuation of a chronic beta blocker | 2 |
| `concept.perioperative-medication.warfarin-interruption-no-bridge` | Warfarin interruption without routine bridging | 2 |
| `concept.postoperative-prophylaxis.stop-antibiotics-at-closure` | Stop surgical prophylactic antibiotics after closure | 3 |
| `concept.postoperative-prophylaxis.extended-cancer-vte-prevention` | Extended VTE prophylaxis after selected cancer surgery | 3 |
| `concept.postoperative-retention.bladder-scan` | Bladder scan for postoperative inability to void | 1 |
| `concept.postoperative-retention.catheter-decompression` | Catheter decompression of symptomatic retention | 1 |
| `concept.superficial-incisional-ssi.open-drain` | Source control for superficial incisional infection | 1 |
| `concept.fascial-dehiscence-evisceration.emergency-transfer` | Emergency response to abdominal evisceration | 1 |

## Curriculum and evidence

The public ABSITE outline establishes broad domain alignment, not individual
question frequency. The [public SCORE 2025-2026 outline](https://absprodeus2scorestor.blob.core.windows.net/score/curriculumoutline_gs.pdf)
was verified September 17: hernia page 3, ileostomy 8, anorectal 9, breast 10,
acute urinary retention 19, perioperative/VTE/wounds 23 (physical pages).
PDF SHA256 `2b98112b218e0b612fe6ea2f8ad5cf7c6f4555d79289c2f569234aa6b5748c09`.
No proprietary SCORE modules, textbooks or question banks were used.

Clinical facts have separate atomic claims and source metadata in family files:
HerniaSurge, ASCRS, IDSA, ACEP, ASBrS/SBI, ACR, URECA/NIDDK, BIFA/BAPEN, AHA,
CHEST, SHEA/IDSA and SEOM guidance plus permitted literature. Original questions
and explanations were synthesized independently. The owner sheet informed
candidates only. Authority, reuse limits and single-source limitations are
recorded. See the [source contract](../../execplans/bread-and-butter-source-contract-2026-09-17.md)
for detailed scope and corrections.

## Integration and review

Integrated release: 183 concepts / 450 cases / 703 nodes. Root deep-compared all
prior 163 concepts and 398 cases (including 623 nodes) against an immutable
pre-edit snapshot: unchanged.

One new bedside bladder-scan service/profile explicitly keeps the patient onsite.
The marker is frozen and preserved across save/restore, prevents invented off-site
travel and retains the examination-room reservation. Old routes keep legacy
behavior. Five ticks is an editorial placeholder, not a clinical turnaround claim.

Sol researched/authored the families and implemented 72 complete reducer-flow
regressions plus the bedside fix. Terra integrated the batch and added admission,
presentation and release-regression checks. Root reviewed actual content,
provenance corrections, tests and production diffs, then ran acceptance checks.

## Validation

Root independently passed full suites: clinical 360/360, game domain 466/466,
player 445/445, balance 15/15: **1,286 passing tests**. All seven workspace
typechecks, dependency/launcher boundaries and isolated production build pass.
Scoped production diff whitespace checks pass. The domain suite passed with two
workers after the initial concurrent run exposed a load timeout in an older test
and a stale deterministic supply snapshot; assertions were retained. The updated
eight-day supply regression completes all 79 arrivals without walkouts or unresolved
patients. Tests cover all 52 new encounters, 80 nodes, 16 gates, save/restore,
FSRS identity/idempotence, stage eligibility, coherent demographics and every
rendered diagnostic-choice estimate. Root inspected the tests and bedside fix.

No new browser visual acceptance is claimed. The existing bundle-size warning
remains. Canonical launcher/server/profile and owner saves were untouched.
Local playtest: `START_GAME.cmd`, `http://127.0.0.1:4173`.
This batch is local, not committed, pushed or deployed. Keep GS-006 open.
Remind the owner to say **"push to GitHub"** for a scoped backup.

## Accepted content fingerprints

SHA256 of UTF-8 text normalized to LF. Twelve authoring/helper/aggregate files;
tests excluded.

| File | SHA256 |
| --- | --- |
| `batch-helpers.ts` | `5bf5bdd4545d82212820fbbf200d12eb3635e29c35d1eead8e903e6233ca7806` |
| `bread-butter-batch.ts` | `51d84ccb5832403042a3f58f9670097ad941bc87c3b815bb34bbfe08a092e985` |
| `breast-mass.ts` | `d698be95d3275af70a8f100e9676613ccd054b6c5991fa02ec86a308ce677d04` |
| `cutaneous-abscess.ts` | `19e6e82f3a2f648e6b9fc7e3ef7e7217f9dd0f71d4b3d59da7272a8519c675c2` |
| `groin-hernia-management.ts` | `23eb3dbe74a16ad1d55531a1a70ceaf5165403ee89c7a6708dc47d758a23f3a0` |
| `hernia-anatomy.ts` | `2e3309ac23f2b234776b6fd5ab720bb99c95faf621ec10860da5f23204696792` |
| `high-output-ileostomy.ts` | `c32a04d5851e64224488c87dace9c5ea9157a7af71fb7e67470d0de42863d6a1` |
| `perianal-abscess.ts` | `4cff5c84f66fd5f3df3759a3af5373b9bf105087689e3b7f6981e200e1e56240` |
| `perioperative-medications.ts` | `37fd883b6a22777d86b9ddc22d783271288c29be4ea15d331854bb6625b4619a` |
| `postoperative-prophylaxis.ts` | `4258655e53eecf17c8760887140df0a19fcf342ab4b893e50482c79987788ffc` |
| `postoperative-urinary-retention.ts` | `3ffcadb9cf128f8f8479d46eb5a4679aac05c29ff6a43976f071dc5d316e3e2b` |
| `postoperative-wounds.ts` | `b03d9c094d68fbdad793b46ca91ebd0408b9654d3a4fe2a42eb4adce990c9c99` |

## GS-021 operational amendment — September 17, 2026

The owner-approved GS-021 service catalog requires newly admitted cases whose correct final action is a local minor procedure to have the installed minor-procedure capability. This operational amendment adds that admission capability gate to the already-authored cutaneous-abscess drainage and superficial-incisional-infection drainage cases. It does not change teaching text, answer keys, evidence claims, review status, or represent new clinician approval.

The previously recorded LF-normalized SHA-256 values were ea08d9ba4597c5732d6a0c7a549ac24b1907c88b94d27786db217580048378e2 for cutaneous-abscess.ts and 5bfafd1f2fe050e73cdc291931ca4eabe75dfe7f4585ded746bdf60f5f254cbd for postoperative-wounds.ts. The canonical table now records the replacement operationally amended source hashes.
