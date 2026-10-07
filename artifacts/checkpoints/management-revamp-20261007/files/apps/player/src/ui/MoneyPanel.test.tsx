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
    expect(markup).toContain("Last 1 payment<");
  });

  it("still shows service totals when finances are absent", () => {
    const markup = renderToStaticMarkup(<MoneyPanel serviceIncome={{ ...view, finances: undefined }} />);
    expect(markup).toContain("$120.00");
    expect(markup).not.toContain("Running costs now");
  });
});
