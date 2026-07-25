import { useEffect, useRef, useState } from "react";

interface SaveCloseDialogProps {
  onSaveAndPause: () => boolean;
}

/**
 * Browsers cannot reliably close a tab they did not open. This control makes
 * the save boundary explicit, pauses the simulation, and confirms that the
 * player may close the tab without losing the current local campaign.
 */
export function SaveCloseDialog({
  onSaveAndPause,
}: SaveCloseDialogProps) {
  const [open, setOpen] = useState(false);
  const [saveSucceeded, setSaveSucceeded] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const saveAndOpen = () => {
    setSaveSucceeded(onSaveAndPause());
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
          {saveSucceeded ? "Campaign saved" : "Save failed"}
        </span>
        <h2 id="save-close-title" ref={headingRef} tabIndex={-1}>
          {saveSucceeded
            ? "Safe to close this tab"
            : "Keep this tab open"}
        </h2>
        <p>
          {saveSucceeded
            ? "Your clinic is saved and paused. Close this browser tab or window whenever you are ready."
            : "The clinic is paused, but the latest save did not succeed. Keep this tab open and try Save & Close again."}
        </p>
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
