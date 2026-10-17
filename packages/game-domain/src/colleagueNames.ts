import { createDeterministicRandom } from "./randomness";
import type { PatientSexLabel } from "./types";

/** Owner-requested Easter-egg names (2026-10-16), including beta playtesters. */
export interface ColleagueName {
  readonly given: string;
  readonly family: string;
  readonly sex: "male" | "female";
  readonly group: "attending" | "resident";
}

export const COLLEAGUE_NAMES: readonly ColleagueName[] = [
  { given: "Adewunmi", family: "Adeyemo", sex: "male", group: "attending" },
  { given: "Begum", family: "Akay", sex: "female", group: "attending" },
  { given: "Ameer", family: "Al-Hadidi", sex: "male", group: "attending" },
  { given: "Wesley", family: "Barnes", sex: "male", group: "attending" },
  { given: "John", family: "Bauman", sex: "male", group: "attending" },
  { given: "Damanpreet", family: "Bedi", sex: "male", group: "attending" },
  { given: "Paul", family: "Bove", sex: "male", group: "attending" },
  { given: "Pavan", family: "Brahmamdam", sex: "male", group: "attending" },
  { given: "O. William", family: "Brown", sex: "male", group: "attending" },
  { given: "David", family: "Chengelis", sex: "male", group: "attending" },
  { given: "Michael", family: "Coello", sex: "male", group: "attending" },
  { given: "Steven", family: "Cohn", sex: "male", group: "attending" },
  { given: "Peter", family: "Czako", sex: "male", group: "attending" },
  { given: "Nayana", family: "Dekhne", sex: "female", group: "attending" },
  { given: "Alexander", family: "Demare", sex: "male", group: "attending" },
  { given: "Ganesh", family: "Deshmukh", sex: "male", group: "attending" },
  { given: "Anthony", family: "Iacco", sex: "male", group: "attending" },
  { given: "Felicia", family: "Ivascu", sex: "female", group: "attending" },
  { given: "Kevin", family: "Jamil", sex: "male", group: "attending" },
  { given: "Randy", family: "Janczyk", sex: "male", group: "attending" },
  { given: "Joe", family: "Habbouche", sex: "male", group: "attending" },
  { given: "Sang", family: "Kim", sex: "male", group: "attending" },
  { given: "Bradley", family: "Krasnick", sex: "male", group: "attending" },
  { given: "Kevin", family: "Krause", sex: "male", group: "attending" },
  { given: "Matthew", family: "Major", sex: "male", group: "attending" },
  { given: "Jimmi", family: "Mangla", sex: "male", group: "attending" },
  { given: "Sean", family: "Masters", sex: "male", group: "attending" },
  { given: "Sayee", family: "Kiran", sex: "female", group: "attending" },
  { given: "Sapna", family: "Nagar", sex: "female", group: "attending" },
  { given: "Nathan", family: "Novotny", sex: "male", group: "attending" },
  { given: "Claire", family: "Peeples", sex: "female", group: "attending" },
  { given: "Vishnu", family: "Pemmaraju", sex: "male", group: "attending" },
  { given: "Krishna", family: "Putchakayala", sex: "male", group: "attending" },
  { given: "Steven", family: "Rimar", sex: "male", group: "attending" },
  { given: "James", family: "Robbins", sex: "male", group: "attending" },
  { given: "Matthew", family: "Robbins", sex: "male", group: "attending" },
  { given: "Jason", family: "Shellnut", sex: "male", group: "attending" },
  { given: "Anthony", family: "Stallion", sex: "male", group: "attending" },
  { given: "Maciej", family: "Uzieblo", sex: "male", group: "attending" },
  { given: "Mario", family: "Villalba", sex: "male", group: "attending" },
  { given: "Caitlin", family: "Wahl", sex: "female", group: "attending" },
  { given: "Harry", family: "Wasvary", sex: "male", group: "attending" },
  { given: "Thomas", family: "Watson", sex: "male", group: "attending" },
  { given: "Arya", family: "Zarinsefat", sex: "male", group: "attending" },
  { given: "Matthew", family: "Ziegler", sex: "male", group: "attending" },
  { given: "Graham", family: "Long", sex: "male", group: "attending" },
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
  const group = ageYears !== undefined
    ? ageYears >= 40 && ageYears <= 65 ? "attending"
      : ageYears >= 25 && ageYears <= 35 ? "resident" : undefined
    : profile.ageBand === "middle_aged" ? "attending"
      : profile.ageBand === "young_adult" ? "resident" : undefined;
  if (!group) return undefined;

  // A separate seed-derived stream never advances the existing identity,
  // appearance, clinical, answer-order or arrival RNGs.
  const random = createDeterministicRandom(campaignSeed, "colleague_names.editorial.v1", selectionKey);
  if (random.nextUint32() / 0x1_0000_0000 >= COLLEAGUE_NAME_EDITORIAL_WEIGHT) return undefined;
  const candidates = COLLEAGUE_NAMES.filter(name => name.group === group &&
    name.sex === (sexLabel === "Female" ? "female" : "male"));
  const used = new Set([...excludedDisplayNames, ...(profile.occupiedDisplayNames ?? [])]);
  const start = random.integer(candidates.length);
  for (let offset = 0; offset < candidates.length; offset += 1) {
    const name = candidates[(start + offset) % candidates.length]!;
    const displayName = `${name.given} ${name.family}`;
    if (!used.has(displayName)) return displayName;
  }
  return undefined;
}
