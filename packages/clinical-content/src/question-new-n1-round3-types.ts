import { QUESTION_NEW_N1_ROUND2_ITEMS } from "./question-new-n1-round2-20261104";
import type { NewN1Choice, NewN1Item } from "./question-new-n1-types";
import type { CaseExhibit } from "./schema";

export const QUESTION_NEW_N1_ROUND3_VERSION = "clinical.question-new-n1.2026-11-04.v3";
export const QUESTION_NEW_N1_ROUND3_DRAFT = { contentVersion: QUESTION_NEW_N1_ROUND3_VERSION,
  reviewStatus: "needs_clinician_review", aiAssistedDrafting: true, lastClinicianReview: null } as const;
export interface R3Choice extends NewN1Choice { correctUnder: string }
export interface R3SelfCheck {
  coverKeyAttack: string; sameStageAndCategory: string; interpretFindings: string; applyFindings: string;
  predictedDifficulty: "moderate" | "hard"; difficultyReason: string; singleBestAnswer: string;
  closestError: string; counterfactual: string;
  reviewerResponse: { cues: string; fairness: string; suggestions: string };
}
export interface R3Revision { slug: string; previousConceptId: string; item: NewN1Item;
  conceptMeaning: "preserved" | "new_version"; conceptVersionReason: string;
  selfCheck: R3SelfCheck; optionChecks: Array<{ choiceId: string; label: string; correctUnder: string }> }
type Patch = Pick<NewN1Item, "presentation" | "stem" | "explanation"> & { choices: [R3Choice,R3Choice,R3Choice] | [R3Choice,R3Choice,R3Choice,R3Choice] } &
  Partial<Pick<NewN1Item,"complaint"|"learningObjective"|"displayName"|"conceptType"|"existingClaimIds"|"clinicalSettingScope"|"acuity">> & { exhibit?: CaseExhibit };
export function revise(slug: string, patch: Patch, selfCheck: R3SelfCheck,
  meaning?: { conceptId: string; reason: string }): R3Revision {
  const old = QUESTION_NEW_N1_ROUND2_ITEMS.find(i => i.slug === slug);
  if (!old) throw new Error(`Unknown N1 round-three slug ${slug}`);
  // A removed exhibit must not survive through a spread of the previous question.
  const { exhibit: _oldExhibit, ...base } = old;
  return { slug, previousConceptId: old.conceptId, item: { ...base, ...patch,
    choices: patch.choices.map(({correctUnder: _reviewOnly, ...c}) => c) as NewN1Item["choices"],
    conceptId: meaning?.conceptId ?? old.conceptId,
    inference: `${selfCheck.interpretFindings} Then ${selfCheck.applyFindings}`,
    closestError: selfCheck.closestError, discriminator: selfCheck.singleBestAnswer, counterfactual: selfCheck.counterfactual },
    conceptMeaning: meaning ? "new_version" : "preserved",
    conceptVersionReason: meaning?.reason ?? "Same clinical objective and stable history; observations, alternatives and wording are new exact versions.",
    selfCheck, optionChecks: patch.choices.map(c => ({ choiceId:c.id,label:c.label,correctUnder:c.correctUnder })) };
}
export const choice = (id:string,label:string,rationale:string,correctUnder:string,timingProfileId?:string):R3Choice =>
  ({id,label,rationale,correctUnder,...(timingProfileId?{timingProfileId}:{})});
export const record = (rows:Array<[string,string]>):CaseExhibit => ({kind:"keyValue",caption:"Constructed teaching record; fictional patient observations",items:rows.map(([label,value])=>({label,value}))});
export const table = (rowHeaders:string[],columnHeaders:string[],cells:string[][]):CaseExhibit =>
  ({kind:"table",caption:"Constructed teaching record; fictional patient observations",rowHeaders,columnHeaders,cells});
