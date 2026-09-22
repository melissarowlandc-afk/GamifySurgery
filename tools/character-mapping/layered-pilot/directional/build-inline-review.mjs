import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const root = path.resolve(import.meta.dirname, '../../../..');
const artifactRoot = path.join(root, 'artifacts/character-movement/layered-pilot/directional-v1');
const manifestPath = path.join(artifactRoot, 'manifest.json');
const reviewRoot = path.join(artifactRoot, 'review');
const visualizationPath = 'C:/Users/Kyle Kent/.codex/visualizations/2026/09/13/01a09b55-147e-72f0-b413-e8b6827c7287/green-directional-walk.html';

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

async function packFrame(frame) {
  const absolutePath = path.isAbsolute(frame.file)
    ? frame.file
    : path.join(artifactRoot, frame.file);
  const bytes = readFileSync(absolutePath);
  if (sha256(bytes) !== frame.sha256) {
    throw new Error(`Frame hash mismatch: ${frame.file}`);
  }

  // File-path decoding avoids @napi-rs/canvas treating valid PNG bytes as SVG.
  const image = await loadImage(absolutePath);
  const canvas = createCanvas(image.width, image.height);
  canvas.getContext('2d').drawImage(image, 0, 0);
  return `data:image/webp;base64,${canvas.toBuffer('image/webp', 88).toString('base64')}`;
}

async function main() {
  const manifestBytes = readFileSync(manifestPath);
  const manifest = JSON.parse(manifestBytes);
  const directions = {};

  if (manifest.canvas?.width !== 160 || manifest.canvas?.height !== 320 || manifest.canvas?.floorY !== 287) {
    throw new Error('Directional review requires the expected 160x320, floorY=287 canvas contract.');
  }
  if (manifest.cadenceMs !== 180 || manifest.sequences?.length !== 3) {
    throw new Error('Directional review requires three eight-frame 180ms sequences.');
  }

  for (const sequence of manifest.sequences) {
    if (!['east', 'west', 'north'].includes(sequence.view) || sequence.frames?.length !== 8 || !sequence.stand) {
      throw new Error(`Unexpected directional sequence: ${sequence.view}`);
    }
    directions[sequence.view] = {
      frames: await Promise.all(sequence.frames.map(packFrame)),
      stand: await packFrame(sequence.stand),
    };
  }

  const payload = JSON.stringify({ directions, floorY: manifest.canvas.floorY, cadenceMs: manifest.cadenceMs });
  const html = `
<section id="green-directional-walk" aria-labelledby="gd-title" data-ready="false">
  <h3 id="gd-title">Green character · directional walk</h3>
  <p id="gd-status" aria-live="polite">Walk · frame 1/8 · paused</p>
  <div class="viz-controls" aria-label="Directional walk controls">
    <button class="btn" id="gd-play" type="button">Play</button>
    <label class="form-label" for="gd-speed">Speed</label>
    <select class="form-select" id="gd-speed"><option value="1">1×</option><option value="0.5">0.5×</option></select>
    <label class="form-label" for="gd-pose">Pose</label>
    <select class="form-select" id="gd-pose"><option value="walk">Walk</option><option value="stand">Stand</option></select>
    <label class="form-label" for="gd-phase">Phase</label>
    <input class="form-range" id="gd-phase" type="range" min="1" max="8" step="1" value="1">
    <output id="gd-phase-output" for="gd-phase">1 / 8</output>
  </div>
  <div class="gd-panels">
    <figure><canvas id="gd-east" width="160" height="320" role="img" aria-label="East-facing directional walk preview"></canvas><figcaption>East</figcaption></figure>
    <figure><canvas id="gd-west" width="160" height="320" role="img" aria-label="West-facing directional walk preview"></canvas><figcaption>West</figcaption></figure>
    <figure><canvas id="gd-north" width="160" height="320" role="img" aria-label="North-facing directional walk preview"></canvas><figcaption>North</figcaption></figure>
  </div>
  <p class="gd-note">Side/back artwork prepared for review. Original directional heads; prepared torso and limbs.</p>
</section>
<style>
  #green-directional-walk { box-sizing: border-box; max-width: 100%; color: var(--foreground); background: transparent; }
  #green-directional-walk *, #green-directional-walk *::before, #green-directional-walk *::after { box-sizing: border-box; }
  #green-directional-walk .gd-panels { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1rem; }
  #green-directional-walk figure { margin: 0; min-width: 160px; }
  #green-directional-walk canvas { display: block; width: 160px; height: 320px; max-width: 100%; }
  #green-directional-walk figcaption, #green-directional-walk .gd-note { margin-top: .4rem; }
  @media (max-width: 600px) { #green-directional-walk .gd-panels { display: grid; grid-template-columns: 1fr; } }
</style>
<script>
(async () => {
  const data = ${payload};
  const root = document.getElementById('green-directional-walk');
  const play = document.getElementById('gd-play');
  const speed = document.getElementById('gd-speed');
  const pose = document.getElementById('gd-pose');
  const phase = document.getElementById('gd-phase');
  const output = document.getElementById('gd-phase-output');
  const status = document.getElementById('gd-status');
  const views = ['east', 'west', 'north'];
  const canvases = Object.fromEntries(views.map((view) => [view, document.getElementById('gd-' + view)]));
  const images = Object.fromEntries(views.map((view) => [view, { walk: [], stand: null }]));
  const state = { pose: 'walk', running: false, index: 0, elapsed: 0, last: 0, speed: 1, raf: 0, ready: false, failed: false };

  function load(src) { const image = new Image(); image.src = src; return image; }
  for (const view of views) {
    images[view].walk = data.directions[view].frames.map(load);
    images[view].stand = load(data.directions[view].stand);
  }
  play.disabled = true;
  speed.disabled = true;
  pose.disabled = true;
  phase.disabled = true;

  function frameIndex(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    return Math.min(7, Math.max(0, Math.trunc(numeric)));
  }

  function fail(error) {
    state.failed = true;
    state.running = false;
    if (state.raf) cancelAnimationFrame(state.raf);
    state.raf = 0;
    play.disabled = true;
    speed.disabled = true;
    pose.disabled = true;
    phase.disabled = true;
    status.textContent = 'Preview assets could not load.';
    root.dataset.ready = 'error';
    root.dataset.error = error instanceof Error ? error.message : String(error);
    console.error(error);
  }

  function draw(view) {
    const canvas = canvases[view];
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    const index = frameIndex(state.index);
    state.index = index;
    const image = state.pose === 'walk' ? images[view].walk[index] : images[view].stand;
    if (!image || !image.complete || image.naturalWidth === 0) {
      fail(new Error('Decoded ' + state.pose + ' sprite missing for ' + view + ', frame ' + (index + 1) + '.'));
      return false;
    }
    context.drawImage(image, 0, 0);
    context.strokeStyle = getComputedStyle(root).getPropertyValue('--muted-foreground').trim() || getComputedStyle(root).color;
    context.globalAlpha = .55;
    context.beginPath(); context.moveTo(0, data.floorY + .5); context.lineTo(canvas.width, data.floorY + .5); context.stroke();
    context.globalAlpha = 1;
    return true;
  }

  function render() {
    if (!state.ready || state.failed || !views.every(draw)) return;
    const staticPose = state.pose === 'stand';
    play.disabled = staticPose;
    speed.disabled = false;
    pose.disabled = false;
    phase.disabled = staticPose;
    play.textContent = state.running ? 'Pause' : 'Play';
    phase.value = String(state.index + 1);
    output.textContent = staticPose ? 'Static endpoint' : (state.index + 1) + ' / 8';
    status.textContent = staticPose ? 'Stand · static endpoint' : 'Walk · frame ' + (state.index + 1) + '/8 · ' + (state.running ? 'playing' : 'paused');
    root.dataset.ready = 'true'; root.dataset.pose = state.pose; root.dataset.index = String(state.index); root.dataset.running = String(state.running);
  }

  function tick() {
    if (!state.running) return;
    const now = performance.now();
    const previous = Number.isFinite(state.last) ? state.last : now;
    const elapsed = now - previous;
    const delta = Number.isFinite(elapsed) && elapsed > 0 ? Math.min(100, elapsed) * state.speed : 0;
    state.last = now;
    state.elapsed = (state.elapsed + delta) % (data.cadenceMs * 8);
    const next = frameIndex(Math.floor(state.elapsed / data.cadenceMs));
    if (next !== state.index) { state.index = next; render(); }
    state.raf = requestAnimationFrame(tick);
  }

  function stop() {
    state.running = false;
    if (state.raf) cancelAnimationFrame(state.raf);
    state.raf = 0;
  }

  play.addEventListener('click', () => {
    if (!state.ready || state.failed) return;
    if (state.running) stop();
    else { state.running = true; state.last = performance.now(); state.raf = requestAnimationFrame(tick); }
    render();
  });
  speed.addEventListener('change', () => { state.speed = speed.value === '0.5' ? 0.5 : 1; });
  pose.addEventListener('change', () => { if (!state.ready || state.failed) return; state.pose = pose.value === 'stand' ? 'stand' : 'walk'; stop(); state.index = 0; state.elapsed = 0; render(); });
  phase.addEventListener('input', () => { if (!state.ready || state.failed) return; stop(); state.index = frameIndex(Number(phase.value) - 1); state.elapsed = state.index * data.cadenceMs; render(); });
  try {
    await Promise.all(views.flatMap((view) => [...images[view].walk, images[view].stand].map((image) => image.decode())));
    state.ready = true;
    render();
  } catch (error) {
    fail(error);
  }
})();
</script>`;

  if (Buffer.byteLength(html) >= 1_000_000) throw new Error('Inline visualization exceeds 1MB.');
  mkdirSync(reviewRoot, { recursive: true });
  writeFileSync(visualizationPath, html);
  writeFileSync(path.join(reviewRoot, 'ui-provenance.json'), JSON.stringify({
    manifestSha256: sha256(manifestBytes),
    sourcePin: manifest.source,
    visualBytes: Buffer.byteLength(html),
    renderer: 'verified PNG file-path decode → embedded WebP',
  }, null, 2) + '\n');
  console.log(JSON.stringify({ visualizationPath, bytes: Buffer.byteLength(html), manifestSha256: sha256(manifestBytes) }, null, 2));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
