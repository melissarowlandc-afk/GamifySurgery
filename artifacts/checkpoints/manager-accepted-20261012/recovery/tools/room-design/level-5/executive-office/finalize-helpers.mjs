// Correct capture ownership for the Executive's different corner furniture.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
for(const file of ['proof/capture.cjs','proof/inspect-native.mjs']){const p=path.join(root,file);let s=fs.readFileSync(p,'utf8');s=s.replaceAll("['shelf-door',{doors:['N1']}]","['shelf-door',{doors:['N3']}]").replaceAll("['accent-door',{doors:['EA']}]","['accent-door',{doors:['WA']}]").replaceAll("['shelf-door',{doors:new Set(['N1'])}]","['shelf-door',{doors:new Set(['N3'])}]").replaceAll("['accent-door',{doors:new Set(['EA'])}]","['accent-door',{doors:new Set(['WA'])}]");
 if(file.endsWith('capture.cjs'))s=s.replace("['decor-door',{doors:['N2']}]]","['decor-door',{doors:['N2']}],['window-door',{doors:['N4']}]]").replace('50 browser room states','55 browser room states');
 else s=s.replace("['accent-door',{doors:new Set(['WA'])}]]","['accent-door',{doors:new Set(['WA'])}],['window-door',{doors:new Set(['N4'])}]]").replace('45 actual-render states','50 actual-render states');
 fs.writeFileSync(p,s);
}
const browser=path.join(root,'proof/validate-browser.cjs');let s=fs.readFileSync(browser,'utf8');s=s.replace("assert.deepEqual(manifest.appearanceLevels,[1]);","assert.deepEqual(manifest.appearanceLevels,[1]);assert.equal(manifest.appearanceChanges,false);assert.deepEqual(manifest.upgradeLevels,[1,2,3,4,5]);");s=s.replace("assert.ok(!(await inspect()).visible.includes('decor'));","assert.ok(!(await inspect()).visible.includes('decor'));assert.ok(!(await inspect()).visible.includes('art'));");fs.writeFileSync(browser,s);
console.log('HELPERS READY: correct credenza N3 / plant WA / window N4 captures; fixed-appearance browser contract.');
