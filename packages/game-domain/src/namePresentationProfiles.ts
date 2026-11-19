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
  "app-variety-v1.001": [26, "Female"],
  "app-variety-v1.002": [27, "Male"],
  "app-variety-v1.003": [68, "Female"],
  "app-variety-v1.004": [71, "Male"],
  "app-variety-v1.005": [24, "Female"],
  "app-variety-v1.006": [29, "Female"],
  "app-variety-v1.007": [24, "Male"],
  "app-variety-v1.008": [26, "Male"],
  "app-variety-v1.009": [29, "Male"],
  "app-variety-v1.010": [33, "Female"],
  "app-variety-v1.011": [40, "Female"],
  "app-variety-v1.012": [44, "Female"],
  "app-variety-v1.013": [43, "Male"],
  "app-variety-v1.014": [56, "Female"],
  "app-variety-v1.015": [46, "Male"],
  "app-variety-v1.016": [63, "Male"],
  "app-variety-v1.017": [66, "Female"],
  "app-variety-v1.018": [74, "Female"],
  "app-variety-v1.019": [79, "Female"],
  "app-variety-v1.020": [66, "Male"],
  "app-variety-v1.021": [76, "Male"],
  "app-variety-v1.022": [82, "Male"],
  "staff-variety-v1.001": [28, "Male"],
  "staff-variety-v1.002": [27, "Female"],
  "staff-variety-v1.003": [54, "Female"],
  "staff-variety-v1.004": [38, "Male"],
  "staff-variety-v1.005": [68, "Female"],
  "staff-variety-v1.006": [70, "Male"],
  "staff-variety-v1.007": [42, "Female"],
  "staff-variety-v1.008": [53, "Male"],
  "staff-variety-v1.009": [26, "Female"],
  "staff-variety-v1.010": [28, "Female"],
  "staff-variety-v1.011": [69, "Female"],
  "staff-variety-v1.012": [74, "Female"],
  "staff-variety-v1.013": [36, "Male"],
  "staff-variety-v1.014": [55, "Female"],
  "staff-variety-v1.015": [50, "Male"],
  "staff-variety-v1.016": [68, "Male"],
  "staff-variety-v1.017": [35, "Female"],
  "staff-variety-v1.018": [40, "Male"],
  "staff-variety-v1.019": [67, "Female"],
  "staff-variety-v1.020": [72, "Male"],
  "staff-variety-v1.021": [26, "Female"],
  "staff-variety-v1.022": [57, "Male"],
  "staff-variety-v1.023": [25, "Female"],
  "staff-variety-v1.024": [36, "Male"],
  "staff-variety-v1.025": [43, "Female"],
  "staff-variety-v1.026": [56, "Male"],
  "staff-variety-v1.027": [70, "Female"],
  "staff-variety-v1.028": [73, "Male"],
  "staff-variety-v1.029": [34, "Male"],
  "staff-variety-v1.030": [55, "Male"],
  "staff-variety-v1.031": [76, "Male"],
  "staff-variety-v1.032": [72, "Female"],
  "staff-variety-v1.033": [27, "Female"],
  "staff-variety-v1.034": [34, "Female"],
  "staff-variety-v1.035": [41, "Male"],
  "staff-variety-v1.036": [68, "Female"],
  "staff-variety-v1.037": [70, "Male"],
  "staff-variety-v1.038": [27, "Male"],
  "staff-variety-v1.039": [39, "Female"],
  "staff-variety-v1.040": [66, "Female"],
  "staff-variety-v1.041": [71, "Male"],
  "staff-variety-v1.042": [67, "Female"],
  "staff-variety-v1.043": [69, "Male"],
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
