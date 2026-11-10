import {beforeFlags3AcceptanceRelease,beforeFlags3AcceptanceManifest,beforeFlags3AcceptanceTimings,beforeFlags3AcceptanceSource} from "./question-flags3-acceptance-test-support";
import {createHash} from "node:crypto";
import {readFileSync,existsSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {PROTOTYPE_BALANCE_RELEASE} from "@gamify-surgery/balance-config";
import {SYNTHETIC_CLINICAL_RELEASE as actualLive,QUESTION_CATALOG_RELEASE as catalog} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as actualManifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as actualTiming} from "./answer-choice-timing";
import {syntheticClinicalReleaseSchema} from "./schema";
import {
 QUESTION_FLAGS3_SOURCE_RELEASE as view,QUESTION_FLAGS3_REVISIONS as revisions,QUESTION_FLAGS3_QUESTIONS as questions,
 QUESTION_FLAGS3_CLAIMS as claims,QUESTION_FLAGS3_BASIS_CLAIMS as basis,QUESTION_FLAGS3_SOURCES as sources,
 QUESTION_FLAGS3_TIMING_ENTRIES as estimates,QUESTION_FLAGS3_CANDIDATE_TEST_ORDER_RECORDS as orders,
 QUESTION_FLAGS3_NEW_TESTED_CONCEPTS as newConcepts,QUESTION_FLAGS3_SOURCE_LINKS as links,
 QUESTION_FLAGS3_RETAINED_INPUT as input,applyQuestionFlags3Revisions,
} from "./question-flags3-20261107";
const live=beforeFlags3AcceptanceRelease(actualLive),manifest=beforeFlags3AcceptanceManifest(actualManifest),timing=beforeFlags3AcceptanceTimings(actualTiming);
const read=(p:string)=>JSON.parse(readFileSync(new URL("../../../"+p,import.meta.url),"utf8"));
const capture=read("tools/question-quality/fixtures/question-flags3-before-20261107.json") as {
 live:{sha256:string};catalogSha256:string;manifestSha256:string;timingSha256:string;files:Record<string,string>;
};
const packet=read("docs/research/question-flags3-20261107.json") as Array<{
 id:string;holdStatus:string;sourceVerificationHold:null;pipelinePassed:boolean;reviewStatus:string;keyOrderNotice:string;
 after:{Presentation:string;"Current update":string|null;Exhibit:unknown;Task:string;Options:string[]};
 selfCheck:{manualReviewCompleted:boolean;reasoningSteps:string[];closestCredibleError:string;decidingFinding:string;counterfactual:string;residentDifficulty:string};
 lint:{afterCount:number;suppressedFindings:number};conceptId:string;
}>;
const lint=read("tools/question-quality/question-flags3-lint-20261107.json") as {totals:{newVariants:number;profileContexts:number;newVariantContexts:number;newVariantFindings:number;preservedContextFindings:number;suppressedFindings:number}};
const digest=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const find=(id:string)=>{const r=revisions.find(r=>r.auditId===id)!,cs=view.cases.find(cs=>cs.id===r.caseId)!,node=cs.decisionNodes.find(n=>n.id===r.nodeId)!;return {r,cs,node};};

describe("flags3 exact owner-flag candidates and retained live source",()=>{
 it("creates four draft questions for three flags without changing live/catalog/manifest/timing",()=>{
  expect(syntheticClinicalReleaseSchema.safeParse(view).success).toBe(true);
  expect(view.cases).toHaveLength(3);expect(revisions).toHaveLength(4);expect(questions).toHaveLength(4);
  expect(view.cases.map(c=>c.decisionNodes.length)).toEqual([1,2,2]);
  expect(digest(live)).toBe(capture.live.sha256);expect(digest(catalog)).toBe(capture.catalogSha256);
  expect(digest(manifest)).toBe(capture.manifestSha256);expect(digest(timing)).toBe(capture.timingSha256);
  for(const q of questions){expect(manifest.accepted.some(r=>r.questionVariantId===q.id)).toBe(false);expect(live.cases.some(c=>c.decisionNodes.some(n=>n.questionVariantId===q.id))).toBe(false);}
 });
 it.each(revisions)("keeps $auditId named, fully tasked, randomized and unapproved",r=>{
  const {cs,node}=find(r.auditId),p=packet.find(p=>p.id===r.auditId)!;
  expect(cs.patientDisplayName).not.toContain("{patientName}");
  expect(cs.prototypeDemographics?.ageYears).toBeGreaterThan(0);expect(cs.prototypeDemographics?.sexLabel).toBe("Male");
  expect(cs.presentation.replaceAll("{patientName}",cs.patientDisplayName)).toContain(cs.patientDisplayName);
  expect(cs.presentation).toContain(`${cs.prototypeDemographics!.ageYears}-year-old man`);
  expect(cs.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
  expect(node.stem).toContain("{patientName}");expect(node.shuffleAnswers).toBe(true);
  expect([3,4]).toContain(node.answerChoices.length);expect(node.answerChoices.filter(a=>a.isCorrect)).toHaveLength(1);
  expect(node.answerChoices.every(a=>a.serviceRequest===null)).toBe(true);
  expect(r.question.reviewStatus).toBe("needs_clinician_review");expect(r.question.lastClinicianReview).toBeNull();
  expect(p).toMatchObject({holdStatus:"none",sourceVerificationHold:null,pipelinePassed:false,reviewStatus:"needs_clinician_review"});
  expect(p.keyOrderNotice).toContain("key shown first for review only");expect(p.after.Options.filter(a=>a.startsWith("**KEY:** "))).toHaveLength(1);
  expect(p.selfCheck.manualReviewCompleted).toBe(true);expect(p.selfCheck.reasoningSteps).toHaveLength(2);
  for(const value of [p.selfCheck.closestCredibleError,p.selfCheck.decidingFinding,p.selfCheck.counterfactual,p.selfCheck.residentDifficulty])expect(value.length).toBeGreaterThan(70);
  for(const profile of cs.approvedInstantiationProfiles!){expect(profile.prototypeDemographics).toEqual(cs.prototypeDemographics);expect(profile.presentation).toBe(cs.presentation);expect(profile.chiefComplaint).toBe(cs.chiefComplaint);}
 });
 it("scores the positive-screen denominator, with complete original counts and no conflicting specialty story",()=>{
  const {node}=find("F3-01"),e=node.exhibit!;expect(e.kind).toBe("table");if(e.kind!=="table")return;
  expect(e.cells).toEqual([["40","95"],["10","855"]]);
  const counts=e.cells.map(row=>row.map(Number)),ppv=Math.round(100*counts[0]![0]!/(counts[0]![0]!+counts[0]![1]!));
  expect(ppv).toBe(30);expect(node.answerChoices.find(a=>a.isCorrect)?.label).toBe(`About ${ppv}%`);
  expect(Math.round(100*counts[0]![0]!/(counts[0]![0]!+counts[1]![0]!))).toBe(80);
  expect(Math.round(100*counts[1]![1]!/(counts[0]![1]!+counts[1]![1]!))).toBe(90);
  expect(Math.round(100*counts[0]![1]!/(counts[0]![0]!+counts[0]![1]!))).toBe(70);
  expect(JSON.stringify(packet.find(p=>p.id==="F3-01")!.after)).not.toMatch(/aldosteron|breast.cancer|subscription|hypothetical|same sensitivity/i);
 });
 it("preserves the preceding dysphagia question/gate exactly and moves results into one report",()=>{
  const {cs,node}=find("F3-02"),old=input.cases.find(c=>c.id===cs.id)!;
  expect(cs.decisionNodes[0]).toEqual(old.decisionNodes[0]);
  expect(cs.presentation).not.toMatch(/endoscop|contrast|narrowing|weight/i);expect(node.currentUpdate).toMatch(/weight loss/);
  expect(node.currentUpdate).not.toMatch(/endoscop|CT|resistance/);
  expect(cs.prototypeDemographics).toEqual({ageYears:66,sexLabel:"Male"});expect(cs.patientDisplayName).toBe("Gavin Keller");
  const e=node.exhibit!;expect(e.kind).toBe("keyValue");if(e.kind!=="keyValue")return;
  expect(e.items).toHaveLength(6);expect(e.items.map(i=>i.label)).toContain("Junction mucosal biopsy");
  expect(JSON.stringify(e)).not.toMatch(/pseudoachalasia|malignant lesion|achalasia pattern/);
  expect(node.answerChoices.every(a=>!a.label.includes("junction-wall"))).toBe(true);
 });
 it("adds hernia type before management without naming a diagnosis or leaking the repair rule",()=>{
  const {cs,node}=find("F3-03-type"),plan=find("F3-03").node;
  expect(cs.decisionNodes[0]).toBe(node);expect(cs.decisionNodes[1]).toBe(plan);
  expect(node.answerChoices.map(a=>a.label)).toEqual(["Femoral hernia","Direct inguinal hernia","Indirect inguinal hernia"]);
  expect(JSON.stringify({presentation:cs.presentation,update:node.currentUpdate,exhibit:node.exhibit,task:node.stem}))
   .not.toMatch(/femoral hernia|direct inguinal hernia|indirect inguinal hernia|inguinal protrusion/i);
  expect(node.explanation).not.toMatch(/repair|watchful|surveillance|urgent|elective/i);
  expect(node.resultGateAfter).toBeNull();expect(node.terminalDispositions).toEqual([]);
  expect(plan.currentUpdate).toContain("disappears");expect(plan.currentUpdate).toContain("nontender");
  expect(plan.primaryConceptId).toBe("concept.groin-hernia.femoral-defect-repair-priority.v1");
  expect(newConcepts).toHaveLength(1);expect(newConcepts[0]!.id).toBe("concept.groin-hernia.ultrasound-compartment-classification.v1");
 });
 it("maps all new clinical/quantitative statements and full bibliography without claiming fresh retrieval",()=>{
  for(const q of questions)for(const id of q.supportingEvidenceClaimIds){const claim=claims.find(c=>c.id===id)!;expect(claim).toBeDefined();
   expect(claim.reviewStatus).toBe("needs_clinician_review");expect(claim.basisClaimIds.length).toBeGreaterThan(0);
   for(const id of claim.basisClaimIds)expect(basis.some(c=>c.id===id)).toBe(true);
   for(const id of claim.sourceIds)expect(sources.find(s=>s.id===id)?.evidenceClaimIds).toContain(claim.id);
  }
  for(const s of sources){expect(s.completeCitation).toBeTruthy();expect(s.authors.length).toBeGreaterThan(0);expect(s.doi||s.officialUrl).toBeTruthy();
   expect(s.organizationOrJournal).toBeTruthy();expect(s.accessedOn).toMatch(/^2026-/);expect(s.licenseLabel).toBeTruthy();expect(s.reuseStatus).toBeTruthy();expect(s.authorityAssessment).toBeTruthy();
   expect(s.sourceStatus).toBe("recorded_source_reused_offline_not_reaccessed");
  }
  for(const link of links)expect(link).toMatchObject({target:"_blank",rel:"noopener noreferrer",referrerPolicy:"no-referrer"});
 });
 it("retains all five exact wait classifications and marks only new procedure proposals future-planned",()=>{
  expect(estimates).toHaveLength(5);expect(orders).toHaveLength(3);
  for(const cs of view.cases)for(const node of cs.decisionNodes){const t=estimates.filter(t=>t.caseId===cs.id&&t.nodeId===node.id&&t.questionVariantId===node.questionVariantId);expect(t).toHaveLength(1);
   if(t[0]!.classification.kind==="test_choices")for(const a of t[0]!.classification.choices){expect(node.answerChoices.find(c=>c.id===a.choiceId)?.label).toBe(a.choiceLabel);
    if(a.timing.kind==="test"){const profile=a.timing.timingProfileId;expect(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.some(p=>p.id===profile)).toBe(true);}
   }
  }
  for(const order of orders)expect(order.disposition).toEqual({kind:"not_executed",reason:"future_planned"});
 });
 it("keeps raw advisory warnings and separates the unedited preceding context",()=>{
  expect(lint.totals).toMatchObject({newVariants:4,profileContexts:10,newVariantContexts:8,newVariantFindings:4,preservedContextFindings:1,suppressedFindings:0});
  expect(packet.reduce((n,p)=>n+p.lint.afterCount,0)).toBe(4);expect(packet.every(p=>p.lint.suppressedFindings===0)).toBe(true);
 });
 it.each(["presentation","preceding-node","target-node"])("rejects retained %s drift rather than projecting over shared changes",field=>{
  const changed=structuredClone(input.cases);
  if(field==="presentation")changed[1]!.presentation+=" Altered";
  if(field==="preceding-node")changed[1]!.decisionNodes[0]!.stem+=" Altered";
  if(field==="target-node")changed[1]!.decisionNodes[1]!.stem+=" Altered";
  expect(()=>applyQuestionFlags3Revisions(changed)).toThrow(/retained input changed/);
 });
 it("leaves every existing protected source and decision file byte-exact",()=>{
  // Release integration pins excluded lanes to this release's exact entry,
  // preserving the immutable main-tree capture and every protected path check.
  const pinsPath="tools/question-quality/fixtures/question-flags3-release-source-pins-20261107.json";
  const pinBytes=readFileSync(new URL("../../../"+pinsPath,import.meta.url));
  expect(createHash("sha256").update(pinBytes).digest("hex")).toBe("d583201b2efbbe1f59008189d6a7181d6cf313ae2b862d5e7e541f3d62e61067");
  const pins=JSON.parse(pinBytes.toString("utf8")) as {capturedFixtureSha256:string;paths:Array<{path:string;capturedMainSha256:string;releaseEntrySha256:string|null}>};
  expect(createHash("sha256").update(readFileSync(new URL("../../../tools/question-quality/fixtures/question-flags3-before-20261107.json",import.meta.url))).digest("hex")).toBe(pins.capturedFixtureSha256);
  expect(pins.paths).toHaveLength(48);
  const excluded=new Map(pins.paths.map(row=>[row.path,row]));
  for(const row of pins.paths)expect(capture.files[row.path],row.path+" historical main pin").toBe(row.capturedMainSha256);
  for(const [path,sha]of Object.entries(capture.files)){
   const row=excluded.get(path),url=new URL("../../../"+path,import.meta.url);
   if(row){
    if(row.releaseEntrySha256===null)expect(existsSync(url),path+" unshipped source stays absent").toBe(false);
    else expect(createHash("sha256").update(readFileSync(url)).digest("hex"),path+" exact pre-port release bytes").toBe(row.releaseEntrySha256);
   }else expect(createHash("sha256").update(beforeFlags3AcceptanceSource(path,readFileSync(url,"utf8"))).digest("hex"),path).toBe(sha);
  }
 });
});
