const { chromium } = require('playwright');
const path = require('path');

const file = path.resolve(__dirname, 'evidence', 'room-character-fit-host.html').replaceAll('\\', '/');

async function main() {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(`file:///${file}`, { waitUntil: 'load' });
  const frame = page.frameLocator('iframe');
  await frame.locator('#gs015-character-fit-review').waitFor();
  await frame.locator('#fit-stage').waitFor();
  const rooms = await frame.locator('#fit-rooms button').count();
  if (rooms !== 16) throw new Error(`Expected 16 room controls, found ${rooms}`);
  for (let index = 0; index < rooms; index += 1) {
    await frame.locator('#fit-rooms button').nth(index).click();
    const snapshot = await frame.locator('#fit-stage').evaluate(canvas => {
      const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
      let opaque = 0;
      for (let index = 3; index < pixels.length; index += 32) opaque += pixels[index] > 0 ? 1 : 0;
      return { model: JSON.parse(canvas.dataset.model), opaque };
    });
    if (!snapshot.opaque || snapshot.model.room === undefined || snapshot.model.actorSize[0] <= 0) throw new Error(`Room ${index} did not render room/actor pixels`);
  }
  await frame.locator('#fit-rooms button').filter({ hasText: 'Examination' }).click();
  if (await frame.locator('#fit-orientation option').count() !== 2) throw new Error('Examination alternate view missing');
  await frame.locator('#fit-orientation').selectOption('alternate');
  await frame.locator('#fit-pose').selectOption('sit');
  await frame.locator('#fit-direction').selectOption('north');
  await frame.locator('#fit-stage').click({ position: { x: 180, y: 260 } });
  const model = await frame.locator('#gs015-character-fit-review').evaluate(root => ({ state: window.__characterFitReview.state, width: root.querySelector('#fit-stage').width, height: root.querySelector('#fit-stage').height }));
  if (model.state.pose !== 'sit' || model.state.direction !== 'north' || !model.state.alternate) throw new Error('Controls did not update state');
  const scales = await frame.locator('#fit-stage').evaluate(canvas => JSON.parse(canvas.dataset.model));
  if (Math.abs(scales.tileCss - 144) > 0.001 || Math.abs(scales.actorScale - (.754083 * 1.2)) > 0.001) throw new Error('Examination scale contract failed');
  await frame.locator('#fit-rooms button').filter({ hasText: 'Front Desk' }).click();
  const frontDesk = await frame.locator('#fit-stage').evaluate(canvas => JSON.parse(canvas.dataset.model));
  if (Math.abs(frontDesk.tileCss - 105.6) > 0.001 || Math.abs(frontDesk.actorScale - (.754083 * .88)) > 0.001) throw new Error('Front Desk scale contract failed');
  if (pageErrors.length) throw new Error(`Page errors: ${pageErrors.join('; ')}`);
  await page.screenshot({ path: path.join(__dirname, 'evidence', 'character-fit-desktop.png'), fullPage: false });
  await page.setViewportSize({ width: 320, height: 760 });
  await page.screenshot({ path: path.join(__dirname, 'evidence', 'character-fit-320.png'), fullPage: false });
  await browser.close();
  console.log(`PASS rooms=${rooms} stage=${model.width}x${model.height}`);
}
main().catch(error => { console.error(error); process.exit(1); });
