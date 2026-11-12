import { describe,expect,it } from "vitest";
import { readFileSync } from "node:fs";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { QUESTION_BANK_BATCH2B_ROUND2_PRE_TIMING_ENTRIES as ANSWER_CHOICE_TIMING_REGISTRY,QUESTION_NEW_N1_ROUND3_PRE_TIMING_ENTRIES,QUESTION_BANK_BATCH2B_ROUND2_PRE_TIMING_ENTRIES } from "./answer-choice-timing";
import { QUESTION_NEW_N2_ROUND3_PRE_RELEASE as current,QUESTION_NEW_N1_ROUND3_PRE_RELEASE as before } from "./synthetic-content";
import { QUESTION_NEW_N1_ROUND2_CASES as oldCases,QUESTION_NEW_N1_ROUND2_QUESTIONS as oldQuestions,
  QUESTION_NEW_N1_ROUND2_AUTHORING_CONCEPTS as oldConcepts,QUESTION_NEW_N1_ROUND2_CASE_REVIEWS as oldReviews } from "./question-new-n1-round2-20261104";
import { QUESTION_NEW_N2_ROUND2_CASES as frozenN2 } from "./question-new-n2-round2-20261104";
import { applyQuestionNewN1Round3Revisions,QUESTION_NEW_N1_ROUND3_CASES as cases,QUESTION_NEW_N1_ROUND3_REVISED_CASES as revised,
  QUESTION_NEW_N1_ROUND3_REVISIONS as revisions,QUESTION_NEW_N1_ROUND3_FROZEN_PASS_IDS as passes,
  QUESTION_NEW_N1_ROUND3_QUESTIONS as questions,QUESTION_NEW_N1_ROUND3_AUTHORING_CONCEPTS as concepts,
  QUESTION_NEW_N1_ROUND3_CASE_REVIEWS as reviews,QUESTION_NEW_N1_ROUND3_NEW_CONCEPT_VERSIONS as newMeanings,
  QUESTION_NEW_N1_ROUND3_CLAIMS as claims,QUESTION_NEW_N1_ROUND3_SOURCES as sources,
  QUESTION_NEW_N1_ROUND3_CLAIM_PROVENANCE as provenance,QUESTION_NEW_N1_ROUND3_SOURCE_HOLDS as holds,
  QUESTION_NEW_N1_ROUND3_TIMING_ENTRIES as timing } from "./question-new-n1-round3-20261104";

describe("N1 round three exact revisions and frozen review boundary",()=>{
  it("changes exactly 31 fresh cases and preserves every other cohort",()=>{
    expect(cases).toHaveLength(40);expect(revised).toHaveLength(31);expect(passes).toHaveLength(9);expect(newMeanings).toHaveLength(17);
    expect(current.cases).toHaveLength(before.cases.length);
    expect(current.concepts).toEqual([...before.concepts,...newMeanings]);
    const changed=new Set(revised.map(c=>c.id));
    for(const old of before.cases.filter(c=>!changed.has(c.id)))expect(current.cases.find(c=>c.id===old.id)).toEqual(old);
    for(const old of frozenN2)expect(current.cases.find(c=>c.id===old.id)).toEqual(old);
    expect(()=>applyQuestionNewN1Round3Revisions(current.cases)).toThrow("prior binding changed");
  });
  it.each(passes)("freezes all fields of exact independent PASS %s",id=>{
    const i=oldReviews.findIndex(r=>r.id===id);expect(i).toBeGreaterThanOrEqual(0);
    expect(cases[i]).toEqual(oldCases[i]);expect(questions[i]).toEqual(oldQuestions[i]);
    expect(concepts[i]).toEqual(oldConcepts[i]);expect(reviews[i]).toEqual(oldReviews[i]);
    expect(current.cases.find(c=>c.id===oldCases[i]!.id)).toEqual(oldCases[i]);
  });
  it.each(revisions.map(r=>[r.slug,r] as const))("binds %s to a separate draft, shuffled choices, claims and every testing estimate",(slug,r)=>{
    const cs=revised.find(c=>c.id===`case.n1.${slug}.v1`)!,node=cs.decisionNodes[0]!,q=questions.find(q=>q.id===node.questionVariantId)!;
    expect(current.cases.find(c=>c.id===cs.id)).toEqual(cs);
    expect(q).toMatchObject({id:`question.n1.${slug}.v3`,reviewStatus:"needs_clinician_review",lastClinicianReview:null});
    expect(node.primaryConceptId).toBe(r.item.conceptId);expect(node.shuffleAnswers).toBe(true);expect(node.resultGateAfter).toBeNull();
    expect(node.answerChoices.filter(c=>c.isCorrect)).toHaveLength(1);expect(node.answerChoices.length).toBeGreaterThanOrEqual(3);expect(node.answerChoices.length).toBeLessThanOrEqual(4);
    expect(node.answerChoices.every(c=>c.serviceRequest===null)).toBe(true);
    expect(cs.approvedInstantiationProfiles).toEqual([{id:`profile.n1.${slug}.v3`,prototypeDemographics:cs.prototypeDemographics,chiefComplaint:cs.chiefComplaint,presentation:cs.presentation}]);
    const row=timing.find(t=>t.caseId===cs.id)!;expect(ANSWER_CHOICE_TIMING_REGISTRY).toContainEqual(row);
    if(row.classification.kind==="test_choices")for(const c of row.classification.choices){
      expect(node.answerChoices.find(a=>a.id===c.choiceId)?.label).toBe(c.choiceLabel);
      if(c.timing.kind==="test")expect(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map(p=>p.id)).toContain(c.timing.timingProfileId);
    }
    for(const id of q.supportingEvidenceClaimIds){const claim=claims.find(c=>c.id===id)!;expect(claim).toBeDefined();for(const id of claim.sourceIds)expect(sources.find(s=>s.id===id)?.evidenceClaimIds).toContain(claim.id);}
    // These are boundary checks on recorded manual work, not tests that assign a quality PASS.
    expect(r.optionChecks).toHaveLength(node.answerChoices.length);
    expect(r.selfCheck.interpretFindings).not.toBe(r.selfCheck.applyFindings);
    expect(r.optionChecks.every(c=>c.correctUnder.length>30)).toBe(true);
    expect(node.answerChoices[0]!.label.length).toBeLessThanOrEqual(Math.max(...node.answerChoices.slice(1).map(c=>c.label.length)));
  });
  it("retains all exact old timing rows and unrefreshed source dates, disclosing new extensions",()=>{
    const exactKey=(row:typeof ANSWER_CHOICE_TIMING_REGISTRY[number])=>JSON.stringify([row.caseId,row.nodeId,row.questionVariantId]);
    const archive=new Map(ANSWER_CHOICE_TIMING_REGISTRY.map(row=>[exactKey(row),row]));
    for(const old of QUESTION_NEW_N1_ROUND3_PRE_TIMING_ENTRIES)expect(archive.get(exactKey(old))).toEqual(old);
    expect(QUESTION_BANK_BATCH2B_ROUND2_PRE_TIMING_ENTRIES).toHaveLength(QUESTION_NEW_N1_ROUND3_PRE_TIMING_ENTRIES.length+31);
    expect(holds).toHaveLength(12);
    for(const p of provenance){const claim=claims.find(c=>c.id===p.claimId)!;
      if(p.statementUnchanged&&"inheritedLastCheckedOn" in p)expect(claim.lastCheckedOn).toBe(p.inheritedLastCheckedOn);
      if(!p.statementUnchanged&&p.claimId.startsWith("claim.n1r3."))expect(claim.lastCheckedOn).toBe("2026-11-04");
    }
    for(const s of sources){expect(s.completeCitation).toBeTruthy();expect(s.accessedOn).toBeTruthy();expect(s.authorityAssessment).toBeTruthy();expect(s.licenseLabel).toBeTruthy();}
  });
  it("includes the readable original venous-flow schematic at its declared dimensions",()=>{
    const image=cases.find(c=>c.id==="case.n1.lymphedema-new-swelling.v1")!.decisionNodes[0]!.exhibit!;
    expect(image.kind).toBe("image");if(image.kind!=="image")throw new Error("Expected venous-flow image");
    const bytes=readFileSync(new URL(`../../../apps/player/public/${image.assetPath}`,import.meta.url));
    expect(bytes.subarray(0,8).toString("hex")).toBe("89504e470d0a1a0a");
    expect(bytes.readUInt32BE(16)).toBe(image.width);expect(bytes.readUInt32BE(20)).toBe(image.height);
  });
});
