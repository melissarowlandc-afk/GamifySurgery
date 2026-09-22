import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const sources = {
  cardigan: { path: 'artifacts/character-movement/reauthored-batch-02/sources/cardigan-rig-ready-v1.png', sha256: '6677af56d923aff57744909d3086593f2770fed0e94f275abcd05450e672bffb', width: 1536, height: 1024 },
  braid: { path: 'artifacts/character-movement/reauthored-batch-02/sources/braid-rig-ready-v1.png', sha256: 'c5b30e68c6708f7376c75fedcb24cd384619b96388df5649bb365c5d0493bd9b', width: 1536, height: 1024 },
};
const originals = {
  cardigan: { path: 'Photos for Codex 2/Patients or Staff or Other Characters/exec-0b03b9bb-45a8-4d1a-a785-7654d39c0478.png', sha256: 'fa38e9e41e85bd96b85338b6c747c580ae68cdd9af48e9f16cf49478d3c4fd63' },
  braid: { path: 'Photos for Codex 2/Patients or Staff or Other Characters/exec-16c48adf-2478-4b2a-b0e3-9ce1f2bfc2cb.png', sha256: '1368999e0dbd28c250fd41c2a5ab97bcb8905de71862e4cdbfc3d75a6b4b62e4' },
};
const cropX = { south: 50, east: 300, west: 550, north: 800 };
const heads = {
  cardigan: {
    south: { polygon: [[64,45],[142,45],[146,120],[127,123],[118,121],[90,121],[80,123],[62,120]], sourceHip: { x: 104, y: 218 } },
    east: { polygon: [[78,46],[151,46],[156,72],[156,116],[146,122],[126,123],[118,121],[98,123],[87,121],[77,116]], sourceHip: { x: 111, y: 218 } },
    west: { polygon: [[54,46],[131,46],[134,122],[124,129],[113,132],[84,132],[73,129],[54,122]], sourceHip: { x: 99, y: 218 } },
    north: { polygon: [[39,46],[115,46],[116,123],[106,129],[104,132],[50,132],[48,129],[39,123]], sourceHip: { x: 77, y: 218 } },
  },
  braid: {
    south: { polygon: [[82,35],[124,35],[138,40],[146,52],[147,111],[140,119],[126,124],[82,124],[64,118],[62,58],[69,43]], hairPolygons: [
      [[115,103],[143,103],[143,162],[115,162]],
    ], sourceHip: { x: 101, y: 220 } },
    east: { polygon: [[84,34],[136,34],[147,41],[153,55],[150,111],[143,118],[128,124],[108,124],[95,121],[88,116],[72,108],[69,65],[76,48]], pixelExclusions: [{ x: 96, y: 39, width: 24, height: 3, reason: 'detached source guide run above authentic crown' }], hairPolygons: [
      [[64,100],[94,100],[94,195],[64,195]],
    ], sourceHip: { x: 107, y: 220 } },
    west: { polygon: [[54,34],[101,34],[114,40],[121,54],[120,113],[112,118],[102,124],[83,124],[65,121],[55,116],[40,111],[38,62],[45,46]], pixelExclusions: [{ x: 70, y: 39, width: 24, height: 3, reason: 'detached source guide run above authentic crown' }], hairPolygons: [
      [[96,100],[124,100],[124,195],[96,195]],
    ], sourceHip: { x: 82, y: 220 } },
    north: { polygon: [[51,34],[94,34],[108,40],[115,52],[115,112],[108,118],[96,123],[49,123],[38,118],[31,113],[29,60],[38,44]], pixelExclusions: [{ x: 63, y: 39, width: 19, height: 3, reason: 'detached source guide run above authentic crown' }], hairPolygons: [
      [[63,103],[91,103],[91,211],[63,211]],
    ], sourceHip: { x: 73, y: 220 } },
  },
};
const measured = {
  cardigan: {
    south: { body: [361,112,105,103,414,215,.84,.95], leftArm: [627,56,56,172,655,62,655,125,655,195,655,225], rightArm: [853,57,57,171,881,63,881,125,881,195,881,225], leftLeg: [1080,90,70,147,1115,96,1115,150,1115,205,1115,235], rightLeg: [1342,90,71,147,1377,96,1377,150,1377,205,1377,235] },
    east: { body: [368,354,89,100,412,454,.76,.98], leftArm: [627,304,52,157,653,310,653,365,653,432,653,459], rightArm: [856,304,52,157,882,310,882,365,882,432,882,459], leftLeg: [1087,322,75,146,1124,328,1124,380,1124,432,1124,466], rightLeg: [1342,322,87,146,1385,328,1385,380,1385,432,1385,466] },
    north: { body: [357,608,108,84,411,692,.84,1.05], leftArm: [628,537,51,154,653,543,653,596,653,665,653,689], rightArm: [856,538,52,153,882,544,882,596,882,665,882,689], leftLeg: [1092,561,55,131,1119,567,1119,615,1119,656,1119,690], rightLeg: [1342,561,54,131,1369,567,1369,615,1369,656,1369,690] },
    west: { body: [368,850,88,80,412,930,.76,1.10], leftArm: [640,777,52,157,666,783,666,837,666,905,666,932], rightArm: [843,777,53,157,869,783,869,837,869,905,869,932], leftLeg: [1066,795,82,143,1107,801,1107,852,1107,900,1107,936], rightLeg: [1319,795,82,143,1360,801,1360,852,1360,900,1360,936] },
  },
  braid: {
    south: { body: [370,143,109,113,424,256,.78,.95], leftArm: [638,121,40,141,658,127,658,171,658,225,658,261], rightArm: [850,121,39,141,869,127,869,171,869,225,869,261], leftLeg: [1069,126,79,152,1112,132,1112,186,1112,246,1112,277], rightLeg: [1340,126,77,152,1375,132,1375,186,1375,246,1375,277] },
    east: { body: [374,384,96,120,422,504,.74,.92], leftArm: [633,350,39,141,652,356,652,401,652,460,652,489], rightArm: [855,351,39,140,874,357,874,401,874,460,874,489], leftLeg: [1091,355,77,153,1129,361,1129,410,1129,463,1129,507], rightLeg: [1340,355,79,153,1379,361,1379,410,1379,463,1379,507] },
    north: { body: [370,625,107,109,423,734,.78,.95], leftArm: [626,583,41,135,646,589,646,633,646,690,646,716], rightArm: [859,584,41,134,879,590,879,633,879,690,879,716], leftLeg: [1088,595,58,148,1117,601,1117,651,1117,702,1117,741], rightLeg: [1340,594,58,149,1369,600,1369,651,1369,702,1369,741] },
    west: { body: [374,861,97,112,423,973,.74,.94], leftArm: [626,804,42,142,647,810,647,856,647,916,647,944], rightArm: [856,804,43,142,877,810,877,856,877,916,877,944], leftLeg: [1066,817,80,158,1106,823,1106,875,1106,927,1106,973], rightLeg: [1340,817,81,158,1380,823,1380,875,1380,927,1380,973] },
  },
};

const limb = (values, scale, isLeg = false, meshCellSize = 6) => { const [x,y,width,height,px,py,jx,jy,tx,ty,ex,ey] = values; return { bounds: { x,y,width,height }, normalizationScale: scale, ...(isLeg ? { surfacePolicy: 'complete-single-surface' } : {}), rig: { proximal: { x:px,y:py }, joint: { x:jx,y:jy }, terminal: { x:tx,y:ty }, end: { x:ex,y:ey } }, mesh: { cellSize: meshCellSize, alphaThreshold: 0, trimTransparentCells: true }, skinning: isLeg ? { jointBlendPixels: [40,0], terminalTransition: { before: 50, after: 0 } } : { jointBlendPixels: [12,10], terminalTransition: { before: 8, after: 3 } } }; };
const bodyEnvelope = (key, direction) => {
  const frontal = direction === 'south' || direction === 'north';
  if (key === 'cardigan') return frontal ? [[0,.80],[.18,.96],[.46,1],[.78,.98],[1,.92]] : [[0,.84],[.20,.97],[.52,1],[1,.94]];
  return frontal ? [[0,.78],[.20,.95],[.50,1],[.80,.98],[1,.93]] : [[0,.83],[.22,.96],[.55,1],[1,.94]];
};
const body = (values, key, direction) => { const [x,y,width,height,ax,ay,scaleX,scaleY] = values; return { bounds: { x,y,width,height }, anchor: { x:ax,y:ay }, calibration: { scaleX, scaleY, widthEnvelope: bodyEnvelope(key, direction), basis: 'approved original per-view tapered torso envelope' } }; };
const document = { schemaVersion: 1, characters: {} };
for (const [id, key] of [['patient.adult.046','cardigan'],['retained.gray-braid','braid']]) {
  const views = {};
  for (const direction of ['south','east','north','west']) {
    const item = measured[key][direction], head = heads[key][direction], armScale = key === 'cardigan' ? .60 : .68, legScale = key === 'cardigan' ? .48 : .48;
    const sourceOrientationByPart = { leftArm: direction === 'south' ? 'mirror-x-local' : 'authored', rightArm: direction === 'south' ? 'mirror-x-local' : 'authored', leftLeg: 'authored', rightLeg: key === 'braid' && direction === 'west' ? 'mirror-x-local' : 'authored' };
    views[direction] = { status: 'measured', source: sources[key], identityHead: { source: originals[key], crop: { x: cropX[direction], y: 20, width: 240, height: 310 }, ...(head.hairPolygons ? { polygon: head.polygon, pixelExclusions: head.pixelExclusions ?? [], hairPolygons: head.hairPolygons, hairSelection: { minimumCoreLuma: 80, maximumCoreChannelRange: 35, requireRedAtLeastBlue: true, largestCoreComponentOnly: false, outlineGrowthPixels: 3 } } : { polygon: head.polygon }), sourceHip: head.sourceHip, registration: 'approved original head plus separately selected neutral-gray braid pixels; original garment excluded' }, targetFrame: { width:240,height:310 }, targetRegistration: { headOffsetY: key === 'cardigan' ? (direction === 'south' ? 0 : direction === 'west' || direction === 'north' ? 1 : -1) : 0, bodyAnchor: { x:112,y:key === 'cardigan' ? 220 : 212 }, headBodyMinOverlapRows: 2, sourceOrientationByPart, armSourceOrientationBySide: { left:sourceOrientationByPart.leftArm,right:sourceOrientationByPart.rightArm }, ...(direction === 'east' ? { armShoulderTargetX:{left:107,right:103},armChainOffsetY:3 } : direction === 'west' ? { armShoulderTargetX:{left:121,right:117},armChainOffsetY:3 } : { armChainInsetPixels:8,walkingShoulderHeightAboveHip:key === 'cardigan'?75:86 }), ...(direction === 'south' ? { neutralNearArmBehindBody:true } : {}) }, parts: { body: body(item.body,key,direction), leftArm:limb(item.leftArm,armScale), rightArm:limb(item.rightArm,armScale), leftLeg:limb(item.leftLeg,legScale,true,key === 'braid' ? 3 : 6), rightLeg:limb(item.rightLeg,legScale,true,key === 'braid' ? 3 : 6) } };
  }
  document.characters[id] = { id, views };
}
writeFileSync(resolve(import.meta.dirname, 'source-profiles.json'), JSON.stringify(document, null, 2) + '\n');
