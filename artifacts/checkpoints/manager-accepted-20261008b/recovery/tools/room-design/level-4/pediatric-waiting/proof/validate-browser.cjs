// MANAGER ONLY: run in the environment that can launch Chrome, with the 4191 lab server active.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { chromium } = require('@playwright/test');
const here = __dirname, out = path.join(here, 'evidence');
const url = process.env.PEDIATRIC_PROOF_URL || 'http://127.0.0.1:4191/tools/room-design/level-4/pediatric-waiting/proof/index.html';
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const errors = [], checks = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
    page.on('pageerror', e => errors.push(String(e)));
    page.on('console', m => { if (['error','warning'].includes(m.type())) errors.push(m.text()); });
    page.on('requestfailed', r => errors.push(`${r.url()} ${r.failure()?.errorText}`));
    await page.goto(url); await page.waitForFunction(() => document.body.dataset.ready === '1');
    const inspect = async () => page.evaluate(() => {
      const lab = window.__lab, room = lab.rooms.get('pediatric-waiting');
      const P = { room, doors: lab.state.doors, backed: lab.state.backed, ox: 0, oy: 0 };
      return { state: { ...lab.state, doors: [...lab.state.doors], backed: [...lab.state.backed] }, actors: lab.state.actors ? lab.actorPlacements(P).map(a => {const c=lab.data.characters.find(c=>c.id===a.characterId),fit=lab.data.pediatricPresentation.children.find(c=>c.supportId===a.id);return { id: a.id, characterId: a.characterId, group:a.group, direction:a.direction, sourceScale:a.sourceScale, category:c.category, age:c.intendedVisualAge,seatType:fit?.seatType, standingHeight:c.poses.stand.south.visibleBounds.height, py: a.py };}) : [], visible: room.records.filter(r => lab.recordVisible(r, P)).map(r => r.id), check: lab.check('pediatric-waiting', [...lab.state.doors], [...lab.state.backed]), canvas: [document.getElementById('canvasB').width, document.getElementById('canvasB').height], overflow: document.documentElement.scrollWidth > innerWidth, origin: location.origin };
    });
    const ready = async () => page.waitForFunction(() => document.body.dataset.ready === '1');
    const initial = await inspect(); assert.equal(initial.actors.length, 5); assert.equal(initial.origin, new URL(url).origin); checks.push('initial two parents / three children and correct review origin');
    const children=initial.actors.filter(a=>a.group==='children');
    assert.deepEqual(children.map(c=>[c.characterId,c.direction,c.category,c.standingHeight,c.age,c.seatType]),[['level3-roster-v2.022','east','future-pediatric-presentation',184,5,'kid-stool'],['level3-roster-v2.025','west','future-pediatric-presentation',211,9,'kid-stool'],['level3-roster-v2.029','east','future-pediatric-presentation',234,14,'ordinary-chair']]);
    assert.ok(children.every(c=>c.sourceScale===children[0].sourceScale));checks.push('ages5/9 on inward-facing stools; age14 on ordinary chair; uniform pediatric scale');
    const technical = await page.evaluate(async () => {
      const lab=window.__lab, room=lab.rooms.get('pediatric-waiting'), failures=[];
      const segments=lab.roomSegments(room), north=['N1','N2','N3','N4']; let states=0,routes=0;
      for(let mask=0;mask<16;mask++) for(const doors of [[],...segments.map(s=>[s]),segments]) {
        const backed=north.filter((_,i)=>mask&(1<<i)),result=lab.check('pediatric-waiting',doors,backed);
        if(result.unreachable.length||result.conflicts.length||result.doorZone.length)failures.push({mask,doors,result});
        states++;routes+=result.routes;
      }
      let assets=0;
      for(const [id,spec]of Object.entries(lab.assets).filter(([,a])=>a.prepared)) {
        const entry=lab.metadata.assets[spec.preparedId], image=new Image();image.src=spec.src;await image.decode();
        if(image.naturalWidth!==entry.canvas[0]||image.naturalHeight!==entry.canvas[1])failures.push('Sprite dimensions '+id);
        const c=document.createElement('canvas');c.width=image.naturalWidth;c.height=image.naturalHeight;const g=c.getContext('2d');g.drawImage(image,0,0);
        const pixels=g.getImageData(0,0,c.width,c.height).data;let opaqueBottom=-1,allTop=c.height,edge=0,transparent=0;
        for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++) {
          const a=pixels[(y*c.width+x)*4+3];if(a>=160)opaqueBottom=y;if(a)allTop=Math.min(allTop,y);else transparent++;
          if(!x||!y||x===c.width-1||y===c.height-1)edge=Math.max(edge,a);
        }
        if(edge||!transparent||entry.canvasAnchor[1] !== (entry.anchorKind==='floor'?opaqueBottom+1:allTop))failures.push('Sprite alpha/base anchor '+id);
        assets++;
      }
      const P={room,doors:new Set(),backed:new Set(),ox:0,oy:0},a=await lab.collectDrawables(P,true);
      const backedP={...P,backed:new Set(north)},b=await lab.collectDrawables(backedP,true);
      const ordered=[...a.sorted].sort((a,b)=>a.py-b.py);
      const armrests=[];
      for(const [chairId,supportId]of [['armchair','armchair'],['adultChairEastNorth','olderChildChair']]){
        const chair=ordered.find(d=>d.id===chairId&&d.kind==='fixture'),actor=ordered.find(d=>d.id===supportId&&d.kind==='actor'),front=ordered.find(d=>d.id===chairId+':front');
        if(!chair||!actor||!front||!(ordered.indexOf(chair)<ordered.indexOf(actor)&&ordered.indexOf(actor)<ordered.indexOf(front))){failures.push('Chair layering '+chairId);continue;}
        if(['x','y','w','h'].some(k=>chair[k]!==front[k]))failures.push('Front overlay registration '+chairId);
        const canvas=document.createElement('canvas');canvas.width=480;canvas.height=480;const g=canvas.getContext('2d');
        const actorImage=new Image();actorImage.src=actor.url;await actorImage.decode();g.imageSmoothingEnabled=false;g.drawImage(actorImage,actor.x,actor.y,actor.w,actor.h);const actorPixels=g.getImageData(0,0,480,480).data;
        g.clearRect(0,0,480,480);g.imageSmoothingEnabled=true;g.drawImage(front.img,...front.src,front.x,front.y,front.w,front.h);const frontPixels=g.getImageData(0,0,480,480).data;let overlap=0;
        for(let i=3;i<actorPixels.length;i+=4)if(actorPixels[i]>=250&&frontPixels[i]>=250)overlap++;
        if(overlap<20)failures.push('No real occupant/front armrest overlap '+chairId);armrests.push({chairId,overlap});
      }
      const aquariumA=[...a.wall,...a.sorted].find(x=>x.id==='aquarium'),aquariumB=[...b.wall,...b.sorted].find(x=>x.id==='aquarium');
      if(!aquariumA||!aquariumB||aquariumA.h!==aquariumB.h||aquariumA.y!==aquariumB.y||aquariumB.clipTop!==undefined)failures.push('Aquarium backing changed full-height bounds');
      return {states,routes,assets,armrests,failures};
    });
    assert.deepEqual(technical.failures,[]);assert.equal(technical.states,288);assert.equal(technical.routes,4560);assert.equal(technical.assets,7);
    checks.push('288 states / 4560 visible-target routes; seven decoded sprite alpha/anchors; full-height aquarium; armrest layers');
    for (const segment of ['N1','N2','N3','N4','S1','S2','S3','S4','WA','WB','WC','WD','EA','EB','EC','ED']) {
      const button = page.locator('#doorGrid button').filter({ hasText: new RegExp(`^${segment}$`) });
      await button.click(); await ready(); let result = await inspect();
      assert.deepEqual(result.state.doors, [segment]); assert.equal(result.check.unreachable.length + result.check.conflicts.length + result.check.doorZone.length, 0);
      if(segment==='WB'){assert.ok(!result.visible.includes('adultChairEastNorth'));assert.ok(!result.visible.includes('adultChairEastNorth:front'));assert.ok(!result.actors.some(a=>a.id==='olderChildChair'));}
      if(['WC','WD'].includes(segment)){assert.ok(!result.visible.includes('adultChairEastSouth'));assert.ok(!result.visible.includes('adultChairEastSouth:front'));}
      await button.click(); await ready(); result = await inspect(); assert.deepEqual(result.visible, initial.visible);
    }
    checks.push('all 16 individual doorway controls, routes and exact fixture restoration');
    await page.click('#allDoors'); await ready(); assert.equal((await inspect()).state.doors.length, 16);
    assert.equal(await page.locator('#doorGrid button[aria-pressed="true"]').count(),16);
    await page.click('#allDoors'); await ready(); assert.equal((await inspect()).state.doors.length,16);
    await page.click('#closeDoors'); await ready(); assert.equal((await inspect()).state.doors.length,0);assert.deepEqual((await inspect()).visible,initial.visible);
    await page.click('#allBacked'); await ready(); assert.equal((await inspect()).state.backed.length,4);
    await page.click('#clearBacked'); await ready();assert.equal((await inspect()).state.backed.length,0);assert.deepEqual((await inspect()).visible,initial.visible);
    checks.push('all four bulk buttons; idempotent open-all, chip state and exact restoration');
    for (const segment of ['N1','N2','N3','N4']) {
      await page.locator('#backedChips button').filter({ hasText: new RegExp(`^${segment}$`) }).click(); await ready();
      assert.ok((await inspect()).visible.includes('aquarium'));
    }
    assert.ok(!(await inspect()).visible.includes('animalPrints')); assert.ok(!(await inspect()).visible.includes('clock'));
    await page.click('#clearBacked'); await ready(); assert.deepEqual((await inspect()).visible, initial.visible);
    checks.push('independent backing, full-height aquarium, wall hides and restoration');
    for (const [id, count] of [['tgParents',3], ['tgChildren',2], ['tgActors',0]]) {
      await page.uncheck('#' + id); await ready(); assert.equal((await inspect()).actors.length, count);
      await page.check('#' + id); await ready(); assert.equal((await inspect()).actors.length, 5);
    }
    checks.push('parent, child and all-character toggles');
    await page.locator('h1').click();
    for (const [key, state] of [['g','grid'],['r','routes'],['a','actors'],['p','parents'],['k','children'],['c','contacts'],['f','bases']]) {
      const before = (await inspect()).state[state]; await page.keyboard.press(key); await ready(); assert.equal((await inspect()).state[state], !before);
      await page.keyboard.press(key); await ready(); assert.equal((await inspect()).state[state], before);
    }
    await page.keyboard.press('d'); await ready(); assert.equal((await inspect()).state.doors.length, 16);
    await page.keyboard.press('b'); await ready(); assert.equal((await inspect()).state.backed.length, 4);
    await page.keyboard.press('Escape'); await ready(); assert.equal((await inspect()).state.doors.length, 0); assert.equal((await inspect()).state.backed.length, 0);
    await page.locator('#allDoors').focus(); await page.keyboard.press('Space'); await ready(); assert.equal((await inspect()).state.doors.length, 16);
    await page.locator('#closeDoors').focus(); await page.keyboard.press('Enter'); await ready();
    checks.push('keyboard shortcuts, Space/Enter activation and Escape reset');
    await page.setViewportSize({ width: 320, height: 900 }); await ready();
    assert.equal((await inspect()).overflow, false);
    assert.ok(await page.locator('#canvasB').isVisible());
    const pixelCount = await page.evaluate(() => {
      const canvas = document.getElementById('canvasB'), data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
      let opaque = 0; for (let i = 3; i < data.length; i += 4) if (data[i]) opaque++; return opaque;
    });
    assert.ok(pixelCount > 10000); checks.push('320px layout without horizontal overflow; rendered pixels');
    assert.deepEqual(errors, []);
    const presentationRevision = await page.evaluate(() => window.__lab.data.pediatricPresentation.revision);
    fs.writeFileSync(path.join(out, 'browser-validation-report.json'), JSON.stringify({ status: 'PASS', presentationRevision, url, origin: new URL(url).origin, checks, technical, errors, viewport: [320,900], designApproval: false }, null, 2) + '\n');
    console.log(`BROWSER VALIDATION PASS ${checks.length} groups; 16 door controls; keyboard; 320px; errors 0`);
  } finally { await browser.close(); }
})().catch(e => { fs.mkdirSync(out, { recursive: true }); fs.writeFileSync(path.join(out, 'browser-validation-report.json'), JSON.stringify({ status: 'FAIL', url, error: e.stack }, null, 2) + '\n'); console.error(e.stack); process.exitCode = 1; });
