import { RoomCatalogThumbnail } from "../../ui/RoomCatalogThumbnail";

/** Both catalogs share offline FacilityScene captures; no second room renderer. */
export function RoomThumbnail(props: { definitionId: string; upgradeLevel?: number; onVisible?: (id: string) => void }) {
  return <RoomCatalogThumbnail {...props} className="mobile-room-thumbnail" />;
}
