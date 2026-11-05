import { accountRequestsActive, subscribeAccountRequests } from "../session/requestBudget";

interface RefreshAuth { startAutoRefresh(): Promise<void>; stopAutoRefresh(): Promise<void> }
const owners = new WeakMap<RefreshAuth, { owner: symbol; desired: boolean; running: boolean | null; queue: Promise<void> }>();
/** The SDK's explicit start/stop API relinquishes its own visibility listener.
 * Serialize local timer changes so rapid account/visibility transitions cannot
 * leave an old owner's refresh timer running. Token validation stays unchanged. */
export function bindAuthRequestBudget(auth: RefreshAuth, accountId: string, doc: Pick<Document, "visibilityState" | "addEventListener" | "removeEventListener">): () => void {
  if (typeof auth.startAutoRefresh !== "function" || typeof auth.stopAutoRefresh !== "function") return () => {};
  const owner = Symbol(), state = owners.get(auth) ?? { owner, desired: false, running: null, queue: Promise.resolve() };
  state.owner = owner; owners.set(auth, state);
  const apply = () => {
    state.queue = state.queue.then(async () => {
      const desired = state.desired;
      if (state.running === desired) return;
      await (desired ? auth.startAutoRefresh() : auth.stopAutoRefresh()); state.running = desired;
    }).catch(() => { state.running = null; });
  };
  const update = () => {
    if (state.owner !== owner) return;
    state.desired = doc.visibilityState !== "hidden" && accountRequestsActive(accountId); apply();
  };
  const unsubscribe = subscribeAccountRequests(accountId, update);
  doc.addEventListener("visibilitychange", update); update();
  return () => {
    unsubscribe(); doc.removeEventListener("visibilitychange", update);
    if (state.owner === owner) { state.desired = false; apply(); }
  };
}
