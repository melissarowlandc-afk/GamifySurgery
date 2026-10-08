// Review-only exact composites, never character drawing or repainting.
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createCanvas} from '@napi-rs/canvas';
import {loadCanvas} from '../gs026-employee-expansion-v1/pipeline.mjs';
import {repo,root,hash,rel,verifyRuntimeBaseline} from './build-roster.mjs';
verifyRuntimeBaseline();
const directory=resolve(root,'review/manager');mkdirSync(directory,{recursive:true});
const comparisons=[],styleBoards=[],darkBoards=[];
for(const [cohort,selected]of [
  ['patient-gapfill-v6a',[['004','001'],['005','003'],['007','005'],['008','007'],['013','009'],['015','011'],['018','013']]],
  ['patient-gapfill-v6b',[['006','002'],['008','004'],['011','006'],['012','008'],['016','010'],['019','012'],['014','014']]]
]){
  const board=createCanvas(1120,688),ctx=board.getContext('2d');ctx.fillStyle='#eee9df';ctx.fillRect(0,0,1120,688);ctx.imageSmoothingEnabled=false;
  for(const [i,[oldNumber,newNumber]]of selected.entries()){
    const oldFile=resolve(repo,'artifacts/character-statics',cohort,'packages',oldNumber,'stand-south.png'),newFile=resolve(root,'packages',newNumber,'stand-south.png');
    ctx.drawImage(await loadCanvas(oldFile),i*160,0);ctx.drawImage(await loadCanvas(newFile),i*160,344);
    ctx.fillStyle='#20252b';ctx.font='12px sans-serif';ctx.fillText(cohort.slice(-3)+'.'+oldNumber,i*160+8,334);ctx.fillText('v6d.'+newNumber,i*160+8,678);
    comparisons.push({acceptedReference:{path:rel(oldFile),sha256:hash(oldFile)},candidate:{path:rel(newFile),sha256:hash(newFile)}});
  }
  const file=resolve(directory,cohort.slice(-3)+'-top-v6d-bottom.png');writeFileSync(file,board.toBuffer('image/png'));styleBoards.push({path:rel(file),sha256:hash(file)});
}
const staging=JSON.parse(readFileSync(resolve(root,'staging-registry.json'),'utf8'));
for(let start=0;start<staging.entries.length;start+=4){
  const rows=staging.entries.slice(start,start+4),c=createCanvas(1280,Math.ceil(rows.length/2)*640),ctx=c.getContext('2d');ctx.fillStyle='#20252b';ctx.fillRect(0,0,c.width,c.height);ctx.imageSmoothingEnabled=false;
  for(const [i,entry]of rows.entries())ctx.drawImage(await loadCanvas(resolve(root,'packages',entry.number,'full-poses-dark.png')),(i%2)*640,Math.floor(i/2)*640);
  const file=resolve(directory,'normalized-dark-'+rows[0].number+'-'+rows.at(-1).number+'.png');writeFileSync(file,c.toBuffer('image/png'));darkBoards.push({identities:rows.map(c=>c.number),proof:{path:rel(file),sha256:hash(file)}});
}
const manifest={schemaVersion:'staff-gapfill-v6d-style-review/v1',scope:'Accepted v6a/v6b above and all fourteen v6d candidates below on identical 160x320 canvases. Four dark pose boards show all 112 poses. Review-only compositing of unchanged PNGs.',styleBoards,comparisons,darkBoards,managerAcceptance:'pending'};
writeFileSync(resolve(directory,'style-review-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const local=path=>path.split('/').pop();
writeFileSync(resolve(directory,'index.html'),'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>v6d accepted style and all poses</title><style>body{margin:16px;background:#eee9df;color:#20252b;font:15px system-ui}img{display:block;width:100%;height:auto}a{color:#0645ad}</style></head><body><a href="../index.html">Main gallery</a><h1>Accepted style and all 112 poses</h1><p>Accepted v6a/v6b above, v6d staff below; identical native canvas geometry. Additional dark boards show every normalized pose. Worker QA only; manager acceptance pending.</p>'+styleBoards.map(c=>'<img src="'+local(c.path)+'" alt="Accepted patient cohort above and new staff below">').join('')+darkBoards.map(c=>'<p>'+c.identities.join(', ')+'</p><img src="'+local(c.proof.path)+'" alt="All eight normalized poses for '+c.identities.join(', ')+'">').join('')+'</body></html>');
verifyRuntimeBaseline();console.log(JSON.stringify({status:'PASS',sameScaleAcceptedPatientStaffPairs:14,styleBoards:2,normalizedDarkPoseBoards:4,posesShown:112}));
