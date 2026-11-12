import {topicQuestionAcceptance, topicCaseIsExplicitlyLive} from "./question-program-batch5-acceptance-test-support";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getDiagnosticTimingProfileMapping, PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { QUESTION_CATALOG_RELEASE, SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";
import { QUESTION_SHIP_MANIFEST } from "./question-ship-manifest";
import { ANSWER_CHOICE_TIMING_REGISTRY } from "./answer-choice-timing";
import { QUESTION_NEW_N2_ROUND3_CASES, QUESTION_NEW_N2_ROUND3_QUESTIONS } from "./question-new-n2-round3-20261104";
import { answerChoiceTimingRegistryEntrySchema, syntheticClinicalReleaseSchema, type SyntheticClinicalCase } from "./schema";
import type { QuestionVariant } from "./pilot-schema";

const topicSlug = "esophagus-motility-achalasia";
const repositoryFile = (file: string) => new URL(`../../../${file}`, import.meta.url);
const readJson = (file: string): unknown => JSON.parse(readFileSync(repositoryFile(file), "utf8"));
const sha = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const fileSha = (file: string) => createHash("sha256").update(readFileSync(repositoryFile(file))).digest("hex");

interface AuditRow {
  inventoryRecordId: string;
  verdict: "Keep" | "Rewrite" | "Retire-and-replace";
  reasons: string[];
  variantIds: string[];
  replacementQuestionIds: string[];
  beforeContextIds: string[];
  beforeNodeSha256: string[];
}

interface BeforeContext {
  contextId: string;
  inventoryRecordIds: string[];
  case: SyntheticClinicalCase;
  node: SyntheticClinicalCase["decisionNodes"][number];
  caseSha256: string;
  nodeSha256: string;
  liveExact: boolean;
  questionVersions: Array<{ question: QuestionVariant; questionSha256: string }>;
}

interface AfterRecord {
  case: SyntheticClinicalCase;
  node: SyntheticClinicalCase["decisionNodes"][number];
  question: QuestionVariant;
  caseSha256: string;
  nodeSha256: string;
  questionSha256: string;
}

type RevisionStatus = "pass-preserved" | "revised" | "parked";
interface RevisionDisposition {
  reviewedQuestionVariantId: string;
  questionVariantId: string;
  status: RevisionStatus;
  authorRevisionAttempts: number;
  activePreview: boolean;
  reason: string;
  compositionHold: string | null;
}

interface Packet {
  reviewDisplay: string;
  assignment: {
    inventory: Array<{ recordId: string; variantIds: string[] }>;
    concepts: Array<{ conceptId: string }>;
    clinicalApprovalReferences: unknown[];
    recordedHolds: Array<{ id: string }>;
    unkeyedDraftSlots: unknown[];
    withheldTeachingPoints: unknown[];
    baseline: { sourceFiles: Array<{ file: string; sha256: string; currentSha256: string }> };
    frozenPassReferences: Array<{
      questionVariantId: string;
      reviewId: string;
      decisionFile: string;
      decisionFileSha256: string;
      clinicalApproval: boolean;
    }>;
  };
  before: BeforeContext[];
  audit: AuditRow[];
  contextAudit: Array<{ contextId: string; verdict: string; headerFinding: string; chronologyFinding: string }>;
  countSummary: Record<string, number | string>;
  identityHistory: Array<{ conceptId: string; rankedCoverage: string[] }>;
  rankedConcepts: Array<{ id: string; rank: number; rawEvidence: string; closestError: string; proposedQuestionIds: string[]; claimIds: string[] }>;
  proposals: Array<{
    creationKind: "Rewrite" | "new";
    before: unknown;
    after: AfterRecord;
    revisionBefore: AfterRecord | null;
    activeAfter: AfterRecord | null;
    reviewedQuestionVariantId: string;
    revisionStatus: RevisionStatus;
    authorRevisionAttempts: number;
    activePreview: boolean;
    parkReason: string | null;
    compositionHold: string | null;
    provisionalKeyOnly: boolean;
    authorGate: unknown;
    statementMapping: unknown;
  }>;
  unkeyedProposals: Array<{ questionVariantId: null; correctChoiceId: null }>;
  ownerApprovalsNeeded: Array<{ questionVariantIds: string[]; competingActions: string[]; boundary: string; question: string }>;
  independentReviewRound1: {
    reviewFile: string;
    sha256: string;
    clinicalApproval: boolean;
    entries: Array<{ id: string; verdict: "PASS" | "REVISE" | "FAIL" }>;
    reviewedProposals: Array<{ after: AfterRecord; authorGate: unknown; statementMapping: unknown }>;
    reviewedItems: unknown[];
    reviewedConcepts: unknown[];
    reviewedAuthoringConcepts: unknown[];
    reviewedCaseReviews: unknown[];
    reviewedTimings: unknown[];
    reviewedSourceRelease: unknown;
  };
  reviewRevision: {
    counts: Record<string, number>;
    items: RevisionDisposition[];
  };
  acceptanceSalvage: {
    status: "salvage";
    matchingReceipt: string;
    matchingReceiptSha256: string;
    skipped: Array<{ nodeId: string; questionVariantId: string; evidence: { path: string; record: { verdict: string } } }>;
    acceptedPreservation: Array<{
      receipt: { caseId: string; questionVariantId: string; nodeId: string };
      case: SyntheticClinicalCase;
      caseSha256: string;
      sourceCase: SyntheticClinicalCase;
      sourceCaseSha256: string;
      question: QuestionVariant;
      questionSha256: string;
      node: SyntheticClinicalCase["decisionNodes"][number];
      manifestRows: unknown[];
    }>;
    reviewInputs: Array<{ file: string; sha256: string }>;
    preSalvageModuleExportSha256: Record<string, string>;
  };
  salvageProposals: Array<{
    status: "salvage";
    caseId: string;
    nodeId: string;
    questionVariantId: string;
    before: AfterRecord;
    after: AfterRecord;
    clinicalNodeProjectionSha256: string;
    contextIndependentPass: boolean;
    clinicalApproval: boolean;
    addedPresentationText: boolean;
    clinicalWordingChanged: boolean;
    authorGate: unknown;
    statementMapping: unknown;
  }>;
  currentReviewScope: {
    status: "salvage";
    caseIds: string[];
    nodeIds: string[];
    questionVariantIds: string[];
    reviewOnlyThese: boolean;
  };
  salvageRevision: {
    reviewFile: string;
    reviewFileSha256: string;
    preRevisionModuleExportSha256: Record<string, string>;
    reviewedPassCaseSha256: string;
    protectedPassProposal: unknown;
    previousReviewScope: { caseIds: string[]; nodeIds: string[] };
  };
  salvageRevisionProposals: Array<{
    status: "salvage";
    caseId: string;
    nodeId: string;
    questionVariantId: string;
    before: AfterRecord;
    after: AfterRecord;
    conceptVersionChanged: boolean;
    independentPass: boolean;
    clinicalApproval: boolean;
    authorGate: unknown;
    statementMapping: unknown;
  }>;
}

const packet = readJson(`docs/research/question-topic-${topicSlug}-20261111.json`) as Packet;
const ledger = readJson(`docs/research/sources-question-topic-${topicSlug}-20261111.json`) as {
  publicationCount: number;
  claimToQuestions: Array<{ claimId: string; questionVariantIds: string[] }>;
  activeClaimToQuestions: Array<{ claimId: string; questionVariantIds: string[] }>;
  statementMappings: Array<{ questionVariantId: string; fieldMappings: Array<{ field: string; claimIds: string[] }> }>;
  sourceToClaims: Array<{ sourceId: string; claimIds: string[] }>;
  acceptanceSalvage: {
    status: "salvage";
    counts: { newClaims: number; reusedClaims: number; reusedSources: number };
    statementMappings: unknown[];
    sourcePolicy: { freshNetworkRetrieval: boolean; sourceAccessDatesPreserved: boolean; claimCheckDatesPreserved: boolean };
    claimToCases: Array<{ claimId: string; contexts: Array<{ caseId: string; nodeId: string; questionVariantId: string; status: string }> }>;
  };
  salvageRevision: {
    statementMappings: unknown[];
    claimToCases: Array<{ claimId: string; caseId: string; nodeId: string; questionVariantId: string; status: string }>;
  };
};
const beforeImport = {
  release: sha(SYNTHETIC_CLINICAL_RELEASE),
  manifest: sha(QUESTION_SHIP_MANIFEST),
  timing: sha(ANSWER_CHOICE_TIMING_REGISTRY),
};
const topic = await import("./question-topic-esophagus-motility-achalasia-20261111");
const allQuestions = [...new Map([
  ...topic.MOTILITY_TOPIC_REVIEWED_V1_QUESTIONS,
  ...topic.MOTILITY_TOPIC_CATALOG_QUESTIONS,
].map((q) => [q.id, q])).values()];

describe("esophagus motility and achalasia authoring sidecar", () => {
  it("loads through its explicit import and validates the existing release schema", () => {
    expect(syntheticClinicalReleaseSchema.safeParse(topic.MOTILITY_TOPIC_SOURCE_RELEASE).success).toBe(true);
    expect(topic.MOTILITY_TOPIC_SOURCE_RELEASE.cases).toEqual(topic.MOTILITY_TOPIC_CASES);
    expect(topic.MOTILITY_TOPIC_CASES).toHaveLength(5);
    expect(topic.MOTILITY_TOPIC_QUESTIONS).toHaveLength(6);
    expect(topic.MOTILITY_TOPIC_CONCEPTS).toHaveLength(6);
    expect(new Set(topic.MOTILITY_TOPIC_QUESTIONS.map((q) => q.id)).size).toBe(6);
    expect(new Set(topic.MOTILITY_TOPIC_CONCEPTS.map((c) => c.id)).size).toBe(6);
    expect(topic.MOTILITY_TOPIC_CATALOG_QUESTIONS).toHaveLength(10);
    expect(allQuestions).toHaveLength(17);
  });

  it("preserves the default release, manifest, timing registry and all frozen question identities", () => {
    expect({ release: sha(SYNTHETIC_CLINICAL_RELEASE), manifest: sha(QUESTION_SHIP_MANIFEST), timing: sha(ANSWER_CHOICE_TIMING_REGISTRY) }).toEqual(beforeImport);
    const liveVariants = new Set(SYNTHETIC_CLINICAL_RELEASE.cases.flatMap((c) => c.decisionNodes.map((n) => n.questionVariantId)));
    const acceptedIds = new Set(packet.acceptanceSalvage.acceptedPreservation.map((row) => row.receipt.questionVariantId));
    for (const question of topic.MOTILITY_TOPIC_QUESTIONS) {
      expect(liveVariants.has(question.id)).toBe(acceptedIds.has(question.id));
      expect(QUESTION_SHIP_MANIFEST.accepted.some((row) => row.questionVariantId === question.id)).toBe(acceptedIds.has(question.id));
    }
    const liveTopicInputs = packet.before.filter((row) => row.liveExact);
    expect(liveTopicInputs).toHaveLength(8);
    for (const before of liveTopicInputs) {
      const live = SYNTHETIC_CLINICAL_RELEASE.cases.find((c) => c.id === before.case.id);
      if (!live) {
        const replacement = QUESTION_SHIP_MANIFEST.replacements.find((row) => row.replaces === before.case.id);
        expect(replacement).toBeDefined();
        expect(acceptedIds.has(replacement!.with)).toBe(true);
      }
      const current = live ?? QUESTION_CATALOG_RELEASE.cases.find((c) => c.id === before.case.id)!;
      expect(sha(current)).toBe(before.caseSha256);
      expect(sha(current.decisionNodes.find((n) => n.questionVariantId === before.node.questionVariantId))).toBe(before.nodeSha256);
    }
  });

  it("reconciles every primary-topic record, variant and registry-only identity", () => {
    const program = readJson("docs/research/question-topic-program-20261111.json") as {
      inventory: Array<{ recordId: string; primaryTopicSlug: string }>;
      concepts: Array<{ conceptId: string; primaryTopicSlug: string }>;
    };
    const assigned = program.inventory.filter((row) => row.primaryTopicSlug === topicSlug);
    expect(packet.audit.map((row) => row.inventoryRecordId).sort()).toEqual(assigned.map((row) => row.recordId).sort());
    expect(packet.assignment.inventory.map((row) => row.recordId).sort()).toEqual(assigned.map((row) => row.recordId).sort());
    expect(new Set(packet.audit.map((row) => row.inventoryRecordId)).size).toBe(55);
    expect(packet.identityHistory.map((row) => row.conceptId).sort()).toEqual(program.concepts.filter((row) => row.primaryTopicSlug === topicSlug).map((row) => row.conceptId).sort());
    expect(packet.identityHistory).toHaveLength(12);
    expect(packet.identityHistory.every((row) => row.rankedCoverage.length > 0)).toBe(true);
    expect(packet.audit.filter((row) => row.verdict === "Keep")).toHaveLength(10);
    expect(packet.audit.filter((row) => row.verdict === "Rewrite")).toHaveLength(1);
    expect(packet.audit.filter((row) => row.verdict === "Retire-and-replace")).toHaveLength(44);
    for (const row of packet.audit) {
      expect(row.reasons).toHaveLength(2);
      expect(row.reasons.join(" ").length).toBeGreaterThan(100);
      expect(row.beforeContextIds.length).toBeGreaterThan(0);
      expect(row.beforeNodeSha256.every((hash) => /^[a-f0-9]{64}$/.test(hash))).toBe(true);
      expect(row.replacementQuestionIds.every((id) => topic.MOTILITY_TOPIC_REVIEWED_V1_QUESTIONS.some((q) => q.id === id))).toBe(true);
    }
  });

  it("preserves exact historical snapshots, current source files and the held N2 before-version", () => {
    expect(packet.before).toHaveLength(83);
    expect(packet.contextAudit.map((row) => row.contextId).sort()).toEqual(packet.before.map((row) => row.contextId).sort());
    for (const before of packet.before) {
      expect(sha(before.case)).toBe(before.caseSha256);
      expect(sha(before.node)).toBe(before.nodeSha256);
      expect(before.case.decisionNodes.some((node) => sha(node) === before.nodeSha256)).toBe(true);
      expect(packet.audit.some((row) => row.beforeContextIds.includes(before.contextId))).toBe(true);
      for (const q of before.questionVersions) expect(sha(q.question)).toBe(q.questionSha256);
    }
    const sharedAssemblyFiles = new Set([
      "packages/clinical-content/src/index.ts",
      "packages/clinical-content/src/synthetic-content.ts",
    ]);
    for (const input of packet.assignment.baseline.sourceFiles.filter((row) => !sharedAssemblyFiles.has(row.file))) {
      expect(fileSha(input.file), input.file).toBe(input.currentSha256);
      expect(input.currentSha256).toBe(input.sha256);
    }
    const oldCase = QUESTION_NEW_N2_ROUND3_CASES.find((c) => c.id === "case.n2.solid-meal-manometry-provocation.v1")!;
    const oldQuestion = QUESTION_NEW_N2_ROUND3_QUESTIONS.find((q) => q.id === "question.n2.solid-meal-manometry-provocation.v3")!;
    expect(packet.before.some((row) => row.caseSha256 === sha(oldCase))).toBe(true);
    expect(packet.before.some((row) => row.questionVersions.some((q) => q.questionSha256 === sha(oldQuestion)))).toBe(true);
    expect(packet.assignment.recordedHolds.map((hold) => hold.id)).toEqual(["review.n2.solid-meal-manometry-provocation.v3"]);
  });

  it("keeps original review decisions separate from new author checks and clinical approval", () => {
    expect(packet.assignment.frozenPassReferences).toHaveLength(10);
    for (const reference of packet.assignment.frozenPassReferences) {
      expect(fileSha(reference.decisionFile)).toBe(reference.decisionFileSha256);
      expect(reference.clinicalApproval).toBe(false);
      expect(packet.audit.find((row) => row.variantIds.includes(reference.questionVariantId))!.verdict).toBe("Keep");
    }
    expect(packet.assignment.clinicalApprovalReferences).toEqual([]);
    expect(topic.MOTILITY_TOPIC_MANIFEST.independentPass).toBe(false);
    expect(topic.MOTILITY_TOPIC_MANIFEST.managerAccepted).toBe(false);
    expect(topic.MOTILITY_TOPIC_MANIFEST.clinicalApproval).toBe(false);
    expect(packet.assignment.unkeyedDraftSlots).toEqual([]);
    expect(packet.assignment.withheldTeachingPoints).toEqual([]);
    expect(packet.unkeyedProposals).toHaveLength(4);
    for (const slot of packet.unkeyedProposals) {
      expect(slot.questionVariantId).toBeNull();
      expect(slot.correctChoiceId).toBeNull();
    }
  });

  it("matches the complete after-packet to exact question, node, case and author-gate exports", () => {
    expect(packet.proposals).toHaveLength(10);
    expect(packet.proposals.filter((p) => p.creationKind === "new")).toHaveLength(9);
    for (const proposal of packet.proposals) {
      const pass = proposal.revisionStatus === "pass-preserved";
      const question = (pass ? topic.MOTILITY_TOPIC_REVIEWED_V1_QUESTIONS : topic.MOTILITY_TOPIC_CATALOG_QUESTIONS).find((q) => q.id === proposal.after.question.id)!;
      const clinicalCase = (pass ? topic.MOTILITY_TOPIC_REVIEWED_V1_CASES : topic.MOTILITY_TOPIC_CATALOG_CASES).find((c) => c.id === proposal.after.case.id)!;
      expect(sha(question)).toBe(proposal.after.questionSha256);
      expect(sha(clinicalCase)).toBe(proposal.after.caseSha256);
      expect(sha(clinicalCase.decisionNodes.find((n) => n.questionVariantId === question.id))).toBe(proposal.after.nodeSha256);
      expect(proposal.authorGate).toEqual((pass ? topic.MOTILITY_TOPIC_REVIEWED_V1_SELF_CHECKS : topic.MOTILITY_TOPIC_CATALOG_SELF_CHECKS).find((row) => row.questionVariantId === question.id));
      expect(proposal.statementMapping).toEqual((pass ? topic.MOTILITY_TOPIC_REVIEWED_V1_STATEMENT_MAPPINGS : topic.MOTILITY_TOPIC_CATALOG_STATEMENT_MAPPINGS).find((row) => row.questionVariantId === question.id));
      if (pass) expect(proposal.revisionBefore).toBeNull();
      else expect(proposal.revisionBefore).toEqual(packet.independentReviewRound1.reviewedProposals.find((p) => p.after.question.id === proposal.reviewedQuestionVariantId)!.after);
      if (proposal.activePreview) {
        expect(proposal.activeAfter).not.toBeNull();
        const activeCase = topic.MOTILITY_TOPIC_CASES.find((c) => c.decisionNodes.some((n) => n.questionVariantId === question.id))!;
        expect(sha(activeCase)).toBe(proposal.activeAfter!.caseSha256);
        expect(sha(activeCase.decisionNodes.find((n) => n.questionVariantId === question.id))).toBe(proposal.activeAfter!.nodeSha256);
      } else expect(proposal.activeAfter).toBeNull();
    }
  });

  it("versions changed clinical meanings while retaining all older concept histories", () => {
    const changed = topic.MOTILITY_TOPIC_CATALOG_AUTHORING_CONCEPTS.filter((c) => c.identityDecision === "new_version");
    expect(changed).toHaveLength(3);
    expect(changed.map((c) => c.previousConceptId).sort()).toEqual([
      "concept.achalasia.physiology-directed-treatment.v1",
      "concept.n2r3.interval-opioid-junction-reassessment",
      "concept.esophagus-motility-achalasia.postmyotomy-inflammation-versus-obstruction.v1",
    ].sort());
    expect(topic.MOTILITY_TOPIC_CATALOG_AUTHORING_CONCEPTS.filter((c) => c.identityDecision === "new_meaning")).toHaveLength(7);
    for (const c of changed) {
      expect(c.id).not.toBe(c.previousConceptId);
      expect(c.identityReason.length).toBeGreaterThan(100);
      expect(packet.assignment.concepts.some((old) => old.conceptId === c.previousConceptId) || topic.MOTILITY_TOPIC_REVIEWED_V1_CONCEPTS.some((old) => old.id === c.previousConceptId)).toBe(true);
    }
  });

  it("keeps clinical drafting, presentations, claims and sources under named review", () => {
    for (const record of [
      ...allQuestions,
      ...topic.MOTILITY_TOPIC_CATALOG_AUTHORING_CONCEPTS,
      ...topic.MOTILITY_TOPIC_CATALOG_CASE_REVIEWS,
      ...topic.MOTILITY_TOPIC_CLAIMS,
      ...topic.MOTILITY_TOPIC_SOURCES,
      ...topic.MOTILITY_TOPIC_CATALOG_SELF_CHECKS,
      ...topic.MOTILITY_TOPIC_CATALOG_STATEMENT_MAPPINGS,
    ]) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.aiAssistedDrafting).toBe(true);
      expect(record.lastClinicianReview).toBeNull();
    }
    expect(topic.MOTILITY_TOPIC_MANIFEST.clinicalSignoff).toBe("Melissa Rowland");
  });

  it("uses named fixed profiles, complete separated tasks and randomized runtime choices", () => {
    for (const clinicalCase of topic.MOTILITY_TOPIC_CASES) {
      expect(clinicalCase.patientDisplayName.trim().split(/\s+/)).toHaveLength(2);
      expect(clinicalCase.presentation).toContain("{patientName}");
      expect(clinicalCase.presentation).toContain(`${clinicalCase.prototypeDemographics!.ageYears}-year-old`);
      expect(clinicalCase.presentation).toContain(clinicalCase.prototypeDemographics!.sexLabel === "Female" ? "woman" : "man");
      expect(clinicalCase.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(1);
      expect(clinicalCase.approvedInstantiationProfiles![0]!.presentation).toBe(clinicalCase.presentation);
      expect(clinicalCase.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(clinicalCase.prototypeDemographics);
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      for (const node of clinicalCase.decisionNodes) {
        expect(node.stem).toContain("{patientName}");
        expect(node.shuffleAnswers).toBe(true);
        expect(node.answerChoices).toHaveLength(3);
        expect(node.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
        expect(node.answerChoices.every((choice) => choice.serviceRequest === null)).toBe(true);
        expect(node.resultGateAfter).toBeNull();
      }
    }
  });

  it("records concrete five-part author attacks and valid decision-changing alternatives", () => {
    for (const check of topic.MOTILITY_TOPIC_SELF_CHECKS) {
      expect(check.independent).toBe(false);
      expect(check.clinicalApproval).toBe(false);
      for (const detail of [check.cueAttack, check.stageAudit, check.interpret, check.apply, check.difficultyReason, check.decidingObservation, check.counterfactual, check.deletionTest, check.sequenceAudit]) {
        expect(detail.length).toBeGreaterThan(35);
      }
      const question = topic.MOTILITY_TOPIC_QUESTIONS.find((q) => q.id === check.questionVariantId)!;
      expect(question.answerChoices.some((c) => c.id === check.closestChoiceId && !c.isCorrect)).toBe(true);
      expect(question.answerChoices.some((c) => c.id === check.counterfactualChoiceId && !c.isCorrect)).toBe(true);
      expect(check.optionAudit).toHaveLength(3);
      for (const option of check.optionAudit) {
        expect(option.temptation.length).toBeGreaterThan(30);
        expect(option.correctUnder.length).toBeGreaterThan(35);
        expect(option.claimIds.length).toBeGreaterThan(0);
      }
    }
  });

  it("reconciles atomic evidence, all clinical fields and exact source/question mappings", () => {
    const claims = new Map(topic.MOTILITY_TOPIC_CLAIMS.map((c) => [c.id, c]));
    const sources = new Map(topic.MOTILITY_TOPIC_SOURCES.map((s) => [s.id, s]));
    expect(claims.size).toBe(32);
    expect(sources.size).toBe(7);
    expect(ledger.publicationCount).toBe(7);
    for (const question of allQuestions) {
      const mapping = ledger.statementMappings.find((row) => row.questionVariantId === question.id)!;
      const check = [...topic.MOTILITY_TOPIC_REVIEWED_V1_SELF_CHECKS, ...topic.MOTILITY_TOPIC_CATALOG_SELF_CHECKS].find((row) => row.questionVariantId === question.id)!;
      expect(mapping.fieldMappings.some((field) => field.field === "currentUpdate")).toBe(true);
      expect(mapping.fieldMappings.some((field) => field.field === "explanation")).toBe(true);
      for (const id of [...question.supportingEvidenceClaimIds, ...check.optionAudit.flatMap((option) => option.claimIds)]) {
        expect(claims.has(id), id).toBe(true);
        expect(question.supportingEvidenceClaimIds).toContain(id);
      }
      for (const field of mapping.fieldMappings) expect(field.claimIds.every((id) => claims.has(id))).toBe(true);
    }
    for (const c of claims.values()) {
      expect(c.lastCheckedOn).toBe("2026-11-11");
      expect(c.limitation).toBeTruthy();
      for (const id of c.sourceIds) expect(sources.get(id)!.evidenceClaimIds).toContain(c.id);
      const mapped = ledger.claimToQuestions.find((row) => row.claimId === c.id)!;
      expect(mapped.questionVariantIds.slice().sort()).toEqual(allQuestions.filter((q) => q.supportingEvidenceClaimIds.includes(c.id)).map((q) => q.id).sort());
      expect(ledger.activeClaimToQuestions.find((row) => row.claimId === c.id)!.questionVariantIds.slice().sort()).toEqual(topic.MOTILITY_TOPIC_QUESTIONS.filter((q) => q.supportingEvidenceClaimIds.includes(c.id)).map((q) => q.id).sort());
    }
    for (const source of sources.values()) {
      for (const field of [source.completeCitation, source.organizationOrJournal, source.accessedOn, source.sourceClass, source.licenseLabel, source.reuseStatus, source.authorityAssessment, source.usageRole]) expect(field).toBeTruthy();
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(ledger.sourceToClaims.find((row) => row.sourceId === source.id)!.claimIds).toEqual(source.evidenceClaimIds);
    }
  });

  it("uses exact existing timing profiles and planned-order records for every testing choice", () => {
    expect(topic.MOTILITY_TOPIC_ORDER_PROPOSALS).toHaveLength(12);
    for (const entry of topic.MOTILITY_TOPIC_TIMING_ENTRIES) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(entry).success).toBe(true);
      const node = topic.MOTILITY_TOPIC_CASES.find((c) => c.id === entry.caseId)!.decisionNodes.find((n) => n.id === entry.nodeId)!;
      if (entry.classification.kind === "no_test") continue;
      expect(entry.classification.choices).toHaveLength(3);
      for (const choice of entry.classification.choices) {
        expect(node.answerChoices.find((c) => c.id === choice.choiceId)!.label).toBe(choice.choiceLabel);
        expect(choice.timing.kind).toBe("test");
        if (choice.timing.kind !== "test") continue;
        const timingProfileId = choice.timing.timingProfileId;
        expect(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.some((p) => p.id === timingProfileId)).toBe(true);
        expect(getDiagnosticTimingProfileMapping(timingProfileId)).toBeDefined();
        const order = topic.MOTILITY_TOPIC_ORDER_PROPOSALS.find((p) => p.questionVariantId === entry.questionVariantId && p.choiceId === choice.choiceId)!;
        expect(order.choiceLabel).toBe(choice.choiceLabel);
        expect(order.disposition).toEqual({ kind: "not_executed", reason: "future_planned" });
        expect(order.serviceRequest).toBeNull();
        expect(order.resultGateAfter).toBeNull();
      }
    }
    for (const item of topic.MOTILITY_TOPIC_ITEMS) for (const node of item.nodes) {
      expect([item.presentation, node.currentUpdate, node.task, ...node.choices.map((c) => c.label)].join(" ")).not.toMatch(/\b\d+[- ](?:minute|hour|day)\b/i);
    }
  });

  it("keeps sequenced findings staged, tables renderable and legacy images present", () => {
    expect(topic.MOTILITY_TOPIC_CASES.map((c) => c.decisionNodes.length).sort()).toEqual([1, 1, 1, 1, 2]);
    for (const clinicalCase of topic.MOTILITY_TOPIC_CASES) {
      expect(new Set(clinicalCase.decisionNodes.map((n) => n.primaryConceptId)).size).toBe(clinicalCase.decisionNodes.length);
      for (const node of clinicalCase.decisionNodes.slice(0, -1)) expect(node.terminalDispositions).toEqual([]);
      for (const node of clinicalCase.decisionNodes) if (node.exhibit?.kind === "table") {
        const exhibit = node.exhibit;
        expect(exhibit.cells).toHaveLength(exhibit.rowHeaders!.length);
        expect(exhibit.cells.every((row) => row.length === exhibit.columnHeaders.length)).toBe(true);
      }
    }
    const spastic = topic.MOTILITY_TOPIC_CASES.find((c) => c.id.includes(".spastic-course."))!;
    expect(spastic.decisionNodes[0]!.questionVariantId).toContain("recurrent-clearance-test.v2");
    expect(spastic.decisionNodes[0]!.explanation).not.toMatch(/omeprazole|before breakfast|famotidine|proton.pump/i);
    expect(spastic.decisionNodes[0]!.currentUpdate).not.toMatch(/prompt liquid|mucosal breaks|omeprazole|famotidine/i);
    const salvage = topic.MOTILITY_TOPIC_REVIEWED_V1_CASES.find((c) => c.id.includes(".failed-therapy-records."))!;
    expect(salvage.decisionNodes[0]!.explanation).not.toMatch(/high.volume|sigmoid|widely opening/i);
    for (const before of packet.before) if (before.node.exhibit?.kind === "image") {
      expect(existsSync(repositoryFile(`apps/player/public/${before.node.exhibit.assetPath}`))).toBe(true);
    }
  });

  it("records ranked coverage, exact clinical decisions and safe source-link metadata", () => {
    expect(packet.reviewDisplay).toBe("key shown first for review only");
    expect(packet.rankedConcepts).toHaveLength(16);
    expect(new Set(packet.rankedConcepts.map((r) => r.rank)).size).toBe(16);
    for (const rank of packet.rankedConcepts) {
      expect(rank.rawEvidence.length).toBeGreaterThan(25);
      expect(rank.closestError.length).toBeGreaterThan(25);
      expect(rank.proposedQuestionIds.every((id) => topic.MOTILITY_TOPIC_CATALOG_QUESTIONS.some((q) => q.id === id))).toBe(true);
    }
    const approvalIds = packet.ownerApprovalsNeeded.flatMap((r) => r.questionVariantIds);
    expect(new Set(approvalIds).size).toBe(10);
    for (const approval of packet.ownerApprovalsNeeded) {
      expect(approval.competingActions.length).toBeGreaterThan(1);
      expect(approval.boundary.length).toBeGreaterThan(60);
      expect(approval.question.length).toBeGreaterThan(80);
    }
    for (const link of topic.MOTILITY_TOPIC_SOURCE_LINKS) {
      expect(link.href).toMatch(/^https:\/\//);
      expect([link.target, link.rel, link.referrerPolicy]).toEqual(["_blank", "noopener noreferrer", "no-referrer"]);
    }
  });

  it("freezes the independent review and every reviewed v1 question, case, profile and author record", () => {
    const frozen = packet.independentReviewRound1;
    expect(fileSha(frozen.reviewFile)).toBe(frozen.sha256);
    expect(readJson(frozen.reviewFile)).toEqual(frozen.entries);
    expect(frozen.clinicalApproval).toBe(false);
    expect(topic.MOTILITY_TOPIC_REVIEWED_V1_ITEMS).toEqual(frozen.reviewedItems);
    expect(topic.MOTILITY_TOPIC_REVIEWED_V1_CONCEPTS).toEqual(frozen.reviewedConcepts);
    expect(topic.MOTILITY_TOPIC_REVIEWED_V1_AUTHORING_CONCEPTS).toEqual(frozen.reviewedAuthoringConcepts);
    expect(topic.MOTILITY_TOPIC_REVIEWED_V1_CASE_REVIEWS).toEqual(frozen.reviewedCaseReviews);
    expect(topic.MOTILITY_TOPIC_REVIEWED_V1_TIMING_ENTRIES).toEqual(frozen.reviewedTimings);
    expect(topic.MOTILITY_TOPIC_REVIEWED_V1_SOURCE_RELEASE).toEqual(frozen.reviewedSourceRelease);
    for (const old of frozen.reviewedProposals) {
      expect(sha(topic.MOTILITY_TOPIC_REVIEWED_V1_QUESTIONS.find((q) => q.id === old.after.question.id))).toBe(old.after.questionSha256);
      const c = topic.MOTILITY_TOPIC_REVIEWED_V1_CASES.find((c) => c.id === old.after.case.id)!;
      expect(sha(c)).toBe(old.after.caseSha256);
      expect(sha(c.decisionNodes.find((n) => n.questionVariantId === old.after.question.id))).toBe(old.after.nodeSha256);
      expect(topic.MOTILITY_TOPIC_REVIEWED_V1_SELF_CHECKS.find((r) => r.questionVariantId === old.after.question.id)).toEqual(old.authorGate);
      expect(topic.MOTILITY_TOPIC_REVIEWED_V1_STATEMENT_MAPPINGS.find((r) => r.questionVariantId === old.after.question.id)).toEqual(old.statementMapping);
    }
    const passes = frozen.entries.filter((row) => row.verdict === "PASS");
    expect(passes).toHaveLength(3);
    for (const pass of passes) {
      const proposal = packet.proposals.find((p) => p.after.question.id === pass.id)!;
      expect(proposal.revisionStatus).toBe("pass-preserved");
      expect(proposal.authorRevisionAttempts).toBe(0);
      expect(proposal.after).toEqual(frozen.reviewedProposals.find((p) => p.after.question.id === pass.id)!.after);
      const catalog = topic.MOTILITY_TOPIC_CATALOG_CASES.find((c) => c.id === proposal.after.case.id)!;
      const { decisionNodes: _oldNodes, learningSummary: _oldSummary, ...oldHeader } = proposal.after.case;
      const { decisionNodes: _newNodes, learningSummary: _newSummary, ...newHeader } = catalog;
      expect(newHeader).toEqual(oldHeader);
      expect(catalog.decisionNodes.find((n) => n.questionVariantId === pass.id)).toEqual(proposal.after.node);
    }
  });

  it("records exactly one v2 attempt per returned item and excludes every parked attempt from preview", () => {
    const dispositions = topic.MOTILITY_TOPIC_REVIEW_DISPOSITIONS;
    expect(packet.reviewRevision.items).toEqual(dispositions);
    expect(dispositions.filter((d) => d.status === "pass-preserved")).toHaveLength(3);
    expect(dispositions.filter((d) => d.status === "revised")).toHaveLength(4);
    expect(dispositions.filter((d) => d.status === "parked")).toHaveLength(3);
    expect(topic.MOTILITY_TOPIC_REVISION_ATTEMPTS).toHaveLength(7);
    expect(new Set(topic.MOTILITY_TOPIC_REVISION_ATTEMPTS.map((n) => n.slug)).size).toBe(7);
    expect(packet.reviewRevision.counts.authorRevisionAttempts).toBe(7);
    for (const reviewed of packet.independentReviewRound1.entries) {
      const d = dispositions.find((d) => d.reviewedQuestionVariantId === reviewed.id)!;
      expect(d.authorRevisionAttempts).toBe(reviewed.verdict === "PASS" ? 0 : 1);
      expect(d.questionVariantId).toBe(reviewed.verdict === "PASS" ? reviewed.id : reviewed.id.replace(/\.v1$/, ".v2"));
      const proposal = packet.proposals.find((p) => p.after.question.id === d.questionVariantId)!;
      expect(proposal.activePreview).toBe(d.activePreview);
      if (d.status === "parked") {
        expect(d.reason.length).toBeGreaterThan(100);
        expect(proposal.parkReason).toBe(d.reason);
        expect(proposal.provisionalKeyOnly).toBe(true);
        expect(topic.MOTILITY_TOPIC_QUESTIONS.some((q) => q.id === d.questionVariantId)).toBe(false);
        expect(topic.MOTILITY_TOPIC_TIMING_ENTRIES.some((e) => e.questionVariantId === d.questionVariantId)).toBe(false);
      }
    }
    for (const n of topic.MOTILITY_TOPIC_REVISION_ATTEMPTS.filter((n) => n.revisionStatus === "revised")) {
      expect(n.reasoning.predictedDifficulty).toBe("moderate");
      expect(n.reasoning.decidingObservation.length).toBeGreaterThan(50);
      expect(n.reasoning.counterfactual.length).toBeGreaterThan(80);
    }
  });

  it("withholds the parked companion without silently adapting the PASS salvage node", () => {
    const id = "question.topic.esophagus-motility-achalasia.salvage-before-resection.v1";
    const d = topic.MOTILITY_TOPIC_REVIEW_DISPOSITIONS.find((d) => d.questionVariantId === id)!;
    expect(d.status).toBe("pass-preserved");
    expect(d.activePreview).toBe(false);
    expect(d.compositionHold).toContain("terminal dispositions");
    expect(topic.MOTILITY_TOPIC_SOURCE_RELEASE.cases.some((c) => c.id.includes("failed-therapy-records"))).toBe(false);
    const oldCase = topic.MOTILITY_TOPIC_REVIEWED_V1_CASES.find((c) => c.id.includes("failed-therapy-records"))!;
    expect(oldCase.decisionNodes).toHaveLength(2);
    expect(oldCase.decisionNodes[0]!.questionVariantId).toBe(id);
    expect(oldCase.decisionNodes[0]!.terminalDispositions).toEqual([]);
    expect(syntheticClinicalReleaseSchema.safeParse(topic.MOTILITY_TOPIC_REVIEWED_V1_SOURCE_RELEASE).success).toBe(true);
    expect(topic.MOTILITY_TOPIC_MANIFEST.preservedPassCompositionHolds).toEqual([id]);
  });

  it("submits exactly the two skipped PASS contexts as salvage and preserves the acceptance evidence", () => {
    const salvage = packet.acceptanceSalvage;
    expect(salvage.status).toBe("salvage");
    for (const input of salvage.reviewInputs) expect(fileSha(input.file)).toBe(input.sha256);
    const receipt = readJson(salvage.matchingReceipt) as {
      items: Array<{ topic: string; status: string; questionVariantId: string; nodeId: string }>;
    };
    const expectedRows = [...salvage.acceptedPreservation.map((row) => row.receipt), ...salvage.skipped]
      .sort((a, b) => a.questionVariantId.localeCompare(b.questionVariantId));
    expect(receipt.items.filter((row) => row.topic === topicSlug).sort((a, b) => a.questionVariantId.localeCompare(b.questionVariantId))).toEqual(expectedRows);
    const skipped = receipt.items.filter((row) => row.topic === topicSlug && row.status === "skipped");
    expect(skipped.map((row) => row.questionVariantId).sort()).toEqual(topic.MOTILITY_TOPIC_SALVAGE_QUESTIONS.map((q) => q.id).sort());
    expect(salvage.skipped).toHaveLength(2);
    expect(salvage.skipped.every((row) => row.evidence.record.verdict === "PASS")).toBe(true);
    expect(packet.salvageProposals).toHaveLength(2);
    expect(packet.salvageProposals.every((row) => row.status === "salvage")).toBe(true);
    expect(packet.currentReviewScope.status).toBe("salvage");
    expect(packet.currentReviewScope.reviewOnlyThese).toBe(true);
    expect(packet.salvageRevision.previousReviewScope.caseIds).toEqual(topic.MOTILITY_TOPIC_SALVAGE_CASES.map((c) => c.id));
    expect(packet.salvageRevision.previousReviewScope.nodeIds.slice().sort()).toEqual(skipped.map((row) => row.nodeId).sort());
    expect(topic.MOTILITY_TOPIC_SALVAGE_MANIFEST.contextIndependentPass).toBe(false);
    expect(topic.MOTILITY_TOPIC_SALVAGE_MANIFEST.clinicalApproval).toBe(false);
    expect(topic.MOTILITY_TOPIC_SALVAGE_MANIFEST.newQuestionCount).toBe(0);
    expect(topic.MOTILITY_TOPIC_SALVAGE_MANIFEST.newConceptCount).toBe(0);
  });

  it("preserves all 42 prior exports and all four already accepted cases, nodes, questions and manifest rows", () => {
    const exports = topic as unknown as Record<string, unknown>;
    expect(Object.keys(packet.acceptanceSalvage.preSalvageModuleExportSha256)).toHaveLength(42);
    for (const [key, hash] of Object.entries(packet.acceptanceSalvage.preSalvageModuleExportSha256)) expect(sha(exports[key]), key).toBe(hash);
    expect(packet.acceptanceSalvage.acceptedPreservation).toHaveLength(4);
    for (const frozen of packet.acceptanceSalvage.acceptedPreservation) {
      const c = SYNTHETIC_CLINICAL_RELEASE.cases.find((c) => c.id === frozen.receipt.caseId)!;
      expect(sha(c)).toBe(frozen.caseSha256);
      expect(c).toEqual(frozen.case);
      expect(c.decisionNodes.find((n) => n.id === frozen.receipt.nodeId)).toEqual(frozen.node);
      expect(sha(topic.MOTILITY_TOPIC_CASES.find((c) => c.id === frozen.receipt.caseId))).toBe(frozen.sourceCaseSha256);
      expect(sha(topic.MOTILITY_TOPIC_QUESTIONS.find((q) => q.id === frozen.receipt.questionVariantId))).toBe(frozen.questionSha256);
      expect(QUESTION_SHIP_MANIFEST.accepted.filter((row) => row.questionVariantId === frozen.receipt.questionVariantId)).toEqual(frozen.manifestRows);
      expect(topic.MOTILITY_TOPIC_SALVAGE_QUESTIONS.some((q) => q.id === frozen.receipt.questionVariantId)).toBe(false);
    }
  });

  it("builds valid single-node clinic cases with exact PASS clinical text and only mechanical context differences", () => {
    expect(syntheticClinicalReleaseSchema.safeParse(topic.MOTILITY_TOPIC_SALVAGE_SOURCE_RELEASE).success).toBe(true);
    expect(topic.MOTILITY_TOPIC_SALVAGE_CASES).toHaveLength(2);
    expect(topic.MOTILITY_TOPIC_SALVAGE_CONCEPTS).toHaveLength(2);
    for (const proposal of packet.salvageProposals) {
      const c = topic.MOTILITY_TOPIC_SALVAGE_CASES.find((c) => c.id === proposal.caseId)!;
      const q = topic.MOTILITY_TOPIC_SALVAGE_QUESTIONS.find((q) => q.id === proposal.questionVariantId)!;
      expect(c.decisionNodes).toHaveLength(1);
      const node = c.decisionNodes[0]!;
      const { terminalDispositions: oldTerminal, ...oldClinical } = proposal.before.node;
      const { terminalDispositions: newTerminal, ...newClinical } = node;
      expect(oldTerminal).toEqual([]);
      expect(newClinical).toEqual(oldClinical);
      expect(sha(newClinical)).toBe(proposal.clinicalNodeProjectionSha256);
      expect(q).toEqual(proposal.before.question);
      expect(sha(q)).toBe(proposal.before.questionSha256);
      expect(c).toEqual(proposal.after.case);
      expect(sha(c)).toBe(proposal.after.caseSha256);
      expect(sha(node)).toBe(proposal.after.nodeSha256);
      expect(c.id).not.toBe(proposal.before.case.id);
      expect(c.presentation).toBe(proposal.before.case.presentation);
      expect(c.chiefComplaint).toBe(proposal.before.case.chiefComplaint);
      expect(c.patientDisplayName).toBe(proposal.before.case.patientDisplayName);
      expect(c.prototypeDemographics).toEqual(proposal.before.case.prototypeDemographics);
      expect(c.approvedInstantiationProfiles).toHaveLength(1);
      const { id: oldProfileId, ...oldProfile } = proposal.before.case.approvedInstantiationProfiles![0]!;
      const { id: newProfileId, ...newProfile } = c.approvedInstantiationProfiles![0]!;
      expect(newProfileId).not.toBe(oldProfileId);
      expect(newProfile).toEqual(oldProfile);
      expect(c.requiredClinicalSetting).toBe("clinic");
      expect(c.learningSummary).toBe(node.explanation);
      expect(node.shuffleAnswers).toBe(true);
      expect(node.id).toBe(proposal.nodeId);
      expect(newTerminal).toHaveLength(node.answerChoices.filter((choice) => !choice.isCorrect).length);
      for (const terminal of newTerminal) {
        const choice = node.answerChoices.find((choice) => choice.id === terminal.answerChoiceId)!;
        expect(choice.isCorrect).toBe(false);
        expect(terminal.kind).toBe("no_terminal_outcome");
        if (terminal.kind !== "no_terminal_outcome") throw new Error("Standalone review must retain no-terminal-outcome metadata");
        expect(terminal.clinicalRationale).toBe(choice.rationale);
      }
      expect(SYNTHETIC_CLINICAL_RELEASE.cases.some((live) => live.id === c.id)).toBe(topicCaseIsExplicitlyLive(c.id));
      expect(SYNTHETIC_CLINICAL_RELEASE.cases.some((live) => live.decisionNodes.some((n) => n.id === node.id))).toBe(topicQuestionAcceptance(node.questionVariantId).live);
      expect(proposal.contextIndependentPass).toBe(false);
      expect(proposal.clinicalApproval).toBe(false);
      expect(proposal.clinicalWordingChanged).toBe(false);
      expect(proposal.addedPresentationText).toBe(false);
    }
    const recurrence = topic.MOTILITY_TOPIC_SALVAGE_CASES.find((c) => c.id.includes("recurrent-clearance-standalone"))!;
    expect(JSON.stringify(recurrence)).not.toMatch(/prompt liquid clearance|mucosal breaks|omeprazole|famotidine/);
    expect(topic.MOTILITY_TOPIC_SALVAGE_SELF_CHECKS.every((check) => check.sequenceAudit.includes("exactly one scored node"))).toBe(true);
  });

  it("maps the two salvage contexts to unchanged claims and all three new case-specific test bindings", () => {
    expect(ledger.acceptanceSalvage.status).toBe("salvage");
    expect(ledger.acceptanceSalvage.counts).toMatchObject({ newClaims: 0, reusedClaims: 12, reusedSources: 5 });
    expect(ledger.acceptanceSalvage.sourcePolicy).toMatchObject({ freshNetworkRetrieval: false, sourceAccessDatesPreserved: true, claimCheckDatesPreserved: true });
    expect(ledger.acceptanceSalvage.statementMappings).toEqual(topic.MOTILITY_TOPIC_SALVAGE_STATEMENT_MAPPINGS);
    expect(topic.MOTILITY_TOPIC_SALVAGE_ORDER_PROPOSALS).toHaveLength(3);
    for (const entry of topic.MOTILITY_TOPIC_SALVAGE_TIMING_ENTRIES) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(entry).success).toBe(true);
      const c = topic.MOTILITY_TOPIC_SALVAGE_CASES.find((c) => c.id === entry.caseId)!;
      const node = c.decisionNodes[0]!;
      expect(entry.nodeId).toBe(node.id);
      expect(entry.questionVariantId).toBe(node.questionVariantId);
      if (entry.classification.kind === "no_test") continue;
      expect(entry.classification.choices).toHaveLength(3);
      for (const choice of entry.classification.choices) {
        expect(choice.timing.kind).toBe("test");
        if (choice.timing.kind !== "test") continue;
        expect(getDiagnosticTimingProfileMapping(choice.timing.timingProfileId)).toBeDefined();
        const order = topic.MOTILITY_TOPIC_SALVAGE_ORDER_PROPOSALS.find((r) => r.caseId === c.id && r.choiceId === choice.choiceId)!;
        expect(order.choiceLabel).toBe(node.answerChoices.find((r) => r.id === choice.choiceId)!.label);
        expect(order.disposition).toEqual({ kind: "not_executed", reason: "future_planned" });
        expect(order.serviceRequest).toBeNull();
        expect(order.resultGateAfter).toBeNull();
      }
    }
    for (const proposal of packet.salvageProposals) {
      expect(proposal.authorGate).toEqual(topic.MOTILITY_TOPIC_SALVAGE_SELF_CHECKS.find((r) => r.questionVariantId === proposal.questionVariantId));
      expect(proposal.statementMapping).toEqual(topic.MOTILITY_TOPIC_SALVAGE_STATEMENT_MAPPINGS.find((r) => r.questionVariantId === proposal.questionVariantId));
      for (const id of proposal.after.question.supportingEvidenceClaimIds) {
        expect(topic.MOTILITY_TOPIC_SALVAGE_CLAIMS.some((claim) => claim.id === id)).toBe(true);
        expect(ledger.acceptanceSalvage.claimToCases.find((r) => r.claimId === id)!.contexts).toContainEqual({ caseId: proposal.caseId, nodeId: proposal.nodeId, questionVariantId: proposal.questionVariantId, status: "salvage" });
      }
    }
    for (const link of topic.MOTILITY_TOPIC_SALVAGE_SOURCE_LINKS) expect([link.target, link.rel, link.referrerPolicy]).toEqual(["_blank", "noopener noreferrer", "no-referrer"]);
  });

  it("freezes the passed salvage context and every pre-revision export while submitting only the returned case", () => {
    const frozen = packet.salvageRevision;
    expect(fileSha(frozen.reviewFile)).toBe(frozen.reviewFileSha256);
    const exports = topic as unknown as Record<string, unknown>;
    expect(Object.keys(frozen.preRevisionModuleExportSha256)).toHaveLength(59);
    for (const [key, hash] of Object.entries(frozen.preRevisionModuleExportSha256)) expect(sha(exports[key]), key).toBe(hash);
    const pass = topic.MOTILITY_TOPIC_SALVAGE_CASES.find((c) => c.id.includes("salvage-before-resection-standalone"))!;
    expect(sha(pass)).toBe(frozen.reviewedPassCaseSha256);
    expect(packet.salvageProposals.find((p) => p.caseId === pass.id)).toEqual(frozen.protectedPassProposal);
    expect(topic.MOTILITY_TOPIC_SALVAGE_REVISION_CASES).toHaveLength(1);
    expect(packet.currentReviewScope.caseIds).toEqual(topic.MOTILITY_TOPIC_SALVAGE_REVISION_CASES.map((c) => c.id));
    expect(packet.currentReviewScope.questionVariantIds).toEqual(topic.MOTILITY_TOPIC_SALVAGE_REVISION_QUESTIONS.map((q) => q.id));
    expect(packet.currentReviewScope.caseIds).not.toContain(pass.id);
    expect(packet.salvageRevisionProposals).toHaveLength(1);
    expect(packet.salvageRevisionProposals[0]!.status).toBe("salvage");
    expect(topic.MOTILITY_TOPIC_SALVAGE_REVISION_MANIFEST.contextIndependentPass).toBe(false);
    expect(topic.MOTILITY_TOPIC_SALVAGE_REVISION_MANIFEST.clinicalApproval).toBe(false);
  });

  it("conditions the revised clearance comparison on documented achalasia without giving away the next test", () => {
    const p = packet.salvageRevisionProposals[0]!;
    const c = topic.MOTILITY_TOPIC_SALVAGE_REVISION_CASES[0]!;
    const node = c.decisionNodes[0]!;
    const q = topic.MOTILITY_TOPIC_SALVAGE_REVISION_QUESTIONS[0]!;
    expect(syntheticClinicalReleaseSchema.safeParse(topic.MOTILITY_TOPIC_SALVAGE_REVISION_SOURCE_RELEASE).success).toBe(true);
    expect(c).toEqual(p.after.case);
    expect(sha(c)).toBe(p.after.caseSha256);
    expect(sha(node)).toBe(p.after.nodeSha256);
    expect(sha(q)).toBe(p.after.questionSha256);
    expect(c.presentation).toBe(p.before.case.presentation);
    expect(c.prototypeDemographics).toEqual(p.before.case.prototypeDemographics);
    expect(node.currentUpdate).toContain("original foregut records document achalasia treated with POEM");
    expect(node.currentUpdate).toContain("At this postoperative reassessment");
    expect(node.currentUpdate).toContain("food again pauses and fluid returns at night");
    const physiologyAndIntake = "The completed repeat manometry has adequate junction-crossing positional acquisition, relaxation within the laboratory interval and no residual premature contractions. Her weight and oral hydration are maintained.";
    expect(node.currentUpdate).toContain(physiologyAndIntake);
    expect(p.before.node.currentUpdate).toContain(physiologyAndIntake);
    expect(node.currentUpdate).not.toMatch(/later record|endoscop|first.line|timed barium|prompt liquid|mucosal breaks/i);
    expect(node.stem).toBe(p.before.node.stem);
    expect(node.answerChoices.map(({ id: _id, ...choice }) => choice)).toEqual(p.before.node.answerChoices.map(({ id: _id, ...choice }) => choice));
    expect(node.explanation).toContain("After treatment of established achalasia");
    expect(node.explanation).toContain("Endoscopy complements");
    expect(node.explanation).toContain("maintained weight and hydration do not exclude");
    expect(q.conceptId).toBe(p.before.question.conceptId);
    expect(p.conceptVersionChanged).toBe(false);
    expect(q.id).toBe("question.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3");
    expect(c.id).toBe("case.topic.esophagus-motility-achalasia.recurrent-clearance-standalone.v2");
    expect(node.shuffleAnswers).toBe(true);
    expect(p.authorGate).toEqual(topic.MOTILITY_TOPIC_SALVAGE_REVISION_SELF_CHECKS[0]);
    expect(p.statementMapping).toEqual(topic.MOTILITY_TOPIC_SALVAGE_REVISION_STATEMENT_MAPPINGS[0]);
    expect(ledger.salvageRevision.statementMappings).toEqual(topic.MOTILITY_TOPIC_SALVAGE_REVISION_STATEMENT_MAPPINGS);
    for (const id of q.supportingEvidenceClaimIds) expect(ledger.salvageRevision.claimToCases).toContainEqual({ claimId: id, caseId: c.id, nodeId: node.id, questionVariantId: q.id, status: "salvage" });
    const check = topic.MOTILITY_TOPIC_SALVAGE_REVISION_SELF_CHECKS[0]!;
    expect(check.closestChoiceId).toContain(".endoscopy");
    expect(check.decidingObservation).toContain("Documented achalasia");
    expect(check.counterfactualChoiceId).toContain(".endoscopy");
    expect(check.interpret.length).toBeGreaterThan(50);
    expect(check.apply.length).toBeGreaterThan(50);
    expect(topic.MOTILITY_TOPIC_SALVAGE_REVISION_ORDER_PROPOSALS).toHaveLength(3);
    for (const order of topic.MOTILITY_TOPIC_SALVAGE_REVISION_ORDER_PROPOSALS) {
      expect([order.caseId, order.nodeId, order.questionVariantId]).toEqual([c.id, node.id, q.id]);
      expect(order.disposition).toEqual({ kind: "not_executed", reason: "future_planned" });
      expect(order.timing.kind).toBe("test");
      if (order.timing.kind === "test") expect(getDiagnosticTimingProfileMapping(order.timing.timingProfileId)).toBeDefined();
    }
    expect(p.independentPass).toBe(false);
    expect(p.clinicalApproval).toBe(false);
  });
});
