// Game room-lab shell model: one tile per wall section, three on each wall.
// Floor/room size and approved palette remain 3x3 and unchanged.
function paintCaps(g,P,proposed){
 const{room,doors,backed}=P,s=room.shell,[W,H]=room.footprint,pal=wallPalette(room,proposed),unit=s.tilePixels,span=unit,cap=s.sideCapWidthPixels,low=s.southHeightPixels,rear=s.rearWallHeightPixels,inset=s.doorInsetPixels;
 g.save();g.translate(P.ox,P.oy);g.scale(120/unit,120/unit);
 for(let o=0;o<W;o++){
  const left=o*span,isBacked=backed.has(segId('N',o)),height=isBacked?low:rear,top=-height;
  const run=(x,w)=>{if(w<=0)return;if(proposed&&!isBacked)paintProposedWall(g,x,top,w,height,0,pal);else{fillRect(g,x,top,w,height,isBacked?pal.trim:pal.wall);if(!isBacked){fillRect(g,x,-23,w,23,pal.trim);fillRect(g,x,-23,w,4,LIGHT);}else fillRect(g,x,top,w,4,LIGHT);}fillRect(g,x,-7,w,7,pal.dark);};
  if(doors.has(segId('N',o))){run(left,inset);run(left+span-inset,inset);fillRect(g,left+inset-5,top,5,height,pal.wood);fillRect(g,left+span-inset,top,5,height,pal.wood);if(!isBacked)fillRect(g,left+inset-5,top-5,span-inset*2+10,6,pal.wood);}else run(left,span);
  if(!isBacked){fillRect(g,left-1,-rear-9,span+2,9,pal.dark);fillRect(g,left-1,-rear-9,span+2,3,LIGHT);}
 }
 const sideSpan=unit;
 for(const side of ['W','E']){
  const x=side==='W'?-cap+2:W*unit-2,top=backed.has(segId('N',side==='W'?0:W-1))?-low:-rear-9;
  const paint=(y,h)=>{if(h<=0)return;fillRect(g,x,y,cap,h,pal.dark);fillRect(g,x+(side==='W'?cap-3:0),y,3,h,LIGHT);};let cursor=top;
  for(let o=0;o<H;o++){if(!doors.has(segId(side,o)))continue;const doorTop=o*sideSpan+inset,doorH=sideSpan-2*inset;paint(cursor,doorTop-cursor);fillRect(g,x-2,doorTop-3,cap+4,5,pal.wood);fillRect(g,x-2,doorTop+doorH-2,cap+4,5,pal.wood);cursor=doorTop+doorH;}paint(cursor,H*unit+low-cursor);
 }
 g.restore();paintSouth(g,P,proposed);
}
function paintSouth(g,P,proposed){
 const{room,doors}=P,s=room.shell,[W,H]=room.footprint,pal=wallPalette(room,proposed),unit=s.tilePixels,span=unit,low=s.southHeightPixels,inset=s.doorInsetPixels,south=H*unit;
 g.save();g.translate(P.ox,P.oy);g.scale(120/unit,120/unit);
 for(let o=0;o<W;o++){const left=o*span,paint=(x,w)=>{fillRect(g,x,south,w,low,CREAM);fillRect(g,x,south+low-8,w,8,pal.trim);fillRect(g,x,south-6,w,8,pal.dark);fillRect(g,x,south-6,w,3,LIGHT);};
  if(doors.has(segId('S',o))){paint(left,inset);paint(left+span-inset,inset);fillRect(g,left+inset-5,south-8,5,low+8,pal.wood);fillRect(g,left+span-inset,south-8,5,low+8,pal.wood);}else paint(left,span);
 }g.restore();
}
