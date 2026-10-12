const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
for (const file of ['validate-browser.cjs', 'capture.cjs', 'browser-errors.cjs']) new vm.Script(fs.readFileSync(path.join(__dirname, file), 'utf8'), { filename: file });
const playwright = require.resolve('@playwright/test');
fs.writeFileSync(path.join(__dirname, 'evidence/v3/browser-helper-syntax.json'), JSON.stringify({ status: 'PASS', files: ['validate-browser.cjs', 'capture.cjs', 'browser-errors.cjs'], playwright, browserExecution: 'separate; not claimed by syntax check' }, null, 2) + '\n');
console.log('BROWSER HELPERS READY: syntax PASS; installed Playwright resolves; browser execution separate.');
