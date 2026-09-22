import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const root=resolve(import.meta.dirname,'../../..'),preview=resolve(root,'artifacts/character-movement/canonical-actions/preview'),out=resolve(root,'artifacts/character-movement/canonical-actions/review'),manifest=JSON.parse(readFileSync(resolve(preview,'manifest.json'),'utf8')),character=manifest.characters[0];mkdirSync(out,{recursive:true});
async function sheet(items,path,columns=4){const rows=Math.ceil(items.length/columns),canvas=createCanvas(columns*280,rows*374),ctx=canvas.getContext('2d');ctx.fillStyle='#eeeae2';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.font='bold 14px sans-serif';ctx.textBaseline='middle';for(const [index,item]of items.entries()){const x=(index%columns)*280,y=Math.floor(index/columns)*374,img=await loadImage(resolve(preview,item.record.clean));ctx.fillStyle='#20262b';ctx.fillRect(x,y,280,24);ctx.fillStyle='#fff';ctx.fillText(item.label,x+7,y+12);ctx.drawImage(img,x,y+24);}writeFileSync(resolve(out,path),canvas.toBuffer('image/png'));}
for(const direction of manifest.directions)await sheet(manifest.phaseIds.map(phase=>({label:`${direction} · ${phase} · ${manifest.actions.primary.phaseStages[phase]}`,record:character.directions[direction][phase]})),`canonical-jump-${direction}-01-08.png`);
await sheet(Object.entries(character.static).map(([key,record])=>({label:manifest.actions.staticViews[key],record})),'canonical-action-statics.png');
console.log(out);
