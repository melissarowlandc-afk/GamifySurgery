import type { QuestionVariant } from "./pilot-schema";
import type { AnswerChoiceTimingRegistryEntry, SyntheticClinicalCase } from "./schema";
import { QUESTION_QUALITY_CONTENT_VERSION } from "./question-quality-pilot-evidence-20261028";
import { QUESTION_QUALITY_DEFINITIONS } from "./question-quality-pilot-20261028-data";
import { QUESTION_QUALITY_PRIOR_DEFINITIONS } from "./question-quality-pilot-20261028-r2";
import { QUESTION_QUALITY_OWNER_ROUND1_DEFINITIONS } from "./question-quality-pilot-20261029-round1";
import { QUESTION_QUALITY_OWNER_ROUND2_DEFINITIONS } from "./question-quality-pilot-20261102-round2";
import { recordQuestionQualityClinicalApprovals } from "./question-quality-clinical-approvals-20261102";
export { QUESTION_QUALITY_CLINICAL_APPROVALS } from "./question-quality-clinical-approvals-20261102";

export interface QuestionQualityRevision {
  id: string;
  auditId: string;
  caseId: string;
  nodeId: string;
  previousQuestionVariantId: string;
  questionVariantId: string;
  previousContentVersions: string[];
  previousStem: string;
  previousChoiceLabels: string[];
  previousPresentation?: string;
  previousProfilePresentations?: Array<{ id: string; presentation: string }>;
  presentationTemplate?: string;
  presentationContextBinding?: {
    patientPresentationRevision: SyntheticClinicalCase["patientPresentationRevision"] | null;
    prototypeDemographics: SyntheticClinicalCase["prototypeDemographics"] | null;
    patientDisplayName: string;
  };
  prototypeDemographics?: SyntheticClinicalCase["prototypeDemographics"];
  patientDisplayName?: string;
  chiefComplaint?: string;
  previousChiefComplaint?: string;
  previousProfileChiefComplaints?: Array<{id:string;chiefComplaint?:string}>;
  currentUpdate?: string | null;
  previousCurrentUpdate?: string | null;
  previousExhibit?: QuestionVariant["exhibit"] | null;
  presentationRevisionMetadata?: { idPrefix: string; contentVersion: string };
  resultNarrative?: string;
  previousResultNarrative?: string;
  educationalIntent: string;
  basicRecallIntentional?: boolean;
  basicRecallJustification?: string;
  intendedInference: string;
  reviewerNotes: string;
  contextCompanion: boolean;
  supersedesQuestionVariantId?: string;
  leadInReview?: { reviewedOn: string; changed: boolean; note: string };
  ownerEditorialReview?: { reviewedOn: string; questionVariantId: string; status: string; note: string };
  ownerRound2Review?: { reviewedOn: string; beforeVariantId: string; status: string; whatChanged: string };
  ownerRound3Review?: { reviewedOn: string; beforeVariantId: string; status: string; whatChanged: string };
  batchReview?: { reviewedOn: string; status: string; whatChanged: string };
  choiceSourceIds?: Record<string, string>;
  timingProfileOverrides?: Record<string, string>;
  choiceTimingOverrides?: Record<string, { kind: "no_test" } | { kind: "test"; timingProfileId: string }>;
  choiceServiceOverrides?: Record<string, string | null>;
  adversarialReview?: { reviewedOn: string; beforeVariantId: string; whatChanged: string; status: "awaiting_independent_re_review" };
  reviewResponse?: {
    sourceReviewId: string;
    originalVerdict: "PASS" | "REVISE" | "FAIL";
    noteResponses: { cues: string[]; fairness: string[]; suggestions: string[] };
    selfCheck: {
      cueAttack: string; difficulty: "moderate" | "hard" | "foundational";
      reasoningSteps: string[]; oneBestAnswer: string; closestDistractor: string; remainingReview: string;
    };
  };
  additionalSourceLabels?: string[];
  question: QuestionVariant;
}

/** Qualified drafts enter invited beta only through manager acceptance; this worker never ships. */
export const QUESTION_QUALITY_REVISIONS: readonly QuestionQualityRevision[] = recordQuestionQualityClinicalApprovals(QUESTION_QUALITY_DEFINITIONS);
/** Prior local draft identities remain available for frozen encounters and provenance. */
export const QUESTION_QUALITY_PRIOR_REVISIONS: readonly QuestionQualityRevision[] = recordQuestionQualityClinicalApprovals(QUESTION_QUALITY_PRIOR_DEFINITIONS);
export const QUESTION_QUALITY_OWNER_ROUND1_REVISIONS: readonly QuestionQualityRevision[] = recordQuestionQualityClinicalApprovals(QUESTION_QUALITY_OWNER_ROUND1_DEFINITIONS);
export const QUESTION_QUALITY_OWNER_ROUND2_REVISIONS: readonly QuestionQualityRevision[] = recordQuestionQualityClinicalApprovals(QUESTION_QUALITY_OWNER_ROUND2_DEFINITIONS);
export const QUESTION_QUALITY_HISTORICAL_REVISIONS = [...new Map(
  [...QUESTION_QUALITY_PRIOR_REVISIONS, ...QUESTION_QUALITY_OWNER_ROUND1_REVISIONS, ...QUESTION_QUALITY_OWNER_ROUND2_REVISIONS].map(r => [r.questionVariantId, r]),
).values()];
export const QUESTION_QUALITY_RETAINED_REVISIONS = QUESTION_QUALITY_HISTORICAL_REVISIONS.filter(
  prior => !QUESTION_QUALITY_REVISIONS.some(current => current.questionVariantId === prior.questionVariantId),
);
export const QUESTION_QUALITY_QUESTIONS = QUESTION_QUALITY_REVISIONS.map(r => r.question);
export { QUESTION_QUALITY_CONTENT_VERSION, QUESTION_QUALITY_CLAIMS, QUESTION_QUALITY_SOURCES } from "./question-quality-pilot-evidence-20261028";
export { QUESTION_QUALITY_ROUND2_CLAIMS, QUESTION_QUALITY_ROUND2_SOURCES } from "./question-quality-pilot-round2-evidence-20261029";

function presentation(template: string, demographics: SyntheticClinicalCase["prototypeDemographics"]): string {
  if (!/\{(?:ageYears|sexNoun)\}/.test(template)) return template;
  if (!demographics) throw new Error("Question revision requires bound demographics");
  const sexNoun = demographics.sexLabel === "Female" ? "woman" : demographics.sexLabel === "Male" ? "man" : "person";
  return template.replaceAll("{ageYears}", String(demographics.ageYears)).replaceAll("{sexNoun}", sexNoun);
}

/** Applied only to fresh assembled cases; existing frozen encounter objects are not rewritten. */
export function applyQuestionQualityRevisions(cases: SyntheticClinicalCase[], definitions: readonly QuestionQualityRevision[] = QUESTION_QUALITY_REVISIONS): SyntheticClinicalCase[] {
  const matched = new Set<string>();
  const result = cases.map(clinicalCase => {
    const revisions = definitions.filter(r => r.caseId === clinicalCase.id);
    if (!revisions.length) return clinicalCase;
    const contextRevision = revisions.find(r => r.presentationTemplate);
    if (contextRevision && (clinicalCase.presentation !== contextRevision.previousPresentation ||
        JSON.stringify((clinicalCase.approvedInstantiationProfiles ?? []).map(p => ({ id: p.id, presentation: p.presentation }))) !== JSON.stringify(contextRevision.previousProfilePresentations))) {
      throw new Error("Presentation revision source binding changed: " + clinicalCase.id);
    }
    if(contextRevision?.chiefComplaint!==undefined && (clinicalCase.chiefComplaint!==contextRevision.previousChiefComplaint ||
      JSON.stringify((clinicalCase.approvedInstantiationProfiles??[]).map(p=>({id:p.id,chiefComplaint:p.chiefComplaint})))!==JSON.stringify(contextRevision.previousProfileChiefComplaints)))
      throw new Error("Chief complaint revision source binding changed: "+clinicalCase.id);
    if (contextRevision?.presentationContextBinding) {
      const binding = { patientPresentationRevision: clinicalCase.patientPresentationRevision ?? null,
        prototypeDemographics: clinicalCase.prototypeDemographics ?? null, patientDisplayName: clinicalCase.patientDisplayName };
      if (JSON.stringify(binding) !== JSON.stringify(contextRevision.presentationContextBinding)) {
        throw new Error("Presentation context revision source binding changed: " + clinicalCase.id);
      }
    } else if (contextRevision && clinicalCase.patientPresentationRevision) throw new Error("Presentation revision needs explicit reconciliation: " + clinicalCase.id);
    const demographics = contextRevision?.prototypeDemographics ?? clinicalCase.prototypeDemographics;
    const revisedPresentation = contextRevision ? presentation(contextRevision.presentationTemplate!, demographics) : clinicalCase.presentation;
    const revisedProfiles = contextRevision ? clinicalCase.approvedInstantiationProfiles?.map(profile => ({
      ...profile, presentation: presentation(contextRevision.presentationTemplate!, profile.prototypeDemographics),
      ...(contextRevision.chiefComplaint!==undefined?{chiefComplaint:contextRevision.chiefComplaint}:{}),
    })) : clinicalCase.approvedInstantiationProfiles;
    const presentationRevision: SyntheticClinicalCase["patientPresentationRevision"] = contextRevision?.presentationContextBinding ? {
      id: (contextRevision.presentationRevisionMetadata?.idPrefix ?? "ppr.qq20261102.") + clinicalCase.id,
      patientPresentationVariantId: clinicalCase.patientPresentationVariantId,
      contentVersion: contextRevision.presentationRevisionMetadata?.contentVersion ?? "presentation-revision.question-quality.2026-11-02.v4",
      revisedPresentation,
      ...(contextRevision.chiefComplaint!==undefined || clinicalCase.patientPresentationRevision?.revisedFields.includes("chiefComplaint") ? { revisedChiefComplaint: contextRevision.chiefComplaint??clinicalCase.chiefComplaint } : {}),
      revisedFields: [...(contextRevision.chiefComplaint!==undefined || clinicalCase.patientPresentationRevision?.revisedFields.includes("chiefComplaint") ? ["chiefComplaint" as const] : []), "presentation"], aiAssistedDrafting: true,
      reviewStatus: "needs_clinician_review", lastClinicianReview: null,
      ...(revisedProfiles ? { revisedProfilePresentations: revisedProfiles.map(profile => ({
        id: (contextRevision.presentationRevisionMetadata?.idPrefix ?? "ppr.qq20261102.") + profile.id, approvedInstantiationProfileId: profile.id,
        contentVersion: contextRevision.presentationRevisionMetadata?.contentVersion ?? "presentation-revision.question-quality.2026-11-02.v4",
        revisedPresentation: profile.presentation, revisedFields: ["presentation"] as ["presentation"],
        aiAssistedDrafting: true as const, reviewStatus: "needs_clinician_review" as const, lastClinicianReview: null,
      })) } : {}),
    } : clinicalCase.patientPresentationRevision;
    const revised = {
      ...clinicalCase,
      ...(contextRevision ? {
        presentation: revisedPresentation, approvedInstantiationProfiles: revisedProfiles,
        ...(contextRevision.chiefComplaint!==undefined?{chiefComplaint:contextRevision.chiefComplaint}:{}),
        ...(contextRevision.prototypeDemographics ? { prototypeDemographics: contextRevision.prototypeDemographics } : {}),
        ...(contextRevision.patientDisplayName ? { patientDisplayName: contextRevision.patientDisplayName } : {}),
        ...(contextRevision.presentationContextBinding ? { patientPresentationRevision: presentationRevision } : {}),
      } : {}),
      decisionNodes: clinicalCase.decisionNodes.map(node => {
        const revision = revisions.find(r => r.nodeId === node.id);
        if (!revision) return node;
        if (node.questionVariantId !== revision.previousQuestionVariantId || node.stem !== revision.previousStem ||
            JSON.stringify(node.answerChoices.map(c => c.label)) !== JSON.stringify(revision.previousChoiceLabels)) {
          throw new Error("Question revision source binding changed: " + revision.id);
        }
        matched.add(revision.id);
        if (revision.previousCurrentUpdate !== undefined && (node.currentUpdate ?? null) !== revision.previousCurrentUpdate)
          throw new Error("Current update revision source binding changed: " + revision.id);
        if (revision.previousExhibit !== undefined && JSON.stringify(node.exhibit ?? null) !== JSON.stringify(revision.previousExhibit))
          throw new Error("Exhibit revision source binding changed: " + revision.id);
        if (revision.resultNarrative && node.resultGateAfter?.resultNarrative !== revision.previousResultNarrative) {
          throw new Error("Result narrative revision source binding changed: " + revision.id);
        }
        const q = revision.question;
        const sourceChoiceId = (id: string) => revision.choiceSourceIds?.[id] ?? id;
        const answerChoices = q.answerChoices.map(choice => {
          const sourceChoice = node.answerChoices.find(old => old.id === sourceChoiceId(choice.id));
          if (!sourceChoice || sourceChoice.isCorrect !== choice.isCorrect)
            throw new Error("Choice revision source binding changed: " + revision.id + "/" + choice.id);
          const service = revision.choiceServiceOverrides?.[choice.id];
          if (choice.isCorrect && service !== undefined && service !== (sourceChoice.serviceRequest?.serviceId ?? null))
            throw new Error("A wording revision cannot silently change the keyed service: " + revision.id);
          return { ...sourceChoice, id: choice.id, label: choice.label, isCorrect: choice.isCorrect,
            rationale: choice.rationale ?? choice.distractorRationale ?? q.explanation,
            serviceRequest: service === undefined ? sourceChoice.serviceRequest ?? null : service === null ? null : {serviceId: service},
          };
        });
        return {
          ...node, questionVariantId: q.id, stem: q.stem, answerChoices,
          ...(revision.currentUpdate !== undefined ? { currentUpdate: revision.currentUpdate ?? undefined } : {}),
          ...(revision.resultNarrative ? { resultGateAfter: { ...node.resultGateAfter!, resultNarrative: revision.resultNarrative } } : {}),
          explanation: q.explanation, teachingPoint: q.teachingPoint, exhibit: q.exhibit,
          shuffleAnswers: true,
          sourceLabels: [...node.sourceLabels, ...(revision.additionalSourceLabels ?? []), q.reviewStatus === "clinically_approved" && q.lastClinicianReview
            ? "Clinically approved: " + q.lastClinicianReview.reviewer + " on " + q.lastClinicianReview.reviewedOn + " (" + q.contentVersion + ")"
            : "AI-assisted revision: needs_clinician_review (" + q.contentVersion + ")"],
          terminalDispositions: node.terminalDispositions.flatMap(d => {
            const choices = answerChoices.filter(c => sourceChoiceId(c.id) === d.answerChoiceId && !c.isCorrect);
            if (choices.length > 1 && d.kind !== "no_terminal_outcome")
              throw new Error("Cannot duplicate a clinical outcome across new distractors: " + revision.id);
            return choices.map(choice => ({ ...d, answerChoiceId: choice.id,
              ...(revision.choiceSourceIds && d.kind === "no_terminal_outcome" ? { sourceLabels: revision.additionalSourceLabels ?? d.sourceLabels } : {}),
              consequenceNarrative: "The encounter recorded “" + choice.label + "”.", clinicalRationale: choice.rationale,
            }));
          }),
        };
      }),
    };
    return revised;
  });
  if (matched.size !== definitions.length) throw new Error("Missing question-quality revision target");
  return result;
}

/** Preserve old timing identities for frozen encounters and append explicit new identities. */
export function questionQualityTimingRevisions(entries: AnswerChoiceTimingRegistryEntry[], definitions: readonly QuestionQualityRevision[] = QUESTION_QUALITY_REVISIONS): AnswerChoiceTimingRegistryEntry[] {
  return definitions.map(revision => {
    const old = entries.find(e => e.caseId === revision.caseId && e.nodeId === revision.nodeId && e.questionVariantId === revision.previousQuestionVariantId);
    if (!old) throw new Error("Missing original timing identity: " + revision.id);
    const choices = revision.question.answerChoices.map(choice => {
      const sourceId = revision.choiceSourceIds?.[choice.id] ?? choice.id;
      const timingChoice = old.classification.kind === "test_choices" ? old.classification.choices.find(c => c.choiceId === sourceId) : undefined;
      if (old.classification.kind === "test_choices" && !timingChoice)
        throw new Error("New choice needs a timing classification: " + revision.id + "/" + choice.id);
      const profile = revision.timingProfileOverrides?.[choice.id];
      return { choiceId: choice.id, choiceLabel: choice.label,
        timing: revision.choiceTimingOverrides?.[choice.id] ?? (profile ? {kind:"test" as const,timingProfileId:profile} : timingChoice?.timing ?? {kind:"no_test" as const}),
      };
    });
    return {
      ...old, questionVariantId: revision.questionVariantId,
      classification: choices.every(c => c.timing.kind === "no_test") && (old.classification.kind === "no_test" || revision.choiceTimingOverrides !== undefined)
        ? {kind:"no_test" as const} : {kind:"test_choices" as const,choices},
    };
  });
}
