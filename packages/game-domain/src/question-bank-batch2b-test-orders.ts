import type { ExactTestChoiceOrderRecord } from "./test-choice-orders";

/** Exact new-version bindings only. Existing services or nonexecuted planning previews. */
export const QUESTION_BANK_BATCH2B_TEST_ORDER_RECORDS: readonly ExactTestChoiceOrderRecord[] = [
  {
    "caseId": "case.gs028e.mis-principles.c3-phrenic-pathway",
    "nodeId": "node.gs028e.mis-principles.c3-phrenic-pathway.1",
    "questionVariantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r5",
    "choiceId": "correct_2",
    "choiceLabel": "ERCP with transpapillary plastic stenting",
    "timingProfileId": "timing.test.therapeutic_ercp",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028e.mis-principles.c3-phrenic-pathway",
    "nodeId": "node.gs028e.mis-principles.c3-phrenic-pathway.1",
    "questionVariantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r5",
    "choiceId": "choice.qbp2b.20261104.b2b01.d1",
    "choiceLabel": "ERCP with biliary sphincterotomy",
    "timingProfileId": "timing.test.therapeutic_ercp",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028e.mis-principles.c3-phrenic-pathway",
    "nodeId": "node.gs028e.mis-principles.c3-phrenic-pathway.1",
    "questionVariantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r5",
    "choiceId": "choice.qbp2b.20261104.b2b01.d2",
    "choiceLabel": "Percutaneous transhepatic biliary drainage",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.lymphangitis.heel-inguinal",
    "nodeId": "node.lymphangitis.heel-inguinal.v1",
    "questionVariantId": "question.lymphangitis.heel-inguinal.v1.r5",
    "choiceId": "acute_lymphangitis",
    "choiceLabel": "Incision and drainage of the cavity",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.lymphangitis.heel-inguinal",
    "nodeId": "node.lymphangitis.heel-inguinal.v1",
    "questionVariantId": "question.lymphangitis.heel-inguinal.v1.r5",
    "choiceId": "choice.qbp2b.20261104.b2b04.d1",
    "choiceLabel": "Ultrasound-guided aspiration of the cavity",
    "timingProfileId": "timing.test.ultrasound_guided_aspiration",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-completed-negative",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-completed-negative.1",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r5",
    "choiceId": "correct_4",
    "choiceLabel": "Peripheral tissue: cytology and thyroglobulin washout",
    "timingProfileId": "timing.test.ultrasound_guided_aspiration",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-completed-negative",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-completed-negative.1",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r5",
    "choiceId": "choice.qbp2b.20261104.b2b06.d1",
    "choiceLabel": "Central cyst fluid: cytology and thyroglobulin washout",
    "timingProfileId": "timing.test.ultrasound_guided_aspiration",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-completed-negative",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-completed-negative.1",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r5",
    "choiceId": "choice.qbp2b.20261104.b2b06.d2",
    "choiceLabel": "Peripheral tissue: cytology and flow cytometry",
    "timingProfileId": "timing.test.ultrasound_guided_aspiration",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-completed-negative",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-completed-negative.1",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r5",
    "choiceId": "choice.qbp2b.20261104.b2b06.d3",
    "choiceLabel": "Central cyst fluid: cytology and flow cytometry",
    "timingProfileId": "timing.test.ultrasound_guided_aspiration",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.post-neoadjuvant-breast.a-residual-palpable",
    "nodeId": "node.gs028b.post-neoadjuvant-breast.a-residual-palpable.1",
    "questionVariantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v2.r1",
    "choiceId": "correct_2",
    "choiceLabel": "Localize the enhancing focus and original marker",
    "timingProfileId": "timing.test.breast_imaging_bundle",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.post-neoadjuvant-breast.a-residual-palpable",
    "nodeId": "node.gs028b.post-neoadjuvant-breast.a-residual-palpable.1",
    "questionVariantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v2.r1",
    "choiceId": "choice.qbp2b.20261104.b2b10.d1",
    "choiceLabel": "Localize the enhancing focus and palpable remnant",
    "timingProfileId": "timing.test.breast_imaging_bundle",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.post-neoadjuvant-breast.a-residual-palpable",
    "nodeId": "node.gs028b.post-neoadjuvant-breast.a-residual-palpable.1",
    "questionVariantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v2.r1",
    "choiceId": "choice.qbp2b.20261104.b2b10.d2",
    "choiceLabel": "Localize the pretreatment outline and original marker",
    "timingProfileId": "timing.test.breast_imaging_bundle",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.post-neoadjuvant-breast.a-residual-palpable",
    "nodeId": "node.gs028b.post-neoadjuvant-breast.a-residual-palpable.1",
    "questionVariantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v2.r1",
    "choiceId": "choice.qbp2b.20261104.b2b10.d3",
    "choiceLabel": "Localize the pretreatment outline and palpable remnant",
    "timingProfileId": "timing.test.breast_imaging_bundle",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.nipple-discharge.b-negative-first-line",
    "nodeId": "node.gs028b.nipple-discharge.b-negative-first-line.1",
    "questionVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v4.r1",
    "choiceId": "correct_4",
    "choiceLabel": "Diagnostic mammography with targeted ultrasound",
    "timingProfileId": "timing.test.breast_imaging_bundle",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.nipple-discharge.b-negative-first-line",
    "nodeId": "node.gs028b.nipple-discharge.b-negative-first-line.1",
    "questionVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v4.r1",
    "choiceId": "choice.qbp2b.20261104.b2b13.d1",
    "choiceLabel": "Contrast-enhanced breast MRI with targeted ultrasound",
    "timingProfileId": "timing.test.combined_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.nipple-discharge.b-negative-first-line",
    "nodeId": "node.gs028b.nipple-discharge.b-negative-first-line.1",
    "questionVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v4.r1",
    "choiceId": "choice.qbp2b.20261104.b2b13.d2",
    "choiceLabel": "Screening mammography with targeted ultrasound",
    "timingProfileId": "timing.test.breast_imaging_bundle",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.appendicitis.a-competing-diagnoses",
    "nodeId": "node.gs028c.appendicitis.a-competing-diagnoses.1",
    "questionVariantId": "question.appendicitis.stable-adult-ct.v4.r1",
    "choiceId": "correct_4",
    "choiceLabel": "Abdominopelvic computed tomography",
    "timingProfileId": "timing.test.ct",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.appendicitis.a-competing-diagnoses",
    "nodeId": "node.gs028c.appendicitis.a-competing-diagnoses.1",
    "questionVariantId": "question.appendicitis.stable-adult-ct.v4.r1",
    "choiceId": "choice.qbp2b.20261104.b2b14.d1",
    "choiceLabel": "Repeat focused appendiceal ultrasound",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.appendicitis.a-competing-diagnoses",
    "nodeId": "node.gs028c.appendicitis.a-competing-diagnoses.1",
    "questionVariantId": "question.appendicitis.stable-adult-ct.v4.r1",
    "choiceId": "choice.qbp2b.20261104.b2b14.d2",
    "choiceLabel": "Transvaginal pelvic ultrasonography",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.palpable-breast.a-discordant-exam",
    "nodeId": "node.gs028c.palpable-breast.a-discordant-exam.1",
    "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v4.r1",
    "choiceId": "correct_4",
    "choiceLabel": "Ultrasound of the marked lower inner site",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "terminal_service",
      "serviceId": "service.ultrasound",
      "allowedRouteIds": [
        "route.ultrasound.in_house",
        "route.ultrasound.outsourced"
      ]
    }
  },
  {
    "caseId": "case.gs028c.palpable-breast.a-discordant-exam",
    "nodeId": "node.gs028c.palpable-breast.a-discordant-exam.1",
    "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v4.r1",
    "choiceId": "choice.qbp2b.20261104.b2b19.d1",
    "choiceLabel": "Repeat mammography of the marked lower inner site",
    "timingProfileId": "timing.test.mammography",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.palpable-breast.a-discordant-exam",
    "nodeId": "node.gs028c.palpable-breast.a-discordant-exam.1",
    "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v4.r1",
    "choiceId": "choice.qbp2b.20261104.b2b19.d2",
    "choiceLabel": "Contrast-enhanced MRI of the affected breast",
    "timingProfileId": "timing.test.breast_mri",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.bread-butter.perianal-abscess.draining-pain",
    "nodeId": "node.bread-butter.perianal-abscess.draining-pain.1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v4.r1",
    "choiceId": "drain_4",
    "choiceLabel": "Open drainage with systemic antibiotics",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "existing_terminal_procedure"
    }
  },
  {
    "caseId": "case.bread-butter.perianal-abscess.draining-pain",
    "nodeId": "node.bread-butter.perianal-abscess.draining-pain.1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v4.r1",
    "choiceId": "choice.qbp2b.20261104.b2b20.d1",
    "choiceLabel": "Open drainage with local wound care",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.bread-butter.perianal-abscess.draining-pain",
    "nodeId": "node.bread-butter.perianal-abscess.draining-pain.1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v4.r1",
    "choiceId": "choice.qbp2b.20261104.b2b20.d2",
    "choiceLabel": "Needle aspiration with systemic antibiotics",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.bread-butter.perianal-abscess.draining-pain",
    "nodeId": "node.bread-butter.perianal-abscess.draining-pain.1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v4.r1",
    "choiceId": "choice.qbp2b.20261104.b2b20.d3",
    "choiceLabel": "Needle aspiration with local wound care",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.mild-biliary-pancreatitis.b-discharge-rounds",
    "nodeId": "node.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.1",
    "questionVariantId": "question.acute-pancreatitis.mild-biliary-chole-before-discharge.v3.r1",
    "choiceId": "choice.qbp2b.20261104.b2b23.d1",
    "choiceLabel": "ERCP preceding laparoscopic cholecystectomy",
    "timingProfileId": "timing.test.therapeutic_ercp",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.post-neoadjuvant-breast.paired-marker-residual",
    "nodeId": "node.gs028b.post-neoadjuvant-breast.paired-marker-residual.1",
    "questionVariantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r1",
    "choiceId": "correct_1",
    "choiceLabel": "Original marker to current enhancing edge",
    "timingProfileId": "timing.test.breast_imaging_bundle",
    "disposition": {
      "kind": "result_gate_route_override",
      "serviceId": "service.diagnostic_breast_imaging",
      "allowedRouteIds": [
        "route.diagnostic_breast_imaging.outsourced"
      ]
    }
  },
  {
    "caseId": "case.gs028b.post-neoadjuvant-breast.paired-marker-residual",
    "nodeId": "node.gs028b.post-neoadjuvant-breast.paired-marker-residual.1",
    "questionVariantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r1",
    "choiceId": "choice.qbp2b.20261104.b2b24.d1",
    "choiceLabel": "Original marker to pretreatment outer edge",
    "timingProfileId": "timing.test.breast_imaging_bundle",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.post-neoadjuvant-breast.paired-marker-residual",
    "nodeId": "node.gs028b.post-neoadjuvant-breast.paired-marker-residual.1",
    "questionVariantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r1",
    "choiceId": "choice.qbp2b.20261104.b2b24.d2",
    "choiceLabel": "Current enhancing edge to pretreatment outer edge",
    "timingProfileId": "timing.test.breast_imaging_bundle",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.acute-cholecystitis.a-limited-ultrasound",
    "nodeId": "node.gs028c.acute-cholecystitis.a-limited-ultrasound.1",
    "questionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v3.r1",
    "choiceId": "correct_3",
    "choiceLabel": "Hepatobiliary scintigraphy",
    "timingProfileId": "timing.test.nuclear_imaging",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.acute-cholecystitis.a-limited-ultrasound",
    "nodeId": "node.gs028c.acute-cholecystitis.a-limited-ultrasound.1",
    "questionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v3.r1",
    "choiceId": "choice.qbp2b.20261104.b2b26.d1",
    "choiceLabel": "Contrast-enhanced abdominal CT",
    "timingProfileId": "timing.test.ct",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.acute-cholecystitis.a-limited-ultrasound",
    "nodeId": "node.gs028c.acute-cholecystitis.a-limited-ultrasound.1",
    "questionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v3.r1",
    "choiceId": "choice.qbp2b.20261104.b2b26.d2",
    "choiceLabel": "Magnetic resonance cholangiopancreatography",
    "timingProfileId": "timing.test.mrcp",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028d.acid-base.b-cirrhosis-gap",
    "nodeId": "node.gs028d.acid-base.b-cirrhosis-gap.1",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r1",
    "choiceId": "correct_1",
    "choiceLabel": "Serum lactate and blood-ketone testing",
    "timingProfileId": "timing.test.basic_labs",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028d.acid-base.b-cirrhosis-gap",
    "nodeId": "node.gs028d.acid-base.b-cirrhosis-gap.1",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r1",
    "choiceId": "choice.qbp2b.20261104.b2b32.d1",
    "choiceLabel": "Renal acidification testing with urinary electrolytes",
    "timingProfileId": "timing.test.basic_labs",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028d.acid-base.b-cirrhosis-gap",
    "nodeId": "node.gs028d.acid-base.b-cirrhosis-gap.1",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r1",
    "choiceId": "choice.qbp2b.20261104.b2b32.d2",
    "choiceLabel": "Ventilation reassessment with a repeat blood gas",
    "timingProfileId": "timing.test.basic_labs",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028d.acid-base.b-malnutrition-gap",
    "nodeId": "node.gs028d.acid-base.b-malnutrition-gap.1",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v2.r1",
    "choiceId": "correct_2",
    "choiceLabel": "Serum lactate and blood-ketone testing",
    "timingProfileId": "timing.test.basic_labs",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028d.acid-base.b-malnutrition-gap",
    "nodeId": "node.gs028d.acid-base.b-malnutrition-gap.1",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v2.r1",
    "choiceId": "choice.qbp2b.20261104.b2b33.d1",
    "choiceLabel": "Renal acidification testing with urinary electrolytes",
    "timingProfileId": "timing.test.basic_labs",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028d.acid-base.b-malnutrition-gap",
    "nodeId": "node.gs028d.acid-base.b-malnutrition-gap.1",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v2.r1",
    "choiceId": "choice.qbp2b.20261104.b2b33.d2",
    "choiceLabel": "Ventilation reassessment with a repeat blood gas",
    "timingProfileId": "timing.test.basic_labs",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028d.acid-base.a-tachypnea-low-bicarb",
    "nodeId": "node.gs028d.acid-base.a-tachypnea-low-bicarb.1",
    "questionVariantId": "question.metabolic-acidosis.confirm-with-blood-gas.v3.r1",
    "choiceId": "correct_3",
    "choiceLabel": "Blood gas with pH and carbon dioxide",
    "timingProfileId": "timing.test.basic_labs",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028d.acid-base.a-tachypnea-low-bicarb",
    "nodeId": "node.gs028d.acid-base.a-tachypnea-low-bicarb.1",
    "questionVariantId": "question.metabolic-acidosis.confirm-with-blood-gas.v3.r1",
    "choiceId": "choice.qbp2b.20261104.b2b35.d1",
    "choiceLabel": "Serum lactate and blood ketones",
    "timingProfileId": "timing.test.basic_labs",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028d.acid-base.a-tachypnea-low-bicarb",
    "nodeId": "node.gs028d.acid-base.a-tachypnea-low-bicarb.1",
    "questionVariantId": "question.metabolic-acidosis.confirm-with-blood-gas.v3.r1",
    "choiceId": "choice.qbp2b.20261104.b2b35.d2",
    "choiceLabel": "Repeat chemistry with an albumin-adjusted anion gap",
    "timingProfileId": "timing.test.basic_labs",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.palpable-breast.paired-dense-focal",
    "nodeId": "node.gs028c.palpable-breast.paired-dense-focal.1",
    "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v1.r1",
    "choiceId": "correct_1",
    "choiceLabel": "Ultrasound at the marked lower inner site",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "result_gate_route_override",
      "serviceId": "service.ultrasound",
      "allowedRouteIds": [
        "route.ultrasound.in_house",
        "route.ultrasound.outsourced"
      ]
    }
  },
  {
    "caseId": "case.gs028c.palpable-breast.paired-dense-focal",
    "nodeId": "node.gs028c.palpable-breast.paired-dense-focal.1",
    "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v1.r1",
    "choiceId": "choice.qbp2b.20261104.b2b36.d1",
    "choiceLabel": "Mammography at the marked lower inner site",
    "timingProfileId": "timing.test.mammography",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.palpable-breast.paired-dense-focal",
    "nodeId": "node.gs028c.palpable-breast.paired-dense-focal.1",
    "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v1.r1",
    "choiceId": "choice.qbp2b.20261104.b2b36.d2",
    "choiceLabel": "Contrast-enhanced MRI of the left breast",
    "timingProfileId": "timing.test.breast_mri",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.palpable-breast.paired-dense-focal",
    "nodeId": "node.gs028c.palpable-breast.paired-dense-focal.2",
    "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v1.r1",
    "choiceId": "correct_1",
    "choiceLabel": "Palpation-directed core sampling through the breast team",
    "timingProfileId": "timing.test.breast_core_biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.palpable-breast.paired-dense-focal",
    "nodeId": "node.gs028c.palpable-breast.paired-dense-focal.2",
    "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v1.r1",
    "choiceId": "choice.qbp2b.20261104.b2b37.d1",
    "choiceLabel": "Contrast-enhanced MRI through the breast team",
    "timingProfileId": "timing.test.breast_mri",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.palpable-breast.paired-dense-focal",
    "nodeId": "node.gs028c.palpable-breast.paired-dense-focal.2",
    "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v1.r1",
    "choiceId": "choice.qbp2b.20261104.b2b37.d2",
    "choiceLabel": "Short-interval clinical and ultrasound review through the breast team",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.bread-butter.perianal-abscess.tender-perianal-lump",
    "nodeId": "node.bread-butter.perianal-abscess.tender-perianal-lump.1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v1.r1",
    "choiceId": "drain_1",
    "choiceLabel": "Open drainage with local wound care",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "existing_terminal_procedure"
    }
  },
  {
    "caseId": "case.bread-butter.perianal-abscess.tender-perianal-lump",
    "nodeId": "node.bread-butter.perianal-abscess.tender-perianal-lump.1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v1.r1",
    "choiceId": "choice.qbp2b.20261104.b2b38.d1",
    "choiceLabel": "Open drainage with systemic antibiotics",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.bread-butter.perianal-abscess.tender-perianal-lump",
    "nodeId": "node.bread-butter.perianal-abscess.tender-perianal-lump.1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v1.r1",
    "choiceId": "choice.qbp2b.20261104.b2b38.d2",
    "choiceLabel": "Needle aspiration with systemic antibiotics",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.bread-butter.perianal-abscess.tender-perianal-lump",
    "nodeId": "node.bread-butter.perianal-abscess.tender-perianal-lump.1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v1.r1",
    "choiceId": "choice.qbp2b.20261104.b2b38.d3",
    "choiceLabel": "Needle aspiration with local wound care",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.bread-butter.perianal-abscess.perianal-swelling",
    "nodeId": "node.bread-butter.perianal-abscess.perianal-swelling.1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v2.r1",
    "choiceId": "drain_2",
    "choiceLabel": "Open drainage with systemic antibiotics",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "existing_terminal_procedure"
    }
  },
  {
    "caseId": "case.bread-butter.perianal-abscess.perianal-swelling",
    "nodeId": "node.bread-butter.perianal-abscess.perianal-swelling.1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v2.r1",
    "choiceId": "choice.qbp2b.20261104.b2b39.d1",
    "choiceLabel": "Open drainage with local wound care",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.bread-butter.perianal-abscess.perianal-swelling",
    "nodeId": "node.bread-butter.perianal-abscess.perianal-swelling.1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v2.r1",
    "choiceId": "choice.qbp2b.20261104.b2b39.d2",
    "choiceLabel": "Needle aspiration with systemic antibiotics",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.bread-butter.perianal-abscess.perianal-swelling",
    "nodeId": "node.bread-butter.perianal-abscess.perianal-swelling.1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v2.r1",
    "choiceId": "choice.qbp2b.20261104.b2b39.d3",
    "choiceLabel": "Needle aspiration with local wound care",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.bread-butter.perianal-abscess.painful-sitting",
    "nodeId": "node.bread-butter.perianal-abscess.painful-sitting.1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v3.r1",
    "choiceId": "drain_3",
    "choiceLabel": "Open drainage with local wound care",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "existing_terminal_procedure"
    }
  },
  {
    "caseId": "case.bread-butter.perianal-abscess.painful-sitting",
    "nodeId": "node.bread-butter.perianal-abscess.painful-sitting.1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v3.r1",
    "choiceId": "choice.qbp2b.20261104.b2b40.d1",
    "choiceLabel": "Open drainage with systemic antibiotics",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.bread-butter.perianal-abscess.painful-sitting",
    "nodeId": "node.bread-butter.perianal-abscess.painful-sitting.1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v3.r1",
    "choiceId": "choice.qbp2b.20261104.b2b40.d2",
    "choiceLabel": "Needle aspiration with systemic antibiotics",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.bread-butter.perianal-abscess.painful-sitting",
    "nodeId": "node.bread-butter.perianal-abscess.painful-sitting.1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v3.r1",
    "choiceId": "choice.qbp2b.20261104.b2b40.d3",
    "choiceLabel": "Needle aspiration with local wound care",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  }
];
