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
import { characterBitmapLayers, characterBitmapRegistration, characterStillScaleForAppearance } from "../art/characterBitmapArt";
import { getAllCharacterStillEntries } from "../art/characterStillRegistry";
import { getCharacterProportionProfile } from "../art/characterProportions";
import { phlebotomyQaAppearance, phlebotomyQaModel, phlebotomyQaProof, PHLEBOTOMY_QA_ZOOMS, PHLEBOTOMY_QA_VIEWPORT } from "../art/characterPhlebotomyQaModel";

const orientations = [0, 270] as const;
function bounds(stillId: string, support: ApprovedActorSupport, tile: number, corrected: boolean, originX = 0, originY = 0, standing = false) {
  const facing = support.facing;
  const appearance = phlebotomyQaAppearance(stillId);
  const pose = standing ? "idle" : "seated";
  const layers = characterBitmapLayers(appearance, facing === "south" ? "front" : facing === "north" ? "back" : "side", pose, facing === "east")!;
  const reg = characterBitmapRegistration(layers);
  const metrics = getCharacterStillPresentationMetrics(tile, characterStillScaleForAppearance(appearance, corrected ? pose : "idle"));
  const center = Math.round(originX + support.seat.x * tile);
  const floor = Math.round(standing ? originY + support.ground.y * tile : alignCharacterStillSeatToWorld(originY + support.seat.y * tile, reg.floorY, reg.seatContactY!, metrics.height));
  return {
    left: center + (reg.visibleBounds.x / 160 - reg.floorAnchorX) * metrics.width,
    right: center + ((reg.visibleBounds.x + reg.visibleBounds.width) / 160 - reg.floorAnchorX) * metrics.width,
    top: floor - (reg.floorY - reg.visibleBounds.y) / 320 * metrics.height,
    bottom: floor,
  };
}

describe("phlebotomy owner playtest presentation", () => {
  it.each(orientations)("projects the QA footprint like the live model, without rotating it twice (%s)", orientation => {
    const model = phlebotomyQaModel(orientation, "after", "active"), room = model.rooms[0]!;
    expect([room.width, room.height]).toEqual(orientation === 0 ? [3, 2] : [2, 3]);
    expect(model.founder.location?.x).toBe(room.width + 1.5);
    expect(room.orientation).toBe(orientation);
  });
  it.each(orientations)("reduces only the draw chair by 15%%, preserves native crops/navigation, and translates its stool (%s)", orientation => {
    const before = phlebotomyQaProof(orientation);
    const after = resolveApprovedRoomDrawRecords("room.phlebotomy", orientation);
    for (const tier of [1, 2, 3, 4, 5]) {
      expect(resolveApprovedRoomDrawRecords("room.phlebotomy", orientation, undefined, tier)).toEqual(after);
      expect(resolveApprovedRoomActorSupports("room.phlebotomy", orientation, tier)).toEqual(resolveApprovedRoomActorSupports("room.phlebotomy", orientation));
    }
    expect(after).toHaveLength(before.records.length);
    for (const prior of before.records) {
      const draw = after.find(draw => draw.id === prior.id)!;
      if (!["chair", "stool"].includes(draw.id)) { expect(draw).toEqual(prior); continue; }
      const factor = draw.id === "chair" ? .85 : 1;
      expect(draw.assetId).toBe(prior.assetId);
      expect(draw.sourceRect).toEqual(prior.sourceRect);
      expect(draw.sourceFloorContact).toEqual(prior.sourceFloorContact);
      expect(draw.footprint).toEqual(prior.footprint);
      expect(draw.approach).toEqual(prior.approach);
      expect(draw.doorOwners).toEqual(prior.doorOwners);
      expect(draw.backedOwners).toEqual(prior.backedOwners);
      expect(draw.renderSizeTiles[0]).toBeCloseTo(prior.renderSizeTiles[0] * factor, 12);
      expect(draw.renderSizeTiles[1]).toBeCloseTo(prior.renderSizeTiles[1] * factor, 12);
      expect(draw.renderSizeTiles[0] / draw.renderSizeTiles[1]).toBeCloseTo(prior.sourceRect[2] / prior.sourceRect[3], 12);
    }
    const chair = after.find(draw => draw.id === "chair")!;
    // Proportionate high-back clinical chair, substantially below founder height.
    expect(chair.renderSizeTiles[1]).toBeGreaterThan(1);
    expect(chair.renderSizeTiles[1]).toBeLessThan(1.2);
  });

  it.each(orientations)("keeps cushion/floor contacts within one rounded pixel at every world scale (%s)", orientation => {
    const view = PHLEBOTOMY_PRESENTATION.views[orientation];
    const draws = resolveApprovedRoomDrawRecords("room.phlebotomy", orientation);
    const supports = resolveApprovedRoomActorSupports("room.phlebotomy", orientation);
    for (const support of supports) {
      const draw = draws.find(d => d.id === support.id.split(":")[0])!;
      const prior = phlebotomyQaProof(orientation).supports.find(s => s.id === support.id)!;
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

  it("reproduces the original collision with pending factors both off and on", () => {
    for (const orientation of orientations) for (const corrected of [false, true]) {
      const [patient, clinician] = phlebotomyQaProof(orientation).supports;
      const p = bounds("patient.adult.001", patient!, 52, corrected);
      const c = bounds("gs022-new-employee-015", clinician!, 52, corrected);
      expect(Math.min(p.right, c.right) - Math.max(p.left, c.left)).toBeGreaterThan(0);
      expect(Math.min(p.bottom, c.bottom) - Math.max(p.top, c.top)).toBeGreaterThan(0);
    }
  });

  it("separates every existing adult patient silhouette from the clinician, independent of pending seated corrections", () => {
    let worst = { gap: Infinity, id: "", tile: 0, orientation: 0, corrected: false };
    const adults = getAllCharacterStillEntries().filter(entry => getCharacterProportionProfile(entry.id)?.group === "adult");
    const phlebotomists = getAllCharacterStillEntries().filter(entry => entry.role === "staff.phlebotomist" || entry.eligibleStaffRoleDefinitionIds?.includes("staff.phlebotomist"));
    expect(phlebotomists).toHaveLength(5);
    for (const orientation of orientations) {
      const [patient, clinician] = resolveApprovedRoomActorSupports("room.phlebotomy", orientation);
      for (const corrected of [false, true]) for (let tile = 22; tile <= 130; tile++) {
        const clinicianLeft = Math.min(...phlebotomists.map(entry => bounds(entry.id, clinician!, tile, corrected, 31.25).left));
        for (const adult of adults) {
          const p = bounds(adult.id, patient!, tile, corrected, 31.25);
          const gap = clinicianLeft - p.right;
          if (gap < worst.gap) worst = { gap, id: adult.id, tile, orientation, corrected };
        }
      }
    }
    expect(worst.gap, JSON.stringify(worst)).toBeGreaterThanOrEqual(0);
  });

  it.each(orientations)("keeps actor/chair/stool/near-armrest depths ordered at all camera scales, including idle reuse (%s)", orientation => {
    const [patient, clinician] = resolveApprovedRoomActorSupports("room.phlebotomy", orientation);
    const chair = resolveApprovedRoomDrawRecords("room.phlebotomy", orientation).find(d => d.id === "chair")!;
    const stool = resolveApprovedRoomDrawRecords("room.phlebotomy", orientation).find(d => d.id === "stool")!;
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

  it.each(orientations)("uses the new contacts in the actual scene at overview/close zoom, leaving moving and unsupported standing staff on their floor path (%s)", orientation => {
    const model = phlebotomyQaModel(orientation, "after", "active");
    const room = model.rooms[0]!;
    room.tileX = 4; room.tileY = 6;
    const scene = new FacilityScene({ viewModel: model, onPlaceRoom: () => false } as FacilitySceneBridge) as any;
    scene.getApprovedSegmentState = () => ({ openDoorSegments: new Set(), backedNorthSegments: new Set() });
    const supports = resolveApprovedRoomActorSupports("room.phlebotomy", orientation);
    for (const zoom of PHLEBOTOMY_QA_ZOOMS) {
      model.camera = { zoom, panX: 0, panY: 0 };
      const actualLayout = scene.calculateLayout(PHLEBOTOMY_QA_VIEWPORT.width, PHLEBOTOMY_QA_VIEWPORT.height);
      expect(actualLayout.tileSize).toBeGreaterThanOrEqual(22);
      expect(actualLayout.tileSize).toBeLessThanOrEqual(130);
      scene.layout = { originX: -31.25, originY: 83, tileSize: actualLayout.tileSize };
      for (const support of supports) {
        const location = { x: room.tileX + support.ground.x, y: room.tileY + support.ground.y };
        const actual = scene.getApprovedActorSupportDisplayPosition(location, false, support.role, support.id, room.instanceId);
        expect(actual.centerX).toBeCloseTo(scene.layout.originX + (room.tileX + support.seat.x) * actualLayout.tileSize);
        expect(actual.baseY).toBeCloseTo(scene.layout.originY + (room.tileY + support.seat.y) * actualLayout.tileSize);
        expect(actual.depthBaseY).toBeCloseTo(scene.layout.originY + (room.tileY + getApprovedSupportPainterGround(support).y) * actualLayout.tileSize);
        expect(actual.scale).toBe(1);
        expect(actual.pose).toBe("seated");
        expect(actual.seatTarget).toBe(true);
        expect(actual.hidden).toBe(false);
        expect(scene.getApprovedActorSupportDisplayPosition(location, true, support.role, support.id, room.instanceId)).toBeUndefined();
        expect(scene.getApprovedActorSupportDisplayPosition(location, false, undefined)).toBeUndefined();
      }
      const idle = resolveStaffIdleSupports("room.phlebotomy", orientation)[0]!;
      expect(scene.getApprovedActorSupportDisplayPosition({ x: room.tileX + idle.ground.x, y: room.tileY + idle.ground.y }, false, idle.role, idle.id, room.instanceId))
        .toMatchObject({ pose: "seated", scale: 1, supportId: "phlebotomy:stool", direction: "side", rightFacing: false });
    }
  });
});
