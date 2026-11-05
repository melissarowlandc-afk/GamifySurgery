import { createClinicalAuthorStage } from "../../../tests/fixtures/clinical-author-stage";
import { QUESTION_NEW_N2_ROUND3_PRE_RELEASE } from "@gamify-surgery/clinical-content";
import { QUESTION_NEW_N1_ROUND3_NEW_CONCEPT_VERSIONS } from "@gamify-surgery/clinical-content";
import type { SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import { QUESTION_NEW_N2_TESTED_CONCEPTS } from "@gamify-surgery/clinical-content";
import { QUESTION_NEW_N1_ROUND2_NEW_CONCEPT_VERSIONS } from "@gamify-surgery/clinical-content";
import { describe, expect, it } from "vitest";
import { QUESTION_NEW_N2_ROUND2_NEW_CONCEPT_VERSIONS } from "@gamify-surgery/clinical-content";
import {
  getCurrentQuestion,
  selectRoutineClinicalCase,
  type ConceptReviewEvidence,
  type GameState,
} from "../src";

// Retain the author-stage pool, frozen definitions and existing golden budgets.
const { context: PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState, gameReducer } = createClinicalAuthorStage(QUESTION_NEW_N2_ROUND3_PRE_RELEASE);
// Hosted CI runners run these full-campaign checks up to ten times slower.
const hostedTime = (ms: number) => (process.env.CI ? ms * 10 : ms);

const OPERATING_MINUTES_PER_DAY = 10 * 60;
const FIXED_REAL_TIME_MS = 10_000;

function routineCasesAtStage(
  stage: 0 | 1 | 2,
  availableCapabilityIds: ReadonlySet<string>,
): SyntheticClinicalCase[] {
  return PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter(
    (clinicalCase) =>
      clinicalCase.participant?.kind !== "employee_discussion" &&
      clinicalCase.routineEligible &&
      clinicalCase.earliestFacilityStage <= stage &&
      clinicalCase.requiredCapabilityIds.every((capabilityId) =>
        availableCapabilityIds.has(capabilityId),
      ),
  );
}

function uniqueConceptIds(clinicalCase: SyntheticClinicalCase): string[] {
  return [
    ...new Set(
      clinicalCase.decisionNodes.map((node) => node.primaryConceptId),
    ),
  ];
}

function blankState(seed: string): GameState {
  const state = createInitialGameState(PROTOTYPE_DOMAIN_CONTEXT, {
    campaignId: `campaign.patient-supply.${seed}`,
    campaignSeed: seed,
    createdAtRealMs: 0,
  });
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.routineArrivalSequence = 0;
  return state;
}

function markConceptReviewedNotDue(
  state: GameState,
  conceptId: string,
): void {
  const templateHistory = Object.values(state.learningHistories)[0]!;
  state.learningHistories[conceptId] = {
    conceptId,
    card: {
      ...templateHistory.card,
      dueAtMs: FIXED_REAL_TIME_MS + 86_400_000,
      lastReviewAtMs: FIXED_REAL_TIME_MS,
      reps: 1,
    },
    reviews: [{} as ConceptReviewEvidence],
  };
}

function exhaustUnseenSupply(
  cases: readonly SyntheticClinicalCase[],
  seed: string,
): { patientCount: number; introducedConceptIds: Set<string> } {
  const state = blankState(seed);
  const introducedConceptIds = new Set<string>();
  let patientCount = 0;

  while (true) {
    const selection = selectRoutineClinicalCase(
      state,
      cases,
      FIXED_REAL_TIME_MS,
    );
    if (!selection) break;
    for (const conceptId of uniqueConceptIds(selection.clinicalCase)) {
      introducedConceptIds.add(conceptId);
      markConceptReviewedNotDue(state, conceptId);
    }
    state.routineArrivalSequence += 1;
    patientCount += 1;
    if (patientCount > cases.length) {
      throw new Error("Routine selection did not reach a bounded exhaustion point.");
    }
  }

  return { patientCount, introducedConceptIds };
}

function unseenPatientBoundary(
  cases: readonly SyntheticClinicalCase[],
  stageLabel: string,
): { minimum: number; maximum: number } {
  const counts = Array.from({ length: 16 }, (_, index) =>
    exhaustUnseenSupply(cases, `${stageLabel}.${index}`).patientCount,
  );
  return { minimum: Math.min(...counts), maximum: Math.max(...counts) };
}

function preparedLevelOneClinic(seed: string): GameState {
  const state = blankState(seed);
  state.facilityLevel = 1;
  state.rooms.push({
    id: "room.patient-supply.examination",
    roomDefinitionId: "room.examination",
    x: 34,
    y: 26,
    orientation: 0,
    doorSide: "south",
    upgradeLevel: 1,
    cleanliness: 100,
  });
  state.doors.push({
    id: "door.patient-supply.examination",
    roomId: "room.patient-supply.examination",
    side: "south",
    offset: 1,
    exterior: false,
  });
  state.nextRoutineArrivalTick = 1;
  return state;
}

function advance(state: GameState, operationId: string): GameState {
  return gameReducer(state, {
    type: "ADVANCE_TICK",
    operationId,
    advancedAtRealMs: FIXED_REAL_TIME_MS,
  });
}

function admitAndCompleteAtDay(
  state: GameState,
  dayNumber: 6 | 7 | 8,
  answerCorrectly: boolean,
): {
  state: GameState;
  encounterId: string;
  arrivalTick: number;
  answerCount: number;
} {
  const existingIds = new Set(Object.keys(state.encounters));
  state.facilityTick = (dayNumber - 1) * OPERATING_MINUTES_PER_DAY - 1;
  state.nextRoutineArrivalTick = state.facilityTick + 1;
  let next = advance(state, `patient-supply.day-${dayNumber}.arrival`);
  const encounter = Object.values(next.encounters).find(
    (candidate) => !existingIds.has(candidate.id),
  );
  if (!encounter) throw new Error(`Day ${dayNumber} did not admit a patient.`);
  const arrivalTick = encounter.waiting.arrivedAtTick;
  next.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  let answerCount = 0;

  for (let operation = 0; operation < 2_000; operation += 1) {
    const current = next.encounters[encounter.id]!;
    const prefix = `patient-supply.day-${dayNumber}.${operation}`;
    if (current.lifecycle === "resolved_summary_available") {
      next = gameReducer(next, {
        type: "ACKNOWLEDGE_TERMINAL_FEEDBACK",
        operationId: `${prefix}.terminal`,
        encounterId: current.id,
      });
      next = gameReducer(next, {
        type: "CLOSE_CHART",
        operationId: `${prefix}.close`,
        encounterId: current.id,
      });
      expect(next.operationReceipts[`${prefix}.close`]?.status).toBe("applied");
      return { state: next, encounterId: current.id, arrivalTick, answerCount };
    }
    const step = current.steps[current.currentNodeIndex];
    if (step?.status === "feedback_pending") {
      next = gameReducer(next, {
        type: "ACKNOWLEDGE_DECISION_FEEDBACK",
        operationId: `${prefix}.feedback`,
        encounterId: current.id,
        decisionNodeId: step.decisionNodeId,
      });
      expect(next.operationReceipts[`${prefix}.feedback`]?.status).toBe("applied");
      continue;
    }
    const question = getCurrentQuestion(next, current.id);
    if (question) {
      const choice = question.node.answerChoices.find(
        (candidate) => candidate.isCorrect === answerCorrectly,
      )!;
      next = gameReducer(next, {
        type: "SUBMIT_ANSWER",
        operationId: `${prefix}.answer`,
        encounterId: current.id,
        decisionNodeId: question.node.id,
        answerChoiceId: choice.id,
        reviewedAtMs: FIXED_REAL_TIME_MS,
      });
      expect(next.operationReceipts[`${prefix}.answer`]?.status).toBe("applied");
      answerCount += 1;
      continue;
    }
    if (
      next.openChartEncounterId !== current.id &&
      (current.checkInStatus === "checked_in" ||
        current.lifecycle === "active_action_required")
    ) {
      next = gameReducer(next, {
        type: "OPEN_CHART",
        operationId: `${prefix}.open`,
        encounterId: current.id,
      });
      expect(next.operationReceipts[`${prefix}.open`]?.status).toBe("applied");
      continue;
    }
    next = advance(next, `${prefix}.tick`);
  }
  throw new Error(`Day ${dayNumber} patient did not complete within 2,000 operations.`);
}

// Round-four concept identities and keyed studies intentionally change the seeded
// synthetic arrival/coverage trace. Keep every numeric/ID snapshot and all positive
// arrival/completion/walkout checks; future paired companions remain ineligible.
describe("routine patient supply", () => {
  it("records the current clinical inventory and exact unseen-patient boundary by stage", () => {
    const release = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease;
    // Three round-six constructs retain all 389 entry definitions and histories.
    // Two flag-driven construct versions retain all 396 earlier definitions.
    // Fourteen application constructs retain all 398 earlier definitions.
    // Batch 2a adds two changed scored constructs; all 412 prior IDs remain.
    // Final flag round retains eight new constructs; N1 separately appends forty.
    // N2 adds thirty-nine independent Level 3/4 identities with one case/node each.
    // N1 round two retains old definitions and adds six proposed changed-meaning versions.
    // N2 round two keeps 16 meanings and adds 21 proposed changed-meaning versions.
    expect(release.concepts).toHaveLength(462 + 39 + 6 + 6 + 7 + 21 + 5 + 17);
    // The current old bank includes the concurrent interpreter pairing:
    // 1,008 existing cases, 62 Level-3 cases, 20 L4 pediatric variants
    // and 20 Variety-3 adult clinic/outside-plan variants.
    // The reused midline-recognition concept adds no second concept record.
    expect(release.cases).toHaveLength(1008 + 62 + 20 + 20 + 40 + 39);
    expect(release.cases.flatMap((item) => item.decisionNodes)).toHaveLength(1463 + 39);

    const noCapabilities = new Set<string>();
    const everyCapability = new Set(
      release.cases.flatMap((clinicalCase) => clinicalCase.requiredCapabilityIds),
    );
    const stageZeroCases = routineCasesAtStage(0, noCapabilities);
    const stageOneCases = routineCasesAtStage(1, noCapabilities);
    const stageTwoExternalCases = routineCasesAtStage(2, noCapabilities);
    const stageTwoAllCases = routineCasesAtStage(2, everyCapability);

    const stageConceptIds = (cases: readonly SyntheticClinicalCase[]) =>
      new Set(cases.flatMap((clinicalCase) => uniqueConceptIds(clinicalCase)));

    const stageZeroSupply = exhaustUnseenSupply(stageZeroCases, "stage-zero");
    const stageOneSupply = exhaustUnseenSupply(stageOneCases, "stage-one");
    const stageTwoExternalSupply = exhaustUnseenSupply(
      stageTwoExternalCases,
      "stage-two-external",
    );
    const stageTwoAllSupply = exhaustUnseenSupply(
      stageTwoAllCases,
      "stage-two-all",
    );
    const strandedConceptIds = (
      cases: readonly SyntheticClinicalCase[],
      introduced: ReadonlySet<string>,
    ) => [...stageConceptIds(cases)]
      .filter((conceptId) => !introduced.has(conceptId))
      .sort();
    const routineConceptIds = new Set(
      stageTwoAllCases.flatMap((clinicalCase) => uniqueConceptIds(clinicalCase)),
    );
    const n2Ids = new Set(QUESTION_NEW_N2_TESTED_CONCEPTS.map(concept => concept.id));
    const n1RoundTwoIds = new Set(QUESTION_NEW_N1_ROUND2_NEW_CONCEPT_VERSIONS.map(concept => concept.id));
    expect(n1RoundTwoIds.size).toBe(6);
    for (const conceptId of n1RoundTwoIds) expect(routineConceptIds.has(conceptId)).toBe(false);
    const n2RoundTwoIds = new Set(QUESTION_NEW_N2_ROUND2_NEW_CONCEPT_VERSIONS.map(concept => concept.id));
    expect(n2RoundTwoIds.size).toBe(21);
    for (const conceptId of n2RoundTwoIds) expect(routineConceptIds.has(conceptId)).toBe(false);
    const n1RoundThreeIds = new Set(QUESTION_NEW_N1_ROUND3_NEW_CONCEPT_VERSIONS.map(concept => concept.id));
    expect(n1RoundThreeIds.size).toBe(17);
    for (const conceptId of n1RoundThreeIds) expect(routineConceptIds.has(conceptId)).toBe(false);
    // Preserve the complete prior early-stage snapshot, with N2 explicitly
    // checked outside that pool rather than duplicating 39 late-stage IDs in it.
    expect(n2Ids.size).toBe(39);
    for (const conceptId of n2Ids) expect(routineConceptIds.has(conceptId)).toBe(false);
    const conceptRecordCounts = new Map<string, number>();
    for (const concept of release.concepts) {
      conceptRecordCounts.set(
        concept.id,
        (conceptRecordCounts.get(concept.id) ?? 0) + 1,
      );
    }

    expect({
      stageZero: {
        cases: stageZeroCases.length,
        availableConcepts: stageConceptIds(stageZeroCases).size,
        introducedConcepts: stageZeroSupply.introducedConceptIds.size,
        strandedConceptIds: strandedConceptIds(stageZeroCases, stageZeroSupply.introducedConceptIds),
        seededPatientsUntilNotDue: stageZeroSupply.patientCount,
        patientBoundaryAcrossSeeds: unseenPatientBoundary(stageZeroCases, "stage-zero-range"),
      },
      stageOne: {
        cases: stageOneCases.length,
        availableConcepts: stageConceptIds(stageOneCases).size,
        introducedConcepts: stageOneSupply.introducedConceptIds.size,
        strandedConceptIds: strandedConceptIds(stageOneCases, stageOneSupply.introducedConceptIds),
        seededPatientsUntilNotDue: stageOneSupply.patientCount,
        patientBoundaryAcrossSeeds: unseenPatientBoundary(stageOneCases, "stage-one-range"),
      },
      stageTwoExternal: {
        cases: stageTwoExternalCases.length,
        availableConcepts: stageConceptIds(stageTwoExternalCases).size,
        introducedConcepts: stageTwoExternalSupply.introducedConceptIds.size,
        strandedConceptIds: strandedConceptIds(stageTwoExternalCases, stageTwoExternalSupply.introducedConceptIds),
        seededPatientsUntilNotDue: stageTwoExternalSupply.patientCount,
        patientBoundaryAcrossSeeds: unseenPatientBoundary(stageTwoExternalCases, "stage-two-external-range"),
      },
      stageTwoAllCapabilities: {
        cases: stageTwoAllCases.length,
        availableConcepts: stageConceptIds(stageTwoAllCases).size,
        introducedConcepts: stageTwoAllSupply.introducedConceptIds.size,
        strandedConceptIds: strandedConceptIds(stageTwoAllCases, stageTwoAllSupply.introducedConceptIds),
        seededPatientsUntilNotDue: stageTwoAllSupply.patientCount,
        patientBoundaryAcrossSeeds: unseenPatientBoundary(stageTwoAllCases, "stage-two-all-range"),
      },
      conceptsWithoutEarlyRoutineCasesBeforeN2AndN1RoundTwo: release.concepts
        .map((concept) => concept.id)
        // R3 identities are asserted outside the early pool above; keep the earlier
        // historical snapshot separate from these new late-level versions.
        .filter((conceptId) => !routineConceptIds.has(conceptId) && !n2Ids.has(conceptId) && !n1RoundTwoIds.has(conceptId) && !n2RoundTwoIds.has(conceptId) && !n1RoundThreeIds.has(conceptId))
        .sort(),
      duplicateConceptRecordIds: [...conceptRecordCounts.entries()]
        .filter(([, count]) => count > 1)
        .sort(([left], [right]) => left.localeCompare(right)),
    }).toMatchInlineSnapshot(`
{
  "conceptsWithoutEarlyRoutineCasesBeforeN2AndN1RoundTwo": [
    "concept.achalasia.high-resolution-manometry",
    "concept.achalasia.high-resolution-manometry.v3",
    "concept.achalasia.physiology-directed-treatment.v1",
    "concept.adrenal-incidentaloma.cortisol-etiologic-classification.v1",
    "concept.breast-imaging.suspicious-calcification-pattern",
    "concept.breast-imaging.suspicious-mass-morphology",
    "concept.breast-mass.age-30-to-39.initial-diagnostic-imaging",
    "concept.chylous-ascites.fluid-confirmation",
    "concept.cirrhosis.new-fluid-elective-plan.v1",
    "concept.colonic-lipoma.endoscopic-recognition",
    "concept.colonic-lipoma.endoscopic-recognition.v2",
    "concept.dtc.cystic-node-repeat-sampling.v1",
    "concept.dtc.cystic-node-repeat-sampling.v2",
    "concept.esophageal-physiology.reserve-before-junction-intervention.v1",
    "concept.groin-ultrasound.symptom-provocation-protocol.v1",
    "concept.gs028g.hiv-perioperative.art-continuity",
    "concept.gs028g.hiv-perioperative.booster-midazolam-interaction",
    "concept.gs028g.hiv-perioperative.booster-midazolam-interaction.v2",
    "concept.gs028g.incidental-gallbladder.completely-resected-t1a",
    "concept.gs028g.incidental-gallbladder.t1a-depth",
    "concept.gs028g.incisional-hernia.fascial-closure",
    "concept.gs028g.incisional-hernia.retrorectus-plane",
    "concept.gs028g.laparoscopy-respiratory.co2-absorption",
    "concept.gs028g.laparoscopy-respiratory.diaphragm-compliance",
    "concept.gs028g.merkel-cell.clinically-negative-node-staging",
    "concept.gs028g.merkel-cell.integrated-diagnosis",
    "concept.gs028g.mucocutaneous-separation.recognition",
    "concept.gs028g.mucocutaneous-separation.superficial-care",
    "concept.gs028g.neuromuscular-recovery.quantitative-assessment",
    "concept.gs028g.neuromuscular-recovery.sugammadex-selectivity",
    "concept.gs028g.peristomal-skin.effluent-irritation",
    "concept.gs028g.peristomal-skin.restore-seal",
    "concept.gs028g.postoperative-scapula.long-thoracic",
    "concept.gs028g.postoperative-scapula.spinal-accessory",
    "concept.gs028g.subtotal-cholecystectomy.remnant-classification",
    "concept.gs028g.subtotal-cholecystectomy.safe-bailout",
    "concept.hyperacute-rejection.archived-crossmatch-provenance.v1",
    "concept.inguinal-hernia.direct-operative-anatomy",
    "concept.inguinal-hernia.equivocal-exam-ultrasound",
    "concept.inguinal-hernia.symptomatic-elective-repair",
    "concept.inguinal-hernia.symptomatic-elective-repair.v2",
    "concept.laparoscopy.position-gas-integration.v1",
    "concept.lymphangitis.distal-source-imaging.v1",
    "concept.meckel-diverticulum.resection-extent",
    "concept.n1.aldosterone-overt-phenotype-confirmation",
    "concept.n1.burn-evolving-hand-depth-reassessment",
    "concept.n1.celiac-hla-positive-boundary",
    "concept.n1.celiac-iga-deficient-serology",
    "concept.n1.celiac-restricted-diet-test-interpretation",
    "concept.n1.gallbladder-muscle-invasion-referral",
    "concept.n1.gastric-adjacent-organ-resection-assessment",
    "concept.n1.gastric-emptying-structural-prerequisite",
    "concept.n1.graves-symptom-versus-hormone-control",
    "concept.n1.hcc-portal-hypertension-referral",
    "concept.n1.lymphedema-new-tempo-venous-assessment",
    "concept.n1.neck-mass-core-after-inadequate-fna",
    "concept.n1.oxygen-saturation-missing-hemoglobin-assessment",
    "concept.n1.perioperative-respiratory-acid-base-trajectory",
    "concept.n1.post-ileus-nutrition-route-reassessment",
    "concept.n1.provoked-dvt-filter-versus-anticoagulation",
    "concept.n1.time-dependent-inhibitor-factor-assessment",
    "concept.osa.discordant-screen-documentation.v1",
    "concept.pediatric-clinic.acquired-testis-ascent-referral",
    "concept.pediatric-clinic.concerning-neck-node-referral",
    "concept.pediatric-clinic.developmental-assent-discussion",
    "concept.pediatric-clinic.inguinal-hernia-referral",
    "concept.pediatric-clinic.limited-pilonidal-conservative-care",
    "concept.pediatric-clinic.pectus-carinatum-brace-assessment",
    "concept.pediatric-clinic.reactive-neck-node-observation",
    "concept.pediatric-clinic.symptomatic-pectus-excavatum-evaluation",
    "concept.pediatric-clinic.true-retractile-testis-surveillance",
    "concept.phyllodes.benign-complete-excision",
    "concept.phyllodes.benign-positive-margin-management",
    "concept.phyllodes.borderline-close-margin-management",
    "concept.phyllodes.borderline-margin-target",
    "concept.phyllodes.hematogenous-spread-pattern",
    "concept.phyllodes.malignant-close-margin-management",
    "concept.phyllodes.malignant-margin-target",
    "concept.phyllodes.no-routine-axillary-staging",
    "concept.phyllodes.suspicious-node-biopsy-exception",
    "concept.pigmented-skin-lesion.complete-diagnostic-biopsy",
    "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v2",
    "concept.postlaparoscopy.shoulder-pain-biliary-localization.v1",
    "concept.postoperative-ascites.cross-sectional-evaluation",
    "concept.postoperative-chylous-ascites.initial-hospital-management",
    "concept.postoperative-ileus.parenteral-nutrition-when-enteral-infeasible",
    "concept.pseudocyst.contrast-ct-characterization",
    "concept.pseudocyst.symptomatic-endoscopic-drainage",
    "concept.quality-improvement.pdsa-act-and-iterate",
    "concept.quality-improvement.source-by-method-next-pilot.v1",
    "concept.severe-burn.early-enteral-nutrition",
    "concept.soft-tissue-mass.extremity-mri.v3",
    "concept.statistics-ethics.bias-confounding",
    "concept.statistics-ethics.chi-square",
    "concept.statistics-ethics.confidence-interval",
    "concept.statistics-ethics.errors-power",
    "concept.statistics-ethics.fisher-exact",
    "concept.statistics-ethics.independent-t",
    "concept.statistics-ethics.one-way-anova",
    "concept.statistics-ethics.p-value",
    "concept.statistics-ethics.p-value.v2",
    "concept.statistics-ethics.paired-t",
    "concept.statistics-ethics.qi-measures",
    "concept.statistics-ethics.rank-sum",
    "concept.statistics-ethics.risk-ratio-odds-ratio",
    "concept.statistics-ethics.signed-rank",
    "concept.statistics-ethics.study-design",
    "concept.thoracic-trauma.right-thoracotomy-exposure",
    "concept.trauma-vka.concurrent-iv-vitamin-k",
    "concept.trauma-vka.four-factor-pcc-selection",
    "concept.varicose-veins.axial-trunk-referral-target.v1",
    "concept.varicose-veins.reflux-after-compression-study.v1",
    "concept.variety3.penicillin-label-structured-history",
    "concept.variety3.surgical-hair-preparation",
    "concept.ventral-hernia.controlled-enterotomy-macroporous-synthetic-mesh-selection",
  ],
  "duplicateConceptRecordIds": [],
  "stageOne": {
    "availableConcepts": 317,
    "cases": 882,
    "introducedConcepts": 310,
    "patientBoundaryAcrossSeeds": {
      "maximum": 248,
      "minimum": 243,
    },
    "seededPatientsUntilNotDue": 249,
    "strandedConceptIds": [
      "concept.achalasia.high-resolution-manometry.v2",
      "concept.colon-cancer.preoperative-cross-sectional-staging",
      "concept.felty-syndrome.splenectomy-for-refractory-infections",
      "concept.fhh.biochemical-evaluation",
      "concept.inguinal-hernia.recurrence-after-anterior-repair.v1",
      "concept.soft-tissue-mass.extremity-mri",
      "concept.soft-tissue-mass.extremity-mri.v2",
    ],
  },
  "stageTwoAllCapabilities": {
    "availableConcepts": 365,
    "cases": 964,
    "introducedConcepts": 354,
    "patientBoundaryAcrossSeeds": {
      "maximum": 282,
      "minimum": 267,
    },
    "seededPatientsUntilNotDue": 273,
    "strandedConceptIds": [
      "concept.breast-cyst.symptomatic-simple-aspiration",
      "concept.colon-cancer.preoperative-cross-sectional-staging.v2",
      "concept.esophageal-physiology.integrated-pressure-report.v2",
      "concept.groin-hernia.femoral-defect-repair-priority.v1",
      "concept.groin-ultrasound.proximal-neck-localization.v2",
      "concept.inflammatory-breast-cancer.core-biopsy-confirmation.v2",
      "concept.inguinal-hernia.recurrence-after-anterior-repair.v1",
      "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v4",
      "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v5",
      "concept.soft-tissue-mass.extremity-mri",
      "concept.soft-tissue-mass.extremity-mri.v4",
    ],
  },
  "stageTwoExternal": {
    "availableConcepts": 338,
    "cases": 926,
    "introducedConcepts": 331,
    "patientBoundaryAcrossSeeds": {
      "maximum": 261,
      "minimum": 255,
    },
    "seededPatientsUntilNotDue": 261,
    "strandedConceptIds": [
      "concept.colon-cancer.preoperative-cross-sectional-staging.v2",
      "concept.esophageal-physiology.integrated-pressure-report.v2",
      "concept.fhh.biochemical-evaluation",
      "concept.inflammatory-breast-cancer.core-biopsy-confirmation",
      "concept.inguinal-hernia.recurrence-after-anterior-repair.v1",
      "concept.soft-tissue-mass.extremity-mri",
      "concept.soft-tissue-mass.extremity-mri.v2",
    ],
  },
  "stageZero": {
    "availableConcepts": 194,
    "cases": 636,
    "introducedConcepts": 194,
    "patientBoundaryAcrossSeeds": {
      "maximum": 181,
      "minimum": 173,
    },
    "seededPatientsUntilNotDue": 182,
    "strandedConceptIds": [],
  },
}
`);
  }, hostedTime(10_000));

  it("does not let an ineligible multistep case strand other eligible content", () => {
    const cases = routineCasesAtStage(1, new Set());
    const blockedCase = cases.find(
      (clinicalCase) => uniqueConceptIds(clinicalCase).length > 1,
    )!;
    const blockedConceptIds = new Set(uniqueConceptIds(blockedCase));
    const eligibleCase = cases.find((clinicalCase) =>
      uniqueConceptIds(clinicalCase).every(
        (conceptId) => !blockedConceptIds.has(conceptId),
      ),
    )!;
    const state = blankState("mixed-eligible-pool");
    markConceptReviewedNotDue(state, uniqueConceptIds(blockedCase)[0]!);

    const selection = selectRoutineClinicalCase(
      state,
      [blockedCase, eligibleCase],
      FIXED_REAL_TIME_MS,
    );

    expect(selection?.clinicalCase.id).toBe(eligibleCase.id);
    expect(selection?.kind).toBe("new_concept");
  });

  it("keeps legacy objectives displaced by the deterministic snapshot individually eligible", () => {
    const release = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease;
    const everyCapability = new Set(
      release.cases.flatMap((clinicalCase) => clinicalCase.requiredCapabilityIds),
    );
    for (const [targetId, cases] of [
      ["concept.felty-syndrome.splenectomy-for-refractory-infections", routineCasesAtStage(0, new Set())],
      ["concept.fhh.biochemical-evaluation", routineCasesAtStage(0, new Set())],
      ["concept.breast-cyst.symptomatic-simple-aspiration", routineCasesAtStage(2, everyCapability)],
    ] as const) {
      const state = blankState(`legacy-individual.${targetId}`);
      const targetCases = cases.filter((clinicalCase) =>
        uniqueConceptIds(clinicalCase).includes(targetId),
      );
      expect(targetCases.length, `${targetId} retains an eligible routine case`).toBeGreaterThan(0);
      const selection = selectRoutineClinicalCase(state, targetCases, FIXED_REAL_TIME_MS);
      expect(selection, `${targetId} retains its original eligible case path`).not.toBeNull();
      expect(uniqueConceptIds(selection!.clinicalCase)).toContain(targetId);
    }
  });

  it("admits and completes patients in prepared day-six through day-eight states", () => {
    let state = preparedLevelOneClinic("day-eight");
    const observations = [];
    // These targeted states isolate the day-number boundary from elapsed-time
    // supply. The sustained no-reset run is retained as an ignored diagnostic
    // receipt under .local-dev/gs-017-patient-supply-diagnostic.test.ts.
    for (const [dayNumber, answerCorrectly] of [
      [6, false],
      [7, true],
      [8, false],
    ] as const) {
      const result = admitAndCompleteAtDay(state, dayNumber, answerCorrectly);
      state = result.state;
      observations.push({
        dayNumber,
        arrivalTick: result.arrivalTick,
        answerCorrectly,
        answerCount: result.answerCount,
        resolutionReason: state.encounters[result.encounterId]!.resolutionReason,
      });
    }

    expect(observations).toMatchInlineSnapshot(`
[
  {
    "answerCorrectly": false,
    "answerCount": 2,
    "arrivalTick": 3000,
    "dayNumber": 6,
    "resolutionReason": "completed",
  },
  {
    "answerCorrectly": true,
    "answerCount": 2,
    "arrivalTick": 3600,
    "dayNumber": 7,
    "resolutionReason": "completed",
  },
  {
    "answerCorrectly": false,
    "answerCount": 1,
    "arrivalTick": 4200,
    "dayNumber": 8,
    "resolutionReason": "completed",
  },
]
`);
    expect(observations.every((item) => item.answerCount > 0)).toBe(true);
    expect(observations.every((item) => item.resolutionReason === "completed")).toBe(true);
  }, hostedTime(30_000));
});
