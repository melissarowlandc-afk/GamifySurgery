import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { answerChoiceTimingRegistryEntrySchema, syntheticClinicalReleaseSchema } from "./schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";
import {
  VLM_REVIEW, VLM_TOPIC, VLM_SPECS, VLM_CASES, VLM_QUESTIONS, VLM_CONCEPTS,
  VLM_CLAIMS, VLM_SOURCES, VLM_SOURCE_LINKS, VLM_TIMING_ENTRIES,
  VLM_EXACT_TEST_ORDER_RECORDS, VLM_TEST_ORDER_PROPOSALS, VLM_CASE_COMPOSITIONS,
  VLM_AUTHOR_CHECKS, VLM_STATEMENT_MAPPINGS, VLM_CLAIM_TO_QUESTION,
  VLM_OWNER_HELD_CANDIDATES, VLM_PREVIEW_RELEASE, vlmQuestionId,
  VLM_REVIEWED_ARTIFACTS, VLM_FROZEN_PASS_ARTIFACTS, VLM_ITEM_STATUSES,
  VLM_PARKED_ATTEMPTS, VLM_COMPOSITION_REVIEWS, VLM_REVISION_MANIFEST,
  VLM_HISTORICAL_OWNER_HELD_CANDIDATES, VLM_REVISION_SPECS,
} from "./question-topic-vascular-limb-mesenteric-arterial-20261111";

const read = (path: string) => readFileSync(new URL(`../../../${path}`, import.meta.url), "utf8");
const base = `docs/research/question-topic-${VLM_TOPIC}-20261111`;
const packet = JSON.parse(read(`${base}.json`));
const ledger = JSON.parse(read(`docs/research/sources-question-topic-${VLM_TOPIC}-20261111.json`));
const program = JSON.parse(read("docs/research/question-topic-program-20261111.json"));
const digest = (value: unknown) => createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(value)).digest("hex");
const nodes = VLM_CASES.flatMap(c => c.decisionNodes);
const unique = (values: string[]) => new Set(values).size === values.length;
type Audit = { inventoryRecordId: string; verdict: string; beforeVariantId: string; reasons: string[]; replacementQuestionVariantIds: string[]; [key: string]: unknown };

describe("vascular-limb-mesenteric-arterial explicit-import topic sidecar", () => {
  it("admits the clinic chart-review preview through the existing release schema", () => {
    const result = syntheticClinicalReleaseSchema.safeParse(VLM_PREVIEW_RELEASE);
    expect(result.success, JSON.stringify(result.error?.issues)).toBe(true);
    expect(VLM_CASES).toHaveLength(22);
    expect(nodes).toHaveLength(24);
    expect(VLM_QUESTIONS).toHaveLength(24);
  });

  it("keeps stable identities unique and each multi-node case on distinct constructs", () => {
    for (const ids of [VLM_CASES.map(c => c.id), nodes.map(n => n.id), nodes.map(n => n.questionVariantId), VLM_CONCEPTS.map(c => c.id), nodes.flatMap(n => n.answerChoices.map(c => c.id))]) {
      expect(unique(ids)).toBe(true);
      expect(ids.every(id => id.length <= 120 && /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(id))).toBe(true);
    }
    for (const c of VLM_CASES) expect(unique(c.decisionNodes.map(n => n.primaryConceptId))).toBe(true);
    expect(new Set(nodes.map(n => n.primaryConceptId))).toEqual(new Set(VLM_CONCEPTS.map(c => c.id)));
  });

  it("reconciles every exact assigned inventory row once with one allowed verdict", () => {
    const assigned = program.inventory.filter((x: {primaryTopicSlug: string}) => x.primaryTopicSlug === VLM_TOPIC);
    expect(assigned).toHaveLength(42);
    expect(packet.assignment.inventory).toEqual(assigned);
    const rows = packet.audit as Audit[];
    expect(rows).toHaveLength(42);
    expect(unique(rows.map(r => r.inventoryRecordId))).toBe(true);
    expect(new Set(rows.map(r => r.inventoryRecordId))).toEqual(new Set(assigned.map((r: {recordId: string}) => r.recordId)));
    expect(rows.filter(r => r.verdict === "Keep")).toHaveLength(1);
    expect(rows.filter(r => r.verdict === "Rewrite")).toHaveLength(14);
    expect(rows.filter(r => r.verdict === "Retire-and-replace")).toHaveLength(27);
    for (const row of rows) {
      expect(["Keep", "Rewrite", "Retire-and-replace"]).toContain(row.verdict);
      expect(row.reasons.length).toBeGreaterThanOrEqual(2);
      expect(row.beforeVariantId.length).toBeGreaterThan(10);
      if (row.verdict !== "Keep") {
        expect(row.replacementQuestionVariantIds.length).toBeGreaterThan(0);
        expect(row.replacementQuestionVariantIds.every(id => VLM_REVIEWED_ARTIFACTS.VLM_QUESTIONS.some(q => q.id === id))).toBe(true);
      }
    }
  });

  it("retains complete before contexts, exact hashes, profiles and original clinical provenance", () => {
    expect(packet.beforeArtifacts).toHaveLength(42);
    for (const before of packet.beforeArtifacts) {
      expect(before.question).not.toBeNull();
      expect(before.fullCase).not.toBeNull();
      expect(digest(before.question)).toBe(before.questionSha256);
      expect(digest(before.fullCase)).toBe(before.fullCaseSha256);
      expect(digest(before.context.node)).toBe(before.nodeSha256);
      expect(before.fullCase.decisionNodes.some((n: {questionVariantId: string}) => n.questionVariantId === before.questionVariantId)).toBe(true);
      expect(before.originalClinicalReview.reviewStatus).toBeDefined();
    }
  });

  it("preserves the exact B2B09 PASS node and its complete original visible case", () => {
    const id = "question.acute-mesenteric-ischemia.peritonitis-exploration.v3.r2";
    const before = packet.beforeArtifacts.find((b: {questionVariantId: string}) => b.questionVariantId === id);
    const c = SYNTHETIC_CLINICAL_RELEASE.cases.find(c => c.decisionNodes.some(n => n.questionVariantId === id))!;
    const node = c.decisionNodes.find(n => n.questionVariantId === id)!;
    expect(digest(node)).toBe("7e1b5319b7b0bfc6d9707e9a9fa6ce356191c405a25a93cef931429b27ef8dcc");
    expect(c).toEqual(before.fullCase);
    expect(before.contentVersion).toBe("question-authoring.2026-11-04.batch2b.round2.v1");
    const reference = packet.assignment.frozenReferences[0];
    expect(digest(read(reference.independentReviewFile))).toBe(reference.reviewFileSha256);
    expect(reference.independentPassId).toBe("B2B09");
    expect(reference.clinicianApproval).toBeNull();
    expect(VLM_QUESTIONS.some(q => q.id === id)).toBe(false);
  });

  it("records baseline drift separately and verifies the unchanged topic projection", () => {
    expect(packet.assignment.baselineRelease.manifestId).toBe("question-ship.2026-11-10.v9");
    expect(packet.currentSnapshot.manifestId).toBe("question-ship.2026-11-11.v11");
    expect(packet.currentSnapshot.topicRows).toHaveLength(32);
    expect(packet.currentSnapshot.topicRows.every((r: {nodeMatchesSnapshot: boolean; presentationMatchesSnapshot: boolean}) => r.nodeMatchesSnapshot && r.presentationMatchesSnapshot)).toBe(true);
    const ownDefinitionInputs = packet.assignment.inputHashes.filter((x: {file: string}) => !["packages/clinical-content/src/index.ts", "packages/clinical-content/src/synthetic-content.ts", "packages/clinical-content/src/question-ship-manifest.ts"].includes(x.file));
    for (const input of ownDefinitionInputs) expect(digest(read(input.file)), input.file).toBe(input.currentSha256);
  });

  it("leaves every new clinical record unapproved and author checks distinct from independent review", () => {
    for (const record of [...VLM_QUESTIONS, ...VLM_CONCEPTS, ...VLM_CLAIMS, ...VLM_SOURCES, ...VLM_AUTHOR_CHECKS, ...VLM_CASE_COMPOSITIONS]) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.lastClinicianReview).toBeNull();
    }
    expect(VLM_REVIEW.reviewStatus).toBe("needs_clinician_review");
    expect(VLM_AUTHOR_CHECKS.every(c => c.independentPass === false && c.reviewerRole === "author_self_check")).toBe(true);
  });

  it("uses one consistent named-patient profile and an admissible clinic setting", () => {
    for (const c of VLM_CASES) {
      expect(c.requiredClinicalSetting).toBe("clinic");
      expect(c.requiredCapabilityIds).toEqual([]);
      expect(c.patientDisplayName).toBe("{patientName}");
      expect(c.presentation).toMatch(/^\{patientName\}, a \d+-year-old (man|woman)(?: with [^,]+)?, attends clinic/);
      const demographics = c.prototypeDemographics!;
      expect(c.presentation.startsWith(`{patientName}, a ${demographics.ageYears}-year-old ${demographics.sexLabel === "Male" ? "man" : "woman"}`)).toBe(true);
      expect(c.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(c.approvedInstantiationProfiles).toHaveLength(1);
      expect(c.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(c.prototypeDemographics);
      expect(c.approvedInstantiationProfiles![0]!.presentation).toBe(c.presentation);
      expect(c.decisionNodes.every(n => n.stem.includes("{patientName}"))).toBe(true);
    }
    expect(VLM_CASE_COMPOSITIONS.every(c => c.educationalTier === 1 && c.facilityProgressionLevel === 0 && c.editorialSimulationWeights === null)).toBe(true);
  });

  it("binds authored questions to their materialized exact node choices and feedback", () => {
    for (const q of VLM_QUESTIONS) {
      const node = nodes.find(n => n.questionVariantId === q.id)!;
      expect(node.primaryConceptId).toBe(q.conceptId);
      expect(node.stem).toBe(q.stem);
      expect(node.explanation).toBe(q.explanation);
      expect(node.answerChoices.map(({id,label,isCorrect}) => ({id,label,isCorrect}))).toEqual(q.answerChoices.map(({id,label,isCorrect}) => ({id,label,isCorrect})));
      expect(node.answerChoices.filter(c => c.isCorrect)).toHaveLength(1);
      expect(node.shuffleAnswers).toBe(true);
      expect(node.answerChoices.length).toBeGreaterThanOrEqual(3);
      expect(node.answerChoices.length).toBeLessThanOrEqual(4);
      expect(node.answerChoices.every(c => !/\balone\b|individualized|tailored|solely because|without addressing/i.test(c.label))).toBe(true);
    }
  });

  it("contains substantive five-check author records for each exact visible sequence", () => {
    expect(VLM_AUTHOR_CHECKS).toHaveLength(24);
    expect(unique(VLM_AUTHOR_CHECKS.map(c => c.cueAttack))).toBe(true);
    for (const check of VLM_AUTHOR_CHECKS) {
      expect(check.reasoningSteps).toHaveLength(2);
      for (const value of [...check.reasoningSteps, check.closestError, check.decidingObservation, check.counterfactual, check.cueAttack, check.deletionTest, check.difficulty, check.sequenceReview, check.repairAndRecheck]) expect(value.length).toBeGreaterThan(35);
      expect(check.stageAndCategory.comparedOptions.length).toBeGreaterThanOrEqual(3);
      const c = VLM_CASES.find(c => c.id === check.caseId)!;
      const index = c.decisionNodes.findIndex(n => n.questionVariantId === check.questionVariantId);
      expect(check.visiblePriorQuestionVariantIds).toEqual(c.decisionNodes.slice(0,index).map(n => n.questionVariantId));
    }
  });

  it("gives every option a specific temptation, ranking rationale and counterfactual", () => {
    for (const c of VLM_SPECS) for (const n of c.nodes) for (const option of n.choices) {
      expect(option.temptation.length).toBeGreaterThan(35);
      expect(option.rationale.length).toBeGreaterThan(35);
      expect(option.counterfactual.length).toBeGreaterThan(35);
    }
  });

  it("classifies every exact testing choice and all distractors with existing profiles", () => {
    const balance = read("packages/balance-config/src/prototype-balance.ts");
    expect(VLM_TIMING_ENTRIES).toHaveLength(24);
    for (const entry of VLM_TIMING_ENTRIES) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(entry).success).toBe(true);
      const node = nodes.find(n => n.questionVariantId === entry.questionVariantId)!;
      const spec = VLM_SPECS.flatMap(c => c.nodes).find(n => vlmQuestionId(n.slug,n.version) === node.questionVariantId)!;
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices.map(c => [c.choiceId,c.choiceLabel])).toEqual(node.answerChoices.map(c => [c.id,c.label]));
        expect(entry.classification.choices.map(c => c.timing)).toEqual(spec.choices.map(c => c.timing));
        for (const c of entry.classification.choices) if (c.timing.kind === "test") expect(balance).toContain(`"${c.timing.timingProfileId}"`);
      } else expect(spec.choices.every(c => c.timing.kind === "no_test")).toBe(true);
    }
  });

  it("proposes exact not-executed test tuples without executing retrospective hospital care", () => {
    expect(VLM_EXACT_TEST_ORDER_RECORDS).toHaveLength(21);
    expect(VLM_TEST_ORDER_PROPOSALS).toHaveLength(21);
    const expected = VLM_TIMING_ENTRIES.flatMap(e => e.classification.kind === "test_choices" ? e.classification.choices.flatMap(c => c.timing.kind === "test" ? [{caseId:e.caseId,nodeId:e.nodeId,questionVariantId:e.questionVariantId,choiceId:c.choiceId,choiceLabel:c.choiceLabel,timingProfileId:c.timing.timingProfileId,disposition:{kind:"not_executed",reason:"future_planned"}}] : []) : []);
    expect(VLM_EXACT_TEST_ORDER_RECORDS).toEqual(expected);
    expect(VLM_TEST_ORDER_PROPOSALS.every(p => p.serviceRequest === null && p.resultGateAfter === null)).toBe(true);
    expect(nodes.every(n => n.resultGateAfter === null && n.answerChoices.every(c => c.serviceRequest === null))).toBe(true);
  });

  it("maps every new clinical statement and option through atomic claims to real source records", () => {
    const claims = new Map(VLM_CLAIMS.map(c => [c.id,c]));
    expect(VLM_SOURCES).toHaveLength(9);
    expect(VLM_CLAIMS).toHaveLength(51);
    for (const q of VLM_QUESTIONS) expect(q.supportingEvidenceClaimIds.length > 0 && q.supportingEvidenceClaimIds.every(id => claims.has(id))).toBe(true);
    for (const row of VLM_STATEMENT_MAPPINGS) {
      expect(row.patientObservations.kind).toBe("constructed_not_empirical");
      for (const field of [row.task,row.explanation,...row.choices]) expect(field.claimIds.every(id => claims.has(id))).toBe(true);
    }
    for (const claim of VLM_CLAIMS) {
      expect(claim.lastCheckedOn).toBe("2026-11-11");
      expect(claim.limitation!.length).toBeGreaterThan(30);
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      for (const id of claim.sourceIds) expect(VLM_SOURCES.find(s => s.id === id)!.evidenceClaimIds).toContain(claim.id);
      expect(VLM_CLAIM_TO_QUESTION.find(m => m.claimId === claim.id)!.questionVariantIds).toEqual(VLM_QUESTIONS.filter(q => q.supportingEvidenceClaimIds.includes(claim.id)).map(q => q.id));
    }
  });

  it("records bibliographic completeness and safe external clinical links", () => {
    for (const source of VLM_SOURCES) {
      expect(source.completeCitation.length).toBeGreaterThan(80);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.accessedOn).toBe("2026-11-11");
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.authorityAssessment.length).toBeGreaterThan(70);
      expect(source.reuseNotes.length).toBeGreaterThan(70);
      const link = VLM_SOURCE_LINKS.find(l => l.sourceId === source.id)!;
      expect(link).toMatchObject({target:"_blank",rel:"noopener noreferrer",referrerPolicy:"no-referrer"});
    }
    expect(ledger.excludedSources.length).toBeGreaterThan(0);
    expect(ledger.withheldTeachingPoints.length).toBeGreaterThan(0);
  });

  it("keeps every recorded hold and both new related candidates unresolved", () => {
    const heldIds = new Set(packet.assignment.inventory.flatMap((r: {recordedHoldIds: string[]}) => r.recordedHoldIds));
    expect(heldIds.size).toBe(4);
    expect(new Set(packet.assignment.recordedHolds.map((h: {id: string}) => h.id))).toEqual(heldIds);
    expect(VLM_OWNER_HELD_CANDIDATES).toHaveLength(0);
    expect(VLM_HISTORICAL_OWNER_HELD_CANDIDATES).toHaveLength(2);
    expect(VLM_HISTORICAL_OWNER_HELD_CANDIDATES.every(c => c.ownerDecisionResolved === false && c.releaseEligible === false)).toBe(true);
    expect(packet.assignment.unkeyedDraftSlots).toEqual([]);
    expect(packet.assignment.withheldTeachingPoints).toEqual([]);
    expect(packet.ownerApprovalsNeeded.length).toBeGreaterThanOrEqual(3);
  });

  it("preserves unchanged meanings and versions each material round-two objective change", () => {
    const changed = VLM_CONCEPTS.filter(c => c.identityDecision === "new_meaning_version");
    expect(changed).toHaveLength(9);
    for (const item of VLM_ITEM_STATUSES.filter(s => s.status === "revised" && s.currentConceptId !== s.reviewedConceptId)) {
      const c = changed.find(c => c.id === item.currentConceptId)!;
      expect(c.previousConceptIds).toContain(item.reviewedConceptId);
    }
    expect(VLM_CONCEPTS.every(c => c.historyTransfer === false)).toBe(true);
    expect(VLM_REVIEWED_ARTIFACTS.VLM_QUESTIONS.some(q => q.conceptId === "concept.n2.irreversible-ischemia-revascularization-boundary")).toBe(true);
    expect(packet.assignment.concepts).toHaveLength(15);
    expect(packet.assignment.concepts.filter((c: {registryOnly: boolean}) => c.registryOnly)).toHaveLength(2);
  });

  it("keeps the JSON packets exactly synchronized with the explicitly imported sidecar", () => {
    expect(packet.label).toBe("key shown first for review only.");
    expect(read(`${base}.md`)).toContain("## Owner approvals needed");
    expect(packet.drafts.specs).toEqual(VLM_SPECS);
    expect(packet.drafts.cases).toEqual(VLM_CASES);
    expect(packet.drafts.questions).toEqual(VLM_QUESTIONS);
    expect(packet.drafts.authorChecks).toEqual(VLM_AUTHOR_CHECKS);
    expect(packet.drafts.timingEntries).toEqual(VLM_TIMING_ENTRIES);
    expect(ledger.sources).toEqual(VLM_SOURCES);
    expect(ledger.claims).toEqual(VLM_CLAIMS);
    expect(ledger.statementMappings).toEqual(VLM_STATEMENT_MAPPINGS);
  });

  it("binds the 35 exact review decisions to the pre-edit v1 snapshot", () => {
    const snapshot = packet.independentReviewRound1;
    const reviews = JSON.parse(read(snapshot.reviewFile)) as {id: string; verdict: string}[];
    expect(digest(read(snapshot.reviewFile))).toBe(snapshot.reviewFileSha256);
    expect(reviews).toEqual(snapshot.reviews);
    expect(reviews).toHaveLength(35);
    expect(reviews.filter(r => r.verdict === "PASS")).toHaveLength(8);
    expect(reviews.filter(r => r.verdict === "REVISE")).toHaveLength(27);
    expect(VLM_REVIEWED_ARTIFACTS.VLM_QUESTIONS).toEqual(snapshot.artifacts.questions);
    expect(VLM_REVIEWED_ARTIFACTS.VLM_CASES).toEqual(snapshot.artifacts.cases);
  });

  it("preserves every PASS question and frozen node exactly and limits split metadata to existing rationales", () => {
    expect(VLM_FROZEN_PASS_ARTIFACTS).toHaveLength(8);
    const snapshot = packet.independentReviewRound1.artifacts;
    for (const frozen of VLM_FROZEN_PASS_ARTIFACTS) {
      const id = frozen.reviewedQuestionVariantId;
      const oldQuestion = snapshot.questions.find((q: {id: string}) => q.id === id);
      const oldCase = snapshot.cases.find((c: {decisionNodes: {questionVariantId: string}[]}) => c.decisionNodes.some(n => n.questionVariantId === id));
      const oldNode = oldCase.decisionNodes.find((n: {questionVariantId: string}) => n.questionVariantId === id);
      expect(digest(frozen.question)).toBe(digest(oldQuestion));
      expect(digest(frozen.node)).toBe(digest(oldNode));
      expect(digest(frozen.clinicalCase)).toBe(digest(oldCase));
      expect(VLM_QUESTIONS.find(q => q.id === id)).toEqual(oldQuestion);
      const current=nodes.find(n => n.questionVariantId === id)!;
      const composition=VLM_COMPOSITION_REVIEWS.find(c => c.questionVariantIds.includes(id))!;
      if (composition.finalDispositionAdditions.some(n => n.questionVariantId===id)) {
        expect(oldNode.terminalDispositions).toEqual([]);
        expect({...current,terminalDispositions:[]}).toEqual(oldNode);
        expect(current.terminalDispositions).toEqual(current.answerChoices.filter(c => !c.isCorrect).map(c => ({
          answerChoiceId:c.id,kind:"no_terminal_outcome",
          consequenceNarrative:"This clinic learning review records an outside-care decision; no treatment outcome is simulated.",
          clinicalRationale:c.rationale,sourceLabels:current.sourceLabels,
        })));
      } else expect(current).toEqual(oldNode);
      expect(frozen.clinicalApproval).toBe(false);
    }
    expect(VLM_COMPOSITION_REVIEWS.flatMap(c => c.finalDispositionAdditions).map(n => n.questionVariantId).sort()).toEqual(
      ["mvt-heparin","initial-abi","inflow-first"].map(slug => vlmQuestionId(slug)).sort(),
    );
  });

  it("records one disposition and one revision attempt for every returned item", () => {
    expect(VLM_ITEM_STATUSES).toHaveLength(37);
    expect(unique(VLM_ITEM_STATUSES.map(s => s.reviewedQuestionVariantId))).toBe(true);
    expect(VLM_ITEM_STATUSES.filter(s => s.status === "pass-preserved")).toHaveLength(8);
    expect(VLM_ITEM_STATUSES.filter(s => s.status === "revised")).toHaveLength(16);
    expect(VLM_ITEM_STATUSES.filter(s => s.status === "parked")).toHaveLength(13);
    expect(VLM_PARKED_ATTEMPTS.filter(p => p.reviewedVerdict === "REVISE")).toHaveLength(11);
    expect(VLM_PARKED_ATTEMPTS.filter(p => p.reviewedVerdict === "not_reviewed_held")).toHaveLength(2);
    expect(packet.revisionRound2.responses).toHaveLength(35);
    for (const response of packet.revisionRound2.responses) if (response.independentReview.verdict !== "PASS") {
      expect(response.attemptNumber).toBe(1);
      expect(["revised", "parked"]).toContain(response.status);
      expect(response.responseToReview.length).toBeGreaterThan(80);
    }
    expect(VLM_ITEM_STATUSES.every(s => s.independentPassOnNewVersion === false)).toBe(true);
  });

  it("scores no returned v1 or parked item and has only all-PASS multi-part cases", () => {
    const active = new Set(nodes.map(n => n.questionVariantId));
    for (const status of VLM_ITEM_STATUSES) {
      if (status.status === "parked") {
        expect(status.currentQuestionVariantId).toBeNull();
        expect(active.has(status.reviewedQuestionVariantId)).toBe(false);
        expect(status.parkedReason!.length).toBeGreaterThan(80);
      } else expect(active.has(status.currentQuestionVariantId!)).toBe(true);
      if (status.status === "revised") expect(active.has(status.reviewedQuestionVariantId)).toBe(false);
    }
    const multipart = VLM_CASES.filter(c => c.decisionNodes.length > 1);
    expect(multipart).toHaveLength(1);
    expect(multipart[0]!.decisionNodes).toHaveLength(3);
    for (const c of multipart) {
      expect(VLM_COMPOSITION_REVIEWS.find(r => r.caseId === c.id)!.allScoredNodesIndependentlyPassed).toBe(true);
      const original = VLM_REVIEWED_ARTIFACTS.VLM_CASES.find(x => x.id === c.id)!;
      expect(c).toEqual(original);
    }
  });

  it("versions every revised exact question and choice identity without transferring history", () => {
    expect(VLM_REVISION_SPECS).toHaveLength(16);
    for (const c of VLM_REVISION_SPECS) {
      expect(c.nodes).toHaveLength(1);
      const n = c.nodes[0]!;
      expect(n.version).toBe(2);
      const question = VLM_QUESTIONS.find(q => q.id === vlmQuestionId(n.slug,2))!;
      expect(question.contentVersion).toContain(".v2");
      expect(question.answerChoices.every(c => c.id.includes(".v2."))).toBe(true);
      expect(VLM_REVIEWED_ARTIFACTS.VLM_QUESTIONS.some(q => q.id === vlmQuestionId(n.slug))).toBe(true);
    }
    expect(VLM_REVISION_MANIFEST).toMatchObject({passPreserved:8,revised:16,parked:13,clinicalApproval:false,managerAccepted:false,publicReleaseAuthorized:false});
  });

  it("renders comparative exhibits from authored data and retains self-contained split contexts", () => {
    for (const q of VLM_QUESTIONS) expect(nodes.find(n => n.questionVariantId === q.id)!.exhibit).toEqual(q.exhibit);
    for (const slug of ["viability-urgency","vein-conduit","wound-outflow"]) {
      const q = VLM_QUESTIONS.find(q => q.id === vlmQuestionId(slug,2))!;
      expect(q.exhibit?.kind).toBe("table");
    }
    const split = VLM_COMPOSITION_REVIEWS.filter(c => c.caseId.includes(".pass-"));
    expect(split).toHaveLength(5);
    expect(split.every(c => c.questionVariantIds.length === 1 && !c.originalCaseBytePreserved)).toBe(true);
    const cfa = VLM_CASES.find(c => c.id.includes(".pass-cfa-procedure."))!;
    expect(cfa.presentation).toContain("completed supervised progressive walking sessions");
    expect(packet.revisionRound2.compositionReviews).toEqual(VLM_COMPOSITION_REVIEWS);
  });
});
