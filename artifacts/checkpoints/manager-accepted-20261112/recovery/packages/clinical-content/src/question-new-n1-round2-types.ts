import { QUESTION_NEW_N1_ITEMS } from "./question-new-n1-20261104";
import type { NewN1Choice, NewN1Item } from "./question-new-n1-types";
import type { CaseExhibit } from "./schema";

export const QUESTION_NEW_N1_ROUND2_VERSION = "clinical.question-new-n1.2026-11-04.v2";
export const QUESTION_NEW_N1_ROUND2_DRAFT = {
  contentVersion: QUESTION_NEW_N1_ROUND2_VERSION, reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true, lastClinicianReview: null,
} as const;

/** Manual author judgments, never an independent verdict or clinical sign-off. */
export interface N1Round2SelfCheck {
  coverKeyAttack: string;
  sameStageAndCategory: string;
  interpretFindings: string;
  applyFindings: string;
  predictedDifficulty: "moderate" | "hard";
  difficultyReason: string;
  singleBestAnswer: string;
  closestError: string;
  counterfactual: string;
  reviewerResponse: { cues: string; fairness: string; suggestions: string };
}
export interface N1Round2Revision {
  slug: string;
  previousConceptId: string;
  item: NewN1Item;
  conceptMeaning: "preserved" | "new_version";
  conceptVersionReason: string;
  selfCheck: N1Round2SelfCheck;
}
type Patch = Pick<NewN1Item, "presentation" | "stem" | "choices" | "explanation"> &
  Partial<Pick<NewN1Item, "complaint" | "exhibit" | "existingClaimIds" | "learningObjective" | "conceptType">>;
export function revise(slug: string, patch: Patch, selfCheck: N1Round2SelfCheck,
  newMeaning?: { conceptId: string; reason: string }): N1Round2Revision {
  const original = QUESTION_NEW_N1_ITEMS.find(item => item.slug === slug);
  if (!original) throw new Error(`No original N1 item: ${slug}`);
  return { slug, previousConceptId: original.conceptId,
    item: { ...original, ...patch, conceptId: newMeaning?.conceptId ?? original.conceptId,
      inference: `${selfCheck.interpretFindings} Then ${selfCheck.applyFindings}`,
      closestError: selfCheck.closestError, discriminator: selfCheck.singleBestAnswer,
      counterfactual: selfCheck.counterfactual },
    conceptMeaning: newMeaning ? "new_version" : "preserved",
    conceptVersionReason: newMeaning?.reason ?? "Same scored clinical decision and stable FSRS identity; new observations/options require application rather than the earlier recall or cue shortcut.",
    selfCheck };
}
export const choice = (id: string, label: string, rationale: string, timingProfileId?: string): NewN1Choice =>
  ({ id, label, rationale, ...(timingProfileId ? { timingProfileId } : {}) });
export const record = (rows: Array<[string, string]>): CaseExhibit => ({ kind: "keyValue",
  caption: "Constructed teaching record; patient observations are fictional", items: rows.map(([label, value]) => ({ label, value })) });
export const table = (rows: string[], columns: string[], cells: string[][], caption?: string): CaseExhibit =>
  ({ kind: "table", caption: caption ?? "Constructed teaching record; patient observations are fictional", rowHeaders: rows, columnHeaders: columns, cells });
export const diagram = (slug: string, description: string): CaseExhibit => ({ kind: "image",
  caption: "Original constructed teaching schematic; not a diagnostic image",
  assetPath: `clinical-exhibits/question-new-n1-r2-${slug}.png`, width: 1200, height: 720, description });
