import { describe, expect, it } from "vitest";
import type { EncounterState, FounderActivityState, RetailOperationState, ServiceOperationState } from "@gamify-surgery/game-domain";
import { getFounderActivityLabel } from "./founderActivityPresentation";

const activity = (kind: FounderActivityState["kind"], pathIndex = 0): FounderActivityState => ({
  kind, targetId: "operation.endoscopy", path: [{ x: 1, y: 1 }, { x: 2, y: 1 }], pathIndex,
  lastMovedAtFacilityTick: 0, workMinutesRemaining: 5,
});
const service = (incomeLineId = "income.endoscopy"): ServiceOperationState => ({
  id: "operation.endoscopy", incomeLineId, catalogVersion: 1, actorKind: "encounter", actorId: "patient",
  displayName: "Patient", appearance: null, status: "in_service", createdAtFacilityTick: 0,
  waitDeadlineFacilityTick: 10, startedAtFacilityTick: 0, completedAtFacilityTick: null, cancelledAtFacilityTick: null,
  quoteFee: 0, phaseIndex: 0, phaseStartedAtFacilityTick: 0, phaseEndsAtFacilityTick: 10,
  reservedRoomInstanceIds: [], reservedEmployeeIds: [], providerReservation: { kind: "founder" },
  location: { x: 1, y: 1 }, path: [], pathIndex: 0, lastMovedAtFacilityTick: 0, cancellationReason: null,
});
const label = (candidate: FounderActivityState | null, retailOperations: RetailOperationState[] = []) => getFounderActivityLabel({
  activity: candidate, serviceOperations: [service()], retailOperations, rooms: [],
});

describe("getFounderActivityLabel", () => {
  it("describes each modeled founder action and distinguishes endoscopy", () => {
    expect(label(activity("perform_service", 1))).toBe("Performing endoscopy");
    expect(label(activity("perform_service", 0))).toBe("Walking to endoscopy");
    expect(getFounderActivityLabel({ activity: activity("perform_service", 1), serviceOperations: [service("income.office-procedure")], retailOperations: [], rooms: [] })).toBe("Performing procedure");
    expect(label(activity("collect_litter"))).toBe("Picking up trash");
    expect(label(activity("refill_water"))).toBe("Refilling water cooler");
    expect(label(activity("praise_employee"))).toBe("Praising employee");
    expect(label(activity("visit_bathroom"))).toBe("Going to bathroom");
  });

  it("describes travel and conversation without narrating truly idle standing or seated states", () => {
    expect(label(activity("attend_encounter"))).toBe("Walking to patient");
    expect(label(activity("attend_encounter", 1))).toBe("Talking to patient");
    expect(label(activity("wander_facility"))).toBe("Walking through clinic");
    expect(label(activity("sit_in_chair"))).toBe("Walking to a seat");
    expect(label(activity("wander_facility", 1))).toBeUndefined();
    expect(label(activity("sit_in_chair", 1))).toBeUndefined();
    expect(label(null)).toBeUndefined();
  });

  it("lets a live founder retail trip override stale seated activity and hides it after completion", () => {
    const coffee = [{
      actorKind: "founder", actorId: "founder", incomeLineId: "income.coffee", status: "purchasing",
    }] as RetailOperationState[];
    expect(label(activity("sit_in_chair", 1), coffee)).toBe("Getting coffee");
    coffee[0]!.status = "completed";
    expect(label(activity("sit_in_chair", 1), coffee)).toBeUndefined();
  });

  it("labels a legacy pending provider endoscopy when no service operation was recorded", () => {
    const encounter = {
      pendingResult: { operationId: "operation.endoscopy", serviceIncomeLineId: "income.endoscopy" },
    } as EncounterState;
    expect(getFounderActivityLabel({
      activity: activity("perform_service", 1), serviceOperations: [], retailOperations: [], rooms: [],
      encounters: [encounter],
    })).toBe("Performing endoscopy");
  });
});
