import {beforeProgramBatch9AcceptanceRelease,beforeProgramBatch9AcceptanceManifest,beforeProgramBatch9AcceptanceTimings} from "./question-program-batch9-acceptance-test-support";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {describe,expect,it} from "vitest";
import {SYNTHETIC_CLINICAL_RELEASE as activeLive,QUESTION_CATALOG_RELEASE as catalog} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as activeManifest,type QuestionShipManifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as activeTiming} from "./answer-choice-timing";
import type {SyntheticClinicalCase,SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionVariant} from "./pilot-schema";
import {
  QUESTION_PROGRAM_BATCH8_ACCEPTED_CASES as cases,QUESTION_PROGRAM_BATCH8_ACCEPTED_ROWS as rows,
  QUESTION_PROGRAM_BATCH8_ACCEPTED_QUESTIONS as questions,QUESTION_PROGRAM_BATCH8_OWNER_DIRECTIONS as directions,
  QUESTION_PROGRAM_BATCH8_FROZEN_PRESERVATION as frozen,QUESTION_PROGRAM_BATCH8_RETAINED_CASES as retained,
  QUESTION_PROGRAM_BATCH8_RETIREMENTS as retirements,QUESTION_PROGRAM_BATCH8_WITHDRAWN_ROWS as withdrawn,
  QUESTION_PROGRAM_BATCH8_ACCEPTED_TIMING_ENTRIES as timings,QUESTION_PROGRAM_BATCH8_ACCEPTED_TEST_ORDER_RECORDS as orders,
  QUESTION_PROGRAM_BATCH8_RETAINED_TEST_ORDER_RECORDS as oldOrders,
  QUESTION_PROGRAM_BATCH8_CLAIMS as claims,QUESTION_PROGRAM_BATCH8_SOURCES as sources,
} from "./question-program-batch8-accepted-20261112";
import {resolveQuestionShipRetirements} from "./question-ship-retirements";
import {beforeProgramBatch8AcceptanceRelease as previous,beforeProgramBatch8AcceptanceManifest as previousManifest,
  beforeProgramBatch8AcceptanceTimings as previousTiming,beforeProgramBatch8AcceptanceSource as previousSource,programBatch8HistoricalMembership}
  from "./question-program-batch8-acceptance-test-support";

// Preserve the exact batch8 epoch; batches9-11 independently pin current acceptance.
const live=beforeProgramBatch9AcceptanceRelease(activeLive),manifest=beforeProgramBatch9AcceptanceManifest(activeManifest),timing=beforeProgramBatch9AcceptanceTimings(activeTiming);
const raw=(p:string)=>readFileSync(new URL("../../../"+p,import.meta.url));
const read=(p:string)=>JSON.parse(raw(p).toString("utf8"));
const sha=(value:string|Buffer)=>createHash("sha256").update(value).digest("hex");
const digest=(v:unknown)=>sha(JSON.stringify(v));
const before=read("tools/question-quality/fixtures/question-topic-acceptance-batch8-before-20261112.json") as {
  defaultRelease:SyntheticClinicalRelease;defaultSha256:string;manifest:QuestionShipManifest&{id:string};manifestSha256:string;
  timing:AnswerChoiceTimingRegistryEntry[];timingSha256:string;catalogSha256:string;
  sourceInputs:Array<{path:string;sha256:string}>;
  candidates:Array<{id:string;case:SyntheticClinicalCase;question:QuestionVariant;predecessors:SyntheticClinicalCase[];
    revision:{patient:{name:string};previousQuestionVariantIds:string[];concept:{id:string;meaningChange:boolean}};
    evidence:{path:string;record:{verdict:string;variantId:string}}}>;
};
const after=read("tools/question-quality/fixtures/question-topic-acceptance-batch8-after-20261112.json");
const disposition=read("docs/research/question-topic-acceptance-batch8-dispositions-20261112.json");

describe("batch8 exact owner-directed acceptance and preserved history",()=>{
  it("accepts exactly ten current PASS versions with review2 precedence on the four successors",()=>{
    expect(rows).toHaveLength(10);expect(cases).toHaveLength(10);expect(questions).toHaveLength(10);
    expect(rows.map(r=>r.questionVariantId)).toEqual(before.candidates.map(c=>c.question.id));
    for(const item of before.candidates){
      expect(item.evidence.record).toMatchObject({verdict:"PASS",variantId:item.question.id});
      expect(item.evidence.path).toContain(["B2B32","B2B34","F13","G07"].includes(item.id)?"-review2-":"-review-");
      const cs=cases.find(c=>c.id===item.case.id)!;expect(cs.decisionNodes).toHaveLength(1);
      expect(digest(cs)).toBe(digest(item.case));expect(digest(live.cases.find(c=>c.id===cs.id))).toBe(digest(cs));
      expect(questions.find(q=>q.id===item.question.id)).toEqual(item.question);
    }
    expect(disposition.skipped).toEqual([]);
  });

  it("pins the complete source/review inputs and every exact reviewed node, question and case",()=>{
    const inventoryBytes=raw("tools/question-quality/fixtures/question-topic-batch8-release-source-inventory-20261112.json");
    expect(sha(inventoryBytes)).toBe("0ae0b7c851c4e92db6df42e1471ec8ca59d95174f17e517a2bf8c5304e6376b4");
    const inventory=JSON.parse(inventoryBytes.toString("utf8"));
    expect(sha(raw(inventory.capturePath))).toBe(inventory.capturedFixtureSha256);
    expect(inventory.records.map(({requiredReleasePresent,...row}:{requiredReleasePresent:boolean;path:string;sha256:string})=>row)).toEqual(before.sourceInputs);
    for(const input of inventory.records){
      expect(existsSync(new URL("../../../"+input.path,import.meta.url)),input.path+" exact release presence").toBe(input.requiredReleasePresent);
      if(input.requiredReleasePresent)expect(sha(raw(input.path)),input.path).toBe(input.sha256);
    }
    for(const f of frozen){
      expect(sha(f.sourceNodeJson)).toBe(f.nodeSha256);expect(sha(f.sourceQuestionJson)).toBe(f.questionSha256);
      expect(sha(f.sourceCaseJson)).toBe(f.caseSha256);
      const cs=cases.find(c=>c.id===f.caseId)!;
      expect(digest(cs)).toBe(f.caseSha256);expect(digest(cs.decisionNodes[0])).toBe(f.nodeSha256);
      expect(digest(questions.find(q=>q.id===f.questionVariantId))).toBe(f.questionSha256);
    }
  });

  it("records Melissa's exact-version direction without treating it as clinical approval",()=>{
    expect(directions).toHaveLength(10);
    for(const q of questions){
      expect(q.reviewStatus).toBe("needs_clinician_review");expect(q.lastClinicianReview).toBeNull();
      const direction=directions.find(r=>r.questionVariantId===q.id)!;
      expect(direction).toMatchObject({directedBy:"Melissa Rowland (clinical sign-off)",directedOn:"2026-11-12",
        clinicalApprovalGranted:false,reviewStatus:"needs_clinician_review",lastClinicianReview:null});
      expect(direction.contentVersion).toBe(q.contentVersion);expect(direction.questionSha256).toBe(digest(q));
      expect(direction.scope).toContain("has not received named clinician approval");
    }
    expect(manifest.clinicalApproval).toBe(false);
  });

  it("changes only the five superseded authority rows, ten successors, headers, retirements and two consolidation targets",()=>{
    expect(withdrawn).toHaveLength(5);
    const oldIds=new Set(withdrawn.map(r=>r.acceptanceId));
    const expected={...before.manifest,id:"question-ship.2026-11-12.v17",
      accepted:[...before.manifest.accepted.filter(r=>!oldIds.has(r.acceptanceId)),...rows],
      headerSources:{...before.manifest.headerSources,...Object.fromEntries(rows.map(r=>[r.caseId,r.sourceView]))},
      retirements:[...before.manifest.retirements!,...retirements],
      topicConsolidations:before.manifest.topicConsolidations!.map(r=>{
        const next=disposition.retargetedConsolidations.find((x:{before:{id:string}})=>x.before.id===r.id);return next?next.after:r;
      })};
    expect(digest(manifest)).toBe(digest(expected));
    expect(disposition.retargetedConsolidations).toHaveLength(2);
    for(const relation of disposition.retargetedConsolidations){
      expect(relation.before.replaces).toHaveLength(4);expect(relation.after.replaces).toEqual(relation.before.replaces);
      for(const caseId of relation.before.replaces)expect(live.cases.some(c=>c.id===caseId)).toBe(false);
      expect(rows.some(r=>r.questionVariantId===relation.after.with)).toBe(true);
    }
  });

  it("withholds all declared fresh predecessors, including easy G04, and preserves the old paired reflux encounter",()=>{
    const previousIds=new Set(before.candidates.flatMap(c=>c.revision.previousQuestionVariantIds));
    expect(live.cases.flatMap(c=>c.decisionNodes).some(n=>previousIds.has(n.questionVariantId))).toBe(false);
    expect(live.cases.flatMap(c=>c.decisionNodes).some(n=>n.questionVariantId==="question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v1")).toBe(false);
    const hiatal=before.candidates.find(c=>c.id==="TOPIC-069")!;
    expect(hiatal.predecessors[0]!.decisionNodes).toHaveLength(2);
    expect(live.cases.find(c=>c.id===hiatal.case.id)!.decisionNodes).toHaveLength(1);
    expect(retained.find(c=>c.id===hiatal.case.id)).toEqual(hiatal.predecessors[0]);
    expect(live.cases.flatMap(c=>c.decisionNodes).some(n=>n.questionVariantId==="question.preoperative-osa.validated-risk-screening.v4")).toBe(true);
  });

  it("retires the two directed neonatal cases and the duplicate gap case only with its accepted successor",()=>{
    expect(retirements).toHaveLength(3);expect(retirements.filter(r=>!r.replacementQuestionVariantId)).toHaveLength(2);
    for(const r of retirements)expect(live.cases.some(c=>c.id===r.caseId)).toBe(false);
    const conditional=retirements.find(r=>r.replacementQuestionVariantId)!;
    const withOld=[...live.cases,...retained.filter(c=>retirements.some(r=>r.caseId===c.id))];
    expect(resolveQuestionShipRetirements(withOld,{...manifest,retirements}).issues).toEqual([]);
    const incomplete={...manifest,retirements,accepted:manifest.accepted.filter(r=>r.questionVariantId!==conditional.replacementQuestionVariantId)};
    const checked=resolveQuestionShipRetirements(withOld,incomplete);
    expect(checked.retiredCaseIds.has(conditional.caseId)).toBe(false);
    expect(checked.issues).toHaveLength(1);expect(checked.issues[0]).toContain("successor");
  });

  it("keeps every unrelated case and all 1105 prior concept records exact, retaining their existing order",()=>{
    const changed=new Set(retained.map(c=>c.id));
    for(const cs of before.defaultRelease.cases.filter(c=>!changed.has(c.id)))
      expect(digest(live.cases.find(c=>c.id===cs.id))).toBe(digest(cs));
    const priorIds=new Set(before.defaultRelease.concepts.map(c=>c.id));
    expect(live.concepts.filter(c=>priorIds.has(c.id))).toEqual(before.defaultRelease.concepts);
    expect(live.concepts.filter(c=>!priorIds.has(c.id))).toHaveLength(4);
    expect(digest(catalog)).toBe(before.catalogSha256);
    expect(previous(live)).toEqual(before.defaultRelease);expect(previousManifest(manifest)).toEqual(before.manifest);
    expect(previousTiming(timing)).toEqual(before.timing);
  });

  it("preserves all prior wait tuples and installs twelve exact new testing choices plus nine historical orders",()=>{
    expect(timing.slice(0,before.timing.length)).toEqual(before.timing);expect(timing.slice(-10)).toEqual(timings);
    expect(timings).toHaveLength(10);expect(orders).toHaveLength(12);expect(oldOrders).toHaveLength(9);
    for(const order of [...orders,...oldOrders]){
      const cs=[...cases,...retained].find(c=>c.id===order.caseId&&c.decisionNodes.some(n=>n.questionVariantId===order.questionVariantId))!;
      const node=cs.decisionNodes.find(n=>n.questionVariantId===order.questionVariantId)!;
      expect(node.answerChoices.find(c=>c.id===order.choiceId)!.label).toBe(order.choiceLabel);
      expect(timing.find(t=>t.caseId===order.caseId&&t.nodeId===order.nodeId&&t.questionVariantId===order.questionVariantId)).toBeDefined();
    }
  });

  it("uses runtime name placeholders and retains atomic claim/source closure without inventing evidence",()=>{
    for(const item of before.candidates){
      const cs=cases.find(c=>c.id===item.case.id)!;
      const key=item.question.answerChoices.find(c=>c.isCorrect)!;
      expect(key.label.length,item.question.id+" no uniquely longest key").toBeLessThanOrEqual(
        Math.max(...item.question.answerChoices.filter(c=>!c.isCorrect).map(c=>c.label.length)));
      expect(JSON.stringify({presentation:cs.presentation,profiles:cs.approvedInstantiationProfiles,nodes:cs.decisionNodes,
        summary:cs.learningSummary})).not.toContain(item.revision.patient.name);
      expect(cs.presentation).toContain("{patientName}");
      for(const id of item.question.supportingEvidenceClaimIds){
        const claim=claims.find(c=>c.id===id)!;expect(claim,id).toBeDefined();expect(claim.sourceIds.length).toBeGreaterThan(0);
        for(const sourceId of claim.sourceIds)expect(sources.some(s=>s.id===sourceId),sourceId).toBe(true);
      }
    }
    const packet=read("docs/research/question-topic-acceptance-batch8-packet-20261112.json");
    expect(packet.lint.target.findings).toBe(0);expect(packet.remainingWaitBindings).toEqual([]);
  });

  it("binds exact complete counts/hashes and rejects unrelated drift rather than weakening old guards",()=>{
    expect(manifest.accepted).toHaveLength(777);expect(live.cases).toHaveLength(1407);
    expect(live.cases.flatMap(c=>c.decisionNodes)).toHaveLength(1610);expect(live.concepts).toHaveLength(1109);
    expect(new Set(live.cases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size).toBe(909);
    expect(digest(live)).toBe(after.defaultSha256);expect(digest(manifest)).toBe(after.manifestSha256);
    const changed=structuredClone(live);changed.cases[0]!.presentation+=" changed";expect(()=>previous(changed)).toThrow();
    const bad=structuredClone(manifest);bad.accepted[0]!.decision+=" changed";expect(()=>previousManifest(bad)).toThrow();
    const path="packages/clinical-content/src/question-ship-manifest.ts";
    expect(()=>previousSource(path,raw(path).toString("utf8")+" changed")).toThrow();
  });

  it("detects related in-place mutation after membership caching and leaves earlier timing epochs to their original guards",()=>{
    const release=structuredClone(live),authority=structuredClone(manifest),id=rows[0]!.caseId;
    expect(programBatch8HistoricalMembership(release,authority,{caseId:id}).release).toEqual(before.defaultRelease);
    const cs=release.cases.find(c=>c.id===id)!;cs.presentation+=" changed";
    expect(()=>programBatch8HistoricalMembership(release,authority,{caseId:id})).toThrow();
    const release2=structuredClone(live),authority2=structuredClone(manifest);
    programBatch8HistoricalMembership(release2,authority2,{caseId:id});
    authority2.accepted.find(r=>r.caseId===id)!.decision+=" changed";
    expect(()=>programBatch8HistoricalMembership(release2,authority2,{caseId:id})).toThrow();
    const earlier=before.timing.slice(0,100);expect(previousTiming(earlier)).toEqual(earlier);
  });

  it("pins exact release source deltas, presence and every immutable epoch preimage",()=>{
    const bytes=readFileSync(new URL("../../../tools/question-quality/fixtures/question-program-batch8-release-source-pins-20261112.json",import.meta.url));
    expect(createHash("sha256").update(bytes).digest("hex")).toBe("210d877afbabcc2877bfe254405776089c36ba6d7413114ec1903d2cc58b822b");
    const pins=JSON.parse(bytes.toString("utf8"));
    const hash=(path:string)=>createHash("sha256").update(readFileSync(new URL("../../../"+path,import.meta.url))).digest("hex");
    expect(hash(pins.capturePath)).toBe(pins.capturedFixtureSha256);
    expect(hash("packages/clinical-content/src/question-program-batch8-acceptance-test-support.ts")).toBe(pins.testSupportSha256);
    const migration=read(pins.capturePath);expect(pins.paths).toHaveLength(16);
    expect(pins.paths.map((p:{path:string})=>p.path)).toEqual(migration.files.map((r:{path:string})=>r.path));
    for(const pin of pins.paths){
      const row=migration.files.find((r:{path:string})=>r.path===pin.path)!;
      expect(pin.mainBeforeSha256).toBe(row.beforeSha256);expect(pin.mainAfterSha256).toBe(row.afterSha256);
      expect(createHash("sha256").update(row.beforeText).digest("hex")).toBe(row.beforeSha256);
      const url=new URL("../../../"+pin.path,import.meta.url);expect(existsSync(url)).toBe(pin.requiredReleaseSha256!==null);
      const current=existsSync(url)?readFileSync(url,"utf8"):undefined;
      if(current!==undefined)expect(hash(pin.path)).toBe(pin.requiredReleaseSha256);
      expect(createHash("sha256").update(previousSource(pin.path,current as string)).digest("hex")).toBe(row.beforeSha256);
    }
    
  });
});
