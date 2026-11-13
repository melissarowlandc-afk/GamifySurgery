export const PHONE_ENGINE_IDLE_MS = 30_000;

/** A scalar version, never a captured state/snapshot. Busy commands cancel the
 * idle period; a failed durable barrier can only defer release, not force it. */
export class IdleWorkerRelease {
  private key: number | null = null;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private disposed = false;
  constructor(private readonly release: () => Promise<boolean>, private readonly delay = PHONE_ENGINE_IDLE_MS) {}
  update(key: number | null): void {
    if (this.disposed || key === this.key) return;
    this.key = key; clearTimeout(this.timer); this.timer = undefined;
    if (key !== null) this.schedule(key);
  }
  private schedule(key: number): void {
    this.timer = setTimeout(() => {
      this.timer = undefined;
      if (this.disposed || this.key !== key) return;
      void this.release().catch(() => false).then(released => {
        if (!released && !this.disposed && this.key === key && this.timer === undefined) this.schedule(key);
      });
    }, this.delay);
  }
  dispose(): void { this.disposed = true; clearTimeout(this.timer); this.timer = undefined; this.key = null; }
}
