import type { ApprovedFloorPoint, ApprovedRoomNavigationContract } from "./approved-room-layouts";
import founder from "./level5/founders-office.json";
import executive from "./level5/executive-office.json";
import gift from "./level5/gift-shop.json";
import garden from "./level5/indoor-garden.json";
import gym from "./level5/staff-gym.json";

export interface ApprovedLevel5SupportNavigation {
  readonly id: string;
  readonly fixtureId?: string;
  /** Coarse walking endpoint; presentation contact and fine route are separate. */
  readonly anchor: ApprovedFloorPoint;
  readonly standingApproach: ApprovedFloorPoint;
}
const sources = [founder, executive, gift, garden, gym] as unknown as readonly Readonly<{
  contract: ApprovedRoomNavigationContract; supports: ApprovedLevel5SupportNavigation[];
}>[];
/** Physical solids never disappear for backing; only optional door-owned pieces clear.
 * Executive's N2/S2 coarse threshold exceptions represent routes around retained
 * chairs. Native radius-clear knots are in the promoted presentation data. */
export const APPROVED_LEVEL5_ROOM_NAVIGATION_CONTRACTS: Record<string, ApprovedRoomNavigationContract> =
  Object.fromEntries(sources.map(room => [room.contract.roomDefinitionId, room.contract]));
export const APPROVED_LEVEL5_SUPPORT_NAVIGATION: Record<string, readonly ApprovedLevel5SupportNavigation[]> =
  Object.fromEntries(sources.map(room => [room.contract.roomDefinitionId, room.supports]));
