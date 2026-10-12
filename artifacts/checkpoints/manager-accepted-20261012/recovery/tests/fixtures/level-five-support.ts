import { advanceLevelThreeSupport, deserializeGameState, gameReducer, serializeGameState, tryStartPatientGardenRest, type DomainContext, type GameCommand, type GameState } from "@gamify-surgery/game-domain";
import { placeLevelFiveRoomsQaRooms } from "./level-five-rooms";

export const LEVEL_FIVE_SUPPORT_QA_CAMPAIGN_ID = "campaign.qa.level-five-support-m3";

function apply(state: GameState, command: GameCommand, context: DomainContext): GameState {
  const next = gameReducer(state, command, context);
  if (next.operationReceipts[command.operationId]?.status !== "applied") throw new Error(`Support QA ${command.operationId}: ${next.operationReceipts[command.operationId]?.message}`);
  return next;
}

/** Paid rooms/hire/admission; initial waiting locations are synthetic QA setup.
 * Real support dispatch freezes routes/tiers. No completed use or award is seeded. */
export function prepareLevelFiveSupportQaState(state: GameState, context: DomainContext): GameState {
  state = placeLevelFiveRoomsQaRooms(state, context);
  state = apply(state, { type: "HIRE_STAFF", operationId: "support.qa.hire.app", employeeId: "employee.level5.support.app", staffRoleDefinitionId: "staff.app" }, context);
  state.nextEmployeeDiscussionTick = state.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = state.environment.nextAmbientPedestrianTick = state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.founderActivity = null;
  for (const employee of state.employees) {
    // Skip the arrival for this bounded support preview, retaining the real home/name/pay.
    employee.location = { ...employee.path.at(-1)! };
    employee.pathIndex = employee.path.length - 1;
    employee.lastMovedAtFacilityTick = state.facilityTick;
    employee.nextIdleActionAtFacilityTick = Number.MAX_SAFE_INTEGER;
    state.retailNextOpportunityTicks[`employee:${employee.id}`] = Number.MAX_SAFE_INTEGER;
  }
  state.retailNextOpportunityTicks["founder:founder"] = Number.MAX_SAFE_INTEGER;
  // Dispatch both real gym contacts before patient check-in demand; care can preempt later.
  advanceLevelThreeSupport(state, context);
  const clinicalCase = context.clinicalRelease.cases.find(candidate => !candidate.tutorialEligible && !candidate.pediatricProfile && candidate.earliestFacilityStage <= 1)!;
  for (const [index, displayName] of ["Morgan Vale", "Jordan Ellis"].entries()) {
    const encounterId = `encounter.level5.support.${index}`;
    state = apply(state, { type: "ADMIT_PATIENT", operationId: `support.qa.admit.${index}`, encounterId,
      caseId: clinicalCase.id, patientDisplayName: displayName, arrivalClass: "routine" }, context);
    const encounter = state.encounters[encounterId]!;
    encounter.checkInStatus = "checked_in";
    encounter.patientLocation = { x: 39 + index * 4, y: 21 };
    encounter.patientMovement = null;
    encounter.assignedRoomInstanceId = encounter.queuedCareRoomInstanceId = null;
    encounter.waitingDestination = { kind: "standing", roomInstanceId: `room.level5.rooms.hall.${39 + index * 4}`, location: { ...encounter.patientLocation } };
    encounter.patientSatisfaction = 80;
    encounter.idleWaitingSinceTick = encounter.lastSatisfactionDecayAtTick = state.facilityTick;
    encounter.nextIdleActionAtFacilityTick = Number.MAX_SAFE_INTEGER;
    state.retailNextOpportunityTicks[`encounter:${encounterId}`] = Number.MAX_SAFE_INTEGER;
    state.patientAmenityNextOpportunityTicks ??= {};
    state.patientAmenityNextOpportunityTicks[`encounter:${encounterId}`] = Number.MAX_SAFE_INTEGER;
    if (!tryStartPatientGardenRest(state, "encounter", encounterId, context)) throw new Error("Support QA garden could not reserve a real seat.");
  }
  // Normalize the explicitly prepared check-in metadata through the actual reader.
  return deserializeGameState(serializeGameState(state), context);
}
