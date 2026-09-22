import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { compileLateral } from '../math.mjs';

const repo = resolve(import.meta.dirname, '../../..');
const out = resolve(repo, 'artifacts/character-movement/retained-donor-merge');
mkdirSync(resolve(out, 'frames'), { recursive: true });
const configBytes = readFileSync(resolve(import.meta.dirname, 'mapping.json'));
const config = JSON.parse(configBytes);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const point = value => ({ x: value[0], y: value[1] });

function crop(image, box) {
  const canvas = createCanvas(box.width, box.height);
  canvas.getContext('2d').drawImage(image, box.x, box.y, box.width, box.height, 0, 0, box.width, box.height);
  return canvas;
}
function keyBackground(canvas) {
  const context = canvas.getContext('2d'), image = context.getImageData(0, 0, canvas.width, canvas.height), data = image.data;
  const seen = new Uint8Array(canvas.width * canvas.height), queue = new Uint32Array(seen.length); let first = 0, last = 0;
  const eligible = i => { const p=i*4,r=data[p],g=data[p+1],b=data[p+2]; return Math.min(r,g,b)>=224 && Math.max(r,g,b)-Math.min(r,g,b)<=24; };
  const add = i => { if (!seen[i] && eligible(i)) { seen[i]=1; queue[last++]=i; } };
  for(let x=0;x<canvas.width;x++){add(x);add((canvas.height-1)*canvas.width+x)}
  for(let y=0;y<canvas.height;y++){add(y*canvas.width);add(y*canvas.width+canvas.width-1)}
  while(first<last){const i=queue[first++],x=i%canvas.width,y=Math.floor(i/canvas.width);if(x)add(i-1);if(x+1<canvas.width)add(i+1);if(y)add(i-canvas.width);if(y+1<canvas.height)add(i+canvas.width)}
  for(let i=0;i<seen.length;i++)if(seen[i])data[i*4+3]=0;
  context.putImageData(image,0,0); return canvas;
}
function polygonClip(context, polygon) { context.beginPath(); polygon.forEach((p,i)=>i?context.lineTo(p[0],p[1]):context.moveTo(p[0],p[1])); context.closePath(); context.clip(); }
function bodyDonor(standing, character) {
  const patched=createCanvas(standing.width,standing.height), pc=patched.getContext('2d'); pc.drawImage(standing,0,0);
  for(const patch of character.body.patches){const [sx,sy,sw,sh]=patch.source,[dx,dy,dw,dh]=patch.destination;pc.drawImage(standing,sx,sy,sw,sh,dx,dy,dw,dh)}
  const body=createCanvas(standing.width,standing.height), bc=body.getContext('2d');
  bc.save(); polygonClip(bc,character.body.headMask); bc.drawImage(standing,0,0); bc.restore();
  bc.save(); polygonClip(bc,character.body.torsoMask); bc.drawImage(patched,0,0); bc.restore();
  return { body, patched };
}
function limbDonor(source,piece){const canvas=createCanvas(source.width,source.height),c=canvas.getContext('2d');c.save();polygonClip(c,piece.polygon);c.drawImage(source,0,0);c.restore();return canvas}
function drawMapped(context, donor, sourceStart, sourceEnd, targetStart, targetEnd){const sa=point(sourceStart),sb=point(sourceEnd),sourceAngle=Math.atan2(sb.y-sa.y,sb.x-sa.x),targetAngle=Math.atan2(targetEnd.y-targetStart.y,targetEnd.x-targetStart.x),scale=Math.hypot(targetEnd.x-targetStart.x,targetEnd.y-targetStart.y)/Math.hypot(sb.x-sa.x,sb.y-sa.y);context.save();context.translate(targetStart.x,targetStart.y);context.rotate(targetAngle-sourceAngle);context.scale(scale,scale);context.translate(-sa.x,-sa.y);context.drawImage(donor,0,0);context.restore();return scale}
function lateralRecipe(character){const f=character.recipe.frame;return{identity:{templateId:character.id},lineage:{east:{kind:'independent'},west:{kind:'reflected',fromView:'east',phasePermutation:{'01':'05','02':'06','03':'07','04':'08','05':'01','06':'02','07':'03','08':'04'}}},lateral:{...character.recipe,registration:{east:{scale:1,sourceAxisX:f.axisX,sourceFloorY:f.floorY,sourceWidth:f.width,sourceHeight:f.height},west:{scale:1,sourceAxisX:f.axisX,sourceFloorY:f.floorY,sourceWidth:f.width,sourceHeight:f.height}}}}}
function targetPair(geometry,piece){const j=geometry.joints[piece.side];if(piece.kind==='upperArm')return[j.shoulder,j.elbow];if(piece.kind==='forearm')return[j.elbow,j.wrist];if(piece.kind==='thigh')return[j.hip,j.knee];if(piece.kind==='shin')return[j.knee,j.ankle];if(piece.kind==='shoe')return[j.shoeHeel,j.shoeToe];throw new Error(`unknown kind ${piece.kind}`)}
function skeleton(frame, geometry){const c=frame.getContext('2d');c.save();c.strokeStyle='#ec1f6a';c.fillStyle='#fff';c.lineWidth=1.2;for(const side of ['left','right']){const j=geometry.joints[side];for(const [a,b] of [['shoulder','elbow'],['elbow','wrist'],['hip','knee'],['knee','ankle'],['shoeHeel','shoeToe']]){c.beginPath();c.moveTo(j[a].x,j[a].y);c.lineTo(j[b].x,j[b].y);c.stroke()}for(const k of ['shoulder','elbow','wrist','hip','knee','ankle']){c.beginPath();c.arc(j[k].x,j[k].y,2.5,0,Math.PI*2);c.fill();c.stroke()}}c.restore()}

const records=[];
for(const character of config.characters){
  const sourceBytes=readFileSync(resolve(repo,character.sourcePath)); if(sha(sourceBytes)!==character.sourceSha256)throw new Error(`hash mismatch ${character.id}`);
  const source=await loadImage(resolve(repo,character.sourcePath)); if(source.width!==character.sourceDimensions.width||source.height!==character.sourceDimensions.height)throw new Error(`dimensions mismatch ${character.id}`);
  const stride=keyBackground(crop(source,config.sourceCrop)), standing=keyBackground(crop(source,config.standingCrop));
  const {body,patched}=bodyDonor(stride,character); const donors=Object.fromEntries(character.pieces.map(piece=>[piece.id,limbDonor(stride,piece)]));
  const targets=compileLateral(lateralRecipe(character)).filter(t=>t.view==='east'&&['01','03'].includes(t.phaseId)); const phase01=targets.find(t=>t.phaseId==='01').geometry,phase03=targets.find(t=>t.phaseId==='03').geometry;
  const frames={},pieceScales={};
  for(const [phase,geometry] of [['01',phase01],['03',phase03]]){const frame=createCanvas(240,310),fc=frame.getContext('2d');const drawPiece=id=>{const piece=character.pieces.find(p=>p.id===id),[a,b]=targetPair(geometry,piece);pieceScales[`${phase}:${id}`]=Number(drawMapped(fc,donors[id],piece.start,piece.end,a,b).toFixed(6))};for(const id of ['far-left-thigh','far-left-shin','far-left-shoe','near-right-thigh','near-right-shin','near-right-shoe','far-left-upper-arm','far-left-forearm'])drawPiece(id);fc.save();fc.translate(character.standingRegistration.x,character.standingRegistration.y+geometry.phaseBob);fc.scale(character.standingRegistration.scale,character.standingRegistration.scale);fc.drawImage(body,0,0);fc.restore();for(const id of ['near-right-upper-arm','near-right-forearm'])drawPiece(id);frames[phase]=frame}
  const output={};
  for(const [phase,frame] of Object.entries(frames)){const clean=frame.toBuffer('image/png'),overlay=createCanvas(240,310);overlay.getContext('2d').drawImage(frame,0,0);skeleton(overlay,phase==='01'?phase01:phase03);const over=overlay.toBuffer('image/png');const cleanName=`frames/${character.id}-east-${phase}.png`,overName=`frames/${character.id}-east-${phase}-overlay.png`;writeFileSync(resolve(out,cleanName),clean);writeFileSync(resolve(out,overName),over);output[phase]={clean:cleanName,overlay:overName,sha256:sha(clean)}}
  const sourceName=`frames/${character.id}-source-stride.png`,bodyName=`frames/${character.id}-body-donor.png`,donorName=`frames/${character.id}-separated-donors.png`;writeFileSync(resolve(out,sourceName),stride.toBuffer('image/png'));writeFileSync(resolve(out,bodyName),body.toBuffer('image/png'));const donorSheet=createCanvas(480,620),dc=donorSheet.getContext('2d');dc.fillStyle='#eeece6';dc.fillRect(0,0,480,620);character.pieces.forEach((piece,index)=>{const col=index%2,row=Math.floor(index/2);dc.save();dc.translate(col*240,row*120);dc.drawImage(donors[piece.id],0,-90);dc.restore()});writeFileSync(resolve(out,donorName),donorSheet.toBuffer('image/png'));
  records.push({id:character.id,label:character.label,sourcePath:character.sourcePath,sourceSha256:character.sourceSha256,sourceDimensions:character.sourceDimensions,sourceCrop:config.sourceCrop,standingCrop:config.standingCrop,standingRegistration:character.standingRegistration,body:character.body,pieces:character.pieces.map(p=>({...p,donor:'walkEastA',targetPhases:['01','03']})),pieceScales,targets:{'01':phase01,'03':phase03},output,sourcePreview:sourceName,bodyPreview:bodyName,donorPreview:donorName});
}
const data={schemaVersion:1,status:'visual-review-required',acceptedSolver:'tools/character-mapping/math.mjs#compileLateral',mappingConfig:'tools/character-mapping/retained-donor-merge/mapping.json',mappingConfigSha256:sha(configBytes),characters:records,checks:{sourceHashes:'passed',sourceDimensions:'passed',phaseTargets:'compileLateral east 01/03',phase03RightSupport:'straight and sole registered by compileLateral',renderedFrameCount:records.length*2,reusableDonors:'the same head, torso, bilateral upper-arm, forearm, thigh, shin and shoe donors render both phases'},limitations:['Both phases use the same mapped source pieces and renderer.','The torso uses same-character standing-east head/torso pixels plus a bounded adjacent-garment patch where the standing near arm occluded the lower torso edge.','Shoulder and hip overlaps are hidden beneath the torso; polygon donors exclude the face and unrelated opposite limbs.','This proof covers two east phases for two source identities only. Runtime crosswalk, the full cycle, other directions, seated frames and roster coverage remain open.']};
writeFileSync(resolve(out,'mapping-proof.json'),JSON.stringify(data,null,2)+'\n');
const cards=records.map(r=>`<section><h2>${r.label}</h2><p class="source">${r.sourcePath}<br>${r.sourceSha256}</p><div class="grid"><figure><figcaption>Unaltered retained stride donor</figcaption><img src="${r.sourcePreview}"></figure><figure><figcaption>Same-source body reconstruction donor</figcaption><img src="${r.bodyPreview}"></figure><figure><figcaption>01 · right stride</figcaption><img class="clean" src="${r.output['01'].clean}"><img class="overlay" src="${r.output['01'].overlay}"></figure><figure><figcaption>03 · right support passing</figcaption><img class="clean" src="${r.output['03'].clean}"><img class="overlay" src="${r.output['03'].overlay}"></figure></div><p class="note">Both arms are separate mapped donors in phase 03. Pink overlay identifies accepted target joints; clean pixels remain the default review.</p></section>`).join('');
const html=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Retained donor merge proof</title><style>body{margin:0;padding:22px;background:#17191d;color:#f6f5f1;font:15px system-ui}main{max-width:1280px;margin:auto}h1{margin:0 0 5px;font-size:24px}.intro{color:#cdd1d8;margin:0 0 14px}.toggle{display:block;margin:12px 0 16px}section{background:#24272d;border:1px solid #4b505a;border-radius:12px;padding:16px;margin:0 0 22px}h2{margin:0 0 4px;font-size:19px}.source{font:11px ui-monospace,monospace;color:#b8c0cc;overflow-wrap:anywhere}.grid{display:grid;grid-template-columns:repeat(4,240px);gap:14px;align-items:start}figure{margin:0;background:#eeece6;color:#24272d;border-radius:8px;padding:9px;text-align:center}figcaption{font-weight:700;font-size:13px;min-height:34px}img{display:block;width:240px;height:310px;object-fit:contain}.overlay{display:none}body.show-overlay .clean{display:none}body.show-overlay .overlay{display:block}.note{margin:12px 0 0;color:#d9bd8e;font-size:13px}@media(max-width:1120px){.grid{grid-template-columns:repeat(2,240px)}}@media(max-width:590px){body{padding:10px}.grid{grid-template-columns:240px}}</style></head><body data-ready="true"><main><h1>Retained artwork · measured east donor merge</h1><p class="intro">Original retained pixels, character-specific proportions, shared accepted phases 01 and 03.</p><label class="toggle"><input id="overlay" type="checkbox"> Anatomical side and target-joint overlay</label>${cards}</main><script>document.getElementById('overlay').addEventListener('change',e=>document.body.classList.toggle('show-overlay',e.target.checked));</script></body></html>`;
writeFileSync(resolve(out,'retained-donor-merge.html'),html);
console.log(JSON.stringify({characters:records.length,frames:records.length*2,output:out}));
