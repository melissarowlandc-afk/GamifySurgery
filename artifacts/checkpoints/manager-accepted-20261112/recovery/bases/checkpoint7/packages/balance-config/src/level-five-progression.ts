import { facilityStageDefinitionSchema } from "./schema";

/** Binding editorial game goals. M10 installs this stage in the shipped release. */
export const LEVEL_FIVE_STAGE_DEFINITION = facilityStageDefinitionSchema.parse({
  level: 5,
  displayName: "Level 5 - Optimized ASC / Prestige",
  minimumClinicalXp: 2000,
  minimumCompletedEncounters: 0,
  satisfactionMustBeGreaterThan: 90,
  minimumAverageStaffMorale: 85,
  requiredRoomDefinitionIds: [],
  requiredStaffRoleIds: [],
  nextFacilityLevel: null,
});

export const LEVEL_FIVE_INSPECTION_UNLOCK_EVENT_ID = "event.inspections-unlocked";
export const LEVEL_FIVE_INSPECTION_UNLOCK_MESSAGE = "Level 5 goals complete. Inspections are now available.";
export const LEVEL_FIVE_INSPECTION_UNLOCK_TIP = "The paperwork would like an appointment. Book your first inspection from Goals, then keep the clinic running through the inspection window.";
