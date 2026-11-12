// Offline inspection for N0/N1. Does not read saves, run Git, or fetch sources.
import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import * as content from '../../packages/clinical-content/src/index.ts';
import { PROTOTYPE_BALANCE_RELEASE as balance } from '../../packages/balance-config/src/index.ts';
import { collectAuthoredMetadata } from '../question-quality/bank.mjs';
const dir = '.local-dev/question-new-content-20261104';
fs.mkdirSync(dir, { recursive: true });
const metadata = collectAuthoredMetadata(content);
const release = content.SYNTHETIC_CLINICAL_RELEASE;
const catalog = {
  concepts: release.concepts.map(c => ({ ...c, educationalTier: metadata.concepts.get(c.id)?.educationalTier ?? null,
    variants: [...new Set(release.cases.flatMap(k => k.decisionNodes.filter(n => n.primaryConceptId === c.id).map(n => n.questionVariantId)))] })),
  claims: [...metadata.claims.values()], sources: [...metadata.sources.values()],
  unregisteredAuthoredConcepts: [...metadata.concepts.values()].filter(c => !release.concepts.some(r => r.id === c.id)),
  caseSummaries: release.cases.map(c => ({ id: c.id, decisions: c.decisionNodes.map(n => ({ conceptId: n.primaryConceptId, stem: n.stem, key: n.answerChoices.find(a => a.isCorrect)?.label })) })),
  rooms: balance.facility.roomDefinitions.map(r => ({ id: r.id, level: r.unlockFacilityLevel, capabilities: r.capabilityIds })),
  arrivals: balance.arrivals, learning: balance.learning,
  stages: balance.facilityStages,
};
fs.writeFileSync(`${dir}/catalog-before.json`, JSON.stringify(catalog, null, 2));
function files(root) { return fs.readdirSync(root, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(path.join(root, e.name)) : [path.join(root, e.name)]); }
if (!fs.existsSync(`${dir}/baseline.json`)) {
  const paths = ['packages/clinical-content/src', 'packages/game-domain/src', 'packages/game-domain/tests', 'tools/question-quality', 'packages/balance-config/src']
    .flatMap(files).filter(p => /\.(?:ts|mjs|json)$/.test(p));
  fs.writeFileSync(`${dir}/baseline.json`, JSON.stringify({ capturedAt: new Date().toISOString(), files: Object.fromEntries(paths.map(p => [p.replaceAll('\\', '/'), createHash('sha256').update(fs.readFileSync(p)).digest('hex')])) }, null, 2));
}
console.log(JSON.stringify({ concepts: release.concepts.length, cases: release.cases.length, claims: catalog.claims.length, sources: catalog.sources.length, arrivals: catalog.arrivals, learning: catalog.learning, rooms: catalog.rooms }, null, 2));
console.log('\nACTIVE CONCEPTS\n' + catalog.concepts.filter(c => c.variants.length).map(c => `${c.earliestFacilityStage}|${c.educationalTier ?? '?'}|${c.id}|${c.learningObjective}`).join('\n'));
