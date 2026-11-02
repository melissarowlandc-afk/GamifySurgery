import { afterEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { RoomThumbnail } from "./RoomThumbnail";
import { cleanupPhoneTests, phoneTestDom } from "../screenTestUtils";
import { testElementProps } from "../testDom";
import { mobileBitmapCache } from "../performance/roomAssets";
import { roomThumbnailAsset } from "../../art/roomThumbnailManifest";
import { APPROVED_LEVEL5_ROOM_DATA } from "../../facility/approvedLevel5RoomData";
afterEach(async () => { await cleanupPhoneTests(); vi.restoreAllMocks(); });

describe("Level 5 offline phone thumbnails", () => {
  it.each([...APPROVED_LEVEL5_ROOM_DATA.values()])("maps $roomDefinitionId at every supported tier and retains failure fallbacks", async room => {
    const env = phoneTestDom();
    const load = vi.spyOn(mobileBitmapCache, "load");
    for (const tier of [1, 2, 3, 4, 5]) {
      await env.render(<RoomThumbnail definitionId={room.roomDefinitionId} upgradeLevel={tier} />);
      const image = env.find(node => node.tagName === "IMG");
      expect(image.attributes.src).toBe(roomThumbnailAsset(room.roomDefinitionId, tier)!.src);
      const frame = env.find(node => node.attributes["data-room-thumbnail"] === room.roomDefinitionId);
      expect(frame.attributes["data-thumbnail-tier"]).toBe(String(tier));
      expect(frame.attributes.class).toContain("mobile-room-thumbnail");
      await act(async () => { (testElementProps(image).onLoad as () => void)(); });
      expect(frame.attributes["data-art-state"]).toBe("ready");
    }
    await env.render(<RoomThumbnail definitionId={room.roomDefinitionId} upgradeLevel={1} />);
    const image = env.find(node => node.tagName === "IMG");
    await act(async () => { (testElementProps(image).onError as () => void)(); });
    expect(env.find(node => node.attributes["data-room-thumbnail"] === room.roomDefinitionId).attributes["data-art-state"]).toBe("unavailable");
    expect(load).not.toHaveBeenCalled();
  });
});
