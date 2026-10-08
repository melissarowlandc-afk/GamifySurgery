import { describe, expect, it } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";
import { createManagementFinanceView } from "./managementViewModels";
import { employeeTrainingBenefitLabel } from "./employeeTrainingViewModels";

describe("reused number formatters", () => {
  it.each([0, -0, -12.125, 0.004, 0.005, 1234.567, 1_000_000.01])(
    "preserves cash and finance presentation for %s", (cash) => {
      const state = createInitialGameState();
      state.cash = cash;
      state.cashCents = Math.round(cash * 100);
      state.serviceIncomeReceipts.push({
        id: "formatting.receipt", incomeLineId: "income.endoscopy", routeId: null,
        transactionKey: "formatting.operation", catalogVersion: 1, actorKind: "remote", actorId: "formatting.actor",
        grossAmount: cash, stockCost: cash, netCashDelta: cash, completedAtFacilityTick: 0,
      });
      const view = createPrototypePlayerView(state, null, false, null);
      const expected = `$${cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      expect(view.serviceIncome.recentReceipts[0]?.grossLabel).toBe(expected);
      expect(view.serviceIncome.recentReceipts[0]?.stockCostLabel).toBe(expected);
      expect(view.serviceIncome.recentReceipts[0]?.netLabel).toBe(expected);
      const cents = state.cashCents;
      const finance = createManagementFinanceView(state, { grossCents: cents, stockCostCents: 0, netCashDeltaCents: cents }, (id) => id);
      expect(finance.earnedLabel).toBe(`$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 2 })}`);
    },
  );

  it.each([0.05, 10, 10.125, 22.5, 40])("preserves fractional training benefit copy for %s percent", (percent) => {
    expect(employeeTrainingBenefitLabel("staff.radiologist", percent)).toBe(`Reduces reading time ${percent.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`);
    const amount = 125 * percent / 100;
    expect(employeeTrainingBenefitLabel("staff.glp1_np", percent, 125)).toBe(`Adds $${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })} per consult`);
  });
});
