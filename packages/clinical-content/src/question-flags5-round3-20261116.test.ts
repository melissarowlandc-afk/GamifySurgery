// FINAL FLAGS5 ACCEPTANCE GUARD — the authoring gate precedes the later explicit PASS admission.
import {beforeFlags5FinalAcceptanceRelease} from "./question-flags5-final-acceptance-test-support";
import {describe,expect,it} from "vitest";
import {createHash} from "node:crypto";
import {syntheticClinicalReleaseSchema} from "./schema";
import {QUESTION_FLAGS5_ROUND3_SOURCE_RELEASE as view,QUESTION_FLAGS5_ROUND3_REVISIONS as revisions,QUESTION_FLAGS5_ROUND3_TIMING_ENTRIES as waits,QUESTION_FLAGS5_ROUND3_CANDIDATE_TEST_ORDER_RECORDS as orders,QUESTION_FLAGS5_ROUND3_PARKED as parked,QUESTION_FLAGS5_ROUND3_CLAIMS as claims,QUESTION_FLAGS5_ROUND3_BASIS_CLAIMS as basis,QUESTION_FLAGS5_ROUND3_SOURCES as sources,QUESTION_FLAGS5_ROUND3_STATEMENT_MAPPINGS as mappings} from "./question-flags5-round3-20261116";
import {QUESTION_FLAGS5_ROUND2_SOURCE_RELEASE as parent,QUESTION_FLAGS5_ROUND2_REVISIONS as old} from "./question-flags5-round2-20261116";
import {SYNTHETIC_CLINICAL_RELEASE as currentLive} from "./synthetic-content";
const live=beforeFlags5FinalAcceptanceRelease(currentLive);
const hash=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const revision=(id:string)=>revisions.find(r=>r.id===id)!;
const node=(id:string)=>{const r=revision(id);return view.cases.find(c=>c.id===r.caseId)!.decisionNodes.find(n=>n.id===r.nodeId)!;};

describe("flags5 final authoring round stays behind exact PASS acceptance",()=>{
  it("validates seven executable candidates and parks the unsupported hardening",()=>{
    expect(syntheticClinicalReleaseSchema.safeParse(view).success).toBe(true);
    expect(revisions).toHaveLength(7);expect(parked.map(p=>p.id)).toEqual(["QF5-06"]);
    for(const r of revisions)expect(live.cases.flatMap(c=>c.decisionNodes).some(n=>n.questionVariantId===r.questionVariantId)).toBe(false);
    expect(live.cases.flatMap(c=>c.decisionNodes).some(n=>n.questionVariantId===parked[0].liveQuestionVariantId)).toBe(true);
  });
  it("preserves every other node byte for byte",()=>{
    const replaced=new Set(revisions.map(r=>r.nodeId));
    for(const cs of parent.cases)for(const n of cs.decisionNodes)if(!replaced.has(n.id as never))
      expect(hash(view.cases.find(c=>c.id===cs.id)!.decisionNodes.find(x=>x.id===n.id))).toBe(hash(n));
  });
  it("gives every venous profile the same symptom-based complaint",()=>{
    const cs=view.cases.find(c=>c.id===revision("QF5-02").caseId)!;
    expect(cs.chiefComplaint).toBe("Calf heaviness");
    for(const p of cs.approvedInstantiationProfiles??[])expect(p.chiefComplaint).toBe("Calf heaviness");
    expect(revision("QF5-02").question.conceptId).toBe("concept.varicose-veins.intervention-referral-after-axial-reflux.v2");
  });
  it.each(["QF5-11","QF5-12","QF5-13"])("separates %s clinical observation from imaging",id=>{
    const n=node(id),t=waits.find(t=>t.questionVariantId===n.questionVariantId)!;
    const c=n.answerChoices.find(a=>/^(Schedule|Arrange) clinical examination/.test(a.label))!;
    expect(c.serviceRequest).toBeNull();expect(c.isCorrect).toBe(false);
    expect(t.classification.kind).toBe("test_choices");
    if(t.classification.kind==="test_choices")expect(t.classification.choices.find(a=>a.choiceId===c.id)!.timing).toEqual({kind:"no_test"});
  });
  it("does not invent a previous ultrasound for QF5-12",()=>{
    expect(node("QF5-12").answerChoices.map(c=>c.label).join(" ")).not.toMatch(/repeat|outside ultrasound/i);
  });
  it.each(["QF5-14","QF5-15"])("restores %s biopsy-versus-observation meaning",id=>{
    const r=revision(id),n=node(id);
    expect(n.stem).not.toMatch(/sampl|biopsy/i);
    expect(n.answerChoices.map(a=>a.label)).toEqual(["Arrange palpation-directed core biopsy","Arrange contrast breast MRI","Arrange short-interval clinical examination"]);
    expect(r.question.conceptId).toBe("concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging");
    expect(r.conceptMeaning).toContain("restores the original");
  });
  it("normalizes capitalization and articles in every manometry/timing label",()=>{
    const n=node("QF5-17");
    for(const a of n.answerChoices)expect(a.label).toMatch(/^[A-Z]/);
    expect(n.answerChoices.every(a=>!a.label.startsWith("A "))).toBe(true);
  });
  it("binds every new choice label to the corresponding timing/order identity",()=>{
    for(const r of revisions){const n=node(r.id),t=waits.find(t=>t.questionVariantId===r.questionVariantId)!;
      expect(r.question.reviewStatus).toBe("needs_clinician_review");expect(r.question.lastClinicianReview).toBeNull();
      expect(n.shuffleAnswers).toBe(true);expect(n.answerChoices.filter(c=>c.isCorrect)).toHaveLength(1);
      expect(r.question.answerChoices.map(a=>a.label)).toEqual(n.answerChoices.map(a=>a.label));
      if(t.classification.kind!=="test_choices")continue;
      for(const c of t.classification.choices){expect(c.choiceLabel).toBe(n.answerChoices.find(a=>a.id===c.choiceId)!.label);
        const exact=orders.filter(o=>o.questionVariantId===r.questionVariantId&&o.choiceId===c.choiceId);
        if(c.timing.kind==="no_test")expect(exact).toEqual([]);else expect(exact).toHaveLength(1);
      }
    }
  });
  it("maps the revised inference to existing source facts without new thresholds",()=>{
    const known=new Set([...claims,...basis].map(c=>c.id));
    for(const r of revisions){expect(mappings.find(m=>m.questionVariantId===r.questionVariantId)).toBeDefined();
      for(const id of r.question.supportingEvidenceClaimIds)expect(known.has(id as never),id).toBe(true);
      const app=claims.find(c=>c.id===r.applicationClaimId)!;
      for(const source of app.sourceIds)expect(sources.some(s=>s.id===source)).toBe(true);
      expect(old.find(o=>o.id===r.id)!.question.id).toBe(r.oldQuestionVariantId);
    }
  });
});
