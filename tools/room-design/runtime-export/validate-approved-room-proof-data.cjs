const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../../..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'apps/player/src/facility/approvedRoomProofData.json'), 'utf8'));
const provenance = JSON.parse(fs.readFileSync(path.join(root, 'apps/player/public/art/rooms/gs015-v1/provenance.json'), 'utf8'));
const hashes = new Set(provenance.records.map(record => record.sha256));

if (data.approvalStatus !== 'owner-approved-for-runtime' || data.approvalDate !== '2026-09-24') throw new Error('Proof data approval metadata is stale');
if (Object.keys(data.rooms).length !== 16) throw new Error(`Expected 16 rooms, found ${Object.keys(data.rooms).length}`);
for (const [id, room] of Object.entries(data.rooms)) {
  const bytes = fs.readFileSync(path.join(root, room.proofPath));
  const currentHash = crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
  if (currentHash !== room.proofSha256) throw new Error(`${id} proof hash drifted`);
  for (const capture of room.orientations) {
    if (!capture.coordinateSpace || capture.coordinateSpace.tilePixels <= 0) throw new Error(`${id}:${capture.state} lacks its floor coordinate space`);
    for (const draw of capture.drawImages) {
      if (!draw.src.assetId || !hashes.has(draw.src.sha256)) throw new Error(`${id}:${capture.state} has an unprovenanced draw source`);
      if (draw.transform.length !== 6 || !draw.transform.every(Number.isFinite)) throw new Error(`${id}:${capture.state} has an invalid canvas transform`);
    }
  }
}
for (const capture of data.rooms.endoscopy.orientations) {
  if (capture.variants?.occupiedCovered?.dataset?.model?.tableState !== 'occupiedCovered') throw new Error(`Endoscopy ${capture.state} occupied variant is missing`);
  const empty = JSON.stringify(capture.drawImages.map(draw => draw.args.slice(0, 4)));
  const occupied = JSON.stringify(capture.variants.occupiedCovered.drawImages.map(draw => draw.args.slice(0, 4)));
  if (empty === occupied) throw new Error(`Endoscopy ${capture.state} occupied crop equals empty crop`);
}
const front = data.rooms.frontDesk.orientations[0];
if (!front.variants?.emptyWater || !front.variants?.visitorEdHidden) throw new Error('Front Desk state variants are missing');
if (front.variants.visitorEdHidden.drawImages.length !== front.drawImages.length - 1) throw new Error('Front Desk ED hidden-chair variant did not remove one draw');
console.log(`PASS ${Object.keys(data.rooms).length} proof hashes, coordinate spaces, transforms, and approved state variants`);
