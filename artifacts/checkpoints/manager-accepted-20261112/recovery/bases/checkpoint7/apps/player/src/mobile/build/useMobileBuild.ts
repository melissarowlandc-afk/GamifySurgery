import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { GridPoint } from "@gamify-surgery/game-domain";
import type { BuildDoorTool } from "../../facility/types";
import type { PrototypeShellProps } from "../../shellContract";
import { phoneDoorSections } from "./doorSections";
import type { MobileBuildIntent, MobileBuildMapState } from "./types";

const unavailable = { valid: false, reason: "The construction preview is unavailable.", cost: 0 };

export function useMobileBuild(props: PrototypeShellProps, doorTool: BuildDoorTool, setDoorTool: (tool: BuildDoorTool) => void) {
  const [ghost, setGhost] = useState<GridPoint | null>(null);
  const [stroke, setStroke] = useState<readonly GridPoint[]>([]);
  const [selectedDoorId, setSelectedDoorId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [doorNotice, setDoorNotice] = useState<{ text: string; undo: boolean } | null>(null);
  const [pendingRemovalId, setPendingRemovalId] = useState<string | null>(null);
  const [exitOpen, setExitOpen] = useState(false);
  const [controlsHeight, setControlsHeight] = useState(136);
  const [previewRevision, setPreviewRevision] = useState(0);
  const confirmLatch = useRef(false);
  const actions = props.mobileBuildActions;
  const placement = props.facility.placement;
  const hallwayActive = placement?.kind === "hallway" || placement?.definitionId === "room.hallway";
  const moving = props.facility.rooms.find(room => room.instanceId === props.movingRoomInstanceId);
  const modeKey = `${props.facility.campaignId}:${props.buildMode}:${placement?.definitionId}:${props.movingRoomInstanceId}`;
  // Clear the old mode's preview before Phaser can initialize the new ghost.
  useLayoutEffect(() => {
    setGhost(null); setStroke([]); setSelectedDoorId(null); setFeedback(null); setDoorNotice(null); setPendingRemovalId(null); confirmLatch.current = false;
    if (!props.buildMode) setExitOpen(false);
  }, [modeKey]);
  useEffect(() => { setSelectedDoorId(null); setDoorNotice(null); setPendingRemovalId(null); }, [doorTool]);
  useEffect(() => {
    if (!pendingRemovalId) return;
    setPendingRemovalId(null);
    // The existing callback returns void. Confirm removal from the next shared projection.
    setDoorNotice((props.facility.doors ?? []).some(door => door.instanceId === pendingRemovalId)
      ? { text: props.announcement || "The door could not be removed. Try again.", undo: false }
      : { text: "Door removed", undo: true });
  }, [pendingRemovalId, props.facility.doors, props.announcement]);
  useEffect(() => {
    if (!doorNotice) return;
    const timer = window.setTimeout(() => { setDoorNotice(null); setSelectedDoorId(null); }, 3_000);
    return () => window.clearTimeout(timer);
  }, [doorNotice]);
  const validation = useMemo(() => ghost
    ? actions?.previewPlacement(ghost.x, ghost.y, props.placementOrientation) ?? unavailable : unavailable,
  [ghost, actions?.previewPlacement, props.placementOrientation, props.facility.rooms, props.resourceBar.moneyLabel]);
  const hallway = useMemo(() => hallwayActive
    ? actions?.previewHallway(stroke) ?? { cells: [], buildCells: [], cost: 0, reason: unavailable.reason } : null,
  [hallwayActive, stroke, actions?.previewHallway, props.facility.rooms, props.resourceBar.moneyLabel]);
  const doors = useMemo(() => props.buildMode && doorTool && actions ? phoneDoorSections(props.facility, actions) : [],
    [props.buildMode, doorTool, actions?.previewDoor, props.facility.rooms, props.facility.doors, props.facility.selectedRoomInstanceId]);
  const selectedDoor = doors.find(section => section.id === selectedDoorId) ?? null;
  const doorContext = useRef({ props, doorTool, doors });
  doorContext.current = { props, doorTool, doors };
  const onIntent = useCallback((intent: MobileBuildIntent) => {
    setFeedback(null);
    if (intent.kind === "ghost") setGhost(previous => previous?.x === intent.point.x && previous.y === intent.point.y ? previous : intent.point);
    if (intent.kind === "hallway") { confirmLatch.current = false; setStroke(intent.cells); }
    if (intent.kind !== "door") return;
    const current = doorContext.current;
    if (!current.props.buildMode || !current.doorTool || intent.id === null) return;
    const section = current.doors.find(candidate => candidate.id === intent.id);
    if (!section) return;
    setDoorNotice(null); setPendingRemovalId(null); setSelectedDoorId(section.id);
    const fresh = current.props.mobileBuildActions?.previewDoor(section.request) ?? unavailable;
    if (!fresh.valid) { setDoorNotice({ text: fresh.reason ?? "This wall section is unavailable.", undo: false }); return; }
    const request = section.request;
    if (request.kind === "add") current.props.onPlaceDoor(request.roomId, request.side, request.offset);
    else { current.props.onRemoveDoor(request.doorId); setPendingRemovalId(request.doorId); }
    setSelectedDoorId(null);
  }, []);
  const map: MobileBuildMapState | null = props.buildMode ? {
    placementKey: `${modeKey}:${previewRevision}`,
    ghost: placement && !hallwayActive && ghost ? { ...ghost, ...validation } : null,
    initialGhost: moving ? { x: moving.tileX, y: moving.tileY } : null,
    hallway, doors, selectedDoorId, onIntent,
  } : null;
  const start = () => {
    confirmLatch.current = false; setGhost(null); setStroke([]); setSelectedDoorId(null); setFeedback(null); setDoorNotice(null); setPendingRemovalId(null);
    setPreviewRevision(previous => previous + 1);
  };
  const cancel = () => {
    confirmLatch.current = false; setGhost(null); setStroke([]); setSelectedDoorId(null); setFeedback(null); setDoorNotice(null); setPendingRemovalId(null);
    if (doorTool) setDoorTool(null); else if (!hallwayActive) props.onCancelPlacement();
  };
  const confirmPlacement = () => {
    if (!props.buildMode || !ghost || !placement || hallwayActive || confirmLatch.current) return;
    const fresh = actions?.previewPlacement(ghost.x, ghost.y, props.placementOrientation) ?? unavailable;
    if (!fresh.valid) { setFeedback(fresh.reason); return; }
    confirmLatch.current = true;
    const placed = props.onPlaceRoom(ghost.x, ghost.y, props.placementOrientation);
    if (placed) { setGhost(null); if (!props.movingRoomInstanceId) setDoorTool("place"); }
    else { confirmLatch.current = false; setFeedback("The change could not be applied. Check the room status and try again."); }
  };
  const confirmHallway = () => {
    if (!props.buildMode || !hallwayActive || !hallway?.buildCells.length || confirmLatch.current) return;
    confirmLatch.current = true;
    if (actions?.commitHallway(stroke)) setStroke([]);
    else { confirmLatch.current = false; setFeedback("The hallway could not be built. Check the preview and try again."); }
  };
  const exitDoors = () => { setDoorTool(null); setSelectedDoorId(null); setDoorNotice(null); setPendingRemovalId(null); };
  return { map, ghost, validation, hallway, selectedDoor, feedback, doorNotice, exitOpen, controlsHeight, setControlsHeight, doorTool, closeExit: () => setExitOpen(false),
    confirmPlacement, confirmHallway, cancel, start, exitDoors,
    undo: () => { confirmLatch.current = false; setGhost(null); setStroke([]); setSelectedDoorId(null); setFeedback(null); setDoorNotice(null); setPendingRemovalId(null); props.onUndoBuildAction(); },
    done: () => { exitDoors(); setExitOpen(true); props.onExitBuildMode(); },
  };
}
export type MobileBuildController = ReturnType<typeof useMobileBuild>;
