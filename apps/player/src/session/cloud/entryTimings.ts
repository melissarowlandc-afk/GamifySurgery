import { problemDiagnostics } from "../../diagnostics/problemDiagnostics";

const observers = new Set<(stage: string, complete: boolean) => void>();
export function subscribeEntryWork(observer: (stage: string, complete: boolean) => void) {
  observers.add(observer); return () => { observers.delete(observer); };
}
function observe(stage: string, complete: boolean) {
  for (const observer of observers) { try { observer(stage, complete); } catch { /* Presentation cannot change work or safety. */ } }
}

/** Technical stage names only. No campaign IDs, names, bytes or wall-clock ordering. */
export class EntryWorkTimings {
  private readonly rows = new Map<string, { count: number; ms: number }>();
  private readonly pending = new Map<number, { stage: string; started: number }>();
  private sequence = 0;
  private lastMs = 0;
  constructor(private readonly now = () => performance.now()) {}
  async measure<T>(stage: string, work: () => Promise<T>): Promise<T> {
    const id = ++this.sequence, started = this.now();
    this.pending.set(id, { stage, started });
    observe(stage, false);
    let complete = false;
    try { const value = await work(); complete = true; return value; }
    finally {
      this.pending.delete(id); this.lastMs = Math.max(0, Math.round(this.now() - started));
      const prior = this.rows.get(stage);
      this.rows.delete(stage); this.rows.set(stage, { count: (prior?.count ?? 0) + 1, ms: (prior?.ms ?? 0) + this.lastMs });
      if (this.rows.size > 12) this.rows.delete(this.rows.keys().next().value!);
      observe(stage, complete);
    }
  }
  get health() { return { pending: this.pending.size, lastMs: this.lastMs,
    operations: [...this.pending.values()].slice(0, 6).map(row => [row.stage, Math.max(0, Math.round(this.now() - row.started))]),
    timings: [...this.rows].map(([stage, row]) => [stage, row.count, row.ms]) }; }
}
export const cloudEntryTimings = new EntryWorkTimings();
problemDiagnostics.source("entryWork", () => cloudEntryTimings.health);
export const timeCloudEntry = <T>(stage: string, work: () => Promise<T>): Promise<T> => cloudEntryTimings.measure(stage, work);
