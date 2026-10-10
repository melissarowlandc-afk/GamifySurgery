import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

// Inspect only installed local TypeScript content. No network, models or saves.
registerHooks({
  resolve(specifier, context, next) {
    try { return next(specifier, context); }
    catch (error) {
      if (!specifier.startsWith('.') || !context.parentURL) throw error;
      const candidate = new URL(specifier + '.ts', context.parentURL);
      if (!existsSync(fileURLToPath(candidate))) throw error;
      return next(candidate.href, context);
    }
  },
});

const contents = await import(pathToFileURL(resolve('packages/clinical-content/src/index.ts')).href);
const groups = [];
const totals = {};
const manifests = [];
const separatelyReviewedLegacyGroups = [];
const categories = ['AUTHORING_CONCEPTS', 'QUESTIONS', 'CLAIMS', 'SOURCES', 'CASE_REVIEWS'];
for (const [name, value] of Object.entries(contents)) {
  const targetBatch = name.startsWith('GS028_') || name.startsWith('PEDIATRIC_CLINIC_');
  if (targetBatch && name.endsWith('_BATCH_MANIFEST')) {
    assert.equal(value.publicReleaseAuthorized, false, `${name}: public release`);
    if ('reviewStatus' in value) assert.equal(value.reviewStatus, 'needs_clinician_review', name);
    assert(value.lastClinicianReview == null, `${name}: clinician approval`);
    manifests.push({ export: name, publicReleaseAuthorized: false,
      admissionScope: value.admissionScope ?? null, reviewStatus: value.reviewStatus ?? null });
  }
  const category = categories.find((suffix) => name.endsWith('_' + suffix));
  if (!category || !Array.isArray(value)) continue;
  // Other exported draft batches carry the same explicit review marker.
  // Separately approved legacy records are not relabeled by this audit.
  const marked = value.filter((record) => record && typeof record === 'object' && 'reviewStatus' in record);
  if (!targetBatch && !marked.some((record) => record.reviewStatus === 'needs_clinician_review')) continue;
  if (!targetBatch && marked.some((record) => record.reviewStatus !== 'needs_clinician_review')) {
    separatelyReviewedLegacyGroups.push({ export: name, count: value.length,
      reviewStatuses: [...new Set(marked.map((record) => record.reviewStatus))],
      unchangedSourceHashProof: 'validation/clinical-source-invariance.json' });
    continue;
  }
  assert.equal(marked.length, value.length, `${name}: unmarked clinical record`);
  assert(marked.every((record) => record.reviewStatus === 'needs_clinician_review'), `${name}: clinical promotion`);
  assert(marked.every((record) => record.lastClinicianReview == null), `${name}: named clinician approval`);
  const batch = name.startsWith('GS028_') ? 'GS028' : name.startsWith('PEDIATRIC_CLINIC_') ? 'pediatric' : 'otherDraft';
  totals[batch] ??= {};
  totals[batch][category] = (totals[batch][category] ?? 0) + value.length;
  groups.push({ export: name, category, count: value.length, batch,
    reviewStatus: 'needs_clinician_review', namedClinicianApproval: false });
}
for (const prefix of ['GS028_', 'PEDIATRIC_CLINIC_']) {
  for (const category of categories) assert(groups.some((entry) => entry.export.startsWith(prefix) && entry.category === category));
}
assert.equal(contents.GS028_STATS_ETHICS_20260929_AUTHORING_CONCEPTS.length, 28);
assert.equal(contents.GS028_STATS_ETHICS_20260929_QUESTIONS.length, 112);
assert.equal(contents.GS028_STATS_ETHICS_20260929_CLAIMS.length, 63);
assert.equal(contents.GS028_STATS_ETHICS_20260929_SOURCES.length, 30);
assert.equal(contents.GS028_STATS_ETHICS_20260929_CASE_REVIEWS.length, 108);
assert.equal(contents.PEDIATRIC_CLINIC_AUTHORING_CONCEPTS.length, 10);
assert.equal(contents.PEDIATRIC_CLINIC_QUESTIONS.length, 20);
assert.equal(contents.PEDIATRIC_CLINIC_CASE_REVIEWS.length, 20);
assert(contents.PEDIATRIC_CLINIC_SOURCE_LINKS.every((link) => link.target === '_blank'
  && link.rel.includes('noopener') && link.rel.includes('noreferrer')));

console.log(JSON.stringify({ status: 'PASS', totals, groups, manifests, separatelyReviewedLegacyGroups,
  clinicalApprovalClaimed: false, publicReleaseAuthorized: false,
  sourceCorpusRead: false, sourcesFetched: 0, modelsCalled: 0, ownerSavesAccessed: 0 }, null, 2));
