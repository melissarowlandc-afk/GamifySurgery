// Render the actual private renderer's paint functions with installed native Canvas.
// This is Node artwork inspection, NOT a browser validation or browser capture.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { loadNativeEngine } from './native-engine.mjs';
import { decode } from '../assets/image-utils.mjs';
import * as Geometry from './geometry.mjs';
import * as TU from './room-touchups.mjs';
import { DESIGN_ASSETS, DESIGN_ROOMS, DESIGN_NAVIGATION, PREPARED_METADATA, ASSET_CONTRACT } from './design-rooms.js';
const here = path.dirname(fileURLToPath(import.meta.url)), out = path.join(here, 'evidence');
fs.mkdirSync(out, { recursive: true });
const data = JSON.parse(fs.readFileSync(path.join(here, 'data.json'), 'utf8'));
const { engine, warnings } = await loadNativeEngine();
const preservation = [];
const stoolBox=Geometry.fixturePlacement(DESIGN_ROOMS[0].records.find(r=>r.id==='stool'),undefined,120,40,230);
const allowed={left:Math.floor(stoolBox.x)-2,top:Math.floor(stoolBox.y)-2,right:Math.ceil(stoolBox.x+stoolBox.w)+2,bottom:Math.ceil(stoolBox.y+stoolBox.h)+2};
const cases = [
  ['native-painted', {}],
  ['native-empty', { actors: false }],
  ['native-all-doors', { actors: true, doors: new Set(Geometry.roomSegments(DESIGN_ROOMS[0])) }],
  ['native-backed', { doors: new Set(), backed: new Set(['N1','N2','N3']) }],
  ['native-contacts', { backed: new Set(), contacts: true, bases: true, routes: true, grid: true, doors: new Set(['N2','S2','WA','EC']) }]
];
for (const [name, settings] of cases) {
  Object.assign(engine.state, settings);
  const canvas = createCanvas(1, 1), result = await engine.render(canvas, true);
  fs.writeFileSync(path.join(out, `${name}.png`), canvas.toBuffer('image/png'));
  const reviewed=await decode(path.join(here,'revisions/stool-with-back-reviewed/evidence',`${name}.png`)),current=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
  if(reviewed.canvas.width!==canvas.width||reviewed.canvas.height!==canvas.height)throw Error('Room framing changed');
  let changedPixels=0,outsideStool=0;
  for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){
    const i=(y*canvas.width+x)*4;if([0,1,2,3].some(c=>current[i+c]!==reviewed.pixels.data[i+c])){changedPixels++;if(x<allowed.left||x>=allowed.right||y<allowed.top||y>=allowed.bottom)outsideStool++;}
  }
  if(outsideStool)throw Error('Unrelated room pixels changed: '+name+' '+outsideStool);
  preservation.push({name,changedPixels,outsideStool,allowedStoolBox:allowed});
  fs.writeFileSync(path.join(out, `${name}.json`), JSON.stringify({ kind: 'Node native-Canvas artwork inspection; browser pending', ...result }, null, 2) + '\n');
  console.log(`INSPECT ${name} ${canvas.width}x${canvas.height}`);
}
if (warnings.length) throw new Error(warnings.join('\n'));
fs.writeFileSync(path.join(out, 'native-inspection-report.json'), JSON.stringify({ kind: 'Node artwork inspection', browserValidation: 'pending_manager', doorModel:data.pediatricPresentation.doorModel, cases: cases.map(x => x[0]), preservation, warnings }, null, 2) + '\n');
console.log('INSPECT PRESERVATION PASS all five views unchanged outside the authorized stool rectangle');
