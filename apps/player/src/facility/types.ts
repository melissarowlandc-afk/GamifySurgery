import type {
  CardinalDirection,
  GridPoint,
  PixelAppearanceDescriptor,
  RoomOrientation,
  RoomUpgradeLevel,
} from "@gamify-surgery/game-domain";

export interface FacilityPatientCounts {
  waiting: number;
  active: number;
  actionReady: number;
  resolved: number;
}

export interface FacilityPatientView {
  instanceId: string;
  displayName: string;
  status: "waiting" | "active" | "action-ready" | "off-site";
  appearance: PixelAppearanceDescriptor;
  location?: GridPoint;
  path?: GridPoint[];
  pathIndex?: number;
  moving?: boolean;
  direction?: "front" | "side" | "back";
  /** Derived presentation state for a stationary patient occupying a waiting anchor. */
  seated?: boolean;
}

/** Noninteractive exterior pedestrian; never appears in patient UI. */
export interface FacilityAmbientPedestrianView {
  instanceId: string;
  appearance: PixelAppearanceDescriptor;
  location: GridPoint;
  path: GridPoint[];
  pathIndex: number;
  moving: boolean;
  direction: "front" | "side" | "back";
}

export interface FacilityRoomView {
  instanceId: string;
  definitionId: string;
  displayName: string;
  tileX: number;
  tileY: number;
  width: number;
  height: number;
  isFounderRoom: boolean;
  kind?: "room" | "hallway";
  orientation?: RoomOrientation;
  doorSide?: CardinalDirection | null;
  upgradeLevel?: RoomUpgradeLevel;
  /** 0-100 presentation value; gameplay remains authoritative in the domain. */
  cleanliness?: number;
  /** Build-only affordance; the domain still decides whether an upgrade applies. */
  upgradeAvailable?: boolean;
}

export interface FacilityDoorView {
  instanceId: string;
  roomInstanceId: string;
  side: CardinalDirection;
  offset: number;
  exterior: boolean;
}

export type BuildDoorTool = "place" | "remove" | null;
export type FacilityBuildDoorTool = BuildDoorTool;

/**
 * A room-relative wall segment that Build Mode may expose as a direct map
 * interaction. The domain remains authoritative: `enabled` is only the
 * presentation projection of the current placement validation.
 */
export interface FacilityBuildDoorSlotView {
  id: string;
  roomInstanceId: string;
  side: CardinalDirection;
  offset: number;
  /** Omitted slots are valid; this permits a caller to include disabled
   * preview positions when it needs their blocked reason. */
  enabled?: boolean;
  blockedReason?: string;
}
export type FacilityDoorSlotView = FacilityBuildDoorSlotView;

export interface FacilityStaffView {
  instanceId: string;
  /** Optional only for legacy/test facility projections. */
  staffRoleDefinitionId?: string;
  displayName: string;
  roleDisplayName: string;
  homeRoomInstanceId: string | null;
  appearance?: PixelAppearanceDescriptor;
  salaryPerExpenseInterval?: number;
  morale?: number;
  trainingLevel?: RoomUpgradeLevel;
  location?: GridPoint;
  path?: GridPoint[];
  pathIndex?: number;
  moving?: boolean;
  direction?: "front" | "side" | "back";
}

export interface FacilityFounderView {
  displayName: string;
  appearance: PixelAppearanceDescriptor;
  location?: GridPoint;
  path?: GridPoint[];
  pathIndex?: number;
  activityLabel?: string;
  moving?: boolean;
  direction?: "front" | "side" | "back";
}

export interface FacilityLitterView {
  instanceId: string;
  roomInstanceId: string;
  location: GridPoint;
  /** Brief alert-driven locator affordance. */
  highlighted?: boolean;
}

export interface FacilityWaterCoolerView {
  location: GridPoint;
  fillPercent: number;
  needsRefill: boolean;
  /** Brief alert-driven locator affordance. */
  highlighted?: boolean;
}

export interface FacilityPlacementView {
  definitionId: string;
  displayName: string;
  /**
   * Width and height are the already-rotated footprint rendered on the grid.
   * `orientation` is retained for the door marker and placement command.
   */
  width: number;
  height: number;
  kind?: "room" | "hallway";
  orientation?: RoomOrientation;
  /**
   * The already-rotated door side. Undefined temporarily falls back to the
   * prototype's south-facing room convention; hallways should use null.
   */
  doorSide?: CardinalDirection | null;
}

export interface FacilityCameraView {
  zoom: number;
  panX: number;
  panY: number;
}

/**
 * The intentionally small, read-only projection consumed by the Phaser view.
 *
 * Gameplay rules remain outside Phaser. The scene only visualizes this data and
 * asks the owner to place a room through `onPlaceExamRoom`.
 */
export interface FacilityViewModel {
  facilityTitle: string;
  facilityTick: number;
  paused: boolean;
  simulationSpeed: 1 | 2 | 4;
  realMillisecondsPerFacilityMinuteAt1x: number;
  /** Exact canonical movement rate shared by every map character. */
  characterTravelTilesPerFacilityMinute: number;
  gridColumns: number;
  gridRows: number;
  patientCounts: FacilityPatientCounts;
  founder: FacilityFounderView;
  ambientPedestrians?: FacilityAmbientPedestrianView[];
  litterItems?: FacilityLitterView[];
  waterCooler?: FacilityWaterCoolerView;
  patients?: FacilityPatientView[];
  rooms: FacilityRoomView[];
  doors?: FacilityDoorView[];
  staff: FacilityStaffView[];
  placement: FacilityPlacementView | null;
  buildMode?: boolean;
  buildDoorTool?: BuildDoorTool;
  buildDoorSlots?: FacilityBuildDoorSlotView[];
  /** @deprecated Use `buildDoorSlots`. Retained for save-free view adapters. */
  eligibleDoorSlots?: FacilityBuildDoorSlotView[];
  selectedRoomInstanceId?: string | null;
  /** Brief visual locator requested after opening a visible patient's chart. */
  selectedPatientInstanceId?: string | null;
  camera?: FacilityCameraView;
}

export type PlaceRoomRequest = (
  tileX: number,
  tileY: number,
  orientation?: RoomOrientation,
) => boolean;
export type SelectRoomRequest = (roomInstanceId: string) => void;
export type PlaceDoorRequest = (
  roomInstanceId: string,
  side: CardinalDirection,
  offset: number,
) => void;
export type RemoveDoorRequest = (doorInstanceId: string) => void;
export type RequestRoomUpgrade = (roomInstanceId: string) => void;
export type CollectLitterRequest = (litterId: string) => void;
export type RefillWaterCoolerRequest = () => void;
export type PraiseEmployeeRequest = (employeeId: string) => void;
export type MoveFounderRequest = (destination: GridPoint) => boolean;
export type FacilityCameraChangeRequest = (camera: FacilityCameraView) => void;
