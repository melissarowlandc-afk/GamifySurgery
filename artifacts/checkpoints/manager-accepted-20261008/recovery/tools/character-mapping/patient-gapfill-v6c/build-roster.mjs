import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCanvas } from '@napi-rs/canvas';
import { extractEight, inferSeatContact, loadCanvas, measure, normalizeCells, SLOTS } from '../gs026-employee-expansion-v1/pipeline.mjs';
import { captureRuntimeBaseline, verifyRuntimeBaseline } from './runtime-baseline.mjs';
export { captureRuntimeBaseline, verifyRuntimeBaseline } from './runtime-baseline.mjs';

// This milestone creates review artifacts only. Approval and runtime registration
// belong to a later, explicitly authorized integration milestone.
export function reviewState() {
  return { authorized: false, ready: false, ownerApproval: 'pending', status: 'art-review-only;not-runtime-integrated' };
}

export const packageStatus = (accepted, contacts) => accepted && directions.every(direction => contacts.approvedDirections?.includes(direction))
  ? 'root-reviewed-pending-owner-approval' : 'candidate-packaged-not-runtime-ready';
export const contactAnchorStatus = (contacts, direction) => contacts.approvedDirections?.includes(direction)
  ? 'root-reviewed-contact-pending-owner-approval' : contacts.workerReviewedDirections?.includes(direction)
    ? 'worker-authored-contact-pending-manager-acceptance' : 'candidate-no-runtime-promotion';

export const tool = resolve(fileURLToPath(new URL('.', import.meta.url)));
export const repo = resolve(tool, '../../..');
export const root = resolve(repo, 'artifacts/character-statics/patient-gapfill-v6c');
export const directions = ['south', 'east', 'west', 'north'];
export const target = Object.freeze({ width: 160, height: 320, bodyAxisX: 80, floorY: 287, standingSouthVisibleHeight: 246 });
export const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
export const hashText = value => createHash('sha256').update(value).digest('hex');
export const rel = file => relative(repo, file).replaceAll('\\', '/');
const local = path => resolve(repo, path);
const json = file => JSON.parse(readFileSync(file, 'utf8'));
const writeJson = (file, value) => writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
const packageRoot = resolve(root, 'packages');
const acceptanceFile = resolve(tool, 'review-acceptance.json');
const baselineFile = resolve(tool, 'runtime-baseline.json');
const htmlEscape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const staffLabel = identity => identity.roleLabel ?? identity.plannedStaffRole?.label ?? identity.eligibleStaffRoleDefinitionIds?.map(role => role.replace(/^staff\./, '').replaceAll('_', ' ').replace(/^./, character => character.toUpperCase())).join(', ');
const identityLabel = identity => identity.category === 'patient' ? 'Patient' : 'Employee: ' + staffLabel(identity) + (identity.plannedStaffRole ? ' (level ' + identity.plannedStaffRole.facilityLevel + ' planned)' : '');

export function assertRoster(roster) {
  assert.equal(roster.cohort, 'patient-gapfill-v6c');
  assert.equal(roster.schemaVersion, 'patient-gapfill-v6c-roster/v1');
  assert(typeof roster.coverageAudit?.path === 'string' && /^[a-f0-9]{64}$/.test(roster.coverageAudit?.sha256), 'coverage audit receipt required');
  assert.equal(hash(resolve(repo, roster.coverageAudit.path)), roster.coverageAudit.sha256, 'coverage audit changed since root allocation');
  assert.equal(roster.identities.length, 19, 'roster must have exactly 19 identities');
  assert.deepEqual(roster.identities.map(item => item.number), Array.from({ length: 19 }, (_, index) => String(index + 1).padStart(3, '0')));
  assert.equal(new Set(roster.identities.map(item => item.stableId)).size, 19);
  assert.deepEqual(rosterContract(roster).categoryCounts, {staff: 0, patient: 19});
  assert.deepEqual(rosterContract(roster).demographicCounts, {Female: {young_adult: 0, adult: 2, middle_aged: 0, older_adult: 7}, Male: {young_adult: 0, adult: 2, middle_aged: 0, older_adult: 8}});
  const roleSource = readFileSync(resolve(repo, 'packages/balance-config/src/prototype-balance.ts'), 'utf8');
  const definedRoles = new Set([...roleSource.matchAll(/\bid:\s*["'](staff\.[^"']+)["']/g)].map(match => match[1]));
  for (const item of roster.identities) {
    assert.equal(item.stableId, 'patient-gapfill-v6c.' + item.number);
    assert(['staff', 'patient'].includes(item.category), 'unknown identity category');
    if (item.category === 'staff') {
      assert(Array.isArray(item.eligibleStaffRoleDefinitionIds), 'staff requires explicit eligible role metadata');
      assert.equal(new Set(item.eligibleStaffRoleDefinitionIds).size, item.eligibleStaffRoleDefinitionIds.length, 'duplicate staff role');
      assert(item.eligibleStaffRoleDefinitionIds.every(role => typeof role === 'string' && role.length > 0), 'invalid staff role');
      const planned = item.plannedStaffRole;
      if (planned) {
        assert(typeof planned.label === 'string' && planned.label.length > 0, 'future staff requires a display label');
        assert(Number.isInteger(planned.facilityLevel) && planned.facilityLevel >= 1, 'future staff requires a facility roadmap level');
        assert(['roadmap-only', 'referenced-not-yet-defined'].includes(planned.status), 'unknown future role state');
        assert(Array.isArray(planned.evidencePaths) && planned.evidencePaths.length > 0, 'future staff requires roadmap evidence');
        for (const evidence of planned.evidencePaths) assert(typeof evidence === 'string' && existsSync(resolve(repo, evidence)), 'missing future role evidence');
        if (planned.status === 'roadmap-only') {
          assert.equal(planned.roleDefinitionId, undefined, 'roadmap display role must not invent a stable job ID');
          assert.equal(item.eligibleStaffRoleDefinitionIds.length, 0, 'roadmap-only identity must not claim runtime eligibility');
        } else {
          assert(typeof planned.roleDefinitionId === 'string' && planned.roleDefinitionId.startsWith('staff.'), 'referenced future role requires its real seam ID');
          assert(!definedRoles.has(planned.roleDefinitionId), 'pending role now has a definition; parent must reassess its metadata');
          assert(roleSource.includes('"' + planned.roleDefinitionId + '"'), 'future role ID has no code reference');
          assert(item.eligibleStaffRoleDefinitionIds.every(role => role === planned.roleDefinitionId), 'future role eligibility exceeds its evidenced seam');
        }
      } else {
        assert(item.eligibleStaffRoleDefinitionIds.length > 0, 'active staff requires an existing eligible job');
        for (const role of item.eligibleStaffRoleDefinitionIds) assert(definedRoles.has(role), 'unknown active staff definition ' + role);
      }
    } else {
      assert(!item.eligibleStaffRoleDefinitionIds || item.eligibleStaffRoleDefinitionIds.length === 0, 'patients must not claim staff eligibility');
      assert.equal(item.plannedStaffRole, undefined, 'patients must not claim planned staff roles');
    }
    assert(['Female', 'Male'].includes(item.compatibleSexLabel), 'unknown sex label');
    assert(Number.isInteger(item.intendedAge) && item.intendedAge >= 18 && item.intendedAge <= 120, 'adult visual age expected');
    const ageBand = item.intendedAge < 30 ? 'young_adult' : item.intendedAge < 45 ? 'adult' : item.intendedAge < 65 ? 'middle_aged' : 'older_adult';
    assert.equal(item.ageBand, ageBand, 'age-band metadata inconsistent');
    for (const stage of ['stage1', 'stage2']) assert(existsSync(resolve(tool, item[stage].prompt)), 'missing planned prompt ' + item.number + '/' + stage);
    assert.equal(item.stage1.references.length, 1);
    assert.equal(item.stage2.references.length, 2);
    const style = item.stage1.references[0];
    assert.equal(hash(resolve(repo, style.path)), style.sha256, 'pinned style reference changed');
    assert.deepEqual(item.stage2.references[0], style);
    assert.equal(item.stage2.references[1].path, 'sources/' + item.number + '/stage1-standing-cardinals.png', 'identity reference must point to its own standing stage');
  }
}

export function rosterContract(roster) {
  const demographicCounts = {};
  for (const sex of ['Female', 'Male']) {
    const matching = roster.identities.filter(identity => identity.compatibleSexLabel === sex);
    if (matching.length) demographicCounts[sex] = Object.fromEntries(['young_adult', 'adult', 'middle_aged', 'older_adult'].map(band => [band, matching.filter(identity => identity.ageBand === band).length]));
  }
  const categoryCounts = Object.fromEntries(['staff', 'patient'].map(category => [category, roster.identities.filter(identity => identity.category === category).length]));
  const staffRoleCounts = {};
  const plannedStaffRoleCounts = {};
  for (const identity of roster.identities.filter(item => item.category === 'staff')) {
    if (identity.plannedStaffRole) {
      const key = identity.plannedStaffRole.label + ' (level ' + identity.plannedStaffRole.facilityLevel + '; ' + identity.plannedStaffRole.status + ')';
      plannedStaffRoleCounts[key] = (plannedStaffRoleCounts[key] ?? 0) + 1;
    } else for (const role of identity.eligibleStaffRoleDefinitionIds) staffRoleCounts[role] = (staffRoleCounts[role] ?? 0) + 1;
  }
  return { identities: roster.identities.length, posesPerIdentity: 8, totalPoses: roster.identities.length * 8, categoryCounts, staffRoleCounts, plannedStaffRoleCounts, demographicCounts };
}

export function sourceFiles(identity, stage = 'stage2') {
  const dir = resolve(root, 'sources', identity.number);
  const prefix = stage === 'stage1' ? 'stage1-' : '';
  return {
    png: resolve(dir, stage === 'stage1' ? 'stage1-standing-cardinals.png' : 'source.png'),
    prompt: resolve(dir, prefix + 'exact-prompt.txt'),
    args: resolve(dir, prefix + 'tool-args.json'),
    provenance: resolve(dir, prefix + 'provenance.json'),
  };
}

export function verifySource(identity) {
  const stage1 = sourceFiles(identity, 'stage1');
  const selected = sourceFiles(identity);
  const styleFile = resolve(repo, identity.stage1.references[0].path);
  const historyRoot = resolve(root, 'sources', identity.number, 'history');
  const specPrompt = readFileSync(resolve(tool, identity.stage2.prompt), 'utf8').trimEnd();

  function verifyEvidence(files, workspaceName, promptName) {
    for (const file of Object.values(files)) assert(existsSync(file), 'missing ' + rel(file));
    const prompt = readFileSync(files.prompt, 'utf8'), args = json(files.args), provenance = json(files.provenance);
    assert.equal(args.prompt, prompt, 'exact tool prompt mismatch ' + identity.number);
    assert.equal(args.transparent_background, true);
    assert.equal(provenance.toolMode, 'built-in-image_gen');
    const sourceHash = hash(files.png);
    assert.equal(provenance.nativeOutput?.sha256, sourceHash);
    assert(typeof provenance.nativeOutput?.path === 'string' && existsSync(local(provenance.nativeOutput.path)), 'native output unavailable');
    assert.equal(hash(local(provenance.nativeOutput.path)), sourceHash, 'workspace PNG differs from native output');
    assert.equal(provenance.workspaceCopy?.path, workspaceName);
    assert.equal(provenance.workspaceCopy?.sha256, sourceHash);
    assert.equal(provenance.prompt?.path, promptName);
    assert.equal(provenance.prompt?.sha256, hash(files.prompt));
    assert(Array.isArray(provenance.references) && provenance.references.length > 0, 'missing source references');
    assert.deepEqual(args.referenced_image_paths, provenance.references.map(item => item.path), 'reference order mismatch');
    for (const reference of provenance.references) {
      const evidence = local(reference.preservedCopyPath ?? reference.path);
      assert.equal(hash(evidence), reference.sha256, 'reference evidence hash mismatch');
      assert.equal(hash(local(reference.path)), reference.sha256, 'actual referenced file differs from evidence');
    }
    return { files, sha256: sourceHash, prompt, provenance };
  }

  const standing = verifyEvidence(stage1, 'stage1-standing-cardinals.png', 'stage1-exact-prompt.txt');
  assert.equal(standing.prompt.trimEnd(), readFileSync(resolve(tool, identity.stage1.prompt), 'utf8').trimEnd(), 'Stage 1 differs from original batch prompt');
  assert.deepEqual(standing.provenance.references.map(reference => local(reference.path)), [styleFile]);
  assert.equal(standing.provenance.references[0].sha256, identity.stage1.references[0].sha256);

  const activePaths = new Set(), activeHashes = new Set(), chain = [];
  function visit(files) {
    const evidence = verifyEvidence(files, 'source.png', 'exact-prompt.txt');
    const key = local(files.png);
    assert(!activePaths.has(key) && !activeHashes.has(evidence.sha256), 'cycle in corrective source history');
    activePaths.add(key); activeHashes.add(evidence.sha256);
    const original = evidence.prompt.trimEnd() === specPrompt;
    if (original) {
      assert.deepEqual(evidence.provenance.references.map(reference => local(reference.path)), [styleFile, stage1.png], 'original Stage 2 references differ from batch spec');
      assert.equal(evidence.provenance.references[0].sha256, identity.stage2.references[0].sha256);
      assert.equal(evidence.provenance.references[1].sha256, standing.sha256);
    } else {
      assert(typeof evidence.provenance.generation === 'string' && evidence.provenance.generation.startsWith('targeted-'), 'non-spec source must declare a targeted corrective generation');
      let editTargets = 0;
      for (const reference of evidence.provenance.references) {
        const file = local(reference.path);
        if (file === styleFile) { assert.equal(reference.sha256, identity.stage1.references[0].sha256); continue; }
        const historyRelative = relative(historyRoot, file);
        assert(historyRelative && !historyRelative.startsWith('..') && !isAbsolute(historyRelative), 'corrective target must be immutable history for this identity');
        assert.equal(file.split(/[\\/]/).pop(), 'source.png', 'corrective target must identify a preserved whole sheet');
        const directory = resolve(file, '..');
        const parent = visit({
          png: file, prompt: resolve(directory, 'exact-prompt.txt'),
          args: resolve(directory, 'tool-args.json'), provenance: resolve(directory, 'provenance.json'),
        });
        assert.equal(parent.sha256, reference.sha256);
        editTargets++;
      }
      assert(editTargets > 0, 'corrective source lacks a verified immutable edit target');
    }
    activePaths.delete(key); activeHashes.delete(evidence.sha256);
    chain.push({
      kind: original ? 'original-spec-stage2' : 'targeted-edit-stage2',
      source: { path: rel(files.png), sha256: evidence.sha256 },
      exactPrompt: { path: rel(files.prompt), sha256: hash(files.prompt) },
      toolArguments: { path: rel(files.args), sha256: hash(files.args) },
      provenance: { path: rel(files.provenance), sha256: hash(files.provenance) },
    });
    return evidence;
  }
  const final = visit(selected);
  assert(chain.some(item => item.kind === 'original-spec-stage2'), 'correction chain never reaches original Stage 2 spec');
  return {
    stage1: { files: standing.files, sha256: standing.sha256, validationKind: 'original-spec-stage1' },
    stage2: { files: final.files, sha256: final.sha256, validationKind: chain.length > 1 ? 'verified-targeted-edit-chain' : 'original-spec-stage2', provenanceChain: chain },
  };
}

export function contactContractPayload(roster, acceptance) {
  return roster.identities.map(identity => {
    const contacts = acceptance.seatContacts?.[identity.number];
    return {
      number: identity.number, sourceSha256: contacts?.sourceSha256,
      contacts: Object.fromEntries(directions.map(direction => [direction, contacts?.[direction]])),
    };
  });
}

export function alphaSummary(entries) {
  const poses = entries.flatMap(entry => Object.values(entry.poses).flatMap(cardinals => Object.values(cardinals)));
  return {
    identities: entries.length, poses: poses.length,
    sourceNonzeroPixelsWithFootprintOutside: poses.reduce((sum, pose) => sum + pose.sourceNonzeroPixelsWithFootprintOutside, 0),
    sourcePosesWithFootprintOutside: poses.filter(pose => pose.sourceNonzeroPixelsWithFootprintOutside > 0).length,
    maxSourceAlphaWithFootprintOutside: Math.max(0, ...poses.map(pose => pose.maxSourceAlphaWithFootprintOutside)),
    derivedBorderNonzeroPixels: poses.reduce((sum, pose) => sum + pose.derivedBorderNonzeroPixels, 0),
    derivedPosesWithBorderAlpha: poses.filter(pose => pose.derivedBorderNonzeroPixels > 0).length,
    derivedBorderMaxAlpha: Math.max(0, ...poses.map(pose => pose.derivedBorderMaxAlpha)),
    protectedAlphaClipping: poses.some(pose => pose.maxSourceAlphaWithFootprintOutside >= 13),
  };
}

export function alphaClipAnalysis(cell, frame, transform) {
  const data = cell.canvas.getContext('2d').getImageData(0, 0, cell.canvas.width, cell.canvas.height).data;
  let sourceNonzeroPixelsWithFootprintOutside = 0, maxSourceAlphaWithFootprintOutside = 0;
  for (let y = 0; y < cell.canvas.height; y++) for (let x = 0; x < cell.canvas.width; x++) {
    const alpha = data[(y * cell.canvas.width + x) * 4 + 3];
    if (!alpha) continue;
    const left = transform.translateX + x * transform.scale, right = transform.translateX + (x + 1) * transform.scale;
    const top = transform.translateY + y * transform.scale, bottom = transform.translateY + (y + 1) * transform.scale;
    if (left < 0 || right > target.width || top < 0 || bottom > target.height) {
      sourceNonzeroPixelsWithFootprintOutside++;
      maxSourceAlphaWithFootprintOutside = Math.max(maxSourceAlphaWithFootprintOutside, alpha);
    }
  }
  const dataOut = frame.canvas.getContext('2d').getImageData(0, 0, target.width, target.height).data;
  let derivedBorderNonzeroPixels = 0, derivedBorderMaxAlpha = 0;
  for (let y = 0; y < target.height; y++) for (let x = 0; x < target.width; x++) {
    if (x !== 0 && y !== 0 && x !== target.width - 1 && y !== target.height - 1) continue;
    const alpha = dataOut[(y * target.width + x) * 4 + 3];
    if (alpha) { derivedBorderNonzeroPixels++; derivedBorderMaxAlpha = Math.max(derivedBorderMaxAlpha, alpha); }
  }
  assert(maxSourceAlphaWithFootprintOutside < 13, 'normalization clips alpha >=13');
  return { analysisThreshold: 13, sourceNonzeroPixelsWithFootprintOutside, maxSourceAlphaWithFootprintOutside, derivedBorderNonzeroPixels, derivedBorderMaxAlpha };
}

function writePng(file, canvas) {
  const bytes = canvas.toBuffer('image/png');
  writeFileSync(file, bytes);
  return { file: rel(file), sha256: createHash('sha256').update(bytes).digest('hex') };
}

function fullProof(frames, theme, output) {
  const canvas = createCanvas(640, 640), context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  if (theme) { context.fillStyle = theme === 'dark' ? '#20252b' : '#eee9df'; context.fillRect(0, 0, 640, 640); }
  frames.forEach((frame, index) => context.drawImage(frame.canvas, index % 4 * 160, Math.floor(index / 4) * 320));
  return writePng(output, canvas);
}

function contactProof(frames, contacts, output) {
  const canvas = createCanvas(1280, 640), context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  context.fillStyle = '#20252b'; context.fillRect(0, 0, 1280, 640);
  for (const [index, direction] of directions.entries()) {
    const x = index * 320;
    context.drawImage(frames[index + 4].canvas, x, 0, 320, 640);
    context.strokeStyle = 'rgba(255,45,85,.5)'; context.lineWidth = 1;
    for (let line = 0; line <= 320; line += 10) {
      context.beginPath(); context.moveTo(x, line * 2); context.lineTo(x + 320, line * 2); context.stroke(); context.fillStyle = '#f5c47a'; context.font = '12px sans-serif'; context.fillText(String(line), x + 2, line * 2 + 12);
    }
    context.strokeStyle = '#22d3ee'; context.lineWidth = 3;
    context.beginPath(); context.moveTo(x, contacts[direction] * 2); context.lineTo(x + 320, contacts[direction] * 2); context.stroke();
  }
  return writePng(output, canvas);
}

function preserveReviewSnapshot(out) {
  const previousFile = resolve(out, 'manifest.json');
  if (!existsSync(previousFile)) return;
  const previous = json(previousFile), manifestSha256 = hash(previousFile);
  const directory = resolve(out, 'review-history', manifestSha256);
  const receiptFile = resolve(directory, 'snapshot-receipt.json');
  if (existsSync(receiptFile)) {
    const receipt = json(receiptFile);
    assert.equal(receipt.originalManifest.sha256, manifestSha256);
    for (const item of receipt.files) assert.equal(hash(resolve(directory, item.file)), item.sha256, 'immutable review snapshot changed');
    return;
  }
  const items = [{ file: previousFile, sha256: manifestSha256 },
    ...Object.values(previous.poses).flatMap(cardinals => Object.values(cardinals)).map(pose => ({ file: local(pose.file), sha256: pose.sha256 })),
    ...Object.values(previous.proofs).map(proof => ({ file: local(proof.file), sha256: proof.sha256 })),
  ];
  mkdirSync(directory, { recursive: true });
  const files = items.map(item => {
    assert.equal(hash(item.file), item.sha256, 'previous review artifact changed before snapshot');
    const filename = item.file.split(/[\\/]/).pop(), destination = resolve(directory, filename);
    if (existsSync(destination)) assert.equal(hash(destination), item.sha256, 'partial review snapshot differs');
    else writeFileSync(destination, readFileSync(item.file));
    return { file: filename, sha256: item.sha256, copiedFrom: rel(item.file) };
  });
  writeJson(receiptFile, {
    schemaVersion: 'patient-gapfill-v6c-review-snapshot/v1',
    policy: 'Byte-exact earlier review package and proof evidence; original manifest paths describe its historical active package. Use this receipt to resolve the preserved local copies.',
    number: previous.identity.number, sourceSha256: previous.source.stage2.png.sha256,
    originalManifest: { file: 'manifest.json', sha256: manifestSha256 },
    contactCoordinates: previous.seatContactAcceptance.coordinates,
    reviewedDirections: previous.seatContactAcceptance.reviewedDirections,
    files,
  });
}

async function packageIdentity(identity, acceptance, integration) {
  const sources = verifySource(identity);
  assert(!acceptance.rejected?.[identity.number]?.includes(sources.stage2.sha256), 'known rejected source ' + identity.number);
  const sheet = await loadCanvas(sources.stage2.files.png);
  const data = sheet.getContext('2d').getImageData(0, 0, sheet.width, sheet.height).data;
  assert(data.some((value, index) => index % 4 === 3 && value === 0), 'source lacks alpha-zero transparency');
  const extraction = extractEight(sheet), frames = normalizeCells(extraction.cells, target);
  let contacts = acceptance.seatContacts[identity.number];
  if (!contacts || contacts.sourceSha256 !== sources.stage2.sha256) {
    contacts = {
      sourceSha256: sources.stage2.sha256,
      ...Object.fromEntries(directions.map((direction, index) => [direction, Math.round(inferSeatContact(frames[index + 4]))])),
      approvedDirections: [], status: 'derived-candidate-pending-root-directional-review',
    };
    acceptance.seatContacts[identity.number] = contacts;
  }
  for (const direction of directions) assert(Number.isInteger(contacts[direction]) && contacts[direction] >= 0 && contacts[direction] < 320, 'invalid contact ' + identity.number + '/' + direction);
  const measuredFrames = frames.map((frame, index) => {
    const metrics = measure(frame.canvas); assert.equal(metrics.borderPixels, 0);
    return { metrics, alphaNormalization: alphaClipAnalysis(extraction.cells[index], frame, frame.transform) };
  });
  const out = resolve(packageRoot, identity.number); mkdirSync(out, { recursive: true });
  preserveReviewSnapshot(out);
  const poses = { stand: {}, sit: {} };
  for (const [index, slot] of SLOTS.entries()) {
    const frame = frames[index], { metrics, alphaNormalization } = measuredFrames[index];
    const written = writePng(resolve(out, slot.pose + '-' + slot.direction + '.png'), frame.canvas);
    poses[slot.pose][slot.direction] = {
      ...written, visibleBounds: metrics.visibleBounds, transform: frame.transform,
      alphaNormalization,
      anchors: {
        bodyAxisX: 80, floorY: 287,
        ...(slot.pose === 'sit' ? { seatContactY: contacts[slot.direction], seatContactStatus: contactAnchorStatus(contacts, slot.direction) } : {}),
      },
    };
  }
  assert.equal(new Set(SLOTS.map(slot => poses[slot.pose][slot.direction].sha256)).size, 8, 'duplicate derived views');
  const proofs = {
    fullTransparent: fullProof(frames, null, resolve(out, 'full-poses-transparent.png')),
    fullLight: fullProof(frames, 'light', resolve(out, 'full-poses-light.png')),
    fullDark: fullProof(frames, 'dark', resolve(out, 'full-poses-dark.png')),
    seatedContactGrid: contactProof(frames, contacts, resolve(out, 'seated-contact-grid-2x.png')),
  };
  const sourceDetails = Object.fromEntries(Object.entries(sources).map(([stage, source]) => [
    stage, Object.fromEntries(Object.entries(source.files).map(([kind, file]) => [kind, { path: rel(file), sha256: hash(file) }])),
  ]));
  const rootVisualAccepted = acceptance.accepted[identity.number] === sources.stage2.sha256;
  const manifest = {
    schemaVersion: 'patient-gapfill-v6c-package/v1',
    status: packageStatus(rootVisualAccepted, contacts), runtimeReady: false, ownerApproval: 'pending', runtimeIntegration: integration, identity, source: sourceDetails, provenanceValidation: { stage1: sources.stage1.validationKind, stage2: sources.stage2.validationKind, stage2Chain: sources.stage2.provenanceChain },
    rootVisualAcceptance: { ledger: rel(acceptanceFile), sourceSha256: sources.stage2.sha256, accepted: rootVisualAccepted, scope: acceptance.scope },
    seatContactAcceptance: {
      ledger: rel(acceptanceFile), coordinates: Object.fromEntries(directions.map(direction => [direction, contacts[direction]])),
      reviewedDirections: contacts.approvedDirections, status: contacts.status,
    },
    extraction: { method: 'immutable GS026 extractEight', sourceRects: extraction.cells.map(cell => cell.sourceRect), componentCount: extraction.componentCount, ignoredComponents: extraction.ignoredComponents },
    normalization: {
      target, policy: 'one identity-wide whole-body scale; source remains byte-exact; no repaint or mirroring; alpha >=13 outside the derived canvas is forbidden; sub-13 alpha loss is measured for root warning review',
    },
    poses, proofs,
  };
  const manifestFile = resolve(out, 'manifest.json'); writeJson(manifestFile, manifest);
  return {
    number: identity.number, stableId: identity.stableId, manifest: rel(manifestFile),
    sourceSha256: sources.stage2.sha256, rootVisualAccepted,
    contactCoordinates: manifest.seatContactAcceptance.coordinates,
    contactDirectionsReviewed: contacts.approvedDirections, proofs,
  };
}


async function sourceReview(roster) {
  const reviewRoot = resolve(root, 'review');
  const sources = roster.identities.filter(identity => existsSync(sourceFiles(identity).png));
  const pages = [];
  for (let start = 0; start < sources.length; start += 4) {
    const identities = sources.slice(start, start + 4);
    const canvas = createCanvas(1536, 1080), context = canvas.getContext('2d');
    context.fillStyle = '#20252b'; context.fillRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = false;
    const pageSources = [];
    for (const [index, identity] of identities.entries()) {
      const file = sourceFiles(identity).png, image = await loadCanvas(file);
      const x = index % 2 * 768, y = Math.floor(index / 2) * 540;
      const scale = Math.min(768 / image.width, 512 / image.height);
      context.fillStyle = '#ffffff'; context.font = '18px sans-serif';
      context.fillText(identity.number + ' · ' + identityLabel(identity) + ' · ' + identity.compatibleSexLabel + ' · age ' + identity.intendedAge + ' · ' + hash(file).slice(0, 12), x + 12, y + 22);
      context.drawImage(image, x + (768 - image.width * scale) / 2, y + 28 + (512 - image.height * scale) / 2, image.width * scale, image.height * scale);
      pageSources.push({ number: identity.number, path: rel(file), sha256: hash(file) });
    }
    pages.push({ sources: pageSources, proof: writePng(resolve(reviewRoot, 'source-review-' + String(pages.length + 1).padStart(2, '0') + '.png'), canvas) });
  }
  writeJson(resolve(reviewRoot, 'source-review-manifest.json'), { schemaVersion: 'patient-gapfill-v6c-source-review/v1', policy: 'review composites only; original native sources remain byte-exact', pages });
  writeFileSync(resolve(reviewRoot, 'source-review.html'), '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Native character source sheets</title><style>body{margin:24px;background:#20252b;color:white;font-family:system-ui}img{display:block;width:100%;height:auto}a{color:#67e8f9}</style><h1>Native eight-pose source review</h1><p>Labels sit outside the native sheets. This review resize preserves each full canvas and does not modify any source PNG.</p>' + pages.map(page => '<p>' + page.sources.map(source => source.number).join(', ') + ' · <a href="' + page.proof.file.split('/').pop() + '">open full board</a></p><img src="' + page.proof.file.split('/').pop() + '" alt="Native eight-pose sources ' + page.sources.map(source => source.number).join(', ') + '">').join(''));
}

async function buildReview(entries, issues, acceptance, roster, integration) {
  const contactsReviewed = entries.length === 19 &&
    acceptance.seatContactAcceptance?.reviewer === 'root' &&
    acceptance.seatContactAcceptance?.contractSha256 === hashText(JSON.stringify(contactContractPayload(roster, acceptance))) &&
    entries.every(entry => entry.rootVisualAccepted && directions.every(direction => acceptance.seatContacts[entry.number].approvedDirections?.includes(direction)));
  const integrationDescription = 'Manager visual acceptance and runtime integration remain pending.';
  const contactTitle = contactsReviewed ? 'Root seated-contact QA complete; owner review pending' : 'Seated contact candidates — root review required';
  const contactDescription = contactsReviewed
    ? 'Root reviewed all four seated directions against the exact source hashes. Chair placement composites are linked separately. ' + integrationDescription
    : 'Cyan lines are worker-authored visual anchors. The manager must review all four cardinals against the exact source hash before runtime integration.';

  const reviewRoot = resolve(root, 'review'), contactRoot = resolve(root, 'contact-review');
  mkdirSync(reviewRoot, { recursive: true }); mkdirSync(contactRoot, { recursive: true }); await sourceReview(roster);
  for (const theme of ['light', 'dark']) {
    const canvas = createCanvas(800, Math.max(1, Math.ceil(entries.length / 5)) * 344), context = canvas.getContext('2d');
    context.fillStyle = theme === 'dark' ? '#20252b' : '#eee9df'; context.fillRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = false;
    for (const [index, entry] of entries.entries()) {
      const x = index % 5 * 160, y = Math.floor(index / 5) * 344;
      context.drawImage(await loadCanvas(resolve(packageRoot, entry.number, 'stand-south.png')), x, y);
      context.fillStyle = theme === 'dark' ? '#ffffff' : '#20252b'; context.font = '12px sans-serif'; context.fillText(entry.number, x + 4, y + 336);
    }
    writePng(resolve(reviewRoot, 'gallery-' + theme + '.png'), canvas);
  }
  const overview = createCanvas(1280, Math.max(1, Math.ceil(entries.length / 4)) * 310), overviewContext = overview.getContext('2d');
  overviewContext.fillStyle = '#eee9df'; overviewContext.fillRect(0, 0, overview.width, overview.height); overviewContext.imageSmoothingEnabled = false;
  for (const [index, entry] of entries.entries()) {
    const x = index % 4 * 320, y = Math.floor(index / 4) * 310;
    overviewContext.fillStyle = '#ffffff'; overviewContext.fillRect(x + 4, y + 4, 312, 302);
    overviewContext.drawImage(await loadCanvas(resolve(packageRoot, entry.number, 'stand-south.png')), x + 8, y + 8, 144, 288);
    overviewContext.drawImage(await loadCanvas(resolve(packageRoot, entry.number, 'sit-east.png')), x + 168, y + 8, 144, 288);
    const identity = json(resolve(repo, entry.manifest)).identity;
    overviewContext.fillStyle = '#20252b'; overviewContext.font = '12px sans-serif'; overviewContext.fillText(entry.number + ' · ' + (identity.category === 'patient' ? 'Patient' : staffLabel(identity)) + ' · ' + identity.compatibleSexLabel + ' · age ' + identity.intendedAge, x + 10, y + 302);
  }
  writePng(resolve(reviewRoot, 'owner-overview-stand-south-sit-east.png'), overview);
  const pages = [];
  for (let start = 0; start < entries.length; start += 4) {
    const rows = entries.slice(start, start + 4), canvas = createCanvas(640, rows.length * 356 + 32), context = canvas.getContext('2d');
    context.fillStyle = '#20252b'; context.fillRect(0, 0, canvas.width, canvas.height); context.imageSmoothingEnabled = false;
    context.fillStyle = '#ffffff'; context.font = '16px sans-serif'; context.fillText(contactTitle, 12, 22);
    for (const [row, entry] of rows.entries()) {
      const y = 32 + row * 356, contacts = acceptance.seatContacts[entry.number];
      context.fillStyle = '#ffffff'; context.font = '12px sans-serif'; context.fillText(entry.stableId + ' · ' + entry.sourceSha256.slice(0, 12) + ' · S/E/W/N: ' + directions.map(direction => contacts[direction]).join('/'), 8, y + 17);
      for (const [column, direction] of directions.entries()) {
        const x = column * 160;
        context.drawImage(await loadCanvas(resolve(packageRoot, entry.number, 'sit-' + direction + '.png')), x, y + 28);
        for (let line = 0; line <= 320; line += 10) {
          context.strokeStyle = 'rgba(255,45,85,.2)'; context.lineWidth = .5; context.beginPath(); context.moveTo(x, y + 28 + line); context.lineTo(x + 160, y + 28 + line); context.stroke();
          context.fillStyle = '#f5c47a'; context.font = '8px sans-serif'; context.fillText(String(line), x + 2, y + 28 + line + 8);
        }
        context.strokeStyle = '#22d3ee'; context.lineWidth = 2; context.beginPath(); context.moveTo(x, y + 28 + contacts[direction]); context.lineTo(x + 160, y + 28 + contacts[direction]); context.stroke();
        context.fillStyle = '#9ee7f5'; context.font = '12px sans-serif'; context.fillText(direction, x + 6, y + 343);
      }
    }
    pages.push({ identities: rows.map(entry => entry.number), proof: writePng(resolve(contactRoot, 'contact-review-' + String(pages.length + 1).padStart(2, '0') + '.png'), canvas) });
  }
  writeJson(resolve(contactRoot, 'contact-review-manifest.json'), { schemaVersion: 'patient-gapfill-v6c-contact-review/v1', status: contactsReviewed ? 'root-review-complete-owner-review-pending' : 'candidate-review-only', runtimeIntegration: integration, pages });
  writeFileSync(resolve(contactRoot, 'index.html'), '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Seated contacts</title><style>body{font-family:system-ui;margin:24px;background:#20252b;color:white}a{color:#67e8f9}</style><h1>Seated contact review</h1><p>' + contactDescription + '</p><ul>' + pages.map(page => '<li><a href="' + page.proof.file.split('/').pop() + '">' + page.identities.join(', ') + '</a></li>').join('') + '</ul>');
  const cards = entries.map(entry => {
    const identity = json(resolve(repo, entry.manifest)).identity;
    const placement = existsSync(resolve(root, 'placement-qa', entry.number + '-front-desk-chair-placement.png'));
    return '<article><h2>' + htmlEscape(identity.stableId) + ' · ' + htmlEscape(identityLabel(identity)) + ' · ' + identity.compatibleSexLabel + ' · age ' + identity.intendedAge + ' · ' + htmlEscape(identity.visualBrief.outfit) + '</h2><img src="../packages/' + entry.number + '/full-poses-light.png" alt="' + entry.number + ' eight poses on light background"><img src="../packages/' + entry.number + '/full-poses-dark.png" alt="' + entry.number + ' eight poses on dark background"><p><a href="../packages/' + entry.number + '/manifest.json">manifest</a> · <a href="../sources/' + entry.number + '/source.png">native eight-pose source</a> · <a href="../sources/' + entry.number + '/stage1-standing-cardinals.png">standing identity reference</a> · <a href="../sources/' + entry.number + '/exact-prompt.txt">exact prompt</a> · <a href="../sources/' + entry.number + '/tool-args.json">tool arguments</a> · <a href="../sources/' + entry.number + '/provenance.json">provenance</a>' + (placement ? ' · <a href="../placement-qa/' + entry.number + '-front-desk-chair-placement.png">chair placement</a>' : '') + '</p></article>';
  }).join('');
  const contract = rosterContract(roster);
  const plannedRoles = [...new Set(roster.identities.filter(identity => identity.plannedStaffRole).map(identity => staffLabel(identity) + ' (level ' + identity.plannedStaffRole.facilityLevel + ')'))];
  writeFileSync(resolve(reviewRoot, 'index.html'), '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nineteen gap-fill patient stills</title><style>body{margin:24px;background:#eee9df;color:#20252b;font-family:system-ui}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:18px}article{padding:12px;background:white;border:1px solid #b7b0a6;border-radius:8px}h2{font-size:14px}img{display:block;width:100%;height:auto;margin:8px 0}a{color:#0645ad}</style><h1>Nineteen gap-fill patient still packages</h1><p>' + entries.length + '/19 identities · ' + entries.length * 8 + '/152 poses · ' + contract.categoryCounts.staff + ' employees · ' + contract.categoryCounts.patient + ' patients. ' + integrationDescription + ' Native art is preserved unchanged.</p>' + (plannedRoles.length ? '<p>Roadmap roles: ' + htmlEscape(plannedRoles.join(', ')) + '. These designs cover future roles; their jobs remain pending implementation.</p>' : '') + '<p><a href="source-review.html">Native eight-pose source boards</a> · <a href="owner-overview-stand-south-sit-east.png">Paired standing and seated overview</a> · <a href="../contact-review/index.html">Four-direction seated contacts</a>' + (existsSync(resolve(root, 'placement-qa/index.html')) ? ' · <a href="../placement-qa/index.html">Approved-chair placement proofs</a>' : '') + '</p>' + (issues.length ? '<p>Pending or blocked identities: ' + issues.map(issue => htmlEscape(issue.number + ' (' + issue.status + ')')).join(', ') + '</p>' : '') + '<main>' + cards + '</main>');
}

export async function build() {
  assert(!existsSync(resolve(tool, 'owner-approval.json')), 'Approved review evidence is frozen. Use a separately authorized integration lane; do not regenerate the approved batch.');
  const roster = json(resolve(tool, 'roster.json')); assertRoster(roster);
  mkdirSync(root, { recursive: true });
  captureRuntimeBaseline(); const baseline = verifyRuntimeBaseline();
  const ledgerHash = hash(acceptanceFile);
  const ledger = json(acceptanceFile);
  assert.equal(ledger.schemaVersion, 'patient-gapfill-v6c-review/v1', 'wrong root review ledger');
  assert(ledger.accepted && ledger.seatContacts, 'root ledger must contain accepted sources and explicit contact records');
  const integration = reviewState();
  const acceptance = { ...ledger, accepted: { ...ledger.accepted }, seatContacts: { ...ledger.seatContacts } }, entries = [], issues = [];
  acceptance.runtimeIntegration = integration;
  for (const identity of roster.identities) {
    if (!existsSync(sourceFiles(identity).png)) { issues.push({ number: identity.number, status: 'missing-source' }); continue; }
    try { entries.push(await packageIdentity(identity, acceptance, integration)); }
    catch (error) { issues.push({ number: identity.number, status: 'source-or-package-failed', message: error.message }); }
  }
  assert.equal(new Set(entries.map(entry => entry.sourceSha256)).size, entries.length, 'duplicate selected identity sources');
  const allPoseHashes = entries.flatMap(entry => {
    const poses = json(resolve(repo, entry.manifest)).poses;
    return SLOTS.map(slot => poses[slot.pose][slot.direction].sha256);
  });
  assert.equal(new Set(allPoseHashes).size, allPoseHashes.length, 'duplicate derived pose across identities');
  const existingHashes = new Set(baseline.assets.map(asset => asset.sha256));
  assert(allPoseHashes.every(sha256 => !existingHashes.has(sha256)), 'new pose duplicates an existing runtime asset');
  // Inferred contacts are review artifacts. The root-owned ledger is read-only.
  writeJson(resolve(root, 'seat-contact-candidates.json'), { schemaVersion: 'patient-gapfill-v6c-contact-candidates/v1', scope: 'inferred-or-ledger-copied-contact-candidates-only', seatContacts: acceptance.seatContacts });
  await buildReview(entries, issues, acceptance, roster, integration);
  const alphaReport = {
    schemaVersion: 'patient-gapfill-v6c-alpha-normalization/v1',
    policy: 'Native PNGs are immutable. Alpha >=13 outside the derived canvas is a hard failure. Sub-13 source alpha loss and output-border alpha are measured for explicit root review.',
    entries: entries.map(entry => {
      const manifest = json(resolve(repo, entry.manifest));
      return { number: entry.number, sourceSha256: entry.sourceSha256, poses: Object.fromEntries(['stand', 'sit'].map(pose => [pose, Object.fromEntries(directions.map(direction => [direction, manifest.poses[pose][direction].alphaNormalization]))])) };
    }),
  };
  alphaReport.summary = alphaSummary(alphaReport.entries);
  const alphaFile = resolve(root, 'alpha-normalization-report.json'); writeJson(alphaFile, alphaReport);
  const staged = {
    schemaVersion: 'patient-gapfill-v6c-staging/v1',
    runtimeReady: false, ownerApproval: 'pending',
    status: entries.length === 19 && issues.length === 0 && entries.every(entry => entry.rootVisualAccepted && entry.contactDirectionsReviewed?.length === 4) && acceptance.derivedAlphaWarningAcceptance?.reviewer === 'root' && acceptance.derivedAlphaWarningAcceptance?.reportSha256 === hash(alphaFile)
      ? 'review-ready-pending-owner-approval' : 'candidate-review-root-checks-pending',
    runtimeIntegration: integration,
    baseline: rel(baselineFile), target,
    coverageAudit: roster.coverageAudit,
    rosterEvidence: { path: rel(resolve(tool, 'roster.json')), sha256: hash(resolve(tool, 'roster.json')) },
    reviewLedger: { path: rel(acceptanceFile), sha256: ledgerHash },
    rosterContract: rosterContract(roster),
    seatContactContractSha256: hashText(JSON.stringify(contactContractPayload(roster, acceptance))),
    derivedAlphaReport: { path: rel(alphaFile), sha256: hash(alphaFile), rootWarningAccepted: acceptance.derivedAlphaWarningAcceptance?.reviewer === 'root' && acceptance.derivedAlphaWarningAcceptance?.reportSha256 === hash(alphaFile) },
    entries, issues, totals: { expected: 19, packaged: entries.length, poses: entries.length * 8, issues: issues.length },
  };
  writeJson(resolve(root, 'staging-registry.json'), staged);
  assert.equal(hash(acceptanceFile), ledgerHash, 'root review ledger changed during packaging');
  verifyRuntimeBaseline();
  console.log(JSON.stringify({ status: issues.length ? 'PASS_WITH_REPORTED_GAPS' : 'PASS', packaged: entries.length, poses: entries.length * 8, issues, runtimeReady: integration.ready, ownerApproval: integration.ownerApproval }));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
