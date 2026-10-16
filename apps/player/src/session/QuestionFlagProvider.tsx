import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuthAccountId } from "../auth/AuthAccountContext";
import { hostedAuthConfiguration } from "../auth/prototypeAuth";
import { getSupabaseAuthClient } from "../auth/supabaseAuth";
import { useUsageTracking } from "../playtime/UsageProvider";
import { createFlagTransport, QuestionFlagQueue, type FlagStorage } from "./hostedQuestionFlags";

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
    setQueue(current);
    const sync = () => {
      if (["deleted", "blocked"].includes(usage.status().state)) current.clear();
      else if (usage.canRecordQuestions()) void current.flush();
    };
    const retry = () => { sync(); void current.refreshStatuses(); };
    const unsubscribe = usage.subscribe(sync);
    const timer = window.setInterval(retry, 60_000);
    window.addEventListener("online", retry);
    retry();
    return () => { unsubscribe(); window.clearInterval(timer); window.removeEventListener("online", retry); current.stop(); };
  }, [accountId, usage]);
  return <FlagContext.Provider value={queue}>{children}</FlagContext.Provider>;
}
