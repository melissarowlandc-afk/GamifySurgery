import type { EvidenceClaim } from "./pilot-schema";

export type QuestionFlagRound3EvidenceClaim = EvidenceClaim & {basisClaimIds:string[];verificationScope:string};
/** Independently written offline applications; source access dates are not advanced. */
export const QUESTION_FLAG_ROUND3_CLAIMS: QuestionFlagRound3EvidenceClaim[] = [
  {
    "contentVersion": "question-flags-round3.evidence.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "lastCheckedOn": "2026-11-04",
    "id": "claim.qf3.recurrent-vein-map-scope",
    "statement": "In a recurrent varicose-vein case with incompletely connected posterior and medial reflux findings, a superficial/deep reflux map can establish the anatomical contributions before another intervention target is selected.",
    "basisClaimIds": [
      "claim.varicose.reflux-duplex",
      "claim.varicose.intervention-referral"
    ],
    "sourceIds": [
      "source.varicose.svs-avf-avls-2022",
      "source.varicose.svs-avf-avls-2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the explicitly described synthetic adult question-flag round-three profiles.",
    "limitation": "Case-specific scope inference from the recorded SVS/AVF/AVLS sources; direct recurrent-mapping section alignment is pending. No acquisition-position or duration rule, iliac imaging indication or compulsory ablation is taught.",
    "verificationScope": "Offline author synthesis/application from recorded claims and their existing source records; no fresh source retrieval, source-access-date change or clinical approval. Direct alignment of the application remains for independent clinical/source review."
  },
  {
    "contentVersion": "question-flags-round3.evidence.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "lastCheckedOn": "2026-11-04",
    "id": "claim.qf3.hyperkalaemia-active-treatment-ranking",
    "statement": "For the supplied severe hyperkalaemic hospital episode after calcium, insulin with glucose supplies the primary immediate intracellular-shift treatment; nebulized salbutamol is an adjunct and routine intravenous bicarbonate is not its preferred substitute in a non-acidemic record.",
    "basisClaimIds": [
      "claim.gs028d.hyperkalaemia.mechanisms",
      "claim.gs028d.hyperkalaemia.severe-transfer"
    ],
    "sourceIds": [
      "source.ukka.hyperkalaemia.2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "applicablePopulation": "Only the explicitly described synthetic adult question-flag round-three profiles.",
    "limitation": "The mechanism/threshold basis is locally recorded, but this comparative drug-ranking synthesis requires direct UKKA section alignment before release acceptance. No dose, insulin safety protocol, repeat timing or renal-replacement threshold is inferred.",
    "verificationScope": "Offline author synthesis/application from recorded claims and their existing source records; no fresh source retrieval, source-access-date change or clinical approval. Direct alignment of the application remains for independent clinical/source review."
  },
  {
    "contentVersion": "question-flags-round3.evidence.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "lastCheckedOn": "2026-11-04",
    "id": "claim.qf3.neck-mural-sampling",
    "statement": "A cyst-fluid sample without lesional cells does not represent a separate solid mural component; targeted needle sampling of that component can address the specific diagnostic deficit before open biopsy.",
    "basisClaimIds": [
      "claim.gs028f.neck.needle-before-open",
      "claim.gs028f.neck.core-biopsy-alternative",
      "claim.gs028f.neck.imaging-versus-tissue-diagnosis"
    ],
    "sourceIds": [
      "source.gs028f.uk.head-neck-guidelines.2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the explicitly described synthetic adult question-flag round-three profiles.",
    "limitation": "Sampling/representation application, not proof of malignancy, a guarantee of FNA adequacy or a universal preference for FNA over core.",
    "verificationScope": "Offline author synthesis/application from recorded claims and their existing source records; no fresh source retrieval, source-access-date change or clinical approval. Direct alignment of the application remains for independent clinical/source review."
  },
  {
    "contentVersion": "question-flags-round3.evidence.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "lastCheckedOn": "2026-11-04",
    "id": "claim.qf3.preimplantation-specimen-inference",
    "statement": "Testing preimplantation recipient serum against donor targets can investigate whether donor-directed recipient reactivity predated implantation; a result confined to a postfailure sample cannot establish its earlier presence.",
    "basisClaimIds": [
      "claim.gs028e.hyperacute_preformed",
      "claim.gs028e.hyperacute_vascular"
    ],
    "sourceIds": [
      "source.gs028e.hyperacute_matsuda2016",
      "source.gs028e.ahrq_transplant2012"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the explicitly described synthetic adult question-flag round-three profiles.",
    "limitation": "Temporal/target inference only. It does not specify test performance, antigen identity, exclusion of a technical cause, a Banff diagnosis or treatment.",
    "verificationScope": "Offline author synthesis/application from recorded claims and their existing source records; no fresh source retrieval, source-access-date change or clinical approval. Direct alignment of the application remains for independent clinical/source review."
  },
  {
    "contentVersion": "question-flags-round3.evidence.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "lastCheckedOn": "2026-11-04",
    "id": "claim.qf3.cirrhosis-urgent-hernia-boundary",
    "statement": "New pain, irreducibility, vomiting and bowel dilatation proximal to a hernia with distal collapse require urgent surgical assessment despite a prior elective cirrhosis-optimization plan.",
    "basisClaimIds": [
      "claim.cirrhosis.optimize-decompensation",
      "claim.cirrhosis.multifactor-risk"
    ],
    "sourceIds": [
      "source.cirrhosis.aga-2019"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "applicablePopulation": "Only the explicitly described synthetic adult question-flag round-three profiles.",
    "limitation": "Application of the explicit urgent-emergency exception. The pattern does not establish bowel necrosis or a specific operation; no laboratory correction target is proposed.",
    "verificationScope": "Offline author synthesis/application from recorded claims and their existing source records; no fresh source retrieval, source-access-date change or clinical approval. Direct alignment of the application remains for independent clinical/source review."
  },
  {
    "contentVersion": "question-flags-round3.evidence.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "lastCheckedOn": "2026-11-04",
    "id": "claim.qf3.soft-tissue-ultrasound-application",
    "statement": "A discrete superficial cavity with mobile internal echoes and no internal flow, separate from deep fascia and a compressible adjacent vein, supports a focal collection rather than attributing the swelling to that vein.",
    "basisClaimIds": [
      "claim.bread-butter.skin-infection.equivocal-ultrasound",
      "claim.bread-butter.cutaneous-abscess.incision-drainage"
    ],
    "sourceIds": [
      "source.bread-butter.acep-sonoguide-abscess",
      "source.bread-butter.idsa-ssti-2014"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the explicitly described synthetic adult question-flag round-three profiles.",
    "limitation": "Qualitative sonographic application to the supplied stable superficial case, not a universal Doppler criterion or drainage technique for deep, vascular or plantar disease.",
    "verificationScope": "Offline author synthesis/application from recorded claims and their existing source records; no fresh source retrieval, source-access-date change or clinical approval. Direct alignment of the application remains for independent clinical/source review."
  },
  {
    "contentVersion": "question-flags-round3.evidence.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "lastCheckedOn": "2026-11-04",
    "id": "claim.qf3.controlled-filling-elastic-load",
    "statement": "In the supplied controlled record, smaller end-diastolic volume with similar ejection fraction supports reduced filling, while a higher plateau pressure during passive inspiratory holds at fixed delivered volume and measured total PEEP supports an increased elastic pressure requirement.",
    "basisClaimIds": [
      "claim.gs028e.laparoscopy.caval-compression-venous-return",
      "claim.gs028g.laparoscopy-respiratory.diaphragm-compliance.fact3"
    ],
    "sourceIds": [
      "source.jcm.laparoscopic-anesthesia-review.2020",
      "source.jroboticsurg.pneumoperitoneum-acid-base-study.2026",
      "source.gs028g.jimenez-ventilation-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the explicitly described synthetic adult question-flag round-three profiles.",
    "limitation": "Physical interpretation rather than proof of a unique cause or exclusion of mixed mechanisms. No new operative management, measured numeric range or ventilator setting is taught.",
    "verificationScope": "Offline author synthesis/application from recorded claims and their existing source records; no fresh source retrieval, source-access-date change or clinical approval. Direct alignment of the application remains for independent clinical/source review."
  },
  {
    "contentVersion": "question-flags-round3.evidence.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "lastCheckedOn": "2026-11-04",
    "id": "claim.qf3.dcis-specimen-operation-application",
    "statement": "Removal of the breast gland with retention of the skin envelope is a mastectomy rather than a localized breast-conserving excision; the conventional pure-DCIS axillary staging distinction follows the gland operation.",
    "basisClaimIds": [
      "claim.gs028c.dcis.axilla-mastectomy",
      "claim.gs028c.dcis.axilla-omit-bcs"
    ],
    "sourceIds": [
      "source.asbrs.axilla.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the explicitly described synthetic adult question-flag round-three profiles.",
    "limitation": "Anatomical application of the recorded standard-operation rule. No delayed-tracer strategy or universal oncoplastic-operation rule is added.",
    "verificationScope": "Offline author synthesis/application from recorded claims and their existing source records; no fresh source retrieval, source-access-date change or clinical approval. Direct alignment of the application remains for independent clinical/source review."
  },
  {
    "contentVersion": "question-flags-round3.evidence.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "lastCheckedOn": "2026-11-04",
    "id": "claim.qf3.dnr-baseline-support-endpoint",
    "statement": "When the agreed temporary directive ends after reassessed return to the pre-anaesthetic cardiopulmonary condition, continuation of unchanged chronic baseline oxygen does not by itself extend the modification.",
    "basisClaimIds": [
      "claim.gs028se.perioperative-dnr.2",
      "claim.gs028se.perioperative-dnr.3",
      "claim.gs028se.perioperative-dnr.4"
    ],
    "sourceIds": [
      "source.gs028se.asa-dnar-2023",
      "source.gs028se.ama-dnar-5-4"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "applicablePopulation": "Only the explicitly described synthetic adult question-flag round-three profiles.",
    "limitation": "Only the explicitly stipulated patient agreement; not an institutional default, oxygen target, recovery scale or jurisdiction-specific legal rule.",
    "verificationScope": "Offline author synthesis/application from recorded claims and their existing source records; no fresh source retrieval, source-access-date change or clinical approval. Direct alignment of the application remains for independent clinical/source review."
  },
  {
    "contentVersion": "question-flags-round3.evidence.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "lastCheckedOn": "2026-11-04",
    "id": "claim.qf3.osa-risk-communication-sequence",
    "statement": "A reassuring daytime-sleepiness report does not cancel a separate increased apnoea-probability assessment; that risk information can inform current perioperative communication before diagnostic confirmation.",
    "basisClaimIds": [
      "claim.gs028d.osa.validated-screen",
      "claim.qf2.sleep-questionnaire-domain-interpretation"
    ],
    "sourceIds": [
      "source.sasm.osa-screening.2016"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the explicitly described synthetic adult question-flag round-three profiles.",
    "limitation": "Communication/assessment scope only. No diagnostic cutoff, CPAP prescription, required monitoring protocol or decision to delay surgery is derived.",
    "verificationScope": "Offline author synthesis/application from recorded claims and their existing source records; no fresh source retrieval, source-access-date change or clinical approval. Direct alignment of the application remains for independent clinical/source review."
  },
  {
    "contentVersion": "question-flags-round3.evidence.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "lastCheckedOn": "2026-11-04",
    "id": "claim.qf3.direction-versus-acidemia",
    "statement": "A pH fall from above to within the laboratory reference interval is not demonstrated acidemia, even when arterial CO2 rises; direction of change and the later acid-base state are separate interpretations.",
    "basisClaimIds": [
      "claim.gs028d.acidosis.blood-gas",
      "claim.qf2.qualitative-co2-acid-base-pattern"
    ],
    "sourceIds": [
      "source.french-panel.metabolic-acidosis.2019",
      "source.jcm.laparoscopic-anesthesia-review.2020",
      "source.jroboticsurg.pneumoperitoneum-acid-base-study.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the explicitly described synthetic adult question-flag round-three profiles.",
    "limitation": "Reference-interval/definition inference without invented numeric values, a compensation formula, proof of CO2 source or a ventilator adjustment.",
    "verificationScope": "Offline author synthesis/application from recorded claims and their existing source records; no fresh source retrieval, source-access-date change or clinical approval. Direct alignment of the application remains for independent clinical/source review."
  },
  {
    "contentVersion": "question-flags-round3.evidence.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "lastCheckedOn": "2026-11-04",
    "id": "claim.qf3.thyroid-washout-provenance",
    "statement": "Detectable thyroglobulin washout after a needle path through an intact thyroid requires cautious interpretation with node cytology and morphology; discordant findings can warrant representative repeat node sampling before an irreversible lateral-neck plan.",
    "basisClaimIds": [
      "claim.qq20261102c.thyroid-cystic-node-discordance",
      "claim.dtc.extent"
    ],
    "sourceIds": [
      "source.qq20261102c.ata2025",
      "source.dtc.ata-2025",
      "source.dtc.ata-summary-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the explicitly described synthetic adult question-flag round-three profiles.",
    "limitation": "Application of the recorded intact-thyroid limitation; endocrine source-alignment review is pending. Detectability is not authored as a diagnostic threshold and no required operation or extent is inferred.",
    "verificationScope": "Offline author synthesis/application from recorded claims and their existing source records; no fresh source retrieval, source-access-date change or clinical approval. Direct alignment of the application remains for independent clinical/source review."
  },
  {
    "contentVersion": "question-flags-round3.evidence.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "lastCheckedOn": "2026-11-04",
    "id": "claim.qf3.breast-sample-depth-provenance",
    "statement": "A matching breast skin-site label does not establish representative sampling when the specimen and needle notch lie in superficial fat and the persistent clinical target lies beneath that plane; a visible clip is not a substitute for the unrepresented target.",
    "basisClaimIds": [
      "claim.qq20261102c.breast-core-target-discordance",
      "claim.gs028c.palpable.biopsy"
    ],
    "sourceIds": [
      "source.qq20261102c.breast-eusobi2020",
      "source.qq20261102c.asbrs2024-archived",
      "source.acr.palpable-breast-masses.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the explicitly described synthetic adult question-flag round-three profiles.",
    "limitation": "Case-specific provenance inference. Specialist assessment chooses a representative biopsy technique; it does not mandate biopsy of every benign palpable finding or declare all clips unreliable.",
    "verificationScope": "Offline author synthesis/application from recorded claims and their existing source records; no fresh source retrieval, source-access-date change or clinical approval. Direct alignment of the application remains for independent clinical/source review."
  }
];
