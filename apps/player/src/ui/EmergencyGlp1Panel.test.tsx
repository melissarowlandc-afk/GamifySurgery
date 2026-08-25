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
          cooldownProgressPercent: 100,
        }}
        onConsult={vi.fn()}
      />,
    );

    expect(markup).toContain("Complete consult (+$25)");
    expect(markup).toContain("one consult per facility hour");
    expect(markup).not.toContain("min cooldown");
    expect(markup).not.toContain("Today:");
  });

  it("shows cooldown timing only once", () => {
    const markup = renderToStaticMarkup(
      <EmergencyGlp1Panel
        view={{
          visible: true,
          enabled: false,
          paymentLabel: "+$25",
          statusLabel: "Available in 42 minutes.",
          cooldownProgressPercent: 30,
        }}
        onConsult={vi.fn()}
      />,
    );

    expect(markup.match(/42 minutes/g)).toHaveLength(1);
    expect(markup).not.toContain("min cooldown");
  });
});
