import { describe, expect, it } from "vitest";

import {
  FIVE_REFERENCE_ROOM_IDS,
  getFiveRoomDoorClearZones,
  getFiveRoomPresentation,
  isFiveRoomFloorFixtureClearOfDoorZone,
  isFiveReferenceRoomDefinition,
  isFiveRoomNorthWallFixtureVisible,
} from "./fiveRoomPresentation";

describe("five reference-room presentations", () => {
  it("reserves the shared clutter-suppression contract for exactly the five planned rooms", () => {
    expect(FIVE_REFERENCE_ROOM_IDS).toEqual([
      "room.waiting", "room.bathroom", "room.xray", "room.imaging_control", "room.minor_procedure",
    ]);
    expect(isFiveReferenceRoomDefinition("room.waiting")).toBe(true);
    expect(isFiveReferenceRoomDefinition("room.examination")).toBe(false);
  });

  it("uses separate north-up Waiting packages rather than rotating perspective furniture", () => {
    const horizontal = getFiveRoomPresentation("room.waiting", 0)!;
    const vertical = getFiveRoomPresentation("room.waiting", 90)!;
    expect(horizontal).not.toBe(vertical);
    expect(horizontal.fixtures.find((fixture) => fixture.id === "waitingCouch")).toMatchObject({ centerYRatio: 0.26, preserveScreenOrientation: true });
    expect(vertical.fixtures.find((fixture) => fixture.id === "waitingCouch")).toMatchObject({ centerYRatio: 0.2, preserveScreenOrientation: true });
    expect(horizontal.fixtures.filter((fixture) => fixture.id === "visitorChair")).toHaveLength(2);
    expect(vertical.fixtures.filter((fixture) => fixture.id === "visitorChair")).toHaveLength(2);
    for (const presentation of [horizontal, vertical]) {
      const ids = presentation.fixtures.map((fixture) => fixture.id);
      expect(ids).not.toContain("floorRug");
      expect(ids).not.toContain("wasteBin");
      expect(ids.filter((id) => id === "magazineRack")).toHaveLength(1);
    }
  });

  it("keeps the Bathroom to a north-west sink/mirror and east-south toilet", () => {
    const bathroom = getFiveRoomPresentation("room.bathroom", 0)!;
    expect(bathroom.fixtures.map((fixture) => fixture.id)).toEqual(["handSink", "toilet", "wallMirror"]);
    expect(bathroom.fixtures.find((fixture) => fixture.id === "handSink")).toMatchObject({ centerXRatio: 0.2, centerYRatio: 0.24 });
    expect(bathroom.fixtures.find((fixture) => fixture.id === "toilet")).toMatchObject({ centerXRatio: 0.73, centerYRatio: 0.72 });
    expect(bathroom.fixtures.find((fixture) => fixture.id === "wallMirror")).toMatchObject({ wallMounted: true, northWallOffsets: [0] });
    expect(bathroom.fixtures.map((fixture) => fixture.id)).not.toContain("bathMat");
  });

  it("uses only the requested authored fixtures for the three fixed north-up rooms", () => {
    const xray = getFiveRoomPresentation("room.xray", 0)!;
    const imaging = getFiveRoomPresentation("room.imaging_control", 0)!;
    const procedure = getFiveRoomPresentation("room.minor_procedure", 0)!;
    expect(getFiveRoomPresentation("room.xray", 90)).toBeUndefined();
    expect(getFiveRoomPresentation("room.imaging_control", 90)).toBeUndefined();
    expect(getFiveRoomPresentation("room.minor_procedure", 90)).toBeUndefined();
    expect(xray.fixtures.map((fixture) => fixture.id)).toEqual(["xrayTable", "xrayTube", "xrayBucky", "supplyCabinet", "leadApron", "radiationMarker"]);
    expect(imaging.fixtures.map((fixture) => fixture.id)).toEqual(["imagingConsole", "officeChair", "serverRack", "lightBox"]);
    expect(procedure.fixtures.map((fixture) => fixture.id)).toEqual(["procedureTable", "instrumentTray", "sinkCabinet", "supplyCabinet", "biohazardBin", "procedureLight", "medicalSign"]);
    for (const room of [xray, imaging, procedure]) {
      const ids = room.fixtures.map((fixture) => fixture.id);
      expect(ids).not.toContain("floorRug");
      expect(ids).not.toContain("wasteBin");
      expect(ids).not.toContain("roomPlant");
      expect(ids).not.toContain("wallClock");
    }
    expect(imaging.fixtures.filter((fixture) => fixture.id === "officeChair")).toHaveLength(1);
    expect(procedure.fixtures.map((fixture) => fixture.id)).not.toContain("ivStand");
    expect(procedure.fixtures.map((fixture) => fixture.id)).not.toContain("vitalsMonitor");
  });

  it("suppresses a wall piece only for its exact live north-door cell", () => {
    const waitingBoard = getFiveRoomPresentation("room.waiting", 0)!.fixtures.find((fixture) => fixture.id === "noticeBoard")!;
    const bathroomMirror = getFiveRoomPresentation("room.bathroom", 0)!.fixtures.find((fixture) => fixture.id === "wallMirror")!;
    const xrayMarker = getFiveRoomPresentation("room.xray", 0)!.fixtures.find((fixture) => fixture.id === "radiationMarker")!;
    const imagingDisplay = getFiveRoomPresentation("room.imaging_control", 0)!.fixtures.find((fixture) => fixture.id === "lightBox")!;
    const procedureSign = getFiveRoomPresentation("room.minor_procedure", 0)!.fixtures.find((fixture) => fixture.id === "medicalSign")!;
    expect(isFiveRoomNorthWallFixtureVisible(waitingBoard, [1])).toBe(false);
    expect(isFiveRoomNorthWallFixtureVisible(waitingBoard, [0])).toBe(true);
    expect(isFiveRoomNorthWallFixtureVisible(bathroomMirror, [0])).toBe(false);
    expect(isFiveRoomNorthWallFixtureVisible(bathroomMirror, [1])).toBe(true);
    expect(isFiveRoomNorthWallFixtureVisible(xrayMarker, [1])).toBe(false);
    expect(isFiveRoomNorthWallFixtureVisible(imagingDisplay, [1])).toBe(false);
    expect(isFiveRoomNorthWallFixtureVisible(procedureSign, [1])).toBe(false);
    expect(isFiveRoomNorthWallFixtureVisible(procedureSign, [0])).toBe(true);
    const procedureLight = getFiveRoomPresentation("room.minor_procedure", 0)!.fixtures.find((fixture) => fixture.id === "procedureLight")!;
    expect(procedureLight.wallMounted).not.toBe(true);
    expect(procedureLight).toMatchObject({ preserveScreenOrientation: true, centerXRatio: 0.48, centerYRatio: 0.4 });
  });

  it("keeps every floor fixture inside its normalized room envelope", () => {
    for (const room of [getFiveRoomPresentation("room.waiting", 0)!, getFiveRoomPresentation("room.waiting", 90)!, getFiveRoomPresentation("room.bathroom", 0)!, getFiveRoomPresentation("room.xray", 0)!, getFiveRoomPresentation("room.imaging_control", 0)!, getFiveRoomPresentation("room.minor_procedure", 0)!]) {
      for (const fixture of room.fixtures.filter((candidate) => !candidate.wallMounted)) {
        expect(fixture.centerXRatio - fixture.widthRatio / 2).toBeGreaterThanOrEqual(0);
        expect(fixture.centerXRatio + fixture.widthRatio / 2).toBeLessThanOrEqual(1);
        expect(fixture.centerYRatio - fixture.heightRatio / 2).toBeGreaterThanOrEqual(0);
        expect(fixture.centerYRatio + fixture.heightRatio / 2).toBeLessThanOrEqual(1);
      }
    }
  });

  it("keeps every reserved five-room edge strip clear without treating central furniture as an edge blocker", () => {
    expect(getFiveRoomDoorClearZones("room.waiting")).toEqual([
      { side: "north", startRatio: 0.04, endRatio: 0.2 },
      { side: "east", startRatio: 0.4, endRatio: 0.56 },
      { side: "south", startRatio: 0.04, endRatio: 0.22 },
      { side: "west", startRatio: 0.12, endRatio: 0.3 },
    ]);
    expect(getFiveRoomDoorClearZones("room.bathroom")).toEqual([
      { side: "north", startRatio: 0.54, endRatio: 0.74 },
      { side: "east", startRatio: 0.14, endRatio: 0.34 },
      { side: "south", startRatio: 0.14, endRatio: 0.34 },
      { side: "west", startRatio: 0.54, endRatio: 0.74 },
    ]);
    expect(getFiveRoomDoorClearZones("room.xray")).toEqual([
      { side: "north", startRatio: 0.74, endRatio: 0.9 }, { side: "east", startRatio: 0.42, endRatio: 0.58 }, { side: "south", startRatio: 0.42, endRatio: 0.58 }, { side: "west", startRatio: 0.76, endRatio: 0.92 },
    ]);
    expect(getFiveRoomDoorClearZones("room.imaging_control")).toEqual([
      { side: "north", startRatio: 0.02, endRatio: 0.18 }, { side: "east", startRatio: 0.4, endRatio: 0.58 }, { side: "south", startRatio: 0.04, endRatio: 0.22 }, { side: "west", startRatio: 0.74, endRatio: 0.92 },
    ]);
    expect(getFiveRoomDoorClearZones("room.minor_procedure")).toEqual([
      { side: "north", startRatio: 0.04, endRatio: 0.2 }, { side: "east", startRatio: 0.66, endRatio: 0.82 }, { side: "south", startRatio: 0.8, endRatio: 0.96 }, { side: "west", startRatio: 0.06, endRatio: 0.22 },
    ]);
    for (const room of [getFiveRoomPresentation("room.waiting", 0)!, getFiveRoomPresentation("room.waiting", 90)!, getFiveRoomPresentation("room.bathroom", 0)!, getFiveRoomPresentation("room.xray", 0)!, getFiveRoomPresentation("room.imaging_control", 0)!, getFiveRoomPresentation("room.minor_procedure", 0)!]) {
      const zones = getFiveRoomDoorClearZones(room.roomId);
      for (const fixture of room.fixtures.filter((candidate) => !candidate.wallMounted)) {
        for (const zone of zones) {
          expect(isFiveRoomFloorFixtureClearOfDoorZone(fixture, zone)).toBe(true);
        }
      }
    }
    const coffeeTable = getFiveRoomPresentation("room.waiting", 0)!.fixtures.find((fixture) => fixture.id === "coffeeTable")!;
    expect(isFiveRoomFloorFixtureClearOfDoorZone(coffeeTable, getFiveRoomDoorClearZones("room.waiting")[1]!)).toBe(true);
  });
});
