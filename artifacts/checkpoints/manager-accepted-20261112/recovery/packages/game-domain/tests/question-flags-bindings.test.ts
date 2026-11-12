import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {QUESTION_FLAGS_ROUND1_TIMING_ENTRIES as ANSWER_CHOICE_TIMING_REGISTRY,QUESTION_FLAG_REVISIONS,QUESTION_FLAGS_ROUND1_RELEASE as SYNTHETIC_CLINICAL_RELEASE} from "@gamify-surgery/clinical-content";
import {EXACT_TEST_CHOICE_ORDER_RECORDS,getExactTestChoiceOrderRecord} from "../src/test-choice-orders";
import type {EncounterState} from "../src/types";
const old=JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/question-flags-orders-before-20261104.json",import.meta.url),"utf8")) as typeof EXACT_TEST_CHOICE_ORDER_RECORDS;
describe("question flags: exact frozen and new planned-test identities",()=>{
  it("retains every old exact order record and appends twelve non-execution records",()=>{
    expect(EXACT_TEST_CHOICE_ORDER_RECORDS.slice(0,old.length)).toEqual(old);
    const added=EXACT_TEST_CHOICE_ORDER_RECORDS.slice(old.length,old.length+12);expect(added).toHaveLength(12);
    expect(added.every(r=>r.disposition.kind==="not_executed")).toBe(true);
  });
  it("binds every new timed choice and keeps four planned/external keyed tests out of local execution",()=>{
    let keys=0,choices=0;
    for(const r of QUESTION_FLAG_REVISIONS){
      const cs=SYNTHETIC_CLINICAL_RELEASE.cases.find(c=>c.id===r.caseId)!,node=cs.decisionNodes.find(n=>n.id===r.nodeId)!;
      const timing=ANSWER_CHOICE_TIMING_REGISTRY.find(t=>t.caseId===cs.id&&t.nodeId===node.id&&t.questionVariantId===node.questionVariantId)!;
      if(timing.classification.kind!=="test_choices")continue;
      for(const t of timing.classification.choices){if(t.timing.kind!=="test")continue;
        const record=getExactTestChoiceOrderRecord({frozenCase:cs} as EncounterState,node,t.choiceId);expect(record).not.toBeNull();choices++;
        expect(record!.choiceLabel).toBe(t.choiceLabel);expect(record!.timingProfileId).toBe(t.timing.timingProfileId);
        expect(record!.disposition.kind).toBe("not_executed");if(node.answerChoices.find(c=>c.id===t.choiceId)!.isCorrect)keys++;
      }
    }
    expect(keys).toBe(4);expect(choices).toBe(12);
  });
  it("does not guess a binding after a new choice label changes",()=>{
    const r=QUESTION_FLAG_REVISIONS.find(r=>r.auditId==="F12")!,cs=SYNTHETIC_CLINICAL_RELEASE.cases.find(c=>c.id===r.caseId)!,node=cs.decisionNodes.find(n=>n.id===r.nodeId)!;
    const key=node.answerChoices.find(c=>c.isCorrect)!;
    expect(getExactTestChoiceOrderRecord({frozenCase:cs} as EncounterState,{...node,answerChoices:node.answerChoices.map(c=>c.id===key.id?{...c,label:c.label+" altered"}:c)},key.id)).toBeNull();
  });
});
