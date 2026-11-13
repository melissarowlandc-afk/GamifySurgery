/** Single shipping authority. Editorial acceptance is NOT clinical approval.
 * Legacy tuples are a one-time explicit carry-forward of the pre-flag live bank.
 * No new/draft tuple is implicitly accepted; never regenerate from the catalog.
 * Manager adds exact accepted tuples and their decision record here. */
export interface QuestionShipAcceptance {
  acceptanceId: string; caseId: string; nodeId: string; questionVariantId: string; conceptId: string;
  sourceView: string; decision: string;
}
/** Replace one whole legacy encounter in fresh supply. `with` names an exact
 * accepted question variant whose complete retained source case is admitted.
 * `replaces` is a legacy case ID or an exact question ID in that legacy case.
 * Legacy bindings remain archived for frozen encounters and learning history. */
export interface QuestionShipCaseReplacement {
  replaces: string;
  with: string;
}
/** Explicit manager authorization to consolidate duplicate topic-program cases. */
export interface QuestionShipTopicConsolidation {
  id: string;
  program: "topic-program";
  replaces: readonly string[];
  with: string;
  decision: string;
}
/** Explicit fresh-supply retirement. Exact old question bindings remain archived.
 * When a successor is declared, retirement applies only if that entire accepted
 * successor case is present. Frozen encounters do not use this projection. */
export interface QuestionShipCaseRetirement {
  caseId: string;
  questionVariantIds: readonly string[];
  decision: string;
  reason: string;
  replacementQuestionVariantId?: string;
}
export interface QuestionShipManifest {
  legacyBindings: readonly (readonly [string, string, string, string])[];
  accepted: readonly QuestionShipAcceptance[];
  headerSources: Readonly<Record<string, string>>;
  replacements?: readonly QuestionShipCaseReplacement[];
  topicConsolidations?: readonly QuestionShipTopicConsolidation[];
  retirements?: readonly QuestionShipCaseRetirement[];
}
export const QUESTION_SHIP_MANIFEST = {
  id: "question-ship.2026-11-13.v20",
  clinicalApproval: false,
  legacyDecision: "Carry forward the existing live bank before the owner-flag rewrite program; user-directed fallback on 2026-11-05. This does not independently accept prior drafts or grant clinical approval.",
  legacyBindings: [
  [
    "case.ventral-hernia.pulmonary-optimization.a",
    "node.ventral-hernia.pulmonary-optimization.v1",
    "question.ventral-hernia.pulmonary-optimization.v1",
    "concept.ventral-hernia.elective-pulmonary-optimization"
  ],
  [
    "case.ventral-hernia.pulmonary-optimization.b",
    "node.ventral-hernia.pulmonary-optimization.v2",
    "question.ventral-hernia.pulmonary-optimization.v2",
    "concept.ventral-hernia.elective-pulmonary-optimization"
  ],
  [
    "case.breast-cyst.under-30-asymptomatic-simple",
    "node.breast-mass.under-30-initial-ultrasound.v1",
    "question.breast-mass.under-30-initial-ultrasound.v1",
    "concept.breast-mass.under-30-initial-ultrasound"
  ],
  [
    "case.breast-cyst.under-30-asymptomatic-simple",
    "node.breast-cyst.asymptomatic-simple-observation.v1",
    "question.breast-cyst.asymptomatic-simple-observation.v1",
    "concept.breast-cyst.asymptomatic-simple-observation"
  ],
  [
    "case.breast-cyst.under-30-painful-simple",
    "node.breast-mass.under-30-initial-ultrasound.v2",
    "question.breast-mass.under-30-initial-ultrasound.v2",
    "concept.breast-mass.under-30-initial-ultrasound"
  ],
  [
    "case.breast-cyst.under-30-painful-simple",
    "node.breast-cyst.symptomatic-simple-aspiration.v1",
    "question.breast-cyst.symptomatic-simple-aspiration.v1",
    "concept.breast-cyst.symptomatic-simple-aspiration"
  ],
  [
    "case.ebv-associated-malignancy.burkitt",
    "node.ebv-associated-malignancy.burkitt.v1",
    "question.ebv-associated-malignancy.burkitt.v1",
    "concept.ebv.associated-malignancy-recognition"
  ],
  [
    "case.ebv-associated-malignancy.gastric",
    "node.ebv-associated-malignancy.gastric.v1",
    "question.ebv-associated-malignancy.gastric.v1",
    "concept.ebv.associated-malignancy-recognition"
  ],
  [
    "case.ebv-associated-malignancy.nasopharyngeal",
    "node.ebv-associated-malignancy.nasopharyngeal.v1",
    "question.ebv-associated-malignancy.nasopharyngeal.v1",
    "concept.ebv.associated-malignancy-recognition"
  ],
  [
    "case.hcc.milan.solitary-within",
    "node.hcc.milan.solitary-within.v1",
    "question.hcc.milan.patient-to-criteria.solitary-within.v1",
    "concept.hcc.milan-transplant-evaluation"
  ],
  [
    "case.hcc.milan.multifocal-within",
    "node.hcc.milan.multifocal-within.v1",
    "question.hcc.milan.patient-to-criteria.multifocal-within.v1",
    "concept.hcc.milan-transplant-evaluation"
  ],
  [
    "case.hcc.milan.solitary-above-size",
    "node.hcc.milan.solitary-above-size.v1",
    "question.hcc.milan.patient-to-criteria.solitary-above-size.v1",
    "concept.hcc.milan-transplant-evaluation"
  ],
  [
    "case.hcc.milan.too-many-lesions",
    "node.hcc.milan.too-many-lesions.v1",
    "question.hcc.milan.patient-to-criteria.too-many-lesions.v1",
    "concept.hcc.milan-transplant-evaluation"
  ],
  [
    "case.hcc.milan.macrovascular-invasion",
    "node.hcc.milan.macrovascular-invasion.v1",
    "question.hcc.milan.patient-to-criteria.macrovascular-invasion.v1",
    "concept.hcc.milan-transplant-evaluation"
  ],
  [
    "case.hcc.milan.extrahepatic-spread",
    "node.hcc.milan.extrahepatic-spread.v1",
    "question.hcc.milan.patient-to-criteria.extrahepatic-spread.v1",
    "concept.hcc.milan-transplant-evaluation"
  ],
  [
    "case.hcc.milan.choose-boundary-profile",
    "node.hcc.milan.choose-boundary-profile.v1",
    "question.hcc.milan.criteria-to-patient.boundary-profile.v1",
    "concept.hcc.milan-transplant-evaluation"
  ],
  [
    "case.hcc.milan.choose-invasion-spread-profile",
    "node.hcc.milan.choose-invasion-spread-profile.v1",
    "question.hcc.milan.criteria-to-patient.invasion-spread-profile.v1",
    "concept.hcc.milan-transplant-evaluation"
  ],
  [
    "case.hcc.milan.choose-multifocal-boundary",
    "node.hcc.milan.choose-multifocal-boundary.v1",
    "question.hcc.milan.criteria-to-patient.multifocal-boundary.v1",
    "concept.hcc.milan-transplant-evaluation"
  ],
  [
    "case.hcc.milan.choose-combined-profile",
    "node.hcc.milan.choose-combined-profile.v1",
    "question.hcc.milan.criteria-to-patient.combined-profile.v1",
    "concept.hcc.milan-transplant-evaluation"
  ],
  [
    "case.mondor-disease.full-pathway",
    "node.mondor-disease.recognition.patient-to-diagnosis.full-pathway",
    "question.mondor-disease.recognition.patient-to-diagnosis.v1",
    "concept.mondor-disease.clinical-recognition"
  ],
  [
    "case.mondor-disease.full-pathway",
    "node.mondor-disease.evaluation.diagnostic-breast-imaging.full-pathway",
    "question.mondor-disease.evaluation.diagnostic-breast-imaging.v1",
    "concept.mondor-disease.selective-imaging-evaluation"
  ],
  [
    "case.mondor-disease.full-pathway",
    "node.mondor-disease.management.supportive-care.full-pathway",
    "question.mondor-disease.management.supportive-care.v1",
    "concept.mondor-disease.supportive-management"
  ],
  [
    "case.mondor-disease.evaluation-and-management",
    "node.mondor-disease.evaluation.diagnostic-breast-imaging.evaluation-and-management",
    "question.mondor-disease.evaluation.diagnostic-breast-imaging.v1",
    "concept.mondor-disease.selective-imaging-evaluation"
  ],
  [
    "case.mondor-disease.evaluation-and-management",
    "node.mondor-disease.management.supportive-care.evaluation-and-management",
    "question.mondor-disease.management.supportive-care.v1",
    "concept.mondor-disease.supportive-management"
  ],
  [
    "case.mondor-disease.select-matching-patient",
    "node.mondor-disease.recognition.select-patient.v1",
    "question.mondor-disease.recognition.select-patient.v1",
    "concept.mondor-disease.clinical-recognition"
  ],
  [
    "case.mondor-disease.underlying-process",
    "node.mondor-disease.recognition.underlying-process.v1",
    "question.mondor-disease.recognition.underlying-process.v1",
    "concept.mondor-disease.clinical-recognition"
  ],
  [
    "case.mondor-disease.uncertain-targeted-ultrasound",
    "node.mondor-disease.evaluation.uncertain-doppler-ultrasound.v1",
    "question.mondor-disease.evaluation.uncertain-doppler-ultrasound.v1",
    "concept.mondor-disease.selective-imaging-evaluation"
  ],
  [
    "case.mondor-disease.ultrasound-finding",
    "node.mondor-disease.evaluation.ultrasound-finding.v1",
    "question.mondor-disease.evaluation.ultrasound-finding.v1",
    "concept.mondor-disease.selective-imaging-evaluation"
  ],
  [
    "case.mondor-disease.safety-boundary",
    "node.mondor-disease.management.safety-boundary.v1",
    "question.mondor-disease.management.safety-boundary.v1",
    "concept.mondor-disease.supportive-management"
  ],
  [
    "case.mondor-disease.select-supportive-patient",
    "node.mondor-disease.management.select-supportive-patient.v1",
    "question.mondor-disease.management.select-supportive-patient.v1",
    "concept.mondor-disease.supportive-management"
  ],
  [
    "case.aaa.female-perioperative-mortality.direct",
    "node.aaa.female-perioperative-mortality.direct.v1",
    "question.aaa.female-perioperative-mortality.direct.v1",
    "concept.aaa.female-sex-associated-perioperative-mortality"
  ],
  [
    "case.aaa.female-perioperative-mortality.repair-approaches",
    "node.aaa.female-perioperative-mortality.repair-approaches.v1",
    "question.aaa.female-perioperative-mortality.repair-approaches.v1",
    "concept.aaa.female-sex-associated-perioperative-mortality"
  ],
  [
    "case.aaa.female-perioperative-mortality.interpretation",
    "node.aaa.female-perioperative-mortality.interpretation.v1",
    "question.aaa.female-perioperative-mortality.interpretation.v1",
    "concept.aaa.female-sex-associated-perioperative-mortality"
  ],
  [
    "case.aaa.female-perioperative-mortality.mixed-boundaries",
    "node.aaa.female-perioperative-mortality.mixed-boundaries.v1",
    "question.aaa.female-perioperative-mortality.mixed-boundaries.v1",
    "concept.aaa.female-sex-associated-perioperative-mortality"
  ],
  [
    "case.desmoid.surveillance-to-progressing-abdominal-wall",
    "node.desmoid.initial-surveillance.new-diagnosis.v1",
    "question.desmoid.initial-surveillance.new-diagnosis.v1",
    "concept.desmoid.initial-active-surveillance"
  ],
  [
    "case.desmoid.surveillance-to-progressing-abdominal-wall",
    "node.desmoid.abdominal-wall-surgery.progressing-painful.v1",
    "question.desmoid.abdominal-wall-surgery.progressing-painful.v1",
    "concept.desmoid.progressing-abdominal-wall-surgical-option"
  ],
  [
    "case.desmoid.select-surveillance-patient",
    "node.desmoid.initial-surveillance.select-patient.v1",
    "question.desmoid.initial-surveillance.select-patient.v1",
    "concept.desmoid.initial-active-surveillance"
  ],
  [
    "case.desmoid.initial-management-principle",
    "node.desmoid.initial-surveillance.general-principle.v1",
    "question.desmoid.initial-surveillance.general-principle.v1",
    "concept.desmoid.initial-active-surveillance"
  ],
  [
    "case.desmoid.stable-follow-up",
    "node.desmoid.initial-surveillance.stable-follow-up.v1",
    "question.desmoid.initial-surveillance.stable-follow-up.v1",
    "concept.desmoid.initial-active-surveillance"
  ],
  [
    "case.desmoid.select-abdominal-wall-surgical-candidate",
    "node.desmoid.abdominal-wall-surgery.select-candidate.v1",
    "question.desmoid.abdominal-wall-surgery.select-candidate.v1",
    "concept.desmoid.progressing-abdominal-wall-surgical-option"
  ],
  [
    "case.desmoid.function-preserving-margin",
    "node.desmoid.abdominal-wall-surgery.margin-principle.v1",
    "question.desmoid.abdominal-wall-surgery.margin-principle.v1",
    "concept.desmoid.progressing-abdominal-wall-surgical-option"
  ],
  [
    "case.desmoid.location-specific-surgery",
    "node.desmoid.abdominal-wall-surgery.location-specific.v1",
    "question.desmoid.abdominal-wall-surgery.location-specific.v1",
    "concept.desmoid.progressing-abdominal-wall-surgical-option"
  ],
  [
    "case.pancreatic-tail-adenocarcinoma.clinic-counseling",
    "node.pancreatic-tail-adenocarcinoma.clinic-counseling.v1",
    "question.pancreatic-tail-adenocarcinoma.clinic-counseling.v1",
    "concept.pancreatic-tail-adenocarcinoma.distal-pancreatectomy-with-splenectomy"
  ],
  [
    "case.pancreatic-tail-adenocarcinoma.spleen-counseling",
    "node.pancreatic-tail-adenocarcinoma.spleen-counseling.v1",
    "question.pancreatic-tail-adenocarcinoma.spleen-counseling.v1",
    "concept.pancreatic-tail-adenocarcinoma.distal-pancreatectomy-with-splenectomy"
  ],
  [
    "case.pancreatic-tail-adenocarcinoma.operative-candidate",
    "node.pancreatic-tail-adenocarcinoma.operative-candidate.v1",
    "question.pancreatic-tail-adenocarcinoma.operative-candidate.v1",
    "concept.pancreatic-tail-adenocarcinoma.distal-pancreatectomy-with-splenectomy"
  ],
  [
    "case.pancreatic-tail-adenocarcinoma.referral-plan",
    "node.pancreatic-tail-adenocarcinoma.referral-plan.v1",
    "question.pancreatic-tail-adenocarcinoma.referral-plan.v1",
    "concept.pancreatic-tail-adenocarcinoma.distal-pancreatectomy-with-splenectomy"
  ],
  [
    "case.felty-syndrome.recognition-to-refractory-splenectomy",
    "node.felty-syndrome.classic-recognition.v1",
    "question.felty-syndrome.classic-recognition.v1",
    "concept.felty-syndrome.recognition"
  ],
  [
    "case.felty-syndrome.recognition-to-refractory-splenectomy",
    "node.felty-syndrome.initial-treatment.v1",
    "question.felty-syndrome.initial-treatment.v1",
    "concept.felty-syndrome.methotrexate-first-line"
  ],
  [
    "case.felty-syndrome.recognition-to-refractory-splenectomy",
    "node.felty-syndrome.refractory-disease.v1",
    "question.felty-syndrome.refractory-disease.v1",
    "concept.felty-syndrome.splenectomy-for-refractory-infections"
  ],
  [
    "case.felty-syndrome.no-splenomegaly-boundary",
    "node.felty-syndrome.no-splenomegaly-boundary.v1",
    "question.felty-syndrome.no-splenomegaly-boundary.v1",
    "concept.felty-syndrome.recognition"
  ],
  [
    "case.felty-syndrome.reverse-pattern",
    "node.felty-syndrome.reverse-pattern.v1",
    "question.felty-syndrome.reverse-pattern.v1",
    "concept.felty-syndrome.recognition"
  ],
  [
    "case.felty-syndrome.treatment-principle",
    "node.felty-syndrome.treatment-principle.v1",
    "question.felty-syndrome.treatment-principle.v1",
    "concept.felty-syndrome.methotrexate-first-line"
  ],
  [
    "case.fhh.evaluation-to-confirmed-management",
    "node.fhh.initial-biochemical-evaluation.v1",
    "question.fhh.initial-biochemical-evaluation.v1",
    "concept.fhh.biochemical-evaluation"
  ],
  [
    "case.fhh.evaluation-to-confirmed-management",
    "node.fhh.confirmed-return-management.v1",
    "question.fhh.confirmed-return-management.v1",
    "concept.fhh.avoid-parathyroid-surgery"
  ],
  [
    "case.fhh.suggestive-results-confirmation",
    "node.fhh.suggestive-results-confirmation.v1",
    "question.fhh.suggestive-results-confirmation.v1",
    "concept.fhh.recognition-and-confirmation"
  ],
  [
    "case.fhh.confirmed-asymptomatic-management",
    "node.fhh.confirmed-asymptomatic-management.v1",
    "question.fhh.confirmed-asymptomatic-management.v1",
    "concept.fhh.avoid-parathyroid-surgery"
  ],
  [
    "case.fhh.parathyroid-surgery-counseling",
    "node.fhh.parathyroid-surgery-counseling.v1",
    "question.fhh.parathyroid-surgery-counseling.v1",
    "concept.fhh.avoid-parathyroid-surgery"
  ],
  [
    "case.lymphangitis.toe-inguinal",
    "node.lymphangitis.toe-inguinal.v1",
    "question.lymphangitis.toe-inguinal.v1",
    "concept.lymphangitis.acute-clinical-recognition"
  ],
  [
    "case.lymphangitis.palm-axillary",
    "node.lymphangitis.palm-axillary.v1",
    "question.lymphangitis.palm-axillary.v1",
    "concept.lymphangitis.acute-clinical-recognition"
  ],
  [
    "case.lymphangitis.heel-inguinal",
    "node.lymphangitis.heel-inguinal.v1",
    "question.lymphangitis.heel-inguinal.v1",
    "concept.lymphangitis.acute-clinical-recognition"
  ],
  [
    "case.lymphangitis.reverse-axillary",
    "node.lymphangitis.reverse-axillary.v1",
    "question.lymphangitis.reverse-axillary.v1",
    "concept.lymphangitis.acute-clinical-recognition"
  ],
  [
    "case.lymphangitis.finger-axillary",
    "node.lymphangitis.finger-axillary.v1",
    "question.lymphangitis.finger-axillary.v1",
    "concept.lymphangitis.acute-clinical-recognition"
  ],
  [
    "case.gallbladder-polyp.16mm",
    "node.gallbladder-polyp.16mm.v1",
    "question.gallbladder-polyp.16mm.v1",
    "concept.gallbladder-polyp.initial-management-category"
  ],
  [
    "case.gallbladder-polyp.12mm-wall-thickening",
    "node.gallbladder-polyp.12mm-wall-thickening.v1",
    "question.gallbladder-polyp.12mm-wall-thickening.v1",
    "concept.gallbladder-polyp.initial-management-category"
  ],
  [
    "case.gallbladder-polyp.8mm-thick-stalk",
    "node.gallbladder-polyp.8mm-thick-stalk.v1",
    "question.gallbladder-polyp.8mm-thick-stalk.v1",
    "concept.gallbladder-polyp.initial-management-category"
  ],
  [
    "case.gallbladder-polyp.4mm-thin-stalk",
    "node.gallbladder-polyp.4mm-thin-stalk.v1",
    "question.gallbladder-polyp.4mm-thin-stalk.v1",
    "concept.gallbladder-polyp.initial-management-category"
  ],
  [
    "case.gallbladder-polyp.select-surgical-profile",
    "node.gallbladder-polyp.select-surgical-profile.v1",
    "question.gallbladder-polyp.select-surgical-profile.v1",
    "concept.gallbladder-polyp.initial-management-category"
  ],
  [
    "case.gallbladder-polyp.select-surveillance-profile",
    "node.gallbladder-polyp.select-surveillance-profile.v1",
    "question.gallbladder-polyp.select-surveillance-profile.v1",
    "concept.gallbladder-polyp.initial-management-category"
  ],
  [
    "case.distal-cholangiocarcinoma.active-treatment",
    "node.distal-cholangiocarcinoma.management-b.v1",
    "question.distal-cholangiocarcinoma.management-b.v1",
    "concept.distal-cholangiocarcinoma.resection-selection"
  ],
  [
    "case.distal-cholangiocarcinoma.active-location",
    "node.distal-cholangiocarcinoma.management-c.v1",
    "question.distal-cholangiocarcinoma.management-c.v1",
    "concept.distal-cholangiocarcinoma.resection-selection"
  ],
  [
    "case.obstructive-jaundice.vitamin-k.bleeding",
    "node.obstructive-jaundice.vitamin-k.bleeding.v1",
    "question.obstructive-jaundice.vitamin-k.bleeding.v1",
    "concept.obstructive-jaundice.vitamin-k-coagulopathy"
  ],
  [
    "case.obstructive-jaundice.vitamin-k.mechanism",
    "node.obstructive-jaundice.vitamin-k.mechanism.v1",
    "question.obstructive-jaundice.vitamin-k.mechanism.v1",
    "concept.obstructive-jaundice.vitamin-k-coagulopathy"
  ],
  [
    "case.obstructive-jaundice.vitamin-k.lab",
    "node.obstructive-jaundice.vitamin-k.lab.v1",
    "question.obstructive-jaundice.vitamin-k.lab.v1",
    "concept.obstructive-jaundice.vitamin-k-coagulopathy"
  ],
  [
    "case.obstructive-jaundice.vitamin-k.reverse",
    "node.obstructive-jaundice.vitamin-k.reverse.v1",
    "question.obstructive-jaundice.vitamin-k.reverse.v1",
    "concept.obstructive-jaundice.vitamin-k-coagulopathy"
  ],
  [
    "case.hcc.resection.direct-selection",
    "node.hcc.resection.direct-selection",
    "question.hcc.resection.direct-selection.v1",
    "concept.hcc.compensated-cirrhosis-resection-selection"
  ],
  [
    "case.hcc.resection.milan-trap",
    "node.hcc.resection.milan-trap",
    "question.hcc.resection.milan-trap.v1",
    "concept.hcc.compensated-cirrhosis-resection-selection"
  ],
  [
    "case.hcc.resection.candidate-profile",
    "node.hcc.resection.candidate-profile",
    "question.hcc.resection.candidate-profile.v1",
    "concept.hcc.compensated-cirrhosis-resection-selection"
  ],
  [
    "case.hcc.resection.future-liver-remnant",
    "node.hcc.resection.future-liver-remnant",
    "question.hcc.resection.future-liver-remnant.v1",
    "concept.hcc.compensated-cirrhosis-resection-selection"
  ],
  [
    "case.hcc.resection.combined-milan-to-resection",
    "node.hcc.resection.combined.milan.v1",
    "question.hcc.milan.patient-to-criteria.solitary-within.v1",
    "concept.hcc.milan-transplant-evaluation"
  ],
  [
    "case.hcc.resection.combined-milan-to-resection",
    "node.hcc.resection.combined.direct-selection.v1",
    "question.hcc.resection.direct-selection.v1",
    "concept.hcc.compensated-cirrhosis-resection-selection"
  ],
  [
    "case.accessory-spleen.preoperative-counseling",
    "node.accessory-spleen.preoperative-counseling.v1",
    "question.accessory-spleen.preoperative-counseling.v1",
    "concept.accessory-spleen.common-location"
  ],
  [
    "case.accessory-spleen.imaging-review",
    "node.accessory-spleen.imaging-review.v1",
    "question.accessory-spleen.imaging-review.v1",
    "concept.accessory-spleen.common-location"
  ],
  [
    "case.accessory-spleen.hospital-planning",
    "node.accessory-spleen.hospital-planning.v1",
    "question.accessory-spleen.hospital-planning.v1",
    "concept.accessory-spleen.common-location"
  ],
  [
    "case.accessory-spleen.reverse-location",
    "node.accessory-spleen.reverse-location.v1",
    "question.accessory-spleen.reverse-location.v1",
    "concept.accessory-spleen.common-location"
  ],
  [
    "case.hs.postsplenectomy.reassess",
    "node.hs.postsplenectomy.reassess.v1",
    "question.hs.postsplenectomy.reassess.v1",
    "concept.hereditary-spherocytosis.postsplenectomy-persistent-hemolysis-evaluation"
  ],
  [
    "case.hs.postsplenectomy.howell-jolly",
    "node.hs.postsplenectomy.howell-jolly.v1",
    "question.hs.postsplenectomy.howell-jolly.v1",
    "concept.hereditary-spherocytosis.postsplenectomy-persistent-hemolysis-evaluation"
  ],
  [
    "case.hs.postsplenectomy.reverse",
    "node.hs.postsplenectomy.reverse.v1",
    "question.hs.postsplenectomy.reverse.v1",
    "concept.hereditary-spherocytosis.postsplenectomy-persistent-hemolysis-evaluation"
  ],
  [
    "case.hs.accessory-spleen.hospital-referral",
    "node.hs.accessory-spleen.hospital-referral.v1",
    "question.hs.accessory-spleen.hospital-referral.v1",
    "concept.hereditary-spherocytosis.confirmed-accessory-spleen-management"
  ],
  [
    "case.hs.accessory-spleen.incidental",
    "node.hs.accessory-spleen.incidental.v1",
    "question.hs.accessory-spleen.incidental.v1",
    "concept.hereditary-spherocytosis.confirmed-accessory-spleen-management"
  ],
  [
    "case.hs.accessory-spleen.threshold",
    "node.hs.accessory-spleen.threshold.v1",
    "question.hs.accessory-spleen.threshold.v1",
    "concept.hereditary-spherocytosis.confirmed-accessory-spleen-management"
  ],
  [
    "case.hs.postsplenectomy.combined-evaluation-to-referral",
    "node.hs.postsplenectomy.scintigraphy.v1",
    "question.hs.postsplenectomy.scintigraphy.v1",
    "concept.hereditary-spherocytosis.postsplenectomy-persistent-hemolysis-evaluation"
  ],
  [
    "case.hs.postsplenectomy.combined-evaluation-to-referral",
    "node.hs.accessory-spleen.hospital-referral.v1",
    "question.hs.accessory-spleen.hospital-referral.v1",
    "concept.hereditary-spherocytosis.confirmed-accessory-spleen-management"
  ],
  [
    "case.ipaa.pouchitis.1a",
    "node.ipaa.pouchitis.1a",
    "question.ipaa.pouchitis.1a.v1",
    "concept.ipaa.pouchitis-common-post-ipaa-complication"
  ],
  [
    "case.ipaa.pouchitis.1b",
    "node.ipaa.pouchitis.1b",
    "question.ipaa.pouchitis.1b.v1",
    "concept.ipaa.pouchitis-common-post-ipaa-complication"
  ],
  [
    "case.ipaa.pouchitis.1c",
    "node.ipaa.pouchitis.1c",
    "question.ipaa.pouchitis.1c.v1",
    "concept.ipaa.pouchitis-common-post-ipaa-complication"
  ],
  [
    "case.ipaa.pouchitis.1d",
    "node.ipaa.pouchitis.1d",
    "question.ipaa.pouchitis.1d.v1",
    "concept.ipaa.pouchitis-common-post-ipaa-complication"
  ],
  [
    "case.choledochal-cyst.type-iva.2a",
    "node.choledochal-cyst.type-iva.2a",
    "question.choledochal-cyst.type-iva.2a.v1",
    "concept.choledochal-cyst.type-iva-combined-duct-dilation"
  ],
  [
    "case.choledochal-cyst.type-iva.2b",
    "node.choledochal-cyst.type-iva.2b",
    "question.choledochal-cyst.type-iva.2b.v1",
    "concept.choledochal-cyst.type-iva-combined-duct-dilation"
  ],
  [
    "case.choledochal-cyst.type-iva.2c",
    "node.choledochal-cyst.type-iva.2c",
    "question.choledochal-cyst.type-iva.2c.v1",
    "concept.choledochal-cyst.type-iva-combined-duct-dilation"
  ],
  [
    "case.choledochal-cyst.type-iva.2d",
    "node.choledochal-cyst.type-iva.2d",
    "question.choledochal-cyst.type-iva.2d.v1",
    "concept.choledochal-cyst.type-iva-combined-duct-dilation"
  ],
  [
    "case.anal-hsil.hpv.3a",
    "node.anal-hsil.hpv.3a",
    "question.anal-hsil.hpv.3a.v1",
    "concept.anal-hsil.high-risk-hpv-association"
  ],
  [
    "case.anal-hsil.hpv.3b",
    "node.anal-hsil.hpv.3b",
    "question.anal-hsil.hpv.3b.v1",
    "concept.anal-hsil.high-risk-hpv-association"
  ],
  [
    "case.anal-hsil.hpv.3c",
    "node.anal-hsil.hpv.3c",
    "question.anal-hsil.hpv.3c.v1",
    "concept.anal-hsil.high-risk-hpv-association"
  ],
  [
    "case.anal-hsil.hpv.3d",
    "node.anal-hsil.hpv.3d",
    "question.anal-hsil.hpv.3d.v1",
    "concept.anal-hsil.high-risk-hpv-association"
  ],
  [
    "case.men2a.1a",
    "node.men2a.1a",
    "question.men2a.1a.v1",
    "concept.men2a.core-manifestation-pattern"
  ],
  [
    "case.men2a.1b",
    "node.men2a.1b",
    "question.men2a.1b.v1",
    "concept.men2a.core-manifestation-pattern"
  ],
  [
    "case.men2a.1c",
    "node.men2a.1c",
    "question.men2a.1c.v1",
    "concept.men2a.core-manifestation-pattern"
  ],
  [
    "case.men2a.1d",
    "node.men2a.1d",
    "question.men2a.1d.v1",
    "concept.men2a.core-manifestation-pattern"
  ],
  [
    "case.men2a.2a",
    "node.men2a.2a",
    "question.men2a.2a.v1",
    "concept.men2a.pheochromocytoma-precedes-thyroid-intervention"
  ],
  [
    "case.men2a.2b",
    "node.men2a.2b",
    "question.men2a.2b.v1",
    "concept.men2a.pheochromocytoma-precedes-thyroid-intervention"
  ],
  [
    "case.men2a.2c",
    "node.men2a.2c",
    "question.men2a.2c.v1",
    "concept.men2a.pheochromocytoma-precedes-thyroid-intervention"
  ],
  [
    "case.men2a.2d",
    "node.men2a.2d",
    "question.men2a.2d.v1",
    "concept.men2a.pheochromocytoma-precedes-thyroid-intervention"
  ],
  [
    "case.men2a.3a",
    "node.men2a.3a",
    "question.men2a.3a.v1",
    "concept.pheochromocytoma.alpha-before-beta-blockade"
  ],
  [
    "case.men2a.3b",
    "node.men2a.3b",
    "question.men2a.3b.v1",
    "concept.pheochromocytoma.alpha-before-beta-blockade"
  ],
  [
    "case.men2a.3c",
    "node.men2a.3c",
    "question.men2a.3c.v1",
    "concept.pheochromocytoma.alpha-before-beta-blockade"
  ],
  [
    "case.men2a.3d",
    "node.men2a.3d",
    "question.men2a.3d.v1",
    "concept.pheochromocytoma.alpha-before-beta-blockade"
  ],
  [
    "case.l2.colonic-lipoma.direct.typical-a",
    "node.colonic-lipoma.recognition.patient-to-diagnosis.v1",
    "question.colonic-lipoma.recognition.patient-to-diagnosis.v1.r7",
    "concept.colonic-lipoma.endoscopic-recognition.v3"
  ],
  [
    "case.l2.colonic-lipoma.direct.typical-a",
    "node.colonic-lipoma.management.patient-to-plan.v1",
    "question.colonic-lipoma.management.patient-to-plan.v1.r3",
    "concept.colonic-lipoma.asymptomatic-management"
  ],
  [
    "case.l2.colonic-lipoma.direct.typical-b",
    "node.colonic-lipoma.recognition.patient-to-diagnosis.v2",
    "question.colonic-lipoma.recognition.patient-to-diagnosis.v2.r7",
    "concept.colonic-lipoma.endoscopic-recognition.v3"
  ],
  [
    "case.l2.colonic-lipoma.direct.typical-b",
    "node.colonic-lipoma.management.patient-to-plan.v2",
    "question.colonic-lipoma.management.patient-to-plan.v2.r3",
    "concept.colonic-lipoma.asymptomatic-management"
  ],
  [
    "case.l2.wound-healing.vitamin-c.vitamin-identification.v1",
    "node.wound-healing.vitamin-c.vitamin-identification.v1",
    "question.wound-healing.vitamin-c.vitamin-identification.v1",
    "concept.wound-healing.vitamin-c-collagen-hydroxylation"
  ],
  [
    "case.l2.wound-healing.vitamin-c.biochemical-step.v1",
    "node.wound-healing.vitamin-c.biochemical-step.v1",
    "question.wound-healing.vitamin-c.biochemical-step.v1",
    "concept.wound-healing.vitamin-c-collagen-hydroxylation"
  ],
  [
    "case.l2.wound-healing.vitamin-c.mechanism-explanation.v1",
    "node.wound-healing.vitamin-c.mechanism-explanation.v1",
    "question.wound-healing.vitamin-c.mechanism-explanation.v1",
    "concept.wound-healing.vitamin-c-collagen-hydroxylation"
  ],
  [
    "case.l2.wound-healing.vitamin-c.mechanism-consequence.v1",
    "node.wound-healing.vitamin-c.mechanism-consequence.v1",
    "question.wound-healing.vitamin-c.mechanism-consequence.v1",
    "concept.wound-healing.vitamin-c-collagen-hydroxylation"
  ],
  [
    "case.l2.gastric-malt.integrated-diagnosis-to-treatment.v1",
    "node.gastric-malt.integrated-pathology-diagnosis.v1",
    "question.gastric-malt.integrated-pathology-diagnosis.v1.r5",
    "concept.gastric-malt-lymphoma.pathologic-recognition.v2"
  ],
  [
    "case.l2.gastric-malt.integrated-diagnosis-to-treatment.v1",
    "node.gastric-malt.localized-hpylori-positive-initial-treatment.v1",
    "question.gastric-malt.localized-hpylori-positive-initial-treatment.v1.r4",
    "concept.gastric-malt-lymphoma.hpylori-eradication-first-line.v2"
  ],
  [
    "case.l2.gastric-malt.profile-to-followup-boundary.v1",
    "node.gastric-malt.pathology-profile-selection.v1",
    "question.gastric-malt.pathology-profile-selection.v1.r5",
    "concept.gastric-malt-lymphoma.pathologic-recognition.v2"
  ],
  [
    "case.l2.gastric-malt.profile-to-followup-boundary.v1",
    "node.gastric-malt.eradication-response-reassessment.v1",
    "question.gastric-malt.eradication-response-reassessment.v1.r4",
    "concept.gastric-malt-lymphoma.hpylori-eradication-first-line.v2"
  ],
  [
    "case.l2.gastric-malt.cd20-boundary.v1",
    "node.gastric-malt.cd20-alone-boundary.v1",
    "question.gastric-malt.cd20-alone-boundary.v1.r8",
    "concept.gastric-malt-lymphoma.pathologic-recognition"
  ],
  [
    "case.l2.gastric-malt.eradication-patient-selection.v1",
    "node.gastric-malt.eradication-patient-selection.v1",
    "question.gastric-malt.eradication-patient-selection.v1",
    "concept.gastric-malt-lymphoma.hpylori-eradication-first-line"
  ],
  [
    "case.l2.gastroparesis.general-confirmatory-testing.v1",
    "node.gastroparesis.general-confirmatory-testing.v1",
    "question.gastroparesis.general-confirmatory-testing.v1",
    "concept.gastroparesis.confirmatory-gastric-emptying-scintigraphy"
  ],
  [
    "case.l2.gastroparesis.diabetes-confirmatory-testing.v1",
    "node.gastroparesis.diabetes-confirmatory-testing.v1",
    "question.gastroparesis.diabetes-confirmatory-testing.v1",
    "concept.gastroparesis.confirmatory-gastric-emptying-scintigraphy"
  ],
  [
    "case.l2.gastroparesis.postsurgical-confirmatory-testing.v1",
    "node.gastroparesis.postsurgical-confirmatory-testing.v1",
    "question.gastroparesis.postsurgical-confirmatory-testing.v1",
    "concept.gastroparesis.confirmatory-gastric-emptying-scintigraphy"
  ],
  [
    "case.l2.gastroparesis.objective-result-selection.v1",
    "node.gastroparesis.objective-result-selection.v1",
    "question.gastroparesis.objective-result-selection.v1",
    "concept.gastroparesis.confirmatory-gastric-emptying-scintigraphy"
  ],
  [
    "case.l2.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1",
    "node.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1",
    "question.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1.r3",
    "concept.gastric-adenocarcinoma.prophylactic-splenectomy-avoidance"
  ],
  [
    "case.l2.gastric-adenocarcinoma.spleen-preservation-counseling.v1",
    "node.gastric-adenocarcinoma.spleen-preservation-counseling.v1",
    "question.gastric-adenocarcinoma.spleen-preservation-counseling.v1",
    "concept.gastric-adenocarcinoma.prophylactic-splenectomy-avoidance"
  ],
  [
    "case.l2.peptic-ulcer-bleeding.visible-vessel-hemostasis.v1",
    "node.peptic-ulcer-bleeding.visible-vessel-treat.v1",
    "question.peptic-ulcer-bleeding.visible-vessel-treat.v1.r6",
    "concept.peptic-ulcer-bleeding.high-risk-stigmata-endoscopic-hemostasis.v2"
  ],
  [
    "case.l2.peptic-ulcer-bleeding.visible-vessel-hemostasis.v1",
    "node.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1",
    "question.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1.r5",
    "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality.v2"
  ],
  [
    "case.l2.peptic-ulcer-bleeding.select-high-risk-stigmata.v1",
    "node.peptic-ulcer-bleeding.select-high-risk-stigmata.v1",
    "question.peptic-ulcer-bleeding.select-high-risk-stigmata.v1",
    "concept.peptic-ulcer-bleeding.high-risk-stigmata-endoscopic-hemostasis"
  ],
  [
    "case.l2.peptic-ulcer-bleeding.clean-base-reverse.v1",
    "node.peptic-ulcer-bleeding.clean-base-reverse.v1",
    "question.peptic-ulcer-bleeding.clean-base-reverse.v1",
    "concept.peptic-ulcer-bleeding.high-risk-stigmata-endoscopic-hemostasis"
  ],
  [
    "case.l2.peptic-ulcer-bleeding.visible-vessel-modality-principle.v1",
    "node.peptic-ulcer-bleeding.visible-vessel-modality-principle.v1",
    "question.peptic-ulcer-bleeding.visible-vessel-modality-principle.v1",
    "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality"
  ],
  [
    "case.l2.distal-cholangiocarcinoma.deferred-eus-ercp-to-resection",
    "node.distal-cholangiocarcinoma.workup-a.v1",
    "question.distal-cholangiocarcinoma.workup-a.v1",
    "concept.distal-cholangiocarcinoma.operable-tissue-evaluation"
  ],
  [
    "case.l2.distal-cholangiocarcinoma.deferred-eus-ercp-to-resection",
    "node.distal-cholangiocarcinoma.management-a.v1",
    "question.distal-cholangiocarcinoma.management-a.v1",
    "concept.distal-cholangiocarcinoma.resection-selection"
  ],
  [
    "case.graves-pattern-recognition.v1",
    "node.graves-pattern-recognition.v1",
    "question.graves-pattern-recognition.v1",
    "concept.graves.clinical-pattern-recognition"
  ],
  [
    "case.graves-pattern-recognition.v2",
    "node.graves-pattern-recognition.v2",
    "question.graves-pattern-recognition.v2",
    "concept.graves.clinical-pattern-recognition"
  ],
  [
    "case.graves-pattern-recognition.v3",
    "node.graves-pattern-recognition.v3",
    "question.graves-pattern-recognition.v3",
    "concept.graves.clinical-pattern-recognition"
  ],
  [
    "case.graves-pattern-recognition.v4",
    "node.graves-pattern-recognition.v4",
    "question.graves-pattern-recognition.v4",
    "concept.graves.clinical-pattern-recognition"
  ],
  [
    "case.graves-trab-diagnostic-support.v1",
    "node.graves-trab-diagnostic-support.v1",
    "question.graves-trab-diagnostic-support.v1",
    "concept.graves.trab-diagnostic-support"
  ],
  [
    "case.graves-trab-diagnostic-support.v2",
    "node.graves-trab-diagnostic-support.v2",
    "question.graves-trab-diagnostic-support.v2",
    "concept.graves.trab-diagnostic-support"
  ],
  [
    "case.graves-trab-diagnostic-support.v3",
    "node.graves-trab-diagnostic-support.v3",
    "question.graves-trab-diagnostic-support.v3",
    "concept.graves.trab-diagnostic-support"
  ],
  [
    "case.graves-trab-diagnostic-support.v4",
    "node.graves-trab-diagnostic-support.v4",
    "question.graves-trab-diagnostic-support.v4",
    "concept.graves.trab-diagnostic-support"
  ],
  [
    "case.graves-rai-appropriate-candidate.v1",
    "node.graves-rai-appropriate-candidate.v1",
    "question.graves-rai-appropriate-candidate.v1",
    "concept.graves.rai-appropriate-candidate"
  ],
  [
    "case.graves-rai-appropriate-candidate.v2",
    "node.graves-rai-appropriate-candidate.v2",
    "question.graves-rai-appropriate-candidate.v2",
    "concept.graves.rai-appropriate-candidate"
  ],
  [
    "case.graves-rai-appropriate-candidate.v3",
    "node.graves-rai-appropriate-candidate.v3",
    "question.graves-rai-appropriate-candidate.v3",
    "concept.graves.rai-appropriate-candidate"
  ],
  [
    "case.graves-rai-appropriate-candidate.v4",
    "node.graves-rai-appropriate-candidate.v4",
    "question.graves-rai-appropriate-candidate.v4",
    "concept.graves.rai-appropriate-candidate"
  ],
  [
    "case.graves-rai-pregnancy-contraindication.v1",
    "node.graves-rai-pregnancy-contraindication.v1",
    "question.graves-rai-pregnancy-contraindication.v1",
    "concept.graves.rai-pregnancy-contraindication"
  ],
  [
    "case.graves-rai-pregnancy-contraindication.v2",
    "node.graves-rai-pregnancy-contraindication.v2",
    "question.graves-rai-pregnancy-contraindication.v2",
    "concept.graves.rai-pregnancy-contraindication"
  ],
  [
    "case.graves-rai-pregnancy-contraindication.v3",
    "node.graves-rai-pregnancy-contraindication.v3",
    "question.graves-rai-pregnancy-contraindication.v3",
    "concept.graves.rai-pregnancy-contraindication"
  ],
  [
    "case.graves-rai-pregnancy-contraindication.v4",
    "node.graves-rai-pregnancy-contraindication.v4",
    "question.graves-rai-pregnancy-contraindication.v4",
    "concept.graves.rai-pregnancy-contraindication"
  ],
  [
    "case.graves-rai-lactation-contraindication.v1",
    "node.graves-rai-lactation-contraindication.v1",
    "question.graves-rai-lactation-contraindication.v1",
    "concept.graves.rai-lactation-contraindication"
  ],
  [
    "case.graves-rai-lactation-contraindication.v2",
    "node.graves-rai-lactation-contraindication.v2",
    "question.graves-rai-lactation-contraindication.v2",
    "concept.graves.rai-lactation-contraindication"
  ],
  [
    "case.graves-rai-lactation-contraindication.v3",
    "node.graves-rai-lactation-contraindication.v3",
    "question.graves-rai-lactation-contraindication.v3",
    "concept.graves.rai-lactation-contraindication"
  ],
  [
    "case.graves-rai-lactation-contraindication.v4",
    "node.graves-rai-lactation-contraindication.v4",
    "question.graves-rai-lactation-contraindication.v4",
    "concept.graves.rai-lactation-contraindication"
  ],
  [
    "case.graves-rai-active-ted-avoidance.v1",
    "node.graves-rai-active-ted-avoidance.v1",
    "question.graves-rai-active-ted-avoidance.v1",
    "concept.graves.rai-active-ted-avoidance"
  ],
  [
    "case.graves-rai-active-ted-avoidance.v2",
    "node.graves-rai-active-ted-avoidance.v2",
    "question.graves-rai-active-ted-avoidance.v2",
    "concept.graves.rai-active-ted-avoidance"
  ],
  [
    "case.graves-rai-active-ted-avoidance.v3",
    "node.graves-rai-active-ted-avoidance.v3",
    "question.graves-rai-active-ted-avoidance.v3",
    "concept.graves.rai-active-ted-avoidance"
  ],
  [
    "case.graves-rai-active-ted-avoidance.v4",
    "node.graves-rai-active-ted-avoidance.v4",
    "question.graves-rai-active-ted-avoidance.v4",
    "concept.graves.rai-active-ted-avoidance"
  ],
  [
    "case.gallstones.symptomatic-postmeal-episodes",
    "node.gallstones.symptomatic-postmeal-episodes.1",
    "question.gallstones.initial-ultrasound.v1",
    "concept.gallstones.initial-ultrasound"
  ],
  [
    "case.gallstones.symptomatic-postmeal-episodes",
    "node.gallstones.symptomatic-postmeal-episodes.2",
    "question.gallstones.symptomatic-surgical-referral.v1",
    "concept.gallstones.symptomatic-surgical-referral"
  ],
  [
    "case.gallstones.symptomatic-episodic-night-pain",
    "node.gallstones.symptomatic-episodic-night-pain.1",
    "question.gallstones.initial-ultrasound.v2",
    "concept.gallstones.initial-ultrasound"
  ],
  [
    "case.gallstones.symptomatic-episodic-night-pain",
    "node.gallstones.symptomatic-episodic-night-pain.2",
    "question.gallstones.symptomatic-surgical-referral.v2",
    "concept.gallstones.symptomatic-surgical-referral"
  ],
  [
    "case.gallstones.symptomatic-recurrent-epigastric-pain",
    "node.gallstones.symptomatic-recurrent-epigastric-pain.1",
    "question.gallstones.initial-ultrasound.v3",
    "concept.gallstones.initial-ultrasound"
  ],
  [
    "case.gallstones.symptomatic-recurrent-epigastric-pain",
    "node.gallstones.symptomatic-recurrent-epigastric-pain.2",
    "question.gallstones.symptomatic-surgical-referral.v3",
    "concept.gallstones.symptomatic-surgical-referral"
  ],
  [
    "case.gallstones.symptomatic-fatty-food-pain",
    "node.gallstones.symptomatic-fatty-food-pain.1",
    "question.gallstones.initial-ultrasound.v4",
    "concept.gallstones.initial-ultrasound"
  ],
  [
    "case.gallstones.symptomatic-fatty-food-pain",
    "node.gallstones.symptomatic-fatty-food-pain.2",
    "question.gallstones.symptomatic-surgical-referral.v4",
    "concept.gallstones.symptomatic-surgical-referral"
  ],
  [
    "case.gallstones.incidental-checkup",
    "node.gallstones.incidental-checkup.1",
    "question.gallstones.incidental-observation.v1",
    "concept.gallstones.incidental-observation"
  ],
  [
    "case.gallstones.incidental-liver-study",
    "node.gallstones.incidental-liver-study.1",
    "question.gallstones.incidental-observation.v2",
    "concept.gallstones.incidental-observation"
  ],
  [
    "case.gallstones.incidental-vascular-ct",
    "node.gallstones.incidental-vascular-ct.1",
    "question.gallstones.incidental-observation.v3",
    "concept.gallstones.incidental-observation"
  ],
  [
    "case.gallstones.incidental-training-ultrasound",
    "node.gallstones.incidental-training-ultrasound.1",
    "question.gallstones.incidental-observation.v4",
    "concept.gallstones.incidental-observation"
  ],
  [
    "case.nephrolithiasis.recurrent-flank-pain",
    "node.nephrolithiasis.recurrent-flank-pain.1",
    "question.nephrolithiasis.noncontrast-ct-evaluation.v1",
    "concept.nephrolithiasis.noncontrast-ct-evaluation"
  ],
  [
    "case.nephrolithiasis.recurrent-flank-pain",
    "node.nephrolithiasis.recurrent-flank-pain.2",
    "question.nephrolithiasis.recurrent-metabolic-evaluation.v1",
    "concept.nephrolithiasis.recurrent-metabolic-evaluation"
  ],
  [
    "case.nephrolithiasis.uncertain-ureteral-stone",
    "node.nephrolithiasis.uncertain-ureteral-stone.1",
    "question.nephrolithiasis.noncontrast-ct-evaluation.v2",
    "concept.nephrolithiasis.noncontrast-ct-evaluation"
  ],
  [
    "case.nephrolithiasis.uncertain-ureteral-stone",
    "node.nephrolithiasis.uncertain-ureteral-stone.2",
    "question.nephrolithiasis.recurrent-metabolic-evaluation.v2",
    "concept.nephrolithiasis.recurrent-metabolic-evaluation"
  ],
  [
    "case.nephrolithiasis.prior-stone-new-pain",
    "node.nephrolithiasis.prior-stone-new-pain.1",
    "question.nephrolithiasis.noncontrast-ct-evaluation.v3",
    "concept.nephrolithiasis.noncontrast-ct-evaluation"
  ],
  [
    "case.nephrolithiasis.prior-stone-new-pain",
    "node.nephrolithiasis.prior-stone-new-pain.2",
    "question.nephrolithiasis.recurrent-metabolic-evaluation.v3",
    "concept.nephrolithiasis.recurrent-metabolic-evaluation"
  ],
  [
    "case.nephrolithiasis.hematuria-colic",
    "node.nephrolithiasis.hematuria-colic.1",
    "question.nephrolithiasis.noncontrast-ct-evaluation.v4",
    "concept.nephrolithiasis.noncontrast-ct-evaluation"
  ],
  [
    "case.nephrolithiasis.hematuria-colic",
    "node.nephrolithiasis.hematuria-colic.2",
    "question.nephrolithiasis.recurrent-metabolic-evaluation.v4",
    "concept.nephrolithiasis.recurrent-metabolic-evaluation"
  ],
  [
    "case.celiac.chronic-diarrhea",
    "node.celiac.chronic-diarrhea.1",
    "question.celiac.initial-serology.v1",
    "concept.celiac.initial-serology"
  ],
  [
    "case.celiac.chronic-diarrhea",
    "node.celiac.chronic-diarrhea.2",
    "question.celiac.duodenal-biopsy-confirmation.v1",
    "concept.celiac.duodenal-biopsy-confirmation"
  ],
  [
    "case.celiac.chronic-diarrhea",
    "node.celiac.chronic-diarrhea.3",
    "question.celiac.gluten-free-treatment.v1",
    "concept.celiac.gluten-free-treatment"
  ],
  [
    "case.celiac.iron-deficiency-symptoms",
    "node.celiac.iron-deficiency-symptoms.1",
    "question.celiac.initial-serology.v2",
    "concept.celiac.initial-serology"
  ],
  [
    "case.celiac.iron-deficiency-symptoms",
    "node.celiac.iron-deficiency-symptoms.2",
    "question.celiac.duodenal-biopsy-confirmation.v2",
    "concept.celiac.duodenal-biopsy-confirmation"
  ],
  [
    "case.celiac.iron-deficiency-symptoms",
    "node.celiac.iron-deficiency-symptoms.3",
    "question.celiac.gluten-free-treatment.v2",
    "concept.celiac.gluten-free-treatment"
  ],
  [
    "case.celiac.weight-loss-discomfort",
    "node.celiac.weight-loss-discomfort.1",
    "question.celiac.initial-serology.v3",
    "concept.celiac.initial-serology"
  ],
  [
    "case.celiac.weight-loss-discomfort",
    "node.celiac.weight-loss-discomfort.2",
    "question.celiac.duodenal-biopsy-confirmation.v3",
    "concept.celiac.duodenal-biopsy-confirmation"
  ],
  [
    "case.celiac.weight-loss-discomfort",
    "node.celiac.weight-loss-discomfort.3",
    "question.celiac.gluten-free-treatment.v3",
    "concept.celiac.gluten-free-treatment"
  ],
  [
    "case.celiac.family-history",
    "node.celiac.family-history.1",
    "question.celiac.initial-serology.v4",
    "concept.celiac.initial-serology"
  ],
  [
    "case.celiac.family-history",
    "node.celiac.family-history.2",
    "question.celiac.duodenal-biopsy-confirmation.v4",
    "concept.celiac.duodenal-biopsy-confirmation"
  ],
  [
    "case.celiac.family-history",
    "node.celiac.family-history.3",
    "question.celiac.gluten-free-treatment.v4",
    "concept.celiac.gluten-free-treatment"
  ],
  [
    "case.colorectal.routine-screen",
    "node.colorectal.routine-screen.1",
    "question.colorectal.positive-fit-colonoscopy.v1",
    "concept.colorectal.positive-fit-colonoscopy"
  ],
  [
    "case.colorectal.routine-screen",
    "node.colorectal.routine-screen.2",
    "question.colorectal.histologic-confirmation.v1",
    "concept.colorectal.histologic-confirmation"
  ],
  [
    "case.colorectal.mailed-fit",
    "node.colorectal.mailed-fit.1",
    "question.colorectal.positive-fit-colonoscopy.v2",
    "concept.colorectal.positive-fit-colonoscopy"
  ],
  [
    "case.colorectal.mailed-fit",
    "node.colorectal.mailed-fit.2",
    "question.colorectal.histologic-confirmation.v2",
    "concept.colorectal.histologic-confirmation"
  ],
  [
    "case.colorectal.preventive-visit",
    "node.colorectal.preventive-visit.1",
    "question.colorectal.positive-fit-colonoscopy.v3",
    "concept.colorectal.positive-fit-colonoscopy"
  ],
  [
    "case.colorectal.preventive-visit",
    "node.colorectal.preventive-visit.2",
    "question.colorectal.histologic-confirmation.v3",
    "concept.colorectal.histologic-confirmation"
  ],
  [
    "case.colorectal.repeat-screening",
    "node.colorectal.repeat-screening.1",
    "question.colorectal.positive-fit-colonoscopy.v4",
    "concept.colorectal.positive-fit-colonoscopy"
  ],
  [
    "case.colorectal.repeat-screening",
    "node.colorectal.repeat-screening.2",
    "question.colorectal.histologic-confirmation.v4",
    "concept.colorectal.histologic-confirmation"
  ],
  [
    "case.iron-deficiency.adult-man-fatigue",
    "node.iron-deficiency.adult-man-fatigue.1",
    "question.iron-deficiency.iron-studies.v1",
    "concept.iron-deficiency.iron-studies"
  ],
  [
    "case.iron-deficiency.adult-man-fatigue",
    "node.iron-deficiency.adult-man-fatigue.2",
    "question.iron-deficiency.gi-evaluation.v1",
    "concept.iron-deficiency.gi-evaluation"
  ],
  [
    "case.iron-deficiency.postmenopausal-dyspnea",
    "node.iron-deficiency.postmenopausal-dyspnea.1",
    "question.iron-deficiency.iron-studies.v2",
    "concept.iron-deficiency.iron-studies"
  ],
  [
    "case.iron-deficiency.postmenopausal-dyspnea",
    "node.iron-deficiency.postmenopausal-dyspnea.2",
    "question.iron-deficiency.gi-evaluation.v2",
    "concept.iron-deficiency.gi-evaluation"
  ],
  [
    "case.iron-deficiency.adult-man-donation",
    "node.iron-deficiency.adult-man-donation.1",
    "question.iron-deficiency.iron-studies.v3",
    "concept.iron-deficiency.iron-studies"
  ],
  [
    "case.iron-deficiency.adult-man-donation",
    "node.iron-deficiency.adult-man-donation.2",
    "question.iron-deficiency.gi-evaluation.v3",
    "concept.iron-deficiency.gi-evaluation"
  ],
  [
    "case.iron-deficiency.postmenopausal-checkup",
    "node.iron-deficiency.postmenopausal-checkup.1",
    "question.iron-deficiency.iron-studies.v4",
    "concept.iron-deficiency.iron-studies"
  ],
  [
    "case.iron-deficiency.postmenopausal-checkup",
    "node.iron-deficiency.postmenopausal-checkup.2",
    "question.iron-deficiency.gi-evaluation.v4",
    "concept.iron-deficiency.gi-evaluation"
  ],
  [
    "case.soft-tissue-mass.deep-thigh",
    "node.soft-tissue-mass.deep-thigh.1",
    "question.soft-tissue-mass.extremity-mri.v1.r8",
    "concept.soft-tissue-mass.extremity-mri.v4"
  ],
  [
    "case.soft-tissue-mass.deep-thigh",
    "node.soft-tissue-mass.deep-thigh.2",
    "question.soft-tissue-mass.specialist-planned-biopsy.v1.r4",
    "concept.soft-tissue-mass.specialist-planned-biopsy"
  ],
  [
    "case.soft-tissue-mass.upper-arm",
    "node.soft-tissue-mass.upper-arm.1",
    "question.soft-tissue-mass.extremity-mri.v2.r6",
    "concept.soft-tissue-mass.extremity-mri.v2"
  ],
  [
    "case.soft-tissue-mass.upper-arm",
    "node.soft-tissue-mass.upper-arm.2",
    "question.soft-tissue-mass.specialist-planned-biopsy.v2.r4",
    "concept.soft-tissue-mass.specialist-planned-biopsy"
  ],
  [
    "case.soft-tissue-mass.calf-indeterminate",
    "node.soft-tissue-mass.calf-indeterminate.1",
    "question.soft-tissue-mass.extremity-mri.v3",
    "concept.soft-tissue-mass.extremity-mri"
  ],
  [
    "case.soft-tissue-mass.calf-indeterminate",
    "node.soft-tissue-mass.calf-indeterminate.2",
    "question.soft-tissue-mass.specialist-planned-biopsy.v3",
    "concept.soft-tissue-mass.specialist-planned-biopsy"
  ],
  [
    "case.soft-tissue-mass.forearm-progressive",
    "node.soft-tissue-mass.forearm-progressive.1",
    "question.soft-tissue-mass.extremity-mri.v4",
    "concept.soft-tissue-mass.extremity-mri"
  ],
  [
    "case.soft-tissue-mass.forearm-progressive",
    "node.soft-tissue-mass.forearm-progressive.2",
    "question.soft-tissue-mass.specialist-planned-biopsy.v4",
    "concept.soft-tissue-mass.specialist-planned-biopsy"
  ],
  [
    "case.thyroid-nodule.palpable-referral",
    "node.thyroid-nodule.palpable-referral.1",
    "question.thyroid-nodule.fna-selection.v1",
    "concept.thyroid-nodule.fna-selection"
  ],
  [
    "case.thyroid-nodule.palpable-referral",
    "node.thyroid-nodule.palpable-referral.2",
    "question.thyroid-nodule.follicular-invasion-histology.v1",
    "concept.thyroid-nodule.follicular-invasion-histology"
  ],
  [
    "case.thyroid-nodule.incidental-imaging",
    "node.thyroid-nodule.incidental-imaging.1",
    "question.thyroid-nodule.fna-selection.v2",
    "concept.thyroid-nodule.fna-selection"
  ],
  [
    "case.thyroid-nodule.incidental-imaging",
    "node.thyroid-nodule.incidental-imaging.2",
    "question.thyroid-nodule.follicular-invasion-histology.v2",
    "concept.thyroid-nodule.follicular-invasion-histology"
  ],
  [
    "case.thyroid-nodule.family-clinic",
    "node.thyroid-nodule.family-clinic.1",
    "question.thyroid-nodule.fna-selection.v3",
    "concept.thyroid-nodule.fna-selection"
  ],
  [
    "case.thyroid-nodule.family-clinic",
    "node.thyroid-nodule.family-clinic.2",
    "question.thyroid-nodule.follicular-invasion-histology.v3",
    "concept.thyroid-nodule.follicular-invasion-histology"
  ],
  [
    "case.thyroid-nodule.surveillance-change",
    "node.thyroid-nodule.surveillance-change.1",
    "question.thyroid-nodule.fna-selection.v4",
    "concept.thyroid-nodule.fna-selection"
  ],
  [
    "case.thyroid-nodule.surveillance-change",
    "node.thyroid-nodule.surveillance-change.2",
    "question.thyroid-nodule.follicular-invasion-histology.v4",
    "concept.thyroid-nodule.follicular-invasion-histology"
  ],
  [
    "case.primary-hyperparathyroidism.stone-history",
    "node.primary-hyperparathyroidism.stone-history.1",
    "question.primary-hyperparathyroidism.biochemical-confirmation.v1",
    "concept.primary-hyperparathyroidism.biochemical-confirmation"
  ],
  [
    "case.primary-hyperparathyroidism.stone-history",
    "node.primary-hyperparathyroidism.stone-history.2",
    "question.primary-hyperparathyroidism.symptomatic-surgery-assessment.v1",
    "concept.primary-hyperparathyroidism.symptomatic-surgery-assessment"
  ],
  [
    "case.primary-hyperparathyroidism.fragility-fracture",
    "node.primary-hyperparathyroidism.fragility-fracture.1",
    "question.primary-hyperparathyroidism.biochemical-confirmation.v2",
    "concept.primary-hyperparathyroidism.biochemical-confirmation"
  ],
  [
    "case.primary-hyperparathyroidism.fragility-fracture",
    "node.primary-hyperparathyroidism.fragility-fracture.2",
    "question.primary-hyperparathyroidism.symptomatic-surgery-assessment.v2",
    "concept.primary-hyperparathyroidism.symptomatic-surgery-assessment"
  ],
  [
    "case.primary-hyperparathyroidism.recurrent-stone-review",
    "node.primary-hyperparathyroidism.recurrent-stone-review.1",
    "question.primary-hyperparathyroidism.biochemical-confirmation.v3",
    "concept.primary-hyperparathyroidism.biochemical-confirmation"
  ],
  [
    "case.primary-hyperparathyroidism.recurrent-stone-review",
    "node.primary-hyperparathyroidism.recurrent-stone-review.2",
    "question.primary-hyperparathyroidism.symptomatic-surgery-assessment.v3",
    "concept.primary-hyperparathyroidism.symptomatic-surgery-assessment"
  ],
  [
    "case.primary-hyperparathyroidism.bone-density-referral",
    "node.primary-hyperparathyroidism.bone-density-referral.1",
    "question.primary-hyperparathyroidism.biochemical-confirmation.v4",
    "concept.primary-hyperparathyroidism.biochemical-confirmation"
  ],
  [
    "case.primary-hyperparathyroidism.bone-density-referral",
    "node.primary-hyperparathyroidism.bone-density-referral.2",
    "question.primary-hyperparathyroidism.symptomatic-surgery-assessment.v4",
    "concept.primary-hyperparathyroidism.symptomatic-surgery-assessment"
  ],
  [
    "case.inguinal-hernia.lifting-bulge",
    "node.inguinal-hernia.lifting-bulge.1",
    "question.inguinal-hernia.equivocal-exam-ultrasound.v1.r5",
    "concept.inguinal-hernia.equivocal-exam-ultrasound.v2"
  ],
  [
    "case.inguinal-hernia.lifting-bulge",
    "node.inguinal-hernia.lifting-bulge.2",
    "question.inguinal-hernia.symptomatic-elective-repair.v1.r8",
    "concept.inguinal-hernia.symptomatic-elective-repair.v3"
  ],
  [
    "case.inguinal-hernia.running-discomfort",
    "node.inguinal-hernia.running-discomfort.1",
    "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r6",
    "concept.inguinal-hernia.equivocal-exam-ultrasound.v2"
  ],
  [
    "case.inguinal-hernia.running-discomfort",
    "node.inguinal-hernia.running-discomfort.2",
    "question.inguinal-hernia.symptomatic-elective-repair.v2.r8",
    "concept.inguinal-hernia.symptomatic-elective-repair.v3"
  ],
  [
    "case.inguinal-hernia.caregiving-strain",
    "node.inguinal-hernia.caregiving-strain.1",
    "question.inguinal-hernia.equivocal-exam-ultrasound.v3.r7",
    "concept.inguinal-hernia.equivocal-exam-ultrasound.v2"
  ],
  [
    "case.inguinal-hernia.caregiving-strain",
    "node.inguinal-hernia.caregiving-strain.2",
    "question.inguinal-hernia.symptomatic-elective-repair.v3.r8",
    "concept.inguinal-hernia.symptomatic-elective-repair.v3"
  ],
  [
    "case.inguinal-hernia.standing-shift",
    "node.inguinal-hernia.standing-shift.1",
    "question.inguinal-hernia.equivocal-exam-ultrasound.v4.r7",
    "concept.inguinal-hernia.equivocal-exam-ultrasound.v2"
  ],
  [
    "case.inguinal-hernia.standing-shift",
    "node.inguinal-hernia.standing-shift.2",
    "question.inguinal-hernia.symptomatic-elective-repair.v4.r8",
    "concept.inguinal-hernia.symptomatic-elective-repair.v3"
  ],
  [
    "case.anal-fissure.constipation",
    "node.anal-fissure.constipation.1",
    "question.anal-fissure.acute-recognition.v1",
    "concept.anal-fissure.acute-recognition"
  ],
  [
    "case.anal-fissure.constipation",
    "node.anal-fissure.constipation.2",
    "question.anal-fissure.initial-conservative-care.v1",
    "concept.anal-fissure.initial-conservative-care"
  ],
  [
    "case.anal-fissure.post-travel",
    "node.anal-fissure.post-travel.1",
    "question.anal-fissure.acute-recognition.v2",
    "concept.anal-fissure.acute-recognition"
  ],
  [
    "case.anal-fissure.post-travel",
    "node.anal-fissure.post-travel.2",
    "question.anal-fissure.initial-conservative-care.v2",
    "concept.anal-fissure.initial-conservative-care"
  ],
  [
    "case.anal-fissure.postpartum",
    "node.anal-fissure.postpartum.1",
    "question.anal-fissure.acute-recognition.v3",
    "concept.anal-fissure.acute-recognition"
  ],
  [
    "case.anal-fissure.postpartum",
    "node.anal-fissure.postpartum.2",
    "question.anal-fissure.initial-conservative-care.v3",
    "concept.anal-fissure.initial-conservative-care"
  ],
  [
    "case.anal-fissure.diarrhea",
    "node.anal-fissure.diarrhea.1",
    "question.anal-fissure.acute-recognition.v4",
    "concept.anal-fissure.acute-recognition"
  ],
  [
    "case.anal-fissure.diarrhea",
    "node.anal-fissure.diarrhea.2",
    "question.anal-fissure.initial-conservative-care.v4",
    "concept.anal-fissure.initial-conservative-care"
  ],
  [
    "case.internal-hemorrhoids.commute",
    "node.internal-hemorrhoids.commute.1",
    "question.internal-hemorrhoids.anoscopy-evaluation.v1",
    "concept.internal-hemorrhoids.anoscopy-evaluation"
  ],
  [
    "case.internal-hemorrhoids.commute",
    "node.internal-hemorrhoids.commute.2",
    "question.internal-hemorrhoids.office-banding-selection.v1",
    "concept.internal-hemorrhoids.office-banding-selection"
  ],
  [
    "case.internal-hemorrhoids.exercise",
    "node.internal-hemorrhoids.exercise.1",
    "question.internal-hemorrhoids.anoscopy-evaluation.v2",
    "concept.internal-hemorrhoids.anoscopy-evaluation"
  ],
  [
    "case.internal-hemorrhoids.exercise",
    "node.internal-hemorrhoids.exercise.2",
    "question.internal-hemorrhoids.office-banding-selection.v2",
    "concept.internal-hemorrhoids.office-banding-selection"
  ],
  [
    "case.internal-hemorrhoids.workday",
    "node.internal-hemorrhoids.workday.1",
    "question.internal-hemorrhoids.anoscopy-evaluation.v3",
    "concept.internal-hemorrhoids.anoscopy-evaluation"
  ],
  [
    "case.internal-hemorrhoids.workday",
    "node.internal-hemorrhoids.workday.2",
    "question.internal-hemorrhoids.office-banding-selection.v3",
    "concept.internal-hemorrhoids.office-banding-selection"
  ],
  [
    "case.internal-hemorrhoids.followup",
    "node.internal-hemorrhoids.followup.1",
    "question.internal-hemorrhoids.anoscopy-evaluation.v4",
    "concept.internal-hemorrhoids.anoscopy-evaluation"
  ],
  [
    "case.internal-hemorrhoids.followup",
    "node.internal-hemorrhoids.followup.2",
    "question.internal-hemorrhoids.office-banding-selection.v4",
    "concept.internal-hemorrhoids.office-banding-selection"
  ],
  [
    "case.esophageal-dysphagia.bread-sticking",
    "node.esophageal-dysphagia.bread-sticking.1",
    "question.esophageal-dysphagia.upper-endoscopy.v1",
    "concept.esophageal-dysphagia.upper-endoscopy"
  ],
  [
    "case.esophageal-dysphagia.bread-sticking",
    "node.esophageal-dysphagia.bread-sticking.2",
    "question.barrett-esophagus.intestinal-metaplasia.v1",
    "concept.barrett-esophagus.intestinal-metaplasia"
  ],
  [
    "case.esophageal-dysphagia.meal-pauses",
    "node.esophageal-dysphagia.meal-pauses.1",
    "question.esophageal-dysphagia.upper-endoscopy.v2",
    "concept.esophageal-dysphagia.upper-endoscopy"
  ],
  [
    "case.esophageal-dysphagia.meal-pauses",
    "node.esophageal-dysphagia.meal-pauses.2",
    "question.barrett-esophagus.intestinal-metaplasia.v2",
    "concept.barrett-esophagus.intestinal-metaplasia"
  ],
  [
    "case.esophageal-dysphagia.progressive-solids",
    "node.esophageal-dysphagia.progressive-solids.1",
    "question.esophageal-dysphagia.upper-endoscopy.v3",
    "concept.esophageal-dysphagia.upper-endoscopy"
  ],
  [
    "case.esophageal-dysphagia.progressive-solids",
    "node.esophageal-dysphagia.progressive-solids.2",
    "question.barrett-esophagus.intestinal-metaplasia.v3",
    "concept.barrett-esophagus.intestinal-metaplasia"
  ],
  [
    "case.esophageal-dysphagia.restaurant-meals",
    "node.esophageal-dysphagia.restaurant-meals.1",
    "question.esophageal-dysphagia.upper-endoscopy.v4",
    "concept.esophageal-dysphagia.upper-endoscopy"
  ],
  [
    "case.esophageal-dysphagia.restaurant-meals",
    "node.esophageal-dysphagia.restaurant-meals.2",
    "question.barrett-esophagus.intestinal-metaplasia.v4",
    "concept.barrett-esophagus.intestinal-metaplasia"
  ],
  [
    "case.achalasia.water-and-solids",
    "node.achalasia.water-and-solids.1",
    "question.achalasia.high-resolution-manometry.v1.r6",
    "concept.achalasia.high-resolution-manometry.v2"
  ],
  [
    "case.achalasia.water-and-solids",
    "node.achalasia.water-and-solids.2",
    "question.achalasia.manometric-recognition.v1.r4",
    "concept.achalasia.manometric-recognition"
  ],
  [
    "case.achalasia.night-regurgitation",
    "node.achalasia.night-regurgitation.1",
    "question.achalasia.high-resolution-manometry.v2.r6",
    "concept.achalasia.high-resolution-manometry.v2"
  ],
  [
    "case.achalasia.night-regurgitation",
    "node.achalasia.night-regurgitation.2",
    "question.achalasia.manometric-recognition.v2.r4",
    "concept.achalasia.manometric-recognition"
  ],
  [
    "case.achalasia.slow-meals",
    "node.achalasia.slow-meals.1",
    "question.achalasia.high-resolution-manometry.v3.r8",
    "concept.achalasia.high-resolution-manometry.v3"
  ],
  [
    "case.achalasia.slow-meals",
    "node.achalasia.slow-meals.2",
    "question.achalasia.manometric-recognition.v3.r5",
    "concept.achalasia.manometric-recognition"
  ],
  [
    "case.achalasia.clinic-referral",
    "node.achalasia.clinic-referral.1",
    "question.achalasia.high-resolution-manometry.v4.r5",
    "concept.achalasia.high-resolution-manometry.v2"
  ],
  [
    "case.achalasia.clinic-referral",
    "node.achalasia.clinic-referral.2",
    "question.achalasia.manometric-recognition.v4.r4",
    "concept.achalasia.manometric-recognition"
  ],
  [
    "case.pigmented-skin-lesion.changing-back-lesion",
    "node.pigmented-skin-lesion.changing-back-lesion.1",
    "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r8",
    "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v4"
  ],
  [
    "case.pigmented-skin-lesion.changing-back-lesion",
    "node.pigmented-skin-lesion.changing-back-lesion.2",
    "question.melanoma.sentinel-node-staging.v1.r4",
    "concept.melanoma.sentinel-node-staging"
  ],
  [
    "case.pigmented-skin-lesion.shoulder-border",
    "node.pigmented-skin-lesion.shoulder-border.1",
    "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v2.r7",
    "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v3"
  ],
  [
    "case.pigmented-skin-lesion.shoulder-border",
    "node.pigmented-skin-lesion.shoulder-border.2",
    "question.melanoma.sentinel-node-staging.v2.r4",
    "concept.melanoma.sentinel-node-staging"
  ],
  [
    "case.pigmented-skin-lesion.calf-growth",
    "node.pigmented-skin-lesion.calf-growth.1",
    "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r8",
    "concept.pigmented-skin-lesion.partial-depth-nodal-planning.v1"
  ],
  [
    "case.pigmented-skin-lesion.calf-growth",
    "node.pigmented-skin-lesion.calf-growth.2",
    "question.melanoma.sentinel-node-staging.v3.r5",
    "concept.melanoma.sentinel-node-staging.v2"
  ],
  [
    "case.pigmented-skin-lesion.forearm-change",
    "node.pigmented-skin-lesion.forearm-change.1",
    "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r8",
    "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v3"
  ],
  [
    "case.pigmented-skin-lesion.forearm-change",
    "node.pigmented-skin-lesion.forearm-change.2",
    "question.melanoma.sentinel-node-staging.v4.r5",
    "concept.melanoma.sentinel-node-staging.v2"
  ],
  [
    "case.postoperative-seroma.lumpectomy-fullness",
    "node.postoperative-seroma.lumpectomy-fullness.1",
    "question.postoperative-seroma.ultrasound-characterization.v1",
    "concept.postoperative-seroma.ultrasound-characterization"
  ],
  [
    "case.postoperative-seroma.lumpectomy-fullness",
    "node.postoperative-seroma.lumpectomy-fullness.2",
    "question.postoperative-seroma.uncomplicated-observation.v1",
    "concept.postoperative-seroma.uncomplicated-observation"
  ],
  [
    "case.postoperative-seroma.excisional-biopsy",
    "node.postoperative-seroma.excisional-biopsy.1",
    "question.postoperative-seroma.ultrasound-characterization.v2",
    "concept.postoperative-seroma.ultrasound-characterization"
  ],
  [
    "case.postoperative-seroma.excisional-biopsy",
    "node.postoperative-seroma.excisional-biopsy.2",
    "question.postoperative-seroma.uncomplicated-observation.v2",
    "concept.postoperative-seroma.uncomplicated-observation"
  ],
  [
    "case.postoperative-seroma.upper-outer-site",
    "node.postoperative-seroma.upper-outer-site.1",
    "question.postoperative-seroma.ultrasound-characterization.v3",
    "concept.postoperative-seroma.ultrasound-characterization"
  ],
  [
    "case.postoperative-seroma.upper-outer-site",
    "node.postoperative-seroma.upper-outer-site.2",
    "question.postoperative-seroma.uncomplicated-observation.v3",
    "concept.postoperative-seroma.uncomplicated-observation"
  ],
  [
    "case.postoperative-seroma.return-visit",
    "node.postoperative-seroma.return-visit.1",
    "question.postoperative-seroma.ultrasound-characterization.v4",
    "concept.postoperative-seroma.ultrasound-characterization"
  ],
  [
    "case.postoperative-seroma.return-visit",
    "node.postoperative-seroma.return-visit.2",
    "question.postoperative-seroma.uncomplicated-observation.v4",
    "concept.postoperative-seroma.uncomplicated-observation"
  ],
  [
    "case.pilonidal-disease.recurrent-drainage",
    "node.pilonidal-disease.recurrent-drainage.1",
    "question.pilonidal-disease.chronic-sinus-recognition.v1",
    "concept.pilonidal-disease.chronic-sinus-recognition"
  ],
  [
    "case.pilonidal-disease.recurrent-drainage",
    "node.pilonidal-disease.recurrent-drainage.2",
    "question.pilonidal-disease.off-midline-closure-planning.v1",
    "concept.pilonidal-disease.off-midline-closure-planning"
  ],
  [
    "case.pilonidal-disease.work-clothing",
    "node.pilonidal-disease.work-clothing.1",
    "question.pilonidal-disease.chronic-sinus-recognition.v2",
    "concept.pilonidal-disease.chronic-sinus-recognition"
  ],
  [
    "case.pilonidal-disease.work-clothing",
    "node.pilonidal-disease.work-clothing.2",
    "question.pilonidal-disease.off-midline-closure-planning.v2",
    "concept.pilonidal-disease.off-midline-closure-planning"
  ],
  [
    "case.pilonidal-disease.cycling",
    "node.pilonidal-disease.cycling.1",
    "question.pilonidal-disease.chronic-sinus-recognition.v3",
    "concept.pilonidal-disease.chronic-sinus-recognition"
  ],
  [
    "case.pilonidal-disease.cycling",
    "node.pilonidal-disease.cycling.2",
    "question.pilonidal-disease.off-midline-closure-planning.v3",
    "concept.pilonidal-disease.off-midline-closure-planning"
  ],
  [
    "case.pilonidal-disease.quiet-sinus",
    "node.pilonidal-disease.quiet-sinus.1",
    "question.pilonidal-disease.chronic-sinus-recognition.v4",
    "concept.pilonidal-disease.chronic-sinus-recognition"
  ],
  [
    "case.pilonidal-disease.quiet-sinus",
    "node.pilonidal-disease.quiet-sinus.2",
    "question.pilonidal-disease.off-midline-closure-planning.v4",
    "concept.pilonidal-disease.off-midline-closure-planning"
  ],
  [
    "case.lactational-breast-abscess.tender-upper-breast",
    "node.lactational-breast-abscess.tender-upper-breast.1",
    "question.lactational-breast-abscess.targeted-ultrasound.v1",
    "concept.lactational-breast-abscess.targeted-ultrasound"
  ],
  [
    "case.lactational-breast-abscess.tender-upper-breast",
    "node.lactational-breast-abscess.tender-upper-breast.2",
    "question.lactational-breast-abscess.selected-drainage.v1",
    "concept.lactational-breast-abscess.selected-drainage"
  ],
  [
    "case.lactational-breast-abscess.persistent-mass",
    "node.lactational-breast-abscess.persistent-mass.1",
    "question.lactational-breast-abscess.targeted-ultrasound.v2",
    "concept.lactational-breast-abscess.targeted-ultrasound"
  ],
  [
    "case.lactational-breast-abscess.persistent-mass",
    "node.lactational-breast-abscess.persistent-mass.2",
    "question.lactational-breast-abscess.selected-drainage.v2",
    "concept.lactational-breast-abscess.selected-drainage"
  ],
  [
    "case.lactational-breast-abscess.focal-redness",
    "node.lactational-breast-abscess.focal-redness.1",
    "question.lactational-breast-abscess.targeted-ultrasound.v3",
    "concept.lactational-breast-abscess.targeted-ultrasound"
  ],
  [
    "case.lactational-breast-abscess.focal-redness",
    "node.lactational-breast-abscess.focal-redness.2",
    "question.lactational-breast-abscess.selected-drainage.v3",
    "concept.lactational-breast-abscess.selected-drainage"
  ],
  [
    "case.lactational-breast-abscess.nursing-pain",
    "node.lactational-breast-abscess.nursing-pain.1",
    "question.lactational-breast-abscess.targeted-ultrasound.v4",
    "concept.lactational-breast-abscess.targeted-ultrasound"
  ],
  [
    "case.lactational-breast-abscess.nursing-pain",
    "node.lactational-breast-abscess.nursing-pain.2",
    "question.lactational-breast-abscess.selected-drainage.v4",
    "concept.lactational-breast-abscess.selected-drainage"
  ],
  [
    "case.post-thyroidectomy-voice.choir-range",
    "node.post-thyroidectomy-voice.choir-range.1",
    "question.post-thyroidectomy-voice.laryngeal-examination.v1",
    "concept.post-thyroidectomy-voice.laryngeal-examination"
  ],
  [
    "case.post-thyroidectomy-voice.choir-range",
    "node.post-thyroidectomy-voice.choir-range.2",
    "question.post-thyroidectomy-voice.external-superior-laryngeal-nerve.v1",
    "concept.post-thyroidectomy-voice.external-superior-laryngeal-nerve"
  ],
  [
    "case.post-thyroidectomy-voice.teacher-projection",
    "node.post-thyroidectomy-voice.teacher-projection.1",
    "question.post-thyroidectomy-voice.laryngeal-examination.v2",
    "concept.post-thyroidectomy-voice.laryngeal-examination"
  ],
  [
    "case.post-thyroidectomy-voice.teacher-projection",
    "node.post-thyroidectomy-voice.teacher-projection.2",
    "question.post-thyroidectomy-voice.external-superior-laryngeal-nerve.v2",
    "concept.post-thyroidectomy-voice.external-superior-laryngeal-nerve"
  ],
  [
    "case.post-thyroidectomy-voice.coach-volume",
    "node.post-thyroidectomy-voice.coach-volume.1",
    "question.post-thyroidectomy-voice.laryngeal-examination.v3",
    "concept.post-thyroidectomy-voice.laryngeal-examination"
  ],
  [
    "case.post-thyroidectomy-voice.coach-volume",
    "node.post-thyroidectomy-voice.coach-volume.2",
    "question.post-thyroidectomy-voice.external-superior-laryngeal-nerve.v3",
    "concept.post-thyroidectomy-voice.external-superior-laryngeal-nerve"
  ],
  [
    "case.post-thyroidectomy-voice.singer-pitch",
    "node.post-thyroidectomy-voice.singer-pitch.1",
    "question.post-thyroidectomy-voice.laryngeal-examination.v4",
    "concept.post-thyroidectomy-voice.laryngeal-examination"
  ],
  [
    "case.post-thyroidectomy-voice.singer-pitch",
    "node.post-thyroidectomy-voice.singer-pitch.2",
    "question.post-thyroidectomy-voice.external-superior-laryngeal-nerve.v4",
    "concept.post-thyroidectomy-voice.external-superior-laryngeal-nerve"
  ],
  [
    "case.zenker-diverticulum.regurgitated-food",
    "node.zenker-diverticulum.regurgitated-food.1",
    "question.zenker-diverticulum.contrast-swallow.v1",
    "concept.zenker-diverticulum.contrast-swallow"
  ],
  [
    "case.zenker-diverticulum.regurgitated-food",
    "node.zenker-diverticulum.regurgitated-food.2",
    "question.zenker-diverticulum.false-pouch-anatomy.v1",
    "concept.zenker-diverticulum.false-pouch-anatomy"
  ],
  [
    "case.zenker-diverticulum.neck-gurgle",
    "node.zenker-diverticulum.neck-gurgle.1",
    "question.zenker-diverticulum.contrast-swallow.v2",
    "concept.zenker-diverticulum.contrast-swallow"
  ],
  [
    "case.zenker-diverticulum.neck-gurgle",
    "node.zenker-diverticulum.neck-gurgle.2",
    "question.zenker-diverticulum.false-pouch-anatomy.v2",
    "concept.zenker-diverticulum.false-pouch-anatomy"
  ],
  [
    "case.zenker-diverticulum.night-regurgitation",
    "node.zenker-diverticulum.night-regurgitation.1",
    "question.zenker-diverticulum.contrast-swallow.v3",
    "concept.zenker-diverticulum.contrast-swallow"
  ],
  [
    "case.zenker-diverticulum.night-regurgitation",
    "node.zenker-diverticulum.night-regurgitation.2",
    "question.zenker-diverticulum.false-pouch-anatomy.v3",
    "concept.zenker-diverticulum.false-pouch-anatomy"
  ],
  [
    "case.zenker-diverticulum.meal-cough",
    "node.zenker-diverticulum.meal-cough.1",
    "question.zenker-diverticulum.contrast-swallow.v4",
    "concept.zenker-diverticulum.contrast-swallow"
  ],
  [
    "case.zenker-diverticulum.meal-cough",
    "node.zenker-diverticulum.meal-cough.2",
    "question.zenker-diverticulum.false-pouch-anatomy.v4",
    "concept.zenker-diverticulum.false-pouch-anatomy"
  ],
  [
    "case.peripheral-arterial-disease.mail-route",
    "node.peripheral-arterial-disease.mail-route.1",
    "question.peripheral-arterial-disease.resting-abi.v1",
    "concept.peripheral-arterial-disease.resting-abi"
  ],
  [
    "case.peripheral-arterial-disease.mail-route",
    "node.peripheral-arterial-disease.mail-route.2",
    "question.peripheral-arterial-disease.structured-exercise.v1",
    "concept.peripheral-arterial-disease.structured-exercise"
  ],
  [
    "case.peripheral-arterial-disease.warehouse-walk",
    "node.peripheral-arterial-disease.warehouse-walk.1",
    "question.peripheral-arterial-disease.resting-abi.v2",
    "concept.peripheral-arterial-disease.resting-abi"
  ],
  [
    "case.peripheral-arterial-disease.warehouse-walk",
    "node.peripheral-arterial-disease.warehouse-walk.2",
    "question.peripheral-arterial-disease.structured-exercise.v2",
    "concept.peripheral-arterial-disease.structured-exercise"
  ],
  [
    "case.peripheral-arterial-disease.grocery-trip",
    "node.peripheral-arterial-disease.grocery-trip.1",
    "question.peripheral-arterial-disease.resting-abi.v3",
    "concept.peripheral-arterial-disease.resting-abi"
  ],
  [
    "case.peripheral-arterial-disease.grocery-trip",
    "node.peripheral-arterial-disease.grocery-trip.2",
    "question.peripheral-arterial-disease.structured-exercise.v3",
    "concept.peripheral-arterial-disease.structured-exercise"
  ],
  [
    "case.peripheral-arterial-disease.park-walking",
    "node.peripheral-arterial-disease.park-walking.1",
    "question.peripheral-arterial-disease.resting-abi.v4",
    "concept.peripheral-arterial-disease.resting-abi"
  ],
  [
    "case.peripheral-arterial-disease.park-walking",
    "node.peripheral-arterial-disease.park-walking.2",
    "question.peripheral-arterial-disease.structured-exercise.v4",
    "concept.peripheral-arterial-disease.structured-exercise"
  ],
  [
    "case.asymptomatic-phpt.incidental-calcium",
    "node.asymptomatic-phpt.incidental-calcium.1",
    "question.asymptomatic-phpt.three-site-dxa.v1",
    "concept.asymptomatic-phpt.three-site-dxa"
  ],
  [
    "case.asymptomatic-phpt.incidental-calcium",
    "node.asymptomatic-phpt.incidental-calcium.2",
    "question.asymptomatic-phpt.age-based-surgery.v1",
    "concept.asymptomatic-phpt.age-based-surgery"
  ],
  [
    "case.asymptomatic-phpt.employment-screen",
    "node.asymptomatic-phpt.employment-screen.1",
    "question.asymptomatic-phpt.three-site-dxa.v2",
    "concept.asymptomatic-phpt.three-site-dxa"
  ],
  [
    "case.asymptomatic-phpt.employment-screen",
    "node.asymptomatic-phpt.employment-screen.2",
    "question.asymptomatic-phpt.age-based-surgery.v2",
    "concept.asymptomatic-phpt.age-based-surgery"
  ],
  [
    "case.asymptomatic-phpt.family-doctor",
    "node.asymptomatic-phpt.family-doctor.1",
    "question.asymptomatic-phpt.three-site-dxa.v3",
    "concept.asymptomatic-phpt.three-site-dxa"
  ],
  [
    "case.asymptomatic-phpt.family-doctor",
    "node.asymptomatic-phpt.family-doctor.2",
    "question.asymptomatic-phpt.age-based-surgery.v3",
    "concept.asymptomatic-phpt.age-based-surgery"
  ],
  [
    "case.asymptomatic-phpt.annual-physical",
    "node.asymptomatic-phpt.annual-physical.1",
    "question.asymptomatic-phpt.three-site-dxa.v4",
    "concept.asymptomatic-phpt.three-site-dxa"
  ],
  [
    "case.asymptomatic-phpt.annual-physical",
    "node.asymptomatic-phpt.annual-physical.2",
    "question.asymptomatic-phpt.age-based-surgery.v4",
    "concept.asymptomatic-phpt.age-based-surgery"
  ],
  [
    "case.cushing-classification.progressive-features",
    "node.cushing-classification.progressive-features.1",
    "question.cushing.acth-classification.v1",
    "concept.cushing.acth-classification"
  ],
  [
    "case.cushing-classification.progressive-features",
    "node.cushing-classification.progressive-features.2",
    "question.cushing.suppressed-acth-adrenal-imaging.v1",
    "concept.cushing.suppressed-acth-adrenal-imaging"
  ],
  [
    "case.cushing-classification.hypertension-review",
    "node.cushing-classification.hypertension-review.1",
    "question.cushing.acth-classification.v2",
    "concept.cushing.acth-classification"
  ],
  [
    "case.cushing-classification.hypertension-review",
    "node.cushing-classification.hypertension-review.2",
    "question.cushing.suppressed-acth-adrenal-imaging.v2",
    "concept.cushing.suppressed-acth-adrenal-imaging"
  ],
  [
    "case.cushing-classification.bone-health-referral",
    "node.cushing-classification.bone-health-referral.1",
    "question.cushing.acth-classification.v3",
    "concept.cushing.acth-classification"
  ],
  [
    "case.cushing-classification.bone-health-referral",
    "node.cushing-classification.bone-health-referral.2",
    "question.cushing.suppressed-acth-adrenal-imaging.v3",
    "concept.cushing.suppressed-acth-adrenal-imaging"
  ],
  [
    "case.cushing-classification.diabetes-review",
    "node.cushing-classification.diabetes-review.1",
    "question.cushing.acth-classification.v4",
    "concept.cushing.acth-classification"
  ],
  [
    "case.cushing-classification.diabetes-review",
    "node.cushing-classification.diabetes-review.2",
    "question.cushing.suppressed-acth-adrenal-imaging.v4",
    "concept.cushing.suppressed-acth-adrenal-imaging"
  ],
  [
    "case.pancreatic-cyst.incidental-tail",
    "node.pancreatic-cyst.incidental-tail.1",
    "question.pancreatic-cyst.mrcp-duct-assessment.v1",
    "concept.pancreatic-cyst.mrcp-duct-assessment"
  ],
  [
    "case.pancreatic-cyst.incidental-tail",
    "node.pancreatic-cyst.incidental-tail.2",
    "question.pancreatic-cyst.mcn-pattern-recognition.v1",
    "concept.pancreatic-cyst.mcn-pattern-recognition"
  ],
  [
    "case.pancreatic-cyst.body-cyst-followup",
    "node.pancreatic-cyst.body-cyst-followup.1",
    "question.pancreatic-cyst.mrcp-duct-assessment.v2",
    "concept.pancreatic-cyst.mrcp-duct-assessment"
  ],
  [
    "case.pancreatic-cyst.body-cyst-followup",
    "node.pancreatic-cyst.body-cyst-followup.2",
    "question.pancreatic-cyst.mcn-pattern-recognition.v2",
    "concept.pancreatic-cyst.mcn-pattern-recognition"
  ],
  [
    "case.pancreatic-cyst.surveillance-question",
    "node.pancreatic-cyst.surveillance-question.1",
    "question.pancreatic-cyst.mrcp-duct-assessment.v3",
    "concept.pancreatic-cyst.mrcp-duct-assessment"
  ],
  [
    "case.pancreatic-cyst.surveillance-question",
    "node.pancreatic-cyst.surveillance-question.2",
    "question.pancreatic-cyst.mcn-pattern-recognition.v3",
    "concept.pancreatic-cyst.mcn-pattern-recognition"
  ],
  [
    "case.pancreatic-cyst.tail-lesion-review",
    "node.pancreatic-cyst.tail-lesion-review.1",
    "question.pancreatic-cyst.mrcp-duct-assessment.v4",
    "concept.pancreatic-cyst.mrcp-duct-assessment"
  ],
  [
    "case.pancreatic-cyst.tail-lesion-review",
    "node.pancreatic-cyst.tail-lesion-review.2",
    "question.pancreatic-cyst.mcn-pattern-recognition.v4",
    "concept.pancreatic-cyst.mcn-pattern-recognition"
  ],
  [
    "case.colon-cancer.right-colon-referral",
    "node.colon-cancer.right-colon-referral.1",
    "question.colon-cancer.preoperative-cross-sectional-staging.v1.r4",
    "concept.colon-cancer.preoperative-cross-sectional-staging"
  ],
  [
    "case.colon-cancer.right-colon-referral",
    "node.colon-cancer.right-colon-referral.2",
    "question.colon-cancer.oncologic-regional-resection.v1.r3",
    "concept.colon-cancer.oncologic-regional-resection"
  ],
  [
    "case.colon-cancer.sigmoid-referral",
    "node.colon-cancer.sigmoid-referral.1",
    "question.colon-cancer.preoperative-cross-sectional-staging.v2.r5",
    "concept.colon-cancer.preoperative-cross-sectional-staging.v2"
  ],
  [
    "case.colon-cancer.sigmoid-referral",
    "node.colon-cancer.sigmoid-referral.2",
    "question.colon-cancer.oncologic-regional-resection.v2.r3",
    "concept.colon-cancer.oncologic-regional-resection"
  ],
  [
    "case.colon-cancer.transverse-referral",
    "node.colon-cancer.transverse-referral.1",
    "question.colon-cancer.preoperative-cross-sectional-staging.v3.r6",
    "concept.colon-cancer.preoperative-cross-sectional-staging.v2"
  ],
  [
    "case.colon-cancer.transverse-referral",
    "node.colon-cancer.transverse-referral.2",
    "question.colon-cancer.oncologic-regional-resection.v3.r4",
    "concept.colon-cancer.oncologic-regional-resection"
  ],
  [
    "case.colon-cancer.descending-referral",
    "node.colon-cancer.descending-referral.1",
    "question.colon-cancer.preoperative-cross-sectional-staging.v4.r4",
    "concept.colon-cancer.preoperative-cross-sectional-staging"
  ],
  [
    "case.colon-cancer.descending-referral",
    "node.colon-cancer.descending-referral.2",
    "question.colon-cancer.oncologic-regional-resection.v4.r3",
    "concept.colon-cancer.oncologic-regional-resection"
  ],
  [
    "case.rectal-cancer.teacher-followup",
    "node.rectal-cancer.teacher-followup.1",
    "question.rectal-cancer.multimodal-response-assessment.v1",
    "concept.rectal-cancer.multimodal-response-assessment"
  ],
  [
    "case.rectal-cancer.teacher-followup",
    "node.rectal-cancer.teacher-followup.2",
    "question.rectal-cancer.selected-watch-and-wait.v1",
    "concept.rectal-cancer.selected-watch-and-wait"
  ],
  [
    "case.rectal-cancer.caregiver-followup",
    "node.rectal-cancer.caregiver-followup.1",
    "question.rectal-cancer.multimodal-response-assessment.v2",
    "concept.rectal-cancer.multimodal-response-assessment"
  ],
  [
    "case.rectal-cancer.caregiver-followup",
    "node.rectal-cancer.caregiver-followup.2",
    "question.rectal-cancer.selected-watch-and-wait.v2",
    "concept.rectal-cancer.selected-watch-and-wait"
  ],
  [
    "case.rectal-cancer.cyclist-followup",
    "node.rectal-cancer.cyclist-followup.1",
    "question.rectal-cancer.multimodal-response-assessment.v3",
    "concept.rectal-cancer.multimodal-response-assessment"
  ],
  [
    "case.rectal-cancer.cyclist-followup",
    "node.rectal-cancer.cyclist-followup.2",
    "question.rectal-cancer.selected-watch-and-wait.v3",
    "concept.rectal-cancer.selected-watch-and-wait"
  ],
  [
    "case.rectal-cancer.accountant-followup",
    "node.rectal-cancer.accountant-followup.1",
    "question.rectal-cancer.multimodal-response-assessment.v4",
    "concept.rectal-cancer.multimodal-response-assessment"
  ],
  [
    "case.rectal-cancer.accountant-followup",
    "node.rectal-cancer.accountant-followup.2",
    "question.rectal-cancer.selected-watch-and-wait.v4",
    "concept.rectal-cancer.selected-watch-and-wait"
  ],
  [
    "case.carotid-stenosis.retinal-event",
    "node.carotid-stenosis.retinal-event.1",
    "question.carotid-stenosis.confirmatory-vascular-imaging.v1",
    "concept.carotid-stenosis.confirmatory-vascular-imaging"
  ],
  [
    "case.carotid-stenosis.retinal-event",
    "node.carotid-stenosis.retinal-event.2",
    "question.carotid-stenosis.symptomatic-endarterectomy-selection.v1",
    "concept.carotid-stenosis.symptomatic-endarterectomy-selection"
  ],
  [
    "case.carotid-stenosis.hand-weakness",
    "node.carotid-stenosis.hand-weakness.1",
    "question.carotid-stenosis.confirmatory-vascular-imaging.v2",
    "concept.carotid-stenosis.confirmatory-vascular-imaging"
  ],
  [
    "case.carotid-stenosis.hand-weakness",
    "node.carotid-stenosis.hand-weakness.2",
    "question.carotid-stenosis.symptomatic-endarterectomy-selection.v2",
    "concept.carotid-stenosis.symptomatic-endarterectomy-selection"
  ],
  [
    "case.carotid-stenosis.speech-event",
    "node.carotid-stenosis.speech-event.1",
    "question.carotid-stenosis.confirmatory-vascular-imaging.v3",
    "concept.carotid-stenosis.confirmatory-vascular-imaging"
  ],
  [
    "case.carotid-stenosis.speech-event",
    "node.carotid-stenosis.speech-event.2",
    "question.carotid-stenosis.symptomatic-endarterectomy-selection.v3",
    "concept.carotid-stenosis.symptomatic-endarterectomy-selection"
  ],
  [
    "case.carotid-stenosis.curtain-vision",
    "node.carotid-stenosis.curtain-vision.1",
    "question.carotid-stenosis.confirmatory-vascular-imaging.v4",
    "concept.carotid-stenosis.confirmatory-vascular-imaging"
  ],
  [
    "case.carotid-stenosis.curtain-vision",
    "node.carotid-stenosis.curtain-vision.2",
    "question.carotid-stenosis.symptomatic-endarterectomy-selection.v4",
    "concept.carotid-stenosis.symptomatic-endarterectomy-selection"
  ],
  [
    "case.fap.new-parent",
    "node.fap.new-parent.1",
    "question.fap.germline-testing-after-diffuse-adenomas.v1",
    "concept.fap.germline-testing-after-diffuse-adenomas"
  ],
  [
    "case.fap.new-parent",
    "node.fap.new-parent.2",
    "question.fap.ipaa-for-uncontrolled-rectal-burden.v1",
    "concept.fap.ipaa-for-uncontrolled-rectal-burden"
  ],
  [
    "case.fap.sibling-history",
    "node.fap.sibling-history.1",
    "question.fap.germline-testing-after-diffuse-adenomas.v2",
    "concept.fap.germline-testing-after-diffuse-adenomas"
  ],
  [
    "case.fap.sibling-history",
    "node.fap.sibling-history.2",
    "question.fap.ipaa-for-uncontrolled-rectal-burden.v2",
    "concept.fap.ipaa-for-uncontrolled-rectal-burden"
  ],
  [
    "case.fap.screening-call",
    "node.fap.screening-call.1",
    "question.fap.germline-testing-after-diffuse-adenomas.v3",
    "concept.fap.germline-testing-after-diffuse-adenomas"
  ],
  [
    "case.fap.screening-call",
    "node.fap.screening-call.2",
    "question.fap.ipaa-for-uncontrolled-rectal-burden.v3",
    "concept.fap.ipaa-for-uncontrolled-rectal-burden"
  ],
  [
    "case.fap.rectal-burden",
    "node.fap.rectal-burden.1",
    "question.fap.germline-testing-after-diffuse-adenomas.v4",
    "concept.fap.germline-testing-after-diffuse-adenomas"
  ],
  [
    "case.fap.rectal-burden",
    "node.fap.rectal-burden.2",
    "question.fap.ipaa-for-uncontrolled-rectal-burden.v4",
    "concept.fap.ipaa-for-uncontrolled-rectal-burden"
  ],
  [
    "case.complex-perianal-fistula.recurrent-drainage",
    "node.complex-perianal-fistula.recurrent-drainage.1",
    "question.complex-perianal-fistula.mri-mapping.v1",
    "concept.complex-perianal-fistula.mri-mapping"
  ],
  [
    "case.complex-perianal-fistula.recurrent-drainage",
    "node.complex-perianal-fistula.recurrent-drainage.2",
    "question.complex-perianal-fistula.loose-seton-staged-planning.v1",
    "concept.complex-perianal-fistula.loose-seton-staged-planning"
  ],
  [
    "case.complex-perianal-fistula.branching-tract",
    "node.complex-perianal-fistula.branching-tract.1",
    "question.complex-perianal-fistula.mri-mapping.v2",
    "concept.complex-perianal-fistula.mri-mapping"
  ],
  [
    "case.complex-perianal-fistula.branching-tract",
    "node.complex-perianal-fistula.branching-tract.2",
    "question.complex-perianal-fistula.loose-seton-staged-planning.v2",
    "concept.complex-perianal-fistula.loose-seton-staged-planning"
  ],
  [
    "case.complex-perianal-fistula.sphincter-risk",
    "node.complex-perianal-fistula.sphincter-risk.1",
    "question.complex-perianal-fistula.mri-mapping.v3",
    "concept.complex-perianal-fistula.mri-mapping"
  ],
  [
    "case.complex-perianal-fistula.sphincter-risk",
    "node.complex-perianal-fistula.sphincter-risk.2",
    "question.complex-perianal-fistula.loose-seton-staged-planning.v3",
    "concept.complex-perianal-fistula.loose-seton-staged-planning"
  ],
  [
    "case.complex-perianal-fistula.multiple-openings",
    "node.complex-perianal-fistula.multiple-openings.1",
    "question.complex-perianal-fistula.mri-mapping.v4",
    "concept.complex-perianal-fistula.mri-mapping"
  ],
  [
    "case.complex-perianal-fistula.multiple-openings",
    "node.complex-perianal-fistula.multiple-openings.2",
    "question.complex-perianal-fistula.loose-seton-staged-planning.v4",
    "concept.complex-perianal-fistula.loose-seton-staged-planning"
  ],
  [
    "case.recovered-diverticulitis.drained-abscess",
    "node.recovered-diverticulitis.drained-abscess.1",
    "question.recovered-diverticulitis.interval-colonoscopy.v1",
    "concept.recovered-diverticulitis.interval-colonoscopy"
  ],
  [
    "case.recovered-diverticulitis.drained-abscess",
    "node.recovered-diverticulitis.drained-abscess.2",
    "question.recovered-diverticulitis.shared-elective-sigmoid-discussion.v1",
    "concept.recovered-diverticulitis.shared-elective-sigmoid-discussion"
  ],
  [
    "case.recovered-diverticulitis.hospital-followup",
    "node.recovered-diverticulitis.hospital-followup.1",
    "question.recovered-diverticulitis.interval-colonoscopy.v2",
    "concept.recovered-diverticulitis.interval-colonoscopy"
  ],
  [
    "case.recovered-diverticulitis.hospital-followup",
    "node.recovered-diverticulitis.hospital-followup.2",
    "question.recovered-diverticulitis.shared-elective-sigmoid-discussion.v2",
    "concept.recovered-diverticulitis.shared-elective-sigmoid-discussion"
  ],
  [
    "case.recovered-diverticulitis.ct-resolved",
    "node.recovered-diverticulitis.ct-resolved.1",
    "question.recovered-diverticulitis.interval-colonoscopy.v3",
    "concept.recovered-diverticulitis.interval-colonoscopy"
  ],
  [
    "case.recovered-diverticulitis.ct-resolved",
    "node.recovered-diverticulitis.ct-resolved.2",
    "question.recovered-diverticulitis.shared-elective-sigmoid-discussion.v3",
    "concept.recovered-diverticulitis.shared-elective-sigmoid-discussion"
  ],
  [
    "case.recovered-diverticulitis.recovery-visit",
    "node.recovered-diverticulitis.recovery-visit.1",
    "question.recovered-diverticulitis.interval-colonoscopy.v4",
    "concept.recovered-diverticulitis.interval-colonoscopy"
  ],
  [
    "case.recovered-diverticulitis.recovery-visit",
    "node.recovered-diverticulitis.recovery-visit.2",
    "question.recovered-diverticulitis.shared-elective-sigmoid-discussion.v4",
    "concept.recovered-diverticulitis.shared-elective-sigmoid-discussion"
  ],
  [
    "case.anal-squamous-cell-cancer.bleeding-lesion",
    "node.anal-squamous-cell-cancer.bleeding-lesion.1",
    "question.anal-scc.biopsy-and-staging.v1",
    "concept.anal-scc.biopsy-and-staging"
  ],
  [
    "case.anal-squamous-cell-cancer.bleeding-lesion",
    "node.anal-squamous-cell-cancer.bleeding-lesion.2",
    "question.anal-scc.localized-chemoradiation-referral.v1",
    "concept.anal-scc.localized-chemoradiation-referral"
  ],
  [
    "case.anal-squamous-cell-cancer.new-mass",
    "node.anal-squamous-cell-cancer.new-mass.1",
    "question.anal-scc.biopsy-and-staging.v2",
    "concept.anal-scc.biopsy-and-staging"
  ],
  [
    "case.anal-squamous-cell-cancer.new-mass",
    "node.anal-squamous-cell-cancer.new-mass.2",
    "question.anal-scc.localized-chemoradiation-referral.v2",
    "concept.anal-scc.localized-chemoradiation-referral"
  ],
  [
    "case.anal-squamous-cell-cancer.clinic-exam",
    "node.anal-squamous-cell-cancer.clinic-exam.1",
    "question.anal-scc.biopsy-and-staging.v3",
    "concept.anal-scc.biopsy-and-staging"
  ],
  [
    "case.anal-squamous-cell-cancer.clinic-exam",
    "node.anal-squamous-cell-cancer.clinic-exam.2",
    "question.anal-scc.localized-chemoradiation-referral.v3",
    "concept.anal-scc.localized-chemoradiation-referral"
  ],
  [
    "case.anal-squamous-cell-cancer.persistent-ulcer",
    "node.anal-squamous-cell-cancer.persistent-ulcer.1",
    "question.anal-scc.biopsy-and-staging.v4",
    "concept.anal-scc.biopsy-and-staging"
  ],
  [
    "case.anal-squamous-cell-cancer.persistent-ulcer",
    "node.anal-squamous-cell-cancer.persistent-ulcer.2",
    "question.anal-scc.localized-chemoradiation-referral.v4",
    "concept.anal-scc.localized-chemoradiation-referral"
  ],
  [
    "case.postoperative-dvt.colectomy",
    "node.postoperative-dvt.colectomy.1",
    "question.postoperative-dvt.venous-duplex.v1",
    "concept.postoperative-dvt.venous-duplex"
  ],
  [
    "case.postoperative-dvt.colectomy",
    "node.postoperative-dvt.colectomy.2",
    "question.postoperative-dvt.three-month-anticoagulation.v1",
    "concept.postoperative-dvt.three-month-anticoagulation"
  ],
  [
    "case.postoperative-dvt.hernia-repair",
    "node.postoperative-dvt.hernia-repair.1",
    "question.postoperative-dvt.venous-duplex.v2",
    "concept.postoperative-dvt.venous-duplex"
  ],
  [
    "case.postoperative-dvt.hernia-repair",
    "node.postoperative-dvt.hernia-repair.2",
    "question.postoperative-dvt.three-month-anticoagulation.v2",
    "concept.postoperative-dvt.three-month-anticoagulation"
  ],
  [
    "case.postoperative-dvt.bowel-surgery",
    "node.postoperative-dvt.bowel-surgery.1",
    "question.postoperative-dvt.venous-duplex.v3",
    "concept.postoperative-dvt.venous-duplex"
  ],
  [
    "case.postoperative-dvt.bowel-surgery",
    "node.postoperative-dvt.bowel-surgery.2",
    "question.postoperative-dvt.three-month-anticoagulation.v3",
    "concept.postoperative-dvt.three-month-anticoagulation"
  ],
  [
    "case.postoperative-dvt.postop-visit",
    "node.postoperative-dvt.postop-visit.1",
    "question.postoperative-dvt.venous-duplex.v4",
    "concept.postoperative-dvt.venous-duplex"
  ],
  [
    "case.postoperative-dvt.postop-visit",
    "node.postoperative-dvt.postop-visit.2",
    "question.postoperative-dvt.three-month-anticoagulation.v4",
    "concept.postoperative-dvt.three-month-anticoagulation"
  ],
  [
    "case.persistent-itp.four-month",
    "node.persistent-itp.four-month.1",
    "question.persistent-itp.hiv-hcv-secondary-evaluation.v1",
    "concept.persistent-itp.hiv-hcv-secondary-evaluation"
  ],
  [
    "case.persistent-itp.four-month",
    "node.persistent-itp.four-month.2",
    "question.persistent-itp.defer-elective-splenectomy.v1",
    "concept.persistent-itp.defer-elective-splenectomy"
  ],
  [
    "case.persistent-itp.six-month",
    "node.persistent-itp.six-month.1",
    "question.persistent-itp.hiv-hcv-secondary-evaluation.v2",
    "concept.persistent-itp.hiv-hcv-secondary-evaluation"
  ],
  [
    "case.persistent-itp.six-month",
    "node.persistent-itp.six-month.2",
    "question.persistent-itp.defer-elective-splenectomy.v2",
    "concept.persistent-itp.defer-elective-splenectomy"
  ],
  [
    "case.persistent-itp.hematology-followup",
    "node.persistent-itp.hematology-followup.1",
    "question.persistent-itp.hiv-hcv-secondary-evaluation.v3",
    "concept.persistent-itp.hiv-hcv-secondary-evaluation"
  ],
  [
    "case.persistent-itp.hematology-followup",
    "node.persistent-itp.hematology-followup.2",
    "question.persistent-itp.defer-elective-splenectomy.v3",
    "concept.persistent-itp.defer-elective-splenectomy"
  ],
  [
    "case.persistent-itp.stable-count",
    "node.persistent-itp.stable-count.1",
    "question.persistent-itp.hiv-hcv-secondary-evaluation.v4",
    "concept.persistent-itp.hiv-hcv-secondary-evaluation"
  ],
  [
    "case.persistent-itp.stable-count",
    "node.persistent-itp.stable-count.2",
    "question.persistent-itp.defer-elective-splenectomy.v4",
    "concept.persistent-itp.defer-elective-splenectomy"
  ],
  [
    "case.gastric-gist.posterior-fundus-mass",
    "node.gastric-gist.posterior-fundus-mass.1",
    "question.gastric-gist.eus-core-molecular-diagnosis.v1",
    "concept.gastric-gist.eus-core-molecular-diagnosis"
  ],
  [
    "case.gastric-gist.posterior-fundus-mass",
    "node.gastric-gist.posterior-fundus-mass.2",
    "question.gastric-gist.mutation-guided-neoadjuvant-imatinib.v1",
    "concept.gastric-gist.mutation-guided-neoadjuvant-imatinib"
  ],
  [
    "case.gastric-gist.cardia-mass",
    "node.gastric-gist.cardia-mass.1",
    "question.gastric-gist.eus-core-molecular-diagnosis.v2",
    "concept.gastric-gist.eus-core-molecular-diagnosis"
  ],
  [
    "case.gastric-gist.cardia-mass",
    "node.gastric-gist.cardia-mass.2",
    "question.gastric-gist.mutation-guided-neoadjuvant-imatinib.v2",
    "concept.gastric-gist.mutation-guided-neoadjuvant-imatinib"
  ],
  [
    "case.gastric-gist.greater-curve-mass",
    "node.gastric-gist.greater-curve-mass.1",
    "question.gastric-gist.eus-core-molecular-diagnosis.v3",
    "concept.gastric-gist.eus-core-molecular-diagnosis"
  ],
  [
    "case.gastric-gist.greater-curve-mass",
    "node.gastric-gist.greater-curve-mass.2",
    "question.gastric-gist.mutation-guided-neoadjuvant-imatinib.v3",
    "concept.gastric-gist.mutation-guided-neoadjuvant-imatinib"
  ],
  [
    "case.gastric-gist.lesser-curve-mass",
    "node.gastric-gist.lesser-curve-mass.1",
    "question.gastric-gist.eus-core-molecular-diagnosis.v4",
    "concept.gastric-gist.eus-core-molecular-diagnosis"
  ],
  [
    "case.gastric-gist.lesser-curve-mass",
    "node.gastric-gist.lesser-curve-mass.2",
    "question.gastric-gist.mutation-guided-neoadjuvant-imatinib.v4",
    "concept.gastric-gist.mutation-guided-neoadjuvant-imatinib"
  ],
  [
    "case.hepatic-adenoma.hormone-exposure",
    "node.hepatic-adenoma.hormone-exposure.1",
    "question.hepatic-adenoma.multiphasic-mri-characterization.v1",
    "concept.hepatic-adenoma.multiphasic-mri-characterization"
  ],
  [
    "case.hepatic-adenoma.hormone-exposure",
    "node.hepatic-adenoma.hormone-exposure.2",
    "question.hepatic-adenoma.resection-in-men.v1",
    "concept.hepatic-adenoma.resection-in-men"
  ],
  [
    "case.hepatic-adenoma.metabolic-risk",
    "node.hepatic-adenoma.metabolic-risk.1",
    "question.hepatic-adenoma.multiphasic-mri-characterization.v2",
    "concept.hepatic-adenoma.multiphasic-mri-characterization"
  ],
  [
    "case.hepatic-adenoma.metabolic-risk",
    "node.hepatic-adenoma.metabolic-risk.2",
    "question.hepatic-adenoma.resection-in-men.v2",
    "concept.hepatic-adenoma.resection-in-men"
  ],
  [
    "case.hepatic-adenoma.right-upper-pressure",
    "node.hepatic-adenoma.right-upper-pressure.1",
    "question.hepatic-adenoma.multiphasic-mri-characterization.v3",
    "concept.hepatic-adenoma.multiphasic-mri-characterization"
  ],
  [
    "case.hepatic-adenoma.right-upper-pressure",
    "node.hepatic-adenoma.right-upper-pressure.2",
    "question.hepatic-adenoma.resection-in-men.v3",
    "concept.hepatic-adenoma.resection-in-men"
  ],
  [
    "case.hepatic-adenoma.incidental-lesion",
    "node.hepatic-adenoma.incidental-lesion.1",
    "question.hepatic-adenoma.multiphasic-mri-characterization.v4",
    "concept.hepatic-adenoma.multiphasic-mri-characterization"
  ],
  [
    "case.hepatic-adenoma.incidental-lesion",
    "node.hepatic-adenoma.incidental-lesion.2",
    "question.hepatic-adenoma.resection-in-men.v4",
    "concept.hepatic-adenoma.resection-in-men"
  ],
  [
    "case.chronic-mesenteric-ischemia.meal-pain",
    "node.chronic-mesenteric-ischemia.meal-pain.1",
    "question.chronic-mesenteric-ischemia.cta-diagnosis.v1",
    "concept.chronic-mesenteric-ischemia.cta-diagnosis"
  ],
  [
    "case.chronic-mesenteric-ischemia.meal-pain",
    "node.chronic-mesenteric-ischemia.meal-pain.2",
    "question.chronic-mesenteric-ischemia.revascularization-referral.v1",
    "concept.chronic-mesenteric-ischemia.revascularization-referral"
  ],
  [
    "case.chronic-mesenteric-ischemia.small-meals",
    "node.chronic-mesenteric-ischemia.small-meals.1",
    "question.chronic-mesenteric-ischemia.cta-diagnosis.v2",
    "concept.chronic-mesenteric-ischemia.cta-diagnosis"
  ],
  [
    "case.chronic-mesenteric-ischemia.small-meals",
    "node.chronic-mesenteric-ischemia.small-meals.2",
    "question.chronic-mesenteric-ischemia.revascularization-referral.v2",
    "concept.chronic-mesenteric-ischemia.revascularization-referral"
  ],
  [
    "case.chronic-mesenteric-ischemia.restaurant-pain",
    "node.chronic-mesenteric-ischemia.restaurant-pain.1",
    "question.chronic-mesenteric-ischemia.cta-diagnosis.v3",
    "concept.chronic-mesenteric-ischemia.cta-diagnosis"
  ],
  [
    "case.chronic-mesenteric-ischemia.restaurant-pain",
    "node.chronic-mesenteric-ischemia.restaurant-pain.2",
    "question.chronic-mesenteric-ischemia.revascularization-referral.v3",
    "concept.chronic-mesenteric-ischemia.revascularization-referral"
  ],
  [
    "case.chronic-mesenteric-ischemia.food-fear",
    "node.chronic-mesenteric-ischemia.food-fear.1",
    "question.chronic-mesenteric-ischemia.cta-diagnosis.v4",
    "concept.chronic-mesenteric-ischemia.cta-diagnosis"
  ],
  [
    "case.chronic-mesenteric-ischemia.food-fear",
    "node.chronic-mesenteric-ischemia.food-fear.2",
    "question.chronic-mesenteric-ischemia.revascularization-referral.v4",
    "concept.chronic-mesenteric-ischemia.revascularization-referral"
  ],
  [
    "case.primary-aldosteronism.resistant-three-drugs",
    "node.primary-aldosteronism.resistant-three-drugs.1",
    "question.primary-aldosteronism.prepared-arr-screening.v1",
    "concept.primary-aldosteronism.prepared-arr-screening"
  ],
  [
    "case.primary-aldosteronism.resistant-three-drugs",
    "node.primary-aldosteronism.resistant-three-drugs.2",
    "question.primary-aldosteronism.ct-avs-lateralization.v1",
    "concept.primary-aldosteronism.ct-avs-lateralization"
  ],
  [
    "case.primary-aldosteronism.early-stroke-risk",
    "node.primary-aldosteronism.early-stroke-risk.1",
    "question.primary-aldosteronism.prepared-arr-screening.v2",
    "concept.primary-aldosteronism.prepared-arr-screening"
  ],
  [
    "case.primary-aldosteronism.early-stroke-risk",
    "node.primary-aldosteronism.early-stroke-risk.2",
    "question.primary-aldosteronism.ct-avs-lateralization.v2",
    "concept.primary-aldosteronism.ct-avs-lateralization"
  ],
  [
    "case.primary-aldosteronism.headache-free",
    "node.primary-aldosteronism.headache-free.1",
    "question.primary-aldosteronism.prepared-arr-screening.v3",
    "concept.primary-aldosteronism.prepared-arr-screening"
  ],
  [
    "case.primary-aldosteronism.headache-free",
    "node.primary-aldosteronism.headache-free.2",
    "question.primary-aldosteronism.ct-avs-lateralization.v3",
    "concept.primary-aldosteronism.ct-avs-lateralization"
  ],
  [
    "case.primary-aldosteronism.family-pressure",
    "node.primary-aldosteronism.family-pressure.1",
    "question.primary-aldosteronism.prepared-arr-screening.v4",
    "concept.primary-aldosteronism.prepared-arr-screening"
  ],
  [
    "case.primary-aldosteronism.family-pressure",
    "node.primary-aldosteronism.family-pressure.2",
    "question.primary-aldosteronism.ct-avs-lateralization.v4",
    "concept.primary-aldosteronism.ct-avs-lateralization"
  ],
  [
    "case.choledocholithiasis.episodic-pain",
    "node.choledocholithiasis.episodic-pain.1",
    "question.choledocholithiasis.intermediate-mrcp.v1",
    "concept.choledocholithiasis.intermediate-mrcp"
  ],
  [
    "case.choledocholithiasis.episodic-pain",
    "node.choledocholithiasis.episodic-pain.2",
    "question.choledocholithiasis.confirmed-stone-therapy.v1",
    "concept.choledocholithiasis.confirmed-stone-therapy"
  ],
  [
    "case.choledocholithiasis.abnormal-labs",
    "node.choledocholithiasis.abnormal-labs.1",
    "question.choledocholithiasis.intermediate-mrcp.v2",
    "concept.choledocholithiasis.intermediate-mrcp"
  ],
  [
    "case.choledocholithiasis.abnormal-labs",
    "node.choledocholithiasis.abnormal-labs.2",
    "question.choledocholithiasis.confirmed-stone-therapy.v2",
    "concept.choledocholithiasis.confirmed-stone-therapy"
  ],
  [
    "case.choledocholithiasis.dilated-duct",
    "node.choledocholithiasis.dilated-duct.1",
    "question.choledocholithiasis.intermediate-mrcp.v3",
    "concept.choledocholithiasis.intermediate-mrcp"
  ],
  [
    "case.choledocholithiasis.dilated-duct",
    "node.choledocholithiasis.dilated-duct.2",
    "question.choledocholithiasis.confirmed-stone-therapy.v3",
    "concept.choledocholithiasis.confirmed-stone-therapy"
  ],
  [
    "case.choledocholithiasis.resolved-colic",
    "node.choledocholithiasis.resolved-colic.1",
    "question.choledocholithiasis.intermediate-mrcp.v4",
    "concept.choledocholithiasis.intermediate-mrcp"
  ],
  [
    "case.choledocholithiasis.resolved-colic",
    "node.choledocholithiasis.resolved-colic.2",
    "question.choledocholithiasis.confirmed-stone-therapy.v4",
    "concept.choledocholithiasis.confirmed-stone-therapy"
  ],
  [
    "case.post-cholecystectomy-bile-leak.drain-output",
    "node.post-cholecystectomy-bile-leak.drain-output.1",
    "question.bile-leak.hepatobiliary-contrast-mrcp.v1",
    "concept.bile-leak.hepatobiliary-contrast-mrcp"
  ],
  [
    "case.post-cholecystectomy-bile-leak.drain-output",
    "node.post-cholecystectomy-bile-leak.drain-output.2",
    "question.bile-leak.minor-leak-ercp-stent.v1",
    "concept.bile-leak.minor-leak-ercp-stent"
  ],
  [
    "case.post-cholecystectomy-bile-leak.painful-recovery",
    "node.post-cholecystectomy-bile-leak.painful-recovery.1",
    "question.bile-leak.hepatobiliary-contrast-mrcp.v2",
    "concept.bile-leak.hepatobiliary-contrast-mrcp"
  ],
  [
    "case.post-cholecystectomy-bile-leak.painful-recovery",
    "node.post-cholecystectomy-bile-leak.painful-recovery.2",
    "question.bile-leak.minor-leak-ercp-stent.v2",
    "concept.bile-leak.minor-leak-ercp-stent"
  ],
  [
    "case.post-cholecystectomy-bile-leak.delayed-recovery",
    "node.post-cholecystectomy-bile-leak.delayed-recovery.1",
    "question.bile-leak.hepatobiliary-contrast-mrcp.v3",
    "concept.bile-leak.hepatobiliary-contrast-mrcp"
  ],
  [
    "case.post-cholecystectomy-bile-leak.delayed-recovery",
    "node.post-cholecystectomy-bile-leak.delayed-recovery.2",
    "question.bile-leak.minor-leak-ercp-stent.v3",
    "concept.bile-leak.minor-leak-ercp-stent"
  ],
  [
    "case.post-cholecystectomy-bile-leak.outside-followup",
    "node.post-cholecystectomy-bile-leak.outside-followup.1",
    "question.bile-leak.hepatobiliary-contrast-mrcp.v4",
    "concept.bile-leak.hepatobiliary-contrast-mrcp"
  ],
  [
    "case.post-cholecystectomy-bile-leak.outside-followup",
    "node.post-cholecystectomy-bile-leak.outside-followup.2",
    "question.bile-leak.minor-leak-ercp-stent.v4",
    "concept.bile-leak.minor-leak-ercp-stent"
  ],
  [
    "case.pancreatic-pseudocyst.early-satiety",
    "node.pancreatic-pseudocyst.early-satiety.1",
    "question.pseudocyst.contrast-ct-characterization.v1.r5",
    "concept.pseudocyst.contrast-ct-characterization.v2"
  ],
  [
    "case.pancreatic-pseudocyst.early-satiety",
    "node.pancreatic-pseudocyst.early-satiety.2",
    "question.pseudocyst.symptomatic-endoscopic-drainage.v1.r5",
    "concept.pseudocyst.symptomatic-endoscopic-drainage.v2"
  ],
  [
    "case.pancreatic-pseudocyst.postmeal-vomiting",
    "node.pancreatic-pseudocyst.postmeal-vomiting.1",
    "question.pseudocyst.contrast-ct-characterization.v2.r5",
    "concept.pseudocyst.contrast-ct-characterization.v2"
  ],
  [
    "case.pancreatic-pseudocyst.postmeal-vomiting",
    "node.pancreatic-pseudocyst.postmeal-vomiting.2",
    "question.pseudocyst.symptomatic-endoscopic-drainage.v2.r4",
    "concept.pseudocyst.symptomatic-endoscopic-drainage.v2"
  ],
  [
    "case.pancreatic-pseudocyst.persistent-pain",
    "node.pancreatic-pseudocyst.persistent-pain.1",
    "question.pseudocyst.contrast-ct-characterization.v3.r5",
    "concept.pseudocyst.contrast-ct-characterization.v2"
  ],
  [
    "case.pancreatic-pseudocyst.persistent-pain",
    "node.pancreatic-pseudocyst.persistent-pain.2",
    "question.pseudocyst.symptomatic-endoscopic-drainage.v3.r4",
    "concept.pseudocyst.symptomatic-endoscopic-drainage.v2"
  ],
  [
    "case.pancreatic-pseudocyst.reduced-intake",
    "node.pancreatic-pseudocyst.reduced-intake.1",
    "question.pseudocyst.contrast-ct-characterization.v4.r5",
    "concept.pseudocyst.contrast-ct-characterization.v2"
  ],
  [
    "case.pancreatic-pseudocyst.reduced-intake",
    "node.pancreatic-pseudocyst.reduced-intake.2",
    "question.pseudocyst.symptomatic-endoscopic-drainage.v4.r4",
    "concept.pseudocyst.symptomatic-endoscopic-drainage.v2"
  ],
  [
    "case.preoperative-gerd.persistent-heartburn",
    "node.preoperative-gerd.persistent-heartburn.1",
    "question.gerd.off-ppi-reflux-monitoring.v1",
    "concept.gerd.off-ppi-reflux-monitoring"
  ],
  [
    "case.preoperative-gerd.persistent-heartburn",
    "node.preoperative-gerd.persistent-heartburn.2",
    "question.gerd.hrm-before-operative-planning.v1",
    "concept.gerd.hrm-before-operative-planning"
  ],
  [
    "case.preoperative-gerd.night-reflux",
    "node.preoperative-gerd.night-reflux.1",
    "question.gerd.off-ppi-reflux-monitoring.v2",
    "concept.gerd.off-ppi-reflux-monitoring"
  ],
  [
    "case.preoperative-gerd.night-reflux",
    "node.preoperative-gerd.night-reflux.2",
    "question.gerd.hrm-before-operative-planning.v2",
    "concept.gerd.hrm-before-operative-planning"
  ],
  [
    "case.preoperative-gerd.medication-concerns",
    "node.preoperative-gerd.medication-concerns.1",
    "question.gerd.off-ppi-reflux-monitoring.v3",
    "concept.gerd.off-ppi-reflux-monitoring"
  ],
  [
    "case.preoperative-gerd.medication-concerns",
    "node.preoperative-gerd.medication-concerns.2",
    "question.gerd.hrm-before-operative-planning.v3",
    "concept.gerd.hrm-before-operative-planning"
  ],
  [
    "case.preoperative-gerd.reflux-referral",
    "node.preoperative-gerd.reflux-referral.1",
    "question.gerd.off-ppi-reflux-monitoring.v4",
    "concept.gerd.off-ppi-reflux-monitoring"
  ],
  [
    "case.preoperative-gerd.reflux-referral",
    "node.preoperative-gerd.reflux-referral.2",
    "question.gerd.hrm-before-operative-planning.v4",
    "concept.gerd.hrm-before-operative-planning"
  ],
  [
    "case.post-bariatric-hypoglycemia.postmeal-shaking",
    "node.post-bariatric-hypoglycemia.postmeal-shaking.1",
    "question.pbh.completed-whipple-triad.v1",
    "concept.pbh.completed-whipple-triad"
  ],
  [
    "case.post-bariatric-hypoglycemia.postmeal-confusion",
    "node.post-bariatric-hypoglycemia.postmeal-confusion.1",
    "question.pbh.completed-whipple-triad.v2",
    "concept.pbh.completed-whipple-triad"
  ],
  [
    "case.post-bariatric-hypoglycemia.postmeal-weakness",
    "node.post-bariatric-hypoglycemia.postmeal-weakness.1",
    "question.pbh.completed-whipple-triad.v3",
    "concept.pbh.completed-whipple-triad"
  ],
  [
    "case.post-bariatric-hypoglycemia.postmeal-dizziness",
    "node.post-bariatric-hypoglycemia.postmeal-dizziness.1",
    "question.pbh.completed-whipple-triad.v4",
    "concept.pbh.completed-whipple-triad"
  ],
  [
    "case.post-bariatric-hypoglycemia.diet-first",
    "node.post-bariatric-hypoglycemia.diet-first.1",
    "question.pbh.initial-dietary-care.v1",
    "concept.pbh.initial-dietary-care"
  ],
  [
    "case.post-bariatric-hypoglycemia.meal-planning",
    "node.post-bariatric-hypoglycemia.meal-planning.1",
    "question.pbh.initial-dietary-care.v2",
    "concept.pbh.initial-dietary-care"
  ],
  [
    "case.post-bariatric-hypoglycemia.nutrition-referral",
    "node.post-bariatric-hypoglycemia.nutrition-referral.1",
    "question.pbh.initial-dietary-care.v3",
    "concept.pbh.initial-dietary-care"
  ],
  [
    "case.post-bariatric-hypoglycemia.recurrent-episodes",
    "node.post-bariatric-hypoglycemia.recurrent-episodes.1",
    "question.pbh.initial-dietary-care.v4",
    "concept.pbh.initial-dietary-care"
  ],
  [
    "case.lynch-tumor.new-diagnosis",
    "node.lynch-tumor.new-diagnosis.1",
    "question.lynch-tumor.universal-mmr-screening.v1",
    "concept.lynch-tumor.universal-mmr-screening"
  ],
  [
    "case.lynch-tumor.new-diagnosis",
    "node.lynch-tumor.new-diagnosis.2",
    "question.lynch-tumor.germline-counseling-after-suggestive-ihc.v1",
    "concept.lynch-tumor.germline-counseling-after-suggestive-ihc"
  ],
  [
    "case.lynch-tumor.resection-review",
    "node.lynch-tumor.resection-review.1",
    "question.lynch-tumor.universal-mmr-screening.v2",
    "concept.lynch-tumor.universal-mmr-screening"
  ],
  [
    "case.lynch-tumor.resection-review",
    "node.lynch-tumor.resection-review.2",
    "question.lynch-tumor.germline-counseling-after-suggestive-ihc.v2",
    "concept.lynch-tumor.germline-counseling-after-suggestive-ihc"
  ],
  [
    "case.lynch-tumor.oncology-visit",
    "node.lynch-tumor.oncology-visit.1",
    "question.lynch-tumor.universal-mmr-screening.v3",
    "concept.lynch-tumor.universal-mmr-screening"
  ],
  [
    "case.lynch-tumor.oncology-visit",
    "node.lynch-tumor.oncology-visit.2",
    "question.lynch-tumor.germline-counseling-after-suggestive-ihc.v3",
    "concept.lynch-tumor.germline-counseling-after-suggestive-ihc"
  ],
  [
    "case.lynch-tumor.family-history",
    "node.lynch-tumor.family-history.1",
    "question.lynch-tumor.universal-mmr-screening.v4",
    "concept.lynch-tumor.universal-mmr-screening"
  ],
  [
    "case.lynch-tumor.family-history",
    "node.lynch-tumor.family-history.2",
    "question.lynch-tumor.germline-counseling-after-suggestive-ihc.v4",
    "concept.lynch-tumor.germline-counseling-after-suggestive-ihc"
  ],
  [
    "case.chronic-anal-fissure.painful-stools",
    "node.chronic-anal-fissure.painful-stools.1",
    "question.chronic-anal-fissure.topical-calcium-channel-blocker.v1",
    "concept.chronic-anal-fissure.topical-calcium-channel-blocker"
  ],
  [
    "case.chronic-anal-fissure.rectal-pain",
    "node.chronic-anal-fissure.rectal-pain.1",
    "question.chronic-anal-fissure.topical-calcium-channel-blocker.v2",
    "concept.chronic-anal-fissure.topical-calcium-channel-blocker"
  ],
  [
    "case.chronic-anal-fissure.chronic-tear",
    "node.chronic-anal-fissure.chronic-tear.1",
    "question.chronic-anal-fissure.topical-calcium-channel-blocker.v3",
    "concept.chronic-anal-fissure.topical-calcium-channel-blocker"
  ],
  [
    "case.chronic-anal-fissure.bleeding-pain",
    "node.chronic-anal-fissure.bleeding-pain.1",
    "question.chronic-anal-fissure.topical-calcium-channel-blocker.v4",
    "concept.chronic-anal-fissure.topical-calcium-channel-blocker"
  ],
  [
    "case.chronic-anal-fissure.ccb-trial",
    "node.chronic-anal-fissure.ccb-trial.1",
    "question.chronic-anal-fissure.lis-after-medical-treatment.v1",
    "concept.chronic-anal-fissure.lis-after-medical-treatment"
  ],
  [
    "case.chronic-anal-fissure.persistent-symptoms",
    "node.chronic-anal-fissure.persistent-symptoms.1",
    "question.chronic-anal-fissure.lis-after-medical-treatment.v2",
    "concept.chronic-anal-fissure.lis-after-medical-treatment"
  ],
  [
    "case.chronic-anal-fissure.failed-topical",
    "node.chronic-anal-fissure.failed-topical.1",
    "question.chronic-anal-fissure.lis-after-medical-treatment.v3",
    "concept.chronic-anal-fissure.lis-after-medical-treatment"
  ],
  [
    "case.chronic-anal-fissure.durable-option",
    "node.chronic-anal-fissure.durable-option.1",
    "question.chronic-anal-fissure.lis-after-medical-treatment.v4",
    "concept.chronic-anal-fissure.lis-after-medical-treatment"
  ],
  [
    "case.cutaneous-scc.forearm-low",
    "node.cutaneous-scc.forearm-low.1",
    "question.cutaneous-scc.diagnostic-biopsy.v1",
    "concept.cutaneous-scc.diagnostic-biopsy"
  ],
  [
    "case.cutaneous-scc.forearm-low",
    "node.cutaneous-scc.forearm-low.2",
    "question.cutaneous-scc.risk-directed-surgery.v1",
    "concept.cutaneous-scc.risk-directed-surgery"
  ],
  [
    "case.cutaneous-scc.trunk-low",
    "node.cutaneous-scc.trunk-low.1",
    "question.cutaneous-scc.diagnostic-biopsy.v2",
    "concept.cutaneous-scc.diagnostic-biopsy"
  ],
  [
    "case.cutaneous-scc.trunk-low",
    "node.cutaneous-scc.trunk-low.2",
    "question.cutaneous-scc.risk-directed-surgery.v2",
    "concept.cutaneous-scc.risk-directed-surgery"
  ],
  [
    "case.cutaneous-scc.ear-high",
    "node.cutaneous-scc.ear-high.1",
    "question.cutaneous-scc.diagnostic-biopsy.v3",
    "concept.cutaneous-scc.diagnostic-biopsy"
  ],
  [
    "case.cutaneous-scc.ear-high",
    "node.cutaneous-scc.ear-high.2",
    "question.cutaneous-scc.risk-directed-surgery.v3",
    "concept.cutaneous-scc.risk-directed-surgery"
  ],
  [
    "case.cutaneous-scc.recurrent-high",
    "node.cutaneous-scc.recurrent-high.1",
    "question.cutaneous-scc.diagnostic-biopsy.v4",
    "concept.cutaneous-scc.diagnostic-biopsy"
  ],
  [
    "case.cutaneous-scc.recurrent-high",
    "node.cutaneous-scc.recurrent-high.2",
    "question.cutaneous-scc.risk-directed-surgery.v4",
    "concept.cutaneous-scc.risk-directed-surgery"
  ],
  [
    "case.venous-leg-ulcer.medial-gaiter",
    "node.venous-leg-ulcer.medial-gaiter.1",
    "question.venous-leg-ulcer.arterial-assessment-before-compression.v1",
    "concept.venous-leg-ulcer.arterial-assessment-before-compression"
  ],
  [
    "case.venous-leg-ulcer.medial-gaiter",
    "node.venous-leg-ulcer.medial-gaiter.2",
    "question.venous-leg-ulcer.compression-with-adequate-arterial-perfusion.v1",
    "concept.venous-leg-ulcer.compression-with-adequate-arterial-perfusion"
  ],
  [
    "case.venous-leg-ulcer.recurrent-ulcer",
    "node.venous-leg-ulcer.recurrent-ulcer.1",
    "question.venous-leg-ulcer.arterial-assessment-before-compression.v2",
    "concept.venous-leg-ulcer.arterial-assessment-before-compression"
  ],
  [
    "case.venous-leg-ulcer.recurrent-ulcer",
    "node.venous-leg-ulcer.recurrent-ulcer.2",
    "question.venous-leg-ulcer.compression-with-adequate-arterial-perfusion.v2",
    "concept.venous-leg-ulcer.compression-with-adequate-arterial-perfusion"
  ],
  [
    "case.venous-leg-ulcer.varicose-changes",
    "node.venous-leg-ulcer.varicose-changes.1",
    "question.venous-leg-ulcer.arterial-assessment-before-compression.v3",
    "concept.venous-leg-ulcer.arterial-assessment-before-compression"
  ],
  [
    "case.venous-leg-ulcer.varicose-changes",
    "node.venous-leg-ulcer.varicose-changes.2",
    "question.venous-leg-ulcer.compression-with-adequate-arterial-perfusion.v3",
    "concept.venous-leg-ulcer.compression-with-adequate-arterial-perfusion"
  ],
  [
    "case.venous-leg-ulcer.healed-edge",
    "node.venous-leg-ulcer.healed-edge.1",
    "question.venous-leg-ulcer.arterial-assessment-before-compression.v4",
    "concept.venous-leg-ulcer.arterial-assessment-before-compression"
  ],
  [
    "case.venous-leg-ulcer.healed-edge",
    "node.venous-leg-ulcer.healed-edge.2",
    "question.venous-leg-ulcer.compression-with-adequate-arterial-perfusion.v4",
    "concept.venous-leg-ulcer.compression-with-adequate-arterial-perfusion"
  ],
  [
    "case.splenectomy-prevention.itp",
    "node.splenectomy-prevention.itp.1",
    "question.elective-splenectomy.encapsulated-organism-vaccine-review.v1",
    "concept.elective-splenectomy.encapsulated-organism-vaccine-review"
  ],
  [
    "case.splenectomy-prevention.hereditary-spherocytosis",
    "node.splenectomy-prevention.hereditary-spherocytosis.1",
    "question.elective-splenectomy.encapsulated-organism-vaccine-review.v2",
    "concept.elective-splenectomy.encapsulated-organism-vaccine-review"
  ],
  [
    "case.splenectomy-prevention.benign-cyst",
    "node.splenectomy-prevention.benign-cyst.1",
    "question.elective-splenectomy.encapsulated-organism-vaccine-review.v3",
    "concept.elective-splenectomy.encapsulated-organism-vaccine-review"
  ],
  [
    "case.splenectomy-prevention.hematology",
    "node.splenectomy-prevention.hematology.1",
    "question.elective-splenectomy.encapsulated-organism-vaccine-review.v4",
    "concept.elective-splenectomy.encapsulated-organism-vaccine-review"
  ],
  [
    "case.asplenia-fever.evening-fever",
    "node.asplenia-fever.evening-fever.1",
    "question.asplenia.fever-emergency-action.v1",
    "concept.asplenia.fever-emergency-action"
  ],
  [
    "case.asplenia-fever.chills",
    "node.asplenia-fever.chills.1",
    "question.asplenia.fever-emergency-action.v2",
    "concept.asplenia.fever-emergency-action"
  ],
  [
    "case.asplenia-fever.urgent-visit",
    "node.asplenia-fever.urgent-visit.1",
    "question.asplenia.fever-emergency-action.v3",
    "concept.asplenia.fever-emergency-action"
  ],
  [
    "case.asplenia-fever.postoperative-fever",
    "node.asplenia-fever.postoperative-fever.1",
    "question.asplenia.fever-emergency-action.v4",
    "concept.asplenia.fever-emergency-action"
  ],
  [
    "case.adrenal-incidentaloma.incidental-left-nodule",
    "node.adrenal-incidentaloma.incidental-left-nodule.1",
    "question.adrenal-incidentaloma.one-mg-dst.v1",
    "concept.adrenal-incidentaloma.one-mg-dst"
  ],
  [
    "case.adrenal-incidentaloma.incidental-right-nodule",
    "node.adrenal-incidentaloma.incidental-right-nodule.1",
    "question.adrenal-incidentaloma.one-mg-dst.v2",
    "concept.adrenal-incidentaloma.one-mg-dst"
  ],
  [
    "case.adrenal-incidentaloma.lipid-rich-mass",
    "node.adrenal-incidentaloma.lipid-rich-mass.1",
    "question.adrenal-incidentaloma.one-mg-dst.v3",
    "concept.adrenal-incidentaloma.one-mg-dst"
  ],
  [
    "case.adrenal-incidentaloma.small-adrenal-adenoma",
    "node.adrenal-incidentaloma.small-adrenal-adenoma.1",
    "question.adrenal-incidentaloma.one-mg-dst.v4",
    "concept.adrenal-incidentaloma.one-mg-dst"
  ],
  [
    "case.adrenal-incidentaloma.lung-cancer-mass",
    "node.adrenal-incidentaloma.lung-cancer-mass.1",
    "question.adrenal-incidentaloma.pheochromocytoma-before-biopsy.v1",
    "concept.adrenal-incidentaloma.pheochromocytoma-before-biopsy"
  ],
  [
    "case.adrenal-incidentaloma.melanoma-mass",
    "node.adrenal-incidentaloma.melanoma-mass.1",
    "question.adrenal-incidentaloma.pheochromocytoma-before-biopsy.v2",
    "concept.adrenal-incidentaloma.pheochromocytoma-before-biopsy"
  ],
  [
    "case.adrenal-incidentaloma.renal-cancer-mass",
    "node.adrenal-incidentaloma.renal-cancer-mass.1",
    "question.adrenal-incidentaloma.pheochromocytoma-before-biopsy.v3.r3",
    "concept.adrenal-incidentaloma.pheochromocytoma-before-biopsy"
  ],
  [
    "case.adrenal-incidentaloma.colon-cancer-mass",
    "node.adrenal-incidentaloma.colon-cancer-mass.1",
    "question.adrenal-incidentaloma.pheochromocytoma-before-biopsy.v4",
    "concept.adrenal-incidentaloma.pheochromocytoma-before-biopsy"
  ],
  [
    "case.mammary-paget.crusted-nipple",
    "node.mammary-paget.crusted-nipple.1",
    "question.mammary-paget.full-thickness-biopsy.v1",
    "concept.mammary-paget.full-thickness-biopsy"
  ],
  [
    "case.mammary-paget.crusted-nipple",
    "node.mammary-paget.crusted-nipple.2",
    "question.mammary-paget.underlying-breast-evaluation.v1",
    "concept.mammary-paget.underlying-breast-evaluation"
  ],
  [
    "case.mammary-paget.nipple-erosion",
    "node.mammary-paget.nipple-erosion.1",
    "question.mammary-paget.full-thickness-biopsy.v2",
    "concept.mammary-paget.full-thickness-biopsy"
  ],
  [
    "case.mammary-paget.nipple-erosion",
    "node.mammary-paget.nipple-erosion.2",
    "question.mammary-paget.underlying-breast-evaluation.v2",
    "concept.mammary-paget.underlying-breast-evaluation"
  ],
  [
    "case.mammary-paget.areolar-rash",
    "node.mammary-paget.areolar-rash.1",
    "question.mammary-paget.full-thickness-biopsy.v3",
    "concept.mammary-paget.full-thickness-biopsy"
  ],
  [
    "case.mammary-paget.areolar-rash",
    "node.mammary-paget.areolar-rash.2",
    "question.mammary-paget.underlying-breast-evaluation.v3",
    "concept.mammary-paget.underlying-breast-evaluation"
  ],
  [
    "case.mammary-paget.scaly-nipple",
    "node.mammary-paget.scaly-nipple.1",
    "question.mammary-paget.full-thickness-biopsy.v4",
    "concept.mammary-paget.full-thickness-biopsy"
  ],
  [
    "case.mammary-paget.scaly-nipple",
    "node.mammary-paget.scaly-nipple.2",
    "question.mammary-paget.underlying-breast-evaluation.v4",
    "concept.mammary-paget.underlying-breast-evaluation"
  ],
  [
    "case.inflammatory-breast-cancer.rapid-redness",
    "node.inflammatory-breast-cancer.rapid-redness.1",
    "question.inflammatory-breast-cancer.core-biopsy-confirmation.v1",
    "concept.inflammatory-breast-cancer.core-biopsy-confirmation"
  ],
  [
    "case.inflammatory-breast-cancer.rapid-redness",
    "node.inflammatory-breast-cancer.rapid-redness.2",
    "question.inflammatory-breast-cancer.neoadjuvant-sequence.v1",
    "concept.inflammatory-breast-cancer.neoadjuvant-sequence"
  ],
  [
    "case.inflammatory-breast-cancer.diffuse-swelling",
    "node.inflammatory-breast-cancer.diffuse-swelling.1",
    "question.inflammatory-breast-cancer.core-biopsy-confirmation.v2",
    "concept.inflammatory-breast-cancer.core-biopsy-confirmation"
  ],
  [
    "case.inflammatory-breast-cancer.diffuse-swelling",
    "node.inflammatory-breast-cancer.diffuse-swelling.2",
    "question.inflammatory-breast-cancer.neoadjuvant-sequence.v2",
    "concept.inflammatory-breast-cancer.neoadjuvant-sequence"
  ],
  [
    "case.inflammatory-breast-cancer.peau-dorange",
    "node.inflammatory-breast-cancer.peau-dorange.1",
    "question.inflammatory-breast-cancer.core-biopsy-confirmation.v3",
    "concept.inflammatory-breast-cancer.core-biopsy-confirmation"
  ],
  [
    "case.inflammatory-breast-cancer.peau-dorange",
    "node.inflammatory-breast-cancer.peau-dorange.2",
    "question.inflammatory-breast-cancer.neoadjuvant-sequence.v3",
    "concept.inflammatory-breast-cancer.neoadjuvant-sequence"
  ],
  [
    "case.inflammatory-breast-cancer.persistent-erythema",
    "node.inflammatory-breast-cancer.persistent-erythema.1",
    "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r5",
    "concept.inflammatory-breast-cancer.core-biopsy-confirmation.v2"
  ],
  [
    "case.inflammatory-breast-cancer.persistent-erythema",
    "node.inflammatory-breast-cancer.persistent-erythema.2",
    "question.inflammatory-breast-cancer.neoadjuvant-sequence.v4.r3",
    "concept.inflammatory-breast-cancer.neoadjuvant-sequence"
  ],
  [
    "case.aaa.retired-carpenter",
    "node.aaa.retired-carpenter.1",
    "question.aaa.one-time-ultrasound-screening.v1",
    "concept.aaa.one-time-ultrasound-screening"
  ],
  [
    "case.aaa.retired-carpenter",
    "node.aaa.retired-carpenter.2",
    "question.aaa.six-cm-elective-repair-referral.v1",
    "concept.aaa.six-cm-elective-repair-referral"
  ],
  [
    "case.aaa.former-smoker",
    "node.aaa.former-smoker.1",
    "question.aaa.one-time-ultrasound-screening.v2",
    "concept.aaa.one-time-ultrasound-screening"
  ],
  [
    "case.aaa.former-smoker",
    "node.aaa.former-smoker.2",
    "question.aaa.six-cm-elective-repair-referral.v2",
    "concept.aaa.six-cm-elective-repair-referral"
  ],
  [
    "case.aaa.remote-smoking",
    "node.aaa.remote-smoking.1",
    "question.aaa.one-time-ultrasound-screening.v3",
    "concept.aaa.one-time-ultrasound-screening"
  ],
  [
    "case.aaa.remote-smoking",
    "node.aaa.remote-smoking.2",
    "question.aaa.six-cm-elective-repair-referral.v3",
    "concept.aaa.six-cm-elective-repair-referral"
  ],
  [
    "case.aaa.current-smoker",
    "node.aaa.current-smoker.1",
    "question.aaa.one-time-ultrasound-screening.v4",
    "concept.aaa.one-time-ultrasound-screening"
  ],
  [
    "case.aaa.current-smoker",
    "node.aaa.current-smoker.2",
    "question.aaa.six-cm-elective-repair-referral.v4",
    "concept.aaa.six-cm-elective-repair-referral"
  ],
  [
    "case.fecal-incontinence.loose-stool-leakage",
    "node.fecal-incontinence.loose-stool-leakage.1",
    "question.fecal-incontinence.first-line-stool-care.v1",
    "concept.fecal-incontinence.first-line-stool-care"
  ],
  [
    "case.fecal-incontinence.urgency-accidents",
    "node.fecal-incontinence.urgency-accidents.1",
    "question.fecal-incontinence.first-line-stool-care.v2",
    "concept.fecal-incontinence.first-line-stool-care"
  ],
  [
    "case.fecal-incontinence.daily-smearing",
    "node.fecal-incontinence.daily-smearing.1",
    "question.fecal-incontinence.first-line-stool-care.v3",
    "concept.fecal-incontinence.first-line-stool-care"
  ],
  [
    "case.fecal-incontinence.exercise-leakage",
    "node.fecal-incontinence.exercise-leakage.1",
    "question.fecal-incontinence.first-line-stool-care.v4",
    "concept.fecal-incontinence.first-line-stool-care"
  ],
  [
    "case.fecal-incontinence.obstetric-injury",
    "node.fecal-incontinence.obstetric-injury.1",
    "question.fecal-incontinence.endoanal-ultrasound-repair-planning.v1",
    "concept.fecal-incontinence.endoanal-ultrasound-repair-planning"
  ],
  [
    "case.fecal-incontinence.prior-anorectal-injury",
    "node.fecal-incontinence.prior-anorectal-injury.1",
    "question.fecal-incontinence.endoanal-ultrasound-repair-planning.v2",
    "concept.fecal-incontinence.endoanal-ultrasound-repair-planning"
  ],
  [
    "case.fecal-incontinence.sphincter-concern",
    "node.fecal-incontinence.sphincter-concern.1",
    "question.fecal-incontinence.endoanal-ultrasound-repair-planning.v3",
    "concept.fecal-incontinence.endoanal-ultrasound-repair-planning"
  ],
  [
    "case.fecal-incontinence.repair-consult",
    "node.fecal-incontinence.repair-consult.1",
    "question.fecal-incontinence.endoanal-ultrasound-repair-planning.v4",
    "concept.fecal-incontinence.endoanal-ultrasound-repair-planning"
  ],
  [
    "case.h-pylori-ulcer.duodenal-ulcer",
    "node.h-pylori-ulcer.duodenal-ulcer.1",
    "question.h-pylori-ulcer.active-infection-testing.v1",
    "concept.h-pylori-ulcer.active-infection-testing"
  ],
  [
    "case.h-pylori-ulcer.duodenal-ulcer",
    "node.h-pylori-ulcer.duodenal-ulcer.2",
    "question.h-pylori-ulcer.test-of-cure-plan.v1",
    "concept.h-pylori-ulcer.test-of-cure-plan"
  ],
  [
    "case.h-pylori-ulcer.night-pain",
    "node.h-pylori-ulcer.night-pain.1",
    "question.h-pylori-ulcer.active-infection-testing.v2",
    "concept.h-pylori-ulcer.active-infection-testing"
  ],
  [
    "case.h-pylori-ulcer.night-pain",
    "node.h-pylori-ulcer.night-pain.2",
    "question.h-pylori-ulcer.test-of-cure-plan.v2",
    "concept.h-pylori-ulcer.test-of-cure-plan"
  ],
  [
    "case.h-pylori-ulcer.healed-ulcer",
    "node.h-pylori-ulcer.healed-ulcer.1",
    "question.h-pylori-ulcer.active-infection-testing.v3",
    "concept.h-pylori-ulcer.active-infection-testing"
  ],
  [
    "case.h-pylori-ulcer.healed-ulcer",
    "node.h-pylori-ulcer.healed-ulcer.2",
    "question.h-pylori-ulcer.test-of-cure-plan.v3",
    "concept.h-pylori-ulcer.test-of-cure-plan"
  ],
  [
    "case.h-pylori-ulcer.epigastric-pain",
    "node.h-pylori-ulcer.epigastric-pain.1",
    "question.h-pylori-ulcer.active-infection-testing.v4",
    "concept.h-pylori-ulcer.active-infection-testing"
  ],
  [
    "case.h-pylori-ulcer.epigastric-pain",
    "node.h-pylori-ulcer.epigastric-pain.2",
    "question.h-pylori-ulcer.test-of-cure-plan.v4",
    "concept.h-pylori-ulcer.test-of-cure-plan"
  ],
  [
    "case.uncomplicated-diverticulitis.left-lower-pain",
    "node.uncomplicated-diverticulitis.left-lower-pain.1",
    "question.diverticulitis.first-presentation-ct.v1",
    "concept.diverticulitis.first-presentation-ct"
  ],
  [
    "case.uncomplicated-diverticulitis.left-lower-pain",
    "node.uncomplicated-diverticulitis.left-lower-pain.2",
    "question.diverticulitis.selected-supportive-care.v1",
    "concept.diverticulitis.selected-supportive-care"
  ],
  [
    "case.uncomplicated-diverticulitis.mild-fever",
    "node.uncomplicated-diverticulitis.mild-fever.1",
    "question.diverticulitis.first-presentation-ct.v2",
    "concept.diverticulitis.first-presentation-ct"
  ],
  [
    "case.uncomplicated-diverticulitis.mild-fever",
    "node.uncomplicated-diverticulitis.mild-fever.2",
    "question.diverticulitis.selected-supportive-care.v2",
    "concept.diverticulitis.selected-supportive-care"
  ],
  [
    "case.uncomplicated-diverticulitis.first-flare",
    "node.uncomplicated-diverticulitis.first-flare.1",
    "question.diverticulitis.first-presentation-ct.v3",
    "concept.diverticulitis.first-presentation-ct"
  ],
  [
    "case.uncomplicated-diverticulitis.first-flare",
    "node.uncomplicated-diverticulitis.first-flare.2",
    "question.diverticulitis.selected-supportive-care.v3",
    "concept.diverticulitis.selected-supportive-care"
  ],
  [
    "case.uncomplicated-diverticulitis.localized-pain",
    "node.uncomplicated-diverticulitis.localized-pain.1",
    "question.diverticulitis.first-presentation-ct.v4",
    "concept.diverticulitis.first-presentation-ct"
  ],
  [
    "case.uncomplicated-diverticulitis.localized-pain",
    "node.uncomplicated-diverticulitis.localized-pain.2",
    "question.diverticulitis.selected-supportive-care.v4",
    "concept.diverticulitis.selected-supportive-care"
  ],
  [
    "case.thyroglossal-duct-cyst.swallowing-mass",
    "node.thyroglossal-duct-cyst.swallowing-mass.1",
    "question.thyroglossal-duct-cyst.ultrasound.v1",
    "concept.thyroglossal-duct-cyst.ultrasound"
  ],
  [
    "case.thyroglossal-duct-cyst.swallowing-mass",
    "node.thyroglossal-duct-cyst.swallowing-mass.2",
    "question.thyroglossal-duct-cyst.sistrunk-referral.v1",
    "concept.thyroglossal-duct-cyst.sistrunk-referral"
  ],
  [
    "case.thyroglossal-duct-cyst.recurrent-swelling",
    "node.thyroglossal-duct-cyst.recurrent-swelling.1",
    "question.thyroglossal-duct-cyst.ultrasound.v2",
    "concept.thyroglossal-duct-cyst.ultrasound"
  ],
  [
    "case.thyroglossal-duct-cyst.recurrent-swelling",
    "node.thyroglossal-duct-cyst.recurrent-swelling.2",
    "question.thyroglossal-duct-cyst.sistrunk-referral.v2",
    "concept.thyroglossal-duct-cyst.sistrunk-referral"
  ],
  [
    "case.thyroglossal-duct-cyst.visible-lump",
    "node.thyroglossal-duct-cyst.visible-lump.1",
    "question.thyroglossal-duct-cyst.ultrasound.v3",
    "concept.thyroglossal-duct-cyst.ultrasound"
  ],
  [
    "case.thyroglossal-duct-cyst.visible-lump",
    "node.thyroglossal-duct-cyst.visible-lump.2",
    "question.thyroglossal-duct-cyst.sistrunk-referral.v3",
    "concept.thyroglossal-duct-cyst.sistrunk-referral"
  ],
  [
    "case.thyroglossal-duct-cyst.intermittent-lump",
    "node.thyroglossal-duct-cyst.intermittent-lump.1",
    "question.thyroglossal-duct-cyst.ultrasound.v4",
    "concept.thyroglossal-duct-cyst.ultrasound"
  ],
  [
    "case.thyroglossal-duct-cyst.intermittent-lump",
    "node.thyroglossal-duct-cyst.intermittent-lump.2",
    "question.thyroglossal-duct-cyst.sistrunk-referral.v4",
    "concept.thyroglossal-duct-cyst.sistrunk-referral"
  ],
  [
    "case.rectal-prolapse.toilet-protrusion",
    "node.rectal-prolapse.toilet-protrusion.1",
    "question.rectal-prolapse.dynamic-defecography.v1",
    "concept.rectal-prolapse.dynamic-defecography"
  ],
  [
    "case.rectal-prolapse.toilet-protrusion",
    "node.rectal-prolapse.toilet-protrusion.2",
    "question.rectal-prolapse.surgical-referral.v1",
    "concept.rectal-prolapse.surgical-referral"
  ],
  [
    "case.rectal-prolapse.standing-bulge",
    "node.rectal-prolapse.standing-bulge.1",
    "question.rectal-prolapse.dynamic-defecography.v2",
    "concept.rectal-prolapse.dynamic-defecography"
  ],
  [
    "case.rectal-prolapse.standing-bulge",
    "node.rectal-prolapse.standing-bulge.2",
    "question.rectal-prolapse.surgical-referral.v2",
    "concept.rectal-prolapse.surgical-referral"
  ],
  [
    "case.rectal-prolapse.reducible-prolapse",
    "node.rectal-prolapse.reducible-prolapse.1",
    "question.rectal-prolapse.dynamic-defecography.v3",
    "concept.rectal-prolapse.dynamic-defecography"
  ],
  [
    "case.rectal-prolapse.reducible-prolapse",
    "node.rectal-prolapse.reducible-prolapse.2",
    "question.rectal-prolapse.surgical-referral.v3",
    "concept.rectal-prolapse.surgical-referral"
  ],
  [
    "case.rectal-prolapse.elusive-prolapse",
    "node.rectal-prolapse.elusive-prolapse.1",
    "question.rectal-prolapse.dynamic-defecography.v4",
    "concept.rectal-prolapse.dynamic-defecography"
  ],
  [
    "case.rectal-prolapse.elusive-prolapse",
    "node.rectal-prolapse.elusive-prolapse.2",
    "question.rectal-prolapse.surgical-referral.v4",
    "concept.rectal-prolapse.surgical-referral"
  ],
  [
    "case.eoe.meat-sticks",
    "node.eoe.meat-sticks.1",
    "question.eoe.multilevel-esophageal-biopsies.v1",
    "concept.eoe.multilevel-esophageal-biopsies"
  ],
  [
    "case.eoe.meat-sticks",
    "node.eoe.meat-sticks.2",
    "question.eoe.dilation-plus-anti-inflammatory-care.v1",
    "concept.eoe.dilation-plus-anti-inflammatory-care"
  ],
  [
    "case.eoe.slow-eating",
    "node.eoe.slow-eating.1",
    "question.eoe.multilevel-esophageal-biopsies.v2",
    "concept.eoe.multilevel-esophageal-biopsies"
  ],
  [
    "case.eoe.slow-eating",
    "node.eoe.slow-eating.2",
    "question.eoe.dilation-plus-anti-inflammatory-care.v2",
    "concept.eoe.dilation-plus-anti-inflammatory-care"
  ],
  [
    "case.eoe.bread-sticks",
    "node.eoe.bread-sticks.1",
    "question.eoe.multilevel-esophageal-biopsies.v3",
    "concept.eoe.multilevel-esophageal-biopsies"
  ],
  [
    "case.eoe.bread-sticks",
    "node.eoe.bread-sticks.2",
    "question.eoe.dilation-plus-anti-inflammatory-care.v3",
    "concept.eoe.dilation-plus-anti-inflammatory-care"
  ],
  [
    "case.eoe.chews-carefully",
    "node.eoe.chews-carefully.1",
    "question.eoe.multilevel-esophageal-biopsies.v4",
    "concept.eoe.multilevel-esophageal-biopsies"
  ],
  [
    "case.eoe.chews-carefully",
    "node.eoe.chews-carefully.2",
    "question.eoe.dilation-plus-anti-inflammatory-care.v4",
    "concept.eoe.dilation-plus-anti-inflammatory-care"
  ],
  [
    "case.bread-butter.breast-mass.screening-call-back",
    "node.bread-butter.breast-mass.screening-call-back.1",
    "question.breast-mass.image-guided-core-biopsy.v1",
    "concept.breast-mass.image-guided-core-biopsy"
  ],
  [
    "case.bread-butter.breast-mass.screening-call-back",
    "node.bread-butter.breast-mass.screening-call-back.2",
    "question.fibroadenoma.concordant-observation.v1",
    "concept.fibroadenoma.concordant-observation"
  ],
  [
    "case.bread-butter.breast-mass.palpable-lump",
    "node.bread-butter.breast-mass.palpable-lump.1",
    "question.breast-mass.image-guided-core-biopsy.v2",
    "concept.breast-mass.image-guided-core-biopsy"
  ],
  [
    "case.bread-butter.breast-mass.palpable-lump",
    "node.bread-butter.breast-mass.palpable-lump.2",
    "question.fibroadenoma.concordant-observation.v2",
    "concept.fibroadenoma.concordant-observation"
  ],
  [
    "case.bread-butter.breast-mass.imaging-follow-up",
    "node.bread-butter.breast-mass.imaging-follow-up.1",
    "question.breast-mass.image-guided-core-biopsy.v3",
    "concept.breast-mass.image-guided-core-biopsy"
  ],
  [
    "case.bread-butter.breast-mass.imaging-follow-up",
    "node.bread-butter.breast-mass.imaging-follow-up.2",
    "question.fibroadenoma.concordant-observation.v3",
    "concept.fibroadenoma.concordant-observation"
  ],
  [
    "case.bread-butter.breast-mass.new-breast-nodule",
    "node.bread-butter.breast-mass.new-breast-nodule.1",
    "question.breast-mass.image-guided-core-biopsy.v4",
    "concept.breast-mass.image-guided-core-biopsy"
  ],
  [
    "case.bread-butter.breast-mass.new-breast-nodule",
    "node.bread-butter.breast-mass.new-breast-nodule.2",
    "question.fibroadenoma.concordant-observation.v4",
    "concept.fibroadenoma.concordant-observation"
  ],
  [
    "case.bread-butter.cutaneous-abscess.forearm-redness",
    "node.bread-butter.cutaneous-abscess.forearm-redness.1",
    "question.cutaneous-abscess.equivocal-ultrasound.v1",
    "concept.cutaneous-abscess.equivocal-ultrasound"
  ],
  [
    "case.bread-butter.cutaneous-abscess.forearm-redness",
    "node.bread-butter.cutaneous-abscess.forearm-redness.2",
    "question.cutaneous-abscess.incision-drainage.v1",
    "concept.cutaneous-abscess.incision-drainage"
  ],
  [
    "case.bread-butter.cutaneous-abscess.back-nodule",
    "node.bread-butter.cutaneous-abscess.back-nodule.1",
    "question.cutaneous-abscess.equivocal-ultrasound.v2",
    "concept.cutaneous-abscess.equivocal-ultrasound"
  ],
  [
    "case.bread-butter.cutaneous-abscess.back-nodule",
    "node.bread-butter.cutaneous-abscess.back-nodule.2",
    "question.cutaneous-abscess.incision-drainage.v2",
    "concept.cutaneous-abscess.incision-drainage"
  ],
  [
    "case.bread-butter.cutaneous-abscess.thigh-swelling",
    "node.bread-butter.cutaneous-abscess.thigh-swelling.1",
    "question.cutaneous-abscess.equivocal-ultrasound.v3",
    "concept.cutaneous-abscess.equivocal-ultrasound"
  ],
  [
    "case.bread-butter.cutaneous-abscess.thigh-swelling",
    "node.bread-butter.cutaneous-abscess.thigh-swelling.2",
    "question.cutaneous-abscess.incision-drainage.v3",
    "concept.cutaneous-abscess.incision-drainage"
  ],
  [
    "case.bread-butter.cutaneous-abscess.abdominal-wall-redness",
    "node.bread-butter.cutaneous-abscess.abdominal-wall-redness.1",
    "question.cutaneous-abscess.equivocal-ultrasound.v4",
    "concept.cutaneous-abscess.equivocal-ultrasound"
  ],
  [
    "case.bread-butter.cutaneous-abscess.abdominal-wall-redness",
    "node.bread-butter.cutaneous-abscess.abdominal-wall-redness.2",
    "question.cutaneous-abscess.incision-drainage.v4",
    "concept.cutaneous-abscess.incision-drainage"
  ],
  [
    "case.bread-butter.inguinal-hernia.painless-bulge",
    "node.bread-butter.inguinal-hernia.painless-bulge.1",
    "question.inguinal-hernia.selected-watchful-waiting.v1",
    "concept.inguinal-hernia.selected-watchful-waiting"
  ],
  [
    "case.bread-butter.inguinal-hernia.mild-groin-awareness",
    "node.bread-butter.inguinal-hernia.mild-groin-awareness.1",
    "question.inguinal-hernia.selected-watchful-waiting.v2",
    "concept.inguinal-hernia.selected-watchful-waiting"
  ],
  [
    "case.bread-butter.inguinal-hernia.hernia-options",
    "node.bread-butter.inguinal-hernia.hernia-options.1",
    "question.inguinal-hernia.selected-watchful-waiting.v3",
    "concept.inguinal-hernia.selected-watchful-waiting"
  ],
  [
    "case.bread-butter.inguinal-hernia.small-groin-bulge",
    "node.bread-butter.inguinal-hernia.small-groin-bulge.1",
    "question.inguinal-hernia.selected-watchful-waiting.v4",
    "concept.inguinal-hernia.selected-watchful-waiting"
  ],
  [
    "case.bread-butter.femoral-hernia.femoral-bulge",
    "node.bread-butter.femoral-hernia.femoral-bulge.1",
    "question.femoral-hernia.timely-elective-repair.v1",
    "concept.femoral-hernia.timely-elective-repair"
  ],
  [
    "case.bread-butter.femoral-hernia.femoral-options",
    "node.bread-butter.femoral-hernia.femoral-options.1",
    "question.femoral-hernia.timely-elective-repair.v2",
    "concept.femoral-hernia.timely-elective-repair"
  ],
  [
    "case.bread-butter.femoral-hernia.painless-femoral-hernia",
    "node.bread-butter.femoral-hernia.painless-femoral-hernia.1",
    "question.femoral-hernia.timely-elective-repair.v3",
    "concept.femoral-hernia.timely-elective-repair"
  ],
  [
    "case.bread-butter.femoral-hernia.reducible-femoral-hernia",
    "node.bread-butter.femoral-hernia.reducible-femoral-hernia.1",
    "question.femoral-hernia.timely-elective-repair.v4",
    "concept.femoral-hernia.timely-elective-repair"
  ],
  [
    "case.bread-butter.hernia-anatomy.operative-report",
    "node.bread-butter.hernia-anatomy.operative-report.1",
    "question.inguinal-hernia.indirect-vessel-relationship.v1",
    "concept.inguinal-hernia.indirect-vessel-relationship"
  ],
  [
    "case.bread-butter.hernia-anatomy.operative-report",
    "node.bread-butter.hernia-anatomy.operative-report.2",
    "question.inguinal-hernia.lateral-femoral-cutaneous-localization.v1",
    "concept.inguinal-hernia.lateral-femoral-cutaneous-localization"
  ],
  [
    "case.bread-butter.hernia-anatomy.hernia-anatomy",
    "node.bread-butter.hernia-anatomy.hernia-anatomy.1",
    "question.inguinal-hernia.indirect-vessel-relationship.v2",
    "concept.inguinal-hernia.indirect-vessel-relationship"
  ],
  [
    "case.bread-butter.hernia-anatomy.hernia-anatomy",
    "node.bread-butter.hernia-anatomy.hernia-anatomy.2",
    "question.inguinal-hernia.lateral-femoral-cutaneous-localization.v2",
    "concept.inguinal-hernia.lateral-femoral-cutaneous-localization"
  ],
  [
    "case.bread-butter.hernia-anatomy.repair-follow-up",
    "node.bread-butter.hernia-anatomy.repair-follow-up.1",
    "question.inguinal-hernia.indirect-vessel-relationship.v3",
    "concept.inguinal-hernia.indirect-vessel-relationship"
  ],
  [
    "case.bread-butter.hernia-anatomy.repair-follow-up",
    "node.bread-butter.hernia-anatomy.repair-follow-up.2",
    "question.inguinal-hernia.lateral-femoral-cutaneous-localization.v3",
    "concept.inguinal-hernia.lateral-femoral-cutaneous-localization"
  ],
  [
    "case.bread-butter.hernia-anatomy.postoperative-review",
    "node.bread-butter.hernia-anatomy.postoperative-review.1",
    "question.inguinal-hernia.indirect-vessel-relationship.v4",
    "concept.inguinal-hernia.indirect-vessel-relationship"
  ],
  [
    "case.bread-butter.hernia-anatomy.postoperative-review",
    "node.bread-butter.hernia-anatomy.postoperative-review.2",
    "question.inguinal-hernia.lateral-femoral-cutaneous-localization.v4",
    "concept.inguinal-hernia.lateral-femoral-cutaneous-localization"
  ],
  [
    "case.bread-butter.high-output-ileostomy.watery-output",
    "node.bread-butter.high-output-ileostomy.watery-output.1",
    "question.high-output-ileostomy.renal-electrolyte-magnesium-assessment.v1",
    "concept.high-output-ileostomy.renal-electrolyte-magnesium-assessment"
  ],
  [
    "case.bread-butter.high-output-ileostomy.watery-output",
    "node.bread-butter.high-output-ileostomy.watery-output.2",
    "question.high-output-ileostomy.sodium-glucose-oral-rehydration.v1",
    "concept.high-output-ileostomy.sodium-glucose-oral-rehydration"
  ],
  [
    "case.bread-butter.high-output-ileostomy.frequent-emptying",
    "node.bread-butter.high-output-ileostomy.frequent-emptying.1",
    "question.high-output-ileostomy.renal-electrolyte-magnesium-assessment.v2",
    "concept.high-output-ileostomy.renal-electrolyte-magnesium-assessment"
  ],
  [
    "case.bread-butter.high-output-ileostomy.frequent-emptying",
    "node.bread-butter.high-output-ileostomy.frequent-emptying.2",
    "question.high-output-ileostomy.sodium-glucose-oral-rehydration.v2",
    "concept.high-output-ileostomy.sodium-glucose-oral-rehydration"
  ],
  [
    "case.bread-butter.high-output-ileostomy.ostomy-fluid-loss",
    "node.bread-butter.high-output-ileostomy.ostomy-fluid-loss.1",
    "question.high-output-ileostomy.renal-electrolyte-magnesium-assessment.v3",
    "concept.high-output-ileostomy.renal-electrolyte-magnesium-assessment"
  ],
  [
    "case.bread-butter.high-output-ileostomy.ostomy-fluid-loss",
    "node.bread-butter.high-output-ileostomy.ostomy-fluid-loss.2",
    "question.high-output-ileostomy.sodium-glucose-oral-rehydration.v3",
    "concept.high-output-ileostomy.sodium-glucose-oral-rehydration"
  ],
  [
    "case.bread-butter.high-output-ileostomy.high-stoma-output",
    "node.bread-butter.high-output-ileostomy.high-stoma-output.1",
    "question.high-output-ileostomy.renal-electrolyte-magnesium-assessment.v4",
    "concept.high-output-ileostomy.renal-electrolyte-magnesium-assessment"
  ],
  [
    "case.bread-butter.high-output-ileostomy.high-stoma-output",
    "node.bread-butter.high-output-ileostomy.high-stoma-output.2",
    "question.high-output-ileostomy.sodium-glucose-oral-rehydration.v4",
    "concept.high-output-ileostomy.sodium-glucose-oral-rehydration"
  ],
  [
    "case.bread-butter.perianal-abscess.tender-perianal-lump",
    "node.bread-butter.perianal-abscess.tender-perianal-lump.1",
    "question.perianal-abscess.prompt-drainage.v1",
    "concept.perianal-abscess.prompt-drainage"
  ],
  [
    "case.bread-butter.perianal-abscess.perianal-swelling",
    "node.bread-butter.perianal-abscess.perianal-swelling.1",
    "question.perianal-abscess.prompt-drainage.v2",
    "concept.perianal-abscess.prompt-drainage"
  ],
  [
    "case.bread-butter.perianal-abscess.painful-sitting",
    "node.bread-butter.perianal-abscess.painful-sitting.1",
    "question.perianal-abscess.prompt-drainage.v3",
    "concept.perianal-abscess.prompt-drainage"
  ],
  [
    "case.bread-butter.perianal-abscess.draining-pain",
    "node.bread-butter.perianal-abscess.draining-pain.1",
    "question.perianal-abscess.prompt-drainage.v4",
    "concept.perianal-abscess.prompt-drainage"
  ],
  [
    "case.bread-butter.perianal-abscess.drainage-follow-up",
    "node.bread-butter.perianal-abscess.drainage-follow-up.1",
    "question.perianal-abscess.selective-antibiotics.v1",
    "concept.perianal-abscess.selective-antibiotics"
  ],
  [
    "case.bread-butter.perianal-abscess.post-drainage-plan",
    "node.bread-butter.perianal-abscess.post-drainage-plan.1",
    "question.perianal-abscess.selective-antibiotics.v2",
    "concept.perianal-abscess.selective-antibiotics"
  ],
  [
    "case.bread-butter.perianal-abscess.wound-check",
    "node.bread-butter.perianal-abscess.wound-check.1",
    "question.perianal-abscess.selective-antibiotics.v3",
    "concept.perianal-abscess.selective-antibiotics"
  ],
  [
    "case.bread-butter.perianal-abscess.antibiotic-question",
    "node.bread-butter.perianal-abscess.antibiotic-question.1",
    "question.perianal-abscess.selective-antibiotics.v4",
    "concept.perianal-abscess.selective-antibiotics"
  ],
  [
    "case.bread-butter.perioperative-medications.medication-review",
    "node.bread-butter.perioperative-medications.medication-review.1",
    "question.perioperative-medication.continue-chronic-beta-blocker.v1",
    "concept.perioperative-medication.continue-chronic-beta-blocker"
  ],
  [
    "case.bread-butter.perioperative-medications.medication-review",
    "node.bread-butter.perioperative-medications.medication-review.2",
    "question.perioperative-medication.warfarin-interruption-no-bridge.v1",
    "concept.perioperative-medication.warfarin-interruption-no-bridge"
  ],
  [
    "case.bread-butter.perioperative-medications.surgery-medications",
    "node.bread-butter.perioperative-medications.surgery-medications.1",
    "question.perioperative-medication.continue-chronic-beta-blocker.v2",
    "concept.perioperative-medication.continue-chronic-beta-blocker"
  ],
  [
    "case.bread-butter.perioperative-medications.surgery-medications",
    "node.bread-butter.perioperative-medications.surgery-medications.2",
    "question.perioperative-medication.warfarin-interruption-no-bridge.v2",
    "concept.perioperative-medication.warfarin-interruption-no-bridge"
  ],
  [
    "case.bread-butter.perioperative-medications.preoperative-visit",
    "node.bread-butter.perioperative-medications.preoperative-visit.1",
    "question.perioperative-medication.continue-chronic-beta-blocker.v3",
    "concept.perioperative-medication.continue-chronic-beta-blocker"
  ],
  [
    "case.bread-butter.perioperative-medications.preoperative-visit",
    "node.bread-butter.perioperative-medications.preoperative-visit.2",
    "question.perioperative-medication.warfarin-interruption-no-bridge.v3",
    "concept.perioperative-medication.warfarin-interruption-no-bridge"
  ],
  [
    "case.bread-butter.perioperative-medications.medication-instructions",
    "node.bread-butter.perioperative-medications.medication-instructions.1",
    "question.perioperative-medication.continue-chronic-beta-blocker.v4",
    "concept.perioperative-medication.continue-chronic-beta-blocker"
  ],
  [
    "case.bread-butter.perioperative-medications.medication-instructions",
    "node.bread-butter.perioperative-medications.medication-instructions.2",
    "question.perioperative-medication.warfarin-interruption-no-bridge.v4",
    "concept.perioperative-medication.warfarin-interruption-no-bridge"
  ],
  [
    "case.bread-butter.postoperative-prophylaxis.discharge-medications",
    "node.bread-butter.postoperative-prophylaxis.discharge-medications.1",
    "question.postoperative-prophylaxis.stop-antibiotics-at-closure.v1",
    "concept.postoperative-prophylaxis.stop-antibiotics-at-closure"
  ],
  [
    "case.bread-butter.postoperative-prophylaxis.discharge-medications",
    "node.bread-butter.postoperative-prophylaxis.discharge-medications.2",
    "question.postoperative-prophylaxis.extended-cancer-vte-prevention.v1",
    "concept.postoperative-prophylaxis.extended-cancer-vte-prevention"
  ],
  [
    "case.bread-butter.postoperative-prophylaxis.drain-medications",
    "node.bread-butter.postoperative-prophylaxis.drain-medications.1",
    "question.postoperative-prophylaxis.stop-antibiotics-at-closure.v2",
    "concept.postoperative-prophylaxis.stop-antibiotics-at-closure"
  ],
  [
    "case.bread-butter.postoperative-prophylaxis.drain-medications",
    "node.bread-butter.postoperative-prophylaxis.drain-medications.2",
    "question.postoperative-prophylaxis.extended-cancer-vte-prevention.v2",
    "concept.postoperative-prophylaxis.extended-cancer-vte-prevention"
  ],
  [
    "case.bread-butter.postoperative-prophylaxis.postoperative-prophylaxis",
    "node.bread-butter.postoperative-prophylaxis.postoperative-prophylaxis.1",
    "question.postoperative-prophylaxis.stop-antibiotics-at-closure.v3",
    "concept.postoperative-prophylaxis.stop-antibiotics-at-closure"
  ],
  [
    "case.bread-butter.postoperative-prophylaxis.postoperative-prophylaxis",
    "node.bread-butter.postoperative-prophylaxis.postoperative-prophylaxis.2",
    "question.postoperative-prophylaxis.extended-cancer-vte-prevention.v3",
    "concept.postoperative-prophylaxis.extended-cancer-vte-prevention"
  ],
  [
    "case.bread-butter.postoperative-prophylaxis.cancer-surgery-follow-up",
    "node.bread-butter.postoperative-prophylaxis.cancer-surgery-follow-up.1",
    "question.postoperative-prophylaxis.stop-antibiotics-at-closure.v4",
    "concept.postoperative-prophylaxis.stop-antibiotics-at-closure"
  ],
  [
    "case.bread-butter.postoperative-prophylaxis.cancer-surgery-follow-up",
    "node.bread-butter.postoperative-prophylaxis.cancer-surgery-follow-up.2",
    "question.postoperative-prophylaxis.extended-cancer-vte-prevention.v4",
    "concept.postoperative-prophylaxis.extended-cancer-vte-prevention"
  ],
  [
    "case.bread-butter.postoperative-retention.after-hernia-repair",
    "node.bread-butter.postoperative-retention.after-hernia-repair.1",
    "question.postoperative-retention.bladder-scan.v1",
    "concept.postoperative-retention.bladder-scan"
  ],
  [
    "case.bread-butter.postoperative-retention.after-hernia-repair",
    "node.bread-butter.postoperative-retention.after-hernia-repair.2",
    "question.postoperative-retention.catheter-decompression.v1",
    "concept.postoperative-retention.catheter-decompression"
  ],
  [
    "case.bread-butter.postoperative-retention.after-anorectal-surgery",
    "node.bread-butter.postoperative-retention.after-anorectal-surgery.1",
    "question.postoperative-retention.bladder-scan.v2",
    "concept.postoperative-retention.bladder-scan"
  ],
  [
    "case.bread-butter.postoperative-retention.after-anorectal-surgery",
    "node.bread-butter.postoperative-retention.after-anorectal-surgery.2",
    "question.postoperative-retention.catheter-decompression.v2",
    "concept.postoperative-retention.catheter-decompression"
  ],
  [
    "case.bread-butter.postoperative-retention.recovery-room-fullness",
    "node.bread-butter.postoperative-retention.recovery-room-fullness.1",
    "question.postoperative-retention.bladder-scan.v3",
    "concept.postoperative-retention.bladder-scan"
  ],
  [
    "case.bread-butter.postoperative-retention.recovery-room-fullness",
    "node.bread-butter.postoperative-retention.recovery-room-fullness.2",
    "question.postoperative-retention.catheter-decompression.v3",
    "concept.postoperative-retention.catheter-decompression"
  ],
  [
    "case.bread-butter.postoperative-retention.postoperative-discomfort",
    "node.bread-butter.postoperative-retention.postoperative-discomfort.1",
    "question.postoperative-retention.bladder-scan.v4",
    "concept.postoperative-retention.bladder-scan"
  ],
  [
    "case.bread-butter.postoperative-retention.postoperative-discomfort",
    "node.bread-butter.postoperative-retention.postoperative-discomfort.2",
    "question.postoperative-retention.catheter-decompression.v4",
    "concept.postoperative-retention.catheter-decompression"
  ],
  [
    "case.bread-butter.superficial-incisional-ssi.purulent-staple-line",
    "node.bread-butter.superficial-incisional-ssi.purulent-staple-line.1",
    "question.superficial-incisional-ssi.open-drain.v1",
    "concept.superficial-incisional-ssi.open-drain"
  ],
  [
    "case.bread-butter.superficial-incisional-ssi.red-incision",
    "node.bread-butter.superficial-incisional-ssi.red-incision.1",
    "question.superficial-incisional-ssi.open-drain.v2",
    "concept.superficial-incisional-ssi.open-drain"
  ],
  [
    "case.bread-butter.superficial-incisional-ssi.incisional-collection",
    "node.bread-butter.superficial-incisional-ssi.incisional-collection.1",
    "question.superficial-incisional-ssi.open-drain.v3",
    "concept.superficial-incisional-ssi.open-drain"
  ],
  [
    "case.bread-butter.superficial-incisional-ssi.tender-staples",
    "node.bread-butter.superficial-incisional-ssi.tender-staples.1",
    "question.superficial-incisional-ssi.open-drain.v4",
    "concept.superficial-incisional-ssi.open-drain"
  ],
  [
    "case.bread-butter.evisceration.bowel-visible",
    "node.bread-butter.evisceration.bowel-visible.1",
    "question.fascial-dehiscence-evisceration.emergency-transfer.v1",
    "concept.fascial-dehiscence-evisceration.emergency-transfer"
  ],
  [
    "case.bread-butter.evisceration.cough-wound-opened",
    "node.bread-butter.evisceration.cough-wound-opened.1",
    "question.fascial-dehiscence-evisceration.emergency-transfer.v2",
    "concept.fascial-dehiscence-evisceration.emergency-transfer"
  ],
  [
    "case.bread-butter.evisceration.wound-separation",
    "node.bread-butter.evisceration.wound-separation.1",
    "question.fascial-dehiscence-evisceration.emergency-transfer.v3",
    "concept.fascial-dehiscence-evisceration.emergency-transfer"
  ],
  [
    "case.bread-butter.evisceration.postoperative-evisceration",
    "node.bread-butter.evisceration.postoperative-evisceration.1",
    "question.fascial-dehiscence-evisceration.emergency-transfer.v4",
    "concept.fascial-dehiscence-evisceration.emergency-transfer"
  ],
  [
    "case.gs028.small-bowel-obstruction.a-adhesive-transition",
    "node.gs028.small-bowel-obstruction.a-adhesive-transition.1",
    "question.small-bowel-obstruction.ct-pattern-recognition.v1",
    "concept.small-bowel-obstruction.ct-pattern-recognition"
  ],
  [
    "case.gs028.small-bowel-obstruction.a-hernia-transition",
    "node.gs028.small-bowel-obstruction.a-hernia-transition.1",
    "question.small-bowel-obstruction.ct-pattern-recognition.v2",
    "concept.small-bowel-obstruction.ct-pattern-recognition"
  ],
  [
    "case.gs028.small-bowel-obstruction.a-closed-loop-concern",
    "node.gs028.small-bowel-obstruction.a-closed-loop-concern.1",
    "question.small-bowel-obstruction.ct-pattern-recognition.v3",
    "concept.small-bowel-obstruction.ct-pattern-recognition"
  ],
  [
    "case.gs028.small-bowel-obstruction.a-partial-pattern",
    "node.gs028.small-bowel-obstruction.a-partial-pattern.1",
    "question.small-bowel-obstruction.ct-pattern-recognition.v4",
    "concept.small-bowel-obstruction.ct-pattern-recognition"
  ],
  [
    "case.gs028.small-bowel-obstruction.b-peritoneal-signs",
    "node.gs028.small-bowel-obstruction.b-peritoneal-signs.1",
    "question.small-bowel-obstruction.urgent-surgical-escalation.v1",
    "concept.small-bowel-obstruction.urgent-surgical-escalation"
  ],
  [
    "case.gs028.small-bowel-obstruction.b-systemic-decline",
    "node.gs028.small-bowel-obstruction.b-systemic-decline.1",
    "question.small-bowel-obstruction.urgent-surgical-escalation.v2",
    "concept.small-bowel-obstruction.urgent-surgical-escalation"
  ],
  [
    "case.gs028.small-bowel-obstruction.b-stable-no-red-flags",
    "node.gs028.small-bowel-obstruction.b-stable-no-red-flags.1",
    "question.small-bowel-obstruction.urgent-surgical-escalation.v3",
    "concept.small-bowel-obstruction.urgent-surgical-escalation"
  ],
  [
    "case.gs028.small-bowel-obstruction.b-ischemia-warning",
    "node.gs028.small-bowel-obstruction.b-ischemia-warning.1",
    "question.small-bowel-obstruction.urgent-surgical-escalation.v4",
    "concept.small-bowel-obstruction.urgent-surgical-escalation"
  ],
  [
    "case.gs028.primary-midline-hernia.paired-umbilical-cough-bulge",
    "node.gs028.primary-midline-hernia.paired-umbilical-cough-bulge.1",
    "question.umbilical-epigastric-hernia.clinical-recognition.v1",
    "concept.umbilical-epigastric-hernia.clinical-recognition"
  ],
  [
    "case.gs028.primary-midline-hernia.paired-umbilical-cough-bulge",
    "node.gs028.primary-midline-hernia.paired-umbilical-cough-bulge.2",
    "question.umbilical-epigastric-hernia.symptomatic-elective-referral.v1",
    "concept.umbilical-epigastric-hernia.symptomatic-elective-referral"
  ],
  [
    "case.gs028.primary-midline-hernia.paired-epigastric-focal-lump",
    "node.gs028.primary-midline-hernia.paired-epigastric-focal-lump.1",
    "question.umbilical-epigastric-hernia.clinical-recognition.v2",
    "concept.umbilical-epigastric-hernia.clinical-recognition"
  ],
  [
    "case.gs028.primary-midline-hernia.paired-epigastric-focal-lump",
    "node.gs028.primary-midline-hernia.paired-epigastric-focal-lump.2",
    "question.umbilical-epigastric-hernia.symptomatic-elective-referral.v2",
    "concept.umbilical-epigastric-hernia.symptomatic-elective-referral"
  ],
  [
    "case.gs028.primary-midline-hernia.a-uncertain-deep-bulge",
    "node.gs028.primary-midline-hernia.a-uncertain-deep-bulge.1",
    "question.umbilical-epigastric-hernia.clinical-recognition.v3",
    "concept.umbilical-epigastric-hernia.clinical-recognition"
  ],
  [
    "case.gs028.primary-midline-hernia.a-reducible-after-pregnancy",
    "node.gs028.primary-midline-hernia.a-reducible-after-pregnancy.1",
    "question.umbilical-epigastric-hernia.clinical-recognition.v4",
    "concept.umbilical-epigastric-hernia.clinical-recognition"
  ],
  [
    "case.gs028.primary-midline-hernia.b-minimally-symptomatic-preference",
    "node.gs028.primary-midline-hernia.b-minimally-symptomatic-preference.1",
    "question.umbilical-epigastric-hernia.symptomatic-elective-referral.v3",
    "concept.umbilical-epigastric-hernia.symptomatic-elective-referral"
  ],
  [
    "case.gs028.primary-midline-hernia.b-incarceration-warning",
    "node.gs028.primary-midline-hernia.b-incarceration-warning.1",
    "question.umbilical-epigastric-hernia.symptomatic-elective-referral.v4",
    "concept.umbilical-epigastric-hernia.symptomatic-elective-referral"
  ],
  [
    "case.gs028.varicose-veins.paired-aching-standing",
    "node.gs028.varicose-veins.paired-aching-standing.1",
    "question.varicose-veins.reflux-duplex-evaluation.v1",
    "concept.varicose-veins.reflux-duplex-evaluation"
  ],
  [
    "case.gs028.varicose-veins.paired-aching-standing",
    "node.gs028.varicose-veins.paired-aching-standing.2",
    "question.varicose-veins.intervention-referral-after-axial-reflux.v1",
    "concept.varicose-veins.intervention-referral-after-axial-reflux"
  ],
  [
    "case.gs028.varicose-veins.paired-throbbing-thigh",
    "node.gs028.varicose-veins.paired-throbbing-thigh.1",
    "question.varicose-veins.reflux-duplex-evaluation.v2",
    "concept.varicose-veins.reflux-duplex-evaluation"
  ],
  [
    "case.gs028.varicose-veins.paired-throbbing-thigh",
    "node.gs028.varicose-veins.paired-throbbing-thigh.2",
    "question.varicose-veins.intervention-referral-after-axial-reflux.v2",
    "concept.varicose-veins.intervention-referral-after-axial-reflux"
  ],
  [
    "case.gs028.varicose-veins.a-recurrent-after-prior-care",
    "node.gs028.varicose-veins.a-recurrent-after-prior-care.1",
    "question.varicose-veins.reflux-duplex-evaluation.v3",
    "concept.varicose-veins.reflux-duplex-evaluation"
  ],
  [
    "case.gs028.varicose-veins.a-asymmetric-branches",
    "node.gs028.varicose-veins.a-asymmetric-branches.1",
    "question.varicose-veins.reflux-duplex-evaluation.v4",
    "concept.varicose-veins.reflux-duplex-evaluation"
  ],
  [
    "case.gs028.varicose-veins.b-prefers-conservative",
    "node.gs028.varicose-veins.b-prefers-conservative.1",
    "question.varicose-veins.intervention-referral-after-axial-reflux.v3",
    "concept.varicose-veins.intervention-referral-after-axial-reflux"
  ],
  [
    "case.gs028.varicose-veins.b-limited-mobility",
    "node.gs028.varicose-veins.b-limited-mobility.1",
    "question.varicose-veins.intervention-referral-after-axial-reflux.v4",
    "concept.varicose-veins.intervention-referral-after-axial-reflux"
  ],
  [
    "case.gs028.diabetic-foot.a-erythema-purulence",
    "node.gs028.diabetic-foot.a-erythema-purulence.1",
    "question.diabetic-foot-infection.clinical-recognition.v1",
    "concept.diabetic-foot-infection.clinical-recognition"
  ],
  [
    "case.gs028.diabetic-foot.a-cellulitis-spread",
    "node.gs028.diabetic-foot.a-cellulitis-spread.1",
    "question.diabetic-foot-infection.clinical-recognition.v2",
    "concept.diabetic-foot-infection.clinical-recognition"
  ],
  [
    "case.gs028.diabetic-foot.a-systemic-illness",
    "node.gs028.diabetic-foot.a-systemic-illness.1",
    "question.diabetic-foot-infection.clinical-recognition.v3",
    "concept.diabetic-foot-infection.clinical-recognition"
  ],
  [
    "case.gs028.diabetic-foot.a-gangrene-abscess",
    "node.gs028.diabetic-foot.a-gangrene-abscess.1",
    "question.diabetic-foot-infection.clinical-recognition.v4",
    "concept.diabetic-foot-infection.clinical-recognition"
  ],
  [
    "case.gs028.diabetic-foot.b-clean-neuropathic-ulcer",
    "node.gs028.diabetic-foot.b-clean-neuropathic-ulcer.1",
    "question.diabetic-foot-ulcer.no-antibiotics-without-infection.v1",
    "concept.diabetic-foot-ulcer.no-antibiotics-without-infection"
  ],
  [
    "case.gs028.diabetic-foot.b-colonized-no-inflammation",
    "node.gs028.diabetic-foot.b-colonized-no-inflammation.1",
    "question.diabetic-foot-ulcer.no-antibiotics-without-infection.v2",
    "concept.diabetic-foot-ulcer.no-antibiotics-without-infection"
  ],
  [
    "case.gs028.diabetic-foot.b-stable-dry-ulcer",
    "node.gs028.diabetic-foot.b-stable-dry-ulcer.1",
    "question.diabetic-foot-ulcer.no-antibiotics-without-infection.v3",
    "concept.diabetic-foot-ulcer.no-antibiotics-without-infection"
  ],
  [
    "case.gs028.diabetic-foot.b-healing-ulcer-request",
    "node.gs028.diabetic-foot.b-healing-ulcer-request.1",
    "question.diabetic-foot-ulcer.no-antibiotics-without-infection.v4",
    "concept.diabetic-foot-ulcer.no-antibiotics-without-infection"
  ],
  [
    "case.gs028.burn.a-scald-blister",
    "node.gs028.burn.a-scald-blister.1",
    "question.burn.superficial-partial-thickness-recognition.v1",
    "concept.burn.superficial-partial-thickness-recognition"
  ],
  [
    "case.gs028.burn.a-contact-moist",
    "node.gs028.burn.a-contact-moist.1",
    "question.burn.superficial-partial-thickness-recognition.v2",
    "concept.burn.superficial-partial-thickness-recognition"
  ],
  [
    "case.gs028.burn.a-pale-less-sensate",
    "node.gs028.burn.a-pale-less-sensate.1",
    "question.burn.superficial-partial-thickness-recognition.v3",
    "concept.burn.superficial-partial-thickness-recognition"
  ],
  [
    "case.gs028.burn.a-leathery-insensate",
    "node.gs028.burn.a-leathery-insensate.1",
    "question.burn.superficial-partial-thickness-recognition.v4",
    "concept.burn.superficial-partial-thickness-recognition"
  ],
  [
    "case.gs028.burn.b-small-simple-scald",
    "node.gs028.burn.b-small-simple-scald.1",
    "question.burn.referral-consultation-selection.v1",
    "concept.burn.referral-consultation-selection"
  ],
  [
    "case.gs028.burn.b-hand-deep-burn",
    "node.gs028.burn.b-hand-deep-burn.1",
    "question.burn.referral-consultation-selection.v2",
    "concept.burn.referral-consultation-selection"
  ],
  [
    "case.gs028.burn.b-inhalation-concern",
    "node.gs028.burn.b-inhalation-concern.1",
    "question.burn.referral-consultation-selection.v3",
    "concept.burn.referral-consultation-selection"
  ],
  [
    "case.gs028.burn.b-difficult-pain",
    "node.gs028.burn.b-difficult-pain.1",
    "question.burn.referral-consultation-selection.v4",
    "concept.burn.referral-consultation-selection"
  ],
  [
    "case.gs028.hidradenitis-suppurativa.paired-axillary-recurrence",
    "node.gs028.hidradenitis-suppurativa.paired-axillary-recurrence.1",
    "question.hidradenitis-suppurativa.pattern-recognition.v1",
    "concept.hidradenitis-suppurativa.pattern-recognition"
  ],
  [
    "case.gs028.hidradenitis-suppurativa.paired-axillary-recurrence",
    "node.gs028.hidradenitis-suppurativa.paired-axillary-recurrence.2",
    "question.hidradenitis-suppurativa.multimodal-specialist-planning.v1",
    "concept.hidradenitis-suppurativa.multimodal-specialist-planning"
  ],
  [
    "case.gs028.hidradenitis-suppurativa.paired-inframammary-scars",
    "node.gs028.hidradenitis-suppurativa.paired-inframammary-scars.1",
    "question.hidradenitis-suppurativa.pattern-recognition.v2",
    "concept.hidradenitis-suppurativa.pattern-recognition"
  ],
  [
    "case.gs028.hidradenitis-suppurativa.paired-inframammary-scars",
    "node.gs028.hidradenitis-suppurativa.paired-inframammary-scars.2",
    "question.hidradenitis-suppurativa.multimodal-specialist-planning.v2",
    "concept.hidradenitis-suppurativa.multimodal-specialist-planning"
  ],
  [
    "case.gs028.hidradenitis-suppurativa.a-groin-tunnels",
    "node.gs028.hidradenitis-suppurativa.a-groin-tunnels.1",
    "question.hidradenitis-suppurativa.pattern-recognition.v3",
    "concept.hidradenitis-suppurativa.pattern-recognition"
  ],
  [
    "case.gs028.hidradenitis-suppurativa.a-multisite-relapse",
    "node.gs028.hidradenitis-suppurativa.a-multisite-relapse.1",
    "question.hidradenitis-suppurativa.pattern-recognition.v4",
    "concept.hidradenitis-suppurativa.pattern-recognition"
  ],
  [
    "case.gs028.hidradenitis-suppurativa.b-mild-recurrent-nodules",
    "node.gs028.hidradenitis-suppurativa.b-mild-recurrent-nodules.1",
    "question.hidradenitis-suppurativa.multimodal-specialist-planning.v3",
    "concept.hidradenitis-suppurativa.multimodal-specialist-planning"
  ],
  [
    "case.gs028.hidradenitis-suppurativa.b-acute-collection-plus-chronic",
    "node.gs028.hidradenitis-suppurativa.b-acute-collection-plus-chronic.1",
    "question.hidradenitis-suppurativa.multimodal-specialist-planning.v4",
    "concept.hidradenitis-suppurativa.multimodal-specialist-planning"
  ],
  [
    "case.gs028.parastomal-hernia.paired-standing-bulge",
    "node.gs028.parastomal-hernia.paired-standing-bulge.1",
    "question.parastomal-hernia.clinical-recognition.v1",
    "concept.parastomal-hernia.clinical-recognition"
  ],
  [
    "case.gs028.parastomal-hernia.paired-standing-bulge",
    "node.gs028.parastomal-hernia.paired-standing-bulge.2",
    "question.parastomal-hernia.nonurgent-stoma-specialist-management.v1",
    "concept.parastomal-hernia.nonurgent-stoma-specialist-management"
  ],
  [
    "case.gs028.parastomal-hernia.paired-appliance-leak-bulge",
    "node.gs028.parastomal-hernia.paired-appliance-leak-bulge.1",
    "question.parastomal-hernia.clinical-recognition.v2",
    "concept.parastomal-hernia.clinical-recognition"
  ],
  [
    "case.gs028.parastomal-hernia.paired-appliance-leak-bulge",
    "node.gs028.parastomal-hernia.paired-appliance-leak-bulge.2",
    "question.parastomal-hernia.nonurgent-stoma-specialist-management.v2",
    "concept.parastomal-hernia.nonurgent-stoma-specialist-management"
  ],
  [
    "case.gs028.parastomal-hernia.a-uncertain-obesity",
    "node.gs028.parastomal-hernia.a-uncertain-obesity.1",
    "question.parastomal-hernia.clinical-recognition.v3",
    "concept.parastomal-hernia.clinical-recognition"
  ],
  [
    "case.gs028.parastomal-hernia.a-obstructive-bulge",
    "node.gs028.parastomal-hernia.a-obstructive-bulge.1",
    "question.parastomal-hernia.clinical-recognition.v4",
    "concept.parastomal-hernia.clinical-recognition"
  ],
  [
    "case.gs028.parastomal-hernia.b-activity-concern",
    "node.gs028.parastomal-hernia.b-activity-concern.1",
    "question.parastomal-hernia.nonurgent-stoma-specialist-management.v3",
    "concept.parastomal-hernia.nonurgent-stoma-specialist-management"
  ],
  [
    "case.gs028.parastomal-hernia.b-support-preference",
    "node.gs028.parastomal-hernia.b-support-preference.1",
    "question.parastomal-hernia.nonurgent-stoma-specialist-management.v4",
    "concept.parastomal-hernia.nonurgent-stoma-specialist-management"
  ],
  [
    "case.gs028.stoma-prolapse.paired-longer-red-stoma",
    "node.gs028.stoma-prolapse.paired-longer-red-stoma.1",
    "question.stoma-prolapse.viability-obstruction-assessment.v1",
    "concept.stoma-prolapse.viability-obstruction-assessment"
  ],
  [
    "case.gs028.stoma-prolapse.paired-longer-red-stoma",
    "node.gs028.stoma-prolapse.paired-longer-red-stoma.2",
    "question.stoma-prolapse.urgent-surgical-escalation.v1",
    "concept.stoma-prolapse.urgent-surgical-escalation"
  ],
  [
    "case.gs028.stoma-prolapse.paired-intermittent-telescoping",
    "node.gs028.stoma-prolapse.paired-intermittent-telescoping.1",
    "question.stoma-prolapse.viability-obstruction-assessment.v2",
    "concept.stoma-prolapse.viability-obstruction-assessment"
  ],
  [
    "case.gs028.stoma-prolapse.paired-intermittent-telescoping",
    "node.gs028.stoma-prolapse.paired-intermittent-telescoping.2",
    "question.stoma-prolapse.urgent-surgical-escalation.v2",
    "concept.stoma-prolapse.urgent-surgical-escalation"
  ],
  [
    "case.gs028.stoma-prolapse.a-swollen-dusky",
    "node.gs028.stoma-prolapse.a-swollen-dusky.1",
    "question.stoma-prolapse.viability-obstruction-assessment.v3",
    "concept.stoma-prolapse.viability-obstruction-assessment"
  ],
  [
    "case.gs028.stoma-prolapse.a-appliance-trauma",
    "node.gs028.stoma-prolapse.a-appliance-trauma.1",
    "question.stoma-prolapse.viability-obstruction-assessment.v4",
    "concept.stoma-prolapse.viability-obstruction-assessment"
  ],
  [
    "case.gs028.stoma-prolapse.b-ischemic-prolapse",
    "node.gs028.stoma-prolapse.b-ischemic-prolapse.1",
    "question.stoma-prolapse.urgent-surgical-escalation.v3",
    "concept.stoma-prolapse.urgent-surgical-escalation"
  ],
  [
    "case.gs028.stoma-prolapse.b-obstructed-prolapse",
    "node.gs028.stoma-prolapse.b-obstructed-prolapse.1",
    "question.stoma-prolapse.urgent-surgical-escalation.v4.r4",
    "concept.stoma-prolapse.urgent-surgical-escalation"
  ],
  [
    "case.gs028.glasgow-coma-scale.a-e4v5m6",
    "node.gs028.glasgow-coma-scale.a-e4v5m6.1",
    "question.gcs.complete-component-total.v1",
    "concept.gcs.complete-component-total"
  ],
  [
    "case.gs028.glasgow-coma-scale.a-e3v4m6",
    "node.gs028.glasgow-coma-scale.a-e3v4m6.1",
    "question.gcs.complete-component-total.v2",
    "concept.gcs.complete-component-total"
  ],
  [
    "case.gs028.glasgow-coma-scale.a-e2v3m5",
    "node.gs028.glasgow-coma-scale.a-e2v3m5.1",
    "question.gcs.complete-component-total.v3",
    "concept.gcs.complete-component-total"
  ],
  [
    "case.gs028.glasgow-coma-scale.a-e1v2m4",
    "node.gs028.glasgow-coma-scale.a-e1v2m4.1",
    "question.gcs.complete-component-total.v4",
    "concept.gcs.complete-component-total"
  ],
  [
    "case.gs028.glasgow-coma-scale.b-intubated",
    "node.gs028.glasgow-coma-scale.b-intubated.1",
    "question.gcs.verbal-not-testable-documentation.v1",
    "concept.gcs.verbal-not-testable-documentation"
  ],
  [
    "case.gs028.glasgow-coma-scale.b-aphonia-swelling",
    "node.gs028.glasgow-coma-scale.b-aphonia-swelling.1",
    "question.gcs.verbal-not-testable-documentation.v2",
    "concept.gcs.verbal-not-testable-documentation"
  ],
  [
    "case.gs028.glasgow-coma-scale.b-language-barrier-resolved",
    "node.gs028.glasgow-coma-scale.b-language-barrier-resolved.1",
    "question.gcs.verbal-not-testable-documentation.v3",
    "concept.gcs.verbal-not-testable-documentation"
  ],
  [
    "case.gs028.glasgow-coma-scale.b-speaking-valve",
    "node.gs028.glasgow-coma-scale.b-speaking-valve.1",
    "question.gcs.verbal-not-testable-documentation.v4",
    "concept.gcs.verbal-not-testable-documentation"
  ],
  [
    "case.gs028.secondary-lymphedema.paired-arm-after-axillary",
    "node.gs028.secondary-lymphedema.paired-arm-after-axillary.1",
    "question.secondary-lymphedema.clinical-recognition.v1",
    "concept.secondary-lymphedema.clinical-recognition"
  ],
  [
    "case.gs028.secondary-lymphedema.paired-arm-after-axillary",
    "node.gs028.secondary-lymphedema.paired-arm-after-axillary.2",
    "question.secondary-lymphedema.decongestive-therapy-referral.v1",
    "concept.secondary-lymphedema.decongestive-therapy-referral"
  ],
  [
    "case.gs028.secondary-lymphedema.paired-leg-after-groin-nodes",
    "node.gs028.secondary-lymphedema.paired-leg-after-groin-nodes.1",
    "question.secondary-lymphedema.clinical-recognition.v2",
    "concept.secondary-lymphedema.clinical-recognition"
  ],
  [
    "case.gs028.secondary-lymphedema.paired-leg-after-groin-nodes",
    "node.gs028.secondary-lymphedema.paired-leg-after-groin-nodes.2",
    "question.secondary-lymphedema.decongestive-therapy-referral.v2",
    "concept.secondary-lymphedema.decongestive-therapy-referral"
  ],
  [
    "case.gs028.secondary-lymphedema.a-early-pitting-arm",
    "node.gs028.secondary-lymphedema.a-early-pitting-arm.1",
    "question.secondary-lymphedema.clinical-recognition.v3",
    "concept.secondary-lymphedema.clinical-recognition"
  ],
  [
    "case.gs028.secondary-lymphedema.a-late-fibrotic-leg",
    "node.gs028.secondary-lymphedema.a-late-fibrotic-leg.1",
    "question.secondary-lymphedema.clinical-recognition.v4",
    "concept.secondary-lymphedema.clinical-recognition"
  ],
  [
    "case.gs028.secondary-lymphedema.b-garment-discomfort",
    "node.gs028.secondary-lymphedema.b-garment-discomfort.1",
    "question.secondary-lymphedema.decongestive-therapy-referral.v3",
    "concept.secondary-lymphedema.decongestive-therapy-referral"
  ],
  [
    "case.gs028.secondary-lymphedema.b-exercise-question",
    "node.gs028.secondary-lymphedema.b-exercise-question.1",
    "question.secondary-lymphedema.decongestive-therapy-referral.v4",
    "concept.secondary-lymphedema.decongestive-therapy-referral"
  ],
  [
    "case.gs028b.postherniorrhaphy-pain.paired-burning-groin",
    "node.gs028b.postherniorrhaphy-pain.paired-burning-groin.1",
    "question.postherniorrhaphy-pain.neuropathic-pattern-recognition.v1",
    "concept.postherniorrhaphy-pain.neuropathic-pattern-recognition"
  ],
  [
    "case.gs028b.postherniorrhaphy-pain.paired-burning-groin",
    "node.gs028b.postherniorrhaphy-pain.paired-burning-groin.2",
    "question.postherniorrhaphy-pain.targeted-block-specialist-evaluation.v1",
    "concept.postherniorrhaphy-pain.targeted-block-specialist-evaluation"
  ],
  [
    "case.gs028b.postherniorrhaphy-pain.paired-activity-ache",
    "node.gs028b.postherniorrhaphy-pain.paired-activity-ache.1",
    "question.postherniorrhaphy-pain.neuropathic-pattern-recognition.v2",
    "concept.postherniorrhaphy-pain.neuropathic-pattern-recognition"
  ],
  [
    "case.gs028b.postherniorrhaphy-pain.paired-activity-ache",
    "node.gs028b.postherniorrhaphy-pain.paired-activity-ache.2",
    "question.postherniorrhaphy-pain.targeted-block-specialist-evaluation.v2",
    "concept.postherniorrhaphy-pain.targeted-block-specialist-evaluation"
  ],
  [
    "case.gs028b.postherniorrhaphy-pain.a-new-bulge",
    "node.gs028b.postherniorrhaphy-pain.a-new-bulge.1",
    "question.postherniorrhaphy-pain.neuropathic-pattern-recognition.v3",
    "concept.postherniorrhaphy-pain.neuropathic-pattern-recognition"
  ],
  [
    "case.gs028b.postherniorrhaphy-pain.a-sensory-map",
    "node.gs028b.postherniorrhaphy-pain.a-sensory-map.1",
    "question.postherniorrhaphy-pain.neuropathic-pattern-recognition.v4",
    "concept.postherniorrhaphy-pain.neuropathic-pattern-recognition"
  ],
  [
    "case.gs028b.postherniorrhaphy-pain.b-block-result",
    "node.gs028b.postherniorrhaphy-pain.b-block-result.1",
    "question.postherniorrhaphy-pain.targeted-block-specialist-evaluation.v3",
    "concept.postherniorrhaphy-pain.targeted-block-specialist-evaluation"
  ],
  [
    "case.gs028b.postherniorrhaphy-pain.b-negative-block",
    "node.gs028b.postherniorrhaphy-pain.b-negative-block.1",
    "question.postherniorrhaphy-pain.targeted-block-specialist-evaluation.v4",
    "concept.postherniorrhaphy-pain.targeted-block-specialist-evaluation"
  ],
  [
    "case.gs028b.spigelian-hernia.paired-palpable-lateral",
    "node.gs028b.spigelian-hernia.paired-palpable-lateral.1",
    "question.spigelian-hernia.clinical-imaging-recognition.v1",
    "concept.spigelian-hernia.clinical-imaging-recognition"
  ],
  [
    "case.gs028b.spigelian-hernia.paired-palpable-lateral",
    "node.gs028b.spigelian-hernia.paired-palpable-lateral.2",
    "question.spigelian-hernia.elective-repair-referral.v1",
    "concept.spigelian-hernia.elective-repair-referral"
  ],
  [
    "case.gs028b.spigelian-hernia.paired-occult-standing",
    "node.gs028b.spigelian-hernia.paired-occult-standing.1",
    "question.spigelian-hernia.clinical-imaging-recognition.v2",
    "concept.spigelian-hernia.clinical-imaging-recognition"
  ],
  [
    "case.gs028b.spigelian-hernia.paired-occult-standing",
    "node.gs028b.spigelian-hernia.paired-occult-standing.2",
    "question.spigelian-hernia.elective-repair-referral.v2",
    "concept.spigelian-hernia.elective-repair-referral"
  ],
  [
    "case.gs028b.spigelian-hernia.a-completed-ct",
    "node.gs028b.spigelian-hernia.a-completed-ct.1",
    "question.spigelian-hernia.clinical-imaging-recognition.v3",
    "concept.spigelian-hernia.clinical-imaging-recognition"
  ],
  [
    "case.gs028b.spigelian-hernia.a-diffuse-midline",
    "node.gs028b.spigelian-hernia.a-diffuse-midline.1",
    "question.spigelian-hernia.clinical-imaging-recognition.v4",
    "concept.spigelian-hernia.clinical-imaging-recognition"
  ],
  [
    "case.gs028b.spigelian-hernia.b-irreducible-pain",
    "node.gs028b.spigelian-hernia.b-irreducible-pain.1",
    "question.spigelian-hernia.elective-repair-referral.v3",
    "concept.spigelian-hernia.elective-repair-referral"
  ],
  [
    "case.gs028b.spigelian-hernia.b-technique-question",
    "node.gs028b.spigelian-hernia.b-technique-question.1",
    "question.spigelian-hernia.elective-repair-referral.v4",
    "concept.spigelian-hernia.elective-repair-referral"
  ],
  [
    "case.gs028b.mesh-infection.paired-chronic-sinus",
    "node.gs028b.mesh-infection.paired-chronic-sinus.1",
    "question.prosthetic-mesh-infection.deep-infection-recognition.v1",
    "concept.prosthetic-mesh-infection.deep-infection-recognition"
  ],
  [
    "case.gs028b.mesh-infection.paired-chronic-sinus",
    "node.gs028b.mesh-infection.paired-chronic-sinus.2",
    "question.prosthetic-mesh-infection.specialist-source-control-evaluation.v1",
    "concept.prosthetic-mesh-infection.specialist-source-control-evaluation"
  ],
  [
    "case.gs028b.mesh-infection.a-early-cellulitis",
    "node.gs028b.mesh-infection.a-early-cellulitis.1",
    "question.prosthetic-mesh-infection.deep-infection-recognition.v2",
    "concept.prosthetic-mesh-infection.deep-infection-recognition"
  ],
  [
    "case.gs028b.mesh-infection.a-deep-collection",
    "node.gs028b.mesh-infection.a-deep-collection.1",
    "question.prosthetic-mesh-infection.deep-infection-recognition.v3",
    "concept.prosthetic-mesh-infection.deep-infection-recognition"
  ],
  [
    "case.gs028b.mesh-infection.a-enteric-drainage",
    "node.gs028b.mesh-infection.a-enteric-drainage.1",
    "question.prosthetic-mesh-infection.deep-infection-recognition.v4",
    "concept.prosthetic-mesh-infection.deep-infection-recognition"
  ],
  [
    "case.gs028b.mesh-infection.b-septic-collection",
    "node.gs028b.mesh-infection.b-septic-collection.1",
    "question.prosthetic-mesh-infection.specialist-source-control-evaluation.v2",
    "concept.prosthetic-mesh-infection.specialist-source-control-evaluation"
  ],
  [
    "case.gs028b.mesh-infection.b-failed-conservative",
    "node.gs028b.mesh-infection.b-failed-conservative.1",
    "question.prosthetic-mesh-infection.specialist-source-control-evaluation.v3",
    "concept.prosthetic-mesh-infection.specialist-source-control-evaluation"
  ],
  [
    "case.gs028b.mesh-infection.b-superficial-only",
    "node.gs028b.mesh-infection.b-superficial-only.1",
    "question.prosthetic-mesh-infection.specialist-source-control-evaluation.v4",
    "concept.prosthetic-mesh-infection.specialist-source-control-evaluation"
  ],
  [
    "case.gs028b.cirrhosis-perioperative.paired-single-albumin",
    "node.gs028b.cirrhosis-perioperative.paired-single-albumin.1",
    "question.cirrhosis-perioperative-risk.multifactor-assessment.v1",
    "concept.cirrhosis-perioperative-risk.multifactor-assessment"
  ],
  [
    "case.gs028b.cirrhosis-perioperative.paired-single-albumin",
    "node.gs028b.cirrhosis-perioperative.paired-single-albumin.2",
    "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v1",
    "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary"
  ],
  [
    "case.gs028b.cirrhosis-perioperative.a-compensated",
    "node.gs028b.cirrhosis-perioperative.a-compensated.1",
    "question.cirrhosis-perioperative-risk.multifactor-assessment.v2",
    "concept.cirrhosis-perioperative-risk.multifactor-assessment"
  ],
  [
    "case.gs028b.cirrhosis-perioperative.a-portal-hypertension",
    "node.gs028b.cirrhosis-perioperative.a-portal-hypertension.1",
    "question.cirrhosis-perioperative-risk.multifactor-assessment.v3",
    "concept.cirrhosis-perioperative-risk.multifactor-assessment"
  ],
  [
    "case.gs028b.cirrhosis-perioperative.a-center-expertise",
    "node.gs028b.cirrhosis-perioperative.a-center-expertise.1",
    "question.cirrhosis-perioperative-risk.multifactor-assessment.v4",
    "concept.cirrhosis-perioperative-risk.multifactor-assessment"
  ],
  [
    "case.gs028b.cirrhosis-perioperative.b-encephalopathy",
    "node.gs028b.cirrhosis-perioperative.b-encephalopathy.1",
    "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v2",
    "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary"
  ],
  [
    "case.gs028b.cirrhosis-perioperative.b-controlled-followup",
    "node.gs028b.cirrhosis-perioperative.b-controlled-followup.1",
    "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v3",
    "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary"
  ],
  [
    "case.gs028b.cirrhosis-perioperative.b-urgent-different",
    "node.gs028b.cirrhosis-perioperative.b-urgent-different.1",
    "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v4",
    "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary"
  ],
  [
    "case.gs028b.ptld.a-nodes-fever",
    "node.gs028b.ptld.a-nodes-fever.1",
    "question.ptld.posttransplant-pattern-recognition.v1",
    "concept.ptld.posttransplant-pattern-recognition"
  ],
  [
    "case.gs028b.ptld.a-organ-dysfunction",
    "node.gs028b.ptld.a-organ-dysfunction.1",
    "question.ptld.posttransplant-pattern-recognition.v2",
    "concept.ptld.posttransplant-pattern-recognition"
  ],
  [
    "case.gs028b.ptld.a-rising-ebv",
    "node.gs028b.ptld.a-rising-ebv.1",
    "question.ptld.posttransplant-pattern-recognition.v3",
    "concept.ptld.posttransplant-pattern-recognition"
  ],
  [
    "case.gs028b.ptld.a-infection-mimic",
    "node.gs028b.ptld.a-infection-mimic.1",
    "question.ptld.posttransplant-pattern-recognition.v4",
    "concept.ptld.posttransplant-pattern-recognition"
  ],
  [
    "case.gs028b.ptld.b-accessible-node",
    "node.gs028b.ptld.b-accessible-node.1",
    "question.ptld.tissue-diagnosis-coordination.v1",
    "concept.ptld.tissue-diagnosis-coordination"
  ],
  [
    "case.gs028b.ptld.b-extranodal-mass",
    "node.gs028b.ptld.b-extranodal-mass.1",
    "question.ptld.tissue-diagnosis-coordination.v2",
    "concept.ptld.tissue-diagnosis-coordination"
  ],
  [
    "case.gs028b.ptld.b-negative-ebv",
    "node.gs028b.ptld.b-negative-ebv.1",
    "question.ptld.tissue-diagnosis-coordination.v3",
    "concept.ptld.tissue-diagnosis-coordination"
  ],
  [
    "case.gs028b.ptld.b-pathology-returned",
    "node.gs028b.ptld.b-pathology-returned.1",
    "question.ptld.tissue-diagnosis-coordination.v4",
    "concept.ptld.tissue-diagnosis-coordination"
  ],
  [
    "case.gs028b.differentiated-thyroid-cancer.paired-malignant-cytology",
    "node.gs028b.differentiated-thyroid-cancer.paired-malignant-cytology.1",
    "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v1",
    "concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound"
  ],
  [
    "case.gs028b.differentiated-thyroid-cancer.paired-malignant-cytology",
    "node.gs028b.differentiated-thyroid-cancer.paired-malignant-cytology.2",
    "question.differentiated-thyroid-cancer.individualized-surgical-extent.v1.r4",
    "concept.differentiated-thyroid-cancer.individualized-surgical-extent"
  ],
  [
    "case.gs028b.differentiated-thyroid-cancer.a-molecular-malignancy",
    "node.gs028b.differentiated-thyroid-cancer.a-molecular-malignancy.1",
    "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v2",
    "concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound"
  ],
  [
    "case.gs028b.differentiated-thyroid-cancer.a-palpable-node",
    "node.gs028b.differentiated-thyroid-cancer.a-palpable-node.1",
    "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3.r6",
    "concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v2"
  ],
  [
    "case.gs028b.differentiated-thyroid-cancer.a-completed-negative",
    "node.gs028b.differentiated-thyroid-cancer.a-completed-negative.1",
    "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4",
    "concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound"
  ],
  [
    "case.gs028b.differentiated-thyroid-cancer.b-bilateral-disease",
    "node.gs028b.differentiated-thyroid-cancer.b-bilateral-disease.1",
    "question.differentiated-thyroid-cancer.individualized-surgical-extent.v2",
    "concept.differentiated-thyroid-cancer.individualized-surgical-extent"
  ],
  [
    "case.gs028b.differentiated-thyroid-cancer.b-nodal-disease",
    "node.gs028b.differentiated-thyroid-cancer.b-nodal-disease.1",
    "question.differentiated-thyroid-cancer.individualized-surgical-extent.v3",
    "concept.differentiated-thyroid-cancer.individualized-surgical-extent"
  ],
  [
    "case.gs028b.differentiated-thyroid-cancer.b-preference-balance",
    "node.gs028b.differentiated-thyroid-cancer.b-preference-balance.1",
    "question.differentiated-thyroid-cancer.individualized-surgical-extent.v4",
    "concept.differentiated-thyroid-cancer.individualized-surgical-extent"
  ],
  [
    "case.gs028b.nipple-discharge.paired-bloody-single-duct",
    "node.gs028b.nipple-discharge.paired-bloody-single-duct.1",
    "question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1.r6",
    "concept.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition"
  ],
  [
    "case.gs028b.nipple-discharge.paired-bloody-single-duct",
    "node.gs028b.nipple-discharge.paired-bloody-single-duct.2",
    "question.pathologic-nipple-discharge.diagnostic-imaging.v1.r7",
    "concept.pathologic-nipple-discharge.diagnostic-imaging"
  ],
  [
    "case.gs028b.nipple-discharge.a-bilateral-expressed",
    "node.gs028b.nipple-discharge.a-bilateral-expressed.1",
    "question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v2",
    "concept.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition"
  ],
  [
    "case.gs028b.nipple-discharge.a-serous-unilateral",
    "node.gs028b.nipple-discharge.a-serous-unilateral.1",
    "question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v3",
    "concept.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition"
  ],
  [
    "case.gs028b.nipple-discharge.a-male-spontaneous",
    "node.gs028b.nipple-discharge.a-male-spontaneous.1",
    "question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v4",
    "concept.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition"
  ],
  [
    "case.gs028b.nipple-discharge.b-physiologic-no-image",
    "node.gs028b.nipple-discharge.b-physiologic-no-image.1",
    "question.pathologic-nipple-discharge.diagnostic-imaging.v2",
    "concept.pathologic-nipple-discharge.diagnostic-imaging"
  ],
  [
    "case.gs028b.nipple-discharge.b-male-pathologic",
    "node.gs028b.nipple-discharge.b-male-pathologic.1",
    "question.pathologic-nipple-discharge.diagnostic-imaging.v3",
    "concept.pathologic-nipple-discharge.diagnostic-imaging"
  ],
  [
    "case.gs028b.nipple-discharge.b-negative-first-line",
    "node.gs028b.nipple-discharge.b-negative-first-line.1",
    "question.pathologic-nipple-discharge.diagnostic-imaging.v4",
    "concept.pathologic-nipple-discharge.diagnostic-imaging"
  ],
  [
    "case.gs028b.post-neoadjuvant-breast.paired-marker-residual",
    "node.gs028b.post-neoadjuvant-breast.paired-marker-residual.1",
    "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1",
    "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping"
  ],
  [
    "case.gs028b.post-neoadjuvant-breast.paired-marker-residual",
    "node.gs028b.post-neoadjuvant-breast.paired-marker-residual.2",
    "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v1",
    "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection"
  ],
  [
    "case.gs028b.post-neoadjuvant-breast.a-residual-palpable",
    "node.gs028b.post-neoadjuvant-breast.a-residual-palpable.1",
    "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v2",
    "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping"
  ],
  [
    "case.gs028b.post-neoadjuvant-breast.a-axillary-response",
    "node.gs028b.post-neoadjuvant-breast.a-axillary-response.1",
    "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v3",
    "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping"
  ],
  [
    "case.gs028b.post-neoadjuvant-breast.a-no-marker",
    "node.gs028b.post-neoadjuvant-breast.a-no-marker.1",
    "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v4",
    "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping"
  ],
  [
    "case.gs028b.post-neoadjuvant-breast.b-diffuse-residual",
    "node.gs028b.post-neoadjuvant-breast.b-diffuse-residual.1",
    "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2",
    "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection"
  ],
  [
    "case.gs028b.post-neoadjuvant-breast.b-radiation-declined",
    "node.gs028b.post-neoadjuvant-breast.b-radiation-declined.1",
    "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v3",
    "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection"
  ],
  [
    "case.gs028b.post-neoadjuvant-breast.b-oncoplastic-conservation",
    "node.gs028b.post-neoadjuvant-breast.b-oncoplastic-conservation.1",
    "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v4",
    "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection"
  ],
  [
    "case.gs028b.basal-cell-carcinoma.a-pearly-nodule",
    "node.gs028b.basal-cell-carcinoma.a-pearly-nodule.1",
    "question.basal-cell-carcinoma.clinical-pattern-recognition.v1",
    "concept.basal-cell-carcinoma.clinical-pattern-recognition"
  ],
  [
    "case.gs028b.basal-cell-carcinoma.a-ulcerated-ear",
    "node.gs028b.basal-cell-carcinoma.a-ulcerated-ear.1",
    "question.basal-cell-carcinoma.clinical-pattern-recognition.v2",
    "concept.basal-cell-carcinoma.clinical-pattern-recognition"
  ],
  [
    "case.gs028b.basal-cell-carcinoma.a-scar-like",
    "node.gs028b.basal-cell-carcinoma.a-scar-like.1",
    "question.basal-cell-carcinoma.clinical-pattern-recognition.v3",
    "concept.basal-cell-carcinoma.clinical-pattern-recognition"
  ],
  [
    "case.gs028b.basal-cell-carcinoma.a-recurrent-crusting",
    "node.gs028b.basal-cell-carcinoma.a-recurrent-crusting.1",
    "question.basal-cell-carcinoma.clinical-pattern-recognition.v4",
    "concept.basal-cell-carcinoma.clinical-pattern-recognition"
  ],
  [
    "case.gs028b.basal-cell-carcinoma.b-small-nodular",
    "node.gs028b.basal-cell-carcinoma.b-small-nodular.1",
    "question.basal-cell-carcinoma.local-invasion-metastasis-counseling.v1",
    "concept.basal-cell-carcinoma.local-invasion-metastasis-counseling"
  ],
  [
    "case.gs028b.basal-cell-carcinoma.b-neglected-facial",
    "node.gs028b.basal-cell-carcinoma.b-neglected-facial.1",
    "question.basal-cell-carcinoma.local-invasion-metastasis-counseling.v2",
    "concept.basal-cell-carcinoma.local-invasion-metastasis-counseling"
  ],
  [
    "case.gs028b.basal-cell-carcinoma.b-rare-metastasis",
    "node.gs028b.basal-cell-carcinoma.b-rare-metastasis.1",
    "question.basal-cell-carcinoma.local-invasion-metastasis-counseling.v3",
    "concept.basal-cell-carcinoma.local-invasion-metastasis-counseling"
  ],
  [
    "case.gs028b.basal-cell-carcinoma.b-recurrent-local",
    "node.gs028b.basal-cell-carcinoma.b-recurrent-local.1",
    "question.basal-cell-carcinoma.local-invasion-metastasis-counseling.v4",
    "concept.basal-cell-carcinoma.local-invasion-metastasis-counseling"
  ],
  [
    "case.gs028b.preoperative-nutrition.paired-poor-intake-loss",
    "node.gs028b.preoperative-nutrition.paired-poor-intake-loss.1",
    "question.preoperative-nutrition.nutritional-risk-screening.v1",
    "concept.preoperative-nutrition.nutritional-risk-screening"
  ],
  [
    "case.gs028b.preoperative-nutrition.paired-poor-intake-loss",
    "node.gs028b.preoperative-nutrition.paired-poor-intake-loss.2",
    "question.preoperative-nutrition.oral-enteral-first-line.v1",
    "concept.preoperative-nutrition.oral-enteral-first-line"
  ],
  [
    "case.gs028b.preoperative-nutrition.a-albumin-only",
    "node.gs028b.preoperative-nutrition.a-albumin-only.1",
    "question.preoperative-nutrition.nutritional-risk-screening.v2",
    "concept.preoperative-nutrition.nutritional-risk-screening"
  ],
  [
    "case.gs028b.preoperative-nutrition.a-apparently-well",
    "node.gs028b.preoperative-nutrition.a-apparently-well.1",
    "question.preoperative-nutrition.nutritional-risk-screening.v3",
    "concept.preoperative-nutrition.nutritional-risk-screening"
  ],
  [
    "case.gs028b.preoperative-nutrition.a-positive-screen",
    "node.gs028b.preoperative-nutrition.a-positive-screen.1",
    "question.preoperative-nutrition.nutritional-risk-screening.v4",
    "concept.preoperative-nutrition.nutritional-risk-screening"
  ],
  [
    "case.gs028b.preoperative-nutrition.b-oral-inadequate",
    "node.gs028b.preoperative-nutrition.b-oral-inadequate.1",
    "question.preoperative-nutrition.oral-enteral-first-line.v2",
    "concept.preoperative-nutrition.oral-enteral-first-line"
  ],
  [
    "case.gs028b.preoperative-nutrition.b-obstruction",
    "node.gs028b.preoperative-nutrition.b-obstruction.1",
    "question.preoperative-nutrition.oral-enteral-first-line.v3",
    "concept.preoperative-nutrition.oral-enteral-first-line"
  ],
  [
    "case.gs028b.preoperative-nutrition.b-functional-gut-pn-request",
    "node.gs028b.preoperative-nutrition.b-functional-gut-pn-request.1",
    "question.preoperative-nutrition.oral-enteral-first-line.v4",
    "concept.preoperative-nutrition.oral-enteral-first-line"
  ],
  [
    "case.gs028se.independent-t-paired-t.a-two-teams",
    "node.gs028se.independent-t-paired-t.a-two-teams.1",
    "question.statistics-ethics.independent-t.v1",
    "concept.statistics-ethics.independent-t"
  ],
  [
    "case.gs028se.independent-t-paired-t.a-two-cohorts",
    "node.gs028se.independent-t-paired-t.a-two-cohorts.1",
    "question.statistics-ethics.independent-t.v2",
    "concept.statistics-ethics.independent-t"
  ],
  [
    "case.gs028se.independent-t-paired-t.a-two-shifts",
    "node.gs028se.independent-t-paired-t.a-two-shifts.1",
    "question.statistics-ethics.independent-t.v3",
    "concept.statistics-ethics.independent-t"
  ],
  [
    "case.gs028se.independent-t-paired-t.a-two-scripts",
    "node.gs028se.independent-t-paired-t.a-two-scripts.1",
    "question.statistics-ethics.independent-t.v4",
    "concept.statistics-ethics.independent-t"
  ],
  [
    "case.gs028se.independent-t-paired-t.b-same-rooms",
    "node.gs028se.independent-t-paired-t.b-same-rooms.1",
    "question.statistics-ethics.paired-t.v1",
    "concept.statistics-ethics.paired-t"
  ],
  [
    "case.gs028se.independent-t-paired-t.b-same-trainees",
    "node.gs028se.independent-t-paired-t.b-same-trainees.1",
    "question.statistics-ethics.paired-t.v2",
    "concept.statistics-ethics.paired-t"
  ],
  [
    "case.gs028se.independent-t-paired-t.b-matched-sites",
    "node.gs028se.independent-t-paired-t.b-matched-sites.1",
    "question.statistics-ethics.paired-t.v3",
    "concept.statistics-ethics.paired-t"
  ],
  [
    "case.gs028se.independent-t-paired-t.b-same-workers",
    "node.gs028se.independent-t-paired-t.b-same-workers.1",
    "question.statistics-ethics.paired-t.v4",
    "concept.statistics-ethics.paired-t"
  ],
  [
    "case.gs028se.one-way-anova-rank-sum.a-three-teams",
    "node.gs028se.one-way-anova-rank-sum.a-three-teams.1",
    "question.statistics-ethics.one-way-anova.v1",
    "concept.statistics-ethics.one-way-anova"
  ],
  [
    "case.gs028se.one-way-anova-rank-sum.a-four-formats",
    "node.gs028se.one-way-anova-rank-sum.a-four-formats.1",
    "question.statistics-ethics.one-way-anova.v2",
    "concept.statistics-ethics.one-way-anova"
  ],
  [
    "case.gs028se.one-way-anova-rank-sum.a-three-sites",
    "node.gs028se.one-way-anova-rank-sum.a-three-sites.1",
    "question.statistics-ethics.one-way-anova.v3",
    "concept.statistics-ethics.one-way-anova"
  ],
  [
    "case.gs028se.one-way-anova-rank-sum.a-five-signs",
    "node.gs028se.one-way-anova-rank-sum.a-five-signs.1",
    "question.statistics-ethics.one-way-anova.v4",
    "concept.statistics-ethics.one-way-anova"
  ],
  [
    "case.gs028se.one-way-anova-rank-sum.b-ordinal-teams",
    "node.gs028se.one-way-anova-rank-sum.b-ordinal-teams.1",
    "question.statistics-ethics.rank-sum.v1",
    "concept.statistics-ethics.rank-sum"
  ],
  [
    "case.gs028se.one-way-anova-rank-sum.b-skewed-delays",
    "node.gs028se.one-way-anova-rank-sum.b-skewed-delays.1",
    "question.statistics-ethics.rank-sum.v2",
    "concept.statistics-ethics.rank-sum"
  ],
  [
    "case.gs028se.one-way-anova-rank-sum.b-independent-likert",
    "node.gs028se.one-way-anova-rank-sum.b-independent-likert.1",
    "question.statistics-ethics.rank-sum.v3",
    "concept.statistics-ethics.rank-sum"
  ],
  [
    "case.gs028se.one-way-anova-rank-sum.b-two-queues",
    "node.gs028se.one-way-anova-rank-sum.b-two-queues.1",
    "question.statistics-ethics.rank-sum.v4",
    "concept.statistics-ethics.rank-sum"
  ],
  [
    "case.gs028se.signed-rank-chi-square.a-paired-workload",
    "node.gs028se.signed-rank-chi-square.a-paired-workload.1",
    "question.statistics-ethics.signed-rank.v1",
    "concept.statistics-ethics.signed-rank"
  ],
  [
    "case.gs028se.signed-rank-chi-square.a-same-rooms-skewed",
    "node.gs028se.signed-rank-chi-square.a-same-rooms-skewed.1",
    "question.statistics-ethics.signed-rank.v2",
    "concept.statistics-ethics.signed-rank"
  ],
  [
    "case.gs028se.signed-rank-chi-square.a-matched-dyads",
    "node.gs028se.signed-rank-chi-square.a-matched-dyads.1",
    "question.statistics-ethics.signed-rank.v3",
    "concept.statistics-ethics.signed-rank"
  ],
  [
    "case.gs028se.signed-rank-chi-square.a-pre-post-counts",
    "node.gs028se.signed-rank-chi-square.a-pre-post-counts.1",
    "question.statistics-ethics.signed-rank.v4",
    "concept.statistics-ethics.signed-rank"
  ],
  [
    "case.gs028se.signed-rank-chi-square.b-role-by-choice",
    "node.gs028se.signed-rank-chi-square.b-role-by-choice.1",
    "question.statistics-ethics.chi-square.v1",
    "concept.statistics-ethics.chi-square"
  ],
  [
    "case.gs028se.signed-rank-chi-square.b-shift-by-response",
    "node.gs028se.signed-rank-chi-square.b-shift-by-response.1",
    "question.statistics-ethics.chi-square.v2",
    "concept.statistics-ethics.chi-square"
  ],
  [
    "case.gs028se.signed-rank-chi-square.b-badge-by-completion",
    "node.gs028se.signed-rank-chi-square.b-badge-by-completion.1",
    "question.statistics-ethics.chi-square.v3",
    "concept.statistics-ethics.chi-square"
  ],
  [
    "case.gs028se.signed-rank-chi-square.b-site-by-category",
    "node.gs028se.signed-rank-chi-square.b-site-by-category.1",
    "question.statistics-ethics.chi-square.v4",
    "concept.statistics-ethics.chi-square"
  ],
  [
    "case.gs028se.fisher-exact-study-design.a-rare-event",
    "node.gs028se.fisher-exact-study-design.a-rare-event.1",
    "question.statistics-ethics.fisher-exact.v1",
    "concept.statistics-ethics.fisher-exact"
  ],
  [
    "case.gs028se.fisher-exact-study-design.a-tiny-pilot",
    "node.gs028se.fisher-exact-study-design.a-tiny-pilot.1",
    "question.statistics-ethics.fisher-exact.v2.r3",
    "concept.statistics-ethics.fisher-exact"
  ],
  [
    "case.gs028se.fisher-exact-study-design.a-sparse-exposure",
    "node.gs028se.fisher-exact-study-design.a-sparse-exposure.1",
    "question.statistics-ethics.fisher-exact.v3",
    "concept.statistics-ethics.fisher-exact"
  ],
  [
    "case.gs028se.fisher-exact-study-design.a-small-response",
    "node.gs028se.fisher-exact-study-design.a-small-response.1",
    "question.statistics-ethics.fisher-exact.v4",
    "concept.statistics-ethics.fisher-exact"
  ],
  [
    "case.gs028se.fisher-exact-study-design.b-cohort-followup",
    "node.gs028se.fisher-exact-study-design.b-cohort-followup.1",
    "question.statistics-ethics.study-design.v1",
    "concept.statistics-ethics.study-design"
  ],
  [
    "case.gs028se.fisher-exact-study-design.b-random-scripts",
    "node.gs028se.fisher-exact-study-design.b-random-scripts.1",
    "question.statistics-ethics.study-design.v2",
    "concept.statistics-ethics.study-design"
  ],
  [
    "case.gs028se.fisher-exact-study-design.b-case-control",
    "node.gs028se.fisher-exact-study-design.b-case-control.1",
    "question.statistics-ethics.study-design.v3",
    "concept.statistics-ethics.study-design"
  ],
  [
    "case.gs028se.fisher-exact-study-design.b-cross-sectional",
    "node.gs028se.fisher-exact-study-design.b-cross-sectional.1",
    "question.statistics-ethics.study-design.v4",
    "concept.statistics-ethics.study-design"
  ],
  [
    "case.gs028se.bias-confounding-sensitivity-specificity.a-baseline-shift",
    "node.gs028se.bias-confounding-sensitivity-specificity.a-baseline-shift.1",
    "question.statistics-ethics.bias-confounding.v1",
    "concept.statistics-ethics.bias-confounding"
  ],
  [
    "case.gs028se.bias-confounding-sensitivity-specificity.a-night-excluded",
    "node.gs028se.bias-confounding-sensitivity-specificity.a-night-excluded.1",
    "question.statistics-ethics.bias-confounding.v2",
    "concept.statistics-ethics.bias-confounding"
  ],
  [
    "case.gs028se.bias-confounding-sensitivity-specificity.a-recall-timing",
    "node.gs028se.bias-confounding-sensitivity-specificity.a-recall-timing.1",
    "question.statistics-ethics.bias-confounding.v3",
    "concept.statistics-ethics.bias-confounding"
  ],
  [
    "case.gs028se.bias-confounding-sensitivity-specificity.a-adjusted-model",
    "node.gs028se.bias-confounding-sensitivity-specificity.a-adjusted-model.1",
    "question.statistics-ethics.bias-confounding.v4",
    "concept.statistics-ethics.bias-confounding"
  ],
  [
    "case.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-90",
    "node.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-90.1",
    "question.statistics-ethics.sensitivity-specificity.v1",
    "concept.statistics-ethics.sensitivity-specificity"
  ],
  [
    "case.gs028se.bias-confounding-sensitivity-specificity.b-specificity-95",
    "node.gs028se.bias-confounding-sensitivity-specificity.b-specificity-95.1",
    "question.statistics-ethics.sensitivity-specificity.v2",
    "concept.statistics-ethics.sensitivity-specificity"
  ],
  [
    "case.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-80",
    "node.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-80.1",
    "question.statistics-ethics.sensitivity-specificity.v3",
    "concept.statistics-ethics.sensitivity-specificity"
  ],
  [
    "case.gs028se.bias-confounding-sensitivity-specificity.b-specificity-70",
    "node.gs028se.bias-confounding-sensitivity-specificity.b-specificity-70.1",
    "question.statistics-ethics.sensitivity-specificity.v4",
    "concept.statistics-ethics.sensitivity-specificity"
  ],
  [
    "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-higher-prevalence",
    "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-higher-prevalence.1",
    "question.statistics-ethics.predictive-value-prevalence.v1",
    "concept.statistics-ethics.predictive-value-prevalence"
  ],
  [
    "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence",
    "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.1",
    "question.statistics-ethics.predictive-value-prevalence.v2",
    "concept.statistics-ethics.predictive-value-prevalence"
  ],
  [
    "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-ppv-table",
    "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-ppv-table.1",
    "question.statistics-ethics.predictive-value-prevalence.v3",
    "concept.statistics-ethics.predictive-value-prevalence"
  ],
  [
    "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed",
    "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed.1",
    "question.statistics-ethics.predictive-value-prevalence.v4",
    "concept.statistics-ethics.predictive-value-prevalence"
  ],
  [
    "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-cohort-risk",
    "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-cohort-risk.1",
    "question.statistics-ethics.risk-ratio-odds-ratio.v1",
    "concept.statistics-ethics.risk-ratio-odds-ratio"
  ],
  [
    "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-case-control-or",
    "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-case-control-or.1",
    "question.statistics-ethics.risk-ratio-odds-ratio.v2",
    "concept.statistics-ethics.risk-ratio-odds-ratio"
  ],
  [
    "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-adjusted-odds",
    "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-adjusted-odds.1",
    "question.statistics-ethics.risk-ratio-odds-ratio.v3.r3",
    "concept.statistics-ethics.risk-ratio-odds-ratio"
  ],
  [
    "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-rare-not-identical",
    "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-rare-not-identical.1",
    "question.statistics-ethics.risk-ratio-odds-ratio.v4.r3",
    "concept.statistics-ethics.risk-ratio-odds-ratio"
  ],
  [
    "case.gs028se.arr-nnt-p-value.a-arr-ten",
    "node.gs028se.arr-nnt-p-value.a-arr-ten.1",
    "question.statistics-ethics.arr-nnt.v1",
    "concept.statistics-ethics.arr-nnt"
  ],
  [
    "case.gs028se.arr-nnt-p-value.a-arr-five",
    "node.gs028se.arr-nnt-p-value.a-arr-five.1",
    "question.statistics-ethics.arr-nnt.v2",
    "concept.statistics-ethics.arr-nnt"
  ],
  [
    "case.gs028se.arr-nnt-p-value.a-arr-twenty",
    "node.gs028se.arr-nnt-p-value.a-arr-twenty.1",
    "question.statistics-ethics.arr-nnt.v3",
    "concept.statistics-ethics.arr-nnt"
  ],
  [
    "case.gs028se.arr-nnt-p-value.a-arr-six",
    "node.gs028se.arr-nnt-p-value.a-arr-six.1",
    "question.statistics-ethics.arr-nnt.v4",
    "concept.statistics-ethics.arr-nnt"
  ],
  [
    "case.gs028se.arr-nnt-p-value.b-p-003",
    "node.gs028se.arr-nnt-p-value.b-p-003.1",
    "question.statistics-ethics.p-value.v1.r4",
    "concept.statistics-ethics.p-value"
  ],
  [
    "case.gs028se.arr-nnt-p-value.b-p-040",
    "node.gs028se.arr-nnt-p-value.b-p-040.1",
    "question.statistics-ethics.p-value.v2.r6",
    "concept.statistics-ethics.p-value.v2"
  ],
  [
    "case.gs028se.arr-nnt-p-value.b-p-0001",
    "node.gs028se.arr-nnt-p-value.b-p-0001.1",
    "question.statistics-ethics.p-value.v3.r4",
    "concept.statistics-ethics.p-value"
  ],
  [
    "case.gs028se.arr-nnt-p-value.b-p-008",
    "node.gs028se.arr-nnt-p-value.b-p-008.1",
    "question.statistics-ethics.p-value.v4.r3",
    "concept.statistics-ethics.p-value"
  ],
  [
    "case.gs028se.confidence-interval-errors-power.a-ratio-crosses",
    "node.gs028se.confidence-interval-errors-power.a-ratio-crosses.1",
    "question.statistics-ethics.confidence-interval.v1.r3",
    "concept.statistics-ethics.confidence-interval"
  ],
  [
    "case.gs028se.confidence-interval-errors-power.a-difference-excludes",
    "node.gs028se.confidence-interval-errors-power.a-difference-excludes.1",
    "question.statistics-ethics.confidence-interval.v2",
    "concept.statistics-ethics.confidence-interval"
  ],
  [
    "case.gs028se.confidence-interval-errors-power.a-precision-width",
    "node.gs028se.confidence-interval-errors-power.a-precision-width.1",
    "question.statistics-ethics.confidence-interval.v3",
    "concept.statistics-ethics.confidence-interval"
  ],
  [
    "case.gs028se.confidence-interval-errors-power.a-repeated-sampling",
    "node.gs028se.confidence-interval-errors-power.a-repeated-sampling.1",
    "question.statistics-ethics.confidence-interval.v4",
    "concept.statistics-ethics.confidence-interval"
  ],
  [
    "case.gs028se.confidence-interval-errors-power.b-type-one",
    "node.gs028se.confidence-interval-errors-power.b-type-one.1",
    "question.statistics-ethics.errors-power.v1",
    "concept.statistics-ethics.errors-power"
  ],
  [
    "case.gs028se.confidence-interval-errors-power.b-type-two",
    "node.gs028se.confidence-interval-errors-power.b-type-two.1",
    "question.statistics-ethics.errors-power.v2",
    "concept.statistics-ethics.errors-power"
  ],
  [
    "case.gs028se.confidence-interval-errors-power.b-power",
    "node.gs028se.confidence-interval-errors-power.b-power.1",
    "question.statistics-ethics.errors-power.v3",
    "concept.statistics-ethics.errors-power"
  ],
  [
    "case.gs028se.confidence-interval-errors-power.b-post-hoc",
    "node.gs028se.confidence-interval-errors-power.b-post-hoc.1",
    "question.statistics-ethics.errors-power.v4",
    "concept.statistics-ethics.errors-power"
  ],
  [
    "case.gs028se.pdsa-act-qi-measures.a-adopt-next",
    "node.gs028se.pdsa-act-qi-measures.a-adopt-next.1",
    "question.quality-improvement.pdsa-act-and-iterate.v1",
    "concept.quality-improvement.pdsa-act-and-iterate"
  ],
  [
    "case.gs028se.pdsa-act-qi-measures.a-adapt-burden",
    "node.gs028se.pdsa-act-qi-measures.a-adapt-burden.1",
    "question.quality-improvement.pdsa-act-and-iterate.v2",
    "concept.quality-improvement.pdsa-act-and-iterate"
  ],
  [
    "case.gs028se.pdsa-act-qi-measures.a-abandon-harm",
    "node.gs028se.pdsa-act-qi-measures.a-abandon-harm.1",
    "question.quality-improvement.pdsa-act-and-iterate.v3.r8",
    "concept.quality-improvement.pdsa-act-and-iterate"
  ],
  [
    "case.gs028se.pdsa-act-qi-measures.a-incomplete-data",
    "node.gs028se.pdsa-act-qi-measures.a-incomplete-data.1",
    "question.quality-improvement.pdsa-act-and-iterate.v4",
    "concept.quality-improvement.pdsa-act-and-iterate"
  ],
  [
    "case.gs028se.pdsa-act-qi-measures.b-check-in",
    "node.gs028se.pdsa-act-qi-measures.b-check-in.1",
    "question.statistics-ethics.qi-measures.v1",
    "concept.statistics-ethics.qi-measures"
  ],
  [
    "case.gs028se.pdsa-act-qi-measures.b-preprocedure-reminder",
    "node.gs028se.pdsa-act-qi-measures.b-preprocedure-reminder.1",
    "question.statistics-ethics.qi-measures.v2",
    "concept.statistics-ethics.qi-measures"
  ],
  [
    "case.gs028se.pdsa-act-qi-measures.b-supply-cart",
    "node.gs028se.pdsa-act-qi-measures.b-supply-cart.1",
    "question.statistics-ethics.qi-measures.v3",
    "concept.statistics-ethics.qi-measures"
  ],
  [
    "case.gs028se.pdsa-act-qi-measures.b-handoff-template",
    "node.gs028se.pdsa-act-qi-measures.b-handoff-template.1",
    "question.statistics-ethics.qi-measures.v4",
    "concept.statistics-ethics.qi-measures"
  ],
  [
    "case.gs028se.qualified-interpreter-informed-consent.paired-qualified-interpreter-1",
    "node.gs028se.qualified-interpreter-informed-consent.paired-qualified-interpreter-1.1",
    "question.statistics-ethics.qualified-interpreter.v1",
    "concept.statistics-ethics.qualified-interpreter"
  ],
  [
    "case.gs028se.qualified-interpreter-informed-consent.paired-qualified-interpreter-1",
    "node.gs028se.qualified-interpreter-informed-consent.paired-qualified-interpreter-1.2",
    "question.statistics-ethics.informed-consent.v1",
    "concept.statistics-ethics.informed-consent"
  ],
  [
    "case.gs028se.qualified-interpreter-informed-consent.paired-qualified-interpreter-2",
    "node.gs028se.qualified-interpreter-informed-consent.paired-qualified-interpreter-2.1",
    "question.statistics-ethics.qualified-interpreter.v2",
    "concept.statistics-ethics.qualified-interpreter"
  ],
  [
    "case.gs028se.qualified-interpreter-informed-consent.paired-qualified-interpreter-2",
    "node.gs028se.qualified-interpreter-informed-consent.paired-qualified-interpreter-2.2",
    "question.statistics-ethics.informed-consent.v2",
    "concept.statistics-ethics.informed-consent"
  ],
  [
    "case.gs028se.qualified-interpreter-informed-consent.paired-qualified-interpreter-3",
    "node.gs028se.qualified-interpreter-informed-consent.paired-qualified-interpreter-3.1",
    "question.statistics-ethics.qualified-interpreter.v3",
    "concept.statistics-ethics.qualified-interpreter"
  ],
  [
    "case.gs028se.qualified-interpreter-informed-consent.paired-qualified-interpreter-3",
    "node.gs028se.qualified-interpreter-informed-consent.paired-qualified-interpreter-3.2",
    "question.statistics-ethics.informed-consent.v3",
    "concept.statistics-ethics.informed-consent"
  ],
  [
    "case.gs028se.qualified-interpreter-informed-consent.paired-qualified-interpreter-4",
    "node.gs028se.qualified-interpreter-informed-consent.paired-qualified-interpreter-4.1",
    "question.statistics-ethics.qualified-interpreter.v4",
    "concept.statistics-ethics.qualified-interpreter"
  ],
  [
    "case.gs028se.qualified-interpreter-informed-consent.paired-qualified-interpreter-4",
    "node.gs028se.qualified-interpreter-informed-consent.paired-qualified-interpreter-4.2",
    "question.statistics-ethics.informed-consent.v4",
    "concept.statistics-ethics.informed-consent"
  ],
  [
    "case.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-1",
    "node.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-1.1",
    "question.statistics-ethics.capacity-refusal.v1",
    "concept.statistics-ethics.capacity-refusal"
  ],
  [
    "case.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-2",
    "node.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-2.1",
    "question.statistics-ethics.capacity-refusal.v2",
    "concept.statistics-ethics.capacity-refusal"
  ],
  [
    "case.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3",
    "node.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.1",
    "question.statistics-ethics.capacity-refusal.v3",
    "concept.statistics-ethics.capacity-refusal"
  ],
  [
    "case.gs028se.p2e.capacity-refusal.v4.varicose",
    "node.gs028se.p2e.capacity-refusal.v4.varicose.1",
    "question.statistics-ethics.capacity-refusal.v4",
    "concept.statistics-ethics.capacity-refusal"
  ],
  [
    "case.gs028se.p2e.capacity-refusal.v4.varicose",
    "node.gs028se.p2e.capacity-refusal.v4.varicose.2",
    "question.varicose-veins.intervention-referral-after-axial-reflux.v1.p2e.capacity-refusal.v4",
    "concept.varicose-veins.intervention-referral-after-axial-reflux"
  ],
  [
    "case.gs028se.capacity-refusal-surrogate-decisions.b-surrogate-decisions-1",
    "node.gs028se.capacity-refusal-surrogate-decisions.b-surrogate-decisions-1.1",
    "question.statistics-ethics.surrogate-decisions.v1",
    "concept.statistics-ethics.surrogate-decisions"
  ],
  [
    "case.gs028se.capacity-refusal-surrogate-decisions.b-surrogate-decisions-2",
    "node.gs028se.capacity-refusal-surrogate-decisions.b-surrogate-decisions-2.1",
    "question.statistics-ethics.surrogate-decisions.v2",
    "concept.statistics-ethics.surrogate-decisions"
  ],
  [
    "case.gs028se.capacity-refusal-surrogate-decisions.b-surrogate-decisions-3",
    "node.gs028se.capacity-refusal-surrogate-decisions.b-surrogate-decisions-3.1",
    "question.statistics-ethics.surrogate-decisions.v3",
    "concept.statistics-ethics.surrogate-decisions"
  ],
  [
    "case.gs028se.capacity-refusal-surrogate-decisions.b-surrogate-decisions-4",
    "node.gs028se.capacity-refusal-surrogate-decisions.b-surrogate-decisions-4.1",
    "question.statistics-ethics.surrogate-decisions.v4",
    "concept.statistics-ethics.surrogate-decisions"
  ],
  [
    "case.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-1",
    "node.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-1.1",
    "question.statistics-ethics.perioperative-dnr.v1",
    "concept.statistics-ethics.perioperative-dnr"
  ],
  [
    "case.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-2",
    "node.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-2.1",
    "question.statistics-ethics.perioperative-dnr.v2",
    "concept.statistics-ethics.perioperative-dnr"
  ],
  [
    "case.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-3",
    "node.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-3.1",
    "question.statistics-ethics.perioperative-dnr.v3",
    "concept.statistics-ethics.perioperative-dnr"
  ],
  [
    "case.gs028se.p2e.perioperative-dnr.v4.perianal-abscess",
    "node.gs028se.p2e.perioperative-dnr.v4.perianal-abscess.1",
    "question.statistics-ethics.perioperative-dnr.v4",
    "concept.statistics-ethics.perioperative-dnr"
  ],
  [
    "case.gs028se.p2e.perioperative-dnr.v4.perianal-abscess",
    "node.gs028se.p2e.perioperative-dnr.v4.perianal-abscess.2",
    "question.perianal-abscess.prompt-drainage.v1.p2e.perioperative-dnr.v4",
    "concept.perianal-abscess.prompt-drainage"
  ],
  [
    "case.gs028se.perioperative-dnr-error-disclosure.b-error-disclosure-1",
    "node.gs028se.perioperative-dnr-error-disclosure.b-error-disclosure-1.1",
    "question.statistics-ethics.error-disclosure.v1",
    "concept.statistics-ethics.error-disclosure"
  ],
  [
    "case.gs028se.perioperative-dnr-error-disclosure.b-error-disclosure-2",
    "node.gs028se.perioperative-dnr-error-disclosure.b-error-disclosure-2.1",
    "question.statistics-ethics.error-disclosure.v2",
    "concept.statistics-ethics.error-disclosure"
  ],
  [
    "case.gs028se.perioperative-dnr-error-disclosure.b-error-disclosure-3",
    "node.gs028se.perioperative-dnr-error-disclosure.b-error-disclosure-3.1",
    "question.statistics-ethics.error-disclosure.v3",
    "concept.statistics-ethics.error-disclosure"
  ],
  [
    "case.gs028se.p2e.error-disclosure.v4.ptld",
    "node.gs028se.p2e.error-disclosure.v4.ptld.1",
    "question.statistics-ethics.error-disclosure.v4",
    "concept.statistics-ethics.error-disclosure"
  ],
  [
    "case.gs028se.p2e.error-disclosure.v4.ptld",
    "node.gs028se.p2e.error-disclosure.v4.ptld.2",
    "question.ptld.tissue-diagnosis-coordination.v1.p2e.error-disclosure.v4",
    "concept.ptld.tissue-diagnosis-coordination"
  ],
  [
    "case.gs028se.impaired-colleague-research-consent.a-impaired-colleague-1",
    "node.gs028se.impaired-colleague-research-consent.a-impaired-colleague-1.1",
    "question.statistics-ethics.impaired-colleague.v1",
    "concept.statistics-ethics.impaired-colleague"
  ],
  [
    "case.gs028se.impaired-colleague-research-consent.a-impaired-colleague-2",
    "node.gs028se.impaired-colleague-research-consent.a-impaired-colleague-2.1",
    "question.statistics-ethics.impaired-colleague.v2",
    "concept.statistics-ethics.impaired-colleague"
  ],
  [
    "case.gs028se.impaired-colleague-research-consent.a-impaired-colleague-3",
    "node.gs028se.impaired-colleague-research-consent.a-impaired-colleague-3.1",
    "question.statistics-ethics.impaired-colleague.v3",
    "concept.statistics-ethics.impaired-colleague"
  ],
  [
    "case.gs028se.impaired-colleague-research-consent.a-impaired-colleague-4",
    "node.gs028se.impaired-colleague-research-consent.a-impaired-colleague-4.1",
    "question.statistics-ethics.impaired-colleague.v4",
    "concept.statistics-ethics.impaired-colleague"
  ],
  [
    "case.gs028se.p2e.research-consent.v1.gist",
    "node.gs028se.p2e.research-consent.v1.gist.1",
    "question.statistics-ethics.research-consent.v1",
    "concept.statistics-ethics.research-consent"
  ],
  [
    "case.gs028se.p2e.research-consent.v1.gist",
    "node.gs028se.p2e.research-consent.v1.gist.2",
    "question.gastric-gist.mutation-guided-neoadjuvant-imatinib.v1.p2e.research-consent.v1",
    "concept.gastric-gist.mutation-guided-neoadjuvant-imatinib"
  ],
  [
    "case.gs028se.impaired-colleague-research-consent.b-research-consent-2",
    "node.gs028se.impaired-colleague-research-consent.b-research-consent-2.1",
    "question.statistics-ethics.research-consent.v2",
    "concept.statistics-ethics.research-consent"
  ],
  [
    "case.gs028se.p2e.research-consent.v3.desmoid",
    "node.gs028se.p2e.research-consent.v3.desmoid.1",
    "question.statistics-ethics.research-consent.v3",
    "concept.statistics-ethics.research-consent"
  ],
  [
    "case.gs028se.p2e.research-consent.v3.desmoid",
    "node.gs028se.p2e.research-consent.v3.desmoid.2",
    "question.desmoid.initial-surveillance.new-diagnosis.v1.p2e.research-consent.v3",
    "concept.desmoid.initial-active-surveillance"
  ],
  [
    "case.gs028se.p2e.research-consent.v4.hidradenitis",
    "node.gs028se.p2e.research-consent.v4.hidradenitis.1",
    "question.statistics-ethics.research-consent.v4",
    "concept.statistics-ethics.research-consent"
  ],
  [
    "case.gs028se.p2e.research-consent.v4.hidradenitis",
    "node.gs028se.p2e.research-consent.v4.hidradenitis.2",
    "question.hidradenitis-suppurativa.multimodal-specialist-planning.v1.p2e.research-consent.v4",
    "concept.hidradenitis-suppurativa.multimodal-specialist-planning"
  ],
  [
    "case.gs028se.qi-versus-research-confidentiality.a-qi-versus-research-1",
    "node.gs028se.qi-versus-research-confidentiality.a-qi-versus-research-1.1",
    "question.statistics-ethics.qi-versus-research.v1",
    "concept.statistics-ethics.qi-versus-research"
  ],
  [
    "case.gs028se.qi-versus-research-confidentiality.a-qi-versus-research-2",
    "node.gs028se.qi-versus-research-confidentiality.a-qi-versus-research-2.1",
    "question.statistics-ethics.qi-versus-research.v2",
    "concept.statistics-ethics.qi-versus-research"
  ],
  [
    "case.gs028se.qi-versus-research-confidentiality.a-qi-versus-research-3",
    "node.gs028se.qi-versus-research-confidentiality.a-qi-versus-research-3.1",
    "question.statistics-ethics.qi-versus-research.v3",
    "concept.statistics-ethics.qi-versus-research"
  ],
  [
    "case.gs028se.qi-versus-research-confidentiality.a-qi-versus-research-4",
    "node.gs028se.qi-versus-research-confidentiality.a-qi-versus-research-4.1",
    "question.statistics-ethics.qi-versus-research.v4",
    "concept.statistics-ethics.qi-versus-research"
  ],
  [
    "case.gs028se.qi-versus-research-confidentiality.b-confidentiality-1",
    "node.gs028se.qi-versus-research-confidentiality.b-confidentiality-1.1",
    "question.statistics-ethics.confidentiality.v1",
    "concept.statistics-ethics.confidentiality"
  ],
  [
    "case.gs028se.p2e.confidentiality.v2.fhh",
    "node.gs028se.p2e.confidentiality.v2.fhh.1",
    "question.statistics-ethics.confidentiality.v2",
    "concept.statistics-ethics.confidentiality"
  ],
  [
    "case.gs028se.p2e.confidentiality.v2.fhh",
    "node.gs028se.p2e.confidentiality.v2.fhh.2",
    "question.fhh.parathyroid-surgery-counseling.v1.p2e.confidentiality.v2",
    "concept.fhh.avoid-parathyroid-surgery"
  ],
  [
    "case.gs028se.qi-versus-research-confidentiality.b-confidentiality-3",
    "node.gs028se.qi-versus-research-confidentiality.b-confidentiality-3.1",
    "question.statistics-ethics.confidentiality.v3",
    "concept.statistics-ethics.confidentiality"
  ],
  [
    "case.gs028se.p2e.confidentiality.v4.mondor",
    "node.gs028se.p2e.confidentiality.v4.mondor.1",
    "question.statistics-ethics.confidentiality.v4",
    "concept.statistics-ethics.confidentiality"
  ],
  [
    "case.gs028se.p2e.confidentiality.v4.mondor",
    "node.gs028se.p2e.confidentiality.v4.mondor.2",
    "question.mondor-disease.management.supportive-care.v1.p2e.confidentiality.v4",
    "concept.mondor-disease.supportive-management"
  ],
  [
    "case.gs028c.dcis.a-two-mm-wbrt",
    "node.gs028c.dcis.a-two-mm-wbrt.1",
    "question.dcis.margin-bcs-wbrt.v1",
    "concept.dcis.margin-bcs-wbrt"
  ],
  [
    "case.gs028c.dcis.a-three-mm-wbrt",
    "node.gs028c.dcis.a-three-mm-wbrt.1",
    "question.dcis.margin-bcs-wbrt.v2",
    "concept.dcis.margin-bcs-wbrt"
  ],
  [
    "case.gs028c.dcis.a-one-mm-individualize",
    "node.gs028c.dcis.a-one-mm-individualize.1",
    "question.dcis.margin-bcs-wbrt.v3",
    "concept.dcis.margin-bcs-wbrt"
  ],
  [
    "case.gs028c.dcis.a-five-mm-request",
    "node.gs028c.dcis.a-five-mm-request.1",
    "question.dcis.margin-bcs-wbrt.v4",
    "concept.dcis.margin-bcs-wbrt"
  ],
  [
    "case.gs028c.dcis.b-mastectomy",
    "node.gs028c.dcis.b-mastectomy.1",
    "question.dcis.sentinel-node-setting.v1",
    "concept.dcis.sentinel-node-setting"
  ],
  [
    "case.gs028c.dcis.b-routine-lumpectomy",
    "node.gs028c.dcis.b-routine-lumpectomy.1",
    "question.dcis.sentinel-node-setting.v2",
    "concept.dcis.sentinel-node-setting"
  ],
  [
    "case.gs028c.dcis.b-oncoplastic-mapping",
    "node.gs028c.dcis.b-oncoplastic-mapping.1",
    "question.dcis.sentinel-node-setting.v3",
    "concept.dcis.sentinel-node-setting"
  ],
  [
    "case.gs028c.dcis.b-invasion-concern",
    "node.gs028c.dcis.b-invasion-concern.1",
    "question.dcis.sentinel-node-setting.v4",
    "concept.dcis.sentinel-node-setting"
  ],
  [
    "case.gs028c.palpable-breast.paired-dense-focal",
    "node.gs028c.palpable-breast.paired-dense-focal.1",
    "question.palpable-breast.negative-mammogram-targeted-us.v1",
    "concept.palpable-breast.negative-mammogram-targeted-us"
  ],
  [
    "case.gs028c.palpable-breast.paired-dense-focal",
    "node.gs028c.palpable-breast.paired-dense-focal.2",
    "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v1",
    "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging"
  ],
  [
    "case.gs028c.palpable-breast.paired-scar-edge",
    "node.gs028c.palpable-breast.paired-scar-edge.1",
    "question.palpable-breast.negative-mammogram-targeted-us.v2",
    "concept.palpable-breast.negative-mammogram-targeted-us"
  ],
  [
    "case.gs028c.palpable-breast.paired-scar-edge",
    "node.gs028c.palpable-breast.paired-scar-edge.2",
    "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v2",
    "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging"
  ],
  [
    "case.gs028c.palpable-breast.a-recent-negative",
    "node.gs028c.palpable-breast.a-recent-negative.1",
    "question.palpable-breast.negative-mammogram-targeted-us.v3",
    "concept.palpable-breast.negative-mammogram-targeted-us"
  ],
  [
    "case.gs028c.palpable-breast.a-discordant-exam",
    "node.gs028c.palpable-breast.a-discordant-exam.1",
    "question.palpable-breast.negative-mammogram-targeted-us.v4",
    "concept.palpable-breast.negative-mammogram-targeted-us"
  ],
  [
    "case.gs028c.palpable-breast.b-enlarging-negative-imaging",
    "node.gs028c.palpable-breast.b-enlarging-negative-imaging.1",
    "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v3",
    "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging"
  ],
  [
    "case.gs028c.palpable-breast.b-surgeon-discordance",
    "node.gs028c.palpable-breast.b-surgeon-discordance.1",
    "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4",
    "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging"
  ],
  [
    "case.gs028c.malignant-polyp.a-pedunculated-enbloc",
    "node.gs028c.malignant-polyp.a-pedunculated-enbloc.1",
    "question.malignant-polyp.low-risk-endoscopic-excision.v1",
    "concept.malignant-polyp.low-risk-endoscopic-excision"
  ],
  [
    "case.gs028c.malignant-polyp.a-sessile-superficial",
    "node.gs028c.malignant-polyp.a-sessile-superficial.1",
    "question.malignant-polyp.low-risk-endoscopic-excision.v2",
    "concept.malignant-polyp.low-risk-endoscopic-excision"
  ],
  [
    "case.gs028c.malignant-polyp.a-outside-slide-review",
    "node.gs028c.malignant-polyp.a-outside-slide-review.1",
    "question.malignant-polyp.low-risk-endoscopic-excision.v3",
    "concept.malignant-polyp.low-risk-endoscopic-excision"
  ],
  [
    "case.gs028c.malignant-polyp.a-clear-cautery-line",
    "node.gs028c.malignant-polyp.a-clear-cautery-line.1",
    "question.malignant-polyp.low-risk-endoscopic-excision.v4",
    "concept.malignant-polyp.low-risk-endoscopic-excision"
  ],
  [
    "case.gs028c.malignant-polyp.b-piecemeal-margin",
    "node.gs028c.malignant-polyp.b-piecemeal-margin.1",
    "question.malignant-polyp.adverse-feature-colectomy.v1",
    "concept.malignant-polyp.adverse-feature-colectomy"
  ],
  [
    "case.gs028c.malignant-polyp.b-poor-grade",
    "node.gs028c.malignant-polyp.b-poor-grade.1",
    "question.malignant-polyp.adverse-feature-colectomy.v2",
    "concept.malignant-polyp.adverse-feature-colectomy"
  ],
  [
    "case.gs028c.malignant-polyp.b-lymphovascular",
    "node.gs028c.malignant-polyp.b-lymphovascular.1",
    "question.malignant-polyp.adverse-feature-colectomy.v3",
    "concept.malignant-polyp.adverse-feature-colectomy"
  ],
  [
    "case.gs028c.malignant-polyp.b-positive-deep",
    "node.gs028c.malignant-polyp.b-positive-deep.1",
    "question.malignant-polyp.adverse-feature-colectomy.v4",
    "concept.malignant-polyp.adverse-feature-colectomy"
  ],
  [
    "case.gs028c.dialysis-nutrition.a-minimum-target",
    "node.gs028c.dialysis-nutrition.a-minimum-target.1",
    "question.dialysis-nutrition.hospital-protein-target.v1",
    "concept.dialysis-nutrition.hospital-protein-target"
  ],
  [
    "case.gs028c.dialysis-nutrition.a-sixty-kilogram",
    "node.gs028c.dialysis-nutrition.a-sixty-kilogram.1",
    "question.dialysis-nutrition.hospital-protein-target.v2",
    "concept.dialysis-nutrition.hospital-protein-target"
  ],
  [
    "case.gs028c.dialysis-nutrition.a-planned-admission",
    "node.gs028c.dialysis-nutrition.a-planned-admission.1",
    "question.dialysis-nutrition.hospital-protein-target.v3",
    "concept.dialysis-nutrition.hospital-protein-target"
  ],
  [
    "case.gs028c.dialysis-nutrition.a-former-low-protein",
    "node.gs028c.dialysis-nutrition.a-former-low-protein.1",
    "question.dialysis-nutrition.hospital-protein-target.v4",
    "concept.dialysis-nutrition.hospital-protein-target"
  ],
  [
    "case.gs028c.dialysis-nutrition.b-negative-balance",
    "node.gs028c.dialysis-nutrition.b-negative-balance.1",
    "question.dialysis-nutrition.avoid-calorie-overfeeding.v1",
    "concept.dialysis-nutrition.avoid-calorie-overfeeding"
  ],
  [
    "case.gs028c.dialysis-nutrition.b-hyperglycemia",
    "node.gs028c.dialysis-nutrition.b-hyperglycemia.1",
    "question.dialysis-nutrition.avoid-calorie-overfeeding.v2",
    "concept.dialysis-nutrition.avoid-calorie-overfeeding"
  ],
  [
    "case.gs028c.dialysis-nutrition.b-fixed-high-dextrose",
    "node.gs028c.dialysis-nutrition.b-fixed-high-dextrose.1",
    "question.dialysis-nutrition.avoid-calorie-overfeeding.v3",
    "concept.dialysis-nutrition.avoid-calorie-overfeeding"
  ],
  [
    "case.gs028c.dialysis-nutrition.b-adequate-energy",
    "node.gs028c.dialysis-nutrition.b-adequate-energy.1",
    "question.dialysis-nutrition.avoid-calorie-overfeeding.v4",
    "concept.dialysis-nutrition.avoid-calorie-overfeeding"
  ],
  [
    "case.gs028c.recurrent-gastric-ulcer.a-antral-biopsy",
    "node.gs028c.recurrent-gastric-ulcer.a-antral-biopsy.1",
    "question.retained-antrum.recognition.v1",
    "concept.retained-antrum.recognition"
  ],
  [
    "case.gs028c.recurrent-gastric-ulcer.a-residual-antrum",
    "node.gs028c.recurrent-gastric-ulcer.a-residual-antrum.1",
    "question.retained-antrum.recognition.v2",
    "concept.retained-antrum.recognition"
  ],
  [
    "case.gs028c.recurrent-gastric-ulcer.a-operative-mismatch",
    "node.gs028c.recurrent-gastric-ulcer.a-operative-mismatch.1",
    "question.retained-antrum.recognition.v3",
    "concept.retained-antrum.recognition"
  ],
  [
    "case.gs028c.recurrent-gastric-ulcer.a-acid-suppression-failure",
    "node.gs028c.recurrent-gastric-ulcer.a-acid-suppression-failure.1",
    "question.retained-antrum.recognition.v4",
    "concept.retained-antrum.recognition"
  ],
  [
    "case.gs028c.recurrent-gastric-ulcer.b-nsaid",
    "node.gs028c.recurrent-gastric-ulcer.b-nsaid.1",
    "question.marginal-ulcer.initial-medical-management.v1",
    "concept.marginal-ulcer.initial-medical-management"
  ],
  [
    "case.gs028c.recurrent-gastric-ulcer.b-smoking",
    "node.gs028c.recurrent-gastric-ulcer.b-smoking.1",
    "question.marginal-ulcer.initial-medical-management.v2",
    "concept.marginal-ulcer.initial-medical-management"
  ],
  [
    "case.gs028c.recurrent-gastric-ulcer.b-h-pylori",
    "node.gs028c.recurrent-gastric-ulcer.b-h-pylori.1",
    "question.marginal-ulcer.initial-medical-management.v3",
    "concept.marginal-ulcer.initial-medical-management"
  ],
  [
    "case.gs028c.recurrent-gastric-ulcer.b-no-identified-factor",
    "node.gs028c.recurrent-gastric-ulcer.b-no-identified-factor.1",
    "question.marginal-ulcer.initial-medical-management.v4",
    "concept.marginal-ulcer.initial-medical-management"
  ],
  [
    "case.gs028c.appendicitis.a-nondiagnostic-ultrasound",
    "node.gs028c.appendicitis.a-nondiagnostic-ultrasound.1",
    "question.appendicitis.stable-adult-ct.v1",
    "concept.appendicitis.stable-adult-ct"
  ],
  [
    "case.gs028c.appendicitis.a-atypical-older-adult",
    "node.gs028c.appendicitis.a-atypical-older-adult.1",
    "question.appendicitis.stable-adult-ct.v2",
    "concept.appendicitis.stable-adult-ct"
  ],
  [
    "case.gs028c.appendicitis.a-equivocal-exam",
    "node.gs028c.appendicitis.a-equivocal-exam.1",
    "question.appendicitis.stable-adult-ct.v3",
    "concept.appendicitis.stable-adult-ct"
  ],
  [
    "case.gs028c.appendicitis.a-competing-diagnoses",
    "node.gs028c.appendicitis.a-competing-diagnoses.1",
    "question.appendicitis.stable-adult-ct.v4",
    "concept.appendicitis.stable-adult-ct"
  ],
  [
    "case.gs028c.appendicitis.b-ct-confirmed-appendicolith",
    "node.gs028c.appendicitis.b-ct-confirmed-appendicolith.1",
    "question.appendicitis.appendicolith-operative-pathway.v1",
    "concept.appendicitis.appendicolith-operative-pathway"
  ],
  [
    "case.gs028c.appendicitis.b-asks-for-antibiotics",
    "node.gs028c.appendicitis.b-asks-for-antibiotics.1",
    "question.appendicitis.appendicolith-operative-pathway.v2",
    "concept.appendicitis.appendicolith-operative-pathway"
  ],
  [
    "case.gs028c.appendicitis.b-no-perforation-but-stone",
    "node.gs028c.appendicitis.b-no-perforation-but-stone.1",
    "question.appendicitis.appendicolith-operative-pathway.v3",
    "concept.appendicitis.appendicolith-operative-pathway"
  ],
  [
    "case.gs028c.appendicitis.b-prior-antibiotic-preference",
    "node.gs028c.appendicitis.b-prior-antibiotic-preference.1",
    "question.appendicitis.appendicolith-operative-pathway.v4",
    "concept.appendicitis.appendicolith-operative-pathway"
  ],
  [
    "case.gs028c.acute-cholecystitis.a-equivocal-wall-thickening",
    "node.gs028c.acute-cholecystitis.a-equivocal-wall-thickening.1",
    "question.cholecystitis.hida-after-equivocal-ultrasound.v1",
    "concept.cholecystitis.hida-after-equivocal-ultrasound"
  ],
  [
    "case.gs028c.acute-cholecystitis.a-stones-without-secondary-signs",
    "node.gs028c.acute-cholecystitis.a-stones-without-secondary-signs.1",
    "question.cholecystitis.hida-after-equivocal-ultrasound.v2.r6",
    "concept.cholecystitis.hida-after-equivocal-ultrasound"
  ],
  [
    "case.gs028c.acute-cholecystitis.a-limited-ultrasound",
    "node.gs028c.acute-cholecystitis.a-limited-ultrasound.1",
    "question.cholecystitis.hida-after-equivocal-ultrasound.v3",
    "concept.cholecystitis.hida-after-equivocal-ultrasound"
  ],
  [
    "case.gs028c.acute-cholecystitis.a-persistent-suspicion",
    "node.gs028c.acute-cholecystitis.a-persistent-suspicion.1",
    "question.cholecystitis.hida-after-equivocal-ultrasound.v4",
    "concept.cholecystitis.hida-after-equivocal-ultrasound"
  ],
  [
    "case.gs028c.acute-cholecystitis.b-confirmed-on-ultrasound",
    "node.gs028c.acute-cholecystitis.b-confirmed-on-ultrasound.1",
    "question.cholecystitis.fit-patient-index-admission-cholecystectomy.v1",
    "concept.cholecystitis.fit-patient-index-admission-cholecystectomy"
  ],
  [
    "case.gs028c.acute-cholecystitis.b-hida-confirmed",
    "node.gs028c.acute-cholecystitis.b-hida-confirmed.1",
    "question.cholecystitis.fit-patient-index-admission-cholecystectomy.v2",
    "concept.cholecystitis.fit-patient-index-admission-cholecystectomy"
  ],
  [
    "case.gs028c.acute-cholecystitis.b-premature-ed-discharge",
    "node.gs028c.acute-cholecystitis.b-premature-ed-discharge.1",
    "question.cholecystitis.fit-patient-index-admission-cholecystectomy.v3",
    "concept.cholecystitis.fit-patient-index-admission-cholecystectomy"
  ],
  [
    "case.gs028c.acute-cholecystitis.b-older-but-fit",
    "node.gs028c.acute-cholecystitis.b-older-but-fit.1",
    "question.cholecystitis.fit-patient-index-admission-cholecystectomy.v4",
    "concept.cholecystitis.fit-patient-index-admission-cholecystectomy"
  ],
  [
    "case.gs028c.mild-biliary-pancreatitis.a-classic-improving-course",
    "node.gs028c.mild-biliary-pancreatitis.a-classic-improving-course.1",
    "question.acute-pancreatitis.selective-early-ct.v1",
    "concept.acute-pancreatitis.selective-early-ct"
  ],
  [
    "case.gs028c.mild-biliary-pancreatitis.a-biliary-source-known",
    "node.gs028c.mild-biliary-pancreatitis.a-biliary-source-known.1",
    "question.acute-pancreatitis.selective-early-ct.v2",
    "concept.acute-pancreatitis.selective-early-ct"
  ],
  [
    "case.gs028c.mild-biliary-pancreatitis.a-requests-necrosis-check",
    "node.gs028c.mild-biliary-pancreatitis.a-requests-necrosis-check.1",
    "question.acute-pancreatitis.selective-early-ct.v3",
    "concept.acute-pancreatitis.selective-early-ct"
  ],
  [
    "case.gs028c.mild-biliary-pancreatitis.a-ready-for-diet-advance",
    "node.gs028c.mild-biliary-pancreatitis.a-ready-for-diet-advance.1",
    "question.acute-pancreatitis.selective-early-ct.v4",
    "concept.acute-pancreatitis.selective-early-ct"
  ],
  [
    "case.gs028c.mild-biliary-pancreatitis.b-improving-with-gallstones",
    "node.gs028c.mild-biliary-pancreatitis.b-improving-with-gallstones.1",
    "question.acute-pancreatitis.mild-biliary-chole-before-discharge.v1",
    "concept.acute-pancreatitis.mild-biliary-chole-before-discharge"
  ],
  [
    "case.gs028c.mild-biliary-pancreatitis.b-after-ercp-clearance",
    "node.gs028c.mild-biliary-pancreatitis.b-after-ercp-clearance.1",
    "question.acute-pancreatitis.mild-biliary-chole-before-discharge.v2",
    "concept.acute-pancreatitis.mild-biliary-chole-before-discharge"
  ],
  [
    "case.gs028c.mild-biliary-pancreatitis.b-discharge-rounds",
    "node.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.1",
    "question.acute-pancreatitis.mild-biliary-chole-before-discharge.v3",
    "concept.acute-pancreatitis.mild-biliary-chole-before-discharge"
  ],
  [
    "case.gs028c.mild-biliary-pancreatitis.b-normalizing-bilirubin",
    "node.gs028c.mild-biliary-pancreatitis.b-normalizing-bilirubin.1",
    "question.acute-pancreatitis.mild-biliary-chole-before-discharge.v4",
    "concept.acute-pancreatitis.mild-biliary-chole-before-discharge"
  ],
  [
    "case.gs028c.acute-limb-ischemia.a-viable-limb",
    "node.gs028c.acute-limb-ischemia.a-viable-limb.1",
    "question.acute-limb-ischemia.viability-exam.v1",
    "concept.acute-limb-ischemia.viability-exam"
  ],
  [
    "case.gs028c.acute-limb-ischemia.a-marginally-threatened",
    "node.gs028c.acute-limb-ischemia.a-marginally-threatened.1",
    "question.acute-limb-ischemia.viability-exam.v2",
    "concept.acute-limb-ischemia.viability-exam"
  ],
  [
    "case.gs028c.acute-limb-ischemia.a-immediately-threatened",
    "node.gs028c.acute-limb-ischemia.a-immediately-threatened.1",
    "question.acute-limb-ischemia.viability-exam.v3",
    "concept.acute-limb-ischemia.viability-exam"
  ],
  [
    "case.gs028c.acute-limb-ischemia.a-irreversible-limb",
    "node.gs028c.acute-limb-ischemia.a-irreversible-limb.1",
    "question.acute-limb-ischemia.viability-exam.v4",
    "concept.acute-limb-ischemia.viability-exam"
  ],
  [
    "case.gs028c.acute-limb-ischemia.b-no-anticoagulation-contraindication",
    "node.gs028c.acute-limb-ischemia.b-no-anticoagulation-contraindication.1",
    "question.acute-limb-ischemia.heparin-emergency-transfer.v1",
    "concept.acute-limb-ischemia.heparin-emergency-transfer"
  ],
  [
    "case.gs028c.acute-limb-ischemia.b-prior-hit",
    "node.gs028c.acute-limb-ischemia.b-prior-hit.1",
    "question.acute-limb-ischemia.heparin-emergency-transfer.v2",
    "concept.acute-limb-ischemia.heparin-emergency-transfer"
  ],
  [
    "case.gs028c.acute-limb-ischemia.b-active-bleeding",
    "node.gs028c.acute-limb-ischemia.b-active-bleeding.1",
    "question.acute-limb-ischemia.heparin-emergency-transfer.v3",
    "concept.acute-limb-ischemia.heparin-emergency-transfer"
  ],
  [
    "case.gs028c.acute-limb-ischemia.b-motor-deficit",
    "node.gs028c.acute-limb-ischemia.b-motor-deficit.1",
    "question.acute-limb-ischemia.heparin-emergency-transfer.v4",
    "concept.acute-limb-ischemia.heparin-emergency-transfer"
  ],
  [
    "case.gs028c.acute-mesenteric-ischemia.a-atrial-fibrillation",
    "node.gs028c.acute-mesenteric-ischemia.a-atrial-fibrillation.1",
    "question.acute-mesenteric-ischemia.prompt-cta.v1",
    "concept.acute-mesenteric-ischemia.prompt-cta"
  ],
  [
    "case.gs028c.acute-mesenteric-ischemia.a-acute-on-chronic-pattern",
    "node.gs028c.acute-mesenteric-ischemia.a-acute-on-chronic-pattern.1",
    "question.acute-mesenteric-ischemia.prompt-cta.v2",
    "concept.acute-mesenteric-ischemia.prompt-cta"
  ],
  [
    "case.gs028c.acute-mesenteric-ischemia.a-kidney-injury",
    "node.gs028c.acute-mesenteric-ischemia.a-kidney-injury.1",
    "question.acute-mesenteric-ischemia.prompt-cta.v3",
    "concept.acute-mesenteric-ischemia.prompt-cta"
  ],
  [
    "case.gs028c.acute-mesenteric-ischemia.a-possible-arterial-thrombosis",
    "node.gs028c.acute-mesenteric-ischemia.a-possible-arterial-thrombosis.1",
    "question.acute-mesenteric-ischemia.prompt-cta.v4",
    "concept.acute-mesenteric-ischemia.prompt-cta"
  ],
  [
    "case.gs028c.acute-mesenteric-ischemia.b-rigid-abdomen",
    "node.gs028c.acute-mesenteric-ischemia.b-rigid-abdomen.1",
    "question.acute-mesenteric-ischemia.peritonitis-exploration.v1",
    "concept.acute-mesenteric-ischemia.peritonitis-exploration"
  ],
  [
    "case.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta",
    "node.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.1",
    "question.acute-mesenteric-ischemia.peritonitis-exploration.v2",
    "concept.acute-mesenteric-ischemia.peritonitis-exploration"
  ],
  [
    "case.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock",
    "node.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.1",
    "question.acute-mesenteric-ischemia.peritonitis-exploration.v3",
    "concept.acute-mesenteric-ischemia.peritonitis-exploration"
  ],
  [
    "case.gs028c.acute-mesenteric-ischemia.b-late-peritoneal-findings",
    "node.gs028c.acute-mesenteric-ischemia.b-late-peritoneal-findings.1",
    "question.acute-mesenteric-ischemia.peritonitis-exploration.v4",
    "concept.acute-mesenteric-ischemia.peritonitis-exploration"
  ],
  [
    "case.gs028d.ards.a-pneumonia-barrier",
    "node.gs028d.ards.a-pneumonia-barrier.1",
    "question.ards.permeability-edema-mechanism.v1",
    "concept.ards.permeability-edema-mechanism"
  ],
  [
    "case.gs028d.ards.a-aspiration-protein-fluid",
    "node.gs028d.ards.a-aspiration-protein-fluid.1",
    "question.ards.permeability-edema-mechanism.v2",
    "concept.ards.permeability-edema-mechanism"
  ],
  [
    "case.gs028d.ards.a-pancreatitis-noncardiogenic",
    "node.gs028d.ards.a-pancreatitis-noncardiogenic.1",
    "question.ards.permeability-edema-mechanism.v3",
    "concept.ards.permeability-edema-mechanism"
  ],
  [
    "case.gs028d.ards.a-sepsis-endothelial-injury",
    "node.gs028d.ards.a-sepsis-endothelial-injury.1",
    "question.ards.permeability-edema-mechanism.v4",
    "concept.ards.permeability-edema-mechanism"
  ],
  [
    "case.gs028d.ards.b-obesity-ventilator-audit",
    "node.gs028d.ards.b-obesity-ventilator-audit.1",
    "question.ards.predicted-body-weight-ventilation.v1",
    "concept.ards.predicted-body-weight-ventilation"
  ],
  [
    "case.gs028d.ards.b-edema-weight-gain",
    "node.gs028d.ards.b-edema-weight-gain.1",
    "question.ards.predicted-body-weight-ventilation.v2",
    "concept.ards.predicted-body-weight-ventilation"
  ],
  [
    "case.gs028d.ards.b-low-actual-weight",
    "node.gs028d.ards.b-low-actual-weight.1",
    "question.ards.predicted-body-weight-ventilation.v3",
    "concept.ards.predicted-body-weight-ventilation"
  ],
  [
    "case.gs028d.ards.b-after-diuresis",
    "node.gs028d.ards.b-after-diuresis.1",
    "question.ards.predicted-body-weight-ventilation.v4",
    "concept.ards.predicted-body-weight-ventilation"
  ],
  [
    "case.gs028d.blunt-cardiac-injury.a-steering-wheel-impact",
    "node.gs028d.blunt-cardiac-injury.a-steering-wheel-impact.1",
    "question.blunt-cardiac-injury.ecg-troponin-evaluation.v1",
    "concept.blunt-cardiac-injury.ecg-troponin-evaluation"
  ],
  [
    "case.gs028d.blunt-cardiac-injury.a-sports-chest-impact",
    "node.gs028d.blunt-cardiac-injury.a-sports-chest-impact.1",
    "question.blunt-cardiac-injury.ecg-troponin-evaluation.v2",
    "concept.blunt-cardiac-injury.ecg-troponin-evaluation"
  ],
  [
    "case.gs028d.blunt-cardiac-injury.a-fall-anterior-chest",
    "node.gs028d.blunt-cardiac-injury.a-fall-anterior-chest.1",
    "question.blunt-cardiac-injury.ecg-troponin-evaluation.v3",
    "concept.blunt-cardiac-injury.ecg-troponin-evaluation"
  ],
  [
    "case.gs028d.blunt-cardiac-injury.a-bicycle-handlebar-impact",
    "node.gs028d.blunt-cardiac-injury.a-bicycle-handlebar-impact.1",
    "question.blunt-cardiac-injury.ecg-troponin-evaluation.v4",
    "concept.blunt-cardiac-injury.ecg-troponin-evaluation"
  ],
  [
    "case.gs028d.blunt-cardiac-injury.b-new-ecg-change",
    "node.gs028d.blunt-cardiac-injury.b-new-ecg-change.1",
    "question.blunt-cardiac-injury.monitored-disposition.v1",
    "concept.blunt-cardiac-injury.monitored-disposition"
  ],
  [
    "case.gs028d.blunt-cardiac-injury.b-isolated-troponin-elevation",
    "node.gs028d.blunt-cardiac-injury.b-isolated-troponin-elevation.1",
    "question.blunt-cardiac-injury.monitored-disposition.v2",
    "concept.blunt-cardiac-injury.monitored-disposition"
  ],
  [
    "case.gs028d.blunt-cardiac-injury.b-both-results-abnormal",
    "node.gs028d.blunt-cardiac-injury.b-both-results-abnormal.1",
    "question.blunt-cardiac-injury.monitored-disposition.v3",
    "concept.blunt-cardiac-injury.monitored-disposition"
  ],
  [
    "case.gs028d.blunt-cardiac-injury.b-both-results-normal",
    "node.gs028d.blunt-cardiac-injury.b-both-results-normal.1",
    "question.blunt-cardiac-injury.monitored-disposition.v4",
    "concept.blunt-cardiac-injury.monitored-disposition"
  ],
  [
    "case.gs028d.head-pelvis-trauma.a-warfarin-fall",
    "node.gs028d.head-pelvis-trauma.a-warfarin-fall.1",
    "question.head-injury.anticoagulant-ed-ct-evaluation.v1",
    "concept.head-injury.anticoagulant-ed-ct-evaluation"
  ],
  [
    "case.gs028d.head-pelvis-trauma.a-apixaban-doorframe",
    "node.gs028d.head-pelvis-trauma.a-apixaban-doorframe.1",
    "question.head-injury.anticoagulant-ed-ct-evaluation.v2",
    "concept.head-injury.anticoagulant-ed-ct-evaluation"
  ],
  [
    "case.gs028d.head-pelvis-trauma.a-rivaroxaban-cabinet",
    "node.gs028d.head-pelvis-trauma.a-rivaroxaban-cabinet.1",
    "question.head-injury.anticoagulant-ed-ct-evaluation.v3",
    "concept.head-injury.anticoagulant-ed-ct-evaluation"
  ],
  [
    "case.gs028d.head-pelvis-trauma.a-dabigatran-low-speed-crash",
    "node.gs028d.head-pelvis-trauma.a-dabigatran-low-speed-crash.1",
    "question.head-injury.anticoagulant-ed-ct-evaluation.v4",
    "concept.head-injury.anticoagulant-ed-ct-evaluation"
  ],
  [
    "case.gs028d.head-pelvis-trauma.b-ems-photo-review",
    "node.gs028d.head-pelvis-trauma.b-ems-photo-review.1",
    "question.pelvic-trauma.binder-greater-trochanter-placement.v1",
    "concept.pelvic-trauma.binder-greater-trochanter-placement"
  ],
  [
    "case.gs028d.head-pelvis-trauma.b-transfer-note-correction",
    "node.gs028d.head-pelvis-trauma.b-transfer-note-correction.1",
    "question.pelvic-trauma.binder-greater-trochanter-placement.v2",
    "concept.pelvic-trauma.binder-greater-trochanter-placement"
  ],
  [
    "case.gs028d.head-pelvis-trauma.b-quality-review-landmark",
    "node.gs028d.head-pelvis-trauma.b-quality-review-landmark.1",
    "question.pelvic-trauma.binder-greater-trochanter-placement.v3",
    "concept.pelvic-trauma.binder-greater-trochanter-placement"
  ],
  [
    "case.gs028d.head-pelvis-trauma.b-iliac-crest-error",
    "node.gs028d.head-pelvis-trauma.b-iliac-crest-error.1",
    "question.pelvic-trauma.binder-greater-trochanter-placement.v4",
    "concept.pelvic-trauma.binder-greater-trochanter-placement"
  ],
  [
    "case.gs028d.acid-base.a-diarrhea-low-bicarb",
    "node.gs028d.acid-base.a-diarrhea-low-bicarb.1",
    "question.metabolic-acidosis.confirm-with-blood-gas.v1",
    "concept.metabolic-acidosis.confirm-with-blood-gas"
  ],
  [
    "case.gs028d.acid-base.a-renal-low-bicarb",
    "node.gs028d.acid-base.a-renal-low-bicarb.1",
    "question.metabolic-acidosis.confirm-with-blood-gas.v2",
    "concept.metabolic-acidosis.confirm-with-blood-gas"
  ],
  [
    "case.gs028d.acid-base.a-tachypnea-low-bicarb",
    "node.gs028d.acid-base.a-tachypnea-low-bicarb.1",
    "question.metabolic-acidosis.confirm-with-blood-gas.v3",
    "concept.metabolic-acidosis.confirm-with-blood-gas"
  ],
  [
    "case.gs028d.acid-base.a-postoperative-low-bicarb",
    "node.gs028d.acid-base.a-postoperative-low-bicarb.1",
    "question.metabolic-acidosis.confirm-with-blood-gas.v4",
    "concept.metabolic-acidosis.confirm-with-blood-gas"
  ],
  [
    "case.gs028d.acid-base.b-cirrhosis-gap",
    "node.gs028d.acid-base.b-cirrhosis-gap.1",
    "question.metabolic-acidosis.albumin-corrected-anion-gap.v1",
    "concept.metabolic-acidosis.albumin-corrected-anion-gap"
  ],
  [
    "case.gs028d.acid-base.b-malnutrition-gap",
    "node.gs028d.acid-base.b-malnutrition-gap.1",
    "question.metabolic-acidosis.albumin-corrected-anion-gap.v2",
    "concept.metabolic-acidosis.albumin-corrected-anion-gap"
  ],
  [
    "case.gs028d.acid-base.b-sepsis-recovery-gap",
    "node.gs028d.acid-base.b-sepsis-recovery-gap.1",
    "question.metabolic-acidosis.albumin-corrected-anion-gap.v3",
    "concept.metabolic-acidosis.albumin-corrected-anion-gap"
  ],
  [
    "case.gs028d.acid-base.b-cancer-gap",
    "node.gs028d.acid-base.b-cancer-gap.1",
    "question.metabolic-acidosis.albumin-corrected-anion-gap.v4",
    "concept.metabolic-acidosis.albumin-corrected-anion-gap"
  ],
  [
    "case.gs028d.hyperkalaemia.a-renal-result",
    "node.gs028d.hyperkalaemia.a-renal-result.1",
    "question.hyperkalaemia.severe-community-result-transfer.v1",
    "concept.hyperkalaemia.severe-community-result-transfer"
  ],
  [
    "case.gs028d.hyperkalaemia.a-raas-result",
    "node.gs028d.hyperkalaemia.a-raas-result.1",
    "question.hyperkalaemia.severe-community-result-transfer.v2",
    "concept.hyperkalaemia.severe-community-result-transfer"
  ],
  [
    "case.gs028d.hyperkalaemia.a-dialysis-result",
    "node.gs028d.hyperkalaemia.a-dialysis-result.1",
    "question.hyperkalaemia.severe-community-result-transfer.v3",
    "concept.hyperkalaemia.severe-community-result-transfer"
  ],
  [
    "case.gs028d.hyperkalaemia.a-dehydration-result",
    "node.gs028d.hyperkalaemia.a-dehydration-result.1",
    "question.hyperkalaemia.severe-community-result-transfer.v4",
    "concept.hyperkalaemia.severe-community-result-transfer"
  ],
  [
    "case.gs028d.hyperkalaemia.b-calcium-record",
    "node.gs028d.hyperkalaemia.b-calcium-record.1",
    "question.hyperkalaemia.distinguish-protection-from-potassium-lowering.v1",
    "concept.hyperkalaemia.distinguish-protection-from-potassium-lowering"
  ],
  [
    "case.gs028d.hyperkalaemia.b-unchanged-k",
    "node.gs028d.hyperkalaemia.b-unchanged-k.1",
    "question.hyperkalaemia.distinguish-protection-from-potassium-lowering.v2",
    "concept.hyperkalaemia.distinguish-protection-from-potassium-lowering"
  ],
  [
    "case.gs028d.hyperkalaemia.b-insulin-shift",
    "node.gs028d.hyperkalaemia.b-insulin-shift.1",
    "question.hyperkalaemia.distinguish-protection-from-potassium-lowering.v3",
    "concept.hyperkalaemia.distinguish-protection-from-potassium-lowering"
  ],
  [
    "case.gs028d.hyperkalaemia.b-different-roles",
    "node.gs028d.hyperkalaemia.b-different-roles.1",
    "question.hyperkalaemia.distinguish-protection-from-potassium-lowering.v4",
    "concept.hyperkalaemia.distinguish-protection-from-potassium-lowering"
  ],
  [
    "case.gs028d.dialysis-access.paired-indeterminate-thrill",
    "node.gs028d.dialysis-access.paired-indeterminate-thrill.1",
    "question.dialysis-access.maturation-physical-assessment.v1",
    "concept.dialysis-access.maturation-physical-assessment"
  ],
  [
    "case.gs028d.dialysis-access.paired-indeterminate-thrill",
    "node.gs028d.dialysis-access.paired-indeterminate-thrill.2",
    "question.dialysis-access.clinical-dysfunction-referral.v1",
    "concept.dialysis-access.clinical-dysfunction-referral"
  ],
  [
    "case.gs028d.dialysis-access.paired-deep-access",
    "node.gs028d.dialysis-access.paired-deep-access.1",
    "question.dialysis-access.maturation-physical-assessment.v2",
    "concept.dialysis-access.maturation-physical-assessment"
  ],
  [
    "case.gs028d.dialysis-access.paired-deep-access",
    "node.gs028d.dialysis-access.paired-deep-access.2",
    "question.dialysis-access.clinical-dysfunction-referral.v2",
    "concept.dialysis-access.clinical-dysfunction-referral"
  ],
  [
    "case.gs028d.dialysis-access.a-clear-maturation-exam",
    "node.gs028d.dialysis-access.a-clear-maturation-exam.1",
    "question.dialysis-access.maturation-physical-assessment.v3",
    "concept.dialysis-access.maturation-physical-assessment"
  ],
  [
    "case.gs028d.dialysis-access.a-no-routine-scan",
    "node.gs028d.dialysis-access.a-no-routine-scan.1",
    "question.dialysis-access.maturation-physical-assessment.v4",
    "concept.dialysis-access.maturation-physical-assessment"
  ],
  [
    "case.gs028d.dialysis-access.b-cannulation-difficulty",
    "node.gs028d.dialysis-access.b-cannulation-difficulty.1",
    "question.dialysis-access.clinical-dysfunction-referral.v3",
    "concept.dialysis-access.clinical-dysfunction-referral"
  ],
  [
    "case.gs028d.dialysis-access.b-arm-swelling",
    "node.gs028d.dialysis-access.b-arm-swelling.1",
    "question.dialysis-access.clinical-dysfunction-referral.v4",
    "concept.dialysis-access.clinical-dysfunction-referral"
  ],
  [
    "case.gs028d.anesthesia.a-snoring-surgery",
    "node.gs028d.anesthesia.a-snoring-surgery.1",
    "question.preoperative-osa.validated-risk-screening.v1",
    "concept.preoperative-osa.validated-risk-screening"
  ],
  [
    "case.gs028d.anesthesia.a-daytime-sleepiness",
    "node.gs028d.anesthesia.a-daytime-sleepiness.1",
    "question.preoperative-osa.validated-risk-screening.v2",
    "concept.preoperative-osa.validated-risk-screening"
  ],
  [
    "case.gs028d.anesthesia.a-prior-high-risk-screen",
    "node.gs028d.anesthesia.a-prior-high-risk-screen.1",
    "question.preoperative-osa.validated-risk-screening.v3",
    "concept.preoperative-osa.validated-risk-screening"
  ],
  [
    "case.gs028d.anesthesia.a-validated-not-impression",
    "node.gs028d.anesthesia.a-validated-not-impression.1",
    "question.preoperative-osa.validated-risk-screening.v4",
    "concept.preoperative-osa.validated-risk-screening"
  ],
  [
    "case.gs028d.anesthesia.b-documented-susceptibility",
    "node.gs028d.anesthesia.b-documented-susceptibility.1",
    "question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v1",
    "concept.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan"
  ],
  [
    "case.gs028d.anesthesia.b-family-testing-record",
    "node.gs028d.anesthesia.b-family-testing-record.1",
    "question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v2",
    "concept.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan"
  ],
  [
    "case.gs028d.anesthesia.b-prior-mh-event",
    "node.gs028d.anesthesia.b-prior-mh-event.1",
    "question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v3",
    "concept.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan"
  ],
  [
    "case.gs028d.anesthesia.b-mh-alert-bracelet",
    "node.gs028d.anesthesia.b-mh-alert-bracelet.1",
    "question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v4",
    "concept.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan"
  ],
  [
    "case.gs028d.geriatrics.a-colectomy-independent",
    "node.gs028d.geriatrics.a-colectomy-independent.1",
    "question.preoperative-frailty.validated-assessment.v1",
    "concept.preoperative-frailty.validated-assessment"
  ],
  [
    "case.gs028d.geriatrics.a-gastrectomy-assistance",
    "node.gs028d.geriatrics.a-gastrectomy-assistance.1",
    "question.preoperative-frailty.validated-assessment.v2",
    "concept.preoperative-frailty.validated-assessment"
  ],
  [
    "case.gs028d.geriatrics.a-liver-surgery-active",
    "node.gs028d.geriatrics.a-liver-surgery-active.1",
    "question.preoperative-frailty.validated-assessment.v3",
    "concept.preoperative-frailty.validated-assessment"
  ],
  [
    "case.gs028d.geriatrics.a-pancreatic-surgery",
    "node.gs028d.geriatrics.a-pancreatic-surgery.1",
    "question.preoperative-frailty.validated-assessment.v4",
    "concept.preoperative-frailty.validated-assessment"
  ],
  [
    "case.gs028d.geriatrics.b-prior-delirium",
    "node.gs028d.geriatrics.b-prior-delirium.1",
    "question.postoperative-delirium.multicomponent-prevention-plan.v1",
    "concept.postoperative-delirium.multicomponent-prevention-plan"
  ],
  [
    "case.gs028d.geriatrics.b-sensory-impairment",
    "node.gs028d.geriatrics.b-sensory-impairment.1",
    "question.postoperative-delirium.multicomponent-prevention-plan.v2",
    "concept.postoperative-delirium.multicomponent-prevention-plan"
  ],
  [
    "case.gs028d.geriatrics.b-cognitive-risk",
    "node.gs028d.geriatrics.b-cognitive-risk.1",
    "question.postoperative-delirium.multicomponent-prevention-plan.v3",
    "concept.postoperative-delirium.multicomponent-prevention-plan"
  ],
  [
    "case.gs028d.geriatrics.b-mobility-nutrition",
    "node.gs028d.geriatrics.b-mobility-nutrition.1",
    "question.postoperative-delirium.multicomponent-prevention-plan.v4",
    "concept.postoperative-delirium.multicomponent-prevention-plan"
  ],
  [
    "case.gs028d.thoracic-screening.a-current-smoker-eligible",
    "node.gs028d.thoracic-screening.a-current-smoker-eligible.1",
    "question.lung-cancer-screening.annual-ldct-eligibility.v1",
    "concept.lung-cancer-screening.annual-ldct-eligibility"
  ],
  [
    "case.gs028d.thoracic-screening.a-recent-quitter-eligible",
    "node.gs028d.thoracic-screening.a-recent-quitter-eligible.1",
    "question.lung-cancer-screening.annual-ldct-eligibility.v2",
    "concept.lung-cancer-screening.annual-ldct-eligibility"
  ],
  [
    "case.gs028d.thoracic-screening.a-quit-interval-stop",
    "node.gs028d.thoracic-screening.a-quit-interval-stop.1",
    "question.lung-cancer-screening.annual-ldct-eligibility.v3",
    "concept.lung-cancer-screening.annual-ldct-eligibility"
  ],
  [
    "case.gs028d.thoracic-screening.a-treatment-fitness-stop",
    "node.gs028d.thoracic-screening.a-treatment-fitness-stop.1",
    "question.lung-cancer-screening.annual-ldct-eligibility.v4",
    "concept.lung-cancer-screening.annual-ldct-eligibility"
  ],
  [
    "case.gs028d.thoracic-screening.b-high-priority",
    "node.gs028d.thoracic-screening.b-high-priority.1",
    "question.spontaneous-pneumothorax.recurrence-prevention-referral.v1",
    "concept.spontaneous-pneumothorax.recurrence-prevention-referral"
  ],
  [
    "case.gs028d.thoracic-screening.b-occupation-priority",
    "node.gs028d.thoracic-screening.b-occupation-priority.1",
    "question.spontaneous-pneumothorax.recurrence-prevention-referral.v2",
    "concept.spontaneous-pneumothorax.recurrence-prevention-referral"
  ],
  [
    "case.gs028d.thoracic-screening.b-prefers-observation",
    "node.gs028d.thoracic-screening.b-prefers-observation.1",
    "question.spontaneous-pneumothorax.recurrence-prevention-referral.v3",
    "concept.spontaneous-pneumothorax.recurrence-prevention-referral"
  ],
  [
    "case.gs028d.thoracic-screening.b-secondary-boundary",
    "node.gs028d.thoracic-screening.b-secondary-boundary.1",
    "question.spontaneous-pneumothorax.recurrence-prevention-referral.v4",
    "concept.spontaneous-pneumothorax.recurrence-prevention-referral"
  ],
  [
    "case.gs028d.thoracic-pleural.a-pneumonia-low-ph",
    "node.gs028d.thoracic-pleural.a-pneumonia-low-ph.1",
    "question.pleural-infection.intercostal-drain-indication.v1",
    "concept.pleural-infection.intercostal-drain-indication"
  ],
  [
    "case.gs028d.thoracic-pleural.a-fever-low-ph",
    "node.gs028d.thoracic-pleural.a-fever-low-ph.1",
    "question.pleural-infection.intercostal-drain-indication.v2",
    "concept.pleural-infection.intercostal-drain-indication"
  ],
  [
    "case.gs028d.thoracic-pleural.a-postoperative-low-ph",
    "node.gs028d.thoracic-pleural.a-postoperative-low-ph.1",
    "question.pleural-infection.intercostal-drain-indication.v3",
    "concept.pleural-infection.intercostal-drain-indication"
  ],
  [
    "case.gs028d.thoracic-pleural.a-no-accessible-fluid",
    "node.gs028d.thoracic-pleural.a-no-accessible-fluid.1",
    "question.pleural-infection.intercostal-drain-indication.v4",
    "concept.pleural-infection.intercostal-drain-indication"
  ],
  [
    "case.gs028d.thoracic-pleural.b-new-unilateral",
    "node.gs028d.thoracic-pleural.b-new-unilateral.1",
    "question.pleural-effusion.image-guided-thoracentesis-referral.v1",
    "concept.pleural-effusion.image-guided-thoracentesis-referral"
  ],
  [
    "case.gs028d.thoracic-pleural.b-small-effusion",
    "node.gs028d.thoracic-pleural.b-small-effusion.1",
    "question.pleural-effusion.image-guided-thoracentesis-referral.v2",
    "concept.pleural-effusion.image-guided-thoracentesis-referral"
  ],
  [
    "case.gs028d.thoracic-pleural.b-loculated-effusion",
    "node.gs028d.thoracic-pleural.b-loculated-effusion.1",
    "question.pleural-effusion.image-guided-thoracentesis-referral.v3",
    "concept.pleural-effusion.image-guided-thoracentesis-referral"
  ],
  [
    "case.gs028d.thoracic-pleural.b-postoperative-effusion",
    "node.gs028d.thoracic-pleural.b-postoperative-effusion.1",
    "question.pleural-effusion.image-guided-thoracentesis-referral.v4",
    "concept.pleural-effusion.image-guided-thoracentesis-referral"
  ],
  [
    "case.gs028e.radiology.c1-prior-ct-ultrasound",
    "node.gs028e.radiology.c1-prior-ct-ultrasound.1",
    "question.imaging.ionizing-versus-nonionizing-modalities.v1",
    "concept.imaging.ionizing-versus-nonionizing-modalities"
  ],
  [
    "case.gs028e.radiology.c1-planned-mri-ct",
    "node.gs028e.radiology.c1-planned-mri-ct.1",
    "question.imaging.ionizing-versus-nonionizing-modalities.v2",
    "concept.imaging.ionizing-versus-nonionizing-modalities"
  ],
  [
    "case.gs028e.radiology.c1-noncontrast-ct",
    "node.gs028e.radiology.c1-noncontrast-ct.1",
    "question.imaging.ionizing-versus-nonionizing-modalities.v3",
    "concept.imaging.ionizing-versus-nonionizing-modalities"
  ],
  [
    "case.gs028e.radiology.c1-ultrasound-sound",
    "node.gs028e.radiology.c1-ultrasound-sound.1",
    "question.imaging.ionizing-versus-nonionizing-modalities.v4",
    "concept.imaging.ionizing-versus-nonionizing-modalities"
  ],
  [
    "case.gs028e.radiology.c2-pacemaker-card",
    "node.gs028e.radiology.c2-pacemaker-card.1",
    "question.mri.device-specific-safety-verification.v1",
    "concept.mri.device-specific-safety-verification"
  ],
  [
    "case.gs028e.radiology.c2-cochlear-model",
    "node.gs028e.radiology.c2-cochlear-model.1",
    "question.mri.device-specific-safety-verification.v2",
    "concept.mri.device-specific-safety-verification"
  ],
  [
    "case.gs028e.radiology.c2-unidentified-implant",
    "node.gs028e.radiology.c2-unidentified-implant.1",
    "question.mri.device-specific-safety-verification.v3",
    "concept.mri.device-specific-safety-verification"
  ],
  [
    "case.gs028e.radiology.c2-prior-scan-different",
    "node.gs028e.radiology.c2-prior-scan-different.1",
    "question.mri.device-specific-safety-verification.v4",
    "concept.mri.device-specific-safety-verification"
  ],
  [
    "case.gs028e.radiology.c3-brief-warmth",
    "node.gs028e.radiology.c3-brief-warmth.1",
    "question.iodinated-contrast.physiologic-versus-allergic-like-reaction.v1",
    "concept.iodinated-contrast.physiologic-versus-allergic-like-reaction"
  ],
  [
    "case.gs028e.radiology.c3-limited-hives",
    "node.gs028e.radiology.c3-limited-hives.1",
    "question.iodinated-contrast.physiologic-versus-allergic-like-reaction.v2",
    "concept.iodinated-contrast.physiologic-versus-allergic-like-reaction"
  ],
  [
    "case.gs028e.radiology.c3-allergy-list-warmth",
    "node.gs028e.radiology.c3-allergy-list-warmth.1",
    "question.iodinated-contrast.physiologic-versus-allergic-like-reaction.v3",
    "concept.iodinated-contrast.physiologic-versus-allergic-like-reaction"
  ],
  [
    "case.gs028e.radiology.c3-hives-not-just-warm",
    "node.gs028e.radiology.c3-hives-not-just-warm.1",
    "question.iodinated-contrast.physiologic-versus-allergic-like-reaction.v4",
    "concept.iodinated-contrast.physiologic-versus-allergic-like-reaction"
  ],
  [
    "case.gs028e.pharmacology.c1-vomiting-empagliflozin",
    "node.gs028e.pharmacology.c1-vomiting-empagliflozin.1",
    "question.sglt2-inhibitor.euglycemic-ketoacidosis-adverse-effect.v1",
    "concept.sglt2-inhibitor.euglycemic-ketoacidosis-adverse-effect"
  ],
  [
    "case.gs028e.pharmacology.c1-postop-record",
    "node.gs028e.pharmacology.c1-postop-record.1",
    "question.sglt2-inhibitor.euglycemic-ketoacidosis-adverse-effect.v2",
    "concept.sglt2-inhibitor.euglycemic-ketoacidosis-adverse-effect"
  ],
  [
    "case.gs028e.pharmacology.c1-ertugliflozin-illness",
    "node.gs028e.pharmacology.c1-ertugliflozin-illness.1",
    "question.sglt2-inhibitor.euglycemic-ketoacidosis-adverse-effect.v3",
    "concept.sglt2-inhibitor.euglycemic-ketoacidosis-adverse-effect"
  ],
  [
    "case.gs028e.pharmacology.c1-glucose-led-missed",
    "node.gs028e.pharmacology.c1-glucose-led-missed.1",
    "question.sglt2-inhibitor.euglycemic-ketoacidosis-adverse-effect.v4",
    "concept.sglt2-inhibitor.euglycemic-ketoacidosis-adverse-effect"
  ],
  [
    "case.gs028e.pharmacology.c2-postop-rescue-record",
    "node.gs028e.pharmacology.c2-postop-rescue-record.1",
    "question.naloxone.competitive-opioid-antagonist-mechanism.v1",
    "concept.naloxone.competitive-opioid-antagonist-mechanism"
  ],
  [
    "case.gs028e.pharmacology.c2-kit-is-not-analgesic",
    "node.gs028e.pharmacology.c2-kit-is-not-analgesic.1",
    "question.naloxone.competitive-opioid-antagonist-mechanism.v2",
    "concept.naloxone.competitive-opioid-antagonist-mechanism"
  ],
  [
    "case.gs028e.pharmacology.c2-opioid-not-destroyed",
    "node.gs028e.pharmacology.c2-opioid-not-destroyed.1",
    "question.naloxone.competitive-opioid-antagonist-mechanism.v3",
    "concept.naloxone.competitive-opioid-antagonist-mechanism"
  ],
  [
    "case.gs028e.pharmacology.c2-opioid-specific-target",
    "node.gs028e.pharmacology.c2-opioid-specific-target.1",
    "question.naloxone.competitive-opioid-antagonist-mechanism.v4",
    "concept.naloxone.competitive-opioid-antagonist-mechanism"
  ],
  [
    "case.gs028e.preoperative-sglt2.c1-empagliflozin-hernia",
    "node.gs028e.preoperative-sglt2.c1-empagliflozin-hernia.1",
    "question.perioperative-sglt2.drug-specific-interruption.v1",
    "concept.perioperative-sglt2.drug-specific-interruption"
  ],
  [
    "case.gs028e.preoperative-sglt2.c1-ertugliflozin-colon",
    "node.gs028e.preoperative-sglt2.c1-ertugliflozin-colon.1",
    "question.perioperative-sglt2.drug-specific-interruption.v2",
    "concept.perioperative-sglt2.drug-specific-interruption"
  ],
  [
    "case.gs028e.preoperative-sglt2.c1-short-empa-plan",
    "node.gs028e.preoperative-sglt2.c1-short-empa-plan.1",
    "question.perioperative-sglt2.drug-specific-interruption.v3",
    "concept.perioperative-sglt2.drug-specific-interruption"
  ],
  [
    "case.gs028e.preoperative-sglt2.c1-drug-switch-calendar",
    "node.gs028e.preoperative-sglt2.c1-drug-switch-calendar.1",
    "question.perioperative-sglt2.drug-specific-interruption.v4",
    "concept.perioperative-sglt2.drug-specific-interruption"
  ],
  [
    "case.gs028e.mis-principles.c1-co2-source",
    "node.gs028e.mis-principles.c1-co2-source.1",
    "question.laparoscopy.co2-absorption-hypercarbia.v1",
    "concept.laparoscopy.co2-absorption-hypercarbia"
  ],
  [
    "case.gs028e.mis-principles.c1-respiratory-acidemia",
    "node.gs028e.mis-principles.c1-respiratory-acidemia.1",
    "question.laparoscopy.co2-absorption-hypercarbia.v2",
    "concept.laparoscopy.co2-absorption-hypercarbia"
  ],
  [
    "case.gs028e.mis-principles.c1-absorbed-gas-exit",
    "node.gs028e.mis-principles.c1-absorbed-gas-exit.1",
    "question.laparoscopy.co2-absorption-hypercarbia.v3",
    "concept.laparoscopy.co2-absorption-hypercarbia"
  ],
  [
    "case.gs028e.mis-principles.c1-ventilation-record",
    "node.gs028e.mis-principles.c1-ventilation-record.1",
    "question.laparoscopy.co2-absorption-hypercarbia.v4",
    "concept.laparoscopy.co2-absorption-hypercarbia"
  ],
  [
    "case.gs028e.mis-principles.c2-caval-compression-record",
    "node.gs028e.mis-principles.c2-caval-compression-record.1",
    "question.pneumoperitoneum.context-dependent-venous-return.v1",
    "concept.pneumoperitoneum.context-dependent-venous-return"
  ],
  [
    "case.gs028e.mis-principles.c2-early-central-filling",
    "node.gs028e.mis-principles.c2-early-central-filling.1",
    "question.pneumoperitoneum.context-dependent-venous-return.v2",
    "concept.pneumoperitoneum.context-dependent-venous-return"
  ],
  [
    "case.gs028e.mis-principles.c2-head-up-context",
    "node.gs028e.mis-principles.c2-head-up-context.1",
    "question.pneumoperitoneum.context-dependent-venous-return.v3",
    "concept.pneumoperitoneum.context-dependent-venous-return"
  ],
  [
    "case.gs028e.mis-principles.c2-different-phases",
    "node.gs028e.mis-principles.c2-different-phases.1",
    "question.pneumoperitoneum.context-dependent-venous-return.v4",
    "concept.pneumoperitoneum.context-dependent-venous-return"
  ],
  [
    "case.gs028e.mis-principles.c3-improving-shoulder",
    "node.gs028e.mis-principles.c3-improving-shoulder.1",
    "question.postlaparoscopy.benign-referred-shoulder-pain.v1",
    "concept.postlaparoscopy.benign-referred-shoulder-pain"
  ],
  [
    "case.gs028e.mis-principles.c3-phrenic-pathway",
    "node.gs028e.mis-principles.c3-phrenic-pathway.1",
    "question.postlaparoscopy.benign-referred-shoulder-pain.v2",
    "concept.postlaparoscopy.benign-referred-shoulder-pain"
  ],
  [
    "case.gs028e.mis-principles.c3-normal-joint-question",
    "node.gs028e.mis-principles.c3-normal-joint-question.1",
    "question.postlaparoscopy.benign-referred-shoulder-pain.v3",
    "concept.postlaparoscopy.benign-referred-shoulder-pain"
  ],
  [
    "case.gs028e.mis-principles.c3-resolved-event-record",
    "node.gs028e.mis-principles.c3-resolved-event-record.1",
    "question.postlaparoscopy.benign-referred-shoulder-pain.v4",
    "concept.postlaparoscopy.benign-referred-shoulder-pain"
  ],
  [
    "case.gs028e.collagen-remodeling.c1-maturing-incision",
    "node.gs028e.collagen-remodeling.c1-maturing-incision.1",
    "question.wound-healing.type-iii-to-type-i-collagen-remodeling.v1",
    "concept.wound-healing.type-iii-to-type-i-collagen-remodeling"
  ],
  [
    "case.gs028e.collagen-remodeling.c1-early-matrix-record",
    "node.gs028e.collagen-remodeling.c1-early-matrix-record.1",
    "question.wound-healing.type-iii-to-type-i-collagen-remodeling.v2",
    "concept.wound-healing.type-iii-to-type-i-collagen-remodeling"
  ],
  [
    "case.gs028e.collagen-remodeling.c1-later-matrix-counseling",
    "node.gs028e.collagen-remodeling.c1-later-matrix-counseling.1",
    "question.wound-healing.type-iii-to-type-i-collagen-remodeling.v3",
    "concept.wound-healing.type-iii-to-type-i-collagen-remodeling"
  ],
  [
    "case.gs028e.collagen-remodeling.c1-reversed-diagram",
    "node.gs028e.collagen-remodeling.c1-reversed-diagram.1",
    "question.wound-healing.type-iii-to-type-i-collagen-remodeling.v4",
    "concept.wound-healing.type-iii-to-type-i-collagen-remodeling"
  ],
  [
    "case.gs028e.wound-healing-remaining.c1-incision-overgrowth",
    "node.gs028e.wound-healing-remaining.c1-incision-overgrowth.1",
    "question.wound.hypertrophic-versus-keloid-extent.v1",
    "concept.wound.hypertrophic-versus-keloid-extent"
  ],
  [
    "case.gs028e.wound-healing-remaining.c1-lipoma-margin",
    "node.gs028e.wound-healing-remaining.c1-lipoma-margin.1",
    "question.wound.hypertrophic-versus-keloid-extent.v2",
    "concept.wound.hypertrophic-versus-keloid-extent"
  ],
  [
    "case.gs028e.wound-healing-remaining.c1-piercing-boundary",
    "node.gs028e.wound-healing-remaining.c1-piercing-boundary.1",
    "question.wound.hypertrophic-versus-keloid-extent.v3",
    "concept.wound.hypertrophic-versus-keloid-extent"
  ],
  [
    "case.gs028e.wound-healing-remaining.c1-burn-outline",
    "node.gs028e.wound-healing-remaining.c1-burn-outline.1",
    "question.wound.hypertrophic-versus-keloid-extent.v4",
    "concept.wound.hypertrophic-versus-keloid-extent"
  ],
  [
    "case.gs028e.wound-healing-remaining.c2-skin-excision-plan",
    "node.gs028e.wound-healing-remaining.c2-skin-excision-plan.1",
    "question.wound.secondary-intention-healing.v1.r2",
    "concept.wound.secondary-intention-healing"
  ],
  [
    "case.gs028e.wound-healing-remaining.c2-no-stitch-mixup",
    "node.gs028e.wound-healing-remaining.c2-no-stitch-mixup.1",
    "question.wound.secondary-intention-healing.v2",
    "concept.wound.secondary-intention-healing"
  ],
  [
    "case.gs028e.wound-healing-remaining.c2-scheduled-review",
    "node.gs028e.wound-healing-remaining.c2-scheduled-review.1",
    "question.wound.secondary-intention-healing.v3",
    "concept.wound.secondary-intention-healing"
  ],
  [
    "case.gs028e.wound-healing-remaining.c2-closure-method-form",
    "node.gs028e.wound-healing-remaining.c2-closure-method-form.1",
    "question.wound.secondary-intention-healing.v4",
    "concept.wound.secondary-intention-healing"
  ],
  [
    "case.gs028e.immunology.c1-food-allergy-effector",
    "node.gs028e.immunology.c1-food-allergy-effector.1",
    "question.immunology.ige-mast-cell-type-i.v1",
    "concept.immunology.ige-mast-cell-type-i"
  ],
  [
    "case.gs028e.immunology.c1-latex-type",
    "node.gs028e.immunology.c1-latex-type.1",
    "question.immunology.ige-mast-cell-type-i.v2",
    "concept.immunology.ige-mast-cell-type-i"
  ],
  [
    "case.gs028e.immunology.c1-antibody-class",
    "node.gs028e.immunology.c1-antibody-class.1",
    "question.immunology.ige-mast-cell-type-i.v3",
    "concept.immunology.ige-mast-cell-type-i"
  ],
  [
    "case.gs028e.immunology.c1-mediator-release",
    "node.gs028e.immunology.c1-mediator-release.1",
    "question.immunology.ige-mast-cell-type-i.v4",
    "concept.immunology.ige-mast-cell-type-i"
  ],
  [
    "case.gs028e.immunology.c2-adhesive-category",
    "node.gs028e.immunology.c2-adhesive-category.1",
    "question.immunology.t-cell-type-iv-contact.v1",
    "concept.immunology.t-cell-type-iv-contact"
  ],
  [
    "case.gs028e.immunology.c2-glove-accelerator",
    "node.gs028e.immunology.c2-glove-accelerator.1",
    "question.immunology.t-cell-type-iv-contact.v2",
    "concept.immunology.t-cell-type-iv-contact"
  ],
  [
    "case.gs028e.immunology.c2-nickel-cellular",
    "node.gs028e.immunology.c2-nickel-cellular.1",
    "question.immunology.t-cell-type-iv-contact.v3",
    "concept.immunology.t-cell-type-iv-contact"
  ],
  [
    "case.gs028e.immunology.c2-repeat-contact",
    "node.gs028e.immunology.c2-repeat-contact.1",
    "question.immunology.t-cell-type-iv-contact.v4",
    "concept.immunology.t-cell-type-iv-contact"
  ],
  [
    "case.gs028e.immunology.c3-historical-kidney-event",
    "node.gs028e.immunology.c3-historical-kidney-event.1",
    "question.immunology.preformed-antibody-hyperacute-rejection.v1",
    "concept.immunology.preformed-antibody-hyperacute-rejection"
  ],
  [
    "case.gs028e.immunology.c3-vascular-biopsy",
    "node.gs028e.immunology.c3-vascular-biopsy.1",
    "question.immunology.preformed-antibody-hyperacute-rejection.v2",
    "concept.immunology.preformed-antibody-hyperacute-rejection"
  ],
  [
    "case.gs028e.immunology.c3-antibody-timing",
    "node.gs028e.immunology.c3-antibody-timing.1",
    "question.immunology.preformed-antibody-hyperacute-rejection.v3",
    "concept.immunology.preformed-antibody-hyperacute-rejection"
  ],
  [
    "case.gs028e.immunology.c3-injury-pathway",
    "node.gs028e.immunology.c3-injury-pathway.1",
    "question.immunology.preformed-antibody-hyperacute-rejection.v4",
    "concept.immunology.preformed-antibody-hyperacute-rejection"
  ],
  [
    "case.gs028e.coagulation.paired-elective-record-workup",
    "node.gs028e.coagulation.paired-elective-record-workup.1",
    "question.coagulation.isolated-aptt-mixing-workup.v1",
    "concept.coagulation.isolated-aptt-mixing-workup"
  ],
  [
    "case.gs028e.coagulation.paired-elective-record-workup",
    "node.gs028e.coagulation.paired-elective-record-workup.2",
    "question.coagulation.mixing-study-initial-interpretation.v1",
    "concept.coagulation.mixing-study-initial-interpretation"
  ],
  [
    "case.gs028e.coagulation.paired-specialist-bruising-review",
    "node.gs028e.coagulation.paired-specialist-bruising-review.1",
    "question.coagulation.isolated-aptt-mixing-workup.v2",
    "concept.coagulation.isolated-aptt-mixing-workup"
  ],
  [
    "case.gs028e.coagulation.paired-specialist-bruising-review",
    "node.gs028e.coagulation.paired-specialist-bruising-review.2",
    "question.coagulation.mixing-study-initial-interpretation.v2",
    "concept.coagulation.mixing-study-initial-interpretation"
  ],
  [
    "case.gs028e.coagulation.c1-referral-test-purpose",
    "node.gs028e.coagulation.c1-referral-test-purpose.1",
    "question.coagulation.isolated-aptt-mixing-workup.v3",
    "concept.coagulation.isolated-aptt-mixing-workup"
  ],
  [
    "case.gs028e.coagulation.c1-outside-lab-planning",
    "node.gs028e.coagulation.c1-outside-lab-planning.1",
    "question.coagulation.isolated-aptt-mixing-workup.v4",
    "concept.coagulation.isolated-aptt-mixing-workup"
  ],
  [
    "case.gs028e.coagulation.c2-correction-lost-with-incubation",
    "node.gs028e.coagulation.c2-correction-lost-with-incubation.1",
    "question.coagulation.mixing-study-initial-interpretation.v3",
    "concept.coagulation.mixing-study-initial-interpretation"
  ],
  [
    "case.gs028e.coagulation.c2-immediate-only-report",
    "node.gs028e.coagulation.c2-immediate-only-report.1",
    "question.coagulation.mixing-study-initial-interpretation.v4",
    "concept.coagulation.mixing-study-initial-interpretation"
  ],
  [
    "case.gs028e.oncology.c1-colon-spread-summary",
    "node.gs028e.oncology.c1-colon-spread-summary.1",
    "question.oncology.stage-versus-grade.v1",
    "concept.oncology.stage-versus-grade"
  ],
  [
    "case.gs028e.oncology.c1-breast-microscopy",
    "node.gs028e.oncology.c1-breast-microscopy.1",
    "question.oncology.stage-versus-grade.v2",
    "concept.oncology.stage-versus-grade"
  ],
  [
    "case.gs028e.oncology.c1-grade-means-metastatic",
    "node.gs028e.oncology.c1-grade-means-metastatic.1",
    "question.oncology.stage-versus-grade.v3",
    "concept.oncology.stage-versus-grade"
  ],
  [
    "case.gs028e.oncology.c1-node-versus-cells",
    "node.gs028e.oncology.c1-node-versus-cells.1",
    "question.oncology.stage-versus-grade.v4",
    "concept.oncology.stage-versus-grade"
  ],
  [
    "case.gs028e.oncology.c2-one-deleted-one-inactive",
    "node.gs028e.oncology.c2-one-deleted-one-inactive.1",
    "question.oncology.rb1-biallelic-tumor-suppressor-loss.v1",
    "concept.oncology.rb1-biallelic-tumor-suppressor-loss"
  ],
  [
    "case.gs028e.oncology.c2-both-copies-deleted",
    "node.gs028e.oncology.c2-both-copies-deleted.1",
    "question.oncology.rb1-biallelic-tumor-suppressor-loss.v2",
    "concept.oncology.rb1-biallelic-tumor-suppressor-loss"
  ],
  [
    "case.gs028e.oncology.c2-two-hit-description",
    "node.gs028e.oncology.c2-two-hit-description.1",
    "question.oncology.rb1-biallelic-tumor-suppressor-loss.v3",
    "concept.oncology.rb1-biallelic-tumor-suppressor-loss"
  ],
  [
    "case.gs028e.oncology.c2-functional-consequence",
    "node.gs028e.oncology.c2-functional-consequence.1",
    "question.oncology.rb1-biallelic-tumor-suppressor-loss.v4",
    "concept.oncology.rb1-biallelic-tumor-suppressor-loss"
  ],
  [
    "case.gs028e.operative-infection.c1-clean-soft-tissue",
    "node.gs028e.operative-infection.c1-clean-soft-tissue.1",
    "question.infection.operative-wound-classification.v1",
    "concept.infection.operative-wound-classification"
  ],
  [
    "case.gs028e.operative-infection.c1-controlled-bowel-entry",
    "node.gs028e.operative-infection.c1-controlled-bowel-entry.1",
    "question.infection.operative-wound-classification.v2",
    "concept.infection.operative-wound-classification"
  ],
  [
    "case.gs028e.operative-infection.c1-unexpected-gross-spill",
    "node.gs028e.operative-infection.c1-unexpected-gross-spill.1",
    "question.infection.operative-wound-classification.v3",
    "concept.infection.operative-wound-classification"
  ],
  [
    "case.gs028e.operative-infection.c1-purulent-perforation",
    "node.gs028e.operative-infection.c1-purulent-perforation.1",
    "question.infection.operative-wound-classification.v4",
    "concept.infection.operative-wound-classification"
  ],
  [
    "case.gs028f.gynecology.c1-late-period",
    "node.gs028f.gynecology.c1-late-period.1",
    "question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v1",
    "concept.gs028f.gynecology.pregnancy-testing-pelvic-pain"
  ],
  [
    "case.gs028f.gynecology.c1-contraception-spotting",
    "node.gs028f.gynecology.c1-contraception-spotting.1",
    "question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v2",
    "concept.gs028f.gynecology.pregnancy-testing-pelvic-pain"
  ],
  [
    "case.gs028f.gynecology.c1-early-home-negative",
    "node.gs028f.gynecology.c1-early-home-negative.1",
    "question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v3",
    "concept.gs028f.gynecology.pregnancy-testing-pelvic-pain"
  ],
  [
    "case.gs028f.gynecology.c1-outside-assay-record",
    "node.gs028f.gynecology.c1-outside-assay-record.1",
    "question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v4",
    "concept.gs028f.gynecology.pregnancy-testing-pelvic-pain"
  ],
  [
    "case.gs028f.gynecology.c2-stable-unilateral",
    "node.gs028f.gynecology.c2-stable-unilateral.1",
    "question.gs028f.gynecology.suspected-ectopic-urgent-evaluation.v1",
    "concept.gs028f.gynecology.suspected-ectopic-urgent-evaluation"
  ],
  [
    "case.gs028f.gynecology.c2-bleeding-not-diagnosis",
    "node.gs028f.gynecology.c2-bleeding-not-diagnosis.1",
    "question.gs028f.gynecology.suspected-ectopic-urgent-evaluation.v2",
    "concept.gs028f.gynecology.suspected-ectopic-urgent-evaluation"
  ],
  [
    "case.gs028f.gynecology.c2-unlocated-new-pain",
    "node.gs028f.gynecology.c2-unlocated-new-pain.1",
    "question.gs028f.gynecology.suspected-ectopic-urgent-evaluation.v3",
    "concept.gs028f.gynecology.suspected-ectopic-urgent-evaluation"
  ],
  [
    "case.gs028f.gynecology.c2-pain-without-bleeding",
    "node.gs028f.gynecology.c2-pain-without-bleeding.1",
    "question.gs028f.gynecology.suspected-ectopic-urgent-evaluation.v4",
    "concept.gs028f.gynecology.suspected-ectopic-urgent-evaluation"
  ],
  [
    "case.gs028f.peripheral-nerve.c1-three-finger-pattern",
    "node.gs028f.peripheral-nerve.c1-three-finger-pattern.1",
    "question.gs028f.plastic.median-carpal-tunnel-localization.v1",
    "concept.gs028f.plastic.median-carpal-tunnel-localization"
  ],
  [
    "case.gs028f.peripheral-nerve.c1-shake-the-hand",
    "node.gs028f.peripheral-nerve.c1-shake-the-hand.1",
    "question.gs028f.plastic.median-carpal-tunnel-localization.v2",
    "concept.gs028f.plastic.median-carpal-tunnel-localization"
  ],
  [
    "case.gs028f.peripheral-nerve.c1-little-finger-question",
    "node.gs028f.peripheral-nerve.c1-little-finger-question.1",
    "question.gs028f.plastic.median-carpal-tunnel-localization.v3",
    "concept.gs028f.plastic.median-carpal-tunnel-localization"
  ],
  [
    "case.gs028f.peripheral-nerve.c1-outside-carpal-report",
    "node.gs028f.peripheral-nerve.c1-outside-carpal-report.1",
    "question.gs028f.plastic.median-carpal-tunnel-localization.v4",
    "concept.gs028f.plastic.median-carpal-tunnel-localization"
  ],
  [
    "case.gs028f.peripheral-nerve.c2-bent-elbow-call",
    "node.gs028f.peripheral-nerve.c2-bent-elbow-call.1",
    "question.gs028f.plastic.ulnar-cubital-tunnel-localization.v1",
    "concept.gs028f.plastic.ulnar-cubital-tunnel-localization"
  ],
  [
    "case.gs028f.peripheral-nerve.c2-desk-elbow",
    "node.gs028f.peripheral-nerve.c2-desk-elbow.1",
    "question.gs028f.plastic.ulnar-cubital-tunnel-localization.v2",
    "concept.gs028f.plastic.ulnar-cubital-tunnel-localization"
  ],
  [
    "case.gs028f.peripheral-nerve.c2-night-flexion",
    "node.gs028f.peripheral-nerve.c2-night-flexion.1",
    "question.gs028f.plastic.ulnar-cubital-tunnel-localization.v3",
    "concept.gs028f.plastic.ulnar-cubital-tunnel-localization"
  ],
  [
    "case.gs028f.peripheral-nerve.c2-outside-cubital-report",
    "node.gs028f.peripheral-nerve.c2-outside-cubital-report.1",
    "question.gs028f.plastic.ulnar-cubital-tunnel-localization.v4",
    "concept.gs028f.plastic.ulnar-cubital-tunnel-localization"
  ],
  [
    "case.gs028f.neck-mass.paired-persistent-solid",
    "node.gs028f.neck-mass.paired-persistent-solid.1",
    "question.gs028f.head-neck.persistent-mass-malignancy-ct.v1",
    "concept.gs028f.head-neck.persistent-mass-malignancy-ct"
  ],
  [
    "case.gs028f.neck-mass.paired-persistent-solid",
    "node.gs028f.neck-mass.paired-persistent-solid.2",
    "question.gs028f.head-neck.initial-fna-not-open-biopsy.v1",
    "concept.gs028f.head-neck.initial-fna-not-open-biopsy"
  ],
  [
    "case.gs028f.neck-mass.paired-cystic-is-not-benign",
    "node.gs028f.neck-mass.paired-cystic-is-not-benign.1",
    "question.gs028f.head-neck.persistent-mass-malignancy-ct.v2",
    "concept.gs028f.head-neck.persistent-mass-malignancy-ct"
  ],
  [
    "case.gs028f.neck-mass.paired-cystic-is-not-benign",
    "node.gs028f.neck-mass.paired-cystic-is-not-benign.2",
    "question.gs028f.head-neck.initial-fna-not-open-biopsy.v2",
    "concept.gs028f.head-neck.initial-fna-not-open-biopsy"
  ],
  [
    "case.gs028f.neck-mass.c1-infection-resolved-lump-persists",
    "node.gs028f.neck-mass.c1-infection-resolved-lump-persists.1",
    "question.gs028f.head-neck.persistent-mass-malignancy-ct.v3",
    "concept.gs028f.head-neck.persistent-mass-malignancy-ct"
  ],
  [
    "case.gs028f.neck-mass.c1-completed-ct-purpose",
    "node.gs028f.neck-mass.c1-completed-ct-purpose.1",
    "question.gs028f.head-neck.persistent-mass-malignancy-ct.v4",
    "concept.gs028f.head-neck.persistent-mass-malignancy-ct"
  ],
  [
    "case.gs028f.neck-mass.c2-proposed-open-plan",
    "node.gs028f.neck-mass.c2-proposed-open-plan.1",
    "question.gs028f.head-neck.initial-fna-not-open-biopsy.v3",
    "concept.gs028f.head-neck.initial-fna-not-open-biopsy"
  ],
  [
    "case.gs028f.neck-mass.c2-completed-needle-record",
    "node.gs028f.neck-mass.c2-completed-needle-record.1",
    "question.gs028f.head-neck.initial-fna-not-open-biopsy.v4",
    "concept.gs028f.head-neck.initial-fna-not-open-biopsy"
  ],
  [
    "case.gs028f.reconstruction.c1-attached-bridge",
    "node.gs028f.reconstruction.c1-attached-bridge.1",
    "question.gs028f.plastic.graft-versus-flap-blood-supply.v1",
    "concept.gs028f.plastic.graft-versus-flap-blood-supply"
  ],
  [
    "case.gs028f.reconstruction.c1-reconnected-vessels",
    "node.gs028f.reconstruction.c1-reconnected-vessels.1",
    "question.gs028f.plastic.graft-versus-flap-blood-supply.v2",
    "concept.gs028f.plastic.graft-versus-flap-blood-supply"
  ],
  [
    "case.gs028f.reconstruction.c1-recipient-bed",
    "node.gs028f.reconstruction.c1-recipient-bed.1",
    "question.gs028f.plastic.graft-versus-flap-blood-supply.v3",
    "concept.gs028f.plastic.graft-versus-flap-blood-supply"
  ],
  [
    "case.gs028f.reconstruction.c1-same-donor-different-supply",
    "node.gs028f.reconstruction.c1-same-donor-different-supply.1",
    "question.gs028f.plastic.graft-versus-flap-blood-supply.v4",
    "concept.gs028f.plastic.graft-versus-flap-blood-supply"
  ],
  [
    "case.gs028f.reconstruction.c2-donor-cell-source",
    "node.gs028f.reconstruction.c2-donor-cell-source.1",
    "question.gs028f.plastic.split-thickness-donor-epithelial-regrowth.v1",
    "concept.gs028f.plastic.split-thickness-donor-epithelial-regrowth"
  ],
  [
    "case.gs028f.reconstruction.c2-donor-not-recipient",
    "node.gs028f.reconstruction.c2-donor-not-recipient.1",
    "question.gs028f.plastic.split-thickness-donor-epithelial-regrowth.v2",
    "concept.gs028f.plastic.split-thickness-donor-epithelial-regrowth"
  ],
  [
    "case.gs028f.reconstruction.c2-partial-depth-preservation",
    "node.gs028f.reconstruction.c2-partial-depth-preservation.1",
    "question.gs028f.plastic.split-thickness-donor-epithelial-regrowth.v3",
    "concept.gs028f.plastic.split-thickness-donor-epithelial-regrowth"
  ],
  [
    "case.gs028f.reconstruction.c2-epithelial-islands-record",
    "node.gs028f.reconstruction.c2-epithelial-islands-record.1",
    "question.gs028f.plastic.split-thickness-donor-epithelial-regrowth.v4",
    "concept.gs028f.plastic.split-thickness-donor-epithelial-regrowth"
  ],
  [
    "case.gs028f.transplant-relationships.c1-own-skin",
    "node.gs028f.transplant-relationships.c1-own-skin.1",
    "question.gs028f.transplantation.donor-recipient-relationships.v1",
    "concept.gs028f.transplantation.donor-recipient-relationships"
  ],
  [
    "case.gs028f.transplant-relationships.c1-sibling-donor",
    "node.gs028f.transplant-relationships.c1-sibling-donor.1",
    "question.gs028f.transplantation.donor-recipient-relationships.v2",
    "concept.gs028f.transplantation.donor-recipient-relationships"
  ],
  [
    "case.gs028f.transplant-relationships.c1-identical-twin",
    "node.gs028f.transplant-relationships.c1-identical-twin.1",
    "question.gs028f.transplantation.donor-recipient-relationships.v3",
    "concept.gs028f.transplantation.donor-recipient-relationships"
  ],
  [
    "case.gs028f.transplant-relationships.c1-porcine-record",
    "node.gs028f.transplant-relationships.c1-porcine-record.1",
    "question.gs028f.transplantation.donor-recipient-relationships.v4",
    "concept.gs028f.transplantation.donor-recipient-relationships"
  ],
  [
    "case.gs028f.local-anesthetic.c1-awake-biopsy",
    "node.gs028f.local-anesthetic.c1-awake-biopsy.1",
    "question.gs028f.pharmacology.local-anesthetic-sodium-channel-block.v1",
    "concept.gs028f.pharmacology.local-anesthetic-sodium-channel-block"
  ],
  [
    "case.gs028f.local-anesthetic.c1-dental-membrane",
    "node.gs028f.local-anesthetic.c1-dental-membrane.1",
    "question.gs028f.pharmacology.local-anesthetic-sodium-channel-block.v2",
    "concept.gs028f.pharmacology.local-anesthetic-sodium-channel-block"
  ],
  [
    "case.gs028f.local-anesthetic.c1-topical-record",
    "node.gs028f.local-anesthetic.c1-topical-record.1",
    "question.gs028f.pharmacology.local-anesthetic-sodium-channel-block.v3",
    "concept.gs028f.pharmacology.local-anesthetic-sodium-channel-block"
  ],
  [
    "case.gs028f.local-anesthetic.c1-regional-report",
    "node.gs028f.local-anesthetic.c1-regional-report.1",
    "question.gs028f.pharmacology.local-anesthetic-sodium-channel-block.v4",
    "concept.gs028f.pharmacology.local-anesthetic-sodium-channel-block"
  ],
  [
    "case.gs028f.tacrolimus.c1-kidney-target",
    "node.gs028f.tacrolimus.c1-kidney-target.1",
    "question.gs028f.pharmacology.tacrolimus-calcineurin-inhibition.v1",
    "concept.gs028f.pharmacology.tacrolimus-calcineurin-inhibition"
  ],
  [
    "case.gs028f.tacrolimus.c1-liver-binding",
    "node.gs028f.tacrolimus.c1-liver-binding.1",
    "question.gs028f.pharmacology.tacrolimus-calcineurin-inhibition.v2",
    "concept.gs028f.pharmacology.tacrolimus-calcineurin-inhibition"
  ],
  [
    "case.gs028f.tacrolimus.c1-heart-cell-effect",
    "node.gs028f.tacrolimus.c1-heart-cell-effect.1",
    "question.gs028f.pharmacology.tacrolimus-calcineurin-inhibition.v3",
    "concept.gs028f.pharmacology.tacrolimus-calcineurin-inhibition"
  ],
  [
    "case.gs028f.tacrolimus.c1-pathway-arrow",
    "node.gs028f.tacrolimus.c1-pathway-arrow.1",
    "question.gs028f.pharmacology.tacrolimus-calcineurin-inhibition.v4",
    "concept.gs028f.pharmacology.tacrolimus-calcineurin-inhibition"
  ],
  [
    "case.gs028f.anesthesia-remaining.c1-preop-muscle-role",
    "node.gs028f.anesthesia-remaining.c1-preop-muscle-role.1",
    "question.gs028f.anesthesia.neuromuscular-blockade-effect-boundary.v1",
    "concept.gs028f.anesthesia.neuromuscular-blockade-effect-boundary"
  ],
  [
    "case.gs028f.anesthesia-remaining.c1-separate-anesthetic",
    "node.gs028f.anesthesia-remaining.c1-separate-anesthetic.1",
    "question.gs028f.anesthesia.neuromuscular-blockade-effect-boundary.v2",
    "concept.gs028f.anesthesia.neuromuscular-blockade-effect-boundary"
  ],
  [
    "case.gs028f.anesthesia-remaining.c1-chart-entry-audit",
    "node.gs028f.anesthesia-remaining.c1-chart-entry-audit.1",
    "question.gs028f.anesthesia.neuromuscular-blockade-effect-boundary.v3",
    "concept.gs028f.anesthesia.neuromuscular-blockade-effect-boundary"
  ],
  [
    "case.gs028f.anesthesia-remaining.c1-movement-observation",
    "node.gs028f.anesthesia-remaining.c1-movement-observation.1",
    "question.gs028f.anesthesia.neuromuscular-blockade-effect-boundary.v4",
    "concept.gs028f.anesthesia.neuromuscular-blockade-effect-boundary"
  ],
  [
    "case.gs028f.anesthesia-remaining.c2-ringing-ears-record",
    "node.gs028f.anesthesia-remaining.c2-ringing-ears-record.1",
    "question.gs028f.anesthesia.local-anesthetic-systemic-toxicity-recognition.v1",
    "concept.gs028f.anesthesia.local-anesthetic-systemic-toxicity-recognition"
  ],
  [
    "case.gs028f.anesthesia-remaining.c2-seizure-rhythm-report",
    "node.gs028f.anesthesia-remaining.c2-seizure-rhythm-report.1",
    "question.gs028f.anesthesia.local-anesthetic-systemic-toxicity-recognition.v2",
    "concept.gs028f.anesthesia.local-anesthetic-systemic-toxicity-recognition"
  ],
  [
    "case.gs028f.anesthesia-remaining.c2-warning-cluster",
    "node.gs028f.anesthesia-remaining.c2-warning-cluster.1",
    "question.gs028f.anesthesia.local-anesthetic-systemic-toxicity-recognition.v3",
    "concept.gs028f.anesthesia.local-anesthetic-systemic-toxicity-recognition"
  ],
  [
    "case.gs028f.anesthesia-remaining.c2-cardiac-first",
    "node.gs028f.anesthesia-remaining.c2-cardiac-first.1",
    "question.gs028f.anesthesia.local-anesthetic-systemic-toxicity-recognition.v4",
    "concept.gs028f.anesthesia.local-anesthetic-systemic-toxicity-recognition"
  ],
  [
    "case.gs028f.nutrition.c1-outside-phosphate-course",
    "node.gs028f.nutrition.c1-outside-phosphate-course.1",
    "question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v1",
    "concept.gs028f.nutrition.refeeding-insulin-phosphate-shift"
  ],
  [
    "case.gs028f.nutrition.c1-where-phosphate-went",
    "node.gs028f.nutrition.c1-where-phosphate-went.1",
    "question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v2.r2",
    "concept.gs028f.nutrition.refeeding-insulin-phosphate-shift"
  ],
  [
    "case.gs028f.nutrition.c1-metabolic-transition",
    "node.gs028f.nutrition.c1-metabolic-transition.1",
    "question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3",
    "concept.gs028f.nutrition.refeeding-insulin-phosphate-shift"
  ],
  [
    "case.gs028f.nutrition.c1-hormonal-response",
    "node.gs028f.nutrition.c1-hormonal-response.1",
    "question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v4",
    "concept.gs028f.nutrition.refeeding-insulin-phosphate-shift"
  ],
  [
    "case.gs028f.nutrition.c2-vitamin-plan",
    "node.gs028f.nutrition.c2-vitamin-plan.1",
    "question.gs028f.nutrition.high-risk-refeeding-thiamine-planning.v1",
    "concept.gs028f.nutrition.high-risk-refeeding-thiamine-planning"
  ],
  [
    "case.gs028f.nutrition.c2-timing-question",
    "node.gs028f.nutrition.c2-timing-question.1",
    "question.gs028f.nutrition.high-risk-refeeding-thiamine-planning.v2",
    "concept.gs028f.nutrition.high-risk-refeeding-thiamine-planning"
  ],
  [
    "case.gs028f.nutrition.c2-monitoring-question",
    "node.gs028f.nutrition.c2-monitoring-question.1",
    "question.gs028f.nutrition.high-risk-refeeding-thiamine-planning.v3",
    "concept.gs028f.nutrition.high-risk-refeeding-thiamine-planning"
  ],
  [
    "case.gs028f.nutrition.c2-plan-entry-audit",
    "node.gs028f.nutrition.c2-plan-entry-audit.1",
    "question.gs028f.nutrition.high-risk-refeeding-thiamine-planning.v4",
    "concept.gs028f.nutrition.high-risk-refeeding-thiamine-planning"
  ],
  [
    "case.gs028f.patient-safety.c1-wrong-medicine-close-call",
    "node.gs028f.patient-safety.c1-wrong-medicine-close-call.1",
    "question.gs028f.outcomes.rca-versus-fmea-purpose.v1",
    "concept.gs028f.outcomes.rca-versus-fmea-purpose"
  ],
  [
    "case.gs028f.patient-safety.c1-future-handoff",
    "node.gs028f.patient-safety.c1-future-handoff.1",
    "question.gs028f.outcomes.rca-versus-fmea-purpose.v2",
    "concept.gs028f.outcomes.rca-versus-fmea-purpose"
  ],
  [
    "case.gs028f.patient-safety.c1-delayed-report-purpose",
    "node.gs028f.patient-safety.c1-delayed-report-purpose.1",
    "question.gs028f.outcomes.rca-versus-fmea-purpose.v3",
    "concept.gs028f.outcomes.rca-versus-fmea-purpose"
  ],
  [
    "case.gs028f.patient-safety.c1-fmea-question",
    "node.gs028f.patient-safety.c1-fmea-question.1",
    "question.gs028f.outcomes.rca-versus-fmea-purpose.v4",
    "concept.gs028f.outcomes.rca-versus-fmea-purpose"
  ],
  [
    "case.gs028f.oxygen-content.c1-anemia-normal-clip",
    "node.gs028f.oxygen-content.c1-anemia-normal-clip.1",
    "question.gs028f.critical-care.normal-spo2-anemia-content.v1",
    "concept.gs028f.critical-care.normal-spo2-anemia-content"
  ],
  [
    "case.gs028f.oxygen-content.c1-same-fraction",
    "node.gs028f.oxygen-content.c1-same-fraction.1",
    "question.gs028f.critical-care.normal-spo2-anemia-content.v2",
    "concept.gs028f.critical-care.normal-spo2-anemia-content"
  ],
  [
    "case.gs028f.oxygen-content.c1-display-fields",
    "node.gs028f.oxygen-content.c1-display-fields.1",
    "question.gs028f.critical-care.normal-spo2-anemia-content.v3",
    "concept.gs028f.critical-care.normal-spo2-anemia-content"
  ],
  [
    "case.gs028f.oxygen-content.c1-reassurance-note",
    "node.gs028f.oxygen-content.c1-reassurance-note.1",
    "question.gs028f.critical-care.normal-spo2-anemia-content.v4",
    "concept.gs028f.critical-care.normal-spo2-anemia-content"
  ],
  [
    "case.gs028f.melanoma-bowel.c1-primary-site-field",
    "node.gs028f.melanoma-bowel.c1-primary-site-field.1",
    "question.gs028f.oncology.small-bowel-melanoma-cutaneous-origin.v1",
    "concept.gs028f.oncology.small-bowel-melanoma-cutaneous-origin"
  ],
  [
    "case.gs028f.melanoma-bowel.c1-diagnosis-name",
    "node.gs028f.melanoma-bowel.c1-diagnosis-name.1",
    "question.gs028f.oncology.small-bowel-melanoma-cutaneous-origin.v2",
    "concept.gs028f.oncology.small-bowel-melanoma-cutaneous-origin"
  ],
  [
    "case.gs028f.melanoma-bowel.c1-spread-relationship",
    "node.gs028f.melanoma-bowel.c1-spread-relationship.1",
    "question.gs028f.oncology.small-bowel-melanoma-cutaneous-origin.v3",
    "concept.gs028f.oncology.small-bowel-melanoma-cutaneous-origin"
  ],
  [
    "case.gs028f.melanoma-bowel.c1-chart-label-audit",
    "node.gs028f.melanoma-bowel.c1-chart-label-audit.1",
    "question.gs028f.oncology.small-bowel-melanoma-cutaneous-origin.v4",
    "concept.gs028f.oncology.small-bowel-melanoma-cutaneous-origin"
  ],
  [
    "case.gs028f.foreign-body.c1-negative-fishbone-films",
    "node.gs028f.foreign-body.c1-negative-fishbone-films.1",
    "question.gs028f.esophagus.negative-radiograph-retained-bone-limit.v1",
    "concept.gs028f.esophagus.negative-radiograph-retained-bone-limit"
  ],
  [
    "case.gs028f.foreign-body.c1-bone-visibility",
    "node.gs028f.foreign-body.c1-bone-visibility.1",
    "question.gs028f.esophagus.negative-radiograph-retained-bone-limit.v2",
    "concept.gs028f.esophagus.negative-radiograph-retained-bone-limit"
  ],
  [
    "case.gs028f.foreign-body.c1-breathing-reassurance",
    "node.gs028f.foreign-body.c1-breathing-reassurance.1",
    "question.gs028f.esophagus.negative-radiograph-retained-bone-limit.v3",
    "concept.gs028f.esophagus.negative-radiograph-retained-bone-limit"
  ],
  [
    "case.gs028f.foreign-body.c1-completed-false-negative",
    "node.gs028f.foreign-body.c1-completed-false-negative.1",
    "question.gs028f.esophagus.negative-radiograph-retained-bone-limit.v4",
    "concept.gs028f.esophagus.negative-radiograph-retained-bone-limit"
  ],
  [
    "case.gs028f.foreign-body.c2-confirmed-fishbone",
    "node.gs028f.foreign-body.c2-confirmed-fishbone.1",
    "question.gs028f.esophagus.confirmed-sharp-object-emergency-referral.v1",
    "concept.gs028f.esophagus.confirmed-sharp-object-emergency-referral"
  ],
  [
    "case.gs028f.foreign-body.c2-referral-priority",
    "node.gs028f.foreign-body.c2-referral-priority.1",
    "question.gs028f.esophagus.confirmed-sharp-object-emergency-referral.v2",
    "concept.gs028f.esophagus.confirmed-sharp-object-emergency-referral"
  ],
  [
    "case.gs028f.foreign-body.c2-elective-plan-audit",
    "node.gs028f.foreign-body.c2-elective-plan-audit.1",
    "question.gs028f.esophagus.confirmed-sharp-object-emergency-referral.v3",
    "concept.gs028f.esophagus.confirmed-sharp-object-emergency-referral"
  ],
  [
    "case.gs028f.foreign-body.c2-urgency-driver",
    "node.gs028f.foreign-body.c2-urgency-driver.1",
    "question.gs028f.esophagus.confirmed-sharp-object-emergency-referral.v4",
    "concept.gs028f.esophagus.confirmed-sharp-object-emergency-referral"
  ],
  [
    "case.gs028g.hiv-perioperative.paired-routine-elective",
    "node.gs028g.hiv-perioperative.paired-routine-elective.1",
    "question.gs028g.hiv-perioperative.art-continuity.v1.r7",
    "concept.gs028g.hiv-perioperative.art-continuity"
  ],
  [
    "case.gs028g.hiv-perioperative.paired-routine-elective",
    "node.gs028g.hiv-perioperative.paired-routine-elective.2",
    "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r8",
    "concept.gs028g.hiv-perioperative.booster-midazolam-interaction.v2"
  ],
  [
    "case.gs028g.hiv-perioperative.paired-postoperative-orders",
    "node.gs028g.hiv-perioperative.paired-postoperative-orders.1",
    "question.gs028g.hiv-perioperative.art-continuity.v2",
    "concept.gs028g.hiv-perioperative.art-continuity"
  ],
  [
    "case.gs028g.hiv-perioperative.paired-postoperative-orders",
    "node.gs028g.hiv-perioperative.paired-postoperative-orders.2",
    "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v2",
    "concept.gs028g.hiv-perioperative.booster-midazolam-interaction"
  ],
  [
    "case.gs028g.hiv-perioperative.c1-temporary-enteral-problem",
    "node.gs028g.hiv-perioperative.c1-temporary-enteral-problem.1",
    "question.gs028g.hiv-perioperative.art-continuity.v3",
    "concept.gs028g.hiv-perioperative.art-continuity"
  ],
  [
    "case.gs028g.hiv-perioperative.c1-routine-fast",
    "node.gs028g.hiv-perioperative.c1-routine-fast.1",
    "question.gs028g.hiv-perioperative.art-continuity.v4",
    "concept.gs028g.hiv-perioperative.art-continuity"
  ],
  [
    "case.gs028g.hiv-perioperative.c2-monitored-iv",
    "node.gs028g.hiv-perioperative.c2-monitored-iv.1",
    "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v3",
    "concept.gs028g.hiv-perioperative.booster-midazolam-interaction"
  ],
  [
    "case.gs028g.hiv-perioperative.c2-slow-clearance",
    "node.gs028g.hiv-perioperative.c2-slow-clearance.1",
    "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v4",
    "concept.gs028g.hiv-perioperative.booster-midazolam-interaction"
  ],
  [
    "case.gs028g.neuromuscular-recovery.paired-head-lift",
    "node.gs028g.neuromuscular-recovery.paired-head-lift.1",
    "question.gs028g.neuromuscular-recovery.quantitative-assessment.v1",
    "concept.gs028g.neuromuscular-recovery.quantitative-assessment"
  ],
  [
    "case.gs028g.neuromuscular-recovery.paired-head-lift",
    "node.gs028g.neuromuscular-recovery.paired-head-lift.2",
    "question.gs028g.neuromuscular-recovery.sugammadex-selectivity.v1",
    "concept.gs028g.neuromuscular-recovery.sugammadex-selectivity"
  ],
  [
    "case.gs028g.neuromuscular-recovery.paired-four-twitches",
    "node.gs028g.neuromuscular-recovery.paired-four-twitches.1",
    "question.gs028g.neuromuscular-recovery.quantitative-assessment.v2",
    "concept.gs028g.neuromuscular-recovery.quantitative-assessment"
  ],
  [
    "case.gs028g.neuromuscular-recovery.paired-four-twitches",
    "node.gs028g.neuromuscular-recovery.paired-four-twitches.2",
    "question.gs028g.neuromuscular-recovery.sugammadex-selectivity.v2",
    "concept.gs028g.neuromuscular-recovery.sugammadex-selectivity"
  ],
  [
    "case.gs028g.neuromuscular-recovery.c1-future-plan",
    "node.gs028g.neuromuscular-recovery.c1-future-plan.1",
    "question.gs028g.neuromuscular-recovery.quantitative-assessment.v3",
    "concept.gs028g.neuromuscular-recovery.quantitative-assessment"
  ],
  [
    "case.gs028g.neuromuscular-recovery.c1-subjective-fade",
    "node.gs028g.neuromuscular-recovery.c1-subjective-fade.1",
    "question.gs028g.neuromuscular-recovery.quantitative-assessment.v4",
    "concept.gs028g.neuromuscular-recovery.quantitative-assessment"
  ],
  [
    "case.gs028g.neuromuscular-recovery.c2-cisatracurium-boundary",
    "node.gs028g.neuromuscular-recovery.c2-cisatracurium-boundary.1",
    "question.gs028g.neuromuscular-recovery.sugammadex-selectivity.v3",
    "concept.gs028g.neuromuscular-recovery.sugammadex-selectivity"
  ],
  [
    "case.gs028g.neuromuscular-recovery.c2-still-sedated",
    "node.gs028g.neuromuscular-recovery.c2-still-sedated.1",
    "question.gs028g.neuromuscular-recovery.sugammadex-selectivity.v4",
    "concept.gs028g.neuromuscular-recovery.sugammadex-selectivity"
  ],
  [
    "case.gs028g.peristomal-skin.paired-wide-opening",
    "node.gs028g.peristomal-skin.paired-wide-opening.1",
    "question.gs028g.peristomal-skin.effluent-irritation.v1.r4",
    "concept.gs028g.peristomal-skin.effluent-irritation"
  ],
  [
    "case.gs028g.peristomal-skin.paired-wide-opening",
    "node.gs028g.peristomal-skin.paired-wide-opening.2",
    "question.gs028g.peristomal-skin.restore-seal.v1.r4",
    "concept.gs028g.peristomal-skin.restore-seal"
  ],
  [
    "case.gs028g.peristomal-skin.paired-skin-fold-leak",
    "node.gs028g.peristomal-skin.paired-skin-fold-leak.1",
    "question.gs028g.peristomal-skin.effluent-irritation.v2",
    "concept.gs028g.peristomal-skin.effluent-irritation"
  ],
  [
    "case.gs028g.peristomal-skin.paired-skin-fold-leak",
    "node.gs028g.peristomal-skin.paired-skin-fold-leak.2",
    "question.gs028g.peristomal-skin.restore-seal.v2",
    "concept.gs028g.peristomal-skin.restore-seal"
  ],
  [
    "case.gs028g.peristomal-skin.c1-appliance-mismatch",
    "node.gs028g.peristomal-skin.c1-appliance-mismatch.1",
    "question.gs028g.peristomal-skin.effluent-irritation.v3",
    "concept.gs028g.peristomal-skin.effluent-irritation"
  ],
  [
    "case.gs028g.peristomal-skin.c1-leak-recurrence",
    "node.gs028g.peristomal-skin.c1-leak-recurrence.1",
    "question.gs028g.peristomal-skin.effluent-irritation.v4",
    "concept.gs028g.peristomal-skin.effluent-irritation"
  ],
  [
    "case.gs028g.peristomal-skin.c2-wet-barrier",
    "node.gs028g.peristomal-skin.c2-wet-barrier.1",
    "question.gs028g.peristomal-skin.restore-seal.v3",
    "concept.gs028g.peristomal-skin.restore-seal"
  ],
  [
    "case.gs028g.peristomal-skin.c2-repeated-treatment",
    "node.gs028g.peristomal-skin.c2-repeated-treatment.1",
    "question.gs028g.peristomal-skin.restore-seal.v4",
    "concept.gs028g.peristomal-skin.restore-seal"
  ],
  [
    "case.gs028g.mucocutaneous-separation.paired-small-gap",
    "node.gs028g.mucocutaneous-separation.paired-small-gap.1",
    "question.gs028g.mucocutaneous-separation.recognition.v1",
    "concept.gs028g.mucocutaneous-separation.recognition"
  ],
  [
    "case.gs028g.mucocutaneous-separation.paired-small-gap",
    "node.gs028g.mucocutaneous-separation.paired-small-gap.2",
    "question.gs028g.mucocutaneous-separation.superficial-care.v1",
    "concept.gs028g.mucocutaneous-separation.superficial-care"
  ],
  [
    "case.gs028g.mucocutaneous-separation.paired-junction-review",
    "node.gs028g.mucocutaneous-separation.paired-junction-review.1",
    "question.gs028g.mucocutaneous-separation.recognition.v2",
    "concept.gs028g.mucocutaneous-separation.recognition"
  ],
  [
    "case.gs028g.mucocutaneous-separation.paired-junction-review",
    "node.gs028g.mucocutaneous-separation.paired-junction-review.2",
    "question.gs028g.mucocutaneous-separation.superficial-care.v2",
    "concept.gs028g.mucocutaneous-separation.superficial-care"
  ],
  [
    "case.gs028g.mucocutaneous-separation.c1-pouch-off",
    "node.gs028g.mucocutaneous-separation.c1-pouch-off.1",
    "question.gs028g.mucocutaneous-separation.recognition.v3",
    "concept.gs028g.mucocutaneous-separation.recognition"
  ],
  [
    "case.gs028g.mucocutaneous-separation.c1-seam-question",
    "node.gs028g.mucocutaneous-separation.c1-seam-question.1",
    "question.gs028g.mucocutaneous-separation.recognition.v4",
    "concept.gs028g.mucocutaneous-separation.recognition"
  ],
  [
    "case.gs028g.mucocutaneous-separation.c2-seal-protection",
    "node.gs028g.mucocutaneous-separation.c2-seal-protection.1",
    "question.gs028g.mucocutaneous-separation.superficial-care.v3",
    "concept.gs028g.mucocutaneous-separation.superficial-care"
  ],
  [
    "case.gs028g.mucocutaneous-separation.c2-limited-stable",
    "node.gs028g.mucocutaneous-separation.c2-limited-stable.1",
    "question.gs028g.mucocutaneous-separation.superficial-care.v4",
    "concept.gs028g.mucocutaneous-separation.superficial-care"
  ],
  [
    "case.gs028g.incidental-gallbladder.paired-lamina-only",
    "node.gs028g.incidental-gallbladder.paired-lamina-only.1",
    "question.gs028g.incidental-gallbladder.t1a-depth.v1",
    "concept.gs028g.incidental-gallbladder.t1a-depth"
  ],
  [
    "case.gs028g.incidental-gallbladder.paired-lamina-only",
    "node.gs028g.incidental-gallbladder.paired-lamina-only.2",
    "question.gs028g.incidental-gallbladder.completely-resected-t1a.v1",
    "concept.gs028g.incidental-gallbladder.completely-resected-t1a"
  ],
  [
    "case.gs028g.incidental-gallbladder.paired-deeper-sections",
    "node.gs028g.incidental-gallbladder.paired-deeper-sections.1",
    "question.gs028g.incidental-gallbladder.t1a-depth.v2",
    "concept.gs028g.incidental-gallbladder.t1a-depth"
  ],
  [
    "case.gs028g.incidental-gallbladder.paired-deeper-sections",
    "node.gs028g.incidental-gallbladder.paired-deeper-sections.2",
    "question.gs028g.incidental-gallbladder.completely-resected-t1a.v2",
    "concept.gs028g.incidental-gallbladder.completely-resected-t1a"
  ],
  [
    "case.gs028g.incidental-gallbladder.c1-not-in-situ",
    "node.gs028g.incidental-gallbladder.c1-not-in-situ.1",
    "question.gs028g.incidental-gallbladder.t1a-depth.v3",
    "concept.gs028g.incidental-gallbladder.t1a-depth"
  ],
  [
    "case.gs028g.incidental-gallbladder.c1-wall-layer-review",
    "node.gs028g.incidental-gallbladder.c1-wall-layer-review.1",
    "question.gs028g.incidental-gallbladder.t1a-depth.v4",
    "concept.gs028g.incidental-gallbladder.t1a-depth"
  ],
  [
    "case.gs028g.incidental-gallbladder.c2-patient-choice-review",
    "node.gs028g.incidental-gallbladder.c2-patient-choice-review.1",
    "question.gs028g.incidental-gallbladder.completely-resected-t1a.v3",
    "concept.gs028g.incidental-gallbladder.completely-resected-t1a"
  ],
  [
    "case.gs028g.incidental-gallbladder.c2-muscle-not-involved",
    "node.gs028g.incidental-gallbladder.c2-muscle-not-involved.1",
    "question.gs028g.incidental-gallbladder.completely-resected-t1a.v4",
    "concept.gs028g.incidental-gallbladder.completely-resected-t1a"
  ],
  [
    "case.gs028g.merkel-cell.paired-skin-panel",
    "node.gs028g.merkel-cell.paired-skin-panel.1",
    "question.gs028g.merkel-cell.integrated-diagnosis.v1.r3",
    "concept.gs028g.merkel-cell.integrated-diagnosis"
  ],
  [
    "case.gs028g.merkel-cell.paired-skin-panel",
    "node.gs028g.merkel-cell.paired-skin-panel.2",
    "question.gs028g.merkel-cell.clinically-negative-node-staging.v1.r3",
    "concept.gs028g.merkel-cell.clinically-negative-node-staging"
  ],
  [
    "case.gs028g.merkel-cell.paired-outside-biopsy",
    "node.gs028g.merkel-cell.paired-outside-biopsy.1",
    "question.gs028g.merkel-cell.integrated-diagnosis.v2",
    "concept.gs028g.merkel-cell.integrated-diagnosis"
  ],
  [
    "case.gs028g.merkel-cell.paired-outside-biopsy",
    "node.gs028g.merkel-cell.paired-outside-biopsy.2",
    "question.gs028g.merkel-cell.clinically-negative-node-staging.v2",
    "concept.gs028g.merkel-cell.clinically-negative-node-staging"
  ],
  [
    "case.gs028g.merkel-cell.c1-red-nodule",
    "node.gs028g.merkel-cell.c1-red-nodule.1",
    "question.gs028g.merkel-cell.integrated-diagnosis.v3",
    "concept.gs028g.merkel-cell.integrated-diagnosis"
  ],
  [
    "case.gs028g.merkel-cell.c1-not-single-stain",
    "node.gs028g.merkel-cell.c1-not-single-stain.1",
    "question.gs028g.merkel-cell.integrated-diagnosis.v4",
    "concept.gs028g.merkel-cell.integrated-diagnosis"
  ],
  [
    "case.gs028g.merkel-cell.c2-normal-exam-boundary",
    "node.gs028g.merkel-cell.c2-normal-exam-boundary.1",
    "question.gs028g.merkel-cell.clinically-negative-node-staging.v3",
    "concept.gs028g.merkel-cell.clinically-negative-node-staging"
  ],
  [
    "case.gs028g.merkel-cell.c2-mapping-counselling",
    "node.gs028g.merkel-cell.c2-mapping-counselling.1",
    "question.gs028g.merkel-cell.clinically-negative-node-staging.v4",
    "concept.gs028g.merkel-cell.clinically-negative-node-staging"
  ],
  [
    "case.gs028g.incisional-hernia.paired-behind-rectus",
    "node.gs028g.incisional-hernia.paired-behind-rectus.1",
    "question.gs028g.incisional-hernia.retrorectus-plane.v1",
    "concept.gs028g.incisional-hernia.retrorectus-plane"
  ],
  [
    "case.gs028g.incisional-hernia.paired-behind-rectus",
    "node.gs028g.incisional-hernia.paired-behind-rectus.2",
    "question.gs028g.incisional-hernia.fascial-closure.v1",
    "concept.gs028g.incisional-hernia.fascial-closure"
  ],
  [
    "case.gs028g.incisional-hernia.paired-posterior-sheath",
    "node.gs028g.incisional-hernia.paired-posterior-sheath.1",
    "question.gs028g.incisional-hernia.retrorectus-plane.v2",
    "concept.gs028g.incisional-hernia.retrorectus-plane"
  ],
  [
    "case.gs028g.incisional-hernia.paired-posterior-sheath",
    "node.gs028g.incisional-hernia.paired-posterior-sheath.2",
    "question.gs028g.incisional-hernia.fascial-closure.v2",
    "concept.gs028g.incisional-hernia.fascial-closure"
  ],
  [
    "case.gs028g.incisional-hernia.c1-compartment-review",
    "node.gs028g.incisional-hernia.c1-compartment-review.1",
    "question.gs028g.incisional-hernia.retrorectus-plane.v3",
    "concept.gs028g.incisional-hernia.retrorectus-plane"
  ],
  [
    "case.gs028g.incisional-hernia.c1-not-preperitoneal",
    "node.gs028g.incisional-hernia.c1-not-preperitoneal.1",
    "question.gs028g.incisional-hernia.retrorectus-plane.v4",
    "concept.gs028g.incisional-hernia.retrorectus-plane"
  ],
  [
    "case.gs028g.incisional-hernia.c2-function-discussion",
    "node.gs028g.incisional-hernia.c2-function-discussion.1",
    "question.gs028g.incisional-hernia.fascial-closure.v3",
    "concept.gs028g.incisional-hernia.fascial-closure"
  ],
  [
    "case.gs028g.incisional-hernia.c2-scope-limited",
    "node.gs028g.incisional-hernia.c2-scope-limited.1",
    "question.gs028g.incisional-hernia.fascial-closure.v4",
    "concept.gs028g.incisional-hernia.fascial-closure"
  ],
  [
    "case.gs028g.subtotal-cholecystectomy.paired-unsafe-triangle",
    "node.gs028g.subtotal-cholecystectomy.paired-unsafe-triangle.1",
    "question.gs028g.subtotal-cholecystectomy.safe-bailout.v1",
    "concept.gs028g.subtotal-cholecystectomy.safe-bailout"
  ],
  [
    "case.gs028g.subtotal-cholecystectomy.paired-unsafe-triangle",
    "node.gs028g.subtotal-cholecystectomy.paired-unsafe-triangle.2",
    "question.gs028g.subtotal-cholecystectomy.remnant-classification.v1",
    "concept.gs028g.subtotal-cholecystectomy.remnant-classification"
  ],
  [
    "case.gs028g.subtotal-cholecystectomy.paired-frozen-anatomy",
    "node.gs028g.subtotal-cholecystectomy.paired-frozen-anatomy.1",
    "question.gs028g.subtotal-cholecystectomy.safe-bailout.v2",
    "concept.gs028g.subtotal-cholecystectomy.safe-bailout"
  ],
  [
    "case.gs028g.subtotal-cholecystectomy.paired-frozen-anatomy",
    "node.gs028g.subtotal-cholecystectomy.paired-frozen-anatomy.2",
    "question.gs028g.subtotal-cholecystectomy.remnant-classification.v2",
    "concept.gs028g.subtotal-cholecystectomy.remnant-classification"
  ],
  [
    "case.gs028g.subtotal-cholecystectomy.c1-not-completeness",
    "node.gs028g.subtotal-cholecystectomy.c1-not-completeness.1",
    "question.gs028g.subtotal-cholecystectomy.safe-bailout.v3",
    "concept.gs028g.subtotal-cholecystectomy.safe-bailout"
  ],
  [
    "case.gs028g.subtotal-cholecystectomy.c1-bailout-option",
    "node.gs028g.subtotal-cholecystectomy.c1-bailout-option.1",
    "question.gs028g.subtotal-cholecystectomy.safe-bailout.v4",
    "concept.gs028g.subtotal-cholecystectomy.safe-bailout"
  ],
  [
    "case.gs028g.subtotal-cholecystectomy.c2-duct-closed-remnant-open",
    "node.gs028g.subtotal-cholecystectomy.c2-duct-closed-remnant-open.1",
    "question.gs028g.subtotal-cholecystectomy.remnant-classification.v3",
    "concept.gs028g.subtotal-cholecystectomy.remnant-classification"
  ],
  [
    "case.gs028g.subtotal-cholecystectomy.c2-posterior-wall-retained",
    "node.gs028g.subtotal-cholecystectomy.c2-posterior-wall-retained.1",
    "question.gs028g.subtotal-cholecystectomy.remnant-classification.v4",
    "concept.gs028g.subtotal-cholecystectomy.remnant-classification"
  ],
  [
    "case.gs028g.laparoscopy-respiratory.paired-gradual-rise",
    "node.gs028g.laparoscopy-respiratory.paired-gradual-rise.1",
    "question.gs028g.laparoscopy-respiratory.co2-absorption.v1",
    "concept.gs028g.laparoscopy-respiratory.co2-absorption"
  ],
  [
    "case.gs028g.laparoscopy-respiratory.paired-gradual-rise",
    "node.gs028g.laparoscopy-respiratory.paired-gradual-rise.2",
    "question.gs028g.laparoscopy-respiratory.diaphragm-compliance.v1",
    "concept.gs028g.laparoscopy-respiratory.diaphragm-compliance"
  ],
  [
    "case.gs028g.laparoscopy-respiratory.paired-ventilation-load",
    "node.gs028g.laparoscopy-respiratory.paired-ventilation-load.1",
    "question.gs028g.laparoscopy-respiratory.co2-absorption.v2.r3",
    "concept.gs028g.laparoscopy-respiratory.co2-absorption"
  ],
  [
    "case.gs028g.laparoscopy-respiratory.paired-ventilation-load",
    "node.gs028g.laparoscopy-respiratory.paired-ventilation-load.2",
    "question.gs028g.laparoscopy-respiratory.diaphragm-compliance.v2.r3",
    "concept.gs028g.laparoscopy-respiratory.diaphragm-compliance"
  ],
  [
    "case.gs028g.laparoscopy-respiratory.c1-not-circuit-proof",
    "node.gs028g.laparoscopy-respiratory.c1-not-circuit-proof.1",
    "question.gs028g.laparoscopy-respiratory.co2-absorption.v3",
    "concept.gs028g.laparoscopy-respiratory.co2-absorption"
  ],
  [
    "case.gs028g.laparoscopy-respiratory.c1-completed-course",
    "node.gs028g.laparoscopy-respiratory.c1-completed-course.1",
    "question.gs028g.laparoscopy-respiratory.co2-absorption.v4",
    "concept.gs028g.laparoscopy-respiratory.co2-absorption"
  ],
  [
    "case.gs028g.laparoscopy-respiratory.c2-reduced-compliance",
    "node.gs028g.laparoscopy-respiratory.c2-reduced-compliance.1",
    "question.gs028g.laparoscopy-respiratory.diaphragm-compliance.v3",
    "concept.gs028g.laparoscopy-respiratory.diaphragm-compliance"
  ],
  [
    "case.gs028g.laparoscopy-respiratory.c2-mechanics-not-gas-only",
    "node.gs028g.laparoscopy-respiratory.c2-mechanics-not-gas-only.1",
    "question.gs028g.laparoscopy-respiratory.diaphragm-compliance.v4",
    "concept.gs028g.laparoscopy-respiratory.diaphragm-compliance"
  ],
  [
    "case.gs028g.postoperative-scapula.c1-node-biopsy",
    "node.gs028g.postoperative-scapula.c1-node-biopsy.1",
    "question.gs028g.postoperative-scapula.spinal-accessory.v1",
    "concept.gs028g.postoperative-scapula.spinal-accessory"
  ],
  [
    "case.gs028g.postoperative-scapula.c1-neck-dissection",
    "node.gs028g.postoperative-scapula.c1-neck-dissection.1",
    "question.gs028g.postoperative-scapula.spinal-accessory.v2",
    "concept.gs028g.postoperative-scapula.spinal-accessory"
  ],
  [
    "case.gs028g.postoperative-scapula.c1-trapezius-exam",
    "node.gs028g.postoperative-scapula.c1-trapezius-exam.1",
    "question.gs028g.postoperative-scapula.spinal-accessory.v3",
    "concept.gs028g.postoperative-scapula.spinal-accessory"
  ],
  [
    "case.gs028g.postoperative-scapula.c1-scar-location",
    "node.gs028g.postoperative-scapula.c1-scar-location.1",
    "question.gs028g.postoperative-scapula.spinal-accessory.v4",
    "concept.gs028g.postoperative-scapula.spinal-accessory"
  ],
  [
    "case.gs028g.postoperative-scapula.c2-wall-push",
    "node.gs028g.postoperative-scapula.c2-wall-push.1",
    "question.gs028g.postoperative-scapula.long-thoracic.v1",
    "concept.gs028g.postoperative-scapula.long-thoracic"
  ],
  [
    "case.gs028g.postoperative-scapula.c2-forward-push",
    "node.gs028g.postoperative-scapula.c2-forward-push.1",
    "question.gs028g.postoperative-scapula.long-thoracic.v2",
    "concept.gs028g.postoperative-scapula.long-thoracic"
  ],
  [
    "case.gs028g.postoperative-scapula.c2-medial-border",
    "node.gs028g.postoperative-scapula.c2-medial-border.1",
    "question.gs028g.postoperative-scapula.long-thoracic.v3",
    "concept.gs028g.postoperative-scapula.long-thoracic"
  ],
  [
    "case.gs028g.postoperative-scapula.c2-serratus-localization",
    "node.gs028g.postoperative-scapula.c2-serratus-localization.1",
    "question.gs028g.postoperative-scapula.long-thoracic.v4",
    "concept.gs028g.postoperative-scapula.long-thoracic"
  ],
  [
    "case.pediatric-clinic.groin-bulge-after-play",
    "node.pediatric-clinic.groin-bulge-after-play.1",
    "question.pediatric-clinic.groin-bulge-after-play.v1",
    "concept.pediatric-clinic.inguinal-hernia-referral"
  ],
  [
    "case.pediatric-clinic.intermittent-groin-swelling",
    "node.pediatric-clinic.intermittent-groin-swelling.1",
    "question.pediatric-clinic.intermittent-groin-swelling.v2",
    "concept.pediatric-clinic.inguinal-hernia-referral"
  ],
  [
    "case.pediatric-clinic.upper-midline-lump",
    "node.pediatric-clinic.upper-midline-lump.1",
    "question.pediatric-clinic.upper-midline-lump.v1.r4",
    "concept.umbilical-epigastric-hernia.clinical-recognition"
  ],
  [
    "case.pediatric-clinic.epigastric-standing-bulge",
    "node.pediatric-clinic.epigastric-standing-bulge.1",
    "question.pediatric-clinic.epigastric-standing-bulge.v2",
    "concept.umbilical-epigastric-hernia.clinical-recognition"
  ],
  [
    "case.pediatric-clinic.neck-nodes-after-cold",
    "node.pediatric-clinic.neck-nodes-after-cold.1",
    "question.pediatric-clinic.neck-nodes-after-cold.v1",
    "concept.pediatric-clinic.reactive-neck-node-observation"
  ],
  [
    "case.pediatric-clinic.shrinking-mobile-neck-nodes",
    "node.pediatric-clinic.shrinking-mobile-neck-nodes.1",
    "question.pediatric-clinic.shrinking-mobile-neck-nodes.v2.r3",
    "concept.pediatric-clinic.reactive-neck-node-observation"
  ],
  [
    "case.pediatric-clinic.supraclavicular-neck-lump",
    "node.pediatric-clinic.supraclavicular-neck-lump.1",
    "question.pediatric-clinic.supraclavicular-neck-lump.v1",
    "concept.pediatric-clinic.concerning-neck-node-referral"
  ],
  [
    "case.pediatric-clinic.growing-firm-neck-node",
    "node.pediatric-clinic.growing-firm-neck-node.1",
    "question.pediatric-clinic.growing-firm-neck-node.v2",
    "concept.pediatric-clinic.concerning-neck-node-referral"
  ],
  [
    "case.pediatric-clinic.previously-scrotal-testis",
    "node.pediatric-clinic.previously-scrotal-testis.1",
    "question.pediatric-clinic.previously-scrotal-testis.v1",
    "concept.pediatric-clinic.acquired-testis-ascent-referral"
  ],
  [
    "case.pediatric-clinic.testis-no-longer-stays-down",
    "node.pediatric-clinic.testis-no-longer-stays-down.1",
    "question.pediatric-clinic.testis-no-longer-stays-down.v2",
    "concept.pediatric-clinic.acquired-testis-ascent-referral"
  ],
  [
    "case.pediatric-clinic.retractile-testis-remains-scrotal",
    "node.pediatric-clinic.retractile-testis-remains-scrotal.1",
    "question.pediatric-clinic.retractile-testis-remains-scrotal.v1",
    "concept.pediatric-clinic.true-retractile-testis-surveillance"
  ],
  [
    "case.pediatric-clinic.intermittent-retraction-followup",
    "node.pediatric-clinic.intermittent-retraction-followup.1",
    "question.pediatric-clinic.intermittent-retraction-followup.v2",
    "concept.pediatric-clinic.true-retractile-testis-surveillance"
  ],
  [
    "case.pediatric-clinic.sunken-chest-exercise-limits",
    "node.pediatric-clinic.sunken-chest-exercise-limits.1",
    "question.pediatric-clinic.sunken-chest-exercise-limits.v1",
    "concept.pediatric-clinic.symptomatic-pectus-excavatum-evaluation"
  ],
  [
    "case.pediatric-clinic.pectus-new-sports-fatigue",
    "node.pediatric-clinic.pectus-new-sports-fatigue.1",
    "question.pediatric-clinic.pectus-new-sports-fatigue.v2",
    "concept.pediatric-clinic.symptomatic-pectus-excavatum-evaluation"
  ],
  [
    "case.pediatric-clinic.prominent-chest-brace-question",
    "node.pediatric-clinic.prominent-chest-brace-question.1",
    "question.pediatric-clinic.prominent-chest-brace-question.v1",
    "concept.pediatric-clinic.pectus-carinatum-brace-assessment"
  ],
  [
    "case.pediatric-clinic.carinatum-nonsurgical-options",
    "node.pediatric-clinic.carinatum-nonsurgical-options.1",
    "question.pediatric-clinic.carinatum-nonsurgical-options.v2",
    "concept.pediatric-clinic.pectus-carinatum-brace-assessment"
  ],
  [
    "case.pediatric-clinic.pilonidal-first-clinic-visit",
    "node.pediatric-clinic.pilonidal-first-clinic-visit.1",
    "question.pediatric-clinic.pilonidal-first-clinic-visit.v1",
    "concept.pediatric-clinic.limited-pilonidal-conservative-care"
  ],
  [
    "case.pediatric-clinic.pilonidal-mild-cleft-symptoms",
    "node.pediatric-clinic.pilonidal-mild-cleft-symptoms.1",
    "question.pediatric-clinic.pilonidal-mild-cleft-symptoms.v2",
    "concept.pediatric-clinic.limited-pilonidal-conservative-care"
  ],
  [
    "case.pediatric-clinic.child-asks-about-examination",
    "node.pediatric-clinic.child-asks-about-examination.1",
    "question.pediatric-clinic.child-asks-about-examination.v1",
    "concept.pediatric-clinic.developmental-assent-discussion"
  ],
  [
    "case.pediatric-clinic.child-wants-plan-explained",
    "node.pediatric-clinic.child-wants-plan-explained.1",
    "question.pediatric-clinic.child-wants-plan-explained.v2",
    "concept.pediatric-clinic.developmental-assent-discussion"
  ],
  [
    "case.variety3.diastasis-head-lift",
    "node.variety3.diastasis-head-lift.1",
    "question.variety3.diastasis-head-lift.v1",
    "concept.variety3.rectus-diastasis-recognition"
  ],
  [
    "case.variety3.diastasis-ridge-review",
    "node.variety3.diastasis-ridge-review.1",
    "question.variety3.diastasis-ridge-review.v2",
    "concept.variety3.rectus-diastasis-recognition"
  ],
  [
    "case.variety3.epidermoid-upper-back",
    "node.variety3.epidermoid-upper-back.1",
    "question.variety3.epidermoid-upper-back.v1",
    "concept.variety3.epidermoid-cyst-recognition"
  ],
  [
    "case.variety3.epidermoid-shoulder",
    "node.variety3.epidermoid-shoulder.1",
    "question.variety3.epidermoid-shoulder.v2",
    "concept.variety3.epidermoid-cyst-recognition"
  ],
  [
    "case.variety3.external-clot-sudden-lump",
    "node.variety3.external-clot-sudden-lump.1",
    "question.variety3.external-clot-sudden-lump.v1",
    "concept.variety3.thrombosed-external-hemorrhoid-recognition"
  ],
  [
    "case.variety3.external-clot-examination",
    "node.variety3.external-clot-examination.1",
    "question.variety3.external-clot-examination.v2",
    "concept.variety3.thrombosed-external-hemorrhoid-recognition"
  ],
  [
    "case.variety3.pruritus-repeated-scrubbing",
    "node.variety3.pruritus-repeated-scrubbing.1",
    "question.variety3.pruritus-repeated-scrubbing.v1",
    "concept.variety3.pruritus-ani-gentle-skin-care"
  ],
  [
    "case.variety3.pruritus-fragranced-wipes",
    "node.variety3.pruritus-fragranced-wipes.1",
    "question.variety3.pruritus-fragranced-wipes.v2",
    "concept.variety3.pruritus-ani-gentle-skin-care"
  ],
  [
    "case.variety3.prep-incomplete-drink",
    "node.variety3.prep-incomplete-drink.1",
    "question.variety3.prep-incomplete-drink.v1",
    "concept.variety3.inadequate-bowel-prep-repeat-colonoscopy"
  ],
  [
    "case.variety3.prep-poor-cleansing-report",
    "node.variety3.prep-poor-cleansing-report.1",
    "question.variety3.prep-poor-cleansing-report.v2",
    "concept.variety3.inadequate-bowel-prep-repeat-colonoscopy"
  ],
  [
    "case.variety3.snare-four-mm",
    "node.variety3.snare-four-mm.1",
    "question.variety3.snare-four-mm.v1",
    "concept.variety3.small-polyp-cold-snare-selection"
  ],
  [
    "case.variety3.snare-seven-mm",
    "node.variety3.snare-seven-mm.1",
    "question.variety3.snare-seven-mm.v2",
    "concept.variety3.small-polyp-cold-snare-selection"
  ],
  [
    "case.variety3.barrett-nondysplastic-followup",
    "node.variety3.barrett-nondysplastic-followup.1",
    "question.variety3.barrett-nondysplastic-followup.v1",
    "concept.variety3.nondysplastic-barrett-surveillance"
  ],
  [
    "case.variety3.barrett-patient-asks-ablation",
    "node.variety3.barrett-patient-asks-ablation.1",
    "question.variety3.barrett-patient-asks-ablation.v2",
    "concept.variety3.nondysplastic-barrett-surveillance"
  ],
  [
    "case.variety3.sedation-discharge-ride",
    "node.variety3.sedation-discharge-ride.1",
    "question.variety3.sedation-discharge-ride.v1.r5",
    "concept.variety3.endoscopic-sedation-escort-planning"
  ],
  [
    "case.variety3.sedation-unaccompanied-taxi",
    "node.variety3.sedation-unaccompanied-taxi.1",
    "question.variety3.sedation-unaccompanied-taxi.v2",
    "concept.variety3.endoscopic-sedation-escort-planning"
  ],
  [
    "case.variety3.allergy-childhood-label",
    "node.variety3.allergy-childhood-label.1",
    "question.variety3.allergy-childhood-label.v1",
    "concept.variety3.penicillin-label-structured-history"
  ],
  [
    "case.variety3.allergy-vague-reaction",
    "node.variety3.allergy-vague-reaction.1",
    "question.variety3.allergy-vague-reaction.v2",
    "concept.variety3.penicillin-label-structured-history"
  ],
  [
    "case.variety3.hair-no-interference",
    "node.variety3.hair-no-interference.1",
    "question.variety3.hair-no-interference.v1",
    "concept.variety3.surgical-hair-preparation"
  ],
  [
    "case.variety3.hair-clippers-needed",
    "node.variety3.hair-clippers-needed.1",
    "question.variety3.hair-clippers-needed.v2",
    "concept.variety3.surgical-hair-preparation"
  ]
] as const,
  accepted: [
  // BEGIN N3 FROZEN REVIEW2 ACCEPTANCES 20261105
  {"acceptanceId":"review.n3.bilateral-carotid-symptom-attribution.v2","caseId":"case.n3.bilateral-carotid-symptom-attribution.v1","nodeId":"node.n3.bilateral-carotid-symptom-attribution.v1","questionVariantId":"question.n3.bilateral-carotid-symptom-attribution.v2","conceptId":"concept.n3.bilateral-carotid-symptom-attribution","sourceView":"n3-round3","decision":"docs/research/question-new-n3-manager-decision-20261105.md"},
  {"acceptanceId":"review.n3.postsplenectomy-nodule-function-before-targeting.v2","caseId":"case.n3.postsplenectomy-nodule-function-before-targeting.v1","nodeId":"node.n3.postsplenectomy-nodule-function-before-targeting.v1","questionVariantId":"question.n3.postsplenectomy-nodule-function-before-targeting.v2","conceptId":"concept.n3.postsplenectomy-nodule-function-before-targeting","sourceView":"n3-round3","decision":"docs/research/question-new-n3-manager-decision-20261105.md"},
  {"acceptanceId":"review.n3.dysphagia-biopsy-territory-after-negative-endoscopy.v2","caseId":"case.n3.dysphagia-biopsy-territory-after-negative-endoscopy.v1","nodeId":"node.n3.dysphagia-biopsy-territory-after-negative-endoscopy.v1","questionVariantId":"question.n3.dysphagia-biopsy-territory-after-negative-endoscopy.v2","conceptId":"concept.n3.dysphagia-biopsy-territory-after-negative-endoscopy","sourceView":"n3-round3","decision":"docs/research/question-new-n3-manager-decision-20261105.md"},
  {"acceptanceId":"review.n3.tumor-screen-versus-family-test-sequence.v2","caseId":"case.n3.tumor-screen-versus-family-test-sequence.v1","nodeId":"node.n3.tumor-screen-versus-family-test-sequence.v1","questionVariantId":"question.n3.tumor-screen-versus-family-test-sequence.v2","conceptId":"concept.n3.tumor-screen-versus-family-test-sequence.v2","sourceView":"n3-round3","decision":"docs/research/question-new-n3-manager-decision-20261105.md"},
  {"acceptanceId":"review.n3.gastric-lymphoma-new-large-cell-process.v2","caseId":"case.n3.gastric-lymphoma-new-large-cell-process.v1","nodeId":"node.n3.gastric-lymphoma-new-large-cell-process.v1","questionVariantId":"question.n3.gastric-lymphoma-new-large-cell-process.v2","conceptId":"concept.n3.gastric-lymphoma-new-large-cell-process.v2","sourceView":"n3-round3","decision":"docs/research/question-new-n3-manager-decision-20261105.md"},
  // END N3 FROZEN REVIEW2 ACCEPTANCES 20261105
  // BEGIN FLAGS2 ROUND3 ACCEPTED ROWS 20261105
  {"acceptanceId":"G03","caseId":"case.gs028c.palpable-breast.paired-dense-focal","nodeId":"node.gs028c.palpable-breast.paired-dense-focal.1","questionVariantId":"question.palpable-breast.negative-mammogram-targeted-us.v1.r4","conceptId":"concept.palpable-breast.completed-imaging-clinical-target.v1","sourceView":"flags2-round3","decision":"docs/research/question-flags2-round3-manager-decision-20261105.md"},
  {"acceptanceId":"G05","caseId":"case.asymptomatic-phpt.incidental-calcium","nodeId":"node.asymptomatic-phpt.incidental-calcium.2","questionVariantId":"question.asymptomatic-phpt.age-based-surgery.v1.r3","conceptId":"concept.phpt.inherited-calcium-before-localization.v2","sourceView":"flags2-round3","decision":"docs/research/question-flags2-round3-manager-decision-20261105.md"},
  // END FLAGS2 ROUND3 ACCEPTED ROWS 20261105
  // BEGIN FLAGS2 G06 ACCEPTANCE 20261105
  // END FLAGS2 G06 ACCEPTANCE 20261105
  // BEGIN BATCH2B REVIEW2 ACCEPTANCES 20261105
  {
    "acceptanceId": "B2B01",
    "caseId": "case.gs028e.mis-principles.c3-phrenic-pathway",
    "nodeId": "node.gs028e.mis-principles.c3-phrenic-pathway.1",
    "questionVariantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r6",
    "conceptId": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v2",
    "sourceView": "batch2b-round2",
    "decision": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "B2B02",
    "caseId": "case.gs028e.immunology.c3-historical-kidney-event",
    "nodeId": "node.gs028e.immunology.c3-historical-kidney-event.1",
    "questionVariantId": "question.immunology.preformed-antibody-hyperacute-rejection.v1.r6",
    "conceptId": "concept.transplant.class-ii-crossmatch-target-and-window.v1",
    "sourceView": "batch2b-round2",
    "decision": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "B2B06",
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-completed-negative",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-completed-negative.1",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r5",
    "conceptId": "concept.dtc.representative-node-target-and-assay.v1",
    "sourceView": "batch2b-round2",
    "decision": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "B2B08",
    "caseId": "case.gs028b.post-neoadjuvant-breast.b-diffuse-residual",
    "nodeId": "node.gs028b.post-neoadjuvant-breast.b-diffuse-residual.1",
    "questionVariantId": "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2.r2",
    "conceptId": "concept.breast.inflammatory-phenotype-after-neoadjuvant-response.v1",
    "sourceView": "batch2b-round2",
    "decision": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "B2B09",
    "caseId": "case.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock",
    "nodeId": "node.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.1",
    "questionVariantId": "question.acute-mesenteric-ischemia.peritonitis-exploration.v3.r2",
    "conceptId": "concept.mesenteric-ischaemia.post-revascularization-bowel-staging.v1",
    "sourceView": "batch2b-round2",
    "decision": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "B2B10",
    "caseId": "case.gs028b.post-neoadjuvant-breast.a-residual-palpable",
    "nodeId": "node.gs028b.post-neoadjuvant-breast.a-residual-palpable.1",
    "questionVariantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v2.r1",
    "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping",
    "sourceView": "batch2b-round2",
    "decision": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "B2B17",
    "caseId": "case.gs028d.dialysis-access.b-arm-swelling",
    "nodeId": "node.gs028d.dialysis-access.b-arm-swelling.1",
    "questionVariantId": "question.dialysis-access.clinical-dysfunction-referral.v4.r2",
    "conceptId": "concept.dialysis-access.symptomatic-central-outflow-assessment.v1",
    "sourceView": "batch2b-round2",
    "decision": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "B2B21",
    "caseId": "case.gs028d.geriatrics.b-mobility-nutrition",
    "nodeId": "node.gs028d.geriatrics.b-mobility-nutrition.1",
    "questionVariantId": "question.postoperative-delirium.multicomponent-prevention-plan.v4.r2",
    "conceptId": "concept.postoperative-delirium.benzodiazepine-withdrawal-exception.v1",
    "sourceView": "batch2b-round2",
    "decision": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "B2B23",
    "caseId": "case.gs028c.mild-biliary-pancreatitis.b-discharge-rounds",
    "nodeId": "node.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.1",
    "questionVariantId": "question.acute-pancreatitis.mild-biliary-chole-before-discharge.v3.r2",
    "conceptId": "concept.biliary-pancreatitis.local-complication-before-cholecystectomy.v1",
    "sourceView": "batch2b-round2",
    "decision": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "B2B24",
    "caseId": "case.gs028b.post-neoadjuvant-breast.paired-marker-residual",
    "nodeId": "node.gs028b.post-neoadjuvant-breast.paired-marker-residual.1",
    "questionVariantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r2",
    "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping",
    "sourceView": "batch2b-round2",
    "decision": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "B2B25",
    "caseId": "case.gs028c.acute-cholecystitis.b-hida-confirmed",
    "nodeId": "node.gs028c.acute-cholecystitis.b-hida-confirmed.1",
    "questionVariantId": "question.cholecystitis.fit-patient-index-admission-cholecystectomy.v2.r2",
    "conceptId": "concept.cholecystectomy.subtotal-type-from-remnant-tissue.v1",
    "sourceView": "batch2b-round2",
    "decision": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "B2B30",
    "caseId": "case.gs028d.hyperkalaemia.a-dehydration-result",
    "nodeId": "node.gs028d.hyperkalaemia.a-dehydration-result.1",
    "questionVariantId": "question.hyperkalaemia.severe-community-result-transfer.v4.r2",
    "conceptId": "concept.diabetic-ketoacidosis.ongoing-insulin-substrate.v1",
    "sourceView": "batch2b-round2",
    "decision": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "B2B33",
    "caseId": "case.gs028d.acid-base.b-malnutrition-gap",
    "nodeId": "node.gs028d.acid-base.b-malnutrition-gap.1",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v2.r2",
    "conceptId": "concept.acid-base.euglycaemic-risk-with-mixed-gas.v1",
    "sourceView": "batch2b-round2",
    "decision": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "B2B39",
    "caseId": "case.bread-butter.perianal-abscess.perianal-swelling",
    "nodeId": "node.bread-butter.perianal-abscess.perianal-swelling.1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v2.r2",
    "conceptId": "concept.anorectal-fistula.tract-and-transplant-host-plan.v1",
    "sourceView": "batch2b-round2",
    "decision": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "B2B40",
    "caseId": "case.bread-butter.perianal-abscess.painful-sitting",
    "nodeId": "node.bread-butter.perianal-abscess.painful-sitting.1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v3.r2",
    "conceptId": "concept.anorectal-fistula.function-before-low-tract-division.v1",
    "sourceView": "batch2b-round2",
    "decision": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "B2B42",
    "caseId": "case.gs028b.preoperative-nutrition.b-oral-inadequate",
    "nodeId": "node.gs028b.preoperative-nutrition.b-oral-inadequate.1",
    "questionVariantId": "question.preoperative-nutrition.oral-enteral-first-line.v2.r2",
    "conceptId": "concept.nutrition.gastric-versus-postpyloric-delivery.v1",
    "sourceView": "batch2b-round2",
    "decision": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
  },
  // END BATCH2B REVIEW2 ACCEPTANCES 20261105
  {
    "acceptanceId": "F01",
    "caseId": "case.gs028c.dcis.a-one-mm-individualize",
    "nodeId": "node.gs028c.dcis.a-one-mm-individualize.1",
    "questionVariantId": "question.dcis.margin-bcs-wbrt.v3.r3",
    "conceptId": "concept.dcis.final-cavity-shave-plan.v1",
    "sourceView": "flags-round3",
    "decision": "docs/research/question-flags-manager-decision-20261104.md"
  },
  {
    "acceptanceId": "F09",
    "caseId": "case.gs028e.mis-principles.c2-different-phases",
    "nodeId": "node.gs028e.mis-principles.c2-different-phases.1",
    "questionVariantId": "question.pneumoperitoneum.context-dependent-venous-return.v4.r4",
    "conceptId": "concept.laparoscopy.pressure-cardiopulmonary.v1",
    "sourceView": "flags-round3",
    "decision": "docs/research/question-flags-manager-decision-20261104.md"
  },
  {
    "acceptanceId": "F12",
    "caseId": "case.gs028c.acute-cholecystitis.a-persistent-suspicion",
    "nodeId": "node.gs028c.acute-cholecystitis.a-persistent-suspicion.1",
    "questionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v4.r3",
    "conceptId": "concept.gallstones.cholestatic-next-study.v1",
    "sourceView": "flags-round3",
    "decision": "docs/research/question-flags-manager-decision-20261104.md"
  },
  {
    "acceptanceId": "F03",
    "caseId": "case.gs028.varicose-veins.b-limited-mobility",
    "nodeId": "node.gs028.varicose-veins.b-limited-mobility.1",
    "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v4.r4",
    "conceptId": "concept.varicose-veins.reflux-after-compression-study.v2",
    "sourceView": "flags-round3",
    "decision": "docs/research/question-flags-manager-decision-20261104.md"
  },
  {
    "acceptanceId": "F05",
    "caseId": "case.gs028f.neck-mass.c2-completed-needle-record",
    "nodeId": "node.gs028f.neck-mass.c2-completed-needle-record.1",
    "questionVariantId": "question.gs028f.head-neck.initial-fna-not-open-biopsy.v4.r4",
    "conceptId": "concept.head-neck.cyst-fluid-sample-assessment.v1",
    "sourceView": "flags-round3",
    "decision": "docs/research/question-flags-manager-decision-20261104.md"
  },
  {
    "acceptanceId": "F10",
    "caseId": "case.gs028c.dcis.b-oncoplastic-mapping",
    "nodeId": "node.gs028c.dcis.b-oncoplastic-mapping.1",
    "questionVariantId": "question.dcis.sentinel-node-setting.v3.r4",
    "conceptId": "concept.dcis.sentinel-node-mastectomy.v1",
    "sourceView": "flags-round3",
    "decision": "docs/research/question-flags-manager-decision-20261104.md"
  },
  {
    "acceptanceId": "F11",
    "caseId": "case.gs028se.p2e.perioperative-dnr.v4.perianal-abscess",
    "nodeId": "node.gs028se.p2e.perioperative-dnr.v4.perianal-abscess.1",
    "questionVariantId": "question.statistics-ethics.perioperative-dnr.v4.r4",
    "conceptId": "concept.perioperative-dnr.recovery-endpoint.v1",
    "sourceView": "flags-round3",
    "decision": "docs/research/question-flags-manager-decision-20261104.md"
  },
  {
    "acceptanceId": "F15",
    "caseId": "case.gs028e.mis-principles.c2-early-central-filling",
    "nodeId": "node.gs028e.mis-principles.c2-early-central-filling.1",
    "questionVariantId": "question.pneumoperitoneum.context-dependent-venous-return.v2.r4",
    "conceptId": "concept.laparoscopy.position-gas-integration.v2",
    "sourceView": "flags-round3",
    "decision": "docs/research/question-flags-manager-decision-20261104.md"
  },
  {
    "acceptanceId": "F17",
    "caseId": "case.gs028c.palpable-breast.b-surgeon-discordance",
    "nodeId": "node.gs028c.palpable-breast.b-surgeon-discordance.1",
    "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4.r4",
    "conceptId": "concept.palpable-mass.separate-benign-target.v1",
    "sourceView": "flags-round3",
    "decision": "docs/research/question-flags-manager-decision-20261104.md"
  },
  {
    "acceptanceId": "B2A01",
    "caseId": "case.achalasia.water-and-solids",
    "nodeId": "node.achalasia.water-and-solids.2",
    "questionVariantId": "question.achalasia.manometric-recognition.v1.r5",
    "conceptId": "concept.achalasia.manometric-recognition",
    "sourceView": "batch2a-round3",
    "decision": "docs/research/question-bank-batch2a-manager-decision-20261104.md"
  },
  {
    "acceptanceId": "B2A04",
    "caseId": "case.achalasia.slow-meals",
    "nodeId": "node.achalasia.slow-meals.1",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v3.r11",
    "conceptId": "concept.esophageal-physiology.integrated-pressure-report.v2",
    "sourceView": "batch2a-round3",
    "decision": "docs/research/question-bank-batch2a-manager-decision-20261104.md"
  },
  {
    "acceptanceId": "B2A05",
    "caseId": "case.inguinal-hernia.standing-shift",
    "nodeId": "node.inguinal-hernia.standing-shift.2",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r11",
    "conceptId": "concept.inguinal-hernia.recurrence-after-anterior-repair.v1",
    "sourceView": "batch2a-round3",
    "decision": "docs/research/question-bank-batch2a-manager-decision-20261104.md"
  },
  {
    "acceptanceId": "B2A06",
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.1",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r9",
    "conceptId": "concept.groin-ultrasound.proximal-neck-localization.v2",
    "sourceView": "batch2a-round3",
    "decision": "docs/research/question-bank-batch2a-manager-decision-20261104.md"
  },
  {
    "acceptanceId": "B2A07",
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.2",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r11",
    "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
    "sourceView": "batch2a-round3",
    "decision": "docs/research/question-bank-batch2a-manager-decision-20261104.md"
  },
  {
    "acceptanceId": "B2A09",
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.1",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r10",
    "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v5",
    "sourceView": "batch2a-round3",
    "decision": "docs/research/question-bank-batch2a-manager-decision-20261104.md"
  },
  {
    "acceptanceId": "B2A10",
    "caseId": "case.gs028se.pdsa-act-qi-measures.a-abandon-harm",
    "nodeId": "node.gs028se.pdsa-act-qi-measures.a-abandon-harm.1",
    "questionVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r11",
    "conceptId": "concept.quality-improvement.source-by-method-next-pilot.v1",
    "sourceView": "batch2a-round3",
    "decision": "docs/research/question-bank-batch2a-manager-decision-20261104.md"
  },
  {
    "acceptanceId": "B2A11",
    "caseId": "case.adrenal-incidentaloma.small-adrenal-adenoma",
    "nodeId": "node.adrenal-incidentaloma.small-adrenal-adenoma.1",
    "questionVariantId": "question.adrenal-incidentaloma.one-mg-dst.v4.r4",
    "conceptId": "concept.adrenal-incidentaloma.acth-directed-source-imaging.v2",
    "sourceView": "batch2a-round3",
    "decision": "docs/research/question-bank-batch2a-manager-decision-20261104.md"
  },
  {
    "acceptanceId": "review.n1.controlled-enterotomy-mesh.v2",
    "caseId": "case.n1.controlled-enterotomy-mesh.v1",
    "nodeId": "node.n1.controlled-enterotomy-mesh.v1",
    "questionVariantId": "question.n1.controlled-enterotomy-mesh.v2",
    "conceptId": "concept.ventral-hernia.controlled-enterotomy-macroporous-synthetic-mesh-selection",
    "sourceView": "n1-round3",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n1.celiac-iga-deficiency.v2",
    "caseId": "case.n1.celiac-iga-deficiency.v1",
    "nodeId": "node.n1.celiac-iga-deficiency.v1",
    "questionVariantId": "question.n1.celiac-iga-deficiency.v2",
    "conceptId": "concept.n1.celiac-iga-deficient-serology",
    "sourceView": "n1-round3",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n1.hcc-portal-hypertension.v2",
    "caseId": "case.n1.hcc-portal-hypertension.v1",
    "nodeId": "node.n1.hcc-portal-hypertension.v1",
    "questionVariantId": "question.n1.hcc-portal-hypertension.v2",
    "conceptId": "concept.n1.hcc-portal-hypertension-referral",
    "sourceView": "n1-round3",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n1.gastroparesis-obstruction.v3",
    "caseId": "case.n1.gastroparesis-obstruction.v1",
    "nodeId": "node.n1.gastroparesis-obstruction.v1",
    "questionVariantId": "question.n1.gastroparesis-obstruction.v3",
    "conceptId": "concept.n1.gastric-emptying-structural-prerequisite",
    "sourceView": "n1-round3",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n1.breast-mass-morphology.v2",
    "caseId": "case.n1.breast-mass-morphology.v1",
    "nodeId": "node.n1.breast-mass-morphology.v1",
    "questionVariantId": "question.n1.breast-mass-morphology.v2",
    "conceptId": "concept.breast-imaging.suspicious-mass-morphology",
    "sourceView": "n1-round3",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n1.breast-calcification.v3",
    "caseId": "case.n1.breast-calcification.v1",
    "nodeId": "node.n1.breast-calcification.v1",
    "questionVariantId": "question.n1.breast-calcification.v3",
    "conceptId": "concept.n1r2.calcification-specimen-target-reconciliation",
    "sourceView": "n1-round3",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n1.breast-thirties-imaging.v3",
    "caseId": "case.n1.breast-thirties-imaging.v1",
    "nodeId": "node.n1.breast-thirties-imaging.v1",
    "questionVariantId": "question.n1.breast-thirties-imaging.v3",
    "conceptId": "concept.n1r3.palpable-negative-imaging-biopsy",
    "sourceView": "n1-round3",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n1.phyllodes-negative-axilla.v3",
    "caseId": "case.n1.phyllodes-negative-axilla.v1",
    "nodeId": "node.n1.phyllodes-negative-axilla.v1",
    "questionVariantId": "question.n1.phyllodes-negative-axilla.v3",
    "conceptId": "concept.phyllodes.no-routine-axillary-staging",
    "sourceView": "n1-round3",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n1.phyllodes-spread.v2",
    "caseId": "case.n1.phyllodes-spread.v1",
    "nodeId": "node.n1.phyllodes-spread.v1",
    "questionVariantId": "question.n1.phyllodes-spread.v2",
    "conceptId": "concept.n1r2.phyllodes-distant-target-evaluation",
    "sourceView": "n1-round3",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n1.mixing-study-followup.v2",
    "caseId": "case.n1.mixing-study-followup.v1",
    "nodeId": "node.n1.mixing-study-followup.v1",
    "questionVariantId": "question.n1.mixing-study-followup.v2",
    "conceptId": "concept.n1.time-dependent-inhibitor-factor-assessment",
    "sourceView": "n1-round3",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n1.lymphedema-new-swelling.v3",
    "caseId": "case.n1.lymphedema-new-swelling.v1",
    "nodeId": "node.n1.lymphedema-new-swelling.v1",
    "questionVariantId": "question.n1.lymphedema-new-swelling.v3",
    "conceptId": "concept.n1r3.leg-duplex-proximal-outflow",
    "sourceView": "n1-round3",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n1.vka-vitamin-k.v3",
    "caseId": "case.n1.vka-vitamin-k.v1",
    "nodeId": "node.n1.vka-vitamin-k.v1",
    "questionVariantId": "question.n1.vka-vitamin-k.v3",
    "conceptId": "concept.trauma-vka.concurrent-iv-vitamin-k",
    "sourceView": "n1-round3",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n2.sglt2-postoperative-restart.v2",
    "caseId": "case.n2.sglt2-postoperative-restart.v1",
    "nodeId": "node.n2.sglt2-postoperative-restart.v1",
    "questionVariantId": "question.n2.sglt2-postoperative-restart.v2",
    "conceptId": "concept.n2r2.sglt2-repeat-procedure-reconciliation",
    "sourceView": "catalog",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n2.burn-feeding-perfusion-prerequisite.v3",
    "caseId": "case.n2.burn-feeding-perfusion-prerequisite.v1",
    "nodeId": "node.n2.burn-feeding-perfusion-prerequisite.v1",
    "questionVariantId": "question.n2.burn-feeding-perfusion-prerequisite.v3",
    "conceptId": "concept.n2.burn-feeding-perfusion-prerequisite",
    "sourceView": "catalog",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n2.dialysis-isocaloric-protein-adjustment.v3",
    "caseId": "case.n2.dialysis-isocaloric-protein-adjustment.v1",
    "nodeId": "node.n2.dialysis-isocaloric-protein-adjustment.v1",
    "questionVariantId": "question.n2.dialysis-isocaloric-protein-adjustment.v3",
    "conceptId": "concept.n2.dialysis-isocaloric-protein-adjustment",
    "sourceView": "catalog",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n2.af-bridging-versus-surgical-prophylaxis.v3",
    "caseId": "case.n2.af-bridging-versus-surgical-prophylaxis.v1",
    "nodeId": "node.n2.af-bridging-versus-surgical-prophylaxis.v1",
    "questionVariantId": "question.n2.af-bridging-versus-surgical-prophylaxis.v3",
    "conceptId": "concept.n2r3.heparin-order-indication-reconciliation",
    "sourceView": "catalog",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n2.bile-leak-duct-continuity-boundary.v2",
    "caseId": "case.n2.bile-leak-duct-continuity-boundary.v1",
    "nodeId": "node.n2.bile-leak-duct-continuity-boundary.v1",
    "questionVariantId": "question.n2.bile-leak-duct-continuity-boundary.v2",
    "conceptId": "concept.n2r2.bile-leak-nonrepresented-duct-mapping",
    "sourceView": "catalog",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n2.ercp-versus-gallbladder-source.v2",
    "caseId": "case.n2.ercp-versus-gallbladder-source.v1",
    "nodeId": "node.n2.ercp-versus-gallbladder-source.v1",
    "questionVariantId": "question.n2.ercp-versus-gallbladder-source.v2",
    "conceptId": "concept.n2.ercp-versus-gallbladder-source",
    "sourceView": "catalog",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n2.hpylori-antibody-after-valid-cure-test.v2",
    "caseId": "case.n2.hpylori-antibody-after-valid-cure-test.v1",
    "nodeId": "node.n2.hpylori-antibody-after-valid-cure-test.v1",
    "questionVariantId": "question.n2.hpylori-antibody-after-valid-cure-test.v2",
    "conceptId": "concept.n2r2.h-pylori-cure-test-medication-calendar",
    "sourceView": "catalog",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n2.malignant-polyp-local-versus-regional-risk.v2",
    "caseId": "case.n2.malignant-polyp-local-versus-regional-risk.v1",
    "nodeId": "node.n2.malignant-polyp-local-versus-regional-risk.v1",
    "questionVariantId": "question.n2.malignant-polyp-local-versus-regional-risk.v2",
    "conceptId": "concept.n2.malignant-polyp-local-versus-regional-risk",
    "sourceView": "catalog",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n2.operative-wound-class-versus-later-ssi.v3",
    "caseId": "case.n2.operative-wound-class-versus-later-ssi.v1",
    "nodeId": "node.n2.operative-wound-class-versus-later-ssi.v1",
    "questionVariantId": "question.n2.operative-wound-class-versus-later-ssi.v3",
    "conceptId": "concept.n2r3.operative-class-outcome-dependent-audit",
    "sourceView": "catalog",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n2.ventral-hernia-priority-change.v2",
    "caseId": "case.n2.ventral-hernia-priority-change.v1",
    "nodeId": "node.n2.ventral-hernia-priority-change.v1",
    "questionVariantId": "question.n2.ventral-hernia-priority-change.v2",
    "conceptId": "concept.n2r2.emergency-hernia-closure-and-bowel-reassessment",
    "sourceView": "catalog",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n2.negative-predictive-value-denominator.v2",
    "caseId": "case.n2.negative-predictive-value-denominator.v1",
    "nodeId": "node.n2.negative-predictive-value-denominator.v1",
    "questionVariantId": "question.n2.negative-predictive-value-denominator.v2",
    "conceptId": "concept.n2r2.negative-result-population-and-protocol",
    "sourceView": "catalog",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n2.positive-likelihood-ratio.v2",
    "caseId": "case.n2.positive-likelihood-ratio.v1",
    "nodeId": "node.n2.positive-likelihood-ratio.v1",
    "questionVariantId": "question.n2.positive-likelihood-ratio.v2",
    "conceptId": "concept.n2r2.positive-test-odds-and-investigation",
    "sourceView": "catalog",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n2.mcnemar-paired-binary-outcomes.v3",
    "caseId": "case.n2.mcnemar-paired-binary-outcomes.v1",
    "nodeId": "node.n2.mcnemar-paired-binary-outcomes.v1",
    "questionVariantId": "question.n2.mcnemar-paired-binary-outcomes.v3",
    "conceptId": "concept.n2r2.linked-binary-analysis-and-pilot-decision",
    "sourceView": "catalog",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  {
    "acceptanceId": "review.n2.equivalence-margin-versus-null-test.v2",
    "caseId": "case.n2.equivalence-margin-versus-null-test.v1",
    "nodeId": "node.n2.equivalence-margin-versus-null-test.v1",
    "questionVariantId": "question.n2.equivalence-margin-versus-null-test.v2",
    "conceptId": "concept.n2r2.equivalence-and-safety-implementation",
    "sourceView": "catalog",
    "decision": "docs/research/question-new-manager-decision-20261105.md"
  },
  // BEGIN FLAGS3 ACCEPTANCES 20261107
  {
    "acceptanceId": "F3-02",
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.2",
    "questionVariantId": "question.achalasia.manometric-recognition.v2.r7",
    "conceptId": "concept.achalasia.secondary-junction-lesion-assessment.v1",
    "sourceView": "flags3-accepted",
    "decision": "docs/research/question-flags3-manager-decision-20261107.md"
  },
  {
    "acceptanceId": "F3-03-type",
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.flags3.groin-ultrasound-classification.20261107",
    "questionVariantId": "question.groin-hernia.ultrasound-type.v1",
    "conceptId": "concept.groin-hernia.ultrasound-compartment-classification.v1",
    "sourceView": "flags3-accepted",
    "decision": "docs/research/question-flags3-manager-decision-20261107.md"
  },
  {
    "acceptanceId": "F3-03",
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.inguinal-hernia.caregiving-strain.2",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r12",
    "conceptId": "concept.groin-hernia.femoral-defect-repair-priority.v1",
    "sourceView": "flags3-accepted",
    "decision": "docs/research/question-flags3-manager-decision-20261107.md"
  },
  // END FLAGS3 ACCEPTANCES 20261107
  // BEGIN STATS1 ACCEPTANCES 20261108
  {
    "acceptanceId": "S01",
    "caseId": "case.gs028se.independent-t-paired-t.a-two-teams",
    "nodeId": "node.gs028se.independent-t-paired-t.a-two-teams.1",
    "questionVariantId": "question.statistics-ethics.independent-t.v1.r2",
    "conceptId": "concept.statistics-ethics.independent-t",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S02",
    "caseId": "case.gs028se.independent-t-paired-t.a-two-cohorts",
    "nodeId": "node.gs028se.independent-t-paired-t.a-two-cohorts.1",
    "questionVariantId": "question.statistics-ethics.independent-t.v2.r2",
    "conceptId": "concept.statistics-ethics.independent-t",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S03",
    "caseId": "case.gs028se.independent-t-paired-t.a-two-shifts",
    "nodeId": "node.gs028se.independent-t-paired-t.a-two-shifts.1",
    "questionVariantId": "question.statistics-ethics.independent-t.v3.r2",
    "conceptId": "concept.statistics-ethics.independent-t",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S04",
    "caseId": "case.gs028se.independent-t-paired-t.a-two-scripts",
    "nodeId": "node.gs028se.independent-t-paired-t.a-two-scripts.1",
    "questionVariantId": "question.statistics-ethics.independent-t.v4.r2",
    "conceptId": "concept.statistics-ethics.independent-t",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S05",
    "caseId": "case.gs028se.independent-t-paired-t.b-same-rooms",
    "nodeId": "node.gs028se.independent-t-paired-t.b-same-rooms.1",
    "questionVariantId": "question.statistics-ethics.paired-t.v1.r1",
    "conceptId": "concept.statistics-ethics.paired-t",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S06",
    "caseId": "case.gs028se.independent-t-paired-t.b-same-trainees",
    "nodeId": "node.gs028se.independent-t-paired-t.b-same-trainees.1",
    "questionVariantId": "question.statistics-ethics.paired-t.v2.r1",
    "conceptId": "concept.statistics-ethics.paired-t",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S07",
    "caseId": "case.gs028se.independent-t-paired-t.b-matched-sites",
    "nodeId": "node.gs028se.independent-t-paired-t.b-matched-sites.1",
    "questionVariantId": "question.statistics-ethics.paired-t.v3.r1",
    "conceptId": "concept.statistics-ethics.paired-t",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S08",
    "caseId": "case.gs028se.independent-t-paired-t.b-same-workers",
    "nodeId": "node.gs028se.independent-t-paired-t.b-same-workers.1",
    "questionVariantId": "question.statistics-ethics.paired-t.v4.r1",
    "conceptId": "concept.statistics-ethics.paired-t",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S09",
    "caseId": "case.gs028se.one-way-anova-rank-sum.a-three-teams",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.a-three-teams.1",
    "questionVariantId": "question.statistics-ethics.one-way-anova.v1.r2",
    "conceptId": "concept.statistics-ethics.one-way-anova",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S10",
    "caseId": "case.gs028se.one-way-anova-rank-sum.a-four-formats",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.a-four-formats.1",
    "questionVariantId": "question.statistics-ethics.one-way-anova.v2.r2",
    "conceptId": "concept.statistics-ethics.one-way-anova",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S11",
    "caseId": "case.gs028se.one-way-anova-rank-sum.a-three-sites",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.a-three-sites.1",
    "questionVariantId": "question.statistics-ethics.one-way-anova.v3.r2",
    "conceptId": "concept.statistics-ethics.one-way-anova",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S12",
    "caseId": "case.gs028se.one-way-anova-rank-sum.a-five-signs",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.a-five-signs.1",
    "questionVariantId": "question.statistics-ethics.one-way-anova.v4.r2",
    "conceptId": "concept.statistics-ethics.one-way-anova",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S13",
    "caseId": "case.gs028se.one-way-anova-rank-sum.b-ordinal-teams",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.b-ordinal-teams.1",
    "questionVariantId": "question.statistics-ethics.rank-sum.v1.r1",
    "conceptId": "concept.statistics-ethics.rank-sum",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S14",
    "caseId": "case.gs028se.one-way-anova-rank-sum.b-skewed-delays",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.b-skewed-delays.1",
    "questionVariantId": "question.statistics-ethics.rank-sum.v2.r1",
    "conceptId": "concept.statistics-ethics.rank-sum",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S15",
    "caseId": "case.gs028se.one-way-anova-rank-sum.b-independent-likert",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.b-independent-likert.1",
    "questionVariantId": "question.statistics-ethics.rank-sum.v3.r1",
    "conceptId": "concept.statistics-ethics.rank-sum",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S16",
    "caseId": "case.gs028se.one-way-anova-rank-sum.b-two-queues",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.b-two-queues.1",
    "questionVariantId": "question.statistics-ethics.rank-sum.v4.r1",
    "conceptId": "concept.statistics-ethics.rank-sum",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S17",
    "caseId": "case.gs028se.signed-rank-chi-square.a-paired-workload",
    "nodeId": "node.gs028se.signed-rank-chi-square.a-paired-workload.1",
    "questionVariantId": "question.statistics-ethics.signed-rank.v1.r1",
    "conceptId": "concept.statistics-ethics.signed-rank",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S18",
    "caseId": "case.gs028se.signed-rank-chi-square.a-same-rooms-skewed",
    "nodeId": "node.gs028se.signed-rank-chi-square.a-same-rooms-skewed.1",
    "questionVariantId": "question.statistics-ethics.signed-rank.v2.r1",
    "conceptId": "concept.statistics-ethics.signed-rank",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S19",
    "caseId": "case.gs028se.signed-rank-chi-square.a-matched-dyads",
    "nodeId": "node.gs028se.signed-rank-chi-square.a-matched-dyads.1",
    "questionVariantId": "question.statistics-ethics.signed-rank.v3.r1",
    "conceptId": "concept.statistics-ethics.signed-rank",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S20",
    "caseId": "case.gs028se.signed-rank-chi-square.a-pre-post-counts",
    "nodeId": "node.gs028se.signed-rank-chi-square.a-pre-post-counts.1",
    "questionVariantId": "question.statistics-ethics.signed-rank.v4.r1",
    "conceptId": "concept.statistics-ethics.signed-rank",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S21",
    "caseId": "case.gs028se.signed-rank-chi-square.b-role-by-choice",
    "nodeId": "node.gs028se.signed-rank-chi-square.b-role-by-choice.1",
    "questionVariantId": "question.statistics-ethics.chi-square.v1.r2",
    "conceptId": "concept.statistics-ethics.chi-square",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S22",
    "caseId": "case.gs028se.signed-rank-chi-square.b-shift-by-response",
    "nodeId": "node.gs028se.signed-rank-chi-square.b-shift-by-response.1",
    "questionVariantId": "question.statistics-ethics.chi-square.v2.r1",
    "conceptId": "concept.statistics-ethics.chi-square",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S23",
    "caseId": "case.gs028se.signed-rank-chi-square.b-badge-by-completion",
    "nodeId": "node.gs028se.signed-rank-chi-square.b-badge-by-completion.1",
    "questionVariantId": "question.statistics-ethics.chi-square.v3.r1",
    "conceptId": "concept.statistics-ethics.chi-square",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S24",
    "caseId": "case.gs028se.signed-rank-chi-square.b-site-by-category",
    "nodeId": "node.gs028se.signed-rank-chi-square.b-site-by-category.1",
    "questionVariantId": "question.statistics-ethics.chi-square.v4.r1",
    "conceptId": "concept.statistics-ethics.chi-square",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S25",
    "caseId": "case.gs028se.fisher-exact-study-design.a-rare-event",
    "nodeId": "node.gs028se.fisher-exact-study-design.a-rare-event.1",
    "questionVariantId": "question.statistics-ethics.fisher-exact.v1.r2",
    "conceptId": "concept.statistics-ethics.fisher-exact",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S26",
    "caseId": "case.gs028se.fisher-exact-study-design.a-tiny-pilot",
    "nodeId": "node.gs028se.fisher-exact-study-design.a-tiny-pilot.1",
    "questionVariantId": "question.statistics-ethics.fisher-exact.v2.r5",
    "conceptId": "concept.statistics-ethics.fisher-exact",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S27",
    "caseId": "case.gs028se.fisher-exact-study-design.a-sparse-exposure",
    "nodeId": "node.gs028se.fisher-exact-study-design.a-sparse-exposure.1",
    "questionVariantId": "question.statistics-ethics.fisher-exact.v3.r2",
    "conceptId": "concept.statistics-ethics.fisher-exact",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S28",
    "caseId": "case.gs028se.fisher-exact-study-design.a-small-response",
    "nodeId": "node.gs028se.fisher-exact-study-design.a-small-response.1",
    "questionVariantId": "question.statistics-ethics.fisher-exact.v4.r2",
    "conceptId": "concept.statistics-ethics.fisher-exact",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S29",
    "caseId": "case.gs028se.fisher-exact-study-design.b-cohort-followup",
    "nodeId": "node.gs028se.fisher-exact-study-design.b-cohort-followup.1",
    "questionVariantId": "question.statistics-ethics.study-design.v1.r1",
    "conceptId": "concept.statistics-ethics.study-design",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S30",
    "caseId": "case.gs028se.fisher-exact-study-design.b-random-scripts",
    "nodeId": "node.gs028se.fisher-exact-study-design.b-random-scripts.1",
    "questionVariantId": "question.statistics-ethics.study-design.v2.r2",
    "conceptId": "concept.statistics-ethics.study-design",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S31",
    "caseId": "case.gs028se.fisher-exact-study-design.b-case-control",
    "nodeId": "node.gs028se.fisher-exact-study-design.b-case-control.1",
    "questionVariantId": "question.statistics-ethics.study-design.v3.r1",
    "conceptId": "concept.statistics-ethics.study-design",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S32",
    "caseId": "case.gs028se.fisher-exact-study-design.b-cross-sectional",
    "nodeId": "node.gs028se.fisher-exact-study-design.b-cross-sectional.1",
    "questionVariantId": "question.statistics-ethics.study-design.v4.r1",
    "conceptId": "concept.statistics-ethics.study-design",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S33",
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.a-baseline-shift",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.a-baseline-shift.1",
    "questionVariantId": "question.statistics-ethics.bias-confounding.v1.r1",
    "conceptId": "concept.statistics-ethics.bias-confounding",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S34",
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.a-night-excluded",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.a-night-excluded.1",
    "questionVariantId": "question.statistics-ethics.bias-confounding.v2.r1",
    "conceptId": "concept.statistics-ethics.bias-confounding",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S35",
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.a-recall-timing",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.a-recall-timing.1",
    "questionVariantId": "question.statistics-ethics.bias-confounding.v3.r1",
    "conceptId": "concept.statistics-ethics.bias-confounding",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S36",
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.a-adjusted-model",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.a-adjusted-model.1",
    "questionVariantId": "question.statistics-ethics.bias-confounding.v4.r1",
    "conceptId": "concept.statistics-ethics.bias-confounding",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S37",
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-90",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-90.1",
    "questionVariantId": "question.statistics-ethics.sensitivity-specificity.v1.r1",
    "conceptId": "concept.statistics-ethics.sensitivity-specificity",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S38",
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.b-specificity-95",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.b-specificity-95.1",
    "questionVariantId": "question.statistics-ethics.sensitivity-specificity.v2.r1",
    "conceptId": "concept.statistics-ethics.sensitivity-specificity",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S39",
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-80",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-80.1",
    "questionVariantId": "question.statistics-ethics.sensitivity-specificity.v3.r1",
    "conceptId": "concept.statistics-ethics.sensitivity-specificity",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S40",
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.b-specificity-70",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.b-specificity-70.1",
    "questionVariantId": "question.statistics-ethics.sensitivity-specificity.v4.r1",
    "conceptId": "concept.statistics-ethics.sensitivity-specificity",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S41",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-higher-prevalence",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-higher-prevalence.1",
    "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v1.r1",
    "conceptId": "concept.statistics-ethics.predictive-value-prevalence",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S42",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.1",
    "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v2.r2",
    "conceptId": "concept.predictive-value.collection-population-denominator.v1",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S43",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-ppv-table",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-ppv-table.1",
    "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v3.r1",
    "conceptId": "concept.statistics-ethics.predictive-value-prevalence",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S44",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed.1",
    "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v4.r2",
    "conceptId": "concept.statistics-ethics.predictive-value-prevalence",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S45",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-cohort-risk",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-cohort-risk.1",
    "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v1.r1",
    "conceptId": "concept.statistics-ethics.risk-ratio-odds-ratio",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S46",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-case-control-or",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-case-control-or.1",
    "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v2.r1",
    "conceptId": "concept.statistics-ethics.risk-ratio-odds-ratio",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S47",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-adjusted-odds",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-adjusted-odds.1",
    "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v3.r4",
    "conceptId": "concept.statistics-ethics.risk-ratio-odds-ratio",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S48",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-rare-not-identical",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-rare-not-identical.1",
    "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v4.r5",
    "conceptId": "concept.statistics-ethics.risk-ratio-odds-ratio",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S49",
    "caseId": "case.gs028se.arr-nnt-p-value.a-arr-ten",
    "nodeId": "node.gs028se.arr-nnt-p-value.a-arr-ten.1",
    "questionVariantId": "question.statistics-ethics.arr-nnt.v1.r2",
    "conceptId": "concept.statistics-ethics.arr-nnt",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S50",
    "caseId": "case.gs028se.arr-nnt-p-value.a-arr-five",
    "nodeId": "node.gs028se.arr-nnt-p-value.a-arr-five.1",
    "questionVariantId": "question.statistics-ethics.arr-nnt.v2.r2",
    "conceptId": "concept.statistics-ethics.arr-nnt",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S51",
    "caseId": "case.gs028se.arr-nnt-p-value.a-arr-twenty",
    "nodeId": "node.gs028se.arr-nnt-p-value.a-arr-twenty.1",
    "questionVariantId": "question.statistics-ethics.arr-nnt.v3.r2",
    "conceptId": "concept.statistics-ethics.arr-nnt",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S52",
    "caseId": "case.gs028se.arr-nnt-p-value.a-arr-six",
    "nodeId": "node.gs028se.arr-nnt-p-value.a-arr-six.1",
    "questionVariantId": "question.statistics-ethics.arr-nnt.v4.r2",
    "conceptId": "concept.statistics-ethics.arr-nnt",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S53",
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-003",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-003.1",
    "questionVariantId": "question.statistics-ethics.p-value.v1.r5",
    "conceptId": "concept.statistics-ethics.p-value",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S54",
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-040",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-040.1",
    "questionVariantId": "question.statistics-ethics.p-value.v2.r8",
    "conceptId": "concept.statistics-ethics.p-value.v2",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S55",
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-0001",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-0001.1",
    "questionVariantId": "question.statistics-ethics.p-value.v3.r6",
    "conceptId": "concept.statistics-ethics.p-value",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S56",
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-008",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-008.1",
    "questionVariantId": "question.statistics-ethics.p-value.v4.r4",
    "conceptId": "concept.statistics-ethics.p-value",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S57",
    "caseId": "case.gs028se.confidence-interval-errors-power.a-ratio-crosses",
    "nodeId": "node.gs028se.confidence-interval-errors-power.a-ratio-crosses.1",
    "questionVariantId": "question.statistics-ethics.confidence-interval.v1.r4",
    "conceptId": "concept.statistics-ethics.confidence-interval",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S58",
    "caseId": "case.gs028se.confidence-interval-errors-power.a-difference-excludes",
    "nodeId": "node.gs028se.confidence-interval-errors-power.a-difference-excludes.1",
    "questionVariantId": "question.statistics-ethics.confidence-interval.v2.r1",
    "conceptId": "concept.statistics-ethics.confidence-interval",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S59",
    "caseId": "case.gs028se.confidence-interval-errors-power.a-precision-width",
    "nodeId": "node.gs028se.confidence-interval-errors-power.a-precision-width.1",
    "questionVariantId": "question.statistics-ethics.confidence-interval.v3.r2",
    "conceptId": "concept.statistics-ethics.confidence-interval",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S60",
    "caseId": "case.gs028se.confidence-interval-errors-power.a-repeated-sampling",
    "nodeId": "node.gs028se.confidence-interval-errors-power.a-repeated-sampling.1",
    "questionVariantId": "question.statistics-ethics.confidence-interval.v4.r1",
    "conceptId": "concept.statistics-ethics.confidence-interval",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S61",
    "caseId": "case.gs028se.confidence-interval-errors-power.b-type-one",
    "nodeId": "node.gs028se.confidence-interval-errors-power.b-type-one.1",
    "questionVariantId": "question.statistics-ethics.errors-power.v1.r1",
    "conceptId": "concept.statistics-ethics.errors-power",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S62",
    "caseId": "case.gs028se.confidence-interval-errors-power.b-type-two",
    "nodeId": "node.gs028se.confidence-interval-errors-power.b-type-two.1",
    "questionVariantId": "question.statistics-ethics.errors-power.v2.r1",
    "conceptId": "concept.statistics-ethics.errors-power",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S63",
    "caseId": "case.gs028se.confidence-interval-errors-power.b-power",
    "nodeId": "node.gs028se.confidence-interval-errors-power.b-power.1",
    "questionVariantId": "question.statistics-ethics.errors-power.v3.r1",
    "conceptId": "concept.statistics-ethics.errors-power",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  {
    "acceptanceId": "S64",
    "caseId": "case.gs028se.confidence-interval-errors-power.b-post-hoc",
    "nodeId": "node.gs028se.confidence-interval-errors-power.b-post-hoc.1",
    "questionVariantId": "question.statistics-ethics.errors-power.v4.r1",
    "conceptId": "concept.statistics-ethics.errors-power",
    "sourceView": "stats1-accepted",
    "decision": "docs/research/question-stats1-manager-decision-20261108.md"
  },
  // END STATS1 ACCEPTANCES 20261108
  // BEGIN FLAGS4 ACCEPTANCE 20261108
  {
    "acceptanceId": "F4-01",
    "caseId": "case.gs028f.nutrition.c1-metabolic-transition",
    "nodeId": "node.gs028f.nutrition.c1-metabolic-transition.1",
    "questionVariantId": "question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3.r2",
    "conceptId": "concept.gs028f.nutrition.refeeding-insulin-phosphate-shift",
    "sourceView": "flags4-accepted",
    "decision": "docs/research/question-flags4-manager-decision-20261108.md"
  },
  // END FLAGS4 ACCEPTANCE 20261108
  // BEGIN HARDEN1 / N3R4 exact PASS acceptances 20261110
  {"acceptanceId":"H1-03","caseId":"case.harden1.phosphate-handling.20261110","nodeId":"node.harden1.phosphate-handling.20261110","questionVariantId":"question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3.r3","conceptId":"concept.gs028f.nutrition.refeeding-insulin-phosphate-shift.v2","sourceView":"harden1-round1","decision":"docs/research/question-harden1-n3r4-manager-decision-20261110.md"},
  {"acceptanceId":"review.n3.delayed-regurgitation-proximal-anatomic-study.v4","caseId":"case.n3.delayed-regurgitation-proximal-anatomic-study.v1","nodeId":"node.n3.delayed-regurgitation-proximal-anatomic-study.v1","questionVariantId":"question.n3.delayed-regurgitation-proximal-anatomic-study.v4","conceptId":"concept.n3.delayed-regurgitation-proximal-anatomic-study","sourceView":"n3-round4","decision":"docs/research/question-harden1-n3r4-manager-decision-20261110.md"},
  {"acceptanceId":"review.n3.venous-ulcer-with-competing-arterial-findings.v4","caseId":"case.n3.venous-ulcer-with-competing-arterial-findings.v1","nodeId":"node.n3.venous-ulcer-with-competing-arterial-findings.v1","questionVariantId":"question.n3.venous-ulcer-with-competing-arterial-findings.v4","conceptId":"concept.venous-leg-ulcer.arterial-assessment-before-compression","sourceView":"n3-round4","decision":"docs/research/question-harden1-n3r4-manager-decision-20261110.md"},
  // END HARDEN1 / N3R4 exact PASS acceptances 20261110
  // N4 exact four round1 + four round2 PASS additions; no clinical approval.
{
    "acceptanceId": "review.n4.cholecystectomy-neck-plane-bailout.v1",
    "caseId": "case.n4.cholecystectomy-neck-plane-bailout.v1",
    "nodeId": "node.n4.cholecystectomy-neck-plane-bailout.v1",
    "questionVariantId": "question.n4.cholecystectomy-neck-plane-bailout.v1",
    "conceptId": "concept.gs028g.subtotal-cholecystectomy.safe-bailout",
    "sourceView": "n4-round1",
    "decision": "docs/research/question-n4-manager-decision-20261110.md"
  },
  {
    "acceptanceId": "review.n4.colonic-wall-pattern-after-mucosal-biopsy.v1",
    "caseId": "case.n4.colonic-wall-pattern-after-mucosal-biopsy.v1",
    "nodeId": "node.n4.colonic-wall-pattern-after-mucosal-biopsy.v1",
    "questionVariantId": "question.n4.colonic-wall-pattern-after-mucosal-biopsy.v1",
    "conceptId": "concept.colonic-lipoma.endoscopic-recognition.v3",
    "sourceView": "n4-round1",
    "decision": "docs/research/question-n4-manager-decision-20261110.md"
  },
  {
    "acceptanceId": "review.n4.venous-ulcer-contralateral-pressure-trap.v1",
    "caseId": "case.n4.venous-ulcer-contralateral-pressure-trap.v1",
    "nodeId": "node.n4.venous-ulcer-contralateral-pressure-trap.v1",
    "questionVariantId": "question.n4.venous-ulcer-contralateral-pressure-trap.v1",
    "conceptId": "concept.venous-leg-ulcer.arterial-assessment-before-compression",
    "sourceView": "n4-round1",
    "decision": "docs/research/question-n4-manager-decision-20261110.md"
  },
  {
    "acceptanceId": "review.n4.incisional-pocket-above-retained-mesh.v1",
    "caseId": "case.n4.incisional-pocket-above-retained-mesh.v1",
    "nodeId": "node.n4.incisional-pocket-above-retained-mesh.v1",
    "questionVariantId": "question.n4.incisional-pocket-above-retained-mesh.v1",
    "conceptId": "concept.superficial-incisional-ssi.open-drain",
    "sourceView": "n4-round1",
    "decision": "docs/research/question-n4-manager-decision-20261110.md"
  },
  {
    "acceptanceId": "review.n4.ventral-controlled-enterotomy-mesh-material.v2",
    "caseId": "case.n4.ventral-controlled-enterotomy-mesh-material.v2",
    "nodeId": "node.n4.ventral-controlled-enterotomy-mesh-material.v2",
    "questionVariantId": "question.n4.ventral-controlled-enterotomy-mesh-material.v2",
    "conceptId": "concept.n4r2.mesh-material-and-contact-compartment",
    "sourceView": "n4-round2",
    "decision": "docs/research/question-n4-manager-decision-20261110.md"
  },
  {
    "acceptanceId": "review.n4.unexpected-deep-mass-during-lipoma-excision.v2",
    "caseId": "case.n4.unexpected-deep-mass-during-lipoma-excision.v2",
    "nodeId": "node.n4.unexpected-deep-mass-during-lipoma-excision.v2",
    "questionVariantId": "question.n4.unexpected-deep-mass-during-lipoma-excision.v2",
    "conceptId": "concept.soft-tissue-mass.extremity-mri.v2",
    "sourceView": "n4-round2",
    "decision": "docs/research/question-n4-manager-decision-20261110.md"
  },
  {
    "acceptanceId": "review.n4.ulcer-recurrent-bleeding-after-clips.v2",
    "caseId": "case.n4.ulcer-recurrent-bleeding-after-clips.v2",
    "nodeId": "node.n4.ulcer-recurrent-bleeding-after-clips.v2",
    "questionVariantId": "question.n4.ulcer-recurrent-bleeding-after-clips.v2",
    "conceptId": "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality.v2",
    "sourceView": "n4-round2",
    "decision": "docs/research/question-n4-manager-decision-20261110.md"
  },
  {
    "acceptanceId": "review.n4.cholangiogram-lucencies-and-proximal-coverage.v1",
    "caseId": "case.n4.cholangiogram-lucencies-and-proximal-coverage.v1",
    "nodeId": "node.n4.cholangiogram-lucencies-and-proximal-coverage.v1",
    "questionVariantId": "question.n4.cholangiogram-lucencies-and-proximal-coverage.v1",
    "conceptId": "concept.n4r2.cholangiogram-quality-before-duct-treatment",
    "sourceView": "n4-round2",
    "decision": "docs/research/question-n4-manager-decision-20261110.md"
  }
,
  // Topic program batch1: exact complete-case PASS rows, no clinical approval.
{
    "acceptanceId": "question.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.v1",
    "caseId": "case.topic.small-bowel-obstruction-ileus.closed-loop.v1",
    "nodeId": "node.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.v1",
    "questionVariantId": "question.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.v1",
    "conceptId": "concept.small-bowel-obstruction.urgent-surgical-escalation.v2",
    "sourceView": "topic-batch1-small-bowel-obstruction-ileus",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.v1",
    "caseId": "case.topic.small-bowel-obstruction-ileus.transit-course.v1",
    "nodeId": "node.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.v1",
    "questionVariantId": "question.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.v1",
    "conceptId": "concept.small-bowel-obstruction.urgent-surgical-escalation.v2",
    "sourceView": "topic-batch1-small-bowel-obstruction-ileus",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.small-bowel-obstruction-ileus.virgin-abdomen-observation.v1",
    "caseId": "case.topic.small-bowel-obstruction-ileus.virgin-abdomen.v1",
    "nodeId": "node.topic.small-bowel-obstruction-ileus.virgin-abdomen-observation.v1",
    "questionVariantId": "question.topic.small-bowel-obstruction-ileus.virgin-abdomen-observation.v1",
    "conceptId": "concept.small-bowel-obstruction-ileus.nonoperative-eligibility.v1",
    "sourceView": "topic-batch1-small-bowel-obstruction-ileus",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1",
    "caseId": "case.topic.critical-renal-organ-support.circuit-anticoagulation.v1",
    "nodeId": "node.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1",
    "questionVariantId": "question.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1",
    "conceptId": "concept.critical-renal-organ-support.citrate-bleeding-circuit.v1",
    "sourceView": "topic-batch1-critical-renal-organ-support",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.critical-renal-organ-support.trial-off-crrt.v2",
    "caseId": "case.topic.critical-renal-organ-support.kidney-recovery.v1",
    "nodeId": "node.topic.critical-renal-organ-support.trial-off-crrt.v2",
    "questionVariantId": "question.topic.critical-renal-organ-support.trial-off-crrt.v2",
    "conceptId": "concept.critical-renal-organ-support.trial-off-crrt.v1",
    "sourceView": "topic-batch1-critical-renal-organ-support",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.critical-shock-resuscitation.choose-valid-fluid-test.v1",
    "caseId": "case.critical-shock-resuscitation.fluid-assessment.v1",
    "nodeId": "node.critical-shock-resuscitation.choose-valid-fluid-test.v1",
    "questionVariantId": "question.critical-shock-resuscitation.choose-valid-fluid-test.v1",
    "conceptId": "concept.critical-shock-resuscitation.choose-valid-fluid-test.v1",
    "sourceView": "topic-batch1-critical-shock-resuscitation",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.critical-shock-resuscitation.response-versus-fluid-risk.v1",
    "caseId": "case.critical-shock-resuscitation.fluid-assessment.v1",
    "nodeId": "node.critical-shock-resuscitation.response-versus-fluid-risk.v1",
    "questionVariantId": "question.critical-shock-resuscitation.response-versus-fluid-risk.v1",
    "conceptId": "concept.critical-shock-resuscitation.response-versus-fluid-risk.v1",
    "sourceView": "topic-batch1-critical-shock-resuscitation",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.critical-shock-resuscitation.echo-for-persistent-shock.v2",
    "caseId": "case.critical-shock-resuscitation.reassess-shock-mechanism.v2",
    "nodeId": "node.critical-shock-resuscitation.echo-for-persistent-shock.v2",
    "questionVariantId": "question.critical-shock-resuscitation.echo-for-persistent-shock.v2",
    "conceptId": "concept.critical-shock-resuscitation.echo-for-persistent-shock.v2",
    "sourceView": "topic-batch1-critical-shock-resuscitation",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.appendix-appendicitis.peritoneal-mucin-referral.v2",
    "caseId": "case.topic.appendix-appendicitis.peritoneal-mucin.v2",
    "nodeId": "node.topic.appendix-appendicitis.peritoneal-mucin-referral.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.peritoneal-mucin-referral.v2",
    "conceptId": "concept.appendix-appendicitis.low-grade-peritoneal-disease-referral.v1",
    "sourceView": "topic-batch1-appendix-appendicitis",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1",
    "caseId": "case.topic.appendix-appendicitis.goblet-cell-pathology.v1",
    "nodeId": "node.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1",
    "questionVariantId": "question.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1",
    "conceptId": "concept.appendix-appendicitis.goblet-cell-adenocarcinoma-resection.v1",
    "sourceView": "topic-batch1-appendix-appendicitis",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.appendix-appendicitis.net-regional-resection.v2",
    "caseId": "case.topic.appendix-appendicitis.net-staging.v2",
    "nodeId": "node.topic.appendix-appendicitis.net-regional-resection.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.net-regional-resection.v2",
    "conceptId": "concept.appendix-appendicitis.large-net-regional-resection.v1",
    "sourceView": "topic-batch1-appendix-appendicitis",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
    "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
    "questionVariantId": "question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.equivocal-bowel-inpatient-observation",
    "sourceView": "topic-batch1-trauma-initial-abdomen",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
    "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
    "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
    "conceptId": "concept.topic.trauma-initial-abdomen.evolving-bowel-repeat-ct",
    "sourceView": "topic-batch1-trauma-initial-abdomen",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
    "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
    "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.persistent-pelvic-bleeding-packing",
    "sourceView": "topic-batch1-trauma-initial-abdomen",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
    "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
    "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.pelvic-arterial-rescue-embolization",
    "sourceView": "topic-batch1-trauma-initial-abdomen",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-initial-abdomen.bladder-acquisition.v2",
    "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.bladder-acquisition.v2",
    "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-acquisition.v2",
    "conceptId": "concept.topic.trauma-initial-abdomen.traumatic-bladder-retrograde-cystography",
    "sourceView": "topic-batch1-trauma-initial-abdomen",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
    "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
    "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
    "conceptId": "concept.topic.trauma-initial-abdomen.complicated-extraperitoneal-bladder-repair.v2",
    "sourceView": "topic-batch1-trauma-initial-abdomen",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
    "caseId": "case.topic.trauma-initial-abdomen.pancreatic-duct-location.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
    "questionVariantId": "question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.distal-pancreatic-duct-transection-resection",
    "sourceView": "topic-batch1-trauma-initial-abdomen",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
    "caseId": "case.topic.trauma-initial-abdomen.contained-renal-compartment.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
    "questionVariantId": "question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.contained-zone-two-hematoma-preservation",
    "sourceView": "topic-batch1-trauma-initial-abdomen",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-initial-abdomen.jejunum-primary-repair.v2",
    "caseId": "case.topic.trauma-initial-abdomen.limited-jejunum-defect.v2",
    "nodeId": "node.topic.trauma-initial-abdomen.jejunum-primary-repair.v2",
    "questionVariantId": "question.topic.trauma-initial-abdomen.jejunum-primary-repair.v2",
    "conceptId": "concept.topic.trauma-initial-abdomen.mesenteric-devascularization-reconstruction.v2",
    "sourceView": "topic-batch1-trauma-initial-abdomen",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.critical-respiratory-ventilation.expiratory-time.v1",
    "caseId": "case.topic.critical-respiratory-ventilation.air-trapping.v1",
    "nodeId": "node.topic.critical-respiratory-ventilation.expiratory-time.v1",
    "questionVariantId": "question.topic.critical-respiratory-ventilation.expiratory-time.v1",
    "conceptId": "concept.critical-respiratory-ventilation.expiratory-time.v1",
    "sourceView": "topic-batch1-critical-respiratory-ventilation",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  },
  {
    "acceptanceId": "question.topic.critical-respiratory-ventilation.postextubation-rescue.v1",
    "caseId": "case.topic.critical-respiratory-ventilation.extubation-rescue.v1",
    "nodeId": "node.topic.critical-respiratory-ventilation.postextubation-rescue.v1",
    "questionVariantId": "question.topic.critical-respiratory-ventilation.postextubation-rescue.v1",
    "conceptId": "concept.critical-respiratory-ventilation.postextubation-rescue.v1",
    "sourceView": "topic-batch1-critical-respiratory-ventilation",
    "decision": "docs/research/question-topic-acceptance-batch1-20261111.md"
  }
,
  // Manager-accepted complete topic cases, batch 2.
{
    "acceptanceId": "question.trauma-thoracic.bci-selective-imaging.20261111.v2",
    "caseId": "case.trauma-thoracic.cardiac-course.20261111.v1",
    "nodeId": "node.trauma-thoracic.bci-selective-imaging.20261111.v2",
    "questionVariantId": "question.trauma-thoracic.bci-selective-imaging.20261111.v2",
    "conceptId": "concept.trauma-thoracic.bci-selective-imaging.v1",
    "sourceView": "topic-batch2-trauma-thoracic",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2",
    "caseId": "case.trauma-thoracic.cardiac-course.20261111.v1",
    "nodeId": "node.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2",
    "questionVariantId": "question.trauma-thoracic.bci-persistent-arrhythmia.20261111.v2",
    "conceptId": "concept.trauma-thoracic.bci-arrhythmia-echo.v1",
    "sourceView": "topic-batch2-trauma-thoracic",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.trauma-thoracic.bci-normalpair-other-admission.20261111.v1",
    "caseId": "case.trauma-thoracic.cardiac-disposition.20261111.v1",
    "nodeId": "node.trauma-thoracic.bci-normalpair-other-admission.20261111.v1",
    "questionVariantId": "question.trauma-thoracic.bci-normalpair-other-admission.20261111.v1",
    "conceptId": "concept.blunt-cardiac-injury.monitored-disposition",
    "sourceView": "topic-batch2-trauma-thoracic",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1",
    "caseId": "case.trauma-thoracic.drain-complication.20261111.v1",
    "nodeId": "node.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1",
    "questionVariantId": "question.trauma-thoracic.chest-drain-organ-trajectory.20261111.v1",
    "conceptId": "concept.trauma-thoracic.chest-drain-organ-trajectory.v1",
    "sourceView": "topic-batch2-trauma-thoracic",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.trauma-thoracic.thoracic-bleeding-control.20261111.v1",
    "caseId": "case.trauma-thoracic.bleeding-course.20261111.v1",
    "nodeId": "node.trauma-thoracic.thoracic-bleeding-control.20261111.v1",
    "questionVariantId": "question.trauma-thoracic.thoracic-bleeding-control.20261111.v1",
    "conceptId": "concept.trauma-thoracic.hemothorax-physiology-escalation.v1",
    "sourceView": "topic-batch2-trauma-thoracic",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.trauma-thoracic.retained-hemothorax.20261111.v2",
    "caseId": "case.trauma-thoracic.bleeding-course.20261111.v1",
    "nodeId": "node.trauma-thoracic.retained-hemothorax.20261111.v2",
    "questionVariantId": "question.trauma-thoracic.retained-hemothorax.20261111.v2",
    "conceptId": "concept.trauma-thoracic.retained-hemothorax-vats.v1",
    "sourceView": "topic-batch2-trauma-thoracic",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.trauma-thoracic.rib-fixation-weaning.20261111.v2",
    "caseId": "case.trauma-thoracic.chestwall-course.20261111.v1",
    "nodeId": "node.trauma-thoracic.rib-fixation-weaning.20261111.v2",
    "questionVariantId": "question.trauma-thoracic.rib-fixation-weaning.20261111.v2",
    "conceptId": "concept.trauma-thoracic.rib-fixation-failed-weaning.v1",
    "sourceView": "topic-batch2-trauma-thoracic",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.screening.v2",
    "caseId": "case.vascular-aorta.screening-review.v2",
    "nodeId": "node.vascular-aorta.screening.v2",
    "questionVariantId": "question.vascular-aorta.screening.v2",
    "conceptId": "concept.aaa.one-time-ultrasound-screening",
    "sourceView": "topic-batch2-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.proximal-seal-repair.v1",
    "caseId": "case.vascular-aorta.proximal-attachment-leak.v1",
    "nodeId": "node.vascular-aorta.proximal-seal-repair.v1",
    "questionVariantId": "question.vascular-aorta.proximal-seal-repair.v1",
    "conceptId": "concept.vascular-aorta.type-i-endoleak-prompt-seal-repair.v1",
    "sourceView": "topic-batch2-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.ascending-emergency.v1",
    "caseId": "case.vascular-aorta.retrograde-ascending-extension.v1",
    "nodeId": "node.vascular-aorta.ascending-emergency.v1",
    "questionVariantId": "question.vascular-aorta.ascending-emergency.v1",
    "conceptId": "concept.vascular-aorta.retrograde-ascending-dissection-emergency-repair.v1",
    "sourceView": "topic-batch2-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.initial-type-b.v2",
    "caseId": "case.vascular-aorta.impulse-response-review.v2",
    "nodeId": "node.vascular-aorta.initial-type-b.v2",
    "questionVariantId": "question.vascular-aorta.initial-type-b.v2",
    "conceptId": "concept.vascular-aorta.aortic-syndrome-vasodilation-after-rate-control.v1",
    "sourceView": "topic-batch2-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.lsa-coronary-inflow.v1",
    "caseId": "case.vascular-aorta.tevar-inflow-and-neurology.v1",
    "nodeId": "node.vascular-aorta.lsa-coronary-inflow.v1",
    "questionVariantId": "question.vascular-aorta.lsa-coronary-inflow.v1",
    "conceptId": "concept.vascular-aorta.tevar-lsa-lima-inflow-preservation.v1",
    "sourceView": "topic-batch2-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.post-tevar-cord-rescue.v1",
    "caseId": "case.vascular-aorta.tevar-inflow-and-neurology.v1",
    "nodeId": "node.vascular-aorta.post-tevar-cord-rescue.v1",
    "questionVariantId": "question.vascular-aorta.post-tevar-cord-rescue.v1",
    "conceptId": "concept.vascular-aorta.post-tevar-spinal-cord-perfusion-rescue.v1",
    "sourceView": "topic-batch2-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.small-embolizing-paa.v2",
    "caseId": "case.vascular-aorta.small-popliteal-course.v2",
    "nodeId": "node.vascular-aorta.small-embolizing-paa.v2",
    "questionVariantId": "question.vascular-aorta.small-embolizing-paa.v2",
    "conceptId": "concept.vascular-aorta.small-popliteal-aneurysm-embolic-repair.v1",
    "sourceView": "topic-batch2-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.associated-aneurysm-survey.v2",
    "caseId": "case.vascular-aorta.small-popliteal-course.v2",
    "nodeId": "node.vascular-aorta.associated-aneurysm-survey.v2",
    "questionVariantId": "question.vascular-aorta.associated-aneurysm-survey.v2",
    "conceptId": "concept.vascular-aorta.popliteal-associated-aneurysm-survey-completeness.v1",
    "sourceView": "topic-batch2-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.graft-bleed-imaging.v2",
    "caseId": "case.vascular-aorta.graft-diagnostic-review.v2",
    "nodeId": "node.vascular-aorta.graft-bleed-imaging.v2",
    "questionVariantId": "question.vascular-aorta.graft-bleed-imaging.v2",
    "conceptId": "concept.vascular-aorta.aortic-graft-infection-bleeding-cross-sectional-evaluation.v1",
    "sourceView": "topic-batch2-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.marfan-repair-approach.v1",
    "caseId": "case.vascular-aorta.heritable-native-taaa.v1",
    "nodeId": "node.vascular-aorta.marfan-repair-approach.v1",
    "questionVariantId": "question.vascular-aorta.marfan-repair-approach.v1",
    "conceptId": "concept.vascular-aorta.marfan-intact-taaa-open-repair-selection.v1",
    "sourceView": "topic-batch2-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.topic.liver-malignancy.hcc-acquisition.v1",
    "caseId": "case.topic.liver-malignancy.dynamic-hcc.v1",
    "nodeId": "node.topic.liver-malignancy.hcc-acquisition.v1",
    "questionVariantId": "question.topic.liver-malignancy.hcc-acquisition.v1",
    "conceptId": "concept.topic.liver-malignancy.dynamic-acquisition.v1",
    "sourceView": "topic-batch2-liver-malignancy",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.topic.liver-malignancy.hcc-imaging-diagnosis.v2",
    "caseId": "case.topic.liver-malignancy.dynamic-hcc.v1",
    "nodeId": "node.topic.liver-malignancy.hcc-imaging-diagnosis.v2",
    "questionVariantId": "question.topic.liver-malignancy.hcc-imaging-diagnosis.v2",
    "conceptId": "concept.topic.liver-malignancy.mixed-imaging-tissue-selection.v1",
    "sourceView": "topic-batch2-liver-malignancy",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.topic.liver-malignancy.hcc-raw-reserve.v2",
    "caseId": "case.topic.liver-malignancy.hcc-favorable-resection.v1",
    "nodeId": "node.topic.liver-malignancy.hcc-raw-reserve.v2",
    "questionVariantId": "question.topic.liver-malignancy.hcc-raw-reserve.v2",
    "conceptId": "concept.hcc.compensated-cirrhosis-resection-selection",
    "sourceView": "topic-batch2-liver-malignancy",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.topic.liver-malignancy.hcc-portal-flow.v1",
    "caseId": "case.topic.liver-malignancy.hcc-portal-flow.v1",
    "nodeId": "node.topic.liver-malignancy.hcc-portal-flow.v1",
    "questionVariantId": "question.topic.liver-malignancy.hcc-portal-flow.v1",
    "conceptId": "concept.topic.liver-malignancy.hcc-vascular-pathway.v1",
    "sourceView": "topic-batch2-liver-malignancy",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-chronic-cysts-neoplasia.borderline-systemic-first.v2",
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.head-cancer-sequence.v2",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.borderline-systemic-first.v2",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.borderline-systemic-first.v2",
    "conceptId": "concept.pancreas-chronic-cysts-neoplasia.borderline-venous-neoadjuvant-sequence.v1",
    "sourceView": "topic-batch2-pancreas-chronic-cysts-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2",
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.head-cancer-sequence.v2",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.neoadjuvant-jaundice-drainage.v2",
    "conceptId": "concept.pancreas-chronic-cysts-neoplasia.neoadjuvant-obstructive-jaundice-stent.v1",
    "sourceView": "topic-batch2-pancreas-chronic-cysts-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2",
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.postoperative-source-control.v2",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.postop-infected-collection-drain.v2",
    "conceptId": "concept.pancreas-chronic-cysts-neoplasia.postop-collection-source-control.v1",
    "sourceView": "topic-batch2-pancreas-chronic-cysts-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.v1",
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.serous-compression.v1",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.v1",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.v1",
    "conceptId": "concept.pancreas-chronic-cysts-neoplasia.serous-compressive-symptoms.v1",
    "sourceView": "topic-batch2-pancreas-chronic-cysts-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1",
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.ipmn-after-resection.v1",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1",
    "conceptId": "concept.pancreas-chronic-cysts-neoplasia.ipmn-remnant-low-grade-followup.v1",
    "sourceView": "topic-batch2-pancreas-chronic-cysts-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  }
,
  // Manager-accepted complete topic cases, batch 3.
{
    "acceptanceId": "question.topic.esophagus-motility-achalasia.botulinum-rescue-risk.v1",
    "caseId": "case.topic.esophagus-motility-achalasia.limited-rescue-fitness.v1",
    "nodeId": "node.topic.esophagus-motility-achalasia.botulinum-rescue-risk.v1",
    "questionVariantId": "question.topic.esophagus-motility-achalasia.botulinum-rescue-risk.v1",
    "conceptId": "concept.esophagus-motility-achalasia.symptom-relief-with-limited-rescue-fitness.v1",
    "sourceView": "topic-batch3-esophagus-motility-achalasia",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-motility-achalasia.egjoo-supportive-study.v2",
    "caseId": "case.topic.esophagus-motility-achalasia.preserved-peristalsis.v1",
    "nodeId": "node.topic.esophagus-motility-achalasia.egjoo-supportive-study.v2",
    "questionVariantId": "question.topic.esophagus-motility-achalasia.egjoo-supportive-study.v2",
    "conceptId": "concept.esophagus-motility-achalasia.egjoo-corroboration.v1",
    "sourceView": "topic-batch3-esophagus-motility-achalasia",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-motility-achalasia.flip-after-failed-assistance.v2",
    "caseId": "case.topic.esophagus-motility-achalasia.persistent-acquisition-failure.v1",
    "nodeId": "node.topic.esophagus-motility-achalasia.flip-after-failed-assistance.v2",
    "questionVariantId": "question.topic.esophagus-motility-achalasia.flip-after-failed-assistance.v2",
    "conceptId": "concept.esophagus-motility-achalasia.complementary-flip-after-acquisition-failure.v1",
    "sourceView": "topic-batch3-esophagus-motility-achalasia",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-motility-achalasia.borderline-aperistalsis-study.v1",
    "caseId": "case.topic.esophagus-motility-achalasia.borderline-relaxation.v1",
    "nodeId": "node.topic.esophagus-motility-achalasia.borderline-aperistalsis-study.v1",
    "questionVariantId": "question.topic.esophagus-motility-achalasia.borderline-aperistalsis-study.v1",
    "conceptId": "concept.esophagus-motility-achalasia.borderline-relaxation-aperistalsis.v1",
    "sourceView": "topic-batch3-esophagus-motility-achalasia",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-gerd-barrett-hiatal.off-therapy-after-normal-egd.v1",
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.nighttime-symptoms.v1",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.off-therapy-after-normal-egd.v1",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.off-therapy-after-normal-egd.v1",
    "conceptId": "concept.gerd.off-ppi-reflux-monitoring",
    "sourceView": "topic-batch3-esophagus-gerd-barrett-hiatal",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-gerd-barrett-hiatal.negative-reflux-medication.v1",
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.nighttime-symptoms.v1",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.negative-reflux-medication.v1",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.negative-reflux-medication.v1",
    "conceptId": "concept.topic.esophagus-gerd-barrett-hiatal.negative-reflux-medication.v1",
    "sourceView": "topic-batch3-esophagus-gerd-barrett-hiatal",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-gerd-barrett-hiatal.irregular-z-surveillance-boundary.v1",
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.junctional-metaplasia.v1",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.irregular-z-surveillance-boundary.v1",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.irregular-z-surveillance-boundary.v1",
    "conceptId": "concept.topic.esophagus-gerd-barrett-hiatal.irregular-z-surveillance-boundary.v1",
    "sourceView": "topic-batch3-esophagus-gerd-barrett-hiatal",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  
  
  {
    "acceptanceId": "question.topic.esophagus-gerd-barrett-hiatal.inconclusive-wireless-study.v2",
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.variable-acid-exposure.v2",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.inconclusive-wireless-study.v2",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.inconclusive-wireless-study.v2",
    "conceptId": "concept.gerd.off-ppi-reflux-monitoring",
    "sourceView": "topic-batch3-esophagus-gerd-barrett-hiatal",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-gerd-barrett-hiatal.surveillance-from-primary-record.v2",
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.referral-versus-record.v2",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.surveillance-from-primary-record.v2",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.surveillance-from-primary-record.v2",
    "conceptId": "concept.topic.esophagus-gerd-barrett-hiatal.surveillance-sampling-adequacy.v1",
    "sourceView": "topic-batch3-esophagus-gerd-barrett-hiatal",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-gerd-barrett-hiatal.limited-negative-sampling.v2",
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.sampling-and-inflammation.v2",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.limited-negative-sampling.v2",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.limited-negative-sampling.v2",
    "conceptId": "concept.topic.esophagus-gerd-barrett-hiatal.limited-negative-sampling.v1",
    "sourceView": "topic-batch3-esophagus-gerd-barrett-hiatal",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-gerd-barrett-hiatal.informed-hernia-observation.v2",
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.incidental-hernia.v2",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.informed-hernia-observation.v2",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.informed-hernia-observation.v2",
    "conceptId": "concept.topic.esophagus-gerd-barrett-hiatal.symptomatic-hernia-anemia.v1",
    "sourceView": "topic-batch3-esophagus-gerd-barrett-hiatal",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.surgical-infection-antibiotics.postdrain-antibiotic-need.v2",
    "caseId": "case.topic.surgical-infection-antibiotics.incisional-response.v1",
    "nodeId": "node.topic.surgical-infection-antibiotics.postdrain-antibiotic-need.v2",
    "questionVariantId": "question.topic.surgical-infection-antibiotics.postdrain-antibiotic-need.v2",
    "conceptId": "concept.surgical-infection-antibiotics.postdrain-systemic-indication.v1",
    "sourceView": "topic-batch3-surgical-infection-antibiotics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.surgical-infection-antibiotics.closure-prophylaxis.v2",
    "caseId": "case.topic.surgical-infection-antibiotics.medication-reconciliation.v1",
    "nodeId": "node.topic.surgical-infection-antibiotics.closure-prophylaxis.v2",
    "questionVariantId": "question.topic.surgical-infection-antibiotics.closure-prophylaxis.v2",
    "conceptId": "concept.postoperative-prophylaxis.stop-antibiotics-at-closure",
    "sourceView": "topic-batch3-surgical-infection-antibiotics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.surgical-infection-antibiotics.culture-directed-narrowing.v2",
    "caseId": "case.topic.surgical-infection-antibiotics.culture-narrowing.v1",
    "nodeId": "node.topic.surgical-infection-antibiotics.culture-directed-narrowing.v2",
    "questionVariantId": "question.topic.surgical-infection-antibiotics.culture-directed-narrowing.v2",
    "conceptId": "concept.surgical-infection-antibiotics.culture-directed-narrowing.v1",
    "sourceView": "topic-batch3-surgical-infection-antibiotics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.surgical-infection-antibiotics.anaerobic-coverage.v2",
    "caseId": "case.topic.surgical-infection-antibiotics.anaerobic-processing.v1",
    "nodeId": "node.topic.surgical-infection-antibiotics.anaerobic-coverage.v2",
    "questionVariantId": "question.topic.surgical-infection-antibiotics.anaerobic-coverage.v2",
    "conceptId": "concept.surgical-infection-antibiotics.anaerobic-coverage-after-aerobic-culture.v2",
    "sourceView": "topic-batch3-surgical-infection-antibiotics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.surgical-infection-antibiotics.invasive-candida-treatment.v2",
    "caseId": "case.topic.surgical-infection-antibiotics.invasive-yeast-record.v1",
    "nodeId": "node.topic.surgical-infection-antibiotics.invasive-candida-treatment.v2",
    "questionVariantId": "question.topic.surgical-infection-antibiotics.invasive-candida-treatment.v2",
    "conceptId": "concept.surgical-infection-antibiotics.invasive-candida-initial-therapy.v2",
    "sourceView": "topic-batch3-surgical-infection-antibiotics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.surgical-infection-antibiotics.old-drain-colonization.v2",
    "caseId": "case.topic.surgical-infection-antibiotics.old-drain-isolate.v1",
    "nodeId": "node.topic.surgical-infection-antibiotics.old-drain-colonization.v2",
    "questionVariantId": "question.topic.surgical-infection-antibiotics.old-drain-colonization.v2",
    "conceptId": "concept.surgical-infection-antibiotics.old-drain-culture-interpretation.v1",
    "sourceView": "topic-batch3-surgical-infection-antibiotics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colon-diverticular-lower-bleeding.large-accessible-abscess.v1",
    "caseId": "case.topic.colon-diverticular-lower-bleeding.pelvic-abscess-course.v1",
    "nodeId": "node.topic.colon-diverticular-lower-bleeding.large-accessible-abscess.v1",
    "questionVariantId": "question.topic.colon-diverticular-lower-bleeding.large-accessible-abscess.v1",
    "conceptId": "concept.colon-diverticular-lower-bleeding.abscess-source-control.v1",
    "sourceView": "topic-batch3-colon-diverticular-lower-bleeding",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colon-diverticular-lower-bleeding.failed-abscess-source-control.v2",
    "caseId": "case.topic.colon-diverticular-lower-bleeding.pelvic-abscess-course.v1",
    "nodeId": "node.topic.colon-diverticular-lower-bleeding.failed-abscess-source-control.v2",
    "questionVariantId": "question.topic.colon-diverticular-lower-bleeding.failed-abscess-source-control.v2",
    "conceptId": "concept.colon-diverticular-lower-bleeding.failed-source-control-operation.v1",
    "sourceView": "topic-batch3-colon-diverticular-lower-bleeding",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colon-diverticular-lower-bleeding.stable-primary-reconstruction.v2",
    "caseId": "case.topic.colon-diverticular-lower-bleeding.perforation-operative-review.v2",
    "nodeId": "node.topic.colon-diverticular-lower-bleeding.stable-primary-reconstruction.v2",
    "questionVariantId": "question.topic.colon-diverticular-lower-bleeding.stable-primary-reconstruction.v2",
    "conceptId": "concept.colon-diverticular-lower-bleeding.emergency-reconstruction.v1",
    "sourceView": "topic-batch3-colon-diverticular-lower-bleeding",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colon-diverticular-lower-bleeding.immunosuppressed-antibiotic-decision.v2",
    "caseId": "case.topic.colon-diverticular-lower-bleeding.immunosuppressed-recovery.v2",
    "nodeId": "node.topic.colon-diverticular-lower-bleeding.immunosuppressed-antibiotic-decision.v2",
    "questionVariantId": "question.topic.colon-diverticular-lower-bleeding.immunosuppressed-antibiotic-decision.v2",
    "conceptId": "concept.colon-diverticular-lower-bleeding.immunosuppressed-antibiotic-eligibility.v1",
    "sourceView": "topic-batch3-colon-diverticular-lower-bleeding",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colon-diverticular-lower-bleeding.ongoing-bleeding-cta.v1",
    "caseId": "case.topic.colon-diverticular-lower-bleeding.ongoing-hemorrhage-review.v1",
    "nodeId": "node.topic.colon-diverticular-lower-bleeding.ongoing-bleeding-cta.v1",
    "questionVariantId": "question.topic.colon-diverticular-lower-bleeding.ongoing-bleeding-cta.v1",
    "conceptId": "concept.colon-diverticular-lower-bleeding.ongoing-bleeding-localization.v1",
    "sourceView": "topic-batch3-colon-diverticular-lower-bleeding",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colon-diverticular-lower-bleeding.positive-cta-embolization.v1",
    "caseId": "case.topic.colon-diverticular-lower-bleeding.ongoing-hemorrhage-review.v1",
    "nodeId": "node.topic.colon-diverticular-lower-bleeding.positive-cta-embolization.v1",
    "questionVariantId": "question.topic.colon-diverticular-lower-bleeding.positive-cta-embolization.v1",
    "conceptId": "concept.colon-diverticular-lower-bleeding.embolization-selection.v1",
    "sourceView": "topic-batch3-colon-diverticular-lower-bleeding",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colon-diverticular-lower-bleeding.rebleed-after-clipping.v1",
    "caseId": "case.topic.colon-diverticular-lower-bleeding.recurrent-localized-hemorrhage.v1",
    "nodeId": "node.topic.colon-diverticular-lower-bleeding.rebleed-after-clipping.v1",
    "questionVariantId": "question.topic.colon-diverticular-lower-bleeding.rebleed-after-clipping.v1",
    "conceptId": "concept.colon-diverticular-lower-bleeding.embolization-selection.v1",
    "sourceView": "topic-batch3-colon-diverticular-lower-bleeding",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colon-diverticular-lower-bleeding.localized-surgical-rescue.v2",
    "caseId": "case.topic.colon-diverticular-lower-bleeding.recurrent-localized-hemorrhage.v1",
    "nodeId": "node.topic.colon-diverticular-lower-bleeding.localized-surgical-rescue.v2",
    "questionVariantId": "question.topic.colon-diverticular-lower-bleeding.localized-surgical-rescue.v2",
    "conceptId": "concept.colon-diverticular-lower-bleeding.localized-bleeding-resection.v1",
    "sourceView": "topic-batch3-colon-diverticular-lower-bleeding",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colon-diverticular-lower-bleeding.high-risk-hartmann.v1",
    "caseId": "case.topic.colon-diverticular-lower-bleeding.high-risk-reconstruction.v1",
    "nodeId": "node.topic.colon-diverticular-lower-bleeding.high-risk-hartmann.v1",
    "questionVariantId": "question.topic.colon-diverticular-lower-bleeding.high-risk-hartmann.v1",
    "conceptId": "concept.colon-diverticular-lower-bleeding.emergency-reconstruction.v1",
    "sourceView": "topic-batch3-colon-diverticular-lower-bleeding",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colon-diverticular-lower-bleeding.continue-secondary-aspirin.v1",
    "caseId": "case.topic.colon-diverticular-lower-bleeding.secondary-prevention-aspirin.v1",
    "nodeId": "node.topic.colon-diverticular-lower-bleeding.continue-secondary-aspirin.v1",
    "questionVariantId": "question.topic.colon-diverticular-lower-bleeding.continue-secondary-aspirin.v1",
    "conceptId": "concept.colon-diverticular-lower-bleeding.secondary-prevention-aspirin.v1",
    "sourceView": "topic-batch3-colon-diverticular-lower-bleeding",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colon-diverticular-lower-bleeding.flat-vascular-lesion-treatment.v2",
    "caseId": "case.topic.colon-diverticular-lower-bleeding.vascular-lesion-review.v1",
    "nodeId": "node.topic.colon-diverticular-lower-bleeding.flat-vascular-lesion-treatment.v2",
    "questionVariantId": "question.topic.colon-diverticular-lower-bleeding.flat-vascular-lesion-treatment.v2",
    "conceptId": "concept.colon-diverticular-lower-bleeding.angioectasia-hemostasis.v1",
    "sourceView": "topic-batch3-colon-diverticular-lower-bleeding",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-head-spine-extremities.focal-change-ct.v2",
    "caseId": "case.topic.trauma-head-spine-extremities.gcs-trajectory.v1",
    "nodeId": "node.topic.trauma-head-spine-extremities.focal-change-ct.v2",
    "questionVariantId": "question.topic.trauma-head-spine-extremities.focal-change-ct.v2",
    "conceptId": "concept.n2r3.focal-change-despite-best-gcs",
    "sourceView": "topic-batch3-trauma-head-spine-extremities",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-head-spine-extremities.acute-sdh-evacuation.v1",
    "caseId": "case.topic.trauma-head-spine-extremities.gcs-trajectory.v1",
    "nodeId": "node.topic.trauma-head-spine-extremities.acute-sdh-evacuation.v1",
    "questionVariantId": "question.topic.trauma-head-spine-extremities.acute-sdh-evacuation.v1",
    "conceptId": "concept.topic.trauma-head-spine-extremities.acute-sdh-evacuation.v1",
    "sourceView": "topic-batch3-trauma-head-spine-extremities",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-head-spine-extremities.limb-vascular-imaging.v1",
    "caseId": "case.topic.trauma-head-spine-extremities.limb-arterial.v1",
    "nodeId": "node.topic.trauma-head-spine-extremities.limb-vascular-imaging.v1",
    "questionVariantId": "question.topic.trauma-head-spine-extremities.limb-vascular-imaging.v1",
    "conceptId": "concept.topic.trauma-head-spine-extremities.limb-vascular-imaging.v1",
    "sourceView": "topic-batch3-trauma-head-spine-extremities",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-head-spine-extremities.limb-shunt-before-fixation.v1",
    "caseId": "case.topic.trauma-head-spine-extremities.limb-arterial.v1",
    "nodeId": "node.topic.trauma-head-spine-extremities.limb-shunt-before-fixation.v1",
    "questionVariantId": "question.topic.trauma-head-spine-extremities.limb-shunt-before-fixation.v1",
    "conceptId": "concept.topic.trauma-head-spine-extremities.limb-shunt-before-fixation.v1",
    "sourceView": "topic-batch3-trauma-head-spine-extremities",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-head-spine-extremities.limb-normal-abi-disposition.v2",
    "caseId": "case.topic.trauma-head-spine-extremities.penetrating-normal.v1",
    "nodeId": "node.topic.trauma-head-spine-extremities.limb-normal-abi-disposition.v2",
    "questionVariantId": "question.topic.trauma-head-spine-extremities.limb-normal-abi-disposition.v2",
    "conceptId": "concept.topic.trauma-head-spine-extremities.limb-vascular-imaging.v1",
    "sourceView": "topic-batch3-trauma-head-spine-extremities",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.positive-likelihood-ratio.v1",
    "caseId": "case.topic.statistics.positive-likelihood-ratio.v1",
    "nodeId": "node.topic.statistics.positive-likelihood-ratio.v1",
    "questionVariantId": "question.topic.statistics.positive-likelihood-ratio.v1",
    "conceptId": "concept.n2.positive-likelihood-ratio",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.number-needed-to-harm.v1",
    "caseId": "case.topic.statistics.number-needed-to-harm.v1",
    "nodeId": "node.topic.statistics.number-needed-to-harm.v1",
    "questionVariantId": "question.topic.statistics.number-needed-to-harm.v1",
    "conceptId": "concept.n2.number-needed-to-harm",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.paired-binary-test.v1",
    "caseId": "case.topic.statistics.paired-binary-test.v1",
    "nodeId": "node.topic.statistics.paired-binary-test.v1",
    "questionVariantId": "question.topic.statistics.paired-binary-test.v1",
    "conceptId": "concept.n2.mcnemar-paired-binary-outcomes",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.equivalence-interval.v2",
    "caseId": "case.topic.statistics.equivalence-interval.v2",
    "nodeId": "node.topic.statistics.equivalence-interval.v2",
    "questionVariantId": "question.topic.statistics.equivalence-interval.v2",
    "conceptId": "concept.n2.equivalence-margin-versus-null-test",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.standardized-risk.v1",
    "caseId": "case.topic.statistics.standardized-risk.v1",
    "nodeId": "node.topic.statistics.standardized-risk.v1",
    "questionVariantId": "question.topic.statistics.standardized-risk.v1",
    "conceptId": "concept.n2.case-mix-standardized-risk",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.post-test-probability.v1",
    "caseId": "case.topic.statistics.post-test-probability.v1",
    "nodeId": "node.topic.statistics.post-test-probability.v1",
    "questionVariantId": "question.topic.statistics.post-test-probability.v1",
    "conceptId": "concept.topic.statistics.post-test-probability.v1",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.incidence-proportion.v1",
    "caseId": "case.topic.statistics.incidence-proportion.v1",
    "nodeId": "node.topic.statistics.incidence-proportion.v1",
    "questionVariantId": "question.topic.statistics.incidence-proportion.v1",
    "conceptId": "concept.topic.statistics.incidence-proportion.v1",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.person-time-rate.v1",
    "caseId": "case.topic.statistics.person-time-rate.v1",
    "nodeId": "node.topic.statistics.person-time-rate.v1",
    "questionVariantId": "question.topic.statistics.person-time-rate.v1",
    "conceptId": "concept.topic.statistics.person-time-rate.v1",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.point-prevalence.v1",
    "caseId": "case.topic.statistics.point-prevalence.v1",
    "nodeId": "node.topic.statistics.point-prevalence.v1",
    "questionVariantId": "question.topic.statistics.point-prevalence.v1",
    "conceptId": "concept.topic.statistics.point-prevalence.v1",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.standard-error.v1",
    "caseId": "case.topic.statistics.standard-error.v1",
    "nodeId": "node.topic.statistics.standard-error.v1",
    "questionVariantId": "question.topic.statistics.standard-error.v1",
    "conceptId": "concept.topic.statistics.standard-error.v1",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.interval-width-sample-size.v1",
    "caseId": "case.topic.statistics.interval-width-sample-size.v1",
    "nodeId": "node.topic.statistics.interval-width-sample-size.v1",
    "questionVariantId": "question.topic.statistics.interval-width-sample-size.v1",
    "conceptId": "concept.statistics-ethics.confidence-interval",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.detect-smaller-effect.v1",
    "caseId": "case.topic.statistics.detect-smaller-effect.v1",
    "nodeId": "node.topic.statistics.detect-smaller-effect.v1",
    "questionVariantId": "question.topic.statistics.detect-smaller-effect.v1",
    "conceptId": "concept.topic.statistics.sample-size-effect.v1",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.confidence-level.v2",
    "caseId": "case.topic.statistics.confidence-level.v2",
    "nodeId": "node.topic.statistics.confidence-level.v2",
    "questionVariantId": "question.topic.statistics.confidence-level.v2",
    "conceptId": "concept.statistics-ethics.confidence-interval",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.intention-to-treat.v1",
    "caseId": "case.topic.statistics.intention-to-treat.v1",
    "nodeId": "node.topic.statistics.intention-to-treat.v1",
    "questionVariantId": "question.topic.statistics.intention-to-treat.v1",
    "conceptId": "concept.topic.statistics.intention-to-treat.v1",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.allocation-concealment.v1",
    "caseId": "case.topic.statistics.allocation-concealment.v1",
    "nodeId": "node.topic.statistics.allocation-concealment.v1",
    "questionVariantId": "question.topic.statistics.allocation-concealment.v1",
    "conceptId": "concept.topic.statistics.allocation-concealment.v1",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.multiplicity.v1",
    "caseId": "case.topic.statistics.multiplicity.v1",
    "nodeId": "node.topic.statistics.multiplicity.v1",
    "questionVariantId": "question.topic.statistics.multiplicity.v1",
    "conceptId": "concept.topic.statistics.multiplicity.v1",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.stratified-confounding.v2",
    "caseId": "case.topic.statistics.stratified-confounding.v2",
    "nodeId": "node.topic.statistics.stratified-confounding.v2",
    "questionVariantId": "question.topic.statistics.stratified-confounding.v2",
    "conceptId": "concept.statistics-ethics.bias-confounding",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.effect-modification.v1",
    "caseId": "case.topic.statistics.effect-modification.v1",
    "nodeId": "node.topic.statistics.effect-modification.v1",
    "questionVariantId": "question.topic.statistics.effect-modification.v1",
    "conceptId": "concept.topic.statistics.effect-modification.v1",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.discordant-pairs.v1",
    "caseId": "case.topic.statistics.discordant-pairs.v1",
    "nodeId": "node.topic.statistics.discordant-pairs.v1",
    "questionVariantId": "question.topic.statistics.discordant-pairs.v1",
    "conceptId": "concept.n2.mcnemar-paired-binary-outcomes",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.right-censoring.v1",
    "caseId": "case.topic.statistics.right-censoring.v1",
    "nodeId": "node.topic.statistics.right-censoring.v1",
    "questionVariantId": "question.topic.statistics.right-censoring.v1",
    "conceptId": "concept.topic.statistics.right-censoring.v1",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.kaplan-meier-step.v1",
    "caseId": "case.topic.statistics.kaplan-meier-step.v1",
    "nodeId": "node.topic.statistics.kaplan-meier-step.v1",
    "questionVariantId": "question.topic.statistics.kaplan-meier-step.v1",
    "conceptId": "concept.topic.statistics.kaplan-meier-step.v1",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.lead-time-bias.v1",
    "caseId": "case.topic.statistics.lead-time-bias.v1",
    "nodeId": "node.topic.statistics.lead-time-bias.v1",
    "questionVariantId": "question.topic.statistics.lead-time-bias.v1",
    "conceptId": "concept.topic.statistics.lead-time-bias.v1",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.logistic-model.v1",
    "caseId": "case.topic.statistics.logistic-model.v1",
    "nodeId": "node.topic.statistics.logistic-model.v1",
    "questionVariantId": "question.topic.statistics.logistic-model.v1",
    "conceptId": "concept.topic.statistics.logistic-model.v1",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.statistics.length-time-bias.v2",
    "caseId": "case.topic.statistics.length-time-bias.v2",
    "nodeId": "node.topic.statistics.length-time-bias.v2",
    "questionVariantId": "question.topic.statistics.length-time-bias.v2",
    "conceptId": "concept.topic.statistics.length-time-bias.v1",
    "sourceView": "topic-batch3-statistics",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-acute-pancreatitis.fluid-overload.v1",
    "caseId": "case.topic.pancreas-acute-pancreatitis.fluid-overload.pass1",
    "nodeId": "node.topic.pancreas-acute-pancreatitis.fluid-overload.v1",
    "questionVariantId": "question.topic.pancreas-acute-pancreatitis.fluid-overload.v1",
    "conceptId": "concept.pancreas-acute-pancreatitis.volume-overload-fluid-reassessment.v1",
    "sourceView": "topic-batch3-pancreas-acute-pancreatitis",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-acute-pancreatitis.refractory-compartment.v1",
    "caseId": "case.topic.pancreas-acute-pancreatitis.refractory-compartment.pass1",
    "nodeId": "node.topic.pancreas-acute-pancreatitis.refractory-compartment.v1",
    "questionVariantId": "question.topic.pancreas-acute-pancreatitis.refractory-compartment.v1",
    "conceptId": "concept.pancreas-acute-pancreatitis.refractory-compartment-decompression.v1",
    "sourceView": "topic-batch3-pancreas-acute-pancreatitis",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-acute-pancreatitis.sterile-necrosis-antibiotics.v1.r2",
    "caseId": "case.topic.pancreas-acute-pancreatitis.sterile-necrosis-antibiotics.review1",
    "nodeId": "node.topic.pancreas-acute-pancreatitis.sterile-necrosis-antibiotics.v1.r2",
    "questionVariantId": "question.topic.pancreas-acute-pancreatitis.sterile-necrosis-antibiotics.v1.r2",
    "conceptId": "concept.pancreas-acute-pancreatitis.necrosis-no-prophylactic-antibiotics.v1",
    "sourceView": "topic-batch3-pancreas-acute-pancreatitis",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-acute-pancreatitis.enteral-before-parenteral.v1.r2",
    "caseId": "case.topic.pancreas-acute-pancreatitis.enteral-before-parenteral.review1",
    "nodeId": "node.topic.pancreas-acute-pancreatitis.enteral-before-parenteral.v1.r2",
    "questionVariantId": "question.topic.pancreas-acute-pancreatitis.enteral-before-parenteral.v1.r2",
    "conceptId": "concept.pancreas-acute-pancreatitis.ileus-parenteral-support.v1",
    "sourceView": "topic-batch3-pancreas-acute-pancreatitis",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-acute-pancreatitis.gastric-intolerance.v1.r2",
    "caseId": "case.topic.pancreas-acute-pancreatitis.gastric-intolerance.review1",
    "nodeId": "node.topic.pancreas-acute-pancreatitis.gastric-intolerance.v1.r2",
    "questionVariantId": "question.topic.pancreas-acute-pancreatitis.gastric-intolerance.v1.r2",
    "conceptId": "concept.pancreas-acute-pancreatitis.gastric-intolerance-postpyloric-feeding.v1",
    "sourceView": "topic-batch3-pancreas-acute-pancreatitis",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-acute-pancreatitis.moderate-resuscitation.v1.r2",
    "caseId": "case.topic.pancreas-acute-pancreatitis.moderate-resuscitation.review1",
    "nodeId": "node.topic.pancreas-acute-pancreatitis.moderate-resuscitation.v1.r2",
    "questionVariantId": "question.topic.pancreas-acute-pancreatitis.moderate-resuscitation.v1.r2",
    "conceptId": "concept.pancreas-acute-pancreatitis.moderate-crystalloid-resuscitation.v1",
    "sourceView": "topic-batch3-pancreas-acute-pancreatitis",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-acute-pancreatitis.responding-infected-necrosis.v1.r2",
    "caseId": "case.topic.pancreas-acute-pancreatitis.responding-infected-necrosis.review1",
    "nodeId": "node.topic.pancreas-acute-pancreatitis.responding-infected-necrosis.v1.r2",
    "questionVariantId": "question.topic.pancreas-acute-pancreatitis.responding-infected-necrosis.v1.r2",
    "conceptId": "concept.pancreas-acute-pancreatitis.responsive-infected-necrosis-delay.v1",
    "sourceView": "topic-batch3-pancreas-acute-pancreatitis",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-acute-pancreatitis.deteriorating-early-necrosis.v1.r2",
    "caseId": "case.topic.pancreas-acute-pancreatitis.deteriorating-early-necrosis.review1",
    "nodeId": "node.topic.pancreas-acute-pancreatitis.deteriorating-early-necrosis.v1.r2",
    "questionVariantId": "question.topic.pancreas-acute-pancreatitis.deteriorating-early-necrosis.v1.r2",
    "conceptId": "concept.pancreas-acute-pancreatitis.early-infected-necrosis-source-control.v1",
    "sourceView": "topic-batch3-pancreas-acute-pancreatitis",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-acute-pancreatitis.failed-drainage-vard.v1.r2",
    "caseId": "case.topic.pancreas-acute-pancreatitis.failed-drainage-vard.review1",
    "nodeId": "node.topic.pancreas-acute-pancreatitis.failed-drainage-vard.v1.r2",
    "questionVariantId": "question.topic.pancreas-acute-pancreatitis.failed-drainage-vard.v1.r2",
    "conceptId": "concept.pancreas-acute-pancreatitis.adequate-drainage-failure-necrosectomy.v1",
    "sourceView": "topic-batch3-pancreas-acute-pancreatitis",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.bowel-ibd-malabsorption-short-bowel.celiac-panel.v1",
    "caseId": "case.topic.bowel-ibd-malabsorption-short-bowel.celiac-record.v2",
    "nodeId": "node.topic.bowel-ibd-malabsorption-short-bowel.celiac-panel.v1",
    "questionVariantId": "question.topic.bowel-ibd-malabsorption-short-bowel.celiac-panel.v1",
    "conceptId": "concept.n1r3.celiac-risk-panel-validation",
    "sourceView": "topic-batch3-bowel-ibd-malabsorption-short-bowel",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-abscess.v1",
    "caseId": "case.topic.bowel-ibd-malabsorption-short-bowel.crohn-penetrating-course.v2",
    "nodeId": "node.topic.bowel-ibd-malabsorption-short-bowel.crohn-abscess.v1",
    "questionVariantId": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-abscess.v1",
    "conceptId": "concept.bowel-ibd-malabsorption-short-bowel.crohn-abscess-source-control.v1",
    "sourceView": "topic-batch3-bowel-ibd-malabsorption-short-bowel",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-fistula-stricture.v1",
    "caseId": "case.topic.bowel-ibd-malabsorption-short-bowel.crohn-penetrating-course.v2",
    "nodeId": "node.topic.bowel-ibd-malabsorption-short-bowel.crohn-fistula-stricture.v1",
    "questionVariantId": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-fistula-stricture.v1",
    "conceptId": "concept.bowel-ibd-malabsorption-short-bowel.crohn-persistent-fistula-stenosis.v1",
    "sourceView": "topic-batch3-bowel-ibd-malabsorption-short-bowel",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-strictureplasty.v1",
    "caseId": "case.topic.bowel-ibd-malabsorption-short-bowel.crohn-bowel-preservation.v1",
    "nodeId": "node.topic.bowel-ibd-malabsorption-short-bowel.crohn-strictureplasty.v1",
    "questionVariantId": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-strictureplasty.v1",
    "conceptId": "concept.bowel-ibd-malabsorption-short-bowel.crohn-multifocal-strictureplasty.v1",
    "sourceView": "topic-batch3-bowel-ibd-malabsorption-short-bowel",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.bowel-ibd-malabsorption-short-bowel.uc-visible-dysplasia.v1",
    "caseId": "case.topic.bowel-ibd-malabsorption-short-bowel.uc-dysplasia-course.v2",
    "nodeId": "node.topic.bowel-ibd-malabsorption-short-bowel.uc-visible-dysplasia.v1",
    "questionVariantId": "question.topic.bowel-ibd-malabsorption-short-bowel.uc-visible-dysplasia.v1",
    "conceptId": "concept.bowel-ibd-malabsorption-short-bowel.uc-completely-resected-visible-dysplasia.v1",
    "sourceView": "topic-batch3-bowel-ibd-malabsorption-short-bowel",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  
  {
    "acceptanceId": "question.topic.bowel-ibd-malabsorption-short-bowel.jejunal-gist-resection.v2",
    "caseId": "case.topic.bowel-ibd-malabsorption-short-bowel.jejunal-gist-resection-review.v2",
    "nodeId": "node.topic.bowel-ibd-malabsorption-short-bowel.jejunal-gist-resection.v2",
    "questionVariantId": "question.topic.bowel-ibd-malabsorption-short-bowel.jejunal-gist-resection.v2",
    "conceptId": "concept.bowel-ibd-malabsorption-short-bowel.small-bowel-gist-resection-principles.v2",
    "sourceView": "topic-batch3-bowel-ibd-malabsorption-short-bowel",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.bowel-ibd-malabsorption-short-bowel.uc-staged-colectomy.v2",
    "caseId": "case.topic.bowel-ibd-malabsorption-short-bowel.uc-staged-colectomy-review.v2",
    "nodeId": "node.topic.bowel-ibd-malabsorption-short-bowel.uc-staged-colectomy.v2",
    "questionVariantId": "question.topic.bowel-ibd-malabsorption-short-bowel.uc-staged-colectomy.v2",
    "conceptId": "concept.bowel-ibd-malabsorption-short-bowel.uc-severe-initial-colectomy.v1",
    "sourceView": "topic-batch3-bowel-ibd-malabsorption-short-bowel",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.bowel-ibd-malabsorption-short-bowel.pouch-localize.v2",
    "caseId": "case.topic.bowel-ibd-malabsorption-short-bowel.pouch-localize-review.v2",
    "nodeId": "node.topic.bowel-ibd-malabsorption-short-bowel.pouch-localize.v2",
    "questionVariantId": "question.topic.bowel-ibd-malabsorption-short-bowel.pouch-localize.v2",
    "conceptId": "concept.bowel-ibd-malabsorption-short-bowel.pouch-nonresponse-endoscopic-assessment.v1",
    "sourceView": "topic-batch3-bowel-ibd-malabsorption-short-bowel",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.hyperkalaemia.severe-community-result-transfer.v1.topic20261111.v1",
    "caseId": "case.topic.fluids-electrolytes-acid-base.potassium-callback.v1",
    "nodeId": "node.topic.fluids-electrolytes-acid-base.potassium-provenance.v1",
    "questionVariantId": "question.hyperkalaemia.severe-community-result-transfer.v1.topic20261111.v1",
    "conceptId": "concept.hyperkalaemia.severe-community-result-transfer",
    "sourceView": "topic-batch3-fluids-electrolytes-acid-base",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r2.topic20261111.v2",
    "caseId": "case.topic.fluids-electrolytes-acid-base.current-corrected-gap.r2",
    "nodeId": "node.topic.fluids-electrolytes-acid-base.current-corrected-gap.v2",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r2.topic20261111.v2",
    "conceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
    "sourceView": "topic-batch3-fluids-electrolytes-acid-base",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.fluids-electrolytes-acid-base.hyponatraemia-loss-replacement.v2",
    "caseId": "case.topic.fluids-electrolytes-acid-base.hyponatraemia-loss-replacement.r2",
    "nodeId": "node.topic.fluids-electrolytes-acid-base.hyponatraemia-loss-replacement.v2",
    "questionVariantId": "question.topic.fluids-electrolytes-acid-base.hyponatraemia-loss-replacement.v2",
    "conceptId": "concept.topic.fluids-electrolytes-acid-base.hyponatraemia-loss-replacement.v1",
    "sourceView": "topic-batch3-fluids-electrolytes-acid-base",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.fluids-electrolytes-acid-base.siad-fluid-plan.v1",
    "caseId": "case.topic.fluids-electrolytes-acid-base.retained-water.v1",
    "nodeId": "node.topic.fluids-electrolytes-acid-base.siad-fluid-plan.v1",
    "questionVariantId": "question.topic.fluids-electrolytes-acid-base.siad-fluid-plan.v1",
    "conceptId": "concept.topic.fluids-electrolytes-acid-base.siad-fluid-plan.v1",
    "sourceView": "topic-batch3-fluids-electrolytes-acid-base",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.fluids-electrolytes-acid-base.gastric-chloride-replacement.v2",
    "caseId": "case.topic.fluids-electrolytes-acid-base.gastric-chloride-replacement.r2",
    "nodeId": "node.topic.fluids-electrolytes-acid-base.gastric-chloride-replacement.v2",
    "questionVariantId": "question.topic.fluids-electrolytes-acid-base.gastric-chloride-replacement.v2",
    "conceptId": "concept.topic.fluids-electrolytes-acid-base.gastric-chloride-replacement.v1",
    "sourceView": "topic-batch3-fluids-electrolytes-acid-base",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.fluids-electrolytes-acid-base.dka-potassium-sequence.v2",
    "caseId": "case.topic.fluids-electrolytes-acid-base.dka-potassium-sequence.r2",
    "nodeId": "node.topic.fluids-electrolytes-acid-base.dka-potassium-sequence.v2",
    "questionVariantId": "question.topic.fluids-electrolytes-acid-base.dka-potassium-sequence.v2",
    "conceptId": "concept.topic.fluids-electrolytes-acid-base.dka-potassium-sequence.v2",
    "sourceView": "topic-batch3-fluids-electrolytes-acid-base",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.fluids-electrolytes-acid-base.dka-resolution-transition.v1",
    "caseId": "case.topic.fluids-electrolytes-acid-base.dka-transition-pass-standalone.r2",
    "nodeId": "node.topic.fluids-electrolytes-acid-base.dka-resolution-transition.v1",
    "questionVariantId": "question.topic.fluids-electrolytes-acid-base.dka-resolution-transition.v1",
    "conceptId": "concept.topic.fluids-electrolytes-acid-base.dka-resolution-transition.v1",
    "sourceView": "topic-batch3-fluids-electrolytes-acid-base",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.fluids-electrolytes-acid-base.hhs-tonicity-response.v2",
    "caseId": "case.topic.fluids-electrolytes-acid-base.hhs-tonicity-response.r2",
    "nodeId": "node.topic.fluids-electrolytes-acid-base.hhs-tonicity-response.v2",
    "questionVariantId": "question.topic.fluids-electrolytes-acid-base.hhs-tonicity-response.v2",
    "conceptId": "concept.topic.fluids-electrolytes-acid-base.hhs-tonicity-response.v1",
    "sourceView": "topic-batch3-fluids-electrolytes-acid-base",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hematology-transfusion-coagulation.anemia-gi-evaluation.v1",
    "caseId": "case.topic.hematology-transfusion-coagulation.anemia.v1",
    "nodeId": "node.topic.hematology-transfusion-coagulation.anemia-gi-evaluation.v1",
    "questionVariantId": "question.topic.hematology-transfusion-coagulation.anemia-gi-evaluation.v1",
    "conceptId": "concept.iron-deficiency.gi-evaluation",
    "sourceView": "topic-batch3-hematology-transfusion-coagulation",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hematology-transfusion-coagulation.vka-factor-replacement.v2",
    "caseId": "case.topic.hematology-transfusion-coagulation.vka-factor-replacement.v2",
    "nodeId": "node.topic.hematology-transfusion-coagulation.vka-factor-replacement.v2",
    "questionVariantId": "question.topic.hematology-transfusion-coagulation.vka-factor-replacement.v2",
    "conceptId": "concept.topic.hematology-transfusion-coagulation.vka-factor-replacement.v2",
    "sourceView": "topic-batch3-hematology-transfusion-coagulation",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hematology-transfusion-coagulation.transfusion-calcium.v2",
    "caseId": "case.topic.hematology-transfusion-coagulation.transfusion-calcium.v2",
    "nodeId": "node.topic.hematology-transfusion-coagulation.transfusion-calcium.v2",
    "questionVariantId": "question.topic.hematology-transfusion-coagulation.transfusion-calcium.v2",
    "conceptId": "concept.topic.hematology-transfusion-coagulation.transfusion-calcium.v2",
    "sourceView": "topic-batch3-hematology-transfusion-coagulation",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hematology-transfusion-coagulation.platelet-product.v2",
    "caseId": "case.topic.hematology-transfusion-coagulation.platelet-product.v2",
    "nodeId": "node.topic.hematology-transfusion-coagulation.platelet-product.v2",
    "questionVariantId": "question.topic.hematology-transfusion-coagulation.platelet-product.v2",
    "conceptId": "concept.topic.hematology-transfusion-coagulation.platelet-product.v2",
    "sourceView": "topic-batch3-hematology-transfusion-coagulation",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hematology-transfusion-coagulation.taco-next-transfusion.v2",
    "caseId": "case.topic.hematology-transfusion-coagulation.taco-next-transfusion.v2",
    "nodeId": "node.topic.hematology-transfusion-coagulation.taco-next-transfusion.v2",
    "questionVariantId": "question.topic.hematology-transfusion-coagulation.taco-next-transfusion.v2",
    "conceptId": "concept.topic.hematology-transfusion-coagulation.taco-next-transfusion.v1",
    "sourceView": "topic-batch3-hematology-transfusion-coagulation",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hematology-transfusion-coagulation.antigen-compatible-rbc.v2",
    "caseId": "case.topic.hematology-transfusion-coagulation.antigen-compatible-rbc.v2",
    "nodeId": "node.topic.hematology-transfusion-coagulation.antigen-compatible-rbc.v2",
    "questionVariantId": "question.topic.hematology-transfusion-coagulation.antigen-compatible-rbc.v2",
    "conceptId": "concept.topic.hematology-transfusion-coagulation.antigen-compatible-rbc.v1",
    "sourceView": "topic-batch3-hematology-transfusion-coagulation",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hematology-transfusion-coagulation.hit-initial-action.v2",
    "caseId": "case.topic.hematology-transfusion-coagulation.hit-initial-action.v2",
    "nodeId": "node.topic.hematology-transfusion-coagulation.hit-initial-action.v2",
    "questionVariantId": "question.topic.hematology-transfusion-coagulation.hit-initial-action.v2",
    "conceptId": "concept.topic.hematology-transfusion-coagulation.hit-initial-action.v1",
    "sourceView": "topic-batch3-hematology-transfusion-coagulation",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hematology-transfusion-coagulation.hit-functional-confirmation.v2",
    "caseId": "case.topic.hematology-transfusion-coagulation.hit-functional-confirmation.v2",
    "nodeId": "node.topic.hematology-transfusion-coagulation.hit-functional-confirmation.v2",
    "questionVariantId": "question.topic.hematology-transfusion-coagulation.hit-functional-confirmation.v2",
    "conceptId": "concept.topic.hematology-transfusion-coagulation.hit-functional-confirmation.v2",
    "sourceView": "topic-batch3-hematology-transfusion-coagulation",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hematology-transfusion-coagulation.vwd-major-plan.v2",
    "caseId": "case.topic.hematology-transfusion-coagulation.vwd-major-plan.v2",
    "nodeId": "node.topic.hematology-transfusion-coagulation.vwd-major-plan.v2",
    "questionVariantId": "question.topic.hematology-transfusion-coagulation.vwd-major-plan.v2",
    "conceptId": "concept.topic.hematology-transfusion-coagulation.vwd-major-plan.v2",
    "sourceView": "topic-batch3-hematology-transfusion-coagulation",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hematology-transfusion-coagulation.marrow-reassessment.v2",
    "caseId": "case.topic.hematology-transfusion-coagulation.marrow-reassessment.v2",
    "nodeId": "node.topic.hematology-transfusion-coagulation.marrow-reassessment.v2",
    "questionVariantId": "question.topic.hematology-transfusion-coagulation.marrow-reassessment.v2",
    "conceptId": "concept.itp.changed-lineage-pattern-before-treatment.v1",
    "sourceView": "topic-batch3-hematology-transfusion-coagulation",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hematology-transfusion-coagulation.cholestasis-correction.v2",
    "caseId": "case.topic.hematology-transfusion-coagulation.cholestasis-correction.v2",
    "nodeId": "node.topic.hematology-transfusion-coagulation.cholestasis-correction.v2",
    "questionVariantId": "question.topic.hematology-transfusion-coagulation.cholestasis-correction.v2",
    "conceptId": "concept.topic.hematology-transfusion-coagulation.cholestasis-correction.v1",
    "sourceView": "topic-batch3-hematology-transfusion-coagulation",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.parathyroid-calcium.r02.v1",
    "caseId": "case.topic.parathyroid-calcium.repeated-calcium.v1",
    "nodeId": "node.topic.parathyroid-calcium.r02.v1",
    "questionVariantId": "question.topic.parathyroid-calcium.r02.v1",
    "conceptId": "concept.primary-hyperparathyroidism.symptomatic-surgery-assessment",
    "sourceView": "topic-batch3-parathyroid-calcium",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.parathyroid-calcium.r04.v1",
    "caseId": "case.topic.parathyroid-calcium.age-biochemistry.v1",
    "nodeId": "node.topic.parathyroid-calcium.r04.v1",
    "questionVariantId": "question.topic.parathyroid-calcium.r04.v1",
    "conceptId": "concept.asymptomatic-phpt.age-based-surgery",
    "sourceView": "topic-batch3-parathyroid-calcium",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.parathyroid-calcium.n02.v1",
    "caseId": "case.topic.parathyroid-calcium.urine-confound.v1",
    "nodeId": "node.topic.parathyroid-calcium.n02.v1",
    "questionVariantId": "question.topic.parathyroid-calcium.n02.v1",
    "conceptId": "concept.fhh.recognition-and-confirmation",
    "sourceView": "topic-batch3-parathyroid-calcium",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.parathyroid-calcium.n05.v1",
    "caseId": "case.topic.parathyroid-calcium.radial-density.v1",
    "nodeId": "node.topic.parathyroid-calcium.n05.v1",
    "questionVariantId": "question.topic.parathyroid-calcium.n05.v1",
    "conceptId": "concept.topic.parathyroid-calcium.cortical-operative-criterion.v1",
    "sourceView": "topic-batch3-parathyroid-calcium",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.parathyroid-calcium.n07.v1",
    "caseId": "case.topic.parathyroid-calcium.localization-conflict.v1",
    "nodeId": "node.topic.parathyroid-calcium.n07.v1",
    "questionVariantId": "question.topic.parathyroid-calcium.n07.v1",
    "conceptId": "concept.topic.parathyroid-calcium.nonlocalizing-operative-candidacy.v1",
    "sourceView": "topic-batch3-parathyroid-calcium",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.parathyroid-calcium.n18.v1",
    "caseId": "case.topic.parathyroid-calcium.invasive-neck-lesion.v1",
    "nodeId": "node.topic.parathyroid-calcium.n18.v1",
    "questionVariantId": "question.topic.parathyroid-calcium.n18.v1",
    "conceptId": "concept.topic.parathyroid-calcium.suspected-carcinoma-operative-extent.v1",
    "sourceView": "topic-batch3-parathyroid-calcium",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.parathyroid-calcium.n11.v2",
    "caseId": "case.topic.parathyroid-calcium.n11.v2",
    "nodeId": "node.topic.parathyroid-calcium.n11.v2",
    "questionVariantId": "question.topic.parathyroid-calcium.n11.v2",
    "conceptId": "concept.topic.parathyroid-calcium.normocalcemic-postoperative-pth.v1",
    "sourceView": "topic-batch3-parathyroid-calcium",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.parathyroid-calcium.n14.v2",
    "caseId": "case.topic.parathyroid-calcium.n14.v2",
    "nodeId": "node.topic.parathyroid-calcium.n14.v2",
    "questionVariantId": "question.topic.parathyroid-calcium.n14.v2",
    "conceptId": "concept.topic.parathyroid-calcium.renal-refractory-surgical-assessment.v1",
    "sourceView": "topic-batch3-parathyroid-calcium",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.parathyroid-calcium.n16.v2",
    "caseId": "case.topic.parathyroid-calcium.n16.v2",
    "nodeId": "node.topic.parathyroid-calcium.n16.v2",
    "questionVariantId": "question.topic.parathyroid-calcium.n16.v2",
    "conceptId": "concept.topic.parathyroid-calcium.bone-treatment-eligibility.v2",
    "sourceView": "topic-batch3-parathyroid-calcium",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.parathyroid-calcium.n17.v2",
    "caseId": "case.topic.parathyroid-calcium.n17.v2",
    "nodeId": "node.topic.parathyroid-calcium.n17.v2",
    "questionVariantId": "question.topic.parathyroid-calcium.n17.v2",
    "conceptId": "concept.topic.parathyroid-calcium.iopth-protocol-baseline.v1",
    "sourceView": "topic-batch3-parathyroid-calcium",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.nutrition-support-metabolism.oral-escalation.v1",
    "caseId": "case.topic.nutrition-support-metabolism.r2-preserved-oral-escalation.v2",
    "nodeId": "node.topic.nutrition-support-metabolism.oral-escalation.v1",
    "questionVariantId": "question.topic.nutrition-support-metabolism.oral-escalation.v1",
    "conceptId": "concept.preoperative-nutrition.oral-enteral-first-line",
    "sourceView": "topic-batch3-nutrition-support-metabolism",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.nutrition-support-metabolism.preop-nutrition-timing.v1",
    "caseId": "case.topic.nutrition-support-metabolism.severe-preoperative-risk.v1",
    "nodeId": "node.topic.nutrition-support-metabolism.preop-nutrition-timing.v1",
    "questionVariantId": "question.topic.nutrition-support-metabolism.preop-nutrition-timing.v1",
    "conceptId": "concept.nutrition-support-metabolism.severe-risk-operative-timing.v1",
    "sourceView": "topic-batch3-nutrition-support-metabolism",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.nutrition-support-metabolism.renal-protein-reference.v1",
    "caseId": "case.topic.nutrition-support-metabolism.r2-preserved-renal-protein-reference.v2",
    "nodeId": "node.topic.nutrition-support-metabolism.renal-protein-reference.v1",
    "questionVariantId": "question.topic.nutrition-support-metabolism.renal-protein-reference.v1",
    "conceptId": "concept.dialysis-nutrition.hospital-protein-target",
    "sourceView": "topic-batch3-nutrition-support-metabolism",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.nutrition-support-metabolism.swallow-versus-gut.v2",
    "caseId": "case.topic.nutrition-support-metabolism.r2-swallow-versus-gut.v2",
    "nodeId": "node.topic.nutrition-support-metabolism.swallow-versus-gut.v2",
    "questionVariantId": "question.topic.nutrition-support-metabolism.swallow-versus-gut.v2",
    "conceptId": "concept.n3.swallowing-failure-versus-intestinal-failure",
    "sourceView": "topic-batch3-nutrition-support-metabolism",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.nutrition-support-metabolism.gastric-aspiration-route.v1",
    "caseId": "case.topic.nutrition-support-metabolism.r2-preserved-gastric-aspiration-route.v2",
    "nodeId": "node.topic.nutrition-support-metabolism.gastric-aspiration-route.v1",
    "questionVariantId": "question.topic.nutrition-support-metabolism.gastric-aspiration-route.v1",
    "conceptId": "concept.nutrition.gastric-versus-postpyloric-delivery.v1",
    "sourceView": "topic-batch3-nutrition-support-metabolism",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.nutrition-support-metabolism.zinc-copper-assessment.v2",
    "caseId": "case.topic.nutrition-support-metabolism.r2-zinc-copper-assessment.v2",
    "nodeId": "node.topic.nutrition-support-metabolism.zinc-copper-assessment.v2",
    "questionVariantId": "question.topic.nutrition-support-metabolism.zinc-copper-assessment.v2",
    "conceptId": "concept.nutrition-support-metabolism.zinc-associated-copper-evaluation.v1",
    "sourceView": "topic-batch3-nutrition-support-metabolism",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.nutrition-support-metabolism.durable-enteral-access.v1",
    "caseId": "case.topic.nutrition-support-metabolism.home-access.v1",
    "nodeId": "node.topic.nutrition-support-metabolism.durable-enteral-access.v1",
    "questionVariantId": "question.topic.nutrition-support-metabolism.durable-enteral-access.v1",
    "conceptId": "concept.nutrition-support-metabolism.long-term-enteral-access-selection.v1",
    "sourceView": "topic-batch3-nutrition-support-metabolism",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.nutrition-support-metabolism.enteral-medication-review.v2",
    "caseId": "case.topic.nutrition-support-metabolism.r2-enteral-medication-review.v2",
    "nodeId": "node.topic.nutrition-support-metabolism.enteral-medication-review.v2",
    "questionVariantId": "question.topic.nutrition-support-metabolism.enteral-medication-review.v2",
    "conceptId": "concept.nutrition-support-metabolism.enteral-diarrhea-medication-formulation.v1",
    "sourceView": "topic-batch3-nutrition-support-metabolism",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.nutrition-support-metabolism.postoperative-route-after-swallow.v2",
    "caseId": "case.topic.nutrition-support-metabolism.r2-postoperative-route-after-swallow.v2",
    "nodeId": "node.topic.nutrition-support-metabolism.postoperative-route-after-swallow.v2",
    "questionVariantId": "question.topic.nutrition-support-metabolism.postoperative-route-after-swallow.v2",
    "conceptId": "concept.nutrition-support-metabolism.postoperative-oral-intake-tolerance.v1",
    "sourceView": "topic-batch3-nutrition-support-metabolism",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.nutrition-support-metabolism.renal-formula-reference-budget.v1",
    "caseId": "case.topic.nutrition-support-metabolism.renal-formula-repaired.v1",
    "nodeId": "node.topic.nutrition-support-metabolism.renal-formula-reference-budget.v1",
    "questionVariantId": "question.topic.nutrition-support-metabolism.renal-formula-reference-budget.v1",
    "conceptId": "concept.nutrition-support-metabolism.renal-formula-energy-protein-volume.v1",
    "sourceView": "topic-batch3-nutrition-support-metabolism",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-limb-mesenteric-arterial.nomi-operative-change.v1",
    "caseId": "case.vascular-limb-mesenteric-arterial.pass-nomi-operative-change.v2",
    "nodeId": "node.vascular-limb-mesenteric-arterial.nomi-operative-change.v1",
    "questionVariantId": "question.vascular-limb-mesenteric-arterial.nomi-operative-change.v1",
    "conceptId": "concept.acute-mesenteric-ischemia.peritonitis-exploration",
    "sourceView": "topic-batch3-vascular-limb-mesenteric-arterial",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-limb-mesenteric-arterial.ami-cta-normal-lactate.v1",
    "caseId": "case.vascular-limb-mesenteric-arterial.acute-mesenteric-course.v1",
    "nodeId": "node.vascular-limb-mesenteric-arterial.ami-cta-normal-lactate.v1",
    "questionVariantId": "question.vascular-limb-mesenteric-arterial.ami-cta-normal-lactate.v1",
    "conceptId": "concept.acute-mesenteric-ischemia.prompt-cta",
    "sourceView": "topic-batch3-vascular-limb-mesenteric-arterial",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-limb-mesenteric-arterial.peritonitis-exploration.v1",
    "caseId": "case.vascular-limb-mesenteric-arterial.acute-mesenteric-course.v1",
    "nodeId": "node.vascular-limb-mesenteric-arterial.peritonitis-exploration.v1",
    "questionVariantId": "question.vascular-limb-mesenteric-arterial.peritonitis-exploration.v1",
    "conceptId": "concept.acute-mesenteric-ischemia.peritonitis-exploration",
    "sourceView": "topic-batch3-vascular-limb-mesenteric-arterial",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-limb-mesenteric-arterial.bowel-staging.v1",
    "caseId": "case.vascular-limb-mesenteric-arterial.acute-mesenteric-course.v1",
    "nodeId": "node.vascular-limb-mesenteric-arterial.bowel-staging.v1",
    "questionVariantId": "question.vascular-limb-mesenteric-arterial.bowel-staging.v1",
    "conceptId": "concept.mesenteric-ischaemia.post-revascularization-bowel-staging.v1",
    "sourceView": "topic-batch3-vascular-limb-mesenteric-arterial",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-limb-mesenteric-arterial.mvt-heparin.v1",
    "caseId": "case.vascular-limb-mesenteric-arterial.pass-mvt-heparin.v2",
    "nodeId": "node.vascular-limb-mesenteric-arterial.mvt-heparin.v1",
    "questionVariantId": "question.vascular-limb-mesenteric-arterial.mvt-heparin.v1",
    "conceptId": "concept.mesenteric-ischaemia.venous-thrombosis-initial-pathway.v1",
    "sourceView": "topic-batch3-vascular-limb-mesenteric-arterial",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-limb-mesenteric-arterial.initial-abi.v1",
    "caseId": "case.vascular-limb-mesenteric-arterial.pass-initial-abi.v2",
    "nodeId": "node.vascular-limb-mesenteric-arterial.initial-abi.v1",
    "questionVariantId": "question.vascular-limb-mesenteric-arterial.initial-abi.v1",
    "conceptId": "concept.peripheral-arterial-disease.resting-abi",
    "sourceView": "topic-batch3-vascular-limb-mesenteric-arterial",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-limb-mesenteric-arterial.cfa-procedure.v1",
    "caseId": "case.vascular-limb-mesenteric-arterial.pass-cfa-procedure.v2",
    "nodeId": "node.vascular-limb-mesenteric-arterial.cfa-procedure.v1",
    "questionVariantId": "question.vascular-limb-mesenteric-arterial.cfa-procedure.v1",
    "conceptId": "concept.vascular-limb-mesenteric-arterial.common-femoral-profunda-preservation.v1",
    "sourceView": "topic-batch3-vascular-limb-mesenteric-arterial",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-limb-mesenteric-arterial.inflow-first.v1",
    "caseId": "case.vascular-limb-mesenteric-arterial.pass-inflow-first.v2",
    "nodeId": "node.vascular-limb-mesenteric-arterial.inflow-first.v1",
    "questionVariantId": "question.vascular-limb-mesenteric-arterial.inflow-first.v1",
    "conceptId": "concept.vascular-limb-mesenteric-arterial.multilevel-rest-pain-inflow-first.v1",
    "sourceView": "topic-batch3-vascular-limb-mesenteric-arterial",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-limb-mesenteric-arterial.exercise-exposure.v2",
    "caseId": "case.vascular-limb-mesenteric-arterial.r2-exercise-exposure.v2",
    "nodeId": "node.vascular-limb-mesenteric-arterial.exercise-exposure.v2",
    "questionVariantId": "question.vascular-limb-mesenteric-arterial.exercise-exposure.v2",
    "conceptId": "concept.peripheral-arterial-disease.structured-exercise",
    "sourceView": "topic-batch3-vascular-limb-mesenteric-arterial",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-limb-mesenteric-arterial.response-defer.v2",
    "caseId": "case.vascular-limb-mesenteric-arterial.r2-response-defer.v2",
    "nodeId": "node.vascular-limb-mesenteric-arterial.response-defer.v2",
    "questionVariantId": "question.vascular-limb-mesenteric-arterial.response-defer.v2",
    "conceptId": "concept.vascular-limb-mesenteric-arterial.functional-response-over-abi.v1",
    "sourceView": "topic-batch3-vascular-limb-mesenteric-arterial",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-limb-mesenteric-arterial.pad-antiplatelet.v2",
    "caseId": "case.vascular-limb-mesenteric-arterial.r2-pad-antiplatelet.v2",
    "nodeId": "node.vascular-limb-mesenteric-arterial.pad-antiplatelet.v2",
    "questionVariantId": "question.vascular-limb-mesenteric-arterial.pad-antiplatelet.v2",
    "conceptId": "concept.vascular-limb-mesenteric-arterial.pad-anticoagulation-indication.v2",
    "sourceView": "topic-batch3-vascular-limb-mesenteric-arterial",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-limb-mesenteric-arterial.cmi-after-duplex.v2",
    "caseId": "case.vascular-limb-mesenteric-arterial.r2-cmi-after-duplex.v2",
    "nodeId": "node.vascular-limb-mesenteric-arterial.cmi-after-duplex.v2",
    "questionVariantId": "question.vascular-limb-mesenteric-arterial.cmi-after-duplex.v2",
    "conceptId": "concept.chronic-mesenteric-ischemia.cta-diagnosis",
    "sourceView": "topic-batch3-vascular-limb-mesenteric-arterial",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-limb-mesenteric-arterial.ami-cta-aki.v2",
    "caseId": "case.vascular-limb-mesenteric-arterial.r2-ami-cta-aki.v2",
    "nodeId": "node.vascular-limb-mesenteric-arterial.ami-cta-aki.v2",
    "questionVariantId": "question.vascular-limb-mesenteric-arterial.ami-cta-aki.v2",
    "conceptId": "concept.acute-mesenteric-ischemia.prompt-cta",
    "sourceView": "topic-batch3-vascular-limb-mesenteric-arterial",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.stomach-ulcer-bleeding-motility.cure-calendar.v1",
    "caseId": "case.topic.stomach-ulcer-bleeding-motility.cure-collection-calendar.v1",
    "nodeId": "node.topic.stomach-ulcer-bleeding-motility.cure-calendar.v1",
    "questionVariantId": "question.topic.stomach-ulcer-bleeding-motility.cure-calendar.v1",
    "conceptId": "concept.h-pylori-ulcer.test-of-cure-plan",
    "sourceView": "topic-batch3-stomach-ulcer-bleeding-motility",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.stomach-ulcer-bleeding-motility.valid-cure-antibody.v1",
    "caseId": "case.topic.stomach-ulcer-bleeding-motility.cure-serology-disagreement.v1",
    "nodeId": "node.topic.stomach-ulcer-bleeding-motility.valid-cure-antibody.v1",
    "questionVariantId": "question.topic.stomach-ulcer-bleeding-motility.valid-cure-antibody.v1",
    "conceptId": "concept.n2.hpylori-antibody-after-valid-cure-test",
    "sourceView": "topic-batch3-stomach-ulcer-bleeding-motility",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.stomach-ulcer-bleeding-motility.confounded-scan.v1",
    "caseId": "case.topic.stomach-ulcer-bleeding-motility.confounded-emptying-record.v1",
    "nodeId": "node.topic.stomach-ulcer-bleeding-motility.confounded-scan.v1",
    "questionVariantId": "question.topic.stomach-ulcer-bleeding-motility.confounded-scan.v1",
    "conceptId": "concept.stomach-ulcer-bleeding-motility.emptying-acquisition-confounding.v1",
    "sourceView": "topic-batch3-stomach-ulcer-bleeding-motility",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.stomach-ulcer-bleeding-motility.prokinetic-reaction.v1",
    "caseId": "case.topic.stomach-ulcer-bleeding-motility.prokinetic-after-reaction.v1",
    "nodeId": "node.topic.stomach-ulcer-bleeding-motility.prokinetic-reaction.v1",
    "questionVariantId": "question.topic.stomach-ulcer-bleeding-motility.prokinetic-reaction.v1",
    "conceptId": "concept.stomach-ulcer-bleeding-motility.prokinetic-after-dystonia.v1",
    "sourceView": "topic-batch3-stomach-ulcer-bleeding-motility",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.stomach-ulcer-bleeding-motility.recurrent-bleeding-repeat.v1",
    "caseId": "case.topic.stomach-ulcer-bleeding-motility.ulcer-rescue-course.pass-standalone.v1",
    "nodeId": "node.topic.stomach-ulcer-bleeding-motility.recurrent-bleeding-repeat.v1",
    "questionVariantId": "question.topic.stomach-ulcer-bleeding-motility.recurrent-bleeding-repeat.v1",
    "conceptId": "concept.n2r3.ulcer-recurrence-rescue-sequence",
    "sourceView": "topic-batch3-stomach-ulcer-bleeding-motility",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.stomach-ulcer-bleeding-motility.secondary-prevention-aspirin.v1",
    "caseId": "case.topic.stomach-ulcer-bleeding-motility.aspirin-after-ulcer.v1",
    "nodeId": "node.topic.stomach-ulcer-bleeding-motility.secondary-prevention-aspirin.v1",
    "questionVariantId": "question.topic.stomach-ulcer-bleeding-motility.secondary-prevention-aspirin.v1",
    "conceptId": "concept.stomach-ulcer-bleeding-motility.aspirin-secondary-prevention-after-bleed.v1",
    "sourceView": "topic-batch3-stomach-ulcer-bleeding-motility",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.stomach-ulcer-bleeding-motility.perforation-imaging.v1",
    "caseId": "case.topic.stomach-ulcer-bleeding-motility.perforation-record.pass-standalone.v1",
    "nodeId": "node.topic.stomach-ulcer-bleeding-motility.perforation-imaging.v1",
    "questionVariantId": "question.topic.stomach-ulcer-bleeding-motility.perforation-imaging.v1",
    "conceptId": "concept.stomach-ulcer-bleeding-motility.suspected-perforation-imaging.v1",
    "sourceView": "topic-batch3-stomach-ulcer-bleeding-motility",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.stomach-ulcer-bleeding-motility.unstable-perforation-access.v1",
    "caseId": "case.topic.stomach-ulcer-bleeding-motility.perforation-unstable-access.v1",
    "nodeId": "node.topic.stomach-ulcer-bleeding-motility.unstable-perforation-access.v1",
    "questionVariantId": "question.topic.stomach-ulcer-bleeding-motility.unstable-perforation-access.v1",
    "conceptId": "concept.stomach-ulcer-bleeding-motility.unstable-perforation-operative-access.v1",
    "sourceView": "topic-batch3-stomach-ulcer-bleeding-motility",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.stomach-ulcer-bleeding-motility.late-meal-acarbose.v1",
    "caseId": "case.topic.stomach-ulcer-bleeding-motility.postgastrectomy-meal-response.pass-standalone.v1",
    "nodeId": "node.topic.stomach-ulcer-bleeding-motility.late-meal-acarbose.v1",
    "questionVariantId": "question.topic.stomach-ulcer-bleeding-motility.late-meal-acarbose.v1",
    "conceptId": "concept.stomach-ulcer-bleeding-motility.postgastrectomy-late-dumping-treatment.v1",
    "sourceView": "topic-batch3-stomach-ulcer-bleeding-motility",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.stomach-ulcer-bleeding-motility.salvage-eradication.v2",
    "caseId": "case.topic.stomach-ulcer-bleeding-motility.salvage-eradication-standalone.v2",
    "nodeId": "node.topic.stomach-ulcer-bleeding-motility.salvage-eradication.v2",
    "questionVariantId": "question.topic.stomach-ulcer-bleeding-motility.salvage-eradication.v2",
    "conceptId": "concept.stomach-ulcer-bleeding-motility.hp-salvage-after-optimized-bqt.v1",
    "sourceView": "topic-batch3-stomach-ulcer-bleeding-motility",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.stomach-ulcer-bleeding-motility.failed-endoscopy-embolization.v2",
    "caseId": "case.topic.stomach-ulcer-bleeding-motility.failed-endoscopy-embolization-standalone.v2",
    "nodeId": "node.topic.stomach-ulcer-bleeding-motility.failed-endoscopy-embolization.v2",
    "questionVariantId": "question.topic.stomach-ulcer-bleeding-motility.failed-endoscopy-embolization.v2",
    "conceptId": "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality.v2",
    "sourceView": "topic-batch3-stomach-ulcer-bleeding-motility",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.adrenal-men-endocrine.classify-before-localizing.v1",
    "caseId": "case.topic.adrenal-men-endocrine.cushing-classification.v1",
    "nodeId": "node.topic.adrenal-men-endocrine.classify-before-localizing.v1",
    "questionVariantId": "question.topic.adrenal-men-endocrine.classify-before-localizing.v1",
    "conceptId": "concept.cushing.acth-classification",
    "sourceView": "topic-batch3-adrenal-men-endocrine",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.adrenal-men-endocrine.avs-contralateral-nodule.v1",
    "caseId": "case.topic.adrenal-men-endocrine.avs-contralateral-nodule-standalone.v2",
    "nodeId": "node.topic.adrenal-men-endocrine.avs-contralateral-nodule.v1",
    "questionVariantId": "question.topic.adrenal-men-endocrine.avs-contralateral-nodule.v1",
    "conceptId": "concept.topic.adrenal-men-endocrine.avs-contralateral-nodule.v1",
    "sourceView": "topic-batch3-adrenal-men-endocrine",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.adrenal-men-endocrine.avs-technical-failure.v1",
    "caseId": "case.topic.adrenal-men-endocrine.failed-avs.v1",
    "nodeId": "node.topic.adrenal-men-endocrine.avs-technical-failure.v1",
    "questionVariantId": "question.topic.adrenal-men-endocrine.avs-technical-failure.v1",
    "conceptId": "concept.topic.adrenal-men-endocrine.avs-technical-failure.v1",
    "sourceView": "topic-batch3-adrenal-men-endocrine",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.adrenal-men-endocrine.men2-operative-priority.v1",
    "caseId": "case.topic.adrenal-men-endocrine.men2-operative-priority-standalone.v2",
    "nodeId": "node.topic.adrenal-men-endocrine.men2-operative-priority.v1",
    "questionVariantId": "question.topic.adrenal-men-endocrine.men2-operative-priority.v1",
    "conceptId": "concept.n3.hereditary-thyroid-adrenal-operative-order",
    "sourceView": "topic-batch3-adrenal-men-endocrine",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.adrenal-men-endocrine.indeterminate-growth-action.v1",
    "caseId": "case.topic.adrenal-men-endocrine.indeterminate-growth.v1",
    "nodeId": "node.topic.adrenal-men-endocrine.indeterminate-growth-action.v1",
    "questionVariantId": "question.topic.adrenal-men-endocrine.indeterminate-growth-action.v1",
    "conceptId": "concept.topic.adrenal-men-endocrine.indeterminate-growth-action.v1",
    "sourceView": "topic-batch3-adrenal-men-endocrine",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.adrenal-men-endocrine.benign-imaging-followup.v2",
    "caseId": "case.topic.adrenal-men-endocrine.benign-imaging-followup-standalone.v2",
    "nodeId": "node.topic.adrenal-men-endocrine.benign-imaging-followup.v2",
    "questionVariantId": "question.topic.adrenal-men-endocrine.benign-imaging-followup.v2",
    "conceptId": "concept.topic.adrenal-men-endocrine.benign-imaging-followup.v1",
    "sourceView": "topic-batch3-adrenal-men-endocrine",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.adrenal-men-endocrine.confirm-cortisol-autonomy.v2",
    "caseId": "case.topic.adrenal-men-endocrine.confirm-cortisol-autonomy-standalone.v2",
    "nodeId": "node.topic.adrenal-men-endocrine.confirm-cortisol-autonomy.v2",
    "questionVariantId": "question.topic.adrenal-men-endocrine.confirm-cortisol-autonomy.v2",
    "conceptId": "concept.topic.adrenal-men-endocrine.confirm-cortisol-autonomy.v1",
    "sourceView": "topic-batch3-adrenal-men-endocrine",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.adrenal-men-endocrine.unilateral-overt-cortisol.v2",
    "caseId": "case.topic.adrenal-men-endocrine.unilateral-overt-cortisol-standalone.v2",
    "nodeId": "node.topic.adrenal-men-endocrine.unilateral-overt-cortisol.v2",
    "questionVariantId": "question.topic.adrenal-men-endocrine.unilateral-overt-cortisol.v2",
    "conceptId": "concept.topic.adrenal-men-endocrine.unilateral-overt-cortisol.v1",
    "sourceView": "topic-batch3-adrenal-men-endocrine",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.adrenal-men-endocrine.post-cortisol-replacement.v2",
    "caseId": "case.topic.adrenal-men-endocrine.post-cortisol-replacement-standalone.v2",
    "nodeId": "node.topic.adrenal-men-endocrine.post-cortisol-replacement.v2",
    "questionVariantId": "question.topic.adrenal-men-endocrine.post-cortisol-replacement.v2",
    "conceptId": "concept.topic.adrenal-men-endocrine.post-cortisol-replacement.v1",
    "sourceView": "topic-batch3-adrenal-men-endocrine",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.adrenal-men-endocrine.bilateral-pa-medical.v2",
    "caseId": "case.topic.adrenal-men-endocrine.bilateral-pa-medical-standalone.v2",
    "nodeId": "node.topic.adrenal-men-endocrine.bilateral-pa-medical.v2",
    "questionVariantId": "question.topic.adrenal-men-endocrine.bilateral-pa-medical.v2",
    "conceptId": "concept.topic.adrenal-men-endocrine.bilateral-pa-medical.v1",
    "sourceView": "topic-batch3-adrenal-men-endocrine",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.adrenal-men-endocrine.suspected-acc-pathway.v2",
    "caseId": "case.topic.adrenal-men-endocrine.suspected-acc-pathway-standalone.v2",
    "nodeId": "node.topic.adrenal-men-endocrine.suspected-acc-pathway.v2",
    "questionVariantId": "question.topic.adrenal-men-endocrine.suspected-acc-pathway.v2",
    "conceptId": "concept.topic.adrenal-men-endocrine.acc-treatment-sequence.v2",
    "sourceView": "topic-batch3-adrenal-men-endocrine",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.breast-cancer.initial-fixed-nodes-alnd.v1",
    "caseId": "case.topic.breast-cancer.initial-bulky-nodes-response.v1",
    "nodeId": "node.topic.breast-cancer.initial-fixed-nodes-alnd.v1",
    "questionVariantId": "question.topic.breast-cancer.initial-fixed-nodes-alnd.v1",
    "conceptId": "concept.topic.breast-cancer.initial-bulky-nodal-boundary.v1",
    "sourceView": "topic-batch3-breast-cancer",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.breast-cancer.inflammatory-initial-sequence.v1",
    "caseId": "case.topic.breast-cancer.diffuse-skin-clinic-review-pass-split.v2",
    "nodeId": "node.topic.breast-cancer.inflammatory-initial-sequence.v1",
    "questionVariantId": "question.topic.breast-cancer.inflammatory-initial-sequence.v1",
    "conceptId": "concept.inflammatory-breast-cancer.neoadjuvant-sequence",
    "sourceView": "topic-batch3-breast-cancer",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.breast-cancer.marker-target-reconciliation.v1",
    "caseId": "case.topic.breast-cancer.localization-specimen-chart.v1",
    "nodeId": "node.topic.breast-cancer.marker-target-reconciliation.v1",
    "questionVariantId": "question.topic.breast-cancer.marker-target-reconciliation.v1",
    "conceptId": "concept.n4r2.lumpectomy-target-marker-reconciliation",
    "sourceView": "topic-batch3-breast-cancer",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.breast-cancer.benign-sample-discordance.v1",
    "caseId": "case.topic.breast-cancer.additional-mri-focus-pass-split.v2",
    "nodeId": "node.topic.breast-cancer.benign-sample-discordance.v1",
    "questionVariantId": "question.topic.breast-cancer.benign-sample-discordance.v1",
    "conceptId": "concept.inflammatory-breast-cancer.core-biopsy-confirmation.v2",
    "sourceView": "topic-batch3-breast-cancer",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.breast-cancer.dcis-positive-shave.v1",
    "caseId": "case.topic.breast-cancer.dcis-final-boundary.v1",
    "nodeId": "node.topic.breast-cancer.dcis-positive-shave.v1",
    "questionVariantId": "question.topic.breast-cancer.dcis-positive-shave.v1",
    "conceptId": "concept.dcis.margin-bcs-wbrt",
    "sourceView": "topic-batch3-breast-cancer",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.breast-cancer.invasive-with-dcis-margin.v1",
    "caseId": "case.topic.breast-cancer.dcis-final-boundary.v1",
    "nodeId": "node.topic.breast-cancer.invasive-with-dcis-margin.v1",
    "questionVariantId": "question.topic.breast-cancer.invasive-with-dcis-margin.v1",
    "conceptId": "concept.topic.breast-cancer.invasive-component-margin.v1",
    "sourceView": "topic-batch3-breast-cancer",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.breast-cancer.residual-her2-adjuvant.v1",
    "caseId": "case.topic.breast-cancer.her2-treatment-course-pass-split.v2",
    "nodeId": "node.topic.breast-cancer.residual-her2-adjuvant.v1",
    "questionVariantId": "question.topic.breast-cancer.residual-her2-adjuvant.v1",
    "conceptId": "concept.topic.breast-cancer.residual-invasive-her2-adjuvant.v1",
    "sourceView": "topic-batch3-breast-cancer",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.breast-cancer.diffuse-malignant-residual.v2",
    "caseId": "case.topic.breast-cancer.residual-breast-distribution-r2.v2",
    "nodeId": "node.topic.breast-cancer.diffuse-malignant-residual.v2",
    "questionVariantId": "question.topic.breast-cancer.diffuse-malignant-residual.v2",
    "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection",
    "sourceView": "topic-batch3-breast-cancer",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.breast-cancer.her2-neoadjuvant-sequence.v2",
    "caseId": "case.topic.breast-cancer.her2-treatment-course-r2.v2",
    "nodeId": "node.topic.breast-cancer.her2-neoadjuvant-sequence.v2",
    "questionVariantId": "question.topic.breast-cancer.her2-neoadjuvant-sequence.v2",
    "conceptId": "concept.topic.breast-cancer.biology-treatment-sequence.v1",
    "sourceView": "topic-batch3-breast-cancer",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.melanoma-cutaneous-cancer.positive-sln-observation.v1",
    "caseId": "case.topic.melanoma-cutaneous-cancer.microscopic-node.v1",
    "nodeId": "node.topic.melanoma-cutaneous-cancer.positive-sln-observation.v1",
    "questionVariantId": "question.topic.melanoma-cutaneous-cancer.positive-sln-observation.v1",
    "conceptId": "concept.topic.melanoma-cutaneous-cancer.microscopic-positive-sln-observation.v1",
    "sourceView": "topic-batch3-melanoma-cutaneous-cancer",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.melanoma-cutaneous-cancer.stage-ii-adjuvant.v1",
    "caseId": "case.topic.melanoma-cutaneous-cancer.node-negative-high-risk.v1",
    "nodeId": "node.topic.melanoma-cutaneous-cancer.stage-ii-adjuvant.v1",
    "questionVariantId": "question.topic.melanoma-cutaneous-cancer.stage-ii-adjuvant.v1",
    "conceptId": "concept.topic.melanoma-cutaneous-cancer.node-negative-high-risk-adjuvant.v1",
    "sourceView": "topic-batch3-melanoma-cutaneous-cancer",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.melanoma-cutaneous-cancer.thick-primary-margin.v2",
    "caseId": "case.topic.melanoma-cutaneous-cancer.thick-primary-margin.v2",
    "nodeId": "node.topic.melanoma-cutaneous-cancer.thick-primary-margin.v2",
    "questionVariantId": "question.topic.melanoma-cutaneous-cancer.thick-primary-margin.v2",
    "conceptId": "concept.topic.melanoma-cutaneous-cancer.breslow-excision-margin.v1",
    "sourceView": "topic-batch3-melanoma-cutaneous-cancer",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.melanoma-cutaneous-cancer.mcc-negative-imaging-slnb.v2",
    "caseId": "case.topic.melanoma-cutaneous-cancer.mcc-negative-imaging-slnb.v2",
    "nodeId": "node.topic.melanoma-cutaneous-cancer.mcc-negative-imaging-slnb.v2",
    "questionVariantId": "question.topic.melanoma-cutaneous-cancer.mcc-negative-imaging-slnb.v2",
    "conceptId": "concept.gs028g.merkel-cell.clinically-negative-node-staging",
    "sourceView": "topic-batch3-melanoma-cutaneous-cancer",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.gallbladder-duct-stones.duct-before-ercp.v1",
    "caseId": "case.topic.gallbladder-duct-stones.duct-assessment-duct-before-ercp-pass.v2",
    "nodeId": "node.topic.gallbladder-duct-stones.duct-before-ercp.v1",
    "questionVariantId": "question.topic.gallbladder-duct-stones.duct-before-ercp.v1",
    "conceptId": "concept.choledocholithiasis.intermediate-mrcp",
    "sourceView": "topic-batch3-gallbladder-duct-stones",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.gallbladder-duct-stones.eus-after-negative-mrcp.v1",
    "caseId": "case.topic.gallbladder-duct-stones.persistent-suspicion.v1",
    "nodeId": "node.topic.gallbladder-duct-stones.eus-after-negative-mrcp.v1",
    "questionVariantId": "question.topic.gallbladder-duct-stones.eus-after-negative-mrcp.v1",
    "conceptId": "concept.gallbladder-duct-stones.persistent-suspicion-after-mrcp.v1",
    "sourceView": "topic-batch3-gallbladder-duct-stones",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.gallbladder-duct-stones.acute-filling-protocol.v1",
    "caseId": "case.topic.gallbladder-duct-stones.gallbladder-functional-study-acute-filling-protocol-pass.v2",
    "nodeId": "node.topic.gallbladder-duct-stones.acute-filling-protocol.v1",
    "questionVariantId": "question.topic.gallbladder-duct-stones.acute-filling-protocol.v1",
    "conceptId": "concept.cholecystitis.hida-after-equivocal-ultrasound",
    "sourceView": "topic-batch3-gallbladder-duct-stones",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.gallbladder-duct-stones.high-risk-not-unfit.v1",
    "caseId": "case.topic.gallbladder-duct-stones.high-risk-operation.v1",
    "nodeId": "node.topic.gallbladder-duct-stones.high-risk-not-unfit.v1",
    "questionVariantId": "question.topic.gallbladder-duct-stones.high-risk-not-unfit.v1",
    "conceptId": "concept.cholecystitis.fit-patient-index-admission-cholecystectomy",
    "sourceView": "topic-batch3-gallbladder-duct-stones",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.gallbladder-duct-stones.antibiotics-after-source-control.v1",
    "caseId": "case.topic.gallbladder-duct-stones.high-risk-operation.v1",
    "nodeId": "node.topic.gallbladder-duct-stones.antibiotics-after-source-control.v1",
    "questionVariantId": "question.topic.gallbladder-duct-stones.antibiotics-after-source-control.v1",
    "conceptId": "concept.gallbladder-duct-stones.postoperative-antibiotic-boundary.v1",
    "sourceView": "topic-batch3-gallbladder-duct-stones",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.gallbladder-duct-stones.unstable-drainage-extent.v1",
    "caseId": "case.topic.gallbladder-duct-stones.obstructive-sepsis-unstable-drainage-extent-pass.v2",
    "nodeId": "node.topic.gallbladder-duct-stones.unstable-drainage-extent.v1",
    "questionVariantId": "question.topic.gallbladder-duct-stones.unstable-drainage-extent.v1",
    "conceptId": "concept.gallbladder-duct-stones.cholangitis-unstable-intervention-extent.v1",
    "sourceView": "topic-batch3-gallbladder-duct-stones",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.gallbladder-duct-stones.large-balloon-stricture-boundary.v1",
    "caseId": "case.topic.gallbladder-duct-stones.narrow-distal-duct.v1",
    "nodeId": "node.topic.gallbladder-duct-stones.large-balloon-stricture-boundary.v1",
    "questionVariantId": "question.topic.gallbladder-duct-stones.large-balloon-stricture-boundary.v1",
    "conceptId": "concept.gallbladder-duct-stones.papillary-dilation-distal-stricture-boundary.v1",
    "sourceView": "topic-batch3-gallbladder-duct-stones",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.gallbladder-duct-stones.conversion-does-not-identify-ducts.v1",
    "caseId": "case.topic.gallbladder-duct-stones.fused-neck.v1",
    "nodeId": "node.topic.gallbladder-duct-stones.conversion-does-not-identify-ducts.v1",
    "questionVariantId": "question.topic.gallbladder-duct-stones.conversion-does-not-identify-ducts.v1",
    "conceptId": "concept.gs028g.subtotal-cholecystectomy.safe-bailout",
    "sourceView": "topic-batch3-gallbladder-duct-stones",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.gallbladder-duct-stones.remnant-anatomy-workup.v1",
    "caseId": "case.topic.gallbladder-duct-stones.remnant-symptoms-remnant-anatomy-workup-pass.v2",
    "nodeId": "node.topic.gallbladder-duct-stones.remnant-anatomy-workup.v1",
    "questionVariantId": "question.topic.gallbladder-duct-stones.remnant-anatomy-workup.v1",
    "conceptId": "concept.gallbladder-duct-stones.symptomatic-remnant-anatomy.v1",
    "sourceView": "topic-batch3-gallbladder-duct-stones",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.gallbladder-duct-stones.neck-stone-proximal-dilation.v1",
    "caseId": "case.topic.gallbladder-duct-stones.proximal-obstruction-neck-stone-neck-stone-proximal-dilation-pass.v2",
    "nodeId": "node.topic.gallbladder-duct-stones.neck-stone-proximal-dilation.v1",
    "questionVariantId": "question.topic.gallbladder-duct-stones.neck-stone-proximal-dilation.v1",
    "conceptId": "concept.gallbladder-duct-stones.mirizzi-anatomy-before-intervention.v1",
    "sourceView": "topic-batch3-gallbladder-duct-stones",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.gallbladder-duct-stones.bleeding-risk-drainage-first.v1",
    "caseId": "case.topic.gallbladder-duct-stones.anticoagulated-duct-infection.v1",
    "nodeId": "node.topic.gallbladder-duct-stones.bleeding-risk-drainage-first.v1",
    "questionVariantId": "question.topic.gallbladder-duct-stones.bleeding-risk-drainage-first.v1",
    "conceptId": "concept.gallbladder-duct-stones.cholangitis-anticoagulated-drainage-extent.v1",
    "sourceView": "topic-batch3-gallbladder-duct-stones",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.gallbladder-duct-stones.symptoms-beyond-seventy-two-hours.v2",
    "caseId": "case.topic.gallbladder-duct-stones.symptoms-beyond-seventy-two-hours-review2.v2",
    "nodeId": "node.topic.gallbladder-duct-stones.symptoms-beyond-seventy-two-hours.v2",
    "questionVariantId": "question.topic.gallbladder-duct-stones.symptoms-beyond-seventy-two-hours.v2",
    "conceptId": "concept.gallbladder-duct-stones.early-window-beyond-seventy-two-hours.v1",
    "sourceView": "topic-batch3-gallbladder-duct-stones",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.gallbladder-duct-stones.active-cardiac-gallbladder-source.v2",
    "caseId": "case.topic.gallbladder-duct-stones.active-cardiac-gallbladder-source-review2.v2",
    "nodeId": "node.topic.gallbladder-duct-stones.active-cardiac-gallbladder-source.v2",
    "questionVariantId": "question.topic.gallbladder-duct-stones.active-cardiac-gallbladder-source.v2",
    "conceptId": "concept.cholecystitis.source-control-during-active-cardiac-event.v1",
    "sourceView": "topic-batch3-gallbladder-duct-stones",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.gallbladder-duct-stones.failed-clearance-drainage-bridge.v2",
    "caseId": "case.topic.gallbladder-duct-stones.failed-clearance-drainage-bridge-review2.v2",
    "nodeId": "node.topic.gallbladder-duct-stones.failed-clearance-drainage-bridge.v2",
    "questionVariantId": "question.topic.gallbladder-duct-stones.failed-clearance-drainage-bridge.v2",
    "conceptId": "concept.gallbladder-duct-stones.failed-clearance-temporary-drainage.v1",
    "sourceView": "topic-batch3-gallbladder-duct-stones",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.gallbladder-duct-stones.stent-not-permanent-clearance.v2",
    "caseId": "case.topic.gallbladder-duct-stones.stent-not-permanent-clearance-review2.v2",
    "nodeId": "node.topic.gallbladder-duct-stones.stent-not-permanent-clearance.v2",
    "questionVariantId": "question.topic.gallbladder-duct-stones.stent-not-permanent-clearance.v2",
    "conceptId": "concept.gallbladder-duct-stones.stent-recurrent-obstructive-infection.v1",
    "sourceView": "topic-batch3-gallbladder-duct-stones",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hernia-groin.selected-observation.v1",
    "caseId": "case.topic.hernia-groin.changing-function.v1",
    "nodeId": "node.topic.hernia-groin.selected-observation.v1",
    "questionVariantId": "question.topic.hernia-groin.selected-observation.v1",
    "conceptId": "concept.inguinal-hernia.selected-watchful-waiting",
    "sourceView": "topic-batch3-hernia-groin",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hernia-groin.partial-wall-urgency.v1",
    "caseId": "case.topic.hernia-groin.partial-wall.v1",
    "nodeId": "node.topic.hernia-groin.partial-wall-urgency.v1",
    "questionVariantId": "question.topic.hernia-groin.partial-wall-urgency.v1",
    "conceptId": "concept.groin-hernia.femoral-defect-repair-priority.v2",
    "sourceView": "topic-batch3-hernia-groin",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hernia-groin.gross-spillage-tissue-repair.v1",
    "caseId": "case.topic.hernia-groin.contaminated-groin.v1",
    "nodeId": "node.topic.hernia-groin.gross-spillage-tissue-repair.v1",
    "questionVariantId": "question.topic.hernia-groin.gross-spillage-tissue-repair.v1",
    "conceptId": "concept.hernia-groin.small-contaminated-defect-repair.v1",
    "sourceView": "topic-batch3-hernia-groin",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hernia-groin.marked-femoral-repair.v2",
    "caseId": "case.topic.hernia-groin.r2.marked-femoral-repair.v2",
    "nodeId": "node.topic.hernia-groin.marked-femoral-repair.v2",
    "questionVariantId": "question.topic.hernia-groin.marked-femoral-repair.v2",
    "conceptId": "concept.femoral-hernia.timely-elective-repair",
    "sourceView": "topic-batch3-hernia-groin",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hernia-groin.new-component-ultrasound.v2",
    "caseId": "case.topic.hernia-groin.r2.new-component-ultrasound.v2",
    "nodeId": "node.topic.hernia-groin.new-component-ultrasound.v2",
    "questionVariantId": "question.topic.hernia-groin.new-component-ultrasound.v2",
    "conceptId": "concept.n3.postrepair-pain-new-dynamic-finding",
    "sourceView": "topic-batch3-hernia-groin",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hernia-groin.anterior-recurrence-plane.v2",
    "caseId": "case.topic.hernia-groin.r2.anterior-recurrence-plane.v2",
    "nodeId": "node.topic.hernia-groin.anterior-recurrence-plane.v2",
    "questionVariantId": "question.topic.hernia-groin.anterior-recurrence-plane.v2",
    "conceptId": "concept.inguinal-hernia.recurrence-after-anterior-repair.v1",
    "sourceView": "topic-batch3-hernia-groin",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hernia-groin.acute-reduction-selection.v2",
    "caseId": "case.topic.hernia-groin.r2.acute-reduction-selection.v2",
    "nodeId": "node.topic.hernia-groin.acute-reduction-selection.v2",
    "questionVariantId": "question.topic.hernia-groin.acute-reduction-selection.v2",
    "conceptId": "concept.hernia-groin.acute-nonischemic-reduction.v1",
    "sourceView": "topic-batch3-hernia-groin",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hernia-groin.local-anesthesia-selection.v2",
    "caseId": "case.topic.hernia-groin.r2.local-anesthesia-selection.v2",
    "nodeId": "node.topic.hernia-groin.local-anesthesia-selection.v2",
    "questionVariantId": "question.topic.hernia-groin.local-anesthesia-selection.v2",
    "conceptId": "concept.hernia-groin.retropubic-history-repair-anesthesia.v1",
    "sourceView": "topic-batch3-hernia-groin",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.critical-respiratory-ventilation.copd-planned-extubation.v1",
    "caseId": "case.topic.critical-respiratory-ventilation.salvage-copd-planned-extubation.v1",
    "nodeId": "node.topic.critical-respiratory-ventilation.copd-planned-extubation.v1",
    "questionVariantId": "question.topic.critical-respiratory-ventilation.copd-planned-extubation.v1",
    "conceptId": "concept.critical-respiratory-ventilation.copd-planned-extubation.v1",
    "sourceView": "topic-batch3-critical-respiratory-ventilation",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.critical-respiratory-ventilation.sbt-readiness.v2",
    "caseId": "case.topic.critical-respiratory-ventilation.salvage-sbt-readiness.v1",
    "nodeId": "node.topic.critical-respiratory-ventilation.sbt-readiness.v2",
    "questionVariantId": "question.topic.critical-respiratory-ventilation.sbt-readiness.v2",
    "conceptId": "concept.critical-respiratory-ventilation.sbt-readiness.v1",
    "sourceView": "topic-batch3-critical-respiratory-ventilation",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.critical-respiratory-ventilation.sbt-fio2.v2",
    "caseId": "case.topic.critical-respiratory-ventilation.salvage-sbt-fio2.v1",
    "nodeId": "node.topic.critical-respiratory-ventilation.sbt-fio2.v2",
    "questionVariantId": "question.topic.critical-respiratory-ventilation.sbt-fio2.v2",
    "conceptId": "concept.critical-respiratory-ventilation.sbt-fio2.v1",
    "sourceView": "topic-batch3-critical-respiratory-ventilation",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.critical-respiratory-ventilation.copd-niv.v2",
    "caseId": "case.topic.critical-respiratory-ventilation.salvage-copd-niv.v1",
    "nodeId": "node.topic.critical-respiratory-ventilation.copd-niv.v2",
    "questionVariantId": "question.topic.critical-respiratory-ventilation.copd-niv.v2",
    "conceptId": "concept.critical-respiratory-ventilation.copd-niv.v1",
    "sourceView": "topic-batch3-critical-respiratory-ventilation",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.critical-shock-resuscitation.inotrope-after-pressure-restored.v1",
    "caseId": "case.critical-shock-resuscitation.inotrope-after-pressure-restored-salvage.v1",
    "nodeId": "node.critical-shock-resuscitation.inotrope-after-pressure-restored.v1",
    "questionVariantId": "question.critical-shock-resuscitation.inotrope-after-pressure-restored.v1",
    "conceptId": "concept.critical-shock-resuscitation.inotrope-after-pressure-restored.v1",
    "sourceView": "topic-batch3-critical-shock-resuscitation",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.critical-shock-resuscitation.lactate-perfusion-discordance.v1",
    "caseId": "case.critical-shock-resuscitation.lactate-perfusion-discordance-salvage.v1",
    "nodeId": "node.critical-shock-resuscitation.lactate-perfusion-discordance.v1",
    "questionVariantId": "question.critical-shock-resuscitation.lactate-perfusion-discordance.v1",
    "conceptId": "concept.critical-shock-resuscitation.lactate-perfusion-discordance.v1",
    "sourceView": "topic-batch3-critical-shock-resuscitation",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.critical-shock-resuscitation.vasopressin-escalation.v2",
    "caseId": "case.critical-shock-resuscitation.vasopressin-escalation-salvage.v1",
    "nodeId": "node.critical-shock-resuscitation.vasopressin-escalation.v2",
    "questionVariantId": "question.critical-shock-resuscitation.vasopressin-escalation.v2",
    "conceptId": "concept.critical-shock-resuscitation.vasopressin-escalation.v1",
    "sourceView": "topic-batch3-critical-shock-resuscitation",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.critical-renal-organ-support.congestion-directed-oliguria.v1",
    "caseId": "case.topic.critical-renal-organ-support.congestion-directed-oliguria.salvage.v1",
    "nodeId": "node.topic.critical-renal-organ-support.congestion-directed-oliguria.v1",
    "questionVariantId": "question.topic.critical-renal-organ-support.congestion-directed-oliguria.v1",
    "conceptId": "concept.critical-renal-organ-support.congestion-directed-oliguria.v1",
    "sourceView": "topic-batch3-critical-renal-organ-support",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.critical-renal-organ-support.rrt-treatment-response.v1",
    "caseId": "case.topic.critical-renal-organ-support.rrt-treatment-response.salvage.v1",
    "nodeId": "node.topic.critical-renal-organ-support.rrt-treatment-response.v1",
    "questionVariantId": "question.topic.critical-renal-organ-support.rrt-treatment-response.v1",
    "conceptId": "concept.critical-renal-organ-support.rrt-treatment-response.v1",
    "sourceView": "topic-batch3-critical-renal-organ-support",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.v1",
    "caseId": "case.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.salvage.v1",
    "nodeId": "node.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.v1",
    "questionVariantId": "question.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.v1",
    "conceptId": "concept.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.v1",
    "sourceView": "topic-batch3-critical-renal-organ-support",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
    "caseId": "case.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.salvage.v1",
    "nodeId": "node.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
    "questionVariantId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.posttraumatic-hepatic-pseudoaneurysm",
    "sourceView": "topic-batch3-trauma-initial-abdomen",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1",
    "caseId": "case.topic.trauma-initial-abdomen.renal-isolated-urine-leak.salvage.v1",
    "nodeId": "node.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1",
    "questionVariantId": "question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.stable-renal-urinary-extravasation-observation",
    "sourceView": "topic-batch3-trauma-initial-abdomen",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.small-bowel-obstruction-ileus.contrast-assessment.v2",
    "caseId": "case.topic.small-bowel-obstruction-ileus.contrast-assessment-standalone.v1",
    "nodeId": "node.topic.small-bowel-obstruction-ileus.contrast-assessment.v2",
    "questionVariantId": "question.topic.small-bowel-obstruction-ileus.contrast-assessment.v2",
    "conceptId": "concept.small-bowel-obstruction-ileus.contrast-prognostic-assessment.v2",
    "sourceView": "topic-batch3-small-bowel-obstruction-ileus",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.appendix-appendicitis.persistent-pain-exploration.v1",
    "caseId": "case.topic.appendix-appendicitis.salvage-persistent-pain-exploration.v1",
    "nodeId": "node.topic.appendix-appendicitis.persistent-pain-exploration.v1",
    "questionVariantId": "question.topic.appendix-appendicitis.persistent-pain-exploration.v1",
    "conceptId": "concept.appendix-appendicitis.persistent-pain-after-negative-imaging.v1",
    "sourceView": "topic-batch3-appendix-appendicitis",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2",
    "caseId": "case.topic.appendix-appendicitis.salvage-invasive-adenocarcinoma-resection.v1",
    "nodeId": "node.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2",
    "conceptId": "concept.appendix-appendicitis.invasive-adenocarcinoma-nodal-resection.v1",
    "sourceView": "topic-batch3-appendix-appendicitis",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1",
    "caseId": "case.topic.appendix-appendicitis.salvage-post-abscess-interval-appendectomy.v1",
    "nodeId": "node.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1",
    "questionVariantId": "question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1",
    "conceptId": "concept.appendix-appendicitis.suspicious-post-abscess-interval-resection.v1",
    "sourceView": "topic-batch3-appendix-appendicitis",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.growing-sac-source.v1",
    "caseId": "case.vascular-aorta.salvage-growing-sac-source.v1",
    "nodeId": "node.vascular-aorta.growing-sac-source.v1",
    "questionVariantId": "question.vascular-aorta.growing-sac-source.v1",
    "conceptId": "concept.vascular-aorta.expanding-evar-sac-source-reassessment.v1",
    "sourceView": "topic-batch3-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.residual-static-branch.v1",
    "caseId": "case.vascular-aorta.salvage-residual-static-branch.v1",
    "nodeId": "node.vascular-aorta.residual-static-branch.v1",
    "questionVariantId": "question.vascular-aorta.residual-static-branch.v1",
    "conceptId": "concept.vascular-aorta.persistent-static-renal-branch-obstruction-after-tevar.v1",
    "sourceView": "topic-batch3-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-aorta.stable-branch-flow.v1",
    "caseId": "case.vascular-aorta.salvage-stable-branch-flow.v1",
    "nodeId": "node.vascular-aorta.stable-branch-flow.v1",
    "questionVariantId": "question.vascular-aorta.stable-branch-flow.v1",
    "conceptId": "concept.vascular-aorta.stable-type-ii-endoleak-surveillance.v1",
    "sourceView": "topic-batch3-vascular-aorta",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-chronic-cysts-neoplasia.chronic-failed-stenting.v1",
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.salvage.chronic-failed-stenting.v1",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.chronic-failed-stenting.v1",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.chronic-failed-stenting.v1",
    "conceptId": "concept.pancreas-chronic-cysts-neoplasia.chronic-duct-drainage-after-endoscopy.v1",
    "sourceView": "topic-batch3-pancreas-chronic-cysts-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-chronic-cysts-neoplasia.ipmn-high-risk-plan.v1",
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.salvage.ipmn-high-risk-plan.v1",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.ipmn-high-risk-plan.v1",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.ipmn-high-risk-plan.v1",
    "conceptId": "concept.pancreas-chronic-cysts-neoplasia.ipmn-high-risk-resection.v1",
    "sourceView": "topic-batch3-pancreas-chronic-cysts-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-chronic-cysts-neoplasia.mcn-large-symptomatic.v2",
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.salvage.mcn-large-symptomatic.v1",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.mcn-large-symptomatic.v2",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.mcn-large-symptomatic.v2",
    "conceptId": "concept.pancreas-chronic-cysts-neoplasia.mcn-size-symptom-resection.v1",
    "sourceView": "topic-batch3-pancreas-chronic-cysts-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-chronic-cysts-neoplasia.net-growth-duct-proximity.v1",
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.salvage.net-growth-duct-proximity.v1",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.net-growth-duct-proximity.v1",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.net-growth-duct-proximity.v1",
    "conceptId": "concept.pancreas-chronic-cysts-neoplasia.pnet-growth-formal-resection.v1",
    "sourceView": "topic-batch3-pancreas-chronic-cysts-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.pancreas-chronic-cysts-neoplasia.postop-vomiting-inflammation.v1",
    "caseId": "case.topic.pancreas-chronic-cysts-neoplasia.salvage.postop-vomiting-inflammation.v1",
    "nodeId": "node.topic.pancreas-chronic-cysts-neoplasia.postop-vomiting-inflammation.v1",
    "questionVariantId": "question.topic.pancreas-chronic-cysts-neoplasia.postop-vomiting-inflammation.v1",
    "conceptId": "concept.pancreas-chronic-cysts-neoplasia.postop-vomiting-secondary-complication-evaluation.v1",
    "sourceView": "topic-batch3-pancreas-chronic-cysts-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  }
,
  // Manager-accepted complete topic cases, batch 4.
{
    "acceptanceId": "question.topic.hernia-ventral-abdominal-wall.epigastric-referral.v1",
    "caseId": "case.topic.hernia-ventral-abdominal-wall.epigastric-pain-attribution.v1",
    "nodeId": "node.topic.hernia-ventral-abdominal-wall.epigastric-referral.v1",
    "questionVariantId": "question.topic.hernia-ventral-abdominal-wall.epigastric-referral.v1",
    "conceptId": "concept.umbilical-epigastric-hernia.symptomatic-elective-referral",
    "sourceView": "topic-batch4-hernia-ventral-abdominal-wall",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hernia-ventral-abdominal-wall.mesh-failed-salvage.v1",
    "caseId": "case.topic.hernia-ventral-abdominal-wall.mesh-failed-salvage-standalone.v1",
    "nodeId": "node.topic.hernia-ventral-abdominal-wall.mesh-failed-salvage.v1",
    "questionVariantId": "question.topic.hernia-ventral-abdominal-wall.mesh-failed-salvage.v1",
    "conceptId": "concept.prosthetic-mesh-infection.specialist-source-control-evaluation",
    "sourceView": "topic-batch4-hernia-ventral-abdominal-wall",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hernia-ventral-abdominal-wall.primary-observation.v2",
    "caseId": "case.topic.hernia-ventral-abdominal-wall.primary-observation-round2.v2",
    "nodeId": "node.topic.hernia-ventral-abdominal-wall.primary-observation.v2",
    "questionVariantId": "question.topic.hernia-ventral-abdominal-wall.primary-observation.v2",
    "conceptId": "concept.topic.hernia-ventral-abdominal-wall.primary-defect-symptom-attribution.v1",
    "sourceView": "topic-batch4-hernia-ventral-abdominal-wall",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hernia-ventral-abdominal-wall.controlled-emergency-material.v2",
    "caseId": "case.topic.hernia-ventral-abdominal-wall.controlled-emergency-material-round2.v2",
    "nodeId": "node.topic.hernia-ventral-abdominal-wall.controlled-emergency-material.v2",
    "questionVariantId": "question.topic.hernia-ventral-abdominal-wall.controlled-emergency-material.v2",
    "conceptId": "concept.topic.hernia-ventral-abdominal-wall.controlled-entry-reinforcement-strategy.v1",
    "sourceView": "topic-batch4-hernia-ventral-abdominal-wall",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.hernia-ventral-abdominal-wall.asymptomatic-seroma-observation.v2",
    "caseId": "case.topic.hernia-ventral-abdominal-wall.asymptomatic-seroma-observation-round2.v2",
    "nodeId": "node.topic.hernia-ventral-abdominal-wall.asymptomatic-seroma-observation.v2",
    "questionVariantId": "question.topic.hernia-ventral-abdominal-wall.asymptomatic-seroma-observation.v2",
    "conceptId": "concept.topic.hernia-ventral-abdominal-wall.postrepair-fluid-sample-provenance.v1",
    "sourceView": "topic-batch4-hernia-ventral-abdominal-wall",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thyroid-nodules-cancer.r02.v1",
    "caseId": "case.topic.thyroid-nodules-cancer.multiple-nodules.v1",
    "nodeId": "node.topic.thyroid-nodules-cancer.r02.v1",
    "questionVariantId": "question.topic.thyroid-nodules-cancer.r02.v1",
    "conceptId": "concept.thyroid-nodule.fna-selection",
    "sourceView": "topic-batch4-thyroid-nodules-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thyroid-nodules-cancer.r08.v2",
    "caseId": "case.topic.thyroid-nodules-cancer.graves-followup.v1",
    "nodeId": "node.topic.thyroid-nodules-cancer.r08.v2",
    "questionVariantId": "question.topic.thyroid-nodules-cancer.r08.v2",
    "conceptId": "concept.n1r3.graves-followup-medication-adjustment",
    "sourceView": "topic-batch4-thyroid-nodules-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thyroid-nodules-cancer.n01.v1",
    "caseId": "case.topic.thyroid-nodules-cancer.functional-map.v1",
    "nodeId": "node.topic.thyroid-nodules-cancer.n01.v1",
    "questionVariantId": "question.topic.thyroid-nodules-cancer.n01.v1",
    "conceptId": "concept.topic.thyroid-nodules-cancer.suppressed-tsh-before-biopsy.v1",
    "sourceView": "topic-batch4-thyroid-nodules-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thyroid-nodules-cancer.n02.v1",
    "caseId": "case.topic.thyroid-nodules-cancer.functional-map.v1",
    "nodeId": "node.topic.thyroid-nodules-cancer.n02.v1",
    "questionVariantId": "question.topic.thyroid-nodules-cancer.n02.v1",
    "conceptId": "concept.thyroid-nodule.fna-selection",
    "sourceView": "topic-batch4-thyroid-nodules-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thyroid-nodules-cancer.n06.v1",
    "caseId": "case.topic.thyroid-nodules-cancer.destructive-thyrotoxicosis.v1",
    "nodeId": "node.topic.thyroid-nodules-cancer.n06.v1",
    "questionVariantId": "question.topic.thyroid-nodules-cancer.n06.v1",
    "conceptId": "concept.topic.thyroid-nodules-cancer.destructive-thyrotoxicosis-treatment.v1",
    "sourceView": "topic-batch4-thyroid-nodules-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thyroid-nodules-cancer.n13.v1",
    "caseId": "case.topic.thyroid-nodules-cancer.small-bilateral-cancer.v1",
    "nodeId": "node.topic.thyroid-nodules-cancer.n13.v1",
    "questionVariantId": "question.topic.thyroid-nodules-cancer.n13.v1",
    "conceptId": "concept.topic.thyroid-nodules-cancer.ptc-central-dissection-selection.v1",
    "sourceView": "topic-batch4-thyroid-nodules-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thyroid-nodules-cancer.n19.v1",
    "caseId": "case.topic.thyroid-nodules-cancer.rapid-mass.v1",
    "nodeId": "node.topic.thyroid-nodules-cancer.n19.v1",
    "questionVariantId": "question.topic.thyroid-nodules-cancer.n19.v1",
    "conceptId": "concept.topic.thyroid-nodules-cancer.aggressive-mass-tissue-before-resection.v1",
    "sourceView": "topic-batch4-thyroid-nodules-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thyroid-nodules-cancer.r01.v2",
    "caseId": "case.topic.thyroid-nodules-cancer.review2.r01.v1",
    "nodeId": "node.topic.thyroid-nodules-cancer.r01.v2",
    "questionVariantId": "question.topic.thyroid-nodules-cancer.r01.v2",
    "conceptId": "concept.thyroid-nodule.fna-selection",
    "sourceView": "topic-batch4-thyroid-nodules-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thyroid-nodules-cancer.r06.v2",
    "caseId": "case.topic.thyroid-nodules-cancer.review2.r06.v1",
    "nodeId": "node.topic.thyroid-nodules-cancer.r06.v2",
    "questionVariantId": "question.topic.thyroid-nodules-cancer.r06.v2",
    "conceptId": "concept.topic.thyroid-nodules-cancer.invasive-dtc-contrast-map.v1",
    "sourceView": "topic-batch4-thyroid-nodules-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thyroid-nodules-cancer.n03.v2",
    "caseId": "case.topic.thyroid-nodules-cancer.review2.n03.v1",
    "nodeId": "node.topic.thyroid-nodules-cancer.n03.v2",
    "questionVariantId": "question.topic.thyroid-nodules-cancer.n03.v2",
    "conceptId": "concept.topic.thyroid-nodules-cancer.cyst-only-nondiagnostic-followup.v1",
    "sourceView": "topic-batch4-thyroid-nodules-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thyroid-nodules-cancer.n04.v2",
    "caseId": "case.topic.thyroid-nodules-cancer.review2.n04.v1",
    "nodeId": "node.topic.thyroid-nodules-cancer.n04.v2",
    "questionVariantId": "question.topic.thyroid-nodules-cancer.n04.v2",
    "conceptId": "concept.topic.thyroid-nodules-cancer.benign-cytology-us-discordance.v1",
    "sourceView": "topic-batch4-thyroid-nodules-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thyroid-nodules-cancer.n05.v2",
    "caseId": "case.topic.thyroid-nodules-cancer.review2.n05.v1",
    "nodeId": "node.topic.thyroid-nodules-cancer.n05.v2",
    "questionVariantId": "question.topic.thyroid-nodules-cancer.n05.v2",
    "conceptId": "concept.topic.thyroid-nodules-cancer.toxic-nodule-compression.v1",
    "sourceView": "topic-batch4-thyroid-nodules-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thyroid-nodules-cancer.n12.v2",
    "caseId": "case.topic.thyroid-nodules-cancer.review2.n12.v1",
    "nodeId": "node.topic.thyroid-nodules-cancer.n12.v2",
    "questionVariantId": "question.topic.thyroid-nodules-cancer.n12.v2",
    "conceptId": "concept.topic.thyroid-nodules-cancer.graves-preop-t3-control.v1",
    "sourceView": "topic-batch4-thyroid-nodules-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thyroid-nodules-cancer.n14.v2",
    "caseId": "case.topic.thyroid-nodules-cancer.review2.n14.v1",
    "nodeId": "node.topic.thyroid-nodules-cancer.n14.v2",
    "questionVariantId": "question.topic.thyroid-nodules-cancer.n14.v2",
    "conceptId": "concept.topic.thyroid-nodules-cancer.rising-tgab-negative-neck-imaging.v1",
    "sourceView": "topic-batch4-thyroid-nodules-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thyroid-nodules-cancer.n16.v2",
    "caseId": "case.topic.thyroid-nodules-cancer.review2.n16.v1",
    "nodeId": "node.topic.thyroid-nodules-cancer.n16.v2",
    "questionVariantId": "question.topic.thyroid-nodules-cancer.n16.v2",
    "conceptId": "concept.topic.thyroid-nodules-cancer.reoperative-lateral-field-extent.v1",
    "sourceView": "topic-batch4-thyroid-nodules-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thyroid-nodules-cancer.n18.v2",
    "caseId": "case.topic.thyroid-nodules-cancer.review2.n18.v1",
    "nodeId": "node.topic.thyroid-nodules-cancer.n18.v2",
    "questionVariantId": "question.topic.thyroid-nodules-cancer.n18.v2",
    "conceptId": "concept.topic.thyroid-nodules-cancer.sporadic-mtc-after-lobectomy.v1",
    "sourceView": "topic-batch4-thyroid-nodules-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colorectal-polyps-cancer.stalk-local-clearance.v1",
    "caseId": "case.topic.colorectal-polyps-cancer.favorable-stalk-pathology.v1",
    "nodeId": "node.topic.colorectal-polyps-cancer.stalk-local-clearance.v1",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.stalk-local-clearance.v1",
    "conceptId": "concept.malignant-polyp.low-risk-endoscopic-excision",
    "sourceView": "topic-batch4-colorectal-polyps-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colorectal-polyps-cancer.vascular-channel-regional-resection.v1",
    "caseId": "case.topic.colorectal-polyps-cancer.vascular-channel-polyp.v1",
    "nodeId": "node.topic.colorectal-polyps-cancer.vascular-channel-regional-resection.v1",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.vascular-channel-regional-resection.v1",
    "conceptId": "concept.malignant-polyp.adverse-feature-colectomy",
    "sourceView": "topic-batch4-colorectal-polyps-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colorectal-polyps-cancer.transected-front-regional-resection.v1",
    "caseId": "case.topic.colorectal-polyps-cancer.transected-invasive-front.v1",
    "nodeId": "node.topic.colorectal-polyps-cancer.transected-front-regional-resection.v1",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.transected-front-regional-resection.v1",
    "conceptId": "concept.malignant-polyp.adverse-feature-colectomy",
    "sourceView": "topic-batch4-colorectal-polyps-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colorectal-polyps-cancer.fap-diffuse-rectal-burden.v1",
    "caseId": "case.topic.colorectal-polyps-cancer.fap-rectal-field.v1",
    "nodeId": "node.topic.colorectal-polyps-cancer.fap-diffuse-rectal-burden.v1",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.fap-diffuse-rectal-burden.v1",
    "conceptId": "concept.fap.ipaa-for-uncontrolled-rectal-burden",
    "sourceView": "topic-batch4-colorectal-polyps-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colorectal-polyps-cancer.fap-rectal-sparing-ira.v1",
    "caseId": "case.topic.colorectal-polyps-cancer.fap-rectal-sparing.v1",
    "nodeId": "node.topic.colorectal-polyps-cancer.fap-rectal-sparing-ira.v1",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.fap-rectal-sparing-ira.v1",
    "conceptId": "concept.topic.colorectal-polyps-cancer.fap-rectal-sparing-ira.v1",
    "sourceView": "topic-batch4-colorectal-polyps-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colorectal-polyps-cancer.fap-poor-sphincter-end-stoma.v1",
    "caseId": "case.topic.colorectal-polyps-cancer.fap-poor-sphincter.v1",
    "nodeId": "node.topic.colorectal-polyps-cancer.fap-poor-sphincter-end-stoma.v1",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.fap-poor-sphincter-end-stoma.v1",
    "conceptId": "concept.topic.colorectal-polyps-cancer.fap-poor-sphincter-end-stoma.v1",
    "sourceView": "topic-batch4-colorectal-polyps-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colorectal-polyps-cancer.rectal-high-risk-tnt.v1",
    "caseId": "case.topic.colorectal-polyps-cancer.rectal-initial-staging.v1",
    "nodeId": "node.topic.colorectal-polyps-cancer.rectal-high-risk-tnt.v1",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.rectal-high-risk-tnt.v1",
    "conceptId": "concept.topic.colorectal-polyps-cancer.rectal-high-risk-tnt.v1",
    "sourceView": "topic-batch4-colorectal-polyps-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  
  {
    "acceptanceId": "question.topic.colorectal-polyps-cancer.lesions-not-fragments.v1",
    "caseId": "case.topic.colorectal-polyps-cancer.adenoma-fragment-count.v1",
    "nodeId": "node.topic.colorectal-polyps-cancer.lesions-not-fragments.v1",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.lesions-not-fragments.v1",
    "conceptId": "concept.topic.colorectal-polyps-cancer.lesions-not-fragments.v1",
    "sourceView": "topic-batch4-colorectal-polyps-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colorectal-polyps-cancer.positive-fit-negative-repeat.v2",
    "caseId": "case.topic.colorectal-polyps-cancer.positive-fit-negative-repeat-r2.v2",
    "nodeId": "node.topic.colorectal-polyps-cancer.positive-fit-negative-repeat.v2",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.positive-fit-negative-repeat.v2",
    "conceptId": "concept.colorectal.positive-fit-colonoscopy",
    "sourceView": "topic-batch4-colorectal-polyps-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colorectal-polyps-cancer.advanced-adenoma-surveillance.v2",
    "caseId": "case.topic.colorectal-polyps-cancer.advanced-adenoma-surveillance-r2.v2",
    "nodeId": "node.topic.colorectal-polyps-cancer.advanced-adenoma-surveillance.v2",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.advanced-adenoma-surveillance.v2",
    "conceptId": "concept.topic.colorectal-polyps-cancer.advanced-adenoma-surveillance.v1",
    "sourceView": "topic-batch4-colorectal-polyps-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colorectal-polyps-cancer.piecemeal-scar-surveillance.v2",
    "caseId": "case.topic.colorectal-polyps-cancer.piecemeal-scar-surveillance-r2.v2",
    "nodeId": "node.topic.colorectal-polyps-cancer.piecemeal-scar-surveillance.v2",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.piecemeal-scar-surveillance.v2",
    "conceptId": "concept.topic.colorectal-polyps-cancer.piecemeal-emr-surveillance.v1",
    "sourceView": "topic-batch4-colorectal-polyps-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colorectal-polyps-cancer.intact-low-risk-specimen.v2",
    "caseId": "case.topic.colorectal-polyps-cancer.intact-low-risk-specimen-r2.v2",
    "nodeId": "node.topic.colorectal-polyps-cancer.intact-low-risk-specimen.v2",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.intact-low-risk-specimen.v2",
    "conceptId": "concept.malignant-polyp.low-risk-endoscopic-excision",
    "sourceView": "topic-batch4-colorectal-polyps-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colorectal-polyps-cancer.nonlifting-after-tattoo.v2",
    "caseId": "case.topic.colorectal-polyps-cancer.nonlifting-after-tattoo-r2.v2",
    "nodeId": "node.topic.colorectal-polyps-cancer.nonlifting-after-tattoo.v2",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.nonlifting-after-tattoo.v2",
    "conceptId": "concept.topic.colorectal-polyps-cancer.large-polyp-expert-resection.v1",
    "sourceView": "topic-batch4-colorectal-polyps-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colorectal-polyps-cancer.adherent-bladder-en-bloc.v2",
    "caseId": "case.topic.colorectal-polyps-cancer.adherent-bladder-en-bloc-r2.v2",
    "nodeId": "node.topic.colorectal-polyps-cancer.adherent-bladder-en-bloc.v2",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.adherent-bladder-en-bloc.v2",
    "conceptId": "concept.topic.colorectal-polyps-cancer.adherent-bladder-en-bloc.v2",
    "sourceView": "topic-batch4-colorectal-polyps-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colorectal-polyps-cancer.asymptomatic-incurable-primary.v2",
    "caseId": "case.topic.colorectal-polyps-cancer.asymptomatic-incurable-primary-r2.v2",
    "nodeId": "node.topic.colorectal-polyps-cancer.asymptomatic-incurable-primary.v2",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.asymptomatic-incurable-primary.v2",
    "conceptId": "concept.topic.colorectal-polyps-cancer.asymptomatic-incurable-primary.v1",
    "sourceView": "topic-batch4-colorectal-polyps-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colorectal-polyps-cancer.perforation-overrides-systemic-first.v2",
    "caseId": "case.topic.colorectal-polyps-cancer.perforation-overrides-systemic-first-r2.v2",
    "nodeId": "node.topic.colorectal-polyps-cancer.perforation-overrides-systemic-first.v2",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.perforation-overrides-systemic-first.v2",
    "conceptId": "concept.topic.colorectal-polyps-cancer.perforation-overrides-systemic-first.v2",
    "sourceView": "topic-batch4-colorectal-polyps-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colorectal-polyps-cancer.advanced-baseline-normal-surveillance.v2",
    "caseId": "case.topic.colorectal-polyps-cancer.advanced-baseline-normal-surveillance-r2.v2",
    "nodeId": "node.topic.colorectal-polyps-cancer.advanced-baseline-normal-surveillance.v2",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.advanced-baseline-normal-surveillance.v2",
    "conceptId": "concept.topic.colorectal-polyps-cancer.serial-adenoma-surveillance.v1",
    "sourceView": "topic-batch4-colorectal-polyps-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.perioperative-risk-recovery.beta-new-exposure.v2",
    "caseId": "case.topic.perioperative-risk-recovery.beta-exposure.v2",
    "nodeId": "node.topic.perioperative-risk-recovery.beta-new-exposure.v2",
    "questionVariantId": "question.topic.perioperative-risk-recovery.beta-new-exposure.v2",
    "conceptId": "concept.perioperative-risk-recovery.beta-actual-exposure.v1",
    "sourceView": "topic-batch4-perioperative-risk-recovery",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.perioperative-risk-recovery.extended-cancer-course.v2",
    "caseId": "case.topic.perioperative-risk-recovery.cancer-prophylaxis-extended-cancer-course.v2",
    "nodeId": "node.topic.perioperative-risk-recovery.extended-cancer-course.v2",
    "questionVariantId": "question.topic.perioperative-risk-recovery.extended-cancer-course.v2",
    "conceptId": "concept.postoperative-prophylaxis.extended-cancer-vte-prevention",
    "sourceView": "topic-batch4-perioperative-risk-recovery",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.perioperative-risk-recovery.sglt2-acid-ketone-pattern.v2",
    "caseId": "case.topic.perioperative-risk-recovery.sglt2-hospital-course-sglt2-acid-ketone-pattern.v2",
    "nodeId": "node.topic.perioperative-risk-recovery.sglt2-acid-ketone-pattern.v2",
    "questionVariantId": "question.topic.perioperative-risk-recovery.sglt2-acid-ketone-pattern.v2",
    "conceptId": "concept.perioperative-risk-recovery.sglt2-euglycemic-infusion.v1",
    "sourceView": "topic-batch4-perioperative-risk-recovery",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.perioperative-risk-recovery.delirium-anticholinergic-order.v2",
    "caseId": "case.topic.perioperative-risk-recovery.delirium-medication-course-delirium-anticholinergic-order.v2",
    "nodeId": "node.topic.perioperative-risk-recovery.delirium-anticholinergic-order.v2",
    "questionVariantId": "question.topic.perioperative-risk-recovery.delirium-anticholinergic-order.v2",
    "conceptId": "concept.perioperative-risk-recovery.delirium-medication-risk.v1",
    "sourceView": "topic-batch4-perioperative-risk-recovery",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.perioperative-risk-recovery.postoperative-targeted-ultrasound.v2",
    "caseId": "case.topic.perioperative-risk-recovery.breast-site-recovery-postoperative-targeted-ultrasound.v2",
    "nodeId": "node.topic.perioperative-risk-recovery.postoperative-targeted-ultrasound.v2",
    "questionVariantId": "question.topic.perioperative-risk-recovery.postoperative-targeted-ultrasound.v2",
    "conceptId": "concept.perioperative-risk-recovery.postoperative-ultrasound-target-adequacy.v1",
    "sourceView": "topic-batch4-perioperative-risk-recovery",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.perioperative-risk-recovery.postoperative-seroma-observe.v2",
    "caseId": "case.topic.perioperative-risk-recovery.breast-site-recovery-postoperative-seroma-observe.v2",
    "nodeId": "node.topic.perioperative-risk-recovery.postoperative-seroma-observe.v2",
    "questionVariantId": "question.topic.perioperative-risk-recovery.postoperative-seroma-observe.v2",
    "conceptId": "concept.postoperative-seroma.uncomplicated-observation",
    "sourceView": "topic-batch4-perioperative-risk-recovery",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.perioperative-risk-recovery.contrast-event-provenance.v2",
    "caseId": "case.topic.perioperative-risk-recovery.contrast-events.v2",
    "nodeId": "node.topic.perioperative-risk-recovery.contrast-event-provenance.v2",
    "questionVariantId": "question.topic.perioperative-risk-recovery.contrast-event-provenance.v2",
    "conceptId": "concept.perioperative-risk-recovery.contrast-agent-attribution.v1",
    "sourceView": "topic-batch4-perioperative-risk-recovery",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.perioperative-risk-recovery.extravasation-progressive-injury.v1",
    "caseId": "case.topic.perioperative-risk-recovery.contrast-local-course.v1",
    "nodeId": "node.topic.perioperative-risk-recovery.extravasation-progressive-injury.v1",
    "questionVariantId": "question.topic.perioperative-risk-recovery.extravasation-progressive-injury.v1",
    "conceptId": "concept.n2r2.progressive-extravasation-and-reaction-history",
    "sourceView": "topic-batch4-perioperative-risk-recovery",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.perioperative-risk-recovery.penicillin-delayed-boundary.v1",
    "caseId": "case.topic.perioperative-risk-recovery.allergy-severe-history.v1",
    "nodeId": "node.topic.perioperative-risk-recovery.penicillin-delayed-boundary.v1",
    "questionVariantId": "question.topic.perioperative-risk-recovery.penicillin-delayed-boundary.v1",
    "conceptId": "concept.perioperative-risk-recovery.penicillin-severe-delayed-boundary.v1",
    "sourceView": "topic-batch4-perioperative-risk-recovery",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.perioperative-risk-recovery.symptomatic-aortic-valve.v1",
    "caseId": "case.topic.perioperative-risk-recovery.valve-risk.v1",
    "nodeId": "node.topic.perioperative-risk-recovery.symptomatic-aortic-valve.v1",
    "questionVariantId": "question.topic.perioperative-risk-recovery.symptomatic-aortic-valve.v1",
    "conceptId": "concept.perioperative-risk-recovery.aortic-valve-before-elective-surgery.v1",
    "sourceView": "topic-batch4-perioperative-risk-recovery",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.perioperative-risk-recovery.des-acs-elective-timing.v2",
    "caseId": "case.topic.perioperative-risk-recovery.recent-coronary-stent.v2",
    "nodeId": "node.topic.perioperative-risk-recovery.des-acs-elective-timing.v2",
    "questionVariantId": "question.topic.perioperative-risk-recovery.des-acs-elective-timing.v2",
    "conceptId": "concept.perioperative-risk-recovery.des-acs-elective-interruption.v1",
    "sourceView": "topic-batch4-perioperative-risk-recovery",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anorectal-benign-pelvic-floor.supralevator-external.v1",
    "caseId": "case.topic.anorectal-benign-pelvic-floor.supralevator-external.v1",
    "nodeId": "node.topic.anorectal-benign-pelvic-floor.supralevator-external.v1",
    "questionVariantId": "question.topic.anorectal-benign-pelvic-floor.supralevator-external.v1",
    "conceptId": "concept.anorectal-abscess.supralevator-origin-and-drainage.v1",
    "sourceView": "topic-batch4-anorectal-benign-pelvic-floor",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anorectal-benign-pelvic-floor.simple-fistulotomy.v1",
    "caseId": "case.topic.anorectal-benign-pelvic-floor.simple-fistula.v1",
    "nodeId": "node.topic.anorectal-benign-pelvic-floor.simple-fistulotomy.v1",
    "questionVariantId": "question.topic.anorectal-benign-pelvic-floor.simple-fistulotomy.v1",
    "conceptId": "concept.topic.anorectal-benign-pelvic-floor.simple-fistulotomy-selection.v1",
    "sourceView": "topic-batch4-anorectal-benign-pelvic-floor",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anorectal-benign-pelvic-floor.internal-hemorrhoid-banding.v1",
    "caseId": "case.topic.anorectal-benign-pelvic-floor.internal-hemorrhoid-banding-pass-standalone.v1",
    "nodeId": "node.topic.anorectal-benign-pelvic-floor.internal-hemorrhoid-banding.v1",
    "questionVariantId": "question.topic.anorectal-benign-pelvic-floor.internal-hemorrhoid-banding.v1",
    "conceptId": "concept.internal-hemorrhoids.office-banding-selection",
    "sourceView": "topic-batch4-anorectal-benign-pelvic-floor",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anorectal-benign-pelvic-floor.combined-hemorrhoid-excision.v1",
    "caseId": "case.topic.anorectal-benign-pelvic-floor.combined-hemorrhoid-excision-pass-standalone.v1",
    "nodeId": "node.topic.anorectal-benign-pelvic-floor.combined-hemorrhoid-excision.v1",
    "questionVariantId": "question.topic.anorectal-benign-pelvic-floor.combined-hemorrhoid-excision.v1",
    "conceptId": "concept.topic.anorectal-benign-pelvic-floor.combined-hemorrhoid-excision.v1",
    "sourceView": "topic-batch4-anorectal-benign-pelvic-floor",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anorectal-benign-pelvic-floor.long-prolapse-perineal-operation.v1",
    "caseId": "case.topic.anorectal-benign-pelvic-floor.long-prolapse-perineal-operation-pass-standalone.v1",
    "nodeId": "node.topic.anorectal-benign-pelvic-floor.long-prolapse-perineal-operation.v1",
    "questionVariantId": "question.topic.anorectal-benign-pelvic-floor.long-prolapse-perineal-operation.v1",
    "conceptId": "concept.topic.anorectal-benign-pelvic-floor.long-prolapse-perineal-operation.v1",
    "sourceView": "topic-batch4-anorectal-benign-pelvic-floor",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anorectal-benign-pelvic-floor.outlet-biofeedback.v1",
    "caseId": "case.topic.anorectal-benign-pelvic-floor.outlet-biofeedback-pass-standalone.v1",
    "nodeId": "node.topic.anorectal-benign-pelvic-floor.outlet-biofeedback.v1",
    "questionVariantId": "question.topic.anorectal-benign-pelvic-floor.outlet-biofeedback.v1",
    "conceptId": "concept.topic.anorectal-benign-pelvic-floor.outlet-biofeedback.v1",
    "sourceView": "topic-batch4-anorectal-benign-pelvic-floor",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anorectal-benign-pelvic-floor.supralevator-internal.v2",
    "caseId": "case.topic.anorectal-benign-pelvic-floor.supralevator-internal-standalone.v2",
    "nodeId": "node.topic.anorectal-benign-pelvic-floor.supralevator-internal.v2",
    "questionVariantId": "question.topic.anorectal-benign-pelvic-floor.supralevator-internal.v2",
    "conceptId": "concept.anorectal-abscess.supralevator-origin-and-drainage.v1",
    "sourceView": "topic-batch4-anorectal-benign-pelvic-floor",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anorectal-benign-pelvic-floor.horseshoe-source-control.v2",
    "caseId": "case.topic.anorectal-benign-pelvic-floor.horseshoe-source-control-standalone.v2",
    "nodeId": "node.topic.anorectal-benign-pelvic-floor.horseshoe-source-control.v2",
    "questionVariantId": "question.topic.anorectal-benign-pelvic-floor.horseshoe-source-control.v2",
    "conceptId": "concept.topic.anorectal-benign-pelvic-floor.horseshoe-source-control.v2",
    "sourceView": "topic-batch4-anorectal-benign-pelvic-floor",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anorectal-benign-pelvic-floor.recurrent-fistula-mri.v2",
    "caseId": "case.topic.anorectal-benign-pelvic-floor.recurrent-fistula-mri-standalone.v2",
    "nodeId": "node.topic.anorectal-benign-pelvic-floor.recurrent-fistula-mri.v2",
    "questionVariantId": "question.topic.anorectal-benign-pelvic-floor.recurrent-fistula-mri.v2",
    "conceptId": "concept.complex-perianal-fistula.mri-mapping",
    "sourceView": "topic-batch4-anorectal-benign-pelvic-floor",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anorectal-benign-pelvic-floor.lis-after-treatment.v2",
    "caseId": "case.topic.anorectal-benign-pelvic-floor.lis-after-treatment-standalone.v2",
    "nodeId": "node.topic.anorectal-benign-pelvic-floor.lis-after-treatment.v2",
    "questionVariantId": "question.topic.anorectal-benign-pelvic-floor.lis-after-treatment.v2",
    "conceptId": "concept.chronic-anal-fissure.lis-after-medical-treatment",
    "sourceView": "topic-batch4-anorectal-benign-pelvic-floor",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anorectal-benign-pelvic-floor.snm-after-failed-repair.v2",
    "caseId": "case.topic.anorectal-benign-pelvic-floor.snm-after-failed-repair-standalone.v2",
    "nodeId": "node.topic.anorectal-benign-pelvic-floor.snm-after-failed-repair.v2",
    "questionVariantId": "question.topic.anorectal-benign-pelvic-floor.snm-after-failed-repair.v2",
    "conceptId": "concept.topic.anorectal-benign-pelvic-floor.snm-after-failed-repair.v1",
    "sourceView": "topic-batch4-anorectal-benign-pelvic-floor",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anorectal-benign-pelvic-floor.stool-directed-continence-care.v2",
    "caseId": "case.topic.anorectal-benign-pelvic-floor.stool-directed-continence-care-standalone.v2",
    "nodeId": "node.topic.anorectal-benign-pelvic-floor.stool-directed-continence-care.v2",
    "questionVariantId": "question.topic.anorectal-benign-pelvic-floor.stool-directed-continence-care.v2",
    "conceptId": "concept.fecal-incontinence.first-line-stool-care",
    "sourceView": "topic-batch4-anorectal-benign-pelvic-floor",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anorectal-benign-pelvic-floor.rectocele-repair-after-coordination.v2",
    "caseId": "case.topic.anorectal-benign-pelvic-floor.rectocele-repair-after-coordination-standalone.v2",
    "nodeId": "node.topic.anorectal-benign-pelvic-floor.rectocele-repair-after-coordination.v2",
    "questionVariantId": "question.topic.anorectal-benign-pelvic-floor.rectocele-repair-after-coordination.v2",
    "conceptId": "concept.topic.anorectal-benign-pelvic-floor.rectocele-repair-after-coordination.v1",
    "sourceView": "topic-batch4-anorectal-benign-pelvic-floor",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.breast-benign-high-risk.fibroadenoma-growth.v1",
    "caseId": "case.topic.breast-benign-high-risk.solid-mass.pass-preserved.v1",
    "nodeId": "node.topic.breast-benign-high-risk.fibroadenoma-growth.v1",
    "questionVariantId": "question.topic.breast-benign-high-risk.fibroadenoma-growth.v1",
    "conceptId": "concept.topic.breast-benign-high-risk.fibroadenoma-growth-excision.v1",
    "sourceView": "topic-batch4-breast-benign-high-risk",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.breast-benign-high-risk.negative-imaging-tissue.v1",
    "caseId": "case.topic.breast-benign-high-risk.palpable-site.pass-preserved.v1",
    "nodeId": "node.topic.breast-benign-high-risk.negative-imaging-tissue.v1",
    "questionVariantId": "question.topic.breast-benign-high-risk.negative-imaging-tissue.v1",
    "conceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
    "sourceView": "topic-batch4-breast-benign-high-risk",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.breast-benign-high-risk.adh-residual.v2",
    "caseId": "case.topic.breast-benign-high-risk.adh-residual.round2.v2",
    "nodeId": "node.topic.breast-benign-high-risk.adh-residual.v2",
    "questionVariantId": "question.topic.breast-benign-high-risk.adh-residual.v2",
    "conceptId": "concept.topic.breast-benign-high-risk.adh-target-and-method.v2",
    "sourceView": "topic-batch4-breast-benign-high-risk",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.breast-benign-high-risk.premenopausal-prevention.v2",
    "caseId": "case.topic.breast-benign-high-risk.premenopausal-prevention.round2.v2",
    "nodeId": "node.topic.breast-benign-high-risk.premenopausal-prevention.v2",
    "questionVariantId": "question.topic.breast-benign-high-risk.premenopausal-prevention.v2",
    "conceptId": "concept.topic.breast-benign-high-risk.prevention-vte-menopause.v2",
    "sourceView": "topic-batch4-breast-benign-high-risk",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.breast-benign-high-risk.classic-lobular-observation.v1",
    "caseId": "case.topic.breast-benign-high-risk.lobular-correlation.pass-preserved.v1",
    "nodeId": "node.topic.breast-benign-high-risk.classic-lobular-observation.v1",
    "questionVariantId": "question.topic.breast-benign-high-risk.classic-lobular-observation.v1",
    "conceptId": "concept.topic.breast-benign-high-risk.classic-lobular-concordant-observation.v1",
    "sourceView": "topic-batch4-breast-benign-high-risk",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.breast-benign-high-risk.lobular-discordance.v2",
    "caseId": "case.topic.breast-benign-high-risk.lobular-discordance.round2.v2",
    "nodeId": "node.topic.breast-benign-high-risk.lobular-discordance.v2",
    "questionVariantId": "question.topic.breast-benign-high-risk.lobular-discordance.v2",
    "conceptId": "concept.topic.breast-benign-high-risk.lobular-discordant-target-excision.v1",
    "sourceView": "topic-batch4-breast-benign-high-risk",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.breast-benign-high-risk.pure-fea.v1",
    "caseId": "case.topic.breast-benign-high-risk.fea.v1",
    "nodeId": "node.topic.breast-benign-high-risk.pure-fea.v1",
    "questionVariantId": "question.topic.breast-benign-high-risk.pure-fea.v1",
    "conceptId": "concept.topic.breast-benign-high-risk.pure-fea-concordant-observation.v1",
    "sourceView": "topic-batch4-breast-benign-high-risk",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.breast-benign-high-risk.cavity-solid-core.v2",
    "caseId": "case.topic.breast-benign-high-risk.cavity-solid-core.round2.v2",
    "nodeId": "node.topic.breast-benign-high-risk.cavity-solid-core.v2",
    "questionVariantId": "question.topic.breast-benign-high-risk.cavity-solid-core.v2",
    "conceptId": "concept.topic.breast-benign-high-risk.cavity-core-concordance.v2",
    "sourceView": "topic-batch4-breast-benign-high-risk",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.breast-benign-high-risk.lactation-ultrasound.v2",
    "caseId": "case.topic.breast-benign-high-risk.lactation-ultrasound.round2.v2",
    "nodeId": "node.topic.breast-benign-high-risk.lactation-ultrasound.v2",
    "questionVariantId": "question.topic.breast-benign-high-risk.lactation-ultrasound.v2",
    "conceptId": "concept.topic.breast-benign-high-risk.lactational-inflammatory-response.v2",
    "sourceView": "topic-batch4-breast-benign-high-risk",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.breast-benign-high-risk.milk-contact.v2",
    "caseId": "case.topic.breast-benign-high-risk.milk-contact.round2.v2",
    "nodeId": "node.topic.breast-benign-high-risk.milk-contact.v2",
    "questionVariantId": "question.topic.breast-benign-high-risk.milk-contact.v2",
    "conceptId": "concept.n3.lactation-drain-contact-boundary",
    "sourceView": "topic-batch4-breast-benign-high-risk",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.burns-inhalation.limited-scald-disposition.v1",
    "caseId": "case.topic.burns-inhalation.limited-scald.v1",
    "nodeId": "node.topic.burns-inhalation.limited-scald-disposition.v1",
    "questionVariantId": "question.topic.burns-inhalation.limited-scald-disposition.v1",
    "conceptId": "concept.burn.referral-consultation-selection",
    "sourceView": "topic-batch4-burns-inhalation",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.burns-inhalation.serial-hand-depth.v1",
    "caseId": "case.topic.burns-inhalation.changing-hand.v1",
    "nodeId": "node.topic.burns-inhalation.serial-hand-depth.v1",
    "questionVariantId": "question.topic.burns-inhalation.serial-hand-depth.v1",
    "conceptId": "concept.n1.burn-evolving-hand-depth-reassessment",
    "sourceView": "topic-batch4-burns-inhalation",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.burns-inhalation.resuscitation-clock-and-area.v1",
    "caseId": "case.topic.burns-inhalation.fluid-record.v1",
    "nodeId": "node.topic.burns-inhalation.resuscitation-clock-and-area.v1",
    "questionVariantId": "question.topic.burns-inhalation.resuscitation-clock-and-area.v1",
    "conceptId": "concept.topic.burns-inhalation.resuscitation-clock-area.v1",
    "sourceView": "topic-batch4-burns-inhalation",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.burns-inhalation.fluid-response-adjustment.v1",
    "caseId": "case.topic.burns-inhalation.fluid-record.v1",
    "nodeId": "node.topic.burns-inhalation.fluid-response-adjustment.v1",
    "questionVariantId": "question.topic.burns-inhalation.fluid-response-adjustment.v1",
    "conceptId": "concept.topic.burns-inhalation.fluid-response-adjustment.v1",
    "sourceView": "topic-batch4-burns-inhalation",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.burns-inhalation.thermal-chest-release.v1",
    "caseId": "case.topic.burns-inhalation.constrictive-thermal-burn-pass-standalone.v1",
    "nodeId": "node.topic.burns-inhalation.thermal-chest-release.v1",
    "questionVariantId": "question.topic.burns-inhalation.thermal-chest-release.v1",
    "conceptId": "concept.topic.burns-inhalation.thermal-chest-escharotomy.v1",
    "sourceView": "topic-batch4-burns-inhalation",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.burns-inhalation.electrical-deep-compartment.v1",
    "caseId": "case.topic.burns-inhalation.electrical-record-pass-standalone.v1",
    "nodeId": "node.topic.burns-inhalation.electrical-deep-compartment.v1",
    "questionVariantId": "question.topic.burns-inhalation.electrical-deep-compartment.v1",
    "conceptId": "concept.topic.burns-inhalation.electrical-deep-compartment.v1",
    "sourceView": "topic-batch4-burns-inhalation",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.burns-inhalation.mixed-smoke-antidote.v1",
    "caseId": "case.topic.burns-inhalation.mixed-smoke-toxicity.v1",
    "nodeId": "node.topic.burns-inhalation.mixed-smoke-antidote.v1",
    "questionVariantId": "question.topic.burns-inhalation.mixed-smoke-antidote.v1",
    "conceptId": "concept.topic.burns-inhalation.mixed-smoke-antidote.v1",
    "sourceView": "topic-batch4-burns-inhalation",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.burns-inhalation.regional-excision-plan.v1",
    "caseId": "case.topic.burns-inhalation.coverage-record-pass-standalone.v1",
    "nodeId": "node.topic.burns-inhalation.regional-excision-plan.v1",
    "questionVariantId": "question.topic.burns-inhalation.regional-excision-plan.v1",
    "conceptId": "concept.topic.burns-inhalation.regional-excision-plan.v1",
    "sourceView": "topic-batch4-burns-inhalation",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.burns-inhalation.enteral-after-resuscitation.v1",
    "caseId": "case.topic.burns-inhalation.nutrition-record-pass-standalone.v1",
    "nodeId": "node.topic.burns-inhalation.enteral-after-resuscitation.v1",
    "questionVariantId": "question.topic.burns-inhalation.enteral-after-resuscitation.v1",
    "conceptId": "concept.severe-burn.early-enteral-nutrition",
    "sourceView": "topic-batch4-burns-inhalation",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.burns-inhalation.culture-versus-infection.v1",
    "caseId": "case.topic.burns-inhalation.healing-culture.v1",
    "nodeId": "node.topic.burns-inhalation.culture-versus-infection.v1",
    "questionVariantId": "question.topic.burns-inhalation.culture-versus-infection.v1",
    "conceptId": "concept.topic.burns-inhalation.culture-versus-infection.v1",
    "sourceView": "topic-batch4-burns-inhalation",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.burns-inhalation.thermal-limb-release.v2",
    "caseId": "case.topic.burns-inhalation.thermal-limb-release-revision.v2",
    "nodeId": "node.topic.burns-inhalation.thermal-limb-release.v2",
    "questionVariantId": "question.topic.burns-inhalation.thermal-limb-release.v2",
    "conceptId": "concept.topic.burns-inhalation.thermal-limb-escharotomy.v1",
    "sourceView": "topic-batch4-burns-inhalation",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.burns-inhalation.electrical-pigment-resuscitation.v2",
    "caseId": "case.topic.burns-inhalation.electrical-pigment-resuscitation-revision.v2",
    "nodeId": "node.topic.burns-inhalation.electrical-pigment-resuscitation.v2",
    "questionVariantId": "question.topic.burns-inhalation.electrical-pigment-resuscitation.v2",
    "conceptId": "concept.topic.burns-inhalation.electrical-oliguria-volume-context.v1",
    "sourceView": "topic-batch4-burns-inhalation",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.burns-inhalation.lower-airway-assessment.v2",
    "caseId": "case.topic.burns-inhalation.lower-airway-assessment-revision.v2",
    "nodeId": "node.topic.burns-inhalation.lower-airway-assessment.v2",
    "questionVariantId": "question.topic.burns-inhalation.lower-airway-assessment.v2",
    "conceptId": "concept.topic.burns-inhalation.airway-debris-intervention.v1",
    "sourceView": "topic-batch4-burns-inhalation",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.burns-inhalation.temporary-burn-coverage.v2",
    "caseId": "case.topic.burns-inhalation.temporary-burn-coverage-revision.v2",
    "nodeId": "node.topic.burns-inhalation.temporary-burn-coverage.v2",
    "questionVariantId": "question.topic.burns-inhalation.temporary-burn-coverage.v2",
    "conceptId": "concept.topic.burns-inhalation.excision-bed-and-coverage.v1",
    "sourceView": "topic-batch4-burns-inhalation",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.burns-inhalation.feeding-new-hypoperfusion.v2",
    "caseId": "case.topic.burns-inhalation.feeding-new-hypoperfusion-revision.v2",
    "nodeId": "node.topic.burns-inhalation.feeding-new-hypoperfusion.v2",
    "questionVariantId": "question.topic.burns-inhalation.feeding-new-hypoperfusion.v2",
    "conceptId": "concept.topic.burns-inhalation.gastric-intolerance-after-recovery.v1",
    "sourceView": "topic-batch4-burns-inhalation",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anal-cancer.clear-margin-observation.v1",
    "caseId": "case.topic.anal-cancer.margin-favorable.v1",
    "nodeId": "node.topic.anal-cancer.clear-margin-observation.v1",
    "questionVariantId": "question.topic.anal-cancer.clear-margin-observation.v1",
    "conceptId": "concept.topic.anal-cancer.margin-adjuvant-selection.v1",
    "sourceView": "topic-batch4-anal-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anal-cancer.irradiated-groin-recurrence.v1",
    "caseId": "case.topic.anal-cancer.groin-recurrence.v1",
    "nodeId": "node.topic.anal-cancer.irradiated-groin-recurrence.v1",
    "questionVariantId": "question.topic.anal-cancer.irradiated-groin-recurrence.v1",
    "conceptId": "concept.topic.anal-cancer.inguinal-salvage.v1",
    "sourceView": "topic-batch4-anal-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anal-cancer.metastatic-first-systemic-line.v1",
    "caseId": "case.topic.anal-cancer.distant-recurrence.v1",
    "nodeId": "node.topic.anal-cancer.metastatic-first-systemic-line.v1",
    "questionVariantId": "question.topic.anal-cancer.metastatic-first-systemic-line.v1",
    "conceptId": "concept.topic.anal-cancer.metastatic-line-selection.v1",
    "sourceView": "topic-batch4-anal-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anal-cancer.sample-provenance.v2",
    "caseId": "case.topic.anal-cancer.sample-depth.v2",
    "nodeId": "node.topic.anal-cancer.sample-provenance.v2",
    "questionVariantId": "question.topic.anal-cancer.sample-provenance.v2",
    "conceptId": "concept.anal-scc.biopsy-and-staging",
    "sourceView": "topic-batch4-anal-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anal-cancer.salvage-local-failure.v2",
    "caseId": "case.topic.anal-cancer.salvage-standalone.v2",
    "nodeId": "node.topic.anal-cancer.salvage-local-failure.v2",
    "questionVariantId": "question.topic.anal-cancer.salvage-local-failure.v2",
    "conceptId": "concept.topic.anal-cancer.salvage-apr.v1",
    "sourceView": "topic-batch4-anal-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anal-cancer.regional-node-treatment.v1",
    "caseId": "case.topic.anal-cancer.regional-node-treatment.standalone.v1",
    "nodeId": "node.topic.anal-cancer.regional-node-treatment.v1",
    "questionVariantId": "question.topic.anal-cancer.regional-node-treatment.v1",
    "conceptId": "concept.anal-scc.localized-chemoradiation-referral",
    "sourceView": "topic-batch4-anal-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.bariatric-metabolic.initial-acute-imaging.v1",
    "caseId": "case.topic.bariatric-metabolic.persistent-pain-after-rygb.v1",
    "nodeId": "node.topic.bariatric-metabolic.initial-acute-imaging.v1",
    "questionVariantId": "question.topic.bariatric-metabolic.initial-acute-imaging.v1",
    "conceptId": "concept.bariatric-metabolic.acute-rygb-ct-assessment.v1",
    "sourceView": "topic-batch4-bariatric-metabolic",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.bariatric-metabolic.negative-ct-persistent-course.v1",
    "caseId": "case.topic.bariatric-metabolic.persistent-pain-after-rygb.v1",
    "nodeId": "node.topic.bariatric-metabolic.negative-ct-persistent-course.v1",
    "questionVariantId": "question.topic.bariatric-metabolic.negative-ct-persistent-course.v1",
    "conceptId": "concept.bariatric-metabolic.rygb-pain-despite-negative-ct.v1",
    "sourceView": "topic-batch4-bariatric-metabolic",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.bariatric-metabolic.deterioration-source-control.v1",
    "caseId": "case.topic.bariatric-metabolic.late-sleeve-leak-review.pass-preserved.v1",
    "nodeId": "node.topic.bariatric-metabolic.deterioration-source-control.v1",
    "questionVariantId": "question.topic.bariatric-metabolic.deterioration-source-control.v1",
    "conceptId": "concept.bariatric-metabolic.unstable-leak-source-control.v1",
    "sourceView": "topic-batch4-bariatric-metabolic",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic-soft-tissue-sarcoma-desmoid.calf-core-tract.20261111.v1",
    "caseId": "case.topic-soft-tissue-sarcoma-desmoid.calf-planning.20261111.v1",
    "nodeId": "node.topic-soft-tissue-sarcoma-desmoid.calf-core-tract.20261111.v1",
    "questionVariantId": "question.topic-soft-tissue-sarcoma-desmoid.calf-core-tract.20261111.v1",
    "conceptId": "concept.soft-tissue-mass.specialist-planned-biopsy",
    "sourceView": "topic-batch4-soft-tissue-sarcoma-desmoid",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic-soft-tissue-sarcoma-desmoid.forearm-biopsy-correspondence.20261111.v1",
    "caseId": "case.topic-soft-tissue-sarcoma-desmoid.forearm-sample-match.20261111.v1",
    "nodeId": "node.topic-soft-tissue-sarcoma-desmoid.forearm-biopsy-correspondence.20261111.v1",
    "questionVariantId": "question.topic-soft-tissue-sarcoma-desmoid.forearm-biopsy-correspondence.20261111.v1",
    "conceptId": "concept.topic-soft-tissue-sarcoma-desmoid.biopsy-sample-correspondence.v1",
    "sourceView": "topic-batch4-soft-tissue-sarcoma-desmoid",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic-soft-tissue-sarcoma-desmoid.planned-negative-margin.20261111.v1",
    "caseId": "case.topic-soft-tissue-sarcoma-desmoid.planned-margin.20261111.v1",
    "nodeId": "node.topic-soft-tissue-sarcoma-desmoid.planned-negative-margin.20261111.v1",
    "questionVariantId": "question.topic-soft-tissue-sarcoma-desmoid.planned-negative-margin.20261111.v1",
    "conceptId": "concept.topic-soft-tissue-sarcoma-desmoid.critical-structure-margin-context.v1",
    "sourceView": "topic-batch4-soft-tissue-sarcoma-desmoid",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic-soft-tissue-sarcoma-desmoid.unplanned-bed-clearance.20261111.v1",
    "caseId": "case.topic-soft-tissue-sarcoma-desmoid.unplanned-excision.20261111.v1",
    "nodeId": "node.topic-soft-tissue-sarcoma-desmoid.unplanned-bed-clearance.20261111.v1",
    "questionVariantId": "question.topic-soft-tissue-sarcoma-desmoid.unplanned-bed-clearance.20261111.v1",
    "conceptId": "concept.topic-soft-tissue-sarcoma-desmoid.unplanned-excision-bed-clearance.v1",
    "sourceView": "topic-batch4-soft-tissue-sarcoma-desmoid",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic-soft-tissue-sarcoma-desmoid.rps-biopsy.20261111.v2",
    "caseId": "case.topic-soft-tissue-sarcoma-desmoid.rps-biopsy.20261111.v2",
    "nodeId": "node.topic-soft-tissue-sarcoma-desmoid.rps-biopsy.20261111.v2",
    "questionVariantId": "question.topic-soft-tissue-sarcoma-desmoid.rps-biopsy.20261111.v2",
    "conceptId": "concept.topic-soft-tissue-sarcoma-desmoid.retroperitoneal-biopsy-heterogeneity.v2",
    "sourceView": "topic-batch4-soft-tissue-sarcoma-desmoid",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic-soft-tissue-sarcoma-desmoid.rps-histotype-resection.20261111.v2",
    "caseId": "case.topic-soft-tissue-sarcoma-desmoid.rps-histotype-resection.20261111.v2",
    "nodeId": "node.topic-soft-tissue-sarcoma-desmoid.rps-histotype-resection.20261111.v2",
    "questionVariantId": "question.topic-soft-tissue-sarcoma-desmoid.rps-histotype-resection.20261111.v2",
    "conceptId": "concept.topic-soft-tissue-sarcoma-desmoid.retroperitoneal-histotype-organ-preservation.v1",
    "sourceView": "topic-batch4-soft-tissue-sarcoma-desmoid",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic-soft-tissue-sarcoma-desmoid.desmoid-function-course.20261111.v2",
    "caseId": "case.topic-soft-tissue-sarcoma-desmoid.desmoid-function-course.20261111.v2",
    "nodeId": "node.topic-soft-tissue-sarcoma-desmoid.desmoid-function-course.20261111.v2",
    "questionVariantId": "question.topic-soft-tissue-sarcoma-desmoid.desmoid-function-course.20261111.v2",
    "conceptId": "concept.desmoid.initial-active-surveillance",
    "sourceView": "topic-batch4-soft-tissue-sarcoma-desmoid",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic-soft-tissue-sarcoma-desmoid.desmoid-postoperative-margin.20261111.v1",
    "caseId": "case.topic-soft-tissue-sarcoma-desmoid.desmoid-margin-followup.20261111.v1",
    "nodeId": "node.topic-soft-tissue-sarcoma-desmoid.desmoid-postoperative-margin.20261111.v1",
    "questionVariantId": "question.topic-soft-tissue-sarcoma-desmoid.desmoid-postoperative-margin.20261111.v1",
    "conceptId": "concept.topic-soft-tissue-sarcoma-desmoid.desmoid-postoperative-r1-observation.v1",
    "sourceView": "topic-batch4-soft-tissue-sarcoma-desmoid",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic-soft-tissue-sarcoma-desmoid.desmoid-hereditary-evaluation.20261111.v2",
    "caseId": "case.topic-soft-tissue-sarcoma-desmoid.desmoid-hereditary-evaluation.20261111.v2",
    "nodeId": "node.topic-soft-tissue-sarcoma-desmoid.desmoid-hereditary-evaluation.20261111.v2",
    "questionVariantId": "question.topic-soft-tissue-sarcoma-desmoid.desmoid-hereditary-evaluation.20261111.v2",
    "conceptId": "concept.topic-soft-tissue-sarcoma-desmoid.desmoid-hereditary-colorectal-evaluation.v1",
    "sourceView": "topic-batch4-soft-tissue-sarcoma-desmoid",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic-soft-tissue-sarcoma-desmoid.desmoid-mesenteric-escalation.20261111.v2",
    "caseId": "case.topic-soft-tissue-sarcoma-desmoid.desmoid-mesenteric-escalation.20261111.v2",
    "nodeId": "node.topic-soft-tissue-sarcoma-desmoid.desmoid-mesenteric-escalation.20261111.v2",
    "questionVariantId": "question.topic-soft-tissue-sarcoma-desmoid.desmoid-mesenteric-escalation.20261111.v2",
    "conceptId": "concept.topic-soft-tissue-sarcoma-desmoid.progressive-mesenteric-desmoid-systemic-option.v1",
    "sourceView": "topic-batch4-soft-tissue-sarcoma-desmoid",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic-soft-tissue-sarcoma-desmoid.alt-function-preserving-resection.20261111.v2",
    "caseId": "case.topic-soft-tissue-sarcoma-desmoid.alt-function-preserving-resection.20261111.v2",
    "nodeId": "node.topic-soft-tissue-sarcoma-desmoid.alt-function-preserving-resection.20261111.v2",
    "questionVariantId": "question.topic-soft-tissue-sarcoma-desmoid.alt-function-preserving-resection.20261111.v2",
    "conceptId": "concept.topic-soft-tissue-sarcoma-desmoid.extremity-alt-marginal-resection.v1",
    "sourceView": "topic-batch4-soft-tissue-sarcoma-desmoid",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.liver-benign-portal-infection.adenoma-man-resection.v1",
    "caseId": "case.topic.liver-benign-portal-infection.adenoma-man.v1",
    "nodeId": "node.topic.liver-benign-portal-infection.adenoma-man-resection.v1",
    "questionVariantId": "question.topic.liver-benign-portal-infection.adenoma-man-resection.v1",
    "conceptId": "concept.hepatic-adenoma.resection-in-men",
    "sourceView": "topic-batch4-liver-benign-portal-infection",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.liver-benign-portal-infection.adenoma-beta-catenin.v1",
    "caseId": "case.topic.liver-benign-portal-infection.adenoma-molecular.v1",
    "nodeId": "node.topic.liver-benign-portal-infection.adenoma-beta-catenin.v1",
    "questionVariantId": "question.topic.liver-benign-portal-infection.adenoma-beta-catenin.v1",
    "conceptId": "concept.topic.liver-benign-portal-infection.beta-catenin-adenoma-resection.v1",
    "sourceView": "topic-batch4-liver-benign-portal-infection",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.liver-benign-portal-infection.hemangioma-conservative.v1",
    "caseId": "case.topic.liver-benign-portal-infection.hemangioma.v1",
    "nodeId": "node.topic.liver-benign-portal-infection.hemangioma-conservative.v1",
    "questionVariantId": "question.topic.liver-benign-portal-infection.hemangioma-conservative.v1",
    "conceptId": "concept.topic.liver-benign-portal-infection.typical-hemangioma-conservative.v1",
    "sourceView": "topic-batch4-liver-benign-portal-infection",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.liver-benign-portal-infection.cirrhosis-analgesic.v2",
    "caseId": "case.topic.liver-benign-portal-infection.cirrhosis-analgesic.v2",
    "nodeId": "node.topic.liver-benign-portal-infection.cirrhosis-analgesic.v2",
    "questionVariantId": "question.topic.liver-benign-portal-infection.cirrhosis-analgesic.v2",
    "conceptId": "concept.cirrhosis.analgesic-selection-with-renal-deterioration.v1",
    "sourceView": "topic-batch4-liver-benign-portal-infection",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.liver-benign-portal-infection.cardiac-ascites.v1",
    "caseId": "case.topic.liver-benign-portal-infection.cardiac-fluid.v1",
    "nodeId": "node.topic.liver-benign-portal-infection.cardiac-ascites.v1",
    "questionVariantId": "question.topic.liver-benign-portal-infection.cardiac-ascites.v1",
    "conceptId": "concept.topic.liver-benign-portal-infection.cardiac-ascites.v1",
    "sourceView": "topic-batch4-liver-benign-portal-infection",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.liver-benign-portal-infection.diuretic-volume-loss.v1",
    "caseId": "case.topic.liver-benign-portal-infection.diuretic-fluid.v1",
    "nodeId": "node.topic.liver-benign-portal-infection.diuretic-volume-loss.v1",
    "questionVariantId": "question.topic.liver-benign-portal-infection.diuretic-volume-loss.v1",
    "conceptId": "concept.topic.liver-benign-portal-infection.diuretic-volume-loss.v1",
    "sourceView": "topic-batch4-liver-benign-portal-infection",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.liver-benign-portal-infection.acute-variceal-treatment.v2",
    "caseId": "case.topic.liver-benign-portal-infection.acute-variceal-treatment.v2",
    "nodeId": "node.topic.liver-benign-portal-infection.acute-variceal-treatment.v2",
    "questionVariantId": "question.topic.liver-benign-portal-infection.acute-variceal-treatment.v2",
    "conceptId": "concept.topic.liver-benign-portal-infection.acute-variceal-treatment.v2",
    "sourceView": "topic-batch4-liver-benign-portal-infection",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.liver-benign-portal-infection.preemptive-tips.v1",
    "caseId": "case.topic.liver-benign-portal-infection.bleeding-record.v1",
    "nodeId": "node.topic.liver-benign-portal-infection.preemptive-tips.v1",
    "questionVariantId": "question.topic.liver-benign-portal-infection.preemptive-tips.v1",
    "conceptId": "concept.topic.liver-benign-portal-infection.preemptive-tips.v1",
    "sourceView": "topic-batch4-liver-benign-portal-infection",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.liver-benign-portal-infection.rebleeding-tips.v1",
    "caseId": "case.topic.liver-benign-portal-infection.rebleeding.v1",
    "nodeId": "node.topic.liver-benign-portal-infection.rebleeding-tips.v1",
    "questionVariantId": "question.topic.liver-benign-portal-infection.rebleeding-tips.v1",
    "conceptId": "concept.topic.liver-benign-portal-infection.rebleeding-tips.v1",
    "sourceView": "topic-batch4-liver-benign-portal-infection",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.liver-benign-portal-infection.pyogenic-source-control.v1",
    "caseId": "case.topic.liver-benign-portal-infection.pyogenic.v1",
    "nodeId": "node.topic.liver-benign-portal-infection.pyogenic-source-control.v1",
    "questionVariantId": "question.topic.liver-benign-portal-infection.pyogenic-source-control.v1",
    "conceptId": "concept.topic.liver-benign-portal-infection.pyogenic-source-control.v1",
    "sourceView": "topic-batch4-liver-benign-portal-infection",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.liver-benign-portal-infection.hydatid-biliary-complication.v1",
    "caseId": "case.topic.liver-benign-portal-infection.hydatid.v1",
    "nodeId": "node.topic.liver-benign-portal-infection.hydatid-biliary-complication.v1",
    "questionVariantId": "question.topic.liver-benign-portal-infection.hydatid-biliary-complication.v1",
    "conceptId": "concept.topic.liver-benign-portal-infection.hydatid-biliary-complication.v1",
    "sourceView": "topic-batch4-liver-benign-portal-infection",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thoracic-lung-pleura-mediastinum.psp-size-symptoms.v2",
    "caseId": "case.topic.thoracic-lung-pleura-mediastinum.psp-size-symptoms.v2",
    "nodeId": "node.topic.thoracic-lung-pleura-mediastinum.psp-size-symptoms.v2",
    "questionVariantId": "question.topic.thoracic-lung-pleura-mediastinum.psp-size-symptoms.v2",
    "conceptId": "concept.topic.thoracic-lung-pleura-mediastinum.psp-conservative-selection.v1",
    "sourceView": "topic-batch4-thoracic-lung-pleura-mediastinum",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thoracic-lung-pleura-mediastinum.pleural-drainage.v1",
    "caseId": "case.topic.thoracic-lung-pleura-mediastinum.passed-pleural-drainage.v2",
    "nodeId": "node.topic.thoracic-lung-pleura-mediastinum.pleural-drainage.v1",
    "questionVariantId": "question.topic.thoracic-lung-pleura-mediastinum.pleural-drainage.v1",
    "conceptId": "concept.pleural-infection.intercostal-drain-indication",
    "sourceView": "topic-batch4-thoracic-lung-pleura-mediastinum",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thoracic-lung-pleura-mediastinum.mpe-assess-response.v1",
    "caseId": "case.topic.thoracic-lung-pleura-mediastinum.passed-malignant-fluid.v2",
    "nodeId": "node.topic.thoracic-lung-pleura-mediastinum.mpe-assess-response.v1",
    "questionVariantId": "question.topic.thoracic-lung-pleura-mediastinum.mpe-assess-response.v1",
    "conceptId": "concept.topic.thoracic-lung-pleura-mediastinum.mpe-assess-response.v1",
    "sourceView": "topic-batch4-thoracic-lung-pleura-mediastinum",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thoracic-lung-pleura-mediastinum.ipc-infection-response.v1",
    "caseId": "case.topic.thoracic-lung-pleura-mediastinum.passed-malignant-fluid.v2",
    "nodeId": "node.topic.thoracic-lung-pleura-mediastinum.ipc-infection-response.v1",
    "questionVariantId": "question.topic.thoracic-lung-pleura-mediastinum.ipc-infection-response.v1",
    "conceptId": "concept.topic.thoracic-lung-pleura-mediastinum.ipc-infection-response.v1",
    "sourceView": "topic-batch4-thoracic-lung-pleura-mediastinum",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thoracic-lung-pleura-mediastinum.mpe-lung-expansion.v2",
    "caseId": "case.topic.thoracic-lung-pleura-mediastinum.mpe-lung-expansion.v2",
    "nodeId": "node.topic.thoracic-lung-pleura-mediastinum.mpe-lung-expansion.v2",
    "questionVariantId": "question.topic.thoracic-lung-pleura-mediastinum.mpe-lung-expansion.v2",
    "conceptId": "concept.topic.thoracic-lung-pleura-mediastinum.mpe-lung-expansion.v1",
    "sourceView": "topic-batch4-thoracic-lung-pleura-mediastinum",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thoracic-lung-pleura-mediastinum.mediastinal-tissue-staging.v2",
    "caseId": "case.topic.thoracic-lung-pleura-mediastinum.mediastinal-tissue-staging.v2",
    "nodeId": "node.topic.thoracic-lung-pleura-mediastinum.mediastinal-tissue-staging.v2",
    "questionVariantId": "question.topic.thoracic-lung-pleura-mediastinum.mediastinal-tissue-staging.v2",
    "conceptId": "concept.topic.thoracic-lung-pleura-mediastinum.mediastinal-tissue-staging.v1",
    "sourceView": "topic-batch4-thoracic-lung-pleura-mediastinum",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thoracic-lung-pleura-mediastinum.pleural-dissemination-plan.v1",
    "caseId": "case.topic.thoracic-lung-pleura-mediastinum.passed-pleural-dissemination.v2",
    "nodeId": "node.topic.thoracic-lung-pleura-mediastinum.pleural-dissemination-plan.v1",
    "questionVariantId": "question.topic.thoracic-lung-pleura-mediastinum.pleural-dissemination-plan.v1",
    "conceptId": "concept.topic.thoracic-lung-pleura-mediastinum.pleural-dissemination-plan.v1",
    "sourceView": "topic-batch4-thoracic-lung-pleura-mediastinum",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thoracic-lung-pleura-mediastinum.growing-nodule-pet.v2",
    "caseId": "case.topic.thoracic-lung-pleura-mediastinum.growing-nodule-pet.v2",
    "nodeId": "node.topic.thoracic-lung-pleura-mediastinum.growing-nodule-pet.v2",
    "questionVariantId": "question.topic.thoracic-lung-pleura-mediastinum.growing-nodule-pet.v2",
    "conceptId": "concept.topic.thoracic-lung-pleura-mediastinum.growing-nodule-pet.v2",
    "sourceView": "topic-batch4-thoracic-lung-pleura-mediastinum",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thoracic-lung-pleura-mediastinum.thymic-resection-plan.v2",
    "caseId": "case.topic.thoracic-lung-pleura-mediastinum.thymic-resection-plan.v2",
    "nodeId": "node.topic.thoracic-lung-pleura-mediastinum.thymic-resection-plan.v2",
    "questionVariantId": "question.topic.thoracic-lung-pleura-mediastinum.thymic-resection-plan.v2",
    "conceptId": "concept.topic.thoracic-lung-pleura-mediastinum.thymic-resection-plan.v1",
    "sourceView": "topic-batch4-thoracic-lung-pleura-mediastinum",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.thoracic-lung-pleura-mediastinum.invasive-mediastinal-core.v1",
    "caseId": "case.topic.thoracic-lung-pleura-mediastinum.mediastinal-biopsy.v1",
    "nodeId": "node.topic.thoracic-lung-pleura-mediastinum.invasive-mediastinal-core.v1",
    "questionVariantId": "question.topic.thoracic-lung-pleura-mediastinum.invasive-mediastinal-core.v1",
    "conceptId": "concept.topic.thoracic-lung-pleura-mediastinum.invasive-mediastinal-core.v1",
    "sourceView": "topic-batch4-thoracic-lung-pleura-mediastinum",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.transplant-immunosuppression.renal-biopsy.v1",
    "caseId": "case.topic.transplant-immunosuppression.kidney-dysfunction.v1",
    "nodeId": "node.topic.transplant-immunosuppression.renal-biopsy.v1",
    "questionVariantId": "question.topic.transplant-immunosuppression.renal-biopsy.v1",
    "conceptId": "concept.transplant-immunosuppression.renal-biopsy.v1",
    "sourceView": "topic-batch4-transplant-immunosuppression",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.transplant-immunosuppression.cellular-rescue.v1",
    "caseId": "case.topic.transplant-immunosuppression.cellular-rescue-followup.v1",
    "nodeId": "node.topic.transplant-immunosuppression.cellular-rescue.v1",
    "questionVariantId": "question.topic.transplant-immunosuppression.cellular-rescue.v1",
    "conceptId": "concept.transplant-immunosuppression.cellular-rescue.v1",
    "sourceView": "topic-batch4-transplant-immunosuppression",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.transplant-immunosuppression.bk-plasma-before-reduction.v1",
    "caseId": "case.topic.transplant-immunosuppression.bk-course.v1",
    "nodeId": "node.topic.transplant-immunosuppression.bk-plasma-before-reduction.v1",
    "questionVariantId": "question.topic.transplant-immunosuppression.bk-plasma-before-reduction.v1",
    "conceptId": "concept.transplant-immunosuppression.bk-plasma-before-reduction.v1",
    "sourceView": "topic-batch4-transplant-immunosuppression",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.transplant-immunosuppression.bk-biopsy-reduction.v1",
    "caseId": "case.topic.transplant-immunosuppression.bk-course.v1",
    "nodeId": "node.topic.transplant-immunosuppression.bk-biopsy-reduction.v1",
    "questionVariantId": "question.topic.transplant-immunosuppression.bk-biopsy-reduction.v1",
    "conceptId": "concept.transplant-immunosuppression.bk-biopsy-reduction.v1",
    "sourceView": "topic-batch4-transplant-immunosuppression",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.transplant-immunosuppression.ptld-discordant-tissue.v1",
    "caseId": "case.topic.transplant-immunosuppression.ptld-course.v1",
    "nodeId": "node.topic.transplant-immunosuppression.ptld-discordant-tissue.v1",
    "questionVariantId": "question.topic.transplant-immunosuppression.ptld-discordant-tissue.v1",
    "conceptId": "concept.ptld.tissue-diagnosis-coordination",
    "sourceView": "topic-batch4-transplant-immunosuppression",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.transplant-immunosuppression.cmv-tissue-not-blood.v1",
    "caseId": "case.topic.transplant-immunosuppression.cmv-gut-course.v1",
    "nodeId": "node.topic.transplant-immunosuppression.cmv-tissue-not-blood.v1",
    "questionVariantId": "question.topic.transplant-immunosuppression.cmv-tissue-not-blood.v1",
    "conceptId": "concept.transplant-immunosuppression.cmv-tissue-not-blood.v1",
    "sourceView": "topic-batch4-transplant-immunosuppression",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.transplant-immunosuppression.aza-allopurinol.v1",
    "caseId": "case.topic.transplant-immunosuppression.pregnancy-medicine-course.v1",
    "nodeId": "node.topic.transplant-immunosuppression.aza-allopurinol.v1",
    "questionVariantId": "question.topic.transplant-immunosuppression.aza-allopurinol.v1",
    "conceptId": "concept.transplant-immunosuppression.aza-allopurinol.v1",
    "sourceView": "topic-batch4-transplant-immunosuppression",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.transplant-immunosuppression.dgf-cni-continuation.v1",
    "caseId": "case.topic.transplant-immunosuppression.delayed-function.v1",
    "nodeId": "node.topic.transplant-immunosuppression.dgf-cni-continuation.v1",
    "questionVariantId": "question.topic.transplant-immunosuppression.dgf-cni-continuation.v1",
    "conceptId": "concept.transplant-immunosuppression.dgf-cni-continuation.v1",
    "sourceView": "topic-batch4-transplant-immunosuppression",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.transplant-immunosuppression.cellular-steroids.v2",
    "caseId": "case.topic.transplant-immunosuppression.cellular-steroids-correction.v2",
    "nodeId": "node.topic.transplant-immunosuppression.cellular-steroids.v2",
    "questionVariantId": "question.topic.transplant-immunosuppression.cellular-steroids.v2",
    "conceptId": "concept.transplant-immunosuppression.cellular-steroids.v1",
    "sourceView": "topic-batch4-transplant-immunosuppression",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.transplant-immunosuppression.bk-function-discordance.v2",
    "caseId": "case.topic.transplant-immunosuppression.bk-function-discordance-correction.v2",
    "nodeId": "node.topic.transplant-immunosuppression.bk-function-discordance.v2",
    "questionVariantId": "question.topic.transplant-immunosuppression.bk-function-discordance.v2",
    "conceptId": "concept.transplant-immunosuppression.bk-function-discordance.v1",
    "sourceView": "topic-batch4-transplant-immunosuppression",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.transplant-immunosuppression.tac-high-exposure.v2",
    "caseId": "case.topic.transplant-immunosuppression.tac-high-exposure-correction.v2",
    "nodeId": "node.topic.transplant-immunosuppression.tac-high-exposure.v2",
    "questionVariantId": "question.topic.transplant-immunosuppression.tac-high-exposure.v2",
    "conceptId": "concept.transplant-immunosuppression.renal-biopsy.v1",
    "sourceView": "topic-batch4-transplant-immunosuppression",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.transplant-immunosuppression.tac-sample-validity.v2",
    "caseId": "case.topic.transplant-immunosuppression.tac-sample-validity-correction.v2",
    "nodeId": "node.topic.transplant-immunosuppression.tac-sample-validity.v2",
    "questionVariantId": "question.topic.transplant-immunosuppression.tac-sample-validity.v2",
    "conceptId": "concept.transplant-immunosuppression.tac-sample-validity.v1",
    "sourceView": "topic-batch4-transplant-immunosuppression",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.transplant-immunosuppression.cmv-severe-route.v2",
    "caseId": "case.topic.transplant-immunosuppression.cmv-severe-route-correction.v2",
    "nodeId": "node.topic.transplant-immunosuppression.cmv-severe-route.v2",
    "questionVariantId": "question.topic.transplant-immunosuppression.cmv-severe-route.v2",
    "conceptId": "concept.transplant-immunosuppression.cmv-severe-route.v2",
    "sourceView": "topic-batch4-transplant-immunosuppression",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.transplant-immunosuppression.cmv-leukopenia.v2",
    "caseId": "case.topic.transplant-immunosuppression.cmv-leukopenia-correction.v2",
    "nodeId": "node.topic.transplant-immunosuppression.cmv-leukopenia.v2",
    "questionVariantId": "question.topic.transplant-immunosuppression.cmv-leukopenia.v2",
    "conceptId": "concept.transplant-immunosuppression.cmv-leukopenia.v1",
    "sourceView": "topic-batch4-transplant-immunosuppression",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.transplant-immunosuppression.active-amr-backbone.v2",
    "caseId": "case.topic.transplant-immunosuppression.active-amr-backbone-correction.v2",
    "nodeId": "node.topic.transplant-immunosuppression.active-amr-backbone.v2",
    "questionVariantId": "question.topic.transplant-immunosuppression.active-amr-backbone.v2",
    "conceptId": "concept.transplant-immunosuppression.active-amr-backbone.v1",
    "sourceView": "topic-batch4-transplant-immunosuppression",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.transplant-immunosuppression.dgf-biopsy.v2",
    "caseId": "case.topic.transplant-immunosuppression.dgf-biopsy-correction.v2",
    "nodeId": "node.topic.transplant-immunosuppression.dgf-biopsy.v2",
    "questionVariantId": "question.topic.transplant-immunosuppression.dgf-biopsy.v2",
    "conceptId": "concept.transplant-immunosuppression.dgf-biopsy.v2",
    "sourceView": "topic-batch4-transplant-immunosuppression",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.oncology-genetics-principles.apc-child-testing.v2",
    "caseId": "case.topic.oncology-genetics-principles.apc-child-testing.standalone.v2",
    "nodeId": "node.topic.oncology-genetics-principles.apc-child-testing.v2",
    "questionVariantId": "question.topic.oncology-genetics-principles.apc-child-testing.v2",
    "conceptId": "concept.topic.oncology-genetics-principles.childhood-actionable-predictive-testing.v1",
    "sourceView": "topic-batch4-oncology-genetics-principles",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.oncology-genetics-principles.true-negative-plus-vus.v1",
    "caseId": "case.topic.oncology-genetics-principles.true-negative-plus-vus.standalone.v2",
    "nodeId": "node.topic.oncology-genetics-principles.true-negative-plus-vus.v1",
    "questionVariantId": "question.topic.oncology-genetics-principles.true-negative-plus-vus.v1",
    "conceptId": "concept.topic.oncology-genetics-principles.true-negative-with-nonactionable-vus.v1",
    "sourceView": "topic-batch4-oncology-genetics-principles",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.oncology-genetics-principles.other-family-branch.v2",
    "caseId": "case.topic.oncology-genetics-principles.other-family-branch.standalone.v2",
    "nodeId": "node.topic.oncology-genetics-principles.other-family-branch.v2",
    "questionVariantId": "question.topic.oncology-genetics-principles.other-family-branch.v2",
    "conceptId": "concept.topic.oncology-genetics-principles.informative-affected-relative.v1",
    "sourceView": "topic-batch4-oncology-genetics-principles",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.oncology-genetics-principles.bevacizumab-open-wound.v1",
    "caseId": "case.topic.oncology-genetics-principles.bevacizumab-open-wound.standalone.v2",
    "nodeId": "node.topic.oncology-genetics-principles.bevacizumab-open-wound.v1",
    "questionVariantId": "question.topic.oncology-genetics-principles.bevacizumab-open-wound.v1",
    "conceptId": "concept.topic.oncology-genetics-principles.bevacizumab-healing-beyond-calendar.v1",
    "sourceView": "topic-batch4-oncology-genetics-principles",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.oncology-genetics-principles.checkpoint-colitis.v1",
    "caseId": "case.topic.oncology-genetics-principles.checkpoint-colitis.standalone.v2",
    "nodeId": "node.topic.oncology-genetics-principles.checkpoint-colitis.v1",
    "questionVariantId": "question.topic.oncology-genetics-principles.checkpoint-colitis.v1",
    "conceptId": "concept.topic.oncology-genetics-principles.checkpoint-colitis-first-immunosuppression.v1",
    "sourceView": "topic-batch4-oncology-genetics-principles",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.oncology-genetics-principles.refractory-colitis-infection.v2",
    "caseId": "case.topic.oncology-genetics-principles.refractory-colitis-infection.standalone.v2",
    "nodeId": "node.topic.oncology-genetics-principles.refractory-colitis-infection.v2",
    "questionVariantId": "question.topic.oncology-genetics-principles.refractory-colitis-infection.v2",
    "conceptId": "concept.topic.oncology-genetics-principles.refractory-checkpoint-colitis-infectious-reassessment.v1",
    "sourceView": "topic-batch4-oncology-genetics-principles",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.oncology-genetics-principles.rasburicase-reexposure.v2",
    "caseId": "case.topic.oncology-genetics-principles.rasburicase-reexposure.standalone.v2",
    "nodeId": "node.topic.oncology-genetics-principles.rasburicase-reexposure.v2",
    "questionVariantId": "question.topic.oncology-genetics-principles.rasburicase-reexposure.v2",
    "conceptId": "concept.topic.oncology-genetics-principles.rasburicase-oxidative-toxicity-no-rechallenge.v1",
    "sourceView": "topic-batch4-oncology-genetics-principles",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.stomach-neoplasia.occult-peritoneal-staging.v1",
    "caseId": "case.topic.stomach-neoplasia.diffuse-gastric-cancer.v1",
    "nodeId": "node.topic.stomach-neoplasia.occult-peritoneal-staging.v1",
    "questionVariantId": "question.topic.stomach-neoplasia.occult-peritoneal-staging.v1",
    "conceptId": "concept.topic.stomach-neoplasia.occult-peritoneal-staging.v1",
    "sourceView": "topic-batch4-stomach-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.stomach-neoplasia.preinitial-positive-washings.v1",
    "caseId": "case.topic.stomach-neoplasia.diffuse-gastric-cancer.v1",
    "nodeId": "node.topic.stomach-neoplasia.preinitial-positive-washings.v1",
    "questionVariantId": "question.topic.stomach-neoplasia.preinitial-positive-washings.v1",
    "conceptId": "concept.topic.stomach-neoplasia.preinitial-positive-washings.v1",
    "sourceView": "topic-batch4-stomach-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.stomach-neoplasia.endoscopic-lymphatic-risk.v1",
    "caseId": "case.topic.stomach-neoplasia.endoscopic-resection.v1",
    "nodeId": "node.topic.stomach-neoplasia.endoscopic-lymphatic-risk.v1",
    "questionVariantId": "question.topic.stomach-neoplasia.endoscopic-lymphatic-risk.v1",
    "conceptId": "concept.topic.stomach-neoplasia.endoscopic-lymphatic-risk.v1",
    "sourceView": "topic-batch4-stomach-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.stomach-neoplasia.upfront-d2-adjuvant.v1",
    "caseId": "case.topic.stomach-neoplasia.postgastrectomy-records.v1",
    "nodeId": "node.topic.stomach-neoplasia.upfront-d2-adjuvant.v1",
    "questionVariantId": "question.topic.stomach-neoplasia.upfront-d2-adjuvant.v1",
    "conceptId": "concept.topic.stomach-neoplasia.upfront-d2-adjuvant.v1",
    "sourceView": "topic-batch4-stomach-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.stomach-neoplasia.localized-gist-operation.v1",
    "caseId": "case.topic.stomach-neoplasia.fundic-gist-resection.v1",
    "nodeId": "node.topic.stomach-neoplasia.localized-gist-operation.v1",
    "questionVariantId": "question.topic.stomach-neoplasia.localized-gist-operation.v1",
    "conceptId": "concept.topic.stomach-neoplasia.localized-gist-operation.v1",
    "sourceView": "topic-batch4-stomach-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.stomach-neoplasia.r1-without-rupture.v1",
    "caseId": "case.topic.stomach-neoplasia.fundic-gist-resection.v1",
    "nodeId": "node.topic.stomach-neoplasia.r1-without-rupture.v1",
    "questionVariantId": "question.topic.stomach-neoplasia.r1-without-rupture.v1",
    "conceptId": "concept.topic.stomach-neoplasia.r1-without-rupture.v1",
    "sourceView": "topic-batch4-stomach-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.stomach-neoplasia.resected-d842v.v1",
    "caseId": "case.topic.stomach-neoplasia.resected-molecular-records.v1",
    "nodeId": "node.topic.stomach-neoplasia.resected-d842v.v1",
    "questionVariantId": "question.topic.stomach-neoplasia.resected-d842v.v1",
    "conceptId": "concept.topic.stomach-neoplasia.resected-d842v.v1",
    "sourceView": "topic-batch4-stomach-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.stomach-neoplasia.kit-exon11-neoadjuvant.v2",
    "caseId": "case.topic.stomach-neoplasia.cardia-gist-treatment-review.v2",
    "nodeId": "node.topic.stomach-neoplasia.kit-exon11-neoadjuvant.v2",
    "questionVariantId": "question.topic.stomach-neoplasia.kit-exon11-neoadjuvant.v2",
    "conceptId": "concept.gastric-gist.mutation-guided-neoadjuvant-imatinib",
    "sourceView": "topic-batch4-stomach-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.stomach-neoplasia.attenuation-versus-diameter.v2",
    "caseId": "case.topic.stomach-neoplasia.gist-response-record-review.v2",
    "nodeId": "node.topic.stomach-neoplasia.attenuation-versus-diameter.v2",
    "questionVariantId": "question.topic.stomach-neoplasia.attenuation-versus-diameter.v2",
    "conceptId": "concept.topic.stomach-neoplasia.attenuation-versus-diameter.v1",
    "sourceView": "topic-batch4-stomach-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.stomach-neoplasia.metastatic-remission-continuation.v2",
    "caseId": "case.topic.stomach-neoplasia.metastatic-gist-maintenance-review.v2",
    "nodeId": "node.topic.stomach-neoplasia.metastatic-remission-continuation.v2",
    "questionVariantId": "question.topic.stomach-neoplasia.metastatic-remission-continuation.v2",
    "conceptId": "concept.topic.stomach-neoplasia.metastatic-remission-continuation.v1",
    "sourceView": "topic-batch4-stomach-neoplasia",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-structural-inflammatory-emergencies.bone-film-complication-imaging.v1",
    "caseId": "case.topic.esophagus-structural-inflammatory-emergencies.foreign-body-chart-bone-film-complication-imaging-pass.v2",
    "nodeId": "node.topic.esophagus-structural-inflammatory-emergencies.bone-film-complication-imaging.v1",
    "questionVariantId": "question.topic.esophagus-structural-inflammatory-emergencies.bone-film-complication-imaging.v1",
    "conceptId": "concept.esophagus-structural-inflammatory-emergencies.bone-film-complication-imaging.v1",
    "sourceView": "topic-batch4-esophagus-structural-inflammatory-emergencies",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-structural-inflammatory-emergencies.contained-perforation-surveillance.v2",
    "caseId": "case.topic.esophagus-structural-inflammatory-emergencies.contained-perforation-surveillance-revision.v2",
    "nodeId": "node.topic.esophagus-structural-inflammatory-emergencies.contained-perforation-surveillance.v2",
    "questionVariantId": "question.topic.esophagus-structural-inflammatory-emergencies.contained-perforation-surveillance.v2",
    "conceptId": "concept.esophagus-structural-inflammatory-emergencies.contained-perforation-surveillance.v1",
    "sourceView": "topic-batch4-esophagus-structural-inflammatory-emergencies",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-structural-inflammatory-emergencies.free-perforation-repair.v1",
    "caseId": "case.topic.esophagus-structural-inflammatory-emergencies.perforation-chart-free-perforation-repair-pass.v2",
    "nodeId": "node.topic.esophagus-structural-inflammatory-emergencies.free-perforation-repair.v1",
    "questionVariantId": "question.topic.esophagus-structural-inflammatory-emergencies.free-perforation-repair.v1",
    "conceptId": "concept.esophagus-structural-inflammatory-emergencies.free-perforation-repair.v1",
    "sourceView": "topic-batch4-esophagus-structural-inflammatory-emergencies",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-structural-inflammatory-emergencies.caustic-loss-enhancement.v1",
    "caseId": "case.topic.esophagus-structural-inflammatory-emergencies.caustic-chart-caustic-loss-enhancement-pass.v2",
    "nodeId": "node.topic.esophagus-structural-inflammatory-emergencies.caustic-loss-enhancement.v1",
    "questionVariantId": "question.topic.esophagus-structural-inflammatory-emergencies.caustic-loss-enhancement.v1",
    "conceptId": "concept.esophagus-structural-inflammatory-emergencies.caustic-loss-enhancement.v1",
    "sourceView": "topic-batch4-esophagus-structural-inflammatory-emergencies",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-structural-inflammatory-emergencies.caustic-complex-stricture.v2",
    "caseId": "case.topic.esophagus-structural-inflammatory-emergencies.caustic-complex-stricture-revision.v2",
    "nodeId": "node.topic.esophagus-structural-inflammatory-emergencies.caustic-complex-stricture.v2",
    "questionVariantId": "question.topic.esophagus-structural-inflammatory-emergencies.caustic-complex-stricture.v2",
    "conceptId": "concept.esophagus-structural-inflammatory-emergencies.caustic-complex-stricture.v1",
    "sourceView": "topic-batch4-esophagus-structural-inflammatory-emergencies",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-structural-inflammatory-emergencies.zenker-limited-neck-access.v1",
    "caseId": "case.topic.esophagus-structural-inflammatory-emergencies.zenker-treatment.v1",
    "nodeId": "node.topic.esophagus-structural-inflammatory-emergencies.zenker-limited-neck-access.v1",
    "questionVariantId": "question.topic.esophagus-structural-inflammatory-emergencies.zenker-limited-neck-access.v1",
    "conceptId": "concept.esophagus-structural-inflammatory-emergencies.zenker-limited-neck-access.v1",
    "sourceView": "topic-batch4-esophagus-structural-inflammatory-emergencies",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-structural-inflammatory-emergencies.cancer-local-margin-retreatment.v2",
    "caseId": "case.topic.esophagus-structural-inflammatory-emergencies.cancer-local-margin-retreatment-revision.v2",
    "nodeId": "node.topic.esophagus-structural-inflammatory-emergencies.cancer-local-margin-retreatment.v2",
    "questionVariantId": "question.topic.esophagus-structural-inflammatory-emergencies.cancer-local-margin-retreatment.v2",
    "conceptId": "concept.esophagus-structural-inflammatory-emergencies.cancer-local-margin-retreatment.v1",
    "sourceView": "topic-batch4-esophagus-structural-inflammatory-emergencies",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-structural-inflammatory-emergencies.cancer-clear-margins-lymphovascular.v1",
    "caseId": "case.topic.esophagus-structural-inflammatory-emergencies.cancer-lymphovascular.v1",
    "nodeId": "node.topic.esophagus-structural-inflammatory-emergencies.cancer-clear-margins-lymphovascular.v1",
    "questionVariantId": "question.topic.esophagus-structural-inflammatory-emergencies.cancer-clear-margins-lymphovascular.v1",
    "conceptId": "concept.esophagus-structural-inflammatory-emergencies.cancer-clear-margins-lymphovascular.v1",
    "sourceView": "topic-batch4-esophagus-structural-inflammatory-emergencies",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.wound-healing-immunology.prepared-bed.v1",
    "caseId": "case.topic.wound-healing-immunology.staged-coverage.v1",
    "nodeId": "node.topic.wound-healing-immunology.prepared-bed.v1",
    "questionVariantId": "question.topic.wound-healing-immunology.prepared-bed.v1",
    "conceptId": "concept.n2r3.recipient-bed-interval-coverage",
    "sourceView": "topic-batch4-wound-healing-immunology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.wound-healing-immunology.graft-thickness.v1",
    "caseId": "case.topic.wound-healing-immunology.contracture-coverage.v1",
    "nodeId": "node.topic.wound-healing-immunology.graft-thickness.v1",
    "questionVariantId": "question.topic.wound-healing-immunology.graft-thickness.v1",
    "conceptId": "concept.topic.wound-healing-immunology.graft-dermis-functional-contraction.v1",
    "sourceView": "topic-batch4-wound-healing-immunology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.wound-healing-immunology.scar-contracture.v1",
    "caseId": "case.topic.wound-healing-immunology.scar-function.v1",
    "nodeId": "node.topic.wound-healing-immunology.scar-contracture.v1",
    "questionVariantId": "question.topic.wound-healing-immunology.scar-contracture.v1",
    "conceptId": "concept.topic.wound-healing-immunology.scar-functional-release.v1",
    "sourceView": "topic-batch4-wound-healing-immunology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.wound-healing-immunology.dirty-completed-series.v1",
    "caseId": "case.topic.wound-healing-immunology.hand-laceration.v1",
    "nodeId": "node.topic.wound-healing-immunology.dirty-completed-series.v1",
    "questionVariantId": "question.topic.wound-healing-immunology.dirty-completed-series.v1",
    "conceptId": "concept.prototype.laceration.tetanus",
    "sourceView": "topic-batch4-wound-healing-immunology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.wound-healing-immunology.dirty-uncertain-series.v1",
    "caseId": "case.topic.wound-healing-immunology.uncertain-immunization.v1",
    "nodeId": "node.topic.wound-healing-immunology.dirty-uncertain-series.v1",
    "questionVariantId": "question.topic.wound-healing-immunology.dirty-uncertain-series.v1",
    "conceptId": "concept.prototype.laceration.tetanus",
    "sourceView": "topic-batch4-wound-healing-immunology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.wound-healing-immunology.graft-fluid.v2",
    "caseId": "case.topic.wound-healing-immunology.revision-graft-fluid.v2",
    "nodeId": "node.topic.wound-healing-immunology.graft-fluid.v2",
    "questionVariantId": "question.topic.wound-healing-immunology.graft-fluid.v2",
    "conceptId": "concept.topic.wound-healing-immunology.graft-apposition-rescue.v1",
    "sourceView": "topic-batch4-wound-healing-immunology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.wound-healing-immunology.hiv-recent-series.v2",
    "caseId": "case.topic.wound-healing-immunology.revision-hiv-recent-series.v2",
    "nodeId": "node.topic.wound-healing-immunology.hiv-recent-series.v2",
    "questionVariantId": "question.topic.wound-healing-immunology.hiv-recent-series.v2",
    "conceptId": "concept.prototype.laceration.tetanus",
    "sourceView": "topic-batch4-wound-healing-immunology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.wound-healing-immunology.scar-like-nodule.v2",
    "caseId": "case.topic.wound-healing-immunology.revision-scar-like-nodule.v2",
    "nodeId": "node.topic.wound-healing-immunology.scar-like-nodule.v2",
    "questionVariantId": "question.topic.wound-healing-immunology.scar-like-nodule.v2",
    "conceptId": "concept.topic.wound-healing-immunology.scar-mimic-representative-biopsy.v1",
    "sourceView": "topic-batch4-wound-healing-immunology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.wound-healing-immunology.flap-exploration.v2",
    "caseId": "case.topic.wound-healing-immunology.revision-flap-exploration.v2",
    "nodeId": "node.topic.wound-healing-immunology.flap-exploration.v2",
    "questionVariantId": "question.topic.wound-healing-immunology.flap-exploration.v2",
    "conceptId": "concept.topic.wound-healing-immunology.threatened-flap-outflow-exploration.v1",
    "sourceView": "topic-batch4-wound-healing-immunology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.biliary-injury-malignancy.communicating-leak-stent.v1",
    "caseId": "case.topic.biliary-injury-malignancy.communicating-leak.v1",
    "nodeId": "node.topic.biliary-injury-malignancy.communicating-leak-stent.v1",
    "questionVariantId": "question.topic.biliary-injury-malignancy.communicating-leak-stent.v1",
    "conceptId": "concept.bile-leak.minor-leak-ercp-stent",
    "sourceView": "topic-batch4-biliary-injury-malignancy",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.biliary-injury-malignancy.perihilar-tissue-route.v1",
    "caseId": "case.topic.biliary-injury-malignancy.perihilar.v1",
    "nodeId": "node.topic.biliary-injury-malignancy.perihilar-tissue-route.v1",
    "questionVariantId": "question.topic.biliary-injury-malignancy.perihilar-tissue-route.v1",
    "conceptId": "concept.topic.biliary-injury-malignancy.perihilar-tissue-route.v1",
    "sourceView": "topic-batch4-biliary-injury-malignancy",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.biliary-injury-malignancy.vascular-collection-imaging.v1",
    "caseId": "case.topic.biliary-injury-malignancy.vasculobiliary.v1",
    "nodeId": "node.topic.biliary-injury-malignancy.vascular-collection-imaging.v1",
    "questionVariantId": "question.topic.biliary-injury-malignancy.vascular-collection-imaging.v1",
    "conceptId": "concept.topic.biliary-injury-malignancy.vascular-collection-imaging.v1",
    "sourceView": "topic-batch4-biliary-injury-malignancy",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1",
    "caseId": "case.topic.biliary-injury-malignancy.palliation.v1",
    "nodeId": "node.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1",
    "questionVariantId": "question.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1",
    "conceptId": "concept.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1",
    "sourceView": "topic-batch4-biliary-injury-malignancy",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.biliary-injury-malignancy.main-duct-discontinuity.v2",
    "caseId": "case.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.main-duct-discontinuity.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.main-duct-discontinuity.v2",
    "conceptId": "concept.topic.biliary-injury-malignancy.main-duct-discontinuity.v2",
    "sourceView": "topic-batch4-biliary-injury-malignancy",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.biliary-injury-malignancy.t2-margin-directed-completion.v2",
    "caseId": "case.topic.biliary-injury-malignancy.r2.t2-margin-directed-completion.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.t2-margin-directed-completion.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.t2-margin-directed-completion.v2",
    "conceptId": "concept.topic.biliary-injury-malignancy.t2-margin-directed-completion.v1",
    "sourceView": "topic-batch4-biliary-injury-malignancy",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.biliary-injury-malignancy.type-i-cyst-excision.v2",
    "caseId": "case.topic.biliary-injury-malignancy.r2.type-i-cyst-excision.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.type-i-cyst-excision.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.type-i-cyst-excision.v2",
    "conceptId": "concept.topic.biliary-injury-malignancy.type-i-cyst-excision.v1",
    "sourceView": "topic-batch4-biliary-injury-malignancy",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.biliary-injury-malignancy.future-remnant-drainage.v2",
    "caseId": "case.topic.biliary-injury-malignancy.r2.future-remnant-drainage.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.future-remnant-drainage.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.future-remnant-drainage.v2",
    "conceptId": "concept.topic.biliary-injury-malignancy.future-remnant-drainage.v2",
    "sourceView": "topic-batch4-biliary-injury-malignancy",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.biliary-injury-malignancy.benign-continuity-stenting.v2",
    "caseId": "case.topic.biliary-injury-malignancy.r2.benign-continuity-stenting.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.benign-continuity-stenting.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.benign-continuity-stenting.v2",
    "conceptId": "concept.topic.biliary-injury-malignancy.benign-continuity-stenting.v2",
    "sourceView": "topic-batch4-biliary-injury-malignancy",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.ostomy-enterocutaneous-fistula.ecf-source-control.v2",
    "caseId": "case.topic.ostomy-enterocutaneous-fistula.revision-ecf-source-control.v2",
    "nodeId": "node.topic.ostomy-enterocutaneous-fistula.ecf-source-control.v2",
    "questionVariantId": "question.topic.ostomy-enterocutaneous-fistula.ecf-source-control.v2",
    "conceptId": "concept.ostomy-enterocutaneous-fistula.ecf-source-control.v1",
    "sourceView": "topic-batch4-ostomy-enterocutaneous-fistula",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.ostomy-enterocutaneous-fistula.ecf-acute-operation-goal.v1",
    "caseId": "case.topic.ostomy-enterocutaneous-fistula.split-pass-ecf-acute-operation-goal.v1",
    "nodeId": "node.topic.ostomy-enterocutaneous-fistula.ecf-acute-operation-goal.v1",
    "questionVariantId": "question.topic.ostomy-enterocutaneous-fistula.ecf-acute-operation-goal.v1",
    "conceptId": "concept.ostomy-enterocutaneous-fistula.ecf-acute-operation-goal.v1",
    "sourceView": "topic-batch4-ostomy-enterocutaneous-fistula",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.ostomy-enterocutaneous-fistula.ecf-resection.v1",
    "caseId": "case.topic.ostomy-enterocutaneous-fistula.split-pass-ecf-resection.v1",
    "nodeId": "node.topic.ostomy-enterocutaneous-fistula.ecf-resection.v1",
    "questionVariantId": "question.topic.ostomy-enterocutaneous-fistula.ecf-resection.v1",
    "conceptId": "concept.ostomy-enterocutaneous-fistula.ecf-resection.v1",
    "sourceView": "topic-batch4-ostomy-enterocutaneous-fistula",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.ostomy-enterocutaneous-fistula.obstruction-after-reduction.v2",
    "caseId": "case.topic.ostomy-enterocutaneous-fistula.revision-obstruction-after-reduction.v2",
    "nodeId": "node.topic.ostomy-enterocutaneous-fistula.obstruction-after-reduction.v2",
    "questionVariantId": "question.topic.ostomy-enterocutaneous-fistula.obstruction-after-reduction.v2",
    "conceptId": "concept.ostomy-enterocutaneous-fistula.obstruction-after-reduction.v1",
    "sourceView": "topic-batch4-ostomy-enterocutaneous-fistula",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.ostomy-enterocutaneous-fistula.new-output-infection-survey.v1",
    "caseId": "case.topic.ostomy-enterocutaneous-fistula.new-output-fever-record.v1",
    "nodeId": "node.topic.ostomy-enterocutaneous-fistula.new-output-infection-survey.v1",
    "questionVariantId": "question.topic.ostomy-enterocutaneous-fistula.new-output-infection-survey.v1",
    "conceptId": "concept.ostomy-enterocutaneous-fistula.new-output-infection-survey.v1",
    "sourceView": "topic-batch4-ostomy-enterocutaneous-fistula",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.spleen-asplenia.itp-etiology.20261111.v1",
    "caseId": "case.spleen-asplenia.early-itp-pass-standalone.20261111.v1",
    "nodeId": "node.spleen-asplenia.itp-etiology.20261111.v1",
    "questionVariantId": "question.spleen-asplenia.itp-etiology.20261111.v1",
    "conceptId": "concept.persistent-itp.hiv-hcv-secondary-evaluation",
    "sourceView": "topic-batch4-spleen-asplenia",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.spleen-asplenia.hs-biliary-operation.20261111.v1",
    "caseId": "case.spleen-asplenia.hs-biliary.20261111.v1",
    "nodeId": "node.spleen-asplenia.hs-biliary-operation.20261111.v1",
    "questionVariantId": "question.spleen-asplenia.hs-biliary-operation.20261111.v1",
    "conceptId": "concept.spleen-asplenia.hs-independent-splenic-indication.v1",
    "sourceView": "topic-batch4-spleen-asplenia",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.spleen-asplenia.rituximab-vaccine-response.20261111.v1",
    "caseId": "case.spleen-asplenia.immune-response-preparation.20261111.v1",
    "nodeId": "node.spleen-asplenia.rituximab-vaccine-response.20261111.v1",
    "questionVariantId": "question.spleen-asplenia.rituximab-vaccine-response.20261111.v1",
    "conceptId": "concept.spleen-asplenia.anti-b-cell-preop-vaccine-response.v1",
    "sourceView": "topic-batch4-spleen-asplenia",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.spleen-asplenia.vaccine-operative-calendar.20261111.v2",
    "caseId": "case.spleen-asplenia.vaccine-operative-calendar-review-response.20261111.v2",
    "nodeId": "node.spleen-asplenia.vaccine-operative-calendar.20261111.v2",
    "questionVariantId": "question.spleen-asplenia.vaccine-operative-calendar.20261111.v2",
    "conceptId": "concept.elective-splenectomy.encapsulated-organism-vaccine-review",
    "sourceView": "topic-batch4-spleen-asplenia",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.spleen-asplenia.hs-persistent-severity.20261111.v2",
    "caseId": "case.spleen-asplenia.hs-persistent-severity-review-response.20261111.v2",
    "nodeId": "node.spleen-asplenia.hs-persistent-severity.20261111.v2",
    "questionVariantId": "question.spleen-asplenia.hs-persistent-severity.20261111.v2",
    "conceptId": "concept.spleen-asplenia.hs-splenectomy-clinical-severity.v1",
    "sourceView": "topic-batch4-spleen-asplenia",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.spleen-asplenia.xerocytosis-operative-stop.20261111.v2",
    "caseId": "case.spleen-asplenia.xerocytosis-operative-stop-review-response.20261111.v2",
    "nodeId": "node.spleen-asplenia.xerocytosis-operative-stop.20261111.v2",
    "questionVariantId": "question.spleen-asplenia.xerocytosis-operative-stop.20261111.v2",
    "conceptId": "concept.spleen-asplenia.xerocytosis-before-splenectomy.v1",
    "sourceView": "topic-batch4-spleen-asplenia",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.spleen-asplenia.menb-missing-coverage.20261111.v2",
    "caseId": "case.spleen-asplenia.menb-missing-coverage-review-response.20261111.v2",
    "nodeId": "node.spleen-asplenia.menb-missing-coverage.20261111.v2",
    "questionVariantId": "question.spleen-asplenia.menb-missing-coverage.20261111.v2",
    "conceptId": "concept.spleen-asplenia.menb-risk-based-coverage.v1",
    "sourceView": "topic-batch4-spleen-asplenia",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.spleen-asplenia.abscess-initial-control.20261111.v2",
    "caseId": "case.spleen-asplenia.abscess-initial-control-review-response.20261111.v2",
    "nodeId": "node.spleen-asplenia.abscess-initial-control.20261111.v2",
    "questionVariantId": "question.spleen-asplenia.abscess-initial-control.20261111.v2",
    "conceptId": "concept.spleen-asplenia.abscess-anatomy-source-control.v1",
    "sourceView": "topic-batch4-spleen-asplenia",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.skin-soft-tissue-benign-infection.foot-deep-setting.20261111.v1",
    "caseId": "case.skin-soft-tissue-benign-infection.deep-foot-chart.20261111.v1",
    "nodeId": "node.skin-soft-tissue-benign-infection.foot-deep-setting.20261111.v1",
    "questionVariantId": "question.skin-soft-tissue-benign-infection.foot-deep-setting.20261111.v1",
    "conceptId": "concept.n3.foot-culture-versus-clinical-infection.v2",
    "sourceView": "topic-batch4-skin-soft-tissue-benign-infection",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.skin-soft-tissue-benign-infection.necrotizing-exploration.20261111.v1",
    "caseId": "case.skin-soft-tissue-benign-infection.progressive-thigh-chart.20261111.v1",
    "nodeId": "node.skin-soft-tissue-benign-infection.necrotizing-exploration.20261111.v1",
    "questionVariantId": "question.skin-soft-tissue-benign-infection.necrotizing-exploration.20261111.v1",
    "conceptId": "concept.skin-soft-tissue-benign-infection.necrotizing-clinical-escalation.v1",
    "sourceView": "topic-batch4-skin-soft-tissue-benign-infection",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.skin-soft-tissue-benign-infection.recurrence-workup.20261111.v2",
    "caseId": "case.skin-soft-tissue-benign-infection.recurrence-workup.review2.20261111.v2",
    "nodeId": "node.skin-soft-tissue-benign-infection.recurrence-workup.20261111.v2",
    "questionVariantId": "question.skin-soft-tissue-benign-infection.recurrence-workup.20261111.v2",
    "conceptId": "concept.skin-soft-tissue-benign-infection.radiograph-negative-foreignbody-localization.v1",
    "sourceView": "topic-batch4-skin-soft-tissue-benign-infection",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.skin-soft-tissue-benign-infection.hs-deroof.20261111.v2",
    "caseId": "case.skin-soft-tissue-benign-infection.hs-deroof.review2.20261111.v2",
    "nodeId": "node.skin-soft-tissue-benign-infection.hs-deroof.20261111.v2",
    "questionVariantId": "question.skin-soft-tissue-benign-infection.hs-deroof.20261111.v2",
    "conceptId": "concept.skin-soft-tissue-benign-infection.hs-local-tunnel-procedure.v1",
    "sourceView": "topic-batch4-skin-soft-tissue-benign-infection",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.skin-soft-tissue-benign-infection.pilonidal-closure.20261111.v2",
    "caseId": "case.skin-soft-tissue-benign-infection.pilonidal-closure.review2.20261111.v2",
    "nodeId": "node.skin-soft-tissue-benign-infection.pilonidal-closure.20261111.v2",
    "questionVariantId": "question.skin-soft-tissue-benign-infection.pilonidal-closure.20261111.v2",
    "conceptId": "concept.pilonidal-disease.off-midline-closure-planning",
    "sourceView": "topic-batch4-skin-soft-tissue-benign-infection",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.skin-soft-tissue-benign-infection.cyst-acute.20261111.v2",
    "caseId": "case.skin-soft-tissue-benign-infection.cyst-acute.review2.20261111.v2",
    "nodeId": "node.skin-soft-tissue-benign-infection.cyst-acute.20261111.v2",
    "questionVariantId": "question.skin-soft-tissue-benign-infection.cyst-acute.20261111.v2",
    "conceptId": "concept.skin-soft-tissue-benign-infection.epidermoid-acute-versus-elective.v1",
    "sourceView": "topic-batch4-skin-soft-tissue-benign-infection",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.ethics-professionalism.recovery-endpoint.v2",
    "caseId": "case.topic.ethics-professionalism.recovery-endpoint-r2.v2",
    "nodeId": "node.topic.ethics-professionalism.recovery-endpoint.v2",
    "questionVariantId": "question.topic.ethics-professionalism.recovery-endpoint.v2",
    "conceptId": "concept.perioperative-dnr.recovery-endpoint.v1",
    "sourceView": "topic-batch4-ethics-professionalism",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.ethics-professionalism.consent-scope.v2",
    "caseId": "case.topic.ethics-professionalism.consent-scope-r2.v2",
    "nodeId": "node.topic.ethics-professionalism.consent-scope.v2",
    "questionVariantId": "question.topic.ethics-professionalism.consent-scope.v2",
    "conceptId": "concept.topic.ethics-professionalism.additional-procedure-permission.v1",
    "sourceView": "topic-batch4-ethics-professionalism",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.ethics-professionalism.reversible-delay.v2",
    "caseId": "case.topic.ethics-professionalism.reversible-delay-r2.v2",
    "nodeId": "node.topic.ethics-professionalism.reversible-delay.v2",
    "questionVariantId": "question.topic.ethics-professionalism.reversible-delay.v2",
    "conceptId": "concept.topic.ethics-professionalism.recoverable-capacity-timing.v1",
    "sourceView": "topic-batch4-ethics-professionalism",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.ethics-professionalism.research-integrity.v2",
    "caseId": "case.topic.ethics-professionalism.research-integrity-r2.v2",
    "nodeId": "node.topic.ethics-professionalism.research-integrity.v2",
    "questionVariantId": "question.topic.ethics-professionalism.research-integrity.v2",
    "conceptId": "concept.topic.ethics-professionalism.suspected-falsification-response.v1",
    "sourceView": "topic-batch4-ethics-professionalism",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  
  {
    "acceptanceId": "question.topic.anesthesia-analgesia-pharmacology.last-seizure-drug.v2",
    "caseId": "case.topic.anesthesia-analgesia-pharmacology.last-seizure-drug-revision.v2",
    "nodeId": "node.topic.anesthesia-analgesia-pharmacology.last-seizure-drug.v2",
    "questionVariantId": "question.topic.anesthesia-analgesia-pharmacology.last-seizure-drug.v2",
    "conceptId": "concept.anesthesia-analgesia-pharmacology.last-seizure-management.v1",
    "sourceView": "topic-batch4-anesthesia-analgesia-pharmacology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anesthesia-analgesia-pharmacology.last-wide-complex.v2",
    "caseId": "case.topic.anesthesia-analgesia-pharmacology.last-wide-complex-revision.v2",
    "nodeId": "node.topic.anesthesia-analgesia-pharmacology.last-wide-complex.v2",
    "questionVariantId": "question.topic.anesthesia-analgesia-pharmacology.last-wide-complex.v2",
    "conceptId": "concept.anesthesia-analgesia-pharmacology.last-wide-complex-adjunct.v1",
    "sourceView": "topic-batch4-anesthesia-analgesia-pharmacology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anesthesia-analgesia-pharmacology.nmb-measurement.v1",
    "caseId": "case.topic.anesthesia-analgesia-pharmacology.nmb-measurement-pass.v1",
    "nodeId": "node.topic.anesthesia-analgesia-pharmacology.nmb-measurement.v1",
    "questionVariantId": "question.topic.anesthesia-analgesia-pharmacology.nmb-measurement.v1",
    "conceptId": "concept.gs028g.neuromuscular-recovery.quantitative-assessment",
    "sourceView": "topic-batch4-anesthesia-analgesia-pharmacology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anesthesia-analgesia-pharmacology.nmb-no-antagonist.v2",
    "caseId": "case.topic.anesthesia-analgesia-pharmacology.nmb-no-antagonist-revision.v2",
    "nodeId": "node.topic.anesthesia-analgesia-pharmacology.nmb-no-antagonist.v2",
    "questionVariantId": "question.topic.anesthesia-analgesia-pharmacology.nmb-no-antagonist.v2",
    "conceptId": "concept.gs028g.neuromuscular-recovery.quantitative-assessment",
    "sourceView": "topic-batch4-anesthesia-analgesia-pharmacology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anesthesia-analgesia-pharmacology.opioid-maintenance-delivery.v2",
    "caseId": "case.topic.anesthesia-analgesia-pharmacology.opioid-maintenance-delivery-revision.v2",
    "nodeId": "node.topic.anesthesia-analgesia-pharmacology.opioid-maintenance-delivery.v2",
    "questionVariantId": "question.topic.anesthesia-analgesia-pharmacology.opioid-maintenance-delivery.v2",
    "conceptId": "concept.n2r3.naloxone-recurrence-delivery-strategy",
    "sourceView": "topic-batch4-anesthesia-analgesia-pharmacology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anesthesia-analgesia-pharmacology.opioid-respiratory-endpoint.v2",
    "caseId": "case.topic.anesthesia-analgesia-pharmacology.opioid-respiratory-endpoint-revision.v2",
    "nodeId": "node.topic.anesthesia-analgesia-pharmacology.opioid-respiratory-endpoint.v2",
    "questionVariantId": "question.topic.anesthesia-analgesia-pharmacology.opioid-respiratory-endpoint.v2",
    "conceptId": "concept.anesthesia-analgesia-pharmacology.opioid-respiratory-endpoint.v1",
    "sourceView": "topic-batch4-anesthesia-analgesia-pharmacology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anesthesia-analgesia-pharmacology.boosted-midazolam-route.v2",
    "caseId": "case.topic.anesthesia-analgesia-pharmacology.boosted-midazolam-route-revision.v2",
    "nodeId": "node.topic.anesthesia-analgesia-pharmacology.boosted-midazolam-route.v2",
    "questionVariantId": "question.topic.anesthesia-analgesia-pharmacology.boosted-midazolam-route.v2",
    "conceptId": "concept.gs028g.hiv-perioperative.booster-midazolam-interaction",
    "sourceView": "topic-batch4-anesthesia-analgesia-pharmacology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.head-neck-salivary.r03.v2",
    "caseId": "case.topic.head-neck-salivary.lymphoid-architecture.v2",
    "nodeId": "node.topic.head-neck-salivary.r03.v2",
    "questionVariantId": "question.topic.head-neck-salivary.r03.v2",
    "conceptId": "concept.topic.head-neck-salivary.lymphoid-surgical-architecture.v1",
    "sourceView": "topic-batch4-head-neck-salivary",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.head-neck-salivary.n01.v1",
    "caseId": "case.topic.head-neck-salivary.submandibular-stone.v1",
    "nodeId": "node.topic.head-neck-salivary.n01.v1",
    "questionVariantId": "question.topic.head-neck-salivary.n01.v1",
    "conceptId": "concept.topic.head-neck-salivary.distal-duct-stone-access.v1",
    "sourceView": "topic-batch4-head-neck-salivary",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.head-neck-salivary.n05.v2",
    "caseId": "case.topic.head-neck-salivary.facial-nerve-repair.v2",
    "nodeId": "node.topic.head-neck-salivary.n05.v2",
    "questionVariantId": "question.topic.head-neck-salivary.n05.v2",
    "conceptId": "concept.topic.head-neck-salivary.facial-nerve-tension-repair.v1",
    "sourceView": "topic-batch4-head-neck-salivary",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.head-neck-salivary.n06.v1",
    "caseId": "case.topic.head-neck-salivary.parotid-operative-record.v1",
    "nodeId": "node.topic.head-neck-salivary.n06.v1",
    "questionVariantId": "question.topic.head-neck-salivary.n06.v1",
    "conceptId": "concept.topic.head-neck-salivary.perineural-adjuvant-radiotherapy.v1",
    "sourceView": "topic-batch4-head-neck-salivary",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.neuro-orthopedic-essentials.median-motor-escalation.v2",
    "caseId": "case.topic.neuro-orthopedic-essentials.review-response.median-motor-escalation.v2",
    "nodeId": "node.topic.neuro-orthopedic-essentials.median-motor-escalation.v2",
    "questionVariantId": "question.topic.neuro-orthopedic-essentials.median-motor-escalation.v2",
    "conceptId": "concept.topic.neuro-orthopedic-essentials.median-motor-escalation.v1",
    "sourceView": "topic-batch4-neuro-orthopedic-essentials",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.neuro-orthopedic-essentials.joint-sampling-sequence.v1",
    "caseId": "case.topic.neuro-orthopedic-essentials.review-response.joint-sampling-sequence.v2",
    "nodeId": "node.topic.neuro-orthopedic-essentials.joint-sampling-sequence.v1",
    "questionVariantId": "question.topic.neuro-orthopedic-essentials.joint-sampling-sequence.v1",
    "conceptId": "concept.topic.neuro-orthopedic-essentials.joint-sampling-sequence.v1",
    "sourceView": "topic-batch4-neuro-orthopedic-essentials",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.neuro-orthopedic-essentials.joint-failed-drainage.v1",
    "caseId": "case.topic.neuro-orthopedic-essentials.review-response.joint-failed-drainage.v2",
    "nodeId": "node.topic.neuro-orthopedic-essentials.joint-failed-drainage.v1",
    "questionVariantId": "question.topic.neuro-orthopedic-essentials.joint-failed-drainage.v1",
    "conceptId": "concept.topic.neuro-orthopedic-essentials.joint-failed-drainage.v1",
    "sourceView": "topic-batch4-neuro-orthopedic-essentials",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.neuro-orthopedic-essentials.spine-imaging-lag.v1",
    "caseId": "case.topic.neuro-orthopedic-essentials.review-response.spine-imaging-lag.v2",
    "nodeId": "node.topic.neuro-orthopedic-essentials.spine-imaging-lag.v1",
    "questionVariantId": "question.topic.neuro-orthopedic-essentials.spine-imaging-lag.v1",
    "conceptId": "concept.topic.neuro-orthopedic-essentials.spine-imaging-lag.v1",
    "sourceView": "topic-batch4-neuro-orthopedic-essentials",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.neuro-orthopedic-essentials.spine-concordant-blood-culture.v2",
    "caseId": "case.topic.neuro-orthopedic-essentials.review-response.spine-concordant-blood-culture.v2",
    "nodeId": "node.topic.neuro-orthopedic-essentials.spine-concordant-blood-culture.v2",
    "questionVariantId": "question.topic.neuro-orthopedic-essentials.spine-concordant-blood-culture.v2",
    "conceptId": "concept.topic.neuro-orthopedic-essentials.spine-concordant-blood-culture.v2",
    "sourceView": "topic-batch4-neuro-orthopedic-essentials",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.neuro-orthopedic-essentials.footdrop-competing-localization.v1",
    "caseId": "case.topic.neuro-orthopedic-essentials.review-response.footdrop-competing-localization.v2",
    "nodeId": "node.topic.neuro-orthopedic-essentials.footdrop-competing-localization.v1",
    "questionVariantId": "question.topic.neuro-orthopedic-essentials.footdrop-competing-localization.v1",
    "conceptId": "concept.topic.neuro-orthopedic-essentials.footdrop-competing-localization.v1",
    "sourceView": "topic-batch4-neuro-orthopedic-essentials",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.pdsa-local-spread.v1",
    "caseId": "case.topic.quality-safety-systems.pdsa-spread.v1",
    "nodeId": "node.topic.quality-safety-systems.pdsa-local-spread.v1",
    "questionVariantId": "question.topic.quality-safety-systems.pdsa-local-spread.v1",
    "conceptId": "concept.quality-improvement.pdsa-act-and-iterate",
    "sourceView": "topic-batch4-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.pdsa-burden-adapt.v2",
    "caseId": "case.topic.quality-safety-systems.pdsa-adapt.v2",
    "nodeId": "node.topic.quality-safety-systems.pdsa-burden-adapt.v2",
    "questionVariantId": "question.topic.quality-safety-systems.pdsa-burden-adapt.v2",
    "conceptId": "concept.quality-improvement.pdsa-act-and-iterate",
    "sourceView": "topic-batch4-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.specimen-observed-barrier.v1",
    "caseId": "case.topic.quality-safety-systems.specimen-observed-barrier.standalone.v1",
    "nodeId": "node.topic.quality-safety-systems.specimen-observed-barrier.v1",
    "questionVariantId": "question.topic.quality-safety-systems.specimen-observed-barrier.v1",
    "conceptId": "concept.topic.quality-safety-systems.observed-barrier-use.v1",
    "sourceView": "topic-batch4-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.report-count-ascertainment.v2",
    "caseId": "case.topic.quality-safety-systems.portal-evaluation.v2",
    "nodeId": "node.topic.quality-safety-systems.report-count-ascertainment.v2",
    "questionVariantId": "question.topic.quality-safety-systems.report-count-ascertainment.v2",
    "conceptId": "concept.topic.quality-safety-systems.reporting-ascertainment.v1",
    "sourceView": "topic-batch4-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.portal-total-burden.v2",
    "caseId": "case.topic.quality-safety-systems.portal-evaluation.v2",
    "nodeId": "node.topic.quality-safety-systems.portal-total-burden.v2",
    "questionVariantId": "question.topic.quality-safety-systems.portal-total-burden.v2",
    "conceptId": "concept.topic.quality-safety-systems.whole-pathway-resource-burden.v1",
    "sourceView": "topic-batch4-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.nephrolithiasis.noncontrast-ct-evaluation.v1.topic20261111.v2",
    "caseId": "case.topic.adult-urology-gynecology.r2-08.v1",
    "nodeId": "node.topic.adult-urology-gynecology.stone-recurrent-image.v2",
    "questionVariantId": "question.nephrolithiasis.noncontrast-ct-evaluation.v1.topic20261111.v2",
    "conceptId": "concept.topic.adult-urology-gynecology.preintervention-stone-evidence.v1",
    "sourceView": "topic-batch4-adult-urology-gynecology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.nephrolithiasis.noncontrast-ct-evaluation.v2.topic20261111.v2",
    "caseId": "case.topic.adult-urology-gynecology.r2-10.v1",
    "nodeId": "node.topic.adult-urology-gynecology.stone-uncertain-image.v2",
    "questionVariantId": "question.nephrolithiasis.noncontrast-ct-evaluation.v2.topic20261111.v2",
    "conceptId": "concept.topic.adult-urology-gynecology.preintervention-stone-evidence.v1",
    "sourceView": "topic-batch4-adult-urology-gynecology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.nephrolithiasis.noncontrast-ct-evaluation.v4.topic20261111.v2",
    "caseId": "case.topic.adult-urology-gynecology.r2-14.v1",
    "nodeId": "node.topic.adult-urology-gynecology.stone-colic-image.v2",
    "questionVariantId": "question.nephrolithiasis.noncontrast-ct-evaluation.v4.topic20261111.v2",
    "conceptId": "concept.topic.adult-urology-gynecology.preintervention-stone-evidence.v1",
    "sourceView": "topic-batch4-adult-urology-gynecology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.adult-urology-gynecology.ectopic-active-liver.v1",
    "caseId": "case.topic.adult-urology-gynecology.pass-single-23.v1",
    "nodeId": "node.topic.adult-urology-gynecology.ectopic-active-liver.v1",
    "questionVariantId": "question.topic.adult-urology-gynecology.ectopic-active-liver.v1",
    "conceptId": "concept.topic.adult-urology-gynecology.ectopic-medical-eligibility.v1",
    "sourceView": "topic-batch4-adult-urology-gynecology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.adult-urology-gynecology.heterotopic-assess.v2",
    "caseId": "case.topic.adult-urology-gynecology.r2-24.v1",
    "nodeId": "node.topic.adult-urology-gynecology.heterotopic-assess.v2",
    "questionVariantId": "question.topic.adult-urology-gynecology.heterotopic-assess.v2",
    "conceptId": "concept.topic.adult-urology-gynecology.heterotopic-adnexal-assessment.v1",
    "sourceView": "topic-batch4-adult-urology-gynecology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.adult-urology-gynecology.infected-stone-drain.v1",
    "caseId": "case.topic.adult-urology-gynecology.pass-single-25.v1",
    "nodeId": "node.topic.adult-urology-gynecology.infected-stone-drain.v1",
    "questionVariantId": "question.topic.adult-urology-gynecology.infected-stone-drain.v1",
    "conceptId": "concept.topic.adult-urology-gynecology.infected-obstruction-drainage.v1",
    "sourceView": "topic-batch4-adult-urology-gynecology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.adult-urology-gynecology.infected-stone-definitive.v2",
    "caseId": "case.topic.adult-urology-gynecology.r2-26.v1",
    "nodeId": "node.topic.adult-urology-gynecology.infected-stone-definitive.v2",
    "questionVariantId": "question.topic.adult-urology-gynecology.infected-stone-definitive.v2",
    "conceptId": "concept.topic.adult-urology-gynecology.stone-procedure-anticoagulation.v1",
    "sourceView": "topic-batch4-adult-urology-gynecology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.adult-urology-gynecology.stone-passage-confirm.v2",
    "caseId": "case.topic.adult-urology-gynecology.r2-27.v1",
    "nodeId": "node.topic.adult-urology-gynecology.stone-passage-confirm.v2",
    "questionVariantId": "question.topic.adult-urology-gynecology.stone-passage-confirm.v2",
    "conceptId": "concept.topic.adult-urology-gynecology.confirm-stone-passage.v1",
    "sourceView": "topic-batch4-adult-urology-gynecology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.adult-urology-gynecology.ureter-leak-protocol.v2",
    "caseId": "case.topic.adult-urology-gynecology.r2-28.v1",
    "nodeId": "node.topic.adult-urology-gynecology.ureter-leak-protocol.v2",
    "questionVariantId": "question.topic.adult-urology-gynecology.ureter-leak-protocol.v2",
    "conceptId": "concept.topic.adult-urology-gynecology.postoperative-ureteral-injury-imaging.v1",
    "sourceView": "topic-batch4-adult-urology-gynecology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.adult-urology-gynecology.bladder-leak-protocol.v2",
    "caseId": "case.topic.adult-urology-gynecology.r2-31.v1",
    "nodeId": "node.topic.adult-urology-gynecology.bladder-leak-protocol.v2",
    "questionVariantId": "question.topic.adult-urology-gynecology.bladder-leak-protocol.v2",
    "conceptId": "concept.topic.adult-urology-gynecology.bladder-injury-cystography.v1",
    "sourceView": "topic-batch4-adult-urology-gynecology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.adult-urology-gynecology.torsion-preserved-flow.v1",
    "caseId": "case.topic.adult-urology-gynecology.adnexal-torsion.v1",
    "nodeId": "node.topic.adult-urology-gynecology.torsion-preserved-flow.v1",
    "questionVariantId": "question.topic.adult-urology-gynecology.torsion-preserved-flow.v1",
    "conceptId": "concept.topic.adult-urology-gynecology.adnexal-torsion-preserved-flow.v1",
    "sourceView": "topic-batch4-adult-urology-gynecology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-carotid.nascet-plan.20261111.v1",
    "caseId": "case.vascular-carotid.discordant-measurements.20261111.v1",
    "nodeId": "node.vascular-carotid.discordant-measurements.nascet-plan.20261111.v1",
    "questionVariantId": "question.vascular-carotid.nascet-plan.20261111.v1",
    "conceptId": "concept.vascular-carotid.nascet-treatment-boundary.v1",
    "sourceView": "topic-batch4-vascular-carotid",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-carotid.chronic-occlusion.20261111.v1",
    "caseId": "case.vascular-carotid.stroke-burden.20261111.v1",
    "nodeId": "node.vascular-carotid.stroke-burden.chronic-occlusion.20261111.v1",
    "questionVariantId": "question.vascular-carotid.chronic-occlusion.20261111.v1",
    "conceptId": "concept.vascular-carotid.chronic-occlusion-medical-management.v1",
    "sourceView": "topic-batch4-vascular-carotid",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-carotid.near-occlusion.20261111.v1",
    "caseId": "case.vascular-carotid.distal-collapse.20261111.v1",
    "nodeId": "node.vascular-carotid.distal-collapse.near-occlusion.20261111.v1",
    "questionVariantId": "question.vascular-carotid.near-occlusion.20261111.v1",
    "conceptId": "concept.vascular-carotid.distal-collapse-treatment-boundary.v1",
    "sourceView": "topic-batch4-vascular-carotid",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-carotid.older-cea.20261111.v2",
    "caseId": "case.vascular-carotid.recurrent-anticoagulated-events.20261111.v2",
    "nodeId": "node.vascular-carotid.recurrent-anticoagulated-events.older-cea.20261111.v2",
    "questionVariantId": "question.vascular-carotid.older-cea.20261111.v2",
    "conceptId": "concept.vascular-carotid.carotid-events-during-anticoagulation.v1",
    "sourceView": "topic-batch4-vascular-carotid",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colon-diverticular-lower-bleeding.first-episode-with-urinary-symptoms.v1",
    "caseId": "case.topic.colon-diverticular-lower-bleeding.salvage-first-episode-with-urinary-symptoms.v1",
    "nodeId": "node.topic.colon-diverticular-lower-bleeding.salvage-first-episode-with-urinary-symptoms.v1",
    "questionVariantId": "question.topic.colon-diverticular-lower-bleeding.first-episode-with-urinary-symptoms.v1",
    "conceptId": "concept.diverticulitis.first-presentation-ct",
    "sourceView": "topic-batch4-colon-diverticular-lower-bleeding",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colon-diverticular-lower-bleeding.first-presentation-ct.v1",
    "caseId": "case.topic.colon-diverticular-lower-bleeding.salvage-first-presentation-ct.v1",
    "nodeId": "node.topic.colon-diverticular-lower-bleeding.salvage-first-presentation-ct.v1",
    "questionVariantId": "question.topic.colon-diverticular-lower-bleeding.first-presentation-ct.v1",
    "conceptId": "concept.diverticulitis.first-presentation-ct",
    "sourceView": "topic-batch4-colon-diverticular-lower-bleeding",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colon-diverticular-lower-bleeding.post-recovery-alarm-colonoscopy.v2",
    "caseId": "case.topic.colon-diverticular-lower-bleeding.salvage-post-recovery-alarm-colonoscopy.v1",
    "nodeId": "node.topic.colon-diverticular-lower-bleeding.salvage-post-recovery-alarm-colonoscopy.v1",
    "questionVariantId": "question.topic.colon-diverticular-lower-bleeding.post-recovery-alarm-colonoscopy.v2",
    "conceptId": "concept.recovered-diverticulitis.alarm-colonoscopy.v2",
    "sourceView": "topic-batch4-colon-diverticular-lower-bleeding",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-motility-achalasia.salvage-before-resection.v1",
    "caseId": "case.topic.esophagus-motility-achalasia.salvage-before-resection-standalone.v1",
    "nodeId": "node.topic.esophagus-motility-achalasia.salvage-before-resection.v1",
    "questionVariantId": "question.topic.esophagus-motility-achalasia.salvage-before-resection.v1",
    "conceptId": "concept.esophagus-motility-achalasia.incomplete-myotomy-salvage.v1",
    "sourceView": "topic-batch4-esophagus-motility-achalasia",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-gerd-barrett-hiatal.indefinite-inflamed-biopsies.v2",
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.salvage-indefinite-inflamed-biopsies.v2",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.indefinite-inflamed-biopsies.v2",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.indefinite-inflamed-biopsies.v2",
    "conceptId": "concept.topic.esophagus-gerd-barrett-hiatal.indefinite-inflamed-biopsies.v1",
    "sourceView": "topic-batch4-esophagus-gerd-barrett-hiatal",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-gerd-barrett-hiatal.proven-gerd-on-therapy.v1",
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.salvage-proven-gerd-on-therapy.v1",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.proven-gerd-on-therapy.v1",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.proven-gerd-on-therapy.v1",
    "conceptId": "concept.topic.esophagus-gerd-barrett-hiatal.proven-gerd-on-therapy.v1",
    "sourceView": "topic-batch4-esophagus-gerd-barrett-hiatal",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-gerd-barrett-hiatal.residual-barrett-after-resection.v1",
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.salvage-residual-barrett-after-resection.v1",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.residual-barrett-after-resection.v1",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.residual-barrett-after-resection.v1",
    "conceptId": "concept.topic.esophagus-gerd-barrett-hiatal.residual-barrett-after-resection.v1",
    "sourceView": "topic-batch4-esophagus-gerd-barrett-hiatal",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-gerd-barrett-hiatal.unproven-reflux.v3",
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.salvage-unproven-reflux.v2",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.unproven-reflux.v3",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.unproven-reflux.v3",
    "conceptId": "concept.gerd.off-ppi-reflux-monitoring",
    "sourceView": "topic-batch4-esophagus-gerd-barrett-hiatal",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-gerd-barrett-hiatal.visible-lesion-first.v1",
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.salvage-visible-lesion-first.v1",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.visible-lesion-first.v1",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.visible-lesion-first.v1",
    "conceptId": "concept.topic.esophagus-gerd-barrett-hiatal.visible-lesion-first.v1",
    "sourceView": "topic-batch4-esophagus-gerd-barrett-hiatal",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.surgical-infection-antibiotics.adequate-control-duration.v3",
    "caseId": "case.topic.surgical-infection-antibiotics.salvage-adequate-control-duration.v2",
    "nodeId": "node.topic.surgical-infection-antibiotics.adequate-control-duration.v3",
    "questionVariantId": "question.topic.surgical-infection-antibiotics.adequate-control-duration.v3",
    "conceptId": "concept.surgical-infection-antibiotics.adequate-control-duration.v1",
    "sourceView": "topic-batch4-surgical-infection-antibiotics",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.surgical-infection-antibiotics.pelvic-source-route.v3",
    "caseId": "case.topic.surgical-infection-antibiotics.salvage-pelvic-source-route.v2",
    "nodeId": "node.topic.surgical-infection-antibiotics.pelvic-source-route.v3",
    "questionVariantId": "question.topic.surgical-infection-antibiotics.pelvic-source-route.v3",
    "conceptId": "concept.n2r3.postoperative-source-compartment-drainage",
    "sourceView": "topic-batch4-surgical-infection-antibiotics",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  }
,
  // Manager-accepted complete topic cases, batch 5.
{
    "acceptanceId": "question.vascular-venous-lymphatic-access.postop-prevention-not-failure.20261111.v1",
    "caseId": "case.vascular-venous-lymphatic-access.postop-leg-coverage.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.postop-prevention-not-failure.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.postop-prevention-not-failure.20261111.v1",
    "conceptId": "concept.n2.vte-prophylaxis-to-treatment",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.postop-finite-course.20261111.v2",
    "caseId": "case.vascular-venous-lymphatic-access.postop-finite-course-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.postop-finite-course.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.postop-finite-course.20261111.v2",
    "conceptId": "concept.postoperative-dvt.three-month-anticoagulation",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.postop-residual-duration.20261111.v1",
    "caseId": "case.vascular-venous-lymphatic-access.postop-negative-summary.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.postop-residual-duration.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.postop-residual-duration.20261111.v1",
    "conceptId": "concept.postoperative-dvt.three-month-anticoagulation",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2",
    "caseId": "case.vascular-venous-lymphatic-access.lymphatic-acute-change-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.lymphatic-acute-change.20261111.v2",
    "conceptId": "concept.n1.lymphedema-new-tempo-venous-assessment",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1",
    "caseId": "case.vascular-venous-lymphatic-access.whole-leg-venous-change.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1",
    "conceptId": "concept.vascular-venous-lymphatic-access.varicose-proximal-outflow-workup.v1",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.access-unresolved-maturation.20261111.v2",
    "caseId": "case.vascular-venous-lymphatic-access.access-unresolved-maturation-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.access-unresolved-maturation.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.access-unresolved-maturation.20261111.v2",
    "conceptId": "concept.dialysis-access.maturation-physical-assessment",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1",
    "caseId": "case.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1",
    "nodeId": "node.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1",
    "conceptId": "concept.venous-leg-ulcer.arterial-assessment-before-compression",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.ulcer-severe-perfusion.20261111.v1",
    "caseId": "case.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1",
    "nodeId": "node.vascular-venous-lymphatic-access.ulcer-severe-perfusion.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.ulcer-severe-perfusion.20261111.v1",
    "conceptId": "concept.vascular-venous-lymphatic-access.compression-with-severe-perfusion-deficit.v1",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.ulcer-mixed-compression.20261111.v1",
    "caseId": "case.vascular-venous-lymphatic-access.mixed-ulcer-physiology.20261111.v1",
    "nodeId": "node.vascular-venous-lymphatic-access.ulcer-mixed-compression.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.ulcer-mixed-compression.20261111.v1",
    "conceptId": "concept.vascular-venous-lymphatic-access.modified-compression-for-mixed-ulcer.v1",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2",
    "caseId": "case.vascular-venous-lymphatic-access.dvt-serial-negative-proximal-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.dvt-serial-negative-proximal.20261111.v2",
    "conceptId": "concept.vascular-venous-lymphatic-access.negative-proximal-study-followup.v1",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2",
    "caseId": "case.vascular-venous-lymphatic-access.access-hand-physiology-r2.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2",
    "questionVariantId": "question.vascular-venous-lymphatic-access.access-hand-physiology.20261111.v2",
    "conceptId": "concept.vascular-venous-lymphatic-access.access-hand-perfusion-workup.v1",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.access-multinerve-neuropathy.20261111.v1",
    "caseId": "case.vascular-venous-lymphatic-access.postaccess-neurologic-record.20261111.v1",
    "nodeId": "node.vascular-venous-lymphatic-access.access-multinerve-neuropathy.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.access-multinerve-neuropathy.20261111.v1",
    "conceptId": "concept.vascular-venous-lymphatic-access.postaccess-ischemic-neuropathy-action.v1",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.20261111.v1",
    "caseId": "case.vascular-venous-lymphatic-access.dialysis-catheter-course.20261111.v2",
    "nodeId": "node.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.20261111.v1",
    "questionVariantId": "question.vascular-venous-lymphatic-access.catheter-intraluminal-dysfunction.20261111.v1",
    "conceptId": "concept.vascular-venous-lymphatic-access.dialysis-catheter-first-lock-treatment.v1",
    "sourceView": "topic-batch5-vascular-venous-lymphatic-access",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3",
    "caseId": "case.topic.esophagus-motility-achalasia.recurrent-clearance-standalone.v2",
    "nodeId": "node.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3",
    "questionVariantId": "question.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3",
    "conceptId": "concept.esophagus-motility-achalasia.postmyotomy-objective-clearance.v1",
    "sourceView": "topic-batch5-esophagus-motility-achalasia",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.topic.bariatric-metabolic.spontaneous-sample-before-label.v2",
    "caseId": "case.topic.bariatric-metabolic.spontaneous-sample-salvage.v1",
    "nodeId": "node.topic.bariatric-metabolic.spontaneous-sample-before-label.v2",
    "questionVariantId": "question.topic.bariatric-metabolic.spontaneous-sample-before-label.v2",
    "conceptId": "concept.pbh.spontaneous-evidence-before-treatment.v2",
    "sourceView": "topic-batch5-bariatric-metabolic",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.topic.bariatric-metabolic.diet-response-drug-stage.v2",
    "caseId": "case.topic.bariatric-metabolic.acarbose-intolerance-salvage.v1",
    "nodeId": "node.topic.bariatric-metabolic.diet-response-drug-stage.v2",
    "questionVariantId": "question.topic.bariatric-metabolic.diet-response-drug-stage.v2",
    "conceptId": "concept.bariatric-metabolic.pbh-acarbose-intolerance-next-drug.v2",
    "sourceView": "topic-batch5-bariatric-metabolic",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.topic.bariatric-metabolic.refractory-reflux-revision.v2",
    "caseId": "case.topic.bariatric-metabolic.reflux-monitoring-salvage.v1",
    "nodeId": "node.topic.bariatric-metabolic.refractory-reflux-revision.v2",
    "questionVariantId": "question.topic.bariatric-metabolic.refractory-reflux-revision.v2",
    "conceptId": "concept.bariatric-metabolic.post-sleeve-on-therapy-reflux-testing.v2",
    "sourceView": "topic-batch5-bariatric-metabolic",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2",
    "caseId": "case.pediatric-gi-abdominal-wall.intussusception-partial-progress-salvage.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2",
    "conceptId": "concept.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
    "sourceView": "topic-batch5-pediatric-gi-abdominal-wall",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
    "caseId": "case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1",
    "nodeId": "node.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
    "conceptId": "concept.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
    "sourceView": "topic-batch5-pediatric-gi-abdominal-wall",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
    "caseId": "case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1",
    "nodeId": "node.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
    "conceptId": "concept.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v1",
    "sourceView": "topic-batch5-pediatric-gi-abdominal-wall",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
    "caseId": "case.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-salvage.v1",
    "nodeId": "node.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
    "conceptId": "concept.pediatric-gi-abdominal-wall.wilms-caval-extension-initial-plan.v1",
    "sourceView": "topic-batch5-pediatric-gi-abdominal-wall",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  },
  {
    "acceptanceId": "question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
    "caseId": "case.pediatric-gi-abdominal-wall.preterm-hernia-timing-salvage.v1",
    "nodeId": "node.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
    "conceptId": "concept.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
    "sourceView": "topic-batch5-pediatric-gi-abdominal-wall",
    "decision": "docs/research/question-topic-acceptance-batch5-20261111.md"
  }
,
  // Manager-accepted complete topic cases, batch 6.
{
    "acceptanceId": "question.pediatric-neck-thoracic-gu.20261111.node-sample.v1",
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.node-sample-salvage.v1",
    "nodeId": "node.pediatric-neck-thoracic-gu.20261111.node-sample",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.node-sample.v1",
    "conceptId": "concept.pediatric-neck-thoracic-gu.inadequate-node-sample-escalation.v1",
    "sourceView": "topic-batch6-pediatric-neck-thoracic-gu",
    "decision": "docs/research/question-topic-acceptance-batch6-20261112.md"
  },
  {
    "acceptanceId": "question.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.v1",
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy-salvage.v1",
    "nodeId": "node.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.v1",
    "conceptId": "concept.pediatric-neck-thoracic-gu.mediastinal-peripheral-biopsy-route.v1",
    "sourceView": "topic-batch6-pediatric-neck-thoracic-gu",
    "decision": "docs/research/question-topic-acceptance-batch6-20261112.md"
  },
  {
    "acceptanceId": "question.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2",
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.dsd-assessment-salvage.v1",
    "nodeId": "node.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2",
    "conceptId": "concept.pediatric-neck-thoracic-gu.proximal-hypospadias-gonadal-workup.v2",
    "sourceView": "topic-batch6-pediatric-neck-thoracic-gu",
    "decision": "docs/research/question-topic-acceptance-batch6-20261112.md"
  },
  {
    "acceptanceId": "question.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2",
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness-salvage.v1",
    "nodeId": "node.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2",
    "conceptId": "concept.pediatric-neck-thoracic-gu.cdh-physiologic-readiness.v1",
    "sourceView": "topic-batch6-pediatric-neck-thoracic-gu",
    "decision": "docs/research/question-topic-acceptance-batch6-20261112.md"
  }
,
  // Manager-accepted final PASS complete topic cases and D97 node overrides, batch 7.
{
    "acceptanceId": "question.topic.statistics.r3.alpha-definition.v1",
    "caseId": "case.topic.statistics.r3.alpha-definition.v1",
    "nodeId": "node.topic.statistics.r3.alpha-definition.v1",
    "questionVariantId": "question.topic.statistics.r3.alpha-definition.v1",
    "conceptId": "concept.statistics-ethics.errors-power",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.sample-size-beta.v1",
    "caseId": "case.topic.statistics.r3.sample-size-beta.v1",
    "nodeId": "node.topic.statistics.r3.sample-size-beta.v1",
    "questionVariantId": "question.topic.statistics.r3.sample-size-beta.v1",
    "conceptId": "concept.topic.statistics.r3.sample-size-beta.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.effect-size-power.v1",
    "caseId": "case.topic.statistics.r3.effect-size-power.v1",
    "nodeId": "node.topic.statistics.r3.effect-size-power.v1",
    "questionVariantId": "question.topic.statistics.r3.effect-size-power.v1",
    "conceptId": "concept.topic.statistics.r3.effect-size-power.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.alpha-power.v1",
    "caseId": "case.topic.statistics.r3.alpha-power.v1",
    "nodeId": "node.topic.statistics.r3.alpha-power.v1",
    "questionVariantId": "question.topic.statistics.r3.alpha-power.v1",
    "conceptId": "concept.topic.statistics.r3.alpha-power.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.variance-power.v1",
    "caseId": "case.topic.statistics.r3.variance-power.v1",
    "nodeId": "node.topic.statistics.r3.variance-power.v1",
    "questionVariantId": "question.topic.statistics.r3.variance-power.v1",
    "conceptId": "concept.topic.statistics.r3.variance-power.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.kruskal-wallis.v1",
    "caseId": "case.topic.statistics.r3.kruskal-wallis.v1",
    "nodeId": "node.topic.statistics.r3.kruskal-wallis.v1",
    "questionVariantId": "question.topic.statistics.r3.kruskal-wallis.v1",
    "conceptId": "concept.topic.statistics.r3.kruskal-wallis.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.pearson-correlation.v1",
    "caseId": "case.topic.statistics.r3.pearson-correlation.v1",
    "nodeId": "node.topic.statistics.r3.pearson-correlation.v1",
    "questionVariantId": "question.topic.statistics.r3.pearson-correlation.v1",
    "conceptId": "concept.topic.statistics.r3.pearson-correlation.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.spearman-correlation.v1",
    "caseId": "case.topic.statistics.r3.spearman-correlation.v1",
    "nodeId": "node.topic.statistics.r3.spearman-correlation.v1",
    "questionVariantId": "question.topic.statistics.r3.spearman-correlation.v1",
    "conceptId": "concept.topic.statistics.r3.spearman-correlation.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.linear-regression.v1",
    "caseId": "case.topic.statistics.r3.linear-regression.v1",
    "nodeId": "node.topic.statistics.r3.linear-regression.v1",
    "questionVariantId": "question.topic.statistics.r3.linear-regression.v1",
    "conceptId": "concept.topic.statistics.r3.linear-regression.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.log-rank.v1",
    "caseId": "case.topic.statistics.r3.log-rank.v1",
    "nodeId": "node.topic.statistics.r3.log-rank.v1",
    "questionVariantId": "question.topic.statistics.r3.log-rank.v1",
    "conceptId": "concept.topic.statistics.r3.log-rank.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.prevalence-npv.v1",
    "caseId": "case.topic.statistics.r3.prevalence-npv.v1",
    "nodeId": "node.topic.statistics.r3.prevalence-npv.v1",
    "questionVariantId": "question.topic.statistics.r3.prevalence-npv.v1",
    "conceptId": "concept.topic.statistics.r3.prevalence-npv.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.prevalence-measures.v1",
    "caseId": "case.topic.statistics.r3.prevalence-measures.v1",
    "nodeId": "node.topic.statistics.r3.prevalence-measures.v1",
    "questionVariantId": "question.topic.statistics.r3.prevalence-measures.v1",
    "conceptId": "concept.topic.statistics.r3.prevalence-measures.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.roc-horizontal-axis.v1",
    "caseId": "case.topic.statistics.r3.roc-horizontal-axis.v1",
    "nodeId": "node.topic.statistics.r3.roc-horizontal-axis.v1",
    "questionVariantId": "question.topic.statistics.r3.roc-horizontal-axis.v1",
    "conceptId": "concept.topic.statistics.r3.roc-horizontal-axis.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.auc-discrimination.v1",
    "caseId": "case.topic.statistics.r3.auc-discrimination.v1",
    "nodeId": "node.topic.statistics.r3.auc-discrimination.v1",
    "questionVariantId": "question.topic.statistics.r3.auc-discrimination.v1",
    "conceptId": "concept.topic.statistics.r3.auc-discrimination.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.relative-risk-reduction-r3.v1",
    "caseId": "case.topic.statistics.r3.relative-risk-reduction-r3.v1",
    "nodeId": "node.topic.statistics.r3.relative-risk-reduction-r3.v1",
    "questionVariantId": "question.topic.statistics.r3.relative-risk-reduction-r3.v1",
    "conceptId": "concept.topic.statistics.relative-risk-reduction.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.systematic-review.v1",
    "caseId": "case.topic.statistics.r3.systematic-review.v1",
    "nodeId": "node.topic.statistics.r3.systematic-review.v1",
    "questionVariantId": "question.topic.statistics.r3.systematic-review.v1",
    "conceptId": "concept.topic.statistics.r3.systematic-review.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.meta-analysis.v1",
    "caseId": "case.topic.statistics.r3.meta-analysis.v1",
    "nodeId": "node.topic.statistics.r3.meta-analysis.v1",
    "questionVariantId": "question.topic.statistics.r3.meta-analysis.v1",
    "conceptId": "concept.topic.statistics.r3.meta-analysis.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.treatment-evidence-hierarchy.v1",
    "caseId": "case.topic.statistics.r3.treatment-evidence-hierarchy.v1",
    "nodeId": "node.topic.statistics.r3.treatment-evidence-hierarchy.v1",
    "questionVariantId": "question.topic.statistics.r3.treatment-evidence-hierarchy.v1",
    "conceptId": "concept.topic.statistics.r3.treatment-evidence-hierarchy.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.observer-bias.v1",
    "caseId": "case.topic.statistics.r3.observer-bias.v1",
    "nodeId": "node.topic.statistics.r3.observer-bias.v1",
    "questionVariantId": "question.topic.statistics.r3.observer-bias.v1",
    "conceptId": "concept.topic.statistics.r3.observer-bias.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.attrition-bias.v1",
    "caseId": "case.topic.statistics.r3.attrition-bias.v1",
    "nodeId": "node.topic.statistics.r3.attrition-bias.v1",
    "questionVariantId": "question.topic.statistics.r3.attrition-bias.v1",
    "conceptId": "concept.topic.statistics.r3.attrition-bias.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.publication-bias.v1",
    "caseId": "case.topic.statistics.r3.publication-bias.v1",
    "nodeId": "node.topic.statistics.r3.publication-bias.v1",
    "questionVariantId": "question.topic.statistics.r3.publication-bias.v1",
    "conceptId": "concept.topic.statistics.r3.publication-bias.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.randomization-purpose.v1",
    "caseId": "case.topic.statistics.r3.randomization-purpose.v1",
    "nodeId": "node.topic.statistics.r3.randomization-purpose.v1",
    "questionVariantId": "question.topic.statistics.r3.randomization-purpose.v1",
    "conceptId": "concept.topic.statistics.r3.randomization-purpose.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.assessor-blinding.v1",
    "caseId": "case.topic.statistics.r3.assessor-blinding.v1",
    "nodeId": "node.topic.statistics.r3.assessor-blinding.v1",
    "questionVariantId": "question.topic.statistics.r3.assessor-blinding.v1",
    "conceptId": "concept.topic.statistics.r3.assessor-blinding.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.per-protocol.v1",
    "caseId": "case.topic.statistics.r3.per-protocol.v1",
    "nodeId": "node.topic.statistics.r3.per-protocol.v1",
    "questionVariantId": "question.topic.statistics.r3.per-protocol.v1",
    "conceptId": "concept.topic.statistics.r3.per-protocol.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.noninferiority.v1",
    "caseId": "case.topic.statistics.r3.noninferiority.v1",
    "nodeId": "node.topic.statistics.r3.noninferiority.v1",
    "questionVariantId": "question.topic.statistics.r3.noninferiority.v1",
    "conceptId": "concept.topic.statistics.r3.noninferiority.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.phase-0.v1",
    "caseId": "case.topic.statistics.r3.phase-0.v1",
    "nodeId": "node.topic.statistics.r3.phase-0.v1",
    "questionVariantId": "question.topic.statistics.r3.phase-0.v1",
    "conceptId": "concept.topic.statistics.r3.phase-0.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.phase-1.v1",
    "caseId": "case.topic.statistics.r3.phase-1.v1",
    "nodeId": "node.topic.statistics.r3.phase-1.v1",
    "questionVariantId": "question.topic.statistics.r3.phase-1.v1",
    "conceptId": "concept.topic.statistics.r3.phase-1.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.phase-2.v1",
    "caseId": "case.topic.statistics.r3.phase-2.v1",
    "nodeId": "node.topic.statistics.r3.phase-2.v1",
    "questionVariantId": "question.topic.statistics.r3.phase-2.v1",
    "conceptId": "concept.topic.statistics.r3.phase-2.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.phase-3.v1",
    "caseId": "case.topic.statistics.r3.phase-3.v1",
    "nodeId": "node.topic.statistics.r3.phase-3.v1",
    "questionVariantId": "question.topic.statistics.r3.phase-3.v1",
    "conceptId": "concept.topic.statistics.r3.phase-3.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.phase-4.v1",
    "caseId": "case.topic.statistics.r3.phase-4.v1",
    "nodeId": "node.topic.statistics.r3.phase-4.v1",
    "questionVariantId": "question.topic.statistics.r3.phase-4.v1",
    "conceptId": "concept.topic.statistics.r3.phase-4.v1",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.statistics.r3.welch-test.v1",
    "caseId": "case.topic.statistics.r3.welch-test.v1",
    "nodeId": "node.topic.statistics.r3.welch-test.v1",
    "questionVariantId": "question.topic.statistics.r3.welch-test.v1",
    "conceptId": "concept.statistics-ethics.independent-t",
    "sourceView": "topic-batch7-statistics",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ethics-professionalism.r3.clinical-authority.v3",
    "caseId": "case.topic.ethics-professionalism.r3.capacity.v3",
    "nodeId": "node.topic.ethics-professionalism.r3.clinical-authority.v3",
    "questionVariantId": "question.topic.ethics-professionalism.r3.clinical-authority.v3",
    "conceptId": "concept.consent.decision-specific-appreciation-assessment.v1",
    "sourceView": "topic-batch7-ethics-professionalism",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ethics-professionalism.r3.designated-agent.v3",
    "caseId": "case.topic.ethics-professionalism.r3.surrogate.v3",
    "nodeId": "node.topic.ethics-professionalism.r3.designated-agent.v3",
    "questionVariantId": "question.topic.ethics-professionalism.r3.designated-agent.v3",
    "conceptId": "concept.topic.ethics-professionalism.r3.designated-agent-priority.v1",
    "sourceView": "topic-batch7-ethics-professionalism",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ethics-professionalism.r3.patient-values.v3",
    "caseId": "case.topic.ethics-professionalism.r3.surrogate.v3",
    "nodeId": "node.topic.ethics-professionalism.r3.patient-values.v3",
    "questionVariantId": "question.topic.ethics-professionalism.r3.patient-values.v3",
    "conceptId": "concept.statistics-ethics.surrogate-decisions",
    "sourceView": "topic-batch7-ethics-professionalism",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ethics-professionalism.r3.adult-blood-refusal.v3",
    "caseId": "case.topic.ethics-professionalism.r3.adult-blood.v3",
    "nodeId": "node.topic.ethics-professionalism.r3.adult-blood-refusal.v3",
    "questionVariantId": "question.topic.ethics-professionalism.r3.adult-blood-refusal.v3",
    "conceptId": "concept.topic.ethics-professionalism.r3.applicable-adult-blood-refusal.v1",
    "sourceView": "topic-batch7-ethics-professionalism",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ethics-professionalism.r3.child-dissent.v3",
    "caseId": "case.topic.ethics-professionalism.r3.child-assent.v3",
    "nodeId": "node.topic.ethics-professionalism.r3.child-dissent.v3",
    "questionVariantId": "question.topic.ethics-professionalism.r3.child-dissent.v3",
    "conceptId": "concept.pediatric-clinic.developmental-assent-discussion",
    "sourceView": "topic-batch7-ethics-professionalism",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ethics-professionalism.r3.child-emergency-blood.v3",
    "caseId": "case.topic.ethics-professionalism.r3.child-blood.v3",
    "nodeId": "node.topic.ethics-professionalism.r3.child-emergency-blood.v3",
    "questionVariantId": "question.topic.ethics-professionalism.r3.child-emergency-blood.v3",
    "conceptId": "concept.topic.ethics-professionalism.r3.child-protective-emergency.v1",
    "sourceView": "topic-batch7-ethics-professionalism",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ethics-professionalism.r3.information-preference.v3",
    "caseId": "case.topic.ethics-professionalism.r3.consent.v3",
    "nodeId": "node.topic.ethics-professionalism.r3.information-preference.v3",
    "questionVariantId": "question.topic.ethics-professionalism.r3.information-preference.v3",
    "conceptId": "concept.statistics-ethics.informed-consent",
    "sourceView": "topic-batch7-ethics-professionalism",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ethics-professionalism.r3.error-account.v3",
    "caseId": "case.topic.ethics-professionalism.r3.disclosure.v3",
    "nodeId": "node.topic.ethics-professionalism.r3.error-account.v3",
    "questionVariantId": "question.topic.ethics-professionalism.r3.error-account.v3",
    "conceptId": "concept.statistics-ethics.error-disclosure",
    "sourceView": "topic-batch7-ethics-professionalism",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ethics-professionalism.r3.unsafe-colleague.v3",
    "caseId": "case.topic.ethics-professionalism.r3.colleague.v3",
    "nodeId": "node.topic.ethics-professionalism.r3.unsafe-colleague.v3",
    "questionVariantId": "question.topic.ethics-professionalism.r3.unsafe-colleague.v3",
    "conceptId": "concept.statistics-ethics.impaired-colleague",
    "sourceView": "topic-batch7-ethics-professionalism",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ethics-professionalism.r3.ownership-referral.v3",
    "caseId": "case.topic.ethics-professionalism.r3.financial.v3",
    "nodeId": "node.topic.ethics-professionalism.r3.ownership-referral.v3",
    "questionVariantId": "question.topic.ethics-professionalism.r3.ownership-referral.v3",
    "conceptId": "concept.topic.ethics-professionalism.r3.ownership-referral-choice.v1",
    "sourceView": "topic-batch7-ethics-professionalism",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ethics-professionalism.r3.nonbeneficial-demand.v3",
    "caseId": "case.topic.ethics-professionalism.r3.futility.v3",
    "nodeId": "node.topic.ethics-professionalism.r3.nonbeneficial-demand.v3",
    "questionVariantId": "question.topic.ethics-professionalism.r3.nonbeneficial-demand.v3",
    "conceptId": "concept.topic.ethics-professionalism.r3.ineffective-intervention-process.v1",
    "sourceView": "topic-batch7-ethics-professionalism",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ethics-professionalism.r3.trial-withdrawal.v3",
    "caseId": "case.topic.ethics-professionalism.r3.withdrawal.v3",
    "nodeId": "node.topic.ethics-professionalism.r3.trial-withdrawal.v3",
    "questionVariantId": "question.topic.ethics-professionalism.r3.trial-withdrawal.v3",
    "conceptId": "concept.topic.ethics-professionalism.r3.withdrawal-withholding-equivalence.v1",
    "sourceView": "topic-batch7-ethics-professionalism",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ethics-professionalism.r3.donation-order.v3",
    "caseId": "case.topic.ethics-professionalism.r3.donation.v3",
    "nodeId": "node.topic.ethics-professionalism.r3.donation-order.v3",
    "questionVariantId": "question.topic.ethics-professionalism.r3.donation-order.v3",
    "conceptId": "concept.topic.ethics-professionalism.r3.dcd-decision-separation.v1",
    "sourceView": "topic-batch7-ethics-professionalism",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ethics-professionalism.r3.donation-role.v3",
    "caseId": "case.topic.ethics-professionalism.r3.donation.v3",
    "nodeId": "node.topic.ethics-professionalism.r3.donation-role.v3",
    "questionVariantId": "question.topic.ethics-professionalism.r3.donation-role.v3",
    "conceptId": "concept.topic.ethics-professionalism.r3.dcd-care-certification-independence.v1",
    "sourceView": "topic-batch7-ethics-professionalism",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ostomy-enterocutaneous-fistula.r3-intermittent-workup.v1",
    "caseId": "case.topic.ostomy-enterocutaneous-fistula.r3-interrupted-output.v1",
    "nodeId": "node.topic.ostomy-enterocutaneous-fistula.r3-intermittent-workup.v1",
    "questionVariantId": "question.topic.ostomy-enterocutaneous-fistula.r3-intermittent-workup.v1",
    "conceptId": "concept.ostomy-enterocutaneous-fistula.intermittent-obstruction.v1",
    "sourceView": "topic-batch7-ostomy-enterocutaneous-fistula",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ostomy-enterocutaneous-fistula.r3-superficial-stenosis.v1",
    "caseId": "case.topic.ostomy-enterocutaneous-fistula.r3-interrupted-output.v1",
    "nodeId": "node.topic.ostomy-enterocutaneous-fistula.r3-superficial-stenosis.v1",
    "questionVariantId": "question.topic.ostomy-enterocutaneous-fistula.r3-superficial-stenosis.v1",
    "conceptId": "concept.ostomy-enterocutaneous-fistula.stoma-stenosis-revision.v1",
    "sourceView": "topic-batch7-ostomy-enterocutaneous-fistula",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ostomy-enterocutaneous-fistula.r3-supplemental-nutrition.v1",
    "caseId": "case.topic.ostomy-enterocutaneous-fistula.r3-ecf-rehabilitation.v1",
    "nodeId": "node.topic.ostomy-enterocutaneous-fistula.r3-supplemental-nutrition.v1",
    "questionVariantId": "question.topic.ostomy-enterocutaneous-fistula.r3-supplemental-nutrition.v1",
    "conceptId": "concept.ostomy-enterocutaneous-fistula.ecf-enteral-failure-support.v1",
    "sourceView": "topic-batch7-ostomy-enterocutaneous-fistula",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ostomy-enterocutaneous-fistula.r3-reconstruction-readiness.v1",
    "caseId": "case.topic.ostomy-enterocutaneous-fistula.r3-ecf-rehabilitation.v1",
    "nodeId": "node.topic.ostomy-enterocutaneous-fistula.r3-reconstruction-readiness.v1",
    "questionVariantId": "question.topic.ostomy-enterocutaneous-fistula.r3-reconstruction-readiness.v1",
    "conceptId": "concept.ostomy-enterocutaneous-fistula.ecf-readiness.v1",
    "sourceView": "topic-batch7-ostomy-enterocutaneous-fistula",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ostomy-enterocutaneous-fistula.r3-obstructed-fistula-repair.v1",
    "caseId": "case.topic.ostomy-enterocutaneous-fistula.r3-anastomotic-fistula.v1",
    "nodeId": "node.topic.ostomy-enterocutaneous-fistula.r3-obstructed-fistula-repair.v1",
    "questionVariantId": "question.topic.ostomy-enterocutaneous-fistula.r3-obstructed-fistula-repair.v1",
    "conceptId": "concept.ostomy-enterocutaneous-fistula.ecf-distal-obstruction.v1",
    "sourceView": "topic-batch7-ostomy-enterocutaneous-fistula",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ostomy-enterocutaneous-fistula.r3-fluid-only-support.v1",
    "caseId": "case.topic.ostomy-enterocutaneous-fistula.r3-balance-support.v1",
    "nodeId": "node.topic.ostomy-enterocutaneous-fistula.r3-fluid-only-support.v1",
    "questionVariantId": "question.topic.ostomy-enterocutaneous-fistula.r3-fluid-only-support.v1",
    "conceptId": "concept.ostomy-enterocutaneous-fistula.net-secretor-support.v1",
    "sourceView": "topic-batch7-ostomy-enterocutaneous-fistula",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ostomy-enterocutaneous-fistula.r3-temporary-stoma-hernia.v1",
    "caseId": "case.topic.ostomy-enterocutaneous-fistula.r3-temporary-hernia.v1",
    "nodeId": "node.topic.ostomy-enterocutaneous-fistula.r3-temporary-stoma-hernia.v1",
    "questionVariantId": "question.topic.ostomy-enterocutaneous-fistula.r3-temporary-stoma-hernia.v1",
    "conceptId": "concept.ostomy-enterocutaneous-fistula.temporary-stoma-hernia-reversal.v1",
    "sourceView": "topic-batch7-ostomy-enterocutaneous-fistula",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ostomy-enterocutaneous-fistula.r3-necrosis-depth-and-access.v1",
    "caseId": "case.topic.ostomy-enterocutaneous-fistula.r3-ischemic-conduit.v1",
    "nodeId": "node.topic.ostomy-enterocutaneous-fistula.r3-necrosis-depth-and-access.v1",
    "questionVariantId": "question.topic.ostomy-enterocutaneous-fistula.r3-necrosis-depth-and-access.v1",
    "conceptId": "concept.ostomy-enterocutaneous-fistula.stoma-deep-necrosis.v1",
    "sourceView": "topic-batch7-ostomy-enterocutaneous-fistula",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.ostomy-enterocutaneous-fistula.r3-loperamide-toxicity.v1",
    "caseId": "case.topic.ostomy-enterocutaneous-fistula.r3-medication-cardiac-review.v1",
    "nodeId": "node.topic.ostomy-enterocutaneous-fistula.r3-loperamide-toxicity.v1",
    "questionVariantId": "question.topic.ostomy-enterocutaneous-fistula.r3-loperamide-toxicity.v1",
    "conceptId": "concept.ostomy-enterocutaneous-fistula.loperamide-cardiac-toxicity-management.v2",
    "sourceView": "topic-batch7-ostomy-enterocutaneous-fistula",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.capacity-refusal.v1",
    "caseId": "case.topic.quality-safety-systems.round3.capacity.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.capacity-refusal.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.capacity-refusal.v1",
    "conceptId": "concept.statistics-ethics.capacity-refusal",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.agent-values.v1",
    "caseId": "case.topic.quality-safety-systems.round3.capacity.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.agent-values.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.agent-values.v1",
    "conceptId": "concept.topic.quality-safety-systems.round3.agent-values.v1",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.emergency-authorization.v1",
    "caseId": "case.topic.quality-safety-systems.round3.emergency.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.emergency-authorization.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.emergency-authorization.v1",
    "conceptId": "concept.topic.quality-safety-systems.round3.emergency-authorization.v1",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.adult-blood-refusal.v1",
    "caseId": "case.topic.quality-safety-systems.round3.blood-adult.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.adult-blood-refusal.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.adult-blood-refusal.v1",
    "conceptId": "concept.topic.quality-safety-systems.round3.adult-blood-refusal.v1",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.or-procedure-limits.v1",
    "caseId": "case.topic.quality-safety-systems.round3.directive-trial.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.or-procedure-limits.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.or-procedure-limits.v1",
    "conceptId": "concept.statistics-ethics.perioperative-dnr",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.withdraw-agreed-trial.v1",
    "caseId": "case.topic.quality-safety-systems.round3.directive-trial.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.withdraw-agreed-trial.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.withdraw-agreed-trial.v1",
    "conceptId": "concept.topic.quality-safety-systems.round3.withdraw-agreed-trial.v1",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.consent-alternative.v1",
    "caseId": "case.topic.quality-safety-systems.round3.consent-choice.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.consent-alternative.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.consent-alternative.v1",
    "conceptId": "concept.statistics-ethics.informed-consent",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.family-disclosure-scope.v1",
    "caseId": "case.topic.quality-safety-systems.round3.confidentiality.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.family-disclosure-scope.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.family-disclosure-scope.v1",
    "conceptId": "concept.statistics-ethics.confidentiality",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.imminent-threat-disclosure.v1",
    "caseId": "case.topic.quality-safety-systems.round3.confidentiality.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.imminent-threat-disclosure.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.imminent-threat-disclosure.v1",
    "conceptId": "concept.topic.quality-safety-systems.round3.imminent-threat-disclosure.v1",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.referral-remuneration.v1",
    "caseId": "case.topic.quality-safety-systems.round3.financial.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.referral-remuneration.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.referral-remuneration.v1",
    "conceptId": "concept.topic.quality-safety-systems.round3.referral-remuneration.v1",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.current-functional-impairment.v1",
    "caseId": "case.topic.quality-safety-systems.round3.impairment.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.current-functional-impairment.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.current-functional-impairment.v1",
    "conceptId": "concept.statistics-ethics.impaired-colleague",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.ineffective-care-dispute.v1",
    "caseId": "case.topic.quality-safety-systems.round3.ineffective.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.ineffective-care-dispute.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.ineffective-care-dispute.v1",
    "conceptId": "concept.topic.quality-safety-systems.round3.ineffective-care-dispute.v1",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.donation-decision-separation.v1",
    "caseId": "case.topic.quality-safety-systems.round3.donation.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.donation-decision-separation.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.donation-decision-separation.v1",
    "conceptId": "concept.topic.quality-safety-systems.round3.donation-decision-separation.v1",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.donation-death-roles.v1",
    "caseId": "case.topic.quality-safety-systems.round3.donation.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.donation-death-roles.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.donation-death-roles.v1",
    "conceptId": "concept.topic.quality-safety-systems.round3.donation-death-roles.v1",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.stoma-below-fascia.v1",
    "caseId": "case.topic.quality-safety-systems.round3.stoma-depth.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.stoma-below-fascia.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.stoma-below-fascia.v1",
    "conceptId": "concept.topic.quality-safety-systems.round3.stoma-below-fascia.v1",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.output-intermittent-obstruction.v1",
    "caseId": "case.topic.quality-safety-systems.round3.output.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.output-intermittent-obstruction.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.output-intermittent-obstruction.v1",
    "conceptId": "concept.topic.quality-safety-systems.round3.output-intermittent-obstruction.v1",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.output-oral-replacement.v1",
    "caseId": "case.topic.quality-safety-systems.round3.output.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.output-oral-replacement.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.output-oral-replacement.v1",
    "conceptId": "concept.high-output-ileostomy.sodium-glucose-oral-rehydration",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.ecf-distal-nutrition.v1",
    "caseId": "case.topic.quality-safety-systems.round3.ecf-nutrition.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.ecf-distal-nutrition.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.ecf-distal-nutrition.v1",
    "conceptId": "concept.topic.quality-safety-systems.round3.ecf-distal-nutrition.v1",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.ecf-obstruction-reconstruction.v1",
    "caseId": "case.topic.quality-safety-systems.round3.ecf-readiness.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.ecf-obstruction-reconstruction.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.ecf-obstruction-reconstruction.v1",
    "conceptId": "concept.topic.quality-safety-systems.round3.ecf-obstruction-reconstruction.v1",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.parastomal-elective-escalation.v1",
    "caseId": "case.topic.quality-safety-systems.round3.parastomal.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.parastomal-elective-escalation.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.parastomal-elective-escalation.v1",
    "conceptId": "concept.parastomal-hernia.nonurgent-stoma-specialist-management",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.hfmea-independent-control.v1",
    "caseId": "case.topic.quality-safety-systems.round3.prospective-label.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.hfmea-independent-control.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.hfmea-independent-control.v1",
    "conceptId": "concept.topic.quality-safety-systems.round3.hfmea-independent-control.v1",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.block-versus-incision-pause.v1",
    "caseId": "case.topic.quality-safety-systems.round3.phase-pause.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.block-versus-incision-pause.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.block-versus-incision-pause.v1",
    "conceptId": "concept.topic.quality-safety-systems.round3.block-versus-incision-pause.v1",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.just-culture-behavior.v1",
    "caseId": "case.topic.quality-safety-systems.round3.just-culture.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.just-culture-behavior.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.just-culture-behavior.v1",
    "conceptId": "concept.topic.quality-safety-systems.round3.just-culture-behavior.v1",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.ssi-drain-prophylaxis.v1",
    "caseId": "case.topic.quality-safety-systems.round3.ssi-prophylaxis.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.ssi-drain-prophylaxis.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.ssi-drain-prophylaxis.v1",
    "conceptId": "concept.topic.quality-safety-systems.round3.ssi-drain-prophylaxis.v1",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.nsqip-case-mix.v1",
    "caseId": "case.topic.quality-safety-systems.round3.nsqip.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.nsqip-case-mix.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.nsqip-case-mix.v1",
    "conceptId": "concept.topic.quality-safety-systems.round3.nsqip-case-mix.v1",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.topic.quality-safety-systems.round3.control-chart-choice.v1",
    "caseId": "case.topic.quality-safety-systems.round3.control-chart.v1",
    "nodeId": "node.topic.quality-safety-systems.round3.control-chart-choice.v1",
    "questionVariantId": "question.topic.quality-safety-systems.round3.control-chart-choice.v1",
    "conceptId": "concept.topic.quality-safety-systems.round3.control-chart-choice.v1",
    "sourceView": "topic-batch7-quality-safety-systems",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.soft-tissue-mass.specialist-planned-biopsy.v1.r6",
    "caseId": "case.soft-tissue-mass.deep-thigh",
    "nodeId": "node.soft-tissue-mass.deep-thigh.2",
    "questionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v1.r6",
    "conceptId": "concept.soft-tissue-mass.specialist-planned-biopsy",
    "sourceView": "topic-batch7-d97aa716",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  },
  {
    "acceptanceId": "question.soft-tissue-mass.specialist-planned-biopsy.v2.r6",
    "caseId": "case.soft-tissue-mass.upper-arm",
    "nodeId": "node.soft-tissue-mass.upper-arm.2",
    "questionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v2.r6",
    "conceptId": "concept.soft-tissue-mass.specialist-planned-biopsy",
    "sourceView": "topic-batch7-d97aa716",
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md"
  }
,

  // Batch 8: exact owner-directed successors and the new dantrolene item.
{
    "acceptanceId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r4",
    "caseId": "case.gs028d.acid-base.b-cirrhosis-gap",
    "nodeId": "node.gs028d.acid-base.b-cirrhosis-gap.1",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r4",
    "conceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
    "sourceView": "owner-decisions-batch8",
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md"
  },
  {
    "acceptanceId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r4",
    "caseId": "case.gs028d.acid-base.b-sepsis-recovery-gap",
    "nodeId": "node.gs028d.acid-base.b-sepsis-recovery-gap.1",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r4",
    "conceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
    "sourceView": "owner-decisions-batch8",
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md"
  },
  {
    "acceptanceId": "question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v2",
    "caseId": "case.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence-pass.v1",
    "nodeId": "node.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v1",
    "questionVariantId": "question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v2",
    "conceptId": "concept.mh.nontriggering-plan-and-testing-sequence.v1",
    "sourceView": "owner-decisions-batch8",
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md"
  },
  {
    "acceptanceId": "question.malignant-hyperthermia-susceptibility.dantrolene-readiness.v1",
    "caseId": "case.owner-decisions.20261112.mh-medication",
    "nodeId": "node.owner-decisions.20261112.mh-medication",
    "questionVariantId": "question.malignant-hyperthermia-susceptibility.dantrolene-readiness.v1",
    "conceptId": "concept.mh.dantrolene-readiness.v1",
    "sourceView": "owner-decisions-batch8",
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md"
  },
  {
    "acceptanceId": "question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v2",
    "caseId": "case.topic.colorectal-polyps-cancer.persistent-rectal-wall-focus.v1",
    "nodeId": "node.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v2",
    "conceptId": "concept.rectal-cancer.selected-watch-and-wait",
    "sourceView": "owner-decisions-batch8",
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md"
  },
  {
    "acceptanceId": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v3",
    "caseId": "case.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance-review.v2",
    "nodeId": "node.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v2",
    "questionVariantId": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v3",
    "conceptId": "concept.bowel-ibd-malabsorption-short-bowel.crohn-postresection-endoscopy.v1",
    "sourceView": "owner-decisions-batch8",
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v2",
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.hernia-anemia.v1",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v2",
    "conceptId": "concept.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
    "sourceView": "owner-decisions-batch8",
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md"
  },
  {
    "acceptanceId": "question.gs028f.gynecology.symptomatic-falling-hcg-localization.v2",
    "caseId": "case.gs028f.gynecology.c1-late-period",
    "nodeId": "node.gs028f.gynecology.c1-late-period.1",
    "questionVariantId": "question.gs028f.gynecology.symptomatic-falling-hcg-localization.v2",
    "conceptId": "concept.early-pregnancy.location-before-disposition.v1",
    "sourceView": "owner-decisions-batch8",
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md"
  },
  {
    "acceptanceId": "question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v4",
    "caseId": "case.topic.perioperative-risk-recovery.awake-gas.v3",
    "nodeId": "node.topic.perioperative-risk-recovery.awake-ventilation-assessment.v3",
    "questionVariantId": "question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v4",
    "conceptId": "concept.preoperative-osa.awake-ventilation-assessment.v1",
    "sourceView": "owner-decisions-batch8",
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md"
  },
  {
    "acceptanceId": "question.ptld.tissue-diagnosis-coordination.v4.r4",
    "caseId": "case.gs028b.ptld.b-pathology-returned",
    "nodeId": "node.gs028b.ptld.b-pathology-returned.1",
    "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r4",
    "conceptId": "concept.ptld.node-specimen-and-ancillary-handling.v1",
    "sourceView": "owner-decisions-batch8",
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md"
  }
,

  // Batch9: exact reviewed, whole-case, ENG-I01-compatible intraop/record drafts.

  {
    "acceptanceId": "question.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1",
    "caseId": "case.intraop.anesthetic-intraoperative-crises.mh-electrolyte.v1",
    "nodeId": "node.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1",
    "questionVariantId": "question.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1",
    "conceptId": "concept.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1",
    "sourceView": "intraop-batch9-anesthetic-intraoperative-crises",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
    "caseId": "case.intraop.endoscopic-perforation-and-injury.postclip-hospital-record.v1",
    "nodeId": "node.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
    "questionVariantId": "question.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
    "conceptId": "concept.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1",
    "sourceView": "intraop-batch9-endoscopic-perforation-and-injury",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1",
    "caseId": "case.intraop.ercp-access-and-adverse-events.periampullary-injury-course.v1",
    "nodeId": "node.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1",
    "questionVariantId": "question.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1",
    "conceptId": "concept.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1",
    "sourceView": "intraop-batch9-ercp-access-and-adverse-events",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1",
    "caseId": "case.intraop.ercp-access-and-adverse-events.periampullary-injury-course.v1",
    "nodeId": "node.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1",
    "questionVariantId": "question.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1",
    "conceptId": "concept.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1",
    "sourceView": "intraop-batch9-ercp-access-and-adverse-events",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1",
    "caseId": "case.intraop.ercp-access-and-adverse-events.pancreatic-protection.v1",
    "nodeId": "node.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1",
    "questionVariantId": "question.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1",
    "conceptId": "concept.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1",
    "sourceView": "intraop-batch9-ercp-access-and-adverse-events",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1",
    "caseId": "case.intraop.groin-hernia.sliding-sac.20261112.v1",
    "nodeId": "node.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1",
    "questionVariantId": "question.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1",
    "conceptId": "concept.intraop.groin-hernia.sliding-content-dissection.v1",
    "sourceView": "intraop-batch9-groin-hernia-anatomy-and-injury",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.groin-hernia.adherent-distal-sac.20261112.v1",
    "caseId": "case.intraop.groin-hernia.sliding-sac.20261112.v1",
    "nodeId": "node.intraop.groin-hernia.adherent-distal-sac.20261112.v1",
    "questionVariantId": "question.intraop.groin-hernia.adherent-distal-sac.20261112.v1",
    "conceptId": "concept.intraop.groin-hernia.adherent-sac-cord-preservation.v1",
    "sourceView": "intraop-batch9-groin-hernia-anatomy-and-injury",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.groin-hernia.urinary-leak-localization.20261112.v1",
    "caseId": "case.intraop.groin-hernia.urinary-findings.20261112.v1",
    "nodeId": "node.intraop.groin-hernia.urinary-leak-localization.20261112.v1",
    "questionVariantId": "question.intraop.groin-hernia.urinary-leak-localization.20261112.v1",
    "conceptId": "concept.intraop.groin-hernia.suspected-bladder-injury-localization.v1",
    "sourceView": "intraop-batch9-groin-hernia-anatomy-and-injury",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.lap-access.major-access-injury.20261112.v1",
    "caseId": "case.intraop.lap-access.outside-access-rescue.20261112.v1",
    "nodeId": "node.intraop.lap-access.major-access-injury.20261112.v1",
    "questionVariantId": "question.intraop.lap-access.major-access-injury.20261112.v1",
    "conceptId": "concept.intraop.lap-access.major-access-injury.v1",
    "sourceView": "intraop-batch9-laparoscopic-access-and-insufflation",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.operative-hemorrhage.pringle-persistent-posterior.20261112.v1",
    "caseId": "case.intraop.operative-hemorrhage.posterior-liver-record.20261112.v1",
    "nodeId": "node.intraop.operative-hemorrhage.pringle-persistent-posterior.20261112.v1",
    "questionVariantId": "question.intraop.operative-hemorrhage.pringle-persistent-posterior.20261112.v1",
    "conceptId": "concept.intraop.operative-hemorrhage.pringle-persistent-posterior.v1",
    "sourceView": "intraop-batch9-operative-hemorrhage-and-splenic-injury",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.i25.anatomy-before-dilation.20261112.v1",
    "caseId": "case.intraop.i25.unmapped-narrowing.20261112.v1",
    "nodeId": "node.intraop.i25.anatomy-before-dilation.20261112.v1",
    "questionVariantId": "question.intraop.i25.anatomy-before-dilation.20261112.v1",
    "conceptId": "concept.intraop.i25.anatomy-before-dilation.20261112.v1",
    "sourceView": "intraop-batch9-pediatric-egd-food-impaction-eoe",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.i24.battery-injury-imaging.20261112.v1",
    "caseId": "case.intraop.i24.battery-injury-record.20261112.v1",
    "nodeId": "node.intraop.i24.battery-injury-imaging.20261112.v1",
    "questionVariantId": "question.intraop.i24.battery-injury-imaging.20261112.v1",
    "conceptId": "concept.intraop.i24.battery-injury-imaging.20261112.v1",
    "sourceView": "intraop-batch9-pediatric-endoscopy-foreign-body",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
    "caseId": "case.intraop.thyroid-nerve-monitoring.distal-response-coverage.v1",
    "nodeId": "node.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
    "questionVariantId": "question.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
    "conceptId": "concept.intraop.thyroid-nerve-monitoring.proximal-verification.v1",
    "sourceView": "intraop-batch9-thyroid-nerve-monitoring",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.thyroid-nerve-monitoring.recording-check.v1",
    "caseId": "case.intraop.thyroid-nerve-monitoring.two-signal-events.v1",
    "nodeId": "node.intraop.thyroid-nerve-monitoring.recording-check.v1",
    "questionVariantId": "question.intraop.thyroid-nerve-monitoring.recording-check.v1",
    "conceptId": "concept.intraop.thyroid-nerve-monitoring.recording-check.v1",
    "sourceView": "intraop-batch9-thyroid-nerve-monitoring",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
    "caseId": "case.intraop.thyroid-nerve-monitoring.two-signal-events.v1",
    "nodeId": "node.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
    "questionVariantId": "question.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
    "conceptId": "concept.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1",
    "sourceView": "intraop-batch9-thyroid-nerve-monitoring",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.unexpected-bowel.base-margin.20261112.v1",
    "caseId": "case.intraop.unexpected-bowel.base-margin.20261112.v1",
    "nodeId": "node.intraop.unexpected-bowel.base-margin.20261112.v1",
    "questionVariantId": "question.intraop.unexpected-bowel.base-margin.20261112.v1",
    "conceptId": "concept.intraop.unexpected-bowel.appendiceal-base-margin.v1",
    "sourceView": "intraop-batch9-unexpected-appendix-and-bowel-findings",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  },
  {
    "acceptanceId": "question.intraop.unexpected-bowel.ileitis-restraint.20261112.v1",
    "caseId": "case.intraop.unexpected-bowel.ileitis-restraint.20261112.v1",
    "nodeId": "node.intraop.unexpected-bowel.ileitis-restraint.20261112.v1",
    "questionVariantId": "question.intraop.unexpected-bowel.ileitis-restraint.20261112.v1",
    "conceptId": "concept.intraop.unexpected-bowel.unexpected-ileitis-operative-restraint.v1",
    "sourceView": "intraop-batch9-unexpected-appendix-and-bowel-findings",
    "decision": "docs/research/question-intraop-acceptance-batch9-20261112.md"
  }
,

  // Batch10 exact whole-case ENG-I01b and standalone salvage acceptance.

  {
    "acceptanceId": "question.intraop.asc-access.anterior-port-course.20261112.v1",
    "caseId": "case.intraop.asc-access.port-course.20261112.v1",
    "nodeId": "node.intraop.asc-access.anterior-port-course.20261112.v1",
    "questionVariantId": "question.intraop.asc-access.anterior-port-course.20261112.v1",
    "conceptId": "concept.intraop.asc-access.orthogonal-port-course-correction.v1",
    "sourceView": "intraop-batch10-asc-access-and-soft-tissue-surprises",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.biliary-safety.unexplained-bile.20261112.v1",
    "caseId": "case.intraop.biliary-safety.new-bile.20261112.v1",
    "nodeId": "node.intraop.biliary-safety.unexplained-bile.20261112.v1",
    "questionVariantId": "question.intraop.biliary-safety.unexplained-bile.20261112.v1",
    "conceptId": "concept.intraop-biliary.unexplained-bile-imaging.v1",
    "sourceView": "intraop-batch10-biliary-safety-and-duct-decisions",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.biliary-safety.major-injury-transfer.20261112.v1",
    "caseId": "case.intraop.biliary-safety.new-bile.20261112.v1",
    "nodeId": "node.intraop.biliary-safety.major-injury-transfer.20261112.v1",
    "questionVariantId": "question.intraop.biliary-safety.major-injury-transfer.20261112.v1",
    "conceptId": "concept.n2.bile-leak-duct-continuity-boundary",
    "sourceView": "intraop-batch10-biliary-safety-and-duct-decisions",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.biliary-safety.stone-clearance-route.20261112.v1",
    "caseId": "case.intraop.biliary-safety.stone-clearance.20261112.v1",
    "nodeId": "node.intraop.biliary-safety.stone-clearance-route.20261112.v1",
    "questionVariantId": "question.intraop.biliary-safety.stone-clearance-route.20261112.v1",
    "conceptId": "concept.intraop-biliary.stone-clearance-route.v1",
    "sourceView": "intraop-batch10-biliary-safety-and-duct-decisions",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1",
    "caseId": "case.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1",
    "nodeId": "node.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1",
    "questionVariantId": "question.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1",
    "conceptId": "concept.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1",
    "sourceView": "intraop-batch10-endoscopic-perforation-and-injury",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1",
    "caseId": "case.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1",
    "nodeId": "node.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1",
    "questionVariantId": "question.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1",
    "conceptId": "concept.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1",
    "sourceView": "intraop-batch10-endoscopic-perforation-and-injury",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1",
    "caseId": "case.intraop.endoscopic-perforation-and-injury.dilation-observed-defect.v1",
    "nodeId": "node.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1",
    "questionVariantId": "question.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1",
    "conceptId": "concept.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1",
    "sourceView": "intraop-batch10-endoscopic-perforation-and-injury",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
    "caseId": "case.intraop.suspicious-polyps.new-descending-colon-focus.20261112.v1",
    "nodeId": "node.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
    "questionVariantId": "question.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
    "conceptId": "concept.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1",
    "sourceView": "intraop-batch10-suspicious-polyps-retrieval-and-tattoo",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.anesthetic-intraoperative-crises.anaphylaxis-infusion.v1",
    "caseId": "case.intraop.anesthetic-intraoperative-crises.anaphylaxis-response-salvage.v1",
    "nodeId": "node.intraop.anesthetic-intraoperative-crises.anaphylaxis-infusion.v1",
    "questionVariantId": "question.intraop.anesthetic-intraoperative-crises.anaphylaxis-infusion.v1",
    "conceptId": "concept.intraop.anesthetic-intraoperative-crises.periop-anaphylaxis-sustained-rescue.v1",
    "sourceView": "intraop-batch10-anesthetic-intraoperative-crises",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1",
    "caseId": "case.intraop.upper-gi-hemostasis.esophageal-variceal-record.20261112-salvage.v1",
    "nodeId": "node.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1",
    "questionVariantId": "question.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1",
    "conceptId": "concept.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1",
    "sourceView": "intraop-batch10-endoscopic-upper-gi-hemostasis",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1",
    "caseId": "case.intraop.pediatric-anesthesia-events.egd-airway-salvage.v1",
    "nodeId": "node.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1",
    "questionVariantId": "question.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1",
    "conceptId": "concept.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1",
    "sourceView": "intraop-batch10-pediatric-anesthesia-events",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1",
    "caseId": "case.intraop.pediatric-anesthesia-events.hernia-airflow-salvage.v1",
    "nodeId": "node.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1",
    "questionVariantId": "question.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1",
    "conceptId": "concept.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1",
    "sourceView": "intraop-batch10-pediatric-anesthesia-events",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1",
    "caseId": "case.intraop.pediatric-orchiopexy.inguinal-descent.20261112-salvage.v1",
    "nodeId": "node.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1",
    "questionVariantId": "question.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1",
    "conceptId": "concept.intraop.pediatric-orchiopexy.residual-cord-mobilization.v1",
    "sourceView": "intraop-batch10-pediatric-orchiopexy-findings",
    "decision": "docs/research/question-intraop-acceptance-batch10-20261113.md"
  }
,

  // Batch11 exact whole-case ENG-I01b and standalone salvage acceptance.

  {
    "acceptanceId": "question.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1",
    "caseId": "case.intraop.anorectal-eua.crohn-checkpoints.20261112-salvage.v1",
    "nodeId": "node.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1",
    "questionVariantId": "question.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1",
    "conceptId": "concept.intraop.anorectal-eua.crohn-rectal-activity.v1",
    "sourceView": "intraop-batch11-anorectal-eua-and-fistula",
    "decision": "docs/research/question-intraop-acceptance-batch11-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.parathyroid.sample-integrity.v1",
    "caseId": "case.intraop.parathyroid.missing-gland-salvage.v1",
    "nodeId": "node.intraop.parathyroid.sample-integrity.v1",
    "questionVariantId": "question.intraop.parathyroid.sample-integrity.v1",
    "conceptId": "concept.intraop.parathyroid.sample-integrity.v1",
    "sourceView": "intraop-batch11-parathyroid-localization-and-preservation",
    "decision": "docs/research/question-intraop-acceptance-batch11-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.parathyroid.selective-salvage.v1",
    "caseId": "case.intraop.parathyroid.gland-preservation-salvage.v1",
    "nodeId": "node.intraop.parathyroid.selective-salvage.v1",
    "questionVariantId": "question.intraop.parathyroid.selective-salvage.v1",
    "conceptId": "concept.intraop.parathyroid.selective-salvage.v1",
    "sourceView": "intraop-batch11-parathyroid-localization-and-preservation",
    "decision": "docs/research/question-intraop-acceptance-batch11-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1",
    "caseId": "case.intraop.polypectomy.ascending-emr-completion.20261112-salvage.v1",
    "nodeId": "node.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1",
    "questionVariantId": "question.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1",
    "conceptId": "concept.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1",
    "sourceView": "intraop-batch11-polypectomy-technique-and-bleeding",
    "decision": "docs/research/question-intraop-acceptance-batch11-20261113.md"
  }
,
] satisfies QuestionShipAcceptance[],
  // BEGIN FLAGS2 WHOLE-CASE ACCEPTANCES 20261105
  retirements: [
  {
    "caseId": "case.pediatric-gi-abdominal-wall.preterm-hernia-timing-salvage.v1",
    "questionVariantIds": [
      "question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1"
    ],
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md",
    "reason": "Owner-directed retirement TOPIC-202 (2026-11-12): framing or teaching-item retirement; preserve frozen encounters and FSRS."
  },
  {
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness-salvage.v1",
    "questionVariantIds": [
      "question.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2"
    ],
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md",
    "reason": "Owner-directed retirement TOPIC-218 (2026-11-12): framing or teaching-item retirement; preserve frozen encounters and FSRS."
  },
  {
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-completed-negative",
    "questionVariantIds": [
      "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r5"
    ],
    "decision": "docs/research/question-topic-acceptance-batch7-20261112.md",
    "reason": "Owner-directed retirement TOPIC-287 (2026-11-12): framing or teaching-item retirement; preserve frozen encounters and FSRS."
  }
,
{
    "caseId": "case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1",
    "questionVariantIds": [
      "question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1"
    ],
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md",
    "reason": "Owner-directed retirement 2026-11-12: neonatal clinical framing is outside the accepted patient/art setting."
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1",
    "questionVariantIds": [
      "question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2"
    ],
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md",
    "reason": "Owner-directed retirement 2026-11-12: neonatal clinical framing is outside the accepted patient/art setting."
  },
  {
    "caseId": "case.topic.fluids-electrolytes-acid-base.current-corrected-gap.r2",
    "questionVariantIds": [
      "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r2.topic20261111.v2"
    ],
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md",
    "reason": "Owner-directed anion-gap successor replaces this additional live correction-dependent predecessor.",
    "replacementQuestionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r4"
  }

] satisfies QuestionShipCaseRetirement[],
  replacements: [
    {"replaces":"case.pediatric-clinic.growing-firm-neck-node","with":"question.pediatric-neck-thoracic-gu.20261111.node-sample.v1"},
    {"replaces":"case.pediatric-clinic.retractile-testis-remains-scrotal","with":"question.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2"},
    {"replaces":"case.gs028.varicose-veins.a-asymmetric-branches","with":"question.vascular-venous-lymphatic-access.varicose-proximal-territory.20261111.v1"},
    {"replaces":"case.gs028.primary-midline-hernia.paired-epigastric-focal-lump","with":"question.topic.hernia-ventral-abdominal-wall.epigastric-referral.v1"},
    {"replaces":"case.gs028b.mesh-infection.b-failed-conservative","with":"question.topic.hernia-ventral-abdominal-wall.mesh-failed-salvage.v1"},
    {"replaces":"case.thyroid-nodule.palpable-referral","with":"question.topic.thyroid-nodules-cancer.r01.v2"},
    {"replaces":"case.gs028b.differentiated-thyroid-cancer.a-molecular-malignancy","with":"question.topic.thyroid-nodules-cancer.r06.v2"},
    {"replaces":"case.gs028.burn.b-small-simple-scald","with":"question.topic.burns-inhalation.limited-scald-disposition.v1"},
    {"replaces":"case.anal-squamous-cell-cancer.new-mass","with":"question.topic.anal-cancer.clear-margin-observation.v1"},
    {"replaces":"case.anal-squamous-cell-cancer.persistent-ulcer","with":"question.topic.anal-cancer.irradiated-groin-recurrence.v1"},
    {"replaces":"case.anal-squamous-cell-cancer.bleeding-lesion","with":"question.topic.anal-cancer.regional-node-treatment.v1"},
    {"replaces":"case.soft-tissue-mass.calf-indeterminate","with":"question.topic-soft-tissue-sarcoma-desmoid.calf-core-tract.20261111.v1"},
    {"replaces":"case.soft-tissue-mass.forearm-progressive","with":"question.topic-soft-tissue-sarcoma-desmoid.forearm-biopsy-correspondence.20261111.v1"},
    {"replaces":"case.variety3.sedation-unaccompanied-taxi","with":"question.topic.anesthesia-analgesia-pharmacology.opioid-respiratory-endpoint.v2"},
    {"replaces":"case.gs028se.pdsa-act-qi-measures.a-adopt-next","with":"question.topic.quality-safety-systems.pdsa-local-spread.v1"},
    {"replaces":"case.gs028se.pdsa-act-qi-measures.a-adapt-burden","with":"question.topic.quality-safety-systems.pdsa-burden-adapt.v2"},
    {"replaces":"case.nephrolithiasis.recurrent-flank-pain","with":"question.nephrolithiasis.noncontrast-ct-evaluation.v1.topic20261111.v2"},
    {"replaces":"case.nephrolithiasis.uncertain-ureteral-stone","with":"question.nephrolithiasis.noncontrast-ct-evaluation.v2.topic20261111.v2"},
    {"replaces":"case.nephrolithiasis.hematuria-colic","with":"question.nephrolithiasis.noncontrast-ct-evaluation.v4.topic20261111.v2"},
    {"replaces":"case.uncomplicated-diverticulitis.first-flare","with":"question.topic.colon-diverticular-lower-bleeding.first-episode-with-urinary-symptoms.v1"},
    {"replaces":"case.uncomplicated-diverticulitis.left-lower-pain","with":"question.topic.colon-diverticular-lower-bleeding.first-presentation-ct.v1"},
    {"replaces":"case.recovered-diverticulitis.ct-resolved","with":"question.topic.colon-diverticular-lower-bleeding.post-recovery-alarm-colonoscopy.v2"},
    {"replaces":"case.preoperative-gerd.medication-concerns","with":"question.topic.esophagus-gerd-barrett-hiatal.proven-gerd-on-therapy.v1"},
    {"replaces":"case.preoperative-gerd.persistent-heartburn","with":"question.topic.esophagus-gerd-barrett-hiatal.unproven-reflux.v3"},
    {"replaces":"case.esophageal-dysphagia.restaurant-meals","with":"question.topic.esophagus-gerd-barrett-hiatal.visible-lesion-first.v1"},
    {"replaces":"case.gs028e.operative-infection.c1-unexpected-gross-spill","with":"question.topic.surgical-infection-antibiotics.pelvic-source-route.v3"},
    {"replaces":"case.achalasia.slow-meals","with":"question.topic.esophagus-motility-achalasia.borderline-aperistalsis-study.v1"},
    {"replaces":"case.esophageal-dysphagia.bread-sticking","with":"question.topic.esophagus-gerd-barrett-hiatal.irregular-z-surveillance-boundary.v1"},
    {"replaces":"case.variety3.barrett-patient-asks-ablation","with":"question.topic.esophagus-gerd-barrett-hiatal.surveillance-from-primary-record.v2"},
    {"replaces":"case.gs028e.operative-infection.c1-controlled-bowel-entry","with":"question.topic.surgical-infection-antibiotics.culture-directed-narrowing.v2"},
    {"replaces":"case.uncomplicated-diverticulitis.localized-pain","with":"question.topic.colon-diverticular-lower-bleeding.large-accessible-abscess.v1"},
    {"replaces":"case.recovered-diverticulitis.recovery-visit","with":"question.topic.colon-diverticular-lower-bleeding.immunosuppressed-antibiotic-decision.v2"},
    {"replaces":"case.recovered-diverticulitis.hospital-followup","with":"question.topic.colon-diverticular-lower-bleeding.ongoing-bleeding-cta.v1"},
    {"replaces":"case.gs028c.mild-biliary-pancreatitis.a-biliary-source-known","with":"question.topic.pancreas-acute-pancreatitis.moderate-resuscitation.v1.r2"},
    {"replaces":"case.gs028c.mild-biliary-pancreatitis.a-requests-necrosis-check","with":"question.topic.pancreas-acute-pancreatitis.responding-infected-necrosis.v1.r2"},
    {"replaces":"case.peripheral-arterial-disease.warehouse-walk","with":"question.vascular-limb-mesenteric-arterial.exercise-exposure.v2"},
    {"replaces":"case.gs028c.acute-mesenteric-ischemia.a-kidney-injury","with":"question.vascular-limb-mesenteric-arterial.ami-cta-aki.v2"},
    {"replaces":"case.l2.gastroparesis.objective-result-selection.v1","with":"question.topic.stomach-ulcer-bleeding-motility.confounded-scan.v1"},
    {"replaces":"case.gs028b.post-neoadjuvant-breast.b-radiation-declined","with":"question.topic.breast-cancer.diffuse-malignant-residual.v2"},
    {"replaces":"case.gs028c.appendicitis.b-ct-confirmed-appendicolith","with":"question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1"},
    {"replaces":"case.aaa.remote-smoking","with":"question.vascular-aorta.stable-branch-flow.v1"},
    {"replaces":"case.pancreatic-cyst.body-cyst-followup","with":"question.topic.pancreas-chronic-cysts-neoplasia.ipmn-high-risk-plan.v1"},
    {"replaces":"case.gs028d.blunt-cardiac-injury.b-both-results-normal","with":"question.trauma-thoracic.bci-normalpair-other-admission.20261111.v1"},
    {"replaces":"case.aaa.retired-carpenter","with":"question.vascular-aorta.screening.v2"},
    {"replaces":"case.aaa.current-smoker","with":"question.vascular-aorta.small-embolizing-paa.v2"},
    {"replaces":"case.hcc.resection.candidate-profile","with":"question.topic.liver-malignancy.hcc-raw-reserve.v2"},
    {"replaces":"case.pancreatic-cyst.tail-lesion-review","with":"question.topic.pancreas-chronic-cysts-neoplasia.serous-symptomatic-plan.v1"},
    {"replaces":"case.pancreatic-cyst.surveillance-question","with":"question.topic.pancreas-chronic-cysts-neoplasia.ipmn-remnant-surveillance.v1"},
    {"replaces":"case.gs028.small-bowel-obstruction.b-stable-no-red-flags","with":"question.topic.small-bowel-obstruction-ileus.closed-loop-normal-lactate.v1"},
    {"replaces":"case.gs028.small-bowel-obstruction.b-peritoneal-signs","with":"question.topic.small-bowel-obstruction-ileus.postcontrast-deterioration.v1"},
    { replaces: "case.gs028f.nutrition.c1-metabolic-transition", with: "question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3.r3" },
    { replaces: "case.gs028c.palpable-breast.paired-dense-focal", with: "question.palpable-breast.negative-mammogram-targeted-us.v1.r4" },
    { replaces: "case.asymptomatic-phpt.incidental-calcium", with: "question.asymptomatic-phpt.age-based-surgery.v1.r3" },
    // Flags3 replaces the old workup/plan node list with classification/plan.
    { replaces: "case.inguinal-hernia.caregiving-strain", with: "question.inguinal-hernia.symptomatic-elective-repair.v3.r12" },
  ] satisfies QuestionShipCaseReplacement[],
  // END FLAGS2 WHOLE-CASE ACCEPTANCES 20261105
  topicConsolidations: [

    {"id":"topic-program.batch5.case.vascular-venous-lymphatic-access.postop-negative-summary.20261111.v2","program":"topic-program","replaces":["case.postoperative-dvt.bowel-surgery","case.postoperative-dvt.hernia-repair","case.postoperative-dvt.postop-visit"],"with":"question.vascular-venous-lymphatic-access.postop-residual-duration.20261111.v1","decision":"docs/research/question-topic-acceptance-batch5-20261111.md"},
    {"id":"topic-program.batch5.case.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1","program":"topic-program","replaces":["case.venous-leg-ulcer.healed-edge","case.venous-leg-ulcer.recurrent-ulcer","case.venous-leg-ulcer.varicose-changes"],"with":"question.vascular-venous-lymphatic-access.ulcer-unoccluded-ankle.20261111.v1","decision":"docs/research/question-topic-acceptance-batch5-20261111.md"},
    {"id":"topic-program.batch5.case.topic.bariatric-metabolic.spontaneous-sample-salvage.v1","program":"topic-program","replaces":["case.post-bariatric-hypoglycemia.postmeal-confusion","case.post-bariatric-hypoglycemia.postmeal-dizziness","case.post-bariatric-hypoglycemia.postmeal-shaking","case.post-bariatric-hypoglycemia.postmeal-weakness"],"with":"question.topic.bariatric-metabolic.spontaneous-sample-before-label.v2","decision":"docs/research/question-topic-acceptance-batch5-20261111.md"},
    {"id":"topic-program.batch5.case.pediatric-gi-abdominal-wall.preterm-hernia-timing-salvage.v1","program":"topic-program","replaces":["case.pediatric-clinic.groin-bulge-after-play","case.pediatric-clinic.intermittent-groin-swelling"],"with":"question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1","decision":"docs/research/question-topic-acceptance-batch5-20261111.md"},
    {"id":"topic-program.batch4.case.topic.thyroid-nodules-cancer.multiple-nodules.v1","program":"topic-program","replaces":["case.thyroid-nodule.family-clinic","case.thyroid-nodule.incidental-imaging","case.thyroid-nodule.surveillance-change"],"with":"question.topic.thyroid-nodules-cancer.r02.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.thyroid-nodules-cancer.destructive-thyrotoxicosis.v1","program":"topic-program","replaces":["case.graves-pattern-recognition.v1","case.graves-pattern-recognition.v2","case.graves-pattern-recognition.v3","case.graves-pattern-recognition.v4","case.graves-trab-diagnostic-support.v1","case.graves-trab-diagnostic-support.v2","case.graves-trab-diagnostic-support.v3","case.graves-trab-diagnostic-support.v4"],"with":"question.topic.thyroid-nodules-cancer.n06.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.colorectal-polyps-cancer.favorable-stalk-pathology.v1","program":"topic-program","replaces":["case.gs028c.malignant-polyp.a-outside-slide-review","case.gs028c.malignant-polyp.a-pedunculated-enbloc"],"with":"question.topic.colorectal-polyps-cancer.stalk-local-clearance.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.colorectal-polyps-cancer.vascular-channel-polyp.v1","program":"topic-program","replaces":["case.gs028c.malignant-polyp.b-lymphovascular","case.gs028c.malignant-polyp.b-poor-grade"],"with":"question.topic.colorectal-polyps-cancer.vascular-channel-regional-resection.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.colorectal-polyps-cancer.transected-invasive-front.v1","program":"topic-program","replaces":["case.gs028c.malignant-polyp.b-piecemeal-margin","case.gs028c.malignant-polyp.b-positive-deep"],"with":"question.topic.colorectal-polyps-cancer.transected-front-regional-resection.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.colorectal-polyps-cancer.fap-rectal-field.v1","program":"topic-program","replaces":["case.fap.new-parent","case.fap.rectal-burden","case.fap.screening-call"],"with":"question.topic.colorectal-polyps-cancer.fap-diffuse-rectal-burden.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.colorectal-polyps-cancer.persistent-rectal-wall-focus.v1","program":"topic-program","replaces":["case.rectal-cancer.accountant-followup","case.rectal-cancer.caregiver-followup","case.rectal-cancer.cyclist-followup","case.rectal-cancer.teacher-followup"],"with":"question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v2","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.colorectal-polyps-cancer.positive-fit-negative-repeat-r2.v2","program":"topic-program","replaces":["case.colorectal.mailed-fit","case.colorectal.preventive-visit","case.colorectal.repeat-screening","case.colorectal.routine-screen"],"with":"question.topic.colorectal-polyps-cancer.positive-fit-negative-repeat.v2","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.colorectal-polyps-cancer.intact-low-risk-specimen-r2.v2","program":"topic-program","replaces":["case.gs028c.malignant-polyp.a-clear-cautery-line","case.gs028c.malignant-polyp.a-sessile-superficial"],"with":"question.topic.colorectal-polyps-cancer.intact-low-risk-specimen.v2","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.perioperative-risk-recovery.beta-exposure.v2","program":"topic-program","replaces":["case.bread-butter.perioperative-medications.medication-instructions","case.bread-butter.perioperative-medications.medication-review","case.bread-butter.perioperative-medications.preoperative-visit","case.bread-butter.perioperative-medications.surgery-medications","case.gs028e.radiology.c1-noncontrast-ct","case.gs028e.radiology.c1-planned-mri-ct","case.gs028e.radiology.c1-prior-ct-ultrasound","case.gs028e.radiology.c1-ultrasound-sound","case.gs028e.radiology.c2-cochlear-model","case.gs028e.radiology.c2-pacemaker-card","case.gs028e.radiology.c2-prior-scan-different","case.gs028e.radiology.c2-unidentified-implant"],"with":"question.topic.perioperative-risk-recovery.beta-new-exposure.v2","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.perioperative-risk-recovery.sglt2-hospital-course-sglt2-acid-ketone-pattern.v2","program":"topic-program","replaces":["case.gs028e.pharmacology.c1-ertugliflozin-illness","case.gs028e.pharmacology.c1-glucose-led-missed","case.gs028e.pharmacology.c1-postop-record","case.gs028e.pharmacology.c1-vomiting-empagliflozin"],"with":"question.topic.perioperative-risk-recovery.sglt2-acid-ketone-pattern.v2","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.perioperative-risk-recovery.delirium-medication-course-delirium-anticholinergic-order.v2","program":"topic-program","replaces":["case.gs028d.geriatrics.b-cognitive-risk","case.gs028d.geriatrics.b-prior-delirium","case.gs028d.geriatrics.b-sensory-impairment"],"with":"question.topic.perioperative-risk-recovery.delirium-anticholinergic-order.v2","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.perioperative-risk-recovery.breast-site-recovery-postoperative-targeted-ultrasound.v2","program":"topic-program","replaces":["case.postoperative-seroma.excisional-biopsy","case.postoperative-seroma.lumpectomy-fullness","case.postoperative-seroma.return-visit","case.postoperative-seroma.upper-outer-site"],"with":"question.topic.perioperative-risk-recovery.postoperative-targeted-ultrasound.v2","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.perioperative-risk-recovery.contrast-events.v2","program":"topic-program","replaces":["case.gs028e.radiology.c3-allergy-list-warmth","case.gs028e.radiology.c3-brief-warmth","case.gs028e.radiology.c3-hives-not-just-warm","case.gs028e.radiology.c3-limited-hives"],"with":"question.topic.perioperative-risk-recovery.contrast-event-provenance.v2","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.perioperative-risk-recovery.allergy-severe-history.v1","program":"topic-program","replaces":["case.variety3.allergy-childhood-label","case.variety3.allergy-vague-reaction"],"with":"question.topic.perioperative-risk-recovery.penicillin-delayed-boundary.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.anorectal-benign-pelvic-floor.simple-fistula.v1","program":"topic-program","replaces":["case.complex-perianal-fistula.branching-tract","case.complex-perianal-fistula.multiple-openings","case.complex-perianal-fistula.recurrent-drainage","case.complex-perianal-fistula.sphincter-risk"],"with":"question.topic.anorectal-benign-pelvic-floor.simple-fistulotomy.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.anorectal-benign-pelvic-floor.internal-hemorrhoid-banding-pass-standalone.v1","program":"topic-program","replaces":["case.internal-hemorrhoids.commute","case.internal-hemorrhoids.exercise","case.internal-hemorrhoids.followup","case.internal-hemorrhoids.workday"],"with":"question.topic.anorectal-benign-pelvic-floor.internal-hemorrhoid-banding.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.anorectal-benign-pelvic-floor.combined-hemorrhoid-excision-pass-standalone.v1","program":"topic-program","replaces":["case.variety3.external-clot-examination","case.variety3.external-clot-sudden-lump"],"with":"question.topic.anorectal-benign-pelvic-floor.combined-hemorrhoid-excision.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.anorectal-benign-pelvic-floor.long-prolapse-perineal-operation-pass-standalone.v1","program":"topic-program","replaces":["case.rectal-prolapse.elusive-prolapse","case.rectal-prolapse.reducible-prolapse","case.rectal-prolapse.standing-bulge","case.rectal-prolapse.toilet-protrusion"],"with":"question.topic.anorectal-benign-pelvic-floor.long-prolapse-perineal-operation.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.burns-inhalation.coverage-record-pass-standalone.v1","program":"topic-program","replaces":["case.gs028.burn.a-contact-moist","case.gs028.burn.a-leathery-insensate","case.gs028.burn.a-pale-less-sensate","case.gs028.burn.a-scald-blister"],"with":"question.topic.burns-inhalation.regional-excision-plan.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic-soft-tissue-sarcoma-desmoid.desmoid-function-course.20261111.v2","program":"topic-program","replaces":["case.desmoid.stable-follow-up","case.desmoid.surveillance-to-progressing-abdominal-wall","case.desmoid.initial-management-principle","case.desmoid.select-surveillance-patient","case.gs028se.p2e.research-consent.v3.desmoid"],"with":"question.topic-soft-tissue-sarcoma-desmoid.desmoid-function-course.20261111.v2","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.liver-benign-portal-infection.adenoma-man.v1","program":"topic-program","replaces":["case.hepatic-adenoma.hormone-exposure","case.hepatic-adenoma.incidental-lesion","case.hepatic-adenoma.metabolic-risk","case.hepatic-adenoma.right-upper-pressure"],"with":"question.topic.liver-benign-portal-infection.adenoma-man-resection.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.thoracic-lung-pleura-mediastinum.passed-pleural-drainage.v2","program":"topic-program","replaces":["case.gs028d.thoracic-pleural.a-fever-low-ph","case.gs028d.thoracic-pleural.a-no-accessible-fluid","case.gs028d.thoracic-pleural.a-pneumonia-low-ph","case.gs028d.thoracic-pleural.a-postoperative-low-ph"],"with":"question.topic.thoracic-lung-pleura-mediastinum.pleural-drainage.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.transplant-immunosuppression.ptld-course.v1","program":"topic-program","replaces":["case.gs028b.ptld.a-infection-mimic","case.gs028b.ptld.a-nodes-fever","case.gs028b.ptld.a-organ-dysfunction","case.gs028b.ptld.a-rising-ebv","case.gs028b.ptld.b-accessible-node","case.gs028b.ptld.b-extranodal-mass","case.gs028b.ptld.b-negative-ebv","case.gs028se.p2e.error-disclosure.v4.ptld"],"with":"question.topic.transplant-immunosuppression.ptld-discordant-tissue.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.oncology-genetics-principles.bevacizumab-open-wound.standalone.v2","program":"topic-program","replaces":["case.gs028e.oncology.c1-breast-microscopy","case.gs028e.oncology.c1-colon-spread-summary","case.gs028e.oncology.c1-grade-means-metastatic","case.gs028e.oncology.c1-node-versus-cells"],"with":"question.topic.oncology-genetics-principles.bevacizumab-open-wound.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.esophagus-structural-inflammatory-emergencies.foreign-body-chart-bone-film-complication-imaging-pass.v2","program":"topic-program","replaces":["case.gs028f.foreign-body.c1-bone-visibility","case.gs028f.foreign-body.c1-breathing-reassurance","case.gs028f.foreign-body.c1-completed-false-negative","case.gs028f.foreign-body.c1-negative-fishbone-films"],"with":"question.topic.esophagus-structural-inflammatory-emergencies.bone-film-complication-imaging.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.esophagus-structural-inflammatory-emergencies.zenker-treatment.v1","program":"topic-program","replaces":["case.zenker-diverticulum.meal-cough","case.zenker-diverticulum.neck-gurgle","case.zenker-diverticulum.night-regurgitation","case.zenker-diverticulum.regurgitated-food"],"with":"question.topic.esophagus-structural-inflammatory-emergencies.zenker-limited-neck-access.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.wound-healing-immunology.contracture-coverage.v1","program":"topic-program","replaces":["case.gs028f.reconstruction.c2-donor-cell-source","case.gs028f.reconstruction.c2-donor-not-recipient","case.gs028f.reconstruction.c2-epithelial-islands-record","case.gs028f.reconstruction.c2-partial-depth-preservation"],"with":"question.topic.wound-healing-immunology.graft-thickness.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.wound-healing-immunology.scar-function.v1","program":"topic-program","replaces":["case.gs028e.wound-healing-remaining.c1-burn-outline","case.gs028e.wound-healing-remaining.c1-incision-overgrowth","case.gs028e.wound-healing-remaining.c1-lipoma-margin","case.gs028e.wound-healing-remaining.c1-piercing-boundary"],"with":"question.topic.wound-healing-immunology.scar-contracture.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.wound-healing-immunology.revision-graft-fluid.v2","program":"topic-program","replaces":["case.gs028e.collagen-remodeling.c1-early-matrix-record","case.gs028e.collagen-remodeling.c1-later-matrix-counseling","case.gs028e.collagen-remodeling.c1-maturing-incision","case.gs028e.collagen-remodeling.c1-reversed-diagram","case.gs028f.reconstruction.c1-attached-bridge","case.gs028f.reconstruction.c1-recipient-bed","case.gs028f.reconstruction.c1-reconnected-vessels","case.gs028f.reconstruction.c1-same-donor-different-supply"],"with":"question.topic.wound-healing-immunology.graft-fluid.v2","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.biliary-injury-malignancy.communicating-leak.v1","program":"topic-program","replaces":["case.post-cholecystectomy-bile-leak.drain-output","case.post-cholecystectomy-bile-leak.delayed-recovery","case.post-cholecystectomy-bile-leak.outside-followup","case.post-cholecystectomy-bile-leak.painful-recovery"],"with":"question.topic.biliary-injury-malignancy.communicating-leak-stent.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.spleen-asplenia.early-itp-pass-standalone.20261111.v1","program":"topic-program","replaces":["case.persistent-itp.four-month","case.persistent-itp.hematology-followup","case.persistent-itp.six-month","case.persistent-itp.stable-count"],"with":"question.spleen-asplenia.itp-etiology.20261111.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence-pass.v1","program":"topic-program","replaces":["case.gs028d.anesthesia.b-documented-susceptibility","case.gs028d.anesthesia.b-family-testing-record","case.gs028d.anesthesia.b-mh-alert-bracelet","case.gs028d.anesthesia.b-prior-mh-event"],"with":"question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v2","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.anesthesia-analgesia-pharmacology.last-wide-complex-revision.v2","program":"topic-program","replaces":["case.gs028f.local-anesthetic.c1-awake-biopsy","case.gs028f.local-anesthetic.c1-dental-membrane","case.gs028f.local-anesthetic.c1-regional-report","case.gs028f.local-anesthetic.c1-topical-record"],"with":"question.topic.anesthesia-analgesia-pharmacology.last-wide-complex.v2","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.anesthesia-analgesia-pharmacology.nmb-measurement-pass.v1","program":"topic-program","replaces":["case.gs028g.neuromuscular-recovery.paired-four-twitches","case.gs028g.neuromuscular-recovery.c1-future-plan","case.gs028g.neuromuscular-recovery.c1-subjective-fade","case.gs028g.neuromuscular-recovery.paired-head-lift"],"with":"question.topic.anesthesia-analgesia-pharmacology.nmb-measurement.v1","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch4.case.topic.anesthesia-analgesia-pharmacology.boosted-midazolam-route-revision.v2","program":"topic-program","replaces":["case.gs028g.hiv-perioperative.c2-monitored-iv","case.gs028g.hiv-perioperative.c2-slow-clearance","case.gs028g.hiv-perioperative.paired-postoperative-orders"],"with":"question.topic.anesthesia-analgesia-pharmacology.boosted-midazolam-route.v2","decision":"docs/research/question-topic-acceptance-batch4-20261111.md"},
    {"id":"topic-program.batch3.case.topic.esophagus-gerd-barrett-hiatal.nighttime-symptoms.v1","program":"topic-program","replaces":["case.preoperative-gerd.night-reflux","case.preoperative-gerd.reflux-referral"],"with":"question.topic.esophagus-gerd-barrett-hiatal.off-therapy-after-normal-egd.v1","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.surgical-infection-antibiotics.incisional-response.v1","program":"topic-program","replaces":["case.bread-butter.superficial-incisional-ssi.incisional-collection","case.bread-butter.superficial-incisional-ssi.purulent-staple-line","case.bread-butter.superficial-incisional-ssi.red-incision","case.bread-butter.superficial-incisional-ssi.tender-staples"],"with":"question.topic.surgical-infection-antibiotics.postdrain-antibiotic-need.v2","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.surgical-infection-antibiotics.medication-reconciliation.v1","program":"topic-program","replaces":["case.bread-butter.postoperative-prophylaxis.cancer-surgery-follow-up","case.bread-butter.postoperative-prophylaxis.discharge-medications","case.bread-butter.postoperative-prophylaxis.drain-medications","case.bread-butter.postoperative-prophylaxis.postoperative-prophylaxis"],"with":"question.topic.surgical-infection-antibiotics.closure-prophylaxis.v2","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.trauma-head-spine-extremities.gcs-trajectory.v1","program":"topic-program","replaces":["case.gs028.glasgow-coma-scale.a-e1v2m4","case.gs028.glasgow-coma-scale.a-e2v3m5","case.gs028.glasgow-coma-scale.a-e3v4m6","case.gs028.glasgow-coma-scale.a-e4v5m6","case.gs028.glasgow-coma-scale.b-aphonia-swelling","case.gs028.glasgow-coma-scale.b-intubated","case.gs028.glasgow-coma-scale.b-language-barrier-resolved","case.gs028.glasgow-coma-scale.b-speaking-valve"],"with":"question.topic.trauma-head-spine-extremities.focal-change-ct.v2","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.bowel-ibd-malabsorption-short-bowel.celiac-record.v2","program":"topic-program","replaces":["case.celiac.chronic-diarrhea","case.celiac.family-history","case.celiac.iron-deficiency-symptoms","case.celiac.weight-loss-discomfort"],"with":"question.topic.bowel-ibd-malabsorption-short-bowel.celiac-panel.v1","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.fluids-electrolytes-acid-base.potassium-callback.v1","program":"topic-program","replaces":["case.gs028d.hyperkalaemia.a-dialysis-result","case.gs028d.hyperkalaemia.a-raas-result","case.gs028d.hyperkalaemia.a-renal-result"],"with":"question.hyperkalaemia.severe-community-result-transfer.v1.topic20261111.v1","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.hematology-transfusion-coagulation.anemia.v1","program":"topic-program","replaces":["case.iron-deficiency.adult-man-donation","case.iron-deficiency.adult-man-fatigue","case.iron-deficiency.postmenopausal-checkup","case.iron-deficiency.postmenopausal-dyspnea"],"with":"question.topic.hematology-transfusion-coagulation.anemia-gi-evaluation.v1","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.hematology-transfusion-coagulation.cholestasis-correction.v2","program":"topic-program","replaces":["case.obstructive-jaundice.vitamin-k.bleeding","case.obstructive-jaundice.vitamin-k.lab","case.obstructive-jaundice.vitamin-k.mechanism","case.obstructive-jaundice.vitamin-k.reverse"],"with":"question.topic.hematology-transfusion-coagulation.cholestasis-correction.v2","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.parathyroid-calcium.repeated-calcium.v1","program":"topic-program","replaces":["case.primary-hyperparathyroidism.stone-history","case.primary-hyperparathyroidism.bone-density-referral","case.primary-hyperparathyroidism.fragility-fracture","case.primary-hyperparathyroidism.recurrent-stone-review"],"with":"question.topic.parathyroid-calcium.r02.v1","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.parathyroid-calcium.age-biochemistry.v1","program":"topic-program","replaces":["case.asymptomatic-phpt.employment-screen","case.asymptomatic-phpt.annual-physical","case.asymptomatic-phpt.family-doctor"],"with":"question.topic.parathyroid-calcium.r04.v1","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.nutrition-support-metabolism.r2-preserved-oral-escalation.v2","program":"topic-program","replaces":["case.gs028b.preoperative-nutrition.b-functional-gut-pn-request","case.gs028b.preoperative-nutrition.b-obstruction","case.gs028b.preoperative-nutrition.paired-poor-intake-loss"],"with":"question.topic.nutrition-support-metabolism.oral-escalation.v1","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.nutrition-support-metabolism.r2-preserved-renal-protein-reference.v2","program":"topic-program","replaces":["case.gs028c.dialysis-nutrition.a-former-low-protein","case.gs028c.dialysis-nutrition.a-minimum-target","case.gs028c.dialysis-nutrition.a-planned-admission","case.gs028c.dialysis-nutrition.a-sixty-kilogram"],"with":"question.topic.nutrition-support-metabolism.renal-protein-reference.v1","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.vascular-limb-mesenteric-arterial.acute-mesenteric-course.v1","program":"topic-program","replaces":["case.gs028c.acute-mesenteric-ischemia.a-atrial-fibrillation","case.gs028c.acute-mesenteric-ischemia.a-acute-on-chronic-pattern","case.gs028c.acute-mesenteric-ischemia.a-possible-arterial-thrombosis","case.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta","case.gs028c.acute-mesenteric-ischemia.b-late-peritoneal-findings","case.gs028c.acute-mesenteric-ischemia.b-rigid-abdomen"],"with":"question.vascular-limb-mesenteric-arterial.ami-cta-normal-lactate.v1","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.vascular-limb-mesenteric-arterial.pass-initial-abi.v2","program":"topic-program","replaces":["case.peripheral-arterial-disease.mail-route","case.peripheral-arterial-disease.grocery-trip","case.peripheral-arterial-disease.park-walking"],"with":"question.vascular-limb-mesenteric-arterial.initial-abi.v1","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.vascular-limb-mesenteric-arterial.r2-cmi-after-duplex.v2","program":"topic-program","replaces":["case.chronic-mesenteric-ischemia.food-fear","case.chronic-mesenteric-ischemia.meal-pain","case.chronic-mesenteric-ischemia.restaurant-pain","case.chronic-mesenteric-ischemia.small-meals"],"with":"question.vascular-limb-mesenteric-arterial.cmi-after-duplex.v2","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.stomach-ulcer-bleeding-motility.cure-collection-calendar.v1","program":"topic-program","replaces":["case.h-pylori-ulcer.duodenal-ulcer","case.h-pylori-ulcer.epigastric-pain","case.h-pylori-ulcer.healed-ulcer","case.h-pylori-ulcer.night-pain"],"with":"question.topic.stomach-ulcer-bleeding-motility.cure-calendar.v1","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.adrenal-men-endocrine.cushing-classification.v1","program":"topic-program","replaces":["case.cushing-classification.bone-health-referral","case.cushing-classification.diabetes-review","case.cushing-classification.hypertension-review","case.cushing-classification.progressive-features"],"with":"question.topic.adrenal-men-endocrine.classify-before-localizing.v1","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.breast-cancer.diffuse-skin-clinic-review-pass-split.v2","program":"topic-program","replaces":["case.inflammatory-breast-cancer.diffuse-swelling","case.inflammatory-breast-cancer.peau-dorange","case.inflammatory-breast-cancer.rapid-redness"],"with":"question.topic.breast-cancer.inflammatory-initial-sequence.v1","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.breast-cancer.dcis-final-boundary.v1","program":"topic-program","replaces":["case.gs028c.dcis.a-two-mm-wbrt","case.gs028b.post-neoadjuvant-breast.paired-marker-residual"],"with":"question.topic.breast-cancer.dcis-positive-shave.v1","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.gallbladder-duct-stones.duct-assessment-duct-before-ercp-pass.v2","program":"topic-program","replaces":["case.choledocholithiasis.abnormal-labs","case.choledocholithiasis.dilated-duct","case.choledocholithiasis.episodic-pain","case.choledocholithiasis.resolved-colic"],"with":"question.topic.gallbladder-duct-stones.duct-before-ercp.v1","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.gallbladder-duct-stones.gallbladder-functional-study-acute-filling-protocol-pass.v2","program":"topic-program","replaces":["case.gs028c.acute-cholecystitis.a-equivocal-wall-thickening","case.gs028c.acute-cholecystitis.a-limited-ultrasound"],"with":"question.topic.gallbladder-duct-stones.acute-filling-protocol.v1","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.gallbladder-duct-stones.high-risk-operation.v1","program":"topic-program","replaces":["case.gs028c.acute-cholecystitis.b-confirmed-on-ultrasound","case.gs028c.acute-cholecystitis.b-older-but-fit","case.gs028c.acute-cholecystitis.b-premature-ed-discharge"],"with":"question.topic.gallbladder-duct-stones.high-risk-not-unfit.v1","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.gallbladder-duct-stones.fused-neck.v1","program":"topic-program","replaces":["case.gs028g.subtotal-cholecystectomy.c1-bailout-option","case.gs028g.subtotal-cholecystectomy.c1-not-completeness","case.gs028g.subtotal-cholecystectomy.paired-frozen-anatomy","case.gs028g.subtotal-cholecystectomy.paired-unsafe-triangle"],"with":"question.topic.gallbladder-duct-stones.conversion-does-not-identify-ducts.v1","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.gallbladder-duct-stones.remnant-symptoms-remnant-anatomy-workup-pass.v2","program":"topic-program","replaces":["case.gs028g.subtotal-cholecystectomy.c2-duct-closed-remnant-open","case.gs028g.subtotal-cholecystectomy.c2-posterior-wall-retained"],"with":"question.topic.gallbladder-duct-stones.remnant-anatomy-workup.v1","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.hernia-groin.changing-function.v1","program":"topic-program","replaces":["case.bread-butter.inguinal-hernia.hernia-options","case.bread-butter.inguinal-hernia.mild-groin-awareness","case.bread-butter.inguinal-hernia.painless-bulge","case.bread-butter.inguinal-hernia.small-groin-bulge"],"with":"question.topic.hernia-groin.selected-observation.v1","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.hernia-groin.r2.marked-femoral-repair.v2","program":"topic-program","replaces":["case.bread-butter.femoral-hernia.femoral-bulge","case.bread-butter.femoral-hernia.femoral-options","case.bread-butter.femoral-hernia.painless-femoral-hernia","case.bread-butter.femoral-hernia.reducible-femoral-hernia"],"with":"question.topic.hernia-groin.marked-femoral-repair.v2","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.hernia-groin.r2.new-component-ultrasound.v2","program":"topic-program","replaces":["case.gs028b.postherniorrhaphy-pain.a-new-bulge","case.gs028b.postherniorrhaphy-pain.paired-activity-ache","case.gs028b.postherniorrhaphy-pain.paired-burning-groin"],"with":"question.topic.hernia-groin.new-component-ultrasound.v2","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.hernia-groin.r2.anterior-recurrence-plane.v2","program":"topic-program","replaces":["case.bread-butter.hernia-anatomy.hernia-anatomy","case.bread-butter.hernia-anatomy.operative-report","case.bread-butter.hernia-anatomy.postoperative-review","case.bread-butter.hernia-anatomy.repair-follow-up"],"with":"question.topic.hernia-groin.anterior-recurrence-plane.v2","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
    {"id":"topic-program.batch3.case.topic.appendix-appendicitis.salvage-persistent-pain-exploration.v1","program":"topic-program","replaces":["case.gs028c.appendicitis.a-atypical-older-adult","case.gs028c.appendicitis.a-competing-diagnoses","case.gs028c.appendicitis.a-equivocal-exam","case.gs028c.appendicitis.a-nondiagnostic-ultrasound"],"with":"question.topic.appendix-appendicitis.persistent-pain-exploration.v1","decision":"docs/research/question-topic-acceptance-batch3-20261111.md"},
  {
    "id": "topic-program.trauma-thoracic.20261111",
    "program": "topic-program",
    "replaces": [
      "case.gs028d.blunt-cardiac-injury.a-bicycle-handlebar-impact",
      "case.gs028d.blunt-cardiac-injury.a-fall-anterior-chest",
      "case.gs028d.blunt-cardiac-injury.a-sports-chest-impact",
      "case.gs028d.blunt-cardiac-injury.a-steering-wheel-impact",
      "case.gs028d.blunt-cardiac-injury.b-both-results-abnormal",
      "case.gs028d.blunt-cardiac-injury.b-isolated-troponin-elevation",
      "case.gs028d.blunt-cardiac-injury.b-new-ecg-change"
    ],
    "with": "question.trauma-thoracic.bci-selective-imaging.20261111.v2",
    "decision": "docs/research/question-topic-acceptance-batch2-20261111.md"
  }
] satisfies QuestionShipTopicConsolidation[],
  headerSources: {
    "case.topic.statistics.r3.alpha-definition.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.sample-size-beta.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.effect-size-power.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.alpha-power.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.variance-power.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.kruskal-wallis.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.pearson-correlation.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.spearman-correlation.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.linear-regression.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.log-rank.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.prevalence-npv.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.prevalence-measures.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.roc-horizontal-axis.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.auc-discrimination.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.relative-risk-reduction-r3.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.systematic-review.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.meta-analysis.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.treatment-evidence-hierarchy.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.observer-bias.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.attrition-bias.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.publication-bias.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.randomization-purpose.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.assessor-blinding.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.per-protocol.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.noninferiority.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.phase-0.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.phase-1.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.phase-2.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.phase-3.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.phase-4.v1": "topic-batch7-statistics",
    "case.topic.statistics.r3.welch-test.v1": "topic-batch7-statistics",
    "case.topic.ethics-professionalism.r3.capacity.v3": "topic-batch7-ethics-professionalism",
    "case.topic.ethics-professionalism.r3.surrogate.v3": "topic-batch7-ethics-professionalism",
    "case.topic.ethics-professionalism.r3.adult-blood.v3": "topic-batch7-ethics-professionalism",
    "case.topic.ethics-professionalism.r3.child-assent.v3": "topic-batch7-ethics-professionalism",
    "case.topic.ethics-professionalism.r3.child-blood.v3": "topic-batch7-ethics-professionalism",
    "case.topic.ethics-professionalism.r3.consent.v3": "topic-batch7-ethics-professionalism",
    "case.topic.ethics-professionalism.r3.disclosure.v3": "topic-batch7-ethics-professionalism",
    "case.topic.ethics-professionalism.r3.colleague.v3": "topic-batch7-ethics-professionalism",
    "case.topic.ethics-professionalism.r3.financial.v3": "topic-batch7-ethics-professionalism",
    "case.topic.ethics-professionalism.r3.futility.v3": "topic-batch7-ethics-professionalism",
    "case.topic.ethics-professionalism.r3.withdrawal.v3": "topic-batch7-ethics-professionalism",
    "case.topic.ethics-professionalism.r3.donation.v3": "topic-batch7-ethics-professionalism",
    "case.topic.ostomy-enterocutaneous-fistula.r3-interrupted-output.v1": "topic-batch7-ostomy-enterocutaneous-fistula",
    "case.topic.ostomy-enterocutaneous-fistula.r3-ecf-rehabilitation.v1": "topic-batch7-ostomy-enterocutaneous-fistula",
    "case.topic.ostomy-enterocutaneous-fistula.r3-anastomotic-fistula.v1": "topic-batch7-ostomy-enterocutaneous-fistula",
    "case.topic.ostomy-enterocutaneous-fistula.r3-balance-support.v1": "topic-batch7-ostomy-enterocutaneous-fistula",
    "case.topic.ostomy-enterocutaneous-fistula.r3-temporary-hernia.v1": "topic-batch7-ostomy-enterocutaneous-fistula",
    "case.topic.ostomy-enterocutaneous-fistula.r3-ischemic-conduit.v1": "topic-batch7-ostomy-enterocutaneous-fistula",
    "case.topic.ostomy-enterocutaneous-fistula.r3-medication-cardiac-review.v1": "topic-batch7-ostomy-enterocutaneous-fistula",
    "case.topic.quality-safety-systems.round3.capacity.v1": "topic-batch7-quality-safety-systems",
    "case.topic.quality-safety-systems.round3.emergency.v1": "topic-batch7-quality-safety-systems",
    "case.topic.quality-safety-systems.round3.blood-adult.v1": "topic-batch7-quality-safety-systems",
    "case.topic.quality-safety-systems.round3.directive-trial.v1": "topic-batch7-quality-safety-systems",
    "case.topic.quality-safety-systems.round3.consent-choice.v1": "topic-batch7-quality-safety-systems",
    "case.topic.quality-safety-systems.round3.confidentiality.v1": "topic-batch7-quality-safety-systems",
    "case.topic.quality-safety-systems.round3.financial.v1": "topic-batch7-quality-safety-systems",
    "case.topic.quality-safety-systems.round3.impairment.v1": "topic-batch7-quality-safety-systems",
    "case.topic.quality-safety-systems.round3.ineffective.v1": "topic-batch7-quality-safety-systems",
    "case.topic.quality-safety-systems.round3.donation.v1": "topic-batch7-quality-safety-systems",
    "case.topic.quality-safety-systems.round3.stoma-depth.v1": "topic-batch7-quality-safety-systems",
    "case.topic.quality-safety-systems.round3.output.v1": "topic-batch7-quality-safety-systems",
    "case.topic.quality-safety-systems.round3.ecf-nutrition.v1": "topic-batch7-quality-safety-systems",
    "case.topic.quality-safety-systems.round3.ecf-readiness.v1": "topic-batch7-quality-safety-systems",
    "case.topic.quality-safety-systems.round3.parastomal.v1": "topic-batch7-quality-safety-systems",
    "case.topic.quality-safety-systems.round3.prospective-label.v1": "topic-batch7-quality-safety-systems",
    "case.topic.quality-safety-systems.round3.phase-pause.v1": "topic-batch7-quality-safety-systems",
    "case.topic.quality-safety-systems.round3.just-culture.v1": "topic-batch7-quality-safety-systems",
    "case.topic.quality-safety-systems.round3.ssi-prophylaxis.v1": "topic-batch7-quality-safety-systems",
    "case.topic.quality-safety-systems.round3.nsqip.v1": "topic-batch7-quality-safety-systems",
    "case.topic.quality-safety-systems.round3.control-chart.v1": "topic-batch7-quality-safety-systems",
    "case.soft-tissue-mass.deep-thigh": "topic-batch7-d97aa716",
    "case.soft-tissue-mass.upper-arm": "topic-batch7-d97aa716",
    "case.pediatric-neck-thoracic-gu.20261111.node-sample-salvage.v1": "topic-batch6-pediatric-neck-thoracic-gu",
    "case.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy-salvage.v1": "topic-batch6-pediatric-neck-thoracic-gu",
    "case.pediatric-neck-thoracic-gu.20261111.dsd-assessment-salvage.v1": "topic-batch6-pediatric-neck-thoracic-gu",
    "case.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness-salvage.v1": "topic-batch6-pediatric-neck-thoracic-gu",
    "case.vascular-venous-lymphatic-access.postop-leg-coverage.20261111.v2": "topic-batch5-vascular-venous-lymphatic-access",
    "case.vascular-venous-lymphatic-access.postop-finite-course-r2.20261111.v2": "topic-batch5-vascular-venous-lymphatic-access",
    "case.vascular-venous-lymphatic-access.postop-negative-summary.20261111.v2": "topic-batch5-vascular-venous-lymphatic-access",
    "case.vascular-venous-lymphatic-access.lymphatic-acute-change-r2.20261111.v2": "topic-batch5-vascular-venous-lymphatic-access",
    "case.vascular-venous-lymphatic-access.whole-leg-venous-change.20261111.v2": "topic-batch5-vascular-venous-lymphatic-access",
    "case.vascular-venous-lymphatic-access.access-unresolved-maturation-r2.20261111.v2": "topic-batch5-vascular-venous-lymphatic-access",
    "case.vascular-venous-lymphatic-access.ulcer-noncompressible.20261111.v1": "topic-batch5-vascular-venous-lymphatic-access",
    "case.vascular-venous-lymphatic-access.mixed-ulcer-physiology.20261111.v1": "topic-batch5-vascular-venous-lymphatic-access",
    "case.vascular-venous-lymphatic-access.dvt-serial-negative-proximal-r2.20261111.v2": "topic-batch5-vascular-venous-lymphatic-access",
    "case.vascular-venous-lymphatic-access.access-hand-physiology-r2.20261111.v2": "topic-batch5-vascular-venous-lymphatic-access",
    "case.vascular-venous-lymphatic-access.postaccess-neurologic-record.20261111.v1": "topic-batch5-vascular-venous-lymphatic-access",
    "case.vascular-venous-lymphatic-access.dialysis-catheter-course.20261111.v2": "topic-batch5-vascular-venous-lymphatic-access",
    "case.topic.esophagus-motility-achalasia.recurrent-clearance-standalone.v2": "topic-batch5-esophagus-motility-achalasia",
    "case.topic.bariatric-metabolic.spontaneous-sample-salvage.v1": "topic-batch5-bariatric-metabolic",
    "case.topic.bariatric-metabolic.acarbose-intolerance-salvage.v1": "topic-batch5-bariatric-metabolic",
    "case.topic.bariatric-metabolic.reflux-monitoring-salvage.v1": "topic-batch5-bariatric-metabolic",
    "case.pediatric-gi-abdominal-wall.intussusception-partial-progress-salvage.v2": "topic-batch5-pediatric-gi-abdominal-wall",
    "case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1": "topic-batch5-pediatric-gi-abdominal-wall",
    "case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1": "topic-batch5-pediatric-gi-abdominal-wall",
    "case.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-salvage.v1": "topic-batch5-pediatric-gi-abdominal-wall",
    "case.pediatric-gi-abdominal-wall.preterm-hernia-timing-salvage.v1": "topic-batch5-pediatric-gi-abdominal-wall",
    "case.topic.hernia-ventral-abdominal-wall.epigastric-pain-attribution.v1": "topic-batch4-hernia-ventral-abdominal-wall",
    "case.topic.hernia-ventral-abdominal-wall.mesh-failed-salvage-standalone.v1": "topic-batch4-hernia-ventral-abdominal-wall",
    "case.topic.hernia-ventral-abdominal-wall.primary-observation-round2.v2": "topic-batch4-hernia-ventral-abdominal-wall",
    "case.topic.hernia-ventral-abdominal-wall.controlled-emergency-material-round2.v2": "topic-batch4-hernia-ventral-abdominal-wall",
    "case.topic.hernia-ventral-abdominal-wall.asymptomatic-seroma-observation-round2.v2": "topic-batch4-hernia-ventral-abdominal-wall",
    "case.topic.thyroid-nodules-cancer.multiple-nodules.v1": "topic-batch4-thyroid-nodules-cancer",
    "case.topic.thyroid-nodules-cancer.graves-followup.v1": "topic-batch4-thyroid-nodules-cancer",
    "case.topic.thyroid-nodules-cancer.functional-map.v1": "topic-batch4-thyroid-nodules-cancer",
    "case.topic.thyroid-nodules-cancer.destructive-thyrotoxicosis.v1": "topic-batch4-thyroid-nodules-cancer",
    "case.topic.thyroid-nodules-cancer.small-bilateral-cancer.v1": "topic-batch4-thyroid-nodules-cancer",
    "case.topic.thyroid-nodules-cancer.rapid-mass.v1": "topic-batch4-thyroid-nodules-cancer",
    "case.topic.thyroid-nodules-cancer.review2.r01.v1": "topic-batch4-thyroid-nodules-cancer",
    "case.topic.thyroid-nodules-cancer.review2.r06.v1": "topic-batch4-thyroid-nodules-cancer",
    "case.topic.thyroid-nodules-cancer.review2.n03.v1": "topic-batch4-thyroid-nodules-cancer",
    "case.topic.thyroid-nodules-cancer.review2.n04.v1": "topic-batch4-thyroid-nodules-cancer",
    "case.topic.thyroid-nodules-cancer.review2.n05.v1": "topic-batch4-thyroid-nodules-cancer",
    "case.topic.thyroid-nodules-cancer.review2.n12.v1": "topic-batch4-thyroid-nodules-cancer",
    "case.topic.thyroid-nodules-cancer.review2.n14.v1": "topic-batch4-thyroid-nodules-cancer",
    "case.topic.thyroid-nodules-cancer.review2.n16.v1": "topic-batch4-thyroid-nodules-cancer",
    "case.topic.thyroid-nodules-cancer.review2.n18.v1": "topic-batch4-thyroid-nodules-cancer",
    "case.topic.colorectal-polyps-cancer.favorable-stalk-pathology.v1": "topic-batch4-colorectal-polyps-cancer",
    "case.topic.colorectal-polyps-cancer.vascular-channel-polyp.v1": "topic-batch4-colorectal-polyps-cancer",
    "case.topic.colorectal-polyps-cancer.transected-invasive-front.v1": "topic-batch4-colorectal-polyps-cancer",
    "case.topic.colorectal-polyps-cancer.fap-rectal-field.v1": "topic-batch4-colorectal-polyps-cancer",
    "case.topic.colorectal-polyps-cancer.fap-rectal-sparing.v1": "topic-batch4-colorectal-polyps-cancer",
    "case.topic.colorectal-polyps-cancer.fap-poor-sphincter.v1": "topic-batch4-colorectal-polyps-cancer",
    "case.topic.colorectal-polyps-cancer.rectal-initial-staging.v1": "topic-batch4-colorectal-polyps-cancer",
    "case.topic.colorectal-polyps-cancer.persistent-rectal-wall-focus.v1": "owner-decisions-batch8",
    "case.topic.colorectal-polyps-cancer.adenoma-fragment-count.v1": "topic-batch4-colorectal-polyps-cancer",
    "case.topic.colorectal-polyps-cancer.positive-fit-negative-repeat-r2.v2": "topic-batch4-colorectal-polyps-cancer",
    "case.topic.colorectal-polyps-cancer.advanced-adenoma-surveillance-r2.v2": "topic-batch4-colorectal-polyps-cancer",
    "case.topic.colorectal-polyps-cancer.piecemeal-scar-surveillance-r2.v2": "topic-batch4-colorectal-polyps-cancer",
    "case.topic.colorectal-polyps-cancer.intact-low-risk-specimen-r2.v2": "topic-batch4-colorectal-polyps-cancer",
    "case.topic.colorectal-polyps-cancer.nonlifting-after-tattoo-r2.v2": "topic-batch4-colorectal-polyps-cancer",
    "case.topic.colorectal-polyps-cancer.adherent-bladder-en-bloc-r2.v2": "topic-batch4-colorectal-polyps-cancer",
    "case.topic.colorectal-polyps-cancer.asymptomatic-incurable-primary-r2.v2": "topic-batch4-colorectal-polyps-cancer",
    "case.topic.colorectal-polyps-cancer.perforation-overrides-systemic-first-r2.v2": "topic-batch4-colorectal-polyps-cancer",
    "case.topic.colorectal-polyps-cancer.advanced-baseline-normal-surveillance-r2.v2": "topic-batch4-colorectal-polyps-cancer",
    "case.topic.perioperative-risk-recovery.beta-exposure.v2": "topic-batch4-perioperative-risk-recovery",
    "case.topic.perioperative-risk-recovery.cancer-prophylaxis-extended-cancer-course.v2": "topic-batch4-perioperative-risk-recovery",
    "case.topic.perioperative-risk-recovery.sglt2-hospital-course-sglt2-acid-ketone-pattern.v2": "topic-batch4-perioperative-risk-recovery",
    "case.topic.perioperative-risk-recovery.delirium-medication-course-delirium-anticholinergic-order.v2": "topic-batch4-perioperative-risk-recovery",
    "case.topic.perioperative-risk-recovery.breast-site-recovery-postoperative-targeted-ultrasound.v2": "topic-batch4-perioperative-risk-recovery",
    "case.topic.perioperative-risk-recovery.breast-site-recovery-postoperative-seroma-observe.v2": "topic-batch4-perioperative-risk-recovery",
    "case.topic.perioperative-risk-recovery.contrast-events.v2": "topic-batch4-perioperative-risk-recovery",
    "case.topic.perioperative-risk-recovery.contrast-local-course.v1": "topic-batch4-perioperative-risk-recovery",
    "case.topic.perioperative-risk-recovery.allergy-severe-history.v1": "topic-batch4-perioperative-risk-recovery",
    "case.topic.perioperative-risk-recovery.valve-risk.v1": "topic-batch4-perioperative-risk-recovery",
    "case.topic.perioperative-risk-recovery.recent-coronary-stent.v2": "topic-batch4-perioperative-risk-recovery",
    "case.topic.anorectal-benign-pelvic-floor.supralevator-external.v1": "topic-batch4-anorectal-benign-pelvic-floor",
    "case.topic.anorectal-benign-pelvic-floor.simple-fistula.v1": "topic-batch4-anorectal-benign-pelvic-floor",
    "case.topic.anorectal-benign-pelvic-floor.internal-hemorrhoid-banding-pass-standalone.v1": "topic-batch4-anorectal-benign-pelvic-floor",
    "case.topic.anorectal-benign-pelvic-floor.combined-hemorrhoid-excision-pass-standalone.v1": "topic-batch4-anorectal-benign-pelvic-floor",
    "case.topic.anorectal-benign-pelvic-floor.long-prolapse-perineal-operation-pass-standalone.v1": "topic-batch4-anorectal-benign-pelvic-floor",
    "case.topic.anorectal-benign-pelvic-floor.outlet-biofeedback-pass-standalone.v1": "topic-batch4-anorectal-benign-pelvic-floor",
    "case.topic.anorectal-benign-pelvic-floor.supralevator-internal-standalone.v2": "topic-batch4-anorectal-benign-pelvic-floor",
    "case.topic.anorectal-benign-pelvic-floor.horseshoe-source-control-standalone.v2": "topic-batch4-anorectal-benign-pelvic-floor",
    "case.topic.anorectal-benign-pelvic-floor.recurrent-fistula-mri-standalone.v2": "topic-batch4-anorectal-benign-pelvic-floor",
    "case.topic.anorectal-benign-pelvic-floor.lis-after-treatment-standalone.v2": "topic-batch4-anorectal-benign-pelvic-floor",
    "case.topic.anorectal-benign-pelvic-floor.snm-after-failed-repair-standalone.v2": "topic-batch4-anorectal-benign-pelvic-floor",
    "case.topic.anorectal-benign-pelvic-floor.stool-directed-continence-care-standalone.v2": "topic-batch4-anorectal-benign-pelvic-floor",
    "case.topic.anorectal-benign-pelvic-floor.rectocele-repair-after-coordination-standalone.v2": "topic-batch4-anorectal-benign-pelvic-floor",
    "case.topic.breast-benign-high-risk.solid-mass.pass-preserved.v1": "topic-batch4-breast-benign-high-risk",
    "case.topic.breast-benign-high-risk.palpable-site.pass-preserved.v1": "topic-batch4-breast-benign-high-risk",
    "case.topic.breast-benign-high-risk.adh-residual.round2.v2": "topic-batch4-breast-benign-high-risk",
    "case.topic.breast-benign-high-risk.premenopausal-prevention.round2.v2": "topic-batch4-breast-benign-high-risk",
    "case.topic.breast-benign-high-risk.lobular-correlation.pass-preserved.v1": "topic-batch4-breast-benign-high-risk",
    "case.topic.breast-benign-high-risk.lobular-discordance.round2.v2": "topic-batch4-breast-benign-high-risk",
    "case.topic.breast-benign-high-risk.fea.v1": "topic-batch4-breast-benign-high-risk",
    "case.topic.breast-benign-high-risk.cavity-solid-core.round2.v2": "topic-batch4-breast-benign-high-risk",
    "case.topic.breast-benign-high-risk.lactation-ultrasound.round2.v2": "topic-batch4-breast-benign-high-risk",
    "case.topic.breast-benign-high-risk.milk-contact.round2.v2": "topic-batch4-breast-benign-high-risk",
    "case.topic.burns-inhalation.limited-scald.v1": "topic-batch4-burns-inhalation",
    "case.topic.burns-inhalation.changing-hand.v1": "topic-batch4-burns-inhalation",
    "case.topic.burns-inhalation.fluid-record.v1": "topic-batch4-burns-inhalation",
    "case.topic.burns-inhalation.constrictive-thermal-burn-pass-standalone.v1": "topic-batch4-burns-inhalation",
    "case.topic.burns-inhalation.electrical-record-pass-standalone.v1": "topic-batch4-burns-inhalation",
    "case.topic.burns-inhalation.mixed-smoke-toxicity.v1": "topic-batch4-burns-inhalation",
    "case.topic.burns-inhalation.coverage-record-pass-standalone.v1": "topic-batch4-burns-inhalation",
    "case.topic.burns-inhalation.nutrition-record-pass-standalone.v1": "topic-batch4-burns-inhalation",
    "case.topic.burns-inhalation.healing-culture.v1": "topic-batch4-burns-inhalation",
    "case.topic.burns-inhalation.thermal-limb-release-revision.v2": "topic-batch4-burns-inhalation",
    "case.topic.burns-inhalation.electrical-pigment-resuscitation-revision.v2": "topic-batch4-burns-inhalation",
    "case.topic.burns-inhalation.lower-airway-assessment-revision.v2": "topic-batch4-burns-inhalation",
    "case.topic.burns-inhalation.temporary-burn-coverage-revision.v2": "topic-batch4-burns-inhalation",
    "case.topic.burns-inhalation.feeding-new-hypoperfusion-revision.v2": "topic-batch4-burns-inhalation",
    "case.topic.anal-cancer.margin-favorable.v1": "topic-batch4-anal-cancer",
    "case.topic.anal-cancer.groin-recurrence.v1": "topic-batch4-anal-cancer",
    "case.topic.anal-cancer.distant-recurrence.v1": "topic-batch4-anal-cancer",
    "case.topic.anal-cancer.sample-depth.v2": "topic-batch4-anal-cancer",
    "case.topic.anal-cancer.salvage-standalone.v2": "topic-batch4-anal-cancer",
    "case.topic.anal-cancer.regional-node-treatment.standalone.v1": "topic-batch4-anal-cancer",
    "case.topic.bariatric-metabolic.persistent-pain-after-rygb.v1": "topic-batch4-bariatric-metabolic",
    "case.topic.bariatric-metabolic.late-sleeve-leak-review.pass-preserved.v1": "topic-batch4-bariatric-metabolic",
    "case.topic-soft-tissue-sarcoma-desmoid.calf-planning.20261111.v1": "topic-batch4-soft-tissue-sarcoma-desmoid",
    "case.topic-soft-tissue-sarcoma-desmoid.forearm-sample-match.20261111.v1": "topic-batch4-soft-tissue-sarcoma-desmoid",
    "case.topic-soft-tissue-sarcoma-desmoid.planned-margin.20261111.v1": "topic-batch4-soft-tissue-sarcoma-desmoid",
    "case.topic-soft-tissue-sarcoma-desmoid.unplanned-excision.20261111.v1": "topic-batch4-soft-tissue-sarcoma-desmoid",
    "case.topic-soft-tissue-sarcoma-desmoid.rps-biopsy.20261111.v2": "topic-batch4-soft-tissue-sarcoma-desmoid",
    "case.topic-soft-tissue-sarcoma-desmoid.rps-histotype-resection.20261111.v2": "topic-batch4-soft-tissue-sarcoma-desmoid",
    "case.topic-soft-tissue-sarcoma-desmoid.desmoid-function-course.20261111.v2": "topic-batch4-soft-tissue-sarcoma-desmoid",
    "case.topic-soft-tissue-sarcoma-desmoid.desmoid-margin-followup.20261111.v1": "topic-batch4-soft-tissue-sarcoma-desmoid",
    "case.topic-soft-tissue-sarcoma-desmoid.desmoid-hereditary-evaluation.20261111.v2": "topic-batch4-soft-tissue-sarcoma-desmoid",
    "case.topic-soft-tissue-sarcoma-desmoid.desmoid-mesenteric-escalation.20261111.v2": "topic-batch4-soft-tissue-sarcoma-desmoid",
    "case.topic-soft-tissue-sarcoma-desmoid.alt-function-preserving-resection.20261111.v2": "topic-batch4-soft-tissue-sarcoma-desmoid",
    "case.topic.liver-benign-portal-infection.adenoma-man.v1": "topic-batch4-liver-benign-portal-infection",
    "case.topic.liver-benign-portal-infection.adenoma-molecular.v1": "topic-batch4-liver-benign-portal-infection",
    "case.topic.liver-benign-portal-infection.hemangioma.v1": "topic-batch4-liver-benign-portal-infection",
    "case.topic.liver-benign-portal-infection.cirrhosis-analgesic.v2": "topic-batch4-liver-benign-portal-infection",
    "case.topic.liver-benign-portal-infection.cardiac-fluid.v1": "topic-batch4-liver-benign-portal-infection",
    "case.topic.liver-benign-portal-infection.diuretic-fluid.v1": "topic-batch4-liver-benign-portal-infection",
    "case.topic.liver-benign-portal-infection.acute-variceal-treatment.v2": "topic-batch4-liver-benign-portal-infection",
    "case.topic.liver-benign-portal-infection.bleeding-record.v1": "topic-batch4-liver-benign-portal-infection",
    "case.topic.liver-benign-portal-infection.rebleeding.v1": "topic-batch4-liver-benign-portal-infection",
    "case.topic.liver-benign-portal-infection.pyogenic.v1": "topic-batch4-liver-benign-portal-infection",
    "case.topic.liver-benign-portal-infection.hydatid.v1": "topic-batch4-liver-benign-portal-infection",
    "case.topic.thoracic-lung-pleura-mediastinum.psp-size-symptoms.v2": "topic-batch4-thoracic-lung-pleura-mediastinum",
    "case.topic.thoracic-lung-pleura-mediastinum.passed-pleural-drainage.v2": "topic-batch4-thoracic-lung-pleura-mediastinum",
    "case.topic.thoracic-lung-pleura-mediastinum.passed-malignant-fluid.v2": "topic-batch4-thoracic-lung-pleura-mediastinum",
    "case.topic.thoracic-lung-pleura-mediastinum.mpe-lung-expansion.v2": "topic-batch4-thoracic-lung-pleura-mediastinum",
    "case.topic.thoracic-lung-pleura-mediastinum.mediastinal-tissue-staging.v2": "topic-batch4-thoracic-lung-pleura-mediastinum",
    "case.topic.thoracic-lung-pleura-mediastinum.passed-pleural-dissemination.v2": "topic-batch4-thoracic-lung-pleura-mediastinum",
    "case.topic.thoracic-lung-pleura-mediastinum.growing-nodule-pet.v2": "topic-batch4-thoracic-lung-pleura-mediastinum",
    "case.topic.thoracic-lung-pleura-mediastinum.thymic-resection-plan.v2": "topic-batch4-thoracic-lung-pleura-mediastinum",
    "case.topic.thoracic-lung-pleura-mediastinum.mediastinal-biopsy.v1": "topic-batch4-thoracic-lung-pleura-mediastinum",
    "case.topic.transplant-immunosuppression.kidney-dysfunction.v1": "topic-batch4-transplant-immunosuppression",
    "case.topic.transplant-immunosuppression.cellular-rescue-followup.v1": "topic-batch4-transplant-immunosuppression",
    "case.topic.transplant-immunosuppression.bk-course.v1": "topic-batch4-transplant-immunosuppression",
    "case.topic.transplant-immunosuppression.ptld-course.v1": "topic-batch4-transplant-immunosuppression",
    "case.topic.transplant-immunosuppression.cmv-gut-course.v1": "topic-batch4-transplant-immunosuppression",
    "case.topic.transplant-immunosuppression.pregnancy-medicine-course.v1": "topic-batch4-transplant-immunosuppression",
    "case.topic.transplant-immunosuppression.delayed-function.v1": "topic-batch4-transplant-immunosuppression",
    "case.topic.transplant-immunosuppression.cellular-steroids-correction.v2": "topic-batch4-transplant-immunosuppression",
    "case.topic.transplant-immunosuppression.bk-function-discordance-correction.v2": "topic-batch4-transplant-immunosuppression",
    "case.topic.transplant-immunosuppression.tac-high-exposure-correction.v2": "topic-batch4-transplant-immunosuppression",
    "case.topic.transplant-immunosuppression.tac-sample-validity-correction.v2": "topic-batch4-transplant-immunosuppression",
    "case.topic.transplant-immunosuppression.cmv-severe-route-correction.v2": "topic-batch4-transplant-immunosuppression",
    "case.topic.transplant-immunosuppression.cmv-leukopenia-correction.v2": "topic-batch4-transplant-immunosuppression",
    "case.topic.transplant-immunosuppression.active-amr-backbone-correction.v2": "topic-batch4-transplant-immunosuppression",
    "case.topic.transplant-immunosuppression.dgf-biopsy-correction.v2": "topic-batch4-transplant-immunosuppression",
    "case.topic.oncology-genetics-principles.apc-child-testing.standalone.v2": "topic-batch4-oncology-genetics-principles",
    "case.topic.oncology-genetics-principles.true-negative-plus-vus.standalone.v2": "topic-batch4-oncology-genetics-principles",
    "case.topic.oncology-genetics-principles.other-family-branch.standalone.v2": "topic-batch4-oncology-genetics-principles",
    "case.topic.oncology-genetics-principles.bevacizumab-open-wound.standalone.v2": "topic-batch4-oncology-genetics-principles",
    "case.topic.oncology-genetics-principles.checkpoint-colitis.standalone.v2": "topic-batch4-oncology-genetics-principles",
    "case.topic.oncology-genetics-principles.refractory-colitis-infection.standalone.v2": "topic-batch4-oncology-genetics-principles",
    "case.topic.oncology-genetics-principles.rasburicase-reexposure.standalone.v2": "topic-batch4-oncology-genetics-principles",
    "case.topic.stomach-neoplasia.diffuse-gastric-cancer.v1": "topic-batch4-stomach-neoplasia",
    "case.topic.stomach-neoplasia.endoscopic-resection.v1": "topic-batch4-stomach-neoplasia",
    "case.topic.stomach-neoplasia.postgastrectomy-records.v1": "topic-batch4-stomach-neoplasia",
    "case.topic.stomach-neoplasia.fundic-gist-resection.v1": "topic-batch4-stomach-neoplasia",
    "case.topic.stomach-neoplasia.resected-molecular-records.v1": "topic-batch4-stomach-neoplasia",
    "case.topic.stomach-neoplasia.cardia-gist-treatment-review.v2": "topic-batch4-stomach-neoplasia",
    "case.topic.stomach-neoplasia.gist-response-record-review.v2": "topic-batch4-stomach-neoplasia",
    "case.topic.stomach-neoplasia.metastatic-gist-maintenance-review.v2": "topic-batch4-stomach-neoplasia",
    "case.topic.esophagus-structural-inflammatory-emergencies.foreign-body-chart-bone-film-complication-imaging-pass.v2": "topic-batch4-esophagus-structural-inflammatory-emergencies",
    "case.topic.esophagus-structural-inflammatory-emergencies.contained-perforation-surveillance-revision.v2": "topic-batch4-esophagus-structural-inflammatory-emergencies",
    "case.topic.esophagus-structural-inflammatory-emergencies.perforation-chart-free-perforation-repair-pass.v2": "topic-batch4-esophagus-structural-inflammatory-emergencies",
    "case.topic.esophagus-structural-inflammatory-emergencies.caustic-chart-caustic-loss-enhancement-pass.v2": "topic-batch4-esophagus-structural-inflammatory-emergencies",
    "case.topic.esophagus-structural-inflammatory-emergencies.caustic-complex-stricture-revision.v2": "topic-batch4-esophagus-structural-inflammatory-emergencies",
    "case.topic.esophagus-structural-inflammatory-emergencies.zenker-treatment.v1": "topic-batch4-esophagus-structural-inflammatory-emergencies",
    "case.topic.esophagus-structural-inflammatory-emergencies.cancer-local-margin-retreatment-revision.v2": "topic-batch4-esophagus-structural-inflammatory-emergencies",
    "case.topic.esophagus-structural-inflammatory-emergencies.cancer-lymphovascular.v1": "topic-batch4-esophagus-structural-inflammatory-emergencies",
    "case.topic.wound-healing-immunology.staged-coverage.v1": "topic-batch4-wound-healing-immunology",
    "case.topic.wound-healing-immunology.contracture-coverage.v1": "topic-batch4-wound-healing-immunology",
    "case.topic.wound-healing-immunology.scar-function.v1": "topic-batch4-wound-healing-immunology",
    "case.topic.wound-healing-immunology.hand-laceration.v1": "topic-batch4-wound-healing-immunology",
    "case.topic.wound-healing-immunology.uncertain-immunization.v1": "topic-batch4-wound-healing-immunology",
    "case.topic.wound-healing-immunology.revision-graft-fluid.v2": "topic-batch4-wound-healing-immunology",
    "case.topic.wound-healing-immunology.revision-hiv-recent-series.v2": "topic-batch4-wound-healing-immunology",
    "case.topic.wound-healing-immunology.revision-scar-like-nodule.v2": "topic-batch4-wound-healing-immunology",
    "case.topic.wound-healing-immunology.revision-flap-exploration.v2": "topic-batch4-wound-healing-immunology",
    "case.topic.biliary-injury-malignancy.communicating-leak.v1": "topic-batch4-biliary-injury-malignancy",
    "case.topic.biliary-injury-malignancy.perihilar.v1": "topic-batch4-biliary-injury-malignancy",
    "case.topic.biliary-injury-malignancy.vasculobiliary.v1": "topic-batch4-biliary-injury-malignancy",
    "case.topic.biliary-injury-malignancy.palliation.v1": "topic-batch4-biliary-injury-malignancy",
    "case.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.v2": "topic-batch4-biliary-injury-malignancy",
    "case.topic.biliary-injury-malignancy.r2.t2-margin-directed-completion.v2": "topic-batch4-biliary-injury-malignancy",
    "case.topic.biliary-injury-malignancy.r2.type-i-cyst-excision.v2": "topic-batch4-biliary-injury-malignancy",
    "case.topic.biliary-injury-malignancy.r2.future-remnant-drainage.v2": "topic-batch4-biliary-injury-malignancy",
    "case.topic.biliary-injury-malignancy.r2.benign-continuity-stenting.v2": "topic-batch4-biliary-injury-malignancy",
    "case.topic.ostomy-enterocutaneous-fistula.revision-ecf-source-control.v2": "topic-batch4-ostomy-enterocutaneous-fistula",
    "case.topic.ostomy-enterocutaneous-fistula.split-pass-ecf-acute-operation-goal.v1": "topic-batch4-ostomy-enterocutaneous-fistula",
    "case.topic.ostomy-enterocutaneous-fistula.split-pass-ecf-resection.v1": "topic-batch4-ostomy-enterocutaneous-fistula",
    "case.topic.ostomy-enterocutaneous-fistula.revision-obstruction-after-reduction.v2": "topic-batch4-ostomy-enterocutaneous-fistula",
    "case.topic.ostomy-enterocutaneous-fistula.new-output-fever-record.v1": "topic-batch4-ostomy-enterocutaneous-fistula",
    "case.spleen-asplenia.early-itp-pass-standalone.20261111.v1": "topic-batch4-spleen-asplenia",
    "case.spleen-asplenia.hs-biliary.20261111.v1": "topic-batch4-spleen-asplenia",
    "case.spleen-asplenia.immune-response-preparation.20261111.v1": "topic-batch4-spleen-asplenia",
    "case.spleen-asplenia.vaccine-operative-calendar-review-response.20261111.v2": "topic-batch4-spleen-asplenia",
    "case.spleen-asplenia.hs-persistent-severity-review-response.20261111.v2": "topic-batch4-spleen-asplenia",
    "case.spleen-asplenia.xerocytosis-operative-stop-review-response.20261111.v2": "topic-batch4-spleen-asplenia",
    "case.spleen-asplenia.menb-missing-coverage-review-response.20261111.v2": "topic-batch4-spleen-asplenia",
    "case.spleen-asplenia.abscess-initial-control-review-response.20261111.v2": "topic-batch4-spleen-asplenia",
    "case.skin-soft-tissue-benign-infection.deep-foot-chart.20261111.v1": "topic-batch4-skin-soft-tissue-benign-infection",
    "case.skin-soft-tissue-benign-infection.progressive-thigh-chart.20261111.v1": "topic-batch4-skin-soft-tissue-benign-infection",
    "case.skin-soft-tissue-benign-infection.recurrence-workup.review2.20261111.v2": "topic-batch4-skin-soft-tissue-benign-infection",
    "case.skin-soft-tissue-benign-infection.hs-deroof.review2.20261111.v2": "topic-batch4-skin-soft-tissue-benign-infection",
    "case.skin-soft-tissue-benign-infection.pilonidal-closure.review2.20261111.v2": "topic-batch4-skin-soft-tissue-benign-infection",
    "case.skin-soft-tissue-benign-infection.cyst-acute.review2.20261111.v2": "topic-batch4-skin-soft-tissue-benign-infection",
    "case.topic.ethics-professionalism.recovery-endpoint-r2.v2": "topic-batch4-ethics-professionalism",
    "case.topic.ethics-professionalism.consent-scope-r2.v2": "topic-batch4-ethics-professionalism",
    "case.topic.ethics-professionalism.reversible-delay-r2.v2": "topic-batch4-ethics-professionalism",
    "case.topic.ethics-professionalism.research-integrity-r2.v2": "topic-batch4-ethics-professionalism",
    "case.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence-pass.v1": "owner-decisions-batch8",
    "case.topic.anesthesia-analgesia-pharmacology.last-seizure-drug-revision.v2": "topic-batch4-anesthesia-analgesia-pharmacology",
    "case.topic.anesthesia-analgesia-pharmacology.last-wide-complex-revision.v2": "topic-batch4-anesthesia-analgesia-pharmacology",
    "case.topic.anesthesia-analgesia-pharmacology.nmb-measurement-pass.v1": "topic-batch4-anesthesia-analgesia-pharmacology",
    "case.topic.anesthesia-analgesia-pharmacology.nmb-no-antagonist-revision.v2": "topic-batch4-anesthesia-analgesia-pharmacology",
    "case.topic.anesthesia-analgesia-pharmacology.opioid-maintenance-delivery-revision.v2": "topic-batch4-anesthesia-analgesia-pharmacology",
    "case.topic.anesthesia-analgesia-pharmacology.opioid-respiratory-endpoint-revision.v2": "topic-batch4-anesthesia-analgesia-pharmacology",
    "case.topic.anesthesia-analgesia-pharmacology.boosted-midazolam-route-revision.v2": "topic-batch4-anesthesia-analgesia-pharmacology",
    "case.topic.head-neck-salivary.lymphoid-architecture.v2": "topic-batch4-head-neck-salivary",
    "case.topic.head-neck-salivary.submandibular-stone.v1": "topic-batch4-head-neck-salivary",
    "case.topic.head-neck-salivary.facial-nerve-repair.v2": "topic-batch4-head-neck-salivary",
    "case.topic.head-neck-salivary.parotid-operative-record.v1": "topic-batch4-head-neck-salivary",
    "case.topic.neuro-orthopedic-essentials.review-response.median-motor-escalation.v2": "topic-batch4-neuro-orthopedic-essentials",
    "case.topic.neuro-orthopedic-essentials.review-response.joint-sampling-sequence.v2": "topic-batch4-neuro-orthopedic-essentials",
    "case.topic.neuro-orthopedic-essentials.review-response.joint-failed-drainage.v2": "topic-batch4-neuro-orthopedic-essentials",
    "case.topic.neuro-orthopedic-essentials.review-response.spine-imaging-lag.v2": "topic-batch4-neuro-orthopedic-essentials",
    "case.topic.neuro-orthopedic-essentials.review-response.spine-concordant-blood-culture.v2": "topic-batch4-neuro-orthopedic-essentials",
    "case.topic.neuro-orthopedic-essentials.review-response.footdrop-competing-localization.v2": "topic-batch4-neuro-orthopedic-essentials",
    "case.topic.quality-safety-systems.pdsa-spread.v1": "topic-batch4-quality-safety-systems",
    "case.topic.quality-safety-systems.pdsa-adapt.v2": "topic-batch4-quality-safety-systems",
    "case.topic.quality-safety-systems.specimen-observed-barrier.standalone.v1": "topic-batch4-quality-safety-systems",
    "case.topic.quality-safety-systems.portal-evaluation.v2": "topic-batch4-quality-safety-systems",
    "case.topic.adult-urology-gynecology.r2-08.v1": "topic-batch4-adult-urology-gynecology",
    "case.topic.adult-urology-gynecology.r2-10.v1": "topic-batch4-adult-urology-gynecology",
    "case.topic.adult-urology-gynecology.r2-14.v1": "topic-batch4-adult-urology-gynecology",
    "case.topic.adult-urology-gynecology.pass-single-23.v1": "topic-batch4-adult-urology-gynecology",
    "case.topic.adult-urology-gynecology.r2-24.v1": "topic-batch4-adult-urology-gynecology",
    "case.topic.adult-urology-gynecology.pass-single-25.v1": "topic-batch4-adult-urology-gynecology",
    "case.topic.adult-urology-gynecology.r2-26.v1": "topic-batch4-adult-urology-gynecology",
    "case.topic.adult-urology-gynecology.r2-27.v1": "topic-batch4-adult-urology-gynecology",
    "case.topic.adult-urology-gynecology.r2-28.v1": "topic-batch4-adult-urology-gynecology",
    "case.topic.adult-urology-gynecology.r2-31.v1": "topic-batch4-adult-urology-gynecology",
    "case.topic.adult-urology-gynecology.adnexal-torsion.v1": "topic-batch4-adult-urology-gynecology",
    "case.vascular-carotid.discordant-measurements.20261111.v1": "topic-batch4-vascular-carotid",
    "case.vascular-carotid.stroke-burden.20261111.v1": "topic-batch4-vascular-carotid",
    "case.vascular-carotid.distal-collapse.20261111.v1": "topic-batch4-vascular-carotid",
    "case.vascular-carotid.recurrent-anticoagulated-events.20261111.v2": "topic-batch4-vascular-carotid",
    "case.topic.colon-diverticular-lower-bleeding.salvage-first-episode-with-urinary-symptoms.v1": "topic-batch4-colon-diverticular-lower-bleeding",
    "case.topic.colon-diverticular-lower-bleeding.salvage-first-presentation-ct.v1": "topic-batch4-colon-diverticular-lower-bleeding",
    "case.topic.colon-diverticular-lower-bleeding.salvage-post-recovery-alarm-colonoscopy.v1": "topic-batch4-colon-diverticular-lower-bleeding",
    "case.topic.esophagus-motility-achalasia.salvage-before-resection-standalone.v1": "topic-batch4-esophagus-motility-achalasia",
    "case.topic.esophagus-gerd-barrett-hiatal.salvage-indefinite-inflamed-biopsies.v2": "topic-batch4-esophagus-gerd-barrett-hiatal",
    "case.topic.esophagus-gerd-barrett-hiatal.salvage-proven-gerd-on-therapy.v1": "topic-batch4-esophagus-gerd-barrett-hiatal",
    "case.topic.esophagus-gerd-barrett-hiatal.salvage-residual-barrett-after-resection.v1": "topic-batch4-esophagus-gerd-barrett-hiatal",
    "case.topic.esophagus-gerd-barrett-hiatal.salvage-unproven-reflux.v2": "topic-batch4-esophagus-gerd-barrett-hiatal",
    "case.topic.esophagus-gerd-barrett-hiatal.salvage-visible-lesion-first.v1": "topic-batch4-esophagus-gerd-barrett-hiatal",
    "case.topic.surgical-infection-antibiotics.salvage-adequate-control-duration.v2": "topic-batch4-surgical-infection-antibiotics",
    "case.topic.surgical-infection-antibiotics.salvage-pelvic-source-route.v2": "topic-batch4-surgical-infection-antibiotics",
    "case.topic.esophagus-motility-achalasia.limited-rescue-fitness.v1": "topic-batch3-esophagus-motility-achalasia",
    "case.topic.esophagus-motility-achalasia.preserved-peristalsis.v1": "topic-batch3-esophagus-motility-achalasia",
    "case.topic.esophagus-motility-achalasia.persistent-acquisition-failure.v1": "topic-batch3-esophagus-motility-achalasia",
    "case.topic.esophagus-motility-achalasia.borderline-relaxation.v1": "topic-batch3-esophagus-motility-achalasia",
    "case.topic.esophagus-gerd-barrett-hiatal.nighttime-symptoms.v1": "topic-batch3-esophagus-gerd-barrett-hiatal",
    "case.topic.esophagus-gerd-barrett-hiatal.junctional-metaplasia.v1": "topic-batch3-esophagus-gerd-barrett-hiatal",
    "case.topic.esophagus-gerd-barrett-hiatal.hernia-anemia.v1": "owner-decisions-batch8",
    "case.topic.esophagus-gerd-barrett-hiatal.variable-acid-exposure.v2": "topic-batch3-esophagus-gerd-barrett-hiatal",
    "case.topic.esophagus-gerd-barrett-hiatal.referral-versus-record.v2": "topic-batch3-esophagus-gerd-barrett-hiatal",
    "case.topic.esophagus-gerd-barrett-hiatal.sampling-and-inflammation.v2": "topic-batch3-esophagus-gerd-barrett-hiatal",
    "case.topic.esophagus-gerd-barrett-hiatal.incidental-hernia.v2": "topic-batch3-esophagus-gerd-barrett-hiatal",
    "case.topic.surgical-infection-antibiotics.incisional-response.v1": "topic-batch3-surgical-infection-antibiotics",
    "case.topic.surgical-infection-antibiotics.medication-reconciliation.v1": "topic-batch3-surgical-infection-antibiotics",
    "case.topic.surgical-infection-antibiotics.culture-narrowing.v1": "topic-batch3-surgical-infection-antibiotics",
    "case.topic.surgical-infection-antibiotics.anaerobic-processing.v1": "topic-batch3-surgical-infection-antibiotics",
    "case.topic.surgical-infection-antibiotics.invasive-yeast-record.v1": "topic-batch3-surgical-infection-antibiotics",
    "case.topic.surgical-infection-antibiotics.old-drain-isolate.v1": "topic-batch3-surgical-infection-antibiotics",
    "case.topic.colon-diverticular-lower-bleeding.pelvic-abscess-course.v1": "topic-batch3-colon-diverticular-lower-bleeding",
    "case.topic.colon-diverticular-lower-bleeding.perforation-operative-review.v2": "topic-batch3-colon-diverticular-lower-bleeding",
    "case.topic.colon-diverticular-lower-bleeding.immunosuppressed-recovery.v2": "topic-batch3-colon-diverticular-lower-bleeding",
    "case.topic.colon-diverticular-lower-bleeding.ongoing-hemorrhage-review.v1": "topic-batch3-colon-diverticular-lower-bleeding",
    "case.topic.colon-diverticular-lower-bleeding.recurrent-localized-hemorrhage.v1": "topic-batch3-colon-diverticular-lower-bleeding",
    "case.topic.colon-diverticular-lower-bleeding.high-risk-reconstruction.v1": "topic-batch3-colon-diverticular-lower-bleeding",
    "case.topic.colon-diverticular-lower-bleeding.secondary-prevention-aspirin.v1": "topic-batch3-colon-diverticular-lower-bleeding",
    "case.topic.colon-diverticular-lower-bleeding.vascular-lesion-review.v1": "topic-batch3-colon-diverticular-lower-bleeding",
    "case.topic.trauma-head-spine-extremities.gcs-trajectory.v1": "topic-batch3-trauma-head-spine-extremities",
    "case.topic.trauma-head-spine-extremities.limb-arterial.v1": "topic-batch3-trauma-head-spine-extremities",
    "case.topic.trauma-head-spine-extremities.penetrating-normal.v1": "topic-batch3-trauma-head-spine-extremities",
    "case.topic.statistics.positive-likelihood-ratio.v1": "topic-batch3-statistics",
    "case.topic.statistics.number-needed-to-harm.v1": "topic-batch3-statistics",
    "case.topic.statistics.paired-binary-test.v1": "topic-batch3-statistics",
    "case.topic.statistics.equivalence-interval.v2": "topic-batch3-statistics",
    "case.topic.statistics.standardized-risk.v1": "topic-batch3-statistics",
    "case.topic.statistics.post-test-probability.v1": "topic-batch3-statistics",
    "case.topic.statistics.incidence-proportion.v1": "topic-batch3-statistics",
    "case.topic.statistics.person-time-rate.v1": "topic-batch3-statistics",
    "case.topic.statistics.point-prevalence.v1": "topic-batch3-statistics",
    "case.topic.statistics.standard-error.v1": "topic-batch3-statistics",
    "case.topic.statistics.interval-width-sample-size.v1": "topic-batch3-statistics",
    "case.topic.statistics.detect-smaller-effect.v1": "topic-batch3-statistics",
    "case.topic.statistics.confidence-level.v2": "topic-batch3-statistics",
    "case.topic.statistics.intention-to-treat.v1": "topic-batch3-statistics",
    "case.topic.statistics.allocation-concealment.v1": "topic-batch3-statistics",
    "case.topic.statistics.multiplicity.v1": "topic-batch3-statistics",
    "case.topic.statistics.stratified-confounding.v2": "topic-batch3-statistics",
    "case.topic.statistics.effect-modification.v1": "topic-batch3-statistics",
    "case.topic.statistics.discordant-pairs.v1": "topic-batch3-statistics",
    "case.topic.statistics.right-censoring.v1": "topic-batch3-statistics",
    "case.topic.statistics.kaplan-meier-step.v1": "topic-batch3-statistics",
    "case.topic.statistics.lead-time-bias.v1": "topic-batch3-statistics",
    "case.topic.statistics.logistic-model.v1": "topic-batch3-statistics",
    "case.topic.statistics.length-time-bias.v2": "topic-batch3-statistics",
    "case.topic.pancreas-acute-pancreatitis.fluid-overload.pass1": "topic-batch3-pancreas-acute-pancreatitis",
    "case.topic.pancreas-acute-pancreatitis.refractory-compartment.pass1": "topic-batch3-pancreas-acute-pancreatitis",
    "case.topic.pancreas-acute-pancreatitis.sterile-necrosis-antibiotics.review1": "topic-batch3-pancreas-acute-pancreatitis",
    "case.topic.pancreas-acute-pancreatitis.enteral-before-parenteral.review1": "topic-batch3-pancreas-acute-pancreatitis",
    "case.topic.pancreas-acute-pancreatitis.gastric-intolerance.review1": "topic-batch3-pancreas-acute-pancreatitis",
    "case.topic.pancreas-acute-pancreatitis.moderate-resuscitation.review1": "topic-batch3-pancreas-acute-pancreatitis",
    "case.topic.pancreas-acute-pancreatitis.responding-infected-necrosis.review1": "topic-batch3-pancreas-acute-pancreatitis",
    "case.topic.pancreas-acute-pancreatitis.deteriorating-early-necrosis.review1": "topic-batch3-pancreas-acute-pancreatitis",
    "case.topic.pancreas-acute-pancreatitis.failed-drainage-vard.review1": "topic-batch3-pancreas-acute-pancreatitis",
    "case.topic.bowel-ibd-malabsorption-short-bowel.celiac-record.v2": "topic-batch3-bowel-ibd-malabsorption-short-bowel",
    "case.topic.bowel-ibd-malabsorption-short-bowel.crohn-penetrating-course.v2": "topic-batch3-bowel-ibd-malabsorption-short-bowel",
    "case.topic.bowel-ibd-malabsorption-short-bowel.crohn-bowel-preservation.v1": "topic-batch3-bowel-ibd-malabsorption-short-bowel",
    "case.topic.bowel-ibd-malabsorption-short-bowel.uc-dysplasia-course.v2": "topic-batch3-bowel-ibd-malabsorption-short-bowel",
    "case.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance-review.v2": "owner-decisions-batch8",
    "case.topic.bowel-ibd-malabsorption-short-bowel.jejunal-gist-resection-review.v2": "topic-batch3-bowel-ibd-malabsorption-short-bowel",
    "case.topic.bowel-ibd-malabsorption-short-bowel.uc-staged-colectomy-review.v2": "topic-batch3-bowel-ibd-malabsorption-short-bowel",
    "case.topic.bowel-ibd-malabsorption-short-bowel.pouch-localize-review.v2": "topic-batch3-bowel-ibd-malabsorption-short-bowel",
    "case.topic.fluids-electrolytes-acid-base.potassium-callback.v1": "topic-batch3-fluids-electrolytes-acid-base",
    "case.topic.fluids-electrolytes-acid-base.current-corrected-gap.r2": "topic-batch3-fluids-electrolytes-acid-base",
    "case.topic.fluids-electrolytes-acid-base.hyponatraemia-loss-replacement.r2": "topic-batch3-fluids-electrolytes-acid-base",
    "case.topic.fluids-electrolytes-acid-base.retained-water.v1": "topic-batch3-fluids-electrolytes-acid-base",
    "case.topic.fluids-electrolytes-acid-base.gastric-chloride-replacement.r2": "topic-batch3-fluids-electrolytes-acid-base",
    "case.topic.fluids-electrolytes-acid-base.dka-potassium-sequence.r2": "topic-batch3-fluids-electrolytes-acid-base",
    "case.topic.fluids-electrolytes-acid-base.dka-transition-pass-standalone.r2": "topic-batch3-fluids-electrolytes-acid-base",
    "case.topic.fluids-electrolytes-acid-base.hhs-tonicity-response.r2": "topic-batch3-fluids-electrolytes-acid-base",
    "case.topic.hematology-transfusion-coagulation.anemia.v1": "topic-batch3-hematology-transfusion-coagulation",
    "case.topic.hematology-transfusion-coagulation.vka-factor-replacement.v2": "topic-batch3-hematology-transfusion-coagulation",
    "case.topic.hematology-transfusion-coagulation.transfusion-calcium.v2": "topic-batch3-hematology-transfusion-coagulation",
    "case.topic.hematology-transfusion-coagulation.platelet-product.v2": "topic-batch3-hematology-transfusion-coagulation",
    "case.topic.hematology-transfusion-coagulation.taco-next-transfusion.v2": "topic-batch3-hematology-transfusion-coagulation",
    "case.topic.hematology-transfusion-coagulation.antigen-compatible-rbc.v2": "topic-batch3-hematology-transfusion-coagulation",
    "case.topic.hematology-transfusion-coagulation.hit-initial-action.v2": "topic-batch3-hematology-transfusion-coagulation",
    "case.topic.hematology-transfusion-coagulation.hit-functional-confirmation.v2": "topic-batch3-hematology-transfusion-coagulation",
    "case.topic.hematology-transfusion-coagulation.vwd-major-plan.v2": "topic-batch3-hematology-transfusion-coagulation",
    "case.topic.hematology-transfusion-coagulation.marrow-reassessment.v2": "topic-batch3-hematology-transfusion-coagulation",
    "case.topic.hematology-transfusion-coagulation.cholestasis-correction.v2": "topic-batch3-hematology-transfusion-coagulation",
    "case.topic.parathyroid-calcium.repeated-calcium.v1": "topic-batch3-parathyroid-calcium",
    "case.topic.parathyroid-calcium.age-biochemistry.v1": "topic-batch3-parathyroid-calcium",
    "case.topic.parathyroid-calcium.urine-confound.v1": "topic-batch3-parathyroid-calcium",
    "case.topic.parathyroid-calcium.radial-density.v1": "topic-batch3-parathyroid-calcium",
    "case.topic.parathyroid-calcium.localization-conflict.v1": "topic-batch3-parathyroid-calcium",
    "case.topic.parathyroid-calcium.invasive-neck-lesion.v1": "topic-batch3-parathyroid-calcium",
    "case.topic.parathyroid-calcium.n11.v2": "topic-batch3-parathyroid-calcium",
    "case.topic.parathyroid-calcium.n14.v2": "topic-batch3-parathyroid-calcium",
    "case.topic.parathyroid-calcium.n16.v2": "topic-batch3-parathyroid-calcium",
    "case.topic.parathyroid-calcium.n17.v2": "topic-batch3-parathyroid-calcium",
    "case.topic.nutrition-support-metabolism.r2-preserved-oral-escalation.v2": "topic-batch3-nutrition-support-metabolism",
    "case.topic.nutrition-support-metabolism.severe-preoperative-risk.v1": "topic-batch3-nutrition-support-metabolism",
    "case.topic.nutrition-support-metabolism.r2-preserved-renal-protein-reference.v2": "topic-batch3-nutrition-support-metabolism",
    "case.topic.nutrition-support-metabolism.r2-swallow-versus-gut.v2": "topic-batch3-nutrition-support-metabolism",
    "case.topic.nutrition-support-metabolism.r2-preserved-gastric-aspiration-route.v2": "topic-batch3-nutrition-support-metabolism",
    "case.topic.nutrition-support-metabolism.r2-zinc-copper-assessment.v2": "topic-batch3-nutrition-support-metabolism",
    "case.topic.nutrition-support-metabolism.home-access.v1": "topic-batch3-nutrition-support-metabolism",
    "case.topic.nutrition-support-metabolism.r2-enteral-medication-review.v2": "topic-batch3-nutrition-support-metabolism",
    "case.topic.nutrition-support-metabolism.r2-postoperative-route-after-swallow.v2": "topic-batch3-nutrition-support-metabolism",
    "case.topic.nutrition-support-metabolism.renal-formula-repaired.v1": "topic-batch3-nutrition-support-metabolism",
    "case.vascular-limb-mesenteric-arterial.pass-nomi-operative-change.v2": "topic-batch3-vascular-limb-mesenteric-arterial",
    "case.vascular-limb-mesenteric-arterial.acute-mesenteric-course.v1": "topic-batch3-vascular-limb-mesenteric-arterial",
    "case.vascular-limb-mesenteric-arterial.pass-mvt-heparin.v2": "topic-batch3-vascular-limb-mesenteric-arterial",
    "case.vascular-limb-mesenteric-arterial.pass-initial-abi.v2": "topic-batch3-vascular-limb-mesenteric-arterial",
    "case.vascular-limb-mesenteric-arterial.pass-cfa-procedure.v2": "topic-batch3-vascular-limb-mesenteric-arterial",
    "case.vascular-limb-mesenteric-arterial.pass-inflow-first.v2": "topic-batch3-vascular-limb-mesenteric-arterial",
    "case.vascular-limb-mesenteric-arterial.r2-exercise-exposure.v2": "topic-batch3-vascular-limb-mesenteric-arterial",
    "case.vascular-limb-mesenteric-arterial.r2-response-defer.v2": "topic-batch3-vascular-limb-mesenteric-arterial",
    "case.vascular-limb-mesenteric-arterial.r2-pad-antiplatelet.v2": "topic-batch3-vascular-limb-mesenteric-arterial",
    "case.vascular-limb-mesenteric-arterial.r2-cmi-after-duplex.v2": "topic-batch3-vascular-limb-mesenteric-arterial",
    "case.vascular-limb-mesenteric-arterial.r2-ami-cta-aki.v2": "topic-batch3-vascular-limb-mesenteric-arterial",
    "case.topic.stomach-ulcer-bleeding-motility.cure-collection-calendar.v1": "topic-batch3-stomach-ulcer-bleeding-motility",
    "case.topic.stomach-ulcer-bleeding-motility.cure-serology-disagreement.v1": "topic-batch3-stomach-ulcer-bleeding-motility",
    "case.topic.stomach-ulcer-bleeding-motility.confounded-emptying-record.v1": "topic-batch3-stomach-ulcer-bleeding-motility",
    "case.topic.stomach-ulcer-bleeding-motility.prokinetic-after-reaction.v1": "topic-batch3-stomach-ulcer-bleeding-motility",
    "case.topic.stomach-ulcer-bleeding-motility.ulcer-rescue-course.pass-standalone.v1": "topic-batch3-stomach-ulcer-bleeding-motility",
    "case.topic.stomach-ulcer-bleeding-motility.aspirin-after-ulcer.v1": "topic-batch3-stomach-ulcer-bleeding-motility",
    "case.topic.stomach-ulcer-bleeding-motility.perforation-record.pass-standalone.v1": "topic-batch3-stomach-ulcer-bleeding-motility",
    "case.topic.stomach-ulcer-bleeding-motility.perforation-unstable-access.v1": "topic-batch3-stomach-ulcer-bleeding-motility",
    "case.topic.stomach-ulcer-bleeding-motility.postgastrectomy-meal-response.pass-standalone.v1": "topic-batch3-stomach-ulcer-bleeding-motility",
    "case.topic.stomach-ulcer-bleeding-motility.salvage-eradication-standalone.v2": "topic-batch3-stomach-ulcer-bleeding-motility",
    "case.topic.stomach-ulcer-bleeding-motility.failed-endoscopy-embolization-standalone.v2": "topic-batch3-stomach-ulcer-bleeding-motility",
    "case.topic.adrenal-men-endocrine.cushing-classification.v1": "topic-batch3-adrenal-men-endocrine",
    "case.topic.adrenal-men-endocrine.avs-contralateral-nodule-standalone.v2": "topic-batch3-adrenal-men-endocrine",
    "case.topic.adrenal-men-endocrine.failed-avs.v1": "topic-batch3-adrenal-men-endocrine",
    "case.topic.adrenal-men-endocrine.men2-operative-priority-standalone.v2": "topic-batch3-adrenal-men-endocrine",
    "case.topic.adrenal-men-endocrine.indeterminate-growth.v1": "topic-batch3-adrenal-men-endocrine",
    "case.topic.adrenal-men-endocrine.benign-imaging-followup-standalone.v2": "topic-batch3-adrenal-men-endocrine",
    "case.topic.adrenal-men-endocrine.confirm-cortisol-autonomy-standalone.v2": "topic-batch3-adrenal-men-endocrine",
    "case.topic.adrenal-men-endocrine.unilateral-overt-cortisol-standalone.v2": "topic-batch3-adrenal-men-endocrine",
    "case.topic.adrenal-men-endocrine.post-cortisol-replacement-standalone.v2": "topic-batch3-adrenal-men-endocrine",
    "case.topic.adrenal-men-endocrine.bilateral-pa-medical-standalone.v2": "topic-batch3-adrenal-men-endocrine",
    "case.topic.adrenal-men-endocrine.suspected-acc-pathway-standalone.v2": "topic-batch3-adrenal-men-endocrine",
    "case.topic.breast-cancer.initial-bulky-nodes-response.v1": "topic-batch3-breast-cancer",
    "case.topic.breast-cancer.diffuse-skin-clinic-review-pass-split.v2": "topic-batch3-breast-cancer",
    "case.topic.breast-cancer.localization-specimen-chart.v1": "topic-batch3-breast-cancer",
    "case.topic.breast-cancer.additional-mri-focus-pass-split.v2": "topic-batch3-breast-cancer",
    "case.topic.breast-cancer.dcis-final-boundary.v1": "topic-batch3-breast-cancer",
    "case.topic.breast-cancer.her2-treatment-course-pass-split.v2": "topic-batch3-breast-cancer",
    "case.topic.breast-cancer.residual-breast-distribution-r2.v2": "topic-batch3-breast-cancer",
    "case.topic.breast-cancer.her2-treatment-course-r2.v2": "topic-batch3-breast-cancer",
    "case.topic.melanoma-cutaneous-cancer.microscopic-node.v1": "topic-batch3-melanoma-cutaneous-cancer",
    "case.topic.melanoma-cutaneous-cancer.node-negative-high-risk.v1": "topic-batch3-melanoma-cutaneous-cancer",
    "case.topic.melanoma-cutaneous-cancer.thick-primary-margin.v2": "topic-batch3-melanoma-cutaneous-cancer",
    "case.topic.melanoma-cutaneous-cancer.mcc-negative-imaging-slnb.v2": "topic-batch3-melanoma-cutaneous-cancer",
    "case.topic.gallbladder-duct-stones.duct-assessment-duct-before-ercp-pass.v2": "topic-batch3-gallbladder-duct-stones",
    "case.topic.gallbladder-duct-stones.persistent-suspicion.v1": "topic-batch3-gallbladder-duct-stones",
    "case.topic.gallbladder-duct-stones.gallbladder-functional-study-acute-filling-protocol-pass.v2": "topic-batch3-gallbladder-duct-stones",
    "case.topic.gallbladder-duct-stones.high-risk-operation.v1": "topic-batch3-gallbladder-duct-stones",
    "case.topic.gallbladder-duct-stones.obstructive-sepsis-unstable-drainage-extent-pass.v2": "topic-batch3-gallbladder-duct-stones",
    "case.topic.gallbladder-duct-stones.narrow-distal-duct.v1": "topic-batch3-gallbladder-duct-stones",
    "case.topic.gallbladder-duct-stones.fused-neck.v1": "topic-batch3-gallbladder-duct-stones",
    "case.topic.gallbladder-duct-stones.remnant-symptoms-remnant-anatomy-workup-pass.v2": "topic-batch3-gallbladder-duct-stones",
    "case.topic.gallbladder-duct-stones.proximal-obstruction-neck-stone-neck-stone-proximal-dilation-pass.v2": "topic-batch3-gallbladder-duct-stones",
    "case.topic.gallbladder-duct-stones.anticoagulated-duct-infection.v1": "topic-batch3-gallbladder-duct-stones",
    "case.topic.gallbladder-duct-stones.symptoms-beyond-seventy-two-hours-review2.v2": "topic-batch3-gallbladder-duct-stones",
    "case.topic.gallbladder-duct-stones.active-cardiac-gallbladder-source-review2.v2": "topic-batch3-gallbladder-duct-stones",
    "case.topic.gallbladder-duct-stones.failed-clearance-drainage-bridge-review2.v2": "topic-batch3-gallbladder-duct-stones",
    "case.topic.gallbladder-duct-stones.stent-not-permanent-clearance-review2.v2": "topic-batch3-gallbladder-duct-stones",
    "case.topic.hernia-groin.changing-function.v1": "topic-batch3-hernia-groin",
    "case.topic.hernia-groin.partial-wall.v1": "topic-batch3-hernia-groin",
    "case.topic.hernia-groin.contaminated-groin.v1": "topic-batch3-hernia-groin",
    "case.topic.hernia-groin.r2.marked-femoral-repair.v2": "topic-batch3-hernia-groin",
    "case.topic.hernia-groin.r2.new-component-ultrasound.v2": "topic-batch3-hernia-groin",
    "case.topic.hernia-groin.r2.anterior-recurrence-plane.v2": "topic-batch3-hernia-groin",
    "case.topic.hernia-groin.r2.acute-reduction-selection.v2": "topic-batch3-hernia-groin",
    "case.topic.hernia-groin.r2.local-anesthesia-selection.v2": "topic-batch3-hernia-groin",
    "case.topic.critical-respiratory-ventilation.salvage-copd-planned-extubation.v1": "topic-batch3-critical-respiratory-ventilation",
    "case.topic.critical-respiratory-ventilation.salvage-sbt-readiness.v1": "topic-batch3-critical-respiratory-ventilation",
    "case.topic.critical-respiratory-ventilation.salvage-sbt-fio2.v1": "topic-batch3-critical-respiratory-ventilation",
    "case.topic.critical-respiratory-ventilation.salvage-copd-niv.v1": "topic-batch3-critical-respiratory-ventilation",
    "case.critical-shock-resuscitation.inotrope-after-pressure-restored-salvage.v1": "topic-batch3-critical-shock-resuscitation",
    "case.critical-shock-resuscitation.lactate-perfusion-discordance-salvage.v1": "topic-batch3-critical-shock-resuscitation",
    "case.critical-shock-resuscitation.vasopressin-escalation-salvage.v1": "topic-batch3-critical-shock-resuscitation",
    "case.topic.critical-renal-organ-support.congestion-directed-oliguria.salvage.v1": "topic-batch3-critical-renal-organ-support",
    "case.topic.critical-renal-organ-support.rrt-treatment-response.salvage.v1": "topic-batch3-critical-renal-organ-support",
    "case.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.salvage.v1": "topic-batch3-critical-renal-organ-support",
    "case.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.salvage.v1": "topic-batch3-trauma-initial-abdomen",
    "case.topic.trauma-initial-abdomen.renal-isolated-urine-leak.salvage.v1": "topic-batch3-trauma-initial-abdomen",
    "case.topic.small-bowel-obstruction-ileus.contrast-assessment-standalone.v1": "topic-batch3-small-bowel-obstruction-ileus",
    "case.topic.appendix-appendicitis.salvage-persistent-pain-exploration.v1": "topic-batch3-appendix-appendicitis",
    "case.topic.appendix-appendicitis.salvage-invasive-adenocarcinoma-resection.v1": "topic-batch3-appendix-appendicitis",
    "case.topic.appendix-appendicitis.salvage-post-abscess-interval-appendectomy.v1": "topic-batch3-appendix-appendicitis",
    "case.vascular-aorta.salvage-growing-sac-source.v1": "topic-batch3-vascular-aorta",
    "case.vascular-aorta.salvage-residual-static-branch.v1": "topic-batch3-vascular-aorta",
    "case.vascular-aorta.salvage-stable-branch-flow.v1": "topic-batch3-vascular-aorta",
    "case.topic.pancreas-chronic-cysts-neoplasia.salvage.chronic-failed-stenting.v1": "topic-batch3-pancreas-chronic-cysts-neoplasia",
    "case.topic.pancreas-chronic-cysts-neoplasia.salvage.ipmn-high-risk-plan.v1": "topic-batch3-pancreas-chronic-cysts-neoplasia",
    "case.topic.pancreas-chronic-cysts-neoplasia.salvage.mcn-large-symptomatic.v1": "topic-batch3-pancreas-chronic-cysts-neoplasia",
    "case.topic.pancreas-chronic-cysts-neoplasia.salvage.net-growth-duct-proximity.v1": "topic-batch3-pancreas-chronic-cysts-neoplasia",
    "case.topic.pancreas-chronic-cysts-neoplasia.salvage.postop-vomiting-inflammation.v1": "topic-batch3-pancreas-chronic-cysts-neoplasia",
    "case.trauma-thoracic.cardiac-course.20261111.v1": "topic-batch2-trauma-thoracic",
    "case.trauma-thoracic.cardiac-disposition.20261111.v1": "topic-batch2-trauma-thoracic",
    "case.trauma-thoracic.drain-complication.20261111.v1": "topic-batch2-trauma-thoracic",
    "case.trauma-thoracic.bleeding-course.20261111.v1": "topic-batch2-trauma-thoracic",
    "case.trauma-thoracic.chestwall-course.20261111.v1": "topic-batch2-trauma-thoracic",
    "case.vascular-aorta.screening-review.v2": "topic-batch2-vascular-aorta",
    "case.vascular-aorta.proximal-attachment-leak.v1": "topic-batch2-vascular-aorta",
    "case.vascular-aorta.retrograde-ascending-extension.v1": "topic-batch2-vascular-aorta",
    "case.vascular-aorta.impulse-response-review.v2": "topic-batch2-vascular-aorta",
    "case.vascular-aorta.tevar-inflow-and-neurology.v1": "topic-batch2-vascular-aorta",
    "case.vascular-aorta.small-popliteal-course.v2": "topic-batch2-vascular-aorta",
    "case.vascular-aorta.graft-diagnostic-review.v2": "topic-batch2-vascular-aorta",
    "case.vascular-aorta.heritable-native-taaa.v1": "topic-batch2-vascular-aorta",
    "case.topic.liver-malignancy.dynamic-hcc.v1": "topic-batch2-liver-malignancy",
    "case.topic.liver-malignancy.hcc-favorable-resection.v1": "topic-batch2-liver-malignancy",
    "case.topic.liver-malignancy.hcc-portal-flow.v1": "topic-batch2-liver-malignancy",
    "case.topic.pancreas-chronic-cysts-neoplasia.head-cancer-sequence.v2": "topic-batch2-pancreas-chronic-cysts-neoplasia",
    "case.topic.pancreas-chronic-cysts-neoplasia.postoperative-source-control.v2": "topic-batch2-pancreas-chronic-cysts-neoplasia",
    "case.topic.pancreas-chronic-cysts-neoplasia.serous-compression.v1": "topic-batch2-pancreas-chronic-cysts-neoplasia",
    "case.topic.pancreas-chronic-cysts-neoplasia.ipmn-after-resection.v1": "topic-batch2-pancreas-chronic-cysts-neoplasia",
    "case.topic.small-bowel-obstruction-ileus.closed-loop.v1": "topic-batch1-small-bowel-obstruction-ileus",
    "case.topic.small-bowel-obstruction-ileus.transit-course.v1": "topic-batch1-small-bowel-obstruction-ileus",
    "case.topic.small-bowel-obstruction-ileus.virgin-abdomen.v1": "topic-batch1-small-bowel-obstruction-ileus",
    "case.topic.critical-renal-organ-support.circuit-anticoagulation.v1": "topic-batch1-critical-renal-organ-support",
    "case.topic.critical-renal-organ-support.kidney-recovery.v1": "topic-batch1-critical-renal-organ-support",
    "case.critical-shock-resuscitation.fluid-assessment.v1": "topic-batch1-critical-shock-resuscitation",
    "case.critical-shock-resuscitation.reassess-shock-mechanism.v2": "topic-batch1-critical-shock-resuscitation",
    "case.topic.appendix-appendicitis.peritoneal-mucin.v2": "topic-batch1-appendix-appendicitis",
    "case.topic.appendix-appendicitis.goblet-cell-pathology.v1": "topic-batch1-appendix-appendicitis",
    "case.topic.appendix-appendicitis.net-staging.v2": "topic-batch1-appendix-appendicitis",
    "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2": "topic-batch1-trauma-initial-abdomen",
    "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2": "topic-batch1-trauma-initial-abdomen",
    "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2": "topic-batch1-trauma-initial-abdomen",
    "case.topic.trauma-initial-abdomen.pancreatic-duct-location.v2": "topic-batch1-trauma-initial-abdomen",
    "case.topic.trauma-initial-abdomen.contained-renal-compartment.v2": "topic-batch1-trauma-initial-abdomen",
    "case.topic.trauma-initial-abdomen.limited-jejunum-defect.v2": "topic-batch1-trauma-initial-abdomen",
    "case.topic.critical-respiratory-ventilation.air-trapping.v1": "topic-batch1-critical-respiratory-ventilation",
    "case.topic.critical-respiratory-ventilation.extubation-rescue.v1": "topic-batch1-critical-respiratory-ventilation",
    "case.n4.cholecystectomy-neck-plane-bailout.v1": "n4-round1",
    "case.n4.colonic-wall-pattern-after-mucosal-biopsy.v1": "n4-round1",
    "case.n4.venous-ulcer-contralateral-pressure-trap.v1": "n4-round1",
    "case.n4.incisional-pocket-above-retained-mesh.v1": "n4-round1",
    "case.n4.ventral-controlled-enterotomy-mesh-material.v2": "n4-round2",
    "case.n4.unexpected-deep-mass-during-lipoma-excision.v2": "n4-round2",
    "case.n4.ulcer-recurrent-bleeding-after-clips.v2": "n4-round2",
    "case.n4.cholangiogram-lucencies-and-proximal-coverage.v1": "n4-round2",
    "case.harden1.phosphate-handling.20261110": "harden1-round1",
    "case.n3.delayed-regurgitation-proximal-anatomic-study.v1": "n3-round4",
    "case.n3.venous-ulcer-with-competing-arterial-findings.v1": "n3-round4",
  // BEGIN FLAGS4 ACCEPTED HEADER 20261108
  "case.gs028f.nutrition.c1-metabolic-transition": "flags4-accepted",
  // END FLAGS4 ACCEPTED HEADER 20261108
  // BEGIN STATS1 ACCEPTED HEADERS 20261108
  "case.gs028se.independent-t-paired-t.a-two-teams": "stats1-accepted",
  "case.gs028se.independent-t-paired-t.a-two-cohorts": "stats1-accepted",
  "case.gs028se.independent-t-paired-t.a-two-shifts": "stats1-accepted",
  "case.gs028se.independent-t-paired-t.a-two-scripts": "stats1-accepted",
  "case.gs028se.independent-t-paired-t.b-same-rooms": "stats1-accepted",
  "case.gs028se.independent-t-paired-t.b-same-trainees": "stats1-accepted",
  "case.gs028se.independent-t-paired-t.b-matched-sites": "stats1-accepted",
  "case.gs028se.independent-t-paired-t.b-same-workers": "stats1-accepted",
  "case.gs028se.one-way-anova-rank-sum.a-three-teams": "stats1-accepted",
  "case.gs028se.one-way-anova-rank-sum.a-four-formats": "stats1-accepted",
  "case.gs028se.one-way-anova-rank-sum.a-three-sites": "stats1-accepted",
  "case.gs028se.one-way-anova-rank-sum.a-five-signs": "stats1-accepted",
  "case.gs028se.one-way-anova-rank-sum.b-ordinal-teams": "stats1-accepted",
  "case.gs028se.one-way-anova-rank-sum.b-skewed-delays": "stats1-accepted",
  "case.gs028se.one-way-anova-rank-sum.b-independent-likert": "stats1-accepted",
  "case.gs028se.one-way-anova-rank-sum.b-two-queues": "stats1-accepted",
  "case.gs028se.signed-rank-chi-square.a-paired-workload": "stats1-accepted",
  "case.gs028se.signed-rank-chi-square.a-same-rooms-skewed": "stats1-accepted",
  "case.gs028se.signed-rank-chi-square.a-matched-dyads": "stats1-accepted",
  "case.gs028se.signed-rank-chi-square.a-pre-post-counts": "stats1-accepted",
  "case.gs028se.signed-rank-chi-square.b-role-by-choice": "stats1-accepted",
  "case.gs028se.signed-rank-chi-square.b-shift-by-response": "stats1-accepted",
  "case.gs028se.signed-rank-chi-square.b-badge-by-completion": "stats1-accepted",
  "case.gs028se.signed-rank-chi-square.b-site-by-category": "stats1-accepted",
  "case.gs028se.fisher-exact-study-design.a-rare-event": "stats1-accepted",
  "case.gs028se.fisher-exact-study-design.a-tiny-pilot": "stats1-accepted",
  "case.gs028se.fisher-exact-study-design.a-sparse-exposure": "stats1-accepted",
  "case.gs028se.fisher-exact-study-design.a-small-response": "stats1-accepted",
  "case.gs028se.fisher-exact-study-design.b-cohort-followup": "stats1-accepted",
  "case.gs028se.fisher-exact-study-design.b-random-scripts": "stats1-accepted",
  "case.gs028se.fisher-exact-study-design.b-case-control": "stats1-accepted",
  "case.gs028se.fisher-exact-study-design.b-cross-sectional": "stats1-accepted",
  "case.gs028se.bias-confounding-sensitivity-specificity.a-baseline-shift": "stats1-accepted",
  "case.gs028se.bias-confounding-sensitivity-specificity.a-night-excluded": "stats1-accepted",
  "case.gs028se.bias-confounding-sensitivity-specificity.a-recall-timing": "stats1-accepted",
  "case.gs028se.bias-confounding-sensitivity-specificity.a-adjusted-model": "stats1-accepted",
  "case.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-90": "stats1-accepted",
  "case.gs028se.bias-confounding-sensitivity-specificity.b-specificity-95": "stats1-accepted",
  "case.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-80": "stats1-accepted",
  "case.gs028se.bias-confounding-sensitivity-specificity.b-specificity-70": "stats1-accepted",
  "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-higher-prevalence": "stats1-accepted",
  "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence": "stats1-accepted",
  "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-ppv-table": "stats1-accepted",
  "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed": "stats1-accepted",
  "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-cohort-risk": "stats1-accepted",
  "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-case-control-or": "stats1-accepted",
  "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-adjusted-odds": "stats1-accepted",
  "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-rare-not-identical": "stats1-accepted",
  "case.gs028se.arr-nnt-p-value.a-arr-ten": "stats1-accepted",
  "case.gs028se.arr-nnt-p-value.a-arr-five": "stats1-accepted",
  "case.gs028se.arr-nnt-p-value.a-arr-twenty": "stats1-accepted",
  "case.gs028se.arr-nnt-p-value.a-arr-six": "stats1-accepted",
  "case.gs028se.arr-nnt-p-value.b-p-003": "stats1-accepted",
  "case.gs028se.arr-nnt-p-value.b-p-040": "stats1-accepted",
  "case.gs028se.arr-nnt-p-value.b-p-0001": "stats1-accepted",
  "case.gs028se.arr-nnt-p-value.b-p-008": "stats1-accepted",
  "case.gs028se.confidence-interval-errors-power.a-ratio-crosses": "stats1-accepted",
  "case.gs028se.confidence-interval-errors-power.a-difference-excludes": "stats1-accepted",
  "case.gs028se.confidence-interval-errors-power.a-precision-width": "stats1-accepted",
  "case.gs028se.confidence-interval-errors-power.a-repeated-sampling": "stats1-accepted",
  "case.gs028se.confidence-interval-errors-power.b-type-one": "stats1-accepted",
  "case.gs028se.confidence-interval-errors-power.b-type-two": "stats1-accepted",
  "case.gs028se.confidence-interval-errors-power.b-power": "stats1-accepted",
  "case.gs028se.confidence-interval-errors-power.b-post-hoc": "stats1-accepted",
  // END STATS1 ACCEPTED HEADERS 20261108

  // BEGIN FLAGS3 ACCEPTED HEADERS 20261107
  "case.inguinal-hernia.caregiving-strain": "flags3-accepted",
  // END FLAGS3 ACCEPTED HEADERS 20261107
  // BEGIN N3 FROZEN REVIEW2 HEADERS 20261105
  "case.n3.bilateral-carotid-symptom-attribution.v1": "n3-round3",
  "case.n3.postsplenectomy-nodule-function-before-targeting.v1": "n3-round3",
  "case.n3.dysphagia-biopsy-territory-after-negative-endoscopy.v1": "n3-round3",
  "case.n3.tumor-screen-versus-family-test-sequence.v1": "n3-round3",
  "case.n3.gastric-lymphoma-new-large-cell-process.v1": "n3-round3",
  // END N3 FROZEN REVIEW2 HEADERS 20261105
  // BEGIN FLAGS2 WHOLE-CASE HEADERS 20261105
  "case.gs028c.palpable-breast.paired-dense-focal": "flags2-round3",
  "case.asymptomatic-phpt.incidental-calcium": "flags2-round3",
  // END FLAGS2 WHOLE-CASE HEADERS 20261105
  // BEGIN FLAGS2 G06 HEADER 20261105
  // END FLAGS2 G06 HEADER 20261105
  // BEGIN BATCH2B REVIEW2 HEADERS 20261105
  "case.gs028e.mis-principles.c3-phrenic-pathway": "batch2b-round2",
  "case.gs028e.immunology.c3-historical-kidney-event": "batch2b-round2",
  "case.gs028b.differentiated-thyroid-cancer.a-completed-negative": "batch2b-round2",
  "case.gs028b.post-neoadjuvant-breast.b-diffuse-residual": "batch2b-round2",
  "case.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock": "batch2b-round2",
  "case.gs028b.post-neoadjuvant-breast.a-residual-palpable": "batch2b-round2",
  "case.gs028d.dialysis-access.b-arm-swelling": "batch2b-round2",
  "case.gs028d.geriatrics.b-mobility-nutrition": "batch2b-round2",
  "case.gs028c.mild-biliary-pancreatitis.b-discharge-rounds": "batch2b-round2",
  "case.gs028b.post-neoadjuvant-breast.paired-marker-residual": "batch2b-round2",
  "case.gs028c.acute-cholecystitis.b-hida-confirmed": "batch2b-round2",
  "case.gs028d.hyperkalaemia.a-dehydration-result": "batch2b-round2",
  "case.gs028d.acid-base.b-malnutrition-gap": "batch2b-round2",
  "case.bread-butter.perianal-abscess.perianal-swelling": "batch2b-round2",
  "case.bread-butter.perianal-abscess.painful-sitting": "batch2b-round2",
  "case.gs028b.preoperative-nutrition.b-oral-inadequate": "batch2b-round2",
  // END BATCH2B REVIEW2 HEADERS 20261105
  "case.gs028c.dcis.a-one-mm-individualize": "flags-round3",
  "case.gs028e.mis-principles.c2-different-phases": "flags-round3",
  "case.gs028c.acute-cholecystitis.a-persistent-suspicion": "flags-round3",
  "case.gs028.varicose-veins.b-limited-mobility": "flags-round3",
  "case.gs028f.neck-mass.c2-completed-needle-record": "flags-round3",
  "case.gs028c.dcis.b-oncoplastic-mapping": "flags-round3",
  "case.gs028se.p2e.perioperative-dnr.v4.perianal-abscess": "flags-round3",
  "case.gs028e.mis-principles.c2-early-central-filling": "flags-round3",
  "case.gs028c.palpable-breast.b-surgeon-discordance": "flags-round3",
  "case.achalasia.night-regurgitation": "flags3-accepted",
  "case.pigmented-skin-lesion.forearm-change": "batch2a-round3",
  "case.gs028se.pdsa-act-qi-measures.a-abandon-harm": "batch2a-round3",
  "case.adrenal-incidentaloma.small-adrenal-adenoma": "batch2a-round3",
  "case.n1.controlled-enterotomy-mesh.v1": "n1-round3",
  "case.n1.celiac-iga-deficiency.v1": "n1-round3",
  "case.n1.hcc-portal-hypertension.v1": "n1-round3",
  "case.n1.gastroparesis-obstruction.v1": "n1-round3",
  "case.n1.breast-mass-morphology.v1": "n1-round3",
  "case.n1.breast-calcification.v1": "n1-round3",
  "case.n1.breast-thirties-imaging.v1": "n1-round3",
  "case.n1.phyllodes-negative-axilla.v1": "n1-round3",
  "case.n1.phyllodes-spread.v1": "n1-round3",
  "case.n1.mixing-study-followup.v1": "n1-round3",
  "case.n1.lymphedema-new-swelling.v1": "n1-round3",
  "case.n1.vka-vitamin-k.v1": "n1-round3",
  "case.n2.sglt2-postoperative-restart.v1": "catalog",
  "case.n2.burn-feeding-perfusion-prerequisite.v1": "catalog",
  "case.n2.dialysis-isocaloric-protein-adjustment.v1": "catalog",
  "case.n2.af-bridging-versus-surgical-prophylaxis.v1": "catalog",
  "case.n2.bile-leak-duct-continuity-boundary.v1": "catalog",
  "case.n2.ercp-versus-gallbladder-source.v1": "catalog",
  "case.n2.hpylori-antibody-after-valid-cure-test.v1": "catalog",
  "case.n2.malignant-polyp-local-versus-regional-risk.v1": "catalog",
  "case.n2.operative-wound-class-versus-later-ssi.v1": "catalog",
  "case.n2.ventral-hernia-priority-change.v1": "catalog",
  "case.n2.negative-predictive-value-denominator.v1": "catalog",
  "case.n2.positive-likelihood-ratio.v1": "catalog",
  "case.n2.mcnemar-paired-binary-outcomes.v1": "catalog",
  "case.n2.equivalence-margin-versus-null-test.v1": "catalog",

    "case.gs028d.acid-base.b-cirrhosis-gap": "owner-decisions-batch8",
    "case.gs028d.acid-base.b-sepsis-recovery-gap": "owner-decisions-batch8",
    "case.owner-decisions.20261112.mh-medication": "owner-decisions-batch8",
    "case.gs028f.gynecology.c1-late-period": "owner-decisions-batch8",
    "case.topic.perioperative-risk-recovery.awake-gas.v3": "owner-decisions-batch8",
    "case.gs028b.ptld.b-pathology-returned": "owner-decisions-batch8",


  "case.intraop.anesthetic-intraoperative-crises.mh-electrolyte.v1": "intraop-batch9-anesthetic-intraoperative-crises",
  "case.intraop.endoscopic-perforation-and-injury.postclip-hospital-record.v1": "intraop-batch9-endoscopic-perforation-and-injury",
  "case.intraop.ercp-access-and-adverse-events.periampullary-injury-course.v1": "intraop-batch9-ercp-access-and-adverse-events",
  "case.intraop.ercp-access-and-adverse-events.pancreatic-protection.v1": "intraop-batch9-ercp-access-and-adverse-events",
  "case.intraop.groin-hernia.sliding-sac.20261112.v1": "intraop-batch9-groin-hernia-anatomy-and-injury",
  "case.intraop.groin-hernia.urinary-findings.20261112.v1": "intraop-batch9-groin-hernia-anatomy-and-injury",
  "case.intraop.lap-access.outside-access-rescue.20261112.v1": "intraop-batch9-laparoscopic-access-and-insufflation",
  "case.intraop.operative-hemorrhage.posterior-liver-record.20261112.v1": "intraop-batch9-operative-hemorrhage-and-splenic-injury",
  "case.intraop.i25.unmapped-narrowing.20261112.v1": "intraop-batch9-pediatric-egd-food-impaction-eoe",
  "case.intraop.i24.battery-injury-record.20261112.v1": "intraop-batch9-pediatric-endoscopy-foreign-body",
  "case.intraop.thyroid-nerve-monitoring.distal-response-coverage.v1": "intraop-batch9-thyroid-nerve-monitoring",
  "case.intraop.thyroid-nerve-monitoring.two-signal-events.v1": "intraop-batch9-thyroid-nerve-monitoring",
  "case.intraop.unexpected-bowel.base-margin.20261112.v1": "intraop-batch9-unexpected-appendix-and-bowel-findings",
  "case.intraop.unexpected-bowel.ileitis-restraint.20261112.v1": "intraop-batch9-unexpected-appendix-and-bowel-findings"

,

  "case.intraop.asc-access.port-course.20261112.v1": "intraop-batch10-asc-access-and-soft-tissue-surprises",
  "case.intraop.biliary-safety.new-bile.20261112.v1": "intraop-batch10-biliary-safety-and-duct-decisions",
  "case.intraop.biliary-safety.stone-clearance.20261112.v1": "intraop-batch10-biliary-safety-and-duct-decisions",
  "case.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1": "intraop-batch10-endoscopic-perforation-and-injury",
  "case.intraop.endoscopic-perforation-and-injury.dilation-observed-defect.v1": "intraop-batch10-endoscopic-perforation-and-injury",
  "case.intraop.suspicious-polyps.new-descending-colon-focus.20261112.v1": "intraop-batch10-suspicious-polyps-retrieval-and-tattoo",
  "case.intraop.anesthetic-intraoperative-crises.anaphylaxis-response-salvage.v1": "intraop-batch10-anesthetic-intraoperative-crises",
  "case.intraop.upper-gi-hemostasis.esophageal-variceal-record.20261112-salvage.v1": "intraop-batch10-endoscopic-upper-gi-hemostasis",
  "case.intraop.pediatric-anesthesia-events.egd-airway-salvage.v1": "intraop-batch10-pediatric-anesthesia-events",
  "case.intraop.pediatric-anesthesia-events.hernia-airflow-salvage.v1": "intraop-batch10-pediatric-anesthesia-events",
  "case.intraop.pediatric-orchiopexy.inguinal-descent.20261112-salvage.v1": "intraop-batch10-pediatric-orchiopexy-findings"

,

  "case.intraop.anorectal-eua.crohn-checkpoints.20261112-salvage.v1": "intraop-batch11-anorectal-eua-and-fistula",
  "case.intraop.parathyroid.missing-gland-salvage.v1": "intraop-batch11-parathyroid-localization-and-preservation",
  "case.intraop.parathyroid.gland-preservation-salvage.v1": "intraop-batch11-parathyroid-localization-and-preservation",
  "case.intraop.polypectomy.ascending-emr-completion.20261112-salvage.v1": "intraop-batch11-polypectomy-technique-and-bleeding"

} as Record<string,string>,
} as const;

