export const PHONE_ACTIVE_FPS = 30;
export const PHONE_IDLE_FPS = 1;
interface PhoneGame {
  isPaused: boolean;
  resume(): void;
  loop: { running: boolean; setFPSLimit(limit: number): unknown; sleep(): void; wake(): void };
}
interface Presentation { hidden: boolean; paused: boolean; model: object }
interface Timer { set(work: () => void, ms: number): ReturnType<typeof setTimeout>; clear(id: ReturnType<typeof setTimeout>): void }
const shallowSame = (a: object, b: object) => {
  const keys = Object.keys(a); return keys.length === Object.keys(b).length && keys.every(key =>
    Object.is((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]));
};

/** Presentation clock only. One paused heartbeat preserves loader/input and
 * watchdog recovery; input/new visuals get an immediate 30fps burst. Covered
 * and hidden maps stop rAF entirely. Simulation/save clocks are independent. */
export class PhoneFrameBudget {
  private ready = false;
  private disposed = false;
  private limit = PHONE_ACTIVE_FPS;
  private activeUntil = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private model: object | null = null;
  constructor(private readonly game: PhoneGame, private readonly read: () => Presentation,
    private readonly now = Date.now, private readonly timers: Timer = {
      set: (work, ms) => setTimeout(work, ms), clear: id => clearTimeout(id),
    }) {}
  frame = (): void => {
    if (this.ready) return;
    this.ready = true;
    // setFPSLimit restarts Phaser's rAF. Do it after its current callback has
    // returned, so that callback cannot schedule a second rAF chain.
    queueMicrotask(() => this.reconcile());
  };
  update(): void {
    const next = this.read();
    if (this.model && !shallowSame(this.model, next.model)) this.interact();
    this.model = next.model; this.reconcile();
  }
  interact = (): void => {
    if (this.disposed || this.read().hidden) return;
    this.activeUntil = this.now() + 1_600;
    if (this.timer === null) this.scheduleQuiet();
    this.reconcile();
  };
  private scheduleQuiet(): void {
    this.timer = this.timers.set(() => {
      this.timer = null;
      if (this.activeUntil > this.now() && !this.disposed) this.scheduleQuiet();
      else this.reconcile();
    }, Math.max(1, this.activeUntil - this.now()));
  }
  private reconcile(): void {
    if (!this.ready || this.disposed) return;
    const state = this.read();
    if (state.hidden) {
      this.game.loop.sleep(); this.activeUntil = 0;
      if (this.timer !== null) { this.timers.clear(this.timer); this.timer = null; }
      return;
    }
    const limit = !state.paused || this.activeUntil > this.now() ? PHONE_ACTIVE_FPS : PHONE_IDLE_FPS;
    if (limit !== this.limit) { this.limit = limit; this.game.loop.setFPSLimit(limit); }
    if (this.game.isPaused) this.game.resume();
    if (!this.game.loop.running) this.game.loop.wake();
  }
  dispose(): void {
    this.disposed = true;
    if (this.timer !== null) { this.timers.clear(this.timer); this.timer = null; }
  }
}
