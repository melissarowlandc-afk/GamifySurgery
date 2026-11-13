import { problemDiagnostics } from "../diagnostics/problemDiagnostics";
import { bindVisibleInterval } from "../mobile/performance/visibleInterval";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuthAccountId } from "../auth/AuthAccountContext";
import { hostedAuthConfiguration } from "../auth/prototypeAuth";
import { getSupabaseAuthClient } from "../auth/supabaseAuth";
import { useUsageTracking } from "../playtime/UsageProvider";
import { createFlagTransport, QuestionFlagQueue, type FlagStorage } from "./hostedQuestionFlags";
import { canPollAccount } from "./requestBudget";

const FlagContext = createContext<QuestionFlagQueue | null>(null);
export const useQuestionFlags = () => useContext(FlagContext);

export function QuestionFlagProvider({ children }: { children: ReactNode }) {
  const accountId = useAuthAccountId();
  const usage = useUsageTracking();
  const [queue, setQueue] = useState<QuestionFlagQueue | null>(null);
  useEffect(() => {
    const configuration = hostedAuthConfiguration();
    if (!accountId || !configuration || !usage) return;
    const client = getSupabaseAuthClient(configuration);
    if (!client) return;
    let storage: FlagStorage | null = null;
    try { storage = window.localStorage; } catch { /* Send from memory if possible. */ }
    const current = new QuestionFlagQueue(accountId, storage, createFlagTransport(client, accountId), () => usage.canRecordQuestions());
    const unbindDiagnostics = problemDiagnostics.source("flags", () => ({ pending: current.list().filter(row => row.delivery === "pending").length,
      unavailable: current.unavailable, storageAvailable: current.storageAvailable, dropped: current.dropped }));
    setQueue(current);
    const sync = () => {
      if (["deleted", "blocked"].includes(usage.status().state)) current.clear();
      else if (usage.canRecordQuestions() && canPollAccount(accountId)) void current.flush(true);
    };
    const retry = () => { if (!canPollAccount(accountId)) return; sync(); void current.refreshStatuses(true); };
    const unsubscribe = usage.subscribe(sync);
    const stopTimer = bindVisibleInterval(window, document, retry, 60_000);
    window.addEventListener("online", retry);
    document.addEventListener("visibilitychange", retry);
    retry();
    return () => { unbindDiagnostics(); unsubscribe(); stopTimer(); window.removeEventListener("online", retry); document.removeEventListener("visibilitychange", retry); current.stop(); };
  }, [accountId, usage]);
  return <FlagContext.Provider value={queue}>{children}</FlagContext.Provider>;
}
