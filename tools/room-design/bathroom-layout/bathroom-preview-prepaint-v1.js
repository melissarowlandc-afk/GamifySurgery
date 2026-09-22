(()=>{
  const root=document.getElementById('bathroom-layout-proof');
  const canvas=document.getElementById('bathroom-art');
  const ctx=canvas.getContext('2d');
  const status=root.querySelector('#bathroom-status');
  const overlay=root.querySelector('#bathroom-overlay');
  const targets=root.querySelector('#bathroom-targets');
  const SCALE=2,W=360,H=430,S=120,X=60,Y=130,BOTTOM=Y+2*S,EAST=X+2*S;
  const segments=['N1','N2','S1','S2','WA','WB','EA','EB'];
  const state={doors:new Set(['S1']),adjacent:new Set(),selected:'S1'};
  const fixtures={
    sink:{id:'sink',label:'permanent sink',footprint:{left:.36,top:.46,width:.38,height:.38},anchor:{x:.55,y:.84},use:{x:.55,y:1.12},facing:'N',persistence:'permanent',collision:'solid'},
    toilet:{id:'toilet',label:'permanent toilet',footprint:{left:1.22,top:.46,width:.42,height:.62},anchor:{x:1.43,y:1.08},seat:{x:1.43,y:.64},use:{x:1.43,y:1.40},facing:'S',persistence:'permanent',collision:'solid'},
    mirror:{id:'mirror',label:'N1 mirror',wall:'N1',conflicts:['N1'],backing:['N1'],persistence:'wall-attached',collision:'nonblocking'},
  };
  const radius=.16,step=.04,start={x:.52,y:1.72};
  const atlas=new Image();atlas.src='data:image/webp;base64,__BATHROOM_ATLAS__';atlas.onload=render;
  const key=p=>`${p.x.toFixed(2)},${p.y.toFixed(2)}`;
  const inflated=rect=>({left:rect.left-radius,top:rect.top-radius,right:rect.left+rect.width+radius,bottom:rect.top+rect.height+radius});
  const solids=()=>[inflated(fixtures.sink.footprint),inflated(fixtures.toilet.footprint)];
  const validPoint=p=>p.x>=radius-1e-6&&p.x<=2-radius+1e-6&&p.y>=radius-1e-6&&p.y<=2-radius+1e-6&&!solids().some(r=>p.x>=r.left-1e-6&&p.x<=r.right+1e-6&&p.y>=r.top-1e-6&&p.y<=r.bottom+1e-6);
  const candidates=id=>{
    const values=[.28,.36,.52,.64,.72];
    if(id[0]==='N'||id[0]==='S'){const col=Number(id.slice(1))-1,y=id[0]==='N'?radius:2-radius;return values.map(v=>({x:col+v,y})).filter(validPoint)}
    const row=id.charCodeAt(1)-65,x=id[0]==='W'?radius:2-radius;return values.map(v=>({x,y:row+v})).filter(validPoint);
  };
  function bfs(from,to){
    const snap=p=>({x:Math.round(p.x/step)*step,y:Math.round(p.y/step)*step}),a=snap(from),b=snap(to);
    if(!validPoint(a)||!validPoint(b))return[];
    const queue=[a],prev=new Map([[key(a),null]]),points=new Map([[key(a),a]]),moves=[[step,0],[-step,0],[0,step],[0,-step]];
    while(queue.length){const p=queue.shift(),pk=key(p);if(pk===key(b)){const path=[];for(let k=pk;k;k=prev.get(k)){path.unshift(points.get(k))}return simplify(path)}for(const [dx,dy]of moves){const n=snap({x:p.x+dx,y:p.y+dy}),nk=key(n);if(validPoint(n)&&!prev.has(nk)){prev.set(nk,pk);points.set(nk,n);queue.push(n)}}}return[];
  }
  const simplify=path=>path.filter((p,i)=>i===0||i===path.length-1||Math.abs((path[i-1].x-p.x)*(path[i+1].y-p.y)-(path[i-1].y-p.y)*(path[i+1].x-p.x))>.0001);
  const routeToDoor=id=>{let best=[];for(const target of candidates(id)){const route=bfs(start,target);if(route.length&&(!best.length||route.length<best.length))best=route}return best};
  const reachability=()=>Object.fromEntries(segments.map(id=>[id,routeToDoor(id)]));
  const mirrorVisible=()=>!state.doors.has('N1')&&!state.adjacent.has('N1');
  function surface(left,top,width,height){
    ctx.save();ctx.beginPath();ctx.rect(left,top,width,height);ctx.clip();
    ctx.fillStyle='#ddd9c7';ctx.fillRect(left,top,width,height);
    const tile=30,startCol=Math.floor((left-X)/tile)-1,endCol=Math.ceil((left+width-X)/tile)+1,startRow=Math.floor((top-Y)/tile)-1,endRow=Math.ceil((top+height-Y)/tile)+1;
    for(let r=startRow;r<endRow;r++)for(let c=startCol;c<endCol;c++){const px=X+c*tile,py=Y+r*tile;ctx.fillStyle=(r+c)%3===0?'#d6dcc9':(r+c)%3===1?'#e4dfcb':'#ddd9c7';ctx.fillRect(px,py,tile,tile);ctx.fillStyle='rgba(93,111,82,.08)';const seed=Math.abs((r*31+c*17)%23);ctx.fillRect(px+5+seed%17,py+6+(seed*3)%15,1.5,1.5)}
    ctx.strokeStyle='rgba(92,91,73,.16)';ctx.lineWidth=1;for(let c=startCol;c<=endCol;c++){ctx.beginPath();ctx.moveTo(X+c*tile,top);ctx.lineTo(X+c*tile,top+height);ctx.stroke()}for(let r=startRow;r<=endRow;r++){ctx.beginPath();ctx.moveTo(left,Y+r*tile);ctx.lineTo(left+width,Y+r*tile);ctx.stroke()}ctx.restore();
  }
  function drawShell(){
    const cream='#efe1bd',green='#58735a',dark='#294632',light='#789173',wood='#744a29',background='#f3ead3',low=29,wall=90,cap=14;
    ctx.clearRect(0,0,W,H);ctx.fillStyle=background;ctx.fillRect(0,0,W,H);surface(X,Y,2*S,2*S);
    const tall=i=>{const sx=X+i*S;ctx.fillStyle=cream;ctx.fillRect(sx,Y-wall,S,wall);ctx.fillStyle='rgba(146,110,67,.055)';ctx.fillRect(sx+12,Y-wall+28,S-24,2);ctx.fillStyle=green;ctx.fillRect(sx,Y-23,S,23);ctx.fillStyle=light;ctx.fillRect(sx,Y-23,S,4);ctx.fillStyle=dark;ctx.fillRect(sx,Y-7,S,7);ctx.fillRect(sx-1,Y-wall-9,S+2,9);ctx.fillStyle=light;ctx.fillRect(sx-1,Y-wall-9,S+2,3)};
    const backed=i=>{const sx=X+i*S;ctx.fillStyle=green;ctx.fillRect(sx,Y-low,S,low);ctx.fillStyle=light;ctx.fillRect(sx,Y-low,S,4);ctx.fillStyle=dark;ctx.fillRect(sx,Y-7,S,7)};
    for(let i=0;i<2;i++)state.adjacent.has(`N${i+1}`)?backed(i):tall(i);
    for(let i=0;i<2;i++)if(state.adjacent.has(`N${i+1}`))ctx.clearRect(X+i*S,0,S,Y-low);
    const westX=X-cap+2,eastX=EAST-2;
    const side=(right)=>{const px=right?eastX:westX,neighbor=right?'N2':'N1',top=state.adjacent.has(neighbor)?Y-low:Y-wall-9;ctx.fillStyle=dark;ctx.fillRect(px,top,cap,BOTTOM+29-top);ctx.fillStyle=light;ctx.fillRect(px+(right?0:cap-3),top,3,BOTTOM+29-top)};side(false);side(true);
    const northDoor=i=>{const backedNorth=state.adjacent.has(`N${i+1}`),left=X+i*S+12,right=X+(i+1)*S-12,top=backedNorth?Y-low:Y-wall+8;ctx.clearRect(left,top,right-left,Y-top);ctx.fillStyle=wood;ctx.fillRect(left-5,top,5,Y-top);ctx.fillRect(right,top,5,Y-top);if(!backedNorth)ctx.fillRect(left-5,top-5,right-left+10,6)};
    const sideDoor=(right,i)=>{const px=right?eastX:westX,top=Y+i*S+12,height=S-24,half=cap/2;ctx.clearRect(px,top,cap,height);if(right){surface(px,top,half,height);ctx.clearRect(px+half,top,half,height)}else{ctx.clearRect(px,top,half,height);surface(px+half,top,half,height)}ctx.fillStyle=wood;ctx.fillRect(px-2,top-3,cap+4,5);ctx.fillRect(px-2,top+height-2,cap+4,5)};
    const frontSegment=i=>{const left=X+i*S;ctx.fillStyle=cream;ctx.fillRect(left,BOTTOM,S,29);ctx.fillStyle=green;ctx.fillRect(left,BOTTOM+21,S,8);ctx.fillStyle=dark;ctx.fillRect(left,BOTTOM-6,S,8);ctx.fillStyle=light;ctx.fillRect(left,BOTTOM-6,S,3)};frontSegment(0);frontSegment(1);
    for(const id of state.doors){if(id[0]==='N')northDoor(Number(id[1])-1);else if(id[0]==='S'){const i=Number(id[1])-1,left=X+i*S+12,right=X+(i+1)*S-12;ctx.clearRect(left,BOTTOM-6,right-left,35);surface(left,BOTTOM-6,right-left,35);ctx.fillStyle=wood;ctx.fillRect(left-5,BOTTOM-8,5,37);ctx.fillRect(right,BOTTOM-8,5,37)}else sideDoor(id[0]==='E',id.charCodeAt(1)-65)}
    return {westX,eastX};
  }
  function drawFurniture(){
    const groundCrop=(sx,sy,sw,sh,sourceContact,dx,anchorY,width)=>{const scale=width/sw,height=sh*scale,y=anchorY-sourceContact*scale;ctx.drawImage(atlas,sx,sy,sw,sh,dx,y,width,height);return{x:dx,y,w:width,h:height,anchorY,contactY:y+sourceContact*scale,imageBottom:y+height,sourceContact,aspect:sw/sh}};
    let mirror=null;if(mirrorVisible()){const width=.44*S,height=width*430/325,x=X+(fixtures.sink.anchor.x-.22)*S,y=Y-5-height;ctx.drawImage(atlas,8,1229,325,430,x,y,width,height);mirror={x,y,w:width,h:height,bottom:y+height,aspect:325/430}}
    const sinkWidth=.68*S,sinkScale=sinkWidth/365,sink=groundCrop(8,651,365,570,521,X+fixtures.sink.anchor.x*S-180*sinkScale,Y+fixtures.sink.anchor.y*S,sinkWidth);
    const toiletWidth=.66*S,toiletScale=toiletWidth/340,toilet=groundCrop(8,8,340,635,594,X+fixtures.toilet.anchor.x*S-164*toiletScale,Y+fixtures.toilet.anchor.y*S,toiletWidth);
    return {sink,toilet,mirror};
  }
  function drawOverlay(routes){
    if(!overlay.checked)return;
    ctx.save();ctx.lineWidth=2;ctx.setLineDash([5,4]);for(const fixture of [fixtures.sink,fixtures.toilet]){const f=fixture.footprint;ctx.strokeStyle='#8d5a47';ctx.fillStyle='rgba(141,90,71,.10)';ctx.fillRect(X+f.left*S,Y+f.top*S,f.width*S,f.height*S);ctx.strokeRect(X+f.left*S,Y+f.top*S,f.width*S,f.height*S)}ctx.setLineDash([]);
    const path=routes[state.selected];if(path.length){ctx.strokeStyle='#2f7090';ctx.lineWidth=3;ctx.beginPath();path.forEach((p,i)=>(i?ctx.lineTo(X+p.x*S,Y+p.y*S):ctx.moveTo(X+p.x*S,Y+p.y*S)));ctx.stroke()}
    for(const [id,fixture,color]of [['sink',fixtures.sink,'#2f7090'],['toilet',fixtures.toilet,'#8d5a47']]){ctx.fillStyle=color;ctx.beginPath();ctx.arc(X+fixture.use.x*S,Y+fixture.use.y*S,6,0,Math.PI*2);ctx.fill();ctx.font='bold 11px sans-serif';ctx.fillText(`${id} approach`,X+fixture.use.x*S+8,Y+fixture.use.y*S+4)}ctx.fillStyle='#8d5a47';ctx.beginPath();ctx.arc(X+fixtures.toilet.seat.x*S,Y+fixtures.toilet.seat.y*S,5,0,Math.PI*2);ctx.fill();ctx.fillText('seat faces S',X+fixtures.toilet.seat.x*S+7,Y+fixtures.toilet.seat.y*S+3);ctx.restore();
  }
  function hitSlot(id){if(id[0]==='N'||id[0]==='S'){const i=Number(id[1])-1;return{x:X+i*S,y:id[0]==='N'?(state.adjacent.has(id)?Y-29:Y-99):BOTTOM,w:S,h:id[0]==='N'?(state.adjacent.has(id)?29:99):29}}const i=id.charCodeAt(1)-65;return{x:id[0]==='W'?X-14:EAST,y:Y+i*S,w:14,h:S}}
  function updateHits(){for(const button of targets.querySelectorAll('button')){const b=hitSlot(button.dataset.segment);Object.assign(button.style,{left:`${b.x/W*100}%`,top:`${b.y/H*100}%`,width:`${b.w/W*100}%`,height:`${b.h/H*100}%`});button.setAttribute('aria-pressed',String(state.doors.has(button.dataset.segment)))}}
  function render(){
    ctx.setTransform(SCALE,0,0,SCALE,0,0);ctx.imageSmoothingEnabled=true;drawShell();const draws=drawFurniture(),routes=reachability();drawOverlay(routes);updateHits();
    const reachable=Object.values(routes).filter(route=>route.length).length,sinkRoute=bfs(start,fixtures.sink.use),toiletRoute=bfs(start,fixtures.toilet.use),hidden=mirrorVisible()?'none':'mirror';
    status.innerHTML=`<strong>${state.selected}</strong> · ${state.doors.has(state.selected)?'open doorway':'closed wall'} · ${reachable}/8 door approaches reachable from S1<br>Sink use ${sinkRoute.length?'reachable':'blocked'} · toilet use ${toiletRoute.length?'reachable':'blocked'} · hidden: ${hidden}`;
    canvas.dataset.doors=[...state.doors].join(',');canvas.dataset.adjacency=[...state.adjacent].join(',');canvas.dataset.hidden=mirrorVisible()?'':'mirror';canvas.dataset.routes=JSON.stringify(Object.fromEntries(Object.entries(routes).map(([id,path])=>[id,path])));canvas.dataset.fixtures=JSON.stringify(Object.values(fixtures).map(f=>({...f,draw:draws[f.id]||null})));canvas.dataset.shell=JSON.stringify({logicalCols:2,logicalRows:2,tileSize:S,rearWallHeight:90,lowNorthHeight:29,sideCapWidth:14,southHeight:29,northLowHeader:false,sideDoorSeam:'half-thickness',southFloorToBase:true});
    root.querySelectorAll('[data-segment]').forEach(button=>{const open=state.doors.has(button.dataset.segment);button.setAttribute('aria-pressed',String(open));button.classList.toggle('btn-primary',open)});
  }
  const addButton=(id,target,label,hit=false)=>{const button=document.createElement('button');button.type='button';button.className=hit?'bath-hit':'btn';button.dataset.segment=id;button.textContent=hit?'':id;button.setAttribute('aria-label',label);button.addEventListener('click',()=>{state.doors.has(id)?state.doors.delete(id):state.doors.add(id);state.selected=id;render()});target.append(button)};
  for(const [prefix,targetId]of [['N','bathroom-north'],['S','bathroom-south'],['W','bathroom-west'],['E','bathroom-east']])for(const id of segments.filter(segment=>segment[0]===prefix))addButton(id,root.querySelector('#'+targetId),`Toggle door at ${id}`);
  for(const id of segments)addButton(id,targets,`Wall door ${id}`,true);
  for(const id of ['N1','N2']){const label=document.createElement('label');label.className='form-check';label.innerHTML=`<input class="form-check-input" type="checkbox" data-adjacent="${id}"><span class="form-check-label">${id}</span>`;label.querySelector('input').addEventListener('change',event=>{event.target.checked?state.adjacent.add(id):state.adjacent.delete(id);render()});root.querySelector('#bathroom-adjacency').append(label)}
  overlay.addEventListener('change',render);
  window.__bathroomLayout={segments,state,fixtures,radius,step,start,validPoint,candidates,bfs,routeToDoor,reachability,mirrorVisible,render,ready:()=>atlas.complete&&atlas.naturalWidth===381};
  render();
})();
