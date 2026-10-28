import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import type { GameState } from "@gamify-surgery/game-domain";
import { useAuthAccountId } from "../auth/AuthAccountContext";
import { hostedAuthConfiguration } from "../auth/prototypeAuth";
import { getSupabaseAuthClient } from "../auth/supabaseAuth";
import { accountStorageKey } from "../session/accountStorageKey";
import { useUsageTracking, useCasualMode } from "../playtime/UsageProvider";
import { USAGE_OUTBOX_KEY } from "../playtime/usageOutbox";
import { CompetitionClient, COMPETITION_STORAGE_KEY, type CompetitionStorage, type CompetitionRankChange } from "./competitionClient";
import { competitionDayMinutes } from "./revenue";
import { createSupabaseCompetitionTransport } from "./supabaseCompetition";

/** Optional injection for offline tests/previews. Production never uses a fake transport. */
export const CompetitionClientContext = createContext<CompetitionClient | null | undefined>(undefined);
let current: { key: string; client: CompetitionClient } | null = null;

export function useCompetitionClient(): CompetitionClient | null {
  const injected = useContext(CompetitionClientContext);
  const accountId = useAuthAccountId();
  const usage = useUsageTracking();
  const client = useMemo(() => {
    if (injected !== undefined) return injected;
    // A prototype creates no Supabase client, queue, storage, timer or request.
    const config = hostedAuthConfiguration();
    if (!accountId || !config || typeof window === "undefined") return null;
    const key = accountStorageKey(`${COMPETITION_STORAGE_KEY}.${encodeURIComponent(config.supabaseUrl)}`, accountId);
    let storage: CompetitionStorage | null = null, deletionRequested = false;
    try {
      storage = window.localStorage;
      // UsageProvider initializes its tracker in a parent effect. Check the
      // persisted stop marker before a child's first submission effect, too.
      deletionRequested = storage.getItem(`${accountStorageKey(USAGE_OUTBOX_KEY, accountId)}.deletion-requested`) === "true";
    } catch { /* Bounded memory fallback; server admission remains authoritative. */ }
    if (current?.key === key) {
      if (deletionRequested) current.client.clear();
      return current.client;
    }
    const supabase = getSupabaseAuthClient(config);
    if (!supabase) return null;
    const created = new CompetitionClient(createSupabaseCompetitionTransport(supabase, accountId), storage, key);
    if (deletionRequested) created.clear();
    current = { key, client: created };
    return created;
  }, [accountId, injected]);
  useEffect(() => {
    const stopDeleted = () => {
      if (usage?.outbox.deletionRequested() || usage?.status().state === "deleted" || usage?.status().state === "blocked") client?.clear();
    };
    stopDeleted();
    return usage?.subscribe(stopDeleted);
  }, [client, usage]);
  return client;
}

/** Fire-and-forget after a completed GAME day, in both local-save and cloud-save sessions. */
export function useCompetitionSubmission(state: GameState, clinicName: string, onRankChange?: (change: CompetitionRankChange) => void): void {
  const client = useCompetitionClient();
  const casualMode = useCasualMode();
  const completedDay = Math.floor(state.facilityTick / competitionDayMinutes());
  const latest = useRef({ campaignId: state.campaignId, casualMode, onRankChange });
  latest.current = { campaignId: state.campaignId, casualMode, onRankChange };
  const live = useRef(false);
  useEffect(() => { live.current = true; return () => { live.current = false; }; }, []);
  const refresh = useRef(async () => {});
  refresh.current = async () => {
    if (!client) return;
    try {
      await client.flush();
      if (!live.current || latest.current.campaignId !== state.campaignId || !latest.current.onRankChange || latest.current.casualMode !== false) return;
      const change = await client.rankChange(state.campaignId, completedDay, latest.current.casualMode);
      if (change && live.current && latest.current.campaignId === change.campaignId && latest.current.casualMode === false) latest.current.onRankChange?.(change);
    } catch { /* Gameplay and its save path are independent of competition. */ }
  };
  useEffect(() => {
    if (!client) return;
    // This is aggregate observation, never a game command or a save prerequisite.
    try { client.observe(state, clinicName); void refresh.current(); } catch { /* Gameplay always continues. */ }
    // Income scans happen only on mount/new day; current-day receipts are excluded.
  }, [client, state.campaignId, completedDay, casualMode]);
  useEffect(() => {
    if (!client || typeof window === "undefined") return;
    const retry = () => { void refresh.current(); };
    window.addEventListener("online", retry);
    window.addEventListener("focus", retry);
    const timer = setInterval(retry, 60_000);
    return () => { window.removeEventListener("online", retry); window.removeEventListener("focus", retry); clearInterval(timer); };
  }, [client]);
}
