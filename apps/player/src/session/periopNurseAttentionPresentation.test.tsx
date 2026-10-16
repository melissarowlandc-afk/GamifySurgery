import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { beginPeriopNurseAttention, createInitialGameState, createPeriopNurseAttention, getNewPeriopServiceOperationPhases, type ServiceOperationState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";
import { describeFacilityCharacter } from "./characterActivityPresentation";
import { ServiceIncomePanel } from "../ui/ServiceIncomePanel";
import { createNeedsYouView } from "./alertsEventsViewModel";

function fixture() {
  const state = createInitialGameState();
  state.facilityLevel = 2;
  state.facilityTick = 20;
  const encounter = Object.values(state.encounters)[0]!;
  encounter.patientDisplayName = "Maya Reed";
  encounter.lifecycle = "active_pending_result";
  encounter.checkInStatus = "checked_in";
  encounter.patientMovement = null;
  encounter.patientLocation = { x: 40, y: 28 };
  state.rooms.push({ id: "periop.qa", roomDefinitionId: "room.periop_recovery", x: 38, y: 26, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  const phases = getNewPeriopServiceOperationPhases("income.endoscopy")!;
  const operation: ServiceOperationState = {
    id: "operation.qa", incomeLineId: "income.endoscopy", catalogVersion: 1, actorKind: "encounter", actorId: encounter.id,
    displayName: encounter.patientDisplayName, appearance: encounter.patientAppearance, status: "in_service", createdAtFacilityTick: 0,
    waitDeadlineFacilityTick: 60, startedAtFacilityTick: 0, completedAtFacilityTick: null, cancelledAtFacilityTick: null, quoteFee: 0,
    phaseIndex: 0, phaseStartedAtFacilityTick: 0, phaseEndsAtFacilityTick: 30, reservedRoomInstanceIds: ["periop.qa"], reservedEmployeeIds: [],
    providerReservation: null, location: encounter.patientLocation, path: [encounter.patientLocation], pathIndex: 0,
    lastMovedAtFacilityTick: 0, cancellationReason: null, frozenOperationPhases: phases, phaseFlowVersion: 1, periopBedFlowVersion: 1,
    periopBedReservation: { version: "periop-bed-reservation.v1", roomInstanceId: "periop.qa", bedId: "N3", endpoint: encounter.patientLocation },
    periopNurseAttention: createPeriopNurseAttention(state, phases),
  };
  beginPeriopNurseAttention(operation, 0);
  state.serviceOperations.push(operation);
  state.employees.push({ id: "nurse.qa", displayName: "Nurse QA", staffRoleDefinitionId: "staff.periop_nurse", appearance: state.founder.appearance,
    hiredAtFacilityTick: 0, salaryPerExpenseInterval: 0, morale: 100, trainingLevel: 1, homeRoomInstanceId: "periop.qa",
    location: { x: 39, y: 27 }, path: [{ x: 39, y: 27 }], pathIndex: 0, lastMovedAtFacilityTick: 20, lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: 100, facilityTask: null });
  return { state, encounter, operation, nurse: state.employees[0]! };
}

describe("Peri-op nurse attention presentation", () => {
  it("shows the delayed nurse check in the chart, patient activity and Services queue without adding a Needs-you card", () => {
    const { state, encounter } = fixture();
    const view = createPrototypePlayerView(state, encounter.id, false, null);
    expect(view.chart?.statusLabel).toBe("Waiting for peri-op nurse");
    expect(describeFacilityCharacter(state, { kind: "patient", id: encounter.id })?.activity).toBe("Waiting for peri-op nurse");
    expect(view.serviceIncome.periopNurseQueueLength).toBe(1);
    expect(view.serviceIncome.activeOperations[0]?.statusLabel).toBe("Waiting for peri-op nurse");
    const html = renderToStaticMarkup(<ServiceIncomePanel serviceIncome={view.serviceIncome} onAppointmentsEnabledChange={vi.fn()} onStartLaboratoryProcessing={vi.fn()} />);
    expect(html).toContain("Peri-op nurse queue · 1 waiting");
    expect(JSON.stringify(createNeedsYouView(state))).not.toMatch(/nurse queue|Waiting for peri-op nurse/i);
  });

  it.each(["pre_op", "post_op"] as const)("names the patient during %s attention and renders a standing nurse at the actual position", (kind) => {
    const { state, encounter, operation, nurse } = fixture();
    operation.phaseIndex = kind === "pre_op" ? 0 : 2;
    operation.phaseEndsAtFacilityTick = 80;
    beginPeriopNurseAttention(operation, 20);
    const task = operation.periopNurseAttention!.tasks.find((entry) => entry.kind === kind)!;
    Object.assign(task, { employeeId: nurse.id, standingPoint: nurse.location, startedAtFacilityTick: 20 });
    nurse.facilityTask = { kind: "periop_attention", targetId: operation.id, startedAtFacilityTick: 20, workMinutesRemaining: 15 };
    expect(describeFacilityCharacter(state, { kind: "staff", id: nurse.id })?.activity).toBe(`${kind === "pre_op" ? "Pre-op" : "Post-op"} check · Maya Reed`);
    const view = createPrototypePlayerView(state, encounter.id, false, null);
    const rendered = view.facility.staff.find((employee) => employee.instanceId === nurse.id)!;
    expect(rendered.location).toEqual(nurse.location);
    expect(rendered.moving).toBe(false);
    expect(rendered.supportRole).toBeUndefined();
    expect(view.serviceIncome.periopNurseQueueLength).toBe(0);
  });
});
