import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  QUESTION_BANK_PRE_BATCH2B_RELEASE as before, QUESTION_NEW_N2_ROUND2_PRE_RELEASE as after,
  QUESTION_BANK_BATCH2B_REVISIONS as revisions, QUESTION_BANK_BATCH2B_AUTHORING_CONCEPTS as concepts,
  QUESTION_BANK_BATCH2B_CLAIMS as claims, QUESTION_BANK_PRE_BATCH2B_TIMING_ENTRIES as oldTimings,
  QUESTION_BANK_BATCH2B_TIMING_ENTRIES as timings, QUESTION_NEW_N2_ROUND2_PRE_TIMING_ENTRIES as ANSWER_CHOICE_TIMING_REGISTRY,
  applyQuestionBankBatch2bRevisions,
} from "./index";
import { syntheticClinicalReleaseSchema } from "./schema";
const snapshot = JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/question-bank-batch2b-before-20261104.json", import.meta.url), "utf8")) as { files: Record<string, string> };
const clean = <T>(v:T):T => JSON.parse(JSON.stringify(v)) as T;

describe("batch 2b versioned clinical applications", () => {
  it("changes only thirty-nine targeted nodes and preserves all other nodes and cases", () => {
    expect(revisions).toHaveLength(39);
    expect(new Set(revisions.map(r => r.caseId)).size).toBe(38);
    let untouchedCases=0, untouchedNodes=0;
    for (const old of before.cases) {
      const current=after.cases.find(c => c.id===old.id)!;
      const rr=revisions.filter(r => r.caseId===old.id);
      if (!rr.length) { expect(clean(current), old.id).toEqual(clean(old)); untouchedCases++; }
      expect(current.decisionNodes.map(n => n.id)).toEqual(old.decisionNodes.map(n => n.id));
      for (const n of old.decisionNodes) if (!rr.some(r => r.nodeId===n.id)) {
        expect(clean(current.decisionNodes.find(x => x.id===n.id)), n.id).toEqual(clean(n)); untouchedNodes++;
      }
    }
    expect(untouchedCases).toBe(before.cases.length-38);
    expect(untouchedNodes).toBe(before.cases.flatMap(c => c.decisionNodes).length-39);
    expect(syntheticClinicalReleaseSchema.safeParse(after).success).toBe(true);
  });
  it("retains old concepts and versions only materially different scored constructs", () => {
    expect(after.concepts.slice(0,before.concepts.length)).toEqual(before.concepts);
    expect(concepts).toHaveLength(7); expect(after.concepts).toHaveLength(before.concepts.length+7);
    for (const c of concepts) {
      expect(before.concepts.some(old => old.id===c.previousConceptId)).toBe(true);
      expect(c.reviewStatus).toBe("needs_clinician_review"); expect(c.lastClinicianReview).toBeNull();
      expect(c.versioningReason.length).toBeGreaterThan(40);
    }
    for (const r of revisions) {
      expect(r.questionVariantId).not.toBe(r.previousQuestionVariantId);
      expect(r.question).toMatchObject({reviewStatus:"needs_clinician_review",lastClinicianReview:null});
    }
  });
  it("keeps named complete tasks, profile demographics, short complaints and shuffled parallel choice counts", () => {
    for (const r of revisions) {
      const cs=after.cases.find(c => c.id===r.caseId)!, n=cs.decisionNodes.find(n=>n.id===r.nodeId)!;
      expect(n.stem).toContain("{patientName}"); expect(n.shuffleAnswers).toBe(true);
      expect([3,4]).toContain(n.answerChoices.length); expect(n.answerChoices.filter(c=>c.isCorrect)).toHaveLength(1);
      expect(n.answerChoices.some(c=>/\balone\b|\bindividuali[sz]ed\b|\btailored\b/i.test(c.label))).toBe(false);
      for (const profile of [{presentation:cs.presentation,chiefComplaint:cs.chiefComplaint},...(cs.approvedInstantiationProfiles??[])]) {
        expect(profile.presentation).toContain("{patientName}");
        expect(profile.presentation).toMatch(/\d+-year-old (woman|man|person)|a \d+-year-old|a \d+-year/);
        expect(profile.presentation).not.toMatch(/\{ageYears\}|\{sexNoun\}/);
        expect((profile.chiefComplaint??cs.chiefComplaint??"").trim().split(/\s+/).length).toBeLessThanOrEqual(5);
      }
    }
  });
  it("retains every prior wait row and supplies exact timing for every new choice", () => {
    expect(timings).toHaveLength(39);
    expect(ANSWER_CHOICE_TIMING_REGISTRY.slice(0,oldTimings.length)).toEqual(oldTimings);
    expect(ANSWER_CHOICE_TIMING_REGISTRY.slice(oldTimings.length)).toEqual(timings);
    for (const r of revisions) {
      const t=timings.filter(t=>t.caseId===r.caseId&&t.nodeId===r.nodeId&&t.questionVariantId===r.questionVariantId);
      expect(t).toHaveLength(1);
      if (t[0]!.classification.kind==="test_choices") for (const c of r.question.answerChoices) {
        const choice=t[0]!.classification.choices.find(x=>x.choiceId===c.id)!;
        expect(choice.choiceLabel).toBe(c.label); expect(choice.timing).toEqual(r.choiceTimingOverrides![c.id]);
      }
    }
  });
  it("keeps result services and routes while defining the actual returned breast observations", () => {
    for (const r of revisions) {
      const b=r.clinicalBinding;
      expect(b.nextKeyServiceId).toBe(b.previousKeyServiceId);
      if (r.auditId!=="B2B36") expect(b.nextResultGate).toEqual(b.previousResultGate);
      else {
        expect(b.nextResultGate!.resultTypeId).toBe(b.previousResultGate!.resultTypeId);
        expect(b.nextResultGate!.allowedServiceRouteIds).toEqual(b.previousResultGate!.allowedServiceRouteIds);
        expect(b.nextResultGate!.resultNarrative).toContain("without a focal cystic or solid correlate");
      }
    }
    const cs=after.cases.find(c=>c.id==="case.gs028c.palpable-breast.paired-dense-focal")!;
    expect(cs.decisionNodes[0]!.explanation).not.toMatch(/\bbiopsy\b|\bcore sampling\b/);
    expect(cs.decisionNodes[1]!.currentUpdate).toContain("lower inner skin marker");
  });
  it("keeps batch 2a packets, source definitions and prior images byte exact", () => {
    for (const [path,expected] of Object.entries(snapshot.files).filter(([p])=>/question-bank-batch2a|clinical-exhibits\/batch2a/.test(p))) {
      expect(createHash("sha256").update(readFileSync(new URL("../../../"+path,import.meta.url))).digest("hex"),path).toBe(expected);
    }
  });
  it("keeps thirty-nine application claims mapped and unapproved without advancing source access dates", () => {
    expect(claims).toHaveLength(39);
    for (const claim of claims) {
      expect(claim.sourceIds.length).toBeGreaterThan(0); expect(claim.basisClaimIds.length).toBeGreaterThan(0);
      expect(claim.reviewStatus).toBe("needs_clinician_review"); expect(claim.lastClinicianReview).toBeNull();
      expect(claim.verificationScope).toContain("no source retrieval");
    }
  });
  it("rejects a drifted prior gate or scored concept instead of silently rebinding it", () => {
    const cases=clean(before.cases),r=revisions[0]!;
    cases.find(c=>c.id===r.caseId)!.decisionNodes.find(n=>n.id===r.nodeId)!.primaryConceptId="concept.not-the-bound-source";
    expect(()=>applyQuestionBankBatch2bRevisions(cases)).toThrow(/binding changed/);
  });
});
