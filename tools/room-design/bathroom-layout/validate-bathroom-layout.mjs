import {readFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const here=path.dirname(fileURLToPath(import.meta.url)),fragmentPath=path.join(here,'bathroom-layout.html'),evidence=path.join(here,'evidence');
const fragment=await readFile(fragmentPath,'utf8');
if(Buffer.byteLength(fragment,'utf8')>=1_000_000)throw new Error('fragment must remain under 1 MB');
const browser=await chromium.launch({headless:true,executablePath:process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':undefined});
const page=await browser.newPage({viewport:{width:900,height:900}}),errors=[];
page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});
await page.setContent(`<main>${fragment}</main>`);await page.waitForFunction(()=>window.__bathroomLayout?.ready());

const model=await page.evaluate(()=>{
  const m=window.__bathroomLayout,routeFailures=[];
  const validatePath=(name,path)=>{if(!path.length){routeFailures.push({name,issue:'empty'});return}for(let i=0;i<path.length;i++){if(!m.validPoint(path[i]))routeFailures.push({name,point:path[i],issue:'invalid point'});if(i){const a=path[i-1],b=path[i];if(Math.abs(a.x-b.x)>.001&&Math.abs(a.y-b.y)>.001)routeFailures.push({name,a,b,issue:'non-cardinal simplification'});for(let n=0;n<=20;n++){const t=n/20,p={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};if(!m.validPoint(p))routeFailures.push({name,p,issue:'segment crosses inflated solid'})}}}};
  const routes=m.reachability();for(const [id,route]of Object.entries(routes)){validatePath(id,route);const end=route.at(-1),candidates=m.candidates(id);if(!candidates.some(p=>Math.abs(p.x-end.x)<.001&&Math.abs(p.y-end.y)<.001))routeFailures.push({id,end,candidates,issue:'endpoint not inside usable aperture'})}
  validatePath('sink-use',m.bfs(m.start,m.fixtures.sink.use));validatePath('toilet-use',m.bfs(m.start,m.fixtures.toilet.use));
  return {segments:m.segments,fixtures:m.fixtures,radius:m.radius,step:m.step,routes,routeFailures,shell:JSON.parse(document.querySelector('#bathroom-art').dataset.shell),draws:JSON.parse(document.querySelector('#bathroom-art').dataset.fixtures)};
});
if(model.segments.join(',')!=='N1,N2,S1,S2,WA,WB,EA,EB'||model.routeFailures.length||Object.values(model.routes).some(route=>!route.length))throw new Error(JSON.stringify({model,issue:'route contract'}));
for(const [id,route]of Object.entries(model.routes)){const end=route.at(-1),horizontal=id[0]==='N'||id[0]==='S',index=horizontal?Number(id[1])-1:id.charCodeAt(1)-65,offset=(horizontal?end.x:end.y)-index,boundary=horizontal?end.y:end.x,expectedBoundary=(id[0]==='N'||id[0]==='W')?.16:1.84;if(offset<.1+model.radius-1e-6||offset>.9-model.radius+1e-6||Math.abs(boundary-expectedBoundary)>.001)throw new Error(JSON.stringify({id,end,offset,boundary,issue:'endpoint violates independent aperture/radius margin'}))}
for(const id of ['sink','toilet']){const fixture=model.fixtures[id],draw=model.draws.find(item=>item.id===id).draw;if(fixture.persistence!=='permanent'||fixture.collision!=='solid'||!draw||Math.abs(draw.contactY-draw.anchorY)>.01||Math.abs(draw.w/draw.h-draw.aspect)>.001)throw new Error(JSON.stringify({id,fixture,draw,issue:'fixture permanence/aspect/contact'}))}
const sinkDraw=model.draws.find(item=>item.id==='sink').draw,toiletDraw=model.draws.find(item=>item.id==='toilet').draw,mirrorDraw=model.draws.find(item=>item.id==='mirror').draw;
if(sinkDraw.sourceContact!==521||toiletDraw.sourceContact!==594||Math.abs(sinkDraw.x+180*(sinkDraw.w/365)-(60+model.fixtures.sink.anchor.x*120))>.01||Math.abs(toiletDraw.x+164*(toiletDraw.w/340)-(60+model.fixtures.toilet.anchor.x*120))>.01||!mirrorDraw||mirrorDraw.y<31||mirrorDraw.bottom>130||Math.abs(mirrorDraw.x+mirrorDraw.w/2-(60+model.fixtures.sink.anchor.x*120))>.01||Math.abs(mirrorDraw.w-52.8)>.01)throw new Error(JSON.stringify({sinkDraw,toiletDraw,mirrorDraw,issue:'measured fixture registration'}));
if(model.fixtures.sink.facing!=='N'||model.fixtures.toilet.facing!=='S'||!model.fixtures.toilet.seat||model.shell.logicalCols!==2||model.shell.logicalRows!==2||model.shell.tileSize!==120||model.shell.rearWallHeight!==90||model.shell.lowNorthHeight!==29||model.shell.sideCapWidth!==14||model.shell.southHeight!==29||model.shell.northLowHeader!==false||model.shell.sideDoorSeam!=='half-thickness'||model.shell.southFloorToBase!==true)throw new Error(JSON.stringify({model,issue:'room/shell/facing contract'}));

const controls=await page.evaluate(()=>({buttons:[...document.querySelectorAll('.bath-controls [data-segment]')].map(el=>el.dataset.segment),hits:document.querySelectorAll('#bathroom-targets [data-segment]').length,adj:document.querySelectorAll('[data-adjacent]').length,canvas:document.querySelector('#bathroom-art').getBoundingClientRect().width}));
if(controls.buttons.join(',')!=='N1,N2,S1,S2,WA,WB,EA,EB'||controls.hits!==8||controls.adj!==2||Math.abs(controls.canvas-360)>1)throw new Error(JSON.stringify({controls}));

for(const id of model.segments){const button=page.getByRole('button',{name:`Toggle door at ${id}`});const before=await button.getAttribute('aria-pressed');await button.click();if(await button.getAttribute('aria-pressed')===before)throw new Error(`door control ${id} failed`);await button.click()}
const mirrorInitial=await page.locator('#bathroom-art').getAttribute('data-hidden');
await page.getByRole('button',{name:'Toggle door at WA'}).click();if((await page.locator('#bathroom-art').getAttribute('data-hidden')).includes('mirror'))throw new Error('WA incorrectly hid mirror');await page.getByRole('button',{name:'Toggle door at WA'}).click();
await page.getByRole('button',{name:'Toggle door at N1'}).click();if(!(await page.locator('#bathroom-art').getAttribute('data-hidden')).includes('mirror'))throw new Error('N1 door did not hide mirror');await page.getByRole('button',{name:'Toggle door at N1'}).click();
if(mirrorInitial.includes('mirror'))throw new Error('mirror hidden initially');

const adjacencyAudit=await page.evaluate(()=>{
  const inputs=[...document.querySelectorAll('[data-adjacent]')],canvas=document.querySelector('#bathroom-art'),ctx=canvas.getContext('2d'),failures=[];
  const pixel=(x,y)=>[...ctx.getImageData(x*2,y*2,1,1).data];
  for(let mask=0;mask<4;mask++){
    inputs.forEach((input,i)=>{const want=Boolean(mask&(1<<i));if(input.checked!==want)input.click()});
    const active=canvas.dataset.adjacency?canvas.dataset.adjacency.split(','):[];
    if(active.length!==((mask&1?1:0)+(mask&2?1:0)))failures.push({mask,active,issue:'adjacency state'});
    if(canvas.dataset.hidden.includes('mirror')!==Boolean(mask&1))failures.push({mask,hidden:canvas.dataset.hidden,issue:'mirror backing rule'});
    for(let i=0;i<2;i++){const low=Boolean(mask&(1<<i)),above=pixel(60+i*120+60,80),cap=pixel(60+i*120+60,105);if(low&&above[3]!==0)failures.push({mask,i,above,issue:'low north exterior not transparent'});if(cap[3]!==255)failures.push({mask,i,cap,issue:'north cap absent'})}
  }
  inputs.forEach(input=>{if(input.checked)input.click()});return failures;
});
if(adjacencyAudit.length)throw new Error(JSON.stringify(adjacencyAudit));

const apertureAudit=await page.evaluate(()=>{
  const canvas=document.querySelector('#bathroom-art'),ctx=canvas.getContext('2d'),out={};
  const pixel=(x,y)=>[...ctx.getImageData(x*2,y*2,1,1).data];
  for(const id of window.__bathroomLayout.segments){const button=document.querySelector(`.bath-controls [data-segment="${id}"]`);if(button.getAttribute('aria-pressed')!=='true')button.click();const i=['N1','N2','S1','S2'].includes(id)?Number(id[1])-1:id.charCodeAt(1)-65;if(id[0]==='N')out[id]={air:pixel(60+i*120+60,75),jamb:pixel(67+i*120,100)};else if(id[0]==='S')out[id]={floor:pixel(60+i*120+60,390),below:pixel(60+i*120+60,401)};else{const y=130+i*120+60;out[id]=id[0]==='W'?{outer:pixel(51,y),inner:pixel(58,y)}:{inner:pixel(302,y),outer:pixel(309,y)}}button.click()}return out;
});
for(const [id,sample]of Object.entries(apertureAudit)){if(id[0]==='N'&&(sample.air[3]!==0||sample.jamb[3]!==255))throw new Error(JSON.stringify({id,sample,issue:'north aperture'}));if(id[0]==='S'&&(sample.floor[3]!==255||sample.below[3]!==255))throw new Error(JSON.stringify({id,sample,issue:'south floor-to-base'}));if((id[0]==='W'||id[0]==='E')&&(sample.outer[3]!==0||sample.inner[3]!==255))throw new Error(JSON.stringify({id,sample,issue:'side half seam'}))}

await page.getByRole('button',{name:'Toggle door at N2'}).focus();await page.keyboard.press('Enter');if(await page.getByRole('button',{name:'Toggle door at N2'}).getAttribute('aria-pressed')!=='true')throw new Error('keyboard activation failed');
await page.getByLabel('Show footprints, selected-door route, and use points').check();
await mkdir(evidence,{recursive:true});await page.screenshot({path:path.join(evidence,'bathroom-desktop.png'),fullPage:true});
await page.setViewportSize({width:320,height:850});await page.screenshot({path:path.join(evidence,'bathroom-320.png'),fullPage:true});
const narrow=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>window.innerWidth,buttons:[...document.querySelectorAll('.bath-controls [data-segment]')].filter(el=>el.getBoundingClientRect().width>0).length,adj:[...document.querySelectorAll('[data-adjacent]')].filter(el=>el.getBoundingClientRect().width>0).length}));
if(narrow.overflow||narrow.buttons!==8||narrow.adj!==2||errors.length)throw new Error(JSON.stringify({narrow,errors}));
await browser.close();
console.log('PASS 8 doorway approaches with interpolated .16-radius clearance; sink/toilet use routes; 4 north masks; mirror N1-only hide; floor seams; contacts/aspects; keyboard; desktop/320');
