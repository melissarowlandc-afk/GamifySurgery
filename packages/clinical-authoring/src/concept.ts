import { z } from "zod";

import { stableIdSchema } from "./identifiers.js";
import { revisionEnvelopeSchema } from "./workflow.js";

export const currentGameEligibilitySchema = z.enum([
  "unclassified",
  "eligible",
  "deferred",
  "excluded",
]);

export const deferredScopeSchema = z
  .object({
    targetScopeId: stableIdSchema,
    reason: z.string().min(1).max(1_000),
  })
  .strict();

export const conceptClassificationSchema = z
  .object({
    educationalDifficultyId: stableIdSchema,
    earliestFacilityStageId: stableIdSchema,
    requiredClinicalSettingIds: z.array(stableIdSchema).min(1),
    currentGameEligibility: currentGameEligibilitySchema,
    deferredScope: deferredScopeSchema.nullable(),
  })
  .strict()
  .superRefine((classification, context) => {
    if (
      new Set(classification.requiredClinicalSettingIds).size !==
      classification.requiredClinicalSettingIds.length
    ) {
      context.addIssue({
        code: "custom",
        message: "Required clinical-setting IDs must be unique.",
        path: ["requiredClinicalSettingIds"],
      });
    }

    const requiresDeferredScope =
      classification.currentGameEligibility === "deferred" ||
      classification.currentGameEligibility === "excluded";
    if (requiresDeferredScope !== (classification.deferredScope !== null)) {
      context.addIssue({
        code: "custom",
        message:
          "Unclassified or eligible concepts have no deferred scope; deferred or excluded concepts must explain their future scope.",
        path: ["deferredScope"],
      });
    }
  });

export const testedConceptSchema = z
  .object({
    id: stableIdSchema,
    revision: revisionEnvelopeSchema,
    displayName: z.string().min(1).max(240),
    learningObjective: z.string().min(1).max(1_000),
    primaryTopicId: stableIdSchema,
    relatedTopicIds: z.array(stableIdSchema),
    conceptType: z.enum([
      "diagnosis",
      "workup",
      "management",
      "anatomy",
      "complication",
      "disposition",
      "applied_science",
      "synthetic_training",
    ]),
    classification: conceptClassificationSchema,
    citationIds: z.array(stableIdSchema).min(1),
  })
  .strict()
  .superRefine((concept, context) => {
    if (new Set(concept.citationIds).size !== concept.citationIds.length) {
      context.addIssue({
        code: "custom",
        message: "Tested-Concept citation IDs must be unique.",
        path: ["citationIds"],
      });
    }

    if (concept.relatedTopicIds.includes(concept.primaryTopicId)) {
      context.addIssue({
        code: "custom",
        message:
          "The primary topic must not be duplicated among related topics.",
        path: ["relatedTopicIds"],
      });
    }

    if (new Set(concept.relatedTopicIds).size !== concept.relatedTopicIds.length) {
      context.addIssue({
        code: "custom",
        message: "Related topic IDs must be unique.",
        path: ["relatedTopicIds"],
      });
    }
  });

export type ConceptClassification = z.infer<
  typeof conceptClassificationSchema
>;
export type TestedConcept = z.infer<typeof testedConceptSchema>;
