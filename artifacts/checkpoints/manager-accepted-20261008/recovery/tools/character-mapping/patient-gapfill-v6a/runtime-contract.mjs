import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { stripTypeScriptTypes } from 'node:module';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

export const tool = resolve(fileURLToPath(new URL('.', import.meta.url)));
export const repo = resolve(tool, '../../..');
export const root = resolve(repo, 'artifacts/character-statics/patient-gapfill-v6a');
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
export const resultingCounts = Object.freeze({ identities: 265, cardinalPoses: 2120, clipboardPoses: 30, assets: 2150 });

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
  assert.equal(approval.schemaVersion, 'patient-gapfill-v6a-owner-runtime-approval/v1');
  assert.equal(approval.status, 'approved'); assert.equal(approval.approvedBy, 'GamifySurgery manager (Claude Code)');
  assert.equal(approval.authorizedBy, 'owner'); assert.equal(approval.date, '2026-10-07');
  assert.equal(approval.ownerInstruction, 'use codex to design characters to fill in all the gaps, make sure the style of these characters is matching the style of all the previously generated characters. If they look okay to you, you can implement them into the game.');
  const plan = readFileSync(resolve(repo, approval.managerAcceptance.path), 'utf8');
  assert.equal(hashText(approval.managerAcceptance.statement), approval.managerAcceptance.sha256);
  assert(plan.includes(approval.managerAcceptance.statement), 'manager acceptance record changed');
  assert(approval.managerAcceptance.statement.startsWith('- 2026-10-07: v6a MANAGER VISUAL ACCEPTANCE'));
  assert(approval.managerAcceptance.statement.includes('Approved for append-only runtime integration.'));
  assert(plan.replace(/\r?\n/g, ' ').includes(approval.ownerInstruction));
  for (const evidence of [approval.roster, approval.reviewAcceptance, approval.reviewGallery, approval.overview, approval.workerReview, approval.authoredContacts]) {
    assert.equal(hash(resolve(repo, evidence.path)), evidence.sha256, 'approved evidence changed ' + evidence.path);
  }
  const roster = readJson(resolve(tool, 'roster.json')), acceptance = readJson(resolve(tool, 'review-acceptance.json'));
  assert.equal(roster.identities.length, 20);
  assert.deepEqual(approval.allocation, { Female: { middle_aged: 7, adult: 4 }, Male: { middle_aged: 6, adult: 3 } });
  assert.deepEqual(roster.allocation, approval.allocation);
  const sourceHashes = {};
  const contacts = roster.identities.map(identity => {
    const sourceSha256 = hash(resolve(root, 'sources', identity.number, 'source.png'));
    sourceHashes[identity.number] = sourceSha256;
    assert.equal(identity.category, 'patient');
    assert.equal(acceptance.workerVisualAcceptance[identity.number].sourceSha256, sourceSha256);
    assert(!acceptance.rejected?.[identity.number]?.includes(sourceSha256));
    const contact = acceptance.seatContacts[identity.number];
    assert.equal(contact.sourceSha256, sourceSha256);
    assert.deepEqual(contact.workerReviewedDirections, directions);
    assert.deepEqual(approval.acceptedContacts[identity.number], Object.fromEntries(directions.map(direction => [direction, contact[direction]])));
    const manifest = readJson(resolve(root, 'packages', identity.number, 'manifest.json'));
    const poseHashes = Object.fromEntries(['stand', 'sit'].flatMap(posture => directions.map(direction => {
      const pose = manifest.poses[posture][direction];
      assert.equal(hash(resolve(repo, pose.file)), pose.sha256);
      assert.equal(pose.anchors.bodyAxisX, 80); assert.equal(pose.anchors.floorY, 287);
      if (posture === 'sit') assert.equal(pose.anchors.seatContactY, contact[direction]);
      return [`${posture}-${direction}`, pose.sha256];
    })));
    assert.deepEqual(approval.acceptedPoses[identity.number], poseHashes, 'approval must bind exact packaged poses');
    return { number: identity.number, sourceSha256, contacts: Object.fromEntries(directions.map(direction => [direction, contact[direction]])) };
  });
  assert.deepEqual(approval.acceptedSources, sourceHashes);
  const contactHash = hashText(JSON.stringify(contacts));
  assert.equal(acceptance.reviewer, 'sol-v6a-worker');
  assert.equal(approval.seatContactContractSha256, contactHash);
  assert.equal(acceptance.seatContactWorkerReview.contractSha256, contactHash);
  const alphaHash = hash(resolve(root, 'alpha-normalization-report.json'));
  assert.equal(approval.derivedAlphaReportSha256, alphaHash);
  const visual = readJson(resolve(root, 'worker-review/visual-review.json'));
  assert.equal(visual.alphaReport.sha256, alphaHash);
  assert.equal(visual.authoredContactContractSha256, contactHash);
  return { roster, acceptance, approval };
}

export function expectedCatalogAdditions() {
  return assertOwnerApproved().roster.identities.map(identity => identity.category === 'patient'
    ? { stillId: identity.stableId, category: 'patient', sourceCohort: 'patient-gapfill-v6a', compatibleSexLabel: identity.compatibleSexLabel, intendedAge: identity.intendedAge, ageBand: identity.ageBand }
    : { stillId: identity.stableId, category: 'staff', sourceCohort: 'patient-gapfill-v6a', eligibleStaffRoleDefinitionIds: identity.eligibleStaffRoleDefinitionIds });
}

export function expectedRuntimeCharacters() {
  const { roster, acceptance } = assertOwnerApproved();
  return roster.identities.map(identity => {
    const manifest = readJson(resolve(root, 'packages', identity.number, 'manifest.json'));
    assert.equal(manifest.source.stage2.png.sha256, acceptance.workerVisualAcceptance[identity.number].sourceSha256);
    const poses = Object.fromEntries(['stand', 'sit'].map(posture => [posture, Object.fromEntries(directions.map(direction => {
      const pose = manifest.poses[posture][direction];
      return [direction, {
        url: `art/characters/patient-gapfill-v6a/${identity.stableId}/${posture}-${direction}.png`,
        sha256: pose.sha256, width: 160, height: 320,
        anchors: { bodyAxisX: 80, floorY: 287, ...(posture === 'sit' ? { seatContactY: acceptance.seatContacts[identity.number][direction], seatContactStatus: 'owner-delegated-manager-approved-authored-contact' } : {}) },
        visibleBounds: pose.visibleBounds,
      }];
    }))]));
    return { id: identity.stableId, cohort: 'patientGapfillV6a', category: identity.category === 'patient' ? 'patient-or-general-population' : 'employee',
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
  assert.equal(registry.characters.length, 245); assert.equal(registry.counts.assets, 1990);
  assert.equal(catalog.length, 245); assert.equal(catalog.filter(entry => entry.category === 'patient').length, 120);
  const provenance = readJson(resolve(repo, provenancePath));
  assert.equal(provenance.assets.length, 1990);
  const { roster, approval } = assertOwnerApproved();
  const paths = [registryPath, provenancePath, catalogPath, 'packages/game-domain/src/characterStillCatalog.test.ts', 'apps/player/src/art/characterStillRegistry.ts', 'apps/player/src/art/characterStillRegistry.test.ts',
    ...['owner-approval.json', 'review-acceptance.json', 'roster.json', 'runtime-baseline.mjs', 'build-roster.mjs', 'validate-roster.mjs', 'validate-placement-qa.mjs', 'validate-worker-review.mjs', 'build-placement-qa.mjs', 'README.md'].map(name => rel(resolve(tool, name))),
    ...['staging-registry.json', 'contact-review/contact-review-manifest.json', 'placement-qa/placement-manifest.json'].map(name => rel(resolve(root, name))),
    ...roster.identities.map(identity => rel(resolve(root, 'packages', identity.number, 'manifest.json'))), approval.reviewGallery.path, approval.overview.path];
  const files = paths.map(path => {
    const copiedTo = resolve(baselineDirectory, path); mkdirSync(dirname(copiedTo), { recursive: true });
    assert(!existsSync(copiedTo), 'refusing to overwrite immutable snapshot ' + rel(copiedTo));
    copyFileSync(resolve(repo, path), copiedTo);
    return { path, copiedTo: rel(copiedTo), sha256: hash(copiedTo) };
  });
  const stablePaths = new Set(['owner-approval.json', 'review-acceptance.json', 'roster.json', 'design-rows.json', 'runtime-baseline.json', 'authored-contacts.json', 'worker-review-notes.json'].map(name => rel(resolve(tool, name))));
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
  for (const base of ['prompts', 'sources', 'packages', 'review', 'worker-review', 'comparison', 'contact-review', 'placement-qa'].map(name => resolve(name === 'prompts' ? tool : root, name))) {
    if (!existsSync(base)) continue;
    for (const entry of readdirSync(base, { recursive: true, withFileTypes: true })) if (entry.isFile()) {
      const path = rel(resolve(entry.parentPath, entry.name));
      // Every source, pose, proof, manifest, history and HTML byte stays frozen.
      stablePaths.add(path);
    }
  }
  const approvedInputs = [...stablePaths].sort().map(path => ({ path, sha256: hash(resolve(repo, path)) }));
  const catalogSnapshot = resolve(baselineDirectory, 'catalog-entries.json'); writeJson(catalogSnapshot, catalog);
  const manifest = { schemaVersion: 'patient-gapfill-v6a-integration-baseline/v1', capturedAt: new Date().toISOString(), identityCount: 245, assetCount: 1990, patientCount: 120,
    pinnedAssetBaseline: { path: rel(resolve(tool, 'runtime-baseline.json')), sha256: hash(resolve(tool, 'runtime-baseline.json')) }, files, catalog: { path: rel(catalogSnapshot), sha256: hash(catalogSnapshot) }, approvedInputs,
    provenancePreservation: 'Every prior 1990 asset record and input claim stays identical. Append 160 records and one cohort input only; registry fingerprint and counts reflect the appended registry.' };
  writeJson(baselineManifest, manifest); return manifest;
}

export function readIntegrationBaseline() {
  const baseline = readJson(baselineManifest);
  assert.equal(baseline.identityCount, 245); assert.equal(baseline.assetCount, 1990); assert.equal(baseline.patientCount, 120);
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
  if (allowBefore && registry.characters.length === 245) assert.deepEqual(registry, before);
  else {
    assert.deepEqual(registry.characters.slice(0, 245), before.characters, 'prior 245 entries or anchors changed');
    assert.deepEqual(registry.characters.slice(245), expectedRuntimeCharacters(), 'append only the approved 20 identities');
    assert.deepEqual(registry.counts, resultingCounts);
    assert.deepEqual({ ...registry, counts: before.counts, characters: before.characters }, before, 'unrelated registry metadata changed');
  }
  for (const entry of registry.characters) for (const asset of [...Object.values(entry.poses.stand), ...Object.values(entry.poses.sit), ...(entry.clipboard ? [entry.clipboard] : [])]) assert.equal(hash(resolve(repo, 'apps/player/public', asset.url)), asset.sha256, 'runtime asset hash mismatch ' + asset.url);
  return registry;
}

export function verifyAppendOnlyCatalog({ allowBefore = false } = {}) {
  const baseline = readIntegrationBaseline(), before = readJson(resolve(repo, baseline.catalog.path)), catalog = loadCatalog();
  if (allowBefore && catalog.length === 245) { assert.deepEqual(catalog, before); return catalog; }
  assert.deepEqual(catalog.slice(0, 245), before, 'prior 245 catalog entries changed');
  assert.deepEqual(catalog.slice(245), expectedCatalogAdditions(), 'append only the approved 20 catalog entries');
  assert.equal(catalog.filter(entry => entry.category === 'patient').length, 140);
  assert.equal(catalog.filter(entry => entry.category === 'staff' && entry.eligibleStaffRoleDefinitionIds.includes('staff.radiologist')).length, 16);
  return catalog;
}

export function expectedCatalogSource() {
  const baseline = readIntegrationBaseline(), snapshot = baseline.files.find(file => file.path === catalogPath);
  const before = readFileSync(resolve(repo, snapshot.copiedTo), 'utf8'), newline = before.includes('\r\n') ? '\r\n' : '\n';
  const { roster } = assertOwnerApproved();
  const patientRows = roster.identities.map(identity => `  ["${identity.number}", ${identity.intendedAge}, "${identity.compatibleSexLabel}"],`).join('\n');
  const block = `// Owner-delegated manager approval recorded on 2026-10-07; visual metadata only.\nconst PATIENT_GAPFILL_V6A_ROWS = [\n${patientRows}\n] as const satisfies readonly (readonly [string, number, Exclude<PatientSexLabel, "Not specified">])[];\n\nconst PATIENT_GAPFILL_V6A_STILLS = PATIENT_GAPFILL_V6A_ROWS.map(([number, intendedAge, compatibleSexLabel]) => ({\n  stillId: id(\`patient-gapfill-v6a.\${number}\`), category: "patient" as const,\n  sourceCohort: "patient-gapfill-v6a" as const, compatibleSexLabel,\n  intendedAge, ageBand: patientVisualAgeBand(intendedAge)!,\n}));\n\n`.replaceAll('\n', newline);
  const substitutions = [
    ['"patient-demographics20-v4" | "future-roster20-v5";', '"patient-demographics20-v4" | "future-roster20-v5" | "patient-gapfill-v6a";'],
    ['export const FOUNDER_STILL_IDS =', block + 'export const FOUNDER_STILL_IDS ='],
    [`  ...FUTURE_ROSTER20_V5_STAFF_STILLS, ...FUTURE_ROSTER20_V5_PATIENT_STILLS,${newline}`, `  ...FUTURE_ROSTER20_V5_STAFF_STILLS, ...FUTURE_ROSTER20_V5_PATIENT_STILLS,${newline}  ...PATIENT_GAPFILL_V6A_STILLS,${newline}`],
  ];
  return substitutions.reduce((source, [needle, replacement]) => {
    assert.equal(source.split(needle).length, 2, 'catalog append seam must occur exactly once');
    return source.replace(needle, replacement);
  }, before);
}

export function expectedRegistrySource() {
  const path = 'apps/player/src/art/characterStillRegistry.ts';
  const snapshot = readIntegrationBaseline().files.find(file => file.path === path);
  const before = readFileSync(resolve(repo, snapshot.copiedTo), 'utf8');
  const seam = '"patientDemographics20V4" | "futureRoster20V5";';
  assert.equal(before.split(seam).length, 2, 'registry cohort seam must occur exactly once');
  return before.replace(seam, '"patientDemographics20V4" | "futureRoster20V5" | "patientGapfillV6a";');
}

export function verifyFrozenReviewMetadata() {
  // Approval supersedes the historical pending labels; original review
  // metadata, manifests, gallery and all their embedded hashes stay byte-exact.
  const baseline = readIntegrationBaseline();
  for (const file of baseline.files) if (file.path.startsWith('artifacts/character-statics/patient-gapfill-v6a/')) {
    assert.equal(hash(resolve(repo, file.path)), file.sha256, 'frozen review metadata changed ' + file.path);
  }
}

export function runtimeIntegrationState() {
  const authorized = existsSync(resolve(tool, 'owner-approval.json'));
  if (authorized) assertOwnerApproved();
  const registry = readJson(resolve(repo, registryPath));
  assert([245, 265].includes(registry.characters.length), 'unrelated runtime additions detected');
  const ready = registry.characters.length === 265;
  if (ready) { assert(authorized); verifyAppendOnlyRegistry(); }
  else assert.equal(hash(resolve(repo, registryPath)), readJson(resolve(tool, 'runtime-baseline.json')).protectedFiles.find(item => item.path === registryPath).sha256, 'prior registry changed');
  return { authorized, ready, ownerApproval: authorized ? 'approved' : 'pending', status: ready ? 'owner-delegated-manager-approved-locally-integrated-not-published' : authorized ? 'owner-delegated-manager-approved-awaiting-runtime-integration' : 'art-review-only;not-runtime-integrated' };
}

export function expectedRuntimeProvenance(registry) {
  const before = snapshotJson(provenancePath);
  assert.equal(before.assets.length, 1990);
  const { roster, approval } = assertOwnerApproved();
  assert.deepEqual(readJson(approvalSnapshot), approval);
  const additions = roster.identities.flatMap(identity => {
    const manifest = readJson(resolve(root, 'packages', identity.number, 'manifest.json')), entry = registry.characters.find(item => item.id === identity.stableId);
    assert(entry);
    return ['stand', 'sit'].flatMap(posture => directions.map(direction => {
      const pose = manifest.poses[posture][direction], asset = entry.poses[posture][direction];
      assert.equal(pose.sha256, asset.sha256);
      return { identityId: entry.id, pose: `${posture}-${direction}`, sourceInput: 'patientGapfillV6a', sourceFile: pose.file, sourceSha256: pose.sha256, outputFile: `apps/player/public/${asset.url}`, outputSha256: asset.sha256, sourceSheet: manifest.source.stage2.png, sourceProvenance: manifest.source.stage2.provenance, ownerApproval: { file: rel(approvalSnapshot), sha256: hash(approvalSnapshot) }, seatContactContractSha256: approval.seatContactContractSha256 };
    }));
  });
  assert.equal(additions.length, 160); assert(!before.inputs.patientGapfillV6a);
  return { ...before, inputs: { ...before.inputs, patientGapfillV6a: { file: rel(approvalSnapshot), sha256: hash(approvalSnapshot), reviewStatus: 'owner-delegated-manager-approved-local-integration-not-published', ownerArtApproval: true, approvedBy: approval.approvedBy, approvalAuthority: 'owner-delegated-manager', sourceCohort: 'patient-gapfill-v6a', seatContactContractSha256: approval.seatContactContractSha256, derivedAlphaReportSha256: approval.derivedAlphaReportSha256 } }, registry: { ...before.registry, sha256: hash(resolve(repo, registryPath)) }, counts: registry.counts, assets: [...before.assets, ...additions] };
}
