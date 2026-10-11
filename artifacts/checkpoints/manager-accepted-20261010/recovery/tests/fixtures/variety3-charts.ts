import { VARIETY3_CASES } from "@gamify-surgery/clinical-content";
import { gameReducer, type DomainContext, type GameCommand, type GameState } from "@gamify-surgery/game-domain";
import { createLevelFourRoomsQaContext, createLevelFourRoomsQaState } from "./level-four-rooms";

export const VARIETY3_CHARTS_QA_CAMPAIGN_ID = "campaign.qa.variety3-charts-20261010";
export const VARIETY3_CHARTS_QA_ENCOUNTER_ID = "encounter.qa.variety3-chart";
export const VARIETY3_CHARTS_QA_CASE_ID = "case.variety3.prep-incomplete-drink";

function apply(state: GameState, command: GameCommand, context: DomainContext): GameState {
  const next = gameReducer(state, command, context);
  const receipt = next.operationReceipts[command.operationId];
  if (receipt?.status !== "applied") throw new Error(`Variety-3 chart QA ${command.operationId}: ${receipt?.message}`);
  return next;
}

/** One real admitted outside-plan review, using the existing disposable QA entry only. */
export function createVariety3ChartsQaState(
  context = createLevelFourRoomsQaContext(),
  caseId = VARIETY3_CHARTS_QA_CASE_ID,
): GameState {
  const clinicalCase = VARIETY3_CASES.find(item => item.id === caseId);
  if (!clinicalCase) throw new Error("Variety-3 chart QA needs an admitted batch variant.");
  let state = createLevelFourRoomsQaState(context);
  state.campaignId = VARIETY3_CHARTS_QA_CAMPAIGN_ID;
  state.campaignSeed = "variety3-charts-20261010";
  state.facilityLevel = clinicalCase.earliestFacilityStage as GameState["facilityLevel"];
  state = apply(state, { type: "PLACE_ROOM", operationId: "variety3.qa.exam.place", roomId: "room.variety3.exam",
    roomDefinitionId: "room.examination", x: 35, y: 24, orientation: 0 }, context);
  state = apply(state, { type: "PLACE_DOOR", operationId: "variety3.qa.exam.door", roomId: "room.variety3.exam",
    doorId: "door.variety3.exam", side: "south", offset: 1 }, context);
  return apply(state, { type: "ADMIT_PATIENT", operationId: "variety3.qa.admit",
    encounterId: VARIETY3_CHARTS_QA_ENCOUNTER_ID, caseId,
    patientDisplayName: clinicalCase.patientDisplayName, arrivalClass: "routine" }, context);
}
