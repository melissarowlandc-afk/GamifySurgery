import type { CardinalDirection, GridPoint, RoomOrientation } from "@gamify-surgery/game-domain";

export interface BuildValidation { valid: boolean; reason: string | null; cost: number }
export type DoorRequest = { kind: "add"; roomId: string; side: CardinalDirection; offset: number } |
  { kind: "remove"; doorId: string };
export interface HallwayCell extends GridPoint { status: "build" | "existing" | "blocked" }
export interface HallwayPreview {
  cells: readonly HallwayCell[];
  buildCells: readonly GridPoint[];
  cost: number;
  reason: string | null;
}
/** Read-only previews and the phone-only grouped use of existing session commands. */
export interface MobileBuildActions {
  /** MobileShell mount/unmount only; the desktop history stays unbounded. */
  setHistoryLimit?: (enabled: boolean) => void;
  previewPlacement: (x: number, y: number, orientation?: RoomOrientation) => BuildValidation;
  previewHallway: (cells: readonly GridPoint[]) => HallwayPreview;
  previewDoor: (request: DoorRequest) => BuildValidation;
  commitHallway: (cells: readonly GridPoint[]) => boolean;
}
export interface DoorSection {
  id: string;
  roomId: string;
  side: CardinalDirection;
  offset: number;
  request: DoorRequest;
  validation: BuildValidation;
}
export type MobileBuildIntent = { kind: "ghost"; point: GridPoint } |
  { kind: "hallway"; cells: readonly GridPoint[] } | { kind: "door"; id: string | null };
export interface MobileBuildMapState {
  /** New catalog choices restart the preview without changing session commands. */
  placementKey?: string;
  ghost: (GridPoint & BuildValidation) | null;
  /** A move begins at this room's current spot; a new room starts at view center. */
  initialGhost: GridPoint | null;
  hallway: HallwayPreview | null;
  doors: readonly DoorSection[];
  selectedDoorId: string | null;
  onIntent: (intent: MobileBuildIntent) => void;
}
