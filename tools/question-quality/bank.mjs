import { createHash } from "node:crypto";
import { lintQuestion, LINTER_VERSION } from "./lint.mjs";

export function collectAuthoredMetadata(namespace) {
  const questions=new Map(), concepts=new Map(), caseReviews=new Map(), claims=new Map(), sources=new Map(), approvals=[], seen=new WeakSet();
  const append=(map,id,value)=>{ const list=map.get(id)||[]; if(!list.includes(value))list.push(value); map.set(id,list); };
  function visit(value, depth=0) {
    if(!value||typeof value!=="object"||seen.has(value)||depth>8)return;
    seen.add(value);
    if(Array.isArray(value)){value.forEach(x=>visit(x,depth+1));return;}
    if(value.decision==="approved"&&Array.isArray(value.approvedQuestionVariantIds)&&typeof value.contentVersion==="string")approvals.push(value);
    if(typeof value.id==="string"){
      if(Array.isArray(value.answerChoices)&&Array.isArray(value.supportingEvidenceClaimIds)&&typeof value.contentVersion==="string")append(questions,value.id,value);
      if(value.id.startsWith("concept.")&&typeof value.learningObjective==="string"){
        const old=concepts.get(value.id)||{};
        concepts.set(value.id,{...old,...Object.fromEntries(Object.entries(value).filter(([,v])=>v!==undefined))});
      }
      if(Array.isArray(value.sourceIds)&&typeof value.evidenceCategory==="string")claims.set(value.id,value);
      if(typeof value.completeCitation==="string")sources.set(value.id,value);
    }
    if(typeof value.caseId==="string"&&value.educationalTier!==undefined&&value.reviewStatus)caseReviews.set(value.caseId,value);
    for(const v of Object.values(value))visit(v,depth+1);
  }
  visit(namespace);
  // Legacy receipts declare version/status for exact old IDs, never new revisions.
  // This inventory lookup does not revalidate byte-level clinical approval.
  for(const approval of approvals)for(const id of approval.approvedQuestionVariantIds)if(!questions.has(id))questions.set(id,[{
    id,contentVersion:approval.contentVersion,reviewStatus:"clinically_approved",
    supportingEvidenceClaimIds:approval.approvedEvidenceClaimIds??[],metadataOrigin:"approval_record",
    approvalRecordId:approval.id,reviewer:approval.reviewer,reviewedOn:approval.reviewedOn,
  }]);
  return {questions,concepts,caseReviews,claims,sources};
}
const digest=value=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
/** Only explicit authored per-choice reasons; never infer a key's rationale
 * from the combined explanation or a runtime fallback containing all options. */
export function authoredRationales(questions, choices) {
  return choices.map(choice => {
    const candidates=questions.flatMap(q => {
      const c=q.answerChoices?.find(c=>c.id===choice.id);
      const field=typeof c?.rationale==="string"&&c.rationale.trim()?"rationale":"distractorRationale";
      return typeof c?.[field]==="string"&&c[field].trim()?[{text:c[field],field:"authoring.answerChoices."+field}]:[];
    });
    const texts=new Set(candidates.map(r=>r.text));
    return {choiceId:choice.id,text:texts.size===1?candidates[0].text:null,field:candidates[0]?.field??"authoring.answerChoices.rationale"};
  });
}
function exhibitFields(exhibit,prefix="exhibit"){
  const result={};
  function visit(v,p){if(typeof v==="string")result[p]=v;else if(Array.isArray(v))v.forEach((a,i)=>visit(a,p+"["+i+"]"));else if(v&&typeof v==="object")for(const [k,a]of Object.entries(v))if(k!=="kind"&&!(v.kind==="image"&&k==="assetPath"))visit(a,p+"."+k);}
  if(exhibit)visit(exhibit,prefix);
  return result;
}
export function preAnswerFields(clinicalCase,nodeIndex,profile=null) {
  const node=clinicalCase.decisionNodes[nodeIndex];
  const fields={chiefComplaint:profile?.chiefComplaint??clinicalCase.chiefComplaint??"",presentation:profile?.presentation??clinicalCase.presentation,stem:node.stem};
  if(node.currentUpdate)fields.currentUpdate=node.currentUpdate;
  for(let i=0;i<nodeIndex;i++){
    const previous=clinicalCase.decisionNodes[i];
    if(previous.resultGateAfter)fields["priorResults["+i+"]"]=previous.resultGateAfter.resultNarrative;
    fields["priorFeedback["+i+"]"]=previous.explanation;
    if(previous.teachingPoint)fields["priorTeachingPoint["+i+"]"]=previous.teachingPoint;
  }
  return {...fields,...exhibitFields(node.exhibit)};
}

export function inventoryRelease(release,metadata,{tutorialCaseIds=[],pilotRevisions=[]}={}) {
  const records=new Map(), tutorials=new Set(tutorialCaseIds), revisionById=new Map(pilotRevisions.map(r=>[r.questionVariantId,r]));
  for(const c of release.cases)for(let i=0;i<c.decisionNodes.length;i++){
    const n=c.decisionNodes[i], auth=metadata.questions.get(n.questionVariantId)||[], rationales=authoredRationales(auth,n.answerChoices);
    const concept=metadata.concepts.get(n.primaryConceptId)||release.concepts.find(x=>x.id===n.primaryConceptId)||{};
    let record=records.get(n.questionVariantId);
    if(!record){
      const revision=revisionById.get(n.questionVariantId);
      record={questionVariantId:n.questionVariantId,conceptId:n.primaryConceptId,conceptName:concept.displayName??n.primaryConceptId,conceptType:concept.conceptType??null,
        educationalTier:concept.educationalTier??null,facilityStages:[],optionCounts:[],authoredVersions:[...new Set(auth.map(q=>q.contentVersion))].sort(),
        reviewStatuses:[...new Set(auth.map(q=>q.reviewStatus))].sort(),caseIds:[],nodeOccurrences:0,profileContexts:0,
        metadataOrigins:[...new Set(auth.map(q=>q.metadataOrigin??"authored_question"))].sort(),
        tutorialSequence:false,tutorialEligible:false,educationalIntent:revision?.educationalIntent??"unclassified_pending_review",
        rationaleComparisonAvailable:rationales.every(r=>r.text),definitionFingerprints:[],supportingEvidenceClaimIds:[...new Set(auth.flatMap(q=>q.supportingEvidenceClaimIds))].sort(),findings:[],_findings:new Map()};
      records.set(n.questionVariantId,record);
    }
    if(record.conceptId!==n.primaryConceptId)throw new Error("A variant identity refers to different concepts: "+n.questionVariantId);
    if(record.educationalTier===null)record.educationalTier=metadata.caseReviews.get(c.id)?.educationalTier??null;
    record.caseIds.push(c.id);record.facilityStages.push(c.earliestFacilityStage);record.optionCounts.push(n.answerChoices.length);record.nodeOccurrences++;
    record.tutorialSequence ||= tutorials.has(c.id);record.tutorialEligible ||= c.tutorialEligible;
    record.definitionFingerprints.push(digest({concept:n.primaryConceptId,stem:n.stem,choices:n.answerChoices,explanation:n.explanation,exhibit:n.exhibit}));
    const profiles=[null,...(c.approvedInstantiationProfiles||[])], distinctContexts=new Map();
    for(const p of profiles){const fields=preAnswerFields(c,i,p);const hash=digest(fields);if(!distinctContexts.has(hash))distinctContexts.set(hash,{fields,profileIds:[]});distinctContexts.get(hash).profileIds.push(p?.id??"canonical");}
    for(const {fields,profileIds}of distinctContexts.values()){
      record.profileContexts+=profileIds.length;
      const result=lintQuestion({variantId:n.questionVariantId,concept,choices:n.answerChoices,fields,caseId:c.id,profileId:profileIds[0],rationales});
      for(const f of result.findings){
        const signature=digest([f.rule,f.evidence.map(e=>({field:e.field,text:e.text,choiceId:e.choiceId})),f.metrics]);
        let merged=record._findings.get(signature);
        if(!merged){merged={...f,id:signature.slice(0,16),occurrences:[]};delete merged.caseId;delete merged.profileId;record._findings.set(signature,merged);}
        merged.occurrences.push({caseId:c.id,profileIds,ranges:f.evidence.map(e=>({start:e.start,end:e.end}))});
      }
    }
  }
  const variants=[...records.values()].map(r=>{
    for(const k of ["caseIds","facilityStages","optionCounts","definitionFingerprints"])r[k]=[...new Set(r[k])].sort((a,b)=>typeof a==="number"?a-b:a.localeCompare(b));
    r.findings=[...r._findings.values()].sort((a,b)=>a.rule.localeCompare(b.rule)||a.id.localeCompare(b.id));delete r._findings;
    r.wordingFingerprint=digest(r.definitionFingerprints);r.priorityStage=r.facilityStages[0];r.caseReferenceCount=r.caseIds.length;
    return r;
  }).sort((a,b)=>a.priorityStage-b.priorityStage||Number(b.tutorialSequence)-Number(a.tutorialSequence)||b.caseReferenceCount-a.caseReferenceCount||b.findings.length-a.findings.length||a.questionVariantId.localeCompare(b.questionVariantId));
  const rules={};for(const v of variants)for(const rule of new Set(v.findings.map(f=>f.rule)))rules[rule]=(rules[rule]||0)+1;
  return {schemaVersion:1,linterVersion:LINTER_VERSION,releaseId:release.id,scope:"Every case/node and canonical/finite profile in the assembled default release, including unapproved prototype content. Prior feedback is a visible-history cue candidate; future results/current feedback are excluded.",
    exposureBasis:"Structural priority proxy only: earlier entry stage, tutorial sequence, case-reference count, then cue findings. No player exposure data collected.",
    totals:{cases:release.cases.length,nodeOccurrences:variants.reduce((n,v)=>n+v.nodeOccurrences,0),uniqueVariants:variants.length,concepts:new Set(variants.map(v=>v.conceptId)).size,
      profileContexts:variants.reduce((n,v)=>n+v.profileContexts,0),variantsWithFindings:variants.filter(v=>v.findings.length).length,findings:variants.reduce((n,v)=>n+v.findings.length,0),
      tutorialSequenceVariants:variants.filter(v=>v.tutorialSequence).length,missingAuthoredVersion:variants.filter(v=>!v.authoredVersions.length).length,
      missingEducationalTier:variants.filter(v=>v.educationalTier===null).length,
      approvalRecordOnlyMetadata:variants.filter(v=>v.metadataOrigins.includes("approval_record")).length,
      variantsWithCompleteRationales:variants.filter(v=>v.rationaleComparisonAvailable).length,
      variantsWithMultipleDefinitions:variants.filter(v=>v.definitionFingerprints.length>1).length,
      byPriorityStage:Object.fromEntries([...new Set(variants.map(v=>v.priorityStage))].map(s=>[s,variants.filter(v=>v.priorityStage===s).length])),
      byOptionCount:Object.fromEntries([...new Set(variants.flatMap(v=>v.optionCounts))].sort().map(s=>[s,variants.filter(v=>v.optionCounts.includes(s)).length])),variantsByRule:Object.fromEntries(Object.entries(rules).sort())},variants};
}

