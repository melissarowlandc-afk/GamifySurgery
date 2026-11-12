# Question supply and ABSITE coverage gaps — 2026-11-04

The bank has a late-progression supply problem: the measured pre-N1 patient pool gains **23 concepts at Level 3 and nine at Level 4**. The arrival timer does not progressively lengthen as the pool shrinks. When no complete encounter is unseen or due, a scheduled opportunity produces **no patient**, then schedules another opportunity. New wording variants do not add unseen-concept opportunities.

This explains a plausible mechanism for Melissa's report, not a diagnosis of her private campaign. No owner save, per-question correctness data, exposure telemetry, browser storage or cloud data was read. Earlier progression alone does not demonstrate exhaustion: the modeled minimal-XP history still has a substantial unused pool near Level 4.

## Method and provenance

Offline experiment: `node --disable-warning=ExperimentalWarning tools/question-new-n1/measure.mjs before` (the captured pre-N1 run) and `... measure.mjs after` (integrated additions). Exact machine-readable measurements, assumptions and release hashes are in `.local-dev/question-new-content-20261104/supply-before.json` and `supply-after.json`. Topic mappings and room/capability details are in [the coverage data](question-coverage-gaps-20261104.json). Regenerate the current topic map with `node --disable-warning=ExperimentalWarning tools/question-new-n1/coverage.mjs`.

The topic frame comes exclusively from the locally recorded **public ABSITE content outline**, using the October 3 project-authored semantic audit and the official-source registry. No SCORE framework, proprietary teaching corpus, examination item or recalled question was used for this analysis. Category assignments are editorial inferences from each objective, not mappings supplied by ABS. Short normalized topic identifiers are used without copying the outline's prose or weighting table.

Coverage source record: **`source.abs.absite-content-outline.2021`** — American Board of Surgery. *General Surgery In-Training Examination (ABSITE) Content Outline*. Updated January 2021. American Board of Surgery; 2021. Organization/author: American Board of Surgery. Official [ABS content-outline page](https://www.absurgery.org/resources/exam-content-outlines/general-surgery-in-training-examination-absite-content-outline/). Actual recorded access: **2026-10-03**; local receipt checked 2026-11-04. Source class: official examination-outline bibliographic metadata. Rights: copyrighted, targeted topic verification only; no reusable source text asserted. Intended use: topic structure and coverage cross-check; **no clinical claims** supported. Authority: authoritative for the examination's published structure, independent of license permissiveness. Earlier July 25 PDF checksum receipt: `1df9fca970d5d6307b57d76e54f784c4e3763197b851bfcb960d2939354754c5`. Network was prohibited, so current website/outline changes have **not** been verified. The complete source record is included in [the N1 source ledger](sources-question-new-n1-20261104.json).

## Supply census before N1

The initial snapshot contained **414 registered IDs**, **402 active scored identities** (386 patient and 16 employee-discussion concepts), and **12 registered identities with no active case**. There were 1,110 cases, including employee discussions; case count is not distinct concept count. The simultaneous rewrite lane subsequently added version identities while retaining old definitions. The N0 snapshot and the exact current pre-N1 assembly are distinguished in the generated data; changes from the other lane are not credited to N1.

The following cumulative patient census assumes every stage-compatible required capability is operational. Employee discussions are separate and cannot substitute for ordinary patient supply.

| Numeric facility stage | Patient cases | Active patient concepts | Additional concepts unlocked | Distinct question variants | Unseen patients before no complete case is eligible, 16 seeds | Stranded unseen concepts |
|---|---:|---:|---:|---:|---:|---:|
| 0 | 640 | 189 | 189 | 687 | 169–178 | 0–2 |
| 1 | 899 | 318 | 129 | 1,151 | 238–247 | 6–11 |
| 2 | 964 | 354 | 36 | 1,254 | 261–269 | 7–12 |
| 3 | 1,030 | 377 | 23 | 1,338 | 280–288 | 8–12 |
| 4 | 1,050 | 386 | 9 | 1,358 | 290–298 | 8–12 |

These are cold-campaign bounds at a fixed real time, with native FSRS `Good` reviews after each selected encounter. Several encounters introduce two concepts. Every concept in a paired encounter must be unseen or due, so learning one companion elsewhere can strand an unseen objective. Level 0's ordinary recovery admission also has a special progression stop; its inventory is not a promise that every Level 0 item is visited before leveling up.

Educational tier is recorded separately from facility stage. Some inherited concepts have no consistent explicit tier; they remain unclassified rather than being inferred from a room or level.

Educational tier is not an input to the current routine selector or its arrival timer. The tier table describes supply; it does not imply different cadence settings or permission to collapse tier into facility level.

| Stage | Tier 0 concepts / variants | Tier 1 concepts / variants | Unclassified concepts / variants |
|---|---:|---:|---:|
| 0 | 91 / 357 | 63 / 208 | 35 / 122 |
| 1 | 148 / 578 | 134 / 449 | 36 / 124 |
| 2 | 157 / 609 | 152 / 502 | 45 / 143 |
| 3 | 159 / 613 | 173 / 582 | 45 / 143 |
| 4 | 162 / 621 | 179 / 594 | 45 / 143 |

Without installed capability requirements, the available concept upper bounds are 188, 306, 327, 350 and 350 at stages 0–4. In particular, the existing Level 4 pediatric expansion needs its actual examination-room semantics and capabilities. An unlocked level does not establish installed rooms, staff, access or operational readiness.

## Progressed-campaign experiments

Synthetic histories use the shipped FSRS adapter, the actual per-level XP thresholds (10, 150, 300, 500, 750), and explicit two-real-minute chart pacing. XP resets at each level. Construction, cash and procedure witnesses are not fabricated as measured owner behavior. The tests model their possible delay by increasing encounter volume before a stage change. They do not derive a typical-player correctness rate.

| Scenario, 16 seeds | At the end of modeled Level 3 / near Level 4 | After modeled Level 4 |
|---|---|---|
| Minimum XP, every review Good | 62–73 cumulative encounters; 96–99 concepts reviewed; 212–223 further currently eligible patient opportunities | 115–127 encounters; 171–174 reviewed concepts; 167–177 further opportunities |
| Twice the XP encounter volume, all Good | 131–143 encounters; 192–195 reviewed concepts; 142–150 further opportunities | 260–268 encounters; 342–345 reviewed concepts; 29–34 further opportunities |
| Twice the volume, every fifth encounter Again | 154–176 encounters; 186–191 reviewed concepts; 16–20 due-review patients during Level 3 | 300–322 encounters; 326–335 reviewed concepts; 28–30 due-review patients during Level 4 |
| Four times the XP volume, all Good | Supply stops after 277–288 cumulative encounters, before the modeled Level 3 target, in all 16 seeds | Moving the scenario to Level 4 adds exactly nine patients, then stops again |

The final row deliberately advances the *scenario's* level after a blocked stage to measure incremental supply; it is not evidence that the ordinary progression command could satisfy that blocked target. There is no measured typical-player exhaustion count. Construction delay, speed, repeat timing and days between sessions can put campaigns with the same level in very different supply states.

Native reducer probes isolate content eligibility from capacity: an unseen case admits one patient, the same future-due case admits zero, and a due-now case admits one. The future-due probe still sets another routine deadline. At Levels 3–4 the configured ordinary interval remains 60 ± 15 facility minutes before advertising; Level 1 has a separate 50 ± 12 cadence. The scheduler reads real-world FSRS due times, so accelerating facility time does not make reviews due sooner. Due reviews have priority over unseen concepts and can create recognizable repetitions even while some unseen content remains.

## Supply target and priority order

Editorial planning assumption: a two-hour focused session at two minutes per chart uses about 60 patient opportunities. A 25% reserve gives 75 independently selectable opportunities; 75–100 newly unlocked concepts per major expansion is a useful provisional target when those concepts have standalone coverage. This is a capacity assumption, not a clinical probability, measured engagement target or alteration of FSRS.

| Level | Measured newly unlocked concepts | Suggested additional concepts before N1 | N1 contribution | Further additions after N1 to reach 75–100 newly unlocked concepts |
|---|---:|---:|---:|---:|
| 0 | 189 initially | None for this supply issue | 0 | None; retain tutorial/recovery purpose |
| 1 | 129 | No bulk supply addition indicated | 0 | Address quality and thin topics as needed |
| 2 | 36 | 39–64 | 0 | 39–64 |
| 3 | 23 | 52–77 | 28 | 24–49 |
| 4 | 9 | 66–91 | 12 | 54–79 |

N1 adds **40 independently selectable patients** if the prior catalog is exhausted: one scored concept per case, no paired companion. A second variant would improve representation on a due review but would not add another unseen-concept arrival. A finite bank cannot promise uninterrupted new cases for an arbitrarily long session under the current due policy.

1. **Next highest priority: practical fluids, nutrition, critical care and coagulation decisions at Levels 3–4.** Expand interpretation of actual laboratory/physiology records and concrete next actions. Current patient coverage remains thin in several of these areas; new management rules need current permitted sources and atomic verification before authoring. Do not fill the gap with unsupported numbers or relabel a familiar objective as a new FSRS identity.
2. **Core abdominal and alimentary decisions.** Add small-bowel, gastric and pancreatic reasoning with source-backed findings, not more superficially different hernia or biliary recognition stems. Use existing CT, ultrasound, laboratory and endoscopy pathways. Advanced hospital decisions can be honestly represented as outside-record review; no hospital operation should be simulated through a clinic service.
3. **Perioperative and vascular-access application.** Develop assessment of changed findings, testing adequacy and actual procedure/medicine choices, with source support for close competitors. The small vascular-access pool is a useful gap, not a license to invent access thresholds or intervention rules.
4. **Thin specialty and cross-cutting areas.** Thoracic, transplantation, nervous-system, radiology and geriatric decisions need further source review and representable scenarios. Existing pediatric cases use a constrained supported outpatient lane; do not add enacted pediatric tests or adult art to increase a count.
5. **Keep breast/endocrine expansion selective.** These are already large areas. N1 uses previously verified, unadmitted breast objectives because network verification was excluded; its twelve breast additions are not a recommendation to keep that proportion in future batches. Several phyllodes target and mechanism items need an independent difficulty review and may need later consolidation or revision. No retirement or FSRS merge is applied here.

## Facility and execution fit

| Level | Relevant newly unlocked rooms | Honest question scope |
|---|---|---|
| 0 | Founder desk, examination | Clinic interpretation, counseling and emergency referral; no new diagnostic route assumed |
| 1 | Ultrasound, minor procedure, imaging control; waiting/bathroom support | Supported ultrasound/minor-procedure pathways and clinic review of externally obtained studies |
| 2 | CT, X-ray/fluoroscopy, phlebotomy, endoscopy, recovery; training/support | Supported imaging, specimen collection, endoscopy and outside specialist plans; actual service eligibility still needs rooms/staff/access |
| 3 | Ambulatory OR, in-house laboratory, pharmacy, radiology reading, surgeon office and support | Existing clinic/perioperative care and review of hospital records; these rooms do not supply an ICU, blood bank or major hospital surgery |
| 4 | MRI, pediatric waiting/examination, wound/ostomy | MRI and supported specialty expansion; adult clinic decisions remain distinct from constrained pediatric presentation rules |

Every N1 case remains a clinic encounter. Testing choices use existing timing profiles with exact label bindings, including distractors. They are explicitly `not_executed/external_only`: no new room, blood product, operation, timed result gate, procedure or live external order is added. The plan and record-review distinctions must survive independent review.

## N1 result and holds

The table below counts patient concepts separately from all active scored concepts (which also include employee discussions). Pre-N1 means the current integrated rewrite pipeline immediately before the N1 append; the earlier N0 census is a separately frozen snapshot. Neither count is an ABSITE weight or a clinical-approval count.

<!-- BEGIN N1_COVERAGE_TABLE -->

| Public-outline topic identifier | Pre-N1 patient concepts | With N1, Level 3 | With N1, Level 4 | N1 additions | All active scored concepts |
|---|---:|---:|---:|---:|---:|
| Abdomen-General | 1 | 2 | 3 | 2 | 3 |
| Hernia | 20 | 22 | 22 | 2 | 22 |
| Biliary | 19 | 20 | 20 | 1 | 20 |
| Liver | 6 | 6 | 7 | 1 | 7 |
| Pancreas | 6 | 6 | 6 | 0 | 6 |
| Spleen | 5 | 5 | 5 | 0 | 5 |
| Alimentary-Esophagus | 15 | 15 | 15 | 0 | 15 |
| Alimentary-Stomach | 14 | 15 | 16 | 2 | 16 |
| Alimentary-SmallIntestine | 5 | 8 | 9 | 4 | 9 |
| Alimentary-LargeIntestine | 26 | 26 | 26 | 0 | 26 |
| Alimentary-Anorectal | 17 | 17 | 17 | 0 | 17 |
| Endoscopy | 6 | 6 | 6 | 0 | 6 |
| Breast | 28 | 36 | 40 | 12 | 40 |
| Endocrine | 30 | 31 | 31 | 1 | 31 |
| SkinSoftTissue | 28 | 28 | 28 | 0 | 28 |
| SurgicalCriticalCare | 3 | 4 | 4 | 1 | 4 |
| Trauma | 8 | 9 | 9 | 1 | 9 |
| VascularArterial | 13 | 13 | 13 | 0 | 13 |
| VascularVenous | 7 | 8 | 9 | 2 | 9 |
| VascularAccess | 2 | 2 | 2 | 0 | 2 |
| Transplantation | 3 | 3 | 3 | 0 | 3 |
| Thoracic | 4 | 4 | 5 | 1 | 5 |
| Pediatric | 8 | 0 | 8 | 0 | 8 |
| Plastic | 6 | 6 | 6 | 0 | 6 |
| GU | 4 | 4 | 4 | 0 | 4 |
| Gynecology | 2 | 2 | 2 | 0 | 2 |
| HeadNeck | 5 | 5 | 6 | 1 | 6 |
| NervousSystem | 2 | 2 | 2 | 0 | 2 |
| Anesthesia | 6 | 6 | 6 | 0 | 6 |
| BiostatisticsEvidence | 3 | 3 | 3 | 0 | 17 |
| FluidsElectrolytesAcidBase | 7 | 8 | 8 | 1 | 8 |
| GeriatricEndOfLife | 3 | 3 | 3 | 0 | 3 |
| Immunology | 8 | 8 | 8 | 0 | 8 |
| InfectionAntimicrobial | 7 | 7 | 7 | 0 | 7 |
| MISPrinciples | 8 | 8 | 8 | 0 | 8 |
| NutritionMetabolism | 6 | 9 | 10 | 4 | 10 |
| OncologyTumorBiology | 4 | 4 | 4 | 0 | 4 |
| Pharmacology | 4 | 5 | 5 | 1 | 5 |
| PreopPeriop | 10 | 10 | 10 | 0 | 10 |
| TransfusionCoagulation | 7 | 10 | 10 | 3 | 10 |
| WoundHealing | 6 | 6 | 6 | 0 | 6 |
| Radiology | 3 | 3 | 3 | 0 | 3 |
| Outcomes | 2 | 2 | 2 | 0 | 4 |
| Ethics | 10 | 9 | 10 | 0 | 10 |

<!-- END N1_COVERAGE_TABLE -->

The [key-first technical packet](question-new-n1-20261104.json) contains forty concepts/cases and forty variants, 28 at Level 3 and 12 at Level 4. It distinguishes **17 newly authored decision identities** from **23 preserved previously unadmitted identities**. Calling these forty newly invented meanings would be inaccurate; retaining those 23 IDs follows the stable-concept discipline. All new exact versions, profiles, claims and source-record versions remain `needs_clinician_review`. Original deferred packages and exact original approvals remain unchanged.

The [clinical source ledger](sources-question-new-n1-20261104.json) records 85 atomic claims, 68 clinical source records, inherited verification IDs, source access dates, authority, rights and single-source limitations. No fresh clinical or outline retrieval occurred. New source freshness, exact clinical option ranking, difficulty, independent adversarial review, manager acceptance and any public release remain open. The seventeen proposed new construct boundaries also need a clinical deduplication review against their explicitly listed nearest existing objectives. The packet is a technical review artifact, not owner-page clinical approval.

No existing question/concept definition, FSRS rule, arrival timer or Level 5 evidence binding was changed. Registry and exact non-execution appends plus narrowly scoped legacy-test integration are listed in the ExecPlan/handoff. The manager must rebind the changed Level 5 inputs in its release tree after accepting the exact integrated versions.
