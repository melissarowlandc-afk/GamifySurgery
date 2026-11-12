import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {items} from './items.mjs';
const dir='.local-dev/question-new-n4-20261110';
const recorded=JSON.parse(fs.readFileSync(dir+'/recorded-catalog.json','utf8'));
const sha=s=>createHash('sha256').update(s).digest('hex');
const draft={contentVersion:'clinical.question-new-n4.2026-11-10.v1',reviewStatus:'needs_clinician_review',aiAssistedDrafting:true,lastClinicianReview:null};
const ids=[...new Set(items.flatMap(i=>i.basisClaimIds))].sort();
const basis=ids.map(id=>{const c=recorded.claims.find(c=>c.id===id);assert.ok(c,id);return c;});
for(const i of items)for(const id of i.keyBasisClaimIds){const c=basis.find(c=>c.id===id);assert.ok(c,id);
 assert.ok(!/key hold|directly verify|before acceptance|requires.*verif/i.test(c.limitation||''),'Do not author an unverified key: '+id);}
const claims=basis.map(c=>({...c,...draft,id:'claim.n4.'+sha(c.id).slice(0,12)}));
const provenance=basis.map((c,i)=>({claimId:claims[i].id,inheritedClaimId:c.id,inheritedContentVersion:c.contentVersion,
 inheritedLastCheckedOn:c.lastCheckedOn,localMappingCheckedOn:'2026-11-10',statementUnchanged:true,
 sourceRetrieval:false,verificationDateRefreshed:false,
 context:'N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.',
 verificationBasis:'Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation.'}));
const sourceIds=[...new Set(claims.flatMap(c=>c.sourceIds))].sort();
const sources=sourceIds.map(id=>{const s=recorded.sources.find(s=>s.id===id);assert.ok(s,id);
 for(const f of ['completeCitation','organizationOrJournal','authors','accessedOn','sourceClass','licenseLabel','reuseStatus','authorityAssessment','usageRole'])assert.ok(s[f],id+':'+f);
 assert.ok(s.officialUrl||s.doi);
 return {...s,...draft,evidenceClaimIds:[...new Set([...s.evidenceClaimIds,...claims.filter(c=>c.sourceIds.includes(id)).map(c=>c.id)])]};});
const links=sources.map(s=>({...draft,id:'link.n4.'+sha(s.id).slice(0,12),sourceId:s.id,label:s.title,
 href:s.officialUrl??'https://doi.org/'+s.doi,target:'_blank',rel:'noopener noreferrer',referrerPolicy:'no-referrer'}));
// Preserve inherited verification/terms fields outside the minimal interfaces;
// required claim/source fields remain statically checked, without discarding
// rights or provenance metadata and without changing the clinical schema.
const data=[['QUESTION_NEW_N4_CLAIMS','Array<EvidenceClaim & Record<string,unknown>>',claims],['QUESTION_NEW_N4_BASIS_CLAIMS','Array<EvidenceClaim & Record<string,unknown>>',basis],
 ['QUESTION_NEW_N4_CLAIM_PROVENANCE',null,provenance],['QUESTION_NEW_N4_SOURCES','Array<ClinicalSource & Record<string,unknown>>',sources],['QUESTION_NEW_N4_SOURCE_LINKS',null,links]];
const file='packages/clinical-content/src/question-new-n4-evidence-20261110.ts';
fs.writeFileSync(file,'// Generated from recorded permitted metadata; no retrieval, date refresh or clinical approval.\nimport type {ClinicalSource,EvidenceClaim} from "./pilot-schema";\n\n'+data.map(([name,type,value])=>'export const '+name+(type?':'+type:'')+' = '+JSON.stringify(value,null,2)+';\n').join('\n'));
// Snapshot exact reused concepts and child art contracts, avoiding a default-
// release import from the candidate runtime module.
const n=await import('../../packages/clinical-content/src/index.ts');
const reused=[...new Set(items.filter(i=>i.conceptRelation==='existing_meaning_variant').map(i=>i.conceptId))].map(id=>{
 const c=n.QUESTION_CATALOG_RELEASE.concepts.find(c=>c.id===id);assert.ok(c,'Existing concept '+id);return c;});
const families=items.filter(i=>i.familyBasisCaseId).map(i=>{
 const old=n.PEDIATRIC_CLINIC_FAMILY_CONTEXTS.find(f=>f.caseId===i.familyBasisCaseId);assert.ok(old,i.slug);
 assert.equal(old.childName,i.name);assert.equal(old.prototypeDemographics.ageYears,i.age);assert.equal(old.prototypeDemographics.sexLabel,i.sex);
 return {...old,...draft,id:`family.n4.${i.slug}.v1`,phenotypeId:`phenotype.n4.${i.slug}.v1`,caseId:`case.n4.${i.slug}.v1`,profileId:`profile.n4.${i.slug}.v1`,
  evidenceClaimIds:i.basisClaimIds.map(id=>provenance.find(p=>p.inheritedClaimId===id).claimId),
  agentReview:{authority:'Manager-delegated editorial authoring',reviewedOn:'2026-11-10',clinicianSignOff:false,
   scope:'Exact existing child/parent/art contract reused; no clinical approval, source retrieval or default registration.'},
  basisCaseId:old.caseId,basisProfileId:old.profileId};});
const ref='packages/clinical-content/src/question-new-n4-reference-bindings.ts';
fs.writeFileSync(ref,'// Exact editorial/concept snapshots for an explicit draft; not installed into defaults.\nimport type {TestedConcept} from "./schema";\n\n'+
 'export const QUESTION_NEW_N4_REUSED_CONCEPTS:TestedConcept[] = '+JSON.stringify(reused,null,2)+';\n\n'+
 'export const QUESTION_NEW_N4_FAMILY_BINDINGS = '+JSON.stringify(families,null,2)+';\n');
console.log(JSON.stringify({items:items.length,claims:claims.length,sources:sources.length,reusedConcepts:reused.length,families:families.length,newFacts:0,retrievals:0,files:[file,ref]}));
