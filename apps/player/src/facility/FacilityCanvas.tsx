import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactElement,
} from "react";
import Phaser from "phaser";

import {
  FacilityScene,
  type FacilitySceneBridge,
} from "./FacilityScene";
import type { FacilityViewModel, PlaceRoomRequest } from "./types";

export interface FacilityCanvasProps {
  viewModel: FacilityViewModel;
  onPlaceRoom: PlaceRoomRequest;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}

const DEFAULT_STYLE: CSSProperties = {
  width: "100%",
  height: "clamp(280px, 62vw, 640px)",
  minWidth: 0,
  overflow: "hidden",
  border: "2px solid #111111",
  background: "#f7f7f3",
  imageRendering: "pixelated",
  touchAction: "none",
};

/**
 * React owns the lifecycle and passes a read-only projection into Phaser.
 * Phaser owns only facility drawing and the pointer gesture that requests a
 * room placement.
 */
export function FacilityCanvas({
  viewModel,
  onPlaceRoom,
  className,
  style,
  ariaLabel,
}: FacilityCanvasProps): ReactElement {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const bridgeRef = useRef<FacilitySceneBridge>({
    viewModel,
    onPlaceRoom,
  });

  // Keeping the bridge current during render avoids stale props between React
  // commit and the next Phaser frame without rebuilding the Phaser game.
  bridgeRef.current.viewModel = viewModel;
  bridgeRef.current.onPlaceRoom = onPlaceRoom;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    const scene = new FacilityScene(bridgeRef.current);
    const width = Math.max(1, Math.floor(host.clientWidth));
    const height = Math.max(1, Math.floor(host.clientHeight));
    const game = new Phaser.Game({
      type: Phaser.CANVAS,
      parent: host,
      width,
      height,
      backgroundColor: "#f7f7f3",
      pixelArt: true,
      antialias: false,
      audio: {
        noAudio: true,
      },
      render: {
        antialias: false,
        roundPixels: true,
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        width,
        height,
      },
      scene,
    });
    gameRef.current = game;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || gameRef.current !== game) {
        return;
      }

      const nextWidth = Math.max(1, Math.floor(entry.contentRect.width));
      const nextHeight = Math.max(1, Math.floor(entry.contentRect.height));
      if (
        game.scale.width !== nextWidth ||
        game.scale.height !== nextHeight
      ) {
        game.scale.resize(nextWidth, nextHeight);
      }
    });
    resizeObserver.observe(host);

    return () => {
      resizeObserver.disconnect();
      if (gameRef.current === game) {
        gameRef.current = null;
      }
      game.destroy(true);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{ ...DEFAULT_STYLE, ...style }}
      role="img"
      aria-label={
        ariaLabel ?? `Top-down ${viewModel.facilityTitle} facility view`
      }
      data-testid="facility-canvas"
    />
  );
}
