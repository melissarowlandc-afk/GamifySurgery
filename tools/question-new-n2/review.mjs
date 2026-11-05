import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const batch = await import('../../packages/clinical-content/src/question-new-n2-20261104.ts');
const { collectAuthoredMetadata, inventoryRelease } = await import('../question-quality/bank.mjs');
const { validateSyntheticClinicalRelease } = await import('../../packages/clinical-content/src/schema.ts');
const { materializePatientName } = await import('../../packages/game-domain/src/patientText.ts');
const release = validateSyntheticClinicalRelease({ id: 'clinical.question-new-n2.2026-11-04', schemaVersion: 1,
  publicationStatus: 'synthetic_unapproved_prototype', disclaimer: 'Synthetic teaching drafts, not clinically approved.',
  concepts: batch.QUESTION_NEW_N2_TESTED_CONCEPTS, cases: batch.QUESTION_NEW_N2_CASES });
const lint = inventoryRelease(release, collectAuthoredMetadata(batch));
const packet = {
  schemaVersion: 1, generatedOn: '2026-11-04', label: 'Key shown first for review only',
  runtimeAnswerOrder: 'shuffleAnswers=true; the domain freezes a seeded permutation at admission.',
  reviewStatus: 'needs_clinician_review', clinicalSignoff: 'Melissa Rowland; no N2 exact version has been approved.',
  pipelinePassed: false, independentReview: 'Pending manager-arranged independent adversarial review.',
  sourceVerification: batch.QUESTION_NEW_N2_BATCH_MANIFEST.sourceVerification,
  manifest: batch.QUESTION_NEW_N2_BATCH_MANIFEST, linterVersion: lint.linterVersion, lintTotals: lint.totals,
  variants: batch.QUESTION_NEW_N2_CASES.map((clinicalCase, i) => ({
    ...batch.QUESTION_NEW_N2_CASE_REVIEWS[i], questionVariantId: clinicalCase.decisionNodes[0].questionVariantId,
    contentVersion: batch.QUESTION_NEW_N2_BATCH_MANIFEST.contentVersion,
    exactVersionSha256: createHash('sha256').update(JSON.stringify(clinicalCase)).digest('hex'),
    concept: batch.QUESTION_NEW_N2_AUTHORING_CONCEPTS[i],
    qualityReview: { intendedPurpose: 'resident_application', predictionStatus: 'Uncalibrated author intent; independent review required.',
      inference: batch.QUESTION_NEW_N2_ITEMS[i].inference, closestError: batch.QUESTION_NEW_N2_ITEMS[i].closestError,
      discriminator: batch.QUESTION_NEW_N2_ITEMS[i].discriminator, counterfactual: batch.QUESTION_NEW_N2_ITEMS[i].counterfactual,
      executionScope: batch.QUESTION_NEW_N2_ITEMS[i].clinicalSettingScope },
    clinicalCase: materializePatientName(clinicalCase, clinicalCase.patientDisplayName),
    authoredTemplate: clinicalCase,
    sourceIds: [...new Set(batch.QUESTION_NEW_N2_CLAIMS.filter(c => batch.QUESTION_NEW_N2_QUESTIONS[i].supportingEvidenceClaimIds.includes(c.id)).flatMap(c => c.sourceIds))],
    statementMapping: batch.QUESTION_NEW_N2_STATEMENT_MAPPINGS[i],
    timing: batch.QUESTION_NEW_N2_TIMING_ENTRIES[i],
    lintFindings: lint.variants.find(v => v.questionVariantId === clinicalCase.decisionNodes[0].questionVariantId)?.findings ?? [],
  })),
  claims: batch.QUESTION_NEW_N2_CLAIMS, claimProvenance: batch.QUESTION_NEW_N2_CLAIM_PROVENANCE,
  sources: batch.QUESTION_NEW_N2_SOURCES, sourceLinks: batch.QUESTION_NEW_N2_SOURCE_LINKS,
};
fs.mkdirSync('.local-dev/question-new-n2-20261104', { recursive: true });
fs.writeFileSync('.local-dev/question-new-n2-20261104/lint-n2.json', JSON.stringify(lint, null, 2) + '\n');
fs.writeFileSync('docs/research/question-new-n2-20261104.json', JSON.stringify(packet, null, 2) + '\n');
console.log(JSON.stringify({ manifest: packet.manifest, lint: lint.totals }, null, 2));
for (const variant of lint.variants) for (const finding of variant.findings)
  console.log(JSON.stringify({ variant: variant.questionVariantId, rule: finding.rule, evidence: finding.evidence.map(e => ({ field: e.field, text: e.text, choiceId: e.choiceId })), metrics: finding.metrics }));
