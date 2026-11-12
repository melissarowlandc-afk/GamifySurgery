import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import * as content from "./index";
import { QUESTION_QUALITY_SOURCE_RELEASE as before, QUESTION_QUALITY_PRE_BATCH1_RELEASE as after } from "./synthetic-content";
import { QUESTION_QUALITY_REVISIONS as revisions, QUESTION_QUALITY_PRIOR_REVISIONS as priorRevisions, QUESTION_QUALITY_OWNER_ROUND1_REVISIONS as ownerRound1, QUESTION_QUALITY_OWNER_ROUND2_REVISIONS as ownerRound2, QUESTION_QUALITY_HISTORICAL_REVISIONS as historical, QUESTION_QUALITY_ROUND2_CLAIMS as round2Claims, QUESTION_QUALITY_ROUND2_SOURCES as round2Sources, QUESTION_QUALITY_RETAINED_REVISIONS as retainedRevisions, QUESTION_QUALITY_CLAIMS as claims, QUESTION_QUALITY_SOURCES as sources, applyQuestionQualityRevisions } from "./question-quality-pilot-20261028";
import { ANSWER_CHOICE_TIMING_REGISTRY as timings, LEGACY_QUESTION_QUALITY_TIMING_ENTRIES as legacy, RETAINED_QUESTION_QUALITY_DRAFT_TIMING_ENTRIES as retainedTimings } from "./answer-choice-timing";
import type { SyntheticClinicalCase } from "./schema";
import { historicalCaseText, questionText } from "./question-quality-review.test.helpers";
import { QUESTION_QUALITY_CLINICAL_APPROVALS as approvals } from "./question-quality-clinical-approvals-20261102";

const snapshot = JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/pilot-before-20261028.json", import.meta.url), "utf8")) as {
  items: Array<{ case: SyntheticClinicalCase }>;
  legacyTiming: unknown[];
};
const liveNode = (r: typeof revisions[number]) => after.cases.find(c => c.id === r.caseId)!.decisionNodes.find(n => n.id === r.nodeId)!;
const reviewOneCases = applyQuestionQualityRevisions(before.cases, priorRevisions);
const reviewOne = JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/manager-review-before-20261029.json", import.meta.url), "utf8")) as {
  cases: SyntheticClinicalCase[];
  timings: typeof timings;
};

describe("versioned question-quality draft pilot", () => {
  it("revises 14 tasks and versions five shared-context companions with stable concepts", () => {
    expect(revisions.filter(r => !r.contextCompanion)).toHaveLength(14);
    expect(revisions.filter(r => r.contextCompanion)).toHaveLength(5);
    expect(new Set(revisions.map(r => r.questionVariantId)).size).toBe(19);
    for (const r of revisions) {
      const old = before.cases.find(c => c.id === r.caseId)!.decisionNodes.find(n => n.id === r.nodeId)!;
      expect(r.questionVariantId).toMatch(new RegExp("^" + r.previousQuestionVariantId.replaceAll(".", "\\.") + "\\.r[2345]$"));
      expect(liveNode(r).primaryConceptId).toBe(old.primaryConceptId);
      expect(liveNode(r).questionVariantId).toBe(r.questionVariantId);
      const approval=approvals.find(a=>a.questionVariantId===r.questionVariantId);
      expect(r.question).toMatchObject({ contentVersion: r.ownerRound3Review ? "question-authoring.2026-11-02.v4" : r.ownerRound2Review ? "question-authoring.2026-10-29.v3" : "question-authoring.2026-10-28." + (r.supersedesQuestionVariantId ? "v2" : "v1"), reviewStatus: approval?"clinically_approved":"needs_clinician_review", aiAssistedDrafting: true, lastClinicianReview: approval?{reviewer:approval.reviewer,reviewedOn:approval.reviewedOn,contentVersion:approval.contentVersion}:null });
      expect(r.previousContentVersions.length).toBeGreaterThan(0);
    }
    expect(after.concepts).toEqual(before.concepts);
    expect(after.publicationStatus).toBe("synthetic_unapproved_prototype");
  });
  it("preserves every baseline pilot case and changes no unrelated case", () => {
    for (const item of snapshot.items) expect(before.cases.find(c => c.id === item.case.id)).toEqual(item.case);
    const changed = new Set(revisions.map(r => r.caseId));
    expect(changed.size).toBe(14);
    expect(after.cases.map(c => c.id)).toEqual(before.cases.map(c => c.id));
    for (const c of before.cases) if (!changed.has(c.id)) expect(after.cases.find(a => a.id === c.id)).toEqual(c);
    const clone = structuredClone(before.cases), original = JSON.stringify(clone);
    applyQuestionQualityRevisions(clone);
    expect(JSON.stringify(clone)).toBe(original);
  });
  it("preserves profile identities, constrained demographics, vitals, stage and capabilities", () => {
    for (const id of new Set(revisions.map(r => r.caseId))) {
      const a = after.cases.find(c => c.id === id)!, b = before.cases.find(c => c.id === id)!;
      for (const field of ["id", "patientDisplayName", "chiefComplaint", "patientPresentationVariantId", "prototypeDemographics", "prototypeVitalSigns", "earliestFacilityStage", "requiredCapabilityIds", "rewardTierId", "pediatricProfile"] as const) expect(a[field]).toEqual(b[field]);
      expect(a.approvedInstantiationProfiles?.map(({ presentation: _text, ...p }) => p)).toEqual(b.approvedInstantiationProfiles?.map(({ presentation: _text, ...p }) => p));
      for (const p of a.approvedInstantiationProfiles ?? []) {
        const demographics = p.prototypeDemographics;
        expect(demographics).toBeDefined();
        if (!demographics) throw new Error("Missing profile demographics");
        expect(p.presentation).toContain(String(demographics.ageYears) + "-year-old");
        expect(p.presentation).toContain(demographics.sexLabel === "Female" ? (demographics.ageYears < 18 ? "girl" : "woman") : (demographics.ageYears < 18 ? "boy" : "man"));
      }
      expect(a.chiefComplaint?.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(a.presentation).not.toMatch(/^A patient with/i);
    }
  });
  it("keeps three/four options randomized with one key and no fixed waits in prose", () => {
    for (const r of revisions) {
      const n = liveNode(r);
      expect([3, 4]).toContain(n.answerChoices.length);
      expect(n.answerChoices.filter(c => c.isCorrect)).toHaveLength(1);
      expect(n.shuffleAnswers).toBe(true);
      if (!r.contextCompanion) {
        expect(n.stem.endsWith("?")).toBe(true);
        expect([n.stem, r.presentationTemplate, r.currentUpdate].filter(Boolean).join(" ")).not.toMatch(/\b\d+\s*(?:minutes?|hours?|days?)\b/i);
        for (const c of r.question.answerChoices.filter(c => !c.isCorrect)) expect(c.distractorRationale?.length).toBeGreaterThan(20);
      }
    }
  });
  it("preserves result gates and companion concepts/keys/services through the reviewed wording changes", () => {
    for (const r of revisions) {
      const old = before.cases.find(c => c.id === r.caseId)!.decisionNodes.find(n => n.id === r.nodeId)!;
      expect(liveNode(r).resultGateAfter).toEqual(old.resultGateAfter);
      if (r.contextCompanion) {
        const prior = reviewOneCases.find(c => c.id === r.caseId)!.decisionNodes.find(n => n.id === r.nodeId)!;
        expect(prior.stem).toBe(old.stem);
        expect(prior.answerChoices.map(c => c.label)).toEqual(old.answerChoices.map(c => c.label));
        const contracts = (cs: typeof old.answerChoices) => cs.map(c => [c.id, c.isCorrect, c.serviceRequest]);
        expect(contracts(liveNode(r).answerChoices)).toEqual(contracts(old.answerChoices));
        expect(liveNode(r).stem).toBe(r.question.stem);
        expect(liveNode(r).answerChoices.map(c => c.label)).toEqual(r.question.answerChoices.map(c => c.label));
      }
    }
  });
  it("retains original timing entries byte-equivalent for frozen encounter lookup", () => {
    expect(legacy).toHaveLength(19);
    expect(legacy).toEqual(snapshot.legacyTiming);
    for (const entry of legacy) expect(timings.filter(t => t.caseId === entry.caseId && t.nodeId === entry.nodeId && t.questionVariantId === entry.questionVariantId)).toEqual([entry]);
  });
  it("provides exact-label timing identities for every new revision", () => {
    for (const r of revisions) {
      const entries = timings.filter(t => t.caseId === r.caseId && t.nodeId === r.nodeId && t.questionVariantId === r.questionVariantId);
      expect(entries).toHaveLength(1);
      const classification = entries[0]!.classification;
      if (classification.kind === "test_choices") expect(classification.choices.map(c => [c.choiceId, c.choiceLabel])).toEqual(liveNode(r).answerChoices.map(c => [c.id, c.label]));
    }
  });
  it("retains every earlier local draft definition and exact timing for frozen encounters", () => {
    expect(retainedRevisions).toHaveLength(30);
    expect(retainedTimings).toHaveLength(30);
    for (const c of reviewOne.cases) expect(historicalCaseText(reviewOneCases.find(prior => prior.id === c.id))).toEqual(historicalCaseText(c));
    for (const entry of reviewOne.timings) expect(timings.filter(t => t.caseId === entry.caseId && t.nodeId === entry.nodeId && t.questionVariantId === entry.questionVariantId)).toEqual([entry]);
    for (const r of revisions.filter(r => r.supersedesQuestionVariantId)) {
      const prior = historical.find(p => p.questionVariantId === r.supersedesQuestionVariantId)!;
      expect(prior.question.conceptId).toBe(r.question.conceptId);
      if (!r.ownerRound2Review) expect(r.question.supportingEvidenceClaimIds).toEqual(prior.question.supportingEvidenceClaimIds);
      else expect(r.question.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
    }
  });
  it("reviews all nineteen visible tasks and removes relocated decision-principle cues", () => {
    expect(ownerRound1.filter(r => r.leadInReview?.changed)).toHaveLength(16);
    expect(revisions.filter(r => r.leadInReview?.changed)).toHaveLength(17);
    for (const r of revisions) {
      expect(r.leadInReview).toMatchObject({ reviewedOn: "2026-10-29", note: expect.any(String) });
      expect(liveNode(r).stem).not.toMatch(/specific safety risk|greatest diagnostic sensitivity|preserving uninvolved|gold standard|first.line|most specific/i);
    }
    expect(liveNode(revisions.find(r => r.auditId === "A17")!).stem).toBe("Which test should be completed before {patientName}'s adrenal biopsy?");
    expect(liveNode(revisions.find(r => r.auditId === "A28-context")!).currentUpdate).not.toMatch(/sentinel/i);
    expect(liveNode(revisions.find(r => r.auditId === "A27-context")!).currentUpdate).not.toMatch(/restriction|excluded/i);
  });
  it("resolves claim/source provenance and keeps additions unapproved with rights metadata", () => {
    const allClaims = new Set<string>(), allSources = new Set<string>(), seen = new WeakSet<object>();
    const visit = (v: unknown): void => {
      if (!v || typeof v !== "object" || seen.has(v)) return;
      seen.add(v);
      const x = v as Record<string, unknown>;
      if (typeof x.id === "string" && Array.isArray(x.sourceIds)) allClaims.add(x.id);
      if (typeof x.id === "string" && typeof x.completeCitation === "string") allSources.add(x.id);
      Object.values(v).forEach(visit);
    };
    visit(content);
    for (const r of revisions) for (const id of r.question.supportingEvidenceClaimIds) expect(allClaims.has(id), id).toBe(true);
    for (const c of [...claims, ...round2Claims]) {
      expect(c).toMatchObject({ reviewStatus: "needs_clinician_review", lastCheckedOn: c.id.startsWith("claim.qq20261029.") ? "2026-10-29" : "2026-10-28", lastClinicianReview: null });
      for (const id of c.sourceIds) expect(allSources.has(id), id).toBe(true);
      expect(c.limitation).toBeTruthy();
    }
    for (const s of [...sources, ...round2Sources]) {
      expect(s).toMatchObject({ reviewStatus: "needs_clinician_review", accessedOn: s.id.startsWith("source.qq20261029.") ? "2026-10-29" : "2026-10-28" });
      for (const field of ["completeCitation", "organizationOrJournal", "officialUrl", "licenseLabel", "reuseStatus", "reuseNotes", "authorityAssessment", "usageRole"] as const) expect(s[field]).toBeTruthy();
      for (const id of s.evidenceClaimIds) expect([...claims, ...round2Claims].some(c => c.id === id && c.sourceIds.includes(s.id))).toBe(true);
    }
  });
  it("fails closed on missing or unexpectedly changed source bindings", () => {
    expect(() => applyQuestionQualityRevisions([])).toThrow(/Missing/);
    const cases = structuredClone(before.cases), r = revisions[0]!;
    cases.find(c => c.id === r.caseId)!.decisionNodes.find(n => n.id === r.nodeId)!.stem = "Unexpected source edit";
    expect(() => applyQuestionQualityRevisions(cases)).toThrow(/source binding changed/);
  });
  it("removes direct test/measure names and integrated exclusion wording from selected contexts", () => {
    for (const [audit,pattern] of [["A02", /\bHIDA\b|hepatobiliary scintigraphy/i], ["A23", /odds ratio|risk ratio/i], ["A28", /integrated workup excludes|primary cutaneous neuroendocrine/i]] as const) {
      const r = revisions.find(r => r.auditId === audit)!, c = after.cases.find(c => c.id === r.caseId)!, n = liveNode(r);
      expect([c.presentation, n.currentUpdate, n.stem, JSON.stringify(n.exhibit)].filter(Boolean).join(" ")).not.toMatch(pattern);
    }
  });
  it("retains every owner round-one draft and limits new identities to the six returned tasks and three context companions", () => {
    const snapshot = JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/owner-round1-before-20261029.json", import.meta.url), "utf8"));
    const assembled = applyQuestionQualityRevisions(before.cases, ownerRound1);
    for (const c of snapshot.cases) expect(historicalCaseText(assembled.find(a => a.id === c.id))).toEqual(historicalCaseText(c));
    for (const entry of snapshot.timings) expect(timings.filter(t => t.caseId === entry.caseId && t.nodeId === entry.nodeId && t.questionVariantId === entry.questionVariantId)).toEqual([entry]);
    const changed = ["A02", "A06", "A11", "A25", "A30", "A40", "A06-context", "A25-context", "A30-context"];
    expect(ownerRound2.filter(r => r.ownerRound2Review).map(r => r.auditId).sort()).toEqual(changed.sort());
    for (const r of ownerRound2) {
      const old = ownerRound1.find(o => o.auditId === r.auditId)!;
      if (r.ownerRound2Review) {
        expect(r.supersedesQuestionVariantId).toBe(old.questionVariantId);
        expect(r.questionVariantId).toBe(old.questionVariantId.replace(/\.r(\d+)$/, (_, n) => ".r" + (Number(n) + 1)));
      } else expect(questionText(r.question)).toEqual(questionText(old.question));
      expect(r.question.conceptId).toBe(old.question.conceptId);
      expect(r.question.reviewStatus).toBe(approvals.some(a=>a.questionVariantId===r.questionVariantId)?"clinically_approved":"needs_clinician_review");
    }
    expect(ownerRound2.filter(r => r.ownerEditorialReview?.status === "approved_editorially")).toHaveLength(8);
  });
  it("maps all three new abdominal-wall competitors to preserved no-outcome contracts without altering frozen choices", () => {
    const r = revisions.find(r => r.auditId === "A40")!, n = liveNode(r);
    expect(n.answerChoices).toHaveLength(4);
    for (const c of n.answerChoices.filter(c => !c.isCorrect)) {
      expect(n.terminalDispositions.find(d => d.answerChoiceId === c.id)).toMatchObject({ kind: "no_terminal_outcome", clinicalRationale: c.rationale });
      expect(r.choiceSourceIds?.[c.id]).toBeTruthy();
    }
    expect(n.answerChoices.some(c => /Morgagni/i.test(c.label))).toBe(false);
  });

});
