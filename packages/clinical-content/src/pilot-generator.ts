import type { SyntheticClinicalCase } from "./schema";
import type {
  ClinicalSource,
  EvidenceClaim,
  MaterializedPilotEncounter,
  PhysiologyOverlay,
  PilotConcept,
  PilotEncounterTemplate,
  PilotRegistry,
  PresentationPhenotype,
  QuestionVariant,
  VitalRange,
} from "./pilot-schema";

const PILOT_GENERATOR_VERSION = "pilot-generator.local-prng.v1";

export interface MaterializePilotOptions {
  forcedQuestionVariantIdsByConceptId?: Readonly<Record<string, string>>;
  forcedPhysiologyOverlayId?: string;
  patientDisplayName?: string;
}

interface LocalRandom {
  integer(exclusiveMaximum: number): number;
}

function assertPresent<T>(
  value: T | null | undefined,
  message: string,
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`Cannot materialize pilot encounter: ${message}`);
  }
}

/**
 * Small project-local hash used only by the clinical pilot materializer.
 *
 * This intentionally does not import or share state with the simulation's
 * versioned gameplay random-number contract.
 */
function hashText(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function createLocalRandom(
  seed: string,
  templateId: string,
  purpose: string,
): LocalRandom {
  let state = hashText(
    [PILOT_GENERATOR_VERSION, seed, templateId, purpose].join("\u001f"),
  );
  if (state === 0) {
    state = 0x9e3779b9;
  }

  const nextUint32 = (): number => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return state >>> 0;
  };

  return {
    integer(exclusiveMaximum: number): number {
      if (
        !Number.isSafeInteger(exclusiveMaximum) ||
        exclusiveMaximum <= 0 ||
        exclusiveMaximum > 0x1_0000_0000
      ) {
        throw new Error(
          "Cannot materialize pilot encounter: invalid deterministic draw range.",
        );
      }
      const fullRange = 0x1_0000_0000;
      const acceptanceLimit =
        Math.floor(fullRange / exclusiveMaximum) * exclusiveMaximum;
      let draw = nextUint32();
      while (draw >= acceptanceLimit) {
        draw = nextUint32();
      }
      return draw % exclusiveMaximum;
    },
  };
}

function pick<T>(
  values: readonly T[],
  random: LocalRandom,
  label: string,
): T {
  if (values.length === 0) {
    throw new Error(
      `Cannot materialize pilot encounter: ${label} has no eligible values.`,
    );
  }
  return values[random.integer(values.length)]!;
}

function drawInteger(
  range: VitalRange,
  random: LocalRandom,
  label: string,
): number {
  const minimum = Math.ceil(range.minimum);
  const maximum = Math.floor(range.maximum);
  if (minimum > maximum) {
    throw new Error(
      `Cannot materialize pilot encounter: ${label} has no integer value in its range.`,
    );
  }
  return minimum + random.integer(maximum - minimum + 1);
}

function drawOneDecimal(
  range: VitalRange,
  random: LocalRandom,
  label: string,
): number {
  const minimum = Math.ceil(range.minimum * 10);
  const maximum = Math.floor(range.maximum * 10);
  if (minimum > maximum) {
    throw new Error(
      `Cannot materialize pilot encounter: ${label} has no tenth-unit value in its range.`,
    );
  }
  return (minimum + random.integer(maximum - minimum + 1)) / 10;
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function humanList(values: readonly string[]): string {
  if (values.length === 0) {
    return "";
  }
  if (values.length === 1) {
    return values[0]!;
  }
  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }
  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

function ensureSentence(value: string): string {
  const trimmed = value.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function sourceLabel(source: ClinicalSource): string {
  const locator =
    source.doi !== null
      ? `doi:${source.doi}`
      : source.officialUrl ?? source.id;
  const label = `${source.title} (${source.organizationOrJournal}, ${source.publicationYear}; ${locator})`;
  return label.length <= 240 ? label : `${label.slice(0, 237)}...`;
}

function sourcesForClaimIds(
  registry: PilotRegistry,
  claimIds: readonly string[],
): ClinicalSource[] {
  const claims = new Map<string, EvidenceClaim>(
    registry.claims.map((claim) => [claim.id, claim]),
  );
  const sources = new Map<string, ClinicalSource>(
    registry.sources.map((source) => [source.id, source]),
  );
  const sourceIds = unique(
    claimIds.flatMap((claimId) => {
      const claim = claims.get(claimId);
      assertPresent(claim, `unknown evidence claim ${claimId}.`);
      return claim.sourceIds;
    }),
  );
  return sourceIds.map((sourceId) => {
    const source = sources.get(sourceId);
    assertPresent(source, `unknown clinical source ${sourceId}.`);
    return source;
  });
}

function sourceLabelsForClaimIds(
  registry: PilotRegistry,
  claimIds: readonly string[],
): string[] {
  const labels = sourcesForClaimIds(registry, unique(claimIds)).map(sourceLabel);
  return labels.length > 0
    ? labels
    : ["AI-assisted pilot draft; needs clinician review"];
}

function selectOverlay(
  registry: PilotRegistry,
  template: PilotEncounterTemplate,
  phenotype: PresentationPhenotype,
  seed: string,
  forcedOverlayId: string | undefined,
): PhysiologyOverlay {
  const overlaysById = new Map(
    registry.physiologyOverlays.map((overlay) => [overlay.id, overlay]),
  );
  const eligible = phenotype.physiologyOverlayIds.map((overlayId) => {
    const overlay = overlaysById.get(overlayId);
    assertPresent(
      overlay,
      `phenotype ${phenotype.id} references unknown physiology overlay ${overlayId}.`,
    );
    if (!overlay.compatiblePhenotypeIds.includes(phenotype.id)) {
      throw new Error(
        `Cannot materialize pilot encounter: overlay ${overlay.id} is not compatible with phenotype ${phenotype.id}.`,
      );
    }
    return overlay;
  });

  if (forcedOverlayId !== undefined) {
    const forced = eligible.find((overlay) => overlay.id === forcedOverlayId);
    assertPresent(
      forced,
      `forced physiology overlay ${forcedOverlayId} is not eligible for template ${template.id}.`,
    );
    return forced;
  }

  return pick(
    eligible,
    createLocalRandom(seed, template.id, "physiology-overlay"),
    `phenotype ${phenotype.id} physiology overlays`,
  );
}

function generateAge(
  phenotype: PresentationPhenotype,
  template: PilotEncounterTemplate,
  seed: string,
): number {
  const adultBands = phenotype.evidenceSupportedAgeBands.flatMap((band) => {
    const minimum = Math.max(18, Math.ceil(band.minimumYears));
    const maximum = Math.min(120, Math.floor(band.maximumYears));
    return minimum <= maximum ? [{ minimum, maximum }] : [];
  });
  const band = pick(
    adultBands,
    createLocalRandom(seed, template.id, "age-band"),
    `phenotype ${phenotype.id} adult age bands`,
  );
  return (
    band.minimum +
    createLocalRandom(seed, template.id, "age-value").integer(
      band.maximum - band.minimum + 1,
    )
  );
}

function generateSex(
  phenotype: PresentationPhenotype,
  template: PilotEncounterTemplate,
  seed: string,
): "Female" | "Male" | "Not specified" {
  return pick(
    phenotype.sexGenerationPolicy.allowed,
    createLocalRandom(seed, template.id, "sex"),
    `phenotype ${phenotype.id} allowed sex labels`,
  );
}

function generateBmi(
  phenotype: PresentationPhenotype,
  template: PilotEncounterTemplate,
  seed: string,
): number {
  return drawOneDecimal(
    {
      minimum: phenotype.bmiGenerationPolicy.minimum,
      maximum: phenotype.bmiGenerationPolicy.maximum,
    },
    createLocalRandom(seed, template.id, "bmi"),
    `phenotype ${phenotype.id} BMI policy`,
  );
}

function generateVitals(
  overlay: PhysiologyOverlay,
  template: PilotEncounterTemplate,
  seed: string,
): NonNullable<SyntheticClinicalCase["prototypeVitalSigns"]> {
  const systolic = drawInteger(
    overlay.vitalRanges.systolicBloodPressureMmHg,
    createLocalRandom(seed, template.id, "vital-systolic-pressure"),
    `${overlay.id} systolic blood pressure`,
  );
  const diastolic = drawInteger(
    overlay.vitalRanges.diastolicBloodPressureMmHg,
    createLocalRandom(seed, template.id, "vital-diastolic-pressure"),
    `${overlay.id} diastolic blood pressure`,
  );
  if (diastolic >= systolic) {
    throw new Error(
      `Physiology overlay ${overlay.id} cannot generate a valid paired blood pressure.`,
    );
  }
  return {
    heartRateBpm: drawInteger(
      overlay.vitalRanges.heartRateBpm,
      createLocalRandom(seed, template.id, "vital-heart-rate"),
      `${overlay.id} heart rate`,
    ),
    systolicBloodPressureMmHg: systolic,
    diastolicBloodPressureMmHg: diastolic,
    temperatureF: drawOneDecimal(
      overlay.vitalRanges.temperatureF,
      createLocalRandom(seed, template.id, "vital-temperature"),
      `${overlay.id} temperature`,
    ),
    oxygenSaturationPercent: drawInteger(
      overlay.vitalRanges.oxygenSaturationPercent,
      createLocalRandom(seed, template.id, "vital-oxygen"),
      `${overlay.id} oxygen saturation`,
    ),
  };
}

/**
 * The authoring categories are qualitative evidence labels, not numerical
 * symptom frequencies. For presentation variety, deterministically select one
 * available qualitative category and then one detail within it. This is an
 * editorial seed choice, not a claim that categories have numeric rates.
 */
function selectQualitativeOptionalFinding(
  phenotype: PresentationPhenotype,
  template: PilotEncounterTemplate,
  seed: string,
  excluded: ReadonlySet<string>,
  required: readonly string[],
): string[] {
  const groups = [
    {
      category: "common",
      values: phenotype.commonOptionalFindings,
    },
    {
      category: "possible",
      values: phenotype.possibleFindings,
    },
    {
      category: "uncommon",
      values: phenotype.uncommonFindings,
    },
  ] as const;
  const availableGroups = groups
    .map(({ category, values }) => ({
      category,
      values: values.filter(
        (finding) => !excluded.has(finding) && !required.includes(finding),
      ),
    }))
    .filter(({ values }) => values.length > 0);
  if (availableGroups.length === 0) {
    return [];
  }
  const selectedGroup = pick(
    availableGroups,
    createLocalRandom(seed, template.id, "finding-category"),
    `${phenotype.id} optional-finding categories`,
  );
  return [
    pick(
      selectedGroup.values,
      createLocalRandom(
        seed,
        template.id,
        `finding:${selectedGroup.category}`,
      ),
      `${phenotype.id} ${selectedGroup.category} optional findings`,
    ),
  ];
}

function generateFindings(
  phenotype: PresentationPhenotype,
  overlay: PhysiologyOverlay,
  template: PilotEncounterTemplate,
  seed: string,
): string[] {
  const excluded = new Set([
    ...phenotype.excludedFindings,
    ...overlay.excludedFindings,
  ]);
  const required = unique([
    ...phenotype.requiredFindings,
    ...overlay.requiredFindings,
  ]);
  const incompatibleRequired = required.find((finding) =>
    excluded.has(finding),
  );
  if (incompatibleRequired !== undefined) {
    throw new Error(
      `Cannot materialize pilot encounter: required finding "${incompatibleRequired}" is excluded by phenotype ${phenotype.id} or overlay ${overlay.id}.`,
    );
  }

  const optional = selectQualitativeOptionalFinding(
    phenotype,
    template,
    seed,
    excluded,
    required,
  );
  return unique([...required, ...optional]);
}

function renderPresentation(
  phenotype: PresentationPhenotype,
  ageYears: number,
  sexLabel: "Female" | "Male" | "Not specified",
  bmi: number,
  findings: readonly string[],
): string {
  const findingsText = humanList(findings);
  const sexDescription =
    sexLabel === "Female"
      ? "woman"
      : sexLabel === "Male"
        ? "man"
        : "adult";
  let presentation = phenotype.presentationTemplate
    .replaceAll("{ageYears}", String(ageYears))
    .replaceAll("{sexLabel} adult", sexDescription)
    .replaceAll("{sexLabel}", sexLabel)
    .replaceAll("{bmi}", bmi.toFixed(1));
  if (presentation.includes("{findings}")) {
    presentation = presentation.replaceAll("{findings}", findingsText);
    return ensureSentence(presentation);
  }
  const base = ensureSentence(presentation);
  return findings.length === 0
    ? base
    : `${base} Documented findings include ${findingsText}.`;
}

function selectQuestionVariant(
  concept: PilotConcept,
  template: PilotEncounterTemplate,
  seed: string,
  forcedVariantId: string | undefined,
): QuestionVariant {
  if (forcedVariantId !== undefined) {
    const forced = concept.questionVariants.find(
      (variant) => variant.id === forcedVariantId,
    );
    assertPresent(
      forced,
      `forced question variant ${forcedVariantId} does not belong to concept ${concept.id}.`,
    );
    return forced;
  }
  return pick(
    concept.questionVariants,
    createLocalRandom(seed, template.id, `question-variant:${concept.id}`),
    `concept ${concept.id} question variants`,
  );
}

function materializeDecisionNodes(
  registry: PilotRegistry,
  template: PilotEncounterTemplate,
  phenotype: PresentationPhenotype,
  seed: string,
  options: MaterializePilotOptions,
): {
  nodes: SyntheticClinicalCase["decisionNodes"];
  concepts: PilotConcept[];
  variants: QuestionVariant[];
} {
  const conceptById = new Map(
    registry.concepts.map((concept) => [concept.id, concept]),
  );
  const forcedByConcept =
    options.forcedQuestionVariantIdsByConceptId ?? {};
  for (const forcedConceptId of Object.keys(forcedByConcept)) {
    if (!template.scoredConceptIds.includes(forcedConceptId)) {
      throw new Error(
        `Cannot materialize pilot encounter: forced concept ${forcedConceptId} is not scored by template ${template.id}.`,
      );
    }
  }

  const concepts = template.scoredConceptIds.map((conceptId) => {
    const concept = conceptById.get(conceptId);
    assertPresent(
      concept,
      `template ${template.id} references unknown concept ${conceptId}.`,
    );
    if (!concept.phenotypeIds.includes(phenotype.id)) {
      throw new Error(
        `Cannot materialize pilot encounter: concept ${concept.id} is not compatible with phenotype ${phenotype.id}.`,
      );
    }
    return concept;
  });
  const variants = concepts.map((concept) =>
    selectQuestionVariant(
      concept,
      template,
      seed,
      forcedByConcept[concept.id],
    ),
  );
  const nodes = variants.map((variant, index) => {
    const concept = concepts[index]!;
    const isFinal = index === variants.length - 1;
    const claimIds = unique([
      ...concept.evidenceClaimIds,
      ...variant.supportingEvidenceClaimIds,
    ]);
    if (claimIds.length === 0) {
      throw new Error(
        `Cannot materialize pilot encounter: concept ${concept.id} and variant ${variant.id} have no supporting evidence claim.`,
      );
    }
    const nodeSourceLabels = sourceLabelsForClaimIds(registry, claimIds);
    return {
      id: `node.${template.id}.${index + 1}`,
      questionVariantId: variant.id,
      primaryConceptId: concept.id,
      stem: variant.stem,
      answerChoices: variant.answerChoices.map((choice) => ({
        id: choice.id,
        label: choice.label,
        isCorrect: choice.isCorrect,
        serviceRequest: null,
      })),
      shuffleAnswers: true,
      explanation: variant.explanation,
      sourceLabels: nodeSourceLabels,
      resultGateAfter: null,
      terminalDispositions: isFinal
        ? variant.answerChoices.flatMap((choice) => {
            if (choice.isCorrect) {
              return [];
            }
            const rationale = choice.distractorRationale?.trim();
            assertPresent(
              rationale,
              `wrong answer ${choice.id} lacks a distractor rationale.`,
            );
            return [
              {
                answerChoiceId: choice.id,
                kind: "no_terminal_outcome" as const,
                consequenceNarrative: rationale,
                clinicalRationale: rationale,
                sourceLabels: claimIds.map(
                  (claimId) => `Evidence claim: ${claimId}`,
                ),
              },
            ];
          })
        : [],
    };
  });
  return { nodes, concepts, variants };
}

function chartBackText(
  family: MaterializedPilotEncounter["diagnosisFamily"],
): string {
  const summary = family.chartBackSummary;
  return [
    `What it is: ${ensureSentence(summary.whatItIs)}`,
    `Typical presentation: ${ensureSentence(summary.typicalPresentation)}`,
    `Initial evaluation: ${ensureSentence(summary.initialEvaluation)}`,
    `Management in this clinic: ${ensureSentence(summary.managementInThisClinic)}`,
    `Red flags requiring urgent care: ${ensureSentence(summary.redFlagsRequiringUrgentCare)}`,
  ].join(" ");
}

export function getPilotTemplateByCaseId(
  registry: PilotRegistry,
  caseId: string,
): PilotEncounterTemplate | null {
  return (
    registry.encounterTemplates.find((template) => template.id === caseId) ??
    null
  );
}

export function isPilotTemplateCapabilityEligible(
  registry: PilotRegistry,
  templateId: string,
  availableCapabilityIds: ReadonlySet<string> | readonly string[],
): boolean {
  const template = getPilotTemplateByCaseId(registry, templateId);
  if (template === null) {
    return false;
  }
  const phenotype = registry.phenotypes.find(
    (candidate) => candidate.id === template.phenotypeId,
  );
  if (!phenotype) {
    return false;
  }
  const conceptById = new Map(
    registry.concepts.map((concept) => [concept.id, concept]),
  );
  const required = unique([
    ...phenotype.requiredFacilityCapabilityIds,
    ...template.scoredConceptIds.flatMap(
      (conceptId) => conceptById.get(conceptId)?.requiredCapabilityIds ?? [],
    ),
  ]);
  const available =
    availableCapabilityIds instanceof Set
      ? availableCapabilityIds
      : new Set(availableCapabilityIds);
  return required.every((capabilityId) => available.has(capabilityId));
}

export function materializePilotEncounter(
  registry: PilotRegistry,
  templateId: string,
  seed: string,
  options: MaterializePilotOptions = {},
): MaterializedPilotEncounter {
  if (!seed.trim()) {
    throw new Error(
      "Cannot materialize pilot encounter: deterministic seed is required.",
    );
  }
  const template = getPilotTemplateByCaseId(registry, templateId);
  assertPresent(template, `unknown encounter template ${templateId}.`);
  const family = registry.diagnosisFamilies.find(
    (candidate) => candidate.id === template.diagnosisFamilyId,
  );
  assertPresent(
    family,
    `template ${template.id} references unknown diagnosis family ${template.diagnosisFamilyId}.`,
  );
  const phenotype = registry.phenotypes.find(
    (candidate) => candidate.id === template.phenotypeId,
  );
  assertPresent(
    phenotype,
    `template ${template.id} references unknown phenotype ${template.phenotypeId}.`,
  );
  if (phenotype.diagnosisFamilyId !== family.id) {
    throw new Error(
      `Cannot materialize pilot encounter: template ${template.id} family and phenotype do not match.`,
    );
  }

  const overlay = selectOverlay(
    registry,
    template,
    phenotype,
    seed,
    options.forcedPhysiologyOverlayId,
  );
  const ageYears = generateAge(phenotype, template, seed);
  const sexLabel = generateSex(phenotype, template, seed);
  const bmi = generateBmi(phenotype, template, seed);
  const findings = generateFindings(phenotype, overlay, template, seed);
  const vitalSigns = generateVitals(overlay, template, seed);
  const { nodes, concepts, variants } = materializeDecisionNodes(
    registry,
    template,
    phenotype,
    seed,
    options,
  );
  const allClaimIds = unique([
    ...family.evidenceClaimIds,
    ...family.chartBackSummary.evidenceClaimIds,
    ...phenotype.evidenceClaimIds,
    ...overlay.evidenceClaimIds,
    ...template.evidenceClaimIds,
    ...concepts.flatMap((concept) => concept.evidenceClaimIds),
    ...variants.flatMap((variant) => variant.supportingEvidenceClaimIds),
  ]);
  const requiredCapabilityIds = unique([
    ...phenotype.requiredFacilityCapabilityIds,
    ...concepts.flatMap((concept) => concept.requiredCapabilityIds),
  ]);

  const clinicalCase: SyntheticClinicalCase = {
    id: template.id,
    displayName: template.displayName,
    patientPresentationVariantId: phenotype.id,
    patientDisplayName:
      options.patientDisplayName?.trim() || "Pilot Preview Patient",
    prototypeDemographics: {
      ageYears,
      sexLabel,
    },
    prototypeVitalSigns: vitalSigns,
    chiefComplaint: phenotype.chiefComplaint,
    presentation: renderPresentation(
      phenotype,
      ageYears,
      sexLabel,
      bmi,
      findings,
    ),
    tutorialEligible: template.tutorialEligible,
    routineEligible: template.routineEligible,
    earliestFacilityStage: template.earliestFacilityStage,
    requiredClinicalSetting: template.requiredClinicalSetting,
    requiredCapabilityIds,
    rewardTierId: template.rewardTierId,
    sourceLabels: sourceLabelsForClaimIds(registry, allClaimIds),
    decisionNodes: nodes,
    learningSummary: chartBackText(family),
  };

  return {
    clinicalCase,
    diagnosisFamily: family,
    phenotype,
    generatedPatient: {
      ageYears,
      sexLabel,
      bmi,
      comorbidities: [],
      physiologyOverlayId: overlay.id,
      vitalSigns,
      findings,
    },
    selectedQuestionVariantIds: variants.map((variant) => variant.id),
  };
}

export function materializePilotCase(
  registry: PilotRegistry,
  templateId: string,
  seed: string,
  options: MaterializePilotOptions = {},
): SyntheticClinicalCase {
  return materializePilotEncounter(registry, templateId, seed, options)
    .clinicalCase;
}
