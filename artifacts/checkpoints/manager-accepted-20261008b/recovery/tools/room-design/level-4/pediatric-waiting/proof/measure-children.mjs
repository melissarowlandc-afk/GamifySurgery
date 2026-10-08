// Read-only pediatric references, magnified for contact inspection; no source edits.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCanvas, loadImage } from '@napi-rs/canvas';
const here=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(here,'../../../../..');
const registry=JSON.parse(fs.readFileSync(path.join(repo,'apps/player/src/art/characterStillRegistry.generated.json'),'utf8'));
const revision=JSON.parse(fs.readFileSync(path.join(here,'revision-contract.json'),'utf8'));
const choices=revision.children.map(c=>[c.characterId,c.direction,c.seatContactSource]);
const canvas=createCanvas(choices.length*480,440),g=canvas.getContext('2d');g.fillStyle='#faf4e5';g.fillRect(0,0,canvas.width,440);
for(let i=0;i<choices.length;i++) {
  const [id,direction,contact]=choices[i],character=registry.characters.find(c=>c.id===id),pose=character.poses.sit[direction];
  const image=await loadImage(path.join(repo,'apps/player/public',pose.url));
  g.imageSmoothingEnabled=false;g.drawImage(image,25,190,120,100,i*480,35,480,400);
  g.fillStyle='#1c3227';g.font='14px sans-serif';g.fillText(`${id} ${direction}; hip [${contact}]; registry Y${pose.anchors.seatContactY}`,i*480+8,22);
  g.strokeStyle='#c94638';g.lineWidth=1;
  for(let x=30;x<=140;x+=10) {const dx=i*480+(x-25)*4;g.beginPath();g.moveTo(dx,35);g.lineTo(dx,435);g.stroke();g.fillText(String(x),dx+1,48);}
  for(let y=200;y<=280;y+=10) {const dy=35+(y-190)*4;g.beginPath();g.moveTo(i*480,dy);g.lineTo((i+1)*480,dy);g.stroke();g.fillText(String(y),i*480+2,dy-2);}
  const hx=i*480+(contact[0]-25)*4,hy=35+(contact[1]-190)*4;
  g.strokeStyle='#0b75b2';g.lineWidth=3;g.beginPath();g.moveTo(hx-12,hy);g.lineTo(hx+12,hy);g.moveTo(hx,hy-12);g.lineTo(hx,hy+12);g.stroke();
}
fs.writeFileSync(path.join(here,'evidence/pediatric-source-contact-sheet.png'),canvas.toBuffer('image/png'));
console.log('MEASURE pediatric source contacts magnified; source art unchanged');
