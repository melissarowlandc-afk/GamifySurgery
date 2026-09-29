import {
  createInitialGameState,
  getGlp1NursePractitionerStation,
  PROTOTYPE_DOMAIN_CONTEXT,
} from "@gamify-surgery/game-domain";
import { describe, expect, it } from "vitest";

import { createPrototypePlayerView } from "./viewModels";

describe("GLP-1 NP workstation presentation", () => {
  it("assigns two stationary NPs to their distinct domain workstations", () => {
    const state = createInitialGameState();
    state.facilityLevel = 2;
    const suite = {
      id: "room.test.glp1-workstation", roomDefinitionId: "room.glp1_telehealth_suite" as const,
      x: 28, y: 23, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const,
      cleanliness: 100,
    };
    state.rooms.push(suite);
    const nurse = (id: string) => ({
      id, staffRoleDefinitionId: "staff.glp1_np" as const, displayName: id,
      appearance: state.founder.appearance, hiredAtFacilityTick: 0,
      salaryPerExpenseInterval: 40, morale: 75, trainingLevel: 1 as const,
      homeRoomInstanceId: suite.id, location: { x: 0, y: 0 }, path: [] as Array<{ x: number; y: number }>,
      pathIndex: 0, lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null,
      nextIdleActionAtFacilityTick: 10,
      facilityTask: null as import("@gamify-surgery/game-domain").EmployeeFacilityTaskState | null,
    });
    const first = nurse("employee.glp1.alpha");
    const second = nurse("employee.glp1.beta");
    state.employees.push(second, first);
    first.location = getGlp1NursePractitionerStation(state, first, PROTOTYPE_DOMAIN_CONTEXT)!;
    second.location = getGlp1NursePractitionerStation(state, second, PROTOTYPE_DOMAIN_CONTEXT)!;

    const staff = () => createPrototypePlayerView(state, null, false, null).facility.staff!;
    expect(staff().filter((employee) => employee.staffRoleDefinitionId === "staff.glp1_np").map((employee) => [employee.instanceId, employee.supportRole])).toEqual([
      ["employee.glp1.beta", "glp1-np-station-2"],
      ["employee.glp1.alpha", "glp1-np-station-1"],
    ]);

    first.path = [{ ...first.location }, { x: first.location.x + 1, y: first.location.y }];
    first.pathIndex = 0;
    expect(staff().find((employee) => employee.instanceId === first.id)?.supportRole).toBeUndefined();

    first.path = [];
    first.pathIndex = 0;
    first.facilityTask = { kind: "collect_litter", targetId: "litter.test", startedAtFacilityTick: 0, workMinutesRemaining: 1 };
    expect(staff().find((employee) => employee.instanceId === first.id)?.supportRole).toBeUndefined();
  });
});
