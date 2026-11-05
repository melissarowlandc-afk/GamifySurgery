import type { QuestionVariant } from "./pilot-schema";
import type { AnswerChoiceTimingRegistryEntry, SyntheticClinicalCase, TestedConcept } from "./schema";
import { QUESTION_NEW_N1_ITEMS, QUESTION_NEW_N1_CASES, QUESTION_NEW_N1_QUESTIONS,
  QUESTION_NEW_N1_AUTHORING_CONCEPTS, QUESTION_NEW_N1_CASE_REVIEWS, QUESTION_NEW_N1_STATEMENT_MAPPINGS,
  QUESTION_NEW_N1_TIMING_ENTRIES } from "./question-new-n1-20261104";
import { QUESTION_NEW_N1_ROUND2_ABDOMINAL } from "./question-new-n1-round2-abdominal";
import { QUESTION_NEW_N1_ROUND2_BREAST } from "./question-new-n1-round2-breast";
import { QUESTION_NEW_N1_ROUND2_PERIOPERATIVE } from "./question-new-n1-round2-perioperative";
import { QUESTION_NEW_N1_ROUND2_CLAIMS, QUESTION_NEW_N1_ROUND2_CLAIM_PROVENANCE,
  QUESTION_NEW_N1_ROUND2_SOURCES } from "./question-new-n1-round2-evidence-20261104";
import { QUESTION_NEW_N1_ROUND2_DRAFT, QUESTION_NEW_N1_ROUND2_VERSION } from "./question-new-n1-round2-types";

export { QUESTION_NEW_N1_ROUND2_CLAIMS, QUESTION_NEW_N1_ROUND2_CLAIM_PROVENANCE, QUESTION_NEW_N1_ROUND2_SOURCES };
export const QUESTION_NEW_N1_ROUND2_REVISIONS = [...QUESTION_NEW_N1_ROUND2_ABDOMINAL,
  ...QUESTION_NEW_N1_ROUND2_BREAST, ...QUESTION_NEW_N1_ROUND2_PERIOPERATIVE];
const revisionBySlug = new Map(QUESTION_NEW_N1_ROUND2_REVISIONS.map(r => [r.slug, r]));
export const QUESTION_NEW_N1_ROUND2_ITEMS = QUESTION_NEW_N1_ITEMS.map(i => revisionBySlug.get(i.slug)?.item ?? i);
export const QUESTION_NEW_N1_ROUND2_FROZEN_PASS_IDS = [
  "review.n1.phyllodes-benign-margin.v1", "review.n1.aldosterone-overt-phenotype.v1",
] as const;
const template = (text: string, name: string) => text.split(name).join("{patientName}");
const claimsFor = (ids: readonly string[]) => ids.map(id => {
  const p = QUESTION_NEW_N1_ROUND2_CLAIM_PROVENANCE.find(c => c.inheritedClaimId === id);
  if (!p) throw new Error(`Missing N1 round-two claim ${id}`);
  return p.claimId;
});
export const QUESTION_NEW_N1_ROUND2_QUESTIONS: QuestionVariant[] = QUESTION_NEW_N1_ROUND2_ITEMS.map((item, i) => {
  if (!revisionBySlug.has(item.slug)) return QUESTION_NEW_N1_QUESTIONS[i]!;
  return { ...QUESTION_NEW_N1_ROUND2_DRAFT, id: `question.n1.${item.slug}.v2`, conceptId: item.conceptId,
    stem: template(item.stem, item.patientName), explanation: item.explanation,
    ...(item.exhibit ? { exhibit: item.exhibit } : {}), supportingEvidenceClaimIds: claimsFor(item.existingClaimIds),
    answerChoices: item.choices.map((c, index) => ({ id: `choice.n1r2.${item.slug}.${c.id}`, label: c.label,
      isCorrect: index === 0, rationale: c.rationale, distractorRationale: index === 0 ? null : c.rationale })) };
});
export const QUESTION_NEW_N1_ROUND2_CASES: SyntheticClinicalCase[] = QUESTION_NEW_N1_ROUND2_ITEMS.map((item, i) => {
  const old = QUESTION_NEW_N1_CASES[i]!;
  if (!revisionBySlug.has(item.slug)) return old;
  const q = QUESTION_NEW_N1_ROUND2_QUESTIONS[i]!, node = old.decisionNodes[0]!;
  const sourceIds = [...new Set(QUESTION_NEW_N1_ROUND2_CLAIMS.filter(c => q.supportingEvidenceClaimIds.includes(c.id)).flatMap(c => c.sourceIds))];
  const labels = sourceIds.map(id => QUESTION_NEW_N1_ROUND2_SOURCES.find(s => s.id === id)!.title);
  const presentation = template(item.presentation, item.patientName);
  return { ...old, patientPresentationVariantId: `presentation.n1.${item.slug}.v2`, chiefComplaint: item.complaint,
    presentation, sourceLabels: labels,
    approvedInstantiationProfiles: [{ id: `profile.n1.${item.slug}.v2`, prototypeDemographics: old.prototypeDemographics!,
      chiefComplaint: item.complaint, presentation }],
    decisionNodes: [{ ...node, questionVariantId: q.id, primaryConceptId: item.conceptId, stem: q.stem,
      answerChoices: q.answerChoices.map(c => ({ id: c.id, label: c.label, isCorrect: c.isCorrect, rationale: c.rationale!, serviceRequest: null })),
      shuffleAnswers: true, explanation: q.explanation, ...(item.exhibit ? { exhibit: item.exhibit } : {}), sourceLabels: labels,
      resultGateAfter: null,
      terminalDispositions: q.answerChoices.filter(c => !c.isCorrect).map(c => ({ answerChoiceId: c.id,
        kind: "no_terminal_outcome" as const, consequenceNarrative: "This draft ends with feedback on the selected plan; no clinical outcome is simulated.",
        clinicalRationale: c.rationale!, sourceLabels: labels })) }], learningSummary: q.explanation };
});
export const QUESTION_NEW_N1_ROUND2_REVISED_CASES = QUESTION_NEW_N1_ROUND2_CASES.filter(c => c.decisionNodes[0]!.questionVariantId.endsWith(".v2"));
export const QUESTION_NEW_N1_ROUND2_AUTHORING_CONCEPTS = QUESTION_NEW_N1_ROUND2_ITEMS.map((item, i) => {
  const revision = revisionBySlug.get(item.slug);
  return revision ? { ...QUESTION_NEW_N1_AUTHORING_CONCEPTS[i]!, ...QUESTION_NEW_N1_ROUND2_DRAFT,
    id: item.conceptId, learningObjective: item.learningObjective, conceptType: item.conceptType,
    evidenceClaimIds: claimsFor(item.existingClaimIds), previousConceptId: revision.previousConceptId,
    conceptMeaning: revision.conceptMeaning, conceptVersionReason: revision.conceptVersionReason,
    historyMigration: "None. Preserved meanings retain IDs; materially changed constructs use new IDs and leave old histories intact." }
    : QUESTION_NEW_N1_AUTHORING_CONCEPTS[i]!;
});
export const QUESTION_NEW_N1_ROUND2_NEW_CONCEPT_VERSIONS: TestedConcept[] = QUESTION_NEW_N1_ROUND2_REVISIONS
  .filter(r => r.conceptMeaning === "new_version").map(r => ({ id: r.item.conceptId, displayName: r.item.displayName,
    learningObjective: r.item.learningObjective, earliestFacilityStage: r.item.level, conceptType: r.item.conceptType }));
export const QUESTION_NEW_N1_ROUND2_TESTED_CONCEPTS: TestedConcept[] = QUESTION_NEW_N1_ROUND2_REVISIONS
  .map(r => ({ id: r.item.conceptId, displayName: r.item.displayName, learningObjective: r.item.learningObjective,
    earliestFacilityStage: r.item.level, conceptType: r.item.conceptType }));

export const QUESTION_NEW_N1_ROUND2_REVIEW_TIMING: AnswerChoiceTimingRegistryEntry[] = QUESTION_NEW_N1_ROUND2_CASES.map((cs, i) => {
  const item = QUESTION_NEW_N1_ROUND2_ITEMS[i]!;
  if (!revisionBySlug.has(item.slug)) return QUESTION_NEW_N1_TIMING_ENTRIES[i]!;
  const node = cs.decisionNodes[0]!;
  return { caseId: cs.id, nodeId: node.id, questionVariantId: node.questionVariantId,
    classification: item.choices.some(c => c.timingProfileId) ? { kind: "test_choices",
      choices: node.answerChoices.map((choice, index) => ({ choiceId: choice.id, choiceLabel: choice.label,
        timing: item.choices[index]!.timingProfileId ? { kind: "test", timingProfileId: item.choices[index]!.timingProfileId! } : { kind: "no_test" } })) }
      : { kind: "no_test" } };
});
export const QUESTION_NEW_N1_ROUND2_TIMING_ENTRIES = QUESTION_NEW_N1_ROUND2_REVIEW_TIMING.filter(t => t.questionVariantId.endsWith(".v2"));
export const QUESTION_NEW_N1_ROUND2_CASE_REVIEWS = QUESTION_NEW_N1_ROUND2_CASES.map((cs, i) => {
  const item = QUESTION_NEW_N1_ROUND2_ITEMS[i]!;
  return revisionBySlug.has(item.slug) ? { ...QUESTION_NEW_N1_ROUND2_DRAFT,
    id: `review.n1.${item.slug}.v2`, caseId: cs.id, educationalTier: item.educationalTier,
    acuity: item.acuity, earliestFacilityStage: item.level, evidenceClaimIds: QUESTION_NEW_N1_ROUND2_QUESTIONS[i]!.supportingEvidenceClaimIds }
    : QUESTION_NEW_N1_CASE_REVIEWS[i]!;
});
export const QUESTION_NEW_N1_ROUND2_STATEMENT_MAPPINGS = QUESTION_NEW_N1_ROUND2_CASES.map((cs, i) => {
  if (!revisionBySlug.has(QUESTION_NEW_N1_ROUND2_ITEMS[i]!.slug)) return QUESTION_NEW_N1_STATEMENT_MAPPINGS[i]!;
  const ids = QUESTION_NEW_N1_ROUND2_QUESTIONS[i]!.supportingEvidenceClaimIds;
  return { ...QUESTION_NEW_N1_ROUND2_DRAFT, caseId: cs.id, questionVariantId: cs.decisionNodes[0]!.questionVariantId,
    fields: ["presentation", "decisionNodes[0].stem", "decisionNodes[0].exhibit", "decisionNodes[0].explanation", "learningSummary",
      ...cs.decisionNodes[0]!.answerChoices.map((_, j) => `decisionNodes[0].answerChoices[${j}].rationale`)],
    evidenceClaimIds: ids, constructedDataBasis: "Fictional patient observations, dated input records and resection maps. Patient measurements/targets are not epidemiologic rates, universal thresholds, doses or clinical timing rules.",
    policyBasis: cs.presentation.includes("Bishr") ? "Independently synthesized limited policy facts from Bishr et al., BJS 2025, doi:10.1093/bjs/znaf152; original access date retained. No source table/prose copied." : null };
});
export const QUESTION_NEW_N1_ROUND2_SOURCE_LINKS = QUESTION_NEW_N1_ROUND2_SOURCES.filter(s => s.officialUrl).map(s => ({
  ...QUESTION_NEW_N1_ROUND2_DRAFT, id: `link.n1r2.${s.id.replace(/^source\./, "")}`, sourceId: s.id, label: s.title,
  href: s.officialUrl!, target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer" }));

/** Fresh definitions only; frozen encounters/saved histories are not rewritten. */
export function applyQuestionNewN1Round2Revisions(cases: SyntheticClinicalCase[]): SyntheticClinicalCase[] {
  // Schema parsing orders object properties; that is not a clinical field change.
  // Arrays and every field/value remain exact in this comparison.
  const canonical = (value: unknown): unknown => Array.isArray(value) ? value.map(canonical)
    : value && typeof value === "object" ? Object.fromEntries(Object.keys(value).sort().map(key =>
      [key, canonical((value as Record<string, unknown>)[key])])) : value;
  const revised = new Map(QUESTION_NEW_N1_ROUND2_REVISED_CASES.map(c => [c.id, c]));
  for (const old of QUESTION_NEW_N1_CASES.filter(c => revised.has(c.id))) {
    const current = cases.find(c => c.id === old.id);
    if (!current || JSON.stringify(canonical(current)) !== JSON.stringify(canonical(old))) throw new Error(`N1 round-two prior binding changed: ${old.id}`);
  }
  return cases.map(c => revised.get(c.id) ?? c);
}
export const QUESTION_NEW_N1_ROUND2_MANIFEST = {
  ...QUESTION_NEW_N1_ROUND2_DRAFT, id: "batch.question-new-n1-round2.2026-11-04", contentVersion: QUESTION_NEW_N1_ROUND2_VERSION,
  reviewSource: "docs/research/question-new-n1-review-20261104.json", originalReviewCounts: { PASS: 2, REVISE: 37, FAIL: 1 },
  variantCount: 40, revisedVariantCount: 38, frozenPassCount: 2, frozenPassIds: QUESTION_NEW_N1_ROUND2_FROZEN_PASS_IDS,
  newConstructVersions: QUESTION_NEW_N1_ROUND2_NEW_CONCEPT_VERSIONS.length,
  pipelinePassed: false, clinicalApproval: false, publicReleaseAuthorized: false,
  authorSelfCheck: "All 38 returned items have manual cover-key, same-stage/category, two-step, predicted PGY-2/3 difficulty and unique-key records. Author judgments require independent review and are not clinical approval.",
  sourceVerification: "Offline reuse with actual previous dates; five explicit new syntheses, including named-drug examples that require targeted exact-support verification. No source retrieved or currentness claim.",
  executionScope: "Existing clinic decisions or explicit outside-hospital record review; no new executable service, order/result gate, FSRS or selector rule.",
  N2: "Frozen and excluded from this turn's edits and rubric review while independent review runs.",
} as const;
