import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useAuthAccountActions, useAuthAccountId } from "../../auth/AuthAccountContext";
import { accountStorageKey } from "../accountStorageKey";
import { clearArchivedReviewFlags, readArchivedReviewFlags } from "../storagePressure";
import { hostedAuthConfiguration } from "../../auth/prototypeAuth";
import { getSupabaseAuthClient } from "../../auth/supabaseAuth";
import { ClinicalContentNotice } from "../../ui/ClinicalContentNotice";
import type { CloudCache } from "./cache";
import { IndexedDbCloudCache } from "./cache";
import { cloudCheckDeadline } from "./checkDeadline";
import type { CloudEntryStore } from "./entryStorage";
import { IndexedDbCloudEntryStore } from "./entryStorage";
import type { CloudGameSession } from "./gameSession";
import { SupabaseCloudTransport } from "./supabaseTransport";
import { CloudSyncError, type CloudCapabilities, type CloudCampaignSummary, type CloudTransport } from "./transport";

export const CLOUD_NOTICE_VERSION = "beta2.cloud.v1";
export interface CloudAccountRuntime {
  backendId: string;
  accountId: string;
  region: string;
  transport: CloudTransport;
  cache: CloudCache;
  entryStore: CloudEntryStore;
}
export interface CloudAccountValue {
  runtime: CloudAccountRuntime;
  access: CloudCapabilities | null;
  summaries: readonly CloudCampaignSummary[];
  phase: "checking" | "available" | "error" | "deletion-requested" | "deleted";
  error: string | null;
  active: CloudGameSession | null;
  refresh(): Promise<void>;
  acceptNotice(): Promise<void>;
  attach(session: CloudGameSession | null): void;
  stop(reason?: "sign-out" | "deleted"): Promise<void>;
  requestDeletion(): Promise<void>;
  exportDeviceRecovery(): Promise<string>;
  clearDevice(recoveryExported: boolean): Promise<void>;
  showCampaigns(): void;
  setCampaignNavigation(callback: (() => void) | null): void;
  registerLocalWriter?(callback: ((mode: "clear" | "export") => string | void) | null): void;
}
export const CloudAccountContext = createContext<CloudAccountValue | null>(null);
export const useCloudAccount = () => useContext(CloudAccountContext);

/** No client, IDB, timer or RPC is created for the owner prototype or an OFF build. */
export function configuredCloudRuntime(accountId: string | null): CloudAccountRuntime | null {
  if (!accountId || import.meta.env.VITE_CLOUD_SAVES_ENABLED !== "true") return null;
  const configuration = hostedAuthConfiguration(); if (!configuration) return null;
  const client = getSupabaseAuthClient(configuration); if (!client) return null;
  const scope = { backendId: configuration.supabaseUrl, accountId };
  return { ...scope, region: import.meta.env.VITE_CLOUD_SAVES_REGION?.trim() ?? "",
    transport: new SupabaseCloudTransport(client, accountId, async () => {
      const { data, error } = await client.auth.getSession(); return error ? null : data.session?.user.id ?? null;
    }), cache: new IndexedDbCloudCache(), entryStore: new IndexedDbCloudEntryStore(scope) };
}

export function downloadCloudRecovery(bytes: string, filename = "clinic-device-recovery.json"): void {
  const blob = new Blob([bytes], { type: "application/json" }), url = URL.createObjectURL(blob);
  try { const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; anchor.click(); }
  finally { setTimeout(() => URL.revokeObjectURL(url), 1_000); }
}

export function CloudAccountProvider({ children, runtime: injected }: { children: ReactNode; runtime?: CloudAccountRuntime | null }) {
  const accountId = useAuthAccountId();
  const runtime = useMemo(() => injected === undefined ? configuredCloudRuntime(accountId) : injected, [accountId, injected]);
  if (!runtime || runtime.accountId !== accountId) return <CloudAccountContext.Provider value={null}>{children}</CloudAccountContext.Provider>;
  return <BoundCloudAccount key={`${runtime.backendId}:${runtime.accountId}`} runtime={runtime}>{children}</BoundCloudAccount>;
}
function BoundCloudAccount({ runtime, children }: { runtime: CloudAccountRuntime; children: ReactNode }) {
  const account = useAuthAccountActions();
  const [entry, setEntry] = useState<"checking" | "local" | "cloud">("checking");
  const [access, setAccess] = useState<CloudCapabilities | null>(null);
  const [summaries, setSummaries] = useState<readonly CloudCampaignSummary[]>([]);
  const [phase, setPhase] = useState<CloudAccountValue["phase"]>("checking");
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<CloudGameSession | null>(null);
  const activeRef = useRef<CloudGameSession | null>(null), navigation = useRef<(() => void) | null>(null);
  const localWriter = useRef<((mode: "clear" | "export") => string | void) | null>(null);
  const generation = useRef(0), live = useRef(true), deletion = useRef(false);
  const stopped = useRef(false);
  const initialAccess = useRef<{ runtime: CloudAccountRuntime; request: Promise<CloudCapabilities> } | null>(null);
  const scopedRuntime = useMemo(() => {
    const guard = <T extends object>(target: T, shouldGuard: (name: string) => boolean): T => new Proxy(target, {
      get(value, name) {
        const method = Reflect.get(value, name);
        if (typeof method !== "function") return method;
        return async (...args: unknown[]) => {
          const guarded = shouldGuard(String(name));
          if (guarded && stopped.current) throw new CloudSyncError("auth");
          const result = await method.apply(value, args);
          if (guarded && stopped.current) throw new CloudSyncError("auth");
          return result;
        };
      },
    });
    return { ...runtime, transport: guard(runtime.transport, () => true),
      cache: guard(runtime.cache, name => name === "write"), entryStore: guard(runtime.entryStore, name => ["write", "create", "compareAndSet"].includes(name)) };
  }, [runtime]);
  const refresh = async (accessRequest?: Promise<CloudCapabilities>) => {
    const epoch = ++generation.current; setPhase("checking"); setError(null);
    let cancelled = false;
    const current = () => !cancelled && live.current && epoch === generation.current;
    try {
      await cloudCheckDeadline((async () => {
        if (deletion.current) { setPhase("deletion-requested"); return; }
        // Do not mount either session until the initial cohort check settles:
        // even the Beta 1 opening screen can initialize a local profile.
        const next = await (accessRequest ?? runtime.transport.capabilities());
        if (!current()) return;
        if (next.accountId !== runtime.accountId || !next.admitted || next.deletionRequested) throw new CloudSyncError("auth");
        setAccess(next);
        // Once admitted to cloud, retain its recovery UI if access is later
        // disabled. A maintenance check must never switch to a local session.
        setEntry(current => current === "checking" ? next.enabled ? "cloud" : "local" : current);
        if (!next.enabled) { setPhase("available"); return; }
        if (await runtime.entryStore.read("deletion-requested")) {
          if (current()) { deletion.current = true; setPhase("deletion-requested"); } return;
        }
        if (!current()) return;
        const list = next.noticeAccepted ? await runtime.transport.list() : [];
        if (!current()) return;
        setSummaries(list); setPhase("available");
      })(), undefined, () => { cancelled = true; });
    } catch (failure) {
      if (!live.current || epoch !== generation.current) return;
      let retainedCloudCampaign = false;
      if (entry === "checking") {
        try { retainedCloudCampaign = Boolean((await cloudCheckDeadline(Promise.resolve(runtime.cache.accountEntries?.(runtime)), 1_500))?.length); }
        catch { retainedCloudCampaign = true; /* Unreadable recovery must not select an older local campaign. */ }
      }
      if (!live.current || epoch !== generation.current) return;
      // A cold admission outage must not reopen the stale Beta 1 profile when
      // this account already has cloud recovery. This grants no offline play.
      setEntry(current => current === "checking" ? retainedCloudCampaign ? "cloud" : "local" : current);
      setError(failure instanceof CloudSyncError ? failure.code : "network"); setPhase("error");
    }
  };
  useEffect(() => {
    live.current = true; stopped.current = false;
    // StrictMode effect replay shares the initial request, including a failure;
    // disabled accounts never acquire a retry loop, timer or focus listener.
    if (initialAccess.current?.runtime !== runtime) initialAccess.current = {
      runtime, request: Promise.resolve().then(() => runtime.transport.capabilities()),
    };
    void refresh(initialAccess.current.request);
    return () => { live.current = false; stopped.current = true; generation.current++; activeRef.current?.coordinator.pause(); };
  }, [runtime]);
  useEffect(() => {
    if (entry !== "cloud") return;
    const online = () => { if (!stopped.current && !deletion.current) void refresh(); };
    window.addEventListener("online", online);
    return () => window.removeEventListener("online", online);
  }, [runtime, entry]);
  useEffect(() => {
    const guard = account?.signOutGuard; if (!guard || entry !== "cloud") return;
    const prepare = async () => {
      if (activeRef.current && !await activeRef.current.durable()) throw new CloudSyncError("storage");
      stopped.current = true;
      activeRef.current?.coordinator.dispose("sign-out"); generation.current++;
    };
    guard.current = prepare; return () => { if (guard.current === prepare) guard.current = null; };
  }, [account?.signOutGuard, entry]);
  const value: CloudAccountValue = {
    runtime: scopedRuntime, access, summaries, phase, error, active, refresh: () => refresh(),
    async acceptNotice() {
      if (!runtime.region || !runtime.transport.acceptNotice) throw new CloudSyncError("disabled");
      await runtime.transport.acceptNotice(CLOUD_NOTICE_VERSION); if (live.current) await refresh();
    },
    attach(session) { activeRef.current = session; setActive(session); },
    async stop(reason = "sign-out") {
      const session = activeRef.current;
      if (session && !await session.durable()) throw new CloudSyncError("storage");
      stopped.current = true;
      session?.coordinator.dispose(reason); generation.current++;
    },
    async requestDeletion() {
      deletion.current = true; generation.current++;
      stopped.current = true;
      activeRef.current?.coordinator.dispose("deleted");
      setPhase("deletion-requested");
      const archiveCleanup = clearArchivedReviewFlags(accountStorageKey("gamify-surgery.question-review-flags.v1", runtime.accountId))
        .then(() => null, failure => failure);
      try { await runtime.entryStore.write("deletion-requested", { version: CLOUD_NOTICE_VERSION }); } catch { /* A full browser must not prevent hosted deletion. */ }
      if (!runtime.transport.deleteMyData) throw new CloudSyncError("disabled");
      await runtime.transport.deleteMyData();
      const archiveFailure = await archiveCleanup;
      if (archiveFailure) throw archiveFailure;
      if (live.current) { setPhase("deleted"); setSummaries([]); }
    },
    async exportDeviceRecovery() {
      let storageReadComplete = true;
      if (activeRef.current) await activeRef.current.durable();
      const accountLocal: { key: string; text: string | null }[] = [];
      const suffix = `.account.${encodeURIComponent(runtime.accountId)}`;
      try { const storage = window.localStorage;
        for (let index = 0; index < storage.length; index++) { const key = storage.key(index); if (key?.startsWith("gamify-surgery.") && key.endsWith(suffix) && !key.includes("auth")) accountLocal.push({ key, text: storage.getItem(key) }); }
      } catch { storageReadComplete = false; }
      let campaigns: unknown[] = [], entry: unknown[] = [];
      try { campaigns = await runtime.cache.accountEntries?.(runtime) ?? []; } catch { storageReadComplete = false; }
      try { entry = await runtime.entryStore.entries(); } catch { storageReadComplete = false; }
      return JSON.stringify({ version: 1, backendId: runtime.backendId, accountId: runtime.accountId, accountLocal, storageReadComplete,
        archivedQuestionFlags: await readArchivedReviewFlags(accountStorageKey("gamify-surgery.question-review-flags.v1", runtime.accountId)),
        localSessionProfile: localWriter.current?.("export") ?? null,
        campaigns, entry,
        activeRecovery: activeRef.current?.exportRecovery() ?? null });
    },
    async clearDevice(recoveryExported) {
      if (!runtime.cache.clearAccount || !runtime.cache.accountEntries) throw new CloudSyncError("storage");
      const entries = await runtime.cache.accountEntries(runtime), imports = await runtime.entryStore.entries();
      if (!recoveryExported && (entries.some(entry => entry.recovery) || imports.some(entry => entry.key.startsWith("conflict:") ||
        entry.key.startsWith("import:") && !(entry.value as { verified: boolean }).verified))) throw new CloudSyncError("storage");
      stopped.current = true;
      activeRef.current?.coordinator.dispose("sign-out");
      // A local account session may not have unmounted yet when auth resolves.
      // Fence its pagehide/unmount writer BEFORE removing any account keys.
      localWriter.current?.("clear");
      await runtime.cache.clearAccount(runtime); await runtime.entryStore.clear();
      await clearArchivedReviewFlags(accountStorageKey("gamify-surgery.question-review-flags.v1", runtime.accountId));
      // Only this account's keys, at this origin. Unowned/other-account bytes survive.
      const storage = window.localStorage, suffix = `.account.${encodeURIComponent(runtime.accountId)}`;
      const keys: string[] = [];
      for (let index = 0; index < storage.length; index++) { const key = storage.key(index); if (key?.startsWith("gamify-surgery.") && key.endsWith(suffix)) keys.push(key); }
      for (const key of keys) storage.removeItem(key);
    },
    showCampaigns() { navigation.current?.(); },
    setCampaignNavigation(callback) { navigation.current = callback; },
    registerLocalWriter(callback) { localWriter.current = callback; },
  };
  if (entry === "checking") return <main className="opening-screen auth-gate-screen">
    <section className="founder-creator auth-gate-card" role="status">
      <span className="opening-wordmark">Stitchin&apos; Time</span><h1>Checking your sign-in…</h1>
      <ClinicalContentNotice />
    </section>
  </main>;
  return <CloudAccountContext.Provider value={entry === "cloud" ? value : null}>{children}</CloudAccountContext.Provider>;
}
