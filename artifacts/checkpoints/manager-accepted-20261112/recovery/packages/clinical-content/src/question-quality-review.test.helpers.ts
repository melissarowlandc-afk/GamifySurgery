import type { SyntheticClinicalCase } from "./schema";
import { QUESTION_QUALITY_CLINICAL_APPROVALS } from "./question-quality-clinical-approvals-20261102";

/** Historical clinical-text comparisons allow only the explicitly approved
 * review annotation to differ. Exact reviewer/date/status are tested separately. */
export function historicalCaseText(value: SyntheticClinicalCase | undefined): SyntheticClinicalCase | undefined {
  if (!value) return value;
  const result=structuredClone(value);
  for(const node of result.decisionNodes){
    const approval=QUESTION_QUALITY_CLINICAL_APPROVALS.find(a=>a.questionVariantId===node.questionVariantId);
    if(!approval)continue;
    const label="Clinically approved: "+approval.reviewer+" on "+approval.reviewedOn+" ("+approval.contentVersion+")";
    node.sourceLabels=node.sourceLabels.map(s=>s===label?"AI-assisted revision: needs_clinician_review ("+approval.contentVersion+")":s);
  }
  return JSON.parse(JSON.stringify(result)) as SyntheticClinicalCase;
}
export function questionText<T extends {reviewStatus:unknown;lastClinicianReview?:unknown}>(question:T):Omit<T,"reviewStatus"|"lastClinicianReview"> {
  const {reviewStatus:_status,lastClinicianReview:_review,...text}=question;
  return JSON.parse(JSON.stringify(text)) as typeof text;
}
