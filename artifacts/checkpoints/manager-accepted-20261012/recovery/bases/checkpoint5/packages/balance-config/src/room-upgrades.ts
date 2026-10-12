export const ROOM_UPGRADE_BASE_LEVEL = 1;
export const ROOM_UPGRADE_MAXIMUM_LEVEL = 5;

export type RoomUpgradeStatus = "current" | "future" | "retired";

export type RoomUpgradeDurationEffectKind =
  | "cleaning_duration_reduction_percent"
  | "training_duration_reduction_percent"
  | "repair_duration_reduction_percent"
  | "quality_review_duration_reduction_percent"
  | "reading_duration_reduction_percent"
  | "administration_duration_reduction_percent";

export type RoomUpgradePointEffectKind =
  | "waiting_satisfaction_points"
  | "examination_satisfaction_points"
  | "recovery_satisfaction_points"
  | "daily_coffee_morale_points"
  | "break_morale_points"
  | "founder_office_morale_points"
  | "garden_satisfaction_points"
  | "gym_morale_points";

export type RoomUpgradeEffectKind =
  | "none"
  | "revenue_percent"
  | "cleanliness_decay_reduction_percent"
  | RoomUpgradeDurationEffectKind
  | RoomUpgradePointEffectKind;

export type RoomUpgradeCosts = readonly [] | readonly [number, number, number, number];

export interface RoomUpgradeDefinition {
  readonly roomDefinitionId: string;
  readonly displayName: string;
  readonly status: RoomUpgradeStatus;
  readonly effectKind: RoomUpgradeEffectKind;
  readonly amountPerUpgrade: number;
  /** Prices for the four purchases from Level 1 to Levels 2, 3, 4 and 5. */
  readonly upgradeCosts: RoomUpgradeCosts;
  readonly benefitSubject: string;
  readonly appearanceChanges: boolean;
}

function upgrade(
  roomDefinitionId: string,
  displayName: string,
  effectKind: RoomUpgradeEffectKind,
  amountPerUpgrade: number,
  upgradeCosts: RoomUpgradeCosts,
  benefitSubject = "",
  status: RoomUpgradeStatus = "current",
  appearanceChanges = false,
): RoomUpgradeDefinition {
  return {
    roomDefinitionId, displayName, status, effectKind, amountPerUpgrade,
    upgradeCosts, benefitSubject, appearanceChanges,
  };
}

/**
 * Owner-approved editorial game balance. Future entries are planning metadata;
 * they do not construct rooms, unlock services or enable runtime modifiers.
 */
export const ROOM_UPGRADE_CATALOG: readonly RoomUpgradeDefinition[] = [
  upgrade("room.front_desk", "Front Desk", "none", 0, []),
  upgrade("room.hallway", "Hallway", "none", 0, []),
  upgrade("room.examination", "Examination Room", "examination_satisfaction_points", 2, [90, 140, 210, 300], "examination"),
  upgrade("room.waiting", "Waiting Room", "waiting_satisfaction_points", 2, [110, 170, 250, 360], "waiting patients"),
  upgrade("room.bathroom", "Bathroom", "cleanliness_decay_reduction_percent", 10, [70, 110, 170, 250]),
  upgrade("room.minor_procedure", "Minor-Procedure Room", "revenue_percent", 6, [220, 330, 480, 680], "procedure revenue"),
  upgrade("room.ultrasound", "Ultrasound Room", "revenue_percent", 6, [240, 360, 525, 715], "ultrasound service revenue"),
  upgrade("room.xray", "X-ray Room", "revenue_percent", 6, [190, 280, 400, 560], "X-ray service revenue"),
  upgrade("room.ct", "CT Suite", "revenue_percent", 6, [400, 600, 880, 1200], "CT/CTA revenue"),
  upgrade("room.phlebotomy", "Phlebotomy Station", "revenue_percent", 6, [140, 210, 305, 415], "specimen-collection revenue"),
  upgrade("room.evs_closet", "Environmental-Services Closet", "cleaning_duration_reduction_percent", 10, [120, 180, 260, 360]),
  upgrade("room.endoscopy", "Endoscopy Room", "revenue_percent", 6, [365, 545, 800, 1090], "endoscopy revenue"),
  upgrade("room.periop_recovery", "Peri-op/Recovery Room", "recovery_satisfaction_points", 2, [225, 340, 495, 675]),
  upgrade("room.training", "Training Room", "training_duration_reduction_percent", 10, [165, 245, 360, 490]),
  upgrade("room.coffee_kiosk", "Coffee Kiosk", "daily_coffee_morale_points", 1, [125, 190, 275, 375]),
  upgrade("room.glp1_telehealth_suite", "GLP-1 Telehealth Suite", "revenue_percent", 6, [300, 450, 660, 900], "telehealth revenue"),
  upgrade("room.ambulatory_or", "Ambulatory OR", "revenue_percent", 6, [600, 900, 1320, 1800], "operation revenue"),
  upgrade("room.laboratory", "In-house Laboratory", "revenue_percent", 6, [450, 675, 990, 1350], "paid laboratory-processing revenue"),
  upgrade("room.pharmacy", "Pharmacy", "revenue_percent", 6, [300, 450, 660, 900], "pharmacy sales revenue"),
  upgrade("room.maintenance_workshop", "Maintenance Workshop", "repair_duration_reduction_percent", 10, [200, 300, 440, 600]),
  upgrade("room.staff_break", "Staff Break Room", "break_morale_points", 2, [225, 340, 495, 675]),
  upgrade("room.surgeon_office", "Surgeon's Office", "quality_review_duration_reduction_percent", 10, [175, 265, 385, 525]),
  upgrade("room.vending", "Vending Machine", "revenue_percent", 6, [115, 170, 250, 340], "vending revenue"),
  upgrade("room.reading", "Radiology Reading Room", "reading_duration_reduction_percent", 10, [450, 675, 990, 1350]),
  upgrade("room.imaging_control", "Imaging Control Room", "none", 0, [], "", "retired"),
  upgrade("room.mri", "MRI Room", "revenue_percent", 6, [600, 900, 1300, 1800], "MRI service revenue"),
  upgrade("room.pediatric_waiting", "Pediatric Waiting Room", "waiting_satisfaction_points", 2, [150, 225, 325, 450], "waiting families"),
  upgrade("room.pediatric_examination", "Pediatric Examination Room", "examination_satisfaction_points", 2, [150, 225, 325, 450], "visits"),
  upgrade("room.wound_ostomy", "Wound/Ostomy Clinic", "revenue_percent", 6, [250, 375, 550, 750], "clinic service revenue"),
  upgrade("room.founder_office", "Founder's Office", "founder_office_morale_points", 2, [300, 500, 750, 1000], "", "future", true),
  upgrade("room.executive_office", "Executive Office", "administration_duration_reduction_percent", 5, [500, 750, 1100, 1500], "", "future"),
  upgrade("room.gift_shop", "Gift Shop", "revenue_percent", 6, [200, 300, 450, 600], "gift sales revenue", "future"),
  upgrade("room.indoor_garden", "Indoor Garden", "garden_satisfaction_points", 2, [200, 300, 450, 600], "", "future"),
  upgrade("room.staff_gym", "Staff Gym", "gym_morale_points", 2, [250, 375, 550, 750], "", "future"),
];

export function getRoomUpgradeDefinition(roomDefinitionId: string): RoomUpgradeDefinition | null {
  return ROOM_UPGRADE_CATALOG.find((definition) => definition.roomDefinitionId === roomDefinitionId) ?? null;
}

export function getCurrentRoomUpgradeDefinition(roomDefinitionId: string): RoomUpgradeDefinition | null {
  const definition = getRoomUpgradeDefinition(roomDefinitionId);
  return definition?.status === "current" ? definition : null;
}

/** Reject invalid targets rather than silently charging for a different tier. */
export function getRoomUpgradeCost(roomDefinitionId: string, targetLevel: number): number | null {
  const definition = getCurrentRoomUpgradeDefinition(roomDefinitionId);
  return definition && Number.isInteger(targetLevel) && targetLevel >= 2 && targetLevel <= ROOM_UPGRADE_MAXIMUM_LEVEL
    ? definition.upgradeCosts[targetLevel - 2] ?? null : null;
}

/** Level 1 has no purchased bonuses; saved valid levels produce 0–4 purchases. */
export function getRoomUpgradePurchaseCount(level: number): number {
  if (!Number.isFinite(level)) return 0;
  return Math.max(0, Math.min(ROOM_UPGRADE_MAXIMUM_LEVEL, Math.floor(level)) - ROOM_UPGRADE_BASE_LEVEL);
}

/** Runtime totals are neutral for unknown, future, retired and non-upgrade rooms. */
export function getRoomUpgradeAmount(roomDefinitionId: string, level: number): number {
  const definition = getCurrentRoomUpgradeDefinition(roomDefinitionId);
  return (definition?.amountPerUpgrade ?? 0) * getRoomUpgradePurchaseCount(level);
}

export function getRoomUpgradeRevenueMultiplier(roomDefinitionId: string, level: number): number {
  return getCurrentRoomUpgradeDefinition(roomDefinitionId)?.effectKind === "revenue_percent"
    ? 1 + getRoomUpgradeAmount(roomDefinitionId, level) / 100 : 1;
}

/**
 * Apply only to the named work phase. This retains fractional duration values;
 * independent employee duration modifiers multiply this factor in the domain.
 */
export function getRoomUpgradeDurationMultiplier(
  roomDefinitionId: string,
  level: number,
  effectKind: RoomUpgradeDurationEffectKind,
): number {
  return getCurrentRoomUpgradeDefinition(roomDefinitionId)?.effectKind === effectKind
    ? 1 - getRoomUpgradeAmount(roomDefinitionId, level) / 100 : 1;
}

export function getRoomUpgradeCleanlinessDecayMultiplier(roomDefinitionId: string, level: number): number {
  return getCurrentRoomUpgradeDefinition(roomDefinitionId)?.effectKind === "cleanliness_decay_reduction_percent"
    ? 1 - getRoomUpgradeAmount(roomDefinitionId, level) / 100 : 1;
}

export function getRoomUpgradePoints(
  roomDefinitionId: string,
  level: number,
  effectKind: RoomUpgradePointEffectKind,
): number {
  return getCurrentRoomUpgradeDefinition(roomDefinitionId)?.effectKind === effectKind
    ? getRoomUpgradeAmount(roomDefinitionId, level) : 0;
}

function benefitDescription(definition: RoomUpgradeDefinition, amount: number): string {
  const points = amount === 1 ? "point" : "points";
  switch (definition.effectKind) {
    case "none": return "No upgrades";
    case "revenue_percent": return `+${amount}% ${definition.benefitSubject}`;
    case "cleanliness_decay_reduction_percent": return `${amount}% slower cleanliness loss`;
    case "cleaning_duration_reduction_percent": return `Cleaning takes ${amount}% less time`;
    case "training_duration_reduction_percent": return `Training sessions take ${amount}% less time`;
    case "repair_duration_reduction_percent": return `Repairs take ${amount}% less time`;
    case "quality_review_duration_reduction_percent": return `Quality reviews take ${amount}% less time`;
    case "reading_duration_reduction_percent": return `Scan reading takes ${amount}% less time`;
    case "administration_duration_reduction_percent": return `Administrative work takes ${amount}% less time`;
    case "waiting_satisfaction_points": return `+${amount} satisfaction ${points} for ${definition.benefitSubject}`;
    case "examination_satisfaction_points": return `+${amount} satisfaction ${points} after ${definition.benefitSubject}`;
    case "recovery_satisfaction_points": return `+${amount} satisfaction ${points} after recovery`;
    case "daily_coffee_morale_points": return `+${amount} staff morale ${points} from daily coffee`;
    case "break_morale_points": return `+${amount} staff morale ${points} per break`;
    case "founder_office_morale_points": return `+${amount} staff morale ${points}; improved office appearance`;
    case "garden_satisfaction_points": return `+${amount} satisfaction ${points} for visitors`;
    case "gym_morale_points": return `+${amount} staff morale ${points} after gym use`;
  }
}

/** Includes future planning labels; it does not authorize a runtime purchase. */
export function getRoomUpgradePerPurchaseLabel(roomDefinitionId: string): string | null {
  const definition = getRoomUpgradeDefinition(roomDefinitionId);
  return definition ? benefitDescription(definition, definition.amountPerUpgrade) : null;
}

export interface RoomUpgradeLevelBenefit {
  readonly effectKind: RoomUpgradeEffectKind;
  readonly totalAmount: number;
  readonly incrementalAmount: number;
  readonly totalDescription: string;
  readonly incrementalDescription: string;
}

/**
 * UI/planning totals, including future rows. Runtime code must use the scoped
 * multiplier/points helpers above so future metadata remains inactive.
 */
export function getRoomUpgradeLevelBenefit(roomDefinitionId: string, level: number): RoomUpgradeLevelBenefit | null {
  const definition = getRoomUpgradeDefinition(roomDefinitionId);
  if (!definition) return null;
  const purchases = getRoomUpgradePurchaseCount(level);
  const totalAmount = definition.amountPerUpgrade * purchases;
  const incrementalAmount = purchases === 0 ? 0 : definition.amountPerUpgrade;
  const baseline = purchases === 0 && definition.effectKind !== "none";
  return {
    effectKind: definition.effectKind, totalAmount, incrementalAmount,
    totalDescription: baseline ? "Baseline" : benefitDescription(definition, totalAmount),
    incrementalDescription: baseline ? "Baseline" : benefitDescription(definition, incrementalAmount),
  };
}
