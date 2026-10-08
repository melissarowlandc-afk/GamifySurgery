// Preserve the approved waiting proof's responsive controls and visual shell.
import fs from 'node:fs';import path from 'node:path';import{fileURLToPath}from'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
let html=fs.readFileSync(path.join(here,'../../pediatric-waiting/proof/index.html'),'utf8');
html=html.replaceAll('Pediatric waiting room','Pediatric examination room').replaceAll('pediatric waiting room','pediatric examination room');
html=html.replace('4 × 4 · Painted candidate for owner review. Two parents wait while two children share the table.','3 × 3 · Owner-approved with the requested backless-stool revision. A child sits on the table facing the clinician; a parent stays in the same room.');
html=html.replace('Parents on bench and armchair','Parent in armchair').replace('Children at table','Child on examination table');
html=html.replace('<h2>Inspect</h2>','<label class="tg"><input type="checkbox" id="tgClinician" checked>Clinician on backless rolling stool</label>\n<h2>Inspect</h2>');
html=html.replace('K children · C anchors','K child · V clinician · C anchors');
html=html.replace('<h2>Room immediately north of</h2>','<h2>Room immediately north of</h2><p class="keys">Three independent one-tile wall sections.</p>');
fs.writeFileSync(path.join(here,'index.html'),html,'utf8');
fs.writeFileSync(path.join(here,'package.json'),JSON.stringify({private:true,type:'module'},null,2)+'\n');
console.log('SHELL PASS approved waiting controls/CSS adapted to pediatric-exam');
