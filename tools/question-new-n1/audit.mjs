// Filesystem-only ownership audit; no Git and no application/cloud source edits.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { diff } from 'node:util';
const dir = '.local-dev/question-new-content-20261104';
const deferred = ['controlled-enterotomy-mesh-selection', 'direct-inguinal-operative-anatomy', 'meckel-resection-extent',
  'phyllodes-pathology-follow-up', 'postoperative-chylous-ascites', 'postoperative-ileus', 'right-thoracotomy-trauma-exposure',
  'severe-burn-early-enteral-nutrition', 'suspicious-breast-imaging', 'trauma-vka-emergency-reversal'];
const paths = [
  ...fs.readdirSync('packages/clinical-content/src').filter(n => n.startsWith('question-new-n1-')).map(n => `packages/clinical-content/src/${n}`),
  ...fs.readdirSync('tools/question-new-n1').map(n => `tools/question-new-n1/${n}`),
  ...deferred.map(n => `packages/clinical-content/src/approved-data/${n}.test.ts`),
  'packages/clinical-content/src/approved-data/breast-cyst-pathway.test.ts',
  'packages/clinical-content/src/index.ts', 'packages/clinical-content/src/synthetic-content.ts', 'packages/clinical-content/src/answer-choice-timing.ts',
  'packages/game-domain/src/question-new-n1-test-orders.ts', 'packages/game-domain/src/test-choice-orders.ts',
  'packages/game-domain/tests/question-new-n1-admission.test.ts',
  'packages/game-domain/tests/clinical-content-withdrawal.test.ts',
  'docs/execplans/question-new-content-20261104.md', 'docs/research/question-coverage-gaps-20261104.md',
  'docs/research/question-coverage-gaps-20261104.json', 'docs/research/question-new-n1-20261104.json',
  'docs/research/sources-question-new-n1-20261104.json', 'docs/research/question-new-n1-lint-dispositions-20261104.json',
  'docs/handoffs/CURRENT_THREAD_HANDOFF.md',
];
const hash = p => createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const baseline = JSON.parse(fs.readFileSync(`${dir}/baseline.json`, 'utf8'));
const own = new Set(paths);
const observedOtherChanges = Object.entries(baseline.files).filter(([p, old]) => fs.existsSync(p) && hash(p) !== old && !own.has(p)).map(([p]) => p);
const registry = ['index.ts', 'synthetic-content.ts', 'answer-choice-timing.ts'].map(file => {
  const old = fs.readFileSync(`${dir}/registry-before/${file}`, 'utf8').replaceAll('\r\n', '\n').trim();
  const current = fs.readFileSync(`packages/clinical-content/src/${file}`, 'utf8').replaceAll('\r\n', '\n');
  const removed = current.replace(/\/\/ BEGIN N1 append[^\n]*\n[\s\S]*?\/\/ END N1 append[^\n]*(?:\n|$)/g, '').trim();
  // The timing append wraps the existing declaration rather than replacing its body.
  const restored = file === 'answer-choice-timing.ts' ? current
    .replace(/\/\/ BEGIN N1 append[^\n]*\n/g, '')
    .replace(/import \{ QUESTION_NEW_N1_TIMING_ENTRIES \} from "\.\/question-new-n1-20261104";\n/g, '')
    .replace(', ...QUESTION_NEW_N1_TIMING_ENTRIES', '')
    .replace(/\/\/ END N1 append[^\n]*(?:\n|$)/g, '').trim()
    : removed.replace('export const QUESTION_NEW_N1_PRE_RELEASE =', 'export const SYNTHETIC_CLINICAL_RELEASE =');
  return { file, priorPipelinePreservedAfterRemovingN1Append: restored === old,
    note: restored === old ? 'Exact normalized pre-append content retained.' : 'Shared file also changed concurrently; inspect the saved normalized diff.',
    difference: restored === old ? [] : diff(old.split('\n'), restored.split('\n')) };
});
const sensitiveFindings = paths.flatMap(p => {
  if (!fs.existsSync(p) || !/\.(ts|mjs|md|json)$/.test(p)) return [];
  const text = fs.readFileSync(p, 'utf8');
  return [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\b(?:sk-proj-|sk-live-|ghp_|github_pat_)[A-Za-z0-9_-]{20,}/,
    /\beyJ[A-Za-z0-9_-]{25,}\.[A-Za-z0-9_-]{25,}\.[A-Za-z0-9_-]{20,}/,
  ].filter(pattern => pattern.test(text)).map(pattern => ({ path: p, rule: String(pattern) }));
});
const result = { checkedOn: '2026-11-04', method: 'Explicit ownership manifest plus pre-edit filesystem SHA-256 snapshot; no Git.',
  files: paths.filter(p => fs.existsSync(p)).map(p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })),
  registry, sensitiveFindings, observedConcurrentChanges: observedOtherChanges,
  protectedWritePolicy: 'No owned app/player/session/cloud, supabase or Level 5 evidence path. Original clinical definitions were not edited.',
  levelFiveAffectedInputs: [
    'packages/clinical-content/src/index.ts', 'packages/clinical-content/src/synthetic-content.ts', 'packages/clinical-content/src/answer-choice-timing.ts',
    'packages/game-domain/src/test-choice-orders.ts',
    ...paths.filter(p => p.startsWith('packages/clinical-content/src/question-new-n1-') && !p.endsWith('.test.ts')),
    'packages/game-domain/src/question-new-n1-test-orders.ts',
  ],
  levelFiveAction: 'Manager inspects these changed inputs/new transitive dependencies and rebinds evidence in the release tree after accepting the exact integrated content. Worker did not change evidence.',
};
// Read only the binding manifest, never rewrite or re-run the evidence artifact.
const binding = JSON.parse(fs.readFileSync('tools/qa/level-five-integration-results-20261012.json', 'utf8'));
result.existingLevelFiveBoundInputsChangedByN1 = result.levelFiveAffectedInputs.filter(p => Object.hasOwn(binding.inputs, p));
result.newRuntimeSourceInputsForLevelFiveBinding = result.levelFiveAffectedInputs.filter(p => !Object.hasOwn(binding.inputs, p));
fs.writeFileSync(`${dir}/scope-audit.json`, JSON.stringify(result, null, 2) + '\n');
fs.writeFileSync(`${dir}/scoped-files.json`, JSON.stringify(paths, null, 2) + '\n');
console.log(JSON.stringify({ files: result.files.length, sensitiveFindings, registry: registry.map(({ difference, ...row }) => row),
  observedConcurrentChangeCount: observedOtherChanges.length,
  existingLevelFiveBoundInputsChangedByN1: result.existingLevelFiveBoundInputsChangedByN1,
  newRuntimeSourceInputsForLevelFiveBinding: result.newRuntimeSourceInputsForLevelFiveBinding }, null, 2));
