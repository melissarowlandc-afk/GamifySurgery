# GS-028 October3: coverage-driven twenty-objective source contract

Owner requested ratios of already authored subjects and20 new objective groups.
Scope is an additive unapproved local development batch. No sheet edits, clinical
approval, public release, commit, push or deployment. Date checked2026-10-03.

## Coverage method and selection

Count distinct stable objectives, not variant/patient counts. Accepted manual
semantic map covers271 active IDs in44 ABSITE leaves. Structured exported
authoring/pilot inventory also finds41 nonactive IDs; these are counted separately
and checked for duplication. The original full mapping and generated ratios will
be preserved in the final coverage audit. Mappings are editorial inferences;
official ABS scope supplies categories, not repository-ID assignments or exact
topic frequency. Ambiguous boundaries retain alternatives/tags. No equal-share
quota. Pediatric/hospital-operation meanings retain their actual future release.

Locked20 narrow objectives, all with independent beginning access:

| Subject | New stable objective IDs | Context and evidence boundary |
|---|---|---|
| Surgical Critical Care (2) | `concept.ards.permeability-edema-mechanism`; `concept.ards.predicted-body-weight-ventilation` | Stable post-hospital record discussion. Inflammatory permeability differs from hydrostatic edema; lung-protective tidal volumes use predicted body weight. No clinic ventilator, new ICU capability, outcome percentage, PBW formula or dosing protocol. |
| Trauma (4) | `concept.blunt-cardiac-injury.ecg-troponin-evaluation`; `concept.blunt-cardiac-injury.monitored-disposition`; `concept.head-injury.anticoagulant-ed-ct-evaluation`; `concept.pelvic-trauma.binder-greater-trochanter-placement` | ECG plus troponin evaluation and monitored hospital disposition are separate decisions. No universal biomarker cutoff/timing/100% sensitivity. Anticoagulated head injury uses ED assessment; no outpatient CT delay. Binder anatomy is a stable review of previous EMS/hospital care, never a clinic trauma resuscitation. |
| Thoracic (4) | `concept.lung-cancer-screening.annual-ldct-eligibility`; `concept.spontaneous-pneumothorax.recurrence-prevention-referral`; `concept.pleural-infection.intercostal-drain-indication`; `concept.pleural-effusion.image-guided-thoracentesis-referral` | Explicit USPSTF screening framework, genuine external LDCT referral. Initial primary spontaneous pneumothorax surgery discussion is conditional/low certainty and preference dependent. Low pleural pH requires infection, nonpurulent aspirate and safely accessible fluid context; hospital drainage only. Image-guided diagnostic sampling remains external. |
| Fluids/Electrolytes/Acid-Base (4) | `concept.metabolic-acidosis.confirm-with-blood-gas`; `concept.metabolic-acidosis.albumin-corrected-anion-gap`; `concept.hyperkalaemia.severe-community-result-transfer`; `concept.hyperkalaemia.distinguish-protection-from-potassium-lowering` | Stable complete outside panels or urgent actual clinic transfer. Blood gas distinguishes respiratory/mixed disorders; albumin-corrected gap avoids underestimating anion accumulation. No unsupported onsite blood-gas execution. UKKA severe community potassium threshold is jurisdiction-specific; calcium mechanism differs from insulin/glucose shift. July2026 calcium evidence downgraded2C; no mortality claim or dose protocol. |
| Vascular Access (2) | `concept.dialysis-access.maturation-physical-assessment`; `concept.dialysis-access.clinical-dysfunction-referral` | Look/feel/listen and specialist ultrasound when exam cannot resolve maturation; clinical dysfunction prompts access-team evaluation. No universal timing rule, routine asymptomatic surveillance claim or access surgery. Avoid already queued pseudoaneurysm/sentinel-bleed meanings. |
| Anesthesia (2) | `concept.preoperative-osa.validated-risk-screening`; `concept.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan` | Preanesthetic planning; screen is not OSA diagnosis. No proprietary questionnaire or universal score cutoff. Known MH susceptibility requires trigger-free anesthetic/facility planning; no clinic administration/crisis algorithm/dantrolene dosing. |
| Geriatric/End-of-Life (2) | `concept.preoperative-frailty.validated-assessment`; `concept.postoperative-delirium.multicomponent-prevention-plan` | Older adults preparing for major abdominal surgery; validated frailty separate from age/comorbidity. Tailored multidisciplinary nonpharmacologic prevention delivered by the real hospital team, not fictional clinic monitoring. |

Every objective needs four substantive variants, complete separated questions,
named generated age/sex-consistent patients, short complaints, parallel choices,
neutral timing for every test choice and shuffled answers. All substantive claims,
questions, concepts and case reviews remain `needs_clinician_review` with no
clinician signoff. Every paired objective also has standalone variants. Use
existing real service gates only where clinically useful; no synthetic service
or unnecessary test is added to satisfy a multistep count.

## Permitted source boundaries

The following are actual directly verified primary sources. Production records
must carry complete authors/citation/year/official URL or DOI/access date,
source class, authority separate from rights, intended support, atomic claims
and reverse claim IDs. Clinical facts are independently synthesized; no source
prose, questionnaires, tables, algorithms, figures or raw source text is stored.

- Grasselli et al., ESICM ARDS guideline, *Intensive Care Medicine*2023;49:727–759,
  DOI10.1007/s00134-023-07050-7. Publisher CC BY-NC4.0; independent factual
  synthesis only, attribution/license link and restriction retained. Introduction
  and Domain5/Recommendation5.1 support the two ARDS principles. Single current
  direct guideline; no copied source expression or commercial adaptation.
- Clancy et al., EAST BCI guideline2012, *J Trauma Acute Care Surg*73:S301–S306,
  official current EAST listing. Copyrighted targeted verification; age and
  unknown optimum timing retained. Recommendations2.1/2.2 and3.2 support
  evaluation/disposition. Kyriazidis et al.2023 systematic review,
  DOI10.1186/s13017-023-00504-9, CC BY4, independently supports combined testing
  but does not justify a universal perfect sensitivity claim.
- CDC, *Key Recommendations for the Care of Adult Patients with Mild Traumatic
  Brain Injury*, linked from July2025 official landing; PDF itself undated.
  Government conditions apply; link/attribute, no endorsement or reposting.
  Target anticoagulants only; preserve aspirin-alone exception in claims.
- Coccolini et al., WSES pelvic trauma guideline2017;12:5,
  DOI10.1186/s13017-017-0117-6, CC BY4. Target binder anatomical placement;
  older single-source limitation retained.
- Jung et al., French expert-panel metabolic acidosis guideline2019;9:92,
  DOI10.1186/s13613-019-0563-2, CC BY4. R1.1/R1.3 support the diagnostic
  objectives; expert-opinion/older-guideline limits retained. No broad management
  claims, universal arterial superiority or copied diagnostic algorithm.
- Alfonzo, Harrison, Baines, Chu, Mann and MacRury, UKKA acute hyperkalaemia
  guideline, original2020, updated2023 and **July2026**. Official July2026 PDF;
  copyrighted targeted factual verification. Guidelines1.2.3,16.2a,16.3.1 and
  rationale. A confirmed community result at least6.5mmol/L supports immediate
  hospital assessment in this UK framework. Calcium protects membrane physiology
  and does not lower potassium; insulin/glucose shifts potassium intracellularly.
  Calcium grade2C/no demonstrated outcome claim preserved; no drug doses.
- Aitken et al., UKKA vascular-access guideline, *BMC Nephrology*2025;26:461,
  DOI10.1186/s12882-025-04374-y, CC BY4. Guidelines3.7/3.9/4.1 support examination,
  specialist ultrasound and clinically triggered referral. One current direct
  guideline; no fixed maturation interval or invented specialist capability.
- Chung et al., SASM OSA screening guideline2016;123:452–473,
  DOI10.1213/ANE.0000000000001416, CC BY-NC-ND4. Independent facts only;
  no adapted wording/questionnaire/scoring card. Older guideline, uncertain
  screening-outcome benefit, screening not diagnosis.
- Tsutsumi et al., JSA MH guideline2026;40:4–12,
  DOI10.1007/s00540-025-03647-y, CC BY4. Future-anesthesia planning section;
  expert/case-report limitations. EMHG2018 official recommendation is an
  independent copyrighted targeted cross-check. Avoid crisis treatment scope.
- Keller et al., EAES/SAGES older-adult perioperative guideline2024;38:4104–4126,
  DOI10.1007/s00464-024-10977-7, CC BY4. Independent review found that the
  relevant frailty statements concern study reporting, not an individual clinical
  assessment mandate. They cannot support the current clinical assessment claim.
  Admission is withheld pending a permitted direct clinical-practice source.
  CPOC/BGS2021 was excluded after checking extraction/incorporation restrictions.
- Replacement verified directly by Astra: Lavezzo et al., SIAARTI/SIC/ANIARTI
  good-practice document2025;5:20, DOI10.1186/s44158-025-00239-w, CC BY4.0.
  Statements3.1–3.3 support structured multidimensional preoperative frailty
  assessment, separately from inference based on age/comorbidity, for elective
  major abdominal surgery. Consensus and limited comparative-tool evidence;
  no universal cutoff, uniquely superior instrument or automatic ICU/cancellation.
  Aceto et al., PriME Italian intersociety consensus2020;32:1647–1673,
  DOI10.1007/s40520-020-01624-x, CC BY4.0, provides an independent clinical
  cross-check for multiparametric preoperative frailty assessment (low evidence).
  All four frailty variants must explicitly concern elective major surgery.
- Aldecoa et al., ESAIC postoperative-delirium guideline2024;41:81–108,
  DOI10.1097/EJA.0000000000001876, CC BY4. Recommendation4.3; tailored team
  prevention. One current direct guideline, independent cross-check desirable.
- USPSTF official lung-screening recommendation2021. Targeted official facts,
  never JAMA/restricted publisher prose. Annual LDCT age50–80, at least20pack-years,
  current smoking or quit within15years; stopping criteria/context required.
  Guideline-specific values, not an assertion all societies agree.
- Walker et al., ERS/EACTS/ESTS spontaneous-pneumothorax guideline2024;63:2300797,
  DOI10.1183/13993003.00797-2023. Directly read repository-hosted published PDF;
  all rights reserved, targeted facts only. PICO4 conditional initial-PSP early
  surgery discussion when recurrence prevention matters; low certainty.
- Roberts et al., BTS pleural guideline2023;78(Suppl3):s1–s42,
  DOI10.1136/thorax-2022-219784. Official society PDF; copyrighted targeted
  facts only. Image guidance consensus and complete pH at most7.2 infection
  drainage context. One direct guideline; retain sampling/ultrasound boundaries.

No claim depends on excluded SCCM/SSC2026, AMA, ACS AI-restricted contents,
NICE, proprietary SCORE modules, paid question banks or paywalled snippets.
Official ABSITE/QE Updated01/2021 public outlines checked October3 supply
curriculum context; historical SCORE2025–26 locators retain their original
verification date/edition. Do not claim an unverified2026–27 edition.

## Ownership and admission

Sol oct2_urgent_authoring owns new shared helpers and first6 SCC/Trauma objectives.
Sol oct3_reference_roster owns the remaining14 production families and aggregate;
Sol oct3_semantic_coverage owns the accepted semantic audit and independent
complete editorial review. Disjoint authoring was explicitly authorized in the
active plan. Sol oct2_urgent_authoring completed first6 and now investigates the
frailty source gap without production edits. Terra will admit and test accepted
records after independent review. Parent
inspects actual diffs, source limitations and runtime/browser evidence before
final acceptance. No worker alters old batch versions or unrelated dirty work.
