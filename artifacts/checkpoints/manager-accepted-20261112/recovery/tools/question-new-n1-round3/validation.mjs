import fs from 'node:fs';import {createHash} from 'node:crypto';
const dir='.local-dev/question-new-n1-round3-20261104';
const read=p=>{const b=fs.readFileSync(p);return(b[0]===255&&b[1]===254?b.toString('utf16le').slice(1):b.toString('utf8')).replace(/\x1b\[[0-9;]*m/g,'');};
const names=['clinical-focused','clinical-full','domain-focused','domain-integration','domain-integration-final','domain-owned-final','domain-full','player-full-native','lint-tests','typecheck','typecheck-final','typecheck-handoff','clinical-final'];
const suites=[];
for(const name of names){
 const logPath=`${dir}/${name}.log`;if(!fs.existsSync(logPath))continue;
 const s=read(logPath),lines=s.split(/\r?\n/),exitPath=`${dir}/${name}.exit.txt`;
 const summaries=lines.filter(l=>/^\s*(Test Files|Tests |Snapshots |Duration |Start at |# tests|# pass|# fail)/.test(l)||/\b(?:tests 33|pass 33|fail 0)\b/.test(l));
 const starts=[];for(let i=0;i<lines.length;i++)if(/^\s*FAIL\s+/.test(lines[i]))starts.push(i);
 const failures=starts.map((start,i)=>({title:lines[start].trim(),
  context:lines.slice(start,Math.min(starts[i+1]??lines.length,start+12)).join('\n'),
  assertion:lines.slice(start,starts[i+1]??lines.length).find(l=>/^(AssertionError|Error:|TypeError)/.test(l))??null}));
 const row={name,logPath,exitCode:fs.existsSync(exitPath)?Number(read(exitPath).trim()):null,
  complete:fs.existsSync(exitPath),summary:summaries,failures:failures.length,
  ...(name.startsWith('typecheck')?{workspaces:lines.filter(l=>/^> @gamify-surgery\/[^@]+@.* typecheck/.test(l)).map(l=>l.trim())}:{})};
 suites.push(row);if(failures.length)fs.writeFileSync(`${dir}/${name}-failures.json`,JSON.stringify(failures,null,2)+'\n');
}
const snapshot=JSON.parse(fs.readFileSync(`${dir}/broad-inputs-before.json`));
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const changedInputs=Object.entries(snapshot.files).filter(([p,sha])=>!fs.existsSync(p)||hash(p)!==sha).map(([path,beforeSha256])=>({path,beforeSha256,afterSha256:fs.existsSync(path)?hash(path):null}));
const owned=JSON.parse(fs.readFileSync(`${dir}/owned-runtime-inputs-at-broad.json`));
const changedOwnedInputs=Object.entries(owned).filter(([p,sha])=>hash(p)!==sha).map(([path,beforeSha256])=>({path,beforeSha256,afterSha256:hash(path)}));
const report={capturedAt:new Date().toISOString(),suites,broadInputSnapshotAt:snapshot.capturedAt,
 changedInputs,changedOwnedRuntimeInputs:changedOwnedInputs,
 limitation:'Shared working tree; the broad snapshot follows the first clinical start and precedes domain. The witnessed-penetrating-injury context clarification and historical/supply test-scope fixes are separately disclosed; final focused checks repeat. No clinical approval or Level 5 rebind.'};
fs.writeFileSync(`${dir}/validation.json`,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({suites,changedInputs:changedInputs.map(p=>p.path),changedOwnedRuntimeInputs:changedOwnedInputs},null,2));
