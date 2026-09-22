import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
for (const [name,width] of [['host-art-desktop',1280],['host-art-320',320]]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto('file:///C:/Users/Kyle%20Kent/Projects/GamifySurgery/tools/room-design/examination-layout/evidence/examination-layout-host.html');
  const frame = page.frameLocator('iframe');
  const proof = frame.locator('#examination-layout-proof');
  await proof.waitFor();
  await frame.locator('#exam-art').waitFor();
  await page.waitForTimeout(250);
  const contentHeight = await frame.locator('html').evaluate(el => el.scrollHeight);
  await page.locator('iframe').evaluate((el, height) => { el.style.height = `${height}px`; }, contentHeight);
  await proof.screenshot({ path: `tools/room-design/examination-layout/evidence/${name}.png` });
  await frame.getByLabel('Room orientation').selectOption('90');
  await page.waitForTimeout(150);
  const westHeight = await frame.locator('html').evaluate(el => el.scrollHeight);
  await page.locator('iframe').evaluate((el, height) => { el.style.height = `${height}px`; }, westHeight);
  await proof.screenshot({ path: `tools/room-design/examination-layout/evidence/${name}-west.png` });
  await page.close();
}
await browser.close();
