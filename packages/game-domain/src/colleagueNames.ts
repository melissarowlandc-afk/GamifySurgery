import { createDeterministicRandom } from "./randomness";
import type { PatientSexLabel } from "./types";

/** Owner-requested resident Easter-egg names. */
export interface ColleagueName {
  readonly given: string;
  readonly family: string;
  readonly sex: "male" | "female";
  readonly group: "resident";
}

export const COLLEAGUE_NAMES: readonly ColleagueName[] = [
  { given: "Peter", family: "Awad", sex: "male", group: "resident" },
  { given: "Amelia", family: "Najor", sex: "female", group: "resident" },
  { given: "Kristin", family: "Lemarbe", sex: "female", group: "resident" },
  { given: "Jacob", family: "Applegarth", sex: "male", group: "resident" },
  { given: "Jacob", family: "Mesiti", sex: "male", group: "resident" },
  { given: "Emmanuel", family: "Nageeb", sex: "male", group: "resident" },
  { given: "Katelyn", family: "Ward", sex: "female", group: "resident" },
  { given: "Michael", family: "Sobolic", sex: "male", group: "resident" },
  { given: "Kimberly", family: "Aung", sex: "female", group: "resident" },
  { given: "Michael", family: "Robbe", sex: "male", group: "resident" },
  { given: "Abigail", family: "Teitelbaum", sex: "female", group: "resident" },
  { given: "Travis", family: "Brege", sex: "male", group: "resident" },
  { given: "Majd", family: "Faraj", sex: "male", group: "resident" },
  { given: "Jay", family: "Getzinger", sex: "male", group: "resident" },
  { given: "Jonathan", family: "Hunyadi", sex: "male", group: "resident" },
  { given: "Whitley", family: "Figge", sex: "female", group: "resident" },
  { given: "Janice", family: "Gibbons", sex: "female", group: "resident" },
  { given: "Courtney", family: "Merwin", sex: "female", group: "resident" },
  { given: "Dylan", family: "Sturtevant", sex: "male", group: "resident" },
  { given: "Thomas", family: "Tracy", sex: "male", group: "resident" },
  { given: "Varun", family: "Vadnala", sex: "male", group: "resident" },
  { given: "Pragathi", family: "Pathanjeli", sex: "female", group: "resident" },
  { given: "Claire", family: "Bova", sex: "female", group: "resident" },
  { given: "Andrew", family: "Eibling", sex: "male", group: "resident" },
  { given: "Matthew", family: "Holtz", sex: "male", group: "resident" },
  { given: "Daniel", family: "Nikolaidis", sex: "male", group: "resident" },
  { given: "Ryan", family: "Olivier", sex: "male", group: "resident" },
  { given: "Alexandria", family: "Case", sex: "female", group: "resident" },
  { given: "Aidan", family: "Kaspari", sex: "male", group: "resident" },
  { given: "Matthew", family: "Whalen", sex: "male", group: "resident" },
  { given: "Kian", family: "Mohamadi", sex: "male", group: "resident" },
  { given: "Danielle", family: "Hurst", sex: "female", group: "resident" },
  { given: "Tyler", family: "Kowalczyk", sex: "male", group: "resident" },
  { given: "Desirae", family: "Dowding", sex: "female", group: "resident" },
  { given: "Logan", family: "Butler", sex: "male", group: "resident" },
  { given: "Melissa", family: "Rowland", sex: "female", group: "resident" },
];

/** Cosmetic/editorial frequency only. Never a clinical or demographic weight. */
export const COLLEAGUE_NAME_EDITORIAL_WEIGHT = 0.01;

export interface ColleagueNameSelectionContext {
  readonly ageYears?: number;
  /** For staff without a chart age, only an explicitly authored visual band. */
  readonly ageBand?: "young_adult" | "middle_aged";
  readonly sexLabel?: PatientSexLabel;
  readonly constrained?: boolean;
  /** All roles, including staff, departing people, shoppers and parents. */
  readonly occupiedDisplayNames?: Iterable<string>;
}

/** Only called for new identities; persisted names must never be reselected. */
export function selectColleagueDisplayName(
  campaignSeed: string,
  selectionKey: string,
  profile: ColleagueNameSelectionContext = {},
  excludedDisplayNames: Iterable<string> = [],
): string | undefined {
  const { ageYears, sexLabel } = profile;
  if (profile.constrained || (ageYears !== undefined && !Number.isFinite(ageYears)) ||
      (sexLabel !== "Female" && sexLabel !== "Male")) return undefined;
  // An explicit chart age always wins over a visual band. Staff briefs can
  // establish a compatible band without inventing an exact age for the art.
  const eligible = ageYears === undefined ? profile.ageBand === "young_adult" : ageYears >= 25 && ageYears <= 35;
  if (!eligible) return undefined;

  // A separate seed-derived stream never advances the existing identity,
  // appearance, clinical, answer-order or arrival RNGs.
  const random = createDeterministicRandom(campaignSeed, "colleague_names.editorial.v1", selectionKey);
  if (random.nextUint32() / 0x1_0000_0000 >= COLLEAGUE_NAME_EDITORIAL_WEIGHT) return undefined;
  const candidates = COLLEAGUE_NAMES.filter(name => name.sex === (sexLabel === "Female" ? "female" : "male"));
  const used = new Set([...excludedDisplayNames, ...(profile.occupiedDisplayNames ?? [])]);
  const start = random.integer(candidates.length);
  for (let offset = 0; offset < candidates.length; offset += 1) {
    const name = candidates[(start + offset) % candidates.length]!;
    const displayName = `${name.given} ${name.family}`;
    if (!used.has(displayName)) return displayName;
  }
  return undefined;
}
