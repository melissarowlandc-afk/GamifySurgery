import fs from 'node:fs';
import assert from 'node:assert/strict';
import {intake,specs,methods,draft} from './question-stats1-specs-20261108.mjs';
const prefix='packages/clinical-content/src/';
const emit=(path,value)=>{if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),value,path+' stale');else fs.writeFileSync(path,value);};
const claimId=id=>'claim.stats1.20261108.'+id;
const basisIds=new Set(Object.values(methods).flatMap(m=>m.basisClaimIds));
const basis=[...basisIds].map(id=>{const old=intake.claims.find(c=>c.id===id);assert(old,'Missing basis '+id);return old;});
const claim=(id,statement,basisClaimIds)=>({...draft,id,statement,basisClaimIds,
 sourceIds:[...new Set(basisClaimIds.flatMap(id=>basis.find(c=>c.id===id).sourceIds))],evidenceCategory:'definition',certainty:'moderate',
 limitation:'Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.',
 applicablePopulation:'Only the labelled constructed statistics exercises and explicitly stated assumptions.',lastCheckedOn:'2026-11-08',
 verificationScope:'Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check.'});
const claims=[...Object.entries(methods).map(([id,m])=>claim(claimId(id),m.statement,m.basisClaimIds)),
 ...specs.map(s=>claim(claimId(s.id.toLowerCase()+'.application'),s.application,[...new Set(s.ruleIds.flatMap(id=>methods[id].basisClaimIds))]))];
const sourceIds=new Set(claims.flatMap(cl=>cl.sourceIds));
const sources=[...sourceIds].map(id=>{
 const old=intake.sources.find(s=>s.id===id);assert(old,'Missing source '+id);
 return {...old,...draft,sourceStatus:'recorded_source_reused_offline_not_reaccessed',
  evidenceClaimIds:[...new Set([...old.evidenceClaimIds,...claims.filter(cl=>cl.sourceIds.includes(id)).map(cl=>cl.id)])],
  supportedNewClaimIds:claims.filter(cl=>cl.sourceIds.includes(id)).map(cl=>cl.id),
  intendedUse:'Statistical method/definition verification and explicitly constructed arithmetic only. No reproduced source prose, figure, table or algorithm; original source access dates retained.'};
});
const sourceLinks=sources.filter(s=>s.officialUrl).map(s=>({...draft,id:'link.stats1.'+s.id.replace(/^source\./,''),sourceId:s.id,label:s.title,href:s.officialUrl,target:'_blank',rel:'noopener noreferrer',referrerPolicy:'no-referrer'}));
emit(prefix+'question-stats1-evidence-20261108.ts',
 'import type {EvidenceClaim,ClinicalSource} from "./pilot-schema";\n'+
 'export const QUESTION_STATS1_CLAIMS:(EvidenceClaim&{basisClaimIds:string[];verificationScope:string})[]='+JSON.stringify(claims,null,2)+';\n'+
 'export const QUESTION_STATS1_BASIS_CLAIMS:(EvidenceClaim&Record<string,unknown>)[]='+JSON.stringify(basis,null,2)+';\n'+
 'export const QUESTION_STATS1_SOURCES:(ClinicalSource&{sourceStatus:string;supportedNewClaimIds:string[];intendedUse:string})[]='+JSON.stringify(sources,null,2)+';\n'+
 'export const QUESTION_STATS1_SOURCE_LINKS='+JSON.stringify(sourceLinks,null,2)+' as const;\n');
const active=new Set(intake.targets.map(t=>t.node.primaryConceptId));
const retained={...intake.releaseHeader,id:'clinical.stats1-retained-input.20261108.v1',
 concepts:[...active].map(id=>{const old=intake.concepts.find(c=>c.id===id);assert(old);return {id:old.id,displayName:old.displayName,learningObjective:old.learningObjective,earliestFacilityStage:old.earliestFacilityStage,conceptType:old.conceptType};}),
 cases:intake.targets.map(t=>t.clinicalCase)};
emit(prefix+'question-stats1-retained-input-20261108.ts',
 'import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";\n'+
 '/** Exact current live source at stats1 intake. Never an acceptance. */\n'+
 'export const QUESTION_STATS1_RETAINED_INPUT:SyntheticClinicalRelease='+JSON.stringify(retained,null,2)+';\n'+
 'export const QUESTION_STATS1_RETAINED_TIMINGS:AnswerChoiceTimingRegistryEntry[]='+JSON.stringify(intake.targets.flatMap(t=>t.timing),null,2)+';\n');
const female=['Maya Patel','Hannah Lewis','Claire Bennett','Nora Brooks','Audrey Hayes','Elena Reed'];
const male=['Daniel Reed','Samuel Brooks','Owen Miller','Lucas Hayes','Gavin Price','Nathan Brooks'];
const definitions=specs.map(s=>{
 const old=intake.targets.find(t=>t.id===s.id),employee=!!old.clinicalCase.participant;
 const demographics=old.clinicalCase.prototypeDemographics;
 assert(employee||demographics,'Patient frame needs retained age/sex');
 const patientName=employee?'Jordan Ellis':!old.clinicalCase.patientDisplayName.includes('{')?old.clinicalCase.patientDisplayName:
  (demographics.sexLabel==='Female'?female:male)[Number(s.id.slice(1))%6];
 const presentation=employee?'{patientName} reviews study data.':
  `{patientName}, ${demographics.ageYears} ${demographics.sexLabel==='Female'?'F':'M'}, reviews study data in clinic.`;
 const ids=[...s.ruleIds.map(claimId),claimId(s.id.toLowerCase()+'.application')];
 const question={...draft,id:s.variantId,conceptId:s.conceptId,stem:s.task,
  answerChoices:s.options.map(([label,rationale],i)=>({id:'choice.stats1.20261108.'+s.id.toLowerCase()+'.'+(i?'d'+i:'key'),label,isCorrect:i===0,rationale,distractorRationale:i?rationale:null})),
  exhibit:s.exhibit,explanation:s.explanationLines.join('\n'),supportingEvidenceClaimIds:ids};
 return {auditId:s.id,title:s.title,family:s.family,caseId:old.clinicalCase.id,nodeId:old.node.id,
  questionVariantId:s.variantId,question,originalVariantId:old.node.questionVariantId,originalConceptId:old.node.primaryConceptId,
  conceptMeaning:s.meaning,conceptVersionReason:s.versionReason,employeeDiscussion:employee,patientName,presentation,
  ...(demographics?{demographics}:{}),skill:s.skill,focus:s.focus,educationalIntent:s.educationalIntent,holdStatus:s.holdStatus};
});
const authoringConcepts=[...active].map(id=>{
 const old=intake.concepts.find(c=>c.id===id);return {...old,...draft,
  evidenceClaimIds:[...new Set(definitions.filter(r=>r.question.conceptId===id).flatMap(r=>r.question.supportingEvidenceClaimIds))],
  conceptMeaning:'same',conceptVersionReason:'Focused single-skill variants remain within the existing statistics objective; stable IDs and old FSRS histories remain attached.',historyMigration:'None; no history transfer, selector change or acceptance.'};
});
emit(prefix+'question-stats1-20261108-data.ts',
 'import type {QuestionVariant} from "./pilot-schema";\n'+
 'export interface Stats1Definition {auditId:string;title:string;family:string;caseId:string;nodeId:string;questionVariantId:string;question:QuestionVariant;originalVariantId:string;originalConceptId:string;conceptMeaning:string;conceptVersionReason:string;employeeDiscussion:boolean;patientName:string;presentation:string;demographics?:{ageYears:number;sexLabel:"Female"|"Male"|"Not specified"};skill:string;focus:string;educationalIntent:string;holdStatus:string;}\n'+
 'export const QUESTION_STATS1_DEFINITIONS:Stats1Definition[]='+JSON.stringify(definitions,null,2)+';\n'+
 'export const QUESTION_STATS1_AUTHORING_CONCEPTS='+JSON.stringify(authoringConcepts,null,2)+' as const;\n');
console.log(JSON.stringify({questions:definitions.length,concepts:active.size,employeeDiscussions:definitions.filter(r=>r.employeeDiscussion).length,patientCases:definitions.filter(r=>!r.employeeDiscussion).length,
 claims:claims.length,basisClaims:basis.length,sources:sources.length,retainedCases:retained.cases.length},null,2));
