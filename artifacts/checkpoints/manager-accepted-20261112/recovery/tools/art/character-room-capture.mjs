/** Manager-run real Phaser captures. No server is started and no saves loaded.
 * node tools/art/character-room-capture.mjs --channel chrome
 * --rooms room.xray,room.ultrasound,room.phlebotomy for a smaller first pass.
 * node tools/art/character-room-capture.mjs --verify (offline artifacts only)
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeRgbaPng } from '../character-mapping/staff-gapfill-v6d/rgba-png.mjs';
const root = fileURLToPath(new URL('../../', import.meta.url));
const out = resolve(root, '.local-dev/character-proportions-20261102/occupied-rooms/captures');
const args = process.argv.slice(2), option = (key, fallback) => args.includes(key) ? args[args.indexOf(key) + 1] : fallback;
const url = new URL(option('--url', 'http://127.0.0.1:4173/character-rooms.html'));
if (url.hostname !== '127.0.0.1' || url.protocol !== 'http:' || url.pathname !== '/character-rooms.html') throw new Error('Use the loopback development character-rooms.html entry');
const roomFilter = option('--rooms', '')?.split(',').filter(Boolean);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const reportFile = resolve(out, 'capture-report.json');
const baseProfiles = JSON.parse(await readFile(resolve(root, 'apps/player/src/art/characterProportions.generated.json'), 'utf8'));
const seated = JSON.parse(await readFile(resolve(root, 'apps/player/src/art/characterRoomProportions.generated.json'), 'utf8'));
function assertFigures(capture, before) {
  if (!capture.figures.some(f => f.key === 'character:founder')) throw new Error('Live founder reference is missing');
  const exceptions = [];
  for (const figure of capture.figures) {
    const profile = baseProfiles.identities[figure.stillId];
    if (!profile) throw new Error('Unaudited live identity: ' + figure.stillId);
    if (profile.group === 'nonhuman') continue;
    const sitting = figure.pose === 'seated' || figure.pose === 'exam-table';
    const seat = seated.identities[figure.stillId];
    if (sitting && seat.status.startsWith('regeneration-required')) { exceptions.push({ stillId: figure.stillId, reason: seat.status }); continue; }
    if (before && sitting) continue;
    const reference = (sitting ? seated.reference.seatedHeight : baseProfiles.reference.renderedHeight) * capture.stage.tileSize / 52;
    const [lo, hi] = baseProfiles.reference.groups[profile.group].band;
    if (figure.figureHeight < reference * lo - 1e-5 || figure.figureHeight > reference * hi + 1e-5) throw new Error(`Live scale out of band: ${figure.stillId} ${figure.pose} ${figure.figureHeight}/${reference}`);
  }
  return exceptions;
}
async function fingerprints(paths) {
  return Promise.all([...new Set(paths)].sort().map(async path => {
    if (path.includes('..') || path.includes('\\') || !/^(apps\/player\/|tools\/art\/)/.test(path)) throw new Error('Invalid source path');
    return { path, sha256: hash(await readFile(resolve(root, path))) };
  }));
}
async function rendererSources(folder) {
  const paths = [];
  for (const item of await readdir(resolve(root, folder), { withFileTypes: true })) {
    const path = `${folder}/${item.name}`;
    if (item.isDirectory()) paths.push(...await rendererSources(path));
    else if (/\.(ts|tsx|mjs|json)$/.test(item.name) && !/\.test\./.test(item.name)) paths.push(path);
  }
  return paths;
}
if (args.includes('--verify')) {
  const report = JSON.parse(await readFile(reportFile, 'utf8'));
  if (!report.complete) throw new Error('Capture report is incomplete');
  if (report.expected !== report.cases.length * 6 || report.captures.length !== report.expected ||
      new Set(report.captures.map(item => item.file)).size !== report.expected) throw new Error('Capture set is incomplete or duplicated');
  for (const item of report.captures) {
    const bytes = await readFile(resolve(out, item.file)); const image = decodeRgbaPng(bytes);
    if (hash(bytes) !== item.sha256 || image.width !== item.stage.width || image.height !== item.stage.height) throw new Error('Capture PNG changed: ' + item.file);
    assertFigures(item, item.before);
  }
  if (JSON.stringify(report.sources) !== JSON.stringify(await fingerprints(report.sources.map(s => s.path)))) throw new Error('Renderer/art changed since capture');
  console.log(`PASS: ${report.captures.length} real-scene PNGs; source hashes and live-actor bands current; explicit regeneration exceptions retained.`);
} else {
  await mkdir(out, { recursive: true });
  await writeFile(reportFile, JSON.stringify({ complete: false, startedAt: new Date().toISOString(), message: 'Capture started; previous files are not evidence of this run until completion.' }, null, 2) + '\n');
  const { chromium } = await import('@playwright/test');
  const browser = await chromium.launch({ headless: true, ...(option('--channel', '') ? { channel: option('--channel') } : {}) });
  const captures = [], failures = [], errors = [];
  try {
    const context = await browser.newContext({ viewport: { width: 1200, height: 1100 }, deviceScaleFactor: 1, reducedMotion: 'reduce', serviceWorkers: 'block' });
    await context.route('**/*', route => new URL(route.request().url()).origin === url.origin ? route.continue() : route.abort());
    const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message));
    await page.goto(url.href, { waitUntil: 'load', timeout: 120000 });
    await page.waitForFunction(() => window.__characterRoomsQa?.ready || window.__characterRoomsQa?.error, undefined, { timeout: 120000 });
    const metadata = await page.evaluate(() => { const qa = window.__characterRoomsQa; if (qa.error) throw new Error(qa.error); return { cases: qa.cases, origin: qa.origin, assets: qa.sourceAssets }; });
    if (metadata.origin !== url.origin) throw new Error('Unexpected capture origin');
    const cases = metadata.cases.filter(c => !roomFilter.length || roomFilter.includes(c.room));
    if (!cases.length) throw new Error('No matching room cases');
    const sourcePaths = [...metadata.assets.map(path => 'apps/player/public/' + path), ...await rendererSources('apps/player/src/art'), ...await rendererSources('apps/player/src/facility'), 'apps/player/character-rooms.html', 'tools/art/character-room-capture.mjs'];
    const sources = await fingerprints(sourcePaths);
    for (const job of cases) for (const zoom of [.7, 1, 1.6]) for (const before of [true, false]) {
      const file = `${job.id}-${Math.round(zoom * 100)}-${before ? 'before' : 'after'}.png`;
      try {
        const capture = await page.evaluate(({ id, zoom, before }) => window.__characterRoomsQa.capture(id, zoom, before), { id: job.id, zoom, before });
        const exceptions = assertFigures(capture, before);
        if (!capture.dataUrl.startsWith('data:image/png;base64,')) throw new Error('Capture did not return a PNG');
        const bytes = Buffer.from(capture.dataUrl.split(',')[1], 'base64'); const png = decodeRgbaPng(bytes);
        if (png.width !== capture.stage.width || png.height !== capture.stage.height) throw new Error('Canvas dimensions differ from world-stage geometry');
        await writeFile(resolve(out, file), bytes);
        const { dataUrl, ...geometry } = capture;
        captures.push({ file, case: job.id, zoom, before, ...geometry, exceptions, sha256: hash(bytes) }); console.log('OK ' + file);
      } catch (error) { failures.push({ file, message: String(error) }); console.error('FAIL ' + file + ': ' + error); }
    }
    if (JSON.stringify(sources) !== JSON.stringify(await fingerprints(sourcePaths))) errors.push('Source inputs changed during capture');
    const report = { complete: !failures.length && !errors.length, expected: cases.length * 6, origin: metadata.origin, browserVersion: browser.version(), cases, sources, captures, failures, errors };
    await writeFile(reportFile, JSON.stringify(report, null, 2) + '\n');
    const pairs = cases.flatMap(job => [.7, 1, 1.6].map(zoom => { const prefix = `${job.id}-${Math.round(zoom * 100)}`; return `<h3>${job.id} ${zoom * 100}%</h3><div><img src="${prefix}-before.png"><img src="${prefix}-after.png"></div>`; })).join('\n');
    await writeFile(resolve(out, 'index.html'), `<!doctype html><meta charset="utf-8"><title>Real occupied-room before/after</title><style>body{font:14px system-ui;background:#eee9da}div{display:flex;gap:12px;align-items:flex-start}img{image-rendering:auto;max-width:none}</style><h1>Actual FacilityScene: before / after</h1><p>Complete: ${report.complete}; ${captures.length}/${report.expected} captures. Founder at right uses the same world scale. Flagged regeneration cases remain uncorrected.</p>${pairs}`);
    if (!report.complete) process.exitCode = 1;
    console.log(`${report.complete ? 'PASS' : 'FAIL'}: ${captures.length}/${report.expected}; report ${reportFile}`);
  } finally { await browser.close(); }
}
