import {topicQuestionAcceptance} from "./question-program-batch6-acceptance-test-support";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getDiagnosticTimingProfileMapping } from "../../balance-config/src/diagnostic-timing";
import ledger from "../../../docs/research/sources-question-topic-pediatric-neck-thoracic-gu-20261111.json";
import { SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";
import { QUESTION_QUALITY_CLINICAL_APPROVALS } from "./question-quality-clinical-approvals-20261102";
import { answerChoiceTimingRegistryEntrySchema, syntheticClinicalCaseSchema, validateSyntheticClinicalRelease } from "./schema";
import { ANSWER_CHOICE_TIMING_REGISTRY } from "./answer-choice-timing";
import { PEDIATRIC_CLINIC_FAMILY_CONTEXTS } from "./index";
import { pediatricStillEligibleEntries } from "../../game-domain/src/characterStillCatalog";
import { pediatricCaseHasCompatibleIdentity } from "../../game-domain/src/pediatric-eligibility";
import { getClinicalCaseEligibilityIssue } from "../../game-domain/src/clinical-case-eligibility";
import { gameReducer } from "../../game-domain/src/reducer";
import { createLevelFourRoomsQaContext } from "../../../tests/fixtures/level-four-rooms";
import { createPediatricChartsQaState } from "../../../tests/fixtures/pediatric-charts";
import {
  PEDIATRIC_NTG_TOPIC_PACKET as packet, PEDIATRIC_NTG_TOPIC_MANIFEST as manifest,
  PEDIATRIC_NTG_TOPIC_PROPOSED_NODES as proposed, PEDIATRIC_NTG_TOPIC_CASE_COMPOSITIONS as compositions,
  PEDIATRIC_NTG_TOPIC_CASES as cases, PEDIATRIC_NTG_TOPIC_QUESTIONS as questions,
  PEDIATRIC_NTG_TOPIC_DECISION_NODES as nodes, PEDIATRIC_NTG_TOPIC_AUTHORING_CONCEPTS as concepts,
  PEDIATRIC_NTG_TOPIC_SOURCES as sources, PEDIATRIC_NTG_TOPIC_CLAIMS as claims,
  PEDIATRIC_NTG_TOPIC_TIMING_ENTRIES as timings, PEDIATRIC_NTG_TOPIC_ORDER_PROPOSALS as orders,
  PEDIATRIC_NTG_TOPIC_SOURCE_LINKS as links, PEDIATRIC_NTG_TOPIC_AUTHOR_CHECKS as checks,
  PEDIATRIC_NTG_TOPIC_FAMILY_CONTEXTS as families, PEDIATRIC_NTG_TOPIC_CASE_REVIEWS as reviews,
  PEDIATRIC_NTG_TOPIC_PREVIEW_RELEASE as preview, PEDIATRIC_NTG_TOPIC_PARKED_ITEMS as parked,
  PEDIATRIC_NTG_TOPIC_SALVAGE_PROPOSALS as salvage, PEDIATRIC_NTG_TOPIC_SALVAGE_CASES as salvageCases,
  PEDIATRIC_NTG_TOPIC_SALVAGE_TIMING_ENTRIES as salvageTimings, PEDIATRIC_NTG_TOPIC_SALVAGE_FAMILY_CONTEXTS as salvageFamilies,
  PEDIATRIC_NTG_TOPIC_OUTSIDE_RECORD_ORDER_PROPOSALS as recordOrders,
} from "./question-topic-pediatric-neck-thoracic-gu-20261111";

const root = new URL("../../../", import.meta.url);
const sha = (value: unknown) => createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(value)).digest("hex");
const followup = packet.independentReviewFollowup;
const input = followup.reviewInput;
const responses = followup.itemResponses;
const header = (c: object) => Object.fromEntries(Object.entries(c).filter(([k]) => !["decisionNodes", "learningSummary"].includes(k)));
const scoredNode = (n: object) => Object.fromEntries(Object.entries(n).filter(([key]) => key !== "terminalDispositions"));

describe("pediatric neck, thoracic and GU independent-review follow-up", () => {
  it("retains the complete original audit and distinguishes current coverage from first-batch counts", () => {
    expect(packet.audit.map(a => a.recordId).sort()).toEqual(packet.assigned.inventory.map(a => a.recordId).sort());
    expect(new Set(packet.audit.flatMap(a => a.variantIds)).size).toBe(24);
    expect(packet.audit.every(a => ["Keep", "Rewrite", "Retire-and-replace"].includes(a.verdict) && a.reasons.length >= 3)).toBe(true);
    expect(packet.initialAuthoringCounts).toMatchObject({ audited: 24, kept: 1, rewritten: 5,
      retiredAndReplacedProposed: 18, new: 15, proposedDraftVariants: 20, proposedCases: 15, multipartCases: 5 });
    expect(packet.counts).toMatchObject({ audited: 24, kept: 1, rewritten: 5, retiredAndReplacedProposed: 18,
      proposedDraftVariants: 13, proposedCases: 13, multipartCases: 0, new: 10, newGapNodes: 9,
      newReplacementNodes: 1, activeRewriteVersions: 3, reusedStableConcepts: 2, newMeaningConceptVersions: 3 });
    for (const a of packet.audit) {
      for (const id of a.replacementQuestionVariantIds) expect(questions.some(q => q.id === id)).toBe(true);
      if (a.followupCoverage.some(r => r.status === "parked")) expect(a.followupLimitation).toContain("coverage gap");
    }
    expect(packet.conceptHistory).toHaveLength(9);
    expect(packet.before.filter(b => b.sourceCase === null).map(b => b.recordId)).toEqual(["inventory.62233f725fbd92f7"]);
  });

  it("pins assigned source inputs and preserves the approved Ethan question, case and finite profile", () => {
    for (const file of packet.assigned.inputHashes) {
      expect(sha(readFileSync(new URL(file.file, root), "utf8")), file.file).toBe(file.sha256);
      expect(file.sha256).toBe(file.planningSha256);
    }
    const before = packet.before.find(b => b.question.id === "question.pediatric-clinic.shrinking-mobile-neck-nodes.v2.r3")!;
    expect(before.question.reviewStatus).toBe("clinically_approved");
    expect(sha(before.question)).toBe(before.beforeQuestionSha256);
    expect(sha(before.sourceCase)).toBe(before.beforeCaseSha256);
    const live = SYNTHETIC_CLINICAL_RELEASE.cases.find(c => c.id === before.sourceCase!.id)!;
    expect(live).toEqual(before.sourceCase);
    expect(live.decisionNodes.find(n => n.questionVariantId === before.question.id)).toEqual(before.node);
    expect(packet.audit.find(a => a.variantIds.includes(before.question.id))!.verdict).toBe("Keep");
    const approval = QUESTION_QUALITY_CLINICAL_APPROVALS.find(a => a.auditId === "A38")!;
    expect(before.question.lastClinicianReview).toEqual({ reviewer: approval.reviewer, reviewedOn: approval.reviewedOn, contentVersion: approval.contentVersion });
    expect(packet.assigned.frozenReferences).toHaveLength(1);
    const ref = packet.assigned.frozenReferences[0]!;
    expect(ref).toMatchObject({ independentPass: null, recordedProjectionSha256: "6c3799efe7686929bd0961f6b8822b38b53073fcc78372501e4aa65b511a0922" });
    expect(sha(readFileSync(new URL(ref.recordedDecisionDocument, root), "utf8"))).toBe(ref.recordedDecisionSha256);
  });

  it("retains prior editorial decisions and every supplied unkeyed/withheld hold", () => {
    for (const r of packet.priorReview) {
      expect(sha(readFileSync(new URL(r.file, root), "utf8"))).toBe(r.sha256);
      expect(r.exactReview).toMatchObject({ verdict: "REVISE", difficulty: "easy", twoStep: false });
    }
    expect(packet.heldPlanning.map(h => h.recordId).sort()).toEqual([
      "n4-slot-P03", "conflict.pediatric-clinic.high-retractile-terminology", "withheld.pediatric-clinic.varicocele",
      "withheld.pediatric-clinic.hydrocele", "withheld.pediatric-clinic.pectus-outcomes", "withheld.pediatric-clinic.test-procedure-flows",
    ].sort());
    expect(packet.heldPlanning.every(h => !packet.audit.some(a => a.recordId === h.recordId))).toBe(true);
    expect(packet.ownerApprovalsNeeded.some(a => a.heldIds?.some(id => id === "n4-slot-P03"))).toBe(true);
    expect(packet.registryOnlyIdentities).toEqual([]);
    expect(packet.assigned.recordedHolds).toEqual([]);
  });

  it("binds all twenty follow-up dispositions to the immutable independent review", () => {
    const reviewText = readFileSync(new URL(followup.reviewFile, root), "utf8");
    expect(sha(reviewText)).toBe(followup.reviewSha256);
    expect(JSON.parse(reviewText)).toEqual(followup.review);
    expect(input.proposals).toHaveLength(20);
    expect(followup.counts).toMatchObject({ reviewed: 20, inputPass: 7, inputRevise: 13, inputFail: 0,
      passPreserved: 7, revised: 6, parked: 7, activeNodes: 13, activeCases: 12, newQuestionsBeyondReviewedBatch: 0 });
    expect(responses.map(r => r.reviewedQuestionVariantId)).toEqual(followup.review.map(r => r.id));
    for (const old of input.proposals) expect(sha(old.after)).toBe(old.afterSha256);
    for (const r of responses) {
      const review = followup.review.find(x => x.id === r.reviewedQuestionVariantId)!;
      expect(r.reviewIssues).toEqual({ clarityIssues: review.clarityIssues, cues: review.cues, fairness: review.fairness, suggestions: review.suggestions });
      expect(r.issueDispositions.length).toBe(review.clarityIssues.length + review.cues.length + review.fairness.length + review.suggestions.length);
      expect(["pass-preserved", "revised", "parked"]).toContain(r.status);
      expect(r.revisionAttempts).toBe(review.verdict === "PASS" ? 0 : 1);
    }
  });

  it("preserves scored content while changing wrappers and one split-companion terminal contract", () => {
    expect(packet.salvage.before.proposals).toHaveLength(13);
    for (const before of packet.salvage.before.proposals) {
      const current = packet.proposals.find(pr => pr.questionVariantId === before.questionVariantId)!;
      expect(current.after.question).toEqual(before.after.question);
      if (current.after.currentNode.id === packet.salvage.compositionRepair.nodeId) {
        expect(scoredNode(current.after.currentNode)).toEqual(scoredNode(before.after.currentNode));
      } else expect(current.after.currentNode).toEqual(before.after.currentNode);
    }
    const preserved = responses.filter(r => r.status === "pass-preserved");
    expect(preserved).toHaveLength(7);
    for (const r of preserved) {
      const old = input.proposals.find(x => x.questionVariantId === r.reviewedQuestionVariantId)!.after;
      const current = packet.proposals.find(x => x.questionVariantId === r.currentQuestionVariantId)!.after;
      expect(sha(current.question)).toBe(r.preservedQuestionSha256);
      if (current.currentNode.id !== packet.salvage.compositionRepair.nodeId) {
        expect(sha(current.currentNode)).toBe(r.preservedNodeSha256);
      }
      expect(current.question).toEqual(old.question);
      expect(scoredNode(current.currentNode)).toEqual(scoredNode(old.currentNode));
    }
    for (const s of salvage) {
      const current = packet.proposals.find(pr => pr.questionVariantId === s.questionVariantId)!.after;
      expect(current.currentNode).toEqual(s.before.node);
      expect(current.question).toEqual(s.before.question);
      expect(sha(current.currentNode)).toBe(s.exactBeforeNodeSha256);
      expect(sha(current.question)).toBe(s.exactBeforeQuestionSha256);
      expect(sha(current.clinicalCase)).toBe(s.exactAfterCaseSha256);
    }
  });

  it("retains exact before references and keeps revised v2 questions pending re-review", () => {
    const revised = responses.filter(r => r.status === "revised");
    expect(revised).toHaveLength(6);
    for (const r of revised) {
      const old = input.proposals.find(x => x.questionVariantId === r.reviewedQuestionVariantId)!;
      const proposal = packet.proposals.find(x => x.questionVariantId === r.currentQuestionVariantId)!;
      expect(r.independentEditorialStatus).toBe("pending_re_review");
      expect(proposal.questionVariantId).toMatch(/\.v2$/);
      expect(proposal.contentVersion).toBe("clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v2");
      expect(proposal.before).toHaveLength(1);
      expect(proposal.before[0]!.question).toEqual(old.after.question);
      expect(proposal.before[0]!.node).toEqual(old.after.currentNode);
      expect(proposal.before[0]!.sourceCase).toEqual(old.after.clinicalCase);
      expect(sha(proposal.before[0]!.question)).toBe(proposal.before[0]!.beforeQuestionSha256);
      const c = cases.find(c => c.decisionNodes.some(n => n.questionVariantId === r.currentQuestionVariantId))!;
      expect(c.decisionNodes).toHaveLength(1);
      expect(r.decidingObservation).toBeTruthy();
      expect(r.counterfactual).toBeTruthy();
    }
  });

  it("excludes every parked item and unkeyed attempt from executable supply", () => {
    expect(parked).toHaveLength(7);
    for (const r of parked) {
      expect(r.currentQuestionVariantId).toBeNull();
      expect(r.currentNodeId).toBeNull();
      expect(r.parkReason!.length).toBeGreaterThan(100);
      expect(r.attemptedRevision).toMatchObject({ keyChoiceId: null, executable: false });
      expect(r.attemptedRevision!.candidatePlans.length).toBeGreaterThanOrEqual(3);
      expect(r.attemptedRevision!.candidatePlans.length).toBeLessThanOrEqual(4);
      expect(r.nextAction).toBeTruthy();
      expect(questions.some(q => q.id === r.reviewedQuestionVariantId)).toBe(false);
      expect(nodes.some(n => n.id === r.reviewedNodeId)).toBe(false);
      expect(input.proposals.some(p => p.questionVariantId === r.reviewedQuestionVariantId)).toBe(true);
    }
    expect(questions.some(q => followup.review.some(r => r.verdict !== "PASS" && r.id === q.id))).toBe(false);
  });

  it("loads thirteen active nodes through normal imports and validates actual release structures", () => {
    expect(validateSyntheticClinicalRelease(preview)).toEqual(preview);
    expect(cases).toHaveLength(13); expect(nodes).toHaveLength(13); expect(questions).toHaveLength(13);
    expect(new Set(questions.map(q => q.id)).size).toBe(13);
    expect(new Set(concepts.map(c => c.id)).size).toBe(13);
    expect(packet.nodes).toEqual(proposed); expect(packet.cases).toEqual(compositions);
    expect(packet.concepts).toEqual(concepts);
    expect(nodes.every(n => n.shuffleAnswers && n.showServicePreviews)).toBe(true);
    expect(nodes.every(n => n.answerChoices.length >= 3 && n.answerChoices.length <= 4)).toBe(true);
    expect(nodes.every(n => n.answerChoices.filter(c => c.isCorrect).length === 1)).toBe(true);
    expect(packet.reviewOrderNotice).toBe("key shown first for review only");
    expect(manifest).toMatchObject({ status: "salvage", salvageNodes: 6, salvageCases: 6,
      independentPass: false, managerAccepted: false, clinicalApproval: false });
  });

  it("keeps clinical review and FSRS identity chains distinct from editorial PASS", () => {
    for (const q of questions) expect(q).toMatchObject({ reviewStatus: "needs_clinician_review", aiAssistedDrafting: true, lastClinicianReview: null });
    for (const c of concepts) expect(c).toMatchObject({ reviewStatus: "needs_clinician_review", lastClinicianReview: null });
    expect(concepts.filter(c => c.identityDisposition === "reuse_unchanged_objective").map(c => c.id).sort()).toEqual([
      "concept.thyroglossal-duct-cyst.ultrasound", "concept.pediatric-clinic.pectus-carinatum-brace-assessment",
    ].sort());
    const previousIds = new Set([...packet.assigned.concepts.map(c => c.conceptId), ...input.concepts.map(c => c.id)]);
    for (const c of concepts.filter(c => c.identityDisposition === "new_meaning_version")) {
      expect(c.id).not.toBe(c.previousConceptId);
      expect(previousIds.has(c.previousConceptId!)).toBe(true);
      expect(c.changedObjective).toBeTruthy(); expect(c.clinicalReason).toContain("old history must remain separate");
    }
  });

  it("pins each active proposal to its exact runtime objects and author gate", () => {
    for (const proposal of packet.proposals) {
      const n = nodes.find(n => n.questionVariantId === proposal.questionVariantId)!;
      const c = cases.find(c => c.decisionNodes.some(n => n.questionVariantId === proposal.questionVariantId))!;
      const q = questions.find(q => q.id === proposal.questionVariantId)!;
      expect(proposal.after).toEqual({ clinicalCase: c, currentNode: n, question: q });
      expect(sha(proposal.after)).toBe(proposal.afterSha256);
      const authored = proposed.find(n => n.questionVariantId === proposal.questionVariantId)!;
      expect(proposal.before.map(b => b.question.id)).toEqual(authored.beforeVariantIds);
      expect(proposal.manualGateForExactAfter).toEqual(authored.authorGate);
    }
  });

  it("gives every testing alternative an existing timing profile by exact identity and label", () => {
    expect(timings).toHaveLength(13); expect(orders).toHaveLength(8);
    expect(input.orderProposals).toHaveLength(35);
    for (const timing of timings) {
      answerChoiceTimingRegistryEntrySchema.parse(timing);
      const n = proposed.find(n => n.id === timing.nodeId)!;
      if (timing.classification.kind === "test_choices") {
        expect(timing.classification.choices.map(c => c.choiceId)).toEqual(n.choices.map(c => c.id));
        for (const ch of n.choices) {
          const classified = timing.classification.choices.find(c => c.choiceId === ch.id)!;
          expect(classified.choiceLabel).toBe(ch.label);
          if (ch.timingProfileId) {
            expect(classified.timing).toEqual({ kind: "test", timingProfileId: ch.timingProfileId });
            expect(getDiagnosticTimingProfileMapping(ch.timingProfileId), ch.id).toBeDefined();
            expect(orders.find(o => o.answerChoiceId === ch.id)).toMatchObject({
              caseId: timing.caseId, nodeId: n.id, questionVariantId: n.questionVariantId,
              answerChoiceLabel: ch.label, timingProfileId: ch.timingProfileId,
            });
          } else expect(classified.timing).toEqual({ kind: "no_test" });
        }
      } else expect(n.choices.every(c => c.timingProfileId === null)).toBe(true);
    }
    expect(nodes.every(n => n.resultGateAfter === null && n.answerChoices.every(c => c.serviceRequest === null))).toBe(true);
    expect(orders.every(o => o.execution === "planning_only_no_service_request")).toBe(true);
  });

  it("keeps hospital records in clinic and child visits within existing finite profiles", () => {
    for (const c of cases) {
      expect(c.requiredClinicalSetting).toBe("clinic");
      expect(c.tutorialEligible).toBe(false);
      expect(c.approvedInstantiationProfiles).toHaveLength(1);
      expect(c.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(c.prototypeDemographics);
      expect(c.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      const review = reviews.find(r => r.caseId === c.id)!;
      expect(review).toMatchObject({ educationalTier: 1, earliestFacilityStage: 4, requiredClinicalSetting: "clinic" });
      if (c.pediatricProfile) {
        const family = families.find(f => f.caseId === c.id)!;
        expect(family.childStillId).toMatch(/^level3-roster-v2\./);
        expect(family.parentName).toBeTruthy(); expect(family.parentPlacement).toBe("same_room_throughout");
        expect(c.prototypeDemographics!.ageYears).toBeGreaterThanOrEqual(5);
        expect(c.prototypeDemographics!.ageYears).toBeLessThanOrEqual(17);
      }
    }
    const neonatal = salvageCases.find(c => c.id.endsWith(".cdh-physiologic-readiness-salvage.v1"))!;
    expect(neonatal.prototypeDemographics).toEqual({ ageYears: 6, sexLabel: "Female" });
    expect(neonatal.pediatricProfile).toEqual({ version: "pediatric-patient-profile.v1", requiresParent: true, clinicalScope: "outpatient" });
    expect(neonatal.presentation).toContain("4-day-old");
    expect(reviews.find(r => r.caseId === neonatal.id)!.presentationMode).toBe("outside_records_in_clinic");
    expect(neonatal.presentation).toContain("outside neonatal ICU records");
  });

  it("splits the two PASS companions into self-contained salvage cases", () => {
    expect(cases.every(c => c.decisionNodes.length === 1)).toBe(true);
    expect(salvageCases).toHaveLength(6);
    for (const s of salvage) {
      const c = salvageCases.find(c => c.id === s.caseId)!;
      expect(c.decisionNodes).toEqual([s.before.node]);
      expect(c.learningSummary).toBe(s.before.node.explanation);
      expect(c.decisionNodes[0]!.terminalDispositions).toHaveLength(c.decisionNodes[0]!.answerChoices.length - 1);
      expect(c.id).not.toBe(s.sourceCaseId);
      for (const id of s.excludedCompanionNodeIds) expect(c.decisionNodes.some(n => n.id === id)).toBe(false);
    }
    expect(salvage.find(s => s.slug === "negative-exploration")!.excludedCompanionNodeIds)
      .toEqual(["node.pediatric-neck-thoracic-gu.20261111.scrotum-doppler"]);
    expect(salvage.find(s => s.slug === "mediastinal-biopsy")!.excludedCompanionNodeIds)
      .toEqual(["node.pediatric-neck-thoracic-gu.20261111.neck-target"]);
    expect(salvageCases.flatMap(c => c.decisionNodes).some(n => /scrotum-doppler|neck-target/.test(n.id))).toBe(false);
  });

  it("maps all current fields and historical claims with reciprocal permitted-source records", () => {
    expect(sources).toHaveLength(21); expect(claims).toHaveLength(52);
    expect(ledger.statementMappings).toHaveLength(13); expect(ledger.initialStatementMappings).toHaveLength(20);
    expect(ledger.followupResearch.newSourceIds).toHaveLength(2);
    expect(ledger.followupResearch.newClaimIds).toHaveLength(10);
    const sourceIds = new Set(sources.map(s => s.id)), claimIds = new Set(claims.map(c => c.id));
    for (const s of sources) {
      expect(s.completeCitation.length).toBeGreaterThan(30); expect(s.authors.length).toBeGreaterThan(0);
      expect(s.authorityAssessment.length).toBeGreaterThan(30); expect(s.licenseLabel.length).toBeGreaterThan(5);
      expect(s).toMatchObject({ accessedOn: "2026-11-11", reviewStatus: "needs_clinician_review" });
      for (const id of s.evidenceClaimIds) expect(claims.find(c => c.id === id)!.sourceIds).toContain(s.id);
    }
    for (const c of claims) {
      c.sourceIds.forEach(id => expect(sourceIds.has(id)).toBe(true));
      expect(c).toMatchObject({ reviewStatus: "needs_clinician_review", lastCheckedOn: "2026-11-11", lastClinicianReview: null });
      expect(ledger.claimToQuestionMappings.find(m => m.claimId === c.id)!.questionVariantIds)
        .toEqual(proposed.filter(n => n.evidenceClaimIds.includes(c.id)).map(n => n.questionVariantId));
    }
    for (const n of proposed) {
      const map = ledger.statementMappings.find(m => m.questionVariantId === n.questionVariantId)!;
      expect(map.evidenceClaimIds).toEqual(n.evidenceClaimIds);
      n.evidenceClaimIds.forEach(id => expect(claimIds.has(id)).toBe(true));
      expect(map.fields.currentUpdate.value).toBe(n.currentUpdate); expect(map.fields.task.value).toBe(n.task);
      expect(map.fields.exhibit.value).toEqual(n.exhibit); expect(map.fields.explanation.value).toBe(n.explanation);
      expect(map.fields.choices.map(c => c.answerChoiceId)).toEqual(n.choices.map(c => c.id));
    }
    expect(links.every(l => l.target === "_blank" && l.rel === "noopener noreferrer" && l.referrerPolicy === "no-referrer")).toBe(true);
    expect(packet.statementMappings).toEqual(ledger.statementMappings);
  });

  it("records concrete reasoning boundaries while making no author-generated PASS assertion", () => {
    expect(checks).toHaveLength(13);
    for (const n of proposed) {
      expect(n.reasoningSteps).toHaveLength(2);
      expect(n.closestCredibleError.length).toBeGreaterThan(30);
      expect(n.decidingObservation.length).toBeGreaterThan(30);
      expect(n.counterfactual.length).toBeGreaterThan(60);
      for (const value of Object.values(n.authorGate)) expect(typeof value === "string" && value.length > 40).toBe(true);
      for (const choice of n.choices) {
        expect(choice.rationale.length).toBeGreaterThan(40);
        expect(choice.counterfactual.length).toBeGreaterThan(40);
      }
    }
    expect(packet.rankedConcepts).toHaveLength(22); expect(packet.gapMatrix).toHaveLength(22);
    expect(packet.integrationDependencies.some(d => d.action.includes("No selector"))).toBe(true);
    const liveIds = new Set(SYNTHETIC_CLINICAL_RELEASE.cases.flatMap(c => c.decisionNodes.map(n => n.questionVariantId)));
    for (const question of questions) expect(liveIds.has(question.id)).toBe(topicQuestionAcceptance(question.id).live);
  });
  it("binds six salvage identities to the latest independent PASS and preserves clinical sources", () => {
    expect(sha(readFileSync(new URL(packet.salvage.independentPassFile, root), "utf8"))).toBe(packet.salvage.independentPassFileSha256);
    expect(sha(readFileSync(new URL(packet.salvage.managerReference, root), "utf8"))).toBe(packet.salvage.managerReferenceSha256);
    expect(salvage).toHaveLength(6);
    expect(salvage.map(s => s.nodeId).sort()).toEqual(packet.salvage.latestReview.filter(r => r.verdict === "PASS").map(r => r.nodeId).sort());
    expect(sha(ledger.sources)).toBe(packet.salvage.sourceRecordsSha256);
    expect(sha(ledger.claims)).toBe(packet.salvage.evidenceClaimsSha256);
    for (const s of salvage) {
      expect(s.status).toBe("salvage");
      expect(s.independentPassRecord).toMatchObject({ verdict: "PASS", difficulty: "moderate", twoStep: true });
      expect(s).toMatchObject({ clinicalWordingChanged: false, questionVersionChanged: false, conceptVersionChanged: false, clinicalApproval: false });
      expect(s.exactAfterNodeSha256).toBe(s.exactBeforeNodeSha256);
      expect(s.exactAfterQuestionSha256).toBe(s.exactBeforeQuestionSha256);
    }
  });

  it("keeps outside-record testing metadata historical and all six runtime plans no_test", () => {
    expect(salvageTimings).toHaveLength(6);
    expect(salvageTimings.every(t => t.classification.kind === "no_test")).toBe(true);
    expect(recordOrders).toHaveLength(9);
    expect(recordOrders).toEqual(salvage.flatMap(s => s.before.orders));
    expect(orders.every(o => !salvage.some(s => s.nodeId === o.nodeId))).toBe(true);
    for (const s of salvage) {
      const c = salvageCases.find(c => c.id === s.caseId)!;
      expect(c.pediatricProfile).toEqual({ version: "pediatric-patient-profile.v1", requiresParent: true, clinicalScope: "outpatient" });
      expect(c.approvedInstantiationProfiles).toHaveLength(1);
      expect(c.approvedInstantiationProfiles![0]!).toMatchObject({
        id: s.profileId, pediatricProfile: c.pediatricProfile, prototypeDemographics: s.clinicDemographics,
      });
      expect(pediatricCaseHasCompatibleIdentity(c)).toBe(true);
      expect(pediatricStillEligibleEntries(s.clinicDemographics.sexLabel as "Female" | "Male", s.clinicDemographics.ageYears)
        .some(entry => entry.stillId === s.childStillId)).toBe(true);
      expect(c.presentation).toContain(s.parentName);
      if (s.slug === "cdh-physiologic-readiness") {
        expect(s.recordDemographics).toEqual({ ageYears: 0, sexLabel: "Female" });
        expect(s.recordAgeText).toBe("4-day-old");
        expect(c.prototypeDemographics).toEqual({ ageYears: 6, sexLabel: "Female" });
        expect(c.presentation).toContain("All questions concern that recorded ICU care");
      }
    }
  });

  it.each(salvageCases.map(c => [c.id, c] as const))
    ("admits the exact child and parent without enacting tests: %s", (_caseId, clinicalCase) => {
      const base = createLevelFourRoomsQaContext();
      const context = { ...base, clinicalRelease: { ...preview, cases: salvageCases } };
      const state = createPediatricChartsQaState(base);
      state.encounters = {}; state.pediatricFamilies = {}; state.retailExternalActors = [];
      state.openChartEncounterId = null; state.attendedEncounterId = null;
      const timingLength = ANSWER_CHOICE_TIMING_REGISTRY.length;
      const familyRegistry = PEDIATRIC_CLINIC_FAMILY_CONTEXTS as unknown as Array<(typeof salvageFamilies)[number]>;
      const familyLength = familyRegistry.length;
      // QA-only registration models the exact manager integration proposals.
      // These mutations are in memory and are always restored; no shared file is edited.
      ANSWER_CHOICE_TIMING_REGISTRY.push(...salvage.map(s => answerChoiceTimingRegistryEntrySchema.parse(s.before.timing)), ...salvageTimings);
      familyRegistry.push(...salvageFamilies);
      try {
        const s = salvage.find(s => s.caseId === clinicalCase.id)!;
        expect(getClinicalCaseEligibilityIssue(state, syntheticClinicalCaseSchema.parse(s.before.case), context)).not.toBeNull();
        expect(getClinicalCaseEligibilityIssue(state, clinicalCase, context)).toBeNull();
        const encounterId = "encounter.pediatric-neck.salvage";
        const next = gameReducer(state, { type: "ADMIT_PATIENT", operationId: "pediatric-neck.salvage.admit",
          encounterId, caseId: clinicalCase.id, arrivalClass: "routine", patientDisplayName: clinicalCase.patientDisplayName }, context);
        expect(next.operationReceipts["pediatric-neck.salvage.admit"]?.status).toBe("applied");
        const encounter = next.encounters[encounterId]!;
        expect(encounter.frozenCase.pediatricProfile).toEqual(clinicalCase.pediatricProfile);
        expect(encounter.frozenCase.prototypeDemographics).toEqual(s.clinicDemographics);
        expect(encounter.frozenCase.selectedInstantiationProfileId).toBe(s.profileId);
        expect(encounter.patientDisplayName).toBe(clinicalCase.patientDisplayName);
        expect(encounter.patientAppearance.stillId).toBe(s.childStillId);
        const family = next.pediatricFamilies![encounter.pediatricFamilyId!]!;
        const parent = next.retailExternalActors.find(actor => actor.id === family.parentActorId)!;
        expect(parent).toMatchObject({ kind: "companion", displayName: s.parentName, linkedEncounterId: encounterId });
        expect(parent.location).toEqual(encounter.patientLocation);
        expect(next.serviceOperations).toEqual([]);
        expect(encounter.frozenCase.decisionNodes.every(n => n.resultGateAfter === null &&
          n.answerChoices.every(ch => ch.serviceRequest === null))).toBe(true);
      } finally {
        ANSWER_CHOICE_TIMING_REGISTRY.splice(timingLength);
        familyRegistry.splice(familyLength);
      }
    });

});
