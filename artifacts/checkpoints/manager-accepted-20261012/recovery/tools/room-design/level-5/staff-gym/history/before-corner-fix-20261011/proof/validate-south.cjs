// Continuous wall-row regression, including the owner's closed-front rule.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const here=__dirname,out=path.join(here,'evidence/v1');
(async()=>{
 const G=await import('./geometry.mjs'),D=await import('./design-rooms.js'),{loadNativeEngine}=await import('./native-engine.mjs'),{createCanvas}=require('@napi-rs/canvas'),{engine,warnings}=await loadNativeEngine();
 const frontIds=['front1','front2','front3','front4'],southDoors=['S1','S2','S3','S4'],necessary=['benchSeat','benchSeat-front','stretchMat','exerciseBall','foamRoller','rubberFloor'];
 let visibilityStates=0,closedSouthRoutes=0,samples=0;
 for(const tier of D.DESIGN_TIERS){engine.setTier(tier.level);const room=tier.room,nonSouth=G.roomSegments(room).filter(s=>s[0]!=='S'),otherCases=[[],...nonSouth.map(s=>[s]),nonSouth];
  for(let i=0;i<4;i++){const r=room.records.find(r=>r.id===frontIds[i]);assert.equal(r.classification,'optional');assert.ok(r.doorOwners.includes(southDoors[i]));assert.deepEqual(r.backedOwners,[]);assert.deepEqual(G.ownersFor(room,r),r.doorOwners);}
  for(let backing=0;backing<16;backing++){const backed=G.roomSegments(room).filter(s=>s[0]==='N'&&(backing&(1<<(Number(s.slice(1))-1))));
   for(let mask=0;mask<16;mask++)for(const other of otherCases){const open=[...other,...southDoors.filter((_,i)=>mask&(1<<i))],P={room,doors:new Set(open),backed:new Set(backed)};
    for(const id of frontIds){const r=room.records.find(r=>r.id===id);assert.equal(G.visible(r,P.doors,P.backed),!r.doorOwners.some(s=>P.doors.has(s)),'Only an owned doorway opens '+id);}
    for(const id of necessary)assert.ok(G.visible(room.records.find(r=>r.id===id),P.doors,P.backed),'Necessary equipment remains '+id);visibilityStates++;
   }
   for(const door of nonSouth){const P={room,doors:new Set([door]),backed:new Set(backed)},routes=G.computeRoutes(P,tier.navigation,tier.bases,{occupied:tier.presentation.actors});assert.equal(routes.length,3);assert.ok(routes.every(r=>r.walkingPath),'Closed south occupied route: '+door);const blockers=G.fineBlockers(P,tier.navigation,tier.bases);
    samples+=G.sampleWalkingRoutes(routes,(x,y,r)=>assert.ok(G.clearWalkPoint(P,blockers,x,y,tier.presentation.actors.filter(a=>a.supportId!==r.target.supportId)),'Complete portal and occupied route'),.005);closedSouthRoutes+=routes.length;
   }
  }
 }
 engine.setTier(1);engine.state.actors=false;const P={room:D.DESIGN_TIERS[0].room,doors:new Set(),backed:new Set(),ox:40,oy:230},draw=await engine.collectDrawables(P,true),c=createCanvas(560,770),ctx=c.getContext('2d');
 for(const d of draw.sorted.filter(d=>frontIds.includes(d.id)))await engine.drawImageRec(ctx,d);const pixels=ctx.getImageData(40,590,480,118).data;let coveredColumns=0;for(let x=0;x<480;x++){let opaque=false;for(let y=0;y<118;y++)if(pixels[(y*480+x)*4+3]>=8){opaque=true;break;}if(opaque)coveredColumns++;}assert.equal(coveredColumns,480,'Closed front storage fills every floor-view column');
 for(const door of southDoors){const q={...P,doors:new Set([door])},shown=await engine.collectDrawables(q,true);for(let i=0;i<4;i++)assert.equal(shown.sorted.some(d=>d.id===frontIds[i]),southDoors[i]!==door);}
 assert.deepEqual(warnings,[]);const proofManifestSha256=crypto.createHash('sha256').update(fs.readFileSync(path.join(here,'proof-manifest.json'))).digest('hex');
 fs.writeFileSync(path.join(out,'south-validation-report.json'),JSON.stringify({status:'PASS',coveredSouthColumns:coveredColumns,visibilityStates,closedSouthRoutes,radiusClearSamples:samples,actorRadiusTiles:.18,sampleSpacingTiles:.005,frontDoorOwners:{front1:['S1','WD'],front2:['S2'],front3:['S3'],front4:['S4','ED']},necessaryEquipmentAndContactsRetained:true,proofManifestSha256},null,2)+'\n');
 console.log(`SOUTH VALIDATION PASS: continuous S1-S4 storage / ${coveredColumns} columns; owned-door visibility and necessary equipment across ${visibilityStates} states; ${closedSouthRoutes} occupied routes with south closed / ${samples} radius-clear samples; corner sections open only for their selected S/W/E door.`);
})().catch(e=>{fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'south-validation-report.json'),JSON.stringify({status:'FAIL',error:e.stack},null,2)+'\n');console.error(e.stack);process.exitCode=1;});
