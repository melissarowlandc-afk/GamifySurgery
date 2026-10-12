// Copy the approved Founder's Office toolchain into this private owned lane.
// Never writes to references, runtime, the global handoff, or the shared plan.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)),source=path.join(path.dirname(root),'founders-office'),repo=path.resolve(root,'../../../..');
const files=['proof/lab.js','proof/extension.js','proof/geometry.mjs','proof/native-engine.mjs','proof/room-touchups.mjs','proof/shell-painter.js','proof/browser-errors.cjs','proof/index.html','proof/build.mjs','proof/validate-controls.mjs','proof/validate-browser.cjs','proof/capture.cjs','proof/inspect-native.mjs','proof/reproduce.mjs','proof/check-http.ps1','proof/check-helpers.cjs','proof/data.json'];
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
fs.mkdirSync(path.join(root,'proof/evidence/v2'),{recursive:true});
const refs=[];
for(const file of files){
 const from=path.join(source,file),to=path.join(root,file);if(fs.existsSync(to))throw Error('Do not overwrite '+to);
 refs.push({path:path.relative(repo,from).replaceAll('\\','/'),sha256:hash(from),copiedTo:file});
 let s=fs.readFileSync(from,'utf8');
 if(!['proof/data.json','proof/room-touchups.mjs','proof/shell-painter.js','proof/browser-errors.cjs'].includes(file)){
  s=s.replaceAll('founders-office','executive-office').replaceAll('room.founder_office','room.executive_office').replaceAll('design:fo:','design:eo:').replaceAll('founderPresentation','executivePresentation').replaceAll('founderChair','executiveChair').replaceAll('founders','executives').replaceAll('tgFounder','tgExecutive').replaceAll('FOUNDER_OFFICE_PROOF_URL','EXECUTIVE_OFFICE_PROOF_URL').replaceAll("Founder's Office",'Executive Office').replaceAll('Founder’s Office','Executive Office').replaceAll('Founder Office','Executive Office').replaceAll('Founder','Executive').replace(/founder(?!\.01)/g,'executive');
  s=s.replaceAll('3 × 3','4 × 3').replaceAll('3x3','4x3').replaceAll('[3,3]','[4,3]').replaceAll("['N1','N2','N3']","['N1','N2','N3','N4']").replaceAll("['N1','N2','N3','S1','S2','S3','WA','WB','WC','EA','EB','EC']","['N1','N2','N3','N4','S1','S2','S3','S4','WA','WB','WC','EA','EB','EC']");
 }
 fs.mkdirSync(path.dirname(to),{recursive:true});fs.writeFileSync(to,s);
}
const data=JSON.parse(fs.readFileSync(path.join(root,'proof/data.json')));delete data.founderPresentation;fs.writeFileSync(path.join(root,'proof/data.json'),JSON.stringify(data,null,2)+'\n');
for(const file of ['ART_BRIEF.md','approval-2026-10-09.md'])refs.push({path:path.relative(repo,path.join(source,file)).replaceAll('\\','/'),sha256:hash(path.join(source,file)),use:'Approved design/process reference; not copied.'});
for(const file of ['tools/room-design/level-4/wound-ostomy/approval-2026-10-08.md','tools/room-design/level-4/pediatric-exam/approval-2026-10-08.md','tools/room-design/level-4/pediatric-waiting/approval-2026-10-08.md','tools/room-design/furniture-reference-contact.png','tools/room-design/level-5/founders-office/proof/evidence/v2/native-all-five-levels.png','packages/balance-config/src/room-upgrades.ts','docs/features/facility-levels-and-clinical-release-points.md',...data.characters.flatMap(c=>Object.values(c.poses).flatMap(p=>Object.values(p).map(v=>'apps/player/public/'+v.url)))] )if(!refs.some(r=>r.path===file))refs.push({path:file,sha256:hash(path.join(repo,file)),use:'Read-only style, contract, catalog or character reference.'});
fs.mkdirSync(path.join(root,'assets'),{recursive:true});fs.writeFileSync(path.join(root,'assets/reference-baseline.json'),JSON.stringify({date:'2026-10-10',references:refs},null,2)+'\n');
fs.writeFileSync(path.join(root,'layout-reconciliation-v2.json'),JSON.stringify({schemaVersion:2,changes:[],policy:'Frozen prepaint anchors and ownership; any later art fit must be recorded here.'},null,2)+'\n');
console.log(`BOOTSTRAP PASS: ${files.length} private toolchain copies; ${refs.length} reference hashes; no shared file changed.`);
