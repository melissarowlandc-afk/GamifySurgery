import { expect, it } from "vitest";
import { approvedLevel4RoomTests } from "./level4ApprovedRoomTestHelpers";
import { resolveApprovedRoomActorSupports, resolveApprovedRoomDrawRecords, resolveApprovedRoomProceduralDrawRecords } from "./approvedRoomPresentation";
import { getApprovedDrawClipWidth, getApprovedSupportPainterGround } from "./approvedRoomRenderer";
import { getFacilitySceneDepth } from "./renderDepth";

approvedLevel4RoomTests("room.mri", "mri", 9);
it("MRI retains north operator, west patient foreground and measured bore-centre clipping", () => {
  const supports = resolveApprovedRoomActorSupports("room.mri", 0);
  expect(supports.find((support) => support.id === "operator")).toMatchObject({ pose: "seated", facing: "north", seat: { x: 1.12, y: 2.21 }, ground: { x: 1.12, y: 2.54 } });
  const patient = supports.find((support) => support.id === "patient-seated")!;
  expect(patient).toMatchObject({ pose: "seated", facing: "west", seat: { x: 2.18, y: 1.9703900860939874 } });
  const draws = resolveApprovedRoomDrawRecords("room.mri", 0);
  const table = draws.find((draw) => draw.id === "tableEmpty")!;
  expect(table.worldLocalGround).toEqual([2.49, 2.42]);
  expect(table.destinationTopLeftTiles[0] + getApprovedDrawClipWidth(table)! * table.renderSizeTiles[0] / table.sourceRect[2]).toBeCloseTo(2.5299418604651165, 12);
  for (const pixels of [24, 44, 80, 120]) for (const id of ["gantry", "tableEmpty"]) {
    expect(getFacilitySceneDepth(getApprovedSupportPainterGround(patient).y * pixels, "character", 0)).toBeGreaterThan(getFacilitySceneDepth(draws.find((draw) => draw.id === id)!.depthKey * pixels, "fixture", 63));
  }
  expect(resolveApprovedRoomProceduralDrawRecords("room.mri", 0)).toMatchObject([{ id: "glass", style: { kind: "approved-glass" }, rect: { left: 1.6, top: .72, width: .12, height: 2.46 } }]);
});
