import { describe,expect,it } from "vitest";
import { QUESTION_NEW_N2_ROUND2_PRE_RELEASE as before, QUESTION_BANK_BATCH2B_ROUND2_SOURCE_RELEASE as after, QUESTION_BANK_BATCH2B_ROUND2_REVISIONS as revisions, QUESTION_BANK_BATCH2B_ROUND2_TIMING_ENTRIES as timings } from "@gamify-surgery/clinical-content";
import { QUESTION_BANK_BATCH2B_ROUND2_TEST_ORDER_RECORDS as records } from "../src/question-bank-batch2b-round2-test-orders";
import { getExactTestChoiceOrderRecord } from "../src/test-choice-orders";
import type { EncounterState } from "../src/types";

describe("batch 2b round-two review-candidate exact orders",()=>{
  it("binds fifty-two timed choices to unchanged gates or nonexecuted planning",()=>{
    expect(records).toHaveLength(52);
    expect(records.filter(r=>r.disposition.kind==="result_gate_route_override")).toHaveLength(2);
    expect(records.filter(r=>r.disposition.kind==="not_executed")).toHaveLength(50);
    let checked=0;
    for(const r of revisions){const cs=after.cases.find(c=>c.id===r.caseId)!,n=cs.decisionNodes.find(n=>n.id===r.nodeId)!,t=timings.find(t=>t.questionVariantId===n.questionVariantId)!;
      if(t.classification.kind!=="test_choices")continue;
      for(const c of t.classification.choices){if(c.timing.kind!=="test")continue;checked++;
        const row=getExactTestChoiceOrderRecord({frozenCase:cs} as EncounterState,n,c.choiceId)!;
        expect(row?.choiceLabel).toBe(c.choiceLabel);expect(row?.timingProfileId).toBe(c.timing.timingProfileId);
        const drift={...n,answerChoices:n.answerChoices.map(a=>a.id===c.choiceId?{...a,label:a.label+" changed"}:a)};
        expect(getExactTestChoiceOrderRecord({frozenCase:cs} as EncounterState,drift,c.choiceId)).toBeNull();
      }
    }expect(checked).toBe(52);
  });
  it("retains every frozen previous-version timed identity",()=>{
    for(const r of revisions){const cs=before.cases.find(c=>c.id===r.caseId)!,n=cs.decisionNodes.find(n=>n.id===r.nodeId)!;
      for(const c of n.answerChoices){const row=getExactTestChoiceOrderRecord({frozenCase:cs} as EncounterState,n,c.id);if(row)expect(row.questionVariantId).toBe(r.previousQuestionVariantId);}
      expect(r.clinicalBinding.nextResultGate).toEqual(r.clinicalBinding.previousResultGate);
    }
  });
  it("does not execute the retrieval key as a new ultrasound order",()=>{
    const r=revisions.find(r=>r.auditId==="B2B19")!,cs=after.cases.find(c=>c.id===r.caseId)!,n=cs.decisionNodes.find(n=>n.id===r.nodeId)!,c=n.answerChoices.find(c=>c.isCorrect)!;
    expect(c.serviceRequest).toBeNull();expect(getExactTestChoiceOrderRecord({frozenCase:cs} as EncounterState,n,c.id)).toBeNull();
    expect(r.choiceTimingOverrides![c.id]).toEqual({kind:"no_test"});
  });
});
