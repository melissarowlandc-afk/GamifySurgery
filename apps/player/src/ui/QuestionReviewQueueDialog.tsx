import { useEffect, useMemo, useRef, useState } from "react";
import {
  createQuestionReviewExport,
  type QuestionReviewFlag,
  type QuestionReviewFlagStatus,
} from "../session/questionReviewFlags";

interface QuestionReviewQueueDialogProps {
  flags: readonly QuestionReviewFlag[];
  paused: boolean;
  onTogglePause: () => void;
  onStatusChange: (
    flagId: string,
    status: QuestionReviewFlagStatus,
  ) => void;
  onOpenChange?: (open: boolean) => void;
}

function exportFlags(flags: readonly QuestionReviewFlag[]) {
  const payload = createQuestionReviewExport(flags);
  const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], {
    type: "application/json",
  });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = `stitchin-time-question-flags-${new Date()
    .toISOString()
    .slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(href);
}

export function QuestionReviewQueueDialog({
  flags,
  paused,
  onTogglePause,
  onStatusChange,
  onOpenChange,
}: QuestionReviewQueueDialogProps) {
  const [open, setOpen] = useState(false);
  const [resumeAfterClose, setResumeAfterClose] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const openCount = flags.filter((flag) => flag.status === "open").length;
  const orderedFlags = useMemo(
    () =>
      [...flags].sort(
        (left, right) =>
          Number(left.status === "reviewed") -
            Number(right.status === "reviewed") ||
          right.lastFlaggedAtRealMs - left.lastFlaggedAtRealMs,
      ),
    [flags],
  );

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
        className="text-button question-review-queue-trigger"
        type="button"
        onClick={openDialog}
      >
        Question flags ({openCount})
      </button>
      <dialog
        ref={dialogRef}
        className="confirm-dialog question-review-dialog"
        aria-labelledby="question-review-title"
        onCancel={(event) => {
          event.preventDefault();
          closeDialog();
        }}
      >
        <div className="question-review-dialog-heading">
          <div>
            <span className="eyebrow">Developer tool</span>
            <h2
              id="question-review-title"
              ref={headingRef}
              tabIndex={-1}
            >
              Question review queue
            </h2>
          </div>
          <span>
            {openCount} open / {flags.length} total
          </span>
        </div>
        <p>
          This queue is stored in this browser. Export it before changing
          computers or clearing site data.
        </p>
        <div className="question-review-list">
          {orderedFlags.length === 0 ? (
            <p className="empty-state">No questions have been flagged here.</p>
          ) : (
            orderedFlags.map((flag) => (
              <article
                className={`question-review-item is-${flag.status}`}
                key={flag.id}
              >
                <header>
                  <div>
                    <span>{flag.status}</span>
                    <code>{flag.questionVariantId}</code>
                  </div>
                  <strong>
                    {flag.occurrenceCount} flag
                    {flag.occurrenceCount === 1 ? "" : "s"}
                  </strong>
                </header>
                <p>{flag.stem}</p>
                <ol>
                  {flag.answerChoices.map((choice) => (
                    <li key={choice.id}>
                      <span>{choice.label}</span>
                      {choice.isCorrect ? <strong>Keyed answer</strong> : null}
                    </li>
                  ))}
                </ol>
                <details>
                  <summary>Frozen context and provenance</summary>
                  <dl>
                    <div>
                      <dt>Concept</dt>
                      <dd>
                        <code>{flag.primaryConceptId}</code>
                      </dd>
                    </div>
                    <div>
                      <dt>Case</dt>
                      <dd>
                        {flag.clinicalCaseDisplayName}{" "}
                        <code>{flag.clinicalCaseId}</code>
                      </dd>
                    </div>
                    <div>
                      <dt>Presentation</dt>
                      <dd>{flag.patientPresentation}</dd>
                    </div>
                    <div>
                      <dt>Explanation</dt>
                      <dd>{flag.explanation}</dd>
                    </div>
                    <div>
                      <dt>Release</dt>
                      <dd>
                        <code>{flag.clinicalReleaseId}</code>
                      </dd>
                    </div>
                  </dl>
                </details>
                <div className="question-review-item-actions">
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={() =>
                      onStatusChange(
                        flag.id,
                        flag.status === "open" ? "reviewed" : "open",
                      )
                    }
                  >
                    {flag.status === "open"
                      ? "Mark reviewed"
                      : "Return to queue"}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
        <div className="dialog-actions">
          <button
            className="button button-secondary"
            type="button"
            onClick={() => exportFlags(flags)}
            disabled={flags.length === 0}
          >
            Export JSON
          </button>
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
