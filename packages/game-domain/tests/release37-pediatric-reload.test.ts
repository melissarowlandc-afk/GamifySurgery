import {describe,it,expect} from "vitest";
import {QUESTION_PROGRAM_BATCH9_ACCEPTED_CASES} from "@gamify-surgery/clinical-content";
import {deserializeGameState,serializeGameState,startServiceOperation,getClinicalCaseEligibilityIssue} from "../src";
import {answerConsult} from "./founder-consults.fixture";
import {engProcedureClinic,buyPediatricRoom,lineFor,advanceEngProcedure,openEngConsult,engCommand,engTick} from "./eng-i01-live-procedure.fixture";

describe("release37 pediatric saves before and after the real examination-room purchase",()=>{
  it("reloads both gate states, then retains and completes the exact child/parent procedure",()=>{
    const c=QUESTION_PROGRAM_BATCH9_ACCEPTED_CASES.find(cs=>cs.pediatricProfile&&cs.procedureContext?.mode==="live")!;
    if(c.procedureContext?.mode!=="live")throw new Error("Expected the frozen accepted pediatric procedure");
    const kind=c.procedureContext.kind;
    let {state,context,id:oldSource}=engProcedureClinic(kind,c,false);
    const histories=structuredClone(state.learningHistories);
    expect(state.serviceOperations.find(op=>op.id===oldSource)!.procedureContext).toBeUndefined();
    state=deserializeGameState(serializeGameState(state),context);
    expect(state.learningHistories).toEqual(histories);
    expect(getClinicalCaseEligibilityIssue(state,c,context)).not.toBeNull();
    state=buyPediatricRoom(state,context);
    state=deserializeGameState(serializeGameState(state),context);
    expect(state.learningHistories).toEqual(histories);
    expect(getClinicalCaseEligibilityIssue(state,c,context)).toBeNull();
    // The pre-purchase adult source still owns the single installed service
    // slot. Finish its ordinary route before scheduling the newly enabled child.
    for(let tick=0;tick<700&&!state.serviceIncomeReceipts.some(receipt=>receipt.transactionKey.includes(oldSource));tick++)state=engTick(state,context);
    expect(state.serviceIncomeReceipts.some(receipt=>receipt.transactionKey.includes(oldSource))).toBe(true);
    const id=startServiceOperation(state,lineFor(kind),"visitor",context);
    expect(id).toBeTruthy();
    expect(state.serviceOperations.find(op=>op.id===id)!.procedureContext?.pediatricFamilyContext).toEqual(c.procedureContext.pediatricFamilyContext);
    state=advanceEngProcedure(state,context,id!);
    const opened=openEngConsult(state,context,id!);state=opened.state;
    const frozen=structuredClone(state.encounters[opened.encounterId]!.frozenCase);
    const family=state.encounters[opened.encounterId]!.pediatricFamilyId!;
    state=deserializeGameState(serializeGameState(state),context);
    expect(state.encounters[opened.encounterId]!.frozenCase).toEqual(frozen);
    expect(state.pediatricFamilies![family]!.procedureFlow).toBeDefined();
    expect(state.learningHistories).toEqual(histories);
    state=answerConsult(state,opened.encounterId,context);
    state=engCommand(state,{type:"CLOSE_CHART",encounterId:opened.encounterId},context);
    state=engTick(state,context,350);
    expect(state.serviceIncomeReceipts.filter(receipt=>receipt.transactionKey.includes(id!))).toHaveLength(1);
    state=deserializeGameState(serializeGameState(state),context);
    for(const conceptId of new Set(frozen.decisionNodes.map(node=>node.primaryConceptId))){
      const answered=frozen.decisionNodes.filter(node=>node.primaryConceptId===conceptId).length;
      expect(state.learningHistories[conceptId]!.reviews).toHaveLength(histories[conceptId]!.reviews.length+answered);
    }
  });
});
