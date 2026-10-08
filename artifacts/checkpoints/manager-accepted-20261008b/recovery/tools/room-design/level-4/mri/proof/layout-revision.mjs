// Private owner-authorized MRI geometry; never mutate the shared source room.
export function createMRIRevision(original, contract, metadata, data) {
  const room = structuredClone(original);
  const recordById = new Map(room.records.map(r=>[r.id,r]));
  const shelf = structuredClone(recordById.get('lockers'));
  shelf.id='openShelves'; shelf.assetId='design:mri:open-shelves';
  const activeIds=new Set(Object.keys(contract.assets).map(id=>'design:mri:'+id));
  room.records = room.records.filter(r=>activeIds.has(r.assetId));
  room.records.push(shelf);
  for (const rec of room.records) {
    const id=rec.assetId.split(':').at(-1), spec=contract.assets[id], prepared=metadata.assets[id];
    if(!spec)continue; // Existing project step-stool reference.
    delete rec.occupancy;
    const w=spec.widthTiles, h=w*spec.canvas[1]/spec.canvas[0];
    rec.sourceRect=[0,0,...spec.canvas]; rec.renderSizeTiles=[w,h];
    if(spec.ground){
      rec.worldLocalGround=[...(prepared?.worldAnchor||spec.ground)];
      const anchor=prepared?.canvasAnchor||[spec.canvas[0]/2,spec.canvas[1]];
      rec.destinationTopLeftTiles=[rec.worldLocalGround[0]-anchor[0]*w/spec.canvas[0],rec.worldLocalGround[1]-anchor[1]*h/spec.canvas[1]];
      if(rec.depthPolicy!=='wall')rec.depthKey=rec.worldLocalGround[1];
    }else rec.destinationTopLeftTiles=[spec.top[0]-w/2,spec.top[1]];
  }
  const gantry=room.records.find(r=>r.id==='gantry'), chair=room.records.find(r=>r.id==='operatorChair'), console=room.records.find(r=>r.id==='console');
  const shelves=room.records.find(r=>r.id==='openShelves'),cart=room.records.find(r=>r.id==='comfortCart');
  // Rear chair back is nearest the viewer; keep the tech's head/shoulders visible.
  chair.depthPolicy='authored-layer'; chair.depthKey=chair.worldLocalGround[1]+.01;
  shelves.footprint={left:shelves.worldLocalGround[0]-.31,top:3.74,width:.62,height:.14};
  cart.footprint={left:cart.worldLocalGround[0]-.31,top:3.74,width:.62,height:.14};
  room.solids=room.solids.map(s=>s.id==='gantry'?{...s,footprint:{left:2.42,top:1.30,width:1.54,height:gantry.worldLocalGround[1]-1.30}}:
    s.id==='console'?{...s,footprint:{left:console.worldLocalGround[0]-.36,top:console.worldLocalGround[1]-.35,width:.72,height:.35}}:
    s.id==='operator-chair'?{...s,footprint:{left:chair.worldLocalGround[0]-.17,top:chair.worldLocalGround[1]-.20,width:.34,height:.20}}:s);
  const couch=metadata.assets['table-empty'], couchSurfaceY=couch.worldAnchor[1]-couch.measuredRiseProofPixels/120;
  const bed=room.records.find(r=>r.id==='tableEmpty');
  const magnet=metadata.assets['gantry-side'];
  const boreX=magnet.worldAnchor[0]+(magnet.calibratedPoints.bore[0]-magnet.canvasAnchor[0])*magnet.proofScale/120;
  bed.depthPolicy='authored-layer'; bed.depthKey=gantry.worldLocalGround[1]+.01;
  bed.clipRightWorld=boreX;
  bed.boreEntry={x:boreX,y:couchSurfaceY};
  const patient=data.characters.find(c=>c.id==='patient.adult.001'),pose=patient.poses.sit.west,south=patient.poses.stand.south;
  const scale=Math.min(1,data.characterMetrics.visibleHeightCap/(south.anchors.floorY-south.visibleBounds.y));
  const patientRise=data.characterMetrics.widthInTiles*scale*(pose.anchors.floorY-pose.anchors.seatContactY)/160;
  const operator=room.supports.find(s=>s.id==='operator');
  operator.facing='north';
  operator.seat={x:chair.worldLocalGround[0],y:chair.worldLocalGround[1]-.33};
  operator.ground={x:chair.worldLocalGround[0],y:chair.worldLocalGround[1]}; operator.fixtureGround={...operator.ground};
  room.supports=[operator,
    {id:'patient-standing',role:'patient',character:'patient.adult.001',pose:'standing',facing:'north',seat:{x:2.45,y:3.30},ground:{x:2.45,y:3.30},fixtureGround:{x:2.45,y:3.30},occupancy:'standing'},
    {id:'patient-seated',role:'patient',character:'patient.adult.001',pose:'seated',facing:'west',seat:{x:2.18,y:couchSurfaceY},ground:{x:2.18,y:couchSurfaceY+patientRise},fixtureGround:{x:couch.worldAnchor[0],y:couch.worldAnchor[1]},painterDepth:gantry.worldLocalGround[1]+.02,occupancy:'seated',supportRecord:'tableEmpty',sourceSeatAnchor:pose.anchors.seatContactY}
  ];
  room.notes=[
    'Owner revision: the existing patient sits at the outer west end with feet hanging west; patient draws in front of both bed and MRI.',
    'The scanner is uniformly enlarged by one third and privately lowered to align its measured bore with the couch surface.',
    'The desk is20% larger, with the existing tech sitting south of it facing north.',
    'The bed forepart enters the measured center of the donut. Its east section disappears inside the scanner.',
    'Larger open shelves occupy the southwest corner; larger comfort cart is shifted left to stay inside the room.',
    'Every door remains available. Shelves hide for S1/WD, cart for S4/ED, cabinet for N4/EA, sign for N3 and scan light for N1.',
    'The full-height coil cabinet is retained on north backing. Floor, glass and safety line stay procedural and fully lit.',
    'The patient pose is deliberately simplified for this software-art candidate; no clinical teaching claim or runtime readiness is implied.'
  ];
  return room;
}
