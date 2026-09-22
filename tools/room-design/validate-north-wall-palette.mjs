import {readFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const cases=[
 ['front-desk-layout/front-desk-layout.html','__frontDeskLayout','atlasReady','fd-art','#efe1bd'],
 ['examination-layout/examination-layout.html','__examinationLayout','atlasReady','exam-art','#d5e2e6'],
 ['waiting-layout/waiting-layout.html','__waitingLayout','ready','waiting-art','#e9c7b4'],
 ['bathroom-layout/bathroom-layout.html','__bathroomLayout','ready','bathroom-art','#c6dfd7'],
 ['minor-procedure-layout/minor-procedure-layout.html','__minorProcedureLayout','ready','minor-art','#d6c9df'],
 ['ultrasound-layout/ultrasound-layout.html','__ultrasoundLayout','ready','ultrasound-art','#bfd5e8'],
 ['hallway-layout/hallway-layout.html','__hallwayLayout','ready','hall-art','#ddd5c8'],
 ['combined-layout/combined-layout.html','__combinedLayout','ready','combined-art','#d5e2e6'],
 ['ct-layout/ct-layout.html','__ctLayout','ready','ct-art','#dacbd5'],
];
const root='tools/room-design/'; const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
for(const [file,model,ready,canvas,hex] of cases){
 const page=await browser.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.setContent(`<main>${await readFile(root+file,'utf8')}</main>`); await page.waitForFunction(([model,ready])=>window[model]?.[ready]?.(),[model,ready]);
 const count=await page.evaluate(({canvas,want})=>{const c=document.getElementById(canvas),d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]===want[0]&&d[i+1]===want[1]&&d[i+2]===want[2]&&d[i+3]===255)n++;return n},{canvas,want:rgb(hex)});
 if(!count||errors.length)throw Error(JSON.stringify({file,hex,count,errors}));console.log(`PASS ${file} ${hex} pixels=${count}`);await page.close();
}
const exam=await readFile(root+'examination-layout/examination-layout.html','utf8');
if(!exam.includes('ctx.fillStyle=northFace;ctx.fillRect(sx,Y-(low?29:90),s,low?29:90);')||!exam.includes('const lowNorth=i=>{const sx=x+i*s;ctx.fillStyle=northFace;'))throw Error('examination backed north face does not use its north paint');
const hall=await readFile(root+'hallway-layout/hallway-layout.html','utf8');
if(!hall.includes('function northWall(m,e){const g=geometry(m,e),capY=g.low?g.y:g.y-9;ctx.fillStyle=C.northFace;'))throw Error('hallway backed north face does not use north paint');
if(!hall.includes('function southWall(m,e){const g=geometry(m,e);ctx.fillStyle=C.cream;'))throw Error('hallway south wall paint changed');
const combined=await readFile(root+'combined-layout/combined-layout.html','utf8');
if(!combined.includes("const north=q.d==='S'?e.a:e.b,south=q.d==='S'?e.b:e.a,y=q.y-12;ctx.fillStyle=C.northFace[south.id]||C.cream;"))throw Error('combined backed north face does not use the south room paint');
await browser.close();

