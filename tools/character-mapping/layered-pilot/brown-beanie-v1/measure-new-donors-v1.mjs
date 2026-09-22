import { createCanvas, loadImage } from '@napi-rs/canvas';
import { resolve } from 'node:path';
const paths=['upper-broader-v3.png','clipboard-broader-v2.png'];
for(const path of paths){
 const img=await loadImage(resolve(import.meta.dirname,'assets',path)),c=createCanvas(img.width,img.height),x=c.getContext('2d');x.drawImage(img,0,0);const d=x.getImageData(0,0,c.width,c.height).data;
 const cells=path.startsWith('upper')?Array.from({length:4},(_,row)=>Array.from({length:4},(_,col)=>({label:`${row+1}/${col+1}`,box:[col*280,row*275+275,(col+1)*280,(row+1)*275+275]}))).flat():[{label:'right',box:[380,200,850,700]},{label:'left',box:[900,200,1400,700]}];
 console.log(path,img.width,img.height);
 for(const cell of cells){let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,n=0;const [x0,y0,x1,y1]=cell.box;for(let yy=y0;yy<Math.min(y1,img.height);yy++)for(let xx=x0;xx<Math.min(x1,img.width);xx++)if(d[(yy*img.width+xx)*4+3]>=200){minX=Math.min(minX,xx);maxX=Math.max(maxX,xx);minY=Math.min(minY,yy);maxY=Math.max(maxY,yy);n++;}console.log(cell.label,[minX,minY,maxX,maxY],n);}
}
