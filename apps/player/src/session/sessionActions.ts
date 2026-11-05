import { OrderedSessionWork } from "./cloud/orderedSessionWork";

export type SessionActionResult<T> = T | Promise<T>;
export function mapSessionAction<T, R>(value: SessionActionResult<T>, next: (value: T) => R): SessionActionResult<R> {
  return value instanceof Promise ? value.then(next) : next(value);
}
// A generator expresses dependent steps without changing the local synchronous
// API. Hosted steps await actual receipts; local steps finish in this call.
export type SessionActionSteps<T> = Generator<unknown, T, any>;
export type SessionAction<A extends unknown[], T> = ((...args: A) => SessionActionResult<T>) & {
  steps(...args: A): SessionActionSteps<T>;
};
function drive<T>(steps: SessionActionSteps<T>, value?: unknown, failed = false): SessionActionResult<T> {
  let step = failed ? steps.throw(value) : steps.next(value);
  while (!step.done) {
    if (step.value && typeof (step.value as Promise<unknown>).then === "function") {
      return Promise.resolve(step.value).then(value => drive(steps, value), error => drive(steps, error, true));
    }
    step = steps.next(step.value);
  }
  return step.value;
}

/** Whole player actions, including dependent chart-close/build/undo steps,
 * retain invocation order. Nested steps use yield* action.steps(), so they stay
 * inside the same action rather than queueing behind themselves.
 */
export class SessionActions {
  private readonly ordered = new OrderedSessionWork();
  private frozen = false;
  private active = false;
  private skipped = 0;
  constructor(private readonly hosted: boolean) {}
  get pending(): boolean { return this.ordered.pending > 0; }
  get activeAccepted(): boolean { return this.active; }
  get skippedClockPulses(): number { return this.skipped; }
  pauseAdmissions(): void { this.frozen = true; }
  resumeAdmissions(): void { this.frozen = false; }
  action<A extends unknown[], T>(steps: (...args: A) => SessionActionSteps<T>): SessionAction<A, T> {
    const run = (...args: A): SessionActionResult<T> => {
      if (!this.hosted) return drive(steps(...args));
      const accepted = !this.frozen;
      return this.ordered.run(async () => {
        this.active = accepted;
        try { return await drive(steps(...args)); } finally { this.active = false; }
      });
    };
    return Object.assign(run, { steps });
  }
  /** No catch-up: a busy pulse is never admitted as a command. */
  tick(advance: () => SessionActionResult<unknown>): void {
    if (this.pending || this.frozen) { this.skipped++; return; }
    if (!this.hosted) { advance(); return; }
    void this.ordered.run(() => this.frozen ? undefined : advance()).catch(() => {});
  }
  settled(): Promise<void> { return this.ordered.settled(); }
}
