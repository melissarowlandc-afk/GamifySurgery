import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import { ACTION, buildClipboardGeometry, buildJumpGeometry, buildSeatedGeometry } from './action-geometry.mjs';
import { renderAction, renderGuide } from './render-actions.mjs';

const root = resolve(import.meta.dirname, '../../..'), out = resolve(root, 'artifacts/character-movement/canonical-actions/checkpoint');
mkdirSync(out, { recursive: true });
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex'), records = { static: {}, southJump: {} }, review = [];
function save(name, geometry) {
  const clean = renderAction(geometry).toBuffer('image/png'), guide = renderGuide(geometry).toBuffer('image/png');
  writeFileSync(resolve(out, `${name}.png`), clean); writeFileSync(resolve(out, `${name}-guide.png`), guide);
  const record = { clean:`${name}.png`, guide:`${name}-guide.png`, sha256:{clean:sha256(clean),guide:sha256(guide)}, geometry };
  review.push({ label:name, image:renderAction(geometry) }); return record;
}
for (const view of ACTION.directions) records.static[`sit${view[0].toUpperCase()}${view.slice(1)}`] = save(`sit-${view}`, buildSeatedGeometry(view));
for (const view of ACTION.directions) records.static[`clipboard${view[0].toUpperCase()}${view.slice(1)}`] = save(`clipboard-${view}`, buildClipboardGeometry(view));
const jumps = buildJumpGeometry();
for (const phaseId of ACTION.phaseIds) records.southJump[phaseId] = save(`jump-south-${phaseId}`, jumps.south[phaseId]);
const sheet = createCanvas(1120, 1496), context = sheet.getContext('2d'); context.fillStyle='#eeeae2';context.fillRect(0,0,sheet.width,sheet.height);context.font='bold 14px sans-serif';context.textBaseline='middle';
for (const [index,item] of review.entries()) { const column=index%4,row=Math.floor(index/4),x=column*280,y=row*374;context.fillStyle='#20262b';context.fillRect(x,y,280,24);context.fillStyle='#fff';context.fillText(item.label,x+7,y+12);context.drawImage(item.image,x,y+24); }
const sheetBytes=sheet.toBuffer('image/png');writeFileSync(resolve(out,'canonical-actions-static-south-jump.png'),sheetBytes);
const clipSheet=createCanvas(1120,374),clipContext=clipSheet.getContext('2d');clipContext.fillStyle='#eeeae2';clipContext.fillRect(0,0,clipSheet.width,clipSheet.height);clipContext.font='bold 14px sans-serif';clipContext.textBaseline='middle';
for(const [column,view]of ACTION.directions.entries()){const key=`clipboard${view[0].toUpperCase()}${view.slice(1)}`,record=records.static[key],image=renderAction(record.geometry),x=column*280;clipContext.fillStyle='#20262b';clipContext.fillRect(x,0,280,24);clipContext.fillStyle='#fff';clipContext.fillText(`clipboard · ${view}`,x+7,12);clipContext.drawImage(image,x,24);}const clipBytes=clipSheet.toBuffer('image/png');writeFileSync(resolve(out,'canonical-clipboard-four-view.png'),clipBytes);
const oldManifest=readFileSync(resolve(root,'artifacts/character-movement/canonical-master/preview/manifest.json'));
const manifest={schemaVersion:1,status:'canonical-actions-checkpoint-awaiting-owner-review',frame:ACTION.frame,phaseIds:ACTION.phaseIds,jumpStages:ACTION.jumpStages,records,oldMasterManifestSha256:sha256(oldManifest),reviewSheet:{clean:'canonical-actions-static-south-jump.png',sha256:sha256(sheetBytes)},clipboardReview:{clean:'canonical-clipboard-four-view.png',sha256:sha256(clipBytes)}};
writeFileSync(resolve(out,'checkpoint-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({frame:ACTION.frame,review:resolve(out,manifest.reviewSheet.clean),manifest:resolve(out,'checkpoint-manifest.json'),oldMasterManifestSha256:manifest.oldMasterManifestSha256},null,2));
