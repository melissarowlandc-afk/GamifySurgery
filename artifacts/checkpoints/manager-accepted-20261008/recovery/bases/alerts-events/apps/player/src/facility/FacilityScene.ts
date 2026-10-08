import Phaser from "phaser";
import { getRoomUpgradeDefinition } from "@gamify-surgery/balance-config";
import type {
  CardinalDirection,
  GridPoint,
  PixelAppearanceDescriptor,
  RoomOrientation,
} from "@gamify-surgery/game-domain";

import type {
  FacilityCameraChangeRequest,
  FacilityCameraView,
  FacilityActorSupportRole,
  CollectLitterRequest,
  FacilityDoorView,
  FacilityDoorSlotView,
  FacilityPatientView,
  FacilityServiceVisitorView,
  FacilityRetailExternalActorView,
  FacilityRoomView,
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
  DescribeCharacterRequest,
  FacilityCharacterRef,
  FacilityFounderChairView,
} from "./types";
import {
  ROOM_TOUCHUP_DECOR_ASSETS,
  TOUCHUP_CORRIDOR,
  TOUCHUP_SPRITES,
  TOUCHUP_TILE_PIXELS,
  applyRoomTouchupsToRecords,
  getRoomTouchup,
  getTouchupCorridorDecor,
  getTouchupCorridorFloorPrimitives,
  getTouchupCorridorRunnerPrimitives,
  getTouchupFloorPrimitives,
  getTouchupGlassPartitionPrimitives,
  getTouchupLighting,
  getTouchupNorthWallBands,
  getTouchupTintTopAt,
  getTouchupRecordFloorLine,
  getVisibleTouchupDecor,
  isTouchupFileSprite,
  isTouchupRecordFloorSortedOnLowWall,
  isTouchupRecordVisible,
  type TouchupDrawRecord,
  type TouchupLighting,
  type TouchupPrimitive,
  type TouchupSprite,
} from "./roomTouchups";
import {
  formatEarningsPopupAmount,
  getEarningsPopupLabelY,
  reconcileEarningsPopups,
  type EarningsPopupState,
} from "./earningsPopupPresentation";
import {
  alignCharacterStillSeatToWorld,
  getCharacterStillPresentationMetrics,
} from "./characterPresentation";
import {
  advanceCharacterHop,
  CHARACTER_HOP,
  characterDrawMotion,
  characterHopOffsetTiles,
  characterMotionSeed,
  RESTING_CHARACTER_MOTION,
  type CharacterDrawMotion,
  type CharacterHopState,
} from "./characterHopMotion";
import {
  getBackedHorizontalBoundaryRuns,
  getExposedHorizontalBoundaryRuns,
  getExposedNorthCornerReturns,
  getExposedVerticalBoundaryRuns,
  getOwnedVerticalBoundaryRuns,
  getOwnedHorizontalBoundaryRuns,
  getOwnedBackedNorthBoundaryRuns,
  getRearWallFaceHeight,
  getVisibleRearWallArtworkFragments,
  isHorizontalBoundarySegmentExposed,
  projectRearWallArtwork,
  projectRearWallRun,
  type BoundaryRun,
  type PixelRectangle,
} from "./roomCutaway";
import { type CharacterDirection, type CharacterPose } from "../art/characterArt";
import {
  characterBitmapLayers,
  characterBitmapRegistration,
  characterStandingBitmapDescriptors,
  characterStillScaleForAppearance,
  characterAtlasFrameKey,
} from "../art/characterBitmapArt";
import {
  captureCharacterMotionPresentation,
  replayCharacterMotionPresentation,
  resolveCharacterMotionPresentation,
  stationaryFloorDirection,
  type CharacterMotionCandidate,
  type CharacterMotionPresentation,
  type CharacterRenderRepresentation,
} from "./characterMotionPresentation";
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
  APPROVED_GS015_ROOM_ATLASES,
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
  getApprovedRoomOrientation,
  getApprovedRoomPresentation,
  getApprovedRoomProofCapture,
  isApprovedProceduralDrawVisible,
  resolveApprovedRoomActorSupports,
  resolveApprovedRoomDrawRecords,
  resolveApprovedRoomProceduralDrawRecords,
  type ApprovedRoomDrawRecord,
  type ApprovedRoomShellPresentation,
  type ApprovedRoomStateVariant,
  type ApprovedWallSegment,
} from "./approvedRoomPresentation";
import {
  getApprovedFloorPrimitives,
  getApprovedDrawPainterGround,
  getApprovedProceduralScreenRect,
  getApprovedRoomStateVariant,
  getApprovedSupportFacing,
  getApprovedSupportPainterGround,
  getNearestApprovedActorSupport,
  parseApprovedCssColor,
  type ApprovedPaintPrimitive,
} from "./approvedRoomRenderer";
import {
  getApprovedSideChairForegroundDepth,
  getApprovedSideChairMaskForDraw,
  partitionApprovedSideChairPixels,
  type ApprovedSideChairMaskDefinition,
} from "./approvedSideChairLayers";
import { resolveStaffIdleSupports } from "./staffIdleSupports";
import { advanceSeatSettle, type SeatSettleState } from "./characterSeatSettle";
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
  parkRouteMotion,
  routeMotionComplete,
  routeMotionStepTiles,
  sampleRouteMotion,
  syncRouteMotion,
  type RouteMotionSample,
  type RouteMotionTrack,
} from "./routeMotion";
import {
  FRONT_DESK_PRESENTATION,
  getFrontDeskFounderSeatedAdjacentReceptionistSeparation,
  getFrontDeskV5StationaryActorDisplay,
  shouldRenderEmptyFrontDeskChair,
  shouldRenderFounderSeatedAtFrontDesk,
  shouldRenderReceptionistSeatedAtFrontDesk,
} from "./frontDeskPresentation";
import {
  getExaminationRoomPresentation,
  isExaminationNorthWallFixtureBacked,
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
  isCanonicalNorthWallDecorFullySupported,
  isCanonicalEnclosedRoomDefinition,
  type CanonicalRoomWallOpening,
  type CanonicalRoomWallRun,
} from "./canonicalRoomShell";
import {
  getSurgeryCenterArchitectureAtScale,
  SURGERY_CENTER_WALL_GEOMETRY,
} from "./surgeryCenterArchitecture";
import { getFixturePresentationSize } from "./fixturePresentation";
import { getEnvironmentTileLogicalPhase } from "./environmentTilePhase";
import { getProceduralSurfaceRow } from "./proceduralSurfacePhase";
import { snapPresentationOrigin } from "./presentationOrigin";
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
import { getDoorPresentationOpenings } from "./doorPresentation";
import { rasterizeGridLine } from "./hallwayPainting";
import { getFacilityWorldSignature } from "./facilityWorldSignature";
import { characterRefFromKey, INSPECT_BOX_FADE_MS, INSPECT_BOX_VISIBLE_MS } from "./characterInspect";

export interface FacilitySceneBridge {
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
  /** Map info box text for a clicked character. */
  onDescribeCharacter?: DescribeCharacterRequest;
  onPraiseEmployee?: PraiseEmployeeRequest;
  onMoveFounder?: MoveFounderRequest;
  onCameraChange?: FacilityCameraChangeRequest;
  /** Build Mode room menu anchor, in canvas pixels; null when nothing is selected. */
  onSelectedRoomRectChange?: (rect: FacilityScreenRect | null) => void;
}

export interface FacilityScreenRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 7x7 pixel star used under Build Mode room labels (owner-approved ink stars).
const BUILD_LABEL_STAR_ROWS = [
  "...#...",
  "..###..",
  "#######",
  ".#####.",
  "..###..",
  ".##.##.",
  ".#...#.",
] as const;
const BUILD_LABEL_UPGRADE_READY_COLOR = 0x3f6b3a;
const BUILD_LABEL_STAR_EMPTY_COLOR = 0xb6b9aa;

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

interface ApprovedSideChairRuntime {
  readonly baseKey: string;
  readonly roomInstanceId: string;
  readonly drawId: string;
  readonly supportIds: readonly string[];
  readonly mask: ApprovedSideChairMaskDefinition;
  readonly baseImage: Phaser.GameObjects.Image;
  readonly foregroundImage: Phaser.GameObjects.Image;
  readonly fullTextureKey: string;
  readonly fullFrame: string;
  readonly rearTextureKey: string;
  readonly foregroundTextureKey: string;
  fixtureDepth: number;
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
  /** Wall-band decor sits above base north walls and below sortable contents. */
  private readonly wallDecorGraphics = new Map<
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
  /** Complementary south-arm layers exist only for six approved E/W chair crops. */
  private readonly approvedSideChairRuntimes = new Map<string, ApprovedSideChairRuntime>();
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
  private activeWallDecorGraphics = new Set<string>();
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
  private founderActivityBox?: Phaser.GameObjects.Graphics;
  /** Click-to-inspect info box above a character or seat (owner request, 2026-10-07). */
  private inspectText?: Phaser.GameObjects.Text;
  private inspectBox?: Phaser.GameObjects.Graphics;
  private inspectTarget:
    | { kind: "character"; key: string; ref: FacilityCharacterRef; shownAt: number }
    | { kind: "seat"; seat: FacilityFounderChairView; label: string; shownAt: number }
    | null = null;
  private inspectLabelCache: { key: string; viewModel: FacilityViewModel; label: string | null } | null = null;
  private pointerDownCharacterKey: string | null = null;
  private waterCoolerLabelText?: Phaser.GameObjects.Text;
  private litterHighlightText?: Phaser.GameObjects.Text;
  private roomTexts: Phaser.GameObjects.Text[] = [];
  private roomStarGraphics: Phaser.GameObjects.Graphics | undefined;
  private lastReportedSelectedRoomRect = "";
  /** Local-only receipt cursor; it never participates in simulation state. */
  private earningsPopupState: EarningsPopupState | undefined;
  private readonly earningsPopupTexts = new Map<
    string,
    Phaser.GameObjects.Text
  >();

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
  /** Real milliseconds of unpaused play; drives breathing, not game speed. */
  private characterRestClockMilliseconds = 0;
  private frameDeltaMilliseconds = 0;
  private characterPresentationWasFrozen = false;
  private readonly routeMotionTracks = new Map<string, RouteMotionTrack>();
  /** Last horizontal render orientation survives a stationary frame without
   * affecting the domain route or persisted character state. */
  private readonly characterFacingRight = new Map<string, boolean>();
  /** Presentation-only records. They deliberately do not enter saves or routes. */
  private readonly characterMotionSnapshots = new Map<
    string,
    CharacterMotionPresentation<PixelAppearanceDescriptor>
  >();
  private readonly characterGaitOffsets = new Map<string, number>();
  /** Hop phase per character, advanced by the distance its route moved. */
  private readonly characterHopStates = new Map<string, CharacterHopState>();
  /** Last drawn motion per character; a frozen redraw reuses it exactly. */
  private readonly characterStepBounceStates = new Map<string, CharacterDrawMotion>();
  /** Glide onto and off seats per character (presentation only). */
  private readonly characterSeatSettles = new Map<string, SeatSettleState>();
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
  private characterStillLoadRequested = false;
  private readonly pendingCharacterStills = new Map<string, import("../art/bitmapAssetManifest").BitmapAssetDescriptor>();
  private readonly failedCharacterStills = new Set<string>();

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
    visible: boolean;
    displayWidth: number | undefined;
    displayHeight: number | undefined;
    originY: number | undefined;
    groundY: number;
    actorLocalY: number | undefined;
    visualLift: number;
    angle: number;
    supportRole: FacilityActorSupportRole | undefined;
    supportId: string | undefined;
    supportRoomInstanceId: string | undefined;
    textureScaleMode: number | undefined;
    textureUsesLinearFiltering: boolean;
  }>>> {
    return Object.fromEntries([...this.characterBitmapContainers.entries()].map(([key, container]) => {
      const actor = container.getByName("actor") as Phaser.GameObjects.Image | null;
      const textureScaleMode = actor?.texture.source[0]?.scaleMode;
      return [key, {
        atlasId: actor?.getData("gait-atlas-id") as string | undefined,
        frame: actor?.getData("gait-frame") as string | undefined,
        flipX: actor?.getData("gait-flip-x") as boolean | undefined,
        direction: actor?.getData("gait-direction") as CharacterDirection | undefined,
        pose: actor?.getData("gait-pose") as CharacterPose | undefined,
        visible: Boolean(container.visible && actor?.visible),
        displayWidth: actor?.displayWidth,
        displayHeight: actor?.displayHeight,
        originY: actor?.originY,
        groundY: container.y,
        actorLocalY: actor?.y,
        visualLift: actor ? -actor.y : 0,
        angle: actor?.angle ?? 0,
        supportRole: (container.getData("actor-support-role") as FacilityActorSupportRole | null | undefined) ?? undefined,
        supportId: (container.getData("actor-support-id") as string | null | undefined) ?? undefined,
        supportRoomInstanceId: (container.getData("actor-support-room-instance-id") as string | null | undefined) ?? undefined,
        textureScaleMode,
        textureUsesLinearFiltering:
          textureScaleMode === Phaser.Textures.FilterMode.LINEAR,
      }];
    }));
  }

  public create(): void {
    this.cameras.main.setBackgroundColor("#7e8476");
    this.cameras.main.setRoundPixels(true);
    this.useSmoothDownscaledTextures();

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
      fontFamily: '"Atkinson Hyperlegible", "Segoe UI", system-ui, -apple-system, sans-serif',
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
        color: "#20282a",
        fontSize: "10px",
        padding: { x: 2, y: 1 },
      })
      .setOrigin(0.5, 1)
      .setDepth(FACILITY_DEPTH_UI)
      .setVisible(false);
    this.founderActivityBox = this.add.graphics()
      .setDepth(FACILITY_DEPTH_UI - 0.01)
      .setVisible(false);
    this.inspectText = this.add
      .text(0, 0, "", {
        ...textStyle,
        align: "center",
        color: "#20282a",
        fontSize: "10px",
        lineSpacing: 1,
        padding: { x: 2, y: 1 },
      })
      .setOrigin(0.5, 1)
      .setDepth(FACILITY_DEPTH_UI + 0.02)
      .setVisible(false);
    this.inspectBox = this.add.graphics()
      .setDepth(FACILITY_DEPTH_UI + 0.01)
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
      ...APPROVED_GS015_ROOM_ATLASES,
      ...ROOM_TOUCHUP_DECOR_ASSETS,
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
   * Room, landscaping and decor sheets are ~1,250-1,450 px bitmaps drawn at a
   * small fraction of native size, most of all when zoomed out. `pixelArt`
   * defaults textures to NEAREST, which keeps one source pixel in 5-14 and
   * speckles trees and furniture. Every texture here is smoothed (characters
   * already were), and the canvas uses its high-quality mipmapped downscale.
   * Canvas resizes reset context state, so the quality is reapplied per frame.
   */
  private useSmoothDownscaledTextures(): void {
    const smooth = (texture: Phaser.Textures.Texture): void => {
      texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
    };
    for (const key of this.textures.getTextureKeys()) {
      smooth(this.textures.get(key));
    }
    const onTextureAdded = (_key: string, texture: Phaser.Textures.Texture): void => {
      smooth(texture);
    };
    this.textures.on(Phaser.Textures.Events.ADD, onTextureAdded);
    const renderer = this.game.renderer;
    const useHighQualitySmoothing = (): void => {
      if ("gameContext" in renderer) {
        renderer.gameContext.imageSmoothingQuality = "high";
      }
    };
    renderer.on(Phaser.Renderer.Events.PRE_RENDER, useHighQualitySmoothing);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.textures.off(Phaser.Textures.Events.ADD, onTextureAdded);
      renderer.off(Phaser.Renderer.Events.PRE_RENDER, useHighQualitySmoothing);
    });
  }

  /** Character art is selected per live actor and loaded lazily. */
  private ensureCharacterAtlases(): void {
    // Deliberately empty: 1,054 stills must never enter the startup preload.
  }

  private ensureCharacterStill(
    asset: import("../art/bitmapAssetManifest").BitmapAssetDescriptor,
  ): boolean {
    const textureKey = getPhaserTextureKey(asset);
    if (this.textures.exists(textureKey)) {
      this.textures.get(textureKey).setFilter(Phaser.Textures.FilterMode.LINEAR);
      return true;
    }
    if (this.failedCharacterStills.has(asset.id)) return false;
    this.ensureCharacterStills([asset]);
    return false;
  }

  private ensureCharacterStills(
    assets: readonly import("../art/bitmapAssetManifest").BitmapAssetDescriptor[],
  ): void {
    for (const asset of assets) {
      const textureKey = getPhaserTextureKey(asset);
      if (this.textures.exists(textureKey)) {
        this.textures.get(textureKey).setFilter(Phaser.Textures.FilterMode.LINEAR);
      } else if (!this.failedCharacterStills.has(asset.id)) {
        this.pendingCharacterStills.set(asset.id, asset);
      }
    }
    if (this.characterStillLoadRequested || this.pendingCharacterStills.size === 0) return;
    this.characterStillLoadRequested = true;
    const requested = [...this.pendingCharacterStills.values()];
    preloadBitmapAssets(this.load, requested);
    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      this.characterStillLoadRequested = false;
      for (const pending of requested) {
        const pendingKey = getPhaserTextureKey(pending);
        if (this.textures.exists(pendingKey)) this.textures.get(pendingKey).setFilter(Phaser.Textures.FilterMode.LINEAR);
        else this.failedCharacterStills.add(pending.id);
        this.pendingCharacterStills.delete(pending.id);
      }
      this.drawCharacters();
      const next = this.pendingCharacterStills.values().next().value;
      if (next) this.ensureCharacterStill(next);
    });
    this.load.start();
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

  /**
   * GS-015 proof records own non-grid source rectangles, so register each
   * requested crop on its actual atlas instead of forcing it through the
   * legacy FixtureId mapping. Registration is idempotent and intentionally
   * per-record: another room pack failing to decode cannot hide this room.
   */
  private registerApprovedRoomFrame(record: ApprovedRoomDrawRecord): string | undefined {
    const atlas = APPROVED_GS015_ROOM_ATLASES.find((candidate) => candidate.id === record.assetId);
    if (!atlas) return undefined;
    const textureKey = getPhaserTextureKey(atlas);
    if (!this.textures.exists(textureKey)) return undefined;
    const frameId = `gs015:${record.assetId}:${record.sourceRect.join(":")}`;
    const texture = this.textures.get(textureKey);
    if (!texture.has(frameId)) {
      texture.add(frameId, 0, record.sourceRect[0], record.sourceRect[1], record.sourceRect[2], record.sourceRect[3]);
    }
    return frameId;
  }

  private ensureApprovedSideChairTextures(
    mask: ApprovedSideChairMaskDefinition,
  ): Readonly<{ rear: string; foreground: string }> | undefined {
    const rear = `approved-chair:${mask.id}:rear`;
    const foreground = `approved-chair:${mask.id}:south-arm`;
    if (this.textures.exists(rear) && this.textures.exists(foreground)) return { rear, foreground };
    const atlas = APPROVED_GS015_ROOM_ATLASES.find((candidate) => candidate.id === mask.assetId);
    if (!atlas) return undefined;
    const source = this.textures.get(getPhaserTextureKey(atlas)).getSourceImage();
    if (!source) return undefined;
    const [sourceX, sourceY, width, height] = mask.sourceRect;
    const rearTexture = this.textures.exists(rear)
      ? this.textures.get(rear) as Phaser.Textures.CanvasTexture
      : this.textures.createCanvas(rear, width, height);
    const foregroundTexture = this.textures.exists(foreground)
      ? this.textures.get(foreground) as Phaser.Textures.CanvasTexture
      : this.textures.createCanvas(foreground, width, height);
    if (!rearTexture || !foregroundTexture) return undefined;
    for (const texture of [rearTexture, foregroundTexture]) {
      texture.context.clearRect(0, 0, width, height);
      texture.context.drawImage(
        source as CanvasImageSource,
        sourceX,
        sourceY,
        width,
        height,
        0,
        0,
        width,
        height,
      );
    }
    const rearPixels = rearTexture.getData(0, 0, width, height);
    const foregroundPixels = foregroundTexture.getData(0, 0, width, height);
    partitionApprovedSideChairPixels(
      rearPixels.data,
      foregroundPixels.data,
      width,
      height,
      mask.southArmPolygon,
    );
    rearTexture.putData(rearPixels, 0, 0);
    foregroundTexture.putData(foregroundPixels, 0, 0);
    rearTexture.refresh();
    foregroundTexture.refresh();
    return { rear, foreground };
  }

  private reconcileApprovedSideChairLayers(): void {
    const actorDepths = new Map<string, number[]>();
    const characterKeys = new Set([
      ...this.characterGraphics.keys(),
      ...this.characterBitmapContainers.keys(),
    ]);
    for (const key of characterKeys) {
      const container = this.characterBitmapContainers.get(key);
      const actor = container?.getByName("actor") as Phaser.GameObjects.Image | null | undefined;
      const graphics = this.characterGraphics.get(key);
      const rendered = container?.visible && actor?.visible
        ? container
        : graphics?.visible ? graphics : undefined;
      if (!rendered) continue;
      const roomInstanceId = rendered.getData("actor-support-room-instance-id") as string | null | undefined;
      const supportId = rendered.getData("actor-support-id") as string | null | undefined;
      if (!roomInstanceId || !supportId) continue;
      const bindingKey = `${roomInstanceId}:${supportId}`;
      const depths = actorDepths.get(bindingKey) ?? [];
      depths.push(rendered.depth);
      actorDepths.set(bindingKey, depths);
    }

    for (const runtime of this.approvedSideChairRuntimes.values()) {
      const depths = runtime.supportIds.flatMap((supportId) =>
        actorDepths.get(`${runtime.roomInstanceId}:${supportId}`) ?? [],
      );
      const foregroundDepth = getApprovedSideChairForegroundDepth(depths);
      const occupied = foregroundDepth !== undefined;
      runtime.baseImage
        .setTexture(occupied ? runtime.rearTextureKey : runtime.fullTextureKey, occupied ? undefined : runtime.fullFrame)
        .setData("approved-draw-id", runtime.drawId)
        .setData("approved-chair-room-instance-id", runtime.roomInstanceId)
        .setData("approved-chair-support-ids", runtime.supportIds)
        .setData("approved-chair-layer", occupied ? "rear" : "full");
      runtime.foregroundImage
        .setPosition(runtime.baseImage.x, runtime.baseImage.y)
        .setDisplaySize(runtime.baseImage.displayWidth, runtime.baseImage.displayHeight)
        .setDepth(foregroundDepth ?? runtime.fixtureDepth)
        .setVisible(occupied)
        .setData("approved-chair-layer", "south-arm")
        .setData("approved-chair-room-instance-id", runtime.roomInstanceId)
        .setData("approved-chair-support-ids", runtime.supportIds)
        .setData("approved-chair-draw-id", runtime.drawId)
        .setData("approved-chair-occupied", occupied);
    }
  }

  public debugApprovedSideChairLayerSnapshot(): readonly Readonly<{
    roomInstanceId: string;
    drawId: string;
    supportIds: readonly string[];
    baseLayer: string | undefined;
    baseDepth: number;
    foregroundVisible: boolean;
    foregroundDepth: number;
  }>[] {
    return [...this.approvedSideChairRuntimes.values()].map((runtime) => ({
      roomInstanceId: runtime.roomInstanceId,
      drawId: runtime.drawId,
      supportIds: runtime.supportIds,
      baseLayer: runtime.baseImage.getData("approved-chair-layer") as string | undefined,
      baseDepth: runtime.baseImage.depth,
      foregroundVisible: runtime.foregroundImage.visible,
      foregroundDepth: runtime.foregroundImage.depth,
    }));
  }

  public update(time: number, delta: number): void {
    const motionFrozen =
      this.bridge.viewModel.paused ||
      Boolean(this.bridge.viewModel.buildMode);
    // A browser/tab pause can leave the first resumed Phaser delta covering
    // the entire pause interval. Drop that one delta so presentation resumes
    // from the exact frozen phase and route sample.
    const resumedFromFrozen = !motionFrozen && this.characterPresentationWasFrozen;
    this.frameDeltaMilliseconds = motionFrozen || resumedFromFrozen ? 0 : delta;
    if (!motionFrozen) {
      // Keep the older phase for unrelated UI pulses. Hops follow each
      // character's route distance; breathing follows this real-time clock.
      this.characterPhase += this.frameDeltaMilliseconds * 0.0025;
      this.characterRestClockMilliseconds += this.frameDeltaMilliseconds;
    }
    this.characterPresentationWasFrozen = motionFrozen;

    this.refreshLayout();
    this.reportSelectedRoomRect();
    this.drawCharacters();
    this.drawEarningsPopups(time);
    // Atlas completion callbacks can redraw outside update(). Delta belongs to
    // this update only, never to a later event-driven redraw.
    this.frameDeltaMilliseconds = 0;
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
    const originX = snapPresentationOrigin(Math.max(
      minimumOriginX,
      Math.min(maximumOriginX, requestedOriginX),
    ));
    const originY = snapPresentationOrigin(Math.max(
      minimumOriginY,
      Math.min(maximumOriginY, requestedOriginY),
    ));
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
    this.activeWallDecorGraphics = new Set<string>();
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
    this.removeInactiveGraphics(
      this.wallDecorGraphics,
      this.activeWallDecorGraphics,
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
    for (const [key, runtime] of this.approvedSideChairRuntimes) {
      if (!this.fixtureBitmapImages.has(runtime.baseKey)) {
        runtime.foregroundImage.destroy();
        this.approvedSideChairRuntimes.delete(key);
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
    graphics: Phaser.GameObjects.Graphics,
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
  ): void {
    if (room.definitionId !== "room.front_desk" || !this.canRenderFrontDeskV5Architecture()) {
      return;
    }
    const projection = getFrontDeskV5Projection(rectangle);
    const openings: readonly FrontDeskV5WallOpening[] = this.getRoomDoorOpenings(room);
    // The previous floorPlate includes a raster frame. Draw the same logical
    // five-by-four material natively so a live doorway is floor only.
    this.drawRoomFloor(graphics, room, projection.floorBounds, this.roomFloorColor(room, 0), true);
    const components = getFrontDeskV5ArchitectureComponents(
      projection,
      openings,
      getBackedHorizontalBoundaryRuns(room, this.bridge.viewModel.rooms, "north"),
      getBackedHorizontalBoundaryRuns(room, this.bridge.viewModel.rooms, "south"),
      this.getCanonicalSideRuns(room, projection.floorBounds),
    );
    for (const component of components) {
      const { bounds } = component;
      this.drawFrontDeskV3ArchitectureArt(
        `front-desk-v5:${component.key}:${room.instanceId}`,
        component.frameId,
        bounds.x + bounds.width / 2,
        bounds.y + bounds.height / 2,
        bounds.width,
        bounds.height,
        component.layer !== "base"
          // West/east side copies plus the south foreground share the
          // south-boundary depth contract; north walls remain behind contents.
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
    const openings: readonly CanonicalRoomWallOpening[] = this.getRoomDoorOpenings(room);
    const shell = getCanonicalRoomShellLayout(
      rectangle,
      orientedSize(room),
      openings,
      false,
      { id: `room-skin:${room.definitionId}` },
      getBackedHorizontalBoundaryRuns(room, this.bridge.viewModel.rooms, "north"),
      getBackedHorizontalBoundaryRuns(room, this.bridge.viewModel.rooms, "south"),
      this.getCanonicalSideRuns(room, rectangle),
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
        component.layer !== "base"
          ? getFacilitySceneDepth(rectangle.y + rectangle.height, "fixture", 63)
          : FACILITY_DEPTH_WORLD + 4,
        tint,
      );
    }
  }

  /** Converts the logical, single-owner vertical grammar to shell pixels. */
  private getCanonicalSideRuns(
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
  ): Readonly<{ west: readonly CanonicalRoomWallRun[]; east: readonly CanonicalRoomWallRun[] }> {
    const unit = rectangle.height / Math.max(1, orientedSize(room).height);
    const openings = this.getRoomDoorOpenings(room);
    const convert = (side: "west" | "east") => getOwnedVerticalBoundaryRuns(
      room,
      this.bridge.viewModel.rooms,
      side,
      openings,
    ).map((run) => ({ start: run.offset * unit, length: run.length * unit }));
    return { west: convert("west"), east: convert("east") };
  }

  /** Draws only actual hallway perimeter strips with the approved proof palette. */
  private drawApprovedHallwayExposedEdges(
    graphics: Phaser.GameObjects.Graphics,
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
    shell: ApprovedRoomShellPresentation,
  ): void {
    const scale = this.layout.tileSize / shell.tilePixels;
    const px = (value: number) => value * scale;
    const cap = px(shell.sideCapWidthPixels);
    const rear = px(shell.rearWallHeightPixels);
    const low = px(shell.southHeightPixels);
    const inset = px(shell.doorInsetPixels);
    const wall = parseApprovedCssColor(shell.rearWall).color;
    const sage = parseApprovedCssColor(shell.baseTrim).color;
    const dark = parseApprovedCssColor(shell.edgeTrim).color;
    const wood = parseApprovedCssColor(shell.doorJamb).color;
    const light = 0x789173;
    const openings = this.getRoomDoorOpenings(room);
    const expanded = (runs: readonly { offset: number; length: number }[]) => new Set(
      runs.flatMap((run) => Array.from({ length: run.length }, (_, index) => run.offset + index)),
    );
    const north = expanded(this.exposedBoundaryRuns(room, "north"));
    const west = expanded(getExposedVerticalBoundaryRuns(room, this.bridge.viewModel.rooms, "west"));
    const east = expanded(getExposedVerticalBoundaryRuns(room, this.bridge.viewModel.rooms, "east"));
    const backed = expanded(getOwnedBackedNorthBoundaryRuns(room, this.bridge.viewModel.rooms, openings));
    const openingAt = (side: "north" | "south" | "west" | "east", offset: number) =>
      openings.some((opening) => opening.side === side && opening.offset === offset);
    const paintNorth = (offset: number) => {
      const left = rectangle.x + offset * this.layout.tileSize;
      const isLow = backed.has(offset);
      const height = isLow ? low : rear;
      const top = rectangle.y - height;
      const paint = (x: number, width: number) => {
        if (!isLow) {
          // Owner-approved house wall for the corridor's tall north wall.
          for (const [above, bandHeight, color] of getTouchupNorthWallBands(TOUCHUP_CORRIDOR.accent, shell.rearWallHeightPixels)) {
            graphics.fillStyle(parseApprovedCssColor(color).color, 1);
            graphics.fillRect(x, rectangle.y - px(above), width, px(bandHeight));
          }
          graphics.fillStyle(dark, 1); graphics.fillRect(x - px(1), top - px(9), width + px(2), px(9));
          graphics.fillStyle(light, 1); graphics.fillRect(x - px(1), top - px(9), width + px(2), px(3));
          return;
        }
        graphics.fillStyle(wall, 1); graphics.fillRect(x, top, width, height);
        graphics.fillStyle(sage, 1); graphics.fillRect(x, rectangle.y - px(24), width, px(24));
        graphics.fillStyle(dark, 1); graphics.fillRect(x - px(1), isLow ? top : top - px(9), width + px(2), px(9));
        graphics.fillStyle(light, 1); graphics.fillRect(x - px(1), isLow ? top : top - px(9), width + px(2), px(3));
      };
      if (!openingAt("north", offset)) { paint(left, this.layout.tileSize); return; }
      paint(left, inset); paint(left + this.layout.tileSize - inset, inset);
      graphics.fillStyle(wood, 1);
      graphics.fillRect(left + inset - px(5), top, px(5), height);
      graphics.fillRect(left + this.layout.tileSize - inset, top, px(5), height);
      if (!isLow) graphics.fillRect(left + inset - px(5), top - px(5), this.layout.tileSize - inset * 2 + px(10), px(6));
    };
    north.forEach(paintNorth);
    for (const side of ["west", "east"] as const) {
      const offsets = side === "west" ? west : east;
      for (const offset of offsets) {
        const left = side === "west" ? rectangle.x - cap : rectangle.x + rectangle.width;
        const top = rectangle.y + offset * this.layout.tileSize;
        const opening = openingAt(side, offset);
        const paint = (y: number, height: number) => {
          graphics.fillStyle(dark, 1); graphics.fillRect(left, y, cap, height);
          graphics.fillStyle(light, 1); graphics.fillRect(left + (side === "east" ? 0 : cap - px(3)), y, px(3), height);
        };
        if (!opening) { paint(top, this.layout.tileSize); continue; }
        paint(top, inset); paint(top + this.layout.tileSize - inset, inset);
        graphics.fillStyle(wood, 1);
        graphics.fillRect(left - px(2), top + inset - px(3), cap + px(4), px(5));
        graphics.fillRect(left - px(2), top + this.layout.tileSize - inset - px(2), cap + px(4), px(5));
      }
    }
  }

  /**
   * The hallway's short south wall where nothing is built to the south. It
   * is drawn on a depth-sorted foreground layer, exactly like every room's
   * south lip, so the sidewalk and landscaping cannot paint over it.
   */
  private drawApprovedHallwaySouthForeground(
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
    shell: ApprovedRoomShellPresentation,
  ): void {
    const south = this.exposedBoundaryRuns(room, "south");
    if (south.length === 0) return;
    const graphics = this.getSortableGraphics(this.roomFixtureGraphics, this.activeRoomFixtureGraphics, `hallway-south:${room.instanceId}`);
    const scale = this.layout.tileSize / shell.tilePixels;
    const px = (value: number) => value * scale;
    const low = px(shell.southHeightPixels);
    const cap = px(shell.sideCapWidthPixels);
    const inset = px(shell.doorInsetPixels);
    const cream = shell.southFace ? parseApprovedCssColor(shell.southFace).color : 0xefe1bd;
    const trim = parseApprovedCssColor(shell.baseTrim).color;
    const dark = parseApprovedCssColor(shell.edgeTrim).color;
    const light = shell.capLight ? parseApprovedCssColor(shell.capLight).color : 0x789173;
    const wood = parseApprovedCssColor(shell.doorJamb).color;
    const southY = rectangle.y + rectangle.height;
    const openings = this.getRoomDoorOpenings(room);
    const paint = (x: number, width: number) => {
      graphics.fillStyle(cream, 1); graphics.fillRect(x, southY, width, low);
      graphics.fillStyle(trim, 1); graphics.fillRect(x, southY + low - px(8), width, px(8));
      graphics.fillStyle(dark, 1); graphics.fillRect(x, southY - px(6), width, px(8));
      graphics.fillStyle(light, 1); graphics.fillRect(x, southY - px(6), width, px(3));
    };
    for (const run of south) {
      for (let offset = run.offset; offset < run.offset + run.length; offset += 1) {
        const left = rectangle.x + offset * this.layout.tileSize;
        const opening = openings.some((door) => door.side === "south" && door.offset === offset);
        if (!opening) { paint(left, this.layout.tileSize); continue; }
        paint(left, inset); paint(left + this.layout.tileSize - inset, inset);
        graphics.fillStyle(wood, 1);
        graphics.fillRect(left + inset - px(5), southY - px(8), px(5), low + px(8));
        graphics.fillRect(left + this.layout.tileSize - inset, southY - px(8), px(5), low + px(8));
      }
    }
    // Exposed side walls run down over the short wall's face, as on rooms.
    const lastRow = orientedSize(room).height - 1;
    for (const side of ["west", "east"] as const) {
      const edgeOffset = side === "west" ? 0 : orientedSize(room).width - 1;
      if (!south.some((run) => edgeOffset >= run.offset && edgeOffset < run.offset + run.length)) continue;
      if (!getExposedVerticalBoundaryRuns(room, this.bridge.viewModel.rooms, side)
        .some((run) => lastRow >= run.offset && lastRow < run.offset + run.length)) continue;
      const x = side === "west" ? rectangle.x - cap : rectangle.x + rectangle.width;
      graphics.fillStyle(dark, 1); graphics.fillRect(x, southY - px(6), cap, low + px(6));
      graphics.fillStyle(light, 1); graphics.fillRect(x + (side === "east" ? 0 : cap - px(3)), southY - px(6), px(3), low + px(6));
    }
    graphics.setDepth(getFacilitySceneDepth(southY + low, "fixture", 63));
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
    const openings: ExaminationDoorOpening[] = [...this.getRoomDoorOpenings(room)];
    const floor = this.roomFloorColor(room, 0);
    graphics.fillStyle(PIXEL_PALETTE_NUMBER.shadow, 0.25);
    graphics.fillRect(rectangle.x + 3, rectangle.y + 4, rectangle.width, rectangle.height);
    graphics.fillStyle(floor, 1);
    graphics.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    this.drawRoomFloor(graphics, room, rectangle, floor);
    this.drawAuthoredRoomFloor(room, rectangle);
    if (!this.canRenderFrontDeskV5Architecture()) return;
    const components = getExaminationV3ArchitectureComponents(
      rectangle,
      size,
      openings,
      getBackedHorizontalBoundaryRuns(room, this.bridge.viewModel.rooms, "north"),
      getBackedHorizontalBoundaryRuns(room, this.bridge.viewModel.rooms, "south"),
      this.getCanonicalSideRuns(room, rectangle),
    );
    for (const component of components) {
      const { bounds } = component;
      this.drawFrontDeskV3ArchitectureArt(
        `examination-v3:${component.key}:${room.instanceId}`,
        component.frameId,
        bounds.x + bounds.width / 2,
        bounds.y + bounds.height / 2,
        bounds.width,
        bounds.height,
        component.layer !== "base"
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
    // Phaser samples at local / scale + phase. Anchor that phase to logical
    // world coordinates: `x`/`y` move with the camera, but the material does
    // not, and adjacent fragments retain their shared source seam.
    const phase = getEnvironmentTileLogicalPhase(
      x,
      y,
      this.layout.originX,
      this.layout.originY,
      tileScale,
    );
    sprite.tilePositionX = phase.x;
    sprite.tilePositionY = phase.y;
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
    this.drawEnvironmentTile(
      `environment:floor:${room.instanceId}`,
      this.roomEnvironmentFloorFrame(room),
      rectangle.x,
      rectangle.y,
      rectangle.width,
      rectangle.height,
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
      // Litter scales with the tile like the furniture around it; a fixed
      // pixel minimum made it oversized when zoomed out. Clicking stays
      // tile-based, so a small drawing does not shrink the target.
      this.drawFixture(
        litterGraphics,
        "litter",
        x,
        y,
        this.layout.tileSize * 0.36,
        this.layout.tileSize * 0.24,
      );
      if (litter.highlighted) {
        const outlineWidth = Math.max(2, pixel);
        const highlightWidth = this.layout.tileSize * 0.54;
        const highlightHeight = this.layout.tileSize * 0.42;
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
    const founderRoom = this.bridge.viewModel.rooms.find(
      (room) => room.definitionId === "room.front_desk",
    ) ?? this.getFounderRoom();
    const coolerIsAtFrontDesk = Boolean(
      founderRoom &&
        cooler.location.x ===
          founderRoom.tileX + FRONT_DESK_PRESENTATION.grid.cooler.x &&
        cooler.location.y ===
          founderRoom.tileY + FRONT_DESK_PRESENTATION.grid.cooler.y,
    );
    const approvedCooler = coolerIsAtFrontDesk && founderRoom
      ? resolveApprovedRoomDrawRecords(
          "room.front_desk",
          0,
          cooler.fillPercent <= 0 ? "emptyWater" : undefined,
        ).find((record) => record.assetId === "gs015:front-desk:upkeep")
      : undefined;
    if (approvedCooler && founderRoom) {
      const rectangle = this.toPixels({
        tileX: founderRoom.tileX,
        tileY: founderRoom.tileY,
        ...orientedSize(founderRoom),
      });
      const left = rectangle.x + approvedCooler.destinationTopLeftTiles[0] * this.layout.tileSize;
      const top = rectangle.y + approvedCooler.destinationTopLeftTiles[1] * this.layout.tileSize;
      const width = approvedCooler.renderSizeTiles[0] * this.layout.tileSize;
      const height = approvedCooler.renderSizeTiles[1] * this.layout.tileSize;
      x = left + width / 2;
      const coolerGraphics = this.getSortableGraphics(
        this.fixtureGraphics,
        this.activeFixtureGraphics,
        "environment:water-cooler-interaction",
      );
      coolerGraphics.setDepth(getFacilitySceneDepth(top + height, "fixture", 63));
      if (cooler.highlighted || cooler.needsRefill) {
        const outlineWidth = Math.max(2, pixel);
        coolerGraphics.lineStyle(
          outlineWidth,
          cooler.highlighted ? PIXEL_PALETTE_NUMBER.highlight : PIXEL_PALETTE_NUMBER.charcoal,
          1,
        );
        coolerGraphics.strokeRect(
          left - outlineWidth * 2,
          top - outlineWidth * 2,
          width + outlineWidth * 4,
          height + outlineWidth * 4,
        );
        if (cooler.highlighted) {
          coolerGraphics.lineStyle(Math.max(1, outlineWidth - 1), PIXEL_PALETTE_NUMBER.charcoal, 1);
          coolerGraphics.strokeRect(
            left - outlineWidth * 4,
            top - outlineWidth * 4,
            width + outlineWidth * 8,
            height + outlineWidth * 8,
          );
        }
      }
      this.waterCoolerLabelText
        ?.setText(cooler.needsRefill ? "REFILL" : "WATER COOLER")
        .setPosition(x, top - Math.max(3, pixel))
        .setVisible(Boolean(cooler.highlighted || cooler.needsRefill));
      return;
    }
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
      const approvedHallway = getApprovedRoomPresentation(room.definitionId);
      if (approvedHallway) {
        this.drawApprovedHallwaySurface(graphics, room, rectangle, approvedHallway.shell);
        this.drawTouchupCorridor(graphics, room, rectangle, "floor");
        this.drawApprovedHallwayExposedEdges(graphics, room, rectangle, approvedHallway.shell);
        this.drawTouchupCorridor(graphics, room, rectangle, "decor");
        this.drawApprovedHallwaySouthForeground(room, rectangle, approvedHallway.shell);
        return;
      }
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
      return;
    }
    if (room.definitionId === "room.imaging_control") {
      // This legacy ID remains loadable but deliberately has no approved proof
      // package and must never revive the retired control-room furniture.
      const neutralShell: ApprovedRoomShellPresentation = {
        tilePixels: 120, rearWallHeightPixels: 90, lowNorthHeightPixels: 29, sideCapWidthPixels: 14, southHeightPixels: 29,
        floorPattern: "neutral clinical vinyl", floorPatternKind: "vinyl", floorPatternSizePixels: 24, floorPatternSeed: 0, floorAlgorithm: "xray-vinyl", floorPalette: ["#d9e1dc"],
        floorGrout: "#7a6c5e", floorAccent: "#000000", floorBase: "#d9e1dc", background: "#f3ead3", rearWall: "#d6d8cf", baseTrim: "#58735a", edgeTrim: "#294632", doorJamb: "#744a29", doorInsetPixels: 12,
      };
      this.drawApprovedRoomSurface(graphics, room, rectangle, neutralShell);
      return;
    }
    const approved = getApprovedRoomPresentation(room.definitionId);
    if (approved) {
      this.drawApprovedRoomSurface(graphics, room, rectangle, approved.shell);
      const roomFixtures = this.getSortableGraphics(
        this.roomFixtureGraphics,
        this.activeRoomFixtureGraphics,
        `room-fixtures:${room.instanceId}`,
      );
      roomFixtures.setDepth(FACILITY_DEPTH_WORLD + 20);
      this.drawRoomFixtures(roomFixtures, room, rectangle, Math.max(5, Math.floor(this.layout.tileSize * 0.14)));
      this.drawApprovedSouthForeground(roomFixtures, room, rectangle, approved.shell);
      if (room.instanceId === this.bridge.viewModel.selectedRoomInstanceId) {
        const inset = Math.max(3, Math.floor(this.layout.tileSize * 0.12));
        graphics.lineStyle(2, 0xffffff, 1);
        graphics.strokeRect(rectangle.x + inset, rectangle.y + inset, rectangle.width - inset * 2, rectangle.height - inset * 2);
      }
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
      this.drawFrontDeskV5Architecture(graphics, room, rectangle);
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

  /** Draws approved shell colors and material while retaining live boundary topology. */
  private drawApprovedRoomSurface(
    graphics: Phaser.GameObjects.Graphics,
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
    shell: ApprovedRoomShellPresentation,
  ): void {
    const orientation: RoomOrientation = room.orientation === 270 ? 270 : 0;
    const capture = getApprovedRoomProofCapture(room.definitionId, orientation);
    const dimensions = orientedSize(room);
    this.drawApprovedPaintPrimitives(
      graphics,
      getApprovedFloorPrimitives(shell, dimensions.width, dimensions.height, capture?.coordinateSpace.floorOriginPixels),
      rectangle.x,
      rectangle.y,
      this.layout.tileSize / shell.tilePixels,
    );
    this.drawCleanlinessWear(graphics, room, rectangle);
    if (getRoomTouchup(room.definitionId)) {
      // Owner-approved touch-ups: wall-base shadow, rugs/mats and furniture
      // contact shadows sit on the floor, below the walls and furniture.
      const { openDoorSegments, backedNorthSegments } = this.getApprovedSegmentState(room);
      const visible = this.getTouchupDrawRecords(room).filter((record) =>
        isTouchupRecordVisible(record, openDoorSegments, backedNorthSegments));
      this.drawTouchupPrimitives(
        graphics,
        getTouchupFloorPrimitives(room.definitionId, orientation, [dimensions.width, dimensions.height], this.getApprovedBaseWidth(room), openDoorSegments, visible),
        rectangle.x,
        rectangle.y,
        this.layout.tileSize / TOUCHUP_TILE_PIXELS,
      );
    }
    this.drawApprovedRoomCaps(graphics, room, rectangle, shell);
  }

  private isHallwayTileAt(x: number, y: number): boolean {
    return this.bridge.viewModel.rooms.some((candidate) => {
      if (candidate.kind !== "hallway" && candidate.definitionId !== "room.hallway") return false;
      const size = orientedSize(candidate);
      return x >= candidate.tileX && x < candidate.tileX + size.width && y >= candidate.tileY && y < candidate.tileY + size.height;
    });
  }

  /** Door openings and low (backed) north segments in the active view's frame. */
  private getApprovedSegmentState(room: FacilityRoomView): Readonly<{
    openDoorSegments: Set<ApprovedWallSegment>;
    backedNorthSegments: Set<ApprovedWallSegment>;
  }> {
    const openDoorSegments = new Set<ApprovedWallSegment>();
    for (const opening of this.getRoomDoorOpenings(room)) {
      const index = opening.offset + 1;
      if (opening.side === "north") openDoorSegments.add(`N${index}`);
      else if (opening.side === "south") openDoorSegments.add(`S${index}`);
      else {
        const letter = String.fromCharCode(64 + index);
        openDoorSegments.add(`${opening.side === "west" ? "W" : "E"}${letter}`);
      }
    }
    const backedNorthSegments = new Set<ApprovedWallSegment>();
    for (const run of getBackedHorizontalBoundaryRuns(room, this.bridge.viewModel.rooms, "north")) {
      for (let index = run.offset + 1; index <= run.offset + run.length; index += 1) backedNorthSegments.add(`N${index}`);
    }
    return { openDoorSegments, backedNorthSegments };
  }

  private getApprovedRoomVariant(room: FacilityRoomView): ApprovedRoomStateVariant | undefined {
    const occupied = (room.definitionId === "room.endoscopy" || room.definitionId === "room.ambulatory_or") &&
      this.bridge.viewModel.endoscopyOccupancy?.roomInstanceIds.includes(room.instanceId);
    return getApprovedRoomStateVariant(
      room.definitionId,
      occupied === true,
      (this.bridge.viewModel.waterCooler?.fillPercent ?? 100) <= 0,
    );
  }

  private getApprovedBaseWidth(room: FacilityRoomView): number {
    return getApprovedRoomOrientation(room.definitionId, 0)?.footprint[0] ?? orientedSize(room).width;
  }

  /** Approved draw records with the owner-approved touch-up rules applied. */
  private getTouchupDrawRecords(room: FacilityRoomView): readonly TouchupDrawRecord[] {
    const orientation: RoomOrientation = room.orientation === 270 ? 270 : 0;
    return applyRoomTouchupsToRecords(
      room.definitionId,
      orientation,
      this.getApprovedBaseWidth(room),
      resolveApprovedRoomDrawRecords(room.definitionId, orientation, this.getApprovedRoomVariant(room)),
    );
  }

  /** Paints touch-up primitives authored at 120 px per tile. */
  private drawTouchupPrimitives(
    graphics: Phaser.GameObjects.Graphics,
    primitives: readonly TouchupPrimitive[],
    originX: number,
    originY: number,
    scale: number,
  ): void {
    for (const primitive of primitives) {
      const { color, alpha } = parseApprovedCssColor(primitive.color);
      const x = originX + primitive.x * scale, y = originY + primitive.y * scale;
      const width = primitive.width * scale, height = primitive.height * scale;
      if (width <= 0 || height <= 0) continue;
      if (primitive.stroke) {
        graphics.lineStyle(Math.max(.5, primitive.stroke * scale), color, alpha * primitive.alpha);
        graphics.strokeRoundedRect(x, y, width, height, Math.min((primitive.radius ?? 0) * scale, width / 2, height / 2));
        continue;
      }
      graphics.fillStyle(color, alpha * primitive.alpha);
      if (primitive.shape === "ellipse") graphics.fillEllipse(x + width / 2, y + height / 2, width, height);
      else if (primitive.shape === "roundRect") graphics.fillRoundedRect(x, y, width, height, Math.min((primitive.radius ?? 0) * scale, width / 2, height / 2));
      else graphics.fillRect(x, y, width, height);
    }
  }

  private drawApprovedPaintPrimitives(
    graphics: Phaser.GameObjects.Graphics,
    primitives: readonly ApprovedPaintPrimitive[],
    originX: number,
    originY: number,
    scale: number,
  ): void {
    for (const primitive of primitives) {
      const parsed = parseApprovedCssColor(primitive.color);
      const alpha = parsed.alpha * (primitive.alpha ?? 1);
      if (primitive.shape === "line") {
        graphics.lineStyle(Math.max(.35, scale), parsed.color, alpha);
        graphics.lineBetween(
          originX + primitive.x * scale,
          originY + primitive.y * scale,
          originX + (primitive.x + primitive.width) * scale,
          originY + (primitive.y + primitive.height) * scale,
        );
      } else if (primitive.shape === "ellipse") {
        graphics.fillStyle(parsed.color, alpha);
        graphics.fillEllipse(
          originX + primitive.x * scale,
          originY + primitive.y * scale,
          primitive.width * scale,
          primitive.height * scale,
        );
      } else {
        graphics.fillStyle(parsed.color, alpha);
        graphics.fillRect(
          originX + primitive.x * scale,
          originY + primitive.y * scale,
          primitive.width * scale,
          primitive.height * scale,
        );
      }
    }
  }

  /** Exact proof wall bands and doorway seams, scaled from authored pixels. */
  private drawApprovedRoomCaps(graphics: Phaser.GameObjects.Graphics, room: FacilityRoomView, rectangle: { x: number; y: number; width: number; height: number }, shell: ApprovedRoomShellPresentation): void {
    const scale = this.layout.tileSize / shell.tilePixels;
    const px = (value: number) => value * scale;
    const cap = px(shell.sideCapWidthPixels);
    const low = px(shell.southHeightPixels);
    const rear = px(shell.rearWallHeightPixels);
    const wall = parseApprovedCssColor(shell.rearWall).color;
    const trim = parseApprovedCssColor(shell.baseTrim).color;
    const dark = parseApprovedCssColor(shell.edgeTrim).color;
    const light = shell.capLight ? parseApprovedCssColor(shell.capLight).color : 0x789173;
    const cream = shell.southFace ? parseApprovedCssColor(shell.southFace).color : 0xefe1bd;
    const wood = parseApprovedCssColor(shell.doorJamb).color;
    const openings = this.getRoomDoorOpenings(room);
    const backed = this.getBackedHorizontalOffsets(room, "north");
    const backedSouth = this.getBackedHorizontalOffsets(room, "south");
    const dimensions = orientedSize(room);
    const inset = px(shell.doorInsetPixels);
    const northBaseHeight = px(room.definitionId === "room.front_desk" ? 23 : 23);
    const touchupAccent = getRoomTouchup(room.definitionId)?.accent;
    for (let offset = 0; offset < dimensions.width; offset += 1) {
      const left = rectangle.x + offset * this.layout.tileSize;
      const isBacked = backed.has(offset);
      const height = isBacked ? low : rear;
      const top = rectangle.y - height;
      const opening = openings.some((door) => door.side === "north" && door.offset === offset);
      const paintRun = (x: number, width: number) => {
        if (width <= 0) return;
        if (isBacked && touchupAccent && this.isHallwayTileAt(room.tileX + offset, room.tileY - 1)) {
          // Owner revision: the hallway's own south wall. Same short-wall look
          // as every room's south lip: dark cap, cream face, green base.
          graphics.fillStyle(cream, 1); graphics.fillRect(x, top, width, height);
          graphics.fillStyle(trim, 1); graphics.fillRect(x, rectangle.y - px(8), width, px(8));
          graphics.fillStyle(dark, 1); graphics.fillRect(x, top, width, px(8));
          graphics.fillStyle(light, 1); graphics.fillRect(x, top, width, px(3));
          return;
        }
        if (!isBacked && touchupAccent) {
          // House wall: cream upper, deep-green rail, room accent below, green base.
          for (const [above, bandHeight, color] of getTouchupNorthWallBands(touchupAccent, shell.rearWallHeightPixels)) {
            graphics.fillStyle(parseApprovedCssColor(color).color, 1);
            graphics.fillRect(x, rectangle.y - px(above), width, px(bandHeight));
          }
          graphics.fillStyle(dark, 1); graphics.fillRect(x, rectangle.y - px(7), width, px(7));
          return;
        }
        graphics.fillStyle(isBacked && room.definitionId !== "room.front_desk" ? trim : wall, 1);
        graphics.fillRect(x, top, width, height);
        if (!isBacked) {
          graphics.fillStyle(trim, 1); graphics.fillRect(x, rectangle.y - northBaseHeight, width, northBaseHeight);
          graphics.fillStyle(light, 1); graphics.fillRect(x, rectangle.y - northBaseHeight, width, px(4));
        } else if (room.definitionId === "room.front_desk") {
          graphics.fillStyle(trim, 1); graphics.fillRect(x, top, width, px(8));
        } else {
          graphics.fillStyle(light, 1); graphics.fillRect(x, top, width, px(4));
        }
        graphics.fillStyle(dark, 1); graphics.fillRect(x, rectangle.y - px(7), width, px(7));
      };
      if (opening) {
        paintRun(left, inset);
        paintRun(left + this.layout.tileSize - inset, inset);
        graphics.fillStyle(wood, 1);
        graphics.fillRect(left + inset - px(5), top, px(5), height);
        graphics.fillRect(left + this.layout.tileSize - inset, top, px(5), height);
        if (!isBacked) graphics.fillRect(left + inset - px(5), top - px(5), this.layout.tileSize - inset * 2 + px(10), px(6));
      } else paintRun(left, this.layout.tileSize);
      if (!isBacked) {
        graphics.fillStyle(dark, 1); graphics.fillRect(left - px(1), rectangle.y - rear - px(9), this.layout.tileSize + px(2), px(9));
        graphics.fillStyle(light, 1); graphics.fillRect(left - px(1), rectangle.y - rear - px(9), this.layout.tileSize + px(2), px(3));
      }
    }
    for (const side of ["west", "east"] as const) {
      const x = side === "west" ? rectangle.x - cap + px(2) : rectangle.x + rectangle.width - px(2);
      const top = backed.has(side === "west" ? 0 : dimensions.width - 1) ? rectangle.y - low : rectangle.y - rear - px(9);
      const sideOpenings = openings.filter((door) => door.side === side).sort((left, right) => left.offset - right.offset);
      const paintCap = (segmentTop: number, segmentHeight: number) => {
        if (segmentHeight <= 0) return;
        graphics.fillStyle(dark, 1); graphics.fillRect(x, segmentTop, cap, segmentHeight);
        graphics.fillStyle(light, 1); graphics.fillRect(x + (side === "west" ? cap - px(3) : 0), segmentTop, px(3), segmentHeight);
      };
      let cursor = top;
      for (const opening of sideOpenings) {
        const doorTop = rectangle.y + opening.offset * this.layout.tileSize + inset;
        const doorHeight = this.layout.tileSize - inset * 2;
        paintCap(cursor, doorTop - cursor);
        graphics.fillStyle(wood, 1);
        graphics.fillRect(x - px(2), doorTop - px(3), cap + px(4), px(5));
        graphics.fillRect(x - px(2), doorTop + doorHeight - px(2), cap + px(4), px(5));
        cursor = doorTop + doorHeight;
      }
      paintCap(cursor, rectangle.y + rectangle.height + low - cursor);
    }
    const southY = rectangle.y + rectangle.height;
    for (let offset = 0; offset < dimensions.width; offset += 1) {
      // The room on the south side owns a shared horizontal boundary through
      // its short north wall. Do not repeat this room's foreground lip.
      if (backedSouth.has(offset)) continue;
      if (room.definitionId === "room.front_desk" && offset === 2) continue;
      const left = rectangle.x + offset * this.layout.tileSize;
      const opening = openings.some((door) => door.side === "south" && door.offset === offset);
      const paintSouth = (x: number, width: number) => {
        graphics.fillStyle(cream, 1); graphics.fillRect(x, southY, width, low);
        graphics.fillStyle(trim, 1); graphics.fillRect(x, southY + low - px(8), width, px(8));
        graphics.fillStyle(dark, 1); graphics.fillRect(x, southY - px(6), width, px(8));
        graphics.fillStyle(light, 1); graphics.fillRect(x, southY - px(6), width, px(3));
      };
      if (opening) {
        paintSouth(left, inset);
        paintSouth(left + this.layout.tileSize - inset, inset);
        graphics.fillStyle(wood, 1);
        graphics.fillRect(left + inset - px(5), southY - px(8), px(5), low + px(8));
        graphics.fillRect(left + this.layout.tileSize - inset, southY - px(8), px(5), low + px(8));
      } else paintSouth(left, this.layout.tileSize);
    }
    if (room.definitionId === "room.front_desk") {
      const entryLeft = rectangle.x + this.layout.tileSize * 2;
      graphics.fillStyle(0xccb783, 1); graphics.fillRect(entryLeft + px(5), southY - px(2), this.layout.tileSize - px(10), px(5));
      for (const jambX of [entryLeft - px(12), entryLeft + this.layout.tileSize]) {
        graphics.fillStyle(cream, 1); graphics.fillRect(jambX, southY - px(13), px(12), px(42));
        graphics.fillStyle(trim, 1); graphics.fillRect(jambX, southY + px(20), px(12), px(9));
        graphics.fillStyle(dark, 1); graphics.fillRect(jambX - px(2), southY - px(16), px(16), px(7));
      }
    }
  }

  private drawApprovedHallwaySurface(
    graphics: Phaser.GameObjects.Graphics,
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
    shell: ApprovedRoomShellPresentation,
  ): void {
    this.drawApprovedPaintPrimitives(
      graphics,
      getApprovedFloorPrimitives(
        shell,
        rectangle.width / this.layout.tileSize,
        rectangle.height / this.layout.tileSize,
        [room.tileX * shell.tilePixels, room.tileY * shell.tilePixels],
      ),
      rectangle.x,
      rectangle.y,
      this.layout.tileSize / shell.tilePixels,
    );
  }

  /** Repaints the proof's low south wall above actors whose feet pass behind it. */
  private drawApprovedSouthForeground(
    graphics: Phaser.GameObjects.Graphics,
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
    shell: ApprovedRoomShellPresentation,
  ): void {
    const scale = this.layout.tileSize / shell.tilePixels;
    const px = (value: number) => value * scale;
    const low = px(shell.southHeightPixels);
    const inset = px(shell.doorInsetPixels);
    const cream = shell.southFace ? parseApprovedCssColor(shell.southFace).color : 0xefe1bd;
    const trim = parseApprovedCssColor(shell.baseTrim).color;
    const dark = parseApprovedCssColor(shell.edgeTrim).color;
    const light = shell.capLight ? parseApprovedCssColor(shell.capLight).color : 0x789173;
    const wood = parseApprovedCssColor(shell.doorJamb).color;
    const southY = rectangle.y + rectangle.height;
    const openings = this.getRoomDoorOpenings(room);
    const dimensions = orientedSize(room);
    const backedSouth = this.getBackedHorizontalOffsets(room, "south");
    const paint = (x: number, width: number) => {
      graphics.fillStyle(cream, 1); graphics.fillRect(x, southY, width, low);
      graphics.fillStyle(trim, 1); graphics.fillRect(x, southY + low - px(8), width, px(8));
      graphics.fillStyle(dark, 1); graphics.fillRect(x, southY - px(6), width, px(8));
      graphics.fillStyle(light, 1); graphics.fillRect(x, southY - px(6), width, px(3));
    };
    for (let offset = 0; offset < dimensions.width; offset += 1) {
      // Match the base-cap ownership rule so the foreground repaint cannot
      // restore a south lip over the southern room's short north wall.
      if (backedSouth.has(offset)) continue;
      if (room.definitionId === "room.front_desk" && offset === 2) continue;
      const left = rectangle.x + offset * this.layout.tileSize;
      const opening = openings.some((door) => door.side === "south" && door.offset === offset);
      if (!opening) { paint(left, this.layout.tileSize); continue; }
      paint(left, inset); paint(left + this.layout.tileSize - inset, inset);
      graphics.fillStyle(wood, 1);
      graphics.fillRect(left + inset - px(5), southY - px(8), px(5), low + px(8));
      graphics.fillRect(left + this.layout.tileSize - inset, southY - px(8), px(5), low + px(8));
    }
    if (room.definitionId === "room.front_desk") {
      const entryLeft = rectangle.x + this.layout.tileSize * 2;
      // The entrance threshold is floor, not wall: keep it under everyone
      // walking through the front door (above only the sidewalk edge line).
      const threshold = this.getSortableGraphics(this.roomFixtureGraphics, this.activeRoomFixtureGraphics, `front-desk-threshold:${room.instanceId}`);
      threshold.fillStyle(0xccb783, 1); threshold.fillRect(entryLeft + px(5), southY - px(2), this.layout.tileSize - px(10), px(5));
      threshold.setDepth(FACILITY_DEPTH_WORLD + 31);
      for (const jambX of [entryLeft - px(12), entryLeft + this.layout.tileSize]) {
        graphics.fillStyle(cream, 1); graphics.fillRect(jambX, southY - px(13), px(12), px(42));
        graphics.fillStyle(trim, 1); graphics.fillRect(jambX, southY + px(20), px(12), px(9));
        graphics.fillStyle(dark, 1); graphics.fillRect(jambX - px(2), southY - px(16), px(16), px(7));
      }
    }
    graphics.setDepth(getFacilitySceneDepth(southY + low, "fixture", 63));
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
    if (tier < 2 || !getRoomUpgradeDefinition(room.definitionId)?.appearanceChanges) {
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

  /** Converts adjacent horizontal room runs into local tile offsets. */
  private getBackedHorizontalOffsets(
    room: FacilityRoomView,
    side: "north" | "south",
  ): ReadonlySet<number> {
    const backed = new Set<number>();
    for (const run of getBackedHorizontalBoundaryRuns(
      room,
      this.bridge.viewModel.rooms,
      side,
    )) {
      for (let offset = run.offset; offset < run.offset + run.length; offset += 1) {
        backed.add(offset);
      }
    }
    return backed;
  }

  /** Presentation-only direct plus reciprocal wall apertures for this room. */
  private getRoomDoorOpenings(room: FacilityRoomView): readonly CanonicalRoomWallOpening[] {
    return getDoorPresentationOpenings(
      room,
      this.bridge.viewModel.doors ?? [],
      this.bridge.viewModel.rooms,
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
      // Owner-approved single Doors tool: empty wall slots add a door and
      // existing interior doors remove one, without switching modes.
      return [
        ...this.getBuildDoorPlaceTargets(),
        ...this.getBuildDoorRemoveTargets(),
      ];
    }
    return this.getBuildDoorRemoveTargets();
  }

  private getBuildDoorPlaceTargets(): FacilityDoorInteractionTarget[] {
    const model = this.bridge.viewModel;
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

  private getBuildDoorRemoveTargets(): FacilityDoorInteractionTarget[] {
    const model = this.bridge.viewModel;
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
    forceFrontDeskTiles = false,
  ): void {
    // Floor material owns the full logical tile rectangle. Baseboards and all
    // perimeter treatment are shell-only, so a persisted door can be empty.
    const left = rectangle.x;
    const top = rectangle.y;
    const right = rectangle.x + rectangle.width;
    const bottom = rectangle.y + rectangle.height;
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
      if (this.canRenderFrontDeskV4Architecture() && !forceFrontDeskTiles) {
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
          x + (getProceduralSurfaceRow(y, top, speckle) % 2) * 3,
          y,
          1,
          1,
        );
      }
    }
  }

  private roomWallFaceColor(room: FacilityRoomView): number {
    const approved = getApprovedRoomPresentation(room.definitionId);
    if (approved) {
      return Phaser.Display.Color.HexStringToColor(approved.shell.rearWall).color;
    }
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
    const verticalCuts = new Map<number, Array<{ start: number; end: number }>>();
    const horizontalCuts = new Map<number, Array<{ start: number; end: number }>>();
    for (const room of this.bridge.viewModel.rooms) {
      const size = orientedSize(room);
      for (const opening of this.getRoomDoorOpenings(room)) {
        if (opening.side === "east" || opening.side === "west") {
          const gridX = room.tileX + (opening.side === "east" ? size.width : 0);
          const list = verticalCuts.get(gridX) ?? [];
          list.push({ start: room.tileY + opening.offset, end: room.tileY + opening.offset + 1 });
          verticalCuts.set(gridX, list);
        } else {
          const gridY = room.tileY + (opening.side === "south" ? size.height : 0);
          const list = horizontalCuts.get(gridY) ?? [];
          list.push({ start: room.tileX + opening.offset, end: room.tileX + opening.offset + 1 });
          horizontalCuts.set(gridY, list);
        }
      }
    }
    const drawLineWithCuts = (
      axis: "vertical" | "horizontal",
      coordinate: number,
      span: number,
      cuts: readonly { start: number; end: number }[],
    ) => {
      let cursor = 0;
      for (const cut of [...cuts].sort((left, right) => left.start - right.start)) {
        const start = Math.max(cursor, cut.start);
        if (start > cursor) {
          if (axis === "vertical") graphics.lineBetween(coordinate, originY + cursor * tileSize, coordinate, originY + start * tileSize);
          else graphics.lineBetween(originX + cursor * tileSize, coordinate, originX + start * tileSize, coordinate);
        }
        cursor = Math.max(cursor, cut.end);
      }
      if (cursor < span) {
        if (axis === "vertical") graphics.lineBetween(coordinate, originY + cursor * tileSize, coordinate, originY + span * tileSize);
        else graphics.lineBetween(originX + cursor * tileSize, coordinate, originX + span * tileSize, coordinate);
      }
    };
    for (let column = 0; column <= columns; column += 1) {
      const x = originX + column * tileSize;
      drawLineWithCuts("vertical", x, rows, verticalCuts.get(column) ?? []);
    }
    for (let row = 0; row <= rows; row += 1) {
      const y = originY + row * tileSize;
      drawLineWithCuts("horizontal", y, columns, horizontalCuts.get(row) ?? []);
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
    // Sidewalk joints are relative to the semantic site edge, never the
    // screen's current coordinate system, so they move with the pavement.
    const firstSlab = originX;
    for (let x = firstSlab; x <= originX + width; x += slabWidth) {
      graphics.lineBetween(x, sidewalkTop + 2, x, sidewalkBottom - 2);
    }
    graphics.lineStyle(Math.max(1, Math.floor(tileSize * 0.06)), PIXEL_PALETTE_NUMBER.charcoal, 0.55);
    graphics.lineBetween(originX, sidewalkBottom - Math.max(2, tileSize * 0.12), originX + width, sidewalkBottom - Math.max(2, tileSize * 0.12));

    const founder = this.getFounderRoom();
    if (!founder) return;
    const founderPixels = this.toPixels({ tileX: founder.tileX, tileY: founder.tileY, ...orientedSize(founder) });
    // The Front Desk's south shell already omits its protected exterior door
    // tile. Do not paint a threshold, shadow, or jamb here: the room floor
    // must meet the sidewalk directly at the opening.

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
    if (this.drawApprovedRoomFixtures(room, rectangle)) return;
    const visualLayout = getRoomVisualLayout(room.definitionId);
    const furnitureOrientation = getRoomVisualOrientation(
      visualLayout,
      room.orientation,
    );
    const left = rectangle.x + inset;
    const canonicalOpenings: readonly CanonicalRoomWallOpening[] = isCanonicalEnclosedRoomDefinition(room.definitionId)
      ? this.getRoomDoorOpenings(room)
      : [];
    const backedNorthRuns = getBackedHorizontalBoundaryRuns(
      room,
      this.bridge.viewModel.rooms,
      "north",
    );
    const canonicalShell = isCanonicalEnclosedRoomDefinition(room.definitionId)
      ? getCanonicalRoomShellLayout(rectangle, orientedSize(room), canonicalOpenings, false, {
        id: `room-skin:${room.definitionId}`,
      }, backedNorthRuns)
      : undefined;
    const wallDecorationGraphics = canonicalShell
      ? this.getSortableGraphics(
        this.wallDecorGraphics,
        this.activeWallDecorGraphics,
        `room-wall-decor:${room.instanceId}`,
      ).setDepth(FACILITY_DEPTH_WORLD + 21)
      : graphics;
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
          wallDecorationGraphics,
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
        wallDecorationGraphics,
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
      const northDoorOffsets = this.getRoomDoorOpenings(room)
        .filter((door) => door.side === "north")
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
          const frontDeskOpenings: readonly CanonicalRoomWallOpening[] = this.getRoomDoorOpenings(room);
          const frontDeskShell = getCanonicalRoomShellLayout(
            frontDeskV5Projection.floorBounds,
            FRONT_DESK_PRESENTATION.footprint,
            frontDeskOpenings,
            false,
            undefined,
            backedNorthRuns,
          );
          FRONT_DESK_PRESENTATION.northWallFixtures.forEach((fixture) => {
            const width = frontDeskV5Projection.floorBounds.width * fixture.width;
            const height = northWallHeight * fixture.height;
            const centerX = frontDeskV5Projection.floorBounds.x +
              frontDeskV5Projection.floorBounds.width * fixture.x;
            const centerY = frontDeskV5Projection.floorBounds.y - northWallHeight * 0.49;
            if (!isCanonicalNorthWallDecorFullySupported(
              frontDeskShell,
              frontDeskV5Projection.floorBounds,
              { x: centerX - width / 2, y: centerY - height / 2, width, height },
            )) return;
            this.drawFrontDeskV2Art(
              `front-desk-v5:decor:${room.instanceId}:${fixture.id}`,
              fixture.id as FrontDeskV2ArtId,
              centerX,
              centerY,
              width,
              height,
              // North decor sits on its base wall, below floor contents.
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
          const examinationOpenings: ExaminationDoorOpening[] = [...this.getRoomDoorOpenings(room)];
          const northDoorOffsets = examinationOpenings
            .filter((opening) => opening.side === "north")
            .map((opening) => opening.offset);
          const canonicalNorthHeight = getExaminationV3ArchitectureComponents(
            rectangle,
            orientedSize(room),
            examinationOpenings,
            backedNorthRuns,
          ).find((component) => component.side === "north")?.bounds.height ?? wallHeight;
          const placeExaminationWall = (fixture: (typeof presentation.fixtures)[number]) => {
            // A decoration belongs to a real remaining north-wall interval.
            // Its authored logical slot is deliberately exact: another north
            // door does not suppress it, but a door in this slot does.
            const backedOffsets = backedNorthRuns.flatMap((run) =>
              Array.from({ length: run.length }, (_, index) => run.offset + index),
            );
            if (
              isExaminationNorthWallFixtureBacked(fixture, backedOffsets) ||
              !isExaminationNorthWallFixtureVisible(fixture, northDoorOffsets)
            ) return;
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
            // North wall art remains above its base wall and below contents.
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

    const visualTier = getRoomUpgradeDefinition(room.definitionId)?.appearanceChanges
      ? Math.max(1, Math.min(5, room.upgradeLevel ?? 1))
      : 1;
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

  /**
   * Static proof records are drawn one image per authored crop. Their
   * destination coordinates are already normalized to the proof floor origin;
   * deliberately do not replay the proof canvas transform or global SCALE.
   */
  private drawApprovedRoomFixtures(
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
  ): boolean {
    const presentation = getApprovedRoomPresentation(room.definitionId);
    if (!presentation) return false;
    const orientation: RoomOrientation = room.orientation === 270 ? 270 : 0;
    const records = this.getTouchupDrawRecords(room);
    const { openDoorSegments, backedNorthSegments } = this.getApprovedSegmentState(room);
    const lighting = this.getTouchupRoomLighting(room, presentation.shell, openDoorSegments, backedNorthSegments);
    const tintTopY = (centerXTiles: number) => lighting
      ? rectangle.y + getTouchupTintTopAt(lighting, centerXTiles) * this.layout.tileSize / TOUCHUP_TILE_PIXELS
      : undefined;
    let order = 0;
    for (const record of records) {
      if (!isTouchupRecordVisible(record, openDoorSegments, backedNorthSegments)) continue;
      const frame = this.registerApprovedRoomFrame(record);
      const atlas = APPROVED_GS015_ROOM_ATLASES.find((candidate) => candidate.id === record.assetId);
      if (!frame || !atlas) continue; // This room alone waits for its pack; never choose legacy art.
      const [leftTiles, topTiles] = record.destinationTopLeftTiles;
      const [widthTiles, heightTiles] = record.renderSizeTiles;
      const left = rectangle.x + leftTiles * this.layout.tileSize;
      const top = rectangle.y + topTiles * this.layout.tileSize;
      const width = Math.max(1, widthTiles * this.layout.tileSize);
      const height = Math.max(1, heightTiles * this.layout.tileSize);
      const contactY = rectangle.y + getApprovedDrawPainterGround(record) * this.layout.tileSize;
      const key = `approved:${room.instanceId}:${orientation}:${record.id}:${order}`;
      let image = this.fixtureBitmapImages.get(key);
      if (!image) {
        image = this.add.image(left, top, getPhaserTextureKey(atlas), frame);
        this.fixtureBitmapImages.set(key, image);
      }
      // North-wall floor furniture kept on a low wall sorts by its own floor
      // line, so corridor walkers and anything else north of it draw behind.
      const recordDepth = isTouchupRecordFloorSortedOnLowWall(record, backedNorthSegments)
        ? getFacilitySceneDepth(rectangle.y + getTouchupRecordFloorLine(record) * this.layout.tileSize, "fixture", order % 64)
        : record.depthPolicy === "wall"
          ? FACILITY_DEPTH_WORLD + 19
          : getFacilitySceneDepth(contactY, "fixture", order % 64);
      image.setTexture(getPhaserTextureKey(atlas), frame)
        .setOrigin(0, 0)
        .setPosition(Math.round(left), Math.round(top))
        .setDisplaySize(Math.round(width), Math.round(height))
        .setDepth(recordDepth)
        .setVisible(true)
        .setData("approved-draw-id", record.id);
      this.activeFixtureBitmapImages.add(key);
      if (lighting) {
        this.drawTouchupTintedTop(`${key}:tint`, getPhaserTextureKey(atlas), frame, left, top, width, height,
          tintTopY(leftTiles + widthTiles / 2)!, lighting.color, recordDepth);
      }
      const chairMask = getApprovedSideChairMaskForDraw(room.definitionId, orientation, record);
      if (chairMask) {
        const textures = this.ensureApprovedSideChairTextures(chairMask);
        if (textures) {
          const existing = this.approvedSideChairRuntimes.get(key);
          if (existing && existing.mask.id !== chairMask.id) {
            existing.foregroundImage.destroy();
            this.approvedSideChairRuntimes.delete(key);
          }
          let runtime = this.approvedSideChairRuntimes.get(key);
          if (!runtime) {
            const foregroundImage = this.add.image(left, top, textures.foreground)
              .setOrigin(0, 0)
              .setVisible(false);
            runtime = {
              baseKey: key,
              roomInstanceId: room.instanceId,
              drawId: record.id,
              supportIds: chairMask.supportIds,
              mask: chairMask,
              baseImage: image,
              foregroundImage,
              fullTextureKey: getPhaserTextureKey(atlas),
              fullFrame: frame,
              rearTextureKey: textures.rear,
              foregroundTextureKey: textures.foreground,
              fixtureDepth: recordDepth,
            };
            this.approvedSideChairRuntimes.set(key, runtime);
          }
          runtime.fixtureDepth = recordDepth;
          runtime.foregroundImage
            .setTexture(runtime.foregroundTextureKey)
            .setPosition(Math.round(left), Math.round(top))
            .setDisplaySize(Math.round(width), Math.round(height))
            .setDepth(recordDepth)
            .setVisible(false);
          image
            .setData("approved-chair-room-instance-id", room.instanceId)
            .setData("approved-chair-support-ids", chairMask.supportIds)
            .setData("approved-chair-layer", "full");
        }
      }
      order += 1;
    }
    for (const procedural of resolveApprovedRoomProceduralDrawRecords(room.definitionId, orientation)) {
      if (!isApprovedProceduralDrawVisible(procedural, openDoorSegments, backedNorthSegments)) continue;
      const graphics = this.getSortableGraphics(
        this.fixtureGraphics,
        this.activeFixtureGraphics,
        `approved-procedural:${room.instanceId}:${procedural.id}`,
      );
      const proofRect = getApprovedProceduralScreenRect(procedural, presentation.shell.tilePixels);
      const scale = this.layout.tileSize / presentation.shell.tilePixels;
      const left = rectangle.x + proofRect.left * scale;
      const top = rectangle.y + proofRect.top * scale;
      const width = proofRect.width * scale;
      const height = proofRect.height * scale;
      if (procedural.style.kind === "ct-observation-partition" && getRoomTouchup(room.definitionId)?.glassPartition) {
        // Owner-approved framed glass observation window.
        const k = TOUCHUP_TILE_PIXELS / presentation.shell.tilePixels;
        this.drawTouchupPrimitives(
          graphics,
          getTouchupGlassPartitionPrimitives({ left: proofRect.left * k, top: proofRect.top * k, width: proofRect.width * k, height: proofRect.height * k }),
          rectangle.x,
          rectangle.y,
          this.layout.tileSize / TOUCHUP_TILE_PIXELS,
        );
      } else if (procedural.style.kind === "ct-observation-partition") {
        graphics.fillStyle(parseApprovedCssColor(procedural.style.body).color, 1);
        graphics.fillRect(left, top, width, height);
        graphics.fillStyle(parseApprovedCssColor(procedural.style.topHighlight).color, 1);
        graphics.fillRect(left, top, width, procedural.style.highlightHeightPixels * scale);
        graphics.fillStyle(parseApprovedCssColor(procedural.style.topDark).color, 1);
        graphics.fillRect(left, top, width, procedural.style.darkHeightPixels * scale);
        const windowTop = top + height * procedural.style.windowTopFraction;
        const windowHeight = height * procedural.style.windowHeightFraction;
        graphics.fillStyle(parseApprovedCssColor(procedural.style.windowOuter).color, 1);
        graphics.fillRect(left - procedural.style.windowOuterHorizontalBleedPixels * scale, windowTop, width + procedural.style.windowOuterHorizontalBleedPixels * 2 * scale, windowHeight);
        graphics.fillStyle(parseApprovedCssColor(procedural.style.windowInner).color, 1);
        graphics.fillRect(left - procedural.style.windowInnerHorizontalBleedPixels * scale, windowTop + procedural.style.windowInnerVerticalInsetPixels * scale, width + procedural.style.windowInnerHorizontalBleedPixels * 2 * scale, windowHeight - procedural.style.windowInnerVerticalInsetPixels * 2 * scale);
      } else if (procedural.style.kind === "recovery-top-cap") {
        graphics.fillStyle(parseApprovedCssColor(procedural.style.dark).color, 1);
        graphics.fillRect(left, top, width, height);
        graphics.fillStyle(parseApprovedCssColor(procedural.style.light).color, 1);
        graphics.fillRect(left, top, procedural.style.lightHeightPixels * scale, height);
      } else {
        graphics.fillStyle(parseApprovedCssColor(procedural.style.face).color, 1);
        graphics.fillRect(left, top, width, height);
        graphics.fillStyle(parseApprovedCssColor(procedural.style.dark).color, 1);
        graphics.fillRect(left, top + height - procedural.style.darkHeightPixels * scale, width, procedural.style.darkHeightPixels * scale);
        graphics.fillStyle(parseApprovedCssColor(procedural.style.light).color, 1);
        graphics.fillRect(left, top + height - procedural.style.darkHeightPixels * scale, width, procedural.style.lightHeightPixels * scale);
      }
      const depth = procedural.drawPhase === "before-bitmaps"
        ? FACILITY_DEPTH_WORLD + 18
        : procedural.drawPhase === "after-scanner-before-console"
          ? getFacilitySceneDepth(rectangle.y + procedural.depthKey * this.layout.tileSize, "fixture", 41)
          : getFacilitySceneDepth(rectangle.y + procedural.depthKey * this.layout.tileSize, "fixture", 32);
      graphics.setDepth(depth);
    }
    for (const item of getVisibleTouchupDecor(room.definitionId, orientation, this.getApprovedBaseWidth(room), openDoorSegments, backedNorthSegments)) {
      const key = `touchup:${room.instanceId}:${orientation}:${item.id}`;
      const placed = this.drawTouchupSprite(
        key,
        TOUCHUP_SPRITES[item.sprite],
        rectangle.x + item.x * this.layout.tileSize,
        item.kind === "wall" ? rectangle.y + (item.top ?? 0) * this.layout.tileSize : rectangle.y + (item.y ?? 0) * this.layout.tileSize,
        item.widthTiles,
        item.kind,
      );
      if (placed && lighting) {
        this.drawTouchupTintedTop(`${key}:tint`, placed.textureKey, placed.frame, placed.left, placed.top, placed.width, placed.height,
          tintTopY(item.x)!, lighting.color, placed.depth);
      }
    }
    if (lighting) this.drawTouchupLighting(room, rectangle, presentation.shell, lighting);
    return true;
  }

  /** The room's current lighting; imaging rooms only while a scan is running. */
  private getTouchupRoomLighting(
    room: FacilityRoomView,
    shell: ApprovedRoomShellPresentation,
    openDoorSegments: ReadonlySet<string>,
    backedNorthSegments: ReadonlySet<string>,
  ): TouchupLighting | undefined {
    const dimensions = orientedSize(room);
    return getTouchupLighting(
      room.definitionId,
      [dimensions.width, dimensions.height],
      shell,
      openDoorSegments,
      backedNorthSegments,
      this.bridge.viewModel.imagingActiveRoomInstanceIds?.includes(room.instanceId) ?? false,
    );
  }

  /**
   * Back-wall furniture in a tinted room is tinted in full: a tinted copy of
   * the part of the sprite above the tinted region (e.g. above a low wall),
   * cropped and stacked just above the original.
   */
  private drawTouchupTintedTop(
    key: string,
    textureKey: string,
    frame: string | undefined,
    left: number,
    top: number,
    width: number,
    height: number,
    cutY: number,
    color: string,
    depth: number,
  ): void {
    if (cutY <= top + .5) return;
    const tintedKey = this.getTouchupTintedTexture(textureKey, frame, color);
    if (!tintedKey) return;
    const source = this.textures.get(tintedKey).getSourceImage() as { width: number; height: number };
    const rows = Math.min(source.height, Math.ceil(((cutY - top) / height) * source.height));
    let image = this.fixtureBitmapImages.get(key);
    if (!image) {
      image = this.add.image(left, top, tintedKey);
      this.fixtureBitmapImages.set(key, image);
    }
    image.setTexture(tintedKey)
      .setOrigin(0, 0)
      .setPosition(Math.round(left), Math.round(top))
      .setDisplaySize(Math.round(width), Math.round(height))
      .setCrop(0, 0, source.width, rows)
      .setDepth(depth + .5)
      .setVisible(true);
    this.activeFixtureBitmapImages.add(key);
  }

  /** A multiplied copy of one frame, alpha-masked to the original silhouette. */
  private getTouchupTintedTexture(textureKey: string, frame: string | undefined, color: string): string | undefined {
    const key = `room-touchup-tint:${textureKey}:${frame ?? "__BASE"}:${color}`;
    if (this.textures.exists(key)) return key;
    if (!this.textures.exists(textureKey)) return undefined;
    const texture = this.textures.get(textureKey);
    const sourceFrame = texture.get(frame);
    const image = texture.getSourceImage() as CanvasImageSource;
    const canvas = this.textures.createCanvas(key, sourceFrame.cutWidth, sourceFrame.cutHeight);
    if (!canvas) return undefined;
    const context = canvas.getContext();
    const draw = () => context.drawImage(image, sourceFrame.cutX, sourceFrame.cutY, sourceFrame.cutWidth, sourceFrame.cutHeight, 0, 0, sourceFrame.cutWidth, sourceFrame.cutHeight);
    draw();
    context.globalCompositeOperation = "multiply";
    context.fillStyle = color;
    context.fillRect(0, 0, sourceFrame.cutWidth, sourceFrame.cutHeight);
    context.globalCompositeOperation = "destination-in";
    draw();
    context.globalCompositeOperation = "source-over";
    canvas.refresh();
    return key;
  }

  /**
   * One touch-up decor image. Floor items stand on `y` and depth-sort with
   * furniture and people; wall items hang from `y` on the wall layer.
   */
  private drawTouchupSprite(
    key: string,
    sprite: TouchupSprite,
    centerX: number,
    y: number,
    widthTiles: number,
    kind: "floor" | "wall",
  ): Readonly<{ textureKey: string; frame: string | undefined; left: number; top: number; width: number; height: number; depth: number }> | undefined {
    let textureKey: string | undefined, frame: string | undefined, sourceWidth: number, sourceHeight: number;
    if (isTouchupFileSprite(sprite)) {
      const asset = ROOM_TOUCHUP_DECOR_ASSETS.find((candidate) => candidate.id === `room-touchup:${sprite.file}`);
      if (!asset) return undefined;
      textureKey = getPhaserTextureKey(asset);
      if (!this.textures.exists(textureKey)) return undefined;
      sourceWidth = sprite.nativeWidth;
      sourceHeight = sprite.nativeHeight;
    } else {
      const record = resolveApprovedRoomDrawRecords(sprite.definitionId, 0).find((candidate) => candidate.id === sprite.recordId);
      const atlas = record ? APPROVED_GS015_ROOM_ATLASES.find((candidate) => candidate.id === record.assetId) : undefined;
      frame = record ? this.registerApprovedRoomFrame(record) : undefined;
      if (!record || !atlas || !frame) return undefined;
      textureKey = getPhaserTextureKey(atlas);
      sourceWidth = record.sourceRect[2];
      sourceHeight = record.sourceRect[3];
    }
    const width = widthTiles * this.layout.tileSize;
    const height = width * sourceHeight / sourceWidth;
    const top = kind === "wall" ? y : y - height;
    let image = this.fixtureBitmapImages.get(key);
    if (!image) {
      image = this.add.image(centerX, top, textureKey, frame);
      this.fixtureBitmapImages.set(key, image);
    }
    const depth = kind === "wall" ? FACILITY_DEPTH_WORLD + 19 : getFacilitySceneDepth(y, "fixture", 40);
    image.setTexture(textureKey, frame)
      .setOrigin(0, 0)
      .setPosition(Math.round(centerX - width / 2), Math.round(top))
      .setDisplaySize(Math.max(1, Math.round(width)), Math.max(1, Math.round(height)))
      .setDepth(depth)
      .setVisible(true)
      .setData("touchup-decor", key);
    this.activeFixtureBitmapImages.add(key);
    return { textureKey, frame, left: centerX - width / 2, top, width, height, depth };
  }

  /**
   * Imaging-room dimming (only while a scan runs) and warm/cool tints.
   * MULTIPLY from the north wall's real height down to the top of the south
   * wall, then SCREEN glows. The layer
   * sits just above this room's south lip, so people in the room are tinted
   * while people and furniture in the room to the south are not.
   */
  private drawTouchupLighting(
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
    shell: ApprovedRoomShellPresentation,
    lighting: TouchupLighting,
  ): void {
    const scale = this.layout.tileSize / TOUCHUP_TILE_PIXELS;
    const southEdge = rectangle.y + rectangle.height + shell.southHeightPixels * this.layout.tileSize / shell.tilePixels;
    const tint = this.getSortableGraphics(this.fixtureGraphics, this.activeFixtureGraphics, `touchup-light:${room.instanceId}`);
    tint.setBlendMode(Phaser.BlendModes.MULTIPLY);
    this.drawTouchupPrimitives(tint, lighting.regions, rectangle.x, rectangle.y, scale);
    tint.setDepth(getFacilitySceneDepth(southEdge, "character", 63));
    const glow = this.getSortableGraphics(this.fixtureGraphics, this.activeFixtureGraphics, `touchup-glow:${room.instanceId}`);
    glow.setBlendMode(Phaser.BlendModes.SCREEN);
    this.drawTouchupPrimitives(glow, lighting.glows, rectangle.x, rectangle.y, scale);
    glow.setDepth(getFacilitySceneDepth(southEdge, "character", 63) + .5);
  }

  /** Corridor touch-ups: stripe and wall shadow on the floor, then decor. */
  private drawTouchupCorridor(
    graphics: Phaser.GameObjects.Graphics,
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
    phase: "floor" | "decor",
  ): void {
    const rooms = this.bridge.viewModel.rooms;
    const isCorridor = (x: number, y: number) => rooms.some((candidate) =>
      (candidate.kind === "hallway" || candidate.definitionId === "room.hallway") &&
      x >= candidate.tileX && x < candidate.tileX + orientedSize(candidate).width &&
      y >= candidate.tileY && y < candidate.tileY + orientedSize(candidate).height);
    const openings = this.getRoomDoorOpenings(room);
    const exposedNorth = this.exposedBoundaryRuns(room, "north").some((run) => run.offset === 0);
    const lowNorth = getOwnedBackedNorthBoundaryRuns(room, rooms, openings).some((run) => run.offset === 0);
    const hasNorthWall = exposedNorth && !lowNorth;
    const tile = { x: room.tileX, y: room.tileY };
    if (phase === "floor") {
      const scale = this.layout.tileSize / TOUCHUP_TILE_PIXELS;
      this.drawTouchupPrimitives(graphics, getTouchupCorridorFloorPrimitives(hasNorthWall), rectangle.x, rectangle.y, scale);
      this.drawTouchupPrimitives(graphics, getTouchupCorridorRunnerPrimitives(tile, isCorridor), rectangle.x, rectangle.y, scale);
      return;
    }
    // Decor also stands against walls shared with rooms (owner, 2026-10-07);
    // only an outdoor-facing tall north wall carries art.
    const items = getTouchupCorridorDecor(
      tile,
      isCorridor,
      {
        north: hasNorthWall ? "tall" : isCorridor(tile.x, tile.y - 1) ? null : "backed",
        west: !isCorridor(tile.x - 1, tile.y),
        east: !isCorridor(tile.x + 1, tile.y),
      },
      {
        north: openings.some((opening) => opening.side === "north"),
        west: openings.some((opening) => opening.side === "west"),
        east: openings.some((opening) => opening.side === "east"),
      },
    );
    items.forEach((item, index) => this.drawTouchupSprite(
      `touchup-corridor:${room.instanceId}:${index}`,
      TOUCHUP_SPRITES[item.sprite],
      rectangle.x + (item.x - room.tileX) * this.layout.tileSize,
      item.kind === "wall" ? rectangle.y + ((item.top ?? 0) - room.tileY) * this.layout.tileSize : rectangle.y + ((item.y ?? 0) - room.tileY) * this.layout.tileSize,
      item.widthTiles,
      item.kind,
    ));
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
    _direction: CharacterDirection,
    _offsetIndex: number,
  ): CharacterPose {
    return moving ? "walk-neutral" : "idle";
  }

  private characterPresentationFrozen(): boolean {
    return this.bridge.viewModel.paused || Boolean(this.bridge.viewModel.buildMode);
  }

  private characterGaitOffset(key: string, initialOffset: number): number {
    const existing = this.characterGaitOffsets.get(key);
    if (existing !== undefined) return existing;
    this.characterGaitOffsets.set(key, initialOffset);
    return initialOffset;
  }

  private characterStepMotion(
    key: string,
    pose: CharacterPose,
    frozen: boolean,
  ): CharacterDrawMotion {
    const previous = this.characterStepBounceStates.get(key);
    if (frozen) return previous ?? RESTING_CHARACTER_MOTION;
    const motion = characterDrawMotion(this.characterHopStates.get(key), pose, {
      seed: characterMotionSeed(`${key}:breath`),
      clockMilliseconds: this.characterRestClockMilliseconds,
    });
    this.characterStepBounceStates.set(key, motion);
    return motion;
  }

  private advanceCharacterHopState(
    key: string,
    moving: boolean,
    travelledTiles: number,
    tilesPerSecond: number,
    sample?: RouteMotionSample,
  ): CharacterHopState | undefined {
    const previous = this.characterHopStates.get(key);
    const travel = sample?.moving
      ? {
          x: sample.direction === "side" ? (sample.rightFacing ? 1 : -1) : 0,
          y: sample.direction === "side" ? 0 : sample.direction === "back" ? -1 : 1,
        }
      : { x: previous?.travelX ?? 0, y: previous?.travelY ?? 0 };
    const next = advanceCharacterHop(previous, {
      moving,
      travelledTiles,
      tilesPerSecond,
      realMilliseconds: this.frameDeltaMilliseconds,
      gameMilliseconds: this.frameDeltaMilliseconds * this.bridge.viewModel.simulationSpeed,
      seed: characterMotionSeed(key),
      travelX: travel.x,
      travelY: travel.y,
    });
    if (next) this.characterHopStates.set(key, next);
    else this.characterHopStates.delete(key);
    return next;
  }

  /** After a stop, the remaining hop offset eases out along the last travel
   * direction, so the character lands exactly where the game placed it. */
  private characterHopSettleLocation(
    location: GridPoint | undefined,
    hop: CharacterHopState | undefined,
  ): GridPoint | undefined {
    const offset = characterHopOffsetTiles(hop);
    if (!location || !hop || hop.moving || offset === 0) return location;
    return {
      x: location.x - hop.travelX * offset,
      y: location.y - hop.travelY * offset,
    };
  }

  private characterStepBounceDisplayLift(key: string): number {
    return (this.characterStepBounceStates.get(key)?.lift ?? 0) * this.cameraView.zoom;
  }

  private drawCharacterPresentation(
    graphics: Phaser.GameObjects.Graphics,
    key: string,
    candidate: CharacterMotionCandidate<PixelAppearanceDescriptor>,
    offsetIndex: number,
  ): number {
    const frozen = this.characterPresentationFrozen()
      ? this.characterMotionSnapshots.get(key)
      : undefined;
    const identityScale = characterStillScaleForAppearance(candidate.appearance);
    const resolved = resolveCharacterMotionPresentation(
      frozen,
      { ...candidate, displayScale: candidate.displayScale * identityScale },
      this.layout,
    );
    const motion = this.characterStepMotion(key, resolved.pose, Boolean(frozen));
    const drawn = this.drawPixelPerson(
      graphics,
      resolved.centerX,
      resolved.baseY,
      offsetIndex,
      resolved.appearance,
      0x555555,
      resolved.direction,
      resolved.pose,
      resolved.rightFacing,
      resolved.displayScale,
      resolved.representation,
      Boolean(frozen),
      resolved.alignSeatContact ?? false,
      { ...motion, lift: motion.lift * this.cameraView.zoom },
    );
    if (!frozen) {
      // Glide onto and off seats and furniture posts instead of snapping.
      // Depth and the returned baseline stay at the destination.
      const target = { x: Math.round(resolved.centerX), y: Math.round(drawn.baseY) };
      const settle = advanceSeatSettle(
        this.characterSeatSettles.get(key),
        target,
        resolved.pose,
        this.frameDeltaMilliseconds,
        this.layout.tileSize,
      );
      this.characterSeatSettles.set(key, settle.state);
      const dx = Math.round(settle.point.x) - target.x;
      const dy = Math.round(settle.point.y) - target.y;
      if (dx !== 0 || dy !== 0) {
        const container = this.characterBitmapContainers.get(key);
        const shown = container?.visible ? container : graphics;
        shown.setPosition(shown.x + dx, shown.y + dy);
      }
      this.characterMotionSnapshots.set(key, captureCharacterMotionPresentation(
        { ...resolved, baseY: drawn.baseY },
        this.layout,
        drawn.representation,
      ));
    }
    return drawn.baseY;
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
    return shouldRenderFounderSeatedAtFrontDesk(
      location,
      moving,
      activityLabel,
      this.bridge.viewModel.rooms,
    )
      ? "seated"
      : "idle";
  }

  /** Keeps the founder's task label attached to the actual rendered sprite. */
  private renderFounderActivityBox(
    founderKey: string,
    label: string | undefined,
    fallbackCenterX: number,
    fallbackBaseY: number,
  ): void {
    const text = this.founderActivityText;
    const box = this.founderActivityBox;
    const inspected = this.inspectTarget?.kind === "character" && this.inspectTarget.key === founderKey;
    if (!text || !box || !label || inspected) {
      text?.setVisible(false);
      box?.setVisible(false);
      return;
    }
    const container = this.characterBitmapContainers.get(founderKey);
    const actor = container?.getByName("actor") as Phaser.GameObjects.Image | null | undefined;
    // Bitmap actors are normally visible. Their own bounds give the label a
    // stable head anchor across support fixtures, camera zoom and frozen poses.
    const bitmapBounds = container?.visible && actor?.visible ? actor.getBounds() : undefined;
    const bounds = bitmapBounds && bitmapBounds.width > 0 && bitmapBounds.height > 0
      ? bitmapBounds
      : undefined;
    // Procedural Graphics has no reliable Phaser bounds contract. Its known
    // presentation metrics below are the safe fallback when a bitmap is
    // loading, absent, or intentionally hidden.
    const centerX = bounds ? bounds.centerX : fallbackCenterX;
    const topY = bounds ? bounds.top : fallbackBaseY - Math.max(22, this.layout.tileSize * 0.88);
    text.setText(label).setPosition(centerX, topY - 4).setVisible(true);
    const textBounds = text.getBounds();
    const insetX = 3;
    const insetY = 2;
    box.clear();
    box.fillStyle(0xf0f0ea, 0.97);
    box.fillRect(textBounds.x - insetX, textBounds.y - insetY, textBounds.width + insetX * 2, textBounds.height + insetY * 2);
    box.lineStyle(1, 0x20282a, 1);
    box.strokeRect(textBounds.x - insetX + 0.5, textBounds.y - insetY + 0.5, textBounds.width + insetX * 2 - 1, textBounds.height + insetY * 2 - 1);
    box.setVisible(true);
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
    return "idle";
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
    // A paused redraw must never sync, hand off, prune, or advance a route.
    // The final visual state is selected by drawCharacterPresentation below.
    if (this.characterPresentationFrozen()) {
      const path = input.path;
      const routeIndex = path?.length
        ? Math.max(0, Math.min(path.length - 1, input.pathIndex ?? 0))
        : 0;
      const routeStart = path?.[routeIndex];
      const routeEnd = path?.[Math.min((path?.length ?? 1) - 1, routeIndex + 1)];
      const initialRouteFacingRight = Boolean(
        routeStart &&
        routeEnd &&
        routeEnd.x !== routeStart.x &&
        routeEnd.x > routeStart.x,
      );
      return {
        location: input.location,
        direction: input.direction ?? "front",
        moving: input.moving ?? false,
        // An actor may first become visible while already paused. Derive its
        // initial horizontal facing without constructing or advancing a track,
        // so the first zero-delta resume does not flip the frozen frame.
        rightFacing: this.characterFacingRight.get(key) ?? initialRouteFacingRight,
      };
    }
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
      const hop = this.advanceCharacterHopState(key, input.moving ?? false, 0, 0);
      return {
        location: this.characterHopSettleLocation(input.location, hop),
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
    // A first-seen stationary actor is parked by syncRouteMotion; keep the
    // facing it was last drawn with.
    if (!previous && !track.routeActive) {
      track = { ...track, rightFacing: this.characterFacingRight.get(key) ?? track.rightFacing };
    }
    // Route distance this frame, measured before advancing because the
    // advance may compact the path and renumber its indices. It includes any
    // catch-up, so hop steps keep pace with the drawn movement.
    const travelledTiles = routeMotionStepTiles(
      track,
      this.frameDeltaMilliseconds,
      tilesPerSecond,
    );
    track = advanceRouteMotion(
      track,
      this.frameDeltaMilliseconds,
      tilesPerSecond,
    );
    const sample = sampleRouteMotion(track);
    this.characterFacingRight.set(key, sample.rightFacing);
    // A finished route stays parked at its last node, so the next route
    // starts from where the character stands instead of popping forward.
    this.routeMotionTracks.set(
      key,
      routeMotionComplete(track) ? parkRouteMotion(track) : track,
    );
    const moving = sample.moving || (input.moving ?? false);
    const hop = this.advanceCharacterHopState(key, moving, travelledTiles, tilesPerSecond, sample);
    // Hop steps: draw the character slightly behind or ahead of its logical
    // route position (zero at every landing), sampled along the real path.
    const shown = hop?.moving
      ? sampleRouteMotion({
          ...track,
          progress: Math.max(0, Math.min(track.targetIndex, track.progress - characterHopOffsetTiles(hop))),
        })
      : sample;
    return {
      location: hop?.moving
        ? shown.location
        : this.characterHopSettleLocation(sample.location, hop),
      direction: sample.moving
        ? shown.direction
        : (input.direction ?? sample.direction),
      moving,
      rightFacing: shown.rightFacing,
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
  ): Readonly<{ centerX: number; baseY: number; depthBaseY: number; scale: number; seatTarget: boolean; supportRole?: FacilityActorSupportRole; supportId?: string; pose?: CharacterPose; direction?: CharacterDirection; rightFacing?: boolean }> | undefined {
    const approvedRoom = this.bridge.viewModel.rooms.find((candidate) => candidate.definitionId === "room.front_desk");
    const approvedBounds = approvedRoom ? orientedSize(approvedRoom) : undefined;
    const insideApprovedRoom = Boolean(location && approvedRoom && approvedBounds && !moving &&
      location.x >= approvedRoom.tileX && location.x < approvedRoom.tileX + approvedBounds.width &&
      location.y >= approvedRoom.tileY && location.y < approvedRoom.tileY + approvedBounds.height);
    if (approvedRoom && insideApprovedRoom && getApprovedRoomPresentation("room.front_desk")) {
      const support = resolveApprovedRoomActorSupports("room.front_desk", 0).find((candidate) =>
        candidate.role === (anchor === "staff" ? "front-desk-staff" : "front-desk-public"),
      );
      if (support && !moving) {
        const bounds = this.toPixels({ tileX: approvedRoom.tileX, tileY: approvedRoom.tileY, ...orientedSize(approvedRoom) });
        const facing = getApprovedSupportFacing(support.facing);
        const painterGround = getApprovedSupportPainterGround(support);
        return {
          centerX: bounds.x + support.seat.x * this.layout.tileSize,
          baseY: bounds.y + support.seat.y * this.layout.tileSize,
          depthBaseY: bounds.y + painterGround.y * this.layout.tileSize,
          scale: 1,
          seatTarget: true,
          supportRole: support.role,
          supportId: support.id,
          pose: support.pose === "standing" ? "idle" : support.pose,
          ...facing,
        };
      }
    }
    const display = getFrontDeskV5StationaryActorDisplay(
      location,
      moving,
      anchor,
      this.bridge.viewModel.rooms,
    );
    if (!this.canRenderFrontDeskV5Architecture()) return undefined;
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
      depthBaseY: projection.floorBounds.y + projection.floorBounds.height * display.y,
      scale: 1,
      seatTarget: false,
    };
  }

  private getApprovedActorSupportDisplayPosition(
    location: GridPoint | undefined,
    moving: boolean,
    supportRole: FacilityActorSupportRole | undefined,
    supportId?: string,
    supportRoomInstanceId?: string,
  ): Readonly<{ centerX: number; baseY: number; depthBaseY: number; scale: number; seatTarget: boolean; supportRole: FacilityActorSupportRole; supportId: string; supportRoomInstanceId: string; pose: CharacterPose; direction: CharacterDirection; rightFacing: boolean }> | undefined {
    if (!location || moving || !supportRole) return undefined;
    const room = this.bridge.viewModel.rooms.find((candidate) => {
      if (!getApprovedRoomPresentation(candidate.definitionId) || candidate.definitionId === "room.front_desk") return false;
      if (supportRoomInstanceId !== undefined) return candidate.instanceId === supportRoomInstanceId;
      const size = orientedSize(candidate);
      return location.x >= candidate.tileX && location.x < candidate.tileX + size.width &&
        location.y >= candidate.tileY && location.y < candidate.tileY + size.height;
    });
    if (!room) return undefined;
    const orientation: RoomOrientation = room.orientation === 270 ? 270 : 0;
    const support = getNearestApprovedActorSupport(
      supportRole === "staff-idle"
        ? resolveStaffIdleSupports(room.definitionId, orientation)
        : resolveApprovedRoomActorSupports(room.definitionId, orientation),
      { x: location.x - room.tileX, y: location.y - room.tileY },
      supportRole,
      supportId,
    );
    if (!support) return undefined;
    const bounds = this.toPixels({ tileX: room.tileX, tileY: room.tileY, ...orientedSize(room) });
    const facing = getApprovedSupportFacing(support.facing);
    const painterGround = getApprovedSupportPainterGround(support);
    return {
      centerX: bounds.x + support.seat.x * this.layout.tileSize,
      baseY: bounds.y + support.seat.y * this.layout.tileSize,
      depthBaseY: bounds.y + painterGround.y * this.layout.tileSize,
      scale: 1,
      seatTarget: support.pose !== "standing",
      supportRole: support.role,
      supportId: support.id,
      supportRoomInstanceId: room.instanceId,
      pose: support.pose === "standing" ? "idle" : support.pose,
      ...facing,
    };
  }

  private setCharacterSupportPresentation(
    key: string,
    graphics: Phaser.GameObjects.Graphics,
    support: Readonly<{ depthBaseY: number; supportRole?: FacilityActorSupportRole; supportId?: string; supportRoomInstanceId?: string }> | undefined,
    order: number,
  ): void {
    const depthY = support?.depthBaseY;
    if (depthY !== undefined) {
      const depth = getFacilitySceneDepth(depthY, "character", order % 64);
      graphics.setDepth(depth);
      this.characterBitmapContainers.get(key)?.setDepth(depth);
    }
    for (const target of [graphics, this.characterBitmapContainers.get(key)]) {
      target?.setData("actor-support-role", support?.supportRole ?? null);
      target?.setData("actor-support-id", support?.supportId ?? null);
      target?.setData("actor-support-room-instance-id", support?.supportRoomInstanceId ?? null);
    }
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
    if (this.characterPresentationFrozen()) {
      // Atlas callbacks may redraw while paused without update() observing the
      // pause. Mark it so the next update also discards a stale resume delta.
      this.characterPresentationWasFrozen = true;
    }
    this.activeCharacterGraphics = new Set<string>();
    this.activeCharacterBitmapContainers = new Set<string>();
    this.locatorGraphics?.clear();
    const representedKeys = new Set<string>();
    const liveAppearance = (
      key: string,
      appearance: PixelAppearanceDescriptor,
      hasLiveInput: boolean,
    ): PixelAppearanceDescriptor[] => {
      const frozen = this.characterPresentationFrozen()
        ? this.characterMotionSnapshots.get(key)?.appearance
        : undefined;
      return hasLiveInput || frozen ? [frozen ?? appearance] : [];
    };
    const founderKey = "character:founder";
    const prefetchAppearances = [
      ...liveAppearance(
        founderKey,
        this.bridge.viewModel.founder.appearance,
        Boolean(this.bridge.viewModel.founder.location || this.bridge.viewModel.founder.path?.length),
      ),
      ...this.bridge.viewModel.staff.flatMap((actor) => liveAppearance(
        `character:staff:${actor.instanceId}`,
        actor.appearance ?? FALLBACK_APPEARANCE,
        Boolean(actor.location || actor.path?.length),
      )),
      ...(this.bridge.viewModel.ambientPedestrians ?? []).flatMap((actor) => liveAppearance(
        `character:ambient:${actor.instanceId}`,
        actor.appearance,
        Boolean(actor.location || actor.path?.length),
      )),
      ...(this.bridge.viewModel.patients ?? []).flatMap((actor) =>
        this.bridge.viewModel.endoscopyOccupancy?.patientInstanceIds.includes(actor.instanceId)
          ? []
          : liveAppearance(
              `character:patient:${actor.instanceId}`,
              actor.appearance,
              Boolean(actor.location || actor.path?.length),
            ),
      ),
      ...(this.bridge.viewModel.serviceVisitors ?? []).flatMap((actor) => liveAppearance(
        `character:service-visitor:${actor.actorId}`,
        actor.appearance ?? FALLBACK_APPEARANCE,
        Boolean(actor.location || actor.path?.length),
      )),
      ...(this.bridge.viewModel.retailExternalActors ?? []).flatMap((actor) => liveAppearance(
        `character:retail-${actor.actorKind}:${actor.instanceId}`,
        actor.appearance,
        Boolean(actor.location || actor.path?.length),
      )),
    ];
    this.ensureCharacterStills(prefetchAppearances.flatMap(characterStandingBitmapDescriptors));
    representedKeys.add(founderKey);
    const founderPresentation = this.getCharacterRoutePresentation(
      founderKey,
      this.bridge.viewModel.founder,
    );
    const frozenFounder = this.characterPresentationFrozen()
      ? this.characterMotionSnapshots.get(founderKey)
      : undefined;
    const founderLocation = founderPresentation.location;
    if (founderLocation || frozenFounder) {
      const candidateFounderLocation = founderLocation ?? { x: 0, y: 0 };
      const graphics = this.getCharacterGraphics(founderKey);
      const founderPose = this.founderPose(
        founderPresentation.moving,
        founderPresentation.direction,
        this.bridge.viewModel.founder.activityLabel,
        candidateFounderLocation,
      );
      let resolvedFounderPose = this.bridge.viewModel.founder.seated && !founderPresentation.moving
        ? "seated"
        : founderPose;
      const founderSupportRole = this.bridge.viewModel.founder.supportRole;
      const founderDisplay = founderSupportRole === "front-desk-staff" || founderSupportRole === "front-desk-public"
        ? this.getFrontDeskV5ActorDisplayPosition(
            candidateFounderLocation,
            founderPresentation.moving,
            founderSupportRole === "front-desk-staff" ? "staff" : "public",
          )
        : this.getApprovedActorSupportDisplayPosition(
            candidateFounderLocation,
            founderPresentation.moving,
            founderSupportRole,
            this.bridge.viewModel.founder.supportId,
            this.bridge.viewModel.founder.supportRoomInstanceId,
          );
      resolvedFounderPose = founderDisplay?.pose ?? resolvedFounderPose;
      const founderAtFrontDesk = founderDisplay?.supportRole === "front-desk-staff";
      const founderCenterX = founderDisplay?.centerX ??
        this.layout.originX + (candidateFounderLocation.x + 0.5) * this.layout.tileSize;
      const founderBaseY = this.drawCharacterPresentation(graphics, founderKey, {
        centerX: founderCenterX,
        baseY: founderDisplay?.baseY ?? this.actorBaseY(
          candidateFounderLocation.y,
          0.72 +
            (founderAtFrontDesk && resolvedFounderPose === "seated"
              ? FRONT_DESK_PRESENTATION.seatedPresentation.towardCounterTiles
              : 0),
        ),
        appearance: this.bridge.viewModel.founder.appearance,
        direction: founderDisplay?.direction ?? stationaryFloorDirection(
          founderPresentation.moving,
          founderPresentation.direction,
          resolvedFounderPose === "seated",
        ),
        pose: resolvedFounderPose,
        rightFacing: founderDisplay?.rightFacing ?? founderPresentation.rightFacing,
        displayScale: founderDisplay?.scale ?? 1,
        alignSeatContact: founderDisplay?.seatTarget ?? false,
      }, this.characterGaitOffset(founderKey, 0));
      graphics.setDepth(
        getFacilitySceneDepth(founderBaseY, "character", 0),
      );
      this.setCharacterSupportPresentation(founderKey, graphics, founderDisplay, 0);
      const activityLabel = this.bridge.viewModel.founder.activityLabel;
      this.renderFounderActivityBox(
        founderKey,
        activityLabel,
        founderCenterX,
        founderBaseY,
      );
    } else {
      // A normal off-site update is a genuine disappearance once any route
      // tail has finished; do not let a later pause resurrect this actor.
      this.characterMotionSnapshots.delete(founderKey);
      this.founderActivityText?.setVisible(false);
      this.founderActivityBox?.setVisible(false);
    }

    this.bridge.viewModel.staff.forEach((employee, index) => {
      const key = `character:staff:${employee.instanceId}`;
      representedKeys.add(key);
      const employeePresentation = this.getCharacterRoutePresentation(
        key,
        employee,
      );
      const frozenEmployee = this.characterPresentationFrozen()
        ? this.characterMotionSnapshots.get(key)
        : undefined;
      if (!employeePresentation.location && !frozenEmployee) {
        // Map actors render only from persisted locations or persisted route
        // samples. Inferring a room-center fallback makes reloads and route
        // transitions look like teleportation.
        this.characterMotionSnapshots.delete(key);
        return;
      }
      const employeeLocation = employeePresentation.location ?? { x: 0, y: 0 };
      const graphics = this.getCharacterGraphics(key);
      let employeePose = this.staffPose(
        employeePresentation.moving,
        employeePresentation.direction,
        this.characterGaitOffset(key, index + 1),
        employee.homeRoomInstanceId,
        employeeLocation,
        employee.staffRoleDefinitionId,
      );
      const employeeDisplay = employee.supportRole === "front-desk-staff"
        ? this.getFrontDeskV5ActorDisplayPosition(
            employeeLocation,
            employeePresentation.moving,
            "staff",
          )
        : this.getApprovedActorSupportDisplayPosition(
            employeeLocation,
            employeePresentation.moving,
            employee.supportRole,
            employee.supportId,
            employee.supportRoomInstanceId,
          );
      employeePose = employeeDisplay?.pose ?? employeePose;
      const founderSeatedAdjacentReceptionist =
        getFrontDeskFounderSeatedAdjacentReceptionistSeparation(
          {
            location: employeeLocation,
            moving: employeePresentation.moving,
            staffRoleDefinitionId: employee.staffRoleDefinitionId,
          },
          this.bridge.viewModel.founder,
          this.bridge.viewModel.rooms,
        );
      const employeeCenterX = employeeDisplay?.centerX ??
        this.layout.originX +
          (employeeLocation.x + 0.5) * this.layout.tileSize +
          (founderSeatedAdjacentReceptionist?.centerOffsetTiles ?? 0) *
            this.layout.tileSize;
      const employeeDisplayBaseY = employeeDisplay?.baseY ?? this.actorBaseY(
        employeeLocation.y,
        0.72 +
          (employeePose === "seated"
            ? FRONT_DESK_PRESENTATION.seatedPresentation.towardCounterTiles
            : 0) +
          (founderSeatedAdjacentReceptionist?.baseOffsetTiles ?? 0),
      );
      const employeeBaseY = this.drawCharacterPresentation(graphics, key, {
        centerX: employeeCenterX,
        baseY: employeeDisplayBaseY,
        appearance: employee.appearance ?? FALLBACK_APPEARANCE,
        direction: employeeDisplay?.direction ?? stationaryFloorDirection(
          employeePresentation.moving,
          employeePresentation.direction,
          employeePose === "seated",
        ),
        pose: employeePose,
        rightFacing: employeeDisplay?.rightFacing ?? employeePresentation.rightFacing,
        displayScale: employeeDisplay?.scale ?? 1,
        alignSeatContact: employeeDisplay?.seatTarget ?? false,
      }, this.characterGaitOffset(key, index + 1));
      graphics.setDepth(
        getFacilitySceneDepth(
          employeeBaseY,
          "character",
          (index + 1) % 64,
        ),
      );
      this.setCharacterSupportPresentation(key, graphics, employeeDisplay, index + 1);
      if (employee.discussionActionRequired) {
        const unit = this.layout.tileSize / 32;
        const markerY = employeeBaseY - 36 * unit;
        graphics.fillStyle(0xf7cf52, 1);
        graphics.fillCircle(employeeCenterX, markerY, 6 * unit);
        graphics.fillStyle(0x352e24, 1);
        graphics.fillRect(employeeCenterX - unit, markerY - 4 * unit, 2 * unit, 5 * unit);
        graphics.fillRect(employeeCenterX - unit, markerY + 2 * unit, 2 * unit, 2 * unit);
      }
    });
    this.bridge.viewModel.ambientPedestrians?.forEach(
      (pedestrian, index) => {
        const key = `character:ambient:${pedestrian.instanceId}`;
        representedKeys.add(key);
        const presentation = this.getCharacterRoutePresentation(
          key,
          pedestrian,
        );
        const frozenPedestrian = this.characterPresentationFrozen()
          ? this.characterMotionSnapshots.get(key)
          : undefined;
        if (!presentation.location && !frozenPedestrian) {
          this.characterMotionSnapshots.delete(key);
          return;
        }
        const pedestrianLocation = presentation.location ?? { x: 0, y: 0 };
        const graphics = this.getCharacterGraphics(key);
        const baseY = this.drawCharacterPresentation(graphics, key, {
          centerX: this.layout.originX +
            (pedestrianLocation.x + 0.5) * this.layout.tileSize,
          baseY: this.actorBaseY(pedestrianLocation.y),
          appearance: pedestrian.appearance,
          direction: stationaryFloorDirection(presentation.moving, presentation.direction, false),
          pose: this.characterPose(
            presentation.moving,
            presentation.direction,
            this.characterGaitOffset(key, 200 + index),
          ),
          rightFacing: presentation.rightFacing,
          displayScale: 1,
        }, this.characterGaitOffset(key, 200 + index));
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
      if (this.bridge.viewModel.endoscopyOccupancy?.patientInstanceIds.includes(patient.instanceId)) return;
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
    this.bridge.viewModel.serviceVisitors?.forEach((visitor, index) => {
      if (this.bridge.viewModel.endoscopyOccupancy?.serviceVisitorInstanceIds.includes(visitor.instanceId)) return;
      const key = `character:service-visitor:${visitor.actorId}`;
      representedKeys.add(key);
      const presentation = this.getCharacterRoutePresentation(key, visitor);
      this.drawServiceVisitor(
        {
          ...visitor,
          ...(presentation.location ? { location: presentation.location } : { location: undefined }),
          direction: presentation.direction,
          moving: presentation.moving,
          rightFacing: presentation.rightFacing,
        },
        index,
      );
    });
    this.bridge.viewModel.retailExternalActors?.forEach((actor, index) => {
      const key = `character:retail-${actor.actorKind}:${actor.instanceId}`;
      representedKeys.add(key);
      const presentation = this.getCharacterRoutePresentation(key, actor);
      this.drawRetailExternalActor({ ...actor, ...(presentation.location ? { location: presentation.location } : { location: undefined }), direction: presentation.direction, moving: presentation.moving, rightFacing: presentation.rightFacing }, index);
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
    for (const key of this.characterMotionSnapshots.keys()) {
      if (!representedKeys.has(key)) {
        this.characterMotionSnapshots.delete(key);
      }
    }
    for (const key of this.characterGaitOffsets.keys()) {
      if (!representedKeys.has(key)) {
        this.characterGaitOffsets.delete(key);
      }
    }
    for (const key of this.characterStepBounceStates.keys()) {
      if (!representedKeys.has(key)) {
        this.characterStepBounceStates.delete(key);
      }
    }
    for (const key of this.characterHopStates.keys()) {
      if (!representedKeys.has(key)) {
        this.characterHopStates.delete(key);
      }
    }
    for (const key of this.characterSeatSettles.keys()) {
      if (!representedKeys.has(key)) {
        this.characterSeatSettles.delete(key);
      }
    }
    this.removeInactiveGraphics(
      this.characterGraphics,
      this.activeCharacterGraphics,
    );
    this.removeInactiveCharacterBitmapContainers();
    this.reconcileApprovedSideChairLayers();
    this.renderInspectBox();
  }

  /** Bitmap actor under the pointer; the front-most (highest depth) wins. */
  private characterAtPointer(pointer: Phaser.Input.Pointer): string | null {
    let best: { key: string; depth: number } | null = null;
    for (const [key, container] of this.characterBitmapContainers) {
      if (!container.visible || !characterRefFromKey(key)) continue;
      const actor = container.getByName("actor") as Phaser.GameObjects.Image | null;
      if (!actor?.visible) continue;
      const bounds = actor.getBounds();
      if (bounds.width <= 0 || bounds.height <= 0) continue;
      // Sprite cells carry side margins; a narrower box avoids picking a neighbour.
      const insetX = bounds.width * 0.2;
      if (pointer.x < bounds.left + insetX || pointer.x > bounds.right - insetX ||
        pointer.y < bounds.top || pointer.y > bounds.bottom) continue;
      if (!best || container.depth > best.depth) best = { key, depth: container.depth };
    }
    return best?.key ?? null;
  }

  private handleCharacterClick(key: string): void {
    const ref = characterRefFromKey(key);
    if (!ref) return;
    const alreadyShown = this.inspectTarget?.kind === "character" && this.inspectTarget.key === key;
    // Owner rule: the first click on an employee shows the box; a second
    // click while it is up opens Praise.
    if (ref.kind === "staff" && alreadyShown && this.bridge.onPraiseEmployee) {
      this.inspectTarget = null;
      this.bridge.onPraiseEmployee(ref.id);
      return;
    }
    this.inspectTarget = { kind: "character", key, ref, shownAt: this.time.now };
    this.inspectLabelCache = null;
  }

  private showSeatBox(seat: FacilityFounderChairView, label: string): void {
    this.inspectTarget = { kind: "seat", seat, label, shownAt: this.time.now };
  }

  private inspectCharacterLabel(key: string, ref: FacilityCharacterRef): string | null {
    const viewModel = this.bridge.viewModel;
    if (this.inspectLabelCache?.key === key && this.inspectLabelCache.viewModel === viewModel) {
      return this.inspectLabelCache.label;
    }
    const description = this.bridge.onDescribeCharacter?.(ref) ?? null;
    const label = description ? `${description.name}\n${description.activity}` : null;
    this.inspectLabelCache = { key, viewModel, label };
    return label;
  }

  /** Seat contact point in canvas pixels, for seat hit tests and the seat box. */
  private founderSeatScreenPoint(seat: FacilityFounderChairView): { x: number; y: number } | null {
    const room = this.bridge.viewModel.rooms.find((candidate) => candidate.instanceId === seat.roomInstanceId);
    if (!room) return null;
    const role: FacilityActorSupportRole = seat.kind === "front_desk_public"
      ? "front-desk-public"
      : seat.kind === "break" ? "staff-break-seat" : "waiting-seat";
    const orientation: RoomOrientation = seat.kind === "front_desk_public" || room.orientation !== 270 ? 0 : 270;
    const support = getNearestApprovedActorSupport(
      resolveApprovedRoomActorSupports(room.definitionId, orientation).filter((candidate) => candidate.role === role),
      { x: seat.location.x - room.tileX, y: seat.location.y - room.tileY },
      role,
      seat.seatId,
    );
    if (!support) {
      return {
        x: this.layout.originX + (seat.location.x + 0.5) * this.layout.tileSize,
        y: this.layout.originY + (seat.location.y + 0.5) * this.layout.tileSize,
      };
    }
    const bounds = this.toPixels({ tileX: room.tileX, tileY: room.tileY, ...orientedSize(room) });
    return {
      x: bounds.x + support.seat.x * this.layout.tileSize,
      y: bounds.y + support.seat.y * this.layout.tileSize,
    };
  }

  /** Light box with a small pointer, matching the founder activity box. */
  private renderInspectBox(): void {
    const text = this.inspectText;
    const box = this.inspectBox;
    if (!text || !box) return;
    const target = this.inspectTarget;
    const age = target ? this.time.now - target.shownAt : 0;
    const hide = () => {
      text.setVisible(false);
      box.setVisible(false);
    };
    if (!target || age > INSPECT_BOX_VISIBLE_MS || this.bridge.viewModel.buildMode) {
      this.inspectTarget = null;
      hide();
      return;
    }
    let anchorX: number;
    let anchorY: number;
    let label: string | null;
    if (target.kind === "character") {
      const container = this.characterBitmapContainers.get(target.key);
      const actor = container?.getByName("actor") as Phaser.GameObjects.Image | null | undefined;
      const bounds = container?.visible && actor?.visible ? actor.getBounds() : undefined;
      label = bounds && bounds.height > 0 ? this.inspectCharacterLabel(target.key, target.ref) : null;
      if (!bounds || !label) {
        // The character left the map (went home, off-site) — close the box.
        this.inspectTarget = null;
        hide();
        return;
      }
      anchorX = bounds.centerX;
      anchorY = bounds.top;
    } else {
      const point = this.founderSeatScreenPoint(target.seat);
      if (!point) {
        this.inspectTarget = null;
        hide();
        return;
      }
      anchorX = point.x;
      anchorY = point.y - this.layout.tileSize * 0.55;
      label = target.label;
    }
    const pointerSize = 3;
    const fade = Math.min(1, Math.max(0, (INSPECT_BOX_VISIBLE_MS - age) / INSPECT_BOX_FADE_MS));
    text.setText(label)
      .setPosition(anchorX, anchorY - pointerSize - 4)
      .setAlpha(fade)
      .setVisible(true);
    const textBounds = text.getBounds();
    const insetX = 3;
    const insetY = 2;
    const left = textBounds.x - insetX;
    const top = textBounds.y - insetY;
    const width = textBounds.width + insetX * 2;
    const height = textBounds.height + insetY * 2;
    box.clear();
    box.setAlpha(fade);
    box.fillStyle(0xf0f0ea, 0.97);
    box.fillRect(left, top, width, height);
    box.fillTriangle(anchorX - pointerSize, top + height, anchorX + pointerSize, top + height, anchorX, top + height + pointerSize);
    box.lineStyle(1, 0x20282a, 1);
    box.strokeRect(left + 0.5, top + 0.5, width - 1, height - 1);
    box.lineBetween(anchorX - pointerSize, top + height, anchorX, top + height + pointerSize);
    box.lineBetween(anchorX + pointerSize, top + height, anchorX, top + height + pointerSize);
    box.setVisible(true);
  }

  /**
   * Receipts arrive from the domain only after it has credited cash. This
   * layer turns newly observed receipts into short-lived world labels and
   * deliberately never dispatches a command or changes the view model.
   */
  private drawEarningsPopups(nowMilliseconds: number): void {
    const model = this.bridge.viewModel;
    // Collected lazily: only a new per-tick receipt list needs actor anchors.
    const actorAnchors = () => ({
      patient: Object.fromEntries(
        (model.patients ?? [])
          .filter((patient) => this.getEarningsPopupPosition("patient", patient.instanceId))
          .map((patient) => [patient.instanceId, true] as const),
      ),
      employee: Object.fromEntries(
        model.staff
          .filter((employee) => this.getEarningsPopupPosition("employee", employee.instanceId))
          .map((employee) => [employee.instanceId, true] as const),
      ),
      founder: this.getEarningsPopupPosition("founder", "founder")
        ? { founder: true }
        : undefined,
      remote: Object.fromEntries(
        (model.earningsReceipts ?? [])
          .filter((receipt) => receipt.actorKind === "remote" && this.getEarningsPopupPosition("remote", receipt.actorId))
          .map((receipt) => [receipt.actorId, true] as const),
      ),
      visitor: Object.fromEntries(
        (model.serviceVisitors ?? [])
          .filter((visitor) => this.getEarningsPopupPosition("visitor", visitor.actorId))
          .map((visitor) => [visitor.actorId, true] as const),
      ),
      retail_visitor: Object.fromEntries((model.retailExternalActors ?? []).filter((actor) => actor.actorKind === "retail_visitor" && this.getEarningsPopupPosition("retail_visitor", actor.instanceId)).map((actor) => [actor.instanceId, true] as const)),
      companion: Object.fromEntries((model.retailExternalActors ?? []).filter((actor) => actor.actorKind === "companion" && this.getEarningsPopupPosition("companion", actor.instanceId)).map((actor) => [actor.instanceId, true] as const)),
    });
    this.earningsPopupState = reconcileEarningsPopups(
      this.earningsPopupState,
      {
        campaignId: model.campaignId ?? "campaign.legacy.local",
        receipts: model.earningsReceipts ?? [],
        actorAnchors,
        nowMilliseconds,
      },
    );

    const activeKeys = new Set<string>();
    for (const [popupIndex, popup] of this.earningsPopupState.activePopups.entries()) {
      activeKeys.add(popup.transactionKey);
      const position = this.getEarningsPopupPosition(
        popup.actorKind,
        popup.actorId,
      );
      let text = this.earningsPopupTexts.get(popup.transactionKey);
      if (!position) {
        text?.setVisible(false);
        continue;
      }
      if (!text) {
        text = this.add
          .text(0, 0, "", {
            color: "#2a9d4b",
            fontFamily: '"Courier New", "Lucida Console", Monaco, ui-monospace, monospace',
            fontSize: "14px",
            fontStyle: "bold",
            stroke: "#f7f3df",
            strokeThickness: 2,
            resolution: 2,
          })
          .setOrigin(0.5, 1);
        this.earningsPopupTexts.set(popup.transactionKey, text);
      }
      text
        .setText(formatEarningsPopupAmount(popup.grossAmount))
        .setPosition(
          position.x,
          getEarningsPopupLabelY(
            position.y,
            this.layout.tileSize,
            this.earningsPopupState.activePopups
              .slice(0, popupIndex)
              .filter(
                (candidate) =>
                  candidate.actorKind === popup.actorKind &&
                  candidate.actorId === popup.actorId,
              ).length,
          ),
        )
        .setDepth(FACILITY_DEPTH_LOCATOR + 1)
        .setVisible(true);
    }
    for (const [transactionKey, text] of this.earningsPopupTexts) {
      if (!activeKeys.has(transactionKey)) {
        text.destroy();
        this.earningsPopupTexts.delete(transactionKey);
      }
    }
  }

  /** Resolves to the same interpolated world position currently used by the sprite. */
  private getEarningsPopupPosition(
    actorKind: "patient" | "employee" | "founder" | "remote" | "visitor" | "retail_visitor" | "companion",
    actorId: string,
  ): Readonly<{ x: number; y: number }> | undefined {
    if (actorKind === "remote") {
      // Visitors deliberately need their own projected anchor. They are not
      // educational encounters and must never borrow a patient sprite.
      const receipt = this.bridge.viewModel.earningsReceipts?.find(
        (candidate) => candidate.actorKind === "remote" && candidate.actorId === actorId,
      );
      if (receipt?.displayAnchor) {
        return this.getEarningsPopupPosition(
          receipt.displayAnchor.actorKind,
          receipt.displayAnchor.actorId,
        );
      }
      const location = this.bridge.viewModel.remoteReceiptAnchors?.[actorId];
      return location
        ? {
            x: this.layout.originX + (location.x + 0.5) * this.layout.tileSize,
            y: this.actorBaseY(location.y) - Math.max(18, this.layout.tileSize * 0.8),
          }
        : undefined;
    }
    const key = actorKind === "founder"
      ? "character:founder"
      : actorKind === "visitor"
        ? `character:service-visitor:${actorId}`
        : actorKind === "retail_visitor" || actorKind === "companion"
          ? `character:retail-${actorKind}:${actorId}`
        : `character:${actorKind === "employee" ? "staff" : "patient"}:${actorId}`;
    const snapshot = this.characterMotionSnapshots.get(key);
    if (!snapshot) return undefined;
    const position = replayCharacterMotionPresentation(snapshot, this.layout);
    return {
      x: position.centerX,
      y: this.getEarningsPopupHeadY(snapshot, position.baseY, key),
    };
  }

  /** Matches the rendered bitmap/procedural actor's top edge, not its feet. */
  private getEarningsPopupHeadY(
    snapshot: CharacterMotionPresentation<PixelAppearanceDescriptor>,
    baseY: number,
    key: string,
  ): number {
    const layers = characterBitmapLayers(
      snapshot.appearance,
      snapshot.direction,
      snapshot.pose,
      snapshot.rightFacing,
    );
    if (layers) {
      const registration = characterBitmapRegistration(layers);
      const metrics = getCharacterStillPresentationMetrics(this.layout.tileSize, snapshot.displayScale);
      const pixelScale = metrics.height / registration.cell.height;
      return baseY - this.characterStepBounceDisplayLift(key) -
        (registration.floorY - registration.visibleBounds.y) * pixelScale;
    }
    return baseY - this.characterStepBounceDisplayLift(key) -
      getCharacterStillPresentationMetrics(this.layout.tileSize, snapshot.displayScale).height * 0.72;
  }

  private getCharacterBitmapContainer(
    key: string,
  ): Phaser.GameObjects.Container {
    let container = this.characterBitmapContainers.get(key);
    if (!container) {
      container = this.add.container(0, 0);
      container.setData("character-key", key);
      const shadow = this.add.image(0, 1, this.ensureCharacterContactShadowTexture());
      shadow.setName("shadow");
      const actor = this.add.image(0, 0, "__DEFAULT");
      actor.setName("actor");
      container.add([shadow, actor]);
      this.characterBitmapContainers.set(key, container);
    }
    container.setVisible(true);
    this.activeCharacterBitmapContainers.add(key);
    return container;
  }

  /** One soft oval shared by every character's contact shadow. */
  private ensureCharacterContactShadowTexture(): string {
    const key = "character-contact-shadow";
    if (this.textures.exists(key)) return key;
    const size = 64;
    const texture = this.textures.createCanvas(key, size, size);
    const context = texture?.getContext();
    if (texture && context) {
      const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      gradient.addColorStop(0, "rgba(28, 44, 38, 1)");
      gradient.addColorStop(0.65, "rgba(28, 44, 38, 0.75)");
      gradient.addColorStop(1, "rgba(28, 44, 38, 0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, size, size);
      texture.refresh();
    }
    return key;
  }

  /** The shadow stays on the floor; only the actor image lifts. */
  private updateCharacterContactShadow(
    container: Phaser.GameObjects.Container,
    stillWidth: number,
    motion: CharacterDrawMotion,
  ): void {
    const shadow = container.getByName("shadow") as Phaser.GameObjects.Image | null;
    if (!shadow) return;
    const width = Math.max(1, stillWidth * CHARACTER_HOP.shadowWidthRatio * motion.shadowScale);
    shadow.setPosition(0, 1)
      .setDisplaySize(width, Math.max(1, width * CHARACTER_HOP.shadowHeightRatio))
      .setAlpha(motion.shadowAlpha)
      .setVisible(motion.shadowAlpha > 0);
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
    const key = `character:patient:${patient.instanceId}`;
    const frozenPatient = this.characterPresentationFrozen()
      ? this.characterMotionSnapshots.get(key)
      : undefined;
    if (!patient.location && !frozenPatient) {
      // Off-site or otherwise absent patients stay absent until the domain
      // supplies their persisted return route/location.
      this.characterMotionSnapshots.delete(key);
      return;
    }
    const location = patient.location ?? { x: 0, y: 0 };
    const graphics = this.getCharacterGraphics(key);
    const finishCharacter = (baseY: number, centerX: number, renderedPose: CharacterPose, renderedDirection: CharacterDirection, renderedRightFacing: boolean, supportDisplay?: Readonly<{ depthBaseY: number; supportRole?: FacilityActorSupportRole; supportId?: string }>) => {
      graphics.setDepth(
        getFacilitySceneDepth(
          baseY,
          "character",
          (index + 16) % 64,
        ),
      );
      this.setCharacterSupportPresentation(key, graphics, supportDisplay, index + 16);
      const renderedScale = this.characterMotionSnapshots.get(key)?.displayScale ??
        characterStillScaleForAppearance(patient.appearance);
      this.drawPatientLocator(centerX, baseY, patient, renderedPose, renderedDirection, renderedRightFacing, renderedScale);
    };
    const moving = Boolean(patient.moving);
    const direction = patient.direction ?? "front";
    // Semantic arrival can commit before the retained render tail reaches its
    // destination. Furniture poses begin only after both have arrived.
    const destinationPose = !moving
      ? patient.pose ?? (patient.seated ? "seated" : undefined)
      : undefined;
    let pose = destinationPose ?? this.characterPose(
      moving,
      direction,
      this.characterGaitOffset(`character:patient:${patient.instanceId}`, 100 + index),
    );

    const frontDeskDisplay = patient.supportRole === "front-desk-public"
      ? this.getFrontDeskV5ActorDisplayPosition(location, Boolean(patient.moving), "public")
      : undefined;
    const approvedSupportDisplay = frontDeskDisplay ??
      this.getApprovedActorSupportDisplayPosition(location, moving, patient.supportRole, patient.supportId);
    pose = approvedSupportDisplay?.pose ?? pose;
    const renderedDirection = approvedSupportDisplay?.direction ??
      stationaryFloorDirection(moving, direction, destinationPose !== undefined);
    const renderedRightFacing = approvedSupportDisplay?.rightFacing ?? patient.rightFacing ?? false;
    const centerX = approvedSupportDisplay?.centerX ??
      this.layout.originX + (location.x + 0.5) * this.layout.tileSize;
    const baseY = this.drawCharacterPresentation(
      graphics,
      `character:patient:${patient.instanceId}`,
      {
        centerX,
        baseY: approvedSupportDisplay?.baseY ?? this.actorBaseY(location.y),
        appearance: patient.appearance,
        direction: renderedDirection,
        pose,
        rightFacing: renderedRightFacing,
        displayScale: approvedSupportDisplay?.scale ?? 1,
        alignSeatContact: approvedSupportDisplay?.seatTarget ?? false,
      },
      this.characterGaitOffset(`character:patient:${patient.instanceId}`, 100 + index),
    );
    finishCharacter(
      baseY,
      frozenPatient
        ? replayCharacterMotionPresentation(frozenPatient, this.layout).centerX
        : centerX,
      pose,
      renderedDirection,
      renderedRightFacing,
      approvedSupportDisplay,
    );
  }

  /** Visitors are service actors only: separate render identity and no chart locator. */
  private drawServiceVisitor(
    visitor: FacilityServiceVisitorView,
    index: number,
  ): void {
    const key = `character:service-visitor:${visitor.actorId}`;
    const frozenVisitor = this.characterPresentationFrozen()
      ? this.characterMotionSnapshots.get(key)
      : undefined;
    if (!visitor.location && !frozenVisitor) {
      this.characterMotionSnapshots.delete(key);
      return;
    }
    const location = visitor.location ?? { x: 0, y: 0 };
    const graphics = this.getCharacterGraphics(key);
    const moving = Boolean(visitor.moving);
    const direction = visitor.direction ?? "front";
    const supportDisplay = this.getApprovedActorSupportDisplayPosition(location, moving, visitor.supportRole, visitor.supportId);
    const centerX = supportDisplay?.centerX ?? this.layout.originX + (location.x + 0.5) * this.layout.tileSize;
    const pose = supportDisplay?.pose ?? this.characterPose(moving, direction, this.characterGaitOffset(key, 300 + index));
    const renderedDirection = supportDisplay?.direction ?? stationaryFloorDirection(moving, direction, false);
    const baseY = this.drawCharacterPresentation(graphics, key, {
      centerX,
      baseY: supportDisplay?.baseY ?? this.actorBaseY(location.y),
      appearance: visitor.appearance ?? FALLBACK_APPEARANCE,
      direction: renderedDirection,
      pose,
      rightFacing: supportDisplay?.rightFacing ?? visitor.rightFacing ?? false,
      displayScale: supportDisplay?.scale ?? 1,
      alignSeatContact: supportDisplay?.seatTarget ?? false,
    }, this.characterGaitOffset(key, 300 + index));
    graphics.setDepth(getFacilitySceneDepth(baseY, "character", (index + 32) % 64));
    this.setCharacterSupportPresentation(key, graphics, supportDisplay, index + 32);
  }

  private drawRetailExternalActor(actor: FacilityRetailExternalActorView, index: number): void {
    const key = `character:retail-${actor.actorKind}:${actor.instanceId}`;
    const frozen = this.characterPresentationFrozen() ? this.characterMotionSnapshots.get(key) : undefined;
    if (!actor.location && !frozen) { this.characterMotionSnapshots.delete(key); return; }
    const location = actor.location ?? { x: 0, y: 0 };
    const moving = Boolean(actor.moving);
    const direction = actor.direction ?? "front";
    const graphics = this.getCharacterGraphics(key);
    const baseY = this.drawCharacterPresentation(graphics, key, {
      centerX: this.layout.originX + (location.x + 0.5) * this.layout.tileSize,
      baseY: this.actorBaseY(location.y), appearance: actor.appearance,
      direction: stationaryFloorDirection(moving, direction, false),
      pose: this.characterPose(moving, direction, this.characterGaitOffset(key, 400 + index)),
      rightFacing: actor.rightFacing ?? false, displayScale: 1,
    }, this.characterGaitOffset(key, 400 + index));
    graphics.setDepth(getFacilitySceneDepth(baseY, "character", (index + 40) % 64));
  }

  private drawPatientLocator(
    centerX: number,
    baseY: number,
    patient: FacilityPatientView,
    pose: CharacterPose,
    direction: CharacterDirection,
    rightFacing: boolean,
    displayScale: number,
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
    const layers = characterBitmapLayers(
      patient.appearance,
      direction,
      pose,
      rightFacing,
    );
    const registration = characterBitmapRegistration(layers);
    const metrics = getCharacterStillPresentationMetrics(this.layout.tileSize, displayScale);
    const visualLift = this.characterStepBounceDisplayLift(
      `character:patient:${patient.instanceId}`,
    );
    const visibleTop = layers
      ? baseY - visualLift - (registration.floorY - registration.visibleBounds.y) * (metrics.height / registration.cell.height)
      : baseY - visualLift - metrics.height * 0.72;
    const arrowY = visibleTop - pixel * 4 - pulse;
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
    _frozenRepresentation?: CharacterRenderRepresentation,
    baseIsAdjusted = false,
    alignSeatContact = false,
    /** Hop, squash, breathing and shadow; `lift` is in display pixels. */
    motion: CharacterDrawMotion = RESTING_CHARACTER_MOTION,
  ): Readonly<{ baseY: number; representation: CharacterRenderRepresentation }> {
    const visualLift = motion.lift;
    const resolvedAppearance = appearance ?? FALLBACK_APPEARANCE;
    const key = graphics.getData("character-key") as string | undefined;
    const authoredLayers = characterBitmapLayers(
      resolvedAppearance,
      direction,
      pose,
      movingRight,
    );
    const registration = characterBitmapRegistration(authoredLayers);
    const metrics = getCharacterStillPresentationMetrics(this.layout.tileSize, displayScale);
    const adjustedBaseY = authoredLayers && alignSeatContact && !baseIsAdjusted && registration.seatContactY !== undefined
      ? alignCharacterStillSeatToWorld(baseY, registration.floorY, registration.seatContactY, metrics.height, registration.cell.height)
      : baseY;
    if (key && authoredLayers) {
      const textureKey = getPhaserTextureKey(authoredLayers.actor.atlas);
      const textureReady = this.textures.exists(textureKey) || this.ensureCharacterStill(authoredLayers.actor.atlas);
      if (!textureReady) {
        const existing = this.characterBitmapContainers.get(key);
        const actor = existing?.getByName("actor") as Phaser.GameObjects.Image | null;
        const retainsSameIdentity =
          actor?.getData("gait-still-id") === authoredLayers.actor.stillId;
        if (existing && actor && retainsSameIdentity) {
          this.activeCharacterBitmapContainers.add(key);
          existing.setVisible(true)
            .setPosition(Math.round(centerX), Math.round(adjustedBaseY))
            .setDepth(getFacilitySceneDepth(adjustedBaseY, "character", offsetIndex % 64));
          actor.setDisplaySize(metrics.width * motion.scaleX, metrics.height * motion.scaleY);
          actor.y = -visualLift;
          this.updateCharacterContactShadow(existing, metrics.width, motion);
          graphics.clear();
          graphics.setVisible(false);
          return { baseY: adjustedBaseY, representation: "bitmap" };
        }
        existing?.setVisible(false);
      } else {
        const container = this.getCharacterBitmapContainer(key);
        const actor = container.getByName("actor") as Phaser.GameObjects.Image;
        // Origin at the feet, so squash, stretch and breathing keep them planted.
        actor.setTexture(textureKey)
          .setDisplaySize(metrics.width * motion.scaleX, metrics.height * motion.scaleY)
          .setPosition(0, -visualLift)
          .setOrigin(0.5, registration.floorAnchorY)
          .setFlipX(false);
        this.updateCharacterContactShadow(container, metrics.width, motion);
        actor.setData({
          "gait-atlas-id": authoredLayers.actor.atlas.id,
          "gait-frame": characterAtlasFrameKey(authoredLayers.actor),
          "gait-flip-x": false,
          "gait-direction": direction,
          "gait-pose": pose,
          "gait-still-id": authoredLayers.actor.stillId,
        });
        container.setPosition(Math.round(centerX), Math.round(adjustedBaseY))
          .setDepth(getFacilitySceneDepth(adjustedBaseY, "character", offsetIndex % 64));
        graphics.clear();
        graphics.setVisible(false);
        return { baseY: adjustedBaseY, representation: "bitmap" };
      }
    }
    this.characterBitmapContainers.get(key ?? "")?.setVisible(false);
    graphics.clear();
    const width = metrics.width * motion.scaleX;
    const height = metrics.height * motion.scaleY;
    graphics.fillStyle(0x8b9088, 0.9);
    graphics.fillCircle(0, -height * 0.64, Math.max(2, width * 0.16));
    graphics.fillRoundedRect(-width * 0.18, -height * 0.48, width * 0.36, height * 0.42, Math.max(2, width * 0.08));
    graphics.setPosition(Math.round(centerX), Math.round(adjustedBaseY - visualLift));
    graphics.setVisible(true);
    return { baseY: adjustedBaseY, representation: "neutral" };
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

  /** Draws filled/empty stars (and the affordable up arrow) under a room label. */
  private drawBuildLabelStars(
    graphics: Phaser.GameObjects.Graphics,
    centerX: number,
    top: number,
    level: number,
    maxLevel: number,
    upgradeAffordable: boolean,
    pixel: number,
  ): number {
    const starSize = BUILD_LABEL_STAR_ROWS.length * pixel;
    const gap = pixel;
    const padding = pixel + 1;
    const readyWidth =
      upgradeAffordable && level < maxLevel ? gap * 2 + starSize : 0;
    const stripWidth =
      maxLevel * starSize + (maxLevel - 1) * gap + readyWidth;
    const plateWidth = stripWidth + padding * 2;
    const plateHeight = starSize + padding * 2;
    const left = Math.round(centerX - plateWidth / 2);
    const plateTop = Math.round(top);
    graphics.fillStyle(PIXEL_PALETTE_NUMBER.paper, 1);
    graphics.fillRect(left, plateTop, plateWidth, plateHeight);
    for (let index = 0; index < maxLevel; index += 1) {
      const starLeft = left + padding + index * (starSize + gap);
      graphics.fillStyle(
        index < level
          ? PIXEL_PALETTE_NUMBER.ink
          : BUILD_LABEL_STAR_EMPTY_COLOR,
        1,
      );
      BUILD_LABEL_STAR_ROWS.forEach((row, rowIndex) => {
        for (let column = 0; column < row.length; column += 1) {
          if (row[column] === "#") {
            graphics.fillRect(
              starLeft + column * pixel,
              plateTop + padding + rowIndex * pixel,
              pixel,
              pixel,
            );
          }
        }
      });
    }
    if (readyWidth > 0) {
      const chipLeft = left + padding + maxLevel * (starSize + gap) + gap;
      const chipTop = plateTop + padding;
      graphics.fillStyle(BUILD_LABEL_UPGRADE_READY_COLOR, 1);
      graphics.fillRect(chipLeft, chipTop, starSize, starSize);
      // Up arrow: an upgrade the clinic can pay for right now.
      graphics.fillStyle(PIXEL_PALETTE_NUMBER.paper, 1);
      for (let row = 1; row <= 4; row += 1) {
        const half = row - 1;
        graphics.fillRect(
          chipLeft + (3 - half) * pixel,
          chipTop + row * pixel,
          (half * 2 + 1) * pixel,
          pixel,
        );
      }
    }
    return plateTop + plateHeight;
  }

  /** Keeps the React room menu attached to the selected room while the camera moves. */
  private reportSelectedRoomRect(): void {
    const model = this.bridge.viewModel;
    const room =
      model.buildMode && model.selectedRoomInstanceId && this.layout
        ? model.rooms.find(
            (candidate) =>
              candidate.instanceId === model.selectedRoomInstanceId,
          )
        : undefined;
    const rect = room
      ? this.toPixels({
          tileX: room.tileX,
          tileY: room.tileY,
          ...orientedSize(room),
        })
      : null;
    const key = rect
      ? `${Math.round(rect.x)},${Math.round(rect.y)},${Math.round(rect.width)},${Math.round(rect.height)},${this.scale.width},${this.scale.height}`
      : "";
    if (key === this.lastReportedSelectedRoomRect) {
      return;
    }
    this.lastReportedSelectedRoomRect = key;
    this.bridge.onSelectedRoomRectChange?.(
      rect
        ? {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          }
        : null,
    );
  }

  private positionText(): void {
    const { originX, originY, width, tileSize } = this.layout;
    const model = this.bridge.viewModel;
    const compact = this.scale.width < 520;

    this.roomTexts.forEach((text) => text.destroy());
    this.roomTexts = [];
    this.roomStarGraphics ??= this.add
      .graphics()
      .setDepth(FACILITY_DEPTH_UI);
    const starGraphics = this.roomStarGraphics;
    starGraphics.clear();
    starGraphics.setVisible(Boolean(model.buildMode));
    const fontSize = Math.max(8, Math.min(12, Math.floor(tileSize * 0.26)));
    // Stars grow with zoom in whole pixels so they stay crisp.
    const starPixel = Math.max(1, Math.min(3, Math.round(tileSize / 26)));
    model.rooms
      .filter(
        (room) =>
          room.kind !== "hallway" && room.definitionId !== "room.hallway",
      )
      .forEach((room) => {
        const pixels = this.toPixels({
          tileX: room.tileX,
          tileY: room.tileY,
          ...orientedSize(room),
        });
        const label = this.add
          .text(
            pixels.x + pixels.width / 2,
            pixels.y + Math.max(5, Math.floor(tileSize * 0.16)),
            room.buildLabel ?? room.displayName,
            {
              color: "#232720",
              backgroundColor: "#e0ded0",
              fontFamily: '"Atkinson Hyperlegible", "Segoe UI", system-ui, -apple-system, sans-serif',
              fontSize: `${fontSize}px`,
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
        this.roomTexts.push(label);

        let nextTop = label.y + label.displayHeight;
        const maxLevel = room.upgradeMaxLevel ?? 1;
        if (model.buildMode && maxLevel > 1) {
          nextTop = this.drawBuildLabelStars(
            starGraphics,
            label.x,
            nextTop,
            Math.max(1, Math.min(maxLevel, room.upgradeLevel ?? 1)),
            maxLevel,
            Boolean(room.upgradeAffordable),
            starPixel,
          );
        }
        if (room.accessProblem) {
          const problem = this.add
            .text(label.x, nextTop + 2, "! NO ACCESS", {
              color: "#f0eddd",
              backgroundColor: "#9b3b25",
              fontFamily: '"Courier New", "Lucida Console", Monaco, ui-monospace, monospace',
              fontSize: `${Math.max(8, fontSize - 1)}px`,
              fontStyle: "bold",
              resolution: 2,
              padding: { x: 3, y: 1 },
            })
            .setOrigin(0.5, 0)
            .setDepth(FACILITY_DEPTH_UI)
            .setVisible(Boolean(model.buildMode));
          this.roomTexts.push(problem);
        }
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
      } else if (
        !activeDoorTool &&
        !this.bridge.viewModel.placement &&
        this.roomAtPointer(pointer)
      ) {
        // Rooms open the Build Mode room menu (upgrade, move, doors, sell).
        this.setInteractionHint("MANAGE ROOM", pointer);
      } else {
        this.setInteractionHint(null);
        if (activeDoorTool && this.game?.canvas) {
          this.game.canvas.style.cursor = "crosshair";
        }
      }
      return;
    }
    const characterKey = this.characterAtPointer(pointer);
    if (characterKey) {
      const ref = characterRefFromKey(characterKey);
      const shown = this.inspectTarget?.kind === "character" && this.inspectTarget.key === characterKey;
      const employee = ref?.kind === "staff"
        ? this.bridge.viewModel.staff.find((candidate) => candidate.instanceId === ref.id)
        : undefined;
      this.setInteractionHint(
        shown && employee
          ? `CLICK TO PRAISE ${employee.displayName.toUpperCase()}`
          : "CLICK TO SEE ACTIVITY",
        pointer,
      );
      return;
    }
    const point = this.gridPointAtPointer(pointer);
    if (point) {
      const interaction = getEnvironmentalInteraction(
        this.bridge.viewModel,
        point,
      );
      // Employees are clicked by their sprite above (box first, then praise).
      if (interaction && interaction.kind !== "employee") {
        this.setInteractionHint(interaction.label, pointer);
        return;
      }
    }
    if (
      this.frontDeskSeatInteractionAtPointer(pointer) &&
      !this.bridge.viewModel.staff.some(
        (member) => member.staffRoleDefinitionId === "staff.receptionist",
      )
    ) {
      this.setInteractionHint("Sit here to check in patients", pointer);
      return;
    }
    const hoveredChair = this.ordinaryChairAtPointer(pointer);
    if (hoveredChair) {
      this.setInteractionHint(hoveredChair.occupied ? "SEAT OCCUPIED" : "SIT HERE", pointer);
      return;
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
    const characterKey = this.pointerDownCharacterKey;
    this.pointerDownCharacterKey = null;
    if (characterKey) {
      this.handleCharacterClick(characterKey);
      // The box replaces the hover hint until the pointer moves again.
      this.setInteractionHint(null);
      return;
    }
    // Clicking anywhere else closes an open info box.
    this.inspectTarget = null;
    const chair = this.ordinaryChairAtPointer(pointer);
    if (chair && this.bridge.onSeatFounderInChair) {
      if (chair.occupied) {
        this.showSeatBox(chair, "Seat occupied");
        return;
      }
      const accepted = chair.seatId
        ? this.bridge.onSeatFounderInChair(chair.roomInstanceId, chair.location, chair.seatId)
        : this.bridge.onSeatFounderInChair(chair.roomInstanceId, chair.location);
      if (!accepted) this.showSeatBox(chair, "Seat unavailable");
      this.setInteractionHint(
        accepted ? "FOUNDER WALKING TO CHAIR" : "CHAIR UNAVAILABLE",
        pointer,
      );
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

    this.pointerDownCharacterKey = null;
    const characterKey = this.bridge.viewModel.buildMode ? null : this.characterAtPointer(pointer);
    if (characterKey) {
      // Resolved on pointer-up so a drag that starts on a person still pans.
      this.pointerDownCharacterKey = characterKey;
    } else if (!this.bridge.viewModel.buildMode) {
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
      }
      // The patient-side Front Desk chair sits beside the counter; let the
      // pointer-up seat flow own it instead of the desk.
      if (
        this.ordinaryChairAtPointer(pointer)?.kind !== "front_desk_public" &&
        this.frontDeskSeatInteractionAtPointer(pointer) &&
        this.bridge.onSeatFounderAtFrontDesk
      ) {
        const accepted = this.bridge.onSeatFounderAtFrontDesk();
        this.setInteractionHint(
          accepted
            ? "FOUNDER RETURNING TO FRONT DESK"
            : "FRONT DESK UNAVAILABLE",
          pointer,
        );
        return;
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

  /** Uses the displayed fixture envelopes rather than their blocked grid tiles. */
  private frontDeskSeatInteractionAtPointer(
    pointer: Phaser.Input.Pointer,
  ): boolean {
    const room = this.bridge.viewModel.rooms.find(
      (candidate) => candidate.definitionId === "room.front_desk",
    );
    if (!room) return false;
    if (this.canRenderFrontDeskV5Architecture()) {
      const renderedTargets = [...this.fixtureBitmapImages.entries()]
        .filter(([key, image]) => {
          if (!key.startsWith(`approved:${room.instanceId}:`) || !image.visible) return false;
          const drawId = image.getData("approved-draw-id") as string | undefined;
          return drawId === "desk" || drawId === "receptionist-chair" ||
            key.includes(":desk:") || key.includes("receptionist-chair");
        })
        .map(([, image]) => image.getBounds());
      if (renderedTargets.some((bounds) =>
        pointer.x >= bounds.left && pointer.x <= bounds.right &&
        pointer.y >= bounds.top && pointer.y <= bounds.bottom
      )) return true;
    }
    const rectangle = this.toPixels({
      tileX: room.tileX,
      tileY: room.tileY,
      ...orientedSize(room),
    });
    const bounds = this.canRenderFrontDeskV5Architecture()
      ? getFrontDeskV5Projection(rectangle).floorBounds
      : rectangle;
    return FRONT_DESK_PRESENTATION.fixtures
      .filter(
        (fixture) =>
          fixture.id === "frontDesk" || fixture.id === "secretaryChair",
      )
      .some((fixture) => {
        const centerX = bounds.x + bounds.width * fixture.x;
        const contactY = bounds.y + bounds.height * fixture.contact.y;
        const width = bounds.width * fixture.width;
        const height = bounds.height * fixture.height;
        return (
          pointer.x >= centerX - width / 2 &&
          pointer.x <= centerX + width / 2 &&
          pointer.y >= contactY - height &&
          pointer.y <= contactY
        );
      });
  }

  private ordinaryChairAtPointer(
    pointer: Phaser.Input.Pointer,
  ): FacilityFounderChairView | null {
    for (const room of this.bridge.viewModel.rooms) {
      if (room.definitionId !== "room.waiting") continue;
      const orientation: RoomOrientation = room.orientation === 270 ? 270 : 0;
      const supports = resolveApprovedRoomActorSupports(room.definitionId, orientation)
        .filter((support) => support.role === "waiting-seat");
      if (supports.length === 0) continue;
      const bounds = this.toPixels({
        tileX: room.tileX,
        tileY: room.tileY,
        ...orientedSize(room),
      });
      const mapped = (this.bridge.viewModel.founderChairs ?? [])
        .filter((chair) => chair.roomInstanceId === room.instanceId)
        .flatMap((chair) => {
          const support = getNearestApprovedActorSupport(
            supports,
            {
              x: chair.location.x - room.tileX,
              y: chair.location.y - room.tileY,
            },
            "waiting-seat",
          );
          return support ? [{ chair, support }] : [];
        });
      for (const [key, image] of this.fixtureBitmapImages) {
        if (!key.startsWith(`approved:${room.instanceId}:`) || !image.visible) continue;
        const drawId = image.getData("approved-draw-id") as string | undefined;
        const fixtureId = drawId?.split(".").at(-1);
        if (!fixtureId) continue;
        const candidates = mapped.filter(({ support }) =>
          support.id.startsWith(`${fixtureId}:`),
        );
        if (candidates.length === 0) continue;
        const imageBounds = image.getBounds();
        if (pointer.x < imageBounds.left || pointer.x > imageBounds.right ||
          pointer.y < imageBounds.top || pointer.y > imageBounds.bottom) continue;
        return candidates
          .map(({ chair, support }) => ({
            chair,
            distance:
              (pointer.x - (bounds.x + support.seat.x * this.layout.tileSize)) ** 2 +
              (pointer.y - (bounds.y + support.seat.y * this.layout.tileSize)) ** 2,
          }))
          .sort((left, right) => left.distance - right.distance)[0]!.chair;
      }
    }
    // Front Desk public chair and Break Room seats: nearest seat contact
    // within half a tile (break seats can share one logical tile).
    const reach = this.layout.tileSize * 0.5;
    const nearby = (this.bridge.viewModel.founderChairs ?? [])
      .filter((chair) => chair.kind === "front_desk_public" || chair.kind === "break")
      .flatMap((chair) => {
        const seat = this.founderSeatScreenPoint(chair);
        if (!seat) return [];
        // The seat contact is at hip height; accept clicks on the seat back above it too.
        const distance = Math.hypot(pointer.x - seat.x, Math.max(0, Math.abs(pointer.y - (seat.y - reach * 0.4)) - reach * 0.4));
        return distance <= reach ? [{ chair, distance }] : [];
      })
      .sort((left, right) => left.distance - right.distance)[0];
    if (nearby) return nearby.chair;
    const point = this.gridPointAtPointer(pointer);
    return this.bridge.viewModel.founderChairs?.find((chair) =>
      chair.kind !== "break" &&
      chair.location.x === point?.x && chair.location.y === point?.y,
    ) ?? null;
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
