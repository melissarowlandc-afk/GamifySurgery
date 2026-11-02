import { useEffect, useRef, useState } from "react";
import { getRoomDefinition } from "@gamify-surgery/game-domain";
import { roomThumbnailAsset } from "../art/roomThumbnailManifest";
import type { PixelIconName } from "../art/iconArt";
import { PixelIcon } from "./PixelIcon";
import "./roomCatalogThumbnail.css";

interface RoomCatalogThumbnailProps {
  definitionId: string;
  upgradeLevel?: number;
  className?: string;
  fallbackIcon?: PixelIconName;
  onVisible?: (id: string) => void;
}

function ThumbnailImage({ definitionId, upgradeLevel, className = "", fallbackIcon = "examination", onVisible }: RoomCatalogThumbnailProps) {
  const asset = roomThumbnailAsset(definitionId, upgradeLevel);
  const name = getRoomDefinition(definitionId)?.displayName ?? "Room";
  const alt = `${name}, ${asset?.tier === 1 ? "freshly built" : `tier ${asset?.tier ?? upgradeLevel ?? 1}`} room preview`;
  const [state, setState] = useState<"placeholder" | "ready" | "unavailable">(asset ? "placeholder" : "unavailable");
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let reported = false;
    const reveal = () => {
      if (reported) return;
      reported = true; setVisible(true); onVisible?.(definitionId);
    };
    if (!ref.current || typeof IntersectionObserver === "undefined") { reveal(); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { reveal(); observer.disconnect(); }
    }, { rootMargin: "80px", threshold: 0.01 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [definitionId, onVisible]);
  return <span ref={ref} className={`room-thumbnail ${className}`.trim()} role="img"
    aria-label={state === "unavailable" ? `${name} preview unavailable` : alt}
    data-room-thumbnail={definitionId} data-thumbnail-tier={asset?.tier} data-art-state={state}>
    <PixelIcon name={fallbackIcon} className={state === "ready" ? "room-thumbnail-fallback is-hidden" : "room-thumbnail-fallback"} />
    {asset && visible && state !== "unavailable" ? <img src={asset.src} alt={alt} aria-hidden="true"
      width={asset.width} height={asset.height} loading="lazy" decoding="async"
      onLoad={() => setState("ready")} onError={() => setState("unavailable")}
      style={{ opacity: state === "ready" ? 1 : 0 }} /> : null}
  </span>;
}

/** Remount on asset changes so a failed/loaded previous tier cannot leak into the next preview. */
export function RoomCatalogThumbnail(props: RoomCatalogThumbnailProps) {
  return <ThumbnailImage key={`${props.definitionId}:${props.upgradeLevel ?? 1}`} {...props} />;
}
