import { afterEach, describe, expect, it, vi } from "vitest";
import { assertPerformanceBudgets, ciTime, PerformanceBudgetError, runPerformanceTest } from "../../../../../tests/support/performanceBudget";

afterEach(() => vi.restoreAllMocks());
const measure = (actualMs: number, label = "frame") => ({ label, actualMs, limitMs: 16 });

describe("shared-runner performance policy", () => {
  it("keeps local budgets and preserves each existing CI allowance", () => {
    expect(ciTime(16, 10, {})).toBe(16);
    expect(ciTime(16, 10, { CI: "true" })).toBe(160);
    expect(ciTime(16, 10, { GITHUB_ACTIONS: "true" })).toBe(160);
    expect(ciTime(16, 25, { CI: "true" })).toBe(400);
    expect(ciTime(4, 3, { GITHUB_ACTIONS: "true" })).toBe(12);
  });

  it("fails the first local measurement without a retry", async () => {
    const work = vi.fn(() => assertPerformanceBudgets([measure(16)]));
    await expect(runPerformanceTest(work, {})).rejects.toBeInstanceOf(PerformanceBudgetError);
    expect(work).toHaveBeenCalledTimes(1);
  });

  it.each([{ CI: "true" }, { GITHUB_ACTIONS: "true" }])("retries a noisy CI measurement, then stops at the first passing whole run (%j)", async env => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const samples = [20, 12, 30];
    const work = vi.fn(() => assertPerformanceBudgets([measure(samples.shift()!)]));
    await runPerformanceTest(work, env);
    expect(work).toHaveBeenCalledTimes(2); expect(samples).toEqual([30]);
  });

  it("does not repeat a passing CI measurement", async () => {
    const work = vi.fn(() => assertPerformanceBudgets([measure(12)]));
    await runPerformanceTest(work, { CI: "true" }); expect(work).toHaveBeenCalledTimes(1);
  });

  it("fails a persistent regression after exactly three attempts with the best complete run", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const samples = [32, 20, 24];
    const work = vi.fn(async () => { assertPerformanceBudgets([measure(samples.shift()!)]); });
    await expect(runPerformanceTest(work, { CI: "true" })).rejects.toThrow(/frame: 20.000 ms[\s\S]*All 3 CI attempts exceeded budget/);
    expect(work).toHaveBeenCalledTimes(3);
  });

  it("never combines individually fast budgets from different failing runs", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    let attempt = 0;
    const work = vi.fn(() => { attempt++; assertPerformanceBudgets([measure(attempt % 2 ? 20 : 8, "tick"), measure(attempt % 2 ? 8 : 20, "chart")]); });
    await expect(runPerformanceTest(work, { CI: "true" })).rejects.toBeInstanceOf(PerformanceBudgetError);
    expect(work).toHaveBeenCalledTimes(3);
  });

  it("never retries correctness/setup errors, including after a timing retry", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = new Error("journal bytes changed"), work = vi.fn(() => { throw error; });
    await expect(runPerformanceTest(work, { CI: "true" })).rejects.toBe(error); expect(work).toHaveBeenCalledTimes(1);
    const later = vi.fn().mockImplementationOnce(() => assertPerformanceBudgets([measure(32)])).mockImplementation(() => { throw error; });
    await expect(runPerformanceTest(later, { CI: "true" })).rejects.toBe(error); expect(later).toHaveBeenCalledTimes(2);
  });

  it("finishes attempt cleanup before constructing the next workload", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    let attempt = 0; const events: string[] = [];
    await runPerformanceTest(async () => {
      const current = ++attempt; events.push(`create ${current}`);
      try { assertPerformanceBudgets([measure(current === 1 ? 32 : 8)]); }
      finally { await Promise.resolve(); events.push(`dispose ${current}`); }
    }, { CI: "true" });
    expect(events).toEqual(["create 1", "dispose 1", "create 2", "dispose 2"]);
  });

  it.each([NaN, Infinity, -1])("rejects an invalid measurement %s", value => {
    expect(() => assertPerformanceBudgets([measure(value)])).toThrow(PerformanceBudgetError);
  });

  it("rejects empty or invalid budgets as setup errors", () => {
    expect(() => assertPerformanceBudgets([])).toThrow(TypeError);
    expect(() => assertPerformanceBudgets([{ ...measure(1), limitMs: NaN }])).toThrow(TypeError);
  });
});
