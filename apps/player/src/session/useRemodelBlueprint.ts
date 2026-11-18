import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { getRoomDefinition, PROTOTYPE_DOMAIN_CONTEXT, type GameState, type RoomRemodelStep } from "@gamify-surgery/game-domain";
import { remodelBlueprintPreview, stageRemodelStep, type RemodelBlueprintView } from "./remodelBlueprint";
import { mapSessionAction, type SessionActionResult } from "./sessionActions";
import { problemDiagnostics, showCommandProblem } from "../diagnostics/problemDiagnostics";
import { letteredRoomNames } from "./buildModePresentation";
import { roomRemodelSelectionReason } from "./roomRemodelSelection";

export function useRemodelBlueprint(input: {
  state: GameState; buildMode: boolean; getState: () => GameState;
  edit: (roomId: string, step: RoomRemodelStep) => void;
  clearPlacement: () => void;
  commit: (steps: RoomRemodelStep[]) => SessionActionResult<string>;
  announce: (message: string) => void;
}) {
  const [active, setActive] = useState(false);
  const [steps, setSteps] = useState<RoomRemodelStep[]>([]);
  const [undoCount, setUndoCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const current = useRef(input); current.current = input;
  const draft = useRef<RoomRemodelStep[]>([]), history = useRef<RoomRemodelStep[][]>([]), applying = useRef(false);
  const reset = useCallback(() => {
    draft.current = []; history.current = []; setSteps([]); setUndoCount(0); setActive(false);
  }, []);
  useLayoutEffect(() => { if (!input.buildMode) reset(); }, [input.buildMode, input.state.campaignId, reset]);
  useLayoutEffect(reset, [input.state.campaignId, reset]);
  const stage = useCallback((step: RoomRemodelStep): boolean => {
    if (!active || !current.current.buildMode || applying.current) return false;
    const reason = roomRemodelSelectionReason(current.current.getState(), step.roomId);
    if (reason) { showCommandProblem(reason, "rejection"); current.current.announce(reason); return false; }
    const room = current.current.getState().rooms.find(row => row.id === step.roomId);
    if (!room || !getRoomDefinition(room.roomDefinitionId) || !Number.isSafeInteger(step.x) || !Number.isSafeInteger(step.y)) {
      current.current.announce("That room is no longer available. Choose a room again."); return false;
    }
    history.current.push(draft.current);
    draft.current = stageRemodelStep(draft.current, step); setSteps(draft.current); setUndoCount(history.current.length);
    current.current.clearPlacement(); current.current.announce("Room staged. Apply the blueprint when the layout is ready."); return true;
  }, [active]);
  const editRoom = useCallback((id: string) => {
    if (!active || applying.current) return;
    const reason = roomRemodelSelectionReason(current.current.getState(), id);
    if (reason) { showCommandProblem(reason, "rejection"); current.current.announce(reason); return; }
    const room = current.current.getState().rooms.find(row => row.id === id);
    if (!room || !getRoomDefinition(room.roomDefinitionId)) { current.current.announce("That room is no longer available."); return; }
    current.current.edit(id, draft.current.find(row => row.roomId === id) ?? { roomId: id, x: room.x, y: room.y, orientation: room.orientation });
  }, [active]);
  const preview = useMemo(() => active ? remodelBlueprintPreview(input.state, steps) : { valid: false, reason: null, invalidRoomIds: [], ghosts: [] }, [input.state, active, steps]);
  const names = useMemo(() => active ? letteredRoomNames(input.state.rooms, id => getRoomDefinition(id)?.displayName ?? id) : new Map<string, string>(), [active, input.state.rooms]);
  const view: RemodelBlueprintView = {
    active, steps, undoCount, busy, valid: preview.valid, reason: preview.reason, invalidRoomIds: preview.invalidRoomIds,
    rooms: active ? input.state.rooms.flatMap(room => {
      const definition = getRoomDefinition(room.roomDefinitionId);
      return definition && !PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.protectedRoomDefinitionIds.includes(room.roomDefinitionId)
        ? [{ id: room.id, name: names.get(room.id) ?? definition.displayName }] : [];
    }) : [],
    begin: () => { if (!current.current.buildMode || applying.current) return; reset(); setActive(true); current.current.clearPlacement(); current.current.announce("Blueprint opened. Room changes are staged until Apply remodel."); },
    editRoom,
    undo: () => {
      if (applying.current || !history.current.length) return;
      draft.current = history.current.pop()!; setSteps(draft.current); setUndoCount(history.current.length);
      current.current.clearPlacement(); current.current.announce("Staged step undone. The clinic has not changed.");
    },
    cancel: () => { if (applying.current) return; reset(); current.current.clearPlacement(); current.current.announce("Blueprint canceled. The clinic has not changed."); },
    apply: () => {
      if (!active || !current.current.buildMode || applying.current || !draft.current.length) return false;
      const fresh = remodelBlueprintPreview(current.current.getState(), draft.current);
      if (!fresh.valid) {
        const reason = fresh.reason ?? "Check the staged rooms before applying.";
        showCommandProblem(reason, "rejection"); current.current.announce(reason); return false;
      }
      applying.current = true; setBusy(true);
      const finish = (status: string) => {
        applying.current = false; setBusy(false);
        if (status !== "applied") return false;
        reset(); current.current.clearPlacement(); return true;
      };
      const failed = (error: unknown) => {
        applying.current = false; setBusy(false);
        problemDiagnostics.error("remodel", error);
        current.current.announce("The remodel could not be completed. Your staged plan is still here.");
        showCommandProblem("The remodel could not be completed. Try again or send a problem report.");
        return false;
      };
      try {
        const result = mapSessionAction(current.current.commit([...draft.current]), finish);
        if (result instanceof Promise) return result.catch(failed);
        return result;
      } catch (error) { return failed(error); }
    },
  };
  return { view, stage, ghosts: preview.ghosts, draft: draft.current };
}
