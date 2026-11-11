import type {N4Item} from "./question-new-n4-types";
export type N4R2Item=N4Item & {version:1|2;priorReviewId:string|null;slot:string;};
export const QUESTION_NEW_N4_ROUND2_DRAFT={contentVersion:"clinical.question-new-n4.2026-11-10.round2.v1",reviewStatus:"needs_clinician_review",aiAssistedDrafting:true,lastClinicianReview:null} as const;
