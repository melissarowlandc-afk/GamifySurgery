import type { PixelColorKey } from "./pixelPalette";

export interface PixelCell {
  x: number;
  y: number;
  color: PixelColorKey;
}

export interface PixelFrame {
  width: number;
  height: number;
  cells: PixelCell[];
}

export interface PixelSpriteAsset {
  id: string;
  width: number;
  height: number;
  cells: PixelCell[];
}

/**
 * Tiny deterministic paint surface used to create maintainable pixel-native
 * sprites without shipping flattened screenshots. Every operation resolves to
 * discrete color cells shared by the SVG and Phaser renderers.
 */
export class PixelCanvas {
  public readonly cells = new Map<string, PixelColorKey>();

  public constructor(
    public readonly width: number,
    public readonly height: number,
  ) {}

  public set(x: number, y: number, color: PixelColorKey): this {
    if (
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      x >= 0 &&
      y >= 0 &&
      x < this.width &&
      y < this.height
    ) {
      this.cells.set(`${x},${y}`, color);
    }
    return this;
  }

  public rect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: PixelColorKey,
  ): this {
    for (let row = 0; row < height; row += 1) {
      for (let column = 0; column < width; column += 1) {
        this.set(x + column, y + row, color);
      }
    }
    return this;
  }

  public outlineRect(
    x: number,
    y: number,
    width: number,
    height: number,
    fill: PixelColorKey,
    outline: PixelColorKey = "ink",
  ): this {
    this.rect(x, y, width, height, outline);
    if (width > 2 && height > 2) {
      this.rect(x + 1, y + 1, width - 2, height - 2, fill);
    }
    return this;
  }

  public line(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    color: PixelColorKey,
  ): this {
    let x = Math.round(startX);
    let y = Math.round(startY);
    const destinationX = Math.round(endX);
    const destinationY = Math.round(endY);
    const deltaX = Math.abs(destinationX - x);
    const directionX = x < destinationX ? 1 : -1;
    const deltaY = -Math.abs(destinationY - y);
    const directionY = y < destinationY ? 1 : -1;
    let error = deltaX + deltaY;
    while (true) {
      this.set(x, y, color);
      if (x === destinationX && y === destinationY) {
        break;
      }
      const doubledError = error * 2;
      if (doubledError >= deltaY) {
        error += deltaY;
        x += directionX;
      }
      if (doubledError <= deltaX) {
        error += deltaX;
        y += directionY;
      }
    }
    return this;
  }

  public ellipse(
    centerX: number,
    centerY: number,
    radiusX: number,
    radiusY: number,
    color: PixelColorKey,
  ): this {
    for (let y = -radiusY; y <= radiusY; y += 1) {
      for (let x = -radiusX; x <= radiusX; x += 1) {
        const distance =
          (x * x) / Math.max(1, radiusX * radiusX) +
          (y * y) / Math.max(1, radiusY * radiusY);
        if (distance <= 1) {
          this.set(centerX + x, centerY + y, color);
        }
      }
    }
    return this;
  }

  public frame(): PixelFrame {
    return {
      width: this.width,
      height: this.height,
      cells: [...this.cells.entries()]
        .map(([coordinate, color]) => {
          const [x, y] = coordinate.split(",").map(Number);
          return { x: x!, y: y!, color };
        })
        .sort((left, right) => left.y - right.y || left.x - right.x),
    };
  }
}

const MATRIX_COLORS: Record<string, PixelColorKey> = {
  I: "ink",
  C: "charcoal",
  D: "deepOlive",
  O: "olive",
  M: "moss",
  S: "sage",
  L: "lightSage",
  G: "warmGray",
  P: "paper",
  R: "cream",
  H: "highlight",
  W: "white",
};

export function spriteFromMatrix(
  id: string,
  rows: readonly string[],
  colors: Record<string, PixelColorKey> = MATRIX_COLORS,
): PixelSpriteAsset {
  const width = rows.reduce((maximum, row) => Math.max(maximum, row.length), 0);
  const cells: PixelCell[] = [];
  rows.forEach((row, y) => {
    [...row].forEach((symbol, x) => {
      const color = colors[symbol];
      if (color) {
        cells.push({ x, y, color });
      }
    });
  });
  return { id, width, height: rows.length, cells };
}
