import type { ClinicAlertAction, MessageBoardTargetType } from "../ui/types";
import type { MobileSheetId, MobileTab } from "./navigation";
import type { PhoneMapFocus } from "./tutorialTargets";

export type PhoneAlertRoute = { kind: "patient" | "room"; id?: string } |
  { kind: "tab"; tab: MobileTab; employeeId?: string; roleId?: string; definitionId?: string; training?: boolean } |
  { kind: "sheet"; sheet: MobileSheetId } | { kind: "map"; focus: PhoneMapFocus };

export function phoneAlertTarget(type: MessageBoardTargetType, id?: string): PhoneAlertRoute {
  switch (type) {
    case "patient": return { kind: "patient", id };
    case "room": return { kind: "room", id };
    case "employee": return { kind: "tab", tab: "manage", employeeId: id };
    case "staff_role": return { kind: "tab", tab: "manage", roleId: id };
    case "build_mode": return { kind: "tab", tab: "build", definitionId: id };
    case "goal": return { kind: "sheet", sheet: "goals" };
    case "advertising": return { kind: "sheet", sheet: "advertising" };
    case "emergency_glp1": return { kind: "sheet", sheet: "emergency" };
    case "money": return { kind: "sheet", sheet: "cash" };
    case "save": return { kind: "sheet", sheet: "save" };
    case "water_cooler": return { kind: "map", focus: { kind: "water", key: "alert-water" } };
    case "litter": return { kind: "map", focus: { kind: "litter", id, key: `alert-litter:${id ?? "first"}` } };
  }
}

/** Called only after runClinicAlertAction succeeds. Commands are never reissued here. */
export function phoneAlertActionRoute(action: ClinicAlertAction): PhoneAlertRoute | null {
  switch (action.kind) {
    case "open_chart": return { kind: "sheet", sheet: "chart" };
    case "open_discussion": return { kind: "sheet", sheet: "discussion" };
    case "place_room": return { kind: "tab", tab: "build", definitionId: action.definitionId };
    case "restore_access": return { kind: "room", id: action.roomId };
    case "show_goals": return { kind: "sheet", sheet: "goals" };
    case "train_employee": return { kind: "tab", tab: "manage", employeeId: action.employeeId, training: true };
    case "save_and_pause": case "collect_litter": case "refill_water": case "hire_staff":
    case "upgrade_room": case "set_advertising": case "emergency_consult": case "raise_salary":
    case "praise_employee": case "enable_appointments": case "level_up": return null;
  }
}
