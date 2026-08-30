import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  FIXTURE_SPRITES,
  getFixtureSpriteForOrientation,
  ADVANCED_ROOM_FIXTURE_IDS,
  LEVEL_TWO_ROOM_FIXTURE_IDS,
  PRIMARY_ROOM_FIXTURE_IDS,
} from "./fixtureArt";

describe("primary room fixture art", () => {
  it("covers every primary room with explicit illustrated assets", () => {
    expect(Object.keys(PRIMARY_ROOM_FIXTURE_IDS)).toEqual([
      "room.front_desk",
      "room.hallway",
      "room.waiting",
      "room.examination",
      "room.bathroom",
      "room.xray",
      "room.imaging_control",
    ]);
    for (const [roomId, fixtureIds] of Object.entries(
      PRIMARY_ROOM_FIXTURE_IDS,
    )) {
      if (roomId === "room.hallway") {
        expect(fixtureIds).toEqual([]);
        continue;
      }
      expect(fixtureIds.length).toBeGreaterThanOrEqual(3);
      for (const fixtureId of fixtureIds) {
        expect(FIXTURE_SPRITES[fixtureId].cells.length).toBeGreaterThan(8);
      }
    }
  });

  it("keeps ordinary perspective fixtures upright when a room package rotates", () => {
    const original = FIXTURE_SPRITES.examTable;
    const rotated = getFixtureSpriteForOrientation("examTable", 90);
    expect(rotated).toBe(original);
    expect(rotated.width).toBe(original.width);
    expect(rotated.height).toBe(original.height);
  });

  it("does not retain rejected base-layout fixtures in the primary room branches", () => {
    const source = readFileSync(
      new URL("../facility/FacilityScene.ts", import.meta.url),
      "utf8",
    );
    const between = (start: string, end: string) =>
      source.slice(source.indexOf(start), source.indexOf(end));
    const waiting = between('case "room.waiting":', 'case "room.examination":');
    const examination = between(
      'case "room.examination":',
      'case "room.bathroom":',
    );
    const bathroom = between('case "room.bathroom":', 'case "room.xray":');

    expect(waiting).not.toMatch(/place\("plant"|place\("sideTable"|place\("rollingStool"/);
    expect(examination).not.toMatch(/examScale|privacyCurtain|towelDispenser/);
    expect(bathroom).not.toMatch(/towelDispenser|grabBar/);
  });
});

describe("Level 2 fixture art", () => {
  it("keeps Minor Procedure and every Level 2 room on an explicit non-fallback fixture set", () => {
    expect(Object.keys(ADVANCED_ROOM_FIXTURE_IDS)).toEqual([
      "room.minor_procedure",
      "room.ultrasound",
      "room.ct",
      "room.phlebotomy",
      "room.evs_closet",
      "room.endoscopy",
      "room.periop_recovery",
      "room.training",
      "room.coffee_kiosk",
      "room.glp1_telehealth_suite",
    ]);
    for (const fixtureIds of Object.values(ADVANCED_ROOM_FIXTURE_IDS)) {
      expect(fixtureIds.length).toBeGreaterThanOrEqual(3);
      for (const fixtureId of fixtureIds) {
        expect(FIXTURE_SPRITES[fixtureId].cells.length).toBeGreaterThan(8);
      }
    }
  });

  it("keeps every canonical Level 2 room on an explicit non-fallback fixture set", () => {
    expect(Object.keys(LEVEL_TWO_ROOM_FIXTURE_IDS)).toEqual([
      "room.ultrasound",
      "room.ct",
      "room.phlebotomy",
      "room.evs_closet",
      "room.endoscopy",
      "room.periop_recovery",
      "room.training",
      "room.coffee_kiosk",
      "room.glp1_telehealth_suite",
    ]);

    for (const fixtureIds of Object.values(LEVEL_TWO_ROOM_FIXTURE_IDS)) {
      expect(fixtureIds.length).toBeGreaterThanOrEqual(3);
      for (const fixtureId of fixtureIds) {
        expect(FIXTURE_SPRITES[fixtureId].cells.length).toBeGreaterThan(0);
      }
    }
  });
});
