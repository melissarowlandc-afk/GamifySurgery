import {
  SYNTHETIC_CLINICAL_RELEASE,
} from "./synthetic-content";
import {
  validateSyntheticClinicalRelease,
  type SyntheticClinicalRelease,
  type TestedConcept,
} from "./schema";
import { materializePilotCase } from "./pilot-generator";
import {
  validatePilotRegistry,
  type EvidenceClaim,
  type PilotConcept,
  type PilotRegistry,
} from "./pilot-schema";
import {
  PILOT_CONTENT_VERSION,
} from "./pilot-data/common";
import {
  LAC_ABS_BIL_CLAIMS,
  LAC_ABS_BIL_CONCEPTS,
  LAC_ABS_BIL_FAMILIES,
  LAC_ABS_BIL_PHENOTYPES,
  LAC_ABS_BIL_PHYSIOLOGY_OVERLAYS,
  LAC_ABS_BIL_SOURCES,
  LAC_ABS_BIL_TEMPLATES,
} from "./pilot-data/laceration-abscess-biliary";
import {
  HERNIA_APPENDICITIS_CLAIMS,
  HERNIA_APPENDICITIS_OVERLAYS,
  HERNIA_APPENDICITIS_PHENOTYPES,
  HERNIA_APPENDICITIS_SOURCES,
} from "./pilot-data/hernia-appendicitis";
import {
  HERNIA_APPENDICITIS_CONCEPTS,
  HERNIA_APPENDICITIS_FAMILIES,
  HERNIA_APPENDICITIS_TEMPLATES,
} from "./pilot-data/hernia-appendicitis-content";

const unique = <T>(values: readonly T[]): T[] => [...new Set(values)];

export const PILOT_REGISTRY: PilotRegistry = validatePilotRegistry({
  contentVersion: PILOT_CONTENT_VERSION,
  sources: [...LAC_ABS_BIL_SOURCES, ...HERNIA_APPENDICITIS_SOURCES],
  claims: [...LAC_ABS_BIL_CLAIMS, ...HERNIA_APPENDICITIS_CLAIMS],
  physiologyOverlays: [
    ...LAC_ABS_BIL_PHYSIOLOGY_OVERLAYS,
    ...HERNIA_APPENDICITIS_OVERLAYS,
  ],
  diagnosisFamilies: [
    ...LAC_ABS_BIL_FAMILIES,
    ...HERNIA_APPENDICITIS_FAMILIES,
  ],
  phenotypes: [
    ...LAC_ABS_BIL_PHENOTYPES,
    ...HERNIA_APPENDICITIS_PHENOTYPES,
  ],
  concepts: [...LAC_ABS_BIL_CONCEPTS, ...HERNIA_APPENDICITIS_CONCEPTS],
  encounterTemplates: [
    ...LAC_ABS_BIL_TEMPLATES,
    ...HERNIA_APPENDICITIS_TEMPLATES,
  ],
});

const templateByConceptId = new Map<string, number>();
for (const template of PILOT_REGISTRY.encounterTemplates) {
  for (const conceptId of template.scoredConceptIds) {
    const current = templateByConceptId.get(conceptId);
    templateByConceptId.set(
      conceptId,
      current === undefined
        ? template.earliestFacilityStage
        : Math.min(current, template.earliestFacilityStage),
    );
  }
}

function projectConcept(concept: PilotConcept): TestedConcept {
  return {
    id: concept.id,
    displayName: concept.displayName,
    learningObjective: concept.learningObjective,
    earliestFacilityStage:
      templateByConceptId.get(concept.id) ?? concept.educationalTier,
    conceptType: concept.conceptType,
  };
}

const pilotCaseIds = new Set(
  PILOT_REGISTRY.encounterTemplates.map((template) => template.id),
);
const pilotConceptIds = new Set(
  PILOT_REGISTRY.concepts.map((concept) => concept.id),
);
const canonicalPilotCases = PILOT_REGISTRY.encounterTemplates.map((template) =>
  materializePilotCase(
    PILOT_REGISTRY,
    template.id,
    `pilot-canonical-preview|${template.id}`,
    {
      patientDisplayName: "Pilot Preview Patient",
    },
  ),
);

/**
 * The pilot projects into the existing unapproved runtime release.
 *
 * Its stable release ID is deliberately preserved so legacy saves continue to
 * hydrate. Existing encounters already carry a frozen copy of their case, while
 * new encounters are materialized from the richer registry before that normal
 * freeze boundary.
 */
export const PILOT_CLINICAL_RELEASE: SyntheticClinicalRelease =
  validateSyntheticClinicalRelease({
    ...SYNTHETIC_CLINICAL_RELEASE,
    disclaimer:
      "Synthetic and AI-assisted prototype draft content for software and clinician review only; not clinically approved and not medical guidance.",
    concepts: [
      ...SYNTHETIC_CLINICAL_RELEASE.concepts.filter(
        (concept) => !pilotConceptIds.has(concept.id),
      ),
      ...PILOT_REGISTRY.concepts.map(projectConcept),
    ],
    cases: [
      ...SYNTHETIC_CLINICAL_RELEASE.cases.filter(
        (clinicalCase) => !pilotCaseIds.has(clinicalCase.id),
      ),
      ...canonicalPilotCases,
    ],
  });

/**
 * Centralized editorial sampling weights. These tune encounter variety and
 * must never be interpreted as prevalence or clinical probability.
 */
export const PILOT_SIMULATION_WEIGHTS: Readonly<Record<string, number>> =
  Object.freeze(
    Object.fromEntries(
      PILOT_REGISTRY.encounterTemplates.map((template) => {
        const phenotype = PILOT_REGISTRY.phenotypes.find(
          (candidate) => candidate.id === template.phenotypeId,
        );
        if (!phenotype) {
          throw new Error(`Missing pilot phenotype ${template.phenotypeId}.`);
        }
        return [template.id, phenotype.simulationWeight.value];
      }),
    ),
  );

export interface PilotChartClinicalReview {
  diagnosisId: string;
  diagnosisName: string;
  sections: Array<{
    id: string;
    heading: string;
    body: string;
    evidenceClaimIds: string[];
  }>;
  claims: Array<{
    id: string;
    statement: string;
    reviewStatus: string;
  }>;
  sources: Array<{
    id: string;
    title: string;
    organizationOrJournal: string;
    year: number;
    href: string;
    supportedClaimIds: string[];
    reuseStatus: string;
    lastChecked: string;
  }>;
  contentVersion: string;
  reviewStatus: string;
  lastClinicianReview?: string;
}

const claimCategoriesForSection = {
  definition: ["definition"],
  presentation: ["presentation", "epidemiology"],
  evaluation: ["evaluation"],
  management: ["management", "disposition"],
  redFlags: ["safety_boundary", "disposition"],
} as const satisfies Record<string, readonly EvidenceClaim["evidenceCategory"][]>;

function sectionClaimIds(
  claims: readonly EvidenceClaim[],
  categories: readonly EvidenceClaim["evidenceCategory"][],
  fallbackIds: readonly string[],
): string[] {
  const matching = claims
    .filter((claim) => categories.includes(claim.evidenceCategory))
    .map((claim) => claim.id);
  return matching.length > 0 ? matching : [...fallbackIds];
}

/**
 * Returns source and review details only for pilot cases. Callers gate this
 * behind the existing completed-encounter/chart-back behavior.
 */
export function getPilotChartReviewByCaseId(
  caseId: string,
): PilotChartClinicalReview | null {
  const template = PILOT_REGISTRY.encounterTemplates.find(
    (candidate) => candidate.id === caseId,
  );
  if (!template) {
    return null;
  }
  const family = PILOT_REGISTRY.diagnosisFamilies.find(
    (candidate) => candidate.id === template.diagnosisFamilyId,
  );
  const phenotype = PILOT_REGISTRY.phenotypes.find(
    (candidate) => candidate.id === template.phenotypeId,
  );
  if (!family || !phenotype) {
    return null;
  }
  const concepts = PILOT_REGISTRY.concepts.filter((concept) =>
    template.scoredConceptIds.includes(concept.id),
  );
  const relevantClaimIds = unique([
    ...family.evidenceClaimIds,
    ...family.chartBackSummary.evidenceClaimIds,
    ...phenotype.evidenceClaimIds,
    ...template.evidenceClaimIds,
    ...concepts.flatMap((concept) => concept.evidenceClaimIds),
    ...concepts.flatMap((concept) =>
      concept.questionVariants.flatMap(
        (variant) => variant.supportingEvidenceClaimIds,
      ),
    ),
  ]);
  const claims = PILOT_REGISTRY.claims.filter((claim) =>
    relevantClaimIds.includes(claim.id),
  );
  const fallbackIds = family.chartBackSummary.evidenceClaimIds;
  const sections = [
    {
      id: "what-it-is",
      heading: "What it is",
      body: family.chartBackSummary.whatItIs,
      evidenceClaimIds: sectionClaimIds(
        claims,
        claimCategoriesForSection.definition,
        fallbackIds,
      ),
    },
    {
      id: "typical-presentation",
      heading: "Typical presentation",
      body: family.chartBackSummary.typicalPresentation,
      evidenceClaimIds: sectionClaimIds(
        claims,
        claimCategoriesForSection.presentation,
        fallbackIds,
      ),
    },
    {
      id: "initial-evaluation",
      heading: "Initial evaluation",
      body: family.chartBackSummary.initialEvaluation,
      evidenceClaimIds: sectionClaimIds(
        claims,
        claimCategoriesForSection.evaluation,
        fallbackIds,
      ),
    },
    {
      id: "clinic-management",
      heading: "Management in this clinic",
      body: family.chartBackSummary.managementInThisClinic,
      evidenceClaimIds: sectionClaimIds(
        claims,
        claimCategoriesForSection.management,
        fallbackIds,
      ),
    },
    {
      id: "urgent-red-flags",
      heading: "Red flags requiring urgent care",
      body: family.chartBackSummary.redFlagsRequiringUrgentCare,
      evidenceClaimIds: sectionClaimIds(
        claims,
        claimCategoriesForSection.redFlags,
        fallbackIds,
      ),
    },
  ];
  const sources = PILOT_REGISTRY.sources
    .map((source) => {
      const supportedClaimIds = source.evidenceClaimIds.filter((claimId) =>
        relevantClaimIds.includes(claimId),
      );
      if (supportedClaimIds.length === 0) {
        return null;
      }
      return {
        id: source.id,
        title: source.title,
        organizationOrJournal: source.organizationOrJournal,
        year: source.publicationYear,
        href:
          source.officialUrl ??
          `https://doi.org/${encodeURIComponent(source.doi ?? "")}`,
        supportedClaimIds,
        reuseStatus: `${source.licenseLabel} — ${source.reuseStatus}`,
        lastChecked: source.accessedOn,
      };
    })
    .filter((source): source is NonNullable<typeof source> => source !== null);

  return {
    diagnosisId: family.id,
    diagnosisName: family.displayName,
    sections,
    claims: claims.map((claim) => ({
      id: claim.id,
      statement: claim.statement,
      reviewStatus: claim.reviewStatus,
    })),
    sources,
    contentVersion: family.contentVersion,
    reviewStatus: family.reviewStatus,
  };
}
