// Review-only extraction with the immutable accepted normalizer.
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createCanvas} from '@napi-rs/canvas';
import {extractEight,loadCanvas,normalizeCells,SLOTS,measure} from '../gs026-employee-expansion-v1/pipeline.mjs';
import {root,target} from './build-roster.mjs';
const folder=resolve(root,'review/manager/018-revision-preview');mkdirSync(folder,{recursive:true});
const extraction=extractEight(await loadCanvas(resolve(root,'sources/018/source.png'))),frames=normalizeCells(extraction.cells,target);
for(const [i,slot]of SLOTS.entries())writeFileSync(resolve(folder,slot.pose+'-'+slot.direction+'.png'),frames[i].canvas.toBuffer('image/png'));
for(const [name,color]of [['full-light','#eee9df'],['full-dark','#20252b']]){
  const c=createCanvas(640,640),x=c.getContext('2d');x.fillStyle=color;x.fillRect(0,0,640,640);x.imageSmoothingEnabled=false;
  for(const [i,f]of frames.entries())x.drawImage(f.canvas,i%4*160,Math.floor(i/4)*320);
  writeFileSync(resolve(folder,name+'.png'),c.toBuffer('image/png'));
}
const c=createCanvas(1280,640),x=c.getContext('2d');x.fillStyle='#20252b';x.fillRect(0,0,1280,640);x.imageSmoothingEnabled=false;
for(let i=0;i<4;i++){x.drawImage(frames[i+4].canvas,i*320,0,320,640);for(let y=0;y<=320;y+=5){x.strokeStyle=y%10?'rgba(255,45,85,.12)':'rgba(255,45,85,.4)';x.beginPath();x.moveTo(i*320,y*2);x.lineTo(i*320+320,y*2);x.stroke();x.fillStyle='#f5c47a';x.font='12px sans-serif';if(y%10===0)x.fillText(String(y),i*320+2,y*2+12);}}
writeFileSync(resolve(folder,'seated-contact-grid.png'),c.toBuffer('image/png'));
console.log(JSON.stringify({status:'PASS',previewPoses:8,target,componentCount:extraction.componentCount,visibleBounds:frames.map(f=>measure(f.canvas).visibleBounds)}));

