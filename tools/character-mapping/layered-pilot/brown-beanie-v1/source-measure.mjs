import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../../..');
const originalPath = 'Photos for Codex 2/Patients or Staff or Other Characters/exec-092d31ac-7592-4634-8883-167ddac564df.png';
const file = resolve(repo, originalPath);
const image = await loadImage(file);
const canvas = createCanvas(image.width, image.height);
const ctx = canvas.getContext('2d');
ctx.drawImage(image, 0, 0);
const data = ctx.getImageData(0, 0, image.width, image.height).data;
const sources = {south:[50,20,240,310],east:[300,20,240,310],west:[550,20,240,310],north:[800,20,240,310]};
const neutral = (i) => {
  const r=data[i],g=data[i+1],b=data[i+2],lo=Math.min(r,g,b),hi=Math.max(r,g,b);
  return lo>=218 && hi-lo<=14;
};
const rows = {};
for (const [view,[left,top,width,height]] of Object.entries(sources)) {
  rows[view] = {};
  for (const y of [53,70,100,120,130,140,150,160,170,190,205,220,240,265,285,307]) {
    const hits=[];
    for(let x=0;x<width;x++) {
      const i=((top+y)*image.width+left+x)*4;
      if(data[i+3]>=24 && !neutral(i)) hits.push(x);
    }
    if(hits.length) rows[view][y]={left:hits[0],right:hits.at(-1),width:hits.at(-1)-hits[0]+1,center:(hits[0]+hits.at(-1))/2};
  }
}
const proof=createCanvas(4*240*2,4*310*2),p=proof.getContext('2d');
p.fillStyle='#e9e2d6';p.fillRect(0,0,proof.width,proof.height);
for (const [j,[view,rect]] of Object.entries(sources).entries()) {
  const ox=j%2*960,oy=Math.floor(j/2)*1240;
  p.imageSmoothingEnabled=false;
  p.drawImage(image,...rect,ox,oy,960,1240);
  p.strokeStyle='rgba(0,255,255,.55)';p.lineWidth=2;
  for(let y=0;y<=310;y+=10){p.beginPath();p.moveTo(ox,oy+y*4);p.lineTo(ox+960,oy+y*4);p.stroke();}
  for(let x=0;x<=240;x+=10){p.beginPath();p.moveTo(ox+x*4,oy);p.lineTo(ox+x*4,oy+1240);p.stroke();}
  p.fillStyle='#101820';p.fillRect(ox,oy,250,35);p.fillStyle='#fff';p.font='bold 26px sans-serif';p.fillText(view,ox+8,oy+27);
}
const out=resolve(repo,'artifacts/character-movement/brown-beanie-v1');mkdirSync(out,{recursive:true});
writeFileSync(resolve(out,'source-measure-grid-4x.png'),proof.toBuffer('image/png'));
const report={original:{path:originalPath,sha256:createHash('sha256').update(readFileSync(file)).digest('hex'),dimensions:[image.width,image.height]},crops:sources,rows};
writeFileSync(resolve(out,'source-measurements.json'),`${JSON.stringify(report,null,2)}\n`);
console.log(JSON.stringify(report));
