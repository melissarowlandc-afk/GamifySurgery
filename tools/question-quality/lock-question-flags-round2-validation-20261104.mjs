// Immutable final-validation window; read-only comparisons on subsequent runs.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const file=process.argv.includes('--domain-repaired')
 ?'tools/question-quality/question-flags-round2-validation-domain-repaired-lock-20261104.json'
 :'tools/question-quality/question-flags-round2-validation-clean-lock-20261104.json';
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
if(process.argv.includes('--check')){
 const lock=JSON.parse(fs.readFileSync(file,'utf8'));
 const changes=Object.entries(lock.files).filter(([p,h])=>hash(p)!==h).map(([path,previous])=>({path,previous,current:hash(path)}));
 console.log(JSON.stringify({file,inputs:Object.keys(lock.files).length,changes}));
 assert.equal(changes.length,0,'Validation inputs changed; do not report results as one stable run');
}else{
 assert(!fs.existsSync(file),'Never overwrite the immutable validation lock');
 const entry=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-flags-round2-before-20261104.json','utf8'));
 const added=[
  'packages/clinical-content/src/question-flags-round2-20261104.ts',
  'packages/clinical-content/src/question-flags-round2-20261104-data.ts',
  'packages/clinical-content/src/question-flags-round2-evidence-20261104.ts',
  'packages/clinical-content/src/question-flags-round2-20261104.test.ts',
  'packages/game-domain/tests/question-flags-round2-bindings.test.ts',
 ];
 const paths=[...Object.keys(entry.files),...added].sort();
 assert.equal(new Set(paths).size,1032);
 fs.writeFileSync(file,JSON.stringify({capturedOn:'2026-11-04',purpose:process.argv.includes('--domain-repaired')?'Full-domain rerun after two domain-only fixture repairs. No runtime/player source change; earlier clean lock retained.':'Final clean-feedback full-domain/player validation window. Earlier interrupted run and lock are retained separately.',files:Object.fromEntries(paths.map(p=>[p,hash(p)]))},null,2)+'\n');
 console.log(JSON.stringify({file,inputs:paths.length}));
}
