import {QUESTION_FLAGS3_ACCEPTED_TIMING_ENTRIES as currentFlags3Timings} from "./question-flags3-accepted-20261107";
import {beforeStats1AcceptanceManifest,beforeStats1AcceptanceTimings,beforeStats1PriorAcceptedTimings} from "./question-stats1-acceptance-test-support";
const QUESTION_FLAGS3_ACCEPTED_TIMING_ENTRIES=beforeStats1PriorAcceptedTimings(currentFlags3Timings,"flags3-accepted");
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {
  QUESTION_FLAGS2_ROUND3_REVISIONS as revisions,
  QUESTION_FLAGS2_ROUND3_AUTHORING_CONCEPTS as concepts,
  QUESTION_FLAGS2_ROUND3_CLAIMS as claims,
  QUESTION_FLAGS2_ROUND3_RETAINED_INPUT as input,
  QUESTION_FLAGS2_ROUND3_SOURCE_RELEASE as view,
  QUESTION_FLAGS2_ROUND3_TIMING_ENTRIES as timings,
  QUESTION_FLAGS2_ROUND3_CANDIDATE_TEST_ORDER_RECORDS as orders,
  QUESTION_FLAGS2_ROUND3_PARKED as parked,
  applyQuestionFlags2Round3Revisions,
} from "./question-flags2-round3-20261105";
import {QUESTION_FLAGS2_ROUND2_SOURCE_RELEASE as round2} from "./question-flags2-round2-20261105";
import {SYNTHETIC_CLINICAL_RELEASE as live} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as currentManifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as currentTimings} from "./answer-choice-timing";
const manifest=beforeStats1AcceptanceManifest(currentManifest),globalTimings=beforeStats1AcceptanceTimings(currentTimings);
import {QUESTION_NEW_N3_ROUND2_TIMING_ENTRIES as concurrentN3Round2Timings} from "./question-new-n3-round2-20261105";
import {QUESTION_NEW_N3_ROUND3_TIMING_ENTRIES as concurrentN3Round3Timings} from "./question-new-n3-round3-20261105";
import {QUESTION_FLAGS2_WHOLE_CASE_TIMING_ENTRIES} from "./question-flags2-whole-case-accepted-20261105";
import {beforeWholeCaseReplacementRelease,beforeWholeCaseReplacementManifest,beforeWholeCaseReplacementSource} from "./question-ship-case-replacements-test-support";
const concurrentN3Timings=[...concurrentN3Round2Timings,...concurrentN3Round3Timings,...QUESTION_FLAGS2_WHOLE_CASE_TIMING_ENTRIES,...QUESTION_FLAGS3_ACCEPTED_TIMING_ENTRIES];
import {syntheticClinicalReleaseSchema,type SyntheticClinicalRelease} from "./schema";

const read=(p:string)=>JSON.parse(readFileSync(new URL("../../../"+p,import.meta.url),"utf8"));
const sha=(value:unknown)=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
const fileSha=(p:string)=>{
  const bytes=readFileSync(new URL("../../../"+p,import.meta.url));
  return createHash("sha256").update(p.endsWith(".ts")?beforeWholeCaseReplacementSource(p,bytes.toString("utf8")):bytes).digest("hex");
};
const capturedConcurrentFileSha=(p:string)=>{
  let source=beforeWholeCaseReplacementSource(p,readFileSync(new URL("../../../"+p,import.meta.url),"utf8"));
  if(p==="packages/clinical-content/src/answer-choice-timing.ts"){
    const block=/\r?\n\/\/ BEGIN N3 ROUND3 retained exact estimate append - explicit candidates only\.\r?\nimport \{ QUESTION_NEW_N3_ROUND3_TIMING_ENTRIES \} from "\.\/question-new-n3-round3-20261105";\r?\n\/\/ END N3 ROUND3 retained exact estimate append\.\r?\n/;
    expect(source.match(block)).not.toBeNull();
    const addition=", ...QUESTION_NEW_N3_ROUND3_TIMING_ENTRIES";
    expect(source.split(addition)).toHaveLength(2);
    source=source.replace(addition,"").replace(block,"");
  }
  return createHash("sha256").update(source).digest("hex");
};
type Review={id:string;cues:unknown[];fairness:unknown[];suggestions:unknown[]};
type Display={variantId:string;Presentation:string;Task:string;Options:string[]};
type Packet={id:string;status:string;holdStatus:"none"|"parked";after:Display|null;before:Display;releaseReady:boolean;pipelinePassed:boolean;
  rationalePairs:{before:unknown;after:unknown};
  sourceVerificationHold:string|null;acceptanceAllowed:boolean;ownerNoteResolution:string;keyOrderNotice:string;
  reviewResponse:{notes:Array<{category:"cues"|"fairness"|"suggestions";index:number;note:unknown;response:string;disposition:string}>};
  selfCheck:{reasoningSteps?:string[];closestCredibleError?:string;decidingFinding?:string;counterfactual?:string;cueAttack?:string;manualReviewCompleted:boolean};
  lint:{afterCount:number|null;profileContexts:number};encounterContinuity?:{requiresManagerCompositionReview:boolean};
};
const capture=read("tools/question-quality/fixtures/question-flags2-round3-before-20261105.json") as {
  source:SyntheticClinicalRelease;files:Record<string,string>;review:Review[];packet:Packet[];
  live:{sha256:string;conceptsSha256:string};manifestSha256:string;timingSha256:string;
};
const packet=read("docs/research/question-flags2-round3-20261105.json") as Packet[];
const ledger=read("docs/research/sources-question-flags2-round3-20261105.json") as {
  sources:Array<{id:string;completeCitation:string;accessedOn:string;officialUrl:string|null;doi:string|null;licenseLabel:string;authorityAssessment:string}>;
  basisClaims:Array<{id:string;sourceIds:string[]}>;items:Array<{id:string;holdStatus:string;keyedHold:boolean;candidateEmitted?:boolean}>;
};
const lint=read("tools/question-quality/question-flags2-round3-lint-20261105.json") as {totals:{newVariants:number;parked:number;profileContexts:number;afterFindings:number};noteResponses:number};
const controls=read("tools/question-quality/question-flags2-round3-controls-20261105.json") as {
  priorFilesVerified:number;concurrentOtherLaneChanges:Array<{path:string;beforeSha256?:string;combinedCurrentSha256?:string;n3FragmentsRemovedSha256?:string}>;
};
const find=(id:string)=>{const r=revisions.find(r=>r.auditId===id)!,cs=view.cases.find(c=>c.id===r.caseId)!;return {r,cs,node:cs.decisionNodes[0]!};};

describe("flags2 final round: supported new keys or explicit parking",()=>{
  it("exports two valid standalone candidates and five dispositions, with no held key in the candidate view",()=>{
    expect(revisions.map(r=>r.auditId)).toEqual(["G03","G05"]);
    expect(parked.map(p=>p.id)).toEqual(["G01","G02","G04-R","G05-staging","G07"]);
    expect(syntheticClinicalReleaseSchema.safeParse(view).success).toBe(true);
    expect(view.cases).toHaveLength(2);
    for(const cs of view.cases){
      expect(cs.decisionNodes).toHaveLength(1);
      expect(revisions.some(r=>r.questionVariantId===cs.decisionNodes[0]!.questionVariantId)).toBe(true);
    }
    for(const id of ["G03","G05"])expect(ledger.items.find(i=>i.id===id)).toMatchObject({holdStatus:"none",keyedHold:false});
    for(const p of parked)expect(ledger.items.find(i=>i.id===p.id)).toMatchObject({holdStatus:"parked",keyedHold:true,candidateEmitted:false});
  });

  it("retains the exact full historical input but excludes held adjacent and repetitive downstream questions from the new view",()=>{
    for(const cs of input.cases)expect(cs).toEqual(round2.cases.find(c=>c.id===cs.id));
    expect(applyQuestionFlags2Round3Revisions(input.cases)).toEqual(view.cases);
    const first=find("G03"),second=find("G05");
    expect(first.r.sourceStructure.previousNodeIds).toHaveLength(2);
    expect(first.node.resultGateAfter).toBeNull();expect(second.node.resultGateAfter).toBeNull();
    expect(first.r.clinicalBinding.previousResultGate?.resultTypeId).toBe("service.ultrasound");
    expect(second.r.nodeId).toBe("node.asymptomatic-phpt.incidental-calcium.2");
    expect(second.cs.decisionNodes.some(n=>n.questionVariantId.includes("three-site-dxa"))).toBe(false);
    for(const r of revisions){
      expect(r.sourceStructure.requiresManagerCompositionReview).toBe(true);
      expect(packet.find(p=>p.id===r.auditId)!.encounterContinuity?.requiresManagerCompositionReview).toBe(true);
    }
  });

  it("does not change the default live release, historical cards, acceptance rows or global waits",()=>{
    const priorLive=beforeWholeCaseReplacementRelease(live);
    expect(sha(priorLive)).toBe(capture.live.sha256);
    expect(sha(priorLive.concepts)).toBe(capture.live.conceptsSha256);
    expect(sha(beforeWholeCaseReplacementManifest(manifest))).toBe(capture.manifestSha256);
    const tuple=(t:{caseId:string;nodeId:string;questionVariantId:string})=>JSON.stringify([t.caseId,t.nodeId,t.questionVariantId]);
    const concurrentIds=new Set(concurrentN3Timings.map(tuple));
    const oldRows=globalTimings.filter(t=>!concurrentIds.has(tuple(t)));
    expect(sha(oldRows)).toBe(capture.timingSha256);
    expect(globalTimings).toEqual([...oldRows,...concurrentN3Timings]);
    for(const r of revisions){
      expect(manifest.accepted.some(a=>a.questionVariantId===r.questionVariantId)).toBe(true);
      expect(globalTimings.some(t=>t.questionVariantId===r.questionVariantId)).toBe(true);
      expect(live.concepts.some(c=>c.id===r.question.conceptId)).toBe(true);
    }
  });

  it("preserves 62 captured prior files and proves the isolated concurrent N3 shared-file hunks",()=>{
    let files=0;
    const shared=["packages/clinical-content/src/index.ts","packages/clinical-content/src/answer-choice-timing.ts","packages/clinical-content/src/synthetic-content.ts"];
    for(const [p,hash]of Object.entries(capture.files)){
      if(shared.includes(p))continue;
      expect(fileSha(p),p).toBe(hash);files++;
    }
    expect(files).toBe(62);expect(controls.priorFilesVerified).toBe(62);
    for(const change of controls.concurrentOtherLaneChanges.filter(c=>c.path!==shared[0])){
      expect(capturedConcurrentFileSha(change.path)).toBe(change.combinedCurrentSha256);
      expect(change.n3FragmentsRemovedSha256).toBe(capture.files[change.path]);
      expect(change.beforeSha256).toBe(capture.files[change.path]);
    }
    const index=beforeWholeCaseReplacementSource("packages/clinical-content/src/index.ts",readFileSync(new URL("./index.ts",import.meta.url),"utf8"));
    const own=/\r?\n\/\/ BEGIN FLAGS2 round3 retained candidates - no manifest acceptance\.\r?\nexport \* from "\.\/question-flags2-round3-20261105";\r?\n\/\/ END FLAGS2 round3 retained candidates\.\r?\n/g;
    const n3=/\r?\n\/\/ BEGIN N3 ROUND2 exports - review drafts only; no manifest acceptance\.\r?\nexport \* from "\.\/question-new-n3-round2-20261105";\r?\n\/\/ END N3 ROUND2 exports\.\r?\n/g;
    const n3r3=/\r?\n\/\/ BEGIN N3 ROUND3 explicit candidate exports - no default projection change\.\r?\nexport \* from "\.\/question-new-n3-round3-20261105";\r?\nexport \* from "\.\/question-new-n3-round3-source-20261105";\r?\n\/\/ END N3 ROUND3 explicit candidate exports\.\r?\n/g;
    expect([...index.matchAll(n3r3)]).toHaveLength(1);
    expect([...index.matchAll(own)]).toHaveLength(1);
    expect([...index.matchAll(n3)]).toHaveLength(1);
    expect(createHash("sha256").update(index.replace(own,"").replace(n3,"").replace(n3r3,"")).digest("hex")).toBe(capture.files["packages/clinical-content/src/index.ts"]);
  });

  it("preserves G06 byte-for-byte at the reviewed display and rationale fields without another acceptance",()=>{
    const before=capture.packet.find(p=>p.id==="G06")!,now=packet.find(p=>p.id==="G06")!;
    expect(now.after).toEqual(before.after);expect(now.before).toEqual(before.after);
    expect(now.rationalePairs).toEqual({before:before.rationalePairs.after,after:before.rationalePairs.after});
    expect(now).toMatchObject({pipelinePassed:true,holdStatus:"none",sourceVerificationHold:null,releaseReady:false,acceptanceAllowed:false});
    expect(manifest.accepted.filter(a=>a.acceptanceId==="G06")).toHaveLength(1);
    expect(revisions.some(r=>r.auditId==="G06")).toBe(false);
  });

  it("records exact indexed responses to all 83 returned notes and 10 unchanged PASS notes",()=>{
    let returned=0,total=0;
    expect(packet.map(p=>p.id)).toEqual(["G01","G02","G03","G04-R","G05","G05-staging","G06","G07"]);
    for(const p of packet){
      const review=capture.review.find(r=>r.id===p.id)!;
      for(const category of ["cues","fairness","suggestions"] as const){
        const replies=p.reviewResponse.notes.filter(n=>n.category===category);
        expect(replies).toHaveLength(review[category].length);
        replies.forEach((n,i)=>{expect(n.index).toBe(i+1);expect(n.note).toEqual(review[category][i]);expect(n.response.length).toBeGreaterThan(20);});
      }
      total+=p.reviewResponse.notes.length;if(p.id!=="G06")returned+=p.reviewResponse.notes.length;
      expect(p.ownerNoteResolution.length).toBeGreaterThan(60);
      expect(p.keyOrderNotice).toContain("review only");
    }
    expect(returned).toBe(83);expect(total).toBe(93);expect(lint.noteResponses).toBe(93);
  });

  it("uses null afters for parked items rather than relabelling held drafts as lint-clean candidates",()=>{
    for(const d of parked){
      const p=packet.find(p=>p.id===d.id)!;
      expect(p).toMatchObject({holdStatus:"parked",after:null,releaseReady:false,pipelinePassed:false,acceptanceAllowed:false});
      expect(p.sourceVerificationHold).toBeTruthy();expect(p.lint.afterCount).toBeNull();expect(p.lint.profileContexts).toBe(0);
      expect(p.reviewResponse.notes.every(n=>n.disposition==="not_implemented_parked")).toBe(true);
      expect(revisions.some(r=>r.previousQuestionVariantId===d.previousDraftVariantId)).toBe(false);
    }
  });

  it("changes clinical meaning explicitly while retaining the exact previous concepts and questions",()=>{
    expect(concepts).toHaveLength(2);
    expect(view.concepts.slice(0,input.concepts.length)).toEqual(input.concepts);
    for(const c of concepts){
      expect(input.concepts.some(p=>p.id===c.previousConceptId)).toBe(true);
      expect(c.versioningReason.length).toBeGreaterThan(100);
      expect(c.reviewStatus).toBe("needs_clinician_review");expect(c.lastClinicianReview).toBeNull();
    }
    expect(find("G03").node.questionVariantId).toBe("question.palpable-breast.negative-mammogram-targeted-us.v1.r4");
    expect(find("G05").node.questionVariantId).toBe("question.asymptomatic-phpt.age-based-surgery.v1.r3");
  });

  it("keeps source mappings atomic and grounded in the original ledger instead of the five held extensions",()=>{
    expect(claims).toHaveLength(7);expect(ledger.sources).toHaveLength(6);
    const originalIds=new Set(ledger.basisClaims.map(c=>c.id));
    for(const claim of claims){
      expect(claim.reviewStatus).toBe("needs_clinician_review");expect(claim.lastClinicianReview).toBeNull();
      expect(claim.basisClaimIds.every(id=>originalIds.has(id))).toBe(true);
      expect(claim.basisClaimIds.some(id=>id.startsWith("claim.flags2"))).toBe(false);
      for(const id of claim.sourceIds)expect(ledger.sources.some(s=>s.id===id)).toBe(true);
      expect(claim.verificationScope).toContain("No source retrieval");
    }
    for(const source of ledger.sources){
      expect(source.completeCitation.length).toBeGreaterThan(30);expect(source.officialUrl||source.doi).toBeTruthy();
      expect(source.accessedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);expect(source.licenseLabel.length).toBeGreaterThan(5);expect(source.authorityAssessment.length).toBeGreaterThan(10);
    }
  });

  it("provides all four planned testing-choice waits without executing a new result gate",()=>{
    expect(timings).toHaveLength(2);expect(orders).toHaveLength(4);
    const known=new Set(globalTimings.flatMap(t=>t.classification.kind==="test_choices"?t.classification.choices.filter(c=>c.timing.kind==="test").map(c=>c.timing.kind==="test"?c.timing.timingProfileId:""):[]));
    for(const t of timings){
      expect(t.classification.kind).toBe("test_choices");
      if(t.classification.kind!=="test_choices")continue;
      const r=revisions.find(r=>r.questionVariantId===t.questionVariantId)!;
      expect(t.classification.choices).toHaveLength(3);
      for(const choice of t.classification.choices){
        expect(choice.timing).toEqual(r.choiceTimingOverrides![choice.choiceId]);
        if(choice.timing.kind==="test"){
          expect(known.has(choice.timing.timingProfileId)).toBe(true);
          const order=orders.filter(o=>o.questionVariantId===t.questionVariantId&&o.choiceId===choice.choiceId);
          expect(order).toHaveLength(1);expect(order[0]!.disposition).toEqual({kind:"not_executed",reason:"future_planned"});
          expect(order[0]!.choiceLabel).toBe(choice.choiceLabel);
        }
      }
    }
  });

  it.each(revisions)("keeps $auditId fully presented, randomized, unapproved and self-checked across every finite profile",r=>{
    const {cs,node}=find(r.auditId),p=packet.find(p=>p.id===r.auditId)!;
    expect(node.shuffleAnswers).toBe(true);expect(node.answerChoices).toHaveLength(3);expect(node.answerChoices.filter(a=>a.isCorrect)).toHaveLength(1);
    expect(node.stem).toContain("{patientName}");expect(node.answerChoices.every(a=>a.serviceRequest===null)).toBe(true);
    expect(node.explanation).not.toMatch(/source alignment|remains held|source confirmation|verification hold|before acceptance|No new drug indication/i);
    expect(r.question.reviewStatus).toBe("needs_clinician_review");expect(r.question.lastClinicianReview).toBeNull();
    expect(p).toMatchObject({holdStatus:"none",sourceVerificationHold:null,releaseReady:false,pipelinePassed:false});
    expect(p.selfCheck.manualReviewCompleted).toBe(true);expect(p.selfCheck.reasoningSteps).toHaveLength(2);
    for(const value of [p.selfCheck.closestCredibleError,p.selfCheck.decidingFinding,p.selfCheck.counterfactual,p.selfCheck.cueAttack])expect(value!.length).toBeGreaterThan(70);
    expect(p.after!.Options.filter(a=>a.startsWith("**KEY:** "))).toHaveLength(1);
    expect(p.lint.afterCount).toBe(0);
    for(const profile of [{presentation:cs.presentation,chiefComplaint:cs.chiefComplaint},...(cs.approvedInstantiationProfiles??[])]){
      expect(profile.presentation).toContain("{patientName}");expect(profile.presentation).toMatch(/\d+-year-old (woman|man)/);
      expect(profile.presentation).not.toMatch(/\{ageYears\}|\{sexNoun\}/);
      expect((profile.chiefComplaint??"").split(/\s+/).length).toBeLessThanOrEqual(5);
    }
    expect(node.terminalDispositions).toHaveLength(2);
    expect(node.terminalDispositions.every(d=>d.kind==="no_terminal_outcome")).toBe(true);
  });

  it("reports zero lint across the eight candidate contexts while excluding parked items honestly",()=>{
    expect(lint.totals).toMatchObject({newVariants:2,parked:5,profileContexts:8,afterFindings:0});
    expect(packet.filter(p=>p.id!=="G06"&&p.holdStatus==="none").reduce((n,p)=>n+p.lint.profileContexts,0)).toBe(8);
  });

  it.each(["stem","presentation","neighbor","gate"])("rejects historical %s drift instead of projecting over shared edits",field=>{
    const cases=JSON.parse(JSON.stringify(input.cases)) as SyntheticClinicalRelease["cases"];
    if(field==="stem")cases[0]!.decisionNodes[0]!.stem+=" drift";
    if(field==="presentation")cases[0]!.presentation+=" drift";
    if(field==="neighbor")cases[0]!.decisionNodes[1]!.explanation+=" drift";
    if(field==="gate")cases[0]!.decisionNodes[0]!.resultGateAfter!.resultNarrative+=" drift";
    expect(()=>applyQuestionFlags2Round3Revisions(cases)).toThrow(/exact retained source binding changed/i);
  });
});
