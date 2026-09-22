import {
  createHash
}
from'node:crypto';
import {
  readFileSync
}
from'node:fs';
import {
  resolve
}
from'node:path';
import {
  compileLateral
}
from'../math.mjs';
const repo=resolve(import.meta.dirname,'../../..'),out=resolve(repo,'artifacts/character-movement/retained-donor-merge/two-character-eight-east-v2'),proof=JSON.parse(readFileSync(resolve(out,'two-character-eight-east.json'))),mapping=JSON.parse(readFileSync(resolve(import.meta.dirname,'mapping.json'))),sha=b=>createHash('sha256').update(b).digest('hex'),fail=m=> {
  throw new Error(m)
}
,near=(a,b,e=.002)=>Math.abs(a-b)<=e,dist=(a,b)=>Math.hypot(b.x-a.x,b.y-a.y);
function recipeFor(c) {
  const f=c.recipe.frame;
  return {
    identity: {
      templateId:c.id
    }
    ,lineage: {
      east: {
        kind:'independent'
      }
      ,west: {
        kind:'reflected',fromView:'east',phasePermutation: {
          '01':'05','02':'06','03':'07','04':'08','05':'01','06':'02','07':'03','08':'04'
        }
      }
    }
    ,lateral: {
      ...c.recipe,registration: {
        east: {
          scale:1,sourceAxisX:f.axisX,sourceFloorY:f.floorY,sourceWidth:f.width,sourceHeight:f.height
        }
        ,west: {
          scale:1,sourceAxisX:f.axisX,sourceFloorY:f.floorY,sourceWidth:f.width,sourceHeight:f.height
        }
      }
    }
  }
}
function pair(g,id) {
  const j=g.joints[id.includes('near-right')?'right':'left'];
  if(id.includes('upper-arm'))return[j.shoulder,j.elbow];
  if(id.includes('forearm'))return[j.elbow,j.wrist];
  if(id.includes('thigh'))return[j.hip,j.knee];
  if(id.includes('shin'))return[j.knee,j.ankle];
  if(id.includes('shoe'))return[j.shoeHeel,j.shoeToe];
  fail(id)
}
let outputHashes=0,transformChecks=0,geometryChecks=0,soleChecks=0,supportChecks=0,ratioChecks=0,maxAppliedEndpointResidual=0;
if(proof.characters.length!==2)fail('character count');
for(const c of proof.characters) {
  const config=mapping.characters.find(x=>x.id===c.id),compiled=compileLateral(recipeFor(config)).filter(x=>x.view==='east'),kit=JSON.parse(readFileSync(resolve(repo,c.kitPath)));
  if(sha(readFileSync(resolve(repo,c.sourcePath)))!==c.sourceSha256)fail(`${c.id} source hash`);
  if(sha(readFileSync(resolve(repo,c.kitPath)))!==c.kitSha256)fail(`${c.id} kit hash`);
  if(c.head.scale!==1||!c.head.reusedAcrossAllPhases)fail(`${c.id} head reuse`);
  if(c.guide.usesRasterAlpha!==false||c.guide.kind!=='independent-compiled-geometry')fail(`${c.id} guide provenance`);
  if(JSON.stringify(c.torso.clipPolygon)!==JSON.stringify(kit.torsoClip)||JSON.stringify(c.torso.backFill)!==JSON.stringify(kit.backFill)||JSON.stringify(c.torso.actualBodySourceHip)!==JSON.stringify(kit.bodySourceHip))fail(`${c.id} torso metadata`);
  const recipe=config.recipe,L=recipe.segmentLengths.thigh+recipe.segmentLengths.shin,A=recipe.segmentLengths.upperArm+recipe.segmentLengths.forearm;
  for(const t of compiled) {
    const p=t.phaseId,g=t.geometry,stored=c.targets[p];
    if(JSON.stringify(stored)!==JSON.stringify(g))fail(`${c.id}/${p} geometry not rederived`);
    geometryChecks++;
    for(const side of['left','right']) {
      const j=g.joints[side];
      if(!near(dist(j.hip,j.knee),recipe.segmentLengths.thigh)||!near(dist(j.knee,j.ankle),recipe.segmentLengths.shin)||!near(dist(j.shoulder,j.elbow),recipe.segmentLengths.upperArm)||!near(dist(j.elbow,j.wrist),recipe.segmentLengths.forearm))fail(`${c.id}/${p}/${side} length`);
      if(!near(j.shoeContact.y,recipe.frame.floorY-j.footLift))fail(`${c.id}/${p}/${side} sole`);
      soleChecks++
    }
    if(p==='03') {
      if(!g.joints.right.support)fail(`${c.id}/${p} right support`);
      supportChecks++
    }
    if(p==='07') {
      if(!g.joints.left.support)fail(`${c.id}/${p} left support`);
      supportChecks++
    }
    const expectedTransformIds=[...kit.pieces.filter(piece=>piece.anchors).map(piece=>piece.id),'body'].sort();
    const actualTransformIds=Object.keys(c.appliedTransforms[p]).sort();
    if(JSON.stringify(actualTransformIds)!==JSON.stringify(expectedTransformIds))fail(`${c.id}/${p} transform trace completeness`);
    for(const[id,tr]of Object.entries(c.appliedTransforms[p])) {
      if(id==='body') {
        if(tr.scale!==1||!near(tr.targetHip.x,g.joints.right.hip.x)||!near(tr.targetHip.y,g.joints.right.hip.y)||!near(tr.translate.x,g.joints.right.hip.x-kit.bodySourceHip.x)||!near(tr.translate.y,g.joints.right.hip.y-kit.bodySourceHip.y))fail(`${c.id}/${p}/body transform`);
        transformChecks++;
        continue
      }
      const[a,b]=pair(g,id);
      const piece=kit.pieces.find(candidate=>candidate.id===id);
      if(JSON.stringify(tr.sourceStart)!==JSON.stringify({x:piece.anchors[0][0],y:piece.anchors[0][1]})||JSON.stringify(tr.sourceEnd)!==JSON.stringify({x:piece.anchors[1][0],y:piece.anchors[1][1]}))fail(`${c.id}/${p}/${id} source anchors`);
      const dx=(tr.sourceEnd.x-tr.sourceStart.x)*tr.scale,dy=(tr.sourceEnd.y-tr.sourceStart.y)*tr.scale,cos=Math.cos(tr.rotationRadians),sin=Math.sin(tr.rotationRadians);
      const mappedEnd={x:tr.targetStart.x+cos*dx-sin*dy,y:tr.targetStart.y+sin*dx+cos*dy};
      const residual=Math.max(dist(tr.targetStart,a),dist(mappedEnd,b));
      maxAppliedEndpointResidual=Math.max(maxAppliedEndpointResidual,residual);
      if(!near(tr.scale,c.fixedScales[id],1e-6)||residual>.002)fail(`${c.id}/${p}/${id} applied matrix residual ${residual}`);
      transformChecks++
    }
    for(const[k,path]of Object.entries( {
      clean:c.outputs[p].clean,overlay:c.outputs[p].overlay,guide:c.outputs[p].guide
    }
    )) {
      if(sha(readFileSync(resolve(out,path)))!==c.outputs[p].sha256[k])fail(`${c.id}/${p}/${k} output hash`);
      outputHashes++
    }
  }
  const expected= {
    armStrideReach:29/56*A,armStrideDrop:47/56*A,armTransitionReach:15/56*A,armTransitionDrop:53/56*A,armPassingDrop:A,strideReach:25/57*L,bobStride:6/57*L,transitionReach:13/57*L,bobTransition:2/57*L,recoveryLift:5/57*L,passingLift:4/57*L,transitionLift:2/57*L
  }
  ;
  for(const[k,v]of Object.entries(expected)) {
    if(!near(recipe.motion[k],v,.05))fail(`${c.id} ratio ${k}`);
    ratioChecks++
  }
}
console.log(JSON.stringify( {
  status:'passed',characters:2,eastPhases:16,sourceHashes:2,kitHashes:2,recompiledGeometryChecks:geometryChecks,appliedTransformChecks:transformChecks,maxAppliedEndpointResidual,outputHashChecks:outputHashes,soleChecks,supportChecks,ratioChecks,headScaleReuse:2,independentGuideChecks:2
}
));
