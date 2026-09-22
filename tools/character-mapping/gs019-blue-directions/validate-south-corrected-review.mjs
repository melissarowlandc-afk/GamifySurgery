import { readFileSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const repo = path.resolve(import.meta.dirname, '../../..');
const fragment = readFileSync(path.join(repo, 'artifacts/character-movement/gs019-blue-directions/south-corrected-v2/blue-south-corrected-v2-review.html'), 'utf8');
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const assert = (condition, message) => { if (!condition) throw new Error(message); };
async function inspect(width) {
  const browser = await chromium.launch({ executablePath: chrome, headless: true });
  try {
    const page = await browser.newPage({ viewport: { width, height: 900 } }), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setContent(`<style>:root{--foreground:#20242a;--muted:#ded8ce;--muted-foreground:#535861}</style>${fragment}`, { waitUntil: 'load' });
    await page.waitForSelector('#south-play:not([disabled])');
    assert(await page.locator('.phase').count() === 8, 'phase buttons missing');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px overflow`);
    const nonblank = await page.locator('#game-standing,#game-prior,#game-revised,#native-standing,#native-prior,#native-revised,#south-detail').evaluateAll(items => items.every(canvas => { const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data; let opaque = 0; for (let i = 3; i < data.length; i += 4) if (data[i]) opaque++; return opaque > 100; }));
    assert(nonblank, `${width}px blank canvas`);
    const output = () => page.locator('#south-output').evaluate(node => node.value || node.textContent);
    for (let index = 0; index < 8; index++) { await page.locator('.phase').nth(index).click(); assert(await output() === String(index + 1).padStart(2, '0'), `phase ${index + 1}`); }
    await page.locator('.phase').first().click(); await page.locator('#south-play').click(); await page.waitForTimeout(220); assert(await output() !== '01', 'playback did not advance'); await page.locator('#south-play').click();
    assert(!errors.length, errors.join('; ')); return { width, phaseButtons: 8, nonblank, noOverflow: true, playback: true };
  } finally { await browser.close(); }
}
const layouts = [await inspect(736), await inspect(320)]; console.log(JSON.stringify({ status: 'PASS', layouts }, null, 2));
