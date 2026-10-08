// One-time preparation. Preserve original assets; measure, never guess, navy.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync,mkdirSync,copyFileSync,readdirSync} from 'node:fs';
import {resolve,relative} from 'node:path';
import {repo,root,tool,hash,rel,verifyRuntimeBaseline} from './build-roster.mjs';
import {measurePalette,paletteSpecPath} from './navy-palette.mjs';
verifyRuntimeBaseline();const specFile=resolve(repo,paletteSpecPath);assert(!existsSync(specFile),'Palette preparation must not overwrite history');
const history=resolve(root,'corrections/008-navy-palette-v1/history');mkdirSync(history,{recursive:true});
const json=f=>JSON.parse(readFileSync(f,'utf8')),manifestFile=resolve(root,'packages/008/manifest.json'),manifest=json(manifestFile),files=[];
for(const [name,path]of [['package','packages/008'],['validation','validation']]){
  const directory=resolve(root,path),out=resolve(history,name);mkdirSync(out,{recursive:true});
  for(const item of readdirSync(directory,{withFileTypes:true})){if(!item.isFile()||item.name==='final-lane-files.json')continue;const source=resolve(directory,item.name),destination=resolve(out,item.name);copyFileSync(source,destination);files.push({path:rel(destination),sha256:hash(destination),copiedFrom:rel(source)});}
}
for(const file of ['staging-registry.json','alpha-normalization-report.json','worker-review/visual-review.json','comparison/manifest.json','comparison/all-catalog-manifest.json']){
  const source=resolve(root,file),destination=resolve(history,file);mkdirSync(resolve(destination,'..'),{recursive:true});copyFileSync(source,destination);files.push({path:rel(destination),sha256:hash(destination),copiedFrom:rel(source)});
}
const owned=[];function walk(dir){for(const e of readdirSync(dir,{withFileTypes:true})){const p=resolve(dir,e.name);if(p.startsWith(resolve(root,'corrections')))continue;if(e.isDirectory())walk(p);else owned.push({path:rel(p),sha256:hash(p)});}}walk(tool);walk(root);
writeFileSync(resolve(history,'intake-files.json'),JSON.stringify({scope:'Existing assigned v6d lanes only; no Git or runtime mutation',files:owned},null,2)+'\n');
const mask={minimumAlpha:13,protectedInkMaxChannel:64,hueMin:210,hueMax:235,minimumSaturation:.35,silhouetteInset:1};
const referencePath='apps/player/public/art/characters/level3-roster-v2/level3-roster-v2.006/stand-south.png';
const originalPath=rel(resolve(history,'package/stand-south.png'));
const referenceMeasurement=measurePalette(readFileSync(resolve(repo,referencePath)),mask),originalMeasurement=measurePalette(readFileSync(resolve(repo,originalPath)),mask);
const target=referenceMeasurement.medianHsv,source=originalMeasurement.medianHsv;
const spec={schemaVersion:'staff-gapfill-v6d-navy-palette/v1',identity:'staff-gapfill-v6d.008',managerRequest:'Manager accepted v6d except 008: correct scrubs and cap to existing surgeon navy, preferably deterministic; preserve shading, outline and alpha across all eight poses. No regeneration unless needed.',
  policy:'Manager-authorized derived RGB-only palette operation. Native source sheets and their imagegen provenance remain unchanged. No generation, alpha edits, cleanup, geometry changes or mirroring.',
  reference:{id:'level3-roster-v2.006',path:referencePath,sha256:hash(resolve(repo,referencePath))},originalPackage:{path:rel(resolve(history,'package/manifest.json')),sha256:hash(resolve(history,'package/manifest.json'))},sourceSha256:manifest.source.stage2.png.sha256,
  measurements:{method:'Raw RGBA8 scan of eligible blue interior pixels in the existing and original standing-south still. HSV medians and quartiles; 1px meaningful-alpha silhouette boundary and all ink with max channel <=64 excluded.',reference:referenceMeasurement,original:originalMeasurement},
  mask,transform:{hueDelta:target.h-source.h,saturationScale:target.s/source.s,valueScale:target.v/source.v},
  originalPoses:Object.entries(manifest.poses).flatMap(([pose,directions])=>Object.entries(directions).map(([direction,p])=>({pose,direction,path:rel(resolve(history,'package',pose+'-'+direction+'.png')),sha256:p.sha256,anchors:p.anchors,visibleBounds:p.visibleBounds,transform:p.transform}))),
  protectedOtherPoses:json(resolve(root,'staging-registry.json')).entries.filter(c=>c.number!=='008').flatMap(c=>Object.values(json(resolve(repo,c.manifest)).poses).flatMap(d=>Object.values(d)).map(p=>({path:p.file,sha256:p.sha256}))),
  protectedNativeSources:json(resolve(tool,'roster.json')).identities.flatMap(c=>['source.png','stage1-standing-cardinals.png','provenance.json','stage1-provenance.json'].map(n=>{const file=resolve(root,'sources',c.number,n);return {path:rel(file),sha256:hash(file)};})),
  history:{path:rel(resolve(history,'history-receipt.json')),sha256:null},status:'worker-palette-correction;manager-verification-pending;not-runtime-integrated'};
writeFileSync(resolve(history,'history-receipt.json'),JSON.stringify({schemaVersion:'staff-gapfill-v6d-navy-history/v1',files,originalContactCoordinates:manifest.seatContactAcceptance.coordinates,policy:'Immutable pre-correction package and review/validation evidence; native sources protected in correction spec'},null,2)+'\n');
spec.history.sha256=hash(resolve(history,'history-receipt.json'));writeFileSync(specFile,JSON.stringify(spec,null,2)+'\n');
console.log(JSON.stringify({status:'PASS',historyFiles:files.length,referenceMedianRgb:referenceMeasurement.medianRgb,originalMedianRgb:originalMeasurement.medianRgb,referencePixels:referenceMeasurement.eligiblePixels,sourcePixels:originalMeasurement.eligiblePixels,transform:spec.transform,regenerations:0}));
