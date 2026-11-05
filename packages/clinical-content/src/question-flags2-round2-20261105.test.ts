import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  QUESTION_FLAGS2_ROUND2_REVISIONS as revisions,
  QUESTION_FLAGS2_ROUND2_AUTHORING_CONCEPTS as concepts,
  QUESTION_FLAGS2_ROUND2_CLAIMS as claims,
  QUESTION_FLAGS2_ROUND2_RETAINED_INPUT as input,
  QUESTION_FLAGS2_ROUND2_SOURCE_RELEASE as view,
  QUESTION_FLAGS2_ROUND2_TIMING_ENTRIES as timings,
  QUESTION_FLAGS2_ROUND2_CANDIDATE_TEST_ORDER_RECORDS as orders,
  applyQuestionFlags2Round2Revisions,
} from "./question-flags2-round2-20261105";
import { QUESTION_FLAGS2_REVISIONS, QUESTION_FLAGS2_ROUND1_SOURCE_RELEASE as round1 } from "./question-flags2-20261105";
import { QUESTION_FLAGS2_ACCEPTED_TIMING_ENTRIES } from "./question-flags2-accepted-20261105";
import { SYNTHETIC_CLINICAL_RELEASE as live } from "./synthetic-content";
import { ANSWER_CHOICE_TIMING_REGISTRY } from "./answer-choice-timing";
import { QUESTION_SHIP_MANIFEST as manifest, type QuestionShipManifest } from "./question-ship-manifest";
import { syntheticClinicalReleaseSchema, type SyntheticClinicalRelease, type AnswerChoiceTimingRegistryEntry } from "./schema";

const read=(path:string)=>JSON.parse(readFileSync(new URL("../../../"+path,import.meta.url),"utf8"));
const capture=read("tools/question-quality/fixtures/question-flags2-round2-before-20261105.json") as {
  release:SyntheticClinicalRelease;manifest:QuestionShipManifest;files:Record<string,string>;
  timings:AnswerChoiceTimingRegistryEntry[];review:Array<{id:string;cues:unknown[];fairness:unknown[];suggestions:unknown[]}>;
};
const packet=read("docs/research/question-flags2-round2-20261105.json") as Array<{
  id:string;sourceVerificationHold:string|null;pipelinePassed:boolean;releaseReady:boolean;keyOrderNotice:string;
  before:{variantId:string};after:{variantId:string};conceptId:string;previousConceptId:string;
  reviewResponse:{notes:Array<{category:"cues"|"fairness"|"suggestions";index:number;note:unknown;response:string}>};
  selfCheck:{reasoningSteps:string[];closestCredibleError:string;decidingFinding:string;counterfactual:string;cueAttack:string;manualReviewCompleted:boolean};
  lint:{afterCount:number;profileContexts:number};
}>;
const ledger=read("docs/research/sources-question-flags2-round2-20261105.json") as {
  sources:Array<{id:string;completeCitation:string;accessedOn:string;officialUrl:string|null;doi:string|null;licenseLabel:string;authorityAssessment:string}>;
  holds:Array<{id:string;scope:string;acceptanceAllowed:boolean}>;
};
const save=(v:unknown)=>JSON.stringify(v);
const clone=<T>(v:T):T=>JSON.parse(JSON.stringify(v)) as T;
const find=(id:string)=>{const r=revisions.find(r=>r.auditId===id)!;const cs=view.cases.find(c=>c.id===r.caseId)!;return {r,cs,node:cs.decisionNodes.find(n=>n.id===r.nodeId)!};};

describe("flags2 round-two drafts and exact G06 manager acceptance",()=>{
  it("retains seven input cases and changes only the seven declared returned nodes",()=>{
    expect(revisions).toHaveLength(7);expect(input.cases).toHaveLength(7);
    expect(new Set(revisions.map(r=>r.caseId)).size).toBe(6);
    expect(syntheticClinicalReleaseSchema.safeParse(view).success).toBe(true);
    expect(applyQuestionFlags2Round2Revisions(input.cases)).toEqual(view.cases);
    for(const cs of input.cases)for(const n of cs.decisionNodes){
      if(!revisions.some(r=>r.caseId===cs.id&&r.nodeId===n.id))expect(view.cases.find(c=>c.id===cs.id)!.decisionNodes.find(d=>d.id===n.id)).toEqual(n);
    }
  });

  it("preserves the exact passed G06 definition and projects its header, node and new history card only",()=>{
    const r=QUESTION_FLAGS2_REVISIONS.find(r=>r.auditId==="G06")!;
    const rows=manifest.accepted.filter(a=>a.sourceView==="flags2-round1");expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual({acceptanceId:"G06",caseId:r.caseId,nodeId:r.nodeId,questionVariantId:r.questionVariantId,conceptId:r.question.conceptId,
      sourceView:"flags2-round1",decision:"docs/research/question-flags2-manager-decision-20261105.md"});
    expect(manifest.headerSources[r.caseId]).toBe("flags2-round1");
    expect(live.cases.find(c=>c.id===r.caseId)).toEqual(round1.cases.find(c=>c.id===r.caseId));
    expect(live.concepts.some(c=>c.id===r.question.conceptId)).toBe(true);
    expect(r.question.reviewStatus).toBe("needs_clinician_review");expect(r.question.lastClinicianReview).toBeNull();
    expect(packet.find(p=>p.id==="G06")).toMatchObject({pipelinePassed:true,releaseReady:false,sourceVerificationHold:null});
    for(const path of ["packages/clinical-content/src/question-flags2-20261105.ts","packages/clinical-content/src/question-flags2-20261105-data.ts",
      "packages/clinical-content/src/question-flags2-evidence-20261105.ts","packages/clinical-content/src/question-flags2-retained-input-20261105.ts",
      "docs/research/question-flags2-20261105.json","docs/research/sources-question-flags2-20261105.json"]){
      expect(createHash("sha256").update(readFileSync(new URL("../../../"+path,import.meta.url))).digest("hex"),path).toBe(capture.files[path]);
    }
  });

  it("keeps every earlier acceptance and all historical concepts intact",()=>{
    expect(manifest.legacyBindings).toEqual(capture.manifest.legacyBindings);
    expect(manifest.accepted.filter(a=>a.acceptanceId!=="G06")).toEqual(capture.manifest.accepted);
    for(const c of capture.release.concepts)expect(live.concepts.find(n=>n.id===c.id)).toEqual(c);
    expect(live.cases).toHaveLength(capture.release.cases.length);
    for(const r of revisions){
      expect(manifest.accepted.some(a=>a.questionVariantId===r.questionVariantId)).toBe(false);
      const old=capture.release.cases.find(c=>c.id===r.caseId)!;
      expect(save(live.cases.find(c=>c.id===r.caseId))).toBe(save(old));
    }
  });

  it("binds G03 directly to the flagged live v1, preserving its returned gate and old follow-up",()=>{
    const {r,cs}=find("G03"),old=capture.release.cases.find(c=>c.id===r.caseId)!;
    expect(r.previousQuestionVariantId).toBe("question.palpable-breast.negative-mammogram-targeted-us.v1");
    expect(r.questionVariantId).toBe("question.palpable-breast.negative-mammogram-targeted-us.v1.r3");
    expect(r.previousQuestionVariantId).not.toContain(".r2");
    expect(cs.decisionNodes[1]).toEqual(old.decisionNodes[1]);
    expect(cs.decisionNodes[0]!.resultGateAfter).toEqual(old.decisionNodes[0]!.resultGateAfter);
    expect(cs.presentation).not.toContain("has not been assessed");
    const exhibit=cs.decisionNodes[0]!.exhibit;
    expect(exhibit?.kind).toBe("table");
    if(exhibit?.kind==="table")expect(exhibit.caption).toContain("acquisitions");
  });

  it("keeps original G04 live until a separately scored replacement passes and is accepted",()=>{
    const {r,node}=find("G04-R");
    expect(r.previousQuestionVariantId).toBe("question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v1");
    expect(r.question.conceptId).toBe("concept.early-pregnancy.location-before-disposition.v1");
    expect(live.cases.find(c=>c.id===r.caseId)!.decisionNodes[0]!.questionVariantId).toBe(r.previousQuestionVariantId);
    expect(node.stem).toContain("same-day diagnostic plan");
    expect(node.answerChoices.every(a=>!/CBC|lipase|creatinine/.test(a.label))).toBe(true);
    expect(packet.find(p=>p.id==="G04-R")!.sourceVerificationHold).toBeTruthy();
  });

  it("keeps the referral before the DXA gate and genetic clarification distinct from skeletal-site recall",()=>{
    const first=find("G05-staging"),second=find("G05");
    expect(first.cs.presentation).toContain("referral and baseline skeletal assessment were ordered at that visit");
    expect(first.node.resultGateAfter).toEqual(input.cases.find(c=>c.id===first.cs.id)!.decisionNodes[0]!.resultGateAfter);
    expect(first.node.explanation).not.toMatch(/CASR|genetic|clearance ratio|familial/i);
    const pairs=first.node.answerChoices.map(a=>a.label.split(" and "));
    expect(new Set(pairs.map(p=>p[0])).size).toBe(2);expect(new Set(pairs.map(p=>p[1])).size).toBe(2);
    expect(new Set(pairs.map(p=>save(p))).size).toBe(4);
    expect(first.r.basicRecallIntentional).not.toBe(true);
    expect(second.node.stem).toContain("parathyroid planning");
    expect(second.node.currentUpdate).toContain("ratio below 0.01");
    expect(second.node.currentUpdate).toContain("mother's records");
    expect(second.node.answerChoices.find(a=>a.isCorrect)!.label).toBe("Calcium-sensing receptor gene assay");
  });

  it("compares tissue method and allocation on the same PTLD target instead of fluid/debris foils",()=>{
    const {node}=find("G07"),pairs=node.answerChoices.map(a=>a.label.split(" with "));
    expect(new Set(pairs.map(p=>p[0])).size).toBe(2);expect(new Set(pairs.map(p=>p[1])).size).toBe(2);
    expect(new Set(pairs.map(p=>save(p))).size).toBe(4);
    expect(node.exhibit?.kind).toBe("table");
    expect(save(node.exhibit)).toContain("same left supraclavicular node");
    expect(node.answerChoices.some(a=>/debris|central|peripheral|aspiration/i.test(a.label))).toBe(false);
  });

  it("versions all seven changed scored meanings while preserving the prior source concepts",()=>{
    expect(concepts).toHaveLength(7);expect(view.concepts.slice(0,input.concepts.length)).toEqual(input.concepts);
    for(const c of concepts){
      expect(input.concepts.some(old=>old.id===c.previousConceptId)).toBe(true);
      expect(c.reviewStatus).toBe("needs_clinician_review");expect(c.lastClinicianReview).toBeNull();
      expect(c.versioningReason.length).toBeGreaterThan(60);
    }
  });

  it("retains every pre-existing non-N3 timing row and adds just one accepted G06 row globally",()=>{
    expect(QUESTION_FLAGS2_ACCEPTED_TIMING_ENTRIES).toHaveLength(1);
    expect(QUESTION_FLAGS2_ACCEPTED_TIMING_ENTRIES[0]!.classification).toEqual({kind:"no_test"});
    for(const row of capture.timings.filter(t=>!t.questionVariantId.startsWith("question.n3."))){
      expect(ANSWER_CHOICE_TIMING_REGISTRY.find(t=>t.caseId===row.caseId&&t.nodeId===row.nodeId&&t.questionVariantId===row.questionVariantId)).toEqual(row);
    }
    for(const r of revisions)expect(ANSWER_CHOICE_TIMING_REGISTRY.some(t=>t.questionVariantId===r.questionVariantId)).toBe(false);
  });

  it("exports exact candidate waits/orders without executing new services",()=>{
    expect(timings).toHaveLength(7);expect(orders).toHaveLength(21);
    expect(orders.filter(o=>o.disposition.kind==="result_gate_route_override")).toHaveLength(2);
    expect(orders.filter(o=>o.disposition.kind==="not_executed")).toHaveLength(19);
    for(const t of timings)if(t.classification.kind==="test_choices")for(const choice of t.classification.choices){
      if(choice.timing.kind!=="test")continue;
      const rows=orders.filter(o=>o.caseId===t.caseId&&o.nodeId===t.nodeId&&o.questionVariantId===t.questionVariantId&&o.choiceId===choice.choiceId);
      expect(rows).toHaveLength(1);expect(rows[0]!.choiceLabel).toBe(choice.choiceLabel);expect(rows[0]!.timingProfileId).toBe(choice.timing.timingProfileId);
    }
  });

  it("keeps unsupported keyed extensions held, the supported G03 application distinct and all new mappings unapproved",()=>{
    expect(claims).toHaveLength(20);expect(ledger.holds).toHaveLength(5);expect(ledger.sources).toHaveLength(19);
    for(const claim of claims){
      expect(claim.reviewStatus).toBe("needs_clinician_review");expect(claim.lastClinicianReview).toBeNull();
      expect(claim.basisClaimIds.length).toBeGreaterThan(0);expect(claim.sourceIds.length).toBeGreaterThan(0);
      for(const id of claim.sourceIds)expect(ledger.sources.some(s=>s.id===id)).toBe(true);
      expect(claim.verificationScope).toContain("No source retrieval");
    }
    for(const hold of ledger.holds)expect(hold).toMatchObject({scope:"key",acceptanceAllowed:false});
    for(const s of ledger.sources){
      expect(s.completeCitation.length).toBeGreaterThan(30);expect(s.officialUrl||s.doi).toBeTruthy();
      expect(s.accessedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);expect(s.licenseLabel.length).toBeGreaterThan(5);expect(s.authorityAssessment.length).toBeGreaterThan(5);
    }
  });

  it("records all 86 returned notes, manual rubric details and zero lint across 31 contexts",()=>{
    expect(packet.map(p=>p.id)).toEqual(["G01","G02","G03","G04-R","G05","G05-staging","G06","G07"]);
    let notes=0,contexts=0;
    for(const r of revisions){
      const p=packet.find(p=>p.id===r.auditId)!,review=capture.review.find(row=>row.id===(r.auditId==="G04-R"?"G04":r.auditId))!;
      for(const category of ["cues","fairness","suggestions"] as const){
        const responses=p.reviewResponse.notes.filter(n=>n.category===category);
        expect(responses).toHaveLength(review[category].length);
        responses.forEach((n,i)=>{expect(n.index).toBe(i+1);expect(n.note).toEqual(review[category][i]);expect(n.response.length).toBeGreaterThan(20);});
      }
      notes+=p.reviewResponse.notes.length;contexts+=p.lint.profileContexts;
      expect(p).toMatchObject({pipelinePassed:false,releaseReady:false});
      if(["G03","G05"].includes(r.auditId))expect(p.sourceVerificationHold).toBeNull();else expect(p.sourceVerificationHold).toBeTruthy();
      expect(p.keyOrderNotice).toContain("review only");expect(p.lint.afterCount).toBe(0);
      expect(p.selfCheck.reasoningSteps).toHaveLength(2);expect(p.selfCheck.cueAttack.length).toBeGreaterThan(80);
      expect(p.selfCheck.closestCredibleError.length).toBeGreaterThan(50);expect(p.selfCheck.counterfactual.length).toBeGreaterThan(50);
      expect(p.selfCheck.decidingFinding.length).toBeGreaterThan(50);expect(p.selfCheck.manualReviewCompleted).toBe(true);
    }
    expect(notes).toBe(86);expect(contexts).toBe(31);
  });

  it.each(revisions)("keeps $auditId named, versioned, randomized, unapproved and fully timed",r=>{
    const {cs,node}=find(r.auditId);
    expect(node.explanation).not.toMatch(/source alignment|before acceptance|verification hold|remains held|source confirmation/i);
    expect(node.questionVariantId).not.toBe(r.previousQuestionVariantId);expect(node.shuffleAnswers).toBe(true);
    expect(node.stem).toContain("{patientName}");expect([3,4]).toContain(node.answerChoices.length);
    expect(node.answerChoices.filter(a=>a.isCorrect)).toHaveLength(1);
    expect(node.answerChoices.some(a=>/\balone\b|\bindividuali[sz]ed\b|\btailored\b/i.test(a.label))).toBe(false);
    expect(r.question.reviewStatus).toBe("needs_clinician_review");expect(r.question.lastClinicianReview).toBeNull();
    for(const p of [{presentation:cs.presentation,chiefComplaint:cs.chiefComplaint},...(cs.approvedInstantiationProfiles??[])]){
      expect(p.presentation).toContain("{patientName}");expect(p.presentation).toMatch(/\d+-year-old (woman|man|person)/);
      expect(p.presentation).not.toMatch(/\{ageYears\}|\{sexNoun\}/);expect((p.chiefComplaint??cs.chiefComplaint??"").split(/\s+/).length).toBeLessThanOrEqual(5);
    }
    const row=timings.filter(t=>t.caseId===cs.id&&t.nodeId===node.id&&t.questionVariantId===node.questionVariantId);expect(row).toHaveLength(1);
    if(row[0]!.classification.kind==="test_choices")for(const a of node.answerChoices){
      const t=row[0]!.classification.choices.find(c=>c.choiceId===a.id)!;expect(t.choiceLabel).toBe(a.label);expect(t.timing).toEqual(r.choiceTimingOverrides![a.id]);
    }
  });

  it.each(["variant","concept","gate","presentation"] as const)("rejects %s drift in the retained source",field=>{
    const cases=clone(input.cases),r=revisions.find(r=>r.auditId===(field==="gate"?"G05-staging":"G01"))!;
    const cs=cases.find(c=>c.id===r.caseId)!,n=cs.decisionNodes.find(n=>n.id===r.nodeId)!;
    if(field==="variant")n.questionVariantId+=".drift";
    if(field==="concept")n.primaryConceptId="concept.unrelated";
    if(field==="gate")n.resultGateAfter!.resultNarrative+=" drift";
    if(field==="presentation")cs.presentation+=" drift";
    expect(()=>applyQuestionFlags2Round2Revisions(cases)).toThrow(/binding changed/i);
  });
});
