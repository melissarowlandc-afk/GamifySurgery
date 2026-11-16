import { expect, it } from "vitest";
import { applyGameEvidenceCommand, createGameEvidenceCheckpoint, type GameCommand } from "@gamify-surgery/game-domain";
import { publicCloudOpeningWorkload } from "./openingPerformanceTestSupport";
import { OperationalEngineProcessor } from "./operationalEngineProcessor";
import { applyOperationalStatePatch } from "./operationalStatePatch";
import { assertPerformanceBudgets, ciTime as hostedTime, runPerformanceTest } from "../../../../../tests/support/performanceBudget";

it("bounds large public-clinic engine work and history publication with exact synchronous checkpoints", () => runPerformanceTest(() => {
  const initial = publicCloudOpeningWorkload(), engine = new OperationalEngineProcessor();
  let expected = createGameEvidenceCheckpoint(initial), state = initial, id = 1, version = 0;
  const projection = { revision: 0, args: [null, false, null] as [null, boolean, null], asOfRealMs: 0 };
  expect(initial.rooms).toHaveLength(180); expect(initial.serviceIncomeReceipts).toHaveLength(1_500);
  expect(engine.handle({ id: id++, kind: "initialize", checkpoint: expected, visibleState: initial, snapshotOnly: true, atRealMs: 0, projection }).kind).toBe("initialized");
  const times: number[] = [], viewBytes: number[] = [];
  const apply = (command: GameCommand, measure: boolean) => {
    const start = performance.now();
    const reply = engine.handle({ id: id++, kind: "command", command, expectedVersion: version, projection });
    const elapsed = performance.now() - start;
    expect(reply.kind).toBe("applied"); if (reply.kind !== "applied") throw Error("Expected applied command");
    version = reply.version; state = applyOperationalStatePatch(state, structuredClone(reply.patch));
    const control = applyGameEvidenceCommand(expected, command); expected = control.checkpoint;
    expect(JSON.stringify(state)).toBe(JSON.stringify(control.state));
    if (measure) { times.push(elapsed); viewBytes.push(JSON.stringify(reply.projection?.patch ?? null).length); }
  };
  apply({ type: "SET_PAUSED", paused: false, operationId: "large.play" }, false);
  for (const speed of [1, 2, 4] as const) {
    apply({ type: "SET_SIMULATION_SPEED", speed, operationId: `large.speed.${speed}` }, false);
    for (let tick = 0; tick < 8; tick++) apply({ type: "ADVANCE_TICK", advancedAtRealMs: 1_800_000_000_000 + id * 1_000, operationId: `large.tick.${speed}.${tick}` }, true);
  }
  const checkpoint = engine.handle({ kind: "checkpoint", id: id++, expectedVersion: version });
  expect(checkpoint.kind).toBe("checkpoint");
  if (checkpoint.kind === "checkpoint") expect(JSON.stringify(checkpoint.checkpoint)).toBe(JSON.stringify(expected));
  // Deterministic payload ceiling complements CI-tolerant wall-time checks.
  // A shifted 1,500-row receipt history must not reappear in every view patch.
  expect(Math.max(...viewBytes)).toBeLessThan(100_000);
  const median = [...times].sort((a, b) => a - b)[Math.floor(times.length / 2)]!;
  console.info("Large public clinic engine", JSON.stringify({ commands: times.length, medianMs: median, maxViewBytes: Math.max(...viewBytes) }));
  assertPerformanceBudgets([{ label: "large public clinic pulse including view", actualMs: median, limitMs: hostedTime(50) }]);
}), hostedTime(120_000));
