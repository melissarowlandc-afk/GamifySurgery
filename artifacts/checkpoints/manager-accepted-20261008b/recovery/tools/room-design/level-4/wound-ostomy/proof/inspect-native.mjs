// Actual renderer artwork inspection in native Canvas. No browser claims.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {createCanvas} from '@napi-rs/canvas';import {loadNativeEngine} from './native-engine.mjs';
import {DESIGN_ROOMS} from './design-rooms.js';import * as Geometry from './geometry.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),out=path.join(here,'evidence');
const {engine,warnings}=await loadNativeEngine(),base={actors:true,patients:true,clinicians:true,contacts:false,bases:false,routes:false,grid:false,doors:new Set(),backed:new Set()};
const cases=[['native-painted',{}],['native-empty',{actors:false}],['native-all-doors',{doors:new Set(Geometry.roomSegments(DESIGN_ROOMS[0]))}],['native-backed',{backed:new Set(['N1','N2','N3'])}],['native-contacts',{contacts:true,bases:true,routes:true,grid:true,doors:new Set(['N2','S2','WA','EC'])}]];
for(const [name,settings]of cases){Object.assign(engine.state,base,settings);const canvas=createCanvas(1,1),result=await engine.render(canvas,true);fs.writeFileSync(path.join(out,name+'.png'),canvas.toBuffer('image/png'));fs.writeFileSync(path.join(out,name+'.json'),JSON.stringify({kind:'Node native-Canvas artwork inspection; browser pending',...result},null,2)+'\n');console.log('INSPECT '+name+' '+canvas.width+'x'+canvas.height);}
if(warnings.length)throw Error(warnings.join('\n'));fs.writeFileSync(path.join(out,'native-inspection-report.json'),JSON.stringify({kind:'Actual renderer in native Canvas; no browser launched',browserValidation:'pending_manager',cases:cases.map(c=>c[0]),warnings},null,2)+'\n');
