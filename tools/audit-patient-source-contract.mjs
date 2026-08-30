/** Read-only occupancy/pose diagnostic for supplied patient 6x3 source sheets. */
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const root = resolve(import.meta.dirname, "..");
const dir = resolve(root, "generated_images/patient-character-sources-v1");
const expectedCenters = [1, 3, 5, 7, 9, 11].map((value) => value / 12);
const pairs = [[0,1,"front"],[2,3,"back"],[4,5,"left"],[12,13,"right"]];
function maskRow(image, row) {
  const width = image.width, height = image.height, start = Math.round(row * height / 3) + (row === 0 ? 0 : 24), end = Math.round((row + 1) * height / 3) - (row === 2 ? 0 : 5), canvas = createCanvas(width, end - start), ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, start, width, end - start, 0, 0, width, end - start); const data = ctx.getImageData(0,0,width,end-start).data, mask = new Uint8Array(width * (end-start));
  for (let y = 0; y < end-start; y++) for (let x = 0; x < width; x++) { const offset = (y * width + x) * 4, r=data[offset], g=data[offset+1], b=data[offset+2]; if (Math.min(r,g,b) < 225 || Math.max(r,g,b) - Math.min(r,g,b) > 28) for (let dy=-5;dy<=5;dy++) for(let dx=-5;dx<=5;dx++){const nx=x+dx,ny=y+dy;if(nx>=0&&nx<width&&ny>=0&&ny<end-start)mask[ny*width+nx]=1;} }
  const seen = new Uint8Array(mask.length), components=[];
  for (let source=0; source<mask.length; source++) { if (!mask[source] || seen[source]) continue; const queue=[source];seen[source]=1;let minX=source%width,maxX=minX,minY=Math.floor(source/width),maxY=minY,count=0,signature=2166136261; for(let cursor=0;cursor<queue.length;cursor++){const at=queue[cursor],x=at%width,y=Math.floor(at/width);count++;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);signature=Math.imul(signature^(x+31*y),16777619);for(const next of [x?at-1:-1,x<width-1?at+1:-1,y?at-width:-1,y<end-start-1?at+width:-1])if(next>=0&&!seen[next]&&mask[next]){seen[next]=1;queue.push(next);}} if(count>10000)components.push({count,minX,maxX,minY,maxY,center:(minX+maxX)/2/width,signature:signature>>>0}); }
  return components.sort((a,b)=>a.center-b.center);
}
function chooseSlots(components) {
  const result = { slots:[], missing:[] }; let best = null;
  const search = (slot, cursor, cost, chosen) => { if (cursor === components.length) { if (!best || cost < best.cost) best={cost,chosen:[...chosen]}; return; } for(let target=slot;target<6;target++) search(target+1,cursor+1,cost+Math.abs(components[cursor].center-expectedCenters[target]),[...chosen,target]); };
  search(0,0,0,[]); if (!best) return result; result.slots=best.chosen;result.missing=[0,1,2,3,4,5].filter(slot=>!best.chosen.includes(slot));return result;
}
const files=readdirSync(dir).filter(name=>/^patient-\d{3}\.png$/.test(name)).sort(), rows=[];
for(const file of files){const image=await loadImage(resolve(dir,file)), bands=[0,1,2].map(row=>maskRow(image,row)), slots=bands.map(chooseSlots), defects=[];for(let row=0;row<3;row++){if(bands[row].length!==6)defects.push(`row ${row+1}: ${bands[row].length}/6 actor panels; missing slots ${slots[row].missing.map(slot=>slot+1).join(',')||'none'}`);}const frame=(row,slot)=>{const index=slots[row].slots.indexOf(slot);return index<0?null:bands[row][index];};for(const [a,b,direction] of pairs){const [row,firstSlot,secondSlot]=direction==='right'?[2,0,1]:[1,a,b],first=frame(row,firstSlot),second=frame(row,secondSlot);if(first&&second){const same=first.signature===second.signature&&first.count===second.count&&first.minX===second.minX&&first.maxX===second.maxX;if(same)defects.push(`${direction} A/B: identical silhouette signature`);}}if(!frame(2,4))defects.push('thumbnail: missing');if(!frame(2,5))defects.push('portrait: missing');rows.push({id:`patient.adult.${file.slice(8,11)}`,defects,counts:bands.map(band=>band.length),slots});}
for(const row of rows)if(row.defects.length)console.log(`${row.id}: ${row.defects.join('; ')}`);
console.log(JSON.stringify({sheets:rows.length,hardDefects:rows.filter(row=>row.defects.length),summary:{rowOccupancyAnomalies:rows.reduce((count,row)=>count+row.defects.filter(defect=>defect.startsWith('row')).length,0),identicalStridePairs:rows.reduce((count,row)=>count+row.defects.filter(defect=>defect.includes('identical silhouette')).length,0),missingThumbnailOrPortrait:rows.reduce((count,row)=>count+row.defects.filter(defect=>defect.startsWith('thumbnail')||defect.startsWith('portrait')).length,0)}},null,2));
