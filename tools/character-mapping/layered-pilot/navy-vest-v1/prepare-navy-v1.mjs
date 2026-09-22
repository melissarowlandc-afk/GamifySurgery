import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { LAYER_ORDER } from '../../standard-atlas/schema-v1.mjs';
import { packAtlasPageV1 } from '../../standard-atlas/pack-atlas-v1.mjs';
import { signedMarkerSide } from '../../standard-atlas/rigid-geometry.mjs';
import { validateCharacterAtlasV1 } from '../../standard-atlas/validate-atlas-v1.mjs';

const repo = resolve(import.meta.dirname, '../../../..'), assets = resolve(import.meta.dirname, 'assets');
const review = resolve(repo, 'artifacts/character-movement/navy-vest-v1');
mkdirSync(assets, { recursive: true }); mkdirSync(review, { recursive: true });
const sourcePath = 'Photos for Codex 2/Patients or Staff or Other Characters/exec-ee82180f-799f-4617-9159-27eefa97f158.png';
const upperOriginalPath = 'tools/character-mapping/layered-pilot/navy-vest-v1/assets/upper-generated-v1.png';
const upperPath = 'tools/character-mapping/layered-pilot/navy-vest-v1/assets/upper-generated-v1-corrected.png';
const profileTorsoPath = 'tools/character-mapping/layered-pilot/navy-vest-v1/assets/profile-torso-v1.png';
const profileLegsPath = 'tools/character-mapping/layered-pilot/navy-vest-v1/assets/profile-legs-v1.png';
const sourceBytes = readFileSync(resolve(repo, sourcePath)), upperOriginalBytes = readFileSync(resolve(repo, upperOriginalPath));
const profileTorsoBytes = readFileSync(resolve(repo, profileTorsoPath));
const profileLegsBytes = readFileSync(resolve(repo, profileLegsPath));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
if (sha(sourceBytes) !== '9f843a7297c830ce3263a95a6476f1a953a42fe9fef6b883c9f324fb6e7be4f2') throw Error('Navy Vest source hash changed.');
const [source, upperOriginal, profileTorso, profileLegsImage] = await Promise.all([loadImage(resolve(repo, sourcePath)), loadImage(resolve(repo, upperOriginalPath)), loadImage(resolve(repo, profileTorsoPath)), loadImage(resolve(repo, profileLegsPath))]);
const upperClean=createCanvas(upperOriginal.width,upperOriginal.height),upperCleanContext=upperClean.getContext('2d');upperCleanContext.drawImage(upperOriginal,0,0);for(const[y,h]of[[548,14],[797,14],[846,15],[1114,18]])upperCleanContext.clearRect(0,y,upperOriginal.width,h);const upperBytes=upperClean.toBuffer('image/png');writeFileSync(resolve(repo,upperPath),upperBytes);const upper=await loadImage(resolve(repo,upperPath));
const VIEWS = ['south', 'east', 'west', 'north'], SIDES = ['left', 'right'], P = (x, y) => ({ x, y });

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
  south: { crop: [50,20,240,330], head: { poly:[[65,60],[126,60],[137,72],[137,116],[128,132],[109,143],[106,147],[89,147],[86,143],[67,132],[58,116],[58,77]], neck:[[90,145],[106,145]], crown:[98,60], chin:[98,141] }, torso: { poly:[[81,136],[116,136],[124,143],[128,153],[130,170],[130,218],[124,220],[72,220],[66,218],[66,170],[67,153],[71,143]], neck:[[90,145],[106,145]], axis:[98,210], shoulder:{left:[123,151],right:[73,151]}, hip:{left:[126,218],right:[70,218]} } },
  east: { crop: [300,20,240,330], head: { poly:[[82,59],[112,59],[130,67],[137,81],[137,111],[132,127],[119,136],[115,140],[99,140],[95,135],[84,126],[70,118],[69,80]], neck:[[99,138],[115,138]], crown:[103,59], chin:[125,135] }, torso: { poly:[[100,136],[115,136],[123,142],[132,151],[136,162],[136,218],[128,224],[103,224],[103,162],[94,151],[96,142]], neck:[[99,144],[115,144]], axis:[116,208], shoulder:{left:[96,151],right:[101,151]}, hip:{left:[106,218],right:[130,218]} } },
  west: { crop: [550,20,240,330], head: { poly:[[77,59],[104,59],[116,69],[118,89],[117,118],[105,126],[91,135],[88,140],[72,140],[68,136],[56,128],[51,113],[51,79],[59,67]], neck:[[72,138],[88,138]], crown:[84,59], chin:[62,135] }, torso: { poly:[[72,136],[88,136],[92,142],[94,151],[87,162],[87,218],[84,224],[58,224],[51,218],[51,162],[55,151],[64,142]], neck:[[72,144],[88,144]], axis:[70,208], shoulder:{left:[87,151],right:[82,151]}, hip:{left:[84,218],right:[58,218]} } },
  north: { crop: [800,20,240,330], head: { poly:[[49,59],[100,59],[114,72],[116,111],[107,126],[88,137],[85,141],[65,141],[62,137],[43,126],[34,111],[35,74]], neck:[[64,138],[86,138]], crown:[75,59], chin:[75,132] }, torso: { poly:[[61,132],[89,132],[103,139],[110,150],[110,163],[109,218],[105,220],[45,220],[41,218],[40,163],[40,150],[47,139]], neck:[[64,138],[86,138]], axis:[75,210], shoulder:{left:[43,151],right:[108,151]}, hip:{left:[45,218],right:[105,218]} } },
};

const derived = {};
for (const view of VIEWS) {
  const cfg = STAND[view], headCanvas = polygonMask(source, cfg.crop, cfg.head.poly), torsoCanvas = polygonMask(source, cfg.crop, cfg.torso.poly);if(view==='north')clearLowerSkin(torsoCanvas);
  derived[view] = { head: saveDerived(`head-${view}-original-v1.png`, headCanvas), torso: saveDerived(`torso-${view}-original-v1.png`, torsoCanvas), headCanvas, torsoCanvas };
}

const upperRegions = {
  south:{upper1:[135,366,94,185],upper2:[135,617,94,183],fore1:[142,846,80,216],fore2:[140,1114,82,198]},
  east:{upper1:[386,366,110,185],upper2:[386,617,110,183],fore1:[403,846,83,216],fore2:[407,1114,82,198]},
  west:{upper1:[626,366,111,185],upper2:[626,617,111,183],fore1:[637,846,83,216],fore2:[637,1114,82,198]},
  north:{upper1:[890,366,101,185],upper2:[890,617,101,183],fore1:[898,846,84,216],fore2:[898,1114,84,198]},
};
const upperAuth = {
  south:{upper1:{s:[182,375],e:[182,520],o:[143,485]},upper2:{s:[182,626],e:[182,770],o:[221,735]},fore1:{e:[183,875],w:[183,980],h:[183,1048],t:[211,1000],a:[212,917]},fore2:{e:[181,1145],w:[181,1240],h:[181,1298],t:[151,1261],a:[151,1180]}},
  east:{upper1:{s:[441,375],e:[441,520],o:[408,485]},upper2:{s:[441,626],e:[441,770],o:[475,735]},fore1:{e:[445,875],w:[445,980],h:[445,1048],t:[472,1000],a:[474,917]},fore2:{e:[448,1145],w:[448,1240],h:[448,1299],t:[423,1261],a:[420,1180]}},
  west:{upper1:{s:[681,375],e:[681,520],o:[715,485]},upper2:{s:[681,626],e:[681,770],o:[648,735]},fore1:{e:[678,875],w:[678,980],h:[678,1048],t:[651,1000],a:[648,917]},fore2:{e:[678,1145],w:[678,1240],h:[678,1299],t:[704,1261],a:[707,1180]}},
  north:{upper1:{s:[940,375],e:[940,520],o:[913,485]},upper2:{s:[940,626],e:[940,770],o:[968,735]},fore1:{e:[940,875],w:[940,980],h:[940,1048],t:[909,1015],a:[910,995]},fore2:{e:[940,1145],w:[940,1240],h:[940,1298],t:[974,1254],a:[972,1225]}},
};

const upperInputs = {}, identityInputs = {};
const PROFILE_TORSO = {
  east:{crop:{x:450,y:160,width:340,height:570},neck:[[548,235],[718,235]],axis:[640,650],shoulder:{left:[520,300],right:[535,300]},hip:{left:[520,680],right:[735,680]}},
  west:{crop:{x:1020,y:160,width:345,height:570},neck:[[1095,235],[1265,235]],axis:[1178,650],shoulder:{left:[1290,300],right:[1275,300]},hip:{left:[1295,680],right:[1075,680]}},
};
for (const view of VIEWS) {
  const cfg = STAND[view], from = kind => ({ path: derived[view][kind].file, sha256: sha(derived[view][kind].bytes), crop:{x:0,y:0,width:240,height:330}, requireSingleComponent:true, derivation:`exact original RGB ${kind}; neutral checkerboard and other anatomy removed by authored polygon from ${sha(sourceBytes)}` });
  const pt=PROFILE_TORSO[view], torsoSource=pt?{path:resolve(repo,profileTorsoPath),sha256:sha(profileTorsoBytes),crop:pt.crop,requireSingleComponent:true,derivation:`source-referenced complete arm-free ${view} navy vest from original ${sha(sourceBytes)}; shoulder opening filled with vest cloth and retained seam, no sleeve/hand pixels`}:from('torso'), torsoLand=pt??cfg.torso;
  upperInputs[`upper.${view}.torso`] = { source:torsoSource, landmarks:{neck:{screenLeft:point(torsoLand.neck[0]),screenRight:point(torsoLand.neck[1])},body:{axis:point(torsoLand.axis)},joint:{shoulder:{left:point(torsoLand.shoulder.left),right:point(torsoLand.shoulder.right)},hip:{left:point(torsoLand.hip.left),right:point(torsoLand.hip.right)}}},accessories:[],normalization:{targetLength:pt?30:cfg.torso.neck[1][0]-cfg.torso.neck[0][0]} };
  identityInputs[`identity.${view}.head`] = { source:from('head'), landmarks:{neck:{screenLeft:point(cfg.head.neck[0]),screenRight:point(cfg.head.neck[1])},coverage:{crown:point(cfg.head.crown),chin:point(cfg.head.chin)}},accessories:[],normalization:{targetLength:cfg.head.neck[1][0]-cfg.head.neck[0][0]} };
  // Assign by the visible elbow/thumb anatomy in the donor, not by its row labels.
  // Profile views intentionally reuse the one donor whose thumb and outer elbow
  // both face the travel direction; the limbs remain independently rigged.
  const mapping = {
    south:{left:{u:'upper2',f:'fore2'},right:{u:'upper1',f:'fore1'}},
    north:{left:{u:'upper1',f:'fore2'},right:{u:'upper2',f:'fore1'}},
    east:{left:{u:'upper1',f:'fore1'},right:{u:'upper1',f:'fore1'}},
    west:{left:{u:'upper1',f:'fore1'},right:{u:'upper1',f:'fore1'}},
  }[view];
  for (const side of SIDES) {
    const uKey=mapping[side].u,u=upperAuth[view][uKey],us=point(u.s),ue=point(u.e),uo=point(u.o);
    upperInputs[`upper.${view}.upperArm.${side}`]={source:{path:resolve(repo,upperPath),sha256:sha(upperBytes),crop:{x:upperRegions[view][uKey][0],y:upperRegions[view][uKey][1],width:upperRegions[view][uKey][2],height:upperRegions[view][uKey][3]},requireSingleComponent:true,derivation:`generated isolated long-sleeve upper arm; actual ${view} anatomical-${side} assigned from visible outline, not source row label`},landmarks:{joint:{shoulder:us,elbow:ue},orientation:{outerElbow:uo}},orientation:orientation(us,ue,uo),accessories:[],normalization:{targetLength:108}};
    const fKey=mapping[side].f,f=upperAuth[view][fKey],fe=point(f.e),fw=point(f.w),fh=point(f.h),ft=point(f.t),fa=point(f.a);
    upperInputs[`upper.${view}.forearmHand.${side}`]={source:{path:resolve(repo,upperPath),sha256:sha(upperBytes),crop:{x:upperRegions[view][fKey][0],y:upperRegions[view][fKey][1],width:upperRegions[view][fKey][2],height:upperRegions[view][fKey][3]},requireSingleComponent:true,derivation:`generated isolated long-sleeve forearm/cuff/hand; actual ${view} anatomical-${side} selected by thumb direction, not row label`},landmarks:{joint:{elbow:fe,wrist:fw},hand:{end:fh},orientation:{thumbTip:ft,anterior:fa}},orientation:orientation(fe,fh,fa),accessories:[],normalization:{targetLength:118}};
  }
}

const lowerInputs = {};
const frontalLegs = {
  south:{left:{poly:[[101,223],[124,223],[127,251],[126,288],[145,292],[145,311],[101,311]],hip:[115,226],knee:[115,257],ankle:[116,290],outer:[124,247],shoe:[[102,285],[146,312],[116,290],[110,308],[134,308],[106,300],[136,300]]},right:{poly:[[72,223],[98,223],[100,251],[100,311],[57,311],[57,292],[70,288],[69,251]],hip:[84,226],knee:[84,257],ankle:[84,290],outer:[71,247],shoe:[[57,285],[101,312],[84,290],[61,308],[85,308],[62,300],[91,300]]}},
  // North hands sit immediately outside the trouser columns in the original.
  // Keep the leg polygons on the measured cloth edges until the shoe transition.
  north:{left:{poly:[[42,223],[68,223],[69,252],[68,311],[24,311],[25,291],[42,286]],hip:[51,226],knee:[51,257],ankle:[51,290],outer:[43,247],shoe:[[24,285],[69,312],[51,290],[43,308],[67,308],[41,300],[68,300]]},right:{poly:[[72,223],[108,223],[108,286],[123,291],[124,311],[70,311],[71,252]],hip:[96,226],knee:[96,257],ankle:[96,290],outer:[106,247],shoe:[[70,285],[124,312],[96,290],[82,308],[105,308],[80,300],[111,300]]}},
};
function addLower(view,side,leg,derivedSource,reflect=false){const width=240,xf=p=>reflect?point(p,width):point(p),base={path:derivedSource.file,sha256:sha(derivedSource.bytes),derivation:`exact original RGB ${view} anatomical-${side} trouser and shoe; neutral checkerboard and opposing leg masked; ${reflect?'horizontally reflected with all landmarks for West source projection':'source orientation retained'}`};const hip=xf(leg.hip),knee=xf(leg.knee),ankle=xf(leg.ankle),outer=xf(leg.outer);
  for(const [kind,start,end,marker] of [['thigh',hip,knee,outer],['shin',knee,ankle,xf(leg.shinOuter??[leg.outer[0],leg.outer[1]+32])]]){const minY=Math.max(0,Math.floor(Math.min(start.y,end.y)-12)),maxY=Math.min(329,Math.ceil(Math.max(start.y,end.y)+12)),minX=Math.max(0,Math.floor(Math.min(...leg.poly.map(p=>xf(p).x))-4)),maxX=Math.min(239,Math.ceil(Math.max(...leg.poly.map(p=>xf(p).x))+4)),crop={x:minX,y:minY,width:maxX-minX+1,height:maxY-minY+1},nominalRenderRect={x:minX,y:kind==='thigh'?222:250,width:maxX-minX+1,height:kind==='thigh'?38:43};lowerInputs[`lower.${view}.${kind}.${side}`]={source:{...base,crop,nominalRenderRect,overlapPixels:18},landmarks:{joint:kind==='thigh'?{hip:start,knee:end}:{knee:start,ankle:end},orientation:{outer:marker}},orientation:orientation(start,end,marker),landmarkAlphaRadius:12,accessories:[],normalization:{targetLength:Math.hypot(end.x-start.x,end.y-start.y)*2}};}
  const s=leg.shoe.map(xf),[bounds,_,shoeAnkle,left,right,heel,toe]=s,crop={x:Math.min(bounds.x,_.x),y:Math.min(bounds.y,_.y),width:Math.abs(_.x-bounds.x)+1,height:Math.abs(_.y-bounds.y)+1},baselineLeft=left.x<right.x?left:right,baselineRight=left.x<right.x?right:left,rear=view==='west'?baselineRight:baselineLeft,front=view==='west'?baselineLeft:baselineRight;lowerInputs[`lower.${view}.shoe.${side}`]={source:{...base,crop},landmarks:{joint:{ankle:shoeAnkle},entry:{rear,front},heel:{rear:heel},toe:{tip:toe},sole:{contact:P((baselineLeft.x+baselineRight.x)/2,baselineLeft.y)},registration:{baselineLeft,baselineRight},reference:{center:shoeAnkle}},registration:{baselineLeft,baselineRight},orientation:{markerSign:1},landmarkAlphaRadius:12,accessories:[],normalization:{startLandmark:'registration.baselineLeft',endLandmark:'registration.baselineRight',targetLength:Math.abs(baselineRight.x-baselineLeft.x)*1.75}};
}
for(const view of ['south','north'])for(const side of SIDES){const leg=frontalLegs[view][side],canvas=polygonMask(source,STAND[view].crop,leg.poly);if(view==='north')clearLowerSkin(canvas,180);const saved=saveDerived(`lower-${view}-${side}-original-v1.png`,canvas);addLower(view,side,leg,saved);}
const reflectedCell=createCanvas(543,724),reflectedContext=reflectedCell.getContext('2d');reflectedContext.translate(543,0);reflectedContext.scale(-1,1);reflectedContext.drawImage(profileLegsImage,1629,0,543,724,0,0,543,724);const reflectedProfile=saveDerived('profile-leg-west-right-reflected-v1.png',reflectedCell);
const PROFILE_GEN={
  // The anatomical hip is authored inside the continuous cloth. Keeping the
  // donor's fabric above this marker gives every profile phase enough real
  // trouser underlap to meet the measured vest hem without lengthening it.
  east:{left:{source:{path:resolve(repo,profileLegsPath),bytes:profileLegsBytes},x:[250,455],hip:[335,170],knee:[335,350],ankle:[335,545],outerThigh:[270,250],outerShin:[270,460],shoe:[250,510,205,112],baseline:[[265,615],[423,615]],heel:[261,600],toe:[449,600]},right:{source:{path:resolve(repo,profileLegsPath),bytes:profileLegsBytes},x:[735,965],hip:[835,170],knee:[835,350],ankle:[835,545],outerThigh:[770,250],outerShin:[770,460],shoe:[735,510,230,112],baseline:[[772,615],[931,615]],heel:[767,600],toe:[957,600]}},
  west:{left:{source:{path:resolve(repo,profileLegsPath),bytes:profileLegsBytes},x:[1205,1430],hip:[1308,170],knee:[1308,350],ankle:[1308,545],outerThigh:[1370,250],outerShin:[1370,460],shoe:[1205,510,225,112],baseline:[[1241,615],[1407,615]],heel:[1411,600],toe:[1215,600]},right:{source:{path:reflectedProfile.file,bytes:reflectedProfile.bytes},x:[195,415],hip:[313,170],knee:[313,350],ankle:[313,545],outerThigh:[375,250],outerShin:[375,460],shoe:[195,510,220,112],baseline:[[232,615],[393,615]],heel:[398,600],toe:[206,600]}},
};
for(const view of ['east','west'])for(const side of SIDES){const g=PROFILE_GEN[view][side],base={path:g.source.path,sha256:sha(g.source.bytes),derivation:`source-referenced continuous ${view} anatomical-${side} trouser and flat shoe; 100px source knee overlap${g.source.path===reflectedProfile.file?'; source column reflected with all landmarks to correct toe direction':''}`},hip=point(g.hip),knee=point(g.knee),ankle=point(g.ankle),ot=point(g.outerThigh),os=point(g.outerShin);for(const[kind,start,end,marker,y,height]of[['thigh',hip,knee,ot,105,305],['shin',knee,ankle,os,300,265]]){const crop={x:g.x[0],y,width:g.x[1]-g.x[0],height};lowerInputs[`lower.${view}.${kind}.${side}`]={source:{...base,crop,nominalRenderRect:crop,overlapPixels:100},landmarks:{joint:kind==='thigh'?{hip:start,knee:end}:{knee:start,ankle:end},orientation:{outer:marker}},orientation:orientation(start,end,marker),accessories:[],normalization:{targetLength:Math.hypot(end.x-start.x,end.y-start.y)*.45}};}const bl=point(g.baseline[0]),br=point(g.baseline[1]),rear=view==='west'?br:bl,front=view==='west'?bl:br,shoeCrop={x:g.shoe[0],y:g.shoe[1],width:g.shoe[2],height:g.shoe[3]};lowerInputs[`lower.${view}.shoe.${side}`]={source:{...base,crop:shoeCrop},landmarks:{joint:{ankle},entry:{rear,front},heel:{rear:point(g.heel)},toe:{tip:point(g.toe)},sole:{contact:P((bl.x+br.x)/2,bl.y)},registration:{baselineLeft:bl,baselineRight:br},reference:{center:ankle}},registration:{baselineLeft:bl,baselineRight:br},orientation:{markerSign:1},accessories:[],normalization:{startLandmark:'registration.baselineLeft',endLandmark:'registration.baselineRight',targetLength:Math.abs(br.x-bl.x)*.45}};}

const upperPacked=await packAtlasPageV1({pageId:'upper',parts:upperInputs,outputFile:resolve(assets,'upper-v1.png')});
const identityPacked=await packAtlasPageV1({pageId:'identity',parts:identityInputs,outputFile:resolve(assets,'identity-v1.png')});
const lowerPacked=await packAtlasPageV1({pageId:'lower',parts:lowerInputs,outputFile:resolve(assets,'lower-v1.png')});
for(const [name,width,height] of [['actions-v1.png',1024,1024],['clipboard-v1.png',512,256]])writeFileSync(resolve(assets,name),createCanvas(width,height).toBuffer('image/png'));
const pages={upper:upperPacked.page,identity:identityPacked.page,lower:lowerPacked.page,...Object.fromEntries([['actions','actions-v1.png'],['clipboard','clipboard-v1.png']].map(([id,file])=>{const bytes=readFileSync(resolve(assets,file));return[id,{file:resolve(assets,file),sha256:sha(bytes)}];}))};
const manifest={schemaVersion:'character-atlas/v1',characterId:'patient.adult.035.navy-vest-v1',capabilities:{sitting:false,clipboard:false},pages:Object.fromEntries(Object.entries(pages).map(([id,page])=>[id,{file:`assets/${page.file.split(/[\\/]/).at(-1)}`,sha256:page.sha256}])),parts:{...upperPacked.parts,...identityPacked.parts,...lowerPacked.parts},fallbacks:{},accessoryPolicy:{},layerOrder:LAYER_ORDER,sourceLineage:{original:{path:sourcePath,sha256:sha(sourceBytes)},upperGeneration:{path:upperPath,sha256:sha(upperBytes),original:{path:upperOriginalPath,sha256:sha(upperOriginalBytes)},prompt:'assets/upper-generated-v1-prompt.txt',derivation:'narrow artificial elbow cut bands removed from both segment ends to place source borders inside overlap; no recoloring'},profileTorso:{path:profileTorsoPath,sha256:sha(profileTorsoBytes),prompt:'assets/profile-torso-v1-prompt.txt'},profileLower:{path:profileLegsPath,sha256:sha(profileLegsBytes),prompt:'assets/profile-legs-v1-prompt.txt',derivation:'four continuous source-referenced legs; column 4 reflected with all landmarks for West toe direction'}},profile:{canvas:{width:160,height:320,axisX:80,floorY:287}},garment:{sleeveLength:'long',wristCuffOwner:'forearmHand',elbowUnderlapOwner:'upperArm'}};
const validated=await validateCharacterAtlasV1(manifest,{root:import.meta.dirname});
const manifestBytes=Buffer.from(`${JSON.stringify(manifest,null,2)}\n`);writeFileSync(resolve(import.meta.dirname,'manifest-v1.json'),manifestBytes);
const proof=createCanvas(960,682),px=proof.getContext('2d');px.fillStyle='#ded8ce';px.fillRect(0,0,proof.width,proof.height);px.imageSmoothingEnabled=false;for(const[i,view]of VIEWS.entries()){px.drawImage(derived[view].torsoCanvas,i*240,0);px.drawImage(derived[view].headCanvas,i*240,0);px.fillStyle='#20242a';px.fillRect(i*240,330,240,22);px.fillStyle='#fff';px.font='bold 12px sans-serif';px.fillText(`${view} exact head + arm-free vest`,i*240+4,345);px.drawImage(source,...STAND[view].crop,i*240,352,240,330);}writeFileSync(resolve(review,'source-head-arm-free-torso-proof.png'),proof.toBuffer('image/png'));
console.log(JSON.stringify({status:validated.ok?'PASS':'FAIL',manifestSha256:sha(manifestBytes),sourceSha256:sha(sourceBytes),upperSourceSha256:sha(upperBytes),pages:Object.fromEntries(Object.entries(manifest.pages).map(([k,v])=>[k,v.sha256])),partCount:Object.keys(manifest.parts).length}));
