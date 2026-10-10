import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MoneyPanel } from "./MoneyPanel";
import type { ServiceIncomeView } from "./types";

const view: ServiceIncomeView = {
  appointmentsEnabled: true,
  catalogLines: [],
  activeOperations: [],
  recentReceipts: [{ id: "receipt.1", displayName: "Ultrasound", actorLabel: "Taylor", grossLabel: "$120.00", stockCostLabel: "$0.00", netLabel: "$120.00", timeLabel: "Day 4 11:52 AM" }],
  grossTotalLabel: "$120.00",
  stockCostTotalLabel: "$0.00",
  netTotalLabel: "$120.00",
  finances: {
    cashLabel: "$3,200",
    earnedLabel: "$9,668",
    billedLabel: "$9,880",
    stockLabel: "$212",
    runningCostsLabel: "$8,940",
    profitLabel: "+$728",
    profitPositive: true,
    hourlyIncomeLabel: "$250/hr",
    hourlyNetLabel: "+$36/hr",
    hourlyNetSign: "positive",
    incomeWindowLabel: "Last 6 game hours",
    incomeWindowExplanation: "Actual settled payments. Stock uses the same window; fixed obligations use current rates.",
    hourlyIncomeSources: [
      { id: "patient_encounters", label: "Patient encounters", amount: 120, amountLabel: "$120/hr", count: 3 },
      { id: "scheduled_services", label: "Scheduled services", amount: 130, amountLabel: "$130/hr", count: 1 },
    ],
    hourlyCostLabel: "$214/hr",
    hourlyCosts: [
      { id: "staff", label: "Staff salaries", amount: 156, amountLabel: "$156/hr" },
      { id: "rooms", label: "Room upkeep", amount: 48, amountLabel: "$48/hr" },
      { id: "advertising", label: "Advertising (Level 2)", amount: 10, amountLabel: "$10/hr" },
    ],
    runwayLabel: "Cash covers about 14 hours of running costs with no new income.",
    recentEarnings: [{ displayName: "Ultrasound", net: 120, netLabel: "$120", count: 1 }],
    recentEarningsReceiptCount: 1,
  },
};

describe("MoneyPanel", () => {
  it("answers earned minus running costs and shows the hourly split and runway", () => {
    const markup = renderToStaticMarkup(<MoneyPanel serviceIncome={view} />);
    expect(markup).toContain("Since the clinic opened");
    expect(markup).toContain("$9,668");
    expect(markup).toContain("−$8,940");
    expect(markup).toContain("+$728");
    expect(markup).toContain("Staff salaries");
    expect(markup).toContain("$214/hr");
    expect(markup).toContain("Cash covers about 14 hours");
    expect(markup).toContain("Day 4 11:52 AM");
    expect(markup).toContain("Last 6 game hours");
    expect(markup).toContain("Average income by source");
    expect(markup).toContain("Patient encounters");
    expect(markup).toContain("Scheduled services");
    expect(markup).toContain("(3 payments)");
    expect(markup).toContain("+$36/hr");
    expect(markup).toContain('class="finance-net is-positive"');
    expect(markup).toContain("Costs per game hour");
    expect(markup).toContain("Actual settled payments");
  });

  it("still shows service totals when finances are absent", () => {
    const markup = renderToStaticMarkup(<MoneyPanel serviceIncome={{ ...view, finances: undefined }} />);
    expect(markup).toContain("$120.00");
    expect(markup).not.toContain("Costs per game hour");
  });

  it.each(["negative", "neutral"] as const)("renders an hourly %s independently of since-opening profit", (sign) => {
    const markup = renderToStaticMarkup(<MoneyPanel serviceIncome={{ ...view, finances: { ...view.finances!, hourlyNetSign: sign, hourlyNetLabel: sign === "negative" ? "−$10/hr" : "$0/hr" } }} />);
    expect(markup).toContain(`class="finance-net is-${sign}"`);
    expect(markup).toContain("+$728");
  });
});
