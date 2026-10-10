import { createInitialGameState, createPatientPixelAppearance, createPatientDisplayName, createPediatricFamily, gameReducer,
  type DomainContext, type GameState } from "@gamify-surgery/game-domain";
import { createLevelFourRoomsQaContext, createLevelFourRoomsQaState } from "./level-four-rooms";

export function createPediatricFamilyFixture(ageYears = 9, context: DomainContext = createLevelFourRoomsQaContext()) {
  let state = createLevelFourRoomsQaState(context);
  for (const [roomDefinitionId, roomId, x, y, offset] of [
    ["room.pediatric_waiting", "room.peds.wait", 29, 22, 2],
    ["room.pediatric_examination", "room.peds.exam", 35, 23, 1],
  ] as const) {
    state = gameReducer(state, { type: "PLACE_ROOM", operationId: `${roomId}.place`, roomId, roomDefinitionId, x, y, orientation: 0 }, context);
    state = gameReducer(state, { type: "PLACE_DOOR", operationId: `${roomId}.door`, roomId, doorId: `${roomId}.door`, side: "south", offset }, context);
    if (state.operationReceipts[`${roomId}.door`]?.status !== "applied") throw new Error("Pediatric fixture door failed.");
  }
  const encounter = structuredClone(Object.values(createInitialGameState(context).encounters)[0]!);
  encounter.id = "encounter.fixture.pediatric";
  encounter.frozenCase = { ...encounter.frozenCase, id: "case.fixture.pediatric", pediatricProfile: {
    version: "pediatric-patient-profile.v1", requiresParent: true, clinicalScope: "outpatient" },
    prototypeDemographics: { ageYears, sexLabel: "Female" }, prototypeVitalSigns: undefined,
    approvedInstantiationProfiles: undefined, selectedInstantiationProfileId: undefined, patientPresentationRevision: undefined,
    earliestFacilityStage: 4, tutorialEligible: false, routineEligible: false };
  encounter.patientAppearance = createPatientPixelAppearance(state.campaignSeed, encounter.id, encounter.frozenCase.prototypeDemographics);
  encounter.patientDisplayName = createPatientDisplayName(state.campaignSeed, encounter.id, "Female");
  encounter.checkInStatus = "checked_in"; encounter.patientMovement = null;
  encounter.patientLocation = { x: 35, y: 29 }; encounter.assignedRoomInstanceId = null;
  encounter.waiting.patienceExempt = true; encounter.waiting.departureDueTick = null;
  state.encounters[encounter.id] = encounter;
  const family = createPediatricFamily(state, encounter, "encounter");
  return { state, context, encounter, family };
}

export function pediatricMinute(state: GameState, context: DomainContext): GameState {
  return gameReducer({ ...state, paused: false }, { type: "ADVANCE_TICK", operationId: `peds.tick.${state.facilityTick + 1}` }, context);
}
