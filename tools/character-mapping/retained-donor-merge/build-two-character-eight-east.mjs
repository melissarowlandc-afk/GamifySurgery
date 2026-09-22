import {
  createHash
}
from'node:crypto';
import {
  mkdirSync,readFileSync,writeFileSync
}
from'node:fs';
import {
  resolve
}
from'node:path';
import {
  createCanvas,loadImage
}
from'@napi-rs/canvas';
import {
  compileLateral
}
from'../math.mjs';
const repo=resolve(import.meta.dirname,'../../..'),out=resolve(repo,'artifacts/character-movement/retained-donor-merge/two-character-eight-east-v2');
mkdirSync(resolve(out,'frames'), {
  recursive:true
}
);
const sha=b=>createHash('sha256').update(b).digest('hex'),mapping=JSON.parse(readFileSync(resolve(import.meta.dirname,'mapping.json'))),kitPaths=['woman-donor-kit.json','man-donor-kit.json'];
function crop(image,box) {
  const c=createCanvas(box.width,box.height),x=c.getContext('2d');
  x.drawImage(image,box.x,box.y,box.width,box.height,0,0,box.width,box.height);
  return c
}
function key(canvas) {
  const c=canvas.getContext('2d'),im=c.getImageData(0,0,canvas.width,canvas.height),d=im.data,seen=new Uint8Array(canvas.width*canvas.height),q=new Uint32Array(seen.length);
  let h=0,t=0;
  const ok=i=> {
    const p=i*4,r=d[p],g=d[p+1],b=d[p+2];
    return Math.min(r,g,b)>=224&&Math.max(r,g,b)-Math.min(r,g,b)<=24
  }
  ,add=i=> {
    if(!seen[i]&&ok(i)) {
      seen[i]=1;
      q[t++]=i
    }
  }
  ;
  for(let x=0;x<canvas.width;x++) {
    add(x);
    add((canvas.height-1)*canvas.width+x)
  }
  for(let y=0;y<canvas.height;y++) {
    add(y*canvas.width);
    add(y*canvas.width+canvas.width-1)
  }
  while(h<t) {
    const i=q[h++],x=i%canvas.width,y=Math.floor(i/canvas.width);
    if(x)add(i-1);
    if(x<canvas.width-1)add(i+1);
    if(y)add(i-canvas.width);
    if(y<canvas.height-1)add(i+canvas.width)
  }
  for(let i=0;i<seen.length;i++)if(seen[i])d[i*4+3]=0;
  c.putImageData(im,0,0);
  return canvas
}
function path(c,poly) {
  c.beginPath();
  poly.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));
  c.closePath()
}
function len(a,b) {
  return Math.hypot(b[0]-a[0],b[1]-a[1])
}
function recipeFor(character) {
  const f=character.recipe.frame;
  return {
    identity: {
      templateId:character.id
    }
    ,lineage: {
      east: {
        kind:'independent'
      }
      ,west: {
        kind:'reflected',fromView:'east',phasePermutation: {
          '01':'05','02':'06','03':'07','04':'08','05':'01','06':'02','07':'03','08':'04'
        }
      }
    }
    ,lateral: {
      ...character.recipe,registration: {
        east: {
          scale:1,sourceAxisX:f.axisX,sourceFloorY:f.floorY,sourceWidth:f.width,sourceHeight:f.height
        }
        ,west: {
          scale:1,sourceAxisX:f.axisX,sourceFloorY:f.floorY,sourceWidth:f.width,sourceHeight:f.height
        }
      }
    }
  }
}
function targetPair(g,id) {
  const side=id.includes('near-right')?'right':'left',j=g.joints[side];
  if(id.includes('upper-arm'))return[j.shoulder,j.elbow];
  if(id.includes('forearm'))return[j.elbow,j.wrist];
  if(id.includes('thigh'))return[j.hip,j.knee];
  if(id.includes('shin'))return[j.knee,j.ankle];
  if(id.includes('shoe'))return[j.shoeHeel,j.shoeToe];
  throw new Error(id)
}
function capDonor(source,piece) {
  const c=createCanvas(240,340),x=c.getContext('2d');
  if(piece.reconstructFromTexture) {
    const[a,b]=piece.anchors,r=piece.reconstructFromTexture,s=r.sourceRect;
    x.beginPath();
    x.moveTo(...a);
    x.lineTo(...b);
    x.lineWidth=r.width;
    x.lineCap='round';
    x.strokeStyle='#fff';
    x.stroke();
    x.globalCompositeOperation='source-in';
    x.drawImage(source,...s,Math.min(a[0],b[0])-10,Math.min(a[1],b[1])-10,Math.abs(b[0]-a[0])+20,Math.abs(b[1]-a[1])+20);
    x.globalCompositeOperation='source-over';
    return c
  }
  x.save();
  path(x,piece.polygon);
  x.clip();
  x.drawImage(source,0,0);
  x.restore();
  if(!piece.anchors||piece.id.includes('shoe'))return c;
  const [a,b]=piece.anchors,mid=[(a[0]+b[0])/2,(a[1]+b[1])/2],radius=piece.id.includes('arm')?9:11,count=piece.id.includes('forearm')?1:2;
  x.save();
  x.globalCompositeOperation='destination-over';
  for(let i=0;i<count;i++) {
    const [cx,cy]=piece.anchors[i];
    x.save();
    x.beginPath();
    x.arc(cx,cy,radius,0,Math.PI*2);
    x.clip();
    x.drawImage(source,mid[0]-4,mid[1]-4,8,8,cx-radius,cy-radius,radius*2,radius*2);
    x.restore()
  }
  x.restore();
  return c
}
function mapped(c,donor,piece,targetStart,targetEnd,scale) {
  const [s0,s1]=piece.anchors,sa=Math.atan2(s1[1]-s0[1],s1[0]-s0[0]),ta=Math.atan2(targetEnd.y-targetStart.y,targetEnd.x-targetStart.x),rotationRadians=ta-sa;
  c.save();
  c.translate(targetStart.x,targetStart.y);
  c.rotate(rotationRadians);
  c.scale(scale,scale);
  c.translate(-s0[0],-s0[1]);
  c.drawImage(donor,0,0);
  c.restore();
  return {
    scale,rotationRadians,sourceStart: {
      x:s0[0],y:s0[1]
    }
    ,sourceEnd: {
      x:s1[0],y:s1[1]
    }
    ,targetStart: {
      ...targetStart
    }
    ,targetEnd: {
      ...targetEnd
    }
  }
}
function skeleton(canvas,g) {
  const c=createCanvas(240,310),x=c.getContext('2d');
  x.drawImage(canvas,0,0);
  x.strokeStyle='#ed1768';
  x.fillStyle='#fff';
  x.lineWidth=1.2;
  for(const side of['left','right']) {
    const j=g.joints[side];
    for(const[a,b]of[['shoulder','elbow'],['elbow','wrist'],['hip','knee'],['knee','ankle'],['shoeHeel','shoeToe']]) {
      x.beginPath();
      x.moveTo(j[a].x,j[a].y);
      x.lineTo(j[b].x,j[b].y);
      x.stroke()
    }
    for(const k of['shoulder','elbow','wrist','hip','knee','ankle']) {
      x.beginPath();
      x.arc(j[k].x,j[k].y,2.3,0,Math.PI*2);
      x.fill();
      x.stroke()
    }
  }
  return c
}
function geometryGuide(g,character,kit) {
  const c=createCanvas(240,310),x=c.getContext('2d'),e=character.recipe.envelope,w=kit.guideWidths,center=g.joints.right.hip.x,bob=g.joints.right.hip.y-character.recipe.centers.hipY;
  x.fillStyle='rgba(49,199,220,.28)';
  x.strokeStyle='#31c7dc';
  x.lineWidth=1.2;
  x.beginPath();
  x.ellipse(center,character.recipe.centers.headY+bob,e.headRadiusX,e.headRadiusY,0,0,Math.PI*2);
  x.fill();
  x.stroke();
  const bodyDx=g.joints.right.hip.x-kit.bodySourceHip.x;
  const bodyDy=g.joints.right.hip.y-kit.bodySourceHip.y;
  x.beginPath();
  kit.torsoClip.forEach(([sourceX,sourceY],index)=> {
    const targetX=sourceX+bodyDx,targetY=sourceY+bodyDy;
    if(index===0)x.moveTo(targetX,targetY);else x.lineTo(targetX,targetY)
  });
  x.closePath();
  x.fill();
  x.stroke();
  for(const side of['left','right']) {
    const j=g.joints[side],alpha=side==='right'?.55:.30;
    x.strokeStyle=`rgba(255,185,60,${alpha})`;
    x.lineCap='round';
    for(const[a,b,width]of[['shoulder','elbow',w.upperArm],['elbow','wrist',w.forearm],['hip','knee',w.thigh],['knee','ankle',w.shin],['shoeHeel','shoeToe',w.shoe]]) {
      x.lineWidth=width;
      x.beginPath();
      x.moveTo(j[a].x,j[a].y);
      x.lineTo(j[b].x,j[b].y);
      x.stroke()
    }
  }
  return c
}
const records=[];
for(const kitName of kitPaths) {
  const kitBytes=readFileSync(resolve(import.meta.dirname,kitName)),kit=JSON.parse(kitBytes),sourceBytes=readFileSync(resolve(repo,kit.sourcePath));
  if(sha(sourceBytes)!==kit.sourceSha256)throw new Error(`source hash ${kit.characterId}`);
  const image=await loadImage(resolve(repo,kit.sourcePath)),walk=key(crop(image,kit.sourceCrop)),westRaw=crop(image, {
    x:550,y:20,width:210,height:340
  }
  ),west=createCanvas(210,340),wx=west.getContext('2d');
  wx.translate(210,0);
  wx.scale(-1,1);
  wx.drawImage(westRaw,0,0);
  key(west);
  const back=key(crop(image, {
    x:800,y:20,width:210,height:340
  }
  )),character=mapping.characters.find(c=>c.id===kit.characterId),pieces=Object.fromEntries(kit.pieces.map(p=>[p.id,p])),donors=Object.fromEntries(kit.pieces.map(p=>[p.id,capDonor(p.source==='standingWestMirror'?west:walk,p)]));
  const body=createCanvas(240,310),bc=body.getContext('2d');
  bc.save();
  path(bc,kit.torsoClip);
  bc.clip();
  bc.drawImage(back,...kit.backFill.sourceRect,...kit.backFill.destinationRect);
  bc.restore();
  bc.drawImage(donors['torso-core'],0,0);
  bc.drawImage(donors.head,0,0);
  const scales= {
  }
  ;
  for(const piece of kit.pieces.filter(p=>p.anchors)) {
    const kind=piece.id.includes('upper-arm')?'upperArm':piece.id.includes('forearm')?'forearm':piece.id.includes('thigh')?'thigh':piece.id.includes('shin')?'shin':'shoe',target=kind==='shoe'?character.recipe.foot.heelBack+character.recipe.foot.toeForward:character.recipe.segmentLengths[kind];
    scales[piece.id]=Number((target/len(...piece.anchors)).toFixed(6))
  }
  const targets=compileLateral(recipeFor(character)).filter(t=>t.view==='east'),outputs= {
  }
  ;
  if(kit.characterId.includes('dark-hair')) {
    const audit=resolve(out,'man-donor-audit');
    mkdirSync(audit, {
      recursive:true
    }
    );
    const ids=['near-right-upper-arm','near-right-forearm-hand','far-left-upper-arm','far-left-forearm-hand','far-left-thigh','near-right-thigh'];
    writeFileSync(resolve(audit,'torso-only.png'),body.toBuffer('image/png'));
    for(const id of ids)writeFileSync(resolve(audit,`${id}.png`),donors[id].toBuffer('image/png'));
    const sheet=createCanvas(2100,760),sx=sheet.getContext('2d');
    sx.fillStyle='#17191d';
    sx.fillRect(0,0,2100,760);
    sx.fillStyle='#fff';
    sx.font='bold 22px sans-serif';
    sx.fillText('Man torso, four arms, and thigh donor audit',20,32);
    const entries=[['torso-only',body],...ids.map(id=>[id,donors[id]])];
    entries.forEach(([label,img],i)=> {
      const x=20+i*292;sx.fillStyle='#24272d';sx.fillRect(x,50,276,680);sx.fillStyle='#fff';sx.font='bold 15px sans-serif';sx.fillText(label,x+10,78);for(let yy=0;yy<620;yy+=16)for(let xx=0;xx<240;xx+=16) {
        sx.fillStyle=((xx+yy)/16)%2?'#eee':'#fff';sx.fillRect(x+18+xx,92+yy,16,16)
      }
      sx.imageSmoothingEnabled=false;sx.drawImage(img,0,0,240,310,x+18,92,240,310);sx.fillStyle='#cbd0d8';sx.font='13px sans-serif';
      const caption=label==='torso-only'?'head + arm-free torso + central back fill':label.includes('thigh')?'walkA trouser donor; hip cap reconstructed':label.includes('far-left')?'anatomical left; west-idle mirror; watch retained':'anatomical right; walkA; no watch';
      sx.fillText(caption,x+10,430)
    }
    );
    writeFileSync(resolve(audit,'man-torso-arm-contact-sheet.png'),sheet.toBuffer('image/png'))
  }
  const appliedTransforms= {
  }
  ;
  for(const target of targets) {
    const g=target.geometry,frame=createCanvas(240,310),x=frame.getContext('2d'),phaseTransforms= {
    }
    ,draw=id=> {
      const[a,b]=targetPair(g,id);
      phaseTransforms[id]=mapped(x,donors[id],pieces[id],a,b,scales[id])
    }
    ;
    for(const id of['far-left-thigh','far-left-shin','far-left-shoe','near-right-thigh','near-right-shin','near-right-shoe','far-left-upper-arm','far-left-forearm-hand'])draw(id);
    const bodyTranslate= {
      x:g.joints.right.hip.x-kit.bodySourceHip.x,y:g.joints.right.hip.y-kit.bodySourceHip.y
    }
    ;
    x.save();
    x.translate(bodyTranslate.x,bodyTranslate.y);
    x.drawImage(body,0,0);
    x.restore();
    phaseTransforms.body= {
      scale:1,translate:bodyTranslate,sourceHip: {
        ...kit.bodySourceHip
      }
      ,targetHip: {
        ...g.joints.right.hip
      }
    }
    ;
    for(const id of['near-right-upper-arm','near-right-forearm-hand'])draw(id);
    appliedTransforms[target.phaseId]=phaseTransforms;
    const over=skeleton(frame,g),guide=geometryGuide(g,character,kit),base=`frames/${kit.characterId}-east-${target.phaseId}`,cleanBytes=frame.toBuffer('image/png'),overBytes=over.toBuffer('image/png'),guideBytes=guide.toBuffer('image/png');
    writeFileSync(resolve(out,`${base}.png`),cleanBytes);
    writeFileSync(resolve(out,`${base}-overlay.png`),overBytes);
    writeFileSync(resolve(out,`${base}-guide.png`),guideBytes);
    outputs[target.phaseId]= {
      clean:`${base}.png`,overlay:`${base}-overlay.png`,guide:`${base}-guide.png`,sha256: {
        clean:sha(cleanBytes),overlay:sha(overBytes),guide:sha(guideBytes)
      }
    }
  }
  const sourceName=`frames/${kit.characterId}-source.png`,bodyName=`frames/${kit.characterId}-body.png`,sourcePreviewBytes=walk.toBuffer('image/png'),bodyPreviewBytes=body.toBuffer('image/png');
  writeFileSync(resolve(out,sourceName),sourcePreviewBytes);
  writeFileSync(resolve(out,bodyName),bodyPreviewBytes);
  records.push( {
    id:kit.characterId,label:character.label,sourcePath:kit.sourcePath,sourceSha256:kit.sourceSha256,kitPath:`tools/character-mapping/retained-donor-merge/${kitName}`,kitSha256:sha(kitBytes),head: {
      source:'walkEastA',scale:1,reusedAcrossAllPhases:true
    }
    ,bodySourceHip:kit.bodySourceHip,torso: {
      clipPolygon:kit.torsoClip,backFill:kit.backFill,actualBodySourceHip:kit.bodySourceHip
    }
    ,guide: {
      kind:'independent-compiled-geometry',widths:kit.guideWidths,usesRasterAlpha:false
    }
    ,fixedScales:scales,appliedTransforms,targets:Object.fromEntries(targets.map(t=>[t.phaseId,t.geometry])),outputs,sourcePreview:sourceName,bodyPreview:bodyName,previewHashes: {
      source:sha(sourcePreviewBytes),body:sha(bodyPreviewBytes)
    }
    ,leftArmProvenance:'anatomical-left arm from same-character west idle, horizontally reflected for east registration'
  }
  );
}
const proof= {
  schemaVersion:1,status:'candidate-review-not-production-accepted',acceptedSolver:'tools/character-mapping/math.mjs#compileLateral',phaseIds:['01','02','03','04','05','06','07','08'],characters:records,checks: {
    builtCharacterCount:2,builtEastPhaseCount:16,headScaleOne:'recorded-per-character',fixedDonorScaleReuse:'one scale per piece per character'
  }
  ,limitations:['Candidate articulation only; production and roster coverage are not accepted.','Hidden joint caps and torso sides use bounded same-character garment/trouser texture reconstruction; source-visible front and pocket details remain in the torso core.','The man hidden rear/side torso uses a flat central back-fabric patch, so reconstructed silhouette seams remain review limits rather than approved design detail.','Independent guide widths come from isolated source-piece extents and fitted torso clips; the uncertain outer garment contour is approximate and does not reuse rendered alpha.','Standing south and seated registration are outside this versioned milestone.','Only east walking is rendered.']
}
;
writeFileSync(resolve(out,'two-character-eight-east.json'),JSON.stringify(proof,null,2)+'\n');
const initial=records.map(r=>`<section><h2>${r.label}</h2><div class="preview"><figure><b>Source stride</b><img src="${r.sourcePreview}"></figure><figure><b>Reconstructed body</b><img src="${r.bodyPreview}"></figure>${['01','03'].map(p=>`<figure><b>${p}
</b><img src="${r.outputs[p].clean}"></figure>`).join('')}</div></section>`).join('');
const appData=JSON.stringify(records.map(r=>( {
  id:r.id,label:r.label,outputs:r.outputs,source:r.sourcePreview,body:r.bodyPreview
}
)));
const html=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>body{margin:0;padding:22px;background:#17191d;color:#f5f4f0;font:14px system-ui}main{max-width:1280px;margin:auto}h1{margin:0 0 5px}.controls{display:flex;gap:10px;align-items:center;margin:14px 0}.stage{display:grid;grid-template-columns:repeat(2,280px);gap:18px}.card,section{background:#24272d;border:1px solid #4a5059;border-radius:10px;padding:14px}.frame{background:#eeece6;width:240px;height:310px;position:relative;margin:auto}.frame img{width:240px;height:310px}.preview{display:grid;grid-template-columns:repeat(4,240px);gap:12px}figure{margin:0;background:#eeece6;color:#222;padding:8px;text-align:center;border-radius:7px}figure img{width:240px;height:310px;object-fit:contain}.contact{display:grid;grid-template-columns:repeat(4,240px);gap:10px}.contact img{width:240px;height:310px;background:#eeece6}.muted{color:#c8ced6}.hidden{display:none}@media(max-width:1100px){.preview,.contact{grid-template-columns:repeat(2,240px)}}</style></head><body data-ready="true"><main><h1>Two retained characters - eight east phases</h1><p class="muted">Same per-character donors and fixed normalization scales across the shared accepted gait.</p><div class="controls"><button id="prev">Previous</button><b id="phase">01</b><button id="next">Next</button><label><input id="joints" type="checkbox"> joints</label><label><input id="sil" type="checkbox"> independent fitted guide</label></div><div id="stage" class="stage"></div><h2>Stride/passing source comparison</h2>${initial}<h2>All eight clean frames</h2><div id="contact"></div></main><script>const D=${appData},P=['01','02','03','04','05','06','07','08'];let i=0;const stage=document.getElementById('stage'),contact=document.getElementById('contact');function src(r,p){return r.outputs[p][sil.checked?'guide':joints.checked?'overlay':'clean']}function render(){phase.textContent=P[i];stage.innerHTML=D.map(r=>'<div class="card"><b>'+r.label+'</b><div class="frame"><img src="'+src(r,P[i])+'"></div></div>').join('')}prev.onclick=()=>{i=(i+7)%8;render()};next.onclick=()=>{i=(i+1)%8;render()};joints.onchange=()=>{if(joints.checked)sil.checked=false;render()};sil.onchange=()=>{if(sil.checked)joints.checked=false;render()};contact.innerHTML=D.map(r=>'<section><h3>'+r.label+'</h3><div class="contact">'+P.map(p=>'<figure><b>'+p+'</b><img src="'+r.outputs[p].clean+'"></figure>').join('')+'</div></section>').join('');render()</script></body></html>`;
writeFileSync(resolve(out,'two-character-eight-east.html'),html);
console.log(JSON.stringify( {
  characters:records.length,frames:16,output:out
}
));
