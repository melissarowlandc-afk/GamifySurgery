import { describe, expect, it } from "vitest";
import {
  deserializeGameState, evaluateGuidanceTipCandidates, getEndoscopySetupAccess,
  getFacilityProgressionStatus, getFunctionalScheduledEndoscopyCapacity,
  getRoomCareStations, getRoomDefinition,
  pathEntersUnauthorizedProtectedRoom, PROTOTYPE_DOMAIN_CONTEXT as context,
  serializeGameState, type ServiceOperationState,
} from "../src";
import { endoscopyReadyClinic, preparedEndoscopyClinic, stuckRecoveryEndoscopyClinic } from "./routine-endoscopy-ready.fixture";

type Clinic = ReturnType<typeof endoscopyReadyClinic>;
const routine = (clinic: Clinic) => clinic.state.serviceOperations.filter(op => op.incomeLineId === "income.endoscopy");
function until(clinic: Clinic, test: () => boolean, maximum = 500) {
  for (let i = 0; i < maximum && !test(); i++) clinic.advance();
  expect(test()).toBe(true);
}
function preparedSave() {
  return preparedEndoscopyClinic();
}
const procedureStarted = (op: ServiceOperationState) => op.phaseIndex === 1 && op.phaseStartedAtFacilityTick !== null;

describe("routine endoscopy readiness and retained periop access", () => {
  it.each([0, 90, 180, 270] as const)("starts and completes through a real-command %s-degree layout", orientation => {
    const clinic = endoscopyReadyClinic({ orientation, provider: orientation === 0 || orientation === 180 });
    until(clinic, () => routine(clinic).some(procedureStarted));
    expect(clinic.state.facilityTick).toBeLessThan(300);
    until(clinic, () => routine(clinic).some(op => op.completedAtFacilityTick !== null));
    expect(clinic.state.serviceIncomeReceipts.some(receipt => receipt.incomeLineId === "income.endoscopy")).toBe(true);
    expect(getFacilityProgressionStatus(clinic.state).requirements.find(r => r.id === "progression.endoscopy_completion")?.met).toBe(true);
  });

  it("preserves the arrival clock during hiring walks and finite nurse/provider training", () => {
    const clinic = endoscopyReadyClinic({ trainingRoom: true });
    clinic.advance();
    expect(getFunctionalScheduledEndoscopyCapacity(clinic.state, context)).toBe(1);
    const due = clinic.state.nextServiceAppointmentTicks["income.endoscopy"]!;
    clinic.advance(109);
    for (const employee of clinic.state.employees) clinic.dispatch({ type: "TRAIN_EMPLOYEE", employeeId: employee.id });
    while (clinic.state.facilityTick < due - 1) {
      clinic.advance(); expect(clinic.state.nextServiceAppointmentTicks["income.endoscopy"]).toBe(due);
    }
    until(clinic, () => routine(clinic).some(procedureStarted));
    expect(clinic.state.facilityTick).toBeLessThan(400);
  });

  it.each(["founder", "nurse"] as const)("loads a stuck-shaped prepared visit and routes the %s through its own reserved Periop room", actor => {
    const clinic = preparedSave();
    if (actor === "nurse") {
      const state = JSON.parse(serializeGameState(clinic.state));
      const nurse = state.employees.find((employee: { staffRoleDefinitionId: string }) => employee.staffRoleDefinitionId === "staff.endoscopy_nurse");
      nurse.location = { ...state.environment.founderLocation }; nurse.path = [{ ...nurse.location }]; nurse.pathIndex = 0;
      clinic.restore(deserializeGameState(JSON.stringify(state)));
    }
    const operation = routine(clinic).find(op => op.status === "waiting_for_next_phase")!;
    const id = operation.id, bed = operation.periopBedReservation!.roomInstanceId, savedAt = clinic.state.facilityTick;
    clinic.reload();
    until(clinic, () => routine(clinic).some(op => op.id === id && op.status === "walking_between_phases"), 25);
    const reserved = routine(clinic).find(op => op.id === id)!;
    expect(reserved.status).toBe("walking_between_phases");
    expect(reserved.periopBedReservation?.roomInstanceId).toBe(bed);
    const activity = actor === "founder" ? clinic.state.environment.founderActivity
      : clinic.state.employees.find(e => e.staffRoleDefinitionId === "staff.endoscopy_nurse");
    expect(activity?.path.some(point => point.x >= 37 && point.x < 43 && point.y >= 21 && point.y < 27)).toBe(true);
    const allowed = new Set([...reserved.reservedRoomInstanceIds, bed]);
    expect(pathEntersUnauthorizedProtectedRoom(clinic.state, context, activity!.path, activity!.pathIndex, allowed)).toBe(false);
    until(clinic, () => routine(clinic).some(op => op.id === id && procedureStarted(op)), 60);
    expect(clinic.state.facilityTick - savedAt).toBeLessThan(40);
    until(clinic, () => routine(clinic).some(op => op.id === id && op.completedAtFacilityTick !== null));
    expect(clinic.state.serviceIncomeReceipts.filter(receipt => receipt.transactionKey.includes(id))).toHaveLength(1);
  });

  it("reports a Recovery route through unreserved Endoscopy, then completes after a loaded clinic restores the hallway", () => {
    const clinic = endoscopyReadyClinic({ chain: "recovery-through-endoscopy" });
    clinic.advance(600); clinic.reload();
    const access = getEndoscopySetupAccess(clinic.state, context);
    expect(access.recoveryRoomIds.size).toBe(0);
    expect(access.roomIssues.get("ready.recovery")).toContain("without crossing another treatment room");
    const tip = evaluateGuidanceTipCandidates(clinic.state).find(t => t.id === "tip.access.restore" && t.action?.kind === "restore_access" && t.action.roomId === "ready.recovery")!;
    expect(tip.action).toEqual({ kind: "restore_access", roomId: "ready.recovery" });
    expect(tip.values.fix).toContain("hallway doors");
    expect(routine(clinic).every(op => op.startedAtFacilityTick === null)).toBe(true);
    const repairedAt = clinic.state.facilityTick;
    clinic.dispatch({ type: "PLACE_ROOM", roomId: "ready.hall.43,27", roomDefinitionId: "room.hallway", x: 43, y: 27 });
    expect(getEndoscopySetupAccess(clinic.state, context).recoveryRoomIds.has("ready.recovery")).toBe(true);
    until(clinic, () => routine(clinic).some(procedureStarted));
    expect(clinic.state.facilityTick - repairedAt).toBeLessThan(300);
  });

  it("keeps an intentional appointments-off save off and starts normally after enabling it", () => {
    const clinic = endoscopyReadyClinic({ appointments: false });
    clinic.advance(600); clinic.reload();
    expect(routine(clinic)).toEqual([]); expect(clinic.state.serviceAppointmentsEnabled).toBe(false);
    clinic.dispatch({ type: "SET_SERVICE_APPOINTMENTS_ENABLED", enabled: true });
    until(clinic, () => routine(clinic).some(procedureStarted));
  });

  it("chooses a Recovery bed with an onward procedure route, rather than the first reachable dead end", () => {
    const clinic = endoscopyReadyClinic({ chain: "endoscopy-through-recovery", provider: false, extraRecovery: { x: 12, y: 26 } });
    until(clinic, () => routine(clinic).some(op => op.startedAtFacilityTick !== null));
    expect(routine(clinic).find(op => op.startedAtFacilityTick !== null)?.periopBedReservation?.roomInstanceId).toBe("ready.recovery");
    until(clinic, () => routine(clinic).some(procedureStarted));
  });

  it("keeps a loaded dead-end bed unchanged until the next tick, then walks to a connected bed without repeating preparation", () => {
    const clinic = stuckRecoveryEndoscopyClinic();
    const operation = routine(clinic).find(op => op.status === "waiting_for_next_phase")!, id = operation.id;
    const preparation = JSON.stringify(operation.periopNurseAttention?.tasks[0]);
    const saved = serializeGameState(clinic.state);
    clinic.reload(); expect(JSON.parse(serializeGameState(clinic.state))).toEqual(JSON.parse(saved));
    expect(routine(clinic).find(op => op.id === id)?.periopBedReservation?.roomInstanceId).toBe("ready.aaa-recovery");
    clinic.advance();
    expect(routine(clinic).find(op => op.id === id)?.periopBedReservation?.roomInstanceId).toBe("ready.recovery");
    until(clinic, () => routine(clinic).some(op => op.id === id && procedureStarted(op)), 200);
    expect(JSON.stringify(routine(clinic).find(op => op.id === id)?.periopNurseAttention?.tasks[0])).toBe(preparation);
    until(clinic, () => routine(clinic).some(op => op.id === id && op.completedAtFacilityTick !== null));
    const beds = clinic.state.serviceOperations.flatMap(op => op.periopBedReservation
      ? [`${op.periopBedReservation.roomInstanceId}:${op.periopBedReservation.bedId}`] : []);
    expect(new Set(beds).size).toBe(beds.length);
  });

  it("replays the repaired shared-room route identically through repeated reloads", () => {
    const initial = serializeGameState(preparedSave().state);
    const run = (reload: boolean) => {
      const clinic = endoscopyReadyClinic(); clinic.restore(deserializeGameState(initial));
      for (let i = 0; i < 400; i++) { clinic.advance(); if (reload && [0, 5, 25, 60, 150, 250].includes(i)) clinic.reload(); }
      expect(clinic.state.facilityTick).toBe(JSON.parse(initial).facilityTick + 400);
      return JSON.parse(serializeGameState(clinic.state));
    };
    expect(run(true)).toEqual(run(false));
  });

  it("keeps an old bed while connected beds are occupied, then repairs without duplicate bed claims", () => {
    const clinic = stuckRecoveryEndoscopyClinic(), original = routine(clinic).find(op => op.status === "waiting_for_next_phase")!;
    const id = original.id, room = clinic.state.rooms.find(room => room.id === "ready.recovery")!;
    for (const [i, bed] of getRoomCareStations(room, getRoomDefinition(room.roomDefinitionId)!, clinic.state.doors,
      clinic.state.rooms, getRoomDefinition).filter(station => station.kind === "periop_bed").entries()) {
      const holder = structuredClone(original);
      holder.id = holder.actorId = `held.recovery.${i}`; holder.createdAtFacilityTick++;
      holder.nextPhaseReadyAtFacilityTick = original.nextPhaseReadyAtFacilityTick! + 1;
      holder.periopBedReservation = { version: "periop-bed-reservation.v1", roomInstanceId: room.id, bedId: bed.id, endpoint: { ...bed.patientAnchor } };
      holder.location = { ...bed.patientAnchor }; holder.path = [{ ...bed.patientAnchor }]; holder.pathIndex = 0;
      holder.reservedRoomInstanceIds = [room.id];
      clinic.state.serviceOperations.push(holder);
    }
    clinic.reload(); clinic.advance();
    expect(routine(clinic).find(op => op.id === id)?.periopBedReservation?.roomInstanceId).toBe("ready.aaa-recovery");
    for (let i = 0; i < 800 && !routine(clinic).some(op => op.id === id && op.completedAtFacilityTick !== null); i++) {
      const before = clinic.state;
      clinic.advance();
      const claims = clinic.state.serviceOperations.flatMap(op => op.periopBedReservation ? [`${op.periopBedReservation.roomInstanceId}:${op.periopBedReservation.bedId}`] : []);
      expect(new Set(claims).size).toBe(claims.length);
      for (const owner of clinic.state.serviceOperations.filter(op => op.periopBedReservation)) {
        const previous = before.serviceOperations.find(op => op.id === owner.id)?.periopBedReservation;
        if (previous?.roomInstanceId === owner.periopBedReservation!.roomInstanceId && previous.bedId === owner.periopBedReservation!.bedId) continue;
        const point = owner.periopBedReservation!.endpoint;
        // Walking avatars may pass a bed contact. A new claim must not take a
        // stationary patient's occupied contact during the repair handoff.
        expect(clinic.state.serviceOperations.some(other => {
          const was = before.serviceOperations.find(op => op.id === other.id)?.location;
          return other.id !== owner.id && was?.x === point.x && was.y === point.y &&
            other.location?.x === point.x && other.location.y === point.y;
        })).toBe(false);
      }
    }
    expect(routine(clinic).find(op => op.id === id)?.completedAtFacilityTick).toBeGreaterThan(original.createdAtFacilityTick);
    expect(routine(clinic).find(op => op.id === id)?.cancelledAtFacilityTick).toBeNull();
  });
});
