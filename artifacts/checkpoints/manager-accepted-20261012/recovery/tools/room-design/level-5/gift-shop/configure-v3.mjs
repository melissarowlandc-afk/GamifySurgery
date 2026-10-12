// Review UI and existing Executive-derived helpers follow the current room revision.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const read = p => fs.readFileSync(path.join(root, p), 'utf8'); const save = (p, s) => fs.writeFileSync(path.join(root, p), s);
let html = read('proof/index.html');
if (!html.includes('id="conceptImage"')) {
 html = html.replace('.views{display:grid;gap:10px}', '.views{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-items:start}.concept-image{display:block;width:100%;max-width:440px;height:auto;image-rendering:pixelated;border-radius:6px}.composition-note{font-size:12px;color:#566359}@media(max-width:650px){.views{grid-template-columns:1fr}}');
 html = html.replace('A busy, cheerful self-service shop filled with flowers, balloons, plush toys, cards, snacks, magazines, mugs and candles.', 'A cohesive shop derived from one full-room concept: joined stocked walls, overlapping merchandise and an integrated checkout/display island around one aisle.');
 html = html.replace('<figure><figcaption id="tierHeading">', '<figure id="conceptFigure"><figcaption>Room-first concept · S2 entrance</figcaption><img id="conceptImage" class="concept-image" src="../concept/gift-shop-concept.png" alt="Full-room Gift Shop concept: adjoining stocked walls, overlapping flowers and plush, an integrated checkout island and one connected aisle"></figure><figure><figcaption id="tierHeading">');
 html = html.replace('<div id="artStatus"></div>', '<p class="composition-note">The concept sets fixture size and proximity. The playable version uses floor-registered pieces cut or redrawn from it; use S2 to match the concept entrance, and any wall section to inspect another doorway.</p><div id="artStatus"></div>');
 html = html.replace('The checkout, primary displays and all four standing/queue spots stay for every door.', 'The joined checkout/main display and all four standing/queue spots stay for every door.');
 html = html.replace('Optional pieces hide only for the sections listed below; wall items also hide for north backing.', 'Optional stocked fixture segments hide only for the sections listed below. Merchandise attached to those fixtures hides with them.');
 save('proof/index.html', html);
}
for (const name of ['inspect-native.mjs', 'reproduce.mjs', 'validate-controls.mjs', 'check-http.mjs', 'validate-browser.cjs', 'capture.cjs', 'audit-lane.cjs']) save('proof/' + name, read('proof/' + name).replaceAll('evidence/v2', 'evidence/v3').replaceAll('processed/v2', 'processed/v3'));
save('proof/validate-controls.mjs', read('proof/validate-controls.mjs').replace('eq(closedItems.length, 13);', 'eq(closedItems.length, 11); eq(html.includes(\'id="conceptImage"\'), true);'));
save('proof/check-http.mjs', read('proof/check-http.mjs').replace('const checks = [];', "resources.push('/tools/room-design/level-5/gift-shop/concept/gift-shop-concept.png');\nconst checks = [];"));
save('proof/reproduce.mjs', read('proof/reproduce.mjs').replace("'proof/layout-baseline.json',", "'proof/layout-baseline.json', 'proof/index.html', 'proof/extension.js', 'proof/geometry.mjs', 'concept/gift-shop-concept.png', 'assets/generation-manifest.json',"));
let br = read('proof/validate-browser.cjs');
br = br.replace("const doors =", "const expected = JSON.parse(fs.readFileSync(path.join(here, 'evidence/v3/validation-report.json')));\nconst doors =");
br = br.replace("{ id: 'browse', characterId: 'patient.adult.007', pose: 'stand', direction: 'north' }", "{ id: 'browse', characterId: 'patient.adult.007', pose: 'stand', direction: 'east' }");
br = br.replace("{ id: 'queue1', characterId: 'patient.adult.004', pose: 'stand', direction: 'east' }", "{ id: 'queue1', characterId: 'patient.adult.004', pose: 'stand', direction: 'west' }");
br = br.replaceAll("['flowers', 'plushShelf', 'cardRack', 'checkout']", "['mainIsland']");
br = br.replace("assert.equal(c.visible.includes('wallArt'), s !== 'N2'); assert.equal(c.visible.includes('mugShelf'), s !== 'N3');", '');
br = br.replace("assert.ok(!(await inspect()).visible.includes('wallArt')); assert.ok(!(await inspect()).visible.includes('mugShelf'));", "assert.deepEqual((await inspect()).visible, (await page.evaluate(() => window.__lab.rooms.get('gift-shop').records.map(r => r.id))));");
br = br.replace("checks.push('Independent north backing; wall print and mugs/candles shelf hide')", "checks.push('Independent north backing; floor fixtures retained, stock attached to optional fixtures follows their doors')");
br = br.replace("for (const [id, fixture] of [['browse', 'plushShelf'], ['pay', 'checkout']]) if (!(sorted.findIndex(d => d.id === fixture) < sorted.findIndex(d => d.id === id))) failures.push('Standing painter order ' + id);", "for (const [id, front] of [['browse', false], ['pay', true]]) if ((sorted.findIndex(d => d.id === 'mainIsland') < sorted.findIndex(d => d.id === id)) !== front) failures.push('Standing painter order ' + id);");
br = br.replace('assert.equal(result.routes, 13276)', 'assert.equal(result.routes, expected.routes / 5)').replace('assert.equal(result.assets.length, 13)', 'assert.equal(result.assets.length, 9)').replace('assert.equal(result.fullQueueRoutesTotal, 13276)', 'assert.equal(result.fullQueueRoutesTotal, expected.fullQueueRoutes / 5)').replace('assert.equal(result.fullQueueRoutes, 72)', 'assert.equal(result.fullQueueRoutes, 48)');
br = br.replace("assert.equal(await servedHash('./design-rooms.js'), manifest.designRoomsSha256);", "assert.equal(await servedHash('./design-rooms.js'), manifest.designRoomsSha256); assert.equal(await servedHash('../concept/gift-shop-concept.png'), manifest.conceptSha256); await page.locator('#conceptImage').evaluate(im => im.decode()); assert.ok(await page.locator('#conceptImage').isVisible());");
br = br.replace("assert.ok(await page.locator('#canvasB').isVisible());", "assert.ok(await page.locator('#canvasB').isVisible()); assert.ok(await page.locator('#conceptImage').isVisible());");
br = br.replace('13 painted assets; 12 doors; 3200 states / 66380 routes / 66380 full-queue routes;', '9 concept-derived sprites / 11 fixture records; concept beside playable; 12 doors; 3200 states / ${expected.routes} routes / ${expected.fullQueueRoutes} full-queue routes;');
save('proof/validate-browser.cjs', br);
console.log('V3 REVIEW TOOLS READY: concept beside playable, responsive stacked comparison, current controls/HTTP/rebuild/browser/capture paths; browser remains manager-owned.');
