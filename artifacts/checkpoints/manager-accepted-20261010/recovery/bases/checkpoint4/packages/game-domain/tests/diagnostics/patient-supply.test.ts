import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  gameReducer,
  getCurrentQuestion,
  selectRoutineClinicalCase,
  type GameState,
} from "../../src";

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
        "answers": 108,
        "arrivalsByDay": [
          11,
          10,
          9,
          10,
          10,
          9,
          10,
          10,
        ],
        "completed": 76,
        "dueReviews": 0,
        "facilityTick": 4800,
        "lastArrivalTick": 4753,
        "nextRoutineArrivalTick": 4814,
        "nextSelectionKind": "new_concept",
        "pendingResults": 3,
        "scoredConcepts": 108,
        "totalArrivals": 79,
        "unresolved": 3,
        "unseenAvailableConceptIds": [
          "concept.aaa.female-sex-associated-perioperative-mortality",
          "concept.aaa.one-time-ultrasound-screening",
          "concept.aaa.six-cm-elective-repair-referral",
          "concept.achalasia.manometric-recognition",
          "concept.acute-limb-ischemia.viability-exam",
          "concept.acute-mesenteric-ischemia.prompt-cta",
          "concept.acute-pancreatitis.selective-early-ct",
          "concept.adrenal-incidentaloma.one-mg-dst",
          "concept.anal-fissure.acute-recognition",
          "concept.anal-fissure.initial-conservative-care",
          "concept.anal-hsil.high-risk-hpv-association",
          "concept.anal-scc.biopsy-and-staging",
          "concept.anal-scc.localized-chemoradiation-referral",
          "concept.appendicitis.appendicolith-operative-pathway",
          "concept.appendicitis.stable-adult-ct",
          "concept.ards.predicted-body-weight-ventilation",
          "concept.asplenia.fever-emergency-action",
          "concept.asymptomatic-phpt.age-based-surgery",
          "concept.asymptomatic-phpt.three-site-dxa",
          "concept.basal-cell-carcinoma.clinical-pattern-recognition",
          "concept.blunt-cardiac-injury.ecg-troponin-evaluation",
          "concept.blunt-cardiac-injury.monitored-disposition",
          "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection",
          "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping",
          "concept.cholecystitis.fit-patient-index-admission-cholecystectomy",
          "concept.cholecystitis.hida-after-equivocal-ultrasound",
          "concept.choledochal-cyst.type-iva-combined-duct-dilation",
          "concept.chronic-anal-fissure.topical-calcium-channel-blocker",
          "concept.chronic-mesenteric-ischemia.cta-diagnosis",
          "concept.chronic-mesenteric-ischemia.revascularization-referral",
          "concept.dcis.margin-bcs-wbrt",
          "concept.desmoid.initial-active-surveillance",
          "concept.desmoid.progressing-abdominal-wall-surgical-option",
          "concept.diabetic-foot-infection.clinical-recognition",
          "concept.diabetic-foot-ulcer.no-antibiotics-without-infection",
          "concept.differentiated-thyroid-cancer.individualized-surgical-extent",
          "concept.distal-cholangiocarcinoma.resection-selection",
          "concept.diverticulitis.first-presentation-ct",
          "concept.diverticulitis.selected-supportive-care",
          "concept.elective-splenectomy.encapsulated-organism-vaccine-review",
          "concept.fap.germline-testing-after-diffuse-adenomas",
          "concept.fap.ipaa-for-uncontrolled-rectal-burden",
          "concept.fascial-dehiscence-evisceration.emergency-transfer",
          "concept.fecal-incontinence.endoanal-ultrasound-repair-planning",
          "concept.fecal-incontinence.first-line-stool-care",
          "concept.felty-syndrome.methotrexate-first-line",
          "concept.felty-syndrome.recognition",
          "concept.felty-syndrome.splenectomy-for-refractory-infections",
          "concept.femoral-hernia.timely-elective-repair",
          "concept.fhh.avoid-parathyroid-surgery",
          "concept.fhh.biochemical-evaluation",
          "concept.fhh.recognition-and-confirmation",
          "concept.gallbladder-polyp.initial-management-category",
          "concept.gallstones.incidental-observation",
          "concept.gastric-gist.eus-core-molecular-diagnosis",
          "concept.gastric-gist.mutation-guided-neoadjuvant-imatinib",
          "concept.gcs.complete-component-total",
          "concept.gcs.verbal-not-testable-documentation",
          "concept.gerd.hrm-before-operative-planning",
          "concept.gerd.off-ppi-reflux-monitoring",
          "concept.graves.clinical-pattern-recognition",
          "concept.graves.rai-appropriate-candidate",
          "concept.graves.rai-lactation-contraindication",
          "concept.graves.rai-pregnancy-contraindication",
          "concept.graves.trab-diagnostic-support",
          "concept.gs028f.anesthesia.local-anesthetic-systemic-toxicity-recognition",
          "concept.gs028f.anesthesia.neuromuscular-blockade-effect-boundary",
          "concept.gs028f.critical-care.normal-spo2-anemia-content",
          "concept.gs028f.esophagus.negative-radiograph-retained-bone-limit",
          "concept.gs028f.gynecology.pregnancy-testing-pelvic-pain",
          "concept.gs028f.gynecology.suspected-ectopic-urgent-evaluation",
          "concept.gs028f.nutrition.high-risk-refeeding-thiamine-planning",
          "concept.gs028f.oncology.small-bowel-melanoma-cutaneous-origin",
          "concept.gs028f.pharmacology.local-anesthetic-sodium-channel-block",
          "concept.gs028f.pharmacology.tacrolimus-calcineurin-inhibition",
          "concept.gs028f.plastic.graft-versus-flap-blood-supply",
          "concept.gs028f.plastic.median-carpal-tunnel-localization",
          "concept.gs028f.plastic.split-thickness-donor-epithelial-regrowth",
          "concept.hcc.compensated-cirrhosis-resection-selection",
          "concept.hcc.milan-transplant-evaluation",
          "concept.head-injury.anticoagulant-ed-ct-evaluation",
          "concept.hepatic-adenoma.multiphasic-mri-characterization",
          "concept.hepatic-adenoma.resection-in-men",
          "concept.hereditary-spherocytosis.postsplenectomy-persistent-hemolysis-evaluation",
          "concept.hidradenitis-suppurativa.multimodal-specialist-planning",
          "concept.hidradenitis-suppurativa.pattern-recognition",
          "concept.immunology.ige-mast-cell-type-i",
          "concept.immunology.preformed-antibody-hyperacute-rejection",
          "concept.immunology.t-cell-type-iv-contact",
          "concept.infection.operative-wound-classification",
          "concept.inguinal-hernia.selected-watchful-waiting",
          "concept.internal-hemorrhoids.anoscopy-evaluation",
          "concept.internal-hemorrhoids.office-banding-selection",
          "concept.iodinated-contrast.physiologic-versus-allergic-like-reaction",
          "concept.ipaa.pouchitis-common-post-ipaa-complication",
          "concept.lymphangitis.acute-clinical-recognition",
          "concept.lynch-tumor.germline-counseling-after-suggestive-ihc",
          "concept.lynch-tumor.universal-mmr-screening",
          "concept.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan",
          "concept.malignant-polyp.low-risk-endoscopic-excision",
          "concept.mammary-paget.full-thickness-biopsy",
          "concept.mammary-paget.underlying-breast-evaluation",
          "concept.marginal-ulcer.initial-medical-management",
          "concept.men2a.core-manifestation-pattern",
          "concept.men2a.pheochromocytoma-precedes-thyroid-intervention",
          "concept.metabolic-acidosis.albumin-corrected-anion-gap",
          "concept.metabolic-acidosis.confirm-with-blood-gas",
          "concept.mondor-disease.clinical-recognition",
          "concept.mri.device-specific-safety-verification",
          "concept.naloxone.competitive-opioid-antagonist-mechanism",
          "concept.oncology.rb1-biallelic-tumor-suppressor-loss",
          "concept.palpable-breast.negative-mammogram-targeted-us",
          "concept.pancreatic-tail-adenocarcinoma.distal-pancreatectomy-with-splenectomy",
          "concept.parastomal-hernia.clinical-recognition",
          "concept.pathologic-nipple-discharge.diagnostic-imaging",
          "concept.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition",
          "concept.pbh.completed-whipple-triad",
          "concept.pelvic-trauma.binder-greater-trochanter-placement",
          "concept.perianal-abscess.prompt-drainage",
          "concept.perioperative-sglt2.drug-specific-interruption",
          "concept.peripheral-arterial-disease.resting-abi",
          "concept.peripheral-arterial-disease.structured-exercise",
          "concept.persistent-itp.defer-elective-splenectomy",
          "concept.persistent-itp.hiv-hcv-secondary-evaluation",
          "concept.pheochromocytoma.alpha-before-beta-blockade",
          "concept.pilonidal-disease.chronic-sinus-recognition",
          "concept.pilonidal-disease.off-midline-closure-planning",
          "concept.pleural-effusion.image-guided-thoracentesis-referral",
          "concept.pleural-infection.intercostal-drain-indication",
          "concept.pneumoperitoneum.context-dependent-venous-return",
          "concept.post-thyroidectomy-voice.external-superior-laryngeal-nerve",
          "concept.post-thyroidectomy-voice.laryngeal-examination",
          "concept.postoperative-delirium.multicomponent-prevention-plan",
          "concept.postoperative-dvt.three-month-anticoagulation",
          "concept.postoperative-dvt.venous-duplex",
          "concept.postoperative-seroma.ultrasound-characterization",
          "concept.postoperative-seroma.uncomplicated-observation",
          "concept.preoperative-nutrition.nutritional-risk-screening",
          "concept.preoperative-nutrition.oral-enteral-first-line",
          "concept.preoperative-osa.validated-risk-screening",
          "concept.primary-aldosteronism.ct-avs-lateralization",
          "concept.primary-aldosteronism.prepared-arr-screening",
          "concept.primary-hyperparathyroidism.symptomatic-surgery-assessment",
          "concept.prosthetic-mesh-infection.specialist-source-control-evaluation",
          "concept.ptld.tissue-diagnosis-coordination",
          "concept.recovered-diverticulitis.shared-elective-sigmoid-discussion",
          "concept.retained-antrum.recognition",
          "concept.secondary-lymphedema.clinical-recognition",
          "concept.secondary-lymphedema.decongestive-therapy-referral",
          "concept.sglt2-inhibitor.euglycemic-ketoacidosis-adverse-effect",
          "concept.soft-tissue-mass.extremity-mri",
          "concept.soft-tissue-mass.specialist-planned-biopsy",
          "concept.spigelian-hernia.clinical-imaging-recognition",
          "concept.spigelian-hernia.elective-repair-referral",
          "concept.statistics-ethics.capacity-refusal",
          "concept.statistics-ethics.impaired-colleague",
          "concept.statistics-ethics.informed-consent",
          "concept.statistics-ethics.perioperative-dnr",
          "concept.statistics-ethics.predictive-value-prevalence",
          "concept.statistics-ethics.qualified-interpreter",
          "concept.statistics-ethics.research-consent",
          "concept.statistics-ethics.sensitivity-specificity",
          "concept.statistics-ethics.surrogate-decisions",
          "concept.stoma-prolapse.urgent-surgical-escalation",
          "concept.stoma-prolapse.viability-obstruction-assessment",
          "concept.thyroglossal-duct-cyst.sistrunk-referral",
          "concept.thyroglossal-duct-cyst.ultrasound",
          "concept.umbilical-epigastric-hernia.clinical-recognition",
          "concept.venous-leg-ulcer.arterial-assessment-before-compression",
          "concept.venous-leg-ulcer.compression-with-adequate-arterial-perfusion",
          "concept.ventral-hernia.elective-pulmonary-optimization",
          "concept.wound-healing.type-iii-to-type-i-collagen-remodeling",
          "concept.wound.hypertrophic-versus-keloid-extent",
        ],
        "walkouts": 0,
      }
    `);
    expect(arrivalsByDay[5]).toBeGreaterThan(0);
    expect(arrivalsByDay[6]).toBeGreaterThan(0);
    expect(arrivalsByDay[7]).toBeGreaterThan(0);
    expect(evidence.completed).toBeGreaterThan(0);
    expect(answers).toBeGreaterThan(0);
  }, 300_000);
});
