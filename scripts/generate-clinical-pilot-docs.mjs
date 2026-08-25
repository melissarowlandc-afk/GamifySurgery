import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createServer } from "vite";

const repositoryRoot = resolve(import.meta.dirname, "..");
const outputPath = resolve(
  repositoryRoot,
  "docs/clinical-pilot/CLINICIAN_REVIEW_PACKET.md",
);
const vite = await createServer({
  root: repositoryRoot,
  appType: "custom",
  logLevel: "error",
  server: { middlewareMode: true },
});

const { PILOT_REGISTRY } = await vite.ssrLoadModule(
  "/packages/clinical-content/src/pilot-content.ts",
);
const { materializePilotEncounter } = await vite.ssrLoadModule(
  "/packages/clinical-content/src/pilot-generator.ts",
);

const unique = (values) => [...new Set(values)];
const cell = (value) =>
  String(value)
    .replaceAll("|", "\\|")
    .replaceAll("\r", " ")
    .replaceAll("\n", " ");
const reviewLabel = (value) => value.replaceAll("_", " ");
const sourceById = new Map(
  PILOT_REGISTRY.sources.map((source) => [source.id, source]),
);
const claimsForIds = (ids) =>
  ids.map((id) => PILOT_REGISTRY.claims.find((claim) => claim.id === id));
const sourceIdsForClaimIds = (claimIds) =>
  unique(claimsForIds(claimIds).flatMap((claim) => claim.sourceIds));
const reviewSeedByTemplateId = {
  "case.prototype.tutorial-laceration": "review-1",
  "case.pilot.laceration-tetanus": "review-0",
  "case.pilot.laceration-deep-structure": "review-1",
  "case.prototype.abscess": "review-0",
  "case.pilot.abscess-nonpurulent-differential": "review-2",
  "case.pilot.abscess-rapid-spread": "review-1",
  "case.prototype.symptomatic-cholelithiasis": "review-0",
  "case.pilot.cholelithiasis-ultrasound": "review-1",
  "case.pilot.cholelithiasis-red-flags": "review-0",
  "case.pilot.inguinal-hernia-reducible-referral": "review-1",
  "case.pilot.inguinal-hernia-watchful-waiting": "review-2",
  "case.pilot.inguinal-hernia-acute-transfer": "review-7",
  "case.pilot.appendicitis-classic-transfer": "review-0",
  "case.pilot.appendicitis-incomplete-multistep": "review-12",
  "case.pilot.appendicitis-no-onsite-imaging": "review-3",
};
const line = [];

line.push(
  "# Clinician review packet",
  "",
  `Status: AI-assisted draft, \`${PILOT_REGISTRY.diagnosisFamilies[0].reviewStatus}\``,
  "",
  `Content version: \`${PILOT_REGISTRY.contentVersion}\``,
  "",
  "This packet is generated from the versioned pilot registry. It is a review artifact, not clinical approval or medical guidance. Every explanation and distractor rationale is original draft wording. Source prose, tables, algorithms, figures, and question stems are not reproduced.",
  "",
  "The deterministic examples use fixed review seeds chosen to expose every phenotype and demonstrate disease-independent demographic variety. They are not prevalence samples.",
  "",
  "## Pilot inventory",
  "",
  `- Diagnosis families: ${PILOT_REGISTRY.diagnosisFamilies.length}`,
  `- Phenotypes: ${PILOT_REGISTRY.phenotypes.length}`,
  `- Concepts: ${PILOT_REGISTRY.concepts.length}`,
  `- Question variants: ${PILOT_REGISTRY.concepts.reduce((sum, concept) => sum + concept.questionVariants.length, 0)}`,
  `- Encounter templates: ${PILOT_REGISTRY.encounterTemplates.length}`,
  `- Evidence claims: ${PILOT_REGISTRY.claims.length}`,
  `- Sources: ${PILOT_REGISTRY.sources.length}`,
  "",
  "## Claim-to-source matrix",
  "",
  "| Claim ID | Independently written claim | Category / certainty | Source IDs | Limitation |",
  "|---|---|---|---|---|",
);

for (const claim of PILOT_REGISTRY.claims) {
  line.push(
    `| \`${claim.id}\` | ${cell(claim.statement)} | ${claim.evidenceCategory}; ${claim.certainty} | ${claim.sourceIds.map((id) => `\`${id}\``).join(", ")} | ${cell(claim.limitation ?? "None recorded")} |`,
  );
}

for (const family of PILOT_REGISTRY.diagnosisFamilies) {
  const phenotypes = PILOT_REGISTRY.phenotypes.filter(
    (phenotype) => phenotype.diagnosisFamilyId === family.id,
  );
  const concepts = PILOT_REGISTRY.concepts.filter((concept) =>
    concept.diagnosisFamilyIds.includes(family.id),
  );

  line.push(
    "",
    `## ${family.displayName}`,
    "",
    `Family ID: \`${family.id}\``,
    "",
    `Scope: ${family.scopeDefinition}`,
    "",
    `Explicit exclusions: ${family.exclusions.join("; ")}.`,
    "",
    "### Phenotypes and capability requirements",
    "",
    "| Tier | Phenotype | Acuity | Required capabilities | Allowed dispositions | Editorial simulation weight |",
    "|---|---|---|---|---|---|",
  );
  for (const phenotype of phenotypes) {
    line.push(
      `| Level ${phenotype.educationalTier} | \`${phenotype.id}\` - ${cell(phenotype.displayName)} | ${phenotype.acuity} | ${phenotype.requiredFacilityCapabilityIds.map((id) => `\`${id}\``).join(", ") || "None"} | ${phenotype.allowedDispositions.join(", ")} | ${phenotype.simulationWeight.value} (${cell(phenotype.simulationWeight.rationale)}) |`,
    );
  }

  line.push("", "### Deterministic generated examples", "");
  for (const educationalTier of [0, 1]) {
    const phenotypeIds = new Set(
      phenotypes
        .filter(
          (phenotype) => phenotype.educationalTier === educationalTier,
        )
        .map((phenotype) => phenotype.id),
    );
    const templates = PILOT_REGISTRY.encounterTemplates.filter(
      (candidate) =>
        candidate.diagnosisFamilyId === family.id &&
        phenotypeIds.has(candidate.phenotypeId),
    );
    for (const template of templates) {
      const seed =
        reviewSeedByTemplateId[template.id] ??
        `clinician-review|${family.id}|${template.phenotypeId}`;
      const generated = materializePilotEncounter(
        PILOT_REGISTRY,
        template.id,
        seed,
        { patientDisplayName: "Review Packet Patient" },
      );
      const patient = generated.generatedPatient;
      line.push(
        `#### Level ${educationalTier}: ${generated.phenotype.displayName}`,
        "",
        `- Template: \`${template.id}\``,
        `- Seed: \`${seed}\``,
        `- Patient: ${patient.ageYears} years; ${patient.sexLabel}; BMI ${patient.bmi.toFixed(1)}; meaningful comorbidities ${patient.comorbidities.length}`,
        `- Physiology overlay: \`${patient.physiologyOverlayId}\``,
        `- Vitals: HR ${patient.vitalSigns.heartRateBpm}; BP ${patient.vitalSigns.systolicBloodPressureMmHg}/${patient.vitalSigns.diastolicBloodPressureMmHg}; temperature ${patient.vitalSigns.temperatureF.toFixed(1)} F; SpO2 ${patient.vitalSigns.oxygenSaturationPercent}%`,
        `- Findings: ${patient.findings.join("; ")}`,
        `- Presentation: ${generated.clinicalCase.presentation}`,
        `- Selected question variants: ${generated.selectedQuestionVariantIds.map((id) => `\`${id}\``).join(", ")}`,
        "",
      );
      generated.clinicalCase.decisionNodes.forEach((node, index) => {
        const correct = node.answerChoices.find((choice) => choice.isCorrect);
        line.push(
          `${index + 1}. **${node.stem}**`,
          `   - Primary concept: \`${node.primaryConceptId}\``,
          `   - Correct answer: ${correct.label}`,
        );
      });
      line.push("");
    }
  }

  line.push("", "### Concepts and question variants", "");
  for (const concept of concepts) {
    line.push(
      `#### ${concept.displayName}`,
      "",
      `- Concept ID: \`${concept.id}\``,
      `- Learning objective: ${concept.learningObjective}`,
      `- Educational tier: Level ${concept.educationalTier}`,
      `- Correct action: ${concept.correctAction}`,
      `- Disposition: \`${concept.disposition}\``,
      `- Required capabilities: ${concept.requiredCapabilityIds.map((id) => `\`${id}\``).join(", ") || "None"}`,
      `- Supporting claims: ${concept.evidenceClaimIds.map((id) => `\`${id}\``).join(", ")}`,
      `- Supporting sources: ${sourceIdsForClaimIds(concept.evidenceClaimIds).map((id) => `\`${id}\``).join(", ")}`,
      `- Review status: \`${concept.reviewStatus}\` (AI-assisted: ${concept.aiAssistedDrafting ? "yes" : "no"})`,
      "",
    );
    for (const variant of concept.questionVariants) {
      const correct = variant.answerChoices.find((answer) => answer.isCorrect);
      line.push(
        `##### ${variant.id}`,
        "",
        `**Question:** ${variant.stem}`,
        "",
        `**Correct answer:** ${correct.label}`,
        "",
        `**Explanation:** ${variant.explanation}`,
        "",
        "**Distractor rationales:**",
        "",
      );
      for (const answer of variant.answerChoices.filter(
        (candidate) => !candidate.isCorrect,
      )) {
        line.push(`- ${answer.label}: ${answer.distractorRationale}`);
      }
      line.push(
        "",
        `Supporting claim IDs: ${variant.supportingEvidenceClaimIds.map((id) => `\`${id}\``).join(", ")}`,
        "",
        `Supporting source IDs: ${sourceIdsForClaimIds(variant.supportingEvidenceClaimIds).map((id) => `\`${id}\``).join(", ")}`,
        "",
        `Review status: \`${reviewLabel(variant.reviewStatus)}\`; last clinician review: none recorded.`,
        "",
      );
    }
  }
}

line.push(
  "## Source lookup",
  "",
  "The complete citation, organization or journal, publication year, DOI or official URL, access date, authority assessment, license, reuse status, and use role for every source are maintained in [SOURCE_MANIFEST.md](SOURCE_MANIFEST.md) and in the pilot registry.",
  "",
  "Clinical approval remains pending. Automated tests and this generated packet do not record clinician review.",
  "",
);

await writeFile(outputPath, `${line.join("\n")}\n`, "utf8");
await vite.close();
console.log(`Wrote ${outputPath}`);
