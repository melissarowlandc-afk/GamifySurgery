import { z } from "zod";

import {
  conceptClassificationSchema,
} from "./concept.js";
import { stableIdSchema } from "./identifiers.js";
import { claimLocatorSchema } from "./source.js";
import {
  aiSuggestionEnvelopeSchema,
  revisionEnvelopeSchema,
} from "./workflow.js";

export const practiceInboxSuggestionSchema = z
  .object({
    envelope: aiSuggestionEnvelopeSchema,
    recommendedTopicId: stableIdSchema.nullable(),
    matchingConceptId: stableIdSchema.nullable(),
    proposedConceptId: stableIdSchema.nullable(),
    proposedLearningObjective: z.string().min(1).max(1_000).nullable(),
    duplicateAssessment: z.enum([
      "unknown",
      "likely_new",
      "possible_overlap",
      "likely_duplicate",
    ]),
    proposedConceptType: z.enum([
      "diagnosis",
      "workup",
      "management",
      "anatomy",
      "complication",
      "disposition",
      "applied_science",
      "synthetic_training",
    ]),
    recommendedClassification: conceptClassificationSchema,
    rationale: z.string().min(1).max(2_000),
  })
  .strict()
  .superRefine((suggestion, context) => {
    if (
      suggestion.matchingConceptId !== null &&
      suggestion.proposedConceptId !== null
    ) {
      context.addIssue({
        code: "custom",
        message:
          "A suggestion may match an existing concept or propose a new one, not both.",
      });
    }
    if (
      suggestion.matchingConceptId === null &&
      suggestion.proposedConceptId === null
    ) {
      context.addIssue({
        code: "custom",
        message:
          "A suggestion must match an existing concept or propose a new one.",
      });
    }
    const proposesNewConcept = suggestion.proposedConceptId !== null;
    if (
      proposesNewConcept !== (suggestion.proposedLearningObjective !== null)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "A proposed concept ID and proposed learning objective must be supplied together.",
        path: ["proposedLearningObjective"],
      });
    }
  });

export const practiceQuestionInboxItemSchema = z
  .object({
    id: stableIdSchema,
    revision: revisionEnvelopeSchema,
    sourceSnapshotId: stableIdSchema,
    sourceLocator: claimLocatorSchema,
    contentOrigin: z.literal("owner_paraphrase"),
    paraphrasedTestedPoint: z.string().min(1).max(2_000),
    paraphrasedAnswerOptions: z.array(z.string().min(1).max(500)),
    correctAnswerSummary: z.string().min(1).max(1_000),
    ownerNotes: z.string().min(1).max(3_000),
    uncertaintyToInvestigate: z.string().min(1).max(2_000).nullable(),
    citationIds: z.array(stableIdSchema).min(1),
    aiSuggestions: z.array(practiceInboxSuggestionSchema),
  })
  .strict()
  .superRefine((item, context) => {
    if (new Set(item.citationIds).size !== item.citationIds.length) {
      context.addIssue({
        code: "custom",
        message: "Practice-inbox citation IDs must be unique.",
        path: ["citationIds"],
      });
    }
    const suggestionIds = item.aiSuggestions.map(
      (suggestion) => suggestion.envelope.suggestionId,
    );
    if (new Set(suggestionIds).size !== suggestionIds.length) {
      context.addIssue({
        code: "custom",
        message: "AI suggestion IDs must be unique within an inbox item.",
        path: ["aiSuggestions"],
      });
    }
  });

export type PracticeInboxSuggestion = z.infer<
  typeof practiceInboxSuggestionSchema
>;
export type PracticeQuestionInboxItem = z.infer<
  typeof practiceQuestionInboxItemSchema
>;
