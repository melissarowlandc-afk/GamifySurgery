import { ALL_FAMILIES as families } from "./families";
export const GS028_20261002_AUTHORING_CONCEPTS=families.flatMap(x=>x.authoringConcepts);
export const GS028_20261002_TESTED_CONCEPTS=families.flatMap(x=>x.testedConcepts);
export const GS028_20261002_QUESTIONS=families.flatMap(x=>x.questions);
export const GS028_20261002_CASES=families.flatMap(x=>x.cases);
export const GS028_20261002_CLAIMS=families.flatMap(x=>x.claims);
const sourceMap=new Map<string,(typeof families)[number]["sources"][number]>();
for(const item of families.flatMap(x=>x.sources)){const old=sourceMap.get(item.id);sourceMap.set(item.id,old?{...old,evidenceClaimIds:[...new Set([...old.evidenceClaimIds,...item.evidenceClaimIds])]}:item);}
export const GS028_20261002_SOURCES=[...sourceMap.values()];
export const GS028_20261002_CASE_REVIEWS=families.flatMap(x=>x.caseReviews);
export const GS028_20261002_TIMING_ENTRIES=families.flatMap(x=>x.timingEntries);
export const GS028_20261002_SERVICE_CONTRACTS=families.flatMap(x=>x.serviceContracts);
export const GS028_20261002_BATCH_MANIFEST={contentVersion:"development-batch.2026-10-02.pre-endoscopy.1",authoringConceptCount:GS028_20261002_AUTHORING_CONCEPTS.length,testedConceptCount:GS028_20261002_TESTED_CONCEPTS.length,questionVariantCount:GS028_20261002_QUESTIONS.length,caseCount:GS028_20261002_CASES.length,decisionNodeCount:GS028_20261002_CASES.flatMap(x=>x.decisionNodes).length,sourceCount:GS028_20261002_SOURCES.length,evidenceClaimCount:GS028_20261002_CLAIMS.length,timingEntryCount:GS028_20261002_TIMING_ENTRIES.length,admissionScope:"active_synthetic_unapproved_prototype",publicReleaseAuthorized:false} as const;
