import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

// Read existing local modules only. No web, models, saves or source corpus.
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
const manifests = [];
const totals = {};
for (const [name, value] of Object.entries(contents)) {
  if (!name.startsWith('GS028_')) continue;
  if (name.endsWith('_BATCH_MANIFEST')) {
    assert.equal(value.publicReleaseAuthorized, false, `${name}: public release`);
    manifests.push({ export: name, publicReleaseAuthorized: false,
      admissionScope: value.admissionScope ?? null, clinicalReviewStatus: value.clinicalReviewStatus ?? null });
  }
  const category = ['AUTHORING_CONCEPTS', 'QUESTIONS', 'CLAIMS', 'SOURCES', 'CASE_REVIEWS'].find((x) => name.endsWith('_' + x));
  if (!category) continue;
  assert(Array.isArray(value), name);
  assert(value.every((r) => r.reviewStatus === 'needs_clinician_review'), `${name}: reviewStatus`);
  assert(value.every((r) => r.lastClinicianReview == null), `${name}: named clinician approval`);
  totals[category] = (totals[category] ?? 0) + value.length;
  groups.push({ export: name, category, count: value.length,
    reviewStatus: 'needs_clinician_review', namedClinicianApproval: false });
}
for (const category of ['AUTHORING_CONCEPTS', 'QUESTIONS', 'CLAIMS', 'SOURCES', 'CASE_REVIEWS']) {
  assert(groups.some((r) => r.category === category), `Missing ${category} inspection`);
}
assert.equal(contents.GS028_STATS_ETHICS_20260929_AUTHORING_CONCEPTS.length, 28);
assert.equal(contents.GS028_STATS_ETHICS_20260929_QUESTIONS.length, 112);
assert.equal(contents.GS028_STATS_ETHICS_20260929_CLAIMS.length, 63);
assert.equal(contents.GS028_STATS_ETHICS_20260929_SOURCES.length, 30);
assert.equal(contents.GS028_STATS_ETHICS_20260929_CASE_REVIEWS.length, 108);
const reviewed = new Set(contents.GS028_STATS_ETHICS_20260929_CASE_REVIEWS.map((r) => r.caseId));
assert(contents.GS028_STATS_ETHICS_20260929_CASES.every((r) => reviewed.has(r.id)));

// Clinical files are not changed or added by this checkpoint. Its archived
// baseline hashes and the complete intake/final source-tree hashes are checked
// separately in clinical-source-invariance.json.
console.log(JSON.stringify({ status: 'PASS', totals, groups, manifests,
  statsEthics: { concepts: 28, questions: 112, claims: 63, sources: 30, caseReviews: 108 },
  clinicalApprovalClaimed: false, publicReleaseAuthorized: false,
  sourcesFetched: 0, modelsCalled: 0, ownerSavesAccessed: 0 }, null, 2));
