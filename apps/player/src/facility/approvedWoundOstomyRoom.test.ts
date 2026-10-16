import { describe, expect, it } from "vitest";
import { approvedLevel4RoomTests } from "./level4ApprovedRoomTestHelpers";
import { resolveApprovedRoomActorSupports, resolveApprovedRoomDrawRecords } from "./approvedRoomPresentation";
import { getApprovedSupportPainterGround } from "./approvedRoomRenderer";
import { getFacilitySceneDepth } from "./renderDepth";

approvedLevel4RoomTests("room.wound_ostomy", "wound-ostomy", 6);
describe("wound/ostomy approved upright chair and backless stool", () => {
  const records = resolveApprovedRoomDrawRecords("room.wound_ostomy", 0);
  const supports = resolveApprovedRoomActorSupports("room.wound_ostomy", 0);
  it("preserves the revised no-leg-rest native frame and measured patient contact without stretching", () => {
    const chair = records.find((record) => record.id === "recliner")!;
    expect(chair).toMatchObject({ assetId: "level4:wound-ostomy:wound-recliner", sourceRect: [0, 0, 624, 470],
      renderSizeTiles: [1.3, .9791666666666666], worldLocalGround: [.9, 1.95] });
    expect(chair.renderSizeTiles[0] / chair.renderSizeTiles[1]).toBeCloseTo(624 / 470, 12);
    expect(supports.find((support) => support.id === "recliner:patient")).toMatchObject({ role: "wound-ostomy-patient", facing: "east",
      seat: { x: .6288793103448275, y: 1.4886135057471264 }, painterDepth: 1.9501, allowedActors: ["patient"] });
    expect(records.find((record) => record.id === "sink")!.assetId).toBe("gs015:minor-procedure:furniture");
    expect(records.find((record) => record.id === "curtain")!.assetId).toBe("room-touchup:curtain-bunch");
    expect(records.find((record) => record.id === "bio")!.assetId).toBe("room-touchup:biohazard-bin");
  });
  it("paints the whole west-facing clinician above the single approved backless stool at every tested zoom", () => {
    const stool = records.find((record) => record.id === "stool")!;
    const clinician = supports.find((support) => support.id === "stool:clinician")!;
    expect(stool).toMatchObject({ assetId: "level4:wound-ostomy:rolling-stool-backless", sourceRect: [0, 0, 266, 427], worldLocalGround: [2.15, 1.9] });
    expect(clinician).toMatchObject({ role: "wound-ostomy-clinician", facing: "west",
      seat: { x: 2.15, y: 1.4169924812030075 }, painterDepth: 1.9001, allowedActors: ["provider"] });
    expect(records.filter((record) => record.foregroundSupportIds?.includes(clinician.id))).toEqual([]);
    for (const tile of [24, 44, 80, 120]) expect(getFacilitySceneDepth(getApprovedSupportPainterGround(clinician).y * tile, "character"))
      .toBeGreaterThan(getFacilitySceneDepth(stool.depthKey * tile, "fixture", 63));
  });
});
