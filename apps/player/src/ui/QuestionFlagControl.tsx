import { useEffect, useRef, useState } from "react";
import { useAuthAccountId } from "../auth/AuthAccountContext";
import { useUsageTracking } from "../playtime/UsageProvider";
import { createHostedQuestionFlag } from "../session/hostedQuestionFlags";
import { useQuestionFlags } from "../session/QuestionFlagProvider";
import type { QuestionReviewFlagInput, SubmitQuestionReviewFlag } from "../session/questionReviewFlags";
import type { ChartDecisionStepView } from "./types";
import "./betaAccount.css";

/** Inline and nonmodal: answering, Pause and chart close remain reachable. */
export function QuestionFlagControl({ step, onSubmit, compact = false }: {
  step: ChartDecisionStepView; onSubmit: SubmitQuestionReviewFlag; compact?: boolean;
}) {
  const accountId = useAuthAccountId();
  const usage = useUsageTracking();
  const queue = useQuestionFlags();
  const [captured, setCaptured] = useState<{ input?: QuestionReviewFlagInput; id: string } | null>(null);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [, redraw] = useState(0);
  useEffect(() => queue?.subscribe(() => redraw((n) => n + 1)), [queue]);
  useEffect(() => {
    if (step.reviewFlagInput && queue) void queue.refreshStatuses();
  }, [queue, step.reviewFlagInput?.clinicalCaseId, step.questionVariantId]);
  const entry = step.reviewFlagInput ? queue?.find(step.reviewFlagInput) : undefined;
  const alreadyFlagged = Boolean(entry || (!accountId && step.flaggedForDeveloperReview));
  const cancel = () => { setCaptured(null); setComment(""); triggerRef.current?.focus(); };
  const submit = async () => {
    if (!captured || submittingRef.current) return;
    submittingRef.current = true; setSubmitting(true); setMessage("");
    try {
      if (accountId) {
        if (!queue || !usage?.canRecordQuestions() || !captured.input) {
          setMessage("Accept the usage notice before sending a flag. If the service is unavailable, try again later.");
          return;
        }
        const payload = await createHostedQuestionFlag(captured.input, accountId, comment);
        if (!usage.canRecordQuestions()) throw new Error("Flag submission stopped");
        // Preserve the old local review/export path, but only explicit new flags upload.
        onSubmit(captured.id, comment, captured.input);
        await queue.submit(payload, captured.input);
        setMessage(""); cancel();
      } else {
        if (captured.input) onSubmit(captured.id, comment, captured.input);
        else if (comment) onSubmit(captured.id, comment);
        else onSubmit(captured.id);
        setMessage("Thanks, flag saved on this device for review."); cancel();
      }
    } catch { setMessage("The flag could not be sent. Try again; you can keep playing."); }
    finally { submittingRef.current = false; setSubmitting(false); }
  };
  const status = entry?.status === "fixed_in_version" ? `fixed${entry.fixedInVersion ? ` in ${entry.fixedInVersion}` : ""}` :
    entry?.status === "no_change" ? "reviewed" : entry?.status === "needs_owner" ? "open — awaiting owner review" : entry?.status;
  return <div className="question-flag-control">
    <button ref={triggerRef} type="button" className={compact ? "cs-flag" : "mobile-question-flag"}
      disabled={alreadyFlagged || submitting} aria-expanded={captured !== null}
      aria-label={alreadyFlagged ? "Question flagged for developer review" : "Flag this question for developer review"}
      title="Flag question for developer review" onClick={() => {
        setCaptured({ id: step.id, ...(step.reviewFlagInput ? { input: structuredClone(step.reviewFlagInput) } : {}) });
        setMessage(""); setComment("");
      }}>{alreadyFlagged ? "Flagged" : compact ? "⚑" : "Flag for review"}</button>
    {captured ? <section className="question-flag-composer" aria-label="Question review comment">
      <label>What should we review? <small>(optional)</small>
        <textarea autoFocus rows={3} maxLength={500} value={comment}
          onChange={(event) => setComment(event.target.value.slice(0, 500))}
          onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); cancel(); } }} />
      </label>
      <small>{comment.length}/500 characters. Please do not enter real patient information.</small>
      {accountId ? <small>This voluntary report sends the question IDs, displayed choice order, your chosen answer and comment to the owner for review.</small> : null}
      <div className="beta-actions">
        <button type="button" disabled={submitting} onClick={() => void submit()}>{submitting ? "Sending…" : "Submit flag"}</button>
        <button type="button" disabled={submitting} onClick={cancel}>Cancel</button>
      </div>
    </section> : null}
    {entry ? <p className="question-flag-receipt" role="status">{entry.delivery === "sent" ? `Thanks, flag sent${status ? ` · ${status}` : ""}` : "Waiting to send. Your flag is queued for up to seven days."}
      {!queue?.storageAvailable ? " Browser storage is unavailable; keep this tab open until it sends." : ""}
      {queue?.dropped ? " Some older flags expired or exceeded the queue limit." : ""}
    </p> : message ? <p className="question-flag-receipt" role="status">{message}</p> : null}
  </div>;
}
