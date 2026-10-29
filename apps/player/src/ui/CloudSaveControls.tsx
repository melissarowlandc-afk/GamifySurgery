import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { CloudSyncView } from "../session/cloud/coordinator";
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
/** Healthy saves have no indicator, including background encoding/uploads. */
export function cloudStatusText(view: CloudSyncView): string | null {
  if (view.failure === "writer" || view.failure === "writer-elsewhere") return "This clinic is now open on another device.";
  if (view.failure === "deleted" || view.failure === "revoked") return "Account access has stopped. Contact the owner.";
  if (view.priorRecovery) return "The latest save could not be verified. Your older copies are safe.";
  if (view.failure === "processing") return "Save processing stopped. Keep this app open and retry.";
  if (view.phase === "storage" || !view.localDurable && !view.canExecute) return "This browser could not save your progress. Free storage and retry.";
  if (view.phase === "capacity") return "Account storage is full. Your progress is safe on this device.";
  if (view.phase === "auth") return "Sign in again from Account & privacy to continue.";
  if (view.phase === "blocked") return "This clinic could not be opened. Your saved copies are safe.";
  if (view.phase === "waiting") return "Account saving is offline. Your progress stays on this device.";
  if (view.phase === "checking") return "Checking your clinic's saved progress.";
  if (view.phase === "closed") return "This clinic is closed.";
  if (!view.canExecute) return "Your clinic needs a connection check to continue.";
  return null;
}
export function cloudCommandBlockText(view: CloudSyncView): string {
  return cloudStatusText(view) ?? "This clinic is closed.";
}
function CloudCommandBlockNotice({ view, busy, error, onRetry, placement }: {
  view: CloudSyncView; busy: boolean; error: string; onRetry(): void; placement: "overlay" | "inline";
}) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => { setHost(document.body); }, []);
  const writer = view.phase === "closed" || view.failure === "writer" || view.failure === "writer-elsewhere";
  // Desktop escapes chart stacking. Phone reserves real header space instead:
  // a fixed top overlay covers More, the only route to recovery export there.
  const notice = <section className={`cloud-command-blocked${placement === "inline" ? " is-inline" : ""}`} role="alert" aria-label="Clinic status">
    <p>{error || cloudCommandBlockText(view)}</p>
    {!["deleted", "revoked"].includes(view.failure ?? "") ? <button type="button" className="button button-primary"
      disabled={busy} onClick={onRetry}>{busy ? "Checking saved progress..." : writer ? "Open here" : "Retry"}</button> : null}
  </section>;
  return placement === "overlay" && host ? createPortal(notice, host) : notice;
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

export function CloudSaveControls({ save, closeRequest = 0, showCloseButton = true, onBusyChange, blockedNoticePlacement = "overlay" }: {
  save: CloudShellSave; closeRequest?: number; showCloseButton?: boolean; onBusyChange?: (busy: boolean) => void;
  blockedNoticePlacement?: "overlay" | "inline";
}) {
  const { view } = save;
  const [open, setOpen] = useState(false), [busy, setBusy] = useState(false);
  const [closed, setClosed] = useState(false), [error, setError] = useState("");
  // The counter is an edge from a mounted shell, not a durable close command.
  // A fresh control must not replay a request handled by its previous mount.
  const mounted = useRef(true), lastCloseRequest = useRef(closeRequest);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => { onBusyChange?.(busy); }, [busy, onBusyChange]);
  const action = async (run: () => Promise<boolean>, closing = false) => {
    if (busy) return;
    setBusy(true); setError("");
    try {
      const ok = await run();
      if (!mounted.current) return;
      if (closing) setClosed(ok);
      if (!ok) setError(closing ? "Account save is not confirmed. Keep this app open and retry." :
        !view.localDurable ? "This browser could not save your progress. Keep this app open, free storage and retry." :
        "Your saved copies are kept. Check your connection and retry.");
    } catch { if (mounted.current) setError("Saving is not confirmed. Keep this app open and retry."); }
    finally { if (mounted.current) setBusy(false); }
  };
  const close = () => { setOpen(true); setClosed(false); void action(save.onSaveAndClose, true); };
  useEffect(() => {
    if (closeRequest && closeRequest !== lastCloseRequest.current) { lastCloseRequest.current = closeRequest; close(); }
  }, [closeRequest]);
  const status = cloudStatusText(view);
  const showClosed = closed && view.phase === "closed";
  const controls = <>
    {!view.canExecute && !open ? <CloudCommandBlockNotice key={view.failure ?? view.phase}
      view={view} busy={busy} error={error} onRetry={() => void action(save.onRetry)} placement={blockedNoticePlacement} /> : null}
    {view.canExecute && status ? <button type="button" className="cloud-sync-status" disabled={busy}
      onClick={() => void action(save.onRetry)} aria-label={`Account save status: ${status}`}>
      <span role="status">{status}</span>
    </button> : null}
    {showCloseButton ? <button type="button" className="button button-secondary save-close-button" disabled={busy} onClick={close}>Save &amp; Close</button> : null}
    {open ? <CloudDialog title={showClosed ? "Safe to close this tab" : "Saving your clinic"} onClose={() => setOpen(false)}>
      <p>{showClosed ? "Your clinic is saved to your account and paused. You may close this tab." : error || (busy ? "Waiting for account confirmation..." : cloudCommandBlockText(view))}</p>
      {!busy && !showClosed ? <button type="button" className="button button-primary" onClick={() => void action(save.onSaveAndClose, true)}>Retry</button> : null}
      {showClosed ? <button type="button" className="button button-primary" onClick={save.onCampaigns}>Choose a campaign</button> : null}
    </CloudDialog> : null}
  </>;
  return showCloseButton ? <div className="cloud-save-controls">{controls}</div> : controls;
}
