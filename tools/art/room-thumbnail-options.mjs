import { resolve, sep } from "node:path";
import { createHash } from "node:crypto";
// Reuse the lossless PNG decoder shipped by the project's pinned Playwright.
// This exported utility does not start a browser or make network requests.
import imageUtils from "playwright-core/lib/utilsBundle";
import { assertRoomThumbnailPixels, roomThumbnailFootprint, roomThumbnailStage, thumbnailFootprintInFrame } from "../../apps/player/src/facility/roomThumbnailPixels.mjs";

const { PNG } = imageUtils;

export function thumbnailOptions(args) {
  const options = { url: "http://127.0.0.1:5184/room-thumbnails.html", channel: undefined, verify: false, help: false };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--verify") options.verify = true;
    else if (arg === "--help") options.help = true;
    else if (arg === "--url" || arg === "--channel") {
      const value = args[++i];
      if (!value || value.startsWith("--")) throw new Error(`${arg} requires a value`);
      options[arg.slice(2)] = value;
    } else throw new Error(`Unknown argument: ${arg}`);
  }
  const url = new URL(options.url);
  if (url.protocol !== "http:" || url.hostname !== "127.0.0.1" || url.username || url.password ||
      url.pathname !== "/room-thumbnails.html" || url.search || url.hash) throw new Error("Use the dedicated loopback /room-thumbnails.html QA entry");
  if (options.channel !== undefined && !["chrome", "msedge", "chromium"].includes(options.channel)) throw new Error("Unsupported browser channel");
  return options;
}

export function thumbnailJobs(manifest, definitions) {
  if (manifest.version !== 1 || manifest.width !== 480 || manifest.height !== 336 || manifest.pixelRatio !== 3 || manifest.padding !== 24) {
    throw new Error("Unsupported thumbnail manifest format");
  }
  if (JSON.stringify(Object.keys(manifest.rooms).sort()) !== JSON.stringify(definitions.map(room => room.id).sort())) {
    throw new Error("Thumbnail manifest must cover exactly the buildable room definitions");
  }
  const seen = new Set();
  return definitions.flatMap(definition => {
    const entry = manifest.rooms[definition.id];
    if (entry.defaultTier !== 1 || Object.keys(entry.tiers).length !== definition.maximumUpgradeLevel) throw new Error(`Incorrect tiers: ${definition.id}`);
    return Array.from({ length: definition.maximumUpgradeLevel }, (_, index) => {
      const tier = index + 1, relativePath = entry.tiers[String(tier)];
      if (typeof relativePath !== "string" || !/^art\/rooms\/thumbnails\/[a-z0-9-]+\.png$/.test(relativePath) || seen.has(relativePath)) {
        throw new Error(`Invalid or duplicate thumbnail path: ${relativePath}`);
      }
      seen.add(relativePath);
      return { definitionId: definition.id, displayName: definition.displayName, tier, relativePath };
    });
  });
}

/** Keep every generated write inside the designated public-art directory. */
export function thumbnailOutputPath(playerPublic, relativePath) {
  const root = resolve(playerPublic, "art/rooms/thumbnails");
  const target = resolve(playerPublic, relativePath);
  if (!target.startsWith(root + sep) || !/^art\/rooms\/thumbnails\/[a-z0-9-]+\.png$/.test(relativePath)) throw new Error("Thumbnail output escapes its owned directory");
  return target;
}

export function pngSize(bytes) {
  if (bytes.length < 24 || !bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) || bytes.toString("ascii", 12, 16) !== "IHDR") throw new Error("Invalid capture PNG");
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

/** Decode actual output pixels independently of the browser's quality report. */
export function thumbnailPngQuality(bytes, capture, definition) {
  if (!definition) throw new Error(`Missing room definition for PNG quality: ${capture.definitionId}`);
  const stage = roomThumbnailStage(definition.width, definition.height);
  if (capture.stage?.width !== stage.width || capture.stage?.height !== stage.height) throw new Error("Invalid capture stage for footprint quality check");
  const png = PNG.sync.read(bytes);
  const footprint = thumbnailFootprintInFrame(roomThumbnailFootprint(definition.width, definition.height), capture.sourceBounds, capture.destinationBounds);
  return assertRoomThumbnailPixels(png.data, png.width, png.height, footprint);
}

/** A room-level failure is data: inspect every remaining room before returning. */
export async function captureThumbnailBatch(jobs, capture, onResult = () => {}) {
  const captures = [], failures = [];
  for (let index = 0; index < jobs.length; index++) {
    const job = jobs[index], attempt = index + 1;
    try {
      captures.push(await capture(job, attempt));
      onResult({ job, attempt, ok: true });
    } catch (error) {
      const failure = { ...job, attempt, message: error instanceof Error ? error.message : String(error) };
      failures.push(failure);
      onResult({ job, attempt, ok: false, message: failure.message });
    }
  }
  return { attempted: jobs.length, captures, failures };
}

export function assertCompleteThumbnailReport(report, jobs) {
  if (report.complete !== true || report.published !== true || report.attempted !== jobs.length ||
      report.failures?.length || report.errors?.length || report.captures?.length !== jobs.length) {
    const failures = (report.failures ?? []).map(failure => `${failure.definitionId} tier ${failure.tier}: ${failure.message}`);
    throw new Error(`Incomplete thumbnail generation. ${[...failures, ...(report.errors ?? [])].join("; ") || "Missing captures or publication; rerun the generator."}`);
  }
  for (let index = 0; index < jobs.length; index++) {
    const job = jobs[index], capture = report.captures[index];
    if (capture.relativePath !== job.relativePath || capture.definitionId !== job.definitionId || capture.tier !== job.tier) {
      throw new Error(`Generated capture order/identity mismatch: ${job.definitionId} tier ${job.tier}`);
    }
  }
}

/** Reader injection lets native tests prove that a missing PNG cannot verify. */
export async function verifyThumbnailPngs(manifest, report, jobs, readPng) {
  assertCompleteThumbnailReport(report, jobs);
  const definitions = new Map(report.definitions.map(definition => [definition.id, definition]));
  for (let index = 0; index < jobs.length; index++) {
    const job = jobs[index], capture = report.captures[index];
    let bytes;
    try { bytes = await readPng(job); }
    catch (error) { throw new Error(`Missing/unreadable thumbnail: ${job.relativePath}`, { cause: error }); }
    const size = pngSize(bytes);
    if (size.width !== manifest.width || size.height !== manifest.height ||
        createHash("sha256").update(bytes).digest("hex") !== capture.sha256) throw new Error(`Changed/invalid thumbnail: ${job.relativePath}`);
    try { thumbnailPngQuality(bytes, capture, definitions.get(job.definitionId)); }
    catch (error) { throw new Error(`Invalid thumbnail pixels: ${job.relativePath}: ${error.message}`, { cause: error }); }
  }
}

const escapeHtml = text => String(text).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
export function thumbnailReviewHtml(jobs, { failures = [], staged = false } = {}) {
  const failed = new Map(failures.map(failure => [failure.relativePath, failure.message]));
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Room thumbnail review</title>
<style>body{font:16px system-ui;background:#eee9da;color:#232720;margin:24px}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px}article{padding:12px;border:1px solid #6e7761;border-radius:8px;background:#faf7e8}img{object-fit:contain;image-rendering:pixelated;border:1px solid #6e7761;border-radius:4px;vertical-align:middle}p{margin:8px 0}</style>
<h1>Actual game room captures</h1><p>Fresh room at tier 1; all supported upgrade tiers follow. No people, neighbors or manually added doors. Large review, phone (76 × 54) and desktop (29 × 25) sizes. Manager/owner visual acceptance pending. Failed captures: ${failures.length}.${staged ? " Staged previews; public assets were not updated." : ""}</p><main>
${jobs.map(job => { const src = escapeHtml(staged ? `staging/${job.relativePath.split("/").at(-1)}` : `../../apps/player/public/${job.relativePath}`); const alt = escapeHtml(`${job.displayName}, tier ${job.tier}`);
    if (failed.has(job.relativePath)) return `<article data-capture-state="failed"><strong>${alt}</strong><p>CAPTURE FAILED: ${escapeHtml(failed.get(job.relativePath))}</p></article>`;
    return `<article><strong>${alt}</strong><p><img src="${src}" alt="${alt}" width="240" height="168"></p><img src="${src}" alt="Phone size" width="76" height="54"> <img src="${src}" alt="Desktop size" width="29" height="25"></article>`; }).join("\n")}</main></html>`;
}
