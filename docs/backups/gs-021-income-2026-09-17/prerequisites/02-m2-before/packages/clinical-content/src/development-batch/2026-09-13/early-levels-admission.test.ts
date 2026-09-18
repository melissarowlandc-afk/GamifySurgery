import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { SYNTHETIC_CLINICAL_RELEASE } from "../../synthetic-content";
import { syntheticClinicalCaseSchema } from "../../schema";
import {
  EARLY_LEVELS_20260913_AUTHORING_CONCEPTS,
  EARLY_LEVELS_20260913_BATCH_MANIFEST,
  EARLY_LEVELS_20260913_CASE_REVIEWS,
  EARLY_LEVELS_20260913_CASES,
  EARLY_LEVELS_20260913_CLAIMS,
  EARLY_LEVELS_20260913_QUESTIONS,
  EARLY_LEVELS_20260913_SERVICE_CONTRACTS,
  EARLY_LEVELS_20260913_SOURCES,
  EARLY_LEVELS_20260913_TESTED_CONCEPTS,
  EARLY_LEVELS_20260913_TIMING_ENTRIES,
} from "./early-levels-batch";

const ROOT = fileURLToPath(new URL("../../../../../", import.meta.url));
const RECEIPT = "docs/clinical-workbench/approvals/owner-delegated-early-levels-2026-09-13.md";
const RECEIPT_PATHS = [
  "packages/clinical-content/src/development-batch/2026-09-13/batch-helpers.ts",
  "packages/clinical-content/src/development-batch/2026-09-13/choledocholithiasis.ts",
  "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
  "packages/clinical-content/src/development-batch/2026-09-13/pancreatic-pseudocyst.ts",
  "packages/clinical-content/src/development-batch/2026-09-13/preoperative-gerd.ts",
  "packages/clinical-content/src/development-batch/2026-09-13/post-bariatric-hypoglycemia.ts",
  "packages/clinical-content/src/development-batch/2026-09-13/lynch-tumor.ts",
  "packages/clinical-content/src/development-batch/2026-09-13/chronic-anal-fissure.ts",
  "packages/clinical-content/src/development-batch/2026-09-13/cutaneous-scc.ts",
  "packages/clinical-content/src/development-batch/2026-09-13/venous-leg-ulcer.ts",
  "packages/clinical-content/src/development-batch/2026-09-13/splenectomy-infection-prevention.ts",
  "packages/clinical-content/src/development-batch/2026-09-13/early-levels-batch.ts",
] as const;

describe("September 13 early-level batch admission", () => {
  it("admits the exact additive batch once after the historical wording overlay", () => {
    expect(EARLY_LEVELS_20260913_AUTHORING_CONCEPTS).toHaveLength(20);
    expect(EARLY_LEVELS_20260913_TESTED_CONCEPTS).toHaveLength(20);
    expect(EARLY_LEVELS_20260913_QUESTIONS).toHaveLength(80);
    expect(EARLY_LEVELS_20260913_CASES).toHaveLength(52);
    expect(EARLY_LEVELS_20260913_CASES.flatMap((item) => item.decisionNodes)).toHaveLength(80);
    expect(EARLY_LEVELS_20260913_CASES.flatMap((item) => item.decisionNodes).filter((node) => node.resultGateAfter)).toHaveLength(28);
    expect(EARLY_LEVELS_20260913_TIMING_ENTRIES).toHaveLength(80);
    expect(EARLY_LEVELS_20260913_CASE_REVIEWS).toHaveLength(52);
    expect(EARLY_LEVELS_20260913_CLAIMS).toHaveLength(21);
    expect(EARLY_LEVELS_20260913_SOURCES).toHaveLength(20);
    expect(EARLY_LEVELS_20260913_BATCH_MANIFEST).toMatchObject({authoringConceptCount:20,testedConceptCount:20,questionVariantCount:80,caseCount:52,decisionNodeCount:80,multistepCaseCount:28,resultGateCount:28,caseReviewCount:52,sourceCount:20,evidenceClaimCount:21,serviceContractCount:7,timingEntryCount:80,publicReleaseAuthorized:false});
    expect(SYNTHETIC_CLINICAL_RELEASE.concepts).toHaveLength(183);
    expect(SYNTHETIC_CLINICAL_RELEASE.cases).toHaveLength(450);
    expect(SYNTHETIC_CLINICAL_RELEASE.cases.flatMap((item) => item.decisionNodes)).toHaveLength(703);
    for (const clinicalCase of EARLY_LEVELS_20260913_CASES) {
      expect(syntheticClinicalCaseSchema.parse(clinicalCase)).toEqual(clinicalCase);
      expect(SYNTHETIC_CLINICAL_RELEASE.cases.filter((item) => item.id === clinicalCase.id)).toHaveLength(1);
      expect("patientPresentationRevision" in clinicalCase).toBe(false);
    }
  });

  it("keeps provenance linked and every authored record pending clinician review", () => {
    const sourceIds=new Set(EARLY_LEVELS_20260913_SOURCES.map((item)=>item.id));
    const claimIds=new Set(EARLY_LEVELS_20260913_CLAIMS.map((item)=>item.id));
    for(const record of [...EARLY_LEVELS_20260913_AUTHORING_CONCEPTS,...EARLY_LEVELS_20260913_QUESTIONS,...EARLY_LEVELS_20260913_CLAIMS,...EARLY_LEVELS_20260913_SOURCES,...EARLY_LEVELS_20260913_CASE_REVIEWS]){expect(record.reviewStatus).toBe("needs_clinician_review");expect(record.lastClinicianReview).toBeNull();}
    for(const claim of EARLY_LEVELS_20260913_CLAIMS)for(const id of claim.sourceIds)expect(sourceIds.has(id)).toBe(true);
    for(const source of EARLY_LEVELS_20260913_SOURCES)for(const id of source.evidenceClaimIds)expect(claimIds.has(id)).toBe(true);
    for(const concept of EARLY_LEVELS_20260913_AUTHORING_CONCEPTS)for(const id of concept.evidenceClaimIds)expect(claimIds.has(id)).toBe(true);
    for(const question of EARLY_LEVELS_20260913_QUESTIONS)for(const id of question.supportingEvidenceClaimIds)expect(claimIds.has(id)).toBe(true);
    expect(EARLY_LEVELS_20260913_SERVICE_CONTRACTS.filter((item)=>item.delivery==="new_external_contract_required").map((item)=>item.serviceId).sort()).toEqual(["service.ambulatory_reflux_monitoring","service.cutaneous_lesion_biopsy","service.hepatobiliary_contrast_mrcp","service.tumor_mmr_ihc"]);
  });

  it("binds ordered concepts and LF-normalized source hashes in the owner receipt", () => {
    const receipt=readFileSync(resolve(ROOT,RECEIPT),"utf8");
    expect([...receipt.matchAll(/^\d+\. `(concept\.[^`]+)`$/gm)].map((match)=>match[1])).toEqual(EARLY_LEVELS_20260913_AUTHORING_CONCEPTS.map((item)=>item.id));
    const rows=[...receipt.matchAll(/\| `([a-f0-9]{64})` \| `([^`]+\.ts)` \|/g)];
    expect(rows).toHaveLength(RECEIPT_PATHS.length);expect(rows.map((match)=>match[2])).toEqual(RECEIPT_PATHS);
    for(const [,expected,path] of rows){const canonical=readFileSync(resolve(ROOT,path!),"utf8").replace(/\r\n/g,"\n");expect(createHash("sha256").update(canonical,"utf8").digest("hex")).toBe(expected);}
  });
});
