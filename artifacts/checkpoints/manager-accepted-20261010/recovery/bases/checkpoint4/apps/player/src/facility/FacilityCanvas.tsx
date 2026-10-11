import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";
import { ClinicMapPins } from "./ClinicMapPins";
import type { FacilityAlertPinPosition } from "./types";
import Phaser from "phaser";
import { clampFacilityCamera, isValidFacilityCamera } from "./facilityCameraBounds";

import {
  FacilityScene,
  type FacilitySceneBridge,
  type FacilityScreenRect,
} from "./FacilityScene";
import type {
  FacilityCameraChangeRequest,
  CollectLitterRequest,
  DescribeCharacterRequest,
  FacilityViewModel,
  MoveFounderRequest,
  PlaceDoorRequest,
  PlaceRoomRequest,
  PraiseEmployeeRequest,
  RefillWaterCoolerRequest,
  SeatFounderAtFrontDeskRequest,
  SeatFounderInChairRequest,
  RemoveDoorRequest,
  RequestRoomUpgrade,
  SelectRoomRequest,
} from "./types";

export interface FacilityCanvasProps {
  viewModel: FacilityViewModel;
  onPlaceRoom: PlaceRoomRequest;
  onPlaceDoor?: PlaceDoorRequest;
  onRemoveDoor?: RemoveDoorRequest;
  onSelectRoom?: SelectRoomRequest;
  onRequestRoomUpgrade?: RequestRoomUpgrade;
  onCollectLitter?: CollectLitterRequest;
  onRefillWaterCooler?: RefillWaterCoolerRequest;
  onSeatFounderAtFrontDesk?: SeatFounderAtFrontDeskRequest;
  onSeatFounderInChair?: SeatFounderInChairRequest;
  onDescribeCharacter?: DescribeCharacterRequest;
  onPraiseEmployee?: PraiseEmployeeRequest;
  onMoveFounder?: MoveFounderRequest;
  onCameraChange?: FacilityCameraChangeRequest;
  onSelectedRoomRectChange?: (rect: FacilityScreenRect | null) => void;
  onAlertPinAction?: (id: string) => void;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}

const DEFAULT_STYLE: CSSProperties = {
  width: "100%",
  height: "clamp(280px, 62vw, 640px)",
  minWidth: 0,
  overflow: "hidden",
  border: "3px solid #232720",
  background: "#7e8476",
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
  onPlaceDoor,
  onRemoveDoor,
  onSelectRoom,
  onRequestRoomUpgrade,
  onCollectLitter,
  onRefillWaterCooler,
  onSeatFounderAtFrontDesk,
  onSeatFounderInChair,
  onDescribeCharacter,
  onPraiseEmployee,
  onMoveFounder,
  onCameraChange,
  onSelectedRoomRectChange,
  onAlertPinAction,
  className,
  style,
  ariaLabel,
}: FacilityCanvasProps): ReactElement {
  const hostRef = useRef<HTMLDivElement>(null);
  const [alertPinPositions, setAlertPinPositions] = useState<FacilityAlertPinPosition[]>([]);
  const gameRef = useRef<Phaser.Game | null>(null);
  const bridgeRef = useRef<FacilitySceneBridge>({
    viewModel,
    onPlaceRoom,
  });

  // Keeping the bridge current during render avoids stale props between React
  // commit and the next Phaser frame without rebuilding the Phaser game.
  bridgeRef.current.viewModel = viewModel;
  bridgeRef.current.onPlaceRoom = onPlaceRoom;
  bridgeRef.current.onPlaceDoor = onPlaceDoor;
  bridgeRef.current.onRemoveDoor = onRemoveDoor;
  bridgeRef.current.onSelectRoom = onSelectRoom;
  bridgeRef.current.onRequestRoomUpgrade = onRequestRoomUpgrade;
  bridgeRef.current.onCollectLitter = onCollectLitter;
  bridgeRef.current.onRefillWaterCooler = onRefillWaterCooler;
  bridgeRef.current.onSeatFounderAtFrontDesk = onSeatFounderAtFrontDesk;
  bridgeRef.current.onSeatFounderInChair = onSeatFounderInChair;
  bridgeRef.current.onDescribeCharacter = onDescribeCharacter;
  bridgeRef.current.onPraiseEmployee = onPraiseEmployee;
  bridgeRef.current.onMoveFounder = onMoveFounder;
  bridgeRef.current.onCameraChange = onCameraChange;
  bridgeRef.current.onSelectedRoomRectChange = onSelectedRoomRectChange;
  bridgeRef.current.onAlertPinPositionsChange = setAlertPinPositions;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    // Phaser 4 schedules part of `destroy` through its game loop. React
    // StrictMode immediately mounts effects twice in development, so the
    // destroyed canvas could survive long enough for the replacement canvas
    // to be appended beneath it. The player would then see and click an
    // inactive map while the live map sat one full canvas-height below.
    host.querySelectorAll(":scope > canvas").forEach((canvas) => {
      canvas.remove();
    });

    const scene = new FacilityScene(bridgeRef.current);
    const width = Math.max(1, Math.floor(host.clientWidth));
    const height = Math.max(1, Math.floor(host.clientHeight));
    const game = new Phaser.Game({
      type: Phaser.CANVAS,
      parent: host,
      width,
      height,
      backgroundColor: "#7e8476",
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
    const ownedCanvas = game.canvas;
    gameRef.current = game;
    let lastCameraLayoutSignature = "";
    const reconcileCamera = () => {
      // Phaser may still be loading assets. Reconcile only after create/update
      // has run, using the current canvas size rather than a saved viewport.
      if (gameRef.current !== game || !scene.sys.isActive() ||
        host.clientWidth <= 0 || host.clientHeight <= 0) return;
      const model = bridgeRef.current.viewModel;
      if (!isValidFacilityCamera(model.camera)) return;
      const founderRoom = model.rooms.find((room) => room.isFounderRoom);
      const signature = JSON.stringify([
        model.campaignId, model.gridColumns, model.gridRows,
        game.scale.width, game.scale.height,
        founderRoom?.tileX, founderRoom?.width,
        model.camera.zoom, model.camera.panX, model.camera.panY,
      ]);
      if (signature === lastCameraLayoutSignature) return;
      lastCameraLayoutSignature = signature;
      const camera = clampFacilityCamera(model.camera, model, game.scale);
      if (camera.zoom !== model.camera.zoom || camera.panX !== model.camera.panX ||
        camera.panY !== model.camera.panY) {
        bridgeRef.current.viewModel = { ...model, camera };
        bridgeRef.current.onCameraChange?.(camera);
      }
    };
    game.events.on(Phaser.Core.Events.POST_STEP, reconcileCamera);
    // The map-mounted gait proof is deliberately opt-in and development-only.
    // It lets Playwright observe the *rendered Phaser actor* metadata without
    // adding a visible debug panel or making gameplay state inspectable.
    const gaitProofEnabled = import.meta.env.DEV &&
      new URLSearchParams(window.location.search).has("facility-gait-proof");
    const proofHost = host as HTMLDivElement & {
      __facilityGaitSnapshot?: () => unknown;
      __facilityGame?: Phaser.Game;
    };
    if (gaitProofEnabled) {
      proofHost.__facilityGame = game;
      proofHost.__facilityGaitSnapshot = () => scene.debugCharacterGaitSnapshot();
    }

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
      game.events.off(Phaser.Core.Events.POST_STEP, reconcileCamera);
      resizeObserver.disconnect();
      if (resizeFrame !== null) {
        window.cancelAnimationFrame(resizeFrame);
      }
      if (gameRef.current === game) {
        gameRef.current = null;
      }
      if (proofHost.__facilityGame === game) {
        delete proofHost.__facilityGame;
        delete proofHost.__facilityGaitSnapshot;
      }
      game.destroy(true);
      if (ownedCanvas.parentElement === host) {
        ownedCanvas.remove();
      }
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{ ...DEFAULT_STYLE, position: "relative", ...style }}
      role="group"
      aria-label={
        ariaLabel ?? `Top-down ${viewModel.facilityTitle} facility view`
      }
      data-testid="facility-canvas"
    ><ClinicMapPins pins={viewModel.alertPins ?? []} positions={alertPinPositions} onAction={onAlertPinAction} /></div>
  );
}
