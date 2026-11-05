import { expect, it } from "vitest";
import { applyGameEvidenceCommand, createGameEvidenceCheckpoint, gameEvidenceDelta, type GameCommand } from "@gamify-surgery/game-domain";
import { createDiagnosticWorkload } from "../../../../../tests/fixtures/diagnostic-workload";
import { OperationalEngineProcessor } from "./operationalEngineProcessor";
import { applyOperationalStatePatch } from "./operationalStatePatch";

it("returns byte-exact raw state, journal delta and full archive across ordered commands and duplicate IDs", () => {
  const { state } = createDiagnosticWorkload();
  let expected = createGameEvidenceCheckpoint(state), visible = structuredClone(state), version = 0, id = 1;
  const engine = new OperationalEngineProcessor();
  expect(engine.handle({ id: id++, kind: "initialize", checkpoint: structuredClone(expected), visibleState: structuredClone(state), atRealMs: 1800000000000 }).kind).toBe("initialized");
  const commands: GameCommand[] = Array.from({ length: 30 }, (_, i) => ({ type: "ADVANCE_TICK", operationId: `engine.tick.${i}`, advancedAtRealMs: 1800000000000 + i * 1000 }));
  commands.splice(8, 0, { type: "SET_SIMULATION_SPEED", speed: 4, operationId: "engine.speed" });
  commands.push(commands[0]!);
  for (const command of commands) {
    const result = applyGameEvidenceCommand(expected, command);
    const reply = engine.handle({ id: id++, kind: "command", expectedVersion: version++, command });
    expect(reply.kind).toBe("applied"); if (reply.kind !== "applied") throw Error("Engine command failed");
    const next = applyOperationalStatePatch(visible, structuredClone(reply.patch));
    const expectedVisible = result.replayed ? visible : result.state;
    expect(JSON.stringify(next)).toBe(JSON.stringify(expectedVisible));
    expect(JSON.stringify(reply.delta)).toBe(JSON.stringify(result.replayed ? null : gameEvidenceDelta(expected, result.checkpoint)));
    visible = next; expected = result.checkpoint;
    const archive = engine.handle({ id: id++, kind: "checkpoint", expectedVersion: version });
    expect(archive.kind).toBe("checkpoint"); if (archive.kind !== "checkpoint") throw Error("Engine export failed");
    expect(JSON.stringify(archive.checkpoint)).toBe(JSON.stringify(expected));
  }
  expect(engine.handle({ id: id++, kind: "command", expectedVersion: version - 1, command: commands[0]! }))
    .toEqual({ id: id - 1, kind: "failure", code: "engine-version" });
  const retained = engine.handle({ id, kind: "checkpoint", expectedVersion: version });
  expect(retained.kind).toBe("checkpoint");
  if (retained.kind === "checkpoint") expect(JSON.stringify(retained.checkpoint)).toBe(JSON.stringify(expected));
}, process.env.CI ? 600_000 : 60_000);
