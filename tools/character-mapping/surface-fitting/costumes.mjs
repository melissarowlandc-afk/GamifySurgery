const FORBIDDEN_KEYS=new Set(['joints','hipCenter','motion','anatomy','transform','headOffset','footOffset','shoulder','elbow','wrist','hip','knee','ankle','heel','toe','phaseId','action']);
const COLOR_KEYS=new Set(['outline','skin','skinLight','cloth','clothLight','pants','pantsLight','shoe','sole','hair','hairLight','cream','detail','metal']);
const REGION_KEYS=new Set(['head','neck','torso','upperArm','forearm','hand','thigh','shin','foot']);
const OP_KEYS=new Set(['kind','views','sides','fill','stroke','width','alpha','points','x','y','rx','ry','x1','y1','x2','y2','cx','cy','qx','qy','dash','asset','interpolation','sourceAxes','coverCaps']);
const VIEW_KEYS=new Set(['south','north','east','west']);
const ATTACHMENT_KEYS=new Set(['id','anchor','layer','bounds','views','primitives']);
const LAYERS=new Set(['body-back','torso-back','head-back','head-front','body-front']);
const ANCHORS=new Set(['headBase','neckBase','leftHip','rightHip']);
const KINDS=new Set(['ellipse','rect','line','polyline','polygon','quadratic','raster']);

function exactKeys(value,allowed,label){for(const key of Object.keys(value))if(!allowed.has(key))throw new Error(`${label} has unknown key ${key}`);}
function finite(value,label){if(typeof value!=='number'||!Number.isFinite(value))throw new Error(`${label} must be finite`);}
function paletteColor(value,palette,label){if(typeof value!=='string'||!(value in palette))throw new Error(`${label} references unknown palette color ${value}`);}
function validateViews(views,label){if(views===undefined)return;if(!Array.isArray(views)||!views.length)throw new Error(`${label}.views must be a non-empty array`);for(const view of views)if(!VIEW_KEYS.has(view))throw new Error(`${label}.views has unknown view ${view}`);}
function validatePoint(point,label){if(!Array.isArray(point)||point.length!==2)throw new Error(`${label} must be [x,y]`);finite(point[0],`${label}[0]`);finite(point[1],`${label}[1]`);}
function validatePrimitive(op,palette,label){
  if(!op||typeof op!=='object'||Array.isArray(op))throw new Error(`${label} must be an object`);
  exactKeys(op,OP_KEYS,label);if(!KINDS.has(op.kind))throw new Error(`${label} has unknown kind ${op.kind}`);validateViews(op.views,label);
  if(op.sides!==undefined){if(!Array.isArray(op.sides)||!op.sides.length||op.sides.some(side=>!['left','right'].includes(side)))throw new Error(`${label}.sides invalid`);}
  if(op.kind==='raster'){
    if(typeof op.asset!=='string'||!op.asset)throw new Error(`${label}.asset required`);
    for(const key of['x1','y1','x2','y2'])finite(op[key],`${label}.${key}`);
    if(op.x1===op.x2||op.y1===op.y2)throw new Error(`${label} raster destination invalid`);
    if(op.interpolation!==undefined&&!['nearest','linear'].includes(op.interpolation))throw new Error(`${label}.interpolation invalid`);
    if(op.sourceAxes!==undefined&&!['xy','yx'].includes(op.sourceAxes))throw new Error(`${label}.sourceAxes invalid`);
    if(op.coverCaps!==undefined&&typeof op.coverCaps!=='boolean')throw new Error(`${label}.coverCaps invalid`);
    return;
  }
  if(op.fill!==undefined)paletteColor(op.fill,palette,`${label}.fill`);if(op.stroke!==undefined)paletteColor(op.stroke,palette,`${label}.stroke`);if(op.fill===undefined&&op.stroke===undefined)throw new Error(`${label} needs fill or stroke`);
  for(const key of ['width','alpha','x','y','rx','ry','x1','y1','x2','y2','cx','cy','qx','qy'])if(op[key]!==undefined)finite(op[key],`${label}.${key}`);
  if(op.points!==undefined){if(!Array.isArray(op.points)||!op.points.length)throw new Error(`${label}.points must be non-empty`);op.points.forEach((point,index)=>validatePoint(point,`${label}.points[${index}]`));}
  if(op.dash!==undefined){if(!Array.isArray(op.dash))throw new Error(`${label}.dash must be an array`);op.dash.forEach((entry,index)=>finite(entry,`${label}.dash[${index}]`));}
}
function scanForbidden(value,label='costume'){if(!value||typeof value!=='object')return;for(const[key,child]of Object.entries(value)){if(FORBIDDEN_KEYS.has(key))throw new Error(`${label} owns forbidden ${key}`);scanForbidden(child,`${label}.${key}`);}}
export function assertCostume(costume){
  if(!costume||typeof costume!=='object'||Array.isArray(costume))throw new Error('costume must be an object');scanForbidden(costume);exactKeys(costume,new Set(['id','source','palette','surfaces','attachments','sourceUV']),'costume');
  if(typeof costume.id!=='string'||!costume.id)throw new Error('costume.id required');exactKeys(costume.source,new Set(['path','sha256']),'costume.source');if(typeof costume.source.path!=='string'||!/^[a-f0-9]{64}$/.test(costume.source.sha256))throw new Error('costume source provenance invalid');
  exactKeys(costume.palette,COLOR_KEYS,'costume.palette');for(const[key,value]of Object.entries(costume.palette))if(!/^#[0-9a-f]{6}$/i.test(value))throw new Error(`costume.palette.${key} invalid`);
  if(costume.sourceUV!==undefined){
    exactKeys(costume.sourceUV,new Set(['coordinateSpace','assets']),'costume.sourceUV');
    if(costume.sourceUV.coordinateSpace!=='immutable-source-pixels')throw new Error('costume.sourceUV.coordinateSpace invalid');
    if(!costume.sourceUV.assets||typeof costume.sourceUV.assets!=='object'||Array.isArray(costume.sourceUV.assets))throw new Error('costume.sourceUV.assets invalid');
    for(const[id,asset]of Object.entries(costume.sourceUV.assets)){
      if(!id)throw new Error('costume.sourceUV asset id required');exactKeys(asset,new Set(['crop','polygons','purpose','edgePadY','keyBackground']),'costume.sourceUV.assets.'+id);
      exactKeys(asset.crop,new Set(['x','y','width','height']),`costume.sourceUV.assets.${id}.crop`);for(const key of['x','y','width','height'])finite(asset.crop[key],`costume.sourceUV.assets.${id}.crop.${key}`);if(asset.crop.width<=0||asset.crop.height<=0)throw new Error(`costume.sourceUV.assets.${id}.crop invalid`);
      if(typeof asset.purpose!=='string'||!asset.purpose)throw new Error(`costume.sourceUV.assets.${id}.purpose required`);
      if(asset.edgePadY!==undefined&&(!Number.isInteger(asset.edgePadY)||asset.edgePadY<0))throw new Error(`costume.sourceUV.assets.${id}.edgePadY invalid`);
      if(asset.keyBackground!==undefined&&typeof asset.keyBackground!=='boolean')throw new Error(`costume.sourceUV.assets.${id}.keyBackground invalid`);
      if(!Array.isArray(asset.polygons)||!asset.polygons.length)throw new Error(`costume.sourceUV.assets.${id}.polygons invalid`);asset.polygons.forEach((polygon,p)=>{if(!Array.isArray(polygon)||polygon.length<3)throw new Error(`costume.sourceUV.assets.${id}.polygons[${p}] invalid`);polygon.forEach((point,i)=>validatePoint(point,`costume.sourceUV.assets.${id}.polygons[${p}][${i}]`));});
    }
  }
  exactKeys(costume.surfaces,REGION_KEYS,'costume.surfaces');for(const[region,ops]of Object.entries(costume.surfaces)){if(!Array.isArray(ops))throw new Error(`costume.surfaces.${region} must be an array`);ops.forEach((op,index)=>validatePrimitive(op,costume.palette,`costume.surfaces.${region}[${index}]`));}
  if(!Array.isArray(costume.attachments))throw new Error('costume.attachments must be an array');const ids=new Set();
  for(const[index,attachment]of costume.attachments.entries()){
    const label=`costume.attachments[${index}]`;exactKeys(attachment,ATTACHMENT_KEYS,label);if(ids.has(attachment.id))throw new Error(`duplicate attachment ${attachment.id}`);ids.add(attachment.id);if(!ANCHORS.has(attachment.anchor)||!LAYERS.has(attachment.layer))throw new Error(`${label} has invalid anchor/layer`);
    exactKeys(attachment.bounds,new Set(['left','top','right','bottom']),`${label}.bounds`);for(const[key,value]of Object.entries(attachment.bounds))finite(value,`${label}.bounds.${key}`);if(attachment.bounds.left>=attachment.bounds.right||attachment.bounds.top>=attachment.bounds.bottom)throw new Error(`${label}.bounds invalid`);
    exactKeys(attachment.views,VIEW_KEYS,`${label}.views`);for(const[view,spec]of Object.entries(attachment.views)){exactKeys(spec,new Set(['visible','mirrorX','offsetX','offsetY','primitives']),`${label}.views.${view}`);if(spec.visible!==undefined&&typeof spec.visible!=='boolean')throw new Error(`${label}.views.${view}.visible invalid`);if(spec.mirrorX!==undefined&&typeof spec.mirrorX!=='boolean')throw new Error(`${label}.views.${view}.mirrorX invalid`);for(const key of['offsetX','offsetY'])if(spec[key]!==undefined)finite(spec[key],`${label}.views.${view}.${key}`);if(spec.primitives!==undefined){if(!Array.isArray(spec.primitives))throw new Error(`${label}.views.${view}.primitives invalid`);spec.primitives.forEach((op,i)=>validatePrimitive(op,costume.palette,`${label}.views.${view}.primitives[${i}]`));}}
    if(!Array.isArray(attachment.primitives))throw new Error(`${label}.primitives invalid`);attachment.primitives.forEach((op,i)=>validatePrimitive(op,costume.palette,`${label}.primitives[${i}]`));
  }return costume;
}

const P={
  line:(x1,y1,x2,y2,stroke,width=1,views)=>({kind:'line',x1,y1,x2,y2,stroke,width,...(views?{views}:{})}),
  ellipse:(x,y,rx,ry,fill,stroke,views)=>({kind:'ellipse',x,y,rx,ry,...(fill?{fill}:{}),...(stroke?{stroke}:{}),...(views?{views}:{})}),
  poly:(points,fill,stroke,views)=>({kind:'polygon',points,...(fill?{fill}:{}),...(stroke?{stroke}:{}),...(views?{views}:{})}),
  path:(points,stroke,width=1,views)=>({kind:'polyline',points,stroke,width,...(views?{views}:{})}),
  quad:(x1,y1,qx,qy,x2,y2,stroke,width,views)=>({kind:'quadratic',x1,y1,qx,qy,x2,y2,stroke,width,...(views?{views}:{})}),
  rect:(x,y,rx,ry,fill,stroke,views)=>({kind:'rect',x,y,rx,ry,...(fill?{fill}:{}),...(stroke?{stroke}:{}),...(views?{views}:{})}),
};
const greenPalette={outline:'#26313a',skin:'#d5a070',skinLight:'#edc49b',cloth:'#829078',clothLight:'#a3af91',pants:'#665942',pantsLight:'#7a6d55',shoe:'#574435',sole:'#2b2928',hair:'#ded8c6',hairLight:'#f1ecdd',cream:'#eee6d1',detail:'#4d5546',metal:'#b49b68'};
const grayPalette={outline:'#20272b',skin:'#bc845b',skinLight:'#dfa780',cloth:'#39434a',clothLight:'#59636a',pants:'#554d42',pantsLight:'#6a6156',shoe:'#413a32',sole:'#252422',hair:'#b5b4ad',hairLight:'#c7c6bf',cream:'#ece2ca',detail:'#1d2225',metal:'#a88643'};

const green={
  id:'patient.adult.046',source:{path:'Photos for Codex 2/Patients or Staff or Other Characters/exec-0b03b9bb-45a8-4d1a-a785-7654d39c0478.png',sha256:'fa38e9e41e85bd96b85338b6c747c580ae68cdd9af48e9f16cf49478d3c4fd63'},palette:greenPalette,
  surfaces:{
    head:[P.ellipse(-.34,.04,.075,.09,'detail',null,['south']),P.ellipse(.34,.04,.075,.09,'detail',null,['south']),P.ellipse(.48,.04,.075,.09,'detail',null,['east','west']),P.line(-.48,-.18,-.21,-.21,'hair',3,['south']),P.line(.21,-.21,.48,-.18,'hair',3,['south']),P.ellipse(-.18,.4,.25,.095,'hair',null,['south']),P.ellipse(.18,.4,.25,.095,'hair',null,['south']),P.line(.38,-.18,.58,-.12,'hair',3,['east','west']),P.ellipse(.63,.37,.27,.085,'hair',null,['east','west'])],
    torso:[P.poly([[-.22,0],[-.04,.28],[0,.12],[.04,.28],[.22,0]],'cream','detail',['south','east','west']),P.line(-.38,.02,0,.37,'clothLight',2,['south']),P.line(.38,.02,0,.37,'clothLight',2,['south']),P.line(0,.32,0,.94,'detail',2,['south']),P.ellipse(0,.48,.035,.025,'detail',null,['south']),P.ellipse(0,.65,.035,.025,'detail',null,['south']),P.ellipse(0,.82,.035,.025,'detail',null,['south']),P.line(-.82,.88,.82,.88,'clothLight',3),P.line(-.82,.94,.82,.94,'detail',1)],
    upperArm:[],forearm:[P.line(.80,-.48,.80,.48,'clothLight',2),P.line(.91,-.48,.91,.48,'detail',1)],hand:[],thigh:[P.line(.08,-.35,.92,-.35,'pantsLight',1)],shin:[],foot:[P.line(.08,.48,.94,.48,'cream',2)],
  },
  attachments:[{id:'white-side-fringe',anchor:'headBase',layer:'head-front',bounds:{left:-49,top:-94,right:49,bottom:-24},primitives:[],views:{
    south:{primitives:[P.quad(-33,-49,-43,-67,-26,-80,'outline',16),P.quad(-33,-49,-43,-67,-26,-80,'hair',12),P.quad(33,-49,43,-67,26,-80,'outline',16),P.quad(33,-49,43,-67,26,-80,'hair',12)]},
    north:{primitives:[P.quad(-35,-55,0,-35,35,-55,'outline',18),P.quad(-35,-55,0,-35,35,-55,'hair',14)]},
    east:{primitives:[P.quad(-34,-48,-43,-68,-22,-84,'outline',18),P.quad(-34,-48,-43,-68,-22,-82,'hair',14)]},
    west:{mirrorX:true,primitives:[P.quad(-34,-48,-43,-68,-22,-82,'outline',18),P.quad(-34,-48,-43,-68,-22,-82,'hair',14)]},
  }}],
};

const gray={
  id:'retained.gray-braid',source:{path:'Photos for Codex 2/Patients or Staff or Other Characters/exec-16c48adf-2478-4b2a-b0e3-9ce1f2bfc2cb.png',sha256:'1368999e0dbd28c250fd41c2a5ab97bcb8905de71862e4cdbfc3d75a6b4b62e4'},palette:grayPalette,
  surfaces:{
    head:[P.poly([[-.88,-.3],[-.72,-.72],[-.3,-.98],[0,-1],[.3,-.98],[.72,-.72],[.88,-.3],[.64,-.48],[.2,-.58],[0,-.5],[-.2,-.58],[-.64,-.48]],'hair',null),P.poly([[-.88,-.6],[-.72,-.9],[0,-1],[.72,-.9],[.88,-.6],[.82,.45],[.5,.72],[0,.82],[-.5,.72],[-.82,.45]],'hair',null,['north']),P.line(0,-.94,0,-.55,'detail',2),P.quad(-.78,-.5,-.4,-.93,-.03,-.95,'hairLight',3),P.quad(.78,-.5,.4,-.93,.03,-.95,'hairLight',3),P.rect(-.34,.04,.22,.15,null,'detail',['south']),P.rect(.34,.04,.22,.15,null,'detail',['south']),P.line(-.12,.04,.12,.04,'detail',3,['south']),P.ellipse(-.34,.05,.055,.07,'detail',null,['south']),P.ellipse(.34,.05,.055,.07,'detail',null,['south']),P.rect(.5,.03,.28,.15,null,'detail',['east','west']),P.line(.18,.03,.75,.03,'detail',2,['east','west']),P.ellipse(.52,.04,.05,.07,'detail',null,['east','west']),P.quad(-.35,.48,0,.55,.35,.45,'detail',1,['south']),P.line(-.58,.3,-.4,.34,'detail',1,['south']),P.line(.4,.34,.58,.3,'detail',1,['south'])],
    torso:[P.rect(0,.42,.20,.55,'cream',null,['south','east','west']),P.poly([[-.7,.02],[-.19,.03],[-.03,.55],[-.35,.3]],'clothLight','detail',['south']),P.poly([[.7,.02],[.19,.03],[.03,.55],[.35,.3]],'clothLight','detail',['south']),P.line(-.36,.13,-.5,.92,'detail',2,['east','west']),P.line(.36,.13,.5,.92,'detail',2,['east','west']),P.line(-.82,.62,-.48,.59,'clothLight',2,['south']),P.line(.82,.62,.48,.59,'clothLight',2,['south']),P.rect(0,.69,.16,.055,'metal','detail',['south']),P.line(-.38,.69,.38,.69,'detail',2,['south'])],
    upperArm:[],forearm:[P.line(.88,-.48,.88,.48,'clothLight',2)],hand:[],thigh:[P.line(.08,-.32,.92,-.32,'pantsLight',1)],shin:[],foot:[P.line(.12,.46,.92,.46,'metal',1)],
  },
  attachments:[
    {id:'long-coat-tails',anchor:'neckBase',layer:'torso-back',bounds:{left:-50,top:15,right:50,bottom:95},primitives:[],views:{south:{primitives:[P.poly([[-36,18],[-17,20],[-18,91],[-46,88]],'cloth','outline'),P.poly([[36,18],[17,20],[18,91],[46,88]],'cloth','outline')]},north:{primitives:[P.poly([[-36,18],[36,18],[43,91],[-43,91]],'cloth','outline')]},east:{primitives:[P.poly([[-22,18],[25,18],[42,90],[-23,86]],'cloth','outline')]},west:{mirrorX:true,primitives:[P.poly([[-22,18],[25,18],[42,90],[-23,86]],'cloth','outline')]}}},
    {id:'silver-braid',anchor:'headBase',layer:'head-back',bounds:{left:-27,top:-43,right:27,bottom:84},primitives:[],views:{south:{offsetX:24,primitives:[P.ellipse(0,3,12,14,'hair','outline'),P.ellipse(-2,24,12,14,'hairLight','outline'),P.ellipse(1,45,11,13,'hair','outline'),P.ellipse(-1,64,9,11,'hairLight','outline'),P.line(-7,14,6,20,'detail',2),P.line(6,34,-6,40,'detail',2),P.line(-5,53,4,59,'detail',2)]},north:{primitives:[P.ellipse(0,-4,14,16,'hair','outline'),P.ellipse(-2,21,13,15,'hairLight','outline'),P.ellipse(2,45,11,14,'hair','outline'),P.ellipse(0,68,9,11,'hairLight','outline'),P.line(-8,7,7,15,'detail',2),P.line(7,31,-7,39,'detail',2),P.line(-6,55,5,63,'detail',2)]},east:{offsetX:-20,primitives:[P.ellipse(0,-1,12,14,'hair','outline'),P.ellipse(-1,20,12,14,'hairLight','outline'),P.ellipse(1,41,10,12,'hair','outline'),P.line(-7,9,6,16,'detail',2),P.line(6,29,-6,36,'detail',2)]},west:{offsetX:20,primitives:[P.ellipse(0,-1,12,14,'hair','outline'),P.ellipse(1,20,12,14,'hairLight','outline'),P.ellipse(-1,41,10,12,'hair','outline'),P.line(-7,9,6,16,'detail',2),P.line(6,29,-6,36,'detail',2)]}}},
    {id:'silver-crown',anchor:'headBase',layer:'head-front',bounds:{left:-41,top:-92,right:41,bottom:-43},primitives:[],views:{south:{primitives:[P.quad(-35,-61,-28,-87,0,-86,'hair',8),P.quad(35,-61,28,-87,0,-86,'hair',8),P.line(0,-86,0,-67,'detail',2)]},north:{primitives:[P.quad(-36,-58,-27,-87,0,-86,'hair',10),P.quad(36,-58,27,-87,0,-86,'hair',10),P.line(0,-86,0,-63,'hairLight',2)]},east:{primitives:[P.quad(-34,-58,-22,-86,6,-84,'hair',10),P.line(-8,-84,12,-67,'hairLight',2)]},west:{mirrorX:true,primitives:[P.quad(-34,-58,-22,-86,6,-84,'hair',10),P.line(-8,-84,12,-67,'hairLight',2)]}}},
  ],
};

assertCostume(green);assertCostume(gray);
export const COSTUMES=Object.freeze({[green.id]:green,[gray.id]:gray});
