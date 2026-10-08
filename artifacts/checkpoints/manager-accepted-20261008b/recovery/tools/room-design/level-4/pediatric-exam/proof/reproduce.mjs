// Repeat preparation/build in the same Node process, no child processes or browser.
import fs from'node:fs';import path from'node:path';import crypto from'node:crypto';import{fileURLToPath,pathToFileURL}from'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(path.resolve(here,f))).digest('hex').toUpperCase();
const files=['../assets/generation-manifest.json','asset-contract.json','presentation-contract.json','index.html','package.json','data.json','design-rooms.js','room-touchups.mjs','lab.js','proof-manifest.json','../assets/processed/metadata.json','../assets/processed/contract-used.json','../assets/derived/stool-backless.png','../assets/derived/stool-backless-manifest.json',...['peds-table','scale-counter','growth-chart','animal-print','toy-bin'].map(id=>'../assets/processed/'+id+'.png')];
const before=Object.fromEntries(files.map(f=>[f,sha(f)]));
for(const file of ['../assets/configure-assets.mjs','../assets/prepare-assets.mjs','../assets/derive-stool.mjs','fit-seats.mjs','create-shell.mjs','build.mjs'])await import(pathToFileURL(path.resolve(here,file)).href+'?reproduction');
const after=Object.fromEntries(files.map(f=>[f,sha(f)]));for(const f of files)if(before[f]!==after[f])throw Error('Non-reproducible artifact '+f);
fs.writeFileSync(path.join(here,'evidence/reproducibility-report.json'),JSON.stringify({status:'PASS',method:'Repeated deterministic imports in Node; no browser or child process.',files:after,originalsChanged:false},null,2)+'\n');
console.log('REPRODUCE PASS '+files.length+' generated files byte-identical; Node-only');
