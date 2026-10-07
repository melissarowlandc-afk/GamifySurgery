import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { stripTypeScriptTypes } from 'node:module';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

export const tool = resolve(fileURLToPath(new URL('.', import.meta.url)));
export const repo = resolve(tool, '../../..');
export const root = resolve(repo, 'artifacts/character-statics/patient-demographics20-v4');
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
export const resultingCounts = Object.freeze({ identities: 225, cardinalPoses: 1800, clipboardPoses: 30, assets: 1830 });

// Evaluate only the two existing, side-effect-free catalog data modules using
// the bundled Node runtime. This never changes clinical or appearance selection.
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

export function assertOwnerApproved() {
  const roster = readJson(resolve(tool, 'roster.json'));
  const acceptance = readJson(resolve(tool, 'review-acceptance.json'));
  const approvalReference = acceptance.ownerRuntimeApproval;
  assert.equal(approvalReference?.status, 'approved', 'owner runtime approval required');
  assert.equal(approvalReference.receipt, rel(resolve(tool, 'owner-approval.json')));
  assert.equal(hash(resolve(repo, approvalReference.receipt)), approvalReference.sha256, 'approval receipt changed');
  const approval = readJson(resolve(repo, approvalReference.receipt));
  assert.equal(approval.status, 'approved'); assert.equal(approval.approvedBy, 'owner');
  assert.equal(roster.identities.length, 20);
  const sourceHashes = {};
  const contacts = roster.identities.map(identity => {
    const sourceHash = hash(resolve(root, 'sources', identity.number, 'source.png'));
    sourceHashes[identity.number] = sourceHash;
    assert.equal(acceptance.accepted[identity.number], sourceHash);
    const contact = acceptance.seatContacts[identity.number];
    assert.equal(contact.sourceSha256, sourceHash);
    assert.deepEqual([...contact.approvedDirections].sort(), [...directions].sort());
    return { number: identity.number, sourceSha256: sourceHash, contacts: Object.fromEntries(directions.map(direction => [direction, contact[direction]])) };
  });
  assert.deepEqual(approval.acceptedSources, sourceHashes, 'approval does not bind this exact source roster');
  const contactHash = hashText(JSON.stringify(contacts));
  assert.equal(acceptance.reviewer, 'root'); assert.equal(acceptance.seatContactAcceptance.reviewer, 'root');
  assert.equal(approval.seatContactContractSha256, contactHash);
  assert.equal(acceptance.seatContactAcceptance.contractSha256, contactHash);
  const alphaHash = hash(resolve(root, 'alpha-normalization-report.json'));
  assert.equal(acceptance.derivedAlphaWarningAcceptance.reviewer, 'root');
  assert.equal(approval.derivedAlphaReportSha256, alphaHash);
  assert.equal(acceptance.derivedAlphaWarningAcceptance.reportSha256, alphaHash);
  if (existsSync(baselineManifest)) {
    const baseline = readIntegrationBaseline();
    for (const evidence of [approval.reviewGallery, approval.overview]) {
      const snapshot = baseline.files.find(file => file.path === evidence.path);
      assert(snapshot, 'approved review evidence lacks immutable pre-edit snapshot');
      assert.equal(snapshot.sha256, evidence.sha256);
    }
  }
  return { roster, acceptance, approval };
}

export function expectedRuntimeCharacters() {
  const { roster, acceptance } = assertOwnerApproved();
  return roster.identities.map(identity => {
    const manifest = readJson(resolve(root, 'packages', identity.number, 'manifest.json'));
    assert.equal(manifest.source.stage2.png.sha256, acceptance.accepted[identity.number]);
    const poses = Object.fromEntries(['stand', 'sit'].map(posture => [posture, Object.fromEntries(directions.map(direction => {
      const pose = manifest.poses[posture][direction];
      assert.equal(hash(resolve(repo, pose.file)), pose.sha256);
      return [direction, {
        url: `art/characters/patient-demographics20-v4/${identity.stableId}/${posture}-${direction}.png`,
        sha256: pose.sha256, width: 160, height: 320,
        anchors: { bodyAxisX: 80, floorY: 287, ...(posture === 'sit' ? { seatContactY: acceptance.seatContacts[identity.number][direction], seatContactStatus: 'owner-approved-authored-contact' } : {}) },
        visibleBounds: pose.visibleBounds,
      }];
    }))]));
    return { id: identity.stableId, cohort: 'patientDemographics20V4', category: 'patient-or-general-population', intendedAge: identity.intendedAge, intendedSex: identity.compatibleSexLabel, displayGender: identity.compatibleSexLabel === 'Female' ? 'Woman' : 'Man', poses };
  });
}

export function captureIntegrationBaseline() {
  if (existsSync(baselineManifest)) return readIntegrationBaseline();
  const pinned = readJson(resolve(tool, 'runtime-baseline.json'));
  assert.equal(hash(resolve(repo, registryPath)), pinned.registry.sha256, 'baseline must be captured before runtime edits');
  for (const file of [...pinned.catalogFiles, ...pinned.assets]) {
    assert.equal(hash(resolve(repo, file.path)), file.sha256);
    if ('bytes' in file) assert.equal(statSync(resolve(repo, file.path)).size, file.bytes);
  }
  const registry = readJson(resolve(repo, registryPath)), catalog = loadCatalog();
  assert.equal(registry.characters.length, 205); assert.equal(registry.counts.assets, 1670);
  assert.equal(catalog.length, 205); assert.equal(catalog.filter(entry => entry.category === 'patient').length, 96);
  const provenance = readJson(resolve(repo, provenancePath));
  assert.equal(provenance.assets.length, 1670, 'prior global provenance must already cover every existing asset');
  const { approval } = assertOwnerApproved();
  const paths = [registryPath, provenancePath, catalogPath, 'packages/game-domain/src/characterStillCatalog.test.ts', 'apps/player/src/art/characterStillRegistry.ts', 'apps/player/src/art/characterStillRegistry.test.ts', rel(resolve(tool, 'owner-approval.json')), rel(resolve(tool, 'review-acceptance.json')), rel(resolve(tool, 'roster.json')), approval.reviewGallery.path, approval.overview.path];
  const files = paths.map(path => {
    const copiedTo = resolve(baselineDirectory, path); mkdirSync(dirname(copiedTo), { recursive: true });
    assert(!existsSync(copiedTo), 'refusing to overwrite existing immutable snapshot ' + rel(copiedTo));
    copyFileSync(resolve(repo, path), copiedTo);
    return { path, copiedTo: rel(copiedTo), sha256: hash(copiedTo) };
  });
  const stablePaths = [rel(resolve(tool, 'owner-approval.json')), rel(resolve(tool, 'review-acceptance.json')), rel(resolve(tool, 'roster.json')), rel(resolve(tool, 'design-rows.json')), rel(resolve(root, 'alpha-normalization-report.json')), 'packages/game-domain/src/patientAppearanceCatalog.ts'];
  for (const base of [resolve(tool, 'prompts'), resolve(root, 'sources')]) for (const entry of readdirSync(base, { recursive: true, withFileTypes: true })) if (entry.isFile()) stablePaths.push(rel(resolve(entry.parentPath, entry.name)));
  const approvedInputs = stablePaths.sort().map(path => ({ path, sha256: hash(resolve(repo, path)) }));
  const catalogSnapshot = resolve(baselineDirectory, 'catalog-entries.json'); writeJson(catalogSnapshot, catalog);
  const manifest = { schemaVersion: 'patient-demographics20-v4-integration-baseline/v1', identityCount: 205, assetCount: 1670, patientCount: 96, pinnedAssetBaseline: { path: rel(resolve(tool, 'runtime-baseline.json')), sha256: hash(resolve(tool, 'runtime-baseline.json')) }, files, catalog: { path: rel(catalogSnapshot), sha256: hash(catalogSnapshot) }, approvedInputs, provenancePreservation: 'All1670 prior global asset records and every prior input claim are preserved verbatim as JSON values. Only160 new records and one new cohort input are appended.' };
  writeJson(baselineManifest, manifest);
  return manifest;
}

export function readIntegrationBaseline() {
  const baseline = readJson(baselineManifest);
  assert.equal(baseline.identityCount, 205); assert.equal(baseline.assetCount, 1670); assert.equal(baseline.patientCount, 96);
  for (const file of baseline.files) assert.equal(hash(resolve(repo, file.copiedTo)), file.sha256, 'immutable integration snapshot changed');
  assert.equal(hash(resolve(repo, baseline.catalog.path)), baseline.catalog.sha256);
  assert.equal(hash(resolve(repo, baseline.pinnedAssetBaseline.path)), baseline.pinnedAssetBaseline.sha256);
  for (const file of baseline.approvedInputs) assert.equal(hash(resolve(repo, file.path)), file.sha256, 'approved input changed ' + file.path);
  return baseline;
}

export function snapshotJson(path) {
  const baseline = readIntegrationBaseline(), file = baseline.files.find(item => item.path === path);
  assert(file, `missing snapshot ${path}`); return readJson(resolve(repo, file.copiedTo));
}

export function verifyAppendOnlyRegistry() {
  const before = snapshotJson(registryPath), registry = readJson(resolve(repo, registryPath));
  assert.deepEqual(registry.characters.slice(0, 205), before.characters, 'prior205 runtime entries changed');
  assert.deepEqual(registry.characters.slice(205), expectedRuntimeCharacters(), 'runtime must append only the owner-approved20 identities');
  assert.deepEqual(registry.counts, resultingCounts);
  assert.deepEqual({ ...registry, counts: before.counts, characters: before.characters }, before, 'unrelated registry metadata changed');
  for (const entry of registry.characters) for (const asset of [...Object.values(entry.poses.stand), ...Object.values(entry.poses.sit), ...(entry.clipboard ? [entry.clipboard] : [])]) assert.equal(hash(resolve(repo, 'apps/player/public', asset.url)), asset.sha256, 'runtime asset hash mismatch ' + asset.url);
  return registry;
}

export function verifyAppendOnlyCatalog({ allowBefore = false } = {}) {
  const baseline = readIntegrationBaseline(), before = readJson(resolve(repo, baseline.catalog.path)), catalog = loadCatalog();
  if (allowBefore && catalog.length === 205) { assert.deepEqual(catalog, before); return catalog; }
  assert.deepEqual(catalog.slice(0, 205), before, 'prior205 catalog entries changed');
  const { roster } = assertOwnerApproved();
  const additions = roster.identities.map(identity => ({ stillId: identity.stableId, category: 'patient', sourceCohort: 'patient-demographics20-v4', compatibleSexLabel: identity.compatibleSexLabel, intendedAge: identity.intendedAge, ageBand: identity.ageBand }));
  assert.deepEqual(catalog.slice(205), additions, 'catalog must append only the approved20 patients');
  assert.equal(catalog.filter(entry => entry.category === 'patient').length, 116);
  return catalog;
}

export function runtimeIntegrationState() {
  const acceptance = readJson(resolve(tool, 'review-acceptance.json'));
  const authorized = acceptance.ownerRuntimeApproval?.status === 'approved';
  if (authorized) assertOwnerApproved();
  const registry = readJson(resolve(repo, registryPath));
  assert([205, 225].includes(registry.characters.length), 'unrelated runtime additions detected');
  const ready = registry.characters.length === 225;
  if (ready) { assert(authorized, 'runtime expansion is not approved'); verifyAppendOnlyRegistry(); }
  else assert.equal(hash(resolve(repo, registryPath)), readJson(resolve(tool, 'runtime-baseline.json')).registry.sha256, 'prior registry changed');
  return { authorized, ready, ownerApproval: authorized ? 'approved' : 'pending' };
}

export function expectedRuntimeProvenance(registry) {
  const before = snapshotJson(provenancePath);
  assert.equal(before.assets.length, 1670, 'historical global provenance count drift');
  const { roster, approval } = assertOwnerApproved();
  assert.deepEqual(readJson(approvalSnapshot), approval, 'immutable owner approval snapshot changed');
  const additions = roster.identities.flatMap(identity => {
    const manifest = readJson(resolve(root, 'packages', identity.number, 'manifest.json')), entry = registry.characters.find(item => item.id === identity.stableId);
    assert(entry);
    return ['stand', 'sit'].flatMap(posture => directions.map(direction => {
      const pose = manifest.poses[posture][direction], asset = entry.poses[posture][direction];
      assert.equal(pose.sha256, asset.sha256);
      return { identityId: entry.id, pose: `${posture}-${direction}`, sourceInput: 'patientDemographics20V4', sourceFile: pose.file, sourceSha256: pose.sha256, outputFile: `apps/player/public/${asset.url}`, outputSha256: asset.sha256, sourceSheet: manifest.source.stage2.png, sourceProvenance: manifest.source.stage2.provenance, ownerApproval: { file: rel(approvalSnapshot), sha256: hash(approvalSnapshot) }, seatContactContractSha256: approval.seatContactContractSha256 };
    }));
  });
  assert.equal(additions.length, 160);
  assert(!before.inputs.patientDemographics20V4, 'unexpected prior input ownership conflict');
  return { ...before, inputs: { ...before.inputs, patientDemographics20V4: { file: rel(approvalSnapshot), sha256: hash(approvalSnapshot), reviewStatus: 'owner-approved-local-integration-not-published', ownerArtApproval: true, sourceCohort: 'patient-demographics20-v4', seatContactContractSha256: approval.seatContactContractSha256, derivedAlphaReportSha256: approval.derivedAlphaReportSha256 } }, registry: { ...before.registry, sha256: hash(resolve(repo, registryPath)) }, counts: registry.counts, assets: [...before.assets, ...additions] };
}
