import type {N3Item} from "./question-new-n3-types";
import type {N3R2Choice} from "./question-new-n3-round2-types";
export {choice,record} from "./question-new-n3-round2-types";

export const QUESTION_NEW_N3_ROUND4_DRAFT={
 contentVersion:"clinical.question-new-n3.2026-11-10.v4",reviewStatus:"needs_clinician_review",
 aiAssistedDrafting:true,lastClinicianReview:null,
} as const;
export interface N3R4Definition {
 slug:string;previousReviewId:string;previousConceptId:string;conceptId:string;
 conceptMeaning:"same"|"existing_concept";conceptReason:string;
 patch:Pick<N3Item,"presentation"|"stem"|"exhibit"|"explanation"|"learningObjective"|"conceptType"|"complaint"|"clinicalSettingScope"> & {
  choices:[N3R2Choice,N3R2Choice,N3R2Choice]|[N3R2Choice,N3R2Choice,N3R2Choice,N3R2Choice];
 };
 basisClaimIds:string[];keyBasisClaimIds:string[];
 reasoning:{interpret:string;decision:string;closestError:string;decider:string;ablation:string;
  counterfactual:string;counterfactualChoiceId:string;cueAttack:string;stageAudit:string;reviewResponse:string;remainingRisk:string};
}
