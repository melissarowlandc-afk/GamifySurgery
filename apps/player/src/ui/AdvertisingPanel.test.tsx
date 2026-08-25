import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AdvertisingPanel } from "./AdvertisingPanel";

describe("AdvertisingPanel", () => {
  it("shows only the compact persistent controls and current effects", () => {
    const markup = renderToStaticMarkup(
      <AdvertisingPanel
        highlighted
        view={{
          currentLevel: 1,
          currentDisplayName: "Local listings",
          hourlyCostLabel: "$4/hr",
          arrivalFrequencyLabel: "+9% arrival frequency",
          canDecrease: true,
          canIncrease: true,
        }}
        onDecrease={vi.fn()}
        onIncrease={vi.fn()}
      />,
    );

    expect(markup).toContain("Advertising");
    expect(markup).toContain("Level 1");
    expect(markup).toContain("$4/hr");
    expect(markup).toContain("+9% arrival frequency");
    expect(markup).toContain('aria-label="Decrease advertising"');
    expect(markup).toContain('aria-label="Increase advertising"');
    expect(markup).not.toContain("Patient demand");
    expect(markup).not.toContain("Levels");
    expect(markup).not.toContain("Normal arrival frequency");
    expect(markup).toContain("is-alert-highlighted");
    expect(markup).toContain("data-advertising-control");
    expect(markup).toContain(
      'data-advertising-adjust="decrease"',
    );
    expect(markup).toContain(
      'data-advertising-adjust="increase"',
    );
  });
});
