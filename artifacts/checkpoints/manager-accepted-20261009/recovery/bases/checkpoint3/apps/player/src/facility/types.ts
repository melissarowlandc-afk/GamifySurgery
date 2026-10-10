import type {
  CardinalDirection,
  GridPoint,
  PixelAppearanceDescriptor,
  ProcedureCompanionState,
  RoomOrientation,
  RoomUpgradeLevel,
} from "@gamify-surgery/game-domain";

export interface FacilityPatientCounts {
  waiting: number;
  active: number;
  actionReady: number;
  resolved: number;
}

/** Presentation-only furniture assignment. Gameplay/navigation coordinates remain authoritative. */
export type FacilityActorSupportRole =
  | "waiting-seat"
  | "front-desk-staff"
  | "front-desk-public"
  | "examination-patient"
  | "examination-clinician"
  | "ultrasound-patient"
  | "ultrasound-clinician"
  | "minor-procedure-patient"
  | "minor-procedure-clinician"
  | "ct-patient"
  | "ct-operator"
  | "phlebotomy-patient"
  | "phlebotomy-clinician"
  | "endoscopy-provider"
  | "endoscopy-nurse"
  | "periop-bed-patient"
  | "periop-companion-seat"
  | "glp1-np-station-1"
  | "glp1-np-station-2"
  | "ambulatory-or-surgeon"
  | "ambulatory-or-nurse"
  | "laboratory-technician"
  | "pharmacist"
  | "repair-person"
  | "staff-break-seat"
  | "training-employee"
  | "surgeon-office"
  /** A hired radiologist seated at their Reading Room workstation. */
  | "reading-radiologist"
  /** An idle employee on a chair or at a workstation in their own room. */
  | "staff-idle";

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
  pose?: "seated" | "exam-table";
  supportRole?: FacilityActorSupportRole;
  /** Exact presentation support when one semantic role has several furniture surfaces. */
  supportId?: string;
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
  /** Build Mode label; lettered ("Waiting Room A") while 2+ of a type exist. */
  buildLabel?: string;
  /** Star count under the Build Mode label; 1 means no upgrades and no stars. */
  upgradeMaxLevel?: number;
  /** The next upgrade exists and the clinic can pay for it now. */
  upgradeAffordable?: boolean;
  /** Build Mode marker: the room cannot be reached by patients or staff. */
  accessProblem?: boolean;
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
  discussionActionRequired?: boolean;
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
  supportRole?: FacilityActorSupportRole;
  /** Exact stationary furniture support selected by the domain projection. */
  supportId?: string;
  /** Room owning supportId when the support role is shared across rooms. */
  supportRoomInstanceId?: string;
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
  seated?: boolean;
  supportRole?: FacilityActorSupportRole;
  /** Break Room seat id while the founder sits there. */
  supportId?: string;
  supportRoomInstanceId?: string;
}

/** A domain-authorized ordinary chair; the scene uses this instead of guessing from floor art. */
export interface FacilityFounderChairView {
  roomInstanceId: string;
  location: GridPoint;
  /** Waiting Room chair, patient-side Front Desk chair, or Break Room seat. */
  kind?: "waiting" | "front_desk_public" | "break";
  /** Break Room seat id; several break seats can share one logical tile. */
  seatId?: string;
  /** Someone is sitting there or has it reserved. */
  occupied?: boolean;
}

/** Durable income receipts projected only for transient facility feedback. */
export interface FacilityEarningsReceiptView {
  transactionKey: string;
  actorKind: "patient" | "employee" | "founder" | "remote" | "visitor" | "retail_visitor" | "companion";
  actorId: string;
  grossAmount: number;
  /** A domain-captured visual representative for a remote financial actor. */
  displayAnchor?:
    | { actorKind: "employee"; actorId: string }
    | { actorKind: "founder"; actorId: "founder" };
}

/** A non-encounter visitor owned by a service operation. */
export interface FacilityServiceVisitorView {
  instanceId: string;
  actorId: string;
  displayName: string;
  appearance: PixelAppearanceDescriptor | null;
  location?: GridPoint;
  path?: GridPoint[];
  pathIndex?: number;
  moving?: boolean;
  direction?: "front" | "side" | "back";
  rightFacing?: boolean;
  supportRole?: FacilityActorSupportRole;
  /** Exact presentation support when a service room offers several equivalent seats. */
  supportId?: string;
}

export interface FacilityRetailExternalActorView {
  instanceId: string;
  actorKind: "retail_visitor" | "companion";
  displayName: string;
  appearance: PixelAppearanceDescriptor;
  location?: GridPoint;
  path?: GridPoint[];
  pathIndex?: number;
  moving?: boolean;
  direction?: "front" | "side" | "back";
  rightFacing?: boolean;
  /** Only phase and the reserved chair/standing endpoint are needed by the renderer. */
  procedureCompanion?: Pick<ProcedureCompanionState, "phase" | "periopRoomInstanceId" | "waitingReservation">;
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
  /** Only the displayed live Needs-you cards; commands stay in the session. */
  alertPins?: FacilityAlertPinView[];
  facilityTitle: string;
  /** A scene-local receipt cursor resets when this persisted campaign changes. */
  campaignId?: string;
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
  founderChairs?: FacilityFounderChairView[];
  ambientPedestrians?: FacilityAmbientPedestrianView[];
  litterItems?: FacilityLitterView[];
  waterCooler?: FacilityWaterCoolerView;
  patients?: FacilityPatientView[];
  earningsReceipts?: FacilityEarningsReceiptView[];
  serviceVisitors?: FacilityServiceVisitorView[];
  /** Presentation-only covered-patient state for approved Endoscopy and ambulatory OR tables. */
  endoscopyOccupancy?: Readonly<{
    roomInstanceIds: readonly string[];
    patientInstanceIds: readonly string[];
    serviceVisitorInstanceIds: readonly string[];
  }>;
  /** Presentation-only: imaging rooms with a scan in progress (room dims while true). */
  imagingActiveRoomInstanceIds?: readonly string[];
  retailExternalActors?: FacilityRetailExternalActorView[];
  /** Optional honest workstation/panel anchors for future remote receipts. */
  remoteReceiptAnchors?: Readonly<Record<string, GridPoint>>;
  /** Reserved for separately rendered service visitors; no encounter aliasing. */
  visitorReceiptAnchors?: Readonly<Record<string, GridPoint>>;
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

export interface FacilityAlertPinView {
  id: string;
  title: string;
  actionLabel: string;
  target: { kind: "patient" | "service_visitor" | "room"; id: string };
}

export interface FacilityAlertPinPosition {
  id: string;
  x: number;
  y: number;
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
export type SeatFounderAtFrontDeskRequest = () => boolean;
export type SeatFounderInChairRequest = (roomInstanceId: string, location: GridPoint, seatId?: string) => boolean;

/** A character on the map the player clicked to see what they are doing. */
export interface FacilityCharacterRef {
  kind: "founder" | "staff" | "patient" | "service-visitor" | "retail-visitor" | "companion" | "ambient";
  id: string;
}

export interface FacilityCharacterDescription {
  name: string;
  activity: string;
}

export type DescribeCharacterRequest = (
  character: FacilityCharacterRef,
) => FacilityCharacterDescription | null;
export type PraiseEmployeeRequest = (employeeId: string) => void;
export type MoveFounderRequest = (destination: GridPoint) => boolean;
export type FacilityCameraChangeRequest = (camera: FacilityCameraView) => void;
