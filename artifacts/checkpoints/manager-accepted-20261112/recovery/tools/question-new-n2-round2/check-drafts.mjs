import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import {extraClaims} from './extra-claims.mjs';
const dir='.local-dev/question-new-n2-round2-20261104';
const catalog=JSON.parse(fs.readFileSync(`${dir}/recorded-catalog.json`,'utf8'));
const original=JSON.parse(fs.readFileSync('docs/research/question-new-n2-20261104.json','utf8'));
const claims=new Set([...catalog.claims.map(c=>c.id),...original.claimProvenance.map(p=>p.inheritedClaimId),...extraClaims.map(c=>c.id)]);
const groups=['perioperative','abdominal','specialty','research'];
const revisions=[];
for(const group of groups){
 const path=`packages/clinical-content/src/question-new-n2-round2-${group}.ts`;
 if(fs.existsSync(path)){const m=await import('../../'+path);revisions.push(...m['QUESTION_NEW_N2_ROUND2_'+group.toUpperCase()]);}
}
const missing=[...new Set(revisions.flatMap(r=>r.item.existingClaimIds))].filter(id=>!claims.has(id));
const longestKeys=revisions.filter(r=>r.item.choices[0].label.length>Math.max(...r.item.choices.slice(1).map(c=>c.label.length)))
 .map(r=>({slug:r.slug,labels:r.item.choices.map(c=>c.label)}));
const result={items:revisions.length,missingRecordedClaimIds:missing,longestKeys,newConstructVersions:revisions.filter(r=>r.conceptMeaning==='new_version').map(r=>r.slug)};
fs.writeFileSync(`${dir}/draft-structure-check.json`,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
if(missing.length)process.exitCode=1;
