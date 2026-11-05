import { RequestBackoff } from "../requestBudget";

// Recovery may replace the coordinator with another verified offline session.
// Keep its retry schedule with the runtime/store, rather than restarting every
// 15 seconds after each successful LOCAL restore. Nothing is persisted.
const budgets = new WeakMap<object, Map<string, RequestBackoff>>();
export function networkRequestBudget(owner: object, scope: string, now: () => number): RequestBackoff {
  let entries = budgets.get(owner);
  if (!entries) { entries = new Map(); budgets.set(owner, entries); }
  let budget = entries.get(scope);
  if (!budget) { budget = new RequestBackoff(15_000, 5 * 60_000, now); entries.set(scope, budget); }
  return budget;
}
