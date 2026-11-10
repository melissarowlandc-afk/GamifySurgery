import { renderLoopWatchdog, wakePresentationLoop } from "../diagnostics/renderLoopWatchdog";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";
import { ClinicMapPins } from "./ClinicMapPins";
import { createMapPinPositionWriter } from "./mapPinPositions";
import { facilityProofEnabled } from "./facilityProofPolicy";
import type { FacilityAlertPinPosition } from "./types";
import Phaser from "phaser";
import { clampFacilityCamera, isValidFacilityCamera } from "./facilityCameraBounds";
import { facilityCameraSignature } from "./desktopMapShade";
import type { MobileMapSelection } from "../mobile/map/selection";
import type { MobileBuildMapState } from "../mobile/build/types";
import { MobileMapPresentationPolicy, mobileCanvasSize } from "../mobile/performance/presentationPolicy";
import { PhoneFrameBudget, PHONE_ACTIVE_FPS } from "../mobile/performance/frameBudget";
import { phoneMemoryProfile, markPhonePlaying } from "../mobile/performance/phoneMemoryPolicy";
import { mobileBitmapCache } from "../mobile/performance/roomAssets";
import { bindCanvasContextRecovery } from "../mobile/performance/canvasContextRecovery";
import { facilityMemorySnapshot } from "../mobile/performance/facilityMemory";
import { problemDiagnostics } from "../diagnostics/problemDiagnostics";

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
  /** Only the phone shell opts into touch gestures and structured inspection. */
  mobileInput?: boolean;
  mobileMapCovered?: boolean;
  mobileFacilityLevel?: number;
  mobilePreviewRoomIds?: readonly string[];
  mobileBuild?: MobileBuildMapState | null;
  onMobileSelection?: (selection: MobileMapSelection | null) => void;
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
  onHighlightPatientChart?: (patientId: string) => void;
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

export const DESKTOP_CAMERA_RESIZE_SETTLE_MS = 250;

/**
 * React owns the lifecycle and passes a read-only projection into Phaser.
 * Phaser owns only facility drawing and the pointer gesture that requests a
 * room placement.
 */
export function FacilityCanvas({
  mobileInput,
  mobileMapCovered,
  mobileFacilityLevel,
  mobilePreviewRoomIds,
  mobileBuild,
  onMobileSelection,
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
  onHighlightPatientChart,
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
  const proofCounts = useRef({ canvasRenders: 0, viewModelChanges: 0, model: viewModel });
  if (import.meta.env.DEV || import.meta.env.VITE_FACILITY_PERF_PROOF === "1") {
    proofCounts.current.canvasRenders++;
    if (proofCounts.current.model !== viewModel) proofCounts.current.viewModelChanges++;
  }
  proofCounts.current.model = viewModel;
  const [alertPinPositions, setAlertPinPositions] = useState<FacilityAlertPinPosition[]>([]);
  const pinPositions = useRef<ReturnType<typeof createMapPinPositionWriter> | null>(null);
  if (!pinPositions.current) pinPositions.current = createMapPinPositionWriter(setAlertPinPositions);
  const [mobilePageHidden, setMobilePageHidden] = useState(false);
  const mobilePolicy = useRef<MobileMapPresentationPolicy | null>(null);
  if (mobileInput === true && !mobilePolicy.current) mobilePolicy.current = new MobileMapPresentationPolicy();
  if (mobileInput === true) mobilePolicy.current!.setCovered(mobileMapCovered === true);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [canvasNeeded, setCanvasNeeded] = useState(mobileInput !== true || mobileMapCovered !== true);
  const phoneFrames = useRef<PhoneFrameBudget | null>(null);
  const bridgeRef = useRef<FacilitySceneBridge>({
    viewModel,
    onPlaceRoom,
  });

  // Keeping the bridge current during render avoids stale props between React
  // commit and the next Phaser frame without rebuilding the Phaser game.
  bridgeRef.current.mobileInput = mobileInput === true;
  bridgeRef.current.mobilePresentation = mobileInput === true ? mobilePolicy.current! : undefined;
  bridgeRef.current.mobileFacilityLevel = mobileFacilityLevel;
  bridgeRef.current.mobilePreviewRoomIds = mobilePreviewRoomIds;
  bridgeRef.current.mobileBuild = mobileInput === true ? mobileBuild : null;
  bridgeRef.current.onMobileSelection = onMobileSelection;
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
  bridgeRef.current.onHighlightPatientChart = onHighlightPatientChart;
  bridgeRef.current.onPraiseEmployee = onPraiseEmployee;
  bridgeRef.current.onMoveFounder = onMoveFounder;
  bridgeRef.current.onCameraChange = onCameraChange;
  bridgeRef.current.onSelectedRoomRectChange = onSelectedRoomRectChange;
  bridgeRef.current.onAlertPinPositionsChange = pinPositions.current.publish;

  useEffect(() => { phoneFrames.current?.update(); });
  useEffect(() => { if (mobileInput === true) markPhonePlaying(); }, [mobileInput]);
  useEffect(() => { if (mobileInput !== true || mobileMapCovered !== true) setCanvasNeeded(true); }, [mobileInput, mobileMapCovered]);

  useEffect(() => {
    if (mobileInput !== true) return;
    const updateVisibility = () => {
      const hidden = document.visibilityState === "hidden";
      mobilePolicy.current!.setPageHidden(hidden);
      phoneFrames.current?.update();
      setMobilePageHidden(hidden);
    };
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, [mobileInput]);

  useEffect(() => {
    if (!canvasNeeded) return;
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

    if (bridgeRef.current.mobileInput === true) phoneMemoryProfile(true);
    const scene = new FacilityScene(bridgeRef.current);
    const width = bridgeRef.current.mobileInput === true ? mobileCanvasSize(host.clientWidth, host.clientHeight).width : Math.max(1, Math.floor(host.clientWidth));
    const height = bridgeRef.current.mobileInput === true ? mobileCanvasSize(host.clientWidth, host.clientHeight).height : Math.max(1, Math.floor(host.clientHeight));
    const game = new Phaser.Game({
      type: Phaser.CANVAS,
      parent: host,
      width,
      height,
      ...(bridgeRef.current.mobileInput === true ? { fps: { target: PHONE_ACTIVE_FPS, limit: PHONE_ACTIVE_FPS } } : {}),
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
    let mainCanvasLost = false;
    const frameBudget = bridgeRef.current.mobileInput === true ? new PhoneFrameBudget(game, () => ({
      hidden: mainCanvasLost || bridgeRef.current.mobilePresentation?.hidden === true,
      paused: bridgeRef.current.viewModel.paused || Boolean(bridgeRef.current.viewModel.buildMode),
      model: bridgeRef.current.viewModel,
    })) : null;
    phoneFrames.current = frameBudget;
    if (frameBudget) {
      game.events.on(Phaser.Core.Events.POST_STEP, frameBudget.frame);
      game.textures.on(Phaser.Textures.Events.ADD, frameBudget.interact);
      for (const event of ["pointerdown", "pointermove", "pointerup", "wheel"])
        game.canvas.addEventListener(event, frameBudget.interact, { passive: true, capture: true });
      frameBudget.update();
    }
    const contextRecovery = bindCanvasContextRecovery(game.canvas, {
      lost: () => { mainCanvasLost = true; game.loop.sleep(); },
      restored: () => {
        mainCanvasLost = false;
        try { scene.restoreCanvasPresentation(); }
        finally { frameBudget?.interact(); wakePresentationLoop(game); }
      },
      diagnose: code => { problemDiagnostics.event("render", code); problemDiagnostics.persist(true); },
    });
    const unbindMemory = problemDiagnostics.source("facilityMemory", () => ({
      ...facilityMemorySnapshot(scene.children?.list ?? [], game.textures.list),
      viewModels: scene.retainedViewModelCount(), canvasContextLost: mainCanvasLost,
      imageCache: Object.entries(mobileBitmapCache.health),
    }));
    const renderWatchdog = renderLoopWatchdog(
      () => !mainCanvasLost && document.visibilityState !== "hidden" && scene.sys.isActive() && !bridgeRef.current.mobilePresentation?.hidden,
      () => wakePresentationLoop(game), Date.now, () => ({ paused: game.isPaused, running: game.loop.running }));
    game.events.on(Phaser.Core.Events.POST_STEP, renderWatchdog.frame);
    const renderWatchdogTimer = window.setInterval(renderWatchdog.check, 1_000);
    const ownedCanvas = game.canvas;
    gameRef.current = game;
    let lastCameraLayoutSignature = "";
    let desktopResizing = false;
    let desktopSplitterHeld = false;
    let cameraSettleTimer: number | null = null;
    const reconcileCamera = () => {
      if (bridgeRef.current.mobileInput === true && bridgeRef.current.mobilePresentation?.hidden) return;
      if (scene.hasPendingCameraChange()) return;
      // Phaser may still be loading assets. Reconcile only after create/update
      // has run, using the current canvas size rather than a saved viewport.
      if (gameRef.current !== game || !scene.sys.isActive() ||
        host.clientWidth <= 0 || host.clientHeight <= 0) return;
      const model = bridgeRef.current.viewModel;
      if (!isValidFacilityCamera(model.camera)) return;
      if (bridgeRef.current.mobileInput !== true && (desktopResizing || desktopSplitterHeld)) return;
      // The scene has already normalized desktop pan against the frozen sizing
      // reference. Re-clamping against today's pane would undo the shade rule.
      const camera = bridgeRef.current.mobileInput === true
        ? clampFacilityCamera(model.camera, model, game.scale, true)
        : scene.getCameraPreference();
      if (!camera || bridgeRef.current.mobileInput !== true && !camera.desktopViewport) return;
      const founderRoom = model.rooms.find((room) => room.isFounderRoom);
      const signature = JSON.stringify([
        model.campaignId, model.gridColumns, model.gridRows,
        game.scale.width, game.scale.height,
        founderRoom?.tileX, founderRoom?.width,
        model.camera.zoom, model.camera.panX, model.camera.panY,
        facilityCameraSignature(camera),
      ]);
      if (signature === lastCameraLayoutSignature) return;
      lastCameraLayoutSignature = signature;
      if (facilityCameraSignature(camera) !== facilityCameraSignature(model.camera)) {
        bridgeRef.current.viewModel = { ...model, camera };
        scene.publishCameraChange(camera);
      }
    };
    const settleResizeCamera = () => {
      if (cameraSettleTimer !== null) window.clearTimeout(cameraSettleTimer);
      cameraSettleTimer = window.setTimeout(() => {
        cameraSettleTimer = null;
        if (desktopSplitterHeld) return;
        desktopResizing = false;
        reconcileCamera();
      }, DESKTOP_CAMERA_RESIZE_SETTLE_MS);
    };
    game.events.on(Phaser.Core.Events.POST_STEP, reconcileCamera);
    // Opt-in in development or a separately built QA production artifact.
    // It lets Playwright observe the *rendered Phaser actor* metadata without
    // adding a visible debug panel or making gameplay state inspectable.
    const gaitProofEnabled = facilityProofEnabled(import.meta.env.DEV,
      import.meta.env.VITE_FACILITY_PERF_PROOF === "1", window.location.search);
    const proofHost = host as HTMLDivElement & {
      __facilityGaitSnapshot?: () => unknown;
      __facilityGame?: Phaser.Game;
      __facilityProof?: { mode: "development" | "production"; readCounts: () => { canvasRenders: number; viewModelChanges: number } };
    };
    if (gaitProofEnabled) {
      proofHost.__facilityGame = game;
      proofHost.__facilityGaitSnapshot = () => scene.debugCharacterGaitSnapshot();
      proofHost.__facilityProof = { mode: import.meta.env.DEV ? "development" : "production",
        readCounts: () => ({ canvasRenders: proofCounts.current.canvasRenders, viewModelChanges: proofCounts.current.viewModelChanges }) };
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
      if (bridgeRef.current.mobileInput !== true) {
        desktopResizing = true;
        if (cameraSettleTimer !== null) window.clearTimeout(cameraSettleTimer);
      }
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
          frameBudget?.interact();
          if (bridgeRef.current.mobileInput !== true) {
            // The scene moves at the resize cadence; publish its small UI
            // preference once after the drag, not a parent render per move.
            settleResizeCamera();
          }
        }
      });
    });
    resizeObserver.observe(host);
    const flushResizeCamera = () => {
      if (!desktopResizing) return;
      if (cameraSettleTimer !== null) window.clearTimeout(cameraSettleTimer);
      cameraSettleTimer = null; desktopResizing = false; desktopSplitterHeld = false;
      reconcileCamera();
    };
    const flushCamera = () => { scene.cancelCameraGesture(); flushResizeCamera(); };
    const flushHiddenCamera = () => { if (document.visibilityState === "hidden") flushCamera(); };
    const flushBeforeAction = (event: Event) => {
      // A Save & Close/zoom/menu action must see the latest wheel preference,
      // even when clicked before the quiet-wheel timeout. Runs before React.
      if (event.target !== ownedCanvas) scene.cancelCameraGesture();
    };
    const beginSplitterResize = (event: PointerEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest(".workspace-splitter")) desktopSplitterHeld = true;
    };
    const finishSplitterResize = () => {
      if (!desktopSplitterHeld) return;
      desktopSplitterHeld = false;
      if (desktopResizing) settleResizeCamera();
    };
    const desktopLifecycle = bridgeRef.current.mobileInput !== true;
    // Publish before the session's bubble-phase storage flush on both layouts.
    window.addEventListener("pagehide", flushCamera, true);
    window.addEventListener("beforeunload", flushCamera, true);
    document.addEventListener("visibilitychange", flushHiddenCamera, true);
    window.addEventListener("pointerdown", flushBeforeAction, true);
    window.addEventListener("keydown", flushBeforeAction, true);
    window.addEventListener("pointercancel", flushCamera, true);
    window.addEventListener("blur", flushCamera);
    if (desktopLifecycle) {
      // Capture runs before the session's existing bubble-phase preference
      // flush, including an immediate reload before the 250ms settle timer.
      window.addEventListener("pointerdown", beginSplitterResize, true);
      window.addEventListener("pointerup", finishSplitterResize, true);
      window.addEventListener("pointercancel", finishSplitterResize, true);
      window.addEventListener("blur", finishSplitterResize);
    }

    const disconnectBitmapSource = bridgeRef.current.mobileInput === true ? mobileBitmapCache.connectSource(id => {
      const key = `stitchin-time-art:${id}`;
      if (!game.textures.exists(key)) return null;
      const image = game.textures.get(key).getSourceImage();
      return image && "naturalWidth" in image && image.naturalWidth > 0 ? image as HTMLImageElement : null;
    }) : () => {};

    return () => {
      flushCamera();
      disconnectBitmapSource();
      contextRecovery.dispose(); unbindMemory();
      frameBudget?.dispose();
      if (phoneFrames.current === frameBudget) phoneFrames.current = null;
      if (frameBudget) {
        game.events.off(Phaser.Core.Events.POST_STEP, frameBudget.frame);
        game.textures.off(Phaser.Textures.Events.ADD, frameBudget.interact);
        for (const event of ["pointerdown", "pointermove", "pointerup", "wheel"])
          game.canvas.removeEventListener(event, frameBudget.interact, true);
      }
      game.events.off(Phaser.Core.Events.POST_STEP, renderWatchdog.frame);
      window.clearInterval(renderWatchdogTimer); renderWatchdog.dispose();
      game.events.off(Phaser.Core.Events.POST_STEP, reconcileCamera);
      resizeObserver.disconnect();
      if (cameraSettleTimer !== null) window.clearTimeout(cameraSettleTimer);
      window.removeEventListener("pagehide", flushCamera, true);
      window.removeEventListener("beforeunload", flushCamera, true);
      document.removeEventListener("visibilitychange", flushHiddenCamera, true);
      window.removeEventListener("pointerdown", flushBeforeAction, true);
      window.removeEventListener("keydown", flushBeforeAction, true);
      window.removeEventListener("pointercancel", flushCamera, true);
      window.removeEventListener("blur", flushCamera);
      if (desktopLifecycle) {
        window.removeEventListener("pointerdown", beginSplitterResize, true);
        window.removeEventListener("pointerup", finishSplitterResize, true);
        window.removeEventListener("pointercancel", finishSplitterResize, true);
        window.removeEventListener("blur", finishSplitterResize);
      }
      if (resizeFrame !== null) {
        window.cancelAnimationFrame(resizeFrame);
      }
      if (gameRef.current === game) {
        gameRef.current = null;
      }
      if (proofHost.__facilityGame === game) {
        delete proofHost.__facilityGame;
        delete proofHost.__facilityGaitSnapshot;
        delete proofHost.__facilityProof;
      }
      game.destroy(true);
      // Phaser defers final destruction until its next step. A deliberately
      // sleeping phone must get that step so textures/listeners are released.
      if (game.isBooted && !game.loop.running) game.loop.wake();
      if (ownedCanvas.parentElement === host) {
        ownedCanvas.remove();
      }
    };
  }, [canvasNeeded]);

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
      data-phone-memory-mode={mobileInput === true ? phoneMemoryProfile().mode : undefined}
    >{mobileInput === true && (mobileMapCovered || mobilePageHidden) ? null : <ClinicMapPins pins={viewModel.alertPins ?? []} positions={alertPinPositions} onAction={onAlertPinAction} onPinElement={pinPositions.current.bind} />}</div>
  );
}
