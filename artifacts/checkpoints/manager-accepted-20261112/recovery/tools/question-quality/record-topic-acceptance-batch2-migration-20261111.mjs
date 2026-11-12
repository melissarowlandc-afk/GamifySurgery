import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const before = read('tools/question-quality/fixtures/question-topic-acceptance-batch2-before-20261111.json');
const additional = read('tools/question-quality/fixtures/question-topic-acceptance-batch2-additional-before-20261111.json');
const domainBefore = read('tools/question-quality/fixtures/question-topic-acceptance-batch2-domain-tests-before-20261111.json');
const hash = value => createHash('sha256').update(value).digest('hex');
const files = [...before.sourcePreimages, ...additional.files].map(row => ({...row, afterSha256:hash(fs.readFileSync(row.path))}))
  .filter(row => row.beforeSha256 !== row.afterSha256);
for (const row of files) assert.equal(hash(row.beforeText), row.beforeSha256);
const domainTestFiles = domainBefore.files.map(row => ({...row, afterSha256:hash(fs.readFileSync(row.path))}));
for (const row of domainTestFiles) assert.equal(hash(row.beforeText), row.beforeSha256);
fs.writeFileSync('tools/question-quality/fixtures/question-topic-acceptance-batch2-source-migration-20261111.json',
  JSON.stringify({checkedOn:'2026-11-11', files, domainTestFiles}, null, 2) + '\n');
console.log(JSON.stringify({existingClinicalFiles:files.length, existingDomainTests:domainTestFiles.length}));
