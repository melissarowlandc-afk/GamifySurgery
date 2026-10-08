// Handoff receipt, excluding immutable pre-existing brief/stand-ins and this receipt itself.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)), root=path.resolve(here,'..'),out=path.join(here,'evidence/owned-files.json');
const files={};
const managerEvidence=[];
function collect(dir) {
  for(const name of fs.readdirSync(dir).sort()) {
    const file=path.join(dir,name),relative=path.relative(root,file).replaceAll('\\','/');
    if(relative==='ART_BRIEF.md'||relative==='stand-in'||file===out)continue;
    if(relative==='proof/evidence/browser-validation-report.json'||relative==='proof/evidence/capture-report.json'||(relative.startsWith('proof/evidence/pediatric-')&&relative!=='proof/evidence/pediatric-source-contact-sheet.png')) { managerEvidence.push(relative); continue; }
    if(fs.statSync(file).isDirectory())collect(file);
    else files[relative]={sha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase(),bytes:fs.statSync(file).size};
  }
}
collect(root);
fs.writeFileSync(out,JSON.stringify({schemaVersion:1,task:'Level 4 Pediatric Waiting Room milestone 2 / owner revision 2',root:'tools/room-design/level-4/pediatric-waiting',owner:'assigned Sol worker',outsideLaneEdit:'Append only to docs/execplans/level4-pediatric-waiting-mockup-20261007.md Worker handoff',excluded:['ART_BRIEF.md','stand-in/**','proof/evidence/owned-files.json (self)',...managerEvidence],fileCount:Object.keys(files).length,files},null,2)+'\n');
console.log(`OWNERSHIP ${Object.keys(files).length} worker lane files hashed; ${managerEvidence.length} manager evidence files excluded; brief/stand-ins excluded`);
