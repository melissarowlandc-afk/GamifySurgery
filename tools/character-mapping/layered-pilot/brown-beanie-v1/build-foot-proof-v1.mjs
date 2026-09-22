import { createCanvas, loadImage } from '@napi-rs/canvas';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
const repo=resolve(import.meta.dirname,'../../../..'),out=resolve(repo,'artifacts/character-movement/brown-beanie-v1/correction-review');
const [source,fit]=await Promise.all([
  loadImage(resolve(repo,'Photos for Codex 2/Patients or Staff or Other Characters/exec-092d31ac-7592-4634-8883-167ddac564df.png')),
  loadImage(resolve(repo,'artifacts/character-movement/brown-beanie-v1/frames/stand/south.png')),
]);
const canvas=createCanvas(1200,320),context=canvas.getContext('2d');context.imageSmoothingEnabled=false;
context.fillStyle='#ded8ce';context.fillRect(0,0,1200,320);
context.fillStyle='#20242a';context.fillRect(0,0,1200,22);
context.fillStyle='#fff';context.font='bold 14px sans-serif';
context.fillText('Exact source South soles 8x',8,16);context.fillText('Current fitted South soles 8x',600,16);
context.drawImage(source,50+50,20+278,110,32,0,22,600,290);
context.drawImage(fit,25,257,110,32,600,22,600,290);
writeFileSync(resolve(out,'south-source-vs-fit-feet.png'),canvas.toBuffer('image/png'));
