import { describe, expect, it } from "vitest";
import {
  getPilotChartReviewByCaseId,
  PILOT_CLINICAL_RELEASE,
  PILOT_REGISTRY,
} from "./pilot-content";
import { materializePilotEncounter } from "./pilot-generator";

const PILOT_FAMILY_IDS = [
  "traumatic_laceration",
  "cutaneous_abscess",
  "symptomatic_cholelithiasis",
  "inguinal_hernia",
  "acute_appendicitis",
] as const;

function generatedForEveryTemplate(seed = "pilot-test-seed") {
  return PILOT_REGISTRY.encounterTemplates.map((template) =>
    materializePilotEncounter(PILOT_REGISTRY, template.id, seed),
  );
}

describe("five-diagnosis pilot registry", () => {
  it("does not make the keyed answer uniquely longest in the runtime release", () => {
    const seenQuestionVariantIds = new Set<string>();
    const violations = PILOT_CLINICAL_RELEASE.cases.flatMap((clinicalCase) =>
      clinicalCase.decisionNodes.flatMap((node) => {
        if (seenQuestionVariantIds.has(node.questionVariantId)) {
          return [];
        }
        seenQuestionVariantIds.add(node.questionVariantId);
        const correct = node.answerChoices.find((choice) => choice.isCorrect);
        const longestDistractor = Math.max(
          ...node.answerChoices
            .filter((choice) => !choice.isCorrect)
            .map((choice) => choice.label.length),
        );
        return correct && correct.label.length > longestDistractor
          ? [
              {
                questionVariantId: node.questionVariantId,
                correctLength: correct.label.length,
                longestDistractor,
              },
            ]
          : [];
      }),
    );

    expect(violations).toEqual([]);
  });

  it("contains exactly the five requested families with Level 0 and Level 1 phenotypes", () => {
    expect(
      PILOT_REGISTRY.diagnosisFamilies.map((family) => family.id).sort(),
    ).toEqual([...PILOT_FAMILY_IDS].sort());

    for (const family of PILOT_REGISTRY.diagnosisFamilies) {
      const tiers = PILOT_REGISTRY.phenotypes
        .filter((phenotype) => phenotype.diagnosisFamilyId === family.id)
        .map((phenotype) => phenotype.educationalTier);
      expect(tiers).toContain(0);
      expect(tiers).toContain(1);
    }
  });

  it("provides at least three concepts and two independently identified variants per family", () => {
    expect(PILOT_REGISTRY.concepts).toHaveLength(15);
    for (const family of PILOT_REGISTRY.diagnosisFamilies) {
      const concepts = PILOT_REGISTRY.concepts.filter((concept) =>
        concept.diagnosisFamilyIds.includes(family.id),
      );
      expect(concepts.length).toBeGreaterThanOrEqual(3);
      for (const concept of concepts) {
        expect(concept.questionVariants.length).toBeGreaterThanOrEqual(2);
        expect(
          new Set(concept.questionVariants.map((variant) => variant.stem)).size,
        ).toBe(concept.questionVariants.length);
      }
    }
  });

  it("projects exactly one primary concept per decision and respects tier decision limits", () => {
    for (const template of PILOT_REGISTRY.encounterTemplates) {
      const phenotype = PILOT_REGISTRY.phenotypes.find(
        (candidate) => candidate.id === template.phenotypeId,
      )!;
      const generated = materializePilotEncounter(
        PILOT_REGISTRY,
        template.id,
        `decision-test|${template.id}`,
      );
      const nodes = generated.clinicalCase.decisionNodes;

      expect(
        nodes.every(
          (node) =>
            typeof node.primaryConceptId === "string" &&
            node.primaryConceptId.length > 0,
        ),
      ).toBe(true);
      expect(new Set(nodes.map((node) => node.primaryConceptId)).size).toBe(
        nodes.length,
      );
      if (phenotype.educationalTier === 0) {
        expect(nodes).toHaveLength(1);
      } else {
        expect(nodes.length).toBeLessThanOrEqual(2);
      }
    }
  });

  it("generates compatible adult patients without meaningful comorbidity", () => {
    for (const generated of generatedForEveryTemplate()) {
      const { generatedPatient: patient, phenotype } = generated;
      const overlay = PILOT_REGISTRY.physiologyOverlays.find(
        (candidate) => candidate.id === patient.physiologyOverlayId,
      )!;
      const required = new Set([
        ...phenotype.requiredFindings,
        ...overlay.requiredFindings,
      ]);
      const excluded = new Set([
        ...phenotype.excludedFindings,
        ...overlay.excludedFindings,
      ]);

      expect(patient.ageYears).toBeGreaterThanOrEqual(18);
      expect(patient.comorbidities).toEqual([]);
      for (const finding of required) {
        expect(patient.findings).toContain(finding);
      }
      for (const finding of excluded) {
        expect(patient.findings).not.toContain(finding);
      }
    }
  });

  it("draws every vital sign from the assigned physiology overlay", () => {
    for (const generated of generatedForEveryTemplate("vital-range-test")) {
      const patient = generated.generatedPatient;
      const overlay = PILOT_REGISTRY.physiologyOverlays.find(
        (candidate) => candidate.id === patient.physiologyOverlayId,
      )!;
      const vitals = patient.vitalSigns;
      const within = (
        value: number,
        range: { minimum: number; maximum: number },
      ) => value >= range.minimum && value <= range.maximum;

      expect(
        within(vitals.heartRateBpm, overlay.vitalRanges.heartRateBpm),
      ).toBe(true);
      expect(
        within(
          vitals.systolicBloodPressureMmHg,
          overlay.vitalRanges.systolicBloodPressureMmHg,
        ),
      ).toBe(true);
      expect(
        within(
          vitals.diastolicBloodPressureMmHg,
          overlay.vitalRanges.diastolicBloodPressureMmHg,
        ),
      ).toBe(true);
      expect(
        within(vitals.temperatureF, overlay.vitalRanges.temperatureF),
      ).toBe(true);
      expect(
        within(
          vitals.oxygenSaturationPercent,
          overlay.vitalRanges.oxygenSaturationPercent,
        ),
      ).toBe(true);
      expect(vitals.diastolicBloodPressureMmHg).toBeLessThan(
        vitals.systolicBloodPressureMmHg,
      );
    }
  });

  it("varies paired pressures without imposing one fixed pulse pressure", () => {
    const pulsePressures = new Set(
      Array.from({ length: 40 }, (_, index) => {
        const vitals = materializePilotEncounter(
          PILOT_REGISTRY,
          "case.pilot.appendicitis-incomplete-multistep",
          `pressure-variation-${index}`,
        ).generatedPatient.vitalSigns;
        return (
          vitals.systolicBloodPressureMmHg -
          vitals.diastolicBloodPressureMmHg
        );
      }),
    );
    expect(pulsePressures.size).toBeGreaterThan(1);
  });

  it("uses qualitative optional-finding categories without numeric symptom rates", () => {
    for (const generated of generatedForEveryTemplate(
      "qualitative-finding-selection",
    )) {
      const overlay = PILOT_REGISTRY.physiologyOverlays.find(
        (candidate) =>
          candidate.id === generated.generatedPatient.physiologyOverlayId,
      )!;
      const required = new Set([
        ...generated.phenotype.requiredFindings,
        ...overlay.requiredFindings,
      ]);
      const renderedOptional = generated.generatedPatient.findings.filter(
        (finding) => !required.has(finding),
      );
      expect(renderedOptional.length).toBeLessThanOrEqual(1);
    }

    const urgentHernia = PILOT_REGISTRY.phenotypes.find(
      (phenotype) =>
        phenotype.id ===
        "phenotype.inguinal-hernia.l1-acutely-irreducible",
    )!;
    const urgentHerniaOverlay = PILOT_REGISTRY.physiologyOverlays.find(
      (overlay) =>
        overlay.id === urgentHernia.physiologyOverlayIds[0],
    )!;
    const required = new Set([
      ...urgentHernia.requiredFindings,
      ...urgentHerniaOverlay.requiredFindings,
    ]);
    const renderedAcrossSeeds = new Set(
      Array.from({ length: 100 }, (_, index) =>
        materializePilotEncounter(
          PILOT_REGISTRY,
          "case.pilot.inguinal-hernia-acute-transfer",
          `qualitative-category-${index}`,
        ).generatedPatient.findings.find((finding) => !required.has(finding)),
      ).filter((finding): finding is string => finding !== undefined),
    );
    expect(
      urgentHernia.commonOptionalFindings.some((finding) =>
        renderedAcrossSeeds.has(finding),
      ),
    ).toBe(true);
    expect(
      urgentHernia.possibleFindings.some((finding) =>
        renderedAcrossSeeds.has(finding),
      ),
    ).toBe(true);
    expect(
      urgentHernia.uncommonFindings.some((finding) =>
        renderedAcrossSeeds.has(finding),
      ),
    ).toBe(true);
  });

  it("keeps source-limited teaching points within their authored evidence boundary", () => {
    const lacerationAssessment = PILOT_REGISTRY.claims.find(
      (claim) => claim.id === "claim.laceration.preclosure_assessment",
    )!;
    expect(lacerationAssessment.statement.toLowerCase()).not.toContain(
      "perfusion",
    );

    const deepLaceration = PILOT_REGISTRY.concepts.find(
      (concept) => concept.id === "concept.laceration.deep-structure-referral",
    )!;
    expect(deepLaceration.disposition).toBe("prompt_specialty_referral");
    expect(
      deepLaceration.questionVariants
        .map((variant) => variant.stem)
        .join(" ")
        .toLowerCase(),
    ).not.toContain("numbness");

    const abscess = PILOT_REGISTRY.concepts.find(
      (concept) => concept.id === "concept.prototype.abscess.primary-treatment",
    )!;
    expect(abscess.disposition).toBe("procedural_referral");
    expect(JSON.stringify(abscess).toLowerCase()).not.toContain("same-day");

    const biliaryRedFlags = PILOT_REGISTRY.concepts.find(
      (concept) => concept.id === "concept.cholelithiasis.red-flag-transfer",
    )!;
    expect(
      biliaryRedFlags.questionVariants
        .map((variant) => variant.stem)
        .join(" ")
        .toLowerCase(),
    ).not.toContain("guarding");

    const appendicitisRecognition = PILOT_REGISTRY.concepts.find(
      (concept) =>
        concept.id === "concept.appendicitis.incomplete-pattern-recognition",
    )!;
    expect(JSON.stringify(appendicitisRecognition).toLowerCase()).not.toContain(
      "primary concern",
    );
  });

  it("keeps generated findings observable and free of disposition or authoring cues", () => {
    const forbiddenCues = [
      "emergency transfer",
      "scored question",
      "no reassuring alternate",
      "incomplete classic pattern",
    ];
    for (const generated of generatedForEveryTemplate("cue-leak-test")) {
      const visibleText = [
        generated.clinicalCase.presentation,
        ...generated.generatedPatient.findings,
      ]
        .join(" ")
        .toLowerCase();
      for (const cue of forbiddenCues) {
        expect(visibleText).not.toContain(cue);
      }
    }

    const laceration = materializePilotEncounter(
      PILOT_REGISTRY,
      "case.prototype.tutorial-laceration",
      "preclosure-no-leak",
    );
    expect(
      laceration.generatedPatient.findings.join(" ").toLowerCase(),
    ).not.toContain("intact distal");
  });

  it("uses source-linked adult reference bounds for every physiology overlay", () => {
    for (const overlay of PILOT_REGISTRY.physiologyOverlays) {
      expect(overlay.evidenceClaimIds).toContain(
        "claim.physiology.resting_adult_ranges",
      );
      expect(overlay.evidenceClaimIds).toContain(
        "claim.physiology.oxygen_saturation_range",
      );
      expect(overlay.vitalRanges.heartRateBpm.minimum).toBeGreaterThanOrEqual(60);
      expect(overlay.vitalRanges.heartRateBpm.maximum).toBeLessThanOrEqual(100);
      expect(
        overlay.vitalRanges.systolicBloodPressureMmHg.minimum,
      ).toBeGreaterThanOrEqual(90);
      expect(
        overlay.vitalRanges.systolicBloodPressureMmHg.maximum,
      ).toBeLessThanOrEqual(120);
      expect(
        overlay.vitalRanges.diastolicBloodPressureMmHg.minimum,
      ).toBeGreaterThanOrEqual(60);
      expect(
        overlay.vitalRanges.diastolicBloodPressureMmHg.maximum,
      ).toBeLessThanOrEqual(80);
      expect(overlay.vitalRanges.temperatureF.minimum).toBeGreaterThanOrEqual(
        96.4,
      );
      expect(overlay.vitalRanges.temperatureF.maximum).toBeLessThanOrEqual(
        99.1,
      );
      expect(
        overlay.vitalRanges.oxygenSaturationPercent.minimum,
      ).toBeGreaterThanOrEqual(94);
      expect(
        overlay.vitalRanges.oxygenSaturationPercent.maximum,
      ).toBeLessThanOrEqual(98);
    }
  });

  it("never substitutes plain X-ray for biliary or appendicitis evaluation", () => {
    const relevantTemplates = PILOT_REGISTRY.encounterTemplates.filter(
      (template) =>
        template.diagnosisFamilyId === "symptomatic_cholelithiasis" ||
        template.diagnosisFamilyId === "acute_appendicitis",
    );
    for (const template of relevantTemplates) {
      const generated = materializePilotEncounter(
        PILOT_REGISTRY,
        template.id,
        `no-xray|${template.id}`,
      );
      for (const node of generated.clinicalCase.decisionNodes) {
        const correct = node.answerChoices.find((choice) => choice.isCorrect)!;
        expect(correct.serviceRequest?.serviceId).not.toBe("service.xray");
        expect(correct.label.toLowerCase()).not.toContain("plain x-ray");
        expect(correct.label.toLowerCase()).not.toContain("plain xray");
      }
    }
  });

  it("keeps one concept identity across wording variants", () => {
    for (const concept of PILOT_REGISTRY.concepts) {
      const applicableTemplate = PILOT_REGISTRY.encounterTemplates.find(
        (template) => template.scoredConceptIds.includes(concept.id),
      )!;
      const nodeConceptIds = concept.questionVariants.map((variant) => {
        const generated = materializePilotEncounter(
          PILOT_REGISTRY,
          applicableTemplate.id,
          `variant-history|${variant.id}`,
          {
            forcedQuestionVariantIdsByConceptId: {
              [concept.id]: variant.id,
            },
          },
        );
        return generated.clinicalCase.decisionNodes.find(
          (node) => node.questionVariantId === variant.id,
        )!.primaryConceptId;
      });
      expect(new Set(nodeConceptIds)).toEqual(new Set([concept.id]));
    }
  });

  it("links every atomic claim to real source metadata without placeholders", () => {
    const sourceIds = new Set(
      PILOT_REGISTRY.sources.map((source) => source.id),
    );
    for (const claim of PILOT_REGISTRY.claims) {
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      expect(claim.sourceIds.every((sourceId) => sourceIds.has(sourceId))).toBe(
        true,
      );
    }
    for (const source of PILOT_REGISTRY.sources) {
      expect(source.officialUrl ?? source.doi).toBeTruthy();
      expect(source.reuseStatus.length).toBeGreaterThan(0);
      expect(source.completeCitation.toLowerCase()).not.toContain(
        "placeholder",
      );
      if (source.officialUrl) {
        expect(source.officialUrl).toMatch(/^https:\/\/\S+$/);
      }
    }
  });

  it("keeps every authored pilot record in AI-assisted clinician-review status", () => {
    const records = [
      ...PILOT_REGISTRY.sources,
      ...PILOT_REGISTRY.claims,
      ...PILOT_REGISTRY.physiologyOverlays,
      ...PILOT_REGISTRY.diagnosisFamilies,
      ...PILOT_REGISTRY.diagnosisFamilies.map(
        (family) => family.chartBackSummary,
      ),
      ...PILOT_REGISTRY.phenotypes,
      ...PILOT_REGISTRY.concepts,
      ...PILOT_REGISTRY.concepts.flatMap(
        (concept) => concept.questionVariants,
      ),
      ...PILOT_REGISTRY.encounterTemplates,
    ];
    expect(
      records.every(
        (record) =>
          record.reviewStatus === "needs_clinician_review" &&
          record.aiAssistedDrafting &&
          record.lastClinicianReview == null,
      ),
    ).toBe(true);
    expect(PILOT_CLINICAL_RELEASE.publicationStatus).toBe(
      "synthetic_unapproved_prototype",
    );
  });

  it("builds the correct completed-chart claim and citation view for every case", () => {
    for (const template of PILOT_REGISTRY.encounterTemplates) {
      const review = getPilotChartReviewByCaseId(template.id);
      expect(review?.diagnosisId).toBe(template.diagnosisFamilyId);
      expect(review?.sections.map((section) => section.heading)).toEqual([
        "What it is",
        "Typical presentation",
        "Initial evaluation",
        "Management in this clinic",
        "Red flags requiring urgent care",
      ]);
      expect(review?.sources.length).toBeGreaterThan(0);
      expect(
        review?.sources.every(
          (source) =>
            source.supportedClaimIds.length > 0 &&
            source.href.startsWith("https://"),
        ),
      ).toBe(true);
    }
  });

  it("deterministically previews every diagnosis and educational tier", () => {
    for (const family of PILOT_REGISTRY.diagnosisFamilies) {
      for (const educationalTier of [0, 1] as const) {
        const phenotypeIds = new Set(
          PILOT_REGISTRY.phenotypes
            .filter(
              (phenotype) =>
                phenotype.diagnosisFamilyId === family.id &&
                phenotype.educationalTier === educationalTier,
            )
            .map((phenotype) => phenotype.id),
        );
        const template = PILOT_REGISTRY.encounterTemplates.find(
          (candidate) =>
            candidate.diagnosisFamilyId === family.id &&
            phenotypeIds.has(candidate.phenotypeId),
        )!;
        const first = materializePilotEncounter(
          PILOT_REGISTRY,
          template.id,
          "deterministic-preview",
        );
        const second = materializePilotEncounter(
          PILOT_REGISTRY,
          template.id,
          "deterministic-preview",
        );
        expect(second).toEqual(first);
      }
    }
  });
});
