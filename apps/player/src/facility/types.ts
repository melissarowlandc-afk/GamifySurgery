import type {
  CardinalDirection,
  GridPoint,
  OffsitePatientTravelPresentation,
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
  offsiteTravel?: OffsitePatientTravelPresentation;
  moving?: boolean;
  direction?: "front" | "side" | "back";
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

export interface FacilityStaffView {
  instanceId: string;
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
  patientTravelTilesPerFacilityMinute: number;
  gridColumns: number;
  gridRows: number;
  patientCounts: FacilityPatientCounts;
  founder: FacilityFounderView;
  litterItems?: FacilityLitterView[];
  waterCooler?: FacilityWaterCoolerView;
  patients?: FacilityPatientView[];
  rooms: FacilityRoomView[];
  doors?: FacilityDoorView[];
  staff: FacilityStaffView[];
  placement: FacilityPlacementView | null;
  buildMode?: boolean;
  selectedRoomInstanceId?: string | null;
  /** Brief visual locator requested after opening a visible patient's chart. */
  selectedPatientInstanceId?: string | null;
  camera?: FacilityCameraView;
}

export type PlaceRoomRequest = (
  tileX: number,
  tileY: number,
  orientation?: RoomOrientation,
) => void;
export type SelectRoomRequest = (roomInstanceId: string) => void;
export type RequestRoomUpgrade = (roomInstanceId: string) => void;
export type CollectLitterRequest = (litterId: string) => void;
export type RefillWaterCoolerRequest = () => void;
export type PraiseEmployeeRequest = (employeeId: string) => void;
export type FacilityCameraChangeRequest = (camera: FacilityCameraView) => void;
