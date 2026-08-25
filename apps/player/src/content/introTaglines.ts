export const INTRO_TAGLINES = [
  "Saves a bird in the hand.",
  "Saves $400.",
  "Saves two in the bush.",
  "Saves room for dessert.",
  "Saves daylight in participating states.",
  "Saves a penny for your thoughts.",
  "Saves the elephant in the waiting room.",
  "Saves the chicken before it crosses.",
  "Saves the backup banana.",
  "Saves one medium-sized Tuesday.",
  "Saves the princess, eventually.",
  "Saves absolutely nothing.",
  "Saves nine business days.",
  "Saves nine, pending prior authorization.",
  "Saves four out of five dentists.",
  "Saves the world after sign-out.",
  "Saves one clean pair of scrubs.",
  "Saves the good trauma shears.",
  "Saves a turkey sandwich for night shift.",
  "Saves a parking spot in the next county.",
  "Saves paper by printing twice.",
  "Saves a perfectly good clipboard.",
  "Saves a little treat for later.",
  "Saves the decaf for administration.",
  "Saves nine sandwiches. Mayo extra.",
  "Saves the mystery Tupperware.",
  "Saves the Oxford comma, reluctantly.",
  "Saves the appendix for the appendix.",
  "Saves the spleen on alternating Tuesdays.",
  "Saves nine hours of mandatory modules.",
  "Saves the operating room schedule, in theory.",
  "Saves one extremely local pigeon.",
] as const;

export type IntroTagline = (typeof INTRO_TAGLINES)[number];

export const PRIOR_AUTHORIZATION_TAGLINE =
  "Saves nine, pending prior authorization." satisfies IntroTagline;

export const LAST_INTRO_TAGLINE_SESSION_KEY =
  "stitchin-time.intro-tagline.last.v1";

const PRIOR_AUTHORIZATION_WEIGHT = 0.1;

export interface IntroTaglineStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function isIntroTagline(value: string | null | undefined): value is IntroTagline {
  return INTRO_TAGLINES.some((tagline) => tagline === value);
}

function normalizeRandomValue(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(1 - Number.EPSILON, Math.max(0, value));
}

/**
 * Presentation-only selection. This deliberately does not use the seeded
 * simulation random source.
 */
export function selectIntroTagline(
  previous: string | null | undefined,
  random: () => number = Math.random,
): IntroTagline {
  const approvedPrevious = isIntroTagline(previous) ? previous : null;
  const ordinaryCandidates = INTRO_TAGLINES.filter(
    (tagline) =>
      tagline !== PRIOR_AUTHORIZATION_TAGLINE &&
      tagline !== approvedPrevious,
  );
  const specialIsEligible =
    approvedPrevious !== PRIOR_AUTHORIZATION_TAGLINE;
  const roll = normalizeRandomValue(random());

  if (specialIsEligible && roll < PRIOR_AUTHORIZATION_WEIGHT) {
    return PRIOR_AUTHORIZATION_TAGLINE;
  }

  const ordinaryRoll = specialIsEligible
    ? (roll - PRIOR_AUTHORIZATION_WEIGHT) /
      (1 - PRIOR_AUTHORIZATION_WEIGHT)
    : roll;
  const ordinaryIndex = Math.min(
    ordinaryCandidates.length - 1,
    Math.floor(Math.max(0, ordinaryRoll) * ordinaryCandidates.length),
  );

  return ordinaryCandidates[ordinaryIndex] ?? PRIOR_AUTHORIZATION_TAGLINE;
}

function getBrowserSessionStorage(): IntroTaglineStorage | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function readLastIntroTagline(
  storage: IntroTaglineStorage | null = getBrowserSessionStorage(),
): IntroTagline | null {
  if (!storage) {
    return null;
  }
  try {
    const stored = storage.getItem(LAST_INTRO_TAGLINE_SESSION_KEY);
    return isIntroTagline(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function writeLastIntroTagline(
  tagline: IntroTagline,
  storage: IntroTaglineStorage | null = getBrowserSessionStorage(),
): boolean {
  if (!storage) {
    return false;
  }
  try {
    storage.setItem(LAST_INTRO_TAGLINE_SESSION_KEY, tagline);
    return true;
  } catch {
    return false;
  }
}
