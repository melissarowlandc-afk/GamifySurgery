import { DIAGNOSTIC_READING_WORKSTATIONS } from "@gamify-surgery/balance-config";
import { createInitialGameState, type EmployeeFacilityTaskState } from "@gamify-surgery/game-domain";
import { describe, expect, it } from "vitest";

import { resolveApprovedRoomActorSupports } from "../facility/approvedRoomPresentation";
import { APPROVED_READING_ROOM_DRAW_RECORDS } from "../facility/approvedReadingRoomData";
import { createPrototypePlayerView } from "./viewModels";

// Owner request (2026-10-07): hired radiologists sit at the four approved desks.
describe("Reading Room radiologist seating", () => {
  const room = {
    id: "room.test.reading", roomDefinitionId: "room.reading" as const,
    x: 20, y: 12, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100,
  };
  const reader = (state: ReturnType<typeof createInitialGameState>, id: string, stationId: string) => ({
    id, staffRoleDefinitionId: "staff.radiologist" as const, displayName: id,
    appearance: state.founder.appearance, hiredAtFacilityTick: 0,
    salaryPerExpenseInterval: 26, morale: 75, trainingLevel: 1 as const,
    homeRoomInstanceId: room.id, readingStationId: stationId,
    location: { x: 0, y: 0 }, path: [] as Array<{ x: number; y: number }>, pathIndex: 0,
    lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 10,
    facilityTask: null as EmployeeFacilityTaskState | null,
  });

  it("seats each radiologist standing on their station anchor in that station's chair", () => {
    const state = createInitialGameState();
    state.facilityLevel = 3;
    state.rooms.push(room);
    for (const station of DIAGNOSTIC_READING_WORKSTATIONS) {
      const employee = reader(state, `reader.${station.id}`, station.id);
      employee.location = { x: room.x + station.staffAnchor.x, y: room.y + station.staffAnchor.y };
      state.employees.push(employee);
    }
    // One reader still walking to their seat is not seated yet.
    const walking = state.employees[0]!;
    walking.path = [{ x: room.x, y: room.y - 1 }, walking.location];
    walking.pathIndex = 0;

    const staff = createPrototypePlayerView(state, null, false, null).facility.staff!
      .filter((employee) => employee.staffRoleDefinitionId === "staff.radiologist");
    expect(staff.map((employee) => [employee.instanceId, employee.supportRole ?? null, employee.supportId ?? null])).toEqual([
      ["reader.northwest", null, null],
      ["reader.northeast", "reading-radiologist", "northeast"],
      ["reader.southeast", "reading-radiologist", "southeast"],
      ["reader.southwest", "reading-radiologist", "southwest"],
    ]);
    expect(staff.every((employee) => !employee.supportRoomInstanceId || employee.supportRoomInstanceId === room.id)).toBe(true);
  });

  it("provides four seats that interleave with the approved desk-edge layers", () => {
    const supports = resolveApprovedRoomActorSupports("room.reading", 0);
    for (const station of DIAGNOSTIC_READING_WORKSTATIONS) {
      expect(supports.find(support => support.id === station.id)?.seat).toEqual(station.seatContact);
    }
    expect(supports.map((support) => [support.id, support.role, support.pose, support.facing])).toEqual([
      ["northwest", "reading-radiologist", "seated", "south"],
      ["northeast", "reading-radiologist", "seated", "west"],
      ["southeast", "reading-radiologist", "seated", "north"],
      ["southwest", "reading-radiologist", "seated", "east"],
    ]);
    const depth = (id: string) => APPROVED_READING_ROOM_DRAW_RECORDS.find((record) => record.id === id)!.depthKey;
    const painter = (id: string) => supports.find((support) => support.id === id)!.fixtureGround.y;
    // Proof order: island < NW reader < NW desk front < NE reader < SE divider
    // < SW reader < SW desk front < SE reader < SE chair front.
    const order = [depth("island"), painter("northwest"), depth("islandNorthwestDeskFront"), painter("northeast"),
      depth("islandSoutheastDividerFront"), painter("southwest"), depth("islandSouthwestDeskFront"),
      painter("southeast"), depth("chairSoutheastFront")];
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });
});
