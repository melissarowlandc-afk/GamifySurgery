import type {CaseExhibit,TestedConcept} from "./schema";

export const QUESTION_NEW_N4_DRAFT={contentVersion:"clinical.question-new-n4.2026-11-10.v1",
 reviewStatus:"needs_clinician_review",aiAssistedDrafting:true,lastClinicianReview:null} as const;
export type N4Group="intra_op"|"intra_endoscopy"|"wound_ostomy"|"pediatric";
export interface N4Choice {
 id:string;label:string;rationale:string;competentError:string;correctUnder:string;timingProfileId?:string;
}
export const choice=(id:string,label:string,rationale:string,competentError:string,correctUnder:string,timingProfileId?:string):N4Choice=>
 ({id,label,rationale,competentError,correctUnder,...(timingProfileId?{timingProfileId}:{})});
export const record=(rows:[string,string][]):CaseExhibit=>({kind:"keyValue",
 caption:"Original constructed teaching record; fictional patient observations",items:rows.map(([label,value])=>({label,value}))});
export interface N4Item {
 slug:string;group:N4Group;name:string;age:number;sex:"Female"|"Male";complaint:string;
 presentation:string;task:string;exhibit:CaseExhibit;
 conceptId:string;conceptType:TestedConcept["conceptType"];objective:string;
 conceptRelation:"existing_meaning_variant"|"new_meaning";
 conceptReason:string;stage:2|3|4;tier:1|2;acuity:"stable"|"urgent";
 phase:string;
 choices:[N4Choice,N4Choice,N4Choice]|[N4Choice,N4Choice,N4Choice,N4Choice];explanation:string;
 basisClaimIds:string[];keyBasisClaimIds:string[];
 /** Only exact, already-published editorial child/parent/art combinations. */
 familyBasisCaseId?:string;
 reasoning:{stepA:string;stepB:string;closestCompetitor:string;decider:string;
  ablation:string;counterfactual:string;counterfactualChoiceId:string;
  cueAttack:string;stageAudit:string;difficulty:string;remainingRisk:string};
}
