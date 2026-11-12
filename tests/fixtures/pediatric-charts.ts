import { PEDIATRIC_CLINIC_CASES, QUESTION_PROGRAM_BATCH5_RETAINED_CASES,
  QUESTION_PROGRAM_BATCH5_REPLACEMENTS, QUESTION_PROGRAM_BATCH5_CONSOLIDATIONS } from "@gamify-surgery/clinical-content";
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
  const authored = PEDIATRIC_CLINIC_CASES.find(clinicalCase => clinicalCase.id === caseId);
  if (!authored) throw new Error("Pediatric chart QA needs an admitted batch variant.");
  const current = context.clinicalRelease.cases.find(clinicalCase => clinicalCase.id === caseId);
  const retained = QUESTION_PROGRAM_BATCH5_RETAINED_CASES.find(clinicalCase => clinicalCase.id === caseId);
  const retired = QUESTION_PROGRAM_BATCH5_REPLACEMENTS.some(row => row.replaces === caseId) ||
    QUESTION_PROGRAM_BATCH5_CONSOLIDATIONS.some(row => row.replaces.includes(caseId));
  if (!current && (!retained || !retired)) throw new Error("Pediatric chart QA needs its exact retained source and retirement relation.");
  const clinicalCase = current ?? retained!;
  // This fixture opens the original M7 chart after its fresh replacement.
  // Keep the old question/profile identities while using the current reducer.
  const admissionContext = current ? context : {...context,
    clinicalRelease: {...context.clinicalRelease, cases: [...context.clinicalRelease.cases, clinicalCase]}};
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
    arrivalClass: "routine" }, admissionContext);
}
