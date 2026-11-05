import type { CaseExhibit, TestedConcept } from "./schema";

export const QUESTION_NEW_N3_VERSION = "clinical.question-new-n3.2026-11-05.v1";
export const QUESTION_NEW_N3_DRAFT = {
  contentVersion: QUESTION_NEW_N3_VERSION, reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true, lastClinicianReview: null,
} as const;

export interface N3Choice {
  id: string; label: string; rationale: string; correctUnder: string; timingProfileId?: string;
}
export interface N3Item {
  slug: string; displayName: string; learningObjective: string; conceptType: TestedConcept["conceptType"];
  level: 3 | 4; category: string; acuity: "stable" | "urgent_stable" | "obvious_emergency";
  nearestExistingConceptIds: string[]; novelty: string;
  patientName: string; age: number; sex: "Female" | "Male"; complaint: string; presentation: string;
  stem: string; exhibit: CaseExhibit;
  choices: [N3Choice, N3Choice, N3Choice] | [N3Choice, N3Choice, N3Choice, N3Choice];
  explanation: string; existingClaimIds: string[];
  interpret: string; apply: string; closestError: string; decider: string; counterfactual: string;
  cueAttack: string; decisionCategory: string; predictedDifficulty: "moderate" | "hard";
  clinicalSettingScope: "current_clinic_decision" | "outside_hospital_record_review";
}
export function choice(id: string, label: string, rationale: string, correctUnder: string, timingProfileId?: string): N3Choice {
  return { id, label, rationale, correctUnder, ...(timingProfileId ? { timingProfileId } : {}) };
}
export function record(rows: Array<[string, string]>): CaseExhibit {
  return {kind: "keyValue", caption: "Original constructed teaching record; fictional patient observations",
    items: rows.map(([label, value]) => ({label, value}))};
}
/** Proposed decision identities require independent overlap review before acceptance. */
export function item(input: N3Item): N3Item {
  return {...input,nearestExistingConceptIds:[...new Set(input.nearestExistingConceptIds)]};
}
