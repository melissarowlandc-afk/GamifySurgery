import type { GameState } from "@gamify-surgery/game-domain";
import type { QuestionReviewFlagInput } from "./questionReviewFlags";

/** Read only the frozen subject. Never substitute today's authored release. */
export function questionReviewContext(state: GameState, subjectId: string, decisionNodeId: string): QuestionReviewFlagInput | null {
  const subject = state.encounters[subjectId] ?? state.employeeDiscussions?.[subjectId];
  const node = subject?.frozenCase.decisionNodes.find((item) => item.id === decisionNodeId);
  if (!subject || !node) return null;
  const step = subject.steps.find((item) => item.decisionNodeId === node.id);
  const answer = step?.answer ?? ("answers" in subject ? subject.answers.find((item) => item.decisionNodeId === node.id) : null);
  const frozen = subject.frozenCase;
  return {
    campaignId: state.campaignId, clinicName: "Local clinic", clinicalReleaseId: subject.clinicalReleaseId,
    clinicalCaseId: frozen.id, clinicalCaseDisplayName: frozen.displayName,
    patientPresentationVariantId: frozen.patientPresentationVariantId,
    selectedInstantiationProfileId: frozen.selectedInstantiationProfileId ?? null,
    decisionNodeId: node.id, questionVariantId: node.questionVariantId, primaryConceptId: node.primaryConceptId,
    releasePointId: frozen.releasePointId ?? null,
    patientDisplayName: "patientDisplayName" in subject ? subject.patientDisplayName : subject.employeeDisplayName,
    patientPresentation: frozen.presentation, stem: node.stem,
    answerChoices: node.answerChoices.map(({ id, label, isCorrect }) => ({ id, label, isCorrect })),
    explanation: node.explanation, sourceLabels: [...new Set([...frozen.sourceLabels, ...node.sourceLabels])],
    facilityTick: state.facilityTick, selectedAnswerChoiceId: answer?.answerChoiceId ?? null,
    answerWasCorrect: answer?.correct ?? null,
    contentVersion: frozen.patientPresentationRevision?.contentVersion ?? subject.clinicalReleaseId,
    // The frozen runtime schema has no independent concept-version field.
    // Its immutable clinical release is the concept's version namespace.
    conceptVersion: subject.clinicalReleaseId,
  };
}
