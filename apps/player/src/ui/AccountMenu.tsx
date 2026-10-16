import { useEffect, useState } from "react";
import { useAuthAccountActions, useAuthAccountId } from "../auth/AuthAccountContext";
import { VersionLabel } from "../appVersion";
import { useUsageTracking } from "../playtime/UsageProvider";
import { USAGE_NOTICE_TEXT, USAGE_NOTICE_VERSION } from "../playtime/usageTypes";
import { useQuestionFlags } from "../session/QuestionFlagProvider";
import { saveQuestionReviewFlags } from "../session/questionReviewFlags";
import { ClinicalContentNotice } from "./ClinicalContentNotice";
import "./betaAccount.css";

function useUsageStatus() {
  const tracker = useUsageTracking();
  const [, redraw] = useState(0);
  useEffect(() => tracker?.subscribe(() => redraw((n) => n + 1)), [tracker]);
  return tracker?.status();
}

function PrivacyInfo() {
  return <>
    <p>{USAGE_NOTICE_TEXT}</p>
    <p>The owner sees only total active play time and total questions for the last 90 days. Time stops when the game is hidden, paused, or unused for five minutes. Help, Build and Management pause time recording. First scored patient and team questions each count once, right or wrong.</p>
    <p>Question flags are voluntary and separate from usage counts. A flag sends question IDs and versions, displayed choice order, your chosen answer and your comment. The owner and manager review reports manually, using Claude Code and Codex to investigate issues. Please do not enter real patient information.</p>
    <p>Send feedback stores your voluntary comment with your account, game release/build version, facility level, desktop or phone layout, and time. It sends no saved clinic contents. The manager compiles comments privately for the game owner, who decides what to do with each comment. You can send feedback even while usage recording is off; a deletion request stops further submissions.</p>
    <p>Supabase hosts accounts, usage, question flags and feedback comments; the owner emails account links personally, and GitHub Pages hosts the game. These providers may keep security logs. Hosted usage, flags and feedback are retained for 90 days. Pending usage and flag uploads stay in this browser for at most seven days and may be lost if storage is blocked or full. Unsent feedback stays in the open comment box for you to retry; it is not uploaded automatically.</p>
    <p>Contact the owner who invited you for support or deletion. After an in-game deletion request, recording stops immediately; remaining account administration and private report copies are handled by the owner within seven days.</p>
    <p>Saves stay on this device until cloud saves arrive.</p>
    <p>Local campaigns belong to this browser profile and site address. Signing in elsewhere does not move them. A remote deletion request cannot erase offline local copies on other devices.</p>
  </>;
}

function AcceptUsageNotice() {
  const tracker = useUsageTracking();
  const status = useUsageStatus();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  if (!tracker || tracker.canRecordQuestions() || status?.state === "deleted" || status?.state === "blocked") return null;
  return <>
    <p role="status">Recording is off until you accept this notice.</p>
    {error ? <p role="alert">{error}</p> : null}
    <button type="button" disabled={pending || status?.state !== "requires-notice"} onClick={() => {
      setPending(true); setError("");
      void tracker.acceptNotice(USAGE_NOTICE_VERSION).then(() => {
        if (!tracker.canRecordQuestions()) setError("Acceptance could not be confirmed. Recording remains off; try again when the service is available.");
      }).catch(() => setError("The notice could not be accepted. Recording remains off; try again later."))
        .finally(() => setPending(false));
    }}>{pending ? "Accepting…" : "Accept"}</button>
  </>;
}

/** First sign-in, above both campaign entry and shell selection. */
export function UsageNotice() {
  const tracker = useUsageTracking();
  const status = useUsageStatus();
  const [dismissed, setDismissed] = useState(false);
  if (!tracker || dismissed || tracker.canRecordQuestions() || status?.state === "deleted" || status?.state === "blocked") return null;
  return <aside className="beta-usage-notice" aria-label="Usage notice">
    <h2>Before you play</h2>
    <p>{USAGE_NOTICE_TEXT}</p>
    <details><summary>Account and privacy details</summary><PrivacyInfo /></details>
    <AcceptUsageNotice />
    <button type="button" className="text-button" onClick={() => setDismissed(true)}>Later — keep recording off</button>
    <ClinicalContentNotice />
  </aside>;
}

export function AccountMenu() {
  const account = useAuthAccountActions();
  const accountId = useAuthAccountId();
  const tracker = useUsageTracking();
  const flags = useQuestionFlags();
  const status = useUsageStatus();
  const [confirm, setConfirm] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [requested, setRequested] = useState(false);
  if (!account || !accountId) return null;
  const removeUsage = async () => {
    if (!tracker || pending) return;
    setPending(true); setError(""); setRequested(true);
    flags?.clear();
    saveQuestionReviewFlags([], undefined, accountId);
    try { await tracker.requestDeletion(); setConfirm(false); }
    catch { setError("Deletion could not reach the service. Recording is off on this device. Retry when you are online; hosted deletion is not yet confirmed."); }
    finally { setPending(false); }
  };
  return <details className="beta-account">
    <summary>Account &amp; privacy</summary>
    <p>Signed in as {account.email}</p>
    <PrivacyInfo />
    <AcceptUsageNotice />
    <p role="status">{status?.state === "deleted" ? "Usage and submitted flags deleted. Recording is off for this account. Feedback comments are also deleted." :
      status?.state === "blocked" ? "Recording is off for this account." : status?.state === "unavailable" ? "Usage uploads are unavailable. Pending records are waiting to send." :
      status?.pendingReceipts ? "Usage is waiting to send." : tracker?.canRecordQuestions() ? "Usage recording is on." : "Usage recording is off."}
      {status && !status.storageAvailable ? " Browser storage is unavailable; pending usage may be lost when this tab closes." : ""}
      {status?.droppedReceipts ? " Some pending usage expired or exceeded the queue limit." : ""}
      {tracker?.canRecordQuestions() && !status?.countingHere ? " Time recording needs a visible tab with browser lock support." : ""}
    </p>
    {confirm ? <div aria-label="Confirm usage data deletion">
      <p>Delete your recorded usage, submitted question flags and feedback comments? Recording and new feedback submissions will stop for this account. Your saved clinics stay on this device.</p>
      <div className="beta-actions">
        <button type="button" disabled={pending} onClick={() => void removeUsage()}>{pending ? "Deleting…" : "Confirm delete my usage data"}</button>
        <button type="button" disabled={pending} onClick={() => setConfirm(false)}>Cancel deletion</button>
      </div>
    </div> : status?.state !== "deleted" ? <button type="button" disabled={!tracker || pending} onClick={() => setConfirm(true)}>
      {requested || status?.state === "blocked" ? "Retry delete my usage data" : "Delete my usage data"}
    </button> : null}
    {error ? <p role="alert">{error}</p> : null}
    {account.message ? <p role="alert">{account.message}</p> : null}
    <button type="button" disabled={account.pending || pending} onClick={() => void account.signOut()}>{account.pending ? "Signing out…" : "Sign out"}</button>
    <ClinicalContentNotice />
    <VersionLabel />
  </details>;
}
