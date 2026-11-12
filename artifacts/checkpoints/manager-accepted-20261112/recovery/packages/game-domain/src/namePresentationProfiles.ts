import { characterStillCatalogEntryById } from "./characterStillCatalog";
import type { ColleagueNameSelectionContext } from "./colleagueNames";
import type { PixelAppearanceDescriptor } from "./types";

// Presentation-only metadata copied from the accepted future-roster20-v5,
// staff-gapfill-v6d and app-gapfill-v6e roster.json files. These exact age/sex
// fields also appear in characterStillRegistry.generated.json. Staff
// art without age/sex metadata (including the named radiologists) stays in the
// ordinary name pool; never guess age or sex from an ID or head variant.
const STAFF_PROFILES: Readonly<Record<string, readonly [number, "Female" | "Male"]>> = {
  "future-roster20-v5.001": [36, "Male"],
  "future-roster20-v5.002": [47, "Female"],
  "future-roster20-v5.003": [58, "Female"],
  "future-roster20-v5.004": [52, "Male"],
  "future-roster20-v5.005": [40, "Female"],
  "future-roster20-v5.006": [48, "Male"],
  "future-roster20-v5.007": [33, "Female"],
  "future-roster20-v5.008": [61, "Male"],
  "future-roster20-v5.009": [56, "Female"],
  "future-roster20-v5.010": [37, "Male"],
  "future-roster20-v5.011": [46, "Female"],
  "future-roster20-v5.012": [29, "Male"],
  "future-roster20-v5.013": [63, "Female"],
  "future-roster20-v5.014": [53, "Male"],
  "future-roster20-v5.015": [35, "Female"],
  "future-roster20-v5.016": [66, "Male"],
  "staff-gapfill-v6d.001": [52, "Female"],
  "staff-gapfill-v6d.002": [29, "Male"],
  "staff-gapfill-v6d.003": [44, "Female"],
  "staff-gapfill-v6d.004": [57, "Male"],
  "staff-gapfill-v6d.005": [36, "Male"],
  "staff-gapfill-v6d.006": [50, "Female"],
  "staff-gapfill-v6d.007": [39, "Female"],
  "staff-gapfill-v6d.008": [61, "Male"],
  "staff-gapfill-v6d.009": [31, "Female"],
  "staff-gapfill-v6d.010": [45, "Male"],
  "staff-gapfill-v6d.011": [33, "Male"],
  "staff-gapfill-v6d.012": [58, "Female"],
  "staff-gapfill-v6d.013": [47, "Female"],
  "staff-gapfill-v6d.014": [28, "Male"],
  "app-gapfill-v6e.001": [28, "Female"],
  "app-gapfill-v6e.002": [38, "Female"],
  "app-gapfill-v6e.003": [49, "Female"],
  "app-gapfill-v6e.004": [60, "Female"],
  "app-gapfill-v6e.005": [31, "Male"],
  "app-gapfill-v6e.006": [41, "Male"],
  "app-gapfill-v6e.007": [53, "Male"],
  "app-gapfill-v6e.008": [58, "Male"],
};

// Authored "Young"/"Middle-aged" employee20 briefs in
// artifacts/character-statics/gs-022-new-v1/employee20-v1/design-specs.json.
// Editorial staff presentation bands, with no invented exact chart ages.
// "Older" briefs remain ineligible. Named character art is never in this map.
const STAFF_AGE_BAND_PROFILES: Readonly<Record<string,
  readonly ["Female" | "Male", "young_adult" | "middle_aged"]>> = {
  "gs022-new-employee-002": ["Male", "young_adult"],
  "gs022-new-employee-003": ["Female", "middle_aged"],
  "gs022-new-employee-004": ["Male", "middle_aged"],
  "gs022-new-employee-005": ["Female", "young_adult"],
  "gs022-new-employee-007": ["Male", "young_adult"],
  "gs022-new-employee-008": ["Female", "middle_aged"],
  "gs022-new-employee-010": ["Female", "young_adult"],
  "gs022-new-employee-011": ["Male", "middle_aged"],
  "gs022-new-employee-013": ["Female", "middle_aged"],
  "gs022-new-employee-015": ["Female", "young_adult"],
  "gs022-new-employee-016": ["Male", "middle_aged"],
  "gs022-new-employee-018": ["Male", "young_adult"],
  "gs022-new-employee-019": ["Female", "middle_aged"],
};

/** Read existing art metadata; this never chooses or changes an appearance. */
export function getNamePresentationProfile(
  appearance: Pick<PixelAppearanceDescriptor, "stillId"> | null | undefined,
): ColleagueNameSelectionContext {
  const still = characterStillCatalogEntryById(appearance?.stillId);
  if (still?.category === "patient") {
    return {
      sexLabel: still.compatibleSexLabel,
      ageYears: still.intendedAge ?? (still.ageBand === "young_adult" ? 24
        : still.ageBand === "adult" ? 38 : still.ageBand === "middle_aged" ? 54 : 70),
    };
  }
  if (still?.category === "staff") {
    const profile = STAFF_PROFILES[still.stillId];
    if (profile) return { ageYears: profile[0], sexLabel: profile[1] };
    const bandProfile = STAFF_AGE_BAND_PROFILES[still.stillId];
    if (bandProfile) return { sexLabel: bandProfile[0], ageBand: bandProfile[1] };
  }
  return {};
}
