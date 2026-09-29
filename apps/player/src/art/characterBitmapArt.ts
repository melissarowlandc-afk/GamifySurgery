import type { PixelAppearanceDescriptor } from "@gamify-surgery/game-domain";
import type { CharacterDirection, CharacterPose } from "./characterArt";
import type { BitmapAssetDescriptor } from "./bitmapAssetManifest";
import {
  getCharacterStill,
  getCharacterStillEntry,
  getClipboardStill,
  resolveCharacterStillAssetUrl,
  type CharacterStillAsset,
  type CharacterStillDirection,
} from "./characterStillRegistry";
import {
  getCharacterWalkEntry,
  getCharacterWalkFrame,
  type CharacterWalkAsset,
} from "./characterWalkRegistry";

export type CharacterAtlasView = "front" | "left" | "right" | "back";

export interface CharacterBitmapLayer {
  readonly atlas: BitmapAssetDescriptor;
  readonly variant: 0;
  readonly flipX: false;
  readonly stillId: string;
  readonly asset: CharacterStillAsset | CharacterWalkAsset;
}

export interface CharacterBitmapLayers {
  readonly actor: CharacterBitmapLayer;
  readonly head: CharacterBitmapLayer;
  readonly body: CharacterBitmapLayer;
  readonly direction: CharacterAtlasView;
  readonly pose: CharacterPose;
}

export const CHARACTER_STILL_VISIBLE_HEIGHT_CAP = 246;

export interface CharacterBitmapRegistration {
  readonly cell: Readonly<{ width: 160; height: 320 }>;
  readonly neckY: 0;
  readonly floorY: number;
  readonly floorAnchorY: number;
  readonly displayAspectRatio: 0.5;
  readonly seatContactY?: number;
  readonly visibleBounds: CharacterStillAsset["visibleBounds"];
}

export const CHARACTER_STILL_BITMAP_REGISTRATION: CharacterBitmapRegistration = {
  cell: { width: 160, height: 320 }, neckY: 0, floorY: 287,
  floorAnchorY: 287 / 320, displayAspectRatio: 0.5,
  visibleBounds: { x: 0, y: 0, width: 160, height: 320 },
};
export const CHARACTER_BITMAP_REGISTRATION_V3 = CHARACTER_STILL_BITMAP_REGISTRATION;
export const CHARACTER_BITMAP_REGISTRATION_V2 = CHARACTER_STILL_BITMAP_REGISTRATION;
export const FOUNDER_BITMAP_REGISTRATION_V4 = CHARACTER_STILL_BITMAP_REGISTRATION;
export const PATIENT_BITMAP_REGISTRATION_V1 = CHARACTER_STILL_BITMAP_REGISTRATION;

export function canonicalAppearanceVariant(appearance: PixelAppearanceDescriptor, key: "headVariant" | "bodyVariant"): number {
  const value = appearance[key];
  return typeof value === "number" && value >= 0 && value < 30 ? Math.floor(value) : 0;
}
export function coherentCharacterVariant(appearance: PixelAppearanceDescriptor): number {
  return canonicalAppearanceVariant(appearance, "headVariant");
}
export function displayedBodyVariant(appearance: PixelAppearanceDescriptor): number {
  return coherentCharacterVariant(appearance);
}

export function characterStillIdForAppearance(appearance: PixelAppearanceDescriptor): string | undefined {
  if (appearance.stillId) return getCharacterStillEntry(appearance.stillId) ? appearance.stillId : undefined;
  if (appearance.patientIdentityId && getCharacterStillEntry(appearance.patientIdentityId)) return appearance.patientIdentityId;
  return undefined;
}

export function characterStillDirection(direction: CharacterDirection, movingRight = false): CharacterStillDirection {
  if (direction === "front") return "south";
  if (direction === "back") return "north";
  return movingRight ? "east" : "west";
}

function viewFor(direction: CharacterStillDirection): CharacterAtlasView {
  return direction === "south" ? "front" : direction === "north" ? "back" : direction === "east" ? "right" : "left";
}

function descriptor(stillId: string, asset: CharacterStillAsset): BitmapAssetDescriptor {
  return {
    id: `character-still:${stillId}:${asset.sha256.slice(0, 12)}`,
    relativePath: asset.url, nativeWidth: asset.width, nativeHeight: asset.height,
    anchor: { x: asset.anchors.bodyAxisX, y: asset.anchors.floorY }, orientation: "all", kind: "character",
  };
}

export function characterWalkingBitmapDescriptors(
  appearance: PixelAppearanceDescriptor,
): readonly BitmapAssetDescriptor[] {
  const stillId = characterStillIdForAppearance(appearance);
  if (!stillId) return [];
  const entry = getCharacterWalkEntry(stillId);
  if (!entry) return [];
  return (["south", "east", "west", "north"] as const).flatMap((direction) =>
    entry.directions[direction].frames.map((asset) => descriptor(stillId, asset)),
  );
}

/** One downward-only factor per identity, derived from its canonical standing
 * South silhouette and reused for every direction, posture, and clipboard. */
export function characterStillScaleForAppearance(
  appearance: PixelAppearanceDescriptor,
): number {
  const stillId = characterStillIdForAppearance(appearance);
  const south = stillId ? getCharacterStill(stillId, "stand", "south") : undefined;
  if (!south) return 1;
  const visibleHeight = south.anchors.floorY - south.visibleBounds.y;
  return Number.isFinite(visibleHeight) && visibleHeight > 0
    ? Math.min(1, CHARACTER_STILL_VISIBLE_HEIGHT_CAP / visibleHeight)
    : 1;
}

/** Bounded live prefetch: four standing cardinals for one selected identity. */
export function characterStandingBitmapDescriptors(
  appearance: PixelAppearanceDescriptor,
): readonly BitmapAssetDescriptor[] {
  const stillId = characterStillIdForAppearance(appearance);
  if (!stillId) return [];
  const entry = getCharacterStillEntry(stillId);
  if (!entry) return [];
  return (["south", "east", "west", "north"] as const).map((direction) =>
    descriptor(stillId, entry.poses.stand[direction]),
  );
}

/** An explicit walk frame opts a registered pilot into authored movement;
 * omitted frames and unregistered identities retain the directional still. */
export function characterBitmapLayers(
  appearance: PixelAppearanceDescriptor,
  direction: CharacterDirection,
  pose: CharacterPose,
  movingRight = false,
  _representation?: "thumbnail" | "portrait",
  walkFrame?: number,
): CharacterBitmapLayers | undefined {
  const stillId = characterStillIdForAppearance(appearance);
  if (!stillId) return undefined;
  const cardinal = characterStillDirection(direction, movingRight);
  const seated = pose === "seated" || pose === "exam-table";
  const clipboard = pose === "interaction" && appearance.roleStyle === "founder" ? getClipboardStill(stillId) : undefined;
  const walking = pose === "walk-a" || pose === "walk-neutral" || pose === "walk-b";
  const walkAsset = walking && walkFrame !== undefined
    ? getCharacterWalkFrame(stillId, cardinal, walkFrame)
    : undefined;
  const asset = clipboard ?? walkAsset ?? getCharacterStill(stillId, seated ? "sit" : "stand", cardinal);
  if (!asset) return undefined;
  const actor: CharacterBitmapLayer = { atlas: descriptor(stillId, asset), variant: 0, flipX: false, stillId, asset };
  return { actor, head: actor, body: actor, direction: viewFor(clipboard ? "south" : cardinal), pose };
}

export function characterBitmapRegistration(layers?: CharacterBitmapLayers): CharacterBitmapRegistration {
  const asset = layers?.actor.asset;
  return asset ? {
    ...CHARACTER_STILL_BITMAP_REGISTRATION,
    floorY: asset.anchors.floorY,
    floorAnchorY: asset.anchors.floorY / asset.height,
    seatContactY: asset.anchors.seatContactY,
    visibleBounds: asset.visibleBounds,
  } : CHARACTER_STILL_BITMAP_REGISTRATION;
}

export function characterAtlasCellStyle(layer: CharacterBitmapLayer): Record<string, string> {
  return { backgroundImage: `url("${resolveCharacterStillAssetUrl(layer.asset)}")`, backgroundSize: "100% 100%", backgroundPosition: "0 0", transform: "none" };
}
export function characterAtlasFrameKey(layer: CharacterBitmapLayer): string {
  return `frame:${layer.atlas.id}:0`;
}
/** Legacy preload hook. GS-026 stills load only when selected. */
export function allCanonicalCharacterAtlases(): readonly BitmapAssetDescriptor[] { return []; }

export function patientV1AtlasCell(appearance: PixelAppearanceDescriptor): number | null {
  const stillId = characterStillIdForAppearance(appearance);
  const match = stillId ? /^patient\.adult\.(\d{3})$/.exec(stillId) : null;
  return match ? Number(match[1]) - 1 : null;
}
export function isPatientV1Appearance(appearance: PixelAppearanceDescriptor): boolean {
  return appearance.roleStyle === "patient" && patientV1AtlasCell(appearance) !== null;
}
