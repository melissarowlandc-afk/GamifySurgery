import type {
  ApprovedActorSupport,
  ApprovedProceduralDrawRecord,
  ApprovedRoomShellPresentation,
} from "./approvedRoomPresentation";

export interface ApprovedPaintPrimitive {
  readonly shape: "rect" | "line" | "ellipse";
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly color: string;
  readonly alpha?: number;
}

const rect = (
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  alpha = 1,
): ApprovedPaintPrimitive => ({ shape: "rect", x, y, width, height, color, alpha });

const line = (
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  alpha = 1,
): ApprovedPaintPrimitive => ({ shape: "line", x, y, width, height, color, alpha });

export function parseApprovedCssColor(value: string): Readonly<{ color: number; alpha: number }> {
  if (/^#[0-9a-f]{6}$/i.test(value)) return { color: Number.parseInt(value.slice(1), 16), alpha: 1 };
  const match = value.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
  if (!match) throw new Error(`Unsupported approved proof color: ${value}`);
  return {
    color: (Number(match[1]) << 16) | (Number(match[2]) << 8) | Number(match[3]),
    alpha: match[4] === undefined ? 1 : Number(match[4]),
  };
}

/** Exact deterministic floor marks ported from the approved proof canvases. */
export function getApprovedFloorPrimitives(
  shell: ApprovedRoomShellPresentation,
  widthTiles: number,
  heightTiles: number,
  proofOrigin: readonly [number, number] = [0, 0],
): readonly ApprovedPaintPrimitive[] {
  const width = widthTiles * shell.tilePixels;
  const height = heightTiles * shell.tilePixels;
  const [originX, originY] = proofOrigin;
  const output: ApprovedPaintPrimitive[] = [rect(0, 0, width, height, shell.floorBase)];
  const grid = (cellWidth: number, cellHeight: number, color: string, alpha: number) => {
    for (let x = cellWidth; x < width; x += cellWidth) output.push(line(x, 0, 0, height, color, alpha));
    for (let y = cellHeight; y < height; y += cellHeight) output.push(line(0, y, width, 0, color, alpha));
  };
  switch (shell.floorAlgorithm) {
    case "front-desk-square": {
      const q = 44;
      for (let row = 0; row < height / q; row += 1) for (let col = 0; col < width / q; col += 1) {
        const seed = (row * 29 + col * 17 + 11) % 4;
        output.push(rect(col * q, row * q, q, q, shell.floorPalette[seed] ?? shell.floorBase));
        output.push({ shape: "ellipse", x: col * q + q * .42, y: row * q + q * .38, width: q * .6, height: q * .36, color: "#fff9e2", alpha: .035 });
      }
      grid(q, q, "#694e30", .18);
      break;
    }
    case "examination-tile": {
      const q = 30;
      for (let row = 0; row < Math.ceil(height / q); row += 1) for (let col = 0; col < Math.ceil(width / q); col += 1) {
        const seed = row * 31 + col * 19 + 7;
        output.push(rect(col * q, row * q, Math.min(q, width - col * q), Math.min(q, height - row * q), shell.floorPalette[seed % 4] ?? shell.floorBase));
        for (let index = 0; index < 5; index += 1) output.push(rect(col * q + ((seed * 17 + index * 13) % q), row * q + ((seed * 11 + index * 19) % q), 1, 1, "#3d564f", .05));
      }
      grid(q, q, "#3d4e48", .13);
      break;
    }
    case "hallway-phase": {
      const tw = 30, th = 24;
      for (let y = 0; y < height; y += th) for (let x = 0; x < width; x += tw) {
        const absoluteX = originX + x, absoluteY = originY + y;
        const n = Math.abs(Math.round(absoluteX * 13 + absoluteY * 7));
        output.push(rect(x + 1, y + 1, tw - 2, th - 2, shell.floorPalette[1 + n % 2] ?? shell.floorBase, .24));
        output.push(rect(x + 6 + n % 17, y + 5 + n % 11, 1 + n % 2, 1, n % 2 ? "#ffffff" : "#756f63", .13));
        output.push(rect(x + 4 + (n * 3) % 21, y + 4 + (n * 5) % 15, 1, 1 + n % 2, n % 2 ? "#ffffff" : "#756f63", .13));
      }
      grid(tw, th, "#524e44", .13);
      break;
    }
    case "waiting-carpet":
      for (let y = 0; y < height; y += 3) for (let x = 0; x < width; x += 3) {
        const seed = (((originX + x) * 37 + (originY + y) * 19) % 29 + 29) % 29;
        if (seed === 0 || seed === 7) output.push(rect(x, y, 1, 1, seed ? "#5b4631" : "#fff5e0", seed ? .07 : .08));
      }
      break;
    case "bathroom-tile": {
      const q = 30;
      for (let row = 0; row < Math.ceil(height / q); row += 1) for (let col = 0; col < Math.ceil(width / q); col += 1) {
        const paletteIndex = (row + col) % 3;
        const color = paletteIndex === 0 ? "#d6dcc9" : paletteIndex === 1 ? "#e4dfcb" : "#ddd9c7";
        output.push(rect(col * q, row * q, q, q, color));
        const seed = Math.abs((row * 31 + col * 17) % 23);
        output.push(rect(col * q + 5 + seed % 17, row * q + 6 + (seed * 3) % 15, 1.5, 1.5, "#5d6f52", .08));
      }
      grid(q, q, "#5c5b49", .16);
      break;
    }
    case "minor-vinyl":
      for (let y = 0; y < height; y += 8) for (let x = 0; x < width; x += 8) {
        const seed = Math.abs(((originX + x) * 13 + (originY + y) * 7) % 31);
        output.push(rect(x + seed % 5, y + (seed * 3) % 5, 1.2, 1.2, seed % 3 ? "#edf1eb" : "#4a6066", seed % 3 ? .10 : .08));
      }
      break;
    case "ultrasound-vinyl": {
      grid(30, 30, "#697d67", .24);
      for (let y = 0; y < height; y += 9) for (let x = 0; x < width; x += 9) {
        const seed = Math.abs(((originX + x) * 13 + (originY + y) * 7) % 37);
        output.push(rect(x + seed % 5, y + (seed * 3) % 5, 1, 1, seed % 3 ? "#f8f5eb" : "#5c6a60", seed % 3 ? .10 : .06));
      }
      break;
    }
    case "xray-vinyl":
      for (let y = 0; y < height; y += 7) for (let x = 0; x < width; x += 7) {
        const q = Math.abs(((originX + x) * 17 + (originY + y) * 11) % 23);
        output.push(rect(x + q % 4, y + (q * 2) % 4, 1, 1, q % 4 ? "#faf8f1" : "#535e5b", q % 4 ? .10 : .055));
      }
      break;
    case "ct-vinyl":
      for (let y = 0; y < height; y += 12) for (let x = 0; x < width; x += 12) {
        const n = ((originX + x) * 13 + (originY + y) * 7) % 19;
        output.push(rect(x + n % 5, y + (n * 3) % 5, 2, 2, n < 5 ? "#f5eee7" : "#495252", n < 5 ? .15 : .045));
      }
      grid(24, 24, "#525b58", .10);
      break;
    case "phlebotomy-terrazzo":
    case "endoscopy-slate": {
      const dark = shell.floorAlgorithm === "endoscopy-slate";
      const q = 24;
      for (let row = 0; row < Math.ceil(height / q); row += 1) for (let col = 0; col < Math.ceil(width / q); col += 1) {
        const tone = Math.abs(col * 7 + row * 11) % 9;
        const toneColor = dark
          ? tone === 0 ? "#c49a91" : tone === 4 ? "#444e52" : "#e4e0d3"
          : tone === 0 ? "#c48b94" : tone === 4 ? "#918477" : "#fffcf4";
        const toneAlpha = dark ? tone === 0 ? .12 : tone === 4 ? .11 : .05 : tone === 0 ? .115 : tone === 4 ? .075 : .055;
        output.push(rect(col * q + 1, row * q + 1, q - 1, q - 1, toneColor, toneAlpha));
        const chip = Math.abs(col * 17 + row * 23) % 13;
        const chipColor = dark ? chip % 3 ? "#343d41" : "#d8af9e" : chip % 3 ? "#70655a" : "#b56f7e";
        const chipAlpha = dark ? chip % 3 ? .20 : .18 : chip % 3 ? .10 : .13;
        output.push(rect(col * q + 5 + chip % 11, row * q + 4 + (chip * 3) % 13, 1, 1, chipColor, chipAlpha));
        output.push(rect(col * q + 15 - chip % 5, row * q + 16 - chip % 7, 1, 1, chipColor, chipAlpha));
      }
      grid(q, q, dark ? "#2d373b" : "#7a6c5e", dark ? .20 : .14);
      break;
    }
    case "evs-utility-tile":
    case "recovery-terrazzo":
    case "training-terrazzo":
    case "coffee-terrazzo":
    case "telehealth-terrazzo": {
      const q = shell.floorPatternSizePixels;
      for (let row = 0; row < Math.ceil(height / q); row += 1) for (let col = 0; col < Math.ceil(width / q); col += 1) {
        let value = 0, toneColor = "#ffffff", toneAlpha = .1, chipColor = "#000000", chipAlpha = .1, chipX = 5, chipY = 6;
        if (shell.floorAlgorithm === "evs-utility-tile") { value = Math.abs(col * 5 + row * 7) % 8; toneColor = value === 0 ? "#3a493e" : value === 3 ? "#8c846f" : "#dddbc5"; toneAlpha = value === 0 ? .18 : value === 3 ? .13 : .07; const chip = Math.abs(col * 13 + row * 19) % 11; chipColor = chip % 3 ? "#263129" : "#b6a987"; chipAlpha = chip % 3 ? .16 : .14; chipX = 4 + chip % 12; chipY = 5 + (chip * 3) % 12; }
        else if (shell.floorAlgorithm === "recovery-terrazzo") { value = Math.abs(col * 11 + row * 7) % 11; toneColor = value === 0 ? "#77897e" : value === 5 ? "#be978f" : "#fffAeb"; toneAlpha = value === 0 || value === 5 ? .12 : .13; chipColor = value % 3 ? "#5d6963" : "#b4847f"; chipAlpha = .18; chipX = 5 + value % 9; chipY = 6 + (value * 3) % 11; }
        else if (shell.floorAlgorithm === "training-terrazzo") { value = Math.abs(col * 13 + row * 7) % 13; toneColor = value === 0 ? "#9a5c44" : value === 5 ? "#75897e" : "#fff7e2"; toneAlpha = value === 0 ? .12 : value === 5 ? .10 : .13; chipColor = value % 3 ? "#74533c" : "#aa624f"; chipAlpha = .18; chipX = 5 + value % 10; chipY = 6 + (value * 3) % 11; }
        else { const coffee = shell.floorAlgorithm === "coffee-terrazzo"; value = coffee ? (col * 11 + row * 7) % 9 : Math.abs(col * 17 + row * 9) % 11; toneColor = coffee ? value === 0 ? "#bf6a4b" : value === 4 ? "#feefcc" : "#7e4d3b" : value === 1 ? "#8f7aa5" : value === 5 ? "#f1ead9" : "#746356"; toneAlpha = coffee ? value === 0 ? .13 : value === 4 ? .16 : .055 : value === 1 ? .10 : value === 5 ? .14 : .045; chipColor = coffee ? "#764d39" : "#69594f"; chipAlpha = coffee ? .16 : .12; chipX = 4 + value % (coffee ? 6 : 9); chipY = 5 + (value * 3) % (coffee ? 6 : 8); }
        output.push(rect(col * q + 1, row * q + 1, q - 1, q - 1, toneColor, toneAlpha));
        output.push(rect(col * q + chipX, row * q + chipY, 1, 1, chipColor, chipAlpha));
      }
      grid(q, q, shell.floorGrout.startsWith("#") ? shell.floorGrout : "#776c62", Number(shell.floorGrout.match(/([\d.]+)\)$/)?.[1] ?? .14));
      break;
    }
  }
  return output;
}

export function getApprovedProceduralScreenRect(
  draw: ApprovedProceduralDrawRecord,
  tilePixels: number,
): Readonly<{ left: number; top: number; width: number; height: number }> {
  if (draw.style.kind === "recovery-short-face") return {
    left: draw.rect.left * tilePixels,
    top: draw.rect.top * tilePixels - draw.style.faceHeightPixels,
    width: draw.rect.width * tilePixels,
    height: draw.style.faceHeightPixels,
  };
  return {
    left: draw.rect.left * tilePixels,
    top: draw.rect.top * tilePixels,
    width: draw.rect.width * tilePixels,
    height: draw.rect.height * tilePixels,
  };
}

export function getNearestApprovedActorSupport(
  supports: readonly ApprovedActorSupport[],
  localCell: Readonly<{ x: number; y: number }>,
): ApprovedActorSupport | undefined {
  const target = { x: localCell.x + .5, y: localCell.y + .5 };
  return [...supports].sort((left, right) => {
    const leftDistance = (left.seat.x - target.x) ** 2 + (left.seat.y - target.y) ** 2;
    const rightDistance = (right.seat.x - target.x) ** 2 + (right.seat.y - target.y) ** 2;
    return leftDistance - rightDistance || left.id.localeCompare(right.id);
  })[0];
}
