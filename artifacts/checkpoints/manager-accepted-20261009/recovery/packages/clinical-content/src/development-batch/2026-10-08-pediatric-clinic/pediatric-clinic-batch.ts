import { ASSENT_FAMILY } from "./assent";
import { BATCH_CONTENT_VERSION, NEEDS_REVIEW } from "./batch-helpers";
import { CHEST_WALL_FAMILY } from "./chest-wall";
import {
  EXCLUDED_SOURCE_CHECKS,
  PEDIATRIC_CLINIC_CLAIMS,
  PEDIATRIC_CLINIC_SOURCES,
  WITHHELD_DISAGREEMENTS,
  WITHHELD_TOPICS,
} from "./evidence-claims";
import { HERNIA_FAMILY } from "./hernia";
import { NECK_NODE_FAMILY } from "./neck-nodes";
import { PILONIDAL_FAMILY } from "./pilonidal";
import { CLINICAL_LINK_POLICY } from "./source-catalog";
import { TESTIS_FAMILY } from "./testes";

const families = [HERNIA_FAMILY, NECK_NODE_FAMILY, TESTIS_FAMILY, CHEST_WALL_FAMILY, PILONIDAL_FAMILY, ASSENT_FAMILY];
export const PEDIATRIC_CLINIC_AUTHORING_CONCEPTS = families.flatMap((family) => family.concepts);
export const PEDIATRIC_CLINIC_TESTED_CONCEPTS = families.flatMap((family) => family.testedConcepts);
export const PEDIATRIC_CLINIC_QUESTIONS = families.flatMap((family) => family.questions);
export const PEDIATRIC_CLINIC_CASES = families.flatMap((family) => family.cases);
export const PEDIATRIC_CLINIC_CASE_REVIEWS = families.flatMap((family) => family.caseReviews);
export const PEDIATRIC_CLINIC_FAMILY_CONTEXTS = families.flatMap((family) => family.familyContexts);
export const PEDIATRIC_CLINIC_STATEMENT_MAPPINGS = families.flatMap((family) => family.statementMappings);
export const PEDIATRIC_CLINIC_TIMING_ENTRIES = families.flatMap((family) => family.timingEntries);
export const PEDIATRIC_CLINIC_SERVICE_CONTRACTS: readonly [] = [];
export { PEDIATRIC_CLINIC_CLAIMS, PEDIATRIC_CLINIC_SOURCES, WITHHELD_DISAGREEMENTS, WITHHELD_TOPICS, EXCLUDED_SOURCE_CHECKS };

export const PEDIATRIC_CLINIC_SOURCE_LINKS = PEDIATRIC_CLINIC_SOURCES.map((source) => ({
  ...NEEDS_REVIEW, id: `link.${source.id.replace(/^source\./, "")}`,
  sourceId: source.id, label: source.title, href: source.officialUrl!, ...CLINICAL_LINK_POLICY,
}));

export const PEDIATRIC_CLINIC_BATCH_MANIFEST = {
  ...NEEDS_REVIEW,
  id: "batch.2026-10-08.pediatric-clinic",
  contentVersion: BATCH_CONTENT_VERSION,
  authoringConceptCount: PEDIATRIC_CLINIC_AUTHORING_CONCEPTS.length,
  newConceptCount: PEDIATRIC_CLINIC_AUTHORING_CONCEPTS.filter((concept) => concept.identityDisposition === "new_objective").length,
  reusedConceptIds: PEDIATRIC_CLINIC_AUTHORING_CONCEPTS.filter((concept) => concept.identityDisposition === "reuse_unchanged_objective").map((concept) => concept.id),
  testedConceptCount: PEDIATRIC_CLINIC_TESTED_CONCEPTS.length,
  questionVariantCount: PEDIATRIC_CLINIC_QUESTIONS.length,
  caseCount: PEDIATRIC_CLINIC_CASES.length,
  decisionNodeCount: PEDIATRIC_CLINIC_CASES.flatMap((item) => item.decisionNodes).length,
  sourceCount: PEDIATRIC_CLINIC_SOURCES.length,
  evidenceClaimCount: PEDIATRIC_CLINIC_CLAIMS.length,
  timingEntryCount: PEDIATRIC_CLINIC_TIMING_ENTRIES.length,
  releasePointId: "release.l4.pediatrics",
  requiredFacilityStage: 4,
  requiredClinicalSetting: "clinic",
  requiredCapabilityIds: ["capability.pediatric_examination"],
  population: { minimumAgeYears: 5, maximumAgeYears: 17, basis: "owner_approved_prototype_and_current_art" },
  parentPolicy: "one_named_parent_same_room_throughout",
  admissionScope: "standalone_draft_for_manager_scope_review",
  assemblyAuthorized: false,
  publicReleaseAuthorized: false,
  admissionDependencies: [
    "Manager reviews and explicitly selects an exact unapproved prototype content manifest.",
    "Manager accepts the shared L4 foundation, release point, pediatric-examination capability and parent-placement runtime before admission.",
    "Family/identity assembly must preserve each constrained child age, sex, art identity and parent context; no adult fallback or uncontrolled demographic/name recombination.",
    "Existing canonical midline-recognition concept is deduplicated by unchanged stable ID; do not create a separate FSRS card.",
    "No clinical promotion without named clinician approval of the exact version.",
  ],
} as const;
