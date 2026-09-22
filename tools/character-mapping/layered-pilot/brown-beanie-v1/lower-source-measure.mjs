import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
const repo=resolve(import.meta.dirname,'../../../..'),source='tools/character-mapping/layered-pilot/brown-beanie-v1/assets/lower-generated-v4.png',file=resolve(repo,source),image=await loadImage(file),c=createCanvas(image.width,image.height),x=c.getContext('2d');x.drawImage(image,0,0);const d=x.getImageData(0,0,image.width,image.height).data;
const columns={south:[35,220],east:[285,475],west:[540,730],north:[790,990]},rows={thigh1:[20,310],thigh2:[320,595],shin1:[600,805],shin2:[810,1035],shoe1:[1040,1230],shoe2:[1235,1470]};
const visible=(q,r)=>d[(r*image.width+q)*4+3]>=24;
function bounds([left,right],[top,bottom]){let l=image.width,t=image.height,r=-1,b=-1;for(let y=top;y<bottom;y++)for(let q=left;q<right;q++)if(visible(q,y)){l=Math.min(l,q);t=Math.min(t,y);r=Math.max(r,q);b=Math.max(b,y);}return r<0?null:{x:l,y:t,width:r-l+1,height:b-t+1};}
const records={};for(const[view,range]of Object.entries(columns))for(const[row,b]of Object.entries(rows))records[`${view}.${row}`]=bounds(range,b);
const result={source,sha256:createHash('sha256').update(readFileSync(file)).digest('hex'),dimensions:[image.width,image.height],records};writeFileSync(resolve(repo,'artifacts/character-movement/brown-beanie-v1/lower-source-measurements.json'),`${JSON.stringify(result,null,2)}\n`);console.log(JSON.stringify(result));
