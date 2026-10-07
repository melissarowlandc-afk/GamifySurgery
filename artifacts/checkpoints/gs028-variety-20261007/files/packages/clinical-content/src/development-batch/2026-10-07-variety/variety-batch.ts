import type { ClinicalSource } from "../../pilot-schema";
import { BATCH_CONTENT_VERSION } from "./batch-helpers";
import { RADIOLOGY_FAMILY } from "./radiology";
import { PHARMACOLOGY_FAMILY } from "./pharmacology";
import { PREOPERATIVE_FAMILY } from "./preoperative";
import { MIS_PRINCIPLES_FAMILY } from "./mis-principles";
import { COLLAGEN_REMODELING_FAMILY } from "./collagen-remodeling";
import { WOUND_HEALING_REMAINING_FAMILY } from "./wound-healing-remaining";
import { IMMUNOLOGY_FAMILY } from "./immunology";
import { COAGULATION_FAMILY } from "./coagulation";
import { ONCOLOGY_FAMILY } from "./oncology";
import { OPERATIVE_INFECTION_FAMILY } from "./operative-infection";

export const GS028_20261007_FAMILIES = [
  RADIOLOGY_FAMILY,
  PHARMACOLOGY_FAMILY,
  PREOPERATIVE_FAMILY,
  MIS_PRINCIPLES_FAMILY,
  COLLAGEN_REMODELING_FAMILY,
  WOUND_HEALING_REMAINING_FAMILY,
  IMMUNOLOGY_FAMILY,
  COAGULATION_FAMILY,
  ONCOLOGY_FAMILY,
  OPERATIVE_INFECTION_FAMILY,
] as const;

function canonicalMetadata(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalMetadata).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalMetadata(item)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

/** Reused citations retain every reciprocal claim link and may not conceal metadata conflicts. */
export function mergeClinicalSources(records: readonly ClinicalSource[]): ClinicalSource[] {
  const byId = new Map<string, ClinicalSource>();
  for (const record of records) {
    const existing = byId.get(record.id);
    if (!existing) {
      byId.set(record.id, { ...record, evidenceClaimIds: [...new Set(record.evidenceClaimIds)].sort() });
      continue;
    }
    const { evidenceClaimIds: previousClaims, ...previousMetadata } = existing;
    const { evidenceClaimIds: nextClaims, ...nextMetadata } = record;
    if (canonicalMetadata(previousMetadata) !== canonicalMetadata(nextMetadata)) {
      throw new Error(`Conflicting clinical-source metadata for ${record.id}`);
    }
    existing.evidenceClaimIds = [...new Set([...previousClaims, ...nextClaims])].sort();
  }
  return [...byId.values()];
}

export const GS028_20261007_AUTHORING_CONCEPTS = GS028_20261007_FAMILIES.flatMap((family) => family.authoringConcepts);
export const GS028_20261007_TESTED_CONCEPTS = GS028_20261007_FAMILIES.flatMap((family) => family.testedConcepts);
export const GS028_20261007_QUESTIONS = GS028_20261007_FAMILIES.flatMap((family) => family.questions);
export const GS028_20261007_CASES = GS028_20261007_FAMILIES.flatMap((family) => family.cases);
export const GS028_20261007_TIMING_ENTRIES = GS028_20261007_FAMILIES.flatMap((family) => family.timingEntries);
export const GS028_20261007_CASE_REVIEWS = GS028_20261007_FAMILIES.flatMap((family) => family.caseReviews);
export const GS028_20261007_CLAIMS = GS028_20261007_FAMILIES.flatMap((family) => family.claims);
export const GS028_20261007_SOURCES = mergeClinicalSources(GS028_20261007_FAMILIES.flatMap((family) => family.sources));
export const GS028_20261007_SERVICE_CONTRACTS = GS028_20261007_FAMILIES.flatMap((family) => family.serviceContracts);

export const GS028_20261007_BATCH_MANIFEST = {
  contentVersion: BATCH_CONTENT_VERSION,
  authoringConceptCount: GS028_20261007_AUTHORING_CONCEPTS.length,
  testedConceptCount: GS028_20261007_TESTED_CONCEPTS.length,
  questionVariantCount: GS028_20261007_QUESTIONS.length,
  caseCount: GS028_20261007_CASES.length,
  decisionNodeCount: GS028_20261007_CASES.flatMap((clinicalCase) => clinicalCase.decisionNodes).length,
  sourceCount: GS028_20261007_SOURCES.length,
  evidenceClaimCount: GS028_20261007_CLAIMS.length,
  timingEntryCount: GS028_20261007_TIMING_ENTRIES.length,
  caseReviewCount: GS028_20261007_CASE_REVIEWS.length,
  resultGateCount: GS028_20261007_CASES.flatMap((clinicalCase) => clinicalCase.decisionNodes)
    .filter((node) => node.resultGateAfter !== null).length,
  publicReleaseAuthorized: false,
} as const;
