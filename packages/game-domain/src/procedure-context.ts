import type { SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import { pediatricStillEligibleEntries } from "./characterStillCatalog";
import { legacyProcedureContext } from "./legacy-procedure-contexts";
import type { ProcedureVisitContext } from "./types";

type LiveContext = Extract<NonNullable<SyntheticClinicalCase["procedureContext"]>, {mode: "live"}>;

// Supported simulation routes, not clinical indications or special equipment.
// Specialized families must explicitly supply their additional capabilities.
const operationFamilies = new Set([
  "procedure.laparoscopic_cholecystectomy", "procedure.groin_hernia_repair",
  "procedure.ventral_hernia_repair", "procedure.soft_tissue_excision",
  "procedure.umbilical_hernia_repair", "procedure.orchiopexy", "procedure.hydrocele_repair",
  "procedure.circumcision", "procedure.pilonidal_excision", "procedure.central_venous_port_insertion",
  "procedure.anorectal_eua", "procedure.parathyroidectomy", "procedure.thyroidectomy",
]);
const endoscopyFamilies = new Set(["procedure.colonoscopy_polypectomy", "procedure.egd"]);
const lines = { operation: ["income.ambulatory_operation", "income.ambulatory_operation_extended"],
  // The advanced line is the existing generic EUS/ERCP route, not proof of an
  // EGD/colonoscopy family or specialized rescue capability. Legacy stays untagged.
  endoscopy: ["income.endoscopy"] } as const;

export function supportedProcedureContext(clinicalCase: SyntheticClinicalCase): LiveContext | undefined {
  const declared = clinicalCase.procedureContext;
  if (declared?.mode !== "live" || declared.version !== "procedure-context.v1" || declared.phase !== "procedure" ||
      !(declared.kind === "operation" ? operationFamilies : endoscopyFamilies).has(declared.familyId) ||
      !declared.allowedIncomeLineIds.length || declared.allowedIncomeLineIds.some(id => !(lines[declared.kind] as readonly string[]).includes(id)) ||
      clinicalCase.participant || Boolean(clinicalCase.pediatricProfile) !== Boolean(declared.pediatricFamilyContext) ||
      clinicalCase.decisionNodes.some(node => node.resultGateAfter || node.answerChoices.some(choice => choice.serviceRequest)) ||
      (declared.kind === "operation" ? clinicalCase.requiredClinicalSetting !== "ambulatory_surgery"
        : !["endoscopy", "outpatient_endoscopy"].includes(clinicalCase.requiredClinicalSetting))) return undefined;
  return declared;
}

export function procedureCaseRequiresSource(clinicalCase: SyntheticClinicalCase): boolean {
  if (clinicalCase.procedureContext?.mode === "live") return true;
  if (clinicalCase.procedureContext?.mode === "chart_review") return false;
  return clinicalCase.requiredClinicalSetting !== "clinic" && !legacyProcedureContext(clinicalCase);
}

export function pediatricProcedureFamilyContext(clinicalCase: SyntheticClinicalCase) {
  const declared = supportedProcedureContext(clinicalCase), family = declared?.pediatricFamilyContext;
  if (!family || !clinicalCase.pediatricProfile || clinicalCase.releasePointId !== "release.l4.pediatrics") return undefined;
  const profiles = clinicalCase.approvedInstantiationProfiles;
  const demographics = clinicalCase.prototypeDemographics;
  if (profiles?.length !== 1 || profiles[0]?.id !== family.profileId ||
      clinicalCase.selectedInstantiationProfileId && clinicalCase.selectedInstantiationProfileId !== family.profileId ||
      clinicalCase.patientDisplayName !== family.childName || !demographics ||
      (demographics.sexLabel !== "Female" && demographics.sexLabel !== "Male") ||
      (profiles[0].prototypeDemographics?.ageYears ?? demographics.ageYears) !== demographics.ageYears ||
      (profiles[0].prototypeDemographics?.sexLabel ?? demographics.sexLabel) !== demographics.sexLabel ||
      !pediatricStillEligibleEntries(demographics.sexLabel, demographics.ageYears).some(row => row.stillId === family.childStillId)) return undefined;
  return {...family, caseId: clinicalCase.id, prototypeDemographics: {ageYears: demographics.ageYears, sexLabel: demographics.sexLabel}};
}

export function procedureFamilyKind(familyId: string): "operation" | "endoscopy" | null {
  return operationFamilies.has(familyId) ? "operation" : endoscopyFamilies.has(familyId) ? "endoscopy" : null;
}

/** Strict opt-in saved visit; never backfill metadata into legacy operations. */
export function normalizeProcedureVisit(value: unknown, lineId: string): ProcedureVisitContext | undefined {
  if (value === undefined) return undefined;
  const raw = value as ProcedureVisitContext;
  const invalid = (): never => {throw new Error("The saved procedure visit context is invalid.");};
  if (!raw || typeof raw !== "object" || Array.isArray(raw) || raw.version !== "procedure-visit.v1" ||
      (raw.kind !== "operation" && raw.kind !== "endoscopy") ||
      Object.keys(raw).some(key => !["version", "familyId", "kind", "demographics", "pediatricFamilyContext"].includes(key)) ||
      procedureFamilyKind(raw.familyId) !== raw.kind || !(lines[raw.kind] as readonly string[]).includes(lineId) ||
      !raw.demographics || Object.keys(raw.demographics).length !== 2 ||
      !["Female", "Male"].includes(raw.demographics.sexLabel) || !Number.isSafeInteger(raw.demographics.ageYears) ||
      raw.demographics.ageYears < 5 || raw.demographics.ageYears > 120) return invalid();
  const family = raw.pediatricFamilyContext;
  if (family !== undefined && (!family || typeof family !== "object" || Array.isArray(family))) return invalid();
  if (family) {
    if (raw.demographics.ageYears > 17 || Object.keys(family).length !== 5 ||
        ["profileId", "childName", "childStillId", "parentName"].some(key => typeof family[key as keyof typeof family] !== "string" || !family[key as keyof typeof family]) ||
        !["mother", "father"].includes(family.parentRelationship) ||
        !pediatricStillEligibleEntries(raw.demographics.sexLabel, raw.demographics.ageYears).some(row => row.stillId === family.childStillId)) return invalid();
  } else if (raw.demographics.ageYears < 18) return invalid();
  return {...raw, demographics: {...raw.demographics}, ...(family ? {pediatricFamilyContext: {...family}} : {})};
}
