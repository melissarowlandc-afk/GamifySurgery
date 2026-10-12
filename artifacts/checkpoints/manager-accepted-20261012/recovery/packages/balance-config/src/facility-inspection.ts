/** Editorial game report values, never clinical/regulatory standards. */
export const FACILITY_INSPECTION_RULES = {
  version: "inspection-rules.v1",
  durationMinutes: 5 * 10 * 60,
  minimumQualifyingScoredPatients: 20,
  targetOperatingMargin: 0.05,
  categoryWeights: {
    cleanliness: 10, rooms_built: 10, room_upgrades: 10, staffing_coverage: 10,
    employee_training: 10, staff_morale: 10, patient_satisfaction: 10,
    wait_flow: 5, finances: 5, clinical_answer_accuracy: 20,
  },
} as const;
