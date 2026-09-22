import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../../..');
const assets = resolve(import.meta.dirname, 'assets');
mkdirSync(assets, { recursive: true });
const sourceAtlas = 'artifacts/character-movement/reauthored-pilot/sources/gray-rig-ready-v1.png';
const originalFile = 'Photos for Codex 2/Patients or Staff or Other Characters/exec-33437146-564e-4cb1-a7e2-ad41504ea752.png';
const outputAtlas = 'overshirt-base-parts-v1-transparent.png';
const actionFile = 'overshirt-action-parts-v1.png';
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

export const SOURCE_CONFIG = {
  south: { crop: [50,20,240,310], sourceHipX:98, polygon:[[53,47],[145,47],[151,62],[151,131],[139,145],[132,151],[67,151],[59,143],[49,130],[49,62]] },
  east: { crop: [300,20,240,310], sourceHipX:112, polygon:[[48,42],[137,42],[151,56],[153,112],[143,129],[130,143],[76,143],[61,130],[50,112]] },
  west: { crop: [550,20,240,310], sourceHipX:94, polygon:[[50,47],[130,47],[133,61],[133,126],[124,139],[113,146],[76,146],[59,138],[50,124]] },
  north: { crop: [800,20,240,310], sourceHipX:77, polygon:[[27,46],[125,46],[128,61],[128,128],[117,142],[108,150],[46,150],[35,141],[27,127]] },
};

const PARTS = {
  south:{torso:{x:362,y:126,width:92,height:116},arms:{left:{x:637,y:91,width:46,height:146},right:{x:863,y:91,width:47,height:146}},legs:{left:{x:1094,y:91,width:61,height:149},right:{x:1336,y:91,width:59,height:149}}},
  east:{torso:{x:364,y:380,width:91,height:105},arms:{left:{x:638,y:323,width:48,height:146},right:{x:857,y:323,width:48,height:146}},legs:{left:{x:1094,y:326,width:81,height:145},right:{x:1336,y:326,width:84,height:145}}},
  west:{torso:{x:364,y:849,width:95,height:118},arms:{left:{x:637,y:799,width:48,height:146},right:{x:863,y:799,width:47,height:145}},legs:{left:{x:1067,y:805,width:88,height:148},right:{x:1312,y:805,width:87,height:148}}},
  north:{torso:{x:364,y:603,width:89,height:120},arms:{left:{x:638,y:569,width:48,height:145},right:{x:859,y:569,width:48,height:146}},legs:{left:{x:1091,y:570,width:63,height:150},right:{x:1338,y:570,width:62,height:150}}},
};

function isMatte(data,i){const r=data[i],g=data[i+1],b=data[i+2];return r>=145&&b>=135&&g<=125&&r+b-g*2>=190&&Math.abs(r-b)<=100;}
function isFringe(data,i){const r=data[i],g=data[i+1],b=data[i+2];return r>=40&&b>=40&&g<=80&&r+b-g*2>=80&&r>g*1.5&&b>g*1.5&&Math.abs(r-b)<=30;}
function clearMatte(canvas){const c=canvas.getContext('2d'),im=c.getImageData(0,0,canvas.width,canvas.height),n=canvas.width*canvas.height,seen=new Uint8Array(n),q=new Uint32Array(n);let a=0,z=0;const add=(x,y)=>{const p=y*canvas.width+x;if(!seen[p]&&isMatte(im.data,p*4)){seen[p]=1;q[z++]=p;}};for(let x=0;x<canvas.width;x++){add(x,0);add(x,canvas.height-1);}for(let y=1;y<canvas.height-1;y++){add(0,y);add(canvas.width-1,y);}while(a<z){const p=q[a++],x=p%canvas.width,y=Math.floor(p/canvas.width);for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++){if(!ox&&!oy)continue;const nx=x+ox,ny=y+oy;if(nx>=0&&ny>=0&&nx<canvas.width&&ny<canvas.height)add(nx,ny);}}let removed=0;for(let p=0;p<n;p++){const i=p*4;if(seen[p]||isMatte(im.data,i)||isFringe(im.data,i)){im.data[i]=im.data[i+1]=im.data[i+2]=im.data[i+3]=0;removed++;}}c.putImageData(im,0,0);return removed;}
function clearNeutral(canvas){const c=canvas.getContext('2d'),im=c.getImageData(0,0,canvas.width,canvas.height),n=canvas.width*canvas.height,seen=new Uint8Array(n),q=new Uint32Array(n);let a=0,z=0;const neutral=p=>{const i=p*4,r=im.data[i],g=im.data[i+1],b=im.data[i+2];return Math.min(r,g,b)>=218&&Math.max(r,g,b)-Math.min(r,g,b)<=14;},add=p=>{if(!seen[p]&&neutral(p)){seen[p]=1;q[z++]=p;}};for(let x=0;x<canvas.width;x++){add(x);add((canvas.height-1)*canvas.width+x);}for(let y=0;y<canvas.height;y++){add(y*canvas.width);add(y*canvas.width+canvas.width-1);}while(a<z){const p=q[a++],x=p%canvas.width,y=Math.floor(p/canvas.width);if(x)add(p-1);if(x+1<canvas.width)add(p+1);if(y)add(p-canvas.width);if(y+1<canvas.height)add(p+canvas.width);}for(let p=0;p<n;p++)if(seen[p])im.data[p*4+3]=0;c.putImageData(im,0,0);}
function clipPolygon(source,polygon){const c=createCanvas(source.width,source.height),x=c.getContext('2d');x.beginPath();polygon.forEach(([px,py],i)=>i?x.lineTo(px,py):x.moveTo(px,py));x.closePath();x.clip();x.drawImage(source,0,0);return c;}
function bounds(canvas){const d=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;let l=canvas.width,t=canvas.height,r=-1,b=-1;for(let i=0;i<d.length;i+=4)if(d[i+3]>=24){const p=i/4,x=p%canvas.width,y=Math.floor(p/canvas.width);l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);}if(r<0)throw new Error('empty layer');return{x:l,y:t,width:r-l+1,height:b-t+1};}

const atlasBytes=readFileSync(resolve(repo,sourceAtlas)),atlasImage=await loadImage(resolve(repo,sourceAtlas)),plate=createCanvas(atlasImage.width,atlasImage.height),pc=plate.getContext('2d');pc.drawImage(atlasImage,0,0);const removedMattePixels=clearMatte(plate),plateBytes=plate.toBuffer('image/png');writeFileSync(resolve(assets,outputAtlas),plateBytes);
const originalBytes=readFileSync(resolve(repo,originalFile)),original=await loadImage(resolve(repo,originalFile)),identity={};
for(const[view,cfg]of Object.entries(SOURCE_CONFIG)){const crop=createCanvas(240,310),cx=crop.getContext('2d');cx.drawImage(original,...cfg.crop,0,0,240,310);clearNeutral(crop);const head=clipPolygon(crop,cfg.polygon),bytes=head.toBuffer('image/png'),file=`overshirt-${view}-head-v1.png`;writeFileSync(resolve(assets,file),bytes);identity[view]={crop:cfg.crop,sourceHipX:cfg.sourceHipX,head:{file,sha256:sha256(bytes),bounds:bounds(head),polygon:cfg.polygon,exclusions:[]}};}
const actionBytes=readFileSync(resolve(assets,actionFile)),actionImage=await loadImage(resolve(assets,actionFile));
const actionParts={sitting:{south:{lowerBody:{x:81,y:105,width:168,height:208},rightArm:{x:143,y:399,width:105,height:193},leftArm:{x:114,y:674,width:108,height:199}},east:{lowerBody:{x:387,y:98,width:211,height:213},rightArm:{x:380,y:393,width:183,height:178},leftArm:{x:380,y:674,width:183,height:178}},west:{lowerBody:{x:678,y:98,width:214,height:213},rightArm:{x:717,y:393,width:186,height:177},leftArm:{x:717,y:674,width:186,height:178}},north:{lowerBody:{x:1044,y:101,width:167,height:212},rightArm:{x:1066,y:398,width:77,height:197},leftArm:{x:1055,y:680,width:89,height:203}}},clipboard:{rightArm:{x:1353,y:394,width:145,height:180},leftArm:{x:1380,y:681,width:144,height:164}}};
const provenance={schemaVersion:1,original:{path:originalFile,sha256:sha256(originalBytes),dimensions:[original.width,original.height]},baseAtlas:{source:{path:sourceAtlas,sha256:sha256(atlasBytes)},output:{file:outputAtlas,sha256:sha256(plateBytes)},dimensions:[plate.width,plate.height],removedMattePixels,retainedRgbPolicy:'every retained non-matte pixel keeps source RGB',parts:PARTS},actionAtlas:{source:{file:actionFile,sha256:sha256(actionBytes)},dimensions:[actionImage.width,actionImage.height],alphaPolicy:'original true alpha and RGB retained without keying',parts:actionParts},identity};
const provenanceBytes=Buffer.from(`${JSON.stringify(provenance,null,2)}\n`);writeFileSync(resolve(assets,'overshirt-assets-v1-provenance.json'),provenanceBytes);console.log(JSON.stringify({status:'PASS',provenanceSha256:sha256(provenanceBytes),removedMattePixels,identity:Object.fromEntries(Object.entries(identity).map(([v,x])=>[v,x.head.bounds]))},null,2));
