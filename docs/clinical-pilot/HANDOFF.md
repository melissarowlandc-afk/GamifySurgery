# Five-diagnosis clinical-content pilot handoff

Status: AI-assisted draft, `needs_clinician_review`

Content version: `pilot.2026-07-29.4`

Source check date: 2026-07-29

## Implementation summary

This pilot implements reusable, source-traceable Level 0-1 content for exactly
five diagnosis families:

1. simple traumatic laceration;
2. uncomplicated cutaneous abscess;
3. symptomatic cholelithiasis presenting as biliary colic;
4. adult inguinal hernia; and
5. suspected acute appendicitis.

It remains inside the existing `synthetic_unapproved_prototype` release and
does not publish a clinically approved release. Adjacent diagnoses are red
flags or differentials only. No full curriculum, unavailable clinical service,
definitive inpatient treatment, gameplay-time web retrieval, or gameplay-time
AI call was added.

| Registry item | Count |
|---|---:|
| Diagnosis families | 5 |
| Presentation phenotypes | 15 |
| Concepts | 15 |
| Independently written question variants | 30 |
| Encounter templates | 15 |
| Atomic evidence claims | 32 |
| Source records | 21 |

Each family has one Level 0 and two Level 1 phenotypes, one Level 0 and two
Level 1 concepts, and two independently written variants per concept. Every
Level 0 template has exactly one scored decision; every Level 1 template has
one or two. Each scored decision has exactly one `primaryConceptId`.

All new diagnoses, phenotypes, evidence claims, concepts, variants,
explanations, distractor rationales, chart summaries, and projected cases
remain `needs_clinician_review` and record AI-assisted drafting.

## Existing architecture and pilot mapping

The implementation extends the functioning runtime instead of introducing a
parallel encounter engine.

| Requested concern | Existing implementation retained | Pilot mapping |
|---|---|---|
| Clinical release | `SyntheticClinicalRelease` provided through the game-domain context | The release ID remains `clinical.synthetic.prototype.v1`; item-level `contentVersion` identifies the new draft |
| Runtime cases | `SyntheticClinicalCase`, `DecisionNode`, result gates, and terminal outcomes | `PILOT_REGISTRY` validates families, phenotypes, sources, claims, concepts, variants, physiology overlays, and templates, then projects them into the existing case shape |
| Patient generation | Encounter creation already assigns independent identity/portrait data and freezes a case | A deterministic, presentation-only pilot materializer adds constrained adult demographics, BMI, findings, and physiology before the existing freeze step |
| Questions | One `primaryConceptId` per scored `DecisionNode` | Two wording variants retain the same correct clinical meaning and concept ID |
| FSRS | Campaign histories are keyed by stable concept ID | Wording variants share one history; a substantive future concept change must receive a new concept ID/version |
| Saves | Saves pin the clinical release and persist frozen cases | The release ID is unchanged, so existing saves and already-frozen cases continue to load |
| Facility progression | Balance configuration owns facility level, rooms, staff, and services | Educational tier, acuity, facility-stage gate, capability requirement, and disposition are separate fields |
| Current services | The clinic has only its configured routes | The pilot does not invent ultrasound or CT and does not substitute plain X-ray |
| Chart back | Learning information becomes available after encounter completion | Completed pilot charts render five concise claim-linked sections and a source/review disclosure |
| Administrative review | The existing `DevelopmentPanel` contains prototype-owner tools | A nested pilot preview selects diagnosis, phenotype, tier, concept, variant, and deterministic seed |

The three existing stable concept IDs are retained where their clinical meaning
remains unchanged:

- `concept.prototype.laceration.tetanus`
- `concept.prototype.abscess.primary-treatment`
- `concept.prototype.cholelithiasis.management`

## Family, phenotype, concept, and capability inventory

| Family | Phenotypes | Concepts | Capability and disposition boundary |
|---|---|---|---|
| `traumatic_laceration` | L0 `phenotype.laceration.clean-superficial.l0`; L1 `phenotype.laceration.tetanus-decision.l1`; L1 `phenotype.laceration.deep-structure-concern.l1` | L0 `concept.laceration.preclosure-assessment`; L1 `concept.prototype.laceration.tetanus`; L1 `concept.laceration.deep-structure-referral` | `capability.examination`; clinic treatment, procedural referral, or prompt specialist-capable evaluation according to phenotype |
| `cutaneous_abscess` | L0 `phenotype.abscess.localized-fluctuant.l0`; L1 `phenotype.abscess.nonpurulent-differential.l1`; L1 `phenotype.abscess.rapid-spread.l1` | L0 `concept.prototype.abscess.primary-treatment`; L1 `concept.abscess.collection-vs-cellulitis`; L1 `concept.abscess.rapid-spread-escalation` | `capability.examination`; Level 0 arranges drainage in an equipped setting because the current clinic does not claim a procedure capability |
| `symptomatic_cholelithiasis` | L0 `phenotype.biliary.known-stones-stable.l0`; L1 `phenotype.biliary.needs-ultrasound.l1`; L1 `phenotype.biliary.complication-red-flags.l1` | L0 `concept.prototype.cholelithiasis.management`; L1 `concept.cholelithiasis.ultrasound-evaluation`; L1 `concept.cholelithiasis.red-flag-transfer` | `capability.examination`; elective referral, offsite outpatient testing, or ED transfer; no plain-X-ray substitution |
| `inguinal_hernia` | L0 `phenotype.inguinal-hernia.l0-reducible-symptomatic`; L1 `phenotype.inguinal-hernia.l1-minimally-symptomatic-man`; L1 `phenotype.inguinal-hernia.l1-acutely-irreducible` | L0 `concept.inguinal-hernia.reducible-symptomatic-referral`; L1 `concept.inguinal-hernia.watchful-waiting-population`; L1 `concept.inguinal-hernia.acute-irreducibility-transfer` | `capability.examination`; watchful waiting is population-limited, while painful acute irreducibility transfers |
| `acute_appendicitis` | L0 `phenotype.acute-appendicitis.l0-classic`; L1 `phenotype.acute-appendicitis.l1-early-incomplete`; L1 `phenotype.acute-appendicitis.l1-no-onsite-imaging` | L0 `concept.appendicitis.classic-pattern-urgent-disposition`; L1 `concept.appendicitis.incomplete-pattern-recognition`; L1 `concept.appendicitis.no-delay-for-unavailable-test` | `capability.examination`; the outpatient encounter ends at prompt ED transfer without waiting for unavailable imaging |

`clinicalProbability` statements are qualitative evidence relationships.
Centralized `simulationWeight` values are explicitly editorial sampling choices,
not prevalence claims. Names, portraits, and nonclinical characteristics remain
independent of disease selection; race and ethnicity are not selection
variables. Optional-finding categories are not converted to numeric symptom
rates: the materializer deterministically selects one available category and
one detail for wording variety, with no clinical-frequency interpretation.

## Representative generated patients

The generated review packet includes all 15 phenotype/template combinations.
These ten fixed-seed examples satisfy the requested one Level 0 and one Level 1
patient per family. They are contradiction-review fixtures, not prevalence
samples.

| Family / tier | Template and seed | Generated patient | Generated vitals | Key generated findings |
|---|---|---|---|---|
| Laceration L0 | `case.prototype.tutorial-laceration`, `review-1` | 34-year-old man; BMI 23.0; no meaningful comorbidity | HR 89, BP 117/78, 97.9 F, SpO2 98% | Clean superficial hand laceration; controlled bleeding; recent sharp-object mechanism |
| Laceration L1 | `case.pilot.laceration-tetanus`, `review-0` | 50-year-old woman; BMI 33.1; no meaningful comorbidity | HR 60, BP 100/69, 99.0 F, SpO2 97% | Superficial wound; completed primary series; last-dose date available; controlled bleeding |
| Abscess L0 | `case.prototype.abscess`, `review-0` | 44-year-old man; BMI 21.0; no meaningful comorbidity | HR 85, BP 110/69, 98.5 F, SpO2 95% | Localized fluctuant accessible collection; purulent focus; no systemic illness |
| Abscess L1 | `case.pilot.abscess-rapid-spread`, `review-1` | 33-year-old man; BMI 29.7; no meaningful comorbidity | HR 97, BP 116/64, 97.7 F, SpO2 95% | Suspected purulent collection with rapidly progressive surrounding inflammation and subjective chills |
| Biliary L0 | `case.prototype.symptomatic-cholelithiasis`, `review-0` | 43-year-old woman; BMI 26.4; no meaningful comorbidity | HR 66, BP 118/74, 98.3 F, SpO2 98% | Credible prior ultrasound with gallstones; recurrent episodic upper-abdominal pain; currently stable |
| Biliary L1 | `case.pilot.cholelithiasis-ultrasound`, `review-1` | 54-year-old man; BMI 23.2; no meaningful comorbidity | HR 81, BP 119/74, 98.2 F, SpO2 96% | Resolved episodic pain; no definitive prior gallbladder imaging; no fever, jaundice, or peritoneal tenderness; prior plain radiograph was nondiagnostic |
| Hernia L0 | `case.pilot.inguinal-hernia-reducible-referral`, `review-1` | 34-year-old woman; BMI 21.6; no meaningful comorbidity | HR 95, BP 106/73, 98.1 F, SpO2 97% | Documented inguinal hernia; reducible bulge; discomfort now limits activity |
| Hernia L1 | `case.pilot.inguinal-hernia-watchful-waiting`, `review-2` | 45-year-old man; BMI 24.2; no meaningful comorbidity | HR 86, BP 113/79, 98.6 F, SpO2 95% | Documented reducible inguinal hernia; no activity-limiting pain; asks about observation |
| Appendicitis L0 | `case.pilot.appendicitis-classic-transfer`, `review-0` | 49-year-old man; BMI 18.9; no meaningful comorbidity | HR 70, BP 120/70, 97.7 F, SpO2 96% | Periumbilical pain migrating to the right lower quadrant with progressive tenderness |
| Appendicitis L1 | `case.pilot.appendicitis-incomplete-multistep`, `review-12` | 28-year-old woman; BMI 23.7; no meaningful comorbidity | HR 98, BP 100/75, 98.2 F, SpO2 97% | Worsening pain with persistent focal right-lower-quadrant tenderness and mild urinary symptoms that do not establish another diagnosis |

## Source manifest and claim matrix

The canonical [source manifest](SOURCE_MANIFEST.md) records complete citation
metadata, stable IDs, organization/journal, year, DOI or official URL, access
date, source class, reuse posture, authority/use role, and linked claims.

| Area | Source IDs |
|---|---|
| Cross-cutting physiology | `src.oer.boundless_cardiac_physiology.2017`; `src.oer.nicolet_vital_signs.2022` |
| Laceration | `src.cdc.tetanus_wound.2025`; `src.wses.traumatic_wounds.2016` |
| Abscess | `src.wses.ssti_pathways.2022`; `src.cdc.mrsa_overview.2025`; `src.bmj.abscess_rr.2018` |
| Biliary | `src.jsge.cholelithiasis.2023`; `src.wses.acute_cholecystitis.2020`; `src.nihr.cgall.2024`; `src.acr.ruq_pain.2022` |
| Inguinal hernia | `src.hernia.herniasurge_2023`; `src.hernia.herniasurge_corrigendum_2024`; `src.hernia.herniasurge_2018` |
| Appendicitis | `src.appendicitis.swedish_2025`; `src.appendicitis.wses_2020`; `src.appendicitis.wses_2025_metadata`; `src.appendicitis.niddk_definition`; `src.appendicitis.niddk_symptoms`; `src.appendicitis.acr_rlq_2022`; `src.appendicitis.sages_2024` |

The [clinician review packet](CLINICIAN_REVIEW_PACKET.md#claim-to-source-matrix)
contains the complete 32-row atomic claim-to-source matrix, including evidence
category, certainty, and limitations. It also contains every concept, both
question variants, correct answers, original explanations, every distractor
rationale, supporting claim/source IDs, all generated examples, and review
status.

The sources used most heavily are:

- CDC wound guidance for exact tetanus prophylaxis, because it is current U.S.
  government guidance that directly supports the scored finite profiles.
- The 2022 WSES multi-society SSTI pathway for abscess source control,
  nonpurulent contrast, and escalation.
- The 2023 JSGE cholelithiasis guideline for stable gallstone presentation,
  ultrasound evaluation, and elective assessment.
- The 2023 HerniaSurge update for population-limited observation and acute
  irreducibility.
- The 2025 Swedish appendicitis guideline for primary-care recognition and
  urgent hospital evaluation.

The two CC BY educational sources only bound narrow editorial physiology
ranges. Restricted sources are metadata or targeted factual cross-checks, not
a prose corpus. No source prose, table, figure, algorithm, illustration, or
question stem is stored.

## Unresolved, conflicting, or deliberately withheld gaps

### Laceration

- No universal closure window or rigid "golden period."
- No routine antibiotic rule, drug, dose, route, or duration.
- Unknown/incomplete vaccination series and severe-immunodeficiency exceptions
  are deferred.
- The clearest distal tendon/nerve source is an older Delphi position paper
  focused on hand wounds; broader extremity rules remain withheld.
- A separate distal perfusion/vascular examination teaching point was withheld
  because the selected hand-wound source does not directly support that exact
  element.
- Exact specialty destination for deeper structural injury remains
  capability- and locale-dependent.

### Abscess

- No antibiotic drug, dose, route, or duration selection.
- No exact same-day or hour-based drainage cutoff; the pilot teaches arranging
  drainage in an appropriately equipped setting.
- Sources do not support a simple "antibiotics always" or "antibiotics never"
  rule after drainage; the disagreement is recorded instead of averaged.
- Packing, culture, anesthesia, recurrent disease, special sites,
  immunocompromise, complex hosts, and deep/necrotizing infection are out of
  scope.
- Cellulitis appears only as a narrow nonpurulent contrast, not as a completed
  diagnosis entry.

### Symptomatic cholelithiasis

- No rigid pain-duration or meal-association cutoff and no demographic
  probability.
- Guidelines favor surgical evaluation, while randomized evidence supports
  discussing short-term conservative management in selected patients;
  long-term comparative outcomes remain uncertain. The pilot therefore does
  not score automatic surgery.
- Acute cholecystitis, choledocholithiasis, cholangitis, and pancreatitis remain
  red-flag differentials rather than completed entries.
- Ultrasound remains offsite; plain X-ray is not a substitute.

### Inguinal hernia

- Watchful waiting is not generalized beyond selected asymptomatic or minimally
  symptomatic adult men.
- Female groin-hernia/femoral-hernia pathways, manual reduction, operative
  timing/technique, and exact strangulation-risk estimates are withheld.
- The 2018 guideline has a CC BY-NC posture and remains a targeted cross-check.

### Appendicitis

- No universal imaging sequence, numeric score threshold, detailed laboratory
  algorithm, or pregnancy/pediatric/complex-host exception.
- The Swedish primary-care recommendation incorporates CRP when available; the
  pilot does not require a test the clinic lacks.
- The plain-X-ray non-substitution point has one direct current specialty
  imaging source and needs focused clinician review.
- WSES 2020 is retained as a cross-check. The newer WSES edition is
  metadata-only because the publisher reserves text/data-mining and AI rights.
- Definitive antibiotics, nonoperative selection, and appendectomy are outside
  the outpatient encounter.

### Cross-cutting

- No precise prevalence, symptom-frequency, age, sex, or BMI probabilities are
  encoded. The disease-independent adult sex mix, broad BMI distribution, and
  encounter weights are editorial review parameters.
- The game did not expose a separate reusable general-adult demographic
  distribution interface; the pilot therefore uses its own small
  disease-independent policy while preserving the existing independent
  name/portrait generator.
- Physiology overlays use source-bounded editorial subsets; they do not define
  individual normality or clinical stability.
- Currentness-only records, such as the 2024 HerniaSurge corrigendum and the
  rights-restricted newest WSES appendicitis metadata, appear in the manifest
  but are not fabricated into substantive clinical claims.
- No clinician approval or last-clinician-review date exists yet.

## Files changed for this pilot

The worktree already contained unrelated user changes. The pilot-specific
surface is:

### Policy, documentation, and verification

- `AGENTS.md`
- `package.json`
- `scripts/generate-clinical-pilot-docs.mjs`
- `scripts/check-clinical-pilot-links.mjs`
- `docs/clinical-pilot/README.md`
- `docs/clinical-pilot/SOURCE_MANIFEST.md`
- `docs/clinical-pilot/CLINICIAN_REVIEW_PACKET.md`
- `docs/clinical-pilot/HANDOFF.md`
- `tests/e2e/clinical-pilot.spec.ts`
- eight `artifacts/screenshots/pilot-*.png` review captures

`docs/clinical-pilot/SOURCE_MANIFEST_LEGACY.md` is a preserved, noncanonical
draft artifact. It is intentionally not linked from the pilot README; the
manifest named `SOURCE_MANIFEST.md` is authoritative for this content version.

### Clinical registry, generator, and tests

- `packages/clinical-content/package.json`
- `packages/clinical-content/src/index.ts`
- `packages/clinical-content/src/pilot-schema.ts`
- `packages/clinical-content/src/pilot-generator.ts`
- `packages/clinical-content/src/pilot-content.ts`
- `packages/clinical-content/src/pilot-content.test.ts`
- `packages/clinical-content/src/pilot-data/common.ts`
- `packages/clinical-content/src/pilot-data/laceration-abscess-biliary.ts`
- `packages/clinical-content/src/pilot-data/hernia-appendicitis.ts`
- `packages/clinical-content/src/pilot-data/hernia-appendicitis-content.ts`

### Runtime and player review surfaces

- `packages/game-domain/src/context.ts`
- `packages/game-domain/src/reducer.ts`
- `packages/game-domain/tests/clinical-pilot.test.ts`
- `apps/player/src/session/viewModels.ts`
- `apps/player/src/ui/types.ts`
- `apps/player/src/ui/ChartPanel.tsx`
- `apps/player/src/ui/DevelopmentPanel.tsx`
- `apps/player/src/ui/PilotContentPreview.tsx`
- `apps/player/src/ui/PilotContentPreview.test.tsx`
- `apps/player/src/ui/pilotContentPreview.css`
- `apps/player/src/ui/ClinicalReview.test.tsx`
- `apps/player/src/ui/clinicalReview.css`

## Verification results

Baseline before implementation: 364 automated tests passed and the production
build passed.

Final automated verification:

| Check | Result |
|---|---|
| `npm test` | Passed: 391 tests in 63 test files across all six tested workspaces; boundary and launcher-contract checks passed |
| Clinical registry/invariant tests | Passed: 16/16 |
| Game-domain tests | Passed: 54/54, including capability filtering, urgent termination, release-ID save compatibility, and cross-variant concept history |
| Player tests | Passed: 114/114, including chart-back/source disclosure and deterministic pilot preview |
| `npm run build` | Passed: all workspace typechecks, boundary checks, and the Vite production build |
| Build advisory | Vite reported the existing nonblocking large-chunk advisory; output completed successfully |
| `npm run test:e2e -- tests/e2e/clinical-pilot.spec.ts --project=desktop-chrome` | Passed: 3/3 flows and regenerated all eight required captures |
| `npm run clinical:pilot:links` | Extracted all 21 registry URLs. Thirteen returned direct HTTP success; eight publisher endpoints returned automated-client 403 responses but resolved to the expected publisher pages and were independently verified through browser/search access |
| Manual generated-case review | All 15 phenotypes were reviewed in the generated packet for contradictions, stereotypes, physiology compatibility, and answer leakage; the fixed examples show disease-independent demographic variety |
| Screenshot review | All eight captures were inspected at 1440 x 1000 and 390 x 844; content is readable, responsive, scrollable where expected, and has no horizontal overflow or overlapping controls |

## Screenshot index

| View | Desktop | Phone width |
|---|---|---|
| Level 0 chart | [desktop](../../artifacts/screenshots/pilot-level-0-chart-desktop.png) | [phone](../../artifacts/screenshots/pilot-level-0-chart-phone.png) |
| Level 1 multistep chart | [desktop](../../artifacts/screenshots/pilot-level-1-multistep-chart-desktop.png) | [phone](../../artifacts/screenshots/pilot-level-1-multistep-chart-phone.png) |
| Completed chart back | [desktop](../../artifacts/screenshots/pilot-completed-chart-back-desktop.png) | [phone](../../artifacts/screenshots/pilot-completed-chart-back-phone.png) |
| Sources & Clinical Review | [desktop](../../artifacts/screenshots/pilot-sources-review-desktop.png) | [phone](../../artifacts/screenshots/pilot-sources-review-phone.png) |

## Clinical-review boundary

This pilot is not a diagnostic guideline, a complete surgical curriculum, or a
clinically approved release. It covers fictional nonpregnant adults without
meaningful comorbidity and ends urgent early-clinic presentations at referral
or transfer.

Melissa or another authorized clinician must review every claim, presentation,
question, answer, explanation, distractor, generated example, physiology
overlay, population limitation, and source/reuse assessment before any item can
leave `needs_clinician_review`. Passing automated tests is not clinical
approval.
