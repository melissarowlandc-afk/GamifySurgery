import assert from 'node:assert/strict';
import {existsSync,mkdirSync,readFileSync,realpathSync,writeFileSync} from 'node:fs';
import {dirname,isAbsolute,relative,resolve} from 'node:path';
import {loadCanvas} from '../gs026-employee-expansion-v1/pipeline.mjs';
import {contactContractPayload,directions,hash,hashText,repo,root,tool,verifyRuntimeBaseline} from './build-roster.mjs';
import {roles} from './role-contract.mjs';
const json=f=>JSON.parse(readFileSync(f,'utf8'));verifyRuntimeBaseline();
const roster=json(resolve(tool,'roster.json')),ledger=json(resolve(tool,'review-acceptance.json')),authored=json(resolve(tool,'authored-contacts.json'));
const staging=json(resolve(root,'staging-registry.json')),visual=json(resolve(root,'worker-review/visual-review.json')),notes=json(resolve(tool,'worker-review-notes.json'));
const comparison=json(resolve(root,'comparison/manifest.json')),all=json(resolve(root,'comparison/all-catalog-manifest.json')),inventory=json(resolve(root,'comparison/existing-inventory.json'));
const placement=json(resolve(root,'placement-qa/placement-manifest.json')),contacts=json(resolve(root,'contact-review/contact-review-manifest.json')),alpha=json(resolve(root,'alpha-normalization-report.json'));
const numbers=roster.identities.map(c=>c.number);assert.equal(numbers.length,14);assert.equal(new Set(numbers).size,14);
for(const entries of [staging.entries,visual.identities])assert.deepEqual(entries.map(c=>c.number),numbers);
for(const keyed of [notes.identities,authored.coordinates,ledger.workerContactEvidence,ledger.workerVisualAcceptance])assert.deepEqual(Object.keys(keyed).sort(),numbers);
assert.equal(ledger.reviewer,'sol-v6d-worker');assert.deepEqual(ledger.accepted,{});assert.equal(staging.runtimeReady,false);assert.equal(staging.ownerApproval,'pending');
assert.equal(visual.schemaVersion,'staff-gapfill-v6d-worker-visual-review/v1');assert.equal(visual.reviewer,ledger.reviewer);
assert.equal(visual.managerAcceptance,'pending');assert.equal(visual.browserValidation,'not-run-left-to-manager');assert.equal(visual.runtimeReady,false);
assert.equal(visual.scope,notes.scope);assert.equal(visual.styleAssessment,notes.styleAssessment);assert.deepEqual(visual.limitations,notes.limitations);
const canvases=new Map();async function canvas(path){const f=resolve(repo,path);if(!canvases.has(f))canvases.set(f,await loadCanvas(f));return canvases.get(f);}
function receipt(r){assert(typeof r.path==='string'&&/^[a-f0-9]{64}$/.test(r.sha256));assert.equal(hash(resolve(repo,r.path)),r.sha256,'review evidence changed '+r.path);}
for(const r of [visual.notes,visual.comparisonManifest,visual.allCatalogComparisonManifest,visual.styleReviewManifest,visual.comparisonAtlasesManifest,visual.contactLedger,visual.alphaReport])receipt(r);
if(notes.paletteCorrection){receipt(visual.paletteCorrection);receipt(visual.navyProof);assert.deepEqual(visual.paletteCorrection,notes.paletteCorrection);assert.deepEqual(visual.managerReview,notes.managerReview);assert.equal(visual.identities.find(c=>c.number==='008').deterministicCorrections,1);const proof=json(resolve(repo,visual.navyProof.path));assert.equal(proof.inputs.length,24);receipt(proof.proof);for(const p of proof.inputs)receipt(p);}
assert.deepEqual(visual.notes,{path:'tools/character-mapping/staff-gapfill-v6d/worker-review-notes.json',sha256:hash(resolve(tool,'worker-review-notes.json'))});
receipt(ledger.seatContactWorkerReview.authoredCoordinates);assert.equal(ledger.seatContactWorkerReview.authoredCoordinates.sha256,hash(resolve(tool,'authored-contacts.json')));
assert.deepEqual(authored.directionOrder,directions);assert.equal(ledger.seatContactWorkerReview.contractSha256,hashText(JSON.stringify(contactContractPayload(roster,ledger))));
assert.equal(visual.authoredContactContractSha256,ledger.seatContactWorkerReview.contractSha256);
assert.deepEqual(visual.alphaReport.summary,alpha.summary);assert.equal(alpha.summary.poses,112);assert.equal(alpha.summary.identities,14);assert.equal(alpha.summary.protectedAlphaClipping,false);
assert(alpha.summary.maxSourceAlphaWithFootprintOutside<=1);assert(alpha.summary.derivedBorderMaxAlpha<=1);assert.equal(staging.derivedAlphaReport.rootWarningAccepted,false);
assert.deepEqual(visual.preGenerationExamples.map(c=>c.id),notes.beforeGenerationExamples);assert.equal(visual.preGenerationExamples.length,16);
for(const c of visual.preGenerationExamples){const prior=inventory.identities.find(p=>p.stillId===c.id);assert(prior);assert.deepEqual(c.pose,{path:prior.standSouth.path,sha256:prior.standSouth.sha256});receipt(c.pose);}
assert.deepEqual(visual.existingRoleBoards,inventory.boards.map(b=>({role:b.role,identities:b.identities,proof:{path:b.file,sha256:b.sha256}})));
for(const b of visual.existingRoleBoards)receipt(b.proof);
let regenerations=0,glasses=0;
for(const [i,e]of staging.entries.entries()){
  const m=json(resolve(repo,e.manifest)),v=visual.identities[i],contact=ledger.seatContacts[e.number],overlay=ledger.workerContactEvidence[e.number],note=notes.identities[e.number];
  assert.equal(v.id,e.stableId);assert.equal(v.role,roles[Math.floor(i/2)]);assert.equal(v.role,m.identity.eligibleStaffRoleDefinitionIds[0]);
  assert.equal(v.sex,m.identity.compatibleSexLabel);assert.equal(v.age,m.identity.intendedAge);assert(v.age>=21&&v.age<=64);
  for(const r of [v,contact,overlay,ledger.workerVisualAcceptance[e.number]])assert.equal(r.sourceSha256,e.sourceSha256);
  assert.deepEqual(contact.workerReviewedDirections,directions);assert.deepEqual(contact.approvedDirections,[]);
  const coordinates=Object.fromEntries(directions.map((d,j)=>[d,authored.coordinates[e.number][j]]));
  assert.deepEqual(v.contacts,coordinates);assert.deepEqual(e.contactCoordinates,coordinates);assert.deepEqual(overlay.coordinates,coordinates);assert.equal(overlay.method,authored.method);
  for(const d of directions){assert(Number.isInteger(coordinates[d])&&coordinates[d]>150&&coordinates[d]<280);assert.equal(contact[d],coordinates[d]);assert.equal(m.poses.sit[d].anchors.seatContactY,coordinates[d]);}
  assert.deepEqual(v.contactOverlay,{path:overlay.file,sha256:overlay.sha256});receipt(v.contactOverlay);
  const within=relative(realpathSync(resolve(root,'worker-review/contact-overlays')),realpathSync(resolve(repo,overlay.file)));assert(within&&!within.startsWith('..')&&!isAbsolute(within));
  const image=await canvas(overlay.file);assert.equal(image.width,1280);assert.equal(image.height,680);
  for(const key of ['features','distinction']){assert.equal(v[key],note[key]);assert(v[key].length>40);}
  assert.equal(v.realizationNote,note.realizationNote);assert.equal(v.regenerations,note.regenerations);regenerations+=v.regenerations;
  assert.equal(v.glasses,notes.glassesIdentities.includes(e.number));
  if(v.glasses)glasses++;
  assert.deepEqual(v.poseProofs,['fullLight','fullDark'].map(k=>({path:m.proofs[k].file,sha256:m.proofs[k].sha256})));
  assert.deepEqual(v.comparisonBoard,comparison.entries[i].board);assert.deepEqual(v.allCatalogBoard,all.entries[i].board);
  const diagnostic=placement.diagnostics.find(c=>c.number===e.number);assert.equal(diagnostic.sourceSha256,e.sourceSha256);
  assert.deepEqual(v.chairProof,{path:diagnostic.directions.south.proof.path,sha256:diagnostic.directions.south.proof.sha256});
  for(const r of [...v.poseProofs,v.comparisonBoard,v.allCatalogBoard,v.chairProof])receipt(r);
}
assert.deepEqual(notes.glassesIdentities,['003','012']);assert.equal(glasses,2);assert(glasses/14<=.3);assert.equal(regenerations,1);assert.equal(visual.identities.find(c=>c.regenerations===1).number,'005');
assert.deepEqual(visual.chairBoards,placement.pages.map(p=>({path:p.proof.path,sha256:p.proof.sha256})));
assert.deepEqual(visual.contactBoards,contacts.pages.map(p=>({path:p.proof.file,sha256:p.proof.sha256})));
for(const r of [...visual.chairBoards,...visual.contactBoards])receipt(r);
const styles=json(resolve(repo,visual.styleReviewManifest.path));assert.equal(styles.comparisons.length,14);assert.equal(styles.styleBoards.length,2);assert.equal(styles.darkBoards.length,4);
assert.deepEqual(styles.darkBoards.flatMap(b=>b.identities),numbers);
for(const c of styles.comparisons){receipt(c.acceptedReference);receipt(c.candidate);}
for(const r of [...styles.styleBoards,...styles.darkBoards.map(c=>c.proof)])receipt(r);
const atlases=json(resolve(repo,visual.comparisonAtlasesManifest.path));assert.equal(atlases.groups.length,15);
for(const kind of ['same-role','all-catalog','contact-overlays']){
  const groups=atlases.groups.filter(c=>c.kind===kind);assert.equal(groups.length,kind==='contact-overlays'?7:4);
  assert.equal(groups.flatMap(c=>c.inputs).length,14);
  const expected=kind==='same-role'?comparison.entries.map(c=>c.board):kind==='all-catalog'?all.entries.map(c=>c.board):numbers.map(n=>({path:ledger.workerContactEvidence[n].file,sha256:ledger.workerContactEvidence[n].sha256}));
  assert.deepEqual(groups.flatMap(c=>c.inputs),expected);
  for(const g of groups){receipt(g.proof);for(const r of g.inputs)receipt(r);}
}
// Filesystem-only audit: actual browser loading/overflow remains a manager check.
const pages=[{file:'review/index.html',images:42,articles:14},{file:'review/source-review.html',images:4},{file:'contact-review/index.html',images:0},{file:'placement-qa/index.html',images:0},{file:'comparison/index.html',images:14,articles:14},{file:'comparison/all-catalog.html',images:14,articles:14},{file:'comparison/roles.html',images:7,articles:7},{file:'review/manager/index.html',images:6},...comparison.entries.map(c=>({file:'comparison/'+c.number+'-all-same-role.html',images:c.comparedExisting+1}))];
let staticLinks=0;
for(const p of pages){const file=resolve(root,p.file),html=readFileSync(file,'utf8');assert.equal([...html.matchAll(/<img\b/gi)].length,p.images,p.file+' image count');if(p.articles)assert.equal([...html.matchAll(/<article\b/gi)].length,p.articles);
  const refs=[...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m=>m[1]);for(const m of html.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g))refs.push(m[2]);
  for(const ref of refs){assert(!/^[a-z]+:|^\/\//i.test(ref),'must remain local '+ref);const target=resolve(dirname(file),ref),within=relative(repo,target);assert(!within.startsWith('..')&&!isAbsolute(within));assert(existsSync(target),'missing '+ref);if(/\.(png|webp)$/i.test(target)){const c=await canvas(target);assert(c.width>0&&c.height>0);}staticLinks++;}
}
const main=readFileSync(resolve(root,'review/index.html'),'utf8');
for(const e of roster.identities){assert(main.includes(e.stableId));assert(main.includes('../comparison/'+e.number+'-all-same-role.html'));assert(main.includes('../placement-qa/'+e.number+'-front-desk-chair-placement.png'));}
const result={status:'PASS',identities:14,poses:112,roles:7,authoredSeatedContacts:56,reviewedChairProofs:14,reviewedRoleSheets:7,reviewedCatalogIdentities:285,reviewedComparisonBoards:28,glassesIdentities:glasses,regenerations,staticGalleryPages:pages.length,mainGalleryImages:42,managerVisualAcceptance:'pending',browserValidation:'not-run-left-to-manager'};
mkdirSync(resolve(root,'validation'),{recursive:true});if(!process.argv.includes('--check-only'))writeFileSync(resolve(root,'validation/worker-review-results.json'),JSON.stringify({...result,staticLinks,alphaSummary:alpha.summary,visualReceipt:{path:'artifacts/character-statics/staff-gapfill-v6d/worker-review/visual-review.json',sha256:hash(resolve(root,'worker-review/visual-review.json'))}},null,2)+'\n');
verifyRuntimeBaseline();console.log(JSON.stringify(result));
