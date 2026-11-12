import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {ANSWER_CHOICE_TIMING_REGISTRY,QUESTION_FLAG_ROUND3_REVISIONS as revisions,QUESTION_NEW_N1_PRE_RELEASE as live,QUESTION_FLAGS_PRE_ROUND3_RELEASE as before} from "@gamify-surgery/clinical-content";
import {EXACT_TEST_CHOICE_ORDER_RECORDS,getExactTestChoiceOrderRecord} from "../src/test-choice-orders";
import type {EncounterState} from "../src/types";
const baseline=JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/question-flags-round3-before-20261104.json",import.meta.url),"utf8")) as {orders:typeof EXACT_TEST_CHOICE_ORDER_RECORDS};
describe("question flags final round: exact fresh and frozen orders",()=>{
 it("retains all 371 entry tuples and adds exactly eighteen nonexecuted study previews",()=>{
  expect(baseline.orders).toHaveLength(371);expect(EXACT_TEST_CHOICE_ORDER_RECORDS.slice(0,371)).toEqual(baseline.orders);
  const rows=EXACT_TEST_CHOICE_ORDER_RECORDS.filter(r=>revisions.some(q=>q.questionVariantId===r.questionVariantId));
  expect(rows).toHaveLength(18);expect(rows.every(r=>r.disposition.kind==="not_executed")).toBe(true);
 });
 it("resolves each new test by the complete identity and rejects label drift",()=>{
  let total=0;
  for(const r of revisions){const cs=live.cases.find(c=>c.id===r.caseId)!,n=cs.decisionNodes.find(n=>n.id===r.nodeId)!;
   const timing=ANSWER_CHOICE_TIMING_REGISTRY.find(t=>t.questionVariantId===n.questionVariantId)!;
   if(timing.classification.kind!=="test_choices")continue;
   for(const t of timing.classification.choices){if(t.timing.kind!=="test")continue;total++;
    const row=getExactTestChoiceOrderRecord({frozenCase:cs} as EncounterState,n,t.choiceId)!;
    expect(row).toBeTruthy();expect(row.choiceLabel).toBe(t.choiceLabel);expect(row.timingProfileId).toBe(t.timing.timingProfileId);expect(row.disposition.kind).toBe("not_executed");
    expect(getExactTestChoiceOrderRecord({frozenCase:cs} as EncounterState,{...n,answerChoices:n.answerChoices.map(c=>c.id===t.choiceId?{...c,label:c.label+" changed"}:c)},t.choiceId)).toBeNull();
   }
  }expect(total).toBe(18);
 });
 it("still resolves every entry timed test from its original frozen case",()=>{
  for(const r of revisions){const cs=before.cases.find(c=>c.id===r.caseId)!,n=cs.decisionNodes.find(n=>n.id===r.nodeId)!;
   for(const row of baseline.orders.filter(x=>x.caseId===cs.id&&x.nodeId===n.id&&x.questionVariantId===n.questionVariantId))
    expect(getExactTestChoiceOrderRecord({frozenCase:cs} as EncounterState,n,row.choiceId)).toEqual(row);
  }
 });
});
