import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getDiagnosticTimingProfileMapping } from "../../balance-config/src/diagnostic-timing";
import ledger from "../../../docs/research/sources-question-topic-pediatric-gi-abdominal-wall-20261111.json";
import { HERNIA_FAMILY } from "./development-batch/2026-10-08-pediatric-clinic/hernia";
import { PEDIATRIC_CLINIC_CASES } from "./development-batch/2026-10-08-pediatric-clinic/pediatric-clinic-batch";
import { QUESTION_NEW_N4_ROUND2_CASES, QUESTION_NEW_N4_ROUND2_QUESTIONS } from "./question-new-n4-round2-20261110";
import { answerChoiceTimingRegistryEntrySchema, validateSyntheticClinicalRelease } from "./schema";
import { PEDIATRIC_PROFILE } from "./development-batch/2026-10-08-pediatric-clinic/batch-helpers";
import { ANSWER_CHOICE_TIMING_REGISTRY } from "./answer-choice-timing";
import { pediatricCaseHasCompatibleIdentity } from "../../game-domain/src/pediatric-eligibility";
import { pediatricStillEligibleEntries } from "../../game-domain/src/characterStillCatalog";
import { gameReducer } from "../../game-domain/src/reducer";
import { getClinicalCaseEligibilityIssue } from "../../game-domain/src/clinical-case-eligibility";
import { createLevelFourRoomsQaContext } from "../../../tests/fixtures/level-four-rooms";
import { createPediatricChartsQaState } from "../../../tests/fixtures/pediatric-charts";
import {
  PEDIATRIC_GI_TOPIC_PACKET as packet, PEDIATRIC_GI_TOPIC_CASES as cases,
  PEDIATRIC_GI_TOPIC_QUESTIONS as questions, PEDIATRIC_GI_TOPIC_TESTED_CONCEPTS as concepts,
  PEDIATRIC_GI_TOPIC_SOURCES as sources, PEDIATRIC_GI_TOPIC_CLAIMS as claims,
  PEDIATRIC_GI_TOPIC_TIMING_ENTRIES as timings, PEDIATRIC_GI_TOPIC_ORDER_PROPOSALS as orders,
  PEDIATRIC_GI_TOPIC_SOURCE_LINKS as links, PEDIATRIC_GI_TOPIC_AUTHOR_CHECKS as checks,
  PEDIATRIC_GI_TOPIC_CASE_REVIEWS as reviews, PEDIATRIC_GI_TOPIC_PREVIEW_RELEASE as preview,
  PEDIATRIC_GI_TOPIC_MANIFEST as manifest,
  PEDIATRIC_GI_TOPIC_REVIEW_RESPONSES as responses,
  PEDIATRIC_GI_TOPIC_PARKED_ITEMS as parked,
  PEDIATRIC_GI_TOPIC_PRESERVED_REVIEW_INPUTS as preserved,
  PEDIATRIC_GI_TOPIC_SALVAGE_PROPOSALS as salvage,
  PEDIATRIC_GI_TOPIC_SALVAGE_CASES as salvageCases,
  PEDIATRIC_GI_TOPIC_SALVAGE_TIMING_ENTRIES as salvageTimings,
  PEDIATRIC_GI_TOPIC_OUTSIDE_RECORD_ORDER_PROPOSALS as recordOrders,
  PEDIATRIC_GI_TOPIC_SALVAGE_REVIEW_CASES as salvageReviewCases,
  PEDIATRIC_GI_TOPIC_PARKED_SALVAGE as parkedSalvage,
} from "./question-topic-pediatric-gi-abdominal-wall-20261111";

const repository = new URL("../../../", import.meta.url);
const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
const topic = "pediatric-gi-abdominal-wall";

describe("pediatric GI and abdominal-wall topic sidecar", () => {
  it("reconciles every assigned exact variant and preserves planning holds separately", () => {
    expect(packet.audit.map(a => a.recordId).sort()).toEqual(packet.assigned.inventory.map(a => a.recordId).sort());
    expect(new Set(packet.audit.flatMap(a => a.variantIds)).size).toBe(3);
    expect(packet.audit.every(a => a.verdict === "Retire-and-replace" && a.reasons.length >= 3)).toBe(true);
    expect(packet.counts).toMatchObject({ audited: 3, kept: 0, rewritten: 0, retiredAndReplacedProposed: 3, new: 11, replacementNodes: 1, newGapNodes: 10 });
    expect(packet.heldPlanning.map(h => h.recordId).sort()).toEqual([
      "n4-slot-P06", "conflict.pediatric-clinic.umbilical-repair-age", "withheld.pediatric-clinic.umbilical-timing",
    ].sort());
    expect(packet.assigned.recordedHolds).toEqual([]);
    expect(packet.assigned.frozenReferences).toEqual([]);
    expect(packet.priorReview).toHaveLength(1);
    expect(packet.priorReview[0]).toMatchObject({ verdict: "REVISE", twoStep: false });
    expect(packet.heldPlanning.every(h => !packet.audit.some(a => a.recordId === h.recordId))).toBe(true);
  });

  it("keeps exact historical definitions and question hashes unchanged", () => {
    const beforeCases = [...PEDIATRIC_CLINIC_CASES, ...QUESTION_NEW_N4_ROUND2_CASES];
    const beforeQuestions = [...HERNIA_FAMILY.questions, ...QUESTION_NEW_N4_ROUND2_QUESTIONS];
    for (const before of packet.before) {
      const clinicalCase = beforeCases.find(c => c.id === before.sourceCase.id)!;
      const node = clinicalCase.decisionNodes.find(n => n.id === before.node.id)!;
      const question = beforeQuestions.find(q => q.id === before.question.id)!;
      expect(node).toEqual(before.node);
      expect(question).toEqual(before.question);
      expect(sha256(JSON.stringify(node))).toBe(before.nodeSha256);
      expect(sha256(JSON.stringify(question))).toBe(before.questionSha256);
      expect(clinicalCase.approvedInstantiationProfiles).toEqual(before.sourceCase.approvedInstantiationProfiles);
    }
    // Shared manifest/assembly hashes can advance concurrently. Only source
    // inputs upon which this exact proposal depends are pinned here.
    for (const input of packet.assigned.baseline.relevantFiles.filter(f => /pediatric-clinic\/|question-new-n4-round2/.test(f.file))) {
      expect(sha256(readFileSync(new URL(input.file, repository), "utf8")), input.file).toBe(input.currentSha256);
    }
  });

  it("validates eleven standalone clinic records without unresolved companions", () => {
    expect(validateSyntheticClinicalRelease(preview)).toEqual(preview);
    expect(cases).toHaveLength(11);
    expect(questions).toHaveLength(11);
    expect(concepts).toHaveLength(11);
    const allNodes = cases.flatMap(c => c.decisionNodes);
    for (const ids of [cases.map(c => c.id), questions.map(q => q.id), concepts.map(c => c.id), allNodes.map(n => n.id)]) {
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids.every(id => id.includes(topic))).toBe(true);
    }
    expect(cases.every(c => c.decisionNodes.length === 1)).toBe(true);
    expect(cases.every(c => c.requiredClinicalSetting === "clinic")).toBe(true);
    expect(questions.every(q => q.reviewStatus === "needs_clinician_review" && q.lastClinicianReview === null)).toBe(true);
    expect(manifest).toMatchObject({ independentPass: false, clinicalApproval: false, managerAccepted: false });
    const previous = new Set(packet.assigned.concepts.map(c => c.conceptId));
    expect(concepts.every(c => !previous.has(c.id))).toBe(true);
  });

  it("preserves fixed ages, sexes and named record-review frames without an infant setting", () => {
    for (const c of cases) {
      const definition = packet.cases.find(row => row.id === c.id)!;
      expect(c.presentation).toContain("In clinic");
      expect(c.presentation).toContain("outside hospital records");
      expect(c.presentation).toContain("{patientName}");
      expect(c.presentation).toContain(definition.patientAgeText);
      expect(c.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(c.approvedInstantiationProfiles).toHaveLength(1);
      expect(c.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(definition.prototypeDemographics);
      expect(c.approvedInstantiationProfiles![0]!.presentation).toBe(c.presentation);
      const salvaged = salvage.find(s => s.caseId === c.id);
      if (salvaged) {
        expect(c.pediatricProfile).toEqual(PEDIATRIC_PROFILE);
        expect(c.approvedInstantiationProfiles![0]!.pediatricProfile).toEqual(PEDIATRIC_PROFILE);
        expect(c.prototypeDemographics).toEqual(salvaged.clinicDemographics);
        if (salvaged.recordDemographics.ageYears < 5) expect(c.presentation).toContain(salvaged.recordAgeText);
      } else expect(c.pediatricProfile).toBeUndefined();
      const review = reviews.find(r => r.caseId === c.id)!;
      expect(review.educationalTier).toBe(1);
      expect(review.earliestFacilityStage).toBe(4);
      expect(review.patientAcuity).toBe(definition.acuity);
      expect(review.requiredCapabilityIds).toEqual(definition.requiredCapabilityIds);
    }
  });

  it("randomizes runtime choices and does not execute chart-review investigations", () => {
    for (const c of cases) for (const n of c.decisionNodes) {
      expect(n.shuffleAnswers).toBe(true);
      expect(n.answerChoices).toHaveLength(3);
      expect(n.answerChoices.filter(a => a.isCorrect)).toHaveLength(1);
      expect(n.resultGateAfter).toBeNull();
      expect(n.answerChoices.every(a => a.serviceRequest === null)).toBe(true);
      expect(n.stem).toContain("{patientName}");
      expect(n.exhibit?.kind).toBe("keyValue");
      if (n.exhibit?.kind === "keyValue") expect(n.exhibit.caption).toContain("Constructed");
    }
    expect(packet.reviewOrderNotice).toBe("key shown first for review only");
  });

  it("maps every testing alternative by exact choice identity and existing profile", () => {
    expect(timings).toHaveLength(questions.length);
    const expectedTests = packet.nodes.filter(n => !salvage.some(s => s.nodeId === n.id))
      .flatMap(n => n.choices.filter(c => c.timingProfileId).map(c => ({ n, c })));
    expect(orders).toHaveLength(expectedTests.length);
    expect(expectedTests).toHaveLength(10);
    for (const timing of timings) {
      expect(answerChoiceTimingRegistryEntrySchema.parse(timing)).toEqual(timing);
      const spec = packet.nodes.find(n => n.id === timing.nodeId)!;
      if (salvage.some(s => s.nodeId === spec.id)) {
        expect(timing.classification).toEqual({ kind: "no_test" });
        continue;
      }
      if (timing.classification.kind === "test_choices") {
        expect(timing.classification.choices.map(c => c.choiceId).sort()).toEqual(spec.choices.map(c => c.id).sort());
        for (const choice of timing.classification.choices) {
          const original = spec.choices.find(c => c.id === choice.choiceId)!;
          expect(choice.choiceLabel).toBe(original.label);
          if (choice.timing.kind === "test") {
            expect(choice.timing.timingProfileId).toBe(original.timingProfileId);
            expect(getDiagnosticTimingProfileMapping(choice.timing.timingProfileId)).toBeDefined();
            expect(choice.timing.timingProfileId).not.toBe("timing.test.clinical_procedure");
          } else expect(original.timingProfileId).toBeNull();
        }
      } else expect(spec.choices.every(c => c.timingProfileId === null)).toBe(true);
    }
    for (const { n, c } of expectedTests) {
      expect(orders.find(o => o.nodeId === n.id && o.choiceId === c.id)).toMatchObject({
        questionVariantId: n.questionVariantId, choiceLabel: c.label, timingProfileId: c.timingProfileId,
        disposition: { kind: "not_executed", reason: "future_planned" },
      });
    }
  });

  it("closes source, claim, option and field mappings in both directions", () => {
    expect(sources).toHaveLength(17);
    expect(claims).toHaveLength(47);
    const bySource = new Map(sources.map(s => [s.id, s])), byClaim = new Map(claims.map(c => [c.id, c]));
    for (const c of claims) {
      expect(c.reviewStatus).toBe("needs_clinician_review");
      expect(c.lastCheckedOn).toBe("2026-11-11");
      expect(c.limitation).toBeTruthy();
      for (const id of c.sourceIds) expect(bySource.get(id)?.evidenceClaimIds).toContain(c.id);
      const mapped = ledger.claimToQuestionMappings.find(m => m.claimId === c.id)!;
      expect(mapped.questionVariantIds.sort()).toEqual(packet.nodes.filter(n => n.evidenceClaimIds.includes(c.id)).map(n => n.questionVariantId).sort());
    }
    for (const s of sources) {
      expect(s.authorityAssessment).toBeTruthy();
      expect(s.reuseNotes).toBeTruthy();
      expect(s.completeCitation).toBeTruthy();
      for (const id of s.evidenceClaimIds) expect(byClaim.get(id)?.sourceIds).toContain(s.id);
    }
    for (const n of packet.nodes) {
      expect(n.evidenceClaimIds.every(id => byClaim.has(id))).toBe(true);
      expect(ledger.statementMappings.find(m => m.questionVariantId === n.questionVariantId)).toMatchObject(n.statementMapping);
      for (const c of n.choices) expect(c.evidenceClaimIds.every(id => n.evidenceClaimIds.includes(id))).toBe(true);
    }
    expect(ledger.historicalClaims).toHaveLength(6);
    expect(ledger.historicalClaims.every(c => c.lastCheckedOn !== "2026-11-11")).toBe(true);
    expect(ledger.historicalSources.every(s => s.accessedOn !== "2026-11-11")).toBe(true);
  });

  it("keeps links safe and author judgments distinct from independent approval", () => {
    expect(links).toHaveLength(sources.length);
    expect(links.every(l => l.href.startsWith("https://") && l.target === "_blank" && l.rel === "noopener noreferrer" && l.referrerPolicy === "no-referrer")).toBe(true);
    for (const check of checks) {
      expect(check).toMatchObject({ independent: false, clinicalApproval: false, reviewStatus: "needs_clinician_review" });
      for (const key of ["coverTheKeyCueAttack", "oneStageAndCategory", "twoConsequentialSteps", "residentDifficulty", "oneBestAnswer", "sequenceAndFiniteProfileAttack", "repairAndRecheck"] as const) {
        expect(check[key].length).toBeGreaterThan(35);
      }
      const n = packet.nodes.find(n => n.questionVariantId === check.questionVariantId)!;
      expect(n.reasoning.counterfactualChoiceId).not.toBe(n.keyChoiceId);
      expect(n.choices.some(c => c.id === n.reasoning.counterfactualChoiceId)).toBe(true);
    }
  });

  it("keeps the supported revision objectives and all selection limits explicit", () => {
    const bilious = cases.find(c => c.id.includes("bilious-incomplete-study"))!;
    expect(bilious.decisionNodes[0]!.explanation).not.toContain("urgent operative exploration");
    const wilms = cases.find(c => c.id.includes("wilms-normal-node-sampling"))!;
    expect(wilms.decisionNodes[0]!.currentUpdate).toContain("presumed unilateral Wilms tumor");
    expect(wilms.decisionNodes[0]!.currentUpdate).toContain("COG/North American");
    expect(packet.integrationDependencies.some(d => d.includes("ALL exact scored nodes receive independent PASS"))).toBe(true);
    expect(packet.integrationDependencies.some(d => d.includes("selector/FSRS"))).toBe(true);
    const replacement = packet.nodes.find(n => n.origin === "replacement")!;
    expect([...replacement.before].sort()).toEqual(packet.audit.map(a => a.recordId).sort());
    for (const n of packet.nodes.filter(n => n.origin === "new_gap")) expect(n.before).toEqual([]);
  });

  it("preserves the original PASS snapshots while versioning the chronology repair and parking the dropped item", () => {
    const expected = {
      "intussusception-partial-progress": ["c0533450a47c1aaf59a65168ec4125c9e5f5cdf9d765443223d21393062fe34c", "0e88e5dc1d6c129f560c8e888d14e22b83a5d347029dd6761342c2e6d58d81c2"],
      "nec-fixed-loop-context": ["ea041f4775428704c92d6d0e7ca19655de5957d11cf6e44c8ead9d0d2a4147f3", "591060294b042395e1b3d1e4ba58c173fcad4fd31a0164bb00ec9cec7895860a"],
      "gastroschisis-domain-intolerance": ["46996c08d7201056ff40976bdfffb6de8c2f4543a3ad5d7ae524970801880d5e", "81e1276aeab2da156112c250f49673ff3311ce4141950295c220feb30a72557f"],
      "preterm-hernia-timing": ["259b87413e186edd3468fa1c490cde8296b1b887e52644aeae8bd62c40a90527", "0f70110765b732d0def1de259d034e4640f55116ab0988e8abc2898e2afa7fe0"],
    };
    expect(preserved).toHaveLength(4);
    for (const [slug, [nodeHash, questionHash]] of Object.entries(expected)) {
      const before = preserved.find(p => p.questionVariantId === `question.${topic}.${slug}.v1`)!;
      expect(sha256(JSON.stringify(before.after.currentNode))).toBe(nodeHash);
      expect(sha256(JSON.stringify(before.after.question))).toBe(questionHash);
      if (slug === "gastroschisis-domain-intolerance") {
        expect(questions.some(q => q.id === before.questionVariantId)).toBe(false);
        expect(cases.some(c => c.decisionNodes.some(n => n.id === before.after.currentNode.id))).toBe(false);
        continue;
      }
      if (slug === "intussusception-partial-progress") {
        const revision = packet.salvageReviewFollowup.intussusceptionRevision;
        const current = questions.find(q => q.id === revision.questionVariantId)!;
        const { id: _oldId, contentVersion: _oldVersion, stem: _oldStem, ...oldMeaning } = before.after.question;
        const { id: _newId, contentVersion: _newVersion, stem: _newStem, ...currentMeaning } = current;
        expect(currentMeaning).toEqual(oldMeaning);
        expect(current.id).not.toBe(before.questionVariantId);
        expect(current.stem).toContain("recorded admission");
        continue;
      }
      const question = questions.find(q => q.id === before.questionVariantId)!;
      expect(question).toEqual(before.after.question);
      expect(sha256(JSON.stringify(question))).toBe(questionHash);
      const currentCase = cases.find(c => c.decisionNodes.some(n => n.questionVariantId === question.id))!;
      const salvaged = salvage.find(s => s.caseId === currentCase.id);
      const currentNode = currentCase.decisionNodes[0]!;
      const { terminalDispositions: oldEndings, ...oldClinical } = before.after.currentNode;
      const { terminalDispositions: newEndings, ...newClinical } = currentNode;
      expect(newClinical).toEqual(oldClinical);
      for (const field of ["displayName", "patientDisplayName", "chiefComplaint"] as const) {
        expect(currentCase[field]).toEqual(before.after.clinicalCase[field]);
      }
      const profileText = <T extends { id: string }>(profiles: T[] | undefined) => profiles?.map(({ id: _id, ...clinical }) => clinical);
      if (!salvaged) {
        expect(currentCase.presentation).toBe(before.after.clinicalCase.presentation);
        expect(currentCase.prototypeDemographics).toEqual(before.after.clinicalCase.prototypeDemographics);
        expect(profileText(currentCase.approvedInstantiationProfiles)).toEqual(profileText(before.after.clinicalCase.approvedInstantiationProfiles));
      } else {
        expect(currentCase.pediatricProfile).toEqual(PEDIATRIC_PROFILE);
        expect(currentCase.prototypeDemographics).toEqual(salvaged.clinicDemographics);
      }
      if (before.after.clinicalCase.decisionNodes.length === 1) {
        if (!salvaged) expect(currentCase).toEqual(before.after.clinicalCase);
        expect(newEndings).toEqual(oldEndings);
      } else {
        expect(currentCase.id).not.toBe(before.after.clinicalCase.id);
        expect(currentCase.learningSummary).toBe(currentNode.explanation);
        expect(oldEndings).toEqual([]);
        expect(newEndings).toHaveLength(2);
        for (const ending of newEndings) {
          expect(ending.kind).toBe("no_terminal_outcome");
          if (ending.kind !== "no_terminal_outcome") throw new Error("A split chart review must not simulate a patient outcome.");
          expect(ending.clinicalRationale).toBe(currentNode.answerChoices.find(c => c.id === ending.answerChoiceId)!.rationale);
        }
      }
    }
  });

  it("accounts for every independent review note and excludes all six parked keys", () => {
    const review = packet.independentReviewFollowup;
    expect(sha256(readFileSync(new URL(review.reviewPath, repository), "utf8"))).toBe("f457a48f395be364bcce883ca202350cc227c98ab87df1bf36d8803e081c3eaa");
    expect(responses).toHaveLength(17);
    expect(review.counts).toMatchObject({ reviewed: 17, passPreserved: 4, revised: 8, parked: 5, active: 12, multipartCases: 0 });
    for (const original of review.reviews) {
      const response = responses.find(r => r.reviewedQuestionVariantId === original.id)!;
      expect(response.originalVerdict).toBe(original.verdict);
      const notes = (["clarityIssues", "cues", "fairness", "suggestions"] as const)
        .flatMap(category => original[category].map((reviewNote, index) => ({ category, index, reviewNote })));
      expect(response.notes.map(({ category, index, reviewNote }) => ({ category, index, reviewNote }))).toEqual(notes);
      expect(response.notes.every(n => n.response.length > 35)).toBe(true);
      expect(response.revisionPasses).toBe(original.verdict === "PASS" ? 0 : 1);
      if (response.status === "revised") {
        expect(response.currentQuestionVariantId).toBe(original.id.replace(/\.v1$/, ".v2"));
        expect(response.independentReviewState).toContain("not re-reviewed");
      }
    }
    expect(parked).toHaveLength(6);
    for (const item of parked) {
      expect(item.reason.length).toBeGreaterThan(100);
      expect(item.attemptedRevision.length).toBeGreaterThan(100);
      expect(questions.some(q => q.id === item.reviewedQuestionVariantId)).toBe(false);
      expect(cases.some(c => c.decisionNodes.some(n => n.id === item.reviewedNodeId))).toBe(false);
      expect(review.reviewInput.proposals.some(p => p.questionVariantId === item.reviewedQuestionVariantId)).toBe(true);
    }
  });

  it("versions all returned questions and separates changed meanings from retained history", () => {
    expect(packet.identityChanges).toHaveLength(4);
    const original = packet.independentReviewFollowup.reviewInput;
    for (const change of packet.identityChanges) {
      expect(original.concepts.some(c => c.id === change.previousConceptId)).toBe(true);
      expect(concepts.some(c => c.id === change.currentConceptId)).toBe(true);
      expect(concepts.some(c => c.id === change.previousConceptId)).toBe(false);
      expect(change.historyPolicy).toContain("do not migrate FSRS history");
    }
    for (const response of responses.filter(r => r.status === "revised")) {
      const q = questions.find(q => q.id === response.currentQuestionVariantId)!;
      const old = original.proposals.find(p => p.questionVariantId === response.reviewedQuestionVariantId)!.after.question;
      expect(q.contentVersion).toBe("clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2");
      expect(q.reviewStatus).toBe("needs_clinician_review");
      expect(q.lastClinicianReview).toBeNull();
      if (!packet.identityChanges.some(c => c.previousConceptId === old.conceptId)) expect(q.conceptId).toBe(old.conceptId);
    }
    expect(packet.independentReviewFollowup.reviewInput.proposals).toHaveLength(17);
  });

  it("keeps five active salvage identities with only the intussusception chronology revised", () => {
    expect(salvage).toHaveLength(5);
    expect(salvageCases).toHaveLength(5);
    expect(salvage.map(s => s.nodeId).sort()).toEqual([
      "node.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2",
      "node.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
      "node.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
      "node.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
      "node.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
    ].sort());
    for (const s of salvage) {
      expect(s.status).toBe("salvage");
      expect(s.independentPassRecord.verdict).toBe("PASS");
      const c = salvageCases.find(c => c.id === s.caseId)!;
      expect(c.decisionNodes).toHaveLength(1);
      const q = questions.find(q => q.id === s.questionVariantId)!;
      if (s.nodeId === packet.salvageReviewFollowup.intussusceptionRevision.nodeId) {
        expect(c.decisionNodes[0]).toEqual(packet.salvageReviewFollowup.intussusceptionRevision.node);
        expect(q).toEqual(packet.salvageReviewFollowup.intussusceptionRevision.question);
        expect(s.passAppliesToCurrentVersion).toBe(false);
      } else {
        expect(c.decisionNodes[0]).toEqual(s.before.node);
        expect(sha256(JSON.stringify(c.decisionNodes[0]))).toBe(s.exactBeforeNodeSha256);
        expect(q).toEqual(s.before.question);
        expect(sha256(JSON.stringify(q))).toBe(s.exactBeforeQuestionSha256);
      }
      expect(q.conceptId).toBe(s.conceptId);
      expect(c.id).not.toBe(s.sourceCaseId);
      expect(c.presentation).toContain("with a parent");
      expect(c.presentation).toContain("outside hospital records");
      expect(c.prototypeDemographics).toEqual(s.clinicDemographics);
      expect(pediatricCaseHasCompatibleIdentity(c)).toBe(true);
      expect(pediatricStillEligibleEntries(c.prototypeDemographics!.sexLabel, c.prototypeDemographics!.ageYears).length).toBeGreaterThan(0);
      for (const id of s.excludedCompanionNodeIds) expect(c.decisionNodes.some(n => n.id === id)).toBe(false);
    }
    expect(sha256(JSON.stringify(ledger.sources))).toBe(packet.salvage.sourceRecordsSha256);
    expect(sha256(JSON.stringify(ledger.claims))).toBe(packet.salvage.evidenceClaimsSha256);
  });

  it("retains recorded infant ages and historical procedure timings separately from current clinic demographics", () => {
    expect(salvage.filter(s => s.recordDemographics.ageYears < 5)).toHaveLength(3);
    expect(salvageTimings).toHaveLength(5);
    expect(salvageTimings.every(t => t.classification.kind === "no_test")).toBe(true);
    expect(recordOrders).toEqual(salvage.flatMap(s => s.before.orders));
    for (const s of salvage) {
      const c = salvageCases.find(c => c.id === s.caseId)!;
      expect(c.prototypeDemographics!.ageYears).toBeGreaterThanOrEqual(5);
      expect(c.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(c.prototypeDemographics);
      if (s.recordDemographics.ageYears < 5) {
        expect(c.presentation).toContain(s.recordAgeText);
        expect(c.presentation).toContain("all questions concern that recorded neonatal care");
      }
      expect(orders.some(o => o.nodeId === s.nodeId)).toBe(false);
      expect(c.decisionNodes.every(n => n.resultGateAfter === null && n.answerChoices.every(a => a.serviceRequest === null))).toBe(true);
    }
  });

  it("leaves all four salvage PASS cases and their proposal/definition/timing records exactly untouched", () => {
    const frozen = packet.salvageReviewFollowup.protectedPassInputs;
    expect(frozen).toHaveLength(4);
    for (const input of frozen) {
      const s = packet.salvageProposals.find(s => s.slug === input.slug)!;
      const c = cases.find(c => c.id === s.caseId)!;
      expect(s).toEqual(input.proposal);
      expect(sha256(JSON.stringify(s))).toBe(input.proposalSha256);
      expect(c).toEqual(input.proposal.after.clinicalCase);
      expect(sha256(JSON.stringify(c))).toBe(input.caseSha256);
      expect(c.decisionNodes[0]).toEqual(input.proposal.after.node);
      expect(questions.find(q => q.id === s.questionVariantId)).toEqual(input.proposal.after.question);
      expect(packet.cases.find(c => c.id === s.caseId)).toEqual(input.caseDefinition);
      expect(packet.nodes.find(n => n.id === s.nodeId)).toEqual(input.nodeDefinition);
      expect(packet.concepts.find(c => c.id === s.conceptId)).toEqual(input.conceptDefinition);
      expect(packet.proposals.find(p => p.questionVariantId === s.questionVariantId)).toEqual(input.currentProposal);
      expect(timings.find(t => t.nodeId === s.nodeId)).toEqual(input.timing);
    }
  });

  it("repairs only the intussusception timepoint and excludes gastroschisis from further review", () => {
    const followup = packet.salvageReviewFollowup;
    expect(sha256(readFileSync(new URL(followup.reviewFile, repository), "utf8"))).toBe(followup.reviewFileSha256);
    const r = followup.intussusceptionRevision;
    const c = salvageCases.find(c => c.id === r.caseId)!;
    const n = c.decisionNodes[0]!;
    const old = followup.intussusceptionBefore.proposal.after;
    expect(c.presentation).toContain("an 8-year-old girl, attends with a parent");
    expect(c.presentation).toContain("earlier admission at age 8");
    expect(c.prototypeDemographics).toEqual(old.clinicalCase.prototypeDemographics);
    expect(c.pediatricProfile).toEqual(old.clinicalCase.pediatricProfile);
    expect(c.approvedInstantiationProfiles![0]!.pediatricProfile).toEqual(PEDIATRIC_PROFILE);
    expect(n.currentUpdate).toContain("Recorded hospital note");
    expect(n.currentUpdate).toContain("had received IV fluids");
    expect(n.stem).toContain("was most appropriate");
    expect(n.stem).toContain("recorded admission");
    const { id: _oldNodeId, questionVariantId: _oldQuestionId, currentUpdate: _oldUpdate, stem: _oldTask, ...oldDecision } = old.node;
    const { id: _newNodeId, questionVariantId: _newQuestionId, currentUpdate: _newUpdate, stem: _newTask, ...newDecision } = n;
    expect(newDecision).toEqual(oldDecision);
    expect(n.exhibit).toEqual(old.node.exhibit);
    expect(n.answerChoices).toEqual(old.node.answerChoices);
    expect(n.explanation).toBe(old.node.explanation);
    expect(r.conceptId).toBe(old.question.conceptId);
    expect(r.status).toBe("salvage");
    expect(r.independentReviewState).toBe("pending_salvage_re_review");
    const dropped = packet.salvageProposals.find(s => s.slug === "gastroschisis-domain-intolerance")!;
    expect(dropped.status).toBe("parked");
    expect(dropped.reReviewEligible).toBe(false);
    expect(salvage.some(s => s.nodeId === dropped.nodeId)).toBe(false);
    expect(cases.some(c => c.decisionNodes.some(n => n.id === dropped.nodeId))).toBe(false);
    expect(questions.some(q => q.id === dropped.questionVariantId)).toBe(false);
    expect(parkedSalvage.map(s => s.nodeId)).toEqual([dropped.nodeId]);
    expect(salvageReviewCases.map(c => c.id)).toEqual([r.caseId]);
  });

  it.each(salvageCases.map(c => [c.id, c] as const))
    ("admits the salvage chart with native child art and a parent: %s", (_id, clinicalCase) => {
      const base = createLevelFourRoomsQaContext();
      const context = { ...base, clinicalRelease: { ...preview, cases: salvageCases } };
      const state = createPediatricChartsQaState(base);
      state.encounters = {}; state.pediatricFamilies = {}; state.retailExternalActors = [];
      state.openChartEncounterId = null; state.attendedEncounterId = null;
      const originalLength = ANSWER_CHOICE_TIMING_REGISTRY.length;
      ANSWER_CHOICE_TIMING_REGISTRY.push(...salvageTimings);
      try {
        expect(getClinicalCaseEligibilityIssue(state, clinicalCase, context)).toBeNull();
        const encounterId = "encounter.pediatric-topic.salvage";
        const next = gameReducer(state, { type: "ADMIT_PATIENT", operationId: "pediatric-topic.salvage.admit",
          encounterId, caseId: clinicalCase.id, arrivalClass: "routine", patientDisplayName: clinicalCase.patientDisplayName }, context);
        expect(next.operationReceipts["pediatric-topic.salvage.admit"]?.status).toBe("applied");
        const encounter = next.encounters[encounterId]!;
        expect(encounter.frozenCase.pediatricProfile).toEqual(PEDIATRIC_PROFILE);
        expect(encounter.patientDisplayName).toBe(clinicalCase.patientDisplayName);
        expect(encounter.frozenCase.prototypeDemographics).toEqual(clinicalCase.prototypeDemographics);
        expect(pediatricStillEligibleEntries(clinicalCase.prototypeDemographics!.sexLabel, clinicalCase.prototypeDemographics!.ageYears)
          .some(entry => entry.stillId === encounter.patientAppearance.stillId)).toBe(true);
        const family = next.pediatricFamilies![encounter.pediatricFamilyId!]!;
        const parent = next.retailExternalActors.find(actor => actor.id === family.parentActorId)!;
        expect(parent).toMatchObject({ kind: "companion", linkedEncounterId: encounterId });
        expect(parent.displayName.length).toBeGreaterThan(0);
        expect(parent.location).toEqual(encounter.patientLocation);
        expect(next.serviceOperations).toEqual([]);
      } finally {
        ANSWER_CHOICE_TIMING_REGISTRY.splice(originalLength);
      }
    });
});
