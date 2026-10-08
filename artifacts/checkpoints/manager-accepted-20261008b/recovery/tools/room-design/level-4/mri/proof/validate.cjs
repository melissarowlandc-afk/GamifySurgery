// Owner-revised MRI controls, sources, actual lower bases and character contacts.
// Software validation is not design approval or runtime readiness.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { chromium } = require('@playwright/test');
const here = __dirname, repo = path.resolve(here, '../../../../..');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
const url = process.env.MRI_PROOF_URL || 'http://127.0.0.1:4191/tools/room-design/level-4/mri/proof/index.html';
const uri = file => `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;
(async () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(here, 'proof-manifest.json')));
  const metadata = JSON.parse(fs.readFileSync(path.resolve(here, '../assets/prepared/metadata.json')));
  const failures = [], geometry = [], checks = [];
  const check = (condition, name) => { (condition ? checks : failures).push(name); };
  check(metadata.complete && Object.keys(metadata.assets).length === 9, 'Nine complete active prepared art assets');
  check(fs.readdirSync(path.resolve(here,'../assets/prepared')).filter(f=>f.endsWith('.png')).length===9, 'Exactly nine active PNGs; retired painted patient art stays in history');
  check(manifest.revisedLayout && !manifest.fixedLayout && !!manifest.privateRevision, 'Owner-authorized private layout replaces old fixed-geometry assertions');
  const actorBaseline=JSON.parse(fs.readFileSync(path.join(here,'actor-baseline.json')));
  check(manifest.actorBaseline.sha256===sha(path.join(here,'actor-baseline.json')) && manifest.actorBaseline.actorContractSha256===actorBaseline.actorContractSha256 && JSON.stringify(manifest.actorHashes)===JSON.stringify(actorBaseline.actorHashes), 'Original MRI proof actor source/scale/anchor contract stays frozen');
  for (const [id, spec] of Object.entries(metadata.assets)) {
    check(sha(path.resolve(here, '../assets', spec.source)) === spec.sourceSha256, `${id} original SHA preserved`);
    check(sha(path.resolve(here, '../assets/prepared', spec.file)) === spec.outputSha256, `${id} prepared SHA`);
    check(manifest.preparedHashes[id] === spec.outputSha256, `${id} proof snapshot matches current prepared PNG`);
  }
  for (const [id, source] of Object.entries(manifest.actorHashes)) check(sha(path.resolve(repo, source.path)) === source.sha256, `${id} current actor unchanged`);
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const errors = []; page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
  await page.goto(url); await page.waitForFunction(() => document.body.dataset.ready === '1');
  const core = await page.evaluate(async () => {
    const lab = window.__lab, room = lab.rooms.get('mri'), segs = lab.roomSegments(room), north = ['N1','N2','N3','N4'];
    const report = { doorStates: 0, routes: 0, routePoints: 0, routeProblems: [], visibilityProblems: [], baseConflicts: [], native: [], groundingProblems: [], backingProblems: [], passThrough: [] };
    const makeP = (doors = [], backed = []) => ({ room, ox: 0, oy: 0, tx: 0, ty: 0, doors: new Set(doors), backed: new Set(backed) });
    report.initialScan=lab.state.patientSeated&&lab.state.operator&&lab.state.actors&&lab.actorPlacements(makeP()).filter(x=>x.id==='patient-seated').length===1;
    const ownerMap = { coilCabinet:['N4','EA'], zoneSign:['N3'], scanLight:['N1'], openShelves:['S1','WD'], comfortCart:['S4','ED'] };
    for (const rec of room.records) if (JSON.stringify([...rec.doorOwners].sort()) !== JSON.stringify([...(ownerMap[rec.id] || [])].sort())) report.visibilityProblems.push(`${rec.id} differs from brief door-owner contract`);
    const cases = segs.map(s => [s]).concat([segs]);
    for (let mask = 0; mask < 16; mask++) {
      const backed = north.filter((s, i) => mask & (1 << i));
      for (const doors of cases) {
        const r = lab.check('mri', doors, backed); report.doorStates++; report.routes += r.routes;
        report.routeProblems.push(...r.unreachable, ...r.conflicts, ...r.doorZone);
        const P = makeP(doors, backed);
        for (const rec of room.records) {
          const expected = !rec.doorOwners.some(o => doors.includes(o)) && (rec.touchupKeepWhenBacked || !rec.backedOwners.some(o => backed.includes(o)));
          if (lab.recordVisible(rec, P) !== expected) report.visibilityProblems.push(`${rec.id}: ${doors}/${backed}`);
        }
      }
    }
    const full = await lab.collectDrawables(makeP([], north), true), cabinet = full.sorted.find(x => x.id === 'coilCabinet');
    report.cabinetMeasurement = cabinet ? { painterY: cabinet.py, height: cabinet.h, expectedHeight: room.records.find(x => x.id === 'coilCabinet').renderSizeTiles[1] * 120, alpha: cabinet.alpha ?? 1, clipTop: cabinet.clipTop ?? null } : null;
    report.fullHeightCabinet = !!cabinet && Math.abs(cabinet.py - .32) < 1e-9 && !cabinet.alpha && cabinet.clipTop === undefined && cabinet.h === room.records.find(x => x.id === 'coilCabinet').renderSizeTiles[1] * 120;
    report.passThrough = lab.passableThroughDoors(makeP(['EB','EC']));
    // Independently compare only the painted shell. Each backing lowers just its north segment.
    const raw = backed => { const c = document.createElement('canvas'); c.width = 560; c.height = 770; const g = c.getContext('2d', { willReadFrequently: true }); g.fillStyle = '#efe7d4'; g.fillRect(0, 0, c.width, c.height); lab.paintCaps(g, { ...makeP([], backed), ox: 40, oy: 230 }, true); return g.getImageData(0, 0, 560, 770).data; };
    const baseline = raw([]), all = raw(north);
    for (let i = 0; i < 4; i++) {
      const one = raw([north[i]]);
      for (let j = 0; j < 4; j++) { const q = ((230 - 50) * 560 + Math.round(40 + (j + .5) * 120)) * 4; const changed = [0,1,2,3].some(k => baseline[q+k] !== one[q+k]); if (changed !== (i === j)) report.backingProblems.push(`back ${north[i]} alters ${north[j]} incorrectly`); }
    }
    report.backingRestores = raw([]).every((v, i) => v === baseline[i]);
    // Inspect actual opaque pixels in lower-base bands, independently of broad authored rectangles.
    lab.state.patientSeated = true; lab.state.actors = false;
    const drawn = await lab.collectDrawables(makeP(), true);
    // Decode all nine PNGs directly, including optional hidden wall items.
    for (const [id, spec] of Object.entries(lab.metadata.assets)) {
      const im = new Image(); im.src = lab.assets['design:mri:'+id].candidateSrc; await im.decode();
      const c = document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(im,0,0);const px=g.getImageData(0,0,c.width,c.height).data;
      let transparent=0,opaque=0,edgeAlphaMax=0,alphaMin=255,alphaMax=0,opaqueBottom=-1,l=c.width,t=c.height,r=-1,b=-1;
      for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){const a=px[(y*c.width+x)*4+3];if(!a)transparent++;else{l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);}if(a>=lab.contract.opaqueThreshold){opaque++;opaqueBottom=Math.max(opaqueBottom,y);}alphaMin=Math.min(alphaMin,a);alphaMax=Math.max(alphaMax,a);if(!x||!y||x===c.width-1||y===c.height-1)edgeAlphaMax=Math.max(edgeAlphaMax,a);}
      const specContract=lab.contract.assets[id];
      report.native.push({id,size:[c.width,c.height],expectedSize:spec.canvas,transparent,opaque,alphaMin,alphaMax,edgeAlphaMax,opaqueBottom,alphaClearancePixels:[l,t,c.width-1-r,c.height-1-b],canvasAnchor:spec.canvasAnchor,isFloorSprite:!!specContract.ground,preparedSha256:spec.outputSha256,uniformPacking:Math.abs(spec.destination[2]/spec.crop[2]-spec.destination[3]/spec.crop[3])<1e-9});
    }
    const baseData = []; report.baseBounds=[];
    for (const d of [...drawn.wall, ...drawn.sorted].filter(d => d.rec)) {
      const id = d.rec.assetId.split(':').at(-1); let spec = lab.metadata.assets[id];
      const c = document.createElement('canvas'); c.width = d.img.naturalWidth; c.height = d.img.naturalHeight;
      const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(d.img, 0, 0); const px = g.getImageData(0, 0, c.width, c.height).data;
      if (!spec) { let bottom=-1;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(px[(y*c.width+x)*4+3]>=lab.contract.opaqueThreshold)bottom=Math.max(bottom,y);spec={opaqueBottom:bottom,canvas:[c.width,c.height],reference:true}; }
      const points = [], bandTop = Math.max(0, spec.opaqueBottom - lab.contract.baseBandNativePixels + 1);
      for (let y = bandTop; y <= spec.opaqueBottom; y++) for (let x = 0; x < c.width; x++) if (px[(y*c.width+x)*4+3] >= lab.contract.opaqueThreshold) { const point=[d.x+(x+.5)*d.w/c.width,d.y+(y+.5)*d.h/c.height]; if(d.rec.clipRightWorld===undefined||point[0]<=d.rec.clipRightWorld*120)points.push(point); }
      if (d.rec.worldLocalGround) {
        baseData.push({ id: d.id, owners: d.rec.doorOwners, points, gapProofPixels: spec.measuredOpaqueContactGapProofPixels });
        report.baseBounds.push({id:d.id,boundsPixels:[Math.min(...points.map(p=>p[0])),Math.min(...points.map(p=>p[1])),Math.max(...points.map(p=>p[0])),Math.max(...points.map(p=>p[1]))],opaqueSamples:points.length,footGround:d.rec.worldLocalGround});
      }
      if(d.rec.worldLocalGround && !spec.reference && Math.abs(d.y+(spec.opaqueBottom+1)*d.h/spec.canvas[1]-d.rec.worldLocalGround[1]*120)>1e-8)report.groundingProblems.push(`${id} foot edge differs from logical world ground`);
    }
    for (const doors of cases) {
      const P = makeP(doors), passable = new Set(lab.passableThroughDoors(P).map(x => x.fixture));
      for (const route of lab.computeRoutes(P)) {
        if (!route.path) continue;
        for (let k = 1; k < route.path.length; k++) {
          const a = route.path[k-1], b = route.path[k];
          for (let n = 0; n <= 40; n++) {
            const point = [(a[0]+.5+(b[0]-a[0])*n/40)*120, (a[1]+.5+(b[1]-a[1])*n/40)*120]; report.routePoints++;
            for (const item of baseData) {
              if (item.owners.some(o => doors.includes(o)) || passable.has(item.id)) continue;
              if (item.points.some(p => Math.hypot(p[0]-point[0],p[1]-point[1]) < .18*120)) report.baseConflicts.push(`${item.id} opaque base intersects ${route.door}→${route.target.x},${route.target.y}`);
            }
          }
        }
      }
    }
    report.baseConflicts = [...new Set(report.baseConflicts)]; report.routeProblems = [...new Set(report.routeProblems)];
    // Standing approaches stop before seating. A seated hip/body axis is not a
    // standing-circle endpoint. Intentional chair contact is recorded separately.
    const supportPaths = [
      {id:'operator south-side standing approach',a:[.5,2.5],b:[1.12,2.90],endpoint:'operatorChair'},
      {id:'patient standing approach',a:[2.5,3.5],b:[2.45,3.30],endpoint:null},
      {id:'patient westward approach around scanner',a:[2.45,3.30],b:[2.18,3.30],endpoint:null},
      {id:'patient south-side approach before seating',a:[2.18,3.30],b:[2.18,2.80],endpoint:null}
    ];
    report.supportApproachProblems = []; report.supportApproachSamples = 0; report.supportSolidProblems=[];
    for (const route of supportPaths) for (let n=0;n<=40;n++) {
      const point=[(route.a[0]+(route.b[0]-route.a[0])*n/40)*120,(route.a[1]+(route.b[1]-route.a[1])*n/40)*120]; report.supportApproachSamples++;
      for(const item of baseData) if(item.id!==route.endpoint && item.points.some(p=>Math.hypot(p[0]-point[0],p[1]-point[1])<.18*120)) report.supportApproachProblems.push(`${item.id} blocks ${route.id}`);
      for(const solid of room.solids) {if(solid.endpoint)continue;const f=solid.footprint,x=point[0]/120,y=point[1]/120;if(x>f.left-.18&&x<f.left+f.width+.18&&y>f.top-.18&&y<f.top+f.height+.18)report.supportSolidProblems.push(`${solid.id} blocks ${route.id}`);}
    }
    report.supportApproachProblems=[...new Set(report.supportApproachProblems)];
    report.supportSolidProblems=[...new Set(report.supportSolidProblems)];
    report.supportPaths=supportPaths;
    const os=room.supports.find(s=>s.id==='operator'),of=[os.ground.x*120,os.ground.y*120];
    report.seatedEndpointClearance=baseData.map(s=>({id:s.id,distancePixels:Math.min(...s.points.map(p=>Math.hypot(p[0]-of[0],p[1]-of[1])))}));
    lab.state.patientSeated=true;lab.state.actors=true;
    const actors=lab.actorPlacements(makeP()),patient=actors.find(a=>a.id==='patient-seated'),support=room.supports.find(s=>s.id==='patient-seated'),character=lab.data.characters.find(c=>c.id==='patient.adult.001'),pp=character.poses.sit.west,ps=character.poses.stand.south;
    const capScale=Math.min(1,lab.data.characterMetrics.visibleHeightCap/(ps.anchors.floorY-ps.visibleBounds.y)),couch=lab.metadata.assets['table-empty'],magnet=lab.metadata.assets['gantry-side'];
    const couchY=couch.worldAnchor[1]*120-couch.measuredRiseProofPixels,boreY=magnet.worldAnchor[1]*120-magnet.measuredRiseProofPixels;
    report.patientContact={identity:character.id,facing:support.facing,sourceHipY:pp.anchors.seatContactY,sourceFloorY:pp.anchors.floorY,sourceBodyX:pp.anchors.bodyAxisX,capScale,renderedWidthPixels:patient.w,expectedWidthPixels:120*lab.data.characterMetrics.widthInTiles*capScale,renderedHeightPixels:patient.h,hipPixels:[patient.x+patient.w*pp.anchors.bodyAxisX/160,patient.y+patient.h*pp.anchors.seatContactY/320],supportSeat:support.seat,couchSurfacePixels:couchY,boreCentrePixels:boreY,feetPixels:patient.y+patient.h*pp.anchors.floorY/320,tableGroundPixels:couch.worldAnchor[1]*120,sourceUrlPreserved:patient.url===pp.url,patientCount:actors.filter(a=>a.id.startsWith('patient-')).length};
    const decode=async url=>{const im=new Image();im.src=url;await im.decode();const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(im,0,0);return{w:c.width,h:c.height,p:g.getImageData(0,0,c.width,c.height).data};};
    const pi=await decode(pp.url),gi=await decode(lab.assets['design:mri:gantry-side'].candidateSrc),ti=await decode(lab.assets['design:mri:table-empty'].candidateSrc),di=await decode(lab.assets['design:mri:console'].candidateSrc);
    const gd=drawn.sorted.find(d=>d.id==='gantry'),td=drawn.sorted.find(d=>d.id==='tableEmpty'),dd=drawn.sorted.find(d=>d.id==='console'),glass=room.procedural.find(p=>p.id==='glass').rect;
    const glassLeft=glass.left*120,glassRight=(glass.left+glass.width)*120;
    let left=Infinity,right=-Infinity,footLeft=Infinity,glassOverlap=0,gantryOverlap=0;
    for(let y=0;y<pi.h;y++)for(let x=0;x<pi.w;x++)if(pi.p[(y*pi.w+x)*4+3]){const px=patient.x+(x+.5)*patient.w/pi.w,py=patient.y+(y+.5)*patient.h/pi.h;left=Math.min(left,px);right=Math.max(right,px);if(px>=glassLeft&&px<=glassRight&&py>=glass.top*120&&py<=(glass.top+glass.height)*120)glassOverlap++;const gx=Math.floor((px-gd.x)*gi.w/gd.w),gy=Math.floor((py-gd.y)*gi.h/gd.h);if(gx>=0&&gx<gi.w&&gy>=0&&gy<gi.h&&gi.p[(gy*gi.w+gx)*4+3]>=160)gantryOverlap++;}
    report.patientSilhouette={leftPixels:left,rightPixels:right,glassRightPixels:glassRight,clearancePixels:left-glassRight,glassOverlapSourcePixels:glassOverlap,gantryOverlapSourcePixels:gantryOverlap};
    report.seatedPainter={table:td.py,patient:patient.py,gantry:gd.py,patientInFrontOfBoth:td.py<patient.py&&gd.py<patient.py};
    const northTech=actors.find(a=>a.id==='operator'),techSource=lab.data.characters.find(c=>c.id==='gs026-employee-004').poses.sit.north;
    report.northTech={facing:os.facing,sourcePreserved:northTech.url===techSource.url,southOfDesk:os.ground.y>lab.metadata.assets.console.worldAnchor[1],sameDeskAxis:Math.abs(os.ground.x-lab.metadata.assets.console.worldAnchor[0])<1e-9};
    const bedRec=room.records.find(r=>r.id==='tableEmpty'),borePoint=magnet.calibratedPoints.bore;
    for(let y=Math.floor(pp.anchors.floorY)-24;y<pi.h;y++)for(let x=0;x<pi.w;x++)if(pi.p[(y*pi.w+x)*4+3]>=160)footLeft=Math.min(footLeft,patient.x+(x+.5)*patient.w/pi.w);
    report.bedEntry={clipWorldX:bedRec.clipRightWorld,boreWorldX:magnet.worldAnchor[0]+(borePoint[0]-magnet.canvasAnchor[0])*magnet.proofScale/120,bedLeft:td.x+lab.metadata.assets['table-empty'].outputAllAlphaBounds.left*td.w/ti.w,patientHipX:report.patientContact.hipPixels[0],patientFrontFootX:footLeft};
    let deskRight=-Infinity;for(let y=0;y<di.h;y++)for(let x=0;x<di.w;x++)if(di.p[(y*di.w+x)*4+3])deskRight=Math.max(deskRight,dd.x+(x+.5)*dd.w/di.w);report.consoleGlassClearancePixels=glassLeft-deskRight;
    const tx=Math.floor((support.seat.x*120-td.x)*ti.w/td.w),ty=Math.floor((couchY-td.y)*ti.h/td.h)+3,qi=(ty*ti.w+tx)*4;
    report.patientCushionSample={native:[tx,ty],rgba:Array.from(ti.p.slice(qi,qi+4))};
    report.activeArtOnly=Object.keys(lab.assets).length===9&&room.records.filter(rec=>rec.assetId==='design:mri:table-empty').length===1&&room.records.every(rec=>!rec.occupancy)&&!Object.keys(lab.assets).some(k=>/occupied|patient-mask|lockers/.test(k));
    lab.state.patientSeated=false;const standing=lab.actorPlacements(makeP());report.emptyToggle={oneStanding:standing.filter(a=>a.id==='patient-standing').length===1,noSeated:!standing.some(a=>a.id==='patient-seated'),emptyCouch:room.records.some(rec=>rec.id==='tableEmpty'&&lab.recordVisible(rec,makeP()))};lab.state.patientSeated=true;
    report.contactText = lab.contactText();
    const op=lab.actorPlacements(makeP()).find(x=>x.id==='operator'), char=lab.data.characters.find(x=>x.id==='gs026-employee-004'), pose=char.poses.sit.north;
    const rise=op.h*(pose.anchors.floorY-pose.anchors.seatContactY)/320;
    report.actorContactMetrics={identity:char.id,renderedWidthPixels:op.w,seatToFeetRisePixels:rise,baselineSupportRisePixels:39.6,briefSupportRisePixels:45,baselineFeetAboveFloorPixels:39.6-rise,briefFeetAboveFloorPixels:45-rise};
    report.lightNeverDims = true;
    const c = document.getElementById('canvasB');
    lab.state.imaging = false; await lab.draw(); const before = c.toDataURL(); lab.state.imaging = true; await lab.draw(); report.lightNeverDims = c.toDataURL() === before;
    lab.state.doors = new Set(); lab.state.backed = new Set(); lab.state.routes = false; lab.state.grid = false; lab.state.contacts = false; lab.state.bases = false; await lab.draw(); const closed = c.toDataURL();
    lab.state.doors = new Set(segs); lab.state.backed = new Set(north); await lab.draw(); lab.state.doors = new Set(); lab.state.backed = new Set(); await lab.draw(); report.exactRestore = c.toDataURL() === closed;
    return report;
  });
  check(core.initialScan, 'Reload defaults to one current seated-west patient and tech');
  check(core.doorStates === 272 && core.routes === 2048 && !core.routeProblems.length, 'All 16 doors/simultaneous doors × all16 north masks: 272 states/2048 coarse routes');
  check(!core.visibilityProblems.length, 'Exact optional decor hide ownership');
  check(core.fullHeightCabinet, 'Cabinet retained full height and floor-sorted at .32 on north backing');
  check(core.passThrough.length === 2 && core.passThrough.every(x => x.fixture === 'gantry' && x.alreadyAllowed), 'EB/EC magnet pass-through exceptions preserved');
  check(!core.backingProblems.length && core.backingRestores, 'North backing lowers only its own segment and restores exact shell');
  check(core.exactRestore, 'Door/backing round-trip restores identical candidate pixels');
  check(core.lightNeverDims, 'MRI imagery/procedural floor and glass never dim');
  check(!core.baseConflicts.length, `Actual lower opaque-base bands clear ${core.routePoints} interpolated route samples (radius .18 tile)`);
  check(!core.groundingProblems.length, 'Every candidate actual foot edge meets its revised declared world ground');
  check(!core.supportApproachProblems.length && !core.supportSolidProblems.length, `Actual lower-base bands and declared solids clear ${core.supportApproachSamples} standing-approach samples before seating`);
  for (const item of core.native) check(item.size.join(',') === item.expectedSize.join(',') && item.transparent > 0 && item.opaque > 0 && item.alphaMin === 0 && item.alphaMax >= 160 && item.edgeAlphaMax === 0 && item.alphaClearancePixels.every(x=>x>=4) && item.uniformPacking && (!item.isFloorSprite || item.canvasAnchor[1] === item.opaqueBottom+1) && item.preparedSha256 === metadata.assets[item.id].outputSha256, `${item.id} exact native canvas/genuine alpha/4px clearance/uniform pack/true ground/current browser snapshot`);
  const pc=core.patientContact;
  check(pc.identity==='patient.adult.001'&&pc.facing==='west'&&pc.sourceUrlPreserved&&pc.patientCount===1&&Math.abs(pc.renderedWidthPixels-pc.expectedWidthPixels)<1e-9, 'Exactly one sit-west patient uses existing source and unchanged cap scale');
  check(Math.abs(pc.hipPixels[0]-pc.supportSeat.x*120)<1e-8&&Math.abs(pc.hipPixels[1]-pc.couchSurfacePixels)<1e-8, 'Patient source hip anchor exactly meets empty cushion surface');
  check(core.patientCushionSample.rgba[3]>=160&&core.patientCushionSample.rgba[2]-core.patientCushionSample.rgba[0]>18, 'Actual source cushion exists beneath patient hip');
  check(core.seatedPainter.patientInFrontOfBoth&&core.patientSilhouette.gantryOverlapSourcePixels>0, 'Patient draws in front of both couch and scanner at actual source overlap');
  check(core.northTech.facing==='north'&&core.northTech.sourcePreserved&&core.northTech.southOfDesk&&core.northTech.sameDeskAxis,'Existing sit-north tech sits south of larger desk on its center axis');
  check(Math.abs(core.bedEntry.clipWorldX-core.bedEntry.boreWorldX)<1e-9,'Visible bed entrance reaches exact donut center');
  check(core.bedEntry.patientFrontFootX<core.bedEntry.bedLeft&&core.bedEntry.patientHipX-core.bedEntry.bedLeft<25,'Patient sits at outer west cushion with feet beyond bed end');
  check(core.patientSilhouette.glassOverlapSourcePixels===0&&core.patientSilhouette.clearancePixels>0&&core.consoleGlassClearancePixels>0, 'Actual patient and console alpha silhouettes clear procedural glass');
  check(core.activeArtOnly&&core.emptyToggle.oneStanding&&core.emptyToggle.noSeated&&core.emptyToggle.emptyCouch, 'Active build has empty furniture only; patient toggle changes pose without duplicates');
  for(const id of ['gantry-side','table-empty','console','operator-chair'])check(Math.abs(metadata.assets[id].measuredRiseProofPixels-metadata.assets[id].expectedRiseNativePixels/2)<=1.5, `${id} actual physical rise meets revised target ±1.5px`);
  check(Math.abs(pc.couchSurfacePixels-pc.boreCentrePixels)<1e-8, 'Enlarged bore exactly aligns with measured couch surface');
  // Exercise each real button, not only the model API.
  await page.evaluate(() => { const lab=window.__lab; lab.state.doors=new Set();lab.state.backed=new Set();lab.refreshControls(); });
  const doorButtons=page.locator('#doorGrid button');
  let doorUiRestores=true;
  for(let i=0;i<16;i++) {
    await page.evaluate(()=>document.body.dataset.ready='0'); await doorButtons.nth(i).click(); await page.waitForFunction(()=>document.body.dataset.ready==='1');
    if(await doorButtons.nth(i).getAttribute('aria-pressed')!=='true')doorUiRestores=false;
    await page.evaluate(()=>document.body.dataset.ready='0'); await doorButtons.nth(i).click(); await page.waitForFunction(()=>document.body.dataset.ready==='1');
    if(await doorButtons.nth(i).getAttribute('aria-pressed')!=='false')doorUiRestores=false;
  }
  check(doorUiRestores,'All16 actual door controls open/close and redraw');
  await page.locator('#allDoors').click();check(await page.evaluate(()=>window.__lab.state.doors.size===16),'Open-all control');
  await page.locator('#closeDoors').click();check(await page.evaluate(()=>window.__lab.state.doors.size===0),'Close-all control');
  await page.locator('#allBacked').click();check(await page.evaluate(()=>window.__lab.state.backed.size===4),'Back-all control');
  await page.locator('#clearBacked').click();check(await page.evaluate(()=>window.__lab.state.backed.size===0),'Clear-backing control');
  await page.locator('#doorGrid button').first().focus(); await page.keyboard.press('Enter');
  check(await page.locator('#doorGrid button').first().getAttribute('aria-pressed') === 'true', 'Door button keyboard Enter');
  await page.keyboard.press('Space'); check(await page.locator('#doorGrid button').first().getAttribute('aria-pressed') === 'false', 'Door button keyboard Space/restoration');
  await page.locator('#backedChips button').nth(2).focus(); await page.keyboard.press('Space'); check(await page.locator('#backedChips button').nth(2).getAttribute('aria-pressed') === 'true', 'Independent backing keyboard control');
  await page.locator('#tgPatientSeated').focus(); await page.keyboard.press('Space');
  check(await page.evaluate(() => !window.__lab.state.patientSeated), 'Patient keyboard toggle to standing');
  await page.keyboard.press('Space');
  check(await page.evaluate(() => window.__lab.state.patientSeated && window.__lab.actorPlacements({ room:window.__lab.rooms.get('mri'),ox:0,oy:0 }).filter(x=>x.id.startsWith('patient-')).length===1), 'Patient keyboard toggle restores exactly one seated patient');
  for(const [id,key]of [['tgRoutes','routes'],['tgGrid','grid']]) {await page.locator('#'+id).check();check(await page.evaluate(k=>window.__lab.state[k],key), id+' actual control');await page.locator('#'+id).uncheck();}
  await page.setViewportSize({ width:320,height:900 });
  check(await page.evaluate(() => document.documentElement.scrollWidth <= 320 && document.querySelector('canvas#canvasB').getBoundingClientRect().right <= 320), '320px layout without horizontal overflow');
  check(!errors.length, 'No browser errors/missing resources');
  for (const id of ['operator-chair','console','table-empty','gantry-side']) { const spec = metadata.assets[id]; if (spec.measuredRiseProofPixels == null || Math.abs(spec.measuredRiseProofPixels - spec.expectedRiseNativePixels/2)>1.5) geometry.push(`${id}: measured ${spec.measuredRiseProofPixels == null ? 'uncalibrated' : spec.measuredRiseProofPixels.toFixed(3)+'px'}, target ${spec.expectedRiseNativePixels/2}px`); }
  const magnet = metadata.assets['gantry-side']; if (magnet.sourceVisibleBounds.width <= magnet.sourceVisibleBounds.height) geometry.push('Magnet silhouette is taller than long within prescribed portrait canvas; owner reconciliation required.');
  const couch=metadata.assets['table-empty'];
  const boreRoomY=magnet.worldAnchor[1]*120-magnet.measuredRiseProofPixels, couchRoomY=couch.worldAnchor[1]*120-couch.measuredRiseProofPixels;
  geometry.push(`Measured room couch surface ${(couchRoomY-boreRoomY).toFixed(3)}px below bore centre. Source-contact picks have about3native-source-pixel uncertainty; table right end is depth-covered by magnet.`);
  geometry.push(`Current actor feet/contact discrepancy: baseline ${core.actorContactMetrics.baselineFeetAboveFloorPixels.toFixed(3)}px above floor; brief support ${core.actorContactMetrics.briefFeetAboveFloorPixels.toFixed(3)}px above floor. Actor source and scale remain the frozen current lab export.`);
  geometry.push('Standing approaches stop south of the chair and couch before seating. Seated hip/body axes are not standing-circle endpoints; their base clearances are reported separately. Walking-route radius checks remain enforced.');
  geometry.push(`Patient feet ${(pc.tableGroundPixels-pc.feetPixels).toFixed(3)}px above couch floor. Simplified sit-west/dangling-foot presentation is owner-directed; seat/climb animation is not implemented.`);
  geometry.push('All-alpha padding exceeds the original4–8px target on calibrated/tall frames; explicit candidate exception, minimum4px retained. Lower alpha bands are projected2D silhouettes and do not prove physical floor depth.');
  const report = { status: failures.length ? 'failed' : 'revision_controls_contacts_and_integrity_pass_owner_review_pending', url, origin:new URL(url).origin, checks, failures, geometryAcceptance:'needs_owner_review', geometry, core, errors };
  fs.mkdirSync(path.join(here,'evidence'),{recursive:true}); fs.writeFileSync(path.join(here,'evidence/validation-report.json'),JSON.stringify(report,null,2)+'\n');
  const summary = `${failures.length?'FAIL':'PASS'} ${checks.length} revised checks; ${core.doorStates} door/backing states; ${core.routes} coarse routes; ${core.routePoints} actual-base walking samples; ${core.supportApproachSamples} standing-approach samples.\n${geometry.map(x=>'REVIEW '+x).join('\n')}\n${failures.map(x=>'FAIL '+x).join('\n')}`;
  fs.writeFileSync(path.join(here,'evidence/validation.log'),summary+'\n'); console.log(summary);
  await browser.close(); process.exit(failures.length || process.argv.includes('--require-geometry') && geometry.length ? 1 : 0);
})().catch(e=>{console.error(e.stack);process.exit(1);});
