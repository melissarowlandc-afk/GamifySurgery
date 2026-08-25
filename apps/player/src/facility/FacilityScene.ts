import Phaser from "phaser";
import type {
  CardinalDirection,
  GridPoint,
  PixelAppearanceDescriptor,
} from "@gamify-surgery/game-domain";

import type {
  FacilityCameraChangeRequest,
  FacilityCameraView,
  CollectLitterRequest,
  FacilityDoorView,
  FacilityDoorSlotView,
  FacilityPatientView,
  FacilityRoomView,
  FacilityViewModel,
  MoveFounderRequest,
  PlaceDoorRequest,
  PlaceRoomRequest,
  PraiseEmployeeRequest,
  RefillWaterCoolerRequest,
  RemoveDoorRequest,
  RequestRoomUpgrade,
  SelectRoomRequest,
} from "./types";
import {
  getCharacterPresentationMetrics,
} from "./characterPresentation";
import {
  getExposedHorizontalBoundaryRuns,
  getExposedNorthCornerReturns,
  getExposedVerticalBoundaryRuns,
  getRearWallFaceHeight,
  getVisibleRearWallArtworkFragments,
  isHorizontalBoundarySegmentExposed,
  projectRearWallArtwork,
  projectRearWallRun,
  type BoundaryRun,
  type PixelRectangle,
} from "./roomCutaway";
import {
  characterAppearanceSignature,
  getCharacterPixelFrame,
  type CharacterDirection,
  type CharacterPose,
} from "../art/characterArt";
import {
  FIXTURE_SPRITES,
  type FixtureId,
} from "../art/fixtureArt";
import type {
  PixelFrame,
  PixelSpriteAsset,
} from "../art/pixelArt";
import {
  PIXEL_PALETTE_NUMBER,
  type PixelColorKey,
} from "../art/pixelPalette";
import {
  FACILITY_DEPTH_BUILD_OVERLAY,
  FACILITY_DEPTH_FLOOR_INTERACTION,
  FACILITY_DEPTH_LOCATOR,
  FACILITY_DEPTH_UI,
  FACILITY_DEPTH_WORLD,
  getFacilitySceneDepth,
} from "./renderDepth";
import {
  advanceRouteMotion,
  getRouteTilesPerSecond,
  routeMotionComplete,
  sampleRouteMotion,
  syncRouteMotion,
  type RouteMotionTrack,
} from "./routeMotion";
import { getFixturePresentationSize } from "./fixturePresentation";
import {
  getCleanlinessWearSeverity,
  getEnvironmentalInteraction,
} from "./environmentPresentation";
import {
  containsDoorInteractionPoint,
  doorInteractionDistanceSquared,
  getDoorInteractionGeometry,
  type DoorInteractionGeometry,
} from "./doorInteractionGeometry";
import { rasterizeGridLine } from "./hallwayPainting";
import { getFacilityWorldSignature } from "./facilityWorldSignature";

export interface FacilitySceneBridge {
  viewModel: FacilityViewModel;
  onPlaceRoom: PlaceRoomRequest;
  onPlaceDoor?: PlaceDoorRequest;
  onRemoveDoor?: RemoveDoorRequest;
  onSelectRoom?: SelectRoomRequest;
  onRequestRoomUpgrade?: RequestRoomUpgrade;
  onCollectLitter?: CollectLitterRequest;
  onRefillWaterCooler?: RefillWaterCoolerRequest;
  onPraiseEmployee?: PraiseEmployeeRequest;
  onMoveFounder?: MoveFounderRequest;
  onCameraChange?: FacilityCameraChangeRequest;
}

interface GridLayout {
  originX: number;
  originY: number;
  tileSize: number;
  width: number;
  height: number;
  sidewalkTop: number;
  sidewalkHeight: number;
}

interface PlacementGhost {
  tileX: number;
  tileY: number;
  valid: boolean;
  invalidReason:
    | "outside-grid"
    | "overlap"
    | null;
}

type FacilityDoorInteractionTarget =
  | {
      kind: "place";
      slot: FacilityDoorSlotView;
      geometry: DoorInteractionGeometry;
    }
  | {
      kind: "remove";
      door: FacilityDoorView;
      geometry: DoorInteractionGeometry;
    };

interface TileRectangle {
  tileX: number;
  tileY: number;
  width: number;
  height: number;
}

const DEFAULT_VISIBLE_GRID_COLUMNS = 14;
const DEFAULT_VISIBLE_GRID_ROWS = 6;
const MINIMUM_CAMERA_ZOOM = 0.1;
const MAXIMUM_CAMERA_ZOOM = 2.5;
const FALLBACK_APPEARANCE: PixelAppearanceDescriptor = {
  version: "pixel-avatar.v1",
  bodyShape: "average",
  hairStyle: "short",
  skinTone: 1,
  hairShade: 3,
  faceStyle: "round",
  outfitStyle: "plain",
  outfitShade: 1,
  accessory: "none",
  headVariant: 0,
  bodyVariant: 0,
  roleStyle: "patient",
};

function positiveGridSize(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

function rectanglesOverlap(a: TileRectangle, b: TileRectangle): boolean {
  return (
    a.tileX < b.tileX + b.width &&
    a.tileX + a.width > b.tileX &&
    a.tileY < b.tileY + b.height &&
    a.tileY + a.height > b.tileY
  );
}

function intersectPixelRectangles(
  left: PixelRectangle,
  right: PixelRectangle,
): PixelRectangle | null {
  const x = Math.max(left.x, right.x);
  const y = Math.max(left.y, right.y);
  const rightEdge = Math.min(
    left.x + left.width,
    right.x + right.width,
  );
  const bottomEdge = Math.min(
    left.y + left.height,
    right.y + right.height,
  );
  if (rightEdge <= x || bottomEdge <= y) {
    return null;
  }
  return {
    x,
    y,
    width: rightEdge - x,
    height: bottomEdge - y,
  };
}

function orientedSize(
  item: Pick<FacilityRoomView, "width" | "height" | "orientation">,
): { width: number; height: number } {
  // The facility projection already contains the rotated footprint. Rotating
  // it again here made a 3x2 room render as 3x2 after a 90-degree rotation,
  // which made the Rotate control appear to do nothing.
  return { width: item.width, height: item.height };
}

function inferredPlacementDoorSide(
  placement: NonNullable<FacilityViewModel["placement"]>,
): CardinalDirection | null {
  // New rooms no longer receive an embedded door. Doors are placed as
  // separate zero-cost build objects after the room footprint is accepted.
  return placement.kind === "hallway" ? null : placement.doorSide ?? null;
}

/**
 * Phaser is a rendering and pointer-input adapter only. It never decides
 * whether a room is purchased, unlocked, or affordable.
 */
export class FacilityScene extends Phaser.Scene {
  private readonly bridge: FacilitySceneBridge;

  private worldGraphics?: Phaser.GameObjects.Graphics;
  private locatorGraphics?: Phaser.GameObjects.Graphics;
  private ghostGraphics?: Phaser.GameObjects.Graphics;
  private readonly fixtureGraphics = new Map<
    string,
    Phaser.GameObjects.Graphics
  >();
  private readonly characterGraphics = new Map<
    string,
    Phaser.GameObjects.Graphics
  >();
  private activeFixtureGraphics = new Set<string>();
  private activeCharacterGraphics = new Set<string>();
  private fixtureStableOrder = 0;
  private footerText?: Phaser.GameObjects.Text;
  private ghostStatusText?: Phaser.GameObjects.Text;
  private ghostDoorText?: Phaser.GameObjects.Text;
  private interactionHintText?: Phaser.GameObjects.Text;
  private founderActivityText?: Phaser.GameObjects.Text;
  private waterCoolerLabelText?: Phaser.GameObjects.Text;
  private litterHighlightText?: Phaser.GameObjects.Text;
  private roomTexts: Phaser.GameObjects.Text[] = [];

  private layout: GridLayout = {
    originX: 0,
    originY: 0,
    tileSize: 24,
    width: 16 * 24,
    height: 10 * 24,
    sidewalkTop: 10 * 24,
    sidewalkHeight: 24,
  };

  private placementGhost: PlacementGhost | null = null;
  private characterPhase = 0;
  private frameDeltaMilliseconds = 0;
  private readonly routeMotionTracks = new Map<string, RouteMotionTrack>();
  private readonly characterRenderCache = new WeakMap<
    Phaser.GameObjects.Graphics,
    { signature: string; width: number; height: number }
  >();
  private cameraView: FacilityCameraView = {
    zoom: 1,
    panX: 0,
    panY: 0,
  };
  private lastRequestedCameraSignature = "";
  private dragStart:
    | {
        pointerX: number;
        pointerY: number;
        panX: number;
        panY: number;
        dragged: boolean;
      }
    | null = null;
  private hallwayPaintActive = false;
  private hallwayPaintBlocked = false;
  private hallwayPaintLastPoint: GridPoint | null = null;
  private readonly hallwayPaintVisitedTiles = new Set<string>();
  private lastWidth = -1;
  private lastHeight = -1;
  private lastModelSignature = "";

  public constructor(bridge: FacilitySceneBridge) {
    super({ key: "facility-scene" });
    this.bridge = bridge;
  }

  public create(): void {
    this.cameras.main.setBackgroundColor("#7e8476");
    this.cameras.main.setRoundPixels(true);

    this.worldGraphics = this.add
      .graphics()
      .setDepth(FACILITY_DEPTH_WORLD);
    this.locatorGraphics = this.add
      .graphics()
      .setDepth(FACILITY_DEPTH_LOCATOR);
    this.ghostGraphics = this.add
      .graphics()
      .setDepth(FACILITY_DEPTH_BUILD_OVERLAY);

    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      color: "#232720",
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: "14px",
      fontStyle: "bold",
      resolution: 2,
    };

    this.footerText = this.add
      .text(0, 0, "", {
        ...textStyle,
        color: "#4c5449",
        fontSize: "12px",
      })
      .setOrigin(0.5, 0);
    this.footerText.setDepth(FACILITY_DEPTH_UI);

    this.ghostStatusText = this.add
      .text(0, 0, "", {
        ...textStyle,
        align: "center",
        backgroundColor: "#ffffff",
        color: "#232720",
        fontSize: "12px",
        padding: { x: 6, y: 4 },
      })
      .setOrigin(0.5, 1)
      .setDepth(FACILITY_DEPTH_UI)
      .setVisible(false);

    this.ghostDoorText = this.add
      .text(0, 0, "", {
        ...textStyle,
        align: "center",
        backgroundColor: "#232720",
        color: "#faf7e8",
        fontSize: "11px",
        padding: { x: 4, y: 2 },
      })
      .setOrigin(0.5)
      .setDepth(FACILITY_DEPTH_UI)
      .setVisible(false);

    this.interactionHintText = this.add
      .text(0, 0, "", {
        ...textStyle,
        align: "center",
        backgroundColor: "#f0f0ea",
        color: "#20282a",
        fontSize: "11px",
        padding: { x: 5, y: 3 },
      })
      .setOrigin(0.5, 1)
      .setDepth(FACILITY_DEPTH_UI)
      .setVisible(false);

    this.founderActivityText = this.add
      .text(0, 0, "", {
        ...textStyle,
        align: "center",
        backgroundColor: "#f0f0ea",
        color: "#20282a",
        fontSize: "10px",
        padding: { x: 4, y: 2 },
      })
      .setOrigin(0.5, 1)
      .setDepth(FACILITY_DEPTH_UI)
      .setVisible(false);

    this.waterCoolerLabelText = this.add
      .text(0, 0, "", {
        ...textStyle,
        align: "center",
        backgroundColor: "#20282a",
        color: "#f0f0ea",
        fontSize: "9px",
        padding: { x: 3, y: 1 },
      })
      .setOrigin(0.5, 1)
      .setDepth(FACILITY_DEPTH_UI)
      .setVisible(false);

    this.litterHighlightText = this.add
      .text(0, 0, "CLEAN", {
        ...textStyle,
        align: "center",
        backgroundColor: "#20282a",
        color: "#f0f0ea",
        fontSize: "9px",
        padding: { x: 3, y: 1 },
      })
      .setOrigin(0.5, 1)
      .setDepth(FACILITY_DEPTH_UI)
      .setVisible(false);

    this.input.on(
      "pointermove",
      (pointer: Phaser.Input.Pointer) => this.handlePointerMove(pointer),
    );
    this.input.on(
      "pointerdown",
      (pointer: Phaser.Input.Pointer) => this.handlePointerDown(pointer),
    );
    this.input.on(
      "pointerup",
      (pointer: Phaser.Input.Pointer) => this.handlePointerUp(pointer),
    );
    this.input.on(
      "wheel",
      (
        _pointer: Phaser.Input.Pointer,
        _objects: Phaser.GameObjects.GameObject[],
        _deltaX: number,
        deltaY: number,
      ) => this.handleWheel(deltaY),
    );
    this.input.on("gameout", () => {
      this.placementGhost = null;
      this.dragStart = null;
      this.endHallwayPaint();
      this.setInteractionHint(null);
      this.drawPlacementGhost();
    });

    this.refreshLayout(true);
  }

  public update(_time: number, delta: number): void {
    const motionFrozen =
      this.bridge.viewModel.paused ||
      Boolean(this.bridge.viewModel.buildMode);
    this.frameDeltaMilliseconds = motionFrozen ? 0 : delta;
    if (!motionFrozen) {
      // A restrained two-frame gait reads as walking rather than rapid sprite
      // flicker at the shared lower map speed.
      this.characterPhase += delta * 0.0025;
    }

    this.refreshLayout();
    this.drawCharacters();
  }

  private refreshLayout(force = false): void {
    const width = Math.max(1, Math.floor(this.scale.width));
    const height = Math.max(1, Math.floor(this.scale.height));
    const signature = getFacilityWorldSignature(this.bridge.viewModel);

    if (
      !force &&
      width === this.lastWidth &&
      height === this.lastHeight &&
      signature === this.lastModelSignature
    ) {
      return;
    }

    this.lastWidth = width;
    this.lastHeight = height;
    this.lastModelSignature = signature;
    this.layout = this.calculateLayout(width, height);

    if (!this.bridge.viewModel.placement) {
      this.placementGhost = null;
    } else if (this.placementGhost) {
      const evaluation = this.evaluatePlacement(
        this.placementGhost.tileX,
        this.placementGhost.tileY,
      );
      this.placementGhost = {
        ...this.placementGhost,
        ...evaluation,
      };
    }

    this.drawWorld();
    this.positionText();
    this.drawPlacementGhost();
  }

  private calculateLayout(width: number, height: number): GridLayout {
    const columns = positiveGridSize(this.bridge.viewModel.gridColumns, 16);
    const rows = positiveGridSize(this.bridge.viewModel.gridRows, 10);
    const sidewalkHeight = Math.max(
      20,
      Math.min(36, Math.floor(height * 0.08)),
    );
    const usableWidth = Math.max(1, width);
    const sidewalkTop = Math.max(1, height - sidewalkHeight);
    const usableHeight = sidewalkTop;
    const wallOverhangTiles = 0.78;
    const fullSiteTileSize = Math.max(
      1,
      Math.floor(
        Math.min(
          usableWidth / columns,
          usableHeight / (rows + wallOverhangTiles),
        ),
      ),
    );
    const workingTileSize = Math.max(
      fullSiteTileSize,
      Math.floor(
        Math.min(
          usableWidth /
            Math.min(columns, DEFAULT_VISIBLE_GRID_COLUMNS),
          usableHeight /
            (Math.min(rows, DEFAULT_VISIBLE_GRID_ROWS) +
              wallOverhangTiles),
        ),
      ),
    );
    const requestedCamera = this.bridge.viewModel.camera;
    const requestedCameraSignature = requestedCamera
      ? `${requestedCamera.zoom}:${requestedCamera.panX}:${requestedCamera.panY}`
      : "";
    if (
      requestedCamera &&
      requestedCameraSignature !== this.lastRequestedCameraSignature
    ) {
      this.cameraView = {
        zoom: Math.max(
          MINIMUM_CAMERA_ZOOM,
          Math.min(MAXIMUM_CAMERA_ZOOM, requestedCamera.zoom),
        ),
        panX: requestedCamera.panX,
        panY: requestedCamera.panY,
      };
      this.lastRequestedCameraSignature = requestedCameraSignature;
    }
    const normalizedZoom = Math.max(
      0,
      Math.min(
        1,
        (this.cameraView.zoom - MINIMUM_CAMERA_ZOOM) / 0.9,
      ),
    );
    const tileSize =
      this.cameraView.zoom <= 1
        ? Math.max(
            1,
            Math.round(
              fullSiteTileSize +
                (workingTileSize - fullSiteTileSize) *
                  normalizedZoom,
            ),
          )
        : Math.max(
            1,
            Math.round(workingTileSize * this.cameraView.zoom),
          );
    const gridWidth = tileSize * columns;
    const gridHeight = tileSize * rows;
    const founderRoom = this.getFounderRoom();
    const founderSize = founderRoom
      ? orientedSize(founderRoom)
      : undefined;
    const focusTileX = founderRoom
      ? founderRoom.tileX + (founderSize?.width ?? 0) / 2
      : columns / 2;
    const defaultOriginX = Math.floor(
      width / 2 - focusTileX * tileSize,
    );
    const defaultOriginY = sidewalkTop - gridHeight;
    const requestedOriginX = defaultOriginX + this.cameraView.panX;
    const requestedOriginY = defaultOriginY + this.cameraView.panY;
    const minimumOriginX = Math.min(0, width - gridWidth);
    const maximumOriginX = Math.max(0, width - gridWidth);
    const minimumOriginY = Math.min(0, usableHeight - gridHeight);
    const maximumOriginY = Math.max(0, usableHeight - gridHeight);

    return {
      originX: Math.max(
        minimumOriginX,
        Math.min(maximumOriginX, requestedOriginX),
      ),
      originY: Math.max(
        minimumOriginY,
        Math.min(maximumOriginY, requestedOriginY),
      ),
      tileSize,
      width: gridWidth,
      height: gridHeight,
      sidewalkTop,
      sidewalkHeight: height - sidewalkTop,
    };
  }

  private drawWorld(): void {
    const graphics = this.worldGraphics;
    if (!graphics) {
      return;
    }

    const { originX, originY, tileSize, width, height } = this.layout;
    const model = this.bridge.viewModel;
    const columns = positiveGridSize(model.gridColumns, 16);
    const rows = positiveGridSize(model.gridRows, 10);

    this.activeFixtureGraphics = new Set<string>();
    this.fixtureStableOrder = 0;

    graphics.clear();
    graphics.fillStyle(PIXEL_PALETTE_NUMBER.moss, 1);
    graphics.fillRect(0, 0, this.scale.width, this.scale.height);

    graphics.fillStyle(PIXEL_PALETTE_NUMBER.moss, 1);
    graphics.fillRect(originX, originY, width, height);
    graphics.fillStyle(PIXEL_PALETTE_NUMBER.olive, 0.28);
    const textureStep = Math.max(8, Math.floor(tileSize * 0.55));
    for (let y = originY + 3; y < originY + height; y += textureStep) {
      for (
        let x = originX + ((y / textureStep) % 2) * 4;
        x < originX + width;
        x += textureStep
      ) {
        graphics.fillRect(x, y, 2, 2);
      }
    }
    if (model.buildMode || model.placement) {
      graphics.lineStyle(2, PIXEL_PALETTE_NUMBER.ink, 1);
      graphics.strokeRect(originX, originY, width, height);
    }

    this.drawClinicGroundDetails(graphics);
    [...model.rooms]
      .sort(
        (left, right) =>
          left.tileY - right.tileY ||
          left.tileX - right.tileX ||
          left.instanceId.localeCompare(right.instanceId),
      )
      .forEach((room, index) => {
        this.drawRoom(graphics, room, index);
      });
    if (model.buildMode || model.placement) {
      this.drawBuildGridOverlay(graphics, columns, rows);
    }
    (model.doors ?? []).forEach((door) => {
      this.drawExplicitDoor(graphics, door);
    });
    this.drawBuildDoorHighlights(graphics);
    this.drawEnvironment();
    this.drawExterior(graphics);
    this.removeInactiveGraphics(
      this.fixtureGraphics,
      this.activeFixtureGraphics,
    );
  }

  private getSortableGraphics(
    collection: Map<string, Phaser.GameObjects.Graphics>,
    active: Set<string>,
    key: string,
  ): Phaser.GameObjects.Graphics {
    let graphics = collection.get(key);
    if (!graphics) {
      graphics = this.add.graphics();
      collection.set(key, graphics);
    }
    graphics.clear();
    graphics.setVisible(true);
    active.add(key);
    return graphics;
  }

  private removeInactiveGraphics(
    collection: Map<string, Phaser.GameObjects.Graphics>,
    active: ReadonlySet<string>,
  ): void {
    for (const [key, graphics] of collection) {
      if (!active.has(key)) {
        graphics.destroy();
        collection.delete(key);
      }
    }
  }

  private drawClinicGroundDetails(
    graphics: Phaser.GameObjects.Graphics,
  ): void {
    const rooms = this.bridge.viewModel.rooms.filter(
      (room) =>
        room.kind !== "hallway" && room.definitionId !== "room.hallway",
    );
    if (rooms.length === 0) {
      return;
    }
    const bounds = rooms.reduce(
      (result, room) => {
        const size = orientedSize(room);
        return {
          minimumX: Math.min(result.minimumX, room.tileX),
          minimumY: Math.min(result.minimumY, room.tileY),
          maximumX: Math.max(result.maximumX, room.tileX + size.width),
          maximumY: Math.max(result.maximumY, room.tileY + size.height),
        };
      },
      {
        minimumX: Number.POSITIVE_INFINITY,
        minimumY: Number.POSITIVE_INFINITY,
        maximumX: Number.NEGATIVE_INFINITY,
        maximumY: Number.NEGATIVE_INFINITY,
      },
    );
    const { tileSize, originX, originY } = this.layout;
    const alpha =
      this.bridge.viewModel.buildMode || this.bridge.viewModel.placement
        ? 0.38
        : 0.94;
    const left = originX + bounds.minimumX * tileSize;
    const right = originX + bounds.maximumX * tileSize;
    const top = originY + bounds.minimumY * tileSize;
    const bottom = originY + bounds.maximumY * tileSize;
    const clinicWidth = Math.max(tileSize, right - left);
    const clinicHeight = Math.max(tileSize, bottom - top);
    const landscape: Array<{
      id: FixtureId;
      x: number;
      y: number;
      width: number;
      height: number;
    }> = [];

    // Deliberately irregular, deterministic anchors keep landscaping from
    // reading as vertical crop rows while remaining stable across reloads.
    const northAnchors = [
      [0.04, -0.38, "bushCluster", 1],
      [0.19, -0.52, "flowerBed", 0.88],
      [0.37, -0.34, "bushCluster", 1.08],
      [0.61, -0.49, "stonePlanter", 0.84],
      [0.78, -0.31, "bushCluster", 0.98],
      [0.94, -0.46, "flowerBed", 0.9],
    ] as const;
    for (const [xRatio, yOffset, id, scale] of northAnchors) {
      landscape.push({
        id,
        x: left + clinicWidth * xRatio,
        y: top + tileSize * yOffset,
        width: Math.max(34, tileSize * 1.08 * scale),
        height: Math.max(14, tileSize * 0.46 * scale),
      });
    }

    const sideAnchors = [
      [-0.72, 0.12, "shadeTree", 1.08],
      [-0.54, 0.39, "bushCluster", 0.96],
      [-0.78, 0.72, "flowerBed", 0.9],
      [-0.59, 0.91, "stonePlanter", 0.82],
      [0.68, 0.2, "bushCluster", 0.92],
      [0.83, 0.48, "shadeTree", 1.02],
      [0.56, 0.77, "flowerBed", 0.86],
      [0.76, 0.94, "bushCluster", 0.98],
    ] as const;
    for (const [xOffset, yRatio, id, scale] of sideAnchors) {
      const onLeft = xOffset < 0;
      landscape.push({
        id,
        x: onLeft
          ? left + tileSize * xOffset
          : right + tileSize * xOffset,
        y: top + clinicHeight * yRatio,
        width:
          id === "shadeTree"
            ? Math.max(44, tileSize * 1.2 * scale)
            : Math.max(34, tileSize * 1.05 * scale),
        height:
          id === "shadeTree"
            ? Math.max(34, tileSize * 1.02 * scale)
            : Math.max(14, tileSize * 0.46 * scale),
      });
    }

    const southAnchors = [
      [0.08, 0.09, "flowerBed", 0.9],
      [0.3, 0.18, "bushCluster", 0.98],
      [0.67, 0.08, "stonePlanter", 0.84],
      [0.88, 0.2, "flowerBed", 0.92],
    ] as const;
    for (const [xRatio, yOffset, id, scale] of southAnchors) {
      landscape.push({
        id,
        x: left + clinicWidth * xRatio,
        y: bottom + tileSize * yOffset,
        width: Math.max(34, tileSize * 1.06 * scale),
        height: Math.max(13, tileSize * 0.42 * scale),
      });
    }

    for (const item of landscape) {
      this.drawFixture(
        graphics,
        item.id,
        item.x,
        item.y,
        item.width,
        item.height,
        alpha,
      );
    }
  }

  private drawEnvironment(): void {
    const pixel = Math.max(1, Math.floor(this.layout.tileSize / 14));
    this.litterHighlightText?.setVisible(false);
    for (const litter of this.bridge.viewModel.litterItems ?? []) {
      const x =
        this.layout.originX +
        (litter.location.x + 0.5) * this.layout.tileSize;
      const y =
        this.layout.originY +
        (litter.location.y + 0.65) * this.layout.tileSize;
      const litterGraphics = this.getSortableGraphics(
        this.fixtureGraphics,
        this.activeFixtureGraphics,
        `environment:litter:${litter.instanceId}`,
      );
      // Litter is a tiny direct-click interaction. Keeping it in a dedicated
      // foreground world band prevents room furniture whose sprite projects
      // across this tile from concealing it. The logical grid location and
      // pointer hit test remain unchanged.
      litterGraphics.setDepth(FACILITY_DEPTH_FLOOR_INTERACTION);
      this.drawFixture(
        litterGraphics,
        "litter",
        x,
        y,
        Math.max(12, this.layout.tileSize * 0.36),
        Math.max(8, this.layout.tileSize * 0.24),
      );
      if (litter.highlighted) {
        const outlineWidth = Math.max(2, pixel);
        const highlightWidth = Math.max(
          18,
          this.layout.tileSize * 0.54,
        );
        const highlightHeight = Math.max(
          14,
          this.layout.tileSize * 0.42,
        );
        litterGraphics.lineStyle(
          outlineWidth,
          PIXEL_PALETTE_NUMBER.highlight,
          1,
        );
        litterGraphics.strokeRect(
          x - highlightWidth / 2,
          y - highlightHeight / 2,
          highlightWidth,
          highlightHeight,
        );
        litterGraphics.lineStyle(
          Math.max(1, outlineWidth - 1),
          PIXEL_PALETTE_NUMBER.charcoal,
          1,
        );
        litterGraphics.strokeRect(
          x - highlightWidth / 2 - outlineWidth * 2,
          y - highlightHeight / 2 - outlineWidth * 2,
          highlightWidth + outlineWidth * 4,
          highlightHeight + outlineWidth * 4,
        );
        this.litterHighlightText
          ?.setPosition(
            x,
            y - highlightHeight / 2 - Math.max(3, pixel),
          )
          .setVisible(true);
      }
    }
    const cooler = this.bridge.viewModel.waterCooler;
    if (!cooler) {
      this.waterCoolerLabelText?.setVisible(false);
      return;
    }
    const x =
      this.layout.originX +
      (cooler.location.x + 0.5) * this.layout.tileSize;
    const y =
      this.layout.originY +
      (cooler.location.y + 0.72) * this.layout.tileSize;
    const maximumWidth = Math.max(16, this.layout.tileSize * 0.42);
    const maximumHeight = Math.max(24, this.layout.tileSize * 0.68);
    const coolerCenterY = y - pixel * 3;
    const coolerSprite = FIXTURE_SPRITES.waterCooler;
    const coolerScale = Math.max(
      1,
      Math.round(
        Math.min(
          maximumWidth / coolerSprite.width,
          maximumHeight / coolerSprite.height,
        ),
      ),
    );
    const coolerGraphics = this.getSortableGraphics(
      this.fixtureGraphics,
      this.activeFixtureGraphics,
      "environment:water-cooler",
    );
    coolerGraphics.setDepth(
      getFacilitySceneDepth(
        coolerCenterY + (coolerSprite.height * coolerScale) / 2,
        "fixture",
        this.fixtureStableOrder % 64,
      ),
    );
    this.fixtureStableOrder += 1;
    this.drawFixture(
      coolerGraphics,
      "waterCooler",
      x,
      coolerCenterY,
      maximumWidth,
      maximumHeight,
    );
    const fillHeight = Math.round(
      (pixel * 5 * cooler.fillPercent) / 100,
    );
    coolerGraphics.fillStyle(
      cooler.needsRefill
        ? PIXEL_PALETTE_NUMBER.warmGray
        : PIXEL_PALETTE_NUMBER.sage,
      1,
    );
    coolerGraphics.fillRect(
      x - pixel,
      y - pixel * 7 + (pixel * 5 - fillHeight),
      pixel * 2,
      fillHeight,
    );
    if (cooler.highlighted || cooler.needsRefill) {
      const outlineWidth = Math.max(2, pixel);
      const outlineColor = cooler.highlighted
        ? PIXEL_PALETTE_NUMBER.highlight
        : PIXEL_PALETTE_NUMBER.charcoal;
      coolerGraphics.lineStyle(outlineWidth, outlineColor, 1);
      coolerGraphics.strokeRect(
        x - maximumWidth / 2 - outlineWidth * 2,
        coolerCenterY - maximumHeight / 2 - outlineWidth * 2,
        maximumWidth + outlineWidth * 4,
        maximumHeight + outlineWidth * 4,
      );
      if (cooler.highlighted) {
        coolerGraphics.lineStyle(
          Math.max(1, outlineWidth - 1),
          PIXEL_PALETTE_NUMBER.charcoal,
          1,
        );
        coolerGraphics.strokeRect(
          x - maximumWidth / 2 - outlineWidth * 4,
          coolerCenterY - maximumHeight / 2 - outlineWidth * 4,
          maximumWidth + outlineWidth * 8,
          maximumHeight + outlineWidth * 8,
        );
      }
    }
    this.waterCoolerLabelText
      ?.setText(cooler.needsRefill ? "REFILL" : "WATER COOLER")
      .setPosition(
        x,
        coolerCenterY - maximumHeight / 2 - Math.max(3, pixel),
      )
      .setVisible(Boolean(cooler.highlighted || cooler.needsRefill));
  }

  private drawRoom(
    graphics: Phaser.GameObjects.Graphics,
    room: FacilityRoomView,
    index: number,
  ): void {
    const oriented = orientedSize(room);
    const rectangle = this.toPixels({
      tileX: room.tileX,
      tileY: room.tileY,
      ...oriented,
    });
    if (room.kind === "hallway" || room.definitionId === "room.hallway") {
      // Corridors remain open circulation floors. Only an actually northmost
      // corridor edge receives the same shallow cutaway wall as a room.
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.shadow, 0.34);
      graphics.fillRect(
        rectangle.x + 3,
        rectangle.y + 5,
        rectangle.width,
        rectangle.height,
      );
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.paper, 1);
      graphics.fillRect(
        rectangle.x,
        rectangle.y,
        rectangle.width,
        rectangle.height,
      );
      const plankHeight = Math.max(
        7,
        Math.floor(this.layout.tileSize * 0.42),
      );
      graphics.lineStyle(1, PIXEL_PALETTE_NUMBER.sage, 0.34);
      for (
        let y = rectangle.y + plankHeight;
        y < rectangle.y + rectangle.height;
        y += plankHeight
      ) {
        graphics.lineBetween(
          rectangle.x + 2,
          y,
          rectangle.x + rectangle.width - 2,
          y,
        );
        const row = Math.floor((y - rectangle.y) / plankHeight);
        const seamOffset = row % 2 === 0 ? 0.35 : 0.72;
        const seamX = rectangle.x + rectangle.width * seamOffset;
        graphics.lineBetween(
          seamX,
          y - plankHeight + 1,
          seamX,
          y - 1,
        );
      }
      const wallWidth = Math.max(
        4,
        Math.floor(this.layout.tileSize * 0.16),
      );
      const lowWallWidth = Math.max(3, Math.floor(wallWidth * 0.62));
      const wallFace = this.roomWallFaceColor(room);
      this.drawExteriorSideWalls(
        graphics,
        room,
        rectangle,
        wallFace,
        lowWallWidth,
      );
      this.drawExposedRearWalls(
        graphics,
        room,
        rectangle,
        wallWidth,
        wallFace,
        lowWallWidth,
      );
      this.drawCoveredNorthBoundarySeams(graphics, room, rectangle);

      const curb = Math.max(2, Math.floor(this.layout.tileSize * 0.07));
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.deepOlive, 0.72);
      for (const run of this.exposedBoundaryRuns(room, "south")) {
        const x = rectangle.x + run.offset * this.layout.tileSize;
        graphics.fillRect(
          x,
          rectangle.y + rectangle.height - curb,
          Math.min(
            rectangle.x + rectangle.width - x,
            run.length * this.layout.tileSize,
          ),
          curb,
        );
      }
      return;
    }
    const shade = this.roomFloorColor(room, index);
    const furnitureInset = Math.max(
      5,
      Math.floor(this.layout.tileSize * 0.14),
    );

    graphics.fillStyle(PIXEL_PALETTE_NUMBER.shadow, 0.58);
    graphics.fillRect(
      rectangle.x + 5,
      rectangle.y + 6,
      rectangle.width,
      rectangle.height,
    );
    graphics.fillStyle(shade, 1);
    graphics.fillRect(
      rectangle.x,
      rectangle.y,
      rectangle.width,
      rectangle.height,
    );
    this.drawRoomFloor(graphics, room, rectangle, shade);
    this.drawCleanlinessWear(graphics, room, rectangle);
    this.drawRoomUpgradeFinish(graphics, room, rectangle);
    const wallWidth = Math.max(
      4,
      Math.floor(this.layout.tileSize * 0.16),
    );
    this.drawRoomShell(graphics, room, rectangle, wallWidth);

    this.drawRoomFixtures(graphics, room, rectangle, furnitureInset);

    if (room.instanceId === this.bridge.viewModel.selectedRoomInstanceId) {
      const inset = Math.max(3, Math.floor(this.layout.tileSize * 0.12));
      graphics.lineStyle(2, 0xffffff, 1);
      graphics.strokeRect(
        rectangle.x + inset,
        rectangle.y + inset,
        rectangle.width - inset * 2,
        rectangle.height - inset * 2,
      );
      graphics.lineStyle(1, 0x111111, 1);
      graphics.strokeRect(
        rectangle.x + inset + 2,
        rectangle.y + inset + 2,
        rectangle.width - inset * 2 - 4,
        rectangle.height - inset * 2 - 4,
      );
    }
  }

  private roomFloorColor(
    room: FacilityRoomView,
    index = 0,
  ): number {
    switch (room.definitionId) {
      case "room.front_desk":
        return PIXEL_PALETTE_NUMBER.cream;
      case "room.waiting":
        return PIXEL_PALETTE_NUMBER.paper;
      case "room.bathroom":
        return PIXEL_PALETTE_NUMBER.paper;
      case "room.xray":
        return PIXEL_PALETTE_NUMBER.lightSage;
      case "room.imaging_control":
        return PIXEL_PALETTE_NUMBER.warmGray;
      case "room.minor_procedure":
      case "room.examination":
        return PIXEL_PALETTE_NUMBER.cream;
      default:
        return room.isFounderRoom || index % 2 === 0
          ? PIXEL_PALETTE_NUMBER.cream
          : PIXEL_PALETTE_NUMBER.paper;
    }
  }

  private drawCleanlinessWear(
    graphics: Phaser.GameObjects.Graphics,
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
  ): void {
    const severity = getCleanlinessWearSeverity(room.cleanliness);
    if (severity === 0) {
      return;
    }

    // A dirty room should read as a slightly neglected environment, not as a
    // new resource overlay. Sparse scuffs become more visible as cleanliness
    // falls while keeping furniture, paths, and click targets unobscured.
    const markCount = Math.max(2, Math.round(2 + severity * 7));
    const inset = Math.max(6, Math.floor(this.layout.tileSize * 0.18));
    const usableWidth = Math.max(1, rectangle.width - inset * 2);
    const usableHeight = Math.max(1, rectangle.height - inset * 2);
    graphics.fillStyle(
      PIXEL_PALETTE_NUMBER.charcoal,
      0.08 + severity * 0.12,
    );
    for (let index = 0; index < markCount; index += 1) {
      const xSeed =
        room.tileX * 17 + room.tileY * 31 + index * 43 + 11;
      const ySeed =
        room.tileX * 29 + room.tileY * 13 + index * 37 + 7;
      const x =
        rectangle.x + inset + ((xSeed % 97) / 97) * usableWidth;
      const y =
        rectangle.y + inset + ((ySeed % 89) / 89) * usableHeight;
      const width = Math.max(
        2,
        Math.floor(this.layout.tileSize * (0.06 + (index % 3) * 0.025)),
      );
      graphics.fillRect(Math.round(x), Math.round(y), width, 1);
      if (index % 3 === 0) {
        graphics.fillRect(Math.round(x + width / 2), Math.round(y - 1), 1, 3);
      }
    }
  }

  private drawRoomUpgradeFinish(
    graphics: Phaser.GameObjects.Graphics,
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
  ): void {
    const tier = Math.max(1, Math.min(5, room.upgradeLevel ?? 1));
    if (tier < 2) {
      return;
    }
    const inset = Math.max(5, Math.floor(this.layout.tileSize * 0.14));
    const secondInset = inset + Math.max(3, Math.floor(inset * 0.55));

    // Upgraded rooms receive a cleaner perimeter inlay and brighter finished
    // edges. The footprint and walkable grid stay unchanged.
    graphics.lineStyle(2, PIXEL_PALETTE_NUMBER.highlight, 0.42);
    graphics.strokeRect(
      rectangle.x + inset,
      rectangle.y + inset,
      Math.max(1, rectangle.width - inset * 2),
      Math.max(1, rectangle.height - inset * 2),
    );
    graphics.lineStyle(1, PIXEL_PALETTE_NUMBER.sage, 0.46);
    graphics.strokeRect(
      rectangle.x + secondInset,
      rectangle.y + secondInset,
      Math.max(1, rectangle.width - secondInset * 2),
      Math.max(1, rectangle.height - secondInset * 2),
    );

    if (tier >= 3) {
      const corner = Math.max(5, Math.floor(this.layout.tileSize * 0.18));
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.deepOlive, 0.28);
      const corners: Array<readonly [number, number]> = [
        [rectangle.x + secondInset, rectangle.y + secondInset],
        [
          rectangle.x + rectangle.width - secondInset - corner,
          rectangle.y + secondInset,
        ],
        [
          rectangle.x + secondInset,
          rectangle.y + rectangle.height - secondInset - corner,
        ],
        [
          rectangle.x + rectangle.width - secondInset - corner,
          rectangle.y + rectangle.height - secondInset - corner,
        ],
      ];
      for (const [x, y] of corners) {
        graphics.fillRect(x, y, corner, 2);
        graphics.fillRect(x, y, 2, corner);
      }
    }
  }

  private roomWallFaceHeight(rectangle: {
    height: number;
  }): number {
    return getRearWallFaceHeight(
      rectangle.height,
      this.layout.tileSize,
    );
  }

  private exposedBoundaryRuns(
    room: FacilityRoomView,
    side: "north" | "south",
  ): BoundaryRun[] {
    return getExposedHorizontalBoundaryRuns(
      room,
      this.bridge.viewModel.rooms,
      side,
    );
  }

  private hasExposedNorthWallAt(
    room: FacilityRoomView,
    offset: number,
  ): boolean {
    return isHorizontalBoundarySegmentExposed(
      room,
      this.bridge.viewModel.rooms,
      "north",
      offset,
    );
  }

  private drawExplicitDoor(
    graphics: Phaser.GameObjects.Graphics,
    door: FacilityDoorView,
  ): void {
    if (door.exterior) {
      return;
    }
    const room = this.bridge.viewModel.rooms.find(
      (candidate) => candidate.instanceId === door.roomInstanceId,
    );
    if (!room) {
      return;
    }
    const rectangle = this.toPixels({
      tileX: room.tileX,
      tileY: room.tileY,
      ...orientedSize(room),
    });
    const slotCenter =
      (door.offset + 0.5) * this.layout.tileSize;
    const opening = Math.max(
      7,
      Math.min(this.layout.tileSize - 2, this.layout.tileSize * 0.65),
    );
    const half = opening / 2;
    const frameWidth = Math.max(
      2,
      Math.floor(this.layout.tileSize * 0.08),
    );
    const wallWidth = Math.max(
      4,
      Math.floor(this.layout.tileSize * 0.16),
    );
    const floorColor = this.roomFloorColor(room);

    if (
      door.side === "north" &&
      !this.hasExposedNorthWallAt(room, door.offset)
    ) {
      const edgeY = rectangle.y;
      const left = rectangle.x + slotCenter - half;
      const right = rectangle.x + slotCenter + half;

      // A north door between two adjacent rooms is a grounded threshold in
      // one continuous floor plane. It must not float in a dollhouse wall
      // face that no longer exists at this interior boundary.
      graphics.lineStyle(wallWidth + 3, floorColor, 1);
      graphics.lineBetween(left, edgeY, right, edgeY);
      graphics.lineStyle(2, PIXEL_PALETTE_NUMBER.paper, 1);
      graphics.lineBetween(left, edgeY, right, edgeY);
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.ink, 1);
      graphics.fillRect(
        left - frameWidth,
        edgeY - frameWidth * 2,
        frameWidth,
        frameWidth * 4,
      );
      graphics.fillRect(
        right,
        edgeY - frameWidth * 2,
        frameWidth,
        frameWidth * 4,
      );
      return;
    }

    if (door.side === "north") {
      const wallHeight = this.roomWallFaceHeight(rectangle);
      const groundY = rectangle.y;
      const openingHeight = Math.max(
        8,
        wallHeight - Math.max(3, Math.floor(wallWidth * 0.5)),
      );
      const left = rectangle.x + slotCenter - half;
      const right = rectangle.x + slotCenter + half;
      const top = groundY - openingHeight;

      // An upright opening is cut into the visible rear wall. Its sill is the
      // wall/floor contact line; nothing hangs from the top edge of the room.
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.shadow, 1);
      graphics.fillRect(left, top, opening, openingHeight);
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.charcoal, 0.72);
      graphics.fillRect(
        left + frameWidth,
        top + frameWidth,
        Math.max(1, opening - frameWidth * 2),
        Math.max(1, openingHeight - frameWidth),
      );
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.ink, 1);
      graphics.fillRect(left - frameWidth, top, frameWidth, openingHeight + 2);
      graphics.fillRect(right, top, frameWidth, openingHeight + 2);
      graphics.fillRect(
        left - frameWidth,
        top - frameWidth,
        opening + frameWidth * 2,
        frameWidth,
      );
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.paper, 1);
      graphics.fillRect(left, groundY - 1, opening, 3);

      return;
    }

    if (door.side === "south") {
      const edgeY = rectangle.y + rectangle.height;
      const left = rectangle.x + slotCenter - half;
      const right = rectangle.x + slotCenter + half;
      graphics.lineStyle(wallWidth + 3, floorColor, 1);
      graphics.lineBetween(left, edgeY, right, edgeY);
      graphics.lineStyle(2, PIXEL_PALETTE_NUMBER.paper, 1);
      graphics.lineBetween(left, edgeY, right, edgeY);
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.ink, 1);
      graphics.fillRect(
        left - frameWidth,
        edgeY - frameWidth * 2,
        frameWidth,
        frameWidth * 4,
      );
      graphics.fillRect(
        right,
        edgeY - frameWidth * 2,
        frameWidth,
        frameWidth * 4,
      );
      return;
    }

    const edgeX =
      door.side === "west"
        ? rectangle.x
        : rectangle.x + rectangle.width;
    const centerY = rectangle.y + slotCenter;
    const top = centerY - half;
    const bottom = centerY + half;
    graphics.lineStyle(wallWidth + 3, floorColor, 1);
    graphics.lineBetween(edgeX, top, edgeX, bottom);
    graphics.lineStyle(2, PIXEL_PALETTE_NUMBER.paper, 1);
    graphics.lineBetween(edgeX, top, edgeX, bottom);
    graphics.fillStyle(PIXEL_PALETTE_NUMBER.ink, 1);
    graphics.fillRect(
      edgeX - frameWidth * 2,
      top - frameWidth,
      frameWidth * 4,
      frameWidth,
    );
    graphics.fillRect(
      edgeX - frameWidth * 2,
      bottom,
      frameWidth * 4,
      frameWidth,
    );
  }

  private getDoorGeometry(
    room: FacilityRoomView,
    side: CardinalDirection,
    offset: number,
  ): DoorInteractionGeometry {
    const rectangle = this.toPixels({
      tileX: room.tileX,
      tileY: room.tileY,
      ...orientedSize(room),
    });
    return getDoorInteractionGeometry({
      room: rectangle,
      side,
      offset,
      tileSize: this.layout.tileSize,
      exposedNorthWall:
        side === "north" &&
        this.hasExposedNorthWallAt(room, offset),
      northWallHeight: this.roomWallFaceHeight(rectangle),
    });
  }

  private getBuildDoorInteractionTargets(): FacilityDoorInteractionTarget[] {
    const model = this.bridge.viewModel;
    if (!model.buildMode || !model.buildDoorTool) {
      return [];
    }
    if (model.buildDoorTool === "place") {
      return (
        model.buildDoorSlots ??
        model.eligibleDoorSlots ??
        []
      ).flatMap((slot) => {
        if (slot.enabled === false) {
          return [];
        }
        const room = model.rooms.find(
          (candidate) => candidate.instanceId === slot.roomInstanceId,
        );
        return room
          ? [
              {
                kind: "place" as const,
                slot,
                geometry: this.getDoorGeometry(
                  room,
                  slot.side,
                  slot.offset,
                ),
              },
            ]
          : [];
      });
    }
    return (model.doors ?? []).flatMap((door) => {
      // The public entrance is immutable in the domain and never becomes a
      // pointer target, even while the remove tool is active.
      if (door.exterior) {
        return [];
      }
      const room = model.rooms.find(
        (candidate) => candidate.instanceId === door.roomInstanceId,
      );
      return room
        ? [
            {
              kind: "remove" as const,
              door,
              geometry: this.getDoorGeometry(
                room,
                door.side,
                door.offset,
              ),
            },
          ]
        : [];
    });
  }

  private drawBuildDoorHighlights(
    graphics: Phaser.GameObjects.Graphics,
  ): void {
    const targets = this.getBuildDoorInteractionTargets();
    targets.forEach((target) => {
      const { hitRegion, center, horizontal } = target.geometry;
      const place = target.kind === "place";
      const outerColor = place
        ? PIXEL_PALETTE_NUMBER.highlight
        : PIXEL_PALETTE_NUMBER.ink;
      const innerColor = place
        ? PIXEL_PALETTE_NUMBER.ink
        : PIXEL_PALETTE_NUMBER.paper;
      graphics.fillStyle(outerColor, place ? 0.26 : 0.4);
      graphics.fillRect(
        hitRegion.x,
        hitRegion.y,
        hitRegion.width,
        hitRegion.height,
      );
      graphics.lineStyle(3, outerColor, 1);
      graphics.strokeRect(
        hitRegion.x,
        hitRegion.y,
        hitRegion.width,
        hitRegion.height,
      );
      graphics.lineStyle(1, innerColor, 1);
      graphics.strokeRect(
        hitRegion.x + 2,
        hitRegion.y + 2,
        Math.max(1, hitRegion.width - 4),
        Math.max(1, hitRegion.height - 4),
      );

      // A short crossbar makes the emphasized segment legible as a wall
      // opening at low zoom without adding any textual wall-position picker.
      const crossbar = Math.max(3, Math.min(9, this.layout.tileSize * 0.22));
      graphics.lineStyle(2, innerColor, 1);
      if (horizontal) {
        graphics.lineBetween(
          center.x - crossbar,
          center.y,
          center.x + crossbar,
          center.y,
        );
      } else {
        graphics.lineBetween(
          center.x,
          center.y - crossbar,
          center.x,
          center.y + crossbar,
        );
      }
    });
  }

  private doorInteractionAtPointer(
    pointer: Phaser.Input.Pointer,
  ): FacilityDoorInteractionTarget | null {
    const point = { x: pointer.x, y: pointer.y };
    return (
      this.getBuildDoorInteractionTargets()
        .filter((target) =>
          containsDoorInteractionPoint(target.geometry, point),
        )
        .sort(
          (left, right) =>
            doorInteractionDistanceSquared(left.geometry, point) -
            doorInteractionDistanceSquared(right.geometry, point),
        )[0] ?? null
    );
  }

  private drawRoomFloor(
    graphics: Phaser.GameObjects.Graphics,
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
    shade: number,
  ): void {
    const inset = Math.max(3, Math.floor(this.layout.tileSize * 0.09));
    const left = rectangle.x + inset;
    const top = rectangle.y + inset;
    const right = rectangle.x + rectangle.width - inset;
    const bottom = rectangle.y + rectangle.height - inset;
    const width = Math.max(1, right - left);
    const height = Math.max(1, bottom - top);

    const base =
      room.definitionId === "room.xray"
        ? PIXEL_PALETTE_NUMBER.lightSage
        : room.definitionId === "room.imaging_control"
          ? PIXEL_PALETTE_NUMBER.warmGray
          : room.definitionId === "room.bathroom"
            ? PIXEL_PALETTE_NUMBER.paper
            : shade;
    graphics.fillStyle(base, 1);
    graphics.fillRect(left, top, width, height);

    if (room.definitionId === "room.front_desk") {
      // Wide commercial planks: broad horizontal joints with staggered seams.
      const plank = Math.max(9, Math.floor(this.layout.tileSize * 0.58));
      graphics.lineStyle(1, PIXEL_PALETTE_NUMBER.sage, 0.34);
      for (let y = top + plank; y < bottom; y += plank) {
        graphics.lineBetween(left, y, right, y);
        const row = Math.floor((y - top) / plank);
        const seamX = left + width * (row % 2 === 0 ? 0.32 : 0.68);
        graphics.lineBetween(seamX, y - plank + 1, seamX, y - 1);
      }
      return;
    }

    if (room.definitionId === "room.waiting") {
      // Broad terrazzo chips deliberately avoid construction-grid rhythm.
      const step = Math.max(8, Math.floor(this.layout.tileSize * 0.44));
      for (let y = top + 5; y < bottom - 2; y += step) {
        for (let x = left + 5; x < right - 2; x += step) {
          const offset = (Math.floor((y - top) / step) % 2) * 3;
          graphics.fillStyle(PIXEL_PALETTE_NUMBER.sage, 0.38);
          graphics.fillRect(x + offset, y, 2, 1);
          graphics.fillStyle(PIXEL_PALETTE_NUMBER.deepOlive, 0.2);
          graphics.fillRect(x + 3 - offset, y + 3, 1, 2);
        }
      }
      return;
    }

    if (room.definitionId === "room.bathroom") {
      // Small waterproof tile with staggered vertical joints.
      const tile = Math.max(6, Math.floor(this.layout.tileSize * 0.34));
      graphics.lineStyle(1, PIXEL_PALETTE_NUMBER.sage, 0.42);
      for (let y = top + tile; y < bottom; y += tile) {
        graphics.lineBetween(left, y, right, y);
        const row = Math.floor((y - top) / tile);
        for (
          let x = left + (row % 2 === 0 ? tile : tile / 2);
          x < right;
          x += tile
        ) {
          graphics.lineBetween(x, y - tile, x, y);
        }
      }
      return;
    }

    if (
      room.definitionId === "room.xray" ||
      room.definitionId === "room.imaging_control"
    ) {
      // Darker anti-static sheet flooring with sparse welded seams.
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.deepOlive, 0.09);
      const band = Math.max(12, Math.floor(this.layout.tileSize * 0.78));
      for (let y = top + band; y < bottom; y += band) {
        graphics.fillRect(left, y, width, 2);
      }
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.highlight, 0.18);
      for (let x = left + 7; x < right; x += band + 5) {
        graphics.fillRect(x, top + 4, 1, Math.max(1, height - 8));
      }
      return;
    }

    // Examination and procedure rooms use seamless speckled clinical vinyl.
    const speckle = Math.max(7, Math.floor(this.layout.tileSize * 0.38));
    for (let y = top + 5; y < bottom - 2; y += speckle) {
      for (let x = left + 6; x < right - 2; x += speckle + 2) {
        graphics.fillStyle(PIXEL_PALETTE_NUMBER.sage, 0.24);
        graphics.fillRect(
          x + (Math.floor(y / speckle) % 2) * 3,
          y,
          1,
          1,
        );
      }
    }
  }

  private roomWallFaceColor(room: FacilityRoomView): number {
    if (
      room.definitionId === "room.xray" ||
      room.definitionId === "room.imaging_control"
    ) {
      return PIXEL_PALETTE_NUMBER.sage;
    }
    return room.isFounderRoom
      ? PIXEL_PALETTE_NUMBER.paper
      : PIXEL_PALETTE_NUMBER.warmGray;
  }

  private northCornerShoulderWidth(wallWidth: number): number {
    return Math.max(
      wallWidth + 3,
      Math.floor(this.layout.tileSize * 0.22),
    );
  }

  private drawExteriorSideWalls(
    graphics: Phaser.GameObjects.Graphics,
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
    wallFace: number,
    lowWallWidth: number,
  ): void {
    for (const side of ["west", "east"] as const) {
      const runs = getExposedVerticalBoundaryRuns(
        room,
        this.bridge.viewModel.rooms,
        side,
      );
      const x =
        side === "east"
          ? rectangle.x + rectangle.width - lowWallWidth
          : rectangle.x;
      for (const run of runs) {
        const y =
          rectangle.y +
          run.offset * this.layout.tileSize +
          (run.offset === 0 ? 1 : 0);
        const height = Math.max(
          1,
          Math.min(
            rectangle.y + rectangle.height - y,
            run.length * this.layout.tileSize -
              (run.offset === 0 ? 1 : 0),
          ),
        );
        graphics.fillStyle(PIXEL_PALETTE_NUMBER.ink, 0.96);
        graphics.fillRect(x, y, lowWallWidth, height);
        graphics.fillStyle(wallFace, 1);
        graphics.fillRect(
          x + 1,
          y + 1,
          Math.max(1, lowWallWidth - 2),
          Math.max(1, height - 2),
        );
      }
    }
  }

  private drawExposedRearWalls(
    graphics: Phaser.GameObjects.Graphics,
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
    wallWidth: number,
    wallFace: number,
    lowWallWidth: number,
  ): void {
    const rearWallHeight = this.roomWallFaceHeight(rectangle);
    const groundY = rectangle.y;
    const northRuns = this.exposedBoundaryRuns(room, "north");
    const panelGap = Math.max(24, Math.floor(this.layout.tileSize * 1.45));
    const cornerReturns = getExposedNorthCornerReturns(
      room,
      this.bridge.viewModel.rooms,
    );
    const exteriorWest = cornerReturns.some(
      (corner) => corner.side === "west",
    );
    const exteriorEast = cornerReturns.some(
      (corner) => corner.side === "east",
    );
    const cornerShoulderWidth =
      this.northCornerShoulderWidth(wallWidth);

    for (const run of northRuns) {
      const projection = projectRearWallRun(
        rectangle,
        run,
        this.layout.tileSize,
        rearWallHeight,
        wallWidth,
      );
      const runX = projection.face.x;
      const runWidth = projection.face.width;
      if (runWidth <= 0) {
        continue;
      }
      const faceInsetLeft =
        run.offset === 0 && exteriorWest
          ? cornerShoulderWidth
          : 2;
      const faceInsetRight =
        run.offset + run.length >= room.width && exteriorEast
          ? cornerShoulderWidth
          : 2;
      const faceX = runX + faceInsetLeft;
      const faceWidth = Math.max(
        1,
        runWidth - faceInsetLeft - faceInsetRight,
      );

      graphics.fillStyle(PIXEL_PALETTE_NUMBER.ink, 1);
      graphics.fillRect(
        projection.cap.x,
        projection.cap.y,
        projection.cap.width,
        projection.cap.height,
      );
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.deepOlive, 1);
      graphics.fillRect(
        runX + 2,
        projection.cap.y + 2,
        Math.max(1, runWidth - 4),
        Math.max(1, wallWidth - 3),
      );
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.highlight, 0.52);
      graphics.fillRect(
        runX + 3,
        projection.cap.y + 2,
        Math.max(1, runWidth - 6),
        1,
      );

      graphics.fillStyle(PIXEL_PALETTE_NUMBER.shadow, 0.26);
      graphics.fillRect(
        faceX + 3,
        groundY,
        Math.max(1, faceWidth - 3),
        Math.max(2, Math.floor(wallWidth * 0.75)),
      );
      graphics.fillStyle(wallFace, 1);
      graphics.fillRect(
        faceX,
        projection.face.y,
        faceWidth,
        rearWallHeight,
      );
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.highlight, 0.46);
      graphics.fillRect(
        faceX + 1,
        projection.face.y + 1,
        Math.max(1, faceWidth - 2),
        Math.max(1, Math.floor(wallWidth * 0.28)),
      );
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.deepOlive, 0.68);
      graphics.fillRect(faceX, groundY - 3, faceWidth, 3);

      // Panel rhythm remains anchored to the complete room wall. Northern
      // coverage crops the pattern instead of restarting it in each fragment.
      graphics.lineStyle(1, PIXEL_PALETTE_NUMBER.sage, 0.34);
      for (
        let x = rectangle.x + panelGap;
        x < rectangle.x + rectangle.width - 2;
        x += panelGap
      ) {
        if (x <= faceX + 1 || x >= faceX + faceWidth - 2) {
          continue;
        }
        graphics.lineBetween(
          x,
          projection.face.y + 3,
          x,
          groundY - 4,
        );
      }

      // Coverage interruptions receive a square cut edge. They are cropped
      // wall sections, not newly compressed or rounded miniature walls.
      for (const edgeX of [runX, runX + runWidth]) {
        const isOuterEdge =
          edgeX === rectangle.x ||
          edgeX === rectangle.x + rectangle.width;
        if (!isOuterEdge) {
          graphics.fillStyle(PIXEL_PALETTE_NUMBER.ink, 1);
          graphics.fillRect(
            edgeX - 2,
            projection.cap.y,
            4,
            groundY - projection.cap.y,
          );
          graphics.fillStyle(wallFace, 1);
          graphics.fillRect(
            edgeX - 1,
            projection.face.y,
            2,
            Math.max(1, rearWallHeight - 2),
          );
        }
      }
    }

    // True exterior north corners descend into the low side wall through a
    // short three-step pixel shoulder. The steps approximate a rounded
    // cutaway corner without smoothing or consuming additional floor tiles.
    const shoulderDepth = Math.min(
      rectangle.height,
      Math.max(8, Math.floor(this.layout.tileSize * 0.42)),
    );
    const faceTop = groundY - rearWallHeight;
    const stepBottoms = [
      groundY + Math.ceil(shoulderDepth * 0.34),
      groundY + Math.ceil(shoulderDepth * 0.68),
      groundY + shoulderDepth,
    ];
    const stepWidths = [
      Math.max(
        lowWallWidth + 3,
        Math.floor(cornerShoulderWidth * 0.72),
      ),
      Math.max(
        lowWallWidth + 1,
        Math.floor(cornerShoulderWidth * 0.46),
      ),
      lowWallWidth,
    ];
    for (const corner of cornerReturns) {
      const cornerX =
        corner.side === "east"
          ? rectangle.x + rectangle.width - cornerShoulderWidth
          : rectangle.x;
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.ink, 1);
      graphics.fillRect(
        cornerX,
        faceTop,
        cornerShoulderWidth,
        rearWallHeight,
      );
      graphics.fillStyle(wallFace, 1);
      graphics.fillRect(
        cornerX + 1,
        faceTop + 1,
        Math.max(1, cornerShoulderWidth - 2),
        Math.max(1, rearWallHeight - 2),
      );
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.highlight, 0.44);
      graphics.fillRect(
        corner.side === "east"
          ? cornerX + cornerShoulderWidth - 1
          : cornerX,
        faceTop + 1,
        1,
        Math.max(1, rearWallHeight - 2),
      );

      let startY = groundY;
      for (let index = 0; index < stepBottoms.length; index += 1) {
        const width = stepWidths[index] ?? lowWallWidth;
        const endY = stepBottoms[index] ?? groundY + shoulderDepth;
        const x =
          corner.side === "east"
            ? rectangle.x + rectangle.width - width
            : rectangle.x;
        graphics.fillStyle(PIXEL_PALETTE_NUMBER.ink, 1);
        graphics.fillRect(x, startY, width, Math.max(1, endY - startY));
        if (width > 2) {
          graphics.fillStyle(wallFace, 1);
          graphics.fillRect(
            x + 1,
            startY + 1,
            width - 2,
            Math.max(1, endY - startY - 2),
          );
        }
        graphics.fillStyle(PIXEL_PALETTE_NUMBER.highlight, 0.42);
        graphics.fillRect(
          corner.side === "east" ? x : x + width - 1,
          startY + 1,
          1,
          Math.max(1, endY - startY - 2),
        );
        graphics.fillStyle(PIXEL_PALETTE_NUMBER.deepOlive, 0.78);
        graphics.fillRect(x, startY, width, 1);
        startY = endY;
      }
    }
  }

  private drawCoveredNorthBoundarySeams(
    graphics: Phaser.GameObjects.Graphics,
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
  ): void {
    const coveredNorthRuns: BoundaryRun[] = [];
    let coveredStart: number | null = null;
    for (let offset = 0; offset < room.width; offset += 1) {
      const exposed = this.hasExposedNorthWallAt(room, offset);
      if (!exposed && coveredStart === null) {
        coveredStart = offset;
      }
      if (exposed && coveredStart !== null) {
        coveredNorthRuns.push({
          offset: coveredStart,
          length: offset - coveredStart,
        });
        coveredStart = null;
      }
    }
    if (coveredStart !== null) {
      coveredNorthRuns.push({
        offset: coveredStart,
        length: room.width - coveredStart,
      });
    }
    graphics.fillStyle(PIXEL_PALETTE_NUMBER.deepOlive, 0.46);
    for (const run of coveredNorthRuns) {
      graphics.fillRect(
        rectangle.x + run.offset * this.layout.tileSize,
        rectangle.y,
        Math.min(
          rectangle.width - run.offset * this.layout.tileSize,
          run.length * this.layout.tileSize,
        ),
        1,
      );
    }
  }

  private drawRoomShell(
    graphics: Phaser.GameObjects.Graphics,
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
    wallWidth: number,
  ): void {
    const wallFace = this.roomWallFaceColor(room);
    // The grid rectangle is always the complete room floor. The dollhouse
    // rear wall is an additional projection north of that footprint and its
    // face ends exactly where the floor begins.
    const bottom = rectangle.y + rectangle.height;
    const lowWallWidth = Math.max(3, Math.floor(wallWidth * 0.62));
    const frontWallHeight = Math.max(4, Math.floor(wallWidth * 0.72));
    const southRuns = this.exposedBoundaryRuns(room, "south");
    this.drawExteriorSideWalls(
      graphics,
      room,
      rectangle,
      wallFace,
      lowWallWidth,
    );
    this.drawExposedRearWalls(
      graphics,
      room,
      rectangle,
      wallWidth,
      wallFace,
      lowWallWidth,
    );

    // The low cutaway lip is also an exterior treatment. Where another room
    // begins immediately south, omitting it prevents a duplicate wall from
    // breaking the shared floor plane.
    for (const run of southRuns) {
      const runX = rectangle.x + run.offset * this.layout.tileSize;
      const runWidth = Math.min(
        rectangle.x + rectangle.width - runX,
        run.length * this.layout.tileSize,
      );
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.ink, 1);
      graphics.fillRect(
        runX,
        bottom - frontWallHeight,
        runWidth,
        frontWallHeight,
      );
      graphics.fillStyle(wallFace, 1);
      graphics.fillRect(
        runX + 2,
        bottom - frontWallHeight + 1,
        Math.max(1, runWidth - 4),
        Math.max(1, frontWallHeight - 2),
      );
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.highlight, 0.58);
      graphics.fillRect(
        runX + 2,
        bottom - frontWallHeight + 1,
        Math.max(1, runWidth - 4),
        1,
      );
    }

    this.drawCoveredNorthBoundarySeams(graphics, room, rectangle);
  }

  private drawBuildGridOverlay(
    graphics: Phaser.GameObjects.Graphics,
    columns: number,
    rows: number,
  ): void {
    const { originX, originY, tileSize, width, height } = this.layout;
    graphics.fillStyle(PIXEL_PALETTE_NUMBER.highlight, 0.055);
    for (let row = 0; row < rows; row += 1) {
      for (let column = row % 2; column < columns; column += 2) {
        graphics.fillRect(
          originX + column * tileSize,
          originY + row * tileSize,
          tileSize,
          tileSize,
        );
      }
    }
    graphics.lineStyle(1, PIXEL_PALETTE_NUMBER.ink, 0.48);
    for (let column = 0; column <= columns; column += 1) {
      const x = originX + column * tileSize;
      graphics.lineBetween(x, originY, x, originY + height);
    }
    for (let row = 0; row <= rows; row += 1) {
      const y = originY + row * tileSize;
      graphics.lineBetween(originX, y, originX + width, y);
    }
  }

  private drawExterior(graphics: Phaser.GameObjects.Graphics): void {
    const { originY, height, tileSize } = this.layout;
    const mapBottom = originY + height;
    const sidewalkTop = Math.max(
      0,
      Math.min(this.scale.height, mapBottom),
    );
    const sidewalkHeight = Math.max(0, this.scale.height - sidewalkTop);

    graphics.fillStyle(PIXEL_PALETTE_NUMBER.paper, 1);
    graphics.fillRect(0, sidewalkTop, this.scale.width, sidewalkHeight);
    graphics.fillStyle(PIXEL_PALETTE_NUMBER.warmGray, 0.38);
    for (
      let y = sidewalkTop + 5;
      y < sidewalkTop + sidewalkHeight;
      y += 9
    ) {
      graphics.fillRect(0, y, this.scale.width, 1);
    }
    graphics.lineStyle(2, PIXEL_PALETTE_NUMBER.ink, 1);
    graphics.lineBetween(0, sidewalkTop, this.scale.width, sidewalkTop);
    graphics.lineBetween(
      0,
      sidewalkTop + sidewalkHeight,
      this.scale.width,
      sidewalkTop + sidewalkHeight,
    );
    graphics.lineStyle(1, PIXEL_PALETTE_NUMBER.sage, 0.88);
    for (let x = tileSize; x < this.scale.width; x += tileSize) {
      graphics.lineBetween(
        x,
        sidewalkTop + 2,
        x,
        sidewalkTop + sidewalkHeight - 2,
      );
    }

    const founder = this.getFounderRoom();
    if (!founder) {
      return;
    }
    const founderPixels = this.toPixels({
      tileX: founder.tileX,
      tileY: founder.tileY,
      ...orientedSize(founder),
    });
    const entranceX = Math.floor(
      founderPixels.x + founderPixels.width / 2,
    );
    const entranceWidth = Math.max(12, tileSize);
    const entranceLeft = entranceX - Math.floor(entranceWidth / 2);

    // The public entrance is an open wall break with a grounded threshold and
    // jambs. No decorative ajar leaf intrudes into the walking path.
    const entranceEdgeY = founderPixels.y + founderPixels.height;
    const entranceFrame = Math.max(2, Math.floor(tileSize * 0.08));
    graphics.fillStyle(this.roomFloorColor(founder), 1);
    graphics.fillRect(
      entranceLeft,
      entranceEdgeY - Math.max(4, entranceFrame * 2),
      entranceWidth,
      Math.max(8, entranceFrame * 4),
    );
    graphics.fillStyle(PIXEL_PALETTE_NUMBER.shadow, 0.55);
    graphics.fillRect(
      entranceLeft + entranceFrame,
      entranceEdgeY - entranceFrame,
      Math.max(1, entranceWidth - entranceFrame * 2),
      entranceFrame * 2,
    );
    graphics.fillStyle(PIXEL_PALETTE_NUMBER.ink, 1);
    graphics.fillRect(
      entranceLeft - entranceFrame,
      entranceEdgeY - entranceFrame * 3,
      entranceFrame,
      entranceFrame * 5,
    );
    graphics.fillRect(
      entranceLeft + entranceWidth,
      entranceEdgeY - entranceFrame * 3,
      entranceFrame,
      entranceFrame * 5,
    );
    graphics.fillStyle(PIXEL_PALETTE_NUMBER.lightSage, 1);
    graphics.fillRect(
      entranceLeft - 3,
      mapBottom,
      entranceWidth + 6,
      sidewalkHeight + 3,
    );
    graphics.lineStyle(1, PIXEL_PALETTE_NUMBER.olive, 1);
    graphics.strokeRect(
      entranceLeft - 3,
      mapBottom,
      entranceWidth + 6,
      sidewalkHeight + 3,
    );

    const planterY = mapBottom - Math.max(9, Math.floor(tileSize * 0.16));
    const entrancePlants = [
      {
        x: entranceX - Math.max(tileSize * 1.16, entranceWidth * 1.42),
        y: planterY - tileSize * 0.06,
        id: "roomPlant" as const,
        scale: 0.92,
      },
      {
        x: entranceX + Math.max(tileSize * 0.94, entranceWidth * 1.18),
        y: planterY + tileSize * 0.08,
        id: "stonePlanter" as const,
        scale: 0.84,
      },
    ];
    for (const plant of entrancePlants) {
      this.drawFixture(
        graphics,
        plant.id,
        plant.x,
        plant.y,
        Math.max(14, tileSize * 0.48 * plant.scale),
        Math.max(18, tileSize * 0.62 * plant.scale),
      );
    }
  }

  private drawRoomFixtures(
    graphics: Phaser.GameObjects.Graphics,
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
    inset: number,
  ): void {
    const left = rectangle.x + inset;
    const wallHeight = this.roomWallFaceHeight(rectangle);
    const rearWallRuns = this.exposedBoundaryRuns(room, "north");
    const wallWidth = Math.max(
      4,
      Math.floor(this.layout.tileSize * 0.16),
    );
    const exteriorCorners = getExposedNorthCornerReturns(
      room,
      this.bridge.viewModel.rooms,
    );
    const exteriorWest = exteriorCorners.some(
      (corner) => corner.side === "west",
    );
    const exteriorEast = exteriorCorners.some(
      (corner) => corner.side === "east",
    );
    const cornerShoulderWidth =
      this.northCornerShoulderWidth(wallWidth);
    const rearWallFaceClips = rearWallRuns.map((run) => {
      const face = projectRearWallRun(
        rectangle,
        run,
        this.layout.tileSize,
        wallHeight,
        wallWidth,
      ).face;
      const leftInset =
        run.offset === 0 && exteriorWest
          ? cornerShoulderWidth
          : 2;
      const rightInset =
        run.offset + run.length >= room.width && exteriorEast
          ? cornerShoulderWidth
          : 2;
      return {
        x: face.x + leftInset,
        y: face.y,
        width: Math.max(1, face.width - leftInset - rightInset),
        height: face.height,
      };
    });
    const wallTop = rectangle.y - wallHeight + 1;
    const wallUsableHeight = Math.max(8, wallHeight - 5);
    const top = rectangle.y + inset;
    const usableWidth = Math.max(18, rectangle.width - inset * 2);
    const usableHeight = Math.max(
      18,
      rectangle.y + rectangle.height - inset - top,
    );
    let roomFixtureOrder = 0;
    const place = (
      id: FixtureId,
      centerXRatio: number,
      centerYRatio: number,
      widthRatio: number,
      heightRatio: number,
      alpha = 1,
    ) => {
      const centerX = left + usableWidth * centerXRatio;
      const centerY = top + usableHeight * centerYRatio;
      const maximumWidth = usableWidth * widthRatio;
      const maximumHeight = usableHeight * heightRatio;
      const fixture = FIXTURE_SPRITES[id];
      const rendered = getFixturePresentationSize(
        fixture.width,
        fixture.height,
        maximumWidth,
        maximumHeight,
      );
      const shadowWidth = Math.max(
        4,
        Math.min(maximumWidth * 0.72, rendered.width * 0.82),
      );
      const shadowY =
        centerY + Math.min(maximumHeight, rendered.height) / 2 - 2;
      const contactY = centerY + rendered.height / 2;
      const isFloorSurface = id === "floorRug" || id === "bathMat";
      const fixtureOrder = roomFixtureOrder;
      roomFixtureOrder += 1;
      const target = isFloorSurface
        ? graphics
        : this.getSortableGraphics(
            this.fixtureGraphics,
            this.activeFixtureGraphics,
            `room:${room.instanceId}:${fixtureOrder}:${id}`,
          );
      if (!isFloorSurface) {
        target.setDepth(
          getFacilitySceneDepth(
            contactY,
            "fixture",
            this.fixtureStableOrder % 64,
          ),
        );
        this.fixtureStableOrder += 1;
      }
      target.fillStyle(PIXEL_PALETTE_NUMBER.shadow, 0.23 * alpha);
      target.fillRect(
        Math.round(centerX - shadowWidth / 2 + 2),
        Math.round(shadowY),
        Math.round(shadowWidth),
        Math.max(
          2,
          Math.floor(
            Math.min(
              rendered.width / Math.max(1, fixture.width),
              rendered.height / Math.max(1, fixture.height),
            ) * 1.4,
          ),
        ),
      );
      this.drawFixture(
        target,
        id,
        centerX,
        centerY,
        maximumWidth,
        maximumHeight,
        alpha,
      );
    };
    const placeWall = (
      id: FixtureId,
      centerXRatio: number,
      centerYRatio: number,
      widthRatio: number,
      heightRatio: number,
      alpha = 1,
    ) => {
      if (rearWallRuns.length === 0) {
        return;
      }
      const wallInset = Math.max(2, Math.floor(inset * 0.35));
      const fullWallUsableWidth = Math.max(
        8,
        rectangle.width - wallInset * 2,
      );
      const projection = projectRearWallArtwork(
        rectangle,
        rearWallRuns,
        this.layout.tileSize,
        wallHeight,
        (wallInset + fullWallUsableWidth * centerXRatio) /
          rectangle.width,
        (wallTop -
          (rectangle.y - wallHeight) +
          wallUsableHeight * centerYRatio) /
          wallHeight,
        (fullWallUsableWidth * widthRatio * 1.16) /
          rectangle.width,
        (wallUsableHeight * heightRatio * 1.28) / wallHeight,
      );
      if (projection.visibleFragments.length === 0) {
        return;
      }
      const fixture = FIXTURE_SPRITES[id];
      const rendered = getFixturePresentationSize(
        fixture.width,
        fixture.height,
        projection.bounds.width,
        projection.bounds.height,
      );
      const x =
        projection.bounds.x +
        (projection.bounds.width - rendered.width) / 2;
      const y =
        projection.bounds.y +
        (projection.bounds.height - rendered.height) / 2;
      const exposedFragments = getVisibleRearWallArtworkFragments(
        {
          x,
          y,
          width: rendered.width,
          height: rendered.height,
        },
        rectangle,
        rearWallRuns,
        this.layout.tileSize,
        wallHeight,
      );
      const visibleFragments = exposedFragments.flatMap((fragment) =>
        rearWallFaceClips.flatMap((clip) => {
          const intersection = intersectPixelRectangles(fragment, clip);
          return intersection ? [intersection] : [];
        }),
      );
      if (visibleFragments.length === 0) {
        return;
      }
      this.drawPixelFrameSized(
        graphics,
        fixture,
        Math.round(x),
        Math.round(y),
        rendered.width,
        rendered.height,
        alpha,
        visibleFragments,
      );
    };

    switch (room.definitionId) {
      case "room.front_desk":
        place("floorRug", 0.5, 0.62, 0.82, 0.5, 0.72);
        place("frontDesk", 0.5, 0.68, 0.76, 0.28);
        place("deskTerminal", 0.48, 0.48, 0.18, 0.25);
        place("secretaryChair", 0.48, 0.35, 0.13, 0.2);
        place("visitorChair", 0.84, 0.48, 0.12, 0.19);
        place("filingCabinet", 0.12, 0.26, 0.15, 0.29);
        place("plant", 0.9, 0.24, 0.11, 0.21);
        place("deskPhone", 0.63, 0.57, 0.1, 0.11);
        place("chartStack", 0.35, 0.58, 0.13, 0.09);
        placeWall("wallWindow", 0.5, 0.48, 0.36, 0.72);
        placeWall("medicalSign", 0.17, 0.5, 0.12, 0.7);
        placeWall("noticeBoard", 0.82, 0.5, 0.2, 0.7);
        break;
      case "room.waiting":
        place("floorRug", 0.5, 0.58, 0.78, 0.54, 0.66);
        place("waitingBench", 0.5, 0.2, 0.7, 0.23);
        place("visitorChair", 0.13, 0.54, 0.15, 0.23);
        place("visitorChair", 0.87, 0.54, 0.15, 0.23);
        place("coffeeTable", 0.5, 0.6, 0.32, 0.22);
        place("magazineRack", 0.91, 0.25, 0.11, 0.23);
        place("plant", 0.09, 0.23, 0.11, 0.21);
        place("sideTable", 0.11, 0.74, 0.11, 0.15);
        place("wasteBin", 0.89, 0.79, 0.08, 0.14);
        placeWall("framedPrint", 0.19, 0.5, 0.12, 0.72);
        placeWall("noticeBoard", 0.54, 0.5, 0.22, 0.72);
        placeWall("framedPrint", 0.82, 0.5, 0.12, 0.72);
        break;
      case "room.examination":
        place("floorRug", 0.5, 0.64, 0.72, 0.42, 0.42);
        place("examTable", 0.34, 0.58, 0.54, 0.28);
        place("examStep", 0.2, 0.77, 0.15, 0.15);
        place("sinkCabinet", 0.79, 0.22, 0.34, 0.26);
        place("rollingStool", 0.72, 0.67, 0.15, 0.22);
        place("examScale", 0.9, 0.47, 0.12, 0.3);
        place("wasteBin", 0.1, 0.83, 0.08, 0.15);
        placeWall("diagnosticPanel", 0.68, 0.5, 0.22, 0.76);
        placeWall("wallChart", 0.27, 0.5, 0.14, 0.76);
        placeWall("privacyCurtain", 0.91, 0.58, 0.12, 0.92, 0.82);
        break;
      case "room.bathroom":
        place("bathMat", 0.48, 0.72, 0.56, 0.24, 0.78);
        place("toilet", 0.31, 0.37, 0.32, 0.48);
        place("handSink", 0.75, 0.31, 0.28, 0.34);
        place("wasteBin", 0.86, 0.75, 0.14, 0.21);
        placeWall("wallMirror", 0.72, 0.5, 0.28, 0.82);
        placeWall("towelDispenser", 0.88, 0.55, 0.13, 0.65);
        placeWall("grabBar", 0.27, 0.56, 0.28, 0.5);
        break;
      case "room.xray":
        place("floorRug", 0.5, 0.6, 0.72, 0.5, 0.32);
        place("xrayTube", 0.38, 0.41, 0.39, 0.51);
        place("xrayTable", 0.53, 0.7, 0.56, 0.23);
        place("xrayBucky", 0.12, 0.48, 0.21, 0.46);
        place("leadApron", 0.88, 0.25, 0.15, 0.33);
        place("supplyCabinet", 0.87, 0.68, 0.19, 0.29);
        place("wasteBin", 0.12, 0.82, 0.1, 0.16);
        placeWall("radiationMarker", 0.18, 0.5, 0.12, 0.75);
        placeWall("wallWindow", 0.56, 0.5, 0.3, 0.72);
        placeWall("wallShelf", 0.83, 0.5, 0.2, 0.72);
        break;
      case "room.imaging_control":
        place("imagingConsole", 0.5, 0.3, 0.76, 0.46);
        place("officeChair", 0.35, 0.61, 0.17, 0.22);
        place("officeChair", 0.65, 0.61, 0.17, 0.22);
        place("serverRack", 0.1, 0.4, 0.15, 0.46);
        place("officePrinter", 0.9, 0.52, 0.14, 0.22);
        place("wasteBin", 0.88, 0.86, 0.09, 0.14);
        placeWall("lightBox", 0.68, 0.5, 0.27, 0.76);
        placeWall("wallWindow", 0.27, 0.5, 0.3, 0.72);
        break;
      case "room.minor_procedure":
        place("floorRug", 0.5, 0.63, 0.72, 0.46, 0.38);
        place("procedureTable", 0.46, 0.58, 0.56, 0.28);
        place("procedureLight", 0.46, 0.32, 0.25, 0.33);
        place("instrumentTray", 0.75, 0.59, 0.2, 0.25);
        place("supplyCabinet", 0.86, 0.22, 0.23, 0.32);
        place("biohazardBin", 0.12, 0.78, 0.13, 0.19);
        place("ivStand", 0.14, 0.4, 0.13, 0.37);
        place("scrubSink", 0.78, 0.86, 0.29, 0.23);
        place("wasteBin", 0.92, 0.8, 0.08, 0.14);
        placeWall("wallShelf", 0.72, 0.5, 0.28, 0.72);
        placeWall("medicalSign", 0.24, 0.5, 0.13, 0.74);
        break;
      default:
        place("filingCabinet", 0.25, 0.4, 0.25, 0.38);
        place("visitorChair", 0.68, 0.62, 0.25, 0.3);
    }

    const visualTier = Math.max(
      1,
      Math.min(5, room.upgradeLevel ?? 1),
    );
    if (visualTier >= 2) {
      switch (room.definitionId) {
        case "room.front_desk":
          place("rollingCart", 0.85, 0.76, 0.16, 0.2, 0.92);
          placeWall("framedPrint", 0.7, 0.5, 0.12, 0.72);
          break;
        case "room.waiting":
          place("roomPlant", 0.91, 0.78, 0.1, 0.18, 0.94);
          place("sideTable", 0.88, 0.48, 0.11, 0.15, 0.9);
          break;
        case "room.examination":
          place("vitalsMonitor", 0.87, 0.64, 0.2, 0.38, 0.96);
          place("rollingCart", 0.12, 0.44, 0.17, 0.25, 0.92);
          break;
        case "room.bathroom":
          place("roomPlant", 0.17, 0.78, 0.13, 0.21, 0.82);
          placeWall("framedPrint", 0.24, 0.5, 0.13, 0.74, 0.86);
          break;
        case "room.xray":
          place("rollingCart", 0.82, 0.82, 0.17, 0.23, 0.9);
          placeWall("lightBox", 0.54, 0.5, 0.24, 0.76, 0.94);
          break;
        case "room.imaging_control":
          place("roomPlant", 0.9, 0.84, 0.1, 0.18, 0.88);
          placeWall("framedPrint", 0.12, 0.5, 0.12, 0.72, 0.84);
          break;
        case "room.minor_procedure":
          place("vitalsMonitor", 0.89, 0.48, 0.18, 0.36, 0.96);
          place("rollingCart", 0.13, 0.82, 0.16, 0.21, 0.92);
          break;
      }
    }
    if (visualTier >= 3) {
      place("roomPlant", 0.92, 0.86, 0.1, 0.18, 0.94);
      placeWall("framedPrint", 0.86, 0.5, 0.12, 0.72, 0.9);
    }
    if (
      room.definitionId !== "room.bathroom" &&
      room.definitionId !== "room.imaging_control"
    ) {
      placeWall("wallClock", 0.5, 0.46, 0.08, 0.7, 0.88);
    }
  }

  private drawFixture(
    graphics: Phaser.GameObjects.Graphics,
    id: FixtureId,
    centerX: number,
    centerY: number,
    maximumWidth: number,
    maximumHeight: number,
    alpha = 1,
  ): void {
    const fixture = FIXTURE_SPRITES[id];
    const rendered = getFixturePresentationSize(
      fixture.width,
      fixture.height,
      maximumWidth,
      maximumHeight,
    );
    this.drawPixelFrameSized(
      graphics,
      fixture,
      Math.round(centerX - rendered.width / 2),
      Math.round(centerY - rendered.height / 2),
      rendered.width,
      rendered.height,
      alpha,
    );
  }

  private drawDoor(
    graphics: Phaser.GameObjects.Graphics,
    rectangle: { x: number; y: number; width: number; height: number },
    side: "north" | "east" | "south" | "west",
    roomShade: number,
  ): void {
    const doorWidth = Math.max(8, this.layout.tileSize);
    const horizontalX =
      rectangle.x + Math.floor(rectangle.width / 2 - doorWidth / 2);
    const verticalY =
      rectangle.y + Math.floor(rectangle.height / 2 - doorWidth / 2);
    graphics.fillStyle(roomShade, 1);
    graphics.lineStyle(2, 0x111111, 1);
    if (side === "north" || side === "south") {
      const edgeY =
        side === "north" ? rectangle.y : rectangle.y + rectangle.height;
      graphics.fillRect(horizontalX, edgeY - 3, doorWidth, 6);
      graphics.fillStyle(0x111111, 1);
      graphics.fillRect(horizontalX - 2, edgeY - 5, 2, 10);
      graphics.fillRect(horizontalX + doorWidth, edgeY - 5, 2, 10);
      return;
    }
    const edgeX =
      side === "west" ? rectangle.x : rectangle.x + rectangle.width;
    graphics.fillRect(edgeX - 3, verticalY, 6, doorWidth);
    graphics.fillStyle(0x111111, 1);
    graphics.fillRect(edgeX - 5, verticalY - 2, 10, 2);
    graphics.fillRect(edgeX - 5, verticalY + doorWidth, 10, 2);
  }

  private characterPose(
    moving: boolean,
    offsetIndex: number,
  ): CharacterPose {
    if (
      !moving ||
      this.bridge.viewModel.paused ||
      this.bridge.viewModel.buildMode
    ) {
      return "idle";
    }
    return Math.floor(this.characterPhase * 2 + offsetIndex) % 2 === 0
      ? "walk-a"
      : "walk-b";
  }

  private getCharacterRoutePresentation(
    key: string,
    input: {
      location?: GridPoint;
      path?: GridPoint[];
      pathIndex?: number;
      direction?: "front" | "side" | "back";
      moving?: boolean;
    },
  ): {
    location?: GridPoint;
    direction: "front" | "side" | "back";
    moving: boolean;
  } {
    const previous = this.routeMotionTracks.get(key);
    const canonicalTilesPerFacilityMinute = Math.max(
      0,
      this.bridge.viewModel.characterTravelTilesPerFacilityMinute,
    );
    let track = syncRouteMotion(previous, {
      ...input,
      lookaheadPathNodes: canonicalTilesPerFacilityMinute,
    });
    if (!track) {
      this.routeMotionTracks.delete(key);
      return {
        location: input.location,
        direction: input.direction ?? "front",
        moving: input.moving ?? false,
      };
    }

    const millisecondsPerMinute = Math.max(
      1,
      this.bridge.viewModel.realMillisecondsPerFacilityMinuteAt1x,
    );
    const tilesPerSecond = getRouteTilesPerSecond(
      canonicalTilesPerFacilityMinute,
      millisecondsPerMinute,
      this.bridge.viewModel.simulationSpeed,
    );
    track = advanceRouteMotion(
      track,
      this.frameDeltaMilliseconds,
      tilesPerSecond,
    );
    const sample = sampleRouteMotion(track);
    if (routeMotionComplete(track)) {
      this.routeMotionTracks.delete(key);
    } else {
      this.routeMotionTracks.set(key, track);
    }
    return {
      location: sample.location,
      direction: sample.moving
        ? sample.direction
        : (input.direction ?? sample.direction),
      moving: sample.moving || (input.moving ?? false),
    };
  }

  private getCharacterGraphics(
    key: string,
  ): Phaser.GameObjects.Graphics {
    let graphics = this.characterGraphics.get(key);
    if (!graphics) {
      graphics = this.add.graphics();
      this.characterGraphics.set(key, graphics);
    }
    graphics.setVisible(true);
    this.activeCharacterGraphics.add(key);
    return graphics;
  }

  private drawCharacters(): void {
    this.activeCharacterGraphics = new Set<string>();
    this.locatorGraphics?.clear();
    const representedKeys = new Set<string>();
    const founderKey = "character:founder";
    representedKeys.add(founderKey);
    const founderPresentation = this.getCharacterRoutePresentation(
      founderKey,
      this.bridge.viewModel.founder,
    );
    const founderLocation = founderPresentation.location;
    if (founderLocation) {
      const graphics = this.getCharacterGraphics(founderKey);
      const founderCenterX =
        this.layout.originX +
        (founderLocation.x + 0.5) * this.layout.tileSize;
      const founderBaseY = this.drawPixelPerson(
        graphics,
        founderCenterX,
        this.layout.originY +
          (founderLocation.y + 0.72) * this.layout.tileSize,
        0,
        this.bridge.viewModel.founder.appearance,
        0x111111,
        founderPresentation.direction,
        this.characterPose(founderPresentation.moving, 0),
      );
      graphics.setDepth(
        getFacilitySceneDepth(founderBaseY, "character", 0),
      );
      const activityLabel = this.bridge.viewModel.founder.activityLabel;
      this.founderActivityText
        ?.setText(activityLabel ?? "")
        .setPosition(
          founderCenterX,
          founderBaseY - Math.max(22, this.layout.tileSize * 0.88),
        )
        .setVisible(Boolean(activityLabel));
    } else {
      this.founderActivityText?.setVisible(false);
    }

    this.bridge.viewModel.staff.forEach((employee, index) => {
      const key = `character:staff:${employee.instanceId}`;
      representedKeys.add(key);
      const employeePresentation = this.getCharacterRoutePresentation(
        key,
        employee,
      );
      if (!employeePresentation.location) {
        // Map actors render only from persisted locations or persisted route
        // samples. Inferring a room-center fallback makes reloads and route
        // transitions look like teleportation.
        return;
      }
      const graphics = this.getCharacterGraphics(key);
      const employeeBaseY = this.drawPixelPerson(
        graphics,
        this.layout.originX +
          (employeePresentation.location.x + 0.5) * this.layout.tileSize,
        this.layout.originY +
          (employeePresentation.location.y + 0.72) * this.layout.tileSize,
        index + 1,
        employee.appearance,
        0x555555,
        employeePresentation.direction,
        this.characterPose(employeePresentation.moving, index + 1),
      );
      graphics.setDepth(
        getFacilitySceneDepth(
          employeeBaseY,
          "character",
          (index + 1) % 64,
        ),
      );
    });
    this.bridge.viewModel.ambientPedestrians?.forEach(
      (pedestrian, index) => {
        const key = `character:ambient:${pedestrian.instanceId}`;
        representedKeys.add(key);
        const presentation = this.getCharacterRoutePresentation(
          key,
          pedestrian,
        );
        if (!presentation.location) {
          return;
        }
        const graphics = this.getCharacterGraphics(key);
        const baseY = this.drawPixelPerson(
          graphics,
          this.layout.originX +
            (presentation.location.x + 0.5) * this.layout.tileSize,
          this.layout.originY +
            (presentation.location.y + 0.72) * this.layout.tileSize,
          200 + index,
          pedestrian.appearance,
          0x555555,
          presentation.direction,
          this.characterPose(presentation.moving, 200 + index),
        );
        graphics.setDepth(
          getFacilitySceneDepth(
            baseY,
            "character",
            (index + 48) % 64,
          ),
        );
      },
    );
    this.bridge.viewModel.patients?.forEach((patient, index) => {
      const key = `character:patient:${patient.instanceId}`;
      representedKeys.add(key);
      const presentation = this.getCharacterRoutePresentation(
        key,
        patient,
      );
      this.drawFacilityPatient(
        {
          ...patient,
          ...(presentation.location
            ? { location: presentation.location }
            : { location: undefined }),
          direction: presentation.direction,
          moving: presentation.moving,
        },
        index,
      );
    });
    for (const key of this.routeMotionTracks.keys()) {
      if (!representedKeys.has(key)) {
        this.routeMotionTracks.delete(key);
      }
    }
    this.removeInactiveGraphics(
      this.characterGraphics,
      this.activeCharacterGraphics,
    );
  }

  private drawFacilityPatient(
    patient: FacilityPatientView,
    index: number,
  ): void {
    if (!patient.location) {
      // Off-site or otherwise absent patients stay absent until the domain
      // supplies their persisted return route/location.
      return;
    }
    const graphics = this.getCharacterGraphics(
      `character:patient:${patient.instanceId}`,
    );
    const finishCharacter = (baseY: number, centerX: number) => {
      graphics.setDepth(
        getFacilitySceneDepth(
          baseY,
          "character",
          (index + 16) % 64,
        ),
      );
      this.drawPatientLocator(centerX, baseY, patient);
    };
    const appearanceColor =
      patient.status === "action-ready" ? 0x111111 : 0x666666;
    const direction = patient.direction ?? "front";
    const pose = patient.seated
      ? "seated"
      : this.characterPose(patient.moving ?? false, 100 + index);

    const centerX =
      this.layout.originX +
      (patient.location.x + 0.5) * this.layout.tileSize;
    const baseY = this.drawPixelPerson(
      graphics,
      centerX,
      this.layout.originY +
        (patient.location.y + 0.72) * this.layout.tileSize,
      100 + index,
      patient.appearance,
      appearanceColor,
      direction,
      pose,
    );
    finishCharacter(baseY, centerX);
  }

  private drawPatientLocator(
    centerX: number,
    baseY: number,
    patient: FacilityPatientView,
  ): void {
    const graphics = this.locatorGraphics;
    if (!graphics) {
      return;
    }
    if (
      this.bridge.viewModel.selectedPatientInstanceId !==
      patient.instanceId
    ) {
      return;
    }
    const pixel = Math.max(2, Math.floor(this.layout.tileSize / 9));
    const pulse =
      this.bridge.viewModel.paused
        ? 0
        : Math.round((Math.sin(this.characterPhase * 2) + 1) * pixel);
    const frame = getCharacterPixelFrame(patient.appearance, {
      direction: patient.direction ?? "front",
      pose: "idle",
    });
    const characterHeight = getCharacterPresentationMetrics(
      frame,
      this.layout.tileSize,
    );
    const arrowY = baseY - characterHeight.height - pixel * 4 - pulse;
    graphics.fillStyle(0x111111, 1);
    graphics.fillTriangle(
      centerX,
      arrowY + pixel * 3,
      centerX - pixel * 2,
      arrowY,
      centerX + pixel * 2,
      arrowY,
    );
    graphics.lineStyle(1, 0xf6f1dc, 1);
    graphics.strokeTriangle(
      centerX,
      arrowY + pixel * 3,
      centerX - pixel * 2,
      arrowY,
      centerX + pixel * 2,
      arrowY,
    );
  }

  private drawPixelPerson(
    graphics: Phaser.GameObjects.Graphics,
    centerX: number,
    baseY: number,
    _offsetIndex: number,
    appearance: PixelAppearanceDescriptor | undefined,
    _fallbackColor: number,
    direction: CharacterDirection = "front",
    pose: CharacterPose = "idle",
  ): number {
    // Map characters use the canonical detailed frame at a crisp 3:2
    // nearest-neighbor presentation scale. This makes people readable among
    // dense room furnishings without changing their route or foot anchor.
    const resolvedAppearance = appearance ?? FALLBACK_APPEARANCE;
    const renderSignature = [
      characterAppearanceSignature(resolvedAppearance),
      direction,
      pose,
      this.layout.tileSize,
    ].join("|");
    const cached = this.characterRenderCache.get(graphics);
    if (!cached || cached.signature !== renderSignature) {
      const frame = getCharacterPixelFrame(resolvedAppearance, {
        direction,
        pose,
      });
      const metrics = getCharacterPresentationMetrics(
        frame,
        this.layout.tileSize,
      );
      const localX = Math.round(-metrics.width / 2);
      const localY = Math.round(-metrics.height);
      graphics.clear();
      this.drawPixelFrameSizedOutline(
        graphics,
        frame,
        localX,
        localY,
        metrics.width,
        metrics.height,
      );
      this.drawPixelFrameSized(
        graphics,
        frame,
        localX,
        localY,
        metrics.width,
        metrics.height,
      );
      this.characterRenderCache.set(graphics, {
        signature: renderSignature,
        width: metrics.width,
        height: metrics.height,
      });
    }
    // The expensive detailed sprite is now local to its Graphics object. A
    // normal animation frame only moves that object; it no longer reconstructs
    // every hair, face, clothing, outline, and shadow pixel for every actor.
    graphics.setPosition(Math.round(centerX), Math.round(baseY));
    return baseY;
  }

  private drawPixelFrameSizedOutline(
    graphics: Phaser.GameObjects.Graphics,
    frame: PixelFrame | PixelSpriteAsset,
    x: number,
    y: number,
    renderedWidth: number,
    renderedHeight: number,
  ): void {
    if (renderedWidth < 8 || renderedHeight < 12) {
      return;
    }
    const occupied = new Set(
      frame.cells.map((cell) => `${cell.x}:${cell.y}`),
    );
    const edge = (
      cellX: number,
      cellY: number,
    ): { left: number; top: number; right: number; bottom: number } => ({
      left:
        x +
        Math.floor((cellX * renderedWidth) / frame.width),
      top:
        y +
        Math.floor((cellY * renderedHeight) / frame.height),
      right:
        x +
        Math.floor(((cellX + 1) * renderedWidth) / frame.width),
      bottom:
        y +
        Math.floor(((cellY + 1) * renderedHeight) / frame.height),
    });
    graphics.fillStyle(PIXEL_PALETTE_NUMBER.highlight, 0.82);
    for (const cell of frame.cells) {
      const bounds = edge(cell.x, cell.y);
      if (!occupied.has(`${cell.x - 1}:${cell.y}`)) {
        graphics.fillRect(
          bounds.left - 1,
          bounds.top,
          1,
          Math.max(1, bounds.bottom - bounds.top),
        );
      }
      if (!occupied.has(`${cell.x + 1}:${cell.y}`)) {
        graphics.fillRect(
          bounds.right,
          bounds.top,
          1,
          Math.max(1, bounds.bottom - bounds.top),
        );
      }
      if (!occupied.has(`${cell.x}:${cell.y - 1}`)) {
        graphics.fillRect(
          bounds.left,
          bounds.top - 1,
          Math.max(1, bounds.right - bounds.left),
          1,
        );
      }
      if (!occupied.has(`${cell.x}:${cell.y + 1}`)) {
        graphics.fillRect(
          bounds.left,
          bounds.bottom,
          Math.max(1, bounds.right - bounds.left),
          1,
        );
      }
    }
  }

  private drawPixelFrameSized(
    graphics: Phaser.GameObjects.Graphics,
    frame: PixelFrame | PixelSpriteAsset,
    x: number,
    y: number,
    renderedWidth: number,
    renderedHeight: number,
    alpha = 1,
    clipRectangles?: readonly PixelRectangle[],
  ): void {
    const cellsByColor = new Map<PixelColorKey, typeof frame.cells>();
    for (const cell of frame.cells) {
      const group = cellsByColor.get(cell.color);
      if (group) {
        group.push(cell);
      } else {
        cellsByColor.set(cell.color, [cell]);
      }
    }
    for (const [color, cells] of cellsByColor) {
      graphics.fillStyle(PIXEL_PALETTE_NUMBER[color], alpha);
      for (const cell of cells) {
        const left =
          x +
          Math.floor((cell.x * renderedWidth) / frame.width);
        const top =
          y +
          Math.floor((cell.y * renderedHeight) / frame.height);
        const right =
          x +
          Math.floor(
            ((cell.x + 1) * renderedWidth) / frame.width,
          );
        const bottom =
          y +
          Math.floor(
            ((cell.y + 1) * renderedHeight) / frame.height,
          );
        if (right <= left || bottom <= top) {
          continue;
        }
        if (!clipRectangles) {
          graphics.fillRect(
            left,
            top,
            right - left,
            bottom - top,
          );
          continue;
        }
        for (const clip of clipRectangles) {
          const clippedLeft = Math.max(left, Math.ceil(clip.x));
          const clippedTop = Math.max(top, Math.ceil(clip.y));
          const clippedRight = Math.min(
            right,
            Math.floor(clip.x + clip.width),
          );
          const clippedBottom = Math.min(
            bottom,
            Math.floor(clip.y + clip.height),
          );
          if (
            clippedRight <= clippedLeft ||
            clippedBottom <= clippedTop
          ) {
            continue;
          }
          graphics.fillRect(
            clippedLeft,
            clippedTop,
            clippedRight - clippedLeft,
            clippedBottom - clippedTop,
          );
        }
      }
    }
  }

  private drawPixelFrame(
    graphics: Phaser.GameObjects.Graphics,
    frame: PixelFrame | PixelSpriteAsset,
    x: number,
    y: number,
    scale: number,
    alpha = 1,
  ): void {
    const cellsByColor = new Map<PixelColorKey, typeof frame.cells>();
    for (const cell of frame.cells) {
      const group = cellsByColor.get(cell.color);
      if (group) {
        group.push(cell);
      } else {
        cellsByColor.set(cell.color, [cell]);
      }
    }
    for (const [color, cells] of cellsByColor) {
      graphics.fillStyle(PIXEL_PALETTE_NUMBER[color], alpha);
      for (const cell of cells) {
        graphics.fillRect(
          Math.round(x + cell.x * scale),
          Math.round(y + cell.y * scale),
          scale,
          scale,
        );
      }
    }
  }

  private positionText(): void {
    const { originX, originY, width, tileSize } = this.layout;
    const model = this.bridge.viewModel;
    const compact = this.scale.width < 520;

    this.roomTexts.forEach((text) => text.destroy());
    this.roomTexts = model.rooms
      .filter(
        (room) =>
          room.kind !== "hallway" && room.definitionId !== "room.hallway",
      )
      .map((room) => {
        const pixels = this.toPixels({
          tileX: room.tileX,
          tileY: room.tileY,
          ...orientedSize(room),
        });
        const label = this.add
          .text(
            pixels.x + pixels.width / 2,
            pixels.y + Math.max(5, Math.floor(tileSize * 0.16)),
            room.displayName,
            {
              color: "#232720",
              backgroundColor: "#e0ded0",
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: `${Math.max(
                8,
                Math.min(10, Math.floor(tileSize * 0.26)),
              )}px`,
              fontStyle: "bold",
              align: "center",
              resolution: 2,
              padding: {
                x: 4,
                y: 2,
              },
              wordWrap: {
                width: Math.max(10, pixels.width - 16),
                useAdvancedWrap: true,
              },
            },
          )
          .setOrigin(0.5, 0);
        label.setDepth(FACILITY_DEPTH_UI);
        // Room names remain available while renovating; ordinary play relies
        // on the illustrated room itself instead of covering the rear wall
        // with debug-like labels.
        label.setVisible(Boolean(model.buildMode));
        return label;
      });

    this.footerText
      ?.setFontSize(compact ? 10 : 12)
      .setText(
        model.placement
          ? `BUILD: ${model.placement.displayName.toUpperCase()} ${model.placement.width}×${model.placement.height} • ROTATION ${model.placement.orientation ?? 0}° • MOVE OVER MAP`
          : "",
      )
      .setPosition(
        originX + width / 2,
        originY + this.layout.height + Math.max(7, Math.floor(tileSize * 0.18)),
      );
  }

  private setInteractionHint(
    label: string | null,
    pointer?: Phaser.Input.Pointer,
  ): void {
    if (!label || !pointer) {
      this.interactionHintText?.setVisible(false);
      if (this.game?.canvas) {
        this.game.canvas.style.cursor = "";
      }
      return;
    }
    const halfWidth = Math.max(70, label.length * 3.5);
    this.interactionHintText
      ?.setText(label)
      .setPosition(
        Math.max(
          halfWidth,
          Math.min(this.scale.width - halfWidth, pointer.x),
        ),
        Math.max(24, pointer.y - 10),
      )
      .setVisible(true);
    if (this.game?.canvas) {
      this.game.canvas.style.cursor = "pointer";
    }
  }

  private updateLiveInteractionHint(
    pointer: Phaser.Input.Pointer,
  ): void {
    if (this.bridge.viewModel.buildMode) {
      const activeDoorTool = this.bridge.viewModel.buildDoorTool;
      const target = this.doorInteractionAtPointer(pointer);
      if (target) {
        this.setInteractionHint(
          target.kind === "place" ? "PLACE DOOR" : "REMOVE DOOR",
          pointer,
        );
      } else {
        this.setInteractionHint(null);
        if (activeDoorTool && this.game?.canvas) {
          this.game.canvas.style.cursor = "crosshair";
        }
      }
      return;
    }
    const point = this.gridPointAtPointer(pointer);
    if (point) {
      const interaction = getEnvironmentalInteraction(
        this.bridge.viewModel,
        point,
      );
      if (interaction) {
        this.setInteractionHint(interaction.label, pointer);
        return;
      }
    }
    this.setInteractionHint(
      this.walkDestinationAtPointer(pointer)
        ? "CLICK TO WALK HERE"
        : null,
      pointer,
    );
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    if (this.hallwayPaintActive) {
      if (!this.isHallwayPlacementActive()) {
        this.endHallwayPaint();
      } else {
        this.paintHallwayToPointer(pointer);
        return;
      }
    }

    if (this.dragStart) {
      const deltaX = pointer.x - this.dragStart.pointerX;
      const deltaY = pointer.y - this.dragStart.pointerY;
      if (
        !this.dragStart.dragged &&
        deltaX * deltaX + deltaY * deltaY < 36
      ) {
        return;
      }
      this.dragStart.dragged = true;
      this.setInteractionHint(null);
      if (this.game?.canvas) {
        this.game.canvas.style.cursor = "grabbing";
      }
      this.applyCamera({
        ...this.cameraView,
        panX:
          this.dragStart.panX + deltaX,
        panY:
          this.dragStart.panY + deltaY,
      });
      return;
    }

    if (!this.bridge.viewModel.placement) {
      if (this.placementGhost) {
        this.placementGhost = null;
        this.drawPlacementGhost();
      }
      this.updateLiveInteractionHint(pointer);
      return;
    }

    this.setInteractionHint(null);
    if (this.game?.canvas) {
      this.game.canvas.style.cursor = "crosshair";
    }

    const tileX = Math.floor(
      (pointer.x - this.layout.originX) / this.layout.tileSize,
    );
    const tileY = Math.floor(
      (pointer.y - this.layout.originY) / this.layout.tileSize,
    );
    const columns = positiveGridSize(this.bridge.viewModel.gridColumns, 16);
    const rows = positiveGridSize(this.bridge.viewModel.gridRows, 10);
    const pointerInsideGrid =
      tileX >= 0 && tileY >= 0 && tileX < columns && tileY < rows;

    this.placementGhost = pointerInsideGrid
      ? {
          tileX,
          tileY,
          ...this.evaluatePlacement(tileX, tileY),
        }
      : null;
    this.drawPlacementGhost();
  }

  private gridPointAtPointer(
    pointer: Phaser.Input.Pointer,
  ): GridPoint | null {
    const x = Math.floor(
      (pointer.x - this.layout.originX) / this.layout.tileSize,
    );
    const y = Math.floor(
      (pointer.y - this.layout.originY) / this.layout.tileSize,
    );
    const columns = positiveGridSize(
      this.bridge.viewModel.gridColumns,
      16,
    );
    const rows = positiveGridSize(this.bridge.viewModel.gridRows, 10);
    return x >= 0 && y >= 0 && x < columns && y < rows
      ? { x, y }
      : null;
  }

  private walkDestinationAtPointer(
    pointer: Phaser.Input.Pointer,
  ): GridPoint | null {
    const roomPoint = this.gridPointAtPointer(pointer);
    if (roomPoint && this.roomAtPointer(pointer)) {
      return roomPoint;
    }
    const x = Math.floor(
      (pointer.x - this.layout.originX) / this.layout.tileSize,
    );
    const columns = positiveGridSize(
      this.bridge.viewModel.gridColumns,
      16,
    );
    const rows = positiveGridSize(
      this.bridge.viewModel.gridRows,
      10,
    );
    return x >= 0 &&
      x < columns &&
      pointer.y >= this.layout.sidewalkTop &&
      pointer.y < this.layout.sidewalkTop + this.layout.sidewalkHeight
      ? { x, y: rows }
      : null;
  }

  private handlePointerUp(pointer: Phaser.Input.Pointer): void {
    const gesture = this.dragStart;
    this.dragStart = null;
    this.endHallwayPaint();
    if (
      !gesture ||
      gesture.dragged ||
      this.bridge.viewModel.buildMode ||
      this.bridge.viewModel.placement
    ) {
      return;
    }
    const destination = this.walkDestinationAtPointer(pointer);
    if (!destination || !this.bridge.onMoveFounder) {
      return;
    }
    const accepted = this.bridge.onMoveFounder(destination);
    this.setInteractionHint(
      accepted ? "DESTINATION SET" : "NO WALKABLE ROUTE",
      pointer,
    );
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    if (pointer.button !== 0) {
      return;
    }

    if (this.isHallwayPlacementActive()) {
      this.hallwayPaintActive = true;
      this.hallwayPaintBlocked = false;
      this.hallwayPaintLastPoint = null;
      this.hallwayPaintVisitedTiles.clear();
      this.paintHallwayToPointer(pointer);
      return;
    }

    if (this.bridge.viewModel.placement) {
      this.handlePointerMove(pointer);
      const ghost = this.placementGhost;
      if (!ghost?.valid) {
        return;
      }

      this.bridge.onPlaceRoom(
        ghost.tileX,
        ghost.tileY,
        this.bridge.viewModel.placement.orientation,
      );
      return;
    }

    if (
      this.bridge.viewModel.buildMode &&
      this.bridge.viewModel.buildDoorTool
    ) {
      const target = this.doorInteractionAtPointer(pointer);
      if (target?.kind === "place") {
        this.bridge.onPlaceDoor?.(
          target.slot.roomInstanceId,
          target.slot.side,
          target.slot.offset,
        );
        this.setInteractionHint("DOOR PLACED", pointer);
        return;
      }
      if (target?.kind === "remove") {
        // Exterior doors never enter the target list, preserving the public
        // entrance even if a stale presentation tries to expose it.
        if (!target.door.exterior) {
          this.bridge.onRemoveDoor?.(target.door.instanceId);
          this.setInteractionHint("DOOR REMOVED", pointer);
        }
        return;
      }

      // Door tools own clicks on the map. Blank-space dragging still pans the
      // facility, but an ineligible wall cannot accidentally select a room or
      // open its upgrade dialog.
      this.dragStart = {
        pointerX: pointer.x,
        pointerY: pointer.y,
        panX: this.cameraView.panX,
        panY: this.cameraView.panY,
        dragged: false,
      };
      return;
    }

    const selectedRoom = this.roomAtPointer(pointer);
    if (this.bridge.viewModel.buildMode && selectedRoom) {
      this.bridge.onSelectRoom?.(selectedRoom.instanceId);
      return;
    }

    if (!this.bridge.viewModel.buildMode) {
      const point = this.gridPointAtPointer(pointer);
      if (point) {
        const litter = (this.bridge.viewModel.litterItems ?? []).find(
          (item) =>
            item.location.x === point.x && item.location.y === point.y,
        );
        if (litter) {
          this.setInteractionHint("CLEANING REQUESTED", pointer);
          this.bridge.onCollectLitter?.(litter.instanceId);
          return;
        }
        const cooler = this.bridge.viewModel.waterCooler;
        if (
          cooler &&
          cooler.location.x === point.x &&
          cooler.location.y === point.y
        ) {
          this.setInteractionHint(
            cooler.needsRefill
              ? "REFILL REQUESTED"
              : "WATER COOLER IS FULL",
            pointer,
          );
          this.bridge.onRefillWaterCooler?.();
          return;
        }
        const employee = this.bridge.viewModel.staff.find(
          (candidate) =>
            candidate.location?.x === point.x &&
            candidate.location?.y === point.y,
        );
        if (employee) {
          this.bridge.onPraiseEmployee?.(employee.instanceId);
          return;
        }
      }
    }

    this.dragStart = {
      pointerX: pointer.x,
      pointerY: pointer.y,
      panX: this.cameraView.panX,
      panY: this.cameraView.panY,
      dragged: false,
    };
  }

  private isHallwayPlacementActive(): boolean {
    const placement = this.bridge.viewModel.placement;
    return Boolean(
      placement &&
        (placement.kind === "hallway" ||
          placement.definitionId === "room.hallway"),
    );
  }

  private endHallwayPaint(): void {
    this.hallwayPaintActive = false;
    this.hallwayPaintBlocked = false;
    this.hallwayPaintLastPoint = null;
    this.hallwayPaintVisitedTiles.clear();
  }

  private paintHallwayToPointer(pointer: Phaser.Input.Pointer): void {
    const point = this.gridPointAtPointer(pointer);
    if (!point || !this.isHallwayPlacementActive()) {
      return;
    }
    if (this.hallwayPaintBlocked) {
      return;
    }

    const points = this.hallwayPaintLastPoint
      ? rasterizeGridLine(this.hallwayPaintLastPoint, point)
      : [point];
    this.hallwayPaintLastPoint = point;

    for (const candidate of points) {
      const key = `${candidate.x}:${candidate.y}`;
      if (this.hallwayPaintVisitedTiles.has(key)) {
        continue;
      }
      // A rejected tile should not dispatch repeatedly during the same drag.
      // Releasing and starting a new gesture permits a deliberate retry.
      this.hallwayPaintVisitedTiles.add(key);
      const evaluation = this.evaluatePlacement(candidate.x, candidate.y);
      if (!evaluation.valid) {
        if (
          evaluation.invalidReason === "overlap" &&
          this.isExistingHallwayTile(candidate)
        ) {
          // Let a stroke begin on, or pass back over, the existing hallway
          // network without charging for or dispatching that square again.
          continue;
        }
        // Do not jump across an occupied or out-of-bounds square and resume
        // painting on the other side. The player can release and begin a new
        // stroke from another valid square.
        this.hallwayPaintBlocked = true;
        break;
      }
      const placed = this.bridge.onPlaceRoom(
        candidate.x,
        candidate.y,
        this.bridge.viewModel.placement?.orientation,
      );
      if (placed === false) {
        // Affordability and other domain-only rules can reject a visually
        // clear square. Stop this stroke so a fast drag does not produce a
        // cascade of identical rejected operations.
        this.hallwayPaintBlocked = true;
        break;
      }
    }

    this.placementGhost = {
      tileX: point.x,
      tileY: point.y,
      ...this.evaluatePlacement(point.x, point.y),
    };
    this.drawPlacementGhost();
    this.setInteractionHint("PAINT HALLWAY", pointer);
  }

  private isExistingHallwayTile(point: GridPoint): boolean {
    return this.bridge.viewModel.rooms.some((room) => {
      if (
        room.kind !== "hallway" &&
        room.definitionId !== "room.hallway"
      ) {
        return false;
      }
      const size = orientedSize(room);
      return (
        point.x >= room.tileX &&
        point.y >= room.tileY &&
        point.x < room.tileX + size.width &&
        point.y < room.tileY + size.height
      );
    });
  }

  private handleWheel(deltaY: number): void {
    const direction = deltaY > 0 ? -1 : 1;
    this.applyCamera({
      ...this.cameraView,
      zoom: Math.max(
        MINIMUM_CAMERA_ZOOM,
        Math.min(
          MAXIMUM_CAMERA_ZOOM,
          Math.round((this.cameraView.zoom + direction * 0.1) * 10) / 10,
        ),
      ),
    });
  }

  private applyCamera(camera: FacilityCameraView): void {
    this.cameraView = camera;
    this.bridge.onCameraChange?.(camera);
    this.lastModelSignature = "";
    this.refreshLayout(true);
  }

  private roomAtPointer(
    pointer: Phaser.Input.Pointer,
  ): FacilityRoomView | undefined {
    const tileX = Math.floor(
      (pointer.x - this.layout.originX) / this.layout.tileSize,
    );
    const tileY = Math.floor(
      (pointer.y - this.layout.originY) / this.layout.tileSize,
    );

    return this.bridge.viewModel.rooms
      .slice()
      .reverse()
      .find((room) => {
        const size = orientedSize(room);
        return (
          tileX >= room.tileX &&
          tileY >= room.tileY &&
          tileX < room.tileX + size.width &&
          tileY < room.tileY + size.height
        );
      });
  }

  private evaluatePlacement(
    tileX: number,
    tileY: number,
  ): Pick<PlacementGhost, "valid" | "invalidReason"> {
    const placement = this.bridge.viewModel.placement;
    if (!placement) {
      return { valid: false, invalidReason: "outside-grid" };
    }

    const size = orientedSize(placement);
    const candidate: TileRectangle = {
      tileX,
      tileY,
      ...size,
    };
    const columns = positiveGridSize(this.bridge.viewModel.gridColumns, 16);
    const rows = positiveGridSize(this.bridge.viewModel.gridRows, 10);
    const insideGrid =
      tileX >= 0 &&
      tileY >= 0 &&
      tileX + size.width <= columns &&
      tileY + size.height <= rows;

    if (!insideGrid) {
      return { valid: false, invalidReason: "outside-grid" };
    }

    const overlaps = this.bridge.viewModel.rooms.some((room) =>
      rectanglesOverlap(candidate, {
        tileX: room.tileX,
        tileY: room.tileY,
        ...orientedSize(room),
      }),
    );
    if (overlaps) {
      return { valid: false, invalidReason: "overlap" };
    }

    return { valid: true, invalidReason: null };
  }

  private roomDoorApproach(
    room: Pick<
      FacilityRoomView,
      "tileX" | "tileY" | "width" | "height" | "doorSide"
    >,
  ): GridPoint | null {
    const side = room.doorSide;
    if (!side) {
      return null;
    }
    const alongX = room.tileX + Math.floor((room.width - 1) / 2);
    const alongY = room.tileY + Math.floor((room.height - 1) / 2);
    if (side === "north") {
      return { x: alongX, y: room.tileY - 1 };
    }
    if (side === "south") {
      return { x: alongX, y: room.tileY + room.height };
    }
    if (side === "west") {
      return { x: room.tileX - 1, y: alongY };
    }
    return { x: room.tileX + room.width, y: alongY };
  }

  private drawPlacementGhost(): void {
    const graphics = this.ghostGraphics;
    if (!graphics) {
      return;
    }

    graphics.clear();
    const ghost = this.placementGhost;
    const placement = this.bridge.viewModel.placement;
    if (!ghost || !placement) {
      this.ghostStatusText?.setVisible(false);
      this.ghostDoorText?.setVisible(false);
      if (placement) {
        this.footerText?.setText(
          `BUILD: ${placement.displayName.toUpperCase()} ${placement.width}×${placement.height} • ROTATION ${placement.orientation ?? 0}° • MOVE OVER MAP`,
        );
      }
      return;
    }

    const size = orientedSize(placement);
    const rectangle = this.toPixels({
      tileX: ghost.tileX,
      tileY: ghost.tileY,
      ...size,
    });
    const border = Math.max(2, Math.floor(this.layout.tileSize * 0.1));
    const roomShade = ghost.valid ? 0xffffff : 0xc5c5c0;

    // Always draw the entire proposed footprint. A translucent fill keeps the
    // grid and collisions legible while the heavy double border reads as the
    // actual rotated room outline rather than a single selected tile.
    graphics.fillStyle(roomShade, ghost.valid ? 0.72 : 0.82);
    graphics.fillRect(
      rectangle.x,
      rectangle.y,
      rectangle.width,
      rectangle.height,
    );
    graphics.lineStyle(border, 0x111111, 1);
    graphics.strokeRect(
      rectangle.x,
      rectangle.y,
      rectangle.width,
      rectangle.height,
    );
    graphics.lineStyle(1, ghost.valid ? 0x777777 : 0xffffff, 1);
    graphics.strokeRect(
      rectangle.x + border + 1,
      rectangle.y + border + 1,
      Math.max(1, rectangle.width - (border + 1) * 2),
      Math.max(1, rectangle.height - (border + 1) * 2),
    );

    const doorSide = inferredPlacementDoorSide(placement);
    if (doorSide) {
      this.drawDoor(graphics, rectangle, doorSide, roomShade);

      const centerX = rectangle.x + rectangle.width / 2;
      const centerY = rectangle.y + rectangle.height / 2;
      const inset = Math.max(8, Math.floor(this.layout.tileSize * 0.62));
      const doorPoint =
        doorSide === "north"
          ? { x: centerX, y: rectangle.y + inset }
          : doorSide === "south"
            ? {
                x: centerX,
                y: rectangle.y + rectangle.height - inset,
              }
            : doorSide === "west"
              ? { x: rectangle.x + inset, y: centerY }
              : {
                  x: rectangle.x + rectangle.width - inset,
                  y: centerY,
                };
      graphics.lineStyle(Math.max(2, border), 0x111111, 1);
      graphics.lineBetween(centerX, centerY, doorPoint.x, doorPoint.y);
      graphics.fillStyle(0x111111, 1);
      const arrow = Math.max(5, Math.floor(this.layout.tileSize * 0.22));
      if (doorSide === "north") {
        graphics.fillTriangle(
          doorPoint.x,
          doorPoint.y - arrow,
          doorPoint.x - arrow,
          doorPoint.y + arrow,
          doorPoint.x + arrow,
          doorPoint.y + arrow,
        );
      } else if (doorSide === "south") {
        graphics.fillTriangle(
          doorPoint.x,
          doorPoint.y + arrow,
          doorPoint.x - arrow,
          doorPoint.y - arrow,
          doorPoint.x + arrow,
          doorPoint.y - arrow,
        );
      } else if (doorSide === "west") {
        graphics.fillTriangle(
          doorPoint.x - arrow,
          doorPoint.y,
          doorPoint.x + arrow,
          doorPoint.y - arrow,
          doorPoint.x + arrow,
          doorPoint.y + arrow,
        );
      } else {
        graphics.fillTriangle(
          doorPoint.x + arrow,
          doorPoint.y,
          doorPoint.x - arrow,
          doorPoint.y - arrow,
          doorPoint.x - arrow,
          doorPoint.y + arrow,
        );
      }

      const approach = this.roomDoorApproach({
        tileX: ghost.tileX,
        tileY: ghost.tileY,
        width: size.width,
        height: size.height,
        doorSide,
      });
      if (approach) {
        const approachRectangle = this.toPixels({
          tileX: approach.x,
          tileY: approach.y,
          width: 1,
          height: 1,
        });
        graphics.lineStyle(Math.max(2, border), 0x111111, 1);
        graphics.strokeRect(
          approachRectangle.x + 2,
          approachRectangle.y + 2,
          Math.max(1, approachRectangle.width - 4),
          Math.max(1, approachRectangle.height - 4),
        );
      }

      const arrowGlyph =
        doorSide === "north"
          ? "↑"
          : doorSide === "east"
            ? "→"
            : doorSide === "south"
              ? "↓"
              : "←";
      const doorLabelPosition =
        doorSide === "north"
          ? {
              x: centerX,
              y: rectangle.y + Math.max(11, this.layout.tileSize * 0.32),
            }
          : doorSide === "south"
            ? {
                x: centerX,
                y:
                  rectangle.y +
                  rectangle.height -
                  Math.max(11, this.layout.tileSize * 0.32),
              }
            : doorSide === "west"
              ? {
                  x: rectangle.x + Math.max(24, this.layout.tileSize * 0.6),
                  y: centerY,
                }
              : {
                  x:
                    rectangle.x +
                    rectangle.width -
                    Math.max(24, this.layout.tileSize * 0.6),
                  y: centerY,
                };
      this.ghostDoorText
        ?.setText(`DOOR ${arrowGlyph}`)
        .setPosition(doorLabelPosition.x, doorLabelPosition.y)
        .setVisible(true);
    } else {
      this.ghostDoorText?.setVisible(false);
    }

    if (ghost.valid) {
      graphics.lineStyle(border, 0x111111, 1);
      graphics.beginPath();
      graphics.moveTo(
        rectangle.x + rectangle.width * 0.25,
        rectangle.y + rectangle.height * 0.55,
      );
      graphics.lineTo(
        rectangle.x + rectangle.width * 0.43,
        rectangle.y + rectangle.height * 0.72,
      );
      graphics.lineTo(
        rectangle.x + rectangle.width * 0.76,
        rectangle.y + rectangle.height * 0.28,
      );
      graphics.strokePath();
    } else {
      graphics.lineStyle(border, 0x111111, 1);
      graphics.lineBetween(
        rectangle.x + border * 2,
        rectangle.y + border * 2,
        rectangle.x + rectangle.width - border * 2,
        rectangle.y + rectangle.height - border * 2,
      );
      graphics.lineBetween(
        rectangle.x + rectangle.width - border * 2,
        rectangle.y + border * 2,
        rectangle.x + border * 2,
        rectangle.y + rectangle.height - border * 2,
      );
    }

    const invalidMessage =
      ghost.invalidReason === "outside-grid"
        ? "ROOM MUST FIT INSIDE THE MAP"
        : "SPACE IS ALREADY OCCUPIED";
    const statusMessage = ghost.valid
      ? "✓ SPACE CLEAR — CLICK TO BUILD"
      : `✕ ${invalidMessage}`;
    const statusAbove = rectangle.y > 54;
    const statusX = Math.max(
      110,
      Math.min(this.scale.width - 110, rectangle.x + rectangle.width / 2),
    );
    this.ghostStatusText
      ?.setText(
        `${placement.displayName.toUpperCase()} • ${size.width}×${size.height} • ${placement.orientation ?? 0}°\n${statusMessage}`,
      )
      .setOrigin(0.5, statusAbove ? 1 : 0)
      .setPosition(
        statusX,
        statusAbove
          ? rectangle.y - 5
          : rectangle.y + rectangle.height + 5,
      )
      .setVisible(true);

    this.footerText?.setText(
      `${ghost.valid ? "✓ READY" : "✕ NOT READY"} • ${placement.displayName.toUpperCase()} ${size.width}×${size.height} • PLACE DOORS SEPARATELY`,
    );
  }

  private getFounderRoom(): FacilityRoomView | undefined {
    return this.bridge.viewModel.rooms.find((room) => room.isFounderRoom);
  }

  private toPixels(rectangle: TileRectangle): {
    x: number;
    y: number;
    width: number;
    height: number;
  } {
    return {
      x: this.layout.originX + rectangle.tileX * this.layout.tileSize,
      y: this.layout.originY + rectangle.tileY * this.layout.tileSize,
      width: rectangle.width * this.layout.tileSize,
      height: rectangle.height * this.layout.tileSize,
    };
  }
}
