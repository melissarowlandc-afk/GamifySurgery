import { describe, expect, it } from "vitest";
import { getProcedureStaffStandingSpots, getRoomDefinition } from "@gamify-surgery/game-domain";
import { APPROVED_ROOM_NAVIGATION_CONTRACTS } from "@gamify-surgery/balance-config";
import { proceduralStaffingFixture } from "../../../../packages/game-domain/tests/procedural-staffing-fixture";
import { resolveApprovedRoomActorSupports } from "../facility/approvedRoomPresentation";
import { createPrototypePlayerView } from "./viewModels";

describe("opposite-side procedure actor presentation", () => {
  it.each([false, true])("binds the actual walking endpoints to separate nurse/provider standing supports (surgery=%s)", (surgery) => {
    const fixture = proceduralStaffingFixture(surgery);
    const ids = fixture.admit();
    let witnessed = false;
    for (let tick = 0; tick < 320; tick++) {
      const operation = fixture.state.serviceOperations.find((entry) => ids.includes(entry.id) && entry.status === "in_service" &&
        entry.frozenOperationPhases?.[entry.phaseIndex]?.roomDefinitionId === (surgery ? "room.ambulatory_or" : "room.endoscopy"));
      if (operation && operation.providerReservation?.kind === "employee") {
        const room = fixture.state.rooms.find((entry) => operation.reservedRoomInstanceIds.includes(entry.id))!;
        const view = createPrototypePlayerView(fixture.state, null, false, null);
        const providerId = operation.providerReservation.employeeId;
        const provider = view.facility.staff.find((entry) => entry.instanceId === providerId)!;
        const nurse = view.facility.staff.find((entry) => operation.reservedEmployeeIds.includes(entry.instanceId))!;
        expect(provider.supportRole).toBe(surgery ? "ambulatory-or-surgeon" : "endoscopy-provider");
        expect(nurse.supportRole).toBe(surgery ? "ambulatory-or-nurse" : "endoscopy-nurse");
        expect(provider.supportRoomInstanceId).toBe(room.id); expect(nurse.supportRoomInstanceId).toBe(room.id);
        const supports = resolveApprovedRoomActorSupports(room.roomDefinitionId, room.orientation);
        const providerSupport = supports.find((support) => support.id === provider.supportId)!;
        const nurseSupport = supports.find((support) => support.id === nurse.supportId)!;
        expect(providerSupport.pose).toBe("standing"); expect(nurseSupport.pose).toBe("standing");
        expect(providerSupport.ground).not.toEqual(nurseSupport.ground);
        expect(providerSupport.facing).toBe(surgery ? "east" : "west");
        expect(nurseSupport.facing).toBe(surgery ? "west" : "east");
        const definition = getRoomDefinition(room.roomDefinitionId)!;
        expect(getProcedureStaffStandingSpots(room, definition, fixture.state.doors, "nurse").some((spot) => spot.id === nurse.supportId)).toBe(true);
        witnessed = true; break;
      }
      fixture.advance();
    }
    expect(witnessed).toBe(true);
  }, 30000);

  it.each([0, 270] as const)("rotates both Endoscopy sides and their facing with the approved table (%s degrees)", (orientation) => {
    const supports = resolveApprovedRoomActorSupports("room.endoscopy", orientation);
    const layout = APPROVED_ROOM_NAVIGATION_CONTRACTS["room.endoscopy"]!;
    const middle = layout.solidFixtures[0]!.footprint.left + layout.solidFixtures[0]!.footprint.width / 2;
    const providers = supports.filter((support) => support.role === "endoscopy-provider");
    const nurses = supports.filter((support) => support.role === "endoscopy-nurse");
    for (const provider of providers) for (const nurse of nurses) {
      expect(provider.ground).not.toEqual(nurse.ground);
      if (orientation === 0) {
        expect((provider.ground.x - middle) * (nurse.ground.x - middle)).toBeLessThan(0);
        expect(provider.facing).toBe("west"); expect(nurse.facing).toBe("east");
      } else {
        const rotatedMiddle = layout.width - middle;
        expect((provider.ground.y - rotatedMiddle) * (nurse.ground.y - rotatedMiddle)).toBeLessThan(0);
        expect(provider.facing).toBe("south"); expect(nurse.facing).toBe("north");
      }
    }
  });
});
