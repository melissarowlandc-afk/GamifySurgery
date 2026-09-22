import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';

const repo = path.resolve(import.meta.dirname, '../../..');
const reviewRoot = path.join(repo, 'artifacts/character-movement/gs019-blue-directions/review');
const fragment = path.join(reviewRoot, 'blue-directional-walk-review.html');
const pins = JSON.parse(readFileSync(path.join(reviewRoot, 'input-pins.json')));
const sha = value => createHash('sha256').update(value).digest('hex');
const errors = [];
const check = (ok, message) => { if (!ok) errors.push(message); };
const pillowCompare = "from PIL import Image; import sys; assert Image.open(sys.argv[1]).convert('RGBA').tobytes() == Image.open(sys.argv[2]).convert('RGBA').tobytes()";
check(existsSync(fragment), 'review fragment exists');
const source = readFileSync(fragment, 'utf8');
check(Buffer.byteLength(source) < 1_000_000, 'fragment under 1MB');
check(sha(source) === pins.review.sha256, 'review hash pin');
for (const set of [pins.inputs.eastManifest, pins.inputs.northSouthManifest, ...Object.values(pins.inputs.standing), ...Object.values(pins.frames).flatMap(group => Object.values(group))]) check(sha(readFileSync(path.join(repo, set.file))) === set.sha256, `input pin ${set.file}`);
for (const [direction, encoded] of Object.entries(pins.losslessWebp)) {
  const sourceFiles = [pins.inputs.standing[direction], ...Object.values(pins.frames[direction])];
  const encodedFiles = [encoded.standing, ...Object.values(encoded.frames)];
  for (let index = 0; index < sourceFiles.length; index++) {
    try { execFileSync('python', ['-c', pillowCompare, path.join(repo, sourceFiles[index].file), path.join(repo, encodedFiles[index].file)], { stdio:'pipe' }); } catch { check(false, `lossless RGBA pixels ${direction}/${index}`); }
    check(sha(readFileSync(path.join(repo, encodedFiles[index].file))) === encodedFiles[index].sha256, `lossless asset pin ${direction}/${index}`);
  }
}
const wrapper = path.join(reviewRoot, '.directional-review-validation.html');
writeFileSync(wrapper, `<meta charset="utf-8"><main>${source}</main>`);
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await chromium.launch({ headless:true, executablePath: existsSync(chrome) ? chrome : undefined });
const page = await browser.newPage({ viewport:{ width:736, height:1600 } });
const browserErrors=[]; page.on('pageerror', error=>browserErrors.push(error.message));
await page.goto('file:///' + wrapper.replaceAll('\\','/'));
await page.waitForFunction(() => !document.querySelector('#gs019-directional-play').disabled);
const before = await page.locator('#gs019-directional-status').textContent();
check(before.includes('Paused'), 'initial paused');
check(await page.locator('.gs019-game').count() === 3, 'three actual-size canvases');
check(await page.locator('.gs019-native').count() === 6, 'six native canvases');
check(await page.locator('.gs019-phase').count() === 8, 'eight phase controls');
check(await page.locator('.gs019-phase canvas').count() === 24, '24 phase thumbnails');
check(await page.locator('.gs019-phase:disabled').count() === 0, 'phase controls enabled after image decode');
for (const label of ['East', 'North', 'South']) check((await page.locator('body').textContent()).includes(label), `${label} label`);
for (const id of ['east','north','south']) { const pixels=await page.locator('#gs019-game-'+id).evaluate(canvas => [...canvas.getContext('2d').getImageData(0,0,32,64).data].some((value,index)=>index%4===3&&value)); check(pixels, `${id} game canvas nonblank`); }
await page.locator('#gs019-directional-phase').fill('8');
check((await page.locator('#gs019-directional-phase-output').textContent()).trim()==='08', 'phase scrub updates');
await page.locator('#gs019-directional-play').click(); await page.waitForTimeout(220); check((await page.locator('#gs019-directional-status').textContent()).includes('Playing'), 'playback starts'); await page.locator('#gs019-directional-play').click();
const desktop = await page.evaluate(() => ({ scrollWidth:document.documentElement.scrollWidth, clientWidth:document.documentElement.clientWidth })); check(desktop.scrollWidth <= desktop.clientWidth, '736 no horizontal overflow');
const desktopNative = await page.locator('.gs019-native').evaluateAll(canvases => canvases.every(canvas => { const box=canvas.getBoundingClientRect(); return Math.abs(box.height / box.width - 2) < .02; })); check(desktopNative, '736 native canvases retain 1:2 ratio');
await page.setViewportSize({ width:320, height:1800 }); await page.waitForTimeout(100);
const narrow = await page.evaluate(() => ({ scrollWidth:document.documentElement.scrollWidth, clientWidth:document.documentElement.clientWidth })); check(narrow.scrollWidth <= narrow.clientWidth, '320 no horizontal overflow');
const narrowNative = await page.locator('.gs019-native').evaluateAll(canvases => canvases.every(canvas => { const box=canvas.getBoundingClientRect(); return Math.abs(box.height / box.width - 2) < .02; })); check(narrowNative, '320 native canvases retain 1:2 ratio');
await browser.close();
check(browserErrors.length === 0, 'no browser errors');
const result={ status:errors.length?'FAIL':'PASS', errors, metrics:{ fragmentBytes:Buffer.byteLength(source), directions:3, frames:24, browserErrors } };
writeFileSync(path.join(reviewRoot,'validation.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
if(errors.length) process.exitCode=1;
