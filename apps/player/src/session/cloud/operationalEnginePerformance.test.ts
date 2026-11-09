import { expect, it } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { performance as nodePerformance } from "node:perf_hooks";
import { setImmediate as immediate, setTimeout as delay } from "node:timers/promises";
import { createGameEvidenceCheckpoint, restoreGameEvidenceJournal, type GameCommand } from "@gamify-surgery/game-domain";
import { createDiagnosticWorkload } from "../../../../../tests/fixtures/diagnostic-workload";
import { LocalJournalDrain, MemoryJournalStorage } from "../localJournal";
import { OperationalEngineClient } from "./operationalEngineClient";
import { nativeOperationalEngineTestPort } from "./operationalEngineNativeTestSupport";
import { codecTestCampaign } from "./codecTestSupport";
import { sha256Utf8 } from "./codecJson";

const hostedTime = (ms: number) => process.env.CI ? ms * 10 : ms;

it("keeps native-worker account tick publication, journaling and supplied overview/chart below one frame on the public L3 workload", async () => {
  const fixture = createDiagnosticWorkload(), atRealMs = 1_800_000_000_000;
  expect(fixture.state.rooms).toHaveLength(96); expect(fixture.state.doors).toHaveLength(41); expect(fixture.state.employees).toHaveLength(25);
  const initial = createGameEvidenceCheckpoint(fixture.state), campaign = codecTestCampaign(JSON.stringify(fixture.state));
  const client = await OperationalEngineClient.create({ checkpoint: initial, visibleState: fixture.state, atRealMs,
    projection: { revision: 0, args: [null, false, null], asOfRealMs: atRealMs } }, nativeOperationalEngineTestPort);
  const store = new MemoryJournalStorage(), key = "public.operational.perf", owner = "public.operational.perf";
  const seed = { checkpoint: initial, campaign, source: null, confirmed: null, usageQuestions: [] };
  await store.bind(key, owner, null, seed, await sha256Utf8(JSON.stringify(seed)));
  const drain = new LocalJournalDrain(store, key, owner, 0, () => {});
  const metrics: { speed: number; mainMs: number; activeMs: number; publishMs: number; workerMs: number; elapsedMs: number; chart: boolean }[] = [];
  const accept = (result: Awaited<ReturnType<typeof client.execute>>, tick = false) => drain.accept({ delta: result.delta, campaign, usageQuestions: [] }, tick);
  try {
    // A real 170-command journal prefix, not a padded byte array. Every original
    // delta is durable before measuring; subsequent work cannot scan that tail.
    for (let i = 0; i < 170; i++) {
      accept(await client.execute({ type: "SET_SIMULATION_SPEED", speed: i % 2 ? 2 : 4, operationId: `worker.tail.${i}` }));
      expect(await drain.drain()).toBe(true);
    }
    for (const speed of [1, 2, 4] as const) {
      const chart = speed === 2;
      await client.project([chart ? fixture.chartId : null, false, null], atRealMs);
      accept(await client.execute({ type: "SET_SIMULATION_SPEED", speed, operationId: `worker.speed.${speed}` }));
      expect(await drain.drain()).toBe(true);
      let nextTickAt = performance.now();
      for (let i = 0; i < 12; i++) {
        const wait = nextTickAt - performance.now(); if (wait > 0) await delay(wait); nextTickAt += 1000 / speed;
        const command: GameCommand = { type: "ADVANCE_TICK", operationId: `worker.tick.${speed}.${i}`, advancedAtRealMs: atRealMs + metrics.length * 1000 / speed };
        await immediate(); const utilization = nodePerformance.eventLoopUtilization();
        const result = await client.execute(command), start = performance.now();
        accept(result, true); expect(result.view).toBe(client.view);
        const journalAndReadMs = performance.now() - start;
        await immediate();
        metrics.push({ speed, chart, mainMs: result.timing.captureMs + result.timing.postMs + result.timing.publishMs + journalAndReadMs,
          activeMs: nodePerformance.eventLoopUtilization(utilization).active, publishMs: result.timing.publishMs,
          workerMs: result.timing.workerComputeMs + result.timing.workerDiffMs + (result.projection?.computeMs ?? 0) + (result.projection?.diffMs ?? 0),
          elapsedMs: result.timing.elapsedMs });
      }
    }
    expect(await drain.drain()).toBe(true); await client.idle();
    const data = await store.read(key); expect(data).not.toBeNull();
    const restored = restoreGameEvidenceJournal(initial, data!.rows.map(row => row.delta).filter(delta => delta !== null));
    const checkpoint = await client.checkpoint();
    expect(JSON.stringify(restored.evidence)).toBe(JSON.stringify(checkpoint.evidence));
    if (process.env.OPERATIONAL_ENGINE_MEASUREMENT === "1") {
      const folder = new URL("../../../../../.local-dev/evidence-tick-20261104/", import.meta.url); mkdirSync(folder, { recursive: true });
      writeFileSync(new URL("public-engine.json", folder), JSON.stringify({ stateBytes: JSON.stringify(fixture.state).length, tailCommands: 170, metrics }, null, 2));
    }
    for (const speed of [1, 2, 4]) {
      const rows = metrics.filter(row => row.speed === speed);
      expect(Math.max(...rows.map(row => row.mainMs)), `${speed}x published state + view + journal`).toBeLessThan(hostedTime(16));
      expect(Math.max(...rows.map(row => row.activeMs)), `${speed}x main active CPU including native message delivery`).toBeLessThan(hostedTime(16));
    }
    expect(Math.max(...metrics.filter(row => row.chart).map(row => row.mainMs)), "chart publication").toBeLessThan(hostedTime(50));
    // Report timings separately: worker wall latency is not main-thread CPU.
    console.info("Operational worker public fixture", JSON.stringify({
      rawStateBytes: JSON.stringify(fixture.state).length, retainedCommands: data!.rows.length,
      speeds: [1, 2, 4].map(speed => { const rows = metrics.filter(row => row.speed === speed); return { speed,
        mainMaxMs: Math.max(...rows.map(row => row.mainMs)), activeMaxMs: Math.max(...rows.map(row => row.activeMs)),
        workerMaxMs: Math.max(...rows.map(row => row.workerMs)), wallMaxMs: Math.max(...rows.map(row => row.elapsedMs)) }; }),
    }));
  } finally { drain.stop(); client.dispose(); }
}, hostedTime(120_000));
