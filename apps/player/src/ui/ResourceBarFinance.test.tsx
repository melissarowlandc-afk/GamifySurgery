import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ResourceBar } from "./ResourceBar";
import type { ResourceBarView } from "./types";

const base: ResourceBarView = {
  moneyLabel: "$600", moneyDeltaLabel: "+$90/hr", moneyHourlyDeltaLabel: "+$90/hr",
  xpLabel: "0", satisfactionLabel: "95%", facilityTimeLabel: "Day 1 2:00 PM",
  workloadLabel: "0/3", workloadStatusLabel: "Capacity available", facilityLevelLabel: "Level 1",
  moneyHourlyBreakdown: { incomeLabel: "$100/hr", costLabel: "$10/hr", windowLabel: "Last 6 game hours", explanation: "Actual receipts. Current obligations and average stock." },
};

describe("HUD hourly finances", () => {
  it.each(["positive", "negative", "neutral"] as const)("has a signed %s rate and accessible income/cost expansion", (sign) => {
    const net = sign === "positive" ? "+$90/hr" : sign === "negative" ? "−$10/hr" : "$0/hr";
    const markup = renderToStaticMarkup(<ResourceBar view={{ ...base, moneyHourlyDeltaLabel: net, moneyHourlyNetSign: sign }} paused onTogglePause={() => {}} />);
    expect(markup).toContain(`<details class="resource-money-details">`);
    expect(markup).toContain(`class="finance-net is-${sign}"`);
    expect(markup).toContain(`(${net})`);
    expect(markup).toContain("Show income and costs per game hour.");
    expect(markup).toContain("Average income");
    expect(markup).toContain("$100/hr");
    expect(markup).toContain("$10/hr");
    expect(markup).toContain("Last 6 game hours");
    expect(markup).toContain("title=\"Net ");
  });
});
