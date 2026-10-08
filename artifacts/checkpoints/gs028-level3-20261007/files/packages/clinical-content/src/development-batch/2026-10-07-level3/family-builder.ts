import {
  CHECKED_ON, claim, concept, createDevelopmentFamily, linkSourcesToClaims, source,
  type CaseSpec, type ChoiceSpec, type DevelopmentConcept,
} from "./batch-helpers";

export interface VariantChoice {
  id: string;
  label: string;
  rationale: string;
  test?: { timingProfileId: string; serviceId?: string };
}
export interface VariantSpec {
  slug: string; complaint: string; presentation: string; stem: string;
  correct: VariantChoice; distractors: [VariantChoice, VariantChoice, VariantChoice];
  explanation: string; claimIds: string[]; currentUpdate?: string;
  ageYears?: readonly number[];
  sexLabels?: readonly ("Female" | "Male" | "Not specified")[];
  acuity?: "stable" | "urgent";
  prototypeVitalSigns?: CaseSpec["prototypeVitalSigns"];
  gate?: {
    id: string; serviceId: string; pendingLabel: string;
    resultNarrative: string; routeIds: string[];
  };
}
export interface ConceptSpec {
  id: string; displayName: string; learningObjective: string; stage: 0 | 1 | 2 | 3;
  educationalTier: 0 | 1; conceptType: DevelopmentConcept["conceptType"];
  evidenceClaimIds: string[];
  variants: [VariantSpec, VariantSpec, VariantSpec, VariantSpec];
}
export interface ClaimSpec {
  id: string; statement: string; sourceIds: string[];
  category: "definition" | "anatomy" | "evaluation" | "management" | "disposition" | "safety_boundary" | "presentation";
  certainty?: "high" | "moderate" | "low";
  limitation: string | null; population: string;
}
export interface SourceSpec {
  id: string; title: string; citation: string; organization: string;
  authors: string[]; year: number | null; doi?: string; pmid?: string; url: string;
  sourceClass: "government_guidance" | "professional_society_guideline" | "peer_reviewed_guideline" | "systematic_review" | "narrative_review" | "open_educational_resource" | "observational_study" | "randomized_trial";
  licenseLabel: string;
  reuseStatus: "public_domain_conditions_apply" | "cc_by_4_0" | "cc_by_nc_4_0_restricted" | "copyrighted_targeted_verification_only";
  authority: string;
  usageRole?: "evidence" | "cross_check" | "both";
}
export interface FamilySpec {
  slug: string; label: string; concepts: ConceptSpec[];
  claims: ClaimSpec[]; sources: SourceSpec[];
  serviceContracts?: Array<{
    serviceId: string; allowedRouteIds: string[];
    delivery: "existing_balance_contract" | "new_external_contract_required";
  }>;
  /** Pair matching variants of the first two objectives; others stay independent. */
  pairing?: { indices: Array<0 | 1 | 2 | 3 | 3>; updates: string[] };
}

const choice = (item: VariantChoice, isCorrect = false): ChoiceSpec => ({
  id: item.id, label: item.label, rationale: item.rationale, isCorrect,
  ...(item.test?.serviceId ? { serviceId: item.test.serviceId } : {}),
  timing: item.test
    ? { kind: "test", timingProfileId: item.test.timingProfileId }
    : { kind: "no_test" },
});

export function buildFamily(spec: FamilySpec) {
  if (spec.concepts.length === 0) throw new Error("A family requires an objective.");
  if (spec.pairing && (spec.concepts.length < 2 || spec.pairing.indices.length !== spec.pairing.updates.length)) {
    throw new Error("Paired variants require two objectives and one update per pair.");
  }
  const claims = spec.claims.map((item) => claim({
    id: item.id, statement: item.statement, sourceIds: item.sourceIds,
    evidenceCategory: item.category, certainty: item.certainty ?? "moderate",
    limitation: item.limitation, applicablePopulation: item.population,
    lastCheckedOn: CHECKED_ON,
  }));
  const sources = linkSourcesToClaims(spec.sources.map((item) => source({
    id: item.id, title: item.title, completeCitation: item.citation,
    organizationOrJournal: item.organization, authors: item.authors,
    publicationYear: item.year, doi: item.doi ?? null, pmid: item.pmid ?? null,
    officialUrl: item.url, accessedOn: CHECKED_ON, sourceClass: item.sourceClass,
    licenseLabel: item.licenseLabel, reuseStatus: item.reuseStatus,
    reuseNotes: "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
    authorityAssessment: item.authority, usageRole: item.usageRole ?? "evidence",
  })), claims);
  const concepts = spec.concepts.map((item) => concept({
    id: item.id, displayName: item.displayName, learningObjective: item.learningObjective,
    earliestFacilityStage: item.stage, educationalTier: item.educationalTier,
    conceptType: item.conceptType, evidenceClaimIds: item.evidenceClaimIds,
  }));
  const node = (variant: VariantSpec, conceptId: string, allowGate = false) => ({
    conceptId, stem: variant.stem,
    choices: [choice(variant.correct, true), ...variant.distractors.map((item) => choice(item))] as CaseSpec["nodes"][number]["choices"],
    explanation: variant.explanation, claimIds: variant.claimIds,
    ...(variant.currentUpdate ? { currentUpdate: variant.currentUpdate } : {}),
    ...(allowGate && variant.gate ? { gate: variant.gate } : {}),
  });
  const makeCase = (id: string, variant: VariantSpec, nodes: CaseSpec["nodes"], stage: 0 | 1 | 2 | 3): CaseSpec => ({
    id: `case.gs028g.${spec.slug}.${id}`, displayName: spec.label,
    chiefComplaint: variant.complaint, presentation: variant.presentation,
    ageYears: variant.ageYears ?? [43, 68], sexLabels: variant.sexLabels ?? ["Female", "Male"],
    stage, acuity: variant.acuity ?? "stable",
    ...(variant.prototypeVitalSigns ? { prototypeVitalSigns: variant.prototypeVitalSigns } : {}),
    releasePointId: "release.l0.clinic_evaluation", nodes,
  });
  const paired = new Set(spec.pairing?.indices ?? []);
  const pairedCases = (spec.pairing?.indices ?? []).map((index, pairIndex) => {
    const first = spec.concepts[0]!, second = spec.concepts[1]!;
    const firstVariant = first.variants[index];
    const secondVariant = { ...second.variants[index], currentUpdate: spec.pairing!.updates[pairIndex] };
    return makeCase(`paired-${firstVariant.slug}`, firstVariant,
      [node(firstVariant, first.id, true), node(secondVariant, second.id)],
      Math.max(first.stage, second.stage) as 0 | 1 | 2 | 3);
  });
  const standaloneCases = spec.concepts.flatMap((item, conceptIndex) =>
    item.variants.flatMap((variant, variantIndex) =>
      conceptIndex < 2 && paired.has(variantIndex as 0 | 1 | 2 | 3 | 3)
        ? []
        : [makeCase(`c${conceptIndex + 1}-${variant.slug}`, variant, [node(variant, item.id)], item.stage)],
    ),
  );
  const built = createDevelopmentFamily({
    concepts, cases: [...pairedCases, ...standaloneCases],
    sourceLabels: spec.sources.map((item) => item.title),
  });
  return { ...built, authoringConcepts: concepts, claims, sources, serviceContracts: spec.serviceContracts ?? [] };
}
