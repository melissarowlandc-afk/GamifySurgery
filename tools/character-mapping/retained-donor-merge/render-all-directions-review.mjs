import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo=resolve(import.meta.dirname,'../../..');
const out=resolve(repo,'artifacts/character-movement/retained-donor-merge/all-directions-v1');
const manifest=JSON.parse(readFileSync(resolve(out,'all-directions-manifest.json')));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const review={schemaVersion:1,sheets:{}};

for(const direction of manifest.directions){
  const canvas=createCanvas(1260,470),context=canvas.getContext('2d');
  context.fillStyle='#17191d';context.fillRect(0,0,canvas.width,canvas.height);context.fillStyle='#fff';context.font='bold 20px sans-serif';context.fillText(`${direction.toUpperCase()} - two retained characters - eight phases`,16,28);
  for(const [row,character] of manifest.characters.entries()){
    context.fillStyle='#fff';
    context.font='bold 13px sans-serif';context.fillText(character.label,12,58+row*195);
    for(const [column,phase] of manifest.phaseIds.entries()){
      const x=12+column*154,y=65+row*195;context.fillStyle='#eeece6';context.fillRect(x,y,144,180);context.fillStyle='#222';context.font='bold 11px sans-serif';context.fillText(phase,x+5,y+14);
      const image=await loadImage(resolve(out,character.directions[direction][phase].clean));context.imageSmoothingEnabled=false;context.drawImage(image,0,0,240,310,x+2,y+16,140,181);
    }
  }
  const name=`review-${direction}-eight-phases.png`,bytes=canvas.toBuffer('image/png');writeFileSync(resolve(out,name),bytes);review.sheets[direction]={path:name,sha256:sha(bytes)};
}

const staticCanvas=createCanvas(960,760),staticContext=staticCanvas.getContext('2d');staticContext.fillStyle='#17191d';staticContext.fillRect(0,0,960,760);staticContext.fillStyle='#fff';staticContext.font='bold 20px sans-serif';staticContext.fillText('Original retained south-facing standing and seated registrations',16,28);
for(const [row,character] of manifest.characters.entries()){
  staticContext.fillStyle='#fff';
  staticContext.font='bold 13px sans-serif';staticContext.fillText(character.label,12,58+row*350);
  for(const [column,mode] of ['standSouth','sitSouth'].entries())for(const [guideIndex,key] of ['clean','guide'].entries()){
    const x=12+(column*2+guideIndex)*230,y=65+row*350;staticContext.fillStyle='#eeece6';staticContext.fillRect(x,y,210,330);staticContext.fillStyle='#222';staticContext.fillText(`${mode}/${key}`,x+5,y+15);const image=await loadImage(resolve(out,character.static[mode][key]));staticContext.imageSmoothingEnabled=false;staticContext.drawImage(image,0,0,210,340,x,y+18,210,312);
  }
}
const staticBytes=staticCanvas.toBuffer('image/png');writeFileSync(resolve(out,'review-static-south.png'),staticBytes);review.static={path:'review-static-south.png',sha256:sha(staticBytes)};
writeFileSync(resolve(out,'review-sheets.json'),JSON.stringify(review,null,2)+'\n');
console.log(JSON.stringify({directionSheets:4,staticSheet:1,out}));
