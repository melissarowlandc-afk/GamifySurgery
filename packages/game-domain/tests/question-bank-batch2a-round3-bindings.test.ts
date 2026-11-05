import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { QUESTION_BANK_BATCH2A_ROUND3_RELEASE as live, QUESTION_BANK_BATCH2A_ROUND2_RELEASE as oldStage, QUESTION_BANK_BATCH2A_ROUND3_REVISIONS as revisions, QUESTION_BANK_BATCH2A_ROUND3_TIMING_ENTRIES as timings, QUESTION_BANK_BATCH2A_ROUND3_TESTED_CONCEPTS as concepts } from "@gamify-surgery/clinical-content";
import { QUESTION_BANK_BATCH2A_ROUND3_TEST_ORDER_RECORDS as records } from "../src/question-bank-batch2a-round3-test-orders";
import { EXACT_TEST_CHOICE_ORDER_RECORDS, getExactTestChoiceOrderRecord } from "../src/test-choice-orders";
import { createInitialGameState } from "../src";
import type { EncounterState } from "../src/types";
const entry=JSON.parse(readFileSync(new URL('../../../tools/question-quality/fixtures/question-bank-batch2a-round3-before-20261104.json',import.meta.url),'utf8')) as {orders:typeof records};
describe('batch 2a final-round exact bindings',()=>{
  it('retains every entry tuple and adds twelve exact records without new execution kinds',()=>{
    expect(EXACT_TEST_CHOICE_ORDER_RECORDS.slice(0,entry.orders.length)).toEqual(entry.orders);
    expect(records).toHaveLength(12);expect(records.filter(r=>r.disposition.kind==='result_gate_route_override')).toHaveLength(3);expect(records.filter(r=>r.disposition.kind==='not_executed')).toHaveLength(9);
  });
  it('resolves new labels and timing profiles by complete identities and rejects label drift',()=>{
    let count=0;
    for(const r of revisions){const cs=live.cases.find(c=>c.id===r.caseId)!,n=cs.decisionNodes.find(n=>n.id===r.nodeId)!,t=timings.find(t=>t.questionVariantId===n.questionVariantId)!;
      if(t.classification.kind!=='test_choices')continue;
      for(const choice of t.classification.choices){if(choice.timing.kind!=='test')continue;count++;const row=getExactTestChoiceOrderRecord({frozenCase:cs} as EncounterState,n,choice.choiceId)!;
        expect(row).toBeTruthy();expect(row.choiceLabel).toBe(choice.choiceLabel);expect(row.timingProfileId).toBe(choice.timing.timingProfileId);
        expect(getExactTestChoiceOrderRecord({frozenCase:cs} as EncounterState,{...n,answerChoices:n.answerChoices.map(a=>a.id===choice.choiceId?{...a,label:a.label+' changed'}:a)},choice.choiceId)).toBeNull();
        if(row.disposition.kind==='result_gate_route_override'){expect(row.disposition.serviceId).toBe(n.resultGateAfter!.resultTypeId);expect(row.disposition.allowedRouteIds).toEqual(n.resultGateAfter!.allowedServiceRouteIds);}
      }
    }expect(count).toBe(12);
  });
  it('resolves retained round-two frozen variants through their original records',()=>{
    for(const r of revisions){const cs=oldStage.cases.find(c=>c.id===r.caseId)!,n=cs.decisionNodes.find(n=>n.id===r.nodeId)!;
      for(const row of entry.orders.filter(row=>row.caseId===cs.id&&row.nodeId===n.id&&row.questionVariantId===n.questionVariantId))expect(getExactTestChoiceOrderRecord({frozenCase:cs} as EncounterState,n,row.choiceId)).toEqual(row);
    }
  });
  it('keeps prior concept histories separate from the five new scored objectives',()=>{
    const state=createInitialGameState();expect(concepts).toHaveLength(5);
    for(const concept of concepts){expect(state.learningHistories[concept.id]?.reviews).toHaveLength(0);const r=revisions.find(r=>r.clinicalBinding.nextConceptId===concept.id)!;expect(state.learningHistories[r.clinicalBinding.previousConceptId]?.reviews).toHaveLength(0);expect(concept.id).not.toBe(r.clinicalBinding.previousConceptId);}
  });
});
