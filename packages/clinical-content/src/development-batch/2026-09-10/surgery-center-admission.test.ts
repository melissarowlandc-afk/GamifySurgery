import { describe, expect, it } from "vitest";
import { SYNTHETIC_CLINICAL_RELEASE } from "../../synthetic-content";
import {
  SURGERY_CENTER_BATCH_MANIFEST,
  SURGERY_CENTER_CASES,
  SURGERY_CENTER_CLAIMS,
  SURGERY_CENTER_AUTHORING_CONCEPTS,
  SURGERY_CENTER_QUESTIONS,
  SURGERY_CENTER_SERVICE_CONTRACTS,
  SURGERY_CENTER_SOURCES,
  SURGERY_CENTER_TESTED_CONCEPTS,
} from "./surgery-center-batch";

const ROOT = fileURLToPath(new URL("../../../../../", import.meta.url));
const RECEIPT = "docs/clinical-workbench/approvals/owner-delegated-surgery-center-batch-2026-09-10.md";
const RECEIPT_PATHS = [
  "packages/clinical-content/src/development-batch/2026-09-10/batch-helpers.ts",
  "packages/clinical-content/src/development-batch/2026-09-10/thyroid-nodule.ts",
  "packages/clinical-content/src/development-batch/2026-09-10/primary-hyperparathyroidism.ts",
  "packages/clinical-content/src/development-batch/2026-09-10/inguinal-hernia.ts",
  "packages/clinical-content/src/development-batch/2026-09-10/anal-fissure.ts",
  "packages/clinical-content/src/development-batch/2026-09-10/internal-hemorrhoids.ts",
  "packages/clinical-content/src/development-batch/2026-09-10/esophageal-dysphagia.ts",
  "packages/clinical-content/src/development-batch/2026-09-10/achalasia.ts",
  "packages/clinical-content/src/development-batch/2026-09-10/pigmented-skin-lesion.ts",
  "packages/clinical-content/src/development-batch/2026-09-10/postoperative-seroma.ts",
  "packages/clinical-content/src/development-batch/2026-09-10/pilonidal-disease.ts",
  "packages/clinical-content/src/development-batch/2026-09-10/surgery-center-batch.ts",
] as const;

describe("September 10 surgery-center batch admission", () => {
  it("admits the complete unapproved batch exactly once with its authored boundaries", () => {
    expect(SURGERY_CENTER_AUTHORING_CONCEPTS).toHaveLength(20);
    expect(SURGERY_CENTER_TESTED_CONCEPTS).toHaveLength(20);
    expect(SURGERY_CENTER_QUESTIONS).toHaveLength(80);
    expect(SURGERY_CENTER_CASES).toHaveLength(40);
    expect(SURGERY_CENTER_CASES.every((item) => item.decisionNodes.length === 2)).toBe(true);
    expect(SURGERY_CENTER_CASES.flatMap((item) => item.decisionNodes).filter((item) => item.resultGateAfter)).toHaveLength(32);
    expect(SURGERY_CENTER_CASES.filter((item) => item.earliestFacilityStage === 1)).toHaveLength(36);
    expect(SURGERY_CENTER_CASES.filter((item) => item.earliestFacilityStage === 2 && item.requiredCapabilityIds.includes("capability.endoscopy"))).toHaveLength(4);
    expect(SURGERY_CENTER_CASES.every((item) => item.earliestFacilityStage < 3)).toBe(true);
    expect(SURGERY_CENTER_CASES.flatMap((item) => item.decisionNodes).every((item) => item.showServicePreviews === false)).toBe(true);
    expect(SURGERY_CENTER_BATCH_MANIFEST.admissionScope).toBe("active_synthetic_unapproved_prototype");
    expect(SYNTHETIC_CLINICAL_RELEASE.id).toBe("clinical.synthetic.prototype.v1");
    expect(SYNTHETIC_CLINICAL_RELEASE.schemaVersion).toBe(1);
    expect(SYNTHETIC_CLINICAL_RELEASE.publicationStatus).toBe("synthetic_unapproved_prototype");
    for (const item of SURGERY_CENTER_CASES) {
      expect(SYNTHETIC_CLINICAL_RELEASE.cases.filter((candidate) => candidate.id === item.id)).toHaveLength(1);
    }
  });

  it("keeps every new record pending clinician review with traceable claims and services", () => {
    const claimIds = new Set(SURGERY_CENTER_CLAIMS.map((item) => item.id));
    const sourceIds = new Set(SURGERY_CENTER_SOURCES.map((item) => item.id));
    for (const record of [...SURGERY_CENTER_AUTHORING_CONCEPTS, ...SURGERY_CENTER_QUESTIONS, ...SURGERY_CENTER_CLAIMS, ...SURGERY_CENTER_SOURCES]) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.lastClinicianReview).toBeNull();
    }
    for (const claim of SURGERY_CENTER_CLAIMS) for (const sourceId of claim.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
    for (const source of SURGERY_CENTER_SOURCES) for (const claimId of source.evidenceClaimIds) expect(claimIds.has(claimId)).toBe(true);
    expect(SURGERY_CENTER_SERVICE_CONTRACTS.filter((item) => item.delivery === "new_external_contract_required").map((item) => item.serviceId).sort()).toEqual([
      "service.anoscopy",
      "service.esophageal_manometry",
      "service.thyroid_fna",
    ]);
    expect(SURGERY_CENTER_SERVICE_CONTRACTS.find((item) => item.serviceId === "service.skin_excisional_biopsy")).toMatchObject({
      delivery: "existing_balance_contract",
      allowedRouteIds: ["route.skin_excisional_biopsy.in_house", "route.skin_excisional_biopsy.outsourced"],
    });
  });

  it("binds exactly the finalized twelve production content files to the owner-delegated receipt", () => {
    const receipt = readFileSync(resolve(ROOT, RECEIPT), "utf8");
    const receiptConceptIds = [...receipt.matchAll(/^\d+\. `(concept\.[^`]+)`$/gm)].map((match) => match[1]);
    expect(receiptConceptIds).toEqual(SURGERY_CENTER_AUTHORING_CONCEPTS.map((item) => item.id));
    const rows = [...receipt.matchAll(/\| `([a-f0-9]{64})` \| `([^`]+\.ts)` \|/g)];
    expect(rows).toHaveLength(RECEIPT_PATHS.length);
    expect(rows.map((match) => match[2])).toEqual(RECEIPT_PATHS);
    for (const [, expected, path] of rows) {
      const canonical = readFileSync(resolve(ROOT, path!), "utf8").replace(/\r\n/g, "\n");
      expect(createHash("sha256").update(canonical, "utf8").digest("hex"), path).toBe(expected);
    }
  });
});
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
