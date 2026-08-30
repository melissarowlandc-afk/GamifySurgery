/**
 * Canonical visual-only identity specification for the patient-v1 actor pack.
 * IDs intentionally mirror the domain roster, but no clinical selection or
 * demographic rule is duplicated here. These values drive original art only.
 */
export const PATIENT_ART_REVISION = "patients-v1-r1";
export const PATIENT_ART_IDS = Array.from(
  { length: 50 },
  (_, index) => `patient.adult.${String(index + 1).padStart(3, "0")}`,
);

const hairStyles = ["crop", "waves", "braid", "curls", "bun", "part", "locs", "silver", "short", "wrap"];
const outfits = ["hoodie", "cardigan", "jacket", "blouse", "coat", "sweater", "vest", "shirt", "raincoat", "knit"];
const accessories = ["none", "glasses", "earring", "watch", "bag", "hearing", "cane", "scarf", "none", "glasses"];

export const PATIENT_ART_SPEC = PATIENT_ART_IDS.map((id, index) => ({
  id,
  // The first and second half correspond to the already-approved domain
  // roster order. This is a visual artist grouping, not clinical logic.
  presentation: index < 25 ? "female" : "male",
  skin: index % 5,
  hair: hairStyles[(index * 3 + Math.floor(index / 5)) % hairStyles.length],
  hairTone: index % 6,
  outfit: outfits[(index * 5 + 2) % outfits.length],
  outfitTone: (index * 3 + 1) % 8,
  accessory: accessories[(index * 7 + 3) % accessories.length],
  build: ["compact", "average", "broad", "tall"][index % 4],
  face: ["round", "square", "long", "soft", "angular"][index % 5],
  ageCue: ["young", "adult", "middle", "older"][Math.floor((index % 25) / 6.25)],
}));
