import { ETHICS_FAMILIES } from "./ethics";
import { STATISTICS_QI_FAMILIES } from "./statistics-qi";

const families = [...STATISTICS_QI_FAMILIES, ...ETHICS_FAMILIES];
export const GS028_STATS_ETHICS_20260929_AUTHORING_CONCEPTS = families.flatMap((family) => family.authoringConcepts);
export const GS028_STATS_ETHICS_20260929_TESTED_CONCEPTS = families.flatMap((family) => family.testedConcepts);
export const GS028_STATS_ETHICS_20260929_QUESTIONS = families.flatMap((family) => family.questions);
export const GS028_STATS_ETHICS_20260929_CASES = families.flatMap((family) => family.cases);
export const GS028_STATS_ETHICS_20260929_CLAIMS = families.flatMap((family) => family.claims);
export const GS028_STATS_ETHICS_20260929_CASE_REVIEWS = families.flatMap((family) => family.caseReviews);
export const GS028_STATS_ETHICS_20260929_TIMING_ENTRIES = families.flatMap((family) => family.timingEntries);
export const GS028_STATS_ETHICS_20260929_SERVICE_CONTRACTS = families.flatMap((family) => family.serviceContracts);
const sources = new Map<string, (typeof families)[number]["sources"][number]>();
for (const item of families.flatMap((family) => family.sources)) {
  const previous = sources.get(item.id);
  sources.set(item.id, previous ? { ...previous, evidenceClaimIds: [...new Set([...previous.evidenceClaimIds, ...item.evidenceClaimIds])] } : item);
}
export const GS028_STATS_ETHICS_20260929_SOURCES = [...sources.values()];
export const GS028_STATS_ETHICS_20260929_BATCH_MANIFEST = {
  contentVersion: "development-batch.2026-09-29.statistics-ethics.1",
  authoringConceptCount: GS028_STATS_ETHICS_20260929_AUTHORING_CONCEPTS.length,
  testedConceptCount: GS028_STATS_ETHICS_20260929_TESTED_CONCEPTS.length,
  questionVariantCount: GS028_STATS_ETHICS_20260929_QUESTIONS.length,
  caseCount: GS028_STATS_ETHICS_20260929_CASES.length,
  decisionNodeCount: GS028_STATS_ETHICS_20260929_CASES.flatMap((clinicalCase) => clinicalCase.decisionNodes).length,
  sourceCount: GS028_STATS_ETHICS_20260929_SOURCES.length,
  evidenceClaimCount: GS028_STATS_ETHICS_20260929_CLAIMS.length,
  timingEntryCount: GS028_STATS_ETHICS_20260929_TIMING_ENTRIES.length,
  admissionScope: "owner_development_preview_only",
  publicReleaseAuthorized: false,
} as const;
