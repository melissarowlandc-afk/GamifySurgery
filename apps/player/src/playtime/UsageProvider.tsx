import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuthAccountId } from "../auth/AuthAccountContext";
import { hostedAuthConfiguration } from "../auth/prototypeAuth";
import { getSupabaseAuthClient } from "../auth/supabaseAuth";
import { PlaytimeTracker } from "./playtimeTracker";
import { UsageOutbox, type UsageStorage } from "./usageOutbox";
import { createSupabaseUsageTransport } from "./supabaseUsage";
import { bindBrowserUsage } from "./browserUsage";

const UsageContext = createContext<PlaytimeTracker | null>(null);
export const useUsageTracking = () => useContext(UsageContext);

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
      createSupabaseUsageTransport(client, configuration, accountId), clock, () => crypto.randomUUID());
    setTracker(current);
    const unbind = bindBrowserUsage(current, accountId, window, document);
    void current.refreshAccess().then(() => current.flush());
    return () => { unbind(); current.stop(); };
  }, [accountId]);
  return <UsageContext.Provider value={tracker}>{children}</UsageContext.Provider>;
}

// Compatibility for existing local-path tests and imports.
export { UsageNotice as UsageNoticePlaceholder } from "../ui/AccountMenu";
