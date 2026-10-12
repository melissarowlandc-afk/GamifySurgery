// Readiness only. Browser execution is the manager's responsibility.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
for(const f of['validate-browser.cjs','capture.cjs','browser-errors.cjs'])new vm.Script(fs.readFileSync(path.join(__dirname,f),'utf8'),{filename:f});
const resolved=require.resolve('@playwright/test'),installed=require('@playwright/test');if(!installed.chromium)throw Error('Installed Playwright Chromium interface unavailable');
fs.writeFileSync(path.join(__dirname,'evidence/v2/helper-readiness.json'),JSON.stringify({status:'PASS',scripts:['validate-browser.cjs','capture.cjs','browser-errors.cjs'],playwright:resolved,browserExecution:'pending manager; worker did not spawn browser'},null,2)+'\n');console.log('BROWSER HELPERS READY: syntax PASS; installed Playwright resolves; browser execution pending manager.');
