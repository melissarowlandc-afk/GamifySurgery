import { afterEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { RoomThumbnail } from "./RoomThumbnail";
import { cleanupPhoneTests, phoneTestDom } from "../screenTestUtils";
import { mobileBitmapCache, mobileRoomAssets } from "../performance/roomAssets";
import { APPROVED_LEVEL5_ROOM_DATA } from "../../facility/approvedLevel5RoomData";
afterEach(async () => { await cleanupPhoneTests(); vi.restoreAllMocks(); });

describe("Level 5 native phone thumbnails", () => {
  it.each([...APPROVED_LEVEL5_ROOM_DATA.values()])("paints complete native $roomDefinitionId art at every tier and retains failure placeholders", async room => {
    const env = phoneTestDom();
    const draw = vi.fn();
    const context = { fillRect: vi.fn(), strokeRect: vi.fn(), save: vi.fn(), restore: vi.fn(),
      setTransform: vi.fn(), transform: vi.fn(), drawImage: draw };
    const createElement = env.doc.createElement.bind(env.doc);
    env.doc.createElement = name => { const element = createElement(name); if (name === "canvas") Object.assign(element, { dataset: {}, getContext: () => context }); return element; };
    vi.stubGlobal("Image", class {}); vi.stubGlobal("IntersectionObserver", undefined);
    const load = vi.spyOn(mobileBitmapCache, "load").mockImplementation(async asset => ({ assetId: asset.id }) as unknown as HTMLImageElement);
    const visible = vi.fn(); const paintedDesks = new Set<string>();
    for (const tier of [1, 2, 3, 4, 5]) {
      draw.mockClear(); load.mockClear();
      await env.render(<RoomThumbnail definitionId={room.roomDefinitionId} upgradeLevel={tier} onVisible={visible} />);
      await act(async () => {});
      const canvas = env.find(node => node.tagName === "CANVAS") as unknown as HTMLCanvasElement;
      expect(canvas.dataset.artState).toBe("ready");
      expect(load).toHaveBeenCalledTimes(mobileRoomAssets(room.roomDefinitionId).length);
      expect(draw.mock.calls.length).toBe(room.tiers[room.appearanceChanges ? tier - 1 : 0]!.records.length);
      const ids = draw.mock.calls.map(([image]) => (image as { assetId: string }).assetId);
      expect(ids.every(id => id.startsWith("level5:"))).toBe(true);
      if (room.appearanceChanges) {
        const desk = ids.find(id => id.endsWith("-desk"))!; paintedDesks.add(desk);
        expect(desk).toContain(`:l${tier}-desk`);
        expect(ids.findIndex(id => id.endsWith("-rug"))).toBeLessThan(ids.indexOf(desk));
      }
    }
    if (room.appearanceChanges) expect(paintedDesks.size).toBe(5);
    load.mockResolvedValue(null); draw.mockClear();
    await env.render(<RoomThumbnail definitionId={room.roomDefinitionId} upgradeLevel={0} onVisible={visible} />);
    await act(async () => {});
    expect((env.find(node => node.tagName === "CANVAS") as unknown as HTMLCanvasElement).dataset.artState).toBe("unavailable");
    expect(draw).not.toHaveBeenCalled();
  });
});
