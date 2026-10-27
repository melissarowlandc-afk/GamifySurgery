import { useEffect, useId, useRef, useState } from "react";
import { useCloudAccount } from "../session/cloud/CloudAccount";
import { loadCloudEvidenceCheckpoint } from "../session/cloud/codecEvidence";
import { chooseAutomaticCampaignEnrollment, finishAutomaticCampaignEnrollment, inspectLocalCloudSources,
  prepareAutomaticCampaignEnrollment, promoteExistingLocalQuestions, type AutomaticCampaignEnrollment } from "../session/cloud/importCampaigns";
import { CloudSyncError, type CloudCampaignSummary } from "../session/cloud/transport";
import { useUsageTracking } from "../playtime/UsageProvider";
import type { QuestionUsageReceipt } from "../playtime/usageTypes";
import { usePresentationLayout } from "../shellPresentation";
import { cloudEntryError } from "./cloudEntryError";
import { AccountMenu, CloudNoticeDetails } from "./AccountMenu";
import { ClinicalContentNotice } from "./ClinicalContentNotice";
import "./cloudSaves.css";

function ClinicTime({ value }: { value: number }) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? <time dateTime={date.toISOString()}>{date.toLocaleString()}</time> : <>Time unavailable</>;
}

export function CloudCampaignEntry({ onOpen, onCreate, notice = "", preparing = false }: {
  onOpen(campaignId: string): Promise<void>;
  onCreate(): void;
  notice?: string;
  preparing?: boolean;
}) {
  const cloud = useCloudAccount()!, { runtime } = cloud;
  const usage = useUsageTracking(), layout = usePresentationLayout(), id = useId();
  const [pendingQuestions, setPendingQuestions] = useState<QuestionUsageReceipt[]>([]);
  const [problems, setProblems] = useState<string[]>([]), [enrollment, setEnrollment] = useState<AutomaticCampaignEnrollment | null>(null);
  const [selected, setSelected] = useState<string[]>([]), [enrollmentError, setEnrollmentError] = useState("");
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const [replace, setReplace] = useState(false), [target, setTarget] = useState<CloudCampaignSummary | null>(null);
  const [levels, setLevels] = useState<Record<string, number | null>>({});
  const levelRequests = useRef(new Map<string, Promise<number | null>>());
  const mounted = useRef(true), working = useRef(false), opened = useRef(false), started = useRef(false);
  const latest = useRef(cloud); latest.current = cloud;
  const replacement = useRef<HTMLElement | null>(null);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    const update = () => {
      if (["deleted", "deletion-requested"].includes(latest.current.phase)) return;
      void latest.current.refresh().catch(() => { /* The account provider reports unavailable saves. */ });
    };
    if (!opened.current) { opened.current = true; update(); }
    window.addEventListener("focus", update);
    return () => window.removeEventListener("focus", update);
  }, []);
  useEffect(() => { if (replace) replacement.current?.focus(); }, [replace, target]);
  const runEnrollment = async (choice?: readonly string[]) => {
    if (working.current) return;
    working.current = true; setBusy(true); setEnrollmentError("");
    try {
      let next: AutomaticCampaignEnrollment;
      if (choice) {
        const summaries = await runtime.transport.list();
        next = await chooseAutomaticCampaignEnrollment(choice, Math.max(0, 2 - summaries.length), runtime.entryStore);
      } else {
        const inspection = await inspectLocalCloudSources(runtime.accountId, window.localStorage, runtime.entryStore);
        if (!mounted.current) return;
        setProblems([...inspection.problems, ...inspection.sources.filter(source => source.error).map(source => `${source.campaign.name} could not be saved to your account. Its original copy is kept on this device.`)]);
        setPendingQuestions(inspection.pendingUsageQuestions);
        next = await prepareAutomaticCampaignEnrollment(inspection.sources, latest.current.summaries, runtime.entryStore);
      }
      if (!mounted.current) return;
      setEnrollment(next);
      if (next.phase === "saving") next = await finishAutomaticCampaignEnrollment(runtime.transport, runtime.entryStore);
      if (!mounted.current) return;
      // Update the shared account list before enabling Resume or new creation.
      if (next.phase === "complete" && next.selectedIds.length) await latest.current.refresh();
      if (mounted.current) setEnrollment(next);
    } catch (failure) {
      if (mounted.current) {
        setEnrollmentError(cloudEntryError(failure));
        // A batch may have saved its first campaign before another failed.
        // Keep every confirmed account campaign visible and resumable.
        await latest.current.refresh();
      }
    }
    finally { working.current = false; if (mounted.current) setBusy(false); }
  };
  useEffect(() => {
    if (started.current || busy || working.current || cloud.phase !== "available" || !cloud.access?.enabled || cloud.access.writesEnabled === false || !cloud.access.noticeAccepted) return;
    started.current = true; void runEnrollment();
  }, [runtime, cloud.phase, cloud.access?.enabled, cloud.access?.writesEnabled, cloud.access?.noticeAccepted, busy]);
  useEffect(() => {
    if (!usage || !pendingQuestions.length) return;
    let active = true, promoting = false;
    const promote = () => {
      if (!active || promoting) return; promoting = true;
      void promoteExistingLocalQuestions(pendingQuestions, usage, runtime.entryStore).catch(() => { /* Existing staging stays retryable. */ }).finally(() => { promoting = false; });
    };
    const unsubscribe = usage.subscribe(promote); promote();
    return () => { active = false; unsubscribe(); };
  }, [usage, pendingQuestions, runtime]);
  // List metadata has no level field. These verified reads never acquire a
  // writer. The real Resume path retains its explicit continuation/takeover.
  const listedRevisions = JSON.stringify(cloud.summaries.map(campaign => [campaign.campaignId, campaign.revision]));
  useEffect(() => {
    if (cloud.phase !== "available" || !cloud.access?.enabled || !cloud.access.noticeAccepted || busy) return;
    let current = true;
    for (const [campaignId, revision] of JSON.parse(listedRevisions) as [string, string][]) {
      const key = JSON.stringify([campaignId, revision]);
      let request = levelRequests.current.get(key);
      if (!request) {
        request = (async () => {
          const cached = await runtime.cache.read({ backendId: runtime.backendId, accountId: runtime.accountId, campaignId }).catch(() => null);
          const enrolled = await runtime.entryStore.read<{ revision: string; facilityLevel?: number }>(`enrolled:${campaignId}`).catch(() => null);
          if (enrolled?.revision === revision && Number.isInteger(enrolled.facilityLevel)) return enrolled.facilityLevel!;
          const loaded = cached?.entry.confirmed.revision === revision ? cached.entry.confirmed : await runtime.transport.load(campaignId, revision);
          const verified = await loadCloudEvidenceCheckpoint({ ...loaded, expectedCampaignId: campaignId, expectedRevision: revision, expectedBaselineId: loaded.baselineId });
          return verified.state.facilityLevel;
        })().catch(() => { levelRequests.current.delete(key); return null; });
        levelRequests.current.set(key, request);
      }
      void request.then(level => { if (current) setLevels(previous => ({ ...previous, [key]: level })); });
    }
    return () => { current = false; };
  }, [runtime, listedRevisions, cloud.phase, cloud.access?.enabled, cloud.access?.noticeAccepted, busy]);
  const canUseCloud = cloud.phase === "available" && cloud.access?.enabled && cloud.access.writesEnabled !== false && cloud.access.noticeAccepted;
  const needsNotice = cloud.access !== null && !cloud.access.noticeAccepted;
  const migrationReady = enrollment?.phase === "complete", full = cloud.summaries.length >= 2;
  const accountReason = cloud.phase === "checking" ? "Checking your account…" :
    cloud.phase === "deletion-requested" || cloud.phase === "deleted" ? "Account play has stopped." :
    cloud.phase === "error" ? "Your account campaigns are unavailable. Check your connection and return to this page to try again." :
    !cloud.access?.enabled || cloud.access.writesEnabled === false ? "Account saving is currently unavailable. Try again later." :
    !cloud.access.noticeAccepted ? "Accept the notice above to resume or start a campaign." : "";
  const action = async (run: () => Promise<void>) => {
    if (working.current) return; working.current = true; setBusy(true); setError("");
    try { await run(); } catch (failure) { if (mounted.current) setError(cloudEntryError(failure)); }
    finally { working.current = false; if (mounted.current) setBusy(false); }
  };
  const deleteAndCreate = () => void action(async () => {
    if (!target || !canUseCloud || !migrationReady || cloud.access?.enrollmentsEnabled === false) return;
    if (!runtime.transport.deleteCampaign) { setError("Campaign replacement is unavailable. Contact the owner."); return; }
    // Keep a durable local exclusion BEFORE deletion. Even a lost reply or
    // interrupted new-campaign setup must not resurrect the retained original.
    await runtime.entryStore.create(`retired:${target.campaignId}`, { revision: target.revision });
    try { await runtime.transport.deleteCampaign({ campaignId: target.campaignId, expectedRevision: target.revision }); }
    catch (failure) {
      setError(failure instanceof CloudSyncError && failure.code === "writer" ? "This campaign is open on another device. Use Save & Close there before replacing it." :
        failure instanceof CloudSyncError && failure.code === "revision" ? "This campaign has a newer save. Cancel and choose it again before deciding what to delete." :
        "Deletion is not confirmed. Try again to check the same campaign, or cancel. A new campaign has not been started.");
      await latest.current.refresh(); return;
    }
    if (!mounted.current) return;
    await latest.current.refresh();
    if (mounted.current) { setTarget(null); setReplace(false); onCreate(); }
  });
  return <main className={`cloud-entry cloud-entry--${layout}`}>
    <header><h1>Your campaigns</h1><ClinicalContentNotice /></header>
    {needsNotice && cloud.phase === "available" ? <section className="cloud-entry-notice" aria-labelledby={`${id}-notice-title`}>
      <h2 id={`${id}-notice-title`}>Before using account saves</h2>
      <p>Supabase will store your clinic, answers and learning history so you can continue on your phone or computer.</p>
      <p>After you accept, campaigns already saved for this account on this device are added automatically when there is room. Original device copies stay here.</p>
      <details><summary>Read the full account save notice</summary><CloudNoticeDetails region={runtime.region} /></details>
      {!runtime.region ? <p role="alert">The service region has not been published. Account saving is unavailable until the owner completes this notice.</p> : null}
      <button type="button" className="button button-primary" disabled={busy || !runtime.region || !cloud.access?.enabled || cloud.access.writesEnabled === false}
        onClick={() => void action(cloud.acceptNotice)}>Accept and continue</button>
    </section> : null}
    {notice ? <p role="status">{notice}</p> : null}
    {accountReason ? <p id={`${id}-account-reason`} role={cloud.phase === "error" ? "alert" : "status"}>{accountReason}</p> : null}
    {cloud.phase === "deletion-requested" || cloud.phase === "deleted" ? <p role="alert">{cloud.phase === "deleted" ? "Account data deletion is confirmed. Play and uploads have stopped." : "Account deletion is not confirmed. Play and uploads are stopped here; retry from Account & privacy."}</p> : null}
    {cloud.access?.quotaWarning ? <p role="status">Account storage is nearly full. Contact the owner before adding more progress.</p> : null}
    {preparing || busy && !replace && !enrollmentError && !migrationReady ? <p role="status">Getting your campaigns ready…</p> : null}
    {enrollmentError ? <div role="alert"><p>{enrollmentError}</p><button type="button" disabled={busy || !canUseCloud} onClick={() => void runEnrollment()}>Try saving my campaigns again</button></div> : null}
    {enrollment?.phase === "choose" ? <section className="cloud-entry-chooser" aria-label="Choose account campaigns">
      <h2>Your account holds two campaigns. Choose which to keep in your account.</h2>
      <p>{enrollment.freeSlots ? `Choose up to ${Math.min(enrollment.freeSlots, Math.max(0, 2 - cloud.summaries.length))} from this device. The others stay safely on this device and will be hidden.` : "Both places are already in use. Your current account campaigns will stay. The other copies stay safely on this device and will be hidden."}</p>
      {enrollment.candidates.map(({ source }) => <label key={source.id}><input type="checkbox" aria-label={`Keep ${source.campaign.name} in my account`} checked={selected.includes(source.id)}
        disabled={busy || !selected.includes(source.id) && selected.length >= Math.min(enrollment.freeSlots, Math.max(0, 2 - cloud.summaries.length))}
        onChange={event => setSelected(previous => event.target.checked ? [...previous, source.id] : previous.filter(value => value !== source.id))} />
        {source.campaign.name} · Level {source.facilityLevel} · Last played: <ClinicTime value={source.campaign.updatedAtRealMs} /></label>)}
      <button type="button" className="button button-primary" disabled={busy || !canUseCloud} onClick={() => void runEnrollment(selected)}>Keep selected campaigns</button>
    </section> : null}
    <section aria-label="Resume a previous campaign">
      <h2>Resume a previous campaign ({cloud.summaries.length}/2)</h2>
      {cloud.summaries.length === 0 && cloud.phase === "available" && migrationReady && !busy && !enrollmentError ? <p>No campaigns saved to your account yet. Campaigns from before today stay on the device where you played them.</p> : null}
      {cloud.summaries.map(campaign => {
        const level = levels[JSON.stringify([campaign.campaignId, campaign.revision])];
        return <article className="cloud-clinic-row" key={campaign.campaignId} aria-label={campaign.name}>
          <div className="cloud-clinic-info"><h3>{campaign.name}</h3>
            <p>{level === undefined ? "Checking level…" : level === null ? "Level unavailable" : `Level ${level}`}{campaign.status === "archived" ? " · Archived — still counts toward your 2 campaigns" : ""}</p>
            <p>Last saved: <ClinicTime value={campaign.acceptedAtMs} /></p>
            {campaign.writerActive ? <p>Open on another device. You can choose to continue here.</p> : null}
          </div>
          <button type="button" className="button button-primary" aria-label={`Resume ${campaign.name}`} disabled={preparing || busy || !canUseCloud || !migrationReady && !enrollmentError}
            aria-describedby={accountReason ? `${id}-account-reason` : undefined} onClick={() => void action(() => onOpen(campaign.campaignId))}>Resume</button>
        </article>;
      })}
    </section>
    <div className="cloud-entry-actions">
      <button type="button" className="button button-primary" disabled={preparing || busy || !canUseCloud || !migrationReady || cloud.access?.enrollmentsEnabled === false}
        aria-describedby={accountReason ? `${id}-account-reason` : undefined}
        onClick={() => { setError(""); if (full) { setTarget(null); setReplace(true); } else onCreate(); }}>Start a new campaign</button>
      {full ? <p>Your account holds 2 campaigns. Starting a new one requires choosing one to replace.</p> : null}
      {cloud.access?.enrollmentsEnabled === false ? <p>Starting a new campaign is currently unavailable. Try again later.</p> : null}
    </div>
    {replace ? <section className="cloud-entry-replace" aria-label="Replace an account campaign" tabIndex={-1} ref={replacement}>
      {target ? <><h2>Delete {target.name} permanently?</h2><p>The account campaign will be deleted before you start a new one. This cannot be undone.</p>
        <button type="button" className="button button-danger" aria-label={`Delete ${target.name} permanently`} disabled={busy || !canUseCloud} onClick={deleteAndCreate}>Delete permanently</button>
        <button type="button" className="button button-secondary" aria-label={`Keep ${target.name}`} disabled={busy} onClick={() => { setTarget(null); setReplace(false); setError(""); }}>Keep this campaign</button>
      </> : <><h2>Start a new campaign?</h2><p>You can have two campaigns in your account. Starting a new one replaces one of them, and the replaced campaign is deleted.</p>
        {cloud.summaries.map(campaign => <button type="button" className="button button-secondary" key={campaign.campaignId} aria-label={`Replace ${campaign.name}`} disabled={busy} onClick={() => setTarget(campaign)}>Replace {campaign.name}</button>)}
        <button type="button" className="button button-secondary" disabled={busy} onClick={() => { setReplace(false); setError(""); }}>Cancel starting a new campaign</button>
      </>}
    </section> : null}
    {error ? <p role="alert">{error}</p> : null}
    <AccountMenu>
      <section aria-label="Account campaign storage"><h3>Campaign storage</h3>
        <p>You can have 2 campaigns in your account, including archived campaigns. Starting a new one when both places are in use requires choosing a campaign to delete and confirming its name.</p>
        <p>Campaigns already saved for this account on this device are added to your account automatically when there is room. Original copies stay on this device. If there are too many, you choose once which to keep in your account; the others stay here and are hidden.</p>
        <p>Storage limits may pause a large campaign. Your history is never removed to make it fit. Campaigns from before you signed in are kept on this device and are not added automatically.</p>
      </section>
      {cloud.access && !cloud.access.noticeAccepted && cloud.phase === "available" ? <section aria-label="Account save notice"><h3>Account save notice</h3>
        <p>Read the notice above. After you accept, previous campaigns for this account on this device will be saved to your account automatically when there is room.</p>
        {!runtime.region ? <p role="alert">The service region has not been published. Account saving is unavailable until the owner completes this notice.</p> : null}
        <button type="button" disabled={busy || !runtime.region || !cloud.access.enabled || cloud.access.writesEnabled === false} onClick={() => void action(cloud.acceptNotice)}>Accept account save notice</button>
      </section> : null}
      {problems.map((problem, index) => <p key={index} role="alert">{problem}</p>)}
      <p className="cloud-origin">Retained device copies belong to {typeof location === "undefined" ? "this site" : location.origin} and this browser profile. They are kept separately from the account campaigns you can resume above.</p>
    </AccountMenu>
  </main>;
}
