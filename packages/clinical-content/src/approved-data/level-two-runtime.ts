import type { ClinicalSource, EvidenceClaim } from "../pilot-schema";
import type { SyntheticClinicalCase, TestedConcept } from "../schema";
import {
  ROW_034_CLINICAL_APPROVAL, ROW_034_CONCEPTS, ROW_034_EVIDENCE_CLAIMS,
  ROW_034_SOURCES, ROW_034_QUESTION_VARIANTS, ROW_034_APPROVED_ENCOUNTER_BLUEPRINTS,
} from "./colonic-lipoma";
import {
  ROW_038_CLINICAL_APPROVAL, ROW_038_CONCEPTS, ROW_038_EVIDENCE_CLAIMS,
  ROW_038_SOURCES, ROW_038_QUESTION_VARIANTS, ROW_038_APPROVED_ENCOUNTER_BLUEPRINTS,
} from "./vitamin-c-collagen-hydroxylation";
import {
  ROW_039_CLINICAL_APPROVAL, ROW_039_CONCEPTS, ROW_039_EVIDENCE_CLAIMS,
  ROW_039_SOURCES, ROW_039_QUESTION_VARIANTS, ROW_039_APPROVED_ENCOUNTER_BLUEPRINTS,
} from "./gastric-malt-lymphoma";
import {
  ROW_040_CLINICAL_APPROVAL, ROW_040_CONCEPTS, ROW_040_EVIDENCE_CLAIMS,
  ROW_040_SOURCES, ROW_040_QUESTION_VARIANTS, ROW_040_APPROVED_ENCOUNTER_BLUEPRINTS,
} from "./gastroparesis";
import {
  ROW_042_CLINICAL_APPROVAL, ROW_042_CONCEPTS, ROW_042_EVIDENCE_CLAIMS,
  ROW_042_SOURCES, ROW_042_QUESTION_VARIANTS, ROW_042_APPROVED_ENCOUNTER_BLUEPRINTS,
} from "./gastric-splenectomy";
import {
  ROW_049_CLINICAL_APPROVAL, ROW_049_CONCEPTS, ROW_049_EVIDENCE_CLAIMS,
  ROW_049_SOURCES, ROW_049_QUESTION_VARIANTS, ROW_049_APPROVED_ENCOUNTER_BLUEPRINTS,
} from "./peptic-ulcer-bleeding-hemostasis";
import {
  ROW_111_CLINICAL_APPROVAL, ROW_111_CONCEPTS, ROW_111_EVIDENCE_CLAIMS,
  ROW_111_SOURCES, ROW_111_QUESTION_VARIANTS, ROW_111_APPROVED_ENCOUNTER_BLUEPRINTS,
} from "./distal-cholangiocarcinoma";

type ApprovedVariant = {
  id: string;
  conceptId: string;
  stem: string;
  explanation: string;
  supportingEvidenceClaimIds: readonly string[];
  presentationVariantId: string;
  patientPresentation?: string;
  releasePointId: string;
  requiredClinicalSetting?: string;
  requiredCapabilityIds?: readonly string[];
  editorialSimulation?: { resultDelayMinutes: number };
  shuffleAnswers: boolean;
  answerChoices: readonly {
    id: string;
    label: string;
    isCorrect: boolean;
    distractorRationale: string | null;
    deferredService?: { serviceId: string };
  }[];
};
type Blueprint = {
  id: string;
  questionVariantIds: readonly string[];
  releasePointId?: string;
  requiredClinicalSetting?: string;
  requiredCapabilityIds?: readonly string[];
  presentation?: string;
  resultUpdate?: string;
};
type Package = {
  approval: { reviewer: string; reviewedOn: string };
  concepts: readonly TestedConcept[];
  claims: readonly EvidenceClaim[];
  sources: readonly ClinicalSource[];
  variants: readonly ApprovedVariant[];
  blueprints: readonly Blueprint[];
  /** Exact runtime allowlist; release-point membership alone never admits a blueprint. */
  selectedBlueprintIds: readonly string[];
};

function labelsFor(
  claimIds: readonly string[], claims: readonly EvidenceClaim[], sources: readonly ClinicalSource[], approval: Package["approval"],
): string[] {
  const claimsById = new Map(claims.map((claim) => [claim.id, claim]));
  for (const claimId of claimIds) {
    if (!claimsById.has(claimId)) {
      throw new Error(`Approved runtime variant references unknown evidence claim ${claimId}.`);
    }
  }
  const labels = sources
    .filter((source) => source.evidenceClaimIds.some((id) => claimIds.includes(id)))
    .map((source) => `${source.organizationOrJournal} — ${source.title} (${source.publicationYear})`);
  if (labels.length === 0) {
    throw new Error(`Approved runtime variant has no source supporting claims: ${claimIds.join(", ")}.`);
  }
  if (labels.some((label) => label.length > 240)) {
    throw new Error("Approved runtime source label exceeds the runtime schema limit.");
  }
  return [...new Set([...labels, `Clinically approved by ${approval.reviewer} on ${approval.reviewedOn}`])];
}

function noOutcome(choice: { id: string; label: string; isCorrect: boolean; distractorRationale: string | null }, explanation: string, sourceLabels: string[]) {
  return {
    answerChoiceId: choice.id,
    kind: "no_terminal_outcome" as const,
    consequenceNarrative: `The encounter recorded ${choice.label} instead of the approved answer.`,
    clinicalRationale: choice.distractorRationale ?? explanation,
    sourceLabels,
  };
}

/** Exact mechanical splits for the four approved direct colonic variants only. */
const COLONIC_DIRECT_SPLITS = {
  "question.colonic-lipoma.recognition.patient-to-diagnosis.v1": [
    "During a routine colonoscopy, you find a smooth subepithelial lesion with normal overlying mucosa and a faint yellow hue. It feels soft, indents with gentle pressure from closed biopsy forceps, and then regains its shape.",
    "What is the most likely diagnosis?",
  ],
  "question.colonic-lipoma.management.patient-to-plan.v1": [
    "The lesion has a characteristic endoscopic appearance of a colonic lipoma. The patient has no pain, bleeding, ulceration, obstructive symptoms, or other concerning features.",
    "What is the most appropriate lipoma-directed plan?",
  ],
  "question.colonic-lipoma.recognition.patient-to-diagnosis.v2": [
    "An asymptomatic patient has a rounded colonic lesion beneath normal-appearing mucosa. Gentle probing produces a temporary indentation, and the lesion returns to its original contour when pressure is released.",
    "Which diagnosis best fits this endoscopic appearance?",
  ],
  "question.colonic-lipoma.management.patient-to-plan.v2": [
    "Colonoscopy demonstrates a clearly characterized colonic lipoma with normal overlying mucosa. The finding is incidental, and the patient has no symptoms attributable to it.",
    "What should you recommend for this lesion?",
  ],
} as const;

function splitDirectColonicStem(variant: ApprovedVariant) {
  const split = COLONIC_DIRECT_SPLITS[variant.id as keyof typeof COLONIC_DIRECT_SPLITS];
  if (!split) return null;
  if (`${split[0]} ${split[1]}` !== variant.stem) {
    throw new Error(`Approved direct colonic split no longer reconstructs ${variant.id}.`);
  }
  return { context: split[0], question: split[1] };
}

function materialize(pkg: Package): SyntheticClinicalCase[] {
  const variants = new Map(pkg.variants.map((variant) => [variant.id, variant]));
  const blueprints = new Map(pkg.blueprints.map((blueprint) => [blueprint.id, blueprint]));
  return pkg.selectedBlueprintIds.map((blueprintId) => {
      const blueprint = blueprints.get(blueprintId);
      if (!blueprint) throw new Error(`Runtime allowlist references unknown blueprint ${blueprintId}.`);
      if (blueprint.releasePointId !== "release.l2.endoscopy") {
        throw new Error(`Runtime allowlist blueprint ${blueprint.id} is not an approved Level 2 release record.`);
      }
      if (!blueprint.requiredClinicalSetting || !blueprint.requiredCapabilityIds) {
        throw new Error(`Approved Level 2 blueprint ${blueprint.id} lacks runtime setting or capability metadata.`);
      }
      return {
        ...blueprint,
        requiredClinicalSetting: blueprint.requiredClinicalSetting,
        requiredCapabilityIds: blueprint.requiredCapabilityIds,
      };
    }).map((blueprint) => {
      const nodeVariants = blueprint.questionVariantIds.map((id) => {
        const variant = variants.get(id);
        if (!variant) throw new Error(`Approved blueprint ${blueprint.id} references unknown variant ${id}.`);
        return variant;
      });
      const allClaimIds = nodeVariants.flatMap((variant) => variant.supportingEvidenceClaimIds);
      const sourceLabels = labelsFor(allClaimIds, pkg.claims, pkg.sources, pkg.approval);
      const first = nodeVariants[0]!;
      const firstSplit = splitDirectColonicStem(first);
      const presentation = blueprint.presentation ?? first.patientPresentation ?? firstSplit?.context ?? first.stem;
      return {
        id: `case.l2.${blueprint.id.replace(/^blueprint\./, "")}`,
        displayName: `Level 2: ${blueprint.id.replace(/^blueprint\./, "").replace(/[-.]/g, " ")}`,
        patientPresentationVariantId: first.presentationVariantId,
        releasePointId: "release.l2.endoscopy",
        patientDisplayName: "Outpatient Patient",
        presentation,
        tutorialEligible: false,
        routineEligible: true,
        earliestFacilityStage: 2,
        requiredClinicalSetting: blueprint.requiredClinicalSetting as SyntheticClinicalCase["requiredClinicalSetting"],
        requiredCapabilityIds: [...blueprint.requiredCapabilityIds],
        rewardTierId: "reward.referral",
        sourceLabels,
        decisionNodes: nodeVariants.map((variant, index) => {
          const split = splitDirectColonicStem(variant);
          const nodeLabels = labelsFor(variant.supportingEvidenceClaimIds, pkg.claims, pkg.sources, pkg.approval);
          const choices = variant.answerChoices.map((choice) => ({
            id: choice.id,
            label: choice.label,
            isCorrect: choice.isCorrect,
            serviceRequest: choice.deferredService
              ? { serviceId: choice.deferredService.serviceId }
              : null,
          }));
          const final = index === nodeVariants.length - 1;
          return {
            id: `node.${variant.id.replace(/^question\./, "")}`,
            questionVariantId: variant.id,
            primaryConceptId: variant.conceptId,
            ...(index > 0 && (split?.context ?? blueprint.resultUpdate ?? variant.patientPresentation)
              ? { currentUpdate: split?.context ?? blueprint.resultUpdate ?? variant.patientPresentation }
              : {}),
            stem: split?.question ?? variant.stem,
            answerChoices: choices,
            shuffleAnswers: variant.shuffleAnswers,
            explanation: variant.explanation,
            sourceLabels: nodeLabels,
            resultGateAfter: !final && variant.editorialSimulation
              ? {
                  id: `result.${variant.id.replace(/^question\./, "")}`,
                  resultTypeId: variant.answerChoices.find((choice) => choice.isCorrect)?.deferredService?.serviceId ?? "service.endoscopy.eus-ercp-sampling",
                  pendingLabel: "Approved service result pending",
                  resultNarrative: blueprint.resultUpdate ?? variant.explanation,
                  readiness: "all" as const,
                  allowedServiceRouteIds: ["route.endoscopy.eus-ercp-sampling.in_house"],
                }
              : null,
            terminalDispositions: final
              ? variant.answerChoices.filter((choice) => !choice.isCorrect).map((choice) => noOutcome(choice, variant.explanation, nodeLabels))
              : [],
          };
        }),
        learningSummary: [...new Set(nodeVariants.map((variant) => variant.explanation))].join("\n\n"),
      } satisfies SyntheticClinicalCase;
    });
}

const PACKAGES: Package[] = [
  {
    approval: ROW_034_CLINICAL_APPROVAL,
    concepts: ROW_034_CONCEPTS,
    claims: ROW_034_EVIDENCE_CLAIMS,
    sources: ROW_034_SOURCES,
    variants: ROW_034_QUESTION_VARIANTS,
    blueprints: ROW_034_APPROVED_ENCOUNTER_BLUEPRINTS.map((blueprint) => ({
      ...blueprint,
      releasePointId: "release.l2.endoscopy",
      requiredClinicalSetting: "outpatient_endoscopy",
      requiredCapabilityIds: ["capability.endoscopy"],
    })),
    selectedBlueprintIds: ["blueprint.colonic-lipoma.direct.typical-a", "blueprint.colonic-lipoma.direct.typical-b"],
  },
  { approval: ROW_038_CLINICAL_APPROVAL, concepts: ROW_038_CONCEPTS, claims: ROW_038_EVIDENCE_CLAIMS, sources: ROW_038_SOURCES, variants: ROW_038_QUESTION_VARIANTS, blueprints: ROW_038_APPROVED_ENCOUNTER_BLUEPRINTS, selectedBlueprintIds: ["blueprint.wound-healing.vitamin-c.vitamin-identification.v1", "blueprint.wound-healing.vitamin-c.biochemical-step.v1", "blueprint.wound-healing.vitamin-c.mechanism-explanation.v1", "blueprint.wound-healing.vitamin-c.mechanism-consequence.v1"] },
  { approval: ROW_039_CLINICAL_APPROVAL, concepts: ROW_039_CONCEPTS, claims: ROW_039_EVIDENCE_CLAIMS, sources: ROW_039_SOURCES, variants: ROW_039_QUESTION_VARIANTS, blueprints: ROW_039_APPROVED_ENCOUNTER_BLUEPRINTS, selectedBlueprintIds: ["blueprint.gastric-malt.integrated-diagnosis-to-treatment.v1", "blueprint.gastric-malt.profile-to-followup-boundary.v1", "blueprint.gastric-malt.cd20-boundary.v1", "blueprint.gastric-malt.eradication-patient-selection.v1"] },
  { approval: ROW_040_CLINICAL_APPROVAL, concepts: ROW_040_CONCEPTS, claims: ROW_040_EVIDENCE_CLAIMS, sources: ROW_040_SOURCES, variants: ROW_040_QUESTION_VARIANTS, blueprints: ROW_040_APPROVED_ENCOUNTER_BLUEPRINTS, selectedBlueprintIds: ["blueprint.gastroparesis.general-confirmatory-testing.v1", "blueprint.gastroparesis.diabetes-confirmatory-testing.v1", "blueprint.gastroparesis.postsurgical-confirmatory-testing.v1", "blueprint.gastroparesis.objective-result-selection.v1"] },
  {
    approval: ROW_042_CLINICAL_APPROVAL,
    concepts: ROW_042_CONCEPTS.map(({ id, displayName, learningObjective, conceptType }) => ({
      id, displayName, learningObjective, conceptType, earliestFacilityStage: 2,
    })),
    claims: ROW_042_EVIDENCE_CLAIMS,
    sources: ROW_042_SOURCES,
    variants: ROW_042_QUESTION_VARIANTS,
    blueprints: ROW_042_APPROVED_ENCOUNTER_BLUEPRINTS,
    selectedBlueprintIds: ["blueprint.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1", "blueprint.gastric-adenocarcinoma.spleen-preservation-counseling.v1"],
  },
  { approval: ROW_049_CLINICAL_APPROVAL, concepts: ROW_049_CONCEPTS, claims: ROW_049_EVIDENCE_CLAIMS, sources: ROW_049_SOURCES, variants: ROW_049_QUESTION_VARIANTS, blueprints: ROW_049_APPROVED_ENCOUNTER_BLUEPRINTS, selectedBlueprintIds: ["blueprint.peptic-ulcer-bleeding.visible-vessel-hemostasis.v1", "blueprint.peptic-ulcer-bleeding.select-high-risk-stigmata.v1", "blueprint.peptic-ulcer-bleeding.clean-base-reverse.v1", "blueprint.peptic-ulcer-bleeding.visible-vessel-modality-principle.v1"] },
  { approval: ROW_111_CLINICAL_APPROVAL, concepts: ROW_111_CONCEPTS, claims: ROW_111_EVIDENCE_CLAIMS, sources: ROW_111_SOURCES, variants: ROW_111_QUESTION_VARIANTS, blueprints: ROW_111_APPROVED_ENCOUNTER_BLUEPRINTS, selectedBlueprintIds: ["blueprint.distal-cholangiocarcinoma.deferred-eus-ercp-to-resection"] },
];

export const LEVEL_TWO_RUNTIME_CONCEPTS = PACKAGES.flatMap((pkg) => pkg.concepts)
  .filter((concept, index, concepts) => concepts.findIndex((candidate) => candidate.id === concept.id) === index);
export const LEVEL_TWO_RUNTIME_CASES = PACKAGES.flatMap(materialize);
export const LEVEL_TWO_ROUTINE_CASE_IDS = LEVEL_TWO_RUNTIME_CASES.map((clinicalCase) => clinicalCase.id);
