import { useEffect, useMemo, useRef, useState } from "react";
import { useAuthAccountId } from "../auth/AuthAccountContext";
import { hostedAuthConfiguration } from "../auth/prototypeAuth";
import { getSupabaseAuthClient } from "../auth/supabaseAuth";
import { useUsageTracking } from "../playtime/UsageProvider";
import { createTesterFeedback, createTesterFeedbackTransport, MAX_FEEDBACK_LENGTH,
  type TesterFeedbackSubmission, type TesterFeedbackTransport } from "./feedbackTransport";
import "../ui/betaAccount.css";

/** Local prototypes create no transport and make no feedback requests. */
export function useTesterFeedback(): TesterFeedbackTransport | null {
  const accountId = useAuthAccountId();
  return useMemo(() => {
    if (!accountId) return null;
    const configuration = hostedAuthConfiguration();
    if (!configuration) return null;
    const client = getSupabaseAuthClient(configuration);
    return client ? createTesterFeedbackTransport(client, accountId) : null;
  }, [accountId]);
}

export function TesterFeedbackForm({ transport, level, shell, onCancel }: {
  transport: TesterFeedbackTransport; level: number; shell: TesterFeedbackSubmission["shell"]; onCancel: () => void;
}) {
  const usage = useUsageTracking();
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [, redraw] = useState(0);
  const pending = useRef(false);
  const submission = useRef<TesterFeedbackSubmission | null>(null);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => usage?.subscribe(() => redraw(n => n + 1)), [usage]);
  const stopped = () => Boolean(usage && (["deleted", "blocked"].includes(usage.status().state) || usage.outbox.deletionRequested()));
  const send = async () => {
    if (pending.current || stopped() || !comment.trim()) return;
    pending.current = true; setSending(true); setError("");
    try {
      // Freeze the context and identity on the first attempt. Retrying unchanged
      // text cannot create a duplicate after an acknowledgement was lost.
      submission.current ??= createTesterFeedback(comment, level, shell);
      await transport.send(submission.current);
      if (mounted.current && !stopped()) { setSent(true); setComment(""); }
    } catch {
      if (mounted.current) setError("Could not send your feedback. Your text is still here; please try Send again when you are online or later if the service is busy.");
    } finally {
      pending.current = false;
      if (mounted.current) setSending(false);
    }
  };
  if (sent) return <div className="tester-feedback-form">
    <p role="status">Sent - thank you</p>
    <button type="button" onClick={onCancel}>Close</button>
  </div>;
  return <form className="tester-feedback-form" onSubmit={event => { event.preventDefault(); void send(); }}>
    <label>Comment
      <textarea autoFocus rows={4} maxLength={MAX_FEEDBACK_LENGTH} disabled={sending} value={comment}
        onKeyDown={event => { if (event.key === "Escape" && !sending) { event.preventDefault(); event.stopPropagation(); onCancel(); } }}
        onChange={event => { setComment(event.target.value.slice(0, MAX_FEEDBACK_LENGTH)); submission.current = null; }} />
    </label>
    <small>{comment.length}/{MAX_FEEDBACK_LENGTH} characters</small>
    <p>Comments go to the game owner. We store your comment with the game version, level, desktop or phone layout, and time. Please do not enter real patient information.</p>
    {stopped() ? <p role="status">Feedback is off for this account after a deletion request or access change.</p> : null}
    {error ? <p role="alert">{error}</p> : null}
    <div className="beta-actions">
      <button type="submit" disabled={sending || stopped() || !comment.trim()}>{sending ? "Sending…" : "Send"}</button>
      <button type="button" disabled={sending} onClick={onCancel}>Cancel</button>
    </div>
  </form>;
}

/** Desktop footer menu: a small composer without changing the game clock. */
export function TesterFeedbackMenu({ level }: { level: number }) {
  const transport = useTesterFeedback();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  if (!transport) return null;
  const close = () => { setOpen(false); trigger.current?.focus(); };
  return <div className="tester-feedback-menu">
    <button ref={trigger} type="button" className="text-button" aria-expanded={open} onClick={() => setOpen(true)}>Send feedback</button>
    {open ? <section className="tester-feedback-popover" role="dialog" aria-label="Send feedback">
      <h2>Send feedback</h2>
      <TesterFeedbackForm transport={transport} level={level} shell="desktop" onCancel={close} />
    </section> : null}
  </div>;
}
