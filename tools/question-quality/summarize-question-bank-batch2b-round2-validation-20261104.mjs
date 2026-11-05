import fs from 'node:fs';
import crypto from 'node:crypto';
const root='tools/question-quality/question-bank-batch2b-round2-';
const names=['clinical-full','clinical-final','clinical-control','clinical-handoff','clinical-verified','clinical-post','domain-full','domain-focused','domain-handoff','domain-verified','domain-post','player-focused','player-variety','player-full','player-handoff','lint-tests','lint-tests-fixed','lint-tests-verified','author-checks-fixed','author-checks-handoff','author-checks-post','typecheck','typecheck-final','typecheck-handoff','typecheck-verified','typecheck-post','cli-lint','cli-lint-verified'];
const sha=path=>crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');
function read(name){
 const path=root+name+'-20261104.log';if(!fs.existsSync(path))return{path,exists:false,complete:false};
 const b=fs.readFileSync(path),s=b.toString(b[0]===255?'utf16le':'utf8').replaceAll('\uFEFF','').replace(/\x1b\[[0-9;]*m/g,''),lines=s.split(/\r?\n/);
 const summaries=lines.filter(l=>/^\s*(?:Test Files\s|Tests\s|Duration\s)/.test(l)).map(l=>l.trim());
 const summary=lines.findLast(l=>/^\s*Tests\s/.test(l));let counts=null;
 if(summary){counts={total:Number(summary.match(/\((\d+)\)/)?.[1]??0),passed:0,failed:0,skipped:0};for(const[k,word]of [['passed','passed'],['failed','failed'],['skipped','skipped']])counts[k]=Number(summary.match(new RegExp('(\\d+) '+word))?.[1]??0);}
 else if(/ℹ tests \d+/.test(s)){counts=Object.fromEntries(['tests','pass','fail','skipped'].map(k=>[k,Number(s.match(new RegExp('ℹ '+k+' (\\d+)'))?.[1]??0)]));counts={total:counts.tests,passed:counts.pass,failed:counts.fail,skipped:counts.skipped};}
 const files=[];
 for(const l of lines){const m=l.match(/^\s*❯\s+(\S+\.(?:test|spec)\.[jt]sx?)\s+\((\d+) tests?\s*\|\s*(\d+) failed/);if(m)files.push({path:m[1],total:Number(m[2]),failed:Number(m[3])});}
 const failures=[];
 for(let i=0;i<lines.length;i++)if(/^\s*FAIL\s{2}/.test(lines[i])){
  let header=lines[i].trim(),j=i+1;
  while(j<lines.length&&lines[j].trim()&&!/^(?:FAIL\s{2}|AssertionError|Error:|TypeError|ReferenceError|Test timed out|⎯|❯)/.test(lines[j].trim()))header+=' '+lines[j++].trim();
  const next=lines.slice(j,j+15).find(l=>/AssertionError|Error:|TypeError|ReferenceError|Test timed out/.test(l))??'';
  failures.push({header,diagnostic:next.trim().slice(0,800)});
 }
 let workspace=null;const workspaces=[],typeErrors=[];
 for(const l of lines){const m=l.match(/^> (@gamify-surgery\/\S+)@\S+ typecheck/);if(m){workspace=m[1];workspaces.push(workspace);}if(/error TS\d+/.test(l))typeErrors.push({workspace,diagnostic:l.trim()});}
 return{path,exists:true,sha256:sha(path),complete:counts!==null||(name.startsWith('typecheck')&&workspaces.length===7),summaries,counts,failedFiles:files,failures,...(name.startsWith('typecheck')?{workspaces,typeErrors,passedWorkspaces:workspaces.filter(w=>!typeErrors.some(e=>e.workspace===w)),failedWorkspaces:[...new Set(typeErrors.map(e=>e.workspace))]}:{})};
}
const reports=Object.fromEntries(names.map(name=>[name,read(name)]));
const result={policy:'Exact native log outputs in separate windows. Preliminary runs precede the final author deletion/distractor/physiology fixes and must not be presented as final gates. No outside-lane implementation, assertion, timeout, Level5 evidence or save is changed to obtain a green result.',reports};
fs.writeFileSync(root+'validation-summary-20261104.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(reports).filter(([,r])=>r.exists).map(([k,r])=>[k,{complete:r.complete,counts:r.counts,failedFiles:r.failedFiles,...(r.workspaces?{passedWorkspaces:r.passedWorkspaces,failedWorkspaces:r.failedWorkspaces}:{})}]))));
