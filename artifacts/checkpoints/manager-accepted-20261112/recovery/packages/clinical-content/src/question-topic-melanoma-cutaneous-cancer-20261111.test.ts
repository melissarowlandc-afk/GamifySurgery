import {topicQuestionAcceptance} from "./question-program-batch5-acceptance-test-support";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { syntheticClinicalReleaseSchema, answerChoiceTimingRegistryEntrySchema } from "./schema";
import { QUESTION_QUALITY_QUESTIONS } from "./question-quality-pilot-20261028";
import { SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";
import { PROTOTYPE_BALANCE_RELEASE } from "../../balance-config/src/prototype-balance";
import { materializePatientName } from "../../game-domain/src/patientText";
import {
  MELANOMA_TOPIC_REVIEW, MELANOMA_TOPIC_PREVIEW_RELEASE, MELANOMA_TOPIC_CASES,
  MELANOMA_TOPIC_QUESTIONS, MELANOMA_TOPIC_CONCEPTS, MELANOMA_TOPIC_AUTHORING_CONCEPTS,
  MELANOMA_TOPIC_CLAIMS, MELANOMA_TOPIC_SOURCES, MELANOMA_TOPIC_SOURCE_LINKS,
  MELANOMA_TOPIC_AUTHOR_CHECKS, MELANOMA_TOPIC_TIMING_ENTRIES,
  MELANOMA_TOPIC_EXACT_ORDER_PROPOSALS, MELANOMA_TOPIC_STATEMENT_MAPPINGS,
  MELANOMA_TOPIC_CLAIM_TO_QUESTION, MELANOMA_TOPIC_CASE_REVIEWS, MELANOMA_TOPIC_SPECS,
  MELANOMA_TOPIC_ROUND1_QUESTIONS, MELANOMA_TOPIC_ROUND1_CASES, MELANOMA_TOPIC_ROUND1_PREVIEW_RELEASE, MELANOMA_TOPIC_PARKED_SLUGS,
} from "./question-topic-melanoma-cutaneous-cancer-20261111";

const read = (file: string) => readFileSync(new URL(`../../../${file}`, import.meta.url), "utf8");
const packet = JSON.parse(read("docs/research/question-topic-melanoma-cutaneous-cancer-20261111.json"));
const ledger = JSON.parse(read("docs/research/sources-question-topic-melanoma-cutaneous-cancer-20261111.json"));
const program = JSON.parse(read("docs/research/question-topic-program-20261111.json"));
const digest = (v: unknown) => createHash("sha256").update(typeof v === "string" ? v : JSON.stringify(v)).digest("hex");
const nodes = MELANOMA_TOPIC_CASES.flatMap(c => c.decisionNodes);
const unique = (values: string[]) => new Set(values).size === values.length;

describe("melanoma/cutaneous-cancer explicit-import topic sidecar", () => {
  it("validates the clinic-only preview through the existing normal release schema", () => {
    const result = syntheticClinicalReleaseSchema.safeParse(MELANOMA_TOPIC_PREVIEW_RELEASE);
    expect(result.success, JSON.stringify(result.error?.issues)).toBe(true);
    expect(MELANOMA_TOPIC_CASES).toHaveLength(13);
    expect(nodes).toHaveLength(13);
    expect(MELANOMA_TOPIC_CASES.every(c => c.decisionNodes.length === 1)).toBe(true);
    expect(syntheticClinicalReleaseSchema.safeParse(MELANOMA_TOPIC_ROUND1_PREVIEW_RELEASE).success).toBe(true);
  });

  it("reconciles every exact assigned inventory, concept, case, node and variant row", () => {
    const assigned = program.inventory.filter((r: any) => r.primaryTopicSlug === "melanoma-cutaneous-cancer");
    expect(assigned).toHaveLength(86);
    expect(packet.assignment.inventory).toEqual(assigned);
    expect(packet.audit.map((a: any) => a.inventoryRecordId).sort()).toEqual(assigned.map((r: any) => r.recordId).sort());
    for (const key of ["concepts", "caseAssignments", "nodeAssignments", "variantAssignments"]) {
      expect(packet.assignment[key]).toEqual(program[key].filter((r: any) => r.primaryTopicSlug === "melanoma-cutaneous-cancer"));
    }
    expect(packet.counts).toMatchObject({ audited: 86, kept: 10, rewritten: 9, retiredAndReplacedProposed: 67, totalAuthoredDrafts: 13, liveAuditRows: 36, retainedAuditRows: 50, reusedConcepts: 4, newMeanings: 7 });
    expect(packet.assignment.unkeyedDraftSlots).toEqual([]);
    expect(packet.assignment.withheldTeachingPoints).toEqual([]);
    expect(packet.assignment.identityReuseNotes).toEqual([]);
  });

  it("has a concrete verdict, exact before hash and supported successor for all audit rows", () => {
    const knownVariants = new Set([...packet.assignment.variantAssignments.map((r: any) => r.variantId), ...MELANOMA_TOPIC_QUESTIONS.map(q => q.id), ...MELANOMA_TOPIC_ROUND1_QUESTIONS.map(q => q.id)]);
    for (const a of packet.audit) {
      expect(["Keep", "Rewrite", "Retire-and-replace"]).toContain(a.verdict);
      expect(a.reasons.length).toBeGreaterThan(0);
      expect(a.reasons.every((s: string) => s.length > 40)).toBe(true);
      const before = packet.beforeCaptures.find((r: any) => r.recordId === a.inventoryRecordId);
      expect(digest(before.question)).toBe(a.beforeQuestionSha256);
      expect(before.question.id).toBe(a.variantIds[0]);
      expect(before.question.contentVersion).toBe(a.contentVersion);
      for (const v of a.replacementVariantIds) expect(knownVariants.has(v), v).toBe(true);
      if (a.verdict !== "Keep") expect(a.replacementVariantIds.length).toBeGreaterThan(0);
    }
  });

  it("preserves all assigned source files and exact freeze/approval references", () => {
    for (const s of packet.assignment.snapshot.sourceHashes) {
      expect(digest(read(s.file)), s.file).toBe(s.currentSha256);
      expect(s.currentSha256).toBe(s.snapshotSha256);
    }
    expect(packet.assignment.frozenReferences).toHaveLength(7);
    for (const f of packet.assignment.frozenReferences) {
      expect(digest(read(f.recordFile)), f.recordFile).toBe(f.recordFileSha256);
      expect(packet.audit.find((a: any) => a.variantIds.includes(f.variantId)).verdict).toBe("Keep");
      if (f.approvedQuestion) {
        const current = QUESTION_QUALITY_QUESTIONS.find(q => q.id === f.variantId);
        expect(current).toEqual(f.approvedQuestion);
        expect(digest(current)).toBe(f.approvedQuestionSha256);
        expect(current?.lastClinicianReview?.reviewer).toBe("Melissa Rowland (clinical sign-off)");
      }
      const clinicalCase = SYNTHETIC_CLINICAL_RELEASE.cases.find(c => c.decisionNodes.some(n => n.questionVariantId === f.variantId));
      expect(digest(clinicalCase), f.variantId).toBe(f.capturedDefaultCaseSha256);
    }
  });

  it("keeps the inherited owner hold and quality park outside emitted questions", () => {
    expect(packet.assignment.recordedHolds.map((r: any) => r.id).sort()).toEqual([
      "review.n3.small-skin-cancer-with-adverse-histology.v2",
      "review.n4.melanoma-depth-before-flap-and-sentinel-node.v1",
    ].sort());
    const emitted = new Set(MELANOMA_TOPIC_QUESTIONS.map(q => q.id));
    expect(emitted.has("question.n3.small-skin-cancer-with-adverse-histology.v2")).toBe(false);
    expect(emitted.has("question.n4.melanoma-depth-before-flap-and-sentinel-node.v1")).toBe(false);
    expect(packet.ownerApprovalsNeeded[0].affectedVariants).toContain("question.n3.small-skin-cancer-with-adverse-histology.v2");
    expect(packet.withheldNewTeachingPoints).toHaveLength(5);
  });

  it("has unique stable identities and one correct randomized runtime choice per node", () => {
    for (const values of [MELANOMA_TOPIC_CASES.map(c => c.id), nodes.map(n => n.id), nodes.map(n => n.questionVariantId), MELANOMA_TOPIC_CONCEPTS.map(c => c.id), nodes.flatMap(n => n.answerChoices.map(a => a.id))]) {
      expect(unique(values)).toBe(true);
      expect(values.every(id => /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(id) && id.length <= 120)).toBe(true);
    }
    for (const n of nodes) {
      expect(n.shuffleAnswers).toBe(true);
      expect(n.answerChoices).toHaveLength(3);
      expect(n.answerChoices.filter(a => a.isCorrect)).toHaveLength(1);
    }
    expect(new Set(nodes.map(n => n.primaryConceptId))).toEqual(new Set(MELANOMA_TOPIC_CONCEPTS.map(c => c.id)));
  });

  it("keeps every new authored clinical record unapproved and separates the author gate", () => {
    for (const r of [MELANOMA_TOPIC_REVIEW, ...MELANOMA_TOPIC_QUESTIONS, ...MELANOMA_TOPIC_CLAIMS, ...MELANOMA_TOPIC_SOURCES, ...MELANOMA_TOPIC_AUTHORING_CONCEPTS, ...MELANOMA_TOPIC_CASE_REVIEWS, ...MELANOMA_TOPIC_AUTHOR_CHECKS]) {
      expect(r.reviewStatus).toBe("needs_clinician_review");
      expect(r.aiAssistedDrafting).toBe(true);
      expect(r.lastClinicianReview).toBeNull();
    }
    for (const a of MELANOMA_TOPIC_AUTHOR_CHECKS) {
      expect(a.pipelinePassed).toBe(false);
      expect(a.clinicianApprovalConferred).toBe(false);
    }
  });

  it("binds concrete five-part author checks and source mappings to each exact after version", () => {
    expect(packet.authoredItems).toHaveLength(13);
    for (const q of MELANOMA_TOPIC_QUESTIONS) {
      const item = packet.authoredItems.find((r: any) => r.questionVariantId === q.id);
      expect(item.after.question).toEqual(q);
      expect(item.afterQuestionSha256).toBe(digest(q));
      expect(item.authorGate.exactQuestionSha256).toBe(digest(q));
      expect(item.authorGate.exactCaseSha256).toBe(digest(item.after.clinicalCase));
      expect(item.authorGate.reasoningSteps).toHaveLength(2);
      for (const field of ["cueAttack", "decisionStage", "closestError", "decidingObservation", "consequence", "deletionTest", "counterfactual", "difficultyReason", "sequenceReview", "repairAndRecheck"]) {
        expect(typeof item.authorGate[field]).toBe("string");
        expect(item.authorGate[field].length, `${q.id} ${field}`).toBeGreaterThan(30);
      }
      if (item.before) for (const b of item.before) expect(packet.audit.some((a: any) => a.inventoryRecordId === b.inventoryRecordId && a.replacementVariantIds.includes(item.reviewedQuestionVariantId))).toBe(true);
      expect(MELANOMA_TOPIC_STATEMENT_MAPPINGS.find(x => x.questionVariantId === q.id)?.taskAndKeyClaimIds).toEqual(q.supportingEvidenceClaimIds);
    }
  });

  it("preserves four existing meanings and seven active topic meanings without changing concept IDs", () => {
    const preserved = MELANOMA_TOPIC_AUTHORING_CONCEPTS.filter(c => !c.id.startsWith("concept.topic."));
    expect(preserved).toHaveLength(4);
    for (const c of preserved) {
      const original = packet.assignment.concepts.find((r: any) => r.conceptId === c.id);
      expect(c.learningObjective).toBe(original.learningObjective);
      expect(c.identityPolicy).toContain("retain stable concept ID");
    }
    expect(MELANOMA_TOPIC_AUTHORING_CONCEPTS.filter(c => c.id.startsWith("concept.topic."))).toHaveLength(7);
    for (const item of packet.authoredItems) {
      const prior = packet.round1AuthoredItems.find((r: any) => r.questionVariantId === item.reviewedQuestionVariantId);
      expect(item.conceptId).toBe(prior.conceptId);
    }
    expect(packet.counts.registryOnlyReactivation).toEqual(["concept.pigmented-skin-lesion.complete-diagnostic-biopsy"]);
  });

  it("uses named consistent finite clinic profiles and no new inpatient setting", () => {
    for (const c of MELANOMA_TOPIC_CASES) {
      expect(c.requiredClinicalSetting).toBe("clinic");
      expect(c.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(c.approvedInstantiationProfiles).toHaveLength(1);
      expect(c.presentation).toContain("{patientName}");
      expect(c.presentation).toContain(`${c.prototypeDemographics!.ageYears}-year-old`);
      expect(c.presentation).toContain(c.prototypeDemographics!.sexLabel === "Female" ? "woman" : "man");
      expect(c.approvedInstantiationProfiles![0]!.presentation).toBe(c.presentation);
      expect(c.tutorialEligible).toBe(false);
      const generatedName = c.prototypeDemographics!.sexLabel === "Female" ? "Simone Walker" : "Adrian Walker";
      const materialized = materializePatientName(c, generatedName);
      expect(materialized.patientDisplayName).toBe(generatedName);
      expect(materialized.presentation).toContain(generatedName);
      const visible = [materialized.presentation, ...materialized.decisionNodes.flatMap(n => [n.stem, n.currentUpdate ?? "", n.explanation])].join(" ");
      expect(visible).not.toContain("{patientName}");
      expect(visible).not.toContain(c.patientDisplayName);
      expect(visible).not.toMatch(new RegExp(`\\b${c.patientDisplayName.split(" ")[0]}\\b`));
    }
    expect(MELANOMA_TOPIC_CASE_REVIEWS.every(r => r.educationalTier === 1 && r.acuity === "stable" && r.earliestFacilityStage === 1)).toBe(true);
    expect(MELANOMA_TOPIC_CASES.some(c => c.id.includes("bcc-post-hedgehog") && c.decisionNodes.length === 1)).toBe(true);
  });

  it("maps every testing choice by exact identity and label to an existing placeholder profile", () => {
    const profiles = new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map(p => p.id));
    for (const t of MELANOMA_TOPIC_TIMING_ENTRIES) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(t).success).toBe(true);
      const node = nodes.find(n => n.id === t.nodeId)!;
      if (t.classification.kind === "test_choices") {
        expect(t.classification.choices.map(a => [a.choiceId, a.choiceLabel])).toEqual(node.answerChoices.map(a => [a.id, a.label]));
        for (const a of t.classification.choices) if (a.timing.kind === "test") expect(profiles.has(a.timing.timingProfileId), a.timing.timingProfileId).toBe(true);
      }
    }
    for (const spec of MELANOMA_TOPIC_SPECS.flatMap(c => c.nodes)) {
      const timing = MELANOMA_TOPIC_TIMING_ENTRIES.find(t => t.questionVariantId.includes(`.${spec.slug}.v`))!;
      for (const a of spec.choices) if (a.timing.kind === "test") {
        expect(timing.classification.kind).toBe("test_choices");
        if (timing.classification.kind === "test_choices") expect(timing.classification.choices.find(x => x.choiceId === `${spec.slug}.${a.key}`)?.timing).toEqual(a.timing);
      }
    }
    const currentTesting = MELANOMA_TOPIC_EXACT_ORDER_PROPOSALS.filter(r => r.timing.kind === "test");
    expect(currentTesting.length).toBeGreaterThan(20);
    expect(currentTesting.every(r => profiles.has(r.timing.kind === "test" ? r.timing.timingProfileId : ""))).toBe(true);
  });

  it("does not turn a timing estimate or later outside record into an executed order", () => {
    for (const n of nodes) {
      expect(n.resultGateAfter).toBeNull();
      expect(n.answerChoices.every(a => a.serviceRequest === null)).toBe(true);
      expect([n.stem, n.currentUpdate ?? "", n.explanation].join(" ")).not.toMatch(/\b\d+\s*(minutes?|hours?|days?|ticks?)\b/i);
    }
    expect(MELANOMA_TOPIC_EXACT_ORDER_PROPOSALS).toHaveLength(nodes.length * 3);
    expect(MELANOMA_TOPIC_EXACT_ORDER_PROPOSALS.every(r => r.execution === "presentation_only_existing_placeholder" && r.serviceRequest === null && r.resultGateAfter === null)).toBe(true);
  });

  it("has full source metadata, atomic claims, safe links and reversible statement mappings", () => {
    expect(ledger.sourceRecords).toEqual(MELANOMA_TOPIC_SOURCES);
    expect(ledger.evidenceClaims).toEqual(MELANOMA_TOPIC_CLAIMS);
    expect(ledger.statementMappings).toEqual(MELANOMA_TOPIC_STATEMENT_MAPPINGS);
    for (const s of MELANOMA_TOPIC_SOURCES) {
      for (const key of ["completeCitation", "organizationOrJournal", "licenseLabel", "reuseStatus", "reuseNotes", "authorityAssessment"]) expect(String(s[key as keyof typeof s]).length).toBeGreaterThan(10);
      expect(s.authors.length).toBeGreaterThan(0);
      expect(s.officialUrl).toMatch(/^https:\/\//);
      expect(s.accessedOn).toBe("2026-11-11");
      expect([...s.evidenceClaimIds].sort()).toEqual(MELANOMA_TOPIC_CLAIMS.filter(c => c.sourceIds.includes(s.id)).map(c => c.id).sort());
    }
    for (const q of MELANOMA_TOPIC_QUESTIONS) for (const id of q.supportingEvidenceClaimIds) {
      const claim = MELANOMA_TOPIC_CLAIMS.find(c => c.id === id)!;
      expect(claim).toBeDefined();
      expect(claim.lastCheckedOn).toBe("2026-11-11");
      expect(claim.limitation).toBeTruthy();
      for (const s of claim.sourceIds) expect(MELANOMA_TOPIC_SOURCES.some(x => x.id === s)).toBe(true);
      expect(MELANOMA_TOPIC_CLAIM_TO_QUESTION.find(c => c.claimId === id)?.questionVariantIds).toContain(q.id);
    }
    for (const l of MELANOMA_TOPIC_SOURCE_LINKS) expect(l).toMatchObject({ target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer" });
  });

  it("keeps the Markdown review packet complete, singular and bound to the exact after versions", () => {
    const md = read("docs/research/question-topic-melanoma-cutaneous-cancer-20261111.md");
    expect(md.match(/^### Before: /gm)).toHaveLength(86);
    expect(md.match(/^### After: /gm)).toHaveLength(13);
    expect(md.match(/^### Review disposition: /gm)).toHaveLength(18);
    expect(md.match(/^### Atomic claim ledger/gm)).toHaveLength(1);
    expect(md.match(/^## Owner approvals needed/gm)).toHaveLength(1);
    expect(md.match(/^```/gm)!.length % 2).toBe(0);
    for (const item of packet.authoredItems) {
      expect(md).toContain(item.authorGate.exactQuestionSha256);
      expect(md).toContain(item.authorGate.exactCaseSha256);
      expect(md).toContain(item.after.question.explanation);
    }
  });


  it("preserves every independently reviewed PASS question and entire single-node case exactly", () => {
    const reviewFile = packet.reviewRound2.reviewFile;
    expect(digest(read(reviewFile))).toBe(packet.reviewRound2.reviewFileSha256);
    const review = JSON.parse(read(reviewFile));
    expect(review.filter((r: any) => r.verdict === "PASS")).toHaveLength(3);
    for (const r of review.filter((r: any) => r.verdict === "PASS")) {
      const old = packet.round1AuthoredItems.find((i: any) => i.questionVariantId === r.id);
      const q = MELANOMA_TOPIC_QUESTIONS.find(q => q.id === r.id);
      const c = MELANOMA_TOPIC_CASES.find(c => c.id === old.caseId);
      expect(q).toEqual(old.after.question);
      expect(c).toEqual(old.after.clinicalCase);
      expect(digest(q)).toBe(old.afterQuestionSha256);
      expect(digest(c)).toBe(old.afterCaseSha256);
      expect(packet.authoredItems.find((i: any) => i.questionVariantId === r.id).itemStatus).toBe("pass-preserved");
    }
  });

  it("records one repair attempt per returned item and excludes every park from active supply", () => {
    expect(packet.reviewRound2.counts).toEqual({ reviewed: 18, passPreserved: 3, revised: 10, parked: 5, currentCases: 13, currentScoredNodes: 13, currentMultipartCases: 0 });
    expect(packet.reviewRound2.items).toHaveLength(18);
    for (const r of packet.reviewRound2.originalReview) {
      const item = packet.reviewRound2.items.find((i: any) => i.reviewedQuestionVariantId === r.id);
      expect(["pass-preserved", "revised", "parked"]).toContain(item.itemStatus);
      expect(item.revisionAttempts).toBe(r.verdict === "PASS" ? 0 : 1);
      expect(item.resolutionOfEachFinding.length).toBe(["clarityIssues", "cues", "fairness", "suggestions"].reduce((sum, field) => sum + r[field].length, 0));
      if (item.itemStatus === "revised") {
        expect(item.currentQuestionVariantId).toBe(r.id.replace(/\.v1$/, ".v2"));
        expect(item.independentReview).not.toContain("PASS_exact");
        expect(MELANOMA_TOPIC_QUESTIONS.some(q => q.id === r.id)).toBe(false);
      }
      if (item.itemStatus === "parked") {
        expect(item.currentQuestionVariantId).toBeNull();
        expect(item.parkReason.length).toBeGreaterThan(100);
        expect(item.repairAttempt.length).toBeGreaterThan(100);
      }
    }
    for (const slug of MELANOMA_TOPIC_PARKED_SLUGS) {
      expect(MELANOMA_TOPIC_QUESTIONS.some(q => q.id.includes(`.${slug}.`))).toBe(false);
      expect(MELANOMA_TOPIC_CASES.some(c => c.decisionNodes.some(n => n.questionVariantId.includes(`.${slug}.`)))).toBe(false);
    }
    expect(packet.parkedItems).toHaveLength(5);
    expect(packet.authoredItems.filter((i: any) => i.itemStatus === "revised")).toHaveLength(10);
  });

  it("retains all eighteen original reviewed question and case snapshots as a noncurrent archive", () => {
    expect(MELANOMA_TOPIC_ROUND1_QUESTIONS).toHaveLength(18);
    expect(MELANOMA_TOPIC_ROUND1_CASES).toHaveLength(14);
    for (const old of packet.round1AuthoredItems) {
      expect(MELANOMA_TOPIC_ROUND1_QUESTIONS.find(q => q.id === old.questionVariantId)).toEqual(old.after.question);
      expect(MELANOMA_TOPIC_ROUND1_CASES.find(c => c.id === old.caseId)).toEqual(old.after.clinicalCase);
      expect(digest(old.after.question)).toBe(old.afterQuestionSha256);
      expect(digest(old.after.clinicalCase)).toBe(old.afterCaseSha256);
    }
  });

  it("remains absent from the default release and shared exports", () => {
    const live = new Set(SYNTHETIC_CLINICAL_RELEASE.cases.flatMap(c => c.decisionNodes.map(n => n.questionVariantId)));
    for (const question of MELANOMA_TOPIC_QUESTIONS) expect(live.has(question.id)).toBe(topicQuestionAcceptance(question.id).live);
    for (const file of ["packages/clinical-content/src/index.ts", "packages/clinical-content/src/synthetic-content.ts", "packages/clinical-content/src/question-ship-manifest.ts"]) {
      expect(read(file)).not.toContain("question-topic-melanoma-cutaneous-cancer-20261111");
    }
  });
});
