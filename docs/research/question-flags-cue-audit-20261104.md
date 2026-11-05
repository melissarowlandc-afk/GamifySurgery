# Voluntary question-flag cue scan — 2026-11-04

Advisory lexical candidates, not proof of clinical invalidity or measured difficulty. All counts use the same updated v6 linter before and after. No player correctness, answer frequencies or exposure analytics are collected. Entry stage and case references are structural priority proxies.

The 18 flags concern 17 variants. None was already replaced by batch 1 at entry. Sixteen have new drafts; F14 is unchanged with a source-verification/retirement hold. Whole bank: 1418 variants; 2063 → 2034 findings, 961 → 950 flagged variants. Selected 17: 34 → 6; new owner-rule findings 17 → 1.

| New advisory rule | Before variants / findings | After variants / findings |
|---|---:|---:|
| option-alone | 124 / 171 | 120 / 164 |
| option-generic-individualization | 12 / 12 | 11 / 11 |
| availability-permission-cue | 17 / 18 | 15 / 16 |
| supplied-clinical-conclusion | 19 / 26 | 18 / 24 |
| unexplained-negative-imaging | 7 / 12 | 6 / 10 |
| ambiguous-cervical-term | 20 / 25 | 19 / 24 |
| nerve-competitor-plausibility | 1 / 1 | 0 / 0 |

The remaining selected owner-rule finding is the held F14 meets-biopsy-criteria label; it is unresolved. Clean heuristics do not validate anatomy, selection criteria, alternatives or difficulty. Detailed per-item old/new findings are in the review JSON; complete current-bank spans are in tools/question-quality/question-flags-whole-bank-20261104.json.

## Worst unedited offenders

| Variant | Entry | New-rule findings (exact examples) |
|---|---:|---|
| question.metabolic-acidosis.albumin-corrected-anion-gap.v1 | 0 | option-alone: answerChoices.label = alone; option-alone: answerChoices.label = alone; option-alone: answerChoices.label = alone |
| question.metabolic-acidosis.albumin-corrected-anion-gap.v3 | 0 | option-alone: answerChoices.label = alone; option-alone: answerChoices.label = alone; option-alone: answerChoices.label = alone |
| question.metabolic-acidosis.confirm-with-blood-gas.v3 | 0 | option-alone: answerChoices.label = alone; option-alone: answerChoices.label = alone; option-alone: answerChoices.label = alone |
| question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v1 | 0 | unexplained-negative-imaging: stem = negative mammography; unexplained-negative-imaging: presentation = mammography is negative; unexplained-negative-imaging: priorFeedback[0] = negative mammography |
| question.perianal-abscess.prompt-drainage.v1 | 0 | option-alone: answerChoices.label = alone; option-alone: answerChoices.label = alone; option-alone: answerChoices.label = alone |
| question.perianal-abscess.prompt-drainage.v2 | 0 | option-alone: answerChoices.label = alone; option-alone: answerChoices.label = alone; option-alone: answerChoices.label = alone |
| question.perianal-abscess.prompt-drainage.v3 | 0 | option-alone: answerChoices.label = alone; option-alone: answerChoices.label = alone; option-alone: answerChoices.label = alone |
| question.perianal-abscess.prompt-drainage.v4 | 0 | option-alone: answerChoices.label = alone; option-alone: answerChoices.label = alone; option-alone: answerChoices.label = alone |
| question.spigelian-hernia.elective-repair-referral.v4 | 0 | option-alone: answerChoices.label = alone; option-alone: answerChoices.label = alone; option-alone: answerChoices.label = alone |
| question.differentiated-thyroid-cancer.individualized-surgical-extent.v3 | 1 | ambiguous-cervical-term: presentation = cervical; ambiguous-cervical-term: chiefComplaint = cervical; option-alone: answerChoices.label = alone |
| question.acute-mesenteric-ischemia.peritonitis-exploration.v3 | 0 | option-alone: answerChoices.label = alone; option-alone: answerChoices.label = alone |
| question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1 | 0 | option-alone: answerChoices.label = alone; option-alone: answerChoices.label = alone |
| question.cholecystitis.fit-patient-index-admission-cholecystectomy.v4 | 0 | availability-permission-cue: presentation = hospital surgical team is available; option-alone: answerChoices.label = alone |
| question.cirrhosis-perioperative-risk.multifactor-assessment.v2 | 0 | option-alone: answerChoices.label = alone; option-alone: answerChoices.label = alone |
| question.hyperkalaemia.severe-community-result-transfer.v2 | 0 | availability-permission-cue: presentation = available for immediate transfer; option-alone: answerChoices.label = alone |
| question.hyperkalaemia.severe-community-result-transfer.v3 | 0 | availability-permission-cue: presentation = available for immediate transfer; option-alone: answerChoices.label = alone |
| question.hyperkalaemia.severe-community-result-transfer.v4 | 0 | availability-permission-cue: presentation = available for immediate transfer; option-alone: answerChoices.label = alone |
| question.immunology.preformed-antibody-hyperacute-rejection.v2 | 0 | supplied-clinical-conclusion: stem = hyperacute rejection; supplied-clinical-conclusion: presentation = hyperacute rejection |
| question.immunology.preformed-antibody-hyperacute-rejection.v4 | 0 | supplied-clinical-conclusion: stem = hyperacute rejection; supplied-clinical-conclusion: presentation = hyperacute rejection |
| question.metabolic-acidosis.albumin-corrected-anion-gap.v2 | 0 | option-alone: answerChoices.label = alone; option-alone: answerChoices.label = alone |

## Batch 2 candidate list — no rewrites in this milestone

All unedited variants flagged by at least one new rule are listed below, ordered by entry stage, finding count and case references. This is a candidate backlog, not authorization to edit or a claim of actual exposure. Keep tutorials/accepted-basic roles and exact clinical approvals distinct at review.

| Variant | Concept | Entry / tier | Cases | Intent / review | New-rule findings |
|---|---|---|---:|---|---|
| question.metabolic-acidosis.albumin-corrected-anion-gap.v1 | concept.metabolic-acidosis.albumin-corrected-anion-gap | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.metabolic-acidosis.albumin-corrected-anion-gap.v3 | concept.metabolic-acidosis.albumin-corrected-anion-gap | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.metabolic-acidosis.confirm-with-blood-gas.v3 | concept.metabolic-acidosis.confirm-with-blood-gas | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v1 | concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | unexplained-negative-imaging |
| question.perianal-abscess.prompt-drainage.v1 | concept.perianal-abscess.prompt-drainage | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.perianal-abscess.prompt-drainage.v2 | concept.perianal-abscess.prompt-drainage | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.perianal-abscess.prompt-drainage.v3 | concept.perianal-abscess.prompt-drainage | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.perianal-abscess.prompt-drainage.v4 | concept.perianal-abscess.prompt-drainage | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.spigelian-hernia.elective-repair-referral.v4 | concept.spigelian-hernia.elective-repair-referral | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.acute-mesenteric-ischemia.peritonitis-exploration.v3 | concept.acute-mesenteric-ischemia.peritonitis-exploration | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1 | concept.breast-cancer-after-neoadjuvant-therapy.response-mapping | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.cholecystitis.fit-patient-index-admission-cholecystectomy.v4 | concept.cholecystitis.fit-patient-index-admission-cholecystectomy | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | availability-permission-cue, option-alone |
| question.cirrhosis-perioperative-risk.multifactor-assessment.v2 | concept.cirrhosis-perioperative-risk.multifactor-assessment | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.hyperkalaemia.severe-community-result-transfer.v2 | concept.hyperkalaemia.severe-community-result-transfer | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | availability-permission-cue, option-alone |
| question.hyperkalaemia.severe-community-result-transfer.v3 | concept.hyperkalaemia.severe-community-result-transfer | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | availability-permission-cue, option-alone |
| question.hyperkalaemia.severe-community-result-transfer.v4 | concept.hyperkalaemia.severe-community-result-transfer | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | availability-permission-cue, option-alone |
| question.immunology.preformed-antibody-hyperacute-rejection.v2 | concept.immunology.preformed-antibody-hyperacute-rejection | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | supplied-clinical-conclusion |
| question.immunology.preformed-antibody-hyperacute-rejection.v4 | concept.immunology.preformed-antibody-hyperacute-rejection | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | supplied-clinical-conclusion |
| question.metabolic-acidosis.albumin-corrected-anion-gap.v2 | concept.metabolic-acidosis.albumin-corrected-anion-gap | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.metabolic-acidosis.albumin-corrected-anion-gap.v4 | concept.metabolic-acidosis.albumin-corrected-anion-gap | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v2 | concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | unexplained-negative-imaging |
| question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v3 | concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | unexplained-negative-imaging |
| question.postherniorrhaphy-pain.targeted-block-specialist-evaluation.v3 | concept.postherniorrhaphy-pain.targeted-block-specialist-evaluation | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.postoperative-delirium.multicomponent-prevention-plan.v4 | concept.postoperative-delirium.multicomponent-prevention-plan | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone, option-generic-individualization |
| question.mondor-disease.evaluation.diagnostic-breast-imaging.v1 | concept.mondor-disease.selective-imaging-evaluation | 0 / unknown | 2 | unclassified_pending_review; clinically_approved | option-alone |
| question.acute-mesenteric-ischemia.peritonitis-exploration.v1 | concept.acute-mesenteric-ischemia.peritonitis-exploration | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.acute-mesenteric-ischemia.peritonitis-exploration.v2 | concept.acute-mesenteric-ischemia.peritonitis-exploration | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.acute-mesenteric-ischemia.peritonitis-exploration.v4 | concept.acute-mesenteric-ischemia.peritonitis-exploration | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.acute-pancreatitis.mild-biliary-chole-before-discharge.v3 | concept.acute-pancreatitis.mild-biliary-chole-before-discharge | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.appendicitis.stable-adult-ct.v4 | concept.appendicitis.stable-adult-ct | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | supplied-clinical-conclusion |
| question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2 | concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v2 | concept.breast-cancer-after-neoadjuvant-therapy.response-mapping | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v4 | concept.breast-cancer-after-neoadjuvant-therapy.response-mapping | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.cholecystitis.fit-patient-index-admission-cholecystectomy.v2 | concept.cholecystitis.fit-patient-index-admission-cholecystectomy | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | availability-permission-cue |
| question.cholecystitis.hida-after-equivocal-ultrasound.v3 | concept.cholecystitis.hida-after-equivocal-ultrasound | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | availability-permission-cue |
| question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v1 | concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v2 | concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v3 | concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-generic-individualization |
| question.dialysis-access.clinical-dysfunction-referral.v4 | concept.dialysis-access.clinical-dysfunction-referral | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.fhh.initial-biochemical-evaluation.v1 | concept.fhh.biochemical-evaluation | 0 / unknown | 1 | unclassified_pending_review; clinically_approved | option-alone |
| question.fhh.suggestive-results-confirmation.v1 | concept.fhh.recognition-and-confirmation | 0 / unknown | 1 | unclassified_pending_review; clinically_approved | option-alone |
| question.gs028f.esophagus.confirmed-sharp-object-emergency-referral.v1 | concept.gs028f.esophagus.confirmed-sharp-object-emergency-referral | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.gs028f.esophagus.confirmed-sharp-object-emergency-referral.v2 | concept.gs028f.esophagus.confirmed-sharp-object-emergency-referral | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | availability-permission-cue |
| question.gs028f.esophagus.confirmed-sharp-object-emergency-referral.v3 | concept.gs028f.esophagus.confirmed-sharp-object-emergency-referral | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.gs028f.head-neck.initial-fna-not-open-biopsy.v1 | concept.gs028f.head-neck.initial-fna-not-open-biopsy | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | ambiguous-cervical-term |
| question.gs028f.head-neck.initial-fna-not-open-biopsy.v2 | concept.gs028f.head-neck.initial-fna-not-open-biopsy | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | ambiguous-cervical-term |
| question.gs028f.head-neck.initial-fna-not-open-biopsy.v3 | concept.gs028f.head-neck.initial-fna-not-open-biopsy | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | ambiguous-cervical-term |
| question.hcc.resection.future-liver-remnant.v1 | concept.hcc.compensated-cirrhosis-resection-selection | 0 / unknown | 1 | unclassified_pending_review; clinically_approved | option-alone |
| question.hidradenitis-suppurativa.multimodal-specialist-planning.v1 | concept.hidradenitis-suppurativa.multimodal-specialist-planning | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.hidradenitis-suppurativa.multimodal-specialist-planning.v1.p2e.research-consent.v4 | concept.hidradenitis-suppurativa.multimodal-specialist-planning | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.hs.accessory-spleen.threshold.v1 | concept.hereditary-spherocytosis.confirmed-accessory-spleen-management | 0 / unknown | 1 | unclassified_pending_review; clinically_approved | option-alone |
| question.immunology.preformed-antibody-hyperacute-rejection.v3 | concept.immunology.preformed-antibody-hyperacute-rejection | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | supplied-clinical-conclusion |
| question.lymphangitis.finger-axillary.v1 | concept.lymphangitis.acute-clinical-recognition | 0 / unknown | 1 | unclassified_pending_review; clinically_approved | option-alone |
| question.lymphangitis.reverse-axillary.v1 | concept.lymphangitis.acute-clinical-recognition | 0 / unknown | 1 | unclassified_pending_review; clinically_approved | option-alone |
| question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v4 | concept.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.malignant-polyp.low-risk-endoscopic-excision.v1 | concept.malignant-polyp.low-risk-endoscopic-excision | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.malignant-polyp.low-risk-endoscopic-excision.v2 | concept.malignant-polyp.low-risk-endoscopic-excision | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.mondor-disease.evaluation.uncertain-doppler-ultrasound.v1 | concept.mondor-disease.selective-imaging-evaluation | 0 / unknown | 1 | unclassified_pending_review; clinically_approved | option-alone |
| question.mondor-disease.management.supportive-care.v1.p2e.confidentiality.v4 | concept.mondor-disease.supportive-management | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | availability-permission-cue |
| question.palpable-breast.negative-mammogram-targeted-us.v1 | concept.palpable-breast.negative-mammogram-targeted-us | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | unexplained-negative-imaging |
| question.palpable-breast.negative-mammogram-targeted-us.v4 | concept.palpable-breast.negative-mammogram-targeted-us | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | unexplained-negative-imaging |
| question.pancreatic-tail-adenocarcinoma.clinic-counseling.v1 | concept.pancreatic-tail-adenocarcinoma.distal-pancreatectomy-with-splenectomy | 0 / unknown | 1 | unclassified_pending_review; clinically_approved | option-alone |
| question.pathologic-nipple-discharge.diagnostic-imaging.v4 | concept.pathologic-nipple-discharge.diagnostic-imaging | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | unexplained-negative-imaging |
| question.postoperative-delirium.multicomponent-prevention-plan.v1 | concept.postoperative-delirium.multicomponent-prevention-plan | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-generic-individualization |
| question.postoperative-retention.catheter-decompression.v1 | concept.postoperative-retention.catheter-decompression | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.postoperative-retention.catheter-decompression.v2 | concept.postoperative-retention.catheter-decompression | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.postoperative-retention.catheter-decompression.v3 | concept.postoperative-retention.catheter-decompression | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.postoperative-retention.catheter-decompression.v4 | concept.postoperative-retention.catheter-decompression | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.preoperative-nutrition.nutritional-risk-screening.v2 | concept.preoperative-nutrition.nutritional-risk-screening | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.preoperative-nutrition.nutritional-risk-screening.v4 | concept.preoperative-nutrition.nutritional-risk-screening | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-generic-individualization |
| question.preoperative-nutrition.oral-enteral-first-line.v2 | concept.preoperative-nutrition.oral-enteral-first-line | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.preoperative-osa.validated-risk-screening.v1 | concept.preoperative-osa.validated-risk-screening | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.prosthetic-mesh-infection.specialist-source-control-evaluation.v1 | concept.prosthetic-mesh-infection.specialist-source-control-evaluation | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.spontaneous-pneumothorax.recurrence-prevention-referral.v3 | concept.spontaneous-pneumothorax.recurrence-prevention-referral | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-generic-individualization |
| question.spontaneous-pneumothorax.recurrence-prevention-referral.v4 | concept.spontaneous-pneumothorax.recurrence-prevention-referral | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.statistics-ethics.capacity-refusal.v3 | concept.statistics-ethics.capacity-refusal | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | supplied-clinical-conclusion |
| question.statistics-ethics.predictive-value-prevalence.v3 | concept.statistics-ethics.predictive-value-prevalence | 0 / 1 | 1 | unclassified_pending_review; needs_clinician_review | supplied-clinical-conclusion |
| question.statistics-ethics.qi-versus-research.v1 | concept.statistics-ethics.qi-versus-research | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.statistics-ethics.research-consent.v3 | concept.statistics-ethics.research-consent | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-generic-individualization |
| question.superficial-incisional-ssi.open-drain.v1 | concept.superficial-incisional-ssi.open-drain | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.superficial-incisional-ssi.open-drain.v2 | concept.superficial-incisional-ssi.open-drain | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.superficial-incisional-ssi.open-drain.v3 | concept.superficial-incisional-ssi.open-drain | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.superficial-incisional-ssi.open-drain.v4 | concept.superficial-incisional-ssi.open-drain | 0 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.differentiated-thyroid-cancer.individualized-surgical-extent.v3 | concept.differentiated-thyroid-cancer.individualized-surgical-extent | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | ambiguous-cervical-term, option-alone |
| question.anal-scc.localized-chemoradiation-referral.v1 | concept.anal-scc.localized-chemoradiation-referral | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.anal-scc.localized-chemoradiation-referral.v2 | concept.anal-scc.localized-chemoradiation-referral | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.anal-scc.localized-chemoradiation-referral.v3 | concept.anal-scc.localized-chemoradiation-referral | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.anal-scc.localized-chemoradiation-referral.v4 | concept.anal-scc.localized-chemoradiation-referral | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.cutaneous-abscess.incision-drainage.v1 | concept.cutaneous-abscess.incision-drainage | 1 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.cutaneous-abscess.incision-drainage.v2 | concept.cutaneous-abscess.incision-drainage | 1 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.cutaneous-abscess.incision-drainage.v3 | concept.cutaneous-abscess.incision-drainage | 1 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.cutaneous-abscess.incision-drainage.v4 | concept.cutaneous-abscess.incision-drainage | 1 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.differentiated-thyroid-cancer.individualized-surgical-extent.v4 | concept.differentiated-thyroid-cancer.individualized-surgical-extent | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone, option-generic-individualization |
| question.iron-deficiency.gi-evaluation.v1 | concept.iron-deficiency.gi-evaluation | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.iron-deficiency.gi-evaluation.v2 | concept.iron-deficiency.gi-evaluation | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.iron-deficiency.gi-evaluation.v3 | concept.iron-deficiency.gi-evaluation | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.iron-deficiency.gi-evaluation.v4 | concept.iron-deficiency.gi-evaluation | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.parastomal-hernia.nonurgent-stoma-specialist-management.v4 | concept.parastomal-hernia.nonurgent-stoma-specialist-management | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone, option-generic-individualization |
| question.ptld.posttransplant-pattern-recognition.v4 | concept.ptld.posttransplant-pattern-recognition | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.ptld.tissue-diagnosis-coordination.v1 | concept.ptld.tissue-diagnosis-coordination | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.ptld.tissue-diagnosis-coordination.v1.p2e.error-disclosure.v4 | concept.ptld.tissue-diagnosis-coordination | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.rectal-prolapse.surgical-referral.v1 | concept.rectal-prolapse.surgical-referral | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.rectal-prolapse.surgical-referral.v2 | concept.rectal-prolapse.surgical-referral | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.rectal-prolapse.surgical-referral.v3 | concept.rectal-prolapse.surgical-referral | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.rectal-prolapse.surgical-referral.v4 | concept.rectal-prolapse.surgical-referral | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.secondary-lymphedema.decongestive-therapy-referral.v4 | concept.secondary-lymphedema.decongestive-therapy-referral | 1 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone, option-generic-individualization |
| question.thyroid-nodule.follicular-invasion-histology.v1 | concept.thyroid-nodule.follicular-invasion-histology | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | supplied-clinical-conclusion |
| question.thyroid-nodule.follicular-invasion-histology.v2 | concept.thyroid-nodule.follicular-invasion-histology | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | supplied-clinical-conclusion |
| question.thyroid-nodule.follicular-invasion-histology.v3 | concept.thyroid-nodule.follicular-invasion-histology | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | supplied-clinical-conclusion |
| question.thyroid-nodule.follicular-invasion-histology.v4 | concept.thyroid-nodule.follicular-invasion-histology | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | supplied-clinical-conclusion |
| question.zenker-diverticulum.false-pouch-anatomy.v3 | concept.zenker-diverticulum.false-pouch-anatomy | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | ambiguous-cervical-term |
| question.anal-scc.biopsy-and-staging.v1 | concept.anal-scc.biopsy-and-staging | 1 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.anal-scc.biopsy-and-staging.v2 | concept.anal-scc.biopsy-and-staging | 1 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.anal-scc.biopsy-and-staging.v3 | concept.anal-scc.biopsy-and-staging | 1 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.anal-scc.biopsy-and-staging.v4 | concept.anal-scc.biopsy-and-staging | 1 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.asymptomatic-phpt.three-site-dxa.v1 | concept.asymptomatic-phpt.three-site-dxa | 1 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.asymptomatic-phpt.three-site-dxa.v2 | concept.asymptomatic-phpt.three-site-dxa | 1 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.asymptomatic-phpt.three-site-dxa.v3 | concept.asymptomatic-phpt.three-site-dxa | 1 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.asymptomatic-phpt.three-site-dxa.v4 | concept.asymptomatic-phpt.three-site-dxa | 1 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.choledocholithiasis.confirmed-stone-therapy.v1 | concept.choledocholithiasis.confirmed-stone-therapy | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.choledocholithiasis.confirmed-stone-therapy.v2 | concept.choledocholithiasis.confirmed-stone-therapy | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.choledocholithiasis.confirmed-stone-therapy.v3 | concept.choledocholithiasis.confirmed-stone-therapy | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.choledocholithiasis.confirmed-stone-therapy.v4 | concept.choledocholithiasis.confirmed-stone-therapy | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.complex-perianal-fistula.loose-seton-staged-planning.v1 | concept.complex-perianal-fistula.loose-seton-staged-planning | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.complex-perianal-fistula.loose-seton-staged-planning.v2 | concept.complex-perianal-fistula.loose-seton-staged-planning | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.complex-perianal-fistula.loose-seton-staged-planning.v3 | concept.complex-perianal-fistula.loose-seton-staged-planning | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.complex-perianal-fistula.loose-seton-staged-planning.v4 | concept.complex-perianal-fistula.loose-seton-staged-planning | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.diabetic-foot-infection.clinical-recognition.v2 | concept.diabetic-foot-infection.clinical-recognition | 1 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.differentiated-thyroid-cancer.individualized-surgical-extent.v2 | concept.differentiated-thyroid-cancer.individualized-surgical-extent | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v1 | concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | ambiguous-cervical-term |
| question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v2 | concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | ambiguous-cervical-term |
| question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3.r6 | concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v2 | 1 / 1 | 1 | resident_application_reviewer_prediction_pending; needs_clinician_review | ambiguous-cervical-term |
| question.fap.ipaa-for-uncontrolled-rectal-burden.v1 | concept.fap.ipaa-for-uncontrolled-rectal-burden | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.fap.ipaa-for-uncontrolled-rectal-burden.v2 | concept.fap.ipaa-for-uncontrolled-rectal-burden | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.fap.ipaa-for-uncontrolled-rectal-burden.v3 | concept.fap.ipaa-for-uncontrolled-rectal-burden | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.fap.ipaa-for-uncontrolled-rectal-burden.v4 | concept.fap.ipaa-for-uncontrolled-rectal-burden | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.nephrolithiasis.noncontrast-ct-evaluation.v1 | concept.nephrolithiasis.noncontrast-ct-evaluation | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | supplied-clinical-conclusion |
| question.nephrolithiasis.recurrent-metabolic-evaluation.v1 | concept.nephrolithiasis.recurrent-metabolic-evaluation | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | supplied-clinical-conclusion |
| question.parastomal-hernia.clinical-recognition.v3 | concept.parastomal-hernia.clinical-recognition | 1 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.persistent-itp.defer-elective-splenectomy.v1 | concept.persistent-itp.defer-elective-splenectomy | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | availability-permission-cue |
| question.persistent-itp.defer-elective-splenectomy.v2 | concept.persistent-itp.defer-elective-splenectomy | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | availability-permission-cue |
| question.persistent-itp.defer-elective-splenectomy.v3 | concept.persistent-itp.defer-elective-splenectomy | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | availability-permission-cue |
| question.persistent-itp.defer-elective-splenectomy.v4 | concept.persistent-itp.defer-elective-splenectomy | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | availability-permission-cue |
| question.ptld.posttransplant-pattern-recognition.v1 | concept.ptld.posttransplant-pattern-recognition | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | ambiguous-cervical-term |
| question.ptld.posttransplant-pattern-recognition.v3 | concept.ptld.posttransplant-pattern-recognition | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.secondary-lymphedema.decongestive-therapy-referral.v1 | concept.secondary-lymphedema.decongestive-therapy-referral | 1 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.soft-tissue-mass.extremity-mri.v3 | concept.soft-tissue-mass.extremity-mri | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | supplied-clinical-conclusion |
| question.soft-tissue-mass.specialist-planned-biopsy.v3 | concept.soft-tissue-mass.specialist-planned-biopsy | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | supplied-clinical-conclusion |
| question.thyroid-nodule.fna-selection.v1 | concept.thyroid-nodule.fna-selection | 1 / 0 | 1 | unclassified_pending_review; needs_clinician_review | supplied-clinical-conclusion |
| question.thyroid-nodule.fna-selection.v3 | concept.thyroid-nodule.fna-selection | 1 / 0 | 1 | unclassified_pending_review; needs_clinician_review | supplied-clinical-conclusion |
| question.thyroid-nodule.fna-selection.v4 | concept.thyroid-nodule.fna-selection | 1 / 0 | 1 | unclassified_pending_review; needs_clinician_review | supplied-clinical-conclusion |
| question.varicose-veins.intervention-referral-after-axial-reflux.v1 | concept.varicose-veins.intervention-referral-after-axial-reflux | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.varicose-veins.intervention-referral-after-axial-reflux.v1.p2e.capacity-refusal.v4 | concept.varicose-veins.intervention-referral-after-axial-reflux | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.varicose-veins.intervention-referral-after-axial-reflux.v3 | concept.varicose-veins.intervention-referral-after-axial-reflux | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-generic-individualization |
| question.zenker-diverticulum.contrast-swallow.v3 | concept.zenker-diverticulum.contrast-swallow | 1 / 0 | 1 | unclassified_pending_review; needs_clinician_review | ambiguous-cervical-term |
| question.zenker-diverticulum.false-pouch-anatomy.v1 | concept.zenker-diverticulum.false-pouch-anatomy | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | ambiguous-cervical-term |
| question.zenker-diverticulum.false-pouch-anatomy.v2 | concept.zenker-diverticulum.false-pouch-anatomy | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | ambiguous-cervical-term |
| question.zenker-diverticulum.false-pouch-anatomy.v4 | concept.zenker-diverticulum.false-pouch-anatomy | 1 / 1 | 1 | unclassified_pending_review; needs_clinician_review | ambiguous-cervical-term |
| question.inflammatory-breast-cancer.core-biopsy-confirmation.v1 | concept.inflammatory-breast-cancer.core-biopsy-confirmation | 2 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.inflammatory-breast-cancer.core-biopsy-confirmation.v2 | concept.inflammatory-breast-cancer.core-biopsy-confirmation | 2 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.inflammatory-breast-cancer.core-biopsy-confirmation.v3 | concept.inflammatory-breast-cancer.core-biopsy-confirmation | 2 / 0 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.bile-leak.minor-leak-ercp-stent.v1 | concept.bile-leak.minor-leak-ercp-stent | 2 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.bile-leak.minor-leak-ercp-stent.v2 | concept.bile-leak.minor-leak-ercp-stent | 2 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.bile-leak.minor-leak-ercp-stent.v3 | concept.bile-leak.minor-leak-ercp-stent | 2 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.bile-leak.minor-leak-ercp-stent.v4 | concept.bile-leak.minor-leak-ercp-stent | 2 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-alone |
| question.gastric-adenocarcinoma.spleen-preservation-counseling.v1 | concept.gastric-adenocarcinoma.prophylactic-splenectomy-avoidance | 2 / unknown | 1 | unclassified_pending_review; clinically_approved | option-alone |
| question.peptic-ulcer-bleeding.visible-vessel-modality-principle.v1 | concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality | 2 / unknown | 1 | unclassified_pending_review; clinically_approved | option-alone |
| question.peptic-ulcer-bleeding.visible-vessel-treat.v1.r6 | concept.peptic-ulcer-bleeding.high-risk-stigmata-endoscopic-hemostasis.v2 | 2 / 1 | 1 | resident_application_reviewer_prediction_pending; needs_clinician_review | availability-permission-cue |
| question.pseudocyst.symptomatic-endoscopic-drainage.v2.r4 | concept.pseudocyst.symptomatic-endoscopic-drainage.v2 | 2 / 1 | 1 | resident_application_reviewer_prediction_pending; needs_clinician_review | option-alone |
| question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r8 | concept.gs028g.hiv-perioperative.booster-midazolam-interaction.v2 | 3 / 1 | 1 | resident_application_reviewer_prediction_pending; needs_clinician_review | availability-permission-cue |
| question.gs028g.hiv-perioperative.art-continuity.v4 | concept.gs028g.hiv-perioperative.art-continuity | 3 / 1 | 1 | unclassified_pending_review; needs_clinician_review | availability-permission-cue |
| question.gs028g.merkel-cell.clinically-negative-node-staging.v1.r3 | concept.gs028g.merkel-cell.clinically-negative-node-staging | 3 / 1 | 1 | context_companion_revised_task; needs_clinician_review | option-alone |
| question.gs028g.mucocutaneous-separation.superficial-care.v3 | concept.gs028g.mucocutaneous-separation.superficial-care | 3 / 1 | 1 | unclassified_pending_review; needs_clinician_review | option-generic-individualization |
| question.gs028g.postoperative-scapula.spinal-accessory.v1 | concept.gs028g.postoperative-scapula.spinal-accessory | 3 / 1 | 1 | unclassified_pending_review; needs_clinician_review | ambiguous-cervical-term |
| question.gs028g.postoperative-scapula.spinal-accessory.v3 | concept.gs028g.postoperative-scapula.spinal-accessory | 3 / 1 | 1 | unclassified_pending_review; needs_clinician_review | ambiguous-cervical-term |
| question.pediatric-clinic.growing-firm-neck-node.v2 | concept.pediatric-clinic.concerning-neck-node-referral | 4 / 1 | 1 | unclassified_pending_review; needs_clinician_review | ambiguous-cervical-term |
| question.pediatric-clinic.neck-nodes-after-cold.v1 | concept.pediatric-clinic.reactive-neck-node-observation | 4 / 0 | 1 | unclassified_pending_review; needs_clinician_review | ambiguous-cervical-term |
| question.pediatric-clinic.shrinking-mobile-neck-nodes.v2.r3 | concept.pediatric-clinic.reactive-neck-node-observation | 4 / 0 | 1 | foundational_clinical_application; clinically_approved | ambiguous-cervical-term |
| question.pediatric-clinic.child-wants-plan-explained.v2 | concept.pediatric-clinic.developmental-assent-discussion | 4 / 0 | 1 | unclassified_pending_review; needs_clinician_review | ambiguous-cervical-term |

F05 has a separate ABSITE-scope hold; F10 replaces the disputed oncoplastic exception with a new, narrower mastectomy concept version. See the review packet and source ledger. No evidence, save, cloud, routing or unflagged content was edited.
