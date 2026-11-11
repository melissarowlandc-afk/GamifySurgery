import { describe, expect, it } from "vitest";
import { getPatientLists, getRoomCareAnchor, getRoomDefinition, pediatricSupportLocation } from "@gamify-surgery/game-domain";
import { qaAttendanceCommand as command, qaAttendanceFixture, qaAttendanceTick as tick,
  qaAttendanceUntil as until } from "../../../../packages/game-domain/tests/founder-qa-attendance.fixture";
import { createPrototypePlayerView } from "./viewModels";

function expectExamAttendance(state: ReturnType<typeof qaAttendanceFixture>["state"], id: string) {
  const e = state.encounters[id]!, room = state.rooms.find(room => room.id === e.assignedRoomInstanceId)!;
  const definition = getRoomDefinition(room.roomDefinitionId)!;
  const pediatric = room.roomDefinitionId === "room.pediatric_examination";
  const chair = pediatric ? pediatricSupportLocation(room, "stool:clinician") : getRoomCareAnchor(room, definition, "clinician");
  const bed = pediatric ? pediatricSupportLocation(room, "table:patient") : getRoomCareAnchor(room, definition, "patient");
  expect(state.environment.founderActivity).toMatchObject({ kind: "attend_encounter", targetId: id });
  expect(state.environment.founderLocation).toEqual(chair); expect(e.patientLocation).toEqual(bed);
  expect(e.patientMovement).toBeNull(); expect(e.waitingDestination).toBeNull();
  const view = createPrototypePlayerView(state, null, false, null);
  expect(view.facility.founder).toMatchObject({ location: chair, moving: false, seated: true });
  const supportPrefix = pediatric ? "pediatric-examination" : room.roomDefinitionId === "room.wound_ostomy" ? "wound-ostomy" : "examination";
  expect(view.facility.founder.supportRole).toBe(`${supportPrefix}-clinician`);
  expect(view.facility.patients!.find(p => p.instanceId === id)).toMatchObject({ location: bed, moving: false,
    pose: pediatric ? "seated" : "exam-table", supportRole: `${supportPrefix}-patient` });
  if (pediatric) expect(view.facility.patients!.find(p => p.instanceId === id)?.supportId).toBe("table:patient");
  expect(view.facility.patients!.filter(p => p.instanceId === id)).toHaveLength(1);
  if (e.consult?.providerEmployeeId) expect(state.employees.find(employee => employee.id === e.consult!.providerEmployeeId)!.location).not.toEqual(chair);
}

describe("headless M10 launch-unmet chart-open routing and poses", () => {
  it.each(["new_arrival", "ordinary_result", "app", "pediatric", "wound_ostomy"])("uses bed/stool attendance for the actual available %s chart", kind => {
    let { state } = qaAttendanceFixture();
    const target = (s: typeof state) => Object.values(s.encounters).find(e => e.checkInStatus === "checked_in" && (
      kind === "new_arrival" ? !e.consult && e.lifecycle === "waiting_unopened" :
      kind === "ordinary_result" ? e.patientDisplayName === "Sophia Young" && e.lifecycle === "active_action_required" :
      e.consult?.kind === kind && e.lifecycle === "waiting_unopened"));
    state = until(state, s => Boolean(target(s)), 600);
    const id = target(state)!.id;
    const rows = getPatientLists(state);
    expect([...rows.waiting, ...rows.active].find(row => row.encounterId === id)).toBeTruthy();
    if (kind !== "new_arrival") expect([...rows.waiting, ...rows.active].find(row => row.encounterId === id)!.actionRequired).toBe(true);
    state = command(state, { type: "OPEN_CHART", encounterId: id }); state = tick(state, 120);
    expectExamAttendance(state, id);
    state = tick(state, 60); expectExamAttendance(state, id); // No idle/retail takeover.
    state = command(state, { type: "CLOSE_CHART", encounterId: id });
    expect(state.environment.founderActivity?.kind).not.toBe("attend_encounter");
  });

  it.each(["offsite", "returning"] as const)("recovers the exact reported Sophia chart opened while %s", stage => {
    let { state, id } = qaAttendanceFixture(stage);
    state = command(state, { type: "OPEN_CHART", encounterId: id }); state = tick(state, 180);
    expectExamAttendance(state, id);
  });
});
