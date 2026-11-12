import type { SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import { getPediatricClinicFamilyContext } from "./clinical-case-eligibility";
import type { DomainContext, GameState } from "./types";

// Editorial room/topic affinity for existing authored clinic questions. These
// IDs do not add clinical relationships, alter teaching, or weight prevalence.
const woundConcepts = new Set([
  "concept.venous-leg-ulcer.arterial-assessment-before-compression",
  "concept.superficial-incisional-ssi.open-drain",
  "concept.venous-leg-ulcer.compression-with-adequate-arterial-perfusion",
  "concept.diabetic-foot-infection.clinical-recognition",
  "concept.diabetic-foot-ulcer.no-antibiotics-without-infection",
]);
const ostomyConcepts = new Set([
  "concept.high-output-ileostomy.renal-electrolyte-magnesium-assessment",
  "concept.high-output-ileostomy.sodium-glucose-oral-rehydration",
  "concept.parastomal-hernia.clinical-recognition",
  "concept.parastomal-hernia.nonurgent-stoma-specialist-management",
  "concept.stoma-prolapse.viability-obstruction-assessment",
  "concept.stoma-prolapse.urgent-surgical-escalation",
]);

export function clinicConsultKindForLine(lineId: string) {
  return lineId === "income.app_consult" ? "app" as const : lineId === "income.pediatric_consult" ? "pediatric" as const
    : ["income.wound_care", "income.ostomy_support"].includes(lineId) ? "wound_ostomy" as const : null;
}

export function clinicCaseMatchesLine(c: SyntheticClinicalCase, lineId: string): boolean {
  if (!c.routineEligible || c.participant || c.requiredClinicalSetting !== "clinic") return false;
  if (lineId === "income.pediatric_consult") return Boolean(getPediatricClinicFamilyContext(c));
  if (c.pediatricProfile) return false;
  if (lineId === "income.app_consult") return true;
  const topics = lineId === "income.wound_care" ? woundConcepts : lineId === "income.ostomy_support" ? ostomyConcepts : null;
  return Boolean(topics && c.decisionNodes.some(node => topics.has(node.primaryConceptId)));
}

/** Exact existing child/parent/art contexts, selected before any scored case. */
export function pediatricConsultPresentations(state: GameState, context: DomainContext) {
  const unique = new Map<string, NonNullable<ReturnType<typeof getPediatricClinicFamilyContext>>>();
  for (const c of context.clinicalRelease.cases) {
    if (!clinicCaseMatchesLine(c, "income.pediatric_consult") || c.earliestFacilityStage > state.facilityLevel) continue;
    const family = getPediatricClinicFamilyContext(c)!;
    unique.set(`${family.childName}|${family.childStillId}|${family.parentName}`, family);
  }
  return [...unique.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, family]) => family);
}
