import {topicQuestionAcceptance} from "./question-program-batch5-acceptance-test-support";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE as balance } from "@gamify-surgery/balance-config";
import { answerChoiceTimingRegistryEntrySchema, syntheticClinicalReleaseSchema } from "./schema";
import { SYNTHETIC_CLINICAL_RELEASE as live } from "./synthetic-content";
import { QUESTION_SHIP_MANIFEST as ship } from "./question-ship-manifest";

const sha = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const beforeImport = { release: sha(live), manifest: sha(ship) };
const topic = await import("./question-topic-esophagus-structural-inflammatory-emergencies-20261111");
const packet = topic.ESOPHAGUS_TOPIC_PACKET;
const ledger = topic.ESOPHAGUS_TOPIC_SOURCE_LEDGER;
const nodes = topic.ESOPHAGUS_TOPIC_NODES;
const questions = topic.ESOPHAGUS_TOPIC_QUESTIONS;
const cases = topic.ESOPHAGUS_TOPIC_CASES;
const claims = new Set(topic.ESOPHAGUS_TOPIC_CLAIMS.map((claim) => claim.id));
const sources = new Set(topic.ESOPHAGUS_TOPIC_SOURCES.map((source) => source.id));
const timingIds = new Set(balance.answerChoiceTimingProfiles.map((profile) => profile.id));
const reviewed = topic.ESOPHAGUS_TOPIC_REVIEWED_V1;
const catalogNodes = topic.ESOPHAGUS_TOPIC_CATALOG_NODES;
const allQuestions = [...new Map([...reviewed.questions, ...topic.ESOPHAGUS_TOPIC_CATALOG_QUESTIONS]
  .map((question) => [question.id, question])).values()];

describe("structural/inflammatory esophagus topic sidecar", () => {
  it("loads only through an explicit import and leaves live authority unchanged", () => {
    expect({ release: sha(live), manifest: sha(ship) }).toEqual(beforeImport);
    const candidateIds = new Set(questions.map((q) => q.id));
    for (const question of questions) topicQuestionAcceptance(question.id);
    expect(live.cases.flatMap((c) => c.decisionNodes).some((n) => candidateIds.has(n.questionVariantId))).toBe(questions.some(question => topicQuestionAcceptance(question.id).live));
    expect(ship.accepted.some((row) => candidateIds.has(row.questionVariantId))).toBe(questions.some(question => topicQuestionAcceptance(question.id).accepted));
    expect(topic.ESOPHAGUS_TOPIC_MANIFEST.managerAccepted).toBe(false);
    expect(topic.ESOPHAGUS_TOPIC_MANIFEST.independentPass).toBe(false);
  });

  it("reconciles every assigned identity, exact variant and retained context", () => {
    const program = JSON.parse(readFileSync(new URL("../../../docs/research/question-topic-program-20261111.json", import.meta.url), "utf8"));
    const assigned = program.inventory.filter((row: { primaryTopicSlug: string }) => row.primaryTopicSlug === topic.ESOPHAGUS_TOPIC_SLUG);
    expect(packet.assignment.inventory).toEqual(assigned);
    expect(packet.audit.map((row) => row.recordId).sort()).toEqual(assigned.map((row: { recordId: string }) => row.recordId).sort());
    expect(packet.audit).toHaveLength(40);
    expect(new Set(packet.audit.flatMap((row) => row.variantIds)).size).toBe(40);
    expect(packet.counts).toMatchObject({ audited: 40, kept: 2, rewritten: 12, retiredAndReplacedProposed: 26, new: 15 });
    expect(packet.audit.reduce((sum, row) => sum + row.contextsAudited, 0)).toBe(52);
    for (const row of packet.audit) {
      expect(["Keep", "Rewrite", "Retire-and-replace"]).toContain(row.verdict);
      expect(row.reasons.every((reason) => reason.length > 30)).toBe(true);
      const snapshot = packet.beforeSnapshots.find((snapshot) => snapshot.recordId === row.recordId)!;
      expect(snapshot.questionHash).toBe(sha(snapshot.question));
      expect(row.beforeQuestionHash).toBe(snapshot.questionHash);
      expect(row.contextFindings).toHaveLength(snapshot.contexts.length);
      for (const context of snapshot.contexts) {
        expect(context.caseHash).toBe(sha(context.clinicalCase));
        const node = context.clinicalCase.decisionNodes.find((n) => row.variantIds.includes(n.questionVariantId))!;
        expect(context.nodeHash).toBe(sha(node));
      }
      if (row.verdict !== "Keep") {
        expect(reviewed.questions.some((q) => q.id === row.replacementQuestionVariantId)).toBe(true);
        expect(row.postReviewReplacement).not.toBeNull();
      }
    }
  });

  it("preserves exact PASS cases and carries the original owner hold", () => {
    expect(packet.assignment.frozenReferences).toHaveLength(2);
    for (const reference of packet.assignment.frozenReferences) {
      const current = live.cases.find((c) => c.id === reference.caseId)!;
      expect(sha(current)).toBe(reference.currentCaseSha256);
      expect(sha(current.decisionNodes.find((n) => n.questionVariantId === reference.questionVariantId))).toBe(reference.currentNodeSha256);
      expect(reference.clinicalApproval).toBeNull();
      expect(packet.audit.find((row) => row.recordId === reference.recordId)!.verdict).toBe("Keep");
    }
    expect(packet.assignment.recordedHolds.map((hold) => hold.id)).toContain("review.n3.esophageal-dilation-versus-inflammatory-control.v2");
    expect(packet.ownerApprovalsNeeded.some((hold) => JSON.stringify(hold).includes("PPI dose and treatment duration"))).toBe(true);
    expect(packet.assignment.unkeyedDraftSlots).toEqual([]);
    expect(packet.assignment.withheldTeachingPoints).toEqual([]);
  });

  it("validates clinic cases, finite profiles and randomized three-choice nodes", () => {
    expect(syntheticClinicalReleaseSchema.safeParse(topic.ESOPHAGUS_TOPIC_SOURCE_RELEASE).success).toBe(true);
    expect(cases).toHaveLength(11);
    expect(questions).toHaveLength(11);
    expect(cases.filter((c) => c.decisionNodes.length > 1)).toHaveLength(0);
    expect(new Set(questions.map((q) => q.id)).size).toBe(11);
    expect(new Set(topic.ESOPHAGUS_TOPIC_CONCEPTS.map((c) => c.id)).size).toBe(11);
    expect(packet.reviewRound2.currentProposalBundle).toEqual({
      questions,
      cases,
      concepts: topic.ESOPHAGUS_TOPIC_CONCEPTS,
      timingEntries: topic.ESOPHAGUS_TOPIC_TIMING_ENTRIES,
      orderProposals: topic.ESOPHAGUS_TOPIC_ORDER_PROPOSALS,
      sourceLinks: topic.ESOPHAGUS_TOPIC_SOURCE_LINKS,
      statementMappings: topic.ESOPHAGUS_TOPIC_STATEMENT_MAPPINGS,
    });
    for (const clinicalCase of cases) {
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(clinicalCase.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(1);
      expect(clinicalCase.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(clinicalCase.prototypeDemographics);
      expect(clinicalCase.presentation).toContain(String(clinicalCase.prototypeDemographics!.ageYears));
      for (const node of clinicalCase.decisionNodes) {
        expect(node.shuffleAnswers).toBe(true);
        expect(node.answerChoices).toHaveLength(3);
        expect(node.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
        expect(node.resultGateAfter).toBeNull();
        expect(node.answerChoices.every((choice) => choice.serviceRequest === null)).toBe(true);
        expect(node.stem).toContain("{patientName}");
      }
    }
  });

  it("preserves the scored concept meaning through every revision", () => {
    for (const disposition of packet.reviewRound2.items) {
      const original = reviewed.questions.find((question) => question.id === disposition.reviewedQuestionVariantId)!;
      const current = catalogNodes.find((node) => node.questionVariantId === (disposition.attemptQuestionVariantId ?? disposition.activeQuestionVariantId))!;
      expect(current.conceptId).toBe(original.conceptId);
    }
    for (const question of allQuestions) {
      expect(question.reviewStatus).toBe("needs_clinician_review");
      expect(question.lastClinicianReview).toBeNull();
    }
    const contained = nodes.find((node) => node.slug === "contained-perforation-surveillance")!;
    const originalContained = packet.reviewRound2.reviewedV1CandidateCases
      .find((item) => item.nodes.some((node) => node.slug === contained.slug))!
      .nodes.find((node) => node.slug === contained.slug)!;
    expect(contained.currentUpdate).toBe(originalContained.currentUpdate);
    expect(contained.task).toContain("management plan");
    expect(contained.choices.map((choice) => choice.id)).toEqual(["repair", "monitor", "stent"]);
  });

  it("maps every testing identity and exact label to an existing placeholder without executing orders", () => {
    expect(topic.ESOPHAGUS_TOPIC_TIMING_ENTRIES).toHaveLength(11);
    const required = nodes.flatMap((node) => node.choices.filter((choice) => choice.timingProfileId).map((choice) => ({ node, choice })));
    expect(required.length).toBeGreaterThan(8);
    expect(topic.ESOPHAGUS_TOPIC_ORDER_PROPOSALS).toHaveLength(required.length);
    for (const entry of topic.ESOPHAGUS_TOPIC_TIMING_ENTRIES) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(entry).success).toBe(true);
      const question = questions.find((q) => q.id === entry.questionVariantId)!;
      const clinicalCase = cases.find((clinicalCase) => clinicalCase.id === entry.caseId)!;
      expect(clinicalCase.decisionNodes.some((node) => node.id === entry.nodeId && node.questionVariantId === question.id)).toBe(true);
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices.map((c) => [c.choiceId, c.choiceLabel]).sort()).toEqual(question.answerChoices.map((c) => [c.id, c.label]).sort());
        // Identity/label matching remains correct after runtime presentation order changes.
        for (const choice of [...question.answerChoices].reverse()) expect(entry.classification.choices.find((c) => c.choiceId === choice.id)!.choiceLabel).toBe(choice.label);
        for (const choice of entry.classification.choices) if (choice.timing.kind === "test") expect(timingIds.has(choice.timing.timingProfileId)).toBe(true);
      }
    }
    for (const order of topic.ESOPHAGUS_TOPIC_ORDER_PROPOSALS) {
      expect(order.disposition).toEqual({ kind: "not_executed", reason: "future_planned" });
      expect(order.serviceRequest).toBeNull();
      expect(order.resultGateAfter).toBeNull();
    }
  });

  it("closes source-claim-question mappings with rights and independent review states", () => {
    expect(ledger.sources).toHaveLength(13);
    expect(ledger.claims).toHaveLength(34);
    const originalLedger = packet.reviewRound2.reviewedV1SourceLedger;
    expect(sha(originalLedger)).toBe("734436eadfa78ad0e75d52c9f8474791f555607c5ed7fff1800a045eb68c1cd5");
    for (const originalClaim of originalLedger.claims) expect(ledger.claims.find((claim) => claim.id === originalClaim.id)).toEqual(originalClaim);
    for (const originalSource of originalLedger.sources) {
      const currentSource = ledger.sources.find((source) => source.id === originalSource.id)!;
      const { evidenceClaimIds: originalMappings, ...originalMetadata } = originalSource;
      const { evidenceClaimIds: currentMappings, ...currentMetadata } = currentSource;
      expect(currentMetadata).toEqual(originalMetadata);
      expect(originalMappings.every((id) => currentMappings.includes(id))).toBe(true);
    }
    for (const source of ledger.sources) {
      expect(source.completeCitation.length).toBeGreaterThan(60);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.reuseNotes.length).toBeGreaterThan(40);
      expect(source.authorityAssessment.length).toBeGreaterThan(40);
      expect(source.verification.termsCheck.length).toBeGreaterThan(30);
      expect([...source.evidenceClaimIds].sort()).toEqual(ledger.claims.filter((claim) => claim.sourceIds.includes(source.id)).map((claim) => claim.id).sort());
    }
    for (const claim of ledger.claims) {
      expect(claim.reviewStatus).toBe("needs_clinician_review");
      expect(claim.lastClinicianReview).toBeNull();
      expect(claim.sourceIds.every((id) => sources.has(id))).toBe(true);
      expect(claim.limitation.length).toBeGreaterThan(30);
      const mapped = ledger.claimToQuestion.find((mapping) => mapping.claimId === claim.id)!;
      expect([...mapped.questionVariantIds].sort()).toEqual(allQuestions.filter((q) => q.supportingEvidenceClaimIds.includes(claim.id)).map((q) => q.id).sort());
      expect([...mapped.activeQuestionVariantIds].sort()).toEqual(questions.filter((q) => q.supportingEvidenceClaimIds.includes(claim.id)).map((q) => q.id).sort());
    }
    for (const mapping of topic.ESOPHAGUS_TOPIC_STATEMENT_MAPPINGS) for (const field of mapping.fields) expect(field.claimIds.length > 0 && field.claimIds.every((id) => claims.has(id))).toBe(true);
    for (const link of topic.ESOPHAGUS_TOPIC_SOURCE_LINKS) expect(link).toMatchObject({ target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer" });
  });

  it("retains concrete per-item author attacks and decision-changing observations", () => {
    for (const node of nodes) {
      const gate = node.authorGate;
      for (const field of ["coverTheKey", "decisionStage", "interpret", "apply", "difficultyReason", "decidingObservation", "counterfactual", "deletionTest", "sequenceAudit", "remainingRisk"]) expect(String(gate[field]).length).toBeGreaterThan(25);
      expect(gate.independent).toBe(false);
      expect(gate.clinicalApproval).toBe(false);
      expect(node.choices.some((choice) => choice.id === gate.closestChoice && choice.id !== node.correctChoice)).toBe(true);
      expect(node.choices.some((choice) => choice.id === gate.counterfactualChoice)).toBe(true);
      for (const choice of node.choices) {
        expect(choice.temptation.length).toBeGreaterThan(20);
        expect(choice.correctUnder.length).toBeGreaterThan(25);
      }
    }
  });

  it("preserves all six exact PASS questions, visible nodes, headers and profiles", () => {
    expect(sha(packet.reviewRound2.reviewedV1Bundle)).toBe("46048055dd3f0694188b8d9ecf3a3c4855db5338f2cb88d6e2636207a4db4ab8");
    const questionHashes = [
      "aff6f274324bb1e9f6988279ff32a1893406ecb855ef3260e1dc663c5e491fcb",
      "f51cec1188d0cf37b6f02797e2338c443bd152cf572b497d47ae3a201c153ca6",
      "832f952543ea3385ff6b067bfa9cca9e19c210c2625b5c007d5f10dfecf2b1a3",
      "7e5411eb7c7eb3074864c48f207958728b264adcdac2f3ff5f0d82dc2a5d2e30",
      "d0395414430166d20d33ce4176d5db9bc0e2166ef68a94cd4ae76d740635fafb",
      "88ca5965bb4a1dc2cf0cd52112885f439b6e4e54a4b8b0ed41e2c2de5bc879e5",
    ];
    expect(packet.reviewRound2.passPreservation.map((pin) => pin.questionSha256)).toEqual(questionHashes);
    for (const pin of packet.reviewRound2.passPreservation) {
      const originalCase = reviewed.cases.find((clinicalCase) => clinicalCase.id === pin.caseId)!;
      const originalNode = originalCase.decisionNodes.find((node) => node.id === pin.nodeId)!;
      const currentCase = cases.find((clinicalCase) => clinicalCase.decisionNodes.some((node) => node.id === pin.nodeId))!;
      const currentNode = currentCase.decisionNodes[0]!;
      const originalItem = packet.reviewRound2.reviewedV1CandidateCases.find((item) => item.nodes.some((node) => node.questionVariantId === pin.questionVariantId))!;
      expect(catalogNodes.find((node) => node.questionVariantId === pin.questionVariantId))
        .toEqual(originalItem.nodes.find((node) => node.questionVariantId === pin.questionVariantId));
      expect(sha(questions.find((question) => question.id === pin.questionVariantId))).toBe(pin.questionSha256);
      expect(sha(originalCase)).toBe(pin.caseSha256);
      expect(sha(originalNode)).toBe(pin.nodeSha256);
      const { terminalDispositions: originalTerminal, ...originalVisible } = originalNode;
      const { terminalDispositions: currentTerminal, ...currentVisible } = currentNode;
      expect(currentVisible).toEqual(originalVisible);
      for (const key of Object.keys(pin.header) as (keyof typeof pin.header)[]) expect(currentCase[key]).toEqual(pin.header[key]);
      if (originalTerminal.length > 0) expect(currentTerminal).toEqual(originalTerminal);
      else for (const terminal of currentTerminal) {
        expect(terminal.kind).toBe("no_terminal_outcome");
        if (terminal.kind === "no_terminal_outcome") {
          expect(terminal.clinicalRationale).toBe(originalNode.answerChoices.find((choice) => choice.id === terminal.answerChoiceId)!.rationale);
          expect(terminal.sourceLabels).toEqual(originalNode.sourceLabels);
        }
      }
      if (originalCase.decisionNodes.length === 1) expect(currentCase).toEqual(originalCase);
    }
    expect(reviewed.cases.filter((clinicalCase) => clinicalCase.decisionNodes.length > 1)).toHaveLength(5);
    expect(reviewed.questions).toHaveLength(18);
    expect(reviewed.timingEntries).toHaveLength(18);
  });

  it("records one attempt per returned item and excludes every parked draft", () => {
    expect(packet.reviewRound2.summary).toMatchObject({ reviewed: 18, passPreserved: 6, revised: 5, parked: 7, revisionAttempts: 12 });
    const reviewFile = readFileSync(new URL(`../../../${packet.reviewRound2.reviewFile}`, import.meta.url), "utf8");
    expect(createHash("sha256").update(reviewFile).digest("hex")).toBe(packet.reviewRound2.reviewFileSha256);
    expect(JSON.parse(reviewFile)).toEqual(packet.reviewRound2.independentReview);
    expect(packet.reviewRound2.items).toHaveLength(18);
    expect(topic.ESOPHAGUS_TOPIC_PARKED_ITEMS).toHaveLength(7);
    for (const disposition of packet.reviewRound2.items) {
      const originalReview = packet.reviewRound2.independentReview.find((review) => review.id === disposition.reviewedQuestionVariantId)!;
      if (originalReview.verdict === "PASS") {
        expect(disposition.status).toBe("pass-preserved");
        expect(disposition.attemptCount).toBe(0);
        continue;
      }
      expect(disposition.attemptCount).toBe(1);
      expect(disposition.attemptQuestionVariantId).toMatch(/\.v2$/);
      const expectedIssues = ["clarityIssues", "cues", "fairness", "suggestions"] as const;
      expect(disposition.issueResponses).toHaveLength(expectedIssues.reduce((sum, field) => sum + originalReview[field].length, 0));
      for (const field of expectedIssues) expect(disposition.issueResponses.filter((response) => response.field === field).map((response) => response.originalFinding)).toEqual(originalReview[field]);
      expect(disposition.reason.length).toBeGreaterThan(50);
      if (disposition.status === "parked") {
        expect(questions.some((question) => question.id === disposition.attemptQuestionVariantId)).toBe(false);
        expect(disposition.activeQuestionVariantId).toBeNull();
      } else {
        expect(questions.some((question) => question.id === disposition.activeQuestionVariantId)).toBe(true);
        expect(disposition.independentReviewStatus).toBe("pending_for_v2");
      }
    }
  });

  it("keeps the Markdown display, evidence and validation synchronized with final JSON", () => {
    const markdown = readFileSync(new URL("../../../docs/research/question-topic-esophagus-structural-inflammatory-emergencies-20261111.md", import.meta.url), "utf8");
    for (const item of packet.candidateCases) {
      for (const node of item.nodes) {
        const section = markdown.split(`### ${node.slug} — ${item.reviewDisposition}\n\n`)[1]!.split("\n### ")[0]!;
        const current = section.split("#### Current version or parked attempt\n\n")[1]!;
        for (const text of [item.presentation, item.complaint, node.questionVariantId, node.conceptId, node.currentUpdate, node.task, node.explanation]) expect(current).toContain(text);
        for (const choice of node.choices) {
          expect(current).toContain(choice.label);
          expect(current).toContain(choice.rationale);
        }
      }
    }
    const sourceSection = markdown.split("## Atomic evidence and source provenance\n\n")[1]!.split("## Timing, orders, source links and integration")[0]!;
    const sourceData = JSON.parse(sourceSection.match(/```json\n([\s\S]*?)\n```/)![1]!);
    expect(sourceData.sources).toEqual(ledger.sources);
    expect(sourceData.claims).toEqual(ledger.claims);
    expect(sourceData.sourceToClaim).toEqual(ledger.sourceToClaim);
    expect(sourceData.claimToQuestion).toEqual(ledger.claimToQuestion);
    const validationSection = markdown.split("## Validation\n\n")[1]!.split("## Final handoff")[0]!;
    const validationData = JSON.parse(validationSection.match(/```json\n([\s\S]*?)\n```/)![1]!);
    expect(validationData).toEqual({
      json: packet.validation.json,
      focusedTests: packet.validation.focusedTests,
      typecheck: packet.validation.typecheck,
      checkedAt: packet.validation.checkedAt,
    });
    for (const result of packet.validation.commands) expect(validationSection).toContain(result.output.trim());
    expect(markdown).toContain(`JSON ${packet.validation.json.status}.`);
  });
});
