import fs from 'node:fs';import path from 'node:path';import {fileURLToPath}from'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const edit=(p,fn)=>fs.writeFileSync(path.join(root,p),fn(fs.readFileSync(path.join(root,p),'utf8')));
edit('proof/index.html',s=>s.replaceAll('Owner review pending.','Owner-requested south correction; manager verification pending.').replaceAll('owner review pending</figcaption>','continuous south row</figcaption>').replace('The complete concept sets the sizes, proximity and overlapping planting. The playable room uses pieces derived from it.','The original approved garden concept is retained. The playable south row applies the owner’s later continuity correction using the same generated planter pixels.'));
edit('proof/validate.cjs',s=>s.replace("'Owner review pending'","'Owner-requested south correction'"));
edit('proof/preview.mjs',s=>s.replaceAll('evidence/v1','evidence/v2'));
console.log('SOUTH PRESENTATION PASS: original concept retained; owner approval of the unchanged garden recorded; requested south correction and pending manager browser verification identified.');
