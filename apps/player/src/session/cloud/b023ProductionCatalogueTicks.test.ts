import { on } from "node:events";
import { fileURLToPath } from "node:url";
import { Worker } from "node:worker_threads";
import { build } from "vite";
import { beforeAll, describe, expect, it } from "vitest";
import {
  createGameEvidenceCheckpoint, createInitialGameState, createLevelFiveState, deserializeGameState, gameReducer,
  getCurrentQuestion, importGameEvidence, PROTOTYPE_DOMAIN_CONTEXT, serializeGameState, TUTORIAL_ENCOUNTER_ID,
  type EvidenceObject, type GameCommand, type GameState,
} from "@gamify-surgery/game-domain";
import { endoscopyReadyClinic } from "../../../../../packages/game-domain/tests/routine-endoscopy-ready.fixture";
import { forbidPrivateModules } from "../../../../../scripts/vite/forbid-private-modules";
import { runtimeClinicalData } from "../../../../../scripts/vite/runtime-clinical-data";
import { logicalJsonText, parseCodecJson } from "./codecJson";
import { dispatchOperationalEngineRequest } from "./operationalEngineDispatch";
import { OperationalEngineProcessor } from "./operationalEngineProcessor";
import type { OperationalEngineReply, OperationalEngineRequest, OperationalEngineWorkerReply } from "./operationalEngineProtocol";
import { applyOperationalStatePatch } from "./operationalStatePatch";

const WINDOW_TICKS = 12;
const ONE_X_INTERVAL = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clock.realMillisecondsPerFacilityMinuteAt1x;
const BASE = "/GamifySurgery/";

function clinicCheckpoint() {
  // Earn a real FSRS review before opening the synthetic staffed clinic.
  let opening = createInitialGameState(undefined, {
    campaignId: "campaign.b023.acceptance", campaignSeed: "endoscopy-ready", createdAtRealMs: 0,
  });
  for (let step = 0; step < 80 && !getCurrentQuestion(opening, TUTORIAL_ENCOUNTER_ID); step++) {
    const encounter = opening.encounters[TUTORIAL_ENCOUNTER_ID]!;
    const operationId = `b023.setup.review.${step}`;
    opening = gameReducer(opening, encounter.lifecycle === "waiting_unopened" && encounter.checkInStatus === "checked_in"
      ? { type: "OPEN_CHART", operationId, encounterId: encounter.id }
      : { type: "ADVANCE_TICK", operationId, advancedAtRealMs: (opening.facilityTick + 1) * ONE_X_INTERVAL });
  }
  const question = getCurrentQuestion(opening, TUTORIAL_ENCOUNTER_ID);
  const answer = question?.node.answerChoices.find(choice => choice.isCorrect);
  if (!question || !answer) throw new Error("B-023 fixture did not reach a reviewable chart");
  opening = gameReducer(opening, { type: "SUBMIT_ANSWER", operationId: "b023.setup.answer", encounterId: TUTORIAL_ENCOUNTER_ID,
    decisionNodeId: question.node.id, answerChoiceId: answer.id, reviewedAtMs: opening.facilityTick * ONE_X_INTERVAL });
  opening = gameReducer(opening, { type: "CLOSE_CHART", operationId: "b023.setup.close", encounterId: TUTORIAL_ENCOUNTER_ID });
  expect(Object.values(opening.learningHistories).some(history => history.reviews.length > 0)).toBe(true);

  const clinic = endoscopyReadyClinic({ provider: true }, opening);
  clinic.state.facilityLevel = 5;
  clinic.state.levelFive = createLevelFiveState();
  for (let minute = 0; minute < 250; minute++) {
    const state = clinic.state;
    const procedure = state.serviceOperations.find(operation => operation.incomeLineId === "income.endoscopy" &&
      operation.status === "in_service" && operation.frozenOperationPhases?.[operation.phaseIndex]?.roomDefinitionId === "room.endoscopy");
    if (procedure) {
      // Snapshot with an appointment due next minute and a scored arrival due
      // the minute after. The measured ticks create the visit and select the consult.
      state.nextServiceAppointmentTicks["income.advanced_endoscopy"] = state.facilityTick + 1;
      state.nextRoutineArrivalTick = state.facilityTick + 2;
      return { state: deserializeGameState(serializeGameState(state)), procedureId: procedure.id };
    }
    clinic.advance();
  }
  throw new Error("B-023 fixture did not start its scheduled procedure");
}

type Observation = { reply: OperationalEngineReply; simulationStarts: number; slices: string[] };
type Send = (request: OperationalEngineRequest) => Promise<Observation>;
type WorkerMessage = OperationalEngineWorkerReply | { kind: "bank-slice"; range: string };

async function withProductionWorker<T>(run: (send: Send) => Promise<T>): Promise<T> {
  const result = await build({
    root: fileURLToPath(new URL("../../../", import.meta.url)),
    base: BASE, mode: "production", configFile: false, envFile: false, publicDir: false, logLevel: "error",
    plugins: [forbidPrivateModules(), runtimeClinicalData()],
    build: {
      target: "es2022", write: false, reportCompressedSize: false,
      rolldownOptions: { input: fileURLToPath(new URL("./operationalEngine.worker.ts", import.meta.url)),
        output: { codeSplitting: false } },
    },
  });
  if (Array.isArray(result) || !("output" in result)) throw new Error("Expected one operational worker build");
  const chunks = result.output.filter(output => output.type === "chunk");
  if (chunks.length !== 1) throw new Error("Expected one self-contained operational worker");
  const entry = new URL(chunks[0]!.fileName, `file://${BASE}`).href;
  const assets = Object.fromEntries(result.output.filter(output => output.type === "asset")
    .map(asset => [BASE + asset.fileName, asset.source]));

  // Provide the browser worker's transport and serve only the emitted assets.
  // Blob.slice observes actual bank reads without changing decoding or caching.
  const worker = new Worker(`
    const { registerHooks } = require("node:module");
    const { parentPort, workerData } = require("node:worker_threads");
    // Give import.meta.url a hierarchical base for the emitted relative asset URLs.
    const { entry } = workerData;
    registerHooks({
      resolve(specifier, context, next) {
        if (specifier === entry) return { url: entry, format: "module", shortCircuit: true };
        return next(specifier, context);
      },
      load(url, context, next) {
        if (url === entry) return { source: workerData.code, format: "module", shortCircuit: true };
        return next(url, context);
      },
    });
    globalThis.fetch = async (url) => {
      const path = new URL(url, "https://b023.invalid").pathname;
      if (!Object.hasOwn(workerData.assets, path)) throw new Error("Unexpected offline asset: " + path);
      const response = new Response(workerData.assets[path]);
      const blob = response.blob.bind(response);
      response.blob = async () => {
        const body = await blob();
        const slice = body.slice.bind(body);
        body.slice = (start, end, type) => {
          parentPort.postMessage({ kind: "bank-slice", range: path + ":" + start + "-" + end });
          return slice(start, end, type);
        };
        return body;
      };
      return response;
    };
    globalThis.postMessage = message => parentPort.postMessage(message);
    import(entry)
      .then(() => parentPort.on("message", data => globalThis.onmessage({ data })))
      .catch(error => { throw error; });
  `, { eval: true, execArgv: [], workerData: { code: chunks[0]!.code, entry, assets } });
  const messages = on(worker, "message", { close: ["exit"] });
  const read = async (): Promise<WorkerMessage> => {
    const next = await messages.next();
    if (next.done) throw new Error("Operational worker exited before replying");
    return next.value[0] as WorkerMessage;
  };
  try {
    expect(await read()).toEqual({ ready: true });
    return await run(async request => {
      worker.postMessage(request);
      const slices: string[] = [];
      let receipts = 0, simulationStarts = 0;
      for (;;) {
        const message = await read();
        if ("kind" in message && message.kind === "bank-slice") { slices.push(message.range); continue; }
        if ("ready" in message) throw new Error("Operational worker reported ready twice");
        expect(message.id).toBe(request.id);
        if ("received" in message) { receipts++; continue; }
        if ("progress" in message) {
          if (message.progress === "simulation") simulationStarts++;
          continue;
        }
        expect(receipts).toBe(1);
        return { reply: message, simulationStarts, slices };
      }
    });
  } finally {
    await messages.return?.();
    await worker.terminate();
  }
}

function fullCatalogueDispatch(): Send {
  const engine = new OperationalEngineProcessor();
  return async request => {
    let simulationStarts = 0;
    const reply = await new Promise<OperationalEngineReply>(resolve => {
      dispatchOperationalEngineRequest(engine, structuredClone(request), resolve, message => {
        if (message.progress === "simulation") simulationStarts++;
      });
    });
    return { reply, simulationStarts, slices: [] };
  };
}

const canonicalSave = (state: GameState) => logicalJsonText(parseCodecJson(serializeGameState(state)));

async function replayTicks(send: Send, initial: GameState, commands: GameCommand[]) {
  const opened = await send({ id: 1, kind: "initialize", checkpoint: createGameEvidenceCheckpoint(initial),
    visibleState: initial, atRealMs: initial.createdAtRealMs + initial.facilityTick * ONE_X_INTERVAL, snapshotOnly: true });
  expect(opened.reply).toMatchObject({ kind: "initialized", version: 0 });
  const ticks: Array<{ tick: number; simulationStarts: number; slices: string[] }> = [];
  const committedCommands = [];
  let visible = initial;
  for (const [version, command] of commands.entries()) {
    const { reply, simulationStarts, slices } = await send({ id: version + 2, kind: "command", expectedVersion: version, command });
    const tick = initial.facilityTick + version + 1;
    if (reply.kind !== "applied") throw new Error(`Tick ${tick} did not apply: ${reply.kind === "failure" ? reply.code : reply.kind}`);
    if (!reply.delta) throw new Error(`Tick ${tick} did not commit evidence`);
    expect(reply).toMatchObject({ baseVersion: version, version: version + 1, replayed: false });
    const transitions = reply.delta.records.filter(record => record.kind === "transition");
    expect(transitions, `tick ${tick} committed transitions`).toHaveLength(1);
    committedCommands.push((transitions[0]!.value as EvidenceObject).command);
    visible = applyOperationalStatePatch(visible, reply.patch);
    expect(visible.facilityTick).toBe(tick);
    expect(visible.operationReceipts[command.operationId]?.status).toBe("applied");
    expect(simulationStarts, `tick ${tick} simulation progress`).toBeGreaterThanOrEqual(1);
    ticks.push({ tick, simulationStarts, slices });
  }
  const saved = await send({ id: commands.length + 2, kind: "checkpoint", expectedVersion: commands.length });
  if (saved.reply.kind !== "checkpoint") throw new Error("Operational worker did not return its checkpoint");
  const { snapshot, evidence } = saved.reply.checkpoint;
  const state = importGameEvidence(snapshot, evidence);
  const canonicalBytes = canonicalSave(state);
  expect(canonicalSave(visible) === canonicalBytes, "published state matches the checkpoint").toBe(true);
  return { state, canonicalBytes, commandBytes: JSON.stringify(committedCommands), ticks };
}

describe("B-023 production catalogue during ordinary 1x play", () => {
  let production: Awaited<ReturnType<typeof replayTicks>>, full: typeof production;
  let commands: GameCommand[];
  let initial: ReturnType<typeof clinicCheckpoint>;

  beforeAll(async () => {
    initial = clinicCheckpoint();
    const { state } = initial;
    expect(state).toMatchObject({ facilityLevel: 5, paused: false, simulationSpeed: 1 });
    commands = Array.from({ length: WINDOW_TICKS }, (_, index) => {
      const tick = state.facilityTick + index + 1;
      return { type: "ADVANCE_TICK", operationId: `b023.tick.${tick}`, advancedAtRealMs: state.createdAtRealMs + tick * ONE_X_INTERVAL };
    });
    full = await replayTicks(fullCatalogueDispatch(), state, commands);
    production = await withProductionWorker(send => replayTicks(send, state, commands));
  }, 60_000);

  it("advances a scheduled arrival and a consult with identical save and committed command bytes", () => {
    const { facilityTick } = initial.state;
    expect(production.state.serviceOperations.some(operation => operation.actorKind === "visitor" &&
      operation.incomeLineId === "income.advanced_endoscopy" && operation.createdAtFacilityTick === facilityTick + 1),
    "the first tick admitted the scheduled visitor").toBe(true);
    expect(Object.values(production.state.encounters).some(encounter => encounter.consult?.kind === "endoscopy" &&
      encounter.consult.serviceOperationId === initial.procedureId && encounter.waiting.arrivedAtTick === facilityTick + 2),
    "the next tick selected a consult from the active procedure").toBe(true);
    expect(Object.values(production.state.learningHistories).some(history => history.reviews.length > 0)).toBe(true);
    expect(production.canonicalBytes === full.canonicalBytes, "canonical save bytes including cards, reviews and receipts").toBe(true);
    expect(production.commandBytes).toBe(full.commandBytes);
    expect(full.commandBytes).toBe(JSON.stringify(commands));
  });

  it("re-simulates any tick from its checkpoint at most once", () => {
    // One simulation progress message per entry into the processor, per request
    // ID. Subtract the first attempt; subsequent entries restart that same tick.
    const restarts = production.ticks.map(tick => tick.simulationStarts - 1);
    expect(Math.max(...restarts),
      `Simulation restarts by facility tick: ${production.ticks.map((tick, i) => `${tick.tick}=${restarts[i]}`).join(", ")}`,
    ).toBeLessThanOrEqual(1);
  });

  it("bounds binary slice reads and re-reads across consecutive ticks", () => {
    const earlierSlices = new Set<string>();
    let reads = 0, rereads = 0;
    for (const tick of production.ticks) {
      reads += tick.slices.length;
      rereads += tick.slices.filter(slice => earlierSlices.has(slice)).length;
      for (const slice of tick.slices) earlierSlices.add(slice);
    }
    const trace = production.ticks.map(tick => `${tick.tick}=${tick.slices.length}`).join(", ");
    const sizes = `${Buffer.byteLength(serializeGameState(initial.state))} B opening, ${Buffer.byteLength(production.canonicalBytes)} B ending save`;
    // Only one case is selected in this window. Allow an average of one slice
    // per tick for all loading, and one repeated range across tick requests.
    expect.soft(reads, `Slice reads by facility tick: ${trace} (${sizes})`).toBeLessThanOrEqual(WINDOW_TICKS);
    expect(rereads, `Slices read again after an earlier tick (${earlierSlices.size} distinct ranges)`).toBeLessThanOrEqual(1);
  });
});
