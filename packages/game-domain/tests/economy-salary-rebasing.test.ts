import { describe, expect, it } from "vitest";
import { createInitialGameState, deserializeGameState, gameReducer, getStaffRoleDefinition,
  requestEmployeeTraining, serializeGameState, type GameState } from "../src";
import { ECONOMY_SALARY_VERSION, normalizeSavedSalary } from "../src/economy-compatibility";
import { PROTOTYPE_DOMAIN_CONTEXT } from "../src/context";
import { addTrainingEmployee, trainingFixture } from "./employee-training-fixtures";
import { timingFixture } from "./diagnostic-timing-fixtures";

const oldBases = [
  ["receptionist", 18], ["imaging_technician", 26], ["periop_nurse", 34],
  ["endoscopy_nurse", 36], ["endoscopist", 60], ["phlebotomist", 28],
  ["evs_worker", 24], ["glp1_np", 40], ["laboratory_technician", 36],
  ["surgeon", 90], ["or_nurse", 44], ["pharmacist", 42],
  ["repair_person", 30], ["radiologist", 26],
] as const;
const reload = (state: GameState) => deserializeGameState(serializeGameState(state));

describe("versioned option B saved salary rebasing", () => {
  it.each(oldBases)("preserves every permitted negotiated offset for %s", (id, oldBase) => {
    const roleId = `staff.${id}`;
    const role = getStaffRoleDefinition(roleId)!;
    const shift = role.salaryPerExpenseInterval - oldBase;
    for (let salary = role.minimumSalaryPerExpenseInterval - shift;
      salary <= role.maximumSalaryPerExpenseInterval - shift; salary += 2) {
      expect(normalizeSavedSalary(salary, roleId, undefined, PROTOTYPE_DOMAIN_CONTEXT)).toBe(salary + shift);
    }
    expect(normalizeSavedSalary(-100, roleId, undefined, PROTOTYPE_DOMAIN_CONTEXT)).toBe(role.minimumSalaryPerExpenseInterval);
    expect(normalizeSavedSalary(1000, roleId, undefined, PROTOTYPE_DOMAIN_CONTEXT)).toBe(role.maximumSalaryPerExpenseInterval);
  });
  it("rebases all roles on load once, preserving identity, training, morale, homes and cash", () => {
    const f = timingFixture();
    let state = f.state;
    const reloadFixture = (candidate: GameState) => deserializeGameState(serializeGameState(candidate), f.context);
    for (const [id, oldBase] of oldBases) {
      const role = getStaffRoleDefinition(`staff.${id}`, f.context)!;
      const homeDefinitionId = role.requiredAnyRoomDefinitionIds[0] ?? role.requiredRoomDefinitionIds[0]!;
      const home = state.rooms.find((room) => room.roomDefinitionId === homeDefinitionId) ?? f.addRoom(homeDefinitionId).room;
      const employee = addTrainingEmployee(state, `employee.rebase.${id}`, `staff.${id}`, home.id);
      employee.salaryPerExpenseInterval = oldBase + 2;
      employee.trainingLevel = 3;
      employee.morale = 91;
    }
    // Normalize this helper's founder-style employee art before testing salary
    // migration, so existing avatar compatibility is not attributed to rebasing.
    state = reloadFixture(state);
    delete state.salaryEconomyVersion;
    const loaded = reloadFixture(state);
    expect(loaded.salaryEconomyVersion).toBe(ECONOMY_SALARY_VERSION);
    loaded.employees.forEach((employee, index) => {
      const original = state.employees[index]!;
      expect(original.homeRoomInstanceId).not.toBeNull();
      expect(employee).toMatchObject({ id: original.id, displayName: original.displayName,
        hiredAtFacilityTick: original.hiredAtFacilityTick, trainingLevel: 3, morale: 91,
        homeRoomInstanceId: original.homeRoomInstanceId,
        salaryPerExpenseInterval: getStaffRoleDefinition(employee.staffRoleDefinitionId)!.salaryPerExpenseInterval + 2 });
      expect(employee.appearance).toEqual(original.appearance);
    });
    expect(loaded.cashCents).toBe(state.cashCents);
    expect(loaded.operationReceipts).toEqual(state.operationReceipts);
    expect(reloadFixture(loaded).employees.map((employee) => employee.salaryPerExpenseInterval))
      .toEqual(loaded.employees.map((employee) => employee.salaryPerExpenseInterval));
  });
  it("preserves paid training and already accrued expenses without a repeat charge", () => {
    const state = trainingFixture();
    const employee = addTrainingEmployee(state, "employee.paid-training");
    employee.salaryPerExpenseInterval = 22;
    employee.morale = 86;
    requestEmployeeTraining(state, employee.id);
    state.operatingAccrualSixtiethCents = 13209;
    delete state.salaryEconomyVersion;
    const loaded = reload(state);
    expect(loaded.employees[0]).toMatchObject({ salaryPerExpenseInterval: 14, morale: 86,
      training: employee.training, trainingLevel: employee.trainingLevel,
      homeRoomInstanceId: employee.homeRoomInstanceId });
    expect(loaded.cashCents).toBe(state.cashCents);
    expect(loaded.operatingAccrualSixtiethCents).toBe(13209);
    expect(reload(loaded).employees[0]?.training).toEqual(employee.training);
    expect(reload(loaded).cashCents).toBe(state.cashCents);
  });
  it("marks fresh campaigns and preserves current contracts and the $2/5-point negotiation", () => {
    let state = trainingFixture();
    const employee = addTrainingEmployee(state, "employee.new-scale");
    employee.salaryPerExpenseInterval = 10;
    employee.morale = 75;
    expect(createInitialGameState().salaryEconomyVersion).toBe(ECONOMY_SALARY_VERSION);
    expect(reload(state).employees[0]?.salaryPerExpenseInterval).toBe(10);
    state = gameReducer(state, { type: "SET_EMPLOYEE_SALARY", operationId: "rebase.negotiate",
      employeeId: employee.id, salaryPerExpenseInterval: 12 });
    expect(state.employees[0]).toMatchObject({ salaryPerExpenseInterval: 12, morale: 80 });
    expect(reload(state).employees[0]?.salaryPerExpenseInterval).toBe(12);
  });
  it.each([undefined, null, NaN, Infinity])("uses the new base when a legacy salary is %s", (salary) => {
    expect(normalizeSavedSalary(salary, "staff.receptionist", undefined, PROTOTYPE_DOMAIN_CONTEXT)).toBe(10);
  });
  it("rejects an unknown future salary version instead of silently rebasing it", () => {
    const saved = JSON.parse(serializeGameState(createInitialGameState()));
    saved.salaryEconomyVersion = "room-economy-future.v2";
    expect(() => deserializeGameState(JSON.stringify(saved))).toThrow("unsupported salary economy version");
  });
});
