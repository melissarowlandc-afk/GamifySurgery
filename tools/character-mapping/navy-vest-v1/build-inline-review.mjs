import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const root = path.resolve(import.meta.dirname, '../../..');
const manifestPath = 'artifacts/character-movement/navy-vest-v1/manifest.json';
const greenRegistryPath = 'tools/character-mapping/whole-body-static-v1/registry-v1.json';
const reviewRoot = path.join(root, 'artifacts/character-movement/navy-vest-v1/review');
const visualizationPath = 'C:/Users/Kyle Kent/.codex/visualizations/2026/09/13/01a09b55-147e-72f0-b413-e8b6827c7287/navy-vest-hybrid-review.html';
const views = ['south', 'east', 'west', 'north'];
const phases = ['01', '02', '03', '04', '05', '06', '07', '08'];
const sha = (value) => createHash('sha256').update(value).digest('hex');
const bytes = (relative) => readFileSync(path.join(root, relative));
const assert = (ok, message) => { if (!ok) throw Error(message); };
const resolveRecordFile = (record) => {
  const file = record?.file ?? record?.path;
  return file?.startsWith('frames/') || file?.startsWith('proofs/') ? `artifacts/character-movement/navy-vest-v1/${file}` : file;
};
const checked = (record, label) => {
  const file = resolveRecordFile(record);
  assert(file && record?.sha256, `${label} lacks file/hash provenance`);
  const value = bytes(file);
  assert(sha(value) === record.sha256, `${label} hash mismatch`);
  return value;
};

async function dataUrl(record, label, quality) {
  checked(record, label);
  const image = await loadImage(path.join(root, resolveRecordFile(record)));
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  context.drawImage(image, 0, 0);
  return `data:image/webp;base64,${canvas.toBuffer('image/webp', quality).toString('base64')}`;
}

async function originalSourceUrl(source, record) {
  checked(source, 'Navy Vest original source');
  const image = await loadImage(path.join(root, resolveRecordFile(source)));
  const crop = record.sourceCrop;
  const matrix = record.matrix;
  assert(crop && matrix && [crop.x, crop.y, crop.width, crop.height, matrix.e, matrix.f].every(Number.isFinite), 'Navy Vest source registration is invalid');
  const canvas = createCanvas(160, 320);
  const context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  context.drawImage(image, crop.x, crop.y, crop.width, crop.height, matrix.e, matrix.f, crop.width, crop.height);
  return `data:image/webp;base64,${canvas.toBuffer('image/webp', 34).toString('base64')}`;
}

function greenWalkRecord(green, view, phase) {
  const record = green.walking?.frames?.[view]?.[phase];
  assert(record, `Approved Green walk ${view}/${phase} absent`);
  return record;
}

async function main() {
  const manifestBytes = bytes(manifestPath);
  const manifest = JSON.parse(manifestBytes);
  assert(manifest.schemaVersion === 'navy-vest-fit/v1', 'Unexpected Navy Vest manifest schema');
  assert(manifest.canvas?.width === 160 && manifest.canvas?.height === 320 && manifest.canvas?.floorY === 287, 'Navy Vest canvas contract changed');
  assert(manifest.source?.path && manifest.source?.sha256, 'Navy Vest source provenance absent');
  checked(manifest.source, 'Navy Vest original source');
  assert(manifest.frames?.stand && manifest.frames?.sit && manifest.frames?.walk, 'Navy Vest frame groups absent');
  assert(manifest.statics?.sit, 'Navy Vest seated anchors absent');
  const greenBytes = bytes(greenRegistryPath);
  const greenRegistry = JSON.parse(greenBytes);
  const green = greenRegistry.characters?.green;
  assert(green && greenRegistry.canvas?.floorY === 287, 'Approved Green registry absent');
  const data = { canvas: manifest.canvas, views, phases, cadenceMs: 180, navy: { label: manifest.label ?? 'Navy vest', original: {}, stand: {}, sit: {}, walk: {}, seat: {} }, green: { label: green.label, stand: {}, sit: {}, walk: {}, seat: {} } };
  for (const view of views) {
    const navyStand = manifest.frames.stand[view];
    const navySit = manifest.frames.sit[view];
    assert(navyStand?.width === 160 && navyStand?.height === 320, `Navy Vest standing ${view} dimensions differ`);
    assert(navySit?.width === 160 && navySit?.height === 320, `Navy Vest sitting ${view} dimensions differ`);
    assert(manifest.statics.sit[view]?.anchors?.seatContact?.y < 287, `Navy Vest sitting ${view} has no seat contact`);
    data.navy.stand[view] = await dataUrl(navyStand, `Navy Vest stand ${view}`, 38);
    data.navy.sit[view] = await dataUrl(navySit, `Navy Vest sit ${view}`, 38);
    data.navy.original[view] = await originalSourceUrl(manifest.source, manifest.statics?.stand?.[view]);
    data.navy.seat[view] = manifest.statics.sit[view].anchors.seatContact.y;
    data.green.stand[view] = await dataUrl(green.poses.stand[view], `Approved Green stand ${view}`, 38);
    data.green.sit[view] = await dataUrl(green.poses.sit[view], `Approved Green sit ${view}`, 38);
    data.green.seat[view] = green.poses.sit[view].anchors.seatContact.y;
    data.navy.walk[view] = [];
    data.green.walk[view] = [];
    for (const phase of phases) {
      const navyWalk = manifest.frames.walk[view]?.[phase];
      assert(navyWalk?.width === 160 && navyWalk?.height === 320, `Navy Vest walk ${view}/${phase} dimensions differ`);
      data.navy.walk[view].push(await dataUrl(navyWalk, `Navy Vest walk ${view}/${phase}`, 20));
      data.green.walk[view].push(await dataUrl(greenWalkRecord(green, view, phase), `Approved Green walk ${view}/${phase}`, 20));
    }
  }
  const payload = JSON.stringify(data).replaceAll('</script', '<\\/script');
  const html = `<section id="navy-vest-hybrid-review" aria-labelledby="nv-title" data-ready="false" data-mode="static"><h3 id="nv-title">Navy vest fit review</h3><p id="nv-status" aria-live="polite">Loading review poses…</p><div class="viz-row"><button class="btn btn-primary" id="nv-static" type="button" aria-pressed="true" disabled>Statics</button><button class="btn" id="nv-walk" type="button" aria-pressed="false" disabled>Walking</button></div><div class="viz-controls"><label class="form-label" for="nv-pose">Pose<select class="form-select" id="nv-pose" disabled><option value="stand">Standing</option><option value="sit">Sitting</option></select></label><label class="form-label" for="nv-direction">Direction<select class="form-select" id="nv-direction" disabled><option value="south">South</option><option value="east">East</option><option value="west">West</option><option value="north">North</option></select></label><span id="nv-walk-controls" hidden><button class="btn" id="nv-play" type="button" disabled>Play walk</button><label class="form-label" for="nv-speed">Speed<select class="form-select" id="nv-speed" disabled><option value="1">1×</option><option value="0.5">0.5×</option></select></label><label class="form-label" for="nv-phase">Phase<input class="form-range" id="nv-phase" type="range" min="1" max="8" value="1" disabled></label><output id="nv-phase-output" for="nv-phase">1 / 8</output></span><label class="form-check" id="nv-chair-control" for="nv-chair" hidden><input class="form-check-input" id="nv-chair" type="checkbox" checked disabled> <span class="form-check-label">Chair</span></label></div><div id="nv-panels" class="nv-panels" aria-label="Source, Navy Vest, and Approved Green comparison"></div></section><style>#navy-vest-hybrid-review{box-sizing:border-box;max-width:100%;color:var(--foreground)}#navy-vest-hybrid-review *,#navy-vest-hybrid-review *::before,#navy-vest-hybrid-review *::after{box-sizing:border-box}#navy-vest-hybrid-review [hidden]{display:none!important}#navy-vest-hybrid-review .nv-panels{display:grid;grid-template-columns:repeat(3,minmax(0,160px));gap:1rem;margin-top:1rem}#navy-vest-hybrid-review figure{margin:0;min-width:0}#navy-vest-hybrid-review canvas{display:block;width:160px;height:320px;max-width:100%;image-rendering:pixelated}#navy-vest-hybrid-review figcaption{margin-top:.4rem}@media(max-width:600px){#navy-vest-hybrid-review .nv-panels{grid-template-columns:1fr;gap:.75rem}}</style><script>(async()=>{const data=${payload};const root=document.getElementById('navy-vest-hybrid-review'),$=id=>document.getElementById(id),status=$('nv-status'),staticButton=$('nv-static'),walkButton=$('nv-walk'),pose=$('nv-pose'),direction=$('nv-direction'),play=$('nv-play'),speed=$('nv-speed'),phase=$('nv-phase'),phaseOut=$('nv-phase-output'),chair=$('nv-chair'),chairControl=$('nv-chair-control'),walkControls=$('nv-walk-controls'),panels=$('nv-panels'),state={mode:'static',pose:'stand',direction:'south',index:0,running:false,last:0,elapsed:0,speed:1,ready:false,failed:false,raf:0};const controls=[staticButton,walkButton,pose,direction,play,speed,phase,chair];const image=(src,role)=>{const value=new Image();value.__nvRole=role;value.src=src;return value};const images={source:{},navy:{stand:{},sit:{},walk:{}},green:{stand:{},sit:{},walk:{}}};for(const view of data.views){images.source[view]=image(data.navy.original[view],'source-'+view);for(const who of ['navy','green']){for(const kind of ['stand','sit'])images[who][kind][view]=image(data[who][kind][view],who+'-'+kind+'-'+view);images[who].walk[view]=data[who].walk[view].map((src,index)=>image(src,who+'-walk-'+view+'-'+index))}}const theme=name=>{const probe=document.createElement('span');probe.style.color='var('+name+',currentColor)';probe.hidden=true;root.append(probe);const value=getComputedStyle(probe).color;probe.remove();return value};const stop=()=>{state.running=false;if(state.raf)cancelAnimationFrame(state.raf);state.raf=0};const disable=()=>controls.forEach(control=>control.disabled=true);const fail=error=>{stop();state.failed=true;disable();root.dataset.ready='error';status.setAttribute('role','alert');status.textContent='Review images could not load.';console.error(error)};const floor=context=>{context.save();context.strokeStyle=theme('--muted-foreground');context.globalAlpha=.55;context.beginPath();context.moveTo(0,data.canvas.floorY+.5);context.lineTo(160,data.canvas.floorY+.5);context.stroke();context.restore()};const drawChair=(context,seat,view,front)=>{if(!chair.checked)return;context.save();context.strokeStyle=theme('--muted-foreground');context.fillStyle=theme('--muted');context.lineWidth=3;if(view==='north'){if(front){context.fillStyle=theme('--secondary');context.fillRect(38,seat-40,84,40);context.strokeRect(38,seat-40,84,40)}else{context.fillRect(36,seat-3,88,8);context.strokeRect(36,seat-3,88,8)}}else if(!front){context.fillRect(36,seat-3,88,8);context.strokeRect(36,seat-3,88,8);context.beginPath();context.moveTo(45,seat+5);context.lineTo(45,data.canvas.floorY);context.moveTo(115,seat+5);context.lineTo(115,data.canvas.floorY);context.stroke();context.fillStyle=theme('--secondary');if(view==='south')context.fillRect(40,seat-70,80,70);else context.fillRect(view==='east'?39:106,seat-43,15,43)}context.restore()};const sprite=(who)=>state.mode==='walk'?images[who].walk[state.direction][state.index]:images[who][state.pose][state.direction];const paint=(canvas,spriteValue,seat,view)=>{const context=canvas.getContext('2d');context.clearRect(0,0,160,320);if(!spriteValue?.complete||!spriteValue.naturalWidth)throw Error('Decoded sprite missing');if(seat!==null)drawChair(context,seat,view,false);context.drawImage(spriteValue,0,0);if(seat!==null&&view==='north')drawChair(context,seat,view,true);floor(context)};const render=()=>{if(!state.ready||state.failed)return;try{root.dataset.ready='true';root.dataset.mode=state.mode;root.dataset.index=String(state.index);root.dataset.running=String(state.running);walkControls.hidden=state.mode!=='walk';chairControl.hidden=state.mode==='walk'||state.pose!=='sit';play.disabled=state.mode!=='walk';speed.disabled=state.mode!=='walk';phase.disabled=state.mode!=='walk';chair.disabled=state.mode==='walk'||state.pose!=='sit';staticButton.classList.toggle('btn-primary',state.mode==='static');walkButton.classList.toggle('btn-primary',state.mode==='walk');staticButton.setAttribute('aria-pressed',String(state.mode==='static'));walkButton.setAttribute('aria-pressed',String(state.mode==='walk'));phase.value=String(state.index+1);phaseOut.textContent=state.index+1+' / 8';panels.replaceChildren();const records=state.mode==='walk'?[['Navy vest',sprite('navy'),null],['Approved Green',sprite('green'),null]]:[['Original source',images.source[state.direction],null],['Navy vest',sprite('navy'),state.pose==='sit'?data.navy.seat[state.direction]:null],['Approved Green',sprite('green'),state.pose==='sit'?data.green.seat[state.direction]:null]];for(const [label,spriteValue,seat]of records){const figure=document.createElement('figure'),canvas=document.createElement('canvas'),caption=document.createElement('figcaption');canvas.width=160;canvas.height=320;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',label+' '+state.mode+' '+state.direction);paint(canvas,spriteValue,seat,state.direction);caption.textContent=label+' · '+(state.mode==='walk'?'walk '+(state.index+1)+'/8':state.pose)+' · '+state.direction;figure.append(canvas,caption);panels.append(figure)}status.textContent=state.mode==='walk'?'Walking · '+state.direction+' · frame '+(state.index+1)+'/8 · '+(state.running?'playing':'paused'):'Statics · '+state.pose+' · '+state.direction;play.textContent=state.running?'Pause':'Play walk'}catch(error){fail(error)}};const setMode=mode=>{stop();state.mode=mode;render()};const tick=()=>{if(!state.running)return;const now=performance.now(),delta=Number.isFinite(now-state.last)&&now>state.last?Math.min(100,now-state.last)*state.speed:0;state.last=now;state.elapsed=(state.elapsed+delta)%(data.cadenceMs*8);state.index=Math.floor(state.elapsed/data.cadenceMs);render();state.raf=requestAnimationFrame(tick)};staticButton.addEventListener('click',()=>setMode('static'));walkButton.addEventListener('click',()=>setMode('walk'));pose.addEventListener('change',()=>{state.pose=pose.value==='sit'?'sit':'stand';render()});direction.addEventListener('change',()=>{stop();state.direction=data.views.includes(direction.value)?direction.value:'south';state.index=0;state.elapsed=0;render()});chair.addEventListener('change',render);speed.addEventListener('change',()=>state.speed=speed.value==='0.5'?.5:1);phase.addEventListener('input',()=>{stop();state.index=Math.max(0,Math.min(7,Number(phase.value)-1));state.elapsed=state.index*data.cadenceMs;render()});play.addEventListener('click',()=>{if(state.mode!=='walk')return;if(state.running)stop();else{state.running=true;state.last=performance.now();state.raf=requestAnimationFrame(tick)}render()});window.__nvRender=render;matchMedia('(prefers-color-scheme: dark)').addEventListener('change',render);for(const node of [document.documentElement,document.body])new MutationObserver(render).observe(node,{attributes:true,attributeFilter:['class','data-theme','style']});try{await Promise.all([Object.values(images.source),...['navy','green'].map(who=>[...Object.values(images[who].stand),...Object.values(images[who].sit),...Object.values(images[who].walk).flat()])].flat().map(value=>value.decode()));state.ready=true;staticButton.disabled=false;walkButton.disabled=false;pose.disabled=false;direction.disabled=false;render()}catch(error){fail(error)}})();</script>`;
  const finalHtml = html
    .replace("state.mode==='walk'?[['Navy vest',sprite('navy'),null],['Approved Green',sprite('green'),null]]", "state.mode==='walk'?[['Navy Vest standing',images.navy.stand[state.direction],null],['Navy Vest fitted walk',sprite('navy'),null],['Approved Green walk',sprite('green'),null]]")
    .replace('<label class="form-label" for="nv-pose">', '<label class="form-label" id="nv-pose-control" for="nv-pose">')
    .replace("chairControl=$('nv-chair-control'),walkControls", "chairControl=$('nv-chair-control'),poseControl=$('nv-pose-control'),walkControls")
    .replace("walkControls.hidden=state.mode!=='walk';chairControl.hidden", "walkControls.hidden=state.mode!=='walk';poseControl.hidden=state.mode==='walk';chairControl.hidden")
    .replace("caption.textContent=label+' · '+(state.mode==='walk'?'walk '+(state.index+1)+'/8':state.pose)+' · '+state.direction;", "caption.textContent=label==='Original source'||label==='Navy Vest standing'?label+' · '+state.direction:label+' · '+(state.mode==='walk'?'walk '+(state.index+1)+'/8':state.pose)+' · '+state.direction;")
    .replaceAll('Original source', 'Original standing source');
  assert(Buffer.byteLength(finalHtml) < 1_000_000, `Inline review exceeds 1 MB (${Buffer.byteLength(finalHtml)} bytes)`);
  mkdirSync(reviewRoot, { recursive: true });
  writeFileSync(visualizationPath, finalHtml);
  const provenance = { schemaVersion: 1, visualizationPath, bytes: Buffer.byteLength(finalHtml), navyManifest: { path: manifestPath, sha256: sha(manifestBytes) }, approvedGreenRegistry: { path: greenRegistryPath, sha256: sha(greenBytes) }, source: manifest.source, frames: manifest.frames };
  writeFileSync(path.join(reviewRoot, 'ui-provenance.json'), `${JSON.stringify(provenance, null, 2)}\n`);
  console.log(JSON.stringify({ status: 'PASS', bytes: provenance.bytes, navyManifest: provenance.navyManifest, approvedGreenRegistry: provenance.approvedGreenRegistry }, null, 2));
}

await main();
