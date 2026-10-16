import type { ClinicalSource } from "../../pilot-schema";
import { BATCH_CONTENT_VERSION } from "./batch-helpers";
import { LEVEL3_FAMILIES } from "./authoring";
export const GS028_20261007_LEVEL3_FAMILIES = LEVEL3_FAMILIES;

function canonicalMetadata(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalMetadata).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalMetadata(item)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

/** Claim links are unioned only when all bibliographic and rights metadata agree. */
export function mergeLevel3ClinicalSources(records: readonly ClinicalSource[]): ClinicalSource[] {
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

export const GS028_20261007_LEVEL3_AUTHORING_CONCEPTS = GS028_20261007_LEVEL3_FAMILIES.flatMap((family) => family.authoringConcepts);
export const GS028_20261007_LEVEL3_TESTED_CONCEPTS = GS028_20261007_LEVEL3_FAMILIES.flatMap((family) => family.testedConcepts);
export const GS028_20261007_LEVEL3_QUESTIONS = GS028_20261007_LEVEL3_FAMILIES.flatMap((family) => family.questions);
export const GS028_20261007_LEVEL3_CASES = GS028_20261007_LEVEL3_FAMILIES.flatMap((family) => family.cases);
export const GS028_20261007_LEVEL3_TIMING_ENTRIES = GS028_20261007_LEVEL3_FAMILIES.flatMap((family) => family.timingEntries);
export const GS028_20261007_LEVEL3_CASE_REVIEWS = GS028_20261007_LEVEL3_FAMILIES.flatMap((family) => family.caseReviews);
export const GS028_20261007_LEVEL3_CLAIMS = GS028_20261007_LEVEL3_FAMILIES.flatMap((family) => family.claims);
export const GS028_20261007_LEVEL3_SOURCES = mergeLevel3ClinicalSources(GS028_20261007_LEVEL3_FAMILIES.flatMap((family) => family.sources));
export const GS028_20261007_LEVEL3_SERVICE_CONTRACTS = GS028_20261007_LEVEL3_FAMILIES.flatMap((family) => family.serviceContracts);

export const GS028_20261007_LEVEL3_BATCH_MANIFEST = {
  contentVersion: BATCH_CONTENT_VERSION,
  authoringConceptCount: GS028_20261007_LEVEL3_AUTHORING_CONCEPTS.length,
  testedConceptCount: GS028_20261007_LEVEL3_TESTED_CONCEPTS.length,
  questionVariantCount: GS028_20261007_LEVEL3_QUESTIONS.length,
  caseCount: GS028_20261007_LEVEL3_CASES.length,
  decisionNodeCount: GS028_20261007_LEVEL3_CASES.flatMap((item) => item.decisionNodes).length,
  runtimeCaseProfileCount: GS028_20261007_LEVEL3_CASES.flatMap((item) => item.approvedInstantiationProfiles).length,
  questionProfileReferenceCount: GS028_20261007_LEVEL3_QUESTIONS.flatMap((item) => item.approvedInstantiationProfiles).length,
  sourceCount: GS028_20261007_LEVEL3_SOURCES.length,
  evidenceClaimCount: GS028_20261007_LEVEL3_CLAIMS.length,
  timingEntryCount: GS028_20261007_LEVEL3_TIMING_ENTRIES.length,
  caseReviewCount: GS028_20261007_LEVEL3_CASE_REVIEWS.length,
  resultGateCount: GS028_20261007_LEVEL3_CASES.flatMap((item) => item.decisionNodes).filter((node) => node.resultGateAfter !== null).length,
  publicReleaseAuthorized: false,
} as const;
