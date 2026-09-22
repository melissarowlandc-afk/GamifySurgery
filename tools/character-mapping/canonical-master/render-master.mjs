import { createCanvas } from '@napi-rs/canvas';
import { MASTER } from './canonical-geometry.mjs';

const COLORS={outline:'#26313a',skin:'#d9a779',skinLight:'#edc49b',shirt:'#6d8792',shirtLight:'#819aa3',pants:'#43505d',pantsLight:'#53616d',shoe:'#5b4534',sole:'#2b2928',hair:'#727980',hairLight:'#90979c',guide:'#2acadd'};
const midpoint=(a,b)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});

function capsule(context,a,b,width,fill,highlight=true){
  context.lineCap='round'; context.strokeStyle=COLORS.outline; context.lineWidth=width+3; context.beginPath();context.moveTo(a.x,a.y);context.lineTo(b.x,b.y);context.stroke();
  context.strokeStyle=fill;context.lineWidth=width;context.beginPath();context.moveTo(a.x,a.y);context.lineTo(b.x,b.y);context.stroke();
  if(highlight){context.globalAlpha=.24;context.strokeStyle='#fff';context.lineWidth=Math.max(1,width*.16);context.beginPath();context.moveTo(a.x-1,a.y);context.lineTo(b.x-1,b.y);context.stroke();context.globalAlpha=1;}
}
function joinedSegments(context,a,b,c,widths,fills){
  context.lineCap='round';context.strokeStyle=COLORS.outline;
  for(const [start,end,width] of [[a,b,widths[0]],[b,c,widths[1]]]){context.lineWidth=width+3;context.beginPath();context.moveTo(start.x,start.y);context.lineTo(end.x,end.y);context.stroke();}
  for(const [start,end,width,fill] of [[a,b,widths[0],fills[0]],[b,c,widths[1],fills[1]]]){context.strokeStyle=fill;context.lineWidth=width;context.beginPath();context.moveTo(start.x,start.y);context.lineTo(end.x,end.y);context.stroke();context.globalAlpha=.22;context.strokeStyle='#fff';context.lineWidth=Math.max(1,width*.13);context.beginPath();context.moveTo(start.x-1,start.y);context.lineTo(end.x-1,end.y);context.stroke();context.globalAlpha=1;}
}

function foot(context,foot,view){
  const {heel,toe,ankle}=foot, dx=toe.x-heel.x,dy=toe.y-heel.y,len=Math.hypot(dx,dy);
  if(view==='south'||view==='north'){
    const angle=Math.atan2(dy,dx),center=midpoint(heel,toe);context.fillStyle=COLORS.outline;context.beginPath();context.ellipse(center.x,center.y-4,Math.max(10,len*.63),7,angle,0,Math.PI*2);context.fill();context.fillStyle=COLORS.shoe;context.beginPath();context.ellipse(center.x,center.y-5,Math.max(9,len*.58),5.5,angle,0,Math.PI*2);context.fill();context.strokeStyle=COLORS.sole;context.lineWidth=2;context.beginPath();context.moveTo(heel.x,heel.y);context.lineTo(toe.x,toe.y);context.stroke();return;
  }
  const upperA={x:heel.x,y:heel.y-8},upperB={x:toe.x,y:toe.y-7};
  context.fillStyle=COLORS.outline;context.beginPath();context.moveTo(heel.x-1,heel.y+2);context.lineTo(toe.x+Math.sign(dx||1)*2,toe.y+1);context.lineTo(upperB.x,upperB.y);context.lineTo(ankle.x,ankle.y);context.lineTo(upperA.x,upperA.y);context.closePath();context.fill();
  context.fillStyle=COLORS.shoe;context.beginPath();context.moveTo(heel.x,heel.y);context.lineTo(toe.x,toe.y-1);context.lineTo(upperB.x,upperB.y+1);context.lineTo(ankle.x,ankle.y+1);context.lineTo(upperA.x+1,upperA.y+1);context.closePath();context.fill();
  context.strokeStyle=COLORS.sole;context.lineWidth=3;context.beginPath();context.moveTo(heel.x,heel.y+1);context.lineTo(toe.x,toe.y);context.stroke();
}

function hand(context,joint){
  const palm=joint.palm,thumb=joint.thumbTip;context.fillStyle=COLORS.outline;context.beginPath();context.ellipse(palm.x,palm.y,MASTER.shapes.hand.palmRadiusX+1.4,MASTER.shapes.hand.palmRadiusY+1.5,0,0,Math.PI*2);context.fill();
  context.fillStyle=COLORS.skin;context.beginPath();context.ellipse(palm.x,palm.y,MASTER.shapes.hand.palmRadiusX,MASTER.shapes.hand.palmRadiusY,0,0,Math.PI*2);context.fill();
  if(joint.thumbVisibility==='visible'){context.strokeStyle=COLORS.outline;context.lineWidth=4;context.lineCap='round';context.beginPath();context.moveTo(palm.x,palm.y-1);context.lineTo(thumb.x,thumb.y);context.stroke();context.strokeStyle=COLORS.skinLight;context.lineWidth=2.5;context.stroke();}
}

function limb(context,joint,kind,view){
  if(kind==='arm'){const start={x:joint.shoulder.x+(joint.elbow.x-joint.shoulder.x)*.14,y:joint.shoulder.y+(joint.elbow.y-joint.shoulder.y)*.14};joinedSegments(context,start,joint.elbow,joint.wrist,[MASTER.shapes.limbs.upperArmWidth,MASTER.shapes.limbs.forearmWidth],[COLORS.shirtLight,COLORS.shirt]);hand(context,joint);}
  else {joinedSegments(context,joint.hip,joint.knee,joint.ankle,[MASTER.shapes.limbs.thighWidth,MASTER.shapes.limbs.shinWidth],[COLORS.pantsLight,COLORS.pants]);foot(context,joint,view);}
}

function torsoPath(context,geometry){
  const {view,hipCenter,joints}=geometry, shoulders=[joints.left.shoulder,joints.right.shoulder], shoulderY=(shoulders[0].y+shoulders[1].y)/2;
  const lateral=view==='east'||view==='west',shape=lateral?MASTER.shapes.torso.side:MASTER.shapes.torso.front,topHalf=shape.shoulderHalfWidth,chestHalf=shape.chestHalfWidth,hipHalf=shape.hipHalfWidth;
  context.beginPath();context.moveTo(hipCenter.x-10,shoulderY-2);context.quadraticCurveTo(hipCenter.x-18,shoulderY-11,hipCenter.x-topHalf+8,shoulderY-11);context.quadraticCurveTo(hipCenter.x-topHalf,shoulderY-10,hipCenter.x-chestHalf,shoulderY+20);context.lineTo(hipCenter.x-chestHalf,shoulderY+42);context.quadraticCurveTo(hipCenter.x-hipHalf,hipCenter.y-4,hipCenter.x-hipHalf,hipCenter.y+2);context.quadraticCurveTo(hipCenter.x,hipCenter.y+8,hipCenter.x+hipHalf,hipCenter.y+2);context.quadraticCurveTo(hipCenter.x+hipHalf,hipCenter.y-4,hipCenter.x+chestHalf,shoulderY+42);context.lineTo(hipCenter.x+chestHalf,shoulderY+20);context.quadraticCurveTo(hipCenter.x+topHalf,shoulderY-10,hipCenter.x+topHalf-8,shoulderY-11);context.quadraticCurveTo(hipCenter.x+18,shoulderY-11,hipCenter.x+10,shoulderY-2);context.closePath();
}

function neckAndHead(context,geometry){
  const shoulderY=(geometry.joints.left.shoulder.y+geometry.joints.right.shoulder.y)/2, lateral=geometry.view==='east'||geometry.view==='west', facing=geometry.view==='east'?1:geometry.view==='west'?-1:0;
  const cx=geometry.hipCenter.x-facing*3, cy=shoulderY-52;
  context.fillStyle=COLORS.outline;context.fillRect(cx-11,shoulderY-16,22,23);context.fillStyle=COLORS.skin;context.fillRect(cx-9,shoulderY-17,18,24);
  context.fillStyle=COLORS.outline;context.beginPath();context.ellipse(cx,cy,MASTER.anatomy.headRadiusX+2,MASTER.anatomy.headRadiusY+2,0,0,Math.PI*2);context.fill();
  context.fillStyle=COLORS.skin;context.beginPath();context.ellipse(cx,cy,MASTER.anatomy.headRadiusX,MASTER.anatomy.headRadiusY,0,0,Math.PI*2);context.fill();
  const scalpShade=context.createRadialGradient(cx-10,cy-18,2,cx,cy,45);scalpShade.addColorStop(0,'rgba(255,255,255,.22)');scalpShade.addColorStop(1,'rgba(130,86,55,.08)');context.fillStyle=scalpShade;context.beginPath();context.ellipse(cx,cy,MASTER.anatomy.headRadiusX-1,MASTER.anatomy.headRadiusY-1,0,0,Math.PI*2);context.fill();
  context.strokeStyle=COLORS.outline;context.lineWidth=2;
  if(geometry.view==='south'){for(const dx of [-13,13]){context.beginPath();context.arc(cx+dx,cy+2,4,0,Math.PI*2);context.stroke();}context.beginPath();context.moveTo(cx-9,cy+19);context.quadraticCurveTo(cx,cy+24,cx+9,cy+19);context.stroke();}
  else if(geometry.view==='east'||geometry.view==='west'){context.beginPath();context.arc(cx+facing*15,cy+3,4,0,Math.PI*2);context.stroke();context.beginPath();context.moveTo(cx+facing*34,cy+6);context.lineTo(cx+facing*42,cy+10);context.lineTo(cx+facing*34,cy+13);context.stroke();}
}

export function renderMaster(geometry,{guide=false,chair=false}={}){
  const canvas=createCanvas(MASTER.frame.width,MASTER.frame.height),context=canvas.getContext('2d');
  if(chair){const seatY=geometry.hipCenter.y+2;context.fillStyle='#88949a';context.fillRect(70,seatY,84,8);context.fillStyle='#68777e';context.fillRect(76,seatY+7,7,MASTER.frame.floorY-seatY-7);context.fillRect(141,seatY+7,7,MASTER.frame.floorY-seatY-7);}
  const {joints,view}=geometry,near=view==='east'?'right':view==='west'?'left':'right',far=near==='right'?'left':'right';
  if(view==='south'||view==='north'){if(geometry.phaseId!=='sit')for(const side of ['left','right'])limb(context,joints[side],'arm',view);for(const side of ['left','right'])limb(context,joints[side],'leg',view);}
  else {limb(context,joints[far],'arm',view);limb(context,joints[far],'leg',view);limb(context,joints[near],'leg',view);}
  const shoulderY=(joints.left.shoulder.y+joints.right.shoulder.y)/2,cx=geometry.hipCenter.x;
  context.fillStyle=COLORS.outline;torsoPath(context,geometry);context.fill();context.save();torsoPath(context,geometry);context.clip();const grad=context.createLinearGradient(cx-44,0,cx+44,0);grad.addColorStop(0,'#58737d');grad.addColorStop(.5,COLORS.shirtLight);grad.addColorStop(1,'#55707a');context.fillStyle=grad;context.fillRect(cx-50,shoulderY-8,100,geometry.hipCenter.y-shoulderY+18);context.restore();
  context.strokeStyle='rgba(255,255,255,.28)';context.lineWidth=2;context.beginPath();context.moveTo(cx,shoulderY+8);context.lineTo(cx,geometry.hipCenter.y+2);context.stroke();
  neckAndHead(context,geometry);
  if(view==='east'||view==='west')limb(context,joints[near],'arm',view);
  if(geometry.phaseId==='sit')for(const side of ['left','right'])limb(context,joints[side],'arm',view);
  if(guide){context.globalAlpha=.88;context.strokeStyle=COLORS.guide;context.fillStyle=COLORS.guide;context.lineWidth=1.5;context.setLineDash([4,3]);context.beginPath();context.moveTo(MASTER.frame.axisX,0);context.lineTo(MASTER.frame.axisX,MASTER.frame.height);context.moveTo(0,MASTER.frame.floorY);context.lineTo(MASTER.frame.width,MASTER.frame.floorY);context.stroke();context.setLineDash([]);for(const side of ['left','right']){const j=joints[side];context.beginPath();context.moveTo(j.shoulder.x,j.shoulder.y);context.lineTo(j.elbow.x,j.elbow.y);context.lineTo(j.wrist.x,j.wrist.y);context.lineTo(j.palm.x,j.palm.y);context.moveTo(j.hip.x,j.hip.y);context.lineTo(j.knee.x,j.knee.y);context.lineTo(j.ankle.x,j.ankle.y);context.moveTo(j.heel.x,j.heel.y);context.lineTo(j.toe.x,j.toe.y);context.stroke();for(const point of [j.shoulder,j.elbow,j.wrist,j.hip,j.knee,j.ankle,j.heel,j.toe,j.thumbTip]){context.beginPath();context.arc(point.x,point.y,2,0,Math.PI*2);context.fill();}}context.globalAlpha=1;}
  return canvas;
}

export function renderGuide(geometry){
  const canvas=createCanvas(MASTER.frame.width,MASTER.frame.height),context=canvas.getContext('2d'),{joints,view}=geometry,shoulderY=(joints.left.shoulder.y+joints.right.shoulder.y)/2,facing=view==='east'?1:view==='west'?-1:0,headX=geometry.hipCenter.x-facing*3,headY=shoulderY-52;
  context.strokeStyle='rgba(42,202,221,.9)';context.fillStyle='rgba(42,202,221,.12)';context.lineWidth=1.5;context.setLineDash([4,3]);context.beginPath();context.moveTo(MASTER.frame.axisX,0);context.lineTo(MASTER.frame.axisX,MASTER.frame.height);context.moveTo(0,MASTER.frame.floorY);context.lineTo(MASTER.frame.width,MASTER.frame.floorY);context.stroke();context.setLineDash([]);
  torsoPath(context,geometry);context.fill();context.stroke();context.strokeRect(headX-MASTER.anatomy.neckHalfWidth,shoulderY-17,MASTER.anatomy.neckHalfWidth*2,24);context.beginPath();context.ellipse(headX,headY,MASTER.anatomy.headRadiusX+2,MASTER.anatomy.headRadiusY+2,0,0,Math.PI*2);context.stroke();
  context.font='9px sans-serif';context.textBaseline='middle';
  for(const side of ['left','right']){const j=joints[side];context.strokeStyle=side==='left'?'#f5b942':'#2acadd';context.fillStyle=context.strokeStyle;context.lineWidth=2;context.beginPath();context.moveTo(j.shoulder.x,j.shoulder.y);context.lineTo(j.elbow.x,j.elbow.y);context.lineTo(j.wrist.x,j.wrist.y);context.lineTo(j.palm.x,j.palm.y);context.moveTo(j.hip.x,j.hip.y);context.lineTo(j.knee.x,j.knee.y);context.lineTo(j.ankle.x,j.ankle.y);context.moveTo(j.heel.x,j.heel.y);context.lineTo(j.toe.x,j.toe.y);context.stroke();for(const point of [j.shoulder,j.elbow,j.wrist,j.palm,j.thumbTip,j.hip,j.knee,j.ankle,j.heel,j.toe]){context.beginPath();context.arc(point.x,point.y,2.2,0,Math.PI*2);context.fill();}context.fillText('T',j.thumbTip.x+3,j.thumbTip.y);context.fillText('H',j.heel.x-7,j.heel.y-7);context.fillText('Toe',j.toe.x+2,j.toe.y-7);}
  context.fillStyle='#2acadd';context.fillText('neck',headX+11,shoulderY-11);context.fillText('crown',headX+4,headY-MASTER.anatomy.headRadiusY-5);return canvas;
}
