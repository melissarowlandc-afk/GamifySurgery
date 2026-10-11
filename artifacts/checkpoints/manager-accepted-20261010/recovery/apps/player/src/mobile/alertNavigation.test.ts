import { describe, expect, it } from "vitest";
import type { ClinicAlertAction, MessageBoardTargetType } from "../ui/types";
import { phoneAlertTarget, phoneAlertActionRoute } from "./alertNavigation";

const NAV_TARGETS = {
  patient: "patient", room: "room", employee: "tab", staff_role: "tab", build_mode: "tab",
  goal: "sheet", advertising: "sheet", emergency_glp1: "sheet", money: "sheet", save: "sheet",
  litter: "map", water_cooler: "map",
} as const satisfies Record<MessageBoardTargetType, string>;
const ACTIONS = {
  open_chart: { kind: "open_chart", encounterId: "patient" },
  open_discussion: { kind: "open_discussion", discussionId: "discussion" },
  place_room: { kind: "place_room", definitionId: "room.examination" },
  restore_access: { kind: "restore_access", roomId: "room" }, show_goals: { kind: "show_goals" },
  train_employee: { kind: "train_employee", employeeId: "employee", expectedCost: 10 },
  save_and_pause: { kind: "save_and_pause" }, collect_litter: { kind: "collect_litter", litterId: "litter" },
  refill_water: { kind: "refill_water" }, hire_staff: { kind: "hire_staff", roleId: "staff" },
  upgrade_room: { kind: "upgrade_room", roomId: "room" }, set_advertising: { kind: "set_advertising", level: 1 },
  emergency_consult: { kind: "emergency_consult" }, raise_salary: { kind: "raise_salary", employeeId: "employee", salary: 10, fromSalary: 5 },
  praise_employee: { kind: "praise_employee", employeeId: "employee" }, enable_appointments: { kind: "enable_appointments" },
  level_up: { kind: "level_up" },
} as const satisfies Record<ClinicAlertAction["kind"], ClinicAlertAction>;

describe("complete phone alert navigation", () => {
  it.each(Object.entries(NAV_TARGETS))("routes legacy %s to a phone %s", (type, kind) => {
    const route = phoneAlertTarget(type as MessageBoardTargetType, "fixture-id");
    expect(route.kind).toBe(kind); expect(JSON.stringify(route)).not.toMatch(/selector|scrollIntoView|desktop/);
  });
  it.each(Object.values(ACTIONS))("maps successful $kind without reissuing a command", action => {
    const route = phoneAlertActionRoute(action);
    if (["open_chart", "open_discussion", "place_room", "restore_access", "show_goals", "train_employee"].includes(action.kind)) expect(route).not.toBeNull();
    else expect(route).toBeNull();
  });
  it("retains the exact patient/room/employee/role and environment intent", () => {
    expect(phoneAlertTarget("patient", "patient")).toEqual({ kind: "patient", id: "patient" });
    expect(phoneAlertTarget("room", "room")).toEqual({ kind: "room", id: "room" });
    expect(phoneAlertTarget("staff_role", "role")).toEqual({ kind: "tab", tab: "manage", roleId: "role" });
    expect(phoneAlertActionRoute(ACTIONS.train_employee)).toEqual({ kind: "tab", tab: "manage", employeeId: "employee", training: true });
    expect(phoneAlertTarget("litter", "litter")).toMatchObject({ kind: "map", focus: { kind: "litter", id: "litter" } });
    expect(phoneAlertTarget("water_cooler")).toMatchObject({ kind: "map", focus: { kind: "water" } });
  });
});
