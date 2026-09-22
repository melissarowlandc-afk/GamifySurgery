import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const outputHtmlDefault = 'C:/Users/Kyle Kent/.codex/visualizations/2026/09/13/01a09b55-147e-72f0-b413-e8b6827c7287/green-layered-motion.html';
const defaultManifest = 'C:/Users/Kyle Kent/Projects/GamifySurgery/artifacts/character-movement/layered-pilot/v6-motion/manifest.json';
const defaultReport = 'C:/Users/Kyle Kent/Projects/GamifySurgery/artifacts/character-movement/layered-pilot/v6-motion/review-checks/build-v6-inline-review-report.json';

const [manifestArg, htmlArg, reportArg] = process.argv.slice(2);
const repo = path.resolve(import.meta.dirname, '../../..');
const outputHtml = path.resolve(htmlArg || outputHtmlDefault);
const reportFile = path.resolve(reportArg || defaultReport);

const manifestRef = resolveManifest(manifestArg);
const sourceRect = [75, 30, 160, 320];
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

const manifestBytes = fs.readFileSync(manifestRef.path, 'utf8');
const manifest = JSON.parse(manifestBytes);
if (manifest.schemaVersion !== 6) {
  throw new Error(`Expected manifest schemaVersion 6, got ${manifest.schemaVersion ?? 'missing'}`);
}
if (!Array.isArray(manifest.sequences) || manifest.sequences.length === 0) {
  throw new Error('Manifest has no sequences');
}

for (const sequence of manifest.sequences) {
  if (!sequence?.id || !sequence.label || !Number.isFinite(sequence.fps) || !Number.isInteger(sequence.fps) || sequence.fps <= 0) {
    throw new Error(`Malformed sequence entry for id=${sequence?.id}`);
  }
  if (!Array.isArray(sequence.frames) || sequence.frames.length === 0) {
    throw new Error(`Sequence ${sequence.id} has missing/empty frames`);
  }
}

const v6Root = path.dirname(manifestRef.path);
for (const sequence of manifest.sequences) {
  for (const frame of sequence.frames) {
    if (!frame?.file || typeof frame.file !== 'string') {
      throw new Error(`Sequence ${sequence.id} contains a frame without a file field`);
    }
    frame.__absFile = resolveWithinRoot(v6Root, frame.file);
    if (!fs.existsSync(frame.__absFile)) {
      throw new Error(`Missing frame file for ${sequence.id}: ${frame.file}`);
    }
    if (typeof frame.sha256 !== 'string' || !/^[a-f0-9]{64}$/i.test(frame.sha256)) {
      throw new Error(`Frame ${frame.file} in sequence ${sequence.id} is missing sha256`);
    }
  }
}

const sourcePath = resolveSourcePath(manifest, repo, v6Root);
if (!fs.existsSync(sourcePath)) {
  throw new Error(`Cannot resolve source image at ${sourcePath}`);
}
const sourceImage = await loadImage(sourcePath);
if (sourceImage.width < sourceRect[0] + sourceRect[2] || sourceImage.height < sourceRect[1] + sourceRect[3]) {
  throw new Error('Source image is too small for fixed south crop [75, 30, 160, 320]');
}
const sourceCanvas = createCanvas(sourceRect[2], sourceRect[3]);
const sourceContext = sourceCanvas.getContext('2d');
sourceContext.drawImage(sourceImage, sourceRect[0], sourceRect[1], sourceRect[2], sourceRect[3], 0, 0, sourceRect[2], sourceRect[3]);
const sourceWebp = sourceCanvas.toBuffer('image/webp', 80);
const sourceWebpDataUrl = `data:image/webp;base64,${sourceWebp.toString('base64')}`;

if (manifest.sourceComparison?.file) {
  const comparisonFile = path.resolve(v6Root, manifest.sourceComparison.file);
  if (!fs.existsSync(comparisonFile)) {
    throw new Error(`manifest.sourceComparison.file not on disk: ${manifest.sourceComparison.file}`);
  }
  const comparisonHash = hash(fs.readFileSync(comparisonFile));
  if (manifest.sourceComparison.sha256 && manifest.sourceComparison.sha256 !== comparisonHash) {
    throw new Error('manifest.sourceComparison SHA mismatch');
  }
  const comparisonImage = await loadImage(comparisonFile);
  if (comparisonImage.width !== sourceRect[2] || comparisonImage.height !== sourceRect[3]) {
    throw new Error('manifest.sourceComparison has wrong dimensions for fixed crop');
  }
  const comparisonCanvas = createCanvas(sourceRect[2], sourceRect[3]);
  comparisonCanvas.getContext('2d').drawImage(comparisonImage, 0, 0, sourceRect[2], sourceRect[3]);
  const sourcePixels = sourceContext.getImageData(0, 0, sourceRect[2], sourceRect[3]).data;
  const comparisonPixels = comparisonCanvas.getContext('2d').getImageData(0, 0, sourceRect[2], sourceRect[3]).data;
  for (let i = 0; i < sourcePixels.length; i += 1) {
    if (sourcePixels[i] !== comparisonPixels[i]) {
      throw new Error('Rendered source crop does not match manifest sourceComparison');
    }
  }
}

function frameMetadataFor(frame) {
  const contacts = Array.isArray(frame.contacts) ? frame.contacts : [];
  const contactFloorY = contacts.map(contact => contact?.floorY).find(Number.isFinite);
  const footLeft = frame?.pose?.footTargets?.left;
  const footRight = frame?.pose?.footTargets?.right;
  return {
    floorY: Number.isFinite(manifest?.rig?.floorY) ? manifest.rig.floorY : Number.isFinite(contactFloorY) ? contactFloorY : Number.isFinite(footLeft) ? footLeft : Number.isFinite(footRight) ? footRight : null,
    seatY: Number.isFinite(frame?.pose?.seatY) ? frame.pose.seatY : Number.isFinite(manifest?.rig?.seated?.seatY) ? manifest.rig.seated.seatY : null,
    travelX: Number.isFinite(frame?.pose?.travelX) ? frame.pose.travelX : null,
    replacement: frame?.pose?.replacement ?? null,
    planted: frame?.pose?.planted ?? null,
  };
}

const candidateQualities = [80, 70, 60];
let selected = null;

for (const quality of candidateQualities) {
  const encoded = [];
  for (const sequence of manifest.sequences) {
    const frames = [];
    for (const frame of sequence.frames) {
      const image = await loadImage(frame.__absFile);
      if (!frame.width || !frame.height) {
        frame.width = image.width;
        frame.height = image.height;
      }
      if (image.width !== frame.width || image.height !== frame.height) {
        throw new Error(`Frame dimensions changed while reading ${frame.file}`);
      }
      if (image.width !== manifest.rig?.canvas?.width || image.height !== manifest.rig?.canvas?.height) {
        throw new Error(`Frame ${frame.file} has unexpected native size ${image.width}x${image.height}`);
      }
      const frameCanvas = createCanvas(image.width, image.height);
      frameCanvas.getContext('2d').drawImage(image, 0, 0);
      const webp = frameCanvas.toBuffer('image/webp', quality);
      frames.push({
        index: frame.index,
        sha256: frame.sha256,
        width: frame.width,
        height: frame.height,
        metadata: frameMetadataFor(frame),
        src: `data:image/webp;base64,${webp.toString('base64')}`,
      });
    }

    encoded.push({
      id: sequence.id,
      label: sequence.id === 'walk' ? 'Walk in place' : sequence.label,
      fps: sequence.fps,
      loop: sequence.id === 'walk',
      frameCount: sequence.frames.length,
      width: sequence.frames[0]?.width,
      height: sequence.frames[0]?.height,
      frames,
    });
  }

  const contract = {
    schemaVersion: 6,
    manifestPath: path.relative(repo, manifestRef.path).replaceAll('\\', '/'),
    manifestSha256: hash(manifestBytes),
    sourceRect,
    sourcePin: {
      path: manifest.assetPins?.source?.path ?? null,
      sha256: manifest.assetPins?.source?.sha256 ?? null,
      cropSha256: hash(sourceWebp),
      output: manifest.sourceComparison?.file ?? 'green-source-south.png',
    },
    frameMetadataKeys: ['floorY', 'seatY', 'travelX', 'replacement', 'planted'],
    frameMetadataFallback: {
      floorY: manifest.rig?.floorY,
      seatY: manifest.rig?.seated?.seatY,
      replacementFrame: manifest.replacementContract?.seatedLowerBodyBeginsAtFrame,
    },
    rig: {
      floorY: manifest.rig?.floorY,
      seated: manifest.rig?.seated
        ? {
            seatY: manifest.rig.seated.seatY,
            lowerTopY: manifest.rig.seated.lowerTopY,
            lowerHeight: manifest.rig.seated.lowerHeight,
          }
        : null,
      hips: manifest.rig?.hips ? manifest.rig.hips : null,
      shoulders: manifest.rig?.shoulders ? manifest.rig.shoulders : null,
    },
    sequences: encoded,
    canvas: {
      width: manifest.rig?.canvas?.width ?? 160,
      height: manifest.rig?.canvas?.height ?? 320,
    },
    sourceDataUrl: sourceWebpDataUrl,
    encoding: { format: 'webp', quality },
  };

  const html = fragment(contract);
  if (Buffer.byteLength(html) < 1_000_000) {
    selected = { contract, html };
    break;
  }
}

if (!selected) {
  throw new Error('Unable to fit V6 inline motion HTML under 1 MB');
}

fs.mkdirSync(path.dirname(outputHtml), { recursive: true });
fs.mkdirSync(path.dirname(reportFile), { recursive: true });
fs.writeFileSync(outputHtml, selected.html);

const report = {
  manifest: path.relative(repo, manifestRef.path).replaceAll('\\', '/'),
  manifestSha256: hash(manifestBytes),
  output: {
    html: path.relative(repo, outputHtml).replaceAll('\\', '/'),
    htmlBytes: Buffer.byteLength(selected.html),
  },
  sourceRect,
  sourcePin: {
    output: manifest.sourceComparison?.file ?? 'green-source-south.png',
    cropSha256: hash(sourceWebp),
    sourcePath: manifest.assetPins?.source?.path ?? null,
    sourceSha256: manifest.assetPins?.source?.sha256 ?? null,
  },
  sequences: selected.contract.sequences.map(sequence => ({
    id: sequence.id,
    label: sequence.label,
    fps: sequence.fps,
    loop: sequence.loop,
    frameCount: sequence.frameCount,
  })),
  encoding: selected.contract.encoding,
};
fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));

function resolveManifest(manifestArg) {
  if (manifestArg) {
    const candidate = path.resolve(manifestArg);
    if (!fs.existsSync(candidate)) {
      throw new Error(`Manifest not found at ${candidate}. Ask Sol for exact filename under v6-motion.`);
    }
    return { path: candidate, dir: path.dirname(candidate) };
  }

  const defaultPath = path.resolve(defaultManifest);
  if (fs.existsSync(defaultPath)) {
    return { path: defaultPath, dir: path.dirname(defaultPath) };
  }

  const v6Root = path.resolve(repo, 'artifacts/character-movement/layered-pilot/v6-motion');
  if (!fs.existsSync(v6Root)) {
    throw new Error('No default v6 motion output root exists. Ask Sol for exact manifest filename.');
  }
  const candidates = fs.readdirSync(v6Root)
    .map(file => path.resolve(v6Root, file))
    .filter(file => path.extname(file).toLowerCase() === '.json');

  if (candidates.length === 1) {
    return { path: candidates[0], dir: path.dirname(candidates[0]) };
  }
  if (candidates.length > 1) {
    throw new Error('Multiple manifest candidates in v6-motion. Ask Sol for exact manifest filename.');
  }
  throw new Error('Manifest unavailable. Ask Sol for exact V6 manifest filename under v6-motion.');
}

function resolveWithinRoot(base, relative) {
  if (typeof relative !== 'string' || relative.length === 0) {
    throw new Error(`Invalid relative path: ${String(relative)}`);
  }
  const segments = relative.split(/[\\/]/);
  if (segments.includes('..') || path.isAbsolute(relative)) {
    throw new Error(`Unsafe relative frame path: ${relative}`);
  }
  const absolute = path.resolve(base, relative);
  if (!absolute.startsWith(`${base}\\`) && absolute !== base && !absolute.startsWith(`${base}/`)) {
    throw new Error(`Frame path escapes manifest root: ${relative}`);
  }
  return absolute;
}

function resolveSourcePath(manifest, repoRoot, fallbackDir) {
  if (manifest?.assetPins?.source?.path) {
    const candidate = path.isAbsolute(manifest.assetPins.source.path)
      ? manifest.assetPins.source.path
      : path.resolve(repoRoot, manifest.assetPins.source.path);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  if (manifest?.sourceComparison?.file) {
    const candidate = path.resolve(fallbackDir, manifest.sourceComparison.file);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return path.resolve(repoRoot, 'Photos for Codex 2/Patients or Staff or Other Characters/exec-0b03b9bb-45a8-4d1a-a785-7654d39c0478.png');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function fragment(contract) {
  const contractText = JSON.stringify(contract).replaceAll('<', '\\u003c');
  const options = contract.sequences
    .map((sequence, index) => `<option value="${index}">${escapeHtml(sequence.label)}</option>`)
    .join('');

  const defaultSequenceIndex = Math.max(0, contract.sequences.findIndex(sequence => sequence.id === 'walk'));

  return `
<style>
#green-layered-motion-v6{max-width:100%;box-sizing:border-box;color:var(--foreground);background:transparent}
#green-layered-motion-v6 *{box-sizing:border-box}
#green-layered-motion-v6-controls,#green-layered-motion-v6-frame-row{display:flex;gap:.55rem;align-items:center;flex-wrap:wrap}
#green-layered-motion-v6 .green-layered-motion-v6-layout{display:flex;gap:.75rem;align-items:flex-start;flex-wrap:wrap}
#green-layered-motion-v6 .green-layered-motion-v6-pane{display:flex;flex-direction:column;gap:.25rem;align-items:center;min-width:160px}
#green-layered-motion-v6 #green-layered-motion-v6-source,
#green-layered-motion-v6 #green-layered-motion-v6-canvas{max-width:100%;width:160px;height:auto;display:block}
#green-layered-motion-v6 canvas{aspect-ratio:auto}
#green-layered-motion-v6 .green-layered-motion-v6-caption{color:var(--muted-foreground)}
#green-layered-motion-v6 .sr-only{position:absolute!important;height:1px;width:1px;overflow:hidden;clip:rect(1px,1px,1px,1px);white-space:nowrap;border:0;padding:0;margin:-1px}
@media (max-width: 700px){#green-layered-motion-v6 .green-layered-motion-v6-layout{flex-direction:column}}
</style>
<div id="green-layered-motion-v6" data-atlas-ready="false" data-encoding="webp" data-frame-native-width="${contract.canvas.width}" data-frame-native-height="${contract.canvas.height}">
  <h3>Green character · front view</h3>
  <p id="green-layered-motion-v6-status" role="status" aria-live="polite">Loading</p>
  <p id="green-layered-motion-v6-frame-meta" class="sr-only"></p>
  <div class="green-layered-motion-v6-controls viz-controls">
    <label class="form-label">Sequence <select id="green-layered-motion-v6-sequence" class="form-select">${options}</select></label>
    <button id="green-layered-motion-v6-play" class="btn" type="button" aria-pressed="false" disabled>Play</button>
    <label class="form-label">Speed
      <select id="green-layered-motion-v6-speed" class="form-select">
        <option value="0.5">0.5x</option>
        <option value="1" selected>1x</option>
        <option value="1.5">1.5x</option>
      </select>
    </label>
  </div>
  <div id="green-layered-motion-v6-frame-row">
    <label for="green-layered-motion-v6-frame-slider" class="form-label">Frame</label>
    <input id="green-layered-motion-v6-frame-slider" class="form-range" type="range" min="1" max="1" value="1" step="1" />
    <span id="green-layered-motion-v6-frame-count">1 / 1</span>
  </div>
  <div class="green-layered-motion-v6-layout">
    <figure class="green-layered-motion-v6-pane">
      <img id="green-layered-motion-v6-source" alt="Immutable source crop" />
      <figcaption class="green-layered-motion-v6-caption">Original artwork</figcaption>
    </figure>
    <figure class="green-layered-motion-v6-pane">
      <canvas id="green-layered-motion-v6-canvas" width="${contract.canvas.width}" height="${contract.canvas.height}" role="img" aria-label="Motion canvas"></canvas>
      <figcaption class="green-layered-motion-v6-caption">Layered draft</figcaption>
    </figure>
  </div>
</div>
<script>(()=>{const C=${contractText};
const root=document.getElementById('green-layered-motion-v6');
const sequenceSelect=document.getElementById('green-layered-motion-v6-sequence');
const playButton=document.getElementById('green-layered-motion-v6-play');
const speedSelect=document.getElementById('green-layered-motion-v6-speed');
const slider=document.getElementById('green-layered-motion-v6-frame-slider');
const frameCount=document.getElementById('green-layered-motion-v6-frame-count');
const status=document.getElementById('green-layered-motion-v6-status');
const meta=document.getElementById('green-layered-motion-v6-frame-meta');
const source=document.getElementById('green-layered-motion-v6-source');
const canvas=document.getElementById('green-layered-motion-v6-canvas');
const context=canvas.getContext('2d');
const state={
  sequenceIndex:${defaultSequenceIndex >=0 ? defaultSequenceIndex : 0},
  frameIndex:0,
  speed:1,
  playing:false,
  last:null,
  carry:0,
};
root.__greenLayeredMotionV6=C;
const sequences=C.sequences.map(sequence=>({
  ...sequence,
  frames:sequence.frames.map(frame=>Object.assign({loadedImage:null},frame)),
}));
let ready=false;

function setStatus() {
  const seq=sequences[state.sequenceIndex];
  const mode=state.playing?'playing':'paused';
  const now=state.frameIndex+1;
  status.textContent = seq.label + ' · frame ' + now + ' / ' + seq.frames.length + ' · ' + mode;
  frameCount.textContent = now + ' / ' + seq.frames.length;
}

function setFrameMeta() {
  const sequence=sequences[state.sequenceIndex];
  const total = sequence.frames.length;
  meta.textContent = 'Frame ' + (state.frameIndex + 1) + ' / ' + total;
}

async function loadImages(){
  for (const sequence of sequences) {
    for (const frame of sequence.frames) {
      const image=new Image();
      await new Promise((resolve, reject)=>{image.onload=resolve; image.onerror=reject; image.src=frame.src;});
      frame.loadedImage=image;
    }
  }
}

function setSequence(next) {
  const index=Math.max(0,Math.min(sequences.length-1,next|0));
  state.sequenceIndex=index;
  state.frameIndex=0;
  state.playing=false;
  state.last=null;
  state.carry=0;
  const sequence=sequences[state.sequenceIndex];
  slider.max=String(sequence.frames.length);
  slider.value='1';
  render();
}

function setSpeed(next) {
  const value=Number(next);
  state.speed=Number.isFinite(value)?value:1;
  if (state.speed<=0) state.speed=1;
}

function stepFromCurrent() {
  const sequence=sequences[state.sequenceIndex];
  if (state.frameIndex >= sequence.frames.length -1) {
    if (sequence.loop) {
      state.frameIndex=0;
      return;
    }
    state.playing=false;
    state.carry=0;
    return;
  }
  state.frameIndex += 1;
}

function render() {
  const sequence=sequences[state.sequenceIndex];
  const frame=sequence.frames[state.frameIndex];
  if (!frame.loadedImage) return;
  context.clearRect(0,0,canvas.width,canvas.height);
  drawBackdrop(sequence, frame);
  context.drawImage(frame.loadedImage,0,0,canvas.width,canvas.height);
  setSlider();
  setStatus();
  setFrameMeta();
}

function drawBackdrop(sequence, frame) {
  const styles = getComputedStyle(root);
  const mutedColor = styles.getPropertyValue('--muted-foreground').trim() || styles.color;
  const metadata = frame.metadata || {};
  const rig = C.rig || {};
  const floorY = Number.isFinite(metadata.floorY)
    ? metadata.floorY
    : Number.isFinite(C.frameMetadataFallback?.floorY)
      ? C.frameMetadataFallback.floorY
      : Number.isFinite(rig.floorY)
        ? rig.floorY
        : null;
  const seatY = Number.isFinite(metadata.seatY)
    ? metadata.seatY
    : Number.isFinite(C.frameMetadataFallback?.seatY)
      ? C.frameMetadataFallback.seatY
      : Number.isFinite(rig.seated?.seatY)
        ? rig.seated.seatY
        : null;

  context.save();
  context.lineWidth = 1;
  if (mutedColor && Number.isFinite(floorY)) {
    context.strokeStyle = mutedColor;
    context.beginPath();
    context.moveTo(0, floorY + 0.5);
    context.lineTo(canvas.width, floorY + 0.5);
    context.stroke();
  }

  if (mutedColor && sequence.id !== 'walk' && Number.isFinite(floorY) && Number.isFinite(seatY)) {
    const seatLeft = 38;
    const seatWidth = 84;
    const seatHeight = 8;
    const postWidth = 7;
    const seatTop = Math.max(0, Math.min(canvas.height - 1, seatY));
    const floor = Math.max(0, Math.min(canvas.height, floorY));
    const backTop = 100;

    context.strokeStyle = mutedColor;
    context.fillStyle = mutedColor;
    context.lineWidth = 3;
    context.strokeRect(42, backTop, 76, Math.max(1, seatTop - backTop + 1));
    context.fillRect(seatLeft, seatTop - 5, seatWidth, seatHeight);
    context.fillRect(44, seatTop + 3, postWidth, Math.max(0, floor - seatTop - 3));
    context.fillRect(109, seatTop + 3, postWidth, Math.max(0, floor - seatTop - 3));
  }
  context.restore();
}

function setSlider(){
  const sequence=sequences[state.sequenceIndex];
  slider.min='1';
  slider.max=String(sequence.frames.length);
  slider.value=String(state.frameIndex+1);
  slider.disabled=!ready;
}

function tick(now){
  if (!ready) {
    requestAnimationFrame(tick);
    return;
  }
  if (state.playing) {
    if (state.last===null) state.last=now;
    const sequence=sequences[state.sequenceIndex];
    const delay=1000/(sequence.fps*state.speed);
    state.carry += now - state.last;
    while (state.carry >= delay) {
      state.carry -= delay;
      const prior=state.frameIndex;
      stepFromCurrent();
      if (state.frameIndex !== prior) {
        setFrameMeta();
        render();
      }
      if (!state.playing) {
        break;
      }
    }
    if (!state.playing) {
      playButton.textContent='Play';
      playButton.setAttribute('aria-pressed', 'false');
      setStatus();
    }
    state.last=now;
    if (state.playing) {
      requestAnimationFrame(tick);
      return;
    }
  } else {
    state.last=null;
  }
  requestAnimationFrame(tick);
}

playButton.addEventListener('click', () => {
  if (!ready) return;
  const sequence=sequences[state.sequenceIndex];
  state.playing = !state.playing;
  if (state.playing && state.frameIndex >= sequence.frames.length -1 && !sequence.loop) {
    state.frameIndex=0;
  }
  state.last=null;
  state.carry=0;
  playButton.textContent=state.playing ? 'Pause' : 'Play';
  playButton.setAttribute('aria-pressed', String(state.playing));
  setStatus();
  render();
});

sequenceSelect.addEventListener('change', event => {
  if (!ready) return;
  setSequence(Number(event.target.value));
});

speedSelect.addEventListener('change', event => {
  if (!ready) return;
  setSpeed(event.target.value);
});

slider.addEventListener('input', event => {
  if (!ready) return;
  const index=Math.max(1, Math.min(Number(event.target.value || 1), Number(slider.max)))-1;
  state.frameIndex=index;
  state.playing=false;
  state.last=null;
  state.carry=0;
  playButton.textContent='Play';
  playButton.setAttribute('aria-pressed','false');
  render();
});

source.src=C.sourceDataUrl;
source.style.width='160px';
source.style.height='320px';
canvas.style.width='160px';
canvas.style.height='320px';

sequenceSelect.value=String(${defaultSequenceIndex >=0 ? defaultSequenceIndex : 0});
setSequence(${defaultSequenceIndex >=0 ? defaultSequenceIndex : 0});
setSpeed('1');
loadImages().then(() => {
  ready=true;
  root.dataset.atlasReady='true';
  playButton.disabled=false;
  sequenceSelect.disabled=false;
  speedSelect.disabled=false;
  setSequence(${defaultSequenceIndex >=0 ? defaultSequenceIndex : 0});
  render();
  if (slider.max === '1') {
    slider.max=String(sequences[state.sequenceIndex].frames.length);
  }
  requestAnimationFrame(tick);
}).catch(error => {
  status.textContent='Failed to load frames';
  meta.textContent=String(error && error.message || error);
});
})();</script>`;
}
