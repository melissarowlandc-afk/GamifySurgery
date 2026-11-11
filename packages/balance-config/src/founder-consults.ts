/** Editorial simulation timing, not a clinical threshold or probability. */
export const FOUNDER_CONSULT_POLICY = {
  procedureEarliestWorkMinutes: 1,
  routineClinicWorkMinutes: 95,
  adultAppointmentCadenceMinutes: 90,
  clinicTrainingReductionPercentPerLevel: 10,
  clinicRoomReductionPercentPerLevel: 5,
  specialtyConsultMinimumIntervalMinutes: 300,
} as const;

/** Editorial clinic throughput; neither a clinical duration nor a probability. */
export function getRoutineClinicWorkMinutes(trainingLevel: number, roomUpgradeLevel: number): number {
  const level = (value: number) => Math.max(1, Math.min(5, Math.floor(value)));
  return Math.max(1, Math.ceil(FOUNDER_CONSULT_POLICY.routineClinicWorkMinutes *
    (1 - (level(trainingLevel) - 1) * FOUNDER_CONSULT_POLICY.clinicTrainingReductionPercentPerLevel / 100) *
    (1 - (level(roomUpgradeLevel) - 1) * FOUNDER_CONSULT_POLICY.clinicRoomReductionPercentPerLevel / 100) - 1e-9));
}
