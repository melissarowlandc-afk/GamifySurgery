import { applyFsrsReview, createInitialGameState, gameReducer, getDefaultDoorOffset, getRoomCareAnchor, getRoomDefinition,
  planDiagnosticOrder, PROTOTYPE_DOMAIN_CONTEXT, serializeGameState, type GameCommand, type DiagnosticOrderPlan } from "@gamify-surgery/game-domain";
import { createLevelFourRoomsQaState } from "../../../../../tests/fixtures/level-four-rooms";
import { pending } from "../../../../../packages/game-domain/tests/diagnostic-timing-fixtures";
import { codecTestCampaign } from "./codecTestSupport";

/** Shipped geometry and fresh synthetic records only. No tester/owner data. */
export function numericClinic(legacyOverflow = false) {
  let state = createLevelFourRoomsQaState(PROTOTYPE_DOMAIN_CONTEXT);
  state.facilityLevel = 2; state.facilityTick = 3828; state.paused = true;
  const command = (input: GameCommand) => {
    state = gameReducer(state, input);
    if (state.operationReceipts[input.operationId]?.status !== "applied") throw new Error(state.operationReceipts[input.operationId]?.message);
  };
  for (const [name, x] of [["examination", 30], ["minor_procedure", 25]] as const) {
    const definition = getRoomDefinition(`room.${name}`)!;
    command({ type: "PLACE_ROOM", operationId: `numeric.place.${name}`, roomId: `numeric.${name}`, roomDefinitionId: definition.id,
      x, y: 26 - definition.height, orientation: 0 });
    const room = state.rooms.find(row => row.id === `numeric.${name}`)!;
    command({ type: "PLACE_DOOR", operationId: `numeric.door.${name}`, doorId: `numeric.door.${name}`, roomId: room.id,
      side: "south", offset: getDefaultDoorOffset(room, definition, "south") });
  }
  const encounter = structuredClone(Object.values(createInitialGameState().encounters)[0]!);
  encounter.id = "encounter.numeric.synthetic"; encounter.checkInStatus = "checked_in"; encounter.checkInWaitingSinceTick = null;
  encounter.lifecycle = "active_pending_result"; encounter.patientMovement = null;
  encounter.assignedRoomInstanceId = "numeric.examination";
  encounter.patientLocation = getRoomCareAnchor(state.rooms.find(room => room.id === "numeric.examination")!, getRoomDefinition("room.examination")!, "patient");
  state.encounters = { [encounter.id]: encounter };
  state.environment.founderActivity = { kind: "attend_encounter", targetId: "other.synthetic.chart", path: [state.environment.founderLocation],
    pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, workMinutesRemaining: Number.MAX_SAFE_INTEGER - 1 };
  const request = { orderId: "order.numeric.synthetic", encounterId: encounter.id, serviceId: "service.cutaneous_lesion_biopsy" };
  const quoteState = structuredClone(state);
  if (legacyOverflow) {
    // Exercise the old planner's finite-duration branch with exactly the same
    // decremented hold. The pre-fix planner used this branch for attendance too.
    quoteState.environment.founderActivity!.kind = "collect_litter";
  }
  const result = planDiagnosticOrder(quoteState, request);
  if (result.kind !== "planned") throw new Error(result.reason);
  const plan: DiagnosticOrderPlan = result.plan;
  const due = Math.ceil(Math.max(plan.resultReady.forecastAtTick, plan.careComplete.forecastAtTick));
  encounter.pendingResult = { ...pending(plan), operationId: plan.orderId, scheduledAtTick: state.facilityTick, dueTick: due,
    durationTicks: due - state.facilityTick, serviceDurationTicks: due - state.facilityTick };
  encounter.steps[0]!.result = structuredClone(encounter.pendingResult);
  const node = encounter.frozenCase.decisionNodes[0]!, history = state.learningHistories[node.primaryConceptId]!;
  const review = applyFsrsReview(history.card, "Good", 1_800_000_000_000, PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.learning);
  history.card = review.card;
  history.reviews.push({ id: "numeric.kept.review", encounterId: encounter.id, decisionNodeId: node.id,
    questionVariantId: node.questionVariantId, patientPresentationVariantId: encounter.frozenCase.patientPresentationVariantId,
    primaryConceptId: node.primaryConceptId, answerChoiceId: node.answerChoices[0]!.id, correct: true, rating: "Good",
    reviewedAtMs: 1_800_000_000_000, facilityTick: 3800, schedulerLog: review.log });
  const campaign = codecTestCampaign(serializeGameState(createInitialGameState(undefined, { campaignId: state.campaignId, campaignSeed: "numeric", createdAtRealMs: 0 })));
  return { state, campaign, encounter, plan, lineage: { branchId: "numeric.synthetic.branch", sequence: 266, parents: [] as string[] } };
}
