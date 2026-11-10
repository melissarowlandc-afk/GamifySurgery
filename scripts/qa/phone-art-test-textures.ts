import { phoneArtSource, installPhoneArtSource } from "../../apps/player/src/mobile/performance/phoneArt";
/** Phaser CanvasTexture accounting without browser decode/raster. Pixel readback
 * arrays are real; decoded/canvas backing memory is a separate nominal ledger. */
export function textureLedger(assets:any[]){
 const rows=new Map<string,any>();
 function add(key:string,width:number,height:number,canvas=false, provided?:any){
  if(rows.has(key))return rows.get(key);
  const source=provided??{width,height},frames=new Map<string,any>();
  const context:any=provided?.getContext?.("2d")??{drawImage(){},clearRect(){},fillRect(){},createRadialGradient(){return{addColorStop(){}}},
   getImageData(_x:number,_y:number,w:number,h:number){return {width:w,height:h,data:new Uint8ClampedArray(w*h*4)}},putImageData(){}};
  const value:any={key,context,source:[{width,height,image:source,update(){}}],width,height,
   imageData:null,data:null,pixels:null,buffer:null,setFilter(){return this},getSourceImage(){return source},getContext(){return context},
   has:(id:string)=>frames.has(id),add(id:string,_source:number,x:number,y:number,w:number,h:number){const f={name:id,cutX:x,cutY:y,cutWidth:w,cutHeight:h,width:w,height:h,realWidth:w,realHeight:h};frames.set(id,f);return f},
   get(id='__BASE'){return frames.get(id)??frames.get('__BASE')},getData:(...args:number[])=>context.getImageData(...args),putData(){},refresh(){return this},
   update(){this.imageData=context.getImageData(0,0,width,height);this.data=this.imageData.data;this.buffer=this.data.buffer;this.pixels=new Uint32Array(this.buffer);return this}};
  value.add('__BASE',0,0,0,width,height);if(canvas)value.update();rows.set(key,value);return value;
 }
 for(const a of assets){const source=process.env.MAP_MEMORY_PHASE==="after"?phoneArtSource(a):undefined;const t=add(`stitchin-time-art:${a.id}`,source?.width??a.nativeWidth,source?.height??a.nativeHeight);if(source)installPhoneArtSource(t,source);}
 const manager:any={exists:(key:string)=>rows.has(key),get:(key:string)=>rows.get(key),createCanvas:(key:string,w:number,h:number)=>add(key,w,h,true),
  addImage:(key:string,image:any)=>add(key,image.width,image.height,false,image),remove:(key:string)=>rows.delete(key),getTextureKeys:()=>[...rows.keys()]};
 return {manager,rows,stats(){return {textures:rows.size,nominalRgbaBytes:[...rows.values()].reduce((n,t)=>n+t.width*t.height*4,0),
  readbackBytes:[...rows.values()].reduce((n,t)=>n+(t.data?.byteLength??0),0),createdCanvases:[...rows.values()].filter(t=>t.imageData||typeof t.getSourceImage().getContext==="function").map(t=>({key:t.key,width:t.width,height:t.height,bytes:t.data?.byteLength??0}))}}};
}
