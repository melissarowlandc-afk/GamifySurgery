import { z } from "zod";

import { stableIdSchema } from "./identifiers.js";
import { revisionEnvelopeSchema } from "./workflow.js";

export const clinicalTopicTypeSchema = z.enum([
  "diagnosis",
  "procedure",
  "complication",
  "anatomy",
  "screening",
  "resuscitation",
  "general_principle",
  "synthetic_training_topic",
]);

export const clinicalTopicSchema = z
  .object({
    id: stableIdSchema,
    preferredName: z.string().min(1).max(240),
    topicType: clinicalTopicTypeSchema,
    aliases: z.array(z.string().min(1).max(240)),
    currentWorkingRevisionId: stableIdSchema.nullable(),
  })
  .strict()
  .superRefine((topic, context) => {
    if (new Set(topic.aliases).size !== topic.aliases.length) {
      context.addIssue({
        code: "custom",
        message: "Clinical Topic aliases must be unique.",
        path: ["aliases"],
      });
    }
    if (topic.aliases.includes(topic.preferredName)) {
      context.addIssue({
        code: "custom",
        message: "The preferred name must not be repeated as an alias.",
        path: ["aliases"],
      });
    }
  });

export const topicSectionTypeSchema = z.enum([
  "definition",
  "pathophysiology",
  "epidemiology",
  "age_and_demographics",
  "risk_factors",
  "typical_presentation",
  "atypical_presentation",
  "history_and_physical",
  "diagnostic_evaluation",
  "management",
  "complications",
  "differential_diagnosis",
  "prognosis",
  "pearls_and_pitfalls",
  "notes",
]);

export const topicSectionSchema = z
  .object({
    id: stableIdSchema,
    sectionType: topicSectionTypeSchema,
    narrative: z.string().min(1).max(20_000),
    citationIds: z.array(stableIdSchema),
  })
  .strict();

export const clinicalTopicRevisionSchema = z
  .object({
    topicId: stableIdSchema,
    revision: revisionEnvelopeSchema,
    sections: z.array(topicSectionSchema),
  })
  .strict()
  .superRefine((topicRevision, context) => {
    const sectionTypes = new Set<string>();
    topicRevision.sections.forEach((section, index) => {
      if (new Set(section.citationIds).size !== section.citationIds.length) {
        context.addIssue({
          code: "custom",
          message: "Topic-section citation IDs must be unique.",
          path: ["sections", index, "citationIds"],
        });
      }
      if (sectionTypes.has(section.sectionType)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate topic section: ${section.sectionType}`,
          path: ["sections", index, "sectionType"],
        });
      }
      sectionTypes.add(section.sectionType);
    });
  });

export const structuredFactValueSchema = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("text"),
      value: z.string().min(1).max(2_000),
    })
    .strict(),
  z
    .object({
      kind: z.literal("category"),
      value: stableIdSchema,
      displayLabel: z.string().min(1).max(240),
    })
    .strict(),
  z
    .object({
      kind: z.literal("number"),
      value: z.number().finite(),
      unit: z.string().min(1).max(80).nullable(),
      precision: z.number().int().min(0).max(8),
    })
    .strict(),
  z
    .object({
      kind: z.literal("range"),
      minimum: z.number().finite(),
      maximum: z.number().finite(),
      unit: z.string().min(1).max(80).nullable(),
      inclusiveMinimum: z.boolean(),
      inclusiveMaximum: z.boolean(),
    })
    .strict()
    .refine((range) => range.minimum <= range.maximum, {
      message: "A structured range minimum cannot exceed its maximum.",
      path: ["maximum"],
    }),
  z
    .object({
      kind: z.literal("distribution"),
      distributionTypeId: stableIdSchema,
      description: z.string().min(1).max(2_000),
      parameters: z.record(
        stableIdSchema,
        z.union([z.string().min(1).max(500), z.number().finite(), z.boolean()]),
      ),
    })
    .strict()
    .refine((distribution) => Object.keys(distribution.parameters).length > 0, {
      message: "A distribution must record at least one structured parameter.",
      path: ["parameters"],
    }),
]);

export const factConflictSchema = z
  .object({
    state: z.enum(["none", "unresolved"]),
    conflictGroupId: stableIdSchema.nullable(),
  })
  .strict()
  .superRefine((conflict, context) => {
    if (conflict.state === "none") {
      if (conflict.conflictGroupId !== null) {
        context.addIssue({
          code: "custom",
          message: "A fact without a conflict cannot carry a conflict group.",
        });
      }
      return;
    }

    if (conflict.conflictGroupId === null) {
      context.addIssue({
        code: "custom",
        message: "A conflicting fact must identify its conflict group.",
        path: ["conflictGroupId"],
      });
    }

  });

export const structuredClinicalFactSchema = z
  .object({
    id: stableIdSchema,
    topicRevisionId: stableIdSchema,
    revision: revisionEnvelopeSchema,
    factTypeId: stableIdSchema,
    value: structuredFactValueSchema,
    population: z.string().min(1).max(1_000),
    clinicalContext: z.string().min(1).max(1_000),
    applicability: z.string().min(1).max(1_000),
    exceptions: z.array(z.string().min(1).max(1_000)),
    scenarioUseStatus: z.enum([
      "descriptive_only",
      "scenario_candidate",
      "scenario_approved",
    ]),
    conflict: factConflictSchema,
    citationIds: z.array(stableIdSchema).min(1),
  })
  .strict()
  .superRefine((fact, context) => {
    if (new Set(fact.citationIds).size !== fact.citationIds.length) {
      context.addIssue({
        code: "custom",
        message: "Structured-fact citation IDs must be unique.",
        path: ["citationIds"],
      });
    }
    if (
      fact.conflict.state === "unresolved" &&
      fact.scenarioUseStatus !== "descriptive_only"
    ) {
      context.addIssue({
        code: "custom",
        message:
          "An unresolved fact must remain descriptive and cannot drive a scenario.",
        path: ["scenarioUseStatus"],
      });
    }
    if (
      fact.conflict.state === "unresolved" &&
      fact.revision.workflowState === "clinically_approved"
    ) {
      context.addIssue({
        code: "custom",
        message:
          "A fact with an unresolved source conflict cannot be clinically approved.",
        path: ["revision", "workflowState"],
      });
    }
    if (
      fact.scenarioUseStatus === "scenario_approved" &&
      fact.revision.clinicalApproval === null
    ) {
      context.addIssue({
        code: "custom",
        message:
          "A fact cannot drive approved scenario generation before clinical approval.",
        path: ["scenarioUseStatus"],
      });
    }
  });

export type ClinicalTopic = z.infer<typeof clinicalTopicSchema>;
export type ClinicalTopicRevision = z.infer<
  typeof clinicalTopicRevisionSchema
>;
export type StructuredClinicalFact = z.infer<
  typeof structuredClinicalFactSchema
>;
