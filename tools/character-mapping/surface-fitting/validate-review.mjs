import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadImage } from '@napi-rs/canvas';
import { chromium } from 'playwright';

const root=resolve(import.meta.dirname,'../../..');
const reviewRoot=resolve(root,'artifacts/character-movement/surface-fitting/review');
const manifest=JSON.parse(readFileSync(resolve(reviewRoot,'manifest.json')));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
assert.equal(manifest.states.length,73);
assert.equal(new Set(manifest.states.map(state=>state.key)).size,73);
assert.equal(manifest.contactSheets.length,21);
assert.deepEqual(Object.keys(manifest.fragments).sort(),['jumping','movement','statics']);
for(const pin of Object.values(manifest.pins))assert.equal(sha(readFileSync(resolve(root,pin.path))),pin.sha256,`${pin.path} pin`);
for(const source of Object.values(manifest.sources)){assert.equal(sha(readFileSync(resolve(root,source.sourcePath))),source.sourceSha256,`${source.costumeId} immutable source`);assert.equal(sha(readFileSync(resolve(reviewRoot,source.file))),source.sha256,`${source.costumeId} crop`);assert.deepEqual(source.directions,['south','east','west','north']);}
for(const state of manifest.states){assert.equal(state.geometrySha256ByCostume['patient.adult.046'],state.approvedGeometrySha256);assert.equal(state.geometrySha256ByCostume['retained.gray-braid'],state.approvedGeometrySha256);for(const image of Object.values(state.images)){const bytes=readFileSync(resolve(reviewRoot,image.file));assert.equal(sha(bytes),image.sha256,`${state.key}/${image.file}`);const decoded=await loadImage(resolve(reviewRoot,image.file));assert.deepEqual([decoded.width,decoded.height],[image.width,image.height],`${state.key}/${image.file} dimensions`);}}
for(const sheet of manifest.contactSheets){assert.equal(sha(readFileSync(resolve(reviewRoot,sheet.file))),sheet.sha256,`${sheet.file} hash`);if(sheet.cell)assert.equal(sheet.nativeFrames,true);}
for(const atlas of Object.values(manifest.atlases)){assert.equal(sha(readFileSync(resolve(reviewRoot,atlas.file))),atlas.sha256,`${atlas.file} hash`);assert(atlas.quality==='lossless'||atlas.quality>=80);assert.deepEqual(atlas.variants,['green','gray','neutral','guide']);}
for(const fragment of Object.values(manifest.fragments)){assert(existsSync(fragment.file));const bytes=readFileSync(fragment.file);assert(bytes.length<1_000_000);assert.equal(sha(bytes),fragment.sha256);const text=bytes.toString('utf8');assert(!text.includes('<!doctype')&&!text.includes('<html')&&!text.includes('<body'));assert(!text.includes('fetch(')&&!text.includes('XMLHttpRequest')&&!text.includes('WebSocket'));}

const chrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
assert(existsSync(chrome),'installed Chrome required');
const browser=await chromium.launch({headless:true,executablePath:chrome});
const browserErrors=[];
const consoleErrors=[];
const screenshots=[];
const pauseChecks=[];
const responsiveChecks=[];
const stateSignatures={green:new Set(),gray:new Set()};
const fragmentInfo={movement:{modes:['walk','standing'],frame:[240,310]},jumping:{modes:['jumping'],frame:[280,350]},statics:{modes:['sitting','clipboard'],frame:[280,350]}};

async function openFragment(name,width){
  const page=await browser.newPage({viewport:{width,height:1100}});
  page.on('pageerror',error=>browserErrors.push(`${name}/${width}: ${error.message}`));
  page.on('console',message=>{if(message.type()==='error')consoleErrors.push(`${name}/${width}: ${message.text()}`);});
  const fragment=readFileSync(manifest.fragments[name].file,'utf8');
  await page.setContent(`<style>:root{--foreground:#20262b;--muted-foreground:#59636a;--primary:#315f78;--primary-foreground:#fff}.btn,.form-select{font:inherit;padding:6px 9px}.form-label{display:grid;gap:3px}</style>${fragment}`,{waitUntil:'load'});
  const id=`#approved-character-fitting-${name}`;
  await page.waitForFunction(selector=>document.querySelector(selector)?.dataset.ready==='true',id);
  return{page,id};
}
const signature=async(locator)=>locator.evaluate(canvas=>{const data=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;let value=2166136261;for(const byte of data){value^=byte;value=Math.imul(value,16777619);}return `${canvas.width}x${canvas.height}:${value>>>0}`;});
const exactPixels=locator=>locator.evaluate(canvas=>canvas.toDataURL('image/png'));

for(const[name,info]of Object.entries(fragmentInfo)){
  const{page,id}=await openFragment(name,736),rootLocator=page.locator(id),mode=rootLocator.locator('[data-mode]'),direction=rootLocator.locator('[data-direction]'),green=rootLocator.locator('[data-canvas="green"]'),gray=rootLocator.locator('[data-canvas="gray"]');
  for(const expectedMode of info.modes){
    await mode.selectOption(expectedMode);
    const states=manifest.states.filter(state=>state.mode===expectedMode);
    for(const state of states){
      if(expectedMode!=='standing')await direction.selectOption(state.direction);
      if(state.phase)await rootLocator.locator(`[data-phase="${state.phase}"]`).click();
      const greenSignature=await signature(green),graySignature=await signature(gray);assert.notEqual(greenSignature,graySignature,`${state.key} identities distinct`);stateSignatures.green.add(greenSignature);stateSignatures.gray.add(graySignature);
      const status=await rootLocator.locator('.acf-status').textContent();assert(status.includes(state.mode)&&status.includes(state.direction));if(state.phase)assert(status.includes(state.phase));
      assert.deepEqual(await green.evaluate(canvas=>[canvas.width,canvas.height,Math.round(canvas.getBoundingClientRect().width),Math.round(canvas.getBoundingClientRect().height)]),[...info.frame,...info.frame],`${state.key} native canvas`);
    }
  }
  if(name==='movement'){
    await mode.selectOption('walk');await direction.selectOption('north');await rootLocator.locator('[data-phase="03"]').click();const frozen=await exactPixels(green);await page.waitForTimeout(400);assert.equal(await exactPixels(green),frozen);pauseChecks.push('paused-400ms-exact');
    await rootLocator.locator('[data-play]').click();await page.waitForTimeout(100);assert.equal(await exactPixels(green),frozen,'resume must not jump immediately');await page.waitForTimeout(140);const advanced=await exactPixels(green);assert.notEqual(advanced,frozen,'animation must advance after 180ms');pauseChecks.push('resume-no-initial-jump');
    await rootLocator.locator('[data-play]').click();const pausedAgain=await exactPixels(green);await page.waitForTimeout(400);assert.equal(await exactPixels(green),pausedAgain);pauseChecks.push('repaused-exact');
    await mode.selectOption('standing');assert.equal(await direction.inputValue(),'south');assert.equal(await direction.isDisabled(),true);const staticPixels=await exactPixels(green);await page.waitForTimeout(400);assert.equal(await exactPixels(green),staticPixels);assert.equal(await rootLocator.locator('[data-play]').isDisabled(),true);assert.equal(await rootLocator.locator('[data-phase="01"]').isDisabled(),true);pauseChecks.push('standing-forces-south-static');
    const sourceHashes={green:new Set(),gray:new Set()};for(const sourceDirection of['south','east','west','north']){await mode.selectOption('walk');await direction.selectOption(sourceDirection);for(const sourceName of['green','gray'])sourceHashes[sourceName].add(await signature(rootLocator.locator(`[data-source="${sourceName}"]`)));}assert.equal(sourceHashes.green.size,4);assert.equal(sourceHashes.gray.size,4);assert.deepEqual(await rootLocator.locator('[data-source="green"]').evaluate(canvas=>[canvas.width,canvas.height,Math.round(canvas.getBoundingClientRect().width),Math.round(canvas.getBoundingClientRect().height)]),[256,340,256,340]);
  }else{
    const firstMode=info.modes[0];await mode.selectOption(firstMode);await direction.selectOption('south');assert.equal(await rootLocator.locator('[data-play]').isDisabled(),name==='statics');if(name==='statics'){const stable=await exactPixels(green);await page.waitForTimeout(400);assert.equal(await exactPixels(green),stable);pauseChecks.push('static-actions-stable');}
  }
  await rootLocator.locator('[data-view]').selectOption('fitted');const fittedGreen=await exactPixels(green),fittedGray=await exactPixels(gray);await rootLocator.locator('[data-view]').selectOption('neutral');assert.equal(await exactPixels(green),fittedGreen);assert.equal(await exactPixels(gray),fittedGray);assert.equal(await rootLocator.locator('[data-neutral-card]').isHidden(),false);assert.notEqual(await exactPixels(rootLocator.locator('[data-canvas="neutral"]')),fittedGreen);
  await rootLocator.locator('[data-view]').selectOption('guide');const guided=await exactPixels(green);assert.notEqual(guided,fittedGreen);const cyan=await green.evaluate(canvas=>{const data=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;let count=0;for(let i=0;i<data.length;i+=4)if(data[i]<90&&data[i+1]>140&&data[i+2]>150&&data[i+3]>80)count++;return count;});assert(cyan>40,`${name} actual guide cyan pixels`);
  const screenshot=resolve(reviewRoot,`review-${name}-736.png`);await page.screenshot({path:screenshot,fullPage:true});screenshots.push(screenshot);await page.close();
}
assert.equal(stateSignatures.green.size,73,'Green canvas must expose 73 distinct states');
assert.equal(stateSignatures.gray.size,73,'Gray canvas must expose 73 distinct states');

for(const width of[320,736,1024])for(const name of Object.keys(fragmentInfo)){
  const{page,id}=await openFragment(name,width),rootLocator=page.locator(id);for(const details of await rootLocator.locator('details').all())await details.evaluate(element=>element.open=true);const fits=await page.evaluate(selector=>{const root=document.querySelector(selector),rect=root.getBoundingClientRect();return document.documentElement.scrollWidth<=document.documentElement.clientWidth&&root.scrollWidth<=Math.ceil(rect.width);},id);assert.equal(fits,true,`${name}/${width} responsive overflow`);responsiveChecks.push(`${name}-${width}`);if(width===320){const screenshot=resolve(reviewRoot,`review-${name}-320.png`);await page.screenshot({path:screenshot,fullPage:true});screenshots.push(screenshot);}await page.close();
}
await browser.close();
assert.deepEqual(browserErrors,[]);
assert.deepEqual(consoleErrors,[]);
const report={states:73,distinctGreen:stateSignatures.green.size,distinctGray:stateSignatures.gray.size,pauseChecks,responsiveChecks,guideOverlays:3,sourceDirections:8,fragmentBytes:Object.fromEntries(Object.entries(manifest.fragments).map(([name,item])=>[name,item.bytes])),screenshots,browserErrors,consoleErrors};
writeFileSync(resolve(reviewRoot,'browser-validation.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
