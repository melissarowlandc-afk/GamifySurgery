const fs = require('fs');
const path = require('path');

// Historical filename retained for the room-export workflow. This command is
// a source-parity validator: it never rewrites the checked-in typed contract.

const root = process.cwd();
const proofPath = path.join(root, 'apps/player/src/facility/approvedRoomProofData.json');
const contractPath = path.join(root, 'packages/balance-config/src/approved-room-layouts.ts');

function loadContract() {
  const source = fs.readFileSync(contractPath, 'utf8');
  const startMarker = '> = {';
  const start = source.indexOf(startMarker);
  const end = source.indexOf('\n};\n\nexport function', start);
  if (start < 0 || end < 0) throw new Error('Cannot locate the generated navigation contract literal.');
  const literal = source.slice(start + startMarker.length - 1, end + 2);
  return new Function(`return (${literal});`)();
}

function equal(left, right, label) {
  const stable = (value) => JSON.stringify(value, (_key, candidate) =>
    typeof candidate === 'number' ? Math.round(candidate * 1e9) / 1e9 : candidate);
  if (stable(left) !== stable(right)) {
    throw new Error(`${label} differs from the approved proof: ${JSON.stringify(left)} != ${JSON.stringify(right)}`);
  }
}

function tileCenters(rect, width, height) {
  const tiles = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const cx = x + 0.5;
      const cy = y + 0.5;
      if (
        cx >= rect.left && cx <= rect.left + rect.width &&
        cy >= rect.top && cy <= rect.top + rect.height
      ) tiles.push({ x, y });
    }
  }
  return tiles;
}

const proof = JSON.parse(fs.readFileSync(proofPath, 'utf8'));
const contract = loadContract();
if (Object.keys(proof.rooms).length !== 16 || Object.keys(contract).length !== 16) {
  throw new Error('The approved proof and shared navigation contract must both contain sixteen rooms.');
}

const examProof = proof.rooms.examination.orientations.find((view) => view.state === '0').dataset;
const exam = contract['room.examination'].solidFixtures.find((fixture) => fixture.id === 'examination-table');
equal(exam.footprint, examProof.table.footprint, 'Examination table footprint');
equal(exam.navigationFootprint, examProof.table.inflated, 'Examination table navigation footprint');
equal(exam.blockedTiles, tileCenters(examProof.table.inflated, 3, 2), 'Examination table integer mask');

const waitingProof = proof.rooms.waiting.orientations.find((view) => view.state === '0').dataset.fixtures.contracts;
const waitingNames = { bench: 'bench', leftChair: 'left-chair', rightChair: 'right-chair', table: 'table' };
for (const [proofId, contractId] of Object.entries(waitingNames)) {
  if (waitingProof[proofId].collision !== 'solid') throw new Error(`Waiting ${proofId} is no longer proof-solid.`);
  const fixture = contract['room.waiting'].solidFixtures.find((candidate) => candidate.id === contractId);
  equal(fixture.footprint, waitingProof[proofId].footprint, `Waiting ${proofId} footprint`);
}

const bathroomProof = proof.rooms.bathroom.orientations[0].dataset.fixtures;
for (const proofId of ['sink', 'toilet']) {
  const source = bathroomProof.find((fixture) => fixture.id === proofId);
  if (source.collision !== 'solid') throw new Error(`Bathroom ${proofId} is no longer proof-solid.`);
  const fixture = contract['room.bathroom'].solidFixtures.find((candidate) => candidate.id === proofId);
  equal(fixture.footprint, source.footprint, `Bathroom ${proofId} footprint`);
}

const explicitMasks = [
  ['room.minor_procedure', proof.rooms.minorProcedure.orientations[0].dataset.fixtures[0]],
  ['room.ultrasound', proof.rooms.ultrasound.orientations[0].dataset.fixtures[0]],
  ['room.xray', proof.rooms.xray.orientations[0].dataset.fixtures[0]],
  ['room.ct', proof.rooms.ct.orientations[0].dataset.model.fixtures.scanner],
  ['room.phlebotomy', proof.rooms.phlebotomy.orientations.find((view) => view.state === 'south').dataset.model.fixtures.chair],
  ['room.endoscopy', proof.rooms.endoscopy.orientations.find((view) => view.state === 'south').dataset.model.fixtures.procedureTable],
];
for (const [roomId, source] of explicitMasks) {
  if (source.collision !== 'solid' || !source.navigationBlocker) {
    throw new Error(`${roomId} lost its proof-declared solid navigation blocker.`);
  }
  const room = contract[roomId];
  const fixture = room.solidFixtures[0];
  equal(
    fixture.blockedTiles,
    tileCenters(source.navigationBlocker, room.width, room.height),
    `${roomId} integer mask`,
  );
}

equal(
  contract['room.front_desk'].solidFixtures.find((fixture) => fixture.id === 'visitor-chair').hiddenByDoorSlots,
  [{ side: 'east', offset: 3 }],
  'Front Desk ED visitor blocker owner',
);
const recoveryOwners = Object.fromEntries(
  contract['room.periop_recovery'].solidFixtures
    .filter((fixture) => fixture.hiddenByDoorSlots)
    .map((fixture) => [fixture.id, fixture.hiddenByDoorSlots]),
);
equal(recoveryOwners, {
  N3: [{ side: 'north', offset: 2 }], N4: [{ side: 'north', offset: 3 }],
  WC: [{ side: 'west', offset: 2 }], WD: [{ side: 'west', offset: 3 }],
  EC: [{ side: 'east', offset: 2 }], ED: [{ side: 'east', offset: 3 }],
  S3: [{ side: 'south', offset: 2 }], S4: [{ side: 'south', offset: 3 }],
}, 'Recovery bay door ownership');

const recoveryProof = proof.rooms.recovery.orientations[0].dataset.model;
for (const [bayId, bay] of Object.entries(recoveryProof.bays)) {
  const fixture = contract['room.periop_recovery'].solidFixtures.find((candidate) => candidate.id === bayId);
  equal(fixture.footprint, bay.footprint, `Recovery ${bayId} footprint`);
}
const recoveryStation = contract['room.periop_recovery'].solidFixtures.find((fixture) => fixture.id === 'station');
if (recoveryProof.station.collision !== 'solid') throw new Error('Recovery station is no longer proof-solid.');
equal(recoveryStation.footprint, recoveryProof.station.footprint, 'Recovery station footprint');
equal(contract['room.periop_recovery'].staffAnchor, { x: 3, y: 2 }, 'Recovery staff stool contact');
equal(contract['room.periop_recovery'].waitingAnchors, [{ x: 1, y: 2 }], 'Recovery preserved capacity contact');

const telehealthProof = proof.rooms.telehealth.orientations.find((view) => view.state === 'south').dataset.model;
const telehealthStation = contract['room.glp1_telehealth_suite'].solidFixtures.find((fixture) => fixture.id === 'station');
if (telehealthProof.fixtures.station.collision !== 'solid') throw new Error('Telehealth station is no longer proof-solid.');
equal(telehealthStation.footprint, telehealthProof.fixtures.station.footprint, 'Telehealth station footprint');
equal(contract['room.glp1_telehealth_suite'].patientCareAnchor, { x: 0, y: 1 }, 'Telehealth patient contact');
equal(contract['room.glp1_telehealth_suite'].clinicianCareAnchor, { x: 2, y: 1 }, 'Telehealth clinician contact');

const trainingProof = proof.rooms.training.orientations[0].dataset.model;
const trainingBench = contract['room.training'].solidFixtures.find((fixture) => fixture.id === 'training-bench');
if (trainingProof.bench.collision !== 'solid') throw new Error('Training bench is no longer proof-solid.');
equal(trainingBench.footprint, trainingProof.bench.footprint, 'Training bench footprint');
equal(trainingBench.endpointOnlyContacts, [{ x: 1, y: 1 }], 'Training bench terminal contact');

const coffeeProof = proof.rooms.coffee.orientations[0].dataset.model;
const coffeeIsland = contract['room.coffee_kiosk'].solidFixtures.find((fixture) => fixture.id === 'island');
if (coffeeProof.island.collision !== 'solid') throw new Error('Coffee island is no longer proof-solid.');
equal(coffeeIsland.footprint, coffeeProof.island.footprint, 'Coffee island footprint');
equal(coffeeIsland.endpointOnlyContacts, [{ x: 1, y: 1 }], 'Coffee service terminal contact');
equal(contract['room.coffee_kiosk'].doorThresholdExceptions, [
  { side: 'south', offset: 0 }, { side: 'south', offset: 1 },
  { side: 'west', offset: 1 }, { side: 'east', offset: 1 },
], 'Coffee proof-valid wall approaches around the central island');

const evsProof = proof.rooms.evs.orientations[0].dataset.model;
if (Object.values(evsProof.fixtures).some((fixture) => fixture.collision === 'solid')) {
  throw new Error('EVS now contains a proof-solid fixture missing from the domain contract.');
}
equal(contract['room.evs_closet'].solidFixtures, [], 'EVS nonblocking fixture contract');

equal(contract['room.examination'].doorThresholdExceptions, [
  { side: 'north', offset: 1 }, { side: 'north', offset: 2 },
  { side: 'south', offset: 1 }, { side: 'south', offset: 2 },
], 'Examination proof-valid sub-tile threshold approaches');
equal(contract['room.front_desk'].allowedDoorSlots.at(-1), { side: 'south', offset: 2 }, 'Front Desk fixed public entry');

const report = {
  schemaVersion: 1,
  source: path.relative(root, proofPath).replaceAll('\\', '/'),
  destination: path.relative(root, contractPath).replaceAll('\\', '/'),
  rooms: Object.keys(contract).length,
  mode: 'validate-only',
  rule: 'integer tile center inside proof navigation footprint; endpoint-only furniture contacts are never transit tiles',
};
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
