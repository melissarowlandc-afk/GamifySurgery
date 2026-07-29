import type { GridPoint } from "@gamify-surgery/game-domain";

import type { FacilityViewModel } from "./types";

export type EnvironmentalInteraction =
  | { kind: "litter"; id: string; label: string }
  | { kind: "water_cooler"; label: string; actionable: boolean }
  | { kind: "employee"; id: string; label: string };

export function getEnvironmentalInteraction(
  model: FacilityViewModel,
  point: GridPoint,
): EnvironmentalInteraction | null {
  const litter = (model.litterItems ?? []).find(
    (item) =>
      item.location.x === point.x && item.location.y === point.y,
  );
  if (litter) {
    return {
      kind: "litter",
      id: litter.instanceId,
      label: "CLICK TO CLEAN LITTER",
    };
  }

  const cooler = model.waterCooler;
  if (
    cooler &&
    cooler.location.x === point.x &&
    cooler.location.y === point.y
  ) {
    return {
      kind: "water_cooler",
      label: cooler.needsRefill
        ? "CLICK TO REFILL WATER COOLER"
        : "WATER COOLER IS FULL",
      actionable: cooler.needsRefill,
    };
  }

  const employee = model.staff.find(
    (candidate) =>
      candidate.location?.x === point.x &&
      candidate.location?.y === point.y,
  );
  return employee
    ? {
        kind: "employee",
        id: employee.instanceId,
        label: `CLICK TO PRAISE ${employee.displayName.toUpperCase()}`,
      }
    : null;
}

export function getCleanlinessWearSeverity(
  cleanliness: number | undefined,
): number {
  const normalized = Math.max(
    0,
    Math.min(100, cleanliness ?? 100),
  );
  return normalized >= 70 ? 0 : (70 - normalized) / 70;
}
