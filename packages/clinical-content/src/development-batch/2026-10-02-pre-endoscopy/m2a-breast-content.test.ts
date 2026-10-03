import { describe,expect,it } from "vitest";
import { DCIS } from "./dcis";
import { PALPABLE_BREAST } from "./palpable-breast";
const families=[DCIS,PALPABLE_BREAST];
const concepts=families.flatMap(x=>x.authoringConcepts),questions=families.flatMap(x=>x.questions),cases=families.flatMap(x=>x.cases),timing=families.flatMap(x=>x.timingEntries);
describe("GS-028 October 2 M2a breast content",()=>{
 it("has four objectives and sixteen explicit variants",()=>{expect(concepts).toHaveLength(4);expect(questions).toHaveLength(16);for(const c of concepts){const q=questions.filter(x=>x.conceptId===c.id);expect(q).toHaveLength(4);expect(new Set(q.map(x=>x.patientPresentation))).toHaveLength(4);expect(new Set(q.map(x=>x.stem))).toHaveLength(4);for(const item of q){expect(item.answerChoices.filter(x=>x.isCorrect)).toHaveLength(1);expect(item.answerChoices.filter(x=>!x.isCorrect).every(x=>(x.distractorRationale?.length??0)>35)).toBe(true);}}});
 it("keeps every objective independently accessible",()=>{for(const c of concepts)expect(cases.some(x=>x.decisionNodes.length===1&&x.decisionNodes[0]?.primaryConceptId===c.id)).toBe(true);});
 it("uses two real ultrasound-to-biopsy continuations",()=>{const paired=cases.filter(x=>x.decisionNodes.length===2);expect(paired).toHaveLength(2);for(const c of paired){expect(c.decisionNodes[0]?.resultGateAfter?.resultTypeId).toBe("service.ultrasound");expect(c.decisionNodes[1]?.primaryConceptId).toBe("concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging");expect(c.decisionNodes[1]?.currentUpdate).toMatch(/ultrasound.*negative/i);}});
 it("times every imaging or sampling answer",()=>{for(const c of cases)for(const n of c.decisionNodes){const e=timing.find(x=>x.questionVariantId===n.questionVariantId)!;if(n.primaryConceptId.startsWith("concept.palpable-breast")){expect(e.classification.kind).toBe("test_choices");if(e.classification.kind==="test_choices")for(const choice of e.classification.choices)expect(choice.timing.kind).toBe("test");}}});
 it("keeps female profiles and draft status",()=>{for(const q of questions){expect(q.reviewStatus).toBe("needs_clinician_review");for(const p of q.approvedInstantiationProfiles)expect(p.prototypeDemographics?.sexLabel).toBe("Female");}});
 it("does not reveal the key as the uniquely longest option",()=>{for(const q of questions){const key=q.answerChoices.find(x=>x.isCorrect)!;expect(key.label.length,q.id).toBeLessThanOrEqual(Math.max(...q.answerChoices.filter(x=>!x.isCorrect).map(x=>x.label.length)));}});
});
