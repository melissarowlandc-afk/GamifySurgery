const QUESTION_REVIEW_FLAGS_STORAGE_KEY =
  "gamify-surgery.question-review-flags.v1";
const QUESTION_REVIEW_FLAGS_SCHEMA_VERSION = 1 as const;
const MAX_OCCURRENCES_PER_FLAG = 20;

export type QuestionReviewFlagStatus = "open" | "reviewed";

export interface QuestionReviewAnswerSnapshot {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface QuestionReviewOccurrence {
  campaignId: string;
  clinicName: string;
  patientDisplayName: string;
  facilityTick: number;
  selectedAnswerChoiceId: string | null;
  answerWasCorrect: boolean | null;
  flaggedAtRealMs: number;
}

export interface QuestionReviewFlagInput {
  campaignId: string;
  clinicName: string;
  clinicalReleaseId: string;
  clinicalCaseId: string;
  clinicalCaseDisplayName: string;
  patientPresentationVariantId: string;
  selectedInstantiationProfileId: string | null;
  decisionNodeId: string;
  questionVariantId: string;
  primaryConceptId: string;
  releasePointId: string | null;
  patientDisplayName: string;
  patientPresentation: string;
  stem: string;
  answerChoices: QuestionReviewAnswerSnapshot[];
  explanation: string;
  sourceLabels: string[];
  facilityTick: number;
  selectedAnswerChoiceId: string | null;
  answerWasCorrect: boolean | null;
}

export interface QuestionReviewFlag
  extends Omit<
    QuestionReviewFlagInput,
    | "campaignId"
    | "clinicName"
    | "patientDisplayName"
    | "facilityTick"
    | "selectedAnswerChoiceId"
    | "answerWasCorrect"
  > {
  schemaVersion: typeof QUESTION_REVIEW_FLAGS_SCHEMA_VERSION;
  id: string;
  identityKey: string;
  status: QuestionReviewFlagStatus;
  firstFlaggedAtRealMs: number;
  lastFlaggedAtRealMs: number;
  occurrenceCount: number;
  occurrences: QuestionReviewOccurrence[];
}

interface QuestionReviewFlagEnvelope {
  schemaVersion: typeof QUESTION_REVIEW_FLAGS_SCHEMA_VERSION;
  flags: QuestionReviewFlag[];
}

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function browserStorage(): StorageLike | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((entry) => typeof entry === "string")
  );
}

function isAnswerSnapshots(
  value: unknown,
): value is QuestionReviewAnswerSnapshot[] {
  return (
    Array.isArray(value) &&
    value.every(
      (entry) =>
        isRecord(entry) &&
        typeof entry.id === "string" &&
        typeof entry.label === "string" &&
        typeof entry.isCorrect === "boolean",
    )
  );
}

function isOccurrences(value: unknown): value is QuestionReviewOccurrence[] {
  return (
    Array.isArray(value) &&
    value.every(
      (entry) =>
        isRecord(entry) &&
        typeof entry.campaignId === "string" &&
        typeof entry.clinicName === "string" &&
        typeof entry.patientDisplayName === "string" &&
        typeof entry.facilityTick === "number" &&
        (entry.selectedAnswerChoiceId === null ||
          typeof entry.selectedAnswerChoiceId === "string") &&
        (entry.answerWasCorrect === null ||
          typeof entry.answerWasCorrect === "boolean") &&
        typeof entry.flaggedAtRealMs === "number",
    )
  );
}

function isQuestionReviewFlag(value: unknown): value is QuestionReviewFlag {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.schemaVersion === QUESTION_REVIEW_FLAGS_SCHEMA_VERSION &&
    typeof value.id === "string" &&
    typeof value.identityKey === "string" &&
    (value.status === "open" || value.status === "reviewed") &&
    typeof value.firstFlaggedAtRealMs === "number" &&
    typeof value.lastFlaggedAtRealMs === "number" &&
    typeof value.occurrenceCount === "number" &&
    typeof value.clinicalReleaseId === "string" &&
    typeof value.clinicalCaseId === "string" &&
    typeof value.clinicalCaseDisplayName === "string" &&
    typeof value.patientPresentationVariantId === "string" &&
    (value.selectedInstantiationProfileId === null ||
      typeof value.selectedInstantiationProfileId === "string") &&
    typeof value.decisionNodeId === "string" &&
    typeof value.questionVariantId === "string" &&
    typeof value.primaryConceptId === "string" &&
    (value.releasePointId === null ||
      typeof value.releasePointId === "string") &&
    typeof value.patientPresentation === "string" &&
    typeof value.stem === "string" &&
    isAnswerSnapshots(value.answerChoices) &&
    typeof value.explanation === "string" &&
    isStringArray(value.sourceLabels) &&
    isOccurrences(value.occurrences)
  );
}

export function questionReviewIdentityKey(
  value: Pick<
    QuestionReviewFlagInput,
    | "clinicalReleaseId"
    | "clinicalCaseId"
    | "patientPresentationVariantId"
    | "selectedInstantiationProfileId"
    | "questionVariantId"
    | "patientPresentation"
    | "stem"
    | "answerChoices"
    | "explanation"
  >,
): string {
  const canonicalAnswers = [...value.answerChoices]
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((choice) => [choice.id, choice.label, choice.isCorrect]);
  return JSON.stringify([
    value.clinicalReleaseId,
    value.clinicalCaseId,
    value.patientPresentationVariantId,
    value.selectedInstantiationProfileId ?? "base",
    value.questionVariantId,
    value.patientPresentation,
    value.stem,
    canonicalAnswers,
    value.explanation,
  ]);
}

function occurrenceFromInput(
  input: QuestionReviewFlagInput,
  flaggedAtRealMs: number,
): QuestionReviewOccurrence {
  return {
    campaignId: input.campaignId,
    clinicName: input.clinicName,
    patientDisplayName: input.patientDisplayName,
    facilityTick: input.facilityTick,
    selectedAnswerChoiceId: input.selectedAnswerChoiceId,
    answerWasCorrect: input.answerWasCorrect,
    flaggedAtRealMs,
  };
}

export function recordQuestionReviewFlag(
  current: readonly QuestionReviewFlag[],
  input: QuestionReviewFlagInput,
  flaggedAtRealMs = Date.now(),
): {
  flags: QuestionReviewFlag[];
  flag: QuestionReviewFlag;
  created: boolean;
} {
  const identityKey = questionReviewIdentityKey(input);
  const occurrence = occurrenceFromInput(input, flaggedAtRealMs);
  const existingIndex = current.findIndex(
    (flag) => flag.identityKey === identityKey,
  );

  if (existingIndex >= 0) {
    const existing = current[existingIndex]!;
    const updated: QuestionReviewFlag = {
      ...existing,
      // Keep the latest frozen display snapshot when a revision is encountered
      // again while retaining bounded occurrence history.
      clinicalCaseDisplayName: input.clinicalCaseDisplayName,
      decisionNodeId: input.decisionNodeId,
      primaryConceptId: input.primaryConceptId,
      releasePointId: input.releasePointId,
      patientPresentation: input.patientPresentation,
      stem: input.stem,
      answerChoices: input.answerChoices.map((choice) => ({ ...choice })),
      explanation: input.explanation,
      sourceLabels: [...input.sourceLabels],
      status: "open",
      lastFlaggedAtRealMs: flaggedAtRealMs,
      occurrenceCount: existing.occurrenceCount + 1,
      occurrences: [...existing.occurrences, occurrence].slice(
        -MAX_OCCURRENCES_PER_FLAG,
      ),
    };
    const flags = [...current];
    flags[existingIndex] = updated;
    return { flags, flag: updated, created: false };
  }

  const createdFlag: QuestionReviewFlag = {
    schemaVersion: QUESTION_REVIEW_FLAGS_SCHEMA_VERSION,
    id: `question-review.${flaggedAtRealMs.toString(36)}.${
      current.length + 1
    }`,
    identityKey,
    status: "open",
    firstFlaggedAtRealMs: flaggedAtRealMs,
    lastFlaggedAtRealMs: flaggedAtRealMs,
    occurrenceCount: 1,
    clinicalReleaseId: input.clinicalReleaseId,
    clinicalCaseId: input.clinicalCaseId,
    clinicalCaseDisplayName: input.clinicalCaseDisplayName,
    patientPresentationVariantId: input.patientPresentationVariantId,
    selectedInstantiationProfileId: input.selectedInstantiationProfileId,
    decisionNodeId: input.decisionNodeId,
    questionVariantId: input.questionVariantId,
    primaryConceptId: input.primaryConceptId,
    releasePointId: input.releasePointId,
    patientPresentation: input.patientPresentation,
    stem: input.stem,
    answerChoices: input.answerChoices.map((choice) => ({ ...choice })),
    explanation: input.explanation,
    sourceLabels: [...input.sourceLabels],
    occurrences: [occurrence],
  };

  return {
    flags: [...current, createdFlag],
    flag: createdFlag,
    created: true,
  };
}

export function setQuestionReviewFlagStatus(
  current: readonly QuestionReviewFlag[],
  flagId: string,
  status: QuestionReviewFlagStatus,
): QuestionReviewFlag[] {
  return current.map((flag) =>
    flag.id === flagId ? { ...flag, status } : flag,
  );
}

export function isQuestionFlagOpen(
  flags: readonly QuestionReviewFlag[],
  identity: Parameters<typeof questionReviewIdentityKey>[0],
): boolean {
  const identityKey = questionReviewIdentityKey(identity);
  return flags.some(
    (flag) => flag.identityKey === identityKey && flag.status === "open",
  );
}

export function parseQuestionReviewFlags(
  serialized: string | null,
): QuestionReviewFlag[] {
  if (!serialized) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(serialized);
    if (
      !isRecord(parsed) ||
      parsed.schemaVersion !== QUESTION_REVIEW_FLAGS_SCHEMA_VERSION ||
      !Array.isArray(parsed.flags)
    ) {
      return [];
    }
    return parsed.flags
      .filter(isQuestionReviewFlag)
      .map((flag) => ({
        ...flag,
        // Recompute so records from an earlier schema implementation gain
        // exact frozen-wording identity without discarding their history.
        identityKey: questionReviewIdentityKey(flag),
      }));
  } catch {
    return [];
  }
}

export function loadQuestionReviewFlags(
  storage: StorageLike | null = browserStorage(),
): QuestionReviewFlag[] {
  if (!storage) {
    return [];
  }
  try {
    return parseQuestionReviewFlags(
      storage.getItem(QUESTION_REVIEW_FLAGS_STORAGE_KEY),
    );
  } catch {
    return [];
  }
}

export function saveQuestionReviewFlags(
  flags: readonly QuestionReviewFlag[],
  storage: StorageLike | null = browserStorage(),
): boolean {
  if (!storage) {
    return false;
  }

  const envelope: QuestionReviewFlagEnvelope = {
    schemaVersion: QUESTION_REVIEW_FLAGS_SCHEMA_VERSION,
    flags: [...flags],
  };
  try {
    storage.setItem(
      QUESTION_REVIEW_FLAGS_STORAGE_KEY,
      JSON.stringify(envelope),
    );
    return true;
  } catch {
    return false;
  }
}

export function createQuestionReviewExport(
  flags: readonly QuestionReviewFlag[],
  exportedAtRealMs = Date.now(),
) {
  return {
    format: "stitchin-time.question-review-flags",
    schemaVersion: QUESTION_REVIEW_FLAGS_SCHEMA_VERSION,
    exportedAt: new Date(exportedAtRealMs).toISOString(),
    openCount: flags.filter((flag) => flag.status === "open").length,
    reviewedCount: flags.filter((flag) => flag.status === "reviewed").length,
    flags: [...flags].sort(
      (left, right) => right.lastFlaggedAtRealMs - left.lastFlaggedAtRealMs,
    ),
  };
}

export {
  QUESTION_REVIEW_FLAGS_SCHEMA_VERSION,
  QUESTION_REVIEW_FLAGS_STORAGE_KEY,
};
