import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { answerChoiceTimingRegistryEntrySchema, validateSyntheticClinicalRelease } from "./schema";
import {
  APPENDIX_TOPIC_AUTHOR_CHECKS as checks,
  APPENDIX_TOPIC_PRE_SALVAGE_ARTIFACTS as preSalvage,
  APPENDIX_TOPIC_PRE_SALVAGE_CASE_DEFINITIONS as preSalvageDefinitions,
  APPENDIX_TOPIC_SALVAGE_CASES as salvageCases,
  APPENDIX_TOPIC_SALVAGE_ITEMS as salvageItems,
  APPENDIX_TOPIC_FROZEN_PASS_CONTEXTS as frozenPasses,
  APPENDIX_TOPIC_ITEM_STATUSES as itemStatuses,
  APPENDIX_TOPIC_REVIEWED_ARTIFACTS as reviewed,
  APPENDIX_TOPIC_REVIEWED_CASE_DEFINITIONS as reviewedDefinitions,
  APPENDIX_TOPIC_AUTHORING_CONCEPTS as authoringConcepts,
  APPENDIX_TOPIC_CASE_DEFINITIONS as definitions,
  APPENDIX_TOPIC_CASE_REVIEWS as caseReviews,
  APPENDIX_TOPIC_CASES as cases,
  APPENDIX_TOPIC_CLAIMS as claims,
  APPENDIX_TOPIC_MANIFEST as manifest,
  APPENDIX_TOPIC_ORDER_PROPOSALS as orders,
  APPENDIX_TOPIC_PREVIEW_RELEASE as preview,
  APPENDIX_TOPIC_QUESTIONS as questions,
  APPENDIX_TOPIC_SOURCE_LINKS as links,
  APPENDIX_TOPIC_SOURCES as sources,
  APPENDIX_TOPIC_STATEMENT_MAPPINGS as mappings,
  APPENDIX_TOPIC_TESTED_CONCEPTS as concepts,
  APPENDIX_TOPIC_TIMING_ENTRIES as timings,
} from "./question-topic-appendix-appendicitis-20261111";

const repositoryUrl = new URL("../../../", import.meta.url);
const readRepositoryFile = (file: string) => readFileSync(new URL(file, repositoryUrl), "utf8");
const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
const scoredNode = (node: typeof cases[number]["decisionNodes"][number]) => {
  const { terminalDispositions: _completion, ...scoredFields } = node;
  return scoredFields;
};

interface AuditRow {
  recordId: string;
  verdict: "Keep" | "Rewrite" | "Retire-and-replace";
  reasons: string;
  replacementQuestionVariantId: string;
  beforeNodeSha256: string;
  beforeContextSha256: string;
  contextAudits: Array<{ contextSha256: string; finiteProfileIds: string[] }>;
}

interface Packet {
  assignment: {
    inventory: Array<{ recordId: string; primaryTopicSlug: string; variantIds: string[] }>;
    recordedHolds: Array<{ id: string }>;
  };
  inputHashes: Array<{ file: string; currentSha256: string; snapshotSha256: string }>;
  drift: unknown[];
  beforeVersions: Array<{
    recordId: string;
    contexts: Array<{ contextSha256: string; nodeSha256: string; context: { currentNode: unknown } }>;
  }>;
  audit: AuditRow[];
  proposals: Array<{
    questionVariantId: string;
    status?: string;
    replacesInventoryRecordIds: string[];
    originalAuthorshipKind?: string;
    before: unknown;
    exactAfterSha256: string;
    reviewStatus: string;
    evidenceClaimIds: string[];
    after: { reviewOrderNotice: string; runtimeShuffleAnswers: boolean };
  }>;
  independentReviewRound1: {
    reviewPath: string;
    reviewSha256: string;
    reviewRecords: Array<{ id: string; verdict: string; clarityIssues: unknown[]; cues: unknown[]; fairness: unknown[]; suggestions: unknown[] }>;
    snapshot: { definitions: typeof definitions; cases: typeof cases; questions: typeof questions; timings: typeof timings; proposals: Packet["proposals"] };
    items: Array<{ reviewedQuestionVariantId: string; currentQuestionVariantId: string | null; status: string; revisionAttempts: number; originalConceptId: string; currentConceptId: string | null; responses: Record<string, Array<{ index: number; reviewNote: unknown; response: string }>> }>;
    parkedPlanningSlots: Array<{ id: string; questionVariantId: null; conceptId: null; reviewedQuestionVariantId: string; reason: string; unkeyedActions: string[] }>;
  };
  salvage: {
    authorityInputs: Array<{ file: string; sha256: string }>;
    inputHashes: Packet["inputHashes"];
    unexpectedDrift: unknown[];
    driftFromWave1: Array<{ file: string }>;
    snapshot: { definitions: typeof definitions; cases: typeof cases; questions: typeof questions; timings: typeof timings; proposals: Packet["proposals"] };
    skippedPassReceipts: Array<{ questionVariantId: string; status: string; evidence: { item: { verdict: string } }; blockedReplacementCases: string[] }>;
    acceptedPacketRows: Array<{ caseId: string; nodeId: string; questionVariantId: string; questionSha256: string; rawReviewedNodeSha256: string }>;
    items: Array<{
      status: string; caseId: string; nodeId: string; questionVariantId: string; conceptId: string;
      sourceScoredNodeSha256: string; salvageScoredNodeSha256: string; sourceQuestionSha256: string; salvageQuestionSha256: string;
      before: { clinicalCase: typeof cases[number]; currentNode: typeof cases[number]["decisionNodes"][number]; question: typeof questions[number] };
      after: { clinicalCase: typeof cases[number]; currentNode: typeof cases[number]["decisionNodes"][number]; question: typeof questions[number] };
      originalReview: { path: string; item: { id: string; verdict: string } };
      originalTimingRetained: typeof timings[number]; timingProposal: typeof timings[number];
      independentContextReviewRequired: boolean; integrationDisposition: string;
    }>;
    reviewQueue: Array<{ status: string; caseId: string; nodeId: string; questionVariantId: string }>;
    counts: Record<string, number>;
  };
  counts: Record<string, number>;
  newUnkeyedHolds: Array<{ questionVariantId: null; conceptId: null; id: string }>;
}

const packet = JSON.parse(readRepositoryFile("docs/research/question-topic-appendix-appendicitis-20261111.json")) as Packet;
const ledger = JSON.parse(readRepositoryFile("docs/research/sources-question-topic-appendix-appendicitis-20261111.json")) as {
  sources: typeof sources;
  evidenceClaims: typeof claims;
  claimToQuestion: Array<{ claimId: string; questionVariantIds: string[] }>;
  excludedOrLimitedCandidates: Array<{ evidenceClaimIds: string[] }>;
};

describe("appendix topic explicit-import authoring sidecar", () => {
  it("validates ten single-node fresh-preview cases and ten independent concept identities through the existing release representation", () => {
    expect(() => validateSyntheticClinicalRelease(preview)).not.toThrow();
    expect(cases).toHaveLength(10);
    expect(questions).toHaveLength(10);
    expect(concepts).toHaveLength(10);
    expect(new Set(questions.map(question => question.id)).size).toBe(10);
    expect(new Set(concepts.map(concept => concept.id)).size).toBe(10);
    expect(cases.every(clinicalCase => clinicalCase.decisionNodes.length === 1)).toBe(true);
    expect(manifest).toMatchObject({
      clinicalApproval: false, pipelinePassed: false, managerAccepted: false,
      publicReleaseAuthorized: false, executableOrdersAdded: false,
    });
    expect(authoringConcepts.filter(concept => concept.previousConceptId !== null)).toHaveLength(1);
    expect(manifest.changedMeaningPreviousConceptIds).toEqual(["concept.appendicitis.ct-request-with-urinary-mimic.v1"]);
  });

  it("reconciles every assigned variant and exact visible context to one concrete audit verdict", () => {
    const program = JSON.parse(readRepositoryFile("docs/research/question-topic-program-20261111.json")) as {
      inventory: typeof packet.assignment.inventory;
    };
    const assigned = program.inventory.filter(row => row.primaryTopicSlug === "appendix-appendicitis");
    expect(packet.assignment.inventory).toEqual(assigned);
    expect(assigned).toHaveLength(16);
    expect(packet.audit.map(row => row.recordId).sort()).toEqual(assigned.map(row => row.recordId).sort());
    expect(new Set(packet.audit.map(row => row.recordId)).size).toBe(16);
    expect(packet.audit.filter(row => row.verdict === "Rewrite")).toHaveLength(1);
    expect(packet.audit.filter(row => row.verdict === "Retire-and-replace")).toHaveLength(15);
    expect(packet.audit.filter(row => row.verdict === "Keep")).toHaveLength(0);
    for (const audit of packet.audit) {
      expect(audit.reasons.length).toBeGreaterThan(100);
      expect([...questions, ...reviewed.questions, ...preSalvage.questions].some(question => question.id === audit.replacementQuestionVariantId)).toBe(true);
      const before = packet.beforeVersions.find(row => row.recordId === audit.recordId)!;
      expect(before.contexts).toHaveLength(audit.contextAudits.length);
      for (const context of before.contexts) {
        expect(sha256(JSON.stringify(context.context))).toBe(context.contextSha256);
        expect(sha256(JSON.stringify(context.context.currentNode))).toBe(context.nodeSha256);
        expect(audit.contextAudits.some(row => row.contextSha256 === context.contextSha256)).toBe(true);
      }
      expect(audit.beforeNodeSha256).toBe(before.contexts[0]!.nodeSha256);
      expect(audit.beforeContextSha256).toBe(before.contexts[0]!.contextSha256);
    }
    expect(packet.assignment.recordedHolds.map(hold => hold.id)).toContain("review.n3.appendicitis-response-versus-structural-risk.v2");
    expect(packet.newUnkeyedHolds).toHaveLength(3);
    expect(packet.newUnkeyedHolds.every(hold => hold.questionVariantId === null && hold.conceptId === null)).toBe(true);
  });

  it("preserves fixed clinical inputs and records manager-owned assembly changes without blocking their concurrent edits", () => {
    expect(packet.salvage.unexpectedDrift).toEqual([]);
    expect(packet.salvage.driftFromWave1.map(input => input.file).sort()).toEqual(["packages/clinical-content/src/index.ts", "packages/clinical-content/src/question-ship-manifest.ts", "packages/clinical-content/src/synthetic-content.ts"].sort());
    const volatileAssembly = new Set(["packages/clinical-content/src/index.ts", "packages/clinical-content/src/question-ship-manifest.ts", "packages/clinical-content/src/synthetic-content.ts"]);
    for (const input of packet.salvage.inputHashes) {
      if (volatileAssembly.has(input.file)) continue;
      expect(sha256(readRepositoryFile(input.file)), input.file).toBe(input.currentSha256);
      expect(input.currentSha256, input.file).toBe(input.snapshotSha256);
    }
    for (const file of ["packages/clinical-content/src/index.ts", "packages/clinical-content/src/synthetic-content.ts", "packages/clinical-content/src/question-ship-manifest.ts"]) {
      expect(readRepositoryFile(file)).not.toContain("question-topic-appendix-appendicitis-20261111");
    }
  });

  it.each(cases.map((clinicalCase, index) => [clinicalCase.id, clinicalCase, index] as const))(
    "keeps %s a coherent finite clinic record with separate authoring dimensions", (_id, clinicalCase, index) => {
      const definition = definitions[index]!;
      expect(clinicalCase.patientDisplayName).toBe(definition.patientName);
      expect(clinicalCase.presentation).toContain("{patientName}");
      expect(clinicalCase.presentation).toContain(`${definition.age}-year-old`);
      expect(clinicalCase.prototypeDemographics).toEqual({ ageYears: definition.age, sexLabel: definition.sex });
      expect(clinicalCase.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(1);
      expect(clinicalCase.approvedInstantiationProfiles![0]).toMatchObject({
        prototypeDemographics: clinicalCase.prototypeDemographics, presentation: clinicalCase.presentation,
      });
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(caseReviews[index]).toMatchObject({ educationalTier: 1, earliestFacilityStage: 3, acuity: definition.acuity, reviewStatus: "needs_clinician_review" });
      expect(clinicalCase.tutorialEligible).toBe(false);
      for (const [nodeIndex, node] of clinicalCase.decisionNodes.entries()) {
        expect(node.shuffleAnswers).toBe(true);
        expect(node.answerChoices).toHaveLength(3);
        expect(node.answerChoices.filter(choice => choice.isCorrect)).toHaveLength(1);
        expect(node.answerChoices.every(choice => choice.serviceRequest === null && choice.rationale)).toBe(true);
        expect(node.resultGateAfter).toBeNull();
        if (nodeIndex < clinicalCase.decisionNodes.length - 1) expect(node.terminalDispositions).toEqual([]);
        if (nodeIndex > 0) expect(node.currentUpdate!.length).toBeGreaterThan(80);
      }
    },
  );

  it.each(questions.map(question => [question.id, question] as const))(
    "binds %s to its exact packet, evidence, concrete author gate and randomized node", (_id, question) => {
      expect(question).toMatchObject({ reviewStatus: "needs_clinician_review", lastClinicianReview: null, aiAssistedDrafting: true });
      const clinicalCase = cases.find(candidate => candidate.decisionNodes.some(node => node.questionVariantId === question.id))!;
      const node = clinicalCase.decisionNodes.find(node => node.questionVariantId === question.id)!;
      const proposal = packet.proposals.find(proposal => proposal.questionVariantId === question.id)!;
      const frozen = frozenPasses.find(item => item.reviewedQuestionVariantId === question.id);
      const boundContext = frozen && proposal.status !== "salvage" ? { clinicalCase: frozen.clinicalCase, currentNode: frozen.currentNode } : { clinicalCase, currentNode: node };
      expect(proposal.exactAfterSha256).toBe(sha256(JSON.stringify(boundContext)));
      if (frozen) expect(scoredNode(node)).toEqual(scoredNode(frozen.currentNode));
      expect(proposal.after).toMatchObject({ reviewOrderNotice: "key shown first for review only.", runtimeShuffleAnswers: true });
      expect(proposal.reviewStatus).toBe("needs_clinician_review");
      expect(proposal.evidenceClaimIds).toEqual(question.supportingEvidenceClaimIds);
      const check = checks.find(check => check.questionVariantId === question.id)!;
      for (const field of ["interpret", "apply", "closestError", "decidingObservation", "consequence", "deletionTest", "counterfactual", "cueAttack", "stageCategory", "difficulty", "oneBestAnswer", "sequenceCheck", "repairRecord"] as const) {
        expect(check[field].length, `${question.id}/${field}`).toBeGreaterThan(35);
      }
      expect(check.pipelinePassed).toBe(false);
      expect(check.distractorChecks).toHaveLength(2);
      expect(mappings.some(mapping => mapping.questionVariantId === question.id)).toBe(true);
      const definition = definitions.flatMap(clinicalCase => clinicalCase.nodes).find(definition => `question.topic.appendix-appendicitis.${definition.slug}.v${definition.version ?? 1}` === question.id)!;
      const changedChoice = definition.choices.find(choice => choice.id === check.counterfactualChoiceId)!;
      expect(changedChoice).toBeDefined();
      expect(changedChoice.isCorrect).toBe(false);
      for (const choice of definition.choices) {
        expect(choice.claimIds.every(id => question.supportingEvidenceClaimIds.includes(id))).toBe(true);
        expect(choice.temptation.length).toBeGreaterThan(25);
        expect(choice.counterfactual.length).toBeGreaterThan(45);
      }
    },
  );

  it("classifies every offered test by exact identity and label using an existing placeholder profile", () => {
    const profileIds = new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map(profile => profile.id));
    expect(timings).toHaveLength(10);
    expect(new Set(timings.map(entry => entry.questionVariantId)).size).toBe(10);
    for (const entry of timings) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(entry).success).toBe(true);
      const node = cases.find(clinicalCase => clinicalCase.id === entry.caseId)!.decisionNodes.find(node => node.id === entry.nodeId)!;
      expect(entry.questionVariantId).toBe(node.questionVariantId);
      if (entry.classification.kind === "no_test") continue;
      expect(entry.classification.choices.map(choice => [choice.choiceId, choice.choiceLabel])).toEqual(node.answerChoices.map(choice => [choice.id, choice.label]));
      for (const choice of entry.classification.choices) {
        if (choice.timing.kind === "test") expect(profileIds.has(choice.timing.timingProfileId), choice.choiceLabel).toBe(true);
      }
    }
    for (const definition of definitions.flatMap(clinicalCase => clinicalCase.nodes)) {
      for (const choice of definition.choices) {
        if (/\b(?:CT|PET|scintigraphy|ultrasound|radiographs|colonoscopy|biopsy|diagnostic abdominal laparoscopy|image-guided pelvic catheter)\b/i.test(choice.label)) {
          expect(choice.timing.kind, `${definition.slug}/${choice.id}`).toBe("test");
        }
      }
    }
    expect(orders.every(order => order.serviceRequest === null && order.resultGateAfter === null)).toBe(true);
  });

  it("reconciles rights-aware sources and atomic claims bidirectionally with the source ledger", () => {
    expect(sources).toHaveLength(7);
    expect(claims).toHaveLength(29);
    expect(ledger.sources).toEqual(sources);
    expect(ledger.evidenceClaims).toEqual(claims);
    for (const claim of claims) {
      expect(claim).toMatchObject({ reviewStatus: "needs_clinician_review", lastClinicianReview: null, lastCheckedOn: "2026-11-11" });
      expect(claim.limitation).toBeTruthy();
      for (const sourceId of claim.sourceIds) expect(sources.find(source => source.id === sourceId)!.evidenceClaimIds).toContain(claim.id);
      const mapped = ledger.claimToQuestion.find(mapping => mapping.claimId === claim.id)!;
      expect(mapped.questionVariantIds.sort()).toEqual(packet.proposals.filter(proposal => proposal.evidenceClaimIds.includes(claim.id)).map(proposal => proposal.questionVariantId).sort());
    }
    for (const question of questions) expect(question.supportingEvidenceClaimIds.every(id => claims.some(claim => claim.id === id))).toBe(true);
    for (const source of sources) {
      for (const field of ["completeCitation", "organizationOrJournal", "authors", "accessedOn", "sourceClass", "licenseLabel", "reuseStatus", "reuseNotes", "authorityAssessment", "usageRole"] as const) expect(source[field]).toBeTruthy();
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.evidenceClaimIds.every(id => claims.some(claim => claim.id === id && claim.sourceIds.includes(source.id)))).toBe(true);
    }
    expect(ledger.excludedOrLimitedCandidates.every(candidate => candidate.evidenceClaimIds.length === 0)).toBe(true);
    expect(links.every(link => link.target === "_blank" && link.rel === "noopener noreferrer" && link.referrerPolicy === "no-referrer")).toBe(true);
  });

  it("binds all thirteen dispositions to the exact independent review and answers every review note", () => {
    const round = packet.independentReviewRound1;
    expect(sha256(readRepositoryFile(round.reviewPath))).toBe("79df70da3b285676c6d00f141b6c6f63d9fdb41bca6fa4e461f79fd78df75445");
    expect(round.reviewSha256).toBe(sha256(readRepositoryFile(round.reviewPath)));
    expect(round.reviewRecords).toEqual(JSON.parse(readRepositoryFile(round.reviewPath)));
    expect(round.items).toHaveLength(13);
    expect(itemStatuses.filter(item => item.status === "pass-preserved")).toHaveLength(3);
    expect(itemStatuses.filter(item => item.status === "revised")).toHaveLength(8);
    expect(itemStatuses.filter(item => item.status === "parked")).toHaveLength(2);
    expect(round.items.map(item => item.reviewedQuestionVariantId)).toEqual(round.reviewRecords.map(item => item.id));
    for (const item of round.items) {
      const record = round.reviewRecords.find(record => record.id === item.reviewedQuestionVariantId)!;
      expect(itemStatuses.find(status => status.reviewedQuestionVariantId === record.id)).toMatchObject({ status: item.status, currentQuestionVariantId: item.currentQuestionVariantId });
      expect(item.revisionAttempts).toBe(record.verdict === "PASS" ? 0 : 1);
      for (const category of ["clarityIssues", "cues", "fairness", "suggestions"] as const) {
        expect(item.responses[category]!.map(response => response.reviewNote)).toEqual(record[category]);
        expect(item.responses[category]!.every(response => response.response.length > 40)).toBe(true);
      }
    }
  });

  it("preserves every reviewed full case, question and timing row, including all three exact PASS items", () => {
    const snapshot = packet.independentReviewRound1.snapshot;
    expect(reviewedDefinitions).toEqual(snapshot.definitions);
    expect(reviewed.cases).toEqual(snapshot.cases);
    expect(reviewed.questions).toEqual(snapshot.questions);
    expect(reviewed.timing_entries).toEqual(snapshot.timings);
    expect(frozenPasses).toHaveLength(3);
    for (const frozen of frozenPasses) {
      const original = snapshot.proposals.find(proposal => proposal.questionVariantId === frozen.reviewedQuestionVariantId)!;
      expect(sha256(JSON.stringify({ clinicalCase: frozen.clinicalCase, currentNode: frozen.currentNode }))).toBe(original.exactAfterSha256);
      expect(packet.salvage.snapshot.proposals.find(proposal => proposal.questionVariantId === original.questionVariantId)).toEqual(original);
      expect(frozen.question).toEqual(snapshot.questions.find(question => question.id === original.questionVariantId));
      expect(frozen.timing).toEqual(snapshot.timings.find(entry => entry.questionVariantId === original.questionVariantId));
      expect(frozen.clinicalApproval).toBe(false);
    }
  });

  it("preserves passed visible context while separating the returned companion from fresh supply", () => {
    const passed = frozenPasses.find(item => item.reviewedQuestionVariantId.includes("post-abscess-interval"))!;
    expect(passed.clinicalCase.decisionNodes.map(node => node.questionVariantId)).toEqual([
      "question.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v1", passed.reviewedQuestionVariantId,
    ]);
    expect(cases.some(clinicalCase => clinicalCase.id === passed.clinicalCase.id)).toBe(false);
    expect(salvageCases.find(clinicalCase => clinicalCase.decisionNodes[0]!.questionVariantId === passed.reviewedQuestionVariantId)!.decisionNodes).toEqual([passed.currentNode]);
    const fork = cases.find(clinicalCase => clinicalCase.id.includes("post-abscess-colonic-evaluation"))!;
    expect(fork.decisionNodes.map(node => node.questionVariantId)).toEqual(["question.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v2"]);
    const firstPass = frozenPasses.find(item => item.reviewedQuestionVariantId.includes("persistent-pain-exploration"))!;
    const current = cases.find(clinicalCase => clinicalCase.decisionNodes.some(node => node.questionVariantId === firstPass.reviewedQuestionVariantId))!;
    for (const field of ["presentation", "chiefComplaint", "prototypeDemographics", "patientDisplayName", "sourceLabels"] as const) {
      expect(current[field]).toEqual(firstPass.clinicalCase[field]);
    }
    expect(scoredNode(current.decisionNodes[0]!)).toEqual(scoredNode(firstPass.currentNode));
    const goblet = frozenPasses.find(item => item.reviewedQuestionVariantId.includes("goblet-cell"))!;
    expect(cases.find(clinicalCase => clinicalCase.id === goblet.clinicalCase.id)).toEqual(goblet.clinicalCase);
  });

  it("keeps the two unresolved comparisons unkeyed and versions only the changed scored meaning", () => {
    const round = packet.independentReviewRound1;
    expect(round.parkedPlanningSlots).toHaveLength(2);
    for (const slot of round.parkedPlanningSlots) {
      expect(slot.questionVariantId).toBeNull();
      expect(slot.conceptId).toBeNull();
      expect(slot.reason.length).toBeGreaterThan(150);
      expect(slot.unkeyedActions.length).toBeGreaterThanOrEqual(2);
      expect(questions.some(question => question.id === slot.reviewedQuestionVariantId)).toBe(false);
      expect(packet.proposals.some(proposal => proposal.questionVariantId === slot.reviewedQuestionVariantId)).toBe(false);
    }
    const revised = round.items.filter(item => item.status === "revised");
    expect(revised.filter(item => item.currentConceptId === item.originalConceptId)).toHaveLength(7);
    expect(revised.filter(item => item.currentConceptId !== item.originalConceptId).map(item => item.currentConceptId)).toEqual(["concept.appendix-appendicitis.postoperative-deep-infection-imaging.v2"]);
    for (const item of revised) {
      expect(item.currentQuestionVariantId).toBe(item.reviewedQuestionVariantId.replace(/\.v1$/, ".v2"));
      expect(questions.some(question => question.id === item.reviewedQuestionVariantId)).toBe(false);
    }
  });

  it("does not infer an enteric leak-negative acquisition or a pre-decided antibiotic endpoint", () => {
    const drainage = definitions.flatMap(definition => definition.nodes).find(node => node.slug === "postoperative-abscess-drainage")!;
    expect(drainage.currentUpdate).toContain("No enteric contrast was administered");
    expect(drainage.currentUpdate).not.toMatch(/no enteric contrast leak/i);
    expect(drainage.stem).not.toMatch(/source.control/i);
    const endpoint = definitions.flatMap(definition => definition.nodes).find(node => node.slug === "post-source-control-antibiotics")!;
    expect(endpoint.currentUpdate).toContain("has received four days of active antibiotics");
    expect([endpoint.currentUpdate, endpoint.stem, endpoint.choices.find(choice => choice.isCorrect)!.label].join(" ")).not.toMatch(/completed|complete course/i);
    const staging = definitions.flatMap(definition => definition.nodes).find(node => node.slug === "net-regional-resection")!;
    expect(staging.currentUpdate).toContain("Dedicated liver MRI");
    expect(staging.claimIds).toContain("claim.appendix-appendicitis.hepatic-cyst-mri");
  });

  it("retains the complete pre-salvage cases, questions and timing rows", () => {
    expect(preSalvageDefinitions).toEqual(packet.salvage.snapshot.definitions);
    expect(preSalvage.cases).toEqual(packet.salvage.snapshot.cases);
    expect(preSalvage.questions).toEqual(packet.salvage.snapshot.questions);
    expect(preSalvage.timing_entries).toEqual(packet.salvage.snapshot.timings);
  });

  it("queues exactly the five skipped PASS nodes and no accepted node for salvage re-review", () => {
    expect(salvageCases).toHaveLength(5);
    expect(salvageItems.every(item => item.status === "salvage")).toBe(true);
    expect(packet.salvage.items.map(item => item.questionVariantId).sort()).toEqual(packet.salvage.skippedPassReceipts.map(receipt => receipt.questionVariantId).sort());
    expect(packet.salvage.reviewQueue.map(item => item.questionVariantId).sort()).toEqual(packet.salvage.items.map(item => item.questionVariantId).sort());
    for (const input of packet.salvage.authorityInputs) expect(sha256(readRepositoryFile(input.file))).toBe(input.sha256);
    const acceptedIds = new Set(packet.salvage.acceptedPacketRows.map(row => row.questionVariantId));
    expect(packet.salvage.reviewQueue.every(item => item.status === "salvage" && !acceptedIds.has(item.questionVariantId))).toBe(true);
    for (const receipt of packet.salvage.skippedPassReceipts) expect(receipt).toMatchObject({ status: "skipped", evidence: { item: { verdict: "PASS" } } });
  });

  it.each(salvageCases.map(clinicalCase => [clinicalCase.id, clinicalCase] as const))(
    "keeps %s self-contained with the entire scored PASS node and exact timing classification", (_id, clinicalCase) => {
      expect(clinicalCase.decisionNodes).toHaveLength(1);
      const node = clinicalCase.decisionNodes[0]!;
      const record = packet.salvage.items.find(item => item.caseId === clinicalCase.id)!;
      const question = questions.find(question => question.id === node.questionVariantId)!;
      expect(record.status).toBe("salvage");
      expect(record.originalReview.item).toMatchObject({ id: node.questionVariantId, verdict: "PASS" });
      expect(record.independentContextReviewRequired).toBe(true);
      expect(scoredNode(node)).toEqual(scoredNode(record.before.currentNode));
      expect(question).toEqual(record.before.question);
      expect(node.primaryConceptId).toBe(record.before.question.conceptId);
      expect(sha256(JSON.stringify(scoredNode(node)))).toBe(record.sourceScoredNodeSha256);
      expect(node.terminalDispositions.map(disposition => disposition.answerChoiceId).sort()).toEqual(node.answerChoices.filter(choice => !choice.isCorrect).map(choice => choice.id).sort());
      for (const disposition of node.terminalDispositions) {
        if (disposition.kind !== "no_terminal_outcome") throw new Error("Salvage must not simulate a clinical terminal outcome");
        expect(disposition.clinicalRationale).toBe(node.answerChoices.find(choice => choice.id === disposition.answerChoiceId)!.rationale);
      }
      expect(record.salvageScoredNodeSha256).toBe(record.sourceScoredNodeSha256);
      expect(sha256(JSON.stringify(question))).toBe(record.sourceQuestionSha256);
      expect(record.salvageQuestionSha256).toBe(record.sourceQuestionSha256);
      expect(clinicalCase.prototypeDemographics).toEqual(record.before.clinicalCase.prototypeDemographics);
      expect(clinicalCase.patientDisplayName).toBe(record.before.clinicalCase.patientDisplayName);
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(record.after.clinicalCase).toEqual(clinicalCase);
      expect(timings.find(timing => timing.questionVariantId === node.questionVariantId)!.classification).toEqual(record.originalTimingRetained.classification);
      expect(record.timingProposal.caseId).toBe(clinicalCase.id);
      expect(packet.proposals.find(proposal => proposal.questionVariantId === node.questionVariantId)!.status).toBe("salvage");
      expect(node.resultGateAfter).toBeNull();
      expect(node.shuffleAnswers).toBe(true);
    },
  );

  it("leaves all three already accepted full cases, exact questions, nodes, timings and packet proposals untouched", () => {
    expect(packet.salvage.acceptedPacketRows).toHaveLength(3);
    for (const row of packet.salvage.acceptedPacketRows) {
      const clinicalCase = cases.find(clinicalCase => clinicalCase.id === row.caseId)!;
      expect(clinicalCase).toEqual(packet.salvage.snapshot.cases.find(clinicalCase => clinicalCase.id === row.caseId));
      expect(sha256(JSON.stringify(clinicalCase.decisionNodes.find(node => node.id === row.nodeId)))).toBe(row.rawReviewedNodeSha256);
      expect(sha256(JSON.stringify(questions.find(question => question.id === row.questionVariantId)))).toBe(row.questionSha256);
      expect(timings.find(entry => entry.questionVariantId === row.questionVariantId)).toEqual(packet.salvage.snapshot.timings.find(entry => entry.questionVariantId === row.questionVariantId));
      expect(packet.proposals.find(proposal => proposal.questionVariantId === row.questionVariantId)).toEqual(packet.salvage.snapshot.proposals.find(proposal => proposal.questionVariantId === row.questionVariantId));
    }
  });

  it("does not smuggle the returned archive companion into salvage or silently waive the live rewrite hold", () => {
    const archiveId = "question.topic.appendix-appendicitis.postoperative-infection-imaging.v2";
    expect(questions.some(question => question.id === archiveId)).toBe(false);
    expect(preSalvage.questions.some(question => question.id === archiveId)).toBe(true);
    const exploration = packet.salvage.items.find(item => item.questionVariantId.includes("persistent-pain-exploration"))!;
    expect(exploration.integrationDisposition).toContain("four-to-one");
    const original = packet.salvage.snapshot.proposals.find(proposal => proposal.questionVariantId === exploration.questionVariantId)!;
    expect(packet.proposals.find(proposal => proposal.questionVariantId === exploration.questionVariantId)!.replacesInventoryRecordIds).toEqual(original.replacesInventoryRecordIds);
    const adeno = packet.proposals.find(proposal => proposal.questionVariantId === "question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2")!;
    expect(adeno.replacesInventoryRecordIds).toEqual([]);
    expect(adeno.originalAuthorshipKind).toBe("new_gap_question");
  });
});
