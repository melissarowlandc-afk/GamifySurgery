// Copy the accepted v6a tools into this isolated generation lane once.
import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const tool=resolve(fileURLToPath(new URL('.',import.meta.url))),from=resolve(tool,'../patient-gapfill-v6a');
const generationModules=['audit-existing.mjs','bind-worker-contacts.mjs','bind-worker-review.mjs','build-comparison.mjs','build-placement-qa.mjs','build-roster.mjs','prepare-correction.mjs','prepare-request.mjs','save-correction.mjs','save-native.mjs','validate-gallery.mjs','validate-placement-qa.mjs','validate-roster.mjs','validate-worker-review.mjs'];
for(const name of generationModules){
  const destination=resolve(tool,name);if(existsSync(destination))throw new Error('Refusing to overwrite '+name);
  let code=readFileSync(resolve(from,name),'utf8').replaceAll('patient-gapfill-v6a','patient-gapfill-v6b').replaceAll('sol-v6a-worker','sol-v6b-worker').replaceAll('v6a','v6b').replaceAll('V6A','V6B');
  if(name==='build-roster.mjs')code=code.replace('Female: {young_adult: 0, adult: 4, middle_aged: 7, older_adult: 0}, Male: {young_adult: 0, adult: 3, middle_aged: 6, older_adult: 0}','Female: {young_adult: 0, adult: 3, middle_aged: 7, older_adult: 0}, Male: {young_adult: 0, adult: 4, middle_aged: 6, older_adult: 0}');
  writeFileSync(destination,code);
}
writeFileSync(resolve(tool,'review-acceptance.json'),JSON.stringify({schemaVersion:'patient-gapfill-v6b-review/v1',reviewer:'sol-v6b-worker',scope:'Worker source and authored-contact QA only. Manager visual acceptance pending. No runtime integration or clinical semantics.',accepted:{},rejected:{},seatContacts:{},manualContactEvidence:{}},null,2)+'\n');
mkdirSync(resolve(tool,'../../../artifacts/character-statics/patient-gapfill-v6b'),{recursive:true});
console.log('PASS: copied accepted v6a generation/packaging tools into v6b only.');
