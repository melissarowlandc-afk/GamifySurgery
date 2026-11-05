import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {PROTOTYPE_BALANCE_RELEASE} from "@gamify-surgery/balance-config";
import {QUESTION_NEW_N3_PRE_TIMING_ENTRIES as ANSWER_CHOICE_TIMING_REGISTRY,QUESTION_NEW_N2_ROUND3_PRE_TIMING_ENTRIES} from "./answer-choice-timing";
import {QUESTION_CATALOG_RELEASE as catalog,QUESTION_NEW_N2_ROUND3_PRE_RELEASE as before} from "./synthetic-content";
import {validateSyntheticClinicalRelease} from "./schema";
import {QUESTION_NEW_N1_ROUND3_CASES as frozenN1} from "./question-new-n1-round3-20261104";
import {QUESTION_NEW_N2_ROUND2_CASES as oldCases,QUESTION_NEW_N2_ROUND2_QUESTIONS as oldQuestions,
 QUESTION_NEW_N2_ROUND2_AUTHORING_CONCEPTS as oldConcepts,QUESTION_NEW_N2_ROUND2_CASE_REVIEWS as oldReviews} from "./question-new-n2-round2-20261104";
import {QUESTION_NEW_N2_ROUND3_CASES as cases,QUESTION_NEW_N2_ROUND3_REVISED_CASES as revised,
 QUESTION_NEW_N2_ROUND3_REVISIONS as revisions,QUESTION_NEW_N2_ROUND3_FROZEN_PASS_IDS as passes,
 QUESTION_NEW_N2_ROUND3_QUESTIONS as questions,QUESTION_NEW_N2_ROUND3_AUTHORING_CONCEPTS as concepts,
 QUESTION_NEW_N2_ROUND3_NEW_CONCEPT_VERSIONS as meanings,QUESTION_NEW_N2_ROUND3_CLAIMS as claims,
 QUESTION_NEW_N2_ROUND3_SOURCES as sources,QUESTION_NEW_N2_ROUND3_CLAIM_PROVENANCE as provenance,
 QUESTION_NEW_N2_ROUND3_SOURCE_HOLDS as holds,QUESTION_NEW_N2_ROUND3_TIMING_ENTRIES as timings,
 applyQuestionNewN2Round3Revisions} from "./question-new-n2-round3-20261104";

describe("N2 round three catalog definitions and exact frozen boundary",()=>{
 it("projects exactly the returned 27 and retains every N1 field",()=>{
  expect(cases).toHaveLength(39);expect(revised).toHaveLength(27);expect(passes).toHaveLength(12);expect(meanings).toHaveLength(22);
  // Scope this projection to its own stage; peer batch-2b candidates append to
  // the shared catalog independently, without changing these exact N2 versions.
  const stage=validateSyntheticClinicalRelease({...before,concepts:[...before.concepts,...meanings],cases:applyQuestionNewN2Round3Revisions(before.cases)});
  expect(stage.cases).toHaveLength(before.cases.length);expect(stage.concepts).toEqual([...before.concepts,...meanings]);
  const changed=new Set(revised.map(c=>c.id));
  for(const cs of before.cases.filter(c=>!changed.has(c.id)))expect(stage.cases.find(c=>c.id===cs.id)).toEqual(cs);
  for(const cs of frozenN1)expect(catalog.cases.find(c=>c.id===cs.id)).toEqual(cs);
  expect(()=>applyQuestionNewN2Round3Revisions(catalog.cases)).toThrow("prior binding changed");
 });
 it.each(passes)("retains the exact independent PASS %s",id=>{
  const i=oldReviews.findIndex(r=>r.id===id);expect(i).toBeGreaterThanOrEqual(0);
  expect(cases[i]).toEqual(oldCases[i]);expect(questions[i]).toEqual(oldQuestions[i]);expect(concepts[i]).toEqual(oldConcepts[i]);
  expect(catalog.cases.find(c=>c.id===oldCases[i]!.id)).toEqual(oldCases[i]);
 });
 it.each(revisions.map(r=>[r.slug,r] as const))("binds %s to draft evidence, full timing and a separate exact version",(slug,r)=>{
  const cs=revised.find(c=>c.id===`case.n2.${slug}.v1`)!,node=cs.decisionNodes[0]!,q=questions.find(q=>q.id===node.questionVariantId)!;
  expect(catalog.cases.find(c=>c.id===cs.id)).toEqual(cs);
  expect(q).toMatchObject({id:`question.n2.${slug}.v3`,reviewStatus:"needs_clinician_review",lastClinicianReview:null});
  expect(node.primaryConceptId).toBe(r.item.conceptId);expect(node.shuffleAnswers).toBe(true);expect(node.resultGateAfter).toBeNull();
  expect(node.answerChoices.filter(c=>c.isCorrect)).toHaveLength(1);expect([3,4]).toContain(node.answerChoices.length);
  expect(node.answerChoices.every(c=>c.serviceRequest===null)).toBe(true);
  expect(cs.presentation).toContain(`${r.item.age}-year-old`);
  expect(cs.prototypeDemographics?.ageYears).toBe(r.item.age);
  const timing=timings.find(t=>t.caseId===cs.id)!;expect(ANSWER_CHOICE_TIMING_REGISTRY).toContainEqual(timing);
  if(timing.classification.kind==="test_choices")for(const row of timing.classification.choices){
   expect(node.answerChoices.find(c=>c.id===row.choiceId)?.label).toBe(row.choiceLabel);
   if(row.timing.kind==="test")expect(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map(p=>p.id)).toContain(row.timing.timingProfileId);
  }
  for(const id of q.supportingEvidenceClaimIds){const claim=claims.find(c=>c.id===id)!;expect(claim).toBeDefined();
   for(const sourceId of claim.sourceIds)expect(sources.find(s=>s.id===sourceId)?.evidenceClaimIds).toContain(id);
  }
  expect(r.optionChecks).toHaveLength(node.answerChoices.length);
  expect(r.optionChecks.every(c=>c.correctUnder.length>30)).toBe(true);
  expect(r.selfCheck.interpretFindings).not.toBe(r.selfCheck.applyFindings);
  expect(node.answerChoices[0]!.label.length).toBeLessThanOrEqual(Math.max(...node.answerChoices.slice(1).map(c=>c.label.length)));
 });
 it("retains old timing identities and source dates while exposing explicit new holds",()=>{
  expect(ANSWER_CHOICE_TIMING_REGISTRY).toHaveLength(QUESTION_NEW_N2_ROUND3_PRE_TIMING_ENTRIES.length+27);
  const exactKey=(row:typeof ANSWER_CHOICE_TIMING_REGISTRY[number])=>JSON.stringify([row.caseId,row.nodeId,row.questionVariantId]);
  const archive=new Map(ANSWER_CHOICE_TIMING_REGISTRY.map(row=>[exactKey(row),row]));
  for(const row of QUESTION_NEW_N2_ROUND3_PRE_TIMING_ENTRIES)expect(archive.get(exactKey(row))).toEqual(row);
  expect(holds).toHaveLength(18);
  for(const p of provenance){const claim=claims.find(c=>c.id===p.claimId)!;
   if(p.statementUnchanged&&"inheritedLastCheckedOn"in p)expect(claim.lastCheckedOn).toBe(p.inheritedLastCheckedOn);
   if(!p.statementUnchanged&&p.claimId.startsWith("claim.n2r3."))expect(claim.lastCheckedOn).toBe("2026-11-05");
  }
  for(const source of sources){expect(source.completeCitation).toBeTruthy();expect(source.accessedOn).toBeTruthy();expect(source.authorityAssessment).toBeTruthy();expect(source.licenseLabel).toBeTruthy();}
 });
 it("provides the original pressure graphic at its declared dimensions with complete accessible observations",()=>{
  const exhibit=revised.find(c=>c.id==="case.n2.ventilator-elastic-versus-resistive-load.v1")!.decisionNodes[0]!.exhibit!;
  expect(exhibit.kind).toBe("image");if(exhibit.kind!=="image")throw new Error("Expected pressure graphic");
  const bytes=readFileSync(new URL(`../../../apps/player/public/${exhibit.assetPath}`,import.meta.url));
  expect(bytes.subarray(0,8).toString("hex")).toBe("89504e470d0a1a0a");expect(bytes.readUInt32BE(16)).toBe(exhibit.width);expect(bytes.readUInt32BE(20)).toBe(exhibit.height);
  expect(exhibit.description).toContain("peak 32 and plateau 26");
 });
 it("uses modality-matched placeholders for the revised MRI and imaging-only endoscopic distractors",()=>{
  const neuro=timings.find(t=>t.questionVariantId==="question.n2.serial-gcs-verbal-interference.v3")!;
  const pancreas=timings.find(t=>t.questionVariantId==="question.n2.pancreatic-cyst-predates-pancreatitis.v3")!;
  if(neuro.classification.kind!=="test_choices"||pancreas.classification.kind!=="test_choices")throw new Error("Expected testing choices");
  expect(neuro.classification.choices.find(c=>c.choiceLabel.includes("magnetic resonance"))!.timing).toEqual({kind:"test",timingProfileId:"timing.test.mri"});
  expect(pancreas.classification.choices.find(c=>c.choiceLabel.includes("ultrasonography"))!.timing).toEqual({kind:"test",timingProfileId:"timing.test.upper_endoscopy"});
 });
});
