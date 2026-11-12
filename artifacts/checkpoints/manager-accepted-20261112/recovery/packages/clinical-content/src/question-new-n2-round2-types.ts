import type { CaseExhibit } from "./schema";
import { QUESTION_NEW_N2_ITEMS } from "./question-new-n2-20261104";
import type { NewN2Choice, NewN2Item } from "./question-new-n2-types";

export const QUESTION_NEW_N2_ROUND2_VERSION = "clinical.question-new-n2.2026-11-04.v2";
export const QUESTION_NEW_N2_ROUND2_DRAFT = {
  contentVersion: QUESTION_NEW_N2_ROUND2_VERSION, reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true, lastClinicianReview: null,
} as const;

export interface DistractorMisreading {
  choiceId: string;
  plausibleMisreading: string;
  whenItWouldBeRight: string;
  whyNotThisRecord: string;
}
export interface NewN2Round2SelfCheck {
  coverTheKey: string;
  sameDecisionStageAndCategory: string;
  interpretFindings: string;
  consequentialDecision: string;
  residentDifficulty: "moderate" | "hard";
  difficultyReason: string;
  singleBestAnswer: string;
  deletionTest: string;
  distractorMisreadings: DistractorMisreading[];
  calibrationIds: string[];
  calibrationLesson: string;
  sourceLimitations?: string;
}
export interface NewN2Round2Revision {
  slug: string;
  item: NewN2Item;
  previousConceptId: string;
  conceptMeaning: "preserved" | "new_version";
  conceptVersionReason: string;
  noteResponse: string;
  selfCheck: NewN2Round2SelfCheck;
}
interface Input {
  displayName: string;
  clinicalSettingScope?: NewN2Item["clinicalSettingScope"];
  complaint?: string;
  presentation: string;
  stem: string;
  exhibit?: CaseExhibit;
  choices: NewN2Item["choices"];
  explanation: string;
  claimIds?: string[];
  conceptChange?: { id: string; learningObjective: string; reason: string };
  noteResponse: string;
  selfCheck: NewN2Round2SelfCheck;
}

/** Every judgment below is authored per item; this helper grants no rubric PASS. */
export function revise(slug: string, input: Input): NewN2Round2Revision {
  const original = QUESTION_NEW_N2_ITEMS.find(i => i.slug === slug);
  if (!original) throw new Error(`Unknown N2 revision ${slug}`);
  const { selfCheck, noteResponse, conceptChange, claimIds, ...fields } = input;
  if (selfCheck.distractorMisreadings.length !== fields.choices.length - 1)
    throw new Error(`Every distractor needs its own plausible reading: ${slug}`);
  return {
    slug,
    item: {
      ...original, ...fields,
      // Old diagram/conclusion must not leak into a rewritten vignette.
      exhibit: input.exhibit,
      conceptId: conceptChange?.id ?? original.conceptId,
      learningObjective: conceptChange?.learningObjective ?? original.learningObjective,
      existingClaimIds: claimIds ?? original.existingClaimIds,
      inference: `${selfCheck.interpretFindings} Then ${selfCheck.consequentialDecision}`,
      closestError: selfCheck.distractorMisreadings[0]!.plausibleMisreading,
      discriminator: selfCheck.singleBestAnswer,
      counterfactual: selfCheck.distractorMisreadings[0]!.whenItWouldBeRight,
    },
    previousConceptId: original.conceptId,
    conceptMeaning: conceptChange ? "new_version" : "preserved",
    conceptVersionReason: conceptChange?.reason ?? "The original clinical decision meaning is preserved; raw evidence, competing decisions and exact wording are revised without resetting its learning history.",
    noteResponse, selfCheck,
  };
}

export function choice(id: string, label: string, rationale: string, timingProfileId?: string): NewN2Choice {
  return { id, label, rationale, ...(timingProfileId ? { timingProfileId } : {}) };
}
export function record(items: Array<[string, string]>): CaseExhibit {
  return { kind: "keyValue", caption: "Constructed teaching record: fictional observations", items: items.map(([label, value]) => ({label, value})) };
}
export function table(rowHeaders: string[], columnHeaders: string[], cells: string[][], caption = "Constructed teaching record: fictional observations"): CaseExhibit {
  return {kind: "table", caption, rowHeaders, columnHeaders, cells};
}
