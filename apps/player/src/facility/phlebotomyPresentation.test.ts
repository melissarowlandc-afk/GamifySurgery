import { describe, expect, it, vi } from "vitest";
vi.mock("phaser", () => ({ default: { Scene: class {} } }));
import { FacilityScene, type FacilitySceneBridge } from "./FacilityScene";
import { PHLEBOTOMY_PRESENTATION } from "./phlebotomyPresentation";
import { resolveApprovedRoomActorSupports, resolveApprovedRoomDrawRecords, type ApprovedActorSupport } from "./approvedRoomPresentation";
import { getApprovedDrawPainterGround, getApprovedSupportPainterGround } from "./approvedRoomRenderer";
import { getApprovedSideChairForegroundDepth } from "./approvedSideChairLayers";
import { resolveStaffIdleSupports } from "./staffIdleSupports";
import { getFacilitySceneDepth } from "./renderDepth";
import { getCharacterStillPresentationMetrics, alignCharacterStillSeatToWorld } from "./characterPresentation";
import { RESTING_CHARACTER_MOTION } from "./characterHopMotion";
import { characterBitmapLayers, characterBitmapRegistration, characterStillScaleForAppearance } from "../art/characterBitmapArt";
import { getAllCharacterStillEntries } from "../art/characterStillRegistry";
import { roomThumbnailModel } from "./roomThumbnailCapture";
import type { PixelAppearanceDescriptor } from "@gamify-surgery/game-domain";
import before from "./furnitureSeatLayering.before.fixture.json";

const orientations = [0, 270] as const;
const zooms = [.1, .5, .7, 1, 1.6, 2.5] as const;
const appearance = (stillId: string): PixelAppearanceDescriptor => ({
  version: "pixel-avatar.v1", stillId, roleStyle: "patient", bodyShape: "average",
  hairStyle: "short", hairShade: 0, faceStyle: "round", outfitStyle: "plain", outfitShade: 0, accessory: "none",
});
const priorView = (orientation: 0 | 270) => before.find(view => view.room === "room.phlebotomy" && view.orientation === orientation)!;

// Use only the release's existing native still registration and single scale.
// No QA page, generated proportion data or pending seated corrections enter here.
function bounds(stillId: string, support: Pick<ApprovedActorSupport, "facing" | "seat" | "ground">, tile: number, originX = 0) {
  const facing = support.facing, look = appearance(stillId);
  const layers = characterBitmapLayers(look, facing === "south" ? "front" : facing === "north" ? "back" : "side", "seated", facing === "east")!;
  const reg = characterBitmapRegistration(layers);
  const metrics = getCharacterStillPresentationMetrics(tile, characterStillScaleForAppearance(look));
  const center = Math.round(originX + support.seat.x * tile);
  const floor = Math.round(alignCharacterStillSeatToWorld(support.seat.y * tile, reg.floorY, reg.seatContactY!, metrics.height));
  return {
    // Release FacilityScene uses setOrigin(0.5, floorAnchorY); the pending
    // per-sprite horizontal registration must not be introduced by this port.
    left: center + (reg.visibleBounds.x / 160 - .5) * metrics.width,
    right: center + ((reg.visibleBounds.x + reg.visibleBounds.width) / 160 - .5) * metrics.width,
    top: floor - (reg.floorY - reg.visibleBounds.y) / 320 * metrics.height, bottom: floor,
  };
}

describe("accepted phlebotomy presentation with release-native character sizing", () => {
  it.each(orientations)("shrinks only the chair by 15%% and preserves chair/stool native crops and aspect (%s)", orientation => {
    const draws = resolveApprovedRoomDrawRecords("room.phlebotomy", orientation);
    for (const prior of priorView(orientation).furniture) {
      const draw = draws.find(draw => draw.id === prior.id)!;
      expect(draw.assetId).toBe(prior.assetId);
      expect(draw.sourceRect).toEqual(prior.sourceRect);
      const factor = draw.id === "chair" ? .85 : 1;
      expect(draw.renderSizeTiles[0]).toBeCloseTo(prior.renderSizeTiles[0]! * factor, 12);
      expect(draw.renderSizeTiles[1]).toBeCloseTo(prior.renderSizeTiles[1]! * factor, 12);
      expect(draw.renderSizeTiles[0] / draw.renderSizeTiles[1]).toBeCloseTo(prior.sourceRect[2]! / prior.sourceRect[3]!, 12);
    }
    const chair = draws.find(draw => draw.id === "chair")!;
    expect(chair.renderSizeTiles[1]).toBeGreaterThan(1);
    expect(chair.renderSizeTiles[1]).toBeLessThan(1.2);
    for (const tier of [1, 2, 3, 4, 5]) {
      expect(resolveApprovedRoomDrawRecords("room.phlebotomy", orientation, undefined, tier)).toEqual(draws);
      expect(resolveApprovedRoomActorSupports("room.phlebotomy", orientation, tier)).toEqual(resolveApprovedRoomActorSupports("room.phlebotomy", orientation));
    }
  });

  it.each(orientations)("aligns patient cushion, stool seat rise and fixture floors within one pixel at tiles 5–130 (%s)", orientation => {
    const view = PHLEBOTOMY_PRESENTATION.views[orientation];
    const draws = resolveApprovedRoomDrawRecords("room.phlebotomy", orientation);
    for (const support of resolveApprovedRoomActorSupports("room.phlebotomy", orientation)) {
      const draw = draws.find(d => d.id === support.id.split(":")[0])!;
      const prior = priorView(orientation).seats.find(s => s.id === support.id)!;
      const seatPixel = support.role === "phlebotomy-patient" ? view.chairSeatSource : {
        x: draw.sourceFloorContact![0] + (prior.seat.x - prior.ground.x) * draw.sourceRect[2] / draw.renderSizeTiles[0],
        y: draw.sourceFloorContact![1] + (prior.seat.y - prior.ground.y) * draw.sourceRect[3] / draw.renderSizeTiles[1],
      };
      for (let tile = 5; tile <= 130; tile++) for (const origin of [0, 31, 83.25]) {
        const [left, top] = draw.destinationTopLeftTiles.map(n => Math.round(origin + n * tile));
        const [width, height] = draw.renderSizeTiles.map(n => Math.round(n * tile));
        expect(Math.abs(left! + seatPixel.x / draw.sourceRect[2] * width! - (origin + support.seat.x * tile))).toBeLessThanOrEqual(1);
        expect(Math.abs(top! + seatPixel.y / draw.sourceRect[3] * height! - (origin + support.seat.y * tile))).toBeLessThanOrEqual(1);
        expect(Math.abs(top! + draw.sourceFloorContact![1] / draw.sourceRect[3] * height! - (origin + support.ground.y * tile))).toBeLessThanOrEqual(1);
      }
    }
  });

  it("reproduces the old overlapping contacts using the unchanged release sprites", () => {
    for (const orientation of orientations) {
      const [patient, clinician] = priorView(orientation).seats;
      const p = bounds("patient.adult.001", { ...patient!, facing: orientation === 0 ? "south" : "east" }, 52);
      const c = bounds("gs022-new-employee-015", { ...clinician!, facing: orientation === 0 ? "north" : "west" }, 52);
      expect(Math.min(p.right, c.right) - Math.max(p.left, c.left)).toBeGreaterThan(0);
      expect(Math.min(p.bottom, c.bottom) - Math.max(p.top, c.top)).toBeGreaterThan(0);
    }
  });

  it("keeps the accepted normal/wide QA patients clear of all five phlebotomists without rescaling characters", () => {
    const entries = getAllCharacterStillEntries();
    const clinicians = entries.filter(entry => entry.role === "staff.phlebotomist" || entry.eligibleStaffRoleDefinitionIds?.includes("staff.phlebotomist"));
    const patients = entries.filter(entry => ["patient.adult.001", "patient-gapfill-v6a.015"].includes(entry.id));
    expect(patients).toHaveLength(2);
    expect(clinicians).toHaveLength(5);
    let worst = { gap: Infinity, id: "", orientation: 0, tile: 0 };
    for (const orientation of orientations) {
      const [patient, clinician] = resolveApprovedRoomActorSupports("room.phlebotomy", orientation);
      for (let tile = 22; tile <= 130; tile++) {
        const left = Math.min(...clinicians.map(entry => bounds(entry.id, clinician!, tile, 31.25).left));
        for (const entry of patients) {
          const gap = left - bounds(entry.id, patient!, tile, 31.25).right;
          if (gap < worst.gap) worst = { gap, id: entry.id, orientation, tile };
        }
      }
    }
    expect(Number.isFinite(worst.gap)).toBe(true);
    expect(worst.gap, JSON.stringify(worst)).toBeGreaterThanOrEqual(0);
  });

  it.each(orientations)("orders patient, stool clinician and chair armrest correctly, including idle reuse (%s)", orientation => {
    const [patient, clinician] = resolveApprovedRoomActorSupports("room.phlebotomy", orientation);
    const draws = resolveApprovedRoomDrawRecords("room.phlebotomy", orientation);
    const chair = draws.find(draw => draw.id === "chair")!, stool = draws.find(draw => draw.id === "stool")!;
    const idle = resolveStaffIdleSupports("room.phlebotomy", orientation)[0]!;
    expect({ ...idle, id: clinician!.id, role: clinician!.role }).toEqual(clinician);
    expect(idle.sideChairLayer).toBeUndefined();
    for (let tile = 5; tile <= 130; tile++) for (const origin of [0, 83.25]) {
      const p = getFacilitySceneDepth(origin + getApprovedSupportPainterGround(patient!).y * tile, "character", 1);
      const c = getFacilitySceneDepth(origin + getApprovedSupportPainterGround(clinician!).y * tile, "character", 2);
      expect(p).toBeGreaterThan(getFacilitySceneDepth(origin + getApprovedDrawPainterGround(chair) * tile, "fixture", 63));
      expect(c).toBeGreaterThan(getFacilitySceneDepth(origin + getApprovedDrawPainterGround(stool) * tile, "fixture", 63));
      expect(getApprovedSideChairForegroundDepth([p])!).toBeGreaterThan(p);
      expect(getApprovedSideChairForegroundDepth([p])!).toBeLessThan(c);
    }
  });

  it.each(orientations)("uses corrected service/idle contacts through the unmodified release scene at all six zooms (%s)", orientation => {
    const model = roomThumbnailModel("room.phlebotomy"), room = model.rooms[0]!;
    room.orientation = orientation;
    if (orientation === 270) [room.width, room.height] = [room.height, room.width];
    room.tileX = 4; room.tileY = 6; model.gridColumns = 32; model.gridRows = 20;
    const scene = new FacilityScene({ viewModel: model, onPlaceRoom: () => false } as FacilitySceneBridge) as any;
    scene.getApprovedSegmentState = () => ({ openDoorSegments: new Set(), backedNorthSegments: new Set() });
    for (const zoom of zooms) {
      model.camera = { zoom, panX: 0, panY: 0 };
      const tile = scene.calculateLayout(728, 700).tileSize;
      expect(tile).toBeGreaterThanOrEqual(22); expect(tile).toBeLessThanOrEqual(130);
      scene.layout = { originX: -31.25, originY: 83, tileSize: tile };
      for (const support of resolveApprovedRoomActorSupports("room.phlebotomy", orientation)) {
        const location = { x: room.tileX + support.ground.x, y: room.tileY + support.ground.y };
        const actual = scene.getApprovedActorSupportDisplayPosition(location, false, support.role, support.id, room.instanceId);
        expect(actual.centerX).toBeCloseTo(scene.layout.originX + (room.tileX + support.seat.x) * tile);
        expect(actual.baseY).toBeCloseTo(scene.layout.originY + (room.tileY + support.seat.y) * tile);
        expect(actual.depthBaseY).toBeCloseTo(scene.layout.originY + (room.tileY + getApprovedSupportPainterGround(support).y) * tile);
        expect(actual).toMatchObject({ scale: 1, pose: "seated", seatTarget: true, hidden: false });
        expect(scene.getApprovedActorSupportDisplayPosition(location, true, support.role, support.id, room.instanceId)).toBeUndefined();
        expect(scene.getApprovedActorSupportDisplayPosition(location, false, undefined)).toBeUndefined();
      }
      const idle = resolveStaffIdleSupports("room.phlebotomy", orientation)[0]!;
      expect(scene.getApprovedActorSupportDisplayPosition({ x: room.tileX + idle.ground.x, y: room.tileY + idle.ground.y }, false, idle.role, idle.id, room.instanceId))
        .toMatchObject({ pose: "seated", scale: 1, supportId: "phlebotomy:stool", direction: "side", rightFacing: false });
    }
  });

  it("retains the release's same native identity scale for standing and seated drawing", () => {
    const model = roomThumbnailModel("room.phlebotomy");
    const scene = new FacilityScene({ viewModel: model, onPlaceRoom: () => false } as FacilitySceneBridge) as any;
    scene.layout = { originX: 0, originY: 0, tileSize: 52 };
    scene.characterPresentationFrozen = () => false;
    scene.characterStepMotion = () => RESTING_CHARACTER_MOTION;
    scene.drawPixelPerson = vi.fn((_g, _x, y) => ({ baseY: y, representation: "bitmap" }));
    for (const id of ["patient.adult.001", "gs022-new-employee-015"]) for (const pose of ["idle", "seated"]) {
      const look = appearance(id);
      scene.drawCharacterPresentation({}, id, { centerX: 100, baseY: 200, appearance: look, direction: "front", pose, rightFacing: false, displayScale: 1 }, 0);
      expect(scene.drawPixelPerson.mock.lastCall[9]).toBe(characterStillScaleForAppearance(look));
    }
  });
});
