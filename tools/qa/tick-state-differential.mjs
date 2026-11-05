// Offline CHECK only. Compare every command in the real Level 5 journey with
// the pre-optimization reducer; never regenerate/rebind canonical evidence.
import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { registerHooks, stripTypeScriptTypes } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const clinicalArg = process.argv.find(arg => arg.startsWith('--clinical-root='));
const clinicalRoot = clinicalArg ? path.resolve(clinicalArg.slice('--clinical-root='.length)) : root;
const outputArg = process.argv.find(arg => arg.startsWith('--out='));
const output = path.resolve(outputArg ? outputArg.slice('--out='.length) : path.join(root, '.local-dev/tick-stutter-20261104/implementation/journey'));
assert(!path.relative(root, output).startsWith('..') && !path.isAbsolute(path.relative(root, output)), 'CHECK receipts must stay in the workspace');
fs.mkdirSync(output, { recursive: true });
const read = fs.readFileSync.bind(fs), write = fs.writeFileSync.bind(fs), exists = fs.existsSync.bind(fs);
const sha = value => createHash('sha256').update(value).digest('hex');
const retained = JSON.parse(read(path.join(root, 'tools/qa/level-five-integration-results-20261012.json'), 'utf8'));
const retainedStates = JSON.parse(read(path.join(root, 'tests/fixtures/level-five-integration-checkpoints-20261012.json'), 'utf8'));
const sources = new Map(), inputs = {};
const referenceArg = process.argv.find(arg => arg.startsWith('--reference-root='));
const referenceRoot = referenceArg ? path.resolve(referenceArg.slice('--reference-root='.length)) : null;
const referenceSources = new Map();
const referenceOwned = ['care-room-access.ts','selectors.ts','reducer.ts','spatial.ts','facility-access-cache.ts','employee-training.ts','diagnostic-timing.ts','guidance-tips.ts','tickStateClone.ts','game-evidence.ts'];
if (referenceRoot) for (const file of referenceOwned) {
  const relative = 'packages/game-domain/src/' + file;
  referenceSources.set(path.join(root, relative), read(path.join(referenceRoot, relative)));
}
function collect(relative, sourceRoot = root) {
  for (const entry of fs.readdirSync(path.join(sourceRoot, relative), { withFileTypes: true })) {
    const name = relative + '/' + entry.name;
    if (entry.isDirectory()) collect(name, sourceRoot);
    else if (!/\.(test|spec)\./.test(name) && /\.(ts|json|mjs)$/.test(name)) {
      const bytes = read(path.join(sourceRoot, name)); sources.set(path.join(root, name), bytes); inputs[name] = sha(bytes);
    }
  }
}
collect('packages/game-domain/src'); collect('packages/balance-config/src');
collect('packages/clinical-content/src', clinicalRoot); collect('tests/fixtures'); collect('tools/economy-audit');
if (clinicalRoot !== root) {
  const name = 'packages/game-domain/src/test-choice-orders.ts', bytes = read(path.join(clinicalRoot, name));
  sources.set(path.join(root, name), bytes); inputs[name] = sha(bytes);
}
const reducerPath = path.join(root, 'packages/game-domain/src/reducer.ts');
const guidancePath = path.join(root, 'packages/game-domain/src/guidance-tips.ts');
const availabilityPath = path.join(root, 'packages/game-domain/src/routine-patient-availability.ts');
const pathCachePath = path.join(root, 'packages/game-domain/src/facilityPathCache.ts');
const queryCachePath = path.join(root, 'packages/game-domain/src/tickQueryCache.ts');
for (const name of Object.keys(retained.inputs)) if (!Object.hasOwn(inputs, name)) {
  const sourceRoot = name.startsWith('packages/clinical-content/') || name === 'packages/game-domain/src/test-choice-orders.ts' ? clinicalRoot : root;
  const bytes = read(path.join(sourceRoot, name)); sources.set(path.join(root, name), bytes); inputs[name] = sha(bytes);
}
// Preserve the pre-optimization guidance behavior without retaining another
// production implementation. These exact, local read-only optimizations do
// not alter the concurrent domain worker's surrounding source.
let legacyGuidance = sources.get(guidancePath).toString('utf8');
const lazyBlock = /  \/\/ Preserve timestamp validation,[\s\S]*?  const availability = \(\) => availabilityReason \?\?= getRoutinePatientAvailability\(\{ \.\.\.state, paused: false \}, asOfRealMs, context\)\.reason;/;
assert(lazyBlock.test(legacyGuidance), 'Guidance differential boundary must match the reviewed optimization');
legacyGuidance = legacyGuidance.replace(lazyBlock,
  '  const availability = getRoutinePatientAvailability({ ...state, paused: false }, asOfRealMs, context).reason;')
  .replaceAll('.includes(availability())', '.includes(availability)');
write(path.join(output, 'inputs.json'), JSON.stringify(inputs, null, 2) + '\n');
if (referenceRoot) write(path.join(output, 'reference-inputs.json'), JSON.stringify(Object.fromEntries([...referenceSources].map(([name, bytes]) => [path.relative(root, name).replaceAll('\\', '/'), sha(bytes)])), null, 2) + '\n');
write(path.join(output, 'reference-transform.json'), JSON.stringify({
  reducerSourceSha256: inputs['packages/game-domain/src/reducer.ts'],
  legacyGuidanceSha256: sha(legacyGuidance),
  referenceRoot,
  transforms: referenceRoot ? ['isolated reference imports for the entire domain module graph', 'owned modules loaded from captured entry code; other modules from frozen current sources', 'shared released clinical overlay and test-order mapping', 'every exported command compared byte-for-byte'] : ['current reducer cloneTickState(state) -> existing clonePlain(state)', 'guidance availability scan eager as before optimization', 'all reference availability calls use the literal previous reader', 'reference graph factory retained; independent full-input memo only within one command', 'reference snapshot queries recompute rather than memoize', 'current reducer export wrapped for test-only command comparisons'],
  clinicalRoot, canonicalEvidenceFilesWritten: 0,
}, null, 2) + '\n');
fs.readFileSync = function (file, options) {
  const name = path.resolve(file instanceof URL ? fileURLToPath(file) : String(file)), bytes = sources.get(name);
  return bytes ? typeof options === 'string' || options?.encoding ? bytes.toString(typeof options === 'string' ? options : options.encoding) : bytes : read(file, options);
};
fs.existsSync = file => sources.has(path.resolve(String(file))) || exists(file);
fs.writeFileSync = file => { throw Error('CHECK rejected write: ' + String(file)); };
globalThis.fetch = () => { throw Error('Offline CHECK may not use the network'); };
registerHooks({
  resolve(specifier, context, next) {
    if (referenceRoot && context.parentURL?.includes('?tick-reference')) {
      const resolved = next(specifier, context);
      if (resolved.url.startsWith('file:') && fileURLToPath(resolved.url).startsWith(path.join(root, 'packages/game-domain/src') + path.sep))
        return { ...resolved, url: resolved.url.split('?')[0] + '?tick-reference', shortCircuit: true };
      return resolved;
    }
    if (context.parentURL?.includes('?tick-reference') && specifier === './guidance-tips')
      return { url: pathToFileURL(guidancePath).href + '?tick-reference', shortCircuit: true };
    if (context.parentURL?.includes('?tick-reference') && specifier === './routine-patient-availability')
      return { url: pathToFileURL(path.join(root, 'packages/game-domain/src/routineAvailabilityReference.testSupport.ts')).href, shortCircuit: true };
    return next(specifier, context);
  },
  load(url, context, next) {
    const name = url.startsWith('file:') ? fileURLToPath(url) : '';
    if (referenceRoot && url.includes('?tick-reference')) {
      const source = (referenceSources.get(name) ?? sources.get(name) ?? read(name)).toString('utf8');
      return { format: 'module', source: stripTypeScriptTypes(source, { mode: 'transform', sourceUrl: url }), shortCircuit: true };
    }
    if (name !== reducerPath && name !== availabilityPath && name !== pathCachePath && name !== queryCachePath && !(name === guidancePath && url.includes('?tick-reference'))) return next(url, context);
    let source = fs.readFileSync(name, 'utf8');
    if (url.includes('?tick-reference')) {
      if (name === guidancePath) source = legacyGuidance;
      else {
        assert(source.includes('const next = cloneTickState(state);'), 'Reducer differential boundary must match');
        source = source.replace('const next = cloneTickState(state);', 'const next = clonePlain(state);');
      }
    } else if (name === pathCachePath) {
      source = source.replace('  const definitions =', '  if (globalThis.__tickReferenceActive) return globalThis.__tickReferenceGraph(rooms, doors, getDefinition, endpointOnly, build);\n  const definitions =');
    } else if (name === queryCachePath) {
      source = source.replace('  const values =', '  if (globalThis.__tickReferenceActive) return query;\n  const values =');
    } else if (name === availabilityPath) {
      source = source.replace('export function getRoutinePatientAvailability(', 'function streamingRoutinePatientAvailability(');
      source += '\nexport function getRoutinePatientAvailability(state, at, context = PROTOTYPE_DOMAIN_CONTEXT) { return globalThis.__tickReferenceActive ? globalThis.__tickAvailabilityReference(state, at, context) : streamingRoutinePatientAvailability(state, at, context); }\n';
    } else {
      source = source.replace('export function gameReducer(', 'function tickOptimizedReducer(');
      source += '\nexport function gameReducer(state, command, context = PROTOTYPE_DOMAIN_CONTEXT) { return globalThis.__tickCompare ? globalThis.__tickCompare(tickOptimizedReducer, state, command, context) : tickOptimizedReducer(state, command, context); }\n';
    }
    return { format: 'module', source: stripTypeScriptTypes(source, { mode: 'transform', sourceUrl: url }), shortCircuit: true };
  },
});
const { gameReducer: reference } = await import(pathToFileURL(reducerPath).href + '?tick-reference');
const { getRoutinePatientAvailability: availabilityReference } = await import('../../packages/game-domain/src/routineAvailabilityReference.testSupport.ts');
globalThis.__tickAvailabilityReference = availabilityReference;
const { runLevelFiveIntegrationJourney } = await import('../../tests/fixtures/level-five-integration.ts');
const { createLevelFiveStateQaContext } = await import('../../tests/fixtures/level-five-state.ts');
const { serializeGameState } = await import('../../packages/game-domain/src/index.ts');
let comparing = false, compared = 0, optimizedMs = 0, referenceMs = 0;
// The original graph factory is pure. Full-input (not production geometry-key)
// memoization inside one command avoids rebuilding the identical reference
// graph for hundreds of case/employee checks. The original factory still runs
// for every distinct set of inputs, and every caller receives private maps.
// Reset on every command: cross-tick cache invalidation remains differential.
let referenceGraphs = new Map(), referenceGraphBuilds = 0, referenceGraphHits = 0;
globalThis.__tickReferenceGraph = (rooms, doors, getDefinition, endpoints, build) => {
  const key = JSON.stringify([rooms, doors, rooms.map(room => getDefinition(room.roomDefinitionId)), [...endpoints]]);
  let graph = referenceGraphs.get(key);
  if (!graph) { graph = build(); referenceGraphs.set(key, graph); referenceGraphBuilds++; }
  else referenceGraphHits++;
  return new Map([...graph].map(([point, neighbors]) => [point, new Set(neighbors)]));
};
const frozen = new WeakSet();
function freeze(value) {
  if (value && typeof value === 'object' && !frozen.has(value)) {
    frozen.add(value); Object.values(value).forEach(freeze); Object.freeze(value);
  }
}
globalThis.__tickCompare = (reduce, state, command, context) => {
  if (comparing) return reduce(state, command, context);
  comparing = true;
  try {
    // Every shared leaf is read-only during a tick. Explicit commands still
    // clone before editing a card, review, answer, event or financial record.
    freeze(state.learningHistories); freeze(state.reviewIntents); freeze(state.schedulerPins);
    state.events.forEach(freeze); state.settlements.forEach(freeze); state.serviceIncomeReceipts.forEach(freeze);
    Object.values(state.encounters).forEach(row => freeze(row.frozenCase));
    Object.values(state.employeeDiscussions ?? {}).forEach(row => freeze(row.frozenCase));
    referenceGraphs = new Map();
    globalThis.__tickReferenceActive = true;
    let started = performance.now(), expected;
    try { expected = reference(state, command, context); }
    finally { globalThis.__tickReferenceActive = false; }
    referenceMs += performance.now() - started;
    started = performance.now(); const actual = reduce(state, command, context); optimizedMs += performance.now() - started;
    const left = JSON.stringify(actual), right = JSON.stringify(expected);
    if (left !== right) {
      write(path.join(output, 'mismatch.json'), JSON.stringify({ compared, command, tick: state.facilityTick,
        actualSha256: sha(left), referenceSha256: sha(right) }, null, 2));
      throw Error(`Byte mismatch for ${command.type} ${command.operationId} at ${state.facilityTick}`);
    }
    compared++; return actual;
  } finally { comparing = false; }
};
const started = performance.now();
const journey = runLevelFiveIntegrationJourney(createLevelFiveStateQaContext(), message => {
  process.stdout.write(message + '\n');
  write(path.join(output, 'progress.json'), JSON.stringify({ message, comparedCommands: compared, optimizedMs, referenceMs, elapsedMs: performance.now() - started }, null, 2));
});
const counts = state => ({ completions: (state.retiredEncounterSummary?.completedCount ?? 0) + Object.values(state.encounters).filter(row => row.resolutionReason === 'completed').length,
  walkouts: (state.retiredEncounterSummary?.retiredCount ?? 0) - (state.retiredEncounterSummary?.completedCount ?? 0) + Object.values(state.encounters).filter(row => row.resolutionReason === 'walkout').length });
const checkpoints = Object.fromEntries(Object.entries(journey.checkpoints).map(([name, state]) => [name,
  { identical: JSON.stringify(JSON.parse(serializeGameState(state))) === JSON.stringify(retainedStates[name]), tick: state.facilityTick }]));
const expectedInputs = Object.fromEntries(Object.entries(retained.inputs).map(([name, hash]) => [name, retained.replayCompatibleInputs?.[name]?.currentHash ?? hash]));
const result = { mode: 'read-only CHECK / every-command differential', clinicalRoot, commands: journey.commands,
  closingCashCents: journey.state.cashCents, ...counts(journey.state), comparedCommands: compared,
  checkpoints, reportsIdentical: JSON.stringify(journey.reports) === JSON.stringify(retained.reports),
  optimizedMs, referenceMs, referenceGraphBuilds, referenceGraphHits, elapsedMs: performance.now() - started,
  changedBoundInputs: Object.keys(expectedInputs).filter(name => inputs[name] && inputs[name] !== expectedInputs[name])
    .map(name => ({ path: name, expected: expectedInputs[name], actual: inputs[name] })),
  newRuntimeInputs: Object.keys(inputs).filter(name => name.startsWith('packages/game-domain/src/') && !Object.hasOwn(expectedInputs, name) && !name.endsWith('.testSupport.ts')),
  evidenceFilesWritten: 0 };
write(path.join(output, 'result.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
assert.equal(result.commands, 26_362); assert.equal(result.closingCashCents, 6_056_335);
assert.equal(result.completions, 410); assert.equal(result.walkouts, 0);
assert(result.reportsIdentical, 'Retained inspection reports must remain exact');
assert(Object.values(checkpoints).every(row => row.identical), 'All retained checkpoints must remain byte exact');
