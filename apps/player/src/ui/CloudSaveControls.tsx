import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { CloudSyncView } from "../session/cloud/coordinator";
import type { CloudProgressSummary } from "../session/cloud/progress";
import "./cloudSaves.css";

export interface CloudShellSave {
  campaignName: string;
  view: CloudSyncView;
  writerElsewhere: boolean;
  onContinue(takeover: boolean): Promise<boolean>;
  onRetry(): Promise<boolean>;
  onUseAccountSave(): Promise<boolean>;
  onKeepDevice?(): Promise<boolean>;
  onKeepBoth?(): Promise<boolean>;
  onKeepRecovery(): Promise<boolean>;
  onSaveAndClose(): Promise<boolean>;
  onCampaigns(): void;
}
/** No indicator for healthy saves, including background encoding and queued changes. */
export function cloudStatusText(view: CloudSyncView): string | null {
  if (view.priorRecovery) return "Your latest save could not be opened. Review recovery options.";
  if (view.failure === "writer") return "This clinic continued on another device. Play is paused here.";
  if (view.failure === "lease-check") return "Checking the previous session. This device will continue automatically when its session is available.";
  if (view.failure === "writer-elsewhere") return "This campaign is open somewhere else. Choose whether to continue on this device.";
  if (view.failure === "processing") return "Save processing was interrupted. Keep this app open while it retries, or retry account save.";
  if (view.failure === "clock") return "Play paused after a device clock change or app suspension. Check your account save to resume.";
  if (view.failure === "deleted" || view.failure === "revoked") return "Account access has stopped. Contact the owner.";
  if (view.phase === "storage") return "This browser could not save your progress. Keep this tab open and retry.";
  if (view.phase === "capacity") return "Account storage is full. Keep a recovery copy and contact the owner.";
  if (view.phase === "auth") return "Sign in again to save your progress.";
  if (view.phase === "blocked") return "Your account save failed. Retry or contact the owner.";
  if (view.phase === "conflict") return "A newer account save is available. Review your options.";
  if (view.phase === "waiting") return "Cannot connect to save your progress. Check your connection and retry.";
  if (view.phase === "paused" && view.failure) return "Your account save needs checking before play can continue.";
  if (view.phase === "closed" && view.pending) return "Some changes have not saved to your account. Keep this tab open and retry.";
  return null;
}
export function cloudCommandBlockText(view: CloudSyncView): string {
  return cloudStatusText(view) ?? (!view.localDurable ? "This browser could not save your progress. Keep this tab open and retry."
    : view.phase === "readonly" ? "Continue this clinic on this device before playing."
    : view.phase === "closed" ? "This clinic is closed. Open Account save to choose a campaign."
    : view.phase === "checking" ? "Checking your account save. Play will stay paused until it is checked."
    : "Play is paused until you resume the checked account save on this device.");
}
function CloudCommandBlockNotice({ view, onOpen }: { view: CloudSyncView; onOpen(): void }) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => { setHost(document.body); }, []);
  const notice = <section className="cloud-command-blocked" role="alert" aria-label="Play paused for account save">
    <p>{cloudCommandBlockText(view)}</p>
    <button type="button" onClick={onOpen}>Open account save</button>
  </section>;
  // Escape the HUD/shell stacking context, including an open desktop chart.
  // SSR keeps an inline fallback; native dialogs still use the top layer.
  return host ? createPortal(notice, host) : notice;
}
export function CloudDialog({ title, children, onClose }: { title: string; children: ReactNode; onClose(): void }) {
  const dialog = useRef<HTMLDialogElement>(null), heading = useRef<HTMLHeadingElement>(null), previous = useRef<Element | null>(null);
  useEffect(() => {
    previous.current = document.activeElement;
    if (dialog.current?.showModal) dialog.current.showModal(); else dialog.current?.setAttribute("open", "");
    heading.current?.focus();
    return () => { if (previous.current instanceof HTMLElement) previous.current.focus(); };
  }, []);
  return <dialog ref={dialog} className="confirm-dialog cloud-dialog" aria-labelledby="cloud-dialog-title"
    onCancel={event => { event.preventDefault(); onClose(); }}>
    <h2 id="cloud-dialog-title" tabIndex={-1} ref={heading}>{title}</h2>
    {children}
    <button className="button button-secondary" type="button" onClick={onClose}>Not now</button>
  </dialog>;
}

export function CloudSaveControls({ save, closeRequest = 0, showCloseButton = true, onBusyChange }: {
  save: CloudShellSave; closeRequest?: number; showCloseButton?: boolean; onBusyChange?: (busy: boolean) => void;
}) {
  const { view } = save;
  const [open, setOpen] = useState(false), [busy, setBusy] = useState(false);
  const [closed, setClosed] = useState(false), [error, setError] = useState("");
  const mounted = useRef(true), lastCloseRequest = useRef(0);
  const automaticallyOpened = useRef(false);
  const openDialog = () => { automaticallyOpened.current = false; setOpen(true); };
  const dismissDialog = () => { automaticallyOpened.current = false; setOpen(false); };
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => { onBusyChange?.(busy); }, [busy, onBusyChange]);
  useEffect(() => {
    if (["conflict", "auth", "blocked", "storage", "capacity"].includes(view.phase) || view.priorRecovery || view.phase === "readonly" && view.failure === "writer-elsewhere") {
      if (!open) { automaticallyOpened.current = true; setOpen(true); }
    } else if (view.canExecute && automaticallyOpened.current) dismissDialog();
  }, [view.phase, view.failure, view.canExecute, view.priorRecovery]);
  const action = async (run: () => Promise<boolean>, closing = false) => {
    if (busy) return;
    setBusy(true); setError("");
    try {
      const ok = await run();
      if (!mounted.current) return;
      if (closing) setClosed(ok);
      if (!ok) setError(closing ? "Account save and session close are not confirmed. Keep this tab open and retry or keep a recovery copy." : "The account save could not be confirmed. Your recovery copy is retained.");
      else if (!closing) setOpen(false);
    } catch { if (mounted.current) setError("The service or browser storage is unavailable. Your recovery copy is retained."); }
    finally { if (mounted.current) setBusy(false); }
  };
  const close = () => { openDialog(); setClosed(false); void action(save.onSaveAndClose, true); };
  useEffect(() => {
    if (closeRequest && closeRequest !== lastCloseRequest.current) { lastCloseRequest.current = closeRequest; close(); }
  }, [closeRequest]);
  const needsDecision = view.phase === "readonly" && !view.priorRecovery;
  const needsResume = view.phase === "ready" && !view.canExecute;
  // A late status update must not hide a confirmed close: show it whenever the
  // requested close succeeded and the session is actually closed.
  const showClosed = closed && view.phase === "closed";
  const status = cloudStatusText(view);
  const copies = view.conflictCopies;
  const copyLabel = (copy: CloudProgressSummary) => `${copy.dayTime} · $${copy.cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} · Level ${copy.level} · ${copy.xp.toLocaleString()} XP`;
  const keepDevice = copies && !view.priorRecovery ? copies.canKeepDevice && save.onKeepDevice ? <button type="button" className={copies.newer === "device" ? "button button-primary" : "button button-secondary"}
    disabled={busy} onClick={() => void action(save.onKeepDevice!)}>Keep playing with this device&apos;s progress</button> : !copies.canKeepDevice && save.onKeepBoth ?
      <button type="button" className={copies.newer === "device" && copies.canSaveSeparate !== false ? "button button-primary" : "button button-secondary"}
        disabled={busy || copies.canSaveSeparate === false} onClick={() => void action(save.onKeepBoth!)}>Keep both — save this device&apos;s progress as a separate campaign</button> : null : null;
  const useAccount = <button type="button" className={copies?.newer === "account" ? "button button-primary" : "button button-secondary"}
    disabled={busy || view.phase === "conflict" && !copies && Boolean(save.onKeepDevice)} onClick={() => void action(save.onUseAccountSave)}>Use the account save</button>;
  const title = showClosed ? "Safe to close this tab" : needsDecision ? "Continue on this device?" : "Account save";
  const controls = <>
    {!view.canExecute ? <CloudCommandBlockNotice view={view} onOpen={openDialog} /> : null}
    {status ? <button type="button" className="cloud-sync-status" onClick={openDialog} aria-label={`Account save status: ${status}`}>
      <span role="status" aria-live="polite" aria-atomic="true">{status}</span>
    </button> : null}
    {needsDecision ? <button type="button" className="button button-secondary" onClick={openDialog}>Continue clinic</button> : null}
    {needsResume ? <button type="button" className="button button-secondary" onClick={openDialog}>Resume clinic</button> : null}
    {showCloseButton ? <button type="button" className="button button-secondary save-close-button" disabled={busy} onClick={close}>Save &amp; Close</button> : null}
    {open ? <CloudDialog title={title} onClose={dismissDialog}>
      <p className="cloud-campaign-name">{save.campaignName} · Account</p>
      {showClosed ? <p>Your clinic is saved to your account and paused, and this device has released its session. You may close this tab.</p> : <>
        {status || !view.canExecute ? <p>{status ?? cloudCommandBlockText(view)}</p> : null}
        {view.confirmedAtMs !== null ? <p>Last confirmed account save: <time dateTime={new Date(view.confirmedAtMs).toISOString()}>{new Date(view.confirmedAtMs).toLocaleString()}</time>.</p> : null}
        {view.failure === "writer" ? <p>You continued on another device. Recent changes here have not replaced your account save.</p> : null}
        {view.failure === "revision" || view.failure === "account-save-changed" ? <p>A newer account save is available. Changes waiting here are preserved separately; choose a recovery copy before using the account save.</p> : null}
        {copies ? <section aria-label="Compare saved progress">
          <p>On this device: {copyLabel(copies.device)}.</p>
          <p>Account save: {copyLabel(copies.account)}.</p>
          <p>{copies.newer === "device" ? "This device has newer clinic progress." : copies.newer === "account" ? "The account save has newer clinic progress." : "Both copies are at the same clinic time. Their changes differ."}</p>
          {!copies.canKeepDevice ? <p>These copies have different histories. Keep both by saving this device&apos;s progress as a separate account campaign.</p> : null}
          {!copies.canKeepDevice && copies.canSaveSeparate === false ? <p>Your account holds two campaigns, including archives. No slot is free for a separate campaign. This device&apos;s protected copy is retained; keep a recovery copy before choosing the account save.</p> : null}
        </section> : null}
        {view.phase === "conflict" && !copies && save.onKeepDevice ? <p>Retry account save to compare both saved copies before choosing.</p> : null}
        {view.priorRecovery ? <p>The latest save failed verification. A verified prior revision is available for viewing and recovery. Play stays paused; the account head and later evidence have not been replaced. Retry after an update or contact the owner.</p> : null}
        {view.failure === "revoked" || view.failure === "deleted" ? <p>Access to this account has stopped. Play, uploads and session renewals are paused. Contact the owner who invited you.</p> : null}
        {view.phase === "auth" ? <p>Sign in again as the same account from Account &amp; privacy. Changes waiting here stay with this account.</p> : null}
        {view.failure === "disabled" ? <p>Account saving is disabled by the service. This account campaign stays paused. Retry later or contact the owner.</p> : null}
        {view.failure === "protocol" || view.failure === "corrupt" || view.failure === "operation-expired" ? <p>This save needs an updated game or owner support. Its bytes are preserved; an empty campaign will not replace it.</p> : null}
        {view.phase === "capacity" ? <p>Your account or the project has reached its storage limit. Keep a recovery copy and contact the owner. History has not been removed to make space.</p> : null}
        {view.phase === "storage" ? <p>This browser could not verify a durable recovery copy. Keep this tab open, allow site storage or free browser space, and retry.</p> : null}
        {view.failure === "throttled" ? <p>Too many save requests reached the service. Wait briefly, then retry; changes are still waiting here.</p> : null}
        {view.phase === "waiting" || view.phase === "paused" && !view.priorRecovery ? <p>Account saving needs a fresh connection check. Recovery stays on this device. Play pauses when the brief connection grace or confirmed session expires.</p> : null}
        {needsDecision ? <>
          <p>{save.writerElsewhere ? "This campaign is open somewhere else. " : "Your verified account save is ready. "}Only progress saved to your account can move here. Continuing revokes the other device's session; it may take a moment for that device to notice and pause.</p>
          <button type="button" className="button button-primary" disabled={busy} onClick={() => void action(() => save.onContinue(save.writerElsewhere))}>Continue on this device</button>
        </> : null}
        {view.failure === "lease-check" && save.onKeepDevice ? <button type="button" disabled={busy}
          onClick={() => void action(save.onKeepDevice!)}>Keep playing with this device&apos;s progress</button> : null}
        {["paused", "conflict", "waiting", "storage", "capacity", "blocked", "auth"].includes(view.phase) || view.priorRecovery || view.phase === "ready" && !view.canExecute && view.pending ? <button type="button" disabled={busy} onClick={() => void action(save.onRetry)}>Retry account save</button> : null}
        {needsResume ? <button type="button" disabled={busy} onClick={() => void action(() => save.onContinue(false))}>Resume checked campaign</button> : null}
        {view.pending || view.phase === "conflict" || view.priorRecovery || view.failure === "account-save-changed" ? <>
          {copies?.newer === "account" && !view.priorRecovery ? useAccount : null}
          {keepDevice}
          <button type="button" className={copies?.newer === "device" && !copies.canKeepDevice && copies.canSaveSeparate === false ? "button button-primary" : "button button-secondary"}
            disabled={busy} onClick={() => void action(save.onKeepRecovery)}>Keep a recovery copy</button>
          {!view.priorRecovery && (view.phase === "conflict" || view.failure === "account-save-changed") && copies?.newer !== "account" ? useAccount : null}
        </> : null}
        {view.phase === "closed" ? <button type="button" onClick={save.onCampaigns}>Choose a campaign</button> : null}
        <p>Use Save &amp; Close before switching devices.</p>
      </>}
      {busy ? <p role="status">Waiting for account confirmation…</p> : null}
      {error ? <p role="alert">{error}</p> : null}
    </CloudDialog> : null}
  </>;
  return showCloseButton ? <div className="cloud-save-controls">{controls}</div> : controls;
}
