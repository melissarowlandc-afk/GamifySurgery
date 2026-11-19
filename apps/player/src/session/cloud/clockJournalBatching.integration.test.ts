import { afterEach, expect, it, vi } from "vitest";
import { applyGameEvidenceCommand, applyGameEvidenceJournalPatches, createGameEvidenceCheckpoint, gameEvidenceDelta, importGameEvidence, restoreGameEvidenceJournal, PROTOTYPE_DOMAIN_CONTEXT, type GameCommand, type GameEvidenceDelta } from "@gamify-surgery/game-domain";
import { startFacilityClock } from "../facilityClock";
import { SessionActions } from "../sessionActions";
import { operationalSessionFixture } from "./operationalSessionTestSupport";
import { OperationalEngineProcessor } from "./operationalEngineProcessor";
import { bindJournal, prepareJournal } from "./journalCodec";
import { LocalJournalDrain, MemoryJournalStorage, type JournalSeed } from "../localJournal";
import { CloudCodecWorker } from "./codecWorker";
import { CloudCacheError } from "./codecCache";
import { deferred } from "./syncTestSupport";
import { materializeClockJournalDeltas } from "../clockJournalDelta";
import type { OperationalEngineRequest } from "./operationalEngineProtocol";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { CadencePort, cadenceState, nativeWorkIdle, observeCodecWork, scheduler } from "./tickAdmissionCadenceTestSupport";

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

it.each([true, false])("admits sixty healthy account seconds without increasing journal writes and Save & Close keeps the exact prefix (worker=%s)", async operational => {
  const codecBusy = observeCodecWork(), ports: CadencePort[] = [];
  const f = await operationalSessionFixture({ createPort: () => { const port = new CadencePort(); ports.push(port); return port; } }, cadenceState(), operational);
  let nativeAppends = 0;
  const busy = () => codecBusy() || nativeAppends > 0 || ports.some(port => port.outstanding.size > 0);
  expect(await f.session.durable()).toBe(true); await nativeWorkIdle(busy);
  const originalAppend = f.coordinator.journal!.append.bind(f.coordinator.journal);
  const append = vi.spyOn(f.coordinator.journal!, "append").mockImplementation(async (...args) => {
    nativeAppends++;
    try { return await originalAppend(...args); } finally { nativeAppends--; }
  }), writes = vi.spyOn(f.cache, "write");
  const releases = vi.spyOn(OperationalEngineProcessor.prototype, "releaseJournalDeltas");
  const actions = new SessionActions(true); f.session.bindCommandActions(actions);
  const start = f.session.state.facilityTick, before = createGameEvidenceCheckpoint(f.session.state), commands: GameCommand[] = [];
  vi.useFakeTimers({ toFake: ["Date", "setTimeout", "clearTimeout", "setInterval", "clearInterval"] }); vi.setSystemTime(f.clock.wall);
  const stop = startFacilityClock(scheduler, 1_000,
    () => ({ tick: f.session.state.facilityTick, paused: f.session.state.paused, speed: 1, visible: true, allowed: f.session.canExecute }),
    () => {
      const command = { type: "ADVANCE_TICK" as const, advancedAtRealMs: Date.now(), operationId: `public.clock-budget.${commands.length}` };
      commands.push(command); actions.tick(() => f.session.advanceClock(command, PROTOTYPE_DOMAIN_CONTEXT));
    });
  try {
    for (let second = 1; second <= 60; second++) {
      f.clock.advance(1_000); await vi.advanceTimersByTimeAsync(1_000); await nativeWorkIdle(busy);
      // Normal heartbeat/lease maintenance; never force a per-tick disk drain.
      await f.session.pulse(); await nativeWorkIdle(busy);
      expect(f.session.syncView.failure).toBeNull();
      expect(f.session.state.facilityTick - start).toBe(second);
    }
    stop(); expect(commands).toHaveLength(60);
    expect(await f.session.durable()).toBe(true); await nativeWorkIdle(busy);
    // Release-42 baseline admits only thirty pulses and writes thirty rows.
    expect(append.mock.calls.length).toBeLessThanOrEqual(30);
    expect(append.mock.calls.reduce((count, call) => count + call[3].length, 0)).toBeLessThanOrEqual(30);
    expect(writes).not.toHaveBeenCalled();
    let reference = before;
    for (const command of commands) reference = applyGameEvidenceCommand(reference, command, PROTOTYPE_DOMAIN_CONTEXT).checkpoint;
    expect(JSON.stringify(f.session.state)).toBe(JSON.stringify(importGameEvidence(reference.snapshot, reference.evidence)));
    if (operational) {
      const released = releases.mock.calls.flatMap(call => [...call[0]]);
      expect(released).toHaveLength(60); expect(new Set(released).size).toBe(60);
      const hashInputs = ports.flatMap(port => port.inner.messages.flatMap(request => request.kind === "journalHashes" ? [...request.rows] : []));
      expect(hashInputs.some(row => row.deltaVersions?.length === 3)).toBe(true);
      expect(hashInputs.every(row => row.row.delta === null)).toBe(true); // No full-delta round trip.
    }
    expect(await f.session.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    const restored = await prepareJournal(f.coordinator.journal!, cloudCampaignStorageKey(f.scope), f.coordinator.codec, { local: true, encode: false });
    expect(restored!.state!.paused).toBe(true);
    expect(JSON.stringify(restored!.state)).toBe(JSON.stringify(f.session.state));
    expect(restored!.state!.facilityTick).toBe(start + 60);
  } finally { stop(); f.session.dispose(); f.coordinator.dispose(); }
}, 120_000);

it("repairs a programming exception after a clock delta was coalesced without mistaking an unchanged row version for no admission", async () => {
  const f = await operationalSessionFixture({}, cadenceState());
  try {
    expect(await f.session.durable()).toBe(true);
    const start = f.session.state.facilityTick;
    expect(await f.session.advanceClock({ type: "ADVANCE_TICK", operationId: "public.batch-repair.1" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    const publication = vi.spyOn(f.session as unknown as { publishCommand(): void }, "publishCommand");
    publication.mockImplementationOnce(() => { throw new TypeError("synthetic publication failure"); });
    expect(await f.session.advanceClock({ type: "ADVANCE_TICK", operationId: "public.batch-repair.2" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(f.session.state.facilityTick).toBe(start + 2);
    expect(f.session.syncView).toMatchObject({ canExecute: true, failure: null, localDurable: true });
    const restored = await prepareJournal(f.coordinator.journal!, cloudCampaignStorageKey(f.scope), f.coordinator.codec, { local: true, encode: false });
    expect(JSON.stringify(restored!.state)).toBe(JSON.stringify(f.session.state));
    expect(restored!.state!.operationReceipts["public.batch-repair.2"]).toBeDefined();
  } finally { f.session.dispose(); f.coordinator.dispose(); }
});

it("materializes a bounded clock batch once, without visiting prior patches on each admission", async () => {
  const state = cadenceState(), baseline = createGameEvidenceCheckpoint(state), f = await operationalSessionFixture({}, state);
  const seed: JournalSeed = { checkpoint: baseline, campaign: f.session.metadata, source: null, confirmed: null, usageQuestions: [] };
  const store = new MemoryJournalStorage(), codec = new CloudCodecWorker(null);
  const head = await bindJournal(store, "public.delta-list", "owner", seed, codec);
  const drain = new LocalJournalDrain(store, "public.delta-list", "owner", head.highWater, () => {});
  let checkpoint = baseline, patchReads = 0;
  vi.useFakeTimers({ toFake: ["Date", "setTimeout", "clearTimeout"] });
  try {
    for (let i = 0; i < 64; i++) {
      const next = applyGameEvidenceCommand(checkpoint, { type: "ADVANCE_TICK", operationId: `public.delta-list.${i}`, advancedAtRealMs: i * 1000 }, PROTOTYPE_DOMAIN_CONTEXT);
      const original = gameEvidenceDelta(checkpoint, next.checkpoint);
      const observed: GameEvidenceDelta = { ...original, get patches() { patchReads++; return original.patches; } };
      drain.acceptAdmitted({ delta: observed, campaign: seed.campaign, usageQuestions: [] }, true, true);
      expect(patchReads).toBe(0); // No growing-prefix concatenation/serialization.
      checkpoint = next.checkpoint;
    }
    expect(drain.queued).toBe(64); expect(drain.highWater).toBe(head.highWater + 1);
    expect(await drain.drain()).toBe(true); expect(patchReads).toBe(64);
    const rows = (await store.read("public.delta-list"))!.rows;
    expect(rows).toHaveLength(1);
    expect(JSON.stringify(restoreGameEvidenceJournal(baseline, rows.map(row => row.delta!)))).toBe(JSON.stringify(checkpoint));
  } finally { drain.stop(); codec.dispose(); f.session.dispose(); f.coordinator.dispose(); }
});

it("compacts only independent assignments, preserving exact key order, deletions, array growth and prefix dependencies", () => {
  let random = 23;
  const next = () => (random = (Math.imul(random, 1664525) + 1013904223) >>> 0);
  for (let run = 0; run < 40; run++) {
    const initial = { actors: [{ id: "a", location: { x: 0, y: 0 } }], added: {} as Record<string, number> };
    let state = initial;
    const deltas: GameEvidenceDelta[] = [];
    for (let i = 0; i < 64; i++) {
      let patch: GameEvidenceDelta["patches"][number];
      const index = next() % state.actors.length, value = next() % 100, key = `k${next() % 5}`;
      switch (i % 12) {
        case 0: case 1: case 2:
          patch = { path: ["actors", "0", "location", "x"], present: true, value }; break;
        case 3: patch = { path: ["added", key], present: true, value }; break;
        case 4: patch = { path: ["actors", String(index), "location"], present: true, value: { x: value, y: value + 1 } }; break;
        case 5: patch = { path: ["actors", String(index), "location", "y"], present: true, value }; break;
        case 6: patch = { path: ["actors", String(state.actors.length)], present: true, value: { id: `a${i}`, location: { x: value, y: 0 } } }; break;
        case 7: patch = { path: ["actors", "length"], present: true, value: Math.max(1, state.actors.length - 1) }; break;
        case 8: patch = Object.hasOwn(state.added, key) ? { path: ["added", key], present: false } : { path: ["added", key], present: true, value }; break;
        case 9: patch = { path: ["added"], present: true, value: { first: value, second: value + 1 } }; break;
        case 10: patch = { path: [], present: true, value: structuredClone(state) }; break;
        default: patch = { path: ["added", "second"], present: true, value }; break;
      }
      state = applyGameEvidenceJournalPatches(state, [patch]) as typeof initial;
      deltas.push({ fromSequence: i, fromRecord: 0, head: { sequence: i + 1, transitionId: `compact.${i}` }, patches: [patch], records: [] });
    }
    const combined = materializeClockJournalDeltas(deltas)!;
    expect(combined.patches.length).toBeLessThan(deltas.length);
    expect(JSON.stringify(applyGameEvidenceJournalPatches(initial, combined.patches))).toBe(JSON.stringify(state));
  }
  const bad: GameEvidenceDelta = { fromSequence: 0, fromRecord: 0, head: { sequence: 1, transitionId: "bad" },
    patches: [{ path: ["added", "x"], present: true } as GameEvidenceDelta["patches"][number]], records: [] };
  const good: GameEvidenceDelta = { fromSequence: 1, fromRecord: 0, head: { sequence: 2, transitionId: "good" },
    patches: [{ path: ["added", "x"], present: true, value: 2 }], records: [] };
  expect(() => materializeClockJournalDeltas([bad, good])!.patches).toThrow();
});

it("keeps the final exact drain within twenty rows when the last clock reply crosses a background write deadline", async () => {
  class JitterPort extends CadencePort {
    held: OperationalEngineRequest | null = null;
    postMessage(request: OperationalEngineRequest): void {
      if (request.kind === "command" && request.command.operationId === "boundary.60") this.held = request;
      else super.postMessage(request);
    }
    release(): void {
      const held = this.held; this.held = null;
      if (!held) throw Error("No held final pulse"); super.postMessage(held);
    }
  }
  const codecBusy = observeCodecWork(), port = new JitterPort();
  const f = await operationalSessionFixture({ createPort: () => port }, cadenceState());
  expect(await f.session.durable()).toBe(true);
  let nativeAppends = 0, pulses = 0;
  const original = f.coordinator.journal!.append.bind(f.coordinator.journal);
  const append = vi.spyOn(f.coordinator.journal!, "append").mockImplementation(async (...args) => {
    nativeAppends++; try { return await original(...args); } finally { nativeAppends--; }
  });
  const busy = () => codecBusy() || nativeAppends > 0 || port.outstanding.size > 0;
  const actions = new SessionActions(true); f.session.bindCommandActions(actions);
  const start = f.session.state.facilityTick;
  vi.useFakeTimers({ toFake: ["Date", "setTimeout", "clearTimeout", "setInterval", "clearInterval"] }); vi.setSystemTime(f.clock.wall);
  const stop = startFacilityClock(scheduler, 1000,
    () => ({ tick: f.session.state.facilityTick, paused: false, speed: 1, visible: true, allowed: f.session.canExecute }),
    () => actions.tick(() => f.session.advanceClock({ type: "ADVANCE_TICK", advancedAtRealMs: Date.now(), operationId: `boundary.${++pulses}` }, PROTOTYPE_DOMAIN_CONTEXT)));
  try {
    for (let second = 1; second <= 60; second++) {
      for (let slice = 0; slice < 10; slice++) {
        f.clock.advance(100); await vi.advanceTimersByTimeAsync(100); await nativeWorkIdle(busy);
      }
      await f.session.pulse(); await nativeWorkIdle(busy);
    }
    expect(pulses).toBe(60); expect(port.held).not.toBeNull(); expect(f.session.state.facilityTick - start).toBe(59);
    f.clock.advance(100); await vi.advanceTimersByTimeAsync(100); port.release(); await nativeWorkIdle(busy);
    stop(); expect(f.session.state.facilityTick - start).toBe(60); expect(await f.session.durable()).toBe(true);
    expect(append.mock.calls.length).toBeLessThanOrEqual(20);
    expect(append.mock.calls.reduce((count, call) => count + call[3].length, 0)).toBeLessThanOrEqual(20);
  } finally { stop(); f.session.dispose(); f.coordinator.dispose(); }
});

it.each([true, false])("fences a reported journal timeout and retries its exact committed prefix before following clock work (worker=%s)", async operational => {
  const f = await operationalSessionFixture({}, cadenceState(), operational);
  expect(await f.session.durable()).toBe(true);
  const initial = f.session.state, baseline = createGameEvidenceCheckpoint(initial), entered = deferred(), gate = deferred();
  const store = f.coordinator.journal!, original = store.append.bind(store);
  let first = true;
  const append = vi.spyOn(store, "append").mockImplementation(async (...args) => {
    if (first) {
      first = false; entered.resolve(); await gate.promise;
      await original(...args); throw new CloudCacheError("timeout"); // Commit succeeded; acknowledgement lost.
    }
    return original(...args);
  });
  vi.useFakeTimers({ toFake: ["Date", "setTimeout", "clearTimeout"] }); vi.setSystemTime(f.clock.wall);
  const commands: GameCommand[] = [1, 2].map(i => ({ type: "ADVANCE_TICK", operationId: `uncertain.${i}`, advancedAtRealMs: f.clock.wall + i }));
  try {
    expect(await f.session.advanceClock(commands[0] as Extract<GameCommand, { type: "ADVANCE_TICK" }>, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    const prefix = f.session.durable(); await entered.promise;
    expect(await f.session.advanceClock(commands[1] as Extract<GameCommand, { type: "ADVANCE_TICK" }>, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    gate.resolve(); expect(await prefix).toBe(false);
    expect(f.session.syncView.storageRetrying).toBe(true);
    expect(await f.session.advanceClock({ type: "ADVANCE_TICK", operationId: "uncertain.refused" }, PROTOTYPE_DOMAIN_CONTEXT)).toBeNull();
    expect(f.session.state.operationReceipts["uncertain.refused"]).toBeUndefined();
    expect(await f.session.durable()).toBe(true);
    expect(append.mock.calls[1]![2]).toBe(append.mock.calls[0]![2]);
    expect(append.mock.calls[1]![3]).toEqual(append.mock.calls[0]![3]);
    expect(append.mock.calls[2]![2]).toBe(append.mock.calls[0]![3].at(-1)!.version);
    let reference = baseline;
    for (const command of commands) reference = applyGameEvidenceCommand(reference, command, PROTOTYPE_DOMAIN_CONTEXT).checkpoint;
    const restored = await prepareJournal(store, cloudCampaignStorageKey(f.scope), f.coordinator.codec, { local: true, encode: false });
    expect(JSON.stringify(restored!.state)).toBe(JSON.stringify(importGameEvidence(reference.snapshot, reference.evidence)));
    expect(f.session.syncView).toMatchObject({ canExecute: true, localDurable: true, failure: null });
    expect(await f.session.advanceClock({ type: "ADVANCE_TICK", operationId: "uncertain.resumed" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
  } finally { gate.resolve(); f.session.dispose(); f.coordinator.dispose(); }
});
