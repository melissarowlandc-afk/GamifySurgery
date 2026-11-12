import fs from 'node:fs';
import assert from 'node:assert/strict';
import {intake,specs,draft,claims,sources,basisClaims} from './question-harden1-spec-20261110.mjs';
const json=x=>JSON.stringify(x,null,2);
const root='packages/clinical-content/src/';
const oldCases=[...new Map(intake.targets.map(t=>[t.clinicalCase.id,t.clinicalCase])).values()];
const oldIds=new Set(oldCases.flatMap(cs=>cs.decisionNodes.map(n=>n.primaryConceptId)));
const retained={id:'clinical.harden1-retained-input.20261110.v1',publicationStatus:'synthetic_unapproved_prototype',schemaVersion:1,
 disclaimer:'Synthetic educational prototype. Not clinically approved and not medical advice.',
 concepts:[...oldIds].map(id=>{const c=intake.concepts.find(c=>c.id===id);return Object.fromEntries(['id','displayName','learningObjective','earliestFacilityStage','conceptType'].map(k=>[k,c[k]]));}),cases:oldCases};
const definitions=specs.map(s=>({auditId:s.id,originalTargetIds:s.originalTargetIds,caseId:s.caseId,nodeId:s.nodeId,
 header:{patientName:s.patientName,age:s.age,sex:s.sex,complaint:s.complaint,presentation:s.presentation},currentUpdate:s.currentUpdate,
 educationalTier:s.educationalTier,acuity:s.acuity,
 question:{...draft,id:s.variantId,conceptId:s.conceptId,stem:s.task,exhibit:s.exhibit,
  answerChoices:s.options.map(([label,rationale],i)=>({id:'choice.harden1.20261110.'+(s.id==='H1-HERNIA'?'groin':'phosphate')+'.'+(i===0?'key':'d'+i),label,isCorrect:i===0,rationale,distractorRationale:i===0?null:rationale})),
  explanation:s.explanation,supportingEvidenceClaimIds:s.claims},
 concept:{...draft,id:s.conceptId,displayName:s.displayName,learningObjective:s.objective,conceptType:s.conceptType,earliestFacilityStage:s.earliestFacilityStage,
  educationalTier:s.educationalTier,evidenceClaimIds:s.claims,previousConceptId:s.previousConceptIds[0],relatedPreviousConceptIds:s.previousConceptIds.slice(1),
  conceptMeaning:'new_version',conceptVersionReason:s.versionReason,historyMigration:'None. Old definitions, FSRS cards, frozen encounters and saves remain intact; candidate-only version is separately scored if accepted.'},
}));
const mapping=specs.map(s=>({...draft,caseId:s.caseId,questionVariantId:s.variantId,evidenceClaimIds:s.claims,
 fields:s.id==='H1-HERNIA'?[
  {field:'presentation / ultrasound bowel at neck / compression',claimIds:[s.claims[2]],kind:'Original qualitative constructed observations',limitation:'No copied case, disease-selection weight, probability, exact duration or published image.'},
  {field:'ultrasound sac neck / anatomy labels and rationales',claimIds:s.claims.slice(0,2),kind:'Anatomical interpretation',limitation:'The neck, not superficial lump location, determines type.'},
  {field:'ultrasound Doppler / urgency / explanation',claimIds:s.claims.slice(2,5),kind:'Evaluation and urgency synthesis',limitation:'Concern for strangulation; no claim of proven necrosis or diagnostic accuracy.'},
  {field:'manual-reduction comparator / author counterfactual',claimIds:[s.claims[5]],kind:'Verified management boundary',limitation:'Counterfactual changes the full clinical/imaging assessment of strangulation concern; detectable Doppler alone does not exclude strangulation.'},
 ]:[
  {field:'presentation / simultaneous pretreatment table',claimIds:[s.claims[0],s.claims[1],s.claims[2]],kind:'Original finite synthetic observations',limitation:'1.0/10/1.0/20 mg/dL are constructed paired concentrations, not a threshold, study dataset or clinical performance estimate. Stable creatinine and pretreatment timing constrain interpretation.'},
  {field:'key / rationales / worked fraction',claimIds:s.claims.slice(0,2),kind:'Source-supported formula and independent arithmetic',limitation:'50% is derived from original inputs; no laboratory reference-range boundary is needed for this remote result.'},
  {field:'feedback / concurrent contributors',claimIds:s.claims.slice(2),kind:'Diagnostic boundary',limitation:'No exclusive cause or refeeding syndrome diagnosis, treatment, timing rule or new management protocol.'},
 ],demographicBasis:'Fictional name; canonical age, sex and neutral vitals retained from the exact live source. No sex-specific risk or disease probability inferred.'}));
const outputs=[
 [root+'question-harden1-retained-input-20261110.ts',`import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";\n/** Immutable exact live source at intake. Authoring comparison only. */\nexport const QUESTION_HARDEN1_RETAINED_INPUT:SyntheticClinicalRelease=${json(retained)};\nexport const QUESTION_HARDEN1_RETAINED_TIMINGS:AnswerChoiceTimingRegistryEntry[]=${json(intake.targets.flatMap(t=>t.timing))};\n`],
 [root+'question-harden1-evidence-20261110.ts',`import type {ClinicalSource,EvidenceClaim} from "./pilot-schema";\nexport const QUESTION_HARDEN1_CLAIMS:(EvidenceClaim&{basisClaimIds:string[];verificationScope:string})[]=${json(claims)};\nexport const QUESTION_HARDEN1_BASIS_CLAIMS:(EvidenceClaim&Record<string,unknown>)[]=${json(basisClaims)};\nexport const QUESTION_HARDEN1_SOURCES:(ClinicalSource&{sourceStatus:string;intendedUse:string;originalAccessedOn?:string})[]=${json(sources)};\n`],
 [root+'question-harden1-20261110-data.ts',`import type {QuestionVariant} from "./pilot-schema";\nimport type {SyntheticClinicalRelease} from "./schema";\nexport interface Harden1Definition {auditId:string;originalTargetIds:string[];caseId:string;nodeId:string;header:{patientName:string;age:number;sex:"Male"|"Female";complaint:string;presentation:string};currentUpdate:string|null;educationalTier:number;acuity:string;question:QuestionVariant;concept:SyntheticClinicalRelease["concepts"][number]&{reviewStatus:"needs_clinician_review";contentVersion:string;aiAssistedDrafting:boolean;lastClinicianReview:null;educationalTier:number;evidenceClaimIds:string[];previousConceptId:string;relatedPreviousConceptIds:string[];conceptMeaning:string;conceptVersionReason:string;historyMigration:string};}\nexport const QUESTION_HARDEN1_DEFINITIONS:Harden1Definition[]=${json(definitions)};\nexport const QUESTION_HARDEN1_STATEMENT_MAPPINGS=${json(mapping)} as const;\n`],
];
for(const [path,text] of outputs){if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),text,path+' stale');else fs.writeFileSync(path,text);}
console.log(JSON.stringify({uniqueCandidates:definitions.length,originalTargets:intake.targets.length,newConceptVersions:definitions.map(d=>d.concept.id),claims:claims.length,sources:sources.length,retainedCases:oldCases.length}));
