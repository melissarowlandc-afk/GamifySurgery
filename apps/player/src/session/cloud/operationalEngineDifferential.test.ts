import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { applyGameEvidenceCommand, createGameEvidenceCheckpoint, deserializeGameState, gameEvidenceDelta,
  type GameCommand, type GameState } from "@gamify-surgery/game-domain";
import { createDiagnosticWorkload } from "../../../../../tests/fixtures/diagnostic-workload";
import { OperationalEngineProcessor } from "./operationalEngineProcessor";
import { applyOperationalStatePatch } from "./operationalStatePatch";
import { completeSnapshotLearning } from "./snapshotLearning";
import { OperationalEvidenceMirror } from "./operationalEvidenceMirror";

const hostedTime = (ms: number) => process.env.CI ? ms * 10 : ms;
const retained = () => JSON.parse(readFileSync(new URL("../../../../../tests/fixtures/level-five-integration-checkpoints-20261012.json", import.meta.url), "utf8")) as Record<string, unknown>;
const fixture = (level: number): GameState => level === 3 ? createDiagnosticWorkload().state
  : completeSnapshotLearning(deserializeGameState(JSON.stringify(retained()[level === 4 ? "integration-l4" : "integration-build"])));

it.each([3, 4, 5])("preserves every raw-state and journal byte over a long evolving Level %i command sequence", level => {
  const state = fixture(level); state.paused = false;
  const original = JSON.stringify(state), learning = JSON.stringify(state.learningHistories);
  let checkpoint = createGameEvidenceCheckpoint(state), visible = structuredClone(state), version = 0, id = 1;
  let mirror = OperationalEvidenceMirror.create(checkpoint);
  const engine = new OperationalEngineProcessor();
  expect(engine.handle({ id: id++, kind: "initialize", checkpoint: structuredClone(checkpoint), visibleState: structuredClone(state), atRealMs: 1_800_000_000_000 }).kind).toBe("initialized");
  for (let i = 0; i < 320; i++) {
    const operationId = `engine.long.${level}.${i}`;
    const command: GameCommand = i % 40 === 0 ? { type: "SET_SIMULATION_SPEED", speed: ([1, 2, 4] as const)[Math.floor(i / 40) % 3]!, operationId }
      : i % 67 === 1 ? { type: "SET_PAUSED", paused: true, operationId }
      : i % 67 === 2 ? { type: "SET_PAUSED", paused: false, operationId }
      : i === 101 ? { type: "DEV_ADD_MONEY", operationId }
      : { type: "ADVANCE_TICK", operationId, advancedAtRealMs: 1_800_000_000_000 + i * 1_000 };
    const expected = applyGameEvidenceCommand(checkpoint, command);
    const reply = engine.handle({ id: id++, kind: "command", expectedVersion: version++, command });
    expect(reply.kind, `${level}:${i}`).toBe("applied"); if (reply.kind !== "applied") throw Error("Ordered differential command failed");
    visible = applyOperationalStatePatch(visible, structuredClone(reply.patch));
    if (reply.delta) mirror = mirror.advance(structuredClone(reply.snapshotPatch), structuredClone(reply.delta));
    expect(JSON.stringify(visible), `${level}:${i} state`).toBe(JSON.stringify(expected.state));
    expect(JSON.stringify(reply.delta), `${level}:${i} delta`).toBe(JSON.stringify(gameEvidenceDelta(checkpoint, expected.checkpoint)));
    checkpoint = expected.checkpoint;
    if (i % 60 === 0 || i === 319) {
      const archive = engine.handle({ id: id++, kind: "checkpoint", expectedVersion: version });
      expect(archive.kind).toBe("checkpoint"); if (archive.kind !== "checkpoint") throw Error("Ordered differential checkpoint failed");
      expect(JSON.stringify(archive.checkpoint), `${level}:${i} archive`).toBe(JSON.stringify(checkpoint));
      expect(JSON.stringify(mirror.checkpoint), `${level}:${i} recovery mirror`).toBe(JSON.stringify(checkpoint));
      const probe = { type: "SET_SIMULATION_SPEED", speed: 2, operationId: `mirror.probe.${level}.${i}` } as const;
      const reference = applyGameEvidenceCommand(checkpoint, probe), recovered = applyGameEvidenceCommand(mirror.checkpoint, probe);
      expect(JSON.stringify(recovered.state), `${level}:${i} fallback state`).toBe(JSON.stringify(reference.state));
      expect(JSON.stringify(recovered.checkpoint), `${level}:${i} fallback archive`).toBe(JSON.stringify(reference.checkpoint));
    }
  }
  expect(JSON.stringify(visible.learningHistories)).toBe(learning);
  expect(JSON.stringify(state)).toBe(original);
}, hostedTime(120_000));
