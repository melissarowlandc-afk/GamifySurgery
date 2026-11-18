import { afterEach, expect, it, vi } from "vitest";
import { GameEvidenceError, PROTOTYPE_DOMAIN_CONTEXT, applyGameEvidenceCommand, createInitialGameState } from "@gamify-surgery/game-domain";
import { operationalSessionFixture } from "./operationalSessionTestSupport";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { prepareJournal } from "./journalCodec";
import { cloudCodec } from "./codecWorker";
import { CloudGameSession } from "./gameSession";
import { CloudSyncCoordinator } from "./coordinator";
import { ControllableOperationalPort } from "./operationalSessionTestSupport";
import { CloudSyncError } from "./transport";
import { CloudCacheError } from "./codecCache";
import { deferred } from "./syncTestSupport";
import { getCommandProblem } from "../../diagnostics/problemDiagnostics";

const context = PROTOTYPE_DOMAIN_CONTEXT;
const command = (id = "good") => ({ type: "SET_SIMULATION_SPEED" as const, speed: 4 as const, operationId: `containment.${id}` });
const exact = (a: unknown, b: unknown) => {
  const left = JSON.stringify(a), right = JSON.stringify(b);
  let at = 0; while (at < left.length && at < right.length && left[at] === right[at]) at++;
  expect(left === right, `State bytes differ at ${at}: ${left.slice(Math.max(0, at - 40), at + 100)} / ${right.slice(Math.max(0, at - 40), at + 100)}`).toBe(true);
};
afterEach(() => vi.restoreAllMocks());

it.each(["capture", "execute", "projection", "journal"] as const)("refuses a %s fault before admission, leaves no partial row, and runs the next command in a worker", async stage => {
  const f = await operationalSessionFixture(), internal = f.session as any, before = JSON.stringify(f.session.state), meta = f.session.metadata;
  const drain = internal.journalDrain, through = drain.highWater;
  const target = stage === "projection" ? internal.projectedView : stage === "journal" ? drain : internal.engine;
  const method = stage === "projection" ? "publish" : stage === "journal" ? "acceptAdmitted" : stage;
  vi.spyOn(target, method).mockImplementationOnce(() => { throw new TypeError("PRIVATE patient payload"); });
  try {
    expect(await f.session.executeAsync(command("bad"), context)).toBeNull();
    expect(JSON.stringify(f.session.state)).toBe(before); exact(f.session.metadata, meta);
    expect(drain.highWater).toBe(through); expect(drain.queued).toBe(0);
    expect(f.session.canExecute).toBe(true); expect(f.coordinator.view).toMatchObject({ phase: "ready", failure: null, localDurable: true });
    expect(internal.lastCommandFailure).toMatchObject({ type: "SET_SIMULATION_SPEED", stage, errorClass: "TypeError" });
    expect(JSON.stringify(internal.lastCommandFailure)).not.toContain("PRIVATE");
    expect(await f.session.executeAsync({ type: "SET_PAUSED", paused: true, operationId: "containment.next" }, context)).not.toBeNull();
    expect(internal.engine.mode).toBe("worker"); expect(await f.session.durable()).toBe(true);
    const rows = (await f.cache.journal!.read(cloudCampaignStorageKey(f.scope)))!.rows;
    expect(rows).toHaveLength(1); expect(f.session.state.operationReceipts["containment.bad"]).toBeUndefined();
    expect(f.session.state.operationReceipts["containment.next"]?.status).toBe("applied");
  } finally { f.session.dispose(); }
});

it.each(["journal", "publication", "followup"] as const)("reconciles an accepted %s fault from the checked durable journal, without applying twice", async stage => {
  const f = await operationalSessionFixture(), internal = f.session as any, drain = internal.journalDrain;
  const before = JSON.parse(await f.session.exportRecoveryAsync()).checkpoint, input = command(stage);
  const expected = applyGameEvidenceCommand(before, input, context).state;
  const object = stage === "journal" ? drain : stage === "publication" ? f.coordinator : internal;
  const method = stage === "journal" ? "acceptAdmitted" : stage === "publication" ? "noteLocalChange" : "finishCommand";
  const original = object[method].bind(object);
  vi.spyOn(object, method).mockImplementationOnce((...args: unknown[]) => { original(...args); throw new TypeError("synthetic post-admission bug"); });
  try {
    expect(await f.session.executeAsync(input, context)).not.toBeNull(); exact(f.session.state, expected);
    expect(getCommandProblem()).toBeNull(); // No misleading retry prompt for an accepted action.
    expect(f.session.canExecute).toBe(true); expect(f.coordinator.view.failure).toBeNull();
    expect(drain.highWater).toBe(drain.committed); expect(drain.queued).toBe(0);
    const restored = await prepareJournal(f.cache.journal!, cloudCampaignStorageKey(f.scope), cloudCodec, { local: true, encode: false });
    exact(restored!.state, expected); expect(restored!.through).toBe(1);
    expect(await f.session.executeAsync({ type: "SET_PAUSED", paused: true, operationId: `following.${stage}` }, context)).not.toBeNull();
    expect(await f.session.durable()).toBe(true);
    expect((await f.cache.journal!.read(cloudCampaignStorageKey(f.scope)))!.rows).toHaveLength(2);
    expect(internal.engine.mode).toBe("worker");
  } finally { f.session.dispose(); }
});

it("keeps queued player intents in order through repair and never releases an acknowledgement before the journal drain", async () => {
  const f = await operationalSessionFixture(), internal = f.session as any, held = deferred();
  const append = f.cache.journal!.append.bind(f.cache.journal!);
  let entered = false, acknowledged = false;
  vi.spyOn(f.cache.journal!, "append").mockImplementationOnce(async (...args) => { entered = true; await held.promise; return append(...args); });
  vi.spyOn(f.coordinator, "noteLocalChange").mockImplementationOnce(() => { throw new TypeError("publication"); });
  try {
    const first = f.session.executeAsync(command("ordered.first"), context).then(value => { acknowledged = true; return value; });
    const second = f.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "ordered.second" }, context);
    await vi.waitFor(() => expect(entered).toBe(true)); expect(acknowledged).toBe(false);
    expect(f.coordinator.view).toMatchObject({ phase: "paused", failure: "processing", canExecute: false });
    held.resolve(); expect(await first).not.toBeNull(); expect(await second).not.toBeNull();
    expect(f.session.state.simulationSpeed).toBe(2); expect(await f.session.durable()).toBe(true);
    const rows = (await f.cache.journal!.read(cloudCampaignStorageKey(f.scope)))!.rows;
    expect(rows.map(row => row.version)).toEqual([1, 2]); expect(internal.commandRepair).toBeNull();
  } finally { held.resolve(); f.session.dispose(); }
});

it.each([false, true])("contains synchronous execution/publication faults (post-admission=%s) without corrupting the prefix", async afterAdmission => {
  const f = await operationalSessionFixture({}, undefined, false), internal = f.session as any;
  const before = JSON.stringify(f.session.state), drain = internal.journalDrain;
  const target = afterAdmission ? f.coordinator : drain, method = afterAdmission ? "noteLocalChange" : "acceptAdmitted";
  vi.spyOn(target, method).mockImplementationOnce(() => { throw new TypeError("sync failure"); });
  try {
    const next = await f.session.executeControllerCommand(command("sync"), context);
    if (afterAdmission) { expect(next).not.toBeNull(); expect(f.session.state.simulationSpeed).toBe(4); expect(drain.committed).toBe(1); }
    else { expect(next).toBeNull(); expect(JSON.stringify(f.session.state)).toBe(before); expect(drain.highWater).toBe(0); }
    expect(f.session.canExecute).toBe(true); expect(f.coordinator.view.failure).toBeNull();
  } finally { f.session.dispose(); }
});

it.each([new GameEvidenceError("immutable-pins"), new CloudSyncError("corrupt"), new CloudSyncError("writer"), new CloudCacheError("checksum")])("retains the existing real integrity/authority/storage fence for $name", async error => {
  const f = await operationalSessionFixture(), before = JSON.stringify(f.session.state), internal = f.session as any;
  vi.spyOn(internal.engine, "execute").mockRejectedValueOnce(error);
  try {
    expect(await f.session.executeAsync(command("integrity"), context)).toBeNull();
    expect(f.session.canExecute).toBe(false); expect(internal.journalDrain.highWater).toBe(0);
    expect(JSON.stringify(internal.current)).toBe(before); expect(f.coordinator.view.failure).not.toBeNull();
    expect(internal.commandRepair).toBeNull();
  } finally { f.session.dispose(); }
});

it("does not bypass writer fencing if it arrives while the accepted prefix is being verified", async () => {
  const f = await operationalSessionFixture(), held = deferred(), store = f.cache.journal!, read = store.read.bind(store);
  let entered = false;
  vi.spyOn(f.coordinator, "noteLocalChange").mockImplementationOnce(() => { throw new TypeError("publication"); });
  vi.spyOn(store, "read").mockImplementationOnce(async (...args) => { entered = true; await held.promise; return read(...args); });
  try {
    const work = f.session.executeAsync(command("fence"), context);
    await vi.waitFor(() => expect(entered).toBe(true)); f.coordinator.reportLocalFailure(new CloudSyncError("writer"));
    held.resolve(); await work;
    expect(f.coordinator.view).toMatchObject({ failure: "writer", canExecute: false });
    expect(await f.session.executeAsync(command("fenced.later"), context)).toBeNull();
  } finally { held.resolve(); f.session.dispose(); }
});

it("one programming exception during recovery retries once; a persistent one is paused/processing with bounded pulse retries", async () => {
  const f = await operationalSessionFixture(), internal = f.session as any;
  vi.spyOn(f.coordinator, "noteLocalChange").mockImplementationOnce(() => { throw new TypeError("publication"); });
  const read = vi.spyOn(f.cache.journal!, "read").mockRejectedValue(new TypeError("adapter bug"));
  try {
    expect(await f.session.executeAsync(command("repair"), context)).toBeNull();
    expect(read).toHaveBeenCalledTimes(2); expect(f.coordinator.view).toMatchObject({ phase: "paused", failure: "processing", canExecute: false });
    for (let i = 0; i < 20; i++) await f.session.pulse();
    expect(read).toHaveBeenCalledTimes(2); read.mockRestore();
    internal.commandRepair.nextRetry = 0; await f.session.pulse();
    expect(internal.commandRepair).toBeNull(); expect(f.session.canExecute).toBe(true); expect(f.session.state.simulationSpeed).toBe(4);
  } finally { f.session.dispose(); }
});

it("retains a genuine storage failure and the admitted row instead of claiming that repair succeeded", async () => {
  const f = await operationalSessionFixture(), internal = f.session as any;
  vi.spyOn(f.coordinator, "noteLocalChange").mockImplementationOnce(() => { throw new TypeError("publication"); });
  vi.spyOn(f.cache.journal!, "append").mockRejectedValue(new CloudCacheError("quota"));
  try {
    expect(await f.session.executeAsync(command("storage"), context)).toBeNull();
    expect(f.coordinator.view).toMatchObject({ phase: "storage", failure: "storage", canExecute: false });
    expect(internal.journalDrain.queued).toBe(1); expect(internal.journalDrain.committed).toBe(0);
  } finally { vi.restoreAllMocks(); f.session.dispose(); }
});

it("keeps day-end follow-up single even when its already-started callback throws", async () => {
  const state = createInitialGameState(), minutes = (context.balanceRelease.clock.dayEndHour - context.balanceRelease.clock.dayStartHour) * 60;
  state.paused = false; state.facilityTick = minutes - 1;
  const f = await operationalSessionFixture({}, state), internal = f.session as any;
  const finish = internal.finishCommand.bind(internal), checkpoint = vi.spyOn(f.session, "checkpointNow").mockResolvedValue(true);
  vi.spyOn(internal, "finishCommand").mockImplementationOnce((...args: unknown[]) => { finish(...args); throw new TypeError("after callback"); });
  try {
    expect(await f.session.executeAsync({ type: "ADVANCE_TICK", operationId: "repaired.day-end" }, context)).not.toBeNull();
    expect(checkpoint).toHaveBeenCalledExactlyOnceWith("day-end"); expect(f.session.canExecute).toBe(true);
  } finally { f.session.dispose(); }
});

it.each([false, true])("verifies the durable snapshot fallback after publication without a journal (worker=%s)", async worker => {
  const f = await operationalSessionFixture({}, undefined, worker, false), internal = f.session as any;
  const before = JSON.parse(await f.session.exportRecoveryAsync()).checkpoint, input = command("snapshot");
  const expected = applyGameEvidenceCommand(before, input, context).state;
  vi.spyOn(f.coordinator, "noteLocalChange").mockImplementationOnce(() => { throw new TypeError("snapshot publication"); });
  try {
    expect(await f.session.executeControllerCommand(input, context)).not.toBeNull();
    exact(f.session.state, expected); expect(f.coordinator.view.failure).toBeNull(); expect(f.session.canExecute).toBe(true);
    expect(await f.session.durable()).toBe(true); expect(internal.commandRepair).toBeNull();
    const pending = f.coordinator.pendingCandidate!;
    expect(pending).not.toBeNull(); expect(pending.snapshot.uncompressedBytes).toBeGreaterThan(0);
    expect(await f.session.executeControllerCommand({ type: "SET_PAUSED", paused: true, operationId: "snapshot.following" }, context)).not.toBeNull();
    expect(await f.session.saveAndClose(context)).toBe(true);
  } finally { f.session.dispose(); }
});

it("keeps an honest checked-recovery gate for programming errors outside a command, without overwriting a real fence", async () => {
  const f = await operationalSessionFixture();
  try {
    f.coordinator.reportLocalFailure(new TypeError("PRIVATE"));
    expect(f.coordinator.view).toMatchObject({ phase: "paused", failure: "processing", localDurable: true, canExecute: false });
    f.coordinator.reportLocalFailure(new CloudSyncError("writer"));
    f.coordinator.reportLocalFailure(new TypeError("another PRIVATE"));
    expect(f.coordinator.view).toMatchObject({ phase: "conflict", failure: "writer", canExecute: false });
  } finally { f.session.dispose(); }
});


it("refuses an uncloneable captured intent without blocking or persisting any of it", async () => {
  const f = await operationalSessionFixture(), before = JSON.stringify(f.session.state);
  try {
    expect(await f.session.executeAsync({ ...command("uncloneable"), unsupported: () => {} } as any, context)).toBeNull();
    expect(JSON.stringify(f.session.state)).toBe(before); expect((f.session as any).journalDrain.highWater).toBe(0);
    expect(f.session.canExecute).toBe(true); expect(f.coordinator.view.failure).toBeNull();
    expect((f.session as any).lastCommandFailure).toMatchObject({ stage: "capture", errorClass: "DataCloneError" });
  } finally { f.session.dispose(); }
});

it.each([false, true])("reconciles build undo publication faults exactly once (worker=%s)", async worker => {
  const state = createInitialGameState(); state.paused = true; state.facilityLevel = 5; state.cash = 100_000; state.cashCents = 10_000_000;
  const f = await operationalSessionFixture({}, state, worker), internal = f.session as any;
  const target = f.session.state, before = JSON.parse(await f.session.exportRecoveryAsync()).checkpoint;
  await f.session.executeControllerCommand({ type: "PLACE_ROOM", roomId: "room.undo.hall", roomDefinitionId: "room.hallway", x: 34, y: 27, operationId: "undo.setup" }, context); await f.session.durable();
  expect(f.session.state.operationReceipts["undo.setup"]?.status).toBe("applied");
  const prior = JSON.parse(await f.session.exportRecoveryAsync()).checkpoint;
  vi.spyOn(f.coordinator, "noteLocalChange").mockImplementationOnce(() => { throw new TypeError("undo publication"); });
  try {
    expect(await f.session.undoBuildAsync(target)).not.toBeNull();
    const recovered = await prepareJournal(f.cache.journal!, cloudCampaignStorageKey(f.scope), cloudCodec, { local: true, encode: false });
    exact(f.session.state, recovered!.state); expect(recovered!.through).toBe(2);
    expect(internal.commandRepair).toBeNull(); expect(f.session.canExecute).toBe(true);
    expect(f.session.state.simulationSpeed).toBe(target.simulationSpeed);
    expect(prior.snapshot.head.sequence).toBe(before.snapshot.head.sequence + 1);
    expect(await f.session.executeControllerCommand({ type: "SET_PAUSED", paused: true, operationId: "undo.following" }, context)).not.toBeNull();
  } finally { f.session.dispose(); }
});

it("recovers the exact accepted row on a new session after a post-admission fault, without another command application", async () => {
  const f = await operationalSessionFixture(), input = command("reload"), before = JSON.parse(await f.session.exportRecoveryAsync()).checkpoint;
  const expected = applyGameEvidenceCommand(before, input, context).state;
  vi.spyOn(f.coordinator, "noteLocalChange").mockImplementationOnce(() => { throw new TypeError("publication"); });
  const read = vi.spyOn(f.cache.journal!, "read").mockRejectedValue(new TypeError("recovery adapter"));
  expect(await f.session.executeAsync(input, context)).toBeNull();
  expect((f.session as any).journalDrain.committed).toBe(1); read.mockRestore();
  f.session.detach(); await (f.session as any).detached;
  f.coordinator.dispose();
  // No browser writer-identity store in this fixture. Let its server lease expire
  // before the replacement coordinator performs the ordinary fenced recovery.
  f.clock.advance(60_001);
  const coordinator = new CloudSyncCoordinator({ scope: f.scope, cache: f.cache, transport: f.server.transport(f.scope.accountId), clock: f.clock, enabled: true });
  expect(await coordinator.open()).toBe(true);
  const reopened = await CloudGameSession.create(coordinator, undefined, undefined, { operational: { createPort: () => new ControllableOperationalPort() } });
  try {
    // Ordinary cloud reopening canonicalizes object-key order. Every state value
    // and operation receipt must survive the existing checked recovery route.
    expect((reopened as any).current).toEqual(expected);
    expect(reopened.canExecute).toBe(false);
    expect(await coordinator.focus()).toBe(true); expect(reopened.canExecute).toBe(true);
    expect(await reopened.executeAsync(input, context)).not.toBeNull();
    expect(reopened.state).toEqual(expected); expect(await reopened.durable()).toBe(true);
  } finally { reopened.dispose(); }
});


it.each(["clock", "lease-expired", "revision", "writer", "auth", "storage", "corrupt"] as const)("does not relabel or lift an existing %s fence for a later programming error", async code => {
  const f = await operationalSessionFixture();
  try {
    if (code === "clock") f.clock.wall--;
    else if (code === "lease-expired") f.clock.advance(60_001);
    else f.coordinator.reportLocalFailure(new CloudSyncError(code));
    const before = f.coordinator.view; expect(before.failure).toBe(code);
    f.coordinator.reportLocalFailure(new TypeError("PRIVATE"));
    expect(f.coordinator.view).toMatchObject({ phase: before.phase, failure: before.failure, localDurable: before.localDurable, canExecute: false });
  } finally { f.session.dispose(); }
});

it("retries a transient snapshot-stage programming bug under the repair gate without inventing a network/corruption fence", async () => {
  const f = await operationalSessionFixture({}, undefined, true, false), run = f.coordinator.codec.run.bind(f.coordinator.codec);
  const before = JSON.parse(await f.session.exportRecoveryAsync()).checkpoint, input = command("snapshot.adapter"), expected = applyGameEvidenceCommand(before, input, context).state;
  let failed = false;
  vi.spyOn(f.coordinator, "noteLocalChange").mockImplementationOnce(() => { throw new TypeError("publication"); });
  vi.spyOn(f.coordinator.codec, "run").mockImplementation((request: any) => {
    if (request.kind === "candidate" && !failed) { failed = true; return Promise.reject(new TypeError("snapshot adapter")); }
    return run(request);
  });
  try {
    expect(await f.session.executeControllerCommand(input, context)).not.toBeNull(); exact(f.session.state, expected);
    expect(failed).toBe(true); expect(f.session.canExecute).toBe(true); expect(f.coordinator.view.failure).toBeNull();
    expect(await f.session.durable()).toBe(true);
  } finally { f.session.dispose(); }
});


it.each([false, true])("detach waits for an accepted repair prefix before stopping its journal owner (worker=%s)", async worker => {
  const f = await operationalSessionFixture({}, undefined, worker), held = deferred(), internal = f.session as any;
  const append = f.cache.journal!.append.bind(f.cache.journal!); let entered = false, acknowledged = false;
  vi.spyOn(f.cache.journal!, "append").mockImplementationOnce(async (...args) => { entered = true; await held.promise; return append(...args); });
  vi.spyOn(f.coordinator, "noteLocalChange").mockImplementationOnce(() => { throw new TypeError("publication"); });
  const work = Promise.resolve(f.session.executeControllerCommand(command("detach.repair"), context)).then(result => { acknowledged = true; return result; });
  try {
    await vi.waitFor(() => expect(entered).toBe(true)); f.session.detach();
    expect(internal.stopped).toBe(false); expect(acknowledged).toBe(false);
    held.resolve(); expect(await work).not.toBeNull(); await internal.detached;
    expect(internal.stopped).toBe(true);
    const recovered = await prepareJournal(f.cache.journal!, cloudCampaignStorageKey(f.scope), cloudCodec, { local: true, encode: false });
    expect(recovered!.state!.operationReceipts["containment.detach.repair"]?.status).toBe("applied"); expect(recovered!.through).toBe(1);
  } finally { held.resolve(); f.session.dispose(); }
});
