import { expect, it } from "vitest";
import { captureRetirementEvidence } from "./incrementalEvidenceRetirement";
import { freezeEvidence, type EvidenceJson, type EvidenceObject } from "./game-evidence-json";
import type { GameState } from "./types";

it("observes fact order before pruning and materializes only actual removed rows", () => {
  const state = {
    rooms: [{ id: "room", condition: { n: 2 } }],
    encounters: { a: { id: "a", frozenCase: { id: "case.a" }, waiting: { arrivedAtTick: 1 } },
      b: { id: "b", frozenCase: { id: "case.b" }, waiting: { arrivedAtTick: 2 } } },
    events: [{ id: "event", text: "example" }],
    serviceOperations: [{ id: "s1", frozenOperationPhases: [{ id: "p1" }] }, { id: "s2", frozenOperationPhases: [] }],
    retailOperations: [], retailExternalActors: [], retailOrders: [],
  };
  const previous = freezeEvidence(JSON.parse(JSON.stringify(state))) as GameState;
  const calls: string[] = [];
  const owns = (path: readonly string[]) => path[0] === "events" && path.length === 2 ||
    path[0] === "encounters" && path.length === 3 && path[2] === "frozenCase" ||
    path[0] === "serviceOperations" && path.length === 3 && path[2] === "frozenOperationPhases";
  const project = (value: EvidenceJson, path: string[]) => { calls.push(path.join("/")); return JSON.parse(JSON.stringify(value)) as EvidenceJson; };
  const capture = captureRetirementEvidence(state as unknown as GameState, previous, {} as EvidenceObject, owns, project);
  expect(calls).toEqual(["encounters/a/frozenCase", "encounters/b/frozenCase", "events/0", "serviceOperations/0/frozenOperationPhases", "serviceOperations/1/frozenOperationPhases"]);
  calls.length = 0;
  delete (state.encounters as Partial<typeof state.encounters>).a;
  state.serviceOperations = state.serviceOperations.slice(1);
  const removed = capture.materializeRemoved(state as unknown as GameState);
  expect(calls).toEqual(["encounters/a", "serviceOperations/0"]);
  expect(Object.keys(removed.encounters!)).toEqual(["a"]);
  expect((removed.serviceOperations as { id: string }[]).map(row => row.id)).toEqual(["s1"]);
});
