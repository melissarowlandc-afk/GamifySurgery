import { problemDiagnostics } from "../../diagnostics/problemDiagnostics";

export const PHONE_MEMORY_KEY = "gamify-surgery.phone-memory.v1";
export const PHONE_RESTART_WINDOW_MS = 10 * 60_000;
export const PHONE_LOW_MEMORY_MS = 24 * 60 * 60_000;
type Phase = "opening" | "playing";
type Store = Pick<Storage, "getItem" | "setItem">;
interface Marker { version: 1; active: { phase: Phase; at: number } | null; restarts: number[]; safeUntil: number }
const empty = (): Marker => ({ version: 1, active: null, restarts: [], safeUntil: 0 });
const normal = Object.freeze({ mode: "normal" as const, maxDpr: 2, textureBytes: 24 * 1024 * 1024, textureCount: 96, keepLiveFamilies: true });
const reduced = Object.freeze({ mode: "reduced" as const, maxDpr: 1, textureBytes: 8 * 1024 * 1024, textureCount: 32, keepLiveFamilies: false });
export type PhoneMemoryProfile = typeof normal | typeof reduced;

/** Auxiliary presentation marker only. Never reads, rewrites or removes a save.
 * Two unclean restarts in ten minutes select conservative defaults for24h. */
export class PhoneMemoryGuard {
  private row: Marker;
  private opened = false;
  private active = false;
  private suspended = false;
  private phase: Phase = "opening";
  private unavailable = false;
  constructor(private readonly store: Store | null, private readonly now = Date.now,
    private readonly diagnose: (code: string) => void = () => {}) {
    this.row = this.read();
  }
  get profile(): PhoneMemoryProfile { return this.unavailable || this.row.safeUntil > this.now() ? reduced : normal; }
  get health() { return { mode: this.profile.mode, phase: this.active ? this.phase : "clean", uncleanRestarts: this.row.restarts.length, storageAvailable: !this.unavailable }; }
  beginOpening(): PhoneMemoryProfile {
    if (this.opened || this.suspended) return this.profile;
    this.opened = true;
    const at = this.now();
    this.row.restarts = this.row.restarts.filter(t => t <= at && at - t <= PHONE_RESTART_WINDOW_MS);
    if (this.row.active && this.row.active.at <= at && at - this.row.active.at <= PHONE_LOW_MEMORY_MS)
      this.row.restarts = [...this.row.restarts, at].slice(-2);
    if (this.row.restarts.length >= 2) {
      this.row.safeUntil = at + PHONE_LOW_MEMORY_MS;
      this.diagnose("phone-memory-unclean-restarts");
    }
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
  private read(): Marker {
    if (!this.store) { this.failed(); return empty(); }
    try {
      const text = this.store.getItem(PHONE_MEMORY_KEY);
      if (!text || text.length > 1024) return empty();
      const row = JSON.parse(text) as Marker, at = this.now();
      const time = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0;
      if (row.version !== 1 || !Array.isArray(row.restarts) || row.restarts.length > 2 || !row.restarts.every(time) || !time(row.safeUntil) ||
          row.safeUntil > at + PHONE_LOW_MEMORY_MS + 60_000 || row.active !== null &&
          (!row.active || !["opening", "playing"].includes(row.active.phase) || !time(row.active.at) || row.active.at > at + 60_000)) return empty();
      return row;
    } catch { this.failed(); return empty(); }
  }
  private persist(): void {
    try { if (!this.store) throw Error("Unavailable"); this.store.setItem(PHONE_MEMORY_KEY, JSON.stringify(this.row)); }
    catch { this.failed(); }
  }
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
  const guard = new PhoneMemoryGuard(storage, Date.now, code => {
    problemDiagnostics.event("phone-memory", code); problemDiagnostics.persist(true);
  });
  const lifecycle = bindPhoneMemoryLifecycle(guard, window, document), unbind = problemDiagnostics.source("phoneMemory", () => guard.health);
  installed = { browser: window, guard, cleanup() { lifecycle(); unbind(); } };
  return guard;
}
export function phoneMemoryProfile(forcePhone = false): PhoneMemoryProfile { return browserGuard(forcePhone)?.profile ?? normal; }
export function beginPhoneCloudOpening(): void {
  if (typeof document !== "undefined" && document.visibilityState !== "hidden") browserGuard()?.beginOpening();
}
export function markPhonePlaying(): void { browserGuard()?.markPlaying(); }
