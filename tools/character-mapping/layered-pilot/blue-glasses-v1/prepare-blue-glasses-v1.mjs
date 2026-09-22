import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { LAYER_ORDER } from '../../standard-atlas/schema-v1.mjs';
import { packAtlasPageV1 } from '../../standard-atlas/pack-atlas-v1.mjs';
import { signedMarkerSide } from '../../standard-atlas/rigid-geometry.mjs';
import { validateCharacterAtlasV1 } from '../../standard-atlas/validate-atlas-v1.mjs';

const repo = resolve(import.meta.dirname, '../../../..'), assets = resolve(import.meta.dirname, 'assets');
const review = resolve(repo, 'artifacts/character-movement/blue-glasses-v1');
mkdirSync(assets, { recursive: true }); mkdirSync(review, { recursive: true });
const sourcePath = 'Photos for Codex 2/Patients or Staff or Other Characters/exec-492d528d-52f8-422a-a1dc-fe63b3cd04cb.png';
const upperPath = 'tools/character-mapping/layered-pilot/blue-glasses-v1/assets/upper-generated-v2.png';
const torsoPath = 'tools/character-mapping/layered-pilot/blue-glasses-v1/assets/torso-generated-v1.png';
const sourceBytes = readFileSync(resolve(repo, sourcePath)), upperBytes = readFileSync(resolve(repo, upperPath)), torsoBytes = readFileSync(resolve(repo, torsoPath));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
if (sha(sourceBytes) !== '248c1222bef1cd5333b870c9179c6182966b6d47fd266da69a88bec70cedb420') throw Error('Blue Glasses source hash changed.');
const [source, upper, torsoDonor] = await Promise.all([loadImage(resolve(repo, sourcePath)), loadImage(resolve(repo, upperPath)), loadImage(resolve(repo, torsoPath))]);const VIEWS = ['south', 'east', 'west', 'north'], SIDES = ['left', 'right'], P = (x, y) => ({ x, y });

function removeNeutral(canvas) {
  const context = canvas.getContext('2d'), image = context.getImageData(0, 0, canvas.width, canvas.height), { data } = image, seen=new Uint8Array(canvas.width*canvas.height),queue=[];
  const neutral=p=>{const i=p*4,lo=Math.min(data[i],data[i+1],data[i+2]),hi=Math.max(data[i],data[i+1],data[i+2]);return lo>=180&&hi-lo<=22;},add=p=>{if(!seen[p]&&neutral(p)){seen[p]=1;queue.push(p);}};
  for(let x=0;x<canvas.width;x++){add(x);add((canvas.height-1)*canvas.width+x);}for(let y=0;y<canvas.height;y++){add(y*canvas.width);add(y*canvas.width+canvas.width-1);}for(let i=0;i<queue.length;i++){const p=queue[i],row=Math.floor(p/canvas.width);for(const n of[p-1,p+1,p-canvas.width,p+canvas.width])if(n>=0&&n<canvas.width*canvas.height&&((n===p-1||n===p+1)?Math.floor(n/canvas.width)===row:true))add(n);}for(const p of queue)data[p*4+3]=0;
  context.putImageData(image, 0, 0);
}
function polygonMask(image, crop, polygon, reflect = false) {
  const canvas = createCanvas(crop[2], crop[3]), context = canvas.getContext('2d');
  context.drawImage(image, ...crop, 0, 0, crop[2], crop[3]); removeNeutral(canvas);
  context.globalCompositeOperation = 'destination-in'; context.beginPath();
  for (const [index, [x, y]] of polygon.entries()) index ? context.lineTo(x, y) : context.moveTo(x, y);
  context.closePath(); context.fillStyle = '#fff'; context.fill(); context.globalCompositeOperation = 'source-over';
  if (!reflect) return canvas;
  const flipped = createCanvas(canvas.width, canvas.height), fx = flipped.getContext('2d'); fx.translate(canvas.width, 0); fx.scale(-1, 1); fx.drawImage(canvas, 0, 0); return flipped;
}
function saveDerived(name, canvas) { const bytes = canvas.toBuffer('image/png'), file = resolve(assets, name); writeFileSync(file, bytes); return { file, bytes }; }
function clearLowerSkin(canvas,startY=180){const context=canvas.getContext('2d'),image=context.getImageData(0,0,canvas.width,canvas.height),d=image.data;for(let y=startY;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){const i=(y*canvas.width+x)*4,r=d[i],g=d[i+1],b=d[i+2];if(r>135&&g>70&&g<190&&b<125&&r>g*1.12&&g>b*1.12)d[i+3]=0;}context.putImageData(image,0,0);}
function point(value, reflectWidth = null) { return P(reflectWidth == null ? value[0] : reflectWidth - 1 - value[0], value[1]); }
function orientation(start, end, marker) { return { markerSign: Math.sign(signedMarkerSide(start, end, marker)) }; }

const STAND = {
  south:{crop:[50,20,240,330],head:{poly:[[100,53],[124,53],[143,66],[148,88],[145,113],[135,127],[121,138],[118,141],[104,141],[101,138],[87,128],[76,115],[74,83],[82,65]],neck:[[103,138],[119,138]],crown:[112,54],chin:[112,135]},torso:{poly:[[91,133],[132,133],[141,143],[145,153],[145,204],[140,211],[82,211],[77,204],[77,153],[82,143]],neck:[[103,139],[119,139]],axis:[111,202],shoulder:{left:[140,150],right:[82,150]},hip:{left:[140,208],right:[82,208]}}},
  east:{crop:[300,20,240,330],head:{poly:[[93,51],[132,53],[145,66],[148,91],[144,116],[134,132],[122,139],[105,139],[99,135],[87,126],[72,117],[70,76],[78,61]],neck:[[103,137],[119,137]],crown:[112,51],chin:[135,134]},torso:{poly:[[100,132],[121,132],[132,143],[137,155],[137,205],[132,211],[87,211],[82,205],[82,155],[88,143]],neck:[[103,138],[119,138]],axis:[111,202],shoulder:{left:[87,150],right:[96,150]},hip:{left:[88,208],right:[132,208]}}},
  west:{crop:[550,20,240,330],head:{poly:[[85,52],[123,52],[137,64],[145,78],[145,116],[130,126],[119,136],[113,139],[96,139],[90,135],[78,130],[69,116],[68,77],[74,62]],neck:[[96,137],[112,137]],crown:[104,52],chin:[79,132]},torso:{poly:[[94,132],[112,132],[126,143],[132,155],[132,205],[127,211],[83,211],[79,205],[79,155],[84,143]],neck:[[96,138],[112,138]],axis:[104,202],shoulder:{left:[126,150],right:[118,150]},hip:{left:[127,208],right:[83,208]}}},
  north:{crop:[800,20,240,330],head:{poly:[[61,51],[101,51],[116,64],[118,104],[109,123],[94,134],[91,137],[74,137],[71,134],[55,124],[47,107],[47,72]],neck:[[73,134],[91,134]],crown:[82,51],chin:[82,130]},torso:{poly:[[61,130],[103,130],[114,140],[119,152],[119,204],[114,211],[50,211],[45,204],[45,152],[50,140]],neck:[[74,135],[91,135]],axis:[82,202],shoulder:{left:[50,150],right:[114,150]},hip:{left:[50,208],right:[114,208]}}},
};
const derived = {};
for (const view of VIEWS) {
  const cfg = STAND[view], headCanvas = polygonMask(source, cfg.crop, cfg.head.poly), torsoCanvas = polygonMask(source, cfg.crop, cfg.torso.poly);if(view==='north')clearLowerSkin(torsoCanvas);
  derived[view] = { head: saveDerived(`head-${view}-original-v1.png`, headCanvas), torso: saveDerived(`torso-${view}-original-v1.png`, torsoCanvas), headCanvas, torsoCanvas };
}

const upperRegions={
 south:{upper1:[108,385,95,178],upper2:[108,628,98,179],fore1:[112,876,86,198]},
 east:{upper1:[371,385,97,178],upper2:[372,628,101,179],fore1:[373,876,109,198]},
 west:{upper1:[654,385,96,178],upper2:[648,628,102,179],fore1:[640,876,109,198]},
 north:{upper1:[918,385,97,178],upper2:[915,628,101,179],fore1:[924,876,86,198]},
};
const upperAuth={
 south:{upper1:{s:[155,397],e:[155,548],o:[119,486]},upper2:{s:[157,641],e:[157,792],o:[194,730]},fore1:{e:[155,896],w:[155,1010],h:[155,1065],t:[178,1036],a:[181,960]}},
 east:{upper1:{s:[419,397],e:[419,548],o:[383,486]},upper2:{s:[421,641],e:[421,792],o:[385,730]},fore1:{e:[387,896],w:[443,1010],h:[448,1065],t:[421,1037],a:[399,960]}},
 west:{upper1:{s:[702,397],e:[702,548],o:[737,486]},upper2:{s:[700,641],e:[700,792],o:[737,730]},fore1:{e:[735,896],w:[679,1010],h:[674,1065],t:[701,1037],a:[723,960]}},
 north:{upper1:{s:[966,397],e:[966,548],o:[931,486]},upper2:{s:[965,641],e:[965,792],o:[1001,730]},fore1:{e:[966,896],w:[966,1010],h:[966,1065],t:[943,1036],a:[940,960]}},
};
const upperInputs = {}, identityInputs = {};
const GENERATED_TORSO={
 south:{crop:{x:180,y:180,width:375,height:390},neck:[[292,205],[430,205]],axis:[367,535],shoulder:{left:[515,235],right:[218,235]},hip:{left:[510,535],right:[225,535]},targetLength:25},
 east:{crop:{x:730,y:165,width:260,height:405},neck:[[805,200],[875,200]],axis:[858,535],shoulder:{left:[770,235],right:[785,235]},hip:{left:[780,535],right:[950,535]},targetLength:19},
 west:{crop:{x:1150,y:165,width:260,height:405},neck:[[1245,200],[1315,200]],axis:[1278,535],shoulder:{left:[1370,235],right:[1355,235]},hip:{left:[1375,535],right:[1190,535]},targetLength:19},
 north:{crop:{x:1560,y:180,width:390,height:390},neck:[[1690,205],[1825,205]],axis:[1755,535],shoulder:{left:[1610,235],right:[1905,235]},hip:{left:[1615,535],right:[1900,535]},targetLength:25},
};for (const view of VIEWS) {
  const cfg = STAND[view], from = kind => ({ path: derived[view][kind].file, sha256: sha(derived[view][kind].bytes), crop:{x:0,y:0,width:240,height:330}, requireSingleComponent:true, derivation:`exact original RGB ${kind}; neutral checkerboard and other anatomy removed by authored polygon from ${sha(sourceBytes)}` });
  const torsoLand=GENERATED_TORSO[view], torsoSource={path:resolve(repo,torsoPath),sha256:sha(torsoBytes),crop:torsoLand.crop,requireSingleComponent:true,derivation:`source-referenced arm-free ${view} blue-gray shirt and belt from original ${sha(sourceBytes)}; no sleeve or hand pixels`};
  upperInputs[`upper.${view}.torso`] = { source:torsoSource, landmarkAlphaRadius:18, landmarks:{neck:{screenLeft:point(torsoLand.neck[0]),screenRight:point(torsoLand.neck[1])},body:{axis:point(torsoLand.axis)},joint:{shoulder:{left:point(torsoLand.shoulder.left),right:point(torsoLand.shoulder.right)},hip:{left:point(torsoLand.hip.left),right:point(torsoLand.hip.right)}}},accessories:[],normalization:{targetLength:torsoLand.targetLength} };
  identityInputs[`identity.${view}.head`] = { source:from('head'), landmarks:{neck:{screenLeft:point(cfg.head.neck[0]),screenRight:point(cfg.head.neck[1])},coverage:{crown:point(cfg.head.crown),chin:point(cfg.head.chin)}},accessories:[],normalization:{targetLength:cfg.head.neck[1][0]-cfg.head.neck[0][0]} };
  // Assign by the visible elbow/thumb anatomy in the donor, not by its row labels.
  // Profile views intentionally reuse the one donor whose thumb and outer elbow
  // both face the travel direction; the limbs remain independently rigged.
  const mapping = {
    south:{left:{u:'upper2',f:'fore1',reflectFore:true},right:{u:'upper1',f:'fore1'}},
    north:{left:{u:'upper1',f:'fore1',reflectFore:true},right:{u:'upper2',f:'fore1'}},
    east:{left:{u:'upper1',f:'fore1',reflectFore:true},right:{u:'upper1',f:'fore1',reflectFore:true}},
    west:{left:{u:'upper1',f:'fore1',reflectFore:true},right:{u:'upper1',f:'fore1',reflectFore:true}},
  }[view];
  for (const side of SIDES) {
    const uKey=mapping[side].u,u=upperAuth[view][uKey],us=point(u.s),ue=point(u.e),uo=point(u.o);
    upperInputs[`upper.${view}.upperArm.${side}`]={source:{path:resolve(repo,upperPath),sha256:sha(upperBytes),crop:{x:upperRegions[view][uKey][0],y:upperRegions[view][uKey][1],width:upperRegions[view][uKey][2],height:upperRegions[view][uKey][3]},requireSingleComponent:true,derivation:`generated isolated plain blue cloth upper arm; actual ${view} anatomical-${side} assigned from visible outline, not source row label`},landmarks:{joint:{shoulder:us,elbow:ue},orientation:{outerElbow:uo}},orientation:orientation(us,ue,uo),accessories:[],normalization:{targetLength:108}};
    const fKey=mapping[side].f,f=upperAuth[view][fKey],region=upperRegions[view][fKey];let foreSource,fe,fw,fh,ft,fa;
    if(mapping[side].reflectFore){const canvas=createCanvas(region[2],region[3]),context=canvas.getContext('2d');context.translate(region[2],0);context.scale(-1,1);context.drawImage(upper,region[0],region[1],region[2],region[3],0,0,region[2],region[3]);const reflected=saveDerived(`fore-${view}-${side}-reflected-v1.png`,canvas),rp=value=>P(region[2]-1-(value[0]-region[0]),value[1]-region[1]);foreSource={path:reflected.file,sha256:sha(reflected.bytes),crop:{x:0,y:0,width:region[2],height:region[3]},requireSingleComponent:true,derivation:`generated long-sleeve forearm, rolled cuff, bare wrist, and hand reflected with all landmarks for verified ${view} thumb direction`};fe=rp(f.e);fw=rp(f.w);fh=rp(f.h);ft=rp(f.t);fa=rp(f.a);}else{foreSource={path:resolve(repo,upperPath),sha256:sha(upperBytes),crop:{x:region[0],y:region[1],width:region[2],height:region[3]},requireSingleComponent:true,derivation:`generated long-sleeve forearm, rolled cuff, bare wrist, and hand; ${view} anatomical-${side} assigned from actual thumb pixels`};fe=point(f.e);fw=point(f.w);fh=point(f.h);ft=point(f.t);fa=point(f.a);}
    upperInputs[`upper.${view}.forearmHand.${side}`]={source:foreSource,landmarkAlphaRadius:12,landmarks:{joint:{elbow:fe,wrist:fw},hand:{end:fh},orientation:{thumbTip:ft,anterior:fa}},orientation:orientation(fe,fh,fa),accessories:[],normalization:{targetLength:118}};
  }
}

const lowerInputs = {};
const frontalLegs={
 south:{left:{poly:[[112,210],[145,210],[145,284],[149,293],[149,312],[108,312],[109,285]],hip:[125,214],knee:[126,251],ankle:[128,289],outer:[141,245],shoe:[[107,283],[150,313],[128,289],[119,307],[143,307],[113,303],[148,302]]},right:{poly:[[76,210],[111,210],[111,285],[108,312],[72,312],[72,293],[77,284]],hip:[96,214],knee:[95,251],ankle:[93,289],outer:[79,245],shoe:[[71,283],[109,313],[93,289],[75,310],[105,310],[73,302],[108,302]]}},
 north:{left:{poly:[[48,210],[81,210],[81,285],[77,311],[45,311],[45,292],[49,284]],hip:[64,214],knee:[64,251],ankle:[63,288],outer:[50,245],shoe:[[44,282],[80,312],[63,288],[48,309],[76,309],[46,301],[80,301]]},right:{poly:[[82,210],[115,210],[115,284],[119,292],[116,311],[82,311],[81,285]],hip:[99,214],knee:[99,251],ankle:[100,288],outer:[113,245],shoe:[[81,282],[119,312],[100,288],[85,309],[113,309],[83,301],[118,301]]}},
};function addLower(view,side,leg,derivedSource,reflect=false){const width=240,xf=p=>reflect?point(p,width):point(p),base={path:derivedSource.file,sha256:sha(derivedSource.bytes),derivation:`exact original RGB ${view} anatomical-${side} trouser and shoe; neutral checkerboard and opposing leg masked; ${reflect?'horizontally reflected with all landmarks for West source projection':'source orientation retained'}`};const hip=xf(leg.hip),knee=xf(leg.knee),ankle=xf(leg.ankle),outer=xf(leg.outer);
  for(const [kind,start,end,marker] of [['thigh',hip,knee,outer],['shin',knee,ankle,xf(leg.shinOuter??[leg.outer[0],leg.outer[1]+32])]]){const minY=Math.max(0,Math.floor(Math.min(start.y,end.y)-12)),maxY=Math.min(329,Math.ceil(Math.max(start.y,end.y)+12)),minX=Math.max(0,Math.floor(Math.min(...leg.poly.map(p=>xf(p).x))-4)),maxX=Math.min(239,Math.ceil(Math.max(...leg.poly.map(p=>xf(p).x))+4)),crop={x:minX,y:minY,width:maxX-minX+1,height:maxY-minY+1},nominalRenderRect={x:minX,y:kind==='thigh'?222:250,width:maxX-minX+1,height:kind==='thigh'?38:43};lowerInputs[`lower.${view}.${kind}.${side}`]={source:{...base,crop,nominalRenderRect,overlapPixels:18},landmarks:{joint:kind==='thigh'?{hip:start,knee:end}:{knee:start,ankle:end},orientation:{outer:marker}},orientation:orientation(start,end,marker),landmarkAlphaRadius:12,accessories:[],normalization:{targetLength:Math.hypot(end.x-start.x,end.y-start.y)*2}};}
  const s=leg.shoe.map(xf),[bounds,_,shoeAnkle,left,right,heel,toe]=s,crop={x:Math.min(bounds.x,_.x),y:Math.min(bounds.y,_.y),width:Math.abs(_.x-bounds.x)+1,height:Math.abs(_.y-bounds.y)+1},baselineLeft=left.x<right.x?left:right,baselineRight=left.x<right.x?right:left,rear=view==='west'?baselineRight:baselineLeft,front=view==='west'?baselineLeft:baselineRight;lowerInputs[`lower.${view}.shoe.${side}`]={source:{...base,crop},landmarks:{joint:{ankle:shoeAnkle},entry:{rear,front},heel:{rear:heel},toe:{tip:toe},sole:{contact:P((baselineLeft.x+baselineRight.x)/2,baselineLeft.y)},registration:{baselineLeft,baselineRight},reference:{center:shoeAnkle}},registration:{baselineLeft,baselineRight},orientation:{markerSign:1},landmarkAlphaRadius:12,accessories:[],normalization:{startLandmark:'registration.baselineLeft',endLandmark:'registration.baselineRight',targetLength:Math.abs(baselineRight.x-baselineLeft.x)*1.75}};
}
for(const view of ['south','north'])for(const side of SIDES){const leg=frontalLegs[view][side],canvas=polygonMask(source,STAND[view].crop,leg.poly);if(view==='north')clearLowerSkin(canvas,180);const saved=saveDerived(`lower-${view}-${side}-original-v1.png`,canvas);addLower(view,side,leg,saved);}
const profileLegs={
 east:{poly:[[113,209],[137,209],[137,242],[136,283],[136,292],[136,314],[85,314],[85,290],[103,282],[106,243],[113,239]],shoePoly:[[85,290],[103,284],[123,284],[133,290],[133,314],[85,314]],hip:[123,214],knee:[120,251],ankle:[120,286],outer:[134,245],shoe:[[84,284],[134,314],[110,288],[87,311],[132,311],[87,302],[132,302]]},
 west:{poly:[[78,209],[102,209],[102,240],[104,246],[111,282],[132,290],[132,314],[87,314],[87,290],[77,290]],shoePoly:[[87,290],[100,284],[119,284],[132,290],[132,314],[87,314]],hip:[92,214],knee:[96,251],ankle:[96,286],outer:[81,245],shinOuter:[88,276],shoe:[[86,284],[133,314],[110,288],[88,311],[131,311],[88,302],[132,302]]},
};
for(const view of ['east','west'])for(const side of SIDES){const leg=profileLegs[view],canvas=polygonMask(source,STAND[view].crop,leg.poly);clearLowerSkin(canvas,190);const saved=saveDerived(`lower-${view}-${side}-original-v1.png`,canvas);addLower(view,side,leg,saved);const shoeCanvas=polygonMask(source,STAND[view].crop,leg.shoePoly),shoeSaved=saveDerived(`shoe-${view}-${side}-original-v1.png`,shoeCanvas),shoeInput=lowerInputs[`lower.${view}.shoe.${side}`];shoeInput.source={...shoeInput.source,path:shoeSaved.file,sha256:sha(shoeSaved.bytes),derivation:`exact original ${view} brown shoe isolated from trouser and adjacent hand pixels`};}
const upperPacked=await packAtlasPageV1({pageId:'upper',parts:upperInputs,outputFile:resolve(assets,'upper-v1.png')});
const identityPacked=await packAtlasPageV1({pageId:'identity',parts:identityInputs,outputFile:resolve(assets,'identity-v1.png')});
const lowerPacked=await packAtlasPageV1({pageId:'lower',parts:lowerInputs,outputFile:resolve(assets,'lower-v1.png')});
for(const [name,width,height] of [['actions-v1.png',1024,1024],['clipboard-v1.png',512,256]])writeFileSync(resolve(assets,name),createCanvas(width,height).toBuffer('image/png'));
const pages={upper:upperPacked.page,identity:identityPacked.page,lower:lowerPacked.page,...Object.fromEntries([['actions','actions-v1.png'],['clipboard','clipboard-v1.png']].map(([id,file])=>{const bytes=readFileSync(resolve(assets,file));return[id,{file:resolve(assets,file),sha256:sha(bytes)}];}))};
const manifest={schemaVersion:'character-atlas/v1',characterId:'patient.adult.039.blue-glasses-v1',capabilities:{sitting:false,clipboard:false},pages:Object.fromEntries(Object.entries(pages).map(([id,page])=>[id,{file:`assets/${page.file.split(/[\\/]/).at(-1)}`,sha256:page.sha256}])),parts:{...upperPacked.parts,...identityPacked.parts,...lowerPacked.parts},fallbacks:{},accessoryPolicy:{},layerOrder:LAYER_ORDER,sourceLineage:{original:{path:sourcePath,sha256:sha(sourceBytes)},upperGeneration:{path:upperPath,sha256:sha(upperBytes),prompt:'assets/upper-generated-v2-prompt.txt',derivation:'rows 2-4 only; plain cloth upper arms plus forearm-owned long sleeve, low rolled cuff, short bare wrist, and hand; complete part pixels and landmarks reflected together from actual thumb anatomy'},torsoGeneration:{path:torsoPath,sha256:sha(torsoBytes),prompt:'assets/torso-generated-v1-prompt.txt',derivation:'four complete arm-free shirt-and-belt trunks normalized against own static cloth widths'},lower:{path:sourcePath,sha256:sha(sourceBytes),derivation:'exact original trouser and shoe pixels; profile donor reuses one verified source leg per view'}},profile:{canvas:{width:160,height:320,axisX:80,floorY:287}},garment:{sleeveLength:'long-rolled-near-wrist',wristCuffOwner:'forearmHand',elbowUnderlapOwner:'upperArm-and-forearm',sourceRuntimeY:{shoulder:[116,118],elbow:[150,152],cuffBottom:[181,183],palmRoot:[189,191],handEnd:[213,215]}}};
const validated=await validateCharacterAtlasV1(manifest,{root:import.meta.dirname});
const manifestBytes=Buffer.from(`${JSON.stringify(manifest,null,2)}\n`);writeFileSync(resolve(import.meta.dirname,'manifest-v1.json'),manifestBytes);
const proof=createCanvas(960,682),px=proof.getContext('2d');px.fillStyle='#ded8ce';px.fillRect(0,0,proof.width,proof.height);px.imageSmoothingEnabled=false;for(const[i,view]of VIEWS.entries()){px.drawImage(derived[view].torsoCanvas,i*240,0);px.drawImage(derived[view].headCanvas,i*240,0);px.fillStyle='#20242a';px.fillRect(i*240,330,240,22);px.fillStyle='#fff';px.font='bold 12px sans-serif';px.fillText(`${view} exact head + original trunk diagnostic`,i*240+4,345);px.drawImage(source,...STAND[view].crop,i*240,352,240,330);}writeFileSync(resolve(review,'source-head-arm-free-torso-proof.png'),proof.toBuffer('image/png'));
console.log(JSON.stringify({status:validated.ok?'PASS':'FAIL',manifestSha256:sha(manifestBytes),sourceSha256:sha(sourceBytes),upperSourceSha256:sha(upperBytes),pages:Object.fromEntries(Object.entries(manifest.pages).map(([k,v])=>[k,v.sha256])),partCount:Object.keys(manifest.parts).length}));
