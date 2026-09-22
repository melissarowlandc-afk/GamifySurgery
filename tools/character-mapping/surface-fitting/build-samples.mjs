import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import { buildStandingGeometry, buildWalkGeometry } from '../canonical-master/canonical-geometry.mjs';
import { buildClipboardGeometry, buildJumpGeometry, buildSeatedGeometry } from '../canonical-actions/action-geometry.mjs';
import { COSTUMES } from './costumes.mjs';
import { renderSurfaceAction, renderSurfaceMaster } from './surface-renderer.mjs';

const out=resolve(import.meta.dirname,'../../../artifacts/character-movement/surface-fitting/samples');
mkdirSync(out,{recursive:true});
const walk=buildWalkGeometry(),jump=buildJumpGeometry();
const poses=[
  ['standing-south',()=>renderSurfaceMaster(buildStandingGeometry('south'))],
  ['walking-east-03',()=>renderSurfaceMaster(walk.east['03'])],
  ['walking-north-07',()=>renderSurfaceMaster(walk.north['07'])],
  ['sitting-south',()=>renderSurfaceAction(buildSeatedGeometry('south'))],
  ['sitting-east',()=>renderSurfaceAction(buildSeatedGeometry('east'))],
  ['jumping-south-04',()=>renderSurfaceAction(jump.south['04'])],
  ['jumping-west-04',()=>renderSurfaceAction(jump.west['04'])],
  ['clipboard-south',()=>renderSurfaceAction(buildClipboardGeometry('south'))],
  ['clipboard-north',()=>renderSurfaceAction(buildClipboardGeometry('north'))],
];
const records=[];
for(const costume of Object.values(COSTUMES))for(const[label,neutral]of poses){const isMaster=label.startsWith('standing')||label.startsWith('walking'),geometry=label==='standing-south'?buildStandingGeometry('south'):label==='walking-east-03'?walk.east['03']:label==='walking-north-07'?walk.north['07']:label==='sitting-south'?buildSeatedGeometry('south'):label==='sitting-east'?buildSeatedGeometry('east'):label==='jumping-south-04'?jump.south['04']:label==='jumping-west-04'?jump.west['04']:label==='clipboard-south'?buildClipboardGeometry('south'):buildClipboardGeometry('north'),canvas=isMaster?renderSurfaceMaster(geometry,costume):renderSurfaceAction(geometry,costume),bytes=canvas.toBuffer('image/png'),file=`${costume.id}-${label}.png`;writeFileSync(resolve(out,file),bytes);records.push({costume:costume.id,label,file,sha256:createHash('sha256').update(bytes).digest('hex'),canvas});}
const cellW=280,cellH=378,columns=poses.length,rows=Object.keys(COSTUMES).length,sheet=createCanvas(cellW*columns,cellH*rows),ctx=sheet.getContext('2d');ctx.fillStyle='#e8e3da';ctx.fillRect(0,0,sheet.width,sheet.height);ctx.font='bold 13px sans-serif';ctx.textBaseline='middle';for(const[index,record]of records.entries()){const col=index%columns,row=Math.floor(index/columns),x=col*cellW,y=row*cellH;ctx.fillStyle='#20262b';ctx.fillRect(x,y,cellW,28);ctx.fillStyle='#fff';ctx.fillText(`${record.costume} · ${record.label}`,x+7,y+14);ctx.drawImage(record.canvas,x+(cellW-record.canvas.width)/2,y+28);}
const sheetBytes=sheet.toBuffer('image/png');writeFileSync(resolve(out,'two-costume-pose-samples.png'),sheetBytes);writeFileSync(resolve(out,'manifest.json'),JSON.stringify({generatedBy:'tools/character-mapping/surface-fitting/build-samples.mjs',sheet:{file:'two-costume-pose-samples.png',sha256:createHash('sha256').update(sheetBytes).digest('hex')},records:records.map(({canvas,...record})=>record)},null,2)+'\n');console.log(JSON.stringify({output:out,records:records.length,sheet:'two-costume-pose-samples.png'},null,2));
