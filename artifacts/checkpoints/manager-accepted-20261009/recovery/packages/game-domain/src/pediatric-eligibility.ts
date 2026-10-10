import type { SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import { pediatricStillEligibleEntries } from "./characterStillCatalog";
import type { ServiceRouteDefinition } from "@gamify-surgery/balance-config";

/** Presentation admission only. No clinical cases, probabilities or weights. */
export function pediatricCaseHasCompatibleIdentity(clinicalCase: SyntheticClinicalCase): boolean {
  const demographics = [clinicalCase.prototypeDemographics,
    ...(clinicalCase.approvedInstantiationProfiles ?? []).map(profile => profile.prototypeDemographics ?? clinicalCase.prototypeDemographics)];
  if (!clinicalCase.pediatricProfile) return demographics.every(profile => profile?.ageYears === undefined || profile.ageYears >= 18);
  return demographics.every(profile => pediatricStillEligibleEntries(profile?.sexLabel, profile?.ageYears).length > 0);
}

/** Owner's launch scope, not a clinical indication/safety recommendation. */
export function pediatricServiceIsUnsupported(id: string, route?: ServiceRouteDefinition): boolean {
  if (/mri|mrcp|endoscop|sedation|anesthesia|ambulatory_operation|surgery|operative|wound_procedure/i.test(id)) return true;
  const excludedRooms = new Set(["room.mri", "room.endoscopy", "room.ambulatory_or", "room.periop_recovery", "room.wound_ostomy", "room.minor_procedure"]);
  return Boolean(route && (pediatricServiceIsUnsupported(route.id) ||
    route.resourceRequirements.some(resource => excludedRooms.has(resource.roomDefinitionId)) ||
    route.patientTravel && excludedRooms.has(route.patientTravel.destinationRoomDefinitionId)));
}
