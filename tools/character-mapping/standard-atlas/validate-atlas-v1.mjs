import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { ANATOMICAL_SIDES, ATLAS_SCHEMA_VERSION, CELL_SIZE, DIRECTIONS, LAYER_ORDER, PAGE_DEFINITIONS, SLOT_DEFINITIONS, SLOT_PADDING, requiredSlotsForCapabilities, slotRect } from './schema-v1.mjs';
import { signedMarkerSide } from './rigid-geometry.mjs';

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const pointPaths = {
  upperArm:['joint.shoulder','joint.elbow','orientation.outerElbow'], forearmHand:['joint.elbow','hand.end','orientation.anterior'],
  thigh:['joint.hip','joint.knee','orientation.outer'], shin:['joint.knee','joint.ankle','orientation.outer'],
  seatedArm:['joint.shoulder','hand.contact','orientation.thumbTip'], clipboardArm:['joint.shoulder','hand.contact','orientation.thumbTip'],
};
function getPath(object,path){return path.split('.').reduce((value,key)=>value?.[key],object);}
function finitePoint(point,label,errors){if(!point||!Number.isFinite(point.x)||!Number.isFinite(point.y))errors.push(`${label} must be a finite {x,y} point.`);}
function localAlphaBounds(data,width,slot){let l=CELL_SIZE,t=CELL_SIZE,r=-1,b=-1,count=0;const rect=slotRect(slot.id);for(let y=0;y<CELL_SIZE;y++)for(let x=0;x<CELL_SIZE;x++){const a=data[((rect.y+y)*width+rect.x+x)*4+3];if(a>=24){l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);count++;}}return count?{x:l,y:t,width:r-l+1,height:b-t+1,count}:null;}
function alphaNear(data,width,slot,point,radius=6){const rect=slotRect(slot.id);for(let y=Math.max(0,Math.floor(point.y-radius));y<=Math.min(CELL_SIZE-1,Math.ceil(point.y+radius));y++)for(let x=Math.max(0,Math.floor(point.x-radius));x<=Math.min(CELL_SIZE-1,Math.ceil(point.x+radius));x++)if(data[((rect.y+y)*width+rect.x+x)*4+3]>=24)return true;return false;}
function orientationPaths(slot){const paths=pointPaths[slot.type];return paths?{start:paths[0],end:paths[1],marker:paths[2]}:null;}

export async function validateCharacterAtlasV1(manifest,{root='.',throwOnError=true}={}){
  const errors=[];
  if(manifest?.schemaVersion!==ATLAS_SCHEMA_VERSION)errors.push(`schemaVersion must be exactly "${ATLAS_SCHEMA_VERSION}".`);
  if(!manifest?.characterId||typeof manifest.characterId!=='string')errors.push('characterId must be a non-empty string.');
  const capabilitySlots=requiredSlotsForCapabilities(manifest?.capabilities);
  for(const id of capabilitySlots)if(!manifest?.parts?.[id])errors.push(`Missing required part "${id}"${SLOT_DEFINITIONS[id].optional?' for an enabled capability':''}.`);
  if(manifest?.capabilities?.sitting)for(const direction of DIRECTIONS)for(const row of ['seatedTorso','seatedArm.left','seatedArm.right']){const id=`actions.${direction}.${row}`;if(!manifest?.parts?.[id]){const fallback=manifest?.fallbacks?.[id];if(!fallback||!['base-slot','articulated-chain'].includes(fallback.kind)||!Array.isArray(fallback.slots)||fallback.slots.length===0)errors.push(`Missing seated override "${id}" requires an explicit base-slot or articulated-chain fallback.`);else for(const sourceId of fallback.slots)if(!manifest?.parts?.[sourceId])errors.push(`Fallback for "${id}" references missing part "${sourceId}".`);}}
  for(const id of Object.keys(manifest?.parts??{}))if(!SLOT_DEFINITIONS[id])errors.push(`Unknown part slot "${id}"; v1 slot IDs are immutable.`);
  const loadedPages={};
  for(const [pageId,definition] of Object.entries(PAGE_DEFINITIONS)){
    const pageRecord=manifest?.pages?.[pageId],needed=capabilitySlots.some(id=>SLOT_DEFINITIONS[id].page===pageId)||(manifest?.parts&&Object.keys(manifest.parts).some(id=>SLOT_DEFINITIONS[id]?.page===pageId));
    if(!needed&&!pageRecord)continue;if(!pageRecord?.file){errors.push(`Page "${pageId}" requires a file.`);continue;}
    try{const bytes=readFileSync(resolve(root,pageRecord.file));if(pageRecord.sha256&&sha256(bytes)!==pageRecord.sha256)errors.push(`Page "${pageId}" SHA-256 does not match ${pageRecord.file}.`);const image=await loadImage(resolve(root,pageRecord.file));if(image.width!==definition.width||image.height!==definition.height)errors.push(`Page "${pageId}" must be ${definition.width}x${definition.height}; got ${image.width}x${image.height}.`);const canvas=createCanvas(image.width,image.height),context=canvas.getContext('2d');context.drawImage(image,0,0);loadedPages[pageId]={image,data:context.getImageData(0,0,image.width,image.height).data};}catch(error){errors.push(`Page "${pageId}" could not be read: ${error.message}`);}
  }
  const accessories=new Map();
  for(const[id,part]of Object.entries(manifest?.parts??{})){
    const slot=SLOT_DEFINITIONS[id];if(!slot)continue;
    if(part.slotId!==id)errors.push(`Part "${id}" must repeat its exact slotId.`);
    if(part.direction!==slot.direction)errors.push(`Part "${id}" direction must be "${slot.direction}".`);
    if((part.anatomicalSide??null)!==(slot.anatomicalSide??null))errors.push(`Part "${id}" anatomicalSide must be ${slot.anatomicalSide??'null'}.`);
    if(!part.source?.path||!part.source?.sha256||!part.source?.derivation)errors.push(`Part "${id}" requires source path, sha256, and derivation provenance.`);
    if(!part.source?.crop||!['x','y','width','height'].every(k=>Number.isFinite(part.source.crop[k]))||part.source.crop.width<=0||part.source.crop.height<=0)errors.push(`Part "${id}" requires a finite, positive source crop.`);
    if(!part.contentBounds||!['x','y','width','height'].every(k=>Number.isFinite(part.contentBounds[k])))errors.push(`Part "${id}" requires measured contentBounds.`);
    for(const path of slot.requiredLandmarks){const point=getPath(part.landmarks,path);finitePoint(point,`Part "${id}" landmark "${path}"`,errors);if(point&&(!Number.isFinite(point.x)||!Number.isFinite(point.y)||point.x<0||point.y<0||point.x>=CELL_SIZE||point.y>=CELL_SIZE))errors.push(`Part "${id}" landmark "${path}" lies outside its 256px slot.`);}
    const page=loadedPages[slot.page];if(page){const actual=localAlphaBounds(page.data,page.image.width,slot);if(!actual)errors.push(`Part "${id}" has no visible alpha in its slot.`);else{if(actual.x<SLOT_PADDING||actual.y<SLOT_PADDING||actual.x+actual.width>CELL_SIZE-SLOT_PADDING||actual.y+actual.height>CELL_SIZE-SLOT_PADDING)errors.push(`Part "${id}" violates the ${SLOT_PADDING}px fixed slot padding; alpha bounds are ${actual.x},${actual.y},${actual.width},${actual.height}.`);if(part.contentBounds&&(['x','y','width','height'].some(k=>Math.abs(part.contentBounds[k]-actual[k])>1)))errors.push(`Part "${id}" contentBounds do not match visible alpha.`);for(const path of slot.requiredLandmarks){const point=getPath(part.landmarks,path);if(point&&Number.isFinite(point.x)&&Number.isFinite(point.y)&&!alphaNear(page.data,page.image.width,slot,point,part.landmarkAlphaRadius??6))errors.push(`Part "${id}" landmark "${path}" is not within ${part.landmarkAlphaRadius??6}px of visible alpha.`);}}}
    const op=orientationPaths(slot);if(op){const start=getPath(part.landmarks,op.start),end=getPath(part.landmarks,op.end),marker=getPath(part.landmarks,op.marker);if(start&&end&&marker&&[start,end,marker].every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y))){const length=Math.hypot(end.x-start.x,end.y-start.y),side=signedMarkerSide(start,end,marker);if(length<2)errors.push(`Part "${id}" has a zero-length authored bone axis.`);if(Math.abs(side)<length)errors.push(`Part "${id}" orientation marker "${op.marker}" is collinear or too close to its bone axis.`);if(![1,-1].includes(part.orientation?.markerSign))errors.push(`Part "${id}" must declare orientation.markerSign as 1 or -1.`);else if(Math.sign(side)!==part.orientation.markerSign)errors.push(`Part "${id}" orientation.markerSign disagrees with its authored marker.`);}}
    for(const accessory of part.accessories??[]){if(!accessory.id||!ANATOMICAL_SIDES.includes(accessory.anatomicalSide))errors.push(`Part "${id}" has an invalid accessory declaration.`);if(accessory.anatomicalSide!==slot.anatomicalSide)errors.push(`Accessory "${accessory.id}" on "${id}" is attached to the wrong anatomical side.`);finitePoint(accessory.landmark,`Accessory "${accessory.id}" on "${id}" landmark`,errors);if(page&&accessory.landmark&&Number.isFinite(accessory.landmark.x)&&Number.isFinite(accessory.landmark.y)&&!alphaNear(page.data,page.image.width,slot,accessory.landmark,accessory.alphaRadius??6))errors.push(`Accessory "${accessory.id}" on "${id}" is not within ${accessory.alphaRadius??6}px of visible part alpha.`);const poseSet=slot.page==='actions'?'seated':slot.page==='clipboard'?'clipboard':'base';const key=`${poseSet}:${slot.direction}:${accessory.id}`;if(accessories.has(key))errors.push(`Duplicate accessory "${accessory.id}" in ${poseSet} ${slot.direction}: ${accessories.get(key)} and ${id}.`);else accessories.set(key,id);const policy=manifest?.accessoryPolicy?.[accessory.id];if(policy&&policy.anatomicalSide!==accessory.anatomicalSide)errors.push(`Accessory "${accessory.id}" violates accessoryPolicy anatomical side "${policy.anatomicalSide}".`);}
  }
  for(const [id,slot] of Object.entries(SLOT_DEFINITIONS)){if(manifest?.parts?.[id])continue;const page=loadedPages[slot.page];if(page&&localAlphaBounds(page.data,page.image.width,slot))errors.push(`Unused slot "${id}" contains visible alpha; blank and reserved cells must remain transparent.`);}
  if(!manifest?.layerOrder)errors.push('layerOrder is required and must use the immutable v1 ordering.');else for(const[key,value]of Object.entries(LAYER_ORDER))if(JSON.stringify(manifest.layerOrder[key])!==JSON.stringify(value))errors.push(`layerOrder.${key} must match the immutable v1 ordering.`);
  const result={ok:errors.length===0,errors};if(!result.ok&&throwOnError)throw new Error(`Character atlas v1 validation failed:\n- ${errors.join('\n- ')}`);return result;
}

export { getPath };
