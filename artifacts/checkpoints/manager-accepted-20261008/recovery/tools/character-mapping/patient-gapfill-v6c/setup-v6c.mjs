// One-time adaptation of the accepted v6b generation lane. No runtime writes.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const tool=resolve(fileURLToPath(new URL('.',import.meta.url))),from=resolve(tool,'../patient-gapfill-v6b');
const modules=['bind-worker-contacts.mjs','bind-worker-review.mjs','build-comparison.mjs','build-placement-qa.mjs','build-roster.mjs','prepare-correction.mjs','prepare-request.mjs','save-correction.mjs','save-native.mjs','validate-gallery.mjs','validate-placement-qa.mjs','validate-roster.mjs','validate-worker-review.mjs','build-all-catalog-comparison.mjs','validate-all-catalog-comparison.mjs','check-syntax.mjs'];
function replace(code,old,value){assert(code.includes(old),'Missing adaptation target: '+old);return code.replaceAll(old,value);}
for(const name of modules){
  const destination=resolve(tool,name);assert(!existsSync(destination),'Refuse to overwrite '+name);
  let code=readFileSync(resolve(from,name),'utf8').replaceAll('patient-gapfill-v6b','patient-gapfill-v6c').replaceAll('sol-v6b-worker','sol-v6c-worker').replaceAll('V6B','V6C');
  // Counts are adapted by semantic context; canvas coordinates and PNG offsets stay exact.
  code=code.replace(/(length|size|expected), ?20\b/g,'$1, 19').replaceAll('length === 20','length === 19').replaceAll('expected: 20','expected: 19').replaceAll('identities: 20','identities: 19').replaceAll('comparisonBoards: 20','comparisonBoards: 19').replaceAll('chairProofs: 20','chairProofs: 19').replaceAll('reviewedChairProofs: 20','reviewedChairProofs: 19').replaceAll('patient: 20','patient: 19').replaceAll('length: 20','length: 19').replaceAll('images: 20','images: 19').replaceAll('articles: 20','articles: 19').replaceAll('poses, 160','poses, 152').replaceAll('poses: 160','poses: 152').replaceAll('workerReviewedContacts:80','workerReviewedContacts:76').replaceAll('authoredContactDirections: 80','authoredContactDirections: 76').replaceAll('authoredSeatedContacts: 80','authoredSeatedContacts: 76').replaceAll('complete80-worker','complete76-worker').replaceAll('exactly20 manual','exactly19 manual').replaceAll('exactly 20 identities','exactly 19 identities').replaceAll('all 20 identities','all 19 identities').replaceAll('Twenty gap-fill','Nineteen gap-fill').replaceAll("'/20 identities","'/19 identities").replaceAll("'/160 poses","'/152 poses").replaceAll('0(0[1-9]|1\\d|20)','0(0[1-9]|1\\d)').replaceAll('mainGalleryImages:60','mainGalleryImages:57').replaceAll('mainGalleryImages: 60','mainGalleryImages: 57').replaceAll('images: 60','images: 57');
  code=code.replaceAll('identities:20','identities:19').replaceAll('workerReviewedIdentities: 20','workerReviewedIdentities: 19');
  code=code.replaceAll('v6b near-duplicate','v6c near-duplicate').replaceAll('v6b comparison review','v6c comparison review').replaceAll('v6b-comparison','v6c-comparison').replaceAll('80 authored-contact','76 authored-contact');
  if(name==='build-roster.mjs')code=replace(code,'Female: {young_adult: 0, adult: 3, middle_aged: 7, older_adult: 0}, Male: {young_adult: 0, adult: 4, middle_aged: 6, older_adult: 0}','Female: {young_adult: 0, adult: 2, middle_aged: 0, older_adult: 7}, Male: {young_adult: 0, adult: 2, middle_aged: 0, older_adult: 8}');
  if(name==='build-comparison.mjs')code=replace(code,'inventory.identities.length,97','inventory.identities.length,75');
  if(name==='validate-worker-review.mjs'){
    code=replace(code,"const v6aRoster=json(resolve(repo,'tools/character-mapping/patient-gapfill-v6a/roster.json'));", "const acceptedRosters=['patient-gapfill-v6a','patient-gapfill-v6b'].flatMap(batch=>json(resolve(repo,'tools/character-mapping',batch,'roster.json')).identities);");
    code=replace(code,"['adult', 'middle_aged'].includes(item.ageBand)),...v6aRoster.identities.map(item=>({...item,stillId:item.stableId}))", "['adult', 'older_adult'].includes(item.ageBand)),...acceptedRosters.filter(item=>['adult','older_adult'].includes(item.ageBand)).map(item=>({...item,stillId:item.stableId}))");
    code=replace(code,'catalog.length, 97','catalog.length, 75');code=replace(code,'existingComparisons, 500','existingComparisons, 287');code=replace(code,'within.length, 45','within.length, 51');code=replace(code,'existingSameBandIdentities: 97','existingSameBandIdentities: 75');
  }
  if(name==='build-all-catalog-comparison.mjs'||name==='validate-all-catalog-comparison.mjs'){
    code=code.replaceAll('265','285').replaceAll('5300','5415').replaceAll('190','171').replaceAll('within v6b','within v6c').replaceAll('v6b all-catalog','v6c all-catalog');
    if(name==='build-all-catalog-comparison.mjs')code=code.replaceAll('all 20 v6a identities','all 20 v6a and all 20 v6b identities').replaceAll('245 original and 20 accepted v6a identities','245 original and 40 accepted v6a/v6b identities').replaceAll('245 original +20 v6a','245 original +20 v6a +20 v6b').replaceAll('acceptedV6aIdentities:20','acceptedV6aIdentities:20,acceptedV6bIdentities:20');
    else {
      code=replace(code,"const v6a=json(resolve(repo,'tools/character-mapping/patient-gapfill-v6a/roster.json'));\nfor(const c of v6a.identities){const m=json(resolve(repo,'artifacts/character-statics/patient-gapfill-v6a/packages',c.number,'manifest.json')),p=m.poses.stand.south;expected.push({id:c.stableId,sex:c.compatibleSexLabel,ageBand:c.ageBand,path:p.file,sha256:p.sha256});}","for(const batch of ['patient-gapfill-v6a','patient-gapfill-v6b']){const roster=json(resolve(repo,'tools/character-mapping',batch,'roster.json'));for(const c of roster.identities){const m=json(resolve(repo,'artifacts/character-statics',batch,'packages',c.number,'manifest.json')),p=m.poses.stand.south;expected.push({id:c.stableId,sex:c.compatibleSexLabel,ageBand:c.ageBand,path:p.file,sha256:p.sha256});}}");
      code=replace(code,'inventory.acceptedV6aIdentities,20','inventory.acceptedV6aIdentities,20);assert.equal(inventory.acceptedV6bIdentities,20');
      code=replace(code,'acceptedV6aIdentities:20','acceptedV6aIdentities:20,acceptedV6bIdentities:20');
    }
  }
  writeFileSync(destination,code);
}
writeFileSync(resolve(tool,'review-acceptance.json'),JSON.stringify({schemaVersion:'patient-gapfill-v6c-review/v1',reviewer:'sol-v6c-worker',scope:'Worker source and authored-contact QA only. Manager visual acceptance pending. No runtime integration or clinical semantics.',accepted:{},rejected:{},seatContacts:{},manualContactEvidence:{}},null,2)+'\n');
mkdirSync(resolve(tool,'../../../artifacts/character-statics/patient-gapfill-v6c'),{recursive:true});
console.log(JSON.stringify({status:'PASS',copiedGenerationModules:modules.length,lane:'patient-gapfill-v6c',runtimeWrites:false}));
