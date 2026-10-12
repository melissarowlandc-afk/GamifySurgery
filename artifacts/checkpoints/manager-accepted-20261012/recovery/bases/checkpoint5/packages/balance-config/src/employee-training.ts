export const EMPLOYEE_TRAINING_SESSION_MINUTES = 60;
export const EMPLOYEE_TRAINING_CAPACITY = 2;

export type EmployeeTrainingMetric =
  | "waiting_satisfaction_loss"
  | "imaging_acquisition_time"
  | "preop_preparation_time"
  | "endoscopy_team_time"
  | "blood_collection_time"
  | "cleanliness_restored"
  | "consult_payment"
  | "app_appointment_revenue"
  | "lab_processing_time"
  | "or_and_qi_time"
  | "or_team_time"
  | "pharmacy_supply_cost"
  | "repair_time"
  | "interpretation_time";

export interface EmployeeTrainingRole {
  staffRoleDefinitionId: string;
  metric: EmployeeTrainingMetric;
  /** Fixed approved prices, independent of salaries and future hiring prices. */
  levelPrices: readonly [number, number, number, number];
  percentPerLevel: 5 | 10;
  shortMetric: string;
  direction: "reduces" | "increases";
}

function role(
  staffRoleDefinitionId: string,
  metric: EmployeeTrainingMetric,
  basePrice: number,
  shortMetric: string,
  direction: EmployeeTrainingRole["direction"] = "reduces",
  percentPerLevel: 5 | 10 = 10,
): EmployeeTrainingRole {
  return { staffRoleDefinitionId, metric, levelPrices: [basePrice, basePrice * 2, basePrice * 3, basePrice * 4], percentPerLevel, shortMetric, direction };
}

/** Owner-approved editorial game balance; these are not clinical claims. */
export const EMPLOYEE_TRAINING_ROLES: readonly EmployeeTrainingRole[] = [
  role("staff.receptionist", "waiting_satisfaction_loss", 75, "waiting satisfaction loss"),
  role("staff.imaging_technician", "imaging_acquisition_time", 75, "imaging time"),
  role("staff.periop_nurse", "preop_preparation_time", 125, "prep time"),
  role("staff.endoscopy_nurse", "endoscopy_team_time", 125, "endoscopy team time"),
  role("staff.endoscopist", "endoscopy_team_time", 225, "endoscopy team time"),
  role("staff.phlebotomist", "blood_collection_time", 100, "blood draw time"),
  role("staff.evs_worker", "cleanliness_restored", 75, "cleaning restored", "increases"),
  role("staff.glp1_np", "consult_payment", 150, "consult payment", "increases"),
  role("staff.app", "app_appointment_revenue", 150, "APP appointment revenue", "increases"),
  role("staff.laboratory_technician", "lab_processing_time", 125, "lab work time"),
  role("staff.surgeon", "or_and_qi_time", 350, "OR and QI work time"),
  role("staff.or_nurse", "or_team_time", 175, "OR team time"),
  role("staff.pharmacist", "pharmacy_supply_cost", 150, "supply cost", "reduces", 5),
  role("staff.repair_person", "repair_time", 100, "repair time"),
  role("staff.radiologist", "interpretation_time", 75, "reading time"),
];

export function getEmployeeTrainingRole(staffRoleDefinitionId: string): EmployeeTrainingRole | null {
  return EMPLOYEE_TRAINING_ROLES.find((candidate) => candidate.staffRoleDefinitionId === staffRoleDefinitionId) ?? null;
}

export function getEmployeeTrainingCost(staffRoleDefinitionId: string, targetLevel: number): number | null {
  const definition = getEmployeeTrainingRole(staffRoleDefinitionId);
  return definition && Number.isInteger(targetLevel) && targetLevel >= 2 && targetLevel <= 5
    ? definition.levelPrices[targetLevel - 2] ?? null : null;
}

export function getEmployeeTrainingPercent(staffRoleDefinitionId: string, level: 1 | 2 | 3 | 4 | 5): number {
  return (getEmployeeTrainingRole(staffRoleDefinitionId)?.percentPerLevel ?? 0) * (level - 1);
}

export interface EmployeeTrainingBenefit {
  metric: EmployeeTrainingMetric;
  percent: number;
  /** The improvement from the immediately preceding level, not all prior tiers. */
  incrementalPercent: number;
  totalDescription: string;
  incrementalDescription: string;
  consultFee: number | null;
  consultFeeIncrease: number | null;
}

export function getEmployeeTrainingLevelBenefit(staffRoleDefinitionId: string, level: 1 | 2 | 3 | 4 | 5): EmployeeTrainingBenefit | null {
  const definition = getEmployeeTrainingRole(staffRoleDefinitionId);
  if (!definition) return null;
  const percent = getEmployeeTrainingPercent(staffRoleDefinitionId, level);
  const incrementalPercent = level === 1 ? 0 : definition.percentPerLevel;
  const verb = definition.direction === "reduces" ? "Reduces" : "Increases";
  const consultFeeIncrease = definition.metric === "consult_payment" ? percent / 2 : null;
  return {
    metric: definition.metric, percent, incrementalPercent,
    totalDescription: level === 1 ? "Baseline" : consultFeeIncrease !== null
      ? `Adds $${consultFeeIncrease} per consult`
      : `${verb} ${definition.shortMetric} ${percent}%`,
    incrementalDescription: level === 1 ? "Baseline" : consultFeeIncrease !== null
      ? "Adds $5 per consult"
      : `${verb} ${definition.shortMetric} another ${incrementalPercent}%`,
    consultFee: consultFeeIncrease !== null ? 50 + consultFeeIncrease : null,
    consultFeeIncrease,
  };
}

/** Approved north-facing stool floor contacts, with distinct adjacent grid approaches. */
export const EMPLOYEE_TRAINING_PLACES = [
  { id: "stool1", approach: { x: 0, y: 1 }, floorContact: { x: 1.05, y: 1.70 }, facing: "north" },
  { id: "stool2", approach: { x: 2, y: 1 }, floorContact: { x: 1.95, y: 1.70 }, facing: "north" },
] as const;

export type EmployeeTrainingPlaceId = (typeof EMPLOYEE_TRAINING_PLACES)[number]["id"];
