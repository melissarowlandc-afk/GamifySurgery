import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {decodeRgbaPng,encodeRgbaPng} from './rgba-png.mjs';
export const paletteSpecPath='tools/character-mapping/staff-gapfill-v6d/corrections/008-navy-palette-v1.json';
const digest=b=>createHash('sha256').update(b).digest('hex');
export function hsv(r,g,b){const maximum=Math.max(r,g,b),minimum=Math.min(r,g,b),delta=maximum-minimum;return {h:delta?(maximum===r?((g-b)/delta+6)%6:maximum===g?(b-r)/delta+2:(r-g)/delta+4)*60:0,s:maximum?delta/maximum:0,v:maximum/255};}
export function rgb({h,s,v}){const sector=((h%360)+360)%360/60,c=v*s,x=c*(1-Math.abs(sector%2-1)),m=v-c;return [[c,x,0],[x,c,0],[0,c,x],[0,x,c],[x,0,c],[c,0,x]][Math.floor(sector)].map(n=>Math.round((n+m)*255));}
export function eligible(image,index,mask){
  const {rgba,width,height}=image,offset=index*4,[r,g,b,a]=rgba.subarray(offset,offset+4),colour=hsv(r,g,b);
  if(a<mask.minimumAlpha||Math.max(r,g,b)<=mask.protectedInkMaxChannel||colour.h<mask.hueMin||colour.h>mask.hueMax||colour.s<mask.minimumSaturation)return false;
  const x=index%width,y=Math.floor(index/width);
  for(let dy=-mask.silhouetteInset;dy<=mask.silhouetteInset;dy++)for(let dx=-mask.silhouetteInset;dx<=mask.silhouetteInset;dx++){
    const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=width||ny>=height||rgba[(ny*width+nx)*4+3]<mask.minimumAlpha)return false;
  }
  return true;
}
export function measurePalette(bytes,mask){
  const image=decodeRgbaPng(bytes),samples=[],counts=new Map();
  for(let i=0;i<image.width*image.height;i++)if(eligible(image,i,mask)){
    const colour=[...image.rgba.subarray(i*4,i*4+3)],value=hsv(...colour);samples.push(value);const key=colour.join(',');counts.set(key,(counts.get(key)??0)+1);
  }
  assert(samples.length>100);const quantile=(key,f)=>samples.map(c=>c[key]).sort((a,b)=>a-b)[Math.floor((samples.length-1)*f)];
  const median={h:quantile('h',.5),s:quantile('s',.5),v:quantile('v',.5)};
  return {eligiblePixels:samples.length,medianHsv:median,medianRgb:rgb(median),hsvQuartiles:Object.fromEntries(['h','s','v'].map(k=>[k,[quantile(k,.25),quantile(k,.5),quantile(k,.75)]])),mostFrequentRgb:[...counts].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,12).map(([rgb,count])=>({rgb:rgb.split(',').map(Number),count}))};
}
export function recolour(bytes,spec){
  const image=decodeRgbaPng(bytes),original=Buffer.from(image.rgba);let changedPixels=0;
  for(let i=0;i<image.width*image.height;i++)if(eligible({...image,rgba:original},i,spec.mask)){
    const value=hsv(...original.subarray(i*4,i*4+3));const result=rgb({h:value.h+spec.transform.hueDelta,s:value.s*spec.transform.saturationScale,v:value.v*spec.transform.valueScale});
    assert(result.every(n=>n>=0&&n<=255));for(let k=0;k<3;k++)image.rgba[i*4+k]=result[k];if(result.some((n,k)=>n!==original[i*4+k]))changedPixels++;
  }
  assert(changedPixels>100);const output=encodeRgbaPng(image);assert(decodeRgbaPng(output).rgba.equals(image.rgba));
  return {bytes:output,changedPixels};
}
export function correctionReceipt(repo,number){
  const path=resolve(repo,paletteSpecPath);if(number!=='008'||!existsSync(path))return null;
  const bytes=readFileSync(path),spec=JSON.parse(bytes);assert.equal(spec.schemaVersion,'staff-gapfill-v6d-navy-palette/v1');assert.equal(spec.identity,'staff-gapfill-v6d.008');
  for(const reference of [spec.reference,spec.originalPackage])assert.equal(digest(readFileSync(resolve(repo,reference.path))),reference.sha256);
  return {path:paletteSpecPath,sha256:digest(bytes),spec};
}
export function correctPose(repo,number,pose,direction,nativeDerivedBytes){
  const receipt=correctionReceipt(repo,number);if(!receipt)return {bytes:nativeDerivedBytes,correction:null};
  const original=receipt.spec.originalPoses.find(p=>p.pose===pose&&p.direction===direction);assert(original);assert.equal(digest(nativeDerivedBytes),original.sha256,'palette input differs from frozen original');
  assert.equal(digest(readFileSync(resolve(repo,original.path))),original.sha256);const output=recolour(nativeDerivedBytes,receipt.spec);
  return {...output,correction:{path:receipt.path,sha256:receipt.sha256,algorithm:'measured-HSV-relative-shading-v1',inputSha256:original.sha256,changedPixels:output.changedPixels,alphaPolicy:'all original raw alpha bytes retained',outlinePolicy:'dark ink and silhouette boundary pixels retained'}};
}
