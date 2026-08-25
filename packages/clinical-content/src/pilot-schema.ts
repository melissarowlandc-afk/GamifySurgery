import type { SyntheticClinicalCase } from "./schema";

export type ReviewStatus =
  | "needs_clinician_review"
  | "changes_requested"
  | "clinically_approved"
  | "archived";

export interface AuthoredClinicalRecord {
  contentVersion: string;
  reviewStatus: ReviewStatus;
  aiAssistedDrafting: boolean;
  lastClinicianReview?: {
    reviewer: string;
    reviewedOn: string;
    contentVersion: string;
  } | null;
}

export interface ClinicalSource extends AuthoredClinicalRecord {
  id: string;
  title: string;
  completeCitation: string;
  organizationOrJournal: string;
  authors: string[];
  publicationYear: number;
  doi: string | null;
  pmid: string | null;
  officialUrl: string | null;
  accessedOn: string;
  sourceClass:
    | "government_guidance"
    | "professional_society_guideline"
    | "peer_reviewed_guideline"
    | "narrative_review"
    | "systematic_review"
    | "observational_study"
    | "randomized_trial"
    | "open_educational_resource"
    | "correction"
    | "bibliographic_metadata";
  licenseLabel: string;
  reuseStatus:
    | "public_domain_conditions_apply"
    | "cc_by_4_0"
    | "cc_by_nc_4_0_restricted"
    | "copyrighted_targeted_verification_only"
    | "metadata_only_rights_reserved";
  reuseNotes: string;
  authorityAssessment: string;
  usageRole: "evidence" | "cross_check" | "both";
  evidenceClaimIds: string[];
}

export interface EvidenceClaim extends AuthoredClinicalRecord {
  id: string;
  statement: string;
  sourceIds: string[];
  evidenceCategory:
    | "definition"
    | "anatomy"
    | "epidemiology"
    | "presentation"
    | "evaluation"
    | "management"
    | "disposition"
    | "safety_boundary";
  certainty: "high" | "moderate" | "low" | "conflicting";
  limitation: string | null;
  applicablePopulation: string;
  lastCheckedOn: string;
}

export interface ChartBackSummary extends AuthoredClinicalRecord {
  whatItIs: string;
  typicalPresentation: string;
  initialEvaluation: string;
  managementInThisClinic: string;
  redFlagsRequiringUrgentCare: string;
  evidenceClaimIds: string[];
}

export interface DiagnosisFamily extends AuthoredClinicalRecord {
  id: string;
  displayName: string;
  synonyms: string[];
  scopeDefinition: string;
  exclusions: string[];
  publicCurriculumTags: string[];
  phenotypeIds: string[];
  conceptIds: string[];
  evidenceClaimIds: string[];
  chartBackSummary: ChartBackSummary;
}

export type AllowedDisposition =
  | "clinic_treatment"
  | "procedural_referral"
  | "prompt_specialty_referral"
  | "outpatient_testing"
  | "elective_surgical_referral"
  | "watchful_waiting_with_safety_net"
  | "emergency_department_transfer";

export interface PresentationPhenotype extends AuthoredClinicalRecord {
  id: string;
  diagnosisFamilyId: string;
  displayName: string;
  presentationSetting: "outpatient_surgical_clinic";
  educationalTier: 0 | 1;
  acuity: "stable" | "urgent_stable" | "obvious_emergency";
  requiredFacilityCapabilityIds: string[];
  allowedDispositions: AllowedDisposition[];
  evidenceSupportedAgeBands: Array<{
    label: string;
    minimumYears: number;
    maximumYears: number;
    basis: "evidence" | "editorial_general_adult";
  }>;
  sexGenerationPolicy: {
    kind: "general_adult_editorial" | "phenotype_eligibility_constraint";
    allowed: Array<"Female" | "Male" | "Not specified">;
    rationale: string;
  };
  bmiGenerationPolicy: {
    kind: "broad_editorial_distribution";
    minimum: number;
    maximum: number;
    rationale: string;
  };
  requiredFindings: string[];
  commonOptionalFindings: string[];
  possibleFindings: string[];
  uncommonFindings: string[];
  excludedFindings: string[];
  redFlags: string[];
  physiologyOverlayIds: string[];
  compatibleResults: string[];
  differentialDiagnoses: string[];
  generationConstraints: string[];
  clinicalProbabilityNotes: string[];
  simulationWeight: {
    value: number;
    rationale: string;
    basis: "editorial";
  };
  comorbidityPolicy: "suppress_meaningful_comorbidities";
  evidenceClaimIds: string[];
  chiefComplaint: string;
  presentationTemplate: string;
}

export interface VitalRange {
  minimum: number;
  maximum: number;
}

export interface PhysiologyOverlay extends AuthoredClinicalRecord {
  id: string;
  displayName: string;
  acuity: PresentationPhenotype["acuity"];
  compatiblePhenotypeIds: string[];
  vitalRanges: {
    heartRateBpm: VitalRange;
    systolicBloodPressureMmHg: VitalRange;
    diastolicBloodPressureMmHg: VitalRange;
    temperatureF: VitalRange;
    oxygenSaturationPercent: VitalRange;
  };
  requiredFindings: string[];
  excludedFindings: string[];
  evidenceClaimIds: string[];
  generationBasis: "editorial_simulation";
}

export interface QuestionAnswer {
  id: string;
  label: string;
  isCorrect: boolean;
  distractorRationale: string | null;
}

export interface QuestionVariant extends AuthoredClinicalRecord {
  id: string;
  conceptId: string;
  stem: string;
  answerChoices: QuestionAnswer[];
  explanation: string;
  supportingEvidenceClaimIds: string[];
}

export interface PilotConcept extends AuthoredClinicalRecord {
  id: string;
  displayName: string;
  learningObjective: string;
  educationalTier: 0 | 1;
  conceptType:
    | "diagnosis"
    | "workup"
    | "management"
    | "disposition"
    | "complication"
    | "applied_science";
  diagnosisFamilyIds: string[];
  phenotypeIds: string[];
  correctAction: string;
  requiredCapabilityIds: string[];
  disposition: AllowedDisposition;
  evidenceClaimIds: string[];
  questionVariants: QuestionVariant[];
}

export interface PilotEncounterTemplate extends AuthoredClinicalRecord {
  id: string;
  displayName: string;
  diagnosisFamilyId: string;
  phenotypeId: string;
  scoredConceptIds: string[];
  /** Facility progression gate, deliberately separate from educational tier. */
  earliestFacilityStage: 0 | 1;
  tutorialEligible: boolean;
  routineEligible: boolean;
  requiredClinicalSetting: "clinic" | "ambulatory_surgery";
  rewardTierId: string;
  evidenceClaimIds: string[];
}

export interface PilotRegistry {
  contentVersion: string;
  sources: ClinicalSource[];
  claims: EvidenceClaim[];
  physiologyOverlays: PhysiologyOverlay[];
  diagnosisFamilies: DiagnosisFamily[];
  phenotypes: PresentationPhenotype[];
  concepts: PilotConcept[];
  encounterTemplates: PilotEncounterTemplate[];
}

export interface GeneratedPilotPatient {
  ageYears: number;
  sexLabel: "Female" | "Male" | "Not specified";
  bmi: number;
  comorbidities: [];
  physiologyOverlayId: string;
  vitalSigns: NonNullable<SyntheticClinicalCase["prototypeVitalSigns"]>;
  findings: string[];
}

export interface MaterializedPilotEncounter {
  clinicalCase: SyntheticClinicalCase;
  diagnosisFamily: DiagnosisFamily;
  phenotype: PresentationPhenotype;
  generatedPatient: GeneratedPilotPatient;
  selectedQuestionVariantIds: string[];
}

const STABLE_ID = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Invalid pilot registry: ${message}`);
  }
}

function assertUniqueIds<T extends { id: string }>(
  records: readonly T[],
  label: string,
): void {
  const ids = new Set<string>();
  for (const record of records) {
    assert(STABLE_ID.test(record.id), `${label} ${record.id} has an invalid ID.`);
    assert(!ids.has(record.id), `duplicate ${label} ID ${record.id}.`);
    ids.add(record.id);
  }
}

function sameMembers(left: readonly string[], right: readonly string[]): boolean {
  return (
    left.length === right.length &&
    left.every((value) => right.includes(value))
  );
}

export function validatePilotRegistry(candidate: PilotRegistry): PilotRegistry {
  assert(candidate.contentVersion.length > 0, "contentVersion is required.");
  assertUniqueIds(candidate.sources, "source");
  assertUniqueIds(candidate.claims, "claim");
  assertUniqueIds(candidate.physiologyOverlays, "physiology overlay");
  assertUniqueIds(candidate.diagnosisFamilies, "diagnosis family");
  assertUniqueIds(candidate.phenotypes, "phenotype");
  assertUniqueIds(candidate.concepts, "concept");
  assertUniqueIds(candidate.encounterTemplates, "encounter template");
  assert(
    candidate.diagnosisFamilies.length === 5,
    "the pilot must contain exactly five diagnosis families.",
  );

  const authoredRecords: AuthoredClinicalRecord[] = [
    ...candidate.sources,
    ...candidate.claims,
    ...candidate.physiologyOverlays,
    ...candidate.diagnosisFamilies,
    ...candidate.diagnosisFamilies.map((family) => family.chartBackSummary),
    ...candidate.phenotypes,
    ...candidate.concepts,
    ...candidate.concepts.flatMap((concept) => concept.questionVariants),
    ...candidate.encounterTemplates,
  ];
  for (const record of authoredRecords) {
    assert(
      record.contentVersion === candidate.contentVersion,
      "every pilot record must use the registry content version.",
    );
    assert(
      record.reviewStatus === "needs_clinician_review",
      "unapproved pilot records must remain needs_clinician_review.",
    );
    assert(
      record.aiAssistedDrafting,
      "pilot records must disclose AI-assisted drafting.",
    );
    assert(
      record.lastClinicianReview == null,
      "the pilot must not claim a clinician review that has not occurred.",
    );
  }

  const sourceById = new Map(candidate.sources.map((source) => [source.id, source]));
  const claimById = new Map(candidate.claims.map((claim) => [claim.id, claim]));
  const phenotypeById = new Map(
    candidate.phenotypes.map((phenotype) => [phenotype.id, phenotype]),
  );
  const overlayById = new Map(
    candidate.physiologyOverlays.map((overlay) => [overlay.id, overlay]),
  );
  const familyById = new Map(
    candidate.diagnosisFamilies.map((family) => [family.id, family]),
  );
  const conceptById = new Map(
    candidate.concepts.map((concept) => [concept.id, concept]),
  );

  for (const source of candidate.sources) {
    assert(
      source.officialUrl !== null || source.doi !== null,
      `source ${source.id} needs an official URL or DOI.`,
    );
    if (source.officialUrl !== null) {
      assert(
        /^https:\/\//.test(source.officialUrl),
        `source ${source.id} official URL must use HTTPS.`,
      );
    }
    if (source.doi !== null) {
      assert(/^10\.\d{4,9}\//.test(source.doi), `source ${source.id} DOI is invalid.`);
    }
    assert(DATE.test(source.accessedOn), `source ${source.id} access date is invalid.`);
    assert(source.reuseNotes.trim().length > 0, `source ${source.id} lacks reuse notes.`);
    for (const claimId of source.evidenceClaimIds) {
      assert(claimById.has(claimId), `source ${source.id} links unknown claim ${claimId}.`);
    }
  }

  for (const claim of candidate.claims) {
    assert(claim.statement.trim().length > 0, `claim ${claim.id} is empty.`);
    assert(claim.sourceIds.length > 0, `claim ${claim.id} has no source.`);
    assert(DATE.test(claim.lastCheckedOn), `claim ${claim.id} check date is invalid.`);
    for (const sourceId of claim.sourceIds) {
      const source = sourceById.get(sourceId);
      assert(source, `claim ${claim.id} links unknown source ${sourceId}.`);
      assert(
        source.evidenceClaimIds.includes(claim.id),
        `claim ${claim.id} is missing from source ${sourceId}'s reverse links.`,
      );
    }
  }

  for (const family of candidate.diagnosisFamilies) {
    const familyPhenotypes = candidate.phenotypes.filter(
      (phenotype) => phenotype.diagnosisFamilyId === family.id,
    );
    assert(
      familyPhenotypes.some((phenotype) => phenotype.educationalTier === 0),
      `family ${family.id} lacks a Level 0 phenotype.`,
    );
    assert(
      familyPhenotypes.some((phenotype) => phenotype.educationalTier === 1),
      `family ${family.id} lacks a Level 1 phenotype.`,
    );
    for (const phenotypeId of family.phenotypeIds) {
      const phenotype = phenotypeById.get(phenotypeId);
      assert(phenotype, `family ${family.id} links unknown phenotype ${phenotypeId}.`);
      assert(
        phenotype.diagnosisFamilyId === family.id,
        `phenotype ${phenotypeId} belongs to another family.`,
      );
    }
    for (const conceptId of family.conceptIds) {
      const concept = conceptById.get(conceptId);
      assert(concept, `family ${family.id} links unknown concept ${conceptId}.`);
      assert(
        concept.diagnosisFamilyIds.includes(family.id),
        `concept ${conceptId} is missing family ${family.id}.`,
      );
    }
    const summary = family.chartBackSummary;
    assert(
      [
        summary.whatItIs,
        summary.typicalPresentation,
        summary.initialEvaluation,
        summary.managementInThisClinic,
        summary.redFlagsRequiringUrgentCare,
      ].every((section) => section.trim().length > 0),
      `family ${family.id} has an incomplete chart-back summary.`,
    );
    for (const claimId of [
      ...family.evidenceClaimIds,
      ...summary.evidenceClaimIds,
    ]) {
      assert(claimById.has(claimId), `family ${family.id} links unknown claim ${claimId}.`);
    }
  }

  for (const phenotype of candidate.phenotypes) {
    assert(
      familyById.has(phenotype.diagnosisFamilyId),
      `phenotype ${phenotype.id} links an unknown family.`,
    );
    assert(
      phenotype.comorbidityPolicy === "suppress_meaningful_comorbidities",
      `phenotype ${phenotype.id} must suppress meaningful comorbidities.`,
    );
    assert(
      phenotype.simulationWeight.value > 0,
      `phenotype ${phenotype.id} needs a positive editorial simulation weight.`,
    );
    assert(
      phenotype.bmiGenerationPolicy.minimum < phenotype.bmiGenerationPolicy.maximum,
      `phenotype ${phenotype.id} has an invalid BMI range.`,
    );
    const excluded = new Set(phenotype.excludedFindings);
    for (const required of phenotype.requiredFindings) {
      assert(
        !excluded.has(required),
        `phenotype ${phenotype.id} both requires and excludes "${required}".`,
      );
    }
    for (const overlayId of phenotype.physiologyOverlayIds) {
      const overlay = overlayById.get(overlayId);
      assert(overlay, `phenotype ${phenotype.id} links unknown overlay ${overlayId}.`);
      assert(
        overlay.compatiblePhenotypeIds.includes(phenotype.id),
        `overlay ${overlayId} does not reciprocally link phenotype ${phenotype.id}.`,
      );
    }
    for (const claimId of phenotype.evidenceClaimIds) {
      assert(claimById.has(claimId), `phenotype ${phenotype.id} links unknown claim.`);
    }
  }

  for (const overlay of candidate.physiologyOverlays) {
    assert(
      overlay.evidenceClaimIds.length > 0,
      `overlay ${overlay.id} needs evidence claims for its exact vital ranges.`,
    );
    for (const [name, range] of Object.entries(overlay.vitalRanges)) {
      assert(range.minimum <= range.maximum, `overlay ${overlay.id} has invalid ${name}.`);
    }
    for (const claimId of overlay.evidenceClaimIds) {
      assert(
        claimById.has(claimId),
        `overlay ${overlay.id} links unknown claim ${claimId}.`,
      );
    }
    for (const phenotypeId of overlay.compatiblePhenotypeIds) {
      assert(
        phenotypeById.has(phenotypeId),
        `overlay ${overlay.id} links unknown phenotype ${phenotypeId}.`,
      );
    }
  }

  for (const concept of candidate.concepts) {
    assert(
      concept.questionVariants.length >= 2,
      `concept ${concept.id} needs at least two variants.`,
    );
    for (const familyId of concept.diagnosisFamilyIds) {
      assert(familyById.has(familyId), `concept ${concept.id} links unknown family.`);
    }
    for (const phenotypeId of concept.phenotypeIds) {
      const phenotype = phenotypeById.get(phenotypeId);
      assert(phenotype, `concept ${concept.id} links unknown phenotype.`);
      assert(
        phenotype.educationalTier === concept.educationalTier,
        `concept ${concept.id} tier differs from phenotype ${phenotypeId}.`,
      );
    }
    const firstVariant = concept.questionVariants[0]!;
    const choiceIds = firstVariant.answerChoices.map((choice) => choice.id);
    const correctChoiceIds = firstVariant.answerChoices
      .filter((choice) => choice.isCorrect)
      .map((choice) => choice.id);
    assert(correctChoiceIds.length === 1, `concept ${concept.id} needs one correct answer.`);
    assertUniqueIds(concept.questionVariants, `question variant for ${concept.id}`);
    for (const variant of concept.questionVariants) {
      assert(variant.conceptId === concept.id, `variant ${variant.id} concept mismatch.`);
      assert(
        variant.answerChoices.filter((choice) => choice.isCorrect).length === 1,
        `variant ${variant.id} must have exactly one correct answer.`,
      );
      assert(
        sameMembers(choiceIds, variant.answerChoices.map((choice) => choice.id)),
        `variants for ${concept.id} must use the same choice IDs.`,
      );
      assert(
        variant.answerChoices.find((choice) => choice.isCorrect)?.id ===
          correctChoiceIds[0],
        `variants for ${concept.id} must preserve the correct choice ID.`,
      );
      for (const answer of variant.answerChoices) {
        assert(
          answer.isCorrect || Boolean(answer.distractorRationale?.trim()),
          `wrong choice ${answer.id} needs a distractor rationale.`,
        );
      }
      for (const claimId of variant.supportingEvidenceClaimIds) {
        assert(claimById.has(claimId), `variant ${variant.id} links unknown claim.`);
      }
    }
  }

  for (const template of candidate.encounterTemplates) {
    const family = familyById.get(template.diagnosisFamilyId);
    const phenotype = phenotypeById.get(template.phenotypeId);
    assert(family, `template ${template.id} links unknown family.`);
    assert(phenotype, `template ${template.id} links unknown phenotype.`);
    assert(
      phenotype.diagnosisFamilyId === family.id,
      `template ${template.id} family/phenotype mismatch.`,
    );
    assert(
      template.scoredConceptIds.length >= 1 &&
        template.scoredConceptIds.length <= 2,
      `template ${template.id} must contain one or two scored decisions.`,
    );
    if (phenotype.educationalTier === 0) {
      assert(
        template.scoredConceptIds.length === 1,
        `Level 0 template ${template.id} must have exactly one scored decision.`,
      );
    }
    if (template.tutorialEligible) {
      assert(
        template.earliestFacilityStage === 0,
        `tutorial template ${template.id} must be available at facility Level 0.`,
      );
    }
    for (const conceptId of template.scoredConceptIds) {
      const concept = conceptById.get(conceptId);
      assert(concept, `template ${template.id} links unknown concept ${conceptId}.`);
      assert(
        concept.phenotypeIds.includes(phenotype.id),
        `concept ${conceptId} is not applicable to template phenotype ${phenotype.id}.`,
      );
    }
  }

  return candidate;
}
