import { expect, it, vi } from "vitest";
import { bindAuthRequestBudget } from "./authRequestBudget";
import { setAccountRequestsActive } from "../session/requestBudget";

it("stops SDK refresh timers while hidden/closed/signed out and serializes rapid visibility/account transitions", async () => {
  const target = new EventTarget(), doc = Object.assign(target, { visibilityState: "visible" as DocumentVisibilityState });
  const auth = { startAutoRefresh: vi.fn(async () => {}), stopAutoRefresh: vi.fn(async () => {}) };
  const settle = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
  const first = bindAuthRequestBudget(auth, "budget.auth", doc); await settle();
  expect(auth.startAutoRefresh).toHaveBeenCalledOnce();
  doc.visibilityState = "hidden"; doc.dispatchEvent(new Event("visibilitychange")); await settle();
  expect(auth.stopAutoRefresh).toHaveBeenCalledOnce();
  doc.visibilityState = "visible"; doc.dispatchEvent(new Event("visibilitychange")); await settle();
  expect(auth.startAutoRefresh).toHaveBeenCalledTimes(2);
  setAccountRequestsActive("budget.auth", false); await settle(); expect(auth.stopAutoRefresh).toHaveBeenCalledTimes(2);
  doc.dispatchEvent(new Event("visibilitychange")); await settle(); expect(auth.startAutoRefresh).toHaveBeenCalledTimes(2);
  setAccountRequestsActive("budget.auth", true); await settle(); expect(auth.startAutoRefresh).toHaveBeenCalledTimes(3);
  const second = bindAuthRequestBudget(auth, "budget.auth.next", doc);
  first(); await settle(); expect(auth.stopAutoRefresh).toHaveBeenCalledTimes(2);
  second(); await settle(); expect(auth.stopAutoRefresh).toHaveBeenCalledTimes(3);
  setAccountRequestsActive("budget.auth", true);
});
