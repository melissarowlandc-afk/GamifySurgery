import {describe,expect,it} from "vitest";
import {beforeWholeCaseReplacementRelease,beforeWholeCaseReplacementManifest} from "./question-ship-case-replacements-test-support";
import {beforeN3AcceptanceRelease,beforeN3AcceptanceManifest} from "./question-new-n3-acceptance-test-support";
import {PROTOTYPE_BALANCE_RELEASE} from "@gamify-surgery/balance-config";
import {QUESTION_CATALOG_RELEASE as catalog,QUESTION_NEW_N3_ROUND2_PRE_RELEASE as before,
  QUESTION_NEW_N3_PRE_RELEASE as preN3,SYNTHETIC_CLINICAL_RELEASE as live} from "./synthetic-content";
import {QUESTION_NEW_N3_CASES as oldCases,QUESTION_NEW_N3_QUESTIONS as oldQuestions,QUESTION_NEW_N3_CASE_REVIEWS as oldReviews,
  QUESTION_NEW_N3_SELF_CHECKS as oldChecks,QUESTION_NEW_N3_TIMING_ENTRIES as oldTiming,
  QUESTION_NEW_N3_STATEMENT_MAPPINGS as oldMappings,QUESTION_NEW_N3_CLAIMS as oldClaims,QUESTION_NEW_N3_SOURCES as oldSources} from "./question-new-n3-20261105";
import {QUESTION_NEW_N3_ROUND2_CASES as cases,QUESTION_NEW_N3_ROUND2_QUESTIONS as questions,QUESTION_NEW_N3_ROUND2_REVISIONS as revisions,
  QUESTION_NEW_N3_ROUND2_SELF_CHECKS as checks,QUESTION_NEW_N3_ROUND2_CASE_REVIEWS as reviews,
  QUESTION_NEW_N3_ROUND2_REVIEW_TIMING as timing,QUESTION_NEW_N3_ROUND2_TIMING_ENTRIES as newTiming,
  QUESTION_NEW_N3_ROUND2_STATEMENT_MAPPINGS as mappings,QUESTION_NEW_N3_ROUND2_NEW_CONCEPT_VERSIONS as meanings,
  QUESTION_NEW_N3_ROUND2_CLAIMS as claims,QUESTION_NEW_N3_ROUND2_SOURCES as sources,QUESTION_NEW_N3_ROUND2_CLAIM_PROVENANCE as provenance,
  applyQuestionNewN3Round2Revisions,withAcceptedQuestionNewN3Round2Concepts} from "./question-new-n3-round2-20261105";
import {ANSWER_CHOICE_TIMING_REGISTRY} from "./answer-choice-timing";
import {QUESTION_SHIP_MANIFEST as manifest} from "./question-ship-manifest";
import {validateSyntheticClinicalRelease} from "./schema";
import {projectManagerAcceptedQuestions} from "./question-ship-projection";
import {withAcceptedQuestionNewN3Concepts} from "./question-new-n3-20261105";
import {withAcceptedQuestionBankBatch2bRound2Concepts} from "./question-bank-batch2b-round2-20261104";
import {withAcceptedQuestionFlags2Concepts} from "./question-flags2-accepted-20261105";
import {QUESTION_FLAGS2_ROUND1_SOURCE_RELEASE as flags2} from "./question-flags2-20261105";
import {QUESTION_FLAGS_PRE_REVISION_RELEASE as legacy,QUESTION_NEW_N1_PRE_RELEASE as flags,
  QUESTION_BANK_BATCH2A_ROUND3_RELEASE as batch2a,QUESTION_NEW_N2_ROUND3_PRE_RELEASE as n1,
  QUESTION_NEW_N1_ROUND3_PRE_RELEASE as n2,QUESTION_BANK_BATCH2B_ROUND2_SOURCE_RELEASE as batch2b} from "./synthetic-content";

describe("N3 round-two exact-version and catalog boundary",()=>{
  it("revises the thirty-nine returned versions and retains the sole PASS across every authored record",()=>{
    expect(revisions).toHaveLength(39);expect(cases).toHaveLength(40);expect(newTiming).toHaveLength(39);
    const index=oldReviews.findIndex(r=>r.id==="review.n3.pleural-source-versus-systemic-response.v1");
    expect(index).toBeGreaterThanOrEqual(0);
    for(const [current,previous] of [[cases,oldCases],[questions,oldQuestions],[reviews,oldReviews],[checks,oldChecks],[timing,oldTiming],[mappings,oldMappings]] as const)
      expect(current[index]).toEqual(previous[index]);
    expect(cases.filter(c=>c.decisionNodes[0]!.questionVariantId.endsWith(".v2"))).toHaveLength(39);
  });
  it("projects only fresh catalog definitions and retains every prior registered meaning",()=>{
    expect(catalog.cases).toEqual(applyQuestionNewN3Round2Revisions(before.cases));
    expect(catalog.concepts).toEqual([...before.concepts,...meanings]);
    for(const old of before.cases.filter(c=>!c.id.startsWith("case.n3.")))expect(catalog.cases.find(c=>c.id===old.id)).toEqual(old);
    expect(()=>validateSyntheticClinicalRelease(catalog)).not.toThrow();
    const reused=revisions.filter(r=>r.conceptMeaning==="existing_concept");expect(reused).toHaveLength(2);
    for(const r of reused){expect(preN3.concepts.some(c=>c.id===r.conceptId)).toBe(true);expect(meanings.some(c=>c.id===r.conceptId)).toBe(false);}
  });
  it("keeps every N3 variant out of the default, including the independently passed but unaccepted pleural item",()=>{
    const historicalManifest=beforeN3AcceptanceManifest(manifest),historicalLive=beforeN3AcceptanceRelease(live);
    expect(historicalManifest.accepted.some(r=>r.acceptanceId.startsWith("review.n3."))).toBe(false);
    expect(historicalLive.cases.some(c=>c.id.startsWith("case.n3."))).toBe(false);
    expect(historicalLive.concepts.some(c=>c.id.startsWith("concept.n3."))).toBe(false);
    expect(withAcceptedQuestionNewN3Round2Concepts(catalog,preN3.concepts,historicalManifest).concepts).toEqual(preN3.concepts);
  });
  it("keeps the entire default release equal to a pre-round-two reconstruction, including concurrent accepted rewrite helpers",()=>{
    const preRoundTwo=withAcceptedQuestionFlags2Concepts(withAcceptedQuestionBankBatch2bRound2Concepts(withAcceptedQuestionNewN3Concepts(before,preN3.concepts)));
    expect(beforeWholeCaseReplacementRelease(live)).toEqual(projectManagerAcceptedQuestions(preRoundTwo,legacy,{legacy,"flags-round3":flags,"batch2a-round3":batch2a,
      "n1-round3":n1,"n2-round2":n2,"batch2b-round2":batch2b,"flags2-round1":flags2},beforeWholeCaseReplacementManifest(manifest)));
  });
  it("adds a future accepted meaning only for the exact current case/node/question/concept tuple",()=>{
    const cs=cases.find(c=>meanings.some(m=>m.id===c.decisionNodes[0]!.primaryConceptId))!,n=cs.decisionNodes[0]!;
    const row={acceptanceId:"test-only",caseId:cs.id,nodeId:n.id,questionVariantId:n.questionVariantId,conceptId:n.primaryConceptId,sourceView:"catalog",decision:"test fixture, no acceptance"};
    const expected=meanings.find(m=>m.id===n.primaryConceptId)!;
    expect(withAcceptedQuestionNewN3Round2Concepts(catalog,preN3.concepts,{...manifest,accepted:[row]}).concepts).toEqual([...preN3.concepts,expected]);
    expect(withAcceptedQuestionNewN3Round2Concepts(catalog,preN3.concepts,{...manifest,accepted:[{...row,questionVariantId:n.questionVariantId+".unknown"}]}).concepts).toEqual(preN3.concepts);
    const testManifest={...manifest,accepted:[row],headerSources:{...manifest.headerSources,[cs.id]:"catalog"}};
    const projected=projectManagerAcceptedQuestions(withAcceptedQuestionNewN3Round2Concepts(catalog,preN3.concepts,testManifest),legacy,{},testManifest);
    expect(projected.cases.find(c=>c.id===cs.id)).toEqual(cs);
  });
  it("never rewrites an unknown version or an already frozen original object",()=>{
    const old=oldCases[0]!,frozen=structuredClone(old),unknown={...old,decisionNodes:[{...old.decisionNodes[0]!,questionVariantId:"question.unknown"}]};
    expect(applyQuestionNewN3Round2Revisions([unknown])[0]).toBe(unknown);
    applyQuestionNewN3Round2Revisions([old]);expect(old).toEqual(frozen);
  });
  it("retains old exact timing rows in order while appending thirty-nine new identities",()=>{
    const key=(r:typeof oldTiming[number])=>JSON.stringify([r.caseId,r.nodeId,r.questionVariantId]);
    const oldKeys=new Set(oldTiming.map(key)),newKeys=new Set(newTiming.map(key));
    expect(ANSWER_CHOICE_TIMING_REGISTRY.filter(t=>oldKeys.has(key(t)))).toEqual(oldTiming);
    expect(ANSWER_CHOICE_TIMING_REGISTRY.filter(t=>newKeys.has(key(t)))).toEqual(newTiming);
    expect(new Set(ANSWER_CHOICE_TIMING_REGISTRY.map(key)).size).toBe(ANSWER_CHOICE_TIMING_REGISTRY.length);
  });
  it("retains original atomic statements, source metadata and actual check/access dates",()=>{
    for(const old of oldClaims)expect(claims.find(c=>c.id===old.id)).toEqual(old);
    for(const old of oldSources){const current=sources.find(s=>s.id===old.id)!;const {evidenceClaimIds:_a,...left}=old,{evidenceClaimIds:_b,...right}=current;expect(right).toEqual(left);}
    for(const p of provenance){const c=claims.find(c=>c.id===p.claimId)!;expect(c.lastCheckedOn).toBe(p.inheritedLastCheckedOn);expect(p.statementUnchanged).toBe(true);}
  });
  it.each(cases.map((cs,index)=>[cs.id,index]as const))("binds %s to a complete reviewable draft and exact test estimates",(_id,index)=>{
    const cs=cases[index]!,q=questions[index]!,n=cs.decisionNodes[0]!,r=revisions.find(r=>`case.n3.${r.slug}.v1`===cs.id);
    expect(catalog.cases.find(c=>c.id===cs.id)).toEqual(cs);
    expect(q.reviewStatus).toBe("needs_clinician_review");expect(q.lastClinicianReview).toBeNull();
    expect(n.shuffleAnswers).toBe(true);expect(n.answerChoices.filter(c=>c.isCorrect)).toHaveLength(1);expect([3,4]).toContain(n.answerChoices.length);
    expect(n.answerChoices.every(c=>c.serviceRequest===null)).toBe(true);expect(n.resultGateAfter).toBeNull();
    expect(cs.requiredCapabilityIds).toEqual([]);expect(cs.requiredClinicalSetting).toBe("clinic");expect(cs.approvedInstantiationProfiles).toHaveLength(1);
    expect(cs.presentation).toContain(`${cs.prototypeDemographics!.ageYears}-year-old`);expect(cs.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
    for(const id of q.supportingEvidenceClaimIds){const c=claims.find(c=>c.id===id)!;expect(c).toBeDefined();for(const sourceId of c.sourceIds)expect(sources.find(s=>s.id===sourceId)?.evidenceClaimIds).toContain(id);}
    expect(ANSWER_CHOICE_TIMING_REGISTRY).toContainEqual(timing[index]);
    const t=timing[index]!;if(t.classification.kind==="test_choices")for(const ch of t.classification.choices){
      expect(n.answerChoices.find(c=>c.id===ch.choiceId)?.label).toBe(ch.choiceLabel);
      const estimate=ch.timing;if(estimate.kind==="test")expect(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.some(p=>p.id===estimate.timingProfileId)).toBe(true);
    }
    if(r){const check=checks[index]!;expect("calibratedRejectionTests" in check).toBe(true);
      if("calibratedRejectionTests" in check){expect(check.calibratedRejectionTests.competentResidentDistractors).toHaveLength(n.answerChoices.length-1);
        expect(n.answerChoices.some(c=>c.id===check.calibratedRejectionTests.dataAblation.thenBestChoiceId)).toBe(true);}
      for(const id of r.keyClaimIds)expect(r.item.existingClaimIds).toContain(id);
    }
  });
});
