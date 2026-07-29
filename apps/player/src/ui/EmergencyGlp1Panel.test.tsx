import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { EmergencyGlp1Panel } from "./EmergencyGlp1Panel";

describe("EmergencyGlp1Panel", () => {
  it("describes the hourly cooldown without a daily usage cap", () => {
    const markup = renderToStaticMarkup(
      <EmergencyGlp1Panel
        view={{
          visible: true,
          enabled: true,
          paymentLabel: "+$25",
          statusLabel: "Ready now; one consult per facility hour.",
          cooldownLabel: "Hourly consult ready",
          cooldownProgressPercent: 100,
        }}
        onConsult={vi.fn()}
      />,
    );

    expect(markup).toContain("Complete consult (+$25)");
    expect(markup).toContain("one consult per facility hour");
    expect(markup).toContain("Hourly consult ready");
    expect(markup).not.toContain("Today:");
  });
});
