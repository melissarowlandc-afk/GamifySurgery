import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {ANSWER_CHOICE_TIMING_REGISTRY,QUESTION_BANK_BATCH2A_ROUND2_REVISIONS as revisions,QUESTION_BANK_BATCH2A_ROUND2_RELEASE as live,QUESTION_BANK_PRE_BATCH2A_ROUND2_RELEASE as before} from "@gamify-surgery/clinical-content";
import {EXACT_TEST_CHOICE_ORDER_RECORDS,getExactTestChoiceOrderRecord} from "../src/test-choice-orders";
import {createInitialGameState,getEligibleServiceRoute} from "../src";
import type {EncounterState} from "../src/types";
const baseline=JSON.parse(readFileSync(new URL("../../../tools/question-quality/fixtures/question-bank-batch2a-round2-before-20261104.json",import.meta.url),"utf8")) as {orders:typeof EXACT_TEST_CHOICE_ORDER_RECORDS};
describe("batch 2a round two exact fresh and frozen orders",()=>{
 it("retains prior tuples outside the separately edited N2 lane and adds seventeen exact records",()=>{
  expect(baseline.orders).toHaveLength(440);
  const legacy=(rows:typeof EXACT_TEST_CHOICE_ORDER_RECORDS)=>rows.filter(r=>!r.questionVariantId.startsWith("question.n2."));
  expect(legacy(EXACT_TEST_CHOICE_ORDER_RECORDS.slice(0,440))).toEqual(legacy(baseline.orders));
  const rows=EXACT_TEST_CHOICE_ORDER_RECORDS.filter(r=>revisions.some(q=>q.questionVariantId===r.questionVariantId));
  expect(rows).toHaveLength(17);expect(rows.filter(r=>r.disposition.kind==="result_gate_route_override")).toHaveLength(4);
 });
 it("matches every new testing label, timing and gate while rejecting label drift",()=>{
  let count=0,gates=0;
  for(const r of revisions){const cs=live.cases.find(c=>c.id===r.caseId)!,n=cs.decisionNodes.find(n=>n.id===r.nodeId)!,t=ANSWER_CHOICE_TIMING_REGISTRY.find(t=>t.questionVariantId===n.questionVariantId)!;
   if(t.classification.kind!=="test_choices")continue;
   for(const choice of t.classification.choices){if(choice.timing.kind!=="test")continue;count++;
    const row=getExactTestChoiceOrderRecord({frozenCase:cs} as EncounterState,n,choice.choiceId)!;
    expect(row).toBeTruthy();expect(row.choiceLabel).toBe(choice.choiceLabel);expect(row.timingProfileId).toBe(choice.timing.timingProfileId);
    if(row.disposition.kind==="result_gate_route_override"){gates++;expect(row.disposition.serviceId).toBe(n.resultGateAfter!.resultTypeId);expect(row.disposition.allowedRouteIds).toEqual(n.resultGateAfter!.allowedServiceRouteIds);}
    else expect(row.disposition.kind).toBe("not_executed");
    const altered={...n,answerChoices:n.answerChoices.map(c=>c.id===choice.choiceId?{...c,label:c.label+" altered"}:c)};
    expect(getExactTestChoiceOrderRecord({frozenCase:cs} as EncounterState,altered,choice.choiceId)).toBeNull();
   }
  }expect(count).toBe(17);expect(gates).toBe(4);
 });
 it("resolves each old round-one timed choice from its original frozen definition",()=>{
  for(const r of revisions){const cs=before.cases.find(c=>c.id===r.caseId)!,n=cs.decisionNodes.find(n=>n.id===r.nodeId)!;
   for(const row of baseline.orders.filter(x=>x.caseId===cs.id&&x.nodeId===n.id&&x.questionVariantId===n.questionVariantId))expect(getExactTestChoiceOrderRecord({frozenCase:cs} as EncounterState,n,row.choiceId)).toEqual(row);
  }
 });
 it("uses the existing outsourced contrast route without changing the old manometry gate",()=>{
  const r=revisions.find(r=>r.auditId==="B2A04")!,old=before.cases.find(c=>c.id===r.caseId)!.decisionNodes.find(n=>n.id===r.nodeId)!,n=live.cases.find(c=>c.id===r.caseId)!.decisionNodes.find(n=>n.id===r.nodeId)!;
  expect(old.resultGateAfter!.resultTypeId).toBe("service.esophageal_manometry");expect(n.resultGateAfter!.resultTypeId).toBe("service.contrast_swallow");
  const state=createInitialGameState();state.facilityLevel=1;
  expect(getEligibleServiceRoute(state,n.resultGateAfter!.resultTypeId)?.route.id).toBe("route.contrast_swallow.outsourced");
 });
});
