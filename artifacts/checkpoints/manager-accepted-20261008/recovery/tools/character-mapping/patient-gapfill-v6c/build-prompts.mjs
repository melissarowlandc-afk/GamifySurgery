import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {repo,tool,hash,assertRoster} from './build-roster.mjs';
const rows=JSON.parse(readFileSync(resolve(tool,'design-rows.json'),'utf8'));
const stylePath='artifacts/character-statics/patient-gapfill-v6a/sources/004/source.png',style={path:stylePath,sha256:hash(resolve(repo,stylePath)),role:'accepted-v6a-v6b-style-layout-pose-reference'};
const templates=[1,2].map(n=>readFileSync(resolve(tool,'../patient-gapfill-v6a/prompts/001',n===1?'stage1-standing-cardinals.prompt.txt':'stage2-eight-pose.prompt.txt'),'utf8'));
const old=JSON.parse(readFileSync(resolve(tool,'../patient-gapfill-v6a/roster.json'),'utf8')).identities.find(c=>c.number==='001');
const describe=c=>`a ${c.intendedAge}-year-old adult ${c.compatibleSexLabel==='Female'?'woman':'man'} with ${c.visualBrief.skin}, ${c.visualBrief.hair}, ${c.visualBrief.accessory}, and a ${c.visualBrief.build}. They wear ${c.visualBrief.outfit}. All sleeves are full length to the wrists. No badge, lanyard, scrubs or white coat.`;
const identities=rows.map(([intendedAge,compatibleSexLabel,build,skin,hair,accessory,outfit],index)=>{
  const number=String(index+1).padStart(3,'0'),dir=resolve(tool,'prompts',number);mkdirSync(dir,{recursive:true});
  const c={number,stableId:'patient-gapfill-v6c.'+number,category:'patient',roleLabel:'Patient',intendedAge,compatibleSexLabel,ageBand:intendedAge<45?'adult':'older_adult',visualBrief:{build,skin,hair,accessory,outfit},visualOnly:true,glasses:[2,6,10,13].includes(index+1),mobilityAid:number==='007'?'left-hand-cane':null,hearingAid:number==='003'?'right-ear':number==='014'?'left-ear':null};
  for(const [stage,t]of templates.entries()){
    assert(t.includes(describe(old)));let prompt=t.replace(describe(old),describe(c)).replaceAll('GS026','accepted v6a/v6b');
    if(stage===1)prompt=prompt.replace('Sleeves remain full-length to wrists;', 'All eight figures, INCLUDING the bottom-right seated NORTH/rear figure, have full-length sleeves to the wrists, with BOTH elbows and forearms fully covered in sleeve fabric and only hands showing skin. Sleeves remain full-length to wrists;');
    if(c.intendedAge>=65)prompt+=`\nAge and dignity: this is visibly a ${c.intendedAge}-year-old older adult, not a young person with recolored hair. Preserve the accepted rounded game proportions and large eyes, while using subtle crow's-feet, gentle cheek and mouth lines, age-appropriate hair density, and ${c.intendedAge>=80?'a gently forward but balanced relaxed posture':'a comfortable relaxed posture'}. Warm, capable, calm expression; no caricature, frailty stereotype or exaggerated wrinkles. Appearance and accessories have no diagnostic meaning.`;
    if(!c.glasses)prompt+='\nNo eyeglasses in any view. Keep the specified hair silhouette, not the reference\'s gray curls; do not copy its rose cardigan, sage trousers or identity.';
    else prompt+='\nThe specified hairstyle is straight and smooth, never a gray curly crop. Keep its exact silhouette and the specified glasses in every appropriate view.';
    if(number==='007'){
      prompt=prompt.replace('arms relaxed at the sides.','right arm relaxed at the side, left hand holding the cane.').replace('hands naturally on thighs, feet flat','right hand naturally on a thigh, left hand on the cane handle, feet flat').replace('props, devices','props other than the described cane, devices').replace('equipment, held props','equipment other than the described cane, other held props');
      prompt+='\nMobility-aid continuity: a single simple dark-brown cane with cream curved handle remains in the anatomical LEFT hand in every view, its tip on the same floor line as the shoes. In seated views it stays upright beside the left knee. South/front: SCREEN RIGHT. North/rear: SCREEN LEFT. The true west profile may occlude it. Do not duplicate it or switch hands. The cane is visual only and is not tied to a diagnosis.';
    }
    if(c.hearingAid){prompt=prompt.replace('props, devices','props, devices other than the specified hearing aid').replace('equipment, held props','equipment other than the specified hearing aid, held props');prompt+='\nThe hearing aid is tiny, unbranded and attached closely behind the specified ear only; it may be naturally hidden by hair or the far profile. Do not add another device, wires or clinical meaning.';}
    writeFileSync(resolve(dir,stage===0?'stage1-standing-cardinals.prompt.txt':'stage2-eight-pose.prompt.txt'),prompt);
  }
  return {...c,stage1:{prompt:`prompts/${number}/stage1-standing-cardinals.prompt.txt`,references:[style]},stage2:{prompt:`prompts/${number}/stage2-eight-pose.prompt.txt`,references:[style,{path:`sources/${number}/stage1-standing-cardinals.png`,role:'identity-outfit-reference'}]},status:'planned-for-manager-review;not-approved;not-runtime-integrated'};
});
const audit='tools/character-mapping/future-roster20-v5/analysis/coverage-audit.json';
const roster={schemaVersion:'patient-gapfill-v6c-roster/v1',cohort:'patient-gapfill-v6c',programPlan:'docs/execplans/character-gapfill-v6-20261007.md',allocation:{Female:{older_adult:7,adult:2},Male:{older_adult:8,adult:2}},glasses:{planned:4,batchSize:19,maximum:5},coverageAudit:{path:audit,sha256:hash(resolve(repo,audit)),use:'Historical gap metric; this batch follows the exact manager v6c allocation.'},identities};
assertRoster(roster);assert.equal(identities.filter(c=>c.glasses).length,4);assert(identities.filter(c=>c.ageBand==='older_adult').every(c=>c.intendedAge>=65&&c.intendedAge<=88));
writeFileSync(resolve(tool,'roster.json'),JSON.stringify(roster,null,2)+'\n');
console.log(JSON.stringify({status:'PASS',identities:19,prompts:38,plannedGlasses:4,maximumGlasses:5,template:'accepted v6a.001 structure and v6a.004 direct source anchor used by accepted v6b',toolMode:'built-in-image_gen'}));
