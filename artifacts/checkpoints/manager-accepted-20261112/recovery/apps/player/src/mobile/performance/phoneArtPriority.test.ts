import { expect, it } from "vitest";
import type { FacilityRoomView } from "../../facility/types";
import { visiblePhoneAssetIds, visiblePhoneRoomIds } from "./phoneArtPriority";
import { mobileRoomAssets } from "./roomAssets";

it("prioritizes visible room dependencies at the current pan/zoom, including tall north walls", () => {
  const room = (id: string, x: number, y: number): FacilityRoomView => ({ instanceId: id, definitionId: id, tileX: x, tileY: y, width: 3, height: 3, displayName: id, isFounderRoom: false });
  const rooms = [room("room.front_desk", 0, 0), room("room.mri", 8, 14), room("room.front_desk", 1, 1), room("room.bathroom", -8, 0)];
  const layout = { originX: 0, originY: 0, tileSize: 20 };
  expect(visiblePhoneRoomIds(rooms, layout, { width: 390, height: 250 })).toEqual(["room.front_desk", "room.mri"]);
  expect(visiblePhoneRoomIds(rooms, { ...layout, originX: -220, originY: -240, tileSize: 40 }, { width: 390, height: 200 })).toEqual([]);
  expect(visiblePhoneAssetIds(["room.mri"])).toEqual(new Set(mobileRoomAssets("room.mri").map(asset => asset.id)));
});
