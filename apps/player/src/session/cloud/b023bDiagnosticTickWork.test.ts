import { createHash } from "node:crypto";
import { beforeAll, describe, expect, it, vi } from "vitest";
import {
  findCareAwareFacilityPath, forecastDiagnosticOrderPlan, getFacilityRoomAtPoint, getRadiologistReadingStation,
  getRoomDefinition, hasOutstandingDiagnosticWork, importGameEvidence, PROTOTYPE_DOMAIN_CONTEXT,
  restoreGameEvidenceJournal, serializeGameState,
  type DiagnosticOrderPlan, type DomainContext, type DoorState, type EvidenceObject, type GameCommand, type GameEvidenceDelta, type GameState, type PlacedRoom,
} from "@gamify-surgery/game-domain";
import { createB023bDiagnosticClinic, FIRST_READER, ISOLATED_READER, READING_SHORTCUT, SECOND_READER } from "../../../../../tests/fixtures/b023bDiagnosticClinic";
import { facilityRouteGraphBuildObserver, withFacilityRouteGraphBuildObserverForTest } from "../../../../../packages/game-domain/src/facilityNavigation";
import { codecTestCampaign } from "./codecTestSupport";
import { dispatchOperationalEngineRequest } from "./operationalEngineDispatch";
import { OperationalEngineProcessor } from "./operationalEngineProcessor";
import { OperationalEvidenceMirror } from "./operationalEvidenceMirror";
import type { OperationalEngineProgress, OperationalEngineReply, OperationalEngineRequest, OperationalViewRequest } from "./operationalEngineProtocol";
import { applyOperationalStatePatch } from "./operationalStatePatch";
import { encodeCloudSnapshot, loadCloudSnapshot } from "./snapshotCodec";
import type { PrototypePlayerView } from "../viewModels";

const taps = vi.hoisted(() => ({
  navigation: null as ((cache: object, rooms: readonly PlacedRoom[], doors: readonly DoorState[], built: boolean) => void) | null,
  calendarBuild: null as ((state: GameState) => void) | null,
}));

// The native test config retains workspace symlinks. Resolve the worker and
// its observers to one copy of the shipped domain source.
vi.mock("@gamify-surgery/game-domain", () => import("../../../../../packages/game-domain/src/index"));

vi.mock("../../../../../packages/game-domain/src/facilityNavigation", async importOriginal => {
  const actual = await importOriginal<typeof import("../../../../../packages/game-domain/src/facilityNavigation")>();
  return {
    ...actual,
    get facilityRouteGraphBuildObserver() { return actual.facilityRouteGraphBuildObserver; },
    createFacilityNavigationCache<T>(limit?: number) {
      const cache = actual.createFacilityNavigationCache<T>(limit);
      return (...[rooms, doors, definition, build]: Parameters<typeof cache>) => {
        const read = taps.navigation;
        if (!read) return cache(rooms, doors, definition, build);
        read(cache, rooms, doors, false);
        return cache(rooms, doors, definition, () => {
          read(cache, rooms, doors, true);
          return build();
        });
      };
    },
  };
});

vi.mock("../../../../../packages/game-domain/src/settledStateQueries", async importOriginal => {
  const actual = await importOriginal<typeof import("../../../../../packages/game-domain/src/settledStateQueries")>();
  return {
    ...actual,
    settledStateQuery<T>(state: GameState, context: DomainContext, namespace: symbol, key: unknown, read: () => T): T {
      const report = taps.calendarBuild;
      if (!report || namespace.description !== "diagnostic-service-calendar") return actual.settledStateQuery(state, context, namespace, key, read);
      return actual.settledStateQuery(state, context, namespace, key, () => { report(state); return read(); });
    },
  };
});

type Stage = OperationalEngineProgress["progress"] | "opening";
type Work = {
  layouts: string[];
  graphs: { stage: Stage; key: string }[];
  calendars: { stage: Stage; inputs: Record<string, string> }[];
  roomLocal: Set<string>;
};
const context = PROTOTYPE_DOMAIN_CONTEXT;
const interval = context.balanceRelease.clock.realMillisecondsPerFacilityMinuteAt1x;
const lineage = { branchId: "b023b.acceptance", sequence: 0, parents: [] };
const sha = (text: string) => createHash("sha256").update(text, "utf8").digest("hex");
const fingerprint = (value: unknown) => sha(JSON.stringify(value));

function geometry(rooms: readonly PlacedRoom[], doors: readonly DoorState[]) {
  return fingerprint([
    rooms.map(room => [room.id, room.roomDefinitionId, room.x, room.y, room.orientation, room.doorSide, room.upgradeLevel]),
    doors.map(door => [door.id, door.roomId, door.side, door.offset, door.exterior]),
  ]);
}

// Forecast times and ranked routes are outputs. A return or departure path is
// part of the frozen plan and can still be an input to the next forecast.
function planInputs(plan: DiagnosticOrderPlan) {
  const { phases, resultReady, visualResultReady, careComplete, ...accepted } = plan;
  return [accepted, phases.map(({ forecast, ...phase }) => [phase,
    phase.kind === "patient_return" || phase.kind === "patient_departure" ? forecast.patientPath : null]),
  [resultReady, visualResultReady, careComplete].map(marker => marker && [marker.afterPhaseIds, marker.reachedAtTick])];
}

function calendarInputs(state: GameState): Record<string, string> {
  // These facts determine availability and reservations in the MRI window.
  // Accounting, feed receipts and the filed chart do not affect its calendar.
  return {
    minute: String(state.facilityTick),
    geometry: geometry(state.rooms, state.doors),
    roomAvailability: fingerprint(state.rooms.map(room => [room.id, room.maintenance?.status, room.maintenance?.outOfServiceAtFacilityTick])),
    staff: fingerprint(state.employees.map(employee => [employee.id, employee.staffRoleDefinitionId, employee.homeRoomInstanceId,
      employee.location, employee.path, employee.pathIndex, employee.readingStationId, employee.facilityTask,
      employee.training, employee.trainingLevel])),
    founder: fingerprint([state.environment.founderLocation, state.environment.founderActivity]),
    outsideReads: fingerprint(state.outsideRadiologyReads ?? []),
    operations: fingerprint(state.serviceOperations.map(({ diagnosticTiming, ...operation }) => [operation, diagnosticTiming && planInputs(diagnosticTiming)])),
  };
}

function watchWorker(layoutCache: object, roomCount: number, engine: OperationalEngineProcessor, request: OperationalEngineRequest) {
  const work: Work = { layouts: [], graphs: [], calendars: [], roomLocal: new Set() };
  let stage: Stage = "opening";
  let reply: OperationalEngineReply | undefined;
  taps.navigation = (cache, rooms, doors, built) => {
    if (cache !== layoutCache) return;
    if (rooms.length === 1) work.roomLocal.add(rooms[0]!.id);
    if (built && rooms.length === roomCount) work.layouts.push(geometry(rooms, doors));
  };
  taps.calendarBuild = state => work.calendars.push({ stage, inputs: calendarInputs(state) });
  try {
    withFacilityRouteGraphBuildObserverForTest(key => work.graphs.push({ stage, key }), () => {
      // The shipped dispatch runs the actual worker processor synchronously
      // with the full local catalogue. Progress marks the measured boundaries.
      dispatchOperationalEngineRequest(engine, request, value => { reply = value; }, message => { stage = message.progress; });
    });
  } finally {
    taps.navigation = null;
    taps.calendarBuild = null;
  }
  if (!reply) throw new Error("The synthetic clinic requires the synchronous full-catalogue worker path.");
  return { reply, work };
}

function fixtureCommands(opening: GameState, chartId: string) {
  let minute = opening.facilityTick;
  const tick = (label: string): GameCommand => ({
    type: "ADVANCE_TICK", operationId: `b023b.${label}`, advancedAtRealMs: opening.createdAtRealMs + ++minute * interval,
  });
  const { id, roomId, side, offset } = READING_SHORTCUT;
  return [tick("warmup"), tick("steady-1"), tick("steady-2"), tick("steady-3"),
    { type: "FIRE_EMPLOYEE", employeeId: FIRST_READER, operationId: "b023b.staff" },
    { type: "PLACE_DOOR", doorId: id, roomId, side, offset, operationId: "b023b.door" },
    { type: "CLOSE_CHART", encounterId: chartId, operationId: "b023b.close-chart" },
    tick("after-door"), tick("settled-door")] satisfies GameCommand[];
}

async function replayClinic() {
  const { state, visitId, chartId, conceptId } = createB023bDiagnosticClinic();
  const campaign = codecTestCampaign(serializeGameState(state));
  const encoded = await encodeCloudSnapshot({ state, campaign, lineage });
  const opening = await loadCloudSnapshot({ snapshot: encoded.snapshot, revision: "1", expectedRevision: "1", expectedCampaignId: state.campaignId, lineage });

  // Identify the spatial layout instance by the public whole-clinic lookup.
  // Other users of the factory cache care masks and peri-op working space.
  let layoutCache: object | undefined;
  taps.navigation = cache => { layoutCache = cache; };
  try {
    getFacilityRoomAtPoint(state.environment.founderLocation, opening.state.rooms, opening.state.doors, getRoomDefinition, () => true);
  } finally { taps.navigation = null; }
  if (!layoutCache) throw new Error("The worker test must observe the live spatial layout instance.");

  const engine = new OperationalEngineProcessor();
  let visible = opening.state;
  let mirror = OperationalEvidenceMirror.create(opening.checkpoint);
  let version = 0, id = 1, asOfRealMs = state.createdAtRealMs + state.facilityTick * interval;
  const projection = (): OperationalViewRequest => ({ revision: id, args: [visible.openChartEncounterId, false, null], asOfRealMs, followOpenChart: true });
  const spatialLayout = layoutCache;
  const send = (request: OperationalEngineRequest) => watchWorker(spatialLayout, state.rooms.length, engine, request);
  const initialized = send({ id: id++, kind: "initialize", visibleState: visible, checkpoint: opening.checkpoint,
    snapshotOnly: true, atRealMs: asOfRealMs, projection: projection() }).reply;
  if (initialized.kind !== "initialized") throw new Error(`Opening failed: ${JSON.stringify(initialized)}`);
  let view = applyOperationalStatePatch(null as PrototypePlayerView | null, initialized.projection?.patch) as PrototypePlayerView;
  const deltas: GameEvidenceDelta[] = [];
  const frames = fixtureCommands(visible, chartId).map(command => {
    if (command.type === "ADVANCE_TICK") asOfRealMs = command.advancedAtRealMs!;
    const { reply, work } = send({ id: id++, kind: "command", expectedVersion: version, command, projection: projection() });
    if (reply.kind !== "applied" || !reply.delta || !reply.projection || reply.replayed) {
      throw new Error(`${command.operationId} did not publish a new worker tick/action: ${JSON.stringify(reply)}`);
    }
    version = reply.version;
    visible = applyOperationalStatePatch(visible, reply.patch);
    view = applyOperationalStatePatch(view, reply.projection.patch);
    mirror = mirror.advance(reply.snapshotPatch, reply.delta);
    deltas.push(reply.delta);
    return { command, work, state: visible, view, patch: reply.patch, snapshotPatch: reply.snapshotPatch, delta: reply.delta };
  });
  const checkpoint = send({ id: id++, kind: "checkpoint", expectedVersion: version }).reply;
  if (checkpoint.kind !== "checkpoint") throw new Error("Worker recovery checkpoint was unavailable.");
  return { frames, opening, encoded, campaign, checkpoint: checkpoint.checkpoint, mirror, deltas, visitId, conceptId };
}

type Replay = Awaited<ReturnType<typeof replayClinic>>;
type Frame = Replay["frames"][number];

function readingRoute(state: GameState, id: string) {
  const reader = state.employees.find(employee => employee.id === id);
  if (!reader) return null;
  const post = getRadiologistReadingStation(state, reader, context)!;
  return findCareAwareFacilityPath(state, context, reader.location, post.location, new Set([post.roomInstanceId]));
}

function outcome(frame: Frame, visitId: string) {
  const visit = frame.state.serviceOperations.find(operation => operation.id === visitId)!;
  const forecast = forecastDiagnosticOrderPlan(frame.state, visit.diagnosticTiming!, context);
  return {
    tick: frame.state.facilityTick,
    reservations: [visit.reservedRoomInstanceIds, visit.reservedEmployeeIds, visit.providerReservation, visit.phaseEndsAtFacilityTick],
    routes: [FIRST_READER, SECOND_READER, ISOLATED_READER].map(id => readingRoute(frame.state, id)),
    forecast,
    label: frame.view.serviceIncome.activeOperations.find(operation => operation.id === visitId)?.statusLabel,
  };
}

function liveLayoutBuilds(sample: Frame) {
  const key = geometry(sample.state.rooms, sample.state.doors);
  return sample.work.layouts.filter(built => built === key).length;
}

// One manifest of fingerprints over the ordered window, captured on release 50
// with the observer installed before the routing fix.
const frozen = {
  diagnosticOutcomes: "ac2e1fdd3f17e2b68bf66c16dacd58e126d48f296b9b63b0cb585145e915ac9f",
  saves: "1cbfecae8cbb44e68f399d7b0f0891d46284678d3be385194bc173a9e5e737f5",
  commands: "50328d867bf827fb34ed8f0c9275af228e3ee786228ea8fe7e90646f6ed0d53b",
  recovery: "6e62d06c4e3c3208bfe0c3a02df336df8ff25b467abfd7b4cff65e047363e856",
  fsrs: "7c2d37c398902e487e9d547af1d73f60ab03c3ce421b00c042177e26695f92ee",
};

describe("B-023 part 2, scheduled diagnosis during ordinary 1x clinic ticks", () => {
  let replay: Replay;
  const frame = (label: string) => replay.frames.find(sample => sample.command.operationId === `b023b.${label}`)!;
  const steady = () => [frame("steady-1"), frame("steady-2"), frame("steady-3"), frame("settled-door")];
  const measuredTicks = () => [...steady().slice(0, 3), frame("after-door"), frame("settled-door")];

  beforeAll(async () => {
    replay = await replayClinic();
    if (process.env.B023B_EVIDENCE === "1") console.info("B-023b work", JSON.stringify(replay.frames.map(sample => ({
      command: sample.command.operationId, tick: sample.state.facilityTick, localRooms: sample.work.roomLocal.size,
      layouts: liveLayoutBuilds(sample), allLayouts: sample.work.layouts.length,
      builds: sample.work.graphs.length, keys: new Set(sample.work.graphs.map(build => build.key)).size,
      projectionGraphs: sample.work.graphs.filter(build => build.stage === "projection").length,
      calendars: sample.work.calendars.map(build => build.stage),
    }))));
  });

  it("keeps the whole layout warm during ordinary ticks on unchanged geometry", () => {
    expect(steady().map(sample => [sample.state.facilityTick, liveLayoutBuilds(sample)])).toEqual(
      steady().map(sample => [sample.state.facilityTick, 0]),
    );
  });

  it("builds the changed whole layout at most once after a door edit", () => {
    const changed = [frame("door"), frame("close-chart"), frame("after-door")];
    const rebuilds = changed.reduce((total, sample) => total + liveLayoutBuilds(sample), 0);
    expect(rebuilds).toBeLessThanOrEqual(1);
  });

  it("assembles each endpoint graph at most once per tick", () => {
    const duplicates = measuredTicks().map(sample => {
      const keys = sample.work.graphs.map(build => build.key);
      return { tick: sample.state.facilityTick, builds: keys.length, distinctKeys: new Set(keys).size };
    }).filter(sample => sample.builds > sample.distinctKeys);
    expect(duplicates).toEqual([]);
  });

  it("adds zero calendar or full graph builds to an equivalent worker projection", () => {
    for (const sample of measuredTicks()) {
      const reducer = sample.work.calendars.filter(build => build.stage === "simulation").at(-1);
      if (reducer) expect(reducer.inputs, `forecast inputs at ${sample.state.facilityTick}`).toEqual(calendarInputs(sample.state));
    }
    const projection = measuredTicks().map(sample => [sample.state.facilityTick,
      sample.work.calendars.filter(build => build.stage === "projection").length,
      sample.work.graphs.filter(build => build.stage === "projection").length]);
    expect(projection).toEqual(measuredTicks().map(sample => [sample.state.facilityTick, 0, 0]));
  });

  it("preserves the MRI routes, reservations, and ETA through same-minute staff and door edits", () => {
    const opening = replay.opening.state;
    expect(opening.rooms.filter(room => getRoomDefinition(room.roomDefinitionId)?.navigation?.dynamicBlockers?.length).length).toBeGreaterThan(16);
    const outcomes = replay.frames.map(sample => outcome(sample, replay.visitId));
    for (const [index, sample] of replay.frames.entries()) {
      const actual = outcomes[index]!;
      const prior = replay.frames[index - 1]?.state ?? opening;
      expect(actual.tick).toBe(prior.facilityTick + Number(sample.command.type === "ADVANCE_TICK"));
      expect(sample.state.operationReceipts[sample.command.operationId]?.status).toBe("applied");
      expect(actual.reservations.slice(0, 2)).toEqual([["b023b.mri"], ["b023b.technician"]]);
      expect(actual.routes[2]).toEqual([]);
      expect(hasOutstandingDiagnosticWork(actual.forecast.plan)).toBe(true);
      expect(actual.label).toContain("(game estimate)");
    }
    const before = outcomes[replay.frames.indexOf(frame("steady-3"))]!;
    const staff = outcomes[replay.frames.indexOf(frame("staff"))]!;
    const door = outcomes[replay.frames.indexOf(frame("door"))]!;
    const readingPaths = (actual: ReturnType<typeof outcome>) => actual.forecast.plan.phases.find(phase => phase.kind === "interpretation")?.forecast.employeePaths;
    expect(before.routes[0]?.length).toBeGreaterThan(0);
    expect(before.routes[1]?.length).toBeGreaterThan(1);
    expect(readingPaths(before)?.map(route => route.employeeId)).toEqual([FIRST_READER]);
    expect(readingPaths(staff)?.map(route => route.employeeId)).toEqual([SECOND_READER]);
    expect(staff.forecast.plan.resultReady.forecastAtTick).toBeGreaterThan(before.forecast.plan.resultReady.forecastAtTick);
    expect(door.forecast.plan.resultReady.forecastAtTick).toBeLessThan(staff.forecast.plan.resultReady.forecastAtTick);
    expect(door.routes[1]!.length).toBeLessThan(staff.routes[1]!.length);
    expect(frame("close-chart").state.openChartEncounterId).toBeNull();
    expect(fingerprint(outcomes)).toBe(frozen.diagnosticOutcomes);
  });

  it("keeps canonical saves, committed commands, recovery patches and FSRS bytes exact", async () => {
    const saves = [replay.encoded.stateText];
    for (const sample of replay.frames) saves.push((await encodeCloudSnapshot({ state: sample.state, campaign: replay.campaign, lineage })).stateText);
    const committed = replay.deltas.flatMap(delta => delta.records.filter(record => record.kind === "transition")
      .map(record => (record.value as EvidenceObject).command));
    const learning = (state: GameState) => {
      const history = state.learningHistories[replay.conceptId]!;
      return JSON.stringify([history.card, history.card.dueAtMs, history.reviews]);
    };
    expect(replay.opening.state.learningHistories[replay.conceptId]?.reviews.length).toBeGreaterThan(0);
    expect(replay.opening.state.learningHistories[replay.conceptId]?.card.dueAtMs).toBeGreaterThan(0);
    expect(replay.frames.map(sample => learning(sample.state))).toEqual(replay.frames.map(() => learning(replay.opening.state)));
    expect(committed).toEqual(replay.frames.map(sample => sample.command));
    const restored = restoreGameEvidenceJournal(replay.opening.checkpoint, replay.deltas);
    expect(fingerprint(replay.mirror.checkpoint)).toBe(fingerprint(replay.checkpoint));
    // Journal replay derives a fresh snapshot. Its exact bytes are pinned
    // alongside the wire patches, including the ordering produced on replay.
    expect(restored.evidence).toEqual(replay.checkpoint.evidence);
    expect(importGameEvidence(restored.snapshot, restored.evidence)).toEqual(replay.frames.at(-1)!.state);

    const actual = { saves: fingerprint(saves), commands: sha(committed.map(command => `${JSON.stringify(command)}\n`).join("")),
      recovery: fingerprint([replay.frames.map(sample => [sample.patch, sample.snapshotPatch, sample.delta]), restored]),
      fsrs: fingerprint([learning(replay.opening.state), ...replay.frames.map(sample => learning(sample.state))]) };
    if (process.env.B023B_EVIDENCE === "1") console.info("B-023b evidence", JSON.stringify({ ...actual,
      fixture: { rooms: replay.opening.state.rooms.length, doors: replay.opening.state.doors.length, opening: Buffer.byteLength(saves[0]!), saves: saves.map(save => Buffer.byteLength(save)) },
      frames: replay.frames.map(sample => {
        const observed = outcome(sample, replay.visitId);
        return { command: sample.command.operationId, eta: observed.forecast.plan.resultReady.forecastAtTick - observed.tick,
          readerRouteLength: observed.routes[1]?.length };
      }),
    }));
    const { diagnosticOutcomes: _diagnostic, ...expected } = frozen;
    expect(actual).toEqual(expected);
  });
});

it("restores the enclosing graph observer after return and throw", () => {
  const outer = () => {}, inner = () => {};
  const failure = new Error("observer scope");
  expect(facilityRouteGraphBuildObserver).toBeNull();
  withFacilityRouteGraphBuildObserverForTest(outer, () => {
    expect(withFacilityRouteGraphBuildObserverForTest(inner, () => facilityRouteGraphBuildObserver)).toBe(inner);
    expect(facilityRouteGraphBuildObserver).toBe(outer);
    expect(() => withFacilityRouteGraphBuildObserverForTest(inner, () => { throw failure; })).toThrow(failure);
    expect(facilityRouteGraphBuildObserver).toBe(outer);
  });
  expect(facilityRouteGraphBuildObserver).toBeNull();
});
