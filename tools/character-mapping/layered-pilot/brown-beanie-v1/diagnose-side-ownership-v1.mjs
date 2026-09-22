import { resolve } from 'node:path';
import { VIEWS,loadRig,renderPose,standingPose } from './beanie-rig-v1.mjs';
const loaded=await loadRig(resolve(import.meta.dirname,'../../../..'));
for(const view of VIEWS){const p=renderPose(loaded,standingPose(view));console.log(view,Object.fromEntries(['left','right'].map(side=>[side,{poseHip:p.metadata.mappedGeometry.joints[side].hip,poseSole:p.metadata.mappedGeometry.joints[side].soleContact,atlasHip:loaded.parts[`lower.${view}.thigh.${side}`].landmarks.joint.hip,sourceHip:loaded.lower.parts?.[`lower.${view}.thigh.${side}`]?.source?.crop,shoe:p.metadata.legs[side].shoeDestination}])));}
