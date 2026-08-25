import { describe, expect, it } from "vitest";
import { validateSyntheticClinicalRelease } from "../schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import { ROW_115_CASES, ROW_115_CONCEPT, ROW_115_EVIDENCE_CLAIMS, ROW_115_QUESTION_VARIANTS, ROW_115_SOURCES } from "./obstructive-jaundice-vitamin-k";
describe("owner row 115 obstructive jaundice vitamin K package",()=>{
 it("records one concept and four exact active variants",()=>{expect(ROW_115_CONCEPT.id).toBe("concept.obstructive-jaundice.vitamin-k-coagulopathy");expect(ROW_115_CASES).toHaveLength(4);expect(ROW_115_QUESTION_VARIANTS).toHaveLength(4);});
 it("keeps the approved vitamin-only labels and lab boundary",()=>{expect(ROW_115_QUESTION_VARIANTS[0]?.answerChoices.map(c=>c.label)).toEqual(["Vitamin K","Vitamin D","Vitamin A"]);expect(ROW_115_QUESTION_VARIANTS[2]?.stem).not.toMatch(/fat-soluble|absorption/i);});
 it("uses one shuffled three-choice ungated decision per case",()=>{for(const c of ROW_115_CASES){const n=c.decisionNodes[0]!;expect(n.answerChoices).toHaveLength(3);expect(n.answerChoices.filter(a=>a.isCorrect)).toHaveLength(1);expect(n.shuffleAnswers).toBe(true);expect(n.resultGateAfter).toBeNull();expect(n.terminalDispositions).toHaveLength(2);}});
 it("links reviewed claims to source metadata still awaiting review",()=>{expect(ROW_115_SOURCES).toHaveLength(2);expect(ROW_115_SOURCES.every(s=>s.reviewStatus==="needs_clinician_review")).toBe(true);expect(ROW_115_EVIDENCE_CLAIMS.every(c=>c.reviewStatus==="clinically_approved")).toBe(true);});
 it("admits every approved case once",()=>{expect(()=>validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE)).not.toThrow();for(const c of ROW_115_CASES)expect(SYNTHETIC_CLINICAL_RELEASE.cases.filter(x=>x.id===c.id)).toHaveLength(1);});
});
