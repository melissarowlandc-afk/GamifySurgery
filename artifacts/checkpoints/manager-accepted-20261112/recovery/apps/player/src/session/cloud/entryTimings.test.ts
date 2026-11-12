import { expect, it } from "vitest";
import { EntryWorkTimings } from "./entryTimings";
import { ProblemDiagnostics } from "../../diagnostics/problemDiagnostics";

it("freezes completed stage timing, counts repeated work, and survives the tiny diagnostics journal", async () => {
  let now = 0; const timings = new EntryWorkTimings(() => now), diagnostics = new ProblemDiagnostics(() => now);
  let stored = ""; diagnostics.source("entryWork", () => timings.health);
  diagnostics.source("gameSession", () => ({ preparing: true, canExecute: true }));
  const storage = { getItem: () => stored || null, setItem: (_: string, value: string) => { stored = value; } };
  diagnostics.connect(storage);
  diagnostics.error("campaign-open:copies:processing", new TypeError("Worker unavailable"));
  for (let i = 0; i < 2; i++) await timings.measure("copy-inspect", async () => {
    now += 3_200; expect(timings.health.operations).toEqual([["copy-inspect", 3_200]]);
  });
  expect(timings.health.timings).toEqual([["copy-inspect", 2, 6_400]]);
  now += 49_401;
  expect(timings.health.lastMs).toBe(3_200); expect(timings.health.timings).toEqual([["copy-inspect", 2, 6_400]]);
  diagnostics.persist(true); const reopened = new ProblemDiagnostics(() => now); reopened.connect(storage);
  expect(reopened.report().previous?.health.entryWork).toEqual(timings.health);
  expect(reopened.report().previous?.health.gameSession).toEqual({ preparing: true, canExecute: true });
  expect(reopened.report().previous?.errors[0]?.[1]).toBe("campaign-open:copies:processing".slice(0, 30));
});
