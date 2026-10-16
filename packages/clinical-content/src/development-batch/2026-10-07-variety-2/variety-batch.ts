import type { ClinicalSource } from "../../pilot-schema";
import { BATCH_CONTENT_VERSION } from "./batch-helpers";
import { GYNECOLOGY_FAMILY } from "./gynecology";
import { PERIPHERAL_NERVE_FAMILY } from "./peripheral-nerve-localization";
import { NECK_MASS_FAMILY } from "./neck-mass-workup";
import { RECONSTRUCTION_FAMILY } from "./reconstruction-principles";
import { TRANSPLANT_RELATIONSHIPS_FAMILY } from "./transplant-relationships";
import { LOCAL_ANESTHETIC_FAMILY } from "./local-anesthetic-mechanism";
import { TACROLIMUS_FAMILY } from "./tacrolimus";
import { ANESTHESIA_REMAINING_FAMILY } from "./anesthesia-remaining";
import { NUTRITION_FAMILY } from "./nutrition";
import { PATIENT_SAFETY_FAMILY } from "./patient-safety";
import { OXYGEN_CONTENT_FAMILY } from "./oxygen-content";
import { MELANOMA_BOWEL_FAMILY } from "./melanoma-bowel";
import { FOREIGN_BODY_FAMILY } from "./foreign-body";

export const GS028_20261007_VARIETY2_FAMILIES = [
  GYNECOLOGY_FAMILY, PERIPHERAL_NERVE_FAMILY, NECK_MASS_FAMILY,
  RECONSTRUCTION_FAMILY, TRANSPLANT_RELATIONSHIPS_FAMILY, LOCAL_ANESTHETIC_FAMILY,
  TACROLIMUS_FAMILY, ANESTHESIA_REMAINING_FAMILY, NUTRITION_FAMILY,
  PATIENT_SAFETY_FAMILY, OXYGEN_CONTENT_FAMILY, MELANOMA_BOWEL_FAMILY, FOREIGN_BODY_FAMILY,
] as const;

function canonicalMetadata(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalMetadata).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalMetadata(item)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

/** Claim links are unioned only when all bibliographic and rights metadata agree. */
export function mergeVariety2ClinicalSources(records: readonly ClinicalSource[]): ClinicalSource[] {
  const byId = new Map<string, ClinicalSource>();
  for (const record of records) {
    const existing = byId.get(record.id);
    if (!existing) {
      byId.set(record.id, { ...record, evidenceClaimIds: [...new Set(record.evidenceClaimIds)].sort() });
      continue;
    }
    const { evidenceClaimIds: oldClaims, ...oldMetadata } = existing;
    const { evidenceClaimIds: newClaims, ...newMetadata } = record;
    if (canonicalMetadata(oldMetadata) !== canonicalMetadata(newMetadata)) {
      throw new Error(`Conflicting clinical-source metadata for ${record.id}`);
    }
    existing.evidenceClaimIds = [...new Set([...oldClaims, ...newClaims])].sort();
  }
  return [...byId.values()];
}

export const GS028_20261007_VARIETY2_AUTHORING_CONCEPTS = GS028_20261007_VARIETY2_FAMILIES.flatMap((family) => family.authoringConcepts);
export const GS028_20261007_VARIETY2_TESTED_CONCEPTS = GS028_20261007_VARIETY2_FAMILIES.flatMap((family) => family.testedConcepts);
export const GS028_20261007_VARIETY2_QUESTIONS = GS028_20261007_VARIETY2_FAMILIES.flatMap((family) => family.questions);
export const GS028_20261007_VARIETY2_CASES = GS028_20261007_VARIETY2_FAMILIES.flatMap((family) => family.cases);
export const GS028_20261007_VARIETY2_TIMING_ENTRIES = GS028_20261007_VARIETY2_FAMILIES.flatMap((family) => family.timingEntries);
export const GS028_20261007_VARIETY2_CASE_REVIEWS = GS028_20261007_VARIETY2_FAMILIES.flatMap((family) => family.caseReviews);
export const GS028_20261007_VARIETY2_CLAIMS = GS028_20261007_VARIETY2_FAMILIES.flatMap((family) => family.claims);
export const GS028_20261007_VARIETY2_SOURCES = mergeVariety2ClinicalSources(GS028_20261007_VARIETY2_FAMILIES.flatMap((family) => family.sources));
export const GS028_20261007_VARIETY2_SERVICE_CONTRACTS = GS028_20261007_VARIETY2_FAMILIES.flatMap((family) => family.serviceContracts);

export const GS028_20261007_VARIETY2_BATCH_MANIFEST = {
  contentVersion: BATCH_CONTENT_VERSION,
  authoringConceptCount: GS028_20261007_VARIETY2_AUTHORING_CONCEPTS.length,
  testedConceptCount: GS028_20261007_VARIETY2_TESTED_CONCEPTS.length,
  questionVariantCount: GS028_20261007_VARIETY2_QUESTIONS.length,
  caseCount: GS028_20261007_VARIETY2_CASES.length,
  decisionNodeCount: GS028_20261007_VARIETY2_CASES.flatMap((item) => item.decisionNodes).length,
  runtimeCaseProfileCount: GS028_20261007_VARIETY2_CASES.flatMap((item) => item.approvedInstantiationProfiles).length,
  questionProfileReferenceCount: GS028_20261007_VARIETY2_QUESTIONS.flatMap((item) => item.approvedInstantiationProfiles).length,
  sourceCount: GS028_20261007_VARIETY2_SOURCES.length,
  evidenceClaimCount: GS028_20261007_VARIETY2_CLAIMS.length,
  timingEntryCount: GS028_20261007_VARIETY2_TIMING_ENTRIES.length,
  caseReviewCount: GS028_20261007_VARIETY2_CASE_REVIEWS.length,
  resultGateCount: GS028_20261007_VARIETY2_CASES.flatMap((item) => item.decisionNodes).filter((node) => node.resultGateAfter !== null).length,
  publicReleaseAuthorized: false,
} as const;
