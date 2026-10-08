// Independent decoded-pixel/contact and actual handler regression checks. No browser.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
export async function validatePresentation({ G, I, room, data, metadata, here, repo }) {
  const fits = data.pediatricPresentation, results = [], contacts = [];
  const check = (ok, name, details) => { results.push({ pass: !!ok, name, details }); if (!ok) throw new Error(name + ': ' + JSON.stringify(details)); };
  const close = (a,b,e=1e-6) => Math.abs(a-b)<=e;
  const actors = G.actorPlacements({ room, ox:0, oy:0 },data);
  const decodedActors = new Map();
  for(const actor of actors) decodedActors.set(actor.id,await I.decode(path.join(repo,'apps/player/public',actor.url)));
  const alphaAt = (actor,x,y) => {
    const image=decodedActors.get(actor.id),sx=Math.floor((x-actor.x)*image.canvas.width/actor.w),sy=Math.floor((y-actor.y)*image.canvas.height/actor.h);
    return sx<0||sy<0||sx>=image.canvas.width||sy>=image.canvas.height?0:image.pixels.data[(sy*image.canvas.width+sx)*4+3];
  };
  const projected = (actor,xy) => [actor.x+xy[0]*actor.sourceScale,actor.y+xy[1]*actor.sourceScale];
  const tableRecord=room.records.find(r=>r.id==='kidsTable'),tableMeta=metadata.assets['kids-table'],table=G.fixturePlacement(tableRecord,tableMeta);
  const tableFrontY=table.y+tableMeta.calibratedPoints.frontTabletop[1]*table.h/tableMeta.canvas[1];
  check(close(tableRecord.renderSizeTiles[0],.7)&&close(tableRecord.renderSizeTiles[1],55/120),'Original table width/height retained');
  check(close(actors.find(a=>a.id==='bench:seat-1').sourceScale,fits.sourceScale),'Pediatric scale matches parent source-pixel scale');
  for(const fit of fits.children) {
    const actor=actors.find(a=>a.id===fit.supportId),character=data.characters.find(c=>c.id===fit.characterId);
    const image=decodedActors.get(actor.id),opaque=I.bounds(image.pixels.data,image.canvas.width,image.canvas.height,160);
    const stand=await I.decode(path.join(repo,'apps/player/public',character.poses.stand.south.url));
    // Level 3 normalization treats alpha<13 as generated fringe. Measure the
    // retained silhouette, without removing or changing any source pixels.
    const visible=I.bounds(stand.pixels.data,stand.canvas.width,stand.canvas.height,13);
    check(character.category==='future-pediatric-presentation'&&visible.height===fit.standingHeightSourcePixels&&[184,211,234].includes(visible.height),`Actual pediatric source size/category ${actor.id}`,{id:character.id,height:visible.height,category:character.category});
    check(character.intendedVisualAge===fit.intendedVisualAge&&(fit.seatType==='kid-stool'?character.intendedVisualAge<10:character.intendedVisualAge>=10),`Age-appropriate seat ${actor.id}`,{age:character.intendedVisualAge,type:fit.seatType});
    check(close(actor.sourceScale,fits.sourceScale)&&close(actor.w/160,actor.h/320),`Uniform common pediatric scale ${actor.id}`);
    const [rx,ry,rw,rh]=fit.contactMeasurement.region;let posteriorBottom=-1;
    const contactColumn=fit.seatContactSource[0];
    check(contactColumn>=rx&&contactColumn<rx+rw,`Contact column inside inspected posterior region ${actor.id}`);
    for(let y=ry;y<ry+rh;y++)if(image.pixels.data[(y*image.canvas.width+contactColumn)*4+3]>=160)posteriorBottom=y;
    check(posteriorBottom+1===fit.seatContactSource[1],`Measured posterior alpha edge at contact column ${actor.id}`,{posteriorBottom,contact:fit.seatContactSource});
    const hip=projected(actor,fit.seatContactSource),floorEdge=opaque.bottom+1,floorY=actor.y+floorEdge*actor.sourceScale;
    const seatRecord=room.records.find(r=>r.id===fit.recordId),seatMeta=fit.seatType==='kid-stool'?metadata.assets['kid-stool']:null,seatDrawable=G.fixturePlacement(seatRecord,seatMeta);
    const point=seatMeta?seatMeta.calibratedPoints.seat:fit.chairSeatSource,frame=seatMeta?seatMeta.canvas:seatRecord.sourceRect.slice(2);
    const stoolSeat=[seatDrawable.x+point[0]*seatDrawable.w/frame[0],seatDrawable.y+point[1]*seatDrawable.h/frame[1]];
    check(close(hip[0],stoolSeat[0])&&close(hip[1],stoolSeat[1]),`Actual hip/furniture surface contact ${actor.id}`,{hip,seatSurface:stoolSeat});
    const footGap=actor.ground.y*120-floorY;
    check(footGap>=-1e-6&&footGap<=(fit.seatType==='kid-stool'?6:16),`Natural child foot clearance ${actor.id}`,{footGapPixels:footGap});
    let hand,frontToHand;
    if(fit.seatType==='kid-stool'){hand=projected(actor,fit.handSource);frontToHand=tableFrontY-hand[1];check(alphaAt(actor,...hand)>=160&&hand[0]>table.x&&hand[0]<table.x+table.w&&frontToHand>=0&&frontToHand<=8,`Hand rests within table surface ${actor.id}`,{hand,tableFrontY,frontToHand});}
    contacts.push({support:actor.id,character:actor.characterId,age:fit.intendedVisualAge,seatType:fit.seatType,direction:actor.direction,standingSourceHeight:visible.height,sourceScale:actor.sourceScale,registrySeatContactY:character.poses.sit[actor.direction].anchors.seatContactY,measuredSeatContactSource:fit.seatContactSource,measuredSourceFloorEdge:floorEdge,hipWorld:hip.map(v=>v/120),floorAnchorWorldY:floorY/120,footGapProofPixels:footGap,seatSurfaceWorld:stoolSeat.map(v=>v/120),handWorld:hand?.map(v=>v/120),tableFrontToHandProofPixels:frontToHand});
  }
  // Check actual opaque block pixels against actor alpha, not just rectangle spacing.
  const tableImage=await I.decode(path.resolve(here,'../assets/prepared/kids-table.png'));
  const blocks=[];
  for(const [i,rect]of fits.table.blockRectsNative.entries()) {
    let pixels=0,occluded=0;
    for(let y=rect[1];y<rect[1]+rect[3];y++)for(let x=rect[0];x<rect[0]+rect[2];x++) {
      if(tableImage.pixels.data[(y*tableImage.canvas.width+x)*4+3]<160)continue;
      const px=table.x+(x+.5)*table.w/tableImage.canvas.width,py=table.y+(y+.5)*table.h/tableImage.canvas.height;
      pixels++;if(actors.some(a=>alphaAt(a,px,py)>=160))occluded++;
    }
    check(pixels>300&&occluded===0,`Toy block ${i+1} fully readable between children`,{pixels,occluded});blocks.push({block:i+1,pixels,occluded});
  }
  const wall=[];
  for(const [id,preparedId,segment]of [['animalPrints','animal-prints','N3'],['clock','wall-clock-kids','N4']]) {
    const record=room.records.find(r=>r.id===id),meta=metadata.assets[preparedId],d=G.fixturePlacement(record,meta),image=await I.decode(path.resolve(here,'../assets/prepared',meta.file));
    let pixels=0,occluded=0;
    for(let y=0;y<image.canvas.height;y++)for(let x=0;x<image.canvas.width;x++) {
      if(image.pixels.data[(y*image.canvas.width+x)*4+3]<160)continue;
      pixels++;if(actors.filter(a=>a.group==='parents').some(a=>alphaAt(a,d.x+(x+.5)*d.w/image.canvas.width,d.y+(y+.5)*d.h/image.canvas.height)>=160))occluded++;
    }
    check(pixels>1000&&occluded===0,`Entire wall item visible with seated parents ${id}`,{pixels,occluded});
    check(record.doorOwners.length===1&&record.doorOwners[0]===segment&&record.backedOwners.length===1&&record.backedOwners[0]===segment,`Wall item owns actual segment ${id}`);
    for(const door of G.roomSegments(room))check(G.visible(record,new Set([door]),new Set())===(door!==segment),`Door visibility ${id}/${door}`);
    for(const backing of ['N1','N2','N3','N4'])check(G.visible(record,new Set(),new Set([backing]))===(backing!==segment),`Backing visibility ${id}/${backing}`);
    wall.push({id,segment,opaquePixels:pixels,occludedByParentPixels:occluded});
  }
  // Execute the same bulk handlers shipped to the browser, using tiny DOM stubs.
  const state={roomId:room.proofId,doors:new Set(),backed:new Set(),actors:true,parents:true,children:true,contacts:false,bases:false,grid:false,routes:false};
  const elements=new Map(),listeners={};let draws=0,refreshes=0;
  const context=vm.createContext({state,rooms:new Map([[room.proofId,room]]),roomSegments:G.roomSegments,data,PREPARED_METADATA:metadata,
    $:id=>{if(!elements.has(id))elements.set(id,{});return elements.get(id);},buildRoomControls:()=>refreshes++,draw:async()=>draws++,document:{addEventListener:(type,fn)=>{listeners[type]=fn;}},window:{__lab:{}}});
  const extension=fs.readFileSync(path.join(here,'extension.js'),'utf8');
  new vm.Script(extension.slice(extension.indexOf('function contactText()'))).runInContext(context);
  const controls=[];
  for(const [id,key,count]of [['allDoors','doors',16],['allDoors','doors',16],['closeDoors','doors',0],['closeDoors','doors',0],['allBacked','backed',4],['allBacked','backed',4],['clearBacked','backed',0],['clearBacked','backed',0]]) {
    check(typeof elements.get(id)?.onclick==='function',`Bulk handler exists ${id}`);
    await elements.get(id).onclick();check(state[key].size===count,`Bulk control ${id} produces ${count} segments`);controls.push({id,count});
  }
  check(draws===8&&refreshes===9,'Bulk controls refresh chips and redraw');
  return {status:'PASS',kind:'Node decoded-pixel presentation and actual bulk-handler regression',checks:results,contacts,blocks,wall,controls,draws,refreshes,browserValidation:'pending_manager_rerun'};
}
