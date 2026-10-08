// Owner-requested deterministic derivative of project-owned, approved stool art.
// Removes the backrest/post and repairs only the obscured cushion strip.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCanvas } from '@napi-rs/canvas';
import { decode, sha, bounds } from './image-utils.mjs';

const here = path.dirname(fileURLToPath(import.meta.url)), repo = path.resolve(here, '../../../../..');
const sourcePath = 'apps/player/public/art/rooms/gs015-v1/minor-procedure/furniture.webp';
const source = path.join(repo, sourcePath), sourceSha256 = sha(source);
const expected = JSON.parse(fs.readFileSync(path.join(here, 'reference-baseline.json'), 'utf8')).files[sourcePath];
if (sourceSha256 !== expected) throw Error('Approved stool sheet changed.');
const sourceRect = [8,2448,266,427], [sx,sy,width,height] = sourceRect;
const sheet = await decode(source), crop = sheet.context.getImageData(sx,sy,width,height);
const original = new Uint8ClampedArray(crop.data), pixels = crop.data;
const clearRows = [0,104], repair = {left:110,rightExclusive:150,top:104,bottomExclusive:207,leftSourceX:109,rightSourceX:150};
pixels.fill(0, 0, clearRows[1] * width * 4);
// Interpolate the two intact cushion-edge samples at the same source row.
// All other pixels, including column, seat flanks and wheels, are retained.
for (let y=repair.top;y<repair.bottomExclusive;y++) for (let x=repair.left;x<repair.rightExclusive;x++) {
  const t=(x-repair.leftSourceX)/(repair.rightSourceX-repair.leftSourceX);
  for (let channel=0;channel<4;channel++)
    pixels[(y*width+x)*4+channel]=Math.round(original[(y*width+repair.leftSourceX)*4+channel]*(1-t)+original[(y*width+repair.rightSourceX)*4+channel]*t);
}
const canvas=createCanvas(width,height),g=canvas.getContext('2d');g.putImageData(crop,0,0);
const out=path.join(here,'derived');fs.mkdirSync(out,{recursive:true});
const file=path.join(out,'stool-backless.png');fs.writeFileSync(file,canvas.toBuffer('image/png'));
const derivative=await decode(file);let removedBackPixels=0,repairedPixels=0,retainedPixels=0,maxRetainedChannelDelta=0,maxRepairChannelDelta=0,repairChangedChannels=0;
for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const i=(y*width+x)*4;
  if(y<clearRows[1]){if(original[i+3])removedBackPixels++;continue;}
  if(y>=repair.top&&y<repair.bottomExclusive&&x>=repair.left&&x<repair.rightExclusive){repairedPixels++;for(let channel=0;channel<4;channel++){const delta=Math.abs(pixels[i+channel]-derivative.pixels.data[i+channel]);maxRepairChannelDelta=Math.max(maxRepairChannelDelta,delta);if(delta)repairChangedChannels++;if(channel===3&&delta)throw Error('Native repair alpha changed.');}continue;}
  retainedPixels++;
  for(let channel=0;channel<4;channel++)maxRetainedChannelDelta=Math.max(maxRetainedChannelDelta,Math.abs(original[i+channel]-derivative.pixels.data[i+channel]));
}
if(maxRetainedChannelDelta)throw Error('Retained approved pixels changed: '+maxRetainedChannelDelta);
if(maxRepairChannelDelta>1)throw Error('Unexpected repair alpha-encoding roundoff.');
if(sha(source)!==sourceSha256)throw Error('Approved source was modified.');
const reason="Owner 2026-10-08: remove rolling-stool backs and draw the clinician entirely above the stool; otherwise the room is approved.";
const manifest={schemaVersion:1,date:'2026-10-08',reason,
  ownerQuote:"Remove the 'backs' on rolling stools and just have the clinician layer on top of the stool. Then we don't have to worry about the back funniness. Otherwise this is approved.",
  source:{path:sourcePath,sha256:sourceSha256,sourceRect,approved:true,modified:false},
  output:{file:'stool-backless.png',canvas:[width,height],sourceRect:[0,0,width,height],sha256:sha(file),opaqueBounds:bounds(derivative.pixels.data,width,height,160)},
  derivation:{method:'Native RGBA mask plus same-row linear interpolation from approved cushion-edge pixels; no new generation or rescaling.',clearRows,repair,removedBackPixels,repairedPixels,retainedPixels,maxRetainedChannelDelta,
    nativeAlphaEncoding:{maxRepairChannelDelta,repairChangedChannels,alphaChanged:false,basis:'Native Canvas premultiplied-alpha PNG round trip; at most one RGB value on the repaired strip, zero change to retained approved pixels.'},
    retained:'Every pixel outside the upper-back mask and narrow cushion repair is unchanged, including the seat flanks, entire column/neck, lever and wheel base. Canvas/registration unchanged.'},
  renderer:{singleStoolLayer:true,clinicianAboveEntireStool:true,stoolForegroundLayers:0},
  approval:{ownerDesign:'approved_with_requested_revision',revisionImplemented:true,managerBrowserValidation:'pending'}
};
fs.writeFileSync(path.join(out,'stool-backless-manifest.json'),JSON.stringify(manifest,null,2)+'\n','utf8');
console.log('STOOL DERIVE PASS '+width+'x'+height+'; '+removedBackPixels+' back pixels removed; '+repairedPixels+' cushion pixels repaired; '+retainedPixels+' approved pixels unchanged; source SHA-256 '+sourceSha256);
console.log('STOOL DERIVE SHA-256 '+manifest.output.sha256);
