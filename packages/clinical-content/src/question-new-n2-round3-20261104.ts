import type { QuestionVariant } from "./pilot-schema";
import type { AnswerChoiceTimingRegistryEntry, SyntheticClinicalCase, TestedConcept } from "./schema";
import { QUESTION_NEW_N2_ROUND2_ITEMS as oldItems, QUESTION_NEW_N2_ROUND2_QUESTIONS as oldQuestions,
  QUESTION_NEW_N2_ROUND2_CASES as oldCases, QUESTION_NEW_N2_ROUND2_AUTHORING_CONCEPTS as oldConcepts,
  QUESTION_NEW_N2_ROUND2_CASE_REVIEWS as oldReviews, QUESTION_NEW_N2_ROUND2_REVIEW_TIMING as oldTiming,
  QUESTION_NEW_N2_ROUND2_STATEMENT_MAPPINGS as oldMappings } from "./question-new-n2-round2-20261104";
import { QUESTION_NEW_N2_ROUND3_ABDOMINAL } from "./question-new-n2-round3-abdominal";
import { QUESTION_NEW_N2_ROUND3_NUTRITION } from "./question-new-n2-round3-nutrition";
import { QUESTION_NEW_N2_ROUND3_SPECIALTY } from "./question-new-n2-round3-specialty";
import { QUESTION_NEW_N2_ROUND3_RESEARCH } from "./question-new-n2-round3-research";
import { QUESTION_NEW_N2_ROUND3_PERIOPERATIVE } from "./question-new-n2-round3-perioperative";
import { QUESTION_NEW_N2_ROUND3_DRAFT as draft, QUESTION_NEW_N2_ROUND3_VERSION } from "./question-new-n2-round3-types";
import { QUESTION_NEW_N2_ROUND3_CLAIMS as claims, QUESTION_NEW_N2_ROUND3_SOURCES as sources,
  QUESTION_NEW_N2_ROUND3_CLAIM_PROVENANCE as provenance } from "./question-new-n2-round3-evidence-20261104";
export * from "./question-new-n2-round3-evidence-20261104";

export const QUESTION_NEW_N2_ROUND3_REVISIONS = [...QUESTION_NEW_N2_ROUND3_ABDOMINAL,
  ...QUESTION_NEW_N2_ROUND3_NUTRITION, ...QUESTION_NEW_N2_ROUND3_PERIOPERATIVE, ...QUESTION_NEW_N2_ROUND3_SPECIALTY, ...QUESTION_NEW_N2_ROUND3_RESEARCH];
const revisions = new Map(QUESTION_NEW_N2_ROUND3_REVISIONS.map(r=>[r.slug,r]));
export const QUESTION_NEW_N2_ROUND3_FROZEN_PASS_IDS = [
  "review.n2.sglt2-postoperative-restart.v2",
  "review.n2.factor-assays-without-mixing-gate.v2",
  "review.n2.bile-leak-duct-continuity-boundary.v2",
  "review.n2.gastric-wall-mass-specimen-provenance.v2",
  "review.n2.ercp-versus-gallbladder-source.v2",
  "review.n2.hpylori-antibody-after-valid-cure-test.v2",
  "review.n2.malignant-polyp-local-versus-regional-risk.v2",
  "review.n2.ventral-hernia-priority-change.v2",
  "review.n2.negative-predictive-value-denominator.v2",
  "review.n2.positive-likelihood-ratio.v2",
  "review.n2.equivalence-margin-versus-null-test.v2",
  "review.n2.case-mix-standardized-risk.v1"
] as const;
export const QUESTION_NEW_N2_ROUND3_ITEMS = oldItems.map(item=>revisions.get(item.slug)?.item??item);
const template = (s:string,name:string)=>s.split(name).join("{patientName}");
const claimIds = (ids:readonly string[])=>ids.map(id=>{
  const found=provenance.find(p=>p.inheritedClaimId===id);
  if(!found)throw new Error(`Missing N2 round-three evidence ${id}`);
  return found.claimId;
});
const labelsFor = (ids:readonly string[])=>[...new Set(claims.filter(c=>ids.includes(c.id)).flatMap(c=>c.sourceIds))]
  .map(id=>sources.find(s=>s.id===id)!.title);
export const QUESTION_NEW_N2_ROUND3_QUESTIONS:QuestionVariant[] = QUESTION_NEW_N2_ROUND3_ITEMS.map((item,i)=>{
  if(!revisions.has(item.slug))return oldQuestions[i]!;
  return {...draft,id:`question.n2.${item.slug}.v3`,conceptId:item.conceptId,stem:template(item.stem,item.patientName),
    explanation:item.explanation,...(item.exhibit?{exhibit:item.exhibit}:{}),supportingEvidenceClaimIds:claimIds(item.existingClaimIds),
    answerChoices:item.choices.map((c,j)=>({id:`choice.n2r3.${item.slug}.${c.id}`,label:c.label,isCorrect:j===0,
      rationale:c.rationale,distractorRationale:j===0?null:c.rationale}))};
});
export const QUESTION_NEW_N2_ROUND3_CASES:SyntheticClinicalCase[] = QUESTION_NEW_N2_ROUND3_ITEMS.map((item,i)=>{
  const old=oldCases[i]!;
  if(!revisions.has(item.slug))return old;
  const q=QUESTION_NEW_N2_ROUND3_QUESTIONS[i]!, {exhibit:_oldExhibit,...node}=old.decisionNodes[0]!;
  const presentation=template(item.presentation,item.patientName),sourceLabels=labelsFor(q.supportingEvidenceClaimIds);
  return {...old,chiefComplaint:item.complaint,presentation,sourceLabels,
    patientPresentationVariantId:`presentation.n2.${item.slug}.v3`,
    approvedInstantiationProfiles:[{id:`profile.n2.${item.slug}.v3`,prototypeDemographics:old.prototypeDemographics!,chiefComplaint:item.complaint,presentation}],
    decisionNodes:[{...node,questionVariantId:q.id,primaryConceptId:item.conceptId,stem:q.stem,explanation:q.explanation,sourceLabels,
      ...(item.exhibit?{exhibit:item.exhibit}:{}),shuffleAnswers:true,resultGateAfter:null,
      answerChoices:q.answerChoices.map(c=>({id:c.id,label:c.label,isCorrect:c.isCorrect,rationale:c.rationale!,serviceRequest:null})),
      terminalDispositions:q.answerChoices.filter(c=>!c.isCorrect).map(c=>({answerChoiceId:c.id,kind:"no_terminal_outcome" as const,
        consequenceNarrative:"The team reviews the proposed plan against the recorded findings.",clinicalRationale:c.rationale!,sourceLabels}))}],
    learningSummary:q.explanation};
});
export const QUESTION_NEW_N2_ROUND3_REVISED_CASES = QUESTION_NEW_N2_ROUND3_CASES.filter(c=>c.decisionNodes[0]!.questionVariantId.endsWith(".v3"));
export const QUESTION_NEW_N2_ROUND3_AUTHORING_CONCEPTS = QUESTION_NEW_N2_ROUND3_ITEMS.map((item,i)=>{
  const r=revisions.get(item.slug);return r?{...oldConcepts[i]!,...draft,id:item.conceptId,displayName:item.displayName,
    learningObjective:item.learningObjective,conceptType:item.conceptType,evidenceClaimIds:claimIds(item.existingClaimIds),
    previousConceptId:r.previousConceptId,conceptMeaning:r.conceptMeaning,conceptVersionReason:r.conceptVersionReason,
    historyMigration:"None. Previous definitions/cards remain; new meanings are separate histories, not evidence of independent fresh supply."}:oldConcepts[i]!;
});
export const QUESTION_NEW_N2_ROUND3_TESTED_CONCEPTS:TestedConcept[] = QUESTION_NEW_N2_ROUND3_REVISIONS.map(({item})=>({
  id:item.conceptId,displayName:item.displayName,learningObjective:item.learningObjective,conceptType:item.conceptType,earliestFacilityStage:item.level}));
export const QUESTION_NEW_N2_ROUND3_NEW_CONCEPT_VERSIONS = QUESTION_NEW_N2_ROUND3_TESTED_CONCEPTS.filter(c=>
  QUESTION_NEW_N2_ROUND3_REVISIONS.some(r=>r.item.conceptId===c.id&&r.conceptMeaning==="new_version"));
export const QUESTION_NEW_N2_ROUND3_REVIEW_TIMING:AnswerChoiceTimingRegistryEntry[] = QUESTION_NEW_N2_ROUND3_ITEMS.map((item,i)=>{
  if(!revisions.has(item.slug))return oldTiming[i]!;
  const cs=QUESTION_NEW_N2_ROUND3_CASES[i]!,node=cs.decisionNodes[0]!;
  return {caseId:cs.id,nodeId:node.id,questionVariantId:node.questionVariantId,classification:item.choices.some(c=>c.timingProfileId)?{
    kind:"test_choices",choices:node.answerChoices.map((c,j)=>({choiceId:c.id,choiceLabel:c.label,timing:item.choices[j]!.timingProfileId?
      {kind:"test",timingProfileId:item.choices[j]!.timingProfileId!}:{kind:"no_test"}}))}:{kind:"no_test"}};
});
export const QUESTION_NEW_N2_ROUND3_TIMING_ENTRIES = QUESTION_NEW_N2_ROUND3_REVIEW_TIMING.filter(t=>t.questionVariantId.endsWith(".v3"));
export const QUESTION_NEW_N2_ROUND3_CASE_REVIEWS = QUESTION_NEW_N2_ROUND3_ITEMS.map((item,i)=>revisions.has(item.slug)?{
  ...draft,id:`review.n2.${item.slug}.v3`,caseId:QUESTION_NEW_N2_ROUND3_CASES[i]!.id,educationalTier:item.educationalTier,acuity:item.acuity,
  earliestFacilityStage:item.level,evidenceClaimIds:QUESTION_NEW_N2_ROUND3_QUESTIONS[i]!.supportingEvidenceClaimIds}:oldReviews[i]!);
export const QUESTION_NEW_N2_ROUND3_STATEMENT_MAPPINGS = QUESTION_NEW_N2_ROUND3_ITEMS.map((item,i)=>{
  if(!revisions.has(item.slug))return oldMappings[i]!;
  const cs=QUESTION_NEW_N2_ROUND3_CASES[i]!,q=QUESTION_NEW_N2_ROUND3_QUESTIONS[i]!;
  return {...draft,caseId:cs.id,questionVariantId:q.id,fields:["presentation","decisionNodes[0].stem","decisionNodes[0].exhibit",
    "decisionNodes[0].explanation","learningSummary",...q.answerChoices.map((_,j)=>`decisionNodes[0].answerChoices[${j}].rationale`)],
    evidenceClaimIds:q.supportingEvidenceClaimIds,
    constructedDataBasis:"Fictional patient measurements, chronology, pathology and acquisition records; not empirical rates, universal treatment cutoffs or medication doses. Laboratory intervals are those of the constructed record.",
    extensionLimitations:"Unchanged atoms retain original dates. Explicit offline extensions and option rankings carry targeted verification holds; no source retrieval or clinical sign-off."};
});
export const QUESTION_NEW_N2_ROUND3_SOURCE_LINKS = sources.filter(s=>s.officialUrl).map(s=>({...draft,
  id:`link.n2r3.${s.id.replace(/^source\./,"")}`,sourceId:s.id,label:s.title,href:s.officialUrl!,target:"_blank",rel:"noopener noreferrer",referrerPolicy:"no-referrer"}));
const canonical=(value:unknown):unknown=>Array.isArray(value)?value.map(canonical):value&&typeof value==="object"?
  Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical((value as Record<string,unknown>)[k])])):value;
/** Applies only to fresh catalog definitions; old serialized encounters are never rewritten. */
export function applyQuestionNewN2Round3Revisions(cases:SyntheticClinicalCase[]):SyntheticClinicalCase[]{
  const changed=new Map(QUESTION_NEW_N2_ROUND3_REVISED_CASES.map(c=>[c.id,c]));
  for(const old of oldCases.filter(c=>changed.has(c.id))){
    const current=cases.find(c=>c.id===old.id);
    if(!current||JSON.stringify(canonical(current))!==JSON.stringify(canonical(old)))throw new Error(`N2 round-three prior binding changed: ${old.id}`);
  }
  return cases.map(c=>changed.get(c.id)??c);
}
export const QUESTION_NEW_N2_ROUND3_MANIFEST = {...draft,id:"batch.question-new-n2-round3.2026-11-04",
  contentVersion:QUESTION_NEW_N2_ROUND3_VERSION,reviewSource:"docs/research/question-new-n2-review2-20261104.json",
  priorReviewCounts:{PASS:12,REVISE:26,FAIL:1},variantCount:39,revisedVariantCount:27,frozenPassCount:12,frozenPassIds:QUESTION_NEW_N2_ROUND3_FROZEN_PASS_IDS,
  newConstructVersions:QUESTION_NEW_N2_ROUND3_NEW_CONCEPT_VERSIONS.length,
  pipelinePassed:false,clinicalApproval:false,publicReleaseAuthorized:false,
  authorSelfCheck:"Manual five-part author checks and per-choice counterfactuals for the 27 revisions; no independent PASS, calibrated difficulty or clinical approval.",
  sourceVerification:"Offline only. Original source/check dates retained; newly introduced clinical details are explicit extensions with targeted verification holds. Do not release unresolved extensions merely because cited sources exist.",
  scope:"Only 27 returned N2 definitions projected. Twelve exact PASS cases/questions/metadata retained; all N1 definitions, review packets and assets frozen. The ship manifest admits only exact manager-accepted versions. No new executable clinical service or history migration.",
} as const;
