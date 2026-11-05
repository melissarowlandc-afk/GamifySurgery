import type { CaseExhibit, TestedConcept } from "./schema";

export const QUESTION_NEW_N2_VERSION = "clinical.question-new-n2.2026-11-04.v1";
export const QUESTION_NEW_N2_DRAFT = {
  contentVersion: QUESTION_NEW_N2_VERSION, reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true, lastClinicianReview: null,
} as const;
export interface NewN2Choice { id: string; label: string; rationale: string; timingProfileId?: string }
export interface NewN2Item {
  slug: string; conceptId: string; displayName: string; learningObjective: string;
  conceptType: TestedConcept["conceptType"]; educationalTier: 1; level: 3 | 4; category: string;
  acuity: "stable" | "urgent_stable" | "obvious_emergency";
  identityBasis: "new_decision_construct"; nearestExistingConceptIds: string[]; novelty: string;
  patientName: string; age: number; sex: "Female" | "Male";
  complaint: string; presentation: string; stem: string; exhibit?: CaseExhibit;
  choices: [NewN2Choice, NewN2Choice, NewN2Choice] | [NewN2Choice, NewN2Choice, NewN2Choice, NewN2Choice];
  explanation: string; existingClaimIds: string[]; inference: string; closestError: string;
  discriminator: string; counterfactual: string;
  clinicalSettingScope: "current_clinic_decision" | "outside_hospital_record_review";
}
/** The slug is a stable decision identity, never changed for a wording-only repair. */
export function item(input: Omit<NewN2Item, "conceptId" | "educationalTier" | "identityBasis">): NewN2Item {
  return { ...input, conceptId: `concept.n2.${input.slug}`, educationalTier: 1, identityBasis: "new_decision_construct" };
}
export function report(items: Array<[string, string]>): CaseExhibit {
  return { kind: "keyValue", caption: "Constructed teaching record — fictional patient findings",
    items: items.map(([label, value]) => ({ label, value })) };
}
export function comparison(rowHeaders: string[], columnHeaders: string[], cells: string[][]): CaseExhibit {
  return { kind: "table", caption: "Constructed teaching data — fictional observations, not published event rates",
    rowHeaders, columnHeaders, cells };
}
