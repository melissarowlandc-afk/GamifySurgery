import {createHash} from "node:crypto";
import {describe, expect, it} from "vitest";
import {syntheticClinicalReleaseSchema} from "./schema";
import {
  QUESTION_FLAGS5_SOURCE_RELEASE as view, QUESTION_FLAGS5_CASES as cases,
  QUESTION_FLAGS5_REVISIONS as revisions, QUESTION_FLAGS5_QUESTIONS as questions,
  QUESTION_FLAGS5_CLAIMS as claims, QUESTION_FLAGS5_BASIS_CLAIMS as basis,
  QUESTION_FLAGS5_SOURCES as sources, QUESTION_FLAGS5_NEW_CONCEPTS as newConcepts,
  QUESTION_FLAGS5_RETAINED_INPUT as retained, QUESTION_FLAGS5_RETAINED_QUESTIONS as oldQuestions,
  QUESTION_FLAGS5_TIMING_ENTRIES as timings, QUESTION_FLAGS5_SOURCE_LINKS as links,
  QUESTION_FLAGS5_STATEMENT_MAPPINGS as mappings, applyQuestionFlags5Revisions,
} from "./question-flags5-20261116";

const digest = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");
const nodeFor = (id: string) => cases.flatMap(c => c.decisionNodes).find(n => n.questionVariantId === id)!;
const parsedRetained = syntheticClinicalReleaseSchema.parse(retained);
const oldFor = (id: string) => parsedRetained.cases.flatMap(c => c.decisionNodes).find(n => n.questionVariantId === id)!;

describe("flags5 explicit-import review candidates", () => {
  it("validates complete, unapproved runtime cases without requiring private feedback", () => {
    expect(syntheticClinicalReleaseSchema.safeParse(view).success).toBe(true);
    expect(syntheticClinicalReleaseSchema.safeParse(retained).success).toBe(true);
    expect(cases).toHaveLength(15); expect(revisions).toHaveLength(18);
    expect(cases.flatMap(c => c.decisionNodes)).toHaveLength(20);
    expect(view.publicationStatus).toBe("synthetic_unapproved_prototype");
    expect(view.disclaimer).toContain("not clinically approved");
  });
  it("retains exact intake case bytes and their original scoring identities", () => {
    expect(digest(retained)).toBe("e081533a1654483e95e3f640d832ae63e0eb3e91fa704f9c937e4ce8eb856082");
    for (const r of revisions) {
      expect(oldFor(r.oldQuestionVariantId)).toBeDefined();
      expect(oldFor(r.oldQuestionVariantId).answerChoices.filter(a => a.isCorrect)).toHaveLength(1);
      expect(nodeFor(r.questionVariantId).id).toBe(oldFor(r.oldQuestionVariantId).id);
      expect(r.questionVariantId).not.toBe(r.oldQuestionVariantId);
    }
  });
  it("changes only exact retained cases in authoring composition", () => {
    const other = {...structuredClone(cases[0]!), id: "case.flags5.unrelated.test"};
    const input = [...structuredClone(parsedRetained.cases), other];
    const before = JSON.stringify(input);
    const after = applyQuestionFlags5Revisions(input);
    expect(JSON.stringify(input)).toBe(before);
    expect(after.at(-1)).toBe(other);
    expect(after.slice(0, -1)).toEqual(cases);
  });
  it.each(["presentation", "stem", "key"])("rejects retained %s drift", field => {
    const changed = structuredClone(retained.cases) as unknown as typeof cases;
    if (field === "presentation") changed[0]!.presentation += " changed";
    if (field === "stem") changed[0]!.decisionNodes[0]!.stem += " changed";
    if (field === "key") changed[0]!.decisionNodes[0]!.answerChoices[0]!.isCorrect = false;
    expect(() => applyQuestionFlags5Revisions(changed)).toThrow(/Flags5 input changed/);
  });
  it("keeps stable concepts except the explicitly versioned emergency exception", () => {
    expect(newConcepts).toHaveLength(1);
    expect(newConcepts[0]!.previousConceptId).toBe("concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary");
    for (const r of revisions) {
      const old = oldFor(r.oldQuestionVariantId), n = nodeFor(r.questionVariantId);
      if (r.conceptMeaning === "unchanged") expect(n.primaryConceptId).toBe(old.primaryConceptId);
      else expect(n.primaryConceptId).toBe(newConcepts[0]!.id);
    }
    expect(retained.concepts.some(c => c.id === newConcepts[0]!.previousConceptId)).toBe(true);
  });
  it("preserves the two unrelated scored siblings byte for byte", () => {
    const changed = new Set<string>(revisions.map(r => r.questionVariantId));
    const unchanged = cases.flatMap(c => c.decisionNodes).filter(n => !changed.has(n.questionVariantId));
    expect(unchanged).toHaveLength(2);
    for (const n of unchanged) expect(n).toEqual(oldFor(n.questionVariantId));
  });
  it("does not carry approval or stale author-review receipts to new variants", () => {
    for (const q of questions) {
      expect(q.reviewStatus).toBe("needs_clinician_review");
      expect(q.lastClinicianReview).toBeNull();
      expect(q).not.toHaveProperty("agentReview");
    }
    for (const c of [...claims, ...newConcepts, ...mappings]) {
      expect(c.reviewStatus).toBe("needs_clinician_review"); expect(c.lastClinicianReview).toBeNull();
    }
  });
  it("keeps runtime scoring, randomization and author metadata in agreement", () => {
    for (const q of questions) {
      const n = nodeFor(q.id);
      expect(n.shuffleAnswers).toBe(true);
      expect([3, 4]).toContain(n.answerChoices.length);
      expect(n.answerChoices.filter(a => a.isCorrect)).toHaveLength(1);
      expect(n.answerChoices.map(a => [a.id, a.label, a.isCorrect])).toEqual(q.answerChoices.map(a => [a.id, a.label, a.isCorrect]));
      expect(n.stem).toBe(q.stem); expect(n.explanation).toBe(q.explanation);
      expect(n.primaryConceptId).toBe(q.conceptId);
    }
  });
  it("has complete patient tasks and finite age/sex-consistent profiles", () => {
    for (const cs of cases) {
      expect(cs.patientDisplayName).toBe("{patientName}");
      expect(cs.chiefComplaint!.trim().split(/\s+/).length).toBeLessThanOrEqual(5);
      for (const p of [{presentation: cs.presentation, prototypeDemographics: cs.prototypeDemographics}, ...cs.approvedInstantiationProfiles!]) {
        const dem = p.prototypeDemographics!;
        expect(p.presentation).toContain("{patientName}");
        expect(p.presentation).toContain(`${dem.ageYears}-year-old ${dem.sexLabel === "Male" ? "man" : "woman"}`);
      }
    }
    for (const r of revisions) expect(nodeFor(r.questionVariantId).stem).toContain("{patientName}");
  });
  it("removes the flagged option and imaging-label patterns from changed nodes", () => {
    for (const q of questions) {
      expect(q.answerChoices.some(a => /\balone\b|individuali[sz]ed|tailored care/i.test(a.label))).toBe(false);
      expect(q.answerChoices.some(a => /automatically|permanently|without education/i.test(a.label))).toBe(false);
      const n = nodeFor(q.id);
      expect(n.stem).not.toMatch(/negative (mammogra|ultrasound)|meets .*criteria|available|won.t delay/i);
    }
    for (const cs of cases.filter(c => /palpable-breast/.test(c.id))) {
      expect(cs.presentation).not.toMatch(/not (?:yet )?(?:been )?(?:done|performed)|negative/i);
    }
  });
  it("retains explicit per-choice test estimates with exact revised labels", () => {
    expect(timings).toHaveLength(20);
    for (const cs of cases) for (const n of cs.decisionNodes) {
      const t = timings.find(t => t.caseId === cs.id && t.nodeId === n.id && t.questionVariantId === n.questionVariantId)!;
      expect(t).toBeDefined();
      if (t.classification.kind === "test_choices") {
        expect(t.classification.choices.map(c => [c.choiceId, c.choiceLabel])).toEqual(n.answerChoices.map(c => [c.id, c.label]));
      }
      if (n.resultGateAfter) expect(n.answerChoices.find(a => a.isCorrect)!.serviceRequest!.serviceId).toBe(n.resultGateAfter.resultTypeId);
    }
  });
  it("puts the raw scar-edge result after the imaging decision, not before it", () => {
    const cs = cases.find(c => c.id === "case.gs028c.palpable-breast.paired-scar-edge")!;
    expect(cs.presentation).not.toMatch(/ultrasound/i);
    expect(cs.decisionNodes[0]!.exhibit).toMatchObject({kind: "keyValue"});
    expect(cs.decisionNodes[0]!.resultGateAfter!.resultNarrative).toContain("no solid or cystic correlate");
    expect(cs.decisionNodes[1]!.currentUpdate).toContain("no solid or cystic correlate");
  });
  it("keeps the two dysphagia decisions self-contained without repeating result prose", () => {
    const cs = cases.find(c => c.id === "case.achalasia.clinic-referral")!;
    expect(cs.presentation).not.toMatch(/endoscopy|swallow empties/i);
    expect(cs.decisionNodes[0]!.exhibit).toMatchObject({kind: "keyValue", items: [{label: "Upper endoscopy"}, {label: "Contrast swallow"}]});
    expect(cs.decisionNodes[1]!.exhibit).toMatchObject({kind: "keyValue", items: [{label: "Endoscopy addendum"}, {}, {}, {}]});
    expect(cs.decisionNodes[0]!.currentUpdate).not.toMatch(/weight|resistance/i);
    expect(cs.decisionNodes[1]!.currentUpdate).toContain("weights");
  });
  it("does not let the earlier cirrhosis answer supply the changed follow-up action", () => {
    const cs = cases.find(c => c.id === "case.gs028b.cirrhosis-perioperative.paired-single-albumin")!;
    expect(cs.decisionNodes[0]!.answerChoices.find(a => a.isCorrect)!.label).toContain("optimize");
    expect(cs.decisionNodes[1]!.answerChoices.find(a => a.isCorrect)!.label).toContain("Urgent hospital");
    expect(cs.decisionNodes[1]!.currentUpdate).toContain("no longer reduces");
    expect(cs.decisionNodes[1]!.primaryConceptId).toBe(newConcepts[0]!.id);
  });
  it("maps every changed statement and explanation to real recorded claims", () => {
    expect(mappings).toHaveLength(18); expect(claims).toHaveLength(18);
    const ids = new Set<string>([...basis, ...claims].map(c => c.id));
    for (const q of questions) for (const id of q.supportingEvidenceClaimIds) expect(ids.has(id)).toBe(true);
    for (const m of mappings) for (const f of m.fields) for (const id of f.claimIds) expect(ids.has(id)).toBe(true);
    for (const c of claims) {
      expect(c.basisClaimIds.length).toBeGreaterThan(0);
      for (const id of c.basisClaimIds) expect(basis.some(b => b.id === id)).toBe(true);
      for (const id of c.sourceIds) expect(sources.some(s => s.id === id && s.evidenceClaimIds.some(claimId => claimId === c.id))).toBe(true);
      expect(c.verificationScope).toContain("No external source was accessed");
    }
  });
  it("retains source access dates, permissions and safe links without claiming fresh verification", () => {
    for (const s of sources) {
      expect(s.completeCitation).toBeTruthy(); expect(s.organizationOrJournal).toBeTruthy();
      expect(s.authors.length).toBeGreaterThan(0);
      if (s.publicationYear === null) expect(s.id).toMatch(/^source\.gs028se\.ama-/);
      else expect(s.publicationYear).toBeGreaterThan(1900);
      expect(s.doi || s.officialUrl).toBeTruthy(); expect(s.accessedOn).toBeTruthy();
      expect(s.accessedOn).not.toBe("2026-11-16"); expect(s.licenseLabel).toBeTruthy();
      expect(s.reuseStatus).toBeTruthy(); expect(s.authorityAssessment).toBeTruthy();
      expect(s.sourceStatus).toBe("recorded_source_reused_offline_not_reaccessed");
    }
    for (const l of links) expect(l).toMatchObject({target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer"});
    expect(oldQuestions.length).toBeGreaterThanOrEqual(20);
  });
});
