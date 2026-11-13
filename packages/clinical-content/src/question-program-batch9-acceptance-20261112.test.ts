import {beforeProgramBatch10AcceptanceRelease,beforeProgramBatch10AcceptanceManifest,beforeProgramBatch10AcceptanceTimings,beforeProgramBatch10AcceptanceSourceBytes,beforeAuthorizedBatch10IntegrationPins} from "./question-program-batch10-acceptance-test-support";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {describe,expect,it} from "vitest";
import {SYNTHETIC_CLINICAL_RELEASE as currentRelease,QUESTION_CATALOG_RELEASE as catalog} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as currentManifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as currentTiming} from "./answer-choice-timing";
import {syntheticClinicalCaseSchema} from "./schema";
import {
  QUESTION_PROGRAM_BATCH9_ACCEPTED_ROWS as rows,QUESTION_PROGRAM_BATCH9_ACCEPTED_CASES as cases,
  QUESTION_PROGRAM_BATCH9_ACCEPTED_QUESTIONS as questions,QUESTION_PROGRAM_BATCH9_FROZEN_PRESERVATION as frozen,
  QUESTION_PROGRAM_BATCH9_ACCEPTED_TEST_ORDER_RECORDS as orders,QUESTION_PROGRAM_BATCH9_ACCEPTED_TIMING_ENTRIES as waits,
  QUESTION_PROGRAM_BATCH9_ACCEPTED_FAMILY_CONTEXTS as families,
} from "./question-program-batch9-accepted-20261112";
import {beforeProgramBatch9AcceptanceRelease,beforeProgramBatch9AcceptanceManifest,beforeProgramBatch9AcceptanceTimings,beforeProgramBatch9AcceptanceSource} from "./question-program-batch9-acceptance-test-support";
const live=beforeProgramBatch10AcceptanceRelease(currentRelease);
const manifest=beforeProgramBatch10AcceptanceManifest(currentManifest);
const timing=beforeProgramBatch10AcceptanceTimings(currentTiming);
const raw=(p:string)=>beforeAuthorizedBatch10IntegrationPins(beforeProgramBatch10AcceptanceSourceBytes(readFileSync(new URL("../../../"+p,import.meta.url))));
const read=(p:string)=>JSON.parse(raw(p).toString("utf8"));
const sha=(b:string|Buffer)=>createHash("sha256").update(b).digest("hex");
const digest=(v:unknown)=>sha(JSON.stringify(v));
const before=read("tools/question-quality/fixtures/question-intraop-acceptance-batch9-before-20261112.json");
const after=read("tools/question-quality/fixtures/question-intraop-acceptance-batch9-after-20261112.json");
const disposition=read("docs/research/question-intraop-acceptance-batch9-dispositions-20261112.json");

describe("batch9 exact whole-case intraop acceptance",()=>{
  it("accounts for all 35 requested PASS nodes without admitting an unlisted or non-PASS sibling",()=>{
    expect(rows).toHaveLength(17);expect(cases).toHaveLength(14);expect(questions).toHaveLength(17);
    expect(disposition.skipped).toHaveLength(18);
    const requested=new Set(before.requested.map((r:{nodeId:string})=>r.nodeId));
    expect(new Set([...rows.map(r=>r.nodeId),...disposition.skipped.map((r:{nodeId:string})=>r.nodeId)])).toEqual(requested);
    for(const c of cases)for(const n of c.decisionNodes){
      expect(rows.filter(r=>r.caseId===c.id&&r.nodeId===n.id&&r.questionVariantId===n.questionVariantId&&r.conceptId===n.primaryConceptId)).toHaveLength(1);
      expect(requested.has(n.id)).toBe(true);
      const f=frozen.find(r=>r.nodeId===n.id)!;expect(f.review.record.verdict).toBe("PASS");
      expect(live.cases.find(r=>r.id===c.id)).toEqual(c);
    }
    for(const s of disposition.skipped)expect(live.cases.flatMap(c=>c.decisionNodes).some(n=>n.id===s.nodeId),s.nodeId).toBe(false);
    const ercp=disposition.wholeCaseChoices.find((r:{slug:string;caseId:string})=>r.slug==="ercp-access-and-adverse-events"&&r.caseId.includes("injury-course"));
    expect(ercp.exportName).toBe("I18_SCORABLE_PREVIEW_CASES");expect(ercp.nodeIds).toHaveLength(2);
    expect(ercp.nodeIds.every((id:string)=>requested.has(id))).toBe(true);
  });

  it("pins immutable source/review files and exact original and accepted question/node/case bytes",()=>{
    const inventoryBytes=readFileSync(new URL("../../../tools/question-quality/fixtures/question-intraop-batch9-release-source-inventory-20261112.json",import.meta.url));
    expect(sha(inventoryBytes)).toBe("3db4ed427175d8877492640724fbebf308b324316611745fc4dd24670840a209");
    const inventory=JSON.parse(inventoryBytes.toString("utf8"));
    expect(sha(readFileSync(new URL("../../../"+inventory.capturePath,import.meta.url)))).toBe(inventory.capturedFixtureSha256);
    const expectedInputs=[...before.sourceInputs,...read("tools/question-quality/fixtures/question-intraop-acceptance-batch9-source-dependencies-20261112.json").records];
    expect(inventory.records.map(({requiredReleasePresent,reason,...row}:{requiredReleasePresent:boolean;reason:string;path:string;sha256:string})=>row)).toEqual(expectedInputs);
    for(const input of inventory.records){
      expect(existsSync(new URL("../../../"+input.path,import.meta.url)),input.path+" exact release presence").toBe(input.requiredReleasePresent);
      if(input.requiredReleasePresent)expect(sha(raw(input.path)),input.path+" exact historical source epoch").toBe(input.sha256);
    }
    for(const f of frozen){
      expect(sha(f.sourceQuestionJson)).toBe(f.sourceQuestionSha256);expect(sha(f.sourceNodeJson)).toBe(f.sourceNodeSha256);expect(sha(f.sourceCaseJson)).toBe(f.sourceCaseSha256);
      const c=cases.find(c=>c.id===f.caseId)!,n=c.decisionNodes.find(n=>n.id===f.nodeId)!;
      expect(digest(c)).toBe(f.acceptedCaseSha256);expect(digest(n)).toBe(f.acceptedNodeSha256);
      expect(digest(questions.find(q=>q.id===f.questionVariantId))).toBe(f.acceptedQuestionSha256);
      expect(c.decisionNodes.map(n=>n.id)).toEqual(JSON.parse(f.sourceCaseJson).decisionNodes.map((n:{id:string})=>n.id));
      expect(syntheticClinicalCaseSchema.safeParse(c).success).toBe(true);
    }
  });

  it("changes clinical text only by patient-name substitution and native summary whitespace",()=>{
    const names=(v:unknown,name:string):unknown=>{
      if(typeof v==="string")return [name,name.split(" ")[0]!].reduce((s,part)=>s.replace(new RegExp("\\b"+part+"\\b","g"),"{patientName}"),v);
      if(Array.isArray(v))return v.map(x=>names(x,name));
      if(v&&typeof v==="object")return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,["id","patientDisplayName","patientPresentationVariantId"].includes(k)?x:names(x,name)]));
      return v;
    };
    for(const f of frozen){const original=JSON.parse(f.sourceCaseJson),name=original.patientDisplayName,c=cases.find(c=>c.id===f.caseId)!;
      expect(questions.find(q=>q.id===f.questionVariantId)).toEqual(names(JSON.parse(f.sourceQuestionJson),name));
      expect(c.decisionNodes.find(n=>n.id===f.nodeId)).toEqual(names(JSON.parse(f.sourceNodeJson),name));
      const expected=names(original,name) as typeof c;expected.routineEligible=true;expected.procedureContext=c.procedureContext;
      expected.learningSummary=expected.decisionNodes.map(n=>n.explanation).join(" ");expect(c).toEqual(expected);
    }
  });

  it("rejects unrelated release, authority, timing and source changes instead of masking old guards",()=>{
    const changed=structuredClone(live);changed.cases[0]!.presentation+=" Unapproved change.";
    expect(()=>beforeProgramBatch9AcceptanceRelease(changed)).toThrow();
    expect(()=>beforeProgramBatch9AcceptanceManifest({...manifest,accepted:manifest.accepted.slice(1)})).toThrow();
    const wrongTiming=structuredClone(timing);wrongTiming[0]!.nodeId+=".changed";
    expect(()=>beforeProgramBatch9AcceptanceTimings(wrongTiming)).toThrow();
    const p="packages/clinical-content/src/question-ship-manifest.ts",original=raw(p).toString("utf8");
    expect(()=>beforeProgramBatch9AcceptanceSource(p,original+"\n// unrelated\n")).toThrow();
    expect(sha(beforeProgramBatch9AcceptanceSource(p,original))).toBe(before.observed[p]);
  });

  it("keeps every prior case, concept and authority row exact and appends only the 17 named acceptances",()=>{
    expect(live.cases).toHaveLength(1421);expect(live.cases.flatMap(c=>c.decisionNodes)).toHaveLength(1627);
    expect(live.concepts).toHaveLength(1126);expect(new Set(live.cases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size).toBe(926);
    for(const c of before.defaultRelease.cases)expect(digest(live.cases.find(n=>n.id===c.id)),c.id).toBe(digest(c));
    expect(live.concepts.slice(0,1109)).toEqual(before.defaultRelease.concepts);
    expect(manifest.accepted).toHaveLength(794);expect(manifest.accepted.slice(0,777)).toEqual(before.manifest.accepted);
    expect(digest(manifest)).toBe(digest({...before.manifest,id:"question-ship.2026-11-12.v18",accepted:[...before.manifest.accepted,...rows],
      headerSources:{...before.manifest.headerSources,...Object.fromEntries(rows.map(r=>[r.caseId,r.sourceView]))}}));
    expect(digest(catalog)).toBe(before.catalogHash);
    expect(beforeProgramBatch9AcceptanceRelease(live)).toEqual(before.defaultRelease);
    expect(beforeProgramBatch9AcceptanceManifest(manifest)).toEqual(before.manifest);
    expect(beforeProgramBatch9AcceptanceTimings(timing)).toEqual(before.timing);
    expect(digest(live)).toBe(after.defaultSha256);expect(digest(manifest)).toBe(after.manifestSha256);
  });

  it("retains the entire historical timing prefix and binds every new testing option exactly once",()=>{
    expect(timing.slice(0,before.timing.length)).toEqual(before.timing);expect(timing.slice(before.timing.length)).toEqual(waits);
    expect(waits).toHaveLength(17);expect(orders).toHaveLength(16);
    for(const c of cases)for(const n of c.decisionNodes){
      const entries=timing.filter(t=>t.caseId===c.id&&t.nodeId===n.id&&t.questionVariantId===n.questionVariantId);expect(entries).toHaveLength(1);
      const t=entries[0]!.classification;
      if(t.kind==="test_choices")for(const choice of t.choices){
        expect(n.answerChoices.find(a=>a.id===choice.choiceId)!.label).toBe(choice.choiceLabel);
        const exact=orders.filter(o=>o.caseId===c.id&&o.nodeId===n.id&&o.questionVariantId===n.questionVariantId&&o.choiceId===choice.choiceId);
        if(choice.timing.kind==="no_test"){expect(exact).toEqual([]);continue;}
        expect(exact).toHaveLength(1);expect(exact[0]).toMatchObject({timingProfileId:choice.timing.timingProfileId,disposition:{kind:"not_executed",reason:"future_planned"}});
      }
    }
  });

  it("declares four compatible live cases and ten clinic reviews without executed results or promoted clinical approval",()=>{
    expect(cases.filter(c=>c.procedureContext?.mode==="live")).toHaveLength(4);
    expect(cases.filter(c=>c.procedureContext?.mode==="chart_review")).toHaveLength(10);
    expect(families).toHaveLength(2);
    for(const c of cases){
      expect(c.routineEligible).toBe(true);
      if(c.procedureContext?.mode==="live")expect(["procedure.groin_hernia_repair","procedure.egd"]).toContain(c.procedureContext.familyId);
      else expect(c.requiredClinicalSetting).toBe("clinic");
      for(const n of c.decisionNodes){expect(n.resultGateAfter??null).toBeNull();expect(n.answerChoices.every(a=>!a.serviceRequest)).toBe(true);expect(n.shuffleAnswers).toBe(true);}
    }
    for(const q of questions){expect(q.reviewStatus).toBe("needs_clinician_review");expect(q.lastClinicianReview).toBeNull();}
    expect(manifest.clinicalApproval).toBe(false);
  });

  it("pins exact release source deltas, presence and every immutable epoch preimage",()=>{
    const bytes=readFileSync(new URL("../../../tools/question-quality/fixtures/question-program-batch9-release-source-pins-20261112.json",import.meta.url));
    expect(createHash("sha256").update(bytes).digest("hex")).toBe("1364a43e1f6d8bb811a80ddc692dd36e5bd73e84b60ea7148d6cfe8022f5be43");
    const pins=JSON.parse(bytes.toString("utf8"));
    const hash=(path:string)=>createHash("sha256").update(readFileSync(new URL("../../../"+path,import.meta.url))).digest("hex");
    expect(hash(pins.capturePath)).toBe(pins.capturedFixtureSha256);
    expect(hash("packages/clinical-content/src/question-program-batch9-acceptance-test-support.ts")).toBe(pins.testSupportSha256);
    expect(hash(pins.repairedTopicTestArchivePath)).toBe(pins.repairedTopicTestArchiveSha256);
    const migration=read(pins.capturePath);expect(pins.paths).toHaveLength(23);
    expect(pins.paths.map((p:{path:string})=>p.path)).toEqual(migration.files.map((r:{path:string})=>r.path));
    for(const pin of pins.paths){
      const row=migration.files.find((r:{path:string})=>r.path===pin.path)!;
      expect(pin.mainBeforeSha256).toBe(row.beforeSha256);expect(pin.mainAfterSha256).toBe(row.afterSha256);
      expect(createHash("sha256").update(row.beforeText).digest("hex")).toBe(row.beforeSha256);
      const url=new URL("../../../"+pin.path,import.meta.url);expect(existsSync(url)).toBe(pin.requiredReleaseSha256!==null);
      const current=existsSync(url)?readFileSync(url,"utf8"):undefined;
      if(current!==undefined)expect(hash(pin.path)).toBe(pin.requiredReleaseSha256);
      expect(createHash("sha256").update(beforeProgramBatch9AcceptanceSource(pin.path,current)!).digest("hex")).toBe(row.beforeSha256);
      if(current!==undefined)expect(()=>beforeProgramBatch9AcceptanceSource(pin.path,current+"\n// unauthorized\n")).toThrow();
    }
  });
});
