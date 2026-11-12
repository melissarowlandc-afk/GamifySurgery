import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { PixelAppearanceDescriptor } from "@gamify-surgery/game-domain";
import data from "./characterProportions.generated.json";
import { CHARACTER_PROPORTION_REFERENCE, getCharacterProportionProfile } from "./characterProportions";
import { characterBitmapLayers, characterBitmapRegistration, characterStillScaleForAppearance } from "./characterBitmapArt";
import { CHARACTER_STILL_DIRECTIONS, getAllCharacterStillEntries } from "./characterStillRegistry";
import { alignCharacterStillSeatToWorld, characterStillVisibleTop, getCharacterStillPresentationMetrics } from "../facility/characterPresentation";
import { getApprovedRoomPresentation, resolveApprovedRoomActorSupports } from "../facility/approvedRoomPresentation";
import { getApprovedSupportPainterGround } from "../facility/approvedRoomRenderer";
import { getFacilitySceneDepth } from "../facility/renderDepth";

const appearance = (stillId: string): PixelAppearanceDescriptor => ({ version: "pixel-avatar.v1", stillId, roleStyle: stillId.startsWith("founder.") ? "founder" : "patient", bodyShape: "average", hairStyle: "short", hairShade: 0, faceStyle: "round", outfitStyle: "plain", outfitShade: 0, accessory: "none" });
const view = (facing: string) => ({ direction: facing === "south" ? "front" as const : facing === "north" ? "back" as const : "side" as const, right: facing === "east" });

describe("measured founder-reference character proportions", () => {
  it("requires an audited profile for every identity and detects changed registry inputs", () => {
    const bytes = readFileSync(new URL("./characterStillRegistry.generated.json", import.meta.url));
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(data.registrySha256);
    expect(Object.keys(data.identities)).toHaveLength(getAllCharacterStillEntries().length);
    for (const entry of getAllCharacterStillEntries()) expect(getCharacterProportionProfile(entry.id)).toBeDefined();
    expect(getCharacterProportionProfile("missing-character")).toBeUndefined();
    expect(CHARACTER_PROPORTION_REFERENCE.renderedHeight).toBeCloseTo(85.44375, 5);
  });

  it("keeps every adult facing within ±5% and children in their age band across normal zooms", () => {
    for (const tile of [20, 22, 24, 25, 26, 28, 32, 36.4, 52, 72.8, 83.2, 104, 130]) {
      const reference = CHARACTER_PROPORTION_REFERENCE.renderedHeight * tile / CHARACTER_PROPORTION_REFERENCE.tileSize;
      for (const entry of getAllCharacterStillEntries()) {
        const profile = getCharacterProportionProfile(entry.id)!;
        if (profile.group === "nonhuman") continue;
        const band = CHARACTER_PROPORTION_REFERENCE.groups[profile.group].band;
        const factor = characterStillScaleForAppearance(appearance(entry.id));
        const metrics = getCharacterStillPresentationMetrics(tile, factor);
        for (const facing of CHARACTER_STILL_DIRECTIONS) {
          const v = view(facing);
          const registration = characterBitmapRegistration(characterBitmapLayers(appearance(entry.id), v.direction, "idle", v.right));
          const height = registration.visibleBounds.height * metrics.height / 320;
          expect(height / reference, `${entry.id} ${facing} tile=${tile}`).toBeGreaterThanOrEqual(band[0]!);
          expect(height / reference, `${entry.id} ${facing} tile=${tile}`).toBeLessThanOrEqual(band[1]!);
          expect(metrics.width * 2).toBe(metrics.height);
          expect(Number.isInteger(metrics.width)).toBe(true);
        }
      }
    }
  });

  it("limits extreme overview quantization to one visible world pixel and scales with world zoom", () => {
    for (const entry of getAllCharacterStillEntries()) {
      const profile = getCharacterProportionProfile(entry.id)!;
      if (profile.group === "nonhuman") continue;
      for (const zoom of [.1, .2, .3, .4]) {
        const metrics = getCharacterStillPresentationMetrics(52 * zoom, profile.scale);
        const reference = CHARACTER_PROPORTION_REFERENCE.renderedHeight * zoom;
        const band = CHARACTER_PROPORTION_REFERENCE.groups[profile.group].band;
        for (const bounds of Object.entries(profile.boundsByPose).filter(([key]) => key.startsWith("stand")).map(([, bounds]) => bounds)) {
          const height = bounds.height * metrics.height / 320;
          expect(height).toBeGreaterThanOrEqual(reference * band[0]! - 1);
          expect(height).toBeLessThanOrEqual(reference * band[1]! + 1);
        }
        expect(Math.abs(metrics.width - 52 * zoom * 1.35 * (181 / 128) * (160 / 287) * profile.scale)).toBeLessThanOrEqual(.5);
      }
    }
  });

  it("aligns measured floors and authored seated contacts with bounded pose scaling", () => {
    for (const entry of getAllCharacterStillEntries()) {
      const subject = appearance(entry.id);
      const factor = characterStillScaleForAppearance(subject);
      for (const facing of CHARACTER_STILL_DIRECTIONS) {
        const v = view(facing);
        for (const pose of ["idle", "walk-a", "walk-neutral", "walk-b", "seated", "exam-table"] as const) {
          const layers = characterBitmapLayers(subject, v.direction, pose, v.right)!;
          const registration = characterBitmapRegistration(layers);
          const seated = pose === "seated" || pose === "exam-table";
          const key = `${seated ? "sit" : "stand"}-${facing}`;
          expect(registration.floorY).toBe(getCharacterProportionProfile(entry.id)!.floorByPose[key]);
          expect(registration.visibleBounds.y + registration.visibleBounds.height).toBe(registration.floorY);
          expect(registration.floorAnchorY).toBe(registration.floorY / 320);
          expect(registration.floorAnchorX).toBe(layers.actor.asset.anchors.bodyAxisX / 160);
          const metrics = getCharacterStillPresentationMetrics(52, characterStillScaleForAppearance(subject, pose));
          const pixelScale = metrics.height / 320;
          const floorBase = seated ? alignCharacterStillSeatToWorld(200, registration.floorY, registration.seatContactY!, metrics.height) : 200;
          const nativeContact = seated ? registration.seatContactY! : registration.floorY;
          expect(floorBase + (nativeContact - registration.floorY) * pixelScale).toBeCloseTo(200, 10);
          if (seated) expect(registration.seatContactY).toBe(entry.poses.sit[facing].anchors.seatContactY);
          expect(characterStillScaleForAppearance(subject)).toBe(factor);
          const head = characterStillVisibleTop(floorBase, registration.floorY, registration.visibleBounds.y, metrics.height);
          expect(head).toBeCloseTo(floorBase - registration.visibleBounds.height * pixelScale, 10);
        }
      }
      if (entry.clipboard) {
        const registration = characterBitmapRegistration(characterBitmapLayers(subject, "front", "interaction"));
        expect(registration.floorY).toBe(getCharacterProportionProfile(entry.id)!.floorByPose["clipboard-south"]);
        expect(registration.seatContactY).toBeUndefined();
      }
    }
  });

  it("removes faint-fringe framing from the older employee regression without editing its source", () => {
    const entry = getAllCharacterStillEntries().find(e => e.id === "gs022-new-employee-009")!;
    const subject = appearance(entry.id);
    const registration = characterBitmapRegistration(characterBitmapLayers(subject, "front", "idle"));
    expect(entry.poses.stand.south.visibleBounds.y).toBe(19);
    expect(registration.visibleBounds.y).toBe(55);
    expect(characterStillScaleForAppearance(subject)).toBeGreaterThan(1);
    const metrics = getCharacterStillPresentationMetrics(52, characterStillScaleForAppearance(subject));
    expect(registration.visibleBounds.height * metrics.height / 320).toBeGreaterThan(81);
  });

  it("keeps waiting, desk, exam, phlebotomy and recovery supports on their authored plane and painter baseline", () => {
    for (const room of ["room.waiting", "room.front_desk", "room.examination", "room.phlebotomy", "room.periop_recovery"]) {
      const supports = resolveApprovedRoomActorSupports(room, 0).filter(s => s.pose !== "standing");
      expect(supports.length, room).toBeGreaterThan(0);
      for (const support of supports) {
        const painter = getApprovedSupportPainterGround(support);
        const originalDepth = getFacilitySceneDepth(painter.y * 52, "character");
        for (const id of ["founder.14", "gs022-new-employee-009", "patient.adult.001", "level3-roster-v2.021"]) {
          const v = view(support.facing);
          const registration = characterBitmapRegistration(characterBitmapLayers(appearance(id), v.direction, support.pose === "exam-table" ? "exam-table" : "seated", v.right));
          const metrics = getCharacterStillPresentationMetrics(52, characterStillScaleForAppearance(appearance(id), support.pose === "exam-table" ? "exam-table" : "seated"));
          const worldSeatY = support.seat.y * 52;
          const base = alignCharacterStillSeatToWorld(worldSeatY, registration.floorY, registration.seatContactY!, metrics.height);
          expect(base - (registration.floorY - registration.seatContactY!) * metrics.height / 320).toBeCloseTo(worldSeatY, 10);
          expect(getFacilitySceneDepth(painter.y * 52, "character")).toBe(originalDepth);
          expect(originalDepth).toBeGreaterThan(getFacilitySceneDepth(painter.y * 52, "fixture", 63));
        }
      }
    }
    // Covered lying patients belong to the furniture variant, not the individual
    // character registry. Keep that contract explicit; do not rotate sitting art.
    for (const room of ["room.endoscopy", "room.ambulatory_or"]) {
      expect(getApprovedRoomPresentation(room)?.variantPolicy).toMatchObject({ hideIndividualPatient: true, preserveGlobalActorScale: true });
    }
    expect(resolveApprovedRoomActorSupports("room.periop_recovery", 0).every(s => s.pose === "seated")).toBe(true);
  });
});
