// Historical intake scaffold, never a replay command for a populated cohort.
// The isolated copies were subsequently tailored for staff roles, worker-only
// readiness, four source-review pages and two additional gallery pages.
// Refuses to overwrite any existing module. Shared pipeline remains untouched.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const tool=resolve(fileURLToPath(new URL('.',import.meta.url))),from=resolve(tool,'../patient-gapfill-v6b');
const modules=['build-roster.mjs','build-placement-qa.mjs','validate-roster.mjs','validate-placement-qa.mjs','bind-worker-contacts.mjs','prepare-request.mjs','save-native.mjs','prepare-correction.mjs','save-correction.mjs','check-syntax.mjs','validate-gallery.mjs'];
for(const name of modules){
  const destination=resolve(tool,name);assert(!existsSync(destination),'Refusing to overwrite '+name);
  let code=readFileSync(resolve(from,name),'utf8').replaceAll('patient-gapfill-v6b','staff-gapfill-v6d').replaceAll('sol-v6b-worker','sol-v6d-worker').replaceAll('v6b','v6d').replaceAll('V6B','V6D');
  if(name==='build-roster.mjs'){
    code=code.replace("import assert from 'node:assert/strict';", "import assert from 'node:assert/strict';\nimport {roles, roleCounts} from './role-contract.mjs';");
    code=code.replace("assert.equal(roster.identities.length, 20, 'roster must have exactly 20 identities');","assert.equal(roster.identities.length, 14, 'roster must have exactly 14 identities');")
      .replace('Array.from({ length: 20 }','Array.from({ length: 14 }')
      .replace('item.stableId)).size, 20);','item.stableId)).size, 14);')
      .replace('{staff: 0, patient: 20}','{staff: 14, patient: 0}');
    const oldDemographic="assert.deepEqual(rosterContract(roster).demographicCounts, {Female: {young_adult: 0, adult: 3, middle_aged: 7, older_adult: 0}, Male: {young_adult: 0, adult: 4, middle_aged: 6, older_adult: 0}});";
    assert(code.includes(oldDemographic));
    code=code.replace(oldDemographic,"assert.deepEqual(rosterContract(roster).staffRoleCounts, roleCounts);\n  assert.deepEqual(roster.identities.map(c=>c.eligibleStaffRoleDefinitionIds), roles.flatMap(role=>[[role],[role]]));\n  assert(roster.identities.every(c=>c.intendedAge>=21&&c.intendedAge<=64),'working-adult ages required');\n  assert(roster.identities.filter(c=>c.visualBrief.accessory.includes('glasses')&&!c.visualBrief.accessory.includes('no glasses')).length<=4,'glasses maximum is 30%');");
    code=code.replaceAll('entries.length === 20','entries.length === 14').replace('expected: 20','expected: 14')
      .replaceAll('Twenty gap-fill patient','Fourteen gap-fill staff').replaceAll('/20 identities','/14 identities').replaceAll('/160 poses','/112 poses');
  }
  if(name==='validate-roster.mjs')code=code.replaceAll('staging.totals.expected, 20','staging.totals.expected, 14')
    .replaceAll('staging.issues.length, 20','staging.issues.length, 14').replaceAll('item.number)).size, 20','item.number)).size, 14')
    .replaceAll('staging.entries.length === 20','staging.entries.length === 14').replaceAll('staging.entries.length, 20','staging.entries.length, 14')
    .replaceAll('staging.totals.poses, 160','staging.totals.poses, 112').replaceAll('exactly20 manual','exactly14 manual')
    .replace('245 identities/1990 assets and120 selectable patients preserved','265 prior identities/2150 assets and140 selectable patients preserved; accepted v6b art pinned');
  if(name==='validate-placement-qa.mjs')code=code.replace('placement.diagnostics.length, 20','placement.diagnostics.length, 14');
  if(['prepare-request.mjs','save-native.mjs'].includes(name))code=code.replaceAll('/^0(0[1-9]|1\\d|20)$/','/^0(0[1-9]|1[0-4])$/');
  if(name==='bind-worker-contacts.mjs')code=code.replaceAll('complete80-worker','complete56-worker').replace('identities:20,workerReviewedContacts:80','identities:14,workerReviewedContacts:56');
  if(name==='validate-gallery.mjs')code=code.replace('registry.entries.length, 20','registry.entries.length, 14').replaceAll('all 20 identities','all 14 identities').replaceAll('-all-same-band.html','-all-same-role.html');
  writeFileSync(destination,code);
}
writeFileSync(resolve(tool,'review-acceptance.json'),JSON.stringify({schemaVersion:'staff-gapfill-v6d-review/v1',reviewer:'sol-v6d-worker',scope:'Worker source/pose/style/contact QA; manager acceptance pending. No runtime integration.',accepted:{},rejected:{},seatContacts:{},manualContactEvidence:{}},null,2)+'\n');
mkdirSync(resolve(tool,'../../../artifacts/character-statics/staff-gapfill-v6d'),{recursive:true});
console.log(JSON.stringify({status:'PASS',isolatedGenerationModules:modules.length,template:'accepted v6b / v5 staff / unchanged GS026 extraction',identities:14,poses:112}));
