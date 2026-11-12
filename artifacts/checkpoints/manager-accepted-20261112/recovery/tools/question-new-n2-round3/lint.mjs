import '../economy-audit/source-loader.mjs';import fs from 'node:fs';
const b=await import('../../packages/clinical-content/src/question-new-n2-round3-20261104.ts');
const old=await import('../../packages/clinical-content/src/question-new-n2-20261104.ts');
const r2=await import('../../packages/clinical-content/src/question-new-n2-round2-20261104.ts');
const {inventoryRelease,collectAuthoredMetadata}=await import('../question-quality/bank.mjs');
const release={id:'review.n2r3',schemaVersion:1,publicationStatus:'synthetic_unapproved_prototype',disclaimer:'Unapproved draft review',
 concepts:[...old.QUESTION_NEW_N2_TESTED_CONCEPTS,...r2.QUESTION_NEW_N2_ROUND2_NEW_CONCEPT_VERSIONS,...b.QUESTION_NEW_N2_ROUND3_NEW_CONCEPT_VERSIONS],cases:b.QUESTION_NEW_N2_ROUND3_CASES};
const lint=inventoryRelease(release,collectAuthoredMetadata(b));
fs.writeFileSync('.local-dev/question-new-n2-round3-ship-gate-20261104/lint-current.json',JSON.stringify(lint,null,2)+'\n');
console.log(JSON.stringify(lint.totals));
for(const v of lint.variants.filter(v=>v.findings.length)){
 console.log('\n'+v.questionVariantId);const seen=new Set();for(const f of v.findings){
 const msg=f.rule+': '+f.evidence.map(e=>e.field+' = '+e.text).join(' / ');if(!seen.has(msg))console.log(msg);seen.add(msg);
 }
}
