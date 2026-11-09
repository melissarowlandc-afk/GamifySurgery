import { afterEach, expect, it, vi } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { Session } from "node:inspector";
import * as domain from "@gamify-surgery/game-domain";
import * as reducer from "../../../../../packages/game-domain/src/reducer";
import * as normalization from "../../../../../packages/game-domain/src/game-evidence-index";
import * as evidenceJson from "../../../../../packages/game-domain/src/game-evidence-json";
import * as evidenceCapture from "../../../../../packages/game-domain/src/game-evidence-capture";
import * as tickClone from "../../../../../packages/game-domain/src/tickStateClone";
import * as guidance from "../../../../../packages/game-domain/src/guidance-tips";
import * as availability from "../../../../../packages/game-domain/src/routine-patient-availability";
import * as navigation from "../../../../../packages/game-domain/src/facilityPathCache";
import { createPrototypePlayerView } from "../viewModels";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { LocalJournalDrain, freezeJournalCheckpoint, journalWorkerAddress } from "../localJournal";
import { cloudCodec } from "./codecWorker";
import { runCloudCodecTask } from "./codecTasks";
import { completeSnapshotLearning } from "./snapshotLearning";
import { loadCloudEvidenceCheckpoint } from "./codecEvidence";
import { tickCommand, tickSession } from "./tickPerformanceTestSupport";

const hostedTime = (ms: number) => process.env.CI ? ms * 10 : ms;
const output = new URL("../../../../../.local-dev/tick-stutter-20261104/", import.meta.url);
afterEach(() => vi.restoreAllMocks());

it("attributes the retained large snapshot tick path and 170-command tail", async () => {
  const codec = cloudCodec.run.bind(cloudCodec);
  // The production codec runs off-thread. Isolate its CPU from the synchronous
  // command measurements under Vitest's inline codec, then measure it below.
  vi.spyOn(cloudCodec, "run").mockImplementation(async task => task.kind === "journalWarm"
    ? { through: (await f.cache.journal!.head(cloudCampaignStorageKey(f.scope)))!.highWater } as never : codec(task));
  const f = await tickSession();
  // The real app renders its initial state before starting the facility clock.
  const initialViewStart = performance.now();
  createPrototypePlayerView(f.session.state, f.session.state.openChartEncounterId, false, null);
  const initialViewMs = performance.now() - initialViewStart;
  const stages: Record<string, number[]> = {};
  const track = <T>(name: string, work: () => T): T => {
    const start = performance.now();
    try { return work(); } finally { (stages[name] ??= []).push(performance.now() - start); }
  };
  const command = domain.applyGameEvidenceCommand, delta = domain.gameEvidenceDelta;
  const reduce = reducer.gameReducer, normalize = normalization.normalizeEvidence;
  const freeze = evidenceJson.freezeEvidence, equal = evidenceJson.jsonEqual;
  const retirement = evidenceCapture.captureBeforeGameRetirement;
  const clone = tickClone.cloneTickState, guide = guidance.advanceGuidanceTips;
  const available = availability.getRoutinePatientAvailability, graph = navigation.cachedFacilityAdjacency;
  const accept = LocalJournalDrain.prototype.accept;
  vi.spyOn(domain, "applyGameEvidenceCommand").mockImplementation((...args) => track("evidenceCommand", () => command(...args)));
  vi.spyOn(domain, "gameEvidenceDelta").mockImplementation((...args) => track("journalDelta", () => delta(...args)));
  vi.spyOn(reducer, "gameReducer").mockImplementation((...args) => track("reducer", () => reduce(...args)));
  vi.spyOn(normalization, "normalizeEvidence").mockImplementation((...args) => track("normalize", () => normalize(...args)));
  vi.spyOn(evidenceJson, "freezeEvidence").mockImplementation((...args) => track("freeze", () => freeze(...args)));
  vi.spyOn(evidenceJson, "jsonEqual").mockImplementation((...args) => track("equality", () => equal(...args)));
  vi.spyOn(evidenceCapture, "captureBeforeGameRetirement").mockImplementation((...args) => track("retirementObserver", () => retirement(...args)));
  vi.spyOn(tickClone, "cloneTickState").mockImplementation((...args) => track("tickClone", () => clone(...args)));
  vi.spyOn(guidance, "advanceGuidanceTips").mockImplementation((...args) => track("guidance", () => guide(...args)));
  vi.spyOn(availability, "getRoutinePatientAvailability").mockImplementation((...args) => track("routineAvailability", () => available(...args)));
  vi.spyOn(navigation, "cachedFacilityAdjacency").mockImplementation((...args) => track("pathGraph", () => graph(...args)));
  vi.spyOn(LocalJournalDrain.prototype, "accept").mockImplementation(function (this: LocalJournalDrain, ...args) {
    return track("journalAccept", () => accept.apply(this, args));
  });
  const inspector = process.env.TICK_CPU_PROFILE ? new Session() : null;
  const post = (method: string) => new Promise<Record<string, unknown>>((resolve, reject) => inspector!.post(method, (error, result) => error ? reject(error) : resolve((result ?? {}) as Record<string, unknown>)));
  const ticks: { tail: number; executeMs: number; viewMs: number; syncViewMs: number; stages: Record<string, number> }[] = [];
  const commits: number[] = [];
  const append = f.cache.journal!.append.bind(f.cache.journal!);
  vi.spyOn(f.cache.journal!, "append").mockImplementation(async (...args) => {
    const start = performance.now();
    try { return await append(...args); } finally { commits.push(performance.now() - start); }
  });
  let observerMs = 0;
  const unsubscribe = f.session.subscribe(() => {
    const start = performance.now(); void f.session.syncView; observerMs += performance.now() - start;
  });
  try {
    if (inspector) { inspector.connect(); await post("Profiler.enable"); await post("Profiler.start"); }
    for (let i = 0; i < 182; i++) {
      const priorSamples = Object.fromEntries(Object.entries(stages).map(([name, samples]) => [name, samples.length]));
      const start = performance.now();
      expect(f.session.execute(tickCommand(i, f.state.createdAtRealMs), domain.PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
      const executeMs = performance.now() - start;
      const tickStages = Object.fromEntries(Object.entries(stages).map(([name, samples]) => [name,
        samples.slice(priorSamples[name] ?? 0).reduce((a, b) => a + b, 0)]));
      if (i % 32 === 0) expect(await f.session.durable()).toBe(true);
      if (i < 5 || i >= 170) {
        const sync = performance.now(); void f.session.syncView; const syncViewMs = performance.now() - sync;
        const view = performance.now(); createPrototypePlayerView(f.session.state, f.session.state.openChartEncounterId, false, null);
        ticks.push({ tail: i, executeMs, viewMs: performance.now() - view, syncViewMs, stages: tickStages });
      }
    }
    if (inspector) {
      const profile = await post("Profiler.stop");
      mkdirSync(output, { recursive: true }); writeFileSync(new URL(`${process.env.TICK_MEASUREMENT ?? "profile"}.cpuprofile`, output), JSON.stringify(profile.profile));
      inspector.disconnect();
    }
    expect(await f.session.durable()).toBe(true);
    const journal = f.cache.journal!, key = cloudCampaignStorageKey(f.scope), head = (await journal.head(key))!;
    const commit = performance.now();
    const commitRows = await journal.read(key);
    const journalReadMs = performance.now() - commit;
    const warm = performance.now();
    await runCloudCodecTask({ kind: "journalWarm", input: { address: journalWorkerAddress(journal, key), owner: head.owner } });
    const workerWarmMs = performance.now() - warm;
    const learning = performance.now(); expect(completeSnapshotLearning(f.session.state)).toBe(f.session.state);
    const learningMs = performance.now() - learning;
    const summary = Object.fromEntries(Object.entries(stages).map(([name, samples]) => [name, {
      count: samples.length, totalMs: samples.reduce((a, b) => a + b, 0), maxMs: Math.max(...samples),
      last12MeanMs: samples.slice(-12).reduce((a, b) => a + b, 0) / Math.min(12, samples.length),
    }]));
    const measurement = { stateBytes: Buffer.byteLength(JSON.stringify(f.state)), snapshotBytes: f.copy.snapshot.uncompressedBytes,
      facilityLevel: f.state.facilityLevel, facilityTick: f.state.facilityTick, encounters: Object.keys(f.state.encounters).length,
      concepts: Object.keys(f.state.learningHistories).length, tail: head.highWater - head.snapshotThrough,
      ticks, stages: summary, observerMs, workerWarmMs, learningMs, journalReadMs, journalRows: commitRows!.rows.length, commits, initialViewMs, openingMs: f.openingMs };
    if (process.env.TICK_MEASUREMENT) {
      mkdirSync(output, { recursive: true });
      writeFileSync(new URL(`${process.env.TICK_MEASUREMENT}-measurement.json`, output), JSON.stringify(measurement, null, 2));
    }
    expect(measurement.tail).toBe(182);
    expect(ticks[0]!.executeMs + ticks[0]!.viewMs, "first real tick plus complete view frame budget").toBeLessThan(hostedTime(16));
    const steady = ticks.filter(tick => tick.tail >= 170).map(tick => tick.executeMs + tick.viewMs);
    expect(Math.max(...steady), "every steady tick plus complete view frame budget").toBeLessThan(hostedTime(16));
  } finally { unsubscribe(); inspector?.disconnect(); f.session.dispose(); }
}, hostedTime(120_000));

it("compares uninstrumented reducer and evidence ticks at 1x/2x/4x with an exact 170-command tail", async () => {
  // This controls for profiler/mock overhead and distinguishes session work
  // from a domain reducer that already clones the full current GameState.
  const codec = cloudCodec.run.bind(cloudCodec);
  vi.spyOn(cloudCodec, "run").mockImplementation(async task => task.kind === "journalWarm"
    ? { through: (await f.cache.journal!.head(cloudCampaignStorageKey(f.scope)))!.highWater } as never : codec(task));
  const f = await tickSession();
  const records: { speed: number; tail: number; reducerMs: number; executeMs: number; viewMs: number }[] = [];
  const reference = await loadCloudEvidenceCheckpoint({ ...f.copy, expectedRevision: f.copy.revision,
    expectedCampaignId: f.scope.campaignId, expectedBaselineId: f.copy.baselineId });
  let checkpoint = freezeJournalCheckpoint(reference.checkpoint);
  const applyReference = (command: domain.GameCommand) => {
    const result = domain.applyGameEvidenceCommand(checkpoint, command, domain.PROTOTYPE_DOMAIN_CONTEXT);
    checkpoint = result.checkpoint; return result.state;
  };
  try {
    for (let i = 0; i < 170; i++) {
      const command: domain.GameCommand = { type: "SET_SIMULATION_SPEED", speed: i % 2 ? 2 : 4, operationId: `tail.${i}` };
      const expected = applyReference(command);
      expect(f.session.execute(command, domain.PROTOTYPE_DOMAIN_CONTEXT)).toStrictEqual(expected);
      if (i % 32 === 0) expect(await f.session.durable()).toBe(true);
    }
    expect(await f.session.durable()).toBe(true);
    const head = (await f.cache.journal!.head(cloudCampaignStorageKey(f.scope)))!;
    expect(head.highWater - head.snapshotThrough).toBe(170);
    for (const speed of [1, 2, 4] as const) {
      const setting: domain.GameCommand = { type: "SET_SIMULATION_SPEED", speed, operationId: `speed.${speed}` };
      expect(f.session.execute(setting, domain.PROTOTYPE_DOMAIN_CONTEXT)).toStrictEqual(applyReference(setting));
      for (let i = 0; i < 12; i++) {
        const previous = f.session.state, command = tickCommand(speed * 100 + i, previous.createdAtRealMs);
        const reduce = performance.now(), expected = domain.gameReducer(previous, command, domain.PROTOTYPE_DOMAIN_CONTEXT);
        const reducerMs = performance.now() - reduce;
        const currentPath = applyReference(command);
        const start = performance.now(), actual = f.session.execute(command, domain.PROTOTYPE_DOMAIN_CONTEXT);
        const executeMs = performance.now() - start;
        expect(actual).toStrictEqual(expected);
        expect(actual).toStrictEqual(currentPath);
        expect(JSON.stringify(actual)).toBe(JSON.stringify(currentPath));
        const view = performance.now(); createPrototypePlayerView(actual!, actual!.openChartEncounterId, false, null);
        records.push({ speed, tail: 170 + records.length, reducerMs, executeMs, viewMs: performance.now() - view });
        expect(await f.session.durable()).toBe(true);
      }
    }
    if (process.env.TICK_MEASUREMENT) {
      mkdirSync(output, { recursive: true });
      writeFileSync(new URL(`${process.env.TICK_MEASUREMENT}-uninstrumented.json`, output), JSON.stringify({ snapshotBytes: f.copy.snapshot.uncompressedBytes, records }, null, 2));
    }
    for (const speed of [1, 2, 4]) {
      const frames = records.filter(record => record.speed === speed).map(record => record.executeMs + record.viewMs);
      expect(Math.max(...frames), `every ${speed}x tick plus view frame budget`).toBeLessThan(hostedTime(16));
    }
  } finally { f.session.dispose(); }
}, hostedTime(120_000));
