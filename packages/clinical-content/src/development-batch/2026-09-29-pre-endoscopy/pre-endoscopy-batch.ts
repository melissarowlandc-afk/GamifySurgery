import { POSTHERNIORRHAPHY_PAIN } from "./postherniorrhaphy-pain";
import { SPIGELIAN_HERNIA } from "./spigelian-hernia";
import { MESH_INFECTION } from "./mesh-infection";
import { CIRRHOSIS_PERIOPERATIVE } from "./cirrhosis-perioperative";
import { PTLD } from "./ptld";
import { DIFFERENTIATED_THYROID_CANCER } from "./differentiated-thyroid-cancer";
import { NIPPLE_DISCHARGE } from "./nipple-discharge";
import { POST_NEoadjuvant_BREAST } from "./post-neoadjuvant-breast";
import { BASAL_CELL_CARCINOMA } from "./basal-cell-carcinoma";
import { PREOPERATIVE_NUTRITION } from "./preoperative-nutrition";

const families=[POSTHERNIORRHAPHY_PAIN,SPIGELIAN_HERNIA,MESH_INFECTION,CIRRHOSIS_PERIOPERATIVE,PTLD,DIFFERENTIATED_THYROID_CANCER,NIPPLE_DISCHARGE,POST_NEoadjuvant_BREAST,BASAL_CELL_CARCINOMA,PREOPERATIVE_NUTRITION];
export const GS028_20260929_AUTHORING_CONCEPTS=families.flatMap(x=>x.authoringConcepts);
export const GS028_20260929_TESTED_CONCEPTS=families.flatMap(x=>x.testedConcepts);
export const GS028_20260929_QUESTIONS=families.flatMap(x=>x.questions);
export const GS028_20260929_CASES=families.flatMap(x=>x.cases);
export const GS028_20260929_CLAIMS=families.flatMap(x=>x.claims);
const sourceMap=new Map<string,(typeof families)[number]["sources"][number]>();
for(const item of families.flatMap(x=>x.sources)){
 const existing=sourceMap.get(item.id);
 if(!existing) sourceMap.set(item.id,{...item,evidenceClaimIds:[...item.evidenceClaimIds]});
 else sourceMap.set(item.id,{...existing,evidenceClaimIds:[...new Set([...existing.evidenceClaimIds,...item.evidenceClaimIds])]});
}
export const GS028_20260929_SOURCES=[...sourceMap.values()];
export const GS028_20260929_CASE_REVIEWS=families.flatMap(x=>x.caseReviews);
export const GS028_20260929_TIMING_ENTRIES=families.flatMap(x=>x.timingEntries);
export const GS028_20260929_SERVICE_CONTRACTS=families.flatMap(x=>x.serviceContracts);
export const GS028_20260929_BATCH_MANIFEST={contentVersion:"development-batch.2026-09-29.pre-endoscopy.1",authoringConceptCount:GS028_20260929_AUTHORING_CONCEPTS.length,testedConceptCount:GS028_20260929_TESTED_CONCEPTS.length,questionVariantCount:GS028_20260929_QUESTIONS.length,caseCount:GS028_20260929_CASES.length,decisionNodeCount:GS028_20260929_CASES.flatMap(x=>x.decisionNodes).length,sourceCount:GS028_20260929_SOURCES.length,evidenceClaimCount:GS028_20260929_CLAIMS.length,timingEntryCount:GS028_20260929_TIMING_ENTRIES.length,admissionScope:"active_synthetic_unapproved_prototype",publicReleaseAuthorized:false} as const;

















































