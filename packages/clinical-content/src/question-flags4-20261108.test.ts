import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {syntheticClinicalReleaseSchema} from "./schema";
import {SYNTHETIC_CLINICAL_RELEASE as actualLive} from "./synthetic-content";
import {beforeFlags4AcceptanceRelease} from "./question-flags4-acceptance-test-support";
const live=beforeFlags4AcceptanceRelease(actualLive);
import {ANSWER_CHOICE_TIMING_REGISTRY as timings} from "./answer-choice-timing";
import {QUESTION_SHIP_MANIFEST as manifest} from "./question-ship-manifest";
import {
 QUESTION_FLAGS4_SOURCE_RELEASE as view,QUESTION_FLAGS4_REVISIONS as revisions,QUESTION_FLAGS4_QUESTIONS as questions,
 QUESTION_FLAGS4_RETAINED_INPUT as retained,QUESTION_FLAGS4_RETAINED_TIMINGS as oldTimings,
 QUESTION_FLAGS4_CLAIMS as claims,QUESTION_FLAGS4_BASIS_CLAIMS as basis,QUESTION_FLAGS4_SOURCES as sources,
 QUESTION_FLAGS4_SOURCE_LINKS as links,QUESTION_FLAGS4_CASE_REVIEWS as reviews,QUESTION_FLAGS4_STATEMENT_MAPPINGS as mappings,
 QUESTION_FLAGS4_TIMING_ENTRIES as estimates,QUESTION_FLAGS4_CANDIDATE_TEST_ORDER_RECORDS as orders,applyQuestionFlags4Revisions,
} from "./question-flags4-20261108";

const read=(path:string)=>JSON.parse(readFileSync(new URL("../../../"+path,import.meta.url),"utf8"));
const digest=(value:unknown)=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
const intake=read("tools/question-quality/fixtures/question-flags4-before-20261108.json");
const packet=read("docs/research/question-flags4-20261108.json")[0];
const lint=read("tools/question-quality/question-flags4-lint-20261108.json");
const cs=view.cases[0]!,node=cs.decisionNodes[0]!,q=questions[0]!;
const render=(value:string)=>value.replaceAll("{patientName}",cs.patientDisplayName!);

describe("flags4 candidate-only refeeding mechanism revision",()=>{
 it("retains the exact live question, source case and timing without admitting the draft",()=>{
  expect(syntheticClinicalReleaseSchema.safeParse(view).success).toBe(true);
  expect(view.cases).toHaveLength(1);expect(revisions).toHaveLength(1);expect(questions).toHaveLength(1);
  expect(retained.cases[0]).toEqual(intake.target.clinicalCase);
  expect(live.cases.find(c=>c.id===cs.id)).toEqual(retained.cases[0]);
  expect(timings.filter(t=>t.caseId===cs.id&&t.questionVariantId===intake.target.node.questionVariantId)).toEqual(oldTimings);
  expect(live.cases.some(c=>c.decisionNodes.some(n=>n.questionVariantId===q.id))).toBe(false);
  expect(manifest.accepted.some(r=>r.questionVariantId===q.id)).toBe(false);
 });
 it("changes only the targeted case in an authoring composition, preserving other object identities",()=>{
  const composed=applyQuestionFlags4Revisions(live.cases);
  expect(composed).toHaveLength(live.cases.length);
  expect(composed.filter((c,i)=>c!==live.cases[i])).toEqual([cs]);
  expect(cs.decisionNodes).toHaveLength(1);expect(node.id).toBe(intake.target.node.id);
  expect(node.primaryConceptId).toBe(intake.target.node.primaryConceptId);
  expect(q.id).not.toBe(intake.target.node.questionVariantId);
 });
 it.each(["presentation","question","choice"])("rejects retained %s drift instead of overwriting it",field=>{
  const changed=structuredClone(retained.cases);
  if(field==="presentation")changed[0]!.presentation+=" changed";
  if(field==="question")changed[0]!.decisionNodes[0]!.stem+=" changed";
  if(field==="choice")changed[0]!.decisionNodes[0]!.answerChoices[0]!.label+=" changed";
  expect(()=>applyQuestionFlags4Revisions(changed)).toThrow(/Flags4 retained input changed/);
 });
 it("keeps the complete named patient frame and all new clinical metadata unapproved",()=>{
  expect(cs.patientDisplayName).toBe("Maya Chen");expect(render(cs.presentation)).toContain("Maya Chen, a 31-year-old woman");
  expect(cs.prototypeDemographics).toEqual(intake.target.clinicalCase.prototypeDemographics);
  expect(cs.prototypeVitalSigns).toEqual(intake.target.clinicalCase.prototypeVitalSigns);
  expect(cs.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
  expect(node.stem).toContain("{patientName}");
  for(const profile of cs.approvedInstantiationProfiles!){expect(profile.prototypeDemographics).toEqual(cs.prototypeDemographics);expect(profile.presentation).toBe(cs.presentation);}
  for(const record of [q,...claims,...sources,...reviews,...mappings]){
   expect(record.reviewStatus).toBe("needs_clinician_review");expect(record.lastClinicianReview).toBeNull();
  }
  expect(packet).toMatchObject({holdStatus:"none",sourceVerificationHold:null,pipelinePassed:false,releaseReady:false,acceptanceAllowed:false});
 });
 it("keeps choice identities, scoring, terminal branches and no-test classification aligned",()=>{
  expect(node.shuffleAnswers).toBe(true);expect(node.answerChoices).toHaveLength(3);
  expect(node.answerChoices.filter(a=>a.isCorrect)).toHaveLength(1);
  expect(new Set(node.answerChoices.map(a=>a.id)).size).toBe(3);
  expect(node.answerChoices.map(a=>[a.id,a.label,a.isCorrect])).toEqual(q.answerChoices.map(a=>[a.id,a.label,a.isCorrect]));
  expect(node.answerChoices.every(a=>a.serviceRequest===null)).toBe(true);
  expect(node.terminalDispositions!.map(t=>t.answerChoiceId).sort()).toEqual(node.answerChoices.filter(a=>!a.isCorrect).map(a=>a.id).sort());
  expect(estimates).toEqual([{caseId:cs.id,nodeId:node.id,questionVariantId:node.questionVariantId,classification:{kind:"no_test"}}]);
  expect(orders).toEqual([]);expect(node.resultGateAfter).toBeNull();
 });
 it("renders the review packet from the executable version with explicit review-only key ordering",()=>{
  expect(packet.keyOrderNotice).toContain("key shown first for review only");
  expect(packet.before.Task).toBe(render(intake.target.node.stem));
  expect(packet.after).toEqual({variantId:q.id,Presentation:render(cs.presentation),"Current update":render(node.currentUpdate!),Exhibit:null,Task:render(node.stem),
   Options:[...node.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>(a.isCorrect?"**KEY:** ":"")+a.label)});
  expect(packet.explanation.after).toBe(node.explanation);
  expect(packet.frozenPreservation.candidateCaseSha256).toBe(digest(cs));
  expect(packet.frozenPreservation.sourceReleaseSha256).toBe(digest(view));
  expect(packet.frozenPreservation.retainedCaseSha256).toBe(digest(retained.cases[0]));
  expect(packet.selfCheck.manualReviewCompleted).toBe(true);expect(packet.selfCheck.reasoningSteps).toHaveLength(2);
  expect(packet.selfCheck.residentDifficulty).toContain("author prediction");expect(packet.selfCheck.basicAccepted).toBe(false);
 });
 it("resolves every application to recorded atomic facts and actual access/check dates",()=>{
  for(const id of q.supportingEvidenceClaimIds){const claim=claims.find(c=>c.id===id)!;expect(claim).toBeDefined();
   for(const basisId of claim.basisClaimIds){const old=basis.find(c=>c.id===basisId)!;expect(old).toBeDefined();expect(old.lastCheckedOn).toBe("2026-10-07");}
   for(const sourceId of claim.sourceIds){const source=sources.find(s=>s.id===sourceId)!;expect(source).toBeDefined();expect(source.evidenceClaimIds).toContain(id);}
  }
  for(const source of sources){expect(source.sourceStatus).toBe("recorded_source_reused_offline_not_reaccessed");expect(source.accessedOn).toBe("2026-10-07");
   expect(source.completeCitation).toBeTruthy();expect(source.organizationOrJournal).toBeTruthy();expect(source.authors.length).toBeGreaterThan(0);
   expect(source.doi||source.officialUrl).toBeTruthy();expect(source.licenseLabel).toBeTruthy();expect(source.authorityAssessment).toBeTruthy();expect(source.intendedUse).toBeTruthy();
  }
  for(const link of links)expect(link).toMatchObject({target:"_blank",rel:"noopener noreferrer",referrerPolicy:"no-referrer"});
  expect(mappings[0]!.fields.flatMap(f=>f.claimIds).every(id=>claims.some(c=>c.id===id))).toBe(true);
 });
 it("reports raw canonical and finite-profile lint without suppressing warnings",()=>{
  expect(lint.totals).toMatchObject({ownerFlags:1,newVariants:1,candidateCases:1,beforeProfileContexts:5,afterProfileContexts:2,beforeFindings:1,afterFindings:0,suppressedFindings:0});
  expect(packet.lint.after).toEqual([]);expect(packet.lint.before).toEqual(lint.before.variants[0].findings);
 });
});
