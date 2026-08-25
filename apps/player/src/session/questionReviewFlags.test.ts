import { describe, expect, it } from "vitest";
import {
  createQuestionReviewExport,
  isQuestionFlagOpen,
  loadQuestionReviewFlags,
  parseQuestionReviewFlags,
  questionReviewIdentityKey,
  recordQuestionReviewFlag,
  saveQuestionReviewFlags,
  setQuestionReviewFlagStatus,
  type QuestionReviewFlagInput,
} from "./questionReviewFlags";

function exampleInput(
  overrides: Partial<QuestionReviewFlagInput> = {},
): QuestionReviewFlagInput {
  return {
    campaignId: "campaign.alpha",
    clinicName: "Alpha Clinic",
    clinicalReleaseId: "clinical.release.1",
    clinicalCaseId: "case.abscess.1",
    clinicalCaseDisplayName: "Abscess presentation",
    patientPresentationVariantId: "presentation.abscess.1",
    selectedInstantiationProfileId: "profile.abscess.adult-a",
    decisionNodeId: "decision.abscess.1",
    questionVariantId: "question.abscess.1",
    primaryConceptId: "concept.abscess.management",
    releasePointId: "release.l1.minor-procedure",
    patientDisplayName: "Taylor Morgan",
    patientPresentation: "A patient presents with a tender fluctuant lesion.",
    stem: "What is the best next step?",
    answerChoices: [
      { id: "drain", label: "Incision and drainage", isCorrect: true },
      { id: "observe", label: "Observe without drainage", isCorrect: false },
    ],
    explanation: "Source control is required.",
    sourceLabels: ["Approved prototype source"],
    facilityTick: 42,
    selectedAnswerChoiceId: "drain",
    answerWasCorrect: true,
    ...overrides,
  };
}

describe("question review flags", () => {
  it("uses the frozen release, case, presentation, profile, and question identity", () => {
    const identity = questionReviewIdentityKey(exampleInput());
    expect(identity).toContain("clinical.release.1");
    expect(identity).toContain("presentation.abscess.1");
    expect(identity).toContain("question.abscess.1");
    expect(identity).toContain("What is the best next step?");
  });

  it("keeps a reworded frozen revision as a separate review item", () => {
    const first = recordQuestionReviewFlag([], exampleInput(), 100);
    const second = recordQuestionReviewFlag(
      first.flags,
      exampleInput({
        stem: "Which action is most appropriate now?",
      }),
      200,
    );

    expect(second.created).toBe(true);
    expect(second.flags).toHaveLength(2);
  });

  it("deduplicates a question revision while retaining occurrences and reopening it", () => {
    const first = recordQuestionReviewFlag([], exampleInput(), 100);
    const reviewed = setQuestionReviewFlagStatus(
      first.flags,
      first.flag.id,
      "reviewed",
    );
    const second = recordQuestionReviewFlag(
      reviewed,
      exampleInput({
        campaignId: "campaign.beta",
        clinicName: "Beta Clinic",
        patientDisplayName: "Jordan Lee",
        facilityTick: 90,
        selectedAnswerChoiceId: "observe",
        answerWasCorrect: false,
      }),
      200,
    );

    expect(second.created).toBe(false);
    expect(second.flags).toHaveLength(1);
    expect(second.flag).toMatchObject({
      status: "open",
      occurrenceCount: 2,
      firstFlaggedAtRealMs: 100,
      lastFlaggedAtRealMs: 200,
    });
    expect(second.flag.occurrences).toEqual([
      expect.objectContaining({
        campaignId: "campaign.alpha",
        selectedAnswerChoiceId: "drain",
      }),
      expect.objectContaining({
        campaignId: "campaign.beta",
        selectedAnswerChoiceId: "observe",
      }),
    ]);
    expect(isQuestionFlagOpen(second.flags, exampleInput())).toBe(true);
  });

  it("keeps distinct approved presentation profiles as distinct review items", () => {
    const first = recordQuestionReviewFlag([], exampleInput(), 100);
    const second = recordQuestionReviewFlag(
      first.flags,
      exampleInput({
        selectedInstantiationProfileId: "profile.abscess.adult-b",
      }),
      200,
    );

    expect(second.created).toBe(true);
    expect(second.flags).toHaveLength(2);
  });

  it("round-trips valid local storage and ignores invalid entries", () => {
    const flag = recordQuestionReviewFlag([], exampleInput(), 100).flag;
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => {
        values.set(key, value);
      },
    };

    expect(saveQuestionReviewFlags([flag], storage)).toBe(true);
    expect(loadQuestionReviewFlags(storage)).toEqual([flag]);
    expect(parseQuestionReviewFlags("{broken")).toEqual([]);
    expect(parseQuestionReviewFlags('{"schemaVersion":1,"flags":[{}]}')).toEqual(
      [],
    );
  });

  it("exports open and reviewed flags without changing their snapshots", () => {
    const first = recordQuestionReviewFlag([], exampleInput(), 100).flag;
    const second = recordQuestionReviewFlag(
      [first],
      exampleInput({
        questionVariantId: "question.abscess.2",
        decisionNodeId: "decision.abscess.2",
      }),
      200,
    ).flag;
    const flags = setQuestionReviewFlagStatus(
      [first, second],
      first.id,
      "reviewed",
    );

    expect(createQuestionReviewExport(flags, 1_000)).toMatchObject({
      format: "stitchin-time.question-review-flags",
      schemaVersion: 1,
      exportedAt: "1970-01-01T00:00:01.000Z",
      openCount: 1,
      reviewedCount: 1,
      flags: [
        expect.objectContaining({
          questionVariantId: "question.abscess.2",
        }),
        expect.objectContaining({
          questionVariantId: "question.abscess.1",
        }),
      ],
    });
  });
});
