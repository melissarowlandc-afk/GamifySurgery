import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { syntheticClinicalCaseSchema } from "../../schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "../../synthetic-content";
import { BRIEF_EARLY_LEVELS_20260917_AUTHORING_CONCEPTS as concepts, BRIEF_EARLY_LEVELS_20260917_BATCH_MANIFEST as manifest, BRIEF_EARLY_LEVELS_20260917_CASE_REVIEWS as reviews, BRIEF_EARLY_LEVELS_20260917_CASES as cases, BRIEF_EARLY_LEVELS_20260917_CLAIMS as claims, BRIEF_EARLY_LEVELS_20260917_QUESTIONS as questions, BRIEF_EARLY_LEVELS_20260917_SOURCES as sources, BRIEF_EARLY_LEVELS_20260917_TIMING_ENTRIES as timings } from "./brief-early-levels-batch";

describe("September 17 brief early-level admission", () => {
  it("admits the exact authored batch once", () => {
    expect(manifest).toMatchObject({ authoringConceptCount: 20, testedConceptCount: 20, questionVariantCount: 80, caseCount: 48, decisionNodeCount: 80, resultGateCount: 32 });
    expect([concepts, questions, cases, reviews, timings].map((items) => items.length)).toEqual([20, 80, 48, 48, 80]);
    expect(SYNTHETIC_CLINICAL_RELEASE.concepts).toHaveLength(183);
    expect(SYNTHETIC_CLINICAL_RELEASE.cases).toHaveLength(450);
    expect(SYNTHETIC_CLINICAL_RELEASE.cases.flatMap((item) => item.decisionNodes)).toHaveLength(703);
    for (const clinicalCase of cases) expect(syntheticClinicalCaseSchema.parse(clinicalCase)).toEqual(clinicalCase);
  });
  it("keeps provenance, review status, concise presentations, and parallel choices", () => {
    const sourceIds = new Set(sources.map((item) => item.id)); const claimIds = new Set(claims.map((item) => item.id));
    for (const record of [...concepts, ...questions, ...claims, ...sources, ...reviews]) { expect(record.reviewStatus).toBe("needs_clinician_review"); expect(record.lastClinicianReview).toBeNull(); }
    for (const concept of concepts) {
      expect(questions.filter((question) => question.conceptId === concept.id)).toHaveLength(4);
      for (const id of concept.evidenceClaimIds) expect(claimIds.has(id)).toBe(true);
    }
    for (const question of questions) {
      for (const id of question.supportingEvidenceClaimIds) expect(claimIds.has(id)).toBe(true);
    }
    for (const claim of claims) for (const id of claim.sourceIds) {
      expect(sourceIds.has(id)).toBe(true);
      expect(sources.find((source) => source.id === id)?.evidenceClaimIds).toContain(claim.id);
    }
    for (const source of sources) for (const id of source.evidenceClaimIds) expect(claimIds.has(id)).toBe(true);
    for (const clinicalCase of cases) {
      expect(clinicalCase.chiefComplaint.trim().split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.presentation.trim().split(/\s+/).length).toBeLessThanOrEqual(55);
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(4);
      for (const profile of clinicalCase.approvedInstantiationProfiles) {
        const { ageYears, sexLabel } = profile.prototypeDemographics;
        expect(["Female", "Male"]).toContain(sexLabel);
        expect(profile.presentation).toContain(`${ageYears}-year-old ${sexLabel === "Female" ? "woman" : "man"}`);
      }
      for (const node of clinicalCase.decisionNodes) { const key = node.answerChoices.find((choice) => choice.isCorrect)!; expect(node.stem.trim().split(/\s+/).length).toBeLessThanOrEqual(18); expect(node.shuffleAnswers).toBe(true); expect(node.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1); expect(key.label.length).toBeLessThanOrEqual(Math.max(...node.answerChoices.filter((choice) => !choice.isCorrect).map((choice) => choice.label.length))); }
    }
  });
  it("binds the editorial receipt to the exact concepts and authored source version", () => {
    const root = fileURLToPath(new URL("../../../../../", import.meta.url));
    const receipt = readFileSync(resolve(root, "docs/clinical-workbench/approvals/owner-delegated-brief-early-levels-2026-09-17.md"), "utf8");
    expect([...receipt.matchAll(/^\d+\. `(concept\.[^`]+)`$/gm)].map((match) => match[1]))
      .toEqual(concepts.map((concept) => concept.id));
    const rows = [...receipt.matchAll(/\| `([a-f0-9]{64})` \| `([^`]+\.ts)` \|/g)];
    const prefix = "packages/clinical-content/src/development-batch/2026-09-17/";
    const files = ["batch-helpers", "adrenal-incidentaloma", "mammary-paget-disease", "inflammatory-breast-cancer", "abdominal-aortic-aneurysm", "fecal-incontinence", "h-pylori-ulcer", "uncomplicated-diverticulitis", "thyroglossal-duct-cyst", "rectal-prolapse", "eosinophilic-esophagitis", "brief-early-levels-batch"];
    expect(rows.map((row) => row[2])).toEqual(files.map((file) => `${prefix}${file}.ts`));
    for (const [, hash, path] of rows) {
      const canonical = readFileSync(resolve(root, path!), "utf8").replace(/\r\n/g, "\n");
      expect(createHash("sha256").update(canonical).digest("hex")).toBe(hash);
    }
  });
});
