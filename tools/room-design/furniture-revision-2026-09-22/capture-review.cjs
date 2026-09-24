const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const root = path.resolve(__dirname, '../../..');
const output = 'C:/Users/rowla/.codex/visualizations/2026/09/22/01a0ca1d-9c4b-7921-847b-5a7b20244b12/furniture-revision-review.html';
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const rooms = [
  { id: 'front-desk', label: 'Front Desk', current: 'front-desk-layout/front-desk-layout.html', candidate: 'front-desk-candidate.html', ready: 'window.__frontDeskLayout?.atlasReady()', canvas: '#fd-art', overlay: '#fd-show-footprints' },
  { id: 'xray', label: 'X-ray', current: 'xray-layout/xray-layout.html', candidate: 'xray-candidate.html', ready: 'window.__xrayLayout?.ready()', canvas: '#xray-art', overlay: '#xray-overlay' },
  { id: 'ct', label: 'CT', current: 'ct-layout/ct-layout.html', candidate: 'ct-candidate.html', ready: 'window.__ctLayout?.ready()', canvas: '#ct-art', overlay: '#ct-overlay' },
  { id: 'endoscopy-south', label: 'Endoscopy South', current: 'endoscopy-layout/endoscopy-layout.html', candidate: 'endoscopy-candidate.html', ready: 'window.__endoscopyProof?.ready()', canvas: '#endoscopy-art', overlay: '#endoscopy-overlay', orientation: 'south' },
  { id: 'endoscopy-east', label: 'Endoscopy East', current: 'endoscopy-layout/endoscopy-layout.html', candidate: 'endoscopy-candidate.html', ready: 'window.__endoscopyProof?.ready()', canvas: '#endoscopy-art', overlay: '#endoscopy-overlay', orientation: 'east' }
];

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

async function capture(page, room, version) {
  const relative = room[version];
  const file = relative.includes('/') ? path.join(root, 'tools/room-design', relative) : path.join(__dirname, relative);
  await page.goto(pathToFileURL(file).href);
  await page.waitForFunction(room.ready);
  if (room.orientation) {
    await page.selectOption('#endoscopy-orientation', room.orientation);
    await page.waitForFunction(expected => JSON.parse(document.querySelector('#endoscopy-art').dataset.model).orientation === expected, room.orientation);
  }
  const overlay = page.locator(room.overlay);
  if (await overlay.isChecked()) await overlay.uncheck();
  await page.waitForTimeout(50);
  const result = await page.locator(room.canvas).evaluate(canvas => ({
    image: canvas.toDataURL('image/webp', 0.62),
    width: canvas.width,
    height: canvas.height
  }));
  if (!result.image.startsWith('data:image/webp;base64,')) throw new Error(`${room.label} ${version} did not encode WebP`);
  return result;
}

function buildFragment(data) {
  const options = rooms.map(room => `<option value="${room.id}">${escapeHtml(room.label)}</option>`).join('');
  return `<div id="furniture-revision-review">
<style>
#furniture-revision-review{color:var(--foreground);width:100%}
#furniture-revision-review .frr-controls{display:flex;gap:12px;align-items:end;flex-wrap:wrap;margin-block:10px 14px}
#furniture-revision-review .frr-field{display:grid;gap:4px;min-width:170px}
#furniture-revision-review .frr-stage{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:start}
#furniture-revision-review .frr-stage[data-count="1"]{grid-template-columns:minmax(0,1fr);max-width:720px;margin-inline:auto}
#furniture-revision-review figure{margin:0;min-width:0}
#furniture-revision-review figcaption{margin-bottom:6px;color:var(--muted-foreground);font-weight:500}
#furniture-revision-review img{display:block;width:100%;height:auto;object-fit:contain}
@media(max-width:560px){#furniture-revision-review .frr-stage{grid-template-columns:minmax(0,1fr)}#furniture-revision-review .frr-field{width:100%}}
</style>
<h2>Furniture proportion review</h2>
<div class="frr-controls">
  <label class="frr-field" for="frr-room">Room<select class="form-select" id="frr-room">${options}</select></label>
  <label class="frr-field" for="frr-view">View<select class="form-select" id="frr-view"><option value="both">Current and candidate</option><option value="current">Current</option><option value="candidate">Candidate</option></select></label>
</div>
<div class="frr-stage" id="frr-stage" aria-live="polite"></div>
</div>
<script>(()=>{
const root=document.getElementById('furniture-revision-review');
const data=${JSON.stringify(data)};
const room=root.querySelector('#frr-room'),view=root.querySelector('#frr-view'),stage=root.querySelector('#frr-stage');
const validRoom=value=>data.some(item=>item.id===value)?value:data[0].id;
const validView=value=>['both','current','candidate'].includes(value)?value:'both';
const saved=window.openai?.widgetState?.privateContent||window.openai?.widgetState||{};
room.value=validRoom(saved.room);view.value=validView(saved.view);
function render(){
  const selected=data.find(item=>item.id===room.value)||data[0];
  const versions=view.value==='both'?['current','candidate']:[view.value];
  stage.dataset.count=String(versions.length);stage.replaceChildren();
  for(const version of versions){
    const figure=document.createElement('figure'),caption=document.createElement('figcaption'),image=document.createElement('img');
    caption.textContent=version==='current'?'Current approved proof':'Candidate revision';
    image.src=selected[version].image;image.width=selected[version].width;image.height=selected[version].height;
    image.alt=selected.label+' '+caption.textContent.toLowerCase();
    figure.append(caption,image);stage.append(figure);
  }
}
function persist(){
  const setState=window.openai?.setWidgetState;
  if(typeof setState==='function')Promise.resolve(setState({modelContent:{room:room.value,view:view.value},privateContent:{room:room.value,view:view.value}})).catch(()=>{});
}
function change(){render();persist()}
room.addEventListener('change',change);view.addEventListener('change',change);
window.addEventListener('openai:set_globals',event=>{
  const incoming=event.detail?.globals?.widgetState?.privateContent||event.detail?.globals?.widgetState;
  if(!incoming)return;
  room.value=validRoom(incoming.room);view.value=validView(incoming.view);render();
});
render();
})()</script>
`;
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  const page = await browser.newPage({ viewport: { width: 1100, height: 1000 } });
  const data = [];
  for (const room of rooms) {
    const current = await capture(page, room, 'current');
    const candidate = await capture(page, room, 'candidate');
    if (current.width !== candidate.width || current.height !== candidate.height) {
      throw new Error(`${room.label} pair dimensions differ: ${current.width}x${current.height} vs ${candidate.width}x${candidate.height}`);
    }
    data.push({ id: room.id, label: room.label, current, candidate });
    if (room.id === 'endoscopy-east') {
      await page.locator(room.canvas).screenshot({ path: path.join(__dirname, 'endoscopy-candidate-east-desktop.png') });
    }
  }
  await browser.close();
  const fragment = buildFragment(data);
  fs.writeFileSync(output, fragment);
  console.log(`PASS review capture: ${data.length} room views, ${data.length * 2} WebP canvases, ${Buffer.byteLength(fragment)} bytes`);
})().catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});


