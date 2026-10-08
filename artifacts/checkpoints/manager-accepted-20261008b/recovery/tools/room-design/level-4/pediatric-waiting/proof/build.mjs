// Isolated adaptation of the approved MRI proof's shared-lab shell structure.
// Reads frozen reference art and lab files; writes only this proof directory.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import * as Geometry from './geometry.mjs';
import { decode } from '../assets/image-utils.mjs';
const here = path.dirname(fileURLToPath(import.meta.url)), repo = path.resolve(here, '../../../../..');
const lab = path.resolve(here, '../../../touchup-2026-10');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJSON = (file, value) => fs.writeFileSync(path.join(here, file), JSON.stringify(value, null, 2) + '\n');
const baseline = read(path.resolve(here, '../assets/reference-baseline.json'));
const sourceFiles = ['lab/design-rooms.js', 'lab/lab.js', 'build/lab-data.json', 'build/room-touchups.mjs'];
for (const file of sourceFiles) {
  const absolute = path.join(lab, file), relative = path.relative(repo, absolute).replaceAll('\\', '/');
  if (sha(absolute) !== baseline.files[relative]) throw new Error(`Shared lab changed since intake: ${relative}. Return concurrent changes to the manager.`);
}
const design = await import(`data:text/javascript;base64,${fs.readFileSync(path.join(lab, 'lab/design-rooms.js')).toString('base64')}`);
const room = structuredClone(design.DESIGN_ROOMS.find(x => x.proofId === 'pediatric-waiting'));
if (!room) throw new Error('Pediatric waiting stand-in layout missing');
const originalLayout = structuredClone(room);
const nav = structuredClone(design.DESIGN_NAVIGATION[room.definitionId]);
const originalNav = structuredClone(nav);
const contract = read(path.join(here, 'asset-contract.json'));
const revision = read(path.join(here, 'revision-contract.json'));
const registry = read(path.join(repo, revision.registry.path));
for(const selected of revision.registry.selectedCharacters)if(JSON.stringify(registry.characters.find(c=>c.id===selected.id))!==JSON.stringify(selected))throw Error('Selected pediatric registry entry changed: '+selected.id);
const metadata = read(path.resolve(here, '../assets/prepared/metadata.json'));
if (!metadata.complete || Object.keys(metadata.assets).length !== 7) throw new Error('Prepare all seven new sources first');
const assets = {};
for (const record of room.records) {
  const spec = design.DESIGN_ASSETS[record.assetId];
  const name = Object.entries(contract.assets).find(([, x]) => x.assetId === record.assetId)?.[0];
  if (name) {
    const prepared = metadata.assets[name];
    const file = path.resolve(here, '../assets/prepared', prepared.file);
    if (sha(file) !== prepared.outputSha256) throw new Error(`Prepared hash mismatch: ${name}`);
    record.sourceRect = [0, 0, ...prepared.canvas];
    assets[record.assetId] = { ...spec, src: `../assets/prepared/${prepared.file}`, size: prepared.canvas, prepared: true, preparedId: name };
  } else {
    const file = path.resolve(lab, 'lab', spec.src);
    assets[record.assetId] = { ...spec, src: path.relative(here, file).replaceAll('\\', '/'), prepared: false, reusedApproved: true, sha256: sha(file) };
  }
}
// Owner-authorized private furniture and support additions. Shared files stay read-only.
const place=(r,ground,size)=>Object.assign(r,{renderSizeTiles:[...size],worldLocalGround:[...ground],depthKey:ground[1],destinationTopLeftTiles:[ground[0]-size[0]/2,ground[1]-size[1]]});
assets['design:reuse:chair-east']={...assets['design:reuse:chair-west'],sourceRect:[8,372,315,368]};
for(const chair of revision.extraChairs){const record=structuredClone(room.records.find(x=>x.id==='armchair'));Object.assign(record,{id:chair.id,assetId:'design:reuse:chair-east',sourceRect:[8,372,315,368],footprint:chair.footprint,doorOwners:chair.doorOwners});place(record,chair.ground,chair.renderSizeTiles);room.records.push(record);room.supports.push({id:chair.supportId,role:'waiting-seat',pose:'sit',facing:chair.direction,seat:{x:chair.ground[0]-.12,y:chair.ground[1]-.37},ground:{x:chair.ground[0],y:chair.ground[1]},fixtureGround:{x:chair.ground[0],y:chair.ground[1]},recordId:chair.id,seatType:'ordinary-chair'});}
for(const extra of revision.extraStools){const record=structuredClone(room.records.find(x=>x.id==='kidStoolWest'));record.id=extra.id;place(record,extra.ground,revision.stool.renderSizeTiles);room.records.push(record);room.supports.push({id:extra.supportId,role:'waiting-seat',pose:'sit',facing:extra.direction,seat:{x:extra.ground[0],y:extra.ground[1]-revision.stool.seatRiseProofPixels/120},ground:{x:extra.ground[0],y:extra.ground[1]},fixtureGround:{x:extra.ground[0],y:extra.ground[1]},recordId:extra.id,seatType:'kid-stool'});}
for(const child of revision.children){const support=room.supports.find(x=>x.id===child.supportId);Object.assign(support,{character:child.characterId,seat:{x:child.seat[0],y:child.seat[1]},ground:{x:child.ground[0],y:child.ground[1]},fixtureGround:{x:child.ground[0],y:child.ground[1]},recordId:child.recordId,seatType:child.seatType,intendedVisualAge:child.intendedVisualAge});if(child.seatType==='kid-stool')place(room.records.find(x=>x.id===child.recordId),child.ground,revision.stool.renderSizeTiles);}
for(const parent of revision.parents){const support=room.supports.find(x=>x.id===parent.supportId);support.seat={x:parent.seat[0],y:parent.seat[1]};support.recordId='armchair';support.seatType='ordinary-chair';}
for(const [id,prop]of Object.entries(revision.props)){const record=room.records.find(x=>x.id===id);place(record,prop.ground,prop.renderSizeTiles);Object.assign(record,{footprint:prop.footprint,doorOwners:prop.doorOwners,direction:prop.direction});}
const occluders=read(path.resolve(here,'../assets/derived/occluder-manifest.json'));
for(const [recordId,direction]of [['armchair','west'],...revision.extraChairs.map(x=>[x.id,x.direction])]){const chair=room.records.find(x=>x.id===recordId),entry=occluders.entries[direction],assetId='design:derived:chair-'+direction+'-front';assets[assetId]={src:'../assets/derived/'+entry.file,size:entry.canvas,sourceRect:[0,0,...entry.canvas],derivedApproved:true,sha256:entry.sha256};room.records.push({...structuredClone(chair),id:recordId+':front',assetId,sourceRect:[0,0,...entry.canvas],footprint:undefined,overlayFor:recordId,depthPolicy:'authored-layer',depthKey:chair.worldLocalGround[1]+.0002});}
nav.waitingAnchors=room.supports.map(s=>({x:Math.floor(s.ground.x),y:Math.floor(s.ground.y)}));
nav.privateProofRouteModel=revision.routeModel;
const tableRecord = room.records.find(x => x.id === 'kidsTable');
tableRecord.renderSizeTiles = [...revision.table.renderSizeTiles];
tableRecord.worldLocalGround = [...revision.table.ground];
tableRecord.depthKey = revision.table.ground[1];
tableRecord.destinationTopLeftTiles = [revision.table.ground[0] - tableRecord.renderSizeTiles[0] / 2, revision.table.ground[1] - tableRecord.renderSizeTiles[1]];
const printsRecord = room.records.find(x => x.id === 'animalPrints');
printsRecord.destinationTopLeftTiles = [revision.wall.animalPrints.centerX - printsRecord.renderSizeTiles[0] / 2, revision.wall.animalPrints.topY];
printsRecord.doorOwners = [...revision.wall.animalPrints.doorOwners];
printsRecord.backedOwners = [...revision.wall.animalPrints.backedOwners];
room.notes = [...revision.notes, 'Original fixed bench/armchair retain the reviewed doorway pass-through exceptions; new chairs and their occupants/overlays hide on their own entry segments.'];
const data = read(path.join(lab, 'build/lab-data.json'));
data.characters = [...data.characters.filter(x => ['patient.adult.001', 'patient.adult.007'].includes(x.id)), ...revision.children.map(child => {
  const character = registry.characters.find(c => c.id === child.characterId);
  if (character?.category !== 'future-pediatric-presentation' || character.poses.stand.south.visibleBounds.height !== child.standingHeightSourcePixels) throw new Error(`Wrong pediatric identity or size: ${child.characterId}`);
  return character;
})];
data.pediatricPresentation = revision;
const actorHashes = {};
for (const character of data.characters) for (const [pose, directions] of Object.entries(character.poses)) for (const [direction, asset] of Object.entries(directions)) {
  const file = path.resolve(repo, 'apps/player/public', asset.url), hash = sha(file);
  if (asset.sha256.toUpperCase() !== hash) throw new Error(`Actor source differs from export: ${character.id}/${pose}/${direction}`);
  actorHashes[`${character.id}/${pose}/${direction}`] = { path: path.relative(repo, file).replaceAll('\\', '/'), sha256: hash };
}
const actorContract = { characterMetrics: data.characterMetrics, characters: data.characters, pediatricPresentation: revision, actorHashes };
const actorBaselineFile = path.join(here, 'actor-baseline.json');
if (fs.existsSync(actorBaselineFile)) {
  if (JSON.stringify(read(actorBaselineFile)) !== JSON.stringify(actorContract)) {
    const existing = read(actorBaselineFile);
    const sameSources = JSON.stringify(existing.characters) === JSON.stringify(actorContract.characters) && JSON.stringify(existing.characterMetrics) === JSON.stringify(actorContract.characterMetrics) && JSON.stringify(existing.actorHashes) === JSON.stringify(actorContract.actorHashes);
    if (sha(actorBaselineFile) !== revision.previousActorBaselineSha256 && !sameSources) throw new Error('Concurrent actor source-baseline change outside the authorized revision');
    writeJSON('actor-baseline.json', actorContract);
  }
} else writeJSON('actor-baseline.json', actorContract);
data.rooms = data.rooms.filter(x => x.proofId === 'hallway');
data.navigation = { [room.definitionId]: nav }; data.atlases = {};
// Measured feet only constrain the private fallback route. They do not replace
// any shared footprint, navigation record, seat or placement.
data.previewBaseClearances = [];
for (const record of room.records) {
  const id = assets[record.assetId].preparedId, entry = metadata.assets[id];
  if (!entry || entry.anchorKind !== 'floor') continue;
  const image = await decode(path.resolve(here, '../assets/prepared', entry.file));
  const [width,height] = entry.canvas, pixels = image.pixels.data, d = Geometry.fixturePlacement(record, entry);
  const sx = d.w / width / 120, sy = d.h / height / 120, bottom = entry.outputOpaqueBounds.bottom;
  for (let y = Math.max(0,bottom-7); y <= bottom; y++) {
    let first = -1;
    for (let x=0;x<=width;x++) {
      const opaque=x<width && pixels[(y*width+x)*4+3]>=contract.opaqueThreshold;
      if(opaque && first<0)first=x;
      if(!opaque && first>=0) {
        data.previewBaseClearances.push({ id: `${record.id}:measured-base:${y}:${first}`, recordId: record.id, footprint: {left:d.x/120+first*sx,top:d.y/120+y*sy,width:(x-first)*sx,height:sy}, basis:'Actual prepared alpha >=160, last 8 native rows; proof-only projected clearance' });
        first=-1;
      }
    }
  }
}
writeJSON('data.json', data);
writeJSON('layout-baseline.json', { sourceSha256: sha(path.join(lab, 'lab/design-rooms.js')), room: originalLayout, navigation: originalNav });
fs.writeFileSync(path.join(here, 'design-rooms.js'), `// Private painted snapshot. Explicit presentation overrides in revision-contract.json; shared geometry/nav unchanged.\nexport const DESIGN_ASSETS = ${JSON.stringify(assets)};\nexport const DESIGN_ROOMS = ${JSON.stringify([room])};\nexport const DESIGN_NAVIGATION = ${JSON.stringify(data.navigation)};\nexport const PREPARED_METADATA = ${JSON.stringify(metadata)};\nexport const ASSET_CONTRACT = ${JSON.stringify(contract)};\n`);
fs.copyFileSync(path.join(lab, 'build/room-touchups.mjs'), path.join(here, 'room-touchups.mjs'));
let renderer = fs.readFileSync(path.join(lab, 'lab/lab.js'), 'utf8');
function replace(from, to) { if (!renderer.includes(from)) throw new Error(`Shared renderer marker absent: ${from}`); renderer = renderer.replace(from, to); }
function block(start, next, body) {
  const begin = renderer.indexOf(start), end = renderer.indexOf(next, begin + start.length);
  if (begin < 0 || end < 0) throw new Error(`Shared renderer function markers absent: ${start}`);
  renderer = renderer.slice(0, begin) + body + '\n\n' + renderer.slice(end);
}
replace('"../build/room-touchups.mjs"', '"./room-touchups.mjs"');
replace('import { DESIGN_ASSETS, DESIGN_NAVIGATION, DESIGN_ROOMS }', 'import * as Geometry from "./geometry.mjs";\nimport { DESIGN_ASSETS, DESIGN_NAVIGATION, DESIGN_ROOMS, PREPARED_METADATA, ASSET_CONTRACT }');
replace('const ART_ROOT = "../../../../apps/player/public/";', 'const ART_ROOT = "../../../../../apps/player/public/";');
replace('scene: "room", view: "split", roomId: "laboratory",', 'scene: "room", view: "proposed", roomId: "pediatric-waiting",\n  parents: true, children: true, contacts: false, bases: false,');
replace('fetch("../build/lab-data.json")', 'fetch("./data.json")');
replace('function recordVisible(rec, P) { return TU.isTouchupRecordVisible(rec, P.doors, P.backed); }', 'function recordVisible(rec, P) { return Geometry.visible(rec, P.doors, P.backed); }');
replace('const d = { kind: "fixture", id: rec.id, img, src: rec.sourceRect, x: P.ox + lx * T, y: P.oy + ly * T, w: w * T, h: h * T, py: painterY(rec), rec };', 'const prepared = PREPARED_METADATA.assets[DESIGN_ASSETS[rec.assetId].preparedId];\n    const d = { kind: "fixture", id: rec.id, img, src: rec.sourceRect, ...Geometry.fixturePlacement(rec, prepared, T, P.ox, P.oy), py: painterY(rec), rec, prepared };');
block('function actorPlacements(P) {', 'async function drawImageRec(g, d)', 'function actorPlacements(P) { return Geometry.actorPlacements(P, data, state).map(a => ({ ...a, url: ART_ROOT + a.url })); }');
block('function computeRoutes(P) {', 'function designBlockers(P) {', 'function computeRoutes(P) { return Geometry.computeRoutes(P, navFor(P.room), data.previewBaseClearances); }');
block('function decorConflicts(P, routes) {', '// Every wall segment', 'function decorConflicts(P, routes) { return Geometry.decorConflicts(P, navFor(P.room), routes); }\n');
block('function doorZoneViolations(P) {', '// Owner revision: items never overlap a wall.', 'function doorZoneViolations(P) { return Geometry.doorZoneViolations(P); }\n');
replace('if (params.get("scene") === "building") state.scene = "building";', '// Single-room review only.');
replace('if (params.get("view")) state.view = params.get("view");', '// This proof always shows the painted candidate.');
replace('async function draw() {\n  const token = ++drawToken;', 'async function draw() {\n  document.body.dataset.ready = "0";\n  const token = ++drawToken;');
replace('return { statusLines, bad };', 'if (state.contacts || state.bases || state.routes) for (const P of placements) paintCandidateDiagnostics(g, P, collected.get(P));\n  return { statusLines, bad };');
replace('if (p.alreadyAllowed) statusLines.push(`Door ${p.door} opens onto the ${p.fixture}; the game already allows it.`);', 'if (p.alreadyAllowed) statusLines.push(`Door ${p.door} uses the preserved pass-through rule for the ${p.fixture}.`);');
const checkStart = renderer.indexOf('function check(roomId, doors, backed) {');
if (checkStart < 0) throw new Error('Shared check export missing');
renderer = renderer.slice(0, checkStart) + 'function check(roomId, doors, backed) { const room = rooms.get(roomId); return Geometry.check(room, navFor(room), doors, backed, data.previewBaseClearances); }\nwindow.__lab = { check, state, draw, rooms, data, assets: DESIGN_ASSETS, metadata: PREPARED_METADATA, contract: ASSET_CONTRACT, computeRoutes, actorPlacements, collectDrawables, recordVisible, painterY, buildScene, roomSegments, buildRoomControls, paintCaps, paintFloor, render };\n';
renderer += '\n' + fs.readFileSync(path.join(here, 'extension.js'), 'utf8');
fs.writeFileSync(path.join(here, 'lab.js'), renderer);
const manifest = {
  schemaVersion: 1, status: 'candidate_needs_owner_review', designApproval: false, runtimeIntegration: false, completeArtwork: true,
  sourceSnapshots: Object.fromEntries(sourceFiles.map(file => [path.relative(repo, path.join(lab, file)).replaceAll('\\', '/'), sha(path.join(lab, file))])),
  layoutBaselineSha256: sha(path.join(here, 'layout-baseline.json')), actorBaselineSha256: sha(actorBaselineFile), actorHashes,
  dataSha256: sha(path.join(here, 'data.json')), preparedMetadataSha256: sha(path.resolve(here, '../assets/prepared/metadata.json')),
  artworkSources: Object.fromEntries(Object.entries(metadata.assets).map(([id, x]) => [id, x.sourceSha256])),
  preparedHashes: Object.fromEntries(Object.entries(metadata.assets).map(([id, x]) => [id, x.outputSha256])),
  reusedApproved: Object.fromEntries(Object.entries(assets).filter(([, x]) => x.reusedApproved).map(([id, x]) => [id, { src: x.src, sourceRect: x.sourceRect, sha256: x.sha256 }])),
  rendererSha256: sha(path.join(here, 'lab.js')), geometrySha256: sha(path.join(here, 'geometry.mjs')),
  presentationRevision: { revision: revision.revision, contract: 'revision-contract.json', sha256: sha(path.join(here, 'revision-contract.json')), authorizedBy: revision.authorizedBy, sharedFilesChanged: false, children: revision.children, sourceScale: revision.sourceScale, stool: revision.stool, table: revision.table, wall: revision.wall,props:revision.props,seatingRule:revision.seatingRule },
  occluders,
  registryObservedSha256:sha(path.join(repo,revision.registry.path)),
  routingException: {privateProofOnly:true,sharedGeometryChanged:false,baselineFailureEvidence:'evidence/original-grid-failure.json',method:revision.routeModel.basis,actorRadius:.18,step:.05},
  reviewURL: 'http://127.0.0.1:4191/tools/room-design/level-4/pediatric-waiting/proof/index.html', reviewOrigin: 'http://127.0.0.1:4191', ownerPlaytestOrigin: 'http://127.0.0.1:4173',
  notes: ['Owner revision2: four stools, five ordinary seats, ages5/9/14. West parent uses a measured cushion contact and approved front wood overlay.', 'Chest east and bin west use new builtin outputs and larger native frames; other selected sources and table footprint are unchanged.', 'All expanded-layout walking routes use private real footprint clearances, measured prepared bases and distinct static seated contacts. Shared navigation is unmodified. Original fixed bench/armchair doorway pass-through exceptions remain explicit.', 'Full generated registry changed concurrently in unrelated entries. Selected pediatric metadata and all40 actor pose hashes remain guarded.', 'No campaign storage, network content, runtime integration or source-art edits. Browser validation/captures require manager rerun.']
};
writeJSON('proof-manifest.json', manifest);
console.log('BUILD PASS pediatric-only proof revision 2; 7 sprites, 3 approved seating facings, front wood overlays, 2 parents, 3 pediatric stills, 9 seats');
