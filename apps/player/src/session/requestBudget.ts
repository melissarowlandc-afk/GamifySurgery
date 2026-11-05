/** Request policy only: never grants auth, writer authority or saved progress. */
export class RequestBackoff {
  private failures = 0;
  private until = -Infinity;
  constructor(private readonly baseMs = 15_000, private readonly capMs = 15 * 60_000,
    private readonly now = Date.now, private readonly random = Math.random) {}
  ready(): boolean { return this.now() >= this.until; }
  remaining(): number { return Math.max(0, this.until - this.now()); }
  fail(minimumMs = 0): number {
    const ceiling = Math.min(this.capMs, this.baseMs * 2 ** Math.min(this.failures++, 16));
    const delay = Math.max(minimumMs, Math.round(ceiling * (.8 + .2 * this.random())));
    this.until = this.now() + delay;
    return delay;
  }
  success(cooldownMs = 0): void { this.failures = 0; this.until = this.now() + cooldownMs; }
}

// In-memory account lifecycle only. No device identifier, storage or network.
const inactiveAccounts = new Set<string>();
const activityListeners = new Map<string, Set<() => void>>();
export function setAccountRequestsActive(accountId: string, active: boolean): void {
  if (active === !inactiveAccounts.has(accountId)) return;
  if (active) inactiveAccounts.delete(accountId); else inactiveAccounts.add(accountId);
  for (const listener of activityListeners.get(accountId) ?? []) { try { listener(); } catch { /* Independent request controllers. */ } }
}
export function subscribeAccountRequests(accountId: string, listener: () => void): () => void {
  const listeners = activityListeners.get(accountId) ?? new Set<() => void>();
  listeners.add(listener); activityListeners.set(accountId, listeners);
  return () => { listeners.delete(listener); if (!listeners.size) activityListeners.delete(accountId); };
}
export const accountRequestsActive = (accountId: string) => !inactiveAccounts.has(accountId);
export const requestDocumentVisible = () => typeof document === "undefined" || document.visibilityState !== "hidden";
export const canPollAccount = (accountId: string) => accountRequestsActive(accountId) && requestDocumentVisible();
export const FLAG_STATUS_REFRESH_MS = 15 * 60_000;
export const ACCOUNT_READ_REFRESH_MS = 5 * 60_000;
export const MAX_HEALTHY_LEASE_MS = 10 * 60_000;
/** Legacy endpoints retain their 60 s / 15 s contract. Long leases are opt-in
 * server grants; the client never invents or extends a lease deadline. */
export const healthyLeaseRenewMs = (grantedMs: number) => grantedMs > 60_000 ? Math.min(5 * 60_000, grantedMs / 2) : 15_000;
