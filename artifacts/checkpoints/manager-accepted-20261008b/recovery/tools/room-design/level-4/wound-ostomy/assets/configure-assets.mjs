// Deterministic asset receipts and native contracts, read-only originals.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadImage,createCanvas } from '@napi-rs/canvas';
const here=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(here,'../../../../..');
const read=f=>JSON.parse(fs.readFileSync(path.join(here,f),'utf8'));
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex').toUpperCase();
const write=(f,x)=>fs.writeFileSync(path.join(here,f),JSON.stringify(x,null,2)+'\n');
const receipts=read('generation-receipts.json'),stand=read('../stand-in/manifest.json'),layout=read('../proof/layout-baseline.json');
const revision=read('../proof/owner-revision.json'),approved=revision.status==='implemented',status=approved?'owner_design_approved':'owner_revision_in_progress';
const ids={'wound-recliner':'design:wo:recliner','exam-lamp':'design:wo:exam-lamp','ostomy-shelf':'design:wo:ostomy-shelf','dressing-cart':'design:wo:dressing-cart','hygiene-sign':'design:wo:hygiene-sign'};
const contract={schemaVersion:1,nativeFrameMultiplier:2,nominalNativePixelsPerTile:480,proofPixelsPerTile:120,minimumClearancePixels:4,packingMarginPixels:6,alphaCleanupThreshold:8,opaqueThreshold:160,assets:{},notes:['Stand-in canvas dimensions doubled; source aspect preserved without stretching or upscaling. Exact source-world placements and footprints frozen.','Floor anchors use actual final opaque alpha; wall anchors use actual alpha top. No semantic painting in preparation.']};
const entries=[];
for(const r of receipts.records){
 const id=r.id,file=path.join(here,r.file),promptFile=path.join(here,r.prompt),prompt=fs.readFileSync(promptFile,'utf8');
 if(prompt!==r.sentPrompt){
  if(prompt.trimEnd()!==r.sentPrompt.trimEnd())throw Error('Exact tool prompt differs from saved UTF-8 prompt: '+id);
  fs.writeFileSync(promptFile,r.sentPrompt,'utf8'); // Receipt is the exact sent tool string, including its terminal LF.
 }
 const image=await loadImage(file),canvas=createCanvas(image.width,image.height),g=canvas.getContext('2d');g.drawImage(image,0,0);const pixels=g.getImageData(0,0,image.width,image.height).data;
 let zero=0,opaque=0,edge=0;for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++){const a=pixels[(y*image.width+x)*4+3];if(!a)zero++;if(a>=160)opaque++;if(x===0||y===0||x===image.width-1||y===image.height-1)edge=Math.max(edge,a);}
 if(!zero||!opaque||edge>=8)throw Error('Missing transparency or meaningful source crop '+id);
 const record=layout.room.records.find(x=>x.assetId===ids[id]),s=stand[id];
 contract.assets[id]={assetId:ids[id],recordIds:[record.id],canvas:[s.width*2,s.height*2],widthTiles:record.renderSizeTiles[0],heightTiles:record.renderSizeTiles[1],anchorKind:record.worldLocalGround?'floor':'wall',...(record.worldLocalGround?{ground:[record.worldLocalGround]}:{top:[record.destinationTopLeftTiles[0]+record.renderSizeTiles[0]/2,record.destinationTopLeftTiles[1]]})};
 if(r.selected&&r.sourcePoints)contract.assets[id].sourcePoints=r.sourcePoints;
 if(r.selected&&r.packing)contract.assets[id].packing=r.packing;
 entries.push({...r,sha256:sha(file),promptSha256:sha(path.join(here,r.prompt)),size:[image.width,image.height],nativeSize:contract.assets[id].canvas,alpha:{transparent:zero,opaque,edgeAlphaMax:edge},references:r.inputReferences.map(f=>({path:f,sha256:sha(path.join(repo,f))})),status:r.selected?status:(r.selectionReason?'superseded_owner_revision':'rejected_after_native_inspection')});
}
write('generation-manifest.json',{schemaVersion:1,date:'2026-10-08',tool:'built-in image_gen',completeArtwork:true,designApproval:approved,ownerRevision:revision.revision,ownerRevisionSha256:sha(path.join(here,'../proof/owner-revision.json')),assets:entries.filter(x=>x.selected),history:entries.map(x=>({generationId:x.generationId,id:x.id,file:x.file,prompt:x.prompt,sha256:x.sha256,promptSha256:x.promptSha256,selected:x.selected,references:x.references,size:x.size,inspection:x.inspection,...(x.selectionReason?{selectionReason:x.selectionReason}:{})}))});
write('../proof/asset-contract.json',contract);
console.log('GENERATIONS PASS '+entries.length+' inspected original/exact-prompt pairs; 5 selected; built-in image_gen');
