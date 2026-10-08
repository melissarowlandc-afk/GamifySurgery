// Read-only source inspection receipts and contact sheets. No generated painting.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {createCanvas,loadImage} from '@napi-rs/canvas';import {sha} from '../assets/image-utils.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(here,'../../../../..'),out=path.join(here,'evidence');fs.mkdirSync(out,{recursive:true});
const registry=JSON.parse(fs.readFileSync(path.join(repo,'apps/player/src/art/characterStillRegistry.generated.json'),'utf8'));
const shared=JSON.parse(fs.readFileSync(path.join(repo,'tools/room-design/touchup-2026-10/build/lab-data.json'),'utf8'));
const ids=['level3-roster-v2.021','gs026-employee-001','patient.adult.007'];
const characters=ids.map(id=>registry.characters.find(c=>c.id===id)??shared.characters.find(c=>c.id===id));
if(characters.some(c=>!c))throw Error('Missing assigned source character');
const record={registryPath:'apps/player/src/art/characterStillRegistry.generated.json',registryObservedSha256:sha(path.join(repo,'apps/player/src/art/characterStillRegistry.generated.json')),characterMetrics:shared.characterMetrics,characters,actorHashes:{}},pendingImages=[];
for(const c of characters){for(const [pose,dirs]of Object.entries(c.poses))for(const [dir,asset]of Object.entries(dirs)){const rel='apps/player/public/'+asset.url,file=path.join(repo,rel);record.actorHashes[c.id+'/'+pose+'/'+dir]={path:rel,sha256:sha(file)};if(asset.sha256.toUpperCase()!==sha(file))throw Error('Actor pixel hash mismatch '+c.id+'/'+pose+'/'+dir);}
 const direction=c.id==='level3-roster-v2.021'?'east':'west',asset=c.poses.sit[direction],img=await loadImage(path.join(repo,'apps/player/public',asset.url));
 pendingImages.push([path.join(out,c.id+'-'+direction+'.png'),(()=>{const can=createCanvas(img.width,img.height);can.getContext('2d').drawImage(img,0,0);return can.toBuffer('image/png');})()]);
 console.log(JSON.stringify({id:c.id,category:c.category,southHeight:c.poses.stand.south.visibleBounds.height,direction,pose:asset},null,2));
}
const baselineFile=path.join(here,'actor-baseline.json');
if(fs.existsSync(baselineFile)){
 const existing=JSON.parse(fs.readFileSync(baselineFile,'utf8'));
 for(const field of ['characterMetrics','characters','actorHashes'])if(JSON.stringify(existing[field])!==JSON.stringify(record[field]))throw Error('Selected actor intake changed; preserve initial receipt and return to manager: '+field);
}else fs.writeFileSync(baselineFile,JSON.stringify(record,null,2)+'\n');
for(const[file,bytes]of pendingImages)fs.writeFileSync(file,bytes);
for(const [name,rel,crop]of [['stool','apps/player/public/art/rooms/gs015-v1/minor-procedure/furniture.webp',[8,2448,266,427]],['parent-chair','apps/player/public/art/rooms/gs015-v1/waiting/south.webp',[8,748,315,369]]]){const img=await loadImage(path.join(repo,rel)),can=createCanvas(crop[2],crop[3]);can.getContext('2d').drawImage(img,...crop,0,0,crop[2],crop[3]);fs.writeFileSync(path.join(out,'source-'+name+'.png'),can.toBuffer('image/png'));}
console.log('SOURCE INSPECTION 3 identities; '+Object.keys(record.actorHashes).length+' guarded actor poses; 2 furniture crops');
