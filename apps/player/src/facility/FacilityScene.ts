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
  FacilityPatientView,
  FacilityRoomView,
  FacilityViewModel,
  PlaceRoomRequest,
  PraiseEmployeeRequest,
  RefillWaterCoolerRequest,
  SelectRoomRequest,
} from "./types";
import {
  getWaitingPatientQueueIndices,
  getWaitingPatientRoomLocations,
} from "./patientPlacement";

export interface FacilitySceneBridge {
  viewModel: FacilityViewModel;
  onPlaceRoom: PlaceRoomRequest;
  onSelectRoom?: SelectRoomRequest;
  onCollectLitter?: CollectLitterRequest;
  onRefillWaterCooler?: RefillWaterCoolerRequest;
  onPraiseEmployee?: PraiseEmployeeRequest;
  onCameraChange?: FacilityCameraChangeRequest;
}

interface GridLayout {
  originX: number;
  originY: number;
  tileSize: number;
  width: number;
  height: number;
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

interface TileRectangle {
  tileX: number;
  tileY: number;
  width: number;
  height: number;
}

const DEFAULT_VISIBLE_GRID_COLUMNS = 16;
const DEFAULT_VISIBLE_GRID_ROWS = 7;
const MINIMUM_CAMERA_ZOOM = 0.1;
const MAXIMUM_CAMERA_ZOOM = 2.5;

function finiteCount(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

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

function modelSignature(model: FacilityViewModel): string {
  const counts = model.patientCounts;
  const placement = model.placement;
  const rooms = model.rooms
    .map(
      (room) =>
        `${room.instanceId}:${room.tileX},${room.tileY},${room.width},${room.height},${room.orientation ?? 0},${room.upgradeLevel ?? 1}`,
    )
    .join("|");
  const doors = (model.doors ?? [])
    .map(
      (door) =>
        `${door.instanceId}:${door.roomInstanceId}:${door.side}:${door.offset}:${door.exterior ? 1 : 0}`,
    )
    .join("|");
  const staff = model.staff
    .map(
      (employee) =>
        `${employee.instanceId}:${employee.homeRoomInstanceId}:${employee.location?.x ?? "-"},${employee.location?.y ?? "-"}:${employee.morale ?? "-"}`,
    )
    .join("|");
  const patients = (model.patients ?? [])
    .map(
      (patient) =>
        `${patient.instanceId}:${patient.status}:${patient.location?.x ?? "-"},${patient.location?.y ?? "-"}`,
    )
    .join("|");
  const environment = [
    model.founder.location
      ? `${model.founder.location.x},${model.founder.location.y}`
      : "-",
    ...(model.litterItems ?? []).map(
      (item) =>
        `${item.instanceId}:${item.location.x},${item.location.y}`,
    ),
    model.waterCooler
      ? `water:${model.waterCooler.fillPercent}:${
          model.waterCooler.needsRefill ? 1 : 0
        }`
      : "water:-",
  ].join("|");

  return [
    model.facilityTick,
    model.paused ? 1 : 0,
    model.buildMode ? 1 : 0,
    positiveGridSize(model.gridColumns, 16),
    positiveGridSize(model.gridRows, 10),
    finiteCount(counts.waiting),
    finiteCount(counts.active),
    finiteCount(counts.actionReady),
    finiteCount(counts.resolved),
    placement
      ? `${placement.definitionId}:${placement.width}x${placement.height}:${placement.orientation ?? 0}:${placement.doorSide ?? "inferred"}`
      : "-",
    rooms,
    doors,
    staff,
    patients,
    environment,
    model.selectedPatientInstanceId ?? "-",
    model.camera
      ? `${model.camera.zoom},${model.camera.panX},${model.camera.panY}`
      : "camera.default",
  ].join(":");
}

/**
 * Phaser is a rendering and pointer-input adapter only. It never decides
 * whether a room is purchased, unlocked, or affordable.
 */
export class FacilityScene extends Phaser.Scene {
  private readonly bridge: FacilitySceneBridge;

  private worldGraphics?: Phaser.GameObjects.Graphics;
  private characterGraphics?: Phaser.GameObjects.Graphics;
  private ghostGraphics?: Phaser.GameObjects.Graphics;
  private footerText?: Phaser.GameObjects.Text;
  private ghostStatusText?: Phaser.GameObjects.Text;
  private ghostDoorText?: Phaser.GameObjects.Text;
  private roomTexts: Phaser.GameObjects.Text[] = [];

  private layout: GridLayout = {
    originX: 0,
    originY: 0,
    tileSize: 24,
    width: 16 * 24,
    height: 10 * 24,
  };

  private placementGhost: PlacementGhost | null = null;
  private characterPhase = 0;
  private cameraView: FacilityCameraView = {
    zoom: 1,
    panX: 0,
    panY: 0,
  };
  private lastRequestedCameraSignature = "";
  private dragStart:
    | { pointerX: number; pointerY: number; panX: number; panY: number }
    | null = null;
  private lastWidth = -1;
  private lastHeight = -1;
  private lastModelSignature = "";

  public constructor(bridge: FacilitySceneBridge) {
    super({ key: "facility-scene" });
    this.bridge = bridge;
  }

  public create(): void {
    this.cameras.main.setBackgroundColor("#e8e4cf");
    this.cameras.main.setRoundPixels(true);

    this.worldGraphics = this.add.graphics();
    this.characterGraphics = this.add.graphics();
    this.ghostGraphics = this.add.graphics().setDepth(10);

    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      color: "#111111",
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: "14px",
      fontStyle: "bold",
      resolution: 2,
    };

    this.footerText = this.add
      .text(0, 0, "", {
        ...textStyle,
        color: "#333333",
        fontSize: "12px",
      })
      .setOrigin(0.5, 0);

    this.ghostStatusText = this.add
      .text(0, 0, "", {
        ...textStyle,
        align: "center",
        backgroundColor: "#ffffff",
        color: "#111111",
        fontSize: "12px",
        padding: { x: 6, y: 4 },
      })
      .setOrigin(0.5, 1)
      .setDepth(20)
      .setVisible(false);

    this.ghostDoorText = this.add
      .text(0, 0, "", {
        ...textStyle,
        align: "center",
        backgroundColor: "#111111",
        color: "#ffffff",
        fontSize: "11px",
        padding: { x: 4, y: 2 },
      })
      .setOrigin(0.5)
      .setDepth(21)
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
      () => {
        this.dragStart = null;
      },
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
      this.drawPlacementGhost();
    });

    this.refreshLayout(true);
  }

  public update(_time: number, delta: number): void {
    if (!this.bridge.viewModel.paused) {
      this.characterPhase += delta * 0.006;
    }

    this.refreshLayout();
    this.drawCharacters();
  }

  private refreshLayout(force = false): void {
    const width = Math.max(1, Math.floor(this.scale.width));
    const height = Math.max(1, Math.floor(this.scale.height));
    const signature = modelSignature(this.bridge.viewModel);

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
    const usableHeight = Math.max(1, height - sidewalkHeight);
    const fullSiteTileSize = Math.max(
      1,
      Math.floor(
        Math.min(usableWidth / columns, usableHeight / rows),
      ),
    );
    const workingTileSize = Math.max(
      fullSiteTileSize,
      Math.floor(
        Math.min(
          usableWidth /
            Math.min(columns, DEFAULT_VISIBLE_GRID_COLUMNS),
          usableHeight /
            Math.min(rows, DEFAULT_VISIBLE_GRID_ROWS),
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
    const defaultOriginY = usableHeight - gridHeight;
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

    graphics.clear();
    graphics.fillStyle(0xe8e4cf, 1);
    graphics.fillRect(0, 0, this.scale.width, this.scale.height);

    graphics.fillStyle(0xe8e4cf, 1);
    graphics.fillRect(originX, originY, width, height);
    if (model.buildMode || model.placement) {
      graphics.lineStyle(1, 0xd1d1cc, 1);
      for (let column = 0; column <= columns; column += 1) {
        const x = originX + column * tileSize;
        graphics.lineBetween(x, originY, x, originY + height);
      }
      for (let row = 0; row <= rows; row += 1) {
        const y = originY + row * tileSize;
        graphics.lineBetween(originX, y, originX + width, y);
      }
    }

    if (model.buildMode || model.placement) {
      graphics.lineStyle(2, 0x3c4335, 1);
      graphics.strokeRect(originX, originY, width, height);
    }

    model.rooms.forEach((room, index) => {
      this.drawRoom(graphics, room, index);
    });
    (model.doors ?? []).forEach((door) => {
      this.drawExplicitDoor(graphics, door);
    });
    this.drawEnvironment(graphics);
    this.drawExterior(graphics);
  }

  private drawEnvironment(
    graphics: Phaser.GameObjects.Graphics,
  ): void {
    const pixel = Math.max(2, Math.floor(this.layout.tileSize / 10));
    for (const litter of this.bridge.viewModel.litterItems ?? []) {
      const x =
        this.layout.originX +
        (litter.location.x + 0.5) * this.layout.tileSize;
      const y =
        this.layout.originY +
        (litter.location.y + 0.65) * this.layout.tileSize;
      graphics.fillStyle(0x3c4335, 1);
      graphics.fillRect(x - pixel * 2, y - pixel, pixel * 2, pixel);
      graphics.fillRect(x, y, pixel * 2, pixel);
      graphics.lineStyle(1, 0xf6f1dc, 1);
      graphics.lineBetween(
        x - pixel * 2,
        y - pixel,
        x + pixel * 2,
        y + pixel,
      );
    }
    const cooler = this.bridge.viewModel.waterCooler;
    if (!cooler) {
      return;
    }
    const x =
      this.layout.originX +
      (cooler.location.x + 0.5) * this.layout.tileSize;
    const y =
      this.layout.originY +
      (cooler.location.y + 0.72) * this.layout.tileSize;
    graphics.fillStyle(0xf6f1dc, 1);
    graphics.fillRect(
      x - pixel * 2,
      y - pixel * 5,
      pixel * 4,
      pixel * 5,
    );
    graphics.lineStyle(1, 0x3c4335, 1);
    graphics.strokeRect(
      x - pixel * 2,
      y - pixel * 5,
      pixel * 4,
      pixel * 5,
    );
    const fillHeight = Math.round(
      (pixel * 3 * cooler.fillPercent) / 100,
    );
    graphics.fillStyle(
      cooler.needsRefill ? 0x8b8d79 : 0x59614d,
      1,
    );
    graphics.fillRect(
      x - pixel,
      y - pixel * 4 + (pixel * 3 - fillHeight),
      pixel * 2,
      fillHeight,
    );
    graphics.fillStyle(0x3c4335, 1);
    graphics.fillRect(x - pixel, y, pixel * 2, pixel * 2);
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
      graphics.fillStyle(0xe7e7e2, 1);
      graphics.fillRect(
        rectangle.x,
        rectangle.y,
        rectangle.width,
        rectangle.height,
      );
      graphics.lineStyle(1, 0x777777, 0.7);
      graphics.strokeRect(
        rectangle.x,
        rectangle.y,
        rectangle.width,
        rectangle.height,
      );
      const centerY = rectangle.y + Math.floor(rectangle.height / 2);
      graphics.lineBetween(
        rectangle.x + 2,
        centerY,
        rectangle.x + rectangle.width - 2,
        centerY,
      );
      return;
    }
    const shade = room.isFounderRoom
      ? 0xe6e6e1
      : index % 2 === 0
        ? 0xd7d7d2
        : 0xc9c9c4;
    const furnitureInset = Math.max(
      4,
      Math.floor(this.layout.tileSize * 0.32),
    );

    graphics.fillStyle(shade, 1);
    graphics.fillRect(
      rectangle.x,
      rectangle.y,
      rectangle.width,
      rectangle.height,
    );
    this.drawRoomFloor(graphics, rectangle, shade);
    graphics.lineStyle(3, 0x111111, 1);
    graphics.strokeRect(
      rectangle.x,
      rectangle.y,
      rectangle.width,
      rectangle.height,
    );

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
      width: room.width,
      height: room.height,
    });
    const slotCenter =
      (door.offset + 0.5) * this.layout.tileSize;
    const opening = Math.max(
      7,
      Math.min(this.layout.tileSize - 2, this.layout.tileSize * 0.65),
    );
    const half = opening / 2;
    const center =
      door.side === "north"
        ? { x: rectangle.x + slotCenter, y: rectangle.y }
        : door.side === "south"
          ? {
              x: rectangle.x + slotCenter,
              y: rectangle.y + rectangle.height,
            }
          : door.side === "west"
            ? { x: rectangle.x, y: rectangle.y + slotCenter }
            : {
                x: rectangle.x + rectangle.width,
                y: rectangle.y + slotCenter,
              };
    graphics.lineStyle(Math.max(5, this.layout.tileSize * 0.18), 0xe8e4cf, 1);
    if (door.side === "north" || door.side === "south") {
      graphics.lineBetween(center.x - half, center.y, center.x + half, center.y);
    } else {
      graphics.lineBetween(center.x, center.y - half, center.x, center.y + half);
    }
    graphics.lineStyle(Math.max(1, this.layout.tileSize * 0.06), 0x3c4335, 1);
    if (door.side === "north" || door.side === "south") {
      graphics.lineBetween(center.x - half, center.y, center.x - half, center.y + (door.side === "north" ? 5 : -5));
      graphics.lineBetween(center.x + half, center.y, center.x + half, center.y + (door.side === "north" ? 5 : -5));
    } else {
      graphics.lineBetween(center.x, center.y - half, center.x + (door.side === "west" ? 5 : -5), center.y - half);
      graphics.lineBetween(center.x, center.y + half, center.x + (door.side === "west" ? 5 : -5), center.y + half);
    }
  }

  private drawRoomFloor(
    graphics: Phaser.GameObjects.Graphics,
    rectangle: { x: number; y: number; width: number; height: number },
    shade: number,
  ): void {
    const tile = Math.max(8, Math.floor(this.layout.tileSize * 0.7));
    const floorLine = shade === 0xe6e6e1 ? 0xc5c5bf : 0xb5b5af;
    graphics.lineStyle(1, floorLine, 0.58);
    for (
      let x = rectangle.x + tile;
      x < rectangle.x + rectangle.width;
      x += tile
    ) {
      graphics.lineBetween(
        x,
        rectangle.y + 3,
        x,
        rectangle.y + rectangle.height - 3,
      );
    }
    for (
      let y = rectangle.y + tile;
      y < rectangle.y + rectangle.height;
      y += tile
    ) {
      graphics.lineBetween(
        rectangle.x + 3,
        y,
        rectangle.x + rectangle.width - 3,
        y,
      );
    }

    const baseboard = Math.max(2, Math.floor(this.layout.tileSize * 0.08));
    graphics.fillStyle(0x777772, 0.9);
    graphics.fillRect(
      rectangle.x + 3,
      rectangle.y + 3,
      rectangle.width - 6,
      baseboard,
    );
  }

  private drawExterior(graphics: Phaser.GameObjects.Graphics): void {
    const { originX, originY, width, height, tileSize } = this.layout;
    const mapBottom = originY + height;
    const sidewalkTop = mapBottom + 3;
    const sidewalkHeight = Math.max(
      18,
      Math.min(34, this.scale.height - sidewalkTop - 2),
    );

    graphics.fillStyle(0xd8d8d1, 1);
    graphics.fillRect(originX, sidewalkTop, width, sidewalkHeight);
    graphics.lineStyle(2, 0x555551, 1);
    graphics.lineBetween(originX, sidewalkTop, originX + width, sidewalkTop);
    graphics.lineBetween(
      originX,
      sidewalkTop + sidewalkHeight,
      originX + width,
      sidewalkTop + sidewalkHeight,
    );
    graphics.lineStyle(1, 0xa0a09a, 0.85);
    for (let x = originX + tileSize; x < originX + width; x += tileSize) {
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

    // The room retains its saved internal door while receiving a fixed
    // exterior entrance against the public sidewalk.
    graphics.fillStyle(0xf2f2ec, 1);
    graphics.fillRect(
      entranceLeft,
      founderPixels.y + founderPixels.height - 4,
      entranceWidth,
      8,
    );
    graphics.lineStyle(3, 0x111111, 1);
    graphics.lineBetween(
      entranceLeft,
      founderPixels.y + founderPixels.height,
      entranceLeft + entranceWidth,
      founderPixels.y + founderPixels.height - entranceWidth,
    );
    graphics.fillStyle(0xb9b9b2, 1);
    graphics.fillRect(
      entranceLeft - 3,
      mapBottom,
      entranceWidth + 6,
      sidewalkHeight + 3,
    );
    graphics.lineStyle(1, 0x666662, 1);
    graphics.strokeRect(
      entranceLeft - 3,
      mapBottom,
      entranceWidth + 6,
      sidewalkHeight + 3,
    );

    const planterY = mapBottom - Math.max(7, Math.floor(tileSize * 0.22));
    for (const direction of [-1, 1]) {
      const planterX =
        entranceX +
        direction * Math.max(tileSize, Math.floor(entranceWidth * 1.25));
      graphics.fillStyle(0x444441, 1);
      graphics.fillRect(planterX - 5, planterY, 10, 7);
      graphics.fillStyle(0x777772, 1);
      graphics.fillCircle(planterX, planterY - 5, 6);
      graphics.fillStyle(0xb3b3ac, 1);
      graphics.fillCircle(planterX - 5, planterY - 3, 4);
      graphics.fillCircle(planterX + 5, planterY - 3, 4);
    }
  }

  private drawRoomFixtures(
    graphics: Phaser.GameObjects.Graphics,
    room: FacilityRoomView,
    rectangle: { x: number; y: number; width: number; height: number },
    inset: number,
  ): void {
    const pixel = Math.max(2, Math.floor(this.layout.tileSize * 0.16));
    const left = rectangle.x + inset;
    const top = rectangle.y + Math.max(inset, this.layout.tileSize);
    const usableWidth = Math.max(pixel * 2, rectangle.width - inset * 2);
    const usableHeight = Math.max(pixel * 2, rectangle.height - inset * 2);

    graphics.fillStyle(0x666666, 1);
    if (room.definitionId === "room.front_desk") {
      graphics.fillRect(
        left,
        rectangle.y + Math.floor(rectangle.height * 0.62),
        usableWidth,
        pixel * 2,
      );
      graphics.fillStyle(0x222222, 1);
      graphics.fillRect(
        rectangle.x + Math.floor(rectangle.width * 0.43),
        rectangle.y + Math.floor(rectangle.height * 0.43),
        pixel * 4,
        pixel * 3,
      );
      graphics.fillStyle(0xeeeeee, 1);
      graphics.fillRect(
        rectangle.x + Math.floor(rectangle.width * 0.45),
        rectangle.y + Math.floor(rectangle.height * 0.45),
        pixel * 2,
        pixel,
      );
      graphics.fillStyle(0x777777, 1);
      graphics.fillRect(
        rectangle.x + Math.floor(rectangle.width * 0.18),
        rectangle.y + Math.floor(rectangle.height * 0.28),
        pixel * 2,
        pixel * 3,
      );
      graphics.fillStyle(0x222222, 1);
      graphics.fillCircle(
        rectangle.x + Math.floor(rectangle.width * 0.72),
        rectangle.y + Math.floor(rectangle.height * 0.46),
        pixel,
      );
      graphics.lineStyle(1, 0x222222, 1);
      graphics.strokeCircle(
        rectangle.x + Math.floor(rectangle.width * 0.72),
        rectangle.y + Math.floor(rectangle.height * 0.46),
        pixel * 2,
      );
      return;
    }

    if (
      room.definitionId === "room.examination" ||
      room.definitionId === "room.minor_procedure"
    ) {
      graphics.fillRect(
        left,
        top,
        Math.max(pixel * 5, Math.floor(usableWidth * 0.66)),
        pixel * 3,
      );
      graphics.fillStyle(0x222222, 1);
      graphics.fillRect(left + pixel, top - pixel, pixel * 2, pixel);
      graphics.fillRect(left + pixel, top + pixel * 3, pixel, pixel * 2);
      graphics.fillRect(
        left + Math.max(pixel * 4, Math.floor(usableWidth * 0.58)),
        top + pixel * 3,
        pixel,
        pixel * 2,
      );
      graphics.fillStyle(0xeeeeee, 1);
      graphics.fillRect(
        rectangle.x + rectangle.width - inset - pixel * 3,
        rectangle.y + inset,
        pixel * 3,
        pixel * 2,
      );
      graphics.lineStyle(1, 0x555555, 1);
      graphics.strokeRect(
        rectangle.x + rectangle.width - inset - pixel * 3,
        rectangle.y + inset,
        pixel * 3,
        pixel * 2,
      );
      if (room.definitionId === "room.minor_procedure") {
        graphics.lineStyle(pixel, 0x333333, 1);
        graphics.lineBetween(
          rectangle.x + rectangle.width - inset - pixel * 2,
          top,
          rectangle.x + rectangle.width - inset - pixel * 2,
          top + Math.floor(usableHeight * 0.6),
        );
      }
      return;
    }

    if (room.definitionId === "room.bathroom") {
      graphics.fillStyle(0xeeeeee, 1);
      graphics.fillCircle(
        rectangle.x + Math.floor(rectangle.width * 0.38),
        rectangle.y + Math.floor(rectangle.height * 0.57),
        pixel * 2,
      );
      graphics.lineStyle(pixel, 0x555555, 1);
      graphics.strokeCircle(
        rectangle.x + Math.floor(rectangle.width * 0.38),
        rectangle.y + Math.floor(rectangle.height * 0.57),
        pixel * 2,
      );
      graphics.fillStyle(0x777777, 1);
      graphics.fillRect(
        rectangle.x + Math.floor(rectangle.width * 0.62),
        rectangle.y + Math.floor(rectangle.height * 0.38),
        pixel * 3,
        pixel * 2,
      );
      graphics.fillStyle(0xeeeeee, 1);
      graphics.fillRect(
        rectangle.x + Math.floor(rectangle.width * 0.62),
        rectangle.y + Math.floor(rectangle.height * 0.28),
        pixel * 3,
        pixel,
      );
      return;
    }

    if (room.definitionId === "room.waiting") {
      const chairCount = Math.max(
        2,
        Math.min(5, Math.floor(usableWidth / (pixel * 4))),
      );
      for (let index = 0; index < chairCount; index += 1) {
        const chairX = left + index * pixel * 4;
        graphics.fillRect(chairX, top, pixel * 3, pixel * 2);
        graphics.fillRect(chairX, top + pixel * 2, pixel, pixel * 2);
        graphics.fillRect(
          chairX + pixel * 2,
          top + pixel * 2,
          pixel,
          pixel * 2,
        );
      }
      graphics.fillStyle(0xeeeeee, 1);
      graphics.fillCircle(
        rectangle.x + Math.floor(rectangle.width * 0.5),
        rectangle.y + Math.floor(rectangle.height * 0.68),
        pixel * 2,
      );
      graphics.lineStyle(1, 0x555555, 1);
      graphics.strokeCircle(
        rectangle.x + Math.floor(rectangle.width * 0.5),
        rectangle.y + Math.floor(rectangle.height * 0.68),
        pixel * 2,
      );
      return;
    }

    if (room.definitionId === "room.xray") {
      graphics.fillStyle(0x333333, 1);
      graphics.fillRect(
        rectangle.x + Math.floor(rectangle.width * 0.3),
        top,
        Math.floor(rectangle.width * 0.4),
        pixel * 2,
      );
      graphics.fillRect(
        rectangle.x + Math.floor(rectangle.width * 0.46),
        top + pixel * 2,
        pixel * 2,
        Math.max(pixel * 5, Math.floor(usableHeight * 0.45)),
      );
      graphics.lineStyle(pixel, 0x777777, 1);
      graphics.strokeCircle(
        rectangle.x + Math.floor(rectangle.width * 0.5),
        top + Math.floor(usableHeight * 0.4),
        pixel * 3,
      );
      return;
    }

    if (room.definitionId === "room.imaging_control") {
      graphics.fillStyle(0x333333, 1);
      graphics.fillRect(left, top, usableWidth, pixel * 3);
      graphics.fillStyle(0xeeeeee, 1);
      graphics.fillRect(left + pixel, top + pixel, pixel * 2, pixel);
      graphics.fillRect(
        rectangle.x + rectangle.width - inset - pixel * 3,
        top + pixel,
        pixel * 2,
        pixel,
      );
      graphics.fillStyle(0x777777, 1);
      graphics.fillRect(left, top + pixel * 4, usableWidth, pixel);
      return;
    }

    graphics.fillRect(
      left,
      rectangle.y + Math.floor(rectangle.height * 0.62),
      usableWidth,
      pixel * 2,
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
      graphics.lineBetween(
        horizontalX,
        edgeY,
        horizontalX + doorWidth,
        edgeY + (side === "north" ? doorWidth : -doorWidth),
      );
      return;
    }
    const edgeX =
      side === "west" ? rectangle.x : rectangle.x + rectangle.width;
    graphics.fillRect(edgeX - 3, verticalY, 6, doorWidth);
    graphics.lineBetween(
      edgeX,
      verticalY,
      edgeX + (side === "west" ? doorWidth : -doorWidth),
      verticalY + doorWidth,
    );
  }

  private drawCharacters(): void {
    const graphics = this.characterGraphics;
    if (!graphics) {
      return;
    }

    graphics.clear();
    const founderRoom = this.getFounderRoom() ?? this.bridge.viewModel.rooms[0];
    if (founderRoom) {
      const founderLocation = this.bridge.viewModel.founder.location;
      if (founderLocation) {
        this.drawPixelPerson(
          graphics,
          this.layout.originX +
            (founderLocation.x + 0.5) * this.layout.tileSize,
          this.layout.originY +
            (founderLocation.y + 0.72) * this.layout.tileSize,
          0,
          this.bridge.viewModel.founder.appearance,
          0x111111,
        );
      } else {
        this.drawPerson(
          graphics,
          founderRoom,
          0,
          0x111111,
          this.bridge.viewModel.founder.appearance,
        );
      }
    }

    this.bridge.viewModel.staff.forEach((employee, index) => {
      const homeRoom = employee.homeRoomInstanceId
        ? this.bridge.viewModel.rooms.find(
            (room) => room.instanceId === employee.homeRoomInstanceId,
          )
        : undefined;
      const room =
        homeRoom ??
        this.bridge.viewModel.rooms[
          Math.min(index + 1, this.bridge.viewModel.rooms.length - 1)
        ];
      if (room) {
        if (employee.location) {
          this.drawPixelPerson(
            graphics,
            this.layout.originX +
              (employee.location.x + 0.5) * this.layout.tileSize,
            this.layout.originY +
              (employee.location.y + 0.72) * this.layout.tileSize,
            index + 1,
            employee.appearance,
            0x555555,
          );
        } else {
          this.drawPerson(
            graphics,
            room,
            index + 1,
            0x555555,
            employee.appearance,
          );
        }
      }
    });
    const waitingPatientIds = (this.bridge.viewModel.patients ?? [])
      .filter((patient) => patient.status === "waiting")
      .map((patient) => patient.instanceId);
    const waitingLocations = getWaitingPatientRoomLocations(
      waitingPatientIds,
      this.bridge.viewModel.rooms,
    );
    const waitingQueueIndices =
      getWaitingPatientQueueIndices(waitingPatientIds);
    this.bridge.viewModel.patients?.forEach((patient, index) => {
      this.drawFacilityPatient(
        graphics,
        patient,
        index,
        waitingLocations.get(patient.instanceId),
        waitingQueueIndices.get(patient.instanceId),
      );
    });
  }

  private drawFacilityPatient(
    graphics: Phaser.GameObjects.Graphics,
    patient: FacilityPatientView,
    index: number,
    waitingRoomLocation?: GridPoint,
    waitingQueueIndex?: number,
  ): void {
    const founderRoom = this.getFounderRoom() ?? this.bridge.viewModel.rooms[0];
    if (!founderRoom) {
      return;
    }
    const founderSize = orientedSize(founderRoom);
    const appearanceColor =
      patient.status === "action-ready" ? 0x111111 : 0x666666;

    if (patient.location) {
      this.drawPixelPerson(
        graphics,
        this.layout.originX +
          (patient.location.x + 0.5) * this.layout.tileSize,
        this.layout.originY +
          (patient.location.y + 0.72) * this.layout.tileSize,
        100 + index,
        patient.appearance,
        appearanceColor,
      );
      this.drawPatientLocator(
        graphics,
        this.layout.originX +
          (patient.location.x + 0.5) * this.layout.tileSize,
        this.layout.originY +
          (patient.location.y + 0.72) * this.layout.tileSize,
        patient,
      );
      return;
    }

    const entranceX =
      this.layout.originX +
      (founderRoom.tileX + founderSize.width / 2) * this.layout.tileSize;
    const sidewalkY =
      this.layout.originY +
      this.layout.height +
      Math.max(12, Math.min(25, this.layout.tileSize * 0.45));

    if (patient.status === "waiting") {
      if (waitingRoomLocation) {
        this.drawPixelPerson(
          graphics,
          this.layout.originX +
            (waitingRoomLocation.x + 0.5) * this.layout.tileSize,
          this.layout.originY +
            (waitingRoomLocation.y + 0.72) * this.layout.tileSize,
          100 + index,
          patient.appearance,
          appearanceColor,
        );
        this.drawPatientLocator(
          graphics,
          this.layout.originX +
            (waitingRoomLocation.x + 0.5) * this.layout.tileSize,
          this.layout.originY +
            (waitingRoomLocation.y + 0.72) * this.layout.tileSize,
          patient,
        );
        return;
      }
      const stableQueueIndex = waitingQueueIndex ?? 0;
      const queueIndex = Math.floor(stableQueueIndex / 2) + 1;
      const queueDirection = stableQueueIndex % 2 === 0 ? -1 : 1;
      this.drawPixelPerson(
        graphics,
        entranceX +
          queueDirection *
            queueIndex *
            Math.max(16, this.layout.tileSize * 0.72),
        sidewalkY,
        100 + index,
        patient.appearance,
        appearanceColor,
      );
      this.drawPatientLocator(
        graphics,
        entranceX +
          queueDirection *
            queueIndex *
            Math.max(16, this.layout.tileSize * 0.72),
        sidewalkY,
        patient,
      );
      return;
    }

    if (patient.status === "off-site") {
      const travel = patient.offsiteTravel;
      if (!travel || travel.phase === "away") {
        return;
      }
      const excursion =
        travel.phase === "departing"
          ? travel.progress
          : 1 - travel.progress;
      const travelDistance = Math.min(
        this.layout.width * 0.34,
        this.layout.tileSize * 6,
      );
      this.drawPixelPerson(
        graphics,
        entranceX + travel.direction * excursion * travelDistance,
        sidewalkY,
        100 + index,
        patient.appearance,
        appearanceColor,
      );
      this.drawPatientLocator(
        graphics,
        entranceX + travel.direction * excursion * travelDistance,
        sidewalkY,
        patient,
      );
      return;
    }

    const careRoom =
      this.bridge.viewModel.rooms.find(
        (room) => room.definitionId === "room.examination",
      ) ?? founderRoom;
    const careSize = orientedSize(careRoom);
    const offset =
      ((index % Math.max(1, careSize.width)) -
        (Math.max(1, careSize.width) - 1) / 2) *
      Math.min(this.layout.tileSize * 0.38, 18);
    this.drawPixelPerson(
      graphics,
      this.layout.originX +
        (careRoom.tileX + careSize.width / 2) * this.layout.tileSize +
        offset,
      this.layout.originY +
        (careRoom.tileY + careSize.height * 0.72) * this.layout.tileSize,
      100 + index,
      patient.appearance,
      appearanceColor,
    );
    this.drawPatientLocator(
      graphics,
      this.layout.originX +
        (careRoom.tileX + careSize.width / 2) * this.layout.tileSize +
        offset,
      this.layout.originY +
        (careRoom.tileY + careSize.height * 0.72) * this.layout.tileSize,
      patient,
    );
  }

  private drawPatientLocator(
    graphics: Phaser.GameObjects.Graphics,
    centerX: number,
    baseY: number,
    patient: FacilityPatientView,
  ): void {
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
    const arrowY = baseY - pixel * 9 - pulse;
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

  private drawPerson(
    graphics: Phaser.GameObjects.Graphics,
    roomView: FacilityRoomView,
    offsetIndex: number,
    color: number,
    appearance?: PixelAppearanceDescriptor,
  ): void {
    const size = orientedSize(roomView);
    const room = this.toPixels({
      tileX: roomView.tileX,
      tileY: roomView.tileY,
      ...size,
    });
    const pixel = Math.max(2, Math.floor(this.layout.tileSize / 9));
    const bounce = this.bridge.viewModel.paused
      ? 0
      : Math.round(Math.sin(this.characterPhase + offsetIndex) * pixel);
    const centerX =
      room.x +
      Math.floor(room.width / 2) +
      (offsetIndex % 3 - 1) * pixel * 5;
    const baseY = room.y + Math.floor(room.height * 0.72) + bounce;

    this.drawPixelPerson(
      graphics,
      centerX,
      baseY - bounce,
      offsetIndex,
      appearance,
      color,
    );
  }

  private drawPixelPerson(
    graphics: Phaser.GameObjects.Graphics,
    centerX: number,
    baseYWithoutBounce: number,
    offsetIndex: number,
    appearance: PixelAppearanceDescriptor | undefined,
    fallbackColor: number,
  ): void {
    const pixel = Math.max(2, Math.floor(this.layout.tileSize / 9));
    const bounce = this.bridge.viewModel.paused
      ? 0
      : Math.round(Math.sin(this.characterPhase + offsetIndex) * pixel);
    const baseY = baseYWithoutBounce + bounce;
    const shades = [0x111111, 0x444444, 0x777777, 0xaaaaaa] as const;
    const bodyWidth =
      appearance?.bodyShape === "broad"
        ? 4
        : appearance?.bodyShape === "compact"
          ? 2
          : 3;
    const bodyHeight = appearance?.bodyShape === "tall" ? 5 : 4;
    const outfitColor = appearance
      ? shades[appearance.outfitShade]
      : fallbackColor;
    const hairColor = appearance
      ? shades[appearance.hairShade]
      : fallbackColor;

    graphics.fillStyle(0xcccccc, 1);
    graphics.fillRect(
      centerX - pixel * 2,
      baseY - pixel * 5,
      pixel * 4,
      pixel * 4,
    );
    if (appearance?.faceStyle === "square") {
      graphics.lineStyle(pixel, 0x333333, 1);
      graphics.strokeRect(
        centerX - pixel * 2,
        baseY - pixel * 5,
        pixel * 4,
        pixel * 4,
      );
    }
    if (appearance?.hairStyle && appearance.hairStyle !== "none") {
      graphics.fillStyle(hairColor, 1);
      graphics.fillRect(
        centerX - pixel * 2,
        baseY - pixel * 5,
        pixel * 4,
        appearance.hairStyle === "curly" ? pixel * 2 : pixel,
      );
      if (appearance.hairStyle === "bun") {
        graphics.fillRect(
          centerX + pixel,
          baseY - pixel * 7,
          pixel * 2,
          pixel * 2,
        );
      }
    }
    const featurePixel = Math.max(1, Math.floor(pixel * 0.55));
    graphics.fillStyle(0x222222, 1);
    graphics.fillRect(
      centerX - pixel,
      baseY - pixel * 3,
      featurePixel,
      featurePixel,
    );
    graphics.fillRect(
      centerX + pixel - featurePixel,
      baseY - pixel * 3,
      featurePixel,
      featurePixel,
    );
    graphics.fillStyle(0x777777, 1);
    graphics.fillRect(
      centerX - Math.floor(featurePixel / 2),
      baseY - pixel * 2,
      featurePixel,
      featurePixel,
    );
    graphics.fillStyle(0x333333, 1);
    graphics.fillRect(
      centerX - pixel,
      baseY - pixel,
      pixel * 2,
      featurePixel,
    );
    graphics.fillStyle(outfitColor, 1);
    graphics.fillRect(
      centerX - Math.floor((pixel * bodyWidth) / 2),
      baseY - pixel,
      pixel * bodyWidth,
      pixel * bodyHeight,
    );
    if (appearance?.outfitStyle === "striped") {
      graphics.fillStyle(0xffffff, 0.8);
      graphics.fillRect(
        centerX - Math.floor((pixel * bodyWidth) / 2),
        baseY + pixel,
        pixel * bodyWidth,
        pixel,
      );
    } else if (appearance?.outfitStyle === "checked") {
      graphics.fillStyle(0xffffff, 0.8);
      graphics.fillRect(centerX - pixel, baseY, pixel, pixel);
      graphics.fillRect(centerX, baseY + pixel, pixel, pixel);
    } else if (appearance?.outfitStyle === "coat") {
      graphics.lineStyle(featurePixel, 0xffffff, 1);
      graphics.lineBetween(
        centerX - pixel,
        baseY - pixel,
        centerX,
        baseY + pixel * 2,
      );
      graphics.lineBetween(
        centerX + pixel,
        baseY - pixel,
        centerX,
        baseY + pixel * 2,
      );
    }
    graphics.fillStyle(outfitColor, 1);
    graphics.fillRect(centerX - pixel * 3, baseY, pixel * 2, pixel);
    graphics.fillRect(centerX + pixel, baseY, pixel * 2, pixel);
    graphics.fillRect(
      centerX - pixel * 2,
      baseY + pixel * 3,
      pixel,
      pixel * 3,
    );
    graphics.fillRect(
      centerX + pixel,
      baseY + pixel * 3,
      pixel,
      pixel * 3,
    );
    if (appearance?.accessory === "glasses") {
      graphics.lineStyle(pixel, 0x111111, 1);
      graphics.strokeRect(
        centerX - pixel * 2,
        baseY - pixel * 4,
        pixel * 2,
        pixel,
      );
      graphics.strokeRect(
        centerX,
        baseY - pixel * 4,
        pixel * 2,
        pixel,
      );
    } else if (appearance?.accessory === "badge") {
      graphics.fillStyle(0xffffff, 1);
      graphics.fillRect(centerX + pixel, baseY, pixel, pixel);
    } else if (appearance?.accessory === "headband") {
      graphics.fillStyle(0x111111, 1);
      graphics.fillRect(
        centerX - pixel * 2,
        baseY - pixel * 4,
        pixel * 4,
        pixel,
      );
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
          pixels.y + Math.max(3, Math.floor(tileSize * 0.14)),
          room.displayName.toUpperCase(),
          {
            color: "#111111",
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: `${Math.max(
              7,
              Math.min(11, Math.floor(tileSize * 0.32)),
            )}px`,
            fontStyle: "bold",
            align: "center",
            resolution: 2,
            wordWrap: {
              width: Math.max(10, pixels.width - 8),
              useAdvancedWrap: true,
            },
          },
        )
        .setOrigin(0.5, 0);
      label.setDepth(2);
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

  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    if (this.dragStart) {
      this.applyCamera({
        ...this.cameraView,
        panX:
          this.dragStart.panX + (pointer.x - this.dragStart.pointerX),
        panY:
          this.dragStart.panY + (pointer.y - this.dragStart.pointerY),
      });
      return;
    }

    if (!this.bridge.viewModel.placement) {
      if (this.placementGhost) {
        this.placementGhost = null;
        this.drawPlacementGhost();
      }
      return;
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

  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    if (pointer.button !== 0) {
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
          this.bridge.onCollectLitter?.(litter.instanceId);
          return;
        }
        const cooler = this.bridge.viewModel.waterCooler;
        if (
          cooler &&
          cooler.location.x === point.x &&
          cooler.location.y === point.y
        ) {
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
    };
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
