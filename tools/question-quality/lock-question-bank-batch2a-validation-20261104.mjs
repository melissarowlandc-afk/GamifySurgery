import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const prefix='tools/question-quality/question-bank-batch2a-validation',tag=process.argv.find(x=>x.startsWith('--tag='))?.slice(6)??'final';
assert(/^[a-z0-9-]+$/.test(tag));const file=prefix+'-'+tag+'-lock-20261104.json';
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
if(process.argv.includes('--check')){
 const lock=JSON.parse(fs.readFileSync(file,'utf8')),changes=Object.entries(lock.files).filter(([p,h])=>!fs.existsSync(p)||hash(p)!==h).map(([path,previous])=>({path,previous,current:fs.existsSync(path)?hash(path):null}));
 console.log(JSON.stringify({file,inputs:Object.keys(lock.files).length,changes}));assert.equal(changes.length,0,'Validation inputs changed; report each stable validation window separately');
}else{
 assert(!fs.existsSync(file),'Never overwrite an immutable validation window');const entry=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-bank-batch2a-before-20261104.json','utf8'));
 const paths=new Set(Object.keys(entry.files));for(const p of ['tools/question-quality/bank.mjs','tools/question-quality/owner-flag-rules-20261104.mjs','packages/clinical-content/src/question-bank-batch2a-20261104.ts','packages/clinical-content/src/question-bank-batch2a-20261104-data.ts','packages/clinical-content/src/question-bank-batch2a-evidence-20261104.ts','packages/clinical-content/src/question-bank-batch2a-20261104.test.ts','packages/game-domain/tests/question-bank-batch2a-bindings.test.ts','apps/player/src/ui/ClinicalImageExhibit.tsx','apps/player/src/ui/ClinicalImageExhibit.test.tsx','apps/player/public/clinical-exhibits/batch2a-b01-pressure.png','apps/player/public/clinical-exhibits/batch2a-b03-pressure.png'])paths.add(p);
 if(tag==='domain-repaired')for(const f of JSON.parse(fs.readFileSync('tools/question-quality/question-bank-batch2a-verification-20261104.json','utf8')).externalAddedFiles)paths.add(f.path);
 fs.writeFileSync(file,JSON.stringify({started:new Date().toISOString(),scope:'Monitored entry source/tests/evidence plus new batch clinical/image/UI inputs; not every file in the shared tree.',files:Object.fromEntries([...paths].sort().map(p=>[p,hash(p)]))},null,2)+'\n');console.log(JSON.stringify({file,inputs:paths.size}));
}
