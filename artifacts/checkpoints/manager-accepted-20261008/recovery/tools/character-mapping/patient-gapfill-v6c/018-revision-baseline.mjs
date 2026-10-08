import assert from 'node:assert/strict';
import {existsSync,mkdirSync,readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {hash,repo,root,tool,verifyRuntimeBaseline} from './build-roster.mjs';
const json=f=>JSON.parse(readFileSync(f,'utf8'));
const file=resolve(tool,'analysis/018-regeneration/intake.json');
function files(directory){return readdirSync(directory,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(resolve(directory,e.name)):[resolve(directory,e.name)]);}
const rel=f=>relative(repo,f).replaceAll('\\','/');
export function capture018Revision(){
  assert(!existsSync(file),'Revision intake is immutable');
  verifyRuntimeBaseline();
  const roster=json(resolve(tool,'roster.json')),ledger=json(resolve(tool,'review-acceptance.json'));
  assert(!existsSync(resolve(tool,'owner-approval.json')),'A frozen approval requires a separate revision receipt');
  const protectedIdentities=roster.identities.filter(x=>x.number!=='018');
  const pinned=protectedIdentities.flatMap(x=>[...files(resolve(root,'sources',x.number)),...files(resolve(root,'packages',x.number)),resolve(root,'placement-qa',x.number+'-front-desk-chair-placement.png'),resolve(root,'worker-review/contact-overlays',x.number+'.png')]).map(path=>({path:rel(path),sha256:hash(path)}));
  const before=json(resolve(root,'packages/018/manifest.json'));
  const record={schemaVersion:'patient-gapfill-v6c-018-adult-revision-intake/v1',scope:'Manager accepted other 18 identities; regenerate only 018 to read as an adult 33-year-old. Freeze all existing other-identity sources/packages/chair/contact evidence.',managerRequest:'018 reads as a teenager at game scale: shorts, young face and small build. Use long trousers and adult face/build; original attempt must remain in history.',protectedIdentities,protectedContacts:Object.fromEntries(protectedIdentities.map(x=>[x.number,ledger.seatContacts[x.number]])),pinned,before:{identity:before.identity,sourceSha256:before.source.stage2.png.sha256,stage1Sha256:before.source.stage1.png.sha256,poses:before.poses,proofs:before.proofs,contacts:before.seatContactAcceptance.coordinates,manifestSha256:hash(resolve(root,'packages/018/manifest.json'))}};
  mkdirSync(resolve(tool,'analysis/018-regeneration'),{recursive:true});writeFileSync(file,JSON.stringify(record,null,2)+'\n');
  console.log(JSON.stringify({status:'PASS',capturedOtherIdentities:18,pinnedOtherIdentityFiles:pinned.length,original018SourceSha256:record.before.sourceSha256}));
}
export function verify018Revision(){
  verifyRuntimeBaseline();
  const b=json(file),roster=json(resolve(tool,'roster.json')),ledger=json(resolve(tool,'review-acceptance.json'));
  for(const p of b.pinned)assert.equal(hash(resolve(repo,p.path)),p.sha256,'Other accepted identity evidence changed '+p.path);
  assert.deepEqual(roster.identities.filter(x=>x.number!=='018'),b.protectedIdentities);
  for(const [number,contacts]of Object.entries(b.protectedContacts))assert.deepEqual(ledger.seatContacts[number],contacts,'Other identity contacts changed');
  const history=resolve(root,'sources/018/history/original-teen-reading');
  assert.equal(hash(resolve(history,'source.png')),b.before.sourceSha256);
  const current=json(resolve(root,'packages/018/manifest.json'));
  assert.equal(current.identity.intendedAge,33);assert.equal(current.identity.compatibleSexLabel,'Male');assert.equal(current.identity.stableId,'patient-gapfill-v6c.018');
  assert.notEqual(current.source.stage2.png.sha256,b.before.sourceSha256);
  assert.equal(current.source.stage1.png.sha256,b.before.stage1Sha256);
  assert.equal(hash(resolve(history,'stage1-standing-cardinals.png')),b.before.stage1Sha256);
  console.log(JSON.stringify({status:'PASS',unchangedOtherIdentities:18,unchangedOtherPosePngs:144,unchangedPinnedFiles:b.pinned.length,original018Preserved:true,originalStandingSeedPreserved:true,stableIdAgeSexPreserved:true,runtimeReady:false}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  if(process.argv[2]==='capture')capture018Revision();else if(process.argv[2]==='verify')verify018Revision();else throw new Error('Use capture or verify');
}

