import { useEffect, useState, type ReactNode } from "react";
import { useAuthAccountActions, useAuthAccountId } from "../auth/AuthAccountContext";
import { VersionLabel } from "../appVersion";
import { useUsageTracking } from "../playtime/UsageProvider";
import { USAGE_NOTICE_TEXT, USAGE_NOTICE_VERSION } from "../playtime/usageTypes";
import { COMPETITION_PRIVACY_NOTICE } from "../competition/types";
import { useQuestionFlags } from "../session/QuestionFlagProvider";
import { saveQuestionReviewFlags } from "../session/questionReviewFlags";
import { accountStorageKey } from "../session/accountStorageKey";
import { clearArchivedReviewFlags } from "../session/storagePressure";
import { ClinicalContentNotice } from "./ClinicalContentNotice";
import { CLOUD_NOTICE_VERSION, downloadCloudRecovery, useCloudAccount } from "../session/cloud/CloudAccount";
import { cloudEntryError } from "./cloudEntryError";
import "./betaAccount.css";

function useUsageStatus() {
  const tracker = useUsageTracking();
  const [, redraw] = useState(0);
  useEffect(() => tracker?.subscribe(() => redraw((n) => n + 1)), [tracker]);
  return tracker?.status();
}

function PrivacyInfo() {
  const cloud = useCloudAccount();
  return <>
    <p>{USAGE_NOTICE_TEXT}</p>
    <p>{COMPETITION_PRIVACY_NOTICE}</p>
    <p>Competition revenue snapshots are retained for 90 days. Pending competition submissions stay in this browser for at most seven days. Your hide preference remains until account data deletion.</p>
    <p>The owner sees only total active play time and total questions for the last 90 days. Time stops when the game is hidden, paused, or unused for five minutes. Help, Build and Management pause time recording. First scored patient and team questions each count once, right or wrong.</p>
    <p>Question flags are voluntary and separate from usage counts. A flag sends question IDs and versions, displayed choice order, your chosen answer and your comment. The owner and manager review reports manually, using Claude Code and Codex to investigate issues. Please do not enter real patient information.</p>
    <p>Send feedback stores your voluntary comment with your account, game release/build version, facility level, desktop or phone layout, and time. It sends no saved clinic contents. The manager compiles comments privately for the game owner, who decides what to do with each comment. You can send feedback even while usage recording is off; a deletion request stops further submissions.</p>
    <p>Supabase hosts accounts, usage, question flags and feedback comments; the owner emails account links personally, and GitHub Pages hosts the game. These providers may keep security logs. Hosted usage, flags and feedback are retained for 90 days. Pending usage and flag uploads stay in this browser for at most seven days and may be lost if storage is blocked or full. Unsent feedback stays in the open comment box for you to retry; it is not uploaded automatically.</p>
    <p>Contact the owner who invited you for support or deletion. After an in-game deletion request, recording stops immediately; remaining account administration and private report copies are handled by the owner within seven days.</p>
    {cloud ? <CloudNoticeDetails region={cloud.runtime.region} /> : <p>Saves stay on this device until cloud saves arrive.</p>}
    {cloud ? <p>Account campaigns can be resumed on another device after signing into the same account. Older copies retained on this device belong to this browser profile and site address. A remote deletion request cannot erase offline local copies on other devices.</p> : <p>Local campaigns belong to this browser profile and site address. Signing in elsewhere does not move them. A remote deletion request cannot erase offline local copies on other devices.</p>}
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

export function AccountMenu({ children }: { children?: ReactNode } = {}) {
  const cloud = useCloudAccount();
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
  if (cloud) return <CloudAccountMenu>{children}</CloudAccountMenu>;
  const removeUsage = async () => {
    if (!tracker || pending) return;
    setPending(true); setError(""); setRequested(true);
    flags?.clear();
    saveQuestionReviewFlags([], undefined, accountId);
    try { await tracker.requestDeletion(); await clearArchivedReviewFlags(accountStorageKey("gamify-surgery.question-review-flags.v1", accountId)); setConfirm(false); }
    catch { setError("Deletion could not reach the service. Recording is off on this device. Retry when you are online; hosted deletion is not yet confirmed."); }
    finally { setPending(false); }
  };
  return <details className="beta-account">
    <summary>Account &amp; privacy</summary>
    <p>Signed in as {account.email}</p>
    <PrivacyInfo />{children}
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

export function CloudNoticeDetails({ region }: { region: string }) {
  return <div className="cloud-notice-details">
    <p>Cloud save notice · {CLOUD_NOTICE_VERSION}</p>
    <p>Supabase stores your full functional clinic for account play: synthetic cases and displayed choices, answers and learning history, facility state, finances and inspection history. After you accept this notice, previous campaigns for this account on this device are added automatically when there is room. If there are too many, you choose which to keep in your account. Original device copies stay here.</p>
    <p>The owner's routine usage report still contains only total active play time and question counts. Cloud saves are used to continue and recover your game, and for owner support when needed. They are not clinical research or campaign analytics and are not sent to the feedback review pipeline. Optional usage recording has its own notice.</p>
    <p>Service region: {region || "not yet published — enrollment unavailable"}. GitHub Pages hosts the game. The beta private-backup policy is weekly, with two copies kept for up to 14 days, alongside a prior cloud save. A total service loss could lose progress since the last weekly backup.</p>
    <p>Cloud campaigns and evidence remain for account gameplay until approved removal or account deletion; they do not expire with the 90-day usage, flag and feedback retention. Ordinary save operations are retained for eight days; import provenance remains with its campaign.</p>
    <p>Delete my data removes cloud campaigns, saved revisions, learning and other evidence, usage, flags and feedback, and stops this account's access. The owner completes remaining account, invitation and private-export cleanup within seven days. A hash-only deletion record lasts 30 days to prevent restoration from backups. Offline browser copies on other devices must be cleared there.</p>
    <p>Signing out keeps this account's recovery copy on this device by default. On a shared device, someone using this browser profile could access stored game data. You may clear this device after confirming or exporting unsent progress. This does not delete cloud campaigns or another account's or the unowned prototype's data.</p>
    <ClinicalContentNotice /><p>Please do not enter real patient information.</p>
  </div>;
}

function CloudAccountMenu({ children }: { children?: ReactNode }) {
  const cloud = useCloudAccount()!, account = useAuthAccountActions()!, tracker = useUsageTracking(), flags = useQuestionFlags();
  const [confirm, setConfirm] = useState(false), [pending, setPending] = useState(false), [error, setError] = useState("");
  const [clearDevice, setClearDevice] = useState(false), [exported, setExported] = useState(false), [downloaded, setDownloaded] = useState(false);
  const remove = async () => {
    setPending(true); setError(""); flags?.clear();
    try {
      if (tracker) await tracker.requestDeletion(cloud.requestDeletion); else await cloud.requestDeletion();
      setConfirm(false);
    } catch { setError("Deletion is not confirmed. Play and uploads are stopped on this device. Retry when the service is available; hosted data has not been confirmed deleted."); }
    finally { setPending(false); }
  };
  const keepRecovery = async () => {
    setPending(true); setError("");
    try {
      const bytes = await cloud.exportDeviceRecovery(); downloadCloudRecovery(bytes); setDownloaded(true);
      if (JSON.parse(bytes).storageReadComplete === false) setError("The recovery file includes the open campaign, but some stored device copies could not be read. Keep this tab open and contact the owner before clearing the device.");
    }
    catch (failure) { setError(cloudEntryError(failure)); }
    finally { setPending(false); }
  };
  const signOut = async () => {
    setPending(true); setError("");
    try {
      if (clearDevice && !exported) { setError("Confirm that unsent progress is saved to your account or that you have kept a recovery file before clearing this device."); return; }
      await cloud.stop(); tracker?.stop(); flags?.stop();
      if (clearDevice) await cloud.clearDevice(exported);
      const signedOut = await account.signOut();
      if (signedOut === false) { setError(clearDevice ? "Device data was cleared, but sign-out was not confirmed. Retry signing out from Account & privacy before leaving this shared device." : "Sign-out was not confirmed. This account campaign stays paused; retry from Account & privacy."); return; }
    } catch (failure) { setError(clearDevice ? "Clearing this device and signing out could not be confirmed. Keep this tab open and retry before leaving this shared device." : cloudEntryError(failure)); }
    finally { setPending(false); }
  };
  return <details className="beta-account cloud-account">
    <summary>Account &amp; privacy</summary><p>Signed in as {account.email}</p>
    <PrivacyInfo />{children}<AcceptUsageNotice />
    <button type="button" disabled={pending} onClick={cloud.showCampaigns}>Account campaign screen</button>
    <p>Sign out keeps this account's recovery copy on this device. On a shared device, stored game data can remain accessible to people using this browser profile.</p>
    <button type="button" disabled={pending} onClick={() => void keepRecovery()}>Download device recovery copy</button>
    {downloaded ? <p role="status">A recovery-file download was requested. Check that the file finished saving before clearing this device.</p> : null}
    <label><input type="checkbox" checked={clearDevice} disabled={pending} onChange={event => { setClearDevice(event.target.checked); setExported(false); }} />Clear this device when I sign out</label>
    {clearDevice ? <>
      <p>This removes only this account's campaigns, recovery copies and pending queues from this site and browser profile. Close other tabs for this account first. Unsent progress will be lost unless it is confirmed in your account or saved in a recovery file. Other offline devices keep their copies.</p>
      <label><input type="checkbox" checked={exported} disabled={pending} onChange={event => setExported(event.target.checked)} />I have confirmed my account saves or kept a completed recovery file for all unsent progress.</label>
    </> : null}
    <button type="button" disabled={pending || account.pending || clearDevice && !exported} onClick={() => void signOut()}>{pending ? "Working…" : clearDevice ? "Sign out and clear this device" : "Sign out"}</button>
    {confirm ? <section aria-label="Confirm full account data deletion">
      <h3>Delete my data/account?</h3><p>This deletes all account cloud campaigns, saved revisions and evidence, learning history, usage, submitted question flags and feedback. Play and uploads stop. This cannot be undone from this device. Signing out alone keeps your account data.</p>
      <p>Your local copies remain until you choose Clear this device. Other offline devices must be cleared there. The owner completes remaining account administration within seven days.</p>
      <button type="button" disabled={pending} onClick={() => void remove()}>Confirm delete all my account data</button>
      <button type="button" disabled={pending} onClick={() => setConfirm(false)}>Cancel deletion</button>
    </section> : cloud.phase !== "deleted" ? <button type="button" disabled={pending} onClick={() => setConfirm(true)}>{cloud.phase === "deletion-requested" ? "Retry delete my data/account" : "Delete my data/account"}</button> : <p role="status">Account data deletion is confirmed. Account access and uploads are stopped.</p>}
    {error ? <p role="alert">{error}</p> : null}{account.message ? <p role="alert">{account.message}</p> : null}<VersionLabel />
  </details>;
}
