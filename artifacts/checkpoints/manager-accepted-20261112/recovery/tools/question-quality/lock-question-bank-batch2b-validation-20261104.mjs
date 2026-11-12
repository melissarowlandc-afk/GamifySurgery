import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const tag=process.argv.find(s=>s.startsWith('--tag='))?.slice(6)??'full';assert(/^[a-z0-9-]+$/.test(tag));
const path='tools/question-quality/question-bank-batch2b-validation-'+tag+'-lock-20261104.json';
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function currentFiles(){
 const files={};
 function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory()&&!['node_modules','dist','.git'].includes(e.name))walk(p);else if(e.isFile()&&/\.(ts|tsx|mjs|cjs|json|png|svg|sql)$/.test(p))files[p]=sha(p);}}
 for(const dir of ['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','packages/balance-config/src','tests/fixtures','tools/qa','apps/player/src','apps/player/public','supabase'])walk(dir);
 for(const p of ['tools/question-quality/lint.mjs','tools/question-quality/lint.test.mjs','tools/question-quality/owner-flag-rules-20261104.mjs','tools/question-quality/report.mjs','docs/clinical/question-authoring-standard.md'])files[p]=sha(p);
 return files;
}
if(process.argv.includes('--check')){
 const lock=JSON.parse(fs.readFileSync(path,'utf8')),current=currentFiles(),changes=Object.entries(lock.files).filter(([p,h])=>current[p]!==h).map(([path,previous])=>({path,previous,current:current[path]??null})),added=Object.entries(current).filter(([p])=>!Object.hasOwn(lock.files,p)).map(([path,current])=>({path,previous:null,current}));
 fs.writeFileSync(path.replace('-lock-','-window-'),JSON.stringify({checkedAt:new Date().toISOString(),lock:path,inputs:Object.keys(lock.files).length,currentInputs:Object.keys(current).length,changes,added},null,2)+'\n');console.log(JSON.stringify({inputs:Object.keys(lock.files).length,currentInputs:Object.keys(current).length,changes:changes.map(x=>x.path),added:added.map(x=>x.path)}));
}else{
 assert(!fs.existsSync(path),'Never overwrite a validation lock');const files=currentFiles();
 fs.writeFileSync(path,JSON.stringify({capturedAt:new Date().toISOString(),note:'Shared source/test/asset input window; compare after validation and distinguish concurrent workers. No source/evidence mutation.',files},null,2)+'\n');console.log(JSON.stringify({path,inputs:Object.keys(files).length}));
}
