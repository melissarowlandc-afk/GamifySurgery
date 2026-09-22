// Independent additive renderer. Neutral operations intentionally transcribe the approved renderers.
import {
  createCanvas
}
from '@napi-rs/canvas';
import {
  MASTER
}
from '../canonical-master/canonical-geometry.mjs';
import {
  ACTION
}
from '../canonical-actions/action-geometry.mjs';
import {
  assertCostume
}
from './costumes.mjs';
const N={
  outline:'#26313a',skin:'#d9a779',skinLight:'#edc49b',shirt:'#6d8792',shirtLight:'#819aa3',pants:'#43505d',pantsLight:'#53616d',shoe:'#5b4534',sole:'#2b2928',guide:'#2acadd',chair:'#78868d',board:'#c89b58',paper:'#efe7d5'
}
;
const midpoint=(a,b)=>({
  x:(a.x+b.x)/2,y:(a.y+b.y)/2
});
const RASTER_ASSETS=Symbol.for('gamify-surgery.surface-fitting.raster-assets');
const visible=(op,map)=>(!op.views||op.views.includes(map.view))&&(!op.sides||op.sides.includes(map.side));
function drawPrimitive(ctx,op,palette,map,{
  radiusX=1,radiusY=1,widthScale=1
}={
},rasterAssets){
  if(!visible(op,map))return;
  ctx.save();
  ctx.globalAlpha=op.alpha??1;
  if(op.kind==='raster'){
    const image=rasterAssets?.[op.asset];
    if(!image)throw new Error(`raster asset ${op.asset} is not loaded`);
    const point=map.rasterPoint??map.point;
    ctx.imageSmoothingEnabled=op.interpolation!=='nearest';
    if(ctx.imageSmoothingEnabled)ctx.imageSmoothingQuality='high';
    const drawRaster=(sx,sy,sw,sh,x1,y1,x2,y2)=>{
      const origin=point(x1,y1),across=point(x2,y1),down=point(x1,y2);
      ctx.save();
      if(op.sourceAxes==='yx')ctx.transform((down.x-origin.x)/sw,(down.y-origin.y)/sw,(across.x-origin.x)/sh,(across.y-origin.y)/sh,origin.x,origin.y);
      else ctx.transform((across.x-origin.x)/sw,(across.y-origin.y)/sw,(down.x-origin.x)/sh,(down.y-origin.y)/sh,origin.x,origin.y);
      ctx.drawImage(image,sx,sy,sw,sh,0,0,sw,sh);
      ctx.restore();
    };
    drawRaster(0,0,image.width,image.height,op.x1,op.y1,op.x2,op.y2);
    if(op.coverCaps&&op.sourceAxes==='yx'){
      const cap=radiusY/radiusX;
      drawRaster(0,0,image.width,1,op.x1-cap,op.y1,op.x1,op.y2);
      drawRaster(0,image.height-1,image.width,1,op.x2,op.y1,op.x2+cap,op.y2);
    }
    ctx.restore();
    return;
  }
  ctx.fillStyle=op.fill?palette[op.fill]:'transparent';
  ctx.strokeStyle=op.stroke?palette[op.stroke]:'transparent';
  ctx.lineWidth=(op.width??1)*widthScale;
  ctx.lineCap='round';
  ctx.lineJoin='round';
  ctx.setLineDash(op.dash??[]);
  const point=(x,y)=>map.point(x,y);
  ctx.beginPath();
  if(op.kind==='line'){
    const a=point(op.x1,op.y1),b=point(op.x2,op.y2);
    ctx.moveTo(a.x,a.y);
    ctx.lineTo(b.x,b.y);
  }
  else if(op.kind==='quadratic'){
    const a=point(op.x1,op.y1),q=point(op.qx,op.qy),b=point(op.x2,op.y2);
    ctx.moveTo(a.x,a.y);
    ctx.quadraticCurveTo(q.x,q.y,b.x,b.y);
  }
  else if(op.kind==='ellipse'){
    const c=point(op.x,op.y);
    ctx.ellipse(c.x,c.y,Math.abs(op.rx*radiusX),Math.abs(op.ry*radiusY),map.angle??0,0,Math.PI*2);
  }
  else if(op.kind==='rect'){
    const corners=[[-op.rx,-op.ry],[op.rx,-op.ry],[op.rx,op.ry],[-op.rx,op.ry]].map(([dx,dy])=>point(op.x+dx,op.y+dy));
    ctx.moveTo(corners[0].x,corners[0].y);
    for(const p of corners.slice(1))ctx.lineTo(p.x,p.y);
    ctx.closePath();
  }
  else{
    const points=op.points.map(([x,y])=>point(x,y));
    ctx.moveTo(points[0].x,points[0].y);
    for(const p of points.slice(1))ctx.lineTo(p.x,p.y);
    if(op.kind==='polygon')ctx.closePath();
  }
  if(op.fill)ctx.fill();
  if(op.stroke)ctx.stroke();
  ctx.restore();
}
function surface(ctx,costume,region,map,scale){
  for(const op of costume?.surfaces[region]??[])drawPrimitive(ctx,op,costume.palette,map,scale,costume[RASTER_ASSETS]);
}
function anchor(g,name){
  const shoulderY=(g.joints.left.shoulder.y+g.joints.right.shoulder.y)/2,facing=g.view==='east'?1:g.view==='west'?-1:0,headX=g.hipCenter.x-facing*3;
  if(name==='headBase')return{
    x:headX,y:shoulderY-9
  }
  ;
  if(name==='neckBase')return{
    x:headX,y:shoulderY-12
  }
  ;
  if(name==='leftHip')return g.joints.left.hip;
  if(name==='rightHip')return g.joints.right.hip;
  throw new Error(`unknown anchor ${name}`);
}
function attachments(ctx,g,costume,layer,trace){
  if(!costume)return;
  if(layer==='head-front'&&(g.view==='east'||g.view==='west')){
    const at=anchor(g,'headBase'),facing=g.view==='east'?1:-1;
    ctx.strokeStyle=costume.palette.outline;
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(at.x+facing*34,at.y-37);
    ctx.lineTo(at.x+facing*42,at.y-33);
    ctx.lineTo(at.x+facing*34,at.y-30);
    ctx.stroke();
  }
  for(const item of costume.attachments.filter(entry=>entry.layer===layer)){
    const spec=item.views[g.view];
    if(!spec||spec.visible===false)continue;
    const at=anchor(g,item.anchor),sx=spec.mirrorX?-1:1,map={
      view:g.view,point:(x,y)=>({
        x:at.x+(spec.offsetX??0)+x*sx,y:at.y+(spec.offsetY??0)+y
      })
    }
    ,overlay=createCanvas(ctx.canvas.width,ctx.canvas.height),o=overlay.getContext('2d');
    for(const op of [...item.primitives,...(spec.primitives??[])])drawPrimitive(o,op,costume.palette,map,{},costume[RASTER_ASSETS]);
    const data=o.getImageData(0,0,overlay.width,overlay.height).data;
    let left=overlay.width,top=overlay.height,right=-1,bottom=-1;
    for(let y=0;y<overlay.height;y++)for(let x=0;x<overlay.width;x++)if(data[(y*overlay.width+x)*4+3]){
      left=Math.min(left,x);
      right=Math.max(right,x);
      top=Math.min(top,y);
      bottom=Math.max(bottom,y);
    }
    ctx.drawImage(overlay,0,0);
    trace?.push({
      id:item.id,layer,anchor:item.anchor,origin:at,declaredBounds:{
        left:at.x+(spec.offsetX??0)+(spec.mirrorX?-item.bounds.right:item.bounds.left),right:at.x+(spec.offsetX??0)+(spec.mirrorX?-item.bounds.left:item.bounds.right),top:at.y+(spec.offsetY??0)+item.bounds.top,bottom:at.y+(spec.offsetY??0)+item.bounds.bottom
      },actualBounds:{
        left,top,right,bottom
      }
    });
  }
}
const neutralFill=key=>({
  cloth:N.shirt,clothLight:N.shirtLight,pants:N.pants,pantsLight:N.pantsLight
}[key]);
function joined(ctx,a,b,c,widths,fills,costume,regions,side){
  ctx.lineCap='round';
  const p=costume?.palette;
  for(const[s,e,w]of[[a,b,widths[0]],[b,c,widths[1]]]){
    ctx.strokeStyle=p?.outline??N.outline;
    ctx.lineWidth=w+3;
    ctx.beginPath();
    ctx.moveTo(s.x,s.y);
    ctx.lineTo(e.x,e.y);
    ctx.stroke();
  }
  for(const[s,e,w,fill,region]of[[a,b,widths[0],fills[0],regions[0]],[b,c,widths[1],fills[1],regions[1]]]){
    ctx.strokeStyle=p?.[fill]??neutralFill(fill);
    ctx.lineWidth=w;
    ctx.beginPath();
    ctx.moveTo(s.x,s.y);
    ctx.lineTo(e.x,e.y);
    ctx.stroke();
    if(!costume){
      ctx.globalAlpha=.22;
      ctx.strokeStyle='#fff';
      ctx.lineWidth=Math.max(1,w*.13);
      ctx.beginPath();
      ctx.moveTo(s.x-1,s.y);
      ctx.lineTo(e.x-1,e.y);
      ctx.stroke();
      ctx.globalAlpha=1;
    }
    else{
      const dx=e.x-s.x,dy=e.y-s.y,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len,map={
        view:costume.__view,side,angle:Math.atan2(dy,dx),point:(t,r)=>({
          x:s.x+ux*(t*len)-uy*(r*w/2),y:s.y+uy*(t*len)+ux*(r*w/2)
        })
      }
      ;
      const overlay=createCanvas(ctx.canvas.width,ctx.canvas.height),o=overlay.getContext('2d');
      surface(o,costume,region,map,{
        radiusX:len,radiusY:w/2,widthScale:1
      });
      o.globalCompositeOperation='destination-in';
      o.strokeStyle='#fff';
      o.lineWidth=w;
      o.lineCap='round';
      o.beginPath();
      o.moveTo(s.x,s.y);
      o.lineTo(e.x,e.y);
      o.stroke();
      ctx.drawImage(overlay,0,0);
    }
  }
}
function hand(ctx,j,costume,side){
  const p=costume?.palette;
  ctx.fillStyle=p?.outline??N.outline;
  ctx.beginPath();
  ctx.ellipse(j.palm.x,j.palm.y,6,8,0,0,Math.PI*2);
  ctx.fill();
  ctx.fillStyle=p?.skin??N.skin;
  ctx.beginPath();
  ctx.ellipse(j.palm.x,j.palm.y,4.6,6.5,0,0,Math.PI*2);
  ctx.fill();
  if(j.thumbVisibility==='visible'){
    ctx.strokeStyle=p?.outline??N.outline;
    ctx.lineWidth=4;
    ctx.lineCap='round';
    ctx.beginPath();
    ctx.moveTo(j.palm.x,j.palm.y-1);
    ctx.lineTo(j.thumbTip.x,j.thumbTip.y);
    ctx.stroke();
    ctx.strokeStyle=p?.skinLight??N.skinLight;
    ctx.lineWidth=2.5;
    ctx.stroke();
  }
  if(costume){
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(j.palm.x,j.palm.y,4.6,6.5,0,0,Math.PI*2);
    ctx.clip();
    surface(ctx,costume,'hand',{
      view:costume.__view,side,point:(x,y)=>({
        x:j.palm.x+x*4.6,y:j.palm.y+y*6.5
      })
    },{
      radiusX:4.6,radiusY:6.5
    });
    ctx.restore();
  }
}
function foot(ctx,j,view,costume,masterVariant,side){
  const p=costume?.palette,{
    heel,toe,ankle
  }
  =j,dx=toe.x-heel.x,dy=toe.y-heel.y,len=Math.hypot(dx,dy);
  if(view==='south'||view==='north'){
    const angle=Math.atan2(dy,dx),center=midpoint(heel,toe);
    ctx.fillStyle=p?.outline??N.outline;
    ctx.beginPath();
    ctx.ellipse(center.x,center.y-4,Math.max(10,len*.63),7,angle,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle=p?.shoe??N.shoe;
    ctx.beginPath();
    ctx.ellipse(center.x,center.y-5,Math.max(9,len*.58),5.5,angle,0,Math.PI*2);
    ctx.fill();
    if(costume){
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(center.x,center.y-5,Math.max(9,len*.58),5.5,angle,0,Math.PI*2);
      ctx.clip();
      surface(ctx,costume,'foot',{
        view,side,angle,point:(u,v)=>({
          x:heel.x+dx*u-dy/len*(v*7),y:heel.y+dy*u+dx/len*(v*7)-5
        })
      },{
        radiusX:len,radiusY:7
      });
      ctx.restore();
    }
    ctx.strokeStyle=p?.sole??N.sole;
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(heel.x,heel.y);
    ctx.lineTo(toe.x,toe.y);
    ctx.stroke();
    return;
  }
  const sign=Math.sign(dx||(masterVariant?1:0));
  ctx.fillStyle=p?.outline??N.outline;
  ctx.beginPath();
  ctx.moveTo(heel.x+(masterVariant?-1:0),heel.y+2);
  ctx.lineTo(toe.x+sign*2,toe.y+1);
  ctx.lineTo(toe.x,toe.y-7);
  ctx.lineTo(ankle.x,ankle.y);
  ctx.lineTo(heel.x,heel.y-8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle=p?.shoe??N.shoe;
  ctx.beginPath();
  ctx.moveTo(heel.x,heel.y);
  ctx.lineTo(toe.x,toe.y-1);
  ctx.lineTo(toe.x,toe.y-6);
  ctx.lineTo(ankle.x,ankle.y+1);
  ctx.lineTo(heel.x+(masterVariant?1:sign),heel.y-7);
  ctx.closePath();
  ctx.fill();
  if(costume){
    ctx.save();
    ctx.clip();
    surface(ctx,costume,'foot',{
      view,side,angle:Math.atan2(dy,dx),point:(u,v)=>({
        x:heel.x+dx*u,y:heel.y-7+v*7
      })
    },{
      radiusX:len,radiusY:7
    });
    ctx.restore();
  }
  ctx.strokeStyle=p?.sole??N.sole;
  ctx.lineWidth=3;
  ctx.beginPath();
  ctx.moveTo(heel.x,heel.y+1);
  ctx.lineTo(toe.x,toe.y);
  ctx.stroke();
}
function limb(ctx,j,kind,view,costume,{
  masterVariant=false,handOnly=false,side
}={
}){
  if(kind==='arm'){
    if(!handOnly){
      const start={
        x:j.shoulder.x+(j.elbow.x-j.shoulder.x)*.14,y:j.shoulder.y+(j.elbow.y-j.shoulder.y)*.14
      }
      ;
      joined(ctx,start,j.elbow,j.wrist,[17,16],['clothLight','cloth'],costume,['upperArm','forearm'],side);
    }
    hand(ctx,j,costume,side);
  }
  else{
    joined(ctx,j.hip,j.knee,j.ankle,[24,21],['pantsLight','pants'],costume,['thigh','shin'],side);
    foot(ctx,j,view,costume,masterVariant,side);
  }
}
function torsoPath(ctx,g){
  const shoulderY=(g.joints.left.shoulder.y+g.joints.right.shoulder.y)/2,lateral=g.view==='east'||g.view==='west',s=lateral?MASTER.shapes.torso.side:MASTER.shapes.torso.front,cx=g.hipCenter.x;
  ctx.beginPath();
  ctx.moveTo(cx-10,shoulderY-2);
  ctx.quadraticCurveTo(cx-18,shoulderY-11,cx-s.shoulderHalfWidth+8,shoulderY-11);
  ctx.quadraticCurveTo(cx-s.shoulderHalfWidth,shoulderY-10,cx-s.chestHalfWidth,shoulderY+20);
  ctx.lineTo(cx-s.chestHalfWidth,shoulderY+42);
  ctx.quadraticCurveTo(cx-s.hipHalfWidth,g.hipCenter.y-4,cx-s.hipHalfWidth,g.hipCenter.y+2);
  ctx.quadraticCurveTo(cx,g.hipCenter.y+8,cx+s.hipHalfWidth,g.hipCenter.y+2);
  ctx.quadraticCurveTo(cx+s.hipHalfWidth,g.hipCenter.y-4,cx+s.chestHalfWidth,shoulderY+42);
  ctx.lineTo(cx+s.chestHalfWidth,shoulderY+20);
  ctx.quadraticCurveTo(cx+s.shoulderHalfWidth,shoulderY-10,cx+s.shoulderHalfWidth-8,shoulderY-11);
  ctx.quadraticCurveTo(cx+18,shoulderY-11,cx+10,shoulderY-2);
  ctx.closePath();
}
function body(ctx,g,costume,{
  masterVariant=false,trace
}={
}){
  attachments(ctx,g,costume,'torso-back',trace);
  const p=costume?.palette,shoulderY=(g.joints.left.shoulder.y+g.joints.right.shoulder.y)/2,cx=g.hipCenter.x,facing=g.view==='east'?1:g.view==='west'?-1:0,headX=cx-facing*3,headY=shoulderY-52,lateral=g.view==='east'||g.view==='west',s=lateral?MASTER.shapes.torso.side:MASTER.shapes.torso.front;
  ctx.fillStyle=p?.outline??N.outline;
  torsoPath(ctx,g);
  ctx.fill();
  ctx.save();
  torsoPath(ctx,g);
  ctx.clip();
  if(costume){
    ctx.fillStyle=p.cloth;
    ctx.fillRect(cx-50,shoulderY-8,100,g.hipCenter.y-shoulderY+18);
    surface(ctx,costume,'torso',{
      view:g.view,point:(u,v)=>({
        x:cx+u*s.chestHalfWidth,y:shoulderY-2+v*(g.hipCenter.y-shoulderY+10)
      }),rasterPoint:(u,v)=>({
        x:cx+u*s.chestHalfWidth,y:shoulderY-11+v*(g.hipCenter.y-shoulderY+19)
      })
    },{
      radiusX:s.chestHalfWidth,radiusY:g.hipCenter.y-shoulderY+10
    });
  }
  else{
    const grad=ctx.createLinearGradient(cx-44,0,cx+44,0);
    grad.addColorStop(0,'#58737d');
    grad.addColorStop(.5,N.shirtLight);
    grad.addColorStop(1,'#55707a');
    ctx.fillStyle=grad;
    ctx.fillRect(cx-50,shoulderY-8,100,g.hipCenter.y-shoulderY+18);
  }
  ctx.restore();
  if(!costume&&masterVariant){
    ctx.strokeStyle='rgba(255,255,255,.28)';
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(cx,shoulderY+8);
    ctx.lineTo(cx,g.hipCenter.y+2);
    ctx.stroke();
  }
  attachments(ctx,g,costume,'head-back',trace);
  ctx.fillStyle=p?.outline??N.outline;
  ctx.fillRect(headX-11,shoulderY-16,22,23);
  ctx.fillStyle=p?.skin??N.skin;
  ctx.fillRect(headX-9,shoulderY-17,18,24);
  if(costume?.surfaces.neck){
    ctx.save();
    ctx.beginPath();
    ctx.rect(headX-9,shoulderY-17,18,24);
    ctx.clip();
    surface(ctx,costume,'neck',{
      view:g.view,point:(x,y)=>({x:headX+x*9,y:shoulderY-5+y*12})
    },{radiusX:9,radiusY:12});
    ctx.restore();
  }
  ctx.fillStyle=p?.outline??N.outline;
  ctx.beginPath();
  ctx.ellipse(headX,headY,40,45,0,0,Math.PI*2);
  ctx.fill();
  ctx.fillStyle=p?.skin??N.skin;
  ctx.beginPath();
  ctx.ellipse(headX,headY,38,43,0,0,Math.PI*2);
  ctx.fill();
  if(!costume&&masterVariant){
    const shade=ctx.createRadialGradient(headX-10,headY-18,2,headX,headY,45);
    shade.addColorStop(0,'rgba(255,255,255,.22)');
    shade.addColorStop(1,'rgba(130,86,55,.08)');
    ctx.fillStyle=shade;
    ctx.beginPath();
    ctx.ellipse(headX,headY,37,42,0,0,Math.PI*2);
    ctx.fill();
  }
  if(costume){
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(headX,headY,38,43,0,0,Math.PI*2);
    ctx.clip();
    surface(ctx,costume,'head',{
      view:g.view,point:(x,y)=>({
        x:headX+x*38*(facing||1),y:headY+y*43
      }),rasterPoint:(x,y)=>({
        x:headX+x*38,y:headY+y*43
      })
    },{
      radiusX:38,radiusY:43
    });
    ctx.restore();
  }
  else{
    ctx.strokeStyle=N.outline;
    ctx.lineWidth=2;
    if(g.view==='south'){
      for(const dx of[-13,13]){
        ctx.beginPath();
        ctx.arc(headX+dx,headY+2,4,0,Math.PI*2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(headX-9,headY+19);
      ctx.quadraticCurveTo(headX,headY+24,headX+9,headY+19);
      ctx.stroke();
    }
    else if(facing){
      ctx.beginPath();
      ctx.arc(headX+facing*15,headY+3,4,0,Math.PI*2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(headX+facing*34,headY+6);
      ctx.lineTo(headX+facing*42,headY+10);
      ctx.lineTo(headX+facing*34,headY+13);
      ctx.stroke();
    }
  }
  attachments(ctx,g,costume,'head-front',trace);
}
function chair(ctx,g,frame,masterVariant){
  const y=g.hipCenter.y+2;
  if(!masterVariant&&(g.view==='east'||g.view==='west')){
    const facing=g.view==='east'?1:-1;
    ctx.fillStyle=N.chair;
    ctx.fillRect(g.hipCenter.x-facing*32,y-70,7,72);
    ctx.fillRect(g.hipCenter.x-facing*34,y,72*facing,8);
    ctx.fillRect(g.hipCenter.x+facing*30,y+7,7,frame.floorY-y-7);
    ctx.fillRect(g.hipCenter.x-facing*27,y+7,7,frame.floorY-y-7);
  }
  else{
    ctx.fillStyle=masterVariant?'#88949a':N.chair;
    ctx.fillRect(masterVariant?70:g.hipCenter.x-42,y,84,8);
    ctx.fillStyle=masterVariant?'#68777e':N.chair;
    ctx.fillRect(masterVariant?76:g.hipCenter.x-36,y+7,7,frame.floorY-y-7);
    ctx.fillRect(masterVariant?141:g.hipCenter.x+29,y+7,7,frame.floorY-y-7);
  }
}
function polygon(ctx,points){
  ctx.beginPath();
  ctx.moveTo(points[0].x,points[0].y);
  for(const point of points.slice(1))ctx.lineTo(point.x,point.y);
  ctx.closePath();
}
function clipboard(ctx,g){
  const b=g.clipboard,points=[b.corners.topLeft,b.corners.topRight,b.corners.bottomRight,b.corners.bottomLeft],center={
    x:points.reduce((sum,p)=>sum+p.x,0)/4,y:points.reduce((sum,p)=>sum+p.y,0)/4
  }
  ,paper=points.map(p=>({
    x:p.x+(center.x-p.x)*.10,y:p.y+(center.y-p.y)*.12
  }));
  ctx.fillStyle=N.board;
  ctx.strokeStyle=N.outline;
  ctx.lineWidth=4;
  ctx.lineJoin='round';
  polygon(ctx,points);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle=N.paper;
  polygon(ctx,paper);
  ctx.fill();
  const top={
    x:(points[0].x+points[1].x)/2,y:(points[0].y+points[1].y)/2
  }
  ;
  ctx.strokeStyle=N.outline;
  ctx.lineWidth=6;
  ctx.beginPath();
  ctx.moveTo(top.x-6,top.y+2);
  ctx.lineTo(top.x+6,top.y+2);
  ctx.stroke();
}
function prepare(costume,view){
  if(!costume)return null;
  assertCostume(costume);
  return Object.assign(Object.create(costume),{
    __view:view
  });
}
export function renderSurfaceMaster(g,costume,{
  trace
}={
}){
  const fitted=prepare(costume,g.view),canvas=createCanvas(MASTER.frame.width,MASTER.frame.height),ctx=canvas.getContext('2d');
  if(g.phaseId==='sit')chair(ctx,g,MASTER.frame,true);
  attachments(ctx,g,fitted,'body-back',trace);
  const near=g.view==='east'?'right':g.view==='west'?'left':'right',far=near==='right'?'left':'right';
  if(g.view==='south'||g.view==='north'){
    if(g.phaseId!=='sit')for(const side of['left','right'])limb(ctx,g.joints[side],'arm',g.view,fitted,{
      masterVariant:true,side
    });
    for(const side of['left','right'])limb(ctx,g.joints[side],'leg',g.view,fitted,{
      masterVariant:true,side
    });
  }
  else{
    limb(ctx,g.joints[far],'arm',g.view,fitted,{
      masterVariant:true,side:far
    });
    limb(ctx,g.joints[far],'leg',g.view,fitted,{
      masterVariant:true,side:far
    });
    limb(ctx,g.joints[near],'leg',g.view,fitted,{
      masterVariant:true,side:near
    });
  }
  body(ctx,g,fitted,{
    masterVariant:true,trace
  });
  if(g.view==='east'||g.view==='west')limb(ctx,g.joints[near],'arm',g.view,fitted,{
    masterVariant:true,side:near
  });
  if(g.phaseId==='sit')for(const side of['left','right'])limb(ctx,g.joints[side],'arm',g.view,fitted,{
    masterVariant:true,side
  });
  attachments(ctx,g,fitted,'body-front',trace);
  return canvas;
}
export function renderSurfaceAction(g,costume,{
  trace
}={
}){
  const fitted=prepare(costume,g.view),canvas=createCanvas(ACTION.frame.width,ACTION.frame.height),ctx=canvas.getContext('2d'),near=g.view==='east'?'right':g.view==='west'?'left':'right',far=near==='right'?'left':'right',frontal=g.view==='south'||g.view==='north';
  if(g.action==='sit')chair(ctx,g,ACTION.frame,false);
  attachments(ctx,g,fitted,'body-back',trace);
  if(g.action==='clipboard'){
    if(g.view==='north'){
      limb(ctx,g.joints.right,'arm',g.view,fitted,{side:'right'});
      clipboard(ctx,g);
      limb(ctx,g.joints.left,'arm',g.view,fitted,{side:'left'});
      for(const side of['left','right'])limb(ctx,g.joints[side],'leg',g.view,fitted,{side});
      body(ctx,g,fitted,{
        trace
      });
    }
    else{
      if(frontal)for(const side of['left','right'])limb(ctx,g.joints[side],'leg',g.view,fitted,{side});
      else{
        limb(ctx,g.joints[far],'leg',g.view,fitted,{side:far});
        limb(ctx,g.joints[near],'leg',g.view,fitted,{side:near});
      }
      body(ctx,g,fitted,{
        trace
      });
      limb(ctx,g.joints.right,'arm',g.view,fitted,{side:'right'});
      clipboard(ctx,g);
      limb(ctx,g.joints.left,'arm',g.view,fitted,{side:'left'});
    }
    attachments(ctx,g,fitted,'body-front',trace);
    return canvas;
  }
  if(frontal){
    if(g.action!=='sit')for(const side of['left','right'])limb(ctx,g.joints[side],'arm',g.view,fitted,{side});
    if(g.action==='sit'&&g.view==='north')for(const side of['left','right'])limb(ctx,g.joints[side],'arm',g.view,fitted,{side});
    for(const side of['left','right'])limb(ctx,g.joints[side],'leg',g.view,fitted,{side});
  }
  else{
    limb(ctx,g.joints[far],'arm',g.view,fitted,{side:far});
    limb(ctx,g.joints[far],'leg',g.view,fitted,{side:far});
    limb(ctx,g.joints[near],'leg',g.view,fitted,{side:near});
  }
  body(ctx,g,fitted,{
    trace
  });
  if(g.action==='sit'){
    if(g.view==='south')for(const side of['left','right'])limb(ctx,g.joints[side],'arm',g.view,fitted,{side});
    else if(!frontal)limb(ctx,g.joints[near],'arm',g.view,fitted,{side:near});
  }
  else if(!frontal)limb(ctx,g.joints[near],'arm',g.view,fitted,{side:near});
  attachments(ctx,g,fitted,'body-front',trace);
  return canvas;
}
