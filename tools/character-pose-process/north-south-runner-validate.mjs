#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RUN_DIR, guardPath, sha256, validateOffline, writeExclusive } from './north-south-runner-lib.mjs';

const toolsDir=import.meta.dirname;
const testPath=join(toolsDir,'north-south-runner.test.mjs');
const files=['north-south-runner-lib.mjs','north-south-runner.mjs','north-south-runner.test.mjs','north-south-runner-validate.mjs','north-south-runner-README.md'].map(n=>join(toolsDir,n));

export function parseObservedTap(stdout,status){
  if(status!==0)throw new Error(`focused tests failed with status ${status}`);
  const take=name=>{const m=stdout.match(new RegExp(`^# ${name} (\\d+)$`,'m'));return m?Number(m[1]):null;};
  const result={tests:take('tests'),passed:take('pass'),failed:take('fail')};
  if(!Number.isInteger(result.tests)||result.tests<=0||result.passed!==result.tests||result.failed!==0)throw new Error(`invalid or unsuccessful observed TAP totals: ${JSON.stringify(result)}`);
  return result;
}
function runTests(){guardPath(testPath);const child=spawnSync(process.execPath,['--test','--test-reporter=tap',testPath],{cwd:resolve(toolsDir,'../..'),encoding:'utf8'});if(child.error)throw child.error;const observed=parseObservedTap(child.stdout,child.status);return{command:`${process.execPath} --test --test-reporter=tap ${testPath}`,status:child.status,stdout:child.stdout,stderr:child.stderr,observed};}
function checksumEntries(extra=[]){const paths=[...files,join(RUN_DIR,'run-manifest.json'),join(RUN_DIR,'ledger.json'),...extra];return paths.sort().map(path=>{guardPath(path);const bytes=readFileSync(path);return{path:resolve(path).replaceAll('\\','/'),bytes:bytes.length,sha256:sha256(bytes)};});}
export function validatePackage({sealedTapPath=null}={}){const offline=validateOffline();let focusedTests=null;if(sealedTapPath){guardPath(sealedTapPath);const stdout=readFileSync(sealedTapPath,'utf8');focusedTests={status:0,observed:parseObservedTap(stdout,0),receiptSha256:sha256(stdout)};}return{schemaVersion:1,state:'offline-prepared-unexecuted',validatedAt:null,offline,focusedTests,networkCalls:0,claims:{jobSubmitted:false,outputsDownloaded:false,privateArtProcessed:false,syntheticMechanicsReviewed:false,savingsMeasured:false}};}
function seal(){
  for(const p of files)guardPath(p);guardPath(RUN_DIR);const tapPath=join(RUN_DIR,'focused-tests-v1.tap'),reportPath=join(RUN_DIR,'offline-validation-v1.json'),checksumsPath=join(RUN_DIR,'offline-checksums-v1.json');
  for(const p of [tapPath,reportPath,checksumsPath])guardPath(p,{mayNotExist:true});
  if([tapPath,reportPath,checksumsPath].some(existsSync))throw new Error('v1 seal evidence already exists; refusing overwrite');
  const tests=runTests();writeExclusive(tapPath,Buffer.from(tests.stdout));
  const report=validatePackage({sealedTapPath:tapPath});report.validatedAt=new Date().toISOString();report.focusedTests={...report.focusedTests,command:tests.command,status:tests.status,stderr:tests.stderr};
  writeExclusive(reportPath,Buffer.from(`${JSON.stringify(report,null,2)}\n`));
  const entries=checksumEntries([tapPath,reportPath]);const checksum={schemaVersion:1,state:'offline-sealed-unexecuted',createdAt:report.validatedAt,excludedSelf:'offline-checksums-v1.json',entryCount:entries.length,entries};
  writeExclusive(checksumsPath,Buffer.from(`${JSON.stringify(checksum,null,2)}\n`));return{reportPath,checksumsPath,testReceipt:report.focusedTests,entryCount:entries.length};
}

if(resolve(process.argv[1]??'')===resolve(fileURLToPath(import.meta.url))){const args=process.argv.slice(2);if(args.length>1||(args.length===1&&args[0]!=='--seal-v1'))throw new Error('usage: node north-south-runner-validate.mjs [--seal-v1]');if(args[0]==='--seal-v1')process.stdout.write(`${JSON.stringify(seal(),null,2)}\n`);else{const tap=join(RUN_DIR,'focused-tests-v1.tap');process.stdout.write(`${JSON.stringify(validatePackage({sealedTapPath:existsSync(tap)?tap:null}),null,2)}\n`);}}
