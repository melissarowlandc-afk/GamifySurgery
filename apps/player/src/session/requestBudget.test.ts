import { afterEach, expect, it, vi } from "vitest";
import { accountRequestsActive, canPollAccount, healthyLeaseRenewMs, MAX_HEALTHY_LEASE_MS, RequestBackoff, setAccountRequestsActive } from "./requestBudget";

afterEach(() => { vi.unstubAllGlobals(); setAccountRequestsActive("budget.account", true); });
it("backs off exponentially with bounded jitter, respects server Retry-After and resets only on success", () => {
  let now = 0; const budget = new RequestBackoff(1_000, 8_000, () => now, () => .5);
  for (const ceiling of [1_000, 2_000, 4_000, 8_000, 8_000]) {
    expect(budget.ready()).toBe(true);
    const delay = budget.fail(); expect(delay).toBe(ceiling * .9); expect(budget.ready()).toBe(false);
    now += delay;
  }
  expect(budget.fail(60_000)).toBe(60_000); now += 60_000;
  budget.success(15_000); expect(budget.ready()).toBe(false); now += 15_000;
  expect(budget.fail()).toBe(900);
});
it("never grants authority from cadence and never polls hidden/closed accounts", () => {
  expect(healthyLeaseRenewMs(60_000)).toBe(15_000);
  expect(healthyLeaseRenewMs(MAX_HEALTHY_LEASE_MS)).toBe(300_000);
  expect(accountRequestsActive("budget.account")).toBe(true);
  vi.stubGlobal("document", { visibilityState: "hidden" }); expect(canPollAccount("budget.account")).toBe(false);
  vi.stubGlobal("document", { visibilityState: "visible" }); expect(canPollAccount("budget.account")).toBe(true);
  setAccountRequestsActive("budget.account", false); expect(canPollAccount("budget.account")).toBe(false);
});
