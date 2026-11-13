import { getApprovedRoomNavigation } from "./approved-room-layouts";

/** Editorial prestige-room construction/upkeep and implemented retail access. */
const rooms = [
  ["room.founder_office", "Founder's Office", 3, 3, 1580, [300, 500, 900, 1400]],
  ["room.executive_office", "Executive Office", 3, 2, 2640, [500, 750, 1320, 2100]],
  ["room.gift_shop", "Gift Shop", 3, 3, 1060, [200, 300, 540, 840]],
  ["room.indoor_garden", "Indoor Garden", 4, 4, 1060, [200, 300, 540, 840]],
  ["room.staff_gym", "Staff Gym", 4, 4, 1320, [250, 375, 660, 1050]],
] as const;
export const LEVEL_FIVE_ROOM_DEFINITIONS = rooms.map(([id, displayName, width, height, constructionCost, upgradeCosts]) => ({
  id, displayName, kind: "room", unlockFacilityLevel: 5,
  width, height, defaultDoorSide: "south", constructionCost,
  upkeepPerExpenseInterval: 1, satisfactionOnBuild: 0, workloadLimitContribution: 0, maximumInstances: 1,
  maximumUpgradeLevel: 5, upgradeCosts: [...upgradeCosts], upkeepPerUpgradeLevel: 0,
  workloadLimitContributionPerUpgradeLevel: 0, serviceDurationReductionPercentPerUpgradeLevel: 0,
  requiredRoomDefinitionIds: ["room.front_desk"], capabilityIds: id === "room.gift_shop" ? ["capability.gift_shop"] : [], navigation: getApprovedRoomNavigation(id),
}));
