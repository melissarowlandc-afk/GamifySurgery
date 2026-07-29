/**
 * Facility objects share one world-space depth band. The stride leaves room
 * for deterministic same-baseline ordering without allowing a fixture on a
 * later baseline to jump in front of an earlier one.
 */
export const FACILITY_DEPTH_WORLD = 0;
export const FACILITY_DEPTH_SORTABLE_BASE = 100_000;
export const FACILITY_DEPTH_LOCATOR = 1_000_000;
export const FACILITY_DEPTH_BUILD_OVERLAY = 1_000_100;
export const FACILITY_DEPTH_UI = 1_000_200;

const BASELINE_STRIDE = 128;
const CHARACTER_TIE_OFFSET = 64;
const MAXIMUM_STABLE_ORDER = 63;

export type FacilitySortableKind = "fixture" | "character";

/**
 * Converts a rendered floor-contact/baseline Y coordinate into a Phaser
 * display depth.
 *
 * Fixtures sort before characters when both touch the same rendered
 * baseline. `stableOrder` provides a deterministic order within one kind
 * without crossing that fixture/character boundary.
 */
export function getFacilitySceneDepth(
  contactY: number,
  kind: FacilitySortableKind,
  stableOrder = 0,
): number {
  const baseline = Number.isFinite(contactY)
    ? Math.round(contactY)
    : 0;
  const order = Number.isFinite(stableOrder)
    ? Math.max(
        0,
        Math.min(MAXIMUM_STABLE_ORDER, Math.floor(stableOrder)),
      )
    : 0;
  const kindOffset = kind === "character" ? CHARACTER_TIE_OFFSET : 0;

  return (
    FACILITY_DEPTH_SORTABLE_BASE +
    baseline * BASELINE_STRIDE +
    kindOffset +
    order
  );
}
