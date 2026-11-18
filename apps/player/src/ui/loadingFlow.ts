/** Presentation milestones only. None grants command/save authority. */
export const LOADING_PHASE_PROGRESS = {
  boot: 2, auth: 8, access: 20, selection: 28, copies: 40,
  hydrate: 64, journal: 78, engine: 86, art: 92, frame: 98,
} as const;
export type LoadingPhase = keyof typeof LOADING_PHASE_PROGRESS;
export interface LoadingRequest {
  active: boolean;
  status: string;
  phase: LoadingPhase;
  failure?: string | null;
  onRetry?: () => void;
  actionLabel?: string;
  deadlineMs?: number;
  immediate?: boolean;
}
export interface LoadingFlowSnapshot {
  epoch: number; active: boolean; visible: boolean; progress: number;
  phase: LoadingPhase; status: string; failure: string | null; timedOut: boolean;
  selectedId: string | null; canRetry: boolean; actionLabel: string; reportVersion: number;
}
const INITIAL: LoadingFlowSnapshot = { epoch: 0, active: true, visible: true, progress: 2, phase: "boot",
  status: "Getting your clinic ready…", failure: null, timedOut: false, selectedId: null,
  canRetry: false, actionLabel: "Try again", reportVersion: 0 };

/** One opening spans component unmounts, retries and asynchronous render gaps. */
export class LoadingFlow {
  private state: LoadingFlowSnapshot;
  private readonly listeners = new Set<() => void>();
  private readonly requests = new Map<string, LoadingRequest>();
  private readonly resting = new Set<string>();
  private delay: ReturnType<typeof setTimeout> | undefined;
  private deadline: ReturnType<typeof setTimeout> | undefined;
  private completion = 0;
  reportSlot: HTMLElement | null = null;
  constructor(boot = true) { this.state = { ...INITIAL, active: boot, visible: boot }; }
  getSnapshot = () => this.state;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => this.listeners.delete(listener); };
  private publish(patch: Partial<LoadingFlowSnapshot>) {
    if (Object.entries(patch).every(([key, value]) => this.state[key as keyof LoadingFlowSnapshot] === value)) return;
    this.state = { ...this.state, ...patch }; for (const listener of this.listeners) listener();
  }
  begin(phase: LoadingPhase, immediate = true) {
    if (this.state.active) { this.resting.clear(); this.completion++; this.advance(phase); if (immediate) this.publish({ visible: true }); return; }
    this.resting.clear();
    this.publish({ ...INITIAL, epoch: this.state.epoch + 1, phase, progress: LOADING_PHASE_PROGRESS[phase], visible: immediate,
      reportVersion: this.state.reportVersion });
    clearTimeout(this.delay);
    if (!immediate) this.delay = setTimeout(() => this.publish({ visible: this.state.active }), 400);
    this.armDeadline(30_000);
  }
  private armDeadline(ms: number) {
    clearTimeout(this.deadline);
    this.deadline = setTimeout(() => {
      if (this.state.active) this.publish({ timedOut: true, visible: true,
        failure: [...this.requests.values()].find(request => request.failure)?.failure || "This is taking longer than expected. Your saved copies are safe." });
    }, ms);
  }
  advance(phase: LoadingPhase, completed = false) {
    if (!this.state.active) return;
    const floor = LOADING_PHASE_PROGRESS[phase];
    const next = completed ? Math.min(99, floor + (phase === "hydrate" ? 20 : phase === "copies" ? 22 : 5)) : floor;
    if (floor > LOADING_PHASE_PROGRESS[this.state.phase]) {
      this.armDeadline(phase === "copies" || phase === "hydrate" ? 180_000 : 30_000);
      this.publish({ timedOut: false, failure: [...this.requests.values()].find(request => request.failure)?.failure || null });
    }
    this.publish({ progress: Math.max(this.state.progress, next), ...(floor >= LOADING_PHASE_PROGRESS[this.state.phase] ? { phase } : {}) });
  }
  request(id: string, request: LoadingRequest) {
    if (!request.active) { this.remove(id); return; }
    if (!this.state.active) this.begin(request.phase, request.immediate === true);
    this.requests.set(id, request);
    if (this.deadline === undefined && !this.state.timedOut) this.armDeadline(request.deadlineMs ?? 30_000);
    const priorPhase = this.state.phase;
    this.advance(request.phase);
    if (request.immediate) this.publish({ visible: true });
    if (priorPhase !== this.state.phase && request.deadlineMs) this.armDeadline(request.deadlineMs);
    this.select();
  }
  remove(id: string) { this.requests.delete(id); this.select(); this.finishIfResting(); }
  rest(id: string, ready: boolean) {
    if (ready) this.resting.add(id); else this.resting.delete(id);
    this.finishIfResting();
  }
  forgetRest(id: string) { this.resting.delete(id); }
  private finishIfResting() {
    if (!this.state.active || !this.resting.size || this.requests.size) return;
    const ticket = ++this.completion;
    // React cleans up one branch before mounting the next in the same commit.
    // Observe the complete commit, not that temporary zero-request interval.
    queueMicrotask(() => {
      if (ticket !== this.completion || !this.resting.size || this.requests.size || !this.state.active) return;
      clearTimeout(this.delay); clearTimeout(this.deadline);
      this.publish({ active: false, visible: false, progress: 100, failure: null, timedOut: false, selectedId: null, canRetry: false });
    });
  }
  private select() {
    const selected = [...this.requests].sort((a, b) => Number(Boolean(b[1].failure)) - Number(Boolean(a[1].failure)) ||
      LOADING_PHASE_PROGRESS[b[1].phase] - LOADING_PHASE_PROGRESS[a[1].phase])[0];
    if (!selected) { this.publish({ canRetry: false }); return; } // Retain visuals, never a stale recovery callback.
    const [id, request] = selected;
    this.publish({ selectedId: id, status: request.status,
      failure: request.failure || (this.state.timedOut ? this.state.failure : null),
      canRetry: Boolean(request.onRetry), actionLabel: request.actionLabel ?? "Try again" });
  }
  retry = () => {
    const request = this.state.selectedId ? this.requests.get(this.state.selectedId) : null;
    this.publish({ timedOut: false, failure: null }); this.armDeadline(request?.deadlineMs ?? 30_000);
    request?.onRetry?.();
  };
  attachReportSlot(slot: HTMLElement | null) {
    if (this.reportSlot === slot) return;
    this.reportSlot = slot; this.publish({ reportVersion: this.state.reportVersion + 1 });
  }
  dispose() { this.completion++; clearTimeout(this.delay); clearTimeout(this.deadline); this.delay = this.deadline = undefined; }
}

/** Optional metadata/warm-up never advances or delays opening. */
export const ENTRY_LOADING_PHASE: Readonly<Record<string, LoadingPhase>> = {
  "account-access": "access", "shell-prepare": "access", "enrollment-marker": "selection",
  "enrollment-inspect": "selection", "enrollment-prepare": "selection", "enrollment-import": "selection",
  "enrollment-refresh": "selection", "reopen-marker": "selection", "reopen-select": "selection",
  "open-copies": "copies", "open-hydrate": "hydrate", "active-marker": "engine",
};
