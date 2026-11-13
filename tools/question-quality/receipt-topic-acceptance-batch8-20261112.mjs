import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const base='question-topic-acceptance-batch8',path='docs/research/'+base+'-files-20261112.json';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=b=>createHash('sha256').update(b).digest('hex'),hash=p=>sha(fs.readFileSync(p));
const before=read('tools/question-quality/fixtures/'+base+'-before-20261112.json');
const migration=read('tools/question-quality/fixtures/'+base+'-source-migration-20261112.json');
const packet=read('docs/research/'+base+'-packet-20261112.json');
const validation=read('docs/research/'+base+'-validation-20261112.json');
const marker='<!-- BEGIN TOPIC ACCEPTANCE BATCH8 20261112 -->';
const append=[marker,'## Topic acceptance batch 8 - 2026-11-12','',
 'Bounded manifest milestone complete. Full handoff/receipts:',
 'docs/research/question-topic-acceptance-batch8-20261112.md and its packet,',
 'source-freeze, disposition, validation and file receipts. All ten requested',
 'owner-directed exact PASS versions accepted; no skips; all remain',
 'needs_clinician_review. Ten Melissa Rowland direction records expressly',
 'withhold exact-version approval. Source authoring files were not edited.',
 '',
 'Manifest v17 / 777 authority rows: ten successors replace five rows. Default:',
 '1407 cases / 1610 scored nodes / 1109 registered / 909 scored meanings.',
 `Manifest SHA256 ${packet.manifestSha256}.`,
 `Default SHA256 ${packet.defaultSha256}.`,
 'Two existing four-to-one MH/rectal consolidations are retargeted; their eight',
 'legacy cases stay withheld. The exact one-node reflux successor replaces its',
 'prior paired case. Easy serum-hCG G04 is withheld by its same-case successor.',
 'NEC and meconium retire; the additional gap duplicate retires conditionally',
 'on B2B34. Easy OSA screening stays. All 1105 prior concept records/order remain',
 'exact. New concept IDs/content versions follow the reviewed packet.',
 '',
 'Twelve new exact future_planned test bindings are installed, with no new wait',
 'profiles or authored durations. Five prior timing tuples keep their original',
 'offsets; nine prior orders remain exact for frozen questions. Target raw lint',
 '0 / 10 variants / 20 contexts; whole bank 1847 -> 1824; no length residuals.',
 'Nineteen archived prior cases reopen/complete from format-3 saves and committed',
 'journals, preserving frozen choices, source versions and FSRS. No format,',
 'selector, routing, learning-history or domain acceptance gate change.',
 '',
 `Final clinical: ${validation.runs['clinical-final'].passed} passed / ${validation.runs['clinical-final'].failed} failed / ${validation.runs['clinical-final'].skipped} skipped; ${validation.runs['clinical-final'].files} files.`,
 `Final domain: ${validation.runs['domain-final'].passed} passed / ${validation.runs['domain-final'].failed} failed / ${validation.runs['domain-final'].skipped} skipped; ${validation.runs['domain-final'].files} files.`,
 `Focused player ${validation.runs['player-final'].passed}/175; focused domain ${validation.runs['domain-focused'].passed}/874; cue tests 33/33.`,
 `Typechecks ${validation.typecheck.workspaces.filter(w=>w.passed).length}/7; full-library naming guard passes.`,
 'Exact native commands/exits, failure messages and baseline/concurrent-lane',
 'classifications are in the validation receipt. All own focused checks pass.',
 'Historical guards verify exact postimages/preimages; cached membership guards',
 'recheck related live cases/bindings/rows and reject mutation after caching.',
 'No source capture, assertion, budget or timeout was weakened.',
 '',
 'Changed recorded Level 5 inputs: clinical-content/src/synthetic-content.ts,',
 'index.ts and answer-choice-timing.ts; game-domain/src/test-choice-orders.ts.',
 'The authority/new accepted modules are additional transitive inputs. Manager',
 'owns the rebind and any remaining baseline or balance/progression work.',
 'No question-topic-*, question-intraop-* or question-owner-decisions-* source',
 'edit, balance/progression, cloud/Supabase or GS-release write. Concurrent work',
 'is preserved. No Git, install, network, agents, deploy or rebind. Local only;',
 'manager owns the "push to GitHub" checkpoint gate. Launch/origin unchanged.',
 'Stop here; no next authoring task started.',
 '<!-- END TOPIC ACCEPTANCE BATCH8 20261112 -->','',
].join('\n');
const sharedPath='docs/handoffs/CURRENT_THREAD_HANDOFF.md';let shared=fs.readFileSync(sharedPath);
assert.equal(sha(shared.subarray(0,before.sharedHandoff.bytes)),before.sharedHandoff.sha256,'Preserve complete existing handoff prefix');
if(!shared.includes(Buffer.from(marker))){assert(!process.argv.includes('--check'));fs.appendFileSync(sharedPath,'\n'+append);shared=fs.readFileSync(sharedPath);}
const at=shared.indexOf(Buffer.from(marker));assert(at>=before.sharedHandoff.bytes);
assert.equal(shared.subarray(at,at+Buffer.byteLength(append)).toString('utf8'),append,'Preserve exact bounded append and any later concurrent work');
const existingFiles=migration.files.map(r=>{assert.equal(sha(r.beforeText),r.beforeSha256);assert.equal(hash(r.path),r.afterSha256);
 return {path:r.path,beforeSha256:r.beforeSha256,afterSha256:r.afterSha256,bytes:fs.statSync(r.path).size};});
const newPaths=[];
for(const dir of ['docs/execplans','docs/research','tools/question-quality','tools/question-quality/fixtures','packages/clinical-content/src','apps/player/src'])
 for(const n of fs.readdirSync(dir))if(/batch8|Batch8/.test(n)&&dir+'/'+n!==path&&fs.statSync(dir+'/'+n).isFile())newPaths.push(dir+'/'+n);
assert.equal(new Set(newPaths).size,newPaths.length);
const newFiles=newPaths.sort().map(p=>({path:p,sha256:hash(p),bytes:fs.statSync(p).size}));
const owned=new Set(existingFiles.map(r=>r.path));
const observedConcurrentChanges=Object.entries(before.observed).filter(([p,h])=>!owned.has(p)&&(!fs.existsSync(p)||hash(p)!==h))
 .map(([p,h])=>({path:p,beforeSha256:h,observedSha256:fs.existsSync(p)?hash(p):null,
  attribution:'Outside this batch ownership; observed concurrent change preserved without editing.'}));
for(const input of before.sourceInputs)assert.equal(hash(input.path),input.sha256,'Exact protected author/review input '+input.path);
const result={checkedOn:'2026-11-12',existingFiles,newFiles,self:{path,sha256Omitted:true},
 sharedHandoff:{path:sharedPath,originalPrefixBytes:before.sharedHandoff.bytes,originalPrefixSha256:before.sharedHandoff.sha256,
  ownedAppendSha256:sha(append),ownedAppendBytes:Buffer.byteLength(append),marker,preserveLaterAppends:true},
 protectedSourceInputs:before.sourceInputs,observedConcurrentChanges,levelFiveInputs:packet.levelFiveInputs,
 validationReceipt:{path:'docs/research/'+base+'-validation-20261112.json',sha256:hash('docs/research/'+base+'-validation-20261112.json')}};
if(process.argv.includes('--check')){
 const recorded=read(path);assert.deepEqual(recorded.existingFiles,existingFiles);assert.deepEqual(recorded.newFiles,newFiles);
 assert.deepEqual(recorded.sharedHandoff,result.sharedHandoff);assert.deepEqual(recorded.validationReceipt,result.validationReceipt);
}else fs.writeFileSync(path,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({existingFiles:existingFiles.length,newFiles:newFiles.length,sharedHandoff:'verified',
 observedConcurrentChanges:observedConcurrentChanges.length,check:process.argv.includes('--check')}));
