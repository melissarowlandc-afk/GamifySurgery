import { getRoomDefinition, getRotatedFootprint, PROTOTYPE_DOMAIN_CONTEXT, validateRoomRemodelPlan,
  type GameState, type RoomRemodelStep } from "@gamify-surgery/game-domain";
import type { FacilityRemodelGhost } from "../facility/types";
import { roomRemodelSelectionReason } from "./roomRemodelSelection";

/** Presentation-only draft. No domain command, clock, save or RNG is invoked. */
export function stageRemodelStep(steps: readonly RoomRemodelStep[], step: RoomRemodelStep): RoomRemodelStep[] {
  return [...steps.filter(row => row.roomId !== step.roomId), { ...step }];
}
export function remodelBlueprintPreview(state: GameState, steps: readonly RoomRemodelStep[]) {
  const validation = validateRoomRemodelPlan(state, steps, PROTOTYPE_DOMAIN_CONTEXT);
  // Keep domain validation/invalid IDs intact, translating its legacy work
  // receipt wording only for the presentation of a changed room.
  const selectionReason = validation.valid ? null : steps.map(step => {
    const room = state.rooms.find(candidate => candidate.id === step.roomId);
    return room && validation.invalidRoomIds.includes(room.id) && (room.x !== step.x || room.y !== step.y || room.orientation !== step.orientation)
      ? roomRemodelSelectionReason(state, step.roomId) : null;
  }).find(reason => reason !== null);
  const ghosts: FacilityRemodelGhost[] = steps.flatMap(step => {
    const room = state.rooms.find(row => row.id === step.roomId);
    const definition = room && getRoomDefinition(room.roomDefinitionId);
    if (!room || !definition) return [];
    const size = getRotatedFootprint(definition, step.orientation);
    return [{ ...step, ...size, valid: !validation.invalidRoomIds.includes(step.roomId), name: definition.displayName }];
  });
  return { ...validation, reason: selectionReason ?? validation.reason, ghosts };
}
export interface RemodelBlueprintView {
  active: boolean;
  steps: readonly RoomRemodelStep[];
  undoCount: number;
  valid: boolean;
  reason: string | null;
  invalidRoomIds: readonly string[];
  rooms: readonly { id: string; name: string }[];
  busy: boolean;
  begin: () => void;
  editRoom: (id: string) => void;
  undo: () => void;
  cancel: () => void;
  apply: () => boolean | Promise<boolean>;
}
