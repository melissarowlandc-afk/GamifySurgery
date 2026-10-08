// Technical extraction only: copies approved chair pixels; never paints source art.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCanvas, loadImage, ImageData } from '@napi-rs/canvas';
import { sha } from './image-utils.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(here,'../../../../..');
const source='apps/player/public/art/rooms/gs015-v1/waiting/south.webp';
const sourceSha256='5BFA9F8B69241FC69C7F3B30B87F6DF9C2F00D980D0E215E7E320CE48357F0D8';
if(sha(path.join(repo,source))!==sourceSha256)throw Error('Approved chair atlas changed');
const image=await loadImage(path.join(repo,source)),out=path.join(here,'derived');fs.mkdirSync(out,{recursive:true});
const westPolygons=[[[38,200],[38,177],[51,167],[277,166],[291,172],[290,195],[263,196],[77,193],[63,211]],[[31,197],[65,198],[57,285],[51,362],[29,362]],[[264,191],[289,183],[300,362],[278,362],[265,208]],[[55,282],[271,282],[276,302],[52,302]]];
const contains=(x,y,p)=>{let hit=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;};
const entries={};
for(const [direction,rect]of [['west',[8,748,315,369]],['east',[8,372,315,368]]]){
  const canvas=createCanvas(rect[2],rect[3]),g=canvas.getContext('2d');g.drawImage(image,...rect,0,0,rect[2],rect[3]);
  const original=g.getImageData(0,0,...rect.slice(2)),pixels=new Uint8ClampedArray(original.data.length);
  // Mask geometry mirrors for the opposite facing; actual east source pixels
  // come from the distinct approved EAST crop, never a flipped west image.
  const polygons=direction==='west'?westPolygons:westPolygons.map(p=>p.map(([x,y])=>[315-x,y]));let keptPixels=0;
  for(let y=0;y<rect[3];y++)for(let x=0;x<rect[2];x++)if(polygons.some(p=>contains(x+.5,y+.5,p))){const i=(y*rect[2]+x)*4;
    // Exclude cool cushion slivers inside the conservative polygon edges.
    // This selects warm original wood/outline pixels without changing RGBA.
    if(original.data[i]<=original.data[i+1]+2||original.data[i+1]<original.data[i+2]+2)continue;
    pixels.set(original.data.subarray(i,i+4),i);if(pixels[i+3])keptPixels++;
  }
  g.putImageData(new ImageData(pixels,...rect.slice(2)),0,0);const file=`armchair-${direction}-front.png`;fs.writeFileSync(path.join(out,file),canvas.toBuffer('image/png'));
  entries[direction]={file,source,sourceSha256,sourceRect:rect,canvas:rect.slice(2),polygons,woodSelection:'Inside polygons: original R > G+2 and G >= B+2; excludes cool blue cushion slivers. Selected RGBA copied unchanged.',keptPixels,sha256:sha(path.join(out,file)),method:'Pixel-preserving extraction of front wooden armrest, two posts and seat rail; no resampling, painting or source mutation.'};
}
fs.writeFileSync(path.join(out,'occluder-manifest.json'),JSON.stringify({schemaVersion:1,revision:2,derived:true,generator:'deterministic extraction of approved pixels',entries},null,2)+'\n');
console.log('OCCLUDERS PASS east/west front wood extracted from approved atlas; original unchanged');
