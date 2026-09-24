const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '../../..');
const candidate = __dirname;
const sourceDir = path.join(root, 'Photos for Codex 2', 'Codex Rooms 2', 'GS-015', 'furniture-revision-2026-09-22');
const originalDir = path.join(root, 'Photos for Codex 2', 'Codex Rooms 2', 'GS-015');
const dataUrl = file => `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const crop = async (page, source, targetWidth, padding = 8) => page.evaluate(async ({ source, targetWidth, padding }) => {
  const image = new Image(); image.src = source; await image.decode();
  const scan = document.createElement('canvas'); scan.width = image.naturalWidth; scan.height = image.naturalHeight;
  const scanContext = scan.getContext('2d'); scanContext.drawImage(image, 0, 0);
  const pixels = scanContext.getImageData(0, 0, scan.width, scan.height).data;
  let left = scan.width, top = scan.height, right = -1, bottom = -1;
  for (let y = 0; y < scan.height; y += 1) for (let x = 0; x < scan.width; x += 1) if (pixels[(y * scan.width + x) * 4 + 3] > 32) {
    left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
  }
  if (right < left) throw new Error('source has no alpha-visible pixels');
  const visibleWidth = right - left + 1, visibleHeight = bottom - top + 1;
  const drawWidth = targetWidth - padding * 2, scale = drawWidth / visibleWidth;
  const drawHeight = Math.round(visibleHeight * scale);
  const out = document.createElement('canvas'); out.width = targetWidth; out.height = drawHeight + padding * 2;
  out.getContext('2d').drawImage(scan, left, top, visibleWidth, visibleHeight, padding, padding, drawWidth, drawHeight);
  return { dataUrl: out.toDataURL('image/webp', .92), dimensions: { source: [image.naturalWidth, image.naturalHeight], alphaBounds: [left, top, right + 1, bottom + 1], packed: [out.width, out.height], visible: [visibleWidth, visibleHeight], scale, padding } };
}, { source, targetWidth, padding });

const packXray = async (page, consoleSource) => page.evaluate(async ({ atlasSource, consoleSource, existingCrops }) => {
  const load = async source => { const image = new Image(); image.src = source; await image.decode(); return image; };
  const [atlas, consoleImage] = await Promise.all([load(atlasSource), load(consoleSource)]);
  const items = [
    ['detector', atlas, [existingCrops.detector.x, existingCrops.detector.y, existingCrops.detector.w, existingCrops.detector.h], [existingCrops.detector.contactX, existingCrops.detector.contactY]],
    ['console', consoleImage, [0, 0, consoleImage.naturalWidth, consoleImage.naturalHeight], [251, consoleImage.naturalHeight - 8]],
    ['apron', atlas, [existingCrops.apron.x, existingCrops.apron.y, existingCrops.apron.w, existingCrops.apron.h], [existingCrops.apron.contactX, existingCrops.apron.contactY]],
    ['tube', atlas, [existingCrops.tube.x, existingCrops.tube.y, existingCrops.tube.w, existingCrops.tube.h], [existingCrops.tube.contactX, existingCrops.tube.contactY]]
  ];
  const out = document.createElement('canvas'); out.width = 1004; out.height = items.reduce((sum, [, , box]) => sum + box[3] + 8, 8);
  const context = out.getContext('2d'); const crops = {}; let y = 8;
  for (const [id, image, box, contact] of items) {
    const [sx, sy, w, h] = box; context.drawImage(image, sx, sy, w, h, 8, y, w, h);
    crops[id] = { x: 8, y, w, h, contactX: contact[0], contactY: contact[1] }; y += h + 8;
  }
  return { dataUrl: out.toDataURL('image/webp', .92), crops };
}, { atlasSource: dataUrl(path.join(root, 'tools/room-design/xray-layout/xray-assets.webp')), consoleSource, existingCrops: JSON.parse(fs.readFileSync(path.join(root, 'tools/room-design/xray-layout/atlas.json'), 'utf8')).crops });

const packCt = async (page, consoleSource) => page.evaluate(async ({ atlasSource, consoleSource }) => {
  const load = async source => { const image = new Image(); image.src = source; await image.decode(); return image; };
  const [atlas, consoleImage] = await Promise.all([load(atlasSource), load(consoleSource)]);
  const out = document.createElement('canvas'); out.width = 1354; out.height = Math.max(963, consoleImage.naturalHeight);
  const context = out.getContext('2d'); context.drawImage(atlas, 0, 0, 774, 963, 0, 0, 774, 963); context.drawImage(consoleImage, 0, 0, consoleImage.naturalWidth, consoleImage.naturalHeight, 786, 0, consoleImage.naturalWidth, consoleImage.naturalHeight);
  return { dataUrl: out.toDataURL('image/webp', .92), packedFrames: { scanner: { x: 0, y: 0, w: 774, h: 963 }, console: { x: 786, y: 0, w: consoleImage.naturalWidth, h: consoleImage.naturalHeight } }, contact: [284, consoleImage.naturalHeight - 8] };
}, { atlasSource: dataUrl(path.join(root, 'tools/room-design/ct-layout/ct-furniture-packed.webp')), consoleSource });

const packFront = async (page, source) => page.evaluate(async source => {
  const image = new Image(); image.src = source; await image.decode();
  const scan = document.createElement('canvas'); scan.width = image.naturalWidth; scan.height = image.naturalHeight;
  const context = scan.getContext('2d'); context.drawImage(image, 0, 0); const pixels = context.getImageData(0, 0, scan.width, scan.height).data;
  let left = scan.width, top = scan.height, right = -1, bottom = -1;
  for (let y=0;y<scan.height;y+=1) for (let x=0;x<scan.width;x+=1) if (pixels[(y*scan.width+x)*4+3]>32) { left=Math.min(left,x); top=Math.min(top,y); right=Math.max(right,x); bottom=Math.max(bottom,y); }
  const width=right-left+1,height=bottom-top+1,probeY=Math.max(top,bottom-24); let runStart=-1,runEnd=-1,bestStart=-1,bestEnd=-1;
  for(let x=left;x<=right;x+=1){const opaque=pixels[(probeY*scan.width+x)*4+3]>32;if(opaque&&runStart<0)runStart=x;if((!opaque||x===right)&&runStart>=0){runEnd=opaque&&x===right?x:x-1;if(runEnd-runStart>bestEnd-bestStart){bestStart=runStart;bestEnd=runEnd}runStart=-1}}
  if(bestStart<0)throw new Error('no plinth base span'); const baseWidth=bestEnd-bestStart+1,scale=888/baseWidth,out=document.createElement('canvas'); out.width=969; out.height=799;
  const drawX=41-bestStart*scale,drawY=766-(bottom+1)*scale; out.getContext('2d').drawImage(scan,0,0,scan.width,scan.height,drawX,drawY,scan.width*scale,scan.height*scale);
  return {dataUrl:out.toDataURL('image/webp',.92),dimensions:{source:[image.naturalWidth,image.naturalHeight],alphaBounds:[left,top,right+1,bottom+1],baseProbe:{y:probeY,span:[bestStart,bestEnd+1],width:baseWidth},packed:[969,799],visible:[width,height],scale,padding:0,placedBase:[41,766,929],placedAlphaBounds:[left*scale+drawX,top*scale+drawY,(right+1)*scale+drawX,(bottom+1)*scale+drawY]}};
}, source);

const packEndoscopy = async (page, atlasSource, cabinetSource, data, renderedHeight, worktopY) => page.evaluate(async ({ atlasSource, cabinetSource, data, renderedHeight, worktopY }) => {
  const load=async source=>{const image=new Image();image.src=source;await image.decode();return image}; const [atlas,cabinet]=await Promise.all([load(atlasSource),load(cabinetSource)]);
  const scan=document.createElement('canvas');scan.width=cabinet.naturalWidth;scan.height=cabinet.naturalHeight;const sc=scan.getContext('2d');sc.drawImage(cabinet,0,0);const pixels=sc.getImageData(0,0,scan.width,scan.height).data;let left=scan.width,top=scan.height,right=-1,bottom=-1;
  for(let y=0;y<scan.height;y+=1)for(let x=0;x<scan.width;x+=1)if(pixels[(y*scan.width+x)*4+3]>32){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y)}
  if(right<left)throw new Error('Endoscopy cabinet has no visible alpha');const width=right-left+1,height=bottom-top+1,pad=8,outCab=document.createElement('canvas');outCab.width=width+pad*2;outCab.height=height+pad*2;outCab.getContext('2d').drawImage(scan,left,top,width,height,pad,pad,width,height);
  const packed=document.createElement('canvas');packed.width=data.packedSize[0]+outCab.width;packed.height=Math.max(data.packedSize[1],outCab.height);const pc=packed.getContext('2d');pc.drawImage(atlas,0,0);pc.drawImage(outCab,data.packedSize[0],0);
  const probeY=height-25;let run=-1,outer=[width,0],runs=[];for(let x=0;x<width;x+=1){const opaque=pixels[((top+probeY)*scan.width+(left+x))*4+3]>32;if(opaque&&run<0)run=x;if((!opaque||x===width-1)&&run>=0){const end=opaque&&x===width-1?x+1:x;runs.push([run,end]);outer=[Math.min(outer[0],run),Math.max(outer[1],end)];run=-1}}
  const contact=[pad+(outer[0]+outer[1])/2,outCab.height-pad],actualRise=(bottom+1-worktopY)*(renderedHeight/height);return {dataUrl:packed.toDataURL('image/webp',.92),frame:{x:data.packedSize[0],y:0,w:outCab.width,h:outCab.height,sourceFile:'furniture-revision-2026-09-22'},packedSize:[packed.width,packed.height],contact,details:{source:[cabinet.naturalWidth,cabinet.naturalHeight],alphaBounds:[left,top,right+1,bottom+1],packed:[outCab.width,outCab.height],baseProbe:{y:top+probeY,runs:runs.map(([a,b])=>[left+a,left+b]),outerSpan:[left+outer[0],left+outer[1]]},worktopSourceY:worktopY,worktopRisePx:actualRise,renderedHeight}};
}, { atlasSource, cabinetSource, data, renderedHeight, worktopY });

const build = async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  const page = await browser.newPage();
  const front = await packFront(page, dataUrl(path.join(sourceDir, 'front-desk-shorter-03.png')));
  const xrayConsole = await crop(page, dataUrl(path.join(sourceDir, 'xray-workstation-02.png')), 502, 8);
  const ctConsole = await crop(page, dataUrl(path.join(sourceDir, 'ct-workstation-01.png')), 568, 8);
  const xrayPacked = await packXray(page, xrayConsole.dataUrl);
  const ctPacked = await packCt(page, ctConsole.dataUrl);
  const endoSouthData=JSON.parse(fs.readFileSync(path.join(root,'tools/room-design/endoscopy-layout/south.json'),'utf8')), endoEastData=JSON.parse(fs.readFileSync(path.join(root,'tools/room-design/endoscopy-layout/east.json'),'utf8'));
  const endoSouth=await packEndoscopy(page,dataUrl(path.join(root,'tools/room-design/endoscopy-layout/south.webp')),dataUrl(path.join(sourceDir,'endoscopy-prep-south-04.png')),endoSouthData,110,540);
  const endoEast=await packEndoscopy(page,dataUrl(path.join(root,'tools/room-design/endoscopy-layout/east.webp')),dataUrl(path.join(sourceDir,'endoscopy-prep-east-02-alpha.png')),endoEastData,155,800);
  await browser.close();

  const frontHtmlPath = path.join(root, 'tools/room-design/front-desk-layout/front-desk-layout.html');
  let frontHtml = fs.readFileSync(frontHtmlPath, 'utf8');
  const frontSource = /^data:image\/webp;base64,/.test(front.dataUrl) ? front.dataUrl.split(',')[1] : null;
  frontHtml = frontHtml.replace(/(const deskArt=new Image\(\);deskArt\.src='data:image\/webp;base64,)[^']+/, `$1${frontSource}`);
  if (frontHtml === fs.readFileSync(frontHtmlPath, 'utf8')) throw new Error('Front Desk artwork replacement failed');
  fs.writeFileSync(path.join(candidate, 'front-desk-candidate.html'), frontHtml);

  const xray = { crops: xrayPacked.crops };
  const xrayTemplate = fs.readFileSync(path.join(root, 'tools/room-design/xray-layout/xray-layout.template.html'), 'utf8');
  const xrayScript = fs.readFileSync(path.join(root, 'tools/room-design/xray-layout/xray-preview.js'), 'utf8')
    .replace('__CROP_CONFIG__', JSON.stringify(xray.crops))
    .replace('__XRAY_ATLAS__', xrayPacked.dataUrl.split(',')[1]);
  fs.writeFileSync(path.join(candidate, 'xray-candidate.html'), xrayTemplate.replace('__XRAY_SCRIPT__', xrayScript));

  const ctAtlas = { packedFrames: ctPacked.packedFrames, contacts: { console: { floor: ctPacked.contact } } };
  const ctTemplate = fs.readFileSync(path.join(root, 'tools/room-design/ct-layout/ct-layout.template.html'), 'utf8');
  const wall = JSON.parse(fs.readFileSync(path.join(root, 'tools/room-design/ct-layout/cat-wall-art.json'), 'utf8'));
  const ctScript = fs.readFileSync(path.join(root, 'tools/room-design/ct-layout/ct-preview.js'), 'utf8')
    .replace('__CT_CROP_CONFIG__', JSON.stringify(ctAtlas.packedFrames))
    .replace('__CT_ATLAS__', ctPacked.dataUrl.split(',')[1])
    .replace('__CT_WALL_CROP_CONFIG__', JSON.stringify(wall.packedFrames))
    .replace('__CT_WALL_ATLAS__', fs.readFileSync(path.join(root, 'tools/room-design/ct-layout/ct-cat-scans-packed.webp')).toString('base64'))
    .replace("floorContact:{x:284,y:514}", `floorContact:{x:284,y:${ctPacked.contact[1]}}`);
  fs.writeFileSync(path.join(candidate, 'ct-candidate.html'), ctTemplate.replace('__CT_SCRIPT__', ctScript));

  endoSouthData.packedFrames.cabinet=endoSouth.frame;endoSouthData.packedSize=endoSouth.packedSize;endoEastData.packedFrames.cabinet=endoEast.frame;endoEastData.packedSize=endoEast.packedSize;
  const endoSprites=JSON.parse(fs.readFileSync(path.join(root,'tools/room-design/endoscopy-layout/sprite-config.json'),'utf8'));endoSprites.revision='furniture-revision-2026-09-22-pending-review';endoSprites.views.south.cabinet={ground:endoSouth.contact,renderedHeight:110,worktopRisePx:endoSouth.details.worktopRisePx};endoSprites.views.east.cabinet={ground:endoEast.contact,renderedHeight:155,worktopRisePx:endoEast.details.worktopRisePx};endoSprites.south=endoSprites.views.south;endoSprites.east=endoSprites.views.east;
  const endoContract=JSON.parse(fs.readFileSync(path.join(root,'tools/room-design/endoscopy-layout/handoff-contract.json'),'utf8'));endoContract.candidateRevision='furniture-revision-2026-09-22-pending-owner-review';
  const endoScript=fs.readFileSync(path.join(root,'tools/room-design/endoscopy-layout/preview.js'),'utf8').replace('__DATA__',JSON.stringify({south:endoSouthData,east:endoEastData})).replace('__SPRITES__',JSON.stringify(endoSprites)).replace('__CONTRACT__',JSON.stringify(endoContract)).replace('__SOUTH__',endoSouth.dataUrl.split(',')[1]).replace('__EAST__',endoEast.dataUrl.split(',')[1]);
  const endoTemplate=fs.readFileSync(path.join(root,'tools/room-design/endoscopy-layout/template.html'),'utf8');fs.writeFileSync(path.join(candidate,'endoscopy-candidate.html'),endoTemplate.replace('__ENDOSCOPY_SCRIPT__',endoScript));

  const metadata = {
    status: 'candidate-pending-owner-review',
    processing: 'Source PNG alpha bounds scanned and uniformly scaled in headless Chrome canvas; no source PNG was modified.',
    frontDesk: { source: 'front-desk-shorter-03.png', packed: front.dimensions, ground: { baseLeft: 41, baseRight: 929, baseBottom: 766 }, candidate: 'front-desk-candidate.html' },
    xray: { source: 'xray-workstation-02.png', packed: xrayConsole.dimensions, crop: xray.crops.console, candidate: 'xray-candidate.html', preserved: { footprint: [2.15, 1.45, .6, .3], anchor: [2.45, 1.75], approach: [2.45, 2.35], collision: 'nonblocking' } },
    ct: { source: 'ct-workstation-01.png', packed: ctConsole.dimensions, crop: ctAtlas.packedFrames.console, contact: ctAtlas.contacts.console.floor, candidate: 'ct-candidate.html', preserved: { footprint: [2.9, 1.72, .9, .38], anchor: [3.35, 2.1], approach: [3.35, 2.7], collision: 'nonblocking' } },
    endoscopy: { sources: { south: 'endoscopy-prep-south-04.png', east: 'endoscopy-prep-east-02-alpha.png' }, south: { ...endoSouth.details, ground: endoSouth.contact }, east: { ...endoEast.details, ground: endoEast.contact }, candidate: 'endoscopy-candidate.html', preserved: { cabinet: { footprint: [.05,.05,.9,.25], conflicts: ['N1','WA'], collision: 'nonblocking' }, allOtherPackedFrames: 'copied unchanged from canonical south.webp/east.webp' } }
  };
  fs.writeFileSync(path.join(candidate, 'candidate-metadata.json'), JSON.stringify(metadata, null, 2) + '\n');
  console.log(JSON.stringify(metadata, null, 2));
};
build().catch(error => { console.error(error.stack || error); process.exit(1); });
