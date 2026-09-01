import Phaser from "phaser";
import type {
  CardinalDirection,
  GridPoint,
  PixelAppearanceDescriptor,
  RoomOrientation,
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
  allCanonicalCharacterAtlases,
  canonicalAppearanceVariant,
  characterBitmapLayers,
  characterBitmapRegistration,
  characterAtlasFrameKey,
} from "../art/characterBitmapArt";
import { selectCharacterWalkingPose } from "../art/lateralGaitCycle";
import {
  FIXTURE_SPRITES,
  getFixtureSpriteForOrientation,
  type FixtureId,
} from "../art/fixtureArt";
import {
  ENVIRONMENT_ATLAS_V1,
  ENVIRONMENT_ATLAS_V1_FRAMES,
  FRONT_DESK_V2_ART_FRAMES,
  FRONT_DESK_V2_FIXTURE_OVERRIDES,
  FRONT_DESK_V3_ARCHITECTURE_FRAMES,
  FRONT_DESK_V4_ARCHITECTURE_FRAMES,
  FRONT_DESK_V4_SHELL_LAYOUT,
  SURGERY_CENTER_ARCHITECTURE_COMPONENT_FRAMES,
  EXAMINATION_V2_ARCHITECTURE_FRAMES,
  LANDSCAPING_ATLAS_V1,
  LANDSCAPING_ATLAS_V1_FRAMES,
  LEVEL_ONE_BITMAP_FIXTURE_FRAMES,
  LEVEL_TWO_ROOM_BITMAP_FIXTURE_OVERRIDES,
  PATIENT_CHARACTER_CORE_MAP_ATLASES_V1,
  ROOM_FIXTURE_ATLASES,
  getRoomBitmapFixtureFrame,
  getEnvironmentAtlasFrameKey,
  type EnvironmentAtlasFrameId,
  type FrontDeskV2ArtId,
  type FrontDeskV3ArchitectureId,
  type FrontDeskV4ArchitectureId,
  type LandscapingAtlasFrameId,
} from "../art/bitmapAssetManifest";
import {
  getPhaserTextureKey,
  preloadBitmapAssets,
  registerPhaserAtlasFrames,
} from "../art/bitmapAssetAdapters";
import {
  getFrontDeskV5ArchitectureComponents,
  getFrontDeskV5Projection,
  shouldRenderFrontDeskV5Architecture,
  type FrontDeskV5WallOpening,
} from "./frontDeskV5Architecture";
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
import {
  FRONT_DESK_PRESENTATION,
  getFrontDeskV5StationaryActorDisplay,
  shouldRenderEmptyFrontDeskChair,
  shouldRenderFounderSeatedAtFrontDesk,
  shouldRenderReceptionistSeatedAtFrontDesk,
} from "./frontDeskPresentation";
import {
  getExaminationRoomPresentation,
  isExaminationNorthWallFixtureVisible,
  type ExaminationRoomOrientation,
} from "./examinationRoomPresentation";
import {
  getFiveRoomPresentation,
  isFiveReferenceRoomDefinition,
  isFiveRoomNorthWallFixtureVisible,
} from "./fiveRoomPresentation";
import {
  getExaminationV3ArchitectureComponents,
  type ExaminationDoorOpening,
} from "./examinationV3Architecture";
import {
  getCanonicalHallwayEdgeComponents,
  getCanonicalNorthWallDecorFragments,
  getCanonicalRoomShellLayout,
  isCanonicalEnclosedRoomDefinition,
  type CanonicalRoomWallOpening,
  type CanonicalRoomWallRun,
} from "./canonicalRoomShell";
import {
  getSurgeryCenterArchitectureAtScale,
  SURGERY_CENTER_WALL_GEOMETRY,
} from "./surgeryCenterArchitecture";
import { getFixturePresentationSize } from "./fixturePresentation";
import {
  getExteriorLandscapeCandidates,
  getVisibleExteriorLandscape,
  type ExteriorRectangle,
} from "./exteriorLandscape";
import { getActorPresentationBaseY } from "./exteriorActorPresentation";
import {
  getWorldExteriorHeight,
  getWorldExteriorLayout,
  WORLD_EXTERIOR_BANDS,
} from "./worldExteriorLayout";
import { cleanTreeFrameWhiteGaps } from "../art/treeGapCleanup";
import {
  getRoomVisualLayout,
  getRoomVisualOrientation,
  isRoomVisualDoorSlotClear,
  shouldRenderWorldNorthWallDecor,
  transformRoomLocalFixture,
} from "./roomVisualLayout";
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
  setbackTop: number;
  setbackHeight: number;
  worldBottom: number;
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

  /** Turf stays below room floors so exterior props may be naturally occluded. */
  private terrainGraphics?: Phaser.GameObjects.Graphics;
  private worldGraphics?: Phaser.GameObjects.Graphics;
  /** Separate layers keep authored floor/wall bitmaps independent from domain rooms. */
  private architectureGraphics?: Phaser.GameObjects.Graphics;
  private landscapeGraphics?: Phaser.GameObjects.Graphics;
  private locatorGraphics?: Phaser.GameObjects.Graphics;
  private ghostGraphics?: Phaser.GameObjects.Graphics;
  private readonly fixtureGraphics = new Map<
    string,
    Phaser.GameObjects.Graphics
  >();
  private readonly roomFixtureGraphics = new Map<
    string,
    Phaser.GameObjects.Graphics
  >();
  private readonly environmentSprites = new Map<
    string,
    Phaser.GameObjects.TileSprite
  >();
  /** Authored furniture remains independent from the logical fixture map. */
  private readonly fixtureBitmapImages = new Map<
    string,
    Phaser.GameObjects.Image
  >();
  /** Exterior props stay separate from both terrain and semantic fixtures. */
  private readonly landscapingBitmapImages = new Map<
    string,
    Phaser.GameObjects.Image
  >();
  private readonly characterGraphics = new Map<
    string,
    Phaser.GameObjects.Graphics
  >();
  /** Containers retain two independently authored canonical layers (head +
   * body). They move as one object, so route interpolation never rebuilds
   * bitmap data or replaces an actor mid-walk. */
  private readonly characterBitmapContainers = new Map<
    string,
    Phaser.GameObjects.Container
  >();
  private activeFixtureGraphics = new Set<string>();
  private activeRoomFixtureGraphics = new Set<string>();
  private activeEnvironmentSprites = new Set<string>();
  private activeFixtureBitmapImages = new Set<string>();
  private activeLandscapingBitmapImages = new Set<string>();
  private activeCharacterGraphics = new Set<string>();
  private activeCharacterBitmapContainers = new Set<string>();
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
    setbackTop: 10 * 24 - 24,
    setbackHeight: 24,
    worldBottom: 10 * 24 + 24,
  };

  private placementGhost: PlacementGhost | null = null;
  private characterPhase = 0;
  private frameDeltaMilliseconds = 0;
  private readonly routeMotionTracks = new Map<string, RouteMotionTrack>();
  /** Last horizontal render orientation survives a stationary frame without
   * affecting the domain route or persisted character state. */
  private readonly characterFacingRight = new Map<string, boolean>();
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
  private environmentAtlasLoadRequested = false;
  private environmentAtlasReady = false;
  private landscapingAtlasReady = false;
  private landscapingTreeCleanupReady = false;
  private roomFixtureAtlasesReady = false;
  private characterAtlasesLoadRequested = false;
  private characterAtlasesReady = false;
  /** Seating sheets are requested only when a real patient needs one. */
  private patientPoseAtlasLoadRequested = false;
  private readonly pendingPatientPoseAtlases = new Map<string, import("../art/bitmapAssetManifest").BitmapAssetDescriptor>();

  public constructor(bridge: FacilitySceneBridge) {
    super({ key: "facility-scene" });
    this.bridge = bridge;
  }

  /**
   * Test-only readback from the live Phaser actor objects. This intentionally
   * observes the scene after `drawPixelPerson` chose its texture/frame/flip;
   * it does not call the pure bitmap resolver independently.
   */
  public debugCharacterGaitSnapshot(): Readonly<Record<string, Readonly<{
    atlasId: string | undefined;
    frame: string | undefined;
    flipX: boolean | undefined;
    direction: CharacterDirection | undefined;
    pose: CharacterPose | undefined;
  }>>> {
    return Object.fromEntries([...this.characterBitmapContainers.entries()].map(([key, container]) => {
      const actor = container.getByName("actor") as Phaser.GameObjects.Image | null;
      return [key, {
        atlasId: actor?.getData("gait-atlas-id") as string | undefined,
        frame: actor?.getData("gait-frame") as string | undefined,
        flipX: actor?.getData("gait-flip-x") as boolean | undefined,
        direction: actor?.getData("gait-direction") as CharacterDirection | undefined,
        pose: actor?.getData("gait-pose") as CharacterPose | undefined,
      }];
    }));
  }

  public create(): void {
    this.cameras.main.setBackgroundColor("#7e8476");
    this.cameras.main.setRoundPixels(true);

    this.terrainGraphics = this.add
      .graphics()
      .setDepth(FACILITY_DEPTH_WORLD - 10);
    this.worldGraphics = this.add
      .graphics()
      .setDepth(FACILITY_DEPTH_WORLD);
    this.architectureGraphics = this.add
      .graphics()
      .setDepth(FACILITY_DEPTH_WORLD + 30);
    this.landscapeGraphics = this.add
      .graphics()
      .setDepth(FACILITY_DEPTH_WORLD + 15);
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

    this.ensureEnvironmentAtlas();
    this.ensureCharacterAtlases();
    this.refreshLayout(true);
  }

  /**
   * Dynamic scene construction means the first authored pack starts loading
   * after `create`. Until the image is decoded, the original procedural world
   * remains visible; a missing file therefore never blanks an active clinic.
   */
  private ensureEnvironmentAtlas(): void {
    const textureKey = getPhaserTextureKey(ENVIRONMENT_ATLAS_V1);
    if (this.textures.exists(textureKey)) {
      this.registerEnvironmentAtlasFrames();
      this.registerLandscapingAtlasFrames();
      this.environmentAtlasReady = true;
      this.landscapingAtlasReady = this.textures.exists(
        getPhaserTextureKey(LANDSCAPING_ATLAS_V1),
      );
      this.registerRoomFixtureAtlasFrames();
      this.roomFixtureAtlasesReady = ROOM_FIXTURE_ATLASES.every(
        (asset) => this.textures.exists(getPhaserTextureKey(asset)),
      );
      return;
    }
    if (this.environmentAtlasLoadRequested) return;
    this.environmentAtlasLoadRequested = true;
    preloadBitmapAssets(this.load, [
      ENVIRONMENT_ATLAS_V1,
      LANDSCAPING_ATLAS_V1,
      ...ROOM_FIXTURE_ATLASES,
    ]);
    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      this.environmentAtlasLoadRequested = false;
      if (!this.textures.exists(textureKey)) {
        return;
      }
      this.registerEnvironmentAtlasFrames();
      this.registerLandscapingAtlasFrames();
      this.environmentAtlasReady = true;
      this.landscapingAtlasReady = this.textures.exists(
        getPhaserTextureKey(LANDSCAPING_ATLAS_V1),
      );
      this.registerRoomFixtureAtlasFrames();
      this.roomFixtureAtlasesReady = ROOM_FIXTURE_ATLASES.every(
        (asset) => this.textures.exists(getPhaserTextureKey(asset)),
      );
      // Do not modify model state: this only replaces the render payload.
      this.drawWorld();
    });
    this.load.start();
  }

  /**
   * Character textures load independently from simulation state. A failed
   * decode leaves the existing procedural renderer intact.
   */
  private ensureCharacterAtlases(): void {
    // The map needs movement art, not chart portrait/thumbnail atlases. Keep
    // those UI images browser-loaded on demand instead of occupying Phaser's
    // decoded texture cache.
    const required = [
      ...allCanonicalCharacterAtlases(),
      ...PATIENT_CHARACTER_CORE_MAP_ATLASES_V1,
    ];
    if (required.every((asset) => this.textures.exists(getPhaserTextureKey(asset)))) {
      this.registerCharacterAtlasFrames(required);
      this.characterAtlasesReady = true;
      return;
    }
    if (this.characterAtlasesLoadRequested) return;
    this.characterAtlasesLoadRequested = true;
    preloadBitmapAssets(this.load, required);
    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      this.characterAtlasesLoadRequested = false;
      if (!required.every((asset) => this.textures.exists(getPhaserTextureKey(asset)))) {
        return;
      }
      this.registerCharacterAtlasFrames(required);
      this.characterAtlasesReady = true;
      this.drawCharacters();
    });
    this.load.start();
  }

  private registerCharacterAtlasFrames(
    selected: readonly import("../art/bitmapAssetManifest").BitmapAssetDescriptor[] = allCanonicalCharacterAtlases(),
  ): void {
    for (const asset of selected) {
      const texture = this.textures.get(getPhaserTextureKey(asset));
      const patientV1 = asset.id.includes("character:patients-");
      const columns = 5;
      const rows = patientV1 ? 10 : 6;
      const variants = patientV1 ? 50 : 30;
      const frames = Array.from({ length: variants }, (_, variant) => {
        const column = variant % columns;
        const row = Math.floor(variant / columns);
        const left = Math.floor((column * asset.nativeWidth) / columns);
        const top = Math.floor((row * asset.nativeHeight) / rows);
        const right = Math.floor(((column + 1) * asset.nativeWidth) / columns);
        const bottom = Math.floor(((row + 1) * asset.nativeHeight) / rows);
        return {
          id: `character:${asset.id}:${variant}`,
          atlasId: asset.id,
          sourceRect: { x: left, y: top, width: right - left, height: bottom - top },
          nativeWidth: right - left,
          nativeHeight: bottom - top,
          anchor: { x: (right - left) / 2, y: bottom - top },
          orientation: "all" as const,
          kind: "character" as const,
        };
      });
      registerPhaserAtlasFrames(texture, frames);
    }
  }

  /**
   * Seated map sheets are uncommon and never need to block simulation. Until
   * their one-time decode completes, the existing v3 procedural fallback is
   * shown for that frame only. This does not alter a route or presentation ID.
   */
  private ensurePatientPoseAtlas(
    asset: import("../art/bitmapAssetManifest").BitmapAssetDescriptor,
  ): boolean {
    const textureKey = getPhaserTextureKey(asset);
    if (this.textures.exists(textureKey)) {
      this.registerCharacterAtlasFrames([asset]);
      return true;
    }
    this.pendingPatientPoseAtlases.set(asset.id, asset);
    if (this.patientPoseAtlasLoadRequested) return false;
    this.patientPoseAtlasLoadRequested = true;
    preloadBitmapAssets(this.load, [...this.pendingPatientPoseAtlases.values()]);
    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      this.patientPoseAtlasLoadRequested = false;
      for (const [id, pending] of this.pendingPatientPoseAtlases) {
        if (!this.textures.exists(getPhaserTextureKey(pending))) continue;
        this.registerCharacterAtlasFrames([pending]);
        this.pendingPatientPoseAtlases.delete(id);
      }
      this.drawCharacters();
    });
    this.load.start();
    return false;
  }

  private registerEnvironmentAtlasFrames(): void {
    const texture = this.textures.get(getPhaserTextureKey(ENVIRONMENT_ATLAS_V1));
    registerPhaserAtlasFrames(texture, Object.values(ENVIRONMENT_ATLAS_V1_FRAMES));
  }

  private registerLandscapingAtlasFrames(): void {
    const textureKey = getPhaserTextureKey(LANDSCAPING_ATLAS_V1);
    if (!this.textures.exists(textureKey)) return;
    const cleanedKey = `${textureKey}:tree-gaps-cleaned`;
    if (!this.textures.exists(cleanedKey)) {
      const source = this.textures.get(textureKey).getSourceImage();
      if (source) {
        const cleaned = this.textures.createCanvas(
          cleanedKey,
          LANDSCAPING_ATLAS_V1.nativeWidth,
          LANDSCAPING_ATLAS_V1.nativeHeight,
        );
        if (cleaned) {
          // Phaser may decode this source as an Image, canvas, or ImageBitmap
          // depending on browser/GPU. Canvas 2D accepts all CanvasImageSource
          // variants, so avoid a browser-specific instanceof gate.
          cleaned.context.drawImage(source as CanvasImageSource, 0, 0);
          cleaned.update();
          const pixels = cleaned.getData(
            0,
            0,
            LANDSCAPING_ATLAS_V1.nativeWidth,
            LANDSCAPING_ATLAS_V1.nativeHeight,
          );
          cleanTreeFrameWhiteGaps(
            pixels.data,
            LANDSCAPING_ATLAS_V1.nativeWidth,
            Object.values(LANDSCAPING_ATLAS_V1_FRAMES).filter((frame) =>
              frame.id.startsWith("landscape:tree"),
            ),
          );
          cleaned.putData(pixels, 0, 0);
          cleaned.refresh();
          this.landscapingTreeCleanupReady = true;
        }
      }
    } else {
      this.landscapingTreeCleanupReady = true;
    }
    registerPhaserAtlasFrames(
      this.textures.get(
        this.landscapingTreeCleanupReady ? cleanedKey : textureKey,
      ),
      Object.values(LANDSCAPING_ATLAS_V1_FRAMES),
    );
  }

  private registerRoomFixtureAtlasFrames(): void {
    const fixtureFrames = [
      ...Object.values(LEVEL_ONE_BITMAP_FIXTURE_FRAMES),
      ...Object.values(FRONT_DESK_V2_FIXTURE_OVERRIDES),
      ...Object.values(FRONT_DESK_V2_ART_FRAMES),
      ...Object.values(FRONT_DESK_V3_ARCHITECTURE_FRAMES),
      ...Object.values(FRONT_DESK_V4_ARCHITECTURE_FRAMES),
      ...Object.values(SURGERY_CENTER_ARCHITECTURE_COMPONENT_FRAMES),
      ...Object.values(EXAMINATION_V2_ARCHITECTURE_FRAMES).flatMap((frames) => Object.values(frames)),
      ...Object.values(LEVEL_TWO_ROOM_BITMAP_FIXTURE_OVERRIDES).flatMap((overrides) => Object.values(overrides)),
    ];
    for (const frame of fixtureFrames) {
      if (!frame) continue;
      const texture = this.textures.get(
        getPhaserTextureKey(
          ROOM_FIXTURE_ATLASES.find((asset) => asset.id === frame.atlasId)!,
        ),
      );
      registerPhaserAtlasFrames(texture, [frame]);
    }
  }

  public update(_time: number, delta: number): void {
    const motionFrozen =
      this.bridge.viewModel.paused ||
      Boolean(this.bridge.viewModel.buildMode);
    this.frameDeltaMilliseconds = motionFrozen ? 0 : delta;
    if (!motionFrozen) {
      // Preserve the existing beat duration. Side travel uses those beats for
      // a stride/neutral/stride/neutral cycle; front/back remain two-frame.
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
    const usableWidth = Math.max(1, width);
    const usableHeight = Math.max(1, height);
    // Every constructed room and northmost hallway uses the measured Front
    // Desk v4 envelope. Reserve that shared projection in the camera bounds.
    const wallOverhangTiles = SURGERY_CENTER_WALL_GEOMETRY.northEnvelopeTiles;
    const exteriorTiles =
      WORLD_EXTERIOR_BANDS.setbackTiles +
      WORLD_EXTERIOR_BANDS.sidewalkTiles;
    const fullSiteTileSize = Math.max(
      1,
      Math.floor(
        Math.min(
          usableWidth / columns,
          usableHeight / (rows + wallOverhangTiles + exteriorTiles),
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
              wallOverhangTiles + exteriorTiles),
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
    const worldHeight = getWorldExteriorHeight(tileSize, rows);
    // Entrance-oriented default: the bottom curb is precisely at the lower
    // map edge. It is a world coordinate, not an independently pinned overlay.
    const defaultOriginY = height - worldHeight;
    const requestedOriginX = defaultOriginX + this.cameraView.panX;
    const requestedOriginY = defaultOriginY + this.cameraView.panY;
    const minimumOriginX = Math.min(0, width - gridWidth);
    const maximumOriginX = Math.max(0, width - gridWidth);
    const minimumOriginY = Math.min(0, height - worldHeight);
    const maximumOriginY = Math.max(0, height - worldHeight);
    const originX = Math.max(
      minimumOriginX,
      Math.min(maximumOriginX, requestedOriginX),
    );
    const originY = Math.max(
      minimumOriginY,
      Math.min(maximumOriginY, requestedOriginY),
    );
    const exterior = getWorldExteriorLayout({
      originX,
      originY,
      tileSize,
      gridColumns: columns,
      gridRows: rows,
    });

    return {
      originX,
      originY,
      tileSize,
      width: gridWidth,
      height: gridHeight,
      sidewalkTop: exterior.sidewalkTop,
      sidewalkHeight: exterior.sidewalkHeight,
      setbackTop: exterior.setbackTop,
      setbackHeight: exterior.setbackHeight,
      worldBottom: exterior.worldBottom,
    };
  }

  private drawWorld(): void {
    const graphics = this.worldGraphics;
    if (!graphics) {
      return;
    }
    this.terrainGraphics?.clear();
    this.architectureGraphics?.clear();
    this.landscapeGraphics?.clear();

    const { originX, originY, tileSize, width, height } = this.layout;
    const model = this.bridge.viewModel;
    const columns = positiveGridSize(model.gridColumns, 16);
    const rows = positiveGridSize(model.gridRows, 10);

    this.activeFixtureGraphics = new Set<string>();
    this.activeRoomFixtureGraphics = new Set<string>();
    this.activeEnvironmentSprites = new Set<string>();
    this.activeFixtureBitmapImages = new Set<string>();
    this.activeLandscapingBitmapImages = new Set<string>();
    this.fixtureStableOrder = 0;

    graphics.clear();
    this.drawContinuousTurf(this.terrainGraphics ?? graphics);
    this.drawBuildingGroundShadows(graphics);
    if (model.buildMode || model.placement) {
      graphics.lineStyle(2, PIXEL_PALETTE_NUMBER.ink, 1);
      graphics.strokeRect(originX, originY, width, height);
    }

    this.drawAuthoredEnvironmentSurface();
    this.drawClinicGroundDetails(this.landscapeGraphics ?? graphics);
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
      this.drawBuildGridOverlay(
        this.canRenderAuthoredEnvironment()
          ? (this.architectureGraphics ?? graphics)
          : graphics,
        columns,
        rows,
      );
    }
    (model.doors ?? []).forEach((door) => {
      this.drawExplicitDoor(this.architectureGraphics ?? graphics, door);
    });
    this.drawBuildDoorHighlights(this.architectureGraphics ?? graphics);
    this.drawEnvironment();
    this.drawExterior(this.architectureGraphics ?? graphics);
    this.removeInactiveGraphics(
      this.fixtureGraphics,
      this.activeFixtureGraphics,
    );
    this.removeInactiveGraphics(
      this.roomFixtureGraphics,
      this.activeRoomFixtureGraphics,
    );
    this.removeInactiveEnvironmentSprites();
    this.removeInactiveFixtureBitmapImages();
    this.removeInactiveLandscapingBitmapImages();
  }

  /** World-anchored turf; build cells never influence these stipples. */
  private drawContinuousTurf(graphics: Phaser.GameObjects.Graphics): void {
    const exterior = getWorldExteriorLayout({
      originX: this.layout.originX,
      originY: this.layout.originY,
      tileSize: this.layout.tileSize,
      gridColumns: positiveGridSize(this.bridge.viewModel.gridColumns, 16),
      gridRows: positiveGridSize(this.bridge.viewModel.gridRows, 10),
    });
    const left = exterior.siteLeft;
    const top = exterior.siteTop;
    const width = exterior.siteWidth;
    const height = exterior.sidewalkTop - top;
    graphics.fillStyle(0x9ba187, 1);
    graphics.fillRect(left, top, width, height);
    const firstRow = Math.floor(top / 7);
    const lastRow = Math.ceil((top + height) / 7);
    const firstColumn = Math.floor(left / 9);
    const lastColumn = Math.ceil((left + width) / 9);
    for (let row = firstRow; row < lastRow; row += 1) {
      for (let column = firstColumn; column < lastColumn; column += 1) {
        // A tiny stable integer hash provides varied grass flecks without
        // per-frame RNG, visible checker cells, or persisted decoration.
        const hash = ((column * 1103515245) ^ (row * 12345)) >>> 0;
        const x = column * 9 + ((hash >>> 4) % 6);
        const y = row * 7 + ((hash >>> 10) % 5);
        if (x < left || x >= left + width || y < top || y >= top + height) continue;
        graphics.fillStyle((hash & 1) === 0 ? 0xb5baa0 : 0x74805f, 0.34);
        graphics.fillRect(x, y, 1 + ((hash >>> 16) % 2), 1);
        if ((hash & 31) === 0) {
          graphics.fillRect(x + 2, y - 1, 1, 2);
        }
      }
    }
  }

  /** A restrained contact shadow grounds rooms without adding any collision. */
  private drawBuildingGroundShadows(graphics: Phaser.GameObjects.Graphics): void {
    const offset = Math.max(2, Math.floor(this.layout.tileSize * 0.09));
    for (const room of this.bridge.viewModel.rooms) {
      const rectangle = this.toPixels({
        tileX: room.tileX,
        tileY: room.tileY,
        ...orientedSize(room),
      });
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.shadow, 0.2);
      graphics.fillRect(
        rectangle.x + offset,
        rectangle.y + offset,
        rectangle.width,
        rectangle.height,
      );
    }
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

  private removeInactiveEnvironmentSprites(): void {
    for (const [key, sprite] of this.environmentSprites) {
      if (!this.activeEnvironmentSprites.has(key)) {
        sprite.destroy();
        this.environmentSprites.delete(key);
      }
    }
  }

  private removeInactiveFixtureBitmapImages(): void {
    for (const [key, image] of this.fixtureBitmapImages) {
      if (!this.activeFixtureBitmapImages.has(key)) {
        image.destroy();
        this.fixtureBitmapImages.delete(key);
      }
    }
  }

  private removeInactiveLandscapingBitmapImages(): void {
    for (const [key, image] of this.landscapingBitmapImages) {
      if (!this.activeLandscapingBitmapImages.has(key)) {
        image.destroy();
        this.landscapingBitmapImages.delete(key);
      }
    }
  }

  private canRenderAuthoredFixture(id: FixtureId, roomDefinitionId = ""): boolean {
    const frame = getRoomBitmapFixtureFrame(roomDefinitionId, id);
    return Boolean(
      frame &&
      this.roomFixtureAtlasesReady &&
      this.textures.exists(
        getPhaserTextureKey(
          ROOM_FIXTURE_ATLASES.find((asset) => asset.id === frame.atlasId)!,
        ),
      ),
    );
  }

  private drawAuthoredFixture(
    key: string,
    id: FixtureId,
    roomDefinitionId: string,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    depth: number,
    alpha: number,
    rotationDegrees = 0,
  ): boolean {
    const frame = getRoomBitmapFixtureFrame(roomDefinitionId, id);
    if (!frame || !this.canRenderAuthoredFixture(id, roomDefinitionId)) return false;
    const atlas = ROOM_FIXTURE_ATLASES.find(
      (asset) => asset.id === frame.atlasId,
    );
    if (!atlas) return false;
    let image = this.fixtureBitmapImages.get(key);
    const frameKey = getEnvironmentAtlasFrameKey(frame);
    if (!image) {
      image = this.add.image(centerX, centerY, getPhaserTextureKey(atlas), frameKey);
      this.fixtureBitmapImages.set(key, image);
    }
    image
      .setTexture(getPhaserTextureKey(atlas), frameKey)
      .setPosition(Math.round(centerX), Math.round(centerY))
      .setOrigin(
        rotationDegrees === 0
          ? frame.anchor.x / Math.max(1, frame.nativeWidth)
          : 0.5,
        rotationDegrees === 0
          ? frame.anchor.y / Math.max(1, frame.nativeHeight)
          : 0.5,
      )
      // `width`/`height` describe the on-screen footprint. A quarter-turn
      // swaps the image's pre-rotation display axes while retaining that
      // authored footprint for depth, shadows, and clipping.
      .setDisplaySize(
        Math.max(1, Math.round(rotationDegrees % 180 === 0 ? width : height)),
        Math.max(1, Math.round(rotationDegrees % 180 === 0 ? height : width)),
      )
      .setAngle(rotationDegrees)
      .setDepth(depth)
      .setAlpha(alpha)
      .setVisible(true);
    this.activeFixtureBitmapImages.add(key);
    return true;
  }

  /** Draws one independent Front Desk v2 architectural/decoration component. */
  private drawFrontDeskV2Art(
    key: string,
    id: FrontDeskV2ArtId,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    depth: number,
    alpha = 1,
  ): boolean {
    const frame = FRONT_DESK_V2_ART_FRAMES[id];
    const atlas = ROOM_FIXTURE_ATLASES.find(
      (asset) => asset.id === frame.atlasId,
    );
    if (!atlas || !this.textures.exists(getPhaserTextureKey(atlas))) return false;
    let image = this.fixtureBitmapImages.get(key);
    const frameKey = getEnvironmentAtlasFrameKey(frame);
    if (!image) {
      image = this.add.image(centerX, centerY, getPhaserTextureKey(atlas), frameKey);
      this.fixtureBitmapImages.set(key, image);
    }
    image
      .setTexture(getPhaserTextureKey(atlas), frameKey)
      .setPosition(Math.round(centerX), Math.round(centerY))
      .setOrigin(0.5, 0.5)
      .setDisplaySize(Math.max(1, Math.round(width)), Math.max(1, Math.round(height)))
      .setDepth(depth)
      .setAlpha(alpha)
      .setVisible(true);
    this.activeFixtureBitmapImages.add(key);
    return true;
  }

  private canRenderFrontDeskV2Art(): boolean {
    const atlas = ROOM_FIXTURE_ATLASES.find(
      (asset) => asset.id === "room-fixtures:front-desk-v2",
    );
    return Boolean(atlas && this.textures.exists(getPhaserTextureKey(atlas)));
  }

  private canRenderFrontDeskV4Architecture(): boolean {
    const atlas = ROOM_FIXTURE_ATLASES.find(
      (asset) => asset.id === "room-fixtures:front-desk-v4",
    );
    return Boolean(atlas && this.textures.exists(getPhaserTextureKey(atlas)));
  }

  private canRenderFrontDeskV5Architecture(): boolean {
    const atlas = ROOM_FIXTURE_ATLASES.find(
      (asset) => asset.id === "room-fixtures:front-desk-v3",
    );
    return Boolean(atlas && this.textures.exists(getPhaserTextureKey(atlas)));
  }

  private drawFrontDeskV4ArchitectureArt(
    key: string,
    id: FrontDeskV4ArchitectureId,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    depth: number,
    alpha = 1,
  ): boolean {
    const frame = FRONT_DESK_V4_ARCHITECTURE_FRAMES[id];
    const atlas = ROOM_FIXTURE_ATLASES.find(
      (asset) => asset.id === frame.atlasId,
    );
    if (!atlas || !this.textures.exists(getPhaserTextureKey(atlas))) return false;
    let image = this.fixtureBitmapImages.get(key);
    const frameKey = getEnvironmentAtlasFrameKey(frame);
    if (!image) {
      image = this.add.image(centerX, centerY, getPhaserTextureKey(atlas), frameKey);
      this.fixtureBitmapImages.set(key, image);
    }
    image
      .setTexture(getPhaserTextureKey(atlas), frameKey)
      .setPosition(Math.round(centerX), Math.round(centerY))
      .setOrigin(0.5, 0.5)
      .setDisplaySize(Math.max(1, Math.round(width)), Math.max(1, Math.round(height)))
      .setDepth(depth)
      .setAlpha(alpha)
      .setVisible(true);
    this.activeFixtureBitmapImages.add(key);
    return true;
  }

  private drawFrontDeskV3ArchitectureArt(
    key: string,
    id: FrontDeskV3ArchitectureId,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    depth: number,
    tint?: number,
  ): boolean {
    const frame = FRONT_DESK_V3_ARCHITECTURE_FRAMES[id];
    const atlas = ROOM_FIXTURE_ATLASES.find(
      (asset) => asset.id === frame.atlasId,
    );
    if (!atlas || !this.textures.exists(getPhaserTextureKey(atlas))) return false;
    let image = this.fixtureBitmapImages.get(key);
    const frameKey = getEnvironmentAtlasFrameKey(frame);
    if (!image) {
      image = this.add.image(centerX, centerY, getPhaserTextureKey(atlas), frameKey);
      this.fixtureBitmapImages.set(key, image);
    }
    image
      .setTexture(getPhaserTextureKey(atlas), frameKey)
      .setPosition(Math.round(centerX), Math.round(centerY))
      .setOrigin(0.5, 0.5)
      .setDisplaySize(Math.max(1, Math.round(width)), Math.max(1, Math.round(height)))
      .setDepth(depth)
      .setAlpha(1)
      .setVisible(true);
    if (tint === undefined) image.clearTint();
    else image.setTint(tint);
    this.activeFixtureBitmapImages.add(key);
    return true;
  }

  /**
   * Front Desk v5 is deliberately assembled from target-family v3 components,
   * rather than reusing the rejected v4 full-shell silhouette. Its projection
   * is display-only: logical tiles, paths, doors, and saves stay unchanged.
   */
  private drawFrontDeskV5Architecture(
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
  ): void {
    if (room.definitionId !== "room.front_desk" || !this.canRenderFrontDeskV5Architecture()) {
      return;
    }
    const projection = getFrontDeskV5Projection(rectangle);
    const openings: readonly FrontDeskV5WallOpening[] = (this.bridge.viewModel.doors ?? [])
      .filter((door) => door.roomInstanceId === room.instanceId)
      .map((door) => ({ side: door.side, offset: door.offset }));
    const components = getFrontDeskV5ArchitectureComponents(projection, openings);
    for (const component of components) {
      const { bounds } = component;
      this.drawFrontDeskV3ArchitectureArt(
        `front-desk-v5:${component.key}:${room.instanceId}`,
        component.frameId,
        bounds.x + bounds.width / 2,
        bounds.y + bounds.height / 2,
        bounds.width,
        bounds.height,
        component.layer === "front-occluder"
          // The low south wall shares the same baseline depth contract as
          // actors and fixtures. Interior contacts sort behind it; sidewalk
          // contacts below the building naturally remain in front.
          ? getFacilitySceneDepth(projection.southEntranceY, "fixture", 63)
          : FACILITY_DEPTH_WORLD + 4,
      );
    }
  }

  /**
   * The non-founder rooms keep their authored floors and fixture packages, but
   * share the Front Desk component envelope.  In particular, this deliberately
   * reads persisted doors only: touching rooms never remove a wall segment.
   */
  private drawCanonicalEnclosedRoomShell(
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
  ): void {
    if (!this.canRenderFrontDeskV5Architecture()) return;
    const openings: readonly CanonicalRoomWallOpening[] = (this.bridge.viewModel.doors ?? [])
      .filter((door) => door.roomInstanceId === room.instanceId)
      .map((door) => ({ side: door.side, offset: door.offset }));
    const shell = getCanonicalRoomShellLayout(
      rectangle,
      orientedSize(room),
      openings,
      false,
      { id: `room-skin:${room.definitionId}` },
    );
    const tint = this.roomWallFaceColor(room);
    for (const component of shell.components) {
      const { bounds } = component;
      this.drawFrontDeskV3ArchitectureArt(
        `canonical-room:${room.instanceId}:${component.key}`,
        component.frameId,
        bounds.x + bounds.width / 2,
        bounds.y + bounds.height / 2,
        bounds.width,
        bounds.height,
        component.layer === "front-occluder"
          ? getFacilitySceneDepth(rectangle.y + rectangle.height, "fixture", 63)
          : FACILITY_DEPTH_WORLD + 4,
        tint,
      );
    }
  }

  /** Draws only actual hallway perimeter strips; it never closes circulation. */
  private drawCanonicalHallwayExposedEdges(
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
  ): void {
    if (!this.canRenderFrontDeskV5Architecture()) return;
    const horizontal = (side: "north" | "south") => this.getGroupedHallwayHorizontalRuns(room, side);
    const vertical = (side: "east" | "west") => this.getGroupedHallwayVerticalRuns(room, side);
    const components = getCanonicalHallwayEdgeComponents(
      rectangle,
      orientedSize(room),
      {
        north: horizontal("north"),
        east: vertical("east"),
        south: horizontal("south"),
        west: vertical("west"),
      },
      { id: "hallway-paper" },
    );
    for (const component of components) {
      const { bounds } = component;
      this.drawFrontDeskV3ArchitectureArt(
        `canonical-hallway:${room.instanceId}:${component.key}`,
        component.frameId,
        bounds.x + bounds.width / 2,
        bounds.y + bounds.height / 2,
        bounds.width,
        bounds.height,
        component.layer === "front-occluder"
          ? getFacilitySceneDepth(rectangle.y + rectangle.height, "fixture", 63)
          : FACILITY_DEPTH_WORLD + 4,
        PIXEL_PALETTE_NUMBER.paper,
      );
    }
  }

  private getGroupedHallwayHorizontalRuns(
    room: FacilityRoomView,
    side: "north" | "south",
  ): readonly CanonicalRoomWallRun[] {
    const tile = this.layout.tileSize;
    const hallwayAt = (x: number, y: number) => this.bridge.viewModel.rooms.find((candidate) => {
      const size = orientedSize(candidate);
      return (candidate.kind === "hallway" || candidate.definitionId === "room.hallway")
        && x >= candidate.tileX && x < candidate.tileX + size.width
        && y >= candidate.tileY && y < candidate.tileY + size.height;
    });
    const exposedAt = (candidate: FacilityRoomView, x: number) => this.exposedBoundaryRuns(candidate, side)
      .some((run) => x >= candidate.tileX + run.offset && x < candidate.tileX + run.offset + run.length);
    const edgeY = side === "north" ? room.tileY : room.tileY + orientedSize(room).height - 1;
    return this.exposedBoundaryRuns(room, side).flatMap((run) => {
      const start = room.tileX + run.offset;
      const left = hallwayAt(start - 1, edgeY);
      if (left && exposedAt(left, start - 1)) return [];
      let end = start + run.length;
      for (;;) {
        const next = hallwayAt(end, edgeY);
        if (!next || !exposedAt(next, end)) break;
        end += 1;
      }
      return [{ start: run.offset * tile, length: (end - start) * tile }];
    });
  }

  private getGroupedHallwayVerticalRuns(
    room: FacilityRoomView,
    side: "east" | "west",
  ): readonly CanonicalRoomWallRun[] {
    const tile = this.layout.tileSize;
    const hallwayAt = (x: number, y: number) => this.bridge.viewModel.rooms.find((candidate) => {
      const size = orientedSize(candidate);
      return (candidate.kind === "hallway" || candidate.definitionId === "room.hallway")
        && x >= candidate.tileX && x < candidate.tileX + size.width
        && y >= candidate.tileY && y < candidate.tileY + size.height;
    });
    const exposedAt = (candidate: FacilityRoomView, y: number) => getExposedVerticalBoundaryRuns(candidate, this.bridge.viewModel.rooms, side)
      .some((run) => y >= candidate.tileY + run.offset && y < candidate.tileY + run.offset + run.length);
    const edgeX = side === "west" ? room.tileX : room.tileX + orientedSize(room).width - 1;
    return getExposedVerticalBoundaryRuns(room, this.bridge.viewModel.rooms, side).flatMap((run) => {
      const start = room.tileY + run.offset;
      const above = hallwayAt(edgeX, start - 1);
      if (above && exposedAt(above, start - 1)) return [];
      let end = start + run.length;
      for (;;) {
        const next = hallwayAt(edgeX, end);
        if (!next || !exposedAt(next, end)) break;
        end += 1;
      }
      return [{ start: run.offset * tile, length: (end - start) * tile }];
    });
  }

  /**
   * Maps the authored shell's measured five-column by four-row floor directly
   * to the semantic Front Desk footprint.  The surrounding frame is allowed
   * to extend beyond the logical rectangle, exactly as a cutaway room does.
   */
  private drawFrontDeskV4Architecture(
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
  ): void {
    if (room.definitionId !== "room.front_desk" || !this.canRenderFrontDeskV4Architecture()) {
      return;
    }
    // Measured in the 1254px transparent source: floor x=212..1043,
    // y=339..960.  This is intentionally measured art geometry, never a
    // guessed tile sample.  The two scale axes preserve its 5-by-4 logical
    // alignment while keeping the mockup's shallow cutaway perspective.
    const sourceFloor = FRONT_DESK_V4_SHELL_LAYOUT.floor;
    const sourceSize = FRONT_DESK_V4_SHELL_LAYOUT.sourceSize;
    const scaleX = rectangle.width / sourceFloor.width;
    const scaleY = rectangle.height / sourceFloor.height;
    const shellWidth = sourceSize * scaleX;
    const shellHeight = sourceSize * scaleY;
    const shellLeft = rectangle.x - sourceFloor.x * scaleX;
    const shellTop = rectangle.y - sourceFloor.y * scaleY;
    this.drawFrontDeskV4ArchitectureArt(
      `front-desk-v4:shell:${room.instanceId}`,
      "shell",
      shellLeft + shellWidth / 2,
      shellTop + shellHeight / 2,
      shellWidth,
      shellHeight,
      FACILITY_DEPTH_WORLD + 4,
    );
    if (this.canRenderFrontDeskV2Art()) {
      // These stay independent v2 sprites, but their placement is measured in
      // the v4 source coordinate system so they occupy the large light rear
      // wall face rather than the shell's lower trim.
      const noticeBoard = FRONT_DESK_V4_SHELL_LAYOUT.rearWallDecor.noticeBoard;
      this.drawFrontDeskV2Art(
        `front-desk-v2:notice:${room.instanceId}`,
        "noticeBoard",
        shellLeft + noticeBoard.centerX * scaleX,
        shellTop + noticeBoard.centerY * scaleY,
        noticeBoard.width * scaleX,
        noticeBoard.height * scaleY,
        FACILITY_DEPTH_WORLD + 21,
      );
      const wallClock = FRONT_DESK_V4_SHELL_LAYOUT.rearWallDecor.wallClock;
      this.drawFrontDeskV2Art(
        `front-desk-v2:clock:${room.instanceId}`,
        "wallClock",
        shellLeft + wallClock.centerX * scaleX,
        shellTop + wallClock.centerY * scaleY,
        wallClock.width * scaleX,
        wallClock.height * scaleY,
        FACILITY_DEPTH_WORLD + 21,
      );
    }
    // Repeat the low south wall plus jamb crop over live actors.  The shell
    // itself remains behind them so the rear architecture cannot conceal
    // furniture or paths; this crop alone supplies foreground threshold
    // occlusion.  Explicit door art renders later at depth +30.
    const frontCrop = FRONT_DESK_V4_SHELL_LAYOUT.frontOccluder;
    this.drawFrontDeskV4ArchitectureArt(
      `front-desk-v4:front-occluder:${room.instanceId}`,
      "frontOccluder",
      shellLeft + (frontCrop.x + frontCrop.width / 2) * scaleX,
      shellTop + (frontCrop.y + frontCrop.height / 2) * scaleY,
      frontCrop.width * scaleX,
      frontCrop.height * scaleY,
      FACILITY_DEPTH_WORLD + 29,
    );
  }

  /** A full Front Desk bitmap is safe only while no horizontal boundary is
   * shared. Examination always uses this composable path so its north envelope
   * remains identical to Front Desk v4 in both authored orientations and can
   * hide only covered runs. */
  private requiresBoundaryAwareSurgeryCenterShell(room: FacilityRoomView): boolean {
    if (room.definitionId === "room.examination") return true;
    if (room.definitionId !== "room.front_desk") return false;
    const width = orientedSize(room).width;
    const exposed = (side: "north" | "south") => this.exposedBoundaryRuns(room, side)
      .reduce((sum, run) => sum + run.length, 0);
    return exposed("north") !== width || exposed("south") !== width;
  }

  /**
   * Boundary-aware surgery-center shell. All dimensions come from the
   * measured Front Desk v4 contract; the only varying values are floor and
   * wall-face materials. Every wall fragment is drawn at native scale and
   * omitted, never squeezed, where another room owns the shared boundary.
   */
  private drawBoundaryAwareSurgeryCenterShell(
    graphics: Phaser.GameObjects.Graphics,
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
  ): void {
    const geometry = getSurgeryCenterArchitectureAtScale(this.layout.tileSize);
    const northRuns = this.exposedBoundaryRuns(room, "north");
    const southRuns = this.exposedBoundaryRuns(room, "south");
    const isExamination = room.definitionId === "room.examination";
    const wallFace = this.roomWallFaceColor(room);
    const floor = this.roomFloorColor(room, 0);
    graphics.fillStyle(PIXEL_PALETTE_NUMBER.shadow, 0.26);
    graphics.fillRect(
      rectangle.x + geometry.shadowOffset.x,
      rectangle.y + geometry.shadowOffset.y,
      rectangle.width,
      rectangle.height,
    );
    graphics.fillStyle(floor, 1);
    graphics.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    if (isExamination) {
      // The shared construction defines only the envelope. Examination keeps
      // its own clinical flooring rather than inheriting Front Desk grout.
      this.drawRoomFloor(graphics, room, rectangle, floor);
      this.drawAuthoredRoomFloor(room, rectangle);
    } else {
      this.drawSurgeryCenterComponentTile(
        `surgery-center:floor:${room.instanceId}`,
        "floor", rectangle.x, rectangle.y, rectangle.width, rectangle.height,
        FACILITY_DEPTH_WORLD + 5, this.layout.tileSize / (832 / 5), this.layout.tileSize / (622 / 4),
      );
    }
    // Side thickness and trim live outside the logical floor, so an adjacent
    // room retains its full semantic footprint and material.
    for (const side of ["west", "east"] as const) {
      for (const run of getExposedVerticalBoundaryRuns(room, this.bridge.viewModel.rooms, side)) {
        const x = side === "west"
          ? rectangle.x - geometry.sideThickness
          : rectangle.x + rectangle.width;
        const y = rectangle.y + run.offset * this.layout.tileSize;
        const height = run.length * this.layout.tileSize;
        graphics.fillStyle(PIXEL_PALETTE_NUMBER.ink, 1);
        graphics.fillRect(x, y, geometry.sideThickness, height);
        graphics.fillStyle(PIXEL_PALETTE_NUMBER.charcoal, 1);
        graphics.fillRect(x + geometry.outerBorderX, y + geometry.outerBorderY,
          Math.max(1, geometry.sideThickness - geometry.outerBorderX * 2),
          Math.max(1, height - geometry.outerBorderY * 2));
        if (isExamination) {
          this.drawEnvironmentTile(
            `environment:exam-side:${room.instanceId}:${side}:${run.offset}`,
            "environment:side-wall",
            x,
            y,
            geometry.sideThickness,
            height,
            FACILITY_DEPTH_WORLD + 10,
            Math.max(0.02, geometry.sideThickness / ENVIRONMENT_ATLAS_V1_FRAMES["environment:side-wall"].nativeWidth),
          );
        } else {
          this.drawSurgeryCenterComponentTile(
            `surgery-center:side:${room.instanceId}:${side}:${run.offset}`,
            "side", x, y, geometry.sideThickness, height,
            FACILITY_DEPTH_WORLD + 10, this.layout.tileSize / (832 / 5), this.layout.tileSize / (622 / 4),
          );
        }
      }
    }
    for (const run of northRuns) {
      const x = rectangle.x + run.offset * this.layout.tileSize;
      const width = run.length * this.layout.tileSize;
      const top = rectangle.y - geometry.northEnvelope;
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.ink, 1);
      graphics.fillRect(x, top, width, geometry.northEnvelope);
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.charcoal, 1);
      graphics.fillRect(x + geometry.outerBorderX, top + geometry.outerBorderY,
        Math.max(1, width - geometry.outerBorderX * 2),
        Math.max(1, geometry.northEnvelope - geometry.outerBorderY * 2));
      graphics.fillStyle(wallFace, 1);
      graphics.fillRect(x + geometry.bevelX, top + geometry.bevelY * 2,
        Math.max(1, width - geometry.bevelX * 2),
        Math.max(1, geometry.northEnvelope - geometry.baseboard - geometry.bevelY * 3));
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.highlight, 0.5);
      graphics.fillRect(x + geometry.bevelX, top + geometry.bevelY * 2,
        Math.max(1, width - geometry.bevelX * 2), Math.max(1, geometry.bevelY));
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.deepOlive, 1);
      graphics.fillRect(x + geometry.bevelX, rectangle.y - geometry.baseboard,
        Math.max(1, width - geometry.bevelX * 2), geometry.baseboard);
      if (isExamination) {
        this.drawEnvironmentTile(
          `environment:exam-north:${room.instanceId}:${run.offset}`,
          "environment:north-wall",
          x,
          top,
          width,
          geometry.northEnvelope,
          FACILITY_DEPTH_WORLD + 11,
          Math.max(0.02, geometry.northEnvelope / ENVIRONMENT_ATLAS_V1_FRAMES["environment:north-wall"].nativeHeight),
        );
      } else {
        this.drawSurgeryCenterComponentTile(
          `surgery-center:north:${room.instanceId}:${run.offset}`,
          "north", x, top, width, geometry.northEnvelope,
          FACILITY_DEPTH_WORLD + 11, this.layout.tileSize / (832 / 5), this.layout.tileSize / (622 / 4),
        );
      }
    }
    // The foreground crop is present only on exposed south runs: its measured
    // 20px inset is inside this floor, while its 133px extent projects below.
    for (const run of southRuns) {
      const x = rectangle.x + run.offset * this.layout.tileSize;
      const width = run.length * this.layout.tileSize;
      const y = rectangle.y + rectangle.height - geometry.foregroundInset;
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.ink, 1);
      graphics.fillRect(x, y, width, geometry.foregroundInset + geometry.foregroundOutset);
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.charcoal, 1);
      graphics.fillRect(x + geometry.outerBorderX, y + geometry.outerBorderY,
        Math.max(1, width - geometry.outerBorderX * 2),
        Math.max(1, geometry.foregroundInset + geometry.foregroundOutset - geometry.outerBorderY * 2));
      if (isExamination) {
        // Keep the exam-room material at the low foreground threshold too.
        graphics.fillStyle(wallFace, 0.72);
        graphics.fillRect(
          x + geometry.bevelX,
          y + geometry.outerBorderY,
          Math.max(1, width - geometry.bevelX * 2),
          Math.max(1, geometry.foregroundInset + geometry.foregroundOutset - geometry.outerBorderY * 2),
        );
      } else {
        this.drawSurgeryCenterComponentTile(
          `surgery-center:front:${room.instanceId}:${run.offset}`,
          "front", x, y, width, geometry.foregroundInset + geometry.foregroundOutset,
          FACILITY_DEPTH_WORLD + 29, this.layout.tileSize / (832 / 5), this.layout.tileSize / (622 / 4),
        );
      }
    }
  }

  /** Examination v3 owns a complete cutaway envelope: adjacency never makes
   * an opening. Only a live explicit door subtracts its own logical slot. */
  private drawExaminationV3Architecture(
    graphics: Phaser.GameObjects.Graphics,
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
  ): void {
    const size = orientedSize(room);
    const openings: ExaminationDoorOpening[] = (this.bridge.viewModel.doors ?? [])
      .filter((door) => door.roomInstanceId === room.instanceId)
      .map((door) => ({ side: door.side, offset: door.offset }));
    const floor = this.roomFloorColor(room, 0);
    graphics.fillStyle(PIXEL_PALETTE_NUMBER.shadow, 0.25);
    graphics.fillRect(rectangle.x + 3, rectangle.y + 4, rectangle.width, rectangle.height);
    graphics.fillStyle(floor, 1);
    graphics.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    this.drawRoomFloor(graphics, room, rectangle, floor);
    this.drawAuthoredRoomFloor(room, rectangle);
    if (!this.canRenderFrontDeskV5Architecture()) return;
    const components = getExaminationV3ArchitectureComponents(rectangle, size, openings);
    for (const component of components) {
      const { bounds } = component;
      this.drawFrontDeskV3ArchitectureArt(
        `examination-v3:${component.key}:${room.instanceId}`,
        component.frameId,
        bounds.x + bounds.width / 2,
        bounds.y + bounds.height / 2,
        bounds.width,
        bounds.height,
        component.layer === "front-occluder"
          ? getFacilitySceneDepth(rectangle.y + rectangle.height, "fixture", 63)
          : FACILITY_DEPTH_WORLD + 4,
      );
    }
  }

  private drawExaminationV3Foreground(room: FacilityRoomView, rectangle: { x: number; y: number; width: number; height: number }): void {
    if (room.definitionId !== "room.examination") return;
    // Front Desk-derived foreground component art is already rendered at the
    // sortable threshold above; this retained seam keeps later fixture work
    // from accidentally reintroducing a procedural Examination-only lip.
  }

  private canRenderAuthoredEnvironment(): boolean {
    return (
      this.environmentAtlasReady &&
      this.textures.exists(getPhaserTextureKey(ENVIRONMENT_ATLAS_V1))
    );
  }

  private canRenderAuthoredLandscaping(): boolean {
    return (
      this.landscapingAtlasReady &&
      this.textures.exists(getPhaserTextureKey(LANDSCAPING_ATLAS_V1))
    );
  }

  private drawAuthoredLandscaping(
    key: string,
    id: LandscapingAtlasFrameId,
    centerX: number,
    baseY: number,
    width: number,
    height: number,
    alpha = 1,
    depth = FACILITY_DEPTH_WORLD - 5,
  ): boolean {
    if (!this.canRenderAuthoredLandscaping()) return false;
    const frame = LANDSCAPING_ATLAS_V1_FRAMES[id];
    const landscapingTextureKey = this.landscapingTreeCleanupReady
      ? `${getPhaserTextureKey(LANDSCAPING_ATLAS_V1)}:tree-gaps-cleaned`
      : getPhaserTextureKey(LANDSCAPING_ATLAS_V1);
    let image = this.landscapingBitmapImages.get(key);
    if (!image) {
      image = this.add.image(
        centerX,
        baseY,
        landscapingTextureKey,
        getEnvironmentAtlasFrameKey(frame),
      );
      this.landscapingBitmapImages.set(key, image);
    }
    image
      .setTexture(
        landscapingTextureKey,
        getEnvironmentAtlasFrameKey(frame),
      )
      .setPosition(Math.round(centerX), Math.round(baseY))
      .setOrigin(
        frame.anchor.x / Math.max(1, frame.nativeWidth),
        frame.anchor.y / Math.max(1, frame.nativeHeight),
      )
      .setDisplaySize(Math.max(1, Math.round(width)), Math.max(1, Math.round(height)))
      .setDepth(depth)
      .setAlpha(alpha)
      .setVisible(true);
    this.activeLandscapingBitmapImages.add(key);
    return true;
  }

  /**
   * Creates a separate tile layer for a semantic environmental surface. The
   * atlas source remains at its authored aspect ratio; Phaser tiles/crops it
   * into the logical rectangle instead of stretching a partial wall or floor.
   */
  private drawEnvironmentTile(
    key: string,
    frameId: EnvironmentAtlasFrameId,
    x: number,
    y: number,
    width: number,
    height: number,
    depth: number,
    tileScale: number,
    alpha = 1,
  ): void {
    if (!this.canRenderAuthoredEnvironment()) return;
    const frame = ENVIRONMENT_ATLAS_V1_FRAMES[frameId];
    const textureKey = getPhaserTextureKey(ENVIRONMENT_ATLAS_V1);
    const frameKey = getEnvironmentAtlasFrameKey(frame);
    let sprite = this.environmentSprites.get(key);
    if (!sprite) {
      sprite = this.add.tileSprite(x, y, width, height, textureKey, frameKey);
      sprite.setOrigin(0, 0);
      this.environmentSprites.set(key, sprite);
    }
    sprite
      .setTexture(textureKey, frameKey)
      .setPosition(x, y)
      .setSize(Math.max(1, width), Math.max(1, height))
      .setTileScale(Math.max(0.02, tileScale))
      .setAlpha(alpha)
      .setDepth(depth)
      .setVisible(true);
    // Align repeated material with map coordinates so a room redraw or resize
    // cannot make a floor texture shimmer beneath a stationary character.
    sprite.tilePositionX = Math.round(-x / Math.max(0.02, tileScale));
    sprite.tilePositionY = Math.round(-y / Math.max(0.02, tileScale));
    this.activeEnvironmentSprites.add(key);
  }

  /** Tiles an unscaled native Front Desk-v4-derived architecture component. */
  private drawSurgeryCenterComponentTile(
    key: string,
    id: keyof typeof SURGERY_CENTER_ARCHITECTURE_COMPONENT_FRAMES,
    x: number,
    y: number,
    width: number,
    height: number,
    depth: number,
    scaleX: number,
    scaleY: number,
  ): void {
    const frame = SURGERY_CENTER_ARCHITECTURE_COMPONENT_FRAMES[id];
    const atlas = ROOM_FIXTURE_ATLASES.find((asset) => asset.id === frame.atlasId);
    if (!atlas || !this.textures.exists(getPhaserTextureKey(atlas))) return;
    const textureKey = getPhaserTextureKey(atlas);
    let sprite = this.environmentSprites.get(key);
    if (!sprite) {
      sprite = this.add.tileSprite(x, y, width, height, textureKey, getEnvironmentAtlasFrameKey(frame));
      sprite.setOrigin(0, 0);
      this.environmentSprites.set(key, sprite);
    }
    sprite.setTexture(textureKey, getEnvironmentAtlasFrameKey(frame))
      .setPosition(x, y).setSize(Math.max(1, width), Math.max(1, height))
      .setTileScale(Math.max(0.02, scaleX), Math.max(0.02, scaleY)).setDepth(depth).setVisible(true);
    sprite.tilePositionX = 0;
    sprite.tilePositionY = 0;
    this.activeEnvironmentSprites.add(key);
  }

  private drawAuthoredEnvironmentSurface(): void {
    if (!this.canRenderAuthoredEnvironment()) return;
    // The ground below is deliberately a single continuous procedural turf
    // field. The source grass swatch is useful as a material reference, but
    // tiling its dark edge pixels at live scale looked like a construction
    // grid. Logical build cells are overlaid separately only in Build Mode.
    this.drawEnvironmentTile(
      "environment:sidewalk",
      "environment:sidewalk",
      this.layout.originX,
      this.layout.sidewalkTop,
      this.layout.width,
      this.layout.sidewalkHeight,
      FACILITY_DEPTH_WORLD + 5,
      Math.max(0.04, this.layout.tileSize / 145),
    );
  }

  private roomEnvironmentFloorFrame(
    room: FacilityRoomView,
  ): EnvironmentAtlasFrameId {
    if (room.definitionId === "room.waiting") {
      return "environment:waiting-floor";
    }
    if (
      room.definitionId === "room.xray" ||
      room.definitionId === "room.imaging_control" ||
      room.definitionId === "room.ultrasound" ||
      room.definitionId === "room.ct"
    ) {
      return "environment:imaging-floor";
    }
    return "environment:clinical-floor";
  }

  private drawAuthoredRoomFloor(
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
  ): void {
    if (!this.canRenderAuthoredEnvironment()) return;
    const inset = Math.max(3, Math.floor(this.layout.tileSize * 0.09));
    this.drawEnvironmentTile(
      `environment:floor:${room.instanceId}`,
      this.roomEnvironmentFloorFrame(room),
      rectangle.x + inset,
      rectangle.y + inset,
      Math.max(1, rectangle.width - inset * 2),
      Math.max(1, rectangle.height - inset * 2),
      FACILITY_DEPTH_WORLD + 5,
      Math.max(0.04, this.layout.tileSize / 142),
    );
  }

  private drawClinicGroundDetails(
    graphics: Phaser.GameObjects.Graphics,
  ): void {
    const model = this.bridge.viewModel;
    const columns = positiveGridSize(model.gridColumns, 16);
    const rows = positiveGridSize(model.gridRows, 10);
    const alpha = model.buildMode || model.placement ? 0.38 : 1;
    const exclusions: ExteriorRectangle[] = model.rooms.map((room) => ({
      x: room.tileX,
      y: room.tileY,
      ...orientedSize(room),
    }));
    const founder = this.getFounderRoom();
    if (founder) {
      const size = orientedSize(founder);
      // Public circulation from the protected south entrance stays clear even
      // while the rest of the unbuilt site is naturally planted.
      exclusions.push({
        x: founder.tileX + size.width / 2 - 0.72,
        y: founder.tileY + size.height - 0.35,
        width: 1.44,
        height: rows - (founder.tileY + size.height) + 0.98,
      });
    }
    // Candidates are contact-anchored above the slab sidewalk. This catches
    // tall crowns and their shadows rather than relying on room occlusion.
    exclusions.push({ x: -4, y: rows + 0.84, width: columns + 8, height: 4 });
    const visible = getVisibleExteriorLandscape(
      getExteriorLandscapeCandidates(columns, rows),
      exclusions,
      0.12,
    );
    for (const candidate of visible) {
      const isTree = candidate.frameId.startsWith("landscape:tree");
      const width = Math.max(22, candidate.width * this.layout.tileSize);
      const height = Math.max(14, candidate.height * this.layout.tileSize);
      const x = this.layout.originX + candidate.x * this.layout.tileSize;
      const y = this.layout.originY + candidate.y * this.layout.tileSize;
      if (!this.drawAuthoredLandscaping(
        `landscape:${candidate.key}`,
        candidate.frameId,
        x,
        y,
        width,
        height,
        alpha,
        FACILITY_DEPTH_WORLD - 5,
      )) {
        this.drawFixture(
          graphics,
          isTree ? "shadeTree" : "bushCluster",
          x,
          y,
          width,
          Math.max(12, height * (isTree ? 0.42 : 0.56)),
          alpha,
        );
      }
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
    let x =
      this.layout.originX +
      (cooler.location.x + 0.5) * this.layout.tileSize;
    const fallbackY =
      this.layout.originY +
      (cooler.location.y + 0.72) * this.layout.tileSize;
    const founderRoom = this.getFounderRoom();
    const coolerIsAtFrontDesk = Boolean(
      founderRoom &&
        cooler.location.x ===
          founderRoom.tileX + FRONT_DESK_PRESENTATION.grid.cooler.x &&
        cooler.location.y ===
          founderRoom.tileY + FRONT_DESK_PRESENTATION.grid.cooler.y,
    );
    // The authored cooler is tall and narrow. Its Front Desk envelope is
    // intentionally larger than generic environment props so it reads as the
    // rear-right fixture in the reference composition rather than a tiny icon.
    const maximumWidth = Math.max(
      16,
      this.layout.tileSize * (
        coolerIsAtFrontDesk
          ? FRONT_DESK_PRESENTATION.waterCooler.widthInTiles
          : 0.42
      ),
    );
    const maximumHeight = Math.max(
      24,
      this.layout.tileSize * (
        coolerIsAtFrontDesk
          ? FRONT_DESK_PRESENTATION.waterCooler.heightInTiles
          : 0.68
      ),
    );
    const coolerSprite = FIXTURE_SPRITES.waterCooler;
    const authoredFrame = getRoomBitmapFixtureFrame(
      coolerIsAtFrontDesk ? "room.front_desk" : "",
      "waterCooler",
    );
    const renderedCooler = getFixturePresentationSize(
      authoredFrame?.nativeWidth ?? coolerSprite.width,
      authoredFrame?.nativeHeight ?? coolerSprite.height,
      maximumWidth,
      maximumHeight,
    );
    let coolerContactY = fallbackY - pixel * 3 + renderedCooler.height / 2;
    if (coolerIsAtFrontDesk && founderRoom) {
      const rectangle = this.toPixels({
        tileX: founderRoom.tileX,
        tileY: founderRoom.tileY,
        ...orientedSize(founderRoom),
      });
      const projection = getFrontDeskV5Projection(rectangle);
      x = projection.floorBounds.x +
        projection.floorBounds.width * FRONT_DESK_PRESENTATION.waterCooler.contact.x;
      coolerContactY =
        projection.floorBounds.y +
        projection.floorBounds.height * FRONT_DESK_PRESENTATION.waterCooler.contact.y;
    }
    const coolerCenterY = coolerContactY - renderedCooler.height / 2;
    const coolerGraphics = this.getSortableGraphics(
      this.fixtureGraphics,
      this.activeFixtureGraphics,
      "environment:water-cooler",
    );
    coolerGraphics.setDepth(
      getFacilitySceneDepth(
        coolerContactY,
        "fixture",
        this.fixtureStableOrder % 64,
      ),
    );
    const coolerDepth = getFacilitySceneDepth(
      coolerContactY,
      "fixture",
      this.fixtureStableOrder % 64,
    );
    this.fixtureStableOrder += 1;
    if (coolerIsAtFrontDesk) {
      const source = FRONT_DESK_V3_ARCHITECTURE_FRAMES.coolerShadow;
      const shadowWidth = renderedCooler.width * 1.5;
      this.drawFrontDeskV3ArchitectureArt(
        "front-desk-v5:shadow:water-cooler",
        "coolerShadow",
        x,
        coolerContactY,
        shadowWidth,
        shadowWidth * (source.nativeHeight / source.nativeWidth),
        coolerDepth - 1,
      );
    }
    if (!this.drawAuthoredFixture(
      "environment:water-cooler",
      "waterCooler",
      coolerIsAtFrontDesk ? "room.front_desk" : "",
      x,
      coolerContactY,
      renderedCooler.width,
      renderedCooler.height,
      coolerDepth,
      1,
    )) {
      this.drawFixture(
        coolerGraphics,
        "waterCooler",
        x,
        coolerCenterY,
        maximumWidth,
        maximumHeight,
      );
    }
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
      coolerCenterY + renderedCooler.height * 0.27 + (pixel * 5 - fillHeight),
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
        x - renderedCooler.width / 2 - outlineWidth * 2,
        coolerCenterY - renderedCooler.height / 2 - outlineWidth * 2,
        renderedCooler.width + outlineWidth * 4,
        renderedCooler.height + outlineWidth * 4,
      );
      if (cooler.highlighted) {
        coolerGraphics.lineStyle(
          Math.max(1, outlineWidth - 1),
          PIXEL_PALETTE_NUMBER.charcoal,
          1,
        );
        coolerGraphics.strokeRect(
          x - renderedCooler.width / 2 - outlineWidth * 4,
          coolerCenterY - renderedCooler.height / 2 - outlineWidth * 4,
          renderedCooler.width + outlineWidth * 8,
          renderedCooler.height + outlineWidth * 8,
        );
      }
    }
    this.waterCoolerLabelText
      ?.setText(cooler.needsRefill ? "REFILL" : "WATER COOLER")
      .setPosition(
        x,
        coolerCenterY - renderedCooler.height / 2 - Math.max(3, pixel),
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
      // Corridors remain open circulation floors. Only real exterior edges
      // receive the same component grammar as the enclosed room shells.
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
      this.drawCanonicalHallwayExposedEdges(room, rectangle);
      return;
    }
    const shade = this.roomFloorColor(room, index);
    const furnitureInset = Math.max(
      5,
      Math.floor(this.layout.tileSize * 0.14),
    );
    const usesFrontDeskV5Architecture = shouldRenderFrontDeskV5Architecture(
      room.definitionId,
      this.canRenderFrontDeskV5Architecture(),
      this.requiresBoundaryAwareSurgeryCenterShell(room),
    );

    if (usesFrontDeskV5Architecture) {
      // The component renderer owns both isolated Front Desk rooms and rooms
      // connected through its deliberate north/south openings. Its fixtures
      // use the same v5 floor projection, avoiding a legacy-shell/v5-fixture
      // mixture at shared boundaries.
      this.drawFrontDeskV5Architecture(room, rectangle);
      this.drawCleanlinessWear(graphics, room, rectangle);
    } else if (room.definitionId === "room.examination") {
      this.drawExaminationV3Architecture(graphics, room, rectangle);
      this.drawCleanlinessWear(graphics, room, rectangle);
    } else if (this.requiresBoundaryAwareSurgeryCenterShell(room)) {
      this.drawBoundaryAwareSurgeryCenterShell(graphics, room, rectangle);
      this.drawCleanlinessWear(graphics, room, rectangle);
    } else {
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
      this.drawAuthoredRoomFloor(room, rectangle);
      this.drawCleanlinessWear(graphics, room, rectangle);
      this.drawRoomUpgradeFinish(graphics, room, rectangle);
      if (isCanonicalEnclosedRoomDefinition(room.definitionId)) {
        this.drawCanonicalEnclosedRoomShell(room, rectangle);
      } else {
        const wallWidth = Math.max(
          4,
          Math.floor(this.layout.tileSize * 0.16),
        );
        this.drawRoomShell(graphics, room, rectangle, wallWidth);
      }
    }

    const roomFixtures = this.getSortableGraphics(
      this.roomFixtureGraphics,
      this.activeRoomFixtureGraphics,
      `room-fixtures:${room.instanceId}`,
    );
    roomFixtures.setDepth(FACILITY_DEPTH_WORLD + 20);
    this.drawRoomFixtures(roomFixtures, room, rectangle, furnitureInset);
    this.drawExaminationV3Foreground(room, rectangle);

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
      case "room.ultrasound":
      case "room.periop_recovery":
      case "room.glp1_telehealth_suite":
        return PIXEL_PALETTE_NUMBER.paper;
      case "room.ct":
      case "room.endoscopy":
        return PIXEL_PALETTE_NUMBER.lightSage;
      case "room.phlebotomy":
      case "room.training":
        return PIXEL_PALETTE_NUMBER.cream;
      case "room.evs_closet":
      case "room.coffee_kiosk":
        return PIXEL_PALETTE_NUMBER.warmGray;
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
        return room && isRoomVisualDoorSlotClear({
          definitionId: room.definitionId,
          orientation: room.orientation,
          width: room.width,
          height: room.height,
          side: slot.side,
          offset: slot.offset,
        })
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
      if (this.canRenderFrontDeskV4Architecture()) {
        // The v4 coherent shell supplies its own five-by-four floor and
        // grout.  Never lay the historical procedural grid over it.
        return;
      }
      // The starter room deliberately reads as a complete five-by-four tiled
      // interior, not an extension of the build grid or an added rug.
      const columns = FRONT_DESK_PRESENTATION.floor.tileColumns;
      const rows = FRONT_DESK_PRESENTATION.floor.tileRows;
      const tileWidth = width / columns;
      const tileHeight = height / rows;
      graphics.lineStyle(1, PIXEL_PALETTE_NUMBER.sage, 0.46);
      for (let column = 1; column < columns; column += 1) {
        const x = left + Math.round(column * tileWidth);
        graphics.lineBetween(x, top, x, bottom);
      }
      for (let row = 1; row < rows; row += 1) {
        const y = top + Math.round(row * tileHeight);
        graphics.lineBetween(left, y, right, y);
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

    if (room.definitionId === "room.ultrasound") {
      const band = Math.max(10, Math.floor(this.layout.tileSize * 0.62));
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.sage, 0.26);
      for (let x = left + band; x < right; x += band) graphics.fillRect(x, top, 1, height);
      return;
    }
    if (room.definitionId === "room.ct") {
      const tile = Math.max(11, Math.floor(this.layout.tileSize * 0.64));
      graphics.lineStyle(1, PIXEL_PALETTE_NUMBER.deepOlive, 0.22);
      for (let y = top + tile; y < bottom; y += tile) graphics.lineBetween(left, y, right, y);
      for (let x = left + tile; x < right; x += tile) graphics.lineBetween(x, top, x, bottom);
      return;
    }
    if (room.definitionId === "room.phlebotomy") {
      const strip = Math.max(7, Math.floor(this.layout.tileSize * 0.4));
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.sage, 0.22);
      for (let y = top + strip; y < bottom; y += strip) graphics.fillRect(left, y, width, 1);
      return;
    }
    if (room.definitionId === "room.evs_closet" || room.definitionId === "room.coffee_kiosk") {
      const tile = Math.max(6, Math.floor(this.layout.tileSize * (room.definitionId === "room.evs_closet" ? 0.3 : 0.42)));
      graphics.lineStyle(1, room.definitionId === "room.evs_closet" ? PIXEL_PALETTE_NUMBER.deepOlive : PIXEL_PALETTE_NUMBER.paper, 0.3);
      for (let y = top + tile; y < bottom; y += tile) graphics.lineBetween(left, y, right, y);
      for (let x = left + tile; x < right; x += tile) graphics.lineBetween(x, top, x, bottom);
      return;
    }
    if (room.definitionId === "room.endoscopy") {
      const band = Math.max(12, Math.floor(this.layout.tileSize * 0.74));
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.deepOlive, 0.16);
      for (let y = top + band; y < bottom; y += band) graphics.fillRect(left, y, width, 2);
      return;
    }
    if (room.definitionId === "room.periop_recovery") {
      const plank = Math.max(10, Math.floor(this.layout.tileSize * 0.58));
      graphics.lineStyle(1, PIXEL_PALETTE_NUMBER.sage, 0.25);
      for (let y = top + plank; y < bottom; y += plank) graphics.lineBetween(left, y, right, y);
      return;
    }
    if (room.definitionId === "room.training") {
      const tile = Math.max(9, Math.floor(this.layout.tileSize * 0.5));
      for (let y = top; y < bottom; y += tile) for (let x = left; x < right; x += tile) {
        if ((Math.floor((x - left) / tile) + Math.floor((y - top) / tile)) % 2 === 0) { graphics.fillStyle(PIXEL_PALETTE_NUMBER.sage, 0.12); graphics.fillRect(x, y, tile, tile); }
      }
      return;
    }
    if (room.definitionId === "room.glp1_telehealth_suite") {
      const tile = Math.max(13, Math.floor(this.layout.tileSize * 0.72));
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.warmGray, 0.24);
      for (let y = top + tile; y < bottom; y += tile) for (let x = left + tile; x < right; x += tile) graphics.fillRect(x, y, 1, 1);
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
        // The authored side-wall strip repeats vertically at its native aspect
        // ratio. A partial exposed edge crops the final repeat rather than
        // compressing its wall panels.
        this.drawEnvironmentTile(
          `environment:side-wall:${room.instanceId}:${side}:${run.offset}`,
          "environment:side-wall",
          x,
          y,
          lowWallWidth,
          height,
          FACILITY_DEPTH_WORLD + 10,
          Math.max(0.02, lowWallWidth / ENVIRONMENT_ATLAS_V1_FRAMES["environment:side-wall"].nativeWidth),
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
    const wallCapHeight = getSurgeryCenterArchitectureAtScale(
      this.layout.tileSize,
    ).outerBorderY;
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
        wallCapHeight,
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
        Math.max(1, wallCapHeight - 3),
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
        Math.max(1, Math.floor(wallCapHeight * 0.65)),
      );
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.deepOlive, 0.68);
      graphics.fillRect(faceX, groundY - 3, faceWidth, 3);

      // The wall texture is repeated from the measured v1 source bounds.
      // This leaves partial north runs as ordinary clipped continuations of
      // their parent wall instead of changing the texture's proportions.
      this.drawEnvironmentTile(
        `environment:north-wall:${room.instanceId}:${run.offset}`,
        "environment:north-wall",
        faceX,
        projection.face.y,
        faceWidth,
        rearWallHeight,
        FACILITY_DEPTH_WORLD + 10,
        Math.max(0.02, rearWallHeight / ENVIRONMENT_ATLAS_V1_FRAMES["environment:north-wall"].nativeHeight),
      );

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
    const { tileSize, originX, width, sidewalkTop, sidewalkHeight } = this.layout;
    const sidewalkBottom = sidewalkTop + sidewalkHeight;
    if (!this.canRenderAuthoredEnvironment()) {
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.paper, 1);
      graphics.fillRect(originX, sidewalkTop, width, sidewalkHeight);
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.warmGray, 0.38);
      for (let y = sidewalkTop + 5; y < sidewalkBottom; y += 9) {
        graphics.fillRect(originX, y, width, 1);
      }
    }
    // Broad paving slabs, joints, and curb are all site/world-coordinate art.
    graphics.lineStyle(2, PIXEL_PALETTE_NUMBER.ink, 0.85);
    graphics.lineBetween(originX, sidewalkTop, originX + width, sidewalkTop);
    graphics.lineBetween(originX, sidewalkBottom, originX + width, sidewalkBottom);
    graphics.lineStyle(1, PIXEL_PALETTE_NUMBER.warmGray, 0.4);
    const slabWidth = Math.max(32, Math.round(tileSize * 1.25));
    const firstSlab = Math.floor(originX / slabWidth) * slabWidth;
    for (let x = firstSlab; x <= originX + width; x += slabWidth) {
      graphics.lineBetween(x, sidewalkTop + 2, x, sidewalkBottom - 2);
    }
    graphics.lineStyle(Math.max(1, Math.floor(tileSize * 0.06)), PIXEL_PALETTE_NUMBER.charcoal, 0.55);
    graphics.lineBetween(originX, sidewalkBottom - Math.max(2, tileSize * 0.12), originX + width, sidewalkBottom - Math.max(2, tileSize * 0.12));

    const founder = this.getFounderRoom();
    if (!founder) return;
    const founderPixels = this.toPixels({ tileX: founder.tileX, tileY: founder.tileY, ...orientedSize(founder) });
    const entranceX = Math.floor(founderPixels.x + founderPixels.width / 2);
    const entranceWidth = Math.max(12, tileSize);
    const entranceLeft = entranceX - Math.floor(entranceWidth / 2);
    const entranceEdgeY = founderPixels.y + founderPixels.height;
    const entranceFrame = Math.max(2, Math.floor(tileSize * 0.08));

    // The buildable edge meets the sidewalk directly. The small threshold is
    // visual entrance trim, not a separate grass setback or a route change.
    graphics.fillStyle(this.roomFloorColor(founder), 1);
    graphics.fillRect(entranceLeft, entranceEdgeY - Math.max(4, entranceFrame * 2), entranceWidth, Math.max(8, entranceFrame * 4));
    graphics.fillStyle(PIXEL_PALETTE_NUMBER.shadow, 0.55);
    graphics.fillRect(entranceLeft + entranceFrame, entranceEdgeY - entranceFrame, Math.max(1, entranceWidth - entranceFrame * 2), entranceFrame * 2);
    graphics.fillStyle(PIXEL_PALETTE_NUMBER.ink, 1);
    graphics.fillRect(entranceLeft - entranceFrame, entranceEdgeY - entranceFrame * 3, entranceFrame, entranceFrame * 5);
    graphics.fillRect(entranceLeft + entranceWidth, entranceEdgeY - entranceFrame * 3, entranceFrame, entranceFrame * 5);

    // The Front Desk owns its paired entrance-bed composition declaratively.
    // Their top edges touch the building within the rear sidewalk band. The
    // lower sidewalk remains a continuous public pedestrian lane.
    for (const [planterIndex, planter] of FRONT_DESK_PRESENTATION.entrancePlanters.entries()) {
      const planterBaseY =
        sidewalkTop + planter.baseYInSidewalk * tileSize;
      this.drawAuthoredLandscaping(
        `landscape:front-desk-entrance-bed:${planter.side}`,
        "landscape:entrance-planter",
        founderPixels.x + planter.centerXInTiles * tileSize,
        planterBaseY,
        planter.widthInTiles * tileSize,
        planter.heightInTiles * tileSize,
        1,
        // Their rear-side contact is outside the south wall, while actors in
        // the lower sidewalk lane have later baselines and pass in front.
        getFacilitySceneDepth(planterBaseY, "fixture", planterIndex),
      );
      planter.bloomAccents.forEach((accent, accentIndex) => {
        this.drawAuthoredLandscaping(
          `landscape:front-desk-entrance-bloom:${planterIndex}:${accentIndex}`,
          accent.id,
          founderPixels.x + accent.centerXInTiles * tileSize,
          sidewalkTop + accent.baseYInSidewalk * tileSize,
          accent.widthInTiles * tileSize,
          accent.heightInTiles * tileSize,
          accent.alpha,
          getFacilitySceneDepth(
            sidewalkTop + accent.baseYInSidewalk * tileSize,
            "fixture",
            planterIndex * 4 + accentIndex + 2,
          ),
        );
      });
    }
  }

  private drawRoomFixtures(
    graphics: Phaser.GameObjects.Graphics,
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
    inset: number,
  ): void {
    const visualLayout = getRoomVisualLayout(room.definitionId);
    const furnitureOrientation = getRoomVisualOrientation(
      visualLayout,
      room.orientation,
    );
    const left = rectangle.x + inset;
    const canonicalOpenings: readonly CanonicalRoomWallOpening[] = isCanonicalEnclosedRoomDefinition(room.definitionId)
      ? (this.bridge.viewModel.doors ?? [])
        .filter((door) => door.roomInstanceId === room.instanceId)
        .map((door) => ({ side: door.side, offset: door.offset }))
      : [];
    const canonicalShell = isCanonicalEnclosedRoomDefinition(room.definitionId)
      ? getCanonicalRoomShellLayout(rectangle, orientedSize(room), canonicalOpenings, false, {
        id: `room-skin:${room.definitionId}`,
      })
      : undefined;
    const wallHeight = canonicalShell?.geometry.northHeight ?? this.roomWallFaceHeight(rectangle);
    const wallCapHeight = getSurgeryCenterArchitectureAtScale(
      this.layout.tileSize,
    ).outerBorderY;
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
        wallCapHeight,
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
    // Front Desk v5 deliberately uses its wide/shallow display floor for all
    // room-specific contacts. The semantic five-by-four rectangle remains
    // untouched for navigation, doors, saves, and route samples.
    const frontDeskV5Projection =
      room.definitionId === "room.front_desk" && this.canRenderFrontDeskV5Architecture()
        ? getFrontDeskV5Projection(rectangle)
        : undefined;
    const fixtureDisplayBounds = frontDeskV5Projection?.floorBounds ?? {
      x: left,
      y: top,
      width: usableWidth,
      height: usableHeight,
    };
    let roomFixtureOrder = 0;
    const place = (
      id: FixtureId,
      centerXRatio: number,
      centerYRatio: number,
      widthRatio: number,
      heightRatio: number,
      alpha = 1,
      contact?: Readonly<{ x: number; y: number }>,
      preserveScreenOrientation = false,
      presentationRotation = 0,
    ) => {
      const transformed = preserveScreenOrientation
        ? { centerXRatio, centerYRatio, widthRatio, heightRatio }
        : transformRoomLocalFixture(
        {
          centerXRatio,
          centerYRatio,
          widthRatio,
          heightRatio,
        },
        furnitureOrientation,
      );
      const centeredX =
        fixtureDisplayBounds.x + fixtureDisplayBounds.width * transformed.centerXRatio;
      const centeredY =
        fixtureDisplayBounds.y + fixtureDisplayBounds.height * transformed.centerYRatio;
      const maximumWidth = fixtureDisplayBounds.width * transformed.widthRatio;
      const maximumHeight = fixtureDisplayBounds.height * transformed.heightRatio;
      const fixture = getFixtureSpriteForOrientation(
        id,
        preserveScreenOrientation ? 0 : furnitureOrientation,
      );
      const authoredFrame = getRoomBitmapFixtureFrame(room.definitionId, id);
      const rotated = presentationRotation % 180 !== 0;
      const rendered = getFixturePresentationSize(
        rotated
          ? authoredFrame?.nativeHeight ?? fixture.height
          : authoredFrame?.nativeWidth ?? fixture.width,
        rotated
          ? authoredFrame?.nativeWidth ?? fixture.width
          : authoredFrame?.nativeHeight ?? fixture.height,
        maximumWidth,
        maximumHeight,
      );
      // Front Desk's fixed orientation permits a separate visual floor
      // contact. Its logical grid tiles remain authoritative for collision and
      // routing while tall cabinet/cooler art can extend toward the rear wall.
      const centerX = contact
        ? fixtureDisplayBounds.x + fixtureDisplayBounds.width * contact.x
        : centeredX;
      const contactY = contact
        ? fixtureDisplayBounds.y + fixtureDisplayBounds.height * contact.y
        : centeredY + rendered.height / 2;
      const centerY = contactY - rendered.height / 2;
      const shadowWidth = Math.max(
        4,
        Math.min(maximumWidth * 0.72, rendered.width * 0.82),
      );
      const shadowY = contactY - 2;
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
      const fixtureDepth = getFacilitySceneDepth(
        contactY,
        "fixture",
        this.fixtureStableOrder % 64,
      );
      if (!isFloorSurface) {
        target.setDepth(fixtureDepth);
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
      const v5ContactShadow =
        room.definitionId === "room.front_desk" && frontDeskV5Projection
          ? id === "frontDesk"
            ? "counterShadow"
            : id === "filingCabinet"
              ? "cabinetShadow"
              : undefined
          : undefined;
      if (v5ContactShadow) {
        const shadowWidth =
          id === "frontDesk" ? rendered.width * 1.15 : rendered.width * 1.3;
        const source = FRONT_DESK_V3_ARCHITECTURE_FRAMES[v5ContactShadow];
        this.drawFrontDeskV3ArchitectureArt(
          `front-desk-v5:shadow:${room.instanceId}:${id}`,
          v5ContactShadow,
          centerX,
          contactY,
          shadowWidth,
          shadowWidth * (source.nativeHeight / source.nativeWidth),
          fixtureDepth - 1,
        );
      }
      if (
        this.drawAuthoredFixture(
          `room:${room.instanceId}:${fixtureOrder}:${id}`,
          id,
          room.definitionId,
          centerX,
          // Unrotated atlas furniture retains its bottom-center source anchor
          // and contact baseline. A deliberately rotated presentation asset
          // instead uses a centered visual origin so its authored grid cell
          // remains the actual rendered footprint; contactY still supplies
          // depth ordering and its floor shadow.
          presentationRotation === 0 ? contactY : centeredY,
          rendered.width,
          rendered.height,
          getFacilitySceneDepth(
            contactY, "fixture", (this.fixtureStableOrder - 1 + 64) % 64,
          ),
          alpha,
          presentationRotation,
        )
      ) {
        return;
      }
      this.drawFixture(
        target,
        id,
        centerX,
        centerY,
        maximumWidth,
        maximumHeight,
        alpha,
        furnitureOrientation,
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
      if (canonicalShell) {
        const largestRun = Math.max(0, ...canonicalShell.northWallFaceRuns.map((run) => run.length / this.layout.tileSize));
        if (!shouldRenderWorldNorthWallDecor({ binding: "world-north" }, largestRun)) return;
        const wallInset = Math.max(2, Math.floor(inset * 0.35));
        const usableWidth = Math.max(8, rectangle.width - wallInset * 2);
        const usableHeight = Math.max(8, wallHeight - 5);
        const fixture = FIXTURE_SPRITES[id];
        const rendered = getFixturePresentationSize(
          fixture.width,
          fixture.height,
          usableWidth * widthRatio * 1.16,
          usableHeight * heightRatio * 1.28,
        );
        const x = rectangle.x + wallInset + usableWidth * centerXRatio - rendered.width / 2;
        const y = rectangle.y - wallHeight + usableHeight * centerYRatio - rendered.height / 2;
        const visibleFragments = getCanonicalNorthWallDecorFragments(
          canonicalShell,
          rectangle,
          { x, y, width: rendered.width, height: rendered.height },
        );
        if (visibleFragments.length === 0) return;
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
        return;
      }
      const largestExposedRunTiles = Math.max(
        0,
        ...rearWallRuns.map((run) => run.length),
      );
      if (
        !shouldRenderWorldNorthWallDecor(
          { binding: "world-north" },
          largestExposedRunTiles,
        )
      ) {
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

    // The five reference-led rooms share one metadata renderer. Their room
    // shells, doors, live actors, and logical geometry remain independent.
    const renderFiveRoomPresentation = (): boolean => {
      const presentation = getFiveRoomPresentation(room.definitionId, room.orientation);
      if (!presentation) return false;
      const northDoorOffsets = (this.bridge.viewModel.doors ?? [])
        .filter((door) => door.roomInstanceId === room.instanceId && door.side === "north")
        .map((door) => door.offset);
      presentation.fixtures.forEach((fixture) => {
        if (fixture.wallMounted) {
          if (isFiveRoomNorthWallFixtureVisible(fixture, northDoorOffsets)) {
            placeWall(fixture.id, fixture.centerXRatio, fixture.centerYRatio, fixture.widthRatio, fixture.heightRatio);
          }
          return;
        }
        place(
          fixture.id,
          fixture.centerXRatio,
          fixture.centerYRatio,
          fixture.widthRatio,
          fixture.heightRatio,
          1,
          undefined,
          fixture.preserveScreenOrientation,
        );
      });
      return true;
    };

    switch (room.definitionId) {
      case "room.front_desk":
        // This isolated composition is deliberately declarative. It mirrors
        // the accepted reference while all live characters, doors, and the
        // water cooler remain independent scene elements.
        const showEmptyFrontDeskChair = shouldRenderEmptyFrontDeskChair(
          this.bridge.viewModel.founder,
          this.bridge.viewModel.staff,
          this.bridge.viewModel.rooms,
        );
        FRONT_DESK_PRESENTATION.fixtures.forEach((fixture) => {
          if (fixture.id === "secretaryChair" && !showEmptyFrontDeskChair) {
            return;
          }
          place(
            fixture.id,
            fixture.x,
            fixture.y,
            fixture.width,
            fixture.height,
            1,
            fixture.contact,
          );
        });
        if (frontDeskV5Projection && this.canRenderFrontDeskV2Art()) {
          // v5's rear wall is component art, so the old v4-only decor branch
          // is intentionally bypassed. These independent sprites are placed
          // from the reference-measured v5 floor, left of its north opening.
          const northWallHeight = frontDeskV5Projection.floorBounds.height * 0.34;
          FRONT_DESK_PRESENTATION.northWallFixtures.forEach((fixture) => {
            this.drawFrontDeskV2Art(
              `front-desk-v5:decor:${room.instanceId}:${fixture.id}`,
              fixture.id as FrontDeskV2ArtId,
              frontDeskV5Projection.floorBounds.x +
                frontDeskV5Projection.floorBounds.width * fixture.x,
              frontDeskV5Projection.floorBounds.y - northWallHeight * 0.49,
              frontDeskV5Projection.floorBounds.width * fixture.width,
              northWallHeight * fixture.height,
              FACILITY_DEPTH_WORLD + 21,
            );
          });
        } else {
          FRONT_DESK_PRESENTATION.northWallFixtures.forEach((fixture) => {
            placeWall(
              fixture.id,
              fixture.x,
              fixture.y,
              fixture.width,
              fixture.height,
            );
          });
        }
        break;
      case "room.waiting":
        renderFiveRoomPresentation();
        break;
      case "room.examination":
        {
          const presentation = getExaminationRoomPresentation(room.orientation);
          const examinationOpenings: ExaminationDoorOpening[] = (this.bridge.viewModel.doors ?? [])
            .filter((door) => door.roomInstanceId === room.instanceId)
            .map((door) => ({ side: door.side, offset: door.offset }));
          const northDoorOffsets = examinationOpenings
            .filter((opening) => opening.side === "north")
            .map((opening) => opening.offset);
          const canonicalNorthHeight = getExaminationV3ArchitectureComponents(
            rectangle,
            orientedSize(room),
            examinationOpenings,
          ).find((component) => component.side === "north")?.bounds.height ?? wallHeight;
          const placeExaminationWall = (fixture: (typeof presentation.fixtures)[number]) => {
            // A decoration belongs to a real remaining north-wall interval.
            // Its authored logical slot is deliberately exact: another north
            // door does not suppress it, but a door in this slot does.
            if (!isExaminationNorthWallFixtureVisible(fixture, northDoorOffsets)) return;
            const source = FIXTURE_SPRITES[fixture.id];
            const authored = getRoomBitmapFixtureFrame(room.definitionId, fixture.id);
            const rendered = getFixturePresentationSize(
              authored?.nativeWidth ?? source.width,
              authored?.nativeHeight ?? source.height,
              rectangle.width * fixture.widthRatio,
              canonicalNorthHeight * fixture.heightRatio,
            );
            const centerX = rectangle.x + rectangle.width * fixture.centerXRatio;
            const centerY = rectangle.y - canonicalNorthHeight + canonicalNorthHeight * fixture.centerYRatio;
            const depth = FACILITY_DEPTH_WORLD + 22;
            if (this.drawAuthoredFixture(
              `examination-v3:wall:${room.instanceId}:${fixture.id}`,
              fixture.id,
              room.definitionId,
              centerX,
              centerY,
              rendered.width,
              rendered.height,
              depth,
              1,
            )) return;
            this.drawPixelFrameSized(
              graphics,
              source,
              Math.round(centerX - rendered.width / 2),
              Math.round(centerY - rendered.height / 2),
              rendered.width,
              rendered.height,
            );
          };
          presentation.fixtures.forEach((fixture) => {
            if (fixture.wallMounted) {
              placeExaminationWall(fixture);
              return;
            }
            place(
              fixture.id,
              fixture.centerXRatio,
              fixture.centerYRatio,
              fixture.widthRatio,
              fixture.heightRatio,
              1,
              undefined,
              // v3 supplies separate north-up arrangements for 3x2 and 2x3;
              // do not rotate their composed furniture a second time.
              true,
              fixture.rotationDegrees ?? 0,
            );
          });
        }
        break;
      case "room.bathroom":
        renderFiveRoomPresentation();
        break;
      case "room.xray":
        renderFiveRoomPresentation();
        break;
      case "room.imaging_control":
        renderFiveRoomPresentation();
        break;
      case "room.minor_procedure":
        renderFiveRoomPresentation();
        break;
      case "room.ultrasound":
        place("examTable", 0.35, 0.65, 0.54, 0.28);
        place("ultrasoundConsole", 0.72, 0.47, 0.3, 0.48);
        place("rollingCart", 0.13, 0.48, 0.18, 0.25);
        place("supplyCabinet", 0.87, 0.2, 0.18, 0.3);
        placeWall("diagnosticPanel", 0.28, 0.5, 0.2, 0.74);
        break;
      case "room.ct":
        place("ctGantry", 0.42, 0.51, 0.58, 0.64);
        place("supplyCabinet", 0.86, 0.31, 0.18, 0.31);
        place("rollingCart", 0.83, 0.77, 0.16, 0.22);
        placeWall("radiationMarker", 0.14, 0.5, 0.1, 0.74);
        placeWall("wallWindow", 0.63, 0.5, 0.3, 0.72);
        break;
      case "room.phlebotomy":
        place("phlebotomyChair", 0.34, 0.56, 0.36, 0.5);
        place("sinkCabinet", 0.78, 0.23, 0.34, 0.27);
        place("tubeRack", 0.73, 0.58, 0.27, 0.17);
        place("rollingCart", 0.12, 0.76, 0.17, 0.22);
        placeWall("wallChart", 0.3, 0.5, 0.13, 0.72);
        break;
      case "room.evs_closet":
        place("mopCart", 0.31, 0.58, 0.43, 0.68);
        place("scrubSink", 0.75, 0.65, 0.38, 0.3);
        place("supplyCabinet", 0.78, 0.2, 0.25, 0.32);
        placeWall("wallShelf", 0.38, 0.5, 0.3, 0.7);
        break;
      case "room.endoscopy":
        place("procedureTable", 0.38, 0.64, 0.54, 0.29);
        place("endoscopyTower", 0.78, 0.44, 0.23, 0.56);
        place("sinkCabinet", 0.18, 0.2, 0.28, 0.24);
        place("supplyCabinet", 0.9, 0.22, 0.16, 0.29);
        place("instrumentTray", 0.12, 0.77, 0.18, 0.23);
        placeWall("lightBox", 0.45, 0.5, 0.24, 0.74);
        break;
      case "room.periop_recovery":
        place("procedureTable", 0.36, 0.63, 0.55, 0.3);
        place("vitalsMonitor", 0.76, 0.45, 0.2, 0.42);
        place("ivStand", 0.16, 0.41, 0.13, 0.4);
        place("supplyCabinet", 0.9, 0.23, 0.16, 0.3);
        // A curtain is a movable partition/floor contact, not wall art.
        place("privacyCurtain", 0.84, 0.55, 0.13, 0.9, 0.84);
        break;
      case "room.training":
        place("trainingTable", 0.48, 0.61, 0.68, 0.42);
        place("visitorChair", 0.17, 0.44, 0.15, 0.23);
        place("visitorChair", 0.81, 0.44, 0.15, 0.23);
        place("rollingCart", 0.87, 0.77, 0.15, 0.2);
        placeWall("noticeBoard", 0.32, 0.5, 0.24, 0.72);
        placeWall("lightBox", 0.72, 0.5, 0.23, 0.72);
        break;
      case "room.coffee_kiosk":
        place("frontDesk", 0.5, 0.66, 0.76, 0.28);
        place("coffeeMachine", 0.36, 0.37, 0.25, 0.42);
        place("chartStack", 0.65, 0.43, 0.18, 0.13);
        place("wasteBin", 0.9, 0.78, 0.09, 0.15);
        placeWall("medicalSign", 0.5, 0.5, 0.13, 0.72);
        break;
      case "room.glp1_telehealth_suite":
        place("imagingConsole", 0.49, 0.33, 0.68, 0.4);
        place("officeChair", 0.49, 0.65, 0.18, 0.25);
        place("ringLight", 0.83, 0.45, 0.18, 0.5);
        place("deskPhone", 0.67, 0.49, 0.12, 0.12);
        place("filingCabinet", 0.12, 0.47, 0.16, 0.32);
        placeWall("framedPrint", 0.25, 0.5, 0.13, 0.72);
        break;
      default:
        place("filingCabinet", 0.25, 0.4, 0.25, 0.38);
        place("visitorChair", 0.68, 0.62, 0.25, 0.3);
    }

    const visualTier = Math.max(
      1,
      Math.min(5, room.upgradeLevel ?? 1),
    );
    if (visualTier >= 2 && !isFiveReferenceRoomDefinition(room.definitionId)) {
      switch (room.definitionId) {
        case "room.front_desk":
          // The reference establishes the complete level 0–2 room. Upgrade
          // clutter belongs to other rooms, not this fixed Front Desk.
          break;
        case "room.waiting":
          place("roomPlant", 0.91, 0.78, 0.1, 0.18, 0.94);
          place("sideTable", 0.88, 0.48, 0.11, 0.15, 0.9);
          break;
        case "room.examination":
          // Examination v3 is a complete reference-led composition. Upgrade
          // state remains intact, but its legacy visual clutter is suppressed.
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
        case "room.ultrasound":
          place("vitalsMonitor", 0.14, 0.78, 0.15, 0.3, 0.9);
          break;
        case "room.ct":
          place("rollingCart", 0.16, 0.78, 0.16, 0.22, 0.9);
          break;
        case "room.phlebotomy":
          place("wasteBin", 0.88, 0.8, 0.09, 0.14, 0.9);
          break;
        case "room.evs_closet":
          place("wasteBin", 0.16, 0.82, 0.1, 0.15, 0.9);
          break;
        case "room.endoscopy":
          place("vitalsMonitor", 0.15, 0.45, 0.17, 0.35, 0.94);
          break;
        case "room.periop_recovery":
          place("rollingCart", 0.82, 0.78, 0.16, 0.21, 0.92);
          break;
        case "room.training":
          place("roomPlant", 0.9, 0.82, 0.1, 0.18, 0.9);
          break;
        case "room.coffee_kiosk":
          place("sideTable", 0.13, 0.75, 0.13, 0.16, 0.9);
          break;
        case "room.glp1_telehealth_suite":
          place("officePrinter", 0.13, 0.78, 0.14, 0.19, 0.9);
          break;
      }
    }
    if (visualTier >= 3 && !isFiveReferenceRoomDefinition(room.definitionId)) {
      place("roomPlant", 0.92, 0.86, 0.1, 0.18, 0.94);
      placeWall("framedPrint", 0.86, 0.5, 0.12, 0.72, 0.9);
    }
    if (
      room.definitionId !== "room.front_desk" &&
      !isFiveReferenceRoomDefinition(room.definitionId) &&
      room.definitionId !== "room.bathroom" &&
      room.definitionId !== "room.imaging_control" &&
      room.definitionId !== "room.examination"
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
    orientation: RoomOrientation = 0,
  ): void {
    const fixture = getFixtureSpriteForOrientation(id, orientation);
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
    direction: CharacterDirection,
    offsetIndex: number,
  ): CharacterPose {
    return selectCharacterWalkingPose(
      moving && !this.bridge.viewModel.paused && !this.bridge.viewModel.buildMode,
      direction,
      Math.floor(this.characterPhase * 2 + offsetIndex),
    );
  }

  private founderPose(
    moving: boolean,
    direction: CharacterDirection,
    activityLabel?: string,
    location?: GridPoint,
  ): CharacterPose {
    const movingPose = this.characterPose(moving, direction, 0);
    if (movingPose !== "idle") {
      return movingPose;
    }
    // Activity labels are emitted only for persisted, live founder tasks
    // (cleaning, refilling, praise, and similar interactions). They are a
    // safe presentation seam: this does not alter task timing or routing.
    if (activityLabel?.trim()) {
      return "interaction";
    }
    return shouldRenderFounderSeatedAtFrontDesk(
      location,
      moving,
      activityLabel,
      this.bridge.viewModel.rooms,
    )
      ? "seated"
      : "idle";
  }

  private staffPose(
    moving: boolean,
    direction: CharacterDirection,
    offsetIndex: number,
    homeRoomInstanceId: string | null,
    location?: GridPoint,
    staffRoleDefinitionId?: string,
  ): CharacterPose {
    const movingPose = this.characterPose(moving, direction, offsetIndex);
    if (movingPose !== "idle") {
      return movingPose;
    }
    if (
      shouldRenderReceptionistSeatedAtFrontDesk(
        location,
        moving,
        staffRoleDefinitionId,
        homeRoomInstanceId,
        this.bridge.viewModel.rooms,
      )
    ) {
      return "seated";
    }
    // An assigned staff member who is already at a persisted home/work room
    // can use a quiet working pose. Unassigned staff remain idle rather than
    // inventing a workplace state from presentation alone.
    return homeRoomInstanceId ? "working" : "idle";
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
    rightFacing: boolean;
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
        rightFacing: this.characterFacingRight.get(key) ?? false,
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
    this.characterFacingRight.set(key, sample.rightFacing);
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
      rightFacing: sample.rightFacing,
    };
  }

  /**
   * Domain routes continue to use the logical `gridRows` sidewalk row. This
   * presentation seam maps only that final exterior segment across the visual
   * planted setback; interior positions retain their exact old pixel mapping.
   */
  private actorBaseY(logicalY: number, baseOffset = 0.72): number {
    return getActorPresentationBaseY(logicalY, baseOffset, {
      originY: this.layout.originY,
      tileSize: this.layout.tileSize,
      sidewalkTop: this.layout.sidewalkTop,
      sidewalkHeight: this.layout.sidewalkHeight,
      gridRows: positiveGridSize(this.bridge.viewModel.gridRows, 10),
    });
  }

  /** Maps only stationary Front Desk anchor poses into the v5 display floor. */
  private getFrontDeskV5ActorDisplayPosition(
    location: GridPoint | undefined,
    moving: boolean,
    anchor: "staff" | "public",
  ): Readonly<{ centerX: number; baseY: number; scale: number }> | undefined {
    if (!this.canRenderFrontDeskV5Architecture()) return undefined;
    const display = getFrontDeskV5StationaryActorDisplay(
      location,
      moving,
      anchor,
      this.bridge.viewModel.rooms,
    );
    const room = this.bridge.viewModel.rooms.find(
      (candidate) => candidate.definitionId === "room.front_desk",
    );
    if (!display || !room) return undefined;
    const projection = getFrontDeskV5Projection(this.toPixels({
      tileX: room.tileX,
      tileY: room.tileY,
      ...orientedSize(room),
    }));
    return {
      centerX: projection.floorBounds.x + projection.floorBounds.width * display.x,
      baseY: projection.floorBounds.y + projection.floorBounds.height * display.y,
      scale: display.scale,
    };
  }

  private getCharacterGraphics(
    key: string,
  ): Phaser.GameObjects.Graphics {
    let graphics = this.characterGraphics.get(key);
    if (!graphics) {
      graphics = this.add.graphics();
      graphics.setData("character-key", key);
      this.characterGraphics.set(key, graphics);
    }
    graphics.setVisible(true);
    this.activeCharacterGraphics.add(key);
    return graphics;
  }

  private drawCharacters(): void {
    this.activeCharacterGraphics = new Set<string>();
    this.activeCharacterBitmapContainers = new Set<string>();
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
      const founderPose = this.founderPose(
        founderPresentation.moving,
        founderPresentation.direction,
        this.bridge.viewModel.founder.activityLabel,
        founderLocation,
      );
      const founderDisplay = founderPose === "seated"
        ? this.getFrontDeskV5ActorDisplayPosition(
            founderLocation,
            founderPresentation.moving,
            "staff",
          )
        : undefined;
      const founderCenterX = founderDisplay?.centerX ??
        this.layout.originX + (founderLocation.x + 0.5) * this.layout.tileSize;
      const founderBaseY = this.drawPixelPerson(
        graphics,
        founderCenterX,
        founderDisplay?.baseY ?? this.actorBaseY(
            founderLocation.y,
            0.72 +
              (founderPose === "seated"
                ? FRONT_DESK_PRESENTATION.seatedPresentation.towardCounterTiles
                : 0),
          ),
        0,
        this.bridge.viewModel.founder.appearance,
        0x111111,
        founderPresentation.direction,
        founderPose,
        founderPresentation.rightFacing,
        founderDisplay?.scale ?? 1,
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
      const employeePose = this.staffPose(
        employeePresentation.moving,
        employeePresentation.direction,
        index + 1,
        employee.homeRoomInstanceId,
        employeePresentation.location,
        employee.staffRoleDefinitionId,
      );
      const employeeDisplay = employeePose === "seated"
        ? this.getFrontDeskV5ActorDisplayPosition(
            employeePresentation.location,
            employeePresentation.moving,
            "staff",
          )
        : undefined;
      const employeeBaseY = this.drawPixelPerson(
        graphics,
        employeeDisplay?.centerX ??
          this.layout.originX +
            (employeePresentation.location.x + 0.5) * this.layout.tileSize,
        employeeDisplay?.baseY ?? this.actorBaseY(
            employeePresentation.location.y,
            0.72 +
              (employeePose === "seated"
                ? FRONT_DESK_PRESENTATION.seatedPresentation.towardCounterTiles
                : 0),
          ),
        index + 1,
        employee.appearance,
        0x555555,
        employeePresentation.direction,
        employeePose,
        employeePresentation.rightFacing,
        employeeDisplay?.scale ?? 1,
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
          this.actorBaseY(presentation.location.y),
          200 + index,
          pedestrian.appearance,
          0x555555,
          presentation.direction,
          this.characterPose(presentation.moving, presentation.direction, 200 + index),
          presentation.rightFacing,
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
          rightFacing: presentation.rightFacing,
        },
        index,
      );
    });
    for (const key of this.routeMotionTracks.keys()) {
      if (!representedKeys.has(key)) {
        this.routeMotionTracks.delete(key);
      }
    }
    for (const key of this.characterFacingRight.keys()) {
      if (!representedKeys.has(key)) {
        this.characterFacingRight.delete(key);
      }
    }
    this.removeInactiveGraphics(
      this.characterGraphics,
      this.activeCharacterGraphics,
    );
    this.removeInactiveCharacterBitmapContainers();
  }

  private getCharacterBitmapContainer(
    key: string,
  ): Phaser.GameObjects.Container {
    let container = this.characterBitmapContainers.get(key);
    if (!container) {
      container = this.add.container(0, 0);
      container.setData("character-key", key);
      const actor = this.add.image(0, 0, "__DEFAULT");
      actor.setName("actor");
      container.add(actor);
      this.characterBitmapContainers.set(key, container);
    }
    container.setVisible(true);
    this.activeCharacterBitmapContainers.add(key);
    return container;
  }

  private removeInactiveCharacterBitmapContainers(): void {
    for (const [key, container] of this.characterBitmapContainers) {
      if (!this.activeCharacterBitmapContainers.has(key)) {
        container.destroy(true);
        this.characterBitmapContainers.delete(key);
      }
    }
  }

  private drawFacilityPatient(
    patient: FacilityPatientView & { rightFacing?: boolean },
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
      : this.characterPose(patient.moving ?? false, direction, 100 + index);

    const frontDeskDisplay = this.getFrontDeskV5ActorDisplayPosition(
      patient.location,
      Boolean(patient.moving),
      "public",
    );
    const centerX = frontDeskDisplay?.centerX ??
      this.layout.originX + (patient.location.x + 0.5) * this.layout.tileSize;
    const baseY = this.drawPixelPerson(
      graphics,
      centerX,
      frontDeskDisplay?.baseY ?? this.actorBaseY(patient.location.y),
      100 + index,
      patient.appearance,
      appearanceColor,
      direction,
      pose,
      patient.rightFacing ?? false,
      frontDeskDisplay?.scale ?? 1,
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
    offsetIndex: number,
    appearance: PixelAppearanceDescriptor | undefined,
    _fallbackColor: number,
    direction: CharacterDirection = "front",
    pose: CharacterPose = "idle",
    movingRight = false,
    displayScale = 1,
  ): number {
    // Map characters use the canonical detailed frame at a crisp 3:2
    // nearest-neighbor presentation scale. This makes people readable among
    // dense room furnishings without changing their route or foot anchor.
    const resolvedAppearance = appearance ?? FALLBACK_APPEARANCE;
    const key = graphics.getData("character-key") as string | undefined;
    if (this.characterAtlasesReady && key) {
      const authoredLayers = characterBitmapLayers(
        resolvedAppearance,
        direction,
        pose,
        movingRight,
      );
      const textureKey = getPhaserTextureKey(authoredLayers.actor.atlas);
      const textureReady = this.textures.exists(textureKey) ||
        // Patient chair variants are intentionally lazy. All other actor
        // packages are part of the eager base set above.
        (!authoredLayers.actor.atlas.id.includes("character:patients-")
          ? false
          : this.ensurePatientPoseAtlas(authoredLayers.actor.atlas));
      if (!textureReady) {
        // Continue through the established procedural fallback until the
        // one-time authored texture registration callback redraws this actor.
        this.characterBitmapContainers.get(key)?.setVisible(false);
      } else {
      const registration = characterBitmapRegistration(authoredLayers);
      const container = this.getCharacterBitmapContainer(key);
      const actor = container.getByName("actor") as Phaser.GameObjects.Image;
      actor
        .setTexture(
          textureKey,
          characterAtlasFrameKey(authoredLayers.actor),
        )
        // Every authored source frame owns one entire clean actor. There are no
        // independently cropped planes that can expose a source neighbour.
        .setDisplaySize(
          this.layout.tileSize * 1.35 * displayScale,
          this.layout.tileSize * (1.35 / registration.displayAspectRatio) * displayScale,
        )
        .setPosition(0, 0)
        .setOrigin(0.5, registration.floorAnchorY)
        .setFlipX(authoredLayers.actor.flipX);
      // A development-only browser proof reads these properties from the
      // actual Phaser actor after FacilityScene has selected and rendered its
      // live route frame. They are presentation metadata only; no simulation
      // state depends on them.
      actor.setData({
        "gait-atlas-id": authoredLayers.actor.atlas.id,
        "gait-frame": characterAtlasFrameKey(authoredLayers.actor),
        "gait-flip-x": authoredLayers.actor.flipX,
        "gait-direction": direction,
        "gait-pose": pose,
      });
      container
        .setPosition(Math.round(centerX), Math.round(baseY))
        .setDepth(getFacilitySceneDepth(baseY, "character", offsetIndex % 64));
      graphics.setVisible(false);
      return baseY;
      }
    }
    const renderSignature = [
      characterAppearanceSignature(resolvedAppearance),
      direction,
      pose,
      this.layout.tileSize,
      displayScale,
    ].join("|");
    const cached = this.characterRenderCache.get(graphics);
    if (!cached || cached.signature !== renderSignature) {
      const frame = getCharacterPixelFrame(resolvedAppearance, {
        direction,
        pose,
      });
      const metrics = getCharacterPresentationMetrics(
        frame,
        this.layout.tileSize * displayScale,
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
