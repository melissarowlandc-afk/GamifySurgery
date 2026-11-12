import { describe, expect, it } from "vitest";
import { CHARACTER_PROPORTION_REFERENCE, getCharacterProportionProfile } from "./characterProportions";
import { getSeatedCharacterProportion, SEATED_CHARACTER_REFERENCE } from "./characterRoomProportions";
import { characterBitmapLayers, characterBitmapRegistration, characterStillScaleForAppearance } from "./characterBitmapArt";
import { getAllCharacterStillEntries, CHARACTER_STILL_DIRECTIONS } from "./characterStillRegistry";
import { alignCharacterStillSeatToWorld, getCharacterStillPresentationMetrics } from "../facility/characterPresentation";
import { characterRoomQaCases, characterRoomQaModel, qaCharacterAppearance } from "./characterRoomQaModel";
import { resolveApprovedRoomDrawRecords } from "../facility/approvedRoomPresentation";

describe("occupied-room character proportion contracts", () => {
  it("bounds safe pose changes and explicitly holds large jumps for regeneration", () => {
    expect(SEATED_CHARACTER_REFERENCE.seatedHeight).toBe(75.1875);
    let corrected = 0, held = 0;
    for (const entry of getAllCharacterStillEntries()) {
      const p = getSeatedCharacterProportion(entry.id)!;
      expect(p).toBeDefined();
      if (p.status === "corrected") { corrected++; expect(Math.abs(p.correction - 1)).toBeLessThanOrEqual(.1); }
      else expect(p.correction).toBe(1);
      if (p.status.startsWith("regeneration-required")) {
        held++;
        if (p.status === "regeneration-required-size-jump") expect(Math.abs(p.requiredCorrection! - 1)).toBeGreaterThan(.1);
      }
    }
    expect(corrected).toBe(244); expect(held).toBe(42);
  });

  it("keeps every safely corrected seated facing in its founder/age band at every normal integer world tile", () => {
    const failures: string[] = [];
    for (const entry of getAllCharacterStillEntries()) {
      const p = getSeatedCharacterProportion(entry.id)!, base = getCharacterProportionProfile(entry.id)!;
      if (p.status.startsWith("regeneration-required") || base.group === "nonhuman") continue;
      const appearance = qaCharacterAppearance(entry.id);
      const band = CHARACTER_PROPORTION_REFERENCE.groups[base.group].band;
      expect(characterStillScaleForAppearance(appearance, "idle")).toBe(base.scale);
      for (const facing of CHARACTER_STILL_DIRECTIONS) {
        const direction = facing === "south" ? "front" : facing === "north" ? "back" : "side";
        const registration = characterBitmapRegistration(characterBitmapLayers(appearance, direction, "seated", facing === "east"));
        expect(registration.seatContactY).toBe(entry.poses.sit[facing].anchors.seatContactY);
        for (let tile = 26; tile <= 130; tile++) {
          const metrics = getCharacterStillPresentationMetrics(tile, characterStillScaleForAppearance(appearance, "seated"));
          const reference = SEATED_CHARACTER_REFERENCE.seatedHeight * tile / 52;
          const ratio = registration.visibleBounds.height * metrics.height / 320 / reference;
          if (ratio < band[0]! - 1e-8 || ratio > band[1]! + 1e-8) failures.push(`${entry.id} ${facing} tile=${tile}: ${ratio}`);
          const baseY = alignCharacterStillSeatToWorld(250, registration.floorY, registration.seatContactY!, metrics.height);
          if (Math.abs(baseY - (registration.floorY - registration.seatContactY!) * metrics.height / 320 - 250) > 1e-8) failures.push("seat " + entry.id);
        }
        expect(characterStillScaleForAppearance(appearance, "exam-table")).toBe(characterStillScaleForAppearance(appearance, "seated"));
      }
    }
    expect(failures).toEqual([]);
  });

  it("exercises actual room/service supports with an outside founder and no routes or gameplay state", () => {
    const cases = characterRoomQaCases();
    expect(cases).toHaveLength(63);
    for (const room of ["room.xray", "room.ct", "room.mri", "room.ultrasound", "room.endoscopy", "room.ambulatory_or", "room.phlebotomy", "room.periop_recovery", "room.examination", "room.minor_procedure", "room.reading", "room.pediatric_waiting", "room.pediatric_examination", "room.waiting"]) expect(cases.some(c => c.room === room)).toBe(true);
    for (const job of cases) {
      const model = characterRoomQaModel(job);
      expect(model.rooms).toHaveLength(1); expect(model.founder.appearance.stillId).toBe("founder.14");
      for (const actor of [...model.staff, ...(model.patients ?? []), model.founder]) {
        expect(actor.path).toBeUndefined(); expect(getCharacterProportionProfile(actor.appearance!.stillId!)).toBeDefined();
      }
      if (job.covered) expect(model.endoscopyOccupancy?.roomInstanceIds).toEqual([model.rooms[0]!.instanceId]);
    }
  });

  it("never introduces unused service sprites or rescales furniture to repair a covered person", () => {
    const forbidden = /(?:surgeon|nurse|visitor|founder|employee)\.webp$/;
    for (const job of characterRoomQaCases()) {
      const records = resolveApprovedRoomDrawRecords(job.room, job.orientation, job.covered ? "occupiedCovered" : undefined, job.tier);
      expect(records.some(r => forbidden.test(r.assetId))).toBe(false);
    }
    // The two covered variants are inseparable source art, not standing sprites.
    // Exact room envelopes stay in their approved draw records; inspect/regen art.
    const table = resolveApprovedRoomDrawRecords("room.ambulatory_or", 0, "occupiedCovered").find(r => r.id === "table")!;
    expect(table.sourceRect).toEqual([0, 0, 215, 465]);
    expect(table.renderSizeTiles).toEqual([144.22360248447205 / 120, 311.92546583850935 / 120]);
  });
});
