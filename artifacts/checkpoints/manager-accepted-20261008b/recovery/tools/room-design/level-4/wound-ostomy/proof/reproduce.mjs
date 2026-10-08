// Rerun native preparation/build in-process; no child processes or browsers.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath,pathToFileURL} from 'node:url';
import {sha} from '../assets/image-utils.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const files=['asset-contract.json','presentation-contract.json','data.json','design-rooms.js','lab.js','room-touchups.mjs','proof-manifest.json','evidence/browser-revision-status.json','../assets/generation-manifest.json','../assets/processed/contract-used.json','../assets/processed/metadata.json','../assets/processed/wound-recliner.png','../assets/processed/exam-lamp.png','../assets/processed/ostomy-shelf.png','../assets/processed/dressing-cart.png','../assets/processed/hygiene-sign.png','../assets/reused/rolling-stool-backless.png','../assets/reused/stool-contract.json','../assets/provenance.md'];
const before=Object.fromEntries(files.map(f=>[f,sha(path.join(here,f))]));
for(const file of ['../assets/configure-assets.mjs','../assets/prepare-assets.mjs','../assets/prepare-reused-stool.mjs','fit-seats.mjs','build.mjs','../assets/write-provenance.mjs'])await import(pathToFileURL(path.join(here,file)).href+'?reproduce=1');
const changed=files.filter(f=>before[f]!==sha(path.join(here,f)));
const report={status:changed.length?'FAIL':'PASS',kind:'Node-only deterministic preparation/build',files:before,changed};fs.writeFileSync(path.join(here,'evidence/reproducibility-report.json'),JSON.stringify(report,null,2)+'\n');
if(changed.length)throw Error('Rebuild changed bytes: '+changed.join(', '));console.log('REPRODUCE PASS '+files.length+' generated files byte-identical; Node-only');
