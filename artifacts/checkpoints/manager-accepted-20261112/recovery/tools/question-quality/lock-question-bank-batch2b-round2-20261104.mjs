import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {entry} from './question-bank-batch2b-round2-specs-20261104.mjs';
const tagIndex=process.argv.indexOf('--tag'),tag=tagIndex<0?'':process.argv[tagIndex+1];assert(/^(?:|final|handoff|post)$/.test(tag));
const path='tools/question-quality/question-bank-batch2b-round2-validation-'+(tag?tag+'-':'')+'lock-20261104.json';
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const ownRuntime=[
 'packages/clinical-content/src/question-bank-batch2b-round2-20261104.ts',
 'packages/clinical-content/src/question-bank-batch2b-round2-20261104-data.ts',
 'packages/clinical-content/src/question-bank-batch2b-round2-evidence-20261104.ts',
 'packages/game-domain/src/question-bank-batch2b-round2-test-orders.ts',
 'apps/player/public/clinical-exhibits/batch2b-r2-b24-breast-map.png',
];
const shared=['packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts','packages/clinical-content/src/answer-choice-timing.ts','packages/game-domain/src/test-choice-orders.ts'];
const files=Object.fromEntries([...new Set([...Object.keys(entry.files),...ownRuntime,...shared,'packages/clinical-content/src/question-ship-manifest.ts','packages/clinical-content/src/question-ship-projection.ts'])].filter(p=>fs.existsSync(p)).map(p=>[p,sha(p)]));
if(process.argv.includes('--close')){
 const initial=JSON.parse(fs.readFileSync(path,'utf8'));
 const changes=Object.keys(initial.files).filter(p=>files[p]!==initial.files[p]);
 const ownChanges=changes.filter(p=>ownRuntime.includes(p));
 assert.equal(ownChanges.length,0,'Own runtime changed during validation');
 const notCapturedAtLock=[];
 function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory()&&!['node_modules','dist','.git'].includes(e.name))walk(p);else if(e.isFile()&&/\.(ts|tsx|mjs|cjs|json|md|png|svg|sql)$/.test(p)&&!Object.hasOwn(initial.files,p))notCapturedAtLock.push({path:p,current:sha(p)});}}
 for(const dir of ['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','packages/balance-config/src','tests/fixtures','tools/qa','apps/player/src','apps/player/public','supabase'])walk(dir);
 fs.writeFileSync('tools/question-quality/question-bank-batch2b-round2-validation-'+(tag?tag+'-':'')+'window-20261104.json',JSON.stringify({startedAt:initial.startedAt,closedAt:new Date().toISOString(),ownRuntimeStable:true,ownRuntime,sharedRoots:shared,changes:changes.map(path=>({path,before:initial.files[path],after:files[path]})),notCapturedAtLock,policy:'Tracked inputs come from the intake plus explicit owned/runtime and manifest files. Extra paths may predate this lock; do not infer their creation time or authorship. Shared work is not attributed or reverted. Each full log retains its actual earlier start window; the final lock covers the late one-word B36 cleanup and focused verification.'},null,2)+'\n');
 console.log(JSON.stringify({ownRuntimeStable:true,sharedChanges:changes}));
}else{
 assert(!fs.existsSync(path),'Never overwrite validation lock');
 fs.writeFileSync(path,JSON.stringify({startedAt:new Date().toISOString(),ownRuntime,sharedRoots:shared,files},null,2)+'\n');
 console.log(JSON.stringify({locked:Object.keys(files).length,ownRuntime:ownRuntime.length,shared:shared.length}));
}
