import { expect, it } from "vitest";
import { GameEvidenceError } from "@gamify-surgery/game-domain";
import { CloudSyncError } from "./transport";
import { CommandFailureBackoff, commandProgrammingFailure, commandSource, decodeCommandFailure, encodeCommandFailure, safeCommandType } from "./commandFailure";

it("identifies an atomic remodel failure without exposing command contents", () => {
  const error = new TypeError("PRIVATE");
  error.stack = "TypeError: PRIVATE\n at applyRoomRemodel (https://local.invalid/packages/game-domain/src/room-remodel.ts:134:8)";
  const fault = commandProgrammingFailure(error, "execute", "reducer")!;
  expect(commandSource(fault.info)).toBe("packages/game-domain/src/room-remodel.ts:134:8");
  expect(decodeCommandFailure(encodeCommandFailure(fault))?.info).toEqual(fault.info);
  expect(encodeCommandFailure(fault)).not.toContain("PRIVATE");
  expect(safeCommandType("APPLY_REMODEL_PLAN")).toBe("APPLY_REMODEL_PLAN");
});

it("transports only allowlisted source locations/classes and rejects malformed failure metadata", () => {
  const error = new TypeError("PRIVATE patient/name/token");
  error.stack = "TypeError: PRIVATE\n at PRIVATE (https://evil.invalid/PRIVATE:1:2)\n at reduceHireStaff (https://local.invalid/packages/game-domain/src/reducer.ts:9984:7)";
  const fault = commandProgrammingFailure(error, "execute", "processor")!;
  expect(fault.info).toEqual({ stage: "execute", errorClass: "TypeError", source: "reducer", line: 9984, column: 7 });
  expect(commandSource(fault.info)).toBe("packages/game-domain/src/reducer.ts:9984:7");
  const wire = encodeCommandFailure(fault);
  expect(wire).toMatch(/^[a-z0-9-]{1,80}$/); expect(wire).not.toContain("PRIVATE");
  expect(decodeCommandFailure(wire)?.info).toEqual(fault.info);
  for (const bad of ["cf-execute-type-private-9984-7", "cf-invented-type-reducer", "cf-execute-private-reducer", "cf-execute-type-reducer-99999999-1"]) expect(decodeCommandFailure(bad)).toBeNull();
  expect(safeCommandType("PRIVATE_PATIENT")).toBe("UNKNOWN"); expect(safeCommandType("HIRE_STAFF")).toBe("HIRE_STAFF");
});

it("supports minified production bundle positions without retaining URL, hash, function name or text", () => {
  const error = new ReferenceError("PRIVATE");
  error.stack = "ReferenceError: PRIVATE\n at PRIVATE (https://private.invalid/assets/operationalEngine.worker-Aa123456.js:1:45678)";
  const fault = commandProgrammingFailure(error, "projection", "processor")!;
  expect(fault.info).toEqual({ stage: "projection", errorClass: "ReferenceError", source: "bundleworker", line: 1, column: 45678 });
  expect(JSON.stringify(fault.info)).not.toMatch(/PRIVATE|private|Aa123456|https/);
});

it("preserves typed integrity, proof, authority, cache and catalogue failures", () => {
  expect(commandProgrammingFailure(new GameEvidenceError("immutable-pins"), "execute", "processor")).toBeNull();
  expect(commandProgrammingFailure(new CloudSyncError("writer"), "journal", "session")).toBeNull();
  const typed = Object.assign(new TypeError("typed invariant"), { code: "checksum" });
  expect(commandProgrammingFailure(typed, "recovery", "session")).toBeNull();
});

it("bounds identical clock retries despite changing operation IDs/timestamps; healthy commands remain independent", () => {
  let now = 0; const gate = new CommandFailureBackoff(() => now);
  const clock = (i: number) => ({ type: "ADVANCE_TICK" as const, operationId: `tick.${i}`, advancedAtRealMs: i * 250 });
  expect(gate.failed(clock(0), 0)).toBe(true);
  for (let i = 1; i <= 100; i++) expect(gate.blocked(clock(i), 0)).toBe(true);
  expect(gate.blocked({ type: "SET_PAUSED", operationId: "player", paused: true }, 0)).toBe(false);
  now = 1000; expect(gate.blocked(clock(101), 0)).toBe(false); expect(gate.failed(clock(101), 0)).toBe(false);
  now = 2999; expect(gate.blocked(clock(102), 0)).toBe(true);
  now = 3000; expect(gate.blocked(clock(103), 0)).toBe(false);
  expect(gate.blocked(clock(103), 1)).toBe(false);
  gate.success(); expect(gate.blocked(clock(104), 0)).toBe(false);
});


it("isolates structured-clone programming faults while preserving other DOM/storage exceptions", () => {
  const fault = commandProgrammingFailure(new DOMException("PRIVATE", "DataCloneError"), "capture", "engine")!;
  expect(fault.info).toMatchObject({ stage: "capture", errorClass: "DataCloneError" });
  expect(decodeCommandFailure(encodeCommandFailure(fault))?.info).toEqual(fault.info);
  for (const name of ["QuotaExceededError", "SecurityError", "AbortError"]) expect(commandProgrammingFailure(new DOMException("PRIVATE", name), "journal", "session")).toBeNull();
});


it("recognizes the verified production synchronous-reducer bundle without persisting its build hash or URL", () => {
  const error = new TypeError("PRIVATE");
  error.stack = "TypeError: PRIVATE\n at PRIVATE (https://private.invalid/assets/codecEvidence-Aa123456.js:5:120)";
  const fault = commandProgrammingFailure(error, "execute", "session")!;
  expect(fault.info).toEqual({ stage: "execute", errorClass: "TypeError", source: "bundlecodec", line: 5, column: 120 });
  expect(commandSource(fault.info)).toBe("bundle/codecEvidence.js:5:120");
  expect(decodeCommandFailure(encodeCommandFailure(fault))?.info).toEqual(fault.info);
  expect(JSON.stringify(fault.info)).not.toMatch(/PRIVATE|private|Aa123456|https/);
});
