import fs from 'node:fs';
import crypto from 'node:crypto';

const prefix='tools/question-quality/question-bank-batch2b-';
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function log(name) {
  const path=prefix+name+'-20261104.log';
  if(!fs.existsSync(path))return {path,exists:false};
  const b=fs.readFileSync(path),text=b.toString(b[0]===255?'utf16le':'utf8').replace(/\x1b\[[0-9;]*m/g,'');
  const lines=text.split(/\r?\n/),summary=lines.filter(s=>/^\s*(Test Files\s|Tests\s|Duration\s|ℹ (tests|pass|fail|duration))/.test(s)).map(s=>s.trim());
  const failures=[];
  for(let i=0;i<lines.length;i++)if(/^\s*FAIL\s{2}/.test(lines[i])) {
    let header=lines[i].trim(),j=i+1;
    while(j<lines.length&&lines[j].trim()&&!/^(FAIL\s{2}|AssertionError|Error:|TypeError|ReferenceError|Test timed out|⎯|❯)/.test(lines[j].trim()))header+=' '+lines[j++].trim();
    // Vitest groups several titles above one diagnostic. Read across that
    // group for the diagnostic without duplicating another test's title.
    while(j<lines.length&&/^\s*FAIL\s{2}/.test(lines[j])) {
      j++;
      while(j<lines.length&&lines[j].trim()&&!/^(FAIL\s{2}|AssertionError|Error:|TypeError|ReferenceError|Test timed out|⎯|❯)/.test(lines[j].trim()))j++;
    }
    failures.push({header,diagnostic:lines[j]?.trim()??''});
  }
  let workspace=null;
  const typeErrors=[],workspaces=[];
  for(const line of lines){
    const m=line.match(/^> (@gamify-surgery\/\S+)@\S+ typecheck/);
    if(m){workspace=m[1];workspaces.push(workspace);}
    if(/error TS\d+/.test(line))typeErrors.push({workspace,line:line.trim()});
  }
  return {path,exists:true,sha256:sha(path),completed:summary.length>0||name.startsWith('typecheck'),summary,failures,...(name.startsWith('typecheck')?{workspaces,typeErrors,passedWorkspaces:workspaces.filter(w=>!typeErrors.some(e=>e.workspace===w)),failedWorkspaces:[...new Set(typeErrors.map(e=>e.workspace))]}:{})};
}
const names=['clinical-full','clinical-handoff','clinical-final-metadata','domain-full','domain-final-focused','domain-repaired','domain-repaired-focused','domain-inventory-isolated','player-focused','player-full','player-isolated','player-performance-isolated','lint-tests-final','typecheck-handoff','typecheck-final','typecheck-repaired','typecheck-post-worker','cli-lint-final'];
const reports=Object.fromEntries(names.map(n=>[n,log(n)]));
const data={generatedAt:new Date().toISOString(),policy:'Exact native outputs from separate input windows. Do not aggregate these into a green shared-tree gate. No assertions, deadlines or outside-lane source are changed by this reader.',reports};
const path=prefix+'validation-summary-20261104.json';
fs.writeFileSync(path,JSON.stringify(data,null,2)+'\n');
console.log(JSON.stringify({path,reports:Object.fromEntries(Object.entries(reports).filter(([,r])=>r.exists).map(([name,r])=>[name,{summary:r.summary,failures:r.failures.length,...(r.workspaces?{passedWorkspaces:r.passedWorkspaces,failedWorkspaces:r.failedWorkspaces}: {})}]))}));
