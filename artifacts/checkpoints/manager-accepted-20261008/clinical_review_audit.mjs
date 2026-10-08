import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

// Resolve only existing local TypeScript siblings; no network or model calls.
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
const data = await import(pathToFileURL(resolve('packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/statistics-ethics-batch.ts')).href);
const groups = {};
for (const suffix of ['AUTHORING_CONCEPTS', 'QUESTIONS', 'CLAIMS', 'SOURCES', 'CASE_REVIEWS']) {
  const records = data['GS028_STATS_ETHICS_20260929_' + suffix];
  assert(Array.isArray(records));
  assert(records.every((r) => r.reviewStatus === 'needs_clinician_review'), suffix + ' review status');
  assert(records.every((r) => r.lastClinicianReview == null), suffix + ' clinician approval');
  groups[suffix] = { count: records.length, reviewStatus: 'needs_clinician_review', namedClinicianApproval: false };
}
const cases = data.GS028_STATS_ETHICS_20260929_CASES;
const reviewedCases = new Set(data.GS028_STATS_ETHICS_20260929_CASE_REVIEWS.map((r) => r.caseId));
assert(cases.every((c) => reviewedCases.has(c.id)), 'Every runtime case needs a separate draft review record');
assert(data.GS028_STATS_ETHICS_20260929_BATCH_MANIFEST.publicReleaseAuthorized === false);
console.log(JSON.stringify({status:'PASS', groups, cases:cases.length,
  decisionNodes:cases.flatMap((c)=>c.decisionNodes).length,
  publicReleaseAuthorized:false, admissionScope:'owner_development_preview_only',
  sourcesFetched:0, modelsCalled:0, ownerSavesAccessed:0}));
