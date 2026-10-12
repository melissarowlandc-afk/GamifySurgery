// Preserve the actual blocked browser attempt; make manager-pending status explicit.
const fs=require('node:fs'),path=require('node:path');
const out=path.join(__dirname,'evidence/v4'),p=path.join(out,'browser-validation-report.json');
const existing=fs.existsSync(p)?JSON.parse(fs.readFileSync(p)):null;
if(existing?.status==='PASS')throw Error('Preserve manager browser PASS; do not replace it.');
if(existing?.status==='FAIL')fs.copyFileSync(p,path.join(out,'browser-launch-attempt.json'));
const receipt={status:'PENDING_MANAGER',reason:'Worker Chrome launch attempted and blocked by unelevated sandbox: browserType.launch: spawn EPERM. No browser page was opened or validated.',attemptReceipt:'browser-launch-attempt.json',url:'http://127.0.0.1:4191/tools/room-design/level-5/executive-office/proof/index.html',origin:'http://127.0.0.1:4191',approval:null,runtimeIntegrationAuthorized:false,managerCommands:['node tools/room-design/level-5/executive-office/proof/validate-browser.cjs','node tools/room-design/level-5/executive-office/proof/capture.cjs']};
fs.writeFileSync(p,JSON.stringify(receipt,null,2)+'\n');fs.mkdirSync(path.join(out,'browser'),{recursive:true});fs.writeFileSync(path.join(out,'browser/capture-report.json'),JSON.stringify({...receipt,reason:'Capture script syntax/dependency readiness passes; execution left to manager after shared Chrome spawn EPERM.',attemptReceipt:'../browser-launch-attempt.json'},null,2)+'\n');console.log('BROWSER HANDOFF READY: actual spawn EPERM attempt preserved; validation/captures pending manager; no browser PASS claimed.');
