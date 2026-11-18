import { expect, it } from "vitest";
import { createGameEvidenceCheckpoint, deserializeGameState, serializeGameState } from "@gamify-surgery/game-domain";
import { publicCloudOpeningWorkload } from "./openingPerformanceTestSupport";
import { OperationalEngineProcessor } from "./operationalEngineProcessor";
import { applyOperationalStatePatch } from "./operationalStatePatch";
import { createOperationalPlayerView, type OperationalViewArguments } from "./operationalViewProjection";
import { assertPerformanceBudgets, ciTime, runPerformanceTest } from "../../../../../tests/support/performanceBudget";

it("bounds compacted synthetic large-clinic pulses and camera-only projections without changing their bytes", () => runPerformanceTest(() => {
  // The existing public geometry/history workload passes through the real
  // retention boundary. No owner-derived records or byte padding are used.
  const state = deserializeGameState(serializeGameState(publicCloudOpeningWorkload()));
  expect(state.rooms).toHaveLength(180); expect(state.employees).toHaveLength(50);
  const engine = new OperationalEngineProcessor(), checkpoint = createGameEvidenceCheckpoint(state);
  let id = 1, version = 0, visible = state;
  const projection = { revision: 0, args: [null, false, null] as [null, boolean, null], asOfRealMs: 0 };
  const initial = engine.handle({ id: id++, kind: "initialize", checkpoint, visibleState: state, atRealMs: 0, snapshotOnly: true, projection });
  if (initial.kind !== "initialized") throw Error("Synthetic initialization failed");
  const pulses: number[] = [], pans: number[] = [];
  for (let i = 0; i < 20; i++) {
    const start = performance.now();
    const reply = engine.handle({ id: id++, kind: "command", expectedVersion: version,
      command: i === 0 ? { type: "SET_PAUSED", paused: false, operationId: "compact.play" }
        : { type: "ADVANCE_TICK", operationId: `compact.tick.${i}`, advancedAtRealMs: 1_800_000_000_000 + i * 1_000 }, projection });
    const elapsed = performance.now() - start;
    if (reply.kind !== "applied") throw Error("Synthetic pulse failed");
    version = reply.version; visible = applyOperationalStatePatch(visible, reply.patch);
    if (i > 3) pulses.push(elapsed);
    const args: OperationalViewArguments = [null, false, null, false, null, 0, { zoom: 1.4, panX: i * 7, panY: -i * 3 }, [], false];
    const panArgs: OperationalViewArguments = [null, false, null, false, null, 0, { zoom: 1.6, panX: i, panY: i }, [], false];
    // First pan changes the optional argument tuple and therefore invalidates
    // reuse. The next request changes the camera only, as the UI does.
    engine.handle({ id: id++, kind: "project", expectedVersion: version, projection: { ...projection, args: [...args] } });
    const at = performance.now(), pan = engine.handle({ id: id++, kind: "project", expectedVersion: version,
      projection: { ...projection, args: panArgs, asOfRealMs: i * 60_000 } });
    pans.push(performance.now() - at);
    if (pan.kind !== "projected") throw Error("Synthetic projection failed");
    expect(JSON.stringify(pan.projection.patch ?? null).length).toBeLessThan(10_000);
    // Compare a complete independent view, not just the camera field.
    const full = createOperationalPlayerView(visible, panArgs, i * 60_000);
    // Reconstruct the two successive view patches before comparing.
    const one = createOperationalPlayerView(visible, [...args], 0);
    expect(JSON.stringify(applyOperationalStatePatch(one, pan.projection.patch))).toBe(JSON.stringify(full));
  }
  const median = (values: number[]) => values.sort((a, b) => a - b)[Math.floor(values.length / 2)]!;
  const pulse = median(pulses), pan = median(pans);
  console.info("Compacted synthetic clinic engine", JSON.stringify({ pulseMedianMs: pulse, panMedianMs: pan }));
  assertPerformanceBudgets([
    { label: "compacted public clinic pulse", actualMs: pulse, limitMs: ciTime(50) },
    { label: "unchanged-state camera request", actualMs: pan, limitMs: ciTime(8) },
  ]);
}), ciTime(120_000));
