// Copy the approved exam proof pattern into this isolated worker lane.
// Run once; later edits are made to this lane's copies. No approved file is changed.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),template=path.join(here,'../../pediatric-exam/proof');
if(fs.existsSync(path.join(here,'build.mjs')))throw Error('Scaffold already created; preserve this lane and use build.mjs for rebuilds.');
const read=f=>fs.readFileSync(path.join(template,f),'utf8').replaceAll('\r\n','\n'),write=(f,s)=>fs.writeFileSync(path.join(here,f),s,'utf8');
let geometry=read('geometry.mjs').replaceAll('pediatricPresentation','woundPresentation').replace('state={parents:true,children:true,clinicians:true}','state={patients:true,clinicians:true}');
geometry=geometry.replace("approach:[1.5,.6],world:[1.5,.6]","approach:model.careApproach,world:model.careApproach");write('geometry.mjs',geometry);
let build=read('build.mjs').replaceAll('pediatricPresentation','woundPresentation').replaceAll('pediatric-exam','wound-ostomy');
const frontStart=build.indexOf('const frontManifest='),frontEnd=build.indexOf('room.notes=',frontStart);
if(frontStart<0||frontEnd<0)throw Error('Template front-wood marker missing');
build=build.slice(0,frontStart)+`const backless=read('../assets/reused/stool-contract.json'),stoolRecord=room.records.find(r=>r.id==='stool'),backlessFile=path.resolve(here,'../assets/reused',backless.file);
if(sha(backlessFile)!==backless.outputSha256)throw Error('Reused native backless stool changed');
stoolRecord.sourceRect=[0,0,...backless.canvas];
assets[stoolRecord.assetId]={...assets[stoolRecord.assetId],src:'../assets/reused/'+backless.file,size:backless.canvas,sourceRect:stoolRecord.sourceRect,backless:true,derivationContract:'../assets/reused/stool-contract.json',sha256:backless.outputSha256};
`+build.slice(frontEnd);
const notesStart=build.indexOf('room.notes='),notesEnd=build.indexOf('const shared=',notesStart);
build=build.slice(0,notesStart)+`room.notes=['Painted Wound/Ostomy candidate: patient east on the side-view recliner with its leg rest out; clinician west at the leg end on the backless rolling stool.','Twelve one-tile wall sections use the game model; every section remains a legal door.',...presentation.notes];
`+build.slice(notesEnd);
const registryStart=build.indexOf('const registry='),registryEnd=build.indexOf('for(const r of room.records)',registryStart);
build=build.slice(0,registryStart)+`const registry=JSON.parse(fs.readFileSync(path.join(repo,actorBaseline.registryPath),'utf8'));for(const selected of actorBaseline.characters)if(JSON.stringify(selected)!==JSON.stringify(registry.characters.find(c=>c.id===selected.id)))throw Error('Selected real character metadata changed '+selected.id);
`+build.slice(registryEnd);
build=build.replace('parents: true, children: true, clinicians: true, contacts: false, bases: false,','patients: true, clinicians: true, contacts: false, bases: false,');
build=build.replace('5 native sprites, 2 reused fixtures, approved front armrest, 3 seated identities','5 native sprites, 4 reused fixtures, native backless stool, 2 seated identities');build=build.replace('paintCaps,paintFloor,render};','paintCaps,paintFloor,render,drawImageRec};');write('build.mjs',build);
let ext=read('extension.js').replaceAll("['tgParents','parents'],['tgChildren','children'],", "['tgPatient','patients'],").replaceAll('parents:true,children:true,','patients:true,').replace("p:'parents',k:'children',","p:'patients',");
const a=ext.indexOf('function contactText()'),b=ext.indexOf('function refreshCandidateControls()',a);
ext=ext.slice(0,a)+`function contactText(){return 'Real existing patient sits east on the side-view recliner; the leg rest stays extended.\\nThe clinician sits west at the leg end, entirely above the native backless rolling stool.\\nSolid lines show radius-clear walking; dotted teal links are static seat contacts.\\nTwelve one-tile wall sections use the game model. The frozen west-middle recliner doorway exception is recorded.';}
`+ext.slice(b);
ext=ext.replace('Five painted pieces - child, clinician and parent - design review pending','Five painted pieces - patient and clinician - design review pending');write('extension.js',ext);
let html=read('index.html').replaceAll('Pediatric examination room','Wound/Ostomy Clinic').replaceAll('Pediatric Examination Room','Wound/Ostomy Clinic').replaceAll('pediatric examination room','Wound/Ostomy Clinic');
html=html.replace('A child sits on the table facing the clinician; a parent stays in the same room.','A patient sits east on the treatment recliner with the leg rest extended; the clinician faces west on the backless rolling stool.');
html=html.replace('<label class="tg"><input type="checkbox" id="tgParents" checked>Parent in armchair</label><label class="tg"><input type="checkbox" id="tgChildren" checked>Child on examination table</label>','<label class="tg"><input type="checkbox" id="tgPatient" checked>Patient on treatment recliner</label>');
html=html.replace('Clinician on rolling stool','Clinician on backless rolling stool').replace('P parents · K child','P patient');write('index.html',html);
let controls=read('validate-controls.mjs').replaceAll('pediatricPresentation','woundPresentation').replace("['tgParents','parents'],['tgChildren','children'],", "['tgPatient','patients'],").replace("['p','parents'],['k','children'],","['p','patients'],");write('validate-controls.mjs',controls);
console.log('SCAFFOLD PASS approved twelve-door proof pattern copied to Wound/Ostomy lane');
