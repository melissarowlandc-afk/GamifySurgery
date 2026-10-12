// Same Executive browser QA pattern; served hashes, real controls, Canvas, routes, keyboard and 320px.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), assert = require('node:assert/strict');
const { chromium } = require('@playwright/test'), { listen } = require('./browser-errors.cjs');
const here = __dirname, out = path.join(here, 'evidence/v2'), url = process.env.GIFT_SHOP_PROOF_URL || 'http://127.0.0.1:4191/tools/room-design/level-5/gift-shop/proof/index.html';
const doors = ['N1', 'N2', 'N3', 'S1', 'S2', 'S3', 'WA', 'WB', 'WC', 'EA', 'EB', 'EC'], north = ['N1', 'N2', 'N3'];
(async () => {
  fs.mkdirSync(out, { recursive: true }); const manifestBytes = fs.readFileSync(path.join(here, 'proof-manifest.json')), manifest = JSON.parse(manifestBytes), proofManifestSha256 = crypto.createHash('sha256').update(manifestBytes).digest('hex');
  assert.equal(manifest.mode, 'painted'); assert.equal(manifest.approval, null); assert.deepEqual(manifest.footprint, [3, 3]); assert.equal(manifest.appearanceChanges, false);
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } }), events = listen(page), checks = [], technical = [];
    assert.equal((await page.goto(url)).status(), 200); const ready = () => page.waitForFunction(() => document.body.dataset.ready === '1'); await ready();
    const servedHash = file => page.evaluate(async f => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', await (await fetch(f)).arrayBuffer())), b => b.toString(16).padStart(2, '0')).join(''), file);
    assert.equal(await servedHash('./proof-manifest.json'), proofManifestSha256); assert.equal(await servedHash('./lab.js'), manifest.rendererSha256); assert.equal(await servedHash('./index.html'), manifest.htmlSha256); assert.equal(await servedHash('./geometry.mjs'), manifest.geometrySha256); assert.equal(await servedHash('./design-rooms.js'), manifest.designRoomsSha256);
    const inspect = () => page.evaluate(() => {
      const L = window.__lab, room = L.rooms.get('gift-shop'), P = { room, doors: L.state.doors, backed: L.state.backed, ox: 0, oy: 0 };
      return { origin: location.origin, tier: room.tierLevel, state: { ...L.state, doors: [...L.state.doors], backed: [...L.state.backed] }, visible: room.records.filter(r => L.recordVisible(r, P)).map(r => r.id), actors: L.state.actors ? L.actorPlacements(P).map(a => ({ id: a.id, characterId: a.characterId, pose: a.pose, direction: a.direction })) : [], check: L.check('gift-shop', [...L.state.doors], [...L.state.backed]), overflow: document.documentElement.scrollWidth > innerWidth };
    });
    const expectedActors = [
      { id: 'browse', characterId: 'patient.adult.007', pose: 'stand', direction: 'north' },
      { id: 'pay', characterId: 'patient.adult.001', pose: 'stand', direction: 'north' },
      { id: 'queue1', characterId: 'patient.adult.004', pose: 'stand', direction: 'east' },
    ];
    assert.equal(await page.locator('#tierButtons button').count(), 5); assert.equal(await page.locator('#doorGrid button').count(), 12); assert.equal(await page.locator('#backedChips button').count(), 3); assert.deepEqual((await page.locator('#doorGrid button').allTextContents()).sort(), doors.slice().sort()); checks.push('Served code/manifest pinned; five fixed-look selections, twelve one-tile doors, three north backing controls');
    for (let level = 1; level <= 5; level++) {
      await page.click('#tier' + level); await ready(); const initial = await inspect(); assert.equal(initial.origin, new URL(url).origin); assert.equal(initial.tier, level); assert.equal(await page.locator('#tier' + level).getAttribute('aria-pressed'), 'true'); assert.deepEqual(initial.actors, expectedActors);
      const result = await page.evaluate(async () => {
        const L = window.__lab, room = L.rooms.get('gift-shop'), segments = L.roomSegments(room), north = ['N1', 'N2', 'N3'], failures = [], assets = [], contacts = []; let states = 0, routes = 0, fullQueueStates = 0, fullQueueRoutesTotal = 0;
        const cases = [[], ...segments.map(s => [s]), ...segments.flatMap((d, i) => segments.slice(i + 1).map(e => [d, e])), segments];
        L.state.queueTwo = true;
        for (let mask = 0; mask < 8; mask++) for (const open of cases) {
          const backing = north.filter((_, i) => mask & (1 << i)), c = L.check('gift-shop', open, backing); states++; routes += c.routes; if (c.unreachable.length || c.conflicts.length || c.doorZone.length) failures.push({ open, mask, c });
          const full = L.computeRoutes({ room, doors: new Set(open), backed: new Set(backing), ox: 0, oy: 0 }); fullQueueStates++; fullQueueRoutesTotal += full.length;
          if (full.some(r => !r.path)) failures.push({ open, backing, fullQueue: full.filter(r => !r.path).map(r => r.target.id) });
        }
        L.state.queueTwo = false;
        for (const [id, s] of Object.entries(L.assets)) {
          const m = L.metadata.assets[s.preparedId], im = new Image(); im.src = s.src; await im.decode(); if (im.naturalWidth !== m.canvas[0] || im.naturalHeight !== m.canvas[1]) failures.push('Canvas size ' + id);
          const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(im, 0, 0); const p = g.getImageData(0, 0, c.width, c.height).data; let edge = 0, zero = 0;
          for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) { const a = p[(y * c.width + x) * 4 + 3]; if (!a) zero++; if (!x || !y || x === c.width - 1 || y === c.height - 1) edge = Math.max(edge, a); }
          if (edge || !zero) failures.push('Alpha ' + id);
          const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', await (await fetch(s.src)).arrayBuffer())), b => b.toString(16).padStart(2, '0')).join(''); if (hash !== m.outputSha256) failures.push('Served sprite hash ' + id); assets.push(id);
        }
        const P = { room, doors: new Set(), backed: new Set(), ox: 80, oy: 160 }, draw = await L.collectDrawables(P, true), backed = await L.collectDrawables({ ...P, backed: new Set(north) }, true), sorted = [...draw.sorted].sort((a, b) => a.py - b.py);
        for (const id of ['flowers', 'plushShelf', 'cardRack', 'checkout']) { const x = [...draw.wall, ...draw.sorted].find(d => d.id === id), y = [...backed.wall, ...backed.sorted].find(d => d.id === id); if (!y || ['x', 'y', 'w', 'h'].some(k => x[k] !== y[k]) || y.clipTop !== undefined) failures.push('Full-height floor item ' + id); }
        for (const a of L.actorPlacements(P)) {
          const fit = L.data.giftShopPresentation.actors.find(f => f.supportId === a.id), pose = L.data.characters.find(c => c.id === a.characterId).poses.stand[a.direction];
          if (a.pose !== 'stand' || Math.abs(a.x + fit.floorContactSource[0] * fit.sourceScale - (P.ox + fit.ground[0] * 120)) > 1e-7 || Math.abs(a.y + fit.floorContactSource[1] * fit.sourceScale - (P.oy + fit.ground[1] * 120)) > 1e-7) failures.push('Standing floor anchor ' + a.id);
          const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', await (await fetch('../../../../../apps/player/public/' + pose.url)).arrayBuffer())), b => b.toString(16).padStart(2, '0')).join(''); if (hash !== pose.sha256) failures.push('Unchanged approved still ' + a.id); contacts.push(a.id);
        }
        for (const [id, fixture] of [['browse', 'plushShelf'], ['pay', 'checkout']]) if (!(sorted.findIndex(d => d.id === fixture) < sorted.findIndex(d => d.id === id))) failures.push('Standing painter order ' + id);
        Object.assign(L.state, { queueTwo: true, doors: new Set(segments) }); const fullP = { ...P, doors: L.state.doors }, occupiedRoutes = L.computeRoutes(fullP); if (occupiedRoutes.some(r => !r.path)) failures.push('Full queue routes');
        Object.assign(L.state, { queueTwo: false, doors: new Set() });
        return { states, routes, assets, contacts, fullQueueStates, fullQueueRoutesTotal, fullQueueRoutes: occupiedRoutes.length, failures };
      });
      assert.deepEqual(result.failures, []); assert.equal(result.states, 640); assert.equal(result.routes, 13276); assert.equal(result.assets.length, 13); assert.equal(result.fullQueueStates, 640); assert.equal(result.fullQueueRoutesTotal, 13276); assert.equal(result.fullQueueRoutes, 72); technical.push({ level, ...result });
      for (const s of doors) {
        const button = () => page.locator('#doorGrid button').filter({ hasText: new RegExp('^' + s + '$') }); await button().click(); await ready(); const c = await inspect();
        assert.deepEqual(c.state.doors, [s]); assert.equal(await button().getAttribute('aria-pressed'), 'true'); assert.deepEqual(c.actors, expectedActors); assert.equal(c.check.unreachable.length + c.check.conflicts.length + c.check.doorZone.length, 0);
        for (const id of ['flowers', 'plushShelf', 'cardRack', 'checkout']) assert.ok(c.visible.includes(id)); assert.equal(c.visible.includes('wallArt'), s !== 'N2'); assert.equal(c.visible.includes('mugShelf'), s !== 'N3');
        const expectedVisible = await page.evaluate(open => window.__lab.rooms.get('gift-shop').records.filter(r => !r.doorOwners.includes(open)).map(r => r.id), s); assert.deepEqual(c.visible, expectedVisible);
        await button().click(); await ready(); assert.deepEqual((await inspect()).visible, initial.visible);
      }
      checks.push('Upgrade ' + level + ': route pairs/backing/full queue, alpha and sprite/still hashes, standing contacts/layers, necessary furniture retained and optional owners honoured');
    }
    for (const [id, key, count] of [['allDoors', 'doors', 12], ['allDoors', 'doors', 12], ['closeDoors', 'doors', 0], ['allBacked', 'backed', 3], ['allBacked', 'backed', 3], ['clearBacked', 'backed', 0]]) { await page.click('#' + id); await ready(); assert.equal((await inspect()).state[key].length, count); assert.deepEqual((await inspect()).actors, expectedActors); } checks.push('Bulk controls idempotent; standing shoppers retained');
    for (const s of north) { await page.locator('#backedChips button').filter({ hasText: new RegExp('^' + s + '$') }).click(); await ready(); for (const id of ['flowers', 'plushShelf', 'cardRack', 'checkout']) assert.ok((await inspect()).visible.includes(id)); } assert.ok(!(await inspect()).visible.includes('wallArt')); assert.ok(!(await inspect()).visible.includes('mugShelf')); await page.click('#clearBacked'); await ready(); checks.push('Independent north backing; wall print and mugs/candles shelf hide');
    for (const id of ['tgBrowser', 'tgPayer', 'tgQueue1']) { await page.uncheck('#' + id); await ready(); assert.equal((await inspect()).actors.length, 2); await page.check('#' + id); await ready(); assert.deepEqual((await inspect()).actors, expectedActors); }
    await page.check('#tgQueue2'); await ready(); assert.equal((await inspect()).actors.length, 4); await page.uncheck('#tgActors'); await ready(); assert.equal((await inspect()).actors.length, 0); await page.check('#tgActors'); await ready(); assert.equal((await inspect()).actors.length, 4); checks.push('Four independent standing shoppers / full queue / all occupancy');
    await page.click('#allDoors'); await ready(); await page.click('#allBacked'); await ready(); await page.check('#tgContacts'); await ready(); await page.click('#tier3'); await ready(); const preserved = await inspect(); assert.equal(preserved.state.doors.length, 12); assert.equal(preserved.state.backed.length, 3); assert.equal(preserved.state.contacts, true); assert.equal(preserved.actors.length, 4); checks.push('Upgrade selection preserves inspection, full queue and doors');
    await page.locator('h1').click(); await page.keyboard.press('Escape'); await ready();
    for (let n = 1; n <= 5; n++) { await page.keyboard.press(String(n)); await ready(); assert.equal((await inspect()).state.tier, n); }
    await page.keyboard.press('ArrowRight'); await ready(); assert.equal((await inspect()).state.tier, 1); await page.keyboard.press('ArrowLeft'); await ready(); assert.equal((await inspect()).state.tier, 5); await page.keyboard.press('Escape'); await ready();
    for (const [key, state] of [['g', 'grid'], ['r', 'routes'], ['a', 'actors'], ['p', 'payers'], ['v', 'browsers'], ['q', 'queueOne'], ['w', 'queueTwo'], ['c', 'contacts'], ['f', 'bases']]) { const before = (await inspect()).state[state]; await page.keyboard.press(key); await ready(); assert.equal((await inspect()).state[state], !before); await page.keyboard.press(key); await ready(); assert.equal((await inspect()).state[state], before); }
    await page.keyboard.press('d'); await ready(); assert.equal((await inspect()).state.doors.length, 12); await page.keyboard.press('b'); await ready(); assert.equal((await inspect()).state.backed.length, 3); await page.keyboard.press('Escape'); await ready();
    await page.locator('#allDoors').focus(); await page.keyboard.press('Space'); await ready(); assert.equal((await inspect()).state.doors.length, 12); await page.locator('#closeDoors').focus(); await page.keyboard.press('Enter'); await ready(); assert.equal((await inspect()).state.doors.length, 0); checks.push('Keyboard numbers/arrows/diagnostics/queue/reset; native Space and Enter');
    await page.evaluate(() => [1, 5, 2, 4, 3].forEach(n => document.getElementById('tier' + n).click())); await ready(); assert.equal((await inspect()).state.tier, 3); assert.ok((await page.locator('#tierHeading').textContent()).startsWith('Upgrade 3')); checks.push('Rapid selection settles on final upgrade');
    await page.setViewportSize({ width: 320, height: 900 }); await page.locator('details > summary').click(); for (let level = 1; level <= 5; level++) { await page.click('#tier' + level); await ready(); assert.equal((await inspect()).overflow, false); assert.ok(await page.locator('#canvasB').isVisible()); } checks.push('All selections at 320px, expanded necessary/optional table, no horizontal overflow'); assert.deepEqual(events.errors, []);
    fs.writeFileSync(path.join(out, 'browser-validation-report.json'), JSON.stringify({ status: 'PASS', url, origin: new URL(url).origin, proofManifestSha256, checks, technical, ...events, approval: null, runtimeIntegrationAuthorized: false }, null, 2) + '\n');
    console.log(`BROWSER VALIDATION PASS: ${checks.length} groups; 1 fixed look / 5 upgrades; 13 painted assets; 12 doors; 3200 states / 66380 routes / 66380 full-queue routes; necessary/optional visibility; standing contacts; keyboard; 320px; real page errors 0.`);
  } finally { await browser.close(); }
})().catch(e => {
  fs.mkdirSync(out, { recursive: true }); const blocked = /spawn EPERM/.test(e.stack ?? '');
  const report = { status: blocked ? 'PENDING_MANAGER' : 'FAIL', url, origin: new URL(url).origin, error: e.stack, browserStarted: false, reason: blocked ? 'Worker sandbox prevents Chrome launch; manager must rerun this exact command.' : 'See error.' };
  fs.writeFileSync(path.join(out, 'browser-validation-report.json'), JSON.stringify(report, null, 2) + '\n'); if (blocked) fs.writeFileSync(path.join(out, 'browser-launch-attempt.json'), JSON.stringify(report, null, 2) + '\n'); console.error(e.stack); process.exitCode = 1;
});
