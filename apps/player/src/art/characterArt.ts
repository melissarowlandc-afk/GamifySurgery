import {
  normalizePixelAppearance,
  type PixelAppearanceDescriptor,
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
  | "star-jump";

export interface CharacterFrameOptions {
  direction?: CharacterDirection;
  pose?: CharacterPose;
  roleStyle?: PixelRoleStyle;
}

export interface ResolvedCharacterAppearance
  extends PixelAppearanceDescriptor {
  skinTone: 0 | 1 | 2 | 3;
  headVariant: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  bodyVariant: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  roleStyle: PixelRoleStyle;
}

const MAP_WIDTH = 24;
const MAP_HEIGHT = 36;
const PORTRAIT_WIDTH = 38;
const PORTRAIT_HEIGHT = 42;

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

function drawFrontHead(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
): void {
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

function drawMapFrontBody(
  canvas: PixelCanvas,
  appearance: ResolvedCharacterAppearance,
  pose: CharacterPose,
): void {
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
  const swing = pose === "walk-b" ? -1 : 1;
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

export function getCharacterPortraitFrame(
  sourceAppearance: PixelAppearanceDescriptor,
  roleStyle?: PixelRoleStyle,
): PixelFrame {
  const appearance = resolveCharacterAppearance(
    sourceAppearance,
    roleStyle,
  );
  const canvas = new PixelCanvas(PORTRAIT_WIDTH, PORTRAIT_HEIGHT);
  const skin = skinColors(appearance);
  const { primary, secondary, trim, highlight } = outfitColors(appearance);
  const faceWidth =
    appearance.faceStyle === "square"
      ? 24
      : appearance.faceStyle === "round"
        ? 23
        : 21;
  const faceHeight = appearance.faceStyle === "long" ? 27 : 25;
  const faceX = Math.floor((PORTRAIT_WIDTH - faceWidth) / 2);
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
  const center = Math.floor(PORTRAIT_WIDTH / 2);
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
  return canvas.frame();
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
