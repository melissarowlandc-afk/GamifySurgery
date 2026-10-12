// Adapt the copied approved office proof to 4x3 and one fixed base appearance.
// One-time setup only; the real build/validators remain independently rerunnable.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const edit=(file,fn)=>{const p=path.join(root,file);fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')));};
edit('proof/build.mjs',s=>s
 .replace('const id=`l${tier.level}-${p.id}`','const id=`base-${p.spriteSlot??p.id}`')
 .replace('standins.assets.find(a=>a.id===p.id)','standins.assets.find(a=>a.id===(p.spriteSlot??p.id))')
 .replaceAll('imageSmoothingEnabled=true','imageSmoothingEnabled=false')
 .replace('contract.assets[id]={slot:p.id,level:tier.level','contract.assets[id]??={slot:p.id,levels:[1,2,3,4,5]')
 .replace('if(seat){const mc=','if(seat&&room.records.some(r=>r.overlayFor===p.id)){const mc=')
 .replace('appearanceLevels:[1,2,3,4,5]','appearanceLevels:[1],upgradeLevels:[1,2,3,4,5],appearanceChanges:false')
 .replace("footprintStatus:'owner_directed'","footprintStatus:'proposed_needs_owner_review'")
 .replace("moraleMechanic:'undecided'","administrationMechanic:'not_simulated'")
 .replaceAll('Five complete appearances; 33 generated assets and 10 exact-pixel chair foregrounds.','One fixed corporate appearance; 10 generated assets and 2 exact-pixel chair foregrounds; upgrade Levels 1–5 share art.')
 .replaceAll('Morale undecided; browser and owner acceptance are separate.','No administrative mechanic simulated; browser and owner acceptance are separate.')
 .replaceAll('five full appearances','one fixed base appearance, five upgrade selections')
 .replaceAll('5 complete tiers; 33 distinct assets + 10 chair foregrounds; shared 4x3; 12 one-tile doors','1 fixed look / 5 upgrade selections; 10 distinct assets + 2 chair foregrounds; shared 4x3; 14 one-tile doors'));
edit('proof/index.html',s=>s.replace('five appearance levels','fixed base appearance')
 .replace('Five appearance levels','Fixed base appearance at upgrades 1–5')
 .replaceAll('Room appearance level','Upgrade level — appearance stays fixed')
 .replaceAll('appearance level','upgrade level').replaceAll('appearance levels','upgrade levels')
 .replace('Three independent one-tile wall sections.','Four independent one-tile north wall sections.')
 .replace('Executive behind desk','Executive stand-in behind desk')
 .replace('Executive faces south behind the desk; visitor faces north toward the executive.','Executive faces south behind the dual-monitor desk; visitor faces north. Two empty meeting chairs sit at the round table.')
 .replace('Level 1 · Startup','Level 1 · Fixed base appearance')
 .replaceAll('Painted Executive Office','Painted Executive Office base look'));
edit('proof/extension.js',s=>s
 .replace('Both use the same 45 px cushion rise and fixed anchors in all five tiers.','Both use a 45 px cushion rise and fixed anchors at all five upgrade levels.')
 .replace('Twelve one-tile wall sections','Fourteen one-tile wall sections')
 .replace('Real founder.01 faces south behind the desk','Approved founder.01 stand-in faces south as Executive behind the desk')
 .replace("'Level '+state.tier+' of 5 · '+tier.name+' · complete painted appearance · owner approval pending'","'Upgrade level '+state.tier+' of 5 · one fixed base appearance · owner approval pending'")
 .replace('Executive renders behind armrests and desk','Executive stand-in renders behind armrests and desk'));
edit('proof/validate-controls.mjs',s=>s
 .replaceAll('doors().length,12','doors().length,14').replaceAll('backings().length,3','backings().length,4')
 .replaceAll("'doors',12","'doors',14").replaceAll("'backed',3","'backed',4")
 .replaceAll('state.doors.size,12','state.doors.size,14').replaceAll('state.backed.size,3','state.backed.size,4')
 .replaceAll('doorButtons:12,backingButtons:3,appearanceTiers:5','doorButtons:14,backingButtons:4,appearanceTiers:1,upgradeLevels:5')
 .replace('5 tier buttons, 12 door buttons, 3 backing buttons','5 upgrade buttons, 14 door buttons, 4 backing buttons'));
edit('proof/validate-browser.cjs',s=>s
 .replace('manifest.appearanceLevels,[1,2,3,4,5]','manifest.appearanceLevels,[1]')
 .replaceAll("count(),12","count(),14").replaceAll("count(),3","count(),4")
 .replaceAll('5 tier / 12 one-tile door / 3 backing','5 fixed-appearance upgrade / 14 one-tile door / 4 backing')
 .replaceAll('mask<8','mask<16')
 .replace("s.preparedId.startsWith('l'+L.state.tier+'-')","s.preparedId.startsWith('base-')")
 .replace('result.states,112','result.states,256').replace('result.routes,576','result.routes,1344')
 .replace('result.assets.length,[8,9,8,9,9][level-1]','result.assets.length,12')
 .replaceAll("'doors',12","'doors',14").replaceAll("'backed',3","'backed',4")
 .replaceAll('state.doors.length,12','state.doors.length,14').replaceAll('state.backed.length,3','state.backed.length,4')
 .replaceAll('5 tiers; 12 doors; 560 states / 2880 routes','1 fixed look / 5 upgrades; 14 doors; 1280 states / 6720 routes'));
edit('proof/capture.cjs',s=>s.replace('all 5 tiers;','1 fixed look at all 5 upgrades;'));
edit('proof/inspect-native.mjs',s=>s.replace('const sheet=createCanvas(440*5,680)','const sheet=createCanvas(560*5,680)').replaceAll('(t.level-1)*440','(t.level-1)*560').replace('45 actual-render states across 5 tiers','45 actual-render states across 5 fixed-appearance upgrades'));
edit('proof/geometry.mjs',s=>s.replace('Owner-directed shared 4x3','Proposed shared 4x3'));
edit('proof/lab.js',s=>s.replace('Appearance tier must be 1–5','Upgrade level must be 1–5').replaceAll('four on each wall.','four north/south and three west/east.').replaceAll('Proposed 4x4 floor','Proposed 4x3 floor'));
console.log('TOOLCHAIN CONFIGURED: approved renderer/pipeline; fixed base art; 5 upgrade selections; 14 doors / 4 north backing sections.');
