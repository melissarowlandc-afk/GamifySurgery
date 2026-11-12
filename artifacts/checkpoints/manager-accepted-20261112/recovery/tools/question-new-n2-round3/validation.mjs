import fs from 'node:fs';
const dir='.local-dev/question-new-n2-round3-ship-gate-20261104';
const read=p=>{const b=fs.readFileSync(p);return(b[0]===255&&b[1]===254?b.toString('utf16le').slice(1):b.toString('utf8')).replace(/\x1b\[[0-9;]*m/g,'').replaceAll('\r\n','\n');};
const names=['clinical-focused','domain-focused','lint-tests','typecheck-initial','domain-focused-final','clinical-full','typecheck-final',
 'clinical-focused-handoff','domain-focused-handoff','clinical-timing-final','domain-inventory-final','domain-full','player-full',
 'clinical-handoff-final','domain-handoff-final','typecheck-handoff-final','clinical-full-final','domain-final-scoped','typecheck-close',
 'clinical-full-close','clinical-final-scoped','boundaries','clinical-close-scoped','domain-close-scoped','typecheck-final-close'];
const results=names.filter(name=>fs.existsSync(`${dir}/${name}.log`)).map(name=>{
 const log=read(`${dir}/${name}.log`),exitPath=`${dir}/${name}.exit.txt`;
 const lines=log.split('\n');const failures=[];
 for(let i=0;i<lines.length;i++)if(/^\s*FAIL\s+/.test(lines[i])){
  const header=[lines[i].trim()];let j=i+1;
  while(j<lines.length&&!/^\s*(?:FAIL|AssertionError|Error:|TypeError|ReferenceError|ZodError|Expected:|Received:|❯|⎯|$)/.test(lines[j])&&header.length<4)header.push(lines[j++].trim());
  failures.push({header:header.join(' '),file:lines[i].trim().split(/\s+/)[1]});
 }
 const byFile=Object.fromEntries([...new Set(failures.map(f=>f.file))].map(file=>[file,failures.filter(f=>f.file===file).length]));
 return {name,log:`${dir}/${name}.log`,exitCode:fs.existsSync(exitPath)?Number(read(exitPath).trim()):null,
  filesSummary:lines.filter(l=>/^\s*Test Files\s/.test(l)).at(-1)?.trim()??null,
  testsSummary:lines.filter(l=>/^\s*Tests\s/.test(l)).at(-1)?.trim()??null,
  duration:lines.filter(l=>/^\s*Duration\s/.test(l)).at(-1)?.trim()??null,
  typecheckWorkspaces:lines.filter(l=>/^> @gamify-surgery\/.+ typecheck$/.test(l)).map(l=>l.slice(2)),
  nodeTestSummary:lines.filter(l=>/^[ℹ#]\s*(?:tests|pass|fail|duration_ms)/.test(l)),
  failureCount:failures.length,failuresByFile:byFile,failures,
 };
});
const final={capturedAt:new Date().toISOString(),commands:'Exact commands are printed at the beginning of each native log. All Vitest runs use --pool=threads --maxWorkers=2.',
 clinicalApproval:false,releaseAuthorized:false,results,
 interpretation:{
  clinical:'Early broad runs loaded draft-stage/global-live assumptions and the first version of this lane\'s catalog-stage test. The own stage test, old N2 R2 structural-test import, retained-timing inventory and the attends-story-verb false positive were subsequently repaired without changing frozen question content. The latest full/scoped logs record the resulting failures and passes.',
  domain:'The acceptance contract intentionally rejects old test fixtures that create superseded/unaccepted versions or arbitrary synthetic case IDs. N1 files remain locked. Raw Level 5 binding/history checks remain manager-owned; no rebind or waiver.',
  lint:'The global suite inventories live F02 and expects the unaccepted rewrite to be live. New batch lint is independently zero; do not suppress the restored legacy cue or edit the rewrite lane here.',
  movingTree:'Concurrent batch-2b round-two source-view/timing integration changed shared registries during validation. Full results are receipts from a moving worktree, not a frozen release certificate.',
  optionalBoundaryCheck:'npm test:boundaries was not a requested validation; its internal read-only Git spawn failed with EPERM. No retry, successful Git operation or Git mutation.',
 }};
fs.writeFileSync(`${dir}/validation.json`,JSON.stringify(final,null,2)+'\n');
for(const r of results)console.log(JSON.stringify({name:r.name,exit:r.exitCode,files:r.filesSummary,tests:r.testsSummary,duration:r.duration,
 typechecks:r.typecheckWorkspaces.length,node:r.nodeTestSummary,failuresByFile:r.failuresByFile}));
