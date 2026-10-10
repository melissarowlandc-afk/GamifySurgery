// Run after actual inspection of the named native and saved proof images.
// This binds worker QA, never manager approval or runtime readiness.
import assert from 'node:assert/strict';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {repo,root,tool,hash,rel,verifyRuntimeBaseline} from './build-roster.mjs';
const json=f=>JSON.parse(readFileSync(f,'utf8'));verifyRuntimeBaseline();
const notesFile=resolve(tool,'worker-review-notes.json'),notes=json(notesFile),staging=json(resolve(root,'staging-registry.json'));
const inventory=json(resolve(root,'comparison/existing-inventory.json')),comparison=json(resolve(root,'comparison/manifest.json')),all=json(resolve(root,'comparison/all-catalog-manifest.json'));
const placement=json(resolve(root,'placement-qa/placement-manifest.json')),contacts=json(resolve(root,'contact-review/contact-review-manifest.json'));
const ledger=json(resolve(tool,'review-acceptance.json')),alpha=json(resolve(root,'alpha-normalization-report.json'));
assert.equal(staging.entries.length,8);assert.equal(ledger.reviewer,notes.reviewer);assert.deepEqual(ledger.accepted,{});
const receipt=(path,sha256=hash(resolve(repo,path)))=>{assert.equal(hash(resolve(repo,path)),sha256);return {path,sha256};};
const manifest=file=>receipt(rel(resolve(root,file)));
const visual={schemaVersion:'app-gapfill-v6e-worker-visual-review/v1',reviewer:notes.reviewer,scope:notes.scope,managerAcceptance:'pending',browserValidation:'not-run-left-to-manager',runtimeReady:false,
  notes:receipt(rel(notesFile)),preGenerationExamples:notes.beforeGenerationExamples.map(id=>{const c=inventory.identities.find(c=>c.stillId===id);assert(c);return {id,pose:receipt(c.standSouth.path,c.standSouth.sha256)};}),
  existingRoleBoards:inventory.boards.map(b=>({role:b.role,identities:b.identities,proof:receipt(b.file,b.sha256)})),
  comparisonManifest:manifest('comparison/manifest.json'),allCatalogComparisonManifest:manifest('comparison/all-catalog-manifest.json'),
  styleReviewManifest:manifest('review/manager/style-review-manifest.json'),comparisonAtlasesManifest:manifest('review/manager/qa-atlases-manifest.json'),
  chairBoards:placement.pages.map(p=>receipt(p.proof.path,p.proof.sha256)),contactBoards:contacts.pages.map(p=>receipt(p.proof.file,p.proof.sha256)),
  contactLedger:receipt(rel(resolve(tool,'review-acceptance.json'))),authoredContactContractSha256:ledger.seatContactWorkerReview.contractSha256,
  alphaReport:{...manifest('alpha-normalization-report.json'),summary:alpha.summary,status:'worker-QA-pass-with-alpha1-noise;manager-acceptance-pending'},
  identities:staging.entries.map(e=>{const m=json(resolve(repo,e.manifest)),chair=placement.diagnostics.find(c=>c.number===e.number),contact=ledger.workerContactEvidence[e.number],note=notes.identities[e.number];assert(note);
    return {number:e.number,id:e.stableId,role:m.identity.eligibleStaffRoleDefinitionIds[0],sex:m.identity.compatibleSexLabel,age:m.identity.intendedAge,sourceSha256:e.sourceSha256,...note,glasses:notes.glassesIdentities.includes(e.number),
      poseProofs:['fullLight','fullDark'].map(k=>receipt(m.proofs[k].file,m.proofs[k].sha256)),
      comparisonBoard:comparison.entries.find(c=>c.number===e.number).board,allCatalogBoard:all.entries.find(c=>c.number===e.number).board,
      chairProof:receipt(chair.directions.south.proof.path,chair.directions.south.proof.sha256),contactOverlay:receipt(contact.file,contact.sha256),contacts:contact.coordinates,status:'worker-visual-QA-pass;manager-acceptance-pending'};}),
  styleAssessment:notes.styleAssessment,limitations:notes.limitations,
  ...(notes.paletteCorrection?{paletteCorrection:receipt(notes.paletteCorrection.path,notes.paletteCorrection.sha256),navyProof:manifest('corrections/008-navy-palette-v1/proof-manifest.json'),managerReview:notes.managerReview}: {})};
mkdirSync(resolve(root,'worker-review'),{recursive:true});writeFileSync(resolve(root,'worker-review/visual-review.json'),JSON.stringify(visual,null,2)+'\n');
verifyRuntimeBaseline();console.log(JSON.stringify({status:'PASS',workerReviewedIdentities:8,posesReviewed:64,sameRoleComparisonBoards:8,wholeCatalogComparisonBoards:8,roleSheets:1,chairProofs:8,authoredContactDirections:32,regenerations:0,managerAcceptance:'pending'}));
