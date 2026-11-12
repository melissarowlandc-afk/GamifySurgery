import { QUESTION_NEW_N2_ROUND3_NEW_CONCEPT_VERSIONS } from "@gamify-surgery/clinical-content";
import { QUESTION_NEW_N1_ROUND3_NEW_CONCEPT_VERSIONS } from "@gamify-surgery/clinical-content";
import { QUESTION_FLAG_TESTED_CONCEPTS, QUESTION_FLAG_ROUND2_TESTED_CONCEPTS, QUESTION_FLAG_ROUND3_TESTED_CONCEPTS } from "@gamify-surgery/clinical-content";
import { QUESTION_NEW_N1_TESTED_CONCEPTS, QUESTION_NEW_N2_TESTED_CONCEPTS } from "@gamify-surgery/clinical-content";
import { QUESTION_NEW_N1_ROUND2_NEW_CONCEPT_VERSIONS } from "@gamify-surgery/clinical-content";
import { describe, expect, it } from "vitest";
import { QUESTION_NEW_N2_ROUND2_NEW_CONCEPT_VERSIONS } from "@gamify-surgery/clinical-content";
import { QUESTION_QUALITY_ADVERSARIAL_R7_TESTED_CONCEPTS, QUESTION_QUALITY_ADVERSARIAL_R6_TESTED_CONCEPTS, QUESTION_QUALITY_ADVERSARIAL_R5_TESTED_CONCEPTS, QUESTION_QUALITY_ADVERSARIAL_R4_TESTED_CONCEPTS, GS028_20261007_LEVEL3_TESTED_CONCEPTS, GS028_20261007_VARIETY2_TESTED_CONCEPTS, PEDIATRIC_CLINIC_TESTED_CONCEPTS, PEDIATRIC_CLINIC_BATCH_MANIFEST, VARIETY3_TESTED_CONCEPTS } from "@gamify-surgery/clinical-content";
import { BOARD_EXPANSION_20260912_TESTED_CONCEPTS, BOARD_EXPANSION_TESTED_CONCEPTS, BREAD_BUTTER_20260917_TESTED_CONCEPTS, BRIEF_EARLY_LEVELS_20260917_TESTED_CONCEPTS, EARLY_LEVELS_20260913_TESTED_CONCEPTS, GS028_20260928_TESTED_CONCEPTS, GS028_20260929_TESTED_CONCEPTS, GS028_20261002_TESTED_CONCEPTS, GS028_20261003_TESTED_CONCEPTS, GS028_20261007_TESTED_CONCEPTS, GS028_STATS_ETHICS_20260929_TESTED_CONCEPTS, LEVEL_TWO_RUNTIME_CONCEPTS, SURGERY_CENTER_TESTED_CONCEPTS, TWENTY_CONCEPT_BATCH_CONCEPTS } from "@gamify-surgery/clinical-content";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getEligibleServiceRoute,
  patientRosterEntryById,
  patientVisualAgeBand,
  serializeGameState,
} from "../src";

function emptyLevelOne(seed: string) {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.${seed}`,
    campaignSeed: seed,
    createdAtRealMs: 0,
  });
  state.facilityLevel = 1;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  return state;
}

describe("approved clinical admission boundaries", () => {
  it("provides the approved off-site ultrasound route as centralized simulation timing", () => {
    expect(
      getEligibleServiceRoute(
        emptyLevelOne("ultrasound-route"),
        "service.ultrasound",
      ),
    ).toMatchObject({
      service: {
        id: "service.ultrasound",
        displayName: "Ultrasound",
      },
      route: {
        id: "route.ultrasound.outsourced",
        displayName: "Off-site ultrasound",
      },
      timing: {
        serviceDurationTicks: 150,
        durationTicks: 150,
      },
    });
  });

  it("provides centralized off-site diagnostic breast-imaging timing", () => {
    expect(
      getEligibleServiceRoute(
        emptyLevelOne("diagnostic-breast-imaging-route"),
        "service.diagnostic_breast_imaging",
      ),
    ).toMatchObject({
      service: {
        id: "service.diagnostic_breast_imaging",
        displayName: "Diagnostic breast imaging",
      },
      route: {
        id: "route.diagnostic_breast_imaging.outsourced",
        displayName: "Off-site diagnostic breast imaging",
      },
      timing: {
        serviceDurationTicks: 120,
        durationTicks: 120,
      },
    });
  });

  it("withholds the painful-cyst iteration until the Minor Procedure capability exists", () => {
    const caseId = "case.breast-cyst.under-30-painful-simple";
    let state = emptyLevelOne("painful-cyst-capability");
    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "painful-cyst.without-room",
      encounterId: "encounter.painful-cyst.without-room",
      caseId,
      patientDisplayName: "Capability Test Patient",
      arrivalClass: "routine",
    });
    expect(
      state.encounters["encounter.painful-cyst.without-room"],
    ).toBeUndefined();
    expect(
      state.operationReceipts["painful-cyst.without-room"],
    ).toMatchObject({
      status: "rejected",
      message:
        "This patient requires unavailable clinic capability capability.minor_procedure.",
    });

    state.rooms.push({
      id: "room.test.minor-procedure",
      roomDefinitionId: "room.minor_procedure",
      x: 30,
      y: 28,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    });
    state.doors.push({
      id: "door.test.minor-procedure",
      roomId: "room.test.minor-procedure",
      side: "east",
      offset: 1,
      exterior: false,
    });
    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "painful-cyst.with-room",
      encounterId: "encounter.painful-cyst.with-room",
      caseId,
      patientDisplayName: "Capability Test Patient",
      arrivalClass: "routine",
    });

    expect(
      state.operationReceipts["painful-cyst.with-room"],
    ).toMatchObject({
      status: "applied",
    });
    expect(
      state.encounters["encounter.painful-cyst.with-room"]?.frozenCase,
    ).toMatchObject({
      id: caseId,
      releasePointId: "release.l1.minor_procedure",
      requiredCapabilityIds: ["capability.minor_procedure"],
    });
  });

  it("withholds an approved Level 2 endoscopy case before Level 2 and before its required capability", () => {
    const caseId = "case.l2.colonic-lipoma.direct.typical-b";
    let state = emptyLevelOne("level-two-clinical-gate");
    state = gameReducer(state, {
      type: "ADMIT_PATIENT", operationId: "l2.before-stage", encounterId: "encounter.l2.before-stage",
      caseId, patientDisplayName: "Level Two Test Patient", arrivalClass: "routine",
    });
    expect(state.operationReceipts["l2.before-stage"]?.message).toBe("This patient becomes eligible at Level 2.");

    state.facilityLevel = 2;
    state = gameReducer(state, {
      type: "ADMIT_PATIENT", operationId: "l2.without-capability", encounterId: "encounter.l2.without-capability",
      caseId, patientDisplayName: "Level Two Test Patient", arrivalClass: "routine",
    });
    expect(state.operationReceipts["l2.without-capability"]?.message).toBe(
      "This patient requires unavailable clinic capability capability.endoscopy.",
    );
  });

  it("keeps the unapproved prototype runtime release limited to explicitly admitted concepts", () => {
    expect(
      PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts.map(
        (concept) => concept.id,
      ),
    ).toEqual([
      "concept.ventral-hernia.elective-pulmonary-optimization",
      "concept.breast-mass.under-30-initial-ultrasound",
      "concept.breast-cyst.asymptomatic-simple-observation",
      "concept.breast-cyst.symptomatic-simple-aspiration",
      "concept.ebv.associated-malignancy-recognition",
      "concept.hcc.milan-transplant-evaluation",
      "concept.mondor-disease.clinical-recognition",
      "concept.mondor-disease.selective-imaging-evaluation",
      "concept.mondor-disease.supportive-management",
      "concept.aaa.female-sex-associated-perioperative-mortality",
      "concept.desmoid.initial-active-surveillance",
      "concept.desmoid.progressing-abdominal-wall-surgical-option",
      "concept.pancreatic-tail-adenocarcinoma.distal-pancreatectomy-with-splenectomy",
      "concept.felty-syndrome.recognition",
      "concept.felty-syndrome.methotrexate-first-line",
      "concept.felty-syndrome.splenectomy-for-refractory-infections",
      "concept.fhh.biochemical-evaluation",
      "concept.fhh.recognition-and-confirmation",
      "concept.fhh.avoid-parathyroid-surgery",
      "concept.lymphangitis.acute-clinical-recognition",
      "concept.gallbladder-polyp.initial-management-category",
      "concept.distal-cholangiocarcinoma.resection-selection",
      "concept.obstructive-jaundice.vitamin-k-coagulopathy",
      "concept.hcc.compensated-cirrhosis-resection-selection",
      "concept.accessory-spleen.common-location",
      "concept.hereditary-spherocytosis.postsplenectomy-persistent-hemolysis-evaluation",
      "concept.hereditary-spherocytosis.confirmed-accessory-spleen-management",
      "concept.ipaa.pouchitis-common-post-ipaa-complication",
      "concept.choledochal-cyst.type-iva-combined-duct-dilation",
      "concept.anal-hsil.high-risk-hpv-association",
      "concept.men2a.core-manifestation-pattern",
      "concept.men2a.pheochromocytoma-precedes-thyroid-intervention",
      "concept.pheochromocytoma.alpha-before-beta-blockade",
      ...LEVEL_TWO_RUNTIME_CONCEPTS.map((concept) => concept.id).filter(
        (id) => id !== "concept.distal-cholangiocarcinoma.resection-selection",
      ),
      ...TWENTY_CONCEPT_BATCH_CONCEPTS.map((concept) => concept.id),
      ...SURGERY_CENTER_TESTED_CONCEPTS.map((concept) => concept.id),
      ...BOARD_EXPANSION_TESTED_CONCEPTS.map((concept) => concept.id),
      ...BOARD_EXPANSION_20260912_TESTED_CONCEPTS.map((concept) => concept.id),
      ...EARLY_LEVELS_20260913_TESTED_CONCEPTS.map((concept) => concept.id),
      ...BRIEF_EARLY_LEVELS_20260917_TESTED_CONCEPTS.map((concept) => concept.id),
      ...BREAD_BUTTER_20260917_TESTED_CONCEPTS.map((concept) => concept.id),
      ...GS028_20260928_TESTED_CONCEPTS.map((concept) => concept.id),
      ...GS028_20260929_TESTED_CONCEPTS.map((concept) => concept.id),
      ...GS028_STATS_ETHICS_20260929_TESTED_CONCEPTS.map((concept) => concept.id),
      ...GS028_20261002_TESTED_CONCEPTS.map((concept) => concept.id),
      ...GS028_20261003_TESTED_CONCEPTS.map((concept) => concept.id),
      ...GS028_20261007_TESTED_CONCEPTS.map((concept) => concept.id),
      ...GS028_20261007_VARIETY2_TESTED_CONCEPTS.map((concept) => concept.id),
      ...GS028_20261007_LEVEL3_TESTED_CONCEPTS.map((concept) => concept.id),
      ...PEDIATRIC_CLINIC_TESTED_CONCEPTS.filter(concept => !PEDIATRIC_CLINIC_BATCH_MANIFEST.reusedConceptIds.includes(concept.id)).map(concept => concept.id),
      ...VARIETY3_TESTED_CONCEPTS.map(concept => concept.id),
      ...QUESTION_QUALITY_ADVERSARIAL_R4_TESTED_CONCEPTS.map(concept => concept.id),
      ...QUESTION_QUALITY_ADVERSARIAL_R5_TESTED_CONCEPTS.map(concept => concept.id),
      ...QUESTION_QUALITY_ADVERSARIAL_R6_TESTED_CONCEPTS.map(concept => concept.id),
      ...QUESTION_QUALITY_ADVERSARIAL_R7_TESTED_CONCEPTS.map(concept => concept.id),
      ...QUESTION_FLAG_TESTED_CONCEPTS.map(concept => concept.id),
      ...QUESTION_FLAG_ROUND2_TESTED_CONCEPTS.map(concept => concept.id),
      "concept.achalasia.physiology-directed-treatment.v1",
      "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v5",
      ...QUESTION_FLAG_ROUND3_TESTED_CONCEPTS.map(concept => concept.id),
      ...QUESTION_NEW_N1_TESTED_CONCEPTS.map(concept => concept.id),
      ...QUESTION_NEW_N2_TESTED_CONCEPTS.map(concept => concept.id),
      // Six changed scored objectives; old cards and definitions remain admitted.
      "concept.achalasia.secondary-junction-lesion-assessment.v1",
      "concept.esophageal-physiology.reserve-before-junction-intervention.v1",
      "concept.groin-ultrasound.symptom-provocation-protocol.v1",
      "concept.groin-hernia.femoral-defect-repair-priority.v1",
      "concept.quality-improvement.source-by-method-next-pilot.v1",
      "concept.adrenal-incidentaloma.cortisol-etiologic-classification.v1",
      // Batch 2a final round: materially changed scores, with old histories retained.
      "concept.esophageal-physiology.reserve-acquisition-integrity.v1",
      "concept.esophageal-physiology.integrated-pressure-report.v2",
      "concept.inguinal-hernia.recurrence-after-anterior-repair.v1",
      "concept.groin-ultrasound.proximal-neck-localization.v2",
      "concept.adrenal-incidentaloma.acth-directed-source-imaging.v2",
      // N1 round two retains 32 meanings and appends only six materially changed constructs.
      ...QUESTION_NEW_N1_ROUND2_NEW_CONCEPT_VERSIONS.map(concept => concept.id),
        // Batch 2b: new scored constructs remain drafts; prior histories persist.
        "concept.hyperacute-rejection.event-and-compatibility-review.v1",
        "concept.dtc.representative-node-target-and-assay.v1",
        "concept.palpable-breast.site-concordant-imaging.v1",
        "concept.perianal-abscess.source-control-and-antibiotic-selection.v1",
        "concept.immunology.graft-evidence-to-review-focus.v1",
        "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
        "concept.preoperative-nutrition.risk-before-route-selection.v1",
      // N2 round two: draft versions, without transfer/reset of prior histories.
      ...QUESTION_NEW_N2_ROUND2_NEW_CONCEPT_VERSIONS.map(concept => concept.id),
      // N1 round three: 17 separate changed meanings; earlier histories are retained.
      ...QUESTION_NEW_N1_ROUND3_NEW_CONCEPT_VERSIONS.map(concept => concept.id),
      ...QUESTION_NEW_N2_ROUND3_NEW_CONCEPT_VERSIONS.map((concept) => concept.id),
      // Exact five accepted N3 meanings precede the retained batch 2b registry.
      "concept.n3.bilateral-carotid-symptom-attribution",
      "concept.n3.postsplenectomy-nodule-function-before-targeting",
      "concept.n3.dysphagia-biopsy-territory-after-negative-endoscopy",
      "concept.n3.tumor-screen-versus-family-test-sequence.v2",
      "concept.n3.gastric-lymphoma-new-large-cell-process.v2",
      // Manager-accepted batch 2b / G06 meanings; exact inventory additions.
      "concept.transplant.class-ii-crossmatch-target-and-window.v1",
      "concept.breast.inflammatory-phenotype-after-neoadjuvant-response.v1",
      "concept.mesenteric-ischaemia.post-revascularization-bowel-staging.v1",
      "concept.dialysis-access.symptomatic-central-outflow-assessment.v1",
      "concept.postoperative-delirium.benzodiazepine-withdrawal-exception.v1",
      "concept.biliary-pancreatitis.local-complication-before-cholecystectomy.v1",
      "concept.cholecystectomy.subtotal-type-from-remnant-tissue.v1",
      "concept.diabetic-ketoacidosis.ongoing-insulin-substrate.v1",
      "concept.acid-base.euglycaemic-risk-with-mixed-gas.v1",
      "concept.anorectal-fistula.tract-and-transplant-host-plan.v1",
      "concept.anorectal-fistula.function-before-low-tract-division.v1",
      "concept.nutrition.gastric-versus-postpyloric-delivery.v1",
      "concept.predictive-value.collection-population-denominator.v1",
      "concept.palpable-breast.completed-imaging-clinical-target.v1",
      "concept.phpt.inherited-calcium-before-localization.v2",
        // Flags3: the separately scored, manager-accepted anatomical objective.
        "concept.groin-hernia.ultrasound-compartment-classification.v1",
      "concept.gs028f.nutrition.refeeding-insulin-phosphate-shift.v2",
      "concept.n3.delayed-regurgitation-proximal-anatomic-study",
      "concept.n4r2.mesh-material-and-contact-compartment",
      "concept.n4r2.cholangiogram-quality-before-duct-treatment",
      "concept.small-bowel-obstruction.urgent-surgical-escalation.v2",
      "concept.small-bowel-obstruction-ileus.nonoperative-eligibility.v1",
      "concept.critical-renal-organ-support.citrate-bleeding-circuit.v1",
      "concept.critical-renal-organ-support.trial-off-crrt.v1",
      "concept.critical-shock-resuscitation.choose-valid-fluid-test.v1",
      "concept.critical-shock-resuscitation.response-versus-fluid-risk.v1",
      "concept.critical-shock-resuscitation.echo-for-persistent-shock.v2",
      "concept.appendix-appendicitis.low-grade-peritoneal-disease-referral.v1",
      "concept.appendix-appendicitis.goblet-cell-adenocarcinoma-resection.v1",
      "concept.appendix-appendicitis.large-net-regional-resection.v1",
      "concept.topic.trauma-initial-abdomen.equivocal-bowel-inpatient-observation",
      "concept.topic.trauma-initial-abdomen.evolving-bowel-repeat-ct",
      "concept.topic.trauma-initial-abdomen.persistent-pelvic-bleeding-packing",
      "concept.topic.trauma-initial-abdomen.pelvic-arterial-rescue-embolization",
      "concept.topic.trauma-initial-abdomen.traumatic-bladder-retrograde-cystography",
      "concept.topic.trauma-initial-abdomen.complicated-extraperitoneal-bladder-repair.v2",
      "concept.topic.trauma-initial-abdomen.distal-pancreatic-duct-transection-resection",
      "concept.topic.trauma-initial-abdomen.contained-zone-two-hematoma-preservation",
      "concept.topic.trauma-initial-abdomen.mesenteric-devascularization-reconstruction.v2",
      "concept.critical-respiratory-ventilation.expiratory-time.v1",
      "concept.critical-respiratory-ventilation.postextubation-rescue.v1",
      "concept.trauma-thoracic.bci-selective-imaging.v1",
      "concept.trauma-thoracic.bci-arrhythmia-echo.v1",
      "concept.trauma-thoracic.chest-drain-organ-trajectory.v1",
      "concept.trauma-thoracic.hemothorax-physiology-escalation.v1",
      "concept.trauma-thoracic.retained-hemothorax-vats.v1",
      "concept.trauma-thoracic.rib-fixation-failed-weaning.v1",
      "concept.vascular-aorta.type-i-endoleak-prompt-seal-repair.v1",
      "concept.vascular-aorta.retrograde-ascending-dissection-emergency-repair.v1",
      "concept.vascular-aorta.aortic-syndrome-vasodilation-after-rate-control.v1",
      "concept.vascular-aorta.tevar-lsa-lima-inflow-preservation.v1",
      "concept.vascular-aorta.post-tevar-spinal-cord-perfusion-rescue.v1",
      "concept.vascular-aorta.small-popliteal-aneurysm-embolic-repair.v1",
      "concept.vascular-aorta.popliteal-associated-aneurysm-survey-completeness.v1",
      "concept.vascular-aorta.aortic-graft-infection-bleeding-cross-sectional-evaluation.v1",
      "concept.vascular-aorta.marfan-intact-taaa-open-repair-selection.v1",
      "concept.topic.liver-malignancy.dynamic-acquisition.v1",
      "concept.topic.liver-malignancy.mixed-imaging-tissue-selection.v1",
      "concept.topic.liver-malignancy.hcc-vascular-pathway.v1",
      "concept.pancreas-chronic-cysts-neoplasia.borderline-venous-neoadjuvant-sequence.v1",
      "concept.pancreas-chronic-cysts-neoplasia.neoadjuvant-obstructive-jaundice-stent.v1",
      "concept.pancreas-chronic-cysts-neoplasia.postop-collection-source-control.v1",
      "concept.pancreas-chronic-cysts-neoplasia.serous-compressive-symptoms.v1",
      "concept.pancreas-chronic-cysts-neoplasia.ipmn-remnant-low-grade-followup.v1",
      "concept.esophagus-motility-achalasia.symptom-relief-with-limited-rescue-fitness.v1",
      "concept.esophagus-motility-achalasia.egjoo-corroboration.v1",
      "concept.esophagus-motility-achalasia.complementary-flip-after-acquisition-failure.v1",
      "concept.esophagus-motility-achalasia.borderline-relaxation-aperistalsis.v1",
      "concept.topic.esophagus-gerd-barrett-hiatal.negative-reflux-medication.v1",
      "concept.topic.esophagus-gerd-barrett-hiatal.irregular-z-surveillance-boundary.v1",
      "concept.topic.esophagus-gerd-barrett-hiatal.symptomatic-hernia-anemia.v1",
      "concept.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
      "concept.topic.esophagus-gerd-barrett-hiatal.surveillance-sampling-adequacy.v1",
      "concept.topic.esophagus-gerd-barrett-hiatal.limited-negative-sampling.v1",
      "concept.surgical-infection-antibiotics.postdrain-systemic-indication.v1",
      "concept.surgical-infection-antibiotics.culture-directed-narrowing.v1",
      "concept.surgical-infection-antibiotics.anaerobic-coverage-after-aerobic-culture.v2",
      "concept.surgical-infection-antibiotics.invasive-candida-initial-therapy.v2",
      "concept.surgical-infection-antibiotics.old-drain-culture-interpretation.v1",
      "concept.colon-diverticular-lower-bleeding.abscess-source-control.v1",
      "concept.colon-diverticular-lower-bleeding.failed-source-control-operation.v1",
      "concept.colon-diverticular-lower-bleeding.emergency-reconstruction.v1",
      "concept.colon-diverticular-lower-bleeding.immunosuppressed-antibiotic-eligibility.v1",
      "concept.colon-diverticular-lower-bleeding.ongoing-bleeding-localization.v1",
      "concept.colon-diverticular-lower-bleeding.embolization-selection.v1",
      "concept.colon-diverticular-lower-bleeding.localized-bleeding-resection.v1",
      "concept.colon-diverticular-lower-bleeding.secondary-prevention-aspirin.v1",
      "concept.colon-diverticular-lower-bleeding.angioectasia-hemostasis.v1",
      "concept.topic.trauma-head-spine-extremities.acute-sdh-evacuation.v1",
      "concept.topic.trauma-head-spine-extremities.limb-vascular-imaging.v1",
      "concept.topic.trauma-head-spine-extremities.limb-shunt-before-fixation.v1",
      "concept.topic.statistics.post-test-probability.v1",
      "concept.topic.statistics.incidence-proportion.v1",
      "concept.topic.statistics.person-time-rate.v1",
      "concept.topic.statistics.point-prevalence.v1",
      "concept.topic.statistics.standard-error.v1",
      "concept.topic.statistics.sample-size-effect.v1",
      "concept.topic.statistics.intention-to-treat.v1",
      "concept.topic.statistics.allocation-concealment.v1",
      "concept.topic.statistics.multiplicity.v1",
      "concept.topic.statistics.effect-modification.v1",
      "concept.topic.statistics.right-censoring.v1",
      "concept.topic.statistics.kaplan-meier-step.v1",
      "concept.topic.statistics.lead-time-bias.v1",
      "concept.topic.statistics.logistic-model.v1",
      "concept.topic.statistics.length-time-bias.v1",
      "concept.pancreas-acute-pancreatitis.volume-overload-fluid-reassessment.v1",
      "concept.pancreas-acute-pancreatitis.refractory-compartment-decompression.v1",
      "concept.pancreas-acute-pancreatitis.necrosis-no-prophylactic-antibiotics.v1",
      "concept.pancreas-acute-pancreatitis.ileus-parenteral-support.v1",
      "concept.pancreas-acute-pancreatitis.gastric-intolerance-postpyloric-feeding.v1",
      "concept.pancreas-acute-pancreatitis.moderate-crystalloid-resuscitation.v1",
      "concept.pancreas-acute-pancreatitis.responsive-infected-necrosis-delay.v1",
      "concept.pancreas-acute-pancreatitis.early-infected-necrosis-source-control.v1",
      "concept.pancreas-acute-pancreatitis.adequate-drainage-failure-necrosectomy.v1",
      "concept.bowel-ibd-malabsorption-short-bowel.crohn-abscess-source-control.v1",
      "concept.bowel-ibd-malabsorption-short-bowel.crohn-persistent-fistula-stenosis.v1",
      "concept.bowel-ibd-malabsorption-short-bowel.crohn-multifocal-strictureplasty.v1",
      "concept.bowel-ibd-malabsorption-short-bowel.uc-completely-resected-visible-dysplasia.v1",
      "concept.bowel-ibd-malabsorption-short-bowel.crohn-postresection-endoscopy.v1",
      "concept.bowel-ibd-malabsorption-short-bowel.small-bowel-gist-resection-principles.v2",
      "concept.bowel-ibd-malabsorption-short-bowel.uc-severe-initial-colectomy.v1",
      "concept.bowel-ibd-malabsorption-short-bowel.pouch-nonresponse-endoscopic-assessment.v1",
      "concept.topic.fluids-electrolytes-acid-base.hyponatraemia-loss-replacement.v1",
      "concept.topic.fluids-electrolytes-acid-base.siad-fluid-plan.v1",
      "concept.topic.fluids-electrolytes-acid-base.gastric-chloride-replacement.v1",
      "concept.topic.fluids-electrolytes-acid-base.dka-potassium-sequence.v2",
      "concept.topic.fluids-electrolytes-acid-base.dka-resolution-transition.v1",
      "concept.topic.fluids-electrolytes-acid-base.hhs-tonicity-response.v1",
      "concept.topic.hematology-transfusion-coagulation.vka-factor-replacement.v2",
      "concept.topic.hematology-transfusion-coagulation.transfusion-calcium.v2",
      "concept.topic.hematology-transfusion-coagulation.platelet-product.v2",
      "concept.topic.hematology-transfusion-coagulation.taco-next-transfusion.v1",
      "concept.topic.hematology-transfusion-coagulation.antigen-compatible-rbc.v1",
      "concept.topic.hematology-transfusion-coagulation.hit-initial-action.v1",
      "concept.topic.hematology-transfusion-coagulation.hit-functional-confirmation.v2",
      "concept.topic.hematology-transfusion-coagulation.vwd-major-plan.v2",
      "concept.itp.changed-lineage-pattern-before-treatment.v1",
      "concept.topic.hematology-transfusion-coagulation.cholestasis-correction.v1",
      "concept.topic.parathyroid-calcium.cortical-operative-criterion.v1",
      "concept.topic.parathyroid-calcium.nonlocalizing-operative-candidacy.v1",
      "concept.topic.parathyroid-calcium.suspected-carcinoma-operative-extent.v1",
      "concept.topic.parathyroid-calcium.normocalcemic-postoperative-pth.v1",
      "concept.topic.parathyroid-calcium.renal-refractory-surgical-assessment.v1",
      "concept.topic.parathyroid-calcium.bone-treatment-eligibility.v2",
      "concept.topic.parathyroid-calcium.iopth-protocol-baseline.v1",
      "concept.nutrition-support-metabolism.severe-risk-operative-timing.v1",
      "concept.n3.swallowing-failure-versus-intestinal-failure",
      "concept.nutrition-support-metabolism.zinc-associated-copper-evaluation.v1",
      "concept.nutrition-support-metabolism.long-term-enteral-access-selection.v1",
      "concept.nutrition-support-metabolism.enteral-diarrhea-medication-formulation.v1",
      "concept.nutrition-support-metabolism.postoperative-oral-intake-tolerance.v1",
      "concept.nutrition-support-metabolism.renal-formula-energy-protein-volume.v1",
      "concept.mesenteric-ischaemia.venous-thrombosis-initial-pathway.v1",
      "concept.vascular-limb-mesenteric-arterial.common-femoral-profunda-preservation.v1",
      "concept.vascular-limb-mesenteric-arterial.multilevel-rest-pain-inflow-first.v1",
      "concept.vascular-limb-mesenteric-arterial.functional-response-over-abi.v1",
      "concept.vascular-limb-mesenteric-arterial.pad-anticoagulation-indication.v2",
      "concept.stomach-ulcer-bleeding-motility.emptying-acquisition-confounding.v1",
      "concept.stomach-ulcer-bleeding-motility.prokinetic-after-dystonia.v1",
      "concept.stomach-ulcer-bleeding-motility.aspirin-secondary-prevention-after-bleed.v1",
      "concept.stomach-ulcer-bleeding-motility.suspected-perforation-imaging.v1",
      "concept.stomach-ulcer-bleeding-motility.unstable-perforation-operative-access.v1",
      "concept.stomach-ulcer-bleeding-motility.postgastrectomy-late-dumping-treatment.v1",
      "concept.stomach-ulcer-bleeding-motility.hp-salvage-after-optimized-bqt.v1",
      "concept.topic.adrenal-men-endocrine.avs-contralateral-nodule.v1",
      "concept.topic.adrenal-men-endocrine.avs-technical-failure.v1",
      "concept.n3.hereditary-thyroid-adrenal-operative-order",
      "concept.topic.adrenal-men-endocrine.indeterminate-growth-action.v1",
      "concept.topic.adrenal-men-endocrine.benign-imaging-followup.v1",
      "concept.topic.adrenal-men-endocrine.confirm-cortisol-autonomy.v1",
      "concept.topic.adrenal-men-endocrine.unilateral-overt-cortisol.v1",
      "concept.topic.adrenal-men-endocrine.post-cortisol-replacement.v1",
      "concept.topic.adrenal-men-endocrine.bilateral-pa-medical.v1",
      "concept.topic.adrenal-men-endocrine.acc-treatment-sequence.v2",
      "concept.topic.breast-cancer.initial-bulky-nodal-boundary.v1",
      "concept.n4r2.lumpectomy-target-marker-reconciliation",
      "concept.topic.breast-cancer.invasive-component-margin.v1",
      "concept.topic.breast-cancer.residual-invasive-her2-adjuvant.v1",
      "concept.topic.breast-cancer.biology-treatment-sequence.v1",
      "concept.topic.melanoma-cutaneous-cancer.microscopic-positive-sln-observation.v1",
      "concept.topic.melanoma-cutaneous-cancer.node-negative-high-risk-adjuvant.v1",
      "concept.topic.melanoma-cutaneous-cancer.breslow-excision-margin.v1",
      "concept.gallbladder-duct-stones.persistent-suspicion-after-mrcp.v1",
      "concept.gallbladder-duct-stones.postoperative-antibiotic-boundary.v1",
      "concept.gallbladder-duct-stones.cholangitis-unstable-intervention-extent.v1",
      "concept.gallbladder-duct-stones.papillary-dilation-distal-stricture-boundary.v1",
      "concept.gallbladder-duct-stones.symptomatic-remnant-anatomy.v1",
      "concept.gallbladder-duct-stones.mirizzi-anatomy-before-intervention.v1",
      "concept.gallbladder-duct-stones.cholangitis-anticoagulated-drainage-extent.v1",
      "concept.gallbladder-duct-stones.early-window-beyond-seventy-two-hours.v1",
      "concept.cholecystitis.source-control-during-active-cardiac-event.v1",
      "concept.gallbladder-duct-stones.failed-clearance-temporary-drainage.v1",
      "concept.gallbladder-duct-stones.stent-recurrent-obstructive-infection.v1",
      "concept.groin-hernia.femoral-defect-repair-priority.v2",
      "concept.hernia-groin.small-contaminated-defect-repair.v1",
      "concept.n3.postrepair-pain-new-dynamic-finding",
      "concept.hernia-groin.acute-nonischemic-reduction.v1",
      "concept.hernia-groin.retropubic-history-repair-anesthesia.v1",
      "concept.critical-respiratory-ventilation.copd-planned-extubation.v1",
      "concept.critical-respiratory-ventilation.sbt-readiness.v1",
      "concept.critical-respiratory-ventilation.sbt-fio2.v1",
      "concept.critical-respiratory-ventilation.copd-niv.v1",
      "concept.critical-shock-resuscitation.inotrope-after-pressure-restored.v1",
      "concept.critical-shock-resuscitation.lactate-perfusion-discordance.v1",
      "concept.critical-shock-resuscitation.vasopressin-escalation.v1",
      "concept.critical-renal-organ-support.congestion-directed-oliguria.v1",
      "concept.critical-renal-organ-support.rrt-treatment-response.v1",
      "concept.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.v1",
      "concept.topic.trauma-initial-abdomen.posttraumatic-hepatic-pseudoaneurysm",
      "concept.topic.trauma-initial-abdomen.stable-renal-urinary-extravasation-observation",
      "concept.small-bowel-obstruction-ileus.contrast-prognostic-assessment.v2",
      "concept.appendix-appendicitis.persistent-pain-after-negative-imaging.v1",
      "concept.appendix-appendicitis.invasive-adenocarcinoma-nodal-resection.v1",
      "concept.appendix-appendicitis.suspicious-post-abscess-interval-resection.v1",
      "concept.vascular-aorta.expanding-evar-sac-source-reassessment.v1",
      "concept.vascular-aorta.persistent-static-renal-branch-obstruction-after-tevar.v1",
      "concept.vascular-aorta.stable-type-ii-endoleak-surveillance.v1",
      "concept.pancreas-chronic-cysts-neoplasia.chronic-duct-drainage-after-endoscopy.v1",
      "concept.pancreas-chronic-cysts-neoplasia.ipmn-high-risk-resection.v1",
      "concept.pancreas-chronic-cysts-neoplasia.mcn-size-symptom-resection.v1",
      "concept.pancreas-chronic-cysts-neoplasia.pnet-growth-formal-resection.v1",
      "concept.pancreas-chronic-cysts-neoplasia.postop-vomiting-secondary-complication-evaluation.v1",
      "concept.topic.hernia-ventral-abdominal-wall.primary-defect-symptom-attribution.v1",
      "concept.topic.hernia-ventral-abdominal-wall.controlled-entry-reinforcement-strategy.v1",
      "concept.topic.hernia-ventral-abdominal-wall.postrepair-fluid-sample-provenance.v1",
      "concept.topic.thyroid-nodules-cancer.suppressed-tsh-before-biopsy.v1",
      "concept.topic.thyroid-nodules-cancer.destructive-thyrotoxicosis-treatment.v1",
      "concept.topic.thyroid-nodules-cancer.ptc-central-dissection-selection.v1",
      "concept.topic.thyroid-nodules-cancer.aggressive-mass-tissue-before-resection.v1",
      "concept.topic.thyroid-nodules-cancer.invasive-dtc-contrast-map.v1",
      "concept.topic.thyroid-nodules-cancer.cyst-only-nondiagnostic-followup.v1",
      "concept.topic.thyroid-nodules-cancer.benign-cytology-us-discordance.v1",
      "concept.topic.thyroid-nodules-cancer.toxic-nodule-compression.v1",
      "concept.topic.thyroid-nodules-cancer.graves-preop-t3-control.v1",
      "concept.topic.thyroid-nodules-cancer.rising-tgab-negative-neck-imaging.v1",
      "concept.topic.thyroid-nodules-cancer.reoperative-lateral-field-extent.v1",
      "concept.topic.thyroid-nodules-cancer.sporadic-mtc-after-lobectomy.v1",
      "concept.topic.colorectal-polyps-cancer.fap-rectal-sparing-ira.v1",
      "concept.topic.colorectal-polyps-cancer.fap-poor-sphincter-end-stoma.v1",
      "concept.topic.colorectal-polyps-cancer.rectal-high-risk-tnt.v1",
      "concept.topic.colorectal-polyps-cancer.lesions-not-fragments.v1",
      "concept.topic.colorectal-polyps-cancer.advanced-adenoma-surveillance.v1",
      "concept.topic.colorectal-polyps-cancer.piecemeal-emr-surveillance.v1",
      "concept.topic.colorectal-polyps-cancer.large-polyp-expert-resection.v1",
      "concept.topic.colorectal-polyps-cancer.adherent-bladder-en-bloc.v2",
      "concept.topic.colorectal-polyps-cancer.asymptomatic-incurable-primary.v1",
      "concept.topic.colorectal-polyps-cancer.perforation-overrides-systemic-first.v2",
      "concept.topic.colorectal-polyps-cancer.serial-adenoma-surveillance.v1",
      "concept.perioperative-risk-recovery.beta-actual-exposure.v1",
      "concept.perioperative-risk-recovery.sglt2-euglycemic-infusion.v1",
      "concept.perioperative-risk-recovery.delirium-medication-risk.v1",
      "concept.perioperative-risk-recovery.postoperative-ultrasound-target-adequacy.v1",
      "concept.perioperative-risk-recovery.contrast-agent-attribution.v1",
      "concept.perioperative-risk-recovery.penicillin-severe-delayed-boundary.v1",
      "concept.perioperative-risk-recovery.aortic-valve-before-elective-surgery.v1",
      "concept.perioperative-risk-recovery.des-acs-elective-interruption.v1",
      "concept.anorectal-abscess.supralevator-origin-and-drainage.v1",
      "concept.topic.anorectal-benign-pelvic-floor.simple-fistulotomy-selection.v1",
      "concept.topic.anorectal-benign-pelvic-floor.combined-hemorrhoid-excision.v1",
      "concept.topic.anorectal-benign-pelvic-floor.long-prolapse-perineal-operation.v1",
      "concept.topic.anorectal-benign-pelvic-floor.outlet-biofeedback.v1",
      "concept.topic.anorectal-benign-pelvic-floor.horseshoe-source-control.v2",
      "concept.topic.anorectal-benign-pelvic-floor.snm-after-failed-repair.v1",
      "concept.topic.anorectal-benign-pelvic-floor.rectocele-repair-after-coordination.v1",
      "concept.topic.breast-benign-high-risk.fibroadenoma-growth-excision.v1",
      "concept.topic.breast-benign-high-risk.adh-target-and-method.v2",
      "concept.topic.breast-benign-high-risk.prevention-vte-menopause.v2",
      "concept.topic.breast-benign-high-risk.classic-lobular-concordant-observation.v1",
      "concept.topic.breast-benign-high-risk.lobular-discordant-target-excision.v1",
      "concept.topic.breast-benign-high-risk.pure-fea-concordant-observation.v1",
      "concept.topic.breast-benign-high-risk.cavity-core-concordance.v2",
      "concept.topic.breast-benign-high-risk.lactational-inflammatory-response.v2",
      "concept.n3.lactation-drain-contact-boundary",
      "concept.topic.burns-inhalation.resuscitation-clock-area.v1",
      "concept.topic.burns-inhalation.fluid-response-adjustment.v1",
      "concept.topic.burns-inhalation.thermal-chest-escharotomy.v1",
      "concept.topic.burns-inhalation.electrical-deep-compartment.v1",
      "concept.topic.burns-inhalation.mixed-smoke-antidote.v1",
      "concept.topic.burns-inhalation.regional-excision-plan.v1",
      "concept.topic.burns-inhalation.culture-versus-infection.v1",
      "concept.topic.burns-inhalation.thermal-limb-escharotomy.v1",
      "concept.topic.burns-inhalation.electrical-oliguria-volume-context.v1",
      "concept.topic.burns-inhalation.airway-debris-intervention.v1",
      "concept.topic.burns-inhalation.excision-bed-and-coverage.v1",
      "concept.topic.burns-inhalation.gastric-intolerance-after-recovery.v1",
      "concept.topic.anal-cancer.margin-adjuvant-selection.v1",
      "concept.topic.anal-cancer.inguinal-salvage.v1",
      "concept.topic.anal-cancer.metastatic-line-selection.v1",
      "concept.topic.anal-cancer.salvage-apr.v1",
      "concept.bariatric-metabolic.acute-rygb-ct-assessment.v1",
      "concept.bariatric-metabolic.rygb-pain-despite-negative-ct.v1",
      "concept.bariatric-metabolic.unstable-leak-source-control.v1",
      "concept.topic-soft-tissue-sarcoma-desmoid.biopsy-sample-correspondence.v1",
      "concept.topic-soft-tissue-sarcoma-desmoid.critical-structure-margin-context.v1",
      "concept.topic-soft-tissue-sarcoma-desmoid.unplanned-excision-bed-clearance.v1",
      "concept.topic-soft-tissue-sarcoma-desmoid.retroperitoneal-biopsy-heterogeneity.v2",
      "concept.topic-soft-tissue-sarcoma-desmoid.retroperitoneal-histotype-organ-preservation.v1",
      "concept.topic-soft-tissue-sarcoma-desmoid.desmoid-postoperative-r1-observation.v1",
      "concept.topic-soft-tissue-sarcoma-desmoid.desmoid-hereditary-colorectal-evaluation.v1",
      "concept.topic-soft-tissue-sarcoma-desmoid.progressive-mesenteric-desmoid-systemic-option.v1",
      "concept.topic-soft-tissue-sarcoma-desmoid.extremity-alt-marginal-resection.v1",
      "concept.topic.liver-benign-portal-infection.beta-catenin-adenoma-resection.v1",
      "concept.topic.liver-benign-portal-infection.typical-hemangioma-conservative.v1",
      "concept.cirrhosis.analgesic-selection-with-renal-deterioration.v1",
      "concept.topic.liver-benign-portal-infection.cardiac-ascites.v1",
      "concept.topic.liver-benign-portal-infection.diuretic-volume-loss.v1",
      "concept.topic.liver-benign-portal-infection.acute-variceal-treatment.v2",
      "concept.topic.liver-benign-portal-infection.preemptive-tips.v1",
      "concept.topic.liver-benign-portal-infection.rebleeding-tips.v1",
      "concept.topic.liver-benign-portal-infection.pyogenic-source-control.v1",
      "concept.topic.liver-benign-portal-infection.hydatid-biliary-complication.v1",
      "concept.topic.thoracic-lung-pleura-mediastinum.psp-conservative-selection.v1",
      "concept.topic.thoracic-lung-pleura-mediastinum.mpe-assess-response.v1",
      "concept.topic.thoracic-lung-pleura-mediastinum.ipc-infection-response.v1",
      "concept.topic.thoracic-lung-pleura-mediastinum.mpe-lung-expansion.v1",
      "concept.topic.thoracic-lung-pleura-mediastinum.mediastinal-tissue-staging.v1",
      "concept.topic.thoracic-lung-pleura-mediastinum.pleural-dissemination-plan.v1",
      "concept.topic.thoracic-lung-pleura-mediastinum.growing-nodule-pet.v2",
      "concept.topic.thoracic-lung-pleura-mediastinum.thymic-resection-plan.v1",
      "concept.topic.thoracic-lung-pleura-mediastinum.invasive-mediastinal-core.v1",
      "concept.transplant-immunosuppression.renal-biopsy.v1",
      "concept.transplant-immunosuppression.cellular-rescue.v1",
      "concept.transplant-immunosuppression.bk-plasma-before-reduction.v1",
      "concept.transplant-immunosuppression.bk-biopsy-reduction.v1",
      "concept.transplant-immunosuppression.cmv-tissue-not-blood.v1",
      "concept.transplant-immunosuppression.aza-allopurinol.v1",
      "concept.transplant-immunosuppression.dgf-cni-continuation.v1",
      "concept.transplant-immunosuppression.cellular-steroids.v1",
      "concept.transplant-immunosuppression.bk-function-discordance.v1",
      "concept.transplant-immunosuppression.tac-sample-validity.v1",
      "concept.transplant-immunosuppression.cmv-severe-route.v2",
      "concept.transplant-immunosuppression.cmv-leukopenia.v1",
      "concept.transplant-immunosuppression.active-amr-backbone.v1",
      "concept.transplant-immunosuppression.dgf-biopsy.v2",
      "concept.topic.oncology-genetics-principles.childhood-actionable-predictive-testing.v1",
      "concept.topic.oncology-genetics-principles.true-negative-with-nonactionable-vus.v1",
      "concept.topic.oncology-genetics-principles.informative-affected-relative.v1",
      "concept.topic.oncology-genetics-principles.bevacizumab-healing-beyond-calendar.v1",
      "concept.topic.oncology-genetics-principles.checkpoint-colitis-first-immunosuppression.v1",
      "concept.topic.oncology-genetics-principles.refractory-checkpoint-colitis-infectious-reassessment.v1",
      "concept.topic.oncology-genetics-principles.rasburicase-oxidative-toxicity-no-rechallenge.v1",
      "concept.topic.stomach-neoplasia.occult-peritoneal-staging.v1",
      "concept.topic.stomach-neoplasia.preinitial-positive-washings.v1",
      "concept.topic.stomach-neoplasia.endoscopic-lymphatic-risk.v1",
      "concept.topic.stomach-neoplasia.upfront-d2-adjuvant.v1",
      "concept.topic.stomach-neoplasia.localized-gist-operation.v1",
      "concept.topic.stomach-neoplasia.r1-without-rupture.v1",
      "concept.topic.stomach-neoplasia.resected-d842v.v1",
      "concept.topic.stomach-neoplasia.attenuation-versus-diameter.v1",
      "concept.topic.stomach-neoplasia.metastatic-remission-continuation.v1",
      "concept.esophagus-structural-inflammatory-emergencies.bone-film-complication-imaging.v1",
      "concept.esophagus-structural-inflammatory-emergencies.contained-perforation-surveillance.v1",
      "concept.esophagus-structural-inflammatory-emergencies.free-perforation-repair.v1",
      "concept.esophagus-structural-inflammatory-emergencies.caustic-loss-enhancement.v1",
      "concept.esophagus-structural-inflammatory-emergencies.caustic-complex-stricture.v1",
      "concept.esophagus-structural-inflammatory-emergencies.zenker-limited-neck-access.v1",
      "concept.esophagus-structural-inflammatory-emergencies.cancer-local-margin-retreatment.v1",
      "concept.esophagus-structural-inflammatory-emergencies.cancer-clear-margins-lymphovascular.v1",
      "concept.topic.wound-healing-immunology.graft-dermis-functional-contraction.v1",
      "concept.topic.wound-healing-immunology.scar-functional-release.v1",
      "concept.prototype.laceration.tetanus",
      "concept.topic.wound-healing-immunology.graft-apposition-rescue.v1",
      "concept.topic.wound-healing-immunology.scar-mimic-representative-biopsy.v1",
      "concept.topic.wound-healing-immunology.threatened-flap-outflow-exploration.v1",
      "concept.topic.biliary-injury-malignancy.perihilar-tissue-route.v1",
      "concept.topic.biliary-injury-malignancy.vascular-collection-imaging.v1",
      "concept.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1",
      "concept.topic.biliary-injury-malignancy.main-duct-discontinuity.v2",
      "concept.topic.biliary-injury-malignancy.t2-margin-directed-completion.v1",
      "concept.topic.biliary-injury-malignancy.type-i-cyst-excision.v1",
      "concept.topic.biliary-injury-malignancy.future-remnant-drainage.v2",
      "concept.topic.biliary-injury-malignancy.benign-continuity-stenting.v2",
      "concept.ostomy-enterocutaneous-fistula.ecf-source-control.v1",
      "concept.ostomy-enterocutaneous-fistula.ecf-acute-operation-goal.v1",
      "concept.ostomy-enterocutaneous-fistula.ecf-resection.v1",
      "concept.ostomy-enterocutaneous-fistula.obstruction-after-reduction.v1",
      "concept.ostomy-enterocutaneous-fistula.new-output-infection-survey.v1",
      "concept.spleen-asplenia.hs-independent-splenic-indication.v1",
      "concept.spleen-asplenia.anti-b-cell-preop-vaccine-response.v1",
      "concept.spleen-asplenia.hs-splenectomy-clinical-severity.v1",
      "concept.spleen-asplenia.xerocytosis-before-splenectomy.v1",
      "concept.spleen-asplenia.menb-risk-based-coverage.v1",
      "concept.spleen-asplenia.abscess-anatomy-source-control.v1",
      "concept.n3.foot-culture-versus-clinical-infection.v2",
      "concept.skin-soft-tissue-benign-infection.necrotizing-clinical-escalation.v1",
      "concept.skin-soft-tissue-benign-infection.radiograph-negative-foreignbody-localization.v1",
      "concept.skin-soft-tissue-benign-infection.hs-local-tunnel-procedure.v1",
      "concept.skin-soft-tissue-benign-infection.epidermoid-acute-versus-elective.v1",
      "concept.topic.ethics-professionalism.additional-procedure-permission.v1",
      "concept.topic.ethics-professionalism.recoverable-capacity-timing.v1",
      "concept.topic.ethics-professionalism.suspected-falsification-response.v1",
      "concept.mh.nontriggering-plan-and-testing-sequence.v1",
      "concept.anesthesia-analgesia-pharmacology.last-seizure-management.v1",
      "concept.anesthesia-analgesia-pharmacology.last-wide-complex-adjunct.v1",
      "concept.anesthesia-analgesia-pharmacology.opioid-respiratory-endpoint.v1",
      "concept.topic.head-neck-salivary.lymphoid-surgical-architecture.v1",
      "concept.topic.head-neck-salivary.distal-duct-stone-access.v1",
      "concept.topic.head-neck-salivary.facial-nerve-tension-repair.v1",
      "concept.topic.head-neck-salivary.perineural-adjuvant-radiotherapy.v1",
      "concept.topic.neuro-orthopedic-essentials.median-motor-escalation.v1",
      "concept.topic.neuro-orthopedic-essentials.joint-sampling-sequence.v1",
      "concept.topic.neuro-orthopedic-essentials.joint-failed-drainage.v1",
      "concept.topic.neuro-orthopedic-essentials.spine-imaging-lag.v1",
      "concept.topic.neuro-orthopedic-essentials.spine-concordant-blood-culture.v2",
      "concept.topic.neuro-orthopedic-essentials.footdrop-competing-localization.v1",
      "concept.topic.quality-safety-systems.observed-barrier-use.v1",
      "concept.topic.quality-safety-systems.reporting-ascertainment.v1",
      "concept.topic.quality-safety-systems.whole-pathway-resource-burden.v1",
      "concept.topic.adult-urology-gynecology.preintervention-stone-evidence.v1",
      "concept.topic.adult-urology-gynecology.ectopic-medical-eligibility.v1",
      "concept.topic.adult-urology-gynecology.heterotopic-adnexal-assessment.v1",
      "concept.topic.adult-urology-gynecology.infected-obstruction-drainage.v1",
      "concept.topic.adult-urology-gynecology.stone-procedure-anticoagulation.v1",
      "concept.topic.adult-urology-gynecology.confirm-stone-passage.v1",
      "concept.topic.adult-urology-gynecology.postoperative-ureteral-injury-imaging.v1",
      "concept.topic.adult-urology-gynecology.bladder-injury-cystography.v1",
      "concept.topic.adult-urology-gynecology.adnexal-torsion-preserved-flow.v1",
      "concept.vascular-carotid.nascet-treatment-boundary.v1",
      "concept.vascular-carotid.chronic-occlusion-medical-management.v1",
      "concept.vascular-carotid.distal-collapse-treatment-boundary.v1",
      "concept.vascular-carotid.carotid-events-during-anticoagulation.v1",
      "concept.recovered-diverticulitis.alarm-colonoscopy.v2",
      "concept.esophagus-motility-achalasia.incomplete-myotomy-salvage.v1",
      "concept.topic.esophagus-gerd-barrett-hiatal.indefinite-inflamed-biopsies.v1",
      "concept.topic.esophagus-gerd-barrett-hiatal.proven-gerd-on-therapy.v1",
      "concept.topic.esophagus-gerd-barrett-hiatal.residual-barrett-after-resection.v1",
      "concept.topic.esophagus-gerd-barrett-hiatal.visible-lesion-first.v1",
      "concept.surgical-infection-antibiotics.adequate-control-duration.v1",
      "concept.vascular-venous-lymphatic-access.varicose-proximal-outflow-workup.v1",
      "concept.vascular-venous-lymphatic-access.compression-with-severe-perfusion-deficit.v1",
      "concept.vascular-venous-lymphatic-access.modified-compression-for-mixed-ulcer.v1",
      "concept.vascular-venous-lymphatic-access.negative-proximal-study-followup.v1",
      "concept.vascular-venous-lymphatic-access.access-hand-perfusion-workup.v1",
      "concept.vascular-venous-lymphatic-access.postaccess-ischemic-neuropathy-action.v1",
      "concept.vascular-venous-lymphatic-access.dialysis-catheter-first-lock-treatment.v1",
      "concept.esophagus-motility-achalasia.postmyotomy-objective-clearance.v1",
      "concept.pbh.spontaneous-evidence-before-treatment.v2",
      "concept.bariatric-metabolic.pbh-acarbose-intolerance-next-drug.v2",
      "concept.bariatric-metabolic.post-sleeve-on-therapy-reflux-testing.v2",
      "concept.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
      "concept.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
      "concept.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v1",
      "concept.pediatric-gi-abdominal-wall.wilms-caval-extension-initial-plan.v1",
      "concept.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
    ]);
  });

  it("freezes one approved HCC presentation profile without changing the authored case", () => {
    const caseId = "case.hcc.milan.solitary-within";
    let state = emptyLevelOne("hcc-approved-profile");
    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "hcc-profile-admission",
      encounterId: "encounter.hcc-profile-admission",
      caseId,
      patientDisplayName: "Profile Test Patient",
      arrivalClass: "routine",
    });

    const frozen =
      state.encounters["encounter.hcc-profile-admission"]?.frozenCase;
    expect(frozen).toMatchObject({
      id: caseId,
      releasePointId: "release.l0.clinic_evaluation",
    });
    expect(frozen?.selectedInstantiationProfileId).toMatch(
      /^profile\.hcc\.milan\.solitary-within\./,
    );
    const selected = frozen?.approvedInstantiationProfiles?.find(
      (profile) => profile.id === frozen.selectedInstantiationProfileId,
    );
    expect(selected).toBeDefined();
    expect(frozen?.prototypeDemographics?.ageYears).toBe(
      selected?.prototypeDemographics?.ageYears,
    );
    if (selected?.prototypeDemographics?.sexLabel === "Not specified") {
      expect(frozen?.prototypeDemographics?.sexLabel).toMatch(/^(Female|Male)$/);
    } else {
      expect(frozen?.prototypeDemographics?.sexLabel).toBe(
        selected?.prototypeDemographics?.sexLabel,
      );
    }
    expect(frozen?.presentation).toBe(selected?.presentation);

    const authored = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (clinicalCase) => clinicalCase.id === caseId,
    );
    expect(authored?.selectedInstantiationProfileId).toBeUndefined();

    const restored = deserializeGameState(serializeGameState(state));
    expect(
      restored.encounters["encounter.hcc-profile-admission"]?.frozenCase,
    ).toEqual(frozen);
  });

  it("freezes coherent display demographics, names, and roster identity for representative admissions", () => {
    const cases = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases;
    const representativeIds = [
      "case.fhh.evaluation-to-confirmed-management",
      "case.fhh.suggestive-results-confirmation",
      "case.pancreatic-tail-adenocarcinoma.clinic-counseling",
      "case.choledochal-cyst.type-iva.2a",
      "case.anal-hsil.hpv.3d",
      cases.find((clinicalCase) =>
        clinicalCase.prototypeDemographics?.sexLabel === "Not specified",
      )?.id,
      cases.find((clinicalCase) =>
        clinicalCase.prototypeDemographics?.sexLabel === "Female",
      )?.id,
      cases.find((clinicalCase) =>
        clinicalCase.prototypeDemographics?.sexLabel === "Male",
      )?.id,
    ];
    expect(representativeIds.every((caseId) => typeof caseId === "string")).toBe(true);
    const permissiveContext = {
      ...PROTOTYPE_DOMAIN_CONTEXT,
      clinicalRelease: {
        ...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,
        cases: cases.map((clinicalCase) => ({
          ...clinicalCase,
          earliestFacilityStage: 0,
          requiredCapabilityIds: [],
        })),
      },
    };
    let state = createInitialGameState(permissiveContext, {
      campaignId: "campaign.identity-admission",
      campaignSeed: "identity-admission",
      createdAtRealMs: 0,
    });
    state.encounters = {};
    state.openChartEncounterId = null;
    state.attendedEncounterId = null;
    state.facilityLevel = 2;
    state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
    const admittedDemographics = new Map<string, { ageYears: number; sexLabel: string }>();
    for (const [index, caseId] of representativeIds.entries()) {
      const encounterId = `encounter.identity-admission.${index}`;
      state.encounters = {};
      state = gameReducer(state, {
        type: "ADMIT_PATIENT",
        operationId: `identity-admission.${index}`,
        encounterId,
        caseId: caseId!,
        patientDisplayName: `Explicit Identity ${index}`,
        arrivalClass: "routine",
      }, permissiveContext);
      expect(state.operationReceipts[`identity-admission.${index}`]?.status).toBe("applied");
      const encounter = state.encounters[encounterId]!;
      expect(encounter.patientDisplayName).toBe(`Explicit Identity ${index}`);
      expect(encounter.frozenCase.prototypeDemographics?.sexLabel).toMatch(/^(Female|Male)$/);
      const rosterIdentity = patientRosterEntryById(encounter.patientAppearance.patientIdentityId);
      expect(rosterIdentity?.compatibleSexLabel).toBe(
        encounter.frozenCase.prototypeDemographics?.sexLabel,
      );
      expect(rosterIdentity?.ageBand).toBe(
        patientVisualAgeBand(encounter.frozenCase.prototypeDemographics?.ageYears),
      );
      admittedDemographics.set(caseId!, encounter.frozenCase.prototypeDemographics!);
    }
    expect(admittedDemographics.get("case.fhh.evaluation-to-confirmed-management")?.ageYears).toBe(27);
    const youngAdultAge = admittedDemographics.get("case.fhh.suggestive-results-confirmation")?.ageYears;
    expect(youngAdultAge).toBeGreaterThanOrEqual(18);
    expect(youngAdultAge).toBeLessThanOrEqual(29);
    expect(admittedDemographics.get("case.pancreatic-tail-adenocarcinoma.clinic-counseling")?.ageYears).toBeGreaterThanOrEqual(65);
    const choledochalAge = admittedDemographics.get("case.choledochal-cyst.type-iva.2a")?.ageYears;
    expect(choledochalAge).toBeGreaterThanOrEqual(45);
    expect(choledochalAge).toBeLessThanOrEqual(64);
    expect(admittedDemographics.get("case.anal-hsil.hpv.3d")?.sexLabel).toBe("Female");
    const restored = deserializeGameState(serializeGameState(state), permissiveContext);
    expect(restored.encounters).toEqual(state.encounters);
  });
});
