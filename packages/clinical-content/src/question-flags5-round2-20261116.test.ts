import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {describe, expect, it} from "vitest";
import {syntheticClinicalReleaseSchema} from "./schema";
import {
  QUESTION_FLAGS5_SOURCE_RELEASE as round1,
  QUESTION_FLAGS5_QUESTIONS as round1Questions,
} from "./question-flags5-20261116";
import {
  QUESTION_FLAGS5_ROUND2_SOURCE_RELEASE as view,
  QUESTION_FLAGS5_ROUND2_RETAINED_INPUT as retained,
  QUESTION_FLAGS5_ROUND2_REVISIONS as revisions,
  QUESTION_FLAGS5_ROUND2_CLAIMS as claims,
  QUESTION_FLAGS5_ROUND2_BASIS_CLAIMS as basis,
  QUESTION_FLAGS5_ROUND2_SOURCES as sources,
  QUESTION_FLAGS5_ROUND2_STATEMENT_MAPPINGS as mappings,
  QUESTION_FLAGS5_ROUND2_TIMING_ENTRIES as timings,
  QUESTION_FLAGS5_ROUND2_NEW_CONCEPTS as newConcepts,
  QUESTION_FLAGS5_ROUND2_FROZEN_PASSES as frozen,
  QUESTION_FLAGS5_ROUND2_FROZEN_FILES as frozenFiles,
  QUESTION_FLAGS5_ROUND2_SAFETY_EXCEPTION as safety,
  QUESTION_FLAGS5_ROUND2_CALF_HOLD as calf,
  applyQuestionFlags5Round2Revisions,
} from "./question-flags5-round2-20261116";

const hash = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");
const revision = (id: string) => revisions.find(r => r.id === id)!;
const node = (id: string) => {
  const r = revision(id);
  return view.cases.find(c => c.id === r.caseId)!.decisionNodes.find(n => n.id === r.nodeId)!;
};

describe("flags5 round2 independent-review repairs", () => {
  it("validates complete candidate and actual retained-live views", () => {
    expect(syntheticClinicalReleaseSchema.safeParse(view).success).toBe(true);
    expect(syntheticClinicalReleaseSchema.safeParse(retained).success).toBe(true);
    expect(view.cases).toHaveLength(21); expect(view.cases.flatMap(c => c.decisionNodes)).toHaveLength(26);
    expect(revisions).toHaveLength(21);
    expect(view.publicationStatus).toBe("synthetic_unapproved_prototype");
  });
  it("keeps all four round-one source/test artifacts byte exact", () => {
    for (const [path, expected] of Object.entries(frozenFiles)) {
      expect(createHash("sha256").update(readFileSync(new URL("../../../" + path, import.meta.url))).digest("hex"), path).toBe(expected);
    }
  });
  it.each(["QF5-04", "QF5-07"])("freezes %s question, node and complete case at reviewed hashes", id => {
    const f = frozen.find(r => r.id === id)!;
    const cs = view.cases.find(c => c.id === f.caseId)!;
    expect(hash(cs)).toBe(f.caseSha256);
    expect(hash(cs.decisionNodes.find(n => n.id === f.nodeId))).toBe(f.nodeSha256);
    expect(hash(round1Questions.find(q => q.id === f.questionVariantId))).toBe(f.questionSha256);
    expect(cs).toEqual(round1.cases.find(c => c.id === f.caseId));
    expect(revisions.some(r => r.id === id)).toBe(false);
  });
  it("retains the safety-recognition exception without claiming difficulty hardening", () => {
    expect(safety.educationalIntent).toBe("safety_recognition_exception");
    expect(safety.clinicalVersionApproval).toBe(false);
    expect(safety.reason).toContain("not claimed moderate/hard");
    const original = round1.cases.flatMap(c => c.decisionNodes).find(n => n.questionVariantId === safety.questionVariantId)!;
    expect(view.cases.flatMap(c => c.decisionNodes).find(n => n.questionVariantId === safety.questionVariantId)).toEqual(original);
  });
  it("changes only exact retained cases, with no mutation of frozen input", () => {
    const other = {...structuredClone(retained.cases[0]!), id: "case.flags5-r2.unrelated"};
    const input = [...structuredClone(retained.cases), other];
    const before = JSON.stringify(input);
    const composed = applyQuestionFlags5Round2Revisions(input);
    expect(JSON.stringify(input)).toBe(before);
    expect(composed.at(-1)).toBe(other);
    expect(composed.slice(0, -1)).toEqual(view.cases);
  });
  it.each(["presentation", "choice", "concept"])("rejects drift in retained %s", field => {
    const changed = structuredClone(retained.cases);
    if (field === "presentation") changed[0]!.presentation += " drift";
    if (field === "choice") changed[0]!.decisionNodes[0]!.answerChoices[0]!.label += " drift";
    if (field === "concept") changed[0]!.decisionNodes[0]!.primaryConceptId += ".drift";
    expect(() => applyQuestionFlags5Round2Revisions(changed)).toThrow(/Flags5 round2 input changed/);
  });
  it("preserves every other concept and explicitly versions the new venous acquisition objective", () => {
    expect(newConcepts).toHaveLength(1);
    expect(newConcepts[0]!.previousConceptId).toBe("concept.varicose-veins.intervention-referral-after-axial-reflux");
    expect(revision("QF5-02").question.conceptId).toBe(newConcepts[0]!.id);
    for (const r of revisions) if (r.id !== "QF5-02") {
      expect(r.question.conceptId).toBe(r.previousConceptId);
    }
  });
  it("creates monotonic question revisions while keeping the live replacement identity explicit", () => {
    for (const r of revisions) {
      const old = Number(r.oldQuestionVariantId.match(/\.r(\d+)$/)?.[1] ?? 0);
      const current = Number(r.questionVariantId.match(/\.r(\d+)$/)![1]);
      expect(current).toBeGreaterThan(old);
      expect(r.replacesLiveQuestionVariantId).toBeTruthy();
      expect(r.question.reviewStatus).toBe("needs_clinician_review");
      expect(r.question.lastClinicianReview).toBeNull();
    }
  });
  it("distinguishes mandatory from interim compression and removes suitability conclusions", () => {
    for (const id of ["QF5-01", "QF5-03"]) {
      const n = node(id);
      expect(n.currentUpdate).not.toMatch(/suitab|eligible/i);
      expect(n.exhibit?.kind).toBe("keyValue");
      expect(n.answerChoices.find(a => a.isCorrect)!.label).toContain("interim compression");
      expect(n.answerChoices.find(a => a.label.includes("Require"))!.label).toContain("before vascular referral");
    }
    const cs = view.cases.find(c => c.id === revision("QF5-02").caseId)!;
    expect(cs.presentation).not.toMatch(/declin|refus|avoid.*procedure/i);
    expect(node("QF5-02").exhibit).not.toBeNull();
  });
  it("makes the returned cirrhosis decisions change the actual booking plan", () => {
    for (const id of ["QF5-05", "QF5-06"]) {
      expect(node(id).stem).toContain("repair");
      expect(node(id).answerChoices.every(c => /repair/.test(c.label))).toBe(true);
      expect(node(id).answerChoices.some(c => /domain|record interval liver deterioration/i.test(c.label))).toBe(false);
    }
  });
  it("tests distinct OSA errors with raw clinical/report-method information", () => {
    const first = view.cases.find(c => c.id === revision("QF5-09").caseId)!;
    const second = view.cases.find(c => c.id === revision("QF5-10").caseId)!;
    expect(first.presentation).toContain("breathing pauses");
    expect(second.presentation).toContain("problem list");
    for (const id of ["QF5-09", "QF5-10"]) {
      expect(JSON.stringify(node(id).exhibit ?? null)).not.toMatch(/flagged by|increased OSA probability|no diagnostic sleep-study result/i);
      expect(node(id).stem).toMatch(/anesthesia|OSA entry/);
    }
    expect(revision("QF5-09").inference).not.toBe(revision("QF5-10").inference);
  });
  it("uses site/depth correspondence and a symptom complaint for the three imaging cases", () => {
    for (const id of ["QF5-11", "QF5-12", "QF5-13"]) {
      expect(node(id).exhibit?.kind).toBe("keyValue");
      expect(node(id).answerChoices.every(c => /ultrasound/i.test(c.label))).toBe(true);
    }
    const cs = view.cases.find(c => c.id === revision("QF5-13").caseId)!;
    expect(cs.chiefComplaint).toBe("Breast thickening");
    expect(cs.approvedInstantiationProfiles!.every(p => p.chiefComplaint === "Breast thickening")).toBe(true);
  });
  it("offers one named sampling method per option without an unranked core-or-surgical bundle", () => {
    for (const id of ["QF5-14", "QF5-15"]) {
      const choices = node(id).answerChoices;
      expect(choices.map(a => a.label)).toEqual(["Palpation-guided core biopsy", "Ultrasound-guided core biopsy", "Stereotactic core biopsy"]);
      expect(choices.every(a => !/\bor\b/i.test(a.label))).toBe(true);
      expect(node(id).explanation).toMatch(/offered|Among the offered/);
    }
  });
  it("states the actual PTLD assay request and preserves the role of fixed histology", () => {
    const n = node("QF5-16");
    expect(JSON.stringify(n.exhibit)).toContain("viable cells");
    expect(n.explanation).toContain("Formalin-fixed tissue can support a PTLD diagnosis");
    for (const c of n.answerChoices.filter(c => c.label.includes("whole-specimen"))) {
      expect(c.rationale).toContain("can support histological PTLD diagnosis");
    }
  });
  it("makes the inadequate-manometry options parallel noun phrases", () => {
    expect(node("QF5-17").answerChoices.every(c => !/^Obtain /.test(c.label))).toBe(true);
    expect(node("QF5-17").explanation).toBe(round1.cases.flatMap(c => c.decisionNodes).find(n => n.id === node("QF5-17").id)!.explanation);
  });
  it("corrects IEM without borrowing absent-contractility evidence and states later acquisition facts", () => {
    const r = revision("QF5-18"), n = node("QF5-18");
    expect(r.basisClaimIds).toContain("claim.flags5r2.20261116.iem-normal-relaxation");
    expect(r.basisClaimIds).toContain("claim.flags5r2.20261116.iem-failed-swallows");
    expect(r.basisClaimIds).not.toContain("claim.qq20261102.motility-absent-contractility");
    expect(r.basisClaimIds).not.toContain("claim.qq20261102.motility-egjoo");
    expect(n.explanation).toContain("IEM can contain failed swallows");
    expect(JSON.stringify(n.exhibit)).toContain("stable gastric reference");
  });
  it("classifies both offered CT plans as tests with exact known-profile labels", () => {
    const n = node("QF5-18");
    const t = timings.find(t => t.questionVariantId === n.questionVariantId)!;
    expect(t.classification.kind).toBe("test_choices");
    if (t.classification.kind !== "test_choices") throw Error("Missing CT estimates");
    const ct = t.classification.choices.filter(c => c.choiceLabel.includes("CT"));
    expect(ct).toHaveLength(2);
    for (const c of ct) expect(c.timing).toEqual({kind: "test", timingProfileId: "timing.test.ct"});
  });
  it("keeps all five lymphangitis versions under the exact basic-recognition concept", () => {
    const lymph = revisions.filter(r => r.id.startsWith("QF5-LY-"));
    expect(lymph).toHaveLength(5);
    for (const r of lymph) {
      expect(r.question.conceptId).toBe("concept.lymphangitis.acute-clinical-recognition");
      expect(r.basicAccepted).toBe(true);
      expect(r.ownerDirection?.clinicalVersionApproval).toBe(false);
      expect(node(r.id).answerChoices.map(a => a.label)).toEqual(["Acute lymphangitis", "Superficial thrombophlebitis", "Bacterial cellulitis"]);
      expect(r.question.lastClinicianReview).toBeNull();
    }
  });
  it("holds the unverified calf geometry without drafting or admitting an unsupported successor", () => {
    expect(calf.status).toBe("held_no_executable_successor");
    expect(calf.liveVersionUnchanged).toBe(true);
    expect(calf.supportedRuleClaimIds).toContain("claim.question-topic-soft-tissue-sarcoma-desmoid.tract-excision");
    expect(view.cases.some(c => c.decisionNodes.some(n => n.questionVariantId.includes("calf-core-tract")))).toBe(false);
  });
  it("removes the MH editorial qualifier while retaining the same clinical key", () => {
    const n = node("QF5-MH");
    expect(n.answerChoices.some(c => c.label.includes("as a routine preoperative precaution"))).toBe(false);
    expect(n.answerChoices.filter(c => c.label.includes("prophylactic"))).toHaveLength(2);
    expect(n.answerChoices.find(c => c.isCorrect)!.label).toContain("Trigger-free");
  });
  it("retains coherent profiles, complete tasks and randomized parallel scoring", () => {
    for (const cs of view.cases) {
      expect(cs.patientDisplayName).toBe("{patientName}");
      expect(cs.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      for (const p of [{presentation: cs.presentation, prototypeDemographics: cs.prototypeDemographics}, ...cs.approvedInstantiationProfiles!]) {
        expect(p.presentation).toContain("{patientName}");
        expect(p.presentation).toContain(`${p.prototypeDemographics!.ageYears}-year-old ${p.prototypeDemographics!.sexLabel === "Male" ? "man" : "woman"}`);
      }
      for (const n of cs.decisionNodes) {
        expect(n.shuffleAnswers).toBe(true); expect(n.answerChoices.filter(c => c.isCorrect)).toHaveLength(1);
        expect([3, 4]).toContain(n.answerChoices.length);
      }
    }
    for (const r of revisions) {
      expect(node(r.id).stem).toContain("{patientName}");
      expect(node(r.id).answerChoices.some(c => /\balone\b|individuali[sz]ed|tailored care/i.test(c.label))).toBe(false);
    }
  });
  it("keeps exact per-choice wait records and claim/source closure", () => {
    expect(timings).toHaveLength(26);
    const ids = new Set<string>([...claims, ...basis].map(c => c.id));
    for (const r of revisions) {
      const n = node(r.id), t = timings.find(t => t.questionVariantId === n.questionVariantId)!;
      expect(t).toBeDefined();
      if (t.classification.kind === "test_choices") expect(t.classification.choices.map(c => [c.choiceId, c.choiceLabel])).toEqual(n.answerChoices.map(c => [c.id, c.label]));
      for (const id of r.question.supportingEvidenceClaimIds) expect(ids.has(id)).toBe(true);
    }
    expect(mappings).toHaveLength(21);
    for (const c of [...claims, ...basis]) for (const source of c.sourceIds) expect(sources.some(s => s.id === source)).toBe(true);
    for (const s of sources) {
      expect(s.completeCitation).toBeTruthy(); expect(s.accessedOn).not.toBe("2026-11-16");
      expect(s.licenseLabel).toBeTruthy(); expect(s.authorityAssessment).toBeTruthy();
      expect(s.sourceStatus).toBe("recorded_source_reused_offline_not_reaccessed");
    }
  });
});
