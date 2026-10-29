import { afterEach, describe, expect, it, vi } from "vitest";
import { bindProblemDiagnostics, DIAGNOSTICS_KEY, DIAGNOSTICS_MAX_CHARS, ProblemDiagnostics, problemDiagnostics, technicalError } from "./problemDiagnostics";
import { renderLoopWatchdog, wakePresentationLoop } from "./renderLoopWatchdog";
import { createProblemReport, problemReportSubmissions } from "../feedback/problemReport";

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
const storage = () => { const values = new Map<string, string>(); return { values, getItem: (key: string) => values.get(key) ?? null,
  setItem: (key: string, value: string) => { values.set(key, value); } }; };
describe("independent bounded technical diagnostics", () => {
  it("retains twenty caught messages, sixteen events, tiny previous-session state and no arbitrary error data", () => {
    let now = 1_000; const disk = storage(), first = new ProblemDiagnostics(() => now);
    first.connect(disk); first.source("coordinator", () => ({ phase: "ready", canExecute: true }));
    for (let i = 0; i < 35; i++) { first.event("lifecycle", "focus:visible"); first.error("codec", new Error(`Private patient Amelia, answer A, token secret${i}`)); now += 1_000; }
    first.persist(true);
    expect(first.snapshot().errors).toHaveLength(20); expect(first.snapshot().events).toHaveLength(16);
    first.event("command", "refused"); expect(first.snapshot().lifecycle).toHaveLength(16);
    const text = disk.values.get(DIAGNOSTICS_KEY)!;
    expect(text.length).toBeLessThanOrEqual(DIAGNOSTICS_MAX_CHARS);
    expect(text).not.toMatch(/Amelia|answer A|secret/);
    const reopened = new ProblemDiagnostics(() => now + 10); reopened.connect(disk);
    expect(reopened.report().previous?.health.coordinator).toEqual({ phase: "ready", canExecute: true });
    expect(reopened.report().previous?.errors.at(-1)?.[2]).toBe("Error:unexpected (text omitted)");
    // StrictMode effect replay must not replace the preceding document's report.
    reopened.connect(disk); expect(reopened.report().previous?.started).toBe(1_000);
  });
  it("never throws, evicts a campaign or grows an unreadable legacy journal when optional storage is full", () => {
    const diagnostics = new ProblemDiagnostics(); const remove = vi.fn();
    expect(() => diagnostics.connect({ getItem: () => "x".repeat(DIAGNOSTICS_MAX_CHARS + 1), setItem: () => { throw new DOMException("full", "QuotaExceededError"); }, removeItem: remove } as unknown as Storage)).not.toThrow();
    expect(() => diagnostics.error("cache", new TypeError("Failed to fetch https://private.invalid/token"))).not.toThrow();
    expect(remove).not.toHaveBeenCalled(); expect(diagnostics.report().previous).toBeNull();
  });
  it("keeps platform error messages/codes without URLs, stacks, thrown payloads or saved clinic text", () => {
    expect(technicalError(new TypeError("Failed to fetch https://secret.invalid/email@example.invalid"))).toBe("TypeError:Failed to fetch");
    expect(technicalError({ name: "CloudCacheError", reason: "quota", message: "patient name" })).toBe("CloudCacheError:quota");
    expect(technicalError({ name: "TypeError", message: "Cannot read properties of undefined (reading 'patient.name')" })).toBe("TypeError:Cannot read properties of undefined");
    expect(technicalError("clinical answer text")).toBe("Error:unexpected (text omitted)");
    expect(technicalError(new Proxy({}, { get() { throw new Error("private value"); } }))).toBe("Error:unreadable exception");
  });
  it("uses only immutable existing feedback rows, each within the server's thousand-character limit", () => {
    problemDiagnostics.event("watchdog", "codec-worker-restart");
    const rows = createProblemReport(1, "phone");
    expect(rows.length).toBeGreaterThan(0); expect(rows.length).toBeLessThanOrEqual(10);
    expect(new Set(rows.map(row => row.id)).size).toBe(rows.length);
    for (const row of rows) expect(row.comment.length).toBeLessThanOrEqual(1_000);
    const report = JSON.parse(rows.map(row => row.comment.split("\n").slice(1).join("\n").slice(0, -6)).join(""));
    expect(report.current.environment.layout).toBe("phone");
    expect(report.current.events.at(-1).slice(1)).toEqual(["watchdog", "codec-worker-restart"]);
  });
});

it("preserves JSON-string spaces at part boundaries through the feedback channel's trimming", () => {
  const prefix = '{"technical":"', text = prefix + "x".repeat(919 - prefix.length) + ' suffix"}';
  expect(text[919]).toBe(" ");
  const parts = problemReportSubmissions(text, 1, "phone");
  const recovered = parts.map(row => row.comment.trim().split("\n").slice(1).join("\n").slice(0, -6)).join("");
  expect(recovered).toBe(text); expect(JSON.parse(recovered)).toEqual(JSON.parse(text));
  expect(parts.every(row => row.comment.length <= 1_000)).toBe(true);
});

it("persists a fatal error before unmount/kill with no pagehide, rate-limited during an error storm", () => {
  let now = 0; const disk = storage(), write = vi.spyOn(disk, "setItem"), diagnostics = new ProblemDiagnostics(() => now);
  diagnostics.connect(disk);
  diagnostics.error("uncaught", new TypeError("Cannot read properties of undefined (private field)"));
  expect(JSON.parse(disk.values.get(DIAGNOSTICS_KEY)!).errors[0][2]).toBe("TypeError:Cannot read properties of undefined");
  for (let i = 0; i < 40; i++) diagnostics.error("unhandled", new Error("Private rejected content"));
  expect(write).toHaveBeenCalledTimes(2); // initial journal + first fatal cause
  now = 1_000; diagnostics.error("unhandled", new TypeError("Failed to fetch private address"));
  expect(write).toHaveBeenCalledTimes(3);
  const reopened = new ProblemDiagnostics(() => now + 10); reopened.connect(disk);
  expect(reopened.report().previous?.errors.at(-1)?.[2]).toBe("TypeError:Failed to fetch");
  expect(JSON.stringify(reopened.report())).not.toContain("Private rejected content");
});


it("restarts a stalled render loop on a separate timer, throttled and only when visible", () => {
  let now = 0, visible = true; const wake = vi.fn(); const watchdog = renderLoopWatchdog(() => visible, wake, () => now);
  now = 5_000; watchdog.check(); expect(wake).toHaveBeenCalledOnce();
  watchdog.check(); expect(wake).toHaveBeenCalledOnce();
  watchdog.frame(); now = 9_999; watchdog.check(); expect(wake).toHaveBeenCalledOnce();
  visible = false; now = 20_000; watchdog.check(); expect(wake).toHaveBeenCalledOnce();
  visible = true; watchdog.check(); expect(wake).toHaveBeenCalledOnce();
  now = 25_000; watchdog.check(); expect(wake).toHaveBeenCalledTimes(2);
  expect(problemDiagnostics.report().current.health.render).toMatchObject({ restarts: 2, frameAge: 20_000 });
  watchdog.dispose();
});

it("clears Phaser's lifecycle pause before restarting a stopped rAF, without touching domain pause or authority", () => {
  const order: string[] = [];
  const game = { isPaused: true, resume() { this.isPaused = false; order.push("resume"); }, loop: { running: false, wake() { this.running = true; order.push("wake"); } } };
  wakePresentationLoop(game); expect(order).toEqual(["resume", "wake"]); expect(game.isPaused).toBe(false);
  wakePresentationLoop(game); expect(order).toEqual(["resume", "wake", "wake"]);
});


it("captures lifecycle, caught errors and unhandled rejections independently of any session/clock", () => {
  vi.useFakeTimers(); const disk = storage();
  const browser = Object.assign(new EventTarget(), { localStorage: disk }) as unknown as Window;
  const doc = Object.assign(new EventTarget(), { visibilityState: "visible" }) as unknown as Document;
  const stop = bindProblemDiagnostics(browser, doc);
  try {
    browser.dispatchEvent(new Event("focus")); doc.dispatchEvent(new Event("resume"));
    browser.dispatchEvent(Object.assign(new Event("error"), { error: new TypeError("Failed to fetch private address") }));
    browser.dispatchEvent(Object.assign(new Event("unhandledrejection"), { reason: new Error("Private clinic and patient text") }));
    browser.dispatchEvent(new Event("pagehide"));
    const snapshot = problemDiagnostics.report().current;
    expect(snapshot.events.slice(-3).map(row => row[2])).toEqual(["focus:visible", "resume:visible", "pagehide:visible"]);
    expect(snapshot.errors.slice(-2).map(row => row[2])).toEqual(["TypeError:Failed to fetch", "Error:unexpected (text omitted)"]);
    expect(disk.values.get(DIAGNOSTICS_KEY)).not.toMatch(/private address|Private clinic/);
  } finally { stop(); vi.useRealTimers(); }
});


it("retains origin/layout context but rejects unrecognised persisted data instead of uploading it", () => {
  vi.stubGlobal("location", { origin: "http://127.0.0.1:5184" }); const disk = storage();
  const first = new ProblemDiagnostics(); first.source("layout", () => ({ layout: "phone" })); first.connect(disk);
  const next = new ProblemDiagnostics(); next.connect(disk);
  expect(next.report().previous?.environment).toMatchObject({ origin: "http://127.0.0.1:5184", layout: "phone" });
  const raw = JSON.parse(disk.values.get(DIAGNOSTICS_KEY)!); raw.savedClinic = { patient: "private text" };
  disk.values.set(DIAGNOSTICS_KEY, JSON.stringify(raw));
  const reopened = new ProblemDiagnostics(); reopened.connect(disk);
  expect(reopened.report().previous).toBeNull(); expect(JSON.stringify(reopened.report())).not.toContain("private text");
});
