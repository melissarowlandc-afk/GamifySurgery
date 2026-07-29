import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AdvertisingPanel } from "./AdvertisingPanel";

describe("AdvertisingPanel", () => {
  it("shows persistent tier controls, hourly cost, and arrival effect", () => {
    const markup = renderToStaticMarkup(
      <AdvertisingPanel
        view={{
          currentLevel: 1,
          currentDisplayName: "Local listings",
          hourlyCostLabel: "$4/hr",
          arrivalFrequencyLabel: "About +9% arrival frequency",
          canDecrease: true,
          canIncrease: true,
          levels: [
            {
              level: 0,
              displayName: "Off",
              hourlyCostLabel: "$0/hr",
              arrivalFrequencyLabel: "Normal arrival frequency",
              selected: false,
            },
            {
              level: 1,
              displayName: "Local listings",
              hourlyCostLabel: "$4/hr",
              arrivalFrequencyLabel: "About +9% arrival frequency",
              selected: true,
            },
          ],
        }}
        onDecrease={vi.fn()}
        onIncrease={vi.fn()}
      />,
    );

    expect(markup).toContain("Advertising");
    expect(markup).toContain("Level 1");
    expect(markup).toContain("$4/hr");
    expect(markup).toContain("About +9% arrival frequency");
    expect(markup).toContain('aria-label="Decrease advertising"');
    expect(markup).toContain('aria-label="Increase advertising"');
    expect(markup).toContain("Levels");
  });
});
