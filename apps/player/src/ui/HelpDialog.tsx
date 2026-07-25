import { useEffect, useRef, useState } from "react";

interface HelpDialogProps {
  paused: boolean;
  onTogglePause: () => void;
  onOpenChange?: (open: boolean) => void;
}

const HELP_STEPS = [
  [
    "Patient folders",
    "New charts arrive as tabs in Waiting. Open a tab to pull out its chart. Opened or pending charts stay in Existing Patients; finished charts go into the Resolved filing cabinet.",
  ],
  [
    "Action marker (!)",
    "An exclamation point means a patient has arrived or returned and needs your decision.",
  ],
  [
    "Chart decisions",
    "Read from left to right: patient, presentation, then the current multiple-choice decision. Each scored decision updates exactly one learning concept in this campaign.",
  ],
  [
    "Tests and results",
    "A test choice shows its facility-hour turnaround. The chart slides into Existing Patients while the patient travels for the test, then shows ! when the patient returns.",
  ],
  [
    "Completion and rewards",
    "After the final decision, review the money and Learning XP earned. Flip the whole chart for the brief topic summary, then Resolve it.",
  ],
  [
    "Build Mode",
    "Use the Enter Build Mode button to pause the clinic. The same button becomes Exit Build Mode. Select a room or hallway, follow its visible outline and door marker, rotate it, and place it only when the map says it is connected.",
  ],
  [
    "Rooms and hallways",
    "A room works only when its door has a hallway path back to the Front Desk. Patients and employees visibly walk these routes, so layout affects task time.",
  ],
  [
    "Employees",
    "Unlocked roles appear on the right. Each employee has a name, salary, and morale. Staffing and connected rooms determine which on-site services can operate.",
  ],
  [
    "Level Up",
    "The always-visible Goals panel is the source of truth. Complete every displayed XP, patient, satisfaction, room, and staff goal, then select Advance to Level in that panel.",
  ],
  [
    "Time and alerts",
    "A clinic day runs from 8 AM to 6 PM. Pause at any time and read the message board for patient needs, employee feelings, results, and occasional clinic jokes.",
  ],
  [
    "Campaigns and Start over",
    "Campaigns keep separate facilities and FSRS histories. Start over creates a fresh campaign and keeps the previous one available.",
  ],
  [
    "Prototype tools",
    "Use Add $100, fast-forward, restart, and FSRS inspection for balance testing. Tutorial guidance can also be turned on or off there.",
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
