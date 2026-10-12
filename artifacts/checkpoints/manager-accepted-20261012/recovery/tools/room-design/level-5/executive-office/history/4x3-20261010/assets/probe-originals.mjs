import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createCanvas,loadImage} from '@napi-rs/canvas';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),catalog=JSON.parse(fs.readFileSync(path.join(root,'assets/prompts/v2/catalog.json'))),report=[];
for(const e of catalog.entries){const im=await loadImage(path.join(root,e.original)),c=createCanvas(im.width,im.height),g=c.getContext('2d');g.drawImage(im,0,0);const d=g.getImageData(0,0,im.width,im.height).data;
 const bounds=t=>{let l=im.width,r=-1,top=im.height,b=-1;for(let y=0;y<im.height;y++)for(let x=0;x<im.width;x++)if(d[(y*im.width+x)*4+3]>=t){l=Math.min(l,x);r=Math.max(r,x);top=Math.min(top,y);b=Math.max(b,y);}return {left:l,right:r,top,bottom:b,width:r-l+1,height:b-top+1};};
 report.push({id:e.id,size:[im.width,im.height],alpha8:bounds(8),opaque160:bounds(160)});
}
fs.writeFileSync(path.join(root,'assets/original-probe.json'),JSON.stringify({method:'Native alpha bounds of untouched generated originals',assets:report},null,2)+'\n');console.log(JSON.stringify(report,null,2));
