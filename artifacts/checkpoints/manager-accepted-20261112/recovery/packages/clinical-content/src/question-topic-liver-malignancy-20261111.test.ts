import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import {
  answerChoiceTimingRegistryEntrySchema,
  decisionNodeSchema,
  syntheticClinicalCaseSchema,
  testedConceptSchema,
} from "./schema";
import { ROW_092_CONCEPT } from "./approved-data/hcc-resection-selection";
import { SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";
import {
  QUESTION_PROGRAM_BATCH2_ACCEPTED_CASES,
  QUESTION_PROGRAM_BATCH2_ACCEPTED_QUESTIONS,
  QUESTION_PROGRAM_BATCH2_RETAINED_CASES,
  QUESTION_PROGRAM_BATCH2_REPLACEMENTS,
} from "./question-program-batch2-accepted-20261111";
import {
  LIVER_MALIGNANCY_TOPIC_PACKET as packet,
  LIVER_MALIGNANCY_TOPIC_SOURCE_LEDGER as ledger,
  LIVER_MALIGNANCY_TOPIC_CASES as cases,
  LIVER_MALIGNANCY_TOPIC_NODES as nodes,
  LIVER_MALIGNANCY_TOPIC_QUESTIONS as questions,
  LIVER_MALIGNANCY_TOPIC_TESTED_CONCEPTS as concepts,
  LIVER_MALIGNANCY_TOPIC_CONCEPT_PROPOSALS as proposals,
  LIVER_MALIGNANCY_TOPIC_TIMING_ENTRIES as timings,
  LIVER_MALIGNANCY_TOPIC_SOURCE_LINKS as links,
} from "./question-topic-liver-malignancy-20261111";

const root = new URL("../../../", import.meta.url);
const read = (file: string) => readFileSync(new URL(file, root), "utf8");
const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

describe("liver malignancy explicit-import topic sidecar", () => {
  it("reconciles the complete exact assignment and row-versus-variant counts", () => {
    const program = JSON.parse(read("docs/research/question-topic-program-20261111.json")) as {
      inventory: Array<{ recordId: string; primaryTopicSlug: string }>;
    };
    const assigned = program.inventory.filter((row) => row.primaryTopicSlug === "liver-malignancy");
    expect(packet.assignment.inventory).toEqual(assigned);
    expect(assigned).toHaveLength(18);
    expect(packet.audit.map((row) => row.inventoryRecordId).sort()).toEqual(assigned.map((row) => row.recordId).sort());
    expect(new Set(packet.audit.map((row) => row.inventoryRecordId)).size).toBe(18);
    expect(new Set(packet.audit.map((row) => row.questionVariantId)).size).toBe(16);
    expect(packet.audit.filter((row) => row.verdict === "Keep")).toHaveLength(16);
    expect(packet.audit.filter((row) => row.verdict === "Rewrite")).toHaveLength(1);
    expect(packet.audit.filter((row) => row.verdict === "Retire-and-replace")).toHaveLength(1);
    expect(packet.counts.rewrittenRows).toBe(1);
    expect(packet.initialAuthoringCounts.newQuestionVariants).toBe(12);
    expect(packet.counts.newQuestionVariants).toBe(8);
    expect(packet.counts.currentAuthoredQuestionVariants).toBe(9);
    for (const row of packet.audit) {
      expect(row.reasons.length).toBeGreaterThanOrEqual(2);
      expect(sha256(JSON.stringify(row.before.node))).toBe(row.beforeNodeSha256);
      expect(sha256(JSON.stringify(row.before.clinicalCase))).toBe(row.beforeCaseSha256);
      expect(row.sourceExport.length).toBeGreaterThan(3);
    }
    expect(packet.assignment.unkeyedDraftSlots).toEqual([]);
    expect(packet.assignment.recordedHolds).toEqual([]);
  });

  it("preserves source hashes and every live or explicitly retained approved/PASS context", () => {
    for (const input of packet.assignment.baseline.sourceHashes) {
      expect(sha256(read(input.file)), input.file).toBe(input.observedSha256);
      expect(input.observedSha256).toBe(input.programSha256);
    }
    for (const audit of packet.audit.filter((row) => row.status.startsWith("live"))) {
      const current = SYNTHETIC_CLINICAL_RELEASE.cases.find((clinicalCase) => clinicalCase.id === audit.caseId);
      if (!current) {
        expect(QUESTION_PROGRAM_BATCH2_REPLACEMENTS.some((relation) =>
          relation.replaces === audit.caseId || relation.replaces === audit.questionVariantId)).toBe(true);
      }
      const preserved = current ?? QUESTION_PROGRAM_BATCH2_RETAINED_CASES.find((clinicalCase) => clinicalCase.id === audit.caseId);
      expect(preserved, audit.inventoryRecordId).toBeDefined();
      expect(sha256(JSON.stringify(preserved)), audit.inventoryRecordId).toBe(audit.beforeCaseSha256);
    }
    expect(packet.assignment.clinicalApprovals.map((approval) => approval.value.approvedQuestionVariantIds.length)).toEqual([10, 4]);
    const pass = packet.audit.find((row) => row.questionVariantId === "question.n1.hcc-portal-hypertension.v2")!;
    expect(pass.verdict).toBe("Keep");
    expect(pass.editorialAcceptance?.acceptanceId).toBe("review.n1.hcc-portal-hypertension.v2");
    expect(packet.assignment.independentReviews.flatMap((review) => review.decisions)
      .filter((decision) => decision.id === "review.n1.hcc-portal-hypertension.v2" && decision.verdict === "PASS")).toHaveLength(2);
  });

  it("admits only the manager-accepted static copies while keeping clinical approval separate", () => {
    expect(packet.manifest).toMatchObject({ clinicalApproval: false, pipelinePassed: false, managerAccepted: false,
      publicReleaseAuthorized: false, executableOrdersAdded: false, defaultReleaseChanged: false });
    const liveIds = new Set(SYNTHETIC_CLINICAL_RELEASE.cases.flatMap((clinicalCase) =>
      clinicalCase.decisionNodes.map((node) => node.questionVariantId)));
    expect(questions.filter((question) => liveIds.has(question.id)).map((question) => question.id).sort())
      .toEqual(packet.salvageRound.acceptedFreeze.map((item) => item.questionVariantId).sort());
    for (const file of ["packages/clinical-content/src/index.ts", "packages/clinical-content/src/synthetic-content.ts",
      "packages/clinical-content/src/question-ship-manifest.ts"]) {
      expect(read(file)).not.toContain("question-topic-liver-malignancy-20261111");
    }
    for (const record of [...questions, ...proposals, ...ledger.sources, ...ledger.evidenceClaims]) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.lastClinicianReview).toBeNull();
    }
    expect(packet.reviewOrderNotice).toBe("key shown first for review only.");
  });

  it("preserves an existing FSRS meaning and keeps eight active new concept identities", () => {
    expect(questions).toHaveLength(9);
    expect(concepts).toHaveLength(9);
    expect(new Set(concepts.map((concept) => concept.id)).size).toBe(9);
    expect(new Set(questions.map((question) => question.id)).size).toBe(9);
    expect(concepts.find((concept) => concept.id === ROW_092_CONCEPT.id)).toEqual(ROW_092_CONCEPT);
    expect(proposals.filter((proposal) => proposal.conceptRelation === "new_meaning")).toHaveLength(8);
    expect(proposals.filter((proposal) => proposal.conceptRelation === "existing_meaning_variant")).toHaveLength(1);
    for (const concept of concepts) expect(() => testedConceptSchema.parse(concept)).not.toThrow();
    const portalQuestions = packet.proposedNodes.filter((node) => node.conceptId === "concept.topic.liver-malignancy.portal-augmentation.v1");
    expect(portalQuestions).toHaveLength(1);
    expect(portalQuestions[0]!.choices.find((choice) => choice.isCorrect)!.id).toBe("separate_distal_targets");
  });

  it.each(cases.map((clinicalCase) => [clinicalCase.id, clinicalCase] as const))(
    "admits %s through existing clinic structures with coherent fixed demographics", (_id, clinicalCase) => {
      expect(() => syntheticClinicalCaseSchema.parse(clinicalCase)).not.toThrow();
      const definition = packet.caseCompositionProposals.find((item) => item.id === clinicalCase.id)!;
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(clinicalCase.prototypeDemographics).toEqual(definition.prototypeDemographics);
      expect(clinicalCase.patientDisplayName).toBe(definition.patientDisplayName);
      expect(clinicalCase.presentation).toContain("{patientName}");
      expect(clinicalCase.presentation).toContain(`${definition.prototypeDemographics.ageYears}-year-old`);
      expect(clinicalCase.chiefComplaint!.trim().split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(1);
      expect(definition).toMatchObject({ educationalTier: 2, patientAcuity: "stable", facilityProgressionLevel: 0,
        earliestFacilityStage: 0, simulationWeight: null, reviewStatus: "needs_clinician_review" });
      expect(clinicalCase.decisionNodes.map((node) => node.id)).toEqual(definition.nodeIds);
    },
  );

  it.each(nodes.map((node) => [node.questionVariantId, node] as const))(
    "binds %s to its exact profile, prior record, key and evidence", (_id, node) => {
      expect(() => decisionNodeSchema.parse(node)).not.toThrow();
      expect(node.shuffleAnswers).toBe(true);
      expect(node.answerChoices).toHaveLength(3);
      expect(node.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(node.answerChoices.every((choice) => choice.serviceRequest === null)).toBe(true);
      expect(node.resultGateAfter).toBeNull();
      const authored = packet.proposedNodes.find((item) => item.questionVariantId === node.questionVariantId)!;
      const definition = packet.caseCompositionProposals.find((item) => item.id === authored.caseId)!;
      const index = definition.nodeIds.indexOf(node.id);
      expect(node.terminalDispositions).toHaveLength(index === definition.nodeIds.length - 1 ? 2 : 0);
      expect(authored.priorVisibleNodes).toHaveLength(index);
      expect(authored.priorVisibleNodes.map((prior) => prior.nodeId)).toEqual(definition.nodeIds.slice(0, index));
      expect(authored.priorVisibleNodes.every((prior) => prior.nodeId !== node.id)).toBe(true);
      expect(sha256(JSON.stringify(authored.exactVisibleContext))).toBe(authored.exactVisibleContextSha256);
      const { afterVersionSha256, ...exact } = authored;
      expect(sha256(JSON.stringify(exact))).toBe(afterVersionSha256);
      expect(authored.reasoningSteps).toHaveLength(2);
      expect(authored.deletionTest.length).toBeGreaterThanOrEqual(3);
      for (const field of ["coverTheKeyCueAttack", "oneDecisionStageAndCategory", "twoConsequentialSteps",
        "predictedResidentDifficulty", "oneDefensibleBestAnswer"] as const) {
        expect(authored.manualAuthorGate[field].length).toBeGreaterThan(60);
      }
      expect(authored.manualAuthorGate.reviewRole).toContain("no independent PASS");
      expect(authored.choices.some((choice) => choice.id === authored.counterfactualReSolve.keyChoiceId && !choice.isCorrect)).toBe(true);
      if (authored.authoringKind === "rewrite") {
        expect(authored.previousQuestionVariantId).toBe("question.hcc.resection.candidate-profile.v1");
        expect(authored.before).toEqual(packet.audit.find((row) => row.inventoryRecordId === authored.beforeInventoryRecordId)!.before);
      } else expect(authored.before).toBeNull();
      expect(authored.statementMappings.some((mapping) => mapping.field === "explanation" && mapping.text === node.explanation)).toBe(true);
      for (const choice of authored.choices) {
        expect(choice.rationale.length).toBeGreaterThan(35);
        expect(choice.counterfactual.length).toBeGreaterThan(30);
        expect(choice.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
      }
    },
  );

  it("maps every testing distractor by exact identity and label to an existing placeholder profile", () => {
    expect(timings).toHaveLength(nodes.length);
    const profileIds = new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map((profile) => profile.id));
    let testChoices = 0;
    for (const node of nodes) {
      const authored = packet.proposedNodes.find((item) => item.nodeId === node.id)!;
      const entry = timings.find((item) => item.nodeId === node.id && item.questionVariantId === node.questionVariantId)!;
      expect(() => answerChoiceTimingRegistryEntrySchema.parse(entry)).not.toThrow();
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices.map((choice) => [choice.choiceId, choice.choiceLabel])).toEqual(node.answerChoices.map((choice) => [choice.id, choice.label]));
        for (const choice of entry.classification.choices) {
          expect(choice.timing).toEqual(authored.choices.find((item) => item.id === choice.choiceId)!.timing);
          if (choice.timing.kind === "test") {
            testChoices++;
            expect(profileIds.has(choice.timing.timingProfileId)).toBe(true);
            expect(packet.testOrderProposals.some((order) => order.nodeId === node.id && order.choiceId === choice.choiceId &&
              order.choiceLabel === choice.choiceLabel && order.timingProfileId === (choice.timing.kind === "test" ? choice.timing.timingProfileId : null))).toBe(true);
          }
        }
      } else expect(authored.choices.every((choice) => choice.timing.kind === "no_test")).toBe(true);
    }
    expect(testChoices).toBe(11);
    expect(packet.testOrderProposals).toHaveLength(11);
    expect(packet.testOrderProposals.every((order) => order.execution === "not_added" && order.serviceRequest === null && order.resultGateAfter === null)).toBe(true);
  });

  it("has complete claim/source/statement mappings and safe external links without approval inheritance", () => {
    const claimIds = new Set(ledger.evidenceClaims.map((claim) => claim.id));
    const sourceIds = new Set(ledger.sources.map((source) => source.id));
    for (const question of questions) {
      for (const claimId of question.supportingEvidenceClaimIds) {
        expect(claimIds.has(claimId)).toBe(true);
        expect(ledger.claimToQuestionMappings.find((mapping) => mapping.claimId === claimId)?.questionVariantIds).toContain(question.id);
      }
    }
    for (const claim of ledger.evidenceClaims) {
      expect(claim.lastCheckedOn).toMatch(/^2026-/);
      expect(claim.limitation?.length).toBeGreaterThan(20);
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
        expect(ledger.sourceToClaimMappings.find((mapping) => mapping.sourceId === sourceId)?.evidenceClaimIds).toContain(claim.id);
      }
    }
    for (const mapping of ledger.statementMappings) {
      expect(mapping.evidenceClaimIds.length).toBeGreaterThan(0);
      expect(mapping.evidenceClaimIds.every((id) => claimIds.has(id))).toBe(true);
    }
    for (const link of links) expect(link).toMatchObject({ target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer" });
    expect(ledger.sources.filter((source) => source.id.startsWith("source.aasld")).map((source) => source.accessedOn).sort())
      .toEqual(["2026-08-06", "2026-08-21"]);
    expect(ledger.evidenceClaims.find((claim) => claim.id === "claim.n1.306f7180fb92")!.lastCheckedOn).toBe("2026-08-06");
    expect(packet.withheldTeachingPoints).toHaveLength(6);
    expect(packet["Owner approvals needed"].length).toBeGreaterThan(1);
  });

  it("accounts for all review records and exactly one attempt on each returned item", () => {
    const exactReview = read(packet.reviewRound.reviewFile);
    expect(sha256(exactReview)).toBe(packet.reviewRound.reviewFileSha256);
    expect(JSON.parse(exactReview)).toEqual(packet.reviewRound.reviewRecords);
    expect(packet.reviewRound.items).toHaveLength(13);
    expect(packet.reviewRound.items.filter((item) => item.status === "pass-preserved")).toHaveLength(3);
    expect(packet.reviewRound.items.filter((item) => item.status === "revised")).toHaveLength(6);
    expect(packet.reviewRound.items.filter((item) => item.status === "parked")).toHaveLength(4);
    expect(packet.reviewRound.items.reduce((sum, item) => sum + item.noteResponses.length, 0)).toBe(88);
    for (const response of packet.reviewRound.items) {
      const review = packet.reviewRound.reviewRecords.find((item) => item.id === response.reviewedQuestionVariantId)!;
      expect(response.revisionAttemptCount).toBe(review.verdict === "PASS" ? 0 : 1);
      expect(response.independentPassAppliesToCurrent).toBe(review.verdict === "PASS");
      expect(response.clinicalApproval).toBe(false);
      if (review.verdict === "PASS") continue;
      for (const category of ["clarityIssues", "cues", "fairness", "suggestions"] as const) {
        const addressed = response.noteResponses.filter((note) => note.category === category);
        expect(addressed.map((note) => note.reviewNote)).toEqual(review[category]);
        expect(addressed.map((note) => note.index)).toEqual(review[category].map((_, index) => index));
        expect(addressed.every((note) => note.response.length > 60)).toBe(true);
      }
    }
  });

  it("preserves all three exact PASS questions, nodes, contexts, visible headers and timing", () => {
    for (const frozen of packet.reviewRound.passFreeze) {
      expect(sha256(JSON.stringify(questions.find((item) => item.id === frozen.reviewedQuestionVariantId)))).toBe(frozen.questionSha256);
      expect(sha256(JSON.stringify(nodes.find((item) => item.id === frozen.nodeId)))).toBe(frozen.nodeSha256);
      const authored = packet.proposedNodes.find((item) => item.questionVariantId === frozen.reviewedQuestionVariantId)!;
      expect(sha256(JSON.stringify(authored))).toBe(frozen.authorItemSha256);
      expect(sha256(JSON.stringify(authored.exactVisibleContext))).toBe(frozen.visibleContextSha256);
      expect(sha256(JSON.stringify(timings.find((item) => item.questionVariantId === frozen.reviewedQuestionVariantId)))).toBe(frozen.timingSha256);
      expect(sha256(JSON.stringify(frozen.caseHeader))).toBe(frozen.caseHeaderSha256);
      const clinicalCase = cases.find((item) => item.id === frozen.caseId)!;
      const { decisionNodes: _nodes, learningSummary: _summary, ...currentHeader } = clinicalCase;
      const { learningSummary: _oldSummary, ...originalHeader } = frozen.caseHeader;
      expect(currentHeader).toEqual(originalHeader);
      expect(clinicalCase.learningSummary).toBe(clinicalCase.decisionNodes.map((node) => node.explanation).join(" "));
      const originalConcept = packet.reviewRound.snapshot.conceptProposals.find((item) => item.id === frozen.conceptId)!;
      expect(proposals.find((item) => item.id === frozen.conceptId)).toEqual(originalConcept);
    }
  });

  it("excludes all four failed attempts from every active composition and registry proposal", () => {
    expect(packet.reviewRound.parkedItems).toHaveLength(4);
    expect(packet.parkedDraftSlots).toHaveLength(4);
    const activeQuestions = new Set(questions.map((item) => item.id));
    const activeNodes = new Set(nodes.map((item) => item.id));
    for (const parked of packet.reviewRound.parkedItems) {
      expect(parked).toMatchObject({ status: "parked", keyedForPreview: false, admittedToRuntimeExports: false, revisionAttemptCount: 1 });
      expect(parked.reason.length).toBeGreaterThan(100);
      expect(activeQuestions.has(parked.questionVariantId)).toBe(false);
      expect(activeNodes.has(parked.candidate.nodeId)).toBe(false);
      expect(timings.some((item) => item.questionVariantId === parked.questionVariantId)).toBe(false);
      expect(packet.testOrderProposals.some((item) => item.questionVariantId === parked.questionVariantId)).toBe(false);
      expect(cases.flatMap((item) => item.decisionNodes).some((item) => item.id === parked.candidate.nodeId)).toBe(false);
      expect(packet.parkedDraftSlots.find((item) => item.questionVariantId === parked.questionVariantId)!.key).toBeNull();
      const { afterVersionSha256, ...candidate } = parked.candidate;
      expect(sha256(JSON.stringify(candidate))).toBe(afterVersionSha256);
    }
    for (const clinicalCase of cases) {
      for (const node of clinicalCase.decisionNodes) expect(activeNodes.has(node.id)).toBe(true);
    }
    expect(cases.filter((item) => item.decisionNodes.length > 1)).toHaveLength(2);
  });

  it("versions materially changed meanings without transferring prior concept histories", () => {
    const successors = packet.conceptDecisions.filter((item) => item.previousConceptId !== null);
    expect(successors).toHaveLength(3);
    for (const decision of successors) {
      expect(decision.conceptId).not.toBe(decision.previousConceptId);
      expect(packet.reviewRound.snapshot.testedConcepts.some((item) => item.id === decision.previousConceptId)).toBe(true);
      expect(concepts.some((item) => item.id === decision.previousConceptId)).toBe(false);
    }
    for (const item of packet.proposedNodes.filter((item) => item.authoringKind === "review_revision")) {
      expect(item.previousQuestionVariantId).not.toBe(item.questionVariantId);
      const before = packet.reviewRound.snapshot.proposedNodes.find((old) => old.questionVariantId === item.previousQuestionVariantId)!;
      expect(item.reviewedBefore).toMatchObject({ afterVersionSha256: before.afterVersionSha256,
        exactVisibleContextSha256: before.exactVisibleContextSha256, questionVariantId: before.questionVariantId });
    }
  });

  it("keeps inherited claims exact while recording complete rights and mappings for new evidence", () => {
    for (const previous of ledger.reviewResponseBaseline.priorClaimHashes) {
      expect(sha256(JSON.stringify(ledger.evidenceClaims.find((claim) => claim.id === previous.id)))).toBe(previous.sha256);
    }
    expect(ledger.sources).toHaveLength(10);
    expect(ledger.evidenceClaims).toHaveLength(39);
    for (const sourceId of ledger.sourceVerification.reviewResponse.sourcesAdded) {
      const source = ledger.sources.find((item) => item.id === sourceId)!;
      expect(source).toMatchObject({ accessedOn: "2026-11-11", reuseStatus: "cc_by_4_0", reviewStatus: "needs_clinician_review" });
      for (const field of ["completeCitation", "organizationOrJournal", "officialUrl", "licenseLabel", "reuseNotes", "authorityAssessment"] as const) {
        expect(source[field].length).toBeGreaterThan(20);
      }
      expect(source.authors!.length).toBeGreaterThan(1);
      expect(source.evidenceClaimIds.length).toBeGreaterThan(0);
    }
    expect(ledger.sources.find((source) => source.id === "source.aasld.hcc-practice-guidance.2023")!.subsequentAccesses![0]!.accessedOn).toBe("2026-11-11");
  });

  it("reconciles an empty salvage queue with the four already accepted PASS nodes", () => {
    const dispositions = JSON.parse(read(packet.salvageRound.acceptanceDispositionsPath)) as {
      items: Array<{ topic: string; status: string; nodeId: string; evidence: { record: { verdict: string } } }>;
    };
    const latestReview = JSON.parse(read(packet.salvageRound.latestReviewPath)) as Array<{ nodeId: string; verdict: string }>;
    const topicRows = dispositions.items.filter((item) => item.topic === "liver-malignancy");
    const skippedPass = topicRows.filter((item) => item.status === "skipped" && item.evidence.record.verdict === "PASS");
    const latestPassIds = latestReview.filter((item) => item.verdict === "PASS").map((item) => item.nodeId).sort();
    expect(skippedPass).toEqual([]);
    expect(topicRows).toHaveLength(4);
    expect(topicRows.every((item) => item.status === "accepted" && item.evidence.record.verdict === "PASS")).toBe(true);
    expect(topicRows.map((item) => item.nodeId).sort()).toEqual(latestPassIds);
    expect(packet.salvageRound).toMatchObject({ status: "no_eligible_skipped_pass_nodes", requestedItemStatus: "salvage",
      items: [], counts: { eligibleSkippedPassNodes: 0, salvagedCases: 0, salvagedNodes: 0, acceptedNodes: 4, acceptedCases: 3 },
      reviewerQueue: { statusFilter: "salvage", caseIds: [], nodeIds: [], questionVariantIds: [] } });
    for (const source of packet.salvageRound.sourceRecords) expect(sha256(read(source.path)), source.path).toBe(source.sha256);
  });

  it("leaves every accepted definition, clinical data array and source ledger unchanged during salvage", () => {
    const clinicalData = packet as unknown as Record<string, unknown>;
    for (const input of packet.salvageRound.unchangedClinicalData) {
      expect(sha256(JSON.stringify(clinicalData[input.field])), input.field).toBe(input.sha256);
    }
    const sourceLedger = packet.salvageRound.sourceLedgerPreservation;
    expect(sha256(read(sourceLedger.path))).toBe(sourceLedger.sha256);
    expect(sourceLedger).toMatchObject({ newSources: 0, newClaims: 0, networkUsed: false });
    for (const frozen of packet.salvageRound.acceptedFreeze) {
      const ownCase = cases.find((item) => item.id === frozen.caseId)!;
      const archivedCase = QUESTION_PROGRAM_BATCH2_ACCEPTED_CASES.find((item) => item.id === frozen.caseId)!;
      const liveCase = SYNTHETIC_CLINICAL_RELEASE.cases.find((item) => item.id === frozen.caseId)!;
      expect(sha256(JSON.stringify(ownCase))).toBe(frozen.caseSha256);
      expect(ownCase).toEqual(archivedCase);
      expect(liveCase).toEqual(archivedCase);
      expect(sha256(JSON.stringify(nodes.find((item) => item.id === frozen.nodeId)))).toBe(frozen.nodeSha256);
      const question = questions.find((item) => item.id === frozen.questionVariantId)!;
      expect(sha256(JSON.stringify(question))).toBe(frozen.questionSha256);
      expect(question).toEqual(QUESTION_PROGRAM_BATCH2_ACCEPTED_QUESTIONS.find((item) => item.id === frozen.questionVariantId));
      expect(sha256(JSON.stringify(timings.find((item) => item.nodeId === frozen.nodeId)))).toBe(frozen.timingSha256);
      expect(frozen.clinicalApproval).toBe(false);
    }
  });
});
