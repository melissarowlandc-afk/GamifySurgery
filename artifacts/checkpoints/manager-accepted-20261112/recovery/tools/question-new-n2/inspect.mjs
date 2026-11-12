// Offline baseline/candidate catalog. No saves, Git or source retrieval.
import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
const content = await import('../../packages/clinical-content/src/index.ts');
const { collectAuthoredMetadata } = await import('../question-quality/bank.mjs');
const { PROTOTYPE_BALANCE_RELEASE: balance } = await import('../../packages/balance-config/src/index.ts');
const dir = '.local-dev/question-new-n2-20261104';
fs.mkdirSync(dir, { recursive: true });
if (fs.existsSync(`${dir}/baseline.json`)) throw new Error('Baseline already captured; preserve it.');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
function files(root) { return fs.readdirSync(root, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(path.join(root, e.name)) : [path.join(root, e.name).replaceAll('\\','/')]); }
const watched = ['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','tools/question-quality','packages/balance-config/src']
  .flatMap(files).filter(p => /\.(ts|mjs|json)$/.test(p));
const n1Frozen = [...files('packages/clinical-content/src').filter(p => p.includes('/question-new-n1-') && !p.endsWith('.test.ts')),
  'docs/research/question-new-n1-20261104.json', 'docs/research/sources-question-new-n1-20261104.json',
  'docs/research/question-new-n1-lint-dispositions-20261104.json'];
const baseline = { capturedAt: new Date().toISOString(), method: 'Filesystem SHA-256; no Git.',
  files: Object.fromEntries(watched.map(p => [p,hash(fs.readFileSync(p))])),
  n1FrozenFiles: Object.fromEntries(n1Frozen.map(p => [p,hash(fs.readFileSync(p))])),
  n1CasesSha256: hash(JSON.stringify(content.QUESTION_NEW_N1_CASES)),
  n1QuestionsSha256: hash(JSON.stringify(content.QUESTION_NEW_N1_QUESTIONS)),
  releaseSha256: hash(JSON.stringify(content.SYNTHETIC_CLINICAL_RELEASE)) };
const metadata = collectAuthoredMetadata(content), release = content.SYNTHETIC_CLINICAL_RELEASE;
const catalog = { releaseId: release.id, releaseSha256: baseline.releaseSha256,
  concepts: release.concepts.map(c => ({...c, educationalTier: metadata.concepts.get(c.id)?.educationalTier ?? null,
    variants: [...new Set(release.cases.flatMap(cs => cs.decisionNodes.filter(n => n.primaryConceptId === c.id).map(n => n.questionVariantId)))] })),
  authoredConcepts: [...metadata.concepts.values()], claims: [...metadata.claims.values()], sources: [...metadata.sources.values()],
  cases: release.cases.map(c => ({id:c.id,level:c.earliestFacilityStage,decisions:c.decisionNodes.map(n => ({conceptId:n.primaryConceptId,stem:n.stem,key:n.answerChoices.find(a=>a.isCorrect)?.label}))})),
  rooms: balance.facility.roomDefinitions.map(r => ({id:r.id,level:r.unlockFacilityLevel,capabilities:r.capabilityIds})) };
fs.writeFileSync(`${dir}/baseline.json`, JSON.stringify(baseline,null,2)+'\n');
fs.writeFileSync(`${dir}/catalog-before.json`, JSON.stringify(catalog,null,2)+'\n');
fs.mkdirSync(`${dir}/registry-before`,{recursive:true});
for(const p of ['packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts','packages/clinical-content/src/answer-choice-timing.ts','packages/game-domain/src/test-choice-orders.ts'])
  fs.copyFileSync(p,`${dir}/registry-before/${path.basename(p)}`);
fs.writeFileSync(`${dir}/claims-inventory.txt`,catalog.claims.map(c=>`${c.id} | ${c.statement}`).join('\n')+'\n');
fs.writeFileSync(`${dir}/concept-inventory.txt`,catalog.concepts.map(c=>`${c.id} | ${c.learningObjective} | ${c.variants.length} variants`).join('\n')+'\n');
console.log(JSON.stringify({registered:release.concepts.length,cases:release.cases.length,nodes:release.cases.flatMap(c=>c.decisionNodes).length,
  authoredConcepts:catalog.authoredConcepts.length,claims:catalog.claims.length,sources:catalog.sources.length,n1FrozenFiles:n1Frozen.length}));
