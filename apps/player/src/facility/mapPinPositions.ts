import type { FacilityAlertPinPosition } from "./types";

export type MapPinElementBinder = (id: string, element: HTMLButtonElement | null, base: FacilityAlertPinPosition) => void;

/** Coordinates change every camera frame; React membership/text does not.
 * One current position array and the currently mounted buttons, no history. */
export function createMapPinPositionWriter(onMembershipChange: (positions: FacilityAlertPinPosition[]) => void) {
  let positions: FacilityAlertPinPosition[] = [], membership = "[]";
  const elements = new Map<string, { element: HTMLButtonElement; base: FacilityAlertPinPosition; transform?: string }>();
  const place = (position: FacilityAlertPinPosition) => {
    const target = elements.get(position.id);
    if (!target) return;
    const transform = `translate(${position.x - target.base.x}px, ${position.y - target.base.y}px) translate(-50%, -100%)`;
    if (transform === target.transform) return;
    target.element.style.transform = transform;
    target.transform = transform;
  };
  return {
    publish(next: FacilityAlertPinPosition[]) {
      positions = next;
      for (const position of positions) place(position);
      const signature = JSON.stringify(positions.map(position => position.id));
      if (signature === membership) return;
      membership = signature;
      onMembershipChange(positions);
    },
    bind: ((id, element, base) => {
      if (!element) { elements.delete(id); return; }
      elements.set(id, { element, base });
      place(positions.find(position => position.id === id) ?? base);
    }) satisfies MapPinElementBinder,
  };
}
