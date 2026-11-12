import { problemDiagnostics } from "../../diagnostics/problemDiagnostics";
import { phoneHealthStorage, type PhoneHealthStorage } from "./phoneHealthStorage";

export const PHONE_MEMORY_KEY = "gamify-surgery.phone-memory.v1";
export const PHONE_RESTART_WINDOW_MS = 10 * 60_000;
export const PHONE_LOW_MEMORY_MS = 24 * 60 * 60_000;
type Phase = "opening" | "playing";
type Store = Pick<Storage, "getItem" | "setItem">;
interface Marker { version: 1; active: { phase: Phase; at: number } | null; restarts: number[]; safeUntil: number; updatedAt?: number }
const empty = (): Marker => ({ version: 1, active: null, restarts: [], safeUntil: 0 });
const normal = Object.freeze({ mode: "normal" as const, maxDpr: 2, textureBytes: 24 * 1024 * 1024, textureCount: 96, keepLiveFamilies: true });
const reduced = Object.freeze({ mode: "reduced" as const, maxDpr: 1, textureBytes: 8 * 1024 * 1024, textureCount: 32, keepLiveFamilies: false });
export type PhoneMemoryProfile = typeof normal | typeof reduced;

/** Auxiliary presentation marker only. Never reads, rewrites or removes a save.
 * One interrupted opening or two interrupted playing sessions lower memory.
 * Fresh standalone phones start conservatively even after origin eviction. */
export class PhoneMemoryGuard {
  private row: Marker;
  private opened = false;
  private active = false;
  private suspended = false;
  private phase: Phase = "opening";
  private unavailable = false;
  private loaded = false;
  private countedRestart = false;
  private disposed = false;
  private largeClinic = false;
  private mirrorState: "none" | "pending" | "ready" | "unavailable" = "none";
  private mirrorRead: Promise<void> = Promise.resolve();
  private writing: Promise<void> | undefined;
  private pendingMirror: string | null = null;
  constructor(private readonly store: Store | null, private readonly now = Date.now,
    private readonly diagnose: (code: string) => void = () => {},
    private readonly mirror: PhoneHealthStorage | null = null, conservativeStandalone = false) {
    this.row = this.read();
    const initial = { ...this.row, restarts: [...this.row.restarts] }, hadLocalMarker = this.loaded;
    if (conservativeStandalone && !hadLocalMarker) {
      this.row.safeUntil = this.now() + PHONE_LOW_MEMORY_MS;
      this.diagnose("phone-memory-fresh-standalone");
    }
    if (mirror) {
      this.mirrorState = "pending";
      this.mirrorRead = Promise.resolve().then(() => mirror.read()).then(text => {
        if (this.disposed) return;
        const prior = this.parse(text), at = this.now();
        if (prior) {
          const newer = !hadLocalMarker || (prior.updatedAt ?? 0) > (initial.updatedAt ?? 0);
          this.row.safeUntil = Math.max(this.row.safeUntil, prior.safeUntil);
          if (newer) {
            if (!this.opened) {
              this.row = { ...prior, safeUntil: this.row.safeUntil };
            } else if (this.active && prior.active && !this.countedRestart) {
              this.recordRestart(prior, at);
            }
            if (!hadLocalMarker && prior.active) {
              // The independent marker survived a lost synchronous store.
              this.row.safeUntil = Math.max(this.row.safeUntil, at + PHONE_LOW_MEMORY_MS);
              this.diagnose("phone-memory-marker-recovered");
            }
          }
        }
        this.mirrorState = "ready";
        if (this.opened) this.persist();
      }).catch(() => { if (!this.disposed) { this.mirrorState = "unavailable"; this.pendingMirror = null; this.diagnose("phone-memory-durable-unavailable"); } });
    }
  }
  get profile(): PhoneMemoryProfile {
    return this.largeClinic || this.unavailable || !this.loaded && this.mirrorState === "pending" || this.row.safeUntil > this.now() ? reduced : normal;
  }
  get health() { return { mode: this.profile.mode, largeClinic: this.largeClinic, phase: this.active ? this.phase : "clean", uncleanRestarts: this.row.restarts.length, storageAvailable: !this.unavailable, durableStorage: this.mirrorState }; }
  /** Presentation default only; no campaign fields or backup timing change. */
  observeClinic(level: number, rooms: number): void {
    if (this.largeClinic || !(level >= 4 || rooms >= 40)) return;
    this.largeClinic = true;
    this.diagnose("phone-memory-large-clinic");
  }
  beginOpening(): PhoneMemoryProfile {
    if (this.opened || this.suspended) return this.profile;
    this.opened = true;
    const at = this.now();
    this.recordRestart(this.row, at);
    this.active = true; this.phase = "opening"; this.row.active = { phase: this.phase, at }; this.persist();
    return this.profile;
  }
  markPlaying(): void {
    if (!this.opened || !this.active || this.phase === "playing") return;
    this.phase = "playing"; this.row.active = { phase: this.phase, at: this.now() }; this.persist();
  }
  clean(): void {
    this.suspended = true;
    if (!this.active) return;
    this.active = false; this.row.active = null; this.row.restarts = []; this.persist();
  }
  resume(): void {
    this.suspended = false;
    if (!this.opened || this.active) return;
    this.active = true; this.row.active = { phase: this.phase, at: this.now() }; this.persist();
  }
  private failed(): void {
    if (!this.unavailable) this.diagnose("phone-memory-storage-unavailable");
    this.unavailable = true;
  }
  private recordRestart(prior: Marker, at: number): void {
    this.row.restarts = prior.restarts.filter(t => t <= at && at - t <= PHONE_RESTART_WINDOW_MS);
    if (!prior.active || prior.active.at > at || at - prior.active.at > PHONE_LOW_MEMORY_MS) return;
    this.countedRestart = true;
    this.row.restarts = [...this.row.restarts, at].slice(-2);
    if (prior.active.phase === "opening" || this.row.restarts.length >= 2) {
      this.row.safeUntil = at + PHONE_LOW_MEMORY_MS;
      this.diagnose(this.row.restarts.length >= 2 ? "phone-memory-unclean-restarts" : "phone-memory-incomplete-opening");
    }
  }
  private parse(text: string | null): Marker | null {
    if (!text || text.length > 1024) return null;
    try {
      const row = JSON.parse(text) as Marker, at = this.now();
      const time = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0;
      if (!row || row.version !== 1 || !Array.isArray(row.restarts) || row.restarts.length > 2 || !row.restarts.every(time) || !time(row.safeUntil) ||
          row.safeUntil > at + PHONE_LOW_MEMORY_MS + 60_000 || row.updatedAt !== undefined && (!time(row.updatedAt) || row.updatedAt > at + 60_000) || row.active !== null &&
          (!row.active || !["opening", "playing"].includes(row.active.phase) || !time(row.active.at) || row.active.at > at + 60_000)) return null;
      return { version: 1, active: row.active ? { phase: row.active.phase, at: row.active.at } : null,
        restarts: [...row.restarts], safeUntil: row.safeUntil, ...(row.updatedAt === undefined ? {} : { updatedAt: row.updatedAt }) };
    } catch { return null; }
  }
  private read(): Marker {
    if (!this.store) { this.failed(); return empty(); }
    try {
      const row = this.parse(this.store.getItem(PHONE_MEMORY_KEY));
      this.loaded = row !== null; return row ?? empty();
    } catch { this.failed(); return empty(); }
  }
  private persist(): void {
    if (this.disposed) return;
    this.row.updatedAt = Math.max(this.now(), (this.row.updatedAt ?? 0) + 1);
    const text = JSON.stringify(this.row);
    try { if (!this.store) throw Error("Unavailable"); this.store.setItem(PHONE_MEMORY_KEY, text); }
    catch { this.failed(); }
    if (this.mirrorState === "pending" || this.mirrorState === "ready") this.pendingMirror = text;
    this.drainMirror();
  }
  private drainMirror(): void {
    if (this.writing || this.mirrorState !== "ready" || !this.mirror || this.disposed) return;
    this.writing = (async () => {
      while (this.pendingMirror && !this.disposed) {
        const text = this.pendingMirror; this.pendingMirror = null; await this.mirror!.write(text);
      }
    })().catch(() => { if (!this.disposed) { this.mirrorState = "unavailable"; this.pendingMirror = null; this.diagnose("phone-memory-durable-unavailable"); } }).finally(() => {
      this.writing = undefined;
      if (this.pendingMirror) this.drainMirror();
    });
  }
  /** Tests/diagnostics only; gameplay never awaits auxiliary storage. */
  async flushAuxiliary(): Promise<void> { await this.mirrorRead; await this.writing; }
  dispose(): void { this.disposed = true; this.pendingMirror = null; this.mirror?.close(); }
}

export function bindPhoneMemoryLifecycle(guard: PhoneMemoryGuard, browser: Pick<Window, "addEventListener" | "removeEventListener">,
  doc: Pick<Document, "visibilityState" | "addEventListener" | "removeEventListener">): () => void {
  const visibility = () => { if (doc.visibilityState === "hidden") guard.clean(); else guard.resume(); };
  const hide = () => guard.clean(), show = () => { if (doc.visibilityState !== "hidden") guard.resume(); };
  doc.addEventListener("visibilitychange", visibility); browser.addEventListener("pagehide", hide); browser.addEventListener("pageshow", show);
  return () => { doc.removeEventListener("visibilitychange", visibility); browser.removeEventListener("pagehide", hide); browser.removeEventListener("pageshow", show); };
}

let installed: { browser: Window; guard: PhoneMemoryGuard; cleanup(): void } | undefined;
function browserGuard(forcePhone = false): PhoneMemoryGuard | null {
  if (typeof window === "undefined" || typeof document === "undefined") return null;
  if (installed?.browser === window) return installed.guard;
  let storage: Storage | null = null, preference: string | null = null;
  try { storage = window.localStorage; preference = storage.getItem("gamify-surgery.presentation-layout.v1"); } catch { /* Conservative fallback has no save access. */ }
  const override = new URLSearchParams(window.location?.search ?? "").get("layout") ?? preference;
  if (!forcePhone && override !== "phone" && (override === "desktop" || !window.matchMedia?.("(pointer: coarse)").matches || window.innerWidth > 1100)) return null;
  installed?.cleanup();
  let mirror: PhoneHealthStorage | null = null, standalone = false;
  try { if (window.indexedDB) mirror = phoneHealthStorage(window.indexedDB); } catch { /* The synchronous store still works. */ }
  try { standalone = window.matchMedia?.("(display-mode: standalone)").matches === true || (window.navigator as Navigator & { standalone?: boolean } | undefined)?.standalone === true; }
  catch { /* Older browsers can still use the normal restart marker. */ }
  const guard = new PhoneMemoryGuard(storage, Date.now, code => {
    problemDiagnostics.event("phone-memory", code); problemDiagnostics.persist(true);
  }, mirror, standalone);
  const lifecycle = bindPhoneMemoryLifecycle(guard, window, document), unbind = problemDiagnostics.source("phoneMemory", () => guard.health);
  installed = { browser: window, guard, cleanup() { lifecycle(); unbind(); guard.dispose(); } };
  return guard;
}
export function phoneMemoryProfile(forcePhone = false): PhoneMemoryProfile { return browserGuard(forcePhone)?.profile ?? normal; }
export function observePhoneClinic(level: number, rooms: number, forcePhone = false): void { browserGuard(forcePhone)?.observeClinic(level, rooms); }
export function beginPhoneCloudOpening(): void {
  if (typeof document !== "undefined" && document.visibilityState !== "hidden") browserGuard()?.beginOpening();
}
export function markPhonePlaying(): void { browserGuard()?.markPlaying(); }
