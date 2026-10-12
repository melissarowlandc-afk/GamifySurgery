import { useEffect, useRef } from "react";
import { getRoomDefinition } from "@gamify-surgery/game-domain";
import { getApprovedRoomPresentation, resolveApprovedRoomDrawRecords } from "../../facility/approvedRoomPresentation";
import { resolvePublicArtAssetUrl } from "../../art/bitmapAssetManifest";
import { mobileBitmapCache, mobileRoomAssets } from "../performance/roomAssets";

/** Small composites of the existing approved art; no new assets or desktop loads. */
export function RoomThumbnail({ definitionId, onVisible }: { definitionId: string; onVisible?: (id: string) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || typeof Image === "undefined" || typeof canvas.getContext !== "function") return;
    const context = canvas.getContext("2d"); const definition = getRoomDefinition(definitionId);
    if (!context || !definition) return;
    let current = true;
    const room = getApprovedRoomPresentation(definitionId);
    const records = resolveApprovedRoomDrawRecords(definitionId, 0);
    const scale = Math.min(144 / definition.width, 88 / (definition.height + 0.8));
    const ox = (160 - definition.width * scale) / 2; const oy = 12 + 0.8 * scale;
    context.imageSmoothingEnabled = false;
    context.fillStyle = room?.shell.background ?? "#eee4ce"; context.fillRect(0, 0, 160, 112);
    context.fillStyle = room?.shell.floorBase ?? "#ddd4bc";
    context.fillRect(ox, oy, definition.width * scale, definition.height * scale);
    context.strokeStyle = room?.shell.baseTrim ?? "#58735a"; context.lineWidth = 3;
    context.strokeRect(ox, oy, definition.width * scale, definition.height * scale);
    canvas.dataset.artState = "placeholder";
    let started = false;
    const begin = () => {
      if (started || !current) return;
      started = true;
      onVisible?.(definitionId);
      Promise.all(mobileRoomAssets(definitionId).map(async asset => [asset.id,
        await mobileBitmapCache.load(asset, resolvePublicArtAssetUrl(asset.relativePath!, import.meta.env.BASE_URL))] as const)).then(loaded => {
        if (!current) return;
        if (loaded.some(([, image]) => !image)) { canvas.dataset.artState = "unavailable"; return; }
        const byId = new Map(loaded);
        for (const record of records) {
          const image = byId.get(record.assetId); if (!image) continue;
          context.save(); context.setTransform(scale, 0, 0, scale, ox, oy);
          const [a, b, c, d, e, f] = record.canvasTransform;
          context.transform(a, b, c, d, e / 120, f / 120);
          context.drawImage(image, ...record.sourceRect, ...record.destinationTopLeftTiles, ...record.renderSizeTiles);
          context.restore();
        }
        canvas.dataset.artState = "ready";
      });
    };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { begin(); observer?.disconnect(); }
    }, { threshold: 0.01 });
    if (observer) observer.observe(canvas); else begin();
    return () => { current = false; observer?.disconnect(); };
  }, [definitionId, onVisible]);
  return <canvas className="mobile-room-thumbnail" width={160} height={112} role="img" aria-label={`${getRoomDefinition(definitionId)?.displayName ?? "Room"} art`} ref={ref} />;
}
