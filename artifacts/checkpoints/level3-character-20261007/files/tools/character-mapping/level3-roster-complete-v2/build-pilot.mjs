import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { isAbsolute, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCanvas, extractEight, normalizeCells, measure, SLOTS, sha256 } from '../gs026-employee-expansion-v1/pipeline.mjs';
import { createCanvas } from '@napi-rs/canvas';
const tool=resolve(fileURLToPath(new URL('.',import.meta.url))),repo=resolve(tool,'../../..'),config=JSON.parse(readFileSync(resolve(tool,'roster.json'),'utf8')),referenceContract=JSON.parse(readFileSync(resolve(tool,'reference-contract.json'),'utf8')),root=resolve(repo,'artifacts/character-statics/level3-roster-complete-v2'),sourceRoot=resolve(root,'sources');
const id=config.identities.find(x=>x.number==='001'),dir=resolve(sourceRoot,'001'),files={png:resolve(dir,'source.png'),prompt:resolve(dir,'exact-prompt.txt'),args:resolve(dir,'tool-args.json'),provenance:resolve(dir,'provenance.json')};
if(!Object.values(files).every(existsSync))throw Error('pilot source incomplete: artist must provide source.png plus exact-prompt.txt, tool-args.json, provenance.json');
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const prompt=readFileSync(files.prompt,'utf8');
const toolArgs=JSON.parse(readFileSync(files.args,'utf8'));
const sourceProvenance=JSON.parse(readFileSync(files.provenance,'utf8'));
assert.equal(toolArgs.prompt,prompt,'tool-args.prompt must exactly equal exact-prompt.txt');
assert.equal(toolArgs.transparent_background,true,'tool-args.transparent_background must be true');
assert.equal(sourceProvenance.nativeOutput?.sha256,hash(files.png),'provenance nativeOutput.sha256 must bind source.png');
assert(typeof sourceProvenance.nativeOutput?.path==='string'&&sourceProvenance.nativeOutput.path.length>0,'provenance nativeOutput.path missing');
assert(existsSync(sourceProvenance.nativeOutput.path),'provenance nativeOutput.path must be readable for byte verification');
assert.equal(hash(sourceProvenance.nativeOutput.path),hash(files.png),'source.png must be byte-identical to provenance nativeOutput.path');
assert(Array.isArray(sourceProvenance.references) && sourceProvenance.references.length > 0, 'provenance references missing');
assert.deepEqual(
  toolArgs.referenced_image_paths,
  sourceProvenance.references.map(reference => reference.path),
  'tool-args.referenced_image_paths must exactly match provenance reference paths'
);
const localPath = value => isAbsolute(value) ? value : resolve(repo, value);
for (const reference of sourceProvenance.references) {
  assert(typeof reference.path === 'string' && typeof reference.sha256 === 'string', 'provenance reference needs path and sha256');
  const evidencePath = localPath(reference.preservedCopyPath ?? reference.path);
  assert(existsSync(evidencePath), `reference evidence unavailable: ${evidencePath}`);
  assert.equal(hash(evidencePath), reference.sha256, `reference hash mismatch: ${reference.path}`);
}
for (const reference of referenceContract.references) {
  const file = resolve(repo, reference.path);
  assert(existsSync(file), `pinned reference unavailable: ${reference.path}`);
  assert.equal(hash(file), reference.sha256, `pinned reference hash mismatch: ${reference.path}`);
}
const sheet=await loadCanvas(files.png),sourceMeasure=measure(sheet),raw=sheet.getContext('2d').getImageData(0,0,sheet.width,sheet.height).data;
assert(raw.some((value,index)=>index%4===3&&value===0),'source must retain genuine alpha-zero transparency');
const target=config.targets[id.targetKey],extraction=extractEight(sheet),frames=normalizeCells(extraction.cells,target),out=resolve(root,'pilot','001');
for(const [index,frame] of frames.entries())assert.equal(measure(frame.canvas).borderPixels,0,`derived pose ${index} has strong-alpha clipping`);
mkdirSync(out,{recursive:true});
const poses={stand:{},sit:{}};for(let i=0;i<8;i++){const slot=SLOTS[i],file=resolve(out,`${slot.pose}-${slot.direction}.png`),bytes=frames[i].canvas.toBuffer('image/png');writeFileSync(file,bytes);poses[slot.pose][slot.direction]={file:relative(repo,file).replaceAll('\\','/'),sha256:sha256(bytes),visibleBounds:measure(frames[i].canvas).visibleBounds,transform:frames[i].transform,anchors:{bodyAxisX:80,floorY:287,...(slot.pose==='sit'?{seatContactY:null,seatContactStatus:'provisional-pending-parent-authorship-and-visual-review'}:{})}};}
const writeProof=(name,canvas)=>{const file=resolve(out,name),bytes=canvas.toBuffer('image/png');writeFileSync(file,bytes);return{file:relative(repo,file).replaceAll('\\','/'),sha256:sha256(bytes)}};const poseProof=theme=>{const canvas=createCanvas(640,640),context=canvas.getContext('2d');context.imageSmoothingEnabled=false;if(theme){context.fillStyle=theme==='dark'?'#20252b':'#eee9df';context.fillRect(0,0,640,640)}frames.forEach((frame,index)=>context.drawImage(frame.canvas,(index%4)*160,Math.floor(index/4)*320,160,320));return writeProof(`full-poses-${theme??'transparent'}.png`,canvas)};const grid=createCanvas(1280,640),gridContext=grid.getContext('2d');gridContext.imageSmoothingEnabled=false;gridContext.fillStyle='#20252b';gridContext.fillRect(0,0,1280,640);for(let i=0;i<4;i++){const x=i*320;gridContext.drawImage(frames[i+4].canvas,x,0,320,640);gridContext.strokeStyle='#ff2d55';gridContext.lineWidth=1;for(let p=0;p<=320;p+=20){gridContext.beginPath();gridContext.moveTo(x+p,0);gridContext.lineTo(x+p,640);gridContext.stroke()}for(let p=0;p<=640;p+=20){gridContext.beginPath();gridContext.moveTo(x,p);gridContext.lineTo(x+320,p);gridContext.stroke()}}const proofs={fullTransparent:poseProof(null),fullLight:poseProof('light'),fullDark:poseProof('dark'),seatedContactGrid:writeProof('seated-contact-grid-2x.png',grid)};
const manifest={schemaVersion:'level3-roster-complete-v2-pilot/v1',status:'candidate-packaged-not-runtime-ready',identity:id,source:{png:{path:relative(repo,files.png).replaceAll('\\','/'),sha256:hash(files.png)},exactPrompt:{path:relative(repo,files.prompt).replaceAll('\\','/'),sha256:hash(files.prompt)},toolArguments:{path:relative(repo,files.args).replaceAll('\\','/'),sha256:hash(files.args)},provenance:{path:relative(repo,files.provenance).replaceAll('\\','/'),sha256:hash(files.provenance)}},extraction:{method:'immutable GS026 extractEight; alpha threshold 13 is analysis-only; native source PNG preserved unchanged',sourceRects:extraction.cells.map(x=>x.sourceRect)},normalization:{target,policy:'one identity-wide whole-body scale applied to complete extracted crops; derived pixels resampled without painting, alpha rewrite, mirroring, or cleanup; native PNG unchanged'},poses,proofs};writeFileSync(resolve(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({status:'PASS',identity:id.stableId,poses:8,runtimeReady:false}));
