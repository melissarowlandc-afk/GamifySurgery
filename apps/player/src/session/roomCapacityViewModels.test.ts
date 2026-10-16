import { createInitialGameState } from "@gamify-surgery/game-domain";
import { describe, expect, it } from "vitest";
import { createPrototypePlayerView } from "./viewModels";

describe("room capacity player views", () => {
  it("uses room-derived imaging capacity and projects an exact sale token", () => {
    const state = createInitialGameState();
    state.facilityLevel = 2;
    state.rooms.push({
      id: "room.test.ultrasound",
      roomDefinitionId: "room.ultrasound",
      x: 3,
      y: 3,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    });

    const view = createPrototypePlayerView(
      state,
      null,
      false,
      null,
      true,
      "room.test.ultrasound",
    );
    const imaging = view.staffRoles.find((role) => role.id === "staff.imaging_technician")!;

    expect(imaging.maximumCount).toBe(1);
    expect(imaging.staffingGuidance).toContain("one shared imaging technician position");
    expect(view.selectedRoomBuild?.salePreview).toMatchObject({
      roomId: "room.test.ultrasound",
      roomDefinitionId: "room.ultrasound",
      dismissedEmployees: [],
    });
    expect(view.selectedRoomBuild?.salePreview?.confirmationToken).toContain("room.test.ultrasound");
  });

  it("keeps departing employees on the facility canvas but out of the roster", () => {
    const state = createInitialGameState();
    state.departingEmployees = [{
      id: "employee.test.departing-roster",
      staffRoleDefinitionId: "staff.receptionist",
      displayName: "Leaving Staff",
      appearance: state.founder.appearance,
      hiredAtFacilityTick: 0,
      salaryPerExpenseInterval: 0,
      morale: 75,
      trainingLevel: 1,
      homeRoomInstanceId: null,
      location: { x: 2, y: 2 },
      path: [{ x: 2, y: 2 }, { x: 1, y: 2 }],
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      lastPraisedAtFacilityTick: null,
      nextIdleActionAtFacilityTick: state.facilityTick + 1,
      facilityTask: null,
      dismissedAtFacilityTick: state.facilityTick,
    }];

    const view = createPrototypePlayerView(state, null, false, null);
    expect(view.facility.staff.some((staff) => staff.instanceId === "employee.test.departing-roster")).toBe(true);
    expect(view.staffRoles.flatMap((role) => role.employees).some((staff) => staff.id === "employee.test.departing-roster")).toBe(false);
  });
});
