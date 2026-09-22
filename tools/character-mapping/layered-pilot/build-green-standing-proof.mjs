import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..');
const sourcePath = resolve(repo, 'Photos for Codex 2/Patients or Staff or Other Characters/exec-0b03b9bb-45a8-4d1a-a785-7654d39c0478.png');
const atlasV1Path = resolve(import.meta.dirname, 'assets/green-south-parts-atlas-v1.png');
const atlasV3Path = resolve(import.meta.dirname, 'assets/green-south-parts-atlas-v3-transparent.png');
const output = resolve(repo, 'artifacts/character-movement/layered-pilot');
const partsOutput = resolve(output, 'green-south-parts-v3');
const sourceHash = 'fa38e9e41e85bd96b85338b6c747c580ae68cdd9af48e9f16cf49478d3c4fd63';
const atlasV1Hash = '22739b5d50fa0e08bb36e6df074612b9ec805d24788d277beee3c56d5afd22b3';
const partCells = {
  head: [340,105,270,280], torso: [640,125,310,310],
  sleeveLeft: [675,475,185,245], sleeveRight: [1025,475,185,245],
  handLeft: [75,755,185,195], handRight: [375,755,185,195],
  thighLeft: [675,715,200,255], thighRight: [1015,715,200,255],
  shinLeft: [75,945,185,260], shinRight: [375,945,185,260],
  shoeLeft: [665,1015,220,205], shoeRight: [1000,1015,220,205],
};
const ignoredAtlasCells = Object.freeze({ wholePants:[985,145,230,300], assembledReference:[50,30,245,440] });
const shaBytes = bytes => createHash('sha256').update(bytes).digest('hex');
const shaPath = path => shaBytes(readFileSync(path));
const png = (canvas,path) => writeFileSync(path,canvas.toBuffer('image/png'));
function assertHash(path,expected){if(shaPath(path)!==expected)throw new Error(`immutable input hash mismatch: ${path}`);}
function isBackground(r,g,b){return Math.max(r,g,b)-Math.min(r,g,b)<=30&&(r+g+b)/3>=155;}
function removeConnectedChecker(image){
  const canvas=createCanvas(image.width,image.height),context=canvas.getContext('2d');context.drawImage(image,0,0);
  const pixels=context.getImageData(0,0,canvas.width,canvas.height),{data}=pixels,count=canvas.width*canvas.height,exterior=new Uint8Array(count),queue=new Int32Array(count);let head=0,tail=0;
  const enqueue=(x,y)=>{const pixel=y*canvas.width+x,index=pixel*4;if(exterior[pixel]||!isBackground(data[index],data[index+1],data[index+2]))return;exterior[pixel]=1;queue[tail++]=pixel;};
  for(let x=0;x<canvas.width;x+=1){enqueue(x,0);enqueue(x,canvas.height-1);}for(let y=1;y<canvas.height-1;y+=1){enqueue(0,y);enqueue(canvas.width-1,y);}
  for(const [x,y,width,height] of [...Object.values(partCells),...Object.values(ignoredAtlasCells)]){for(let cellX=x;cellX<x+width;cellX+=1){enqueue(cellX,y);enqueue(cellX,y+height-1);}for(let cellY=y;cellY<y+height;cellY+=1){enqueue(x,cellY);enqueue(x+width-1,cellY);}}
  while(head<tail){const pixel=queue[head++],x=pixel%canvas.width,y=Math.floor(pixel/canvas.width);for(let dy=-1;dy<=1;dy+=1)for(let dx=-1;dx<=1;dx+=1){if((!dx&&!dy)||x+dx<0||x+dx>=canvas.width||y+dy<0||y+dy>=canvas.height)continue;enqueue(x+dx,y+dy);}}
  let removed=0,retained=0,retainedBrightNeutral=0;for(let pixel=0;pixel<count;pixel+=1){const index=pixel*4;if(exterior[pixel]){data[index+3]=0;removed+=1;}else{retained+=1;if(isBackground(data[index],data[index+1],data[index+2]))retainedBrightNeutral+=1;}}
  context.putImageData(pixels,0,0);return{canvas,counts:{total:count,removed,retained,retainedBrightNeutral,partial:0}};
}
function alphaBounds(data,width,height){let left=width,top=height,right=-1,bottom=-1;for(let y=0;y<height;y+=1)for(let x=0;x<width;x+=1){if(!data[(y*width+x)*4+3])continue;left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}return right<left?null:{x:left,y:top,width:right-left+1,height:bottom-top+1};}
function extractPart(image,sourceRect){
  const cell=createCanvas(sourceRect[2],sourceRect[3]),context=cell.getContext('2d');context.drawImage(image,...sourceRect,0,0,sourceRect[2],sourceRect[3]);
  const imageData=context.getImageData(0,0,cell.width,cell.height),bounds=alphaBounds(imageData.data,cell.width,cell.height);if(!bounds)throw new Error(`empty component cell ${sourceRect.join(',')}`);
  const canvas=createCanvas(bounds.width+4,bounds.height+4);canvas.getContext('2d').drawImage(cell,bounds.x,bounds.y,bounds.width,bounds.height,2,2,bounds.width,bounds.height);
  const outputData=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;let visible=0,transparent=0;for(let index=3;index<outputData.length;index+=4)outputData[index]?visible+=1:transparent+=1;
  return{canvas,sourceRect,bounds,alpha:{visible,transparent}};
}
function drawPart(context,record,placement){const width=record.canvas.width*placement.scale,height=record.canvas.height*placement.scale;context.drawImage(record.canvas,placement.x,placement.y,width,height);return{...placement,width,height,pivot:{x:placement.x+placement.pivot.x*placement.scale,y:placement.y+placement.pivot.y*placement.scale}};}
function backgroundProof(standing,color,label){const canvas=createCanvas(200,350),context=canvas.getContext('2d');context.fillStyle=color;context.fillRect(0,0,canvas.width,canvas.height);context.fillStyle=color==='#172026'?'#fff':'#20262b';context.font='bold 14px sans-serif';context.fillText(label,18,20);context.drawImage(standing,20,25);return canvas;}
function atlasBackgroundProof(atlas,color){const canvas=createCanvas(atlas.width,atlas.height),context=canvas.getContext('2d');context.fillStyle=color;context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(atlas,0,0);return canvas;}

assertHash(sourcePath,sourceHash);assertHash(atlasV1Path,atlasV1Hash);mkdirSync(partsOutput,{recursive:true});
const atlasV1=await loadImage(atlasV1Path),cleaned=removeConnectedChecker(atlasV1);png(cleaned.canvas,atlasV3Path);
const atlasV3Hash=shaPath(atlasV3Path),atlasV3=await loadImage(atlasV3Path),extracted=Object.fromEntries(Object.entries(partCells).map(([id,rect])=>[id,extractPart(atlasV3,rect)]));
for(const[id,record]of Object.entries(extracted))png(record.canvas,resolve(partsOutput,`${id}.png`));

// Match immutable South crop x=75,y=30: crown 39, shoulders 118, hem 207, floor 287.
const standing=createCanvas(160,320),context=standing.getContext('2d');
const placements=[
  {id:'thighLeft',x:48,y:198,scale:.225,pivot:{x:36,y:4}},{id:'thighRight',x:79,y:198,scale:.225,pivot:{x:36,y:4}},
  {id:'shinLeft',x:52,y:231,scale:.21,pivot:{x:31,y:3}},{id:'shinRight',x:82,y:231,scale:.21,pivot:{x:31,y:3}},
  {id:'shoeLeft',x:45,y:258,scale:.20,pivot:{x:48,y:15}},{id:'shoeRight',x:80,y:258,scale:.20,pivot:{x:48,y:15}},
  {id:'sleeveLeft',x:24,y:115,scale:.37,pivot:{x:47,y:5}},{id:'sleeveRight',x:94,y:115,scale:.37,pivot:{x:47,y:5}},
  {id:'handLeft',x:26,y:177,scale:.25,pivot:{x:45,y:4}},{id:'handRight',x:104,y:177,scale:.25,pivot:{x:45,y:4}},
  {id:'torso',x:33,y:110,scale:.39,pivot:{x:120,y:10}},{id:'head',x:41,y:39,scale:.325,pivot:{x:112,y:220}},
];
const placed=placements.map(placement=>drawPart(context,extracted[placement.id],placement));png(standing,resolve(output,'green-south-standing-assembled-native.png'));
const source=await loadImage(sourcePath),comparison=createCanvas(340,370),compare=comparison.getContext('2d');compare.fillStyle='#263039';compare.fillRect(0,0,comparison.width,comparison.height);compare.fillStyle='#fff';compare.font='bold 14px sans-serif';compare.fillText('Immutable source South',18,20);compare.fillText('Rigid layered assembly',188,20);compare.fillStyle='#f7f3e7';compare.fillRect(10,30,160,320);compare.fillRect(175,30,160,320);compare.drawImage(source,75,30,160,320,10,30,160,320);compare.drawImage(standing,175,30);png(comparison,resolve(output,'green-south-standing-source-vs-assembled.png'));
const enlarged=createCanvas(comparison.width*3,comparison.height*3),large=enlarged.getContext('2d');large.imageSmoothingEnabled=false;large.drawImage(comparison,0,0,enlarged.width,enlarged.height);png(enlarged,resolve(output,'green-south-standing-source-vs-assembled-3x-nearest.png'));
png(backgroundProof(standing,'#f7f3e7','Light background'),resolve(output,'green-south-standing-light.png'));png(backgroundProof(standing,'#172026','Dark background'),resolve(output,'green-south-standing-dark.png'));
png(atlasBackgroundProof(atlasV3,'#f7f3e7'),resolve(output,'green-south-parts-atlas-v3-light.png'));png(atlasBackgroundProof(atlasV3,'#172026'),resolve(output,'green-south-parts-atlas-v3-dark.png'));
const columns=2,cellWidth=88,cellHeight=82,inventoryRows=Math.ceil(Object.keys(extracted).length/columns),overlay=createCanvas(520,Math.max(370,35+inventoryRows*cellHeight)),rig=overlay.getContext('2d');rig.fillStyle='#263039';rig.fillRect(0,0,overlay.width,overlay.height);rig.fillStyle='#f7f3e7';rig.fillRect(200,30,160,320);rig.drawImage(standing,200,30);rig.font='12px sans-serif';rig.fillStyle='#fff';rig.fillText('Exploded component inventory',10,20);rig.fillText('Assembly bounds and pivots',200,20);
Object.entries(extracted).forEach(([id,record],index)=>{const x=8+(index%columns)*cellWidth,y=34+Math.floor(index/columns)*cellHeight,scale=Math.min(60/record.canvas.width,52/record.canvas.height);rig.drawImage(record.canvas,x,y,record.canvas.width*scale,record.canvas.height*scale);rig.fillStyle='#fff';rig.fillText(id,x,y+66);});for(const entry of placed){rig.strokeStyle='#59c6d2';rig.strokeRect(200+entry.x,30+entry.y,entry.width,entry.height);rig.fillStyle='#ffce54';rig.fillRect(198+entry.pivot.x,28+entry.pivot.y,4,4);}png(overlay,resolve(output,'green-south-standing-exploded-rig-overlay.png'));
const manifest={schemaVersion:3,character:'patient.adult.046',view:'south',immutableSource:{path:'Photos for Codex 2/Patients or Staff or Other Characters/exec-0b03b9bb-45a8-4d1a-a785-7654d39c0478.png',sha256:sourceHash},generatedPartsAtlas:{originalPath:'tools/character-mapping/layered-pilot/assets/green-south-parts-atlas-v1.png',originalSha256:atlasV1Hash,transparentPath:'tools/character-mapping/layered-pilot/assets/green-south-parts-atlas-v3-transparent.png',transparentSha256:atlasV3Hash,method:'8-connected flood seeded from atlas exterior and declared cell borders; neutral range <=30; mean RGB >=155; alpha-only removal',alpha:cleaned.counts},ignoredAtlasCells,landmarks:{crownY:39,shouldersY:118,hemY:207,floorY:287,coordinateOrigin:'original South crop x=75,y=30'},parts:Object.fromEntries(Object.entries(extracted).map(([id,record])=>[id,{sourceRect:record.sourceRect,extractedBounds:record.bounds,alpha:record.alpha,output:`green-south-parts-v3/${id}.png`}])),standing:{nativeCanvas:{width:160,height:320},placements:placed},proofs:['green-south-standing-source-vs-assembled.png','green-south-standing-source-vs-assembled-3x-nearest.png','green-south-standing-light.png','green-south-standing-dark.png','green-south-parts-atlas-v3-light.png','green-south-parts-atlas-v3-dark.png','green-south-standing-exploded-rig-overlay.png'],limitations:['Generated layered head and sleeve drawing differ from the immutable source; separate thigh and shin drawings retain a visible standing knee seam; visual acceptance remains pending.']};
writeFileSync(resolve(output,'green-south-standing-manifest.json'),`${JSON.stringify(manifest,null,2)}\n`);console.log(JSON.stringify({sourceHash,atlasV1Hash,atlasV3Hash,alpha:cleaned.counts,parts:Object.keys(extracted),placements:placed.length,output},null,2));
writeFileSync(resolve(import.meta.dirname,'assets/green-south-parts-atlas-v3-provenance.json'),`${JSON.stringify({schemaVersion:1,sourceAtlas:{path:manifest.generatedPartsAtlas.originalPath,sha256:atlasV1Hash},transparentAtlas:{path:manifest.generatedPartsAtlas.transparentPath,sha256:atlasV3Hash},method:manifest.generatedPartsAtlas.method,alpha:cleaned.counts,retainedRgb:'byte-identical where alpha is nonzero'},null,2)}\n`);
