/** Fresh, offline fingerprints of inputs used by this QA scene. Shared JSON
 * registries are sliced by measured frame; shared TS is sliced by draw method.
 * No module/JSON cache, server, browser, installs or generated-art writes. */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stripTypeScriptTypes } from 'node:module';
import { parseSync } from 'rolldown/utils';

const defaultRoot = fileURLToPath(new URL('../../', import.meta.url));
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const stable = value => JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);
const exactSources = [
  'apps/player/character-phlebotomy.html',
  'apps/player/src/art/characterPhlebotomyQa.ts',
  'apps/player/src/art/characterPhlebotomyQaModel.ts',
  'apps/player/src/art/characterPhlebotomyQa.frames.json',
  'apps/player/src/art/characterPhlebotomyQa.before.json',
  'apps/player/src/facility/phlebotomyPresentation.ts',
  'tools/art/character-phlebotomy-capture.mjs',
  'tools/art/character-phlebotomy-inputs.mjs',
];
const functions = {
  'apps/player/src/facility/FacilityScene.ts': [
    'calculateLayout', 'orientedSize', 'renderOccupiedCharacterQa', 'debugCharacterGaitSnapshot', 'debugApprovedFixtureSnapshot', 'characterStepMotion',
    'useSmoothDownscaledTextures', 'drawCharacterPresentation', 'drawPixelPerson', 'getApprovedActorSupportDisplayPosition',
    'getRoomActorSupports', 'getTouchupDrawRecords', 'drawApprovedRoomFixtures', 'reconcileApprovedSideChairLayers',
  ],
  'apps/player/src/art/characterBitmapArt.ts': ['descriptor', 'characterStillIdForAppearance', 'characterStillDirection', 'characterStillScaleForAppearance', 'characterBitmapLayers', 'characterBitmapRegistration', 'CHARACTER_STILL_BITMAP_REGISTRATION'],
  'apps/player/src/art/characterStillRegistry.ts': ['getCharacterStillEntry', 'getCharacterStill'],
  'apps/player/src/art/characterProportions.ts': ['getCharacterProportionProfile', 'getCharacterProportionRegistration'],
  'apps/player/src/art/characterRoomProportions.ts': ['seatedCharacterScaleCorrection'],
  'apps/player/src/facility/characterPresentation.ts': ['CHARACTER_STILL_WIDTH_IN_TILES', 'getCharacterStillPresentationMetrics', 'alignCharacterStillSeatToWorld', 'isCharacterTextureKey'],
  'apps/player/src/facility/characterHopMotion.ts': ['CHARACTER_HOP', 'characterMotionSeed', 'characterDrawMotion', 'smoothstep', 'hopLift', 'settleRemaining'],
  'packages/balance-config/src/prototype-balance.ts': [],
  'apps/player/src/facility/approvedRoomPresentation.ts': ['resolveApprovedRoomDrawRecords', 'support', 'bindSideChairSupport'],
  'apps/player/src/facility/approvedRoomRenderer.ts': ['getApprovedSupportFacing', 'getApprovedSupportPainterGround', 'getApprovedDrawPainterGround', 'getNearestApprovedActorSupport'],
  'apps/player/src/facility/approvedSideChairLayers.ts': ['partitionApprovedSideChairPixels', 'isApprovedSideChairForegroundPixel', 'getApprovedSideChairForegroundDepth'],
  'apps/player/src/facility/renderDepth.ts': ['getFacilitySceneDepth'],
  'apps/player/src/facility/roomTouchups.ts': ['file', 'bin', 'applyRoomTouchupsToRecords', 'getVisibleTouchupDecor'],
};

function tokens(node) {
  // Canonical AST retains expressions but ignores source offsets, comments,
  // whitespace and quote spelling. Rolldown's parser is already used by Vite.
  return JSON.parse(JSON.stringify(node, (key, value) => ['start', 'end', 'loc', 'raw', 'comments'].includes(key) ? undefined : typeof value === 'bigint' ? String(value) : value));
}
function property(node, name) { return node.properties?.find(p => (p.key?.name ?? p.key?.value) === name); }
function initializer(node) {
  let value = node.init;
  while (value && ['TSAsExpression', 'TSSatisfiesExpression', 'ParenthesizedExpression'].includes(value.type)) value = value.expression;
  return value;
}

export async function readPhlebotomyCaptureInputs({ root = defaultRoot, readFile = readFileSync } = {}) {
  const read = path => Buffer.from(readFile(resolve(root, path)));
  const json = path => JSON.parse(read(path).toString('utf8'));
  const records = [];
  const add = (path, selector, value) => records.push({ path, selector, sha256: digest(stable(value)) });
  for (const path of exactSources) records.push({ path, selector: 'file', sha256: digest(read(path)) });
  const registry = json('apps/player/src/art/characterStillRegistry.generated.json');
  const proportions = json('apps/player/src/art/characterProportions.generated.json');
  const seated = json('apps/player/src/art/characterRoomProportions.generated.json');
  // The sizing helper is pure and import-free. Evaluate its current local
  // source rather than duplicating the game's math or caching a TS/JSON tree.
  const sizingPath = 'apps/player/src/facility/characterPresentation.ts';
  const sizingJs = stripTypeScriptTypes(read(sizingPath).toString('utf8'), { mode: 'transform' });
  const sizingUrl = 'data:text/javascript;base64,' + Buffer.from(sizingJs).toString('base64');
  const sizing = await import(sizingUrl);
  const motionJs = stripTypeScriptTypes(read('apps/player/src/facility/characterHopMotion.ts').toString('utf8'), { mode: 'transform' })
    .replace(/from (["'])\.\/characterPresentation\1/, `from "${sizingUrl}"`);
  const motion = await import('data:text/javascript;base64,' + Buffer.from(motionJs).toString('base64'));
  const measuredFrames = [];
  for (const [id, posture, facing] of json('apps/player/src/art/characterPhlebotomyQa.frames.json')) {
    const frame = registry.characters.find(c => c.id === id)?.poses[posture]?.[facing];
    const profile = proportions.identities[id], key = `${posture}-${facing}`;
    if (!frame || !profile) throw Error(`Missing measured actor frame: ${id}/${key}`);
    const actor = { id, posture, facing, frame, scale: profile.scale, floorY: profile.floorByPose[key], bounds: profile.boundsByPose[key], seatedCorrection: posture === 'sit' ? seated.identities[id]?.correction ?? 1 : 1 };
    actor.actorKey = id === 'founder.14' ? 'character:founder' : id === 'gs022-new-employee-015' ? 'character:staff:phlebotomist' : 'character:patient:phlebotomy-patient';
    // renderOccupiedCharacterQa clears hop states and resets this clock to 0.
    // It preserves the normal identity-seeded breathing at that fixed instant.
    actor.motion = motion.characterDrawMotion(undefined, posture === 'sit' ? 'seated' : 'idle', {
      seed: motion.characterMotionSeed(actor.actorKey + ':breath'), clockMilliseconds: 0,
    });
    actor.metrics = Object.fromEntries([22, 35, 42, 52, 83, 130].map(tile => [tile, {
      off: sizing.getCharacterStillPresentationMetrics(tile, actor.scale),
      on: sizing.getCharacterStillPresentationMetrics(tile, actor.scale * actor.seatedCorrection),
    }]));
    measuredFrames.push(actor);
    add('apps/player/src/art/characterStillRegistry.generated.json', `${id}/${key}`, frame);
    add('apps/player/src/art/characterProportions.generated.json', `${id}/${key}`, { scale: actor.scale, floorY: actor.floorY, bounds: actor.bounds });
    if (posture === 'sit') add('apps/player/src/art/characterRoomProportions.generated.json', id, { correction: actor.seatedCorrection });
    const path = 'apps/player/public/' + frame.url;
    const actual = digest(read(path));
    if (actual !== frame.sha256.toLowerCase()) throw Error(`Measured actor PNG differs from registry: ${id}/${key} (${path})`);
    records.push({ path, selector: 'asset', sha256: actual });
  }
  const proofPath = 'apps/player/src/facility/approvedRoomProofData.json';
  add(proofPath, 'rooms.phlebotomy', json(proofPath).rooms.phlebotomy);
  for (const path of [
    'apps/player/public/art/rooms/gs015-v1/phlebotomy/south.webp',
    'apps/player/public/art/rooms/gs015-v1/phlebotomy/east.webp',
    'apps/player/public/art/rooms/gs015-v1/phlebotomy/window.webp',
    'apps/player/public/art/rooms/touchup-v1/sample-cart.png',
    'apps/player/public/art/rooms/touchup-v1/biohazard-bin.png',
  ]) records.push({ path, selector: 'asset', sha256: digest(read(path)) });

  let roomFootprint;
  for (const [path, names] of Object.entries(functions)) {
    const parsed = parseSync(path, read(path).toString('utf8'));
    if (parsed.errors.length) throw Error('Cannot parse measured renderer source: ' + path);
    const source = parsed.program;
    const found = new Map();
    function visit(node) {
      if (path === 'packages/balance-config/src/prototype-balance.ts' && node.type === 'ObjectExpression' && property(node, 'id')?.value?.value === 'room.phlebotomy') {
        roomFootprint = { width: property(node, 'width')?.value?.value, height: property(node, 'height')?.value?.value };
        add(path, 'room.phlebotomy.footprint', roomFootprint);
      }
      const name = node.type === 'MethodDefinition' ? node.key?.name : node.id?.name;
      if (['FunctionDeclaration', 'MethodDefinition', 'VariableDeclarator'].includes(node.type) && names.includes(name)) {
        found.set(name, node);
      }
      // Slice shared room tables by this room, not the whole source file.
      if (node.type === 'VariableDeclarator') {
        const value = initializer(node);
        if (name === 'APPROVED_SIDE_CHAIR_MASKS') {
          for (const mask of value.elements) if (property(mask, 'roomDefinitionId')?.value?.value === 'room.phlebotomy') add(path, property(mask, 'id').value.value, tokens(mask));
        }
        if (name === 'ROOM_TOUCHUPS') {
          const room = property(value, 'room.phlebotomy')?.value;
          if (!room) throw Error('Missing phlebotomy touchup contract');
          add(path, 'ROOM_TOUCHUPS.room.phlebotomy', room.properties.filter(p => (p.key?.name ?? p.key?.value) !== 'notes').map(p => tokens(p)));
        }
        if (name === 'TOUCHUP_SPRITES') for (const key of ['sample-cart', 'biohazard-bin']) {
          const sprite = property(value, key); if (!sprite) throw Error('Missing phlebotomy decor: ' + key);
          add(path, 'TOUCHUP_SPRITES.' + key, tokens(sprite));
        }
      }
      if (node.type === 'IfStatement' && node.test?.operator === '&&' && node.test.left?.name === 'capture' &&
          node.test.right?.left?.name === 'definitionId' && node.test.right?.right?.value === 'room.phlebotomy') add(path, 'phlebotomy-support-branch', tokens(node));
      for (const value of Object.values(node)) {
        if (Array.isArray(value)) for (const child of value) { if (child?.type) visit(child); }
        else if (value?.type) visit(value);
      }
    }
    visit(source);
    for (const name of names) {
      if (!found.has(name)) throw Error(`Missing measured render function: ${path}:${name}`);
      add(path, name, tokens(found.get(name)));
    }
  }
  // Repeated seated factors appear in two measured facings; keep one record.
  const inputs = [...new Map(records.map(r => [r.path + '#' + r.selector, r])).values()].sort((a, b) => (a.path + '#' + a.selector).localeCompare(b.path + '#' + b.selector));
  if (!Number.isInteger(roomFootprint?.width) || !Number.isInteger(roomFootprint?.height)) throw Error('Missing phlebotomy room footprint');
  return { schemaVersion: 2, qaProtocolVersion: 3, roomFootprint, scope: 'eight measured frames, their scale/anchor/bounds/motion inputs, phlebotomy assets/data and render functions; other identities/rooms/preloads ignored', measuredFrames, inputs };
}

export function assertPhlebotomyInputsUnchanged(before, after) {
  if (before?.schemaVersion !== 2 || after?.schemaVersion !== 2) throw Error('Capture input format changed; rerun capture with the current script');
  const a = new Map(before.inputs.map(i => [i.path + '#' + i.selector, i.sha256]));
  const b = new Map(after.inputs.map(i => [i.path + '#' + i.selector, i.sha256]));
  const changed = [...new Set([...a.keys(), ...b.keys()])].filter(key => a.get(key) !== b.get(key));
  if (changed.length) throw Error('Measured capture inputs changed; rerun capture: ' + changed.join(', '));
}
