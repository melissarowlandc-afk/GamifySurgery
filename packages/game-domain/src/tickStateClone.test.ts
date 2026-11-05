import { expect, it } from "vitest";
import { cloneTickState } from "./tickStateClone";
import type { GameState } from "./types";

function fixture() {
  return { facilityTick: 1, rooms: [{ id: "room", cleanliness: 50 }],
    learningHistories: { retained: { card: { dueAtMs: 123 }, reviews: [{ id: "review" }] } },
    reviewIntents: [{ id: "review" }], schedulerPins: { version: 1 },
    events: [{ id: "event" }], settlements: [{ id: "settlement" }], serviceIncomeReceipts: [{ id: "receipt" }],
    encounters: { patient: { frozenCase: { id: "frozen", decisionNodes: [{ id: "node" }] }, location: { x: 1, y: 2 } } },
    employeeDiscussions: { colleague: { frozenCase: { id: "discussion" }, status: "active" } },
  } as unknown as GameState;
}
function freeze<T>(value: T): T {
  if (value && typeof value === "object") { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}

it("preserves byte-exact property order and ordinary structured-cloneable values", () => {
  const state = fixture(), next = cloneTickState(state);
  expect(JSON.stringify(next)).toBe(JSON.stringify(JSON.parse(JSON.stringify(state))));
  expect(structuredClone(next)).toStrictEqual(next);
});

it("shares immutable learning, reviews and frozen cases, with privately owned operational data", () => {
  const state = freeze(fixture()), next = cloneTickState(state);
  expect(next.learningHistories).toBe(state.learningHistories);
  expect(next.reviewIntents).toBe(state.reviewIntents);
  expect(next.encounters.patient!.frozenCase).toBe(state.encounters.patient!.frozenCase);
  expect(next.employeeDiscussions!.colleague!.frozenCase).toBe(state.employeeDiscussions!.colleague!.frozenCase);
  expect(next.rooms).not.toBe(state.rooms); expect(next.rooms[0]).not.toBe(state.rooms[0]);
  next.rooms[0]!.cleanliness = 40; next.facilityTick++;
  expect(state.rooms[0]!.cleanliness).toBe(50); expect(state.facilityTick).toBe(1);
});

it("owns append/prune collections while retaining their immutable existing records", () => {
  const state = freeze(fixture()), next = cloneTickState(state);
  for (const field of ["events", "settlements", "serviceIncomeReceipts"] as const) {
    expect(next[field]).not.toBe(state[field]); expect(next[field][0]).toBe(state[field][0]);
  }
  next.events.splice(0, 1); next.settlements = []; next.serviceIncomeReceipts = [];
  expect(state.events).toHaveLength(1); expect(state.settlements).toHaveLength(1); expect(state.serviceIncomeReceipts).toHaveLength(1);
});

it("keeps absent optional collections absent and preserves JSON omission semantics", () => {
  const state = fixture(); delete state.employeeDiscussions;
  const next = cloneTickState(state);
  expect(Object.hasOwn(next, "employeeDiscussions")).toBe(false);
  expect(JSON.stringify(next)).toBe(JSON.stringify(JSON.parse(JSON.stringify(state))));
});

it("never serializes retained learning or clinical payloads, regardless of their size", () => {
  const state = fixture();
  const rejectTraversal = () => { throw new Error("immutable history traversed by tick clone"); };
  // Deterministic complexity budget: increasing historical data cannot add a
  // single serialization of a shared payload. This catches full-state clone
  // regressions independently of CI scheduling and CPU speed.
  Object.defineProperty(state.learningHistories, "toJSON", { value: rejectTraversal });
  Object.defineProperty(state.encounters.patient!.frozenCase, "toJSON", { value: rejectTraversal });
  const next = cloneTickState(state);
  expect(next.learningHistories).toBe(state.learningHistories);
  expect(next.encounters.patient!.frozenCase).toBe(state.encounters.patient!.frozenCase);
});
