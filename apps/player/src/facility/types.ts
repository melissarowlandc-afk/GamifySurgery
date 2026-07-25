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
}

export interface FacilityPlacementView {
  definitionId: string;
  displayName: string;
  width: number;
  height: number;
  kind?: "room" | "hallway";
  orientation?: RoomOrientation;
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
  gridColumns: number;
  gridRows: number;
  patientCounts: FacilityPatientCounts;
  patients?: FacilityPatientView[];
  rooms: FacilityRoomView[];
  staff: FacilityStaffView[];
  placement: FacilityPlacementView | null;
  buildMode?: boolean;
  selectedRoomInstanceId?: string | null;
  camera?: FacilityCameraView;
}

export type PlaceRoomRequest = (
  tileX: number,
  tileY: number,
  orientation?: RoomOrientation,
) => void;
export type SelectRoomRequest = (roomInstanceId: string) => void;
export type FacilityCameraChangeRequest = (camera: FacilityCameraView) => void;
