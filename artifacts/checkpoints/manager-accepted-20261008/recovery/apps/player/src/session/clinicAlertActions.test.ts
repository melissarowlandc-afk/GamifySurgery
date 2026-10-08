import { describe, expect, it } from "vitest";
import { createInitialGameState, evaluateGuidanceTipCandidates, gameReducer, getRoomDefinition, getStaffRoleDefinition, type GameState } from "@gamify-surgery/game-domain";
import type { ClinicAlertAction } from "../ui/types";
import { clinicAlertCommand, getClinicAlertActionProblem } from "./clinicAlertActions";

function clinic() {
  const state = createInitialGameState();
  state.facilityLevel = 1; state.cash = 5000; state.cashCents = 500000;
  return state;
}
function apply(state: GameState, action: ClinicAlertAction, id = "alert.fix") {
  const problem = getClinicAlertActionProblem(state, action);
  if (problem) return { state, ok: false, reason: problem };
  const command = clinicAlertCommand(action, "employee.alert-test")!;
  const next = gameReducer(state, { ...command, operationId: id });
  return { state: next, ok: next.operationReceipts[id]?.status === "applied", reason: next.operationReceipts[id]?.message };
}

describe("guarded clinic alert actions", () => {
  it("routes the new tip controls to existing guarded commands and leaves training/goals as navigation", () => {
    const pairs: [ClinicAlertAction, unknown][] = [
      [{ kind: "raise_salary", employeeId: "employee", fromSalary: 18, salary: 20 }, { type: "SET_EMPLOYEE_SALARY", employeeId: "employee", salaryPerExpenseInterval: 20 }],
      [{ kind: "praise_employee", employeeId: "employee" }, { type: "PRAISE_EMPLOYEE", employeeId: "employee" }],
      [{ kind: "enable_appointments" }, { type: "SET_SERVICE_APPOINTMENTS_ENABLED", enabled: true }],
      [{ kind: "level_up" }, { type: "LEVEL_UP" }],
      [{ kind: "open_discussion", discussionId: "discussion" }, { type: "OPEN_EMPLOYEE_DISCUSSION", discussionId: "discussion" }],
      [{ kind: "train_employee", employeeId: "employee", expectedCost: 50 }, null],
      [{ kind: "show_goals" }, null],
    ];
    for (const [action, command] of pairs) expect(clinicAlertCommand(action, "new.employee")).toEqual(command);
  });
  it("raises only the named employee by the displayed wage step, starts real praise, and rejects stale controls", () => {
    let state = clinic();
    state = gameReducer(state, { type: "HIRE_STAFF", operationId: "staff.tip", employeeId: "employee.tip", staffRoleDefinitionId: "staff.receptionist" });
    state.openChartEncounterId = null; state.environment.founderActivity = null;
    const employee = state.employees[0]!; const role = getStaffRoleDefinition(employee.staffRoleDefinitionId)!;
    employee.morale = 20;
    const action: ClinicAlertAction = { kind: "raise_salary", employeeId: employee.id,
      fromSalary: employee.salaryPerExpenseInterval, salary: employee.salaryPerExpenseInterval + role.salaryAdjustmentStep };
    const raised = apply(state, action, "tip.salary");
    expect(raised.ok).toBe(true); expect(raised.state.employees[0]!.salaryPerExpenseInterval).toBe(action.salary);
    expect(raised.state.employees[0]!.morale).toBeGreaterThan(employee.morale);
    expect(getClinicAlertActionProblem(raised.state, action)).toContain("salary changed");
    const praised = apply(state, { kind: "praise_employee", employeeId: employee.id }, "tip.praise");
    expect(praised.ok).toBe(true); expect(praised.state.environment.founderActivity).toMatchObject({ kind: "praise_employee", targetId: employee.id });
    expect(praised.state.employees[0]!.morale).toBe(employee.morale);
    expect(getClinicAlertActionProblem(praised.state, { kind: "praise_employee", employeeId: employee.id })).toContain("already doing required work");
  });
  it("enables appointments once, and rechecks completed goals/discussions and missing training", () => {
    const state = clinic(); state.serviceAppointmentsEnabled = false;
    const enabled = apply(state, { kind: "enable_appointments" }, "tip.appointments");
    expect(enabled.ok).toBe(true); expect(enabled.state.serviceAppointmentsEnabled).toBe(true);
    expect(getClinicAlertActionProblem(enabled.state, { kind: "enable_appointments" })).toContain("already enabled");
    expect(getClinicAlertActionProblem(state, { kind: "level_up" })).toContain("requirements");
    expect(getClinicAlertActionProblem(state, { kind: "open_discussion", discussionId: "ended" })).toBeTruthy();
    expect(getClinicAlertActionProblem(state, { kind: "train_employee", employeeId: "left", expectedCost: 50 })).toBeTruthy();
  });
  it("rechecks the tip's remedy target and quote even when the action kind is unchanged", () => {
    const state = clinic(); state.facilityLevel = 3;
    const candidate = evaluateGuidanceTipCandidates(state).find((tip) => tip.id === "tip.surgery.setup")!;
    expect(candidate.action?.kind).toBe("place_room");
    if (!candidate.action) throw new Error("Expected the concrete surgery setup action.");
    const action: ClinicAlertAction = { ...candidate.action, tip: { id: candidate.id, targetKey: candidate.targetKey } };
    expect(getClinicAlertActionProblem(state, action)).toBeNull();
    expect(getClinicAlertActionProblem(state, { ...action, kind: "place_room", definitionId: "room.waiting" })).toContain("no longer applies");
    expect(getClinicAlertActionProblem(state, { ...action, kind: "place_room", definitionId: "room.periop_recovery", expectedCost: 1 })).toContain("no longer applies");
  });
  it("hires once at the quoted price and rejects a subsequent stale purchase", () => {
    const state = clinic();
    const cost = getStaffRoleDefinition("staff.receptionist")!.hiringCost;
    const action: ClinicAlertAction = { kind: "hire_staff", roleId: "staff.receptionist", expectedCost: cost };
    const hired = apply(state, action);
    expect(hired.ok).toBe(true); expect(hired.state.cash).toBe(5000 - cost);
    expect(hired.state.employees).toHaveLength(1);
    expect(apply(hired.state, action).ok).toBe(false);
    expect(getClinicAlertActionProblem(hired.state, { ...action, requiresMissingCoverage: true })).toContain("installed coverage");
    expect(state.employees).toHaveLength(0);
  });
  it("rechecks price and cash without changing the clinic", () => {
    const state = clinic(); state.cash = 1; state.cashCents = 100;
    const denied = apply(state, { kind: "hire_staff", roleId: "staff.receptionist" });
    expect(denied.ok).toBe(false); expect(denied.state).toBe(state); expect(denied.reason).toContain("cash");
    state.cash = 5000; state.cashCents = 500000;
    expect(apply(state, { kind: "hire_staff", roleId: "staff.receptionist", expectedCost: 1 }).reason).toContain("price changed");
  });
  it("buys only the named room's displayed next tier", () => {
    const state = clinic();
    const definition = getRoomDefinition("room.examination")!;
    const room = { id: "upgrade.exam", roomDefinitionId: definition.id, x: 32 - definition.width, y: 20, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 };
    state.rooms.push(room);
    state.rooms.push(...Array.from({ length: 9 }, (_, index) => ({ id: `hall.${index}`, roomDefinitionId: "room.hallway", x: 32, y: 20 + index, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })));
    state.doors.push({ id: "desk.west", roomId: state.rooms[0]!.id, side: "west", offset: 0, exterior: false }, { id: "exam.east", roomId: room.id, side: "east", offset: 1, exterior: false });
    const cost = getRoomDefinition(room.roomDefinitionId)!.upgradeCosts[0]!;
    const action: ClinicAlertAction = { kind: "upgrade_room", roomId: room.id, expectedCost: cost };
    const upgraded = apply(state, action);
    expect(upgraded.ok).toBe(true); expect(upgraded.state.rooms.find((candidate) => candidate.id === room.id)?.upgradeLevel).toBe(2);
    expect(upgraded.state.cash).toBe(5000 - cost);
    expect(apply(upgraded.state, action).ok).toBe(false);
    state.cash = 250; state.cashCents = 25000;
    expect(apply(state, action).reason).toContain("buffer");
  });
  it("sends the founder to refill and collect rather than completing work instantly", () => {
    const state = clinic(); state.environment.waterCoolerFillPercent = 0;
    const refill = apply(state, { kind: "refill_water" });
    expect(refill.ok).toBe(true); expect(refill.state.environment.founderActivity?.kind).toBe("refill_water");
    expect(refill.state.environment.waterCoolerFillPercent).toBe(0);
    state.environment.litterItems.push({ id: "litter.alert", roomId: state.rooms[0]!.id, location: { x: 34, y: 30 }, spawnedAtFacilityTick: 0 });
    const clean = apply(state, { kind: "collect_litter", litterId: "litter.alert" });
    expect(clean.ok).toBe(true); expect(clean.state.environment.founderActivity?.targetId).toBe("litter.alert");
    expect(clean.state.environment.litterItems).toHaveLength(1);
  });
  it("uses the consultation cooldown and does not expose an unavailable money fix", () => {
    const state = clinic(); state.cash = 0; state.cashCents = 0;
    const paid = apply(state, { kind: "emergency_consult" });
    expect(paid.ok).toBe(true); expect(paid.state.cash).toBeGreaterThan(0);
    expect(apply(paid.state, { kind: "emergency_consult" }).ok).toBe(false);
  });
  it("leaves the founder with an unanswered open chart", () => {
    const state = clinic(); const encounter = Object.values(state.encounters)[0]!;
    encounter.lifecycle = "active_action_required"; encounter.patientMovement = null;
    encounter.steps[encounter.currentNodeIndex]!.status = "action_required";
    state.openChartEncounterId = encounter.id; state.environment.founderActivity = null;
    state.environment.pendingFounderConsult = null; state.environment.waterCoolerFillPercent = 0;
    expect(getClinicAlertActionProblem(state, { kind: "refill_water" })).toContain("open patient or team question");
  });
  it("takes just one advertising step and rechecks a stale tier", () => {
    const state = clinic(); state.encounters = {}; state.nextRoutineArrivalTick = 200;
    const raised = apply(state, { kind: "set_advertising", level: 1, fromLevel: 0 });
    expect(raised.ok).toBe(true); expect(raised.state.advertisingLevel).toBe(1);
    expect(apply(raised.state, { kind: "set_advertising", level: 1, fromLevel: 0 }).reason).toContain("Advertising changed");
    expect(getClinicAlertActionProblem(state, { kind: "set_advertising", level: 3 })).toContain("step");
  });
  it("keeps room placement a priced navigation intent and rejects unavailable construction", () => {
    const state = clinic();
    const action: ClinicAlertAction = { kind: "place_room", definitionId: "room.waiting", expectedCost: getRoomDefinition("room.waiting")!.constructionCost };
    expect(getClinicAlertActionProblem(state, action)).toBeNull();
    expect(clinicAlertCommand(action, "employee")).toBeNull();
    expect(getClinicAlertActionProblem(state, { kind: "place_room", definitionId: "room.ambulatory_or" })).toContain("not available");
  });
  it("opens a checked-in live chart and rejects a visit that has ended", () => {
    const state = clinic(); const encounter = Object.values(state.encounters)[0]!;
    encounter.checkInStatus = "checked_in"; encounter.patientMovement = null; encounter.patientLocation = { x: 34, y: 29 };
    const opened = apply(state, { kind: "open_chart", encounterId: encounter.id });
    expect(opened.ok).toBe(true); expect(opened.state.openChartEncounterId).toBe(encounter.id);
    encounter.resolutionReason = "completed";
    expect(apply(state, { kind: "open_chart", encounterId: encounter.id }).reason).toContain("ended");
  });
});
