// Execute the actual private Canvas renderer using installed native Canvas.
// No browser, processes, UI automation, network or new dependencies.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import * as Geometry from './geometry.mjs';
import * as TU from './room-touchups.mjs';
import { DESIGN_ASSETS, DESIGN_ROOMS, DESIGN_NAVIGATION, PREPARED_METADATA, ASSET_CONTRACT } from './design-rooms.js';
const here=path.dirname(fileURLToPath(import.meta.url));
export async function loadNativeEngine(){
 const data=JSON.parse(fs.readFileSync(path.join(here,'data.json'),'utf8')),warnings=[];
 let source=fs.readFileSync(path.join(here,'lab.js'),'utf8').split('// ---------- UI ----------')[0].replace(/^import .*;\r?\n/gm,'');
 source=source.replace('const data = await (await fetch("./data.json")).json();','const data = __inputData;');
 const start=source.indexOf('function loadImage(src) {'),end=source.indexOf('const atlasSrc',start);
 if(start<0||end<0)throw Error('Native loader markers missing');
 source=source.slice(0,start)+'async function loadImage(src) { return __loadImage(src); }\n'+source.slice(end);
 source+=fs.readFileSync(path.join(here,'extension.js'),'utf8').split('function contactText()')[0];
 const context=vm.createContext({Geometry,TU,DESIGN_ASSETS,DESIGN_ROOMS,DESIGN_NAVIGATION,PREPARED_METADATA,ASSET_CONTRACT,__inputData:data,
 __loadImage:async src=>{const im=await loadImage(path.resolve(here,src));if(!im.naturalWidth)Object.defineProperty(im,'naturalWidth',{value:im.width});if(!im.naturalHeight)Object.defineProperty(im,'naturalHeight',{value:im.height});return im;},
 document:{createElement:kind=>{if(kind!=='canvas')throw Error('Unexpected native DOM request');return createCanvas(1,1);}},console:{log:()=>{},warn:(...args)=>warnings.push(args.join(' '))}});
 const engine=await new vm.Script(`(async () => { ${source}\nreturn { state, render, actorPlacements, collectDrawables, rooms, drawImageRec, painterY }; })()`).runInContext(context);
 return {engine,warnings};
}
