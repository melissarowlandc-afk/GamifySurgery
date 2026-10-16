import { getApprovedPlacementOrientations } from "../../facility/roomVisualLayout";
import type { PrototypeShellProps } from "../../shellContract";
import type { MobileBuildController } from "./useMobileBuild";
import { MobileSheet } from "../MobileSheet";
import { useLayoutEffect, useRef } from "react";

export function MobileBuildControls({ props, build, onCatalog }: { props: PrototypeShellProps; build: MobileBuildController; onCatalog: () => void }) {
  const placement = props.facility.placement;
  const hallway = build.hallway;
  const doors = Boolean(build.doorTool);
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const element = ref.current; if (!element) return;
    const measure = () => { const height = element.getBoundingClientRect().height; if (height > 0) build.setControlsHeight(Math.ceil(height)); };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure); observer.observe(element);
    return () => observer.disconnect();
  }, [build.setControlsHeight]);
  const price = placement ? props.roomOptions.find(option => option.id === placement.definitionId)?.costLabel : null;
  return <aside ref={ref} className="mobile-build-controls" aria-label="Build actions" data-phone-build-controls="true">
    <div className="mobile-build-persistent">
      <button type="button" data-phone-anchor="build-catalog" onClick={onCatalog}>Room catalog</button>
      <button type="button" disabled={!props.buildUndoCount} onClick={build.undo} title={props.buildUndoLabel ?? undefined}>Undo{props.buildUndoCount ? ` (${props.buildUndoCount})` : ""}</button>
      <button type="button" data-phone-anchor="build-done" data-build-action="exit" onClick={build.done}>Done</button>
    </div>
    {placement && !hallway ? <>
      <p className={build.validation.valid ? "mobile-build-valid" : "mobile-build-reason"} role="status">
        {placement.displayName} · {placement.width} × {placement.height} · {build.validation.valid ? "Ready to place" : build.validation.reason}
      </p>
      <p className="mobile-build-hint">Drag the ghost with one finger. Use two fingers to pan or pinch.</p>
      <div className="mobile-build-confirm">
        <button type="button" data-phone-anchor="place" data-phone-build-confirm="placement" disabled={!build.ghost || !build.validation.valid} onClick={build.confirmPlacement}>✓ {props.movingRoomInstanceId ? "Move" : "Place"} · {props.movingRoomInstanceId ? "$0" : price}</button>
        {!props.movingRoomInstanceId && getApprovedPlacementOrientations(placement.definitionId).length > 1
          ? <button type="button" onClick={props.onRotatePlacement}>↻ Rotate</button> : null}
        <button type="button" onClick={build.cancel}>✕ Cancel</button>
      </div>
    </> : hallway ? <>
      <p role="status">{hallway.buildCells.length} new hallway cells · ${hallway.cost.toLocaleString()}{hallway.reason ? ` · Stroke stops: ${hallway.reason}` : ""}</p>
      <p className="mobile-build-hint">Drag to preview. Green cells will be built; existing hallway is free. Two fingers pan or pinch.</p>
      <div className="mobile-build-confirm">
        <button type="button" data-phone-build-confirm="hallway" disabled={!hallway.buildCells.length} onClick={build.confirmHallway}>✓ Build hallway · ${hallway.cost.toLocaleString()}</button>
        <button type="button" onClick={build.cancel}>✕ Cancel</button>
      </div>
    </> : doors ? <>
      <p role="status" data-phone-anchor="doors-active">Doors · Tap a green wall section to add a door. Tap an existing door to remove it.</p>
    </> : <p className="mobile-build-hint">Choose a new room, or tap a built room to upgrade, move, edit doors or sell.</p>}
    {build.feedback ? <p className="mobile-build-reason" role="status">{build.feedback}</p> : null}
  </aside>;
}

export function MobileBuildExitSheet({ props, onClose }: { props: PrototypeShellProps; onClose: () => void }) {
  return <MobileSheet title="Finish room access" kind="bottom" onClose={onClose}>
    <p role="status">{props.buildExitBlockedReason}</p>
    {props.buildExitBlockedIssues.length ? <ul>{props.buildExitBlockedIssues.map((issue, index) => <li key={`${index}:${issue}`}>{issue}</li>)}</ul> : null}
    <button type="button" onClick={onClose}>Continue Renovating</button>
  </MobileSheet>;
}
