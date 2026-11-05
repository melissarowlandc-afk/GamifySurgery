// Read-only final artifact check; no source, tests, evidence or saves written.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),root='tools/question-quality/question-bank-batch2a-round3-';
const manifest=read(root+'owned-files-20261104.json');
for(const f of manifest.files)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(f.path)).digest('hex'),f.currentHash,f.path);
const packet=read('docs/research/question-bank-batch2a-round3-20261104.json'),proof=read(root+'verification-20261104.json'),queue=read(root+'queue-review-20261104.json');
assert.equal(packet.length,11);assert.equal(packet.filter(p=>p.pipelinePassed).length,4);assert.equal(proof.noteResponses,77);assert(proof.passed);
for(const p of packet.filter(p=>!p.pipelinePassed)){
 assert.equal(p.reviewStatus,'needs_clinician_review');assert.equal(p.releaseReady,false);
 assert.equal(p.after.Options.filter(s=>s.startsWith('**KEY:** ')).length,1);assert([3,4].includes(p.after.Options.length));
 assert(p.keyOrderNotice.includes('review only'));assert(p.reviewResponse.selfCheck.counterfactual);assert(p.reviewResponse.selfCheck.closestDistractor);
}
assert.equal(queue.proposed,40);assert.equal(queue.protectedBatch2bRows,39);assert(queue.allOtherQueueRowsExact);
const inventory=read(root+'whole-bank-20261104.json'),cli=read(root+'cli-whole-bank-deletion-final-20261104.json');assert.deepEqual(inventory.totals,cli.totals);
for(const p of packet.filter(p=>!p.pipelinePassed))assert.deepEqual(inventory.variants.find(v=>v.questionVariantId===p.after.variantId).definitionFingerprints,cli.variants.find(v=>v.questionVariantId===p.after.variantId).definitionFingerprints);
assert.equal(manifest.levelFiveBoundInputs.length,8);
const summary=read(root+'validation-summary-20261104.json');assert.equal(summary.typecheck.workspaces,7);assert.equal(summary.clinical.tests,'Tests  4 failed | 981 passed (985)');
console.log(JSON.stringify({filesVerified:manifest.files.length,packetRecords:11,revised:7,frozen:4,noteResponses:77,proposalOnly:40,liveVariants:inventory.totals.uniqueVariants,wholeBankFindings:inventory.totals.findings,protectedBatch2bRows:39,boundInputs:8,typecheck:summary.typecheck.passed+'/7',nothingShipped:true}));
