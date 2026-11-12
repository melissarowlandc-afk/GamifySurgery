import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {ANSWER_CHOICE_TIMING_REGISTRY,QUESTION_BANK_BATCH2A_REVISIONS,QUESTION_FLAGS_PRE_ROUND3_RELEASE as SYNTHETIC_CLINICAL_RELEASE,QUESTION_BANK_PRE_BATCH2A_RELEASE} from "@gamify-surgery/clinical-content";
import {EXACT_TEST_CHOICE_ORDER_RECORDS,getExactTestChoiceOrderRecord} from "../src/test-choice-orders";
import type {EncounterState} from "../src/types";
const baseline=JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/question-bank-batch2a-before-20261104.json",import.meta.url),"utf8")) as {orders:typeof EXACT_TEST_CHOICE_ORDER_RECORDS};
describe("batch 2a exact test choices and preserved frozen identities",()=>{
  it("preserves all 357 previous records and appends exactly fourteen bound choices",()=>{
    expect(baseline.orders).toHaveLength(357);expect(EXACT_TEST_CHOICE_ORDER_RECORDS.slice(0,357)).toEqual(baseline.orders);
    // This historical batch owns fourteen tuples; subsequent additive batches
    // retain them and test their own records separately.
    expect(EXACT_TEST_CHOICE_ORDER_RECORDS.filter(r=>QUESTION_BANK_BATCH2A_REVISIONS.some(q=>q.questionVariantId===r.questionVariantId))).toHaveLength(14);
  });
  it("resolves every offered test, including three existing result gates, by exact label and timing",()=>{
    let count=0,gates=0,previews=0;
    for(const r of QUESTION_BANK_BATCH2A_REVISIONS){
      const c=SYNTHETIC_CLINICAL_RELEASE.cases.find(c=>c.id===r.caseId)!,n=c.decisionNodes.find(n=>n.id===r.nodeId)!;
      const row=ANSWER_CHOICE_TIMING_REGISTRY.find(t=>t.questionVariantId===n.questionVariantId)!;
      if(row.classification.kind!=="test_choices")continue;
      for(const t of row.classification.choices){if(t.timing.kind!=="test")continue;
        const record=getExactTestChoiceOrderRecord({frozenCase:c} as EncounterState,n,t.choiceId)!;
        expect(record,t.choiceLabel).toBeTruthy();expect(record.choiceLabel).toBe(t.choiceLabel);expect(record.timingProfileId).toBe(t.timing.timingProfileId);count++;
        if(record.disposition.kind==="result_gate_route_override"){
          expect(n.answerChoices.find(a=>a.id===t.choiceId)!.isCorrect).toBe(true);expect(n.resultGateAfter).not.toBeNull();gates++;
        }else {expect(record.disposition.kind).toBe("not_executed");previews++;}
        const altered={...n,answerChoices:n.answerChoices.map(a=>a.id===t.choiceId?{...a,label:a.label+" altered"}:a)};
        expect(getExactTestChoiceOrderRecord({frozenCase:c} as EncounterState,altered,t.choiceId)).toBeNull();
      }
    }
    expect(count).toBe(14);expect(gates).toBe(3);expect(previews).toBe(11);
  });
  it("keeps the frozen B06 MRI order distinct from its new targeted ultrasound order",()=>{
    const r=QUESTION_BANK_BATCH2A_REVISIONS.find(r=>r.auditId==="B2A06")!;
    const old=QUESTION_BANK_PRE_BATCH2A_RELEASE.cases.find(c=>c.id===r.caseId)!,current=SYNTHETIC_CLINICAL_RELEASE.cases.find(c=>c.id===r.caseId)!;
    const oldNode=old.decisionNodes[0]!,nowNode=current.decisionNodes[0]!;
    const a=getExactTestChoiceOrderRecord({frozenCase:old} as EncounterState,oldNode,oldNode.answerChoices.find(c=>c.isCorrect)!.id);
    const b=getExactTestChoiceOrderRecord({frozenCase:current} as EncounterState,nowNode,nowNode.answerChoices.find(c=>c.isCorrect)!.id)!;
    // The frozen version uses its original ordinary result gate, without an
    // override record; the new version has an explicit ultrasound route binding.
    expect(a).toBeNull();expect(b.timingProfileId).toBe("timing.test.ultrasound");
    const oldTiming=ANSWER_CHOICE_TIMING_REGISTRY.find(t=>t.questionVariantId===oldNode.questionVariantId)!;
    expect(oldTiming.classification.kind).toBe("test_choices");
    if(oldTiming.classification.kind==="test_choices")expect(oldTiming.classification.choices.find(t=>t.choiceId===oldNode.answerChoices.find(c=>c.isCorrect)!.id)!.timing).toEqual({kind:"test",timingProfileId:"timing.test.mri"});
    expect(oldNode.resultGateAfter!.resultTypeId).toBe("service.mri");expect(nowNode.resultGateAfter!.resultTypeId).toBe("service.ultrasound");
    expect(oldNode.questionVariantId).not.toBe(b.questionVariantId);
  });
});
