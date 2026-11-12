import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata,inventoryRelease} from './bank.mjs';

// Offline reuse of recorded facts only. Never refresh the immutable intake or
// first-round files; this is a separately versioned, unaccepted preview.
const intake=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-harden1-before-20261110.json','utf8'));
const prior=await import('../../packages/clinical-content/src/question-harden1-20261110.ts');
const date='2026-11-10',root='packages/clinical-content/src/';
const draft={contentVersion:'question-authoring.2026-11-10.harden1-r2',reviewStatus:'needs_clinician_review',aiAssistedDrafting:true,lastClinicianReview:null};
const sha=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const json=x=>JSON.stringify(x,null,2);
const output=(path,text)=>{if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),text,path+' stale');else fs.writeFileSync(path,text);};
const claimSpecs=[
 ['femoral-route','A sac neck below the inguinal ligament and medial to the common femoral vein identifies a femoral hernia.','claim.flags3.20261107.groin-compartment'],
 ['direct-route','A groin defect above the inguinal ligament and medial to the inferior epigastric vessels is a direct inguinal defect.','claim.flags3.20261107.direct-comparator'],
 ['inguinal-observation','An informed man with a reducible inguinal hernia that causes absent or minimal symptoms may reasonably choose watchful waiting.','claim.bread-butter.inguinal-hernia.watchful-waiting'],
 ['femoral-repair','A stable reducible femoral hernia calls for elective repair planning rather than extending the selected male inguinal watchful-waiting strategy.','claim.flags3.20261107.reducible-femoral-plan'],
 ['stable-boundary','A spontaneously reducing, painless groin swelling without obstructive symptoms does not establish the emergency described by persistent pain, irreducibility or suspected ischemia.','claim.flags3.20261107.acute-boundary'],
];
const basis=claimSpecs.map(s=>{const b=intake.claims.find(c=>c.id===s[2]);assert(b,s[2]);return b;});
const claims=claimSpecs.map(([suffix,statement,basisId],i)=>({...draft,id:'claim.harden1r2.20261110.'+suffix,statement,
 sourceIds:basis[i].sourceIds,evidenceCategory:basis[i].evidenceCategory,certainty:basis[i].certainty,
 limitation:basis[i].limitation,applicablePopulation:'This constructed stable adult groin case; not an acute reduction, bowel-viability or operative-technique decision.',
 lastCheckedOn:date,basisClaimIds:[basisId],verificationScope:'Offline application of existing recorded claims. Original retrieval dates retained; no new source access, new threshold or new clinical-currentness verification.'}));
const sources=[...new Set(claims.flatMap(c=>c.sourceIds))].map(id=>{
 const s=intake.sources.find(s=>s.id===id);assert(s,id);return {...s,evidenceClaimIds:claims.filter(c=>c.sourceIds.includes(id)).map(c=>c.id),
 intendedUse:'Offline factual synthesis for harden1 round2; original access date and license retained. No source prose, image, table or algorithm copied.',
 originalAccessedOn:s.accessedOn,sourceStatus:'recorded_metadata_no_new_retrieval'};
});
const conceptId='concept.groin-hernia.femoral-defect-repair-priority.v3';
const questionId='question.groin-hernia.ultrasound-type-and-intervention.v3';
const caseId='case.harden1.groin-observation-eligibility.20261110.r2',nodeId='node.harden1.groin-observation-eligibility.20261110.r2';
const labels=[
 ['Femoral hernia; watchful waiting is unsuitable',true,'The marked sac neck follows the femoral canal. Painless spontaneous reduction does not extend the selected male inguinal observation strategy to a femoral hernia; offer elective repair planning.'],
 ['Femoral hernia; watchful waiting is reasonable',false,'This identifies the marked compartment but overgeneralizes the watchful-waiting evidence for selected men with inguinal hernias to femoral anatomy.'],
 ['Direct inguinal hernia; watchful waiting is unsuitable',false,'This assigns the separate cranial defect to the marked swelling and also denies the observation option that can be reasonable for a minimally symptomatic man with a reducible inguinal hernia.'],
 ['Direct inguinal hernia; watchful waiting is reasonable',false,'This is a reasonable classification and observation option for the separate cranial finding. It misattributes that finding to the marked lump, whose neck is in the other compartment.'],
];
const choices=labels.map(([label,isCorrect,rationale],i)=>({id:'choice.harden1r2.20261110.groin.'+(i?'d'+i:'key'),label,isCorrect,rationale,distractorRationale:isCorrect?null:rationale}));
const q={...draft,id:questionId,conceptId,
 stem:"Which hernia accounts for {patientName}'s marked lump, and is watchful waiting appropriate for that hernia?",
 exhibit:{kind:'keyValue',caption:'Targeted groin ultrasound: constructed findings',items:[
  {label:'At the skin marker',value:'A bowel-containing sac has its neck below the inguinal ligament, medial to the common femoral vein. It empties when supine.'},
  {label:'Separate cranial finding',value:'Fat protrudes through a defect above the inguinal ligament, medial to the inferior epigastric vessels.'},
 ]},answerChoices:choices,
 explanation:'The sac at the marker passes below the ligament, medial to the vein: femoral anatomy. The separate cranial defect is direct inguinal.\nA painless reducing course can support watchful waiting for selected men with an inguinal hernia; femoral anatomy instead supports elective repair planning.\nThe nearest error identifies the femoral hernia correctly but extends the inguinal observation rule to it. This is not an emergency exploration or reduction question.',
 supportingEvidenceClaimIds:claims.map(c=>c.id)};
const concept={...draft,id:conceptId,displayName:'Groin compartment and observation eligibility',
 learningObjective:'Attribute a marked groin swelling to the correct ultrasound neck among competing findings, then apply the anatomy-dependent boundary of watchful waiting.',
 earliestFacilityStage:1,conceptType:'management',educationalTier:1,evidenceClaimIds:q.supportingEvidenceClaimIds,
 previousConceptId:'concept.groin-hernia.femoral-defect-repair-priority.v2',
 relatedPreviousConceptIds:['concept.groin-hernia.femoral-defect-repair-priority.v1','concept.groin-ultrasound.proximal-neck-localization.v2'],
 conceptMeaning:'new_version',conceptVersionReason:'The unaccepted acute bowel-viability/exploration objective is replaced by stable symptom-site attribution and observation eligibility with a competing direct defect. Neither the old live separate-node meaning nor the unaccepted acute v2 is silently rescored.',
 historyMigration:'None. Old concepts, questions, source views, frozen encounters and FSRS histories stay exact. This separate candidate is not default-admitted.'};
const mappings=[
 {fields:['exhibit at skin marker','femoral option component','explanation first line'],claimIds:[claims[0].id]},
 {fields:['exhibit separate cranial finding','direct option component','explanation first line'],claimIds:[claims[1].id]},
 {fields:['painless daily activity','spontaneous reduction','inguinal comparator and counterfactual'],claimIds:[claims[2].id]},
 {fields:['key observation boundary','elective repair explanation'],claimIds:[claims[3].id]},
 {fields:['presentation acute-boundary observations','no emergency assertion'],claimIds:[claims[4].id]},
];
const definition={id:'H1-HERNIA-r2',caseId,nodeId,educationalTier:1,acuity:'routine',
 header:{patientName:'Elliot Reed',age:59,sex:'Male',complaint:'Groin lump',presentation:'{patientName}, a 59-year-old man, has an intermittent right groin lump. It is painless during usual activities.'},
 question:q,concept,statementMappings:mappings};
output(root+'question-harden1-round2-20261110-data.ts',`import type {QuestionVariant,ClinicalSource,EvidenceClaim} from "./pilot-schema";\nimport type {SyntheticClinicalRelease} from "./schema";\nexport const QUESTION_HARDEN1_ROUND2_QUESTION:QuestionVariant=${json(q)};\nexport const QUESTION_HARDEN1_ROUND2_CONCEPT:SyntheticClinicalRelease["concepts"][number]&Record<string,unknown>=${json(concept)};\nexport const QUESTION_HARDEN1_ROUND2_DEFINITION=${json(definition)} as const;\nexport const QUESTION_HARDEN1_ROUND2_CLAIMS:(EvidenceClaim&{basisClaimIds:string[];verificationScope:string})[]=${json(claims)};\nexport const QUESTION_HARDEN1_ROUND2_BASIS_CLAIMS:(EvidenceClaim&Record<string,unknown>)[]=${json(basis)};\nexport const QUESTION_HARDEN1_ROUND2_SOURCES:(ClinicalSource&Record<string,unknown>)[]=${json(sources)};\n`);
output(root+'question-harden1-round2-20261110.ts',`import {validateSyntheticClinicalRelease,type SyntheticClinicalCase,type DecisionNode,type AnswerChoiceTimingRegistryEntry} from "./schema";
import {QUESTION_HARDEN1_SOURCE_RELEASE} from "./question-harden1-20261110";
import {QUESTION_HARDEN1_RETAINED_INPUT} from "./question-harden1-retained-input-20261110";
import {QUESTION_HARDEN1_ROUND2_QUESTION as q,QUESTION_HARDEN1_ROUND2_CONCEPT as concept,QUESTION_HARDEN1_ROUND2_DEFINITION as def,QUESTION_HARDEN1_ROUND2_SOURCES as sources} from "./question-harden1-round2-20261110-data";
/** Direct-import preview only. No barrel, manifest, catalog or default insertion. */
export const QUESTION_HARDEN1_ROUND2_SOURCE_VIEW_NAME="harden1-round2" as const;
const original=QUESTION_HARDEN1_RETAINED_INPUT.cases[0]!;
const {selectedInstantiationProfileId:_selection,patientPresentationRevision:_revision,...base}=original;
const sourceLabels=sources.map(s=>s.title);
const answerChoices=q.answerChoices.map(a=>({id:a.id,label:a.label,isCorrect:a.isCorrect,rationale:a.rationale!,serviceRequest:null}));
const node:DecisionNode={id:def.nodeId,questionVariantId:q.id,primaryConceptId:q.conceptId,stem:q.stem,exhibit:q.exhibit!,
 answerChoices,shuffleAnswers:true,explanation:q.explanation,teachingPoint:q.explanation,sourceLabels,resultGateAfter:null,
 terminalDispositions:answerChoices.filter(a=>!a.isCorrect).map(a=>({answerChoiceId:a.id,kind:"no_terminal_outcome" as const,
 consequenceNarrative:"Review the marked compartment and its observation boundary.",clinicalRationale:a.rationale,sourceLabels}))};
const prototypeDemographics={ageYears:def.header.age,sexLabel:def.header.sex};
export const QUESTION_HARDEN1_ROUND2_CASES:SyntheticClinicalCase[]=[{...base,id:def.caseId,displayName:concept.displayName,
 patientDisplayName:def.header.patientName,prototypeDemographics,chiefComplaint:def.header.complaint,presentation:def.header.presentation,
 patientPresentationVariantId:"presentation.harden1r2.20261110.groin",tutorialEligible:false,
 approvedInstantiationProfiles:[{id:"profile.harden1r2.20261110.groin",prototypeDemographics,prototypeVitalSigns:original.prototypeVitalSigns,chiefComplaint:def.header.complaint,presentation:def.header.presentation}],
 decisionNodes:[node],sourceLabels,learningSummary:q.explanation}];
export const QUESTION_HARDEN1_ROUND2_SOURCE_RELEASE=validateSyntheticClinicalRelease({...QUESTION_HARDEN1_SOURCE_RELEASE,
 id:"clinical.harden1-retained-source.20261110.r2",concepts:[...QUESTION_HARDEN1_SOURCE_RELEASE.concepts,{id:concept.id,displayName:concept.displayName,
 learningObjective:concept.learningObjective,earliestFacilityStage:concept.earliestFacilityStage,conceptType:concept.conceptType}],cases:QUESTION_HARDEN1_ROUND2_CASES});
export const QUESTION_HARDEN1_ROUND2_TIMING_ENTRIES:AnswerChoiceTimingRegistryEntry[]=[{caseId:def.caseId,nodeId:def.nodeId,questionVariantId:q.id,classification:{kind:"no_test"}}];
export const QUESTION_HARDEN1_ROUND2_REVIEWS=[{contentVersion:q.contentVersion,reviewStatus:q.reviewStatus,aiAssistedDrafting:true,lastClinicianReview:null,
 id:"review.harden1r2.groin",caseId:def.caseId,educationalTier:1,acuity:"routine",earliestFacilityStage:1,evidenceClaimIds:q.supportingEvidenceClaimIds}];
export const QUESTION_HARDEN1_ROUND2_SOURCE_LINKS=sources.map(s=>({sourceId:s.id,label:s.title,href:s.officialUrl!,target:"_blank",rel:"noopener noreferrer",referrerPolicy:"no-referrer"}));
export {QUESTION_HARDEN1_ROUND2_QUESTION,QUESTION_HARDEN1_ROUND2_CONCEPT,QUESTION_HARDEN1_ROUND2_DEFINITION,
 QUESTION_HARDEN1_ROUND2_CLAIMS,QUESTION_HARDEN1_ROUND2_BASIS_CLAIMS,QUESTION_HARDEN1_ROUND2_SOURCES} from "./question-harden1-round2-20261110-data";
`);
const after=await import('../../packages/clinical-content/src/question-harden1-round2-20261110.ts');
const meta=collectAuthoredMetadata({...prior,...after});
const b=inventoryRelease(prior.QUESTION_HARDEN1_SOURCE_RELEASE,meta),a=inventoryRelease(after.QUESTION_HARDEN1_ROUND2_SOURCE_RELEASE,meta);
const cs=after.QUESTION_HARDEN1_ROUND2_CASES[0],oldCs=prior.QUESTION_HARDEN1_CASES[0];
const display=(c,n)=>({variantId:n.questionVariantId,Presentation:c.presentation.replaceAll('{patientName}',c.patientDisplayName),'Current update':n.currentUpdate??null,Exhibit:n.exhibit??null,
 Task:n.stem.replaceAll('{patientName}',c.patientDisplayName),Options:[...n.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>(a.isCorrect?'**KEY:** ':'')+a.label)});
const pairs=n=>[...n.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>[(a.isCorrect?'**KEY:** ':'')+a.label,a.rationale]);
const findings=a.variants[0].findings;
const responses=[
 {note:'Named vessel can shorten classification by lexical matching.',response:'Two actual neck findings compete and the task specifies the skin marker. Both necessary vascular landmarks remain. The named femoral landmark can still help classification, but cannot choose between the two femoral observation judgments. This residual is acknowledged, not hidden by renaming anatomy.'},
 {note:'Absent mural signal makes exploration obvious independently of classification.',response:'Create a new stable case and objective, not an acute case with a danger finding withheld. Anatomy now changes whether the selected male inguinal watchful-waiting option applies. No independent ischemia trigger dictates the answer.'},
 {note:'Compression reads as a prior failed therapeutic reduction.',response:'No compression or reduction attempt is described. Spontaneous positional emptying is an observation, not a failed treatment or permission statement.'},
 {note:'Bowel configuration is unnecessary once danger findings are present.',response:'Remove partial-wall, lumen and Doppler material. Each ultrasound row now contributes a real competing anatomical interpretation; the task identifies the marked swelling explicitly.'},
 {note:'Joint options are a balanced complete 2x2, not a unique frequency cue.',response:'Retain a complete 2x2. Both classifications and both observation judgments appear twice; no component-frequency or uniquely comprehensive key. The single residual convergence heuristic is reported unsuppressed if emitted.'},
];
const packet=['H1-01','H1-02'].map((id,i)=>({id,title:'Marked groin compartment and observation eligibility',round:2,
 status:'draft_awaiting_independent_review',reviewStatus:'needs_clinician_review',pipelinePassed:false,releaseReady:false,acceptanceAllowed:false,
 caseId,nodeId,conceptId,sourceView:after.QUESTION_HARDEN1_ROUND2_SOURCE_VIEW_NAME,sharedCandidateId:'H1-HERNIA-r2',afterDuplicateForProvenance:i===1,uniqueScoredCandidateCount:1,
 originalFlaggedVariantId:intake.targets[i].node.questionVariantId,keyOrderNotice:'key shown first for review only; runtime answer choices are randomized',
 ownerNote:'The ultrasound findings should prompt the player to identify the hernia type.',ownerNoteResolution:'The player attributes the skin-marked swelling to a raw neck compartment, distinguishing a separate direct defect, then chooses its watchful-waiting eligibility. No type is named before answering.',
 beforeRole:'Unaccepted harden1 round1 shared candidate; preserved byte for byte.',before:display(oldCs,oldCs.decisionNodes[0]),after:display(cs,cs.decisionNodes[0]),
 rationalePairs:{before:pairs(oldCs.decisionNodes[0]),after:pairs(cs.decisionNodes[0])},explanation:{before:oldCs.decisionNodes[0].explanation,after:q.explanation},
 inference:'Identify which reported neck corresponds to the marker; then apply the compartment-specific boundary of watchful waiting despite painless reduction.',
 focus:'The marked neck, not the separate cranial defect or the painless course, identifies the condition whose observation eligibility is being judged.',
 whatChanged:'New stable competing-finding case and materially changed v3 objective; no emergency, failed reduction or independent Doppler shortcut. The live classification/management pair remains exact and accepted phosphate is not edited.',
 reviewResponse:responses,holdStatus:'none',sourceVerificationHold:null,supportingEvidenceClaimIds:q.supportingEvidenceClaimIds,
 selfCheck:{reviewer:'author; not independent review or Melissa Rowland clinical sign-off',manualReviewCompleted:true,
  coverTheKey:{attack:'Named vascular landmarks are retained, with a different actual neck at the marker and at the separate cranial defect. The femoral landmark can assist classification, but leaves both observation judgments. All four options combine a classification and the same observation decision; painless reduction tempts overextension of inguinal observation evidence.',rawLintWarnings:findings},
  sameDecisionStageAndCategory:'All four are a named groin diagnosis plus the suitability of the same watchful-waiting strategy; no diagnostic test versus treatment mixture.',
  reasoningSteps:['Attribute the marked sac using its neck, distinguishing a real separate cranial defect.','Decide whether the inguinal observation evidence applies to the marked compartment in this man.'],
  closestCredibleError:'Femoral hernia; watchful waiting is reasonable: recognizes the anatomy but overextends selected male inguinal observation evidence.',
  decidingFinding:'The skin-marked sac neck is below the ligament and medial to the vein; the clinically reassuring reduction does not change its compartment.',
  counterfactuals:[{change:'Move the skin marker to the separate cranial defect and keep the painless reducing course.',result:'Direct inguinal hernia; watchful waiting is reasonable. The task asks eligibility, not whether elective repair could also be offered.'},
   {change:'Remove both anatomical neck rows.',result:'Neither diagnosis is established; the item becomes unanswerable and must be withheld.'},
   {change:'Keep the marked femoral neck but remove the positional-emptying row.',result:'The elective observation question loses its stable reducibility context; do not infer normal perfusion or a failed reduction.'}],
  residentDifficulty:{predicted:'moderate',measured:false,reason:'Competing anatomically genuine findings and inappropriate generalization of a reasonable management strategy; urgency cannot bypass classification.',residual:'Canonical landmark recognition may still make this easy for experienced residents. This is an author prediction for independent review, not a passed hardening claim.'},
  singleDefensibleBestAnswer:'The marked femoral compartment is not the selected inguinal watchful-waiting population. Asking eligibility avoids two defensible inguinal options (observation and elective repair).',
  deletionTest:'Name/age/sex are presentation requirements. Symptom function and spontaneous reduction define the observation comparator; skin marker identifies the target; separate defect supplies the nearest credible misattribution. No caregiver, availability, permission, failed-reduction or patient-preference cue.',
  basicAccepted:false,requiresIndependentReview:true},
 conceptVersion:{meaning:'new_version',newConceptId:conceptId,previousConceptIds:[concept.previousConceptId,...concept.relatedPreviousConceptIds],reason:concept.conceptVersionReason,historyMigration:concept.historyMigration},
 lint:{version:a.linterVersion,before:b.variants.find(v=>v.questionVariantId===oldCs.decisionNodes[0].questionVariantId).findings,after:findings,suppressedFindings:0,
  advisoryDisposition:'A complete balanced 2x2 has no uniquely frequent component. Raw heuristic results retained; no linter rule or budget relaxed.'},
 fallback:{variantId:intake.targets[i].node.questionVariantId,conceptId:intake.targets[i].node.primaryConceptId,caseId:intake.targets[i].clinicalCase.id,nodeId:intake.targets[i].node.id,policy:'Keep exact current accepted flags3 pair unless this separately reviewed draft is accepted.'},
 frozenPreservation:{sourceReleaseSha256:sha(after.QUESTION_HARDEN1_ROUND2_SOURCE_RELEASE),candidateCaseSha256:sha(cs),candidateQuestionSha256:sha(q),previousRoundSourceSha256:sha(prior.QUESTION_HARDEN1_SOURCE_RELEASE)},
}));
output('docs/research/question-harden1-round2-20261110.json',json(packet)+'\n');
output('docs/research/sources-question-harden1-round2-20261110.json',json({checkedOn:date,verificationScope:'Offline recorded-fact reuse only; no network performed. Bibliographic metadata and atomic repository-authored claims, not external source text.',
 clinicalSignoff:'None; Melissa Rowland is the named clinical sign-off.',sources,claims,basisClaims:basis,mappings,items:[{id:'H1-HERNIA-r2',holdStatus:'none',keyedHold:false}],
 limitations:['Femoral repair direction has one adequate recorded society guideline; the update cross-checks inguinal observation, not an independent new femoral risk estimate.','Direct-compartment comparator has one recorded anatomical review.','Original access dates retained. No assertion that sources were newly accessed or searched for currentness.','Constructed coexistence and skin-marker observations are fictional, not copied case data, risks or test-performance claims.']} )+'\n');
output('tools/question-quality/question-harden1-round2-lint-20261110.json',json({checkedOn:date,uniqueCandidates:1,reviewRows:2,before:b,after:a,suppressedFindings:0})+'\n');
console.log(json({uniqueCandidates:1,reviewRows:2,newConcept:conceptId,rawFindings:findings,firstRoundSourceSha256:sha(prior.QUESTION_HARDEN1_SOURCE_RELEASE),candidateSourceSha256:sha(after.QUESTION_HARDEN1_ROUND2_SOURCE_RELEASE)}));
