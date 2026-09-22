import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..'), checkpoint = resolve(repo, 'artifacts/character-movement/reauthored-batch-02/checkpoint'), output = resolve(repo, 'artifacts/character-movement/reauthored-batch-02/review');
mkdirSync(output, { recursive: true });
for (const item of [
  { slug: 'cardigan', label: 'Cardigan', original: 'Photos for Codex 2/Patients or Staff or Other Characters/exec-0b03b9bb-45a8-4d1a-a785-7654d39c0478.png' },
  { slug: 'braid', label: 'Gray braid', original: 'Photos for Codex 2/Patients or Staff or Other Characters/exec-16c48adf-2478-4b2a-b0e3-9ce1f2bfc2cb.png' },
]) {
  const canvas = createCanvas(1200, 340), context = canvas.getContext('2d'); context.fillStyle = '#17191d'; context.fillRect(0,0,canvas.width,canvas.height); context.font = 'bold 15px sans-serif';
  const original = await loadImage(resolve(repo, item.original));
  const cells = [['Approved original S', null], ['South neutral','south'], ['East neutral','east'], ['North neutral','north'], ['West neutral','west']];
  for (const [index,[label,direction]] of cells.entries()) { const x=index*240; context.fillStyle='#f0eee8';context.fillRect(x,20,240,310); if(direction){ const image=await loadImage(resolve(checkpoint,`${item.slug}-${direction}-neutral.png`));context.drawImage(image,x,20); } else context.drawImage(original,50,20,240,310,x,20,240,310);context.fillStyle='#fff';context.fillText(`${item.label} · ${label}`,x+6,16); }
  const file=resolve(output,`${item.slug}-neutral-fit-review.png`);writeFileSync(file,canvas.toBuffer('image/png'));console.log(file);
}
