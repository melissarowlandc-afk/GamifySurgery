import type { FacilityAlertPinPosition, FacilityAlertPinView } from "./types";

export function ClinicMapPins({ pins, positions, onAction }: {
  pins: readonly FacilityAlertPinView[];
  positions: readonly FacilityAlertPinPosition[];
  onAction?: (id: string) => void;
}) {
  return <div className="clinic-map-pins" aria-label="Live clinic problems">{positions.flatMap((position) => {
    const pin = pins.find((candidate) => candidate.id === position.id);
    return pin ? [<button key={pin.id} className="clinic-map-pin" type="button"
      style={{ left: position.x, top: position.y }} title={`${pin.title} · ${pin.actionLabel}`}
      aria-label={`${pin.title}: ${pin.actionLabel}`} disabled={!onAction}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => { event.stopPropagation(); onAction?.(pin.id); }}>!</button>] : [];
  })}</div>;
}
