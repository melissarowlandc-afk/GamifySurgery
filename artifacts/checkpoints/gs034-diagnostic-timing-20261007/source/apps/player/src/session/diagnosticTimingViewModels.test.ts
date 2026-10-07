import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  gameReducer,
  getAnswerChoiceServicePreview,
  getDiagnosticOrderTiming,
  type GameState,
} from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";

function actionable(caseId: string) {
  const state = createInitialGameState();
  state.facilityLevel = 3;
  state.cash = 10_000; state.cashCents = 1_000_000;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  const encounter = structuredClone(Object.values(state.encounters)[0]!);
  encounter.id = "encounter.timing.presentation";
  encounter.frozenCase = structuredClone(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((entry) => entry.id === caseId)!);
  encounter.arrivalClass = "routine"; encounter.checkInStatus = "checked_in";
  encounter.lifecycle = "active_action_required"; encounter.currentNodeIndex = 0;
  encounter.patientMovement = null; encounter.patientLocation = { ...state.environment.founderLocation };
  encounter.assignedRoomInstanceId = null; encounter.terminalFeedback = null;
  encounter.steps = encounter.frozenCase.decisionNodes.map((node, nodeIndex) => ({
    nodeIndex, decisionNodeId: node.id, questionVariantId: node.questionVariantId, primaryConceptId: node.primaryConceptId,
    status: nodeIndex === 0 ? "action_required" : "locked", answer: null, result: null,
  }));
  state.encounters = { [encounter.id]: encounter };
  state.openChartEncounterId = encounter.id;
  return state;
}

function accepted(caseId: string) {
  let state = actionable(caseId);
  const encounter = Object.values(state.encounters)[0]!;
  const node = encounter.frozenCase.decisionNodes[0]!;
  state = gameReducer(state, { type: "SUBMIT_ANSWER", operationId: "timing.presentation.answer", encounterId: encounter.id,
    decisionNodeId: node.id, answerChoiceId: node.answerChoices.find((choice) => choice.isCorrect)!.id });
  state = gameReducer(state, { type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: "timing.presentation.ack",
    encounterId: encounter.id, decisionNodeId: node.id });
  expect(state.operationReceipts["timing.presentation.ack"]?.status).toBe("applied");
  return state;
}

function procedureSnapshot(state: GameState) {
  const encounter = Object.values(state.encounters)[0]!;
  const plan = encounter.pendingResult!.diagnosticTiming!;
  const procedure = plan.phases.find((phase) => phase.kind === "procedure")!;
  state.facilityTick = procedure.forecast.endsAtTick;
  for (const phase of plan.phases) {
    if (phase.forecast.endsAtTick > state.facilityTick || phase.kind === "pathology") continue;
    phase.status = "completed"; phase.remainingMinutes = 0;
    phase.startedAtTick = phase.forecast.startsAtTick; phase.completedAtTick = phase.forecast.endsAtTick;
  }
  plan.visualResultReady!.reachedAtTick = state.facilityTick;
  if (plan.resultReady.afterPhaseIds.includes(procedure.id)) plan.resultReady.reachedAtTick = state.facilityTick;
  const pathology = plan.phases.find((phase) => phase.kind === "pathology");
  if (pathology) { pathology.status = "active"; pathology.startedAtTick = state.facilityTick; }
  encounter.patientMovement = null; encounter.patientLocation = null;
  encounter.steps[0]!.result = structuredClone(encounter.pendingResult);
  return { encounter, plan };
}

function view(state: GameState) {
  return createPrototypePlayerView(state, Object.values(state.encounters)[0]!.id, false, null).chart!;
}

describe("diagnostic chart and facility presentation", () => {
  it("uses each shared total in both answer lists, including distractors and walking", () => {
    const state = actionable("case.esophageal-dysphagia.bread-sticking");
    const encounter = Object.values(state.encounters)[0]!;
    const before = JSON.stringify(state);
    const chart = view(state);
    const stepChoices = chart.decisionSteps!.find((step) => step.current)!.answerChoices;
    for (const choice of chart.answerChoices) {
      const preview = getAnswerChoiceServicePreview(state, encounter.id, choice.id)!;
      const total = preview.durationTicks!;
      expect(choice.etaLabel).toBe(total >= 60 && total % 60 === 0
        ? `${total / 60} hour${total === 60 ? "" : "s"}` : `${total} min`);
      expect(stepChoices.find((entry) => entry.id === choice.id)).toMatchObject({ etaLabel: choice.etaLabel, detailLabel: choice.detailLabel });
    }
    expect(chart.answerChoices.find((choice) => choice.id === "egd_1")?.detailLabel).toContain("Pathology");
    expect(chart.answerChoices.find((choice) => choice.id === "egd_1")?.detailLabel).toContain("Travel");
    expect(JSON.stringify(state)).toBe(before);
  });

  it("shows a reached visual result during return while retaining the next-decision care gate", () => {
    const state = accepted("case.colorectal.routine-screen");
    const { encounter } = procedureSnapshot(state);
    const chart = view(state);
    expect(chart.pendingLabel).toContain(encounter.pendingResult!.resultNarrative);
    expect(chart.decisionSteps![0]!.resultBody).toContain(encounter.pendingResult!.resultNarrative);
    expect(chart.pendingLabel).toContain("Pathology (offsite)");
    expect(chart.pendingLabel).toContain("next decision waits for care completion");
    expect(chart.questionPrompt).toBeUndefined();
    expect(chart.answerChoices).toEqual([]);
    expect(encounter.currentNodeIndex).toBe(0);
  });

  it("uses actual visual-only phases instead of a historical route caption that implies pathology", () => {
    const state = accepted("case.recovered-diverticulitis.drained-abscess");
    const { encounter, plan } = procedureSnapshot(state);
    expect(plan.phases.some((phase) => phase.kind === "pathology")).toBe(false);
    const caption = "Onsite colonoscopy with external pathology";
    encounter.pendingResult!.routeDisplayName = caption;
    const chart = view(state);
    expect(chart.pendingLabel).toContain(encounter.pendingResult!.resultNarrative);
    expect(chart.pendingLabel).not.toContain(caption);
    expect(chart.pendingLabel).not.toContain("external pathology");
    expect(encounter.pendingResult!.routeDisplayName).toBe(caption);
  });

  it("keeps background pathology visible after visual delivery unlocks the next decision", () => {
    const state = accepted("case.colorectal.routine-screen");
    const { encounter, plan } = procedureSnapshot(state);
    for (const id of plan.careComplete.afterPhaseIds) {
      const phase = plan.phases.find((entry) => entry.id === id)!;
      phase.status = "completed"; phase.completedAtTick = state.facilityTick; phase.remainingMinutes = 0;
    }
    plan.careComplete.reachedAtTick = state.facilityTick;
    encounter.pendingResult!.deliveredAtTick = state.facilityTick;
    encounter.steps[0]!.status = "completed"; encounter.steps[0]!.result = structuredClone(encounter.pendingResult);
    encounter.currentNodeIndex = 1; encounter.steps[1]!.status = "action_required";
    encounter.lifecycle = "active_action_required"; encounter.patientLocation = { ...state.environment.founderLocation };
    const chart = view(state);
    expect(chart.questionPrompt).toBeDefined();
    expect(chart.pendingLabel).toContain("collected pathology continues separately");
    expect(chart.pendingPatientIsAway).toBe(false);
    expect(chart.decisionSteps![0]!.collapsedResultLabel).toContain("Collected pathology pending");
    expect(chart.decisionSteps![0]!.resultBody).toContain("Pathology (offsite)");
    expect(chart.etaLabel).toContain("remaining (game time)");
  });

  it("does not reveal combined biopsy prose when only the visual milestone is reached", () => {
    const state = accepted("case.esophageal-dysphagia.bread-sticking");
    const { encounter } = procedureSnapshot(state);
    const chart = view(state);
    expect(chart.pendingLabel).toContain("Visual findings are available");
    expect(chart.pendingLabel).not.toContain(encounter.pendingResult!.resultNarrative);
    expect(chart.decisionSteps![0]!.resultBody).not.toContain(encounter.pendingResult!.resultNarrative);
    expect(chart.questionPrompt).toBeUndefined();
  });

  it("shows no finite total countdown when a frozen local pathology phase loses capacity", () => {
    const state = accepted("case.esophageal-dysphagia.bread-sticking");
    const { encounter, plan } = procedureSnapshot(state);
    const pathology = plan.phases.find((phase) => phase.kind === "pathology")!;
    pathology.mode = "local"; pathology.status = "queued"; pathology.startedAtTick = null; pathology.resource = null;
    pathology.requirement = { roomDefinitionId: "room.laboratory", staffRoleDefinitionIds: ["staff.laboratory_technician"],
      providerRoleDefinitionIds: [], founderEligible: false, stationKind: null };
    encounter.steps[0]!.result = structuredClone(encounter.pendingResult);
    expect(getDiagnosticOrderTiming(state, encounter.id)?.blocked).toBe(true);
    const chart = view(state);
    expect(chart.etaLabel).toBeUndefined();
    expect(chart.decisionSteps![0]!.etaLabel).toBeUndefined();
    expect(chart.pendingLabel).toContain("full time estimate is unavailable");
    expect(chart.pendingLabel).toContain("Pathology (onsite): waiting for capacity");
  });

  it("shows a terminal endoscopy order after an earlier laboratory result has been delivered", () => {
    let state = accepted("case.iron-deficiency.adult-man-fatigue");
    const encounter = Object.values(state.encounters)[0]!;
    const previousResult = encounter.pendingResult!;
    const previousPlan = previousResult.diagnosticTiming!;
    state.facilityTick = Math.max(...previousPlan.phases.map((phase) => phase.forecast.endsAtTick));
    for (const phase of previousPlan.phases) {
      phase.status = "completed"; phase.remainingMinutes = 0;
      phase.startedAtTick = phase.forecast.startsAtTick; phase.completedAtTick = phase.forecast.endsAtTick;
    }
    previousPlan.resultReady.reachedAtTick = state.facilityTick;
    previousPlan.careComplete.reachedAtTick = state.facilityTick;
    previousResult.deliveredAtTick = state.facilityTick;
    encounter.steps[0]!.status = "completed"; encounter.steps[0]!.result = structuredClone(previousResult);
    encounter.currentNodeIndex = 1; encounter.steps[1]!.status = "action_required";
    encounter.lifecycle = "active_action_required";
    encounter.patientLocation = { ...state.environment.founderLocation }; encounter.patientMovement = null;
    const node = encounter.frozenCase.decisionNodes[1]!;
    state = gameReducer(state, { type: "SUBMIT_ANSWER", operationId: "timing.presentation.terminal.answer",
      encounterId: encounter.id, decisionNodeId: node.id, answerChoiceId: "bidirectional_1" });
    expect(state.operationReceipts["timing.presentation.terminal.answer"]?.status).toBe("applied");
    if (state.encounters[encounter.id]!.steps[1]!.status === "feedback_pending") {
      state = gameReducer(state, { type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: "timing.presentation.terminal.ack",
        encounterId: encounter.id, decisionNodeId: node.id });
      expect(state.operationReceipts["timing.presentation.terminal.ack"]?.status).toBe("applied");
    }
    const currentEncounter = state.encounters[encounter.id]!;
    expect(currentEncounter.pendingResult?.diagnosticTiming?.orderId).toBe(previousPlan.orderId);
    expect(getDiagnosticOrderTiming(state, encounter.id)?.orderId).toBe(currentEncounter.terminalTestOrder?.diagnosticTiming?.orderId);
    expect(currentEncounter.terminalTestOrder?.diagnosticTiming?.orderId).not.toBe(previousPlan.orderId);
    const chart = view(state);
    expect(chart.pendingLabel).toContain("The result is pending.");
    expect(chart.pendingLabel).not.toContain(previousResult.resultNarrative);
    expect(chart.etaLabel).toContain("remaining (game time)");
  });

  it("presents the approved reading-room prices, four-reader capacity and functional upgrade benefits", () => {
    const state = createInitialGameState(); state.facilityLevel = 3; state.cash = 10_000; state.cashCents = 1_000_000;
    let facility = createPrototypePlayerView(state, null, false, null);
    expect(facility.roomOptions.find((room) => room.id === "room.reading")).toMatchObject({
      costLabel: "$1,800", upkeepLabel: "$24 upkeep / hr", footprintLabel: "4 × 4 tiles · 4 reading positions",
    });
    expect(facility.staffOptions.find((role) => role.id === "staff.radiologist")).toMatchObject({
      costLabel: "$300 hire", salaryLabel: "$26 salary / hr", blockedReason: "Build a Reading Room to add four radiologist positions.",
    });
    state.rooms.push({ id: "reading.presentation", roomDefinitionId: "room.reading", x: 20, y: 12,
      orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    state.rooms.push({ id: "laboratory.presentation", roomDefinitionId: "room.laboratory", x: 26, y: 12,
      orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    facility = createPrototypePlayerView(state, null, false, null, true, "laboratory.presentation");
    expect(facility.staffRoles.find((role) => role.id === "staff.radiologist")).toMatchObject({
      maximumCount: 4, staffingGuidance: expect.stringContaining("separate queue and reads one study at a time"),
    });
    expect(facility.selectedRoomBuild?.upgradeImprovements.join(" ")).toContain("diagnostic phase times stay fixed");
    expect(facility.selectedRoomBuild?.upgradeImprovements.join(" ")).not.toContain("faster");
    expect(facility.selectedRoomBuild?.upgradeImprovements.join(" ")).not.toContain("fixed fixtures");
    expect(facility.selectedRoomBuild?.upgradeImprovements.join(" ")).toContain("satisfaction");
  });
});
