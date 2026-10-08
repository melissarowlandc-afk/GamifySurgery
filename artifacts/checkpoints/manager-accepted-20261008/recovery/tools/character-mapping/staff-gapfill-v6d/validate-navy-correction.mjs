// Independent pixel audit, not a second call to the production recolour helper.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {decodeRgbaPng,encodeRgbaPng} from './rgba-png.mjs';
import {repo,root,tool,hash,rel,verifyRuntimeBaseline} from './build-roster.mjs';
const json=f=>JSON.parse(readFileSync(f,'utf8')),file=resolve(tool,'corrections/008-navy-palette-v1.json'),spec=json(file);
verifyRuntimeBaseline();assert.equal(spec.identity,'staff-gapfill-v6d.008');assert.equal(spec.schemaVersion,'staff-gapfill-v6d-navy-palette/v1');
function colour(r,g,b){const high=Math.max(r,g,b),low=Math.min(r,g,b),range=high-low;let angle=0;if(range){if(high===r)angle=((g-b)/range+6)%6;else if(high===g)angle=(b-r)/range+2;else angle=(r-g)/range+4;}return {h:angle*60,s:high?range/high:0,v:high/255};}
function selected(image,index){const p=index*4,r=image.rgba[p],g=image.rgba[p+1],b=image.rgba[p+2],a=image.rgba[p+3],c=colour(r,g,b),m=spec.mask;
  if(a<m.minimumAlpha||Math.max(r,g,b)<=m.protectedInkMaxChannel||c.h<m.hueMin||c.h>m.hueMax||c.s<m.minimumSaturation)return false;
  const x=index%image.width,y=Math.floor(index/image.width);for(let dy=-m.silhouetteInset;dy<=m.silhouetteInset;dy++)for(let dx=-m.silhouetteInset;dx<=m.silhouetteInset;dx++){
    const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=image.width||ny>=image.height||image.rgba[(ny*image.width+nx)*4+3]<m.minimumAlpha)return false;}
  return true;
}
function median(image){const samples=[];for(let i=0;i<image.width*image.height;i++)if(selected(image,i))samples.push(colour(...image.rgba.subarray(i*4,i*4+3)));assert(samples.length>100);
  return {eligiblePixels:samples.length,medianHsv:Object.fromEntries(['h','s','v'].map(k=>[k,samples.map(c=>c[k]).sort((a,b)=>a-b)[Math.floor((samples.length-1)/2)]]))};}
for(const r of [spec.reference,spec.originalPackage,spec.history])assert.equal(hash(resolve(repo,r.path)),r.sha256);
const history=json(resolve(repo,spec.history.path));for(const f of history.files)assert.equal(hash(resolve(repo,f.path)),f.sha256);
const reference=median(decodeRgbaPng(readFileSync(resolve(repo,spec.reference.path)))),original=median(decodeRgbaPng(readFileSync(resolve(repo,spec.originalPoses.find(p=>p.pose==='stand'&&p.direction==='south').path))));
assert.deepEqual(reference.medianHsv,spec.measurements.reference.medianHsv);assert.deepEqual(original.medianHsv,spec.measurements.original.medianHsv);
assert.equal(reference.eligiblePixels,spec.measurements.reference.eligiblePixels);assert.equal(original.eligiblePixels,spec.measurements.original.eligiblePixels);
assert.equal(spec.transform.hueDelta,reference.medianHsv.h-original.medianHsv.h);assert.equal(spec.transform.saturationScale,reference.medianHsv.s/original.medianHsv.s);assert.equal(spec.transform.valueScale,reference.medianHsv.v/original.medianHsv.v);
assert(spec.transform.valueScale>0&&spec.transform.valueScale<1);assert(spec.transform.saturationScale>0&&spec.transform.saturationScale<1);
const manifest=json(resolve(root,'packages/008/manifest.json'));assert.equal(manifest.source.stage2.png.sha256,spec.sourceSha256);assert.equal(manifest.postNormalizationCorrection.sha256,hash(file));
assert.equal(spec.originalPoses.length,8);const summaries=[];let alphaDifferences=0,unselectedDifferences=0,inkDifferences=0,boundaryDifferences=0,shadingViolations=0,totalChanged=0;
for(const p of spec.originalPoses){
  assert.equal(hash(resolve(repo,p.path)),p.sha256);const before=decodeRgbaPng(readFileSync(resolve(repo,p.path))),detail=manifest.poses[p.pose][p.direction],after=decodeRgbaPng(readFileSync(resolve(repo,detail.file)));
  assert.equal(before.width,160);assert.equal(before.height,320);assert.equal(after.width,160);assert.equal(after.height,320);assert.equal(hash(resolve(repo,detail.file)),detail.sha256);
  assert.deepEqual(detail.anchors,p.anchors);assert.deepEqual(detail.visibleBounds,p.visibleBounds);assert.deepEqual(detail.transform,p.transform);
  assert(decodeRgbaPng(encodeRgbaPng(before)).rgba.equals(before.rgba),'raw PNG codec loses pixels');
  assert.deepEqual(before.chunks.filter(c=>c.type!=='IDAT').map(c=>c.bytes),after.chunks.filter(c=>c.type!=='IDAT').map(c=>c.bytes),'PNG header/ancillary metadata changed');
  let changed=0,eligiblePixels=0;
  for(let i=0;i<160*320;i++){
    const at=i*4,input=before.rgba.subarray(at,at+4),output=after.rgba.subarray(at,at+4),different=!input.subarray(0,3).equals(output.subarray(0,3));alphaDifferences+=input[3]!==output[3];
    const mask=selected(before,i);
    if(!mask){unselectedDifferences+=different;if(Math.max(...input.subarray(0,3))<=64)inkDifferences+=different;
      const x=i%160,y=Math.floor(i/160);let boundary=false;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=160||ny>=320||before.rgba[(ny*160+nx)*4+3]<13)boundary=true;}if(boundary)boundaryDifferences+=different;continue;}
    eligiblePixels++;if(different)changed++;
    const c=colour(...input.subarray(0,3)),h=((c.h+spec.transform.hueDelta)%360+360)%360,s=c.s*spec.transform.saturationScale,v=c.v*spec.transform.valueScale,chroma=v*s,hp=h/60,x=chroma*(1-Math.abs(hp%2-1)),m=v-chroma;
    let raw;switch(Math.floor(hp)){case 0:raw=[chroma,x,0];break;case 1:raw=[x,chroma,0];break;case 2:raw=[0,chroma,x];break;case 3:raw=[0,x,chroma];break;case 4:raw=[x,0,chroma];break;default:raw=[chroma,0,x];}
    const expected=raw.map(n=>Math.round((n+m)*255));assert.deepEqual([...output.subarray(0,3)],expected,'independent RGB transform mismatch '+p.pose+'/'+p.direction+'/'+i);
    if(output[2]!==Math.round(input[2]*spec.transform.valueScale))shadingViolations++;
  }
  assert.equal(detail.paletteCorrection.inputSha256,p.sha256);assert.equal(detail.paletteCorrection.changedPixels,changed);assert(changed>100);totalChanged+=changed;
  summaries.push({pose:p.pose,direction:p.direction,originalSha256:p.sha256,correctedSha256:detail.sha256,eligiblePixels,changedPixels:changed});
}
assert.equal(alphaDifferences,0);assert.equal(unselectedDifferences,0);assert.equal(inkDifferences,0);assert.equal(boundaryDifferences,0);assert.equal(shadingViolations,0);
for(const p of [...spec.protectedOtherPoses,...spec.protectedNativeSources])assert.equal(hash(resolve(repo,p.path)),p.sha256,'unrelated pose or native source changed '+p.path);
assert.equal(spec.protectedOtherPoses.length,104);assert.equal(spec.protectedNativeSources.length,56);
const corrected=median(decodeRgbaPng(readFileSync(resolve(root,'packages/008/stand-south.png'))));
assert(Math.abs(corrected.medianHsv.h-reference.medianHsv.h)<.6);assert(Math.abs(corrected.medianHsv.s-reference.medianHsv.s)<.01);assert(Math.abs(corrected.medianHsv.v-reference.medianHsv.v)<=1/255);
const result={status:'PASS',identity:spec.identity,correctedPoses:8,changedRgbPixels:totalChanged,alphaDifferences,unselectedRgbDifferences:unselectedDifferences,protectedInkDifferences:inkDifferences,silhouetteBoundaryDifferences:boundaryDifferences,shadingScaleViolations:shadingViolations,preservedOtherPoses:104,preservedNativeSourceFiles:56,referenceMedianRgb:spec.measurements.reference.medianRgb,originalMedianRgb:spec.measurements.original.medianRgb,correctedMedianHsv:corrected.medianHsv,regenerations:0,runtimeReady:false};
mkdirSync(resolve(root,'validation'),{recursive:true});if(!process.argv.includes('--check-only'))writeFileSync(resolve(root,'validation/navy-palette-results.json'),JSON.stringify({...result,poses:summaries,correction:{path:rel(file),sha256:hash(file)}},null,2)+'\n');
verifyRuntimeBaseline();console.log(JSON.stringify(result));
