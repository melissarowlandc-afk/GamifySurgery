import { afterEach, expect, it, vi } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { createDiagnosticWorkload } from "../../../../../tests/fixtures/diagnostic-workload";
import { getDiagnosticOrderPlans, hasOutstandingDiagnosticWork, PROTOTYPE_DOMAIN_CONTEXT, type GameCommand } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../viewModels";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { cloudCodec } from "./codecWorker";
import { tickSession } from "./tickPerformanceTestSupport";
import * as legacyGraph from "../../../../../packages/game-domain/src/facilityPathCache";
const hostedTime = (ms: number) => process.env.CI ? ms * 10 : ms;
afterEach(() => vi.restoreAllMocks());

it("bounds the full account tick and chart projection on synthetic L3 diagnostic/staff pressure", async () => {
  const fixture = createDiagnosticWorkload();
  expect(fixture.state.rooms).toHaveLength(96); expect(fixture.state.doors).toHaveLength(41); expect(fixture.state.employees).toHaveLength(25);
  expect(fixture.state.serviceOperations.filter(operation => operation.status !== "completed" && operation.status !== "cancelled")).toHaveLength(9);
  expect(fixture.state.serviceOperations.length).toBeGreaterThan(25);
  expect(getDiagnosticOrderPlans(fixture.state).filter(hasOutstandingDiagnosticWork)).toHaveLength(2);
  const copyGraph = vi.spyOn(legacyGraph, "cachedFacilityAdjacency");
  const codec = cloudCodec.run.bind(cloudCodec);
  vi.spyOn(cloudCodec, "run").mockImplementation(async task => task.kind === "journalWarm"
    ? { through: (await f.cache.journal!.head(cloudCampaignStorageKey(f.scope)))!.highWater } as never : codec(task));
  const f = await tickSession(fixture.state);
  const execute = (command: GameCommand) => f.session.execute(command, PROTOTYPE_DOMAIN_CONTEXT);
  const ticks: { speed: number; executeMs: number; viewMs: number }[] = [], charts: number[] = [];
  try {
    createPrototypePlayerView(f.session.state, null, false, null);
    createPrototypePlayerView(f.session.state, fixture.chartId, false, null);
    for (let i = 0; i < 170; i++) {
      expect(execute({ type: "SET_SIMULATION_SPEED", speed: i % 2 ? 2 : 4, operationId: `diagnostic.tail.${i}` })).toBeTruthy();
      expect(await f.session.durable()).toBe(true);
    }
    for (const speed of [1, 2, 4] as const) {
      execute({ type: "SET_SIMULATION_SPEED", speed, operationId: `diagnostic.speed.${speed}` }); await f.session.durable();
      for (let i = 0; i < 12; i++) {
        let start = performance.now();
        execute({ type: "ADVANCE_TICK", operationId: `diagnostic.tick.${speed}.${i}`, advancedAtRealMs: 1800000000000 + ticks.length * 1000 });
        const executeMs = performance.now() - start;
        start = performance.now(); createPrototypePlayerView(f.session.state, null, false, null);
        ticks.push({ speed, executeMs, viewMs: performance.now() - start });
        expect(await f.session.durable()).toBe(true);
      }
    }
    for (let i = 0; i < 12; i++) {
      const start = performance.now(); createPrototypePlayerView({ ...f.session.state }, fixture.chartId, false, null); charts.push(performance.now() - start);
    }
    expect(copyGraph).not.toHaveBeenCalled(); // No whole-graph copy, including cache hits.
    if (process.env.OWNER_SYNTHETIC_MEASUREMENT) {
      const out = new URL("../../../../../.local-dev/owner-perf-20261104/", import.meta.url); mkdirSync(out, { recursive: true });
      writeFileSync(new URL("synthetic.json", out), JSON.stringify({ bytes: f.copy.snapshot.uncompressedBytes, compressedBytes: f.copy.snapshot.compressedBytes, ticks, charts }, null, 2));
    }
    for (const speed of [1, 2, 4]) expect(Math.max(...ticks.filter(t => t.speed === speed).map(t => t.executeMs + t.viewMs)), `${speed}x tick + overview`).toBeLessThan(hostedTime(16));
    expect(Math.max(...charts), "chart projection").toBeLessThan(hostedTime(50));
  } finally { f.session.dispose(); }
}, hostedTime(120_000));
