import { describe, expect, it } from "vitest";

import type { RoomDefinition } from "@gamify-surgery/balance-config";
import {
  findDeterministicFacilityPath,
  findDeterministicRoomPath,
  getRoomNavigableTiles,
  getRoomNavigationAnchor,
  isPlacementAttachedThroughOwnEntrance,
  rotateRoomLocalPoint,
  validateFacilityConnectivity,
} from "../src/spatial";
import { PROTOTYPE_DOMAIN_CONTEXT } from "../src/context";
import type { DoorState, PlacedRoom } from "../src/types";

const protectedRoomDefinitionIds = new Set(["room.front_desk"]);
const roomDefinition = (
  id: string,
  kind: RoomDefinition["kind"],
  width: number,
  height: number,
  defaultDoorSide: RoomDefinition["defaultDoorSide"],
): RoomDefinition => ({
  id,
  displayName: id,
  kind,
  unlockFacilityLevel: 0,
  width,
  height,
  defaultDoorSide,
  constructionCost: 0,
  upkeepPerExpenseInterval: 0,
  satisfactionOnBuild: 0,
  workloadLimitContribution: 0,
  maximumInstances: null,
  maximumUpgradeLevel: 1,
  upgradeCosts: [],
  upkeepPerUpgradeLevel: 0,
  workloadLimitContributionPerUpgradeLevel: 0,
  serviceDurationReductionPercentPerUpgradeLevel: 0,
  requiredRoomDefinitionIds: [],
  capabilityIds: [],
});
const definitions = new Map<string, RoomDefinition>([
  [
    "room.front_desk",
    roomDefinition("room.front_desk", "room", 5, 4, "north"),
  ],
  [
    "room.examination",
    roomDefinition("room.examination", "room", 3, 2, "south"),
  ],
  ["room.hallway", roomDefinition("room.hallway", "hallway", 1, 1, null)],
]);
const definitionFor = (definitionId: string) =>
  definitions.get(definitionId) ?? null;

function frontDesk(): PlacedRoom {
  return {
    id: "room.instance.founder_desk",
    roomDefinitionId: "room.front_desk",
    x: 9,
    y: 6,
    orientation: 0,
    doorSide: "north",
    upgradeLevel: 1,
  };
}

describe("facility connectivity", () => {
  it("accepts mutually facing room doors without requiring a hallway tile", () => {
    const front = frontDesk();
    const examination: PlacedRoom = {
      id: "room.examination.direct",
      roomDefinitionId: "room.examination",
      x: 10,
      y: 4,
      orientation: 0,
      doorSide: "south",
      upgradeLevel: 1,
    };

    expect(
      validateFacilityConnectivity(
        [front, examination],
        definitionFor,
        protectedRoomDefinitionIds,
      ),
    ).toEqual({
      connected: true,
      disconnectedRoomIds: [],
      disconnectedHallwayTiles: [],
    });
    expect(
      findDeterministicRoomPath(
        front,
        examination,
        definitionFor,
        [front, examination],
      ),
    ).toEqual([
      { x: 11, y: 7 },
      { x: 11, y: 6 },
      { x: 11, y: 5 },
      { x: 11, y: 4 },
    ]);
  });

  it("keeps Level 0 expandable and routes deterministically through an intermediate room", () => {
    const front = frontDesk();
    const levelZeroExamination: PlacedRoom = {
      id: "room.examination.level-zero",
      roomDefinitionId: "room.examination",
      x: 10,
      y: 4,
      orientation: 0,
      doorSide: "south",
      upgradeLevel: 1,
    };
    const laterExamination: PlacedRoom = {
      id: "room.examination.later",
      roomDefinitionId: "room.examination",
      x: 8,
      y: 3,
      orientation: 270,
      doorSide: "east",
      upgradeLevel: 1,
    };
    const rooms = [front, levelZeroExamination, laterExamination];

    expect(
      validateFacilityConnectivity(
        rooms,
        definitionFor,
        protectedRoomDefinitionIds,
      ),
    ).toEqual({
      connected: true,
      disconnectedRoomIds: [],
      disconnectedHallwayTiles: [],
    });
    expect(
      findDeterministicRoomPath(
        front,
        laterExamination,
        definitionFor,
        rooms,
      ),
    ).toEqual([
      { x: 11, y: 7 },
      { x: 11, y: 6 },
      { x: 11, y: 5 },
      { x: 11, y: 4 },
      { x: 10, y: 4 },
      { x: 9, y: 4 },
      { x: 8, y: 4 },
    ]);
  });

  it("allows a hallway branch to touch an existing connected room wall", () => {
    const front = frontDesk();
    const examination: PlacedRoom = {
      id: "room.examination.branch-host",
      roomDefinitionId: "room.examination",
      x: 10,
      y: 4,
      orientation: 0,
      doorSide: "south",
      upgradeLevel: 1,
    };
    const hallways: PlacedRoom[] = [13, 14].map((x) => ({
      id: `room.hallway.${x}.4`,
      roomDefinitionId: "room.hallway",
      x,
      y: 4,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
    }));

    expect(
      validateFacilityConnectivity(
        [front, examination, ...hallways],
        definitionFor,
        protectedRoomDefinitionIds,
      ),
    ).toEqual({
      connected: true,
      disconnectedRoomIds: [],
      disconnectedHallwayTiles: [],
    });
  });

  it("requires a new room's rotated door to attach while preserving inbound access", () => {
    const front = frontDesk();
    const examination: PlacedRoom = {
      id: "room.examination.side-entrance",
      roomDefinitionId: "room.examination",
      x: 7,
      y: 7,
      orientation: 270,
      doorSide: "east",
      upgradeLevel: 1,
    };

    expect(
      validateFacilityConnectivity(
        [front, examination],
        definitionFor,
        protectedRoomDefinitionIds,
      ),
    ).toMatchObject({
      connected: true,
      disconnectedRoomIds: [],
    });
    const connectedPath = findDeterministicRoomPath(
      front,
      examination,
      definitionFor,
      [front, examination],
    );
    expect(connectedPath[0]).toEqual({ x: 11, y: 7 });
    expect(connectedPath.at(-1)).toEqual({ x: 7, y: 8 });

    const rotatedAway: PlacedRoom = {
      id: "room.examination.rotated-away",
      roomDefinitionId: "room.examination",
      x: 10,
      y: 4,
      orientation: 180,
      doorSide: "north",
      upgradeLevel: 1,
    };
    expect(
      isPlacementAttachedThroughOwnEntrance(
        rotatedAway,
        definitions.get(rotatedAway.roomDefinitionId)!,
        [front],
        definitionFor,
      ),
    ).toBe(false);
    expect(
      validateFacilityConnectivity(
        [front, rotatedAway],
        definitionFor,
        protectedRoomDefinitionIds,
      ),
    ).toMatchObject({
      connected: true,
      disconnectedRoomIds: [],
    });
    const inboundPath = findDeterministicRoomPath(
      front,
      rotatedAway,
      definitionFor,
      [front, rotatedAway],
    );
    expect(inboundPath[0]).toEqual({ x: 11, y: 7 });
    expect(inboundPath.at(-1)).toEqual({ x: 11, y: 4 });
  });

  it("requires a new hallway to touch the existing connected facility", () => {
    const front = frontDesk();
    const attachedHallway: PlacedRoom = {
      id: "room.hallway.attached",
      roomDefinitionId: "room.hallway",
      x: 11,
      y: 5,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
    };
    const detachedHallway: PlacedRoom = {
      ...attachedHallway,
      id: "room.hallway.detached",
      x: 2,
      y: 2,
    };

    expect(
      isPlacementAttachedThroughOwnEntrance(
        attachedHallway,
        definitions.get(attachedHallway.roomDefinitionId)!,
        [front],
        definitionFor,
      ),
    ).toBe(true);
    expect(
      isPlacementAttachedThroughOwnEntrance(
        detachedHallway,
        definitions.get(detachedHallway.roomDefinitionId)!,
        [front],
        definitionFor,
      ),
    ).toBe(false);
  });

  it("preserves deterministic hallway routing when rooms are not direct", () => {
    const front = frontDesk();
    const hallway: PlacedRoom = {
      id: "room.hallway.11.5",
      roomDefinitionId: "room.hallway",
      x: 11,
      y: 5,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
    };
    const examination: PlacedRoom = {
      id: "room.examination.hallway",
      roomDefinitionId: "room.examination",
      x: 10,
      y: 3,
      orientation: 0,
      doorSide: "south",
      upgradeLevel: 1,
    };
    const rooms = [front, hallway, examination];

    expect(
      validateFacilityConnectivity(
        rooms,
        definitionFor,
        protectedRoomDefinitionIds,
      ).connected,
    ).toBe(true);
    expect(
      findDeterministicRoomPath(
        front,
        examination,
        definitionFor,
        rooms,
      ),
    ).toEqual([
      { x: 11, y: 7 },
      { x: 11, y: 6 },
      { x: 11, y: 5 },
      { x: 11, y: 4 },
      { x: 11, y: 3 },
    ]);
  });
});

describe("fixed-fixture navigation metadata", () => {
  const prototypeDefinition = (id: string) =>
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.find(
      (definition) => definition.id === id,
    )!;

  it("keeps C2/C4 open and routes from the public anchor around C3 to B3", () => {
    const definition = prototypeDefinition("room.front_desk");
    const room: PlacedRoom = {
      id: "room.front-desk.grid-proof",
      roomDefinitionId: definition.id,
      x: 10,
      y: 10,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
    };
    const navigable = getRoomNavigableTiles(room, definition);
    expect(navigable).not.toContainEqual({ x: 10, y: 10 }); // A1
    expect(navigable).not.toContainEqual({ x: 14, y: 10 }); // A5
    expect(navigable).not.toContainEqual({ x: 12, y: 12 }); // C3
    expect(navigable).toContainEqual({ x: 11, y: 12 }); // C2
    expect(navigable).toContainEqual({ x: 13, y: 12 }); // C4
    const path = findDeterministicFacilityPath(
      { x: 12, y: 13 }, // D3
      { x: 12, y: 11 }, // B3
      [room],
      [],
      (id) => (id === definition.id ? definition : null),
    );
    expect(path.at(-1)).toEqual({ x: 12, y: 11 });
    expect(path).not.toContainEqual({ x: 12, y: 12 });
  });

  it("rotates anchors and blocked fixture tiles with the room", () => {
    const definition = prototypeDefinition("room.examination");
    const room: PlacedRoom = {
      id: "room.exam.rotated-navigation",
      roomDefinitionId: definition.id,
      x: 10,
      y: 10,
      orientation: 90,
      doorSide: null,
      upgradeLevel: 1,
    };

    expect(
      rotateRoomLocalPoint(
        definition.navigation!.primaryAnchor!,
        definition,
        room.orientation,
      ),
    ).toEqual({ x: 0, y: 1 });
    expect(getRoomNavigationAnchor(room, definition)).toEqual({
      x: 10,
      y: 11,
    });
    expect(
      getRoomNavigableTiles(room, definition),
    ).not.toContainEqual({ x: 10, y: 10 });
  });

  it("reopens a blocked fixture tile when an explicit door occupies it", () => {
    const definition = prototypeDefinition("room.examination");
    const room: PlacedRoom = {
      id: "room.exam.door-reopens",
      roomDefinitionId: definition.id,
      x: 10,
      y: 10,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
    };
    const door: DoorState = {
      id: "door.exam.blocked-edge",
      roomId: room.id,
      side: "south",
      offset: 0,
      exterior: false,
    };

    expect(getRoomNavigableTiles(room, definition)).not.toContainEqual({
      x: 10,
      y: 11,
    });
    expect(
      getRoomNavigableTiles(room, definition, [door]),
    ).toContainEqual({ x: 10, y: 11 });
  });

  it("walks a legacy actor off a newly blocked tile without teleporting", () => {
    const definition = prototypeDefinition("room.examination");
    const room: PlacedRoom = {
      id: "room.exam.legacy-origin",
      roomDefinitionId: definition.id,
      x: 10,
      y: 10,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
    };
    const blockedLegacyOrigin = { x: 10, y: 11 };
    const path = findDeterministicFacilityPath(
      blockedLegacyOrigin,
      getRoomNavigationAnchor(room, definition),
      [room],
      [],
      (id) => (id === definition.id ? definition : null),
    );

    expect(path[0]).toEqual(blockedLegacyOrigin);
    expect(path.at(-1)).toEqual(
      getRoomNavigationAnchor(room, definition),
    );
    expect(path.length).toBeGreaterThan(1);
  });

  it("crosses adjacent room walls only through an explicit door edge", () => {
    const frontDefinition = prototypeDefinition("room.front_desk");
    const examDefinition = prototypeDefinition("room.examination");
    const front: PlacedRoom = {
      id: "room.front.explicit-route",
      roomDefinitionId: frontDefinition.id,
      x: 33,
      y: 28,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
    };
    const exam: PlacedRoom = {
      id: "room.exam.explicit-route",
      roomDefinitionId: examDefinition.id,
      x: 34,
      y: 26,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
    };
    const exteriorDoor: DoorState = {
      id: "door.front.exterior-route",
      roomId: front.id,
      side: "south",
      offset: 2,
      exterior: true,
    };
    const internalDoor: DoorState = {
      id: "door.exam.explicit-route",
      roomId: exam.id,
      side: "south",
      offset: 1,
      exterior: false,
    };
    const definition = (id: string) =>
      id === frontDefinition.id
        ? frontDefinition
        : id === examDefinition.id
          ? examDefinition
          : null;
    const start = getRoomNavigationAnchor(front, frontDefinition);
    const goal = getRoomNavigationAnchor(exam, examDefinition);

    expect(
      findDeterministicFacilityPath(
        start,
        goal,
        [front, exam],
        [exteriorDoor],
        definition,
      ),
    ).toEqual([]);
    const path = findDeterministicFacilityPath(
      start,
      goal,
      [front, exam],
      [exteriorDoor, internalDoor],
      definition,
    );
    expect(path.length).toBeGreaterThan(1);
    expect(path).toContainEqual({ x: 35, y: 28 });
    expect(path).toContainEqual({ x: 35, y: 27 });
    expect(
      path.every((point, index) => {
        const previous = path[index - 1];
        return (
          !previous ||
          Math.abs(point.x - previous.x) +
            Math.abs(point.y - previous.y) ===
            1
        );
      }),
    ).toBe(true);
  });
});
