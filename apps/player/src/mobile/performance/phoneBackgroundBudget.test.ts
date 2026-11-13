import { afterEach, expect, it, vi } from "vitest";
import { bindProblemDiagnostics, DIAGNOSTICS_KEY, DIAGNOSTICS_MAX_CHARS, problemDiagnostics } from "../../diagnostics/problemDiagnostics";

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

it("writes one bounded healthy phone diagnostic per minute, sleeps hidden, and still records an exit/error immediately", async () => {
  vi.useFakeTimers(); vi.setSystemTime(1_000_000);
  vi.spyOn(problemDiagnostics as unknown as { now: () => number }, "now").mockImplementation(() => Date.now());
  const values = new Map<string, string>(), writes: { key: string; text: string }[] = [];
  const localStorage = { getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, text: string) => { values.set(key, text); writes.push({ key, text }); } };
  const browser = Object.assign(new EventTarget(), { localStorage, innerWidth: 390 }) as unknown as Window;
  const doc = Object.assign(new EventTarget(), { visibilityState: "visible" }) as unknown as Document;
  const stop = bindProblemDiagnostics(browser, doc);
  try {
    writes.length = 0;
    await vi.advanceTimersByTimeAsync(60_000);
    expect(writes).toHaveLength(1); expect(writes[0]!.key).toBe(DIAGNOSTICS_KEY);
    expect(writes[0]!.text.length).toBeLessThanOrEqual(DIAGNOSTICS_MAX_CHARS);
    Object.assign(doc, { visibilityState: "hidden" }); doc.dispatchEvent(new Event("visibilitychange"));
    expect(writes).toHaveLength(2); expect(vi.getTimerCount()).toBe(0);
    await vi.advanceTimersByTimeAsync(60_000); expect(writes).toHaveLength(2);
    Object.assign(doc, { visibilityState: "visible" }); doc.dispatchEvent(new Event("visibilitychange"));
    const beforeError = writes.length;
    browser.dispatchEvent(Object.assign(new Event("error"), { error: new TypeError("Failed to fetch") }));
    expect(writes).toHaveLength(beforeError + 1);
    expect(JSON.parse(writes.at(-1)!.text).errors.at(-1)[2]).toBe("TypeError:Failed to fetch");
    browser.dispatchEvent(new Event("pagehide")); expect(vi.getTimerCount()).toBe(0);
  } finally { stop(); }
});
