import {
  normalizePixelAppearance,
  type PixelAppearanceDescriptor,
  type PixelAppearanceVariant,
  type PixelRoleStyle,
} from "@gamify-surgery/game-domain";
import { PixelCanvas, type PixelFrame } from "./pixelArt";
import {
  HAIR_TONE_KEYS,
  OUTFIT_TONE_KEYS,
  SKIN_TONE_KEYS,
  type PixelColorKey,
} from "./pixelPalette";

export type CharacterDirection = "front" | "side" | "back";
export type CharacterPose =
  | "idle"
  | "walk-a"
  | "walk-b"
  | "walk-neutral"
  | "seated"
  | "working"
  | "interaction"
  | "jump-recovery"
  | "star-jump";

export interface CharacterFrameOptions {
  direction?: CharacterDirection;
  pose?: CharacterPose;
  roleStyle?: PixelRoleStyle;
}

export interface ResolvedCharacterAppearance
  extends PixelAppearanceDescriptor {
  skinTone: 0 | 1 | 2 | 3;
  headVariant: PixelAppearanceVariant;
  bodyVariant: PixelAppearanceVariant;
  roleStyle: PixelRoleStyle;
}

const MAP_WIDTH = 24;
const MAP_HEIGHT = 36;
// The authoring grid stays compact so the shared head/body routines remain
// readable. Portraits are then rendered onto a larger, independent canvas
// with additional face and clothing pixels; they are never enlarged map
// sprites.
const PORTRAIT_SOURCE_WIDTH = 38;
const PORTRAIT_SOURCE_HEIGHT = 42;
export const CHARACTER_PORTRAIT_WIDTH = 56;
export const CHARACTER_PORTRAIT_HEIGHT = 64;

export function resolveCharacterAppearance(
  appearance: PixelAppearanceDescriptor,
  roleStyle?: PixelRoleStyle,
): ResolvedCharacterAppearance {
  return normalizePixelAppearance(
    appearance,
    roleStyle ?? appearance.roleStyle ?? "patient",
  ) as ResolvedCharacterAppearance;
}

function outfitColors(
  appearance: ResolvedCharacterAppearance,
): {
  primary: PixelColorKey;
  secondary: PixelColorKey;
  trim: PixelColorKey;
  highlight: PixelColorKey;
} {
  const selected = OUTFIT_TONE_KEYS[appearance.outfitShade];
  switch (appearance.roleStyle) {
    case "founder":
      return {
        primary:
          appearance.outfitStyle === "coat" ? "cream" : selected,
        secondary: "deepOlive",
        trim: "highlight",
        highlight: "paper",
      };
    case "receptionist":
      return {
        primary: "lightSage",
        secondary: "deepOlive",
        trim: "paper",
        highlight: "cream",
      };
    case "imaging_technician":
      return {
        primary: "moss",
        secondary: "charcoal",
        trim: "lightSage",
        highlight: "sage",
      };
    case "periop_nurse":
      return { primary: "lightSage", secondary: "moss", trim: "paper", highlight: "cream" };
    case "endoscopy_nurse":
      return { primary: "sage", secondary: "deepOlive", trim: "highlight", highlight: "paper" };
    case "endoscopist":
      return { primary: "cream", secondary: "deepOlive", trim: "moss", highlight: "paper" };
    case "phlebotomist":
      return { primary: "warmGray", secondary: "charcoal", trim: "lightSage", highlight: "paper" };
    case "evs_worker":
      return { primary: "moss", secondary: "charcoal", trim: "highlight", highlight: "lightSage" };
    case "glp1_np":
      return { primary: "paper", secondary: "sage", trim: "deepOlive", highlight: "cream" };
    default:
      return {
        primary: selected,
        secondary:
          appearance.outfitShade <= 1 ? "olive" : "paper",
        trim: "cream",
        highlight:
          appearance.outfitShade >= 2 ? "sage" : "highlight",
      };
  }
}

function skinColors(
  appearance: ResolvedCharacterAppearance,
): {
  base: PixelColorKey;
  highlight: PixelColorKey;
  shadow: PixelColorKey;
} {
  return {
    base: SKIN_TONE_KEYS[appearance.skinTone],
    highlight:
      SKIN_TONE_KEYS[Math.max(0, appearance.skinTone - 1)]!,
    shadow:
      SKIN_TONE_KEYS[Math.min(3, appearance.skinTone + 1)]!,
  };
}

function hairColors(
  appearance: ResolvedCharacterAppearance,
): { base: PixelColorKey; highlight: PixelColorKey } {
  const headVariant = numericHeadVariant(appearance);
  // Human presets use an authored, natural hair palette keyed by their
  // stable head identity. The descriptor's old shade fields remain intact
  // for save compatibility; non-human variants retain their bespoke colors.
  if (headVariant < 20) {
    const humanTones: readonly {
      base: PixelColorKey;
      highlight: PixelColorKey;
    }[] = [
      { base: "hairBlack", highlight: "charcoal" },
      { base: "hairBrown", highlight: "moss" },
      { base: "hairRed", highlight: "paper" },
      { base: "hairGray", highlight: "highlight" },
      { base: "hairGray", highlight: "paper" },
      { base: "hairBlond", highlight: "highlight" },
      { base: "hairBlack", highlight: "moss" },
      { base: "hairBrown", highlight: "paper" },
      { base: "hairGray", highlight: "highlight" },
      { base: "hairBlack", highlight: "charcoal" },
    ];
    return humanTones[headVariant % 10]!;
  }
  const highlights: readonly PixelColorKey[] = [
    "highlight",
    "lightSage",
    "moss",
    "deepOlive",
  ];
  return {
    base: HAIR_TONE_KEYS[appearance.hairShade],
    highlight: highlights[appearance.hairShade]!,
  };
}

function drawRoundedFace(
  canvas: PixelCanvas,
  x: number,
  y: number,
  width: number,
  height: number,
  base: PixelColorKey,
  highlight: PixelColorKey,
  shadow: PixelColorKey,
): void {
  canvas.rect(x + 2, y, width - 4, height, "ink");
  canvas.rect(x, y + 2, width, height - 4, "ink");
  canvas.rect(x + 1, y + 2, width - 2, height - 4, base);
  canvas.rect(x + 2, y + 1, width - 4, height - 2, base);
  canvas.rect(x + width - 2, y + 3, 1, height - 6, shadow);
  canvas.rect(x + 2, y + 3, 1, Math.max(2, height - 8), highlight);
}

function drawMapShadow(canvas: PixelCanvas, pose: CharacterPose): void {
  if (pose === "star-jump") {
    canvas.rect(6, 34, 12, 1, "shadow");
    return;
  }
  canvas.rect(5, 34, 14, 1, "shadow");
  canvas.rect(7, 35, 10, 1, "shadow");
}

function seatedFrame(
  source: PixelFrame,
  direction: CharacterDirection,
): PixelFrame {
  const canvas = new PixelCanvas(source.width, source.height);
  for (const cell of source.cells) {
    // Replace the standing shadow after the body is lowered and the legs are
    // bent. Other authored shadow pixels remain part of the appearance.
    if (cell.color === "shadow" && cell.y >= 34) {
      continue;
    }
    if (cell.y < 28) {
      canvas.set(cell.x, cell.y + 2, cell.color);
      continue;
    }

    const lowerBodyRow = cell.y - 28;
    const y = Math.min(
      source.height - 2,
      30 + Math.floor(lowerBodyRow * 0.6),
    );
    const horizontalShift =
      direction === "side"
        ? 2
        : cell.x < source.width / 2
          ? -1
          : 1;
    canvas.set(cell.x + horizontalShift, y, cell.color);
  }
  canvas.rect(5, 34, 14, 1, "shadow");
  canvas.rect(7, 35, 10, 1, "shadow");
  return canvas.frame();
}

/** Draw a compact clipboard and forward hands without changing the standing
 * silhouette or its floor contact. These are authored overlays rather than a
 * transformed/animated substitute for the idle frame. */
function workingFrame(
  source: PixelFrame,
  direction: CharacterDirection,
  skin: PixelColorKey,
): PixelFrame {
  const canvas = new PixelCanvas(source.width, source.height);
  source.cells.forEach((cell) => canvas.set(cell.x, cell.y, cell.color));
  const clipboardX = direction === "side" ? 15 : 13;
  canvas.outlineRect(clipboardX, 22, 5, 7, "paper");
  canvas.rect(clipboardX + 1, 23, 3, 1, "highlight");
  canvas.rect(clipboardX + 1, 25, 3, 1, "deepOlive");
  canvas.set(clipboardX + 2, 21, "ink");
  canvas.rect(clipboardX - 2, 27, 3, 2, skin);
  return canvas.frame();
}

/** A short, readable hand-off/praise gesture for the founder's live tasks. */
function interactionFrame(
  source: PixelFrame,
  direction: CharacterDirection,
  skin: PixelColorKey,
): PixelFrame {
  const canvas = new PixelCanvas(source.width, source.height);
  source.cells.forEach((cell) => canvas.set(cell.x, cell.y, cell.color));
  if (direction === "side") {
    canvas.line(15, 24, 21, 27, "charcoal");
    canvas.rect(20, 26, 3, 2, skin);
    canvas.set(22, 25, "highlight");
  } else {
    canvas.line(15, 24, 20, 26, "charcoal");
    canvas.rect(19, 25, 3, 2, skin);
    canvas.set(21, 24, "highlight");
  }
  return canvas.frame();
}

function numericHeadVariant(
  appearance: ResolvedCharacterAppearance,
): number {
  return appearance.headVariant as number;
}

function numericBodyVariant(
  appearance: ResolvedCharacterAppearance,
): number {
  return appearance.bodyVariant as number;
}

function isFeminineHead(
  appearance: ResolvedCharacterAppearance,
): boolean {
  const variant = numericHeadVariant(appearance);
  return variant >= 10 && variant < 20;
}

function isNonhumanHead(
  appearance: ResolvedCharacterAppearance,
): boolean {
  return numericHeadVariant(appearance) >= 20;
}

function isFeminineBody(
  appearance: ResolvedCharacterAppearance,
): boolean {
  const variant = numericBodyVariant(appearance);
  return variant >= 10 && variant < 20;
}

function isNonhumanBody(
  appearance: ResolvedCharacterAppearance,
): boolean {
  return numericBodyVariant(appearance) >= 20;
}

function isFeminineBareScalp(
  appearance: ResolvedCharacterAppearance,
): boolean {
  return numericHeadVariant(appearance) === 14;
}

function drawPixelEye(
  canvas: PixelCanvas,
  x: number,
  y: number,
  highlight = true,
): void {
  canvas.rect(x, y, 2, 2, "ink");
  if (highlight) {
    canvas.set(x, y, "highlight");
  }
}

function drawFrontHair(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
  x: number,
  y: number,
  width: number,
): void {
  const hair = hairColors(appearance);
  if (appearance.hairStyle === "none") {
    canvas.rect(x + 2, y + 1, width - 4, 1, "skinMedium");
    return;
  }
  if (appearance.hairStyle === "short") {
    canvas.rect(x + 1, y - 1, width - 2, 4, hair.base);
    canvas.rect(x, y + 2, 2, 4, hair.base);
    canvas.rect(x + width - 2, y + 2, 2, 3, hair.base);
    canvas.rect(x + 3, y, Math.max(2, width - 7), 1, hair.highlight);
    canvas.set(x + width - 4, y + 3, hair.highlight);
    return;
  }
  if (appearance.hairStyle === "parted") {
    canvas.rect(x + 1, y - 1, width - 2, 4, hair.base);
    canvas.line(x, y + 2, x + 5, y + 6, hair.base);
    canvas.line(x + width - 1, y + 2, x + width - 6, y + 5, hair.base);
    canvas.line(x + 2, y, x + Math.floor(width / 2) - 1, y + 1, hair.highlight);
    canvas.rect(x + Math.floor(width / 2), y - 1, 2, 2, "skinLight");
    return;
  }
  if (appearance.hairStyle === "curly") {
    for (let column = x; column < x + width; column += 3) {
      const lift = (column - x) % 2;
      canvas.ellipse(column + 1, y - 1 - lift, 2, 2, hair.base);
      canvas.set(column + 1, y - 2 - lift, hair.highlight);
    }
    canvas.rect(x - 1, y + 1, 3, 6, hair.base);
    canvas.rect(x + width - 2, y + 1, 3, 6, hair.base);
    return;
  }
  if (appearance.hairStyle === "bun") {
    canvas.rect(x + 1, y - 1, width - 2, 4, hair.base);
    canvas.rect(x, y + 2, 2, 5, hair.base);
    canvas.ellipse(x + width - 1, y - 3, 4, 3, hair.base);
    canvas.rect(x + width - 1, y - 4, 2, 2, hair.highlight);
  }
}

function drawFeminineFrontHair(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
  x: number,
  y: number,
  width: number,
): void {
  const hair = hairColors(appearance);
  const variant = numericHeadVariant(appearance) - 10;
  if (isFeminineBareScalp(appearance)) {
    const skin = skinColors(appearance);
    canvas.rect(x + 2, y + 1, width - 4, 1, skin.highlight);
    canvas.set(x + width - 3, y + 2, skin.shadow);
    return;
  }
  switch (variant) {
    case 0: // Shoulder-length waves.
      canvas.rect(x + 1, y - 2, width - 2, 5, hair.base);
      canvas.rect(x - 1, y + 1, 3, 12, hair.base);
      canvas.rect(x + width - 2, y + 1, 3, 12, hair.base);
      canvas.line(x + 1, y + 8, x - 1, y + 12, hair.highlight);
      canvas.line(x + width - 2, y + 7, x + width, y + 11, hair.highlight);
      canvas.rect(x + 3, y - 1, width - 7, 1, hair.highlight);
      break;
    case 1: // Sculpted bob and fringe.
      canvas.rect(x, y - 2, width, 5, hair.base);
      canvas.rect(x - 1, y + 2, 3, 10, hair.base);
      canvas.rect(x + width - 2, y + 2, 3, 10, hair.base);
      canvas.rect(x + 1, y + 2, width - 2, 2, hair.base);
      canvas.rect(x + 2, y - 1, width - 4, 1, hair.highlight);
      canvas.set(x - 1, y + 11, hair.highlight);
      canvas.set(x + width, y + 11, hair.highlight);
      break;
    case 2: // High ponytail.
      canvas.rect(x + 1, y - 2, width - 2, 5, hair.base);
      canvas.line(x, y + 1, x + 4, y + 5, hair.base);
      canvas.ellipse(x + width, y, 3, 3, hair.base);
      canvas.line(x + width + 1, y + 2, x + width + 2, y + 10, hair.base);
      canvas.line(x + width, y + 3, x + width - 1, y + 11, hair.highlight);
      canvas.rect(x + 3, y - 1, 4, 1, hair.highlight);
      break;
    case 3: // Twin braids.
      canvas.rect(x + 1, y - 2, width - 2, 5, hair.base);
      canvas.rect(x - 1, y + 1, 3, 5, hair.base);
      canvas.rect(x + width - 2, y + 1, 3, 5, hair.base);
      for (let braidY = y + 6; braidY <= y + 14; braidY += 3) {
        canvas.rect(x - (braidY % 2), braidY, 2, 2, hair.base);
        canvas.rect(
          x + width - 1 + (braidY % 2),
          braidY,
          2,
          2,
          hair.base,
        );
      }
      canvas.rect(x + 3, y - 1, width - 6, 1, hair.highlight);
      break;
    case 4: // Asymmetric pixie.
      canvas.rect(x + 1, y - 2, width - 2, 4, hair.base);
      canvas.line(x, y, x + 7, y + 4, hair.base);
      canvas.rect(x - 1, y + 2, 3, 4, hair.base);
      canvas.rect(x + width - 2, y + 1, 2, 2, hair.base);
      canvas.line(x + 2, y - 1, x + width - 2, y + 1, hair.highlight);
      break;
    case 5: // Long curls.
      for (let curlX = x - 1; curlX <= x + width; curlX += 3) {
        canvas.ellipse(curlX + 1, y - 1 - (curlX % 2), 2, 2, hair.base);
        canvas.set(curlX + 1, y - 2 - (curlX % 2), hair.highlight);
      }
      for (let curlY = y + 2; curlY <= y + 14; curlY += 3) {
        canvas.ellipse(x - 1, curlY, 2, 2, hair.base);
        canvas.ellipse(x + width, curlY, 2, 2, hair.base);
      }
      break;
    case 6: // Side part and low ponytail.
      canvas.rect(x + 1, y - 2, width - 2, 5, hair.base);
      canvas.line(x, y + 1, x + 6, y + 5, hair.base);
      canvas.rect(x - 1, y + 2, 3, 8, hair.base);
      canvas.ellipse(x + width, y + 9, 3, 4, hair.base);
      canvas.rect(x + width, y + 7, 2, 7, hair.base);
      canvas.line(x + 3, y - 1, x + 7, y, hair.highlight);
      break;
    case 7: // Loc bun.
      canvas.rect(x + 1, y - 1, width - 2, 4, hair.base);
      canvas.ellipse(x + Math.floor(width / 2), y - 5, 4, 3, hair.base);
      canvas.rect(x + 2, y - 6, width - 4, 2, hair.highlight);
      for (let locX = x; locX <= x + width; locX += 3) {
        canvas.rect(locX, y + 2, 2, 8 + (locX % 2), hair.base);
        canvas.set(locX, y + 5, hair.highlight);
      }
      break;
    case 8: // Braided crown.
      canvas.rect(x + 1, y - 1, width - 2, 5, hair.base);
      for (let crownX = x; crownX < x + width; crownX += 3) {
        canvas.rect(crownX, y - 2 + (crownX % 2), 3, 2, hair.highlight);
      }
      canvas.rect(x - 1, y + 2, 3, 8, hair.base);
      canvas.rect(x + width - 2, y + 2, 3, 8, hair.base);
      canvas.set(x + 1, y + 10, hair.highlight);
      canvas.set(x + width - 2, y + 10, hair.highlight);
      break;
    default: // Wrapped hair.
      canvas.rect(x, y - 2, width, 7, "paper");
      canvas.rect(x + 2, y - 4, width - 4, 3, "lightSage");
      canvas.line(x + 1, y, x + width - 2, y + 3, "moss");
      canvas.rect(x - 1, y + 3, 3, 5, "paper");
      canvas.rect(x + width - 2, y + 3, 3, 5, "lightSage");
      canvas.set(x + width, y + 7, "moss");
      break;
  }
}

function drawFeminineFrontHead(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
): void {
  const skin = skinColors(appearance);
  const headX = 7;
  const headTop = 5;
  const headWidth = 10;
  const headHeight = 13;
  drawRoundedFace(
    canvas,
    headX,
    headTop,
    headWidth,
    headHeight,
    skin.base,
    skin.highlight,
    skin.shadow,
  );
  canvas.rect(headX - 1, headTop + 6, 1, 3, skin.base);
  canvas.rect(headX + headWidth, headTop + 6, 1, 3, skin.shadow);
  drawFeminineFrontHair(
    canvas,
    appearance,
    headX,
    headTop,
    headWidth,
  );
  const eyeY = headTop + 7;
  drawPixelEye(canvas, headX + 2, eyeY);
  drawPixelEye(canvas, headX + 6, eyeY);
  canvas.set(headX + 1, eyeY - 1, "ink");
  canvas.set(headX + 8, eyeY - 1, "ink");
  canvas.set(12, eyeY + 2, skin.shadow);
  canvas.rect(10, headTop + 11, 4, 1, "deepOlive");
  if ((numericHeadVariant(appearance) - 10) % 3 === 1) {
    canvas.set(9, headTop + 10, skin.shadow);
    canvas.set(14, headTop + 10, skin.shadow);
  }
  if (appearance.accessory === "glasses") {
    canvas.outlineRect(headX + 1, eyeY - 1, 4, 3, "paper");
    canvas.outlineRect(headX + 5, eyeY - 1, 4, 3, "paper");
    canvas.rect(headX + 5, eyeY, 1, 1, "ink");
  }
}

function drawFeminineSideHead(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
): void {
  const skin = skinColors(appearance);
  const hair = hairColors(appearance);
  const variant = numericHeadVariant(appearance) - 10;
  drawRoundedFace(canvas, 8, 5, 10, 13, skin.base, skin.highlight, skin.shadow);
  canvas.rect(17, 11, 3, 3, skin.shadow);
  drawPixelEye(canvas, 15, 11);
  canvas.set(19, 14, skin.shadow);
  canvas.rect(16, 16, 3, 1, "deepOlive");
  if (variant === 4) {
    canvas.rect(8, 4, 8, 1, skin.highlight);
  } else if (variant === 9) {
    canvas.rect(8, 3, 10, 6, "paper");
    canvas.line(9, 4, 17, 7, "moss");
  } else {
    canvas.rect(8, 3, 9, 5, hair.base);
    canvas.rect(7, 6, 3, variant === 4 ? 5 : 11, hair.base);
    canvas.rect(10, 4, 4, 1, hair.highlight);
  }
  if (variant === 0 || variant === 1 || variant === 5) {
    canvas.rect(7, 11, 3, 8, hair.base);
    canvas.set(7, 16, hair.highlight);
  } else if (variant === 2) {
    canvas.ellipse(7, 5, 3, 3, hair.base);
    canvas.line(6, 7, 5, 15, hair.base);
  } else if (variant === 3) {
    for (let braidY = 10; braidY <= 19; braidY += 3) {
      canvas.rect(6 + (braidY % 2), braidY, 2, 2, hair.base);
    }
  } else if (variant === 6) {
    canvas.ellipse(7, 13, 3, 4, hair.base);
  } else if (variant === 7) {
    canvas.ellipse(9, 1, 4, 3, hair.base);
    canvas.rect(6, 9, 3, 9, hair.base);
  } else if (variant === 8) {
    canvas.rect(7, 4, 10, 3, hair.highlight);
    canvas.rect(7, 8, 3, 8, hair.base);
  }
}

function drawFeminineBackHead(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
): void {
  const skin = skinColors(appearance);
  const hair = hairColors(appearance);
  const variant = numericHeadVariant(appearance) - 10;
  drawRoundedFace(canvas, 7, 5, 10, 13, skin.base, skin.highlight, skin.shadow);
  if (variant === 4) {
    canvas.rect(8, 4, 8, 1, skin.highlight);
    canvas.rect(9, 5, 6, 1, skin.base);
    return;
  }
  if (variant === 9) {
    canvas.rect(7, 3, 10, 8, "paper");
    canvas.line(8, 4, 16, 8, "moss");
    canvas.rect(9, 10, 6, 5, "lightSage");
    return;
  }
  canvas.rect(7, 3, 10, 7, hair.base);
  canvas.rect(8, 4, 7, 1, hair.highlight);
  if (variant === 0 || variant === 1 || variant === 5) {
    canvas.rect(6, 8, 12, variant === 1 ? 8 : 12, hair.base);
    canvas.line(8, 10, 7, 18, hair.highlight);
    canvas.line(15, 10, 16, 18, hair.highlight);
  } else if (variant === 2) {
    canvas.ellipse(17, 5, 3, 3, hair.base);
    canvas.rect(17, 7, 3, 10, hair.base);
    canvas.set(18, 11, hair.highlight);
  } else if (variant === 3) {
    canvas.rect(6, 8, 3, 5, hair.base);
    canvas.rect(15, 8, 3, 5, hair.base);
    for (let braidY = 13; braidY <= 20; braidY += 3) {
      canvas.rect(6 + (braidY % 2), braidY, 2, 2, hair.base);
      canvas.rect(16 - (braidY % 2), braidY, 2, 2, hair.base);
    }
  } else if (variant === 4) {
    canvas.rect(7, 8, 10, 4, hair.base);
    canvas.line(8, 8, 15, 10, hair.highlight);
  } else if (variant === 6) {
    canvas.rect(7, 8, 10, 4, hair.base);
    canvas.ellipse(17, 13, 3, 4, hair.base);
  } else if (variant === 7) {
    canvas.ellipse(12, 1, 4, 3, hair.base);
    for (let x = 6; x <= 16; x += 3) {
      canvas.rect(x, 8, 2, 10, hair.base);
      canvas.set(x, 12, hair.highlight);
    }
  } else {
    canvas.rect(6, 5, 12, 4, hair.base);
    for (let crownX = 7; crownX < 17; crownX += 3) {
      canvas.rect(crownX, 3 + (crownX % 2), 3, 2, hair.highlight);
    }
    canvas.rect(7, 9, 10, 7, hair.base);
  }
}

function drawNonhumanFrontHead(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
): void {
  const variant = numericHeadVariant(appearance) - 20;
  const hair = hairColors(appearance);
  switch (variant) {
    case 0: // Cat.
      canvas.line(6, 7, 7, 1, "ink");
      canvas.line(7, 1, 11, 5, "ink");
      canvas.line(17, 7, 16, 1, "ink");
      canvas.line(16, 1, 13, 5, "ink");
      canvas.rect(6, 5, 12, 12, "ink");
      canvas.rect(7, 6, 10, 10, hair.base);
      canvas.set(8, 3, hair.highlight);
      canvas.set(15, 3, hair.highlight);
      drawPixelEye(canvas, 8, 10);
      drawPixelEye(canvas, 14, 10);
      canvas.set(11, 13, "ink");
      canvas.set(12, 13, "ink");
      canvas.line(5, 13, 9, 14, "ink");
      canvas.line(14, 14, 19, 13, "ink");
      canvas.set(9, 15, "paper");
      canvas.set(14, 15, "paper");
      break;
    case 1: // Penguin.
      canvas.ellipse(12, 9, 7, 9, "ink");
      canvas.ellipse(9, 10, 4, 6, "paper");
      canvas.ellipse(15, 10, 4, 6, "paper");
      drawPixelEye(canvas, 8, 9, false);
      drawPixelEye(canvas, 14, 9, false);
      canvas.line(10, 13, 12, 15, "moss");
      canvas.line(14, 13, 12, 15, "moss");
      canvas.rect(11, 14, 3, 2, "warmGray");
      break;
    case 2: // Fox.
      canvas.line(5, 8, 7, 1, "ink");
      canvas.line(7, 1, 11, 5, "ink");
      canvas.line(18, 8, 16, 1, "ink");
      canvas.line(16, 1, 13, 5, "ink");
      canvas.ellipse(12, 10, 7, 8, hair.base);
      canvas.ellipse(12, 14, 5, 4, "paper");
      drawPixelEye(canvas, 8, 9);
      drawPixelEye(canvas, 14, 9);
      canvas.rect(11, 13, 3, 2, "ink");
      canvas.set(12, 16, "deepOlive");
      canvas.line(7, 5, 9, 3, hair.highlight);
      canvas.line(17, 5, 15, 3, hair.highlight);
      break;
    case 3: // Rabbit.
      canvas.outlineRect(7, 0, 4, 9, "paper");
      canvas.outlineRect(14, 0, 4, 9, "paper");
      canvas.rect(8, 2, 2, 5, "lightSage");
      canvas.rect(15, 2, 2, 5, "lightSage");
      canvas.ellipse(12, 12, 7, 7, "paper");
      drawPixelEye(canvas, 8, 11);
      drawPixelEye(canvas, 14, 11);
      canvas.set(11, 14, "moss");
      canvas.set(12, 15, "ink");
      canvas.rect(10, 16, 2, 2, "highlight");
      canvas.rect(13, 16, 2, 2, "highlight");
      break;
    case 4: // Owl.
      canvas.ellipse(12, 10, 8, 9, "ink");
      canvas.ellipse(12, 11, 7, 8, hair.base);
      canvas.ellipse(8, 10, 4, 4, "paper");
      canvas.ellipse(16, 10, 4, 4, "paper");
      drawPixelEye(canvas, 7, 9);
      drawPixelEye(canvas, 15, 9);
      canvas.line(10, 13, 12, 16, "moss");
      canvas.line(14, 13, 12, 16, "moss");
      canvas.rect(11, 15, 3, 2, "warmGray");
      canvas.line(6, 4, 9, 2, hair.highlight);
      canvas.line(18, 4, 15, 2, hair.highlight);
      break;
    case 5: // Frog.
      canvas.ellipse(12, 11, 8, 7, "sage");
      canvas.ellipse(7, 5, 4, 4, "ink");
      canvas.ellipse(17, 5, 4, 4, "ink");
      canvas.ellipse(7, 5, 3, 3, "lightSage");
      canvas.ellipse(17, 5, 3, 3, "lightSage");
      drawPixelEye(canvas, 6, 4);
      drawPixelEye(canvas, 16, 4);
      canvas.set(9, 11, "deepOlive");
      canvas.set(15, 11, "deepOlive");
      canvas.line(8, 14, 12, 16, "ink");
      canvas.line(12, 16, 16, 14, "ink");
      break;
    case 6: // Grey alien.
      canvas.ellipse(12, 9, 8, 9, "lightSage");
      canvas.line(6, 11, 9, 17, "lightSage");
      canvas.line(18, 11, 15, 17, "lightSage");
      canvas.ellipse(8, 9, 3, 4, "ink");
      canvas.ellipse(16, 9, 3, 4, "ink");
      canvas.set(8, 8, "highlight");
      canvas.set(16, 8, "highlight");
      canvas.set(12, 13, "moss");
      canvas.rect(10, 16, 4, 1, "deepOlive");
      break;
    case 7: // Antenna alien.
      canvas.line(9, 5, 7, 0, "deepOlive");
      canvas.line(15, 5, 18, 0, "deepOlive");
      canvas.ellipse(7, 0, 2, 2, "lightSage");
      canvas.ellipse(18, 0, 2, 2, "lightSage");
      canvas.ellipse(12, 10, 7, 8, "sage");
      drawPixelEye(canvas, 7, 9);
      drawPixelEye(canvas, 15, 9);
      drawPixelEye(canvas, 11, 6);
      canvas.rect(9, 14, 6, 1, "deepOlive");
      canvas.set(10, 15, "lightSage");
      canvas.set(13, 15, "lightSage");
      break;
    case 8: // Robot.
      canvas.outlineRect(6, 4, 12, 14, "warmGray");
      canvas.line(12, 4, 12, 0, "ink");
      canvas.ellipse(12, 0, 2, 2, "moss");
      canvas.rect(8, 7, 8, 5, "charcoal");
      canvas.rect(9, 8, 2, 2, "highlight");
      canvas.rect(14, 8, 2, 2, "highlight");
      canvas.rect(8, 14, 8, 2, "deepOlive");
      canvas.set(9, 14, "lightSage");
      canvas.set(12, 14, "lightSage");
      canvas.set(15, 14, "lightSage");
      canvas.rect(4, 8, 2, 5, "moss");
      canvas.rect(18, 8, 2, 5, "moss");
      break;
    default: // Axolotl.
      canvas.ellipse(12, 10, 7, 7, "paper");
      for (let gillY = 5; gillY <= 13; gillY += 4) {
        canvas.line(6, gillY + 2, 2, gillY, "moss");
        canvas.line(18, gillY + 2, 22, gillY, "moss");
        canvas.set(1, gillY, "lightSage");
        canvas.set(22, gillY, "lightSage");
      }
      drawPixelEye(canvas, 8, 9);
      drawPixelEye(canvas, 14, 9);
      canvas.set(9, 14, "moss");
      canvas.set(15, 14, "moss");
      canvas.rect(10, 15, 4, 1, "deepOlive");
      break;
  }
}

function drawNonhumanSideHead(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
): void {
  const variant = numericHeadVariant(appearance) - 20;
  const hair = hairColors(appearance);
  if (variant === 1) {
    canvas.ellipse(13, 9, 7, 9, "ink");
    canvas.ellipse(16, 10, 4, 6, "paper");
    drawPixelEye(canvas, 15, 8, false);
    canvas.line(19, 12, 22, 14, "moss");
    canvas.line(22, 14, 19, 15, "moss");
    return;
  }
  if (variant === 3) {
    canvas.outlineRect(10, 0, 4, 10, "paper");
    canvas.ellipse(14, 12, 7, 7, "paper");
    drawPixelEye(canvas, 16, 10);
    canvas.set(20, 13, "moss");
    return;
  }
  if (variant === 5) {
    canvas.ellipse(13, 11, 8, 7, "sage");
    canvas.ellipse(17, 5, 4, 4, "lightSage");
    drawPixelEye(canvas, 17, 4);
    canvas.set(20, 11, "deepOlive");
    canvas.rect(17, 15, 4, 1, "ink");
    return;
  }
  if (variant === 8) {
    canvas.outlineRect(7, 4, 12, 14, "warmGray");
    canvas.line(13, 4, 13, 0, "ink");
    canvas.ellipse(13, 0, 2, 2, "moss");
    canvas.rect(16, 8, 5, 4, "charcoal");
    canvas.set(18, 9, "highlight");
    canvas.rect(19, 13, 3, 2, "deepOlive");
    return;
  }
  if (variant === 9) {
    canvas.ellipse(13, 10, 7, 7, "paper");
    for (let gillY = 5; gillY <= 13; gillY += 4) {
      canvas.line(8, gillY + 2, 4, gillY, "moss");
    }
    drawPixelEye(canvas, 16, 9);
    canvas.set(20, 13, "moss");
    return;
  }
  const base =
    variant === 4
      ? hair.base
      : variant === 6
        ? "lightSage"
        : variant === 7
          ? "sage"
          : hair.base;
  canvas.ellipse(13, 10, 7, 8, base);
  if (variant === 0 || variant === 2) {
    canvas.line(8, 6, 10, 0, "ink");
    canvas.line(10, 0, 14, 5, "ink");
    canvas.rect(18, 12, 4, 3, variant === 2 ? "paper" : base);
    drawPixelEye(canvas, 16, 9);
    canvas.set(21, 13, "ink");
  } else if (variant === 4) {
    canvas.ellipse(16, 9, 4, 4, "paper");
    drawPixelEye(canvas, 16, 8);
    canvas.line(19, 12, 22, 14, "moss");
  } else if (variant === 6) {
    canvas.ellipse(16, 9, 3, 4, "ink");
    canvas.set(16, 8, "highlight");
    canvas.line(18, 13, 20, 14, "deepOlive");
  } else {
    canvas.line(11, 4, 9, 0, "deepOlive");
    canvas.ellipse(9, 0, 2, 2, "lightSage");
    drawPixelEye(canvas, 16, 9);
    canvas.set(20, 13, "deepOlive");
  }
}

function drawNonhumanBackHead(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
): void {
  const variant = numericHeadVariant(appearance) - 20;
  const hair = hairColors(appearance);
  if (variant === 8) {
    canvas.outlineRect(6, 4, 12, 14, "warmGray");
    canvas.line(12, 4, 12, 0, "ink");
    canvas.ellipse(12, 0, 2, 2, "moss");
    canvas.rect(8, 7, 8, 7, "deepOlive");
    canvas.rect(9, 8, 6, 1, "lightSage");
    canvas.rect(5, 8, 1, 5, "moss");
    canvas.rect(18, 8, 1, 5, "moss");
    return;
  }
  if (variant === 3) {
    canvas.outlineRect(7, 0, 4, 9, "paper");
    canvas.outlineRect(14, 0, 4, 9, "paper");
    canvas.ellipse(12, 12, 7, 7, "paper");
    canvas.rect(8, 8, 9, 6, "lightSage");
    return;
  }
  if (variant === 9) {
    canvas.ellipse(12, 10, 7, 7, "paper");
    for (let gillY = 5; gillY <= 13; gillY += 4) {
      canvas.line(6, gillY + 2, 2, gillY, "moss");
      canvas.line(18, gillY + 2, 22, gillY, "moss");
    }
    canvas.rect(9, 7, 7, 1, "lightSage");
    return;
  }
  const base =
    variant === 5 || variant === 7
      ? "sage"
      : variant === 6
        ? "lightSage"
        : variant === 1
          ? "ink"
          : hair.base;
  canvas.ellipse(12, 10, 7, 8, base);
  canvas.rect(8, 6, 9, 1, variant === 1 ? "charcoal" : hair.highlight);
  if (variant === 0 || variant === 2) {
    canvas.line(6, 7, 7, 1, "ink");
    canvas.line(7, 1, 11, 5, "ink");
    canvas.line(18, 7, 16, 1, "ink");
    canvas.line(16, 1, 13, 5, "ink");
  } else if (variant === 4) {
    canvas.line(6, 4, 9, 2, hair.highlight);
    canvas.line(18, 4, 15, 2, hair.highlight);
    canvas.rect(7, 13, 10, 3, "paper");
  } else if (variant === 5) {
    canvas.ellipse(7, 5, 4, 4, "lightSage");
    canvas.ellipse(17, 5, 4, 4, "lightSage");
  } else if (variant === 7) {
    canvas.line(9, 5, 7, 0, "deepOlive");
    canvas.line(15, 5, 18, 0, "deepOlive");
    canvas.ellipse(7, 0, 2, 2, "lightSage");
    canvas.ellipse(18, 0, 2, 2, "lightSage");
  }
}

function drawFrontHead(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
): void {
  if (isNonhumanHead(appearance)) {
    drawNonhumanFrontHead(canvas, appearance);
    return;
  }
  if (isFeminineHead(appearance)) {
    drawFeminineFrontHead(canvas, appearance);
    return;
  }
  const skin = skinColors(appearance);
  const headTop = appearance.faceStyle === "long" ? 4 : 5;
  const headHeight = appearance.faceStyle === "long" ? 14 : 13;
  const headWidth =
    appearance.faceStyle === "square"
      ? 12
      : appearance.faceStyle === "round"
        ? 11
        : 10;
  const headX = Math.floor((MAP_WIDTH - headWidth) / 2);
  drawRoundedFace(
    canvas,
    headX,
    headTop,
    headWidth,
    headHeight,
    skin.base,
    skin.highlight,
    skin.shadow,
  );
  canvas.rect(headX - 1, headTop + 5, 1, 3, skin.base);
  canvas.rect(headX + headWidth, headTop + 5, 1, 3, skin.shadow);
  drawFrontHair(canvas, appearance, headX, headTop, headWidth);

  const eyeY = headTop + 7;
  const leftEye = headX + 3;
  const rightEye = headX + headWidth - 4;
  canvas.rect(leftEye, eyeY, 2, 1, "ink");
  canvas.rect(rightEye, eyeY, 2, 1, "ink");
  canvas.set(leftEye, eyeY, "highlight");
  canvas.set(rightEye, eyeY, "highlight");

  if (appearance.headVariant % 3 === 1) {
    canvas.rect(leftEye - 1, eyeY - 2, 3, 1, "deepOlive");
    canvas.rect(rightEye, eyeY - 2, 3, 1, "deepOlive");
  } else if (appearance.headVariant % 3 === 2) {
    canvas.line(leftEye - 1, eyeY - 1, leftEye + 1, eyeY - 2, "deepOlive");
    canvas.line(rightEye, eyeY - 2, rightEye + 2, eyeY - 1, "deepOlive");
  }

  const centerX = Math.floor(MAP_WIDTH / 2);
  canvas.line(centerX, eyeY + 1, centerX - 1, eyeY + 2, skin.shadow);
  canvas.set(centerX, eyeY + 2, "skinDark");
  canvas.rect(centerX - 2, headTop + headHeight - 2, 4, 1, "deepOlive");
  canvas.set(centerX - 3, eyeY + 2, skin.highlight);
  canvas.set(centerX + 3, eyeY + 2, skin.shadow);

  const mouthY = headTop + headHeight - 2;
  switch (appearance.headVariant) {
    case 3:
      canvas.set(headX + 2, eyeY + 2, "skinDark");
      canvas.set(headX + headWidth - 3, eyeY + 2, "skinDark");
      canvas.set(centerX - 3, eyeY + 3, "skinDark");
      break;
    case 4:
      canvas.set(headX + 2, eyeY + 3, "skinDark");
      canvas.set(centerX + 3, eyeY + 2, "skinDark");
      break;
    case 5:
      canvas.rect(centerX - 3, mouthY - 2, 3, 1, "ink");
      canvas.rect(centerX, mouthY - 2, 3, 1, "ink");
      canvas.set(centerX - 1, mouthY - 1, "deepOlive");
      break;
    case 6:
      canvas.rect(centerX - 2, mouthY, 4, 1, "ink");
      canvas.rect(centerX - 1, mouthY + 1, 2, 1, "deepOlive");
      break;
    case 7:
      canvas.rect(headX + 1, eyeY + 1, 1, 4, "deepOlive");
      canvas.rect(headX + headWidth - 2, eyeY + 1, 1, 4, "deepOlive");
      canvas.rect(centerX - 3, mouthY, 6, 1, skin.shadow);
      break;
    case 8:
      canvas.set(headX - 1, eyeY + 3, "highlight");
      canvas.set(headX + headWidth, eyeY + 3, "highlight");
      canvas.set(centerX - 4, mouthY - 2, skin.shadow);
      break;
    case 9:
      canvas.rect(headX + 1, mouthY - 2, 1, 3, "deepOlive");
      canvas.rect(headX + headWidth - 2, mouthY - 2, 1, 3, "deepOlive");
      canvas.rect(centerX - 3, mouthY, 6, 1, "deepOlive");
      canvas.rect(centerX - 1, mouthY + 1, 2, 1, "ink");
      break;
  }

  if (appearance.accessory === "glasses") {
    canvas.outlineRect(leftEye - 1, eyeY - 1, 5, 3, "paper");
    canvas.outlineRect(rightEye - 1, eyeY - 1, 5, 3, "paper");
    canvas.rect(leftEye + 4, eyeY, Math.max(1, rightEye - leftEye - 5), 1, "ink");
  } else if (appearance.accessory === "headband") {
    canvas.rect(headX, headTop + 3, headWidth, 2, "paper");
    canvas.rect(headX + 2, headTop + 3, headWidth - 4, 1, "highlight");
  }
}

function drawExtendedFounderDetails(
  canvas: PixelCanvas,
  torsoTop: number,
  bodyLeft: number,
  bodyRight: number,
): void {
  canvas.line(bodyLeft + 2, torsoTop + 1, 11, torsoTop + 5, "deepOlive");
  canvas.line(bodyRight - 2, torsoTop + 1, 13, torsoTop + 5, "deepOlive");
  canvas.ellipse(12, torsoTop + 6, 1, 1, "ink");
  canvas.outlineRect(bodyRight - 3, torsoTop + 3, 3, 3, "paper");
  canvas.set(bodyRight - 2, torsoTop + 4, "moss");
}

function drawFeminineFrontBody(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
  pose: CharacterPose,
): void {
  const skin = skinColors(appearance);
  const { primary, secondary, trim, highlight } = outfitColors(appearance);
  const variant = numericBodyVariant(appearance) - 10;
  const top = 18;
  const left = variant === 1 || variant === 8 ? 7 : 6;
  const right = variant === 1 || variant === 8 ? 17 : 18;
  const width = right - left;

  canvas.rect(10, 16, 4, 4, skin.base);
  canvas.rect(left + 1, top, width - 2, 2, "ink");
  canvas.rect(left, top + 2, width, 5, "ink");
  canvas.rect(left + 1, top + 1, width - 2, 6, primary);
  canvas.rect(left + 2, top + 2, width - 4, 1, highlight);
  canvas.rect(left + 2, top + 6, width - 4, 3, "ink");
  canvas.rect(left + 3, top + 6, width - 6, 2, secondary);

  // Each option changes the garment rather than adding a tiny generic mark.
  switch (variant) {
    case 0: // Fitted blazer.
      canvas.line(left + 2, top + 1, 11, top + 6, trim);
      canvas.line(right - 3, top + 1, 13, top + 6, trim);
      canvas.rect(11, top + 4, 2, 4, "paper");
      canvas.set(12, top + 5, "ink");
      break;
    case 1: // Tailored scrubs.
      canvas.line(9, top + 1, 12, top + 4, secondary);
      canvas.line(15, top + 1, 12, top + 4, secondary);
      canvas.outlineRect(14, top + 4, 3, 3, trim);
      canvas.rect(8, top + 7, 9, 1, highlight);
      break;
    case 2: // Cardigan and blouse.
      canvas.rect(left + 2, top + 1, 3, 7, secondary);
      canvas.rect(right - 5, top + 1, 3, 7, secondary);
      canvas.rect(11, top + 1, 3, 7, "paper");
      canvas.set(12, top + 3, "moss");
      canvas.set(12, top + 6, "moss");
      break;
    case 3: // Belted lab coat.
      canvas.line(left + 2, top + 1, 11, top + 5, "paper");
      canvas.line(right - 3, top + 1, 13, top + 5, "paper");
      canvas.rect(left + 1, top + 6, width - 2, 2, secondary);
      canvas.rect(11, top + 1, 2, 7, "cream");
      canvas.set(12, top + 6, "ink");
      break;
    case 4: // Collared dress.
      canvas.line(9, top + 1, 12, top + 4, trim);
      canvas.line(15, top + 1, 12, top + 4, trim);
      canvas.line(left + 2, top + 7, left, top + 11, primary);
      canvas.line(right - 3, top + 7, right - 1, top + 11, primary);
      canvas.rect(left, top + 10, width, 2, "ink");
      canvas.rect(left + 1, top + 9, width - 2, 2, primary);
      break;
    case 5: // Wrap blouse.
      canvas.line(left + 2, top + 1, right - 3, top + 6, secondary);
      canvas.line(right - 3, top + 1, 12, top + 5, trim);
      canvas.rect(left + 2, top + 6, width - 4, 1, highlight);
      break;
    case 6: // Sweater and skirt.
      canvas.rect(left + 2, top + 2, width - 4, 2, trim);
      canvas.line(left + 2, top + 7, left, top + 11, secondary);
      canvas.line(right - 3, top + 7, right - 1, top + 11, secondary);
      canvas.rect(left, top + 10, width, 2, "ink");
      canvas.rect(left + 1, top + 9, width - 2, 2, secondary);
      break;
    case 7: // Vest and blouse.
      canvas.rect(left + 2, top + 1, 3, 7, secondary);
      canvas.rect(right - 5, top + 1, 3, 7, secondary);
      canvas.line(left + 4, top + 1, 12, top + 5, trim);
      canvas.line(right - 5, top + 1, 12, top + 5, trim);
      canvas.rect(11, top + 5, 2, 3, "paper");
      break;
    case 8: // Long clinical tunic.
      canvas.line(8, top + 2, 12, top + 5, trim);
      canvas.rect(8, top + 7, 9, 3, primary);
      canvas.rect(9, top + 9, 7, 1, highlight);
      canvas.outlineRect(14, top + 4, 3, 3, secondary);
      break;
    default: // Blouse and long skirt.
      canvas.rect(left + 2, top + 1, width - 4, 2, "paper");
      canvas.line(9, top + 1, 12, top + 4, trim);
      canvas.line(15, top + 1, 12, top + 4, trim);
      canvas.line(left + 2, top + 7, left, 33, secondary);
      canvas.line(right - 3, top + 7, right - 1, 33, secondary);
      canvas.rect(left, 31, width, 3, "ink");
      canvas.rect(left + 1, 30, width - 2, 3, secondary);
      break;
  }

  if (appearance.roleStyle === "founder") {
    drawExtendedFounderDetails(canvas, top, left, right);
  }

  if (pose === "star-jump") {
    canvas.line(left, top + 3, 3, 13, "ink");
    canvas.line(left + 1, top + 3, 4, 13, primary);
    canvas.rect(1, 11, 3, 2, skin.base);
    canvas.line(right - 1, top + 3, 20, 13, "ink");
    canvas.line(right - 2, top + 3, 19, 13, primary);
    canvas.rect(20, 11, 3, 2, skin.base);
    canvas.line(10, 27, 4, 34, secondary);
    canvas.line(14, 27, 20, 34, secondary);
    canvas.rect(2, 34, 5, 1, "ink");
    canvas.rect(18, 34, 5, 1, "ink");
    return;
  }

  const swing = pose === "walk-a" ? -1 : pose === "walk-b" ? 1 : 0;
  canvas.outlineRect(left - 3, top + 2 + swing, 4, 8, primary);
  canvas.rect(left - 2, top + 4 + swing, 1, 4, highlight);
  canvas.rect(left - 3, top + 9 + swing, 3, 2, skin.base);
  canvas.outlineRect(right - 1, top + 2 - swing, 4, 8, primary);
  canvas.rect(right + 1, top + 4 - swing, 1, 4, secondary);
  canvas.rect(right, top + 9 - swing, 3, 2, skin.shadow);

  if (variant !== 4 && variant !== 6 && variant !== 9) {
    const leftShift = pose === "walk-a" ? -1 : pose === "walk-b" ? 1 : 0;
    canvas.outlineRect(8 + leftShift, 27, 4, 7, secondary);
    canvas.outlineRect(13 - leftShift, 27, 4, 7, secondary);
  }
  canvas.rect(6 + (pose === "walk-a" ? -1 : 0), 34, 6, 1, "ink");
  canvas.rect(13 + (pose === "walk-b" ? 1 : 0), 34, 6, 1, "ink");
}

function drawNonhumanFrontBody(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
  pose: CharacterPose,
): void {
  const { primary, secondary, trim, highlight } = outfitColors(appearance);
  const variant = numericBodyVariant(appearance) - 20;
  const jumping = pose === "star-jump";
  const stride = pose === "walk-a" ? -1 : pose === "walk-b" ? 1 : 0;
  const top = 18;

  if (variant === 1) {
    // Penguin body: tuxedo plumage and flippers.
    canvas.ellipse(12, 25, 7, 9, "ink");
    canvas.ellipse(12, 26, 4, 7, "paper");
    canvas.rect(11, 19, 3, 2, "paper");
    canvas.line(7, 21, jumping ? 2 : 5, jumping ? 13 : 28, "ink");
    canvas.line(17, 21, jumping ? 22 : 19, jumping ? 13 : 28, "ink");
    canvas.rect(jumping ? 2 : 6 + stride, 33, 6, 2, "moss");
    canvas.rect(jumping ? 17 : 13 - stride, 33, 6, 2, "moss");
  } else if (variant === 4) {
    // Owl body: layered breast feathers and wings.
    canvas.ellipse(12, 25, 7, 9, secondary);
    canvas.ellipse(12, 25, 4, 7, "paper");
    for (let featherY = 22; featherY <= 29; featherY += 3) {
      canvas.line(9, featherY, 12, featherY + 2, trim);
      canvas.line(15, featherY, 12, featherY + 2, trim);
    }
    canvas.line(7, 21, jumping ? 2 : 5, jumping ? 13 : 29, "ink");
    canvas.line(17, 21, jumping ? 22 : 19, jumping ? 13 : 29, "ink");
    canvas.rect(7 + stride, 33, 5, 2, "ink");
    canvas.rect(13 - stride, 33, 5, 2, "ink");
  } else if (variant === 5) {
    // Frog body: short jacket and splayed feet.
    canvas.outlineRect(7, 20, 10, 9, "sage");
    canvas.rect(9, 21, 6, 1, "lightSage");
    canvas.rect(11, 21, 2, 7, "paper");
    canvas.line(7, 22, jumping ? 2 : 5, jumping ? 13 : 28, "sage");
    canvas.line(17, 22, jumping ? 22 : 19, jumping ? 13 : 28, "sage");
    canvas.line(9, 28, jumping ? 3 : 6 + stride, 34, "sage");
    canvas.line(15, 28, jumping ? 21 : 18 - stride, 34, "sage");
    canvas.rect(jumping ? 1 : 4 + stride, 33, 7, 2, "ink");
    canvas.rect(jumping ? 17 : 14 - stride, 33, 7, 2, "ink");
  } else if (variant === 8) {
    // Robot chassis.
    canvas.outlineRect(6, 18, 12, 12, "warmGray");
    canvas.rect(8, 20, 8, 5, "charcoal");
    canvas.rect(9, 21, 2, 2, "highlight");
    canvas.rect(13, 21, 2, 2, "moss");
    canvas.rect(8, 27, 8, 2, "deepOlive");
    canvas.line(6, 21, jumping ? 2 : 3, jumping ? 13 : 28, "charcoal");
    canvas.line(18, 21, jumping ? 22 : 21, jumping ? 13 : 28, "charcoal");
    canvas.outlineRect(jumping ? 3 : 8 + stride, 29, 4, 5, "warmGray");
    canvas.outlineRect(jumping ? 17 : 13 - stride, 29, 4, 5, "warmGray");
    canvas.rect(jumping ? 2 : 7 + stride, 34, 6, 1, "ink");
    canvas.rect(jumping ? 16 : 12 - stride, 34, 6, 1, "ink");
  } else {
    const bodyColor =
      variant === 6
        ? "lightSage"
        : variant === 7
          ? "sage"
          : variant === 9
            ? "paper"
            : primary;
    const bodyLeft = variant === 6 ? 8 : 7;
    const bodyWidth = variant === 6 ? 8 : 10;
    canvas.outlineRect(bodyLeft, top, bodyWidth, 11, bodyColor);
    canvas.rect(bodyLeft + 2, top + 1, bodyWidth - 4, 1, highlight);
    canvas.rect(bodyLeft + 2, top + 7, bodyWidth - 4, 2, secondary);
    if (variant === 0) {
      // Cat tail and paw-print coat.
      canvas.line(17, 24, 21, 20, "ink");
      canvas.line(21, 20, 22, 27, "ink");
      canvas.line(22, 27, 19, 29, "ink");
      canvas.ellipse(12, 23, 2, 2, trim);
      canvas.set(10, 21, trim);
      canvas.set(14, 21, trim);
    } else if (variant === 2) {
      // Fox tail with pale tip.
      canvas.line(17, 23, 22, 20, "ink");
      canvas.rect(20, 21, 3, 8, secondary);
      canvas.rect(19, 27, 4, 3, "paper");
      canvas.rect(10, 20, 4, 2, "paper");
    } else if (variant === 3) {
      // Rabbit waistcoat and round tail.
      canvas.line(9, 19, 12, 23, trim);
      canvas.line(15, 19, 12, 23, trim);
      canvas.ellipse(19, 27, 3, 3, "paper");
      canvas.set(12, 25, "ink");
    } else if (variant === 6) {
      // Grey alien's narrow flight suit.
      canvas.line(9, 19, 12, 23, trim);
      canvas.line(15, 19, 12, 23, trim);
      canvas.rect(10, 24, 4, 2, "charcoal");
      canvas.set(12, 25, "highlight");
    } else if (variant === 7) {
      // Antenna alien's paneled suit.
      canvas.rect(9, 20, 6, 5, "deepOlive");
      canvas.rect(10, 21, 2, 2, "highlight");
      canvas.rect(13, 21, 1, 3, "lightSage");
      canvas.line(8, 27, 6, 31, "sage");
      canvas.line(16, 27, 18, 31, "sage");
    } else {
      // Axolotl aquatic coat and finned tail.
      canvas.rect(9, 20, 6, 2, "lightSage");
      canvas.rect(11, 22, 2, 7, "moss");
      canvas.line(17, 25, 22, 22, "paper");
      canvas.line(22, 22, 20, 31, "moss");
      canvas.line(20, 31, 17, 29, "paper");
    }

    const armLeft = jumping ? 2 : 4;
    const armRight = jumping ? 22 : 20;
    const armY = jumping ? 13 : 28;
    canvas.line(bodyLeft, top + 3, armLeft, armY, "ink");
    canvas.line(bodyLeft + 1, top + 3, armLeft + 1, armY, bodyColor);
    canvas.line(
      bodyLeft + bodyWidth,
      top + 3,
      armRight,
      armY,
      "ink",
    );
    canvas.line(
      bodyLeft + bodyWidth - 1,
      top + 3,
      armRight - 1,
      armY,
      bodyColor,
    );
    const leftFootX = jumping ? 3 : 7 + stride;
    const rightFootX = jumping ? 18 : 13 - stride;
    canvas.outlineRect(leftFootX, 29, 4, 5, secondary);
    canvas.outlineRect(rightFootX, 29, 4, 5, secondary);
    canvas.rect(leftFootX - 1, 34, 6, 1, "ink");
    canvas.rect(rightFootX - 1, 34, 6, 1, "ink");
  }

  if (appearance.roleStyle === "founder" && variant !== 8) {
    canvas.outlineRect(14, 21, 3, 3, "paper");
    canvas.set(15, 22, "moss");
  }
}

function drawFeminineSideBody(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
  pose: CharacterPose,
): void {
  const skin = skinColors(appearance);
  const { primary, secondary, trim, highlight } = outfitColors(appearance);
  const variant = numericBodyVariant(appearance) - 10;
  const top = 18;
  canvas.rect(11, 16, 4, 4, skin.base);
  canvas.outlineRect(8, top, 10, 11, primary);
  canvas.rect(9, top + 1, 7, 1, highlight);
  canvas.line(10, top + 1, 13, top + 4, trim);
  if (variant === 0) {
    canvas.rect(14, top + 2, 3, 7, secondary);
    canvas.line(11, top + 1, 15, top + 5, trim);
    canvas.set(14, top + 6, "paper");
  } else if (variant === 2) {
    canvas.rect(9, top + 2, 3, 7, secondary);
    canvas.rect(14, top + 2, 3, 7, secondary);
    canvas.rect(12, top + 2, 2, 7, "paper");
  } else if (variant === 7) {
    canvas.rect(14, top + 2, 3, 7, secondary);
  } else if (variant === 3) {
    canvas.rect(12, top + 1, 2, 9, "paper");
    canvas.rect(9, top + 7, 8, 2, secondary);
  } else if (variant === 4 || variant === 6 || variant === 9) {
    canvas.line(9, top + 8, 7, 32, secondary);
    canvas.line(17, top + 8, 19, 32, secondary);
    canvas.rect(7, 31, 12, 3, secondary);
  } else if (variant === 8) {
    canvas.rect(9, top + 7, 8, 3, primary);
  } else {
    canvas.line(9, top + 2, 17, top + 7, secondary);
  }
  // Neutral/idle must keep the static arm placement. Do not let the default
  // branch inherit either lateral stride extreme.
  const armX = pose === "walk-a" ? 6 : pose === "walk-b" ? 17 : 17;
  canvas.outlineRect(armX, top + 2, 4, 9, primary);
  canvas.rect(armX, top + 10, 3, 2, skin.shadow);
  const stride = pose === "walk-a" ? 2 : pose === "walk-b" ? -2 : 0;
  if (variant !== 4 && variant !== 6 && variant !== 9) {
    canvas.outlineRect(9 + stride, 28, 4, 6, secondary);
    canvas.outlineRect(13 - stride, 28, 4, 6, secondary);
  }
  canvas.rect(8 + stride, 34, 6, 1, "ink");
  canvas.rect(12 - stride, 34, 6, 1, "ink");
}

function drawNonhumanSideBody(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
  pose: CharacterPose,
): void {
  const { primary, secondary, highlight } = outfitColors(appearance);
  const variant = numericBodyVariant(appearance) - 20;
  const stride = pose === "walk-a" ? 2 : pose === "walk-b" ? -2 : 0;
  if (variant === 1 || variant === 4) {
    canvas.ellipse(13, 25, 7, 9, variant === 1 ? "ink" : secondary);
    canvas.ellipse(16, 26, 4, 7, "paper");
    canvas.line(9, 21, 6, 30, "ink");
  } else if (variant === 5) {
    canvas.outlineRect(8, 20, 10, 9, "sage");
    canvas.line(9, 28, 5 + stride, 34, "sage");
    canvas.line(16, 28, 20 - stride, 34, "sage");
  } else if (variant === 8) {
    canvas.outlineRect(7, 18, 12, 12, "warmGray");
    canvas.rect(15, 20, 4, 5, "charcoal");
    canvas.outlineRect(9 + stride, 29, 4, 5, "warmGray");
    canvas.outlineRect(14 - stride, 29, 4, 5, "warmGray");
  } else {
    const bodyColor =
      variant === 6
        ? "lightSage"
        : variant === 7
          ? "sage"
          : variant === 9
            ? "paper"
            : primary;
    canvas.outlineRect(8, 18, 10, 12, bodyColor);
    canvas.rect(9, 19, 7, 1, highlight);
    if (variant === 0) {
      canvas.line(9, 25, 3, 21, "ink");
      canvas.line(3, 21, 4, 30, "ink");
    } else if (variant === 2) {
      canvas.rect(5, 22, 5, 8, secondary);
      canvas.rect(3, 27, 5, 3, "paper");
    } else if (variant === 3) {
      canvas.ellipse(6, 27, 3, 3, "paper");
    } else if (variant === 7) {
      canvas.rect(14, 20, 4, 5, "deepOlive");
    } else if (variant === 9) {
      canvas.line(8, 24, 3, 20, "moss");
      canvas.line(3, 20, 5, 31, "paper");
    }
    canvas.outlineRect(9 + stride, 29, 4, 5, secondary);
    canvas.outlineRect(14 - stride, 29, 4, 5, secondary);
  }
  canvas.rect(8 + stride, 34, 6, 1, "ink");
  canvas.rect(13 - stride, 34, 6, 1, "ink");
}

function drawFeminineBackBody(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
  pose: CharacterPose,
): void {
  const skin = skinColors(appearance);
  const { primary, secondary, trim, highlight } = outfitColors(appearance);
  const variant = numericBodyVariant(appearance) - 10;
  const top = 18;
  canvas.rect(10, 16, 4, 4, skin.base);
  canvas.outlineRect(6, top, 12, 11, primary);
  canvas.rect(8, top + 1, 8, 1, highlight);
  if (variant === 0) {
    canvas.line(8, top + 1, 10, top + 9, secondary);
    canvas.line(16, top + 1, 14, top + 9, secondary);
    canvas.rect(11, top + 2, 2, 7, trim);
  } else if (variant === 2) {
    canvas.rect(7, top + 2, 4, 8, secondary);
    canvas.rect(14, top + 2, 4, 8, secondary);
    canvas.rect(11, top + 2, 3, 8, "paper");
  } else if (variant === 7) {
    canvas.line(8, top + 1, 10, top + 9, secondary);
    canvas.line(16, top + 1, 14, top + 9, secondary);
  } else if (variant === 3) {
    canvas.rect(11, top + 1, 2, 9, "paper");
    canvas.rect(7, top + 7, 10, 2, secondary);
  } else if (variant === 4 || variant === 6 || variant === 9) {
    canvas.line(7, top + 8, 5, 32, secondary);
    canvas.line(17, top + 8, 19, 32, secondary);
    canvas.rect(5, 31, 14, 3, secondary);
  } else if (variant === 8) {
    canvas.rect(7, top + 7, 10, 3, primary);
  } else {
    canvas.rect(8, top + 5, 8, 1, trim);
  }
  if (appearance.roleStyle === "founder") {
    canvas.line(8, top + 2, 10, top + 9, "deepOlive");
    canvas.line(16, top + 2, 14, top + 9, "deepOlive");
  }
  const swing = pose === "walk-a" ? -1 : pose === "walk-b" ? 1 : 0;
  canvas.outlineRect(3, top + 2 + swing, 4, 9, primary);
  canvas.outlineRect(17, top + 2 - swing, 4, 9, primary);
  canvas.rect(3, top + 10 + swing, 3, 2, skin.base);
  canvas.rect(18, top + 10 - swing, 3, 2, skin.shadow);
  if (variant !== 4 && variant !== 6 && variant !== 9) {
    canvas.outlineRect(8 + swing, 28, 4, 6, secondary);
    canvas.outlineRect(13 - swing, 28, 4, 6, secondary);
  }
  canvas.rect(7 + swing, 34, 6, 1, "ink");
  canvas.rect(12 - swing, 34, 6, 1, "ink");
}

function drawNonhumanBackBody(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
  pose: CharacterPose,
): void {
  const { primary, secondary, highlight } = outfitColors(appearance);
  const variant = numericBodyVariant(appearance) - 20;
  const swing = pose === "walk-a" ? -1 : pose === "walk-b" ? 1 : 0;
  if (variant === 1 || variant === 4) {
    canvas.ellipse(12, 25, 7, 9, variant === 1 ? "ink" : secondary);
    canvas.rect(8, 21, 8, 1, highlight);
    canvas.line(7, 21, 4, 29, "ink");
    canvas.line(17, 21, 20, 29, "ink");
  } else if (variant === 5) {
    canvas.outlineRect(7, 20, 10, 9, "sage");
    canvas.line(9, 28, 5 + swing, 34, "sage");
    canvas.line(15, 28, 19 - swing, 34, "sage");
  } else if (variant === 8) {
    canvas.outlineRect(6, 18, 12, 12, "warmGray");
    canvas.rect(8, 20, 8, 6, "deepOlive");
    canvas.rect(9, 21, 6, 1, "lightSage");
    canvas.outlineRect(8 + swing, 29, 4, 5, "warmGray");
    canvas.outlineRect(13 - swing, 29, 4, 5, "warmGray");
  } else {
    const bodyColor =
      variant === 6
        ? "lightSage"
        : variant === 7
          ? "sage"
          : variant === 9
            ? "paper"
            : primary;
    canvas.outlineRect(7, 18, 10, 12, bodyColor);
    canvas.rect(9, 19, 6, 1, highlight);
    if (variant === 0) {
      canvas.line(17, 24, 22, 20, "ink");
      canvas.line(22, 20, 21, 30, "ink");
    } else if (variant === 2) {
      canvas.rect(17, 22, 5, 8, secondary);
      canvas.rect(18, 27, 5, 3, "paper");
    } else if (variant === 3) {
      canvas.ellipse(18, 26, 3, 3, "paper");
    } else if (variant === 7) {
      canvas.rect(9, 20, 6, 5, "deepOlive");
    } else if (variant === 9) {
      canvas.line(17, 24, 22, 20, "moss");
      canvas.line(22, 20, 20, 31, "paper");
    }
    canvas.outlineRect(8 + swing, 29, 4, 5, secondary);
    canvas.outlineRect(13 - swing, 29, 4, 5, secondary);
  }
  canvas.rect(7 + swing, 34, 6, 1, "ink");
  canvas.rect(12 - swing, 34, 6, 1, "ink");
}

function drawMapFrontBody(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
  pose: CharacterPose,
): void {
  if (isNonhumanBody(appearance)) {
    drawNonhumanFrontBody(canvas, appearance, pose);
    return;
  }
  if (isFeminineBody(appearance)) {
    drawFeminineFrontBody(canvas, appearance, pose);
    return;
  }
  const skin = skinColors(appearance);
  const { primary, secondary, trim, highlight } = outfitColors(appearance);
  const bodyWidth =
    appearance.bodyShape === "broad"
      ? 15
      : appearance.bodyShape === "compact"
        ? 11
        : 13;
  const torsoX = Math.floor((MAP_WIDTH - bodyWidth) / 2);
  const torsoTop = appearance.bodyShape === "tall" ? 18 : 19;
  const torsoHeight = appearance.bodyShape === "tall" ? 11 : 10;

  canvas.rect(10, torsoTop - 2, 4, 3, skin.base);
  canvas.outlineRect(torsoX, torsoTop, bodyWidth, torsoHeight, primary);
  canvas.rect(torsoX + 2, torsoTop + 1, bodyWidth - 4, 1, highlight);
  canvas.rect(torsoX + 1, torsoTop + torsoHeight - 2, bodyWidth - 2, 1, secondary);
  canvas.line(torsoX + 2, torsoTop + 1, 11, torsoTop + 5, trim);
  canvas.line(torsoX + bodyWidth - 3, torsoTop + 1, 12, torsoTop + 5, trim);

  if (appearance.roleStyle === "founder") {
    canvas.rect(11, torsoTop + 4, 2, torsoHeight - 5, "cream");
    canvas.line(torsoX + 3, torsoTop + 3, torsoX + 5, torsoTop + 7, secondary);
    canvas.line(
      torsoX + bodyWidth - 4,
      torsoTop + 3,
      torsoX + bodyWidth - 6,
      torsoTop + 7,
      secondary,
    );
    canvas.rect(torsoX + bodyWidth - 5, torsoTop + 4, 3, 3, "paper");
    canvas.set(torsoX + bodyWidth - 4, torsoTop + 5, "ink");
    canvas.line(8, torsoTop + 2, 8, torsoTop + 6, "deepOlive");
    canvas.line(15, torsoTop + 2, 15, torsoTop + 6, "deepOlive");
    canvas.line(8, torsoTop + 6, 11, torsoTop + 8, "deepOlive");
    canvas.line(15, torsoTop + 6, 12, torsoTop + 8, "deepOlive");
  } else if (appearance.roleStyle === "receptionist") {
    canvas.rect(11, torsoTop + 2, 2, torsoHeight - 3, "paper");
    canvas.rect(torsoX + 2, torsoTop + 4, 3, 1, secondary);
    canvas.rect(torsoX + bodyWidth - 5, torsoTop + 4, 3, 1, secondary);
    canvas.line(10, torsoTop + 1, 12, torsoTop + 4, secondary);
    canvas.set(12, torsoTop + 5, "highlight");
  } else if (appearance.roleStyle === "imaging_technician") {
    canvas.line(9, torsoTop + 1, 12, torsoTop + 4, trim);
    canvas.line(15, torsoTop + 1, 12, torsoTop + 4, trim);
    canvas.rect(torsoX + 2, torsoTop + 6, bodyWidth - 4, 1, secondary);
    canvas.outlineRect(torsoX + bodyWidth - 5, torsoTop + 3, 3, 3, "highlight");
  } else if (appearance.roleStyle === "periop_nurse") {
    canvas.rect(11, torsoTop + 2, 2, torsoHeight - 3, "paper");
    canvas.line(torsoX + 2, torsoTop + 4, torsoX + 5, torsoTop + 6, trim);
  } else if (appearance.roleStyle === "endoscopy_nurse") {
    canvas.rect(torsoX + 2, torsoTop + 5, bodyWidth - 4, 1, trim);
    canvas.outlineRect(torsoX + bodyWidth - 5, torsoTop + 3, 3, 4, "paper");
  } else if (appearance.roleStyle === "endoscopist") {
    canvas.rect(11, torsoTop + 3, 2, torsoHeight - 4, "paper");
    canvas.line(9, torsoTop + 2, 11, torsoTop + 7, secondary);
    canvas.line(15, torsoTop + 2, 13, torsoTop + 7, secondary);
  } else if (appearance.roleStyle === "phlebotomist") {
    canvas.outlineRect(torsoX + bodyWidth - 5, torsoTop + 3, 3, 3, "paper");
    canvas.rect(torsoX + 2, torsoTop + 6, bodyWidth - 4, 1, trim);
  } else if (appearance.roleStyle === "evs_worker") {
    canvas.line(torsoX + 2, torsoTop + 2, torsoX + 5, torsoTop + 7, trim);
    canvas.line(torsoX + bodyWidth - 2, torsoTop + 2, torsoX + bodyWidth - 5, torsoTop + 7, trim);
  } else if (appearance.roleStyle === "glp1_np") {
    canvas.rect(11, torsoTop + 3, 2, torsoHeight - 4, "cream");
    canvas.rect(torsoX + bodyWidth - 5, torsoTop + 4, 3, 2, secondary);
  } else if (appearance.outfitStyle === "striped") {
    canvas.rect(torsoX + 1, torsoTop + 4, bodyWidth - 2, 1, secondary);
    canvas.rect(torsoX + 1, torsoTop + 7, bodyWidth - 2, 1, secondary);
  } else if (appearance.outfitStyle === "checked") {
    for (let y = torsoTop + 3; y < torsoTop + torsoHeight - 1; y += 3) {
      for (let x = torsoX + 2; x < torsoX + bodyWidth - 1; x += 4) {
        canvas.rect(x, y, 2, 1, secondary);
      }
    }
  } else if (appearance.outfitStyle === "coat") {
    canvas.rect(11, torsoTop + 4, 2, torsoHeight - 5, "paper");
    canvas.rect(torsoX + 2, torsoTop + 6, 3, 2, secondary);
    canvas.rect(torsoX + bodyWidth - 5, torsoTop + 6, 3, 2, secondary);
  } else {
    canvas.rect(torsoX + 2, torsoTop + 5, 3, 2, secondary);
    canvas.set(torsoX + bodyWidth - 3, torsoTop + 3, highlight);
  }

  if (appearance.bodyVariant % 3 === 1) {
    canvas.rect(torsoX + 1, torsoTop + torsoHeight - 4, bodyWidth - 2, 1, trim);
  } else if (appearance.bodyVariant % 3 === 2) {
    canvas.set(12, torsoTop + 6, "ink");
    canvas.set(12, torsoTop + 8, "ink");
  }
  switch (appearance.bodyVariant) {
    case 3:
      canvas.line(12, torsoTop + 2, 12, torsoTop + 7, secondary);
      canvas.set(11, torsoTop + 3, trim);
      canvas.set(13, torsoTop + 3, trim);
      break;
    case 4:
      canvas.rect(torsoX + 2, torsoTop + 2, bodyWidth - 4, 2, trim);
      canvas.set(torsoX + 1, torsoTop + 2, highlight);
      break;
    case 5:
      canvas.line(torsoX + 2, torsoTop + 2, torsoX + 2, torsoTop + 8, secondary);
      canvas.line(
        torsoX + bodyWidth - 3,
        torsoTop + 2,
        torsoX + bodyWidth - 3,
        torsoTop + 8,
        secondary,
      );
      break;
    case 6:
      canvas.outlineRect(torsoX + bodyWidth - 6, torsoTop + 4, 4, 4, trim);
      canvas.set(torsoX + bodyWidth - 4, torsoTop + 3, highlight);
      break;
    case 7:
      canvas.rect(torsoX + 1, torsoTop + torsoHeight - 4, bodyWidth - 2, 2, secondary);
      canvas.set(torsoX + 3, torsoTop + torsoHeight - 3, highlight);
      break;
    case 8:
      canvas.line(torsoX + 2, torsoTop + 3, torsoX + bodyWidth - 3, torsoTop + 7, secondary);
      canvas.line(torsoX + bodyWidth - 3, torsoTop + 3, torsoX + 2, torsoTop + 7, trim);
      break;
    case 9:
      canvas.outlineRect(torsoX + 2, torsoTop + 4, bodyWidth - 4, torsoHeight - 5, trim);
      canvas.rect(torsoX + 4, torsoTop + 5, Math.max(1, bodyWidth - 8), 1, highlight);
      break;
  }

  if (pose === "star-jump") {
    canvas.line(torsoX, torsoTop + 3, 3, 13, "ink");
    canvas.line(torsoX + 1, torsoTop + 3, 4, 13, primary);
    canvas.rect(1, 11, 3, 2, skin.base);
    canvas.line(torsoX + bodyWidth - 1, torsoTop + 3, 20, 13, "ink");
    canvas.line(torsoX + bodyWidth - 2, torsoTop + 3, 19, 13, primary);
    canvas.rect(20, 11, 3, 2, skin.base);
  } else {
    const swing = pose === "walk-a" ? -1 : pose === "walk-b" ? 1 : 0;
    canvas.outlineRect(torsoX - 3, torsoTop + 1 + swing, 4, 8, primary);
    canvas.rect(torsoX - 2, torsoTop + 3 + swing, 1, 4, highlight);
    canvas.rect(torsoX - 3, torsoTop + 8 + swing, 3, 2, skin.base);
    canvas.outlineRect(
      torsoX + bodyWidth - 1,
      torsoTop + 1 - swing,
      4,
      8,
      primary,
    );
    canvas.rect(
      torsoX + bodyWidth + 1,
      torsoTop + 3 - swing,
      1,
      4,
      secondary,
    );
    canvas.rect(
      torsoX + bodyWidth,
      torsoTop + 8 - swing,
      3,
      2,
      skin.shadow,
    );
  }

  const legTop = torsoTop + torsoHeight - 1;
  if (pose === "star-jump") {
    canvas.line(10, legTop, 4, 34, secondary);
    canvas.line(13, legTop, 19, 34, secondary);
    canvas.line(9, legTop, 5, 33, highlight);
    canvas.line(14, legTop, 18, 33, "deepOlive");
    canvas.rect(2, 34, 5, 1, "ink");
    canvas.rect(17, 34, 5, 1, "ink");
  } else {
    const leftShift = pose === "walk-a" ? -1 : pose === "walk-b" ? 1 : 0;
    const rightShift = -leftShift;
    canvas.outlineRect(7 + leftShift, legTop, 5, 5, secondary);
    canvas.outlineRect(12 + rightShift, legTop, 5, 5, secondary);
    canvas.rect(8 + leftShift, legTop + 1, 1, 3, highlight);
    canvas.rect(15 + rightShift, legTop + 1, 1, 3, "deepOlive");
    canvas.rect(6 + leftShift, 34, 6, 1, "ink");
    canvas.rect(12 + rightShift, 34, 6, 1, "ink");
    canvas.set(6 + leftShift, 33, "charcoal");
    canvas.set(17 + rightShift, 33, "charcoal");
  }
}

function drawSideHead(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
): void {
  if (isNonhumanHead(appearance)) {
    drawNonhumanSideHead(canvas, appearance);
    return;
  }
  if (isFeminineHead(appearance)) {
    drawFeminineSideHead(canvas, appearance);
    return;
  }
  const skin = skinColors(appearance);
  const hair = hairColors(appearance);
  const top = appearance.faceStyle === "long" ? 4 : 5;
  drawRoundedFace(canvas, 8, top, 11, 13, skin.base, skin.highlight, skin.shadow);
  canvas.rect(18, top + 6, 2, 3, skin.shadow);
  canvas.rect(16, top + 6, 2, 1, "ink");
  canvas.set(17, top + 6, "highlight");
  canvas.line(19, top + 8, 20, top + 9, skin.shadow);
  canvas.rect(16, top + 10, 3, 1, "deepOlive");
  if (appearance.hairStyle !== "none") {
    canvas.rect(8, top - 1, 9, 4, hair.base);
    canvas.rect(7, top + 2, 3, 6, hair.base);
    canvas.rect(10, top, 4, 1, hair.highlight);
  }
  if (appearance.hairStyle === "curly") {
    canvas.ellipse(8, top - 1, 3, 3, hair.base);
    canvas.ellipse(13, top - 2, 3, 3, hair.base);
    canvas.set(13, top - 3, hair.highlight);
  }
  if (appearance.hairStyle === "bun") {
    canvas.ellipse(8, top - 3, 4, 3, hair.base);
    canvas.rect(6, top - 4, 2, 2, hair.highlight);
  }
  if (appearance.headVariant === 7 || appearance.headVariant === 9) {
    canvas.rect(8, top + 7, 2, 5, hair.base);
  }
  if (appearance.headVariant === 8) {
    canvas.set(19, top + 10, "highlight");
  }
  if (appearance.accessory === "glasses") {
    canvas.outlineRect(14, top + 5, 6, 3, "paper");
    canvas.line(14, top + 6, 11, top + 5, "ink");
  } else if (appearance.accessory === "headband") {
    canvas.rect(8, top + 3, 10, 2, "paper");
  }
}

function drawSideBody(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
  pose: CharacterPose,
): void {
  if (isNonhumanBody(appearance)) {
    drawNonhumanSideBody(canvas, appearance, pose);
    return;
  }
  if (isFeminineBody(appearance)) {
    drawFeminineSideBody(canvas, appearance, pose);
    return;
  }
  const skin = skinColors(appearance);
  const { primary, secondary, trim, highlight } = outfitColors(appearance);
  const top = appearance.bodyShape === "tall" ? 18 : 19;
  canvas.rect(11, top - 2, 4, 3, skin.base);
  canvas.outlineRect(8, top, 11, 10, primary);
  canvas.rect(9, top + 1, 8, 1, highlight);
  canvas.line(10, top + 1, 13, top + 4, trim);
  canvas.rect(15, top + 3, 3, 3, secondary);
  if (appearance.roleStyle !== "patient") {
    canvas.outlineRect(15, top + 3, 3, 3, "paper");
  }
  if (appearance.bodyVariant >= 6) {
    canvas.rect(9, top + 6, 8, 1, trim);
  }
  if (appearance.bodyVariant === 8 || appearance.bodyVariant === 9) {
    canvas.rect(15, top + 5, 2, 3, highlight);
  }
  const swing = pose === "walk-a" ? 1 : pose === "walk-b" ? -1 : 0;
  canvas.outlineRect(
    swing < 0 ? 6 : 17,
    top + 2,
    4,
    9,
    primary,
  );
  canvas.rect(swing < 0 ? 6 : 18, top + 10, 3, 2, skin.shadow);
  const stride = pose === "walk-a" ? 2 : pose === "walk-b" ? -2 : 0;
  canvas.outlineRect(9 + stride, 28, 4, 6, secondary);
  canvas.outlineRect(13 - stride, 28, 4, 6, secondary);
  canvas.rect(10 + stride, 29, 1, 4, highlight);
  canvas.rect(8 + stride, 34, 6, 1, "ink");
  canvas.rect(12 - stride, 34, 6, 1, "ink");
}

function drawBackHead(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
): void {
  if (isNonhumanHead(appearance)) {
    drawNonhumanBackHead(canvas, appearance);
    return;
  }
  if (isFeminineHead(appearance)) {
    drawFeminineBackHead(canvas, appearance);
    return;
  }
  const skin = skinColors(appearance);
  const hair = hairColors(appearance);
  const top = appearance.faceStyle === "long" ? 4 : 5;
  drawRoundedFace(canvas, 6, top, 12, 13, skin.base, skin.highlight, skin.shadow);
  if (appearance.hairStyle === "none") {
    canvas.rect(8, top, 8, 3, "skinMedium");
    canvas.rect(9, top + 2, 6, 1, skin.shadow);
  } else {
    canvas.rect(6, top - 1, 12, 6, hair.base);
    canvas.rect(6, top + 4, 3, 6, hair.base);
    canvas.rect(15, top + 4, 3, 6, hair.base);
    canvas.rect(9, top, 6, 1, hair.highlight);
  }
  if (appearance.hairStyle === "curly") {
    for (let x = 5; x <= 17; x += 3) {
      canvas.ellipse(x + 1, top - 1 - (x % 2), 2, 2, hair.base);
      canvas.set(x + 1, top - 2 - (x % 2), hair.highlight);
    }
  }
  if (appearance.hairStyle === "bun") {
    canvas.ellipse(17, top - 3, 4, 3, hair.base);
    canvas.rect(17, top - 4, 2, 2, hair.highlight);
  }
  if (appearance.headVariant === 7 || appearance.headVariant === 9) {
    canvas.rect(7, top + 8, 10, 2, hair.base);
  }
}

function drawBackBody(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
  pose: CharacterPose,
): void {
  if (isNonhumanBody(appearance)) {
    drawNonhumanBackBody(canvas, appearance, pose);
    return;
  }
  if (isFeminineBody(appearance)) {
    drawFeminineBackBody(canvas, appearance, pose);
    return;
  }
  const skin = skinColors(appearance);
  const { primary, secondary, trim, highlight } = outfitColors(appearance);
  const bodyWidth =
    appearance.bodyShape === "broad"
      ? 15
      : appearance.bodyShape === "compact"
        ? 11
        : 13;
  const x = Math.floor((MAP_WIDTH - bodyWidth) / 2);
  const top = appearance.bodyShape === "tall" ? 18 : 19;
  canvas.rect(10, top - 2, 4, 3, skin.base);
  canvas.outlineRect(x, top, bodyWidth, 10, primary);
  canvas.rect(x + 2, top + 1, bodyWidth - 4, 1, highlight);
  canvas.rect(x + 2, top + 3, bodyWidth - 4, 2, secondary);
  canvas.rect(9, top + 3, 6, 5, secondary);
  canvas.rect(10, top + 3, 4, 1, trim);
  if (appearance.roleStyle === "founder") {
    canvas.line(x + 3, top + 2, x + 5, top + 8, "deepOlive");
    canvas.line(x + bodyWidth - 4, top + 2, x + bodyWidth - 6, top + 8, "deepOlive");
  }
  if (appearance.bodyVariant >= 5) {
    canvas.rect(x + 2, top + 6, bodyWidth - 4, 1, trim);
  }
  if (appearance.bodyVariant === 8 || appearance.bodyVariant === 9) {
    canvas.outlineRect(x + bodyWidth - 6, top + 3, 4, 4, highlight);
  }
  const swing = pose === "walk-a" ? -1 : pose === "walk-b" ? 1 : 0;
  canvas.outlineRect(x - 3, top + 1 + swing, 4, 9, primary);
  canvas.outlineRect(x + bodyWidth - 1, top + 1 - swing, 4, 9, primary);
  canvas.rect(x - 3, top + 9 + swing, 3, 2, skin.base);
  canvas.rect(x + bodyWidth, top + 9 - swing, 3, 2, skin.shadow);
  const leftShift = pose === "walk-a" ? -1 : pose === "walk-b" ? 1 : 0;
  canvas.outlineRect(7 + leftShift, 28, 5, 6, secondary);
  canvas.outlineRect(12 - leftShift, 28, 5, 6, secondary);
  canvas.rect(6 + leftShift, 34, 6, 1, "ink");
  canvas.rect(12 - leftShift, 34, 6, 1, "ink");
}

function drawPortraitHair(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
  x: number,
  y: number,
  width: number,
): void {
  const hair = hairColors(appearance);
  if (appearance.hairStyle === "none") {
    canvas.rect(x + 4, y + 1, width - 8, 2, "skinMedium");
    return;
  }
  if (appearance.hairStyle === "short") {
    canvas.rect(x + 2, y - 2, width - 4, 7, hair.base);
    canvas.rect(x, y + 3, 4, 8, hair.base);
    canvas.rect(x + width - 4, y + 3, 4, 7, hair.base);
    canvas.rect(x + 5, y, width - 11, 2, hair.highlight);
    canvas.rect(x + width - 7, y + 4, 3, 1, hair.highlight);
    return;
  }
  if (appearance.hairStyle === "parted") {
    canvas.rect(x + 2, y - 2, width - 4, 7, hair.base);
    canvas.line(x, y + 4, x + 8, y + 10, hair.base);
    canvas.line(x + width - 1, y + 4, x + width - 9, y + 9, hair.base);
    canvas.line(x + 4, y, x + Math.floor(width / 2) - 2, y + 2, hair.highlight);
    canvas.rect(x + Math.floor(width / 2), y - 2, 3, 3, "skinLight");
    return;
  }
  if (appearance.hairStyle === "curly") {
    for (let column = x - 1; column < x + width + 1; column += 4) {
      canvas.ellipse(column + 2, y - 2 - (column % 2), 3, 3, hair.base);
      canvas.rect(column + 1, y - 4 - (column % 2), 2, 1, hair.highlight);
    }
    canvas.rect(x - 2, y + 2, 5, 11, hair.base);
    canvas.rect(x + width - 3, y + 2, 5, 11, hair.base);
    return;
  }
  if (appearance.hairStyle === "bun") {
    canvas.rect(x + 2, y - 2, width - 4, 7, hair.base);
    canvas.rect(x, y + 3, 4, 10, hair.base);
    canvas.ellipse(x + width, y - 6, 6, 5, hair.base);
    canvas.rect(x + width, y - 9, 3, 2, hair.highlight);
  }
}

function drawClassicPortraitBodyForExtendedPair(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
): void {
  const skin = skinColors(appearance);
  const { primary, secondary, trim, highlight } = outfitColors(appearance);

  // Keep the original body pixels when a classic body is paired with a new
  // head. The classic/classic path below remains untouched.
  canvas.rect(3, 36, 32, 6, "shadow");
  canvas.rect(16, 29, 6, 6, skin.base);
  canvas.rect(17, 29, 1, 5, skin.highlight);
  canvas.rect(4, 33, 30, 9, "ink");
  canvas.rect(5, 34, 28, 8, primary);
  canvas.rect(7, 35, 24, 1, highlight);
  canvas.line(9, 34, 18, 40, trim);
  canvas.line(29, 34, 19, 40, trim);
  canvas.rect(18, 38, 2, 4, secondary);
  canvas.rect(27, 36, 4, 4, secondary);
  canvas.set(29, 37, "highlight");

  if (appearance.roleStyle === "founder") {
    canvas.line(10, 35, 12, 41, "deepOlive");
    canvas.line(28, 35, 26, 41, "deepOlive");
    canvas.ellipse(19, 40, 2, 2, "deepOlive");
  } else if (appearance.roleStyle === "receptionist") {
    canvas.line(17, 35, 19, 39, secondary);
    canvas.set(19, 40, "highlight");
  } else if (appearance.roleStyle === "imaging_technician") {
    canvas.rect(7, 39, 24, 1, secondary);
    canvas.outlineRect(27, 35, 4, 4, "paper");
  }

  switch (appearance.bodyVariant) {
    case 3:
      canvas.line(19, 35, 19, 41, secondary);
      canvas.rect(18, 36, 3, 2, trim);
      break;
    case 4:
      canvas.rect(10, 34, 18, 2, trim);
      canvas.rect(13, 36, 12, 1, highlight);
      break;
    case 5:
      canvas.line(8, 35, 8, 41, secondary);
      canvas.line(30, 35, 30, 41, secondary);
      break;
    case 6:
      canvas.outlineRect(25, 36, 6, 5, trim);
      canvas.rect(27, 35, 1, 3, highlight);
      canvas.rect(29, 35, 1, 3, secondary);
      break;
    case 7:
      canvas.rect(6, 39, 27, 2, secondary);
      canvas.rect(8, 39, 8, 1, highlight);
      break;
    case 8:
      canvas.line(9, 35, 18, 41, secondary);
      canvas.line(29, 35, 20, 41, trim);
      break;
    case 9:
      canvas.outlineRect(10, 36, 18, 6, trim);
      canvas.rect(13, 37, 12, 1, highlight);
      break;
  }
}

function drawExtendedPortraitBody(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
): void {
  const variant = numericBodyVariant(appearance);

  if (variant < 10) {
    drawClassicPortraitBodyForExtendedPair(canvas, appearance);
    return;
  }

  const skin = skinColors(appearance);
  const { primary, secondary, trim, highlight } = outfitColors(appearance);
  canvas.rect(3, 36, 32, 6, "shadow");
  canvas.rect(16, 28, 6, 8, skin.base);
  canvas.rect(17, 29, 1, 5, skin.highlight);

  if (variant < 20) {
    const feminine = variant - 10;
    canvas.line(4, 37, 8, 32, "ink");
    canvas.line(34, 37, 30, 32, "ink");
    canvas.rect(8, 32, 22, 10, "ink");
    canvas.rect(6, 36, 27, 6, primary);
    canvas.rect(9, 33, 20, 8, primary);
    canvas.rect(10, 34, 18, 1, highlight);
    if (feminine === 0) {
      canvas.line(10, 33, 18, 40, trim);
      canvas.line(28, 33, 20, 40, trim);
      canvas.rect(18, 36, 2, 6, "paper");
    } else if (feminine === 1) {
      canvas.line(13, 33, 19, 38, secondary);
      canvas.line(25, 33, 19, 38, secondary);
      canvas.outlineRect(26, 36, 4, 4, trim);
    } else if (feminine === 2) {
      canvas.rect(9, 34, 6, 8, secondary);
      canvas.rect(24, 34, 6, 8, secondary);
      canvas.rect(17, 34, 5, 8, "paper");
      canvas.set(19, 36, "moss");
      canvas.set(19, 39, "moss");
    } else if (feminine === 3) {
      canvas.line(10, 33, 18, 39, "paper");
      canvas.line(28, 33, 20, 39, "paper");
      canvas.rect(8, 39, 23, 2, secondary);
    } else if (feminine === 4 || feminine === 6 || feminine === 9) {
      canvas.line(11, 33, 19, 38, trim);
      canvas.line(27, 33, 19, 38, trim);
      canvas.rect(8, 39, 23, 3, secondary);
    } else if (feminine === 5) {
      canvas.line(10, 34, 28, 40, secondary);
      canvas.line(28, 34, 19, 39, trim);
    } else if (feminine === 7) {
      canvas.rect(9, 34, 7, 8, secondary);
      canvas.rect(23, 34, 7, 8, secondary);
      canvas.line(15, 34, 19, 39, trim);
      canvas.line(24, 34, 20, 39, trim);
    } else {
      canvas.rect(8, 39, 23, 3, primary);
      canvas.outlineRect(26, 35, 4, 4, secondary);
    }
    if (appearance.roleStyle === "founder") {
      canvas.line(10, 34, 13, 41, "deepOlive");
      canvas.line(28, 34, 25, 41, "deepOlive");
      canvas.ellipse(19, 40, 2, 2, "deepOlive");
      canvas.outlineRect(27, 35, 4, 4, "paper");
    }
    return;
  }

  const creature = variant - 20;
  if (creature === 1) {
    canvas.ellipse(19, 37, 15, 9, "ink");
    canvas.ellipse(19, 39, 8, 7, "paper");
  } else if (creature === 4) {
    canvas.ellipse(19, 37, 15, 9, secondary);
    canvas.ellipse(19, 39, 8, 7, "paper");
    canvas.line(12, 36, 19, 41, trim);
    canvas.line(26, 36, 19, 41, trim);
  } else if (creature === 5) {
    canvas.outlineRect(8, 32, 22, 10, "sage");
    canvas.rect(11, 33, 16, 1, "lightSage");
    canvas.rect(18, 34, 3, 8, "paper");
  } else if (creature === 8) {
    canvas.outlineRect(6, 31, 27, 11, "warmGray");
    canvas.rect(10, 34, 19, 6, "charcoal");
    canvas.rect(12, 35, 5, 3, "highlight");
    canvas.rect(22, 35, 5, 3, "moss");
  } else {
    const bodyColor =
      creature === 6
        ? "lightSage"
        : creature === 7
          ? "sage"
          : creature === 9
            ? "paper"
            : primary;
    canvas.rect(6, 34, 27, 8, "ink");
    canvas.rect(7, 35, 25, 7, bodyColor);
    canvas.rect(10, 36, 19, 1, highlight);
    if (creature === 0) {
      canvas.ellipse(19, 38, 3, 3, trim);
      canvas.set(15, 36, trim);
      canvas.set(23, 36, trim);
    } else if (creature === 2) {
      canvas.rect(15, 34, 9, 3, "paper");
    } else if (creature === 3) {
      canvas.line(12, 34, 19, 39, trim);
      canvas.line(27, 34, 20, 39, trim);
      canvas.ellipse(31, 40, 3, 3, "paper");
    } else if (creature === 6) {
      canvas.line(13, 34, 19, 39, trim);
      canvas.line(26, 34, 20, 39, trim);
    } else if (creature === 7) {
      canvas.rect(13, 35, 13, 5, "deepOlive");
      canvas.rect(15, 36, 4, 2, "highlight");
      canvas.rect(21, 36, 3, 3, "lightSage");
    } else {
      canvas.rect(13, 35, 13, 2, "lightSage");
      canvas.rect(18, 37, 3, 5, "moss");
    }
  }
  if (appearance.roleStyle === "founder" && creature !== 8) {
    canvas.outlineRect(27, 35, 4, 4, "paper");
    canvas.set(29, 37, "moss");
  }
}

function drawLegacyPortraitHeadForExtendedPair(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
): void {
  const skin = skinColors(appearance);
  const faceWidth =
    appearance.faceStyle === "square"
      ? 24
      : appearance.faceStyle === "round"
        ? 23
        : 21;
  const faceHeight = appearance.faceStyle === "long" ? 27 : 25;
  const faceX = Math.floor((PORTRAIT_SOURCE_WIDTH - faceWidth) / 2);
  const faceY = appearance.faceStyle === "long" ? 3 : 5;
  drawRoundedFace(
    canvas,
    faceX,
    faceY,
    faceWidth,
    faceHeight,
    skin.base,
    skin.highlight,
    skin.shadow,
  );
  canvas.rect(faceX - 2, faceY + 11, 2, 6, skin.base);
  canvas.rect(faceX + faceWidth, faceY + 11, 2, 6, skin.shadow);
  drawPortraitHair(canvas, appearance, faceX, faceY, faceWidth);

  const eyeY = faceY + 14;
  const leftEye = faceX + 6;
  const rightEye = faceX + faceWidth - 8;
  canvas.rect(leftEye, eyeY, 3, 2, "ink");
  canvas.rect(rightEye, eyeY, 3, 2, "ink");
  canvas.set(leftEye + 1, eyeY, "highlight");
  canvas.set(rightEye + 1, eyeY, "highlight");
  canvas.rect(leftEye - 1, eyeY - 4, 4, 1, "deepOlive");
  canvas.rect(rightEye, eyeY - 4, 4, 1, "deepOlive");
  const center = Math.floor(PORTRAIT_SOURCE_WIDTH / 2);
  canvas.line(center, eyeY + 2, center - 1, eyeY + 6, skin.shadow);
  canvas.rect(center - 1, eyeY + 6, 3, 1, "skinDark");
  canvas.rect(center - 4, faceY + faceHeight - 4, 8, 1, "deepOlive");
  canvas.rect(center - 3, faceY + faceHeight - 3, 6, 1, skin.shadow);
  canvas.rect(faceX + 4, eyeY + 6, 3, 1, skin.highlight);
  canvas.rect(faceX + faceWidth - 7, eyeY + 6, 3, 1, skin.shadow);

  const mouthY = faceY + faceHeight - 4;
  switch (appearance.headVariant) {
    case 3:
      canvas.set(faceX + 5, eyeY + 5, "skinDark");
      canvas.set(faceX + 7, eyeY + 7, "skinDark");
      canvas.set(faceX + faceWidth - 6, eyeY + 5, "skinDark");
      canvas.set(faceX + faceWidth - 8, eyeY + 7, "skinDark");
      break;
    case 4:
      canvas.rect(faceX + 5, eyeY + 6, 2, 1, "skinDark");
      canvas.set(faceX + faceWidth - 7, eyeY + 5, "skinDark");
      break;
    case 5:
      canvas.rect(center - 6, mouthY - 3, 5, 2, "ink");
      canvas.rect(center + 1, mouthY - 3, 5, 2, "ink");
      canvas.rect(center - 2, mouthY - 2, 4, 1, "deepOlive");
      break;
    case 6:
      canvas.rect(center - 4, mouthY + 1, 8, 2, "deepOlive");
      canvas.rect(center - 2, mouthY + 3, 4, 2, "ink");
      break;
    case 7:
      canvas.rect(faceX + 1, eyeY + 2, 3, 10, "deepOlive");
      canvas.rect(faceX + faceWidth - 4, eyeY + 2, 3, 10, "deepOlive");
      canvas.rect(center - 7, mouthY + 1, 14, 1, skin.shadow);
      break;
    case 8:
      canvas.rect(faceX - 2, eyeY + 7, 2, 3, "highlight");
      canvas.rect(faceX + faceWidth, eyeY + 7, 2, 3, "highlight");
      canvas.set(center - 7, mouthY - 2, skin.shadow);
      break;
    case 9:
      canvas.rect(faceX + 2, mouthY - 4, 3, 7, "deepOlive");
      canvas.rect(faceX + faceWidth - 5, mouthY - 4, 3, 7, "deepOlive");
      canvas.rect(center - 8, mouthY + 1, 16, 3, "deepOlive");
      canvas.rect(center - 4, mouthY + 4, 8, 2, "ink");
      break;
  }

  if (appearance.accessory === "glasses") {
    canvas.outlineRect(leftEye - 3, eyeY - 3, 8, 6, "paper");
    canvas.outlineRect(rightEye - 3, eyeY - 3, 8, 6, "paper");
    canvas.rect(
      leftEye + 5,
      eyeY - 1,
      Math.max(1, rightEye - leftEye - 7),
      2,
      "ink",
    );
    canvas.rect(faceX - 1, eyeY - 1, 4, 1, "ink");
    canvas.rect(faceX + faceWidth - 3, eyeY - 1, 4, 1, "ink");
  } else if (appearance.accessory === "headband") {
    canvas.rect(faceX, faceY + 5, faceWidth, 3, "paper");
    canvas.rect(faceX + 3, faceY + 5, faceWidth - 6, 1, "highlight");
  }
}

function drawFemininePortraitHair(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
  x: number,
  y: number,
  width: number,
): void {
  const hair = hairColors(appearance);
  const variant = numericHeadVariant(appearance) - 10;
  if (isFeminineBareScalp(appearance)) {
    const skin = skinColors(appearance);
    canvas.rect(x + 4, y + 1, width - 8, 2, skin.highlight);
    canvas.set(x + width - 5, y + 3, skin.shadow);
    return;
  }
  if (variant === 9) {
    canvas.rect(x, y - 3, width, 10, "paper");
    canvas.rect(x + 4, y - 7, width - 8, 5, "lightSage");
    canvas.line(x + 2, y, x + width - 3, y + 5, "moss");
    canvas.rect(x - 2, y + 5, 5, 8, "paper");
    canvas.rect(x + width - 3, y + 5, 5, 8, "lightSage");
    return;
  }
  if (variant === 5) {
    for (let column = x - 2; column <= x + width + 2; column += 4) {
      canvas.ellipse(column, y - 2 - (column % 2), 3, 3, hair.base);
      canvas.rect(column - 1, y - 5 - (column % 2), 2, 1, hair.highlight);
    }
    for (let curlY = y + 3; curlY <= y + 25; curlY += 4) {
      canvas.ellipse(x - 2, curlY, 3, 3, hair.base);
      canvas.ellipse(x + width + 1, curlY, 3, 3, hair.base);
    }
    return;
  }
  canvas.rect(x + 1, y - 3, width - 2, 8, hair.base);
  canvas.rect(x + 5, y - 1, width - 11, 2, hair.highlight);
  if (variant === 0) {
    canvas.rect(x - 2, y + 3, 6, 24, hair.base);
    canvas.rect(x + width - 4, y + 3, 6, 24, hair.base);
    canvas.line(x, y + 14, x - 2, y + 25, hair.highlight);
    canvas.line(x + width - 1, y + 13, x + width + 1, y + 24, hair.highlight);
  } else if (variant === 1) {
    canvas.rect(x - 2, y + 3, 6, 18, hair.base);
    canvas.rect(x + width - 4, y + 3, 6, 18, hair.base);
    canvas.rect(x + 2, y + 4, width - 4, 4, hair.base);
  } else if (variant === 2) {
    canvas.ellipse(x + width, y - 2, 6, 5, hair.base);
    canvas.rect(x + width, y + 2, 4, 18, hair.base);
    canvas.line(x + width + 1, y + 5, x + width, y + 18, hair.highlight);
  } else if (variant === 3) {
    canvas.rect(x - 2, y + 3, 5, 11, hair.base);
    canvas.rect(x + width - 3, y + 3, 5, 11, hair.base);
    for (let braidY = y + 12; braidY <= y + 28; braidY += 4) {
      canvas.rect(x - 2 + (braidY % 2), braidY, 4, 3, hair.base);
      canvas.rect(x + width - 1 - (braidY % 2), braidY, 4, 3, hair.base);
    }
  } else if (variant === 4) {
    canvas.line(x - 1, y, x + 14, y + 7, hair.base);
    canvas.rect(x - 2, y + 3, 5, 9, hair.base);
    canvas.line(x + 4, y - 2, x + width - 2, y + 2, hair.highlight);
  } else if (variant === 6) {
    canvas.rect(x - 2, y + 3, 6, 17, hair.base);
    canvas.ellipse(x + width, y + 18, 6, 7, hair.base);
  } else if (variant === 7) {
    canvas.ellipse(x + Math.floor(width / 2), y - 8, 7, 5, hair.base);
    for (let locX = x - 1; locX <= x + width; locX += 4) {
      canvas.rect(locX, y + 4, 3, 18 + (locX % 3), hair.base);
      canvas.set(locX + 1, y + 11, hair.highlight);
    }
  } else {
    for (let crownX = x; crownX < x + width; crownX += 4) {
      canvas.rect(crownX, y - 4 + (crownX % 2), 4, 3, hair.highlight);
    }
    canvas.rect(x - 2, y + 3, 6, 17, hair.base);
    canvas.rect(x + width - 4, y + 3, 6, 17, hair.base);
  }
}

function drawFemininePortraitHead(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
): void {
  const skin = skinColors(appearance);
  const faceX = 8;
  const faceY = 5;
  const faceWidth = 22;
  const faceHeight = 26;
  drawRoundedFace(
    canvas,
    faceX,
    faceY,
    faceWidth,
    faceHeight,
    skin.base,
    skin.highlight,
    skin.shadow,
  );
  canvas.rect(faceX - 2, faceY + 12, 2, 6, skin.base);
  canvas.rect(faceX + faceWidth, faceY + 12, 2, 6, skin.shadow);
  drawFemininePortraitHair(
    canvas,
    appearance,
    faceX,
    faceY,
    faceWidth,
  );
  const eyeY = 18;
  canvas.rect(13, eyeY, 4, 2, "ink");
  canvas.rect(22, eyeY, 4, 2, "ink");
  canvas.set(14, eyeY, "highlight");
  canvas.set(23, eyeY, "highlight");
  canvas.set(12, eyeY - 1, "ink");
  canvas.set(26, eyeY - 1, "ink");
  canvas.rect(13, eyeY - 4, 5, 1, "deepOlive");
  canvas.rect(21, eyeY - 4, 5, 1, "deepOlive");
  canvas.line(19, eyeY + 2, 18, eyeY + 6, skin.shadow);
  canvas.rect(17, eyeY + 6, 4, 1, "skinDark");
  canvas.rect(15, 28, 8, 1, "deepOlive");
  canvas.rect(17, 29, 4, 1, skin.shadow);
  canvas.rect(11, 25, 3, 1, skin.highlight);
  canvas.rect(25, 25, 3, 1, skin.shadow);
  if (appearance.accessory === "glasses") {
    canvas.outlineRect(11, eyeY - 3, 9, 6, "paper");
    canvas.outlineRect(20, eyeY - 3, 9, 6, "paper");
    canvas.rect(19, eyeY - 1, 2, 1, "ink");
  }
}

function drawNonhumanPortraitHead(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
): void {
  const variant = numericHeadVariant(appearance) - 20;
  const hair = hairColors(appearance);
  if (variant === 0 || variant === 2) {
    const fox = variant === 2;
    canvas.line(5, 12, 8, 0, "ink");
    canvas.line(8, 0, 16, 8, "ink");
    canvas.line(33, 12, 30, 0, "ink");
    canvas.line(30, 0, 23, 8, "ink");
    canvas.ellipse(19, 18, 14, 15, hair.base);
    canvas.ellipse(19, 25, fox ? 9 : 7, 7, "paper");
    canvas.ellipse(13, 18, 3, 4, "ink");
    canvas.ellipse(25, 18, 3, 4, "ink");
    canvas.set(13, 17, "highlight");
    canvas.set(25, 17, "highlight");
    canvas.rect(17, 23, 5, 3, "ink");
    canvas.line(4, 26, 14, 27, "ink");
    canvas.line(24, 27, 34, 26, "ink");
    canvas.rect(9, 5, 3, 3, hair.highlight);
    canvas.rect(27, 5, 3, 3, hair.highlight);
  } else if (variant === 1) {
    canvas.ellipse(19, 17, 14, 17, "ink");
    canvas.ellipse(13, 18, 8, 11, "paper");
    canvas.ellipse(25, 18, 8, 11, "paper");
    drawPixelEye(canvas, 12, 16, false);
    drawPixelEye(canvas, 24, 16, false);
    canvas.line(15, 23, 19, 27, "moss");
    canvas.line(23, 23, 19, 27, "moss");
    canvas.rect(17, 26, 5, 3, "warmGray");
  } else if (variant === 3) {
    canvas.outlineRect(9, 0, 7, 16, "paper");
    canvas.outlineRect(23, 0, 7, 16, "paper");
    canvas.rect(11, 3, 3, 10, "lightSage");
    canvas.rect(25, 3, 3, 10, "lightSage");
    canvas.ellipse(19, 22, 14, 13, "paper");
    canvas.ellipse(13, 20, 3, 4, "ink");
    canvas.ellipse(25, 20, 3, 4, "ink");
    canvas.set(13, 19, "highlight");
    canvas.set(25, 19, "highlight");
    canvas.rect(17, 25, 4, 2, "moss");
    canvas.rect(15, 28, 3, 3, "highlight");
    canvas.rect(21, 28, 3, 3, "highlight");
  } else if (variant === 4) {
    canvas.ellipse(19, 18, 16, 17, hair.base);
    canvas.ellipse(12, 18, 8, 8, "paper");
    canvas.ellipse(26, 18, 8, 8, "paper");
    canvas.ellipse(12, 18, 4, 5, "ink");
    canvas.ellipse(26, 18, 4, 5, "ink");
    canvas.set(12, 16, "highlight");
    canvas.set(26, 16, "highlight");
    canvas.line(16, 23, 19, 29, "moss");
    canvas.line(22, 23, 19, 29, "moss");
    canvas.rect(17, 27, 5, 3, "warmGray");
  } else if (variant === 5) {
    canvas.ellipse(19, 21, 16, 12, "sage");
    canvas.ellipse(9, 7, 7, 7, "lightSage");
    canvas.ellipse(29, 7, 7, 7, "lightSage");
    canvas.ellipse(9, 7, 4, 4, "ink");
    canvas.ellipse(29, 7, 4, 4, "ink");
    canvas.set(9, 5, "highlight");
    canvas.set(29, 5, "highlight");
    canvas.set(14, 21, "deepOlive");
    canvas.set(25, 21, "deepOlive");
    canvas.line(12, 26, 19, 29, "ink");
    canvas.line(19, 29, 27, 26, "ink");
  } else if (variant === 6) {
    canvas.ellipse(19, 16, 15, 17, "lightSage");
    canvas.line(7, 21, 14, 32, "lightSage");
    canvas.line(31, 21, 24, 32, "lightSage");
    canvas.ellipse(12, 17, 5, 7, "ink");
    canvas.ellipse(26, 17, 5, 7, "ink");
    canvas.set(12, 14, "highlight");
    canvas.set(26, 14, "highlight");
    canvas.rect(17, 28, 5, 1, "deepOlive");
  } else if (variant === 7) {
    canvas.line(14, 7, 10, 0, "deepOlive");
    canvas.line(25, 7, 29, 0, "deepOlive");
    canvas.ellipse(10, 0, 3, 3, "lightSage");
    canvas.ellipse(29, 0, 3, 3, "lightSage");
    canvas.ellipse(19, 19, 14, 15, "sage");
    canvas.ellipse(12, 19, 4, 5, "ink");
    canvas.ellipse(26, 19, 4, 5, "ink");
    canvas.ellipse(19, 12, 3, 4, "ink");
    canvas.set(12, 17, "highlight");
    canvas.set(26, 17, "highlight");
    canvas.set(19, 10, "highlight");
    canvas.rect(15, 27, 8, 1, "deepOlive");
  } else if (variant === 8) {
    canvas.outlineRect(6, 4, 27, 28, "warmGray");
    canvas.line(19, 4, 19, 0, "ink");
    canvas.ellipse(19, 0, 3, 3, "moss");
    canvas.rect(10, 10, 19, 10, "charcoal");
    canvas.rect(12, 13, 5, 4, "highlight");
    canvas.rect(23, 13, 5, 4, "highlight");
    canvas.rect(10, 24, 19, 5, "deepOlive");
    canvas.set(13, 26, "lightSage");
    canvas.set(19, 26, "lightSage");
    canvas.set(26, 26, "lightSage");
    canvas.rect(2, 12, 4, 10, "moss");
    canvas.rect(33, 12, 4, 10, "moss");
  } else {
    canvas.ellipse(19, 20, 14, 13, "paper");
    for (let gillY = 7; gillY <= 25; gillY += 6) {
      canvas.line(7, gillY + 5, 1, gillY, "moss");
      canvas.line(31, gillY + 5, 37, gillY, "moss");
      canvas.rect(0, gillY, 3, 2, "lightSage");
      canvas.rect(36, gillY, 3, 2, "lightSage");
    }
    canvas.ellipse(12, 18, 3, 4, "ink");
    canvas.ellipse(26, 18, 3, 4, "ink");
    canvas.set(12, 17, "highlight");
    canvas.set(26, 17, "highlight");
    canvas.set(13, 26, "moss");
    canvas.set(26, 26, "moss");
    canvas.rect(16, 28, 7, 1, "deepOlive");
  }
}

function getExtendedCharacterPortraitFrame(
  appearance: ResolvedCharacterAppearance,
): PixelFrame {
  const canvas = new PixelCanvas(PORTRAIT_SOURCE_WIDTH, PORTRAIT_SOURCE_HEIGHT);
  drawExtendedPortraitBody(canvas, appearance);
  if (isNonhumanHead(appearance)) {
    drawNonhumanPortraitHead(canvas, appearance);
  } else if (isFeminineHead(appearance)) {
    drawFemininePortraitHead(canvas, appearance);
  } else {
    drawLegacyPortraitHeadForExtendedPair(canvas, appearance);
  }
  return canvas.frame();
}

function getCharacterPortraitSourceFrame(
  sourceAppearance: PixelAppearanceDescriptor,
  roleStyle?: PixelRoleStyle,
): PixelFrame {
  const appearance = resolveCharacterAppearance(
    sourceAppearance,
    roleStyle,
  );
  if (
    numericHeadVariant(appearance) >= 10 ||
    numericBodyVariant(appearance) >= 10
  ) {
    return getExtendedCharacterPortraitFrame(appearance);
  }
  const canvas = new PixelCanvas(PORTRAIT_SOURCE_WIDTH, PORTRAIT_SOURCE_HEIGHT);
  const skin = skinColors(appearance);
  const { primary, secondary, trim, highlight } = outfitColors(appearance);
  const faceWidth =
    appearance.faceStyle === "square"
      ? 24
      : appearance.faceStyle === "round"
        ? 23
        : 21;
  const faceHeight = appearance.faceStyle === "long" ? 27 : 25;
  const faceX = Math.floor((PORTRAIT_SOURCE_WIDTH - faceWidth) / 2);
  const faceY = appearance.faceStyle === "long" ? 3 : 5;

  // Bust and shoulders are portrait-specific art, not a scaled map sprite.
  canvas.rect(3, 36, 32, 6, "shadow");
  canvas.rect(16, 29, 6, 6, skin.base);
  canvas.rect(17, 29, 1, 5, skin.highlight);
  canvas.rect(4, 33, 30, 9, "ink");
  canvas.rect(5, 34, 28, 8, primary);
  canvas.rect(7, 35, 24, 1, highlight);
  canvas.line(9, 34, 18, 40, trim);
  canvas.line(29, 34, 19, 40, trim);
  canvas.rect(18, 38, 2, 4, secondary);
  canvas.rect(27, 36, 4, 4, secondary);
  canvas.set(29, 37, "highlight");

  if (appearance.roleStyle === "founder") {
    canvas.line(10, 35, 12, 41, "deepOlive");
    canvas.line(28, 35, 26, 41, "deepOlive");
    canvas.ellipse(19, 40, 2, 2, "deepOlive");
  } else if (appearance.roleStyle === "receptionist") {
    canvas.line(17, 35, 19, 39, secondary);
    canvas.set(19, 40, "highlight");
  } else if (appearance.roleStyle === "imaging_technician") {
    canvas.rect(7, 39, 24, 1, secondary);
    canvas.outlineRect(27, 35, 4, 4, "paper");
  }
  switch (appearance.bodyVariant) {
    case 3:
      canvas.line(19, 35, 19, 41, secondary);
      canvas.rect(18, 36, 3, 2, trim);
      break;
    case 4:
      canvas.rect(10, 34, 18, 2, trim);
      canvas.rect(13, 36, 12, 1, highlight);
      break;
    case 5:
      canvas.line(8, 35, 8, 41, secondary);
      canvas.line(30, 35, 30, 41, secondary);
      break;
    case 6:
      canvas.outlineRect(25, 36, 6, 5, trim);
      canvas.rect(27, 35, 1, 3, highlight);
      canvas.rect(29, 35, 1, 3, secondary);
      break;
    case 7:
      canvas.rect(6, 39, 27, 2, secondary);
      canvas.rect(8, 39, 8, 1, highlight);
      break;
    case 8:
      canvas.line(9, 35, 18, 41, secondary);
      canvas.line(29, 35, 20, 41, trim);
      break;
    case 9:
      canvas.outlineRect(10, 36, 18, 6, trim);
      canvas.rect(13, 37, 12, 1, highlight);
      break;
  }

  drawRoundedFace(
    canvas,
    faceX,
    faceY,
    faceWidth,
    faceHeight,
    skin.base,
    skin.highlight,
    skin.shadow,
  );
  canvas.rect(faceX - 2, faceY + 11, 2, 6, skin.base);
  canvas.rect(faceX + faceWidth, faceY + 11, 2, 6, skin.shadow);
  drawPortraitHair(canvas, appearance, faceX, faceY, faceWidth);

  const eyeY = faceY + 14;
  const leftEye = faceX + 6;
  const rightEye = faceX + faceWidth - 8;
  canvas.rect(leftEye, eyeY, 3, 2, "ink");
  canvas.rect(rightEye, eyeY, 3, 2, "ink");
  canvas.set(leftEye + 1, eyeY, "highlight");
  canvas.set(rightEye + 1, eyeY, "highlight");
  canvas.rect(leftEye - 1, eyeY - 4, 4, 1, "deepOlive");
  canvas.rect(rightEye, eyeY - 4, 4, 1, "deepOlive");
  const center = Math.floor(PORTRAIT_SOURCE_WIDTH / 2);
  canvas.line(center, eyeY + 2, center - 1, eyeY + 6, skin.shadow);
  canvas.rect(center - 1, eyeY + 6, 3, 1, "skinDark");
  canvas.rect(center - 4, faceY + faceHeight - 4, 8, 1, "deepOlive");
  canvas.rect(center - 3, faceY + faceHeight - 3, 6, 1, skin.shadow);
  canvas.rect(faceX + 4, eyeY + 6, 3, 1, skin.highlight);
  canvas.rect(faceX + faceWidth - 7, eyeY + 6, 3, 1, skin.shadow);

  const mouthY = faceY + faceHeight - 4;
  switch (appearance.headVariant) {
    case 3:
      canvas.set(faceX + 5, eyeY + 5, "skinDark");
      canvas.set(faceX + 7, eyeY + 7, "skinDark");
      canvas.set(faceX + faceWidth - 6, eyeY + 5, "skinDark");
      canvas.set(faceX + faceWidth - 8, eyeY + 7, "skinDark");
      break;
    case 4:
      canvas.rect(faceX + 5, eyeY + 6, 2, 1, "skinDark");
      canvas.set(faceX + faceWidth - 7, eyeY + 5, "skinDark");
      break;
    case 5:
      canvas.rect(center - 6, mouthY - 3, 5, 2, "ink");
      canvas.rect(center + 1, mouthY - 3, 5, 2, "ink");
      canvas.rect(center - 2, mouthY - 2, 4, 1, "deepOlive");
      break;
    case 6:
      canvas.rect(center - 4, mouthY + 1, 8, 2, "deepOlive");
      canvas.rect(center - 2, mouthY + 3, 4, 2, "ink");
      break;
    case 7:
      canvas.rect(faceX + 1, eyeY + 2, 3, 10, "deepOlive");
      canvas.rect(faceX + faceWidth - 4, eyeY + 2, 3, 10, "deepOlive");
      canvas.rect(center - 7, mouthY + 1, 14, 1, skin.shadow);
      break;
    case 8:
      canvas.rect(faceX - 2, eyeY + 7, 2, 3, "highlight");
      canvas.rect(faceX + faceWidth, eyeY + 7, 2, 3, "highlight");
      canvas.set(center - 7, mouthY - 2, skin.shadow);
      break;
    case 9:
      canvas.rect(faceX + 2, mouthY - 4, 3, 7, "deepOlive");
      canvas.rect(faceX + faceWidth - 5, mouthY - 4, 3, 7, "deepOlive");
      canvas.rect(center - 8, mouthY + 1, 16, 3, "deepOlive");
      canvas.rect(center - 4, mouthY + 4, 8, 2, "ink");
      break;
  }

  if (appearance.accessory === "glasses") {
    canvas.outlineRect(leftEye - 3, eyeY - 3, 8, 6, "paper");
    canvas.outlineRect(rightEye - 3, eyeY - 3, 8, 6, "paper");
    canvas.rect(leftEye + 5, eyeY - 1, Math.max(1, rightEye - leftEye - 7), 2, "ink");
    canvas.rect(faceX - 1, eyeY - 1, 4, 1, "ink");
    canvas.rect(faceX + faceWidth - 3, eyeY - 1, 4, 1, "ink");
  } else if (appearance.accessory === "headband") {
    canvas.rect(faceX, faceY + 5, faceWidth, 3, "paper");
    canvas.rect(faceX + 3, faceY + 5, faceWidth - 6, 1, "highlight");
  }

  return canvas.frame();
}

function drawDetailedPortraitRefinement(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
): void {
  const skin = skinColors(appearance);
  const hair = hairColors(appearance);
  const outfit = outfitColors(appearance);
  const head = numericHeadVariant(appearance);

  // The source portrait establishes the same saved identity as the map
  // sprite. These finer marks are deliberately portrait-only: they provide
  // readable eyes, hair texture, collars, seams, and role detail at the
  // larger native grid rather than scaling a walking frame.
  if (!isNonhumanHead(appearance)) {
    const faceLeft = 13;
    const faceRight = 42;
    const eyeY = 27;
    canvas.rect(20, eyeY, 5, 3, "ink");
    canvas.rect(32, eyeY, 5, 3, "ink");
    canvas.set(22, eyeY, "highlight");
    canvas.set(34, eyeY, "highlight");
    canvas.rect(18, eyeY - 4, 7, 1, "deepOlive");
    canvas.rect(32, eyeY - 4, 7, 1, "deepOlive");
    canvas.line(28, eyeY + 3, 27, eyeY + 8, skin.shadow);
    canvas.rect(26, eyeY + 8, 4, 1, "skinDark");
    canvas.rect(24, 39, 8, 1, "deepOlive");
    canvas.rect(25, 40, 6, 1, skin.shadow);
    canvas.set(faceLeft + 3, 34, skin.highlight);
    canvas.set(faceRight - 3, 34, skin.shadow);

    if (appearance.hairStyle !== "none") {
      // A compact, descriptor-driven hairline makes the portrait silhouettes
      // distinct while retaining the source frame's larger hairstyle shape.
      canvas.rect(18, 7, 20, 3, hair.base);
      canvas.rect(21, 6, 13, 1, hair.highlight);
      if (appearance.hairStyle === "parted") {
        canvas.line(28, 7, 28, 13, "skinLight");
      } else if (appearance.hairStyle === "curly") {
        for (let x = 16; x <= 40; x += 5) {
          canvas.ellipse(x, 10 + ((x / 5) % 2), 2, 2, hair.base);
          canvas.set(x - 1, 8, hair.highlight);
        }
      } else if (appearance.hairStyle === "bun") {
        canvas.ellipse(42, 10, 4, 4, hair.base);
        canvas.set(44, 8, hair.highlight);
      } else {
        canvas.rect(15, 10, 3, 12, hair.base);
        canvas.rect(38, 10, 3, 11, hair.base);
      }
    } else {
      canvas.rect(21, 8, 14, 2, skin.highlight);
    }

    // Small, deterministic distinguishing details avoid a generic bust even
    // when two presets share a hair family.
    if (head % 5 === 1) {
      canvas.set(18, 35, "skinDark");
      canvas.set(20, 36, "skinDark");
    } else if (head % 5 === 2) {
      canvas.set(40, 35, "skinDark");
      canvas.set(38, 36, "skinDark");
    } else if (head % 5 === 3) {
      canvas.set(15, 31, "highlight");
      canvas.set(41, 31, "highlight");
    } else if (head % 5 === 4) {
      canvas.set(15, 34, outfit.highlight);
    }
  } else {
    // Nonhuman portraits retain their bespoke source silhouettes, with a few
    // close-up glints and garment seams instead of being humanized.
    canvas.set(22, 25, "highlight");
    canvas.set(34, 25, "highlight");
    canvas.rect(25, 38, 6, 1, "deepOlive");
  }

  canvas.line(15, 48, 28, 61, outfit.trim);
  canvas.line(41, 48, 29, 61, outfit.trim);
  canvas.rect(27, 49, 3, 12, outfit.secondary);
  canvas.rect(12, 56, 9, 1, outfit.highlight);
  canvas.rect(35, 56, 9, 1, outfit.highlight);
  canvas.outlineRect(37, 52, 5, 6, outfit.secondary, "ink");
  canvas.set(39, 53, "paper");
  if (appearance.roleStyle === "founder") {
    canvas.line(18, 49, 20, 61, "deepOlive");
    canvas.line(38, 49, 36, 61, "deepOlive");
    canvas.ellipse(28, 60, 2, 2, "deepOlive");
  }
}

function getDetailedPortraitFrame(
  source: PixelFrame,
  appearance: ResolvedCharacterAppearance,
): PixelFrame {
  const canvas = new PixelCanvas(
    CHARACTER_PORTRAIT_WIDTH,
    CHARACTER_PORTRAIT_HEIGHT,
  );
  for (const cell of source.cells) {
    const left = Math.floor((cell.x * CHARACTER_PORTRAIT_WIDTH) / source.width);
    const right = Math.max(
      left + 1,
      Math.floor(((cell.x + 1) * CHARACTER_PORTRAIT_WIDTH) / source.width),
    );
    const top = Math.floor((cell.y * CHARACTER_PORTRAIT_HEIGHT) / source.height);
    const bottom = Math.max(
      top + 1,
      Math.floor(((cell.y + 1) * CHARACTER_PORTRAIT_HEIGHT) / source.height),
    );
    canvas.rect(left, top, right - left, bottom - top, cell.color);
  }
  drawDetailedPortraitRefinement(canvas, appearance);
  return canvas.frame();
}

export function getCharacterPortraitFrame(
  sourceAppearance: PixelAppearanceDescriptor,
  roleStyle?: PixelRoleStyle,
): PixelFrame {
  const appearance = resolveCharacterAppearance(sourceAppearance, roleStyle);
  return getDetailedPortraitFrame(
    getCharacterPortraitSourceFrame(sourceAppearance, roleStyle),
    appearance,
  );
}

export function getCharacterPixelFrame(
  sourceAppearance: PixelAppearanceDescriptor,
  options: CharacterFrameOptions = {},
): PixelFrame {
  const appearance = resolveCharacterAppearance(
    sourceAppearance,
    options.roleStyle,
  );
  const direction = options.direction ?? "front";
  const pose = options.pose ?? "idle";
  const canvas = new PixelCanvas(MAP_WIDTH, MAP_HEIGHT);
  drawMapShadow(canvas, pose);

  if (direction === "front") {
    drawMapFrontBody(canvas, appearance, pose);
    drawFrontHead(canvas, appearance);
  } else if (direction === "side") {
    drawSideBody(canvas, appearance, pose);
    drawSideHead(canvas, appearance);
  } else {
    drawBackBody(canvas, appearance, pose);
    drawBackHead(canvas, appearance);
  }
  const frame = canvas.frame();
  if (pose === "seated") {
    return seatedFrame(frame, direction);
  }
  if (pose === "working") {
    return workingFrame(frame, direction, skinColors(appearance).base);
  }
  if (pose === "interaction") {
    return interactionFrame(frame, direction, skinColors(appearance).base);
  }
  return frame;
}

export function characterAppearanceSignature(
  appearance: PixelAppearanceDescriptor,
): string {
  const resolved = resolveCharacterAppearance(appearance);
  return [
    resolved.skinTone,
    resolved.hairStyle,
    resolved.hairShade,
    resolved.faceStyle,
    resolved.headVariant,
    resolved.bodyShape,
    resolved.outfitStyle,
    resolved.outfitShade,
    resolved.bodyVariant,
    resolved.roleStyle,
    resolved.accessory,
  ].join(":");
}
