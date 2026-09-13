import {
  PATIENT_LIBRARY_CASE_WORDING_REVISIONS,
  PATIENT_LIBRARY_NODE_STEM_REVISIONS,
  PATIENT_LIBRARY_PROFILE_WORDING_REVISIONS,
} from "@gamify-surgery/clinical-content";

export interface ClinicalDecisionText {
  question: string;
  context?: string;
}

const QUESTION_OPENERS = [
  "Which",
  "What",
  "How",
  "When",
  "Where",
  "Who",
  "Should",
  "Does",
  "Do",
  "Is",
  "Are",
  "Select",
  "Choose",
  "Identify",
] as const;

/**
 * Separates vignette/update prose from the actual decision prompt for display.
 * The authored stem remains untouched in the frozen encounter and provenance
 * records; this only prevents the chart from rendering patient presentation
 * prose a second time above the answer choices.
 */
export function splitClinicalDecisionStem(
  authoredStem: string,
): ClinicalDecisionText {
  const stem = authoredStem.trim().replace(/\s+/g, " ");
  if (!stem) {
    return { question: "" };
  }

  const openerPattern = new RegExp(
    `\\b(${QUESTION_OPENERS.join("|")})\\b`,
    "gi",
  );
  const candidates = [...stem.matchAll(openerPattern)].filter((match) => {
    const index = match.index ?? 0;
    if (index === 0) {
      return true;
    }
    const prefix = stem.slice(0, index);
    const opener = match[0] ?? "";
    return (
      /^[A-Z]/.test(opener) ||
      /[.!?:;,]\s*$/.test(prefix)
    );
  });
  const questionMatch = candidates.at(-1);
  const questionStart = questionMatch?.index ?? -1;

  if (questionStart <= 0) {
    return { question: stem };
  }

  const context = stem.slice(0, questionStart).trim();
  const question = stem.slice(questionStart).trim();
  if (!context || !question) {
    return { question: stem };
  }
  return { context, question };
}

const PILONIDAL_CASE_PREFIX = "case.pilonidal-disease.";

export interface FrozenClinicalTextInput {
  readonly clinicalCaseId: string;
  readonly patientDisplayName: string;
  readonly text: string | null | undefined;
  readonly field: "chiefComplaint" | "presentation" | "stem" | "currentUpdate";
  readonly selectedInstantiationProfileId?: string;
  readonly decisionNodeId?: string;
  readonly questionVariantId?: string;
}

function materializePatientName(text: string, patientDisplayName: string): string {
  return text.replaceAll("{patientName}", patientDisplayName);
}

/**
 * Presents only known pre-repair frozen wording using the literal September 13
 * mappings. It deliberately leaves unknown or customized saved text intact.
 */
export function normalizeFrozenClinicalText(
  input: FrozenClinicalTextInput,
): string | undefined {
  const { clinicalCaseId, patientDisplayName, text, field } = input;
  if (field === "chiefComplaint") {
    const revision = PATIENT_LIBRARY_CASE_WORDING_REVISIONS.find(
      (candidate) => candidate.caseId === clinicalCaseId,
    );
    if (
      revision?.sourceChiefComplaint === null &&
      (text === null || text === undefined)
    ) {
      return materializePatientName(revision.revisedChiefComplaint, patientDisplayName);
    }
    if (
      revision &&
      revision.sourceChiefComplaint !== null &&
      text === materializePatientName(revision.sourceChiefComplaint, patientDisplayName)
    ) {
      return materializePatientName(revision.revisedChiefComplaint, patientDisplayName);
    }
  }
  if (!text) return text ?? undefined;
  if (field === "presentation") {
    if (input.selectedInstantiationProfileId) {
      const profileRevision = PATIENT_LIBRARY_PROFILE_WORDING_REVISIONS.find(
        (candidate) =>
          candidate.caseId === clinicalCaseId &&
          candidate.approvedInstantiationProfileId === input.selectedInstantiationProfileId,
      );
      if (
        profileRevision &&
        text === materializePatientName(profileRevision.sourcePresentation, patientDisplayName)
      ) {
        return materializePatientName(profileRevision.revisedPresentation, patientDisplayName);
      }
    } else {
      const revision = PATIENT_LIBRARY_CASE_WORDING_REVISIONS.find(
        (candidate) => candidate.caseId === clinicalCaseId,
      );
      if (
        revision &&
        text === materializePatientName(revision.sourcePresentation, patientDisplayName)
      ) {
        return materializePatientName(revision.revisedPresentation, patientDisplayName);
      }
    }
  }
  if (field === "stem" && input.decisionNodeId && input.questionVariantId) {
    const revision = PATIENT_LIBRARY_NODE_STEM_REVISIONS.find(
      (candidate) =>
        candidate.caseId === clinicalCaseId &&
        candidate.nodeId === input.decisionNodeId &&
        candidate.questionVariantId === input.questionVariantId,
    );
    if (
      revision &&
      text === materializePatientName(revision.sourceStem, patientDisplayName)
    ) {
      return materializePatientName(revision.revisedStem, patientDisplayName);
    }
  }
  return normalizeKnownPreAnswerClinicalText(clinicalCaseId, text);
}

/** Display-only compatibility for known frozen pilonidal cases. */
export function normalizeKnownPreAnswerClinicalText(
  clinicalCaseId: string,
  text: string | undefined,
): string | undefined {
  if (!text || !clinicalCaseId.startsWith(PILONIDAL_CASE_PREFIX)) {
    return text;
  }
  return text
    .replace(
      /intermittent natal[- ]cleft drainage and tenderness/gi,
      "intermittent drainage and tenderness in the upper groove between the buttocks near the tailbone",
    )
    .replace(
      /recurrent natal[- ]cleft finding/gi,
      "recurrent drainage near the tailbone",
    )
    .replace(
      /natal[- ]cleft drainage/gi,
      "drainage from the upper groove between the buttocks near the tailbone",
    )
    .replace(/upper natal[- ]cleft/gi, "upper groove between the buttocks near the tailbone")
    .replace(/natal[- ]cleft/gi, "upper groove between the buttocks near the tailbone");
}
