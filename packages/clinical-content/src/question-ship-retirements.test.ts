import {describe,expect,it,vi} from "vitest";
import type {QuestionShipManifest} from "./question-ship-manifest";
import {SYNTHETIC_CLINICAL_RELEASE} from "./synthetic-content";
import {resolveQuestionShipRetirements} from "./question-ship-retirements";
import {projectManagerAcceptedQuestions} from "./question-ship-projection";

const original=SYNTHETIC_CLINICAL_RELEASE.cases[0]!;
const successor={...original,id:"case.retirement.accepted",decisionNodes:original.decisionNodes.map((n,i)=>({...n,id:"node.retirement."+i,questionVariantId:"question.retirement."+i}))};
const accepted=successor.decisionNodes.map(n=>({acceptanceId:n.questionVariantId,caseId:successor.id,nodeId:n.id,questionVariantId:n.questionVariantId,conceptId:n.primaryConceptId,sourceView:"accepted",decision:"manager decision"}));
const retirement={caseId:original.id,questionVariantIds:original.decisionNodes.map(n=>n.questionVariantId),decision:"manager decision",reason:"Retire this exact question set",replacementQuestionVariantId:successor.decisionNodes[0]!.questionVariantId};
const manifest:QuestionShipManifest={legacyBindings:original.decisionNodes.map(n=>[original.id,n.id,n.questionVariantId,n.primaryConceptId] as const),accepted,headerSources:{[successor.id]:"accepted"},retirements:[retirement]};
describe("explicit projection-only whole-case retirement",()=>{
  it("withholds the exact retired fresh case, admits its complete accepted successor and preserves all concepts and source objects",()=>{
    const legacy={...SYNTHETIC_CLINICAL_RELEASE,cases:[original]};const source={...legacy,cases:[successor]};
    const projected=projectManagerAcceptedQuestions(source,legacy,{legacy,accepted:source},manifest);
    expect(projected.cases).toEqual([successor]);expect(projected.concepts).toEqual(legacy.concepts);
    expect(legacy.cases).toEqual([original]);expect(original.decisionNodes.map(n=>n.questionVariantId)).toEqual(retirement.questionVariantIds);
  });
  it("supports an explicit owner retirement without silently assigning a successor",()=>{
    const {replacementQuestionVariantId:_r,...owner}=retirement;
    const result=resolveQuestionShipRetirements([original],{...manifest,accepted:[],retirements:[owner]});
    expect(result.issues).toEqual([]);expect([...result.retiredCaseIds]).toEqual([original.id]);
  });
  it.each(["missing successor","unaccepted sibling","changed old binding","duplicate retirement","missing decision","self replacement"])("retains the old case when %s invalidates the exact retirement",kind=>{
    const broken=structuredClone(manifest);let cases=[original,successor];
    if(kind==="missing successor")cases=[original];
    if(kind==="unaccepted sibling")cases=[original,{...successor,decisionNodes:[...successor.decisionNodes,{...successor.decisionNodes[0]!,id:"node.unaccepted",questionVariantId:"question.unaccepted"}]}];
    if(kind==="changed old binding")broken.retirements=[{...retirement,questionVariantIds:["question.changed"]}];
    if(kind==="duplicate retirement")broken.retirements=[retirement,retirement];
    if(kind==="missing decision")broken.retirements=[{...retirement,decision:""}];
    if(kind==="self replacement")broken.retirements=[{...retirement,caseId:successor.id,questionVariantIds:successor.decisionNodes.map(n=>n.questionVariantId)}];
    const result=resolveQuestionShipRetirements(cases,broken);expect(result.issues.length).toBeGreaterThan(0);expect(result.retiredCaseIds.size).toBe(0);
  });
  it("warns and preserves the projected case on an invalid retirement instead of changing legacy fallback",()=>{
    const warning=vi.spyOn(console,"warn").mockImplementation(()=>{});
    try{const legacy={...SYNTHETIC_CLINICAL_RELEASE,cases:[original]};
      const projected=projectManagerAcceptedQuestions(legacy,legacy,{legacy},{...manifest,accepted:[],headerSources:{},retirements:[retirement]});
      expect(projected.cases).toEqual([original]);expect(warning).toHaveBeenCalled();
    }finally{warning.mockRestore();}
  });
});
