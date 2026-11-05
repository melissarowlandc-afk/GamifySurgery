import { createClinicalAuthorStage } from "../../../../tests/fixtures/clinical-author-stage";
import { QUESTION_NEW_N2_ROUND3_PRE_RELEASE } from "@gamify-surgery/clinical-content";
import { describe, expect, it } from "vitest";
import {
  getCurrentQuestion,
  selectRoutineClinicalCase,
  type GameState,
} from "../../src";

// Retain the author-stage pool, frozen definitions and existing golden budgets.
const { context: PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState, gameReducer } = createClinicalAuthorStage(QUESTION_NEW_N2_ROUND3_PRE_RELEASE);
// Hosted CI runners run long simulations up to ten times slower.
const hostedTime = (ms: number) => (process.env.CI ? ms * 10 : ms);

const REAL_MS = 10_000;
const OPERATING_MINUTES_PER_DAY = 600;

function tick(state: GameState, operationId: string): GameState {
  return gameReducer(state, {
    type: "ADVANCE_TICK",
    operationId,
    advancedAtRealMs: REAL_MS,
  });
}

function preparedClinic(): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: "campaign.gs017.sustained",
    campaignSeed: "gs017-sustained",
    createdAtRealMs: 0,
  });
  state.facilityLevel = 1;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.rooms.push({
    id: "room.gs017.exam",
    roomDefinitionId: "room.examination",
    x: 34,
    y: 26,
    orientation: 0,
    doorSide: "south",
    upgradeLevel: 1,
    cleanliness: 100,
  });
  state.doors.push({
    id: "door.gs017.exam",
    roomId: "room.gs017.exam",
    side: "south",
    offset: 1,
    exterior: false,
  });
  state.nextRoutineArrivalTick = 1;
  return state;
}

// Round-four concept identities and keyed studies intentionally change the seeded
// synthetic arrival/coverage trace. Keep every numeric/ID snapshot and all positive
// arrival/completion/walkout checks; future paired companions remain ineligible.
describe("GS-017 sustained patient supply diagnostic", () => {
  it("runs normal ticks, arrivals, gates, and completions through day eight", () => {
    let state = preparedClinic();
    let operations = 0;
    let answers = 0;
    // Older finished patients are retired from live state; arrival ticks are
    // fixed at creation, so record them while each encounter is present.
    const arrivalTickByEncounterId = new Map<string, number>();
    const recordArrivals = () => {
      for (const encounter of Object.values(state.encounters)) {
        arrivalTickByEncounterId.set(encounter.id, encounter.waiting.arrivedAtTick);
      }
    };
    while (state.facilityTick < OPERATING_MINUTES_PER_DAY * 8) {
      recordArrivals();
      if (operations >= 10_000) {
        throw new Error(
          `Diagnostic operation bound exceeded: ${JSON.stringify({
            facilityTick: state.facilityTick,
            openChartEncounterId: state.openChartEncounterId,
            encounters: Object.values(state.encounters).map((encounter) => ({
              id: encounter.id,
              lifecycle: encounter.lifecycle,
              resolutionReason: encounter.resolutionReason,
              movement: encounter.patientMovement?.kind ?? null,
              step:
                encounter.steps[encounter.currentNodeIndex]?.status ?? null,
            })),
          })}`,
        );
      }

      const prefix = `gs017.sustained.${operations++}`;
      const openEncounter = state.openChartEncounterId
        ? state.encounters[state.openChartEncounterId]
        : null;
      const encounter =
        openEncounter ??
        Object.values(state.encounters).find(
          (candidate) =>
            candidate.lifecycle === "resolved_summary_available",
        ) ??
        Object.values(state.encounters).find(
          (candidate) =>
            candidate.lifecycle === "active_action_required" ||
            candidate.lifecycle === "waiting_unopened",
        ) ??
        Object.values(state.encounters).find(
          (candidate) =>
            candidate.resolutionReason === null &&
            candidate.patientMovement?.kind !== "leaving_after_walkout",
        );

      if (!encounter) {
        state = tick(state, `${prefix}.tick`);
        continue;
      }
      if (encounter.lifecycle === "resolved_summary_available") {
        if (!encounter.terminalFeedback?.acknowledged) {
          state = gameReducer(state, {
            type: "ACKNOWLEDGE_TERMINAL_FEEDBACK",
            operationId: `${prefix}.terminal`,
            encounterId: encounter.id,
          });
        }
        state = gameReducer(state, {
          type: "CLOSE_CHART",
          operationId: `${prefix}.close`,
          encounterId: encounter.id,
        });
        expect(state.operationReceipts[`${prefix}.close`]?.status).toBe(
          "applied",
        );
        continue;
      }
      if (
        encounter.lifecycle === "active_pending_result" &&
        state.openChartEncounterId === encounter.id
      ) {
        state = gameReducer(state, {
          type: "CLOSE_CHART",
          operationId: `${prefix}.pending-close`,
          encounterId: encounter.id,
        });
        expect(
          state.operationReceipts[`${prefix}.pending-close`]?.status,
        ).toBe("applied");
        expect(state.openChartEncounterId).toBeNull();
        continue;
      }

      const step = encounter.steps[encounter.currentNodeIndex];
      if (step?.status === "feedback_pending") {
        state = gameReducer(state, {
          type: "ACKNOWLEDGE_DECISION_FEEDBACK",
          operationId: `${prefix}.feedback`,
          encounterId: encounter.id,
          decisionNodeId: step.decisionNodeId,
        });
        expect(state.operationReceipts[`${prefix}.feedback`]?.status).toBe(
          "applied",
        );
        continue;
      }

      const question = getCurrentQuestion(state, encounter.id);
      if (question) {
        const correct = answers % 2 === 0;
        const choice = question.node.answerChoices.find(
          (candidate) => candidate.isCorrect === correct,
        )!;
        state = gameReducer(state, {
          type: "SUBMIT_ANSWER",
          operationId: `${prefix}.answer`,
          encounterId: encounter.id,
          decisionNodeId: question.node.id,
          answerChoiceId: choice.id,
          reviewedAtMs: REAL_MS,
        });
        expect(state.operationReceipts[`${prefix}.answer`]?.status).toBe(
          "applied",
        );
        answers += 1;
        continue;
      }

      if (
        state.openChartEncounterId !== encounter.id &&
        (encounter.lifecycle === "active_action_required" ||
          (encounter.lifecycle === "waiting_unopened" &&
            encounter.checkInStatus === "checked_in"))
      ) {
        state = gameReducer(state, {
          type: "OPEN_CHART",
          operationId: `${prefix}.open`,
          encounterId: encounter.id,
        });
        expect(state.operationReceipts[`${prefix}.open`]?.status).toBe(
          "applied",
        );
        continue;
      }
      state = tick(state, `${prefix}.tick`);
    }

    recordArrivals();
    const encounters = Object.values(state.encounters);
    const arrivalTicks = [...arrivalTickByEncounterId.values()];
    const retired = state.retiredEncounterSummary;
    const eligibleCases =
      PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter(
        (clinicalCase) =>
          clinicalCase.routineEligible &&
          clinicalCase.earliestFacilityStage <= state.facilityLevel &&
          clinicalCase.requiredCapabilityIds.length === 0,
      );
    const availableConceptIds = new Set(
      eligibleCases.flatMap((clinicalCase) =>
        clinicalCase.decisionNodes.map((node) => node.primaryConceptId),
      ),
    );
    const arrivalsByDay = Array.from({ length: 8 }, (_, day) =>
      arrivalTicks.filter(
        (arrivedAtTick) =>
          arrivedAtTick >= day * OPERATING_MINUTES_PER_DAY &&
          arrivedAtTick < (day + 1) * OPERATING_MINUTES_PER_DAY,
      ).length,
    );
    const evidence = {
      facilityTick: state.facilityTick,
      arrivalsByDay,
      totalArrivals: arrivalTicks.length,
      lastArrivalTick: Math.max(...arrivalTicks),
      completed:
        (retired?.completedCount ?? 0) +
        encounters.filter(
          (encounter) => encounter.resolutionReason === "completed",
        ).length,
      walkouts:
        (retired ? retired.retiredCount - retired.completedCount : 0) +
        encounters.filter(
          (encounter) => encounter.resolutionReason === "walkout",
        ).length,
      unresolved: encounters.filter(
        (encounter) => encounter.resolutionReason === null,
      ).length,
      pendingResults: encounters.filter(
        (encounter) => encounter.lifecycle === "active_pending_result",
      ).length,
      scoredConcepts: Object.values(state.learningHistories).filter(
        (history) => history.reviews.length > 0,
      ).length,
      unseenAvailableConceptIds: [...availableConceptIds]
        .filter(
          (conceptId) =>
            !state.learningHistories[conceptId] ||
            state.learningHistories[conceptId]!.reviews.length === 0,
        )
        .sort(),
      dueReviews: Object.values(state.learningHistories).filter(
        (history) =>
          history.reviews.length > 0 && history.card.dueAtMs <= REAL_MS,
      ).length,
      nextRoutineArrivalTick: state.nextRoutineArrivalTick,
      nextSelectionKind:
        selectRoutineClinicalCase(state, eligibleCases, REAL_MS)?.kind ?? null,
      answers,
    };

    expect(evidence).toMatchInlineSnapshot(`
{
  "answers": 132,
  "arrivalsByDay": [
    13,
    11,
    11,
    12,
    12,
    12,
    13,
    12,
  ],
  "completed": 94,
  "dueReviews": 0,
  "facilityTick": 4800,
  "lastArrivalTick": 4759,
  "nextRoutineArrivalTick": 4816,
  "nextSelectionKind": "new_concept",
  "pendingResults": 2,
  "scoredConcepts": 132,
  "totalArrivals": 96,
  "unresolved": 2,
  "unseenAvailableConceptIds": [
    "concept.aaa.one-time-ultrasound-screening",
    "concept.aaa.six-cm-elective-repair-referral",
    "concept.accessory-spleen.common-location",
    "concept.acute-limb-ischemia.heparin-emergency-transfer",
    "concept.acute-limb-ischemia.viability-exam",
    "concept.acute-mesenteric-ischemia.prompt-cta",
    "concept.adrenal-incidentaloma.acth-directed-source-imaging.v2",
    "concept.adrenal-incidentaloma.one-mg-dst",
    "concept.anal-hsil.high-risk-hpv-association",
    "concept.appendicitis.appendicolith-operative-pathway",
    "concept.appendicitis.stable-adult-ct",
    "concept.ards.permeability-edema-mechanism",
    "concept.ards.predicted-body-weight-ventilation",
    "concept.asplenia.fever-emergency-action",
    "concept.basal-cell-carcinoma.local-invasion-metastasis-counseling",
    "concept.blunt-cardiac-injury.ecg-troponin-evaluation",
    "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection",
    "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping",
    "concept.breast-cyst.asymptomatic-simple-observation",
    "concept.breast-mass.image-guided-core-biopsy",
    "concept.breast-mass.under-30-initial-ultrasound",
    "concept.burn.referral-consultation-selection",
    "concept.carotid-stenosis.symptomatic-endarterectomy-selection",
    "concept.cholecystitis.fit-patient-index-admission-cholecystectomy",
    "concept.cholecystitis.hida-after-equivocal-ultrasound",
    "concept.choledochal-cyst.type-iva-combined-duct-dilation",
    "concept.choledocholithiasis.confirmed-stone-therapy",
    "concept.choledocholithiasis.intermediate-mrcp",
    "concept.chronic-anal-fissure.lis-after-medical-treatment",
    "concept.cirrhosis-perioperative-risk.multifactor-assessment",
    "concept.coagulation.isolated-aptt-mixing-workup",
    "concept.colon-cancer.oncologic-regional-resection",
    "concept.colon-cancer.preoperative-cross-sectional-staging",
    "concept.colon-cancer.preoperative-cross-sectional-staging.v2",
    "concept.cushing.acth-classification",
    "concept.cushing.suppressed-acth-adrenal-imaging",
    "concept.dcis.final-cavity-shave-plan.v1",
    "concept.dcis.sentinel-node-mastectomy.v1",
    "concept.dcis.sentinel-node-setting",
    "concept.desmoid.initial-active-surveillance",
    "concept.desmoid.progressing-abdominal-wall-surgical-option",
    "concept.diabetic-foot-infection.clinical-recognition",
    "concept.dialysis-access.clinical-dysfunction-referral",
    "concept.dialysis-access.maturation-physical-assessment",
    "concept.dialysis-nutrition.avoid-calorie-overfeeding",
    "concept.dialysis-nutrition.hospital-protein-target",
    "concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v2",
    "concept.distal-cholangiocarcinoma.resection-selection",
    "concept.diverticulitis.first-presentation-ct",
    "concept.diverticulitis.selected-supportive-care",
    "concept.elective-splenectomy.encapsulated-organism-vaccine-review",
    "concept.esophageal-physiology.integrated-pressure-report.v2",
    "concept.fap.germline-testing-after-diffuse-adenomas",
    "concept.fap.ipaa-for-uncontrolled-rectal-burden",
    "concept.fascial-dehiscence-evisceration.emergency-transfer",
    "concept.fecal-incontinence.endoanal-ultrasound-repair-planning",
    "concept.fecal-incontinence.first-line-stool-care",
    "concept.felty-syndrome.methotrexate-first-line",
    "concept.felty-syndrome.recognition",
    "concept.felty-syndrome.splenectomy-for-refractory-infections",
    "concept.fhh.avoid-parathyroid-surgery",
    "concept.fhh.biochemical-evaluation",
    "concept.fhh.recognition-and-confirmation",
    "concept.fibroadenoma.concordant-observation",
    "concept.gallbladder-polyp.initial-management-category",
    "concept.gallstones.cholestatic-next-study.v1",
    "concept.gallstones.incidental-observation",
    "concept.gerd.hrm-before-operative-planning",
    "concept.gerd.off-ppi-reflux-monitoring",
    "concept.graves.clinical-pattern-recognition",
    "concept.graves.rai-active-ted-avoidance",
    "concept.graves.rai-lactation-contraindication",
    "concept.graves.rai-pregnancy-contraindication",
    "concept.graves.trab-diagnostic-support",
    "concept.groin-hernia.femoral-defect-repair-priority.v1",
    "concept.gs028f.critical-care.normal-spo2-anemia-content",
    "concept.gs028f.esophagus.confirmed-sharp-object-emergency-referral",
    "concept.gs028f.gynecology.suspected-ectopic-urgent-evaluation",
    "concept.gs028f.head-neck.initial-fna-not-open-biopsy",
    "concept.gs028f.head-neck.persistent-mass-malignancy-ct",
    "concept.gs028f.nutrition.high-risk-refeeding-thiamine-planning",
    "concept.gs028f.nutrition.refeeding-insulin-phosphate-shift",
    "concept.gs028f.outcomes.rca-versus-fmea-purpose",
    "concept.gs028f.pharmacology.local-anesthetic-sodium-channel-block",
    "concept.gs028f.pharmacology.tacrolimus-calcineurin-inhibition",
    "concept.gs028f.plastic.graft-versus-flap-blood-supply",
    "concept.gs028f.plastic.split-thickness-donor-epithelial-regrowth",
    "concept.gs028f.transplantation.donor-recipient-relationships",
    "concept.hcc.compensated-cirrhosis-resection-selection",
    "concept.hcc.milan-transplant-evaluation",
    "concept.head-neck.cyst-fluid-sample-assessment.v1",
    "concept.hereditary-spherocytosis.confirmed-accessory-spleen-management",
    "concept.hereditary-spherocytosis.postsplenectomy-persistent-hemolysis-evaluation",
    "concept.hidradenitis-suppurativa.multimodal-specialist-planning",
    "concept.hidradenitis-suppurativa.pattern-recognition",
    "concept.hyperacute-rejection.event-and-compatibility-review.v1",
    "concept.hyperkalaemia.distinguish-protection-from-potassium-lowering",
    "concept.hyperkalaemia.post-calcium-treatment.v1",
    "concept.hyperkalaemia.severe-community-result-transfer",
    "concept.imaging.ionizing-versus-nonionizing-modalities",
    "concept.immunology.graft-evidence-to-review-focus.v1",
    "concept.immunology.ige-mast-cell-type-i",
    "concept.infection.operative-wound-classification",
    "concept.inguinal-hernia.indirect-vessel-relationship",
    "concept.inguinal-hernia.lateral-femoral-cutaneous-localization",
    "concept.inguinal-hernia.selected-watchful-waiting",
    "concept.ipaa.pouchitis-common-post-ipaa-complication",
    "concept.laparoscopy.co2-absorption-hypercarbia",
    "concept.laparoscopy.position-gas-integration.v2",
    "concept.laparoscopy.pressure-cardiopulmonary.v1",
    "concept.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan",
    "concept.malignant-polyp.adverse-feature-colectomy",
    "concept.mammary-paget.full-thickness-biopsy",
    "concept.mammary-paget.underlying-breast-evaluation",
    "concept.marginal-ulcer.initial-medical-management",
    "concept.men2a.pheochromocytoma-precedes-thyroid-intervention",
    "concept.metabolic-acidosis.albumin-corrected-anion-gap",
    "concept.metabolic-acidosis.confirm-with-blood-gas",
    "concept.mondor-disease.clinical-recognition",
    "concept.mondor-disease.selective-imaging-evaluation",
    "concept.mri.device-specific-safety-verification",
    "concept.naloxone.competitive-opioid-antagonist-mechanism",
    "concept.nephrolithiasis.noncontrast-ct-evaluation",
    "concept.nephrolithiasis.recurrent-metabolic-evaluation",
    "concept.obstructive-jaundice.vitamin-k-coagulopathy",
    "concept.oncology.rb1-biallelic-tumor-suppressor-loss",
    "concept.oncology.stage-versus-grade",
    "concept.palpable-breast.negative-mammogram-targeted-us",
    "concept.pancreatic-tail-adenocarcinoma.distal-pancreatectomy-with-splenectomy",
    "concept.pathologic-nipple-discharge.diagnostic-imaging",
    "concept.pbh.initial-dietary-care",
    "concept.pelvic-trauma.binder-greater-trochanter-placement",
    "concept.perianal-abscess.selective-antibiotics",
    "concept.peripheral-arterial-disease.resting-abi",
    "concept.peripheral-arterial-disease.structured-exercise",
    "concept.pheochromocytoma.alpha-before-beta-blockade",
    "concept.pilonidal-disease.chronic-sinus-recognition",
    "concept.pilonidal-disease.off-midline-closure-planning",
    "concept.pleural-effusion.image-guided-thoracentesis-referral",
    "concept.pleural-infection.intercostal-drain-indication",
    "concept.pneumoperitoneum.context-dependent-venous-return",
    "concept.post-thyroidectomy-voice.external-superior-laryngeal-nerve",
    "concept.post-thyroidectomy-voice.laryngeal-examination",
    "concept.postherniorrhaphy-pain.neuropathic-pattern-recognition",
    "concept.postherniorrhaphy-pain.targeted-block-specialist-evaluation",
    "concept.postoperative-delirium.multicomponent-prevention-plan",
    "concept.postoperative-retention.bladder-scan",
    "concept.postoperative-retention.catheter-decompression",
    "concept.preoperative-frailty.validated-assessment",
    "concept.preoperative-nutrition.nutritional-risk-screening",
    "concept.preoperative-nutrition.oral-enteral-first-line",
    "concept.preoperative-nutrition.risk-before-route-selection.v1",
    "concept.primary-aldosteronism.ct-avs-lateralization",
    "concept.primary-aldosteronism.prepared-arr-screening",
    "concept.prosthetic-mesh-infection.specialist-source-control-evaluation",
    "concept.ptld.posttransplant-pattern-recognition",
    "concept.ptld.tissue-diagnosis-coordination",
    "concept.rectal-cancer.multimodal-response-assessment",
    "concept.rectal-cancer.selected-watch-and-wait",
    "concept.soft-tissue-mass.extremity-mri",
    "concept.soft-tissue-mass.extremity-mri.v2",
    "concept.soft-tissue-mass.extremity-mri.v4",
    "concept.soft-tissue-mass.specialist-planned-biopsy",
    "concept.spontaneous-pneumothorax.recurrence-prevention-referral",
    "concept.statistics-ethics.arr-nnt",
    "concept.statistics-ethics.capacity-refusal",
    "concept.statistics-ethics.error-disclosure",
    "concept.statistics-ethics.impaired-colleague",
    "concept.statistics-ethics.informed-consent",
    "concept.statistics-ethics.perioperative-dnr",
    "concept.statistics-ethics.predictive-value-prevalence",
    "concept.statistics-ethics.qualified-interpreter",
    "concept.statistics-ethics.research-consent",
    "concept.statistics-ethics.surrogate-decisions",
    "concept.stoma-prolapse.urgent-surgical-escalation",
    "concept.thyroglossal-duct-cyst.sistrunk-referral",
    "concept.thyroid-nodule.fna-selection",
    "concept.thyroid-nodule.follicular-invasion-histology",
    "concept.variety3.epidermoid-cyst-recognition",
    "concept.variety3.rectus-diastasis-recognition",
    "concept.variety3.thrombosed-external-hemorrhoid-recognition",
    "concept.ventral-hernia.elective-pulmonary-optimization",
    "concept.wound-healing.type-iii-to-type-i-collagen-remodeling",
    "concept.wound.hypertrophic-versus-keloid-extent",
    "concept.wound.secondary-intention-healing",
  ],
  "walkouts": 0,
}
`);
    expect(arrivalsByDay[5]).toBeGreaterThan(0);
    expect(arrivalsByDay[6]).toBeGreaterThan(0);
    expect(arrivalsByDay[7]).toBeGreaterThan(0);
    expect(evidence.completed).toBeGreaterThan(0);
    expect(answers).toBeGreaterThan(0);
  }, hostedTime(300_000));
});
