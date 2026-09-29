import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createCanvas, loadImage } from "@napi-rs/canvas";

export const DIRECTIONS = ["south", "east", "west", "north"];
export const SLOTS = [...DIRECTIONS.map(direction => ({ pose: "stand", direction })), ...DIRECTIONS.map(direction => ({ pose: "sit", direction }))];
export const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
export const fileSha = file => sha256(readFileSync(file));

export async function loadCanvas(file) {
  const image = await loadImage(file), canvas = createCanvas(image.width, image.height);
  canvas.getContext("2d").drawImage(image, 0, 0);
  return canvas;
}

export function measure(canvas, threshold = 13) {
  const data = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
  let left = canvas.width, top = canvas.height, right = -1, bottom = -1, pixels = 0, borderPixels = 0;
  for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
    if (data[(y * canvas.width + x) * 4 + 3] < threshold) continue;
    pixels++; left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
    if (!x || !y || x === canvas.width - 1 || y === canvas.height - 1) borderPixels++;
  }
  assert(right >= left, "transparent frame");
  return { visibleBounds: { x: left, y: top, width: right-left+1, height: bottom-top+1 }, alphaPixels: pixels, borderPixels };
}

function components(canvas, threshold = 13) {
  const { width, height } = canvas, imageData = canvas.getContext("2d").getImageData(0, 0, width, height), data = imageData.data;
  const seen = new Uint8Array(width * height), found = [];
  for (let seed = 0; seed < seen.length; seed++) {
    if (seen[seed] || data[seed*4+3] < threshold) continue;
    const stack=[seed]; seen[seed]=1; let area=0,left=width,top=height,right=-1,bottom=-1;
    while(stack.length){const at=stack.pop(),x=at%width,y=Math.floor(at/width); area++;left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);
      for(const next of [x?at-1:-1,x+1<width?at+1:-1,y?at-width:-1,y+1<height?at+width:-1]) if(next>=0&&!seen[next]&&data[next*4+3]>=threshold){seen[next]=1;stack.push(next);}}
    found.push({area,left,top,right,bottom,centerX:(left+right)/2,centerY:(top+bottom)/2});
  }
  return found.sort((a,b)=>b.area-a.area);
}

export function extractEight(sheet) {
  const all=components(sheet), major=all.slice(0,8);
  assert.equal(major.length,8,"source must contain eight alpha-separated whole figures");
  assert(major[7].area >= 800,`eighth figure too small (${major[7].area}px)`);
  const ninth=all[8];
  if(ninth && ninth.area > Math.max(96, major[7].area*0.02)) throw new Error(`ambiguous ninth detached component (${ninth.area}px)`);
  const byY=[...major].sort((a,b)=>a.centerY-b.centerY), rows=[byY.slice(0,4).sort((a,b)=>a.centerX-b.centerX),byY.slice(4).sort((a,b)=>a.centerX-b.centerX)];
  assert(Math.max(...rows[0].map(x=>x.bottom)) < Math.min(...rows[1].map(x=>x.top)),"figure rows overlap; reject rather than bisect feet");
  const rowCut=Math.floor((Math.max(...rows[0].map(x=>x.bottom))+Math.min(...rows[1].map(x=>x.top))+1)/2), result=[];
  for(let row=0;row<2;row++){
    const figures=rows[row], cuts=[0];
    for(let i=0;i<3;i++){assert(figures[i].right<figures[i+1].left,`row ${row} figures overlap`);cuts.push(Math.floor((figures[i].right+figures[i+1].left+1)/2));} cuts.push(sheet.width);
    for(let col=0;col<4;col++){
      const f=figures[col], x0=cuts[col], x1=cuts[col+1], y0=row?rowCut:0, y1=row?sheet.height:rowCut;
      assert(f.left>x0&&f.right<x1-1&&f.top>y0&&f.bottom<y1-1,`figure ${row},${col} touches derived crop boundary`);
      const canvas=createCanvas(x1-x0,y1-y0); canvas.getContext("2d").drawImage(sheet,x0,y0,x1-x0,y1-y0,0,0,x1-x0,y1-y0);
      const m=measure(canvas); assert(m.borderPixels<=8,`figure ${row},${col} has ${m.borderPixels} strong-alpha pixels on a derived crop boundary`);
      result.push({canvas,sourceRect:{x:x0,y:y0,width:x1-x0,height:y1-y0},principal:f,measure:m});
    }
  }
  return { cells:result, rowCut, componentCount:all.length, ignoredComponents:all.slice(8).map(({area,left,top,right,bottom})=>({area,left,top,right,bottom})) };
}

export function normalizeCells(cells,target) {
  const south=cells[0].measure.visibleBounds, scale=target.standingSouthVisibleHeight/south.height;
  for(const [i,cell] of cells.entries()){
    const b=cell.measure.visibleBounds;
    assert(b.width*scale<=target.width-4,`pose ${i} cannot fit width at shared scale`);
    assert(b.height*scale<=target.floorY,`pose ${i} cannot fit height at shared scale`);
  }
  return cells.map((cell,index)=>{
    const b=cell.measure.visibleBounds, canvas=createCanvas(target.width,target.height), context=canvas.getContext("2d");
    context.imageSmoothingEnabled=true; context.imageSmoothingQuality="high";
    const translateX=target.bodyAxisX-(b.x+b.width/2)*scale, translateY=target.floorY-(b.y+b.height)*scale;
    context.drawImage(cell.canvas,translateX,translateY,cell.canvas.width*scale,cell.canvas.height*scale);
    const outputMeasure=measure(canvas);
    assert.equal(outputMeasure.borderPixels,0,`normalized pose ${index} clips canvas`);
    return {canvas,measure:outputMeasure,transform:{scale,translateX,translateY,bodyAxisX:target.bodyAxisX,floorY:target.floorY,policy:"one identity-wide whole-body scale; no segmented edits, mirroring, cleanup, or repaint"}};
  });
}

export function inferSeatContact(frame) {
  const b=frame.measure.visibleBounds;
  return Math.min(286, b.y + b.height*0.68);
}
