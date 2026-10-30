import { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { PROTOTYPE_DOMAIN_CONTEXT, type GameCommand, type GameState } from "@gamify-surgery/game-domain";
import { AccountCampaignRouter } from "../App";
import { AuthAccountActionsContext, AuthAccountContext } from "../auth/AuthAccountContext";
import { createQaDeviceCampaign, seedQaDeviceCampaigns } from "./cloudSavesQaSeed";
import { CloudAccountProvider, useCloudAccount, type CloudAccountRuntime, type CloudOpeningDiagnostic } from "../session/cloud/CloudAccount";
import { IndexedDbCloudCache } from "../session/cloud/cache";
import { IndexedDbCloudEntryStore } from "../session/cloud/entryStorage";
import { CloudSyncError, type CloudFailureCode, type CloudTransport } from "../session/cloud/transport";
import { sha256Utf8 } from "../session/cloud/codecJson";
import { cloudCampaignStorageKey } from "../session/accountStorageKey";
import type { ProtectedClinicCopy } from "../session/cloud/retainedCopies";
import { problemDiagnostics } from "../diagnostics/problemDiagnostics";
import "@fontsource/atkinson-hyperlegible/latin-400.css";
import "@fontsource/atkinson-hyperlegible/latin-700.css";
import "../styles/tokens.css";
import "../styles/global.css";

interface CloudQaStatus {
  hasState: boolean;
  revision: string | null;
  phase: string;
  pending: boolean;
  canExecute: boolean;
  localDurable: boolean;
  needsReload: boolean;
  failure: string | null;
  accountPhase: string;
  entryHeading: string | null;
  openingFailure: CloudOpeningDiagnostic | null;
  entryPreparation: Record<string, unknown> | null;
  codecHealth: Record<string, unknown> | null;
}
declare global {
  interface Window {
    __cloudQaAuthenticate?: (accountId: string | null) => Promise<void>;
    __cloudQaCall?: (accountId: string, method: string, args: unknown[]) => Promise<{ value?: unknown; error?: { code: CloudFailureCode } }>;
    __cloudQa?: {
      status(): CloudQaStatus;
      snapshot(): { state: GameState | null; revision: string | null; phase: string; pending: boolean; canExecute: boolean; failure: string | null };
      command(input: Omit<GameCommand, "operationId"> & Record<string, unknown>): Promise<boolean>;
      commands(inputs: readonly (Omit<GameCommand, "operationId"> & Record<string, unknown>)[]): Promise<GameState | null>;
      checkpoint(): Promise<boolean>;
      focus(): Promise<boolean>;
      foreground(): Promise<boolean>;
      checkAuthority(): Promise<boolean>;
      closeLease(): Promise<boolean>;
      retainedCopies(): Promise<{ key: string; value: ProtectedClinicCopy }[]>;
      retainAndReopenOlderCache(): Promise<void>;
      undo(target: GameState): Promise<boolean>;
    };
  }
}
const QA_ACCOUNTS = ["qa-account-a", "qa-account-b"] as const;

/** A dev-only bridge to the test runner's FakeCloudServer. It has no Supabase route. */
export function QaApp() {
  const [accountId, setAccountId] = useState<string | null>(QA_ACCOUNTS.includes(new URLSearchParams(location.search).get("account") as typeof QA_ACCOUNTS[number]) ? new URLSearchParams(location.search).get("account") : QA_ACCOUNTS[0]);
  const [authenticated, setAuthenticated] = useState(false), [entryKey, setEntryKey] = useState(0);
  const currentAccount = useRef(accountId), signOutGuard = useRef<(() => Promise<void>) | null>(null);
  const openingFailure = useRef<CloudOpeningDiagnostic | null>(null);
  currentAccount.current = accountId;
  useEffect(() => {
    let live = true;
    // Explicit synthetic fixtures represent campaigns already on this device
    // before sign-in. Fresh contexts do not read or create a local profile.
    if (accountId) seedQaDeviceCampaigns(accountId, new URLSearchParams(location.search).get("device-campaigns"));
    void window.__cloudQaAuthenticate!(accountId).then(() => {
      if (live) setAuthenticated(true);
    });
    return () => { live = false; };
  }, []);
  const runtime = useMemo<CloudAccountRuntime | null>(() => {
    openingFailure.current = null;
    if (!accountId) return null;
    const call = async (method: string, args: unknown[]) => {
      if (currentAccount.current !== accountId) throw new CloudSyncError("auth");
      if (!navigator.onLine) throw new CloudSyncError("network");
      const response = await window.__cloudQaCall!(accountId, method, args);
      if (currentAccount.current !== accountId) throw new CloudSyncError("auth");
      if (response.error) throw new CloudSyncError(response.error.code); return response.value;
    };
    const transport = Object.fromEntries(["capabilities", "list", "head", "load", "acquire", "renew", "release", "commit", "operation", "acceptNotice", "importCampaign", "deleteCampaign", "deleteMyData"]
      .map(method => [method, (...args: unknown[]) => call(method, args)])) as unknown as CloudTransport;
    const scope = { backendId: "disposable-fake-cloud-qa", accountId };
    return { ...scope, region: "Disposable QA backend — no hosted storage", transport, cache: new IndexedDbCloudCache(), entryStore: new IndexedDbCloudEntryStore(scope),
      onOpeningDiagnostic: value => { openingFailure.current = value; } };
  }, [accountId]);
  const authenticate = async (next: string | null) => {
    await signOutGuard.current?.(); await window.__cloudQaAuthenticate!(next);
    currentAccount.current = next; setAccountId(next); setEntryKey(value => value + 1); return true;
  };
  if (!authenticated) return <p role="status">Connecting disposable QA account…</p>;
  if (!accountId || !runtime) return <main><h1>Signed out of disposable QA</h1><button onClick={() => void authenticate(QA_ACCOUNTS[0])}>Sign in synthetic account A</button></main>;
  return <AuthAccountContext.Provider key={accountId} value={accountId}><AuthAccountActionsContext.Provider value={{ email: `${accountId}@example.invalid`, signOut: () => authenticate(null), signOutGuard, pending: false, message: null }}>
    <CloudAccountProvider runtime={runtime}>
      <QaTools openingFailure={() => openingFailure.current} onCreate={() => setEntryKey(value => value + 1)} onSwitch={() => void authenticate(accountId === QA_ACCOUNTS[0] ? QA_ACCOUNTS[1] : QA_ACCOUNTS[0])} />
      <AccountCampaignRouter key={entryKey} />
    </CloudAccountProvider>
  </AuthAccountActionsContext.Provider></AuthAccountContext.Provider>;
}
function QaTools({ onCreate, onSwitch, openingFailure }: { onCreate(): void; onSwitch(): void; openingFailure(): CloudOpeningDiagnostic | null }) {
  const cloud = useCloudAccount();
  useEffect(() => {
    if (!cloud) return;
    const active = cloud.active;
    const status = (): CloudQaStatus => {
      const view = active?.syncView;
      return { hasState: Boolean(active), revision: view?.revision ?? null, phase: view?.phase ?? cloud.phase,
        pending: view?.pending ?? false, canExecute: view?.canExecute ?? false, localDurable: view?.localDurable ?? false,
        needsReload: active?.needsReload ?? false, failure: view?.failure ?? cloud.error, accountPhase: cloud.phase,
        entryHeading: document.querySelector("main h1")?.textContent ?? null, openingFailure: openingFailure(),
        entryPreparation: problemDiagnostics.snapshot().health.entry ?? null, codecHealth: problemDiagnostics.snapshot().health.codec ?? null };
    };
    window.__cloudQa = {
      status,
      snapshot: () => ({ state: active?.state ?? null, revision: active?.coordinator.confirmedRevision ?? null,
        phase: active?.coordinator.view.phase ?? cloud.phase, pending: active?.syncView.pending ?? false,
        canExecute: active?.canExecute ?? false, failure: active?.coordinator.view.failure ?? cloud.error }),
      async command(input) {
        if (!active) return false;
        const result = active.execute({ ...input, operationId: crypto.randomUUID() } as GameCommand, PROTOTYPE_DOMAIN_CONTEXT);
        return Boolean(result) && await active.durable();
      },
      async commands(inputs) {
        if (!active) return null;
        // One fixture turn: no live interval/focus task can interleave between
        // its unpause, manual ticks and final pause. Check every command and
        // reject a replaced owner rather than returning its paused UI overlay.
        for (const input of inputs) if (!active.execute({ ...input, operationId: crypto.randomUUID() } as GameCommand, PROTOTYPE_DOMAIN_CONTEXT)) return null;
        return await active.durable() && active.canExecute ? active.state : null;
      },
      checkpoint: async () => Boolean(cloud.active) && await cloud.active!.checkpointNow("purchase"),
      focus: async () => Boolean(active) && await active!.reconnect(),
      foreground: async () => Boolean(active) && await active!.foreground(),
      // Authority observation does not request reopening/taking over. It models
      // the old writer learning that its token was fenced by another device.
      checkAuthority: async () => Boolean(active) && await active!.coordinator.focus(),
      closeLease: async () => Boolean(active) && await active!.durable() && await active!.coordinator.saveAndClose(),
      retainedCopies: async () => (await cloud.runtime.entryStore.entries()).filter(row => row.key.startsWith("older-copy:")) as { key: string; value: ProtectedClinicCopy }[],
      async retainAndReopenOlderCache() {
        if (!active || !await active.durable()) throw new CloudSyncError("storage");
        const entry = (await cloud.runtime.cache.read(active.coordinator.scope))!.entry, value = { scope: entry.scope, device: entry, account: entry.confirmed };
        const key = `conflict:${entry.scope.campaignId}:${await sha256Utf8(JSON.stringify(value))}`;
        await cloud.runtime.entryStore.create(key, value);
        if (JSON.stringify(await cloud.runtime.entryStore.read(key)) !== JSON.stringify(value)) throw new CloudSyncError("storage");
        active.coordinator.dispose();
        const current = await cloud.runtime.cache.read(entry.scope);
        await cloud.runtime.cache.write({ ...entry, recovery: null }, current!.cacheRevision);
        // This disposable fixture moves the latest bytes into verified retained
        // storage and deliberately restores an older current cache/journal.
        await cloud.runtime.cache.journal?.clear(cloudCampaignStorageKey(entry.scope));
        onCreate();
      },
      async undo(target) { return Boolean(active?.undoBuild(target)) && await active!.durable(); },
    };
    return () => { delete window.__cloudQa; };
  }, [cloud?.active, cloud?.phase]);
  if (!cloud) return null;
  const create = () => {
    createQaDeviceCampaign(cloud.runtime.accountId);
    onCreate();
  };
  return <aside aria-label="Disposable cloud QA controls" style={{ padding: 8 }}>
    <strong>Disposable QA only — {location.origin}. No owner saves or live Supabase.</strong>
    <button type="button" disabled={Boolean(cloud.active)} onClick={create}>Create synthetic device campaign</button>
    <button type="button" onClick={onSwitch}>Switch synthetic account</button>
  </aside>;
}
if (import.meta.env.MODE !== "test") {
  const root = document.getElementById("root")!;
  if (!import.meta.env.DEV || !window.__cloudQaCall || !window.__cloudQaAuthenticate) root.textContent = "This disposable QA entry requires the test runner and is unavailable in release builds.";
  else createRoot(root).render(<QaApp />);
}
