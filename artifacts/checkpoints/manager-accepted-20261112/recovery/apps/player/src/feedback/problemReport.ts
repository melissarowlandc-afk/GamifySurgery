import { problemDiagnostics } from "../diagnostics/problemDiagnostics";
import { createTesterFeedback, type TesterFeedbackSubmission } from "./feedbackTransport";

/** The existing RPC accepts 1,000 chars per immutable feedback row. Keep one
 * report together with a technical header; retries reuse each exact row ID. */
export function createProblemReport(level: number, shell: "phone" | "desktop"): TesterFeedbackSubmission[] {
  const report = problemDiagnostics.report();
  report.current.environment.layout = shell;
  let text = JSON.stringify(report);
  // Reserve most of the existing daily feedback allowance. The current error
  // ring survives; only the bounded prior-session/event tail is abbreviated.
  while (text.length > 8_400 && report.previous?.events.length) { report.previous.events.shift(); text = JSON.stringify(report); }
  while (text.length > 8_400 && report.previous?.lifecycle.length) { report.previous.lifecycle.shift(); text = JSON.stringify(report); }
  while (text.length > 8_400 && report.previous?.errors.length) { report.previous.errors.shift(); text = JSON.stringify(report); }
  while (text.length > 8_400 && report.current.events.length) { report.current.events.shift(); text = JSON.stringify(report); }
  return problemReportSubmissions(text, level, shell);
}

export function problemReportSubmissions(text: string, level: number, shell: "phone" | "desktop"): TesterFeedbackSubmission[] {
  if (text.length > 8_400) throw new Error("Technical report exceeded its budget");
  const id = crypto.randomUUID(), size = 920, count = Math.ceil(text.length / size);
  return Array.from({ length: count }, (_, index) => createTesterFeedback(
    // Both feedback boundaries trim whitespace. The trailer protects a space
    // that happens to be the last character of an interior JSON-string chunk.
    `[GS-PROBLEM/1 ${id} ${index + 1}/${count}]\n${text.slice(index * size, (index + 1) * size)}\n[END]`, level, shell));
}

export function problemReportDeadline<T>(work: Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Problem report transport timed out")), 10_000);
    work.then(value => { clearTimeout(timer); resolve(value); }, error => { clearTimeout(timer); reject(error); });
  });
}
