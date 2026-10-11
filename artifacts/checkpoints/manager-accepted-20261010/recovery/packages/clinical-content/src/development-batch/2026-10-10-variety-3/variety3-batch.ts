import { BATCH_CONTENT_VERSION, NEEDS_REVIEW } from "./batch-helpers";
import { CLINIC_FAMILY } from "./clinic";
import { ENDOSCOPY_FAMILY } from "./endoscopy";
import { VARIETY3_CLAIMS, VARIETY3_SOURCES, WITHHELD_DISAGREEMENTS, WITHHELD_TOPICS } from "./evidence-claims";
import { PERIOPERATIVE_FAMILY } from "./perioperative";
import { CLINICAL_LINK_POLICY, EXCLUDED_SOURCE_CHECKS } from "./source-catalog";

const families = [CLINIC_FAMILY, ENDOSCOPY_FAMILY, PERIOPERATIVE_FAMILY];
export const VARIETY3_AUTHORING_CONCEPTS = families.flatMap(family => family.concepts);
export const VARIETY3_TESTED_CONCEPTS = families.flatMap(family => family.testedConcepts);
export const VARIETY3_QUESTIONS = families.flatMap(family => family.questions);
export const VARIETY3_CASES = families.flatMap(family => family.cases);
export const VARIETY3_CASE_REVIEWS = families.flatMap(family => family.caseReviews);
export const VARIETY3_ADULT_CONTEXTS = families.flatMap(family => family.adultContexts);
export const VARIETY3_STATEMENT_MAPPINGS = families.flatMap(family => family.statementMappings);
export const VARIETY3_TIMING_ENTRIES = families.flatMap(family => family.timingEntries);
export const VARIETY3_SERVICE_CONTRACTS: readonly [] = [];
export { VARIETY3_CLAIMS, VARIETY3_SOURCES, WITHHELD_DISAGREEMENTS, WITHHELD_TOPICS, EXCLUDED_SOURCE_CHECKS };
export const VARIETY3_SOURCE_LINKS = VARIETY3_SOURCES.map(source => ({
  ...NEEDS_REVIEW, id: `link.${source.id.replace(/^source\./, "")}`, sourceId: source.id,
  label: source.title, href: source.officialUrl!, ...CLINICAL_LINK_POLICY,
}));
export const VARIETY3_BATCH_MANIFEST = {
  ...NEEDS_REVIEW, id: "batch.2026-10-10.variety-3", contentVersion: BATCH_CONTENT_VERSION,
  authoringConceptCount: VARIETY3_AUTHORING_CONCEPTS.length,
  newConceptCount: VARIETY3_AUTHORING_CONCEPTS.length, reusedConceptIds: [] as string[],
  testedConceptCount: VARIETY3_TESTED_CONCEPTS.length, questionVariantCount: VARIETY3_QUESTIONS.length,
  caseCount: VARIETY3_CASES.length, decisionNodeCount: VARIETY3_CASES.flatMap(item => item.decisionNodes).length,
  sourceCount: VARIETY3_SOURCES.length, evidenceClaimCount: VARIETY3_CLAIMS.length,
  timingEntryCount: VARIETY3_TIMING_ENTRIES.length,
  releasePointIds: ["release.l1.minor_procedure", "release.l2.endoscopy", "release.l3.ambulatory_or_qi"],
  requiredFacilityStages: [1, 2, 3], requiredClinicalSetting: "clinic", requiredCapabilityIds: [] as string[],
  population: { scope: "adult", basis: "editorial_art_matched_constrained_profiles_not_demographic_weights" },
  admissionScope: "standalone_draft_for_manager_scope_review", assemblyAuthorized: false, publicReleaseAuthorized: false,
  admissionDependencies: [
    "Manager reviews and explicitly selects an exact unapproved prototype content manifest.",
    "Manager admits concepts/cases and companion timing entries together; no executable service or result gate is authored.",
    "Identity assembly preserves each constrained adult age, sex, fictional name and art identity without uncontrolled profile recombination.",
    "Facility stage, educational tier, acuity and capability remain separate; Levels 1-3 are existing authoring lanes and available to Level 4 through normal progression.",
    "Named clinician approval of exact versions is required before any clinical promotion.",
  ],
} as const;
