import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {SYNTHETIC_CLINICAL_RELEASE as live,QUESTION_CATALOG_RELEASE as catalog} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as manifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as timings} from "./answer-choice-timing";
import {QUESTION_FLAGS5_ACCEPTED_ROWS as earlierRows,QUESTION_FLAGS5_ACCEPTED_QUESTIONS as earlierQuestions} from "./question-flags5-accepted-20261116";
import {QUESTION_FLAGS5_FINAL_ACCEPTED_ROWS as rows,QUESTION_FLAGS5_FINAL_ACCEPTED_CASES as cases,QUESTION_FLAGS5_FINAL_ACCEPTED_QUESTIONS as questions,QUESTION_FLAGS5_FINAL_FROZEN_PRESERVATION as frozen,QUESTION_FLAGS5_FINAL_ACCEPTED_TIMING_ENTRIES as waits,QUESTION_FLAGS5_FINAL_ACCEPTED_TEST_ORDER_RECORDS as orders,QUESTION_FLAGS5_FINAL_ACCEPTED_CLAIMS as claims,QUESTION_FLAGS5_FINAL_ACCEPTED_BASIS_CLAIMS as basis,QUESTION_FLAGS5_FINAL_ACCEPTED_SOURCES as sources,QUESTION_FLAGS5_FINAL_STATEMENT_MAPPINGS as maps,QUESTION_FLAGS5_FINAL_AUTHORED_CONCEPTS as authoredConcepts} from "./question-flags5-final-accepted-20261116";
import {beforeFlags5FinalAcceptanceRelease as priorRelease,beforeFlags5FinalAcceptanceManifest as priorManifest,beforeFlags5FinalAcceptanceTimings as priorTimings,beforeFlags5FinalAcceptanceSource as priorSource} from "./question-flags5-final-acceptance-test-support";
const read=(name:string)=>JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/"+name,import.meta.url),"utf8"));
const before=read("question-flags5-final-acceptance-before-20261116.json"),after=read("question-flags5-final-acceptance-after-20261116.json");
const hash=(x:unknown)=>createHash("sha256").update(JSON.stringify(x)).digest("hex");

describe("flags5 final seven exact PASS admission",()=>{
  it("admits exactly the seven manager-listed reviewed versions in six existing cases",()=>{
    expect(rows.map(r=>r.questionVariantId)).toEqual([
      "question.varicose-veins.intervention-referral-after-axial-reflux.v3.r3",
      "question.palpable-breast.negative-mammogram-targeted-us.v2.r3",
      "question.palpable-breast.negative-mammogram-targeted-us.v3.r3",
      "question.palpable-breast.negative-mammogram-targeted-us.v4.r5",
      "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v2.r3",
      "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v3.r3",
      "question.achalasia.high-resolution-manometry.v4.r8",
    ]);expect(cases).toHaveLength(6);
    for(const f of frozen){const cs=live.cases.find(c=>c.id===f.caseId)!;
      expect(hash(cs.decisionNodes.find(n=>n.id===f.nodeId))).toBe(f.sourceNodeSha256);
      expect(hash(questions.find(q=>q.id===f.questionVariantId))).toBe(f.sourceQuestionSha256);
      expect(hash(JSON.parse(f.sourceCaseJson))).toBe(f.sourceCaseSha256);
      expect(cs).toEqual(cases.find(c=>c.id===cs.id));
    }
  });
  it("freezes all earlier sixteen nodes and every unrelated case, including case ordering",()=>{
    const affected=new Set(rows.map(r=>r.caseId));
    expect(live.cases.map(c=>c.id)).toEqual(before.defaultRelease.cases.map((c:{id:string})=>c.id));
    for(const cs of before.defaultRelease.cases)if(!affected.has(cs.id as never))expect(live.cases.find(c=>c.id===cs.id)).toEqual(cs);
    for(const row of earlierRows){const old=before.defaultRelease.cases.find((c:{id:string})=>c.id===row.caseId).decisionNodes.find((n:{id:string})=>n.id===row.nodeId);
      expect(live.cases.find(c=>c.id===row.caseId)!.decisionNodes.find(n=>n.id===row.nodeId)).toEqual(old);
      expect(manifest.accepted.find(r=>r.acceptanceId===row.acceptanceId)).toEqual(row);
    }
    expect(earlierQuestions.every(q=>q.reviewStatus==="needs_clinician_review")).toBe(true);
    expect(hash(catalog)).toBe(before.catalogSha256);
  });
  it("appends only seven authority rows and six exact header sources",()=>{
    expect(manifest).toEqual({...before.manifest,id:"question-ship.2026-11-16.v22",accepted:[...before.manifest.accepted,...rows],headerSources:{...before.manifest.headerSources,...Object.fromEntries(rows.map(r=>[r.caseId,r.sourceView]))}});
    expect(live.cases).toHaveLength(1436);expect(live.cases.flatMap(c=>c.decisionNodes)).toHaveLength(1644);
    expect(live.concepts).toHaveLength(1144);expect(new Set(live.cases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size).toBe(945);
    expect(manifest.accepted).toHaveLength(832);
  });
  it("versions only the previously documented venous acquisition meaning",()=>{
    expect(live.concepts.slice(0,before.defaultRelease.concepts.length)).toEqual(before.defaultRelease.concepts);
    expect(live.concepts.at(-1)!.id).toBe("concept.varicose-veins.intervention-referral-after-axial-reflux.v2");
    expect(authoredConcepts).toHaveLength(1);expect(authoredConcepts[0]!.previousConceptId).toBe("concept.varicose-veins.intervention-referral-after-axial-reflux");
    for(const f of frozen)if(f.id!=="QF5-02")expect(rows.find(r=>r.questionVariantId===f.questionVariantId)!.conceptId).toBe(f.previousConceptId);
  });
  it("retains every old wait and adds fourteen exact testing choices without timing clinical observation",()=>{
    expect(timings.slice(0,before.timing.length)).toEqual(before.timing);
    expect(timings.slice(before.timing.length)).toEqual(waits);expect(waits).toHaveLength(7);expect(orders).toHaveLength(14);
    for(const t of waits){const n=live.cases.find(c=>c.id===t.caseId)!.decisionNodes.find(n=>n.id===t.nodeId)!;
      expect(timings.filter(x=>x.caseId===t.caseId&&x.nodeId===t.nodeId&&x.questionVariantId===t.questionVariantId)).toHaveLength(1);
      if(t.classification.kind!=="test_choices")throw Error("Expected named testing alternatives");
      for(const c of t.classification.choices){expect(c.choiceLabel).toBe(n.answerChoices.find(a=>a.id===c.choiceId)!.label);
        const exact=orders.filter(o=>o.questionVariantId===t.questionVariantId&&o.choiceId===c.choiceId);
        if(c.timing.kind==="test"){expect(exact).toHaveLength(1);expect(exact[0]).toMatchObject({timingProfileId:c.timing.timingProfileId,disposition:{kind:"not_executed",reason:"future_planned"}});}
        else {expect(exact).toEqual([]);if(/clinical (examination|review)/i.test(c.choiceLabel))expect(n.answerChoices.find(a=>a.id===c.choiceId)!.serviceRequest).toBeNull();}
      }
    }
  });
  it("keeps complete paired context, draft status and atomic claim/source closure",()=>{
    const cs=live.cases.find(c=>c.id==="case.achalasia.clinic-referral")!;
    expect(cs.decisionNodes[0]!.exhibit).toBeDefined();expect(cs.decisionNodes[1]!.questionVariantId).toBe("question.achalasia.manometric-recognition.v4.r6");
    const known=[...claims,...basis];
    for(const q of questions){expect(q.reviewStatus).toBe("needs_clinician_review");expect(q.lastClinicianReview).toBeNull();
      expect(maps.some(m=>m.questionVariantId===q.id)).toBe(true);
      for(const id of q.supportingEvidenceClaimIds){const c=known.find(c=>c.id===id)!;expect(c,id).toBeDefined();for(const s of c.sourceIds)expect(sources.some(source=>source.id===s),s).toBe(true);}
    }
    expect(manifest.clinicalApproval).toBe(false);
  });
  it("keeps QF5-06 and the calf at their exact live fallback bytes",()=>{
    for(const id of ["question.cirrhosis-perioperative-risk.multifactor-assessment.v3","question.topic-soft-tissue-sarcoma-desmoid.calf-core-tract.20261111.v1"]){
      const old=before.defaultRelease.cases.find((c:{decisionNodes:Array<{questionVariantId:string}>})=>c.decisionNodes.some(n=>n.questionVariantId===id));
      expect(live.cases.find(c=>c.id===old.id)).toEqual(old);
    }
  });
  it("rejects unrelated drift and mutations of cached exact preimages",()=>{
    expect(priorRelease(live)).toEqual(before.defaultRelease);expect(priorManifest(manifest)).toEqual(before.manifest);expect(priorTimings(timings)).toEqual(before.timing);
    const bad=structuredClone(live);bad.cases[0]!.presentation+=" unauthorized";expect(()=>priorRelease(bad)).toThrow();
    expect(()=>priorManifest({...manifest,accepted:manifest.accepted.slice(1)})).toThrow();
    const badTiming=structuredClone(timings);badTiming[0]!.nodeId+=".unauthorized";expect(()=>priorTimings(badTiming)).toThrow();
    const cached=priorRelease(live),old=cached.cases[0]!.presentation;expect(priorRelease(live)).toBe(cached);
    try{cached.cases[0]!.presentation+=" unauthorized";expect(()=>priorRelease(live)).toThrow();}finally{cached.cases[0]!.presentation=old;}
    const path="packages/clinical-content/src/question-ship-manifest.ts",source=readFileSync(new URL("../../../"+path,import.meta.url),"utf8");
    expect(()=>priorSource(path,source+"\n// unauthorized\n")).toThrow();
    const earlier=read("question-flags5-acceptance-source-migration-20261116.json").files.find((f:{path:string})=>f.path===path);
    expect(priorSource(path,earlier.beforeText)).toBe(earlier.beforeText);
    expect(()=>priorSource(path,earlier.beforeText+"\n// unauthorized\n")).toThrow();
    const savePath="apps/player/src/questionProgramBatch8SaveCompatibility.test.ts";
    const saveSource=readFileSync(new URL("../../../"+savePath,import.meta.url),"utf8");
    const saveDelta=read("question-flags5-save-compatibility-source-migration-20261116.json").files.find((f:{path:string})=>f.path===savePath);
    expect(priorSource(savePath,saveSource)).toBe(saveDelta.beforeText);
    expect(()=>priorSource(savePath,saveSource+"\n// unauthorized\n")).toThrow();
    expect(hash(live)).toBe(after.defaultSha256);expect(hash(manifest)).toBe(after.manifestSha256);
  });
});
