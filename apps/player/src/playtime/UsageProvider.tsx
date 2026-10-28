import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { useAuthAccountId } from "../auth/AuthAccountContext";
import { hostedAuthConfiguration } from "../auth/prototypeAuth";
import { getSupabaseAuthClient } from "../auth/supabaseAuth";
import { accountStorageKey } from "../session/accountStorageKey";
import { PlaytimeTracker, type CasualModeMemory } from "./playtimeTracker";
import { UsageOutbox, type UsageStorage } from "./usageOutbox";
import { createSupabaseUsageTransport } from "./supabaseUsage";
import { bindBrowserUsage } from "./browserUsage";

const UsageContext = createContext<PlaytimeTracker | null>(null);
export const useUsageTracking = () => useContext(UsageContext);
const noSubscription = () => () => {};
const pendingMode = () => null;
export const CASUAL_MODE_STORAGE_KEY = "gamify-surgery.casual-mode.v1";

function casualModeMemory(accountId: string, storage: UsageStorage | null): CasualModeMemory {
  const key = accountStorageKey(CASUAL_MODE_STORAGE_KEY, accountId);
  let initial: boolean | null = null;
  try {
    const saved = storage?.getItem(key);
    initial = saved === "true" ? true : saved === "false" ? false : null;
  } catch { /* An unavailable cache leaves the first access check pending. */ }
  return { initial, remember(mode) {
    try {
      if (mode === null) storage?.removeItem(key);
      else storage?.setItem(key, String(mode));
    } catch { /* Presentation can still use the current server response. */ }
  } };
}

/** Account access is the only source of casual mode. Prototypes are standard. */
export function useCasualMode(): boolean | null {
  const tracker = useUsageTracking();
  const accountId = useAuthAccountId();
  const mode = useSyncExternalStore(tracker?.subscribe ?? noSubscription, tracker?.casualMode ?? pendingMode, pendingMode);
  return accountId && hostedAuthConfiguration() ? mode : false;
}

/** Mounted above campaign entry and desktop/phone shell selection. */
export function UsageProvider({ children }: { children: ReactNode }) {
  const accountId = useAuthAccountId();
  const [tracker, setTracker] = useState<PlaytimeTracker | null>(null);
  useEffect(() => {
    // The local prototype allocates no queue/timer and makes no usage requests.
    const configuration = hostedAuthConfiguration();
    if (!accountId || !configuration) return;
    const client = getSupabaseAuthClient(configuration);
    if (!client) return;
    let storage: UsageStorage | null = null;
    try { storage = window.localStorage; } catch { /* Estimates may lose an unreported tail. */ }
    const clock = { monotonic: () => performance.now(), wall: () => Date.now() };
    const current = new PlaytimeTracker(new UsageOutbox(accountId, storage, clock.wall),
      createSupabaseUsageTransport(client, configuration, accountId), clock, () => crypto.randomUUID(),
      casualModeMemory(accountId, storage));
    setTracker(current);
    const unbind = bindBrowserUsage(current, accountId, window, document);
    const { data: { subscription } } = client.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") { current.stop(); current.clearRememberedMode(); }
    });
    void current.refreshAccess().then(() => current.flush());
    return () => { subscription.unsubscribe(); unbind(); current.stop(); };
  }, [accountId]);
  return <UsageContext.Provider value={tracker}>{children}</UsageContext.Provider>;
}

// Compatibility for existing local-path tests and imports.
export { UsageNotice as UsageNoticePlaceholder } from "../ui/AccountMenu";
