export const PHONE_BITMAP_DEADLINE_MS = 12_000;
export const PHONE_BITMAP_DECODE_DEADLINE_MS = 1_500;
export const PHONE_ART_CHARACTER = -1;
export const PHONE_ART_VISIBLE = 0;
export const PHONE_ART_BACKGROUND = 1;

interface DecodeJob {
  priority: number;
  run(): void;
  finish(image: HTMLImageElement | null, timedOut?: boolean): void;
}

/** Four sources in flight, including raster decode. Priority only changes the
 * waiting order; every eighth start serves the oldest job to prevent starvation.
 * The deadline starts at enqueue, so a hung decoder cannot strand the tail. */
export class BitmapDecodeQueue {
  private active = 0;
  private waiting: DecodeJob[] = [];
  private preferredStarts = 0;
  private timeouts = 0;
  private draining = false;

  get health() { return { activeDecodes: this.active, queuedDecodes: this.waiting.length, decodeTimeouts: this.timeouts }; }

  load(createImage: () => HTMLImageElement, url: string, priority: number) {
    let job!: DecodeJob;
    const promise = new Promise<HTMLImageElement | null>(resolve => {
      let done = false, started = false, image: HTMLImageElement | undefined;
      let decodeTimer: ReturnType<typeof setTimeout> | undefined;
      const deadline = setTimeout(() => job.finish(null, true), PHONE_BITMAP_DEADLINE_MS);
      job = {
        priority,
        finish: (value, timedOut = false) => {
          if (done) return;
          done = true; clearTimeout(deadline); clearTimeout(decodeTimer);
          if (timedOut) this.timeouts++;
          if (image) {
            image.onload = null; image.onerror = null;
            // Abandon a dead request/decoder. Late events cannot release twice.
            if (!value) { try { image.src = ""; } catch { /* Unavailable browser image. */ } }
          }
          if (started) this.active--;
          else { const index = this.waiting.indexOf(job); if (index >= 0) this.waiting.splice(index, 1); }
          resolve(value); this.drain();
        },
        run: () => {
          started = true; this.active++;
          try {
            image = createImage(); const source = image;
            source.decoding = "async";
            source.onload = () => {
              source.onload = null; source.onerror = null;
              try {
                const decoded = source.decode?.();
                if (!decoded) job.finish(source);
                else {
                  decodeTimer = setTimeout(() => job.finish(null, true), PHONE_BITMAP_DECODE_DEADLINE_MS);
                  void decoded.then(() => job.finish(source), () => job.finish(null));
                }
              } catch { job.finish(null); }
            };
            source.onerror = () => job.finish(null);
            source.src = url;
          } catch { job.finish(null); }
        },
      };
      this.waiting.push(job); this.drain();
    });
    return { promise, promote: (next: number) => { job.priority = Math.min(job.priority, next); } };
  }

  private drain(): void {
    if (this.draining) return;
    this.draining = true;
    try {
      while (this.active < 4 && this.waiting.length) {
        let index = 0;
        if (this.preferredStarts < 7) {
          for (let n = 1; n < this.waiting.length; n++)
            if (this.waiting[n]!.priority < this.waiting[index]!.priority) index = n;
          this.preferredStarts++;
        } else this.preferredStarts = 0;
        this.waiting.splice(index, 1)[0]!.run();
      }
    } finally { this.draining = false; }
  }
}
