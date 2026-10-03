import { BATCH_CONTENT_VERSION } from "./batch-helpers";
import { COVERAGE_GAP_FAMILIES, REMAINING_FOURTEEN_FAMILIES } from "./families";

export const GS028_20261003_AUTHORING_CONCEPTS=COVERAGE_GAP_FAMILIES.flatMap((family)=>family.authoringConcepts);
export const GS028_20261003_TESTED_CONCEPTS=COVERAGE_GAP_FAMILIES.flatMap((family)=>family.testedConcepts);
export const GS028_20261003_QUESTIONS=COVERAGE_GAP_FAMILIES.flatMap((family)=>family.questions);
export const GS028_20261003_CASES=COVERAGE_GAP_FAMILIES.flatMap((family)=>family.cases);
export const GS028_20261003_TIMING_ENTRIES=COVERAGE_GAP_FAMILIES.flatMap((family)=>family.timingEntries);
export const GS028_20261003_CASE_REVIEWS=COVERAGE_GAP_FAMILIES.flatMap((family)=>family.caseReviews);
export const GS028_20261003_CLAIMS=COVERAGE_GAP_FAMILIES.flatMap((family)=>family.claims);
export const GS028_20261003_SOURCES=COVERAGE_GAP_FAMILIES.flatMap((family)=>family.sources);
export const GS028_20261003_SERVICE_CONTRACTS=COVERAGE_GAP_FAMILIES.flatMap((family)=>family.serviceContracts);

export const GS028_20261003_REMAINING14_AUTHORING_CONCEPTS=REMAINING_FOURTEEN_FAMILIES.flatMap((family)=>family.authoringConcepts);
export const GS028_20261003_REMAINING14_TESTED_CONCEPTS=REMAINING_FOURTEEN_FAMILIES.flatMap((family)=>family.testedConcepts);
export const GS028_20261003_REMAINING14_QUESTIONS=REMAINING_FOURTEEN_FAMILIES.flatMap((family)=>family.questions);
export const GS028_20261003_REMAINING14_CASES=REMAINING_FOURTEEN_FAMILIES.flatMap((family)=>family.cases);
export const GS028_20261003_REMAINING14_TIMING_ENTRIES=REMAINING_FOURTEEN_FAMILIES.flatMap((family)=>family.timingEntries);
export const GS028_20261003_REMAINING14_CLAIMS=REMAINING_FOURTEEN_FAMILIES.flatMap((family)=>family.claims);
export const GS028_20261003_REMAINING14_SOURCES=REMAINING_FOURTEEN_FAMILIES.flatMap((family)=>family.sources);

export const GS028_20261003_BATCH_MANIFEST={
 contentVersion:BATCH_CONTENT_VERSION,
 authoringConceptCount:GS028_20261003_AUTHORING_CONCEPTS.length,
 testedConceptCount:GS028_20261003_TESTED_CONCEPTS.length,
 questionVariantCount:GS028_20261003_QUESTIONS.length,
 caseCount:GS028_20261003_CASES.length,
 decisionNodeCount:GS028_20261003_CASES.flatMap((item)=>item.decisionNodes).length,
 sourceCount:GS028_20261003_SOURCES.length,
 evidenceClaimCount:GS028_20261003_CLAIMS.length,
 timingEntryCount:GS028_20261003_TIMING_ENTRIES.length,
 resultGateCount:GS028_20261003_CASES.flatMap((item)=>item.decisionNodes).filter((node)=>node.resultGateAfter).length,
 publicReleaseAuthorized:false,
} as const;
