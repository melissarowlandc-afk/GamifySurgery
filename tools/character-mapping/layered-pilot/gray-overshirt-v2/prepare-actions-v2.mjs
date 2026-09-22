import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { packAtlasPageV1 } from '../../standard-atlas/pack-atlas-v1.mjs';
import { signedMarkerSide } from '../../standard-atlas/rigid-geometry.mjs';

const sha=bytes=>createHash('sha256').update(bytes).digest('hex'),point=([x,y])=>({x,y}),orientation=(start,end,marker)=>({markerSign:Math.sign(signedMarkerSide(start,end,marker))});
const ACTION_SOURCE='tools/character-mapping/layered-pilot/gray-overshirt/assets/overshirt-action-parts-v1.png';
const SEATED={south:{crop:{x:81,y:105,width:168,height:208},waist:[165,108],contact:[165,174],soles:[[112,310],[215,310]]},east:{crop:{x:387,y:98,width:211,height:213},waist:[440,100],contact:[440,176],soles:[[556,306],[570,306]]},west:{crop:{x:678,y:98,width:214,height:213},waist:[840,100],contact:[840,176],soles:[[714,306],[730,306]]},north:{crop:{x:1044,y:101,width:167,height:212},waist:[1125,105],contact:[1125,174],soles:[[1082,310],[1175,310]]}};
const CLIPBOARD={right:{crop:{x:1353,y:394,width:145,height:180},shoulder:[1392,405],elbow:[1392,480],wrist:[1420,520],contact:[1490,540],thumb:[1450,525]},left:{crop:{x:1380,y:681,width:144,height:164},shoulder:[1478,690],elbow:[1480,770],wrist:[1443,807],contact:[1395,811],thumb:[1400,792],watch:[1446,807]}};

export async function prepareActionPartsV2(repo,assetsDirectory){
  const sourceFile=resolve(repo,ACTION_SOURCE),bytes=readFileSync(sourceFile),sourceSha=sha(bytes),actions={};
  for(const [view,cfg] of Object.entries(SEATED))actions[`actions.${view}.seatedLower`]={source:{path:sourceFile,sha256:sourceSha,crop:cfg.crop,requireSingleComponent:true,componentIslandMaxRatio:.08,derivation:'true-alpha authored seated lower body; explicit waist, seat support, and sole landmarks'},landmarks:{seat:{waist:point(cfg.waist),contact:point(cfg.contact)},sole:{left:point(cfg.soles[0]),right:point(cfg.soles[1])}},accessories:[],normalization:{targetLength:35}};
  const clipboard={};for(const [side,cfg] of Object.entries(CLIPBOARD)){const shoulder=point(cfg.shoulder),contact=point(cfg.contact),thumb=point(cfg.thumb);clipboard[`clipboard.${side}.clipboardArm`]={source:{path:sourceFile,sha256:sourceSha,crop:cfg.crop,requireSingleComponent:true,derivation:'approved true-alpha bent clipboard arm with explicit anatomical joints and hand contact'},landmarks:{joint:{shoulder,elbow:point(cfg.elbow),wrist:point(cfg.wrist)},hand:{contact},orientation:{thumbTip:thumb}},orientation:orientation(shoulder,contact,thumb),accessories:side==='left'?[{id:'watch',anatomicalSide:'left',landmark:point(cfg.watch),sourceRoi:cfg.crop}]:[],normalization:{targetLength:60}};}
  const actionPage=await packAtlasPageV1({pageId:'actions',parts:actions,outputFile:resolve(assetsDirectory,'actions-v2.png')}),clipboardPage=await packAtlasPageV1({pageId:'clipboard',parts:clipboard,outputFile:resolve(assetsDirectory,'clipboard-v2.png')});
  const fallbacks={};for(const view of Object.keys(SEATED)){fallbacks[`actions.${view}.seatedTorso`]={kind:'base-slot',slots:[`upper.${view}.torso`]};for(const side of ['left','right'])fallbacks[`actions.${view}.seatedArm.${side}`]={kind:'articulated-chain',slots:[`upper.${view}.upperArm.${side}`,`upper.${view}.forearmHand.${side}`]};}
  return{pages:{actions:actionPage,clipboard:clipboardPage},records:{...actionPage.parts,...clipboardPage.parts},fallbacks,sourceLineage:{actions:{path:ACTION_SOURCE,sha256:sourceSha,alphaPolicy:'true source alpha and RGB retained',authoredLandmarks:{seated:SEATED,clipboard:CLIPBOARD}}}};
}
