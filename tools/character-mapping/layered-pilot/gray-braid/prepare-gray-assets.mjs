import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../../..');
const assets = resolve(import.meta.dirname, 'assets');
const originalName = 'Photos for Codex 2/Patients or Staff or Other Characters/exec-16c48adf-2478-4b2a-b0e3-9ce1f2bfc2cb.png';
const matteName = 'gray-base-parts-v1-matte.png';
const transparentName = 'gray-base-parts-v1-transparent.png';
const actionMatteName = 'gray-action-parts-v1-matte.png';
const actionTransparentName = 'gray-action-parts-v1-transparent.png';
const seatedTorsoMatteName = 'gray-seated-torsos-v1-matte.png';
const seatedTorsoTransparentName = 'gray-seated-torsos-v1-transparent.png';
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

const views = {
  south: { crop: [50, 20, 240, 310], sourceHipX: 101, head: [[82,35],[124,35],[138,40],[146,52],[147,111],[140,119],[126,124],[82,124],[64,118],[62,58],[69,43]], tail: [[115,103],[143,103],[143,162],[115,162]], exclusions: [] },
  east: { crop: [300, 20, 240, 310], sourceHipX: 107, head: [[84,34],[136,34],[147,41],[153,55],[150,111],[143,120],[130,128],[108,130],[94,125],[88,116],[72,108],[69,65],[76,48]], tail: [[64,100],[94,100],[94,195],[64,195]], shoulderPatch: [89,138,23], exclusions: [] },
  west: { crop: [550, 20, 240, 310], sourceHipX: 82, head: [[54,34],[101,34],[114,40],[121,54],[120,113],[113,121],[104,129],[83,132],[63,127],[54,120],[40,111],[38,62],[45,46]], tail: [[96,100],[124,100],[124,195],[96,195]], shoulderPatch: [100,135,23], exclusions: [] },
  north: { crop: [800, 20, 240, 310], sourceHipX: 73, head: [[51,34],[94,34],[108,40],[115,52],[115,112],[108,121],[96,128],[49,128],[38,121],[31,113],[29,60],[38,44]], tail: [[63,103],[91,103],[91,211],[63,211]], exclusions: [] },
};

function isMatte(data, index) {
  const r = data[index], g = data[index + 1], b = data[index + 2];
  return r >= 145 && b >= 135 && g <= 125 && r + b - g * 2 >= 190 && Math.abs(r - b) <= 100;
}

function isMagentaFringe(data, index) {
  const r = data[index], g = data[index + 1], b = data[index + 2];
  return r >= 40 && b >= 40 && g <= 80 && r + b - g * 2 >= 80
    && r > g * 1.5 && b > g * 1.5 && Math.abs(r - b) <= 30;
}

function clearExteriorMatte(canvas) {
  const context = canvas.getContext('2d');
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  const count = canvas.width * canvas.height;
  const exterior = new Uint8Array(count), queue = new Uint32Array(count);
  let read = 0, write = 0;
  const add = (x, y) => {
    const pixel = y * canvas.width + x;
    if (exterior[pixel] || !isMatte(pixels.data, pixel * 4)) return;
    exterior[pixel] = 1; queue[write++] = pixel;
  };
  for (let x = 0; x < canvas.width; x += 1) { add(x, 0); add(x, canvas.height - 1); }
  for (let y = 1; y < canvas.height - 1; y += 1) { add(0, y); add(canvas.width - 1, y); }
  while (read < write) {
    const pixel = queue[read++], x = pixel % canvas.width, y = Math.floor(pixel / canvas.width);
    for (let oy = -1; oy <= 1; oy += 1) for (let ox = -1; ox <= 1; ox += 1) {
      if (!ox && !oy) continue;
      const nx = x + ox, ny = y + oy;
      if (nx >= 0 && nx < canvas.width && ny >= 0 && ny < canvas.height) add(nx, ny);
    }
  }
  let removed = 0;
  for (let pixel = 0; pixel < count; pixel += 1) {
    const index = pixel * 4;
    if (!exterior[pixel] && !isMatte(pixels.data, index) && !isMagentaFringe(pixels.data, index)) continue;
    pixels.data[index] = pixels.data[index + 1] = pixels.data[index + 2] = pixels.data[index + 3] = 0;
    removed += 1;
  }
  context.putImageData(pixels, 0, 0);
  return removed;
}

function removeConnectedNeutralBackground(canvas) {
  const context = canvas.getContext('2d'), pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  const seen = new Uint8Array(canvas.width * canvas.height), queue = new Uint32Array(seen.length);
  let read = 0, write = 0;
  const neutral = pixel => {
    const i = pixel * 4, values = [pixels.data[i], pixels.data[i + 1], pixels.data[i + 2]];
    return Math.min(...values) >= 220 && Math.max(...values) - Math.min(...values) <= 8;
  };
  const add = pixel => { if (!seen[pixel] && neutral(pixel)) { seen[pixel] = 1; queue[write++] = pixel; } };
  for (let x = 0; x < canvas.width; x += 1) { add(x); add((canvas.height - 1) * canvas.width + x); }
  for (let y = 0; y < canvas.height; y += 1) { add(y * canvas.width); add(y * canvas.width + canvas.width - 1); }
  while (read < write) {
    const pixel = queue[read++], x = pixel % canvas.width, y = Math.floor(pixel / canvas.width);
    if (x) add(pixel - 1); if (x + 1 < canvas.width) add(pixel + 1);
    if (y) add(pixel - canvas.width); if (y + 1 < canvas.height) add(pixel + canvas.width);
  }
  for (let pixel = 0; pixel < seen.length; pixel += 1) if (seen[pixel]) {
    const i = pixel * 4; pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = pixels.data[i + 3] = 0;
  }
  context.putImageData(pixels, 0, 0);
}

function polygonClip(source, polygon) {
  const canvas = createCanvas(source.width, source.height), context = canvas.getContext('2d');
  context.beginPath(); polygon.forEach(([x, y], i) => i ? context.lineTo(x, y) : context.moveTo(x, y));
  context.closePath(); context.clip(); context.drawImage(source, 0, 0);
  return canvas;
}

function circleClip(source, [x,y,radius]) {
  const canvas=createCanvas(source.width,source.height),context=canvas.getContext('2d');context.beginPath();context.arc(x,y,radius,0,Math.PI*2);context.clip();context.drawImage(source,0,0);return canvas;
}

function components(data, width, rect, threshold = 0) {
  const [rx, ry, rw, rh] = rect, visited = new Uint8Array(width * Math.ceil(data.length / 4 / width)), result = [];
  for (let y = ry; y < ry + rh; y += 1) for (let x = rx; x < rx + rw; x += 1) {
    const start = y * width + x;
    if (visited[start] || data[start * 4 + 3] <= threshold) continue;
    const queue = [start], pixels = []; visited[start] = 1;
    let left = x, right = x, top = y, bottom = y;
    while (queue.length) {
      const pixel = queue.pop(), px = pixel % width, py = Math.floor(pixel / width); pixels.push(pixel);
      left = Math.min(left, px); right = Math.max(right, px); top = Math.min(top, py); bottom = Math.max(bottom, py);
      for (let oy = -1; oy <= 1; oy += 1) for (let ox = -1; ox <= 1; ox += 1) {
        if (!ox && !oy) continue;
        const nx = px + ox, ny = py + oy;
        if (nx < rx || nx >= rx + rw || ny < ry || ny >= ry + rh) continue;
        const next = ny * width + nx;
        if (!visited[next] && data[next * 4 + 3] > threshold) { visited[next] = 1; queue.push(next); }
      }
    }
    result.push({ pixels, bounds: { x: left, y: top, width: right - left + 1, height: bottom - top + 1 } });
  }
  return result.sort((a, b) => b.pixels.length - a.pixels.length);
}

function retainLargest(canvas) {
  const context = canvas.getContext('2d'), image = context.getImageData(0, 0, canvas.width, canvas.height);
  const largest = components(image.data, canvas.width, [0, 0, canvas.width, canvas.height])[0];
  const keep = new Uint8Array(canvas.width * canvas.height); for (const pixel of largest?.pixels ?? []) keep[pixel] = 1;
  for (let pixel = 0; pixel < keep.length; pixel += 1) if (!keep[pixel]) image.data[pixel * 4 + 3] = 0;
  context.putImageData(image, 0, 0);
}

function extractTail(source, polygon) {
  const canvas = polygonClip(source, polygon), context = canvas.getContext('2d');
  const image = context.getImageData(0, 0, canvas.width, canvas.height), keep = new Uint8Array(canvas.width * canvas.height);
  for (let pixel = 0; pixel < keep.length; pixel += 1) {
    const i = pixel * 4, rgb = [image.data[i], image.data[i + 1], image.data[i + 2]];
    if (image.data[i + 3] && (rgb[0] + rgb[1] + rgb[2]) / 3 >= 80 && Math.max(...rgb) - Math.min(...rgb) <= 35 && rgb[0] >= rgb[2]) keep[pixel] = 1;
  }
  for (let pass = 0; pass < 3; pass += 1) {
    const grown = new Uint8Array(keep);
    for (let pixel = 0; pixel < keep.length; pixel += 1) {
      if (keep[pixel] || !image.data[pixel * 4 + 3]) continue;
      const i = pixel * 4; if (image.data[i] < image.data[i + 2]) continue;
      const x = pixel % canvas.width, y = Math.floor(pixel / canvas.width);
      if ((x && keep[pixel - 1]) || (x + 1 < canvas.width && keep[pixel + 1]) || (y && keep[pixel - canvas.width]) || (y + 1 < canvas.height && keep[pixel + canvas.width])) grown[pixel] = 1;
    }
    keep.set(grown);
  }
  for (let pixel = 0; pixel < keep.length; pixel += 1) if (!keep[pixel]) image.data[pixel * 4 + 3] = 0;
  context.putImageData(image, 0, 0); return canvas;
}

function alphaBounds(canvas) {
  const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
  const found = components(data, canvas.width, [0, 0, canvas.width, canvas.height]);
  if (!found.length) throw new Error('empty extracted layer');
  let left = canvas.width, top = canvas.height, right = -1, bottom = -1;
  for (const component of found) { const b = component.bounds; left = Math.min(left, b.x); top = Math.min(top, b.y); right = Math.max(right, b.x + b.width - 1); bottom = Math.max(bottom, b.y + b.height - 1); }
  return { x: left, y: top, width: right - left + 1, height: bottom - top + 1 };
}

const mattePath = resolve(assets, matteName), matteBytes = readFileSync(mattePath), matte = await loadImage(mattePath);
const plate = createCanvas(matte.width, matte.height), plateContext = plate.getContext('2d'); plateContext.drawImage(matte, 0, 0);
const removed = clearExteriorMatte(plate), transparentBytes = plate.toBuffer('image/png');
writeFileSync(resolve(assets, transparentName), transparentBytes);
const plateData = plateContext.getImageData(0, 0, plate.width, plate.height).data;
const columns = { south: [0, 0, 314, 1254], east: [314, 0, 313, 1254], west: [627, 0, 314, 1254], north: [941, 0, 313, 1254] };
const rows = { torso: [0, 45, 1254, 345], sleeves: [0, 410, 1254, 255], hands: [0, 680, 1254, 145], legs: [0, 830, 1254, 380] };
const parts = {};
for (const [view, column] of Object.entries(columns)) {
  parts[view] = {};
  for (const [role, row] of Object.entries(rows)) {
    const rect = [column[0], row[1], column[2], row[3]];
    const found = components(plateData, plate.width, rect, 8).filter(item => item.pixels.length > 100);
    if (role === 'torso') {
      if (found.length !== 1) throw new Error(`${view} torso components ${found.length}`);
      parts[view].torso = found[0].bounds;
    } else {
      if (found.length !== 2) throw new Error(`${view} ${role} components ${found.length}`);
      const ordered = found.sort((a, b) => a.bounds.x - b.bounds.x);
      parts[view][role] = { left: ordered[0].bounds, right: ordered[1].bounds };
    }
  }
}

const actionMattePath=resolve(assets,actionMatteName),actionMatteBytes=readFileSync(actionMattePath),actionImage=await loadImage(actionMattePath);
const actionPlate=createCanvas(actionImage.width,actionImage.height),actionContext=actionPlate.getContext('2d');actionContext.drawImage(actionImage,0,0);
const actionRemoved=clearExteriorMatte(actionPlate),actionBytes=actionPlate.toBuffer('image/png');writeFileSync(resolve(assets,actionTransparentName),actionBytes);
const actionData=actionContext.getImageData(0,0,actionPlate.width,actionPlate.height).data;
const actionColumns={south:[0,290],east:[290,290],west:[580,289],north:[869,290],clipboard:[1159,289]},actionRows={lowerBody:[50,310],leftArm:[370,275],rightArm:[690,275]},actionParts={sitting:{},clipboard:{}};
for(const view of ['south','east','west','north']){actionParts.sitting[view]={};for(const[role,[y,height]]of Object.entries(actionRows)){const[x,width]=actionColumns[view],found=components(actionData,actionPlate.width,[x,y,width,height],8).filter(item=>item.pixels.length>100);if(found.length!==1)throw new Error(`${view} action ${role} components ${found.length}`);actionParts.sitting[view][role]=found[0].bounds;}}
for(const role of ['leftArm','rightArm']){const[x,width]=actionColumns.clipboard,[y,height]=actionRows[role],found=components(actionData,actionPlate.width,[x,y,width,height],8).filter(item=>item.pixels.length>100);if(found.length!==1)throw new Error(`clipboard ${role} components ${found.length}`);actionParts.clipboard[role]=found[0].bounds;}

const seatedTorsoMattePath=resolve(assets,seatedTorsoMatteName),seatedTorsoMatteBytes=readFileSync(seatedTorsoMattePath),seatedTorsoImage=await loadImage(seatedTorsoMattePath);
const seatedTorsoPlate=createCanvas(seatedTorsoImage.width,seatedTorsoImage.height),seatedTorsoContext=seatedTorsoPlate.getContext('2d');seatedTorsoContext.drawImage(seatedTorsoImage,0,0);
const seatedTorsoRemoved=clearExteriorMatte(seatedTorsoPlate),seatedTorsoBytes=seatedTorsoPlate.toBuffer('image/png');writeFileSync(resolve(assets,seatedTorsoTransparentName),seatedTorsoBytes);
const seatedTorsoData=seatedTorsoContext.getImageData(0,0,seatedTorsoPlate.width,seatedTorsoPlate.height).data,seatedTorsoParts={};
for(const[view,[x,,width]]of Object.entries(columns)){const found=components(seatedTorsoData,seatedTorsoPlate.width,[x,390,width,430],8).filter(item=>item.pixels.length>100);if(found.length!==1)throw new Error(`${view} seated torso components ${found.length}`);seatedTorsoParts[view]=found[0].bounds;}

const originalPath = resolve(repo, originalName), originalBytes = readFileSync(originalPath), original = await loadImage(originalPath);
const identity = {};
for (const [view, config] of Object.entries(views)) {
  const crop = createCanvas(240, 310), cropContext = crop.getContext('2d'); cropContext.drawImage(original, ...config.crop, 0, 0, 240, 310);
  removeConnectedNeutralBackground(crop);
  const head = polygonClip(crop, config.head); retainLargest(head);
  const headContext = head.getContext('2d'), headPixels = headContext.getImageData(0, 0, head.width, head.height);
  for (const [x, y, width, height] of config.exclusions) for (let py = y; py < y + height; py += 1) for (let px = x; px < x + width; px += 1) headPixels.data[(py * head.width + px) * 4 + 3] = 0;
  headContext.putImageData(headPixels, 0, 0);
  const tail = extractTail(crop, config.tail);
  const shoulderPatch=config.shoulderPatch?circleClip(crop,config.shoulderPatch):null;
  const headName = `gray-${view}-face-crown-v1.png`, tailName = `gray-${view}-braid-tail-v1.png`,shoulderName=`gray-${view}-shoulder-patch-v1.png`;
  const headBytes = head.toBuffer('image/png'), tailBytes = tail.toBuffer('image/png');
  writeFileSync(resolve(assets, headName), headBytes); writeFileSync(resolve(assets, tailName), tailBytes);
  const shoulderBytes=shoulderPatch?.toBuffer('image/png');if(shoulderBytes)writeFileSync(resolve(assets,shoulderName),shoulderBytes);
  identity[view] = {
    crop: config.crop, sourceHipX: config.sourceHipX,
    faceCrown: { file: headName, sha256: sha256(headBytes), bounds: alphaBounds(head), polygon: config.head, exclusions: config.exclusions },
    braidTail: { file: tailName, sha256: sha256(tailBytes), bounds: alphaBounds(tail), polygon: config.tail },
    ...(shoulderBytes?{shoulderPatch:{file:shoulderName,sha256:sha256(shoulderBytes),bounds:alphaBounds(shoulderPatch),circle:config.shoulderPatch}}:{}),
  };
}

const provenance = {
  schemaVersion: 1,
  original: { path: originalName, sha256: sha256(originalBytes), dimensions: [original.width, original.height] },
  baseAtlas: { source: { file: matteName, sha256: sha256(matteBytes) }, output: { file: transparentName, sha256: sha256(transparentBytes) }, dimensions: [matte.width, matte.height], removedMattePixels: removed, retainedRgbPolicy: 'all non-matte source RGB unchanged', parts },
  actionAtlas: { source: { file: actionMatteName, sha256: sha256(actionMatteBytes) }, output: { file: actionTransparentName, sha256: sha256(actionBytes) }, dimensions: [actionImage.width, actionImage.height], removedMattePixels: actionRemoved, retainedRgbPolicy: 'all non-matte source RGB unchanged', parts: actionParts },
  seatedTorsoAtlas: { source: { file: seatedTorsoMatteName, sha256: sha256(seatedTorsoMatteBytes) }, output: { file: seatedTorsoTransparentName, sha256: sha256(seatedTorsoBytes) }, dimensions: [seatedTorsoImage.width, seatedTorsoImage.height], removedMattePixels: seatedTorsoRemoved, retainedRgbPolicy: 'all non-matte source RGB unchanged', parts: seatedTorsoParts },
  identity,
};
const provenanceBytes = Buffer.from(`${JSON.stringify(provenance, null, 2)}\n`);
writeFileSync(resolve(assets, 'gray-assets-v1-provenance.json'), provenanceBytes);
console.log(JSON.stringify({ provenanceSha256: sha256(provenanceBytes), removed, actionRemoved, seatedTorsoRemoved, parts, actionParts, seatedTorsoParts, identity: Object.fromEntries(Object.entries(identity).map(([view, value]) => [view, { face: value.faceCrown.bounds, tail: value.braidTail.bounds }])) }, null, 2));
