import { describe, expect, it } from "vitest";
import { syntheticClinicalCaseSchema, testedConceptSchema } from "../../schema";
import * as gist from "./gastric-gist";
import * as adenoma from "./hepatic-adenoma";
import * as cmi from "./chronic-mesenteric-ischemia";
import * as pa from "./primary-aldosteronism";
import {
  BOARD_EXPANSION_20260912_AUTHORING_CONCEPTS,
  BOARD_EXPANSION_20260912_BATCH_MANIFEST,
  BOARD_EXPANSION_20260912_CASES,
  BOARD_EXPANSION_20260912_CASE_REVIEWS,
  BOARD_EXPANSION_20260912_CLAIMS,
  BOARD_EXPANSION_20260912_QUESTIONS,
  BOARD_EXPANSION_20260912_SERVICE_CONTRACTS,
  BOARD_EXPANSION_20260912_SOURCES,
  BOARD_EXPANSION_20260912_TESTED_CONCEPTS,
  BOARD_EXPANSION_20260912_TIMING_ENTRIES,
} from "./board-expansion-batch";

const families = [
  [gist.GASTRIC_GIST_CONCEPTS, gist.GASTRIC_GIST_TESTED_CONCEPTS, gist.GASTRIC_GIST_QUESTIONS, gist.GASTRIC_GIST_CASES, gist.GASTRIC_GIST_CLAIMS, gist.GASTRIC_GIST_SOURCES, gist.GASTRIC_GIST_CASE_REVIEWS, gist.GASTRIC_GIST_TIMING_ENTRIES],
  [adenoma.HEPATIC_ADENOMA_CONCEPTS, adenoma.HEPATIC_ADENOMA_TESTED_CONCEPTS, adenoma.HEPATIC_ADENOMA_QUESTIONS, adenoma.HEPATIC_ADENOMA_CASES, adenoma.HEPATIC_ADENOMA_CLAIMS, adenoma.HEPATIC_ADENOMA_SOURCES, adenoma.HEPATIC_ADENOMA_CASE_REVIEWS, adenoma.HEPATIC_ADENOMA_TIMING_ENTRIES],
  [cmi.CHRONIC_MESENTERIC_ISCHEMIA_CONCEPTS, cmi.CHRONIC_MESENTERIC_ISCHEMIA_TESTED_CONCEPTS, cmi.CHRONIC_MESENTERIC_ISCHEMIA_QUESTIONS, cmi.CHRONIC_MESENTERIC_ISCHEMIA_CASES, cmi.CHRONIC_MESENTERIC_ISCHEMIA_CLAIMS, cmi.CHRONIC_MESENTERIC_ISCHEMIA_SOURCES, cmi.CHRONIC_MESENTERIC_ISCHEMIA_CASE_REVIEWS, cmi.CHRONIC_MESENTERIC_ISCHEMIA_TIMING_ENTRIES],
  [pa.PRIMARY_ALDOSTERONISM_CONCEPTS, pa.PRIMARY_ALDOSTERONISM_TESTED_CONCEPTS, pa.PRIMARY_ALDOSTERONISM_QUESTIONS, pa.PRIMARY_ALDOSTERONISM_CASES, pa.PRIMARY_ALDOSTERONISM_CLAIMS, pa.PRIMARY_ALDOSTERONISM_SOURCES, pa.PRIMARY_ALDOSTERONISM_CASE_REVIEWS, pa.PRIMARY_ALDOSTERONISM_TIMING_ENTRIES],
] as const;
const concepts=families.flatMap((family)=>[...family[0]]);
const tested=families.flatMap((family)=>[...family[1]]);
const questions=families.flatMap((family)=>[...family[2]]);
const cases=families.flatMap((family)=>[...family[3]]);
const claims=families.flatMap((family)=>[...family[4]]);
const sources=families.flatMap((family)=>[...family[5]]);
const reviews=families.flatMap((family)=>[...family[6]]);
const timing=families.flatMap((family)=>[...family[7]]);

describe("2026-09-12 complex-family authoring",()=>{
  it("contains eight concepts, thirty-two variants, sixteen cases, and sixteen real gates",()=>{
    expect(concepts).toHaveLength(8);expect(tested).toHaveLength(8);expect(questions).toHaveLength(32);expect(cases).toHaveLength(16);expect(reviews).toHaveLength(16);expect(timing).toHaveLength(32);
    expect(cases.flatMap((item)=>item.decisionNodes).filter((node)=>node.resultGateAfter)).toHaveLength(16);
    expect(new Set(concepts.map((item)=>item.id)).size).toBe(8);
    for(const item of concepts)expect(questions.filter((question)=>question.conceptId===item.id)).toHaveLength(4);
  });

  it("keeps schemas, generated identity, gates, keys, and review flags intact",()=>{
    for(const item of [...concepts,...questions,...claims,...sources,...reviews]){expect(item.reviewStatus).toBe("needs_clinician_review");expect(item.lastClinicianReview).toBeNull();expect(item.aiAssistedDrafting).toBe(true);}
    for(const item of tested)expect(testedConceptSchema.parse(item)).toEqual(item);
    for(const clinicalCase of cases){
      expect(syntheticClinicalCaseSchema.parse(clinicalCase)).toEqual(clinicalCase);expect(clinicalCase.patientDisplayName).toBe("{patientName}");expect(clinicalCase.chiefComplaint).toMatch(/^(I|My)\b/);expect(clinicalCase.presentation).toContain("{patientName}");expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(4);
      const [first,second]=clinicalCase.decisionNodes;expect(first?.resultGateAfter).not.toBeNull();expect(second?.resultGateAfter).toBeNull();expect(second?.currentUpdate).toBe(first?.resultGateAfter?.resultNarrative);expect(first?.answerChoices.find((choice)=>choice.isCorrect)?.serviceRequest?.serviceId).toBe(first?.resultGateAfter?.resultTypeId);
      for(const node of clinicalCase.decisionNodes)expect(node.answerChoices.filter((choice)=>choice.isCorrect)).toHaveLength(1);
    }
  });

  it("maps every timing entry to exact authored choices and classifies named tests",()=>{
    const testWords=/\b(MRI|CT|CTA|angiograph|ultrasound|biopsy|aspiration|cytology|PET|metanephrine|renin|aldosterone|dexamethasone|sampling|surveillance|laparoscopy|functional test)\b/i;
    for(const entry of timing){
      const node=cases.find((item)=>item.id===entry.caseId)?.decisionNodes.find((item)=>item.id===entry.nodeId);expect(node?.questionVariantId).toBe(entry.questionVariantId);
      if(entry.classification.kind==="no_test"){expect(node?.answerChoices.some((choice)=>testWords.test(choice.label))).toBe(false);continue;}
      expect(entry.classification.choices).toHaveLength(4);
      for(const choice of entry.classification.choices){expect(node?.answerChoices.some((answer)=>answer.id===choice.choiceId&&answer.label===choice.choiceLabel)).toBe(true);if(testWords.test(choice.choiceLabel))expect(choice.timing.kind).toBe("test");}
    }
  });

  it("does not make the keyed label uniquely longest",()=>{
    for(const node of cases.flatMap((clinicalCase)=>clinicalCase.decisionNodes)){
      const key=node.answerChoices.find((choice)=>choice.isCorrect)!;const distractors=node.answerChoices.filter((choice)=>!choice.isCorrect);
      expect(key.label.length,`${node.id}: ${key.label}`).toBeLessThanOrEqual(Math.max(...distractors.map((choice)=>choice.label.length)));
      expect(key.label.split(/\s+/).length,`${node.id}: ${key.label}`).toBeLessThanOrEqual(Math.max(...distractors.map((choice)=>choice.label.split(/\s+/).length)));
    }
  });

  it("keeps source-to-claim links bidirectional and limitations explicit",()=>{
    const claimsById=new Map(claims.map((item)=>[item.id,item]));const sourcesById=new Map(sources.map((item)=>[item.id,item]));
    for(const item of claims){expect(item.limitation?.length ?? 0).toBeGreaterThan(20);for(const id of item.sourceIds)expect(sourcesById.get(id)?.evidenceClaimIds).toContain(item.id);}
    for(const item of sources)for(const id of item.evidenceClaimIds)expect(claimsById.get(id)?.sourceIds).toContain(item.id);
  });

  it("preserves the accepted clinical boundaries without future-result leakage",()=>{
    expect(JSON.stringify(gist.GASTRIC_GIST_CASES)).toContain("tissue and mutation status are not yet known");expect(gist.GASTRIC_GIST_CASES.every((item)=>!item.presentation.includes("imatinib-sensitive"))).toBe(true);
    expect(adenoma.HEPATIC_ADENOMA_CASES.every((item)=>item.prototypeDemographics.sexLabel==="Male"&&item.approvedInstantiationProfiles.every((profile)=>profile.prototypeDemographics.sexLabel==="Male"))).toBe(true);
    expect(cmi.CHRONIC_MESENTERIC_ISCHEMIA_CASES.every((item)=>item.presentation.includes("no sudden severe pain"))).toBe(true);
    expect(pa.PRIMARY_ALDOSTERONISM_CASES.every((item)=>item.presentation.includes("morning seated sampling")&&!item.presentation.includes("24 ng/dL")&&item.prototypeVitalSigns.systolicBloodPressureMmHg>=160)).toBe(true);
    expect(pa.PRIMARY_ALDOSTERONISM_CLAIMS.some((item)=>item.id==="claim.primary-aldosteronism.overt-phenotype-no-suppression")).toBe(true);
  });

  it("aggregates the complete twenty-concept September 12 authoring batch",()=>{
    expect(BOARD_EXPANSION_20260912_AUTHORING_CONCEPTS).toHaveLength(20);expect(BOARD_EXPANSION_20260912_TESTED_CONCEPTS).toHaveLength(20);expect(BOARD_EXPANSION_20260912_QUESTIONS).toHaveLength(80);expect(BOARD_EXPANSION_20260912_CASES).toHaveLength(40);expect(BOARD_EXPANSION_20260912_CASE_REVIEWS).toHaveLength(40);expect(BOARD_EXPANSION_20260912_TIMING_ENTRIES).toHaveLength(80);
    expect(BOARD_EXPANSION_20260912_CASES.flatMap((item)=>item.decisionNodes).filter((node)=>node.resultGateAfter)).toHaveLength(40);expect(new Set(BOARD_EXPANSION_20260912_SERVICE_CONTRACTS.map((item)=>item.serviceId)).size).toBe(10);expect(BOARD_EXPANSION_20260912_CLAIMS).toHaveLength(21);expect(BOARD_EXPANSION_20260912_SOURCES.length).toBeGreaterThanOrEqual(17);
    expect(BOARD_EXPANSION_20260912_BATCH_MANIFEST).toMatchObject({authoringConceptCount:20,testedConceptCount:20,questionVariantCount:80,caseCount:40,multistepCaseCount:40,resultGateCount:40,caseReviewCount:40,timingEntryCount:80,publicReleaseAuthorized:false});
  });
});
