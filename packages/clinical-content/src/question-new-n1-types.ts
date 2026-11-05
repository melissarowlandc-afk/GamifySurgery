import type { CaseExhibit, TestedConcept } from "./schema";

export const QUESTION_NEW_N1_VERSION = "clinical.question-new-n1.2026-11-04.v1";
export const QUESTION_NEW_N1_DRAFT = {
  contentVersion: QUESTION_NEW_N1_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

export interface NewN1Choice {
  id: string;
  label: string;
  rationale: string;
  timingProfileId?: string;
}

/** Authoring metadata only. Educational tier never controls facility admission. */
export interface NewN1Item {
  slug: string;
  conceptId: string;
  displayName: string;
  learningObjective: string;
  conceptType: TestedConcept["conceptType"];
  educationalTier: 0 | 1;
  level: 3 | 4;
  category: string;
  acuity: "stable" | "urgent_stable" | "obvious_emergency";
  identityBasis: "new_decision_construct" | "preserved_unadmitted_identity";
  nearestExistingConceptIds: string[];
  novelty: string;
  patientName: string;
  age: number;
  sex: "Female" | "Male";
  complaint: string;
  presentation: string;
  stem: string;
  exhibit?: CaseExhibit;
  /** First choice is keyed in authoring; every runtime node shuffles. */
  choices: [NewN1Choice, NewN1Choice, NewN1Choice] | [NewN1Choice, NewN1Choice, NewN1Choice, NewN1Choice];
  explanation: string;
  existingClaimIds: string[];
  inference: string;
  closestError: string;
  discriminator: string;
  counterfactual: string;
  clinicalSettingScope: "current_clinic_decision" | "outside_hospital_record_review";
}

export function report(items: Array<[string, string]>): CaseExhibit {
  return { kind: "keyValue", caption: "Constructed teaching record — fictional patient findings", items: items.map(([label, value]) => ({ label, value })) };
}

export function comparison(rowHeaders: string[], columnHeaders: string[], cells: string[][]): CaseExhibit {
  return { kind: "table", caption: "Constructed teaching comparison — fictional records", rowHeaders, columnHeaders, cells };
}
