import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createCanvas, loadImage} from '@napi-rs/canvas';
import {loadCatalog, verifyRuntimeBaseline} from './runtime-baseline.mjs';
import {repo, root, hash, rel} from './build-roster.mjs';
verifyRuntimeBaseline();
const registry = JSON.parse(readFileSync(resolve(repo, 'apps/player/src/art/characterStillRegistry.generated.json'), 'utf8'));
const byId = new Map(registry.characters.map(c => [c.id, c]));
const known = new Map();
for (const batch of ['future-roster20-v5', 'patient-demographics20-v4', 'patient-women-20-v3', 'level3-roster-v2']) {
  try {for (const c of JSON.parse(readFileSync(resolve(repo, 'tools/character-mapping', batch, 'roster.json'), 'utf8')).identities) known.set(c.stableId, c.visualBrief);} catch {}
}
const catalog = loadCatalog().filter(c => c.category === 'patient' && ['adult', 'middle_aged'].includes(c.ageBand));
const inventory = catalog.map(c => {
  const art = byId.get(c.stillId);
  const pose = art.poses.stand.south;
  const file = resolve(repo, 'apps/player/public', pose.url.replace(/^\//, ''));
  return {...c, visualBrief: known.get(c.stillId) ?? null, standSouth: {path: rel(file), sha256: hash(file), anchors: pose.anchors, visibleBounds: pose.visibleBounds}};
});
mkdirSync(resolve(root, 'comparison'), {recursive: true});
const boards = [];
for (const sex of ['Female','Male']) for (const ageBand of ['middle_aged','adult']) {
  const identities = inventory.filter(c => c.compatibleSexLabel === sex && c.ageBand === ageBand);
  const canvas = createCanvas(1100, Math.ceil(identities.length / 10) * 260 + 42), ctx = canvas.getContext('2d');
  ctx.fillStyle = '#eee9df'; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#20252b'; ctx.font = '20px sans-serif'; ctx.fillText(sex + ' ' + ageBand + ' — all ' + identities.length + ' existing patients',12,28);
  for (const [i, c] of identities.entries()) {
    const image = await loadImage(resolve(repo, c.standSouth.path));
    const b = c.standSouth.visibleBounds;
    const scale = 200 / b.height;
    const x = i%10*110, y = Math.floor(i/10)*260+42;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, x+55-(b.x+b.width/2)*scale,y+208-(b.y+b.height)*scale,image.width*scale,image.height*scale);
    ctx.fillStyle = '#20252b'; ctx.font = '9px sans-serif';
    const label = c.stillId.replace('patient.','p.').replace('patient-demographics20-v4.','v4.').replace('patient-women20-v3.','w3.').replace('future-roster20-v5.','v5.').replace('gs022-new-person-','pub.').replace('level3-roster-v2.','l3.');
    ctx.fillText(label,x+4,y+225); ctx.fillText(c.intendedAge ? 'age '+c.intendedAge : c.ageBand,x+4,y+239);
  }
  const file = resolve(root,'comparison',sex.toLowerCase()+'-'+ageBand+'-existing.png');
  writeFileSync(file, canvas.toBuffer('image/png'));
  boards.push({sex,ageBand,identities:identities.map(c=>c.stillId),file:rel(file),sha256:hash(file)});
}
writeFileSync(resolve(root,'comparison/existing-inventory.json'),JSON.stringify({schemaVersion:'patient-gapfill-v6a-existing-inventory/v1',scope:'All existing runtime patients in the four requested sex/age bands; appearance is visual only.',identities:inventory,boards},null,2)+'\n');
console.log(JSON.stringify({status:'PASS',sameBandExistingPatients:inventory.length,bands:boards.map(b=>({sex:b.sex,ageBand:b.ageBand,identities:b.identities.length}))}));
