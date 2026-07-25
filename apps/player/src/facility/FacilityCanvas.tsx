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
import type {
  FacilityCameraChangeRequest,
  FacilityViewModel,
  PlaceRoomRequest,
  SelectRoomRequest,
} from "./types";

export interface FacilityCanvasProps {
  viewModel: FacilityViewModel;
  onPlaceRoom: PlaceRoomRequest;
  onSelectRoom?: SelectRoomRequest;
  onCameraChange?: FacilityCameraChangeRequest;
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
  onSelectRoom,
  onCameraChange,
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
  bridgeRef.current.onSelectRoom = onSelectRoom;
  bridgeRef.current.onCameraChange = onCameraChange;

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
        // React owns the host box and the ResizeObserver below owns Phaser's
        // backing bitmap. NONE avoids Scale.RESIZE racing the observer and
        // leaving pointer coordinates mapped to a stale canvas height.
        mode: Phaser.Scale.NONE,
        width,
        height,
      },
      scene,
    });
    gameRef.current = game;

    let resizeFrame: number | null = null;
    let observedWidth = width;
    let observedHeight = height;
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || gameRef.current !== game) {
        return;
      }

      const nextWidth = Math.max(1, Math.floor(entry.contentRect.width));
      const nextHeight = Math.max(1, Math.floor(entry.contentRect.height));
      if (
        observedWidth === nextWidth &&
        observedHeight === nextHeight
      ) {
        return;
      }
      observedWidth = nextWidth;
      observedHeight = nextHeight;
      if (resizeFrame !== null) {
        window.cancelAnimationFrame(resizeFrame);
      }
      // Phaser changes its canvas dimensions during resize. Deferring that
      // write prevents it from occurring inside ResizeObserver delivery and
      // feeding a same-frame resize loop back into the host element.
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = null;
        if (gameRef.current === game) {
          // Scale.RESIZE can update the displayed CSS box before the backing
          // canvas bitmap. Always synchronize both dimensions after the host
          // observer fires so pointer-to-tile mapping remains exact.
          game.scale.resize(observedWidth, observedHeight);
        }
      });
    });
    resizeObserver.observe(host);

    return () => {
      resizeObserver.disconnect();
      if (resizeFrame !== null) {
        window.cancelAnimationFrame(resizeFrame);
      }
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
