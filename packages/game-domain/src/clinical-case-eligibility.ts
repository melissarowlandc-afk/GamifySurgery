import {
  ANSWER_CHOICE_TIMING_REGISTRY,
  PEDIATRIC_CLINIC_FAMILY_CONTEXTS,
  type SyntheticClinicalCase,
} from "@gamify-surgery/clinical-content";
import { pediatricCaseHasCompatibleIdentity } from "./pediatric-eligibility";
import { pediatricStillEligibleEntries } from "./characterStillCatalog";
import { getCurrentCapabilities, isRoomOperationalForFacilityWork } from "./selectors";
import { getExactTestChoiceOrderRecordForCase } from "./test-choice-orders";
import { pediatricProcedureFamilyContext, supportedProcedureContext } from "./procedure-context";
import type { DomainContext, GameState } from "./types";

/** Exact editorial identities, never an input to disease selection or FSRS. */
export function getPediatricClinicFamilyContext(clinicalCase: SyntheticClinicalCase) {
  if (!clinicalCase.pediatricProfile) return undefined;
  const procedural = pediatricProcedureFamilyContext(clinicalCase);
  if (procedural) return procedural;
  const family = PEDIATRIC_CLINIC_FAMILY_CONTEXTS.find(row => row.caseId === clinicalCase.id &&
    row.profileId === (clinicalCase.selectedInstantiationProfileId ?? clinicalCase.approvedInstantiationProfiles?.[0]?.id));
  const demographics = clinicalCase.prototypeDemographics;
  const profiles = clinicalCase.approvedInstantiationProfiles;
  return family && clinicalCase.patientDisplayName === family.childName &&
    profiles?.length === 1 && profiles[0]!.prototypeDemographics?.ageYears === family.prototypeDemographics.ageYears &&
    profiles[0]!.prototypeDemographics?.sexLabel === family.prototypeDemographics.sexLabel &&
    demographics?.ageYears === family.prototypeDemographics.ageYears &&
    demographics.sexLabel === family.prototypeDemographics.sexLabel &&
    pediatricStillEligibleEntries(demographics.sexLabel, demographics.ageYears).some(row => row.stillId === family.childStillId)
    ? family : undefined;
}

/** Current child charts have no enacted tests/procedures, including distractors. */
export function clinicalCaseHasSupportedPatientSemantics(clinicalCase: SyntheticClinicalCase): boolean {
  if (!pediatricCaseHasCompatibleIdentity(clinicalCase)) return false;
  if (!clinicalCase.pediatricProfile) return clinicalCase.releasePointId !== "release.l4.pediatrics";
  if (clinicalCase.pediatricProfile.requiresParent !== true) return false;
  const liveProcedure = supportedProcedureContext(clinicalCase);
  if ((clinicalCase.requiredClinicalSetting !== "clinic" && !liveProcedure) || clinicalCase.participant) return false;
  if (clinicalCase.procedureContext?.mode === "live" && (!liveProcedure || !pediatricProcedureFamilyContext(clinicalCase))) return false;
  if (clinicalCase.decisionNodes.some(node => node.resultGateAfter || node.answerChoices.some(choice => choice.serviceRequest))) return false;
  const pediatricRelease = clinicalCase.releasePointId === "release.l4.pediatrics";
  if (pediatricRelease && !getPediatricClinicFamilyContext(clinicalCase)) return false;
  return clinicalCase.decisionNodes.every(node => {
    const timing = ANSWER_CHOICE_TIMING_REGISTRY.find(row => row.caseId === clinicalCase.id &&
      row.nodeId === node.id && row.questionVariantId === node.questionVariantId);
    // Preserve old synthetic fixtures, but require complete exact metadata for
    // admitted children. Planning-only estimates do not enact pediatric testing.
    if (!timing) return !pediatricRelease;
    const classification = timing.classification;
    if (classification.kind === "no_test") return true;
    return classification.choices.length === node.answerChoices.length && node.answerChoices.every(choice => {
      const declared = classification.choices.find(row => row.choiceId === choice.id && row.choiceLabel === choice.label);
      if (!declared) return false;
      if (declared.timing.kind === "no_test") return true;
      const order = getExactTestChoiceOrderRecordForCase(clinicalCase.id, node, choice.id);
      return order?.disposition.kind === "not_executed" && order.disposition.reason === "future_planned";
    });
  });
}

export function clinicalCaseEarliestFacilityStage(clinicalCase: SyntheticClinicalCase): number {
  return Math.max(clinicalCase.earliestFacilityStage,
    clinicalCase.pediatricProfile || clinicalCase.releasePointId === "release.l4.pediatrics" ? 4 : 0);
}

/** Shared by explicit admission, automatic arrivals and availability projections. */
export function getClinicalCaseEligibilityIssue(
  state: GameState,
  clinicalCase: SyntheticClinicalCase,
  context: DomainContext,
  capabilities = getCurrentCapabilities(state, context),
): string | null {
  if (clinicalCase.procedureContext?.mode === "live" && !supportedProcedureContext(clinicalCase)) {
    return "This live case needs a supported declared procedure family and observation-only steps.";
  }
  if (clinicalCase.procedureContext?.mode === "chart_review" && clinicalCase.requiredClinicalSetting !== "clinic") {
    return "A hospital procedure record review must use the clinic setting.";
  }
  if (clinicalCase.procedureContext?.mode === "chart_review" && clinicalCase.decisionNodes.some(node =>
    node.resultGateAfter || node.answerChoices.some(choice => choice.serviceRequest))) {
    return "A procedure record review uses recorded observations, not an executed procedure or result gate.";
  }
  if (!pediatricCaseHasCompatibleIdentity(clinicalCase)) {
    return "This patient needs compatible, explicit pediatric demographics and child art.";
  }
  if (!clinicalCaseHasSupportedPatientSemantics(clinicalCase)) {
    return "This pediatric variant needs supported outpatient choices and its exact child/parent context.";
  }
  const stage = clinicalCaseEarliestFacilityStage(clinicalCase);
  if (stage > state.facilityLevel) return `This patient becomes eligible at Level ${stage}.`;
  const missingCapabilityId = clinicalCase.requiredCapabilityIds.find(id => !capabilities.has(id));
  if (missingCapabilityId) return `This patient requires unavailable clinic capability ${missingCapabilityId}.`;
  if (clinicalCase.pediatricProfile && !state.rooms.some(room => room.roomDefinitionId === "room.pediatric_examination" &&
    isRoomOperationalForFacilityWork(state, room.id, context))) {
    return "This patient requires an operational Pediatric Examination Room.";
  }
  return null;
}
