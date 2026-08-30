import { describe, expect, it } from "vitest";

import { getActorPresentationBaseY } from "./exteriorActorPresentation";

const layout = {
  originY: -120,
  tileSize: 20,
  sidewalkTop: 140,
  sidewalkHeight: 42,
  gridRows: 10,
} as const;

describe("exterior actor presentation", () => {
  it("leaves interior actor baselines unchanged", () => {
    expect(getActorPresentationBaseY(8.25, 0.72, layout)).toBe(
      layout.originY + (8.25 + 0.72) * layout.tileSize,
    );
  });

  it("eases monotonically through the final entrance-to-sidewalk segment", () => {
    const samples = [9, 9.2, 9.4, 9.6, 9.8, 10].map((logicalY) =>
      getActorPresentationBaseY(logicalY, 0.72, layout),
    );
    expect(samples[0]).toBe(layout.originY + (9 + 0.72) * layout.tileSize);
    for (let index = 1; index < samples.length; index += 1) {
      expect(samples[index]).toBeGreaterThan(samples[index - 1]!);
    }
    expect(samples.at(-1)).toBeGreaterThan(samples[0]!);
  });

  it("grounds the logical sidewalk row on the authored pavement", () => {
    const baseline = getActorPresentationBaseY(10, 0.72, layout);
    expect(baseline).toBeGreaterThan(layout.sidewalkTop);
    expect(baseline).toBeLessThan(layout.sidewalkTop + layout.sidewalkHeight);
  });
});
