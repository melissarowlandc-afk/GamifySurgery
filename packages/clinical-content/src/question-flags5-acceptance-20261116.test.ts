// FINAL FLAGS5 ACCEPTANCE GUARD — retain the complete historical sixteen-PASS proof.
import {beforeFlags5FinalAcceptanceRelease,beforeFlags5FinalAcceptanceManifest,beforeFlags5FinalAcceptanceTimings} from "./question-flags5-final-acceptance-test-support";
import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {SYNTHETIC_CLINICAL_RELEASE as currentLive,QUESTION_CATALOG_RELEASE as catalog} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as currentManifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as currentWaits} from "./answer-choice-timing";
import {QUESTION_FLAGS5_ACCEPTED_ROWS as rows,QUESTION_FLAGS5_ACCEPTED_CASES as cases,QUESTION_FLAGS5_ACCEPTED_QUESTIONS as questions,QUESTION_FLAGS5_FROZEN_PRESERVATION as frozen,QUESTION_FLAGS5_ACCEPTED_TIMING_ENTRIES as timings,QUESTION_FLAGS5_ACCEPTED_TEST_ORDER_RECORDS as orders,QUESTION_FLAGS5_WITHDRAWN_ROWS as withdrawn} from "./question-flags5-accepted-20261116";
import {QUESTION_FLAGS5_ACCEPTED_CLAIMS,QUESTION_FLAGS5_ACCEPTED_BASIS_CLAIMS,QUESTION_FLAGS5_ACCEPTED_SOURCES,QUESTION_FLAGS5_ACCEPTED_STATEMENT_MAPPINGS} from "./question-flags5-accepted-20261116";
import {beforeFlags5AcceptanceRelease as oldRelease,beforeFlags5AcceptanceManifest as oldManifest,beforeFlags5AcceptanceTimings as oldTimings,beforeFlags5AcceptanceSource as oldSource} from "./question-flags5-acceptance-test-support";
const live=beforeFlags5FinalAcceptanceRelease(currentLive),manifest=beforeFlags5FinalAcceptanceManifest(currentManifest),waits=beforeFlags5FinalAcceptanceTimings(currentWaits);
const read=(p:string)=>JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/"+p,import.meta.url),"utf8"));
const before=read("question-flags5-acceptance-before-20261116.json"),after=read("question-flags5-acceptance-after-20261116.json");
const hash=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");

describe("owner-directed flag fixes batch 5 exact admission",()=>{
  it("admits only the sixteen independently passed exact node/question versions",()=>{
    expect(rows).toHaveLength(16);expect(cases).toHaveLength(15);expect(questions).toHaveLength(16);
    for(const f of frozen){const row=rows.find(r=>r.questionVariantId===f.questionVariantId)!;
      const n=live.cases.find(c=>c.id===row.caseId)!.decisionNodes.find(n=>n.id===row.nodeId)!;
      expect(hash(n)).toBe(f.sourceNodeSha256);expect(hash(questions.find(q=>q.id===f.questionVariantId))).toBe(f.sourceQuestionSha256);
      expect(hash(JSON.parse(f.sourceCaseJson))).toBe(f.sourceCaseSha256);
      expect(live.cases.find(c=>c.id===row.caseId)).toEqual(cases.find(c=>c.id===row.caseId));
    }
  });
  it("does not alter other cases, old FSRS concepts, or the retained catalog",()=>{
    const touched=new Set(rows.map(r=>r.caseId));
    for(const c of before.defaultRelease.cases)if(!touched.has(c.id as never))expect(live.cases.find(x=>x.id===c.id)).toEqual(c);
    expect(live.concepts.slice(0,before.defaultRelease.concepts.length)).toEqual(before.defaultRelease.concepts);
    expect(hash(catalog)).toBe(before.catalogSha256);
    expect(live.cases).toHaveLength(1436);expect(live.cases.flatMap(c=>c.decisionNodes)).toHaveLength(1644);
    expect(live.concepts).toHaveLength(1143);expect(new Set(live.cases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size).toBe(944);
  });
  it("preserves immutable legacy bindings and every unrelated authority row",()=>{
    expect(manifest.legacyBindings).toEqual(before.manifest.legacyBindings);
    expect(manifest.accepted).toHaveLength(825);
    expect(manifest.accepted.filter(r=>r.sourceView!=="flags5-accepted-r2")).toEqual(before.manifest.accepted.filter((r:{acceptanceId:string})=>!withdrawn.some(w=>w.acceptanceId===r.acceptanceId)));
    const beforeRelation=before.manifest.topicConsolidations.find((r:{id:string})=>r.id==="topic-program.batch4.case.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence-pass.v1");
    expect(manifest.topicConsolidations).toEqual(before.manifest.topicConsolidations.map((r:{id:string})=>r.id===beforeRelation.id?{...r,with:"question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v2.r1"}:r));
    expect(manifest.replacements).toEqual(before.manifest.replacements);expect(manifest.retirements).toEqual(before.manifest.retirements);
  });
  it("keeps the unaccepted first dysphagia node and its prior findings visible",()=>{
    const cs=live.cases.find(c=>c.id==="case.achalasia.clinic-referral")!;
    const previous=before.defaultRelease.cases.find((c:{id:string})=>c.id===cs.id);
    expect(cs.presentation).toBe(previous.presentation);expect(cs.approvedInstantiationProfiles).toEqual(previous.approvedInstantiationProfiles);
    expect(cs.decisionNodes[0]).toEqual(previous.decisionNodes[0]);
    expect(cs.decisionNodes[1]!.questionVariantId).toBe("question.achalasia.manometric-recognition.v4.r6");
  });
  it("retains all historical wait tuples and appends exactly sixteen new ones",()=>{
    expect(waits.slice(0,before.timing.length)).toEqual(before.timing);
    expect(waits.slice(before.timing.length)).toEqual(timings);expect(timings).toHaveLength(16);
    for(const t of timings){const n=live.cases.find(c=>c.id===t.caseId)!.decisionNodes.find(n=>n.id===t.nodeId)!;
      expect(waits.filter(r=>r.caseId===t.caseId&&r.nodeId===t.nodeId&&r.questionVariantId===t.questionVariantId)).toHaveLength(1);
      if(t.classification.kind!=="test_choices")continue;
      for(const c of t.classification.choices){expect(c.choiceLabel).toBe(n.answerChoices.find(a=>a.id===c.choiceId)!.label);
        const exact=orders.filter(o=>o.questionVariantId===t.questionVariantId&&o.choiceId===c.choiceId);
        if(c.timing.kind==="no_test")expect(exact).toEqual([]);else expect(exact).toHaveLength(1);
      }
    }
  });
  it("retains draft status and the deliberate basic/safety roles",()=>{
    expect(manifest.clinicalApproval).toBe(false);
    const claims=[...QUESTION_FLAGS5_ACCEPTED_CLAIMS,...QUESTION_FLAGS5_ACCEPTED_BASIS_CLAIMS];
    for(const q of questions){expect(q.reviewStatus).toBe("needs_clinician_review");expect(q.lastClinicianReview).toBeNull();
      expect(QUESTION_FLAGS5_ACCEPTED_STATEMENT_MAPPINGS.some(m=>m.questionVariantId===q.id),q.id).toBe(true);
      for(const id of q.supportingEvidenceClaimIds){const claim=claims.find(c=>c.id===id)!;expect(claim,id).toBeDefined();
        for(const source of claim.sourceIds)expect(QUESTION_FLAGS5_ACCEPTED_SOURCES.some(s=>s.id===source),source).toBe(true);
      }
    }
    expect(frozen.filter(f=>f.id.startsWith("QF5-LY-"))).toHaveLength(5);
    expect(rows.some(r=>r.conceptId==="concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v2")).toBe(true);
  });
  it("preserves pre-admission definitions and rejects unrelated drift in inverse guards",()=>{
    expect(oldRelease(live)).toEqual(before.defaultRelease);expect(oldManifest(manifest)).toEqual(before.manifest);expect(oldTimings(waits)).toEqual(before.timing);
    const changed=structuredClone(live);changed.cases[0]!.presentation+=" unauthorized";expect(()=>oldRelease(changed)).toThrow();
    expect(()=>oldManifest({...manifest,accepted:manifest.accepted.slice(1)})).toThrow();
    const t=structuredClone(waits);t[0]!.nodeId+=".unauthorized";expect(()=>oldTimings(t)).toThrow();
    const p="packages/clinical-content/src/question-ship-manifest.ts",s=readFileSync(new URL("../../../"+p,import.meta.url),"utf8");
    expect(()=>oldSource(p,s+"\n// unauthorized\n")).toThrow();
    expect(hash(live)).toBe(after.defaultSha256);expect(hash(manifest)).toBe(after.manifestSha256);
  });
  it("rechecks cached preimages instead of trusting object identity",()=>{
    const prior=oldRelease(live),text=prior.cases[0]!.presentation;
    expect(oldRelease(live)).toBe(prior);
    try{prior.cases[0]!.presentation+=" unauthorized";expect(()=>oldRelease(live)).toThrow();}
    finally{prior.cases[0]!.presentation=text;}
    const authority=oldManifest(manifest) as unknown as {accepted:Array<{caseId:string}>};
    const caseId=authority.accepted[0]!.caseId;
    try{authority.accepted[0]!.caseId+=".unauthorized";expect(()=>oldManifest(manifest)).toThrow();}
    finally{authority.accepted[0]!.caseId=caseId;}
    expect(oldRelease(live)).toEqual(before.defaultRelease);expect(oldManifest(manifest)).toEqual(before.manifest);
  });
});
