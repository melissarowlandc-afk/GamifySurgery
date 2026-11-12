import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getDiagnosticTimingProfileMapping } from "@gamify-surgery/balance-config";
import { syntheticClinicalReleaseSchema, answerChoiceTimingRegistryEntrySchema } from "./schema";
import * as topic from "./question-topic-anal-cancer-20261111";
import packet from "../../../docs/research/question-topic-anal-cancer-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-anal-cancer-20261111.json";
import program from "../../../docs/research/question-topic-program-20261111.json";
import independentReview from "../../../docs/research/question-topic-anal-cancer-review-20261111.json";

const sha = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const rootFile = (path: string) => new URL(`../../../${path}`, import.meta.url);
const question = (slug: string) => topic.ANAL_CANCER_PROPOSALS.find(p => p.slug === slug)!;

describe("anal-cancer explicit-import topic packet", () => {
  it("validates the existing release representation without authorizing admission", () => {
    expect(syntheticClinicalReleaseSchema.safeParse(topic.ANAL_CANCER_PREVIEW_RELEASE).success).toBe(true);
    expect(topic.ANAL_CANCER_CASES).toHaveLength(7);
    expect(topic.ANAL_CANCER_QUESTIONS).toHaveLength(12);
    expect(topic.ANAL_CANCER_MANIFEST).toMatchObject({ pipelinePassed: false, managerAccepted: false,
      clinicalApproval: false, publicReleaseAuthorized: false, reviewStatus: "needs_clinician_review" });
    const source = readFileSync(new URL("./question-topic-anal-cancer-20261111.ts", import.meta.url), "utf8");
    expect(source).not.toMatch(/from ["']\.\/(?:synthetic-content|question-ship-manifest|index)["']/);
    expect(source).not.toMatch(/\b(?:fetch|XMLHttpRequest)\s*\(/);
  });

  it("reconciles every primary inventory/concept/case/node/variant assignment", () => {
    for (const key of ["inventory", "concepts", "caseAssignments", "nodeAssignments", "variantAssignments"] as const) {
      expect(packet.assignment[key]).toEqual(program[key].filter(x => x.primaryTopicSlug === "anal-cancer"));
    }
    expect(packet.audit.map(r => r.recordId).sort()).toEqual(packet.assignment.inventory.map(r => r.recordId).sort());
    expect(new Set(packet.audit.map(r => r.recordId)).size).toBe(14);
    expect(packet.counts).toMatchObject({ kept: 4, rewritten: 3, retiredAndReplacedProposed: 7, new: 9,
      proposedQuestions: 12, newMeanings: 7, reusedConcepts: 3, rawAndLiveContextAudits: 26, distinctNodeSerializations: 15 });
  });

  it("records one concrete verdict and exact before references for every audit row", () => {
    const ids = new Set(topic.ANAL_CANCER_QUESTIONS.map(q => q.id));
    for (const row of packet.audit) {
      expect(["Keep", "Rewrite", "Retire-and-replace"]).toContain(row.verdict);
      expect(row.reasons.length).toBeGreaterThanOrEqual(3);
      expect(row.reasons.every(reason => typeof reason === "string" && reason.length > 35)).toBe(true);
      expect(row.beforeQuestionSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(row.sourceFile).toMatch(/packages\/clinical-content\/src\//);
      expect(row.exportLocator.length).toBeGreaterThan(5);
      expect(row.contextAudit.length).toBeGreaterThan(0);
      if (row.verdict !== "Keep") {
        expect(row.replacementQuestionVariantIds.length).toBeGreaterThan(0);
        for (const id of row.replacementQuestionVariantIds) expect(ids.has(id)).toBe(true);
      }
    }
  });

  it("pins the four assigned source files and preserves exact historical approval inputs", () => {
    const files = new Set(packet.assignment.inventory.map(r => r.fileLocation.file));
    expect(files.size).toBe(4);
    for (const file of files) {
      const input = packet.baseline.sourceInputs.find(r => r.file === file)!;
      const actual = createHash("sha256").update(readFileSync(rootFile(file))).digest("hex");
      expect(actual, file).toBe(input.currentSha256);
      expect(input.currentSha256).toBe(input.programSha256);
    }
    for (const before of packet.before) {
      expect(sha(before.question)).toBe(before.questionSha256);
      for (const context of before.contexts) {
        expect(sha(context.case)).toBe(context.caseSha256);
        expect(sha(context.node)).toBe(context.nodeSha256);
      }
    }
    const approval = packet.assignment.clinicalApprovalReferences[0]!;
    expect(approval.id).toBe("approval.melissa-rowland-md.owner-row-109.2026-08-31");
    expect(approval.approvedQuestionVariantIds).toHaveLength(4);
    expect(packet.assignment.frozenIndependentPassReferences).toEqual([]);
    const sibling = packet.before.find(b => b.question.id === "question.anal-hsil.hpv.3b.v1")!;
    expect(sibling.contexts[0]!.nodeSha256).not.toBe(sibling.contexts[1]!.nodeSha256);
  });

  it("keeps all new records in clinician-review state and separates old approvals", () => {
    for (const r of [...topic.ANAL_CANCER_QUESTIONS, ...topic.ANAL_CANCER_CONCEPT_PROPOSALS,
      ...topic.ANAL_CANCER_CLAIMS, ...topic.ANAL_CANCER_SOURCES, ...topic.ANAL_CANCER_CASE_REVIEWS]) {
      expect(r.reviewStatus).toBe("needs_clinician_review");
      expect(r.lastClinicianReview).toBeNull();
    }
    for (const row of packet.audit.filter(r => r.verdict === "Keep")) {
      expect(row.clinicalApprovalReference).toBe(packet.assignment.clinicalApprovalReferences[0]!.id);
    }
    expect(topic.ANAL_CANCER_QUESTIONS.some(q => packet.assignment.inventory.some(r => r.variantIds.includes(q.id)))).toBe(false);
  });

  it("keeps stable concepts and distinct new meanings separate", () => {
    const concepts = topic.ANAL_CANCER_CONCEPT_PROPOSALS;
    expect(concepts).toHaveLength(10);
    expect(concepts.filter(c => c.conceptRelation === "reuse").map(c => c.id).sort()).toEqual([
      "concept.anal-scc.biopsy-and-staging", "concept.anal-scc.localized-chemoradiation-referral",
      "concept.n3.anal-cancer-distant-staging-versus-local-extent",
    ].sort());
    expect(concepts.filter(c => c.conceptRelation === "new_meaning")).toHaveLength(7);
    expect(question("sample-provenance").conceptId).toBe(question("new-nodule-after-hsil").conceptId);
    for (const c of topic.ANAL_CANCER_CASES) {
      expect(new Set(c.decisionNodes.map(n => n.primaryConceptId)).size).toBe(c.decisionNodes.length);
    }
    for (const c of concepts.filter(c => c.conceptRelation === "new_meaning")) {
      expect(c.previousConceptId).toBeTruthy();
      expect(c.id).not.toBe(c.previousConceptId);
    }
  });

  it("uses named finite clinic frames with consistent demographics and separated complete tasks", () => {
    for (const c of topic.ANAL_CANCER_CASES) {
      expect(c.requiredClinicalSetting).toBe("clinic");
      expect(c.requiredCapabilityIds).toEqual([]);
      expect(c.patientDisplayName.split(" ").length).toBeGreaterThan(1);
      expect(c.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(c.presentation).toContain("{patientName}");
      expect(c.presentation).toContain(`${c.prototypeDemographics!.ageYears}-year-old`);
      expect(c.approvedInstantiationProfiles).toHaveLength(1);
      expect(c.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(c.prototypeDemographics);
      for (const n of c.decisionNodes) {
        expect(n.stem).toContain("{patientName}");
        expect(n.shuffleAnswers).toBe(true);
        expect(n.answerChoices).toHaveLength(3);
        expect(n.answerChoices.filter(a => a.isCorrect)).toHaveLength(1);
        expect(n.resultGateAfter).toBeNull();
        expect(n.answerChoices.every(a => a.serviceRequest === null)).toBe(true);
      }
    }
    expect(topic.ANAL_CANCER_CASE_REVIEWS.every(r => r.educationalTier === 2 && r.patientAcuity === "stable" && r.facilityProgressionLevel === 3)).toBe(true);
  });

  it("maps every testing choice by exact identity and label to an existing placeholder profile", () => {
    expect(topic.ANAL_CANCER_TIMING_PROPOSALS).toHaveLength(12);
    expect(topic.ANAL_CANCER_ORDER_PROPOSALS).toHaveLength(18);
    for (const entry of topic.ANAL_CANCER_TIMING_PROPOSALS) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(entry).success).toBe(true);
      const p = topic.ANAL_CANCER_PROPOSALS.find(p => p.questionVariantId === entry.questionVariantId)!;
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices).toHaveLength(p.choices.length);
        for (const timing of entry.classification.choices) {
          const c = p.choices.find(c => c.id === timing.choiceId)!;
          expect(c.label).toBe(timing.choiceLabel);
          if (timing.timing.kind === "test") {
            expect(timing.timing.timingProfileId).toBe(c.timingProfileId);
            expect(getDiagnosticTimingProfileMapping(timing.timing.timingProfileId)).toBeDefined();
          } else expect(c.timingProfileId).toBeNull();
        }
      } else expect(p.choices.every(c => c.timingProfileId === null)).toBe(true);
    }
    for (const order of topic.ANAL_CANCER_ORDER_PROPOSALS) {
      expect(order.disposition).toEqual({ kind: "not_executed", reason: "future_planned" });
      expect(order.serviceRequest).toBeNull();
      expect(order.resultGateAfter).toBeNull();
    }
  });

  it("retains complete source records, rights decisions and safe external links", () => {
    expect(ledger.sources).toHaveLength(11);
    expect(ledger.claims).toHaveLength(29);
    expect(ledger.excludedSources.length).toBeGreaterThanOrEqual(4);
    for (const s of ledger.sources) {
      for (const key of ["id", "title", "completeCitation", "organizationOrJournal", "officialUrl", "accessedOn",
        "sourceClass", "licenseLabel", "reuseStatus", "reuseNotes", "authorityAssessment", "usageRole"] as const) expect(s[key]).toBeTruthy();
      expect(s.authors.length).toBeGreaterThan(0);
      expect(s.publicationYear).toBeGreaterThan(2000);
      expect(s.rightsCheck.finding.length).toBeGreaterThan(50);
      expect(s.evidenceClaimIds).toEqual(ledger.claims.filter(c => c.sourceIds.includes(s.id)).map(c => c.id));
    }
    for (const link of topic.ANAL_CANCER_SOURCE_LINKS) expect(link).toMatchObject({
      target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer",
    });
  });

  it("closes source-to-claim-to-question and field assertion mappings", () => {
    const claims = new Map(ledger.claims.map(c => [c.id, c]));
    const sources = new Set(ledger.sources.map(s => s.id));
    for (const c of ledger.claims) {
      expect(c.statement).toBeTruthy(); expect(c.lastCheckedOn).toBe("2026-11-11");
      expect(c.limitation).toBeTruthy();
      for (const id of c.sourceIds) expect(sources.has(id)).toBe(true);
    }
    for (const p of topic.ANAL_CANCER_PROPOSALS) {
      for (const id of p.supportingEvidenceClaimIds) {
        expect(claims.has(id)).toBe(true);
        expect(claims.get(id)!.questionVariantIds).toContain(p.questionVariantId);
      }
      for (const c of p.choices) {
        expect(c.temptation.length).toBeGreaterThan(20);
        expect(c.counterfactual.length).toBeGreaterThan(30);
        for (const id of c.evidenceClaimIds) expect(claims.has(id)).toBe(true);
      }
    }
    for (const mapping of topic.ANAL_CANCER_STATEMENT_MAPPINGS) {
      expect(mapping.assertions).toHaveLength(8);
      for (const assertion of mapping.assertions) for (const id of assertion.claimIds) expect(claims.has(id)).toBe(true);
    }
  });

  it("records twelve concrete author attacks without claiming independent success", () => {
    expect(topic.ANAL_CANCER_AUTHOR_CHECKS).toHaveLength(12);
    for (const gate of topic.ANAL_CANCER_AUTHOR_CHECKS) {
      for (const key of ["coverTheKey", "sameDecisionStageAndCategory", "closestError", "decidingObservation", "consequence",
        "residentDifficulty", "singleDefensibleBestAnswer", "counterfactual", "sequenceReview", "repairAndRecheck"] as const) {
        expect(gate[key].length, `${gate.questionVariantId}: ${key}`).toBeGreaterThan(30);
      }
      expect(gate.reasoningSteps).toHaveLength(2);
      expect(gate.deletionTest.length).toBeGreaterThanOrEqual(3);
      expect(gate.reviewStatus).toBe("needs_clinician_review");
    }
  });

  it("preserves unkeyed owner/evidence holds without emitting a scored version", () => {
    expect(packet.heldPlanningDispositions).toHaveLength(2);
    for (const h of packet.heldPlanningDispositions) {
      expect(h.questionVariantId).toBeNull();
      expect(h.isCorrect).toBeNull();
      expect(h.nextAction).toBeTruthy();
    }
    expect(packet.heldPlanningDispositions[0]!.inheritedHoldId).toBe("review.n3.anal-cancer-distant-staging-versus-local-extent.v2");
    expect(topic.ANAL_CANCER_PROPOSALS.some(p => /eight-weeks|early-response/.test(p.slug))).toBe(false);
    expect(packet["Owner approvals needed"][0]!.holdId).toBe("review.n3.anal-cancer-distant-staging-versus-local-extent.v2");
  });

  it("pins authored exact output and JSON packet copies", () => {
    expect(packet.proposals).toHaveLength(12);
    expect(packet.runtimeSnapshots.cases).toEqual(topic.ANAL_CANCER_CASES);
    expect(packet.runtimeSnapshots.questions).toEqual(topic.ANAL_CANCER_QUESTIONS);
    for (const p of packet.proposals) {
      expect(p.exactQuestionSha256).toBe(sha(topic.ANAL_CANCER_QUESTIONS.find(q => q.id === p.questionVariantId)));
      expect(p.exactNodeSha256).toBe(sha(topic.ANAL_CANCER_NODES.find(n => n.id === p.nodeId)));
      const actual = topic.ANAL_CANCER_PROPOSALS.find(n => n.questionVariantId === p.questionVariantId)!;
      expect(p.manualAuthorGate).toEqual(actual.manualAuthorGate);
      if (p.creationKind === "new") expect(p.before).toBeNull();
      else expect(p.beforeRecords).toHaveLength(1);
    }
  });

  it("avoids answer rehearsal in the constructed multi-part sequences", () => {
    expect(question("sample-provenance").explanation).not.toMatch(/inguinal|mitomycin|chemoradiation/i);
    expect(question("local-staging-record").explanation).not.toMatch(/inguinal|mitomycin|chemoradiation/i);
    expect(question("cytology-to-histology").explanation).not.toMatch(/electrocautery|ablation/i);
    expect(question("confirm-local-recurrence").explanation).not.toMatch(/abdominoperineal|\bAPR\b/);
    const favorable = question("clear-margin-observation"), adverse = question("adverse-margin-histology");
    expect(favorable.choices.map(c => c.label)).toEqual(adverse.choices.map(c => c.label));
    expect(favorable.choices.find(c => c.isCorrect)!.label).not.toBe(adverse.choices.find(c => c.isCorrect)!.label);
    expect(favorable.conceptId).toBe(adverse.conceptId);
    expect(favorable.caseId).not.toBe(adverse.caseId);
  });
});

describe("anal-cancer independent-review response", () => {
  const current = topic.ANAL_CANCER_CURRENT_ARTIFACTS;
  const round = packet.reviewRound;
  const scored = (node: (typeof current.cases)[number]["decisionNodes"][number]) => {
    const { terminalDispositions: _routing, ...clinical } = node;
    return clinical;
  };

  it("reconciles every review row with one explicit status and exact decision source", () => {
    expect(createHash("sha256").update(readFileSync(rootFile(round.reviewFile))).digest("hex")).toBe(round.reviewFileSha256);
    expect(independentReview).toEqual(round.reviewRows);
    expect(topic.ANAL_CANCER_ITEM_STATUSES).toHaveLength(12);
    expect(topic.ANAL_CANCER_ITEM_STATUSES.filter(s => s.status === "pass-preserved")).toHaveLength(5);
    expect(topic.ANAL_CANCER_ITEM_STATUSES.filter(s => s.status === "revised")).toHaveLength(5);
    expect(topic.ANAL_CANCER_ITEM_STATUSES.filter(s => s.status === "parked")).toHaveLength(2);
    expect(topic.ANAL_CANCER_ITEM_STATUSES.map(s => s.originalQuestionVariantId).sort()).toEqual(independentReview.map(r => r.id).sort());
    expect(round.issueResponses).toHaveLength(12);
    for (const review of independentReview) {
      const response = round.issueResponses.find(r => r.originalQuestionVariantId === review.id)!;
      expect(response.cues).toHaveLength(review.cues.length);
      expect(response.clarityIssues).toHaveLength(review.clarityIssues.length);
      expect(response.fairnessDisposition.length).toBeGreaterThan(70);
      expect(response.suggestionDisposition.length).toBeGreaterThan(70);
      if (review.verdict === "PASS") expect(response.status).toBe("pass-preserved");
      else expect(["revised", "parked"]).toContain(response.status);
    }
  });

  it("preserves the complete reviewed archive and every PASS question/scored field", () => {
    expect(topic.ANAL_CANCER_QUESTIONS).toEqual(round.baseline.questionSnapshots);
    expect(topic.ANAL_CANCER_CASES).toEqual(round.baseline.caseSnapshots);
    for (const review of independentReview.filter(r => r.verdict === "PASS")) {
      const originalQuestion = round.baseline.questionSnapshots.find(q => q.id === review.id)!;
      const currentQuestion = current.questions.find(q => q.id === review.id)!;
      expect(currentQuestion).toEqual(originalQuestion);
      const originalCase = topic.ANAL_CANCER_CASES.find(c => c.decisionNodes.some(n => n.questionVariantId === review.id))!;
      const originalNode = originalCase.decisionNodes.find(n => n.questionVariantId === review.id)!;
      const currentCase = current.cases.find(c => c.decisionNodes.some(n => n.questionVariantId === review.id))!;
      const currentNode = currentCase.decisionNodes.find(n => n.questionVariantId === review.id)!;
      expect(scored(currentNode)).toEqual(scored(originalNode));
      for (const key of ["patientDisplayName", "prototypeDemographics", "chiefComplaint", "presentation", "approvedInstantiationProfiles"] as const) {
        expect(currentCase[key], `${review.id}: ${key}`).toEqual(originalCase[key]);
      }
    }
  });

  it("isolates passing nodes and adds only the required neutral final routing", () => {
    expect(current.cases).toHaveLength(10);
    expect(current.questions).toHaveLength(10);
    expect(current.cases.every(c => c.decisionNodes.length === 1)).toBe(true);
    expect(syntheticClinicalReleaseSchema.safeParse(current.previewRelease).success).toBe(true);
    const splits = topic.ANAL_CANCER_PASS_COMPOSITIONS.filter(c => c.splitFromReturnedCompanions);
    expect(splits).toHaveLength(2);
    expect(splits.every(c => c.originalCaseId !== c.currentCaseId && !c.newCompositionIndependentPass)).toBe(true);
    const routing = topic.ANAL_CANCER_PASS_COMPOSITIONS.filter(c => c.neutralFinalRoutingAdded);
    expect(routing).toHaveLength(1);
    expect(routing[0]!.slug).toBe("treat-intraepithelial-lesion");
    expect(routing[0]!.clinicalCase.decisionNodes[0]!.terminalDispositions.every(d => d.kind === "no_terminal_outcome")).toBe(true);
    for (const c of current.cases) {
      const status = topic.ANAL_CANCER_ITEM_STATUSES.find(s => s.currentQuestionVariantId === c.decisionNodes[0]!.questionVariantId)!;
      expect(status.status).not.toBe("parked");
      expect(c.requiredClinicalSetting).toBe("clinic");
      expect(c.prototypeDemographics).toBeDefined();
    }
  });

  it("versions five revisions, keeps four meanings stable and changes the initial-treatment meaning explicitly", () => {
    expect(topic.ANAL_CANCER_REVISED_PROPOSALS).toHaveLength(5);
    for (const p of topic.ANAL_CANCER_REVISED_PROPOSALS) {
      expect(p.questionVariantId).toMatch(/\.v2$/);
      expect(p.previousQuestionVariantId).toMatch(/\.v1$/);
      expect(p.reviewStatus).toBe("needs_clinician_review");
      expect(p.pipelinePassed).toBe(false);
      expect(p.manualAuthorGate.reasoningSteps).toHaveLength(2);
      expect(p.manualAuthorGate.decidingObservation.length).toBeGreaterThan(40);
      expect(p.manualAuthorGate.counterfactual.length).toBeGreaterThan(50);
      expect(p.manualAuthorGate.repairAndRecheck.length).toBeGreaterThan(80);
      const before = topic.ANAL_CANCER_PROPOSALS.find(q => q.questionVariantId === p.previousQuestionVariantId)!;
      if (p.slug === "adverse-margin-histology") {
        expect(p.conceptId).not.toBe(before.conceptId);
        expect(p.previousConceptId).toBe(before.conceptId);
        expect(p.explanation).not.toMatch(/postoperative adjuvant/);
        expect(p.exhibit).toEqual(expect.objectContaining({ items: expect.arrayContaining([
          expect.objectContaining({ value: expect.stringContaining("lesion remains in place") }),
        ]) }));
      } else expect(p.conceptId).toBe(before.conceptId);
      expect(current.questions.find(q => q.id === p.questionVariantId)!.lastClinicianReview).toBeNull();
    }
    const salvage = topic.ANAL_CANCER_REVISED_PROPOSALS.find(p => p.slug === "salvage-local-failure")!;
    expect(salvage.task).not.toMatch(/confirmed local failure/);
    expect(current.cases.find(c => c.id === salvage.caseId)!.decisionNodes).toHaveLength(1);
  });

  it("parks two once-attempted diagnostic contests without inventing a key", () => {
    expect(topic.ANAL_CANCER_PARKED_ATTEMPTS).toHaveLength(2);
    for (const p of topic.ANAL_CANCER_PARKED_ATTEMPTS) {
      expect(p.status).toBe("parked");
      expect(p.currentQuestionVariantId).toBeNull();
      expect(p.isCorrect).toBeNull();
      expect(p.attemptedRevision.options).toHaveLength(3);
      expect(p.issueDisposition.length).toBeGreaterThan(100);
      expect(p.reason.length).toBeGreaterThan(80);
      expect(current.questions.some(q => q.id === p.originalQuestionVariantId)).toBe(false);
    }
    const confirmation = topic.ANAL_CANCER_PARKED_ATTEMPTS.find(p => p.originalQuestionVariantId.includes("confirm-local"))!;
    expect(confirmation.attemptedRevision.feedback).not.toMatch(/radical|salvage|APR/i);
    expect(round.clinicalHolds).toHaveLength(3);
    expect(round.clinicalHolds.every(h => h.questionVariantId === null && h.isCorrect === null)).toBe(true);
  });

  it("maps current tuple identities, testing estimates and assertions without altering archived timing", () => {
    expect(current.timing).toHaveLength(10);
    expect(current.orders).toHaveLength(11);
    for (const entry of current.timing) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(entry).success).toBe(true);
      const c = current.cases.find(c => c.id === entry.caseId)!;
      const node = c.decisionNodes.find(n => n.id === entry.nodeId && n.questionVariantId === entry.questionVariantId)!;
      expect(node).toBeDefined();
      if (entry.classification.kind === "test_choices") for (const x of entry.classification.choices) {
        expect(node.answerChoices.find(c => c.id === x.choiceId)!.label).toBe(x.choiceLabel);
        if (x.timing.kind === "test") expect(getDiagnosticTimingProfileMapping(x.timing.timingProfileId)).toBeDefined();
      }
    }
    for (const p of topic.ANAL_CANCER_PASS_COMPOSITIONS) {
      expect(current.timing.find(t => t.questionVariantId === p.questionVariantId)!.classification)
        .toEqual(topic.ANAL_CANCER_TIMING_PROPOSALS.find(t => t.questionVariantId === p.questionVariantId)!.classification);
    }
    for (const a of current.statementMappings) {
      expect(current.cases.some(c => c.id === a.caseId && c.decisionNodes.some(n => n.questionVariantId === a.questionVariantId))).toBe(true);
    }
    expect(current.orders.every(o => o.disposition.kind === "not_executed" && o.resultGateAfter === null && o.serviceRequest === null)).toBe(true);
  });

  it("closes new source/claim mappings and pins current packet copies", () => {
    expect(round.current.questions).toEqual(current.questions);
    expect(round.current.cases).toEqual(current.cases);
    expect(round.current.timing).toEqual(current.timing);
    expect(round.current.statementMappings).toEqual(current.statementMappings);
    for (const p of topic.ANAL_CANCER_REVISED_PROPOSALS) {
      const saved = round.revisedProposals.find(n => n.questionVariantId === p.questionVariantId)!;
      expect(saved.exactQuestionSha256).toBe(sha(current.questions.find(q => q.id === p.questionVariantId)));
      expect(saved.exactNodeSha256).toBe(sha(current.cases.flatMap(c => c.decisionNodes).find(n => n.id === p.nodeId)));
      for (const id of p.supportingEvidenceClaimIds) {
        const claim = ledger.claims.find(c => c.id === id)!;
        expect(claim).toBeDefined();
        expect(claim.questionVariantIds).toContain(p.questionVariantId);
        expect(claim.sourceIds.every(s => ledger.sources.some(source => source.id === s))).toBe(true);
      }
    }
    expect(topic.ANAL_CANCER_RESPONSE_MANIFEST).toMatchObject({ passPreserved: 5, revised: 5, parked: 2,
      activeMultiPartCases: 0, pipelinePassed: false, clinicalApproval: false, managerAccepted: false });
  });
});
