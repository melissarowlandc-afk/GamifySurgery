import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  createInitialGameState,
  gameReducer,
  selectStaffStillId,
  type GameState,
} from "@gamify-surgery/game-domain";
import { ManagementPanel } from "../ui/ManagementPanel";
import { clinicAlertCommand, getClinicAlertActionProblem } from "./clinicAlertActions";
import { createPrototypePlayerView } from "./viewModels";

const ROLE = "staff.radiologist";
const ORDER = [
  "level3-roster-v2.001", "level3-roster-v2.002",
  "level3-roster-v2.003", "level3-roster-v2.004",
];
const noop = () => {};

function clinic(): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: "radiologist-ui-order", campaignSeed: "radiologist-ui-order", createdAtRealMs: 0,
  });
  state.facilityLevel = 3; state.cash = 20_000; state.cashCents = 2_000_000;
  state.rooms.push(
    { id: "room.readers", roomDefinitionId: "room.reading", x: 33, y: 20,
      orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...Array.from({ length: 9 }, (_, index) => ({
      id: `hall.readers.${index}`, roomDefinitionId: "room.hallway", x: 32, y: 20 + index,
      orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const,
    })),
  );
  state.doors.push(
    { id: "door.readers", roomId: "room.readers", side: "west", offset: 1, exterior: false },
    { id: "door.front.readers", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
  );
  return state;
}

describe("radiologist selection through player hiring entry points", () => {
  it.each(["Employees", "Needs you", "Tip"])(
    "%s hires agree with selection previews and Management/StaffPanel portraits",
    (entryPoint) => {
      let state = clinic();
      for (const [index, stillId] of ORDER.entries()) {
        const before = createPrototypePlayerView(state, null, false, null);
        expect(before.staffRoles.find((role) => role.id === ROLE)?.canHire).toBe(true);
        const employeeId = `employee.instance.${index + 1}`;
        const used = new Set([...state.employees, ...(state.departingEmployees ?? [])]
          .map((employee) => employee.appearance.stillId));
        const preview = selectStaffStillId(state.campaignSeed, employeeId, ROLE, undefined, used);
        const action = { kind: "hire_staff" as const, roleId: ROLE, expectedCost: 300 };
        expect(getClinicAlertActionProblem(state, action)).toBeNull();
        const command = entryPoint === "Employees"
          ? { type: "HIRE_STAFF" as const, employeeId, staffRoleDefinitionId: ROLE }
          : clinicAlertCommand(action, employeeId)!;
        state = gameReducer(state, { ...command, operationId: `hire.${entryPoint}.${index}` });
        expect(state.operationReceipts[`hire.${entryPoint}.${index}`]?.status).toBe("applied");
        const employee = state.employees.find((candidate) => candidate.id === employeeId)!;
        expect(employee.appearance.stillId).toBe(stillId);
        expect(employee.appearance.stillId).toBe(preview);
        const view = createPrototypePlayerView(state, null, false, null);
        const roles = view.staffRoles.filter((role) => role.id === ROLE);
        expect(roles[0]?.employees.find((candidate) => candidate.id === employeeId)?.avatar)
          .toEqual(employee.appearance);
        const markup = renderToStaticMarkup(
          <ManagementPanel managementMode roles={roles} serviceIncome={view.serviceIncome}
            highlightedRoleId={ROLE} onEnterManagementMode={noop} onExitManagementMode={noop}
            onHire={noop} onDecreaseSalary={noop} onIncreaseSalary={noop} onFire={noop}
            onAppointmentsEnabledChange={noop} onStartLaboratoryProcessing={noop} />,
        );
        expect(markup).toContain(`data-still-id="${stillId}"`);
        expect(markup).not.toContain("future-roster20-v5.");
      }
    },
  );
});
