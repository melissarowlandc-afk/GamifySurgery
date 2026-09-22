export const ATLAS_SCHEMA_VERSION = 'character-atlas/v1';
export const CELL_SIZE = 256;
export const SLOT_PADDING = 8;
export const DIRECTIONS = Object.freeze(['south', 'east', 'west', 'north']);
export const ANATOMICAL_SIDES = Object.freeze(['left', 'right']);

const page = (id, rows, columns = DIRECTIONS) => ({
  id, cellSize: CELL_SIZE, columns, rows,
  width: columns.length * CELL_SIZE, height: rows.length * CELL_SIZE,
});

export const PAGE_DEFINITIONS = Object.freeze({
  upper: page('upper', ['torso', 'upperArm.left', 'upperArm.right', 'forearmHand.left', 'forearmHand.right']),
  lower: page('lower', ['thigh.left', 'thigh.right', 'shin.left', 'shin.right', 'shoe.left', 'shoe.right']),
  identity: page('identity', ['head', 'backHair', 'frontHair']),
  actions: page('actions', ['seatedTorso', 'seatedLower', 'seatedArm.left', 'seatedArm.right']),
  clipboard: page('clipboard', ['clipboardArm'], ['left', 'right']),
});

const TYPE_LANDMARKS = Object.freeze({
  torso: ['neck.screenLeft','neck.screenRight','joint.shoulder.left','joint.shoulder.right','joint.hip.left','joint.hip.right'],
  upperArm: ['joint.shoulder','joint.elbow','orientation.outerElbow'],
  forearmHand: ['joint.elbow','joint.wrist','hand.end','orientation.thumbTip','orientation.anterior'],
  thigh: ['joint.hip','joint.knee','orientation.outer'],
  shin: ['joint.knee','joint.ankle','orientation.outer'],
  shoe: ['registration.baselineLeft','registration.baselineRight','joint.ankle','entry.rear','entry.front','heel.rear','toe.tip','sole.contact'],
  head: ['neck.screenLeft','neck.screenRight','coverage.crown','coverage.chin'],
  hair: ['registration.primary','registration.secondary'],
  seatedTorso: ['neck.screenLeft','neck.screenRight','joint.shoulder.left','joint.shoulder.right','seat.waist'],
  seatedLower: ['seat.waist','seat.contact','sole.left','sole.right'],
  seatedArm: ['joint.shoulder','joint.elbow','joint.wrist','hand.contact','orientation.thumbTip'],
  clipboardArm: ['joint.shoulder','joint.elbow','joint.wrist','hand.contact','orientation.thumbTip'],
});

function slotType(row) {
  if (row.startsWith('upperArm')) return 'upperArm';
  if (row.startsWith('forearmHand')) return 'forearmHand';
  if (row.startsWith('thigh')) return 'thigh';
  if (row.startsWith('shin')) return 'shin';
  if (row.startsWith('shoe')) return 'shoe';
  if (row === 'backHair' || row === 'frontHair') return 'hair';
  if (row.startsWith('seatedArm')) return 'seatedArm';
  return row;
}
function rowSide(row) { const match = /\.(left|right)$/.exec(row); return match?.[1] ?? null; }
function slotId(pageId, column, row) { return `${pageId}.${column}.${row}`; }

const slots = {};
for (const definition of Object.values(PAGE_DEFINITIONS)) {
  definition.rows.forEach((row, rowIndex) => definition.columns.forEach((column, columnIndex) => {
    const type = slotType(row), side = definition.id === 'clipboard' ? column : rowSide(row);
    const optional = type === 'hair' || definition.id === 'actions' || definition.id === 'clipboard';
    const id = slotId(definition.id, column, row);
    slots[id] = Object.freeze({ id, page: definition.id, column, row, columnIndex, rowIndex, type, anatomicalSide: side, direction: DIRECTIONS.includes(column) ? column : 'south', optional, requiredLandmarks: TYPE_LANDMARKS[type] });
  }));
}

export const SLOT_DEFINITIONS = Object.freeze(slots);
export const SLOT_IDS = Object.freeze(Object.keys(SLOT_DEFINITIONS));
export const REQUIRED_SLOT_IDS = Object.freeze(SLOT_IDS.filter(id => !SLOT_DEFINITIONS[id].optional));
export const OPTIONAL_SLOT_IDS = Object.freeze(SLOT_IDS.filter(id => SLOT_DEFINITIONS[id].optional));

// Canonical in-cell rest placement. Parts retain character-authored lengths via
// normalization.targetLength, but every attachment starts at the same predictable
// location and axis for its semantic type.
export const REST_PLACEMENT = Object.freeze({
  torso: Object.freeze({ anchor: Object.freeze({x:128,y:48}), anchorMode:'midpoint', axis: Object.freeze({x:1,y:0}), defaultLength:64, fitPadding:SLOT_PADDING, sourceStart:'neck.screenLeft', sourceEnd:'neck.screenRight' }),
  head: Object.freeze({ anchor: Object.freeze({x:128,y:196}), anchorMode:'midpoint', axis: Object.freeze({x:1,y:0}), defaultLength:64, fitPadding:SLOT_PADDING, sourceStart:'neck.screenLeft', sourceEnd:'neck.screenRight', exactPixels:true }),
  hair: Object.freeze({ anchor: Object.freeze({x:128,y:196}), anchorMode:'midpoint', axis: Object.freeze({x:1,y:0}), defaultLength:64, fitPadding:SLOT_PADDING, sourceStart:'registration.primary', sourceEnd:'registration.secondary', exactPixels:true }),
  upperArm: Object.freeze({ start: Object.freeze({x:128,y:56}), axis: Object.freeze({x:0,y:1}), defaultLength:112, fitPadding:SLOT_PADDING, sourceStart:'joint.shoulder', sourceEnd:'joint.elbow' }),
  forearmHand: Object.freeze({ start: Object.freeze({x:128,y:56}), axis: Object.freeze({x:0,y:1}), defaultLength:120, fitPadding:SLOT_PADDING, sourceStart:'joint.elbow', sourceEnd:'hand.end' }),
  thigh: Object.freeze({ start: Object.freeze({x:128,y:48}), axis: Object.freeze({x:0,y:1}), defaultLength:112, fitPadding:SLOT_PADDING, sourceStart:'joint.hip', sourceEnd:'joint.knee' }),
  shin: Object.freeze({ start: Object.freeze({x:128,y:48}), axis: Object.freeze({x:0,y:1}), defaultLength:120, fitPadding:SLOT_PADDING, sourceStart:'joint.knee', sourceEnd:'joint.ankle' }),
  shoe: Object.freeze({ anchor: Object.freeze({x:76,y:176}), anchorMode:'start', axis:Object.freeze({x:1,y:0}), defaultLength:104, fitPadding:SLOT_PADDING, sourceStart:'registration.baselineLeft', sourceEnd:'registration.baselineRight' }),
  seatedTorso: Object.freeze({ anchor: Object.freeze({x:128,y:48}), anchorMode:'midpoint', axis: Object.freeze({x:1,y:0}), defaultLength:64, fitPadding:SLOT_PADDING, sourceStart:'neck.screenLeft', sourceEnd:'neck.screenRight' }),
  seatedLower: Object.freeze({ start: Object.freeze({x:128,y:48}), axis: Object.freeze({x:0,y:1}), defaultLength:120, fitPadding:SLOT_PADDING, sourceStart:'seat.waist', sourceEnd:'seat.contact' }),
  seatedArm: Object.freeze({ start: Object.freeze({x:128,y:48}), axis: Object.freeze({x:0,y:1}), defaultLength:128, fitPadding:SLOT_PADDING, sourceStart:'joint.shoulder', sourceEnd:'hand.contact' }),
  clipboardArm: Object.freeze({ start: Object.freeze({x:128,y:48}), axis: Object.freeze({x:0,y:1}), defaultLength:128, fitPadding:SLOT_PADDING, sourceStart:'joint.shoulder', sourceEnd:'hand.contact' }),
});

export function restPlacementForSlot(slotOrId,targetLength){
  const slot=typeof slotOrId==='string'?SLOT_DEFINITIONS[slotOrId]:slotOrId,rest=REST_PLACEMENT[slot?.type];
  if(!slot||!rest)throw new Error(`No canonical rest placement for "${typeof slotOrId==='string'?slotOrId:slotOrId?.type}".`);
  const length=targetLength??rest.defaultLength,axis=rest.directionAxes?.[slot.direction]??rest.axis,anchor=rest.anchor??rest.start;
  const targetStart=rest.anchorMode==='midpoint'?{x:anchor.x-axis.x*length/2,y:anchor.y-axis.y*length/2}:{...anchor};
  return Object.freeze({targetStart:Object.freeze(targetStart),targetEnd:Object.freeze({x:targetStart.x+axis.x*length,y:targetStart.y+axis.y*length}),axis,length,fitPadding:rest.fitPadding});
}

export const ANATOMICAL_PROJECTION = Object.freeze({
  south: Object.freeze({ left: 'screen-right', right: 'screen-left', near: null, far: null }),
  north: Object.freeze({ left: 'screen-left', right: 'screen-right', near: null, far: null }),
  east: Object.freeze({ left: 'far', right: 'near', near: 'right', far: 'left' }),
  west: Object.freeze({ left: 'near', right: 'far', near: 'left', far: 'right' }),
});

export const LAYER_ORDER = Object.freeze({
  south: Object.freeze(['farLower','nearLower','backHair','upperArmsBack','torso','forearmsFront','cuffsFront','head','frontHair','prop']),
  north: Object.freeze(['farLower','nearLower','backHair','arms','torso','shoulderCaps','head','frontHair','prop']),
  east: Object.freeze(['farLower','nearLower','backHair','farArm','torso','nearArm','head','frontHair','prop']),
  west: Object.freeze(['farLower','nearLower','backHair','farArm','torso','nearArm','head','frontHair','prop']),
  seatedSouth: Object.freeze(['seatedLower','backHair','upperArmsBack','torso','forearmsFront','cuffsFront','head','frontHair','prop']),
  seatedNorth: Object.freeze(['seatedLower','backHair','arms','torso','head','frontHair','prop']),
  seatedEast: Object.freeze(['seatedLower','backHair','farArm','torso','nearArm','head','frontHair','prop']),
  seatedWest: Object.freeze(['seatedLower','backHair','farArm','torso','nearArm','head','frontHair','prop']),
  clipboardSouth: Object.freeze(['lower','backHair','torso','head','prop','arms','frontHair']),
});

export function slotRect(slotIdValue) {
  const slot = SLOT_DEFINITIONS[slotIdValue];
  if (!slot) throw new Error(`Unknown atlas slot "${slotIdValue}" for ${ATLAS_SCHEMA_VERSION}.`);
  return Object.freeze({ x: slot.columnIndex * CELL_SIZE, y: slot.rowIndex * CELL_SIZE, width: CELL_SIZE, height: CELL_SIZE });
}

export function requiredSlotsForCapabilities(capabilities = {}) {
  const ids = [...REQUIRED_SLOT_IDS];
  if (capabilities.sitting) ids.push(...SLOT_IDS.filter(id => id.startsWith('actions.') && id.endsWith('.seatedLower')));
  if (capabilities.clipboard) ids.push(...SLOT_IDS.filter(id => id.startsWith('clipboard.')));
  return Object.freeze(ids);
}
