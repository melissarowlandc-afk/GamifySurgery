import registryData from "./characterStillRegistry.generated.json";
import { PEDIATRIC_CHARACTER_STILLS } from "@gamify-surgery/game-domain";
import { resolvePublicArtAssetUrl } from "./bitmapAssetManifest";

export const CHARACTER_STILL_DIRECTIONS = ["south", "east", "west", "north"] as const;
export const CHARACTER_STILL_POSTURES = ["stand", "sit"] as const;

export type CharacterStillDirection = (typeof CHARACTER_STILL_DIRECTIONS)[number];
export type CharacterStillPosture = (typeof CHARACTER_STILL_POSTURES)[number];
export type CharacterStillCohort = "gs018" | "employee20" | "patientPublic20" | "employeeCoverage" | "level3RosterV2" | "patientWomen20V3" | "patientDemographics20V4" | "futureRoster20V5" | "patientGapfillV6a" | "patientGapfillV6b" | "patientGapfillV6c" | "staffGapfillV6d";

export interface CharacterStillAsset {
  readonly url: string;
  readonly sha256: string;
  readonly width: 160;
  readonly height: 320;
  readonly anchors: Readonly<{
    bodyAxisX: number;
    floorY: number;
    seatContactY?: number;
  }>;
  readonly visibleBounds: Readonly<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}

export type CharacterStillCardinals = Readonly<Record<CharacterStillDirection, CharacterStillAsset>>;

export interface CharacterStillEntry {
  readonly id: string;
  readonly cohort: CharacterStillCohort;
  readonly category: string;
  readonly role?: string;
  /** Explicit current role membership; planned roles use an empty list. */
  readonly eligibleStaffRoleDefinitionIds?: readonly string[];
  /** Editorial roadmap metadata does not grant staffing eligibility. */
  readonly plannedStaffRole?: Readonly<{
    label: string;
    facilityLevel: number;
    status: "roadmap-only" | "referenced-not-yet-defined";
    roleDefinitionId?: string;
    evidencePaths: readonly string[];
  }>;
  readonly intendedAge?: number;
  readonly intendedSex?: string;
  readonly displayGender?: string;
  /** Editorial-only display metadata; never a clinical case selector. */
  readonly intendedVisualAge?: number;
  readonly minimumAge?: number;
  readonly maximumAge?: number;
  /** Explicit gate for future assets that must not enter the current case pool. */
  readonly currentClinicalEligibility?: "excluded-until-future-approved-pediatric-release";
  /** Explicit release gate for future staff presentation art. */
  readonly availability?: "level4-locked";
  readonly poses: Readonly<Record<CharacterStillPosture, CharacterStillCardinals>>;
  readonly clipboard?: CharacterStillAsset;
}

interface CharacterStillRegistry {
  readonly schemaVersion: "gs026-character-still-runtime-registry/v1";
  readonly integrationStatus: "owner-authorized-local-integration-not-published" | "agent-production-qa-accepted-local-integration-authorized-not-published";
  readonly baseUrl: string;
  readonly canvas: Readonly<{ width: 160; height: 320; axisX: 80; floorY: 287 }>;
  readonly counts: Readonly<{ identities: number; cardinalPoses: number; clipboardPoses: number; assets: number }>;
  readonly characters: readonly CharacterStillEntry[];
}

const approvedRegistry = registryData as unknown as CharacterStillRegistry;
// M4 staffing promotion only. The eight approved source poses/contacts for each
// APP remain byte-identical; walking uses the existing cardinal-still hop motion.
export const characterStillRegistry: CharacterStillRegistry = {
  ...approvedRegistry,
  characters: approvedRegistry.characters.map((entry) => {
    const child = PEDIATRIC_CHARACTER_STILLS.find(row => row.stillId === entry.id);
    if (child) {
      const { currentClinicalEligibility: _futureGate, ...current } = entry;
      return { ...current, category: "pediatric-presentation", intendedSex: child.compatibleSexLabel,
        minimumAge: child.minimumAge, maximumAge: child.maximumAge };
    }
    if (entry.id !== "future-roster20-v5.001" && entry.id !== "future-roster20-v5.002") return entry;
    const { plannedStaffRole: _planned, ...current } = entry;
    return { ...current, role: "staff.app", eligibleStaffRoleDefinitionIds: ["staff.app"] };
  }),
};
const entriesById = new Map(characterStillRegistry.characters.map((entry) => [entry.id, entry] as const));

export function getAllCharacterStillEntries(): readonly CharacterStillEntry[] {
  return characterStillRegistry.characters;
}

export function getCharacterStillEntry(id: string): CharacterStillEntry | undefined {
  return entriesById.get(id);
}

export function getCharacterStill(
  id: string,
  posture: CharacterStillPosture,
  direction: CharacterStillDirection,
): CharacterStillAsset | undefined {
  return entriesById.get(id)?.poses[posture][direction];
}

export function getClipboardStill(id: string): CharacterStillAsset | undefined {
  return entriesById.get(id)?.clipboard;
}

export function resolveCharacterStillAssetUrl(asset: CharacterStillAsset, basePath?: string): string {
  return resolvePublicArtAssetUrl(asset.url, basePath);
}
