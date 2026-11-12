import {topicQuestionAcceptance, retainedTopicCase} from "./question-program-batch5-acceptance-test-support";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { ROW_037_CLINICAL_APPROVAL, ROW_037_QUESTION_VARIANTS } from "./approved-data/postoperative-chylous-ascites";
import { SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";
import {
  answerChoiceTimingRegistryEntrySchema,
  decisionNodeSchema,
  syntheticClinicalCaseSchema,
  testedConceptSchema,
  validateSyntheticClinicalRelease,
} from "./schema";
import {
  LIVER_BENIGN_TOPIC_PACKET as packet,
  LIVER_BENIGN_TOPIC_LEDGER as ledger,
  LIVER_BENIGN_TOPIC_CASES as cases,
  LIVER_BENIGN_TOPIC_NODES as nodes,
  LIVER_BENIGN_TOPIC_QUESTIONS as questions,
  LIVER_BENIGN_TOPIC_CONCEPTS as concepts,
  LIVER_BENIGN_TOPIC_CONCEPT_PROPOSALS as proposals,
  LIVER_BENIGN_TOPIC_TIMING_ENTRIES as timings,
  LIVER_BENIGN_TOPIC_SOURCE_LINKS as links,
} from "./question-topic-liver-benign-portal-infection-20261111";

const root = new URL("../../../", import.meta.url);
const read = (file: string) => readFileSync(new URL(file, root), "utf8");
const sha = (value: string) => createHash("sha256").update(value).digest("hex");
const slug = "liver-benign-portal-infection";

describe("liver benign/portal/infection explicit-import topic sidecar", () => {
  it("reconciles every assigned exact inventory, concept, case, node and variant row", () => {
    const program = JSON.parse(read("docs/research/question-topic-program-20261111.json")) as {
      inventory: Array<{ recordId: string; primaryTopicSlug: string }>;
      concepts: Array<{ conceptId: string; primaryTopicSlug: string }>;
      caseAssignments: Array<{ primaryTopicSlug: string }>;
      nodeAssignments: Array<{ primaryTopicSlug: string }>;
      variantAssignments: Array<{ primaryTopicSlug: string }>;
    };
    for (const field of ["inventory", "concepts", "caseAssignments", "nodeAssignments", "variantAssignments"] as const) {
      expect(packet.assignment[field]).toEqual(program[field].filter((row) => row.primaryTopicSlug === slug));
    }
    expect(packet.audit).toHaveLength(32);
    expect(new Set(packet.audit.map((row) => row.inventoryRecordId)).size).toBe(32);
    expect(packet.audit.map((row) => row.inventoryRecordId).sort())
      .toEqual(packet.assignment.inventory.map((row) => row.recordId).sort());
    expect(new Set(packet.audit.map((row) => row.questionVariantId)).size).toBe(32);
    expect(packet.audit.filter((row) => row.verdict === "Keep")).toHaveLength(2);
    expect(packet.audit.filter((row) => row.verdict === "Rewrite")).toHaveLength(11);
    expect(packet.audit.filter((row) => row.verdict === "Retire-and-replace")).toHaveLength(19);
    expect(packet.assignment.concepts).toHaveLength(11);
    expect(packet.assignment.recordedHolds).toEqual([]);
    expect(packet.assignment.unkeyedDraftSlots).toEqual([]);
    expect(packet.assignment.withheldTeachingPoints).toEqual([]);
    for (const row of packet.audit) {
      expect(row.reasons.length).toBeGreaterThanOrEqual(2);
      expect(row.sourceFile).toMatch(/\.ts$/);
      expect(row.sourceExport.length).toBeGreaterThan(5);
      if (row.verdict !== "Keep") {
        expect(packet.reviewRound.snapshot.questions.some((question) => question.id === row.replacementQuestionVariantId)).toBe(true);
        const disposition = packet.reviewRound.dispositions.find((item) => item.reviewedQuestionVariantId === row.replacementQuestionVariantId)!;
        expect(disposition).toBeDefined();
        if (disposition.activeQuestionVariantId) {
          expect(questions.some((question) => question.id === disposition.activeQuestionVariantId)).toBe(true);
        } else expect(disposition.status).toBe("parked");
      }
    }
  });

  it("checks exact before hashes and every captured distinct materialized context", () => {
    expect(packet.inputSnapshots.questions).toHaveLength(32);
    expect(packet.inputSnapshots.contexts).toHaveLength(43);
    for (const row of packet.audit) {
      expect(sha(JSON.stringify(row.beforeQuestion)), row.questionVariantId).toBe(row.beforeQuestionSha256);
      for (const context of row.beforeContexts) {
        expect(sha(JSON.stringify(context.clinicalCase))).toBe(context.caseSha256);
        expect(sha(JSON.stringify(context.node))).toBe(context.nodeSha256);
        expect(context.node.questionVariantId).toBe(row.questionVariantId);
        expect(context.clinicalCase.id).toBe(row.caseId);
      }
    }
    for (const input of packet.assignment.baseline.sourceHashes) {
      if (["packages/clinical-content/src/index.ts", "packages/clinical-content/src/synthetic-content.ts",
        "packages/clinical-content/src/question-ship-manifest.ts"].includes(input.file)) continue;
      expect(sha(read(input.file)), input.file).toBe(input.observedSha256);
      expect(input.observedSha256, input.file).toBe(input.programSha256);
    }
  });

  it("preserves all 16 assigned live versions and the two historical exact clinical approvals", () => {
    const liveRows = packet.audit.filter((row) => row.status === "live original");
    expect(liveRows).toHaveLength(16);
    for (const row of liveRows) {
      const current = retainedTopicCase(row.caseId!);
      expect(current, row.inventoryRecordId).toBeDefined();
      expect(row.beforeContexts.some((context) => context.caseSha256 === sha(JSON.stringify(current)))).toBe(true);
    }
    const approval = packet.assignment.clinicalApprovals[0]!;
    expect(approval.value).toEqual(ROW_037_CLINICAL_APPROVAL);
    expect(sha(JSON.stringify(ROW_037_CLINICAL_APPROVAL))).toBe(approval.sha256);
    for (const audit of packet.audit.filter((row) => row.verdict === "Keep")) {
      const original = ROW_037_QUESTION_VARIANTS.find((question) => question.id === audit.questionVariantId);
      expect(original).toEqual(audit.beforeQuestion);
      expect(audit.historicalApproval).toMatchObject({ reviewer: "Melissa Rowland, MD", reviewedOn: "2026-08-06" });
      expect(audit.basicAccepted).toBe(false);
    }
    expect(packet.assignment.exactFrozenPasses).toEqual([]);
    expect(packet.assignment.independentReviews).toHaveLength(5);
    expect(packet.assignment.independentReviews.flatMap((review) => review.decisions).every((decision) => decision.verdict === "REVISE")).toBe(true);
  });

  it("materializes 20 standalone clinic cases through existing schemas", () => {
    expect(questions).toHaveLength(20);
    expect(nodes).toHaveLength(20);
    expect(cases).toHaveLength(20);
    expect(concepts).toHaveLength(20);
    expect(cases.every((clinicalCase) => clinicalCase.decisionNodes.length === 1)).toBe(true);
    expect(new Set(questions.map((question) => question.id)).size).toBe(20);
    expect(new Set(nodes.map((node) => node.id)).size).toBe(20);
    for (const concept of concepts) expect(() => testedConceptSchema.parse(concept)).not.toThrow();
    for (const node of nodes) {
      expect(() => decisionNodeSchema.parse(node)).not.toThrow();
      expect(node.shuffleAnswers).toBe(true);
      expect(node.answerChoices).toHaveLength(3);
      expect(node.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(node.resultGateAfter).toBeNull();
      expect(node.answerChoices.every((choice) => choice.serviceRequest === null)).toBe(true);
    }
    for (const clinicalCase of cases) {
      expect(() => syntheticClinicalCaseSchema.parse(clinicalCase)).not.toThrow();
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(clinicalCase.presentation).toContain("{patientName}");
      expect(clinicalCase.chiefComplaint!.trim().split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(1);
      expect(clinicalCase.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(clinicalCase.prototypeDemographics);
    }
    expect(() => validateSyntheticClinicalRelease({
      schemaVersion: 1,
      id: "clinical.topic.liver-benign.authoring.v1",
      publicationStatus: "synthetic_unapproved_prototype",
      disclaimer: "Synthetic authoring preview; not clinically approved. All content requires clinician review.",
      concepts,
      cases,
    })).not.toThrow();
  });

  it("keeps unchanged identities and explicitly records changed clinical meanings", () => {
    const previousIds = new Set(packet.assignment.concepts.map((concept) => concept.conceptId));
    expect(packet.reviewRound.snapshot.conceptDecisions.filter((proposal) => previousIds.has(proposal.conceptId))).toHaveLength(10);
    expect(proposals.filter((proposal) => previousIds.has(proposal.conceptId))).toHaveLength(2);
    expect(proposals.filter((proposal) => proposal.conceptRelation === "new_meaning")).toHaveLength(11);
    const changed = proposals.filter((proposal) => proposal.conceptRelation === "materially_changed_version");
    expect(changed).toHaveLength(7);
    expect(changed.find((proposal) => proposal.conceptId === "concept.cirrhosis.urgent-surgery-haemostasis-assessment.v2")).toMatchObject({
      conceptId: "concept.cirrhosis.urgent-surgery-haemostasis-assessment.v2",
      previousConceptId: "concept.cirrhosis.urgent-surgery-haemostasis-assessment.v1",
      reviewStatus: "needs_clinician_review",
    });
    expect(packet.reviewRound.conceptChanges).toHaveLength(6);
    for (const change of packet.reviewRound.conceptChanges) {
      expect(change.conceptId).not.toBe(change.previousConceptId);
      expect(proposals.find((proposal) => proposal.conceptId === change.conceptId)).toMatchObject({
        previousConceptId: change.previousConceptId, conceptRelation: "materially_changed_version",
      });
      expect(packet.reviewRound.snapshot.conceptDecisions.some((proposal) => proposal.conceptId === change.previousConceptId)).toBe(true);
    }
    expect(packet.proposedNodes.filter((node) => node.questionKind === "new")).toHaveLength(14);
    expect(packet.coverageHistory).toHaveLength(11);
    expect(packet.assignment.identityReuseNotes[0]!.nodeId).toBe("node.n1.postoperative-ascites-ct.v1");
    expect(packet.assignment.crossTopicBoundaryRows.every((row) => row.primaryTopicSlug === "pancreas-chronic-cysts-neoplasia")).toBe(true);
  });

  it("binds every testing option including distractors by exact identity and label", () => {
    const profileIds = new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map((profile) => profile.id));
    expect(timings).toHaveLength(20);
    let testingChoices = 0;
    for (const node of nodes) {
      const authored = packet.proposedNodes.find((item) => item.nodeId === node.id)!;
      const entry = timings.find((item) => item.nodeId === node.id && item.questionVariantId === node.questionVariantId)!;
      expect(() => answerChoiceTimingRegistryEntrySchema.parse(entry)).not.toThrow();
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices.map((choice) => [choice.choiceId, choice.choiceLabel]))
          .toEqual(node.answerChoices.map((choice) => [choice.id, choice.label]));
        for (const choice of entry.classification.choices) {
          expect(choice.timing).toEqual(authored.choices.find((item) => item.id === choice.choiceId)!.timing);
          if (choice.timing.kind === "test") {
            testingChoices++;
            expect(profileIds.has(choice.timing.timingProfileId)).toBe(true);
            expect(packet.testOrderProposals.some((order) => order.choiceId === choice.choiceId &&
              order.choiceLabel === choice.choiceLabel && order.questionVariantId === node.questionVariantId)).toBe(true);
          }
        }
      } else expect(authored.choices.every((choice) => choice.timing.kind === "no_test")).toBe(true);
    }
    expect(testingChoices).toBe(24);
    expect(packet.testOrderProposals).toHaveLength(24);
    expect(packet.testOrderProposals.every((order) => order.execution === "not_added" && order.serviceRequest === null && order.resultGateAfter === null)).toBe(true);
  });

  it("maps every proposed statement to atomic claims, full source records and safe links", () => {
    const claimIds = new Set(ledger.evidenceClaims.map((claim) => claim.id));
    const sourceIds = new Set(ledger.sources.map((source) => source.id));
    expect(claimIds.size).toBe(47);
    expect(sourceIds.size).toBe(22);
    for (const question of packet.proposedNodes) {
      expect(question.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
      for (const id of question.supportingEvidenceClaimIds) expect(claimIds.has(id), id).toBe(true);
      expect(question.statementMappings.some((mapping) => mapping.field === "explanation")).toBe(true);
      for (const choice of question.choices) {
        expect(choice.rationale.length).toBeGreaterThan(30);
        expect(choice.counterfactualWhereReasonable.length).toBeGreaterThan(30);
      }
    }
    for (const claim of ledger.evidenceClaims) {
      expect(claim.id).toContain(slug);
      expect(claim.limitation.length).toBeGreaterThan(15);
      for (const id of claim.sourceIds) expect(sourceIds.has(id), id).toBe(true);
      expect(ledger.claimToQuestionMappings.find((mapping) => mapping.claimId === claim.id)!.questionVariantIds.sort())
        .toEqual(questions.filter((question) => question.supportingEvidenceClaimIds.includes(claim.id)).map((question) => question.id).sort());
    }
    for (const source of ledger.sources) {
      expect(source.completeCitation.length).toBeGreaterThan(40);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.authorityAssessment.length).toBeGreaterThan(20);
      expect(source.reuseNotes.length).toBeGreaterThan(20);
      expect(source.evidenceClaimIds.sort()).toEqual(ledger.evidenceClaims.filter((claim) => claim.sourceIds.includes(source.id)).map((claim) => claim.id).sort());
    }
    for (const link of links) {
      expect(link.href).toMatch(/^https:\/\//);
      expect(link).toMatchObject({ target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer" });
    }
    expect(ledger.sources.find((source) => source.id.endsWith(".local-1"))!.accessedOn).toBe("2026-08-06");
    expect(ledger.evidenceClaims.find((claim) => claim.id.endsWith(".chyle-confirm"))!.lastCheckedOn).toBe("2026-08-06");
  });

  it("retains narrative author checks, staged later records and decision-changing counterfactuals", () => {
    for (const node of packet.proposedNodes) {
      for (const field of ["cueAttack", "decisionStageAndCategory", "twoConsequentialSteps", "predictedDifficulty", "singleBestAnswer"] as const) {
        expect(node.authorGate[field].length, `${node.slug}: ${field}`).toBeGreaterThan(40);
      }
      expect(node.reasoningSteps).toHaveLength(2);
      expect(node.deletionAudit.length).toBeGreaterThanOrEqual(5);
      expect(node.entireExhibitDeletionResult).toContain(node.decidingObservation);
      expect(node.sequenceReview.length).toBeGreaterThan(60);
      expect(node.authorGate.appliesToQuestionVariantId).toBe(node.questionVariantId);
      if (node.counterfactual.preferredChoiceId) {
        expect(node.choices.some((choice) => choice.id === node.counterfactual.preferredChoiceId && !choice.isCorrect)).toBe(true);
      } else expect(node.counterfactual.reason.length).toBeGreaterThan(30);
    }
    const hemostasis = packet.proposedNodes.find((node) => node.slug === "cirrhotic-inr")!;
    const urgent = packet.reviewRound.snapshot.proposedNodes.find((node) => node.slug === "urgent-hernia-boundary")!;
    expect(hemostasis.currentUpdate).toContain("later");
    expect(urgent.explanation).not.toContain("Cryoprecipitate");
    const firstChyleNode = packet.reviewRound.snapshot.proposedNodes.find((node) => node.slug === "postop-imaging")!;
    expect(firstChyleNode.explanation).not.toContain("electrophoresis");
  });

  it("reconciles the exact independent review and one response per returned item", () => {
    const response = packet.reviewRound;
    expect(sha(read(response.reviewFile))).toBe(response.reviewFileSha256);
    expect(JSON.parse(read(response.reviewFile))).toEqual(response.reviewDecisions);
    expect(response.dispositions).toHaveLength(27);
    expect(response.dispositions.filter((item) => item.status === "pass-preserved")).toHaveLength(10);
    expect(response.dispositions.filter((item) => item.status === "revised")).toHaveLength(10);
    expect(response.dispositions.filter((item) => item.status === "parked")).toHaveLength(7);
    expect(new Set(response.dispositions.map((item) => item.reviewedQuestionVariantId)).size).toBe(27);
    expect(response.revisionAttempts).toHaveLength(17);
    for (const decision of response.reviewDecisions) {
      const disposition = response.dispositions.find((item) => item.reviewedQuestionVariantId === decision.id)!;
      const attempts = response.revisionAttempts.filter((item) => item.reviewedQuestionVariantId === decision.id);
      if (decision.verdict === "PASS") {
        expect(disposition.status).toBe("pass-preserved");
        expect(attempts).toHaveLength(0);
      } else {
        expect(attempts).toHaveLength(1);
        const attempt = attempts[0]!;
        expect(attempt.attemptNumber).toBe(1);
        expect(attempt.status).toBe(disposition.status);
        expect(attempt.candidateQuestionVariantId).toBe(decision.id.replace(/\.v1$/, ".v2"));
        expect(attempt.candidate.authorGate.appliesToQuestionVariantId).toBe(attempt.candidateQuestionVariantId);
        if (disposition.status === "revised") {
          expect(packet.proposedNodes.find((item) => item.questionVariantId === attempt.candidateQuestionVariantId)).toEqual(attempt.candidate);
          expect(packet.caseCompositionProposals.find((item) => item.id === attempt.candidate.caseId)).toEqual(attempt.clinicalCaseProposal);
        }
        expect(attempt.issueResponses.map(({ kind, issue }) => ({ kind, issue })))
          .toEqual((["clarityIssues", "cues", "fairness", "suggestions"] as const)
            .flatMap((kind) => decision[kind].map((issue) => ({ kind, issue }))));
        expect(attempt.issueResponses.every((issue) => issue.resolution.length > 100)).toBe(true);
      }
      expect(disposition.clinicalApproval).toBe(false);
    }
  });

  it("preserves all PASS clinical values and exact profiles with only one final-node graph adapter", () => {
    expect(packet.reviewRound.passFreeze).toHaveLength(10);
    const adapterIds = packet.reviewRound.structuralAdapters.map((entry) => entry.nodeId);
    expect(adapterIds).toEqual(["node.topic.liver-benign-portal-infection.pyogenic-source-control.v1"]);
    for (const frozen of packet.reviewRound.passFreeze) {
      const question = questions.find((item) => item.id === frozen.reviewedQuestionVariantId)!;
      const authored = packet.proposedNodes.find((item) => item.questionVariantId === frozen.reviewedQuestionVariantId)!;
      const node = nodes.find((item) => item.id === frozen.nodeId)!;
      const clinicalCase = cases.find((item) => item.id === frozen.caseId)!;
      expect(question).toEqual(frozen.question);
      expect(sha(JSON.stringify(question))).toBe(frozen.questionSha256);
      expect(authored).toEqual(frozen.authorItem);
      expect(sha(JSON.stringify(authored))).toBe(frozen.authorItemSha256);
      expect(timings.find((entry) => entry.nodeId === frozen.nodeId)).toEqual(frozen.timing);
      expect(proposals.find((entry) => entry.conceptId === frozen.conceptId)).toEqual(frozen.conceptProposal);
      const { decisionNodes: _nodes, learningSummary: _summary, ...header } = clinicalCase;
      expect(header).toEqual(frozen.caseHeader);
      expect(sha(JSON.stringify(header))).toBe(frozen.headerSha256);
      if (adapterIds.includes(node.id)) {
        const { terminalDispositions: _new, ...scored } = node;
        const { terminalDispositions: _old, ...reviewed } = frozen.node;
        expect(scored).toEqual(reviewed);
        expect(node.terminalDispositions).toHaveLength(2);
        for (const terminal of node.terminalDispositions) {
          expect(terminal.kind).toBe("no_terminal_outcome");
          if (terminal.kind !== "no_terminal_outcome") throw new Error("Unexpected terminal outcome on frozen PASS adapter");
          const choice = frozen.node.answerChoices.find((entry) => entry.id === terminal.answerChoiceId)!;
          expect(terminal.clinicalRationale).toBe(choice.rationale);
          expect(terminal.sourceLabels).toEqual(frozen.node.sourceLabels);
          expect(terminal.consequenceNarrative).toBe("The clinic chart review ends with feedback on the selected plan.");
        }
      } else {
        expect(node).toEqual(frozen.node);
        expect(sha(JSON.stringify(node))).toBe(frozen.nodeSha256);
      }
    }
  });

  it("excludes every parked draft and prevents mixed-status multipart selection", () => {
    expect(packet.reviewRound.parkedItems).toHaveLength(7);
    expect(packet.reviewRound.compositionDecisions).toHaveLength(7);
    for (const clinicalCase of cases) {
      expect(clinicalCase.decisionNodes).toHaveLength(1);
      const node = clinicalCase.decisionNodes[0]!;
      const disposition = packet.reviewRound.dispositions.find((entry) => entry.activeNodeId === node.id)!;
      expect(["pass-preserved", "revised"]).toContain(disposition.status);
      expect(disposition.activeCaseId).toBe(clinicalCase.id);
      expect(node.terminalDispositions.map((entry) => entry.answerChoiceId).sort())
        .toEqual(node.answerChoices.filter((entry) => !entry.isCorrect).map((entry) => entry.id).sort());
    }
    for (const parked of packet.reviewRound.parkedItems) {
      const draft = parked.correctedCandidate;
      expect(parked.executable).toBe(false);
      expect(parked.reason.length).toBeGreaterThan(80);
      expect(questions.some((entry) => entry.id === draft.questionVariantId)).toBe(false);
      expect(nodes.some((entry) => entry.id === draft.nodeId)).toBe(false);
      expect(cases.some((entry) => entry.id === draft.caseId)).toBe(false);
      expect(timings.some((entry) => entry.questionVariantId === draft.questionVariantId)).toBe(false);
      expect(packet.testOrderProposals.some((entry) => entry.questionVariantId === draft.questionVariantId)).toBe(false);
      expect(ledger.parkedClaimMappings.find((entry) => entry.questionVariantId === draft.questionVariantId))
        .toMatchObject({ executable: false, status: "parked" });
    }
  });

  it("retains original evidence definitions while extending atomic source mappings", () => {
    for (const claim of packet.reviewRound.snapshot.evidenceClaims) {
      expect(ledger.evidenceClaims.find((entry) => entry.id === claim.id)).toEqual(claim);
    }
    for (const source of packet.reviewRound.snapshot.sourceRecords) {
      const current = ledger.sources.find((entry) => entry.id === source.id)!;
      const { evidenceClaimIds: _new, ...metadata } = current;
      const { evidenceClaimIds: _old, ...reviewedMetadata } = source;
      expect(metadata).toEqual(reviewedMetadata);
      expect(source.evidenceClaimIds.every((id) => current.evidenceClaimIds.includes(id))).toBe(true);
    }
    expect(ledger.sources.find((entry) => entry.id.endsWith(".kasl-ascites-2018")))
      .toMatchObject({ accessedOn: "2026-11-11", doi: "10.3350/cmh.2018.1005" });
  });

  it("keeps new unkeyed slots separate from scored verdicts and all new content unapproved", () => {
    expect(packet.withheldTeachingPoints).toHaveLength(3);
    for (const slot of packet.withheldTeachingPoints) {
      expect(slot.key).toBeNull();
      expect(slot.questionVariantId).toBeNull();
      expect(slot.nextAction.length).toBeGreaterThan(30);
    }
    expect(packet["Owner approvals needed"]).toHaveLength(7);
    for (const record of [...questions, ...proposals, ...ledger.sources, ...ledger.evidenceClaims]) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.lastClinicianReview).toBeNull();
    }
    expect(packet.manifest).toMatchObject({ clinicalApproval: false, pipelinePassed: false, managerAccepted: false,
      publicReleaseAuthorized: false, defaultReleaseChanged: false, executableOrdersAdded: false });
    const liveIds = new Set(SYNTHETIC_CLINICAL_RELEASE.cases.flatMap((clinicalCase) => clinicalCase.decisionNodes.map((node) => node.questionVariantId)));
    for (const question of questions) topicQuestionAcceptance(question.id);
    expect(questions.some((question) => liveIds.has(question.id))).toBe(questions.some(question => topicQuestionAcceptance(question.id).live));
    for (const file of ["packages/clinical-content/src/index.ts", "packages/clinical-content/src/synthetic-content.ts",
      "packages/clinical-content/src/question-ship-manifest.ts"]) {
      expect(read(file)).not.toContain("question-topic-liver-benign-portal-infection-20261111");
    }
  });
});
