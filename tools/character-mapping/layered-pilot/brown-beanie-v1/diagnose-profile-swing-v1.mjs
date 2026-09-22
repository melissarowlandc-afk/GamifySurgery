import { resolve } from 'node:path';
import { loadRig,renderPose,standingPose,walkingPose } from './beanie-rig-v1.mjs';
const loaded=await loadRig(resolve(import.meta.dirname,'../../../..'));
for(const view of ['east','west']){
const sign=view==='east'?1:-1;
const arr=[renderPose(loaded,standingPose(view)),...Array.from({length:8},(_,i)=>renderPose(loaded,walkingPose(view,i)))];
console.log(view,arr.map(p=>({phase:p.metadata.phaseId,near:p.metadata.near,nearWrist:sign*(p.metadata.arms[p.metadata.near].solved.wrist.x-80),farWrist:sign*(p.metadata.arms[p.metadata.far].solved.wrist.x-80),nearShoulder:sign*(p.metadata.arms[p.metadata.near].solved.shoulder.x-80),farShoulder:sign*(p.metadata.arms[p.metadata.far].solved.shoulder.x-80)})));
}
