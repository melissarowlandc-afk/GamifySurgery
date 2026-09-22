import { MASTER } from '../canonical-master/canonical-geometry.mjs';

const round = value => Number(value.toFixed(4));
const p2 = (x, y) => ({ x: round(x), y: round(y) });
const p3 = (lateral, forward, height) => ({ lateral: round(lateral), forward: round(forward), height: round(height) });
const add3 = (a, b) => p3(a.lateral + b.lateral, a.forward + b.forward, a.height + b.height);
const sub3 = (a, b) => p3(a.lateral - b.lateral, a.forward - b.forward, a.height - b.height);
const mul3 = (a, amount) => p3(a.lateral * amount, a.forward * amount, a.height * amount);
const dot3 = (a, b) => a.lateral * b.lateral + a.forward * b.forward + a.height * b.height;
const length3 = value => Math.hypot(value.lateral, value.forward, value.height);
const unit3 = value => mul3(value, 1 / length3(value));

export const ACTION = Object.freeze({
  id: 'canonical-short-stylized-actions-v1',
  frame: { width: 280, height: 350, axisX: 140, floorY: 330 },
  directions: ['east', 'west', 'south', 'north'],
  phaseIds: MASTER.phases,
  jumpStages: ['gather', 'takeoff', 'opening', 'open-star', 'closing', 'soft-landing', 'recover', 'ready'],
});

function solve3(start, end, upper, lower, preferred) {
  const delta = sub3(end, start), span = length3(delta);
  if (!span || span > upper + lower + 1e-3 || span < Math.abs(upper - lower) - 1e-3) throw new Error(`unreachable span ${span}`);
  const axis = unit3(delta), along = (upper ** 2 - lower ** 2 + span ** 2) / (2 * span), radius = Math.sqrt(Math.max(0, upper ** 2 - along ** 2));
  let perpendicular = sub3(preferred, mul3(axis, dot3(preferred, axis)));
  if (length3(perpendicular) < 1e-6) perpendicular = p3(0, 1, 0);
  return add3(add3(start, mul3(axis, along)), mul3(unit3(perpendicular), radius));
}

function project(point, view) {
  const south = view === 'south', north = view === 'north';
  if (south || north) return p2(ACTION.frame.axisX + (south ? -point.lateral : point.lateral), ACTION.frame.floorY - point.height + (south ? .18 : -.18) * point.forward);
  const facing = view === 'east' ? 1 : -1;
  return p2(ACTION.frame.axisX + facing * point.forward + point.lateral * .10, ACTION.frame.floorY - point.height);
}

const extend = (start, end, amount) => add3(end, mul3(unit3(sub3(end, start)), amount));
function solveArmToHand(shoulder, hand, preferred) {
  const elbow=solve3(shoulder,hand,MASTER.lengths.upperArm,MASTER.lengths.forearm+MASTER.lengths.hand,preferred);
  const wrist=add3(elbow,mul3(unit3(sub3(hand,elbow)),MASTER.lengths.forearm));
  return { elbow,wrist,hand };
}

function footLandmarks(view, ankle) {
  const soleHeight = ankle.height - MASTER.anatomy.ankleHeight;
  if (view === 'east' || view === 'west') {
    const facing = view === 'east' ? 1 : -1, ankle2 = project(ankle, view), soleY = ACTION.frame.floorY - soleHeight;
    return { ankle: ankle2, heel: p2(ankle2.x - facing * MASTER.shapes.foot.lateralHeelBack, soleY), toe: p2(ankle2.x + facing * MASTER.shapes.foot.lateralToeForward, soleY), soleHeight: round(soleHeight) };
  }
  const ankle2 = project(ankle, view), outward = ankle2.x < ACTION.frame.axisX ? -1 : 1, depthY = (view === 'south' ? .18 : -.18) * ankle.forward, soleY = ACTION.frame.floorY - soleHeight + depthY;
  return { ankle: ankle2, heel: p2(ankle2.x - outward * MASTER.shapes.foot.frontHeelBack, soleY), toe: p2(ankle2.x + outward * MASTER.shapes.foot.frontToeForward, soleY), soleHeight: round(soleHeight) };
}

function handLandmarks(view, side, hand) {
  const sign = side === 'right' ? 1 : -1, offset = MASTER.shapes.hand.thumbLocalOffset;
  const thumbLatent = p3(hand.lateral - sign * offset.medial, hand.forward + offset.anterior, hand.height - offset.down);
  return { palm: project(hand, view), thumbTip: project(thumbLatent, view), thumbLatent, thumbVisibility: view === 'north' ? 'guide-only-occluded' : 'visible' };
}

function sideRecord(view, side, latent) {
  return {
    hip: project(latent.hip, view), knee: project(latent.knee, view), ...footLandmarks(view, latent.ankle),
    shoulder: project(latent.shoulder, view), elbow: project(latent.elbow, view), wrist: project(latent.wrist, view), ...handLandmarks(view, side, latent.hand),
    latent,
  };
}

function finish(view, phaseId, action, sides, extras = {}) {
  const joints = Object.fromEntries(['left', 'right'].map(side => [side, sideRecord(view, side, sides[side])]));
  const hipCenter = p2((joints.left.hip.x + joints.right.hip.x) / 2, (joints.left.hip.y + joints.right.hip.y) / 2);
  const frontal=view==='south'||view==='north';
  const layerPolicy=action==='sit'?(view==='south'?['chair','legs','torso','head','arms']:view==='north'?['chair','arms','legs','torso','head']:['chair','farArm','farLeg','nearLeg','torso','head','nearArm']):action==='clipboard'?(view==='north'?['rightArm','clipboard','leftArm','legs','torso','head']:['legs','torso','head','rightArm','clipboard','leftArm']):(frontal?['arms','legs','torso','head']:['farArm','farLeg','nearLeg','torso','head','nearArm']);
  return { view, phaseId, action, dimensions: ACTION.frame, hipCenter, joints, layerPolicy, ...extras };
}

function standingLegs() {
  const sides = {};
  for (const side of ['left', 'right']) {
    const sign = side === 'right' ? 1 : -1;
    sides[side] = { hip: p3(sign * 13, 0, 96), knee: p3(sign * 13, 0, 54), ankle: p3(sign * 13, 0, 12) };
  }
  return sides;
}

export function buildSeatedGeometry(view) {
  const sides = {};
  for (const side of ['left', 'right']) {
    const sign = side === 'right' ? 1 : -1, hip = p3(sign * 13, 0, 54), knee = p3(sign * 25, Math.sqrt(MASTER.lengths.thigh ** 2 - 12 ** 2), 54), ankle = p3(sign * 25, knee.forward, 12);
    const shoulder = p3(sign * 34, 0, 132), wrist = p3(sign * 18, 30, 67), elbow = solve3(shoulder, wrist, MASTER.lengths.upperArm, MASTER.lengths.forearm, p3(sign * .35, -1, 0)), hand = extend(elbow, wrist, MASTER.lengths.hand);
    sides[side] = { hip, knee, ankle, shoulder, elbow, wrist, hand };
  }
  return finish(view, 'sit', 'sit', sides, { chair: { seatHeight: 54, seatForward: 0 } });
}

export function buildClipboardGeometry(view) {
  const sides = standingLegs();
  const raise=view==='south'?12:0;
  const latentCorners={topLeft:p3(-30,36,153+raise),topRight:p3(30,36,153+raise),bottomRight:p3(30,24,111+raise),bottomLeft:p3(-30,24,111+raise)};
  const anchors={leftSupport:p3(-5,22,113+raise),rightRest:p3(16,35,143+raise)};
  for (const side of ['left', 'right']) {
    const sign=side==='right'?1:-1,shoulder=p3(sign*34,0,174),hand=side==='left'?anchors.leftSupport:anchors.rightRest;
    Object.assign(sides[side],{shoulder,...solveArmToHand(shoulder,hand,p3(sign*.5,-1,0))});
  }
  const corners=Object.fromEntries(Object.entries(latentCorners).map(([key,point])=>[key,project(point,view)]));
  const center=p3(0,30,132+raise),screenCenter=project(center,view);
  return finish(view,'hold','clipboard',sides,{clipboard:{latentCenter:center,center:screenCenter,latentCorners,corners,anchors,roles:{left:'underside-support',right:'writing-face-rest'},frontOfBody:view!=='north'}});
}

const jump = {
  hipHeight: [82, 96, 110, 118, 108, 82, 90, 96],
  soleHeight: [0, 8, 28, 40, 25, 0, 0, 0],
  ankleSpread: [15, 24, 42, 55, 40, 24, 16, 13],
  wristOut: [8, 22, 45, 52, 42, 22, 10, 4],
  wristRise: [-67, -55, -25, 35, -20, -55, -66, -69],
};

function jumpPhase(index) {
  const sides = {}, hipHeight = jump.hipHeight[index];
  for (const side of ['left', 'right']) {
    const sign = side === 'right' ? 1 : -1, hip = p3(sign * 13, 0, hipHeight), ankle = p3(sign * jump.ankleSpread[index], 0, MASTER.anatomy.ankleHeight + jump.soleHeight[index]);
    const knee = solve3(hip, ankle, MASTER.lengths.thigh, MASTER.lengths.shin, p3(sign * .12, 1, 0)), shoulder = p3(sign * 34, 0, hipHeight + 78), wrist = p3(shoulder.lateral + sign * jump.wristOut[index], 0, shoulder.height + jump.wristRise[index]);
    const elbow = solve3(shoulder, wrist, MASTER.lengths.upperArm, MASTER.lengths.forearm, p3(sign * .55, -1, 0)), hand = extend(elbow, wrist, MASTER.lengths.hand);
    sides[side] = { hip, knee, ankle, shoulder, elbow, wrist, hand };
  }
  return sides;
}

export function buildJumpGeometry() {
  const result = {};
  for (const view of ACTION.directions) {
    result[view] = {};
    for (let index = 0; index < ACTION.phaseIds.length; index++) result[view][ACTION.phaseIds[index]] = finish(view, ACTION.phaseIds[index], 'starJump', jumpPhase(index), { stage: ACTION.jumpStages[index] });
  }
  return result;
}

export const actionInternals = { distance3: (a, b) => length3(sub3(a, b)), project };
