// Read-only source-colour runs to support manual, visually inspected landmarks.
const fs=require('fs'),path=require('path');const {chromium}=require('@playwright/test');
const here=__dirname,assets=path.resolve(here,'../assets');
const specs=[
  {id:'gantry-side',file:'originals/gantry-side-02.png',x:85,range:[300,1050],kind:'dark'},
  {id:'table-empty',file:'originals/table-empty-03.png',x:900,range:[40,450],kind:'blue'},
  {id:'console-rear',file:'originals/console-06.png',x:500,range:[500,810],kind:'white'},
  {id:'console-front',file:'originals/console-06.png',x:700,range:[650,820],kind:'white'},
  {id:'operator-chair',file:'originals/operator-chair-02.png',x:550,range:[450,1150],kind:'blue'}
];
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage();const out=[];
for(const s of specs){const result=await page.evaluate(async input=>{const im=new Image();im.src=input.uri;await im.decode();const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(im,0,0);const p=g.getImageData(0,0,c.width,c.height).data;
const match=y=>{const i=(y*c.width+input.x)*4,[r,gg,b,a]=p.slice(i,i+4);return a>=220&&(input.kind==='blue'?b-r>18&&gg-r>8:input.kind==='dark'?r<70&&gg<90&&b<105:r>180&&gg>180&&b>180);};
const runs=[];let start=null;for(let y=input.range[0];y<=input.range[1]+1;y++){if(y<=input.range[1]&&match(y)){if(start===null)start=y;}else if(start!==null){runs.push([start,y-1]);start=null;}}
const probes=input.id.startsWith('console')?Array.from({length:input.id==='console-rear'?50:40},(_,i)=>{const y=(input.id==='console-rear'?515:710)+i;return[y,...p.slice((y*c.width+input.x)*4,(y*c.width+input.x)*4+4)];}):[];
return{size:[c.width,c.height],column:input.x,runs:runs.filter(x=>x[1]-x[0]>4),probes};},{...s,uri:'data:image/png;base64,'+fs.readFileSync(path.join(assets,s.file)).toString('base64')});out.push({...s,...result});}
await browser.close();console.log(JSON.stringify(out,null,2));fs.writeFileSync(path.join(here,'evidence/source-landmarks.json'),JSON.stringify(out,null,2)+'\n');})().catch(e=>{console.error(e.stack);process.exit(1)});
