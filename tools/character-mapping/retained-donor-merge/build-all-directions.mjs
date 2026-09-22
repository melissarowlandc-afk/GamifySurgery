import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { compileLateral, compileNorthSouth } from '../math.mjs';

const repo = resolve(import.meta.dirname, '../../..');
const out = resolve(repo, 'artifacts/character-movement/retained-donor-merge/all-directions-v1');
const frameOut = resolve(out, 'frames');
mkdirSync(frameOut, { recursive: true });
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const mapping = JSON.parse(readFileSync(resolve(import.meta.dirname, 'mapping.json')));
const kits = JSON.parse(readFileSync(resolve(import.meta.dirname, 'all-directions-kits.json')));
const eastProofPath = resolve(repo, 'artifacts/character-movement/retained-donor-merge/two-character-eight-east-v2/two-character-eight-east.json');
const eastProof = JSON.parse(readFileSync(eastProofPath));

function crop(image, box) {
  const canvas = createCanvas(box.width, box.height);
  canvas.getContext('2d').drawImage(image, box.x, box.y, box.width, box.height, 0, 0, box.width, box.height);
  return canvas;
}

function removeCheckerboard(canvas) {
  const context = canvas.getContext('2d');
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = image.data;
  const seen = new Uint8Array(canvas.width * canvas.height);
  const queue = new Uint32Array(seen.length);
  let head = 0, tail = 0;
  const isBackground = index => {
    const offset = index * 4;
    const values = [data[offset], data[offset + 1], data[offset + 2]];
    return Math.min(...values) >= 224 && Math.max(...values) - Math.min(...values) <= 24;
  };
  const add = index => { if (!seen[index] && isBackground(index)) { seen[index] = 1; queue[tail++] = index; } };
  for (let x = 0; x < canvas.width; x += 1) { add(x); add((canvas.height - 1) * canvas.width + x); }
  for (let y = 0; y < canvas.height; y += 1) { add(y * canvas.width); add(y * canvas.width + canvas.width - 1); }
  while (head < tail) {
    const index = queue[head++], x = index % canvas.width, y = Math.floor(index / canvas.width);
    if (x) add(index - 1); if (x < canvas.width - 1) add(index + 1);
    if (y) add(index - canvas.width); if (y < canvas.height - 1) add(index + canvas.width);
  }
  for (let index = 0; index < seen.length; index += 1) if (seen[index]) data[index * 4 + 3] = 0;
  context.putImageData(image, 0, 0);
  return canvas;
}

function polygonPath(context, polygon) {
  context.beginPath();
  polygon.forEach(([x, y], index) => index ? context.lineTo(x, y) : context.moveTo(x, y));
  context.closePath();
}

function donor(source, definition, addCaps = true, id = '') {
  const canvas = createCanvas(240, source.height);
  const context = canvas.getContext('2d');
  const polygon = Array.isArray(definition) ? definition : definition.polygon;
  context.save(); polygonPath(context, polygon); context.clip(); context.drawImage(source, 0, 0); context.restore();
  if (addCaps && definition.anchors && !id.endsWith('shoe')) {
    const [[sx, sy], [ex, ey]] = definition.anchors;
    const forearm = id.endsWith('forearm-hand');
    const sampleT = forearm ? 0.15 : 0.5;
    const mx = sx + (ex-sx)*sampleT, my = sy + (ey-sy)*sampleT;
    context.save(); context.globalCompositeOperation = 'destination-over';
    const capAnchors = forearm ? [definition.anchors[0]] : definition.anchors;
    for (const [cx, cy] of capAnchors) {
      context.save(); context.beginPath(); context.arc(cx, cy, 9, 0, Math.PI * 2); context.clip();
      context.drawImage(source, mx - 4, my - 4, 8, 8, cx - 9, cy - 9, 18, 18); context.restore();
    }
    context.restore();
  }
  return canvas;
}

const shiftPolygon = (polygon, dx, dy = 0) => polygon.map(([x,y]) => [x+dx,y+dy]);

function restDefinitions(view, kit) {
  const bodyDx = kits.views[view].sourceAxisX - 105;
  const definitions = { head: shiftPolygon(kits.views[view].head, bodyDx) };
  const rest = kit.rest[view];
  for (const screenSide of ['left', 'right']) {
    const anatomy = kits.views[view].screenSideToAnatomy[screenSide];
    const sourceShoulderX = screenSide === 'left' ? rest.shoulderRightX : rest.shoulderLeftX;
    const sourceElbowX = screenSide === 'left' ? rest.elbowRightX : rest.elbowLeftX;
    const sourceWristX = screenSide === 'left' ? rest.wristRightX : rest.wristLeftX;
    const sourceHipX = screenSide === 'left' ? rest.hipRightX : rest.hipLeftX;
    const segmentBox=(x1,y1,x2,y2,padX,topPad,bottomPad)=>[[Math.min(x1,x2)-padX,y1-topPad],[Math.max(x1,x2)+padX,y1-topPad],[Math.max(x1,x2)+padX,y2+bottomPad],[Math.min(x1,x2)-padX,y2+bottomPad]];
    definitions[`${anatomy}-upper-arm`] = { anchors: [[sourceShoulderX,rest.shoulderY],[sourceElbowX,rest.elbowY]], polygon: segmentBox(sourceShoulderX,rest.shoulderY,sourceElbowX,rest.elbowY,9,4,5),maskBasis:'measured standing shoulder/elbow corridor; distal hand excluded' };
    definitions[`${anatomy}-forearm-hand`] = { anchors: [[sourceElbowX,rest.elbowY],[sourceWristX,rest.wristY]], polygon: segmentBox(sourceElbowX,rest.elbowY,sourceWristX,rest.wristY,9,5,10),maskBasis:'measured standing elbow/wrist corridor including exactly one distal hand' };
    definitions[`${anatomy}-thigh`] = { anchors: [[sourceHipX,rest.hipY],[sourceHipX,rest.kneeY]], polygon: segmentBox(sourceHipX,rest.hipY+4,sourceHipX,rest.kneeY,14,0,4),maskBasis:'measured standing hip/knee corridor starting below garment hem' };
    definitions[`${anatomy}-shin`] = { anchors: [[sourceHipX,rest.kneeY],[sourceHipX,rest.ankleY]], polygon: segmentBox(sourceHipX,rest.kneeY,sourceHipX,rest.ankleY-3,13,4,0),maskBasis:'measured standing knee/ankle corridor excluding shoe pixels' };
    definitions[`${anatomy}-shoe`] = { anchors: [[sourceHipX,rest.ankleY],[sourceHipX,rest.soleY]], polygon: segmentBox(sourceHipX,rest.ankleY,sourceHipX,rest.soleY,23,7,8),maskBasis:'independent complete standing shoe through measured sole' };
  }
  return definitions;
}

function drawAxial(context, image, definition, targetStart, targetEnd) {
  const [sourceStart, sourceEnd] = definition.anchors;
  const sourceAngle = Math.atan2(sourceEnd[1] - sourceStart[1], sourceEnd[0] - sourceStart[0]);
  const targetAngle = Math.atan2(targetEnd.y - targetStart.y, targetEnd.x - targetStart.x);
  const sourceLength = Math.hypot(sourceEnd[0] - sourceStart[0], sourceEnd[1] - sourceStart[1]);
  const targetLength = Math.hypot(targetEnd.x - targetStart.x, targetEnd.y - targetStart.y);
  const axisScale = targetLength / sourceLength;
  context.save(); context.translate(targetStart.x, targetStart.y); context.rotate(targetAngle); context.scale(axisScale, 1);
  context.rotate(-sourceAngle); context.translate(-sourceStart[0], -sourceStart[1]); context.drawImage(image, 0, 0); context.restore();
  return { sourceStart, sourceEnd, targetStart, targetEnd, sourceAngle, targetAngle, axisScale, widthScale: 1 };
}

function nsRecipe(character, kit) {
  const lateral = character.recipe.segmentLengths;
  const leg = lateral.thigh + lateral.shin, arm = lateral.upperArm + lateral.forearm;
  return {
    identity: { templateId: character.id },
    lineage: { south: { kind: 'independent' }, north: { kind: 'independent' } },
    northSouth: {
      frame: { width: 240, height: 310, axisX: kit.axisX, floorY: kit.floorY },
      registration: {
        south: { scale: 1, sourceAxisX: kit.axisX, sourceFloorY: kit.floorY, sourceWidth: 240, sourceHeight: 310 },
        north: { scale: 1, sourceAxisX: kit.axisX, sourceFloorY: kit.floorY, sourceWidth: 240, sourceHeight: 310 },
      },
      segmentLengths3D: { thigh: lateral.thigh, shin: lateral.shin, upperArm: lateral.upperArm, forearm: lateral.forearm, hand: character.recipe.segmentLengths.hand },
      lanes: { hipHalfWidth: character.id.includes('auburn') ? 15 : 14, kneeBendLateralPreference: 0.055 },
      body: kit.body,
      projection: { verticalScale: 1, depthScale: 0.22, lateralScale: 1 },
      foot: { ankleHeight: 10, contactForwardOffset: 2, heelForwardOffset: -4, toeForwardOffset: 8, heelHalfWidth: 12, toeHalfWidth: 15, liftedHeelRise: 1, liftedToeRise: 3 },
      motion: {
        strideReach: 24 / 66 * leg, transitionReach: 12 / 66 * leg,
        recoveryLift: 3 / 66 * leg, passingLift: 5 / 66 * leg, transitionLift: 2 / 66 * leg,
        armStrideReach: 22 / 63 * arm, armTransitionReach: 11 / 63 * arm,
        armStrideSpan: 61 / 63 * arm, armTransitionSpan: 61.5 / 63 * arm, armPassingSpan: arm,
      },
    },
  };
}

function pair(frame, id) {
  const side = id.startsWith('left-') ? 'left' : 'right', joints = frame.joints[side];
  if (id.endsWith('upper-arm')) return [joints.shoulder, joints.elbow];
  if (id.endsWith('forearm-hand')) return [joints.elbow, joints.wrist];
  if (id.endsWith('thigh')) return [joints.hip, joints.knee];
  if (id.endsWith('shin')) return [joints.knee, joints.ankle];
  if (id.endsWith('shoe')) return [joints.ankle, joints.contact];
  throw new Error(id);
}

function guideForNS(target, kit) {
  const canvas = createCanvas(240, 310), context = canvas.getContext('2d'), frame = target.geometry.frame;
  context.fillStyle = 'rgba(49,199,220,.28)'; context.strokeStyle = '#31c7dc'; context.lineWidth = 1.2;
  polygonPath(context, frame.body.torso.map(point => [point.x, point.y])); context.fill(); context.stroke();
  context.beginPath(); context.ellipse(frame.body.headEnvelope.center.x, frame.body.headEnvelope.center.y, frame.body.headEnvelope.radiusX, frame.body.headEnvelope.radiusY, 0, 0, Math.PI * 2); context.fill(); context.stroke();
  for (const side of ['left', 'right']) {
    const joints = frame.joints[side]; context.strokeStyle = side === 'right' ? 'rgba(255,185,60,.55)' : 'rgba(255,185,60,.30)'; context.lineCap = 'round';
    for (const [a, b, width] of [['shoulder','elbow',kit.widths.upperArm],['elbow','wrist',kit.widths.forearm],['hip','knee',kit.widths.thigh],['knee','ankle',kit.widths.shin],['ankle','contact',kit.widths.shoe]]) {
      context.lineWidth = width; context.beginPath(); context.moveTo(joints[a].x, joints[a].y); context.lineTo(joints[b].x, joints[b].y); context.stroke();
    }
  }
  return canvas;
}

function reflectCanvas(source) {
  const canvas = createCanvas(source.width, source.height), context = canvas.getContext('2d');
  context.translate(source.width, 0); context.scale(-1, 1); context.drawImage(source, 0, 0); return canvas;
}

function lateralRecipe(character) {
  const frame=character.recipe.frame;
  return {identity:{templateId:character.id},lineage:{east:{kind:'independent'},west:{kind:'independent'}},lateral:{...character.recipe,registration:{east:{scale:1,sourceAxisX:frame.axisX,sourceFloorY:frame.floorY,sourceWidth:frame.width,sourceHeight:frame.height},west:{scale:1,sourceAxisX:frame.axisX,sourceFloorY:frame.floorY,sourceWidth:frame.width,sourceHeight:frame.height}}}};
}

function lateralDonor(source,piece){
  const canvas=createCanvas(240,340),context=canvas.getContext('2d');
  if(piece.reconstructFromTexture){const [start,end]=piece.anchors,rect=piece.reconstructFromTexture.sourceRect;context.beginPath();context.moveTo(...start);context.lineTo(...end);context.lineWidth=piece.reconstructFromTexture.width;context.lineCap='round';context.strokeStyle='#fff';context.stroke();context.globalCompositeOperation='source-in';context.drawImage(source,...rect,Math.min(start[0],end[0])-10,Math.min(start[1],end[1])-10,Math.abs(end[0]-start[0])+20,Math.abs(end[1]-start[1])+20);context.globalCompositeOperation='source-over';return canvas}
  context.save();polygonPath(context,piece.polygon);context.clip();context.drawImage(source,0,0);context.restore();
  if(piece.anchors&&!piece.id.includes('shoe')){const [start,end]=piece.anchors,mid=[(start[0]+end[0])/2,(start[1]+end[1])/2],count=piece.id.includes('forearm')?1:2;context.save();context.globalCompositeOperation='destination-over';for(let index=0;index<count;index++){const [x,y]=piece.anchors[index];context.save();context.beginPath();context.arc(x,y,piece.id.includes('arm')?9:11,0,Math.PI*2);context.clip();context.drawImage(source,mid[0]-4,mid[1]-4,8,8,x-11,y-11,22,22);context.restore()}context.restore()}
  return canvas;
}

function reflectAtLateralAxis(source,axisX){const canvas=createCanvas(source.width,source.height),context=canvas.getContext('2d');context.translate(axisX*2,0);context.scale(-1,1);context.drawImage(source,0,0);return canvas}
function reflectedPiece(piece,axisX){return{...piece,anchors:piece.anchors?.map(([x,y])=>[axisX*2-x,y]),polygon:piece.polygon?.map(([x,y])=>[axisX*2-x,y])}}
function lateralPair(geometry,id){const side=id.includes('near-right')?'right':'left',joints=geometry.joints[side];if(id.includes('upper-arm'))return[joints.shoulder,joints.elbow];if(id.includes('forearm'))return[joints.elbow,joints.wrist];if(id.includes('thigh'))return[joints.hip,joints.knee];if(id.includes('shin'))return[joints.knee,joints.ankle];if(id.includes('shoe'))return[joints.shoeHeel,joints.shoeToe];throw new Error(id)}
function drawLateral(context,image,piece,targetStart,targetEnd,scale){const [sourceStart,sourceEnd]=piece.anchors,sourceAngle=Math.atan2(sourceEnd[1]-sourceStart[1],sourceEnd[0]-sourceStart[0]),targetAngle=Math.atan2(targetEnd.y-targetStart.y,targetEnd.x-targetStart.x);context.save();context.translate(targetStart.x,targetStart.y);context.rotate(targetAngle-sourceAngle);context.scale(scale,scale);context.translate(-sourceStart[0],-sourceStart[1]);context.drawImage(image,0,0);context.restore();return{sourceStart,sourceEnd,targetStart,targetEnd,scale,rotationRadians:targetAngle-sourceAngle}}

async function buildWestKit(sourceImage,character){
  const kitName=character.id.includes('auburn')?'woman-donor-kit.json':'man-donor-kit.json',kit=JSON.parse(readFileSync(resolve(import.meta.dirname,kitName))),walk=removeCheckerboard(crop(sourceImage,kit.sourceCrop)),westRaw=removeCheckerboard(crop(sourceImage,{x:550,y:20,width:210,height:340})),westMirror=reflectCanvas(westRaw),back=removeCheckerboard(crop(sourceImage,{x:800,y:20,width:210,height:340}));
  const pieces=Object.fromEntries(kit.pieces.map(piece=>[piece.id,piece])),eastDonors=Object.fromEntries(kit.pieces.map(piece=>[piece.id,lateralDonor(piece.source==='standingWestMirror'?westMirror:walk,piece)]));
  const body=createCanvas(240,310),context=body.getContext('2d');context.save();polygonPath(context,kit.torsoClip);context.clip();context.drawImage(back,...kit.backFill.sourceRect,...kit.backFill.destinationRect);context.restore();context.drawImage(eastDonors['torso-core'],0,0);context.drawImage(eastDonors.head,0,0);
  const axis=character.recipe.frame.axisX,donors=Object.fromEntries(Object.entries(eastDonors).map(([id,image])=>[id,reflectAtLateralAxis(image,axis)])),westPieces=Object.fromEntries(Object.entries(pieces).map(([id,piece])=>[id,reflectedPiece(piece,axis)])),westBody=reflectAtLateralAxis(body,axis),sourceHip={x:axis*2-kit.bodySourceHip.x,y:kit.bodySourceHip.y};
  return{kit,donors,pieces:westPieces,body:westBody,sourceHip,nativeWest:{crop:{x:550,y:20,width:210,height:340},sourceAxisX:85}};
}

function staticGuide(width, height, registration, seated, kit) {
  const canvas = createCanvas(width, height), context = canvas.getContext('2d');
  context.strokeStyle = '#31c7dc'; context.fillStyle = 'rgba(49,199,220,.18)'; context.lineWidth = 2;
  context.beginPath(); context.moveTo(registration.axisX, 25); context.lineTo(registration.axisX, registration.floorY); context.stroke();
  context.beginPath(); context.moveTo(25, registration.floorY); context.lineTo(width - 25, registration.floorY); context.stroke();
  context.beginPath(); context.arc(registration.hip[0], registration.hip[1], 5, 0, Math.PI * 2); context.fill(); context.stroke();
  const head=registration.head;
  context.beginPath();context.ellipse(head.center[0],head.center[1],head.radius[0],head.radius[1],0,0,Math.PI*2);context.fill();context.stroke();
  const shoulderY=(registration.joints.left.shoulder[1]+registration.joints.right.shoulder[1])/2,halfShoulder=kit.body.torsoShoulderHalfWidth,halfHip=kit.body.torsoHipHalfWidth;
  polygonPath(context,[[registration.axisX-halfShoulder,shoulderY],[registration.axisX+halfShoulder,shoulderY],[registration.axisX+halfHip,registration.hip[1]],[registration.axisX-halfHip,registration.hip[1]]]);context.fill();context.stroke();
  context.fillStyle='rgba(255,185,60,.18)';context.strokeStyle='#e0a43c';context.lineCap='round';
  for(const side of ['right','left']){
    const joints=registration.joints[side];
    for(const chain of [['shoulder','elbow','wrist'],['hip','knee','ankle','sole']]){
      context.beginPath();
      chain.forEach((name,index)=>index?context.lineTo(...joints[name]):context.moveTo(...joints[name]));
      context.stroke();
      for(const name of chain){context.beginPath();context.arc(...joints[name],3,0,Math.PI*2);context.fill();context.stroke()}
    }
  }
  if (seated) {
    context.strokeStyle = '#ed1768'; context.beginPath(); context.moveTo(35, registration.seatContact[1]); context.lineTo(width - 35, registration.seatContact[1]); context.stroke();
    for (const sole of [registration.leftSole, registration.rightSole]) { context.beginPath(); context.moveTo(sole[0] - 15, sole[1]); context.lineTo(sole[0] + 15, sole[1]); context.stroke(); }
  }
  return canvas;
}

function writeDirectionalDonorAudit(characterId, donorsByView, definitionsByView) {
  const auditDir = resolve(out, 'directional-donor-audit');
  mkdirSync(auditDir, { recursive: true });
  const ids = ['body','head','right-upper-arm','right-forearm-hand','left-upper-arm','left-forearm-hand','right-thigh','right-shin','right-shoe','left-thigh','left-shin','left-shoe'];
  const canvas = createCanvas(1960, 760), context = canvas.getContext('2d');
  context.fillStyle = '#17191d'; context.fillRect(0,0,canvas.width,canvas.height); context.fillStyle='#fff'; context.font='bold 18px sans-serif';
  context.fillText(`${characterId} native directional donor audit`,15,25);
  for (const [row, view] of ['south','north'].entries()) {
    ids.forEach((id,column)=> {
      const x=10+column*162,y=42+row*350; context.fillStyle='#f1efe9';context.fillRect(x,y,150,330);
      context.fillStyle='#222';context.font='11px sans-serif';context.fillText(`${view}/${id}`,x+4,y+14);
      context.imageSmoothingEnabled=false;context.drawImage(donorsByView[view][id],0,0,240,340,x,y+18,150,300);
      if(definitionsByView[view][id]?.anchors){context.fillStyle='#ed1768';for(const [ax,ay] of definitionsByView[view][id].anchors){context.beginPath();context.arc(x+ax*150/240,y+18+ay*300/340,2.5,0,Math.PI*2);context.fill()}}
    });
  }
  writeFileSync(resolve(auditDir,`${characterId}-donors.png`),canvas.toBuffer('image/png'));
}

const records = [];
for (const kit of kits.characters) {
  const character = mapping.characters.find(item => item.id === kit.id);
  const east = eastProof.characters.find(item => item.id === kit.id);
  const sourceBytes = readFileSync(resolve(repo, character.sourcePath));
  if (sha(sourceBytes) !== character.sourceSha256) throw new Error(`source hash ${kit.id}`);
  const sourceImage = await loadImage(resolve(repo, character.sourcePath));
  const walks = {}, donors = {}, viewDefinitions = {};
  for (const view of ['south', 'north']) {
    walks[view] = removeCheckerboard(crop(sourceImage, kits.views[view].crop));
    viewDefinitions[view] = restDefinitions(view, kit);
    donors[view] = Object.fromEntries(Object.entries(viewDefinitions[view]).map(([id, definition]) => [id, donor(walks[view], definition, id !== 'head', id)]));
    const torso = createCanvas(240, 340), context = torso.getContext('2d');
    const bodyClip=shiftPolygon(kits.views[view].bodyClip,kits.views[view].sourceAxisX-105);
    context.save(); polygonPath(context, bodyClip); context.clip(); context.drawImage(walks[view], 0, 0); context.restore();
    const pelvisAxis=kits.views[view].sourceAxisX;
    context.save();context.beginPath();context.rect(pelvisAxis-25,216,50,17);context.clip();context.drawImage(walks[view],0,0);context.restore();
    context.drawImage(donors[view].head, 0, 0); donors[view].body = torso;
  }
  writeDirectionalDonorAudit(kit.id, donors, viewDefinitions);

  const recipe = nsRecipe(character, kit), compiled = compileNorthSouth(recipe), directions = { east: {}, west: {}, south: {}, north: {} };
  const westKit=await buildWestKit(sourceImage,character),westTargets=compileLateral(lateralRecipe(character)).filter(target=>target.view==='west');
  for (const phase of Object.keys(east.outputs)) {
    const eastBase=resolve(repo,'artifacts/character-movement/retained-donor-merge/two-character-eight-east-v2');
    const eastCleanBytes=readFileSync(resolve(eastBase,east.outputs[phase].clean)),eastGuideBytes=readFileSync(resolve(eastBase,east.outputs[phase].guide));
    writeFileSync(resolve(out,east.outputs[phase].clean),eastCleanBytes);writeFileSync(resolve(out,east.outputs[phase].guide),eastGuideBytes);
    directions.east[phase] = { clean:east.outputs[phase].clean,guide:east.outputs[phase].guide,sha256:{clean:sha(eastCleanBytes),guide:sha(eastGuideBytes)}, geometry: east.targets[phase], transforms: east.appliedTransforms[phase], provenance: 'retained east donor kit v2' };
    const eastGuide = await loadImage(resolve(eastBase, east.outputs[phase].guide));
    const westTarget=westTargets.find(target=>target.phaseId===phase),geometry=westTarget.geometry,westCanvas=createCanvas(240,310),westContext=westCanvas.getContext('2d'),trace={};
    const drawWest=id=>{const[start,end]=lateralPair(geometry,id);trace[id]=drawLateral(westContext,westKit.donors[id],westKit.pieces[id],start,end,east.fixedScales[id])};
    for(const id of ['near-right-thigh','near-right-shin','near-right-shoe','far-left-thigh','far-left-shin','far-left-shoe','near-right-upper-arm','near-right-forearm-hand'])drawWest(id);
    const bodyTarget=geometry.joints.right.hip,translate={x:bodyTarget.x-westKit.sourceHip.x,y:bodyTarget.y-westKit.sourceHip.y};westContext.save();westContext.translate(translate.x,translate.y);westContext.drawImage(westKit.body,0,0);westContext.restore();trace.body={scale:1,translate,sourceHip:westKit.sourceHip,targetHip:bodyTarget};
    for(const id of ['far-left-upper-arm','far-left-forearm-hand'])drawWest(id);
    const westGuide = reflectAtLateralAxis(eastGuide,character.recipe.frame.axisX);
    const cleanName = `frames/${kit.id}-west-${phase}.png`, guideName = `frames/${kit.id}-west-${phase}-guide.png`;
    const cleanBytes = westCanvas.toBuffer('image/png'), guideBytes = westGuide.toBuffer('image/png');
    writeFileSync(resolve(out, cleanName), cleanBytes); writeFileSync(resolve(out, guideName), guideBytes);
    directions.west[phase] = { clean: cleanName, guide: guideName, sha256: { clean: sha(cleanBytes), guide: sha(guideBytes) }, geometry, transforms:trace, provenance: 'west recomposed from individually reflected retained donors against compileLateral west targets; anatomical right is far, anatomical left/watch is near and drawn after torso',nativeWestSource:westKit.nativeWest };
  }

  for (const target of compiled) {
    const view = target.view, phase = target.phaseId, frame = target.geometry.frame, definitions = viewDefinitions[view], trace = {};
    const canvas = createCanvas(240, 310), context = canvas.getContext('2d');
    const order = target.geometry.visibility;
    const drawSide = (side, part) => {
      const ids = part === 'leg' ? [`${side}-thigh`,`${side}-shin`,`${side}-shoe`] : [`${side}-upper-arm`,`${side}-forearm-hand`];
      for (const id of ids) { const [start,end] = pair(frame,id); trace[id] = drawAxial(context,donors[view][id],definitions[id],start,end); }
    };
    drawSide(order.legsFarToNear[0], 'leg'); drawSide(order.legsFarToNear[1], 'leg'); drawSide(order.armsFarToNear[0], 'arm');
    const bodyTarget = frame.body.axisBottom, sourceHip = kit.sourceBodyHip[view], translate = { x: bodyTarget.x-sourceHip[0], y: bodyTarget.y-sourceHip[1] };
    context.save(); context.translate(translate.x, translate.y); context.drawImage(donors[view].body,0,0); context.restore();
    trace.body = { scale: 1, translate, sourceHip, targetHip: bodyTarget };
    drawSide(order.armsFarToNear[1], 'arm');
    const guide = guideForNS(target,kit), cleanName=`frames/${kit.id}-${view}-${phase}.png`, guideName=`frames/${kit.id}-${view}-${phase}-guide.png`;
    const cleanBytes=canvas.toBuffer('image/png'),guideBytes=guide.toBuffer('image/png'); writeFileSync(resolve(out,cleanName),cleanBytes);writeFileSync(resolve(out,guideName),guideBytes);
    directions[view][phase]={clean:cleanName,guide:guideName,sha256:{clean:sha(cleanBytes),guide:sha(guideBytes)},geometry:target.geometry,transforms:trace,provenance:`native ${view} walkA reusable head/torso/limb donors; axis-only limb scaling`};
  }

  const staticAssets={};
  for(const [mode,cropBox] of [['standSouth',{x:50,y:20,width:210,height:340}],['sitSouth',{x:1000,y:20,width:210,height:340}]]){
    const image=removeCheckerboard(crop(sourceImage,cropBox)),guide=staticGuide(210,340,kit.static[mode],mode==='sitSouth',kit);
    const cleanName=`frames/${kit.id}-${mode}.png`,guideName=`frames/${kit.id}-${mode}-guide.png`,cleanBytes=image.toBuffer('image/png'),guideBytes=guide.toBuffer('image/png');
    writeFileSync(resolve(out,cleanName),cleanBytes);writeFileSync(resolve(out,guideName),guideBytes);
    staticAssets[mode]={clean:cleanName,guide:guideName,sha256:{clean:sha(cleanBytes),guide:sha(guideBytes)},registration:kit.static[mode],sourceCrop:cropBox,transform:{scale:1,translate:{x:0,y:0}},provenance:'unaltered retained source pose after checkerboard removal'};
  }
  const donorKits={
    east:{kitPath:east.kitPath,kitSha256:east.kitSha256,fixedScales:east.fixedScales},
    south:{sourceCrop:kits.views.south.crop,sourceAxisX:kits.views.south.sourceAxisX,bodyClip:shiftPolygon(kits.views.south.bodyClip,kits.views.south.sourceAxisX-105),sourceBodyHip:kit.sourceBodyHip.south,pieces:viewDefinitions.south},
    north:{sourceCrop:kits.views.north.crop,sourceAxisX:kits.views.north.sourceAxisX,bodyClip:shiftPolygon(kits.views.north.bodyClip,kits.views.north.sourceAxisX-105),sourceBodyHip:kit.sourceBodyHip.north,pieces:viewDefinitions.north},
    west:{sourceCrop:westKit.kit.sourceCrop,nativeWestSource:westKit.nativeWest,sourceBodyHip:westKit.sourceHip,pieces:westKit.pieces,fixedScales:east.fixedScales}
  };
  records.push({id:kit.id,runtimeId:kit.runtimeId,label:character.label,sourcePath:character.sourcePath,sourceSha256:character.sourceSha256,recipe,directions,static:staticAssets,donorKits,watchAnatomy:kit.id.includes('dark-hair')?'watch is anatomical left: south screen-right, north screen-left, east far, west near':'no distinctive watch',limitations:['North/south torso cores exclude wrists and arms; hidden shoulder/hip caps reuse same-view clothing texture.','North/south limb scaling changes length only along each projected limb axis; perpendicular source width remains 1.','West is recomposed from individually reflected east donor pieces; native west idle is retained as anatomical-side provenance, and the left watch is not side-swapped.']});
}

const manifest={schemaVersion:1,status:'expansion-review-candidate',acceptedSolvers:['tools/character-mapping/math.mjs#compileLateral','tools/character-mapping/math.mjs#compileNorthSouth'],phaseIds:['01','02','03','04','05','06','07','08'],directions:['east','west','south','north'],characters:records,limitations:['Two retained characters only; this does not establish full-roster coverage or production acceptance.','Standing and seated assets are original south-facing source poses with explicit registration, not synthesized gait poses.','Reconstructed hidden garment and joint seams remain visual-review limits.']};
writeFileSync(resolve(out,'all-directions-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({characters:records.length,walkFrames:records.length*32,staticFrames:records.length*2,out}));
