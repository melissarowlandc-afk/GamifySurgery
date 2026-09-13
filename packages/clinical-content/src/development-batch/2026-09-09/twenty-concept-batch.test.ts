/// <reference types="node" />

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { SYNTHETIC_CLINICAL_RELEASE } from "../../synthetic-content";
import {
  TWENTY_CONCEPT_BATCH_CASES,
  TWENTY_CONCEPT_BATCH_CLAIMS,
  TWENTY_CONCEPT_BATCH_CONCEPTS,
  TWENTY_CONCEPT_BATCH_MANIFEST,
  TWENTY_CONCEPT_BATCH_QUESTIONS,
  TWENTY_CONCEPT_BATCH_SOURCES,
} from "./twenty-concept-batch";

const ROOT = fileURLToPath(new URL("../../../../../", import.meta.url));
const RECEIPT = "docs/clinical-workbench/approvals/owner-delegated-twenty-concept-batch-2026-09-09.md";

describe("twenty-concept exact development batch", () => {
  it("matches its admitted manifest and preserves the global release boundary", () => {
    expect(TWENTY_CONCEPT_BATCH_CONCEPTS).toHaveLength(TWENTY_CONCEPT_BATCH_MANIFEST.conceptCount);
    expect(TWENTY_CONCEPT_BATCH_QUESTIONS).toHaveLength(TWENTY_CONCEPT_BATCH_MANIFEST.questionVariantCount);
    expect(TWENTY_CONCEPT_BATCH_CASES).toHaveLength(TWENTY_CONCEPT_BATCH_MANIFEST.caseCount);
    expect(TWENTY_CONCEPT_BATCH_CASES.filter((item) => item.decisionNodes.length > 1)).toHaveLength(TWENTY_CONCEPT_BATCH_MANIFEST.multistepCaseCount);
    expect(TWENTY_CONCEPT_BATCH_CASES.flatMap((item) => item.decisionNodes).filter((node) => node.resultGateAfter)).toHaveLength(TWENTY_CONCEPT_BATCH_MANIFEST.resultGateCount);
    expect(SYNTHETIC_CLINICAL_RELEASE.id).toBe("clinical.synthetic.prototype.v1");
    expect(SYNTHETIC_CLINICAL_RELEASE.schemaVersion).toBe(1);
    expect(SYNTHETIC_CLINICAL_RELEASE.publicationStatus).toBe("synthetic_unapproved_prototype");
  });

  it("resolves all concept, question, source, claim, and service references", () => {
    const conceptIds = new Set(TWENTY_CONCEPT_BATCH_CONCEPTS.map((item) => item.id));
    const questionIds = new Set(TWENTY_CONCEPT_BATCH_QUESTIONS.map((item) => item.id));
    const claimIds = new Set(TWENTY_CONCEPT_BATCH_CLAIMS.map((item) => item.id));
    const sourceIds = new Set(TWENTY_CONCEPT_BATCH_SOURCES.map((item) => item.id));
    expect(conceptIds.size).toBe(20);
    expect(questionIds.size).toBe(80);
    expect(claimIds.size).toBe(TWENTY_CONCEPT_BATCH_CLAIMS.length);
    expect(sourceIds.size).toBe(TWENTY_CONCEPT_BATCH_SOURCES.length);
    for (const claim of TWENTY_CONCEPT_BATCH_CLAIMS) for (const sourceId of claim.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
    for (const source of TWENTY_CONCEPT_BATCH_SOURCES) for (const claimId of source.evidenceClaimIds) expect(claimIds.has(claimId)).toBe(true);
    for (const clinicalCase of TWENTY_CONCEPT_BATCH_CASES) for (const node of clinicalCase.decisionNodes) {
      expect(conceptIds.has(node.primaryConceptId)).toBe(true);
      expect(questionIds.has(node.questionVariantId)).toBe(true);
      if (node.resultGateAfter) expect(node.answerChoices.find((choice) => choice.isCorrect)?.serviceRequest?.serviceId).toBe(node.resultGateAfter.resultTypeId);
    }
  });

  it("binds the finalized authored source and claim files to receipt hashes", () => {
    const receipt = readFileSync(resolve(ROOT, RECEIPT), "utf8");
    for (const match of receipt.matchAll(/\| `([a-f0-9]{64})` \| `([^`]+\.ts)` \|/g)) {
      const [, expected, path] = match;
      const canonical = readFileSync(resolve(ROOT, path!), "utf8").replace(/\r\n/g, "\n");
      expect(createHash("sha256").update(canonical, "utf8").digest("hex"), path).toBe(expected);
    }
    expect([...receipt.matchAll(/\| `([a-f0-9]{64})` \|/g)]).toHaveLength(10);
  });
});
