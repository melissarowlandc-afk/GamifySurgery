// Narrow lossless RGBA8 PNG codec for the manager-requested palette operation.
// Raw decoding avoids canvas premultiplication changing unrelated RGB/alpha.
import assert from 'node:assert/strict';
import {inflateSync,deflateSync} from 'node:zlib';
const signature=Buffer.from('89504e470d0a1a0a','hex');
const crcTable=Uint32Array.from({length:256},(_,n)=>{let c=n;for(let i=0;i<8;i++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
function crc(bytes){let c=0xffffffff;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
function paeth(a,b,c){const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;}
export function decodeRgbaPng(bytes){
  assert(bytes.subarray(0,8).equals(signature));const chunks=[];let offset=8;
  while(offset<bytes.length){const length=bytes.readUInt32BE(offset),end=offset+length+12;assert(end<=bytes.length);const type=bytes.toString('ascii',offset+4,offset+8),data=bytes.subarray(offset+8,offset+8+length);assert.equal(crc(bytes.subarray(offset+4,offset+8+length)),bytes.readUInt32BE(offset+8+length),'PNG CRC '+type);chunks.push({type,data,bytes:bytes.subarray(offset,end)});offset=end;}
  assert.equal(chunks[0].type,'IHDR');assert.equal(chunks.at(-1).type,'IEND');assert.equal(chunks.filter(c=>c.type==='IHDR').length,1);
  const header=chunks[0].data,width=header.readUInt32BE(0),height=header.readUInt32BE(4);assert.deepEqual([...header.subarray(8)],[8,6,0,0,0],'requires RGBA8, noninterlaced PNG');
  const stride=width*4,filtered=inflateSync(Buffer.concat(chunks.filter(c=>c.type==='IDAT').map(c=>c.data))),rgba=Buffer.alloc(stride*height);
  assert.equal(filtered.length,(stride+1)*height);
  for(let y=0;y<height;y++){const filter=filtered[y*(stride+1)];assert(filter<=4);for(let x=0;x<stride;x++){
    const i=y*stride+x,left=x>=4?rgba[i-4]:0,up=y?rgba[i-stride]:0,upperLeft=y&&x>=4?rgba[i-stride-4]:0;
    const predictor=[0,left,up,Math.floor((left+up)/2),paeth(left,up,upperLeft)][filter];rgba[i]=(filtered[y*(stride+1)+1+x]+predictor)&255;
  }}
  return {width,height,rgba,chunks};
}
function chunk(type,data){const name=Buffer.from(type),length=Buffer.alloc(4),checksum=Buffer.alloc(4);length.writeUInt32BE(data.length);checksum.writeUInt32BE(crc(Buffer.concat([name,data])));return Buffer.concat([length,name,data,checksum]);}
export function encodeRgbaPng(image){
  const {width,height,rgba,chunks}=image,stride=width*4,filtered=Buffer.alloc((stride+1)*height);assert.equal(rgba.length,stride*height);
  for(let y=0;y<height;y++)rgba.copy(filtered,y*(stride+1)+1,y*stride,(y+1)*stride);
  const encoded=chunk('IDAT',deflateSync(filtered,{level:9}));let inserted=false;
  return Buffer.concat([signature,...chunks.flatMap(c=>{if(c.type!=='IDAT')return [c.bytes];if(inserted)return [];inserted=true;return [encoded];})]);
}
