import { createCanvas, loadImage } from '@napi-rs/canvas';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const repo=resolve(import.meta.dirname,'../../../..'),out=resolve(repo,'artifacts/character-movement/brown-beanie-v1/correction-review');
const source=await loadImage(resolve(repo,'Photos for Codex 2/Patients or Staff or Other Characters/exec-092d31ac-7592-4634-8883-167ddac564df.png'));
const views={south:{origin:[50,20],roi:[62,105,88,50]},east:{origin:[300,20],roi:[64,105,90,50]},west:{origin:[550,20],roi:[39,105,90,50]},north:{origin:[800,20],roi:[25,105,80,43]}};
const sheet=createCanvas(4*360,4*200),context=sheet.getContext('2d');context.imageSmoothingEnabled=false;
const stats={};
for(const[row,[view,cfg]]of Object.entries(views).entries()){
  const mask=await loadImage(resolve(import.meta.dirname,`assets/head-${view}-original-v1.png`));
  const [originX,originY]=cfg.origin,[x,y,w,h]=cfg.roi;
  context.fillStyle='#ded8ce';context.fillRect(0,row*200,sheet.width,200);
  context.fillStyle='#20242a';context.fillRect(0,row*200,sheet.width,22);
  context.fillStyle='#fff';context.font='bold 14px sans-serif';context.fillText(`${view} original / extracted head 4x`,8,row*200+15);
  context.drawImage(source,originX+x,originY+y,w,h,0,row*200+22,w*4,h*4);
  context.drawImage(mask,x,y,w,h,360,row*200+22,w*4,h*4);
  const originalCanvas=createCanvas(240,310),oc=originalCanvas.getContext('2d');oc.drawImage(source,originX,originY,240,310,0,0,240,310);
  const maskCanvas=createCanvas(240,310),mc=maskCanvas.getContext('2d');mc.drawImage(mask,0,0);
  const od=oc.getImageData(0,0,240,310).data,md=mc.getImageData(0,0,240,310).data;
  let retained=0,missingDark=0,missingWarm=0;
  for(let py=y;py<y+h;py++)for(let px=x;px<x+w;px++){
    const i=(py*240+px)*4,r=od[i],g=od[i+1],b=od[i+2],neutral=Math.min(r,g,b)>=218&&Math.max(r,g,b)-Math.min(r,g,b)<=14;
    if(neutral)continue;
    if(md[i+3]>200)retained++;else if(r>g*1.12&&g>b*1.08)missingWarm++;else missingDark++;
  }
  stats[view]={roi:cfg.roi,retained,missingWarm,missingDark};
}
writeFileSync(resolve(out,'chin-source-vs-headmask-4x.png'),sheet.toBuffer('image/png'));
writeFileSync(resolve(out,'chin-source-vs-headmask.json'),`${JSON.stringify(stats,null,2)}\n`);
console.log(JSON.stringify(stats));
