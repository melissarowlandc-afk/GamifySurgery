import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repositoryRoot = resolve(import.meta.dirname, '../../..');
const profiles = JSON.parse(readFileSync(resolve(import.meta.dirname, 'source-profiles.json'), 'utf8'));
const batch = JSON.parse(readFileSync(resolve(import.meta.dirname, 'characters.json'), 'utf8'));
const requestedSlug = process.argv[2] ?? 'cardigan';
const character = Object.values(batch.characters).find(candidate => candidate.slug === requestedSlug);
if (!character) throw new Error(`unknown batch-02 character slug: ${requestedSlug}`);
const views = profiles.characters[character.runtimeId].views;
const outputRoot = resolve(repositoryRoot, 'artifacts/character-movement/reauthored-batch-02/review');
mkdirSync(outputRoot, { recursive: true });

function removeConnectedNeutralBackground(canvas) {
  const context = canvas.getContext('2d'), image = context.getImageData(0, 0, canvas.width, canvas.height);
  const seen = new Uint8Array(canvas.width * canvas.height), queue = new Uint32Array(seen.length); let read = 0, write = 0;
  const neutral = pixel => { const offset = pixel * 4, values = [image.data[offset], image.data[offset + 1], image.data[offset + 2]]; return Math.min(...values) >= 150 && Math.max(...values) - Math.min(...values) <= 32; };
  const add = pixel => { if (!seen[pixel] && neutral(pixel)) { seen[pixel] = 1; queue[write++] = pixel; } };
  for (let x = 0; x < canvas.width; x += 1) { add(x); add((canvas.height - 1) * canvas.width + x); }
  for (let y = 0; y < canvas.height; y += 1) { add(y * canvas.width); add(y * canvas.width + canvas.width - 1); }
  while (read < write) { const pixel = queue[read++], x = pixel % canvas.width, y = Math.floor(pixel / canvas.width); if (x) add(pixel - 1); if (x + 1 < canvas.width) add(pixel + 1); if (y) add(pixel - canvas.width); if (y + 1 < canvas.height) add(pixel + canvas.width); }
  for (let pixel = 0; pixel < seen.length; pixel += 1) if (seen[pixel]) image.data[pixel * 4 + 3] = 0;
  context.putImageData(image, 0, 0);
}

const directions = ['south', 'east', 'north', 'west'];
const audit = createCanvas(960, 640), auditContext = audit.getContext('2d');
const crownAudit = createCanvas(960, 400), crownAuditContext = crownAudit.getContext('2d');
auditContext.font = 'bold 14px sans-serif';
crownAuditContext.font = 'bold 14px sans-serif';
for (const [column, direction] of directions.entries()) {
  const profile = views[direction], source = await loadImage(resolve(repositoryRoot, profile.identityHead.source.path));
  const crop = profile.identityHead.crop, cropped = createCanvas(crop.width, crop.height), cropContext = cropped.getContext('2d');
  cropContext.drawImage(source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
  removeConnectedNeutralBackground(cropped);
  const masked = createCanvas(crop.width, crop.height), maskedContext = masked.getContext('2d');
  const drawClipped = (targetContext, sourceCanvas, polygon) => { targetContext.save(); targetContext.beginPath(); polygon.forEach(([x, y], index) => index ? targetContext.lineTo(x, y) : targetContext.moveTo(x, y)); targetContext.closePath(); targetContext.clip(); targetContext.drawImage(sourceCanvas, 0, 0); targetContext.restore(); };
  const headLayer = createCanvas(crop.width, crop.height), headContext = headLayer.getContext('2d'); drawClipped(headContext, cropped, profile.identityHead.polygon);
  const headData = headContext.getImageData(0, 0, crop.width, crop.height), visited = new Uint8Array(crop.width * crop.height), components = [];
  for (let start = 0; start < visited.length; start += 1) {
    if (visited[start] || !headData.data[start * 4 + 3]) continue;
    const queue = [start], component = []; visited[start] = 1;
    while (queue.length) {
      const pixel = queue.pop(), x = pixel % crop.width, y = Math.floor(pixel / crop.width); component.push(pixel);
      for (let offsetY = -1; offsetY <= 1; offsetY += 1) for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
        const nextX = x + offsetX, nextY = y + offsetY; if ((!offsetX && !offsetY) || nextX < 0 || nextX >= crop.width || nextY < 0 || nextY >= crop.height) continue;
        const neighbor = nextY * crop.width + nextX; if (!visited[neighbor] && headData.data[neighbor * 4 + 3]) { visited[neighbor] = 1; queue.push(neighbor); }
      }
    }
    components.push(component);
  }
  const allowed = new Uint8Array(visited.length); for (const pixel of components.sort((left, right) => right.length - left.length)[0] ?? []) allowed[pixel] = 1;
  for (let pixel = 0; pixel < allowed.length; pixel += 1) if (!allowed[pixel]) headData.data[pixel * 4 + 3] = 0;
  for (const exclusion of profile.identityHead.pixelExclusions ?? []) {
    for (let y = exclusion.y; y < exclusion.y + exclusion.height; y += 1) for (let x = exclusion.x; x < exclusion.x + exclusion.width; x += 1) headData.data[(y * crop.width + x) * 4 + 3] = 0;
  }
  headContext.putImageData(headData, 0, 0); maskedContext.drawImage(headLayer, 0, 0);
  for (const polygon of profile.identityHead.hairPolygons ?? []) {
    const hairLayer = createCanvas(crop.width, crop.height), hairContext = hairLayer.getContext('2d');
    drawClipped(hairContext, cropped, polygon);
    const data = hairContext.getImageData(0, 0, crop.width, crop.height), keep = new Uint8Array(crop.width * crop.height), selection = profile.identityHead.hairSelection;
    for (let pixel = 0; pixel < keep.length; pixel += 1) {
      const offset = pixel * 4, values = [data.data[offset], data.data[offset + 1], data.data[offset + 2]];
      if (data.data[offset + 3] && values.reduce((sum, value) => sum + value, 0) / 3 >= selection.minimumCoreLuma && Math.max(...values) - Math.min(...values) <= selection.maximumCoreChannelRange && (!selection.requireRedAtLeastBlue || values[0] >= values[2])) keep[pixel] = 1;
    }
    if (selection.largestCoreComponentOnly) {
      const visited = new Uint8Array(keep.length), components = [];
      for (let start = 0; start < keep.length; start += 1) {
        if (!keep[start] || visited[start]) continue;
        const queue = [start], component = []; visited[start] = 1;
        while (queue.length) {
          const pixel = queue.pop(), x = pixel % crop.width, y = Math.floor(pixel / crop.width); component.push(pixel);
          for (const neighbor of [x ? pixel - 1 : -1, x + 1 < crop.width ? pixel + 1 : -1, y ? pixel - crop.width : -1, y + 1 < crop.height ? pixel + crop.width : -1]) if (neighbor >= 0 && keep[neighbor] && !visited[neighbor]) { visited[neighbor] = 1; queue.push(neighbor); }
        }
        components.push(component);
      }
      const largest = components.sort((left, right) => right.length - left.length)[0] ?? [], selected = new Uint8Array(keep.length);
      for (const pixel of largest) selected[pixel] = 1;
      keep.set(selected);
    }
    for (let pass = 0; pass < selection.outlineGrowthPixels; pass += 1) {
      const grown = new Uint8Array(keep);
      for (let pixel = 0; pixel < keep.length; pixel += 1) {
        if (keep[pixel] || !data.data[pixel * 4 + 3]) continue;
        const offset = pixel * 4;
        if (selection.requireRedAtLeastBlue && data.data[offset] < data.data[offset + 2]) continue;
        const x = pixel % crop.width, y = Math.floor(pixel / crop.width);
        if ((x && keep[pixel - 1]) || (x + 1 < crop.width && keep[pixel + 1]) || (y && keep[pixel - crop.width]) || (y + 1 < crop.height && keep[pixel + crop.width])) grown[pixel] = 1;
      }
      keep.set(grown);
    }
    for (let pixel = 0; pixel < keep.length; pixel += 1) if (!keep[pixel]) data.data[pixel * 4 + 3] = 0;
    hairContext.putImageData(data, 0, 0); maskedContext.drawImage(hairLayer, 0, 0);
  }
  for (const [row, background] of ['#f000f0', '#101216'].entries()) {
    const x = column * 240, y = row * 320;
    auditContext.fillStyle = background; auditContext.fillRect(x, y, 240, 310); auditContext.drawImage(masked, x, y);
    auditContext.fillStyle = '#fff'; auditContext.fillText(`${direction} · ${row ? 'dark' : 'magenta'}`, x + 6, y + 18);
  }
  const crownSource = { x: 30, y: 24, width: 120, height: 100 };
  for (const [row, layer] of [cropped, masked].entries()) {
    const x = column * 240, y = row * 200;
    crownAuditContext.fillStyle = row ? '#f000f0' : '#101216';
    crownAuditContext.fillRect(x, y, 240, 200);
    crownAuditContext.imageSmoothingEnabled = false;
    crownAuditContext.drawImage(layer, crownSource.x, crownSource.y, crownSource.width, crownSource.height, x, y, 240, 200);
    crownAuditContext.fillStyle = '#fff';
    crownAuditContext.fillText(`${direction} · ${row ? 'selected' : 'source'}`, x + 6, y + 18);
  }
}
const output = resolve(outputRoot, `${requestedSlug}-head-mask-audit.png`);
writeFileSync(output, audit.toBuffer('image/png'));
if (requestedSlug === 'braid') writeFileSync(resolve(outputRoot, 'braid-head-crown-audit.png'), crownAudit.toBuffer('image/png'));
console.log(output);
