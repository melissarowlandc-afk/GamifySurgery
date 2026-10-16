import { useEffect, useRef, useState } from "react";
import "./HelpDialog.css";
import { AccountMenu } from "./AccountMenu";
import { VersionLabel } from "../appVersion";
import { ClinicalContentNotice } from "./ClinicalContentNotice";

interface HelpDialogProps {
  paused: boolean;
  onTogglePause: () => void;
  onOpenChange?: (open: boolean) => void;
  onShowGuidance?: () => void;
  onReplayFirstShift?: () => void;
}

export const HELP_TOPICS = [
  { id: "patients", title: "Find a patient", body: "Waiting holds new charts. Existing Patients holds unfinished and pending visits. Resolved holds filed charts. An exclamation point means a decision needs you. Open the patient tab to work." },
  { id: "charts", title: "Finish a chart", body: "Read the presentation, choose an answer and review the feedback. Enact Plan or Enact Corrected Plan starts the next step. Resolve Completed Chart or Dismiss and close chart files a finished visit. Money funds the clinic; XP tracks progress. More Disease Information and earlier decisions are optional reference.", controls: "1–9 selects an answer. Enter enacts the visible primary action. Escape closes the chart; displayed feedback is dismissed through the same guarded action." },
  { id: "time", title: "Time & waiting", body: "The chart clock keeps running. Pause whenever you need reading time; Resume lets travel and care continue. 2× and 4× run the clinic faster. Build, Management and Help pause while open. Test choices show estimates; the patient must finish care, return and check in before the next decision. The chart remains in Existing Patients.", controls: "Clinic time runs from 8 AM to 6 PM. Learning reviews use their own schedule; a quiet folder can mean pending work or no eligible arrival. Needs you lists live problems; Around the clinic supplies occasional tips and commentary. Tips never pause the clinic." },
  { id: "build", title: "Build & access", body: "Select a room card, then place beside reachable space. Rooms connect through doors on shared walls, or through hallways. Select Doors and click an eligible wall. NO ACCESS means the room needs a reachable connection. Done / Save lists problems that still block exit.", controls: "R rotates placement. Escape cancels it. Click a built room to move, upgrade or sell it. Undo names the change it reverses. Click an existing door with Doors to remove it." },
  { id: "goals", title: "Goals", body: "The Goals panel gives the current requirements and the Advance button. Finish both introductory visits and connect an Examination Room to graduate. Mistakes still count as completed visits. Later goals include the displayed XP, satisfaction, rooms, staff and services. Advance is always your choice." },
  { id: "saves", title: "Save & campaigns", body: "Campaigns keep separate clinics, money and learning histories. Save & Close saves and pauses the current clinic. Resume or restore keeps that clinic's history. New Campaign creates another clinic; Restart archives the current one. Replay first shift creates a separately named ordinary clinic and leaves this one saved.", controls: "Browser saves belong to the exact origin and browser profile. The local owner game is START_GAME.cmd → http://127.0.0.1:4173. Other hosts, ports, profiles and the remote site have separate saves." },
] as const;

export function HelpReferenceTopic({topic}: {topic: typeof HELP_TOPICS[number]}) {
  return <section className="help-topic-detail" aria-label={topic.title}>
    <h3>{topic.title}</h3><p>{topic.body}</p>
    {"controls" in topic ? <p>{topic.controls}</p> : null}
  </section>;
}

export function HelpDialog({paused, onTogglePause, onOpenChange, onShowGuidance, onReplayFirstShift}: HelpDialogProps) {
  const [open, setOpen] = useState(false);
  const [topicId, setTopicId] = useState<string | null>(null);
  const resumeAfterCloseRef = useRef(false);
  const helpButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const topic = HELP_TOPICS.find((item) => item.id === topicId);

  const openDialog = () => {
    resumeAfterCloseRef.current = !paused;
    onOpenChange?.(true);
    if (!paused) onTogglePause();
    setTopicId(null);
    setOpen(true);
  };
  const closeDialog = () => {
    if (dialogRef.current?.open) dialogRef.current.close();
    setOpen(false);
    if (resumeAfterCloseRef.current) onTogglePause();
    resumeAfterCloseRef.current = false;
    onOpenChange?.(false);
    helpButtonRef.current?.focus();
  };
  useEffect(() => {
    if (!open) return;
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
    headingRef.current?.focus();
  }, [open, topicId]);

  return <>
    <button ref={helpButtonRef} className="text-button help-button" type="button" onClick={openDialog}>Help</button>
    <dialog ref={dialogRef} className="confirm-dialog help-dialog" aria-labelledby="help-title" aria-modal={open ? true : undefined} onCancel={(event) => {event.preventDefault(); closeDialog();}}>
      <span className="eyebrow">Clinic reference</span>
      <h2 id="help-title" ref={headingRef} tabIndex={-1}>How this clinic works</h2>
      <p className="help-pause-note">The facility is paused while Help is open.</p>
      <ClinicalContentNotice />
      <AccountMenu />
      <VersionLabel />
      {topic ? <><HelpReferenceTopic topic={topic} /><button className="text-button" type="button" onClick={() => setTopicId(null)}>All topics</button></>
        : <nav className="help-topic-list" aria-label="Help topics">{HELP_TOPICS.map((item) =>
          <button className="button button-secondary" type="button" key={item.id} onClick={() => setTopicId(item.id)}>{item.title}</button>)}</nav>}
      <div className="help-guidance-actions">
        {onShowGuidance ? <button className="text-button" type="button" onClick={() => {closeDialog(); onShowGuidance();}}>Show guidance here</button> : null}
        {onReplayFirstShift ? <><button className="text-button" type="button" onClick={() => {closeDialog(); onReplayFirstShift();}}>Replay first shift in a new clinic</button><p>Your current clinic stays saved.</p></> : null}
      </div>
      <div className="dialog-actions"><button className="button button-primary" type="button" onClick={closeDialog}>Return to clinic</button></div>
    </dialog>
  </>;
}
