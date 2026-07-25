import {
  createDeterministicRandom,
  RANDOM_STREAMS,
} from "./randomness";
import type { PixelAppearanceDescriptor } from "./types";

const BODY_SHAPES = ["compact", "average", "broad", "tall"] as const;
const HAIR_STYLES = ["none", "short", "parted", "curly", "bun"] as const;
const FACE_STYLES = ["round", "square", "long"] as const;
const OUTFIT_STYLES = ["plain", "striped", "checked", "coat"] as const;
const ACCESSORIES = ["none", "glasses", "badge", "headband"] as const;

const STAFF_NAMES = [
  "Alex",
  "Avery",
  "Bailey",
  "Blake",
  "Casey",
  "Dakota",
  "Drew",
  "Emery",
  "Finley",
  "Harper",
  "Jamie",
  "Jordan",
  "Kai",
  "Logan",
  "Morgan",
  "Parker",
  "Quinn",
  "Reese",
  "Riley",
  "Rowan",
  "Sam",
  "Taylor",
] as const;

const PATIENT_FIRST_NAMES = [
  "Avery",
  "Casey",
  "Devon",
  "Emery",
  "Jamie",
  "Jordan",
  "Morgan",
  "Quinn",
  "Reese",
  "Riley",
  "Robin",
  "Taylor",
] as const;

const PATIENT_LAST_NAMES = [
  "Ash",
  "Bell",
  "Brook",
  "Clay",
  "Day",
  "Field",
  "Gray",
  "Hart",
  "Lane",
  "Reed",
  "Stone",
  "Vale",
] as const;

export function createPixelAppearance(
  campaignSeed: string,
  subjectKind: "patient" | "staff",
  subjectId: string,
): PixelAppearanceDescriptor {
  const streamId =
    subjectKind === "patient"
      ? RANDOM_STREAMS.patientAppearance
      : RANDOM_STREAMS.staffAppearance;
  const random = createDeterministicRandom(
    campaignSeed,
    streamId,
    `${subjectId}:pixel-avatar.v1`,
  );

  return {
    version: "pixel-avatar.v1",
    bodyShape: BODY_SHAPES[random.integer(BODY_SHAPES.length)]!,
    hairStyle: HAIR_STYLES[random.integer(HAIR_STYLES.length)]!,
    hairShade: random.integer(4) as 0 | 1 | 2 | 3,
    faceStyle: FACE_STYLES[random.integer(FACE_STYLES.length)]!,
    outfitStyle: OUTFIT_STYLES[random.integer(OUTFIT_STYLES.length)]!,
    outfitShade: random.integer(4) as 0 | 1 | 2 | 3,
    accessory: ACCESSORIES[random.integer(ACCESSORIES.length)]!,
  };
}

export function createStaffDisplayName(
  campaignSeed: string,
  employeeId: string,
): string {
  const random = createDeterministicRandom(
    campaignSeed,
    RANDOM_STREAMS.staffAppearance,
    `${employeeId}:display-name.v1`,
  );
  return STAFF_NAMES[random.integer(STAFF_NAMES.length)]!;
}

export function createPatientDisplayName(
  campaignSeed: string,
  encounterId: string,
): string {
  const random = createDeterministicRandom(
    campaignSeed,
    RANDOM_STREAMS.patientIdentity,
    `${encounterId}:display-name.v1`,
  );
  const firstName =
    PATIENT_FIRST_NAMES[random.integer(PATIENT_FIRST_NAMES.length)]!;
  const lastName =
    PATIENT_LAST_NAMES[random.integer(PATIENT_LAST_NAMES.length)]!;
  return `${firstName} ${lastName}`;
}
