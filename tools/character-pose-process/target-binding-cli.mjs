import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadJson, writeExclusiveJson } from './index.mjs';
import { assertNoLinkedPath, emitBindingGraph, loadPinnedArtifact, loadBindingArtifact, resolveBinding, SCHEMA_SHA256, hashBytes, SYNTHETIC_ARTIFACT_RELATIVE, SYNTHETIC_ARTIFACT_SHA256, SYNTHETIC_DEPENDENCY_FINGERPRINT } from './target-binding.mjs';
import { bindingRequest } from './target-binding-fixtures.mjs';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const root = join(repo, 'Photos for Codex 2', 'Codex Patients or Staff or Other Characters 2', 'mixed-batch-2026-09-10', 'pose-process-proof-v1', 'binding-v1');
const schemaPath = join(root, '..', 'parent-evidence', 'node-schemas.json');
const allowedNames = /^[a-z0-9][a-z0-9._-]*[.]json$/;

function parse(argv) {
  if (!['fixtures', 'inspect', 'resolve', 'emit'].includes(argv[0])) throw new Error('command must be fixtures, inspect, resolve or emit');
  const command = argv[0], options = {}; let i = 1;
  while (i < argv.length) { const flag = argv[i++]; if (!['--request', '--output'].includes(flag) || i >= argv.length || argv[i].startsWith('--') || Object.hasOwn(options, flag)) throw new Error(`unknown, duplicate or incomplete argument ${flag}`); options[flag] = argv[i++]; }
  if (command === 'fixtures' && Object.keys(options).length) throw new Error('fixtures takes no options');
  if (command !== 'fixtures' && (Object.keys(options).length !== 2 || !options['--request'] || !options['--output'])) throw new Error(`${command} requires exactly --request and --output`);
  return { command, options };
}
function owned(name, exists) { if (!allowedNames.test(name) || basename(name) !== name) throw new Error('binding file must be a simple JSON name'); return assertNoLinkedPath(join(root, name), root, { mustExist: exists }); }
function write(name, value) { const path = owned(name, false); writeExclusiveJson(path, value); return path; }

export function main(argv = process.argv.slice(2)) {
  const parsed = parse(argv); assertNoLinkedPath(dirname(root), repo); if (!existsSync(root)) mkdirSync(root); assertNoLinkedPath(root, repo);
  if (parsed.command === 'fixtures') {
    const { artifact } = loadPinnedArtifact(repo); const synthetic = loadBindingArtifact(repo, { path: SYNTHETIC_ARTIFACT_RELATIVE, sha256: SYNTHETIC_ARTIFACT_SHA256, dependencyFingerprint: SYNTHETIC_DEPENDENCY_FINGERPRINT }).artifact;
    const paths = [
      write('patient01-right-walk-1-unbound-request-v3.json', bindingRequest(artifact, 'mixed-20260910-patient-01:right-walk-1', { bound: false })),
      write('synthetic-right-walk-1-request-v3.json', bindingRequest(synthetic, 'synthetic-binding-fixture:right-walk-1')),
      write('synthetic-right-walk-3-request-v3.json', bindingRequest(synthetic, 'synthetic-binding-fixture:right-walk-3')),
    ]; return { command: parsed.command, written: paths };
  }
  const request = loadJson(owned(parsed.options['--request'], true)); const { artifact } = loadBindingArtifact(repo, request.artifact); const resolved = resolveBinding(artifact, request);
  if (parsed.command === 'inspect') return { command: parsed.command, state: resolved.state, selection: resolved.selection, blockers: resolved.blockers ?? [], graphEligible: resolved.graphEligible };
  if (parsed.command === 'resolve') { const path = write(parsed.options['--output'], resolved); return { command: parsed.command, written: path, state: resolved.state }; }
  const schemaBytes = readFileSync(assertNoLinkedPath(schemaPath, join(root, '..', 'parent-evidence'))); if (hashBytes(schemaBytes) !== SCHEMA_SHA256) throw new Error('captured schema bytes changed'); const graph = emitBindingGraph(resolved, JSON.parse(schemaBytes)); const path = write(parsed.options['--output'], graph); return { command: parsed.command, written: path, nodeCount: Object.keys(graph.graph).length, transforms: graph.transforms.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(main())); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
