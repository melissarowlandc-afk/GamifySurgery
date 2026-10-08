// Consume the concurrent stool worker's exact native contract, without painting.
// The unchanged approved atlas and runtime source remain read only.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {createCanvas,ImageData} from '@napi-rs/canvas';
import {sha,decode,bounds} from './image-utils.mjs';
import {APPROVED_ROLLING_STOOL_SOURCES,deriveBacklessRollingStoolPixels,BACKLESS_ROLLING_STOOL_VERSION} from './reused/backlessRollingStools.ts';
const here=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(here,'../../../../..'),out=path.join(here,'reused');
const sourcePath='apps/player/public/art/rooms/gs015-v1/minor-procedure/furniture.webp',runtimeContractPath='apps/player/src/facility/backlessRollingStools.ts';
const source=APPROVED_ROLLING_STOOL_SOURCES.find(s=>s.id==='minor-procedure'),[sx,sy,w,h]=source.sourceRect;
if(!source.derivation)throw Error('Missing native backless derivation');
const raw=await decode(path.join(repo,sourcePath)),crop=raw.context.getImageData(sx,sy,w,h),input=crop.data.slice(),result=deriveBacklessRollingStoolPixels(input,w,h,source.derivation);
if(input.some((v,i)=>v!==crop.data[i]))throw Error('Native derivation mutated source');
let preservedPixels=0,restoredPixels=0,removedPixels=0;
const inRect=(x,y,[rx,ry,rw,rh])=>x>=rx&&x<rx+rw&&y>=ry&&y<ry+rh;
for(let y=0;y<h;y++)for(let x=0;x<w;x++){
 const n=(y*w+x)*4,restore=inRect(x,y,source.derivation.coveredSeat)||inRect(x,y,source.derivation.coveredColumn),removed=y<source.derivation.removeAboveY||inRect(x,y,source.derivation.backPost);
 if(restore){restoredPixels++;continue;}if(removed){if(result[n+3])throw Error('Back/post retained');removedPixels++;continue;}
 for(let c=0;c<4;c++)if(result[n+c]!==input[n+c])throw Error('Reused non-back pixel changed');preservedPixels++;
}
const canvas=createCanvas(w,h),g=canvas.getContext('2d');g.putImageData(new ImageData(result,w,h),0,0);
const file='rolling-stool-backless.png';fs.writeFileSync(path.join(out,file),canvas.toBuffer('image/png'));
const alpha=bounds(result,w,h,160),seat=[133,135];if(result[(seat[1]*w+seat[0])*4+3]<160)throw Error('Cushion center not opaque');
const contract={schemaVersion:1,date:'2026-10-08',basis:'Exact native contract from the concurrent manager-assigned game-stool worker; no generated replacement or source-atlas edit.',version:BACKLESS_ROLLING_STOOL_VERSION,sourcePath,sourceSha256:sha(path.join(repo,sourcePath)),sourceRect:source.sourceRect,runtimeContractPath,runtimeContractSha256AtCopy:sha(path.join(out,'backlessRollingStools.ts')),copiedContractFile:'backlessRollingStools.ts',copiedContractSha256:sha(path.join(out,'backlessRollingStools.ts')),derivation:source.derivation,file,canvas:[w,h],seatSource:seat,outputSha256:sha(path.join(out,file)),opaqueBounds:alpha,preservedPixels,restoredPixels,removedPixels,sourceUnchanged:true};
fs.writeFileSync(path.join(out,'stool-contract.json'),JSON.stringify(contract,null,2)+'\n');
console.log('REUSE PASS native '+BACKLESS_ROLLING_STOOL_VERSION+' stool '+w+'x'+h+'; '+preservedPixels+' untouched source pixels; '+restoredPixels+' covered body pixels restored; source atlas unchanged');
