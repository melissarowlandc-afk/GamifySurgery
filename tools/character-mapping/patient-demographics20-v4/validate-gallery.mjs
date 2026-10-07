import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { hash, rel, root, verifyRuntimeBaseline } from './build-roster.mjs';

verifyRuntimeBaseline();
const registry = JSON.parse(readFileSync(resolve(root, 'staging-registry.json'), 'utf8'));
assert.equal(registry.entries.length, 20, 'gallery QA requires all 20 identities');
const executableCandidates = [
  chromium.executablePath(),
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];
const executablePath = executableCandidates.find(file => existsSync(file));
assert(executablePath, 'no existing browser executable available; no install is authorized');
const browser = await chromium.launch({ executablePath, headless: true });
const output = resolve(root, 'validation'); mkdirSync(output, { recursive: true });
const pages = [
  { file: 'review/index.html', expectedImages: 40, expectedCards: 20 },
  { file: 'review/source-review.html', expectedImages: 5 },
  { file: 'contact-review/index.html', expectedImages: 0 },
  { file: 'placement-qa/index.html', expectedImages: 0 },
];
const results = [];
try {
  for (const viewport of [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'phone', width: 390, height: 844 }]) {
    // Fresh, ephemeral contexts isolate this static file gallery from all owner
    // game profiles and storage. No HTTP game server or save origin is used.
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    for (const item of pages) {
      const page = await context.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const file = resolve(root, item.file);
      await page.goto(pathToFileURL(file).href, { waitUntil: 'load' });
      await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0), null, { timeout: 30000 });
      const result = await page.evaluate(() => ({
        origin: location.origin,
        title: document.title,
        images: document.images.length,
        loadedImages: [...document.images].filter(image => image.complete && image.naturalWidth > 0).length,
        cards: document.querySelectorAll('article').length,
        viewportWidth: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
        links: [...document.querySelectorAll('a')].map(link => ({ raw: link.getAttribute('href'), resolved: link.href })),
      }));
      assert.equal(result.images, item.expectedImages, item.file + ' image count');
      assert.equal(result.loadedImages, result.images, item.file + ' unloaded image');
      if (item.expectedCards) assert.equal(result.cards, item.expectedCards);
      assert(result.documentWidth <= result.viewportWidth + 1 && result.bodyWidth <= result.viewportWidth + 1, item.file + ' horizontal overflow at ' + viewport.name);
      assert.equal(errors.length, 0, item.file + ' script errors');
      for (const link of result.links) {
        const url = new URL(link.resolved);
        assert.equal(url.protocol, 'file:', 'gallery unexpectedly links off local artifacts');
        assert(existsSync(url), 'broken gallery link ' + link.raw);
      }
      const screenshotFile = resolve(output, item.file.replaceAll('/', '-').replace('.html', '') + '-' + viewport.name + '.png');
      await page.screenshot({ path: screenshotFile, fullPage: false });
      const screenshot = { path: rel(screenshotFile), sha256: hash(screenshotFile) };
      results.push({ page: rel(file), pageSha256: hash(file), viewport: viewport.name, ...result, linkCount: result.links.length, errors, screenshot });
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
}
verifyRuntimeBaseline();
const result = {
  status: 'PASS', browserMode: 'headless existing browser, fresh ephemeral contexts',
  ownerGameStorage: 'not accessed', staticGalleryOrigin: 'null (file:)',
  identities: 20, poses: 160, results,
};
writeFileSync(resolve(output, 'gallery-browser-results.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ status: result.status, checkedPagesAndViewports: results.length, identities: 20, loadedMainGalleryImages: 40, ownerGameStorage: result.ownerGameStorage }));
