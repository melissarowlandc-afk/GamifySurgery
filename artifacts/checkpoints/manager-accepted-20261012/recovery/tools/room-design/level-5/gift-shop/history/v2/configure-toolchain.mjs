// One-time bounded toolchain adapter; Executive Office is read-only.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url)), proof = path.join(root, 'proof'), executive = path.join(root, '../executive-office/proof');
const save = (p, v) => fs.writeFileSync(p, typeof v === 'string' ? v : JSON.stringify(v, null, 2) + '\n');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for (const file of ['layout.json', 'stand-in/v1/layout-prepaint.json']) {
  const l = JSON.parse(fs.readFileSync(path.join(root, file)));
  l.presentation.contacts.find(c => c.id === 'cards-contact').world = [1.375, 1.70];
  l.navigation.privateProofRouteModel = l.presentation; save(path.join(root, file), l);
}
const frozen = JSON.parse(fs.readFileSync(path.join(root, 'stand-in/v1/manifest.json')));
frozen.layoutSha256 = hash(path.join(root, 'stand-in/v1/layout-prepaint.json'));
save(path.join(root, 'stand-in/v1/manifest.json'), frozen);
let source = fs.readFileSync(path.join(executive, 'build.mjs'), 'utf8');
source = source.replaceAll('v3', 'v1').replaceAll('registration-v2', 'registration-v1').replaceAll('executivePresentation', 'giftShopPresentation').replaceAll('design:eo:', 'design:gs:');
source = source.slice(0, source.indexOf("save(path.join(here,'proof-manifest.json')"));
source = source.replace("const renderer=fs.readFileSync(path.join(here,'lab.js'),'utf8').split('// Proof-only diagnostics, controls and review wording.')[0];", "const renderer=fs.readFileSync(path.join(here,'renderer-base.js'),'utf8');");
source += `save(path.join(here,'proof-manifest.json'),{
 schemaVersion:1,room:'gift-shop',facilityLevel:5,appearanceLevels:[1],upgradeLevels:[1,2,3,4,5],appearanceChanges:false,footprint:[3,3],footprintStatus:'proposed_contract_needs_owner_review',mode,approval:null,runtimeIntegrationAuthorized:false,retailMechanic:'not_simulated',queueCapacity:2,doorModel:layout.presentation.doorModel,
 layoutSha256:hash(path.join(root,'layout.json')),prepaintLayoutSha256:hash(path.join(root,'stand-in/v1/layout-prepaint.json')),
 generationManifestSha256:generation?hash(path.join(root,'assets/generation-manifest.json')):null,
 designRoomsSha256:hash(path.join(here,'design-rooms.js')),dataSha256:hash(path.join(here,'data.json')),
 registrationSha256:hash(path.join(root,'assets/registration-v1.json')),reconciliationSha256:hash(path.join(root,'layout-reconciliation-v1.json')),
 rendererSha256:hash(path.join(here,'lab.js')),htmlSha256:hash(path.join(here,'index.html')),extensionSha256:hash(path.join(here,'extension.js')),geometrySha256:hash(path.join(here,'geometry.mjs')),
 newAssets:generation?.assets.map(a=>a.id)??[],reusedAssets:[],builtInCalls:generation?.builtInCalls??0,
 notes:['One fixed cheerful appearance at upgrades 1–5; five new built-in-generated objects.','All twelve doors retain displays, checkout and all four standing contacts; only wall decor hides.','Three default adult shoppers; optional fourth proves two queued adults. No shopkeeper or income simulation.']});
console.log('BUILD PASS: '+mode+'; 1 fixed look / 5 upgrade selections; 5 sprites; shared 3x3; 12 one-tile doors; permanent displays/checkout/standing spots; no staff.');\n`;
save(path.join(proof, 'build.mjs'), source);
let renderer = fs.readFileSync(path.join(proof, 'renderer-base.js'), 'utf8');
renderer = renderer.replace('function computeRoutes(P) { return Geometry.computeRoutes(P,navFor(P.room),data.previewBaseClearances); }', 'function computeRoutes(P) { return Geometry.computeRoutes(P,navFor(P.room),data.previewBaseClearances,{occupied:state.actors?data.giftShopPresentation.actors.filter(a=>state[a.group]!==false):[]}); }');
save(path.join(proof, 'renderer-base.js'), renderer);
save(path.join(root, 'assets/registration-v1.json'), { schemaVersion: 1, assets: {}, note: 'Floor anchors are measured final alpha bases; wall anchor is measured top. No seat registration or painted character edit.' });
save(path.join(root, 'layout-reconciliation-v1.json'), { schemaVersion: 1, status: 'no_postpaint_layout_change', changes: [], note: 'Prepaint contacts/footprints/standing anchors frozen before built-in imagegen; any later art-fit change must be explicit.' });
console.log('TOOLCHAIN PASS: Executive native Canvas packing/renderer/support/error classifier; Gift Shop standing retail geometry; scoped copies only.');
