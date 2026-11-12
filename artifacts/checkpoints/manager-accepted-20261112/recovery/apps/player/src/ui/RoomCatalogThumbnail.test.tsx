import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RoomCatalogThumbnail } from "./RoomCatalogThumbnail";
import { roomThumbnailAsset } from "../art/roomThumbnailManifest";
import { MobileBuildCatalog } from "../mobile/build/MobileBuildCatalog";
import { cleanupPhoneTests, phoneFixture, phoneTestDom } from "../mobile/screenTestUtils";
import { testElementProps } from "../mobile/testDom";

afterEach(async () => { await cleanupPhoneTests(); vi.restoreAllMocks(); });

describe("room catalog thumbnail assets", () => {
  it("renders the manifest asset with meaningful alt text and a fixed box, never a live canvas", async () => {
    const env = phoneTestDom();
    await env.render(<RoomCatalogThumbnail definitionId="room.waiting" className="pixel-room-icon" />);
    const frame = env.find(node => node.attributes["data-room-thumbnail"] === "room.waiting");
    const img = env.find(node => node.tagName === "IMG");
    expect(img.attributes.src).toBe(roomThumbnailAsset("room.waiting")!.src);
    expect(img.attributes.alt).toBe("Waiting Room, freshly built room preview");
    expect([img.attributes.width, img.attributes.height]).toEqual(["480", "336"]);
    expect(frame.attributes.class).toContain("pixel-room-icon");
    expect(img.attributes.loading).toBe("lazy");
    await act(async () => { (testElementProps(img).onLoad as () => void)(); });
    expect(frame.attributes["data-art-state"]).toBe("ready");
  });
  it("keeps a stable fallback for unknown/missing assets, and resets for another room or tier", async () => {
    const env = phoneTestDom();
    await env.render(<RoomCatalogThumbnail definitionId="room.waiting" />);
    const img = env.find(node => node.tagName === "IMG");
    await act(async () => { (testElementProps(img).onError as () => void)(); });
    expect(env.find(node => node.attributes["data-room-thumbnail"] === "room.waiting").attributes["aria-label"]).toBe("Waiting Room preview unavailable");
    await env.render(<RoomCatalogThumbnail definitionId="room.founder_office" upgradeLevel={5} />);
    expect(env.find(node => node.tagName === "IMG").attributes.src).toBe(roomThumbnailAsset("room.founder_office", 5)!.src);
    expect(env.find(node => node.tagName === "IMG").attributes.alt).toContain("tier 5");
    await env.render(<RoomCatalogThumbnail definitionId="unknown" />);
    expect(env.find(node => node.attributes["data-room-thumbnail"] === "unknown").attributes["data-art-state"]).toBe("unavailable");
  });
  it("phone New Rooms catalog resolves the same mapped base-tier asset", async () => {
    const env = phoneTestDom(); const base = phoneFixture({ buildMode: true });
    const props = phoneFixture({ buildMode: true, facility: { ...base.facility, levelFiveRoomArt: true } });
    await env.render(<MobileBuildCatalog props={props} onChoose={() => {}} onOpenRoom={() => {}} onDoors={() => {}} />);
    expect(env.find(node => node.tagName === "IMG" && node.attributes.src === roomThumbnailAsset("room.waiting")!.src).attributes.alt).toContain("Waiting Room");
    expect(env.find(node => node.attributes["data-room-thumbnail"] === "room.founder_office").attributes["data-thumbnail-tier"]).toBe("1");
  });
});
