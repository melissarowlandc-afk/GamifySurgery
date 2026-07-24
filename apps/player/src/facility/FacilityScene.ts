import Phaser from "phaser";

import type {
  FacilityRoomView,
  FacilityViewModel,
  PlaceRoomRequest,
} from "./types";

interface FacilitySceneBridge {
  viewModel: FacilityViewModel;
  onPlaceRoom: PlaceRoomRequest;
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

function modelSignature(model: FacilityViewModel): string {
  const counts = model.patientCounts;
  const placement = model.placement;
  const rooms = model.rooms
    .map(
      (room) =>
        `${room.instanceId}:${room.tileX},${room.tileY},${room.width},${room.height}`,
    )
    .join("|");
  const staff = model.staff
    .map((employee) => `${employee.instanceId}:${employee.homeRoomInstanceId}`)
    .join("|");

  return [
    model.facilityTick,
    model.paused ? 1 : 0,
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
  private statusText?: Phaser.GameObjects.Text;
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

    this.statusText = this.add.text(0, 0, "", textStyle);
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
    this.input.on("gameout", () => {
      this.placementGhost = null;
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
    const headerHeight = Math.max(42, Math.min(58, Math.floor(height * 0.13)));
    const footerHeight = Math.max(32, Math.min(44, Math.floor(height * 0.1)));
    const usableWidth = Math.max(1, width - horizontalPadding * 2);
    const usableHeight = Math.max(1, height - headerHeight - footerHeight);
    const tileSize = Math.max(
      10,
      Math.floor(Math.min(usableWidth / columns, usableHeight / rows)),
    );
    const gridWidth = tileSize * columns;
    const gridHeight = tileSize * rows;

    return {
      originX: Math.floor((width - gridWidth) / 2),
      originY: Math.floor(headerHeight + (usableHeight - gridHeight) / 2),
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
    graphics.lineStyle(1, 0xd1d1cc, 1);

    for (let column = 0; column <= columns; column += 1) {
      const x = originX + column * tileSize;
      graphics.lineBetween(x, originY, x, originY + height);
    }
    for (let row = 0; row <= rows; row += 1) {
      const y = originY + row * tileSize;
      graphics.lineBetween(originX, y, originX + width, y);
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
    const rectangle = this.toPixels(room);
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

    // A generic large-pixel fixture keeps every room readable without putting
    // room-specific simulation or asset IDs into the renderer.
    graphics.fillStyle(room.isFounderRoom ? 0x555555 : 0x777777, 1);
    graphics.fillRect(
      rectangle.x + furnitureInset,
      rectangle.y + Math.floor(rectangle.height * 0.62),
      Math.max(5, rectangle.width - furnitureInset * 2),
      Math.max(4, Math.floor(this.layout.tileSize * 0.22)),
    );

    const doorWidth = Math.max(8, this.layout.tileSize);
    const doorX =
      rectangle.x + Math.floor(rectangle.width / 2 - doorWidth / 2);
    graphics.fillStyle(shade, 1);
    graphics.fillRect(
      doorX,
      rectangle.y + rectangle.height - 3,
      doorWidth,
      6,
    );
    graphics.lineStyle(2, 0x111111, 1);
    graphics.lineBetween(
      doorX,
      rectangle.y + rectangle.height,
      doorX + doorWidth,
      rectangle.y + rectangle.height - doorWidth,
    );
  }

  private drawPatients(graphics: Phaser.GameObjects.Graphics): void {
    const anchor = this.getFounderRoom() ?? this.bridge.viewModel.rooms[0];
    if (!anchor) {
      return;
    }

    const counts = this.bridge.viewModel.patientCounts;
    const markerSize = Math.max(5, Math.floor(this.layout.tileSize * 0.34));
    const gap = Math.max(3, Math.floor(markerSize * 0.45));
    const room = this.toPixels(anchor);
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
        this.drawPerson(graphics, room, index + 1, 0x555555);
      }
    });
  }

  private drawPerson(
    graphics: Phaser.GameObjects.Graphics,
    roomView: FacilityRoomView,
    offsetIndex: number,
    color: number,
  ): void {
    const room = this.toPixels(roomView);
    const pixel = Math.max(2, Math.floor(this.layout.tileSize / 9));
    const bounce = this.bridge.viewModel.paused
      ? 0
      : Math.round(Math.sin(this.characterPhase + offsetIndex) * pixel);
    const centerX =
      room.x +
      Math.floor(room.width / 2) +
      (offsetIndex % 3 - 1) * pixel * 5;
    const baseY = room.y + Math.floor(room.height * 0.72) + bounce;

    graphics.fillStyle(color, 1);
    graphics.fillRect(
      centerX - pixel * 2,
      baseY - pixel * 5,
      pixel * 4,
      pixel * 4,
    );
    graphics.fillRect(
      centerX - pixel,
      baseY - pixel,
      pixel * 2,
      pixel * 4,
    );
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
  }

  private positionText(): void {
    const { originX, originY, width, tileSize } = this.layout;
    const model = this.bridge.viewModel;
    const counts = model.patientCounts;
    const compact = this.scale.width < 520;
    const status = model.paused ? "PAUSED" : "OPEN";
    const tick = Math.max(0, Math.floor(model.facilityTick));

    this.statusText
      ?.setFontSize(compact ? 11 : 14)
      .setText(
        compact
          ? `T${tick}  ${status}\nW ${finiteCount(counts.waiting)}  A ${finiteCount(counts.active)}  ! ${finiteCount(counts.actionReady)}  ✓ ${finiteCount(counts.resolved)}`
          : `TICK ${tick}  •  ${status}  •  WAITING ${finiteCount(counts.waiting)}  •  ACTIVE ${finiteCount(counts.active)}  •  READY ${finiteCount(counts.actionReady)}  •  RESOLVED ${finiteCount(counts.resolved)}`,
      )
      .setPosition(originX, Math.max(6, originY - (compact ? 39 : 27)));

    this.roomTexts.forEach((text) => text.destroy());
    this.roomTexts = model.rooms.map((room) => {
      const pixels = this.toPixels(room);
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
    if (pointer.button !== 0 || !this.bridge.viewModel.placement) {
      return;
    }

    this.handlePointerMove(pointer);
    const ghost = this.placementGhost;
    if (!ghost?.valid) {
      return;
    }

    this.bridge.onPlaceRoom(ghost.tileX, ghost.tileY);
  }

  private isPlacementValid(tileX: number, tileY: number): boolean {
    const placement = this.bridge.viewModel.placement;
    if (!placement) {
      return false;
    }

    const candidate: TileRectangle = {
      tileX,
      tileY,
      width: placement.width,
      height: placement.height,
    };
    const columns = positiveGridSize(this.bridge.viewModel.gridColumns, 16);
    const rows = positiveGridSize(this.bridge.viewModel.gridRows, 10);
    const insideGrid =
      tileX >= 0 &&
      tileY >= 0 &&
      tileX + placement.width <= columns &&
      tileY + placement.height <= rows;

    return (
      insideGrid &&
      this.bridge.viewModel.rooms.every(
        (room) => !rectanglesOverlap(candidate, room),
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
      width: placement.width,
      height: placement.height,
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

export type { FacilitySceneBridge };
