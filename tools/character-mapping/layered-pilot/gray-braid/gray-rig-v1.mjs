import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { buildStandingGeometry, buildWalkGeometry } from '../../canonical-master/canonical-geometry.mjs';
import { V8_CALIBRATION } from '../green-rig-v8.mjs';
import { DIRECTIONAL_CALIBRATION } from '../directional/directional-rig-v1.mjs';
import { GREEN_ACTION_RIG_V1, greenStarJumpPose } from '../actions/green-action-rig-v1.mjs';

export const GRAY_VIEWS = Object.freeze(['south', 'east', 'west', 'north']);
export const GRAY_RIG_V1 = Object.freeze({
  canvas: { width: 160, height: 320, axisX: 80, floorY: 287 },
  torso: {
    scale: { south: 0.39, east: 0.40, west: 0.40, north: 0.40 },
    topY: { south: 115, east: 114, west: 114, north: 111 },
  },
  sleeveAcrossScale: { south: 0.30, east: 0.29, west: 0.29, north: 0.30 },
  handScale: { south: 0.26, east: 0.26, west: 0.26, north: 0.26 },
  legAcrossScale: { south: 0.30, east: 0.29, west: 0.29, north: 0.30 },
  profileBackwardArmScale: DIRECTIONAL_CALIBRATION.profileBackwardArmScale,
  shoulders: {
    south: { left: { x: 46, y: 130 }, right: { x: 114, y: 130 } },
    east: DIRECTIONAL_CALIBRATION.shoulderSockets.east,
    west: DIRECTIONAL_CALIBRATION.shoulderSockets.west,
    north: { left: { x: 46, y: 128 }, right: { x: 114, y: 128 } },
  },
  restingCuffs: {
    south: { left: { x: 44, y: 193 }, right: { x: 116, y: 193 } },
    east: DIRECTIONAL_CALIBRATION.restingCuffs.east,
    west: DIRECTIONAL_CALIBRATION.restingCuffs.west,
    north: { left: { x: 46, y: 196 }, right: { x: 114, y: 196 } },
  },
});

export const GRAY_ACTION_RIG_V1 = Object.freeze({
  durationMs: GREEN_ACTION_RIG_V1.durationMs,
  sitting: {
    bodyDrop: 16, seatY: 236, floorY: 287,
    lowerScale: { south: .47, east: .45, west: .45, north: .47 },
    lowerOffsetX: { south: 0, east: 7, west: -7, north: 0 },
    torsoScale: { south: .322, east: .30, west: .30, north: .311 },
    armAcrossScale: { south: .38, east: .39, west: .39, north: .37 },
    handTargets: { south:{left:{x:64,y:221},right:{x:96,y:221}},east:{left:{x:97,y:220},right:{x:95,y:218}},west:{left:{x:63,y:220},right:{x:65,y:218}},north:{left:{x:61,y:220},right:{x:99,y:220}} },
  },
  clipboard: { board:{x:55,y:145,width:44,height:42}, armAcrossScale:{left:.29,right:.29}, handTargets:{left:{x:70,y:187},right:{x:98,y:175}} },
});

const standingGeometry = Object.fromEntries(GRAY_VIEWS.map(view => [view, buildStandingGeometry(view)]));
const walkingGeometry = buildWalkGeometry();

function imageData(image) {
  const canvas = createCanvas(image.width, image.height), context = canvas.getContext('2d');
  context.drawImage(image, 0, 0); return context.getImageData(0, 0, image.width, image.height).data;
}

function alphaCentroid(data, width, bounds, startFraction, endFraction) {
  const startY = Math.floor(bounds.y + bounds.height * startFraction), endY = Math.ceil(bounds.y + bounds.height * endFraction);
  let weight = 0, sumX = 0, sumY = 0;
  for (let y = startY; y < endY; y += 1) for (let x = bounds.x; x < bounds.x + bounds.width; x += 1) {
    const alpha = data[(y * width + x) * 4 + 3]; if (alpha < 24) continue;
    weight += alpha; sumX += x * alpha; sumY += y * alpha;
  }
  if (!weight) throw new Error(`empty anchor band ${JSON.stringify(bounds)}`);
  return { x: sumX / weight, y: sumY / weight };
}

function profileHeelAnchor(data, width, bounds, heelSide) {
  const heelStart = heelSide === 'right' ? 0.60 : 0;
  const heelWidth = 0.40;
  const heelStartX = Math.floor(bounds.x + bounds.width * heelStart);
  const heelEndX = Math.ceil(bounds.x + bounds.width);
  const heelBounds = { x: heelStartX, y: bounds.y, width: heelEndX - heelStartX, height: bounds.height };
  return alphaCentroid(data, width, heelBounds, 0, 0.14);
}

export async function loadGrayRigV1(repo) {
  const root = 'tools/character-mapping/layered-pilot/gray-braid/assets';
  const provenanceFile = `${root}/gray-assets-v1-provenance.json`;
  const provenance = JSON.parse(readFileSync(resolve(repo, provenanceFile), 'utf8'));
  const plateFile = `${root}/${provenance.baseAtlas.output.file}`;
  const actionPlateFile = `${root}/${provenance.actionAtlas.output.file}`;
  const seatedTorsoPlateFile = `${root}/${provenance.seatedTorsoAtlas.output.file}`;
  const [plate,actionPlate,seatedTorsoPlate]=await Promise.all([loadImage(resolve(repo,plateFile)),loadImage(resolve(repo,actionPlateFile)),loadImage(resolve(repo,seatedTorsoPlateFile))]), pixels = imageData(plate),actionPixels=imageData(actionPlate);
  const identity = {}, anchors = {},actionAnchors={sitting:{},clipboard:{}};
  for (const view of GRAY_VIEWS) {
    const record = provenance.identity[view];
    identity[view] = {
      face: await loadImage(resolve(repo, root, record.faceCrown.file)),
      tail: await loadImage(resolve(repo, root, record.braidTail.file)),
      shoulder: record.shoulderPatch ? await loadImage(resolve(repo,root,record.shoulderPatch.file)) : null,
    };
    anchors[view] = { sleeves: {}, hands: {}, shoes: {}, shoeCenters: {} };
    for (const side of ['left', 'right']) {
      const sleeve = provenance.baseAtlas.parts[view].sleeves[side], hand = provenance.baseAtlas.parts[view].hands[side];
      anchors[view].sleeves[side] = { cap: alphaCentroid(pixels, plate.width, sleeve, 0, 0.12), cuff: alphaCentroid(pixels, plate.width, sleeve, 0.84, 1) };
      anchors[view].hands[side] = alphaCentroid(pixels, plate.width, hand, 0, 0.20);
      if(view==='east'||view==='west'){const shoe=profileShoeBand(provenance.baseAtlas.parts[view].legs[side]),top=alphaCentroid(pixels,plate.width,shoe,0,.14);anchors[view].shoeCenters[side]=top;anchors[view].shoes[side]=view==='west'&&side==='right'?profileHeelAnchor(pixels,plate.width,shoe,'right'):top;}
    }
  }
  for(const view of GRAY_VIEWS){actionAnchors.sitting[view]={};for(const side of ['left','right']){const bounds=provenance.actionAtlas.parts.sitting[view][`${side}Arm`];actionAnchors.sitting[view][side]={shoulder:alphaCentroid(actionPixels,actionPlate.width,bounds,0,.14),hand:alphaCentroid(actionPixels,actionPlate.width,bounds,.82,1)};}}
  for(const side of ['left','right']){const bounds=provenance.actionAtlas.parts.clipboard[`${side}Arm`];actionAnchors.clipboard[side]={shoulder:alphaCentroid(actionPixels,actionPlate.width,bounds,0,.14),hand:alphaCentroid(actionPixels,actionPlate.width,bounds,.82,1)};}
  return { plate,actionPlate,seatedTorsoPlate, provenance, identity, anchors,actionAnchors, files: { provenance: provenanceFile, plate: plateFile,actionPlate:actionPlateFile,seatedTorsoPlate:seatedTorsoPlateFile, original: provenance.original.path } };
}

function mapSouth(point) {
  return { x: 80 + (point.x - 112) * V8_CALIBRATION.projectionScale.x, y: GRAY_RIG_V1.canvas.floorY - (296 - point.y) * V8_CALIBRATION.projectionScale.y };
}

function mapDirectional(view, point) {
  const xScale = view === 'north' ? 32 / 26 : 1;
  const yScale = (GRAY_RIG_V1.canvas.floorY - DIRECTIONAL_CALIBRATION.target.hipY) / 96;
  return { x: 80 + (point.x - 112) * xScale, y: GRAY_RIG_V1.canvas.floorY - (296 - point.y) * yScale };
}

function mappedGeometry(view, geometry) {
  const map = point => view === 'south' ? mapSouth(point) : mapDirectional(view, point);
  return {
    hipCenter: map(geometry.hipCenter),
    joints: Object.fromEntries(['left', 'right'].map(side => [side, Object.fromEntries(['hip', 'knee', 'ankle', 'soleContact', 'shoulder', 'wrist'].map(name => [name, map(geometry.joints[side][name])]))])),
  };
}

function perpendicular(start, end) {
  const dx = end.x - start.x, dy = end.y - start.y, length = Math.hypot(dx, dy) || 1;
  return { x: -dy / length, y: dx / length };
}
function section(center, normal, halfWidth) { return [{ x: center.x + normal.x * halfWidth, y: center.y + normal.y * halfWidth }, { x: center.x - normal.x * halfWidth, y: center.y - normal.y * halfWidth }]; }

function drawTriangle(context, image, source, target) {
  const [s0,s1,s2] = source, [t0,t1,t2] = target;
  const sd = (s1.x-s0.x)*(s2.y-s0.y)-(s2.x-s0.x)*(s1.y-s0.y); if (Math.abs(sd) < 1e-6) return;
  const a=((t1.x-t0.x)*(s2.y-s0.y)-(t2.x-t0.x)*(s1.y-s0.y))/sd;
  const c=((s1.x-s0.x)*(t2.x-t0.x)-(s2.x-s0.x)*(t1.x-t0.x))/sd;
  const b=((t1.y-t0.y)*(s2.y-s0.y)-(t2.y-t0.y)*(s1.y-s0.y))/sd;
  const d=((s1.x-s0.x)*(t2.y-t0.y)-(s2.x-s0.x)*(t1.y-t0.y))/sd;
  const e=t0.x-a*s0.x-c*s0.y, f=t0.y-b*s0.x-d*s0.y;
  context.save(); context.beginPath(); context.moveTo(t0.x,t0.y); context.lineTo(t1.x,t1.y); context.lineTo(t2.x,t2.y); context.closePath(); context.clip();
  context.setTransform(a,b,c,d,e,f); context.drawImage(image,0,0); context.restore();
}
function drawQuad(context, image, rect, quad) {
  const {x,y,width,height}=rect, source=[{x,y},{x:x+width,y},{x:x+width,y:y+height},{x,y:y+height}];
  drawTriangle(context,image,[source[0],source[1],source[2]],[quad[0],quad[1],quad[2]]);
  drawTriangle(context,image,[source[0],source[2],source[3]],[quad[0],quad[2],quad[3]]);
}

function legBands(bounds) {
  const thighHeight = Math.round(bounds.height * 0.42), shinHeight = Math.round(bounds.height * 0.40);
  return {
    thigh: { x: bounds.x, y: bounds.y, width: bounds.width, height: thighHeight },
    shin: { x: bounds.x, y: bounds.y + thighHeight, width: bounds.width, height: shinHeight },
    shoe: { x: bounds.x, y: bounds.y + thighHeight + shinHeight, width: bounds.width, height: bounds.height - thighHeight - shinHeight },
  };
}
function profileShoeBand(bounds){const start=Math.round(bounds.height*.85);return{x:bounds.x,y:bounds.y+start,width:bounds.width,height:bounds.height-start};}
function rightOpaqueEdge(canvas, startY, endY) { const data=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data; let edge=-1; for(let y=Math.max(0,startY);y<=Math.min(canvas.height-1,endY);y+=1)for(let x=0;x<canvas.width;x+=1)if(data[(y*canvas.width+x)*4+3]>=24)edge=Math.max(edge,x); return edge; }

function drawLeg(context, loaded, view, side, joints) {
  const parts = loaded.provenance.baseAtlas.parts[view].legs;
  const bands = legBands(parts[side]), scale = GRAY_RIG_V1.legAcrossScale[view],shoeSide=view==='east'?'left':view==='west'?'right':side,isProfile=view==='east'||view==='west',shoe=isProfile?profileShoeBand(parts[shoeSide]):legBands(parts[shoeSide]).shoe,shoeScale=scale;
  const visualAnkle=isProfile?{x:joints.ankle.x,y:joints.soleContact.y-shoe.height*shoeScale}:joints.ankle,seamOverlap=isProfile?2:0,trouserAnkle={x:visualAnkle.x,y:visualAnkle.y+seamOverlap};
  const thighNormal = perpendicular(joints.hip,joints.knee), shinNormal = perpendicular(joints.knee,trouserAnkle);
  const sum={x:thighNormal.x+shinNormal.x,y:thighNormal.y+shinNormal.y}, length=Math.hypot(sum.x,sum.y)||1, kneeNormal={x:sum.x/length,y:sum.y/length};
  const terminalNormal=isProfile?{x:Math.sign(shinNormal.x)||-1,y:0}:shinNormal;
  const halfWidth = parts[side].width * scale / 2, hip=section(joints.hip,thighNormal,halfWidth), knee=section(joints.knee,kneeNormal,halfWidth), ankle=section(trouserAnkle,terminalNormal,halfWidth);
  const trousers=createCanvas(160,320), tc=trousers.getContext('2d');
  drawQuad(tc,loaded.plate,bands.thigh,[hip[0],hip[1],knee[1],knee[0]]); drawQuad(tc,loaded.plate,bands.shin,[knee[0],knee[1],ankle[1],ankle[0]]);
  tc.globalCompositeOperation='destination-in';tc.strokeStyle='#fff';tc.lineWidth=halfWidth*2;tc.lineCap='round';tc.lineJoin='round';tc.beginPath();tc.moveTo(joints.hip.x,joints.hip.y);tc.lineTo(joints.knee.x,joints.knee.y);tc.lineTo(trouserAnkle.x,trouserAnkle.y);tc.stroke();
  const rearLean=view==='west'?Math.max(0,joints.ankle.x-joints.knee.x):0,rearCuffEdge=view==='west'&&loaded.enableWestTrailingCuffRegistration!==false&&rearLean>0?rightOpaqueEdge(trousers,Math.floor(trouserAnkle.y-10),Math.ceil(trouserAnkle.y)):null;
  context.drawImage(trousers,0,0);
  let shoeDestination,shoeAnchor=null,shoeHeelAnchor=null,shoeCenterAnchor=null,shoeRearCorrection=0,shoeHeelEdge=null;
  if(isProfile){shoeAnchor=loaded.anchors[view].shoes[shoeSide];shoeHeelAnchor=shoeAnchor;shoeCenterAnchor=loaded.anchors[view].shoeCenters[shoeSide];if(view==='west'&&loaded.enableWestTrailingCuffRegistration!==false&&rearLean>0){const blend=Math.min(1,rearLean/16);shoeAnchor={x:shoeHeelAnchor.x+(shoeCenterAnchor.x-shoeHeelAnchor.x)*blend,y:shoeHeelAnchor.y+(shoeCenterAnchor.y-shoeHeelAnchor.y)*blend};}const width=shoe.width*shoeScale,height=shoe.height*shoeScale,baseX=visualAnkle.x-(shoeAnchor.x-shoe.x)*shoeScale,x=rearCuffEdge===null?baseX:Math.max(baseX,rearCuffEdge+1-width),y=visualAnkle.y;shoeHeelEdge=x+width;shoeRearCorrection=x-(visualAnkle.x-(shoeHeelAnchor.x-shoe.x)*shoeScale);shoeAnchor={x:shoe.x+(visualAnkle.x-x)/shoeScale,y:shoeAnchor.y};context.drawImage(loaded.plate,shoe.x,shoe.y,shoe.width,shoe.height,x,y,width,height);shoeDestination={x,y,width,height};}
  else{const x=joints.soleContact.x-shoe.width*shoeScale/2,y=joints.soleContact.y-shoe.height*shoeScale,width=shoe.width*shoeScale,height=shoe.height*shoeScale;context.drawImage(loaded.plate,shoe.x,shoe.y,shoe.width,shoe.height,x,y,width,height);shoeDestination={x,y,width,height};}
  return { joints,visualAnkle,trouserAnkle,seamOverlap,ankleAdjustment:{x:visualAnkle.x-joints.ankle.x,y:visualAnkle.y-joints.ankle.y},source: { trouser: bands, shoe }, scale, shoeDonor: shoeSide,shoeAnchor,shoeHeelAnchor,shoeCenterAnchor,rearLean,rearCuffEdge,shoeHeelEdge,shoeRearCorrection,shoeDestination };
}

function armTargets(view, side, geometry, bodyBob) {
  if (view === 'south') {
    const stand=standingGeometry.south.joints[side], now=geometry.joints[side];
    const delta={x:(now.wrist.x-now.shoulder.x)-(stand.wrist.x-stand.shoulder.x),y:(now.wrist.y-now.shoulder.y)-(stand.wrist.y-stand.shoulder.y)};
    const shoulder=GRAY_RIG_V1.shoulders.south[side],rest=GRAY_RIG_V1.restingCuffs.south[side];
    return { shoulder:{x:shoulder.x,y:shoulder.y+bodyBob}, cuff:{x:rest.x+delta.x*V8_CALIBRATION.projectionScale.x*0.4,y:rest.y+bodyBob+delta.y*V8_CALIBRATION.projectionScale.y} };
  }
  const stand=standingGeometry[view].joints[side], now=geometry.joints[side];
  const swing={x:(now.wrist.x-now.shoulder.x)-(stand.wrist.x-stand.shoulder.x),y:(now.wrist.y-now.shoulder.y)-(stand.wrist.y-stand.shoulder.y)};
  if ((view==='east'||view==='west') && swing.x*(view==='east'?1:-1)<0) swing.x*=GRAY_RIG_V1.profileBackwardArmScale;
  const shoulder=GRAY_RIG_V1.shoulders[view][side],rest=GRAY_RIG_V1.restingCuffs[view][side];
  return { shoulder:{x:shoulder.x,y:shoulder.y+bodyBob}, cuff:{x:rest.x+swing.x*(view==='north'?.85:1),y:rest.y+swing.y*.84+bodyBob} };
}

function mappedSleeve(context, loaded, view, side, target, acrossOverride) {
  const donor=view==='east'?'left':view==='west'?'right':side,rect=loaded.provenance.baseAtlas.parts[view].sleeves[donor], source=loaded.anchors[view].sleeves[donor];
  const sdx=source.cuff.x-source.cap.x,sdy=source.cuff.y-source.cap.y,sl=Math.hypot(sdx,sdy),tdx=target.cuff.x-target.shoulder.x,tdy=target.cuff.y-target.shoulder.y,tl=Math.hypot(tdx,tdy);
  const sa={x:sdx/sl,y:sdy/sl},sx={x:-sa.y,y:sa.x},ta={x:tdx/tl,y:tdy/tl},tx={x:-ta.y,y:ta.x},along=tl/sl,across=acrossOverride??GRAY_RIG_V1.sleeveAcrossScale[view];
  const matrix={a:ta.x*along*sa.x+tx.x*across*sx.x,b:ta.y*along*sa.x+tx.y*across*sx.x,c:ta.x*along*sa.y+tx.x*across*sx.y,d:ta.y*along*sa.y+tx.y*across*sx.y};
  matrix.e=target.shoulder.x-matrix.a*source.cap.x-matrix.c*source.cap.y;matrix.f=target.shoulder.y-matrix.b*source.cap.x-matrix.d*source.cap.y;
  context.save();context.setTransform(matrix.a,matrix.b,matrix.c,matrix.d,matrix.e,matrix.f);context.drawImage(loaded.plate,rect.x,rect.y,rect.width,rect.height,rect.x,rect.y,rect.width,rect.height);context.restore();
  return { sourceRect:rect,sourceAnchors:source,...target,matrix,acrossScale:across,alongScale:along,donor };
}

function drawHand(context, loaded, view, side, target) {
  const donor = view === 'east' ? 'left' : view === 'west' ? 'right' : side;
  const rect=loaded.provenance.baseAtlas.parts[view].hands[donor], anchor=loaded.anchors[view].hands[donor], scale=GRAY_RIG_V1.handScale[view];
  const angle=Math.atan2(target.cuff.y-target.shoulder.y,target.cuff.x-target.shoulder.x)-Math.PI/2;
  context.save();context.translate(target.cuff.x,target.cuff.y-2);context.rotate(angle);context.scale(scale,scale);context.drawImage(loaded.plate,rect.x,rect.y,rect.width,rect.height,-(anchor.x-rect.x),-(anchor.y-rect.y),rect.width,rect.height);context.restore();
  return { sourceRect:rect,sourceAnchor:anchor,scale,angle,donor };
}

function drawTorso(context,loaded,view,bodyBob){const rect=loaded.provenance.baseAtlas.parts[view].torso,scale=GRAY_RIG_V1.torso.scale[view],x=80-(rect.x+rect.width/2)*scale,y=GRAY_RIG_V1.torso.topY[view]+bodyBob-rect.y*scale;context.drawImage(loaded.plate,rect.x,rect.y,rect.width,rect.height,x+rect.x*scale,y+rect.y*scale,rect.width*scale,rect.height*scale);return{x,y,scale,sourceRect:rect,top:GRAY_RIG_V1.torso.topY[view]+bodyBob,bottom:GRAY_RIG_V1.torso.topY[view]+bodyBob+rect.height*scale};}
function drawIdentity(context,loaded,view,bodyBob,layer){const record=loaded.provenance.identity[view],faceY=39-record.faceCrown.bounds.y+bodyBob,x=80-record.sourceHipX;context.drawImage(loaded.identity[view][layer],x,faceY);return{x,y:faceY,scale:1,bounds:record[layer==='face'?'faceCrown':'braidTail'].bounds};}
function drawProfileShoulderPatch(context,loaded,view,bodyBob){const record=loaded.provenance.identity[view];if(!record.shoulderPatch||!loaded.identity[view].shoulder)return null;const x=80-record.sourceHipX,y=39-record.faceCrown.bounds.y+bodyBob;context.drawImage(loaded.identity[view].shoulder,x,y);return{x,y,scale:1,bounds:record.shoulderPatch.bounds};}

function alphaBounds(canvas){const d=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;let l=canvas.width,t=canvas.height,r=-1,b=-1;for(let i=0;i<d.length;i+=4)if(d[i+3]>=24){const p=i/4,x=p%canvas.width,y=Math.floor(p/canvas.width);l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);}return{left:l,top:t,right:r,bottom:b,width:r-l+1,height:b-t+1};}

export function grayPose(view,index=0){if(!GRAY_VIEWS.includes(view))throw new Error(`unsupported gray view ${view}`);const normalized=((index%8)+8)%8,geometry=walkingGeometry[view][String(normalized+1).padStart(2,'0')];return{view,index:normalized,phaseId:geometry.phaseId,geometry};}
export function grayStandingPose(view){if(!GRAY_VIEWS.includes(view))throw new Error(`unsupported gray view ${view}`);return{view,index:null,phaseId:'stand',geometry:standingGeometry[view]};}

export function renderGrayV1(loaded,pose){
  const {view,geometry}=pose,mapped=mappedGeometry(view,geometry),standing=mappedGeometry(view,standingGeometry[view]),bodyBob=Math.round(mapped.hipCenter.y-standing.hipCenter.y),canvas=createCanvas(160,320),context=canvas.getContext('2d');
  const legs={},armTargetsBySide={},sleeves={},hands={},sleeveCanvases={},handCanvases={};
  const near=view==='east'?'right':view==='west'?'left':null,far=near?(near==='left'?'right':'left'):null;
  const legOrder=near?[far,near]:['left','right'];for(const side of legOrder)legs[side]=drawLeg(context,loaded,view,side,mapped.joints[side]);
  for(const side of ['left','right']){const target=armTargets(view,side,geometry,bodyBob);armTargetsBySide[side]=target;const sc=createCanvas(160,320),hc=createCanvas(160,320);sleeves[side]=mappedSleeve(sc.getContext('2d'),loaded,view,side,target);hands[side]=drawHand(hc.getContext('2d'),loaded,view,side,target);sleeveCanvases[side]=sc;handCanvases[side]=hc;}
  let tail,torso,face,shoulderPatch=null;
  if(view==='east'||view==='west'){
    context.drawImage(sleeveCanvases[far],0,0);context.drawImage(handCanvases[far],0,0);tail=drawIdentity(context,loaded,view,bodyBob,'tail');torso=drawTorso(context,loaded,view,bodyBob);shoulderPatch=drawProfileShoulderPatch(context,loaded,view,bodyBob);context.drawImage(sleeveCanvases[near],0,0);
    const shoulder=armTargetsBySide[near].shoulder;drawProfileSocketCap(context,loaded,view,near,shoulder,bodyBob);context.drawImage(handCanvases[near],0,0);
  }else{
    context.drawImage(sleeveCanvases.left,0,0);context.drawImage(sleeveCanvases.right,0,0);torso=drawTorso(context,loaded,view,bodyBob);
    // Restore both frontal/rear caps at their fixed sockets after the torso covers the armholes.
    for(const side of ['left','right']){const shoulder=armTargetsBySide[side].shoulder;context.save();context.beginPath();context.arc(shoulder.x,shoulder.y,24,0,Math.PI*2);context.clip();context.drawImage(sleeveCanvases[side],0,0);context.restore();}
    tail=drawIdentity(context,loaded,view,bodyBob,'tail');context.drawImage(handCanvases.left,0,0);context.drawImage(handCanvases.right,0,0);
  }
  face=drawIdentity(context,loaded,view,bodyBob,'face');
  return{canvas,metadata:{view,phaseId:pose.phaseId,index:pose.index,bodyBob,geometry,mappedGeometry:mapped,legs,arms:Object.fromEntries(['left','right'].map(side=>[side,{target:armTargetsBySide[side],sleeve:sleeves[side],hand:hands[side]}])),torso,identity:{face,tail,shoulderPatch},bounds:alphaBounds(canvas),layerPolicy:view==='east'||view==='west'?['legs','farSleeve','farHand','braidTail','torso','sourceShoulderPatch','nearSleeve','fixedNearCap','nearHand','faceCrown']:['legs','sleeves','torso','caps','braidTail','hands','faceCrown']}};
}

function drawCapOverlays(context,sleeveCanvases,targets){for(const side of ['left','right']){const shoulder=targets[side].shoulder;context.save();context.beginPath();context.arc(shoulder.x,shoulder.y,24,0,Math.PI*2);context.clip();context.drawImage(sleeveCanvases[side],0,0);context.restore();}}
function drawProfileSocketCap(context,loaded,view,side,shoulder,bodyBob){const canvas=createCanvas(160,320),rest=GRAY_RIG_V1.restingCuffs[view][side],target={shoulder,cuff:{x:rest.x,y:rest.y+bodyBob}};mappedSleeve(canvas.getContext('2d'),loaded,view,side,target,.42);context.save();context.beginPath();context.arc(shoulder.x,shoulder.y,21,0,Math.PI*2);context.clip();context.drawImage(canvas,0,0);context.restore();}

function mapActionPoint(point){return{x:80+(point.x-GREEN_ACTION_RIG_V1.sourceActionFrame.axisX)*V8_CALIBRATION.projectionScale.x,y:287-(GREEN_ACTION_RIG_V1.sourceActionFrame.floorY-point.y)*V8_CALIBRATION.projectionScale.y};}
function actionLegJoints(joints){const soleY=(joints.heel.y+joints.toe.y)/2;return{hip:mapActionPoint(joints.hip),knee:mapActionPoint(joints.knee),ankle:mapActionPoint(joints.ankle),soleContact:mapActionPoint({x:joints.ankle.x,y:soleY})};}
export function grayStarJumpPose(index){return greenStarJumpPose(index);}
export function renderGrayStarJump(loaded,pose){
  if(pose.phaseId==='08'){const ready=renderGrayV1(loaded,grayStandingPose('south'));return{canvas:ready.canvas,metadata:{...ready.metadata,action:'starJump',stage:pose.stage,exactStandingEndpoint:true}};}
  const canvas=createCanvas(160,320),context=canvas.getContext('2d'),legs={};for(const side of ['left','right']){legs[side]=drawLeg(context,loaded,'south',side,actionLegJoints(pose.geometry.joints[side]));}
  const targets={},sleeves={},hands={},sleeveCanvases={},handCanvases={};for(const side of ['left','right']){const shoulderBase=GRAY_RIG_V1.shoulders.south[side],shoulder={x:shoulderBase.x,y:shoulderBase.y+pose.bodyBob},source=pose.geometry.joints[side],project=p=>({x:shoulder.x+(p.x-source.shoulder.x)*GREEN_ACTION_RIG_V1.armProjection.x,y:shoulder.y+(p.y-source.shoulder.y)*GREEN_ACTION_RIG_V1.armProjection.y}),target={shoulder,cuff:project(source.wrist)};targets[side]=target;const sc=createCanvas(160,320),hc=createCanvas(160,320);sleeves[side]=mappedSleeve(sc.getContext('2d'),loaded,'south',side,target);hands[side]=drawHand(hc.getContext('2d'),loaded,'south',side,target);sleeveCanvases[side]=sc;handCanvases[side]=hc;context.drawImage(sc,0,0);}
  const torso=drawTorso(context,loaded,'south',pose.bodyBob);drawCapOverlays(context,sleeveCanvases,targets);const tail=drawIdentity(context,loaded,'south',pose.bodyBob,'tail');context.drawImage(handCanvases.left,0,0);context.drawImage(handCanvases.right,0,0);const face=drawIdentity(context,loaded,'south',pose.bodyBob,'face');
  return{canvas,metadata:{action:'starJump',phaseId:pose.phaseId,index:pose.index,stage:pose.stage,bodyBob:pose.bodyBob,legs,arms:Object.fromEntries(['left','right'].map(side=>[side,{target:targets[side],sleeve:sleeves[side],hand:hands[side]}])),torso,identity:{face,tail},bounds:alphaBounds(canvas),exactStandingEndpoint:false}};
}

function actionLimbTransform(source,targetStart,targetEnd,acrossScale){
  const sdx=source.hand.x-source.shoulder.x,sdy=source.hand.y-source.shoulder.y,sl=Math.hypot(sdx,sdy),tdx=targetEnd.x-targetStart.x,tdy=targetEnd.y-targetStart.y,tl=Math.hypot(tdx,tdy);
  const sa={x:sdx/sl,y:sdy/sl},sx={x:-sa.y,y:sa.x},ta={x:tdx/tl,y:tdy/tl},tx={x:-ta.y,y:ta.x},alongScale=tl/sl;
  const matrix={a:ta.x*alongScale*sa.x+tx.x*acrossScale*sx.x,b:ta.y*alongScale*sa.x+tx.y*acrossScale*sx.x,c:ta.x*alongScale*sa.y+tx.x*acrossScale*sx.y,d:ta.y*alongScale*sa.y+tx.y*acrossScale*sx.y,alongScale,acrossScale};
  matrix.e=targetStart.x-matrix.a*source.shoulder.x-matrix.c*source.shoulder.y;matrix.f=targetStart.y-matrix.b*source.shoulder.x-matrix.d*source.shoulder.y;return matrix;
}
function drawActionLimb(context,loaded,rect,source,targetStart,targetEnd,acrossScale){const matrix=actionLimbTransform(source,targetStart,targetEnd,acrossScale);context.save();context.setTransform(matrix.a,matrix.b,matrix.c,matrix.d,matrix.e,matrix.f);context.drawImage(loaded.actionPlate,rect.x,rect.y,rect.width,rect.height,rect.x,rect.y,rect.width,rect.height);context.restore();return{sourceRect:rect,sourceAnchors:source,shoulder:targetStart,hand:targetEnd,matrix,alongScale:matrix.alongScale,acrossScale:matrix.acrossScale};}
function drawSeatedLower(context,loaded,view){const rect=loaded.provenance.actionAtlas.parts.sitting[view].lowerBody,scale=GRAY_ACTION_RIG_V1.sitting.lowerScale[view],x=80-rect.width*scale/2+GRAY_ACTION_RIG_V1.sitting.lowerOffsetX[view],y=288-rect.height*scale;context.drawImage(loaded.actionPlate,rect.x,rect.y,rect.width,rect.height,x,y,rect.width*scale,rect.height*scale);return{x,y,scale,sourceRect:rect,bottom:y+rect.height*scale};}
function drawSeatedTorso(context,loaded,view){const rect=loaded.provenance.seatedTorsoAtlas.parts[view],scale=GRAY_ACTION_RIG_V1.sitting.torsoScale[view],top=GRAY_RIG_V1.torso.topY[view]+GRAY_ACTION_RIG_V1.sitting.bodyDrop,x=80-rect.width*scale/2,y=top;context.drawImage(loaded.seatedTorsoPlate,rect.x,rect.y,rect.width,rect.height,x,y,rect.width*scale,rect.height*scale);return{x,y,top,bottom:y+rect.height*scale,scale,sourceRect:rect};}
function seatedShoulder(view,side){const base=GRAY_RIG_V1.shoulders[view][side];return{x:base.x,y:base.y+GRAY_ACTION_RIG_V1.sitting.bodyDrop};}
export function renderGraySeated(loaded,view){
  if(!GRAY_VIEWS.includes(view))throw new Error(`unsupported gray seated view ${view}`);const canvas=createCanvas(160,320),context=canvas.getContext('2d'),lowerBody=drawSeatedLower(context,loaded,view),parts=loaded.provenance.actionAtlas.parts.sitting[view],armCanvases={},arms={};
  for(const side of ['left','right']){const c=createCanvas(160,320),start=seatedShoulder(view,side),end=GRAY_ACTION_RIG_V1.sitting.handTargets[view][side];arms[side]=drawActionLimb(c.getContext('2d'),loaded,parts[`${side}Arm`],loaded.actionAnchors.sitting[view][side],start,end,GRAY_ACTION_RIG_V1.sitting.armAcrossScale[view]);armCanvases[side]=c;}
  let torso,tail,face;if(view==='east'||view==='west'){const near=view==='east'?'right':'left',far=near==='left'?'right':'left';context.drawImage(armCanvases[far],0,0);tail=drawIdentity(context,loaded,view,16,'tail');torso=drawSeatedTorso(context,loaded,view);context.drawImage(armCanvases[near],0,0);drawCapOverlays(context,armCanvases,Object.fromEntries(['left','right'].map(side=>[side,{shoulder:arms[side].shoulder}])));}else if(view==='north'){context.drawImage(armCanvases.left,0,0);context.drawImage(armCanvases.right,0,0);torso=drawSeatedTorso(context,loaded,view);drawCapOverlays(context,armCanvases,Object.fromEntries(['left','right'].map(side=>[side,{shoulder:arms[side].shoulder}])));tail=drawIdentity(context,loaded,view,16,'tail');}else{torso=drawSeatedTorso(context,loaded,view);tail=drawIdentity(context,loaded,view,16,'tail');context.drawImage(armCanvases.left,0,0);context.drawImage(armCanvases.right,0,0);}
  face=drawIdentity(context,loaded,view,16,'face');return{canvas,metadata:{action:'sit',view,bodyDrop:16,waistY:lowerBody.y,seatY:GRAY_ACTION_RIG_V1.sitting.seatY,floorY:287,lowerBody,arms,torso,identity:{face,tail},bounds:alphaBounds(canvas)}};
}

function drawClipboard(context,board){context.fillStyle='#4a3524';context.fillRect(board.x-2,board.y-2,board.width+4,board.height+4);context.fillStyle='#9b6b3d';context.fillRect(board.x,board.y,board.width,board.height);context.fillStyle='#eee4cf';context.fillRect(board.x+4,board.y+4,board.width-8,board.height-8);context.fillStyle='#5a5c5d';context.fillRect(board.x+board.width/2-6,board.y+1,12,5);return board;}
export function renderGrayClipboard(loaded){const canvas=createCanvas(160,320),context=canvas.getContext('2d'),legsStand=renderGrayV1(loaded,grayStandingPose('south')),base=legsStand.metadata;for(const side of ['left','right'])drawLeg(context,loaded,'south',side,base.mappedGeometry.joints[side]);const torso=drawTorso(context,loaded,'south',0),tail=drawIdentity(context,loaded,'south',0,'tail'),face=drawIdentity(context,loaded,'south',0,'face'),board=drawClipboard(context,GRAY_ACTION_RIG_V1.clipboard.board),arms={};for(const side of ['left','right']){const rect=loaded.provenance.actionAtlas.parts.clipboard[`${side}Arm`],start=GRAY_RIG_V1.shoulders.south[side],end=GRAY_ACTION_RIG_V1.clipboard.handTargets[side];arms[side]=drawActionLimb(context,loaded,rect,loaded.actionAnchors.clipboard[side],start,end,GRAY_ACTION_RIG_V1.clipboard.armAcrossScale[side]);}return{canvas,metadata:{action:'clipboard',view:'south',legs:base.legs,torso,identity:{face,tail},board,arms,bounds:alphaBounds(canvas),floorY:287}};}
