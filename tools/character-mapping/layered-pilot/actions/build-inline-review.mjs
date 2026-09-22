import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const root = path.resolve(import.meta.dirname, '../../../..');
const artifactRoot = path.join(root, 'artifacts/character-movement/layered-pilot/actions-v1');
const manifestPath = path.join(artifactRoot, 'manifest.json');
const reviewRoot = path.join(artifactRoot, 'review');
const visualizationPath = 'C:/Users/Kyle Kent/.codex/visualizations/2026/09/13/01a09b55-147e-72f0-b413-e8b6827c7287/green-actions-review.html';
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

async function packFrame(frame) {
  const absolutePath = path.join(artifactRoot, frame.file);
  const bytes = readFileSync(absolutePath);
  if (sha256(bytes) !== frame.sha256) throw new Error(`Frame hash mismatch: ${frame.file}`);
  // Path decoding preserves valid PNG handling in @napi-rs/canvas.
  const image = await loadImage(absolutePath);
  const canvas = createCanvas(image.width, image.height);
  canvas.getContext('2d').drawImage(image, 0, 0);
  return `data:image/webp;base64,${canvas.toBuffer('image/webp', 88).toString('base64')}`;
}

async function main() {
  const manifestBytes = readFileSync(manifestPath);
  const manifest = JSON.parse(manifestBytes);
  const jump = manifest.sequences?.find(sequence => sequence.id === 'starJumpSouth');
  const sitting = manifest.statics?.sitting;
  const clipboard = manifest.statics?.clipboard?.south;
  if (!jump || jump.frames?.length !== 8 || !sitting || !clipboard) throw new Error('Expected approved jump, four sitting endpoints, and south clipboard endpoint.');
  if (!jump.frames.every(frame => frame.durationMs === 180)) throw new Error('Star jump must retain 180ms frame cadence.');
  const views = ['south', 'east', 'west', 'north'];
  if (!views.every(view => sitting[view]?.file && sitting[view]?.sha256)) throw new Error('Expected all four verified sitting views.');
  const payload = JSON.stringify({
    cadenceMs: 180,
    floorY: 287,
    seatY: 236,
    jump: await Promise.all(jump.frames.map(packFrame)),
    sitting: Object.fromEntries(await Promise.all(views.map(async view => [view, await packFrame(sitting[view])]))),
    clipboard: await packFrame(clipboard),
  });
  const html = `<section id="green-actions-review" aria-labelledby="ga-title" data-ready="false">
  <h3 id="ga-title">Green character · action review</h3>
  <p id="ga-status" aria-live="polite">Star jump · frame 1/8 · paused</p>
  <div class="viz-controls" aria-label="Action review controls">
    <label class="form-label" for="ga-action">Action</label>
    <select class="form-select" id="ga-action"><option value="jump">Star jump · South</option><option value="sit">Sitting · all directions</option><option value="clipboard">Clipboard · South</option></select>
    <button class="btn" id="ga-play" type="button">Play</button>
    <label class="form-label" for="ga-speed">Speed</label>
    <select class="form-select" id="ga-speed"><option value="1">1×</option><option value="0.5">0.5×</option></select>
    <label class="form-label" for="ga-phase">Phase</label>
    <input class="form-range" id="ga-phase" type="range" min="1" max="8" step="1" value="1">
    <output id="ga-phase-output" for="ga-phase">1 / 8</output>
    <label class="form-check ga-chair-label" for="ga-chair"><input class="form-check-input" id="ga-chair" type="checkbox" checked><span class="form-check-label">Chair</span></label>
  </div>
  <div class="ga-panels" data-action="jump">
    <figure class="ga-panel" data-panel="jump"><canvas id="ga-jump" width="160" height="320" role="img" aria-label="South-facing star jump preview"></canvas><figcaption>South</figcaption></figure>
    <figure class="ga-panel" data-panel="sit"><canvas id="ga-sit-south" width="160" height="320" role="img" aria-label="South-facing sitting preview"></canvas><figcaption>South</figcaption></figure>
    <figure class="ga-panel" data-panel="sit"><canvas id="ga-sit-east" width="160" height="320" role="img" aria-label="East-facing sitting preview"></canvas><figcaption>East</figcaption></figure>
    <figure class="ga-panel" data-panel="sit"><canvas id="ga-sit-west" width="160" height="320" role="img" aria-label="West-facing sitting preview"></canvas><figcaption>West</figcaption></figure>
    <figure class="ga-panel" data-panel="sit"><canvas id="ga-sit-north" width="160" height="320" role="img" aria-label="North-facing sitting preview"></canvas><figcaption>North</figcaption></figure>
    <figure class="ga-panel" data-panel="clipboard"><canvas id="ga-clipboard" width="160" height="320" role="img" aria-label="South-facing clipboard hold preview"></canvas><figcaption>South</figcaption></figure>
  </div>
</section>
<style>
  #green-actions-review { box-sizing: border-box; max-width: 100%; color: var(--foreground); background: transparent; }
  #green-actions-review *, #green-actions-review *::before, #green-actions-review *::after { box-sizing: border-box; }
  #green-actions-review .ga-panels { display: grid; gap: 1rem; margin-top: 1rem; }
  #green-actions-review .ga-panels[data-action="jump"], #green-actions-review .ga-panels[data-action="clipboard"] { grid-template-columns: minmax(160px, 160px); }
  #green-actions-review .ga-panels[data-action="sit"] { grid-template-columns: repeat(2, minmax(160px, 160px)); }
  #green-actions-review .ga-panel { display: none; margin: 0; min-width: 160px; }
  #green-actions-review .ga-panels[data-action="jump"] .ga-panel[data-panel="jump"], #green-actions-review .ga-panels[data-action="clipboard"] .ga-panel[data-panel="clipboard"], #green-actions-review .ga-panels[data-action="sit"] .ga-panel[data-panel="sit"] { display: block; }
  #green-actions-review canvas { display: block; width: 160px; height: 320px; max-width: 100%; }
  #green-actions-review figcaption { margin-top: .4rem; }
  #green-actions-review .ga-chair-label { white-space: nowrap; }
  @media (max-width: 420px) { #green-actions-review .ga-panels[data-action="sit"] { grid-template-columns: minmax(160px, 160px); } }
</style>
<script>
(async () => {
  const data = ${payload};
  const root = document.getElementById('green-actions-review');
  const action = document.getElementById('ga-action');
  const play = document.getElementById('ga-play');
  const speed = document.getElementById('ga-speed');
  const phase = document.getElementById('ga-phase');
  const output = document.getElementById('ga-phase-output');
  const chair = document.getElementById('ga-chair');
  const status = document.getElementById('ga-status');
  const panels = document.querySelector('#green-actions-review .ga-panels');
  const canvases = { jump: document.getElementById('ga-jump'), clipboard: document.getElementById('ga-clipboard'), sitting: Object.fromEntries(['south', 'east', 'west', 'north'].map(view => [view, document.getElementById('ga-sit-' + view)])) };
  const images = { jump: [], clipboard: null, sitting: {} };
  const state = { action: 'jump', index: 0, elapsed: 0, last: 0, running: false, speed: 1, raf: 0, ready: false, failed: false };
  const makeImage = source => { const image = new Image(); image.src = source; return image; };
  images.jump = data.jump.map(makeImage); images.clipboard = makeImage(data.clipboard);
  for (const [view, source] of Object.entries(data.sitting)) images.sitting[view] = makeImage(source);
  for (const control of [action, play, speed, phase, chair]) control.disabled = true;

  function frameIndex(value) { const number = Number(value); return Number.isFinite(number) ? Math.min(7, Math.max(0, Math.trunc(number))) : 0; }
  function stop() { state.running = false; if (state.raf) cancelAnimationFrame(state.raf); state.raf = 0; }
  function fail(error) { stop(); state.failed = true; for (const control of [action, play, speed, phase, chair]) control.disabled = true; status.textContent = 'Preview assets could not load.'; root.dataset.ready = 'error'; root.dataset.error = error instanceof Error ? error.message : String(error); console.error(error); }
  function floor(context) { context.save(); context.strokeStyle = getComputedStyle(root).getPropertyValue('--muted-foreground').trim() || getComputedStyle(root).color; context.globalAlpha = .55; context.beginPath(); context.moveTo(0, data.floorY + .5); context.lineTo(160, data.floorY + .5); context.stroke(); context.restore(); }
  function chairPalette(context) { const style = getComputedStyle(root); return { wood: style.getPropertyValue('--secondary').trim() || 'transparent', dark: style.getPropertyValue('--muted-foreground').trim() || style.color, cushion: style.getPropertyValue('--muted').trim() || 'transparent' }; }
  function drawChair(context, view, foreground) {
    const palette = chairPalette(context); context.save(); context.lineJoin = 'round'; context.lineCap = 'round';
    if (!foreground) {
      context.strokeStyle = palette.dark; context.lineWidth = 4;
      for (const x of [40, 120]) { context.beginPath(); context.moveTo(x, data.seatY + 3); context.lineTo(x, data.floorY); context.stroke(); }
    }
    const seat = () => { context.fillStyle = palette.cushion; context.fillRect(36, data.seatY - 5, 88, 10); context.strokeStyle = palette.dark; context.lineWidth = 3; context.strokeRect(36, data.seatY - 5, 88, 10); };
    if (view === 'north') { if (!foreground) seat(); else { context.fillStyle = palette.wood; context.fillRect(38, 184, 84, 50); context.strokeStyle = palette.dark; context.lineWidth = 3; context.strokeRect(38, 184, 84, 50); } }
    else if (!foreground) {
      seat(); context.fillStyle = palette.wood; context.strokeStyle = palette.dark; context.lineWidth = 3;
      if (view === 'south') { context.fillRect(40, 154, 80, 80); context.strokeRect(40, 154, 80, 80); }
      if (view === 'east') { context.fillRect(39, 188, 15, 48); context.strokeRect(39, 188, 15, 48); }
      if (view === 'west') { context.fillRect(106, 188, 15, 48); context.strokeRect(106, 188, 15, 48); }
    }
    context.restore();
  }
  function drawSprite(canvas, image, chairView = null) {
    const context = canvas.getContext('2d'); context.clearRect(0, 0, 160, 320);
    if (!image || !image.complete || image.naturalWidth === 0) throw new Error('Decoded sprite missing.');
    if (chairView && chair.checked) drawChair(context, chairView, false);
    context.drawImage(image, 0, 0);
    if (chairView === 'north' && chair.checked) drawChair(context, chairView, true);
    floor(context);
  }
  function render() {
    if (!state.ready || state.failed) return;
    try {
      if (state.action === 'jump') drawSprite(canvases.jump, images.jump[frameIndex(state.index)]);
      else if (state.action === 'clipboard') drawSprite(canvases.clipboard, images.clipboard);
      else for (const view of ['south', 'east', 'west', 'north']) drawSprite(canvases.sitting[view], images.sitting[view], view);
    } catch (error) { fail(error); return; }
    const animated = state.action === 'jump';
    play.disabled = !animated; speed.disabled = !animated; phase.disabled = !animated; chair.disabled = state.action !== 'sit';
    play.textContent = state.running ? 'Pause' : (state.index === 7 ? 'Replay' : 'Play');
    phase.value = String(frameIndex(state.index) + 1); output.textContent = animated ? (frameIndex(state.index) + 1) + ' / 8' : 'Static endpoint';
    status.textContent = animated ? 'Star jump · frame ' + (frameIndex(state.index) + 1) + '/8 · ' + (state.running ? 'playing' : state.index === 7 ? 'ready' : 'paused') : (state.action === 'sit' ? 'Sitting · static endpoints · all directions' : 'Clipboard · static endpoint · South');
    panels.dataset.action = state.action; root.dataset.ready = 'true'; root.dataset.action = state.action; root.dataset.index = String(frameIndex(state.index)); root.dataset.running = String(state.running);
  }
  function tick() {
    if (!state.running) return;
    const now = performance.now(); const previous = Number.isFinite(state.last) ? state.last : now; const elapsed = now - previous;
    const delta = Number.isFinite(elapsed) && elapsed > 0 ? Math.min(100, elapsed) * state.speed : 0; state.last = now; state.elapsed += delta;
    if (state.elapsed >= data.cadenceMs * 8) { state.elapsed = data.cadenceMs * 8; state.index = 7; stop(); render(); return; }
    const next = frameIndex(Math.floor(state.elapsed / data.cadenceMs)); if (next !== state.index) { state.index = next; render(); }
    state.raf = requestAnimationFrame(tick);
  }
  play.addEventListener('click', () => { if (!state.ready || state.failed || state.action !== 'jump') return; if (state.running) stop(); else { if (state.index === 7) { state.index = 0; state.elapsed = 0; } state.running = true; state.last = performance.now(); state.raf = requestAnimationFrame(tick); } render(); });
  speed.addEventListener('change', () => { state.speed = speed.value === '0.5' ? 0.5 : 1; });
  phase.addEventListener('input', () => { if (!state.ready || state.failed || state.action !== 'jump') return; stop(); state.index = frameIndex(Number(phase.value) - 1); state.elapsed = state.index * data.cadenceMs; render(); });
  chair.addEventListener('change', render);
  action.addEventListener('change', () => { if (!state.ready || state.failed) return; stop(); state.action = ['jump', 'sit', 'clipboard'].includes(action.value) ? action.value : 'jump'; state.index = 0; state.elapsed = 0; render(); });
  try { await Promise.all([...images.jump, images.clipboard, ...Object.values(images.sitting)].map(image => image.decode())); state.ready = true; for (const control of [action, play, speed, phase, chair]) control.disabled = false; render(); } catch (error) { fail(error); }
})();
</script>`;
  if (Buffer.byteLength(html) >= 1_000_000) throw new Error('Inline visualization exceeds 1MB.');
  mkdirSync(reviewRoot, { recursive: true });
  writeFileSync(visualizationPath, html);
  writeFileSync(path.join(reviewRoot, 'ui-provenance.json'), `${JSON.stringify({ manifestSha256: sha256(manifestBytes), visualBytes: Buffer.byteLength(html), renderer: 'verified PNG file-path decode to embedded WebP', chair: { seatY: 236, floorY: 287, northForegroundBack: true } }, null, 2)}\n`);
  console.log(JSON.stringify({ visualizationPath, bytes: Buffer.byteLength(html), manifestSha256: sha256(manifestBytes) }, null, 2));
}

main().catch(error => { console.error(error); process.exitCode = 1; });
