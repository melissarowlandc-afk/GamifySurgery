import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const repo = resolve(import.meta.dirname, '../../..');
const htmlPath = resolve(repo, 'artifacts/character-movement/retained-art-proof/retained-art-proof.html');
const screenshotPath = resolve(repo, 'artifacts/character-movement/retained-art-proof/retained-art-proof-contact-sheet.png');
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
try {
  const page = await browser.newPage({ viewport: { width: 1180, height: 900 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' });
  await page.waitForSelector('body[data-ready="true"]');
  if (errors.length) throw new Error(`renderer page errors: ${errors.join('; ')}`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(JSON.stringify({ screenshotPath, width: 1180, fullPage: true, pageErrors: errors.length }));
} finally {
  await browser.close();
}
