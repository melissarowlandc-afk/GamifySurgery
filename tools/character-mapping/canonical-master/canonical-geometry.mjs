const round = value => Number(value.toFixed(4));
const p2 = (x, y) => ({ x: round(x), y: round(y) });
const p3 = (lateral, forward, height) => ({ lateral: round(lateral), forward: round(forward), height: round(height) });
const add3 = (a, b) => p3(a.lateral + b.lateral, a.forward + b.forward, a.height + b.height);
const sub3 = (a, b) => p3(a.lateral - b.lateral, a.forward - b.forward, a.height - b.height);
const mul3 = (a, amount) => p3(a.lateral * amount, a.forward * amount, a.height * amount);
const dot3 = (a, b) => a.lateral * b.lateral + a.forward * b.forward + a.height * b.height;
const length3 = value => Math.hypot(value.lateral, value.forward, value.height);
const unit3 = value => mul3(value, 1 / length3(value));

export const MASTER = Object.freeze({
  id: 'canonical-short-stylized-v1',
  frame: { width: 240, height: 310, axisX: 112, floorY: 296 },
  lengths: { upperArm: 38, forearm: 37, hand: 10, thigh: 42, shin: 42 },
  anatomy: { hipHalfWidth: 13, shoulderHalfWidth: 34, ankleHeight: 12, headRadiusX: 38, headRadiusY: 43, neckHalfWidth: 9 },
  shapes: {
    torso: { front: { shoulderHalfWidth:36,chestHalfWidth:37,hipHalfWidth:32 }, side: { shoulderHalfWidth:25,chestHalfWidth:27,hipHalfWidth:23 }, cageCoordinates:'u normalized left-to-right; v normalized shoulder-to-hem' },
    limbs: { upperArmWidth:17,forearmWidth:16,thighWidth:24,shinWidth:21,coordinates:'u along rigid bone axis; v across fixed width' },
    hand: { palmRadiusX:4.6,palmRadiusY:6.5,thumbLocalOffset:{medial:6,anterior:6,down:1},coordinates:'palm-local 3D medial/anterior/down offset projected with the shared view transform' },
    foot: { lateralHeelBack:10,lateralToeForward:18,frontHeelBack:5,frontToeForward:12,coordinates:'u heel-to-toe; v sole-to-upper' },
  },
  attachmentAnchors: { neckBase:{region:'cloth.torso',u:.5,v:0},headBase:{region:'skin.head',semantic:'bottom-center'},leftShoulder:{semantic:'joints.left.shoulder'},rightShoulder:{semantic:'joints.right.shoulder'},leftHip:{semantic:'joints.left.hip'},rightHip:{semantic:'joints.right.hip'} },
  phases: ['01', '02', '03', '04', '05', '06', '07', '08'],
  surfaceRegions: {
    head: { materialRegionId: 'skin.head', coordinates: 'normalized ellipse angle/radius' },
    torso: { materialRegionId: 'cloth.torso', coordinates: 'canonical cage u across silhouette, v shoulder-to-hem' },
    upperArm: { materialRegionId: 'cloth.upperArm', coordinates: 'rigid axial u and radial v' },
    forearm: { materialRegionId: 'cloth.forearm', coordinates: 'rigid axial u and radial v' },
    hand: { materialRegionId: 'skin.hand', coordinates: 'palm-local with semantic thumbTip' },
    thigh: { materialRegionId: 'cloth.thigh', coordinates: 'rigid axial u and radial v' },
    shin: { materialRegionId: 'cloth.shin', coordinates: 'rigid axial u and radial v' },
    foot: { materialRegionId: 'shoe.foot', coordinates: 'heel-to-toe u and sole-to-upper v' },
  },
});

const stride = [22, 11, 0, -11, -22, -11, 0, 11];
const lift = [0, 0, 0, 0, 0, 3, 6, 2];
const opposite = values => values.map((_, index) => values[(index + 4) % 8]);

function solve3(start, end, upper, lower, preferred) {
  const delta = sub3(end, start), span = length3(delta);
  if (!span || span > upper + lower + 1e-3 || span < Math.abs(upper - lower) - 1e-3) throw new Error(`unreachable segment span ${span}`);
  const axis = unit3(delta), along = (upper ** 2 - lower ** 2 + span ** 2) / (2 * span), radius = Math.sqrt(Math.max(0, upper ** 2 - along ** 2));
  let perpendicular = sub3(preferred, mul3(axis, dot3(preferred, axis)));
  if (length3(perpendicular) < 1e-6) perpendicular = p3(0, 1, 0);
  return add3(add3(start, mul3(axis, along)), mul3(unit3(perpendicular), radius));
}

const project = (point, view) => {
  const south = view === 'south', north = view === 'north';
  if (south || north) return p2(MASTER.frame.axisX + (south ? -point.lateral : point.lateral), MASTER.frame.floorY - point.height + (south ? .18 : -.18) * point.forward);
  const facing = view === 'east' ? 1 : -1;
  return p2(MASTER.frame.axisX + facing * point.forward + point.lateral * .10, MASTER.frame.floorY - point.height);
};

const extend = (start, end, amount) => add3(end, mul3(unit3(sub3(end, start)), amount));
const distance3 = (a, b) => length3(sub3(a, b));

function phaseLatent(index) {
  const rightForward = stride[index], leftForward = opposite(stride)[index], rightLift = lift[index], leftLift = opposite(lift)[index];
  const maxForward = Math.max(Math.abs(rightForward), Math.abs(leftForward));
  const hipHeight = MASTER.anatomy.ankleHeight + Math.sqrt((MASTER.lengths.thigh + MASTER.lengths.shin) ** 2 - maxForward ** 2);
  const sides = {};
  for (const side of ['left', 'right']) {
    const sign = side === 'right' ? 1 : -1, forward = side === 'right' ? rightForward : leftForward, footLift = side === 'right' ? rightLift : leftLift;
    const hip = p3(sign * MASTER.anatomy.hipHalfWidth, 0, hipHeight);
    const ankle = p3(sign * MASTER.anatomy.hipHalfWidth, forward, MASTER.anatomy.ankleHeight + footLift);
    const knee = solve3(hip, ankle, MASTER.lengths.thigh, MASTER.lengths.shin, p3(sign * .08, 1, 0));
    const shoulder = p3(sign * MASTER.anatomy.shoulderHalfWidth, 0, hipHeight + 78);
    const armForward = -(side === 'right' ? rightForward : leftForward) * 1.09, lateralDelta = sign * 8;
    const targetSpan = 73 - armForward * .05, wristDrop = Math.sqrt(targetSpan ** 2 - armForward ** 2 - lateralDelta ** 2);
    const wrist = p3(shoulder.lateral + lateralDelta, armForward, shoulder.height - wristDrop);
    const elbow = solve3(shoulder, wrist, MASTER.lengths.upperArm, MASTER.lengths.forearm, p3(sign * .18, -1, 0));
    const hand = extend(elbow, wrist, MASTER.lengths.hand);
    sides[side] = { hip, knee, ankle, shoulder, elbow, wrist, hand, footLift };
  }
  return { hipHeight, sides };
}

function footLandmarks(view, side, ankle, footLift) {
  const lateral = view === 'east' || view === 'west';
  if (lateral) {
    const facing = view === 'east' ? 1 : -1, ankle2 = project(ankle, view), soleY = MASTER.frame.floorY - footLift;
    return { ankle: ankle2, heel: p2(ankle2.x - facing * MASTER.shapes.foot.lateralHeelBack, soleY), toe: p2(ankle2.x + facing * MASTER.shapes.foot.lateralToeForward, soleY - (footLift ? 2 : 0)), soleContact: p2(ankle2.x, soleY) };
  }
  const ankle2 = project(ankle, view), screenOutward = ankle2.x < MASTER.frame.axisX ? -1 : 1, soleY = MASTER.frame.floorY - footLift;
  return { ankle: ankle2, heel: p2(ankle2.x - screenOutward * MASTER.shapes.foot.frontHeelBack, soleY), toe: p2(ankle2.x + screenOutward * MASTER.shapes.foot.frontToeForward, soleY - (footLift ? 2 : 0)), soleContact: p2(ankle2.x, soleY) };
}

function handLandmarks(view, side, hand) {
  const sign=side==='right'?1:-1,offset=MASTER.shapes.hand.thumbLocalOffset;
  const thumbLatent=p3(hand.lateral-sign*offset.medial,hand.forward+offset.anterior,hand.height-offset.down);
  return { palm:project(hand,view),thumbTip:project(thumbLatent,view),thumbLatent,thumbVisibility:view==='north'?'guide-only-occluded':'visible',thumbSurface:'medial-anterior' };
}

export function buildWalkGeometry() {
  const result = {};
  for (const view of ['south', 'east', 'north', 'west']) {
    result[view] = {};
    for (let index = 0; index < MASTER.phases.length; index += 1) {
      const latent = phaseLatent(index), joints = {};
      for (const side of ['left', 'right']) {
        const source = latent.sides[side];
        joints[side] = {
          hip: project(source.hip, view), knee: project(source.knee, view), ...footLandmarks(view, side, source.ankle, source.footLift),
          shoulder: project(source.shoulder, view), elbow: project(source.elbow, view), wrist: project(source.wrist, view), ...handLandmarks(view,side,source.hand),
          latent: Object.fromEntries(['hip','knee','ankle','shoulder','elbow','wrist','hand'].map(key => [key, source[key]])), footLift: source.footLift,
        };
      }
      const hipCenter = p2((joints.left.hip.x + joints.right.hip.x) / 2, (joints.left.hip.y + joints.right.hip.y) / 2);
      result[view][MASTER.phases[index]] = { view, phaseId: MASTER.phases[index], hipCenter, joints, dimensions: { ...MASTER.frame }, layerPolicy: view === 'south' || view === 'north' ? ['leftArm','rightArm','leftLeg','rightLeg','torso','head'] : ['farArm','farLeg','nearLeg','torso','head','nearArm'] };
    }
  }
  return result;
}

export function buildStandingGeometry(view = 'south') {
  const geometry = structuredClone(buildWalkGeometry()[view]['03']);
  geometry.phaseId = 'stand';
  for (const side of ['left','right']) {
    const sign = side === 'right' ? 1 : -1, lane = sign * MASTER.anatomy.hipHalfWidth;
    const hip = p3(lane, 0, 96), knee = p3(lane, 0, 54), ankle = p3(lane, 0, 12), shoulder = p3(sign * MASTER.anatomy.shoulderHalfWidth, 0, 174), elbow = p3(sign * MASTER.anatomy.shoulderHalfWidth, 0, 136), wrist = p3(sign * MASTER.anatomy.shoulderHalfWidth, 0, 99), hand = extend(elbow, wrist, MASTER.lengths.hand);
    geometry.joints[side] = { hip:project(hip,view),knee:project(knee,view),...footLandmarks(view,side,ankle,0),shoulder:project(shoulder,view),elbow:project(elbow,view),wrist:project(wrist,view),...handLandmarks(view,side,hand),latent:{hip,knee,ankle,shoulder,elbow,wrist,hand},footLift:0 };
  }
  geometry.hipCenter = p2((geometry.joints.left.hip.x + geometry.joints.right.hip.x)/2,(geometry.joints.left.hip.y + geometry.joints.right.hip.y)/2);
  return geometry;
}

export function buildSeatedGeometry() {
  const view = 'south', geometry = { view, phaseId:'sit', dimensions:{...MASTER.frame}, layerPolicy:['chair','leftLeg','rightLeg','torso','head','leftArm','rightArm'], joints:{} };
  for (const side of ['left','right']) {
    const sign=side==='right'?1:-1, kneeLateral=sign*25, thighForward=Math.sqrt(MASTER.lengths.thigh**2-(kneeLateral-sign*13)**2), hip=p3(sign*13,0,54), knee=p3(kneeLateral,thighForward,54), ankle=p3(kneeLateral,thighForward,12);
    const shoulder=p3(sign*34,0,132),wrist=p3(sign*18,30,67),elbow=solve3(shoulder,wrist,MASTER.lengths.upperArm,MASTER.lengths.forearm,p3(sign*.35,1,0)),hand=extend(elbow,wrist,MASTER.lengths.hand);
    geometry.joints[side]={hip:project(hip,view),knee:project(knee,view),...footLandmarks(view,side,ankle,0),shoulder:project(shoulder,view),elbow:project(elbow,view),wrist:project(wrist,view),...handLandmarks(view,side,hand),latent:{hip,knee,ankle,shoulder,elbow,wrist,hand},footLift:0};
  }
  geometry.hipCenter=p2((geometry.joints.left.hip.x+geometry.joints.right.hip.x)/2,(geometry.joints.left.hip.y+geometry.joints.right.hip.y)/2);
  return geometry;
}

export const geometryInternals = { distance3, project };
