import type { EvidenceClaim } from "./pilot-schema";

/** Existing publication metadata/access dates are retained; no fresh source verification. */
export const QUESTION_BANK_BATCH2B_CLAIMS: (EvidenceClaim & {basisClaimIds:string[];verificationScope:string})[] = [
  {
    "id": "claim.qbp2b.b2b01.application",
    "statement": "Ongoing stump leakage with a continuous draining main duct supports internal diversion using a plastic stent.",
    "basisClaimIds": [
      "claim.early.bile-leak.ce-mrcp-anatomic-localization",
      "claim.early.bile-leak.minor-leak-ercp-stent"
    ],
    "sourceIds": [
      "source.wses.bile-duct-injury.2021",
      "source.esge.biliary-stenting.2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "Existing WSES/ESGE records support minor-leak stenting. Exact comparative endoscopic ranking requires hepatobiliary/source-alignment review; no output-volume or intervention-time cutoff is invented. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b02.application",
    "statement": "The microvascular immune deposits and pre-event donor-target reactivity support a pre-existing antibody pathway.",
    "basisClaimIds": [
      "claim.gs028e.hyperacute_preformed",
      "claim.gs028e.hyperacute_vascular",
      "claim.gs028e.t_cell_graft_comparison",
      "claim.qf3.preimplantation-specimen-inference"
    ],
    "sourceIds": [
      "source.gs028e.hyperacute_matsuda2016",
      "source.gs028e.ahrq_transplant2012"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "No Banff criterion, assay performance, immunosuppressive treatment or exact graft-failure timing rule is authored. The causal review is an application of existing recorded mechanism claims. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b03.application",
    "statement": "The new irreducible bowel-containing hernia and closed-loop pattern change the prior elective problem.",
    "basisClaimIds": [
      "claim.cirrhosis.multifactor-risk",
      "claim.cirrhosis.optimize-decompensation",
      "claim.qf3.cirrhosis-urgent-hernia-boundary"
    ],
    "sourceIds": [
      "source.cirrhosis.aga-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "Urgent surgical assessment is supported by the retained emergency boundary; the exact operative technique and bowel resection decision are not specified. The CT is a constructed observation, not a new risk threshold. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b04.application",
    "statement": "The persistent focal problem is a superficial collection, despite improvement in the lymphatic inflammatory streak.",
    "basisClaimIds": [
      "claim.lymphangitis.distal-entry-proximal-streak-regional-nodes",
      "claim.bread-butter.skin-infection.equivocal-ultrasound",
      "claim.bread-butter.cutaneous-abscess.incision-drainage",
      "claim.bread-butter.cutaneous-abscess.antibiotic-nuance",
      "claim.qf3.soft-tissue-ultrasound-application"
    ],
    "sourceIds": [
      "source.msd-manual-professional.lymphangitis.2026",
      "source.bread-butter.acep-sonoguide-abscess",
      "source.bread-butter.idsa-ssti-2014",
      "source.bread-butter.bmjopen-abscess-meta-2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "No organism, antibiotic drug/dose, cavity-size cutoff or fascial-infection protocol is inferred; skin/vascular review must confirm the offered procedure ranking. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b06.application",
    "statement": "The sampled fluid did not represent the suspicious tissue.",
    "basisClaimIds": [
      "claim.dtc.preop-ultrasound",
      "claim.dtc.extent",
      "claim.qq20261102c.thyroid-cystic-node-discordance",
      "claim.qf3.thyroid-washout-provenance"
    ],
    "sourceIds": [
      "source.dtc.ata-2025",
      "source.dtc.ata-summary-2025",
      "source.qq20261102c.ata2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "The original 12-mm observation is retained, not a new cutoff. Repeat sampling must use an appropriate noncontaminating nodal approach in every option; no washout diagnostic threshold or operative extent is authored. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b07.application",
    "statement": "The discussion demonstrates understanding, appreciation of personal consequences, reasoning and a communicated choice.",
    "basisClaimIds": [
      "claim.gs028se.capacity-refusal.3",
      "claim.gs028se.capacity-refusal.1"
    ],
    "sourceIds": [
      "source.gs028se.ama-consent-2-1-1",
      "source.gs028se.ama-capacity-2-1-2"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "Ethics application only; no jurisdiction-specific legal rule, involuntary-treatment policy or thyroid biopsy threshold is introduced. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b08.application",
    "statement": "The separated residual invasive sites and extensive intervening/central in-situ field, not the absent palpable mass, make conservation unsuitable in this constructed distribution.",
    "basisClaimIds": [
      "claim.nact.bcs-selection",
      "claim.nact.response-mapping",
      "claim.nact.oncoplastic-selection"
    ],
    "sourceIds": [
      "source.nact.asbrs-2025",
      "source.bcs.asbrs-2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "No lesion-distance, breast-volume or universal multicentricity cutoff. Breast clinician must confirm the unique ranking for this distribution and that conservation is not reasonably feasible. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b09.application",
    "statement": "The evolving examination suggests threatened or infarcted bowel despite improving circulation/chemistry.",
    "basisClaimIds": [
      "claim.gs028c.ami.peritonitis-exploration"
    ],
    "sourceIds": [
      "source.wses.ami.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "No lactate or blood-pressure cutoff, required hybrid technique or universal revascularization method is specified. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b10.application",
    "statement": "The response has separated the palpable/enhancing remnant from the original marked bed.",
    "basisClaimIds": [
      "claim.nact.response-mapping"
    ],
    "sourceIds": [
      "source.nact.asbrs-2025",
      "source.bcs.asbrs-2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "This is mapping rather than a mandated resection margin or imaging modality. Technique and extent remain for breast review. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b11.application",
    "statement": "Recovery of function and unsupported circulation/respiration favors index-admission surgery in this constructed patient; older age and a remote event do not by themselves select drainage.",
    "basisClaimIds": [
      "claim.gs028c.cholecystitis.index-admission-cholecystectomy"
    ],
    "sourceIds": [
      "source.wses.cholecystitis.2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "WSES fit-adult boundary reused offline. This is not an anaesthetic risk score or a claim that these observations alone replace full preoperative assessment. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b12.application",
    "statement": "The superficial vascular finding and improving localized course fit supportive care for uncomplicated Mondor disease, with follow-up.",
    "basisClaimIds": [
      "claim.mondor-disease.supportive-management-and-boundaries",
      "claim.mondor-disease.classic-clinical-phenotype",
      "claim.gs028se.confidentiality.4"
    ],
    "sourceIds": [
      "source.statpearls.mondor-disease.2023",
      "source.amano-shimizu.mondor-review.2018",
      "source.gs028se.ama-confidentiality-3-2-1"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "No anticoagulant/NSAID dose, exact vein length or mandatory duration; medicine suitability and atypical findings require clinician review. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b13.application",
    "statement": "The spontaneous unilateral bloody component still warrants a breast diagnostic pathway; a plausible medication effect on the expressed bilateral component does not explain away both patterns.",
    "basisClaimIds": [
      "claim.discharge.pathologic-pattern",
      "claim.discharge.imaging",
      "claim.qq20261102a.mixed-discharge-medication",
      "claim.qq20261102b.mixed-discharge-parallel-evaluation"
    ],
    "sourceIds": [
      "source.discharge.acr-2022",
      "source.qq20261102a.reglan-label",
      "source.qq20261102b.pitarch"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "The medication association is already recorded; no prolactin cutoff or mandate for MRI/duct excision after completed negative imaging is added. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b14.application",
    "statement": "Persistent uncertainty after the nonvisualized appendix and noncorresponding simple cyst warrants a broader definitive study in this nonpregnant adult.",
    "basisClaimIds": [
      "claim.gs028c.appendicitis.ct-after-nondiagnostic-us"
    ],
    "sourceIds": [
      "source.sages.appendicitis.2024",
      "source.wses.appendicitis.2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "MRI is not offered as an allegedly wrong definitive alternative. The retained guideline claim has a resource-dependent CT framing; the next-study ranking in this constructed record still requires imaging review. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b15.application",
    "statement": "The new fluid is evidence of a changed liver-related state despite similar selected laboratory values.",
    "basisClaimIds": [
      "claim.cirrhosis.multifactor-risk",
      "claim.cirrhosis.optimize-decompensation"
    ],
    "sourceIds": [
      "source.cirrhosis.aga-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "No ascites drug regimen, paracentesis rule or numerical operative-risk cutoff. The retained first question/feedback remains visible and is disclosed in the packet. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b16.application",
    "statement": "The interval loss of function and asterixis-like observation require assessment for active decompensation or another acute cause; stable pressure does not establish elective readiness.",
    "basisClaimIds": [
      "claim.cirrhosis.optimize-decompensation"
    ],
    "sourceIds": [
      "source.cirrhosis.aga-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "This does not diagnose every cognitive change as hepatic encephalopathy or prescribe its treatment. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b17.application",
    "statement": "The access-specific performance and post-needle changes make dysfunction a concern beyond generalized fluid accumulation.",
    "basisClaimIds": [
      "claim.gs028d.access.dysfunction-referral"
    ],
    "sourceIds": [
      "source.ukka.vascular-access.2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "No access-flow cutoff, stenosis location, mandated intervention or dialysis prescription; exact access-team investigation remains clinical. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b18.application",
    "statement": "The current confirmed severe result meets the recorded UKKA community escalation boundary, even if an earlier value or symptom impression is reassuring.",
    "basisClaimIds": [
      "claim.gs028d.hyperkalaemia.severe-transfer"
    ],
    "sourceIds": [
      "source.ukka.hyperkalaemia.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "Uses the existing UKKA ≥6.5 mmol/L source boundary and existing observed values; no new dose, ECG exclusion rule, repeat interval or arrhythmia probability. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b19.application",
    "statement": "The attached benign cyst study is anatomically discordant with the actual palpable site.",
    "basisClaimIds": [
      "claim.gs028c.palpable.targeted-us"
    ],
    "sourceIds": [
      "source.acr.palpable-breast-masses.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "No BI-RADS threshold or universal MRI prohibition; no imaging finding is assumed to exclude a clinically suspicious lesion. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b20.application",
    "statement": "Definitive incision/drainage addresses the cavity; systemic antibiotics are also supported when spreading cellulitis or impaired host defense is present.",
    "basisClaimIds": [
      "claim.bread-butter.perianal-abscess.prompt-drainage",
      "claim.bread-butter.perianal-abscess.selective-antibiotics"
    ],
    "sourceIds": [
      "source.bread-butter.ascrs-anorectal-abscess-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "The selective-antibiotic recommendation is weak. No drug, dose, exact redness extent, tract division or incision technique is specified; clinician must verify the host/skin boundary. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b21.application",
    "statement": "The observed mobility and intake deficits are modifiable contributors that a targeted multicomponent plan should address; intact conversation does not remove postoperative risk.",
    "basisClaimIds": [
      "claim.gs028d.delirium.multicomponent-plan"
    ],
    "sourceIds": [
      "source.esaic.delirium.2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "The guideline supports targeted multicomponent care, not an exclusive bundle or a proven superiority trial between these fictional sets. Clinical review must confirm this priority wording is sufficiently bounded. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b22.application",
    "statement": "The changed examination suggests peritoneal involvement requiring prompt bowel assessment; a normal lactate does not cancel the clinical change.",
    "basisClaimIds": [
      "claim.gs028c.ami.peritonitis-exploration"
    ],
    "sourceIds": [
      "source.wses.ami.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "No claim that normal lactate excludes ischemia, and no universal vascular technique or numeric cutoff. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b23.application",
    "statement": "The clinical and imaging course fits the improving mild-biliary pathway; a residual enzyme elevation is not itself a reason for routine interval delay.",
    "basisClaimIds": [
      "claim.gs028c.pancreatitis.index-admission-cholecystectomy"
    ],
    "sourceIds": [
      "source.acg.acute-pancreatitis.2024",
      "source.wses.severe-pancreatitis.2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "No enzyme, duct-calibre or organ-failure time threshold and no ERCP drug/procedural protocol. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b24.application",
    "statement": "This includes the known original biopsy bed and current residual extent, rather than copying the full pretreatment boundary or omitting the medial known bed.",
    "basisClaimIds": [
      "claim.nact.response-mapping"
    ],
    "sourceIds": [
      "source.nact.asbrs-2025",
      "source.bcs.asbrs-2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "Bracketing is an illustrative specialist localization plan; no margin width, fixed resection radius or universal imaging modality is authored. The unchanged later conservation task remains explicitly disclosed in sequence review. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b25.application",
    "statement": "The returned study supports the acute gallbladder process despite the earlier limited inflammatory ultrasound findings.",
    "basisClaimIds": [
      "claim.gs028c.cholecystitis.index-admission-cholecystectomy",
      "claim.gs028c.cholecystitis.hida-after-equivocal-us"
    ],
    "sourceIds": [
      "source.wses.cholecystitis.2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "No acquisition duration or augmentation protocol is invented. Nuclear-report interpretation and operative eligibility remain clinical review points. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b26.application",
    "statement": "The gallstones and clinical inflammatory course remain discordant with a nondiagnostic structural inflammatory ultrasound pattern.",
    "basisClaimIds": [
      "claim.gs028c.cholecystitis.hida-after-equivocal-us"
    ],
    "sourceIds": [
      "source.wses.cholecystitis.2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "WSES permits selected HIDA; it is not universally mandatory or claimed to be the only clinically reasonable imaging. Independent imaging review must confirm single-best ranking among the offered studies. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b29.application",
    "statement": "The current confirmed severe result meets the recorded UKKA community escalation boundary, even if an earlier value or symptom impression is reassuring.",
    "basisClaimIds": [
      "claim.gs028d.hyperkalaemia.severe-transfer"
    ],
    "sourceIds": [
      "source.ukka.hyperkalaemia.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "Uses the existing UKKA ≥6.5 mmol/L source boundary and existing observed values; no new dose, ECG exclusion rule, repeat interval or arrhythmia probability. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b30.application",
    "statement": "The current confirmed severe result meets the recorded UKKA community escalation boundary, even if an earlier value or symptom impression is reassuring.",
    "basisClaimIds": [
      "claim.gs028d.hyperkalaemia.severe-transfer"
    ],
    "sourceIds": [
      "source.ukka.hyperkalaemia.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "Uses the existing UKKA ≥6.5 mmol/L source boundary and existing observed values; no new dose, ECG exclusion rule, repeat interval or arrhythmia probability. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b31.application",
    "statement": "The tissue localization and serum specificity support pre-existing recipient reactivity against donor endothelium.",
    "basisClaimIds": [
      "claim.gs028e.hyperacute_preformed",
      "claim.gs028e.hyperacute_vascular",
      "claim.gs028e.t_cell_graft_comparison"
    ],
    "sourceIds": [
      "source.gs028e.hyperacute_matsuda2016",
      "source.gs028e.ahrq_transplant2012"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "Not a Banff diagnostic algorithm; coexistence of mechanisms is possible and no treatment is prescribed. Near-duplication with B2B02 is proposed for manager merge review. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b32.application",
    "statement": "The blood-gas direction supports a metabolic acidifying process, and the adjusted gap supports an unmeasured-anion component hidden by the low albumin.",
    "basisClaimIds": [
      "claim.gs028d.acidosis.corrected-gap",
      "claim.gs028d.acidosis.blood-gas"
    ],
    "sourceIds": [
      "source.french-panel.metabolic-acidosis.2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "The laboratory supplies the adjusted result. No correction formula, pH/CO2/anion threshold, compensation formula or dose is invented. The exact lactate/ketone-versus-urinary-workup application requires French-guideline/source-alignment clinical review. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b33.application",
    "statement": "The blood-gas direction supports a metabolic acidifying process, and the adjusted gap supports an unmeasured-anion component hidden by the low albumin.",
    "basisClaimIds": [
      "claim.gs028d.acidosis.corrected-gap",
      "claim.gs028d.acidosis.blood-gas"
    ],
    "sourceIds": [
      "source.french-panel.metabolic-acidosis.2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "The laboratory supplies the adjusted result. No correction formula, pH/CO2/anion threshold, compensation formula or dose is invented. The exact lactate/ketone-versus-urinary-workup application requires French-guideline/source-alignment clinical review. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b34.application",
    "statement": "The admission gas and adjusted gap support an unmeasured-anion metabolic contribution.",
    "basisClaimIds": [
      "claim.gs028d.acidosis.corrected-gap",
      "claim.gs028d.acidosis.blood-gas"
    ],
    "sourceIds": [
      "source.french-panel.metabolic-acidosis.2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "A within-range panel does not exclude every disease. This narrow retrospective request concerns the evidence for an unmeasured-anion metabolic contribution, not current sepsis treatment. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b35.application",
    "statement": "The low bicarbonate can participate in metabolic acidosis, compensation for respiratory alkalosis, or a mixed process.",
    "basisClaimIds": [
      "claim.gs028d.acidosis.blood-gas",
      "claim.gs028d.acidosis.corrected-gap"
    ],
    "sourceIds": [
      "source.french-panel.metabolic-acidosis.2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "No acidemia inferred from bicarbonate alone; no compensation equation, universal arterial preference or blood-gas threshold. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b36.application",
    "statement": "The attached cyst is not a correlate for the skin-marker target; site-concordant targeted ultrasound is still needed.",
    "basisClaimIds": [
      "claim.gs028c.palpable.targeted-us"
    ],
    "sourceIds": [
      "source.acr.palpable-breast-masses.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "The gate continues to use the existing ultrasound service/routes; no new imaging execution or biopsy rule is encoded here. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b37.application",
    "statement": "After completed site-concordant imaging, a persistently suspicious palpable target requires tissue evaluation; the absence of a sonographic target does not remove the clinical one.",
    "basisClaimIds": [
      "claim.gs028c.palpable.biopsy"
    ],
    "sourceIds": [
      "source.acr.palpable-breast-masses.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "Palpation-directed core is an illustrative breast-team request, not a mandate where surgical sampling or a different local technique is more suitable. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b38.application",
    "statement": "Drainage is essential.",
    "basisClaimIds": [
      "claim.bread-butter.perianal-abscess.prompt-drainage",
      "claim.bread-butter.perianal-abscess.selective-antibiotics"
    ],
    "sourceIds": [
      "source.bread-butter.ascrs-anorectal-abscess-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "The selective-antibiotic recommendation is weak. No drug, dose, exact redness extent, tract division or incision technique is specified; clinician must verify the host/skin boundary. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b39.application",
    "statement": "Definitive incision/drainage addresses the cavity; systemic antibiotics are also supported when spreading cellulitis or impaired host defense is present.",
    "basisClaimIds": [
      "claim.bread-butter.perianal-abscess.prompt-drainage",
      "claim.bread-butter.perianal-abscess.selective-antibiotics"
    ],
    "sourceIds": [
      "source.bread-butter.ascrs-anorectal-abscess-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "The selective-antibiotic recommendation is weak. No drug, dose, exact redness extent, tract division or incision technique is specified; clinician must verify the host/skin boundary. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b40.application",
    "statement": "Drainage is essential.",
    "basisClaimIds": [
      "claim.bread-butter.perianal-abscess.prompt-drainage",
      "claim.bread-butter.perianal-abscess.selective-antibiotics"
    ],
    "sourceIds": [
      "source.bread-butter.ascrs-anorectal-abscess-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "The selective-antibiotic recommendation is weak. No drug, dose, exact redness extent, tract division or incision technique is specified; clinician must verify the host/skin boundary. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b41.application",
    "statement": "Weight alone does not exclude nutritional risk, and inflammation limits albumin as a diagnosis.",
    "basisClaimIds": [
      "claim.nutrition.screen",
      "claim.nutrition.oral-enteral",
      "claim.nutrition.pn-boundary"
    ],
    "sourceIds": [
      "source.nutrition.espen-practical-2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "No BMI, weight-loss, albumin, intake-percent or intervention-timing threshold; dietitian/clinician must establish the diagnosis and prescription. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  },
  {
    "id": "claim.qbp2b.b2b42.application",
    "statement": "The record shows persistent oral inadequacy despite an actual oral trial, with evidence of gut transit.",
    "basisClaimIds": [
      "claim.nutrition.oral-enteral",
      "claim.nutrition.pn-boundary"
    ],
    "sourceIds": [
      "source.nutrition.espen-practical-2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the described synthetic batch-2b adult case; observed values and reports are constructed inputs, not patient data or guideline cutoffs.",
    "limitation": "Transit is not a complete absorption assessment. Tube placement, aspiration risk, formula, dose and timing require review; no specific tube site or numeric intake threshold is prescribed. Sources are the existing recorded publications; multiple source IDs may refer to the same publication. No fresh verification or independent clinical approval; application certainty never upgrades a low/conflicting basis.",
    "lastCheckedOn": "2026-11-04",
    "contentVersion": "evidence.question-bank-batch2b.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "verificationScope": "Offline application of existing mapped guidance; no source retrieval, source-text storage, access-date advance or new clinical threshold."
  }
];
