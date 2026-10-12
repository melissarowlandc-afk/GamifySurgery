// Revised neutral geometry capture only; must be run after build --stand-in, before repacking reused art.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createCanvas} from '@napi-rs/canvas';import {loadNativeEngine} from '../../proof/native-engine.mjs';import {PREPARED_METADATA} from '../../proof/design-rooms.js';
if(PREPARED_METADATA.mode!=='stand-in')throw Error('Revised neutral geometry capture requires stand-in build. Never replace painted proof.');
const here=path.dirname(fileURLToPath(import.meta.url)),{engine,warnings}=await loadNativeEngine();
for(const[id,state]of [['occupied',{}],['routes',{routes:true,contacts:true}]]){Object.assign(engine.state,{actors:true,routes:false,contacts:false,bases:false},state);const c=createCanvas(1,1),result=await engine.render(c,true);if(result.bad)throw Error(JSON.stringify(result));fs.writeFileSync(path.join(here,'prepaint-'+id+'.png'),c.toBuffer('image/png'));}
if(warnings.length)throw Error(warnings.join('; '));console.log('REVISION STAND-IN REPLAY PASS: actual native renderer; occupied and route views; frozen source stand-ins unchanged.');
