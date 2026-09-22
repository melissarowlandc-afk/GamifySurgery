import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from 'playwright';

// Independent acceptance checks of delivered coordinates and rendered paths.
// This does not import the worker's generator or validator or load game content.
const repo = path.resolve(import.meta.dirname, '../../..');
const at = p => path.resolve(repo, p);
const out = p => path.join(import.meta.dirname, `parent-${p}`);
const fitPath = at('docs/features/character-movement/patient-01-north-south-fit.json');
const htmlPath = at('docs/features/character-movement/patient-01-north-south-walk.html');
const displayPath = 'C:/Users/Kyle Kent/.codex/visualizations/2026/09/10/01a08bf5-7fc2-7572-8909-8fbc532daecd/patient-01-north-south-walk.html';
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const loadedHashes = {fit:sha(fitPath),preview:sha(htmlPath)};
const fit = JSON.parse(fs.readFileSync(fitPath, 'utf8'));
const fragment = fs.readFileSync(htmlPath, 'utf8');
const failures = [], errors = [], network = [], screenshots = [];
let assertions = 0;
function check(ok, message) { assertions++; if (!ok) failures.push(message); }
function near(a,b,message,tolerance=.003) { check(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a-b)<=tolerance, `${message}: ${a} vs ${b}`); }
const distance3 = (a,b) => Math.hypot(a.lateral-b.lateral,a.forward-b.forward,a.height-b.height);
const distance2 = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
const segments = [['hip','knee','thigh'],['knee','ankle','shin'],['shoulder','elbow','upperArm'],['elbow','wrist','forearm'],['wrist','hand','hand']];
const points = ['hip','knee','ankle','shoulder','elbow','wrist','hand','contact','heel','toe'];
const scale = fit.registration.commonIsotropicScale;
const vScale = fit.rig.projection.verticalScale;
const project = (p,view) => ({x:64+(view==='south'?-1:1)*p.lateral,y:181-vScale*p.height+(view==='south'?1:-1)*fit.rig.projection.depthScale*p.forward});
const observations = JSON.parse(fs.readFileSync(out('source-observations.json'),'utf8'));
const baseline = JSON.parse(fs.readFileSync(out('source-baseline.json'),'utf8'));
const preserved = baseline.files.map(f=>({path:f.path,unchanged:sha(f.path)===f.sha256}));
for(const p of preserved) check(p.unchanged, `preserved ${p.path}`);
check(fragment===fs.readFileSync(displayPath,'utf8'),'identical canonical/display fragments');
check(Buffer.byteLength(fragment)<1_000_000,'fragment below 1 MB');
check(!/<!doctype|<html\b|<head\b|<body\b|<img\b|<image\b|data:image|fetch\s*\(|XMLHttpRequest|WebSocket|localStorage|sessionStorage/i.test(fragment),'no document wrapper, raster, network, or storage dependency');
check(fit.phases.length===8,'eight explicit phases');
near(scale,171/898,'fixed registration scale');
check(!fit.registration.equation.includes('viewFacingSign'),'image registration does not mirror independent source views');
check(fit.rig.foot.toeHalfWidth*2+fit.rig.foot.shoeStrokeWidth>=19 && fit.rig.foot.toeHalfWidth*2+fit.rig.foot.shoeStrokeWidth<=22,'boots retain observed registered width');

for(const [view,key] of [['south','southFront'],['north','northBack']]) {
  const source=fit.sources[key], axis=fit.registration.sourceAxisByView[key];
  check(sha(at(source.path))===source.sha256,`${view} original checksum`);
  check(JSON.stringify(source.alphaBBoxExclusive)===JSON.stringify(observations.views[view].bboxExclusive),`${view} independently measured alpha`);
  check(new Set(fit.phases.map(p=>JSON.stringify(p[view].frame.joints))).size===8,`${view} eight distinct frames`);
  for(const phase of fit.phases) {
    const g=phase[view], f=g.frame, l=g.latent, native=g.nativeMaster, tag=`${view} pose ${phase.index}`;
    check(g.anatomicalRightScreenSide===(view==='south'?'left':'right'),`${tag} anatomical right screen side`);
    for(const pointName of ['axisBottom','headCenter','shoulderCenter']) {
      near(f.body[pointName].x,64,`${tag} ${pointName} stable centerline`);
      const expected=project(l.body[pointName],view);
      near(f.body[pointName].y,expected.y,`${tag} ${pointName} projection`);
    }
    const baselineBody=fit.phases[0][view].frame.body;
    near(f.body.headCenter.y-baselineBody.headCenter.y,-vScale*l.phaseBob,`${tag} small vertical body rise`);
    check(vScale*l.phaseBob<=4.1,`${tag} modest bob`);
    for(let i=0;i<f.body.torso.length;i++) {
      near(f.body.torso[i].x,baselineBody.torso[i].x,`${tag} torso width/axis fixed ${i}`);
      near(f.body.torso[i].y-baselineBody.torso[i].y,-vScale*l.phaseBob,`${tag} rigid torso rise ${i}`);
    }
    near(f.body.headEnvelope.radiusX,18,`${tag} head width`);
    near(f.body.headEnvelope.radiusY,22,`${tag} head height`);
    near(native.body.headEnvelope.radiusX*scale,f.body.headEnvelope.radiusX,`${tag} native head x radius units`);
    near(native.body.headEnvelope.radiusY*scale,f.body.headEnvelope.radiusY,`${tag} native head y radius units`);
    near(native.body.shoulderY,941+(f.body.shoulderY-181)/scale,`${tag} native shoulder Y units`);
    near(native.projectedUpwardBobSourcePixels*scale,vScale*l.phaseBob,`${tag} native projected bob units`);
    for(const side of ['left','right']) {
      const j=l.joints[side],p=f.joints[side],nj=native.joints[side],lane=side==='right'?10:-10;
      for(const [a,b,len] of segments) near(distance3(j[a],j[b]),fit.rig.segmentLengths3D[len],`${tag} ${side} fixed 3D ${len}`);
      for(const name of ['hip','ankle','contact','heel','toe']) near(j[name].lateral,lane,`${tag} ${side} fixed ${name} lane`);
      check(Math.abs(j.knee.lateral-lane)<1,`${tag} ${side} knee stays inside lane`);
      // The sagittal knee bends toward the front of the body, not backward.
      const t=(j.hip.height-j.knee.height)/(j.hip.height-j.ankle.height);
      const kneeForward=j.knee.forward-(j.hip.forward+t*(j.ankle.forward-j.hip.forward));
      check(kneeForward>=-.004,`${tag} ${side} forward knee bend`);
      for(const name of points) {
        const expected=project(j[name],view);
        near(p[name].x,expected.x,`${tag} ${side} ${name} projected x`);
        near(p[name].y,expected.y,`${tag} ${side} ${name} projected y`);
        near(nj[name].x,axis+(p[name].x-64)/scale,`${tag} ${side} ${name} native x`);
        near(nj[name].y,941+(p[name].y-181)/scale,`${tag} ${side} ${name} native y`);
        check(p[name].x>=0 && p[name].x<=128 && p[name].y>=0 && p[name].y<=192,`${tag} ${side} ${name} in frame`);
        check(nj[name].x>=0 && nj[name].x<=448 && nj[name].y>=0 && nj[name].y<=1024,`${tag} ${side} ${name} in native canvas`);
      }
      near(p.projectedFootLiftY,vScale*j.footLift,`${tag} ${side} projected frame lift`);
      near(nj.projectedFootLiftY*scale,p.projectedFootLiftY,`${tag} ${side} native projected lift`);
      near(p.projectedGround.contact.y-p.contact.y,p.projectedFootLiftY,`${tag} ${side} contact lift above projected ground`);
      for(const name of ['contact','heel','toe']) {
        const ground=project({...j[name],height:0},view);
        near(p.projectedGround[name].y,ground.y,`${tag} ${side} ${name} ground depth`);
        const renderName='render'+name[0].toUpperCase()+name.slice(1);
        near(p[renderName].y+fit.rig.foot.shoeStrokeWidth/2,p[name].y,`${tag} ${side} ${name} rendered sole edge`);
        check(p[name].y<=ground.y+.003,`${tag} ${side} no ground penetration ${name}`);
      }
      if(phase.index===3 || phase.index===7) {
        const support=phase.index===3?'right':'left';
        for(const name of ['elbow','wrist','hand']) near(j[name].forward,0,`${tag} ${side} ${name} arm down`,.006);
        if(side===support) {
          check(phase.support===side && j.support,`${tag} support identity`);
          near(distance3(j.hip,j.ankle),66,`${tag} support leg straight`);
          near(j.footLift,0,`${tag} support planted`);
        } else {
          check(!j.support && j.footLift>0,`${tag} passing foot raised`);
          check(distance3(j.hip,j.ankle)<65 && kneeForward>8,`${tag} passing knee articulated`);
          near(j.ankle.forward,0,`${tag} passing ankle under hip in depth`);
        }
      }
    }
    for(const kind of ['leg','arm']) {
      const key=kind==='leg'?'legsFarToNear':'armsFarToNear';
      const order=g.visibility[key], scores=g.visibility.depthScores;
      check(scores[order[0]][kind]<=scores[order[1]][kind],`${tag} ${kind} depth order`);
    }
    if(phase.index===1 || phase.index===5) {
      const lead=phase.index===1?'right':'left',opposite=lead==='right'?'left':'right';
      check(l.joints[lead].ankle.forward>=24 && l.joints[opposite].ankle.forward<=-24,`${tag} full opposite leg stride`);
      check(l.joints[opposite].wrist.forward>=22 && l.joints[lead].wrist.forward<=-22,`${tag} opposing arms`);
    }
    if(phase.index%2===0) for(const side of ['left','right']) near(Math.abs(l.joints[side].ankle.forward),12,`${tag} ${side} intermediate step depth`);
  }
}
for(const phase of fit.phases) check(JSON.stringify(phase.south.latent)===JSON.stringify(phase.north.latent),`phase ${phase.index} same anatomical gait in both views`);

const css=fs.readFileSync('C:/Users/Kyle Kent/.codex/plugins/cache/openai-bundled/visualize/1.0.32/skills/visualize/assets/visualize.css','utf8');
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
  for(const [width,theme,poseIndexes] of [[736,'light',[0,1,2,3,4,5,6,7]],[320,'light',[2]],[736,'dark',[6]]]) {
    const context=await browser.newContext({viewport:{width,height:1050},colorScheme:theme,reducedMotion:'reduce'});
    await context.route('**/*',route=>{network.push(route.request().url());return route.abort();});
    const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
    const wrapped=`<style>${css}html>body{margin:0;padding:0}</style>${fragment}`;
    await page.setContent(`<style>body{margin:0}iframe{display:block;width:100%;height:1000px;border:0}</style><iframe sandbox="allow-scripts" srcdoc="${escape(wrapped)}"></iframe>`);
    const frame=page.frames().find(f=>f.parentFrame());
    await frame.waitForSelector('svg[data-view] path',{state:'attached'});
    const root=frame.locator('#gs012-patient-01-ns');
    check(await root.getAttribute('data-playing')==='false',`${width} ${theme} reduced motion starts paused`);
    for(const index of poseIndexes) {
      await frame.evaluate(i=>document.getElementById('gs012-patient-01-ns').__patient01NorthSouth.setPose(i),index);
      await frame.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
      const rendered=await frame.evaluate(()=>Array.from(document.querySelectorAll('svg[data-view]')).map(svg=>({view:svg.dataset.view,box:svg.viewBox.baseVal.width,geometry:svg.__gs012Geometry,paths:Array.from(svg.querySelectorAll('[data-side][data-segment]')).map(p=>({side:p.dataset.side,segment:p.dataset.segment,length:p.getTotalLength(),d:p.getAttribute('d'),strokeWidth:parseFloat(getComputedStyle(p).strokeWidth),dash:getComputedStyle(p).strokeDasharray}))})));
      for(const r of rendered) {
        const g=fit.phases[index][r.view];
        check(JSON.stringify(r.geometry)===JSON.stringify(g),`render ${width} ${theme} ${r.view} pose ${index+1} matches data`);
        const legOrder=r.paths.filter(p=>p.segment==='thigh').map(p=>p.side);
        const armOrder=r.paths.filter(p=>p.segment==='upper-arm').map(p=>p.side);
        check(JSON.stringify(legOrder)===JSON.stringify(g.visibility.legsFarToNear),'rendered leg order matches camera depth');
        check(JSON.stringify(armOrder)===JSON.stringify(g.visibility.armsFarToNear),'rendered arm order matches camera depth');
        for(const p of r.paths) {
          const ab={thigh:['hip','knee'],shin:['knee','ankle'],'upper-arm':['shoulder','elbow'],forearm:['elbow','wrist'],hand:['wrist','hand']}[p.segment];
          const j=g.frame.joints[p.side];
          if(ab) near(p.length,distance2(j[ab[0]],j[ab[1]]),`rendered ${r.view} ${p.side} ${p.segment} projected length`,.01);
          if(p.side==='right') {const dash=p.dash.split(/[ ,]+/).map(parseFloat);check(dash.length>=2 && dash[1]>p.strokeWidth,'right limb round-cap dash remains visible');}
          if(p.segment==='toe-width' || p.segment==='heel-width') {
            const name=p.segment==='toe-width'?'Toe':'Heel',values=p.d.match(/-?\d+(?:\.\d+)?/g).map(Number);
            near(values[1]+p.strokeWidth/2,j[name.toLowerCase()].y,`rendered ${name} lower edge`,.01);
            check(values[1]-p.strokeWidth/2>=0 && values[1]+p.strokeWidth/2<=192,'shoe ink inside frame');
            const half=p.segment==='toe-width'?fit.rig.foot.toeHalfWidth:fit.rig.foot.heelHalfWidth;
            near(values[0]-(r.box-128)/2,j['render'+name].x-half,'rendered foot width position',.01);
          }
        }
      }
      const file=out(`pose-${index+1}-${width}-${theme}.png`);await root.screenshot({path:file});screenshots.push(file);
    }
    const layout=await frame.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,controls:Array.from(document.querySelectorAll('button')).map(e=>e.getBoundingClientRect().toJSON())}));
    check(layout.scrollWidth<=layout.width+1,`${width} ${theme} no horizontal overflow`);
    for(const rect of layout.controls) check(rect.left>=0 && rect.right<=width+1,`${width} controls in viewport`);
    await frame.evaluate(()=>document.getElementById('gs012-patient-01-ns').__patient01NorthSouth.setPose(7));
    await frame.locator('[data-action="next"]').click();check(await root.getAttribute('data-current-pose')==='1','next wraps 8 to 1');
    await frame.locator('[data-action="previous"]').click();check(await root.getAttribute('data-current-pose')==='8','previous wraps 1 to 8');
    await frame.locator('[data-action="next"]').focus();await page.keyboard.press('Enter');check(await root.getAttribute('data-current-pose')==='1','keyboard step');
    await frame.locator('[data-action="play"]').click();
    await frame.waitForFunction(()=>document.getElementById('gs012-patient-01-ns').dataset.currentPose!=='1');
    await frame.locator('[data-action="play"]').click();check(await root.getAttribute('data-playing')==='false','manual pause');
    await page.emulateMedia({reducedMotion:'no-preference'});await frame.locator('[data-action="play"]').click();
    await page.emulateMedia({reducedMotion:'reduce'});await frame.waitForFunction(()=>document.getElementById('gs012-patient-01-ns').dataset.playing==='false');
    check(true,'changing reduced-motion preference pauses playback');
    await context.close();
  }
} catch(error) {failures.push(`browser validation: ${error.stack}`);} finally {await browser.close();}
check(errors.length===0,'no browser errors');check(network.length===0,'no requests');
check(loadedHashes.fit===sha(fitPath) && loadedHashes.preview===sha(htmlPath),'source stable during validation');
const report={scope:'GS-012 independent MOV-003 numeric/vector acceptance; no final raster or runtime acceptance',at:new Date().toISOString(),pass:!failures.length,assertions,failures,errors,network,sourcePreservation:preserved,hashes:{...loadedHashes,display:sha(displayPath)},screenshots};
fs.writeFileSync(out('review.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pass:report.pass,assertions,failures,hashes:report.hashes,screenshotCount:screenshots.length},null,2));
if(failures.length)process.exitCode=1;
