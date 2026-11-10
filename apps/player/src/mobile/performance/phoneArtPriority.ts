import type { FacilityRoomView } from "../../facility/types";
import { mobileRoomAssets } from "./roomAssets";

/** Screen projection, including the north wall overhang. No raster cache or
 * extra world container: this is only the finite loading priority set. */
export function visiblePhoneRoomIds(rooms: readonly FacilityRoomView[],
  layout: { originX: number; originY: number; tileSize: number }, viewport: { width: number; height: number }): string[] {
  return [...new Set(rooms.filter(room => {
    const x = layout.originX + room.tileX * layout.tileSize, y = layout.originY + room.tileY * layout.tileSize;
    return x < viewport.width && x + room.width * layout.tileSize > 0 &&
      y - 2 * layout.tileSize < viewport.height && y + room.height * layout.tileSize > 0;
  }).map(room => room.definitionId))];
}

export function visiblePhoneAssetIds(roomIds: readonly string[]): Set<string> {
  return new Set(roomIds.flatMap(id => mobileRoomAssets(id).map(asset => asset.id)));
}
