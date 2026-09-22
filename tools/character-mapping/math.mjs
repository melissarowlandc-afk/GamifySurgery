export const PHASES = [
  ["01", "right-stride", "main", null],
  ["02", "toward-right-passing", "intermediate", null],
  ["03", "right-support-passing", "main", "right"],
  ["04", "toward-left-stride", "intermediate", null],
  ["05", "left-stride", "main", null],
  ["06", "toward-left-passing", "intermediate", null],
  ["07", "left-support-passing", "main", "left"],
  ["08", "toward-right-stride", "intermediate", null],
];

export const round = value => Number(value.toFixed(4));
const p2 = (x, y) => ({ x: round(x), y: round(y) });
const p3 = (lateral, forward, height) => ({ lateral: round(lateral), forward: round(forward), height: round(height) });
export const distance2 = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
export const distance3 = (a, b) => Math.hypot(b.lateral - a.lateral, b.forward - a.forward, b.height - a.height);
const ASSET_VIEW = { east: "right", west: "left", south: "front", north: "back" };
const targetKey = (templateId, view, phaseIndex) => `${templateId}:${ASSET_VIEW[view]}-walk-${phaseIndex}`;
const lineageFor = (recipe, view, phaseId) => {
  const lineage = recipe.lineage[view];
  return lineage.kind === "reflected" ? { ...lineage, sourcePhaseId: lineage.phasePermutation[phaseId] } : lineage;
};

function solve2(start, end, upper, lower, bendForward) {
  const dx = end.x - start.x, dy = end.y - start.y, span = Math.hypot(dx, dy);
  if (!span || span > upper + lower + 1e-6 || span < Math.abs(upper - lower) - 1e-6) throw new Error(`unreachable lateral target span ${round(span)} for ${upper}+${lower}`);
  const along = (upper ** 2 - lower ** 2 + span ** 2) / (2 * span);
  const radius = Math.sqrt(Math.max(0, upper ** 2 - along ** 2));
  const base = p2(start.x + dx * along / span, start.y + dy * along / span);
  const sign = bendForward ? -1 : 1;
  return p2(base.x + sign * (-dy / span) * radius, base.y + sign * (dx / span) * radius);
}
function along2(start, end, amount) { const span = distance2(start, end); return p2(start.x + (end.x - start.x) * amount / span, start.y + (end.y - start.y) * amount / span); }
function extend2(start, end, amount) { const span = distance2(start, end); return p2(end.x + (end.x - start.x) * amount / span, end.y + (end.y - start.y) * amount / span); }
function reflect2(value, axisX) { return p2(axisX * 2 - value.x, value.y); }
function map2(value, mapper) {
  if (Array.isArray(value)) return value.map(item => map2(item, mapper));
  if (value && typeof value === "object") {
    if (Number.isFinite(value.x) && Number.isFinite(value.y)) return mapper(value);
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, map2(item, mapper)]));
  }
  return value;
}
function nativePoint(point, registration) {
  return p2(registration.sourceAxisX + (point.x - registration.frameAxisX) / registration.scale, registration.sourceFloorY + (point.y - registration.frameFloorY) / registration.scale);
}

export function compileLateral(recipe) {
  const r = recipe.lateral, f = r.frame, m = r.motion, lengths = r.segmentLengths;
  const bob = [m.bobStride, m.bobTransition, m.bobPassing, m.bobTransition, m.bobStride, m.bobTransition, m.bobPassing, m.bobTransition];
  const rightFoot = [m.strideReach, m.transitionReach, 0, -m.transitionReach, -m.strideReach, -m.transitionReach, 0, m.transitionReach];
  const leftFoot = rightFoot.map((_, i) => rightFoot[(i + 4) % 8]);
  const rightLift = [0, 0, 0, 0, 0, m.recoveryLift, m.passingLift, m.transitionLift];
  const leftLift = rightLift.map((_, i) => rightLift[(i + 4) % 8]);
  const leftWrist = [m.armStrideReach, m.armTransitionReach, 0, -m.armTransitionReach, -m.armStrideReach, -m.armTransitionReach, 0, m.armTransitionReach];
  const rightWrist = leftWrist.map((_, i) => leftWrist[(i + 4) % 8]);
  const wristDrop = [m.armStrideDrop, m.armTransitionDrop, m.armPassingDrop, m.armTransitionDrop, m.armStrideDrop, m.armTransitionDrop, m.armPassingDrop, m.armTransitionDrop];
  const views = [];
  for (let index = 0; index < 8; index += 1) {
    const support = PHASES[index][3], phaseBob = bob[index];
    const makeSide = side => {
      const right = side === "right";
      const shoulder = p2(right ? r.centers.shoulderRightX : r.centers.shoulderLeftX, r.centers.shoulderY + phaseBob);
      const hip = p2(r.centers.hipX, r.centers.hipY + phaseBob);
      const lift = (right ? rightLift : leftLift)[index];
      const ankle = p2(r.centers.hipX + (right ? rightFoot : leftFoot)[index], r.centers.ankleY - lift);
      const knee = support === side ? along2(hip, ankle, lengths.thigh) : solve2(hip, ankle, lengths.thigh, lengths.shin, true);
      const wrist = p2(shoulder.x + (right ? rightWrist : leftWrist)[index], shoulder.y + wristDrop[index]);
      const elbow = solve2(shoulder, wrist, lengths.upperArm, lengths.forearm, false);
      const hand = extend2(shoulder, wrist, lengths.hand);
      const soleY = f.floorY - lift;
      return { shoulder, elbow, wrist, hand, hip, knee, ankle, shoeContact: p2(ankle.x, soleY), shoeHeel: p2(ankle.x - r.foot.heelBack, soleY), shoeToe: p2(ankle.x + r.foot.toeForward, soleY), footLift: lift, footLiftUnits: "frame-pixels", support: support === side };
    };
    const east = {
      coordinateSpace: `frame${f.width}x${f.height}`, facing: "east", facingVectorX: 1, nearSide: "right", farSide: "left", phaseBob,
      headEnvelope: { center: p2(f.axisX, r.centers.headY + phaseBob), radiusX: r.envelope.headRadiusX, radiusY: r.envelope.headRadiusY },
      torso: { shoulderBack: p2(f.axisX - r.envelope.torsoShoulderHalfDepth, r.centers.shoulderY + phaseBob), shoulderFront: p2(f.axisX + r.envelope.torsoShoulderHalfDepth, r.centers.shoulderY + phaseBob), chestBack: p2(f.axisX - r.envelope.torsoChestHalfDepth, r.centers.chestY + phaseBob), chestFront: p2(f.axisX + r.envelope.torsoChestHalfDepth, r.centers.chestY + phaseBob), hipBack: p2(f.axisX - r.envelope.torsoHipHalfDepth, r.centers.hipY + phaseBob), hipFront: p2(f.axisX + r.envelope.torsoHipHalfDepth, r.centers.hipY + phaseBob) },
      joints: { left: makeSide("left"), right: makeSide("right") }, renderingOrder: ["left-far-limbs", "torso-and-head", "right-near-limbs"],
    };
    const west = map2(east, point => reflect2(point, f.axisX));
    Object.assign(west, { facing: "west", facingVectorX: -1, nearSide: "left", farSide: "right", renderingOrder: ["right-far-limbs", "torso-and-head", "left-near-limbs"] });
    for (const [name, view] of [["east", east], ["west", west]]) {
      const registration = { ...r.registration[name], frameAxisX: f.axisX, frameFloorY: f.floorY };
      const nativeMaster = map2(view, point => nativePoint(point, registration));
      nativeMaster.coordinateSpace = `source${registration.sourceWidth}x${registration.sourceHeight}`;
      nativeMaster.sourceAxisX = registration.sourceAxisX; nativeMaster.floorExclusiveEdgeY = registration.sourceFloorY;
      nativeMaster.phaseBob = round(view.phaseBob / registration.scale); nativeMaster.phaseBobUnits = "source-pixels";
      nativeMaster.headEnvelope.radiusX = round(view.headEnvelope.radiusX / registration.scale); nativeMaster.headEnvelope.radiusY = round(view.headEnvelope.radiusY / registration.scale);
      nativeMaster.segmentLengths = Object.fromEntries(Object.entries(lengths).map(([key, value]) => [key, round(value / registration.scale)]));
      for (const side of ["left", "right"]) { nativeMaster.joints[side].footLift = round(view.joints[side].footLift / registration.scale); nativeMaster.joints[side].footLiftUnits = "source-pixels"; }
      view.nativeMaster = nativeMaster; view.registration = registration;
      views.push({ phaseIndex: index + 1, phaseId: PHASES[index][0], motionId: PHASES[index][1], kind: PHASES[index][2], normalizedCycle: index / 8, reviewFrameMilliseconds: 180, view: name, assetView: ASSET_VIEW[name], outputKey: targetKey(recipe.identity.templateId, name, index + 1), anatomy: { coordinateSpace: "lateral-frame-pixels", segmentLengths: lengths }, geometry: view, lineage: lineageFor(recipe, name, PHASES[index][0]) });
    }
  }
  return views;
}

const v3 = {
  add: (a, b) => p3(a.lateral + b.lateral, a.forward + b.forward, a.height + b.height),
  sub: (a, b) => p3(a.lateral - b.lateral, a.forward - b.forward, a.height - b.height),
  mul: (a, n) => p3(a.lateral * n, a.forward * n, a.height * n),
  dot: (a, b) => a.lateral * b.lateral + a.forward * b.forward + a.height * b.height,
};
function unit3(a) { const n = Math.hypot(a.lateral, a.forward, a.height); return v3.mul(a, 1 / n); }
function solve3(start, end, upper, lower, preferred) {
  const delta = v3.sub(end, start), span = Math.hypot(delta.lateral, delta.forward, delta.height);
  if (!span || span > upper + lower + 1e-3 || span < Math.abs(upper - lower) - 1e-3) throw new Error(`unreachable latent target span ${round(span)} for ${upper}+${lower}`);
  const u = unit3(delta), along = (upper ** 2 - lower ** 2 + span ** 2) / (2 * span), radius = Math.sqrt(Math.max(0, upper ** 2 - along ** 2));
  let perpendicular = v3.sub(preferred, v3.mul(u, v3.dot(preferred, u)));
  if (Math.hypot(perpendicular.lateral, perpendicular.forward, perpendicular.height) < 1e-7) perpendicular = p3(0, 1, 0);
  return v3.add(v3.add(start, v3.mul(u, along)), v3.mul(unit3(perpendicular), radius));
}
function extend3(start, end, amount) { return v3.add(end, v3.mul(unit3(v3.sub(end, start)), amount)); }
function map3(value, mapper) {
  if (Array.isArray(value)) return value.map(item => map3(item, mapper));
  if (value && typeof value === "object") {
    if (Number.isFinite(value.lateral) && Number.isFinite(value.forward) && Number.isFinite(value.height)) return mapper(value);
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, map3(item, mapper)]));
  }
  return value;
}

export function compileNorthSouth(recipe) {
  const r = recipe.northSouth, f = r.frame, m = r.motion, lengths = r.segmentLengths3D, body = r.body;
  const rightForward = [m.strideReach, m.transitionReach, 0, -m.transitionReach, -m.strideReach, -m.transitionReach, 0, m.transitionReach];
  const leftForward = rightForward.map((_, i) => rightForward[(i + 4) % 8]);
  const rightLift = [0, 0, 0, 0, 0, m.recoveryLift, m.passingLift, m.transitionLift];
  const leftLift = rightLift.map((_, i) => rightLift[(i + 4) % 8]);
  const leftArm = [m.armStrideReach, m.armTransitionReach, 0, -m.armTransitionReach, -m.armStrideReach, -m.armTransitionReach, 0, m.armTransitionReach];
  const rightArm = leftArm.map((_, i) => leftArm[(i + 4) % 8]);
  const hipHeights = rightForward.map((forward, index) => index === 2 || index === 6 ? r.foot.ankleHeight + lengths.thigh + lengths.shin : round(r.foot.ankleHeight + Math.sqrt((lengths.thigh + lengths.shin) ** 2 - forward ** 2)));
  const minHip = Math.min(...hipHeights), targets = [];
  for (let index = 0; index < 8; index += 1) {
    const support = PHASES[index][3], hipHeight = hipHeights[index];
    const makeSide = side => {
      const sign = side === "right" ? 1 : -1, lane = sign * r.lanes.hipHalfWidth;
      const forward = (side === "right" ? rightForward : leftForward)[index], lift = (side === "right" ? rightLift : leftLift)[index];
      const hip = p3(lane, 0, hipHeight), ankle = p3(lane, forward, r.foot.ankleHeight + lift);
      const knee = support === side ? v3.add(hip, v3.mul(unit3(v3.sub(ankle, hip)), lengths.thigh)) : solve3(hip, ankle, lengths.thigh, lengths.shin, p3(-sign * r.lanes.kneeBendLateralPreference, 1, 0));
      const shoulder = p3(sign * body.shoulderHalfWidth, 0, hipHeight + body.shoulderHeightAboveHip);
      const armForward = (side === "right" ? rightArm : leftArm)[index], span = [m.armStrideSpan, m.armTransitionSpan, m.armPassingSpan, m.armTransitionSpan, m.armStrideSpan, m.armTransitionSpan, m.armPassingSpan, m.armTransitionSpan][index];
      const lateralDelta = sign * (body.wristHalfWidth - body.shoulderHalfWidth);
      const dropSquare = span ** 2 - armForward ** 2 - lateralDelta ** 2;
      if (dropSquare < 0) throw new Error(`unreachable arm target in phase ${index + 1}`);
      const wrist = p3(sign * body.wristHalfWidth, armForward, shoulder.height - Math.sqrt(dropSquare));
      const elbow = solve3(shoulder, wrist, lengths.upperArm, lengths.forearm, p3(sign * 0.35, -Math.sign(armForward || 1), -0.1));
      return { shoulder, elbow, wrist, hand: extend3(shoulder, wrist, lengths.hand), hip, knee, ankle, contact: p3(lane, forward + r.foot.contactForwardOffset, lift), heel: p3(lane, forward + r.foot.heelForwardOffset, lift + (lift ? r.foot.liftedHeelRise : 0)), toe: p3(lane, forward + r.foot.toeForwardOffset, lift + (lift ? r.foot.liftedToeRise : 0)), latentFootLift: lift, latentFootLiftUnits: "latent-frame-authoring-units-upward", support: support === side };
    };
    const latent = { coordinateSpace: "latent3D-frame-authoring-units", phaseBob: round(hipHeight - minHip), body: { axisBottom: p3(0, 0, hipHeight), shoulderCenter: p3(0, 0, hipHeight + body.shoulderHeightAboveHip), headCenter: p3(0, 0, hipHeight + body.headHeightAboveHip), torso: [p3(-body.torsoShoulderHalfWidth, 0, hipHeight + body.shoulderHeightAboveHip), p3(-body.torsoChestHalfWidth, 0, hipHeight + body.torsoChestHeightAboveHip), p3(-body.torsoHipHalfWidth, 0, hipHeight), p3(body.torsoHipHalfWidth, 0, hipHeight), p3(body.torsoChestHalfWidth, 0, hipHeight + body.torsoChestHeightAboveHip), p3(body.torsoShoulderHalfWidth, 0, hipHeight + body.shoulderHeightAboveHip)] }, joints: { left: makeSide("left"), right: makeSide("right") } };
    for (const name of ["south", "north"]) {
      const south = name === "south", project = point => p2(f.axisX + (south ? -point.lateral : point.lateral) * r.projection.lateralScale, f.floorY - r.projection.verticalScale * point.height + (south ? 1 : -1) * r.projection.depthScale * point.forward);
      const joints = {};
      for (const side of ["left", "right"]) {
        const source = latent.joints[side], projected = map3(source, project); delete projected.latentFootLift; delete projected.latentFootLiftUnits;
        const ground = key => project(p3(source[key].lateral, source[key].forward, 0));
        joints[side] = { ...projected, projectedGround: { contact: ground("contact"), heel: ground("heel"), toe: ground("toe") }, projectedFootLift: round(r.projection.verticalScale * source.latentFootLift), projectedFootLiftUnits: "frame-pixels-upward", support: source.support };
      }
      const projectedBody = map3(latent.body, project);
      projectedBody.headEnvelope = { center: project(latent.body.headCenter), radiusX: body.headRadiusLateral * r.projection.lateralScale, radiusY: round(body.headRadiusHeight * r.projection.verticalScale) };
      projectedBody.shoulderY = project(latent.body.shoulderCenter).y;
      const depth = side => { const j = latent.joints[side], sign = south ? 1 : -1; return { leg: round(sign * (j.knee.forward + j.ankle.forward) / 2), arm: round(sign * (j.elbow.forward + j.wrist.forward) / 2) }; };
      const scores = { left: depth("left"), right: depth("right") }, order = part => ["left", "right"].sort((a, b) => scores[a][part] - scores[b][part]);
      const frame = { coordinateSpace: `frame${f.width}x${f.height}`, body: projectedBody, joints };
      const registration = { ...r.registration[name], frameAxisX: f.axisX, frameFloorY: f.floorY };
      const nativeMaster = map2(frame, point => nativePoint(point, registration));
      nativeMaster.coordinateSpace = `source${registration.sourceWidth}x${registration.sourceHeight}-via-projection`; nativeMaster.sourceAxisX = registration.sourceAxisX; nativeMaster.floorExclusiveEdgeY = registration.sourceFloorY;
      nativeMaster.body.shoulderY = round(registration.sourceFloorY + (frame.body.shoulderY - f.floorY) / registration.scale);
      nativeMaster.body.headEnvelope.radiusX = round(frame.body.headEnvelope.radiusX / registration.scale); nativeMaster.body.headEnvelope.radiusY = round(frame.body.headEnvelope.radiusY / registration.scale);
      nativeMaster.projectedUpwardBob = round(r.projection.verticalScale * latent.phaseBob / registration.scale); nativeMaster.projectedUpwardBobUnits = "source-pixels";
      for (const side of ["left", "right"]) { nativeMaster.joints[side].latentFootLift = latent.joints[side].latentFootLift; nativeMaster.joints[side].latentFootLiftUnits = "latent-frame-authoring-units-upward"; nativeMaster.joints[side].projectedFootLift = round(frame.joints[side].projectedFootLift / registration.scale); nativeMaster.joints[side].projectedFootLiftUnits = "source-pixels-upward"; }
      targets.push({ phaseIndex: index + 1, phaseId: PHASES[index][0], motionId: PHASES[index][1], kind: PHASES[index][2], normalizedCycle: index / 8, reviewFrameMilliseconds: 180, view: name, assetView: ASSET_VIEW[name], outputKey: targetKey(recipe.identity.templateId, name, index + 1), anatomy: { coordinateSpace: "latent3D-frame-authoring-units", segmentLengths: lengths }, geometry: { facing: name, anatomicalRightScreenSide: south ? "left" : "right", projection: { ...r.projection, depthSign: south ? 1 : -1 }, latent, frame, nativeMaster, visibility: { depthScores: scores, legsFarToNear: order("leg"), armsFarToNear: order("arm") }, registration }, lineage: lineageFor(recipe, name, PHASES[index][0]) });
    }
  }
  return targets;
}
