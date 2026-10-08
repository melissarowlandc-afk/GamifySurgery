import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {repo, tool, hash} from './build-roster.mjs';
const rows = JSON.parse(readFileSync(resolve(tool,'design-rows.json'),'utf8'));
const style = {path:'tools/character-mapping/gs026-employee-expansion-v1/assets/gs026-employee-001-cardinals-v1.png',sha256:'d5d925adfe28ac0b0d72456f52fbfc4e7d2c97452ffa6cf375ce45743be827f6',role:'style-layout-pose-reference'};
const templates = [1,2].map(n=>readFileSync(resolve(tool,'../future-roster20-v5/prompts/018',n===1?'stage1-standing-cardinals.prompt.txt':'stage2-eight-pose.prompt.txt'),'utf8'));
const old = JSON.parse(readFileSync(resolve(tool,'../future-roster20-v5/roster.json'),'utf8')).identities.find(c=>c.number==='018');
const describe = c => `a ${c.intendedAge}-year-old adult ${c.compatibleSexLabel==='Female'?'woman':'man'} with ${c.visualBrief.skin}, ${c.visualBrief.hair}, ${c.visualBrief.accessory}, and a ${c.visualBrief.build}. They wear ${c.visualBrief.outfit}. All sleeves are full length to the wrists. No badge, lanyard, scrubs or white coat.`;
const identities = rows.map(([intendedAge,compatibleSexLabel,build,skin,hair,accessory,outfit],i)=> {
  const number = String(i+1).padStart(3,'0'), dir = resolve(tool,'prompts',number); mkdirSync(dir,{recursive:true});
  const c={number,stableId:'patient-gapfill-v6a.'+number,category:'patient',roleLabel:'Patient',intendedAge,compatibleSexLabel,ageBand:intendedAge<45?'adult':'middle_aged',visualBrief:{build,skin,hair,accessory,outfit}};
  for (const [i,t] of templates.entries()) {
    let prompt=t.replace(describe(old),describe(c));
    if (i===1 && Number(number)>=9) prompt=prompt.replace('Sleeves remain full-length to wrists;', 'All eight figures, INCLUDING the bottom-right seated NORTH/rear figure, have full-length sleeves to the wrists. In that rear seated view BOTH elbows and forearms must be fully covered in sleeve fabric, with only hands showing skin. Sleeves remain full-length to wrists;');
    writeFileSync(resolve(dir,i===0?'stage1-standing-cardinals.prompt.txt':'stage2-eight-pose.prompt.txt'),prompt);
  }
  return {...c,stage1:{prompt:`prompts/${number}/stage1-standing-cardinals.prompt.txt`,references:[style]},stage2:{prompt:`prompts/${number}/stage2-eight-pose.prompt.txt`,references:[style,{path:`sources/${number}/stage1-standing-cardinals.png`,role:'identity-outfit-reference'}]},status:'planned-for-manager-review;not-approved;not-runtime-integrated'};
});
const audit = 'tools/character-mapping/future-roster20-v5/analysis/coverage-audit.json';
writeFileSync(resolve(tool,'roster.json'),JSON.stringify({schemaVersion:'patient-gapfill-v6a-roster/v1',cohort:'patient-gapfill-v6a',programPlan:'docs/execplans/character-gapfill-v6-20261007.md',allocation:{Female:{middle_aged:7,adult:4},Male:{middle_aged:6,adult:3}},coverageAudit:{path:audit,sha256:hash(resolve(repo,audit)),use:'Historical gap metric; this batch follows the manager program plan allocation.'},identities},null,2)+'\n');
console.log(JSON.stringify({status:'PASS',identities:identities.length,prompts:identities.length*2,template:'v5.018 exact established structure',toolMode:'built-in-image_gen'}));
