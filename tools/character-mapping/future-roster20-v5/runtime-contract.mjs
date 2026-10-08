import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { stripTypeScriptTypes } from 'node:module';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

export const tool = resolve(fileURLToPath(new URL('.', import.meta.url)));
export const repo = resolve(tool, '../../..');
export const root = resolve(repo, 'artifacts/character-statics/future-roster20-v5');
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
export const resultingCounts = Object.freeze({ identities: 245, cardinalPoses: 1960, clipboardPoses: 30, assets: 1990 });

// Evaluate only the existing side-effect-free catalog modules. No game state,
// clinical selection, network, browser storage, or gameplay is executed.
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
  const approval = readJson(resolve(tool, 'owner-approval.json'));
  assert.equal(approval.status, 'approved'); assert.equal(approval.approvedBy, 'owner');
  assert.equal(approval.ownerInstruction, 'I reviewed the character stills in 033, those are approved and can be implemented into the game.');
  for (const evidence of [approval.roster, approval.reviewAcceptance, approval.reviewGallery, approval.overview]) {
    assert.equal(hash(resolve(repo, evidence.path)), evidence.sha256, 'approved evidence changed ' + evidence.path);
  }
  const roster = readJson(resolve(tool, 'roster.json')), acceptance = readJson(resolve(tool, 'review-acceptance.json'));
  assert.equal(roster.identities.length, 20); assert.deepEqual(approval.allocation, { employees: 16, radiologists: 12, plannedAPPs: 2, plannedExecutives: 2, patients: 4 });
  const sourceHashes = {};
  const contacts = roster.identities.map(identity => {
    const sourceSha256 = hash(resolve(root, 'sources', identity.number, 'source.png'));
    sourceHashes[identity.number] = sourceSha256;
    assert.equal(acceptance.accepted[identity.number], sourceSha256);
    const contact = acceptance.seatContacts[identity.number];
    assert.equal(contact.sourceSha256, sourceSha256);
    assert.deepEqual([...contact.approvedDirections].sort(), [...directions].sort());
    const manifest = readJson(resolve(root, 'packages', identity.number, 'manifest.json'));
    const poseHashes = Object.fromEntries(['stand', 'sit'].flatMap(posture => directions.map(direction => {
      const pose = manifest.poses[posture][direction];
      assert.equal(hash(resolve(repo, pose.file)), pose.sha256);
      return [`${posture}-${direction}`, pose.sha256];
    })));
    assert.deepEqual(approval.acceptedPoses[identity.number], poseHashes, 'approval must bind exact packaged poses');
    if (identity.plannedStaffRole) assert.deepEqual(identity.eligibleStaffRoleDefinitionIds, [], 'planned APP/executive art must have no current staff eligibility');
    else if (identity.category === 'staff') assert.deepEqual(identity.eligibleStaffRoleDefinitionIds, ['staff.radiologist']);
    return { number: identity.number, sourceSha256, contacts: Object.fromEntries(directions.map(direction => [direction, contact[direction]])) };
  });
  assert.deepEqual(approval.acceptedSources, sourceHashes);
  const contactHash = hashText(JSON.stringify(contacts));
  assert.equal(acceptance.reviewer, 'root'); assert.equal(acceptance.seatContactAcceptance.reviewer, 'root');
  assert.equal(approval.seatContactContractSha256, contactHash);
  assert.equal(acceptance.seatContactAcceptance.contractSha256, contactHash);
  const alphaHash = hash(resolve(root, 'alpha-normalization-report.json'));
  assert.equal(acceptance.derivedAlphaWarningAcceptance.reviewer, 'root');
  assert.equal(approval.derivedAlphaReportSha256, alphaHash);
  assert.equal(acceptance.derivedAlphaWarningAcceptance.reportSha256, alphaHash);
  return { roster, acceptance, approval };
}

export function expectedCatalogAdditions() {
  return assertOwnerApproved().roster.identities.map(identity => identity.category === 'patient'
    ? { stillId: identity.stableId, category: 'patient', sourceCohort: 'future-roster20-v5', compatibleSexLabel: identity.compatibleSexLabel, intendedAge: identity.intendedAge, ageBand: identity.ageBand }
    : { stillId: identity.stableId, category: 'staff', sourceCohort: 'future-roster20-v5', eligibleStaffRoleDefinitionIds: identity.eligibleStaffRoleDefinitionIds });
}

export function expectedRuntimeCharacters() {
  const { roster, acceptance } = assertOwnerApproved();
  return roster.identities.map(identity => {
    const manifest = readJson(resolve(root, 'packages', identity.number, 'manifest.json'));
    assert.equal(manifest.source.stage2.png.sha256, acceptance.accepted[identity.number]);
    const poses = Object.fromEntries(['stand', 'sit'].map(posture => [posture, Object.fromEntries(directions.map(direction => {
      const pose = manifest.poses[posture][direction];
      return [direction, {
        url: `art/characters/future-roster20-v5/${identity.stableId}/${posture}-${direction}.png`,
        sha256: pose.sha256, width: 160, height: 320,
        anchors: { bodyAxisX: 80, floorY: 287, ...(posture === 'sit' ? { seatContactY: acceptance.seatContacts[identity.number][direction], seatContactStatus: 'owner-approved-authored-contact' } : {}) },
        visibleBounds: pose.visibleBounds,
      }];
    }))]));
    return { id: identity.stableId, cohort: 'futureRoster20V5', category: identity.category === 'patient' ? 'patient-or-general-population' : 'employee',
      ...(identity.category === 'staff' ? { ...(identity.eligibleStaffRoleDefinitionIds.length ? { role: identity.eligibleStaffRoleDefinitionIds[0] } : {}), eligibleStaffRoleDefinitionIds: identity.eligibleStaffRoleDefinitionIds, ...(identity.plannedStaffRole ? { plannedStaffRole: identity.plannedStaffRole } : {}) } : {}),
      intendedAge: identity.intendedAge, intendedSex: identity.compatibleSexLabel, displayGender: identity.compatibleSexLabel === 'Female' ? 'Woman' : 'Man', poses };
  });
}

export function captureIntegrationBaseline() {
  if (existsSync(baselineManifest)) return readIntegrationBaseline();
  const pinned = readJson(resolve(tool, 'runtime-baseline.json'));
  for (const file of [...pinned.protectedFiles, ...pinned.assets]) {
    assert.equal(hash(resolve(repo, file.path)), file.sha256, 'baseline must precede runtime edits ' + file.path);
    assert.equal(statSync(resolve(repo, file.path)).size, file.bytes);
  }
  const registry = readJson(resolve(repo, registryPath)), catalog = loadCatalog();
  assert.equal(registry.characters.length, 225); assert.equal(registry.counts.assets, 1830);
  assert.equal(catalog.length, 225); assert.equal(catalog.filter(entry => entry.category === 'patient').length, 116);
  const provenance = readJson(resolve(repo, provenancePath));
  assert.equal(provenance.assets.length, 1830);
  const { roster, approval } = assertOwnerApproved();
  const paths = [registryPath, provenancePath, catalogPath, 'packages/game-domain/src/characterStillCatalog.test.ts', 'apps/player/src/art/characterStillRegistry.ts', 'apps/player/src/art/characterStillRegistry.test.ts',
    ...['owner-approval.json', 'review-acceptance.json', 'roster.json', 'runtime-baseline.mjs', 'build-roster.mjs', 'validate-roster.mjs', 'validate-placement-qa.mjs', 'build-placement-qa.mjs', 'README.md'].map(name => rel(resolve(tool, name))),
    ...['staging-registry.json', 'contact-review/contact-review-manifest.json', 'placement-qa/placement-manifest.json'].map(name => rel(resolve(root, name))),
    ...roster.identities.map(identity => rel(resolve(root, 'packages', identity.number, 'manifest.json'))), approval.reviewGallery.path, approval.overview.path];
  const files = paths.map(path => {
    const copiedTo = resolve(baselineDirectory, path); mkdirSync(dirname(copiedTo), { recursive: true });
    assert(!existsSync(copiedTo), 'refusing to overwrite immutable snapshot ' + rel(copiedTo));
    copyFileSync(resolve(repo, path), copiedTo);
    return { path, copiedTo: rel(copiedTo), sha256: hash(copiedTo) };
  });
  const stablePaths = new Set(['owner-approval.json', 'review-acceptance.json', 'roster.json', 'design-rows.json', 'runtime-baseline.json'].map(name => rel(resolve(tool, name))));
  for (const file of pinned.protectedFiles) if (![registryPath, catalogPath].includes(file.path)) stablePaths.add(file.path);
  stablePaths.add('packages/game-domain/src/appearance.ts');
  stablePaths.add(rel(resolve(root, 'alpha-normalization-report.json')));
  stablePaths.add(rel(resolve(root, 'seat-contact-candidates.json')));
  // Existing source/control receipts remain immutable along with their claims.
  for (const input of Object.values(provenance.inputs)) if (input.file) stablePaths.add(input.file);
  for (const record of provenance.assets) for (const item of [{ path: record.sourceFile, sha256: record.sourceSha256 }, record.sourceSheet, record.sourceProvenance, record.ownerApproval]) {
    if (item?.path || item?.file) {
      const path = item.path ?? item.file;
      if (item.sha256) assert.equal(hash(resolve(repo, path)), item.sha256, 'historical source/control hash mismatch ' + path);
      stablePaths.add(path);
    }
  }
  for (const base of ['prompts', 'sources', 'packages', 'review', 'root-review', 'contact-review', 'placement-qa'].map(name => resolve(name === 'prompts' ? tool : root, name))) {
    for (const entry of readdirSync(base, { recursive: true, withFileTypes: true })) if (entry.isFile()) {
      const path = rel(resolve(entry.parentPath, entry.name));
      // Only the active status manifests may change; all original copies above
      // and every source, pose, proof, history and HTML byte remain protected.
      if (!paths.includes(path) || path === approval.reviewGallery.path || path === approval.overview.path) stablePaths.add(path);
    }
  }
  const approvedInputs = [...stablePaths].sort().map(path => ({ path, sha256: hash(resolve(repo, path)) }));
  const catalogSnapshot = resolve(baselineDirectory, 'catalog-entries.json'); writeJson(catalogSnapshot, catalog);
  const manifest = { schemaVersion: 'future-roster20-v5-integration-baseline/v1', capturedAt: new Date().toISOString(), identityCount: 225, assetCount: 1830, patientCount: 116,
    pinnedAssetBaseline: { path: rel(resolve(tool, 'runtime-baseline.json')), sha256: hash(resolve(tool, 'runtime-baseline.json')) }, files, catalog: { path: rel(catalogSnapshot), sha256: hash(catalogSnapshot) }, approvedInputs,
    provenancePreservation: 'Every prior 1830 asset record and input claim stays identical. Append 160 records and one cohort input only; registry fingerprint and counts reflect the appended registry.' };
  writeJson(baselineManifest, manifest); return manifest;
}

export function readIntegrationBaseline() {
  const baseline = readJson(baselineManifest);
  assert.equal(baseline.identityCount, 225); assert.equal(baseline.assetCount, 1830); assert.equal(baseline.patientCount, 116);
  for (const file of baseline.files) assert.equal(hash(resolve(repo, file.copiedTo)), file.sha256, 'immutable integration snapshot changed');
  assert.equal(hash(resolve(repo, baseline.catalog.path)), baseline.catalog.sha256);
  assert.equal(hash(resolve(repo, baseline.pinnedAssetBaseline.path)), baseline.pinnedAssetBaseline.sha256);
  for (const file of baseline.approvedInputs) assert.equal(hash(resolve(repo, file.path)), file.sha256, 'approved source/control changed ' + file.path);
  return baseline;
}

export function snapshotJson(path) {
  const file = readIntegrationBaseline().files.find(item => item.path === path);
  assert(file, `missing snapshot ${path}`); return readJson(resolve(repo, file.copiedTo));
}

export function verifyAppendOnlyRegistry({ allowBefore = false } = {}) {
  const before = snapshotJson(registryPath), registry = readJson(resolve(repo, registryPath));
  if (allowBefore && registry.characters.length === 225) assert.deepEqual(registry, before);
  else {
    assert.deepEqual(registry.characters.slice(0, 225), before.characters, 'prior 225 entries or anchors changed');
    assert.deepEqual(registry.characters.slice(225), expectedRuntimeCharacters(), 'append only the approved 20 identities');
    assert.deepEqual(registry.counts, resultingCounts);
    assert.deepEqual({ ...registry, counts: before.counts, characters: before.characters }, before, 'unrelated registry metadata changed');
  }
  for (const entry of registry.characters) for (const asset of [...Object.values(entry.poses.stand), ...Object.values(entry.poses.sit), ...(entry.clipboard ? [entry.clipboard] : [])]) assert.equal(hash(resolve(repo, 'apps/player/public', asset.url)), asset.sha256, 'runtime asset hash mismatch ' + asset.url);
  return registry;
}

export function verifyAppendOnlyCatalog({ allowBefore = false } = {}) {
  const baseline = readIntegrationBaseline(), before = readJson(resolve(repo, baseline.catalog.path)), catalog = loadCatalog();
  if (allowBefore && catalog.length === 225) { assert.deepEqual(catalog, before); return catalog; }
  assert.deepEqual(catalog.slice(0, 225), before, 'prior 225 catalog entries changed');
  assert.deepEqual(catalog.slice(225), expectedCatalogAdditions(), 'append only the approved 20 catalog entries');
  assert.equal(catalog.filter(entry => entry.category === 'patient').length, 120);
  assert.equal(catalog.filter(entry => entry.category === 'staff' && entry.eligibleStaffRoleDefinitionIds.includes('staff.radiologist')).length, 16);
  return catalog;
}

export function expectedCatalogSource() {
  const baseline = readIntegrationBaseline(), snapshot = baseline.files.find(file => file.path === catalogPath);
  const before = readFileSync(resolve(repo, snapshot.copiedTo), 'utf8'), newline = before.includes('\r\n') ? '\r\n' : '\n';
  const { roster } = assertOwnerApproved();
  const staffRows = roster.identities.filter(identity => identity.category === 'staff').map(identity => `  ["${identity.number}", ${JSON.stringify(identity.eligibleStaffRoleDefinitionIds)}],`).join('\n');
  const patientRows = roster.identities.filter(identity => identity.category === 'patient').map(identity => `  ["${identity.number}", ${identity.intendedAge}, "${identity.compatibleSexLabel}"],`).join('\n');
  const block = `// Owner-approved GS-033 art. Empty role lists keep the four planned APP and\n// executive identities renderable without admitting them to any staff pool.\nconst FUTURE_ROSTER20_V5_STAFF_ROWS = [\n${staffRows}\n] as const;\n\nconst FUTURE_ROSTER20_V5_STAFF_STILLS = FUTURE_ROSTER20_V5_STAFF_ROWS.map(([number, roles]) => ({\n  stillId: id(\`future-roster20-v5.\${number}\`), category: "staff" as const,\n  sourceCohort: "future-roster20-v5" as const, eligibleStaffRoleDefinitionIds: roles as readonly string[],\n}));\n\nconst FUTURE_ROSTER20_V5_PATIENT_ROWS = [\n${patientRows}\n] as const satisfies readonly (readonly [string, number, Exclude<PatientSexLabel, "Not specified">])[];\n\nconst FUTURE_ROSTER20_V5_PATIENT_STILLS = FUTURE_ROSTER20_V5_PATIENT_ROWS.map(([number, intendedAge, compatibleSexLabel]) => ({\n  stillId: id(\`future-roster20-v5.\${number}\`), category: "patient" as const,\n  sourceCohort: "future-roster20-v5" as const, compatibleSexLabel,\n  intendedAge, ageBand: patientVisualAgeBand(intendedAge)!,\n}));\n\n`.replaceAll('\n', newline);
  const substitutions = [
    ['"patient-demographics20-v4";', '"patient-demographics20-v4" | "future-roster20-v5";'],
    ['"gs026-employee-coverage" | "level3-roster-v2";', '"gs026-employee-coverage" | "level3-roster-v2" | "future-roster20-v5";'],
    ['export const FOUNDER_STILL_IDS =', block + 'export const FOUNDER_STILL_IDS ='],
    [`  ...PATIENT_DEMOGRAPHICS20_V4_STILLS,${newline}`, `  ...PATIENT_DEMOGRAPHICS20_V4_STILLS,${newline}  ...FUTURE_ROSTER20_V5_STAFF_STILLS, ...FUTURE_ROSTER20_V5_PATIENT_STILLS,${newline}`],
  ];
  return substitutions.reduce((source, [needle, replacement]) => {
    assert.equal(source.split(needle).length, 2, 'catalog append seam must occur exactly once');
    return source.replace(needle, replacement);
  }, before);
}

export function verifyFrozenReviewMetadata() {
  // Approval supersedes the historical pending labels; original review
  // metadata, manifests, gallery and all their embedded hashes stay byte-exact.
  const baseline = readIntegrationBaseline();
  for (const file of baseline.files) if (file.path.startsWith('artifacts/character-statics/future-roster20-v5/')) {
    assert.equal(hash(resolve(repo, file.path)), file.sha256, 'frozen review metadata changed ' + file.path);
  }
}

export function runtimeIntegrationState() {
  const authorized = existsSync(resolve(tool, 'owner-approval.json'));
  if (authorized) assertOwnerApproved();
  const registry = readJson(resolve(repo, registryPath));
  assert([225, 245].includes(registry.characters.length), 'unrelated runtime additions detected');
  const ready = registry.characters.length === 245;
  if (ready) { assert(authorized); verifyAppendOnlyRegistry(); }
  else assert.equal(hash(resolve(repo, registryPath)), readJson(resolve(tool, 'runtime-baseline.json')).protectedFiles.find(item => item.path === registryPath).sha256, 'prior registry changed');
  return { authorized, ready, ownerApproval: authorized ? 'approved' : 'pending', status: ready ? 'owner-approved-locally-integrated-not-published' : authorized ? 'owner-approved-awaiting-runtime-integration' : 'art-review-only;not-runtime-integrated' };
}

export function expectedRuntimeProvenance(registry) {
  const before = snapshotJson(provenancePath);
  assert.equal(before.assets.length, 1830);
  const { roster, approval } = assertOwnerApproved();
  assert.deepEqual(readJson(approvalSnapshot), approval);
  const additions = roster.identities.flatMap(identity => {
    const manifest = readJson(resolve(root, 'packages', identity.number, 'manifest.json')), entry = registry.characters.find(item => item.id === identity.stableId);
    assert(entry);
    return ['stand', 'sit'].flatMap(posture => directions.map(direction => {
      const pose = manifest.poses[posture][direction], asset = entry.poses[posture][direction];
      assert.equal(pose.sha256, asset.sha256);
      return { identityId: entry.id, pose: `${posture}-${direction}`, sourceInput: 'futureRoster20V5', sourceFile: pose.file, sourceSha256: pose.sha256, outputFile: `apps/player/public/${asset.url}`, outputSha256: asset.sha256, sourceSheet: manifest.source.stage2.png, sourceProvenance: manifest.source.stage2.provenance, ownerApproval: { file: rel(approvalSnapshot), sha256: hash(approvalSnapshot) }, seatContactContractSha256: approval.seatContactContractSha256 };
    }));
  });
  assert.equal(additions.length, 160); assert(!before.inputs.futureRoster20V5);
  return { ...before, inputs: { ...before.inputs, futureRoster20V5: { file: rel(approvalSnapshot), sha256: hash(approvalSnapshot), reviewStatus: 'owner-approved-local-integration-not-published', ownerArtApproval: true, sourceCohort: 'future-roster20-v5', seatContactContractSha256: approval.seatContactContractSha256, derivedAlphaReportSha256: approval.derivedAlphaReportSha256 } }, registry: { ...before.registry, sha256: hash(resolve(repo, registryPath)) }, counts: registry.counts, assets: [...before.assets, ...additions] };
}
