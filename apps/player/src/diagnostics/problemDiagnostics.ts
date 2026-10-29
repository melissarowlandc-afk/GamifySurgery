import { APP_BUILD_VERSION, APP_VERSION } from "../appVersion";

export const DIAGNOSTICS_KEY = "gamify-surgery.problem-diagnostics.v1";
export const DIAGNOSTICS_MAX_CHARS = 3_072; // At most 6 KiB of optional UTF-16 storage.
type Scalar = string | number | boolean | null;
type Health = Record<string, Scalar | Scalar[][]>;
type Row = [number, string, string];
export interface TechnicalSnapshot {
  version: 1; build: string; release: string; at: number; started: number;
  environment: Health; health: Record<string, Health>; lifecycle: Row[]; events: Row[]; errors: Row[];
}
const HEALTH_KEYS: Record<string, readonly string[]> = {
  layout: ["layout"],
  coordinator: ["phase", "failure", "canExecute", "localDurable", "pending", "leaseExpiresAt", "leaseRemainingMs", "resumeAuthorized", "stopped", "closing", "checking", "uploading", "renewing", "offlineLocal"],
  gameSession: ["reloadRequired", "closing", "stopped", "dirty", "encoding", "canExecute", "reconnecting", "lastCommandMs", "commandAge"],
  facility: ["tick", "paused", "speed", "lastTickAt", "tickAge", "finishReportOpen"],
  clock: ["tick", "paused", "speed", "visible", "allowed", "lastTickAt", "tickAge", "timerAge", "rafAge", "rafPendingAge", "restarts"],
  render: ["frameAge", "restarts", "paused", "running"], codec: ["alive", "ready", "restarts", "lastError", "responseAge", "inFlight"],
  storage: ["pending", "operations", "lastError", "lastMs"], usage: ["state", "pendingReceipts", "droppedReceipts", "storageAvailable", "countingHere"],
  flags: ["pending", "unavailable", "storageAvailable", "dropped"], shell: ["layout", "buildMode", "managementMode", "paused", "speed", "facilityLevel"],
};
function storedSnapshot(value: unknown): value is TechnicalSnapshot {
  if (!value || typeof value !== "object") return false;
  const row = value as TechnicalSnapshot;
  const scalar = (v: unknown) => v === null || typeof v === "boolean" || typeof v === "number" && Number.isFinite(v) ||
    typeof v === "string" && v.length <= 128 && !/[\\/@<>\r\n]/.test(v);
  const rows = (v: unknown, limit: number) => Array.isArray(v) && v.length <= limit && v.every(r =>
    Array.isArray(r) && r.length === 3 && typeof r[0] === "number" && Number.isFinite(r[0]) && typeof r[1] === "string" &&
    /^[a-z-]{1,30}$/.test(r[1]) && scalar(r[2]));
  return row.version === 1 && Object.keys(row).every(key => ["version", "build", "release", "at", "started", "environment", "health", "lifecycle", "events", "errors"].includes(key)) &&
    typeof row.build === "string" && /^[\w.+-]{1,80}$/.test(row.build) && typeof row.release === "string" && /^[\w.+-]{1,80}$/.test(row.release) &&
    typeof row.at === "number" && Number.isFinite(row.at) && typeof row.started === "number" && Number.isFinite(row.started) &&
    Boolean(row.environment && Object.entries(row.environment).every(([key, v]) =>
      ["standalone", "displayMode", "visibility", "online", "memoryGiB", "heapBytes", "heapLimit", "layout", "origin"].includes(key) &&
      (scalar(v) || key === "origin" && typeof v === "string" && /^https?:\/\/[a-zA-Z0-9.:[\]-]{1,100}$/.test(v)))) &&
    Boolean(row.health && Object.entries(row.health).every(([name, health]) => HEALTH_KEYS[name] && health && typeof health === "object" &&
      Object.entries(health).every(([key, v]) => HEALTH_KEYS[name]!.includes(key) && (scalar(v) ||
        ["inFlight", "operations"].includes(key) && Array.isArray(v) && v.length <= 12 && v.every(r => Array.isArray(r) && r.length <= 3 && r.every(scalar)))))) &&
    rows(row.lifecycle ?? [], 16) && rows(row.events, 16) && rows(row.errors, 20);
}

/** Only technical codes/platform messages cross this boundary. Arbitrary thrown
 * values can contain names, answers or tokens; never persist their text/stack. */
export function technicalError(error: unknown): string {
  try {
  const e = error as { name?: unknown; code?: unknown; reason?: unknown; message?: unknown } | null;
  const name = typeof e?.name === "string" && /^(?:Error|TypeError|RangeError|SyntaxError|DOMException|[A-Za-z]+Error)$/.test(e.name) ? e.name.slice(0, 32) : "Error";
  const code = e?.reason ?? e?.code;
  if (typeof code === "string" && /^[a-z][a-z0-9_-]{0,45}$/.test(code)) return `${name}:${code}`;
  const message = typeof e?.message === "string" ? e.message : "";
  const known = message.match(/QuotaExceededError|DataCloneError|out of memory|Maximum call stack size exceeded|Failed to fetch|Load failed|Script error|ResizeObserver loop|IndexedDB|Worker|transaction (?:aborted|inactive)|Cannot read properties of (?:undefined|null)/i)?.[0];
  return `${name}:${known ?? "unexpected (text omitted)"}`;
  } catch { return "Error:unreadable exception"; }
}

export class ProblemDiagnostics {
  private readonly started: number;
  private events: Row[] = [];
  private lifecycle: Row[] = [];
  private errors: Row[] = [];
  private readonly sources = new Map<string, () => Health>();
  private previous: TechnicalSnapshot | null = null;
  private storage: Pick<Storage, "getItem" | "setItem"> | null = null;
  private lastPersist = -Infinity;
  private lastCriticalPersist = -Infinity;
  private connected = false;
  constructor(private readonly now = Date.now) { this.started = now(); }
  source(name: string, read: () => Health): () => void {
    this.sources.set(name, read);
    return () => { if (this.sources.get(name) === read) this.sources.delete(name); };
  }
  event(source: string, code: string): void {
    this.events.push([this.now(), source.slice(0, 30), code.slice(0, 80)]);
    this.events = this.events.slice(-16);
    if (source === "lifecycle") this.lifecycle = [...this.lifecycle, this.events.at(-1)!].slice(-16);
  }
  error(source: string, error: unknown): void {
    this.errors.push([this.now(), source.slice(0, 30), technicalError(error)]);
    this.errors = this.errors.slice(-20);
    // A fatal render error may unmount the observer before its next heartbeat.
    // Preserve that first cause now, while rate-limiting an exception storm.
    const critical = ["uncaught", "unhandled"].includes(source) && this.now() - this.lastCriticalPersist >= 1_000;
    if (critical) this.lastCriticalPersist = this.now();
    this.persist(critical);
  }
  connect(storage: Pick<Storage, "getItem" | "setItem"> | null): void {
    this.storage = storage;
    if (this.connected) return;
    this.connected = true;
    try {
      const text = storage?.getItem(DIAGNOSTICS_KEY);
      if (text && text.length <= DIAGNOSTICS_MAX_CHARS) {
        const parsed = JSON.parse(text);
        // Only our bounded, technical schema; legacy/unrecognised values ignored.
        if (storedSnapshot(parsed)) this.previous = { ...parsed, lifecycle: parsed.lifecycle ?? parsed.events.filter((row: Row) => row[1] === "lifecycle") };
      }
    } catch { /* Diagnostics must never block play or recovery. */ }
    this.persist(true);
  }
  snapshot(): TechnicalSnapshot {
    const health: Record<string, Health> = {};
    for (const [name, read] of this.sources) {
      try { health[name] = read(); } catch (error) { health[name] = { error: technicalError(error) }; }
    }
    const nav = typeof navigator === "undefined" ? null : navigator as Navigator & { standalone?: boolean; deviceMemory?: number };
    const memory = typeof performance === "undefined" ? undefined : (performance as Performance & { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    return { version: 1, build: APP_BUILD_VERSION, release: APP_VERSION, at: this.now(), started: this.started,
      environment: { standalone: Boolean(nav?.standalone || typeof matchMedia === "function" && matchMedia("(display-mode: standalone)").matches),
        layout: health.layout?.layout ?? health.shell?.layout ?? "unknown", origin: typeof location === "undefined" ? null : location.origin,
        displayMode: typeof matchMedia === "function" && matchMedia("(display-mode: standalone)").matches ? "standalone" : "browser",
        visibility: typeof document === "undefined" ? "unknown" : document.visibilityState,
        online: nav?.onLine ?? null, memoryGiB: nav?.deviceMemory ?? null,
        heapBytes: memory?.usedJSHeapSize ?? null, heapLimit: memory?.jsHeapSizeLimit ?? null },
      health, lifecycle: this.lifecycle.slice(), events: this.events.slice(), errors: this.errors.slice() };
  }
  report(): { current: TechnicalSnapshot; previous: TechnicalSnapshot | null } { return { current: this.snapshot(), previous: this.previous ? structuredClone(this.previous) : null }; }
  persist(force = false): void {
    if (!this.storage || !force && this.now() - this.lastPersist < 5_000) return;
    this.lastPersist = this.now();
    try {
      const snapshot = this.snapshot();
      let text = JSON.stringify(snapshot);
      while (text.length > DIAGNOSTICS_MAX_CHARS && snapshot.events.length) { snapshot.events.shift(); text = JSON.stringify(snapshot); }
      while (text.length > DIAGNOSTICS_MAX_CHARS && snapshot.lifecycle.length > 6) { snapshot.lifecycle.shift(); text = JSON.stringify(snapshot); }
      while (text.length > DIAGNOSTICS_MAX_CHARS && snapshot.errors.length > 3) { snapshot.errors.shift(); text = JSON.stringify(snapshot); }
      while (text.length > DIAGNOSTICS_MAX_CHARS && snapshot.lifecycle.length > 1) { snapshot.lifecycle.shift(); text = JSON.stringify(snapshot); }
      while (text.length > DIAGNOSTICS_MAX_CHARS && snapshot.errors.length) { snapshot.errors.shift(); text = JSON.stringify(snapshot); }
      if (text.length <= DIAGNOSTICS_MAX_CHARS) this.storage.setItem(DIAGNOSTICS_KEY, text);
    } catch { /* Optional tiny journal never evicts or competes with campaign data. */ }
  }
}
export const problemDiagnostics = new ProblemDiagnostics();

// Visible presentation only; never persisted or submitted (a domain receipt's
// explanatory text may contain patient information).
let commandProblem: string | null = null;
const commandListeners = new Set<() => void>();
export const getCommandProblem = () => commandProblem;
export const subscribeCommandProblem = (listener: () => void) => { commandListeners.add(listener); return () => { commandListeners.delete(listener); }; };
export function showCommandProblem(message: string | null): void {
  if (message === commandProblem) return;
  commandProblem = message; for (const listener of commandListeners) listener();
}

const storageWork = new Map<number, { operation: string; started: number }>();
let storageSequence = 0, lastStorageError: string | null = null, lastStorageMs: number | null = null;
problemDiagnostics.source("storage", () => ({ pending: storageWork.size,
  operations: [...storageWork.values()].slice(0, 6).map(row => [row.operation, Date.now() - row.started]),
  lastError: lastStorageError, lastMs: lastStorageMs }));
export async function observeStorage<T>(operation: string, work: () => Promise<T>): Promise<T> {
  const id = ++storageSequence, started = Date.now(); storageWork.set(id, { operation, started });
  try { return await work(); }
  catch (error) { lastStorageError = technicalError(error); problemDiagnostics.error("storage", error); throw error; }
  finally { storageWork.delete(id); lastStorageMs = Date.now() - started; }
}

/** One observer per document, independent of the game/session and requestAnimationFrame. */
export function bindProblemDiagnostics(browser: Window, doc: Document): () => void {
  let storage: Storage | null = null;
  try { storage = browser.localStorage; } catch { /* Private/full storage. */ }
  problemDiagnostics.connect(storage);
  const event = (e: Event) => { problemDiagnostics.event("lifecycle", `${e.type}:${doc.visibilityState}`); problemDiagnostics.persist(e.type === "pagehide" || doc.visibilityState === "hidden"); };
  const caught = (e: ErrorEvent) => problemDiagnostics.error("uncaught", e.error ?? new Error("Script error"));
  const rejection = (e: PromiseRejectionEvent) => problemDiagnostics.error("unhandled", e.reason);
  const windowEvents = ["focus", "blur", "pageshow", "pagehide", "online", "offline"];
  const documentEvents = ["visibilitychange", "freeze", "resume"];
  windowEvents.forEach(name => browser.addEventListener(name, event)); documentEvents.forEach(name => doc.addEventListener(name, event));
  browser.addEventListener("error", caught); browser.addEventListener("unhandledrejection", rejection);
  const timer = setInterval(() => { if (doc.visibilityState !== "hidden") problemDiagnostics.persist(); }, 5_000);
  problemDiagnostics.event("lifecycle", `launch:${doc.visibilityState}`);
  return () => {
    windowEvents.forEach(name => browser.removeEventListener(name, event)); documentEvents.forEach(name => doc.removeEventListener(name, event));
    browser.removeEventListener("error", caught); browser.removeEventListener("unhandledrejection", rejection); clearInterval(timer);
  };
}
