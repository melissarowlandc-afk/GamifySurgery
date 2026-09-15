import { describe, expect, it } from "vitest";

import { getProceduralSurfaceRow } from "./proceduralSurfacePhase";

describe("getProceduralSurfaceRow", () => {
  it("keeps stagger parity fixed to a room when its rendered rectangle pans", () => {
    const beforePan = getProceduralSurfaceRow(133, 80, 9);
    const afterPan = getProceduralSurfaceRow(96, 43, 9);

    expect(beforePan).toBe(5);
    expect(afterPan).toBe(beforePan);
    expect(beforePan % 2).toBe(1);
  });

  it("advances exactly once for each local procedural spacing", () => {
    expect(getProceduralSurfaceRow(80, 80, 9)).toBe(0);
    expect(getProceduralSurfaceRow(88, 80, 9)).toBe(0);
    expect(getProceduralSurfaceRow(89, 80, 9)).toBe(1);
  });
});
