import { useEffect, useRef, useState } from "react";
import { useAuthAccountActions } from "../auth/AuthAccountContext";
import { useCloudAccount } from "../session/cloud/CloudAccount";
import { importLocalCloudCampaign, inspectLocalCloudSources, promoteExistingLocalQuestions, type LocalCloudSource } from "../session/cloud/importCampaigns";
import { useUsageTracking } from "../playtime/UsageProvider";
import type { QuestionUsageReceipt } from "../playtime/usageTypes";
import { cloudEntryError } from "./cloudEntryError";
import { AccountMenu, CloudNoticeDetails } from "./AccountMenu";
import { ClinicalContentNotice } from "./ClinicalContentNotice";
import "./cloudSaves.css";

export function CloudCampaignEntry({ onOpen, onLocalCampaign, onLocalOnly, onCreate, notice = "" }: {
  onOpen(campaignId: string): Promise<void>;
  onLocalCampaign(campaignId: string): void;
  onLocalOnly(): void;
  onCreate(): void;
  notice?: string;
}) {
  const cloud = useCloudAccount()!, account = useAuthAccountActions(), { runtime } = cloud;
  const usage = useUsageTracking();
  const [pendingQuestions, setPendingQuestions] = useState<QuestionUsageReceipt[]>([]);
  const [includeUnowned, setIncludeUnowned] = useState(false), [claim, setClaim] = useState(false);
  const [sources, setSources] = useState<LocalCloudSource[]>([]), [problems, setProblems] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]), [names, setNames] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, string>>({}), [busy, setBusy] = useState(false), [error, setError] = useState("");
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    let current = true;
    void (async () => {
      const inspection = await inspectLocalCloudSources(runtime.accountId, window.localStorage, runtime.entryStore, includeUnowned);
      const created = (await runtime.entryStore.entries()).filter(entry => entry.key.startsWith("created:")).map(entry => entry.value as LocalCloudSource);
      if (current) { setSources([...inspection.sources, ...created]); setProblems(inspection.problems); setPendingQuestions(inspection.pendingUsageQuestions); }
    })().catch(() => { if (current) setProblems(["Browser recovery storage is unavailable. Original saves have not been replaced."]); });
    return () => { current = false; };
  }, [runtime, includeUnowned]);
  useEffect(() => {
    if (!usage || !pendingQuestions.length) return;
    let active = true, promoting = false;
    const promote = () => {
      if (!active || promoting) return; promoting = true;
      void promoteExistingLocalQuestions(pendingQuestions, usage, runtime.entryStore).catch(() => { /* The original staging and existing outbox remain retryable. */ }).finally(() => { promoting = false; });
    };
    const unsubscribe = usage.subscribe(promote); promote();
    return () => { active = false; unsubscribe(); };
  }, [usage, pendingQuestions, runtime]);
  const canUseCloud = cloud.phase === "available" && cloud.access?.enabled && cloud.access.writesEnabled !== false && cloud.access.noticeAccepted;
  const copySelected = async () => {
    if (busy || !canUseCloud || selected.length === 0 || selected.some(id => sources.find(source => source.id === id)?.unowned) && !claim) return;
    setBusy(true); setError("");
    for (const id of selected) {
      if (!mounted.current) break;
      const source = sources.find(row => row.id === id); if (!source) continue;
      try {
        await importLocalCloudCampaign(source, names[id] ?? source.campaign.name, runtime.transport, runtime.entryStore);
        if (mounted.current) setResults(current => ({ ...current, [id]: "Copied and verified in your account. The original bytes remain on this device." }));
      } catch (failure) { if (mounted.current) setResults(current => ({ ...current, [id]: cloudEntryError(failure) })); }
    }
    if (mounted.current) { await cloud.refresh(); setBusy(false); }
  };
  const action = async (run: () => Promise<void>) => {
    if (busy) return; setBusy(true); setError("");
    try { await run(); } catch (failure) { if (mounted.current) setError(cloudEntryError(failure)); }
    finally { if (mounted.current) setBusy(false); }
  };
  return <main className="cloud-entry">
    <h1>Clinic campaigns</h1><AccountMenu /><ClinicalContentNotice />
    {notice ? <p role="status">{notice}</p> : null}
    <p>Use the same invited account on desktop and phone. Account campaigns continue from the last confirmed account save.</p>
    <p><strong>Two cloud campaigns per account, including archived clinics and recovery campaigns.</strong> Archives keep their slot. Extra campaigns stay on this device. Storage limits may pause a large campaign; history is never removed to make it fit.</p>
    {cloud.phase === "checking" ? <p role="status">Checking account campaigns…</p> : null}
    {cloud.phase === "error" ? <p role="alert">Account campaigns are unavailable. No empty campaign has replaced your save. Retry, or choose a device-only campaign explicitly.</p> : null}
    {cloud.phase === "deletion-requested" || cloud.phase === "deleted" ? <p role="alert">{cloud.phase === "deleted" ? "Account data deletion is confirmed. Play and uploads have stopped." : "Account deletion is not confirmed. Play and uploads are stopped here; retry from Account & privacy."}</p> : null}
    {cloud.access && (!cloud.access.enabled || cloud.access.writesEnabled === false) ? <p role="status">Cloud saving is currently disabled. Existing account campaigns remain paused; device-only copies have separate progress.</p> : null}
    {cloud.access && !cloud.access.noticeAccepted && cloud.phase === "available" ? <section aria-label="Cloud save notice">
      <h2>Before using cloud saves</h2><CloudNoticeDetails region={runtime.region} />
      {!runtime.region ? <p role="alert">The service region has not been published. Cloud enrollment is unavailable until the owner completes this notice.</p> : null}
      <button type="button" disabled={busy || !runtime.region || !cloud.access.enabled} onClick={() => void action(cloud.acceptNotice)}>Accept cloud save notice</button>
      <button type="button" disabled={busy} onClick={onLocalOnly}>Later — use this device only</button>
    </section> : null}
    {cloud.access?.quotaWarning ? <p role="status">Account storage is nearly full. Keep a recovery copy and contact the owner before adding more history.</p> : null}
    <button type="button" disabled={busy} onClick={() => void action(cloud.refresh)}>Refresh account campaigns</button>
    <div className="cloud-entry-lists">
      <section aria-label="Account campaigns" tabIndex={-1}><h2>Account campaigns ({cloud.summaries.length}/2)</h2>
        {cloud.summaries.length === 0 ? <p>No account campaigns are listed. Nothing uploads on sign-in alone.</p> : null}
        {cloud.summaries.map(campaign => <article key={campaign.campaignId}>
          <h3>{campaign.name}</h3><p>Account · {campaign.status === "archived" ? "Archived — still uses a slot" : "Resumable"}</p>
          <p>Last account save: {new Date(campaign.acceptedAtMs).toLocaleString()}</p>
          {campaign.writerActive ? <p>Open on another device. Opening here does not take over.</p> : null}
          <button type="button" disabled={busy || !canUseCloud} onClick={() => void action(() => onOpen(campaign.campaignId))}>{campaign.status === "archived" ? "Restore" : "Open"} {campaign.name}</button>
        </article>)}
        <button type="button" disabled={busy || !canUseCloud || cloud.access?.enrollmentsEnabled === false || cloud.summaries.length >= 2} onClick={onCreate}>Create account campaign</button>
        {cloud.summaries.length >= 2 ? <p>Both cloud slots are in use. You can create another clinic on this device; archiving does not free a slot.</p> : null}
        <button type="button" disabled={busy} onClick={onLocalOnly}>Use this device only</button>
      </section>
      <section aria-label="Device-only campaigns"><h2>This device only</h2>
        <p>Copying is optional. We keep the exact original bytes and never delete the local campaign. Historical questions do not add new usage counts.</p>
        <label><input type="checkbox" checked={includeUnowned} disabled={busy} onChange={event => { setIncludeUnowned(event.target.checked); setSelected([]); setClaim(false); }} />Inspect unowned legacy campaigns on this site</label>
        {problems.map((problem, index) => <p key={index} role="alert">{problem}</p>)}
        {sources.map(source => <article key={source.id}>
          <h3>{source.campaign.name}</h3><p>This device only{source.unowned ? " · Unowned source" : " · This account's local source"} · Level {source.facilityLevel} · {source.campaign.status} · {source.bytes.toLocaleString()} bytes</p>
          {cloud.summaries.some(row => row.campaignId === source.campaign.campaignId) ? <p>An account campaign with this ID exists. The original stays here; an unfinished identical copy can be verified again.</p> : null}
          {source.error ? <p role="alert">{source.error}</p> : <>
            <label><input type="checkbox" checked={selected.includes(source.id)} disabled={busy || !canUseCloud || cloud.access?.enrollmentsEnabled === false}
              onChange={event => setSelected(current => event.target.checked ? [...current, source.id] : current.filter(id => id !== source.id))} />Copy {source.campaign.name} to my account</label>
            <label>Name in account<input type="text" maxLength={160} value={names[source.id] ?? source.campaign.name} disabled={busy} onChange={event => setNames(current => ({ ...current, [source.id]: event.target.value }))} /></label>
          </>}
          {!source.unowned && !source.error && !source.sourceKey.startsWith("created:") && !cloud.summaries.some(row => row.campaignId === source.campaign.campaignId) ? <button type="button" disabled={busy} onClick={() => onLocalCampaign(source.campaign.campaignId)}>Play {source.campaign.name} on this device</button> : null}
          {results[source.id] ? <p role="status">{results[source.id]}</p> : null}
        </article>)}
        {selected.some(id => sources.find(source => source.id === id)?.unowned) ? <label><input type="checkbox" checked={claim} onChange={event => setClaim(event.target.checked)} disabled={busy} />Copy these unowned campaigns to {account?.email ?? "the signed-in account"}. Their original bytes remain unowned on this device.</label> : null}
        <button type="button" disabled={busy || !canUseCloud || !selected.length || selected.some(id => sources.find(source => source.id === id)?.unowned) && !claim} onClick={() => void copySelected()}>{busy ? "Checking copies…" : "Copy selected local campaigns to my account"}</button>
        <button type="button" disabled={busy || !cloud.access?.noticeAccepted} onClick={() => document.querySelector<HTMLElement>('[aria-label="Account campaigns"]')?.focus()}>Use account campaigns</button>
      </section>
    </div>
    {error ? <p role="alert">{error}</p> : null}
    <p className="cloud-origin">Device storage belongs to {typeof location === "undefined" ? "this site" : location.origin} and this browser profile. Other sites and profiles have separate local copies.</p>
  </main>;
}
