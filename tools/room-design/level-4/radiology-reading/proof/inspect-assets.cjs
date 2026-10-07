const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const here = __dirname;
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const inputs = [
  { id: 'island', file: '../assets/reading-island-02.png', seeds: [[760, 500]], bands: [[790, 850], [610, 643]] },
  { id: 'chairs', file: '../assets/reading-chairs-01.png', seeds: [[390, 260], [1130, 260], [390, 750], [1130, 750]] },
];

const url = file => `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  const page = await browser.newPage();
  const report = {};
  for (const item of inputs) {
    const file = path.resolve(here, item.file);
    report[item.id] = await page.evaluate(async ({ src, seeds, bands }) => {
      const image = new Image();
      image.src = src;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(image, 0, 0);
      const rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const alpha = i => rgba[i * 4 + 3];
      const components = [];
      for (const seed of seeds) {
        const start = seed[1] * canvas.width + seed[0];
        const seen = new Uint8Array(canvas.width * canvas.height);
        const stack = [start];
        seen[start] = 1;
        const pixels = [];
        while (stack.length) {
          const i = stack.pop();
          if (alpha(i) < 160) continue;
          pixels.push(i);
          const x = i % canvas.width;
          const y = Math.floor(i / canvas.width);
          if (x && !seen[i - 1]) { seen[i - 1] = 1; stack.push(i - 1); }
          if (x + 1 < canvas.width && !seen[i + 1]) { seen[i + 1] = 1; stack.push(i + 1); }
          if (y && !seen[i - canvas.width]) { seen[i - canvas.width] = 1; stack.push(i - canvas.width); }
          if (y + 1 < canvas.height && !seen[i + canvas.width]) { seen[i + canvas.width] = 1; stack.push(i + canvas.width); }
        }
        let minX = canvas.width, minY = canvas.height, maxX = -1, maxY = -1;
        for (const i of pixels) {
          const x = i % canvas.width;
          const y = Math.floor(i / canvas.width);
          minX = Math.min(minX, x); maxX = Math.max(maxX, x);
          minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        }
        const bandRuns = (bands || []).map(([fromY, toY]) => {
          const columns = new Uint8Array(canvas.width);
          for (const i of pixels) { const x = i % canvas.width, y = Math.floor(i / canvas.width); if (y >= fromY && y <= toY) columns[x] = 1; }
          const runs = []; for (let x = 0; x < columns.length; x++) if (columns[x]) { const start = x; while (x + 1 < columns.length && columns[x + 1]) x++; runs.push([start, x]); }
          return { band: [fromY, toY], xRuns: runs };
        });
        components.push({ seed, pixels: pixels.length, bounds: [minX, minY, maxX, maxY], bandRuns });
      }
      return { width: canvas.width, height: canvas.height, components };
    }, { src: url(file), seeds: item.seeds, bands: item.bands });
  }
  await browser.close();
  console.log(JSON.stringify(report, null, 2));
})().catch(error => { console.error(error.stack || error); process.exit(1); });
