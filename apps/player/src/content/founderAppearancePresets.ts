import {
  normalizePixelAppearance,
  type PixelAppearanceDescriptor,
} from "@gamify-surgery/game-domain";

export type FounderPresetGroup = "classic" | "female" | "non-human";

export type FounderHeadPreset = {
  id: string;
  label: string;
  group: FounderPresetGroup;
} & Pick<
  PixelAppearanceDescriptor,
  | "hairStyle"
  | "hairShade"
  | "faceStyle"
  | "accessory"
  | "skinTone"
  | "headVariant"
>;

export type FounderBodyPreset = {
  id: string;
  label: string;
  group: FounderPresetGroup;
} & Pick<
  PixelAppearanceDescriptor,
  "bodyShape" | "outfitStyle" | "outfitShade" | "bodyVariant"
>;

/**
 * Stable persisted founder choices. Keep the original first ten IDs and
 * descriptor values unchanged so existing campaigns retain their identity.
 */
export const FOUNDER_HEAD_PRESETS = [
  { id: "head.01", label: "Close Crop", group: "classic", hairStyle: "short", hairShade: 3, faceStyle: "round", accessory: "none", skinTone: 0, headVariant: 0 },
  { id: "head.02", label: "Side Part and Glasses", group: "classic", hairStyle: "parted", hairShade: 2, faceStyle: "square", accessory: "glasses", skinTone: 1, headVariant: 1 },
  { id: "head.03", label: "Tousled Curls", group: "classic", hairStyle: "curly", hairShade: 1, faceStyle: "long", accessory: "none", skinTone: 2, headVariant: 2 },
  { id: "head.04", label: "Short Twists", group: "classic", hairStyle: "bun", hairShade: 3, faceStyle: "round", accessory: "headband", skinTone: 3, headVariant: 3 },
  { id: "head.05", label: "Full Beard and Glasses", group: "classic", hairStyle: "none", hairShade: 0, faceStyle: "square", accessory: "glasses", skinTone: 1, headVariant: 4 },
  { id: "head.06", label: "Sculpted Quiff", group: "classic", hairStyle: "short", hairShade: 1, faceStyle: "long", accessory: "badge", skinTone: 2, headVariant: 5 },
  { id: "head.07", label: "Side Part and Mustache", group: "classic", hairStyle: "parted", hairShade: 3, faceStyle: "round", accessory: "none", skinTone: 3, headVariant: 6 },
  { id: "head.08", label: "Side-Swept Waves", group: "classic", hairStyle: "curly", hairShade: 2, faceStyle: "square", accessory: "headband", skinTone: 0, headVariant: 7 },
  { id: "head.09", label: "Top Knot", group: "classic", hairStyle: "bun", hairShade: 1, faceStyle: "long", accessory: "glasses", skinTone: 1, headVariant: 8 },
  { id: "head.10", label: "Full Beard", group: "classic", hairStyle: "none", hairShade: 0, faceStyle: "round", accessory: "badge", skinTone: 2, headVariant: 9 },
  { id: "head.11", label: "Shoulder Waves", group: "female", hairStyle: "parted", hairShade: 3, faceStyle: "round", accessory: "none", skinTone: 0, headVariant: 10 },
  { id: "head.12", label: "Bob and Glasses", group: "female", hairStyle: "short", hairShade: 2, faceStyle: "square", accessory: "glasses", skinTone: 1, headVariant: 11 },
  { id: "head.13", label: "High Ponytail", group: "female", hairStyle: "bun", hairShade: 1, faceStyle: "long", accessory: "none", skinTone: 2, headVariant: 12 },
  { id: "head.14", label: "Twin Braids", group: "female", hairStyle: "parted", hairShade: 3, faceStyle: "round", accessory: "headband", skinTone: 3, headVariant: 13 },
  { id: "head.15", label: "Textured Pixie", group: "female", hairStyle: "short", hairShade: 0, faceStyle: "round", accessory: "none", skinTone: 1, headVariant: 14 },
  { id: "head.16", label: "Long Curls", group: "female", hairStyle: "curly", hairShade: 1, faceStyle: "long", accessory: "none", skinTone: 2, headVariant: 15 },
  { id: "head.17", label: "Low Ponytail and Glasses", group: "female", hairStyle: "parted", hairShade: 2, faceStyle: "square", accessory: "glasses", skinTone: 3, headVariant: 16 },
  { id: "head.18", label: "Loc Bun", group: "female", hairStyle: "bun", hairShade: 3, faceStyle: "round", accessory: "none", skinTone: 0, headVariant: 17 },
  { id: "head.19", label: "Bare Scalp and Earrings", group: "female", hairStyle: "curly", hairShade: 0, faceStyle: "long", accessory: "headband", skinTone: 1, headVariant: 18 },
  { id: "head.20", label: "Patterned Headwrap", group: "female", hairStyle: "bun", hairShade: 2, faceStyle: "round", accessory: "headband", skinTone: 2, headVariant: 19 },
  { id: "head.21", label: "Cat", group: "non-human", hairStyle: "short", hairShade: 3, faceStyle: "round", accessory: "none", skinTone: 1, headVariant: 20 },
  { id: "head.22", label: "Penguin", group: "non-human", hairStyle: "none", hairShade: 3, faceStyle: "round", accessory: "none", skinTone: 0, headVariant: 21 },
  { id: "head.23", label: "Fox", group: "non-human", hairStyle: "short", hairShade: 2, faceStyle: "long", accessory: "none", skinTone: 2, headVariant: 22 },
  { id: "head.24", label: "Rabbit", group: "non-human", hairStyle: "none", hairShade: 0, faceStyle: "long", accessory: "none", skinTone: 0, headVariant: 23 },
  { id: "head.25", label: "Owl", group: "non-human", hairStyle: "none", hairShade: 1, faceStyle: "round", accessory: "glasses", skinTone: 1, headVariant: 24 },
  { id: "head.26", label: "Frog", group: "non-human", hairStyle: "none", hairShade: 2, faceStyle: "round", accessory: "none", skinTone: 2, headVariant: 25 },
  { id: "head.27", label: "Moon Alien", group: "non-human", hairStyle: "none", hairShade: 1, faceStyle: "long", accessory: "none", skinTone: 1, headVariant: 26 },
  { id: "head.28", label: "Antenna Alien", group: "non-human", hairStyle: "none", hairShade: 2, faceStyle: "round", accessory: "none", skinTone: 2, headVariant: 27 },
  { id: "head.29", label: "Robot", group: "non-human", hairStyle: "none", hairShade: 0, faceStyle: "square", accessory: "badge", skinTone: 1, headVariant: 28 },
  { id: "head.30", label: "Axolotl", group: "non-human", hairStyle: "none", hairShade: 0, faceStyle: "round", accessory: "none", skinTone: 0, headVariant: 29 },
] as const satisfies readonly FounderHeadPreset[];

export const FOUNDER_BODY_PRESETS = [
  { id: "body.01", label: "Clinic Basics", group: "classic", bodyShape: "average", outfitStyle: "plain", outfitShade: 1, bodyVariant: 0 },
  { id: "body.02", label: "Striped Knit", group: "classic", bodyShape: "compact", outfitStyle: "striped", outfitShade: 2, bodyVariant: 1 },
  { id: "body.03", label: "Windowpane Vest", group: "classic", bodyShape: "broad", outfitStyle: "checked", outfitShade: 3, bodyVariant: 2 },
  { id: "body.04", label: "Long White Coat", group: "classic", bodyShape: "tall", outfitStyle: "coat", outfitShade: 2, bodyVariant: 3 },
  { id: "body.05", label: "Trim Pullover", group: "classic", bodyShape: "compact", outfitStyle: "plain", outfitShade: 3, bodyVariant: 4 },
  { id: "body.06", label: "Open Lab Coat", group: "classic", bodyShape: "average", outfitStyle: "coat", outfitShade: 1, bodyVariant: 5 },
  { id: "body.07", label: "Striped Utility Top", group: "classic", bodyShape: "broad", outfitStyle: "striped", outfitShade: 1, bodyVariant: 6 },
  { id: "body.08", label: "Checked Longline Top", group: "classic", bodyShape: "tall", outfitStyle: "checked", outfitShade: 2, bodyVariant: 7 },
  { id: "body.09", label: "Crosshatch Scrubs", group: "classic", bodyShape: "average", outfitStyle: "checked", outfitShade: 3, bodyVariant: 8 },
  { id: "body.10", label: "Pocketed Clinic Coat", group: "classic", bodyShape: "compact", outfitStyle: "coat", outfitShade: 2, bodyVariant: 9 },
  { id: "body.11", label: "Fitted Blazer", group: "female", bodyShape: "compact", outfitStyle: "plain", outfitShade: 1, bodyVariant: 10 },
  { id: "body.12", label: "Tailored Scrubs", group: "female", bodyShape: "average", outfitStyle: "plain", outfitShade: 2, bodyVariant: 11 },
  { id: "body.13", label: "Cardigan and Blouse", group: "female", bodyShape: "average", outfitStyle: "checked", outfitShade: 1, bodyVariant: 12 },
  { id: "body.14", label: "Belted Lab Coat", group: "female", bodyShape: "tall", outfitStyle: "coat", outfitShade: 0, bodyVariant: 13 },
  { id: "body.15", label: "Collared Dress", group: "female", bodyShape: "compact", outfitStyle: "coat", outfitShade: 2, bodyVariant: 14 },
  { id: "body.16", label: "Wrap Blouse", group: "female", bodyShape: "average", outfitStyle: "striped", outfitShade: 1, bodyVariant: 15 },
  { id: "body.17", label: "Sweater and Skirt", group: "female", bodyShape: "broad", outfitStyle: "plain", outfitShade: 2, bodyVariant: 16 },
  { id: "body.18", label: "Vest and Blouse", group: "female", bodyShape: "compact", outfitStyle: "checked", outfitShade: 0, bodyVariant: 17 },
  { id: "body.19", label: "Tunic and Trousers", group: "female", bodyShape: "tall", outfitStyle: "coat", outfitShade: 1, bodyVariant: 18 },
  { id: "body.20", label: "Blouse and Long Skirt", group: "female", bodyShape: "average", outfitStyle: "plain", outfitShade: 3, bodyVariant: 19 },
  { id: "body.21", label: "Cat", group: "non-human", bodyShape: "compact", outfitStyle: "plain", outfitShade: 3, bodyVariant: 20 },
  { id: "body.22", label: "Penguin", group: "non-human", bodyShape: "average", outfitStyle: "coat", outfitShade: 3, bodyVariant: 21 },
  { id: "body.23", label: "Fox", group: "non-human", bodyShape: "tall", outfitStyle: "plain", outfitShade: 2, bodyVariant: 22 },
  { id: "body.24", label: "Rabbit", group: "non-human", bodyShape: "tall", outfitStyle: "plain", outfitShade: 0, bodyVariant: 23 },
  { id: "body.25", label: "Owl", group: "non-human", bodyShape: "broad", outfitStyle: "checked", outfitShade: 1, bodyVariant: 24 },
  { id: "body.26", label: "Frog", group: "non-human", bodyShape: "compact", outfitStyle: "plain", outfitShade: 1, bodyVariant: 25 },
  { id: "body.27", label: "Grey Alien", group: "non-human", bodyShape: "tall", outfitStyle: "plain", outfitShade: 2, bodyVariant: 26 },
  { id: "body.28", label: "Antenna Alien", group: "non-human", bodyShape: "average", outfitStyle: "striped", outfitShade: 1, bodyVariant: 27 },
  { id: "body.29", label: "Robot", group: "non-human", bodyShape: "broad", outfitStyle: "checked", outfitShade: 3, bodyVariant: 28 },
  { id: "body.30", label: "Axolotl", group: "non-human", bodyShape: "compact", outfitStyle: "plain", outfitShade: 0, bodyVariant: 29 },
] as const satisfies readonly FounderBodyPreset[];

/**
 * The creator offers one coherent identity at a time. IDs/variants remain the
 * original persisted head/body fields, so legacy saves need no schema change.
 */
const FOUNDER_CANONICAL_LABELS = [
  "The Attending", "The Chart Keeper", "The Quick Study", "The Rounds Doctor", "The Evening Consult", "The Clinic Runner", "The Senior Fellow", "The Night Shift", "The Procedure Lead", "The On-Call Surgeon",
  "The Lead Clinician", "The Analyst", "The Organizer", "The Consult Specialist", "The Quick Consult", "The Long Call", "The Note Taker", "The Clinic Builder", "The After-Hours Doctor", "The Headwrap Scholar",
  "Cat Clinician", "Penguin Resident", "Fox Specialist", "Rabbit Fellow", "Owl Consultant", "Frog Practitioner", "Moon Alien", "Antenna Alien", "Robot Clinician", "Axolotl Clinician",
] as const;

export const FOUNDER_IDENTITY_PRESETS = FOUNDER_HEAD_PRESETS.map((head, index) => ({
  id: `founder.${String(index + 1).padStart(2, "0")}`,
  label: FOUNDER_CANONICAL_LABELS[index]!,
  head,
  body: FOUNDER_BODY_PRESETS[index]!,
})) as readonly {
  readonly id: string;
  readonly label: string;
  readonly head: (typeof FOUNDER_HEAD_PRESETS)[number];
  readonly body: (typeof FOUNDER_BODY_PRESETS)[number];
}[];

export function createFounderAppearance(
  headIndex: number,
  bodyIndex: number,
): PixelAppearanceDescriptor {
  const head = FOUNDER_HEAD_PRESETS[headIndex] ?? FOUNDER_HEAD_PRESETS[0];
  const body = FOUNDER_BODY_PRESETS[bodyIndex] ?? FOUNDER_BODY_PRESETS[0];
  return normalizePixelAppearance(
    {
      version: "pixel-avatar.v1",
      hairStyle: head.hairStyle,
      hairShade: head.hairShade,
      faceStyle: head.faceStyle,
      accessory: head.accessory,
      skinTone: head.skinTone,
      headVariant: head.headVariant,
      bodyShape: body.bodyShape,
      outfitStyle: body.outfitStyle,
      outfitShade: body.outfitShade,
      bodyVariant: body.bodyVariant,
      roleStyle: "founder",
    },
    "founder",
  );
}

export function createUnifiedFounderAppearance(identityIndex: number) {
  const normalized = ((identityIndex % FOUNDER_IDENTITY_PRESETS.length) + FOUNDER_IDENTITY_PRESETS.length) % FOUNDER_IDENTITY_PRESETS.length;
  return createFounderAppearance(normalized, normalized);
}
