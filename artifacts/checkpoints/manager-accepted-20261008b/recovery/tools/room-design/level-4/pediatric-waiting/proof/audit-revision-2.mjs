// Filesystem receipts only; no Git and no writes outside this proof lane.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'..'),repo=path.resolve(here,'../../../../..');
const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex').toUpperCase();
const intake=read(path.join(here,'revisions/revision-2-intake.json')),old=intake.previousOwned.files,current={};
const exclude=r=>r==='ART_BRIEF.md'||r==='stand-in'||r==='proof/evidence/owned-files.json'||r==='proof/evidence/revision-2-scope-audit.json'||r==='proof/evidence/browser-validation-report.json'||r==='proof/evidence/capture-report.json'||(r.startsWith('proof/evidence/pediatric-')&&r!=='proof/evidence/pediatric-source-contact-sheet.png');
function collect(dir){for(const n of fs.readdirSync(dir)){const f=path.join(dir,n),r=path.relative(root,f).replaceAll('\\','/');if(exclude(r))continue;if(fs.statSync(f).isDirectory())collect(f);else current[r]={sha256:sha(f),bytes:fs.statSync(f).size};}}
collect(root);
const externalChanged=Object.entries(intake.external).filter(([r,h])=>sha(path.join(root,r))!==h).map(([r])=>r);
const oldManifest=read(path.join(here,'revisions/revision-1-generation-manifest.json')),sourceChanged=[];
for(const a of [...oldManifest.assets,...oldManifest.sourceHistory])for(const [r,h]of [[a.file,a.sha256],[a.prompt,a.promptSha256]])if(sha(path.join(root,'assets',r))!==h)sourceChanged.push(r);
const nativeChanged=Object.entries(old).filter(([r,v])=>r.startsWith('assets/prepared/')&&r.endsWith('.png')&&sha(path.join(root,r))!==v.sha256).map(([r])=>r);
const refs=read(path.join(root,'assets/reference-baseline.json')),protectedChanged=Object.entries(refs.files).filter(([r,h])=>sha(path.join(repo,r))!==h).map(([r])=>r);
const report={status:'PASS',revision:2,kind:'Lane-only filesystem hash receipts, no Git',baselineOwnedFiles:Object.keys(old).length,currentWorkerFiles:Object.keys(current).length,created:Object.keys(current).filter(r=>!old[r]).sort(),changed:Object.keys(current).filter(r=>old[r]&&old[r].sha256!==current[r].sha256).sort(),missing:Object.keys(old).filter(r=>!current[r]),managerFilesPreserved:Object.keys(intake.external).length,externalChanged,previousOriginalPromptPairsPreserved:15,sourceChanged,nativeChanged,expectedNativeChanges:['assets/prepared/book-bin.png','assets/prepared/toy-chest.png'],protectedFiles:Object.keys(refs.files).length,protectedChanged,registryConcurrency:read(path.join(here,'revision-contract.json')).registry.concurrentChangeNote,outsideLaneWrite:'Authorized append only to docs/execplans/level4-pediatric-waiting-mockup-20261007.md Worker handoff; manager owns CURRENT_THREAD_HANDOFF',current};
if(externalChanged.length||sourceChanged.length||protectedChanged.length||report.missing.length||JSON.stringify([...nativeChanged].sort())!==JSON.stringify(report.expectedNativeChanges))report.status='FAIL';
fs.writeFileSync(path.join(here,'evidence/revision-2-scope-audit.json'),JSON.stringify(report,null,2)+'\n');
if(report.status!=='PASS')throw Error('Revision scope audit failed; inspect receipt');
console.log(`SCOPE PASS ${report.created.length} new / ${report.changed.length} changed worker files; 15 old original/prompt pairs, 5 old prepared sprites, ${report.managerFilesPreserved} manager files and ${report.protectedFiles} protected references unchanged`);
