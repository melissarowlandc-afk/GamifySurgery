import { afterEach, expect, it, vi } from "vitest";
import { applyGameEvidenceCommand, createGameEvidenceCheckpoint, createInitialGameState, PROTOTYPE_DOMAIN_CONTEXT, type GameCommand } from "@gamify-surgery/game-domain";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { CloudCacheError } from "./codecCache";
import { prepareJournal } from "./journalCodec";
import { cloudCodec } from "./codecWorker";
import { createPrototypePlayerView } from "../viewModels";
import { operationalSessionFixture, ControllableOperationalPort } from "./operationalSessionTestSupport";
import { SessionActions } from "../sessionActions";
import { deferred } from "./syncTestSupport";
import { CloudSyncCoordinator } from "./coordinator";
import { MemoryCloudCache } from "./cache";

const exact = (actual: unknown, expected: unknown) => expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
const context = PROTOTYPE_DOMAIN_CONTEXT;
const flush = async () => { for (let i = 0; i < 30; i++) await Promise.resolve(); };
afterEach(() => vi.restoreAllMocks());

it("checkpoint preparation keeps its captured durable prefix when a following command publishes during the drain",async()=>{
  const f=await operationalSessionFixture(),journal=f.cache.journal!,write=journal.append.bind(journal),held=deferred();let entered=false;
  vi.spyOn(journal,"append").mockImplementationOnce(async(...args)=>{entered=true;await held.promise;return write(...args);});
  try{
    await f.session.executeAsync({type:"SET_SIMULATION_SPEED",speed:2,operationId:"prepare.prefix"},context);
    const preparing=f.session.prepareRecoveryCopy();
    await f.session.executeAsync({type:"SET_SIMULATION_SPEED",speed:4,operationId:"prepare.following"},context);
    await vi.waitFor(()=>expect(entered).toBe(true));held.resolve();
    expect(await preparing).toBe(true);expect(f.session.canExecute).toBe(true);expect(f.session.state.simulationSpeed).toBe(4);
    expect(await f.session.durable()).toBe(true);expect(await f.session.prepareRecoveryCopy()).toBe(true);
  }finally{held.resolve();f.session.dispose();}
});

it("an idle durability call captures its journal prefix before a same-turn following command",async()=>{
  const f=await operationalSessionFixture({},undefined,false),journal=f.cache.journal!,write=journal.append.bind(journal),held=deferred();
  const batches:number[][]=[];
  vi.spyOn(journal,"append").mockImplementation(async(...args)=>{batches.push(args[3].map(row=>row.version));if(batches.length===1)await held.promise;return write(...args);});
  try{
    f.session.execute({type:"SET_SIMULATION_SPEED",speed:2,operationId:"prefix.first"},context);
    const barrier=f.session.durable();
    f.session.execute({type:"SET_SIMULATION_SPEED",speed:4,operationId:"prefix.following"},context);
    await vi.waitFor(()=>expect(batches.length).toBeGreaterThan(0));expect(batches[0]).toHaveLength(1);
    held.resolve();expect(await barrier).toBe(true);expect(await f.session.durable()).toBe(true);
    expect(f.session.state.simulationSpeed).toBe(4);
  }finally{held.resolve();f.session.dispose();}
});

it("establishes the initial projection at startup rather than sending its full view on the first tick",async()=>{
  const f=await operationalSessionFixture();
  expect(f.ports[0]!.messages[0]).toMatchObject({kind:"initialize",projection:{revision:0,args:[null,false,null],followOpenChart:true}});
  f.session.playerView(f.session.state,null,false,null);
  await f.session.executeAsync({type:"SET_SIMULATION_SPEED",speed:4,operationId:"startup.projection"},context);
  const now=Date.now();vi.spyOn(Date,"now").mockReturnValue(now);
  exact(f.session.playerView(f.session.state,null,false,null),createPrototypePlayerView(f.session.state,null,false,null));
  f.session.dispose();
});

it("publication observers never force a journal commit or claim durability",async()=>{
  const f=await operationalSessionFixture(),append=vi.spyOn(f.cache.journal!,"append");
  const work=f.session.executeAsync({type:"SET_SIMULATION_SPEED",speed:4,operationId:"settled.publication"},context);
  await f.session.commandsSettled();await work;
  expect(append).not.toHaveBeenCalled();expect(f.session.syncView.localDurable).toBe(false);
  expect(await f.session.durable()).toBe(true);expect(append).toHaveBeenCalledTimes(1);f.session.dispose();
});

it("captures small guidance inputs and never resends the catalog/checkpoint on an ordinary tick",async()=>{
  const f=await operationalSessionFixture(),port=f.ports[0]!;
  await f.session.executeAsync({type:"SET_PAUSED",paused:false,operationId:"capture.play"},context);port.auto=false;
  const blocked=["management"];
  const work=f.session.executeAsync({type:"ADVANCE_TICK",operationId:"capture.tick",advancedAtRealMs:1800000000000},
    {...context,guidanceBlockedTopicIds:blocked,guidanceAttentionBlocked:true});blocked.push("litter");await flush();
  const request=port.waiting[0]!;expect(request).toMatchObject({kind:"command",contextFlags:{guidanceBlockedTopicIds:["management"],guidanceAttentionBlocked:true}});
  expect(Object.hasOwn(request,"context")).toBe(false);expect(Object.hasOwn(request,"checkpoint")).toBe(false);
  port.auto=true;port.next();await work;f.session.dispose();
});

it("keeps the existing day-end checkpoint trigger after the exact completed tick",async()=>{
  const state=createInitialGameState(),minutes=(context.balanceRelease.clock.dayEndHour-context.balanceRelease.clock.dayStartHour)*60;
  state.paused=false;state.facilityTick=minutes-1;
  const f=await operationalSessionFixture({},state),checkpoint=vi.spyOn(f.session,"checkpointNow").mockResolvedValue(true);
  const before=JSON.parse(await f.session.exportRecoveryAsync()).checkpoint,command={type:"ADVANCE_TICK",operationId:"day.end",advancedAtRealMs:1800000000000} as const;
  const expected=applyGameEvidenceCommand(before,command,context);
  await f.session.executeAsync(command,context);exact(f.session.state,expected.state);
  expect(checkpoint).toHaveBeenCalledExactlyOnceWith("day-end");f.session.dispose();
});

it("retries the original failed compact baseline before committing a following admitted delta",async()=>{
  let now=0;vi.spyOn(performance,"now").mockImplementation(()=>now);
  const f=await operationalSessionFixture(),journal=f.cache.journal!,gate=deferred();
  vi.spyOn(f.coordinator,"pulse").mockResolvedValue();
  await f.session.executeAsync({type:"SET_SIMULATION_SPEED",speed:2,operationId:"compact.before"},context);await f.session.durable();
  const compact=vi.spyOn(journal,"compact").mockImplementationOnce(async()=>{await gate.promise;throw new CloudCacheError("transaction");});
  now=300001;const first=f.session.pulse();await vi.waitFor(()=>expect(compact).toHaveBeenCalledTimes(1));
  const second=f.session.executeAsync({type:"SET_SIMULATION_SPEED",speed:4,operationId:"compact.following"},context);
  gate.resolve();await first;expect(await second).not.toBeNull();now+=61000;await f.session.pulse();
  expect(await f.session.durable()).toBe(true);
  const recovered=await prepareJournal(journal,cloudCampaignStorageKey(f.scope),cloudCodec,{local:true,encode:false});
  expect(recovered!.state!.simulationSpeed).toBe(4);expect(f.session.state.simulationSpeed).toBe(4);f.session.dispose();
});

it("preserves a metadata reversal admitted behind a running command and suppresses duplicate pending settings",async()=>{
  const f=await operationalSessionFixture(),port=f.ports[0]!,original=f.session.metadata;port.auto=false;
  const command=f.session.executeAsync({type:"SET_SIMULATION_SPEED",speed:4,operationId:"metadata.running"},context);
  f.session.updateMetadata({...original,name:"Temporary public name"});
  f.session.updateMetadata({...original,name:"Temporary public name"});
  f.session.updateMetadata(original);
  await flush();port.auto=true;port.next();await command;expect(await f.session.durable()).toBe(true);
  expect(f.session.metadata.name).toBe(original.name);
  const rows=(await f.cache.journal!.read(cloudCampaignStorageKey(f.scope)))!.rows;
  expect(rows).toHaveLength(3);expect(rows.at(-1)!.campaign.name).toBe(original.name);f.session.dispose();
});

it("explicit manual ticks are ordered commands and are never treated as coalescible clock pulses", async () => {
  const f=await operationalSessionFixture(), port=f.ports[0]!;
  await f.session.executeAsync({type:"SET_PAUSED",paused:false,operationId:"manual.play"},context);port.auto=false;
  const tick=f.session.state.facilityTick;
  const a=f.session.executeAsync({type:"ADVANCE_TICK",operationId:"manual.a",advancedAtRealMs:1800000000000},context);
  const b=f.session.executeAsync({type:"ADVANCE_TICK",operationId:"manual.b",advancedAtRealMs:1800000001000},context);
  await flush();port.next();await a;await flush();port.auto=true;port.next();await b;
  expect(f.session.state.facilityTick).toBe(tick+2);f.session.dispose();
});

it("fencing during computation retains the admitted row with its original writer generation and refuses later commands", async () => {
  const f=await operationalSessionFixture(),port=f.ports[0]!,generation=f.coordinator.journalWriterGeneration;port.auto=false;
  const work=f.session.executeAsync({type:"SET_SIMULATION_SPEED",speed:4,operationId:"fence.admitted"},context);await flush();
  const other=new CloudSyncCoordinator({scope:f.scope,cache:new MemoryCloudCache(),transport:f.server.transport(f.scope.accountId),clock:f.clock,enabled:true});
  await other.open();expect(await other.startWriter(true)).toBe(true);await f.coordinator.focus();expect(f.session.canExecute).toBe(false);
  port.auto=true;port.next();await work;expect(await f.session.durable()).toBe(true);
  const rows=(await f.cache.journal!.read(cloudCampaignStorageKey(f.scope)))!.rows;
  expect(rows.at(-1)!.writerGeneration).toBe(generation);
  expect(await f.session.executeAsync({type:"SET_SIMULATION_SPEED",speed:2,operationId:"fence.later"},context)).toBeNull();
  const cp=JSON.parse(await f.session.exportRecoveryAsync()).checkpoint;
  expect(cp.snapshot.head.sequence).toBe(1);other.dispose();f.session.dispose();
});

it("an account acknowledgement during an in-flight command compacts after that exact accepted result", async () => {
  const f=await operationalSessionFixture(),port=f.ports[0]!,gate=deferred();
  await f.session.executeAsync({type:"SET_SIMULATION_SPEED",speed:2,operationId:"ack.race.first"},context);await f.session.durable();
  f.server.faults.push({method:"commit",at:"after",wait:gate.promise});
  const upload=f.session.checkpointNow("purchase");await vi.waitFor(()=>expect(f.server.operationCount(f.scope.accountId)).toBe(1));
  port.auto=false;const next=f.session.executeAsync({type:"SET_SIMULATION_SPEED",speed:4,operationId:"ack.race.next"},context);await flush();
  gate.resolve();expect(await upload).toBe(true);port.auto=true;port.next();await next;await f.session.durable();
  const cp=JSON.parse(await f.session.exportRecoveryAsync()).checkpoint;
  expect(cp.snapshot.head.sequence).toBe(0);expect(f.session.state.simulationSpeed).toBe(4);
  const key=cloudCampaignStorageKey(f.scope),head=(await f.cache.journal!.head(key))!;
  expect(head.snapshotThrough).toBe(head.highWater);expect(await f.session.checkpointNow("purchase")).toBe(true);
  expect(f.session.needsReload).toBe(false);f.session.dispose();
});

it("Save & Close drains whole admitted player actions, including their later dependent commands", async () => {
  const f = await operationalSessionFixture(), port = f.ports[0]!; port.auto = false;
  const actions = new SessionActions(true); f.session.bindCommandActions(actions);
  const action = actions.action(function* (speed: 2 | 4) {
    yield f.session.executeControllerCommand({ type: "SET_SIMULATION_SPEED", speed, operationId: `close.action.${speed}` }, context);
    return yield f.session.executeControllerCommand({ type: "SET_PAUSED", paused: false, operationId: `close.play.${speed}` }, context);
  });
  const a = action(2), b = action(4), closing = f.session.saveAndClose(context);
  expect(f.session.canExecute).toBe(false); expect(f.session.syncView.localDurable).toBe(false);
  await flush(); expect(port.waiting).toHaveLength(1); port.auto = true; port.next();
  expect(await a).not.toBeNull(); expect(await b).not.toBeNull(); expect(await closing).toBe(true);
  expect(f.session.state).toMatchObject({ paused: true, simulationSpeed: 4 });
  const posted = port.messages.filter(r => r.kind === "command").map(r => r.command.operationId);
  expect(posted.slice(0, 4)).toEqual(["close.action.2", "close.play.2", "close.action.4", "close.play.4"]);
  const head = await f.cache.journal!.head(cloudCampaignStorageKey(f.scope)); expect(head!.snapshotThrough).toBe(head!.highWater);
  f.session.dispose();
});

it("checkpoint acknowledgement compacts the exact worker/journal prefix and following commands extend the new baseline", async () => {
  const f = await operationalSessionFixture(), journal = f.cache.journal!, key = cloudCampaignStorageKey(f.scope);
  await f.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "ack.before" }, context);
  await f.session.durable(); const before = JSON.stringify(f.session.state);
  expect(await f.session.checkpointNow("purchase")).toBe(true);
  await vi.waitFor(async () => { const head = await journal.head(key); expect(head!.snapshotThrough).toBe(head!.highWater); });
  expect(JSON.stringify(f.session.state)).toBe(before);
  const reset = JSON.parse(await f.session.exportRecoveryAsync()).checkpoint; expect(reset.snapshot.head.sequence).toBe(0);
  const command = { type: "SET_SIMULATION_SPEED", speed: 4, operationId: "ack.after" } as const;
  await f.session.executeAsync(command, context); await f.session.durable();
  const latest = JSON.parse(await f.session.exportRecoveryAsync()).checkpoint;
  exact(latest, applyGameEvidenceCommand(reset, command, context).checkpoint);
  const recovered = await prepareJournal(journal, key, cloudCodec, { local: true, encode: false });
  expect(recovered!.state!.simulationSpeed).toBe(4); f.session.dispose();
});

it("detaching cannot terminate an admitted command before its journal row commits", async () => {
  const f = await operationalSessionFixture(), port = f.ports[0]!; port.auto = false;
  const work = f.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "detach.accepted" }, context);
  await flush(); f.session.detach(); expect(port.stopped).toBe(false);
  port.auto = true; port.next(); expect(await work).not.toBeNull();
  await vi.waitFor(() => expect(port.stopped).toBe(true));
  const recovered = await prepareJournal(f.cache.journal!, cloudCampaignStorageKey(f.scope), cloudCodec, { local: true, encode: false });
  expect(recovered!.state!.simulationSpeed).toBe(4); f.coordinator.dispose();
});

it("admits one tick, skips busy clock intents, and keeps all player commands ahead of the next tick", async () => {
  const f = await operationalSessionFixture(), port = f.ports[0]!; port.auto = false;
  const initial = f.session.state, first = { type: "SET_PAUSED", paused: false, operationId: "order.play" } as const;
  const play = f.session.executeAsync(first, context); await flush(); port.next(); await play;
  const tick: GameCommand = { type: "ADVANCE_TICK", operationId: "order.tick", advancedAtRealMs: 1800000000000 };
  const a: GameCommand = { type: "SET_SIMULATION_SPEED", speed: 2, operationId: "order.player.a" };
  const b: GameCommand = { type: "SET_SIMULATION_SPEED", speed: 4, operationId: "order.player.b" };
  const applied = f.session.executeAsync(tick, context), clickA = f.session.executeAsync(a, context), clickB = f.session.executeAsync(b, context);
  for (let i = 0; i < 20; i++) expect(await f.session.advanceClock({ type: "ADVANCE_TICK", operationId: `skipped.${i}` }, context)).toBeNull();
  expect(f.session.syncView.localDurable).toBe(false);
  await flush(); expect(port.waiting).toHaveLength(1); port.next(); await applied;
  await flush(); expect(port.waiting[0]).toMatchObject({ kind: "command", command: a }); port.next(); await clickA;
  await flush(); expect(port.waiting[0]).toMatchObject({ kind: "command", command: b }); port.next(); await clickB;
  let cp = createGameEvidenceCheckpoint(initial);
  for (const command of [first, tick, a, b]) cp = applyGameEvidenceCommand(cp, command, context).checkpoint;
  port.auto = true;
  const recovery = JSON.parse(await f.session.exportRecoveryAsync()); exact(recovery.checkpoint, cp);
  expect(port.messages.filter(r => r.kind === "command")).toHaveLength(4);
  expect(await f.session.durable()).toBe(true);
  expect(f.session.syncView.localDurable).toBe(true); f.session.dispose();
});

it("a durability/hidden barrier waits for its admitted worker result and its original journal row", async () => {
  const f = await operationalSessionFixture(), port = f.ports[0]!; port.auto = false;
  const work = f.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "hidden.accepted" }, context);
  let finished = false; const leaving = f.session.checkpointNow("pagehide").then(ok => { finished = true; return ok; });
  await flush(); expect(finished).toBe(false); expect(f.session.syncView.localDurable).toBe(false);
  port.auto = true; port.next(); expect(await work).not.toBeNull(); expect(await leaving).toBe(true);
  const journal = await f.cache.journal!.read(cloudCampaignStorageKey(f.scope));
  expect(journal!.head.highWater).toBeGreaterThan(0);
  const recovered = await prepareJournal(f.cache.journal!, cloudCampaignStorageKey(f.scope), cloudCodec, { local: true, encode: false });
  expect(recovered!.state!.simulationSpeed).toBe(4); f.session.dispose();
});

it("retries an uncertain worker result from the published prefix once, then automatically recovers", async () => {
  let now = 1000; const diagnostics: string[] = [];
  const f = await operationalSessionFixture({ now: () => now, retryMs: 10, diagnose: code => diagnostics.push(code) });
  const before = f.session.state;
  const a: GameCommand = { type: "SET_SIMULATION_SPEED", speed: 2, operationId: "crash.before" };
  await f.session.executeAsync(a, context);
  const port = f.ports[0]!; port.auto = false;
  const b: GameCommand = { type: "SET_SIMULATION_SPEED", speed: 4, operationId: "crash.uncertain" };
  const pending = f.session.executeAsync(b, context); await flush(); port.next(true); expect(await pending).not.toBeNull();
  expect(f.session.state.simulationSpeed).toBe(4); expect(port.stopped).toBe(true);
  now += 20;
  const c: GameCommand = { type: "SET_PAUSED", paused: false, operationId: "crash.recovered" };
  await f.session.executeAsync(c, context); expect(f.ports).toHaveLength(2);
  let cp = createGameEvidenceCheckpoint(before);
  for (const command of [a, b, c]) cp = applyGameEvidenceCommand(cp, command, context).checkpoint;
  exact(JSON.parse(await f.session.exportRecoveryAsync()).checkpoint, cp);
  const versions = (await f.cache.journal!.read(cloudCampaignStorageKey(f.scope)))?.head.highWater ?? 0;
  await f.session.executeAsync(b, context); expect(await f.session.durable()).toBe(true);
  expect((await f.cache.journal!.head(cloudCampaignStorageKey(f.scope)))!.highWater).toBe(Math.max(versions, 3));
  expect(diagnostics).toContain("engine-worker"); expect(diagnostics.filter(code => code === "worker-ready")).toHaveLength(2); f.session.dispose();
});

it("a startup failure uses the existing synchronous boundary and later starts a worker", async () => {
  let now = 0, attempts = 0;
  const f = await operationalSessionFixture({ now: () => now, retryMs: 10, createPort: () => {
    if (++attempts === 1) throw Error("Synthetic startup failure"); return new ControllableOperationalPort();
  } });
  const first = { type: "SET_SIMULATION_SPEED", speed: 2, operationId: "startup.fallback" } as const;
  expect(await f.session.executeAsync(first, context)).not.toBeNull(); now += 20;
  expect(await f.session.executeAsync({ ...first, speed: 4, operationId: "startup.worker" }, context)).not.toBeNull();
  expect(attempts).toBe(2); expect(await f.session.durable()).toBe(true); f.session.dispose();
});

it("retains an admitted row if storage fails while the worker is computing", async () => {
  const f = await operationalSessionFixture(), journal = f.cache.journal!, port = f.ports[0]!;
  await f.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "storage.first" }, context);
  port.auto = false;
  const work = f.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "storage.admitted" }, context);
  vi.spyOn(journal, "append").mockRejectedValueOnce(new CloudCacheError("transaction"));
  const failed = f.session.durable(); await flush(); port.auto = true; port.next(); await work;
  expect(await failed).toBe(false); expect(f.session.syncView.localDurable).toBe(false);
  expect(await f.session.durable()).toBe(true);
  const recovered = await prepareJournal(journal, cloudCampaignStorageKey(f.scope), cloudCodec, { local: true, encode: false });
  expect(recovered!.state!.simulationSpeed).toBe(4); f.session.dispose();
});

it("publishes the exact supplied projection and invalidates every changed render input", async () => {
  const f = await operationalSessionFixture();
  const args = [null, false, null] as const;
  f.session.playerView(f.session.state, ...args);
  await f.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "view.first" }, context);
  const now = Date.now(); vi.spyOn(Date, "now").mockReturnValue(now);
  exact(f.session.playerView(f.session.state, ...args), createPrototypePlayerView(f.session.state, ...args));
  exact(f.session.playerView(f.session.state, null, true, "room.examination", true, null, 90, { zoom: 1.3, panX: 5, panY: 4 }, [], true),
    createPrototypePlayerView(f.session.state, null, true, "room.examination", true, null, 90, { zoom: 1.3, panX: 5, panY: 4 }, [], true));
  f.session.dispose();
});
