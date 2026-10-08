// Execute the actual shipped handlers using a minimal Node DOM and native Canvas.
// This verifies bindings only; it does not claim browser, CSS or accessibility QA.
import fs from'node:fs';import path from'node:path';import vm from'node:vm';import assert from'node:assert/strict';import{createRequire}from'node:module';import{fileURLToPath}from'node:url';import{createCanvas,loadImage}from'@napi-rs/canvas';
import*as Geometry from'./geometry.mjs';import*as TU from'./room-touchups.mjs';import{DESIGN_ASSETS,DESIGN_ROOMS,DESIGN_NAVIGATION,PREPARED_METADATA,ASSET_CONTRACT}from'./design-rooms.js';
const here=path.dirname(fileURLToPath(import.meta.url)),data=JSON.parse(fs.readFileSync(path.join(here,'data.json'),'utf8')),listeners={},elements={},errors=[];
class Element{
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.style={};this.dataset={};this.children=[];this.attributes={};this.checked=false;this.type='';this.parentElement={style:{}};}
 set innerHTML(value){this.children=[];this.html=value;}get innerHTML(){return this.html??'';}
 append(...nodes){this.children.push(...nodes);for(const n of nodes)n.parentElement=this;}
 setAttribute(k,v){this.attributes[k]=String(v);}getAttribute(k){return this.attributes[k];}
 querySelectorAll(selector){assert.equal(selector,'button');return this.children.flatMap(c=>[...(c.tagName==='BUTTON'?[c]:[]),...(c.querySelectorAll?.(selector)??[])]);}
}
const canvas=()=>{const c=createCanvas(1,1);c.parentElement=new Element('figure');return c;};
const html=fs.readFileSync(path.join(here,'index.html'),'utf8');for(const match of html.matchAll(/<([a-z]+)[^>]*\bid="([^"]+)"[^>]*>/g)){const el=match[1]==='canvas'?canvas():new Element(match[1]);el.id=match[2];el.type=match[0].match(/type="([^"]+)"/)?.[1]??'';elements[el.id]=el;}
const document={body:new Element('body'),getElementById:id=>{assert.ok(elements[id],'Missing actual HTML control '+id);return elements[id];},createElement:tag=>tag==='canvas'?canvas():new Element(tag),addEventListener:(type,fn)=>{(listeners[type]??=[]).push(fn);}};
let source=fs.readFileSync(path.join(here,'lab.js'),'utf8').replace(/^import .*;\r?\n/gm,'').replace('const data = await (await fetch("./data.json")).json();','const data=__data;');
const start=source.indexOf('function loadImage(src) {'),end=source.indexOf('const atlasSrc',start);assert.ok(start>=0&&end>start);source=source.slice(0,start)+'async function loadImage(src){return __loadImage(src);}\n'+source.slice(end);
const context=vm.createContext({Geometry,TU,DESIGN_ASSETS,DESIGN_ROOMS,DESIGN_NAVIGATION,PREPARED_METADATA,ASSET_CONTRACT,__data:data,document,window:{},location:{search:''},URLSearchParams,console:{log:()=>{},warn:(...a)=>errors.push(a.join(' ')),error:(...a)=>errors.push(a.join(' '))},__loadImage:async src=>{const im=await loadImage(path.resolve(here,src));Object.defineProperty(im,'naturalWidth',{value:im.width});Object.defineProperty(im,'naturalHeight',{value:im.height});return im;}});
const lab=await new vm.Script('(async()=>{'+source+'\nreturn window.__lab;})()').runInContext(context);await lab.draw();let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++;},ids=()=>Array.from(lab.state.doors);
const doors=()=>elements.doorGrid.querySelectorAll('button'),backings=()=>elements.backedChips.querySelectorAll('button'),expected=['N1','N2','N3','N4','S1','S2','S3','S4','WA','WB','WC','WD','EA','EB','EC','ED'];eq(doors().length,16);eq(backings().length,4);eq(doors().map(b=>b.textContent).sort(),expected.slice().sort());eq(backings().map(b=>b.textContent),['N1','N2','N3','N4']);
for(const s of Geometry.roomSegments(DESIGN_ROOMS[0])){await doors().find(b=>b.textContent===s).onclick();await lab.draw();eq(ids(),[s]);eq(doors().find(b=>b.textContent===s).getAttribute('aria-pressed'),'true');await doors().find(b=>b.textContent===s).onclick();await lab.draw();eq(ids(),[]);}
for(const[id,key,count]of[['allDoors','doors',16],['allDoors','doors',16],['closeDoors','doors',0],['allBacked','backed',4],['allBacked','backed',4],['clearBacked','backed',0]]){await elements[id].onclick();await lab.draw();eq(lab.state[key].size,count);eq((key==='doors'?doors():backings()).filter(b=>b.getAttribute('aria-pressed')==='true').length,count);}
for(const s of ['N1','N2','N3','N4']){await backings().find(b=>b.textContent===s).onclick();await lab.draw();eq(Array.from(lab.state.backed),[s]);await backings().find(b=>b.textContent===s).onclick();await lab.draw();eq(lab.state.backed.size,0);}
for(const[id,key]of[['tgActors','actors'],['tgVisitor','visitors'],['tgFounder','founders'],['tgRoutes','routes'],['tgGrid','grid'],['tgContacts','contacts'],['tgBases','bases']]){await elements[id].onchange({target:{checked:false}});await lab.draw();eq(lab.state[key],false);await elements[id].onchange({target:{checked:true}});await lab.draw();eq(lab.state[key],true);}
const key=async k=>{let prevented=false;for(const fn of listeners.keydown)await fn({key:k,target:new Element(),preventDefault:()=>{prevented=true;}});await lab.draw();return prevented;};
await key('Escape');for(const[k,state]of[['g','grid'],['r','routes'],['a','actors'],['p','visitors'],['v','founders'],['c','contacts'],['f','bases']]){const before=lab.state[state];eq(await key(k),true);eq(lab.state[state],!before);await key(k);eq(lab.state[state],before);}
await key('d');eq(lab.state.doors.size,16);await key('b');eq(lab.state.backed.size,4);await key('Escape');eq(lab.state.doors.size,0);eq(lab.state.backed.size,0);eq(errors,[]);
// Chrome performance-warning regression: ignore the advisory even when Chrome
// labels it console.error; retain real page and application errors.
const require=createRequire(import.meta.url),{listen}=require('./browser-errors.cjs'),callbacks={},events=listen({on:(type,fn)=>{callbacks[type]=fn;}});
callbacks.console({type:()=> 'error',text:()=> 'Canvas2D: Multiple readback operations using getImageData are faster with the willReadFrequently attribute set to true.'});eq(events.errors.length,0);eq(events.ignoredCanvasPerformanceWarnings.length,1);
callbacks.pageerror(new Error('Real page exception'));callbacks.console({type:()=> 'error',text:()=> 'Missing proof image'});eq(events.errors.length,2);
callbacks.response({status:()=>404,url:()=>'/missing.png'});callbacks.requestfailed({url:()=>'/missing.js',failure:()=>({errorText:'net::ERR_FAILED'})});eq(events.errors.length,4);
callbacks.console({type:()=> 'warning',text:()=> 'Ordinary browser advisory'});eq(events.warnings.length,1);eq(events.errors.length,4);
callbacks.console({type:()=> 'error',text:()=> 'Real Canvas2D failure unrelated to the willReadFrequently attribute'});eq(events.errors.length,5);
fs.writeFileSync(path.join(here,'evidence/control-validation-report.json'),JSON.stringify({status:'PASS',checks,method:'Actual shipped handlers in Node DOM/native Canvas; browser CSS and browser accessibility remain pending.',errors,doorButtons:16,backingButtons:4,doorLabels:expected,doorModel:data.founderPresentation.doorModel},null,2)+'\n');
console.log('CONTROL VALIDATION PASS '+checks+' Node handler checks; 16 door buttons, 4 backing buttons, 4 bulk buttons, keyboard, real-error/performance-warning discrimination; browser pending');
