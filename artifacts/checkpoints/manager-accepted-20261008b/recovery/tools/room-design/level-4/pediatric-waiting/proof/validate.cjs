// Node-only acceptance checks. This script never launches a browser.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), vm = require('node:vm');
const here = __dirname, repo = path.resolve(here, '../../../../..'), out = path.join(here, 'evidence');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
const lines = [], checks = [];
const log = line => { lines.push(line); console.log(line); };
function check(ok, name, details) { checks.push({ name, pass: !!ok, ...(details === undefined ? {} : { details }) }); if (!ok) throw new Error(name + (details === undefined ? '' : ': ' + JSON.stringify(details))); }
const near = (a, b, epsilon = 1e-8) => Math.abs(a - b) <= epsilon;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const G = await import('./geometry.mjs'), I = await import('../assets/image-utils.mjs');
  const design = await import('./design-rooms.js'), TU = await import('./room-touchups.mjs');
  const room = design.DESIGN_ROOMS[0], nav = design.DESIGN_NAVIGATION[room.definitionId];
  const data = read(path.join(here, 'data.json')), contract = read(path.join(here, 'asset-contract.json'));
  const metadata = read(path.resolve(here, '../assets/prepared/metadata.json'));
  const manifest = read(path.resolve(here, '../assets/generation-manifest.json')), proof = read(path.join(here, 'proof-manifest.json'));
  const baseline = read(path.join(here, 'layout-baseline.json'));
  const revision = read(path.join(here, 'revision-contract.json'));
  check(room.proofId === 'pediatric-waiting' && same(room.footprint, [4, 4]), 'Isolated 4x4 pediatric room');
  check(!proof.designApproval && !proof.runtimeIntegration && !manifest.approval, 'Candidate remains unapproved and outside runtime');
  for (const key of ['footprint','shell','solids','floor','procedural']) check(same(room[key],baseline.room[key]), 'Preserved original shell/floor/solid '+key);
  const comparableNav=structuredClone(nav);comparableNav.waitingAnchors=baseline.navigation.waitingAnchors;delete comparableNav.privateProofRouteModel;
  check(same(comparableNav,baseline.navigation),'Shared navigation preserved; private waiting targets/routes explicitly revised');
  for(const original of baseline.room.supports){const current=room.supports.find(s=>s.id===original.id),clean={};for(const k of Object.keys(original))clean[k]=current[k];
   const allowed=original.id.startsWith('kid')?['character','seat','ground','fixtureGround']:original.id==='armchair'?['seat']:[];
   for(const k of allowed)clean[k]=original[k];check(same(clean,original),'Support preserved outside authorized fit '+original.id);
  }
  for(const original of baseline.room.records){const current=room.records.find(r=>r.id===original.id),clean={};for(const k of Object.keys(original))clean[k]=current[k];clean.sourceRect=original.sourceRect;
   const allowed=original.id.startsWith('kidStool')?['renderSizeTiles','worldLocalGround','destinationTopLeftTiles','depthKey']:original.id==='kidsTable'?['renderSizeTiles','worldLocalGround','destinationTopLeftTiles','depthKey']:original.id==='animalPrints'?['destinationTopLeftTiles','doorOwners','backedOwners']:['toyChest','bookBin'].includes(original.id)?['renderSizeTiles','worldLocalGround','destinationTopLeftTiles','depthKey','footprint','doorOwners']:[];
   for(const k of allowed)clean[k]=original[k];check(same(clean,original),'Original record preserved outside authorized revision '+original.id);
  }
  check(room.supports.length===9&&room.records.length===17,'Only four added seats and three chair front overlays');
  const registry=read(path.join(repo,revision.registry.path));for(const selected of revision.registry.selectedCharacters)check(same(registry.characters.find(c=>c.id===selected.id),selected),'Selected pediatric registry entry unchanged '+selected.id);
  check(proof.presentationRevision.sha256===sha(path.join(here,'revision-contract.json'))&&same(data.pediatricPresentation,revision),'Owner-authorized private revision contract hashes');
  check(same(metadata, design.PREPARED_METADATA), 'Renderer metadata matches prepared receipt');
  check(metadata.contractSha256 === sha(path.join(here, 'asset-contract.json')) && metadata.generationManifestSha256 === sha(path.resolve(here, '../assets/generation-manifest.json')), 'Preparation input hashes');
  const decoded = {};
  for (const [id, spec] of Object.entries(contract.assets)) {
    const entry = metadata.assets[id], file = path.resolve(here, '../assets/prepared', entry.file), image = await I.decode(file);
    const [width, height] = entry.canvas, all = I.bounds(image.pixels.data, width, height), opaque = I.bounds(image.pixels.data, width, height, contract.opaqueThreshold), stats = I.alphaStats(image.pixels.data, width, height);
    decoded[id] = image;
    check(image.canvas.width === spec.canvas[0] && image.canvas.height === spec.canvas[1], `Native dimensions ${id}`);
    check(width / spec.widthTiles >= 240 && height / spec.heightTiles >= 240, `Minimum 240 native pixels per tile ${id}`);
    check(sha(file) === entry.outputSha256 && proof.preparedHashes[id] === entry.outputSha256, `Prepared hash ${id}`);
    check(stats.min === 0 && stats.max >= 250 && stats.transparent > 0 && stats.opaque > 0 && stats.edgeAlphaMax === 0, `Genuine transparent alpha ${id}`);
    const margins = [all.left, all.top, width - 1 - all.right, height - 1 - all.bottom];
    check(margins.every(x => x >= contract.minimumClearancePixels) && same(all, entry.outputAllAlphaBounds), `Transparent margins and bounds ${id}`, margins);
    check(near(entry.destination[2] / entry.crop[2], entry.destination[3] / entry.crop[3]) && entry.aspectPreserved && !entry.sourceUpscaled, `Uniform source fit ${id}`);
    check(entry.alphaCleanup.meaningfulPixelsRemoved === 0 && entry.alphaCleanup.maxRemovedAlpha < 8 && entry.sourceVisibleBounds.edgeAlphaMax < 8, `No meaningful source crop ${id}`);
    check(entry.canvasAnchor[1] === (spec.anchorKind === 'floor' ? opaque.bottom + 1 : all.top), `Actual floor/top alpha anchor ${id}`);
    for (const recordId of spec.recordIds) {
      const record = room.records.find(x => x.id === recordId), d = G.fixturePlacement(record, entry);
      check(near(d.w / width, d.h / height), `Uniform world fit ${recordId}`);
      const actualY = d.y + entry.canvasAnchor[1] * d.h / height;
      const actualX = d.x + entry.canvasAnchor[0] * d.w / width;
      const world = record.worldLocalGround ?? spec.top;
      check(near(actualX, world[0] * 120) && near(actualY, world[1] * 120), `Registered physical anchor ${recordId}`);
    }
  }
  log('PASS assets: 7 native PNGs; genuine alpha, uniform fit, transparent margins and true floor/wall anchors');
  const originals = [...manifest.assets, ...manifest.sourceHistory];
  for (const entry of originals) {
    check(sha(path.resolve(here, '../assets', entry.file)) === entry.sha256, `Original hash ${entry.file}`);
    check(sha(path.resolve(here, '../assets', entry.prompt)) === entry.promptSha256, `Exact prompt hash ${entry.prompt}`);
    check(entry.generator === 'builtin image_gen' && entry.transparentBackground && entry.visualInspection.inspected && !entry.visualInspection.croppedMeaningfulEdges && !entry.visualInspection.textOrLogos && !entry.visualInspection.mediaCharacters && entry.visualInspection.cameraAccepted, `Builtin generation and visual inspection ${entry.file}`);
  }
  const actorsBaseline = read(path.join(here, 'actor-baseline.json'));
  check(same(data.characterMetrics, actorsBaseline.characterMetrics) && same(data.characters, actorsBaseline.characters) && same(data.pediatricPresentation,actorsBaseline.pediatricPresentation), 'Current authorized actor sources and presentation contract frozen');
  let actorPoseCount = 0;
  for (const item of Object.values(proof.actorHashes)) { check(sha(path.resolve(repo, item.path)) === item.sha256, `Actor source hash ${item.path}`); actorPoseCount++; }
  for (const item of Object.values(proof.reusedApproved)) check(sha(path.resolve(here, item.src)) === item.sha256, `Approved reused furniture hash ${item.src}`);
  log(`PASS source integrity: ${originals.length} original/prompt pairs; ${Object.keys(proof.reusedApproved).length} approved seating facings; ${actorPoseCount} actor poses`);
  const references = read(path.resolve(here, '../assets/reference-baseline.json'));
  const mismatches = Object.entries(references.files).filter(([file, hash]) => !fs.existsSync(path.resolve(repo, file)) || sha(path.resolve(repo, file)) !== hash).map(([file]) => file);
  check(!mismatches.length, 'Read-only MRI/Reading Room/Level 3/GS015/stand-in/lab preservation', mismatches);
  log(`PASS preservation: ${Object.keys(references.files).length} read-only reference files unchanged`);
  check(sha(path.join(here, 'lab.js')) === proof.rendererSha256 && sha(path.join(here, 'geometry.mjs')) === proof.geometrySha256, 'Renderer and geometry build hashes');
  check(sha(path.join(here, 'data.json')) === proof.dataSha256 && sha(path.resolve(here, '../assets/prepared/metadata.json')) === proof.preparedMetadataSha256 && sha(path.join(here, 'layout-baseline.json')) === proof.layoutBaselineSha256 && sha(path.join(here, 'actor-baseline.json')) === proof.actorBaselineSha256, 'Built data/layout/actor/preparation hashes');
  const segments=G.roomSegments(room),north=segments.filter(s=>s[0]==='N');
  check(segments.length===16&&new Set(segments).size===16,'All sixteen wall segments usable as doors');
  const doorCases=[[],...segments.map(s=>[s]),segments];let states=0,routes=0,routeSamples=0,walkingSamples=0,transitionCount=0;
  const failures=[],approaches=new Map(),seatStops=new Set();
  const bands=[];for(const record of room.records){const id=design.DESIGN_ASSETS[record.assetId].preparedId,entry=metadata.assets[id];if(!entry||entry.anchorKind!=='floor')continue;
   const image=decoded[id],d=G.fixturePlacement(record,entry),rects=[],bottom=entry.outputOpaqueBounds.bottom;
   for(let y=Math.max(0,bottom-7);y<=bottom;y++)for(let x=0;x<entry.canvas[0];x++)if(image.pixels.data[(y*entry.canvas[0]+x)*4+3]>=160)rects.push([d.x/120+x*d.w/entry.canvas[0]/120,d.y/120+y*d.h/entry.canvas[1]/120,d.w/entry.canvas[0]/120,d.h/entry.canvas[1]/120]);
   bands.push({record,rects});
  }
  const hit=(x,y,r)=>{const dx=x-Math.max(r[0],Math.min(x,r[0]+r[2])),dy=y-Math.max(r[1],Math.min(y,r[1]+r[3]));return dx*dx+dy*dy<G.ACTOR_RADIUS*G.ACTOR_RADIUS-1e-10;};
  for(let mask=0;mask<16;mask++)for(const doors of doorCases){
   const backed=north.filter((_,i)=>mask&(1<<i)),P={room,doors:new Set(doors),backed:new Set(backed)},current=G.computeRoutes(P,nav,data.previewBaseClearances),targets=G.routeTargets(P);
   if(current.length!==doors.length*targets.length)failures.push('Missing target count '+mask+'/'+doors);
   const blockers=G.fineBlockers(P,nav,data.previewBaseClearances),active=bands.filter(b=>G.visible(b.record,P.doors,P.backed));
   for(const route of current){if(!route.path||!route.walkingPath){failures.push({mask,door:route.door,target:route.target.id,unreachable:true});continue;}
    if(route.routeModel!=='private-footprint-seating'||!route.walkingPath.at(-1).every((v,i)=>near(v,route.target.approach[i])))failures.push('Wrong route contract '+route.target.id);
    for(let i=1;i<route.walkingPath.length;i++){const a=route.walkingPath[i-1],b=route.walkingPath[i],steps=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.025));
     for(let k=0;k<=steps;k++){const x=a[0]+(b[0]-a[0])*k/steps,y=a[1]+(b[1]-a[1])*k/steps;walkingSamples++;
      if(x<G.ACTOR_RADIUS-1e-8||y<G.ACTOR_RADIUS-1e-8||x>4-G.ACTOR_RADIUS+1e-8||y>4-G.ACTOR_RADIUS+1e-8||blockers.some(({footprint:f})=>hit(x,y,[f.left,f.top,f.width,f.height])))failures.push('Radius/footprint collision '+route.door+'/'+route.target.id);
      // Independent exact prepared opaque pixels, not the routing envelope.
      if(active.some(band=>band.rects.some(r=>hit(x,y,r))))failures.push('Actual base pixel collision '+route.door+'/'+route.target.id);
     }
    }
    if(route.target.supportId){transitionCount++;const t=route.seatingTransition,s=room.supports.find(s=>s.id===route.target.supportId);
     if(!t||t.kind!=='static-seat-contact-not-walking'||!same(t.fromWorld,route.standingApproach)||!same(t.toWorld,[s.seat.x,s.seat.y]))failures.push('Missing static seating contact '+route.target.id);
     const key=doors.join(',')+'|'+route.door+'/'+s.id;seatStops.add(route.door+'/'+s.id);approaches.set(key,{doors,door:route.door,supportId:s.id,standingStopWorld:route.standingApproach,seatWorld:t.toWorld,actorRadius:.18,kind:t.kind});
    }else if(route.seatingTransition)failures.push('Care target marked as seated');
   }
   routeSamples+=G.sampleRoutes(current,()=>{});
   if(G.decorConflicts(P,nav,current).length||G.doorZoneViolations(P).length)failures.push('Doorway/decor conflict '+mask+'/'+doors);
   for(const r of room.records)if(G.visible(r,P.doors,P.backed)!==TU.isTouchupRecordVisible(r,P.doors,P.backed))failures.push('Visibility mismatch '+r.id);
   states++;routes+=current.length;
  }
  check(!failures.length,'All door/backing/route/actual-base cases',failures.slice(0,12));
  check(states===288&&routes===4560,'Expanded layout exhausts all 288 states and 4560 visible-target routes');
  check(approaches.size===253&&seatStops.size===141,'Every visible seat gets a distinct door/standing approach',{approaches:approaches.size,seatStops:seatStops.size});
  fs.writeFileSync(path.join(out,'seat-approaches.json'),JSON.stringify({kind:'Radius-clear walking ends before separate static seated contact; all nine seats',cases:[...approaches.values()]},null,2)+'\n');
  const lowerBaseSamples=walkingSamples,seatTransitionSamples=transitionCount,footprintWalkingSamples=walkingSamples;
  log('PASS doors/routes: 16 segments; '+states+' door/backing states; '+routes+' visible-target routes; '+routeSamples+' rendered path samples');
  log('PASS walking clearances: '+walkingSamples+' radius-clear samples against footprints and decoded opaque base pixels; '+seatStops.size+' door/seat pairs');
  log('PASS seating transitions: '+transitionCount+' static contacts explicitly separate from walking; all 9 seats have clear approaches');
  const P = { room, doors: new Set(), backed: new Set(), ox: 0, oy: 0 }, placements = G.actorPlacements(P, data);
  check(placements.length === 5 && placements.filter(x => x.group === 'parents').length === 2 && placements.filter(x => x.group === 'children').length === 3, 'Two parents and three actual pediatric children; vacant ordinary seats');
  for (const actor of placements) {
    check(near(actor.x + actor.w * actor.renderSeatContact[0] / actor.sourceSize[0], actor.seat.x * 120) && near(actor.y + actor.h * actor.renderSeatContact[1] / actor.sourceSize[1], actor.seat.y * 120), `Actual source hip registration ${actor.id}`);
    if (actor.group === 'children' && revision.children.find(c=>c.supportId===actor.id).seatType==='kid-stool') {
      check(actor.py > room.records.find(x => x.id === 'kidsTable').worldLocalGround[1] && near(actor.ground.y, 2.66), `Child draws after table ${actor.id}`);
      check((actor.id === 'kidWest' && actor.direction === 'east') || (actor.id === 'kidEast' && actor.direction === 'west'), `Child faces table ${actor.id}`);
    }
  }
  const stool = metadata.assets['kid-stool'];
  check(Math.abs(stool.measuredSeatRiseProofPixels - 37.2) <= contract.assets['kid-stool'].seatToleranceProofPixels, 'Original native stool preparation remains registered; private instance scale is separately validated');
  check(G.actorPlacements(P, data, { parents: false, children: true }).length === 3 && G.actorPlacements(P, data, { parents: true, children: false }).length === 2, 'Independent parent and child controls');
  check(G.actorPlacements(P, data, { parents: false, children: false }).length === 0, 'Empty occupancy');
  const presentation = await (await import('./validate-presentation.mjs')).validatePresentation({G,I,room,data,metadata,here,repo});
  for (const result of presentation.checks) check(result.pass,result.name,result.details);
  fs.writeFileSync(path.join(out,'presentation-revision-report.json'),JSON.stringify(presentation,null,2)+'\n');
  const chairs=await(await import('./validate-chairs.mjs')).validateChairs({G,I,room,data,proof,design,here,repo});for(const result of chairs.checks)check(result.pass,result.name,result.details);
  fs.writeFileSync(path.join(out,'chair-layering-report.json'),JSON.stringify(chairs,null,2)+'\n');
  log('PASS seats: 2 parents; ages 5/9 on stools, age 14 on ordinary chair; 5 ordinary seats / 4 stools; measured hip contacts');
  log('PASS armrests: approved east/west front wood pixel identity; actual renderer order and occupant occlusion; west parent refitted to cushion');
  log('PASS presentation: 3 readable toy blocks; visible prints/clock; larger east chest/west bin; 4 bulk buttons redraw correctly');
  const intake=read(path.join(here,'revisions/revision-2-intake.json')),externalChanges=Object.entries(intake.external).filter(([f,h])=>sha(path.resolve(here,'..',f))!==h);
  check(!externalChanges.length,'Manager revision1 browser evidence preserved',externalChanges);
  for (const file of ['validate-browser.cjs','capture.cjs']) { new vm.Script(fs.readFileSync(path.join(here, file), 'utf8')); check(true, `Browser script syntax ${file}`); }
  const html = fs.readFileSync(path.join(here, 'index.html'), 'utf8');
  check(html.includes('width=device-width') && html.includes('@media(max-width:360px)') && html.includes('minmax(0,1fr)'), '320px responsive constraints present; browser execution pending');
  log('PENDING manager: browser validation, keyboard/controls, 320px overflow and browser capture scripts (not run in worker sandbox)');
  const report={status:'PASS',kind:'Node-only validation',presentationRevision:2,browserValidation:'pending_manager_rerun',checks:checks.length,assetCount:7,originalPromptPairs:originals.length,preservedReferences:Object.keys(references.files).length,actorPoses:actorPoseCount,segments:16,doorBackingStates:states,routes,routeSamples,lowerBaseSamples,footprintWalkingSamples,standingToSeatApproaches:seatStops.size,distinctDoorSeatStandingStops:approaches.size,finalSeatContactSamples:seatTransitionSamples,seatRiseProofPixels:revision.stool.seatRiseProofPixels,ordinarySeats:5,kidStools:4,designApproval:false,runtimeIntegrated:false,details:checks,limits:['Private expanded layout intentionally uses radius-clear footprint routes for all targets; original shared navigation and historical parity evidence remain frozen.','Static contact to seat is separate from walking; no seating animation is implemented.','Projected opaque base pixels constrain a 2D review, not a physical 3D model.','Unrelated generated-registry edits occurred concurrently; selected pediatric entries and all pose pixels are guarded.','Actual browser DOM/keyboard, 320px overflow, Chrome layering and captures require manager execution.']};
  fs.writeFileSync(path.join(out, 'validation-report.json'), JSON.stringify(report, null, 2) + '\n');
  log(`VALIDATION PASS ${checks.length} Node checks; browser validation pending`);
  fs.writeFileSync(path.join(out, 'validation.log'), lines.join('\n') + '\n');
})().catch(error => {
  log('VALIDATION FAIL ' + error.message);
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'validation-report.json'), JSON.stringify({ status: 'FAIL', kind: 'Node-only validation', error: error.message, details: checks }, null, 2) + '\n');
  fs.writeFileSync(path.join(out, 'validation.log'), lines.join('\n') + '\n');
  console.error(error.stack); process.exitCode = 1;
});
