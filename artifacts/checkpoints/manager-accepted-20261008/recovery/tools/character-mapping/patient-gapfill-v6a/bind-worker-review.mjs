import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { hash, rel, repo, root, tool, verifyRuntimeBaseline } from './build-roster.mjs';

// Run only after the worker has actually inspected the saved proofs named in
// worker-review-notes.json. This is a worker QA receipt, never manager approval.
const json = file => JSON.parse(readFileSync(file, 'utf8'));
verifyRuntimeBaseline();
const notesFile = resolve(tool, 'worker-review-notes.json'), notes = json(notesFile);
const staging = json(resolve(root, 'staging-registry.json'));
const inventory = json(resolve(root, 'comparison/existing-inventory.json'));
const comparisons = json(resolve(root, 'comparison/manifest.json'));
const placement = json(resolve(root, 'placement-qa/placement-manifest.json'));
const contactPages = json(resolve(root, 'contact-review/contact-review-manifest.json'));
const ledgerFile = resolve(tool, 'review-acceptance.json'), ledger = json(ledgerFile);
const alphaFile = resolve(root, 'alpha-normalization-report.json'), alpha = json(alphaFile);
assert.equal(staging.entries.length, 20); assert.equal(ledger.reviewer, notes.reviewer);
assert.deepEqual(Object.keys(ledger.accepted), []);
const receipt = (path, sha256 = hash(resolve(repo, path))) => {
  assert.equal(hash(resolve(repo, path)), sha256);
  return { path, sha256 };
};
const review = {
  schemaVersion: 'patient-gapfill-v6a-worker-visual-review/v1',
  reviewer: notes.reviewer,
  scope: notes.scope,
  managerAcceptance: 'pending', browserValidation: 'not-run-worker-sandbox',
  runtimeReady: false,
  notes: receipt(rel(notesFile)),
  preGenerationExamples: notes.beforeGenerationExamples.map(id => {
    const prior = inventory.identities.find(item => item.stillId === id);
    assert(prior, 'unresolved pre-generation example ' + id);
    return { id, pose: receipt(prior.standSouth.path, prior.standSouth.sha256) };
  }),
  styleReference: receipt(notes.styleReference),
  existingBandBoards: inventory.boards.map(board => ({
    sex: board.sex, ageBand: board.ageBand, identities: board.identities,
    proof: receipt(board.file, board.sha256),
  })),
  comparisonManifest: receipt(rel(resolve(root, 'comparison/manifest.json'))),
  chairBoards: placement.pages.map(page => receipt(page.proof.path, page.proof.sha256)),
  contactBoards: contactPages.pages.map(page => receipt(page.proof.file, page.proof.sha256)),
  contactLedger: receipt(rel(ledgerFile)),
  authoredContactContractSha256: ledger.seatContactWorkerReview.contractSha256,
  alphaReport: {
    ...receipt(rel(alphaFile)), summary: alpha.summary,
    status: 'worker-QA-pass-with-alpha1-noise;manager-acceptance-pending',
  },
  identities: staging.entries.map(entry => {
    const manifest = json(resolve(repo, entry.manifest));
    const comparison = comparisons.entries.find(item => item.number === entry.number);
    const chair = placement.diagnostics.find(item => item.number === entry.number);
    const contact = ledger.workerContactEvidence[entry.number];
    assert(notes.identities[entry.number]);
    return {
      number: entry.number, id: entry.stableId,
      sex: manifest.identity.compatibleSexLabel, age: manifest.identity.intendedAge,
      ageBand: manifest.identity.ageBand, sourceSha256: entry.sourceSha256,
      features: notes.identities[entry.number].features,
      distinction: notes.identities[entry.number].distinction,
      realizationNote: notes.identities[entry.number].realizationNote ?? null,
      poseProofs: ['fullLight', 'fullDark'].map(key => receipt(manifest.proofs[key].file, manifest.proofs[key].sha256)),
      comparisonBoard: receipt(comparison.board.path, comparison.board.sha256),
      chairProof: receipt(chair.directions.south.proof.path, chair.directions.south.proof.sha256),
      contactOverlay: receipt(contact.file, contact.sha256),
      contacts: contact.coordinates,
      status: 'worker-visual-QA-pass;manager-acceptance-pending',
    };
  }),
  styleAssessment: notes.styleAssessment,
  limitations: notes.limitations,
};
mkdirSync(resolve(root, 'worker-review'), { recursive: true });
writeFileSync(resolve(root, 'worker-review/visual-review.json'), JSON.stringify(review, null, 2) + '\n');
verifyRuntimeBaseline();
console.log(JSON.stringify({ status: 'PASS', workerReviewedIdentities: 20, comparisonBoards: 20, chairProofs: 20, authoredContactDirections: 80, managerAcceptance: 'pending' }));
