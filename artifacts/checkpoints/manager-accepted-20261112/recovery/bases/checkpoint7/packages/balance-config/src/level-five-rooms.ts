import { getApprovedRoomNavigation } from "./approved-room-layouts";

/** Editorial prestige-room construction/upkeep and implemented retail access. */
const rooms = [
  ["room.founder_office", "Founder's Office", 3, 3, 1200, [300, 500, 750, 1000]],
  ["room.executive_office", "Executive Office", 3, 2, 2000, [500, 750, 1100, 1500]],
  ["room.gift_shop", "Gift Shop", 3, 3, 800, [200, 300, 450, 600]],
  ["room.indoor_garden", "Indoor Garden", 4, 4, 800, [200, 300, 450, 600]],
  ["room.staff_gym", "Staff Gym", 4, 4, 1000, [250, 375, 550, 750]],
] as const;
export const LEVEL_FIVE_ROOM_DEFINITIONS = rooms.map(([id, displayName, width, height, constructionCost, upgradeCosts]) => ({
  id, displayName, kind: "room", unlockFacilityLevel: 5,
  width, height, defaultDoorSide: "south", constructionCost,
  upkeepPerExpenseInterval: 1, satisfactionOnBuild: 0, workloadLimitContribution: 0, maximumInstances: 1,
  maximumUpgradeLevel: 5, upgradeCosts: [...upgradeCosts], upkeepPerUpgradeLevel: 0,
  workloadLimitContributionPerUpgradeLevel: 0, serviceDurationReductionPercentPerUpgradeLevel: 0,
  requiredRoomDefinitionIds: ["room.front_desk"], capabilityIds: id === "room.gift_shop" ? ["capability.gift_shop"] : [], navigation: getApprovedRoomNavigation(id),
}));
