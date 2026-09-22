import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo=resolve(import.meta.dirname,'../../../..');
const source='tools/character-mapping/layered-pilot/brown-beanie-v1/assets/upper-generated-v1.png';
const file=resolve(repo,source),image=await loadImage(file),canvas=createCanvas(image.width,image.height),ctx=canvas.getContext('2d');
ctx.drawImage(image,0,0);const data=ctx.getImageData(0,0,image.width,image.height).data;
const regions={south:[20,260],east:[285,530],west:[560,800],north:[830,1090]};
const rowRegions={upper1:[300,560],upper2:[560,800],fore1:[810,1080],fore2:[1080,1350]};
function alpha(x,y){return data[(y*image.width+x)*4+3]>=24;}
function bounds(r){let left=image.width,top=image.height,right=-1,bottom=-1;for(let y=r.y;y<r.y+r.height;y++)for(let x=r.x;x<r.x+r.width;x++)if(alpha(x,y)){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}return right<0?null:{x:left,y:top,width:right-left+1,height:bottom-top+1};}
function band(b,y){let left=null,right=null,count=0,tan=0;for(let x=b.x;x<b.x+b.width;x++)if(alpha(x,y)){left??=x;right=x;count++;const i=(y*image.width+x)*4,r=data[i],g=data[i+1],bl=data[i+2];if(r>150&&g>105&&r>g*1.12&&g>bl*1.15)tan++;}return{left,right,center:left==null?null:(left+right)/2,count,tan};}
const records={};
for(const[view,[left,right]]of Object.entries(regions))for(const[row,[top,bottom]]of Object.entries(rowRegions)){
  const b=bounds({x:left,y:top,width:right-left,height:bottom-top});
  if(!b)continue;records[`${view}.${row}`]={bounds:b,bands:Object.fromEntries([b.y+3,b.y+10,b.y+25,Math.round(b.y+b.height*.45),Math.round(b.y+b.height*.7),b.y+b.height-30,b.y+b.height-15,b.y+b.height-4].filter(y=>y>=b.y&&y<b.y+b.height).map(y=>[y,band(b,y)]))};
}
const output={source,sha256:createHash('sha256').update(readFileSync(file)).digest('hex'),dimensions:[image.width,image.height],records};
writeFileSync(resolve(repo,'artifacts/character-movement/brown-beanie-v1/upper-source-measurements.json'),`${JSON.stringify(output,null,2)}\n`);
console.log(JSON.stringify(output));
