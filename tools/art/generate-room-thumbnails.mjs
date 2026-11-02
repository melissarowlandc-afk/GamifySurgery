import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assertCompleteThumbnailReport, captureThumbnailBatch, pngSize, thumbnailPngQuality, thumbnailJobs, thumbnailOptions, thumbnailOutputPath,
  thumbnailReviewHtml, verifyThumbnailPngs } from "./room-thumbnail-options.mjs";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const playerPublic = resolve(repo, "apps/player/public");
const output = resolve(playerPublic, "art/rooms/thumbnails");
const review = resolve(repo, ".local-dev/room-thumbnails-20261102");
const options = thumbnailOptions(process.argv.slice(2));
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const manifest = JSON.parse(await readFile(resolve(output, "manifest.json"), "utf8"));
const reportPath = resolve(output, "generation.json");

if (options.help) {
  console.log("node tools/art/generate-room-thumbnails.mjs [--url http://127.0.0.1:5184/room-thumbnails.html] [--channel chrome|msedge|chromium] [--verify]");
  process.exit(0);
}

async function sourceFingerprints(sourceAssets) {
  const paths = new Set([
    "package-lock.json", "apps/player/package.json", "node_modules/phaser/package.json", "node_modules/playwright-core/package.json",
    "apps/player/room-thumbnails.html", "apps/player/src/qa/roomThumbnails.ts",
    "apps/player/public/art/rooms/thumbnails/manifest.json",
    "tools/art/generate-room-thumbnails.mjs", "tools/art/room-thumbnail-options.mjs",
  ]);
  for (const directory of ["apps/player/src/facility", "apps/player/src/art", "packages/balance-config/src"]) {
    for (const entry of await readdir(resolve(repo, directory), { withFileTypes: true })) {
      if (entry.isFile() && /\.(ts|mts|mjs|json)$/.test(entry.name) && !/\.test\./.test(entry.name)) paths.add(`${directory}/${entry.name}`);
    }
  }
  paths.add("apps/player/src/mobile/performance/roomAssets.ts");
  for (const asset of sourceAssets) {
    if (typeof asset !== "string" || !asset.startsWith("art/") || asset.includes("..") || asset.includes("\\")) throw new Error("Unexpected source-art path");
    paths.add(`apps/player/public/${asset}`);
  }
  return Promise.all([...paths].sort().map(async path => ({ path, sha256: hash(await readFile(resolve(repo, path))) })));
}

if (options.verify) {
  const report = JSON.parse(await readFile(reportPath, "utf8"));
  if (JSON.stringify(report.manifest) !== JSON.stringify(manifest)) throw new Error("Generated assets use an older manifest");
  const jobs = thumbnailJobs(manifest, report.definitions);
  assertCompleteThumbnailReport(report, jobs);
  const sources = await sourceFingerprints(report.sourceAssets);
  if (JSON.stringify(sources) !== JSON.stringify(report.sources)) throw new Error("Room renderer/art inputs changed; regenerate thumbnails");
  await verifyThumbnailPngs(manifest, report, jobs, job => readFile(thumbnailOutputPath(playerPublic, job.relativePath)));
  console.log(`PASS: ${jobs.length} generated PNGs, ${report.definitions.length} rooms, current renderer/art hashes, ${manifest.width}x${manifest.height}.`);
  process.exit(0);
}

// Only this execution path needs a real browser. --verify and helper tests
// run without a browser, network requests, or dependency installation.
const { chromium } = await import("@playwright/test");
const browser = await chromium.launch({ headless: true, ...(options.channel ? { channel: options.channel } : {}) });
try {
  const context = await browser.newContext({ viewport: { width: 1200, height: 1200 }, deviceScaleFactor: 1,
    locale: "en-US", timezoneId: "UTC", reducedMotion: "reduce", serviceWorkers: "block" });
  const origin = new URL(options.url).origin;
  await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  await page.goto(options.url, { waitUntil: "load", timeout: 120_000 });
  await page.waitForFunction(() => window.__roomThumbnailQa?.ready || window.__roomThumbnailQa?.error, undefined, { timeout: 120_000 });
  const metadata = await page.evaluate(() => {
    const qa = window.__roomThumbnailQa;
    if (qa.error) throw new Error(qa.error);
    return { manifest: qa.manifest, definitions: qa.definitions, sourceAssets: qa.sourceAssets };
  });
  if (JSON.stringify(manifest) !== JSON.stringify(metadata.manifest)) throw new Error("QA server has a stale thumbnail manifest");
  const jobs = thumbnailJobs(manifest, metadata.definitions);
  const definitions = new Map(metadata.definitions.map(definition => [definition.id, definition]));
  const sources = await sourceFingerprints(metadata.sourceAssets);
  await mkdir(resolve(review, "staging"), { recursive: true });
  const batch = await captureThumbnailBatch(jobs, async job => {
    const capture = await page.evaluate(({ definitionId, tier }) => window.__roomThumbnailQa.capture(definitionId, tier), job);
    if (!capture.dataUrl.startsWith("data:image/png;base64,")) throw new Error("QA hook did not return a PNG");
    const bytes = Buffer.from(capture.dataUrl.slice("data:image/png;base64,".length), "base64");
    const size = pngSize(bytes);
    if (size.width !== manifest.width || size.height !== manifest.height) throw new Error(`Incorrect capture dimensions: ${job.relativePath}`);
    const pngQuality = thumbnailPngQuality(bytes, capture, definitions.get(job.definitionId));
    const target = thumbnailOutputPath(playerPublic, job.relativePath);
    const staged = resolve(review, "staging", relative(output, target));
    await writeFile(staged, bytes);
    const { dataUrl: _dataUrl, ...geometry } = capture;
    return { ...job, ...geometry, quality: { ...capture.quality, verifiedPng: pngQuality }, bytes: bytes.length, sha256: hash(bytes) };
  }, ({ job, attempt, ok, message }) => {
    const label = `${attempt}/${jobs.length} ${job.definitionId} tier ${job.tier}`;
    if (ok) console.log(`OK ${label}`); else console.error(`FAIL ${label}: ${message}`);
  });
  const errors = pageErrors.map(message => `QA browser error: ${message}`);
  try {
    if (JSON.stringify(sources) !== JSON.stringify(await sourceFingerprints(metadata.sourceAssets))) errors.push("Source inputs changed during capture");
  } catch (error) { errors.push(`Could not recheck source inputs: ${error.message}`); }
  const complete = batch.failures.length === 0 && errors.length === 0;
  // Publish generated files locally only after every capture and input passes.
  // No deletion, Git, deployment, or production-server action.
  if (complete) {
    for (const job of jobs) {
      const target = thumbnailOutputPath(playerPublic, job.relativePath);
      await copyFile(resolve(review, "staging", relative(output, target)), target);
    }
  }
  const report = { manifest, definitions: metadata.definitions, sourceAssets: metadata.sourceAssets, sources,
    browser: { version: browser.version(), channel: options.channel ?? "playwright-chromium" },
    ...batch, complete, published: complete, errors };
  // Even an incomplete attempt writes an explicit report, so old/staged files
  // cannot masquerade as a complete verified run. Successful PNGs stay staged.
  await writeFile(reportPath, JSON.stringify(report, null, 2) + "\n");
  await writeFile(resolve(review, "capture-run.json"), JSON.stringify(report, null, 2) + "\n");
  await writeFile(resolve(review, "preview.html"), thumbnailReviewHtml(jobs, { failures: batch.failures, staged: !complete }));
  if (complete) {
    console.log(`PASS: ${jobs.length} PNGs; ${metadata.definitions.length} rooms; 3x phone resolution. Review: ${resolve(review, "preview.html")}`);
    console.log("Manager/owner visual acceptance is still required. Run --verify after generation.");
  } else {
    console.error(`FAIL: attempted ${batch.attempted}/${jobs.length}; ${batch.captures.length} captured; ${batch.failures.length} failed. Public PNGs were not updated.`);
    for (const failure of batch.failures) console.error(`  ${failure.attempt}: ${failure.definitionId} tier ${failure.tier}: ${failure.message}`);
    for (const error of errors) console.error(`  ${error}`);
    console.error(`Failure report: ${resolve(review, "capture-run.json")}; staged review: ${resolve(review, "preview.html")}`);
    process.exitCode = 1;
  }
} finally { await browser.close(); }
