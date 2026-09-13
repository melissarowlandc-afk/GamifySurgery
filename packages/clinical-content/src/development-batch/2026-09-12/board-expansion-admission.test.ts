import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { SYNTHETIC_CLINICAL_RELEASE } from "../../synthetic-content";
import { syntheticClinicalCaseSchema } from "../../schema";
import {
  BOARD_EXPANSION_20260912_AUTHORING_CONCEPTS,
  BOARD_EXPANSION_20260912_BATCH_MANIFEST,
  BOARD_EXPANSION_20260912_CASE_REVIEWS,
  BOARD_EXPANSION_20260912_CASES,
  BOARD_EXPANSION_20260912_CLAIMS,
  BOARD_EXPANSION_20260912_QUESTIONS,
  BOARD_EXPANSION_20260912_SERVICE_CONTRACTS,
  BOARD_EXPANSION_20260912_SOURCES,
  BOARD_EXPANSION_20260912_TESTED_CONCEPTS,
  BOARD_EXPANSION_20260912_TIMING_ENTRIES,
} from "./board-expansion-batch";

const ROOT = fileURLToPath(new URL("../../../../../", import.meta.url));
const RECEIPT = "docs/clinical-workbench/approvals/owner-delegated-board-expansion-2026-09-12.md";
const RECEIPT_PATHS = [
  "packages/clinical-content/src/development-batch/2026-09-12/batch-helpers.ts",
  "packages/clinical-content/src/development-batch/2026-09-12/familial-adenomatous-polyposis.ts",
  "packages/clinical-content/src/development-batch/2026-09-12/complex-perianal-fistula.ts",
  "packages/clinical-content/src/development-batch/2026-09-12/recovered-diverticulitis.ts",
  "packages/clinical-content/src/development-batch/2026-09-12/anal-squamous-cell-cancer.ts",
  "packages/clinical-content/src/development-batch/2026-09-12/postoperative-dvt.ts",
  "packages/clinical-content/src/development-batch/2026-09-12/persistent-itp.ts",
  "packages/clinical-content/src/development-batch/2026-09-12/gastric-gist.ts",
  "packages/clinical-content/src/development-batch/2026-09-12/hepatic-adenoma.ts",
  "packages/clinical-content/src/development-batch/2026-09-12/chronic-mesenteric-ischemia.ts",
  "packages/clinical-content/src/development-batch/2026-09-12/primary-aldosteronism.ts",
  "packages/clinical-content/src/development-batch/2026-09-12/board-expansion-batch.ts",
] as const;

describe("September 12 board-expansion batch admission", () => {
  it("admits the additive 20/80/40 result-gated batch exactly once", () => {
    expect(BOARD_EXPANSION_20260912_AUTHORING_CONCEPTS).toHaveLength(20);
    expect(BOARD_EXPANSION_20260912_TESTED_CONCEPTS).toHaveLength(20);
    expect(BOARD_EXPANSION_20260912_QUESTIONS).toHaveLength(80);
    expect(BOARD_EXPANSION_20260912_CASES).toHaveLength(40);
    expect(BOARD_EXPANSION_20260912_CLAIMS).toHaveLength(21);
    expect(BOARD_EXPANSION_20260912_SOURCES).toHaveLength(18);
    expect(BOARD_EXPANSION_20260912_TIMING_ENTRIES).toHaveLength(80);
    expect(BOARD_EXPANSION_20260912_CASE_REVIEWS).toHaveLength(40);
    expect(BOARD_EXPANSION_20260912_CASES.flatMap((item) => item.decisionNodes).filter((node) => node.resultGateAfter)).toHaveLength(40);
    expect(BOARD_EXPANSION_20260912_BATCH_MANIFEST).toMatchObject({
      authoringConceptCount: 20,
      testedConceptCount: 20,
      questionVariantCount: 80,
      caseCount: 40,
      multistepCaseCount: 40,
      resultGateCount: 40,
      sourceCount: 18,
      evidenceClaimCount: 21,
      serviceContractCount: 10,
      timingEntryCount: 80,
      admissionScope: "active_synthetic_unapproved_prototype",
      publicReleaseAuthorized: false,
    });
    expect(SYNTHETIC_CLINICAL_RELEASE.concepts).toHaveLength(143);
    expect(SYNTHETIC_CLINICAL_RELEASE.cases).toHaveLength(350);
    expect(SYNTHETIC_CLINICAL_RELEASE.cases.flatMap((item) => item.decisionNodes)).toHaveLength(543);
    for (const clinicalCase of BOARD_EXPANSION_20260912_CASES) {
      expect(syntheticClinicalCaseSchema.parse(clinicalCase)).toEqual(clinicalCase);
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(4);
      expect(SYNTHETIC_CLINICAL_RELEASE.cases.filter((item) => item.id === clinicalCase.id)).toHaveLength(1);
      expect(clinicalCase.decisionNodes[0]!.answerChoices.find((choice) => choice.isCorrect)?.serviceRequest?.serviceId).toBe(clinicalCase.decisionNodes[0]!.resultGateAfter?.resultTypeId);
    }
    expect(new Set(BOARD_EXPANSION_20260912_AUTHORING_CONCEPTS.map((item) => item.id)).size).toBe(20);
    expect(new Set(BOARD_EXPANSION_20260912_TESTED_CONCEPTS.map((item) => item.id)).size).toBe(20);
    expect(new Set(BOARD_EXPANSION_20260912_CASES.map((item) => item.id)).size).toBe(40);
    expect(new Set(BOARD_EXPANSION_20260912_CLAIMS.map((item) => item.id)).size).toBe(21);
    expect(new Set(BOARD_EXPANSION_20260912_SOURCES.map((item) => item.id)).size).toBe(18);
  });

  it("keeps every record pending review with bidirectional provenance and declared service contracts", () => {
    const sourceIds = new Set(BOARD_EXPANSION_20260912_SOURCES.map((item) => item.id));
    const claimIds = new Set(BOARD_EXPANSION_20260912_CLAIMS.map((item) => item.id));
    for (const record of [...BOARD_EXPANSION_20260912_AUTHORING_CONCEPTS, ...BOARD_EXPANSION_20260912_QUESTIONS, ...BOARD_EXPANSION_20260912_CLAIMS, ...BOARD_EXPANSION_20260912_SOURCES, ...BOARD_EXPANSION_20260912_CASE_REVIEWS]) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.lastClinicianReview).toBeNull();
    }
    for (const claim of BOARD_EXPANSION_20260912_CLAIMS) for (const sourceId of claim.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
    for (const source of BOARD_EXPANSION_20260912_SOURCES) for (const claimId of source.evidenceClaimIds) expect(claimIds.has(claimId)).toBe(true);
    for (const concept of BOARD_EXPANSION_20260912_AUTHORING_CONCEPTS) for (const claimId of concept.evidenceClaimIds) expect(claimIds.has(claimId)).toBe(true);
    for (const question of BOARD_EXPANSION_20260912_QUESTIONS) for (const claimId of question.supportingEvidenceClaimIds) expect(claimIds.has(claimId)).toBe(true);
    expect(BOARD_EXPANSION_20260912_SERVICE_CONTRACTS.filter((item) => item.delivery === "new_external_contract_required").map((item) => item.serviceId).sort()).toEqual([
      "service.anal_lesion_biopsy_staging",
      "service.genetic_testing",
      "service.gist_eus_core_molecular",
      "service.hiv_hcv_serology",
      "service.liver_mri",
      "service.mesenteric_cta",
      "service.pelvic_mri",
      "service.primary_aldosteronism_screen",
      "service.venous_duplex",
    ]);
  });

  it("binds ordered concepts and LF-normalized source hashes in the owner receipt", () => {
    const receipt = readFileSync(resolve(ROOT, RECEIPT), "utf8");
    expect([...receipt.matchAll(/^\d+\. `(concept\.[^`]+)`$/gm)].map((match) => match[1])).toEqual(BOARD_EXPANSION_20260912_AUTHORING_CONCEPTS.map((item) => item.id));
    const rows = [...receipt.matchAll(/\| `([a-f0-9]{64})` \| `([^`]+\.ts)` \|/g)];
    expect(rows).toHaveLength(RECEIPT_PATHS.length);
    expect(rows.map((match) => match[2])).toEqual(RECEIPT_PATHS);
    for (const [, expected, path] of rows) {
      const canonical = readFileSync(resolve(ROOT, path!), "utf8").replace(/\r\n/g, "\n");
      expect(createHash("sha256").update(canonical, "utf8").digest("hex")).toBe(expected);
    }
  });
});
