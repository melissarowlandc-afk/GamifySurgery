import { z } from "zod";

const stableIdSchema = z
  .string()
  .min(3)
  .max(120)
  .regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/, "Use a stable lowercase identifier.");

export const answerChoiceSchema = z
  .object({
    id: stableIdSchema,
    label: z.string().min(1).max(240),
    isCorrect: z.boolean(),
    /**
     * Optional operational preview for a choice that requests a timed service.
     *
     * Clinical content identifies the service, while the pinned balance
     * release owns routes and durations. The runtime still corrects a wrong
     * nonfinal answer forward to the node's approved result gate.
     */
    serviceRequest: z
      .object({
        serviceId: stableIdSchema,
      })
      .strict()
      .nullable()
      .default(null),
  })
  .strict();

export const terminalClinicalOutcomeSchema = z
  .object({
    id: stableIdSchema,
    severity: z.enum(["minor", "major"]),
    narrative: z.string().min(1).max(1_000),
    causalFraming: z.enum(["possible_consequence", "expected_consequence"]),
    clinicalRationale: z.string().min(1).max(1_000),
    sourceLabels: z.array(z.string().min(1).max(240)).min(1),
  })
  .strict();

export const terminalOutcomeDispositionSchema = z.discriminatedUnion("kind", [
  z
    .object({
      answerChoiceId: stableIdSchema,
      kind: z.literal("no_terminal_outcome"),
      consequenceNarrative: z.string().min(1).max(1_000),
      clinicalRationale: z.string().min(1).max(1_000),
      sourceLabels: z.array(z.string().min(1).max(240)).min(1),
    })
    .strict(),
  z
    .object({
      answerChoiceId: stableIdSchema,
      kind: z.literal("terminal_outcome"),
      outcome: terminalClinicalOutcomeSchema,
    })
    .strict(),
]);

export const resultGateSchema = z
  .object({
    id: stableIdSchema,
    resultTypeId: stableIdSchema,
    pendingLabel: z.string().min(1).max(240),
    resultNarrative: z.string().min(1).max(1_000),
    readiness: z.literal("all"),
    allowedServiceRouteIds: z.array(stableIdSchema).min(1),
  })
  .strict();

export const decisionNodeSchema = z
  .object({
    id: stableIdSchema,
    questionVariantId: stableIdSchema,
    primaryConceptId: stableIdSchema,
    /**
     * Exact approved context revealed after an earlier decision.  It is
     * deliberately separate from the scored stem so the chart can render a
     * current update without rewriting an approved question.
     */
    currentUpdate: z.string().min(1).max(2_000).optional(),
    stem: z.string().min(1).max(2_000),
    answerChoices: z.array(answerChoiceSchema).min(2).max(8),
    shuffleAnswers: z.boolean(),
    explanation: z.string().min(1).max(2_000),
    sourceLabels: z.array(z.string().min(1).max(240)).min(1),
    resultGateAfter: resultGateSchema.nullable(),
    terminalDispositions: z.array(terminalOutcomeDispositionSchema),
  })
  .strict()
  .superRefine((node, context) => {
    const choiceIds = new Set<string>();
    for (const choice of node.answerChoices) {
      if (choiceIds.has(choice.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate answer choice ID: ${choice.id}`,
          path: ["answerChoices"],
        });
      }
      choiceIds.add(choice.id);
    }

    const correctCount = node.answerChoices.filter((choice) => choice.isCorrect).length;
    if (correctCount !== 1) {
      context.addIssue({
        code: "custom",
        message: "Every scored node must have exactly one correct answer.",
        path: ["answerChoices"],
      });
    }

    if (node.resultGateAfter !== null) {
      const correctChoice = node.answerChoices.find(
        (choice) => choice.isCorrect,
      );
      if (
        correctChoice?.serviceRequest?.serviceId !==
        node.resultGateAfter.resultTypeId
      ) {
        context.addIssue({
          code: "custom",
          message:
            "The correct choice for a timed result gate must request that gate's service.",
          path: ["answerChoices"],
        });
      }
    }
  });

export const testedConceptSchema = z
  .object({
    id: stableIdSchema,
    displayName: z.string().min(1).max(160),
    learningObjective: z.string().min(1).max(500),
    earliestFacilityStage: z.number().int().min(0).max(5),
    conceptType: z.enum([
      "diagnosis",
      "workup",
      "management",
      "anatomy",
      "disposition",
      "complication",
      "applied_science",
    ]),
  })
  .strict();

/**
 * One complete, clinician-reviewed presentation profile that may be selected
 * when a runtime encounter is frozen.
 *
 * These are deliberately whole profiles rather than independently randomized
 * clinical fields. The runtime may choose among them, but it cannot invent or
 * recombine their clinical facts.
 */
export const approvedInstantiationProfileSchema = z
  .object({
    id: stableIdSchema,
    prototypeDemographics: z
      .object({
        ageYears: z.number().int().min(0).max(120),
        sexLabel: z.enum(["Female", "Male", "Not specified"]),
      })
      .strict()
      .optional(),
    prototypeVitalSigns: z
      .object({
        heartRateBpm: z.number().int().min(20).max(240),
        systolicBloodPressureMmHg: z.number().int().min(40).max(280),
        diastolicBloodPressureMmHg: z.number().int().min(20).max(180),
        temperatureF: z.number().min(85).max(110),
        oxygenSaturationPercent: z.number().int().min(50).max(100),
      })
      .strict()
      .optional(),
    chiefComplaint: z.string().min(1).max(160).optional(),
    presentation: z.string().min(1).max(2_000),
  })
  .strict();

/**
 * A presentation-only revision is deliberately independent from the approved
 * question content. It records wording that must not inherit approval merely
 * because the frozen case and presentation IDs remain stable.
 */
export const patientPresentationRevisionSchema = z
  .object({
    id: stableIdSchema,
    patientPresentationVariantId: stableIdSchema,
    contentVersion: z.string().regex(/^presentation-revision\.[a-z0-9._-]+$/),
    revisedChiefComplaint: z.string().min(1).max(160).optional(),
    revisedPresentation: z.string().min(1).max(2_000).optional(),
    revisedFields: z
      .array(z.enum(["chiefComplaint", "presentation"]))
      .max(2),
    revisedProfilePresentations: z
      .array(
        z
          .object({
            id: stableIdSchema,
            approvedInstantiationProfileId: stableIdSchema,
            contentVersion: z.string().regex(/^presentation-revision\.[a-z0-9._-]+$/),
            revisedPresentation: z.string().min(1).max(2_000),
            revisedFields: z.tuple([z.literal("presentation")]),
            aiAssistedDrafting: z.literal(true),
            reviewStatus: z.literal("needs_clinician_review"),
            lastClinicianReview: z.null(),
          })
          .strict(),
      )
      .optional(),
    aiAssistedDrafting: z.literal(true),
    reviewStatus: z.literal("needs_clinician_review"),
    lastClinicianReview: z.null(),
  })
  .strict();

export const syntheticClinicalCaseSchema = z
  .object({
    id: stableIdSchema,
    displayName: z.string().min(1).max(160),
    patientPresentationVariantId: stableIdSchema,
    /**
     * Semantic content-admission point. Older frozen prototype cases may omit
     * this field and continue to rely on their numeric facility-stage gate.
     */
    releasePointId: stableIdSchema.optional(),
    patientDisplayName: z.string().min(1).max(80),
    prototypeDemographics: z
      .object({
        ageYears: z.number().int().min(0).max(120),
        sexLabel: z.enum(["Female", "Male", "Not specified"]),
      })
      .strict()
      .optional(),
    prototypeVitalSigns: z
      .object({
        heartRateBpm: z.number().int().min(20).max(240),
        systolicBloodPressureMmHg: z.number().int().min(40).max(280),
        diastolicBloodPressureMmHg: z.number().int().min(20).max(180),
        temperatureF: z.number().min(85).max(110),
        oxygenSaturationPercent: z.number().int().min(50).max(100),
      })
      .strict()
      .optional(),
    chiefComplaint: z.string().min(1).max(160).optional(),
    patientPresentationRevision: patientPresentationRevisionSchema.optional(),
    presentation: z.string().min(1).max(2_000),
    /**
     * Finite, exact alternatives approved with this case revision.
     *
     * A selected profile overrides only the corresponding display fields and
     * is then frozen with the encounter. Question semantics, answer mapping,
     * and all other clinical content remain unchanged.
     */
    approvedInstantiationProfiles: z
      .array(approvedInstantiationProfileSchema)
      .min(1)
      .max(20)
      .optional(),
    /**
     * Written only on the frozen runtime copy. Authoring records omit it.
     */
    selectedInstantiationProfileId: stableIdSchema.optional(),
    tutorialEligible: z.boolean(),
    routineEligible: z.boolean(),
    earliestFacilityStage: z.number().int().min(0).max(2),
    requiredClinicalSetting: z.enum([
      "clinic",
      "ambulatory_surgery",
      "outpatient_endoscopy",
      "endoscopy",
      "periop_recovery",
    ]),
    requiredCapabilityIds: z.array(stableIdSchema).default([]),
    rewardTierId: stableIdSchema,
    sourceLabels: z.array(z.string().min(1).max(240)).min(1),
    decisionNodes: z.array(decisionNodeSchema).min(1).max(4),
    learningSummary: z.string().min(1).max(3_000),
  })
  .strict()
  .superRefine((clinicalCase, context) => {
    if (
      clinicalCase.decisionNodes.length === 4 &&
      clinicalCase.earliestFacilityStage < 3
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Four-decision encounters are reserved for rare Level 3-or-later content.",
        path: ["decisionNodes"],
      });
    }

    if (clinicalCase.patientPresentationRevision) {
      const revision = clinicalCase.patientPresentationRevision;
      if (revision.patientPresentationVariantId !== clinicalCase.patientPresentationVariantId) {
        context.addIssue({
          code: "custom",
          message: "A presentation revision must bind to the case presentation variant.",
          path: ["patientPresentationRevision", "patientPresentationVariantId"],
        });
      }
      const expectedRevisedFields = [
        ...(revision.revisedChiefComplaint ? ["chiefComplaint" as const] : []),
        ...(revision.revisedPresentation ? ["presentation" as const] : []),
      ];
      if (
        expectedRevisedFields.length === 0 &&
        !revision.revisedProfilePresentations?.length
      ) {
        context.addIssue({
          code: "custom",
          message: "A presentation revision must revise a case field or an instantiation profile.",
          path: ["patientPresentationRevision"],
        });
      }
      if (
        revision.revisedFields.length !== expectedRevisedFields.length ||
        revision.revisedFields.some(
          (field, index) => field !== expectedRevisedFields[index],
        )
      ) {
        context.addIssue({
          code: "custom",
          message: "Presentation revision fields must exactly name its revised case fields.",
          path: ["patientPresentationRevision", "revisedFields"],
        });
      }
      if (revision.revisedChiefComplaint && !clinicalCase.chiefComplaint) {
        context.addIssue({
          code: "custom",
          message: "A chief-complaint revision requires a chief complaint.",
          path: ["patientPresentationRevision"],
        });
      }
      if (
        revision.revisedChiefComplaint &&
        revision.revisedChiefComplaint !== clinicalCase.chiefComplaint
      ) {
        context.addIssue({
          code: "custom",
          message: "A presentation revision must bind to the exact revised chief complaint.",
          path: ["patientPresentationRevision", "revisedChiefComplaint"],
        });
      }
      if (
        revision.revisedPresentation &&
        revision.revisedPresentation !== clinicalCase.presentation
      ) {
        context.addIssue({
          code: "custom",
          message: "A presentation revision must bind to the exact revised presentation.",
          path: ["patientPresentationRevision", "revisedPresentation"],
        });
      }
      const profileRevisionRecordIds = new Set<string>();
      const profileRevisionProfileIds = new Set<string>();
      for (const [index, profileRevision] of (
        revision.revisedProfilePresentations ?? []
      ).entries()) {
        if (profileRevisionRecordIds.has(profileRevision.id)) {
          context.addIssue({
            code: "custom",
            message: "Duplicate instantiation-profile presentation revision record ID.",
            path: ["patientPresentationRevision", "revisedProfilePresentations", index, "id"],
          });
        }
        profileRevisionRecordIds.add(profileRevision.id);
        if (profileRevisionProfileIds.has(profileRevision.approvedInstantiationProfileId)) {
          context.addIssue({
            code: "custom",
            message: "Duplicate instantiation-profile presentation revision.",
            path: ["patientPresentationRevision", "revisedProfilePresentations", index],
          });
        }
        profileRevisionProfileIds.add(profileRevision.approvedInstantiationProfileId);
        if (profileRevision.contentVersion !== revision.contentVersion) {
          context.addIssue({
            code: "custom",
            message: "A profile presentation revision must use its parent content version.",
            path: ["patientPresentationRevision", "revisedProfilePresentations", index, "contentVersion"],
          });
        }
        const profile = clinicalCase.approvedInstantiationProfiles?.find(
          (candidate) => candidate.id === profileRevision.approvedInstantiationProfileId,
        );
        if (!profile) {
          context.addIssue({
            code: "custom",
            message: "A profile presentation revision must bind to an approved instantiation profile.",
            path: ["patientPresentationRevision", "revisedProfilePresentations", index, "approvedInstantiationProfileId"],
          });
        } else if (profile.presentation !== profileRevision.revisedPresentation) {
          context.addIssue({
            code: "custom",
            message: "A profile presentation revision must bind to the exact revised profile presentation.",
            path: ["patientPresentationRevision", "revisedProfilePresentations", index, "revisedPresentation"],
          });
        }
      }
    }
    const nodeIds = new Set<string>();
    const conceptIds = new Set<string>();
    const profileIds = new Set<string>();

    clinicalCase.approvedInstantiationProfiles?.forEach((profile, index) => {
      if (profileIds.has(profile.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate approved instantiation profile ID: ${profile.id}`,
          path: ["approvedInstantiationProfiles", index, "id"],
        });
      }
      profileIds.add(profile.id);
    });

    if (
      clinicalCase.selectedInstantiationProfileId &&
      !profileIds.has(clinicalCase.selectedInstantiationProfileId)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "A selected runtime instantiation profile must belong to the frozen case.",
        path: ["selectedInstantiationProfileId"],
      });
    }

    clinicalCase.decisionNodes.forEach((node, index) => {
      if (nodeIds.has(node.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate decision node ID: ${node.id}`,
          path: ["decisionNodes", index, "id"],
        });
      }
      nodeIds.add(node.id);

      if (conceptIds.has(node.primaryConceptId)) {
        context.addIssue({
          code: "custom",
          message: "The same concept cannot be scored twice in one encounter.",
          path: ["decisionNodes", index, "primaryConceptId"],
        });
      }
      conceptIds.add(node.primaryConceptId);

      const isFinalNode = index === clinicalCase.decisionNodes.length - 1;
      if (!isFinalNode && node.terminalDispositions.length > 0) {
        context.addIssue({
          code: "custom",
          message: "Only the final scored node may define terminal outcomes.",
          path: ["decisionNodes", index, "terminalDispositions"],
        });
      }
      if (isFinalNode && node.resultGateAfter !== null) {
        context.addIssue({
          code: "custom",
          message: "The final scored node cannot schedule another result gate.",
          path: ["decisionNodes", index, "resultGateAfter"],
        });
      }

      if (isFinalNode) {
        const incorrectChoiceIds = new Set(
          node.answerChoices
            .filter((choice) => !choice.isCorrect)
            .map((choice) => choice.id),
        );
        const dispositionIds = node.terminalDispositions.map(
          (disposition) => disposition.answerChoiceId,
        );
        const uniqueDispositionIds = new Set(dispositionIds);

        if (uniqueDispositionIds.size !== dispositionIds.length) {
          context.addIssue({
            code: "custom",
            message: "Each wrong final answer may have only one disposition.",
            path: ["decisionNodes", index, "terminalDispositions"],
          });
        }
        if (
          dispositionIds.length !== incorrectChoiceIds.size ||
          dispositionIds.some((id) => !incorrectChoiceIds.has(id))
        ) {
          context.addIssue({
            code: "custom",
            message:
              "Every wrong final answer must have exactly one explicit terminal disposition.",
            path: ["decisionNodes", index, "terminalDispositions"],
          });
        }
      }
    });
  });

export const syntheticClinicalReleaseSchema = z
  .object({
    id: stableIdSchema,
    schemaVersion: z.literal(1),
    publicationStatus: z.literal("synthetic_unapproved_prototype"),
    disclaimer: z
      .string()
      .min(1)
      .refine(
        (value) =>
          value.toLowerCase().includes("synthetic") &&
          value.toLowerCase().includes("not clinically approved"),
        "The prototype disclaimer must identify synthetic, unapproved content.",
      ),
    concepts: z.array(testedConceptSchema).min(1),
    cases: z.array(syntheticClinicalCaseSchema).min(1),
  })
  .strict()
  .superRefine((release, context) => {
    const conceptIds = new Set<string>();
    release.concepts.forEach((concept, index) => {
      if (conceptIds.has(concept.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate concept ID: ${concept.id}`,
          path: ["concepts", index, "id"],
        });
      }
      conceptIds.add(concept.id);
    });

    const caseIds = new Set<string>();
    release.cases.forEach((clinicalCase, caseIndex) => {
      if (caseIds.has(clinicalCase.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate case ID: ${clinicalCase.id}`,
          path: ["cases", caseIndex, "id"],
        });
      }
      caseIds.add(clinicalCase.id);

      clinicalCase.decisionNodes.forEach((node, nodeIndex) => {
        if (!conceptIds.has(node.primaryConceptId)) {
          context.addIssue({
            code: "custom",
            message: `Unknown primary concept: ${node.primaryConceptId}`,
            path: ["cases", caseIndex, "decisionNodes", nodeIndex, "primaryConceptId"],
          });
        }
        const concept = release.concepts.find(
          (candidate) => candidate.id === node.primaryConceptId,
        );
        if (
          concept &&
          concept.earliestFacilityStage > clinicalCase.earliestFacilityStage
        ) {
          context.addIssue({
            code: "custom",
            message:
              "A case cannot become eligible before one of its scored concepts.",
            path: ["cases", caseIndex, "earliestFacilityStage"],
          });
        }
      });

      if (clinicalCase.tutorialEligible && clinicalCase.earliestFacilityStage !== 0) {
        context.addIssue({
          code: "custom",
          message: "Tutorial cases must be available at facility Level 0.",
          path: ["cases", caseIndex, "earliestFacilityStage"],
        });
      }
    });
  });

export type AnswerChoice = z.infer<typeof answerChoiceSchema>;
export type TerminalClinicalOutcome = z.infer<typeof terminalClinicalOutcomeSchema>;
export type TerminalOutcomeDisposition = z.infer<
  typeof terminalOutcomeDispositionSchema
>;
export type ResultGate = z.infer<typeof resultGateSchema>;
export type DecisionNode = z.infer<typeof decisionNodeSchema>;
export type TestedConcept = z.infer<typeof testedConceptSchema>;
export type ApprovedInstantiationProfile = z.infer<
  typeof approvedInstantiationProfileSchema
>;
export type PatientPresentationRevision = z.infer<
  typeof patientPresentationRevisionSchema
>;
export type SyntheticClinicalCase = z.infer<typeof syntheticClinicalCaseSchema>;
export type SyntheticClinicalRelease = z.infer<typeof syntheticClinicalReleaseSchema>;

export function validateSyntheticClinicalRelease(
  candidate: unknown,
): SyntheticClinicalRelease {
  return syntheticClinicalReleaseSchema.parse(candidate);
}
