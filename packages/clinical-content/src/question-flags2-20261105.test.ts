import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {
  QUESTION_FLAGS2_REVISIONS as revisions,
  QUESTION_FLAGS2_AUTHORING_CONCEPTS as concepts,
  QUESTION_FLAGS2_CLAIMS as claims,
  QUESTION_FLAGS2_RETAINED_INPUT as input,
  QUESTION_FLAGS2_RETAINED_TIMING_INPUTS as oldTimings,
  QUESTION_FLAGS2_ROUND1_SOURCE_RELEASE as view,
  QUESTION_FLAGS2_TIMING_ENTRIES as timings,
  QUESTION_FLAGS2_CANDIDATE_TEST_ORDER_RECORDS as orders,
  QUESTION_FLAGS2_SOURCE_VIEW_NAME,
  applyQuestionFlags2Revisions,
} from "./question-flags2-20261105";
import {QUESTION_FLAGS_PRE_REVISION_RELEASE as legacy,SYNTHETIC_CLINICAL_RELEASE as actualLive} from "./synthetic-content";
import {beforeWholeCaseReplacementRelease} from "./question-ship-case-replacements-test-support";
import {syntheticClinicalReleaseSchema,type SyntheticClinicalCase} from "./schema";
import {QUESTION_SHIP_MANIFEST as actualManifest} from "./question-ship-manifest";
import {beforeStats1AcceptanceManifest} from "./question-stats1-acceptance-test-support";
const QUESTION_SHIP_MANIFEST=beforeStats1AcceptanceManifest(actualManifest);

const read=(path:string)=>JSON.parse(readFileSync(new URL("../../../"+path,import.meta.url),"utf8"));
// This test freezes round one's release epoch; the helper first proves that
// today's default differs only by the two exact manager-accepted whole cases.
const live=beforeWholeCaseReplacementRelease(actualLive);
const capture=read("tools/question-quality/fixtures/question-flags2-before-20261105.json") as {
  items:{id:string;variantId:string;clinicalCase:SyntheticClinicalCase}[];
  files:Record<string,string>;
  sources:{id:string;accessedOn:string}[];
};
const packet=read("docs/research/question-flags2-20261105.json") as {
  id:string;status:string;sourceVerificationHold:string|null;
  before:{variantId:string};after:{variantId:string};
  rationalePairs:{before:[string,string][];after:[string,string][]};
  companionRevisions?:{id:string;after:{variantId:string}}[];
  keyOrderNotice:string;pipelinePassed:boolean;releaseReady:boolean;
}[];
const ledger=read("docs/research/sources-question-flags2-20261105.json") as {sources:{id:string;accessedOn:string;completeCitation:string;licenseLabel:string;authorityAssessment:string;officialUrl:string|null;doi:string|null}[]};
const clone=<T>(value:T):T=>JSON.parse(JSON.stringify(value)) as T;
const find=(id:string)=>{const r=revisions.find(r=>r.auditId===id)!;return {r,cs:view.cases.find(cs=>cs.id===r.caseId)!,node:view.cases.find(cs=>cs.id===r.caseId)!.decisionNodes.find(n=>n.id===r.nodeId)!};};

describe("owner flags2 retained candidates",()=>{
  it("retains the five exact input cases and changes six explicitly bound nodes",()=>{
    expect(input.cases).toHaveLength(5);expect(revisions).toHaveLength(6);
    expect(input.cases).toEqual(capture.items.filter(i=>["G01","G02","G05","G06","G07"].includes(i.id)).map(i=>i.clinicalCase));
    expect(syntheticClinicalReleaseSchema.safeParse(view).success).toBe(true);
    const original=clone(input.cases);
    expect(applyQuestionFlags2Revisions(input.cases)).toEqual(view.cases);
    expect(input.cases).toEqual(original);
    for(const cs of input.cases)for(const n of cs.decisionNodes){
      const next=view.cases.find(c=>c.id===cs.id)!.decisionNodes.find(d=>d.id===n.id)!;
      if(!revisions.some(r=>r.caseId===cs.id&&r.nodeId===n.id))expect(next).toEqual(n);
    }
  });

  it("keeps old cards and versions only the three materially changed scored objectives",()=>{
    expect(concepts.map(c=>c.revisedItemIds[0])).toEqual(["G02","G06","G07"]);
    expect(view.concepts.slice(0,input.concepts.length)).toEqual(input.concepts);
    for(const c of concepts){
      expect(input.concepts.some(old=>old.id===c.previousConceptId)).toBe(true);
      expect(c.reviewStatus).toBe("needs_clinician_review");expect(c.lastClinicianReview).toBeNull();
      expect(c.versioningReason.length).toBeGreaterThan(60);
    }
    for(const id of ["G01","G05","G05-staging"]){const {r}=find(id);expect(r.question.conceptId).toBe(r.clinicalBinding.previousConceptId);}
  });

  it("retains the historical candidate view and projects only the manager-accepted exact G06",()=>{
    expect(QUESTION_FLAGS2_SOURCE_VIEW_NAME).toBe("flags2-round1");
    for(const r of revisions){
      const row=QUESTION_SHIP_MANIFEST.accepted.find(a=>a.questionVariantId===r.questionVariantId);
      if(r.auditId==="G06"){
        expect(row).toMatchObject({acceptanceId:"G06",sourceView:"flags2-round1",decision:"docs/research/question-flags2-manager-decision-20261105.md"});
        expect(live.cases.find(c=>c.id===r.caseId)).toEqual(view.cases.find(c=>c.id===r.caseId));
      }else{
        expect(row).toBeUndefined();
        expect(live.cases.find(c=>c.id===r.caseId)!.decisionNodes.find(n=>n.id===r.nodeId)!.questionVariantId).toBe(r.previousQuestionVariantId);
      }
    }
    expect(view.cases).toHaveLength(5);
    expect(view.concepts).toHaveLength(input.concepts.length+3);
  });

  it("keeps all eight ITP siblings as recorded rather than inventing a marrow sequence",()=>{
    const siblings=legacy.cases.filter(c=>c.id.startsWith("case.persistent-itp."));
    expect(siblings).toHaveLength(4);
    for(const cs of siblings){
      const [first,second]=cs.decisionNodes;
      expect(first!.questionVariantId).toMatch(/hiv-hcv-secondary-evaluation/);
      expect(first!.answerChoices.find(a=>a.isCorrect)!.label).toBe("HIV and HCV serology");
      expect(second!.questionVariantId).toMatch(/defer-elective-splenectomy/);
      expect(second!.answerChoices.find(a=>a.isCorrect)!.label).toBe("Defer elective splenectomy");
    }
    expect(packet.find(p=>p.id==="G01")!.sourceVerificationHold).toMatch(/marrow boundary/);
    expect(find("G01").node.explanation).toMatch(/not.*never appropriate/);
  });

  it("retains the historical G03 coverage receipt and the unretired G04 live version",()=>{
    // This freezes the round-one receipt, not an accepted-coverage claim.
    // The manager now directs a separate G03 repair bound directly to live v1.
    expect(packet.find(p=>p.id==="G03")!.status).toBe("covered_in_frozen_batch2b_round2");
    expect(packet.find(p=>p.id==="G04")!.status).toBe("propose_merge_or_retire_keep_live_pending_manager");
    expect(revisions.some(r=>r.auditId==="G03"||r.auditId==="G04")).toBe(false);
    for(const id of ["G03","G04"]){const old=capture.items.find(i=>i.id===id)!;
      expect(live.cases.find(c=>c.id===old.clinicalCase.id)).toEqual(old.clinicalCase);
    }
    const b2b=read("docs/research/question-bank-batch2b-round2-20261104.json") as {id:string;after:{variantId:string}}[];
    expect(b2b.find(p=>p.id==="B2B36")!.after.variantId).toBe("question.palpable-breast.negative-mammogram-targeted-us.v1.r2");
    for(const[path,hash]of Object.entries(capture.files).filter(([p])=>/question-bank-batch2b/.test(p))){
      expect(createHash("sha256").update(readFileSync(new URL("../../../"+path,import.meta.url))).digest("hex"),path).toBe(hash);
    }
  });

  it("keeps the DXA route and frames it alongside, not as permission for, the operation",()=>{
    const {node:first}=find("G05-staging"),{cs,node:second}=find("G05");
    expect(first.stem).toContain("alongside");
    expect(first.resultGateAfter).toEqual(input.cases.find(c=>c.id===cs.id)!.decisionNodes[0]!.resultGateAfter);
    expect(second.answerChoices.find(a=>a.isCorrect)!.label).toContain("Recommend parathyroidectomy");
    expect(cs.approvedInstantiationProfiles!.every(p=>p.prototypeDemographics!==undefined&&p.prototypeDemographics.ageYears<50)).toBe(true);
    expect(second.explanation).toContain("does not create the age-based indication");
    expect(revisions.find(r=>r.auditId==="G05-staging")!.basicRecallIntentional).toBe(true);
  });

  it("derives each statistical foil from a real competing denominator or cohort",()=>{
    const {node}=find("G06");expect(node.exhibit?.kind).toBe("table");
    if(node.exhibit?.kind!=="table")throw new Error("Missing audit");
    const [a,b]=node.exhibit.cells.map(row=>row.map(Number));
    expect(a!.reduce((s,x)=>s+x,0)).toBe(1000);expect(b!.reduce((s,x)=>s+x,0)).toBe(1000);
    expect(Math.round(100*a![0]!/(a![0]!+a![1]!))).toBe(70);
    expect(Math.round(100*b![0]!/(b![0]!+b![1]!))).toBe(92);
    for(const row of [a!,b!]){expect(row[0]!/(row[0]!+row[2]!)).toBe(0.9);expect(row[3]!/(row[3]!+row[1]!)).toBe(0.98);}
    expect((a![0]!+a![2]!)/1000).toBe(0.05);
    expect(node.stem).not.toMatch(/where.*collected|matching.*cohort/);
    expect(node.exhibit.caption).toContain("Constructed");
  });

  it("balances both sampling dimensions instead of constructing a convergent key",()=>{
    const {node}=find("G07"),pairs=node.answerChoices.map(a=>a.label.split(" with "));
    expect(new Set(pairs.map(p=>p[0])).size).toBe(2);
    expect(new Set(pairs.map(p=>p[1])).size).toBe(2);
    expect(new Set(pairs.map(p=>JSON.stringify(p))).size).toBe(4);
    expect(node.stem).toContain("neck lymph node");
    expect(packet.find(p=>p.id==="G07")!.sourceVerificationHold).toMatch(/PTLD-specific/);
  });

  it("has one exact candidate order for every timed choice, without new execution",()=>{
    expect(timings).toHaveLength(6);expect(orders).toHaveLength(8);expect(oldTimings).toHaveLength(6);
    const tests=timings.flatMap(t=>t.classification.kind==="test_choices"?t.classification.choices.filter(c=>c.timing.kind==="test").map(c=>({t,c})):[]);
    expect(tests).toHaveLength(8);
    for(const{t,c}of tests){
      const rows=orders.filter(o=>o.caseId===t.caseId&&o.nodeId===t.nodeId&&o.questionVariantId===t.questionVariantId&&o.choiceId===c.choiceId);
      expect(rows).toHaveLength(1);expect(rows[0]!.choiceLabel).toBe(c.choiceLabel);
      if(c.timing.kind==="test")expect(rows[0]!.timingProfileId).toBe(c.timing.timingProfileId);
    }
    expect(orders.filter(o=>o.disposition.kind==="result_gate_route_override")).toHaveLength(1);
    expect(orders.filter(o=>o.disposition.kind==="not_executed")).toHaveLength(7);
  });

  it("records atomic mappings, original access dates and explicit source holds",()=>{
    expect(claims).toHaveLength(19);
    for(const claim of claims){
      expect(claim.reviewStatus).toBe("needs_clinician_review");expect(claim.lastClinicianReview).toBeNull();
      expect(claim.sourceIds.length).toBeGreaterThan(0);expect(claim.basisClaimIds.length).toBeGreaterThan(0);
      for(const id of claim.sourceIds)expect(ledger.sources.some(s=>s.id===id)).toBe(true);
    }
    for(const s of ledger.sources){
      expect(s.completeCitation.length).toBeGreaterThan(40);expect(s.licenseLabel.length).toBeGreaterThan(10);expect(s.authorityAssessment.length).toBeGreaterThan(10);
      expect(s.officialUrl||s.doi).toBeTruthy();
      const original=capture.sources.find(p=>p.id===s.id);if(original)expect(s.accessedOn).toBe(original.accessedOn);
    }
    for(const id of ["G01","G02","G07"])expect(packet.find(p=>p.id===id)!.sourceVerificationHold).toBeTruthy();
  });

  it("keeps all seven owner dispositions and labels the key-first packet as review only",()=>{
    expect(packet.map(p=>p.id)).toEqual(["G01","G02","G03","G04","G05","G06","G07"]);
    expect(packet.find(p=>p.id==="G05")!.companionRevisions![0]!.id).toBe("G05-staging");
    for(const p of packet){
      expect(p.keyOrderNotice).toContain("review only");expect(p.pipelinePassed).toBe(false);expect(p.releaseReady).toBe(false);
      for(const pairs of [p.rationalePairs.before,p.rationalePairs.after]){
        expect(pairs[0]![0]).toMatch(/^\*\*KEY:\*\* /);expect([3,4]).toContain(pairs.length);
        for(const pair of pairs)expect(pair[1].length).toBeGreaterThan(5);
      }
    }
  });

  it.each(revisions)("keeps $auditId named, versioned, randomized and fully timed",r=>{
    const {cs,node}=find(r.auditId);
    expect(node.questionVariantId).not.toBe(r.previousQuestionVariantId);expect(node.shuffleAnswers).toBe(true);
    expect(node.stem).toContain("{patientName}");expect([3,4]).toContain(node.answerChoices.length);
    expect(node.answerChoices.filter(a=>a.isCorrect)).toHaveLength(1);
    expect(node.answerChoices.some(a=>/\balone\b|\bindividuali[sz]ed\b/i.test(a.label))).toBe(false);
    expect(r.question.reviewStatus).toBe("needs_clinician_review");expect(r.question.lastClinicianReview).toBeNull();
    for(const p of [{presentation:cs.presentation,chiefComplaint:cs.chiefComplaint},...(cs.approvedInstantiationProfiles??[])]){
      expect(p.presentation).toContain("{patientName}");expect(p.presentation).toMatch(/\d+-year-old (?:woman|man|person)/);
      expect(p.presentation).not.toMatch(/\{ageYears\}|\{sexNoun\}/);expect((p.chiefComplaint??cs.chiefComplaint??"").split(/\s+/).length).toBeLessThanOrEqual(5);
    }
    const timing=timings.filter(t=>t.questionVariantId===r.questionVariantId);expect(timing).toHaveLength(1);
    expect(r.clinicalBinding.nextKeyServiceId).toBe(r.clinicalBinding.previousKeyServiceId);
    expect(r.clinicalBinding.nextResultGate).toEqual(r.clinicalBinding.previousResultGate);
  });

  it.each(["variant","concept","gate","presentation"] as const)("rejects %s source drift rather than silently rewriting another version",field=>{
    const cases=clone(input.cases),r=revisions.find(r=>r.auditId===(field==="gate"?"G05-staging":"G01"))!;
    const cs=cases.find(c=>c.id===r.caseId)!,node=cs.decisionNodes.find(n=>n.id===r.nodeId)!;
    if(field==="variant")node.questionVariantId+=".drift";
    if(field==="concept")node.primaryConceptId="concept.unrelated";
    if(field==="gate")node.resultGateAfter!.resultNarrative+=" drift";
    if(field==="presentation")cs.presentation+=" drift";
    expect(()=>applyQuestionFlags2Revisions(cases)).toThrow(/binding changed/i);
  });
});
