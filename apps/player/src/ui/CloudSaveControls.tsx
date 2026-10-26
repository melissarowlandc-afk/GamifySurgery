import { useEffect, useRef, useState, type ReactNode } from "react";
import type { CloudSyncView } from "../session/cloud/coordinator";
import "./cloudSaves.css";

export interface CloudShellSave {
  campaignName: string;
  view: CloudSyncView;
  writerElsewhere: boolean;
  onContinue(takeover: boolean): Promise<boolean>;
  onRetry(): Promise<boolean>;
  onUseAccountSave(): Promise<boolean>;
  onKeepRecovery(): Promise<boolean>;
  onSaveAndClose(): Promise<boolean>;
  onCampaigns(): void;
}
/** No indicator for healthy saves, including background encoding and queued changes. */
export function cloudStatusText(view: CloudSyncView): string | null {
  if (view.priorRecovery) return "Your latest save could not be opened. Review recovery options.";
  if (view.failure === "writer") return "This clinic continued on another device. Play is paused here.";
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

export function CloudSaveControls({ save, closeRequest = 0 }: { save: CloudShellSave; closeRequest?: number }) {
  const { view } = save;
  const [open, setOpen] = useState(false), [busy, setBusy] = useState(false);
  const [closed, setClosed] = useState(false), [error, setError] = useState("");
  const mounted = useRef(true), lastCloseRequest = useRef(0);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    if (["readonly", "conflict", "auth", "blocked", "storage", "capacity"].includes(view.phase) || view.phase === "paused" && view.failure) setOpen(true);
  }, [view.phase, view.failure]);
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
  const close = () => { setOpen(true); setClosed(false); void action(save.onSaveAndClose, true); };
  useEffect(() => {
    if (closeRequest && closeRequest !== lastCloseRequest.current) { lastCloseRequest.current = closeRequest; close(); }
  }, [closeRequest]);
  const needsDecision = view.phase === "readonly" && !view.priorRecovery;
  const needsResume = view.phase === "ready" && !view.canExecute && !view.pending;
  // A late status update must not hide a confirmed close: show it whenever the
  // requested close succeeded and the session is actually closed.
  const showClosed = closed && view.phase === "closed";
  const status = cloudStatusText(view);
  const title = showClosed ? "Safe to close this tab" : needsDecision ? "Continue on this device?" : "Account save";
  return <div className="cloud-save-controls">
    {status ? <button type="button" className="cloud-sync-status" onClick={() => setOpen(true)} aria-label={`Account save status: ${status}`}>
      <span role="status" aria-live="polite" aria-atomic="true">{status}</span>
    </button> : null}
    {needsDecision ? <button type="button" className="button button-secondary" onClick={() => setOpen(true)}>Continue clinic</button> : null}
    {needsResume ? <button type="button" className="button button-secondary" onClick={() => setOpen(true)}>Resume clinic</button> : null}
    <button type="button" className="button button-secondary save-close-button" disabled={busy} onClick={close}>Save &amp; Close</button>
    {open ? <CloudDialog title={title} onClose={() => setOpen(false)}>
      <p className="cloud-campaign-name">{save.campaignName} · Account</p>
      {showClosed ? <p>Your clinic is saved to your account and paused, and this device has released its session. You may close this tab.</p> : <>
        {status ? <p>{status}</p> : null}
        {view.confirmedAtMs !== null ? <p>Last confirmed account save: <time dateTime={new Date(view.confirmedAtMs).toISOString()}>{new Date(view.confirmedAtMs).toLocaleString()}</time>.</p> : null}
        {view.failure === "writer" ? <p>You continued on another device. Recent changes here have not replaced your account save.</p> : null}
        {view.failure === "revision" || view.failure === "account-save-changed" ? <p>A newer account save is available. Changes waiting here are preserved separately; choose a recovery copy before using the account save.</p> : null}
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
        {["paused", "conflict", "waiting", "storage", "capacity", "blocked", "auth"].includes(view.phase) || view.priorRecovery ? <button type="button" disabled={busy} onClick={() => void action(save.onRetry)}>Retry account save</button> : null}
        {view.phase === "ready" && !view.canExecute && !view.pending ? <button type="button" disabled={busy} onClick={() => void action(() => save.onContinue(false))}>Resume checked campaign</button> : null}
        {view.pending || view.phase === "conflict" || view.priorRecovery || view.failure === "account-save-changed" ? <>
          <button type="button" disabled={busy} onClick={() => void action(save.onKeepRecovery)}>Keep a recovery copy</button>
          {!view.priorRecovery ? <button type="button" disabled={busy} onClick={() => void action(save.onUseAccountSave)}>Use account save</button> : null}
        </> : null}
        {view.phase === "closed" ? <button type="button" onClick={save.onCampaigns}>Choose a campaign</button> : null}
        <p>Use Save &amp; Close before switching devices.</p>
      </>}
      {busy ? <p role="status">Waiting for account confirmation…</p> : null}
      {error ? <p role="alert">{error}</p> : null}
    </CloudDialog> : null}
  </div>;
}
