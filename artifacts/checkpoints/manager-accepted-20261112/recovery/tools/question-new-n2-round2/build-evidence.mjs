import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {extraClaims} from './extra-claims.mjs';
const old=await import('../../packages/clinical-content/src/question-new-n2-20261104.ts');
const revisions=[];
for(const group of ['perioperative','abdominal','specialty','research']){
 const m=await import(`../../packages/clinical-content/src/question-new-n2-round2-${group}.ts`);
 revisions.push(...m['QUESTION_NEW_N2_ROUND2_'+group.toUpperCase()]);
}
assert.equal(revisions.length,37);const bySlug=new Map(revisions.map(r=>[r.slug,r]));assert.equal(bySlug.size,37);
const dir='.local-dev/question-new-n2-round2-20261104';
const catalog=JSON.parse(fs.readFileSync(dir+'/recorded-catalog.json','utf8'));
const baseline=JSON.parse(fs.readFileSync(dir+'/baseline.json','utf8'));
for(const pass of baseline.frozenPasses)assert.ok(!bySlug.has(pass.caseId.replace(/^case\.n2\./,'').replace(/\.v1$/,'')));
const draft={contentVersion:'clinical.question-new-n2.2026-11-04.v2',reviewStatus:'needs_clinician_review',aiAssistedDrafting:true,lastClinicianReview:null};
const originalClaims=new Map(old.QUESTION_NEW_N2_CLAIM_PROVENANCE.map(p=>[p.inheritedClaimId,old.QUESTION_NEW_N2_CLAIMS.find(c=>c.id===p.claimId)]));
const inherited=new Map(catalog.claims.map(c=>[c.id,c]));
const existing=id=>originalClaims.get(id)??inherited.get(id);
const sourcesById=new Map(catalog.sources.map(s=>[s.id,s]));
for(const s of old.QUESTION_NEW_N2_SOURCES)sourcesById.set(s.id,s);
const publicationKey=s=>s.doi?`doi:${s.doi.toLowerCase()}`:`url:${s.officialUrl?.split(/[?#]/)[0]??s.id}`;
const hash=s=>createHash('sha256').update(s).digest('hex').slice(0,12);
const requested=[...new Set(old.QUESTION_NEW_N2_ITEMS.flatMap(i=>(bySlug.get(i.slug)?.item??i).existingClaimIds))].sort();
const claims=[],provenance=[];
for(const id of requested){
 const spec=extraClaims.find(c=>c.id===id);
 if(spec){
  const basis=spec.basis.map(id=>{const c=existing(id);assert.ok(c,`Missing basis ${id}`);return {requestedId:id,record:c};});
  const sourceIds=[...new Set(basis.flatMap(b=>b.record.sourceIds))];
  claims.push({...draft,id,statement:spec.statement,sourceIds,evidenceCategory:spec.evidenceCategory,certainty:'moderate',
   limitation:`${spec.derivation} No source was retrieved or externally rechecked in this round. Author application remains pending independent and clinical review.`,
   applicablePopulation:'Only the explicitly scoped constructed N2 round-two teaching cases; not an observed clinical rate, bedside algorithm or validated study protocol.',lastCheckedOn:'2026-11-04'});
  provenance.push({claimId:id,inheritedClaimId:id,statementUnchanged:false,checkedLocallyOn:'2026-11-04',synthesisKind:spec.kind,
   basisClaimIds:spec.basis,basisChecks:basis.map(b=>({id:b.requestedId,recordId:b.record.id,lastCheckedOn:b.record.lastCheckedOn,contentVersion:b.record.contentVersion})),
   derivation:spec.derivation,sourcePublicationKeys:[...new Set(sourceIds.map(s=>publicationKey(sourcesById.get(s))))],
   externalVerification:'No new retrieval or external check. Local synthesis date is not source currentness/access verification.',
   sourceHold:spec.kind==='clinical_extension_needs_targeted_verification'?'Exact new clinical extension requires targeted source verification and clinician sign-off.':'Exact constructed application still requires clinical/editorial review; mathematical identities are explicitly derived.'});
 }else{
  const record=existing(id);assert.ok(record,`No recorded support for ${id}`);
  const original=originalClaims.get(id);
  const evidenceKeys=new Set(['contentVersion','reviewStatus','aiAssistedDrafting','lastClinicianReview','id','statement','sourceIds','evidenceCategory','certainty','limitation','applicablePopulation','lastCheckedOn']);
  const supportedFields=Object.fromEntries(Object.entries(record).filter(([key])=>evidenceKeys.has(key)));
  const claim=original?structuredClone(supportedFields):{...supportedFields,...draft,id:`claim.n2r2.${hash(id)}`,
   limitation:[record.limitation,'Statement unchanged from the recorded catalog; original source/check dates retained, no external currentness verification. Exact revised-case application needs clinical review.'].filter(Boolean).join(' ')};
  claims.push(claim);
  provenance.push({claimId:claim.id,inheritedClaimId:id,statementUnchanged:true,
   inheritedContentVersion:record.contentVersion,inheritedLastCheckedOn:record.lastCheckedOn,checkedLocallyOn:'2026-11-04',
   reuseKind:original?'Original N2 EvidenceClaim fields retained; auxiliary derivation kept in provenance':'Unchanged recorded statement under separate round-two draft metadata',
   inheritedAuxiliaryMetadata:Object.fromEntries(Object.entries(record).filter(([key])=>!evidenceKeys.has(key))),
   sourcePublicationKeys:[...new Set(claim.sourceIds.map(s=>publicationKey(sourcesById.get(s))))],
   externalVerification:'Original access/check dates retained. No new retrieval.'});
 }
}
const sourceIds=[...new Set(claims.flatMap(c=>c.sourceIds))].sort();
const sources=sourceIds.map(id=>{const s=sourcesById.get(id);assert.ok(s,`Missing actual source record ${id}`);return {...s,...draft,
 evidenceClaimIds:claims.filter(c=>c.sourceIds.includes(id)).map(c=>c.id),
 reuseNotes:`${s.reuseNotes??''} N2 round two reuses bibliographic metadata and independently written atomic facts; original access dates retained. No source text, figure, table or algorithm retrieved/copied. New clinical extensions have explicit exact-source holds; local synthesis is not external verification.`};});
const target='packages/clinical-content/src/question-new-n2-round2-evidence-20261104.ts';
fs.writeFileSync(target,'// Offline generated by tools/question-new-n2-round2/build-evidence.mjs.\n// Inherited dates retained; explicit local syntheses disclose their basis and verification holds.\n'+
 'import type {ClinicalSource,EvidenceClaim} from "./pilot-schema";\n'+
 `export const QUESTION_NEW_N2_ROUND2_CLAIMS: EvidenceClaim[] = ${JSON.stringify(claims,null,2)};\n`+
 `export const QUESTION_NEW_N2_ROUND2_SOURCES: ClinicalSource[] = ${JSON.stringify(sources,null,2)};\n`+
 `export const QUESTION_NEW_N2_ROUND2_CLAIM_PROVENANCE = ${JSON.stringify(provenance,null,2)} as const;\n`);
console.log(JSON.stringify({revisions:37,claims:claims.length,sources:sources.length,localSyntheses:provenance.filter(p=>!p.statementUnchanged).length,clinicalExtensionHolds:provenance.filter(p=>p.synthesisKind==='clinical_extension_needs_targeted_verification').map(p=>p.claimId),target},null,2));
