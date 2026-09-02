import type { KeyboardEvent, PointerEvent, RefObject } from "react";
import {
  clampWorkspaceMapShare,
  workspaceMapShareFromPointer,
} from "./workspaceSplitPreference";

interface WorkspaceSplitterProps {
  workspaceRef: RefObject<HTMLElement | null>;
  mapShare: number;
  onMapShareChange: (mapShare: number) => void;
}

const KEYBOARD_STEP = 0.02;

export function WorkspaceSplitter({
  workspaceRef,
  mapShare,
  onMapShareChange,
}: WorkspaceSplitterProps) {
  const updateFromPointer = (clientY: number) => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    const bounds = workspace.getBoundingClientRect();
    onMapShareChange(
      workspaceMapShareFromPointer(clientY, bounds.top, bounds.height),
    );
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromPointer(event.clientY);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      updateFromPointer(event.clientY);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    const workspaceHeight = workspaceRef.current?.clientHeight ?? 0;
    onMapShareChange(
      clampWorkspaceMapShare(
        mapShare + (event.key === "ArrowDown" ? KEYBOARD_STEP : -KEYBOARD_STEP),
        workspaceHeight,
      ),
    );
  };

  const value = Math.round(mapShare * 100);
  return (
    <div className="workspace-splitter-row">
      <div
        className="workspace-splitter"
        role="separator"
        tabIndex={0}
        aria-orientation="horizontal"
        aria-label="Resize facility map and clinical desk"
        aria-valuemin={20}
        aria-valuemax={80}
        aria-valuenow={value}
        aria-valuetext={`Facility map ${value} percent; clinical desk ${100 - value} percent`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={onKeyDown}
      >
        <span className="workspace-splitter-cue" aria-hidden="true" />
        <span className="workspace-splitter-grip" aria-hidden="true" />
      </div>
    </div>
  );
}
