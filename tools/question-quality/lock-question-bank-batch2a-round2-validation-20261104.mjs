import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const tag=process.argv.find(s=>s.startsWith('--tag='))?.slice(6)??'final';
assert(/^[a-z0-9-]+$/.test(tag));
const path='tools/question-quality/question-bank-batch2a-round2-validation-'+tag+'-lock-20261104.json';
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
if(process.argv.includes('--check')){
 const lock=JSON.parse(fs.readFileSync(path,'utf8'));
 const changes=Object.entries(lock.files).filter(([p,h])=>!fs.existsSync(p)||sha(p)!==h).map(([path,previous])=>({path,previous,current:fs.existsSync(path)?sha(path):null}));
 const result={checkedAt:new Date().toISOString(),lock:path,inputs:Object.keys(lock.files).length,changes};
 fs.writeFileSync(path.replace('-lock-','-window-'),JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify(result));
}else{
 assert(!fs.existsSync(path),'Never replace a validation-input lock');
 const files={};function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+e.name;
  if(e.isDirectory()&&!['node_modules','dist','.git'].includes(e.name))walk(p);
  else if(e.isFile()&&/\.(ts|tsx|mjs|cjs|json|sql|png|svg)$/.test(p))files[p]=sha(p);
 }}
 for(const d of ['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','packages/balance-config/src','tests/fixtures','tools/qa','apps/player/src','apps/player/public','supabase'])walk(d);
 for(const p of ['tools/question-quality/lint.mjs','tools/question-quality/lint.test.mjs','tools/question-quality/owner-flag-rules-20261104.mjs','tools/question-quality/bank.mjs','tools/question-quality/report.mjs','docs/clinical/question-authoring-standard.md'])files[p]=sha(p);
 fs.writeFileSync(path,JSON.stringify({startedAt:new Date().toISOString(),scope:'Shared source/test/assets and evidence inputs at final validation launch, plus linter/standard. Other workers may change their own lanes; report those separately.',files},null,2)+'\n');
 console.log(JSON.stringify({path,inputs:Object.keys(files).length}));
}
