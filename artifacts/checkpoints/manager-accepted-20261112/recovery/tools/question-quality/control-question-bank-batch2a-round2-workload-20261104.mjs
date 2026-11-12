// Read-only synthetic fixture control. This does not measure performance or
// alter the cloud worker's test, budgets, production context or owner storage.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import '../economy-audit/source-loader.mjs';
const c=await import('../../packages/clinical-content/src/index.ts'),d=await import('../../packages/game-domain/src/index.ts');
const {createDiagnosticWorkload}=await import('../../tests/fixtures/diagnostic-workload.ts');
const original=d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,runs={};
try{for(const[name,release]of [['before',c.QUESTION_BANK_PRE_BATCH2A_ROUND2_RELEASE],['after',c.QUESTION_BANK_BATCH2A_ROUND2_RELEASE]]){
 d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=release;runs[name]=createDiagnosticWorkload();
}}finally{d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=original;}
const additions=Object.keys(runs.after.state.learningHistories).filter(id=>!Object.hasOwn(runs.before.state.learningHistories,id));
assert.equal(additions.length,6);
const normalized=structuredClone(runs.after.state);for(const id of additions)delete normalized.learningHistories[id];
const differences=[];
function diff(a,b,p){if(JSON.stringify(a)===JSON.stringify(b))return;if(a===null||b===null||typeof a!=='object'||typeof b!=='object'){differences.push(p);return;}for(const k of new Set([...Object.keys(a),...Object.keys(b)]))diff(a[k],b[k],p+'.'+k);}
diff(runs.before.state,normalized,'state');
const source='tests/fixtures/diagnostic-workload.ts';
const report={checkedAt:new Date().toISOString(),scope:'Same current fixture and domain runtime in disposable contexts. No benchmark timing or test pass is inferred. Context restored; no cloud code, assertions, deadlines, storage or saves edited.',source,sourceSha256:crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),
 historyCounts:{before:Object.keys(runs.before.state.learningHistories).length,after:Object.keys(runs.after.state.learningHistories).length},newHistoryIds:additions,
 normalizedStateByteExact:JSON.stringify(runs.before.state)===JSON.stringify(normalized),remainingDifferencePaths:differences,
 activeCases:Object.values(runs.after.state.encounters).map(e=>({caseId:e.frozenCase.id,variants:e.frozenCase.decisionNodes.map(n=>n.questionVariantId)})),
 limitation:'Only the six additional empty histories differ if normalizedStateByteExact is true. That narrows the content delta but does not prove a cause for a wall-clock/GC performance-budget failure. The cloud/performance owner must diagnose the repeated 16-ms violation; no threshold or assertion is relaxed.'};
fs.writeFileSync('tools/question-quality/question-bank-batch2a-round2-workload-control-20261104.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
