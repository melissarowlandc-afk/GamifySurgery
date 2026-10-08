import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { stripTypeScriptTypes } from 'node:module';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

// Mirrored from the accepted v6b/v5 contracts. The original generation tools,
// review labels and all accepted art remain frozen. Only new integration tools
// and the catalog/registry/provenance append seams are writable.
export const batch = 'patient-gapfill-v6c';
export const cohort = 'patientGapfillV6c';
export const priorCounts = Object.freeze({ identities: 285, cardinalPoses: 2280, clipboardPoses: 30, assets: 2310 });
export const resultingCounts = Object.freeze({ identities: 304, cardinalPoses: 2432, clipboardPoses: 30, assets: 2462 });
export const priorPatientCount = 160, resultingPatientCount = 179, addedIdentities = 19, addedAssets = 152;
export const successor = 'staff-gapfill-v6d';
export const roles = ['staff.imaging_technician', 'staff.phlebotomist', 'staff.laboratory_technician', 'staff.surgeon', 'staff.or_nurse', 'staff.pharmacist', 'staff.repair_person'];
export const tool = resolve(fileURLToPath(new URL('.', import.meta.url)));
export const repo = resolve(tool, '../../..');
export const root = resolve(repo, 'artifacts/character-statics', batch);
export const directions = ['south', 'east', 'west', 'north'];
export const registryPath = 'apps/player/src/art/characterStillRegistry.generated.json';
export const provenancePath = 'tools/character-mapping/gs026-runtime-stills/provenance-manifest.json';
export const catalogPath = 'packages/game-domain/src/characterStillCatalog.ts';
export const approvalSnapshot = resolve(root, 'owner-runtime-approval.json');
export const baselineDirectory = resolve(root, 'runtime-integration-baseline');
export const baselineManifest = resolve(baselineDirectory, 'manifest.json');
export const readJson = file => JSON.parse(readFileSync(file, 'utf8'));
export const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
export const hashText = value => createHash('sha256').update(value).digest('hex');
export const rel = file => relative(repo, file).replaceAll('\\', '/');
export const writeJson = (file, value) => writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
export const ownerInstruction = 'use codex to design characters to fill in all the gaps, make sure the style of these characters is matching the style of all the previously generated characters. If they look okay to you, you can implement them into the game.';
const acceptancePrefix = '- 2026-10-08: v6c (.018 regenerated) and v6d (.008 navy correction) MANAGER ACCEPTED';
const cohortFor = value => value === 'patient-gapfill-v6c' ? 'patientGapfillV6c' : 'staffGapfillV6d';
const batchTool = value => resolve(repo, 'tools/character-mapping', value);
const batchRoot = value => resolve(repo, 'artifacts/character-statics', value);

// Side-effect-free catalog evaluation, identical to the accepted integration.
export function loadCatalog() {
  const allowed = new Set([resolve(repo, catalogPath), resolve(repo, 'packages/game-domain/src/patientAppearanceCatalog.ts')]);
  const cache = new Map();
  function load(file) {
    assert(allowed.has(file), `unexpected catalog dependency ${file}`);
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} }; cache.set(file, module);
    const stripped = stripTypeScriptTypes(readFileSync(file, 'utf8'));
    const exports = [...stripped.matchAll(/export (?:const|function) (\w+)/g)].map(match => match[1]);
    const compiled = stripped.replace(/import\s*\{([\s\S]*?)\}\s*from\s*["']([^"']+)["'];/g, (_, names, specifier) => `const {${names}} = require(${JSON.stringify(specifier)});`).replace(/\bexport /g, '') + `\nmodule.exports = {${exports.join(',')}};`;
    runInNewContext(compiled, { module, require: specifier => load(resolve(dirname(file), specifier + '.ts')) }, { filename: file });
    return module.exports;
  }
  return JSON.parse(JSON.stringify(load(resolve(repo, catalogPath)).CHARACTER_STILL_CATALOG));
}

export function assertOwnerApproved(value = batch) {
  assert(['patient-gapfill-v6c', 'staff-gapfill-v6d'].includes(value));
  const directory = batchTool(value), artifacts = batchRoot(value);
  const approval = readJson(resolve(directory, 'owner-approval.json'));
  assert.equal(approval.schemaVersion, `${value}-owner-runtime-approval/v1`);
  assert.equal(approval.status, 'approved'); assert.equal(approval.approvedBy, 'GamifySurgery manager (Claude Code)');
  assert.equal(approval.authorizedBy, 'owner'); assert.equal(approval.date, '2026-10-08');
  assert.equal(approval.ownerInstruction, ownerInstruction);
  assert.equal(approval.managerAcceptance.path, 'docs/execplans/character-gapfill-v6-20261007.md');
  const plan = readFileSync(resolve(repo, approval.managerAcceptance.path), 'utf8');
  assert.equal(hashText(approval.managerAcceptance.statement), approval.managerAcceptance.sha256);
  assert(plan.includes(approval.managerAcceptance.statement), 'manager acceptance record changed');
  assert(approval.managerAcceptance.statement.startsWith(acceptancePrefix));
  assert(approval.managerAcceptance.statement.includes('gallery validators PASS after fixes'));
  assert(approval.managerAcceptance.statement.includes('combined v6c+v6d append-only runtime integration'));
  assert(plan.replace(/\r?\n/g, ' ').includes(ownerInstruction));
  for (const evidence of approval.evidence) assert.equal(hash(resolve(repo, evidence.path)), evidence.sha256, 'approved evidence changed ' + evidence.path);
  const roster = readJson(resolve(directory, 'roster.json')), acceptance = readJson(resolve(directory, 'review-acceptance.json'));
  assert.equal(roster.identities.length, value === 'patient-gapfill-v6c' ? 19 : 14);
  assert.equal(acceptance.reviewer, value === 'patient-gapfill-v6c' ? 'sol-v6c-worker' : 'sol-v6d-worker');
  assert.deepEqual(approval.allocation, roster.allocation);
  if (value === 'patient-gapfill-v6c') assert.deepEqual(roster.allocation, { Female: { older_adult: 7, adult: 2 }, Male: { older_adult: 8, adult: 2 } });
  const sourceHashes = {};
  const contacts = roster.identities.map((identity, index) => {
    assert.equal(identity.number, String(index + 1).padStart(3, '0'));
    assert.equal(identity.stableId, `${value}.${identity.number}`);
    assert.equal(identity.category, value === 'patient-gapfill-v6c' ? 'patient' : 'staff');
    if (identity.category === 'staff') assert.deepEqual(identity.eligibleStaffRoleDefinitionIds, [roles[Math.floor(index / 2)]], 'each staff identity belongs to exactly its assigned role');
    const sourceSha256 = hash(resolve(artifacts, 'sources', identity.number, 'source.png'));
    sourceHashes[identity.number] = sourceSha256;
    assert.equal(acceptance.workerVisualAcceptance[identity.number].sourceSha256, sourceSha256);
    assert(!acceptance.rejected?.[identity.number]?.includes(sourceSha256));
    const contact = acceptance.seatContacts[identity.number];
    assert.equal(contact.sourceSha256, sourceSha256); assert.deepEqual(contact.workerReviewedDirections, directions);
    assert.deepEqual(approval.acceptedContacts[identity.number], Object.fromEntries(directions.map(direction => [direction, contact[direction]])));
    const manifest = readJson(resolve(artifacts, 'packages', identity.number, 'manifest.json'));
    assert.equal(manifest.source.stage2.png.sha256, sourceSha256);
    const poseHashes = Object.fromEntries(['stand', 'sit'].flatMap(posture => directions.map(direction => {
      const pose = manifest.poses[posture][direction];
      assert.equal(hash(resolve(repo, pose.file)), pose.sha256);
      assert.equal(pose.anchors.bodyAxisX, 80); assert.equal(pose.anchors.floorY, 287);
      if (posture === 'sit') assert.equal(pose.anchors.seatContactY, contact[direction]);
      return [`${posture}-${direction}`, pose.sha256];
    })));
    assert.deepEqual(approval.acceptedPoses[identity.number], poseHashes, 'approval must bind exact accepted corrected pose bytes');
    return { number: identity.number, sourceSha256, contacts: approval.acceptedContacts[identity.number] };
  });
  assert.deepEqual(approval.acceptedSources, sourceHashes);
  const contactHash = hashText(JSON.stringify(contacts));
  assert.equal(approval.seatContactContractSha256, contactHash);
  assert.equal(acceptance.seatContactWorkerReview.contractSha256, contactHash);
  const alphaHash = hash(resolve(artifacts, 'alpha-normalization-report.json'));
  assert.equal(approval.derivedAlphaReportSha256, alphaHash);
  const visual = readJson(resolve(artifacts, 'worker-review/visual-review.json'));
  assert.equal(visual.alphaReport.sha256, alphaHash); assert.equal(visual.authoredContactContractSha256, contactHash);
  const browser = readJson(resolve(artifacts, 'validation/gallery-browser-results.json'));
  assert.equal(browser.status, 'PASS'); assert.equal(browser.identities, roster.identities.length); assert.equal(browser.poses, roster.identities.length * 8);
  for (const page of browser.results) assert.equal(hash(resolve(repo, page.page)), page.pageSha256, 'accepted browser evidence must reference current corrected gallery bytes');
  if (value === 'patient-gapfill-v6c') {
    assert.equal(sourceHashes['018'], '4bf3c14e8b4b9965510cea919be7f229a3dc3af5b7a556d4c68cf511717d976a');
    assert.equal(approval.acceptedCorrection.identityId, 'patient-gapfill-v6c.018');
    assert.equal(roster.identities[17].intendedAge, 33);
  } else {
    assert.equal(approval.acceptedCorrection.identityId, 'staff-gapfill-v6d.008');
    const correction = readJson(resolve(directory, 'corrections/008-navy-palette-v1.json'));
    assert.equal(correction.identity, 'staff-gapfill-v6d.008');
    for (const pose of correction.correctedPoses ?? []) assert.equal(hash(resolve(repo, pose.path)), pose.sha256);
  }
  return { roster, acceptance, approval };
}

export function expectedCatalogAdditions(value = batch) {
  return assertOwnerApproved(value).roster.identities.map(identity => identity.category === 'patient'
    ? { stillId: identity.stableId, category: 'patient', sourceCohort: value, compatibleSexLabel: identity.compatibleSexLabel, intendedAge: identity.intendedAge, ageBand: identity.ageBand }
    : { stillId: identity.stableId, category: 'staff', sourceCohort: value, eligibleStaffRoleDefinitionIds: identity.eligibleStaffRoleDefinitionIds });
}

export function expectedRuntimeCharacters(value = batch) {
  const { roster, acceptance } = assertOwnerApproved(value), artifacts = batchRoot(value);
  return roster.identities.map(identity => {
    const manifest = readJson(resolve(artifacts, 'packages', identity.number, 'manifest.json'));
    const poses = Object.fromEntries(['stand', 'sit'].map(posture => [posture, Object.fromEntries(directions.map(direction => {
      const pose = manifest.poses[posture][direction];
      return [direction, { url: `art/characters/${value}/${identity.stableId}/${posture}-${direction}.png`, sha256: pose.sha256, width: 160, height: 320,
        anchors: { bodyAxisX: 80, floorY: 287, ...(posture === 'sit' ? { seatContactY: acceptance.seatContacts[identity.number][direction], seatContactStatus: 'owner-delegated-manager-approved-authored-contact' } : {}) }, visibleBounds: pose.visibleBounds }];
    }))]));
    return { id: identity.stableId, cohort: cohortFor(value), category: identity.category === 'patient' ? 'patient-or-general-population' : 'employee',
      ...(identity.category === 'staff' ? { role: identity.eligibleStaffRoleDefinitionIds[0], eligibleStaffRoleDefinitionIds: identity.eligibleStaffRoleDefinitionIds } : {}),
      intendedAge: identity.intendedAge, intendedSex: identity.compatibleSexLabel, displayGender: identity.compatibleSexLabel === 'Female' ? 'Woman' : 'Man', poses };
  });
}

function recordedFiles(value, output = []) {
  if (!value || typeof value !== 'object') return output;
  if (typeof value.path === 'string' && typeof value.sha256 === 'string' && typeof value.bytes === 'number') output.push(value);
  else for (const item of Object.values(value)) recordedFiles(item, output);
  return output;
}
export function verifyGenerationPins() {
  const pinned = readJson(resolve(tool, 'runtime-baseline.json'));
  for (const file of recordedFiles(pinned)) {
    assert.equal(hash(resolve(repo, file.path)), file.sha256, 'generation-pinned art/source/control changed ' + file.path);
    assert.equal(statSync(resolve(repo, file.path)).size, file.bytes);
  }
  const registry = readJson(resolve(repo, registryPath)), catalog = loadCatalog();
  for (const entry of pinned.priorRegistry) assert.deepEqual(registry.characters.find(item => item.id === entry.id), entry);
  for (const entry of pinned.priorCatalog) assert.deepEqual(catalog.find(item => item.stillId === entry.stillId), entry);
  return pinned;
}

export function captureIntegrationBaseline() {
  if (existsSync(baselineManifest)) return readIntegrationBaseline();
  verifyGenerationPins();
  const { roster } = assertOwnerApproved();
  const registry = readJson(resolve(repo, registryPath)), catalog = loadCatalog(), provenance = readJson(resolve(repo, provenancePath));
  assert.deepEqual(registry.counts, priorCounts); assert.equal(registry.characters.length, priorCounts.identities);
  assert.equal(catalog.length, priorCounts.identities); assert.equal(catalog.filter(entry => entry.category === 'patient').length, priorPatientCount);
  assert.equal(provenance.assets.length, priorCounts.assets);
  const runtimeAssets = registry.characters.flatMap(entry => [...Object.values(entry.poses.stand), ...Object.values(entry.poses.sit), ...(entry.clipboard ? [entry.clipboard] : [])].map(asset => {
    const path = `apps/player/public/${asset.url}`;
    assert.equal(hash(resolve(repo, path)), asset.sha256, 'pre-edit runtime asset mismatch ' + path);
    return { path, sha256: asset.sha256, bytes: statSync(resolve(repo, path)).size };
  }));
  assert.equal(runtimeAssets.length, priorCounts.assets); assert.equal(new Set(runtimeAssets.map(asset => asset.path)).size, priorCounts.assets);
  const paths = [registryPath, provenancePath, catalogPath, 'packages/game-domain/src/characterStillCatalog.test.ts', 'apps/player/src/art/characterStillRegistry.ts', 'apps/player/src/art/characterStillRegistry.test.ts',
    ...['owner-approval.json', 'review-acceptance.json', 'roster.json', 'runtime-baseline.mjs', 'build-roster.mjs', 'validate-roster.mjs', 'validate-placement-qa.mjs', 'validate-worker-review.mjs', 'validate-all-catalog-comparison.mjs', 'README.md'].map(name => rel(resolve(tool, name))),
    ...['staging-registry.json', 'contact-review/contact-review-manifest.json', 'placement-qa/placement-manifest.json'].map(name => rel(resolve(root, name))),
    ...roster.identities.map(identity => rel(resolve(root, 'packages', identity.number, 'manifest.json')))];
  const files = paths.map(path => {
    const copiedTo = resolve(baselineDirectory, path); mkdirSync(dirname(copiedTo), { recursive: true });
    assert(!existsSync(copiedTo), 'refusing to overwrite immutable snapshot ' + rel(copiedTo));
    copyFileSync(resolve(repo, path), copiedTo);
    return { path, copiedTo: rel(copiedTo), sha256: hash(copiedTo) };
  });
  const stablePaths = new Set(['packages/game-domain/src/appearance.ts']);
  for (const input of Object.values(provenance.inputs)) if (input.file) stablePaths.add(input.file);
  for (const record of provenance.assets) for (const item of [{ path: record.sourceFile, sha256: record.sourceSha256 }, record.sourceSheet, record.sourceProvenance, record.ownerApproval]) {
    if (item?.path || item?.file) {
      const path = item.path ?? item.file;
      if (item.sha256) assert.equal(hash(resolve(repo, path)), item.sha256, 'historical source/control hash mismatch ' + path);
      stablePaths.add(path);
    }
  }
  for (const file of recordedFiles(readJson(resolve(tool, 'runtime-baseline.json')))) stablePaths.add(file.path);
  // Freeze both accepted batches at v6c intake, including tools, histories and
  // manager browser receipts. New integration tools are recorded separately.
  for (const value of ['patient-gapfill-v6c', 'staff-gapfill-v6d']) {
    const directory = batchTool(value), artifacts = batchRoot(value);
    for (const base of [directory, ...['sources', 'packages', 'review', 'worker-review', 'comparison', 'contact-review', 'placement-qa', 'corrections'].map(name => resolve(artifacts, name))]) {
      if (!existsSync(base)) continue;
      for (const entry of readdirSync(base, { recursive: true, withFileTypes: true })) if (entry.isFile()) {
        const path = rel(resolve(entry.parentPath, entry.name));
        // The other batch's new integration tools can be added before its own
        // baseline; they do not mutate accepted generation/review evidence.
        if (base === directory && /(?:runtime-contract|promote-runtime|bind-owner-approval|capture-integration-baseline|validate-runtime-integration|validate-promotion-rerun|integration-validator-hooks|validate-approved-batch|audit-scoped-changes|run-validation|vitest-player|update-runtime-tests|setup-runtime-integration|INTEGRATION)\.(?:mjs|py|md)$/.test(entry.name)) continue;
        if (base === directory && entry.name === 'owner-approval.json' && value !== batch) continue;
        stablePaths.add(path);
      }
    }
    for (const name of ['alpha-normalization-report.json', 'seat-contact-candidates.json', 'staging-registry.json', 'validation/gallery-browser-results.json']) stablePaths.add(rel(resolve(artifacts, name)));
    const gallery = readJson(resolve(artifacts, 'validation/gallery-browser-results.json'));
    for (const page of gallery.results) if (page.screenshot) stablePaths.add(page.screenshot.path);
  }
  const approvedInputs = [...stablePaths].sort().map(path => ({ path, sha256: hash(resolve(repo, path)) }));
  const catalogSnapshot = resolve(baselineDirectory, 'catalog-entries.json'); writeJson(catalogSnapshot, catalog);
  const manifest = { schemaVersion: `${batch}-integration-baseline/v1`, capturedAt: new Date().toISOString(), identityCount: priorCounts.identities, assetCount: priorCounts.assets, patientCount: priorPatientCount,
    pinnedAssetBaseline: { path: rel(resolve(tool, 'runtime-baseline.json')), sha256: hash(resolve(tool, 'runtime-baseline.json')) }, files, runtimeAssets, catalog: { path: rel(catalogSnapshot), sha256: hash(catalogSnapshot) }, approvedInputs,
    provenancePreservation: `All ${priorCounts.assets} prior records and input claims stay exact; append only ${addedAssets} records and one cohort input.`,
    staffPools: Object.fromEntries(roles.map(role => [role, catalog.filter(entry => entry.category === 'staff' && entry.eligibleStaffRoleDefinitionIds.includes(role)).length])) };
  writeJson(baselineManifest, manifest); return manifest;
}

export function readIntegrationBaseline() {
  const baseline = readJson(baselineManifest);
  assert.equal(baseline.schemaVersion, `${batch}-integration-baseline/v1`);
  assert.equal(baseline.identityCount, priorCounts.identities); assert.equal(baseline.assetCount, priorCounts.assets); assert.equal(baseline.patientCount, priorPatientCount);
  for (const file of baseline.files) assert.equal(hash(resolve(repo, file.copiedTo)), file.sha256, 'immutable integration snapshot changed');
  assert.equal(hash(resolve(repo, baseline.catalog.path)), baseline.catalog.sha256);
  assert.equal(hash(resolve(repo, baseline.pinnedAssetBaseline.path)), baseline.pinnedAssetBaseline.sha256);
  verifyGenerationPins();
  for (const file of baseline.approvedInputs) assert.equal(hash(resolve(repo, file.path)), file.sha256, 'accepted source/control/art changed ' + file.path);
  assert.equal(baseline.runtimeAssets.length, priorCounts.assets);
  for (const asset of baseline.runtimeAssets) { assert.equal(hash(resolve(repo, asset.path)), asset.sha256, 'prior runtime art changed ' + asset.path); assert.equal(statSync(resolve(repo, asset.path)).size, asset.bytes); }
  return baseline;
}
export function snapshotJson(path) {
  const file = readIntegrationBaseline().files.find(item => item.path === path);
  assert(file, `missing snapshot ${path}`); return readJson(resolve(repo, file.copiedTo));
}

export function successorIntegrated() {
  return successor !== null && existsSync(resolve(batchRoot(successor), 'runtime-integration.json'));
}
export function activeCounts() {
  return successorIntegrated() ? { identities: 318, cardinalPoses: 2544, clipboardPoses: 30, assets: 2574 } : resultingCounts;
}
export function expectedRegistry() {
  const before = snapshotJson(registryPath);
  return { ...before, counts: activeCounts(), characters: [...before.characters, ...expectedRuntimeCharacters(), ...(successorIntegrated() ? expectedRuntimeCharacters(successor) : [])] };
}
export function verifyAppendOnlyRegistry({ allowBefore = false } = {}) {
  const before = snapshotJson(registryPath), registry = readJson(resolve(repo, registryPath));
  assert.deepEqual(registry, allowBefore && registry.characters.length === priorCounts.identities ? before : expectedRegistry(), 'registry differs from its only authorized append-only state');
  for (const entry of registry.characters) for (const asset of [...Object.values(entry.poses.stand), ...Object.values(entry.poses.sit), ...(entry.clipboard ? [entry.clipboard] : [])]) assert.equal(hash(resolve(repo, 'apps/player/public', asset.url)), asset.sha256);
  return registry;
}
export function verifyAppendOnlyCatalog({ allowBefore = false } = {}) {
  const baseline = readIntegrationBaseline(), before = readJson(resolve(repo, baseline.catalog.path)), catalog = loadCatalog();
  const expected = allowBefore && catalog.length === priorCounts.identities ? before : [...before, ...expectedCatalogAdditions(), ...(successorIntegrated() ? expectedCatalogAdditions(successor) : [])];
  assert.deepEqual(catalog, expected, 'prior entries unchanged and only approved cohort(s) appended');
  return catalog;
}

function appendCatalogSource(before, value) {
  const newline = before.includes('\r\n') ? '\r\n' : '\n', constant = value === 'patient-gapfill-v6c' ? 'PATIENT_GAPFILL_V6C' : 'STAFF_GAPFILL_V6D';
  const { roster } = assertOwnerApproved(value);
  const patient = value === 'patient-gapfill-v6c';
  const rows = roster.identities.map(identity => patient ? `  ["${identity.number}", ${identity.intendedAge}, "${identity.compatibleSexLabel}"],` : `  ["${identity.number}", "${identity.eligibleStaffRoleDefinitionIds[0]}"],`).join('\n');
  const block = (patient
    ? `// Owner-delegated manager approval recorded on 2026-10-08; visual metadata only.\nconst ${constant}_ROWS = [\n${rows}\n] as const satisfies readonly (readonly [string, number, Exclude<PatientSexLabel, "Not specified">])[];\n\nconst ${constant}_STILLS = ${constant}_ROWS.map(([number, intendedAge, compatibleSexLabel]) => ({\n  stillId: id(\`${value}.\${number}\`), category: "patient" as const,\n  sourceCohort: "${value}" as const, compatibleSexLabel,\n  intendedAge, ageBand: patientVisualAgeBand(intendedAge)!,\n}));\n\n`
    : `// Owner-delegated manager approval recorded on 2026-10-08; one exact role per look.\nconst ${constant}_ROWS = [\n${rows}\n] as const satisfies readonly (readonly [string, string])[];\n\nconst ${constant}_STILLS = ${constant}_ROWS.map(([number, role]) => ({\n  stillId: id(\`${value}.\${number}\`), category: "staff" as const,\n  sourceCohort: "${value}" as const, eligibleStaffRoleDefinitionIds: [role],\n}));\n\n`).replaceAll('\n', newline);
  const seam = patient ? '"patient-gapfill-v6a" | "patient-gapfill-v6b";' : '"gs026-employee-coverage" | "level3-roster-v2" | "future-roster20-v5";';
  const previous = patient ? 'PATIENT_GAPFILL_V6B' : 'PATIENT_GAPFILL_V6C';
  const substitutions = [[seam, seam.slice(0, -1) + ` | "${value}";`], ['export const FOUNDER_STILL_IDS =', block + 'export const FOUNDER_STILL_IDS ='], [`  ...${previous}_STILLS,${newline}`, `  ...${previous}_STILLS,${newline}  ...${constant}_STILLS,${newline}`]];
  return substitutions.reduce((source, [needle, replacement]) => { assert.equal(source.split(needle).length, 2, 'catalog append seam must occur once'); return source.replace(needle, replacement); }, before);
}
export function expectedCatalogSource({ includeSuccessor = true } = {}) {
  const file = readIntegrationBaseline().files.find(item => item.path === catalogPath);
  const own = appendCatalogSource(readFileSync(resolve(repo, file.copiedTo), 'utf8'), batch);
  return includeSuccessor && successorIntegrated() ? appendCatalogSource(own, successor) : own;
}
export function expectedRegistrySource({ includeSuccessor = true } = {}) {
  const file = readIntegrationBaseline().files.find(item => item.path === 'apps/player/src/art/characterStillRegistry.ts');
  const before = readFileSync(resolve(repo, file.copiedTo), 'utf8');
  const seam = batch === 'patient-gapfill-v6c' ? '"patientGapfillV6a" | "patientGapfillV6b";' : '"patientGapfillV6b" | "patientGapfillV6c";';
  assert.equal(before.split(seam).length, 2);
  const own = before.replace(seam, seam.slice(0, -1) + ` | "${cohort}";`);
  return includeSuccessor && successorIntegrated() ? own.replace('"patientGapfillV6c";', '"patientGapfillV6c" | "staffGapfillV6d";') : own;
}
export function verifyFrozenReviewMetadata() {
  for (const file of readIntegrationBaseline().files) if (file.path.startsWith('artifacts/character-statics/')) assert.equal(hash(resolve(repo, file.path)), file.sha256, 'frozen review changed ' + file.path);
}
export function runtimeIntegrationState() {
  assertOwnerApproved();
  const registry = verifyAppendOnlyRegistry({ allowBefore: true }); verifyAppendOnlyCatalog({ allowBefore: true });
  const ready = registry.characters.length >= resultingCounts.identities;
  return { authorized: true, ready, ownerApproval: 'approved', status: ready ? 'owner-delegated-manager-approved-locally-integrated-not-published' : 'owner-delegated-manager-approved-awaiting-runtime-integration' };
}
export function approvedRuntimeAdditionIds() {
  const before = snapshotJson(registryPath);
  return [...before.characters.map(entry => entry.id), ...expectedRuntimeCharacters().map(entry => entry.id), ...(successorIntegrated() ? expectedRuntimeCharacters(successor).map(entry => entry.id) : [])];
}

function appendProvenance(before, registry, value) {
  const { roster, approval } = assertOwnerApproved(value), artifacts = batchRoot(value), snapshot = resolve(artifacts, 'owner-runtime-approval.json'), key = cohortFor(value);
  assert.deepEqual(readJson(snapshot), approval); assert(!before.inputs[key]);
  const additions = roster.identities.flatMap(identity => {
    const manifest = readJson(resolve(artifacts, 'packages', identity.number, 'manifest.json')), entry = registry.characters.find(item => item.id === identity.stableId); assert(entry);
    return ['stand', 'sit'].flatMap(posture => directions.map(direction => {
      const pose = manifest.poses[posture][direction], asset = entry.poses[posture][direction]; assert.equal(pose.sha256, asset.sha256);
      return { identityId: entry.id, pose: `${posture}-${direction}`, sourceInput: key, sourceFile: pose.file, sourceSha256: pose.sha256, outputFile: `apps/player/public/${asset.url}`, outputSha256: asset.sha256,
        sourceSheet: manifest.source.stage2.png, sourceProvenance: manifest.source.stage2.provenance, ownerApproval: { file: rel(snapshot), sha256: hash(snapshot) }, seatContactContractSha256: approval.seatContactContractSha256 };
    }));
  });
  return { ...before, inputs: { ...before.inputs, [key]: { file: rel(snapshot), sha256: hash(snapshot), reviewStatus: 'owner-delegated-manager-approved-local-integration-not-published', ownerArtApproval: true, approvedBy: approval.approvedBy, approvalAuthority: 'owner-delegated-manager', sourceCohort: value, seatContactContractSha256: approval.seatContactContractSha256, derivedAlphaReportSha256: approval.derivedAlphaReportSha256 } },
    registry: { ...before.registry, sha256: hash(resolve(repo, registryPath)) }, counts: registry.counts, assets: [...before.assets, ...additions] };
}
export function expectedRuntimeProvenance(registry) {
  const own = appendProvenance(snapshotJson(provenancePath), registry, batch);
  return successorIntegrated() ? appendProvenance(own, registry, successor) : own;
}
export function staffPools(catalog = loadCatalog()) {
  return Object.fromEntries(roles.map(role => [role, catalog.filter(entry => entry.category === 'staff' && entry.eligibleStaffRoleDefinitionIds.includes(role)).length]));
}
