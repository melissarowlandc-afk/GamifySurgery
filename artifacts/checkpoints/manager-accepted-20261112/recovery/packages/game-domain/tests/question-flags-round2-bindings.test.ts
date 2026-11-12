import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {ANSWER_CHOICE_TIMING_REGISTRY,QUESTION_FLAG_ROUND2_REVISIONS,QUESTION_BANK_PRE_BATCH2A_RELEASE as SYNTHETIC_CLINICAL_RELEASE} from "@gamify-surgery/clinical-content";
import {EXACT_TEST_CHOICE_ORDER_RECORDS,getExactTestChoiceOrderRecord} from "../src/test-choice-orders";
import type {EncounterState} from "../src/types";
const before=JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/question-flags-round2-before-20261104.json",import.meta.url),"utf8")) as {orders:typeof EXACT_TEST_CHOICE_ORDER_RECORDS};
describe("question flags round two: exact planned-study bindings",()=>{
  it("retains all 335 old records and appends 22 exact non-execution identities",()=>{
    expect(before.orders).toHaveLength(335);expect(EXACT_TEST_CHOICE_ORDER_RECORDS.slice(0,335)).toEqual(before.orders);
    const roundTwo=EXACT_TEST_CHOICE_ORDER_RECORDS.filter(r=>QUESTION_FLAG_ROUND2_REVISIONS.some(q=>q.questionVariantId===r.questionVariantId));
    expect(roundTwo).toHaveLength(22);
    expect(roundTwo.every(r=>r.disposition.kind==="not_executed")).toBe(true);
  });
  it("binds every offered study and keeps eight planned/external keys out of local execution",()=>{
    let choices=0,keys=0;
    for(const r of QUESTION_FLAG_ROUND2_REVISIONS){
      const c=SYNTHETIC_CLINICAL_RELEASE.cases.find(c=>c.id===r.caseId)!,n=c.decisionNodes.find(n=>n.id===r.nodeId)!;
      const t=ANSWER_CHOICE_TIMING_REGISTRY.find(t=>t.questionVariantId===n.questionVariantId)!;
      if(t.classification.kind!=="test_choices")continue;
      for(const ch of t.classification.choices){if(ch.timing.kind!=="test")continue;
        const record=getExactTestChoiceOrderRecord({frozenCase:c} as EncounterState,n,ch.choiceId)!;
        expect(record).toBeTruthy();expect(record.choiceLabel).toBe(ch.choiceLabel);expect(record.timingProfileId).toBe(ch.timing.timingProfileId);
        expect(record.disposition.kind).toBe("not_executed");choices++;if(n.answerChoices.find(c=>c.id===ch.choiceId)!.isCorrect)keys++;
      }
    }
    expect(choices).toBe(22);expect(keys).toBe(8);
  });
  it("rejects a changed label rather than guessing a planned-test binding",()=>{
    const r=QUESTION_FLAG_ROUND2_REVISIONS.find(r=>r.auditId==="F02")!,c=SYNTHETIC_CLINICAL_RELEASE.cases.find(c=>c.id===r.caseId)!,n=c.decisionNodes.find(n=>n.id===r.nodeId)!;
    const a=n.answerChoices.find(c=>c.isCorrect)!;
    expect(getExactTestChoiceOrderRecord({frozenCase:c} as EncounterState,{...n,answerChoices:n.answerChoices.map(c=>c.id===a.id?{...c,label:c.label+" changed"}:c)},a.id)).toBeNull();
  });
});
