import Phaser from "phaser";
import type { PixelAppearanceDescriptor } from "@gamify-surgery/game-domain";

import type {
  FacilityCameraChangeRequest,
  FacilityCameraView,
  FacilityPatientView,
  FacilityRoomView,
  FacilityViewModel,
  PlaceRoomRequest,
  SelectRoomRequest,
} from "./types";

export interface FacilitySceneBridge {
  viewModel: FacilityViewModel;
  onPlaceRoom: PlaceRoomRequest;
  onSelectRoom?: SelectRoomRequest;
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
}

interface TileRectangle {
  tileX: number;
  tileY: number;
  width: number;
  height: number;
}

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
  return item.orientation === 90 || item.orientation === 270
    ? { width: item.height, height: item.width }
    : { width: item.width, height: item.height };
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
      ? `${placement.definitionId}:${placement.width}x${placement.height}`
      : "-",
    rooms,
    staff,
    patients,
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
    this.cameras.main.setBackgroundColor("#f7f7f3");
    this.cameras.main.setRoundPixels(true);

    this.worldGraphics = this.add.graphics();
    this.characterGraphics = this.add.graphics();
    this.ghostGraphics = this.add.graphics();

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
      this.placementGhost = {
        ...this.placementGhost,
        valid: this.isPlacementValid(
          this.placementGhost.tileX,
          this.placementGhost.tileY,
        ),
      };
    }

    this.drawWorld();
    this.positionText();
    this.drawPlacementGhost();
  }

  private calculateLayout(width: number, height: number): GridLayout {
    const columns = positiveGridSize(this.bridge.viewModel.gridColumns, 16);
    const rows = positiveGridSize(this.bridge.viewModel.gridRows, 10);
    const horizontalPadding = 12;
    const headerHeight = 14;
    const footerHeight = Math.max(32, Math.min(44, Math.floor(height * 0.1)));
    const usableWidth = Math.max(1, width - horizontalPadding * 2);
    const usableHeight = Math.max(1, height - headerHeight - footerHeight);
    const fittedTileSize = Math.max(
      10,
      Math.floor(Math.min(usableWidth / columns, usableHeight / rows)),
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
        zoom: Math.max(0.5, Math.min(2.5, requestedCamera.zoom)),
        panX: requestedCamera.panX,
        panY: requestedCamera.panY,
      };
      this.lastRequestedCameraSignature = requestedCameraSignature;
    }
    const tileSize = Math.max(
      6,
      Math.floor(fittedTileSize * this.cameraView.zoom),
    );
    const gridWidth = tileSize * columns;
    const gridHeight = tileSize * rows;

    return {
      originX:
        Math.floor((width - gridWidth) / 2) + this.cameraView.panX,
      originY:
        Math.floor(headerHeight + (usableHeight - gridHeight) / 2) +
        this.cameraView.panY,
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
    graphics.fillStyle(0xf7f7f3, 1);
    graphics.fillRect(0, 0, this.scale.width, this.scale.height);

    graphics.fillStyle(0xffffff, 1);
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

    graphics.lineStyle(2, 0x111111, 1);
    graphics.strokeRect(originX, originY, width, height);

    model.rooms.forEach((room, index) => {
      this.drawRoom(graphics, room, index);
    });
    this.drawPatients(graphics);
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
    graphics.lineStyle(3, 0x111111, 1);
    graphics.strokeRect(
      rectangle.x,
      rectangle.y,
      rectangle.width,
      rectangle.height,
    );

    this.drawRoomFixtures(graphics, room, rectangle, furnitureInset);

    this.drawDoor(graphics, rectangle, room.doorSide ?? "south", shade);
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

  private drawPatients(graphics: Phaser.GameObjects.Graphics): void {
    if ((this.bridge.viewModel.patients?.length ?? 0) > 0) {
      return;
    }
    const anchor = this.getFounderRoom() ?? this.bridge.viewModel.rooms[0];
    if (!anchor) {
      return;
    }

    const counts = this.bridge.viewModel.patientCounts;
    const markerSize = Math.max(5, Math.floor(this.layout.tileSize * 0.34));
    const gap = Math.max(3, Math.floor(markerSize * 0.45));
    const anchorSize = orientedSize(anchor);
    const room = this.toPixels({
      tileX: anchor.tileX,
      tileY: anchor.tileY,
      ...anchorSize,
    });
    const outsideY =
      room.y + room.height + Math.floor(this.layout.tileSize * 0.42);
    const insideY = room.y + Math.floor(this.layout.tileSize * 1.45);

    this.drawPatientGroup(
      graphics,
      finiteCount(counts.waiting),
      room.x,
      outsideY,
      markerSize,
      gap,
      "waiting",
    );
    this.drawPatientGroup(
      graphics,
      finiteCount(counts.active),
      room.x + Math.floor(this.layout.tileSize * 0.4),
      insideY,
      markerSize,
      gap,
      "active",
    );
    this.drawPatientGroup(
      graphics,
      finiteCount(counts.actionReady),
      room.x + room.width - Math.floor(this.layout.tileSize * 0.4),
      insideY,
      markerSize,
      gap,
      "action-ready",
      true,
    );
  }

  private drawPatientGroup(
    graphics: Phaser.GameObjects.Graphics,
    count: number,
    startX: number,
    y: number,
    size: number,
    gap: number,
    kind: "waiting" | "active" | "action-ready",
    rightAligned = false,
  ): void {
    const visibleCount = Math.min(count, 5);

    for (let index = 0; index < visibleCount; index += 1) {
      const offset = index * (size + gap);
      const x = rightAligned ? startX - size - offset : startX + offset;

      if (kind === "waiting") {
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRect(x, y, size, size);
        graphics.lineStyle(2, 0x222222, 1);
        graphics.strokeRect(x, y, size, size);
      } else {
        graphics.fillStyle(kind === "action-ready" ? 0x111111 : 0x666666, 1);
        graphics.fillRect(x, y, size, size);
      }

      if (kind === "action-ready") {
        graphics.fillStyle(0xffffff, 1);
        const stroke = Math.max(1, Math.floor(size * 0.15));
        graphics.fillRect(
          x + Math.floor(size / 2) - Math.floor(stroke / 2),
          y + Math.floor(size * 0.18),
          stroke,
          Math.max(2, Math.floor(size * 0.42)),
        );
        graphics.fillRect(
          x + Math.floor(size / 2) - Math.floor(stroke / 2),
          y + Math.floor(size * 0.76),
          stroke,
          stroke,
        );
      }
    }
  }

  private drawCharacters(): void {
    const graphics = this.characterGraphics;
    if (!graphics) {
      return;
    }

    graphics.clear();
    const founderRoom = this.getFounderRoom() ?? this.bridge.viewModel.rooms[0];
    if (founderRoom) {
      this.drawPerson(graphics, founderRoom, 0, 0x111111);
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
    this.bridge.viewModel.patients?.forEach((patient, index) => {
      this.drawFacilityPatient(graphics, patient, index);
    });
  }

  private drawFacilityPatient(
    graphics: Phaser.GameObjects.Graphics,
    patient: FacilityPatientView,
    index: number,
  ): void {
    const founderRoom = this.getFounderRoom() ?? this.bridge.viewModel.rooms[0];
    if (!founderRoom) {
      return;
    }
    const fallback = orientedSize(founderRoom);
    const location =
      patient.location ??
      (patient.status === "waiting" || patient.status === "off-site"
        ? {
            x: founderRoom.tileX + (index % Math.max(1, fallback.width)),
            y: founderRoom.tileY + fallback.height + 1,
          }
        : {
            x:
              founderRoom.tileX +
              Math.min(
                fallback.width - 1,
                index % Math.max(1, fallback.width),
              ),
            y: founderRoom.tileY + Math.floor(fallback.height / 2),
          });
    this.drawPixelPerson(
      graphics,
      this.layout.originX + (location.x + 0.5) * this.layout.tileSize,
      this.layout.originY + (location.y + 0.72) * this.layout.tileSize,
      100 + index,
      patient.appearance,
      patient.status === "action-ready" ? 0x111111 : 0x666666,
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
          ? `BUILD: ${model.placement.displayName.toUpperCase()} ${model.placement.width}×${model.placement.height} • TAP A CLEAR AREA`
          : `${model.facilityTitle.toUpperCase()} • SOUND-FREE`,
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
          valid: this.isPlacementValid(tileX, tileY),
        }
      : null;
    this.drawPlacementGhost();
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
        0.5,
        Math.min(
          2.5,
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

  private isPlacementValid(tileX: number, tileY: number): boolean {
    const placement = this.bridge.viewModel.placement;
    if (!placement) {
      return false;
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

    return (
      insideGrid &&
      this.bridge.viewModel.rooms.every(
        (room) =>
          !rectanglesOverlap(candidate, {
            tileX: room.tileX,
            tileY: room.tileY,
            ...orientedSize(room),
          }),
      )
    );
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
      return;
    }

    const rectangle = this.toPixels({
      tileX: ghost.tileX,
      tileY: ghost.tileY,
      ...orientedSize(placement),
    });
    const border = Math.max(2, Math.floor(this.layout.tileSize * 0.1));

    graphics.fillStyle(ghost.valid ? 0xffffff : 0x777777, 0.65);
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
      graphics.lineStyle(border, 0xffffff, 1);
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
