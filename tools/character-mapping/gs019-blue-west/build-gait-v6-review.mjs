import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const repo=path.resolve(import.meta.dirname,'../../..'),candidateRoot=path.join(repo,'artifacts/character-movement/gs019-blue-west/whole-body-candidate-v6'),reviewRoot=path.join(candidateRoot,'review'),manifestFile=path.join(candidateRoot,'manifest.json'),phases=['01','02','03','04','05','06','07','08'];
const manifest=JSON.parse(readFileSync(manifestFile,'utf8')),standingFile=path.join(repo,manifest.pins.approvedStanding.file),westFiles=phases.map(phase=>path.join(candidateRoot,manifest.frames[phase].file)),eastFiles=phases.map(phase=>path.join(candidateRoot,manifest.eastFrames[phase].file));
for(const file of[manifestFile,standingFile,...westFiles,...eastFiles])if(!existsSync(file))throw new Error(`missing review input: ${file}`);
const sha256=value=>createHash('sha256').update(value).digest('hex'),relative=file=>path.relative(repo,file).replaceAll('\\','/'),dataUrl=(file,type='png')=>`data:image/${type};base64,${readFileSync(file).toString('base64')}`;
const makePayload=(extension='png',files={standing:standingFile,west:westFiles,east:eastFiles})=>({cadenceMs:180,phases,standing:dataUrl(files.standing,extension),west:files.west.map(file=>dataUrl(file,extension)),east:files.east.map(file=>dataUrl(file,extension))});
const template=readFileSync(path.join(import.meta.dirname,'gait-v6-review-template.html'),'utf8'),render=payload=>template.replace('__GS019_BLUE_V6_PAYLOAD__',JSON.stringify(payload));
let payload=makePayload(),encoding='png',encodedAssets=null;
if(Buffer.byteLength(render(payload))>=1_000_000){
  const encodedRoot=path.join(reviewRoot,'lossless-webp');mkdirSync(encodedRoot,{recursive:true});
  const encode=(source,name)=>{const target=path.join(encodedRoot,`${name}.webp`),program="from PIL import Image; import sys; original=Image.open(sys.argv[1]).convert('RGBA'); original.save(sys.argv[2], format='WEBP', lossless=True, exact=True, method=6); assert original.tobytes()==Image.open(sys.argv[2]).convert('RGBA').tobytes()";execFileSync('python',['-c',program,source,target],{stdio:'pipe'});return target;};
  encodedAssets={standing:encode(standingFile,'standing-west'),west:westFiles.map((file,index)=>encode(file,`west-${phases[index]}`)),east:eastFiles.map((file,index)=>encode(file,`east-${phases[index]}`))};payload=makePayload('webp',encodedAssets);encoding='lossless-webp';
}
const html=render(payload);if(Buffer.byteLength(html)>=1_000_000)throw new Error(`review fragment remains over 1MB: ${Buffer.byteLength(html)} bytes`);mkdirSync(reviewRoot,{recursive:true});const reviewFile=path.join(reviewRoot,'blue-walk-v6-review.html');writeFileSync(reviewFile,html);
const pin=file=>({file:relative(file),sha256:sha256(readFileSync(file))});
const pins={schemaVersion:'gs019-blue-west/review-v6',review:{file:relative(reviewFile),sha256:sha256(html),bytes:Buffer.byteLength(html),encoding},inputs:{manifest:pin(manifestFile),standing:pin(standingFile),west:Object.fromEntries(westFiles.map((file,index)=>[phases[index],pin(file)])),east:Object.fromEntries(eastFiles.map((file,index)=>[phases[index],pin(file)]))},encodedAssets:encodedAssets&&{standing:pin(encodedAssets.standing),west:Object.fromEntries(encodedAssets.west.map((file,index)=>[phases[index],pin(file)])),east:Object.fromEntries(encodedAssets.east.map((file,index)=>[phases[index],pin(file)]))}};
writeFileSync(path.join(reviewRoot,'input-pins.json'),JSON.stringify(pins,null,2)+'\n');console.log(JSON.stringify({status:'PASS',review:relative(reviewFile),bytes:Buffer.byteLength(html),encoding},null,2));
