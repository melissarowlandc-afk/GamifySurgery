import { QUESTION_NEW_N3_ITEMS } from "./question-new-n3-20261105";
import type { N3Choice, N3Item } from "./question-new-n3-types";
export { record } from "./question-new-n3-types";

export const QUESTION_NEW_N3_ROUND2_VERSION = "clinical.question-new-n3.2026-11-05.v2";
export const QUESTION_NEW_N3_ROUND2_DRAFT = {
  contentVersion: QUESTION_NEW_N3_ROUND2_VERSION, reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true, lastClinicianReview: null,
} as const;
export interface N3R2Choice extends N3Choice { plausibleMisreading: string }
export function choice(id:string,label:string,rationale:string,plausibleMisreading:string,correctUnder:string,timingProfileId?:string):N3R2Choice {
  return {id,label,rationale,plausibleMisreading,correctUnder,...(timingProfileId?{timingProfileId}:{})};
}
export interface N3R2Attack {
  removedFinding:string; withoutIt:string; alternativeFinding:string; thenBestChoiceId:string;
  strongestShortcut:string; repair:string; residualConcern:string;
}
export interface N3R2Revision {
  slug:string; previousConceptId:string; conceptId:string; conceptMeaning:"same"|"new_version"|"existing_concept";
  conceptVersionReason:string; item:Omit<N3Item,"choices"> & {choices:[N3R2Choice,N3R2Choice,N3R2Choice]|[N3R2Choice,N3R2Choice,N3R2Choice,N3R2Choice]}; keyClaimIds:string[]; attack:N3R2Attack;
}
type RequiredPatch = Pick<N3Item,"presentation"|"stem"|"exhibit"|"explanation"|"existingClaimIds"|"interpret"|"apply"|"closestError"|"decider"|"counterfactual"|"cueAttack"|"decisionCategory"> &
  Partial<Omit<N3Item,"choices">> & {choices:[N3R2Choice,N3R2Choice,N3R2Choice]|[N3R2Choice,N3R2Choice,N3R2Choice,N3R2Choice]};
/** Author decisions are recorded for review, never converted into an automatic PASS. */
export function revise(slug:string,patch:RequiredPatch,keyClaimIds:string[],attack:N3R2Attack,
  meaning:{kind:N3R2Revision["conceptMeaning"];reason:string;existingId?:string}={kind:"same",reason:"The scored clinical boundary is retained; this changes its application and competing plans."}):N3R2Revision {
  const old=QUESTION_NEW_N3_ITEMS.find(i=>i.slug===slug);
  if(!old)throw new Error(`Unknown retained N3 slug: ${slug}`);
  const previousConceptId=`concept.n3.${slug}`;
  const conceptId=meaning.kind==="existing_concept"?meaning.existingId!:meaning.kind==="new_version"?`${previousConceptId}.v2`:previousConceptId;
  return {slug,previousConceptId,conceptId,conceptMeaning:meaning.kind,conceptVersionReason:meaning.reason,
    item:{...old,...patch,slug,choices:patch.choices},keyClaimIds,attack};
}
