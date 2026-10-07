import type {
  RoomBuildCategoryId,
  RoomUpgradeBenefitView,
} from "../ui/types";

/**
 * Build Mode presentation only: room groups, one-line purposes, catalog order
 * and the A/B lettering of same-type rooms. Nothing here changes game rules.
 */

export const ROOM_BUILD_CATEGORIES: ReadonlyArray<{
  id: RoomBuildCategoryId;
  label: string;
}> = [
  { id: "patient", label: "Patient areas" },
  { id: "diagnostics", label: "Diagnostics" },
  { id: "procedures", label: "Procedures" },
  { id: "support", label: "Staff & support" },
  { id: "services", label: "Services" },
];

// Catalog order is the order rooms appear inside their group in both tabs.
const ROOM_BUILD_TYPES: ReadonlyArray<
  readonly [roomDefinitionId: string, category: RoomBuildCategoryId, purpose: string]
> = [
  ["room.front_desk", "patient", "Check-in and the clinic's permanent entrance."],
  ["room.waiting", "patient", "Seats patients until an exam room opens."],
  ["room.examination", "patient", "Where the founder sees each patient."],
  ["room.bathroom", "patient", "Patient restroom. Clean rooms keep patients happier."],
  ["room.xray", "diagnostics", "Runs X-ray studies onsite."],
  ["room.ultrasound", "diagnostics", "Runs ultrasound studies onsite."],
  ["room.ct", "diagnostics", "Runs CT and CTA studies onsite."],
  ["room.phlebotomy", "diagnostics", "Collects blood and specimen samples."],
  ["room.laboratory", "diagnostics", "Processes laboratory tests in house."],
  ["room.reading", "diagnostics", "Radiologists read imaging studies here."],
  ["room.imaging_control", "diagnostics", "Retired imaging control space kept from older saves."],
  ["room.minor_procedure", "procedures", "Minor in-office procedures."],
  ["room.endoscopy", "procedures", "Endoscopy procedures. Needs a setup checklist."],
  ["room.periop_recovery", "procedures", "Patients recover here after procedures."],
  ["room.ambulatory_or", "procedures", "Outpatient operations."],
  ["room.evs_closet", "support", "Home base for the cleaning staff."],
  ["room.training", "support", "Lets you train employees."],
  ["room.coffee_kiosk", "support", "Daily coffee lifts staff morale."],
  ["room.maintenance_workshop", "support", "Home base for repairs."],
  ["room.staff_break", "support", "Staff rest here between tasks."],
  ["room.surgeon_office", "support", "Quality reviews happen here."],
  ["room.glp1_telehealth_suite", "services", "Remote GLP-1 weight-management visits."],
  ["room.pharmacy", "services", "Pharmacy sales to patients."],
  ["room.vending", "services", "Snack and drink sales for visitors."],
];

const ROOM_BUILD_TYPE_INDEX = new Map(
  ROOM_BUILD_TYPES.map(([id, category, purpose], index) => [
    id,
    { category, purpose, index },
  ]),
);

export function roomBuildCategory(roomDefinitionId: string): RoomBuildCategoryId {
  return ROOM_BUILD_TYPE_INDEX.get(roomDefinitionId)?.category ?? "support";
}

export function roomBuildCategoryLabel(category: RoomBuildCategoryId): string {
  return (
    ROOM_BUILD_CATEGORIES.find((candidate) => candidate.id === category)
      ?.label ?? category
  );
}

export function roomBuildPurpose(roomDefinitionId: string): string | undefined {
  return ROOM_BUILD_TYPE_INDEX.get(roomDefinitionId)?.purpose;
}

/** Sort key: group first, then catalog order. Unknown rooms sort last. */
export function roomBuildSortKey(roomDefinitionId: string): number {
  const entry = ROOM_BUILD_TYPE_INDEX.get(roomDefinitionId);
  const categoryIndex = ROOM_BUILD_CATEGORIES.findIndex(
    (candidate) => candidate.id === (entry?.category ?? "support"),
  );
  return categoryIndex * 1000 + (entry?.index ?? 999);
}

/**
 * Owner rule (October 7): a room gets a letter only while two or more rooms
 * of its type exist. Letters follow build order (the oldest is A) and close
 * up after a sale. `rooms` must be in build order, as the domain stores them.
 */
export function letteredRoomNames(
  rooms: ReadonlyArray<{ id: string; roomDefinitionId: string }>,
  displayNameOf: (roomDefinitionId: string) => string,
): Map<string, string> {
  const byType = new Map<string, string[]>();
  for (const room of rooms) {
    const ids = byType.get(room.roomDefinitionId) ?? [];
    ids.push(room.id);
    byType.set(room.roomDefinitionId, ids);
  }
  const names = new Map<string, string>();
  for (const room of rooms) {
    const siblings = byType.get(room.roomDefinitionId)!;
    const baseName = displayNameOf(room.roomDefinitionId);
    names.set(
      room.id,
      siblings.length > 1 ? `${baseName} ${roomLetter(siblings.indexOf(room.id))}` : baseName,
    );
  }
  return names;
}

function roomLetter(index: number): string {
  // A..Z, then AA, AB… for the rare clinic with more than 26 of one room.
  let value = index;
  let letters = "";
  do {
    letters = String.fromCharCode(65 + (value % 26)) + letters;
    value = Math.floor(value / 26) - 1;
  } while (value >= 0);
  return letters;
}

/**
 * Describes the upgrade effect the game applies today: every non-hallway
 * upgrade level adds the shared completed-visit satisfaction bonus, capped
 * clinic-wide, plus any per-level upkeep. When GS-038 room-specific effects
 * land in balance config, this is the one place Build Mode reads them from.
 */
export function describeRoomUpgradeBenefit(input: {
  upgradeLevel: number;
  maxUpgradeLevel: number;
  satisfactionPerLevel: number;
  satisfactionCap: number;
  clinicSatisfactionTotal: number;
  upkeepPerLevel: number;
}): RoomUpgradeBenefitView {
  const {
    upgradeLevel,
    maxUpgradeLevel,
    satisfactionPerLevel,
    satisfactionCap,
    clinicSatisfactionTotal,
    upkeepPerLevel,
  } = input;
  const atMaximum = upgradeLevel >= maxUpgradeLevel;
  const clinicNow = Math.min(satisfactionCap, clinicSatisfactionTotal);
  const clinicNext = Math.min(
    satisfactionCap,
    clinicSatisfactionTotal + satisfactionPerLevel,
  );
  const upkeepLabel =
    upkeepPerLevel > 0
      ? atMaximum
        ? `Upkeep +$${(upgradeLevel - 1) * upkeepPerLevel}/hr from upgrades`
        : `Upkeep +$${upkeepPerLevel}/hr`
      : undefined;
  if (satisfactionPerLevel <= 0) {
    return {
      perUpgradeLabel: "Raises the room's level",
      currentLabel: `Level ${upgradeLevel} of ${maxUpgradeLevel}`,
      ...(upkeepLabel ? { upkeepLabel } : {}),
    };
  }
  const capped = clinicNow >= satisfactionCap;
  return {
    perUpgradeLabel: `+${satisfactionPerLevel} patient satisfaction per completed visit`,
    totalCaption: "Clinic total",
    currentLabel: `+${clinicNow}`,
    ...(atMaximum || capped ? {} : { nextLabel: `+${clinicNext}` }),
    note:
      !atMaximum && capped
        ? `Your clinic already has the full +${satisfactionCap}, so this upgrade adds no satisfaction for now.`
        : `Shared by all rooms, up to +${satisfactionCap} for the clinic.`,
    ...(upkeepLabel ? { upkeepLabel } : {}),
  };
}

/**
 * Names a Build Mode action for the Undo button, including the money Undo
 * would return or take back ("Upgrade Waiting Room A (+$170 back)").
 */
export function describeBuildUndoAction(
  before: BuildUndoSnapshot,
  after: BuildUndoSnapshot,
  command: { type: string; roomId?: string; roomDefinitionId?: string },
  displayNameOf: (roomDefinitionId: string) => string,
): string {
  const beforeNames = letteredRoomNames(before.rooms, displayNameOf);
  const afterNames = letteredRoomNames(after.rooms, displayNameOf);
  const roomName = (names: Map<string, string>) =>
    (command.roomId ? names.get(command.roomId) : undefined) ??
    (command.roomDefinitionId ? displayNameOf(command.roomDefinitionId) : "room");
  let action: string;
  switch (command.type) {
    case "PLACE_ROOM":
      action =
        command.roomDefinitionId === "room.hallway"
          ? "Build hallway"
          : `Build ${roomName(afterNames)}`;
      break;
    case "UPGRADE_ROOM":
      action = `Upgrade ${roomName(beforeNames)}`;
      break;
    case "SELL_ROOM":
      action = `Sell ${roomName(beforeNames)}`;
      break;
    case "MOVE_ROOM":
      action = `Move ${roomName(beforeNames)}`;
      break;
    case "PLACE_DOOR":
      action = "Add door";
      break;
    case "REMOVE_DOOR":
      action = "Remove door";
      break;
    default:
      action = "Last change";
  }
  const spent = before.cash - after.cash;
  if (spent > 0) {
    return `${action} (+$${spent.toLocaleString()} back)`;
  }
  if (spent < 0) {
    return `${action} (−$${(-spent).toLocaleString()})`;
  }
  return action;
}

export interface BuildUndoSnapshot {
  cash: number;
  rooms: ReadonlyArray<{ id: string; roomDefinitionId: string }>;
}
