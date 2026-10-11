import {
  gameReducer, getRoomDefinition, getRoomInstanceFootprint, PROTOTYPE_DOMAIN_CONTEXT,
  validateDoorPlacement, type GameCommand, type GameState, type GridPoint, type RoomOrientation,
} from "@gamify-surgery/game-domain";
import { getApprovedPlacementOrientations } from "../../facility/roomVisualLayout";
import type { BuildValidation, DoorRequest, HallwayCell, HallwayPreview } from "./types";

function previewId(state: GameState, prefix: string): string {
  let id = prefix;
  while (state.operationReceipts[id] || state.rooms.some(room => room.id === id)) id += ".next";
  return id;
}

/** Run the real reducer in isolation. Its returned state is never retained or saved. */
function previewCommand(state: GameState, command: GameCommand): { validation: BuildValidation; next: GameState } {
  const next = gameReducer(state, command, PROTOTYPE_DOMAIN_CONTEXT);
  const receipt = next.operationReceipts[command.operationId];
  const valid = receipt?.status === "applied";
  return { next, validation: { valid, reason: valid ? null : receipt?.message ?? "This change is unavailable.",
    cost: valid ? state.cash - next.cash : 0 } };
}

export function previewMobilePlacement(state: GameState, definitionId: string | null, movingId: string | null,
  x: number, y: number, orientation: RoomOrientation = 0): BuildValidation {
  if (!definitionId) return { valid: false, reason: "Select a room before choosing its location.", cost: 0 };
  const operationId = previewId(state, "mobile.preview.placement");
  return previewCommand(state, movingId
    ? { type: "MOVE_ROOM", operationId, roomId: movingId, x, y }
    : { type: "PLACE_ROOM", operationId, roomId: previewId(state, "room.mobile.preview"), roomDefinitionId: definitionId,
      x, y, orientation: getApprovedPlacementOrientations(definitionId).includes(orientation) ? orientation : 0 }).validation;
}

/** Desktop's visual per-cell gate, then the identical PLACE_ROOM reducer/cost gate.
 * Existing hallway cells are crossed for free; any other invalid cell stops the stroke.
 */
export function previewMobileHallway(state: GameState, points: readonly GridPoint[]): HallwayPreview {
  const cells: HallwayCell[] = [];
  const buildCells: GridPoint[] = [];
  const visited = new Set<string>();
  let working = state;
  let reason: string | null = null;
  const facility = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility;
  for (const point of points) {
    const key = `${point.x}:${point.y}`;
    if (visited.has(key)) continue;
    visited.add(key);
    const occupying = working.rooms.find(room => {
      const size = getRoomInstanceFootprint(working, room.id);
      return size && point.x >= room.x && point.y >= room.y && point.x < room.x + size.width && point.y < room.y + size.height;
    });
    if (occupying && getRoomDefinition(occupying.roomDefinitionId)?.kind === "hallway") {
      cells.push({ ...point, status: "existing" }); continue;
    }
    if (!Number.isInteger(point.x) || !Number.isInteger(point.y) || point.x < 0 || point.y < 0 ||
      point.x >= facility.gridWidth || point.y >= facility.gridHeight || occupying) {
      reason = occupying ? "The room overlaps an existing room." : "The room does not fit inside the facility.";
      cells.push({ ...point, status: "blocked" }); break;
    }
    const operationId = previewId(working, "mobile.preview.hallway");
    const preview = previewCommand(working, { type: "PLACE_ROOM", operationId,
      roomId: previewId(working, "room.mobile.preview.hallway"), roomDefinitionId: "room.hallway", x: point.x, y: point.y, orientation: 0 });
    if (!preview.validation.valid) {
      reason = preview.validation.reason; cells.push({ ...point, status: "blocked" }); break;
    }
    working = preview.next;
    cells.push({ ...point, status: "build" }); buildCells.push({ x: point.x, y: point.y });
  }
  return { cells, buildCells, cost: state.cash - working.cash, reason };
}

export function previewMobileDoor(state: GameState, request: DoorRequest): BuildValidation {
  if (request.kind === "remove") return previewCommand(state, { type: "REMOVE_DOOR",
    operationId: previewId(state, "mobile.preview.door.remove"), doorId: request.doorId }).validation;
  // PLACE_DOOR delegates all wall-section rules to this same pure validator.
  const facility = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility;
  const validation = validateDoorPlacement({ id: "door.mobile.preview", roomId: request.roomId,
    side: request.side, offset: request.offset, exterior: false }, state.rooms, state.doors,
  getRoomDefinition, facility.gridWidth, facility.gridHeight, new Set(facility.protectedRoomDefinitionIds));
  return { valid: validation.valid, reason: validation.reason, cost: 0 };
}
