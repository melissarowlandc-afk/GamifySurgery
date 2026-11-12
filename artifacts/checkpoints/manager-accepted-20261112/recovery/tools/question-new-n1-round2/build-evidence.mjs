import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const original=await import('../../packages/clinical-content/src/question-new-n1-20261104.ts');
const {QUESTION_NEW_N1_ROUND2_ABDOMINAL:a}=await import('../../packages/clinical-content/src/question-new-n1-round2-abdominal.ts');
const {QUESTION_NEW_N1_ROUND2_BREAST:b}=await import('../../packages/clinical-content/src/question-new-n1-round2-breast.ts');
const {QUESTION_NEW_N1_ROUND2_PERIOPERATIVE:p}=await import('../../packages/clinical-content/src/question-new-n1-round2-perioperative.ts');
const revisions=[...a,...b,...p],bySlug=new Map(revisions.map(r=>[r.slug,r]));
assert.equal(revisions.length,38);assert.equal(bySlug.size,38);
const dir='.local-dev/question-new-n1-round2-20261104';
const catalog=JSON.parse(fs.readFileSync(`${dir}/recorded-catalog.json`,'utf8'));
const baseline=JSON.parse(fs.readFileSync(`${dir}/baseline.json`,'utf8'));
assert.ok(baseline.frozenPasses.every(r=>!bySlug.has(r.item.slug)));
const requested=[...new Set(original.QUESTION_NEW_N1_ITEMS.flatMap(i=>(bySlug.get(i.slug)?.item??i).existingClaimIds))].sort();
const draft={contentVersion:'clinical.question-new-n1.2026-11-04.v2',reviewStatus:'needs_clinician_review',aiAssistedDrafting:true,lastClinicianReview:null};
const additions=[
  {id:'claim.n1r2.target-representation',statement:'A sample documented to come from a different anatomical target does not establish the tissue diagnosis of the intended unsampled target.',
    basis:['claim.gs028f.neck.imaging-versus-tissue-diagnosis','claim.breast-imaging.suspicion-is-not-tissue-diagnosis'],category:'evaluation',
    method:'Observation-bound logical synthesis from recorded tissue-versus-imaging claims; no new biopsy threshold or universal adequacy algorithm.'},
  {id:'claim.n1r2.named-methimazole',statement:'Methimazole is an antithyroid medicine that reduces thyroid-hormone synthesis.',
    basis:['claim.graves-rai-appropriate-candidate.rai-treatment-role'],category:'definition',
    method:'Named example of the recorded antithyroid-drug class. New offline naming synthesis; exact named-drug support was not newly retrieved and requires targeted verification before clinical approval.'},
  {id:'claim.n1r2.named-propranolol',statement:'Propranolol is a beta-adrenergic blocking medicine used for adrenergic symptoms of thyroid-hormone excess.',
    basis:['claim.graves-rai-appropriate-candidate.rai-treatment-role'],category:'definition',
    method:'Named example of the recorded beta-blocker symptom-control class. New offline naming synthesis; no claim that all doses lack other thyroid effects. Targeted named-drug verification remains a clinical/source hold.'},
  {id:'claim.n1r2.named-enoxaparin-role',statement:'Enoxaparin is used in distinct preventive and therapeutic anticoagulation regimens; a prescription documented for postoperative prevention is not documentation of therapeutic treatment of an established proximal DVT.',
    basis:['claim.postoperative-dvt.three-month-anticoagulation'],category:'definition',
    method:'Named regimen/indication distinction applied to the recorded therapeutic-anticoagulation requirement; no dose, treatment-failure rescue or postoperative-resumption rule. Exact named-regimen support not newly retrieved; clinician/source verification required.'},
  {id:'claim.n1r2.gas-record-interpretation',statement:'In the constructed paired gas record, a CO2 rise with unchanged elevated bicarbonate introduces a respiratory contribution even though the later pH lies at the reporting interval boundary.',
    basis:['claim.qf2.qualitative-co2-acid-base-pattern','claim.qf3.direction-versus-acidemia','claim.gs028d.acidosis.blood-gas'],category:'evaluation',
    method:'Explicit synthesis limited to the displayed observations; the two gases are internally consistent with their reported components. No compensation formula, reference-interval universality or treatment cutoff is asserted.'},
];
const newById=new Map(additions.map(c=>[c.id,c]));
const sourcesById=new Map(catalog.sources.map(s=>[s.id,s]));
const originals=new Map(original.QUESTION_NEW_N1_CLAIM_PROVENANCE.map(row=>[row.inheritedClaimId,
  original.QUESTION_NEW_N1_CLAIMS.find(c=>c.id===row.claimId)]));
const claims=[],provenance=[];
const hash=text=>createHash('sha256').update(text).digest('hex').slice(0,12);
const key=s=>s.doi?`doi:${s.doi.toLowerCase()}`:`url:${s.officialUrl?.split(/[?#]/)[0]??s.id}`;
for(const id of requested){
  const extra=newById.get(id),record=catalog.claims.find(c=>c.id===id);
  if(extra){
    const basis=extra.basis.map(b=>{const c=catalog.claims.find(c=>c.id===b);assert.ok(c,`Missing basis ${b}`);return c;});
    const sourceIds=[...new Set(basis.flatMap(c=>c.sourceIds))];
    claims.push({...draft,id,statement:extra.statement,sourceIds,evidenceCategory:extra.category,certainty:'moderate',
      limitation:`${extra.method} Source access/currentness not refreshed. This is an author draft, not clinician verification or independent question acceptance.`,
      applicablePopulation:'The explicitly scoped N1 round-two constructed teaching cases; no empirical patient probabilities or medication doses.',lastCheckedOn:'2026-11-04'});
    provenance.push({claimId:id,inheritedClaimId:id,statementUnchanged:false,checkedLocallyOn:'2026-11-04',
      basisClaimIds:extra.basis,basisChecks:basis.map(c=>({id:c.id,lastCheckedOn:c.lastCheckedOn,contentVersion:c.contentVersion})),
      method:extra.method,sourcePublicationKeys:[...new Set(sourceIds.map(s=>key(sourcesById.get(s))))],
      externalVerification:'No new retrieval. Named-drug examples retain an explicit exact-support hold; logical record interpretations are limited to the constructed observations.'});
  }else{
    assert.ok(record,`No recorded claim ${id}`);
    const old=originals.get(id);
    const selected=old??Object.fromEntries(Object.entries(record).filter(([k])=>['statement','sourceIds','evidenceCategory','certainty','limitation','applicablePopulation','lastCheckedOn'].includes(k)));
    const claim=old?structuredClone(old):{...selected,...draft,id:`claim.n1r2.${hash(id)}`,
      limitation:[selected.limitation,'Unchanged offline recorded statement; original check/access dates retained. Exact N1 round-two application and source currentness remain unverified.'].filter(Boolean).join(' ')};
    claims.push(claim);
    provenance.push({claimId:claim.id,inheritedClaimId:id,statementUnchanged:true,
      inheritedContentVersion:old?.contentVersion??record.contentVersion,inheritedLastCheckedOn:record.lastCheckedOn,
      checkedLocallyOn:'2026-11-04',reuseKind:old?'Exact N1 claim record retained':'Unchanged earlier recorded claim under a round-two metadata version',
      sourcePublicationKeys:[...new Set(claim.sourceIds.map(s=>key(sourcesById.get(s))))],externalVerification:'Original dates only; no source newly retrieved.'});
  }
}
const sourceIds=[...new Set(claims.flatMap(c=>c.sourceIds))].sort();
const sources=sourceIds.map(id=>{
  const s=sourcesById.get(id);assert.ok(s,`Missing source ${id}`);
  return{...s,...draft,evidenceClaimIds:claims.filter(c=>c.sourceIds.includes(id)).map(c=>c.id),
    reuseNotes:`${s.reuseNotes??''} N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification.`};
});
const target='packages/clinical-content/src/question-new-n1-round2-evidence-20261104.ts';
fs.writeFileSync(target,'// Generated offline by tools/question-new-n1-round2/build-evidence.mjs.\n// Exact inherited claims keep their IDs, dates and versions; new syntheses disclose their basis/holds.\n'+
  'import type {ClinicalSource, EvidenceClaim} from "./pilot-schema";\n'+
  `export const QUESTION_NEW_N1_ROUND2_CLAIMS: EvidenceClaim[] = ${JSON.stringify(claims,null,2)};\n`+
  `export const QUESTION_NEW_N1_ROUND2_SOURCES: ClinicalSource[] = ${JSON.stringify(sources,null,2)};\n`+
  `export const QUESTION_NEW_N1_ROUND2_CLAIM_PROVENANCE = ${JSON.stringify(provenance,null,2)} as const;\n`);
console.log(JSON.stringify({revisions:38,claims:claims.length,sources:sources.length,newSyntheses:provenance.filter(p=>!p.statementUnchanged).length,
  exactInheritedN1Claims:provenance.filter(p=>p.reuseKind==='Exact N1 claim record retained').length,target},null,2));
