import { useEffect, useRef, useState } from "react";

interface HelpDialogProps {
  paused: boolean;
  onTogglePause: () => void;
  onOpenChange?: (open: boolean) => void;
}

const HELP_STEPS = [
  [
    "Patient folders",
    "New charts begin in Waiting. Opened or pending charts stay in Active. Finished charts move to Resolved.",
  ],
  [
    "Action marker (!)",
    "An exclamation point means that chart needs your decision now.",
  ],
  [
    "Clinical answers",
    "Choose one multiple-choice answer. Each scored decision updates exactly one concept in this campaign.",
  ],
  [
    "Pending results",
    "Close the chart while a result is pending. Return when its exclamation point appears.",
  ],
  [
    "Feedback and filing",
    "Read corrective feedback, acknowledge any final outcome, optionally flip the chart for its summary, then file it in Resolved.",
  ],
  [
    "Construction",
    "Choose an affordable room, then tap or click a clear footprint on the facility grid.",
  ],
  [
    "Level Up",
    "Complete every displayed XP, patient, satisfaction, room, and staff goal; then use the Level Up button.",
  ],
  [
    "Pause",
    "Pause at any time. A hidden browser tab also pauses and requires you to resume.",
  ],
  [
    "Campaigns and Start over",
    "Campaigns keep separate facilities and FSRS histories. Start over creates a fresh campaign and keeps the previous one available.",
  ],
  [
    "Prototype tools",
    "Use fast-forward and FSRS inspection for balance testing. Tutorial guidance can also be turned on or off there.",
  ],
] as const;

export function HelpDialog({
  paused,
  onTogglePause,
  onOpenChange,
}: HelpDialogProps) {
  const [open, setOpen] = useState(false);
  const [resumeAfterClose, setResumeAfterClose] = useState(false);
  const helpButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const openDialog = () => {
    const wasRunning = !paused;
    setResumeAfterClose(wasRunning);
    if (wasRunning) {
      onTogglePause();
    }
    setOpen(true);
    onOpenChange?.(true);
  };

  const closeDialog = () => {
    if (dialogRef.current?.open) {
      dialogRef.current.close();
    }
    setOpen(false);
    onOpenChange?.(false);
    if (resumeAfterClose) {
      onTogglePause();
    }
    setResumeAfterClose(false);
    helpButtonRef.current?.focus();
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
        ref={helpButtonRef}
        className="text-button help-button"
        type="button"
        onClick={openDialog}
      >
        Help
      </button>
      <dialog
        ref={dialogRef}
        className="confirm-dialog help-dialog"
        aria-labelledby="help-title"
        onCancel={(event) => {
          event.preventDefault();
          closeDialog();
        }}
      >
        <span className="eyebrow">Beginner guide</span>
        <h2 id="help-title" ref={headingRef} tabIndex={-1}>
          How this clinic works
        </h2>
        <p className="help-pause-note">
          The facility is paused while Help is open.
        </p>
        <ol className="help-step-list">
          {HELP_STEPS.map(([title, body]) => (
            <li key={title}>
              <strong>{title}</strong>
              <span>{body}</span>
            </li>
          ))}
        </ol>
        <div className="dialog-actions">
          <button
            className="button button-primary"
            type="button"
            onClick={closeDialog}
          >
            Return to clinic
          </button>
        </div>
      </dialog>
    </>
  );
}
