import { QUESTION_NEW_N3_ROUND2_ITEMS, QUESTION_NEW_N3_ROUND2_AUTHORING_CONCEPTS } from "./question-new-n3-round2-20261105";
import type { N3Item } from "./question-new-n3-types";
import type { N3R2Choice, N3R2Attack } from "./question-new-n3-round2-types";
export { choice, record } from "./question-new-n3-round2-types";
export const QUESTION_NEW_N3_ROUND3_DRAFT = {
  contentVersion:"clinical.question-new-n3.2026-11-05.v3",reviewStatus:"needs_clinician_review",
  aiAssistedDrafting:true,lastClinicianReview:null,
} as const;
export interface N3R3Revision {
  slug:string;previousConceptId:string;conceptId:string;conceptMeaning:"same"|"new_version";conceptVersionReason:string;
  item:Omit<N3Item,"choices"> & {choices:[N3R2Choice,N3R2Choice,N3R2Choice]};
  keyClaimIds:string[];attack:N3R2Attack;
}
type Patch=Pick<N3Item,"presentation"|"stem"|"exhibit"|"explanation"|"existingClaimIds"|"interpret"|"apply"|"closestError"|"decider"|"counterfactual"|"cueAttack"|"decisionCategory"> &
  Partial<Omit<N3Item,"choices">> & {choices:[N3R2Choice,N3R2Choice,N3R2Choice]};
/** Authoring helper only: unknown IDs are a build/test error, never a player-path admission check. */
export function revise(slug:string,patch:Patch,keyClaimIds:string[],attack:N3R2Attack,
  meaning:{kind:"same"|"new_version";reason:string}):N3R3Revision {
  const index=QUESTION_NEW_N3_ROUND2_ITEMS.findIndex(i=>i.slug===slug);
  if(index<0)throw Error("Unknown retained N3 authoring item: "+slug);
  const previousConceptId=QUESTION_NEW_N3_ROUND2_AUTHORING_CONCEPTS[index]!.id;
  return {slug,previousConceptId,conceptId:meaning.kind==="same"?previousConceptId:"concept.n3."+slug+".v3",
    conceptMeaning:meaning.kind,conceptVersionReason:meaning.reason,
    item:{...QUESTION_NEW_N3_ROUND2_ITEMS[index]!,...patch,slug,choices:patch.choices},keyClaimIds,attack};
}
