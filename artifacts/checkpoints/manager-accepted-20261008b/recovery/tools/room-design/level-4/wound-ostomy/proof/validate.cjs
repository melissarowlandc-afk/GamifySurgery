// Node asset, preservation, door/route and actual renderer checks. No browser.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {pathToFileURL}=require('node:url');
const here=__dirname,repo=path.resolve(here,'../../../../..'),lane=path.resolve(here,'..'),out=path.join(here,'evidence');
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex').toUpperCase();
const read=f=>JSON.parse(fs.readFileSync(path.join(here,f),'utf8'));
let checks=0;const lines=[],counts={};
const ok=(v,m)=>{assert.ok(v,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},log=s=>{lines.push(s);console.log(s);};
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const G=await import(pathToFileURL(path.join(here,'geometry.mjs'))),D=await import(pathToFileURL(path.join(here,'design-rooms.js'))),U=await import(pathToFileURL(path.join(lane,'assets/image-utils.mjs'))),{createCanvas}=await import('@napi-rs/canvas');
 const data=read('data.json'),manifest=read('proof-manifest.json'),contract=read('asset-contract.json'),gen=read('../assets/generation-manifest.json'),receipts=read('../assets/generation-receipts.json'),original=read('layout-baseline.json'),actorBaseline=read('actor-baseline.json'),presentation=read('presentation-contract.json'),reuse=read('../assets/reused/stool-contract.json'),room=D.DESIGN_ROOMS[0],nav=D.DESIGN_NAVIGATION[room.definitionId],metadata=D.PREPARED_METADATA;
 for(const k of ['footprint','floor','solids','shell'])eq(room[k],original.room[k],'Frozen room '+k);
 const cleanNav=structuredClone(nav);delete cleanNav.privateProofRouteModel;eq(cleanNav,original.navigation,'Frozen source navigation');
 eq(room.records.length,original.room.records.length,'No added furniture');
 for(const old of original.room.records){const r=room.records.find(r=>r.id===old.id);ok(r,'Fixture preserved '+old.id);for(const k of ['renderSizeTiles','worldLocalGround','destinationTopLeftTiles','footprint','depthPolicy','depthKey','canvasTransform','touchupKeepWhenBacked'])eq(r[k],old[k],'Frozen '+old.id+'/'+k);}
 for(const old of original.room.supports){const s=room.supports.find(s=>s.id===old.id);eq(s.authoredSeat,old.seat,'Authored seat retained');for(const k of ['ground','fixtureGround','facing','role','pose'])eq(s[k],old[k],'Support preserved '+s.id+'/'+k);}
 eq(gen.assets.length,5,'Five selected painted pieces');eq(gen.history.length,7,'Documented lamp refinement and owner chair revision');
 eq(Object.keys(metadata.assets).sort(),['dressing-cart','exam-lamp','hygiene-sign','ostomy-shelf','wound-recliner'],'Five native pieces');
 for(const entry of gen.history){
  const r=receipts.records.find(r=>r.generationId===entry.generationId),file=path.join(lane,'assets',entry.file),prompt=path.join(lane,'assets',entry.prompt);
  eq(sha(file),entry.sha256,'Original bytes '+entry.generationId);eq(sha(prompt),entry.promptSha256,'Prompt bytes '+entry.generationId);eq(fs.readFileSync(prompt,'utf8'),r.sentPrompt,'Exact sent prompt '+entry.generationId);
  ok(r.transparentBackground&&r.tool==='built-in image_gen'&&r.inspection,'Built-in request inspected');
  const raw=await U.decode(file),b=U.bounds(raw.pixels.data,raw.canvas.width,raw.canvas.height,8);eq([raw.canvas.width,raw.canvas.height],entry.size,'Original dimensions');ok(b&&b.edgeAlphaMax<8,'No meaningful original clipping');
  for(const ref of entry.references)eq(sha(path.join(repo,ref.path)),ref.sha256,'Generation edit input preserved');
 }
 for(const entry of gen.assets){
  const m=metadata.assets[entry.id],spec=contract.assets[entry.id],file=path.join(lane,'assets/processed',m.file),im=await U.decode(file),b=U.bounds(im.pixels.data,...m.canvas,160),all=U.bounds(im.pixels.data,...m.canvas),alpha=U.alphaStats(im.pixels.data,...m.canvas);
  eq(sha(file),m.outputSha256,'Native hash '+entry.id);eq([im.canvas.width,im.canvas.height],spec.canvas,'Native size '+entry.id);ok(m.canvas[0]/m.widthTiles>=240&&m.canvas[1]/m.heightTiles>=240,'Native density');
  ok(alpha.transparent>0&&alpha.opaque>0&&alpha.min===0&&alpha.max>=250&&alpha.edgeAlphaMax===0,'Genuine alpha and clear edges');eq(b,m.outputOpaqueBounds,'Decoded opaque bounds');eq(all,m.outputAllAlphaBounds,'Decoded all-alpha bounds');
  ok(Object.values(m.alphaClearancePixels).every(v=>v>=4),'Intact transparent margins');eq(m.canvasAnchor,[m.canvas[0]/2,m.anchorKind==='floor'?b.bottom+1:all.top],'Actual alpha anchor');
  ok(m.aspectPreserved&&!m.sourceUpscaled&&m.alphaCleanup.meaningfulPixelsRemoved===0&&m.alphaCleanup.maxRemovedAlpha<8,'Uniform technical preparation');
  const r=room.records.find(r=>r.assetId===spec.assetId),d=G.fixturePlacement(r,m),world=r.worldLocalGround??[r.destinationTopLeftTiles[0]+r.renderSizeTiles[0]/2,r.destinationTopLeftTiles[1]];
  ok(Math.abs(d.x+m.canvasAnchor[0]*d.w/m.canvas[0]-world[0]*120)<1e-8&&Math.abs(d.y+m.canvasAnchor[1]*d.h/m.canvas[1]-world[1]*120)<1e-8,'Frozen world registration');
 }
 log('PASS assets: 5 transparent native PNGs; uniform fit, minimum 240 px/tile, intact alpha margins and registered floor/wall anchors');
 const baseline=read('../assets/reference-baseline.json').files,concurrentChanges=[];let unchanged=0,attributed=0;
 // Other workers and the manager own mutable exam proof/code/evidence. Guard
 // actual style art/stand-ins/shared inputs strictly; record those known proof
 // revisions without coupling this proof to later manager browser captures.
 const exam='tools/room-design/level-4/pediatric-exam/';
 const concurrentPath=rel=>rel.startsWith(exam+'proof/')||[exam+'README.md',exam+'assets/provenance.md',exam+'assets/write-provenance.mjs'].includes(rel);
 for(const [rel,intake]of Object.entries(baseline)){
  const current=sha(path.join(repo,rel));if(current===intake){unchanged++;checks++;continue;}
  ok(concurrentPath(rel),'Protected art/shared source changed '+rel);attributed++;concurrentChanges.push({path:rel,intake,current,attribution:'Concurrent manager-assigned Pediatric Exam twelve-door/backless-stool revisions and manager evidence; observed, not accepted or modified by this worker'});
 }
 fs.writeFileSync(path.join(out,'concurrent-reference-changes.json'),JSON.stringify({date:'2026-10-08',basis:'Owner/manager record in owner-requests-20261008.md and current Pediatric Exam handoff. Only the exam code/proof/docs/evidence are mutable; original/processed art, prompts, stand-ins and every other protected input remain strict.',changed:concurrentChanges},null,2)+'\n');
 for(const [key,e]of Object.entries(actorBaseline.actorHashes))eq(sha(path.join(repo,e.path)),e.sha256,'Selected real pose '+key);
 for(const [field,file]of Object.entries({layoutBaselineSha256:'layout-baseline.json',actorBaselineSha256:'actor-baseline.json',presentationContractSha256:'presentation-contract.json',dataSha256:'data.json',rendererSha256:'lab.js',geometrySha256:'geometry.mjs',preparedMetadataSha256:'../assets/processed/metadata.json'}))eq(sha(path.join(here,file)),manifest[field],'Proof manifest '+field);
 for(const a of Object.values(manifest.reusedApproved))eq(sha(path.resolve(here,a.src)),a.sha256,'Reused fixture hash');
 eq(sha(path.join(repo,reuse.sourcePath)),reuse.sourceSha256,'Approved stool atlas unchanged');eq(sha(path.join(lane,'assets/reused',reuse.copiedContractFile)),reuse.copiedContractSha256,'Exact native contract copy');eq(sha(path.join(lane,'assets/reused',reuse.file)),reuse.outputSha256,'Backless PNG hash');
 const source=await U.decode(path.join(repo,reuse.sourcePath)),[sx,sy,sw,sh]=reuse.sourceRect,input=source.context.getImageData(sx,sy,sw,sh).data;
 const nativeContract=await import(pathToFileURL(path.join(lane,'assets/reused/backlessRollingStools.ts'))),expected=nativeContract.deriveBacklessRollingStoolPixels(input,sw,sh,reuse.derivation),derived=await U.decode(path.join(lane,'assets/reused',reuse.file));
 eq([derived.canvas.width,derived.canvas.height],[sw,sh],'Stool crop dimensions retained');
 // Canvas PNG encoding loses RGB under alpha=0; compare every visible channel.
 let identicalVisible=0;for(let i=0;i<expected.length;i+=4){if(derived.pixels.data[i+3]!==expected[i+3])throw Error('Backless alpha differs');if(expected[i+3]>=250){for(let c=0;c<3;c++)if(Math.abs(derived.pixels.data[i+c]-expected[i+c])>(expected[i+3]===255?0:2))throw Error('Native RGB differs beyond PNG premultiplication rounding');identicalVisible++;}}ok(identicalVisible>10000,'Native visible pixels match; semi-alpha RGB tolerance 2 for PNG premultiplication');
 for(let y=0;y<reuse.derivation.removeAboveY;y++)for(let x=0;x<sw;x++)if(derived.pixels.data[(y*sw+x)*4+3])throw Error('Stool backrest remains');ok(reuse.preservedPixels===81009&&reuse.restoredPixels===4995,'Recipe keeps unaffected source pixels');
 counts.unchangedReferences=unchanged;counts.concurrentReferences=attributed;counts.actorPoses=Object.keys(actorBaseline.actorHashes).length;counts.backlessVisiblePixels=identicalVisible;
 log('PASS integrity: 7 exact original/prompt pairs; '+counts.actorPoses+' real character poses; '+unchanged+' references unchanged; '+attributed+' concurrent exam-worker changes attributed');
 log('PASS reused stool: native backless-v1, 266x427; 81009 untouched source pixels; 4995 covered body pixels restored; no source-atlas edit');
 const segments=G.roomSegments(room),north=['N1','N2','N3'];eq(segments,['N1','N2','N3','S1','S2','S3','WA','WB','WC','EA','EB','EC'],'All game door labels');eq([presentation.doorModel.count,presentation.doorModel.perWall,presentation.doorModel.spanTiles,presentation.doorModel.kind],[12,3,1,'game-one-tile'],'Owner door model');eq(manifest.doorModel,presentation.doorModel,'Manifest door model');
 for(const side of ['N','S','W','E'])eq(segments.filter(s=>s[0]===side).map(s=>{const p=G.segmentSpan(room,s);return[p.start,p.end,p.length];}),[[0,1,1],[1,2,1],[2,3,1]],'Whole wall, one-tile sections');
 const owners={recliner:[],lamp:[],stool:[],sink:['N1','WA'],ostomyShelf:['N2','N3'],dressingCart:['S3','EC'],curtain:['WC'],bio:['S1','WC'],hygieneSign:['N3']};
 for(const [id,list]of Object.entries(owners)){const r=room.records.find(r=>r.id===id);eq(r.doorOwners,list,'Own sections '+id);for(const s of segments)eq(G.visible(r,new Set([s]),new Set()),!list.includes(s),'Own doorway hide '+id+'/'+s);ok(G.visible(r,new Set(),new Set()),'Restores '+id);}
 eq(G.passableThroughDoors({room,doors:new Set(segments)},nav).map(x=>[x.door,x.fixture]),[['WB','recliner']],'Frozen WB threshold exception');
 let states=0,routes=0,samples=0,transitions=0;
 for(let mask=0;mask<8;mask++)for(const doors of [[],...segments.map(s=>[s]),segments]){
  const backed=north.filter((_,i)=>mask&(1<<i)),P={room,doors:new Set(doors),backed:new Set(backed)},r=G.computeRoutes(P,nav,data.previewBaseClearances),c=G.check(room,nav,doors,backed,data.previewBaseClearances),blockers=G.fineBlockers(P,nav,data.previewBaseClearances);states++;routes+=r.length;
  eq([c.unreachable,c.conflicts,c.doorZone],[[],[],[]],'All entry/backing routes clear');samples+=G.sampleWalkingRoutes(r,(x,y)=>{if(!G.clearPoint(P,blockers,x,y))throw Error('Walking radius conflict');});
  for(const route of r){eq(route.walkingPath[0],G.doorInsideWorld(room,route.door),'Entry inside-tile center');eq(route.walkingPath.at(-1),route.standingApproach,'Clear walking approach');if(route.seatingTransition){eq(route.seatingTransition.kind,'static-seating-contact-not-walking','Static seat separate');transitions++;}}
 }
 eq([states,routes,samples,transitions],[112,576,93928,384],'Route matrix totals');
 let pairs=0;for(let a=0;a<segments.length;a++)for(let b=a+1;b<segments.length;b++){
  const P={room,doors:new Set([segments[a],segments[b]]),backed:new Set()},combined=G.fineBlockers(P,nav,data.previewBaseClearances).map(x=>x.id);
  for(const s of P.doors){const single=G.fineBlockers({...P,doors:new Set([s])},nav,data.previewBaseClearances).map(x=>x.id);ok(combined.every(id=>single.includes(id)),'Door pair only removes blockers');}pairs++;
 }
 Object.assign(counts,{states,routes,walkingSamples:samples,staticSeatTransitions:transitions,doorPairs:pairs});
 log('PASS doors/routes: 12 one-tile sections; 112 door/backing states; 576 routes; 93928 radius-clear walking samples; 66 monotonic door pairs');
 const P={room,doors:new Set(),backed:new Set(),ox:0,oy:0},actors=G.actorPlacements(P,data,{patients:true,clinicians:true});eq(actors.map(a=>[a.characterId,a.category,a.direction]),[['patient.adult.007','patient','east'],['gs026-employee-001','employee','west']],'Real opposing patient and clinician');
 for(const a of actors){const fit=presentation.actors.find(f=>f.supportId===a.id),pose=data.characters.find(c=>c.id===a.characterId).poses.sit[a.direction],im=await U.decode(path.join(repo,'apps/player/public',pose.url)),[x,y]=fit.seatContactSource;ok(im.pixels.data[((y-1)*pose.width+x)*4+3]>=160&&im.pixels.data[(y*pose.width+x)*4+3]<160,'Measured posterior edge');ok(Math.abs(a.x+x*a.sourceScale-fit.seat[0]*120)<1e-8&&Math.abs(a.y+y*a.sourceScale-fit.seat[1]*120)<1e-8,'Exact rendered hip');}
 const rm=metadata.assets['wound-recliner'],ri=await U.decode(path.join(lane,'assets/processed/wound-recliner.png')),point=rm.calibratedPoints.seat;ok(ri.pixels.data[(Math.round(point[1])*rm.canvas[0]+Math.round(point[0]))*4+3]>=160,'Actual blue recliner cushion contact');
 const {engine,warnings}=await(await import(pathToFileURL(path.join(here,'native-engine.mjs')))).loadNativeEngine(),draw=await engine.collectDrawables(P,true),ordered=[...draw.sorted].sort((a,b)=>a.py-b.py),index=(id,kind)=>ordered.findIndex(d=>d.id===id&&d.kind===kind);
 ok(index('recliner','fixture')<index('recliner:patient','actor'),'Patient above recliner');ok(index('stool','fixture')<index('stool:clinician','actor'),'Entire clinician above backless stool');ok(!room.records.some(r=>r.overlayFor==='stool'),'No stool foreground mask');
 const canvas=createCanvas(480,480),g=canvas.getContext('2d'),paint=async d=>{g.clearRect(0,0,480,480);await engine.drawImageRec(g,d);return g.getImageData(0,0,480,480).data;};
 const stoolDraw=ordered.find(d=>d.id==='stool'&&d.kind==='fixture'),clinDraw=ordered.find(d=>d.id==='stool:clinician'),sp=await paint(stoolDraw),ap=await paint(clinDraw);g.clearRect(0,0,480,480);await engine.drawImageRec(g,stoolDraw);await engine.drawImageRec(g,clinDraw);const composite=g.getImageData(0,0,480,480).data;let overlap=0;
 for(let i=0;i<ap.length;i+=4)if(ap[i+3]>=250&&sp[i+3]>=250){const a=ap[i+3]/255,b=sp[i+3]/255,oa=a+b*(1-a);for(let c=0;c<3;c++){const expectedColor=Math.round((ap[i+c]*a+sp[i+c]*b*(1-a))/oa);ok(Math.abs(composite[i+c]-expectedColor)<=2,'Clinician-over-stool source-over blend');}ok(Math.abs(composite[i+3]-Math.round(oa*255))<=1,'Source-over alpha');overlap++;}ok(overlap>20,'Real renderer stool/clinician overlap');
 const patientDraw=ordered.find(d=>d.id==='recliner:patient'),reclinerDraw=ordered.find(d=>d.id==='recliner'&&d.kind==='fixture'),pp=await paint(patientDraw),rp=await paint(reclinerDraw);let patientOverlap=0;for(let i=3;i<pp.length;i+=4)if(pp[i]>=250&&rp[i]>=250)patientOverlap++;ok(patientOverlap>20,'Patient visibly contacts actual recliner');
 const low=await engine.collectDrawables({...P,backed:new Set(north)},true);for(const id of ['ostomyShelf','sink']){const a=[...draw.wall,...draw.sorted].find(d=>d.id===id),b=[...low.wall,...low.sorted].find(d=>d.id===id);ok(a&&b,'Floor fixture retained on low wall');for(const k of ['x','y','w','h'])eq(a[k],b[k],'Full-height backing '+id+'/'+k);ok(b.clipTop===undefined,'No floor shelf clipping');}
 eq(warnings,[],'Actual renderer warnings');Object.assign(counts,{clinicianAboveStoolOverlap:overlap,patientReclinerOverlap:patientOverlap});
 fs.writeFileSync(path.join(out,'seat-layer-report.json'),JSON.stringify({actors,patientReclinerOverlap:patientOverlap,clinicianAboveStoolOverlap:overlap,entireClinicianAboveStool:true,stoolHasBack:false,order:ordered.map(d=>({id:d.id,kind:d.kind,py:d.py})),fullHeightOnLowWall:['ostomyShelf','sink'],note:'Existing seated stills retain their bent-leg poses. No character repaint or leg extension.'},null,2)+'\n');
 log('PASS seats/layers: existing patient east and clinician west; '+patientOverlap+' recliner/patient overlap pixels; '+overlap+' clinician pixels verified above backless stool; full-height low-wall shelf');
 // Compare the requested narrow correction against the immutable owner-reviewed
 // evidence. Walking is identical; only the static patient contact is refitted.
 const revision=read('owner-revision.json'),archive=path.join(here,'revisions/20261008-before-leg-rest-removal'),review=JSON.parse(fs.readFileSync(path.join(archive,'baseline.json'),'utf8'));
 const prior=f=>JSON.parse(fs.readFileSync(path.join(archive,f),'utf8'));
 eq(sha(path.join(here,'owner-revision.json')),manifest.ownerRevisionSha256,'Pinned owner instruction');eq(manifest.ownerRevision,revision,'Owner revision receipt');eq(review.proofManifestSha256,revision.baselineManifestSha256,'Original manager review manifest');
 let archived=0;for(const f of review.files){const p=path.join(archive,f.path);if(fs.existsSync(p)){eq(sha(p),f.sha256,'Archived review bytes '+f.path);archived++;}}
 const oldMetadata=prior('assets/processed/metadata.json'),oldData=prior('proof/data.json'),oldPresentation=prior('proof/presentation-contract.json');
 const oldDesign=await import(pathToFileURL(path.join(archive,'proof/design-rooms.js'))),oldRoom=oldDesign.DESIGN_ROOMS[0],oldNav=oldDesign.DESIGN_NAVIGATION[oldRoom.definitionId];
 eq(sha(path.join(here,'geometry.mjs')),review.files.find(f=>f.path==='proof/geometry.mjs').sha256,'Reviewed route/control geometry unchanged');
 for(const id of ['exam-lamp','ostomy-shelf','dressing-cart','hygiene-sign'])eq(metadata.assets[id].outputSha256,oldMetadata.assets[id].outputSha256,'Reviewed other painted piece unchanged '+id);
 for(const f of ['assets/reused/rolling-stool-backless.png','assets/reused/stool-contract.json','assets/reused/backlessRollingStools.ts','proof/layout-baseline.json','proof/actor-baseline.json','proof/shell-painter.js','proof/browser-errors.cjs'])eq(sha(path.join(lane,f)),review.files.find(x=>x.path===f).sha256,'Reviewed source preserved '+f);
 eq(presentation.actors[1],oldPresentation.actors[1],'Entire reviewed clinician registration unchanged');eq(data.characters,oldData.characters,'Existing selected characters unchanged');
 eq([rm.canvas,rm.scale,rm.destination[0]],[oldMetadata.assets['wound-recliner'].canvas,oldMetadata.assets['wound-recliner'].scale,oldMetadata.assets['wound-recliner'].destination[0]],'Keep reviewed chair frame, uniform scale and left placement');
 eq(gen.assets.find(e=>e.id==='wound-recliner').generationId,'wound-recliner-02','Selected inspected leg-rest-free generation');
 eq([revision.chairHasLegRest,revision.patientStillRepainted],[false,false],'Chair-only art correction, no character painting');
 let removedAreaBefore=0,removedAreaAfter=0;const oldChair=await U.decode(path.join(archive,'assets/processed/wound-recliner.png'));
 for(let y=180;y<400;y++)for(let x=380;x<624;x++){const i=(y*624+x)*4+3;if(oldChair.pixels.data[i]>=160)removedAreaBefore++;if(ri.pixels.data[i])removedAreaAfter++;}
 ok(removedAreaBefore>10000&&removedAreaAfter===0,'Former extended-leg-rest area now entirely transparent');
 const patientShift=Math.hypot(...presentation.actors[0].seat.map((v,i)=>(v-oldPresentation.actors[0].seat[i])*120));ok(patientShift<1,'Patient refit stays within one reviewed proof pixel');
 let sameWalkingRoutes=0;for(let mask=0;mask<8;mask++)for(const doors of [[],...segments.map(s=>[s]),segments]){
  const backed=north.filter((_,i)=>mask&(1<<i)),current=G.computeRoutes({room,doors:new Set(doors),backed:new Set(backed)},nav,data.previewBaseClearances),previous=G.computeRoutes({room:oldRoom,doors:new Set(doors),backed:new Set(backed)},oldNav,oldData.previewBaseClearances);
  const walking=r=>({door:r.door,target:r.target.id,path:r.path,walkingPath:r.walkingPath,standingApproach:r.standingApproach,passThrough:r.passThrough});eq(current.map(walking),previous.map(walking),'Exact reviewed walking paths '+mask+'/'+doors.join(','));sameWalkingRoutes+=current.length;
 }
 const boxes=[G.fixturePlacement(oldRoom.records.find(r=>r.id==='recliner'),oldMetadata.assets['wound-recliner'],120,40,230),G.fixturePlacement(room.records.find(r=>r.id==='recliner'),rm,120,40,230),...G.actorPlacements({room:oldRoom,doors:new Set(),backed:new Set(),ox:40,oy:230},oldData).filter(a=>a.id==='recliner:patient'),...G.actorPlacements({...P,ox:40,oy:230},data).filter(a=>a.id==='recliner:patient')];
 const allowed={left:Math.floor(Math.min(...boxes.map(b=>b.x)))-2,top:Math.floor(Math.min(...boxes.map(b=>b.y)))-2,right:Math.ceil(Math.max(...boxes.map(b=>b.x+b.w)))+2,bottom:Math.ceil(Math.max(...boxes.map(b=>b.y+b.h)))+2};
 let unchangedOutsidePixels=0,changedChairPixels=0;for(const name of ['native-painted','native-empty']){
  const before=await U.decode(path.join(archive,'proof/evidence',name+'.png')),after=await U.decode(path.join(out,name+'.png'));eq([after.canvas.width,after.canvas.height],[before.canvas.width,before.canvas.height],'Reviewed native frame '+name);
  for(let y=0;y<after.canvas.height;y++)for(let x=0;x<after.canvas.width;x++){const i=(y*after.canvas.width+x)*4,same=[0,1,2,3].every(c=>before.pixels.data[i+c]===after.pixels.data[i+c]);if(x<allowed.left||x>allowed.right||y<allowed.top||y>allowed.bottom){if(!same)throw Error('Unrelated reviewed room pixel changed: '+name+'/'+x+','+y);unchangedOutsidePixels++;}else if(!same)changedChairPixels++;}
 }ok(unchangedOutsidePixels>400000&&changedChairPixels>1000,'Pixel-identical room outside chair and patient correction');
 Object.assign(counts,{archivedReviewFiles:archived,identicalReviewedWalkingRoutes:sameWalkingRoutes,unchangedOutsideChairPixels:unchangedOutsidePixels,patientRefitProofPixels:patientShift});
 fs.writeFileSync(path.join(out,'chair-revision-report.json'),JSON.stringify({status:'PASS',ownerRevisionSha256:manifest.ownerRevisionSha256,priorManifestSha256:revision.baselineManifestSha256,selectedGeneration:'wound-recliner-02',nativeFrame:rm.canvas,originalScale:rm.scale,removedAreaBefore,removedAreaAfter,patientRefitProofPixels:patientShift,patientSeat:presentation.actors[0].seat,clinicianRegistrationUnchanged:true,identicalReviewedWalkingRoutes:sameWalkingRoutes,unchangedOutsideChairPixels:unchangedOutsidePixels,changedChairPixels,allowedPixelRegion:allowed,archivedReviewFiles:archived,browserValidation:'pending_manager_rerun'},null,2)+'\n');
 log('PASS chair revision: no leg rest; reviewed 624x470 frame/scale; patient refit '+patientShift.toFixed(3)+' px; clinician unchanged; '+sameWalkingRoutes+' identical walking paths; '+unchangedOutsidePixels+' unchanged pixels outside chair/patient');
 const textFiles=[];function collect(dir){for(const name of fs.readdirSync(dir)){const f=path.join(dir,name);if(fs.statSync(f).isDirectory())collect(f);else if(/\.(json|mjs|cjs|js|ts|html|md|txt|log)$/.test(name))textFiles.push(f);}}collect(lane);textFiles.push(path.join(repo,'docs/execplans/level4-wound-ostomy-mockup-20261008.md'));
 for(const file of textFiles){const bytes=fs.readFileSync(file);ok(!(bytes[0]===239&&bytes[1]===187&&bytes[2]===191),'No UTF-8 BOM');new TextDecoder('utf-8',{fatal:true}).decode(bytes);checks++;}
 ok(!/\b(localStorage|sessionStorage|indexedDB)\b/.test(fs.readFileSync(path.join(here,'lab.js'),'utf8')),'No campaign storage');eq([manifest.designApproval,manifest.runtimeIntegration],[revision.status==='implemented',false],'Owner conditional design approval applies after the fix; no runtime integration');eq(gen.designApproval,manifest.designApproval,'Asset approval agrees with proof');counts.textFiles=textFiles.length;
 log('PASS provenance/presentation: frozen 3x3 geometry; plain packaged supplies; exact prompts/hashes; UTF-8 without BOM; no campaign storage');
 log('PENDING manager: browser validator and captures for revised manifest; owner conditional design approval recorded');log('VALIDATION PASS '+checks+' Node checks; revised browser validation pending');
 fs.writeFileSync(path.join(out,'validation.log'),lines.join('\n')+'\n');fs.writeFileSync(path.join(out,'validation-report.json'),JSON.stringify({status:'PASS',checks,counts,doorModel:presentation.doorModel,browserValidation:'pending_manager_rerun',ownerApproval:manifest.designApproval},null,2)+'\n');
})().catch(e=>{fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'validation-report.json'),JSON.stringify({status:'FAIL',checks,error:e.stack},null,2)+'\n');console.error(e.stack);process.exitCode=1;});
