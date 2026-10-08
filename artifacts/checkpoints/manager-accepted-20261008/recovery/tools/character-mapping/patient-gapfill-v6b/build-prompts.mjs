import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {repo, tool, hash} from './build-roster.mjs';
const rows = JSON.parse(readFileSync(resolve(tool,'design-rows.json'),'utf8'));
const stylePath='artifacts/character-statics/patient-gapfill-v6a/sources/004/source.png';
const style = {path:stylePath,sha256:hash(resolve(repo,stylePath)),role:'accepted-v6a-style-layout-pose-reference'};
const templates = [1,2].map(n=>readFileSync(resolve(tool,'../patient-gapfill-v6a/prompts/001',n===1?'stage1-standing-cardinals.prompt.txt':'stage2-eight-pose.prompt.txt'),'utf8'));
const old = JSON.parse(readFileSync(resolve(tool,'../patient-gapfill-v6a/roster.json'),'utf8')).identities.find(c=>c.number==='001');
const describe = c => `a ${c.intendedAge}-year-old adult ${c.compatibleSexLabel==='Female'?'woman':'man'} with ${c.visualBrief.skin}, ${c.visualBrief.hair}, ${c.visualBrief.accessory}, and a ${c.visualBrief.build}. They wear ${c.visualBrief.outfit}. All sleeves are full length to the wrists. No badge, lanyard, scrubs or white coat.`;
const identities = rows.map(([intendedAge,compatibleSexLabel,build,skin,hair,accessory,outfit],i)=> {
  const number = String(i+1).padStart(3,'0'), dir = resolve(tool,'prompts',number); mkdirSync(dir,{recursive:true});
  const c={number,stableId:'patient-gapfill-v6b.'+number,category:'patient',roleLabel:'Patient',intendedAge,compatibleSexLabel,ageBand:intendedAge<45?'adult':'middle_aged',visualBrief:{build,skin,hair,accessory,outfit}};
  for (const [i,t] of templates.entries()) {
    let prompt=t.replace(describe(old),describe(c)).replaceAll('GS026','accepted v6a');
    if (i===1) prompt=prompt.replace('Sleeves remain full-length to wrists;', 'All eight figures, INCLUDING the bottom-right seated NORTH/rear figure, have full-length sleeves to the wrists. In that rear seated view BOTH elbows and forearms must be fully covered in sleeve fabric, with only hands showing skin. Sleeves remain full-length to wrists;');
    if(number==='006'){
      prompt=prompt.replace('arms relaxed at the sides.','right arm relaxed at the side, left hand holding the cane.');
      prompt=prompt.replace('hands naturally on thighs, feet flat','right hand naturally on a thigh, left hand on the cane handle, feet flat');
      prompt=prompt.replace('props, devices','props other than the described cane, devices').replace('equipment, held props','equipment other than the described cane, other held props');
      prompt+='\nMobility-aid continuity: the same single simple dark-brown cane with cream curved handle is in the anatomical LEFT hand in all eight views; its tip rests on the same ground line as the shoes. In seated views it remains upright beside the left knee. It may be partly hidden in a true profile, but is never duplicated or moved to the other hand. The cane is visual only; do not add a diagnosis, bandage, wheelchair or other equipment.';
      if(i===1)prompt+=' South/front views: the cane is at SCREEN RIGHT. North/rear views: the cane MUST be at SCREEN LEFT, with the left hand holding its handle. Correct this orientation from the standing identity reference if necessary.';
    }
    writeFileSync(resolve(dir,i===0?'stage1-standing-cardinals.prompt.txt':'stage2-eight-pose.prompt.txt'),prompt);
  }
  return {...c,stage1:{prompt:`prompts/${number}/stage1-standing-cardinals.prompt.txt`,references:[style]},stage2:{prompt:`prompts/${number}/stage2-eight-pose.prompt.txt`,references:[style,{path:`sources/${number}/stage1-standing-cardinals.png`,role:'identity-outfit-reference'}]},status:'planned-for-manager-review;not-approved;not-runtime-integrated'};
});
const audit = 'tools/character-mapping/future-roster20-v5/analysis/coverage-audit.json';
writeFileSync(resolve(tool,'roster.json'),JSON.stringify({schemaVersion:'patient-gapfill-v6b-roster/v1',cohort:'patient-gapfill-v6b',programPlan:'docs/execplans/character-gapfill-v6-20261007.md',allocation:{Female:{middle_aged:7,adult:3},Male:{middle_aged:6,adult:4}},coverageAudit:{path:audit,sha256:hash(resolve(repo,audit)),use:'Historical gap metric; this batch follows the manager program plan allocation.'},identities},null,2)+'\n');
console.log(JSON.stringify({status:'PASS',identities:identities.length,prompts:identities.length*2,template:'accepted v6a.001 structure; accepted v6a.004 direct style anchor',toolMode:'built-in-image_gen'}));
