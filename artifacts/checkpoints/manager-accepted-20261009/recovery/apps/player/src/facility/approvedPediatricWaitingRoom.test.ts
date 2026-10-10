import { describe, expect, it } from "vitest";
import { APPROVED_LEVEL4_SUPPORT_NAVIGATION, isApprovedLevel4SupportEligible } from "@gamify-surgery/balance-config";
import { approvedLevel4RoomTests } from "./level4ApprovedRoomTestHelpers";
import { resolveApprovedRoomActorSupports, resolveApprovedRoomDrawRecords } from "./approvedRoomPresentation";
import { getApprovedSideChairForegroundDepth } from "./approvedSideChairLayers";

approvedLevel4RoomTests("room.pediatric_waiting", "pediatric-waiting", 9);
describe("pediatric waiting supports and exact armrest layers", () => {
  it("keeps five ordinary child/parent seats and four child-only under-ten stools", () => {
    const supports = resolveApprovedRoomActorSupports("room.pediatric_waiting", 0);
    expect(supports).toHaveLength(9);
    const stools = supports.filter((support) => support.maxAgeExclusive === 10);
    expect(stools.map((support) => support.id)).toEqual(["kidWest", "kidEast", "kidNorth", "kidSouth"]);
    expect(stools.every((support) => support.allowedActors?.join() === "child")).toBe(true);
    expect(supports.filter((support) => support.allowedActors?.includes("parent"))).toHaveLength(5);
    for (const support of APPROVED_LEVEL4_SUPPORT_NAVIGATION["room.pediatric_waiting"]!) {
      expect(isApprovedLevel4SupportEligible(support, "child", 9)).toBe(true);
      expect(isApprovedLevel4SupportEligible(support, "child", 10)).toBe(support.maxAgeExclusive === undefined);
    }
  });
  it("retains distinct native east/west masks with matching contacts, owners and actual sitter foreground depth", () => {
    const records = resolveApprovedRoomDrawRecords("room.pediatric_waiting", 0);
    const supports = resolveApprovedRoomActorSupports("room.pediatric_waiting", 0);
    const masks = records.filter((record) => record.foregroundSupportIds?.length);
    expect(masks).toHaveLength(3);
    for (const mask of masks) {
      const support = supports.find((support) => mask.foregroundSupportIds!.includes(support.id))!;
      const chair = records.find((record) => record.id === support.supportRecord)!;
      expect(mask.destinationTopLeftTiles).toEqual(chair.destinationTopLeftTiles);
      expect(mask.renderSizeTiles).toEqual(chair.renderSizeTiles);
      expect(mask.doorOwners).toEqual(chair.doorOwners);
      expect(support.doorOwners).toEqual(chair.doorOwners);
      expect(mask.worldLocalGround).toEqual(chair.worldLocalGround);
      expect(mask.canvasTransform).toEqual([1, 0, 0, 1, 0, 0]);
      expect(getApprovedSideChairForegroundDepth([100, 200])).toBeGreaterThan(200);
    }
    expect(masks[0]!.sourceRect).toEqual([0, 0, 315, 369]);
    expect(masks[1]!.sourceRect).toEqual([0, 0, 315, 368]);
    expect(masks[0]!.assetId).not.toBe(masks[1]!.assetId);
    expect(supports.find((support) => support.id === "armchair")!.seat).toEqual({ x: 3.433333333333333, y: 1.5792063492063493 });
    expect(supports.every((support) => support.pose === "seated")).toBe(true);
  });
});
