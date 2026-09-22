import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo=resolve(import.meta.dirname,'../../..'),root=resolve(repo,'artifacts/character-movement/layered-pilot');
const manifest=JSON.parse(readFileSync(resolve(root,'green-south-standing-manifest.json'),'utf8'));
const sha=path=>createHash('sha256').update(readFileSync(path)).digest('hex');
if(sha(resolve(repo,manifest.immutableSource.path))!==manifest.immutableSource.sha256)throw new Error('immutable Green source changed');
if(sha(resolve(repo,manifest.generatedPartsAtlas.originalPath))!==manifest.generatedPartsAtlas.originalSha256)throw new Error('original generated atlas changed');
if(sha(resolve(repo,manifest.generatedPartsAtlas.transparentPath))!==manifest.generatedPartsAtlas.transparentSha256)throw new Error('transparent atlas changed');
const pixels=async path=>{const image=await loadImage(path),canvas=createCanvas(image.width,image.height),context=canvas.getContext('2d');context.drawImage(image,0,0);return{width:image.width,height:image.height,data:context.getImageData(0,0,image.width,image.height).data};};
const original=await pixels(resolve(repo,manifest.generatedPartsAtlas.originalPath)),transparent=await pixels(resolve(repo,manifest.generatedPartsAtlas.transparentPath));
if(original.width!==transparent.width||original.height!==transparent.height)throw new Error('transparent atlas dimensions changed');
let removed=0,retained=0,retainedRgbExact=0,partial=0;for(let index=0;index<transparent.data.length;index+=4){const alpha=transparent.data[index+3];if(!alpha){removed+=1;continue;}if(alpha!==255)partial+=1;retained+=1;if(transparent.data[index]===original.data[index]&&transparent.data[index+1]===original.data[index+1]&&transparent.data[index+2]===original.data[index+2])retainedRgbExact+=1;}
if(!removed||partial||retainedRgbExact!==retained)throw new Error('background removal changed retained RGB or produced unexpected alpha');
if(removed!==manifest.generatedPartsAtlas.alpha.removed||retained!==manifest.generatedPartsAtlas.alpha.retained)throw new Error('manifest alpha counts differ from decoded atlas');
if(manifest.generatedPartsAtlas.alpha.retainedBrightNeutral<1000)throw new Error('enclosed light details were not demonstrably preserved');
const expectedParts=['head','torso','sleeveLeft','sleeveRight','handLeft','handRight','thighLeft','thighRight','shinLeft','shinRight','shoeLeft','shoeRight'];
if(Object.hasOwn(manifest.parts,'wholePants')||manifest.standing.placements.some(item=>item.id==='wholePants'))throw new Error('whole pants are prohibited from extraction and assembly');
if(manifest.standing.placements.length!==expectedParts.length||!expectedParts.every(id=>manifest.parts[id]&&manifest.standing.placements.some(item=>item.id===id)))throw new Error('standing part set is incomplete');
const head=manifest.standing.placements.find(item=>item.id==='head'),sourceHead=manifest.parts.head.extractedBounds;
if(Math.abs(head.width/head.height-(sourceHead.width+4)/(sourceHead.height+4))>.000001)throw new Error('head was non-uniformly scaled');
for(const[id,part]of Object.entries(manifest.parts)){const image=await pixels(resolve(root,part.output));let visible=0,transparentCount=0;for(let index=3;index<image.data.length;index+=4)image.data[index]?visible+=1:transparentCount+=1;if(visible!==part.alpha.visible||transparentCount!==part.alpha.transparent||!visible||!transparentCount)throw new Error(`${id} component alpha mismatch`);for(let x=0;x<image.width;x+=1)if(image.data[x*4+3]||image.data[((image.height-1)*image.width+x)*4+3])throw new Error(`${id} touches vertical extraction edge`);for(let y=0;y<image.height;y+=1)if(image.data[(y*image.width)*4+3]||image.data[(y*image.width+image.width-1)*4+3])throw new Error(`${id} touches horizontal extraction edge`);}
const native=manifest.standing.nativeCanvas;for(const placement of manifest.standing.placements){if(![placement.x,placement.y,placement.width,placement.height,placement.pivot.x,placement.pivot.y].every(Number.isFinite))throw new Error(`${placement.id} has non-finite placement data`);if(placement.x<0||placement.y<0||placement.x+placement.width>native.width||placement.y+placement.height>native.height)throw new Error(`${placement.id} exceeds standing canvas`);if(placement.pivot.x<placement.x||placement.pivot.x>placement.x+placement.width||placement.pivot.y<placement.y||placement.pivot.y>placement.y+placement.height)throw new Error(`${placement.id} pivot is outside its bounds`);}
const standing=await pixels(resolve(root,'green-south-standing-assembled-native.png'));let left=standing.width,top=standing.height,right=-1,bottom=-1;for(let y=0;y<standing.height;y+=1)for(let x=0;x<standing.width;x+=1)if(standing.data[(y*standing.width+x)*4+3]){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}
if(top<37||top>41||bottom<283||bottom>289||right-left+1>112)throw new Error(`assembled silhouette misses source landmarks: ${left},${top}..${right},${bottom}`);
for(const name of manifest.proofs){const image=await loadImage(resolve(root,name));if(!image.width||!image.height)throw new Error(`missing proof ${name}`);}
console.log(JSON.stringify({immutableInputs:'PASS',atlasAlpha:{removed,retained,partial},retainedRgbExact,protectedBrightNeutral:manifest.generatedPartsAtlas.alpha.retainedBrightNeutral,parts:expectedParts.length,rigidHeadAspect:'PASS',silhouetteBounds:{left,top,right,bottom,width:right-left+1,height:bottom-top+1},proofOutputs:manifest.proofs.length},null,2));
