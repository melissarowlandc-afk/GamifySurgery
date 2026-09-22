const fs = require('fs');
const path = require('path');

const own = __dirname;
const root = path.resolve(own, '..', '..', '..');
const inventory = JSON.parse(fs.readFileSync(path.join(root, 'tools/room-design/consistency-audit/inventory.json'), 'utf8'));
const report = JSON.parse(fs.readFileSync(path.join(own, 'assets/capture-report.json'), 'utf8'));
const packed = path.join(own, 'packed');
const asset = name => `data:image/webp;base64,${fs.readFileSync(path.join(packed, name), 'base64')}`;
const capture = (id, alternate = false) => {
  const match = report.find(item => item.id === id && (alternate ? item.capture === 'select-alternate' : item.capture !== 'select-alternate'));
  return match ? { src: asset(match.file.replace('.png', '.webp')), width: match.width, height: match.height, tileCss: match.tileCss } : null;
};
const labels = {
  'front-desk': 'Front Desk', examination: 'Examination', hallway: 'Hallway', waiting: 'Waiting', bathroom: 'Bathroom',
  'minor-procedure': 'Minor Procedure', ultrasound: 'Ultrasound', xray: 'X-ray', ct: 'CT Suite', phlebotomy: 'Phlebotomy',
  evs: 'Environmental Services', endoscopy: 'Endoscopy', recovery: 'Peri-op & Recovery', training: 'Training Lab',
  'coffee-kiosk': 'Coffee Kiosk', coffee: 'Coffee Kiosk', telehealth: 'GLP-1 Telehealth',
};
const rooms = inventory.rooms.map(room => {
  const id = room.id === 'coffee-kiosk' ? 'coffee' : room.id;
  return {
    id,
    label: labels[id] || room.id,
    dimensions: room.dimensions,
    orientations: room.orientations,
    default: capture(id),
    alternate: capture(id, true),
    occupiedFit: room.occupiedFit,
    poses: room.poses,
  };
}).filter(room => room.default);
const characters = Object.fromEntries(['stand', 'sit'].flatMap(kind => ['south', 'east', 'west', 'north'].map(direction => [
  `${kind}-${direction}`, asset(`${kind}-${direction}.webp`),
])));
const data = { rooms, characters, scale: 0.754083, anchors: { stand: { x: 80, y: 287 }, sit: { south: 213.3191, east: 220.6384, west: 220.6384, north: 223.5661 } } };

const html = String.raw`<div id="gs015-character-fit-review" class="character-fit-review">
  <div class="fit-head">
    <div><h3>Room & character scale review</h3><div class="text-small">P01 GS-018 art at one global comparison scale · click the room to place its foot or seat-support point</div></div>
    <label class="form-check"><input id="fit-overlay" class="form-check-input" type="checkbox"><span class="form-check-label">Show anchors</span></label>
  </div>
  <div id="fit-rooms" class="fit-rooms" role="tablist" aria-label="Room proof"></div>
  <div class="fit-controls">
    <label>View <select id="fit-orientation" class="form-select"></select></label>
    <label>Pose <select id="fit-pose" class="form-select"><option value="stand">Standing</option><option value="sit">Seated</option></select></label>
    <label>Facing <select id="fit-direction" class="form-select"><option value="south">South</option><option value="east">East</option><option value="west">West</option><option value="north">North</option></select></label>
    <button id="fit-reset" type="button" class="btn btn-sm">Center character</button>
  </div>
  <div id="fit-stage-wrap" class="fit-stage-wrap"><canvas id="fit-stage" tabindex="0" role="img" aria-label="Selected room proof with movable approved character"></canvas></div>
  <div id="fit-status" class="text-small fit-status"></div>
</div>
<style>
#gs015-character-fit-review{color:var(--foreground)}
.fit-head{display:flex;gap:12px;align-items:center;justify-content:space-between;margin-bottom:10px}.fit-head h3{margin:0}.fit-rooms{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px}.fit-rooms button{font-size:12px}.fit-controls{display:flex;flex-wrap:wrap;gap:10px;align-items:end;margin:8px 0}.fit-controls label{display:grid;gap:3px;font-size:12px;min-width:102px}.fit-controls select{min-height:30px}.fit-stage-wrap{display:flex;align-items:flex-start;justify-content:center;padding:6px;background:var(--muted)}#fit-stage{display:block;max-width:100%;height:auto;cursor:crosshair;box-shadow:0 0 0 1px var(--border)}.fit-status{margin-top:8px;color:var(--muted-foreground)}@media(max-width:480px){.fit-head{align-items:flex-start;flex-direction:column}.fit-stage-wrap{justify-content:flex-start}.fit-controls{gap:7px}.fit-controls label{min-width:88px}}
</style>
<script>
(()=>{
const root=document.getElementById('gs015-character-fit-review'); const data=__DATA__;
const rooms=root.querySelector('#fit-rooms'),orientation=root.querySelector('#fit-orientation'),pose=root.querySelector('#fit-pose'),direction=root.querySelector('#fit-direction'),stage=root.querySelector('#fit-stage'),overlay=root.querySelector('#fit-overlay'),status=root.querySelector('#fit-status'),reset=root.querySelector('#fit-reset');
let state={room:data.rooms[0].id,alternate:false,pose:'stand',direction:'south',point:null};const saved=window.openai?.widgetState?.privateContent;if(saved&&data.rooms.some(item=>item.id===saved.room)){state.room=saved.room;state.alternate=Boolean(saved.alternate&&data.rooms.find(item=>item.id===saved.room).alternate);state.pose=['stand','sit'].includes(saved.pose)?saved.pose:'stand';state.direction=['south','east','west','north'].includes(saved.direction)?saved.direction:'south';if(saved.point&&Number.isFinite(saved.point.x)&&Number.isFinite(saved.point.y))state.point={x:saved.point.x,y:saved.point.y}} const imgs={};
for(const room of data.rooms){for(const variant of ['default','alternate'])if(room[variant]){const image=new Image();image.src=room[variant].src;imgs[room.id+'-'+variant]=image}} for(const [key,src] of Object.entries(data.characters)){const image=new Image();image.src=src;imgs[key]=image}
const room=()=>data.rooms.find(item=>item.id===state.room); const frame=()=>state.alternate&&room().alternate?room().alternate:room().default; const actor=()=>imgs[state.pose+'-'+state.direction];
function anchor(){return state.pose==='stand'?data.anchors.stand:{x:80,y:data.anchors.sit[state.direction]}}
function save(){window.openai?.setWidgetState?.({modelContent:{room:state.room,pose:state.pose,direction:state.direction},privateContent:state}).catch(()=>{})}
function center(){const f=frame();state.point={x:f.width/2,y:f.height*.72};render()}
function controls(){rooms.replaceChildren();for(const item of data.rooms){const button=document.createElement('button');button.type='button';button.className='btn btn-sm';button.textContent=item.label;button.setAttribute('aria-pressed',String(item.id===state.room));button.onclick=()=>{state.room=item.id;state.alternate=false;state.point=null;render();save()};rooms.append(button)}orientation.replaceChildren();const item=room();const options=[{value:'default',label:item.orientations[0]||'default',enabled:true},{value:'alternate',label:item.orientations[1]||'alternate',enabled:Boolean(item.alternate)}];for(const option of options.filter(option=>option.enabled)){const el=document.createElement('option');el.value=option.value;el.textContent=option.label;orientation.append(el)}orientation.value=state.alternate?'alternate':'default';orientation.disabled=options.filter(option=>option.enabled).length<2;pose.value=state.pose;direction.value=state.direction}
function render(){controls();const f=frame(),background=imgs[room().id+'-'+(state.alternate?'alternate':'default')];if(!state.point)state.point={x:f.width/2,y:f.height*.72};stage.width=f.width;stage.height=f.height;const ctx=stage.getContext('2d');ctx.clearRect(0,0,f.width,f.height);ctx.drawImage(background,0,0,f.width,f.height);const a=actor(),scale=data.scale*(f.tileCss/120),drawW=160*scale,drawH=320*scale,an=anchor(),x=state.point.x-an.x*scale,y=state.point.y-an.y*scale;ctx.drawImage(a,x,y,drawW,drawH);stage.dataset.model=JSON.stringify({room:room().id,alternate:state.alternate,tileCss:f.tileCss,globalScale:data.scale,actorScale:scale,actorSize:[drawW,drawH],anchor:an,point:state.point});if(overlay.checked){const accent=getComputedStyle(root).getPropertyValue('--destructive').trim()||'#a33';ctx.save();ctx.strokeStyle=accent;ctx.fillStyle=accent;ctx.lineWidth=2;ctx.beginPath();ctx.arc(state.point.x,state.point.y,5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(state.point.x-14,state.point.y);ctx.lineTo(state.point.x+14,state.point.y);ctx.moveTo(state.point.x,state.point.y-14);ctx.lineTo(state.point.x,state.point.y+14);ctx.stroke();ctx.restore()}status.textContent=(room().occupiedFit==='unverified'?'No occupied-room fit is verified for this proof. ':'Existing evidence: '+room().occupiedFit+'. ')+'Capture tile '+f.tileCss.toFixed(2)+'px; P01 uses one 0.754083 mapping from the 120px reference tile. The character overlay is always foreground and does not verify depth, collision, turns, or runtime attachment.'}
stage.addEventListener('click',event=>{const r=stage.getBoundingClientRect();state.point={x:(event.clientX-r.left)*stage.width/r.width,y:(event.clientY-r.top)*stage.height/r.height};render();save()});stage.addEventListener('keydown',event=>{const delta={ArrowLeft:[-4,0],ArrowRight:[4,0],ArrowUp:[0,-4],ArrowDown:[0,4]}[event.key];if(!delta)return;event.preventDefault();state.point??={x:frame().width/2,y:frame().height*.72};state.point={x:Math.max(0,Math.min(frame().width,state.point.x+delta[0])),y:Math.max(0,Math.min(frame().height,state.point.y+delta[1]))};render();save()});orientation.onchange=()=>{state.alternate=orientation.value==='alternate';state.point=null;render();save()};pose.onchange=()=>{state.pose=pose.value;render();save()};direction.onchange=()=>{state.direction=direction.value;render();save()};overlay.onchange=render;reset.onclick=()=>{state.point=null;render();save()};
window.addEventListener('openai:set_globals',event=>{const next=event.detail?.globals?.widgetState?.privateContent;if(!next||!data.rooms.some(item=>item.id===next.room))return;state.room=next.room;state.alternate=Boolean(next.alternate&&room().alternate);state.pose=['stand','sit'].includes(next.pose)?next.pose:'stand';state.direction=['south','east','west','north'].includes(next.direction)?next.direction:'south';state.point=next.point&&Number.isFinite(next.point.x)&&Number.isFinite(next.point.y)?{x:next.point.x,y:next.point.y}:null;render()}); Promise.all(Object.values(imgs).map(image=>image.decode?.().catch(()=>{}))).then(render); window.__characterFitReview={ready:()=>Object.values(imgs).every(image=>image.complete&&image.naturalWidth>0),get state(){return state},render};
})();
</script>`;
const resolvedHtml = html.replace('__DATA__', JSON.stringify(data));
const projectOutput = path.join(own, 'room-character-fit-review.html');
const delivery = 'C:/Users/Kyle Kent/.codex/visualizations/2026/09/15/01a0a6b0-18b7-7910-b94a-3af4abc5d1d5/room-character-fit-review.html';
fs.writeFileSync(projectOutput, resolvedHtml);
fs.writeFileSync(delivery, resolvedHtml);
console.log(JSON.stringify({ projectOutput, delivery, bytes: Buffer.byteLength(resolvedHtml), rooms: rooms.length }, null, 2));
