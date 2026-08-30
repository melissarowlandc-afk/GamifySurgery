import { describe, expect, it } from "vitest";

import {
  getWorldExteriorHeight,
  getWorldExteriorLayout,
} from "./worldExteriorLayout";

describe("world exterior layout", () => {
  it("anchors the default sidewalk below the grid rather than to a viewport", () => {
    const layout = getWorldExteriorLayout({ originX: 20, originY: -180, tileSize: 20, gridColumns: 60, gridRows: 32 });
    expect(layout.sidewalkTop).toBeGreaterThan(layout.gridBottom);
    expect(layout.worldBottom - layout.siteTop).toBe(getWorldExteriorHeight(20, 32));
  });

  it("translates the entire exterior with camera pan", () => {
    const before = getWorldExteriorLayout({ originX: 20, originY: -180, tileSize: 20, gridColumns: 60, gridRows: 32 });
    const after = getWorldExteriorLayout({ originX: -35, originY: -123, tileSize: 20, gridColumns: 60, gridRows: 32 });
    expect(after.siteLeft - before.siteLeft).toBe(-55);
    expect(after.sidewalkTop - before.sidewalkTop).toBeCloseTo(57);
    expect(after.curbTop - before.curbTop).toBeCloseTo(57);
  });

  it("scales exterior bands with tile size and keeps the actor baseline on pavement", () => {
    const small = getWorldExteriorLayout({ originX: 0, originY: 0, tileSize: 10, gridColumns: 16, gridRows: 10 });
    const large = getWorldExteriorLayout({ originX: 0, originY: 0, tileSize: 20, gridColumns: 16, gridRows: 10 });
    expect(large.sidewalkHeight).toBe(small.sidewalkHeight * 2);
    expect(large.siteWidth).toBe(small.siteWidth * 2);
    expect(large.actorSidewalkBaseline).toBeGreaterThan(large.sidewalkTop);
    expect(large.actorSidewalkBaseline).toBeLessThan(large.sidewalkBottom);
  });
});
