import {createHash} from "node:crypto";
import {readFileSync,existsSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {SYNTHETIC_CLINICAL_RELEASE as actualLive,QUESTION_CATALOG_RELEASE as catalog} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as actualManifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as actualGlobalTiming} from "./answer-choice-timing";
import {syntheticClinicalReleaseSchema,type DecisionNode,type CaseExhibit} from "./schema";
import {
 QUESTION_STATS1_SOURCE_RELEASE as view,QUESTION_STATS1_REVISIONS as revisions,QUESTION_STATS1_QUESTIONS as questions,
 QUESTION_STATS1_RETAINED_INPUT as retained,QUESTION_STATS1_TIMING_ENTRIES as timings,
 QUESTION_STATS1_CLAIMS as claims,QUESTION_STATS1_BASIS_CLAIMS as basis,QUESTION_STATS1_SOURCES as sources,
 QUESTION_STATS1_SOURCE_LINKS as links,applyQuestionStats1Revisions,
} from "./question-stats1-20261108";
import {beforeStats1Source} from "./question-stats1-test-support";
import {beforeStats1AcceptanceRelease,beforeStats1AcceptanceManifest,beforeStats1AcceptanceTimings} from "./question-stats1-acceptance-test-support";
// Pin the exact accepted delta, then retain the original authoring-only epoch.
const live=beforeStats1AcceptanceRelease(actualLive),manifest=beforeStats1AcceptanceManifest(actualManifest),globalTiming=beforeStats1AcceptanceTimings(actualGlobalTiming);

const read=(path:string)=>JSON.parse(readFileSync(new URL("../../../"+path,import.meta.url),"utf8"));
const capture=read("tools/question-quality/fixtures/question-stats1-before-20261108.json") as {
 live:{sha256:string};catalogSha256:string;manifestSha256:string;timingSha256:string;files:Record<string,string>;
 targets:Array<{id:string;clinicalCase:typeof retained.cases[number];node:DecisionNode;concept:{id:string;learningObjective:string}}>;
 sources:typeof sources;
};
const packet=read("docs/research/question-stats1-20261108.json") as Array<{
 id:string;holdStatus:string;sourceVerificationHold:null;reviewStatus:string;pipelinePassed:boolean;keyOrderNotice:string;
 after:{Presentation:string;"Current update":string|null;Exhibit:CaseExhibit;Task:string;Options:string[];Explanation:string};
 wordCounts:{after:{proseBeforeTask:number;exhibit:number;combinedBeforeTask:number;task:number;explanationLines:number};target45Met:boolean;hardCap60Met:boolean};
 selfCheck:{statisticsOwnerException:boolean;oneConcept:string;oneRequestedOutput:string};
 proposedAcceptance:{acceptanceWritten:boolean;wholeCaseReplacementRequired:boolean};
 frozenPreservation:{candidateNodeSha256:string;candidateQuestionSha256:string;candidateCaseSha256:string};
}>;
const lint=read("tools/question-quality/question-stats1-lint-20261108.json") as {totals:{beforeFindings:number;afterFindings:number;cases:number;nodes:number;profiles:number;suppressedFindings:number}};
const digest=(value:unknown)=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
const wordCount=(value:string)=>value.split(/\s+/).filter(word=>/[A-Za-z0-9]/.test(word)).length;
const find=(id:string)=>{const r=revisions.find(r=>r.auditId===id)!,cs=view.cases.find(cs=>cs.id===r.caseId)!,node=cs.decisionNodes[0]!;return{r,cs,node};};
const numbers=(value:string)=>[...value.matchAll(/[+-]?\d+(?:\.\d+)?/g)].map(m=>Number(m[0]));
const cells=(node:DecisionNode)=>{expect(node.exhibit!.kind).toBe("table");if(node.exhibit!.kind!=="table")throw Error("Expected data table");return node.exhibit!.cells.map(row=>row.map(Number));};
const values=(node:DecisionNode)=>{expect(node.exhibit!.kind).toBe("keyValue");if(node.exhibit!.kind!=="keyValue")throw Error("Expected labelled values");return node.exhibit!.items.map(item=>item.value);};
const correct=(node:DecisionNode)=>node.answerChoices.find(a=>a.isCorrect)!;
const caption=(node:DecisionNode)=>{const e=node.exhibit;if(!e||!("caption"in e))throw Error("Expected captioned data exhibit");return e.caption;};
const expectNumeric=(node:DecisionNode,expected:number)=>{
 expect(Number.parseFloat(correct(node).label)).toBeCloseTo(expected,8);
 expect(node.answerChoices.filter(a=>Math.abs(Number.parseFloat(a.label)-expected)<1e-8)).toHaveLength(1);
};

describe("stats1 short single-skill candidates without live acceptance",()=>{
 it("covers all 64 live nodes in the sixteen named families and retains all eighteen stable meanings",()=>{
  expect(syntheticClinicalReleaseSchema.safeParse(view).success).toBe(true);
  expect(view.cases).toHaveLength(64);expect(revisions).toHaveLength(64);expect(questions).toHaveLength(64);expect(view.concepts).toHaveLength(18);
  expect([...new Set(revisions.map(r=>r.family))]).toHaveLength(16);
  expect(revisions.map(r=>r.originalVariantId).sort()).toEqual(capture.targets.map(t=>t.node.questionVariantId).sort());
  expect(new Set(questions.map(q=>q.id)).size).toBe(64);
  for(const r of revisions)expect(r.question.conceptId).toBe(capture.targets.find(t=>t.id===r.auditId)!.node.primaryConceptId);
 });
 it("keeps the entire live/catalog/manifest/global timing exact and every candidate out of fresh play",()=>{
  expect(digest(live)).toBe(capture.live.sha256);expect(digest(catalog)).toBe(capture.catalogSha256);
  expect(digest(manifest)).toBe(capture.manifestSha256);expect(digest(globalTiming)).toBe(capture.timingSha256);
  for(const r of revisions){expect(manifest.accepted.some(a=>a.questionVariantId===r.questionVariantId)).toBe(false);
   expect(live.cases.some(cs=>cs.decisionNodes.some(n=>n.questionVariantId===r.questionVariantId))).toBe(false);}
 });
 it.each(revisions)("keeps $auditId short, single-tasked, fully mapped and unapproved",r=>{
  const {cs,node}=find(r.auditId),p=packet.find(p=>p.id===r.auditId)!,old=capture.targets.find(t=>t.id===r.auditId)!;
  expect(cs.decisionNodes).toHaveLength(1);expect(cs.participant).toEqual(old.clinicalCase.participant);
  expect(cs.earliestFacilityStage).toBe(old.clinicalCase.earliestFacilityStage);expect(cs.requiredCapabilityIds).toEqual(old.clinicalCase.requiredCapabilityIds);
  expect(cs.displayName).toBe("Statistics practice");expect(wordCount(cs.chiefComplaint!)).toBeLessThanOrEqual(5);
  expect(node.shuffleAnswers).toBe(true);expect([3,4]).toContain(node.answerChoices.length);expect(node.answerChoices.filter(a=>a.isCorrect)).toHaveLength(1);
  expect(new Set(node.answerChoices.map(a=>a.label)).size).toBe(node.answerChoices.length);
  expect(node.currentUpdate).toBeUndefined();expect(node.resultGateAfter).toBeNull();expect(node.answerChoices.every(a=>a.serviceRequest===null)).toBe(true);
  expect(r.question.reviewStatus).toBe("needs_clinician_review");expect(r.question.lastClinicianReview).toBeNull();
  expect(p).toMatchObject({holdStatus:"none",sourceVerificationHold:null,reviewStatus:"needs_clinician_review",pipelinePassed:false});
  expect(p.proposedAcceptance).toMatchObject({acceptanceWritten:false,wholeCaseReplacementRequired:false});
  expect(p.wordCounts.after.combinedBeforeTask).toBeLessThanOrEqual(45);expect(p.wordCounts.after.proseBeforeTask).toBeLessThanOrEqual(45);
  expect(p.wordCounts.target45Met).toBe(true);expect(p.wordCounts.hardCap60Met).toBe(true);
  expect(p.wordCounts.after.combinedBeforeTask).toBe(p.wordCounts.after.proseBeforeTask+p.wordCounts.after.exhibit);
  expect(p.wordCounts.after.explanationLines).toBe(3);expect(node.explanation.split("\n")).toHaveLength(3);
  expect(p.keyOrderNotice).toContain("key shown first for review only");expect(p.after.Options.filter(a=>a.startsWith("**KEY:** "))).toHaveLength(1);
  expect(p.after.Task).toBe(node.stem);expect(p.after.Explanation).toBe(node.explanation);
  expect(p.selfCheck.statisticsOwnerException).toBe(true);expect(p.selfCheck.oneRequestedOutput).toBe(node.stem);expect(p.selfCheck.oneConcept).toBe(r.skill);
  expect(digest(cs)).toBe(p.frozenPreservation.candidateCaseSha256);expect(digest(node)).toBe(p.frozenPreservation.candidateNodeSha256);expect(digest(r.question)).toBe(p.frozenPreservation.candidateQuestionSha256);
  expect(caption(node)).toMatch(/constructed/i);
  if(r.employeeDiscussion){expect(cs.participant?.kind).toBe("employee_discussion");expect(cs.prototypeDemographics).toBeUndefined();expect(cs.presentation).not.toMatch(/\b\d|male|female|year.old/i);}
  else {expect(cs.prototypeDemographics).toEqual(old.clinicalCase.prototypeDemographics);expect(cs.presentation).toContain(String(cs.prototypeDemographics!.ageYears));
   expect(cs.presentation).toContain(cs.prototypeDemographics!.sexLabel==="Female"?" F,":" M,");}
 });
 it("preserves the collection chronology and the applied target-benefit identity rather than resetting their cards",()=>{
  const ppv=find("S42"),target=find("S54");
  expect(ppv.node.primaryConceptId).toBe("concept.predictive-value.collection-population-denominator.v1");
  expect(caption(ppv.node)).toContain("Specimen collected in clinic before transfer to ICU");
  expect(target.node.primaryConceptId).toBe("concept.statistics-ethics.p-value.v2");
  expect(target.r.conceptVersionReason).toContain("target-benefit interval");
  expect(target.node.stem).toContain("target benefit");expect(JSON.stringify(target.node.exhibit)).not.toContain("p-value");
 });
 it.each(["independent-t","paired-t","one-way-anova","rank-sum","signed-rank"])("supplies the decision-critical structure for %s",family=>{
  const rows=revisions.filter(r=>r.family===family);expect(rows).toHaveLength(4);
  for(const r of rows){const {node}=find(r.auditId),text=JSON.stringify(node.exhibit);
   if(family==="independent-t")expect(text).toMatch(/normal.*similar variances/);
   if(family==="paired-t")expect(text).toMatch(/differences.*normal/i);
   if(family==="one-way-anova"){expect(text).toMatch(/Three|Four/);expect(text).toContain("different patients");expect(text).toContain("similar variances");}
   if(family==="rank-sum"){expect(text).toContain("eight different patients");expect(text).toContain("strongly skewed");expect(node.stem).toContain("distributions");}
   if(family==="signed-rank"){expect(text).toContain("Twelve continuous differences");expect(text).toContain("symmetric and strongly nonnormal");expect(node.stem).toContain("median within-pair difference");}
  }
 });
 it.each(["S21","S22","S23","S24"])("independently computes populated expected counts for %s",id=>{
  const {node}=find(id),matrix=cells(node),rows=matrix.map(row=>row.reduce((a,b)=>a+b,0));
  const columns=matrix[0]!.map((_,i)=>matrix.reduce((total,row)=>total+row[i]!,0)),total=rows.reduce((a,b)=>a+b,0);
  const expected=rows.flatMap(r=>columns.map(col=>r*col/total)),minimum=Math.min(...expected);
  expect(minimum).toBeGreaterThanOrEqual(10);expect(correct(node).label).toBe("Pearson chi-square test");
  expect(node.explanation).toContain("= "+minimum+".");
 });
 it.each(["S25","S26","S27","S28"])("independently computes sparse expected event counts for %s",id=>{
  const {node}=find(id),matrix=cells(node);expect(matrix).toHaveLength(2);expect(matrix.every(r=>r.length===2)).toBe(true);
  const totals=matrix.map(row=>row.reduce((a,b)=>a+b,0)),events=matrix.reduce((n,row)=>n+row[0]!,0),total=totals.reduce((a,b)=>a+b,0);
  const expected=totals.map(r=>r*events/total);expect(expected[0]).toBe(expected[1]);expect(expected[0]).toBeLessThanOrEqual(1);
  expect(correct(node).label).toBe("Fisher exact test");expect(node.explanation).toContain("Expected events = "+expected[0]+" per group");
 });
 it.each(["S37","S38","S39","S40","S41","S42","S43","S44","S45","S46","S47","S48","S49","S50","S51","S52","S63","S64"])
 ("independently recalculates the sole numerical/directional key in %s",id=>{
  const {node}=find(id);
  if(["S37","S38","S41","S44"].includes(id)){
   const [[tp,fp],[fn,tn]]=cells(node) as [[number,number],[number,number]];
   expectNumeric(node,100*(id==="S37"?tp/(tp+fn):id==="S38"?tn/(tn+fp):tp/(tp+fp)));return;
  }
  if(id==="S39"||id==="S40"){const [positive,negative]=numbers(values(node)[0]!);expectNumeric(node,100*(id==="S39"?positive!:negative!)/(positive!+negative!));return;}
  if(id==="S42"){const [clinic,icu]=cells(node);expect(clinic).not.toEqual(icu);expectNumeric(node,100*clinic![0]!/(clinic![0]!+clinic![1]!));return;}
  if(id==="S43"){
   const v=values(node),[a,b]=numbers(v[0]!),[sensitivity,specificity]=numbers(v[1]!);
   const ppv=(prevalence:number)=>(sensitivity!/100*prevalence/100)/(sensitivity!/100*prevalence/100+(1-specificity!/100)*(1-prevalence/100));
   expect(sensitivity).toBeGreaterThan(0);expect(specificity).toBeLessThan(100);expect(ppv(b!)).toBeGreaterThan(ppv(a!));expect(correct(node).label).toBe("Clinic B");return;
  }
  if(id==="S45"){const [exposed,control]=cells(node);expectNumeric(node,(exposed![0]!/exposed![1]!)/(control![0]!/control![1]!));return;}
  if(id==="S46"){const [[a,b],[c,d]]=cells(node) as [[number,number],[number,number]];expectNumeric(node,a*d/(b*c));return;}
  if(id==="S47"){const v=values(node),p=numbers(v[0]!)[0]!/100,or=numbers(v[1]!)[0]!,odds=p/(1-p)*or;expectNumeric(node,Math.round(100*odds/(1+odds)));return;}
  if(id==="S48"){const ratio=numbers(values(node)[0]!)[0]!;expect(correct(node).label).toBe("Risk is "+100*(1-ratio)+"% lower");return;}
  if(["S49","S50","S51","S52"].includes(id)){const v=values(node),control=numbers(v[1]!)[0]!,treatment=numbers(v[2]!)[0]!,difference=control-treatment;
   expect(difference).toBeGreaterThan(0);expectNumeric(node,id==="S50"?difference:100/difference);expect(v[0]).toContain("30 days");return;}
  expectNumeric(node,100-numbers(values(node)[0]!)[0]!);
 });
 it.each(["S54","S57","S58","S59","S60"])("checks the interval rather than a p-value shortcut for %s",id=>{
  const {node}=find(id),v=values(node);
  if(id==="S54"){const target=numbers(v[1]!)[0]!,[low,high]=numbers(v[2]!);expect(low).toBeLessThan(target);expect(high).toBeGreaterThan(target);expect(correct(node).label).toBe("Target lies inside the interval");return;}
  if(id==="S60"){const [al,au]=numbers(v[0]!),[bl,bu]=numbers(v[1]!);expect(au!-al!).toBeLessThan(bu!-bl!);expect(correct(node).label).toBe("Estimate A");return;}
  const [low,high]=numbers(v[0]!),nullValue=id==="S59"?0:1;
  if(id==="S58"){expect(high).toBeLessThan(nullValue);expect(correct(node).label).toBe("Statistically significant lower risk");}
  else{expect(low).toBeLessThan(nullValue);expect(high).toBeGreaterThan(nullValue);expect(correct(node).label).toMatch(/No statistically significant difference|do not differ significantly/);}
 });
 it("establishes outcome-related selection from response denominators rather than favorable replies alone",()=>{
  const {node}=find("S35"),[cohort,respondents]=cells(node);
  expect(cohort).toEqual([50,50]);expect(respondents).toEqual([40,10]);
  expect(respondents![0]!/cohort![0]!).toBe(0.8);expect(respondents![1]!/cohort![1]!).toBe(0.2);
  expect(correct(node).label).toBe("Selection bias");expect(caption(node)).toContain("all patients invited");
 });
 it("maps statistical facts and constructed arithmetic without carrying unrelated clinical or held source claims",()=>{
  expect(claims).toHaveLength(97);expect(basis).toHaveLength(21);expect(sources).toHaveLength(22);
  for(const q of questions)for(const id of q.supportingEvidenceClaimIds){const cl=claims.find(c=>c.id===id)!;expect(cl).toBeDefined();
   expect(cl.reviewStatus).toBe("needs_clinician_review");for(const id of cl.basisClaimIds)expect(basis.some(c=>c.id===id)).toBe(true);
   for(const id of cl.sourceIds)expect(sources.find(s=>s.id===id)?.evidenceClaimIds).toContain(cl.id);}
  for(const source of sources){const old=capture.sources.find(s=>s.id===source.id)!;
   expect(source.accessedOn).toBe(old.accessedOn);expect(source.completeCitation).toBe(old.completeCitation);
   expect(source.sourceStatus).toBe("recorded_source_reused_offline_not_reaccessed");expect(source.authors.length).toBeGreaterThan(0);
   expect(source.officialUrl||source.doi).toBeTruthy();expect(source.licenseLabel).toBeTruthy();expect(source.authorityAssessment).toBeTruthy();}
  expect(sources.some(s=>/lakens|uptodate|accesssurgery|score/i.test(s.id))).toBe(false);
  for(const link of links)expect(link).toMatchObject({target:"_blank",rel:"noopener noreferrer",referrerPolicy:"no-referrer"});
 });
 it("has no advisory findings after scanning all complete candidate profiles",()=>{
  expect(lint.totals).toEqual({beforeFindings:55,afterFindings:0,afterVariantsWithFindings:0,cases:64,nodes:64,profiles:128,suppressedFindings:0});
 });
 it("retains every other case by identity in the explicit authoring projection",()=>{
  const preview=applyQuestionStats1Revisions(live.cases),ids=new Set(revisions.map(r=>r.caseId));expect(preview).toHaveLength(live.cases.length);
  for(const cs of live.cases){if(ids.has(cs.id))expect(preview.find(c=>c.id===cs.id)).toEqual(view.cases.find(c=>c.id===cs.id));else expect(preview.find(c=>c.id===cs.id)).toBe(cs);}
 });
 it.each(["presentation","task","choice"])("refuses an altered retained %s instead of overwriting shared work",field=>{
  const changed=structuredClone(retained.cases);
  if(field==="presentation")changed[0]!.presentation+=" Changed";
  if(field==="task")changed[0]!.decisionNodes[0]!.stem+=" Changed";
  if(field==="choice")changed[0]!.decisionNodes[0]!.answerChoices[0]!.label+=" Changed";
  expect(()=>applyQuestionStats1Revisions(changed)).toThrow(/Stats1 retained input changed/);
 });
 it("preserves every protected source/capture through the exact authorized standard/test-hook migration",()=>{
  // Release integration retains every original protected path check.
  const pinsPath="tools/question-quality/fixtures/question-stats1-release-source-pins-20261108.json",pinBytes=readFileSync(new URL("../../../"+pinsPath,import.meta.url));
  expect(createHash("sha256").update(pinBytes).digest("hex")).toBe("29d82e3d6537aa03ab0136ab6f4831921fc6f779dac5acfb0b3af5871c7e2f79");
  const pins=JSON.parse(pinBytes.toString("utf8")) as {capturedFixtureSha256:string;paths:Array<{path:string;capturedMainSha256:string;requiredReleaseSha256:string|null}>};
  expect(createHash("sha256").update(readFileSync(new URL("../../../tools/question-quality/fixtures/question-stats1-before-20261108.json",import.meta.url))).digest("hex")).toBe(pins.capturedFixtureSha256);
  expect(pins.paths).toHaveLength(98);
  const releasePins=new Map(pins.paths.map(row=>[row.path,row]));
  for(const row of pins.paths)expect(capture.files[row.path],row.path+" immutable main capture").toBe(row.capturedMainSha256);
  for(const[p,h]of Object.entries(capture.files)){
   const row=releasePins.get(p),url=new URL("../../../"+p,import.meta.url);
   if(row){
    if(row.requiredReleaseSha256===null)expect(existsSync(url),p+" excluded source remains absent").toBe(false);
    else expect(createHash("sha256").update(readFileSync(url)).digest("hex"),p+" exact release source").toBe(row.requiredReleaseSha256);
   }else expect(createHash("sha256").update(beforeStats1Source(p,readFileSync(url,"utf8"))).digest("hex"),p).toBe(h);
  }
 });
});
