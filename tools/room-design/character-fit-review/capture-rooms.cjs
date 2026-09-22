const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..', '..', '..');
const inventory = JSON.parse(fs.readFileSync(path.join(root, 'tools/room-design/consistency-audit/inventory.json'), 'utf8'));
const output = path.join(__dirname, 'assets');
fs.mkdirSync(output, { recursive: true });
// Canonical proof sources use 120px tiles except the retained Front Desk
// renderer, whose explicit draw constant is `s=88`.
const nativeTile = { 'front-desk': 88 };

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 1 });
  const report = [];
  for (const room of inventory.rooms) {
    const source = path.join(root, room.canonicalProof.path);
    await page.goto(`file:///${source.replaceAll('\\', '/')}`, { waitUntil: 'load' });
    await page.waitForTimeout(250);
    if (room.id === 'waiting') {
      await page.evaluate(() => {
        const original = CanvasRenderingContext2D.prototype.drawImage;
        CanvasRenderingContext2D.prototype.drawImage = function (...args) {
          // The isolated Waiting proof contains a legacy walking actor. The
          // review must contain only the single GS-018 reference character.
          if (args[0] instanceof HTMLImageElement && args[0].naturalWidth === 256 && args[0].naturalHeight === 768) return;
          return original.apply(this, args);
        };
        window.__waitingLayout?.render?.();
      });
    }
    const candidates = await page.locator('canvas').evaluateAll(nodes => nodes.map((node, index) => {
      const r = node.getBoundingClientRect();
      let model = {};
      for (const value of [node.dataset.model, node.dataset.surface]) {
        try { model = { ...model, ...JSON.parse(value || '{}') }; } catch { /* unavailable metadata */ }
      }
      const tileLogical = model.shell?.tileSize || model.surface?.tileSize || model.tileSize || 120;
      const renderScale = model.surface?.renderScale || model.renderScale || 2;
      return { index, width: r.width, height: r.height, backingWidth: node.width, backingHeight: node.height, tileLogical, renderScale, area: r.width * r.height };
    }).filter(item => item.width > 80 && item.height > 80));
    for (const candidate of candidates) candidate.tileLogical = nativeTile[room.id] || candidate.tileLogical;
    candidates.sort((a, b) => b.area - a.area);
    const file = `${room.id}.png`;
    if (candidates.length) {
      await page.locator('canvas').nth(candidates[0].index).screenshot({ path: path.join(output, file) });
      const backingScale = candidates[0].backingWidth / candidates[0].width > 1.5 ? 2 : 1;
      report.push({ id: room.id, file, capture: 'largest-canvas', ...candidates[0], backingScale, tileCss: candidates[0].tileLogical * candidates[0].width / (candidates[0].backingWidth / backingScale) });
    } else {
      await page.screenshot({ path: path.join(output, file), fullPage: false });
      report.push({ id: room.id, file, capture: 'page-fallback', width: 1100, height: 900 });
    }
    if (room.orientations?.length > 1 && room.id !== 'hallway' && candidates.length) {
      const switched = await page.evaluate(() => {
        const select = document.querySelector('select[id*="orientation"], select[name*="orientation"]');
        if (!select || select.options.length < 2) return false;
        select.selectedIndex = 1;
        select.dispatchEvent(new Event('input', { bubbles: true }));
        select.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      });
      if (switched) {
        await page.waitForTimeout(150);
        const rotated = `${room.id}-alternate.png`;
        const current = await page.locator('canvas').nth(candidates[0].index).evaluate(node => { const r=node.getBoundingClientRect(); return { width:r.width,height:r.height,backingWidth:node.width,backingHeight:node.height }; });
        await page.locator('canvas').nth(candidates[0].index).screenshot({ path: path.join(output, rotated) });
        const backingScale = current.backingWidth / current.width > 1.5 ? 2 : 1;
        report.push({ id: room.id, file: rotated, capture: 'select-alternate', ...current, tileLogical: candidates[0].tileLogical, renderScale: candidates[0].renderScale, backingScale, tileCss: candidates[0].tileLogical * current.width / (current.backingWidth / backingScale) });
      }
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(output, 'capture-report.json'), JSON.stringify(report, null, 2));
}

main().catch(error => { console.error(error); process.exit(1); });
