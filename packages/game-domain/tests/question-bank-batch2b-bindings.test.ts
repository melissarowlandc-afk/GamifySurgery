import { describe, expect, it } from "vitest";
import { QUESTION_BANK_PRE_BATCH2B_RELEASE as before, QUESTION_NEW_N2_ROUND2_PRE_RELEASE as after, QUESTION_BANK_BATCH2B_REVISIONS as revisions, QUESTION_BANK_BATCH2B_TIMING_ENTRIES as timings } from "@gamify-surgery/clinical-content";
import { QUESTION_BANK_BATCH2B_TEST_ORDER_RECORDS as records } from "../src/question-bank-batch2b-test-orders";
import { getExactTestChoiceOrderRecord } from "../src/test-choice-orders";
import type { EncounterState } from "../src/types";

describe("batch 2b exact new and frozen test bindings", () => {
  it("binds sixty named timed plans to existing execution or explicit nonexecution", () => {
    expect(records).toHaveLength(60);
    expect(records.filter(r=>r.disposition.kind==="result_gate_route_override")).toHaveLength(2);
    expect(records.filter(r=>r.disposition.kind==="terminal_service")).toHaveLength(1);
    expect(records.filter(r=>r.disposition.kind==="existing_terminal_procedure")).toHaveLength(4);
    expect(records.filter(r=>r.disposition.kind==="not_executed")).toHaveLength(53);
    let tested=0;
    for (const r of revisions) {
      const cs=after.cases.find(c=>c.id===r.caseId)!, n=cs.decisionNodes.find(n=>n.id===r.nodeId)!;
      const t=timings.find(t=>t.questionVariantId===n.questionVariantId)!;
      if (t.classification.kind!=="test_choices") continue;
      for (const c of t.classification.choices) {
        if(c.timing.kind!=="test") continue; tested++;
        const record=getExactTestChoiceOrderRecord({frozenCase:cs} as EncounterState,n,c.choiceId)!;
        expect(record).toBeTruthy(); expect(record.choiceLabel).toBe(c.choiceLabel);expect(record.timingProfileId).toBe(c.timing.timingProfileId);
        const changed={...n,answerChoices:n.answerChoices.map(a=>a.id===c.choiceId?{...a,label:a.label+" changed"}:a)};
        expect(getExactTestChoiceOrderRecord({frozenCase:cs} as EncounterState,changed,c.choiceId)).toBeNull();
      }
    }
    expect(tested).toBe(60);
  });
  it("retains frozen old test identities for all replaced nodes", () => {
    for (const r of revisions) {
      const cs=before.cases.find(c=>c.id===r.caseId)!, n=cs.decisionNodes.find(n=>n.id===r.nodeId)!;
      for (const c of n.answerChoices) {
        const record=getExactTestChoiceOrderRecord({frozenCase:cs} as EncounterState,n,c.id);
        if(record) expect(record.questionVariantId).toBe(r.previousQuestionVariantId);
      }
    }
  });
  it("preserves existing service/gate identities rather than adding a procedure executor", () => {
    for (const r of revisions) {
      expect(r.clinicalBinding.nextKeyServiceId).toBe(r.clinicalBinding.previousKeyServiceId);
      const old=r.clinicalBinding.previousResultGate,next=r.clinicalBinding.nextResultGate;
      expect(next?.resultTypeId??null).toBe(old?.resultTypeId??null);
      expect(next?.allowedServiceRouteIds??null).toEqual(old?.allowedServiceRouteIds??null);
    }
  });
});
