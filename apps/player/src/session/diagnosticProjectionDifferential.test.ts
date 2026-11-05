import { afterEach, expect, it, vi } from "vitest";
import * as domain from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";
import { createDiagnosticWorkload } from "../../../../tests/fixtures/diagnostic-workload";
const control = vi.hoisted(() => ({ legacy: false }));
vi.mock("./diagnosticChoicePreviews", async original => {
  const actual = await original<typeof import("./diagnosticChoicePreviews")>();
  return { diagnosticChoicePreviews: (state: domain.GameState) => control.legacy
    ? (encounterId: string, choiceId: string) => domain.getAnswerChoiceServicePreview(state, encounterId, choiceId)
    : actual.diagnosticChoicePreviews(state) };
});
vi.mock("../../../../packages/game-domain/src/settledStateQueries", async original => {
  const actual = await original<typeof import("../../../../packages/game-domain/src/settledStateQueries")>();
  return { ...actual, withSettledStateQueries: <T>(state: domain.GameState, read: () => T): T => control.legacy ? read() : actual.withSettledStateQueries(state, read) };
});
afterEach(() => { control.legacy = false; vi.restoreAllMocks(); });

it("computes each chart choice once and keeps both projections byte exact versus eager uncached forecasts", () => {
  let { state, chartId } = createDiagnosticWorkload();
  const preview = vi.spyOn(domain, "getAnswerChoiceServicePreview");
  for (let i = 0; i < 15; i++) {
    const before = JSON.stringify(state);
    control.legacy = true;
    const expected = createPrototypePlayerView(state, chartId, false, null);
    const referenceCalls = preview.mock.calls.length; preview.mockClear();
    control.legacy = false;
    const actual = createPrototypePlayerView(state, chartId, false, null);
    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
    if (i === 0) { expect(preview.mock.calls.length).toBeGreaterThan(0); expect(referenceCalls).toBe(2 * preview.mock.calls.length); }
    expect(new Set(preview.mock.calls.map(args => JSON.stringify(args.slice(1)))).size).toBe(preview.mock.calls.length);
    preview.mockClear();
    expect(JSON.stringify(state)).toBe(before);
    state = domain.gameReducer(state, { type: "ADVANCE_TICK", operationId: `projection.diff.${i}`, advancedAtRealMs: 1800000000000 + i * 1000 });
  }
// The eager correctness oracle deliberately repeats all forecasts on the large
// history fixture; the separate performance test retains its 16/50 ms budgets.
}, process.env.CI ? 600_000 : 60_000);
