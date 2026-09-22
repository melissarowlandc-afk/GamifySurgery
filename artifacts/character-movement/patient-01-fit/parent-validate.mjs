import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from 'playwright';

// Independent acceptance checks: inspect the delivered data and rendered paths,
// without importing the worker generator or its validation implementation.
const repo = path.resolve(import.meta.dirname, '../../..');
const at = name => path.resolve(repo, name);
const out = name => path.join(import.meta.dirname, `parent-${name}`);
const fitPath = at('docs/features/character-movement/patient-01-fit.json');
const previewPath = at('docs/features/character-movement/patient-01-fitted-walk.html');
const displayPath = 'C:/Users/Kyle Kent/.codex/visualizations/2026/09/10/01a08bf5-7fc2-7572-8909-8fbc532daecd/patient-01-fitted-walk.html';
const fit = JSON.parse(fs.readFileSync(fitPath, 'utf8'));
const fragment = fs.readFileSync(previewPath, 'utf8');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const loadedHashes = {fit:sha(fitPath),preview:sha(previewPath)};
const failures = [], errors = [], network = [], screenshots = [];
let assertions = 0;
function check(condition, message) { assertions++; if (!condition) failures.push(message); }
function near(a, b, message, tolerance = .002) { check(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tolerance, `${message}: ${a} vs ${b}`); }
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const pointNames = ['shoulder','elbow','wrist','hand','hip','knee','ankle','shoeContact','shoeHeel','shoeToe'];
const lengths = fit.rig.segmentLengths;
const segments = [['shoulder','elbow','upperArm'],['elbow','wrist','forearm'],['wrist','hand','hand'],['hip','knee','thigh'],['knee','ankle','shin']];
const sources = JSON.parse(fs.readFileSync(out('source-baseline.json'), 'utf8'));
const sourcePreservation = sources.files.map(file => ({path:file.path, unchanged:sha(file.path) === file.sha256}));
for (const file of sourcePreservation) check(file.unchanged, `preservation ${file.path}`);
check(fs.readFileSync(displayPath, 'utf8') === fragment, 'canonical and display are identical');
check(Buffer.byteLength(fragment) < 1_000_000, 'fragment under 1 MB');
check(!/<!doctype|<html\b|<head\b|<body\b|<img\b|<image\b|data:image|fetch\s*\(|XMLHttpRequest|WebSocket|localStorage|sessionStorage/i.test(fragment), 'isolated fragment without raster assets or storage/network API');
check(fit.phases.length === 8, 'eight explicit phases');
check(new Set(fit.phases.map(p => JSON.stringify(p.east.joints))).size === 8, 'all eight joint configurations distinct');
const sourceObservations = JSON.parse(fs.readFileSync(out('source-observations.json'),'utf8'));
for (const [view, sourceKey, observedKey] of [['east','eastRightView','right'],['west','westLeftView','left']]) {
  const source = fit.sources[sourceKey];
  check(sha(at(source.path)) === source.sha256, `${view} source checksum`);
  check(JSON.stringify(source.alphaBBoxExclusive) === JSON.stringify(sourceObservations.observations[observedKey].bboxExclusive), `${view} observed alpha bounds`);
  const axis = fit.registration.sourceAxisByView[sourceKey];
  for (const pose of fit.phases) {
    const g = pose[view], sign = view === 'east' ? 1 : -1;
    const prefix = `${view} pose ${pose.index}`;
    const native = g.nativeMaster;
    check(native?.coordinateSpace === 'source448x1024', `${prefix} explicit native source coordinate space`);
    near(native.floorExclusiveEdgeY,941,`${prefix} native floor edge`);
    near(native.phaseBob*fit.registration.commonIsotropicScale,g.phaseBob,`${prefix} native bob units`);
    near(g.headEnvelope.center.y-fit.rig.centers.head.y,g.phaseBob,`${prefix} head bob is rigid translation`);
    check(g.nearSide === (view === 'east' ? 'right' : 'left'), `${prefix} near-side anatomy`);
    check(g.renderingOrder[0].startsWith(g.farSide), `${prefix} far limbs drawn first`);
    check(g.renderingOrder.at(-1).startsWith(g.nearSide), `${prefix} near limbs drawn last`);
    for (const side of ['left','right']) {
      const j = g.joints[side];
      const nj = native.joints[side];
      for (const [a,b,len] of segments) near(distance(j[a], j[b]), lengths[len], `${prefix} ${side} ${len}`);
      for (const [a,b,len] of segments) near(distance(nj[a],nj[b])*fit.registration.commonIsotropicScale,lengths[len],`${prefix} ${side} native ${len}`);
      for (const name of pointNames) {
        const q = j[name];
        check(q.x >= 0 && q.x <= 128 && q.y >= 0 && q.y <= 192, `${prefix} ${side} ${name} within target frame`);
        const masterX = axis + (q.x - 64) / fit.registration.commonIsotropicScale;
        const masterY = 941 + (q.y - 181) / fit.registration.commonIsotropicScale;
        check(masterX >= 0 && masterX <= 448 && masterY >= 0 && masterY <= 1024, `${prefix} ${side} ${name} within source canvas`);
        near(nj[name].x,masterX,`${prefix} ${side} native ${name} x`);
        near(nj[name].y,masterY,`${prefix} ${side} native ${name} y`);
      }
      near(j.shoeContact.y, 181 - j.footLift, `${prefix} ${side} contact vs lift`);
      near(nj.shoeContact.y,941-nj.footLift,`${prefix} ${side} native contact vs lift`);
      near(nj.footLift*fit.registration.commonIsotropicScale,j.footLift,`${prefix} ${side} native lift units`);
      check(j.shoeContact.y <= 181, `${prefix} ${side} no ground penetration`);
      const kneeOffset = (j.knee.x-j.hip.x) - (j.ankle.x-j.hip.x)*(j.knee.y-j.hip.y)/(j.ankle.y-j.hip.y);
      check(sign*kneeOffset >= -.002, `${prefix} ${side} knee bends forward`);
      near(g.headEnvelope.radiusX, fit.rig.envelope.headRadiusX, `${prefix} fixed head width`);
      near(g.headEnvelope.radiusY, fit.rig.envelope.headRadiusY, `${prefix} fixed head height`);
      if (pose.index === 3 || pose.index === 7) {
        for (const name of ['elbow','wrist','hand']) near(j[name].x,j.shoulder.x,`${prefix} ${side} ${name} arms down`);
        const support = pose.index === 3 ? 'right' : 'left';
        if (side === support) {
          check(j.support && pose.support === side, `${prefix} correct support identity`);
          near(distance(j.hip,j.ankle), lengths.thigh+lengths.shin, `${prefix} straight supporting leg`);
          near(j.shoeContact.y,181,`${prefix} planted foot`);
        } else {
          check(!j.support && j.footLift > 0, `${prefix} moving foot raised`);
          check(sign*kneeOffset > 2, `${prefix} passing knee visibly bent`);
          near(j.ankle.x,j.hip.x,`${prefix} foot passing below hip`);
        }
      }
    }
    if (pose.index === 1 || pose.index === 5) {
      const leg = pose.index === 1 ? 'right' : 'left', arm = leg === 'right' ? 'left' : 'right';
      check(sign*(g.joints[leg].ankle.x-g.joints[leg].hip.x) > 15, `${prefix} named leg far forward`);
      check(sign*(g.joints[arm].wrist.x-g.joints[arm].shoulder.x) > 15, `${prefix} opposite arm far forward`);
      check(sign*(g.joints[leg].wrist.x-g.joints[leg].shoulder.x) < -15, `${prefix} same-side arm back`);
    }
    if (pose.index % 2 === 0) {
      for (const side of ['left','right']) {
        const reach = Math.abs(g.joints[side].ankle.x-g.joints[side].hip.x);
        check(reach > 0 && reach < 25, `${prefix} ${side} intermediate stride reach`);
      }
    }
  }
}
for (const pose of fit.phases) {
  const swapped = fit.phases[(pose.index - 1 + 4) % 8];
  for (const side of ['left','right']) {
    const opposite = side === 'right' ? 'left' : 'right';
    for (const name of pointNames) {
      const a = pose.east.joints[side][name], b = pose.west.joints[side][name];
      near(a.x+b.x,128,`same-phase labeled reflection ${pose.index} ${side} ${name} x`);
      near(a.y,b.y,`same-phase labeled reflection ${pose.index} ${side} ${name} y`);
      const c = swapped.east.joints[opposite][name];
      const isArm = ['shoulder','elbow','wrist','hand'].includes(name);
      near(a.x-(isArm?pose.east.joints[side].shoulder.x:64), c.x-(isArm?swapped.east.joints[opposite].shoulder.x:64), `half-cycle anatomical motion ${pose.index} ${side} ${name} x`);
      near(a.y,c.y,`half-cycle anatomical motion ${pose.index} ${side} ${name} y`);
    }
    check(pose.east.joints[side].support === swapped.east.joints[opposite].support, `half-cycle support identity ${pose.index} ${side}`);
  }
}

const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
  const css=fs.readFileSync('C:/Users/Kyle Kent/.codex/plugins/cache/openai-bundled/visualize/1.0.32/skills/visualize/assets/visualize.css','utf8');
  for(const [width, theme] of [[736,'light'],[320,'light'],[736,'dark']]) {
    const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce',colorScheme:theme});
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*',r=>{network.push(r.request().url());return r.abort();});
    const doc='<style>'+css+'html>body{margin:0;padding:0}</style>'+fragment;
    const escaped=doc.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
    await page.setContent('<style>body{margin:0}</style><iframe sandbox="allow-scripts" style="border:0;width:100%;height:950px" srcdoc="'+escaped+'"></iframe>');
    const frame=page.frames().find(f=>f.parentFrame());
    await frame.waitForSelector('[data-view="east"] path',{state:'attached'});
    const root=frame.locator('#gs012-patient-01-fit');
    check(await root.getAttribute('data-playing') === 'false', `${width} ${theme} reduced-motion initial pause`);
    for(const poseIndex of [0,2,4,6]) {
      await frame.evaluate(i=>document.getElementById('gs012-patient-01-fit').__patient01Fit.setPose(i),poseIndex);
      await frame.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      const rendered=await frame.evaluate(()=>Array.from(document.querySelectorAll('svg[data-view]')).map(svg=>({view:svg.dataset.view,geometry:svg.__gs012Geometry,paths:Array.from(svg.querySelectorAll('[data-side][data-segment]')).map(p=>({side:p.dataset.side,segment:p.dataset.segment,length:p.getTotalLength(),d:p.getAttribute('d'),strokeWidth:parseFloat(getComputedStyle(p).strokeWidth),dash:getComputedStyle(p).strokeDasharray}))})));
      for(const r of rendered) {
        check(JSON.stringify(r.geometry) === JSON.stringify(fit.phases[poseIndex][r.view]), `${width} ${theme} pose ${poseIndex+1} ${r.view} renders delivered data`);
        for(const p of r.paths) {
          const key={'upper-arm':'upperArm',forearm:'forearm',hand:'hand',thigh:'thigh',shin:'shin'}[p.segment];
          if(key) near(p.length,lengths[key],`rendered ${r.view} ${p.side} ${key}`, .01);
          if(p.side==='right') {
            const dash=p.dash.split(/[ ,]+/).map(parseFloat);
            check(dash.length>1 && dash[1]>p.strokeWidth,`rendered ${p.segment} dash gap remains visible with round caps`);
          }
          if(p.segment==='sole') {
            const numbers=p.d.match(/-?\d+(?:\.\d+)?/g).map(Number);
            near(numbers[1]+p.strokeWidth/2,r.geometry.joints[p.side].shoeContact.y,`rendered sole edge contacts declared floor/lift`,.01);
          }
        }
      }
      if(width===736 || poseIndex===2) {
        const name=`pose-${poseIndex+1}-${width}-${theme}.png`;
        await root.screenshot({path:out(name)});screenshots.push(out(name));
      }
    }
    const layout=await frame.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,root:document.getElementById('gs012-patient-01-fit').getBoundingClientRect().toJSON()}));
    check(layout.scrollWidth<=layout.width+1,`${width} ${theme} no horizontal overflow`);
    await frame.evaluate(()=>document.getElementById('gs012-patient-01-fit').__patient01Fit.setPose(7));
    await frame.locator('[data-action="next"]').click();
    check(await root.getAttribute('data-current-pose')==='1', `${width} next wraps eighth to first`);
    await frame.locator('[data-action="previous"]').click();
    check(await root.getAttribute('data-current-pose')==='8', `${width} previous wraps first to eighth`);
    await frame.locator('[data-action="next"]').focus();await page.keyboard.press('Enter');
    check(await root.getAttribute('data-current-pose')==='1',`${width} keyboard stepping`);
    await frame.locator('[data-action="play"]').click();
    await frame.waitForFunction(()=>document.getElementById('gs012-patient-01-fit').dataset.currentPose!=='1');
    await frame.locator('[data-action="play"]').click();
    check(await root.getAttribute('data-playing')==='false',`${width} manual play then pause`);
    await page.emulateMedia({reducedMotion:'no-preference'});
    await frame.locator('[data-action="play"]').click();
    await page.emulateMedia({reducedMotion:'reduce'});
    await frame.waitForFunction(()=>document.getElementById('gs012-patient-01-fit').dataset.playing==='false');
    await page.close();
  }
} catch(error) { failures.push(`browser validation: ${error.stack}`); }
finally {await browser.close();}
check(errors.length===0,'zero browser runtime errors');
check(network.length===0,'zero network requests');
check(loadedHashes.fit===sha(fitPath) && loadedHashes.preview===sha(previewPath),'delivered source remained stable during independent validation');
const report={scope:'Independent Patient 01 reference acceptance; separate from final raster/owner/runtime acceptance',at:new Date().toISOString(),assertions,pass:failures.length===0,failures,errors,network,sourcePreservation,hashes:{fit:sha(fitPath),preview:sha(previewPath),display:sha(displayPath)},screenshots};
fs.writeFileSync(out('review.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pass:report.pass,assertions,failures,hashes:report.hashes,screenshotCount:screenshots.length},null,2));
if(failures.length) process.exitCode=1;
