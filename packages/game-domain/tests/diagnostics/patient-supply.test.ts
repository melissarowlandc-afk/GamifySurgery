import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  gameReducer,
  getCurrentQuestion,
  selectRoutineClinicalCase,
  type GameState,
} from "../../src";
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
        "answers": 110,
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
        "completed": 78,
        "dueReviews": 0,
        "facilityTick": 4800,
        "lastArrivalTick": 4753,
        "nextRoutineArrivalTick": 4814,
        "nextSelectionKind": "new_concept",
        "pendingResults": 1,
        "scoredConcepts": 110,
        "totalArrivals": 79,
        "unresolved": 1,
        "unseenAvailableConceptIds": [
          "concept.aaa.one-time-ultrasound-screening",
          "concept.aaa.six-cm-elective-repair-referral",
          "concept.accessory-spleen.common-location",
          "concept.acute-limb-ischemia.heparin-emergency-transfer",
          "concept.acute-limb-ischemia.viability-exam",
          "concept.acute-mesenteric-ischemia.peritonitis-exploration",
          "concept.acute-mesenteric-ischemia.prompt-cta",
          "concept.acute-pancreatitis.mild-biliary-chole-before-discharge",
          "concept.acute-pancreatitis.selective-early-ct",
          "concept.adrenal-incidentaloma.one-mg-dst",
          "concept.anal-fissure.acute-recognition",
          "concept.anal-fissure.initial-conservative-care",
          "concept.anal-hsil.high-risk-hpv-association",
          "concept.anal-scc.biopsy-and-staging",
          "concept.anal-scc.localized-chemoradiation-referral",
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
          "concept.burn.referral-consultation-selection",
          "concept.burn.superficial-partial-thickness-recognition",
          "concept.choledochal-cyst.type-iva-combined-duct-dilation",
          "concept.choledocholithiasis.confirmed-stone-therapy",
          "concept.choledocholithiasis.intermediate-mrcp",
          "concept.chronic-anal-fissure.lis-after-medical-treatment",
          "concept.chronic-mesenteric-ischemia.cta-diagnosis",
          "concept.chronic-mesenteric-ischemia.revascularization-referral",
          "concept.coagulation.mixing-study-initial-interpretation",
          "concept.colon-cancer.oncologic-regional-resection",
          "concept.colon-cancer.preoperative-cross-sectional-staging",
          "concept.diabetic-foot-ulcer.no-antibiotics-without-infection",
          "concept.dialysis-access.maturation-physical-assessment",
          "concept.dialysis-nutrition.avoid-calorie-overfeeding",
          "concept.dialysis-nutrition.hospital-protein-target",
          "concept.differentiated-thyroid-cancer.individualized-surgical-extent",
          "concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound",
          "concept.distal-cholangiocarcinoma.resection-selection",
          "concept.diverticulitis.first-presentation-ct",
          "concept.diverticulitis.selected-supportive-care",
          "concept.elective-splenectomy.encapsulated-organism-vaccine-review",
          "concept.fascial-dehiscence-evisceration.emergency-transfer",
          "concept.fecal-incontinence.endoanal-ultrasound-repair-planning",
          "concept.fecal-incontinence.first-line-stool-care",
          "concept.femoral-hernia.timely-elective-repair",
          "concept.fhh.avoid-parathyroid-surgery",
          "concept.fhh.biochemical-evaluation",
          "concept.fibroadenoma.concordant-observation",
          "concept.gallbladder-polyp.initial-management-category",
          "concept.gallstones.incidental-observation",
          "concept.gallstones.initial-ultrasound",
          "concept.gallstones.symptomatic-surgical-referral",
          "concept.gastric-gist.eus-core-molecular-diagnosis",
          "concept.gastric-gist.mutation-guided-neoadjuvant-imatinib",
          "concept.gcs.complete-component-total",
          "concept.gcs.verbal-not-testable-documentation",
          "concept.gerd.hrm-before-operative-planning",
          "concept.gerd.off-ppi-reflux-monitoring",
          "concept.graves.clinical-pattern-recognition",
          "concept.graves.rai-lactation-contraindication",
          "concept.graves.trab-diagnostic-support",
          "concept.gs028f.anesthesia.neuromuscular-blockade-effect-boundary",
          "concept.gs028f.critical-care.normal-spo2-anemia-content",
          "concept.gs028f.gynecology.pregnancy-testing-pelvic-pain",
          "concept.gs028f.head-neck.initial-fna-not-open-biopsy",
          "concept.gs028f.nutrition.refeeding-insulin-phosphate-shift",
          "concept.gs028f.oncology.small-bowel-melanoma-cutaneous-origin",
          "concept.gs028f.outcomes.rca-versus-fmea-purpose",
          "concept.gs028f.pharmacology.local-anesthetic-sodium-channel-block",
          "concept.gs028f.pharmacology.tacrolimus-calcineurin-inhibition",
          "concept.gs028f.plastic.graft-versus-flap-blood-supply",
          "concept.gs028f.plastic.median-carpal-tunnel-localization",
          "concept.gs028f.plastic.ulnar-cubital-tunnel-localization",
          "concept.gs028f.transplantation.donor-recipient-relationships",
          "concept.hcc.milan-transplant-evaluation",
          "concept.head-injury.anticoagulant-ed-ct-evaluation",
          "concept.high-output-ileostomy.renal-electrolyte-magnesium-assessment",
          "concept.high-output-ileostomy.sodium-glucose-oral-rehydration",
          "concept.hyperkalaemia.distinguish-protection-from-potassium-lowering",
          "concept.imaging.ionizing-versus-nonionizing-modalities",
          "concept.immunology.ige-mast-cell-type-i",
          "concept.immunology.t-cell-type-iv-contact",
          "concept.infection.operative-wound-classification",
          "concept.inguinal-hernia.indirect-vessel-relationship",
          "concept.inguinal-hernia.lateral-femoral-cutaneous-localization",
          "concept.lung-cancer-screening.annual-ldct-eligibility",
          "concept.lymphangitis.acute-clinical-recognition",
          "concept.malignant-polyp.adverse-feature-colectomy",
          "concept.mammary-paget.full-thickness-biopsy",
          "concept.mammary-paget.underlying-breast-evaluation",
          "concept.marginal-ulcer.initial-medical-management",
          "concept.men2a.core-manifestation-pattern",
          "concept.men2a.pheochromocytoma-precedes-thyroid-intervention",
          "concept.metabolic-acidosis.confirm-with-blood-gas",
          "concept.mondor-disease.clinical-recognition",
          "concept.mondor-disease.selective-imaging-evaluation",
          "concept.mondor-disease.supportive-management",
          "concept.mri.device-specific-safety-verification",
          "concept.naloxone.competitive-opioid-antagonist-mechanism",
          "concept.nephrolithiasis.noncontrast-ct-evaluation",
          "concept.nephrolithiasis.recurrent-metabolic-evaluation",
          "concept.obstructive-jaundice.vitamin-k-coagulopathy",
          "concept.oncology.stage-versus-grade",
          "concept.palpable-breast.negative-mammogram-targeted-us",
          "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
          "concept.pancreatic-cyst.mcn-pattern-recognition",
          "concept.pancreatic-cyst.mrcp-duct-assessment",
          "concept.parastomal-hernia.clinical-recognition",
          "concept.parastomal-hernia.nonurgent-stoma-specialist-management",
          "concept.pbh.completed-whipple-triad",
          "concept.pbh.initial-dietary-care",
          "concept.pelvic-trauma.binder-greater-trochanter-placement",
          "concept.perianal-abscess.prompt-drainage",
          "concept.perianal-abscess.selective-antibiotics",
          "concept.perioperative-medication.continue-chronic-beta-blocker",
          "concept.perioperative-medication.warfarin-interruption-no-bridge",
          "concept.perioperative-sglt2.drug-specific-interruption",
          "concept.persistent-itp.defer-elective-splenectomy",
          "concept.persistent-itp.hiv-hcv-secondary-evaluation",
          "concept.pilonidal-disease.chronic-sinus-recognition",
          "concept.pilonidal-disease.off-midline-closure-planning",
          "concept.postherniorrhaphy-pain.neuropathic-pattern-recognition",
          "concept.postherniorrhaphy-pain.targeted-block-specialist-evaluation",
          "concept.postoperative-delirium.multicomponent-prevention-plan",
          "concept.postoperative-retention.bladder-scan",
          "concept.postoperative-retention.catheter-decompression",
          "concept.preoperative-osa.validated-risk-screening",
          "concept.primary-hyperparathyroidism.biochemical-confirmation",
          "concept.primary-hyperparathyroidism.symptomatic-surgery-assessment",
          "concept.prosthetic-mesh-infection.deep-infection-recognition",
          "concept.prosthetic-mesh-infection.specialist-source-control-evaluation",
          "concept.ptld.posttransplant-pattern-recognition",
          "concept.ptld.tissue-diagnosis-coordination",
          "concept.recovered-diverticulitis.interval-colonoscopy",
          "concept.recovered-diverticulitis.shared-elective-sigmoid-discussion",
          "concept.rectal-prolapse.dynamic-defecography",
          "concept.rectal-prolapse.surgical-referral",
          "concept.retained-antrum.recognition",
          "concept.sglt2-inhibitor.euglycemic-ketoacidosis-adverse-effect",
          "concept.small-bowel-obstruction.urgent-surgical-escalation",
          "concept.soft-tissue-mass.extremity-mri",
          "concept.soft-tissue-mass.specialist-planned-biopsy",
          "concept.spigelian-hernia.elective-repair-referral",
          "concept.statistics-ethics.arr-nnt",
          "concept.statistics-ethics.capacity-refusal",
          "concept.statistics-ethics.confidentiality",
          "concept.statistics-ethics.impaired-colleague",
          "concept.statistics-ethics.perioperative-dnr",
          "concept.statistics-ethics.predictive-value-prevalence",
          "concept.statistics-ethics.qi-versus-research",
          "concept.statistics-ethics.research-consent",
          "concept.statistics-ethics.surrogate-decisions",
          "concept.thyroglossal-duct-cyst.sistrunk-referral",
          "concept.thyroglossal-duct-cyst.ultrasound",
          "concept.thyroid-nodule.fna-selection",
          "concept.thyroid-nodule.follicular-invasion-histology",
          "concept.umbilical-epigastric-hernia.clinical-recognition",
          "concept.umbilical-epigastric-hernia.symptomatic-elective-referral",
          "concept.varicose-veins.intervention-referral-after-axial-reflux",
          "concept.varicose-veins.reflux-duplex-evaluation",
          "concept.variety3.epidermoid-cyst-recognition",
          "concept.variety3.pruritus-ani-gentle-skin-care",
          "concept.variety3.rectus-diastasis-recognition",
          "concept.variety3.thrombosed-external-hemorrhoid-recognition",
          "concept.ventral-hernia.elective-pulmonary-optimization",
          "concept.wound-healing.type-iii-to-type-i-collagen-remodeling",
          "concept.wound.hypertrophic-versus-keloid-extent",
          "concept.zenker-diverticulum.contrast-swallow",
          "concept.zenker-diverticulum.false-pouch-anatomy",
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
