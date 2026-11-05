import type { ExactTestChoiceOrderRecord } from "./test-choice-orders";

/** Exact new draft tuples; old variants and all runtime executors remain unchanged. */
export const QUESTION_BANK_BATCH2A_ROUND3_TEST_ORDER_RECORDS: readonly ExactTestChoiceOrderRecord[] = [
  {
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.1",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v2.r9",
    "choiceId": "manometry_2",
    "choiceLabel": "Multiple-rapid-swallow pressure acquisition",
    "timingProfileId": "timing.test.esophageal_manometry",
    "disposition": {
      "kind": "result_gate_route_override",
      "serviceId": "service.esophageal_manometry",
      "allowedRouteIds": [
        "route.esophageal_manometry.outsourced"
      ]
    }
  },
  {
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.1",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v2.r9",
    "choiceId": "choice.qbp2ar3.20261104.b2a03.d1",
    "choiceLabel": "Upright single-water-swallow pressure acquisition",
    "timingProfileId": "timing.test.esophageal_manometry",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.1",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v2.r9",
    "choiceId": "choice.qbp2ar3.20261104.b2a03.d2",
    "choiceLabel": "Rapid-drink challenge pressure acquisition",
    "timingProfileId": "timing.test.esophageal_manometry",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.achalasia.slow-meals",
    "nodeId": "node.achalasia.slow-meals.1",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v3.r11",
    "choiceId": "manometry_3",
    "choiceLabel": "Reduced post-swallow reserve with preserved junction relaxation",
    "timingProfileId": "timing.test.contrast_swallow",
    "disposition": {
      "kind": "result_gate_route_override",
      "serviceId": "service.contrast_swallow",
      "allowedRouteIds": [
        "route.contrast_swallow.outsourced"
      ]
    }
  },
  {
    "caseId": "case.achalasia.slow-meals",
    "nodeId": "node.achalasia.slow-meals.1",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v3.r11",
    "choiceId": "choice.qbp2ar3.20261104.b2a04.d1",
    "choiceLabel": "Preserved post-swallow reserve with preserved junction relaxation",
    "timingProfileId": "timing.test.contrast_swallow",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.achalasia.slow-meals",
    "nodeId": "node.achalasia.slow-meals.1",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v3.r11",
    "choiceId": "choice.qbp2ar3.20261104.b2a04.d2",
    "choiceLabel": "Absent esophageal body contractility with impaired junction relaxation",
    "timingProfileId": "timing.test.contrast_swallow",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.1",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r9",
    "choiceId": "dynamic_ultrasound_2",
    "choiceLabel": "Deep inguinal ring during Valsalva",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "result_gate_route_override",
      "serviceId": "service.ultrasound",
      "allowedRouteIds": [
        "route.ultrasound.outsourced",
        "route.ultrasound.in_house"
      ]
    }
  },
  {
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.1",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r9",
    "choiceId": "choice.qbp2ar3.20261104.b2a06.d1",
    "choiceLabel": "Posterior inguinal wall during Valsalva",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.1",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r9",
    "choiceId": "choice.qbp2ar3.20261104.b2a06.d2",
    "choiceLabel": "Femoral canal during Valsalva",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.adrenal-incidentaloma.small-adrenal-adenoma",
    "nodeId": "node.adrenal-incidentaloma.small-adrenal-adenoma.1",
    "questionVariantId": "question.adrenal-incidentaloma.one-mg-dst.v4.r4",
    "choiceId": "dst_4",
    "choiceLabel": "Noncontrast adrenal CT",
    "timingProfileId": "timing.test.ct",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.adrenal-incidentaloma.small-adrenal-adenoma",
    "nodeId": "node.adrenal-incidentaloma.small-adrenal-adenoma.1",
    "questionVariantId": "question.adrenal-incidentaloma.one-mg-dst.v4.r4",
    "choiceId": "choice.qbp2ar3.20261104.b2a11.d1",
    "choiceLabel": "Dedicated pituitary MRI",
    "timingProfileId": "timing.test.mri",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.adrenal-incidentaloma.small-adrenal-adenoma",
    "nodeId": "node.adrenal-incidentaloma.small-adrenal-adenoma.1",
    "questionVariantId": "question.adrenal-incidentaloma.one-mg-dst.v4.r4",
    "choiceId": "choice.qbp2ar3.20261104.b2a11.d2",
    "choiceLabel": "Contrast-enhanced chest CT",
    "timingProfileId": "timing.test.ct",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  }
];
