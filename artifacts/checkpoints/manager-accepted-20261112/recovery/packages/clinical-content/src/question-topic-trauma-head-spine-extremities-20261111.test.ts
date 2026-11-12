import {topicQuestionAcceptance} from "./question-program-batch5-acceptance-test-support";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import program from "../../../docs/research/question-topic-program-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-trauma-head-spine-extremities-20261111.json";
import { PROTOTYPE_BALANCE_RELEASE } from "../../balance-config/src/prototype-balance";
import { QUESTION_SHIP_MANIFEST } from "./question-ship-manifest";
import {
  answerChoiceTimingRegistryEntrySchema,
  decisionNodeSchema,
  syntheticClinicalCaseSchema,
  testedConceptSchema,
} from "./schema";
import {
  QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_PACKET as packet,
  QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_QUESTIONS as questions,
  QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_CASES as cases,
  QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_DECISION_NODES as nodes,
  QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_TESTED_CONCEPTS as concepts,
  QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_CLAIMS as claims,
  QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_SOURCES as sources,
  QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_TIMING_ENTRIES as timing,
  QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_SOURCE_LINKS as links,
  QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_MANIFEST as manifest,
  QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_PARKED_ITEMS as parked,
} from "./question-topic-trauma-head-spine-extremities-20261111";

const slug = "trauma-head-spine-extremities";
const canonical = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonical);
  if (!value || typeof value !== "object") return value;
  const record = value as Record<string, unknown>;
  return Object.fromEntries(Object.keys(record).sort().map(key => [key, canonical(record[key])]));
};
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(canonical(value))).digest("hex");
const sourceDigest = (file: string) => createHash("sha256")
  .update(readFileSync(new URL(`../../../${file}`, import.meta.url), "utf8")).digest("hex");
const unique = (values: string[]) => expect(new Set(values).size).toBe(values.length);
const reviewRound = packet.independentReview1;
const parkedIds = new Set(parked.map(node => node.questionVariantId));
const activeAuthored = packet.nodes.filter(node => !parkedIds.has(node.questionVariantId));

describe("head/spine/pelvis/extremity topic explicit-import sidecar", () => {
  it("includes the complete primary assignment and gives every exact record one verdict", () => {
    const assigned = program.inventory.filter(row => row.primaryTopicSlug === slug);
    expect(packet.assignment.inventory).toEqual(assigned);
    expect(packet.assignment.concepts).toEqual(program.concepts.filter(row => row.primaryTopicSlug === slug));
    expect(packet.assignment.caseAssignments).toEqual(program.caseAssignments.filter(row => row.primaryTopicSlug === slug));
    expect(packet.assignment.nodeAssignments).toEqual(program.nodeAssignments.filter(row => row.primaryTopicSlug === slug));
    expect(packet.assignment.variantAssignments).toEqual(program.variantAssignments.filter(row => row.primaryTopicSlug === slug));
    expect(packet.audit.map(row => row.inventoryRecordId).sort()).toEqual(assigned.map(row => row.recordId).sort());
    unique(packet.audit.map(row => row.inventoryRecordId));
    expect(packet.audit).toHaveLength(21);
    expect(packet.audit.filter(row => row.verdict === "Rewrite")).toHaveLength(3);
    expect(packet.audit.filter(row => row.verdict === "Retire-and-replace")).toHaveLength(18);
    for (const row of packet.audit) {
      expect(row.reasons.length).toBeGreaterThanOrEqual(3);
      expect(row.sourceLocation.file).toBeTruthy();
      expect(row.sourceLocation.export).toBeTruthy();
      for (const id of row.replacementQuestionVariantIds) {
        expect(questions.some(question => question.id === id) || parked.some(node => node.questionVariantId === id)).toBe(true);
      }
    }
  });

  it("pins exact before questions, complete visible contexts and current live inputs", () => {
    for (const before of packet.before) {
      expect(before.questionDefinitions).toHaveLength(1);
      expect(before.visibleContexts).toHaveLength(1);
      for (const definition of before.questionDefinitions) expect(digest(definition.question)).toBe(definition.canonicalSha256);
      for (const context of before.visibleContexts) expect(digest(context.clinicalCase)).toBe(context.canonicalSha256);
      const audit = packet.audit.find(row => row.inventoryRecordId === before.inventoryRecordId)!;
      expect(audit.beforeQuestionSha256s).toEqual(before.questionDefinitions.map(row => row.canonicalSha256));
      expect(audit.contextAudit).toHaveLength(before.visibleContexts.length);
      const assigned = packet.assignment.inventory.find(row => row.recordId === before.inventoryRecordId)!;
      expect(before.caseId).toBe(assigned.caseId);
    }
    for (const input of packet.assignment.baseline.inputHashes) {
      expect(sourceDigest(input.file)).toBe(input.currentSha256);
      expect(input.currentSha256).toBe(input.programSha256);
    }
    for (const reference of packet.assignment.frozenPassApprovalReferences.originalDecisionFiles) {
      expect(sourceDigest(reference.file)).toBe(reference.sha256);
    }
  });

  it("preserves holds, registry-only identities and historical approval boundaries", () => {
    expect(packet.assignment.concepts.filter(row => row.registryOnly)).toHaveLength(3);
    expect(packet.assignment.recordedHolds.map(hold => hold.id).sort()).toEqual([
      "claim.n2r3.focal-motor-change",
      "review.n2.serial-gcs-verbal-interference.v3",
      "review.n3.head-injury-rule-scope-and-anticoagulant-exposure.v2",
    ]);
    expect(packet.assignment.unkeyedDraftSlots).toEqual([]);
    expect(packet.assignment.withheldTeachingPoints).toEqual([]);
    expect(packet.assignment.identityReuseNotes).toEqual([]);
    expect(packet.assignment.frozenPassApprovalReferences.independentPass).toEqual([]);
    expect(packet.assignment.frozenPassApprovalReferences.clinicalApprovals).toEqual([]);
    const heldCases = packet.cases.filter(clinicalCase => clinicalCase.managerIntegrationHoldIds.length);
    expect(heldCases).toHaveLength(2);
    for (const heldCase of heldCases) {
      expect(cases.find(clinicalCase => clinicalCase.id === heldCase.id)!.routineEligible).toBe(false);
    }
  });

  it("materializes sixteen active questions in eleven clinic reviews and excludes parks", () => {
    expect(cases).toHaveLength(11);
    expect(questions).toHaveLength(16);
    expect(nodes).toHaveLength(16);
    expect(concepts).toHaveLength(15);
    expect(cases.filter(clinicalCase => clinicalCase.decisionNodes.length === 2)).toHaveLength(5);
    unique(cases.map(clinicalCase => clinicalCase.id));
    unique(questions.map(question => question.id));
    unique(nodes.map(node => node.id));
    unique(concepts.map(concept => concept.id));
    for (const clinicalCase of cases) {
      expect(syntheticClinicalCaseSchema.safeParse(clinicalCase).success).toBe(true);
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(clinicalCase.tutorialEligible).toBe(false);
      expect(clinicalCase.presentation).toContain("{patientName}");
      expect(clinicalCase.presentation).toContain("clinic");
      expect(clinicalCase.prototypeDemographics?.ageYears).toBeGreaterThanOrEqual(18);
      expect(clinicalCase.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(1);
      expect(clinicalCase.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(clinicalCase.prototypeDemographics);
    }
    for (const node of nodes) expect(decisionNodeSchema.safeParse(node).success).toBe(true);
    for (const concept of concepts) expect(testedConceptSchema.safeParse(concept).success).toBe(true);
  });

  it("keeps three credible randomized choices and a complete separated task for every node", () => {
    for (const node of nodes) {
      expect(node.answerChoices).toHaveLength(3);
      expect(node.answerChoices.filter(choice => choice.isCorrect)).toHaveLength(1);
      expect(node.shuffleAnswers).toBe(true);
      expect(node.stem).toMatch(/^Which /);
      expect(node.stem).toContain("{patientName}");
      expect(node.exhibit?.kind).toBe("keyValue");
      if (node.exhibit?.kind === "keyValue") expect(node.exhibit.caption).toContain("constructed");
      for (const choice of node.answerChoices) expect(choice.rationale?.length ?? 0).toBeGreaterThan(30);
    }
    expect(packet.label).toBe("key shown first for review only.");
  });

  it("provides exact identity and label timing for every testing option and distractor", () => {
    const profileIds = new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map(profile => profile.id));
    expect(timing).toHaveLength(16);
    for (const entry of timing) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(entry).success).toBe(true);
      const authored = activeAuthored.find(node => node.questionVariantId === entry.questionVariantId)!;
      expect(entry.nodeId).toBe(authored.id);
      expect(entry.questionVariantId).toBe(authored.questionVariantId);
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices.map(choice => [choice.choiceId, choice.choiceLabel]))
          .toEqual(authored.choices.map(choice => [choice.id, choice.label]));
        for (const choice of entry.classification.choices) {
          const expected = authored.choices.find(candidate => candidate.id === choice.choiceId)!;
          if (choice.timing.kind === "test") {
            expect(choice.timing.timingProfileId).toBe(expected.timingProfileId);
            expect(profileIds.has(choice.timing.timingProfileId)).toBe(true);
            expect(expected.testIntent).toBe("planned_historical_testing");
          } else expect(expected.timingProfileId).toBeNull();
        }
      } else expect(authored.choices.every(choice => choice.timingProfileId === null)).toBe(true);
    }
    expect(JSON.stringify(packet.nodes.map(node => [node.task, node.currentUpdate, node.exhibit, node.choices.map(c => c.label)])))
      .not.toMatch(/\b(?:wait|duration|ETA)\b/i);
  });

  it("retains clinic execution scope with historical updates and no scheduled hospital orders", () => {
    for (const clinicalCase of packet.cases) {
      expect(clinicalCase.acuity).toBe("stable");
      expect(clinicalCase.historicalAcuity).toBeTruthy();
      expect(clinicalCase.educationalTier).toBe(1);
      expect(clinicalCase.earliestFacilityStage).toBe(0);
      expect(clinicalCase.sequenceReview).toMatch(/prior|earlier|later/i);
      const activeIds = clinicalCase.nodeIds.filter(id => nodes.some(node => node.id === id));
      const runtimeCase = cases.find(c => c.id === clinicalCase.id);
      if (!activeIds.length) expect(runtimeCase).toBeUndefined();
      else expect(runtimeCase!.decisionNodes.map(n => n.id)).toEqual(activeIds);
    }
    for (const node of nodes) {
      expect(node.resultGateAfter).toBeNull();
      for (const choice of node.answerChoices) expect(choice.serviceRequest).toBeNull();
    }
    for (const proposal of packet.orderProposals) {
      expect(proposal.executionMode).toBe("historical_chart_recommendation");
      expect(proposal.serviceRequest).toBeNull();
      expect(proposal.resultGateAfter).toBeNull();
    }
  });

  it("maps source records, atomic claims and every exact drafted question", () => {
    expect(sources).toHaveLength(18);
    expect(claims).toHaveLength(42);
    unique(sources.map(source => source.id));
    unique(claims.map(claim => claim.id));
    for (const source of sources) {
      expect(source.completeCitation.length).toBeGreaterThan(40);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.accessedOn).toBe("2026-11-11");
      expect(source.authorityAssessment.length).toBeGreaterThan(30);
      expect(source.reuseNotes.length).toBeGreaterThan(30);
      expect(ledger.sources.find(s => s.id === source.id)!.termsCheck.checkedOn).toBe("2026-11-11");
      for (const id of source.evidenceClaimIds) expect(claims.some(claim => claim.id === id)).toBe(true);
    }
    for (const claim of claims) {
      for (const id of claim.sourceIds) expect(sources.some(source => source.id === id)).toBe(true);
      expect(claim.limitation).toBeTruthy();
      expect(claim.lastCheckedOn).toBe("2026-11-11");
    }
    for (const question of questions) {
      for (const id of question.supportingEvidenceClaimIds) expect(claims.some(claim => claim.id === id)).toBe(true);
      const mappings = ledger.statementMappings.filter(mapping => mapping.questionVariantId === question.id);
      for (const field of ["currentUpdate", "exhibit", "task", "key", "explanation"]) {
        expect(mappings.some(mapping => mapping.field === field)).toBe(true);
      }
      for (const mapping of mappings) {
        for (const id of mapping.claimIds) expect(claims.some(claim => claim.id === id)).toBe(true);
      }
    }
  });

  it("records concrete author attacks, counterfactuals and rejected draft iterations", () => {
    for (const node of packet.nodes) {
      const pin = packet.proposedVersionPins.find(candidate => candidate.questionVariantId === node.questionVariantId)!;
      expect(digest(node)).toBe(pin.authoredNodeSha256);
      expect(pin.contentVersion).toBe(node.contentVersion);
      expect(node.reasoningSteps).toHaveLength(2);
      expect(new Set(node.reasoningSteps).size).toBe(2);
      expect(node.decidingObservation.length).toBeGreaterThan(25);
      expect(node.closestCredibleError.length).toBeGreaterThan(25);
      expect(node.decisionChangingCounterfactual.length).toBeGreaterThan(50);
      expect(node.deletionTest.length).toBeGreaterThan(80);
      expect(node.authorGate.coverTheKey.length).toBeGreaterThan(100);
      expect(node.authorGate.twoConsequentialSteps).toEqual(node.reasoningSteps);
      expect(node.authorGate.version).toBe(node.questionVariantId);
      for (const choice of node.choices) {
        expect(choice.temptation.length).toBeGreaterThan(20);
        expect(choice.counterfactual.length).toBeGreaterThan(35);
      }
      const response = reviewRound.responses.find(row => row.currentQuestionVariantId === node.questionVariantId)!;
      if (response.status !== "pass-preserved") {
        expect(node.before).toHaveLength(1);
        expect(node.questionVariantId).toMatch(/\.v2$/);
      } else expect(node.before.length > 0).toBe(node.role === "rewrite");
    }
    expect(packet.authorIterationHistory).toHaveLength(1);
    expect(questions.some(question => question.id === packet.authorIterationHistory[0]!.candidateId)).toBe(false);
    expect(packet.unkeyedGapSlots[0]!.key).toBeNull();
    for (const claim of ledger.claims) {
      const pin = packet.proposedClaimPins.find(candidate => candidate.claimId === claim.id)!;
      expect(digest(claim)).toBe(pin.canonicalSha256);
    }
  });

  it("preserves historical meanings and separates the new image-provenance concept", () => {
    const existing = new Set(packet.assignment.concepts.map(concept => concept.conceptId));
    expect(concepts.filter(concept => existing.has(concept.id))).toHaveLength(1);
    expect(concepts.filter(concept => !existing.has(concept.id))).toHaveLength(14);
    for (const decision of packet.identityDecisions) expect(decision.historyMigrated).toBe(false);
    const disposition = packet.nodes.find(node => node.questionVariantId.includes("negative-head-ct-disposition"))!;
    expect(disposition.conceptId).not.toBe("concept.n3.head-injury-rule-scope-and-anticoagulant-exposure");
    expect(disposition.previousConceptIds).toEqual([
      "concept.n3.head-injury-rule-scope-and-anticoagulant-exposure",
      "concept.head-injury.anticoagulant-ed-ct-evaluation",
    ]);
    const retrieval = packet.nodes.find(node => node.questionVariantId.includes("cervical-incomplete-acquisition"))!;
    expect(retrieval.conceptId).toBe("concept.topic.trauma-head-spine-extremities.cervical-source-retrieval.v1");
    expect(retrieval.previousConceptIds).toEqual([
      "concept.topic.trauma-head-spine-extremities.cervical-incomplete-acquisition.v1",
    ]);
    expect(packet.concepts.some(concept => concept.id === retrieval.previousConceptIds[0])).toBe(true);
  });

  it("retains safe source-link metadata and explicit rights exclusions", () => {
    expect(links).toHaveLength(sources.length);
    for (const link of links) {
      expect(link.href).toMatch(/^https:\/\//);
      expect(link.target).toBe("_blank");
      expect(link.rel).toBe("noopener noreferrer");
      expect(link.referrerPolicy).toBe("no-referrer");
    }
    expect(ledger.excludedSources.map(source => source.organization)).toEqual(expect.arrayContaining([
      "NICE", "American College of Surgeons", "British Orthopaedic Association",
    ]));
    expect(ledger.withheldDisagreements).toHaveLength(5);
  });

  it("keeps all authored clinical metadata pending and remains outside the default bank", () => {
    for (const record of [...questions, ...claims, ...sources, ...packet.concepts, ...packet.cases, ...packet.nodes]) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.lastClinicianReview).toBeNull();
      expect(record.aiAssistedDrafting).toBe(true);
    }
    expect(manifest.pipelinePassed).toBe(false);
    expect(manifest.clinicalApproval).toBe(false);
    expect(manifest.installedInDefaultRelease).toBe(false);
    // Check the shipping authority without assembling every concurrent topic.
    // Exact input-file and visible-context hashes are checked separately above.
    const liveVariants = new Set<string>([
      ...QUESTION_SHIP_MANIFEST.legacyBindings.map(binding => binding[2]),
      ...QUESTION_SHIP_MANIFEST.accepted.map(row => row.questionVariantId),
    ]);
    for (const question of questions) expect(liveVariants.has(question.id)).toBe(topicQuestionAcceptance(question.id).accepted);
  });

  it("parses both owned JSON outputs and reconciles the handoff counts", () => {
    const parsedPacket = JSON.parse(readFileSync(new URL("../../../docs/research/question-topic-trauma-head-spine-extremities-20261111.json", import.meta.url), "utf8"));
    const parsedLedger = JSON.parse(readFileSync(new URL("../../../docs/research/sources-question-topic-trauma-head-spine-extremities-20261111.json", import.meta.url), "utf8"));
    expect(parsedPacket).toEqual(packet);
    expect(parsedLedger).toEqual(ledger);
    expect(packet.counts.audited).toBe(packet.counts.kept + packet.counts.rewritten + packet.counts.retiredAndReplacedProposed);
    expect(packet.counts.proposedQuestions).toBe(packet.counts.rewritten + packet.counts.newQuestions);
    expect(packet.counts.proposedQuestions).toBe(packet.nodes.length);
    expect(packet.counts).toEqual(packet.initialAuthoringCounts);
    expect(packet.activeCounts.questions).toBe(questions.length);
    expect(packet.activeCounts.cases).toBe(cases.length);
    expect(packet.activeCounts.concepts).toBe(concepts.length);
    expect(packet.activeCounts.originalAuditRewrites + packet.activeCounts.originallyNewQuestions).toBe(questions.length);
  });

  it("preserves every exact PASS question, node, concept and full case header", () => {
    expect(sourceDigest(reviewRound.reviewFile)).toBe(reviewRound.reviewSha256);
    const reviewed = JSON.parse(readFileSync(new URL(`../../../${reviewRound.reviewFile}`, import.meta.url), "utf8"));
    expect(reviewRound.review).toEqual(reviewed);
    expect(reviewRound.passPreservation).toHaveLength(6);
    for (const pin of reviewRound.passPreservation) {
      const authored = packet.nodes.find(node => node.questionVariantId === pin.questionVariantId)!;
      const question = questions.find(question => question.id === pin.questionVariantId)!;
      const node = nodes.find(node => node.questionVariantId === pin.questionVariantId)!;
      const clinicalCase = cases.find(clinicalCase => clinicalCase.id === pin.caseId)!;
      const { decisionNodes: reviewedNodes, ...header } = clinicalCase;
      void reviewedNodes;
      expect(digest(authored)).toBe(pin.authoredNodeSha256);
      expect(digest(question)).toBe(pin.runtimeQuestionSha256);
      expect(digest(node)).toBe(pin.runtimeNodeSha256);
      expect(digest(header)).toBe(pin.caseHeaderSha256);
      expect(digest(packet.concepts.find(concept => concept.id === authored.conceptId))).toBe(pin.conceptSha256);
      expect(question).toEqual(reviewRound.inputSnapshot.runtimeQuestions.find(old => old.id === question.id));
      expect(node).toEqual(reviewRound.inputSnapshot.runtimeNodes.find(old => old.id === node.id));
    }
    for (const old of reviewRound.inputSnapshot.sourceLedger.claims) {
      expect(ledger.claims.find(claim => claim.id === old.id)).toEqual(old);
    }
  });

  it("records one disposition per reviewed item and removes parked content from all executable proposals", () => {
    unique(reviewRound.responses.map(response => response.reviewedQuestionVariantId));
    expect(reviewRound.responses.map(response => response.reviewedQuestionVariantId).sort())
      .toEqual(reviewRound.review.map(row => row.id).sort());
    expect(reviewRound.responses.filter(response => response.status === "pass-preserved")).toHaveLength(6);
    expect(reviewRound.responses.filter(response => response.status === "revised")).toHaveLength(10);
    expect(reviewRound.responses.filter(response => response.status === "parked")).toHaveLength(3);
    for (const response of reviewRound.responses) {
      const old = reviewRound.inputSnapshot.nodes.find(node => node.questionVariantId === response.reviewedQuestionVariantId)!;
      const current = packet.nodes.find(node => node.questionVariantId === response.currentQuestionVariantId)!;
      if (response.verdict === "PASS") {
        expect(response.status).toBe("pass-preserved");
        expect(response.attemptCount).toBe(0);
        expect(current).toEqual(old);
      } else {
        expect(response.attemptCount).toBe(1);
        expect(current.previousVariantIds).toContain(old.questionVariantId);
        expect(current.before[0]!.authoredNodeSha256).toBe(digest(old));
        expect(response.currentNodeSha256).toBe(digest(current));
        expect(response.issueDispositions.length).toBeGreaterThan(0);
      }
      if (response.status === "parked") {
        expect(response.parkReason).toBeTruthy();
        expect(questions.some(question => question.id === current.questionVariantId)).toBe(false);
        expect(nodes.some(node => node.id === current.id)).toBe(false);
        expect(timing.some(entry => entry.questionVariantId === current.questionVariantId)).toBe(false);
        expect(packet.orderProposals.some(entry => entry.questionVariantId === current.questionVariantId)).toBe(false);
      }
    }
    const packing = parked.find(node => node.questionVariantId.includes("packing-persistent-shock"))!;
    expect(packing.keyChoiceId).toBeNull();
    expect(packet.ownerApprovalsNeeded.some(row => row.id.endsWith("packing-versus-repeat-angio"))).toBe(true);
  });

  it("keeps pressure and image provenance explicit and reconciles the ABI worksheet", () => {
    const pressure = activeAuthored.find(node => node.questionVariantId.includes("compartment-unreliable-exam"))!;
    expect(JSON.stringify(pressure.exhibit)).toContain("anterior compartment 14 mmHg");
    expect(JSON.stringify(pressure.exhibit)).toContain("No other compartment was sampled");
    expect(pressure.currentUpdate).not.toContain("pressure monitoring capability");
    const acquisition = activeAuthored.find(node => node.questionVariantId.includes("cervical-incomplete-acquisition"))!;
    expect(JSON.stringify(acquisition.exhibit)).toContain("through T1");
    expect(JSON.stringify(acquisition.exhibit)).toContain("ends at C6");
    expect(acquisition.choices.find(choice => choice.id === acquisition.keyChoiceId)!.label).toContain("Retrieve source");
    const abi = activeAuthored.find(node => node.questionVariantId.includes("limb-normal-abi-disposition"))!;
    expect(JSON.stringify(abi.exhibit)).toContain("ABI 1.25");
    expect(120 / 150).toBe(0.8);
    expect(150 / 120).toBe(1.25);
    expect(abi.explanation).toContain("120/150 = 0.80");
    expect(abi.choices.find(choice => choice.id === abi.keyChoiceId)!.label).toBe("CT angiography before disposition");
    expect(abi.evidenceClaimIds).toContain("claim.trauma-head-spine-extremities.revision-abi-calculation");
  });
});
