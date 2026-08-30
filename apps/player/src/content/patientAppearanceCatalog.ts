/**
 * Player-facing view of the domain-authoritative patient roster. Encounters
 * and ambient pedestrians persist these identities, so the UI must not keep a
 * second copy that can drift from the save model.
 */
export {
  AUTHORED_ADULT_PATIENT_ROSTER as CURRENT_HUMAN_PATIENT_APPEARANCE_CATALOG,
  AUTHORED_ADULT_PATIENT_ROSTER_SIZE,
  patientRosterEligibleEntries,
  patientRosterEntryById,
  patientVisualAgeBand,
  type PatientAppearanceCatalogEntry,
  type PatientVisualAgeBand,
} from "@gamify-surgery/game-domain";

/** Kept as an honest future expansion target; it is not a claim about today. */
export const FUTURE_HUMAN_PATIENT_ROSTER_TARGET = 150;
export const RESERVED_FUTURE_HUMAN_PATIENT_ID_PREFIX = "patient.human.future.";
