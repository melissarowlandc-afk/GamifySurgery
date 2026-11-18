import type { RemodelBlueprintView } from "../session/remodelBlueprint";
import "./remodel.css";

/** The same draft and atomic Apply action on phone and desktop. */
export function RemodelControls({ blueprint }: { blueprint?: RemodelBlueprintView }) {
  if (!blueprint) return null;
  if (!blueprint.active) return <button type="button" className="text-button" onClick={blueprint.begin}>Blueprint remodel</button>;
  return <section className="remodel-controls" aria-label="Blueprint remodel">
    <strong>Blueprint remodel <small>Not applied</small></strong>
    <select aria-label="Room to remodel" value="" disabled={blueprint.busy} onChange={event => blueprint.editRoom(event.currentTarget.value)}>
      <option value="" disabled>Choose a room to move or rotate</option>
      {blueprint.rooms.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}
    </select>
    {blueprint.steps.length ? <ul className="remodel-steps">{blueprint.steps.map(step => <li key={step.roomId} data-remodel-valid={!blueprint.invalidRoomIds.includes(step.roomId)}>
      <button type="button" disabled={blueprint.busy} onClick={() => blueprint.editRoom(step.roomId)}>
        {blueprint.rooms.find(room => room.id === step.roomId)?.name ?? "Unavailable room"} · {step.x}, {step.y} · {step.orientation}°
        {blueprint.invalidRoomIds.includes(step.roomId) ? " · Needs attention" : ""}
      </button>
    </li>)}</ul> : <p>Stage room positions on the map. Apply checks the whole layout, so rooms can swap places.</p>}
    {blueprint.reason && blueprint.steps.length ? <p role="status" className="remodel-reason">{blueprint.reason}</p> : null}
    <div className="remodel-actions">
      <button type="button" disabled={!blueprint.undoCount || blueprint.busy} onClick={blueprint.undo}>Undo staged step</button>
      <button type="button" disabled={blueprint.busy} onClick={blueprint.cancel}>Cancel blueprint</button>
      <button type="button" className="button button-primary" disabled={!blueprint.steps.length || !blueprint.valid || blueprint.busy} onClick={() => { void blueprint.apply(); }}>Apply remodel</button>
    </div>
  </section>;
}
