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
          automationCapacity: 0,
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
          automationCapacity: 0,
        }}
        onConsult={vi.fn()}
      />,
    );

    expect(markup.match(/42 minutes/g)).toHaveLength(1);
    expect(markup).not.toContain("min cooldown");
  });

  it("replaces the manual action with staffed automation status", () => {
    const markup = renderToStaticMarkup(
      <EmergencyGlp1Panel
        view={{
          visible: true,
          enabled: false,
          paymentLabel: "+$25",
          statusLabel: "Staffed GLP-1 suites handle consultations automatically.",
          cooldownProgressPercent: 0,
          automationCapacity: 2,
          nextPayoutLabel: "Next payout in 1 hour.",
        }}
        onConsult={vi.fn()}
      />,
    );

    expect(markup).toContain("2 staffed suites active");
    expect(markup).toContain("Next payout in 1 hour");
    expect(markup).not.toContain("Complete consult");
  });
});
