import { createInitialGameState, PROTOTYPE_DOMAIN_CONTEXT, TUTORIAL_ENCOUNTER_ID, type EmployeeDiscussionState, type EncounterStepState } from "@gamify-surgery/game-domain";

export function scoredPatientFixture() {
  const state = createInitialGameState();
  const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
  encounter.lifecycle = "active_action_required"; encounter.patientMovement = null;
  state.openChartEncounterId = encounter.id; state.paused = true;
  return state;
}

export function scoredEmployeeFixture() {
  const state = createInitialGameState();
  const frozenCase = structuredClone(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((c) => c.participant?.kind === "employee_discussion")!);
  const discussion: EmployeeDiscussionState = {
    id: "discussion.usage-test", employeeId: "employee.usage-test", employeeDisplayName: "Synthetic Colleague",
    employeeAppearance: state.founder.appearance, clinicalReleaseId: "test", frozenCase,
    lifecycle: "active_action_required", createdAtFacilityTick: 0, firstOpenedAtTick: 0, resolvedAtFacilityTick: null,
    cancellationReason: null, currentNodeIndex: 0, answers: [],
    steps: frozenCase.decisionNodes.map((node, nodeIndex): EncounterStepState => ({ nodeIndex, decisionNodeId: node.id,
      questionVariantId: node.questionVariantId, primaryConceptId: node.primaryConceptId,
      status: nodeIndex === 0 ? "action_required" : "locked", answer: null, result: null })),
  };
  state.employeeDiscussions = { [discussion.id]: discussion }; state.openEmployeeDiscussionId = discussion.id; state.paused = true;
  return state;
}
