import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {syntheticClinicalReleaseSchema} from "./schema";
import {SYNTHETIC_CLINICAL_RELEASE as actualLive} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as actualManifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as actualTiming} from "./answer-choice-timing";
import {
 QUESTION_HARDEN1_SOURCE_RELEASE as view,QUESTION_HARDEN1_RETAINED_INPUT as retained,
 QUESTION_HARDEN1_REVISIONS as revisions,QUESTION_HARDEN1_QUESTIONS as questions,QUESTION_HARDEN1_CONCEPTS as concepts,
 QUESTION_HARDEN1_CLAIMS as claims,QUESTION_HARDEN1_BASIS_CLAIMS as basis,QUESTION_HARDEN1_SOURCES as sources,
 QUESTION_HARDEN1_CASE_REVIEWS as reviews,QUESTION_HARDEN1_SOURCE_LINKS as links,QUESTION_HARDEN1_STATEMENT_MAPPINGS as mappings,
 QUESTION_HARDEN1_TIMING_ENTRIES as timings,QUESTION_HARDEN1_CANDIDATE_TEST_ORDER_RECORDS as orders,
 } from "./question-harden1-20261110";


import {beforeHarden1N3r4AcceptanceRelease,beforeHarden1N3r4AcceptanceManifest,beforeHarden1N3r4AcceptanceTimings} from "./question-harden1-n3r4-acceptance-test-support";
const live=beforeHarden1N3r4AcceptanceRelease(actualLive),manifest=beforeHarden1N3r4AcceptanceManifest(actualManifest),globalTimings=beforeHarden1N3r4AcceptanceTimings(actualTiming);
const read=(p:string)=>JSON.parse(readFileSync(new URL("../../../"+p,import.meta.url),"utf8"));
const digest=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const intake=read("tools/question-quality/fixtures/question-harden1-before-20261110.json");
const packet=read("docs/research/question-harden1-20261110.json");
const lint=read("tools/question-quality/question-harden1-lint-20261110.json");
const ledger=read("docs/research/sources-question-harden1-20261110.json");
const render=(v:unknown,name:string):unknown=>typeof v==="string"?v.replaceAll("{patientName}",name):Array.isArray(v)?v.map(x=>render(x,name)):v&&typeof v==="object"?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,render(x,name)])):v;
const groin=view.cases[0]!,phosphate=view.cases[1]!;

describe("harden1 review-only consequential applications",()=>{
 it("assembles two strict candidates covering three original targets without default registration",()=>{
  expect(syntheticClinicalReleaseSchema.safeParse(view).success).toBe(true);
  expect(retained.cases).toHaveLength(2);expect(view.cases).toHaveLength(2);
  expect(view.cases.flatMap(c=>c.decisionNodes)).toHaveLength(2);
  expect(questions).toHaveLength(2);expect(concepts).toHaveLength(2);
  for(const q of questions){expect(live.cases.some(c=>c.decisionNodes.some(n=>n.questionVariantId===q.id))).toBe(false);
   expect(JSON.stringify(manifest)).not.toContain(q.id);}
 });
 it("preserves the exact live pair, phosphate node and legacy timing identities",()=>{
  for(const target of intake.targets){
   const cs=live.cases.find(c=>c.id===target.clinicalCase.id)!;
   expect(cs).toEqual(target.clinicalCase);
   expect(retained.cases.find(c=>c.id===cs.id)).toEqual(target.clinicalCase);
   expect(globalTimings.filter(t=>t.caseId===cs.id&&t.nodeId===target.node.id&&t.questionVariantId===target.node.questionVariantId)).toEqual(target.timing);
  }
  expect(digest(live)).toBe(intake.live.sha256);expect(digest(manifest)).toBe(intake.manifestSha256);
 });
 it("keeps all captured statistics cases byte-equivalent",()=>{
  expect(Object.keys(intake.statisticsCaseHashes)).toHaveLength(62);
  for(const [id,hash]of Object.entries(intake.statisticsCaseHashes))expect(digest(live.cases.find(c=>c.id===id))).toBe(hash);
 });
 it("versions material clinical objective changes without remapping the three original concepts",()=>{
  for(const r of revisions){
   expect(r.concept.conceptMeaning).toBe("new_version");expect(r.concept.historyMigration).toContain("None.");
   expect(r.question.conceptId).toBe(r.concept.id);expect(r.concept.conceptVersionReason).toBeTruthy();
   expect(live.concepts.some(c=>c.id===r.concept.id)).toBe(false);
   expect(retained.concepts.some(c=>c.id===r.concept.previousConceptId)).toBe(true);
  }
  expect(revisions[0]!.concept.relatedPreviousConceptIds).toEqual(["concept.groin-hernia.ultrasound-compartment-classification.v1"]);
  expect(new Set(questions.map(q=>q.id)).size).toBe(2);
 });
 it("keeps all new authored clinical metadata unapproved with resolvable claim mappings",()=>{
  for(const record of [...questions,...concepts,...claims,...sources,...reviews,...mappings]){
   expect(record.reviewStatus).toBe("needs_clinician_review");expect(record.lastClinicianReview).toBeNull();
  }
  for(const q of questions)for(const id of q.supportingEvidenceClaimIds)expect(claims.some(c=>c.id===id)).toBe(true);
  for(const m of mappings)for(const field of m.fields)for(const id of field.claimIds)expect(claims.some(c=>c.id===id)).toBe(true);
  for(const item of packet)expect(item).toMatchObject({pipelinePassed:false,releaseReady:false,acceptanceAllowed:false,holdStatus:"none",sourceVerificationHold:null});
 });
 it("retains complete named, age/sex-consistent finite patient profiles and neutral tasks",()=>{
  for(const [i,cs]of view.cases.entries()){
   expect(cs.patientDisplayName).toBe(i===0?"Elliot Reed":"Maya Chen");
   expect(cs.presentation).toContain(i===0?"59-year-old man":"31-year-old woman");
   expect(cs.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
   expect(cs.decisionNodes[0]!.stem).toContain("{patientName}");
   for(const p of cs.approvedInstantiationProfiles!){expect(p.presentation).toBe(cs.presentation);expect(p.prototypeDemographics).toEqual(cs.prototypeDemographics);}
   expect(cs.prototypeDemographics).toEqual(retained.cases[i]!.prototypeDemographics);
   expect(cs.prototypeVitalSigns).toEqual(retained.cases[i]!.prototypeVitalSigns);
  }
 });
 it("scores one answer with shuffled parallel options, complete wrong branches and no authored testing wait",()=>{
  for(const cs of view.cases){const n=cs.decisionNodes[0]!;
   expect(n.shuffleAnswers).toBe(true);expect(n.answerChoices.length).toBeGreaterThanOrEqual(3);expect(n.answerChoices.length).toBeLessThanOrEqual(4);
   expect(n.answerChoices.filter(a=>a.isCorrect)).toHaveLength(1);expect(new Set(n.answerChoices.map(a=>a.id)).size).toBe(n.answerChoices.length);
   expect(n.answerChoices.every(a=>a.serviceRequest===null)).toBe(true);expect(n.resultGateAfter).toBeNull();
   expect(n.terminalDispositions.map(t=>t.answerChoiceId).sort()).toEqual(n.answerChoices.filter(a=>!a.isCorrect).map(a=>a.id).sort());
   expect(timings.find(t=>t.caseId===cs.id)).toEqual({caseId:cs.id,nodeId:n.id,questionVariantId:n.questionVariantId,classification:{kind:"no_test"}});
  }
  expect(orders).toEqual([]);expect(globalTimings.some(t=>timings.some(x=>x.questionVariantId===t.questionVariantId))).toBe(false);
 });
 it("uses a complete balanced hernia type/intervention cross rather than a convergent privileged key",()=>{
  const choices=groin.decisionNodes[0]!.answerChoices;
  expect(choices).toHaveLength(4);
  for(const term of ["operative exploration","manual reduction","Femoral","Indirect inguinal"])expect(choices.filter(a=>a.label.includes(term))).toHaveLength(2);
  for(const type of ["Femoral","Indirect inguinal"])for(const intervention of ["operative exploration","manual reduction"]){
   expect(choices.filter(a=>a.label.startsWith(type)&&a.label.includes(intervention))).toHaveLength(1);
  }
  expect(choices.find(a=>a.isCorrect)!.label).toBe("Femoral hernia; operative exploration");
  const item=packet.find((p:{id:string})=>p.id==="H1-01");
  expect(item.selfCheck.counterfactuals.map((c:{answer:string})=>c.answer)).toEqual(["Indirect inguinal hernia; operative exploration","Femoral hernia; manual reduction"]);
 });
 it("does not expose the hernia label or prior classified management feedback before the joint decision",()=>{
  const n=groin.decisionNodes[0]!;
  expect(groin.decisionNodes).toHaveLength(1);expect(n.exhibit!.kind).toBe("keyValue");
  expect(groin.presentation).not.toMatch(/femoral|inguinal|Richter|strangulat|ischemi/i);
  expect(JSON.stringify(n.exhibit)).not.toMatch(/femoral hernia|Richter|strangulat|ischemi/i);
  const oldManagement=packet.find((p:{id:string})=>p.id==="H1-02");
  expect(oldManagement.visibleHistory.before["priorFeedback[0]"]).toBeTruthy();
  expect(Object.keys(oldManagement.visibleHistory.after).some(k=>k.startsWith("prior"))).toBe(false);
 });
 it("makes serum/urine normalization and the low serum context necessary, with an answer-changing counterfactual",()=>{
  const n=phosphate.decisionNodes[0]!,table=n.exhibit!;
  if(table.kind!=="table")throw Error("Missing paired lab table");
  expect(table.columnHeaders).toEqual(["Serum (mg/dL)","Urine (mg/dL)"]);
  expect(table.caption).toContain("before phosphate replacement");expect(table.caption).toContain("constructed data");
  expect(table.rowHeaders).toEqual(["Phosphate","Creatinine"]);
  const [serumP,urineP]=table.cells[0]!.map(Number),[serumCr,urineCr]=table.cells[1]!.map(Number);
  const fraction=(u:number)=>u!*serumCr!/(serumP!*urineCr!)*100;
  expect(fraction(urineP!)).toBe(50);expect(fraction(0.2)).toBe(1);
  expect(n.answerChoices.every(a=>a.label.split(/\s+/).length===6)).toBe(true);
  expect(n.explanation).toContain("50%");expect(n.explanation).toContain("can coexist");expect(n.explanation).not.toContain("5%");
  expect(packet[2].selfCheck.counterfactuals[0].answer).toBe("Renal phosphate conservation is appropriately increased.");
 });
 it("renders all three provenance rows from two exact executable candidates with review-only key ordering",()=>{
  expect(packet).toHaveLength(3);expect(new Set(packet.map((p:{after:{variantId:string}})=>p.after.variantId)).size).toBe(2);
  expect(packet[0].after).toEqual(packet[1].after);expect(packet[1].afterDuplicateForProvenance).toBe(true);
  expect(packet[0].sharedCandidateId).toBe(packet[1].sharedCandidateId);
  for(const item of packet){const cs=view.cases.find(c=>c.id===item.caseId)!,n=cs.decisionNodes[0]!;
   expect(item.keyOrderNotice).toContain("key shown first for review only");
   expect(item.after).toEqual({variantId:n.questionVariantId,Presentation:render(cs.presentation,cs.patientDisplayName!),"Current update":render(n.currentUpdate??null,cs.patientDisplayName!),
    Exhibit:render(n.exhibit??null,cs.patientDisplayName!),Task:render(n.stem,cs.patientDisplayName!),Options:[...n.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>(a.isCorrect?"**KEY:** ":"")+a.label)});
   expect(item.explanation.after).toBe(n.explanation);expect(item.frozenPreservation.candidateCaseSha256).toBe(digest(cs));
   expect(item.frozenPreservation.sourceReleaseSha256).toBe(digest(view));
   expect(item.selfCheck.reasoningSteps).toHaveLength(2);expect(item.selfCheck.counterfactuals.length).toBeGreaterThan(0);
   expect(item.selfCheck.manualReviewCompleted).toBe(true);expect(item.selfCheck.residentDifficulty).toContain("author prediction");
  }
 });
 it("retains direct permitted sources, dates, limits and safe links for every keyed claim",()=>{
  for(const claim of claims){expect(claim.statement).toBeTruthy();expect(claim.limitation).toBeTruthy();expect(claim.lastCheckedOn).toBe("2026-11-10");
   for(const id of claim.sourceIds){const source=sources.find(s=>s.id===id)!;expect(source).toBeDefined();expect(source.evidenceClaimIds).toContain(claim.id);}
   for(const id of claim.basisClaimIds)expect(basis.some(c=>c.id===id)).toBe(true);
  }
  for(const source of sources){expect(source.completeCitation).toBeTruthy();expect(source.authors.length).toBeGreaterThan(0);expect(source.publicationYear).toBeTruthy();
   expect(source.officialUrl).toMatch(/^https:/);expect(source.licenseLabel).toBeTruthy();expect(source.intendedUse).toBeTruthy();expect(source.authorityAssessment).toBeTruthy();
   if(source.sourceStatus==="targeted_facts_and_license_rechecked")expect(source.accessedOn).toBe("2026-11-10");
   else expect(source.accessedOn).toBe(source.originalAccessedOn);
  }
  expect(ledger.items.every((i:{keyedHold:boolean})=>!i.keyedHold)).toBe(true);
  expect(ledger.constructedData.phosphate.calculation).toContain("50%");
  for(const link of links)expect(link).toMatchObject({target:"_blank",rel:"noopener noreferrer",referrerPolicy:"no-referrer"});
 });
 it("keeps raw finite-profile lint and its balanced-set warning visible without suppression",()=>{
  expect(lint.totals).toEqual({originalTargets:3,uniqueCandidates:2,reviewRows:3,beforeProfileContexts:6,afterProfileContexts:4,beforeFindings:3,afterFindings:1,suppressedFindings:0});
  expect(lint.after.variants.flatMap((v:{findings:unknown[]})=>v.findings)).toHaveLength(1);
  expect(lint.after.variants.find((v:{questionVariantId:string})=>v.questionVariantId===questions[0]!.id).findings[0].rule).toBe("convergence");
  expect(lint.after.variants.find((v:{questionVariantId:string})=>v.questionVariantId===questions[1]!.id).findings).toEqual([]);
  expect(packet[0].lint.advisoryDisposition).toContain("complete 2x2");
 });
});
