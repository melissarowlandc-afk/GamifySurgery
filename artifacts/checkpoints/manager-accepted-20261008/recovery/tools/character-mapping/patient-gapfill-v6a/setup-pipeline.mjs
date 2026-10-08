// Art-only adaptation of the frozen v5 production pipeline. Run once; no runtime writes.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const tool = resolve(fileURLToPath(new URL('.', import.meta.url)));
const repo = resolve(tool, '../../..');
const from = resolve(tool, '../future-roster20-v5');
for (const file of ['build-roster.mjs', 'validate-roster.mjs', 'build-placement-qa.mjs', 'validate-placement-qa.mjs', 'validate-gallery.mjs', 'runtime-baseline.mjs']) {
  const destination = resolve(tool, file);
  if (existsSync(destination)) throw new Error('Refusing to overwrite existing tool ' + destination);
  let s = readFileSync(resolve(from, file), 'utf8').replaceAll('future-roster20-v5', 'patient-gapfill-v6a');
  s = s.replaceAll('Owner visual approval and runtime registration remain pending.', 'Manager visual acceptance and runtime integration remain pending.')
    .replaceAll('Owner visual approval and runtime registration pending.', 'Manager visual acceptance and runtime integration pending.')
    .replaceAll('Twenty future employee and patient still', 'Twenty gap-fill patient still')
    .replaceAll('twenty future employee and patient still', 'twenty gap-fill patient still');
  if (file === 'runtime-baseline.mjs') {
    s = s.replace(/^import .*from '\.\/runtime-contract\.mjs';\n/m, '');
    s = s.replace('function loadCatalog()', 'export function loadCatalog()');
    s = s.replaceAll('225', '245').replaceAll('1830', '1990').replaceAll('1,830', '1,990').replaceAll('116', '120');
    const begin = s.indexOf('  const integratedBaseline =');
    const end = s.indexOf('  for (const item of [...baseline.protectedFiles', begin);
    s = s.slice(0, begin) + s.slice(end);
    s = s.replace(/^    if \(integratedBaseline.*\n/m, '');
    s = s.replace(/const integration = existsSync\(baselineManifest\).*;/, "const integration = { ready: false, ownerApproval: 'pending' };");
  }
  if (file === 'validate-roster.mjs' || file === 'validate-placement-qa.mjs') {
    s = s.replace(/^import .*from '\.\/runtime-contract\.mjs';\n/m, '');
    s = s.replace(/^if \(existsSync\(baselineManifest\)\) verifyFrozenReviewMetadata\(\);\n/m, '');
    s = s.replace(/const runtime = existsSync\(baselineManifest\).*;/, 'const runtime = integration;');
    s = s.replace('225 identities/1830 assets and116 selectable patients preserved', '245 identities/1990 assets and120 selectable patients preserved');
  }
  if (file === 'build-roster.mjs') {
    s = s.replace("  const roleSource = readFileSync", "  assert.deepEqual(rosterContract(roster).categoryCounts, {staff: 0, patient: 20});\n  assert.deepEqual(rosterContract(roster).demographicCounts, {Female: {young_adult: 0, adult: 4, middle_aged: 7, older_adult: 0}, Male: {young_adult: 0, adult: 3, middle_aged: 6, older_adult: 0}});\n  const roleSource = readFileSync");
  }
  writeFileSync(destination, s);
}
mkdirSync(resolve(repo, 'artifacts/character-statics/patient-gapfill-v6a'), {recursive: true});
writeFileSync(resolve(tool, 'review-acceptance.json'), JSON.stringify({
  schemaVersion: 'patient-gapfill-v6a-review/v1', reviewer: 'sol-v6a-worker',
  scope: 'Worker source and authored-contact QA only. Manager visual acceptance pending. No runtime integration or clinical semantics.',
  accepted: {}, rejected: {}, seatContacts: {}, manualContactEvidence: {},
}, null, 2) + '\n');
console.log('Created art-only v6a pipeline from v5; runtime writes are absent.');
