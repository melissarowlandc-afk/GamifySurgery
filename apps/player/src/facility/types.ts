export interface FacilityPatientCounts {
  waiting: number;
  active: number;
  actionReady: number;
  resolved: number;
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
}

export interface FacilityStaffView {
  instanceId: string;
  displayName: string;
  roleDisplayName: string;
  homeRoomInstanceId: string | null;
}

export interface FacilityPlacementView {
  definitionId: string;
  displayName: string;
  width: number;
  height: number;
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
  rooms: FacilityRoomView[];
  staff: FacilityStaffView[];
  placement: FacilityPlacementView | null;
}

export type PlaceRoomRequest = (tileX: number, tileY: number) => void;
