import { afterEach, expect, it, vi } from "vitest";
import { applyGameEvidenceCommand, createGameEvidenceCheckpoint, importGameEvidence, PROTOTYPE_DOMAIN_CONTEXT, type GameCommand } from "@gamify-surgery/game-domain";
import { startFacilityClock } from "../facilityClock";
import { SessionActions } from "../sessionActions";
import { operationalSessionFixture } from "./operationalSessionTestSupport";
import { OperationalEngineProcessor } from "./operationalEngineProcessor";
import { prepareJournal } from "./journalCodec";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { CadencePort, cadenceState, nativeWorkIdle, observeCodecWork, scheduler } from "./tickAdmissionCadenceTestSupport";

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

it.each([true, false])("admits sixty healthy account seconds without increasing journal writes and Save & Close keeps the exact prefix (worker=%s)", async operational => {
  const codecBusy = observeCodecWork(), ports: CadencePort[] = [];
  const f = await operationalSessionFixture({ createPort: () => { const port = new CadencePort(); ports.push(port); return port; } }, cadenceState(), operational);
  const busy = () => codecBusy() || ports.some(port => port.outstanding.size > 0);
  expect(await f.session.durable()).toBe(true); await nativeWorkIdle(busy);
  const append = vi.spyOn(f.coordinator.journal!, "append"), writes = vi.spyOn(f.cache, "write");
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
