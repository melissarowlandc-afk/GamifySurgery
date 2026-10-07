import { ANSWER_CHOICE_TIMING_REGISTRY, type DecisionNode } from "@gamify-surgery/clinical-content";
import type { EncounterState } from "./types";

export interface DiagnosticResultDisposition {
  specimenCollected: boolean;
  resultKind: "visual" | "pathology";
}

interface ExactDiagnosticResultRecord {
  caseId: string;
  nodeId: string;
  questionVariantId: string;
  choiceId: string;
  choiceLabel: string;
  timingProfileId: string;
  result?: DiagnosticResultDisposition;
  components?: Readonly<Record<string, DiagnosticResultDisposition>>;
}

const visual: DiagnosticResultDisposition = { specimenCollected: false, resultKind: "visual" };
const pathology: DiagnosticResultDisposition = { specimenCollected: true, resultKind: "pathology" };
// The existing colorectal gate reports a sampled lesion and says histology is
// pending. That visual update is available before its background pathology.
const sampledVisual: DiagnosticResultDisposition = { specimenCollected: true, resultKind: "visual" };

function family(familyId: string, slugs: readonly string[], nodeIndex: number, question: string,
  choice: string, label: string, timingProfileId: string, result: DiagnosticResultDisposition): ExactDiagnosticResultRecord[] {
  return slugs.map((slug, index) => ({ caseId: `case.${familyId}.${slug}`, nodeId: `node.${familyId}.${slug}.${nodeIndex}`,
    questionVariantId: `question.${question}.v${index + 1}`, choiceId: `${choice}_${index + 1}`, choiceLabel: label, timingProfileId, result }));
}

/** Operational metadata bound to existing frozen wording; no new clinical prose. */
export const EXACT_DIAGNOSTIC_RESULT_RECORDS: readonly ExactDiagnosticResultRecord[] = [
  // 2026-09-12/recovered-diverticulitis.ts: negative visual examination.
  ...family("recovered-diverticulitis", ["drained-abscess", "hospital-followup", "ct-resolved", "recovery-visit"], 1,
    "recovered-diverticulitis.interval-colonoscopy", "colonoscopy", "Colonoscopy", "timing.test.lower_endoscopy", visual),
  // 2026-09-10/esophageal-dysphagia.ts: explicitly awaited biopsy findings.
  ...family("esophageal-dysphagia", ["bread-sticking", "meal-pauses", "progressive-solids", "restaurant-meals"], 1,
    "esophageal-dysphagia.upper-endoscopy", "egd", "EGD with esophageal biopsies", "timing.test.upper_endoscopy", pathology),
  // 2026-09-09/colorectal.ts: visual/sampling update, histology still pending.
  ...family("colorectal", ["routine-screen", "mailed-fit", "preventive-visit", "repeat-screening"], 1,
    "colorectal.positive-fit-colonoscopy", "colonoscopy", "Diagnostic colonoscopy", "timing.test.lower_endoscopy", sampledVisual),
  // 2026-09-09/celiac.ts: correct and distractor options explicitly sample.
  ...family("celiac", ["chronic-diarrhea", "iron-deficiency-symptoms", "weight-loss-discomfort", "family-history"], 2,
    "celiac.duodenal-biopsy-confirmation", "endoscopy_biopsy", "Arrange upper endoscopy with duodenal biopsies", "timing.test.endoscopy_with_sampling", pathology),
  ...family("celiac", ["chronic-diarrhea", "iron-deficiency-symptoms", "weight-loss-discomfort", "family-history"], 2,
    "celiac.duodenal-biopsy-confirmation", "colonoscopy", "Arrange colonoscopy with random colonic biopsies", "timing.test.lower_endoscopy", pathology),
  // 2026-09-17/eosinophilic-esophagitis.ts: returned biopsy findings.
  ...family("eoe", ["meat-sticks", "slow-eating", "bread-sticks", "chews-carefully"], 1,
    "eoe.multilevel-esophageal-biopsies", "egd_biopsy", "Endoscopy with biopsies", "timing.test.esophageal_multilevel_biopsy", pathology),
  // 2026-09-09/iron-deficiency.ts: no sampling/result contract is promised.
  ...family("iron-deficiency", ["adult-man-fatigue", "postmenopausal-dyspnea", "adult-man-donation", "postmenopausal-checkup"], 2,
    "iron-deficiency.gi-evaluation", "bidirectional", "Bidirectional endoscopy", "timing.test.upper_endoscopy", visual),
  // 2026-09-11/pancreatic-cyst.ts: possible sampling does not promise a specimen.
  ...family("pancreatic-cyst", ["incidental-tail", "body-cyst-followup", "surveillance-question", "tail-lesion-review"], 1,
    "pancreatic-cyst.mrcp-duct-assessment", "eus", "Endoscopic ultrasound with possible sampling", "timing.test.endoscopy_with_sampling", visual),
  ...["teacher-followup", "caregiver-followup", "cyclist-followup", "accountant-followup"].flatMap((slug, index) => [
    { caseId: `case.rectal-cancer.${slug}`, nodeId: `node.rectal-cancer.${slug}.1`, questionVariantId: `question.rectal-cancer.multimodal-response-assessment.v${index + 1}`,
      choiceId: `multimodal_response_${index + 1}`, choiceLabel: "DRE, endoscopy, and rectal MRI", timingProfileId: "timing.test.rectal_response_assessment",
      components: { endoscopic_assessment: visual } },
    { caseId: `case.rectal-cancer.${slug}`, nodeId: `node.rectal-cancer.${slug}.1`, questionVariantId: `question.rectal-cancer.multimodal-response-assessment.v${index + 1}`,
      choiceId: `endoscopy_biopsy_${index + 1}`, choiceLabel: "Endoscopy with biopsy", timingProfileId: "timing.test.endoscopy_with_sampling", result: pathology },
  ]),
  { caseId: "case.l2.gastroparesis.general-confirmatory-testing.v1", nodeId: "node.gastroparesis.general-confirmatory-testing.v1",
    questionVariantId: "question.gastroparesis.general-confirmatory-testing.v1", choiceId: "repeat_endoscopy_biopsies",
    choiceLabel: "Repeat upper endoscopy with systematic gastric biopsies", timingProfileId: "timing.test.upper_endoscopy", result: pathology },
];

const exactKey = (entry: Pick<ExactDiagnosticResultRecord, "caseId" | "nodeId" | "questionVariantId" | "choiceId">) =>
  `${entry.caseId}|${entry.nodeId}|${entry.questionVariantId}|${entry.choiceId}`;
const records = new Map(EXACT_DIAGNOSTIC_RESULT_RECORDS.map((entry) => [exactKey(entry), entry]));

/** Labels and profiles guard against applying metadata to a changed version. */
export function getDiagnosticResultDisposition(encounter: EncounterState, node: DecisionNode, choiceId: string,
  componentId?: string): DiagnosticResultDisposition | null {
  const choice = node.answerChoices.find((entry) => entry.id === choiceId);
  if (!choice) return null;
  const entry = records.get(exactKey({ caseId: encounter.frozenCase.id, nodeId: node.id, questionVariantId: node.questionVariantId, choiceId }));
  if (!entry || entry.choiceLabel !== choice.label) return null;
  const registered = ANSWER_CHOICE_TIMING_REGISTRY.find((candidate) => candidate.caseId === encounter.frozenCase.id &&
    candidate.nodeId === node.id && candidate.questionVariantId === node.questionVariantId);
  const timing = registered?.classification.kind === "test_choices" ? registered.classification.choices.find((candidate) =>
    candidate.choiceId === choice.id && candidate.choiceLabel === choice.label)?.timing : null;
  if (timing?.kind !== "test" || timing.timingProfileId !== entry.timingProfileId) return null;
  const result = componentId ? entry.components?.[componentId] : entry.result;
  return result ? { ...result } : null;
}
