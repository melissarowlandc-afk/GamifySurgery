// Real minified scene/cache with deterministic browser I/O replay. This measures
// scheduling, not WebKit network/raster/DOM time. The asset byte/dimension inputs
// are read from the actual public PNGs; no private save is involved.
import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { EventEmitter } from 'node:events';
import { createHash } from 'node:crypto';
import { deserializeGameState } from '@gamify-surgery/game-domain';
import { createPrototypePlayerView } from '../../apps/player/src/session/viewModels';
import { headlessFacilityScene } from '../../apps/player/src/facility/retainedCameraTestSupport';
import { mobileBitmapCache, mobileRoomAssets, selectFacilityAssets } from '../../apps/player/src/mobile/performance/roomAssets';
import { textureLedger } from './phone-art-test-textures';

// Keep replay-only classification local; preserve the release character lane.
const isCharacterTextureKey = (key: string): boolean =>
  key.startsWith("stitchin-time-art:character-still:") || key.startsWith("stitchin-time-art:character:");

const phase = process.env.PHONE_ART_PHASE ?? 'after', level = Number(process.env.PHONE_ART_LEVEL ?? 5);
if (![4, 5].includes(level)) throw Error('PHONE_ART_LEVEL must be4 or5');
const originalGlobals = Object.fromEntries(['setTimeout', 'clearTimeout', 'performance', 'document', 'window', 'Image'].map(key => [key, (globalThis as any)[key]]));
const fixture = JSON.parse(readFileSync('tests/fixtures/level-five-integration-checkpoints-20261012.json', 'utf8'))[level === 4 ? 'integration-l4' : 'integration-build'];
const state = deserializeGameState(JSON.stringify(fixture)); state.paused = true; state.openChartEncounterId = null;
const stateHash = createHash('sha256').update(JSON.stringify(state)).digest('hex');
const model = createPrototypePlayerView(state, null, false, null).facility;
model.camera = { zoom: 1.2, panX: 0, panY: 0 };
let now = 0, sequence = 0;
const timers = new Map<number, { at: number; run(): void }>();
const later = (run: () => void, ms = 0) => { const id = ++sequence; timers.set(id, { at: now + ms, run }); return id; };
Object.assign(globalThis, { setTimeout: later, clearTimeout: (id: number) => timers.delete(id), performance: { now: () => now } });
const context: any = { drawImage() {}, clearRect() {}, fillRect() {}, createRadialGradient() { return { addColorStop() {} }; },
  getImageData(_x: number, _y: number, w: number, h: number) { return { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) }; }, putImageData() {} };
const storage = new Map([['gamify-surgery.phone-memory.v1', JSON.stringify({ version: 1, active: null, restarts: [], safeUntil: Date.now() + 3600000 })]]);
Object.assign(globalThis, { document: Object.assign(new EventTarget(), { visibilityState: 'visible', createElement: () => ({ width: 0, height: 0, getContext: () => context }) }),
  window: Object.assign(new EventTarget(), { innerWidth: 390, location: { search: '?layout=phone' }, matchMedia: () => ({ matches: true }),
    localStorage: { getItem: (key: string) => storage.get(key) ?? null, setItem: (k: string, v: string) => storage.set(k, v) } }) });
const f = headlessFacilityScene(model, true, true);
// The geometry test adapter intentionally ignores constructor texture args.
// Bind them here so differential image records reflect real Phaser creation.
const image = f.scene.add.image;
f.scene.add.image = (x: number, y: number, key: string) => image(x, y).setTexture(key);
const tileSprite = f.scene.add.tileSprite;
f.scene.add.tileSprite = (x: number, y: number, width: number, height: number, key: string) => tileSprite(x, y, width, height).setTexture(key);
const ledger = textureLedger([]), added: { key: string; at: number }[] = [], requests: { path: string; at: number }[] = [];
const nativeAdd = ledger.manager.addImage;
ledger.manager.addImage = (key: string, image: any) => {
  added.push({ key, at: now }); const texture = nativeAdd(key, image);
  if (isCharacterTextureKey(key) && !key.includes('inspector')) f.scene.mobileCharacterTextures.register(key, image.width, image.height);
  return texture;
};
f.scene.textures = ledger.manager;
const metadata = new Map<string, { width: number; height: number; bytes: number }>();
function data(url: string) {
  const path = url.slice(url.indexOf('art/')); let value = metadata.get(path);
  if (!value) {
    const bytes = readFileSync('apps/player/public/' + path); let width: number, height: number;
    if (bytes.subarray(0, 8).toString('hex') === '89504e470d0a1a0a') { width = bytes.readUInt32BE(16); height = bytes.readUInt32BE(20); }
    else if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') {
      const kind = bytes.toString('ascii', 12, 16);
      if (kind === 'VP8X') { width = bytes.readUIntLE(24, 3) + 1; height = bytes.readUIntLE(27, 3) + 1; }
      else if (kind === 'VP8L') { const bits = bytes.readUInt32LE(21); width = (bits & 0x3fff) + 1; height = ((bits >>> 14) & 0x3fff) + 1; }
      else if (kind === 'VP8 ') { width = bytes.readUInt16LE(26) & 0x3fff; height = bytes.readUInt16LE(28) & 0x3fff; }
      else throw Error('Unsupported WebP header:' + path);
    } else throw Error('Expected a public PNG/WebP:' + path);
    value = { width, height, bytes: statSync('apps/player/public/' + path).size }; metadata.set(path, value);
  }
  return { path, ...value };
}
class ReplayImage {
  onload: (() => void) | null = null; onerror: (() => void) | null = null;
  naturalWidth = 0; naturalHeight = 0; width = 0; height = 0; complete = false; decoding = 'async';
  private task?: number;
  set src(url: string) {
    if (this.task) timers.delete(this.task); if (!url) return;
    const info = data(url); requests.push({ path: info.path, at: now });
    this.width = this.naturalWidth = info.width; this.height = this.naturalHeight = info.height;
    // Fixed reproducible replay: 80ms per request, 20MB/s encoded throughput
    // per active request; decode at100MP/s. Report these assumptions explicitly.
    this.task = later(() => { this.complete = true; this.onload?.(); }, 80 + info.bytes / 20_000);
  }
  decode() { return new Promise<void>(resolve => later(resolve, this.width * this.height / 100_000)); }
}
Object.assign(globalThis, { Image: ReplayImage });
class Loader extends EventEmitter {
  loading = false; list = new Map<string, string>(); inFlight = 0;
  image(key: string, url: string) { this.list.set(key, url); if (this.loading) this.pump(); }
  isLoading() { return this.loading; }
  start() { if (this.loading) return; this.loading = true; this.pump(); }
  pump() {
    while (this.inFlight < 4 && this.list.size) {
      const [key, url] = this.list.entries().next().value!; this.list.delete(key); this.inFlight++;
      const image = new ReplayImage(); image.onload = () => { ledger.manager.addImage(key, image); this.inFlight--; this.pump(); }; image.src = url;
    }
    if (this.loading && !this.inFlight && !this.list.size) { this.loading = false; this.emit('complete'); }
  }
}
const loader = new Loader(); f.scene.load = loader;
(f.bridge as typeof f.bridge & { mobileFacilityLevel: number }).mobileFacilityLevel = level;
f.bridge.onCameraChange = (camera: any) => { f.bridge.viewModel = { ...f.bridge.viewModel, camera }; };
f.scene.ensureMobileAtlases(); f.scene.applyCamera(model.camera);
const required = selectFacilityAssets({ mobile: true, facilityLevel: level, builtRoomIds: model.rooms.map(r => r.definitionId) });
const visible = model.rooms.filter(r => {
  const a = f.scene.layout; const x = a.originX + r.tileX * a.tileSize, y = a.originY + r.tileY * a.tileSize;
  return x < 390 && x + r.width * a.tileSize > 0 && y - a.tileSize * 2 < 700 && y + r.height * a.tileSize > 0;
});
let firstRoom: number | null = null, firstVisibleCharacter: number | null = null, visibleReady: number | null = null, settled: number | null = null, predicate: number | null = null;
let peakPending = 0, maxDecodes = 0, at15: any, panDraws = 0;
function roomReady(r: any) { return mobileRoomAssets(r.definitionId).every(a => ledger.manager.exists('stitchin-time-art:' + a.id)); }
for (let frame = 0; frame < 930; frame++) {
  const target = frame * 33.333;
  for (let n = 0; n < 5000; n++) {
    const next = [...timers].filter(([, t]) => t.at <= target).sort((a, b) => a[1].at - b[1].at || a[0] - b[0])[0];
    if (!next) break; timers.delete(next[0]); now = next[1].at; f.scene.time.now = now; next[1].run();
    for (let i = 0; i < 8; i++) await Promise.resolve();
  }
  now = target; f.scene.time.now = now; f.scene.update(now, 33.333);
  for (let i = 0; i < 8; i++) await Promise.resolve();
  peakPending = Math.max(peakPending, f.scene.pendingCharacterStills.size); maxDecodes = Math.max(maxDecodes, mobileBitmapCache.health.activeDecodes);
  if (firstVisibleCharacter === null && [...f.scene.characterBitmapContainers.values()].some((container: any) => {
    const point = f.scene.worldToScreen(container), actor = container.getByName('actor');
    return actor && actor.visible && point.x >= 0 && point.x < 390 && point.y >= 0 && point.y < 700;
  })) firstVisibleCharacter = now;
  if (firstRoom === null && visible.some(r => r.definitionId !== 'room.hallway' && roomReady(r))) firstRoom = now;
  if (visibleReady === null && visible.every(roomReady)) visibleReady = now;
  if (predicate === null && !loader.isLoading() && f.scene.pendingCharacterStills.size === 0 && !f.scene.crispZoomPending) predicate = now;
  if (settled === null && required.every(a => ledger.manager.exists('stitchin-time-art:' + a.id)) && !mobileBitmapCache.health.pending && !loader.isLoading() && f.scene.pendingCharacterStills.size === 0 && !f.scene.crispZoomPending && !f.scene.mobileArtRefreshTimer) settled = now;
  if (frame === 450) at15 = { requests: requests.length, added: added.length, pending: f.scene.pendingCharacterStills.size };
}
const drawStart = f.stats.worldDraws;
for (let i = 0; i < 48; i++) { f.scene.time.now += 16; f.scene.applyCamera({ ...f.scene.cameraView, panX: i * 2, panY: -i }, true); f.scene.update(f.scene.time.now, 16); }
panDraws = f.stats.worldDraws - drawStart;
f.scene.applyCamera({ zoom: 1.2, panX: 0, panY: 0 }); f.scene.time.now += 200; f.scene.update(f.scene.time.now, 16);
const maps: Record<string, unknown> = {};
const displayRecord = (value: any): unknown => ({ x: value.x, y: value.y, width: value.displayWidth, height: value.displayHeight,
  depth: value.depth, visible: value.visible, scaleX: value.scaleX, scaleY: value.scaleY, texture: value.texture?.key,
  commands: value.kind === 'graphics' ? value.commandBuffer?.map((command: unknown) => Array.isArray(command) ? command.filter(arg => arg === null || ['number', 'string', 'boolean'].includes(typeof arg)) : command) : undefined,
  children: value.list?.map(displayRecord) });
for (const key of ['fixtureGraphics', 'fixtureBitmapImages', 'environmentSprites', 'landscapingBitmapImages', 'characterBitmapContainers'])
  maps[key] = [...f.scene[key].entries()].sort(([a], [b]) => a.localeCompare(b)).map(([id, value]: any) => [id, displayRecord(value)]);
const displayHashes = Object.fromEntries(Object.entries(maps).map(([key, value]) => [key, createHash('sha256').update(JSON.stringify(value)).digest('hex')]));
if (process.env.PHONE_ART_DISPLAY_CAPTURE === '1') writeFileSync(`${process.env.PHONE_ART_OUTPUT!}/${phase}-l${level}-display.json`, JSON.stringify(maps));
const row = { phase, level, modelStateHash: stateHash, viewport: '390x700 CSS / DPR1', timing: 'Replay:80ms RTT + encoded bytes/20MBps; raster100MPps;33.333ms frames',
  firstTextureMs: added[0]?.at, firstCharacterMs: added.find(row => isCharacterTextureKey(row.key))?.at,
  firstVisibleCharacterMs: firstVisibleCharacter, firstRoomMs: firstRoom, firstPaintedRoomMs: f.scene.phoneArtLoadingStatus?.().firstRoomMs ?? firstRoom,
  visibleRoomsReadyMs: visibleReady, currentReadinessMs: predicate, allArtSettledMs: settled,
  status: f.scene.phoneArtLoadingStatus?.(),
  visibleRooms: visible.map(r => r.definitionId), required: required.length, at15s: at15,
  at31s: { requests: requests.length, uniquePaths: new Set(requests.map(r => r.path)).size, added: added.length, pending: f.scene.pendingCharacterStills.size,
    loading: loader.isLoading(), crispZoomPending: f.scene.crispZoomPending, cache: mobileBitmapCache.health },
  panDraws, peakPending, maxDecodes, displayHashes, textures: ledger.stats() };
writeFileSync(`${process.env.PHONE_ART_OUTPUT!}/${phase}-l${level}-loading.json`, JSON.stringify(row, null, 2));
console.log(JSON.stringify({ phase, level, firstRoomMs: row.firstPaintedRoomMs, firstCharacterMs: row.firstCharacterMs,
  visibleRoomsReadyMs: row.visibleRoomsReadyMs, allArtSettledMs: row.allArtSettledMs, currentReadinessMs: row.currentReadinessMs,
  requests: row.at31s.requests, textures: row.textures.textures, rgbaBytes: row.textures.nominalRgbaBytes }));
Object.assign(globalThis, originalGlobals);
if (phase !== 'before') {
  const assert = (ok: boolean, message: string) => { if (!ok) throw Error(message); };
  assert(row.firstPaintedRoomMs !== null && row.firstPaintedRoomMs < 2_500, 'Visible first room budget:2.5s');
  assert(row.firstVisibleCharacterMs !== null && row.firstVisibleCharacterMs < 1_000, 'First visible character budget:1s');
  assert(row.allArtSettledMs !== null && row.allArtSettledMs < 8_000, 'Settled art budget:8s');
  assert(row.at31s.requests === row.at15s.requests, 'Requests grew in a paused settled clinic');
  assert(row.at31s.pending === 0 && !row.at31s.loading && !row.at31s.crispZoomPending, 'Original readiness predicate never settled');
  assert(row.at31s.cache.decodeTimeouts === 0 && row.maxDecodes <= 4, 'Decode health/concurrency budget');
  assert(row.status?.missingRoomSources === 0 && row.status?.failedCharacters === 0, 'Missing/failed art after settlement');
  assert(row.panDraws === 0, 'Pan rebuilt the world');
  assert(row.textures.nominalRgbaBytes < (level === 4 ? 85_000_000 : 130_000_000), 'Phone art/actor texture budget');
}
