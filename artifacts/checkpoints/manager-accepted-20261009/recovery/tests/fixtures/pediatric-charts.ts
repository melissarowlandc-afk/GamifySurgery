import { PEDIATRIC_CLINIC_CASES } from "@gamify-surgery/clinical-content";
import { gameReducer, type DomainContext, type GameCommand, type GameState } from "@gamify-surgery/game-domain";
import { createLevelFourRoomsQaContext, createLevelFourRoomsQaState } from "./level-four-rooms";

export const PEDIATRIC_CHARTS_QA_CAMPAIGN_ID = "campaign.qa.level-four-pediatric-charts-m7";
export const PEDIATRIC_CHARTS_QA_ENCOUNTER_ID = "encounter.qa.pediatric-chart.m7";
export const PEDIATRIC_CHARTS_QA_CASE_ID = "case.pediatric-clinic.groin-bulge-after-play";

function apply(state: GameState, command: GameCommand, context: DomainContext): GameState {
  const next = gameReducer(state, command, context);
  const receipt = next.operationReceipts[command.operationId];
  if (receipt?.status !== "applied") throw new Error(`Pediatric chart QA ${command.operationId}: ${receipt?.message}`);
  return next;
}

/** One real admitted draft chart. No APP appointments or substitute clinical fixture. */
export function createPediatricChartsQaState(
  context = createLevelFourRoomsQaContext(),
  caseId = PEDIATRIC_CHARTS_QA_CASE_ID,
): GameState {
  const clinicalCase = PEDIATRIC_CLINIC_CASES.find(clinicalCase => clinicalCase.id === caseId);
  if (!clinicalCase) throw new Error("Pediatric chart QA needs an admitted batch variant.");
  let state = createLevelFourRoomsQaState(context);
  state.campaignId = PEDIATRIC_CHARTS_QA_CAMPAIGN_ID;
  state.campaignSeed = "level-four-pediatric-charts-m7";
  for (const [roomDefinitionId, roomId, x, y, offset] of [
    ["room.pediatric_waiting", "room.peds.wait", 29, 22, 2],
    ["room.pediatric_examination", "room.peds.exam", 35, 23, 1],
  ] as const) {
    state = apply(state, { type: "PLACE_ROOM", operationId: `${roomId}.place`, roomId, roomDefinitionId, x, y, orientation: 0 }, context);
    state = apply(state, { type: "PLACE_DOOR", operationId: `${roomId}.door`, roomId,
      doorId: `${roomId}.door`, side: "south", offset }, context);
  }
  return apply(state, { type: "ADMIT_PATIENT", operationId: "peds.chart.qa.admit",
    encounterId: PEDIATRIC_CHARTS_QA_ENCOUNTER_ID, caseId, patientDisplayName: clinicalCase.patientDisplayName,
    arrivalClass: "routine" }, context);
}
