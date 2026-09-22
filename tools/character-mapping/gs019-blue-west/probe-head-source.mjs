import { createCanvas, loadImage } from '@napi-rs/canvas';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const repo=path.resolve(import.meta.dirname,'../../..'),source=await loadImage(path.join(repo,'tools/character-mapping/layered-pilot/blue-glasses-v1/assets/head-west-original-v1.png'));
const out=path.join(repo,'artifacts/character-movement/gs019-blue-west/whole-body-candidate-v4/proofs');mkdirSync(out,{recursive:true});
const proof=createCanvas(800,920),x=proof.getContext('2d');for(let y=0;y<920;y+=16)for(let px=0;px<800;px+=16){x.fillStyle=((px/16+y/16)&1)?'#d8d8d8':'#f4f4f4';x.fillRect(px,y,16,16)}x.imageSmoothingEnabled=false;x.drawImage(source,35,35,100,115,0,0,800,920);writeFileSync(path.join(out,'original-head-crop-8x.png'),proof.toBuffer('image/png'));
const canvas=createCanvas(160,320),cx=canvas.getContext('2d');cx.drawImage(source,0,0);const data=cx.getImageData(0,0,160,320).data;const rows=[];for(let y=115;y<=150;y++){let min=160,max=-1,blue=0,skin=0,dark=0;for(let px=0;px<160;px++){const i=(y*160+px)*4,r=data[i],g=data[i+1],b=data[i+2],a=data[i+3];if(a<24)continue;min=Math.min(min,px);max=Math.max(max,px);if(b>r+7&&g>r+4)blue++;else if(r>g&&g>b&&r>90)skin++;else dark++;}if(max>=0)rows.push({y,min,max,blue,skin,dark});}console.log(JSON.stringify(rows,null,2));
