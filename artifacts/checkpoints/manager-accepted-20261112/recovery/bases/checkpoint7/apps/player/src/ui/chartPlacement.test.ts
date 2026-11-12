import { describe, expect, it } from "vitest";
import { getChartPlacement } from "./ChartPanel";

const area = { left: 200, top: 80, right: 1480 };
const desk = { left: 400, top: 450, bottom: 850, width: 1080, height: 400 };
const place = (contentHeight: number, deskRect = desk) => getChartPlacement({
  desk: deskRect, area, viewportHeight: 900, contentHeight,
});

describe("chart placement", () => {
  it("pins a short content-sized chart to the desk's top middle", () => {
    expect(place(250)).toEqual({ left: 420, width: 1040, top: 450, bottom: "auto", maxHeight: 762 });
    expect(place(250)).not.toHaveProperty("height");
  });

  it("centers short charts over a desk narrower than the chart when space permits", () => {
    expect(place(250, { ...desk, left: 600, width: 700 }).left).toBe(430);
  });

  it.each([400, 401, 1200])("retains the previous bottom pin and maximum height for %i px of content", (height) => {
    expect(place(height)).toEqual({ left: 420, width: 1040, top: "auto", bottom: 50, maxHeight: 762 });
  });

  it("retains the previous left-edge preference for a tall chart over a narrow desk", () => {
    expect(place(600, { ...desk, left: 250, width: 700 }).left).toBe(250);
  });

  it("clamps a short chart to the play-area edges when centering would overflow", () => {
    const placement = getChartPlacement({
      desk: { ...desk, left: 1000, width: 300 },
      area: { left: 200, top: 80, right: 1100 }, viewportHeight: 900, contentHeight: 250,
    });
    expect(placement).toMatchObject({ left: 208, width: 884, top: 450, bottom: "auto" });
  });

  it("can move between top and bottom pins as feedback grows and then collapses", () => {
    const heights = [250, 650, 250];
    expect(heights.map((height) => place(height).top)).toEqual([450, "auto", 450]);
    expect(heights.map((height) => place(height).bottom)).toEqual(["auto", 50, "auto"]);
  });
});
