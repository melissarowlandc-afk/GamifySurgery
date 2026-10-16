import { describe, expect, it } from "vitest";
import { approvedLevel4RoomTests } from "./level4ApprovedRoomTestHelpers";
import { resolveApprovedRoomActorSupports, resolveApprovedRoomDrawRecords } from "./approvedRoomPresentation";
import { getApprovedSupportPainterGround } from "./approvedRoomRenderer";
import { getFacilitySceneDepth } from "./renderDepth";

approvedLevel4RoomTests("room.pediatric_examination", "pediatric-exam", 6);
describe("pediatric examination exact seat and layering contract", () => {
  const records = resolveApprovedRoomDrawRecords("room.pediatric_examination", 0);
  const supports = resolveApprovedRoomActorSupports("room.pediatric_examination", 0);
  it("retains the east-facing child and a designated same-room west-facing parent", () => {
    expect(supports).toHaveLength(3);
    expect(supports.find((support) => support.id === "table:patient")).toMatchObject({ role: "pediatric-examination-patient", facing: "east",
      seat: { x: .66, y: 1.25 }, ground: { x: .66, y: 1.6 }, painterDepth: 2.06, allowedActors: ["child"] });
    expect(supports.find((support) => support.id === "parentChair")).toMatchObject({ role: "pediatric-parent-seat", facing: "west",
      seat: { x: 2.6533333333333333, y: 2.509206349206349 }, ground: { x: 2.52, y: 2.88 }, allowedActors: ["parent"] });
    expect(records.find((record) => record.id === "parentChair:front")).toMatchObject({ assetId: "level4:pediatric-waiting:armchair-west-front", foregroundSupportIds: ["parentChair"] });
  });
  it("uses one exact approved backless stool and paints the whole clinician above it at every tested zoom", () => {
    const stool = records.find((record) => record.id === "stool")!;
    const clinician = supports.find((support) => support.id === "stool:clinician")!;
    expect(stool).toMatchObject({ assetId: "level4:pediatric-exam:stool-backless", sourceRect: [0, 0, 266, 427], worldLocalGround: [1.45, 1.75] });
    expect(clinician).toMatchObject({ role: "pediatric-examination-clinician", facing: "west",
      seat: { x: 1.45, y: 1.2669924812030076 }, painterDepth: 1.7501, allowedActors: ["provider"] });
    expect(records.filter((record) => record.foregroundSupportIds?.includes(clinician.id))).toEqual([]);
    for (const tile of [24, 44, 80, 120]) {
      expect(getFacilitySceneDepth(getApprovedSupportPainterGround(clinician).y * tile, "character"))
        .toBeGreaterThan(getFacilitySceneDepth(stool.depthKey * tile, "fixture", 63));
    }
  });
});
