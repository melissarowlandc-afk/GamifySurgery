import { useEffect, useRef, useState } from "react";
import type { PrototypeSaveResult } from "../session/prototypeStorage";

interface SaveCloseDialogProps {
  onSaveAndPause: () => PrototypeSaveResult;
  onClearLocalCampaigns: () => boolean;
}

/**
 * Browsers cannot reliably close a tab they did not open. This control makes
 * the save boundary explicit, pauses the simulation, and confirms that the
 * player may close the tab without losing the current local campaign.
 */
export function SaveCloseDialog({
  onSaveAndPause,
  onClearLocalCampaigns,
}: SaveCloseDialogProps) {
  const [open, setOpen] = useState(false);
  const [saveResult, setSaveResult] = useState<PrototypeSaveResult>({
    ok: true,
    profileCharacters: 0,
  });
  const [confirmClear, setConfirmClear] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const saveAndOpen = () => {
    setSaveResult(onSaveAndPause());
    setConfirmClear(false);
    setOpen(true);
  };

  const closeNotice = () => {
    if (dialogRef.current?.open) {
      dialogRef.current.close();
    }
    setOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
    headingRef.current?.focus();
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        className="button button-secondary save-close-button"
        type="button"
        onClick={saveAndOpen}
      >
        Save &amp; Close
      </button>
      <dialog
        ref={dialogRef}
        className="confirm-dialog save-close-dialog"
        aria-labelledby="save-close-title"
        onCancel={(event) => {
          event.preventDefault();
          closeNotice();
        }}
      >
        <span className="eyebrow">
          {saveResult.ok ? "Campaign saved" : "Save failed"}
        </span>
        <h2 id="save-close-title" ref={headingRef} tabIndex={-1}>
          {saveResult.ok
            ? "Safe to close this tab"
            : "Keep this tab open"}
        </h2>
        {saveResult.ok ? (
          <p>
            Your clinic is saved and paused. Close this browser tab or window
            whenever you are ready.
          </p>
        ) : null}
        {!saveResult.ok ? (
          <SaveFailureRecovery
            result={saveResult}
            confirmClear={confirmClear}
            onConfirmClear={() => onClearLocalCampaigns()}
            onRequestClear={() => setConfirmClear(true)}
            onCancelClear={() => setConfirmClear(false)}
          />
        ) : null}
        <div className="dialog-actions">
          <button
            className="button button-secondary"
            type="button"
            onClick={closeNotice}
          >
            Return to paused clinic
          </button>
        </div>
      </dialog>
    </>
  );
}

export function SaveFailureRecovery({
  result,
  confirmClear,
  onConfirmClear,
  onRequestClear,
  onCancelClear,
}: {
  result: Exclude<PrototypeSaveResult, { ok: true }>;
  confirmClear: boolean;
  onConfirmClear: () => void;
  onRequestClear: () => void;
  onCancelClear: () => void;
}) {
  return (
    <section className="save-reset-recovery" aria-label="Save recovery">
      <p>{failureExplanation(result)} Keep this tab open and try Save &amp; Close again.</p>
      <p>
        If you do not need any campaigns stored in this browser, you can clear
        only local campaign data and start over. Your other site preferences
        will stay intact.
      </p>
      {confirmClear ? (
        <div className="dialog-actions">
          <button className="button button-danger" type="button" onClick={onConfirmClear}>
            Yes, clear all local campaigns
          </button>
          <button className="button button-secondary" type="button" onClick={onCancelClear}>
            Cancel
          </button>
        </div>
      ) : (
        <button className="button button-secondary" type="button" onClick={onRequestClear}>
          Clear local campaigns…
        </button>
      )}
    </section>
  );
}

function failureExplanation(result: Exclude<PrototypeSaveResult, { ok: true }>): string {
  switch (result.failure.category) {
    case "quota":
      return "Browser storage is full.";
    case "security":
      return "This browser blocked local storage access.";
    case "not_allowed":
      return "This browser does not allow this site to save data.";
    case "unavailable":
      return "Local storage is unavailable in this browser session.";
    case "serialization":
      return "The campaign could not be prepared for saving.";
    case "validation":
      return "The campaign data could not be validated for saving.";
    default:
      return "The browser rejected this save.";
  }
}
