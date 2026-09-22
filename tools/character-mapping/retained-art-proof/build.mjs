import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { compileLateral, distance2 } from '../math.mjs';

const repo = resolve(import.meta.dirname, '../../..');
const configPath = resolve(import.meta.dirname, 'mapping.json');
const outputRoot = resolve(repo, 'artifacts/character-movement/retained-art-proof');
const htmlPath = resolve(outputRoot, 'retained-art-proof.html');
const proofPath = resolve(outputRoot, 'mapping-proof.json');
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const configBytes = readFileSync(configPath);
const config = JSON.parse(configBytes);

function fail(message) { throw new Error(message); }
function inBounds(point, width, height) { return Array.isArray(point) && point.length === 2 && point.every(Number.isFinite) && point[0] >= 0 && point[0] <= width && point[1] >= 0 && point[1] <= height; }
function cropCanvas(image, crop) {
  const canvas = createCanvas(crop.width, crop.height), context = canvas.getContext('2d');
  context.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
  return canvas;
}
function clearExteriorBackground(canvas) {
  const context = canvas.getContext('2d'), width = canvas.width, height = canvas.height;
  const image = context.getImageData(0, 0, width, height), data = image.data;
  const visited = new Uint8Array(width * height), queue = new Uint32Array(width * height);
  let head = 0, tail = 0;
  const neutral = (index, minimum, spread) => { const offset = index * 4, r = data[offset], g = data[offset + 1], b = data[offset + 2]; return Math.min(r, g, b) >= minimum && Math.max(r, g, b) - Math.min(r, g, b) <= spread; };
  const add = index => { if (!visited[index] && neutral(index, 232, 18)) { visited[index] = 1; queue[tail++] = index; } };
  for (let x = 0; x < width; x += 1) { add(x); add((height - 1) * width + x); }
  for (let y = 0; y < height; y += 1) { add(y * width); add(y * width + width - 1); }
  while (head < tail) { const index = queue[head++], x = index % width, y = Math.floor(index / width); if (x) add(index - 1); if (x + 1 < width) add(index + 1); if (y) add(index - width); if (y + 1 < height) add(index + width); }
  for (let index = 0; index < visited.length; index += 1) if (visited[index]) data[index * 4 + 3] = 0;
  for (let pass = 0; pass < 2; pass += 1) {
    const clear = [];
    for (let y = 1; y + 1 < height; y += 1) for (let x = 1; x + 1 < width; x += 1) {
      const index = y * width + x;
      if (!data[index * 4 + 3] || !neutral(index, 205, 25)) continue;
      if (![index - 1, index + 1, index - width, index + width].some(neighbor => data[neighbor * 4 + 3] === 0)) continue;
      clear.push(index);
    }
    for (const index of clear) data[index * 4 + 3] = 0;
  }
  context.putImageData(image, 0, 0);
  return { method: 'edge-connected-bright-neutral-flood-plus-two-adjacent-neutral-fringe-passes', initialMinimumChannel: 232, initialMaximumChannelSpread: 18, fringeMinimumChannel: 205, fringeMaximumChannelSpread: 25, fringePasses: 2 };
}
function pieceReconstruction(keyed, pieces) {
  const canvas = createCanvas(keyed.width, keyed.height), context = canvas.getContext('2d');
  for (const piece of pieces) {
    context.save(); context.beginPath();
    piece.polygon.forEach((point, index) => index ? context.lineTo(point[0], point[1]) : context.moveTo(point[0], point[1]));
    context.closePath(); context.clip(); context.drawImage(keyed, 0, 0); context.restore();
  }
  const source = keyed.getContext('2d').getImageData(0, 0, keyed.width, keyed.height).data;
  const rebuilt = context.getImageData(0, 0, keyed.width, keyed.height).data;
  let sourcePixels = 0, coveredPixels = 0;
  const diagnostic = createCanvas(keyed.width, keyed.height), diagnosticContext = diagnostic.getContext('2d');
  diagnosticContext.globalAlpha = .28; diagnosticContext.drawImage(keyed, 0, 0); diagnosticContext.globalAlpha = 1;
  const diagnosticImage = diagnosticContext.getImageData(0, 0, keyed.width, keyed.height), diagnosticPixels = diagnosticImage.data;
  for (let offset = 3; offset < source.length; offset += 4) if (source[offset]) {
    sourcePixels += 1;
    if (rebuilt[offset]) coveredPixels += 1;
    else { diagnosticPixels[offset - 3] = 255; diagnosticPixels[offset - 2] = 0; diagnosticPixels[offset - 1] = 180; diagnosticPixels[offset] = 255; }
  }
  diagnosticContext.putImageData(diagnosticImage, 0, 0);
  return { canvas, diagnostic, sourcePixels, coveredPixels, coverage: coveredPixels / sourcePixels };
}
function lateralRecipe(character) {
  const frame = character.recipe.frame;
  return {
    identity: { templateId: character.id },
    lineage: { east: { kind: 'independent' }, west: { kind: 'reflected', fromView: 'east', phasePermutation: { '01':'05','02':'06','03':'07','04':'08','05':'01','06':'02','07':'03','08':'04' } } },
    lateral: { ...character.recipe, registration: { east: { scale: 1, sourceAxisX: frame.axisX, sourceFloorY: frame.floorY, sourceWidth: frame.width, sourceHeight: frame.height }, west: { scale: 1, sourceAxisX: frame.axisX, sourceFloorY: frame.floorY, sourceWidth: frame.width, sourceHeight: frame.height } } },
  };
}

const clientCharacters = [];
const proofCharacters = [];
for (const character of config.characters) {
  const sourceBytes = readFileSync(resolve(repo, character.sourcePath));
  if (sha256(sourceBytes) !== character.sourceSha256) fail(`source hash mismatch for ${character.id}`);
  const image = await loadImage(resolve(repo, character.sourcePath));
  if (image.width !== character.sourceDimensions.width || image.height !== character.sourceDimensions.height) fail(`source dimensions mismatch for ${character.id}`);
  const raw = cropCanvas(image, config.sourceCrop), keyed = cropCanvas(image, config.sourceCrop), extraction = clearExteriorBackground(keyed);
  const rawBytes = raw.toBuffer('image/png'), keyedBytes = keyed.toBuffer('image/png');
  const cropWidth = config.sourceCrop.width, cropHeight = config.sourceCrop.height;
  for (const piece of character.pieces) {
    if (!Array.isArray(piece.polygon) || piece.polygon.length < 3 || !piece.polygon.every(point => inBounds(point, cropWidth, cropHeight))) fail(`${character.id}/${piece.id} polygon outside donor crop`);
    if (piece.segment === 'shoe') {
      if (!inBounds(piece.sourceSoleHeel, cropWidth, cropHeight) || !inBounds(piece.sourceSoleToe, cropWidth, cropHeight)) fail(`${character.id}/${piece.id} sole anchors outside donor crop`);
    } else if (piece.segment !== 'body' && (!inBounds(piece.pivot, cropWidth, cropHeight) || !inBounds(piece.distal, cropWidth, cropHeight))) fail(`${character.id}/${piece.id} anchors outside donor crop`);
  }
  const reconstruction = pieceReconstruction(keyed, character.pieces);
  writeFileSync(resolve(outputRoot, 'measurement', `${character.id}-missing-piece-pixels.png`), reconstruction.diagnostic.toBuffer('image/png'));
  if (reconstruction.coverage < 0.999) fail(`${character.id} source reconstruction coverage ${(reconstruction.coverage * 100).toFixed(2)}% below 99.9%`);
  const compiled = compileLateral(lateralRecipe(character)).filter(target => target.view === 'east' && (target.phaseId === '01' || target.phaseId === '03'));
  if (compiled.length !== 2) fail(`expected two east proof targets for ${character.id}`);
  for (const target of compiled) {
    if (target.phaseId === '03') {
      const support = target.geometry.joints.right;
      if (!support.support || Math.abs(distance2(support.hip, support.ankle) - character.recipe.segmentLengths.thigh - character.recipe.segmentLengths.shin) > 0.002 || support.shoeContact.y !== character.recipe.frame.floorY) fail(`${character.id} phase03 support fit failed`);
    }
  }
  const pieceEvidence = character.pieces.filter(piece => piece.segment !== 'body').map(piece => {
    const start = piece.segment === 'shoe' ? piece.sourceSoleHeel : piece.pivot, end = piece.segment === 'shoe' ? piece.sourceSoleToe : piece.distal;
    const measured = Math.hypot(end[0] - start[0], end[1] - start[1]);
    const targetLength = piece.segment === 'shoe' ? character.recipe.foot.heelBack + character.recipe.foot.toeForward : character.recipe.segmentLengths[piece.segment];
    return { id: piece.id, measuredRestLength: Number(measured.toFixed(4)), normalizedTargetLength: targetLength, fixedNormalizationScale: Number((targetLength / measured).toFixed(6)), reusedAcrossProofPhases: ['01','03'] };
  });
  const reconstructionBytes = reconstruction.canvas.toBuffer('image/png');
  const client = { ...character, rawDataUrl: `data:image/png;base64,${rawBytes.toString('base64')}`, keyedDataUrl: `data:image/png;base64,${keyedBytes.toString('base64')}`, reconstructionDataUrl: `data:image/png;base64,${reconstructionBytes.toString('base64')}`, targets: Object.fromEntries(compiled.map(target => [target.phaseId, target.geometry])), pieceEvidence };
  clientCharacters.push(client);
  proofCharacters.push({ id: character.id, label: character.label, runtimeIdentity: null, runtimeIdentityStatus: 'unresolved-no-crosswalk', sourcePath: character.sourcePath, sourceSha256: character.sourceSha256, sourceDimensions: character.sourceDimensions, donorCrop: config.sourceCrop, rawCropSha256: sha256(rawBytes), keyedCropSha256: sha256(keyedBytes), reconstructionSha256: sha256(reconstructionBytes), sourceReconstruction: { sourceOpaquePixels: reconstruction.sourcePixels, coveredOpaquePixels: reconstruction.coveredPixels, coveragePercent: Number((reconstruction.coverage * 100).toFixed(4)) }, backgroundExtraction: extraction, recipe: character.recipe, pieceEvidence, targetSummaries: compiled.map(target => ({ phaseId: target.phaseId, motionId: target.motionId, support: target.phaseId === '03' ? 'right' : null, geometry: target.geometry })) });
}

const clientData = { schemaVersion: 1, characters: clientCharacters };
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Retained artwork east mapping proof</title>
<style>body{margin:0;padding:24px;font-family:system-ui,sans-serif;background:#17191d;color:#f4f4f1}main{max-width:1420px;margin:auto}h1{font-size:24px;margin:0 0 6px}p{margin:4px 0 18px;color:#c9ccd2}.toolbar{margin:14px 0 18px}.character{margin:0 0 26px;padding:18px;background:#24272d;border:1px solid #454a54;border-radius:12px}.character h2{font-size:18px;margin:0 0 4px}.source-id{font-family:ui-monospace,monospace;font-size:12px;color:#aeb5c2;overflow-wrap:anywhere}.row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-top:14px}.cell{background:#eeece6;color:#25282d;border-radius:8px;padding:10px;text-align:center}.cell h3{font-size:14px;margin:0 0 8px}.cell img,.cell canvas{display:block;width:100%;height:auto;aspect-ratio:240/310;object-fit:contain;image-rendering:auto}.label{font-size:12px;margin-top:7px;color:#555b65}.limitations{font-size:13px;color:#d5b98b;margin:14px 0 0}@media(max-width:900px){.row{grid-template-columns:repeat(2,1fr)}}@media(max-width:520px){.row{grid-template-columns:1fr}.character{padding:12px}body{padding:12px}}</style></head>
<body><main><h1>Retained artwork · east stride/passing mapping review</h1><p>Actual retained source pixels fitted through measured, per-character lateral recipes. Bounded review output; runtime identity and production seam acceptance remain unresolved.</p><label class="toolbar"><input id="seams" type="checkbox"> Reveal piece boundaries and target joints</label><div id="proof"></div></main>
<script>const DATA=${JSON.stringify(clientData)};const root=document.getElementById('proof');const seamToggle=document.getElementById('seams');
function pointPath(context,polygon){context.beginPath();polygon.forEach((point,index)=>index?context.lineTo(point[0],point[1]):context.moveTo(point[0],point[1]));context.closePath()}
function endpoints(geometry,piece){const joints=geometry.joints[piece.side];if(piece.segment==='upperArm')return[joints.shoulder,joints.elbow];if(piece.segment==='forearm')return[joints.elbow,joints.wrist];if(piece.segment==='thigh')return[joints.hip,joints.knee];if(piece.segment==='shin')return[joints.knee,joints.ankle];if(piece.segment==='shoe')return[joints.ankle,joints.shoeToe];return null}
function transformFor(character,piece,geometry){if(piece.segment==='body'){const dy=geometry.joints.right.hip.y-character.sourceHip.y;return{x:geometry.joints.right.hip.x-character.sourceHip.x,y:dy,angle:0,scale:1,pivot:[0,0]}}const joints=geometry.joints[piece.side],target=piece.segment==='shoe'?[joints.shoeHeel,joints.shoeToe]:endpoints(geometry,piece),sourceStart=piece.segment==='shoe'?piece.sourceSoleHeel:piece.pivot,sourceEnd=piece.segment==='shoe'?piece.sourceSoleToe:piece.distal,sourceAngle=Math.atan2(sourceEnd[1]-sourceStart[1],sourceEnd[0]-sourceStart[0]),targetAngle=Math.atan2(target[1].y-target[0].y,target[1].x-target[0].x),evidence=character.pieceEvidence.find(item=>item.id===piece.id);return{x:target[0].x,y:target[0].y,angle:targetAngle-sourceAngle,scale:evidence.fixedNormalizationScale,pivot:sourceStart}}
function applyTransform(context,transform){context.translate(transform.x,transform.y);context.rotate(transform.angle);context.scale(transform.scale,transform.scale);context.translate(-transform.pivot[0],-transform.pivot[1])}
function makePiece(image,piece){const canvas=document.createElement('canvas');canvas.width=240;canvas.height=310;const context=canvas.getContext('2d');pointPath(context,piece.polygon);context.clip();context.drawImage(image,0,0);return canvas}
function drawSkeleton(context,geometry){context.save();context.strokeStyle='#d23d77';context.fillStyle='#fff';context.lineWidth=1.2;['left','right'].forEach(side=>{const j=geometry.joints[side];[['shoulder','elbow'],['elbow','wrist'],['hip','knee'],['knee','ankle'],['ankle','shoeToe']].forEach(pair=>{context.beginPath();context.moveTo(j[pair[0]].x,j[pair[0]].y);context.lineTo(j[pair[1]].x,j[pair[1]].y);context.stroke()});['shoulder','elbow','wrist','hip','knee','ankle'].forEach(key=>{context.beginPath();context.arc(j[key].x,j[key].y,2.5,0,Math.PI*2);context.fill();context.stroke()})});context.restore()}
function layerRank(piece){const leg=['thigh','shin','shoe'].includes(piece.segment);if(piece.side==='left')return leg?0:1;if(piece.side==='none')return 2;return leg?3:4}
function renderMapped(canvas,character,image,phase){const context=canvas.getContext('2d');context.clearRect(0,0,240,310);context.fillStyle='#eeece6';context.fillRect(0,0,240,310);context.strokeStyle='#777b82';context.beginPath();context.moveTo(18,character.recipe.frame.floorY);context.lineTo(222,character.recipe.frame.floorY);context.stroke();const geometry=character.targets[phase],pieces=[...character.pieces].sort((a,b)=>layerRank(a)-layerRank(b));for(const piece of pieces){const transform=transformFor(character,piece,geometry),bitmap=makePiece(image,piece);context.save();applyTransform(context,transform);context.drawImage(bitmap,0,0);if(seamToggle.checked){pointPath(context,piece.polygon);context.strokeStyle=piece.side==='left'?'#4169e1':piece.side==='right'?'#d23d77':'#ec9b31';context.lineWidth=1/transform.scale;context.stroke()}context.restore()}if(seamToggle.checked)drawSkeleton(context,geometry)}
async function build(){for(const character of DATA.characters){const image=new Image();image.src=character.keyedDataUrl;await image.decode();const section=document.createElement('section');section.className='character';section.innerHTML='<h2>'+character.label+'</h2><div class="source-id">'+character.sourcePath+' · '+character.sourceSha256+'</div><div class="row"><div class="cell"><h3>Unaltered source cell</h3><img alt="Unaltered retained east stride source crop" src="'+character.rawDataUrl+'"><div class="label">Spatial crop only; baked checkerboard retained</div></div><div class="cell"><h3>Piece-union reconstruction</h3><img alt="Reconstruction of all retained source piece masks" src="'+character.reconstructionDataUrl+'"><div class="label">Required source-pixel coverage check</div></div><div class="cell"><h3>01 · right stride</h3><canvas width="240" height="310"></canvas><div class="label">Shared phase geometry · measured character recipe</div></div><div class="cell"><h3>03 · right support passing</h3><canvas width="240" height="310"></canvas><div class="label">Support geometry; raster soles registered heel-to-toe</div></div></div><div class="limitations">Visible-source review: exterior checkerboard removal leaves a pale fringe. The near trailing arm remains joined to the torso because no hidden torso surface exists under it; this output does not claim complete opposing-arm articulation.</div>';root.append(section);const canvases=section.querySelectorAll('canvas');renderMapped(canvases[0],character,image,'01');renderMapped(canvases[1],character,image,'03');section._render=()=>{renderMapped(canvases[0],character,image,'01');renderMapped(canvases[1],character,image,'03')}}document.body.dataset.ready='true'}
seamToggle.addEventListener('change',()=>document.querySelectorAll('.character').forEach(section=>section._render()));build();</script></body></html>`;
writeFileSync(htmlPath, html);
const proof = { schemaVersion: 1, status: 'review_required_not_production_accepted', mappingConfigPath: 'tools/character-mapping/retained-art-proof/mapping.json', mappingConfigSha256: sha256(configBytes), acceptedSolverPath: 'tools/character-mapping/math.mjs#compileLateral', selectedPhases: ['01','03'], outputHtml: 'artifacts/character-movement/retained-art-proof/retained-art-proof.html', characters: proofCharacters, checks: { sourceHashCount: proofCharacters.length, fittedCharacterCount: proofCharacters.length, phaseCountPerCharacter: 2, phase03SupportFit: 'passed-for-both', sourcePieceReuseAcrossPhases: 'passed-for-all-declared-pieces' }, limitations: ['The retained sheets contain an opaque baked checkerboard; the keyed donor crop uses documented conservative exterior cleanup and retains a pale review fringe.', 'Runtime identity linkage is unresolved; filenames and byte hashes are the source identities in this proof.', 'Hidden rear surfaces are unavailable. Distinct visible far/near regions are reused without invented texture fill; occluded areas can reveal seams under rotation.', 'This is an east phase01/phase03 mapping proof, not an eight-phase cycle, other directions, runtime integration or production art acceptance.'] };
writeFileSync(proofPath, JSON.stringify(proof, null, 2) + '\n');
console.log(JSON.stringify({ htmlPath, proofPath, characters: proofCharacters.length, targets: proofCharacters.length * 2 }));
