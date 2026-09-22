import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const [manifestArg, outputArg, artifactArg] = process.argv.slice(2);
if (!manifestArg) throw Error('Usage: build-batch-02-preview.mjs <sealed-manifest> [output-directory] [artifact-directory]');
const repo = path.resolve(import.meta.dirname, '../../..');
const outputDir = outputArg ? path.resolve(outputArg) : 'C:/Users/Kyle Kent/.codex/visualizations/2026/09/10/01a08bf5-7fc2-7572-8909-8fbc532daecd';
const artifactDir = artifactArg ? path.resolve(artifactArg) : path.join(repo, 'artifacts/character-movement/batch-02-preview');
const manifestFile = path.resolve(manifestArg), manifestDirectory = path.dirname(manifestFile);
const manifestBytes = fs.readFileSync(manifestFile), manifest = JSON.parse(manifestBytes);
const directions = ['east', 'west', 'south', 'north'], phaseIds = ['01', '02', '03', '04', '05', '06', '07', '08'];
const tile = { width: 240, height: 310, baseline: 300 };
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function safe(relative) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative) || relative.split(/[\\/]/).includes('..')) throw Error(`Unsafe asset: ${relative}`);
  const full = path.resolve(manifestDirectory, relative);
  if (path.relative(manifestDirectory, full).startsWith('..')) throw Error(`Asset escapes manifest: ${relative}`);
  return full;
}
function verify(relative, expected, label) {
  if (!/^[a-f0-9]{64}$/.test(expected ?? '')) throw Error(`${label} lacks SHA-256`);
  const file = safe(relative);
  if (sha256(fs.readFileSync(file)) !== expected) throw Error(`${label} hash mismatch`);
}
if (JSON.stringify(manifest.directions) !== JSON.stringify(directions) || JSON.stringify(manifest.phaseIds) !== JSON.stringify(phaseIds) || manifest.characters?.length !== 2) throw Error('Expected exactly two complete four-direction characters');
for (const character of manifest.characters) {
  if (!character.id || !character.runtimeId) throw Error('Character ID/runtime ID missing');
  for (const direction of directions) for (const phase of phaseIds) {
    const frame = character.directions?.[direction]?.[phase], registration = frame?.geometry?.registration;
    if (!Number.isFinite(registration?.frameAxisX) || !Number.isFinite(registration?.frameFloorY)) throw Error(`${character.id} ${direction}/${phase} registration missing`);
    for (const kind of ['clean', 'guide']) verify(frame[kind], frame.sha256?.[kind], `${character.id} ${direction}/${phase} ${kind}`);
  }
  for (const pose of ['standSouth', 'sitSouth']) {
    const frame = character.static?.[pose], registration = frame?.registration;
    if (!Number.isFinite(registration?.axisX) || !Number.isFinite(registration?.floorY)) throw Error(`${character.id} ${pose} registration missing`);
    for (const kind of ['clean', 'guide']) verify(frame[kind], frame.sha256?.[kind], `${character.id} ${pose} ${kind}`);
  }
  const sourceRegistration = character.sourcePreviewRegistration;
  if (!Number.isFinite(sourceRegistration?.axisX) || !Number.isFinite(sourceRegistration?.floorY)) throw Error(`${character.id} source registration missing`);
  verify(character.sourcePreview?.clean, character.sourcePreview?.sha256, `${character.id} source`);
}
async function motionCanvas(kind) {
  const canvas = createCanvas(1920, 3720), context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  for (let row = 0; row < 2; row++) {
    const character = manifest.characters[row];
    for (let d = 0; d < 4; d++) for (let p = 0; p < 8; p++) {
      const frame = character.directions[directions[d]][phaseIds[p]], image = await loadImage(safe(frame[kind])), r = frame.geometry.registration;
      context.drawImage(image, p * 240 + 120 - r.frameAxisX, (row * 6 + d) * 310 + 300 - r.frameFloorY);
    }
    for (const [offset, pose] of ['standSouth', 'sitSouth'].entries()) {
      const frame = character.static[pose], image = await loadImage(safe(frame[kind])), r = frame.registration;
      context.drawImage(image, 120 - r.axisX, (row * 6 + 4 + offset) * 310 + 300 - r.floorY);
    }
  }
  return canvas;
}
async function sourceCanvas() {
  const canvas = createCanvas(240, 620), context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  for (let row = 0; row < 2; row++) {
    const character = manifest.characters[row], image = await loadImage(safe(character.sourcePreview.clean)), r = character.sourcePreviewRegistration;
    context.drawImage(image, 120 - r.axisX, row * 310 + 300 - r.floorY);
  }
  return canvas;
}
const cleanCanvas = await motionCanvas('clean'), guideCanvas = await motionCanvas('guide'), originalCanvas = await sourceCanvas();
function fragment(contract) {
  const data = JSON.stringify(contract).replace(/</g, '\\u003c');
  return `<style>
#batch-02-character-walks{box-sizing:border-box;max-width:100%;overflow:visible}#batch-02-character-walks *{box-sizing:border-box}
#batch-02-character-walks .batch-controls,#batch-02-character-walks .batch-phases{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:8px 0}
#batch-02-character-walks .batch-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
#batch-02-character-walks figure{min-width:0;margin:0;text-align:center}#batch-02-character-walks figcaption{margin:4px 0;font-weight:500;text-align:left}
#batch-02-character-walks canvas{display:block;width:240px;max-width:240px;height:310px;max-height:310px;margin-inline:auto;background:var(--card)}
#batch-02-character-walks .batch-source{margin-top:8px}#batch-02-character-walks .batch-source[hidden]{display:none}#batch-02-character-walks .batch-provenance{overflow-wrap:anywhere}
@media(max-width:560px){#batch-02-character-walks .batch-grid{grid-template-columns:1fr}}
</style>
<main id="batch-02-character-walks" data-atlas-ready="false">
<h2>Revised character motion review</h2><p id="batch-02-status">Loading artwork…</p><p id="batch-02-announcement" class="sr-only" aria-live="polite"></p>
<div class="batch-controls viz-controls"><button class="btn" id="batch-02-play" type="button" aria-pressed="false">Play</button><button class="btn" id="batch-02-previous" type="button">Previous</button><button class="btn" id="batch-02-next" type="button">Next</button>
<label class="form-label">Direction <select class="form-select" id="batch-02-direction"><option value="0">East</option><option value="1">West</option><option value="2">South</option><option value="3">North</option></select></label>
<label class="form-label">Pose <select class="form-select" id="batch-02-mode"><option value="walk">Walk</option><option value="stand">Standing South</option><option value="sit">Sitting South (original reference)</option></select></label>
<label class="form-label">Art <select class="form-select" id="batch-02-view"><option value="artwork">Artwork</option><option value="guide">Guide</option><option value="overlay">Overlay</option></select></label>
<label class="form-check"><input class="form-check-input" id="batch-02-source-toggle" type="checkbox"> Show source</label></div>
<div id="batch-02-phases" class="batch-phases" aria-label="Walk phase"></div><div id="batch-02-grid" class="batch-grid"></div>
<details><summary>Source identification</summary><ul id="batch-02-provenance" class="batch-provenance"></ul></details></main>
<script>(()=>{const C=${data},R=document.getElementById('batch-02-character-walks'),Q=s=>R.querySelector(s),reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches,S={p:0,d:0,m:'walk',v:'artwork',play:!reduced,ready:false,last:null,carry:0,resume:!reduced},duration=180,A={clean:new Image(),guide:new Image(),source:new Image()},V=[],Z=[],G=Q('#batch-02-grid'),announce=x=>Q('#batch-02-announcement').textContent=x;R.__batch02Contract=C;R.querySelectorAll('button,select,input').forEach(control=>control.disabled=true);
C.characters.forEach((character,row)=>{const f=document.createElement('figure'),cap=document.createElement('figcaption'),motion=document.createElement('canvas'),wrap=document.createElement('div'),label=document.createElement('div'),source=document.createElement('canvas');cap.textContent=character.label;motion.id='batch-02-canvas-'+row;motion.width=240;motion.height=310;motion.setAttribute('role','img');motion.setAttribute('aria-label','Motion preview for '+character.label);wrap.id='batch-02-source-'+row;wrap.className='batch-source';wrap.hidden=true;label.className='text-small text-muted';label.textContent='Original source comparison';source.width=240;source.height=310;source.setAttribute('role','img');source.setAttribute('aria-label','Original source comparison for '+character.label);wrap.append(label,source);f.append(cap,motion,wrap);G.append(f);V.push(motion);Z.push([wrap,source])});
const P=Q('#batch-02-phases');C.phaseIds.forEach((phase,index)=>{const b=document.createElement('button');b.className='btn';b.type='button';b.textContent=phase;b.disabled=true;b.addEventListener('click',()=>{S.p=index;S.play=false;S.last=null;S.carry=0;render();announce('Walk phase '+(index+1)+' selected')});P.append(b)});
const provenance=Q('#batch-02-provenance');[{path:C.manifest,sha256:C.manifestPin},...C.characters].forEach(item=>{const li=document.createElement('li');li.textContent=item.path?item.path+' · '+item.sha256:item.label+' · '+item.runtimeId+' · '+item.sourceProvenance;provenance.append(li)});
const draw=(ctx,img,x,y)=>ctx.drawImage(img,x,y,240,310,0,0,240,310);
function render(){if(!S.ready)return;V.forEach((canvas,row)=>{const ctx=canvas.getContext('2d'),x=(S.m==='walk'?S.p:0)*240,y=(row*6+(S.m==='walk'?S.d:S.m==='stand'?4:5))*310;ctx.clearRect(0,0,240,310);if(S.v!=='guide')draw(ctx,A.clean,x,y);if(S.v!=='artwork'){ctx.globalAlpha=S.v==='overlay'?0.58:1;draw(ctx,A.guide,x,y);ctx.globalAlpha=1}});const description=S.m==='walk'?'Phase '+(S.p+1)+' of 8':'Static '+(S.m==='stand'?'standing South':'sitting South');Q('#batch-02-status').textContent=description+' · '+(S.play?'playing':'paused');Q('#batch-02-play').textContent=S.play?'Pause':'Play';Q('#batch-02-play').setAttribute('aria-pressed',String(S.play));[...P.children].forEach((b,i)=>b.setAttribute('aria-pressed',String(i===S.p)))}
function setPlay(next){S.play=Boolean(next)&&S.m==='walk';S.last=null;S.carry=0;render();announce(S.play?'Animation playing':'Animation paused')}Q('#batch-02-play').addEventListener('click',()=>setPlay(!S.play));Q('#batch-02-previous').addEventListener('click',()=>{S.p=(S.p+7)%8;setPlay(false);announce('Walk phase '+(S.p+1)+' selected')});Q('#batch-02-next').addEventListener('click',()=>{S.p=(S.p+1)%8;setPlay(false);announce('Walk phase '+(S.p+1)+' selected')});Q('#batch-02-direction').addEventListener('change',e=>{S.d=Number(e.target.value);render();announce(e.target.selectedOptions[0].text+' selected')});
Q('#batch-02-mode').addEventListener('change',e=>{const prior=S.m,next=e.target.value;if(prior==='walk'&&next!=='walk')S.resume=S.play;S.m=next;if(next!=='walk'){S.play=false;S.last=null}else if(prior!=='walk'){S.play=S.resume;S.last=null}render();announce(e.target.selectedOptions[0].text+' selected')});Q('#batch-02-view').addEventListener('change',e=>{S.v=e.target.value;render();announce(e.target.selectedOptions[0].text+' selected')});
Q('#batch-02-source-toggle').addEventListener('change',e=>{if(!S.ready)return;Z.forEach(([wrap,canvas],row)=>{wrap.hidden=!e.target.checked;if(e.target.checked){const ctx=canvas.getContext('2d');ctx.clearRect(0,0,240,310);draw(ctx,A.source,0,row*310)}});announce(e.target.checked?'Source comparisons shown':'Source comparisons hidden')});
let loaded=0;Object.entries(A).forEach(([name,image])=>{image.addEventListener('load',()=>{if(++loaded!==3)return;S.ready=Object.values(A).every(candidate=>candidate.naturalWidth>0);R.dataset.atlasReady=String(S.ready);for(const [key,value] of Object.entries(A))R.dataset[key+'NaturalWidth']=String(value.naturalWidth);R.querySelectorAll('button,select,input').forEach(control=>control.disabled=!S.ready);render()});image.addEventListener('error',()=>{Q('#batch-02-status').textContent='Artwork failed to load';R.dataset.atlasReady='error'});image.src=C.atlas[name]});
function tick(now){if(S.ready&&S.play&&S.m==='walk'){if(S.last!==null){S.carry+=now-S.last;let changed=false;while(S.carry>=duration){S.p=(S.p+1)%8;S.carry-=duration;changed=true}if(changed)render()}S.last=now}else S.last=null;requestAnimationFrame(tick)}requestAnimationFrame(tick)})();</script>`;
}
let selected;
for (const quality of [90, 85, 80]) {
  const buffers = { clean: cleanCanvas.toBuffer('image/webp', quality), guide: guideCanvas.toBuffer('image/webp', quality), source: originalCanvas.toBuffer('image/webp', quality) };
  const contract = { tile: [240, 310], directions, phaseIds, manifest: path.relative(repo, manifestFile).replaceAll('\\', '/'), manifestPin: sha256(manifestBytes), quality, characters: manifest.characters.map((character, index) => ({ id: character.id, runtimeId: character.runtimeId, label: ['Green cardigan', 'Gray braid'][index], sourceProvenance: character.sourcePreview.provenance ?? 'approved original source' })), atlas: Object.fromEntries(Object.entries(buffers).map(([name, bytes]) => [name, `data:image/webp;base64,${bytes.toString('base64')}`])) };
  const html = fragment(contract);
  if (Buffer.byteLength(html) < 1_000_000) { selected = { quality, buffers, contract, html }; break; }
}
if (!selected) throw Error('Native 240x310 preview exceeds 1 MB at quality 80; refusing to downsample');
fs.mkdirSync(outputDir, { recursive: true });fs.mkdirSync(artifactDir, { recursive: true });
const atlases = {};
for (const [name, bytes] of Object.entries(selected.buffers)) { const file = path.join(outputDir, `batch-02-character-walks-${name}-atlas.webp`);fs.writeFileSync(file, bytes);atlases[name] = { file, bytes: bytes.length, sha256: sha256(bytes), width: name === 'source' ? 240 : 1920, height: name === 'source' ? 620 : 3720 }; }
const htmlFile = path.join(outputDir, 'batch-02-character-walks.html');fs.writeFileSync(htmlFile, selected.html);
const report = { manifest: selected.contract.manifest, manifestPin: selected.contract.manifestPin, quality: selected.quality, tile: [240, 310], characters: selected.contract.characters, output: { html: htmlFile, htmlBytes: Buffer.byteLength(selected.html), atlases } };
fs.writeFileSync(path.join(artifactDir, 'build-report.json'), JSON.stringify(report, null, 2));console.log(JSON.stringify(report, null, 2));
