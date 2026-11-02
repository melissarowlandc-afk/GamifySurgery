import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import imageUtils from "playwright-core/lib/utilsBundle";
import { assertCompleteThumbnailReport, captureThumbnailBatch, pngSize, thumbnailPngQuality, thumbnailJobs, thumbnailOptions, thumbnailOutputPath,
  thumbnailReviewHtml, verifyThumbnailPngs } from "./room-thumbnail-options.mjs";
import { assertRoomThumbnailPixels, roomThumbnailFootprint, thumbnailFootprintInFrame } from "../../apps/player/src/facility/roomThumbnailPixels.mjs";

test("accept only the isolated loopback entry and known browser channels", () => {
  assert.equal(thumbnailOptions([]).url, "http://127.0.0.1:5184/room-thumbnails.html");
  assert.equal(thumbnailOptions(["--channel", "chrome", "--verify"]).verify, true);
  for (const args of [["--url", "https://example.com/room-thumbnails.html"], ["--url", "http://127.0.0.1:4173/"],
    ["--url", "http://127.0.0.1:5184/room-thumbnails.html?campaign=owner"], ["--url", "http://owner:secret@127.0.0.1:5184/room-thumbnails.html"],
    ["--channel", "unknown"], ["--url"], ["--install"]]) assert.throws(() => thumbnailOptions(args));
});

const definitions = [{ id: "room.waiting", displayName: "Waiting Room", width: 4, height: 3, maximumUpgradeLevel: 2 }];
const manifest = { version: 1, width: 480, height: 336, pixelRatio: 3, padding: 24,
  rooms: { "room.waiting": { defaultTier: 1, tiers: { 1: "art/rooms/thumbnails/waiting-tier-1.png", 2: "art/rooms/thumbnails/waiting-tier-2.png" } } } };
test("jobs cover every room and supported tier, reject omissions, duplicates and unsafe paths", () => {
  const jobs = thumbnailJobs(manifest, definitions);
  assert.equal(jobs.length, 2); assert.deepEqual(jobs.map(job => job.tier), [1, 2]);
  assert.throws(() => thumbnailJobs(manifest, [...definitions, { id: "room.xray", maximumUpgradeLevel: 5 }]));
  for (const mutate of [m => delete m.rooms["room.waiting"].tiers[2],
    m => m.rooms["room.waiting"].tiers[2] = m.rooms["room.waiting"].tiers[1],
    m => m.rooms["room.waiting"].tiers[1] = "../../outside.png", m => m.rooms["room.waiting"].defaultTier = 2]) {
    const changed = structuredClone(manifest); mutate(changed); assert.throws(() => thumbnailJobs(changed, definitions));
  }
});
test("output guard confines writes to the thumbnail directory", () => {
  assert.match(thumbnailOutputPath("C:/repo/public", "art/rooms/thumbnails/waiting-tier-1.png"), /waiting-tier-1\.png$/);
  for (const path of ["../outside.png", "art/rooms/thumbnails/../outside.png", "art/rooms/other.png", "art/rooms/thumbnails/x.json"]) {
    assert.throws(() => thumbnailOutputPath("C:/repo/public", path));
  }
});
test("verify PNG signature, header and dimensions", () => {
  const bytes = Buffer.alloc(24); Buffer.from([137,80,78,71,13,10,26,10]).copy(bytes); bytes.write("IHDR",12); bytes.writeUInt32BE(480,16); bytes.writeUInt32BE(336,20);
  assert.deepEqual(pngSize(bytes), { width: 480, height: 336 });
  assert.throws(() => pngSize(Buffer.alloc(24))); assert.throws(() => pngSize(bytes.subarray(0, 20)));
});
test("contact sheet escapes labels and includes real phone and desktop sizes", () => {
  const html = thumbnailReviewHtml([{ displayName: '<Room & "Art">', tier: 1, relativePath: "art/rooms/thumbnails/waiting-tier-1.png" }]);
  assert.ok(html.includes("&lt;Room &amp; &quot;Art&quot;&gt;")); assert.ok(!html.includes('<Room & "Art">'));
  assert.ok(html.includes('width="76" height="54"')); assert.ok(html.includes('width="29" height="25"'));
});

test("a failed room cannot stop later captures, and attempt numbers retain catalog order", async () => {
  const jobs = [1, 2, 3, 4].map(tier => ({ definitionId: "room.waiting", tier, relativePath: `art/rooms/thumbnails/waiting-tier-${tier}.png` }));
  const attempts = [], progress = [];
  const batch = await captureThumbnailBatch(jobs, async job => {
    attempts.push(job.tier);
    if (job.tier === 2) throw new Error("Room capture touches stage edge: [0,0]-[500,500]");
    if (job.tier === 3) throw "decode failed";
    return { ...job, sha256: "captured" };
  }, result => progress.push([result.attempt, result.ok]));
  assert.deepEqual(attempts, [1, 2, 3, 4]); assert.equal(batch.attempted, 4);
  assert.deepEqual(batch.captures.map(capture => capture.tier), [1, 4]);
  assert.deepEqual(batch.failures.map(failure => [failure.tier, failure.attempt]), [[2, 2], [3, 3]]);
  assert.match(batch.failures[0].message, /stage edge/); assert.equal(batch.failures[1].message, "decode failed");
  assert.deepEqual(progress, [[1, true], [2, false], [3, false], [4, true]]);
  assert.throws(() => assertCompleteThumbnailReport({ ...batch, complete: false, published: false, errors: [] }, jobs), /room.waiting tier 2/);
});

test("verification rejects failed/incomplete batches, identity drift and any missing or changed PNG", async () => {
  const jobs = thumbnailJobs(manifest, definitions);
  const bytes = capturePng();
  const report = completeReport(jobs, bytes);
  await verifyThumbnailPngs(manifest, report, jobs, async () => bytes);
  for (const change of [r => r.complete = false, r => r.published = false, r => r.attempted--,
    r => r.captures.pop(), r => r.failures.push({ ...jobs[1], message: "stage edge" }),
    r => r.errors.push("Source inputs changed"), r => r.captures[1].tier = 99]) {
    const invalid = structuredClone(report); change(invalid);
    assert.throws(() => assertCompleteThumbnailReport(invalid, jobs));
  }
  const read = [];
  await assert.rejects(verifyThumbnailPngs(manifest, report, jobs, async job => {
    read.push(job.tier); if (job.tier === 2) throw Object.assign(new Error("ENOENT"), { code: "ENOENT" }); return bytes;
  }), /Missing\/unreadable thumbnail: art\/rooms\/thumbnails\/waiting-tier-2.png/);
  assert.deepEqual(read, [1, 2]);
  const changed = Buffer.from(bytes); changed[23] = 1;
  await assert.rejects(verifyThumbnailPngs(manifest, report, jobs, async () => changed), /Changed\/invalid thumbnail/);
});

const geometry = { sourceBounds: { x: 348, y: 261, width: 504, height: 488 },
  destinationBounds: { x: 91, y: 24, width: 297, height: 288 }, stage: { width: 1200, height: 1080 } };
function capturePng(pixel = (x, y) => [(x % 64) * 4, (y % 64) * 4, ((x + y) % 64) * 4, 255]) {
  const data = Buffer.alloc(480 * 336 * 4);
  for (let y = 0; y < 336; y++) for (let x = 0; x < 480; x++) data.set(pixel(x, y), (y * 480 + x) * 4);
  return imageUtils.PNG.sync.write({ width: 480, height: 336, data });
}
function completeReport(jobs, bytes) {
  return { definitions, complete: true, published: true, attempted: jobs.length, failures: [], errors: [],
    captures: jobs.map(job => ({ ...job, ...geometry, sha256: createHash("sha256").update(bytes).digest("hex") })) };
}

test("blank/near-uniform/transparent pixels fail before framing; floor bounds exclude surviving walls", () => {
  const width = 200, height = 160, footprint = { x: 30, y: 20, width: 140, height: 120 };
  const pixels = new Uint8Array(width * height * 4);
  const paint = fn => { for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) pixels.set(fn(x, y), (y * width + x) * 4); };
  for (const fn of [() => [227, 237, 251, 255], () => [255, 238, 216, 255], () => [138, 140, 140, 255],
    () => [100, 100, 100, 0], (x, y) => [228 + (x % 20), 223 + (y % 20), 206 + (x % 20), 255],
    (x, y) => x % 150 === 0 && y % 100 === 0 ? [x % 256, y % 256, 0, 255] : [150, 150, 150, 255]]) {
    paint(fn); assert.throws(() => assertRoomThumbnailPixels(pixels, width, height, footprint), /blank\/background-only/);
  }
  paint((x, y) => x < 35 || x > 165 || y < 24 || y > 136 ? [x % 256, y % 256, 0, 255] : [138, 140, 140, 255]);
  assert.throws(() => assertRoomThumbnailPixels(pixels, width, height, footprint), /blank\/background-only/);
  paint((x, y) => [(x % 64) * 4, (y % 64) * 4, 120, 255]);
  const stats = assertRoomThumbnailPixels(pixels, width, height, footprint);
  assert.equal(stats.opaqueCoverage, 1); assert.ok(stats.quantizedColors >= 8); assert.equal(stats.version, 1);
  assert.throws(() => assertRoomThumbnailPixels([], width, height, footprint), /buffer/);
  assert.throws(() => assertRoomThumbnailPixels(pixels, width, height, { ...footprint, x: -100 }), /outside/);
  assert.throws(() => thumbnailFootprintInFrame(footprint, { x: 0, y: 0, width: 0, height: 1 }, footprint), /mapping/);
});

test("verification decodes a hash-matching PNG and rejects blank art despite a complete or forged quality report", async () => {
  const jobs = thumbnailJobs(manifest, definitions);
  for (const rgb of [[227, 237, 251], [255, 238, 216], [138, 140, 140]]) {
    const bytes = capturePng(() => [...rgb, 255]);
    const report = completeReport(jobs, bytes);
    report.captures[0].quality = { source: { distinctColors: 9999, opaqueCoverage: 1 }, verifiedPng: { distinctColors: 9999 } };
    await assert.rejects(verifyThumbnailPngs(manifest, report, jobs, async () => bytes), /Invalid thumbnail pixels:.*blank\/background-only/);
  }
  const good = capturePng(), capture = { ...jobs[0], ...geometry };
  const stats = thumbnailPngQuality(good, capture, definitions[0]);
  assert.ok(stats.distinctColors >= 24);
  const bounds = thumbnailFootprintInFrame(roomThumbnailFootprint(4, 3), geometry.sourceBounds, geometry.destinationBounds);
  assert.ok(stats.bounds.x > bounds.x); assert.ok(stats.bounds.y > bounds.y);
  assert.throws(() => thumbnailPngQuality(good, { ...capture, stage: { width: 1, height: 1 } }, definitions[0]), /stage/);
  assert.throws(() => thumbnailPngQuality(good.subarray(0, 24), capture, definitions[0]));
});

test("a background-only PNG is listed as a failed capture and later rooms still run", async () => {
  const jobs = thumbnailJobs(manifest, definitions), good = capturePng(), blank = capturePng(() => [138, 140, 140, 255]);
  const batch = await captureThumbnailBatch(jobs, job => {
    const quality = thumbnailPngQuality(job.tier === 1 ? blank : good, { ...job, ...geometry }, definitions[0]);
    return { ...job, quality };
  });
  assert.equal(batch.attempted, 2); assert.deepEqual(batch.captures.map(capture => capture.tier), [2]);
  assert.equal(batch.failures[0].attempt, 1); assert.match(batch.failures[0].message, /blank\/background-only/);
  assert.throws(() => assertCompleteThumbnailReport({ ...batch, complete: false, published: false }, jobs), /room.waiting tier 1/);
});

test("partial review shows explicit failure cards and only successful staged images", () => {
  const jobs = thumbnailJobs(manifest, definitions);
  const html = thumbnailReviewHtml(jobs, { failures: [{ ...jobs[1], message: 'stage edge <bad> "art"' }], staged: true });
  assert.ok(html.includes('src="staging/waiting-tier-1.png"'));
  assert.ok(!html.includes('src="staging/waiting-tier-2.png"'));
  assert.ok(html.includes('data-capture-state="failed"'));
  assert.ok(html.includes("stage edge &lt;bad&gt; &quot;art&quot;"));
  assert.ok(html.includes("Failed captures: 1."));
  assert.ok(html.includes("public assets were not updated"));
});
