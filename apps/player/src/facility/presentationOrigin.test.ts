import { describe, expect, it } from "vitest";

import { snapPresentationOrigin } from "./presentationOrigin";

describe("snapPresentationOrigin", () => {
  it("keeps existing whole-pixel origins unchanged", () => {
    expect(snapPresentationOrigin(-1221)).toBe(-1221);
    expect(snapPresentationOrigin(0)).toBe(0);
    expect(snapPresentationOrigin(418)).toBe(418);
  });

  it("quantizes fractional pan presentation after clamping", () => {
    expect(snapPresentationOrigin(-1168.0114199525965)).toBe(-1168);
    expect(snapPresentationOrigin(19.51)).toBe(20);
    expect(Object.is(snapPresentationOrigin(-0.2), -0)).toBe(false);
  });

  it("keeps values within integer clamp boundaries when they were clamped first", () => {
    expect(snapPresentationOrigin(-99.6)).toBe(-100);
    expect(snapPresentationOrigin(-0.4)).toBe(0);
  });
});
