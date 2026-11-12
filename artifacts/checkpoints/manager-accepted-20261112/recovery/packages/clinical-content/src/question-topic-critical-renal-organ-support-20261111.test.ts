import {topicQuestionAcceptance, topicCaseIsExplicitlyLive} from "./question-program-batch5-acceptance-test-support";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE as balance } from "@gamify-surgery/balance-config";
import { decisionNodeSchema, syntheticClinicalCaseSchema, syntheticClinicalReleaseSchema, testedConceptSchema } from "./schema";
import { getClinicalCaseEligibilityIssue } from "../../game-domain/src/clinical-case-eligibility";
import { validateDomainContext } from "../../game-domain/src/context";
import { createInitialGameState } from "../../game-domain/src/reducer";
import { SYNTHETIC_CLINICAL_RELEASE as live } from "./synthetic-content";
import { QUESTION_SHIP_MANIFEST as manifest } from "./question-ship-manifest";
import {
  beforeProgramBatch1AcceptanceRelease,
  beforeProgramBatch1AcceptanceManifest,
  beforeProgramBatch1AcceptanceSource,
} from "./question-program-batch1-acceptance-test-support";
import {
  QUESTION_PROGRAM_BATCH1_ACCEPTED_CASES as acceptedCases,
  QUESTION_PROGRAM_BATCH1_ACCEPTED_QUESTIONS as acceptedQuestions,
} from "./question-program-batch1-accepted-20261111";

const sha = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const before = { live: sha(live), manifest: sha(manifest) };
const topic = await import("./question-topic-critical-renal-organ-support-20261111");
const packet = topic.CRITICAL_RENAL_TOPIC_PACKET;
const ledger = topic.CRITICAL_RENAL_TOPIC_SOURCE_LEDGER;
const questions = topic.CRITICAL_RENAL_TOPIC_QUESTIONS;
const nodes = topic.CRITICAL_RENAL_TOPIC_NODES;
const sourceIds = new Set(topic.CRITICAL_RENAL_TOPIC_SOURCES.map((source) => source.id));
const claimIds = new Set(topic.CRITICAL_RENAL_TOPIC_CLAIMS.map((claim) => claim.id));
const knownTimingIds = new Set(balance.answerChoiceTimingProfiles.map((profile) => profile.id));
const readJson = (relativePath: string) => JSON.parse(readFileSync(new URL(relativePath, import.meta.url), "utf8"));

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => [key, canonicalize(entry)]));
  }
  return value;
}

const passHashes = [
  ["congestion-directed-oliguria", "6a0f659c782f5072d87bde3eef8fc6fea8cd34589913fc11a49ce33b513528e6", "035a0ac3b3fd1e7d3a43a1e4ec516ce0c59d3957d334092ce01c5102484ca01f", "87149a5a07b85aefabe3e03a441bdfa9c87b279e8362f2b1e28c1aa4f1058d44"],
  ["rrt-treatment-response", "f0c7ff80fa91c56d44e2f15b7f8e583cc62f030e640aa6acbab24716a036ed51", "8b3817185fb7762b932245e7ed5a044ceae63e92145cd99ba78e117d311065bd", "4bb9e9601fb91957cb74b4f4ed69b4a2b12e5eb804e3bd78c0e216ba65db0993"],
  ["rrt-refractory-pulmonary-fluid", "b0443044e71b0e2ca3af359f17fbd2e905f364c4d7969ba2c9013622c0557481", "b6c789d7b2fc71f5652a034c2592651fc7e28f9a10e8fcea51ac61dec15be0c8", "0f9b6434e1211303c51938fb7b67688cd9f1c84fd009914dd34aed6f55ae58af"],
  ["uf-clearance-separation", "9d6bd2c9c3a132f31cc0f7de6c9e4ba2008e56e27fd49060188ec3aae70b8ec8", "17c60a8f5d0b2138460e33d92426f51e7031645c1af40778554701ddf745473a", "58ed4488466f67277f2f831bc5bf29c9eee360f34a531fbc2ed21be34dd3d38a"],
  ["pressure-fluid-drainage", "546ee627f9333bfd0ab960a7a98fdc9793bd04afbf1f3fa5f8d1659f14ca9962", "3d27fde2aa797fdc3bd083958074a6f22eb25a5b5f0fa22a2180c52325d6cb15", "b92e4d72f3c8555646cc8da6dbe918c751462e3b6072c6b8a062ca7180c10eeb"],
  ["citrate-bleeding-circuit", "e6863ef955e60512cde0c9e9f34319c0b7be29e636fbbd7afb5acd352857d153", "060977dee00935fc63e4c5d0d7a8bfebcd7bde08339fbdbfb9fcfb149cd8cd84", "b5eb34f66a2388de4804dc2d675ed74b950c9ea6b4a491d14cf31290819201ca"],
] as const;


const settingClinicalPins = [
  ["question.topic.critical-renal-organ-support.congestion-directed-oliguria.v1", "e446f660124971eeb2088961ba1316d06a5e370c44a1c839d67cc7d9864e9510"],
  ["question.topic.critical-renal-organ-support.diuretic-confounded-indices.v2", "00756db9bd6a9f65395248bc1cb36f9a6d41aed3ce5af689a8c3a30e759b351f"],
  ["question.topic.critical-renal-organ-support.rrt-treatment-response.v1", "c31ed1bc1e372429999d9a5b2dcf47b2b7da8b21c54ce77f137f565c7283ab3b"],
  ["question.topic.critical-renal-organ-support.rrt-refractory-pulmonary-fluid.v1", "71cfc3adedd06782ed280f3d7249863d8d7a485bb54b4d3750a63a2b6b37e53b"],
  ["question.topic.critical-renal-organ-support.uf-clearance-separation.v1", "8ec5f53d61dd342900c8954bbf0737b0eeef8a2e8859a1f2da7b508be252d1bc"],
  ["question.topic.critical-renal-organ-support.pressure-acquisition.v2", "65f2c92127f481dc378b88bad21586552f23ccabff18e2e03ac0a7564097e3bf"],
  ["question.topic.critical-renal-organ-support.pressure-fluid-drainage.v1", "86f89cf5bd4fdb665220d252a5e0e787b465dff0426cc68f00c6fc079eb5cea6"],
  ["question.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1", "4b5328886462f21f7d12c937e97c6148e1dfc179f5aa86c639cee09c8e1b85db"],
  ["question.topic.critical-renal-organ-support.trial-off-crrt.v2", "5b6e1e96c73001472aca0b47292d0ec571822af0499b9af29c33ade95401ecf8"],
  ["question.topic.critical-renal-organ-support.pressure-refractory-decompression.v2", "11fb70d7c32339538957830c0b679bfd0dd3adb7607b0fe3eed5f9087fcc20c9"],
  ["question.topic.critical-renal-organ-support.citrate-metabolic-course.v2", "2358120c94efd86ea0128d2a8674e6b000e4c3c2f4bc598cc23e8c277d4ffe7f"],
] as const;

function clinicalPayload(item: Record<string, unknown>): unknown {
  return Object.fromEntries(packet.settingConversion.clinicalPayloadFields.map((field) => [field, item[field]]));
}

describe("critical renal organ support topic authoring sidecar", () => {
  it("preserves the current default and reconstructs the exact captured pre-acceptance epoch", () => {
    expect({ live: sha(live), manifest: sha(manifest) }).toEqual(before);
    const historicalLive = beforeProgramBatch1AcceptanceRelease(live);
    const historicalManifest = beforeProgramBatch1AcceptanceManifest(manifest);
    expect(historicalManifest.id).toBe("question-ship.2026-11-10.v9");
    expect(historicalManifest.accepted).toHaveLength(145);
    expect(historicalLive.cases).toHaveLength(1151);
    expect(historicalLive.cases.flatMap((clinicalCase) => clinicalCase.decisionNodes)).toHaveLength(1462);
    expect(historicalLive.concepts).toHaveLength(610);
    const acceptedEpoch = readJson("../../../docs/research/question-topic-acceptance-batch1-packet-20261111.json");
    expect(acceptedEpoch.manifestId).toBe("question-ship.2026-11-11.v10");
    expect(acceptedEpoch.counts.after).toMatchObject({ acceptedRows: 167, cases: 1167, nodes: 1482, registeredMeanings: 631 });
    const admittedIds = new Set(packet.salvageRound.protectedAccepted.map((row) => row.questionVariantId));
    for (const id of admittedIds) expect(topicQuestionAcceptance(id).accepted).toBe(true);
    const liveIds = new Set(live.cases.flatMap((clinicalCase) => clinicalCase.decisionNodes.map((node) => node.questionVariantId)));
    for (const question of questions) expect(liveIds.has(question.id)).toBe(topicQuestionAcceptance(question.id).live);
    for (const id of packet.salvageRound.reviewOnlyCaseIds) expect(live.cases.some((row) => row.id === id)).toBe(topicCaseIsExplicitlyLive(id));
    expect(topic.CRITICAL_RENAL_TOPIC_INTEGRATION.normalizedRuntimeRelease).toEqual(topic.CRITICAL_RENAL_TOPIC_SOURCE_RELEASE);
    expect(syntheticClinicalReleaseSchema.safeParse(topic.CRITICAL_RENAL_TOPIC_SOURCE_RELEASE).success).toBe(true);
  });

  it("reconciles the complete empty assignment with the program", () => {
    const program = readJson("../../../docs/research/question-topic-program-20261111.json");
    for (const key of Object.keys(packet.assignment.completeAssignedRows)) {
      expect(packet.assignment.completeAssignedRows[key as keyof typeof packet.assignment.completeAssignedRows]).toEqual(
        program[key].filter((row: { primaryTopicSlug?: string }) => row.primaryTopicSlug === packet.assignment.slug),
      );
    }
    expect(packet.completeAudit.rows).toEqual([]);
    expect(packet.completeAudit.assignedInventoryRecordIds).toEqual([]);
    expect(packet.assignment.relevantIdentityReuseNotes).toEqual([]);
    expect(packet.assignment.frozenPassAndClinicalApprovalReferences).toEqual([]);
    expect(packet.counts).toMatchObject({
      auditedExactVariants: 0, auditedCaseNodeRows: 0, kept: 0, rewritten: 0,
      retireAndReplaceProposed: 0, newQuestionVariants: 9, newConceptMeanings: 9,
      reusedExistingConcepts: 0, newCases: 6, multiDecisionCases: 2,
      suppliedHeldVersions: 0, suppliedUnkeyedSlots: 0, newUnkeyedQuestionSlots: 3,
    });
  });

  it("pins historical inputs through the exact recorded acceptance source migration", () => {
    for (const file of ["packages/clinical-content/src/question-ship-manifest.ts", "docs/clinical/question-authoring-standard.md"]) {
      const captured = packet.assignment.baseline.inputHashChecks.find((row) => row.file === file)!;
      const current = readFileSync(new URL(`../../../${file}`, import.meta.url), "utf8");
      const contents = beforeProgramBatch1AcceptanceSource(file, current);
      expect(createHash("sha256").update(contents).digest("hex")).toBe(captured.sha256);
      expect(captured.matchesSnapshot).toBe(true);
    }
  });

  it("parses both owned JSON outputs through their normal imports", () => {
    expect(readJson("../../../docs/research/question-topic-critical-renal-organ-support-20261111.json")).toEqual(packet);
    expect(readJson("../../../docs/research/sources-question-topic-critical-renal-organ-support-20261111.json")).toEqual(ledger);
    expect(packet.reviewDisplayLabel).toBe("key shown first for review only");
  });

  it("keeps all new identities disjoint and review-pending", () => {
    for (const values of [questions.map((question) => question.id), nodes.map((node) => node.id),
      topic.CRITICAL_RENAL_TOPIC_CONCEPT_PROPOSALS.map((concept) => concept.id),
      topic.CRITICAL_RENAL_TOPIC_CASE_DEFINITIONS.map((clinicalCase) => clinicalCase.id)]) {
      expect(new Set(values).size).toBe(values.length);
      for (const id of values) expect(id.length).toBeLessThanOrEqual(120);
    }
    for (const record of [...questions, ...topic.CRITICAL_RENAL_TOPIC_CONCEPT_PROPOSALS,
      ...topic.CRITICAL_RENAL_TOPIC_CASE_DEFINITIONS, ...topic.CRITICAL_RENAL_TOPIC_CLAIMS,
      ...topic.CRITICAL_RENAL_TOPIC_SOURCES]) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.aiAssistedDrafting).toBe(true);
      expect(record.lastClinicianReview).toBeNull();
    }
    for (const concept of topic.CRITICAL_RENAL_TOPIC_CONCEPT_PROPOSALS) {
      const item = packet.proposedNodes.find((item) => item.conceptId === concept.id)!;
      expect(concept.previousConceptId).toBe(item.previousConceptId);
      expect(concept.conceptRelation).toBe(item.conceptRelation);
      expect(concept.earliestFacilityStage).toBe(4);
      expect(testedConceptSchema.shape.id.safeParse(concept.id).success).toBe(true);
      expect(testedConceptSchema.shape.displayName.safeParse(concept.displayName).success).toBe(true);
      expect(testedConceptSchema.shape.learningObjective.safeParse(concept.learningObjective).success).toBe(true);
    }
  });

  it.each(nodes.map((node) => [node.id, node] as const))("validates node %s using the existing schema", (_id, node) => {
    expect(decisionNodeSchema.safeParse(node).success).toBe(true);
    expect(node.shuffleAnswers).toBe(true);
    expect(node.answerChoices).toHaveLength(3);
    expect(node.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
    expect(node.resultGateAfter).toBeNull();
    for (const choice of node.answerChoices) expect(choice.serviceRequest).toBeNull();
    const question = questions.find((question) => question.id === node.questionVariantId)!;
    expect(question.conceptId).toBe(node.primaryConceptId);
    const item = packet.proposedNodes.find((item) => item.nodeId === node.id)!;
    expect(node.stem).toBe(item.chartReview.task);
    expect(node.stem).toContain(question.stem);
    expect(node.stem).toContain("During clinic chart review");
    expect(question.exhibit).toEqual(node.exhibit);
  });

  it("normalizes clinic record reviews with the original demographics and clinical acuity", () => {
    const definitions = topic.CRITICAL_RENAL_TOPIC_CASE_DEFINITIONS;
    expect(definitions).toHaveLength(6);
    expect(definitions.filter((clinicalCase) => clinicalCase.nodeIds.length > 1)).toHaveLength(2);
    expect(definitions.filter((clinicalCase) => clinicalCase.nodeIds.length === 1)).toHaveLength(4);
    expect(packet).not.toHaveProperty("caseCompositionProposals");
    for (const clinicalCase of definitions) {
      const previous = packet.settingConversion.beforeCaseCompositionProposals.find((row) => row.id === clinicalCase.id)!;
      expect(clinicalCase.prototypeDemographics).toEqual(previous.prototypeDemographics);
      expect(clinicalCase.patientDisplayName).toBe(previous.patientDisplayName);
      expect(clinicalCase.chiefComplaint).toBe(previous.chiefComplaint);
      expect(clinicalCase.patientAcuity).toBe(previous.patientAcuity);
      expect(clinicalCase.originalHospitalPresentation).toBe(previous.presentation);
      expect(clinicalCase.chiefComplaint.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.clinicalSetting).toBe("clinic");
      expect(clinicalCase.gameplayPresentationSetting).toBe("clinic_chart_review");
      expect(clinicalCase.patientCareSetting).toBe("outside_hospital_intensive_care");
      expect(clinicalCase.facilityProgressionLevel).toBe(4);
      expect(clinicalCase.requiredCapabilityIds).toEqual(["capability.examination"]);
      expect(clinicalCase.presentation).toContain("In clinic, the founder reviews");
      expect(clinicalCase.presentation).toContain("at the referring hospital's request");
      expect(clinicalCase.presentation).toContain(clinicalCase.originalHospitalPresentation);
      expect(syntheticClinicalCaseSchema.safeParse(clinicalCase.normalizedRuntimeCase).success).toBe(true);
      const runtimeCase = topic.CRITICAL_RENAL_TOPIC_CASES.find((row) => row.id === clinicalCase.id)!;
      expect(runtimeCase.decisionNodes).toEqual(clinicalCase.nodeIds.map((id) => nodes.find((node) => node.id === id)));
      expect(runtimeCase.requiredClinicalSetting).toBe("clinic");
      expect(runtimeCase.patientPresentationRevision!.reviewStatus).toBe("needs_clinician_review");
      expect(runtimeCase.patientPresentationRevision!.revisedDecisionStems!.map((row) => row.revisedStem)).toEqual(runtimeCase.decisionNodes.map((node) => node.stem));
      expect(clinicalCase.educationalTier).toBe(2);
      expect(clinicalCase.simulationWeight).toBeNull();
      expect(clinicalCase.finiteProfiles).toHaveLength(1);
      const profile = clinicalCase.finiteProfiles[0]!;
      expect(profile.prototypeDemographics).toEqual(clinicalCase.prototypeDemographics);
      expect(profile.patientDisplayName).toBe(clinicalCase.patientDisplayName);
      expect(profile.presentation).toBe(clinicalCase.presentation);
      for (const id of clinicalCase.nodeIds) {
        const item = packet.proposedNodes.find((item) => item.nodeId === id)!;
        expect(item.task).toContain(clinicalCase.patientDisplayName);
        expect(item.selection.standaloneStatus).toBe(clinicalCase.nodeIds.length > 1 ? "complete_case_only" : "standalone");
      }
    }
  });

  it("passes the existing clinic eligibility gate with an existing examination capability", () => {
    const context = validateDomainContext({ clinicalRelease: topic.CRITICAL_RENAL_TOPIC_SOURCE_RELEASE, balanceRelease: balance });
    const state = createInitialGameState();
    state.facilityLevel = 4;
    const examination = balance.facility.roomDefinitions.find((room) => room.id === "room.examination")!;
    expect(examination.capabilityIds).toContain("capability.examination");
    const capabilities = new Set(examination.capabilityIds);
    for (const clinicalCase of topic.CRITICAL_RENAL_TOPIC_CASES) {
      expect(clinicalCase.tutorialEligible).toBe(false);
      expect(clinicalCase.routineEligible).toBe(true);
      expect(getClinicalCaseEligibilityIssue(state, clinicalCase, context, capabilities)).toBeNull();
    }
  });

  it.each(packet.proposedNodes.map((item) => [item.slug, item] as const))("pins the exact visible context and manual gate for %s", (_slug, item) => {
    const disposition = packet.reviewRound.dispositions.find((row) => row.currentQuestionVariantId === item.questionVariantId)!;
    if (disposition.status === "pass-preserved") expect(item.before).toBeNull();
    else expect(item.before?.questionVariantId).toBe(disposition.reviewedQuestionVariantId);
    expect(sha(item.visibleContext)).toBe(item.exactVisibleContextSha256);
    expect(item.visibleContext.priorNodes).toHaveLength(item.positionInCase - 1);
    expect(item.visibleContext.priorNodes.map((node) => node.nodeId)).toEqual(item.selection.priorContextRequired);
    const check = item.manualAuthorGate;
    expect(check.independent).toBe(false);
    expect(check.clinicalApproval).toBe(false);
    expect(check.verdict).toBe("DRAFT_FOR_INDEPENDENT_REVIEW");
    for (const text of [check.coverTheKey, check.sameDecisionStage, check.twoConsequentialSteps.interpret,
      check.twoConsequentialSteps.apply, check.residentDifficulty, check.oneBestAnswer.decidingObservation,
      check.oneBestAnswer.errorConsequence, check.oneBestAnswer.withoutDecider,
      check.oneBestAnswer.counterfactual, check.deletionTest, check.sequenceCueAttack, check.repairsAndRecheck]) {
      expect(text.trim()).not.toBe("");
    }
    expect(item.choices.find((choice) => choice.id === item.keyChoiceId)!.isCorrect).toBe(true);
    expect(item.choices.find((choice) => choice.id === check.oneBestAnswer.closestChoiceId)!.isCorrect).toBe(false);
    expect(item.choices.find((choice) => choice.id === check.oneBestAnswer.counterfactualChoiceId)!.isCorrect).toBe(false);
    expect(item.independentPassReference).toBeNull();
    expect(item.clinicalApprovalReference).toBeNull();
    for (const choice of item.choices) {
      expect(choice.temptation.length).toBeGreaterThan(15);
      expect(choice.reasonableUnderCounterfactual.length).toBeGreaterThan(20);
      for (const claimId of choice.evidenceClaimIds) {
        expect(claimIds.has(claimId)).toBe(true);
        expect(item.supportingEvidenceClaimIds).toContain(claimId);
      }
    }
  });

  it("provides bidirectional source, claim and exact-question mappings", () => {
    for (const source of topic.CRITICAL_RENAL_TOPIC_SOURCES) {
      for (const key of ["completeCitation", "organizationOrJournal", "licenseLabel", "reuseStatus",
        "reuseNotes", "authorityAssessment", "usageRole", "accessedOn"] as const) expect(source[key]).toBeTruthy();
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.officialUrl || source.doi).toBeTruthy();
      expect(source.evidenceClaimIds).toEqual(topic.CRITICAL_RENAL_TOPIC_CLAIMS.filter((claim) => claim.sourceIds.includes(source.id)).map((claim) => claim.id));
    }
    for (const claim of topic.CRITICAL_RENAL_TOPIC_CLAIMS) {
      expect(claim.lastCheckedOn).toBe("2026-11-11");
      expect(claim.limitation).toBeTruthy();
      for (const sourceId of claim.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
      expect(ledger.claimToQuestions.find((row) => row.evidenceClaimId === claim.id)!.questionVariantIds).toEqual(
        packet.proposedNodes.filter((item) => item.supportingEvidenceClaimIds.includes(claim.id)).map((item) => item.questionVariantId),
      );
    }
    for (const item of packet.proposedNodes) {
      for (const claimId of item.supportingEvidenceClaimIds) expect(claimIds.has(claimId)).toBe(true);
      const mapping = ledger.questionToClaims.find((row) => row.questionVariantId === item.questionVariantId)!;
      expect(mapping.supportingEvidenceClaimIds).toEqual(item.supportingEvidenceClaimIds);
      expect(mapping.exactVisibleContextSha256).toBe(item.exactVisibleContextSha256);
      expect(mapping.statementMappings).toEqual(item.statementMappings);
    }
    expect(topic.CRITICAL_RENAL_TOPIC_SOURCES.filter((source) => source.officialUrl?.includes("nice.org.uk"))).toEqual([]);
    expect(ledger.sources.find((source) => source.key === "kdigo-status-2026")!.evidenceClaimIds).toEqual([]);
  });

  it("maps every testing choice to exact known placeholder metadata", () => {
    expect(topic.CRITICAL_RENAL_TOPIC_TIMING_PROPOSALS).toHaveLength(9);
    let testChoiceCount = 0;
    for (const item of packet.proposedNodes) {
      const timing = topic.CRITICAL_RENAL_TOPIC_TIMING_PROPOSALS.find((row) => row.nodeId === item.nodeId)!;
      expect(timing.caseId).toBe(item.caseId);
      expect(timing.questionVariantId).toBe(item.questionVariantId);
      if (timing.classification.kind === "test_choices") {
        expect(timing.classification.choices).toHaveLength(item.choices.length);
        for (const choice of item.choices) {
          const mapped = timing.classification.choices.find((row) => row.choiceId === choice.id)!;
          expect(mapped.choiceLabel).toBe(choice.label);
          expect(mapped.timing).toEqual(choice.timingProfileId ? { kind: "test", timingProfileId: choice.timingProfileId } : { kind: "no_test" });
          if (mapped.timing.kind === "test") {
            testChoiceCount += 1;
            expect(knownTimingIds.has(mapped.timing.timingProfileId)).toBe(true);
            expect(topic.CRITICAL_RENAL_TOPIC_TEST_ORDER_PROPOSALS.some((order) => order.choiceId === choice.id && order.choiceLabel === choice.label)).toBe(true);
          }
        }
      } else expect(item.choices.every((choice) => choice.timingProfileId === null)).toBe(true);
    }
    expect(testChoiceCount).toBe(8);
    expect(topic.CRITICAL_RENAL_TOPIC_TEST_ORDER_PROPOSALS).toHaveLength(testChoiceCount);
    for (const order of topic.CRITICAL_RENAL_TOPIC_TEST_ORDER_PROPOSALS) {
      expect(order.disposition).toEqual({ kind: "not_executed", reason: "future_planned" });
      expect(order.serviceRequest).toBeNull();
      expect(order.resultGateAfter).toBeNull();
    }
  });

  it("keeps safe link metadata, open clinical decisions and withheld points visible", () => {
    for (const link of topic.CRITICAL_RENAL_TOPIC_SOURCE_LINKS) {
      expect(link.href).toMatch(/^https:\/\//);
      expect(link.target).toBe("_blank");
      expect(link.rel).toBe("noopener noreferrer");
      expect(link.referrerPolicy).toBe("no-referrer");
      expect(sourceIds.has(link.sourceId)).toBe(true);
    }
    expect(topic.CRITICAL_RENAL_TOPIC_WITHHELD_TEACHING_POINTS).toHaveLength(3);
    for (const held of topic.CRITICAL_RENAL_TOPIC_WITHHELD_TEACHING_POINTS) {
      expect(held.questionVariantId).toBeNull();
      expect(held.conceptId).toBeNull();
      expect(held.reviewStatus).toBe("needs_clinician_review");
    }
    expect(topic.CRITICAL_RENAL_TOPIC_OWNER_APPROVALS).toHaveLength(6);
    expect(packet.newUnkeyedDraftSlots).toHaveLength(3);
    for (const slot of packet.newUnkeyedDraftSlots) {
      expect(slot.questionVariantId).toBeNull();
      expect(slot.conceptId).toBeNull();
      expect(slot.keyChoiceId).toBeNull();
    }
    expect(packet.rankedConcepts.flatMap((concept) => concept.proposedQuestionIds).sort()).toEqual(questions.map((question) => question.id).sort());
  });

  it.each(passHashes)("preserves exact independently passed item %s", (slug, itemHash, questionHash, nodeHash) => {
    const item = packet.proposedNodes.find((item) => item.slug === slug)!;
    const reviewed = topic.CRITICAL_RENAL_TOPIC_REVIEWED_ITEMS.find((row) => row.questionVariantId === item.questionVariantId)!;
    const question = questions.find((row) => row.id === item.questionVariantId)!;
    const node = nodes.find((row) => row.id === item.nodeId)!;
    expect(sha(reviewed)).toBe(itemHash);
    expect(packet.settingConversion.beforeItems.find((row) => row.questionVariantId === item.questionVariantId)).toEqual(reviewed);
    expect(sha(canonicalize(question))).toBe(questionHash);
    const reviewedNode = topic.CRITICAL_RENAL_TOPIC_REVIEWED_NODES.find((row) => row.id === node.id)!;
    expect(sha(canonicalize(reviewedNode))).toBe(nodeHash);
    expect(question).toEqual(topic.CRITICAL_RENAL_TOPIC_REVIEWED_QUESTIONS.find((row) => row.id === question.id));
    const { stem: clinicStem, currentUpdate: clinicUpdate, terminalDispositions: clinicTerminal, ...clinicClinicalNode } = node;
    const { stem: reviewedStem, currentUpdate: reviewedUpdate, terminalDispositions: reviewedTerminal, ...reviewedClinicalNode } = reviewedNode;
    expect(clinicClinicalNode).toEqual(reviewedClinicalNode);
    expect(clinicStem).toContain(reviewedStem);
    if (slug !== "pressure-fluid-drainage") expect(clinicUpdate).toBe(reviewedUpdate);
    const clinicalCase = topic.CRITICAL_RENAL_TOPIC_CASES.find((row) => row.id === item.caseId)!;
    expect(clinicTerminal).toEqual(clinicalCase.decisionNodes.at(-1)!.id === node.id ? reviewedTerminal : []);
    expect(topic.CRITICAL_RENAL_TOPIC_TIMING_PROPOSALS.find((row) => row.nodeId === node.id)).toEqual(
      topic.CRITICAL_RENAL_TOPIC_REVIEWED_TIMING.find((row) => row.nodeId === node.id),
    );
  });

  it.each(settingClinicalPins)("preserves the complete clinical payload of %s during setting conversion", (id, expected) => {
    const item = [...packet.proposedNodes, ...packet.reviewRound.parkedItems].find((row) => row.questionVariantId === id)!;
    const previous = [...packet.settingConversion.beforeItems, ...packet.settingConversion.beforeParkedItems].find((row) => row.questionVariantId === id)!;
    expect(sha(canonicalize(clinicalPayload(item)))).toBe(expected);
    expect(clinicalPayload(item)).toEqual(clinicalPayload(previous));
    expect(item.chartReview.requiredClinicalSetting).toBe("clinic");
    expect(item.chartReview.task).toContain(item.task);
    expect(item.chartReview.task).toContain("the founder advises the referring hospital");
    expect(item.chartReview.reviewStatus).toBe("needs_clinician_review");
  });

  it("preserves every source record and atomic clinical claim during conversion", () => {
    expect(sha(canonicalize(ledger.sources))).toBe("bcbb48fbb2e2939307ba75005e3ab148098afc50fd1494a9a73e435d8d4eb610");
    expect(sha(canonicalize(ledger.evidenceClaims))).toBe("0e7e231e4749ba9f666a1b6c71a20cd9f37ba5f466a3882ff1baf4ca89af56cf");
    expect(packet.settingConversion.counts).toEqual({ convertedKeyedItems: 9, convertedParkedItems: 2, normalizedClinicCases: 6, remainingIcuCompositionProposals: 0, newClinicalClaims: 0 });
    expect(packet.integrationDependencies.some((row) => row.kind === "delivery_architecture")).toBe(false);
    expect(ledger.settingConversion.newSources).toBe(0);
  });

  it("accounts for one disposition and one revision attempt per returned item", () => {
    const review = readJson("../../../docs/research/question-topic-critical-renal-organ-support-review-20261111.json");
    const rows = topic.CRITICAL_RENAL_TOPIC_REVIEW_DISPOSITIONS;
    expect(rows).toHaveLength(11);
    expect(rows.filter((row) => row.status === "pass-preserved")).toHaveLength(6);
    expect(rows.filter((row) => row.status === "revised")).toHaveLength(3);
    expect(rows.filter((row) => row.status === "parked")).toHaveLength(2);
    for (const row of rows) {
      expect(row.sourceReview).toEqual(review.find((entry: { id: string }) => entry.id === row.reviewedQuestionVariantId));
      expect(row.attemptCount).toBe(row.status === "pass-preserved" ? 0 : 1);
    }
    const reviewContents = readFileSync(new URL("../../../docs/research/question-topic-critical-renal-organ-support-review-20261111.json", import.meta.url));
    expect(createHash("sha256").update(reviewContents).digest("hex")).toBe("8140780cbc17d9382c53c5020c126e36487739a10b2a2536d0e071dfdbb89e80");
  });

  it("renders the original drainage history without scoring the returned acquisition", () => {
    const context = topic.CRITICAL_RENAL_TOPIC_FROZEN_CONTEXTS[0]!;
    const passed = packet.proposedNodes.find((item) => item.questionVariantId === context.passedQuestionVariantId)!;
    const revised = packet.proposedNodes.find((item) => item.slug === "pressure-acquisition")!;
    expect(context.reviewedVisibleContextSha256).toBe("5ea67b2a653ac60f1f0f4c8b8e4c684520ee1ea35237d26f52cba54f1ae13db7");
    expect(passed.visibleContext.recordedPriorNodes.map((node) => node.nodeId)).toEqual(context.precedingNodeIds);
    expect(passed.visibleContext.priorNodes).toEqual([]);
    const runtimeNode = nodes.find((node) => node.id === passed.nodeId)!;
    for (const prior of passed.visibleContext.recordedPriorNodes) {
      expect(runtimeNode.currentUpdate).toContain(prior.task);
      expect(runtimeNode.currentUpdate).toContain(prior.explanation);
      for (const row of prior.exhibit.items) expect(runtimeNode.currentUpdate).toContain(row.value);
      for (const choice of prior.choices) {
        expect(runtimeNode.currentUpdate).toContain(choice.label);
        expect(runtimeNode.currentUpdate).toContain(choice.rationale);
      }
    }
    expect(nodes.some((node) => context.precedingNodeIds.includes(node.id))).toBe(false);
    expect(context.precedingNodeIds).not.toContain(revised.nodeId);
    expect(revised.caseId).not.toBe(passed.caseId);
    expect(revised.visibleContext.priorNodes).toEqual([]);
    expect(context.status).toBe("rendered_as_clinic_record_history");
  });

  it("retains original evidence and uses explicit new meaning for the rebuilt oliguria item", () => {
    for (const oldClaim of packet.reviewRound.reviewedSourceLedger.evidenceClaims) {
      expect(topic.CRITICAL_RENAL_TOPIC_CLAIMS.find((claim) => claim.id === oldClaim.id)).toEqual(oldClaim);
    }
    const oliguria = packet.proposedNodes.find((item) => item.slug === "diuretic-confounded-indices")!;
    const old = packet.reviewRound.reviewedItems.find((item) => item.slug === oliguria.slug)!;
    expect(oliguria.conceptId).not.toBe(old.conceptId);
    expect(oliguria.previousConceptId).toBe(old.conceptId);
    expect(oliguria.exhibit.items.map((row) => row.value).join(" ")).not.toContain("Replacement fell behind");
    expect(oliguria.exhibit.items.map((row) => row.value).join(" ")).not.toContain("FENa");
    const acquisition = packet.proposedNodes.find((item) => item.slug === "pressure-acquisition")!;
    expect(acquisition.choices[0]!.label).not.toContain("standardized");
    expect(acquisition.explanation).toContain("25 mL");
    expect(acquisition.explanation).toContain("midaxillary");
    const recovery = packet.proposedNodes.find((item) => item.slug === "trial-off-crrt")!;
    expect(recovery.task).toContain("reassessment after CRRT interruption");
    expect(recovery.choices.every((choice) => !choice.label.includes("monitoring"))).toBe(true);
    expect(recovery.exhibit.items.some((row) => row.label === "Ongoing care")).toBe(true);
  });

  it.each(topic.CRITICAL_RENAL_TOPIC_PARKED_ITEMS)("withholds the unresolved clinical key for $slug", (item) => {
    expect(item.keyChoiceId).toBeNull();
    expect(item.choices.every((choice) => choice.isCorrect === null)).toBe(true);
    expect(questions.some((question) => question.id === item.questionVariantId)).toBe(false);
    expect(questions.some((question) => question.id === item.before.questionVariantId)).toBe(false);
    expect(item.reviewStatus).toBe("needs_clinician_review");
    expect(item.manualAuthorGate.clinicalApproval).toBe(false);
    expect(item.parkReason).toBeTruthy();
    expect(sha(item.visibleContext)).toBe(item.exactVisibleContextSha256);
    expect(ledger.parkedQuestionToClaims.find((row) => row.questionVariantId === item.questionVariantId)!.statementMappings).toEqual(item.statementMappings);
  });
});

const salvageNodePins = [
  ["congestion-directed-oliguria", "d204d648f8f7b4e6d222b45e876ade5f4f5f9d297cfd91f94ea26f39a9464f40"],
  ["rrt-treatment-response", "bd2b66725d4efcb791d78297ad4bcad9573e512f22fd7319f0d92c9e89f5aef9"],
  ["rrt-refractory-pulmonary-fluid", "75ac963a3caf3bab697cca6f3caedbfa6f00f85669d9091282deb4d74038af76"],
] as const;

const acceptedProtectionPins = [
  ["case.topic.critical-renal-organ-support.circuit-anticoagulation.v1", "question.topic.critical-renal-organ-support.citrate-bleeding-circuit.v1", "12d7cfcd17f3f2bb768c8a3be5595e362e85e48fa067d32a322f4942375d7a12", "0662fe5834d87908877993c87beec1c031b3adc814d51d6550f4e66653598b38"],
  ["case.topic.critical-renal-organ-support.kidney-recovery.v1", "question.topic.critical-renal-organ-support.trial-off-crrt.v2", "032a98e96fe6e1e256faea86fcfbda149597d0d1f45130848790ee68e69c03fb", "04005f859ca0838ec1423c873fead541b91ae1fdcfa5d5127cbffb55410218bb"],
] as const;

const salvageReceiptPins = [
  ["docs/research/question-topic-acceptance-batch1-dispositions-20261111.json", "bff524ce7158c1326304b9aa15ffdfab3e20cdc922c4aa62d6093c12636babb4"],
  ["docs/research/question-topic-acceptance-batch1-20261111.md", "7c9b238011bcbc8cd918d7b562f4e01958e5353ac2afcee8b635a3f3f89e58b8"],
  ["docs/research/question-topic-critical-renal-organ-support-review2-20261111.json", "5de14b1d38f4418fc32aad6517a4b25e5bcd009af3902607a39670ed9a591cdb"],
  ["docs/research/question-topic-acceptance-batch1-packet-20261111.json", "393f6b367bf23a198efebcd7baaa87f62c6549f9f97cb73574b62c8f7ceba887"],
  ["docs/research/question-topic-acceptance-batch1-files-20261111.json", "285e5462c95d22de7a222a4943b1746cda52a45eb37e6f54308bb0feb3030ca8"],
] as const;

describe("critical renal batch1 skipped PASS salvage", () => {
  const salvage = topic.CRITICAL_RENAL_TOPIC_SALVAGE;
  const salvageCases = topic.CRITICAL_RENAL_TOPIC_SALVAGE_CASES;

  it("targets every skipped renal PASS and only those three nodes", () => {
    const dispositions = readJson("../../../docs/research/question-topic-acceptance-batch1-dispositions-20261111.json");
    const skipped = dispositions.items.filter((row: { topic: string; status: string; evidence: { item: { verdict: string } } }) =>
      row.topic === "critical-renal-organ-support" && row.status === "skipped" && row.evidence.item.verdict === "PASS");
    expect(skipped).toHaveLength(3);
    expect(salvage.status).toBe("salvage");
    expect(salvage.reviewOnlyNodeIds).toEqual(skipped.map((row: { nodeId: string }) => row.nodeId));
    expect(salvage.reviewOnlyQuestionVariantIds).toEqual(skipped.map((row: { questionVariantId: string }) => row.questionVariantId));
    expect(salvage.caseDefinitions.every((row) => row.status === "salvage")).toBe(true);
    expect(salvage.proposedNodes.every((row) => row.status === "salvage")).toBe(true);
    expect(salvage.dispositions.every((row) => row.status === "salvage")).toBe(true);
    expect(salvage.counts).toMatchObject({ salvageCases: 3, salvageNodes: 3, companionRewrites: 0, newQuestionVariants: 0, newConceptMeanings: 0 });
    expect(packet.proposedNodes.filter((row) => row.status === "salvage").map((row) => row.questionVariantId)).toEqual(salvage.reviewOnlyQuestionVariantIds);
  });

  it.each(salvageReceiptPins)("pins the unchanged salvage authority %s", (file, expected) => {
    const bytes = readFileSync(new URL(`../../../${file}`, import.meta.url));
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(expected);
    expect(salvage.acceptanceReceipts.find((row) => row.path === file)!.sha256).toBe(expected);
  });

  it.each(salvageNodePins)("makes %s standalone with exact PASS wording, options and clinical facts", (slug, expectedNodeHash) => {
    const item = salvage.proposedNodes.find((row) => row.slug === slug)!;
    const previous = salvage.beforeItems.find((row) => row.questionVariantId === item.questionVariantId)!;
    const clinicalCase = salvageCases.find((row) => row.id === item.caseId)!;
    const node = clinicalCase.decisionNodes[0]!;
    const originalCase = salvage.beforeCaseDefinitions.find((row) => row.id === previous.caseId)!;
    expect(syntheticClinicalCaseSchema.safeParse(clinicalCase).success).toBe(true);
    expect(clinicalCase.decisionNodes).toHaveLength(1);
    const originalNode = nodes.find((row) => row.id === node.id)!;
    const { terminalDispositions: finalFeedback, ...standaloneClinicalNode } = node;
    const { terminalDispositions: previousFeedback, ...originalClinicalNode } = originalNode;
    expect(standaloneClinicalNode).toEqual(originalClinicalNode);
    expect(previousFeedback).toEqual([]);
    expect(sha(canonicalize(originalNode))).toBe(expectedNodeHash);
    const archived = topic.CRITICAL_RENAL_TOPIC_REVIEWED_NODES.find((row) => row.id === node.id)!;
    expect(finalFeedback).toEqual(archived.terminalDispositions);
    expect(finalFeedback).toHaveLength(node.answerChoices.filter((choice) => !choice.isCorrect).length);
    expect(finalFeedback.every((row) => row.kind === "no_terminal_outcome")).toBe(true);
    expect(node.stem).toBe(previous.chartReview.task);
    expect(item.task).toBe(previous.task);
    expect(item.choices).toEqual(previous.choices);
    expect(item.keyChoiceId).toBe(previous.keyChoiceId);
    expect(item.exhibit).toEqual(previous.exhibit);
    expect(item.explanation).toBe(previous.explanation);
    expect(item.conceptId).toBe(previous.conceptId);
    expect(clinicalCase.presentation).toBe(originalCase.presentation);
    expect(clinicalCase.prototypeDemographics).toEqual(originalCase.prototypeDemographics);
    expect(clinicalCase.patientDisplayName).toBe(originalCase.patientDisplayName);
    expect(clinicalCase.id).not.toBe(originalCase.id);
    expect(clinicalCase.patientPresentationVariantId).not.toBe(originalCase.patientPresentationVariantId);
    expect(clinicalCase.approvedInstantiationProfiles![0]!.id).not.toBe(originalCase.finiteProfiles[0]!.id);
    expect(clinicalCase.learningSummary).toBe(node.explanation);
    expect(item.positionInCase).toBe(1);
    expect(item.selection).toEqual({ standaloneStatus: "standalone", priorContextRequired: [], selectorChange: false });
    expect(item.visibleContext.priorNodes).toEqual([]);
    expect(item.visibleContext.recordedPriorNodes).toEqual([]);
    expect(item.chartReview.recordedPriorNodes).toEqual([]);
    expect(item.salvageReview.addedClinicalObservations).toEqual([]);
    expect(sha(item.visibleContext)).toBe(item.exactVisibleContextSha256);
    expect(item.reviewStatus).toBe("needs_clinician_review");
    expect(item.salvageReview.contextReReview).toBe("pending");
  });

  it.each(acceptedProtectionPins)("leaves the already accepted case %s exact", (caseId, questionId, itemHash, caseHash) => {
    const item = packet.proposedNodes.find((row) => row.questionVariantId === questionId)!;
    const definition = topic.CRITICAL_RENAL_TOPIC_CASE_DEFINITIONS.find((row) => row.id === caseId)!;
    expect(sha(canonicalize(item))).toBe(itemHash);
    expect(sha(canonicalize(definition))).toBe(caseHash);
    expect(topic.CRITICAL_RENAL_TOPIC_CASES.find((row) => row.id === caseId)).toEqual(acceptedCases.find((row) => row.id === caseId));
    expect(questions.find((row) => row.id === questionId)).toEqual(acceptedQuestions.find((row) => row.id === questionId));
    expect(salvage.reviewOnlyQuestionVariantIds).not.toContain(questionId);
    expect(salvage.reviewOnlyCaseIds).not.toContain(caseId);
  });

  it("exports a complete three-case release with no unpassed companion or new clinical identity", () => {
    const release = topic.CRITICAL_RENAL_TOPIC_SALVAGE_SOURCE_RELEASE;
    expect(syntheticClinicalReleaseSchema.safeParse(release).success).toBe(true);
    expect(release.cases).toHaveLength(3);
    expect(release.cases.every((row) => row.decisionNodes.length === 1)).toBe(true);
    expect(release.cases.flatMap((row) => row.decisionNodes.map((node) => node.id))).toEqual(salvage.reviewOnlyNodeIds);
    expect(topic.CRITICAL_RENAL_TOPIC_SALVAGE_QUESTIONS.map((row) => row.id)).toEqual(salvage.reviewOnlyQuestionVariantIds);
    for (const question of topic.CRITICAL_RENAL_TOPIC_SALVAGE_QUESTIONS) expect(question).toEqual(questions.find((row) => row.id === question.id));
    for (const concept of release.concepts) expect(concept).toEqual(topic.CRITICAL_RENAL_TOPIC_CONCEPTS.find((row) => row.id === concept.id));
    expect(release.publicationStatus).toBe("synthetic_unapproved_prototype");
  });

  it("rebinds only the exact timing and test-order tuples to the new standalone cases", () => {
    const timing = topic.CRITICAL_RENAL_TOPIC_SALVAGE_TIMING_PROPOSALS;
    const orders = topic.CRITICAL_RENAL_TOPIC_SALVAGE_TEST_ORDER_PROPOSALS;
    expect(timing).toHaveLength(3);
    expect(orders).toHaveLength(2);
    for (const row of timing) {
      const old = topic.CRITICAL_RENAL_TOPIC_TIMING_PROPOSALS.find((entry) => entry.questionVariantId === row.questionVariantId)!;
      const clinicalCase = salvageCases.find((entry) => entry.id === row.caseId)!;
      expect({ ...row, caseId: old.caseId }).toEqual(old);
      expect(clinicalCase.decisionNodes[0]!.id).toBe(row.nodeId);
    }
    for (const row of orders) {
      const old = packet.testOrderProposals.find((entry) => entry.choiceId === row.choiceId)!;
      expect({ ...row, caseId: old.caseId }).toEqual(old);
      expect(row.disposition).toEqual({ kind: "not_executed", reason: "future_planned" });
      expect(row.serviceRequest).toBeNull();
      expect(row.resultGateAfter).toBeNull();
      expect(knownTimingIds.has(row.timingProfileId)).toBe(true);
    }
  });

  it("maps each new visible context to unchanged clinical evidence", () => {
    expect(ledger.salvageRound.newSources).toBe(0);
    expect(ledger.salvageRound.newClaims).toBe(0);
    expect(ledger.salvageRound.questionToClaims).toHaveLength(3);
    for (const item of salvage.proposedNodes) {
      const mapping = ledger.salvageRound.questionToClaims.find((row) => row.questionVariantId === item.questionVariantId)!;
      expect(mapping.caseId).toBe(item.caseId);
      expect(mapping.nodeId).toBe(item.nodeId);
      expect(mapping.exactVisibleContextSha256).toBe(item.exactVisibleContextSha256);
      expect(mapping.supportingEvidenceClaimIds).toEqual(item.supportingEvidenceClaimIds);
      expect(mapping.statementMappings).toEqual(item.statementMappings);
    }
  });

  it("admits the salvage cases through existing clinic eligibility without hospital services", () => {
    const context = validateDomainContext({ clinicalRelease: topic.CRITICAL_RENAL_TOPIC_SALVAGE_SOURCE_RELEASE, balanceRelease: balance });
    const state = createInitialGameState();
    state.facilityLevel = 4;
    const capabilities = new Set(balance.facility.roomDefinitions.find((room) => room.id === "room.examination")!.capabilityIds);
    for (const clinicalCase of salvageCases) {
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.requiredCapabilityIds).toEqual(["capability.examination"]);
      expect(getClinicalCaseEligibilityIssue(state, clinicalCase, context, capabilities)).toBeNull();
      expect(clinicalCase.decisionNodes.every((node) => node.resultGateAfter === null && node.answerChoices.every((choice) => choice.serviceRequest === null))).toBe(true);
    }
  });
});
