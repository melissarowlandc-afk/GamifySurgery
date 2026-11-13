import type { SyntheticClinicalCase } from "@gamify-surgery/clinical-content";

// Exact pre-ENG-I01 admission compatibility, not a concept or new-content
// allowlist. Revised/new tuples must declare their procedure context.
const legacy = [
  {
    "caseId": "case.l2.colonic-lipoma.direct.typical-a",
    "kind": "endoscopy",
    "setting": "outpatient_endoscopy",
    "variants": [
      "question.colonic-lipoma.recognition.patient-to-diagnosis.v1.r7",
      "question.colonic-lipoma.management.patient-to-plan.v1.r3"
    ],
    "nodeIds": [
      "node.colonic-lipoma.recognition.patient-to-diagnosis.v1",
      "node.colonic-lipoma.management.patient-to-plan.v1"
    ],
    "conceptIds": [
      "concept.colonic-lipoma.endoscopic-recognition.v3",
      "concept.colonic-lipoma.asymptomatic-management"
    ]
  },
  {
    "caseId": "case.l2.colonic-lipoma.direct.typical-b",
    "kind": "endoscopy",
    "setting": "outpatient_endoscopy",
    "variants": [
      "question.colonic-lipoma.recognition.patient-to-diagnosis.v2.r7",
      "question.colonic-lipoma.management.patient-to-plan.v2.r3"
    ],
    "nodeIds": [
      "node.colonic-lipoma.recognition.patient-to-diagnosis.v2",
      "node.colonic-lipoma.management.patient-to-plan.v2"
    ],
    "conceptIds": [
      "concept.colonic-lipoma.endoscopic-recognition.v3",
      "concept.colonic-lipoma.asymptomatic-management"
    ]
  },
  {
    "caseId": "case.l2.wound-healing.vitamin-c.vitamin-identification.v1",
    "kind": null,
    "setting": "periop_recovery",
    "variants": [
      "question.wound-healing.vitamin-c.vitamin-identification.v1"
    ],
    "nodeIds": [
      "node.wound-healing.vitamin-c.vitamin-identification.v1"
    ],
    "conceptIds": [
      "concept.wound-healing.vitamin-c-collagen-hydroxylation"
    ]
  },
  {
    "caseId": "case.l2.wound-healing.vitamin-c.biochemical-step.v1",
    "kind": null,
    "setting": "periop_recovery",
    "variants": [
      "question.wound-healing.vitamin-c.biochemical-step.v1"
    ],
    "nodeIds": [
      "node.wound-healing.vitamin-c.biochemical-step.v1"
    ],
    "conceptIds": [
      "concept.wound-healing.vitamin-c-collagen-hydroxylation"
    ]
  },
  {
    "caseId": "case.l2.wound-healing.vitamin-c.mechanism-explanation.v1",
    "kind": null,
    "setting": "periop_recovery",
    "variants": [
      "question.wound-healing.vitamin-c.mechanism-explanation.v1"
    ],
    "nodeIds": [
      "node.wound-healing.vitamin-c.mechanism-explanation.v1"
    ],
    "conceptIds": [
      "concept.wound-healing.vitamin-c-collagen-hydroxylation"
    ]
  },
  {
    "caseId": "case.l2.wound-healing.vitamin-c.mechanism-consequence.v1",
    "kind": null,
    "setting": "periop_recovery",
    "variants": [
      "question.wound-healing.vitamin-c.mechanism-consequence.v1"
    ],
    "nodeIds": [
      "node.wound-healing.vitamin-c.mechanism-consequence.v1"
    ],
    "conceptIds": [
      "concept.wound-healing.vitamin-c-collagen-hydroxylation"
    ]
  },
  {
    "caseId": "case.l2.gastric-malt.integrated-diagnosis-to-treatment.v1",
    "kind": null,
    "setting": "endoscopy",
    "variants": [
      "question.gastric-malt.integrated-pathology-diagnosis.v1.r5",
      "question.gastric-malt.localized-hpylori-positive-initial-treatment.v1.r4"
    ],
    "nodeIds": [
      "node.gastric-malt.integrated-pathology-diagnosis.v1",
      "node.gastric-malt.localized-hpylori-positive-initial-treatment.v1"
    ],
    "conceptIds": [
      "concept.gastric-malt-lymphoma.pathologic-recognition.v2",
      "concept.gastric-malt-lymphoma.hpylori-eradication-first-line.v2"
    ]
  },
  {
    "caseId": "case.l2.gastric-malt.profile-to-followup-boundary.v1",
    "kind": null,
    "setting": "endoscopy",
    "variants": [
      "question.gastric-malt.pathology-profile-selection.v1.r5",
      "question.gastric-malt.eradication-response-reassessment.v1.r4"
    ],
    "nodeIds": [
      "node.gastric-malt.pathology-profile-selection.v1",
      "node.gastric-malt.eradication-response-reassessment.v1"
    ],
    "conceptIds": [
      "concept.gastric-malt-lymphoma.pathologic-recognition.v2",
      "concept.gastric-malt-lymphoma.hpylori-eradication-first-line.v2"
    ]
  },
  {
    "caseId": "case.l2.gastric-malt.cd20-boundary.v1",
    "kind": null,
    "setting": "endoscopy",
    "variants": [
      "question.gastric-malt.cd20-alone-boundary.v1.r8"
    ],
    "nodeIds": [
      "node.gastric-malt.cd20-alone-boundary.v1"
    ],
    "conceptIds": [
      "concept.gastric-malt-lymphoma.pathologic-recognition"
    ]
  },
  {
    "caseId": "case.l2.gastric-malt.eradication-patient-selection.v1",
    "kind": null,
    "setting": "endoscopy",
    "variants": [
      "question.gastric-malt.eradication-patient-selection.v1"
    ],
    "nodeIds": [
      "node.gastric-malt.eradication-patient-selection.v1"
    ],
    "conceptIds": [
      "concept.gastric-malt-lymphoma.hpylori-eradication-first-line"
    ]
  },
  {
    "caseId": "case.l2.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1",
    "kind": null,
    "setting": "endoscopy",
    "variants": [
      "question.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1.r3"
    ],
    "nodeIds": [
      "node.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1"
    ],
    "conceptIds": [
      "concept.gastric-adenocarcinoma.prophylactic-splenectomy-avoidance"
    ]
  },
  {
    "caseId": "case.l2.gastric-adenocarcinoma.spleen-preservation-counseling.v1",
    "kind": null,
    "setting": "endoscopy",
    "variants": [
      "question.gastric-adenocarcinoma.spleen-preservation-counseling.v1"
    ],
    "nodeIds": [
      "node.gastric-adenocarcinoma.spleen-preservation-counseling.v1"
    ],
    "conceptIds": [
      "concept.gastric-adenocarcinoma.prophylactic-splenectomy-avoidance"
    ]
  },
  {
    "caseId": "case.l2.peptic-ulcer-bleeding.visible-vessel-hemostasis.v1",
    "kind": "endoscopy",
    "setting": "endoscopy",
    "variants": [
      "question.peptic-ulcer-bleeding.visible-vessel-treat.v1.r6",
      "question.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1.r5"
    ],
    "nodeIds": [
      "node.peptic-ulcer-bleeding.visible-vessel-treat.v1",
      "node.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1"
    ],
    "conceptIds": [
      "concept.peptic-ulcer-bleeding.high-risk-stigmata-endoscopic-hemostasis.v2",
      "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality.v2"
    ]
  },
  {
    "caseId": "case.l2.peptic-ulcer-bleeding.select-high-risk-stigmata.v1",
    "kind": "endoscopy",
    "setting": "endoscopy",
    "variants": [
      "question.peptic-ulcer-bleeding.select-high-risk-stigmata.v1"
    ],
    "nodeIds": [
      "node.peptic-ulcer-bleeding.select-high-risk-stigmata.v1"
    ],
    "conceptIds": [
      "concept.peptic-ulcer-bleeding.high-risk-stigmata-endoscopic-hemostasis"
    ]
  },
  {
    "caseId": "case.l2.peptic-ulcer-bleeding.clean-base-reverse.v1",
    "kind": "endoscopy",
    "setting": "endoscopy",
    "variants": [
      "question.peptic-ulcer-bleeding.clean-base-reverse.v1"
    ],
    "nodeIds": [
      "node.peptic-ulcer-bleeding.clean-base-reverse.v1"
    ],
    "conceptIds": [
      "concept.peptic-ulcer-bleeding.high-risk-stigmata-endoscopic-hemostasis"
    ]
  },
  {
    "caseId": "case.l2.peptic-ulcer-bleeding.visible-vessel-modality-principle.v1",
    "kind": "endoscopy",
    "setting": "endoscopy",
    "variants": [
      "question.peptic-ulcer-bleeding.visible-vessel-modality-principle.v1"
    ],
    "nodeIds": [
      "node.peptic-ulcer-bleeding.visible-vessel-modality-principle.v1"
    ],
    "conceptIds": [
      "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality"
    ]
  },
  {
    "caseId": "case.l2.distal-cholangiocarcinoma.deferred-eus-ercp-to-resection",
    "kind": null,
    "setting": "outpatient_endoscopy",
    "variants": [
      "question.distal-cholangiocarcinoma.workup-a.v1",
      "question.distal-cholangiocarcinoma.management-a.v1"
    ],
    "nodeIds": [
      "node.distal-cholangiocarcinoma.workup-a.v1",
      "node.distal-cholangiocarcinoma.management-a.v1"
    ],
    "conceptIds": [
      "concept.distal-cholangiocarcinoma.operable-tissue-evaluation",
      "concept.distal-cholangiocarcinoma.resection-selection"
    ]
  },
  {
    "caseId": "case.n4.cholecystectomy-neck-plane-bailout.v1",
    "kind": "operation",
    "setting": "ambulatory_surgery",
    "variants": [
      "question.n4.cholecystectomy-neck-plane-bailout.v1"
    ],
    "nodeIds": [
      "node.n4.cholecystectomy-neck-plane-bailout.v1"
    ],
    "conceptIds": [
      "concept.gs028g.subtotal-cholecystectomy.safe-bailout"
    ]
  },
  {
    "caseId": "case.n4.colonic-wall-pattern-after-mucosal-biopsy.v1",
    "kind": "endoscopy",
    "setting": "endoscopy",
    "variants": [
      "question.n4.colonic-wall-pattern-after-mucosal-biopsy.v1"
    ],
    "nodeIds": [
      "node.n4.colonic-wall-pattern-after-mucosal-biopsy.v1"
    ],
    "conceptIds": [
      "concept.colonic-lipoma.endoscopic-recognition.v3"
    ]
  },
  {
    "caseId": "case.n4.ventral-controlled-enterotomy-mesh-material.v2",
    "kind": "operation",
    "setting": "ambulatory_surgery",
    "variants": [
      "question.n4.ventral-controlled-enterotomy-mesh-material.v2"
    ],
    "nodeIds": [
      "node.n4.ventral-controlled-enterotomy-mesh-material.v2"
    ],
    "conceptIds": [
      "concept.n4r2.mesh-material-and-contact-compartment"
    ]
  },
  {
    "caseId": "case.n4.unexpected-deep-mass-during-lipoma-excision.v2",
    "kind": "operation",
    "setting": "ambulatory_surgery",
    "variants": [
      "question.n4.unexpected-deep-mass-during-lipoma-excision.v2"
    ],
    "nodeIds": [
      "node.n4.unexpected-deep-mass-during-lipoma-excision.v2"
    ],
    "conceptIds": [
      "concept.soft-tissue-mass.extremity-mri.v2"
    ]
  },
  {
    "caseId": "case.n4.ulcer-recurrent-bleeding-after-clips.v2",
    "kind": "endoscopy",
    "setting": "endoscopy",
    "variants": [
      "question.n4.ulcer-recurrent-bleeding-after-clips.v2"
    ],
    "nodeIds": [
      "node.n4.ulcer-recurrent-bleeding-after-clips.v2"
    ],
    "conceptIds": [
      "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality.v2"
    ]
  },
  {
    "caseId": "case.n4.cholangiogram-lucencies-and-proximal-coverage.v1",
    "kind": "operation",
    "setting": "ambulatory_surgery",
    "variants": [
      "question.n4.cholangiogram-lucencies-and-proximal-coverage.v1"
    ],
    "nodeIds": [
      "node.n4.cholangiogram-lucencies-and-proximal-coverage.v1"
    ],
    "conceptIds": [
      "concept.n4r2.cholangiogram-quality-before-duct-treatment"
    ]
  }
] as const;
const byCaseId = new Map<string, (typeof legacy)[number]>(legacy.map(row => [row.caseId, row]));
export function legacyProcedureContext(clinicalCase: SyntheticClinicalCase) {
  if (clinicalCase.procedureContext || clinicalCase.pediatricProfile || clinicalCase.participant) return undefined;
  const row = byCaseId.get(clinicalCase.id);
  return row && row.setting === clinicalCase.requiredClinicalSetting && row.variants.length === clinicalCase.decisionNodes.length &&
    row.variants.every((id, i) => id === clinicalCase.decisionNodes[i]?.questionVariantId &&
      row.nodeIds[i] === clinicalCase.decisionNodes[i]?.id && row.conceptIds[i] === clinicalCase.decisionNodes[i]?.primaryConceptId) ? row : undefined;
}
