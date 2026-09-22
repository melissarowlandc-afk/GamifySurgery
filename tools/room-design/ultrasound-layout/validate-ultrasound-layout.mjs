import {readFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const here=path.dirname(fileURLToPath(import.meta.url));
const fragmentPath=path.join(here,'ultrasound-layout.html');
const evidence=path.join(here,'evidence');
const fragment=await readFile(fragmentPath,'utf8');
if(Buffer.byteLength(fragment,'utf8')>=1_000_000)throw new Error('fragment must remain under 1 MB');
const browser=await chromium.launch({headless:true,executablePath:process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':undefined});
const page=await browser.newPage({viewport:{width:900,height:940}}),errors=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});
await page.setContent(`<main>${fragment}</main>`);
await page.waitForFunction(()=>window.__ultrasoundLayout?.ready());

const audit=await page.evaluate(()=>{
  const model=window.__ultrasoundLayout,failures=[];
  const validate=(name,route)=>{
    if(!route.length){failures.push({name,issue:'empty'});return}
    for(let index=0;index<route.length;index++){
      if(!model.validPoint(route[index]))failures.push({name,point:route[index],issue:'invalid node'});
      if(!index)continue;
      const a=route[index-1],b=route[index];
      if(Math.abs(a.x-b.x)>.001&&Math.abs(a.y-b.y)>.001)failures.push({name,a,b,issue:'diagonal'});
      for(let sample=0;sample<=20;sample++){
        const t=sample/20,point={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};
        if(!model.validPoint(point))failures.push({name,point,issue:'segment collision'});
      }
    }
  };
  const routes=model.routes(),services=model.serviceRoutes();
  for(const[id,route]of Object.entries(routes))validate(id,route);
  for(const[id,route]of Object.entries(services))validate(id,route);
  const tileCenters=[];
  for(let row=0;row<3;row++)for(let col=0;col<3;col++){
    const id=`${String.fromCharCode(65+row)}${col+1}`,point={x:col+.5,y:row+.5},route=model.bfs(model.start,point);
    tileCenters.push({id,valid:model.validPoint(point),reachable:Boolean(route.length)});
    if(id!=='B2')validate(`tile-${id}`,route);
  }
  const canvas=document.querySelector('#ultrasound-art');
  return{segments:model.segments,fixtures:model.fixtures,crops:model.crops,radius:model.radius,navigationBlocker:model.navigationBlocker,southPassage:model.southPassage,routes,services,tileCenters,failures,shell:JSON.parse(canvas.dataset.shell),draws:JSON.parse(canvas.dataset.fixtures)};
});

if(audit.segments.join(',')!=='N1,N2,N3,S1,S2,S3,WA,WB,WC,EA,EB,EC'||audit.failures.length||Object.values(audit.routes).some(route=>!route.length)||Object.values(audit.services).some(route=>!route.length))throw new Error(JSON.stringify({audit,issue:'route contract'}));
for(const[id,route]of Object.entries(audit.routes)){
  const end=route.at(-1),horizontal=id[0]==='N'||id[0]==='S',index=horizontal?Number(id[1])-1:id.charCodeAt(1)-65;
  const offset=(horizontal?end.x:end.y)-index,boundary=horizontal?end.y:end.x,expected=(id[0]==='N'||id[0]==='W')?.16:2.84;
  if(offset<.1+audit.radius-1e-6||offset>.9-audit.radius+1e-6||Math.abs(boundary-expected)>.001)throw new Error(JSON.stringify({id,end,offset,boundary,issue:'aperture margin'}));
}
if(JSON.stringify(audit.navigationBlocker)!==JSON.stringify({left:1,top:1,width:1,height:1})||audit.tileCenters.find(item=>item.id==='B2').valid||audit.tileCenters.find(item=>item.id==='B2').reachable||audit.tileCenters.some(item=>item.id!=='B2'&&(!item.valid||!item.reachable)))throw new Error(JSON.stringify({blocker:audit.navigationBlocker,tileCenters:audit.tileCenters,issue:'B2-only navigation'}));

for(const id of ['table','stool','console']){
  const fixture=audit.fixtures[id];
  if(fixture.persistence!=='permanent'||(id==='table'?fixture.collision!=='solid':fixture.collision!=='nonblocking'))throw new Error(JSON.stringify({id,fixture,issue:'permanent fixture'}));
}
if(audit.fixtures.sink||audit.crops.sink)throw new Error('sink leaked into revised ultrasound proof');
if(audit.fixtures.cabinet.persistence!=='optional'||audit.fixtures.cabinet.collision!=='nonblocking'||audit.fixtures.wallPrint?.persistence!=='optional'||audit.fixtures.wallPrint?.collision!=='nonblocking'||audit.fixtures.wallPrint?.mount!=='north wall')throw new Error('optional decor contract failed');
if(audit.fixtures.trolley||audit.fixtures.wallLamp||audit.crops.trolley||audit.crops.wallLamp||audit.crops.light)throw new Error('procedure-only fixture leaked into ultrasound proof');
if(JSON.stringify(audit.fixtures.table.footprint)!==JSON.stringify({left:.6,top:1.1,width:1.8,height:.65})||JSON.stringify(audit.fixtures.table.anchor)!==JSON.stringify({x:1.5,y:1.75})||JSON.stringify(audit.fixtures.table.seat.floorProjection)!==JSON.stringify({x:2.2,y:1.75})||JSON.stringify(audit.fixtures.table.approach)!==JSON.stringify({x:2.2,y:2.2})||JSON.stringify(audit.fixtures.console.footprint)!==JSON.stringify({left:.55,top:2.0,width:.5,height:.33})||JSON.stringify(audit.fixtures.console.anchor)!==JSON.stringify({x:.8,y:2.33})||JSON.stringify(audit.fixtures.console.approach)!==JSON.stringify({x:.8,y:2.84})||audit.fixtures.console.facing!=='S'||audit.fixtures.console.operatorFacing!=='N'||audit.fixtures.console.approachFacing!=='N'||audit.fixtures.stool.anchor.x!==2.2||audit.fixtures.stool.anchor.y!==2.75||audit.fixtures.stool.facing!=='N'||audit.fixtures.table.facing!=='S')throw new Error(JSON.stringify({fixtures:audit.fixtures,issue:'ultrasound placement'}));
if(audit.fixtures.cabinet.footprint.top!==0||audit.fixtures.cabinet.anchor.x!==.39||audit.fixtures.cabinet.anchor.y!==.38||audit.fixtures.cabinet.conflicts.join(',')!=='N1,WA')throw new Error('northwest cabinet registration failed');
if(audit.fixtures.wallPrint.anchor.x!==1.5||audit.fixtures.wallPrint.anchor.y!==-.52||audit.fixtures.wallPrint.conflicts.join(',')!=='N2'||audit.draws.find(item=>item.id==='wallPrint').draw.w!==48)throw new Error('N2 wall-print registration failed');
if(audit.shell.logicalCols!==3||audit.shell.logicalRows!==3||audit.shell.tileSize!==120||audit.shell.rearWallHeight!==90||audit.shell.lowNorthHeight!==29||audit.shell.sideCapWidth!==14||audit.shell.southHeight!==29||audit.shell.northLowHeader!==false||audit.shell.sideDoorSeam!=='half-thickness'||audit.shell.southFloorToBase!==true)throw new Error(JSON.stringify({shell:audit.shell,issue:'shell contract'}));

for(const item of audit.draws){
  if(!item.draw)continue;
  const crop=audit.crops[item.id],draw=item.draw;
  if(Math.abs(draw.contactX-(60+item.anchor.x*120))>.02||Math.abs(draw.contactY-(130+item.anchor.y*120))>.02||Math.abs(draw.w/draw.h-draw.aspect)>.001||draw.sourceContact.x!==crop.contactX||draw.sourceContact.y!==crop.contactY)throw new Error(JSON.stringify({item,crop,issue:'contact/aspect'}));
}
const tableAudit=audit.draws.find(item=>item.id==='table'),stoolAudit=audit.draws.find(item=>item.id==='stool'),consoleAudit=audit.draws.find(item=>item.id==='console');
for(const item of [tableAudit,stoolAudit]){
  const crop=audit.crops[item.id],draw=item.draw,expectedRise=(crop.contactY-crop.seatY)*(draw.w/crop.w),floor=item.seat.floorProjection;
  if(!draw.seatScreen||Math.abs(draw.seatRise-expectedRise)>.02||Math.abs(draw.seatScreen.y-(draw.contactY-draw.seatRise))>.02|| (item.id==='stool' && (Math.abs(floor.x-item.anchor.x)>.001||Math.abs(floor.y-item.anchor.y)>.001)) || (item.id==='table' && (Math.abs(floor.x-2.2)>.001||Math.abs(floor.y-1.75)>.001)) ||Math.hypot(item.approach.x-floor.x,item.approach.y-floor.y)<.05)throw new Error(JSON.stringify({item,crop,issue:'seat/floor/approach'}));
}
if(Math.abs(consoleAudit.draw.w/120-.78)>.001||consoleAudit.draw.sourceContact.x!==144||consoleAudit.draw.sourceContact.y!==604)throw new Error(JSON.stringify({consoleAudit,issue:'console registration'}));
const passage=await page.evaluate(()=>{const model=window.__ultrasoundLayout,consoleFixture=model.fixtures.console,points=[];for(let x=.2;x<=1.4001;x+=.04)points.push({x:+x.toFixed(2),y:2.7});return {points,route:model.bfs(points[0],points.at(-1)),consoleBottom:consoleFixture.footprint.top+consoleFixture.footprint.height,approach:model.bfs(model.start,consoleFixture.approach)};});
if(JSON.stringify(audit.southPassage)!==JSON.stringify({from:{x:.2,y:2.7},to:{x:1.4,y:2.7},layer:'front-of-console',clearanceFromConsole:.37})||passage.consoleBottom!==2.33||passage.points.some(point=>point.y<=passage.consoleBottom)||!passage.route.length||!passage.approach.length)throw new Error(JSON.stringify({passage,issue:'console south passage or approach'}));
if(Math.abs(tableAudit.draw.seatScreen.x-stoolAudit.draw.seatScreen.x)>.02)throw new Error(JSON.stringify({tableSeat:tableAudit.draw.seatScreen,stoolSeat:stoolAudit.draw.seatScreen,issue:'patient-technician shared-x screen alignment'}));

const controls=await page.evaluate(()=>({buttons:[...document.querySelectorAll('.ultrasound-controls [data-segment]')].map(element=>element.dataset.segment),hits:document.querySelectorAll('#ultrasound-targets [data-segment]').length,adj:document.querySelectorAll('[data-adjacent]').length,canvas:document.querySelector('#ultrasound-art').getBoundingClientRect().width}));
if(controls.buttons.join(',')!==audit.segments.join(',')||controls.hits!==12||controls.adj!==3||Math.abs(controls.canvas-480)>1)throw new Error(JSON.stringify({controls}));
for(const id of audit.segments){
  const button=page.getByRole('button',{name:`Toggle door at ${id}`}),before=await button.getAttribute('aria-pressed');
  await button.click();
  if(await button.getAttribute('aria-pressed')===before)throw new Error(`${id} control failed`);
  const permanent=JSON.parse(await page.locator('#ultrasound-art').getAttribute('data-fixtures')).filter(item=>['table','stool','console'].includes(item.id));
  if(permanent.some(item=>!item.draw))throw new Error(`${id} hid permanent equipment`);
  await button.click();
}
const optionalAudit=async(action,expected)=>{
  await action();
  const hidden=(await page.locator('#ultrasound-art').getAttribute('data-hidden')).split(',').filter(Boolean);
  if(expected.some(id=>!hidden.includes(id))||hidden.some(id=>!expected.includes(id)))throw new Error(JSON.stringify({hidden,expected,issue:'optional visibility'}));
};
await optionalAudit(()=>page.getByRole('button',{name:'Toggle door at WA'}).click(),['cabinet']);await page.getByRole('button',{name:'Toggle door at WA'}).click();
await optionalAudit(()=>page.getByRole('button',{name:'Toggle door at N1'}).click(),['cabinet']);await page.getByRole('button',{name:'Toggle door at N1'}).click();
await optionalAudit(()=>page.getByRole('button',{name:'Toggle door at N2'}).click(),['wallPrint']);await page.getByRole('button',{name:'Toggle door at N2'}).click();
await optionalAudit(()=>page.getByLabel('Show optional cabinet and wall print').uncheck(),['cabinet','wallPrint']);await page.getByLabel('Show optional cabinet and wall print').check();

const adjacencyAudit=await page.evaluate(()=>{
  const inputs=[...document.querySelectorAll('[data-adjacent]')],canvas=document.querySelector('#ultrasound-art'),ctx=canvas.getContext('2d'),failures=[],pixel=(x,y)=>[...ctx.getImageData(x*2,y*2,1,1).data];
  for(let mask=0;mask<8;mask++){
    inputs.forEach((input,index)=>{const wanted=Boolean(mask&(1<<index));if(input.checked!==wanted)input.click()});
    const active=canvas.dataset.adjacency?canvas.dataset.adjacency.split(','):[],hidden=canvas.dataset.hidden.split(',').filter(Boolean);
    if(active.length!==[0,1,2].filter(index=>mask&(1<<index)).length)failures.push({mask,active,issue:'state'});
    const expected=[];if(mask&1)expected.push('cabinet');if(mask&2)expected.push('wallPrint');if(expected.some(id=>!hidden.includes(id))||hidden.some(id=>!expected.includes(id)))failures.push({mask,hidden,expected,issue:'backed visibility'});
    for(let index=0;index<3;index++){
      const low=Boolean(mask&(1<<index)),above=pixel(60+index*120+60,80),cap=pixel(60+index*120+60,105);
      if(low&&above[3]!==0)failures.push({mask,index,issue:'low exterior'});
      if(cap[3]!==255)failures.push({mask,index,issue:'cap'});
    }
  }
  inputs.forEach(input=>{if(input.checked)input.click()});
  return failures;
});
if(adjacencyAudit.length)throw new Error(JSON.stringify(adjacencyAudit));

const apertureAudit=await page.evaluate(()=>{
  const canvas=document.querySelector('#ultrasound-art'),ctx=canvas.getContext('2d'),out={},pixel=(x,y)=>[...ctx.getImageData(x*2,y*2,1,1).data];
  for(const id of window.__ultrasoundLayout.segments){
    const button=document.querySelector(`.ultrasound-controls [data-segment="${id}"]`);
    if(button.getAttribute('aria-pressed')!=='true')button.click();
    const index=id[0]==='N'||id[0]==='S'?Number(id[1])-1:id.charCodeAt(1)-65;
    if(id[0]==='N')out[id]={air:pixel(60+index*120+60,75),jamb:pixel(67+index*120,100)};
    else if(id[0]==='S')out[id]={floor:pixel(60+index*120+60,510),below:pixel(60+index*120+60,520)};
    else{const y=130+index*120+60;out[id]=id[0]==='W'?{outer:pixel(51,y),inner:pixel(58,y)}:{inner:pixel(422,y),outer:pixel(429,y)}}
    button.click();
  }
  return out;
});
for(const[id,sample]of Object.entries(apertureAudit)){
  if(id[0]==='N'&&(sample.air[3]!==0||sample.jamb[3]!==255))throw new Error(JSON.stringify({id,sample}));
  if(id[0]==='S'&&(sample.floor[3]!==255||sample.below[3]!==255))throw new Error(JSON.stringify({id,sample}));
  if((id[0]==='W'||id[0]==='E')&&(sample.outer[3]!==0||sample.inner[3]!==255))throw new Error(JSON.stringify({id,sample}));
}

await page.getByRole('button',{name:'Toggle door at N2'}).focus();
await page.keyboard.press('Enter');
if(await page.getByRole('button',{name:'Toggle door at N2'}).getAttribute('aria-pressed')!=='true')throw new Error('keyboard failed');
await page.getByLabel('Show footprints, selected-door route, and seat/use points').check();
await mkdir(evidence,{recursive:true});
await page.screenshot({path:path.join(evidence,'ultrasound-desktop.png'),fullPage:true});
await page.setViewportSize({width:320,height:900});
await page.screenshot({path:path.join(evidence,'ultrasound-320.png'),fullPage:true});
const narrow=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>window.innerWidth,buttons:[...document.querySelectorAll('.ultrasound-controls [data-segment]')].filter(element=>element.getBoundingClientRect().width>0).length,adj:[...document.querySelectorAll('[data-adjacent]')].filter(element=>element.getBoundingClientRect().width>0).length}));
if(narrow.overflow||narrow.buttons!==12||narrow.adj!==3||errors.length)throw new Error(JSON.stringify({narrow,errors}));
await browser.close();
console.log('PASS Ultrasound B2-only blocker + 8 traversable centers; 12 aperture-safe door routes; patient/technician/console approaches and south passage; 8 north masks; equipment visibility; seams; contacts/aspects; keyboard; desktop/320');


