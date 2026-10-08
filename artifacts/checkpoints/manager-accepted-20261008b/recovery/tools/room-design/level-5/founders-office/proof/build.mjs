import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {fixturePlacement} from './geometry.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.dirname(here),mode=process.argv.includes('--stand-in')?'stand-in':'painted';
const layout=JSON.parse(fs.readFileSync(path.join(root,'layout.json'))),room=structuredClone(layout.room),manifest=mode==='painted'?JSON.parse(fs.readFileSync(path.join(root,'assets/generation-manifest.json'))):null;
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');const save=(p,obj)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof obj==='string'?obj:JSON.stringify(obj,null,2)+'\n');};
function bounds(img,threshold=1){const {width:w,height:h}=img,rgba=img.data;let left=w,right=-1,top=h,bottom=-1,count=0,edge=0;for(let y=0;y<h;y++)for(let x=0;x<w;x++){const a=rgba[(y*w+x)*4+3];if(!x||!y||x===w-1||y===h-1)edge=Math.max(edge,a);if(a>=threshold){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);count++;}}if(!count)throw Error('Empty sprite');return{left,right,top,bottom,width:right-left+1,height:bottom-top+1,pixels:count,edgeAlphaMax:edge};}
async function decoded(p){const im=await loadImage(p),c=createCanvas(im.width,im.height),g=c.getContext('2d');g.drawImage(im,0,0);return{im,c,g,pixels:g.getImageData(0,0,c.width,c.height)};}
const assets={},metadata={schemaVersion:1,status:'candidate_needs_owner_review',approval:null,runtimeIntegrationAuthorized:false,mode,nominalNativePixelsPerTile:480,proofPixelsPerTile:120,assets:{}},contract={schemaVersion:1,mode,assets:{},aspectPreserved:true};
for(const p of layout.pieces){
 const entry=manifest?.assets.find(a=>a.id===p.asset),source=path.join(root,mode==='stand-in'?'stand-in/'+p.asset+'.png':entry?.original??'MISSING');
 if(!fs.existsSync(source))throw Error('Missing generated input '+p.asset);
 const {c,g,pixels}=await decoded(source);const originalBounds=bounds(pixels,8);let removed=0;for(let i=3;i<pixels.data.length;i+=4)if(pixels.data[i]>0&&pixels.data[i]<8){pixels.data[i]=0;removed++;}g.putImageData(pixels,0,0);
 const [w,h]=p.canvas,crop=[originalBounds.left,originalBounds.top,originalBounds.width,originalBounds.height],scale=Math.min((w-12)/crop[2],(h-12)/crop[3]);if(mode==='painted'&&scale>1)throw Error('Would upscale generated original '+p.asset);
 const out=createCanvas(w,h),og=out.getContext('2d'),dw=crop[2]*scale,dh=crop[3]*scale,dx=(w-dw)/2,dy=h-6-dh;og.imageSmoothingEnabled=true;og.imageSmoothingQuality='high';og.drawImage(c,...crop,dx,dy,dw,dh);
 const op=og.getImageData(0,0,w,h),ob=bounds(op,160),ab=bounds(op,1),anchor=p.ground?[w/2,ob.bottom+1]:[w/2,ab.top];
 const file=path.join(root,mode==='stand-in'?'stand-in/prepared/'+p.asset+'.png':'assets/processed/'+p.asset+'.png');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,out.toBuffer('image/png'));
 const m={id:p.asset,file:path.relative(here,file).replaceAll('\\','/'),canvas:p.canvas,anchorKind:p.ground?'floor':'wall',canvasAnchor:anchor,outputOpaqueBounds:ob,outputAllAlphaBounds:ab,source:path.relative(root,source).replaceAll('\\','/'),sourceSize:[c.width,c.height],sourceSha256:hash(source),sourceCrop:crop,transform:{scale,dx,dy,dw,dh},aspectPreserved:true,sourceUpscaled:false,alphaCleanup:{threshold:8,pixelsRemoved:removed},outputSha256:hash(file),prompt:entry?.prompt??null,promptSha256:entry?hash(path.join(root,entry.prompt)):null};
 if(entry?.sourcePoints){m.sourcePoints=entry.sourcePoints;m.calibratedPoints=Object.fromEntries(Object.entries(entry.sourcePoints).map(([k,[x,y]])=>[k,[dx+(x-crop[0])*scale,dy+(y-crop[1])*scale]]));if(m.calibratedPoints.worktop)m.measuredWorktopRisePixels=(anchor[1]-m.calibratedPoints.worktop[1])*120/480;}
 metadata.assets[p.asset]=m;assets['design:fo:'+p.asset]={src:m.file,size:p.canvas,prepared:true,preparedId:p.asset};contract.assets[p.asset]={canvas:p.canvas,renderSizeTiles:p.size,ground:p.ground??null,wallTop:p.top??null};
}
for(const[id,file,canvas,anchor]of [['founder-chair','founder-chair.webp',[412,465],[200,463]],['founder-chair-front','founder-chair-front.png',[412,465],[200,463]],['visitor-chair','visitor-chair.png',[315,369],null],['visitor-chair-front','visitor-chair-front.png',[315,369],null]]){
 const p=path.join(root,'assets/reused',file),d=await decoded(p),ob=bounds(d.pixels,160),ab=bounds(d.pixels),key='reuse:'+id;
 assets['design:reuse:'+id]={src:'../assets/reused/'+file,size:canvas,sourceRect:[0,0,...canvas],reusedApproved:true,preparedId:anchor?key:undefined,sha256:hash(p)};
 if(anchor)metadata.assets[key]={canvas,canvasAnchor:anchor,anchorKind:'floor',outputOpaqueBounds:ob,outputAllAlphaBounds:ab,outputSha256:hash(p)};
}
const navigation={...structuredClone(layout.navigation),privateProofRouteModel:structuredClone(layout.presentation)};
// Conservative actual opaque floor-contact bands supplement the declared footprints.
const data=JSON.parse(fs.readFileSync(path.join(here,'data.json')));data.previewBaseClearances=[];
for(const r of room.records.filter(r=>r.worldLocalGround&&!r.overlayFor&&r.depthPolicy!=='wall')){
 const spec=assets[r.assetId],m=metadata.assets[spec.preparedId],d=await decoded(path.resolve(here,spec.src)),ob=bounds(d.pixels,160),w=d.c.width,h=d.c.height;let left=w,right=-1,top=h,bottom=-1;
 for(let y=Math.max(0,ob.bottom-8);y<=ob.bottom;y++)for(let x=0;x<w;x++)if(d.pixels.data[(y*w+x)*4+3]>=160){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
 const placed=fixturePlacement(r,m,120),f={left:(placed.x+left*placed.w/w)/120,top:(placed.y+top*placed.h/h)/120,width:(right-left+1)*placed.w/w/120,height:(bottom-top+1)*placed.h/h/120};
 data.previewBaseClearances.push({id:r.id+':opaque-base',recordId:r.id,footprint:f,basis:'Actual decoded alpha >=160 in the final nine-row floor contact band.'});
}save(path.join(here,'data.json'),data);
save(path.join(here,'design-rooms.js'),'// Private proposed base office. Frozen prepaint layout: ../layout.json.\n'+Object.entries({DESIGN_ASSETS:assets,DESIGN_ROOMS:[room],DESIGN_NAVIGATION:{[room.definitionId]:navigation},PREPARED_METADATA:metadata,ASSET_CONTRACT:contract}).map(([k,v])=>'export const '+k+' = '+JSON.stringify(v)+';').join('\n')+'\n');
save(path.join(here,'asset-contract.json'),contract);save(path.join(root,mode==='stand-in'?'stand-in/prepared/metadata.json':'assets/processed/metadata.json'),metadata);
// Preserve the inherited renderer before attaching this room's shipped controls.
const renderer=fs.readFileSync(path.join(here,'lab.js'),'utf8').split('// Proof-only diagnostics, controls and review wording.')[0];save(path.join(here,'lab.js'),renderer+fs.readFileSync(path.join(here,'extension.js'),'utf8'));
save(path.join(here,'proof-manifest.json'),{schemaVersion:1,room:'founders-office',facilityLevel:5,footprint:[4,4],footprintStatus:'proposed_owner_review',mode,approval:null,runtimeIntegrationAuthorized:false,doorModel:layout.presentation.doorModel,layoutSha256:hash(path.join(root,'layout.json')),generationManifestSha256:manifest?hash(path.join(root,'assets/generation-manifest.json')):null,designRoomsSha256:hash(path.join(here,'design-rooms.js')),dataSha256:hash(path.join(here,'data.json')),reusedContractSha256:hash(path.join(root,'assets/reused/contract.json')),newAssets:layout.pieces.map(p=>p.asset),notes:['Base room only; no individual upgrade tier art or gameplay behavior.','Stand-ins preserved. Browser and owner acceptance are separate.']});
console.log('BUILD PASS: '+mode+'; four native aspect-preserving assets; four approved reused chair layers; 4x4 proposed base; 16 one-tile doors.');
