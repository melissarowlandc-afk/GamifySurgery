import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const fragment = await readFile(path.join(here, 'examination-layout.html'), 'utf8');
const evidence = path.join(here, 'evidence');
const browser = await chromium.launch({ headless: true, executablePath: process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : undefined });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const pageErrors = [];
page.on('pageerror', error => pageErrors.push(error.message));
page.on('console', message => { if (message.type() === 'error') pageErrors.push(message.text()); });
await page.setContent(`<main>${fragment}</main>`, { waitUntil: 'load' });
await page.waitForFunction(() => window.__examinationLayout?.atlasReady());

const stateAudit = await page.evaluate(() => {
  const model = window.__examinationLayout, failures = [];
  const inflated = { left:model.tableFootprint.left-model.actorRadius-model.clearanceMargin, top:model.tableFootprint.top-model.actorRadius-model.clearanceMargin, right:model.tableFootprint.left+model.tableFootprint.width+model.actorRadius+model.clearanceMargin, bottom:model.tableFootprint.top+model.tableFootprint.height+model.actorRadius+model.clearanceMargin };
  for(let mask=0;mask<1024;mask++){
    const result=model.evaluate(mask),active=model.segments.filter((_,i)=>mask&(1<<i));
    if(result.active.join(',')!==active.join(','))failures.push({mask,issue:'active state'});
    if(result.reachable!==10)failures.push({mask,reachable:result.reachable});
    const wanted={sink:Boolean(mask&((1<<0)|(1<<6))),stool:false,diagnostic:Boolean(mask&(1<<1)),table:false};
    for(const [id,hidden] of Object.entries(wanted))if(result.hidden.includes(id)!==hidden)failures.push({mask,id,issue:'visibility'});
    for(const [id,route] of Object.entries(result.routes)){
      if(!route.length)failures.push({mask,id,issue:'unreachable'});
      for(const point of route)if(point.x>=inflated.left&&point.x<=inflated.right&&point.y>=inflated.top&&point.y<=inflated.bottom)failures.push({mask,id,point,issue:'route crosses inflated bed'});
    }
    if(!result.patientApproachRoute.length)failures.push({mask,issue:'patient approach unreachable'});
    for(const point of result.patientApproachRoute)if(point.x>=inflated.left&&point.x<=inflated.right&&point.y>=inflated.top&&point.y<=inflated.bottom)failures.push({mask,point,issue:'patient route crosses inflated bed'});
  }
  return failures;
});
if(stateAudit.length)throw new Error(JSON.stringify(stateAudit.slice(0,8)));

const primary = await page.evaluate(() => {
  const art=document.querySelector('#exam-art');
  return {surface:JSON.parse(art.dataset.surface),table:JSON.parse(art.dataset.table),renderedFixtures:JSON.parse(art.dataset.fixtures),fixtures:window.__examinationLayout.fixtures,crops:window.__examinationLayout.crops,bedCrop:window.__examinationLayout.bedCrop,openings:art.dataset.openings,legendHidden:document.querySelector('#exam-seat-legend').hidden,doorControls:[...document.querySelectorAll('.exam-primary [data-segment]')].filter(el=>el.getBoundingClientRect().width>0).length,adjacencyControls:[...document.querySelectorAll('[data-adjacent]')].filter(el=>el.getBoundingClientRect().width>0).length,hitTargets:document.querySelectorAll('#exam-targets [data-segment]').length};
});
const s=primary.surface;
if(s.logicalCols!==3||s.logicalRows!==2||s.visualCols!==12||s.visualRows!==8||s.doorCount!==10||s.northAdjacencySlots!==3||s.sideCapWidth!==14||s.openingOwnership!=='neighbor-transparent'||s.sideDoorSeam!=='half-thickness'||s.southDoorSeam!=='current-floor-to-wall-base'||s.southOpeningOwnership!=='current-room-to-wall-base'||s.tablePersistence!=='permanent'||s.tableCollision!=='solid'||s.stoolPersistence!=='permanent'||s.stoolCollision!=='nonblocking'||s.navigation!=='20-subcells-per-tile'||s.actorRadius!==.18||s.clearanceMargin!==.03||primary.doorControls!==10||primary.adjacencyControls!==3||primary.hitTargets!==10||primary.openings!=='S2'||!primary.legendHidden)throw new Error(JSON.stringify({primary}));
const rules=Object.fromEntries(primary.fixtures.map(item=>[item.id,item]));
if(rules.table.persistence!=='permanent'||rules.table.collision!=='solid'||rules.table.segments.length||rules.stool.persistence!=='permanent'||rules.stool.collision!=='nonblocking'||rules.stool.segments.length||rules.sink.persistence!=='optional'||rules.sink.collision!=='nonblocking'||rules.diagnostic.persistence!=='wall-attached'||rules.diagnostic.collision!=='nonblocking')throw new Error(JSON.stringify({fixtures:primary.fixtures}));

const expectedCrops={sink:{box:[0,0,322,426],base:[40,282,426],source:[763,157,322,426]},stool:{box:[322,69,264,357],base:[124,140,357],source:[201,799,264,357],seatEdgeY:134},diagnostic:{box:[586,88,296,338],base:[99,120,338],source:[780,792,296,338]}};
for(const [id,expected] of Object.entries(expectedCrops)){
  const crop=primary.crops[id];
  if(!crop||[crop.x,crop.y,crop.w,crop.h].some((value,i)=>value!==expected.box[i])||[crop.base.left,crop.base.right,crop.base.bottom].some((value,i)=>value!==expected.base[i])||[crop.source.x,crop.source.y,crop.source.w,crop.source.h].some((value,i)=>value!==expected.source[i])||(expected.seatEdgeY&&crop.seatEdgeY!==expected.seatEdgeY))throw new Error(JSON.stringify({id,crop,expected}));
}
const bed=primary.bedCrop;
if([bed.x,bed.y,bed.w,bed.h].some((v,i)=>v!==[0,0,1077,586][i])||[bed.base.left,bed.base.right,bed.base.bottom].some((v,i)=>v!==[62,1000,586][i])||[bed.source.x,bed.source.y,bed.source.w,bed.source.h].some((v,i)=>v!==[259,205,1077,586][i])||bed.seatEdgeY!==340)throw new Error(JSON.stringify({bed}));
const t=primary.table;
if(Math.abs(t.footprint.left-1.30)>.001||Math.abs(t.footprint.top-.65)>.001||Math.abs(t.footprint.width-1.55)>.001||Math.abs(t.footprint.height-.70)>.001||Math.abs(t.draw.width-186)>.01||Math.abs(t.draw.baseY-302)>.01||t.draw.head!=='east'||t.draw.foot!=='west'||t.patientSeat.facing!=='west'||t.founderSeat.facing!=='east'||t.patientApproach.x>=t.footprint.left||t.seatKneeGap<=0||Math.abs(primary.renderedFixtures.stool.width-60)>.01)throw new Error(JSON.stringify({table:t,stool:primary.renderedFixtures.stool}));

await page.getByLabel('Room orientation').selectOption('90');
const westView=await page.evaluate(()=>{const art=document.querySelector('#exam-art'),model=window.__examinationLayout;return{surface:JSON.parse(art.dataset.surface),table:JSON.parse(art.dataset.table),fixtures:JSON.parse(art.dataset.fixtures),doors:[...document.querySelectorAll('.exam-primary [data-segment]')].map(el=>[el.dataset.segment,el.dataset.localSegment]),adjacency:document.querySelectorAll('[data-adjacent]').length,height:art.height,hidden:art.dataset.hidden,rotated:model.rotateRect(model.tableFootprint)}});
if(westView.surface.logicalCols!==2||westView.surface.logicalRows!==3||westView.surface.orientation!==90||westView.surface.northAdjacencySlots!==2||westView.height!==570||westView.doors.length!==10||westView.adjacency!==2||Math.abs(westView.table.footprint.left-.65)>.001||Math.abs(westView.table.footprint.top-.15)>.001||Math.abs(westView.table.footprint.width-.70)>.001||Math.abs(westView.table.footprint.height-1.55)>.001||JSON.stringify(westView.table.footprint)!==JSON.stringify(westView.rotated)||westView.table.draw.head!=='north'||westView.table.draw.foot!=='south'||Math.abs(westView.fixtures.stool.center.x-1)>.001||Math.abs(westView.fixtures.stool.center.y-2.22)>.001||Math.abs(westView.fixtures.stool.footprint.left-.75)>.001||Math.abs(westView.fixtures.stool.footprint.top-1.97)>.001||Math.abs(westView.fixtures.stool.baseY-(140+2.47*120))>.01||westView.table.patientSeat.facing!=='south'||westView.table.founderSeat.facing!=='north'||Math.abs(westView.table.patientFloorProjection.x-1.35)>.001||Math.abs(westView.table.patientFloorProjection.y-1.85)>.001||Math.abs(westView.table.founderFloorProjection.x-1.25)>.001||Math.abs(westView.table.founderFloorProjection.y-2.22)>.001||!westView.hidden.includes('diagnostic')||!westView.fixtures.sink||Math.abs(westView.fixtures.sink.width-62.4)>.01||Math.abs(westView.fixtures.sink.width/westView.fixtures.sink.height-397/827)>.0001||westView.doors.map(([w,l])=>`${w}:${l}`).join(',')!=='N1:EA,N2:EB,S1:WA,S2:WB,WA:N3,WB:N2,WC:N1,EA:S3,EB:S2,EC:S1')throw new Error(JSON.stringify({westView}));
const geometricDoorMap=await page.evaluate(()=>{const m=window.__examinationLayout,local={N1:{x:.5,y:0},N2:{x:1.5,y:0},N3:{x:2.5,y:0},S1:{x:.5,y:2},S2:{x:1.5,y:2},S3:{x:2.5,y:2},WA:{x:0,y:.5},WB:{x:0,y:1.5},EA:{x:3,y:.5},EB:{x:3,y:1.5}},world={N1:{x:.5,y:0},N2:{x:1.5,y:0},S1:{x:.5,y:3},S2:{x:1.5,y:3},WA:{x:0,y:.5},WB:{x:0,y:1.5},WC:{x:0,y:2.5},EA:{x:2,y:.5},EB:{x:2,y:1.5},EC:{x:2,y:2.5}},failures=[];for(const [id,p] of Object.entries(local)){const q=m.rotatePoint(p),match=Object.entries(world).find(([,w])=>Math.abs(w.x-q.x)<.001&&Math.abs(w.y-q.y)<.001)?.[0];if(!match||m.worldToLocal(match)!==id)failures.push({id,q,match,mapped:match&&m.worldToLocal(match)})}return failures});
if(geometricDoorMap.length)throw new Error(JSON.stringify({geometricDoorMap}));
for(const [id,hidden] of [['S1',true],['S2',false],['WC',true]]){await page.getByRole('button',{name:`Wall door ${id}`}).click();const state=await page.evaluate(()=>{const art=document.querySelector('#exam-art');return{hidden:art.dataset.hidden.split(',').filter(Boolean),sink:JSON.parse(art.dataset.fixtures).sink}});if(state.hidden.includes('sink')!==hidden||Boolean(state.sink)===hidden)throw new Error(JSON.stringify({id,hidden,state}));await page.getByRole('button',{name:`Wall door ${id}`}).click()}
const westMaskAudit=await page.evaluate(()=>{const m=window.__examinationLayout,failures=[];for(let mask=0;mask<1024;mask++){const result=m.evaluate(mask),world=result.active.map(m.localToWorld);if(result.reachable!==10||new Set(world).size!==result.active.length)failures.push({mask,reachable:result.reachable,world});for(const local of result.active)if(m.worldToLocal(m.localToWorld(local))!==local)failures.push({mask,local,issue:'mapping roundtrip'});for(const route of Object.values(result.routes))for(const p of route){const q=m.rotatePoint(p);if(q.x<m.actorRadius||q.x>2-m.actorRadius||q.y<m.actorRadius||q.y>3-m.actorRadius)failures.push({mask,q,issue:'rotated route outside'})}}return failures});
if(westMaskAudit.length)throw new Error(JSON.stringify(westMaskAudit.slice(0,6)));
for(let mask=0;mask<4;mask++){for(let i=0;i<2;i++){const input=page.getByLabel(`N${i+1}`,{exact:true}),want=Boolean(mask&(1<<i));if((await input.isChecked())!==want)await input.click()}const got=await page.locator('#exam-art').getAttribute('data-adjacency');const expected=[1,2].filter(i=>mask&(1<<(i-1))).map(i=>`N${i}`).join(',');if(got!==expected)throw new Error(JSON.stringify({mask,got,expected}));const pixels=await page.evaluate(()=>{const a=document.querySelector('#exam-art'),c=a.getContext('2d'),p=(x,y)=>[...c.getImageData(x,y,1,1).data];return{above:[p(240,80),p(360,80)],corners:[p(168,42),p(418,42)]}});for(let i=0;i<2;i++)if(Boolean(mask&(1<<i))!==(pixels.above[i][3]===0))throw new Error(JSON.stringify({mask,pixels,issue:'west-view adjacency alpha'}))}
for(let i=1;i<=2;i++){const input=page.getByLabel(`N${i}`,{exact:true});if(await input.isChecked())await input.click()}
await page.getByRole('button',{name:'Wall door EB'}).click();
const westApertures={};for(const id of ['N1','N2','S1','S2','WA','WB','WC','EA','EB','EC']){await page.getByRole('button',{name:`Wall door ${id}`}).click();westApertures[id]=await page.evaluate(id=>{const a=document.querySelector('#exam-art'),c=a.getContext('2d'),p=(x,y)=>[...c.getImageData(x,y,1,1).data],i=id[0]==='N'||id[0]==='S'?Number(id[1])-1:'ABC'.indexOf(id[1]);if(id[0]==='N')return{air:p(180+i*120+60,90),header:p(180+i*120+60,55)};if(id[0]==='S')return{toBase:p(180+i*120+60,520),after:p(180+i*120+60,529)};const yy=140+i*120+60;return id[0]==='W'?{outer:[...Array(7)].map((_,n)=>p(168+n,yy)[3]),inner:[...Array(7)].map((_,n)=>p(175+n,yy)[3])}:{inner:[...Array(7)].map((_,n)=>p(418+n,yy)[3]),outer:[...Array(7)].map((_,n)=>p(425+n,yy)[3])}},id);await page.getByRole('button',{name:`Wall door ${id}`}).click()}
for(const [id,sample] of Object.entries(westApertures)){if(id[0]==='N'&&(sample.air[3]!==0||sample.header[3]!==255))throw new Error(JSON.stringify({id,sample}));if((id[0]==='W'||id[0]==='E')&&(sample.outer.some(a=>a!==0)||sample.inner.some(a=>a!==255)))throw new Error(JSON.stringify({id,sample}));if(id[0]==='S'&&(sample.toBase[3]!==255||sample.after.slice(0,3).some((v,i)=>v!==[243,234,211][i])))throw new Error(JSON.stringify({id,sample}))}
await page.getByLabel('Room orientation').selectOption('0');

const adjacencyAudit = await page.evaluate(() => {
  const inputs=[...document.querySelectorAll('[data-adjacent]')],art=document.querySelector('#exam-art'),ctx=art.getContext('2d'),pixel=(x,y)=>[...ctx.getImageData(x,y,1,1).data],failures=[];
  for(let mask=0;mask<8;mask++){
    inputs.forEach((input,i)=>{const wanted=Boolean(mask&(1<<i));if(input.checked!==wanted)input.click()});
    const expected=inputs.filter((_,i)=>mask&(1<<i)).map(input=>input.dataset.adjacent),active=art.dataset.adjacency?art.dataset.adjacency.split(','):[],hidden=art.dataset.hidden?art.dataset.hidden.split(','):[],slots=JSON.parse(art.dataset.slots),samples=[180,300,420];
    if(active.join(',')!==expected.join(','))failures.push({mask,active,expected});
    if(hidden.includes('diagnostic')!==Boolean(mask&2))failures.push({mask,hidden,issue:'diagnostic adjacency visibility'});
    if(hidden.includes('sink')||hidden.includes('stool')||hidden.includes('table'))failures.push({mask,hidden,issue:'floor fixture hidden by adjacency'});
    for(let i=0;i<3;i++){const low=Boolean(mask&(1<<i)),slot=slots[`N${i+1}`];if(slot.y!==(low?111:50)||slot.h!==(low?29:90))failures.push({mask,slot});if(low&&pixel(samples[i],80)[3]!==0)failures.push({mask,i,issue:'neighbor-owned area not transparent'})}
    const leftLow=Boolean(mask&1),rightLow=Boolean(mask&4);if(pixel(110,leftLow?112:42)[3]!==255||pixel(489,rightLow?112:42)[3]!==255)failures.push({mask,issue:'side cap endpoint'});
  }
  inputs.forEach(input=>{if(input.checked)input.click()});
  return failures;
});
if(adjacencyAudit.length)throw new Error(JSON.stringify(adjacencyAudit.slice(0,6)));

await page.getByRole('button',{name:'Toggle door at S2'}).click();
const apertureAudit = await page.evaluate(() => {
  const art=document.querySelector('#exam-art'),ctx=art.getContext('2d'),pixel=(x,y)=>[...ctx.getImageData(x,y,1,1).data],results={};
  for(const id of window.__examinationLayout.segments){
    document.querySelector(`.exam-primary [data-segment="${id}"]`).click();
    const i=id[0]==='N'||id[0]==='S'?Number(id[1])-1:(id[1]==='A'?0:1),samples={};
    if(id[0]==='N'){samples.neighbor=pixel(120+i*120+60,90);samples.header=pixel(120+i*120+60,53)}
    else if(id[0]==='W'){const yy=140+i*120+60;samples.neighborBand=Array.from({length:7},(_,n)=>pixel(108+n,yy)[3]);samples.roomBand=Array.from({length:7},(_,n)=>pixel(115+n,yy)[3])}
    else if(id[0]==='E'){const yy=140+i*120+60;samples.neighborBand=Array.from({length:7},(_,n)=>pixel(485+n,yy)[3]);samples.roomBand=Array.from({length:7},(_,n)=>pixel(478+n,yy)[3])}
    else{const xx=120+i*120+60;samples.toBase=[374,380,390,400,408].map(yy=>pixel(xx,yy));samples.afterBase=pixel(xx,410)}
    results[id]={hidden:art.dataset.hidden,samples};
    document.querySelector(`.exam-primary [data-segment="${id}"]`).click();
  }
  return results;
});
for(const [id,{hidden,samples}] of Object.entries(apertureAudit)){
  if(id[0]==='N'&&(samples.neighbor[3]!==0||samples.header[3]!==255))throw new Error(JSON.stringify({id,samples,issue:'tall north aperture/header'}));
  if((id[0]==='W'||id[0]==='E')&&(samples.neighborBand.some(a=>a!==0)||samples.roomBand.some(a=>a!==255)))throw new Error(JSON.stringify({id,samples,issue:'side midpoint ownership'}));
  if(id[0]==='S'&&(samples.toBase.some(p=>p[3]!==255)||samples.afterBase.some((v,i)=>v!==[243,234,211,255][i])))throw new Error(JSON.stringify({id,samples,issue:'south floor must reach wall base without spilling beyond'}));
  const expectedHidden=id==='N1'||id==='WA'?'sink':id==='N2'?'diagnostic':null;
  if(Boolean(expectedHidden)!==Boolean(expectedHidden&&hidden.includes(expectedHidden)))throw new Error(JSON.stringify({id,hidden,expectedHidden}));
  if(hidden.includes('table')||hidden.includes('stool'))throw new Error(`permanent fixture hidden for ${id}`);
}

await page.getByRole('button',{name:'Toggle door at N2'}).click();
await page.getByLabel('N2',{exact:true}).check();
const lowNorth = await page.evaluate(() => {const art=document.querySelector('#exam-art'),ctx=art.getContext('2d'),p=(x,y)=>[...ctx.getImageData(x,y,1,1).data];return{hidden:art.dataset.hidden,above:p(300,80),opening:p(300,125),headerAir:p(300,106),jamb:p(250,125)}});
if(!lowNorth.hidden.includes('diagnostic')||lowNorth.hidden.includes('stool')||lowNorth.above[3]!==0||lowNorth.opening[3]!==0||lowNorth.headerAir[3]!==0||lowNorth.jamb[3]!==255)throw new Error(JSON.stringify({lowNorth}));
await page.getByLabel('N2',{exact:true}).uncheck();
await page.getByRole('button',{name:'Toggle door at N2'}).click();

const hitAudit=await page.evaluate(()=>{const art=document.querySelector('#exam-art').getBoundingClientRect(),slots=JSON.parse(document.querySelector('#exam-art').dataset.slots);return Object.fromEntries([...document.querySelectorAll('#exam-targets [data-segment]')].map(el=>{const r=el.getBoundingClientRect(),s=slots[el.dataset.segment];return[el.dataset.segment,{actual:[r.left-art.left,r.top-art.top,r.width,r.height],expected:[s.x/600*art.width,s.y/450*art.height,s.w/600*art.width,s.h/450*art.height]}]}))});
for(const [id,{actual,expected}] of Object.entries(hitAudit))if(actual.some((v,i)=>Math.abs(v-expected[i])>1.5))throw new Error(JSON.stringify({id,actual,expected}));

await page.getByLabel('Show walking space and footprints').check();
const overlay=await page.evaluate(()=>({legendHidden:document.querySelector('#exam-seat-legend').hidden,table:JSON.parse(document.querySelector('#exam-art').dataset.table)}));
if(overlay.legendHidden||overlay.table.patientSeat.y===overlay.table.patientFloorProjection.y||overlay.table.founderSeat.y===overlay.table.founderFloorProjection.y)throw new Error(JSON.stringify({overlay}));
await mkdir(evidence,{recursive:true});
await page.screenshot({path:path.join(evidence,'examination-layout-desktop.png'),fullPage:true});
await page.setViewportSize({width:320,height:840});
await page.screenshot({path:path.join(evidence,'examination-layout-320.png'),fullPage:true});
const narrow=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>window.innerWidth,doors:[...document.querySelectorAll('.exam-primary [data-segment]')].filter(el=>el.getBoundingClientRect().width>0).length,adjacency:[...document.querySelectorAll('[data-adjacent]')].filter(el=>el.getBoundingClientRect().width>0).length}));
if(narrow.overflow||narrow.doors!==10||narrow.adjacency!==3||pageErrors.length)throw new Error(JSON.stringify({narrow,pageErrors}));
await browser.close();
console.log('PASS original+west 1024 physical door masks; 8+4 north-adjacency masks; geometric door mapping + roundtrips; 10 apertures; west sink S1/S2/WC visibility; transformed bed/stool/seat anchors; desktop/320 controls');


