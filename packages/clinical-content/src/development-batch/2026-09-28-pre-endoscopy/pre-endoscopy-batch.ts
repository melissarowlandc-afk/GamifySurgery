import { SMALL_BOWEL_OBSTRUCTION } from "./small-bowel-obstruction";
import { PRIMARY_MIDLINE_HERNIA } from "./primary-midline-hernia";
import { VARICOSE_VEINS } from "./varicose-veins";
import { DIABETIC_FOOT } from "./diabetic-foot";
import { BURN } from "./burn";
import { HIDRADENITIS } from "./hidradenitis-suppurativa";
import { PARASTOMAL_HERNIA } from "./parastomal-hernia";
import { STOMA_PROLAPSE } from "./stoma-prolapse";
import { GCS } from "./glasgow-coma-scale";
import { SECONDARY_LYMPHEDEMA } from "./secondary-lymphedema";
const families=[SMALL_BOWEL_OBSTRUCTION,PRIMARY_MIDLINE_HERNIA,VARICOSE_VEINS,DIABETIC_FOOT,BURN,HIDRADENITIS,PARASTOMAL_HERNIA,STOMA_PROLAPSE,GCS,SECONDARY_LYMPHEDEMA];
export const GS028_20260928_AUTHORING_CONCEPTS=families.flatMap(x=>x.authoringConcepts);
export const GS028_20260928_TESTED_CONCEPTS=families.flatMap(x=>x.testedConcepts);
export const GS028_20260928_QUESTIONS=families.flatMap(x=>x.questions);
export const GS028_20260928_CASES=families.flatMap(x=>x.cases);
export const GS028_20260928_CLAIMS=families.flatMap(x=>x.claims);
const sourceMap=new Map<string,(typeof families)[number]["sources"][number]>();
for(const item of families.flatMap(x=>x.sources)){
  const existing=sourceMap.get(item.id);
  if(!existing) sourceMap.set(item.id,{...item,evidenceClaimIds:[...item.evidenceClaimIds]});
  else sourceMap.set(item.id,{...existing,evidenceClaimIds:[...new Set([...existing.evidenceClaimIds,...item.evidenceClaimIds])]});
}
export const GS028_20260928_SOURCES=[...sourceMap.values()];
export const GS028_20260928_CASE_REVIEWS=families.flatMap(x=>x.caseReviews);
export const GS028_20260928_TIMING_ENTRIES=families.flatMap(x=>x.timingEntries);
export const GS028_20260928_SERVICE_CONTRACTS=families.flatMap(x=>x.serviceContracts);
export const GS028_20260928_BATCH_MANIFEST={contentVersion:"development-batch.2026-09-28.pre-endoscopy.1",authoringConceptCount:GS028_20260928_AUTHORING_CONCEPTS.length,testedConceptCount:GS028_20260928_TESTED_CONCEPTS.length,questionVariantCount:GS028_20260928_QUESTIONS.length,caseCount:GS028_20260928_CASES.length,decisionNodeCount:GS028_20260928_CASES.flatMap(x=>x.decisionNodes).length,sourceCount:GS028_20260928_SOURCES.length,evidenceClaimCount:GS028_20260928_CLAIMS.length,timingEntryCount:GS028_20260928_TIMING_ENTRIES.length,admissionScope:"active_synthetic_unapproved_prototype",publicReleaseAuthorized:false} as const;

