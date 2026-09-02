import {
  isAuthoredAdultPatientIdentity,
  type PixelAppearanceDescriptor,
} from "@gamify-surgery/game-domain";
import {
  CHARACTER_ATLASES_V1,
  FOUNDER_CHARACTER_ATLASES_V4,
  PATIENT_CHARACTER_ATLASES_V1,
  resolvePublicArtAssetUrl,
  type BitmapAssetDescriptor,
} from "./bitmapAssetManifest";
import type { CharacterDirection, CharacterPose } from "./characterArt";

export type CharacterAtlasView = "front" | "left" | "right" | "back";

/** A full, clean actor frame. v3 replaces independently cropped head/body
 * planes: one frame owns the whole person and cannot expose a neighbouring
 * contact-sheet fragment between the neck and shoulders. */
export interface CharacterBitmapLayer {
  readonly atlas: BitmapAssetDescriptor;
  readonly variant: number;
  readonly flipX: boolean;
}

export interface CharacterBitmapLayers {
  readonly actor: CharacterBitmapLayer;
  /** Compatibility aliases point at the same unified actor frame. */
  readonly head: CharacterBitmapLayer;
  readonly body: CharacterBitmapLayer;
  readonly direction: CharacterAtlasView;
  readonly pose: CharacterPose;
}

export interface CharacterBitmapRegistration {
  readonly cell: Readonly<{ width: number; height: number }>;
  readonly neckY: number;
  readonly floorY: number;
  readonly floorAnchorY: number;
  readonly displayAspectRatio: number;
}

export const CHARACTER_BITMAP_REGISTRATION_V3: CharacterBitmapRegistration = {
  cell: { width: 160, height: 240 },
  neckY: 102,
  floorY: 220,
  floorAnchorY: 220 / 240,
  displayAspectRatio: 160 / 240,
};
export const FOUNDER_BITMAP_REGISTRATION_V4: CharacterBitmapRegistration = {
  // All approved high-resolution pose-sheet extractions retain visible feet
  // through y=180 and a transparent bottom safety margin. Anchor at y=181: the true
  // floor-contact baseline, not the PNG's lower canvas edge.  This preserves
  // full feet and keeps idle/walk poses on one stable world floor.
  cell: { width: 128, height: 192 }, neckY: 0, floorY: 181, floorAnchorY: 181 / 192, displayAspectRatio: 128 / 192,
};
export const PATIENT_BITMAP_REGISTRATION_V1: CharacterBitmapRegistration = {
  cell: { width: 128, height: 192 },
  neckY: 0,
  floorY: 181,
  floorAnchorY: 181 / 192,
  displayAspectRatio: 128 / 192,
};
/** @deprecated retained for consumers while v3 is adopted. */
export const CHARACTER_BITMAP_REGISTRATION_V2 = CHARACTER_BITMAP_REGISTRATION_V3;

const atlasById = new Map([
  ...CHARACTER_ATLASES_V1,
  ...FOUNDER_CHARACTER_ATLASES_V4,
  ...PATIENT_CHARACTER_ATLASES_V1,
].map((item) => [item.id, item]));
function atlas(id: string): BitmapAssetDescriptor {
  const selected = atlasById.get(id);
  if (!selected) throw new Error(`Missing canonical character atlas ${id}.`);
  return selected;
}

export function canonicalAppearanceVariant(
  appearance: PixelAppearanceDescriptor,
  key: "headVariant" | "bodyVariant",
): number {
  const value = appearance[key];
  return typeof value === "number" && value >= 0 && value < 30
    ? Math.floor(value)
    : 0;
}

/**
 * Presentation-only identity projection. Previous saves could contain any of
 * 900 head/body pairs, including incompatible neck/skin source layers. v3
 * projects those descriptors onto the stable head identity without mutating a
 * save. New creator choices already persist the corresponding identity pair.
 */
export function coherentCharacterVariant(appearance: PixelAppearanceDescriptor): number {
  return canonicalAppearanceVariant(appearance, "headVariant");
}

/** Legacy public helper: a role must never substitute a differently skinned body. */
export function displayedBodyVariant(appearance: PixelAppearanceDescriptor): number {
  return coherentCharacterVariant(appearance);
}

function resolveActorAtlas(
  direction: CharacterDirection,
  pose: CharacterPose,
): { id: string; view: CharacterAtlasView } {
  if (pose === "walk-a") return { id: "character:actors-left-walk-a-v3", view: "left" };
  if (pose === "walk-b") return { id: "character:actors-left-walk-b-v3", view: "left" };
  if (pose === "seated") return { id: "character:actors-front-seated-v3", view: "front" };
  if (pose === "working") return { id: "character:actors-front-working-v3", view: "front" };
  if (pose === "interaction") return { id: "character:actors-left-interaction-v3", view: "left" };
  if (pose === "jump-recovery") return { id: "character:actors-front-idle-v3", view: "front" };
  if (pose === "star-jump") return { id: "character:actors-front-star-jump-v3", view: "front" };
  if (direction === "back") return { id: "character:actors-back-idle-v3", view: "back" };
  if (direction === "side") return { id: "character:actors-left-idle-v3", view: "left" };
  return { id: "character:actors-front-idle-v3", view: "front" };
}

function resolveFounderV4Atlas(direction: CharacterDirection, pose: CharacterPose, movingRight: boolean): { id: string; view: CharacterAtlasView } {
  if (pose === "walk-a" || pose === "walk-b") {
    const phase = pose === "walk-a" ? "a" : "b";
    const view = direction === "front" ? "front" : direction === "back" ? "back" : movingRight ? "right" : "left";
    return { id: `character:founders-${view}-walk-${phase}-v4-r9-hires`, view };
  }
  if (pose === "seated") return { id: "character:founders-front-seated-v4-r9-hires", view: "front" };
  if (pose === "working") return { id: "character:founders-front-working-v4-r9-hires", view: "front" };
  if (pose === "interaction") return { id: "character:founders-clipboard-v4-r9-hires", view: "front" };
  if (pose === "jump-recovery") return { id: "character:founders-jump-recovery-v4-r9-hires", view: "front" };
  if (pose === "star-jump") return { id: "character:founders-star-jump-v4-r9-hires", view: "front" };
  const view = direction === "front" ? "front" : direction === "back" ? "back" : movingRight ? "right" : "left";
  return { id: `character:founders-${view}-idle-v4-r9-hires`, view };
}

function resolvePatientV1Atlas(
  direction: CharacterDirection,
  pose: CharacterPose,
  movingRight: boolean,
  representation: "thumbnail" | "portrait" | undefined,
): { id: string; view: CharacterAtlasView } {
  if (representation === "portrait") {
    return { id: "character:patients-portrait-v1-r7-hires", view: "front" };
  }
  if (representation === "thumbnail") {
    return { id: "character:patients-thumbnail-v1-r7-hires", view: "front" };
  }
  const view = direction === "front"
    ? "front"
    : direction === "back"
      ? "back"
      : movingRight ? "right" : "left";
  if (pose === "walk-a" || pose === "walk-neutral" || pose === "walk-b") {
    const phase = pose === "walk-a" ? "a" : pose === "walk-b" ? "b" : "neutral";
    return {
      id: `character:patients-${view}-walk-${phase}-v1-r7-hires`,
      view,
    };
  }
  if (pose === "seated") {
    const seatedView = direction === "side" ? view : "front";
    return { id: `character:patients-seated-${seatedView}-v1-r7-hires`, view: seatedView };
  }
  return { id: `character:patients-${view}-idle-v1-r7-hires`, view };
}

export function patientV1AtlasCell(
  appearance: PixelAppearanceDescriptor,
): number | null {
  const identityId = appearance.patientIdentityId;
  if (!isAuthoredAdultPatientIdentity(identityId)) return null;
  const suffix = Number(identityId.slice("patient.adult.".length));
  return Number.isInteger(suffix) && suffix >= 1 && suffix <= 50
    ? suffix - 1
    : null;
}

export function isPatientV1Appearance(
  appearance: PixelAppearanceDescriptor,
): boolean {
  return appearance.roleStyle === "patient" && patientV1AtlasCell(appearance) !== null;
}

export function characterBitmapLayers(
  appearance: PixelAppearanceDescriptor,
  direction: CharacterDirection,
  pose: CharacterPose,
  movingRight = false,
  representation?: "thumbnail" | "portrait",
): CharacterBitmapLayers {
  const founder = appearance.roleStyle === "founder";
  const patientV1 = isPatientV1Appearance(appearance);
  const selected = patientV1
    ? resolvePatientV1Atlas(direction, pose, movingRight, representation)
    : founder && representation === "portrait"
    ? { id: "character:founders-portrait-v4-r9-hires", view: "front" as const }
    : founder ? resolveFounderV4Atlas(direction, pose, movingRight) : resolveActorAtlas(direction, pose);
  const actor: CharacterBitmapLayer = {
    atlas: atlas(selected.id),
    variant: patientV1 ? patientV1AtlasCell(appearance)! : coherentCharacterVariant(appearance),
    // Patient-v1 r7-hires and founder r9-hires both contain explicit east-facing frames.
    // v3 is the only fallback package that still mirrors left-facing art.
    flipX: !patientV1 && !founder && selected.view === "left" && movingRight,
  };
  return { actor, head: actor, body: actor, direction: selected.view, pose };
}

export function characterBitmapRegistration(
  layers?: CharacterBitmapLayers,
): CharacterBitmapRegistration {
  if (layers?.actor.atlas.id.includes("patients-")) return PATIENT_BITMAP_REGISTRATION_V1;
  return layers?.actor.atlas.id.includes("founders-") ? FOUNDER_BITMAP_REGISTRATION_V4 : CHARACTER_BITMAP_REGISTRATION_V3;
}

export function characterAtlasCellStyle(layer: CharacterBitmapLayer): Record<string, string> {
  const column = layer.variant % 5;
  const row = Math.floor(layer.variant / 5);
  const patientV1 = layer.atlas.id.includes("patients-");
  return {
    backgroundImage: `url("${resolvePublicArtAssetUrl(layer.atlas.relativePath!)}")`,
    backgroundSize: patientV1 ? "500% 1000%" : "500% 600%",
    backgroundPosition: patientV1
      ? `${column * 25}% ${row * (100 / 9)}%`
      : `${column * 25}% ${row * 20}%`,
    transform: layer.flipX ? "scaleX(-1)" : "none",
  };
}

export function characterAtlasFrameKey(layer: CharacterBitmapLayer): string {
  return `frame:character:${layer.atlas.id}:${layer.variant}`;
}

export function allCanonicalCharacterAtlases(): readonly BitmapAssetDescriptor[] {
  return [...CHARACTER_ATLASES_V1, ...FOUNDER_CHARACTER_ATLASES_V4];
}
