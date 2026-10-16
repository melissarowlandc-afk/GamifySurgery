import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  getRoomDefinition,
  getRoomNavigationAnchor,
  type EmployeeState,
  type GameState,
} from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";

const progressionOf = (state: GameState) => createPrototypePlayerView(state, null, false, null).progression;

function installedOperationSetup(): GameState {
  const state = createInitialGameState();
  state.facilityLevel = 3;
  state.rooms.push(
    { id: "room.goals.or", roomDefinitionId: "room.ambulatory_or", x: 28, y: 10, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.goals.periop", roomDefinitionId: "room.periop_recovery", x: 26, y: 15, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...Array.from({ length: 18 }, (_, index) => ({ id: `room.goals.hall.${11 + index}`, roomDefinitionId: "room.hallway", x: 32, y: 11 + index, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.goals.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    { id: "door.goals.or", roomId: "room.goals.or", side: "east", offset: 1, exterior: false },
    { id: "door.goals.periop", roomId: "room.goals.periop", side: "east", offset: 1, exterior: false },
  );
  const nurse = (roleId: string, homeRoomInstanceId: string): EmployeeState => {
    const home = state.rooms.find((room) => room.id === homeRoomInstanceId)!;
    const location = getRoomNavigationAnchor(home, getRoomDefinition(home.roomDefinitionId)!, "staff");
    return {
      id: `employee.goals.${roleId}`, staffRoleDefinitionId: roleId, displayName: roleId,
      appearance: state.founder.appearance, hiredAtFacilityTick: 0, salaryPerExpenseInterval: 0,
      morale: 100, trainingLevel: 1, homeRoomInstanceId, location, path: [location], pathIndex: 0,
      lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 1,
      facilityTask: null,
    };
  };
  state.employees.push(nurse("staff.or_nurse", "room.goals.or"), nurse("staff.periop_nurse", "room.goals.periop"));
  return state;
}

describe("Level 3 operation goal setup", () => {
  it("shows exactly the condensed main goals and the existing secondary review", () => {
    const state = createInitialGameState();
    state.facilityLevel = 3;
    const view = progressionOf(state);
    expect(view.goals.map((goal) => goal.id)).toEqual([
      "progression.clinical_xp", "progression.satisfaction",
      "progression.staff.staff.pharmacist", "progression.ambulatory_operation_completion",
    ]);
    expect(view.secondaryGoals?.map((goal) => goal.id)).toEqual(["secondary.level_three_first_qi_review"]);
    expect(view.endoscopySetupRequirements).toBeUndefined();
  });

  it("explains missing operation setup with Build/Hire navigation and an optional surgeon", () => {
    const state = createInitialGameState();
    state.facilityLevel = 3;
    expect(progressionOf(state).ambulatoryOperationSetupRequirements).toEqual([
      expect.objectContaining({ label: "Ambulatory OR", met: false, action: { label: "Build", target: "room", id: "room.ambulatory_or" } }),
      expect.objectContaining({ label: "Peri-op/Recovery Room", met: false, action: { label: "Build", target: "room", id: "room.periop_recovery" } }),
      expect.objectContaining({ label: "OR Nurse", met: false, action: { label: "Hire", target: "staff", id: "staff.or_nurse" } }),
      expect.objectContaining({ label: "Peri-op Nurse", met: false, action: { label: "Hire", target: "staff", id: "staff.periop_nurse" } }),
      expect.objectContaining({ label: "Surgeon or founder", met: true, detail: expect.stringContaining("Founder can perform ambulatory operations.") }),
    ]);
  });

  it("keeps installed setup ready while nurses are busy and does not require a surgeon", () => {
    const state = installedOperationSetup();
    for (const employee of state.employees) employee.facilityTask = { kind: "perform_service", targetId: `service.${employee.id}`, startedAtFacilityTick: 0, workMinutesRemaining: 10 };
    const requirements = progressionOf(state).ambulatoryOperationSetupRequirements!;
    expect(requirements.filter((requirement) => !requirement.met)).toEqual([]);
    expect(requirements.every((requirement) => !requirement.action)).toBe(true);
  });

  it("explains an existing unreachable setup without prompting duplicate purchases", () => {
    const state = installedOperationSetup();
    state.doors = state.doors.filter((door) => door.roomId !== "room.goals.or");
    const requirements = progressionOf(state).ambulatoryOperationSetupRequirements!;
    for (const id of ["room.ambulatory_or", "staff.or_nurse"]) {
      const requirement = requirements.find((item) => item.id === `ambulatory_operation.setup.${id}`)!;
      expect(requirement.met).toBe(false);
      expect(requirement.detail).toContain("reachable valid layout");
      expect(requirement.action).toBeUndefined();
    }
  });

  it("retains the Level 2 endoscopy checklist without Level 3 setup", () => {
    const state = createInitialGameState();
    state.facilityLevel = 2;
    const view = progressionOf(state);
    expect(view.ambulatoryOperationSetupRequirements).toBeUndefined();
    expect(view.endoscopySetupRequirements?.map((requirement) => requirement.id)).toEqual([
      "endoscopy.setup.room.endoscopy", "endoscopy.setup.room.periop_recovery",
      "endoscopy.setup.staff.endoscopy_nurse", "endoscopy.setup.staff.periop_nurse", "endoscopy.setup.provider",
    ]);
  });
});
