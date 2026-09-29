import registryData from "./characterWalkRegistry.generated.json";
import { resolvePublicArtAssetUrl } from "./bitmapAssetManifest";
import type { CharacterStillAsset, CharacterStillDirection } from "./characterStillRegistry";

export const CHARACTER_WALK_FRAME_COUNT = 8;
export const CHARACTER_WALK_CADENCE_MS = 180;

export type CharacterWalkApprovalStatus =
  | "owner-approved"
  | "generated-owner-review-pending"
  | "production-reviewed-owner-authorized";
export type CharacterWalkAsset = CharacterStillAsset;

export interface CharacterWalkDirectionEntry {
  readonly approvalStatus: CharacterWalkApprovalStatus;
  readonly sourceSetId: string;
  readonly sourceManifestSha256: string;
  readonly frames: readonly CharacterWalkAsset[];
}

export interface CharacterWalkEntry {
  readonly id: string;
  readonly directions: Readonly<Record<CharacterStillDirection, CharacterWalkDirectionEntry>>;
}

interface CharacterWalkRegistry {
  readonly schemaVersion: "gs026-simple-cardinal-walk-runtime-registry/v1";
  readonly integrationStatus: "owner-authorized-local-pilot-not-published";
  readonly canvas: Readonly<{ width: 160; height: 320; axisX: 80; floorY: 287 }>;
  readonly cadenceMs: 180;
  readonly characters: readonly CharacterWalkEntry[];
}

export const characterWalkRegistry = registryData as unknown as CharacterWalkRegistry;
const entriesById = new Map(characterWalkRegistry.characters.map((entry) => [entry.id, entry] as const));

export function getAllCharacterWalkEntries(): readonly CharacterWalkEntry[] {
  return characterWalkRegistry.characters;
}

export function getCharacterWalkEntry(id: string): CharacterWalkEntry | undefined {
  return entriesById.get(id);
}

export function getCharacterWalkFrame(
  id: string,
  direction: CharacterStillDirection,
  frameIndex: number,
): CharacterWalkAsset | undefined {
  if (!Number.isFinite(frameIndex)) return undefined;
  const normalizedIndex = ((Math.floor(frameIndex) % CHARACTER_WALK_FRAME_COUNT) + CHARACTER_WALK_FRAME_COUNT) % CHARACTER_WALK_FRAME_COUNT;
  return entriesById.get(id)?.directions[direction].frames[normalizedIndex];
}

export function characterWalkFrameAt(elapsedMilliseconds: number): number {
  if (!Number.isFinite(elapsedMilliseconds) || elapsedMilliseconds <= 0) return 0;
  return Math.floor(elapsedMilliseconds / CHARACTER_WALK_CADENCE_MS) % CHARACTER_WALK_FRAME_COUNT;
}

export function resolveCharacterWalkAssetUrl(asset: CharacterWalkAsset, basePath?: string): string {
  return resolvePublicArtAssetUrl(asset.url, basePath);
}
