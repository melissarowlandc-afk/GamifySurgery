import { useState } from "react";

interface RestartDialogProps {
  paused: boolean;
  onTogglePause: () => void;
  onRestart: () => void;
  triggerLabel?: string;
  triggerClassName?: string;
}

export function RestartDialog({
  paused,
  onTogglePause,
  onRestart,
  triggerLabel = "Start over",
  triggerClassName = "text-button",
}: RestartDialogProps) {
  const [open, setOpen] = useState(false);
  const [resumeAfterCancel, setResumeAfterCancel] = useState(false);

  const openDialog = () => {
    const wasRunning = !paused;
    setResumeAfterCancel(wasRunning);
    if (wasRunning) {
      onTogglePause();
    }
    setOpen(true);
  };

  const cancelDialog = () => {
    setOpen(false);
    if (resumeAfterCancel) {
      onTogglePause();
    }
    setResumeAfterCancel(false);
  };

  return (
    <>
      <button
        className={triggerClassName}
        type="button"
        onClick={openDialog}
      >
        {triggerLabel}
      </button>
      {open ? (
        <div className="dialog-backdrop" role="presentation">
          <section
            className="confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="restart-title"
          >
            <span className="eyebrow">Confirmation required</span>
            <h2 id="restart-title">Restart this local prototype?</h2>
            <p>
              This creates a new clinic with fresh FSRS histories and returns
              to the beginning. Your current campaign remains available in
              the Campaigns list. It does not affect GitHub or project files.
            </p>
            <div className="dialog-actions">
              <button
                className="button button-secondary"
                type="button"
                onClick={cancelDialog}
              >
                Keep playing
              </button>
              <button
                className="button button-danger"
                type="button"
                onClick={() => {
                  setOpen(false);
                  setResumeAfterCancel(false);
                  onRestart();
                }}
              >
                Confirm fresh start
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
