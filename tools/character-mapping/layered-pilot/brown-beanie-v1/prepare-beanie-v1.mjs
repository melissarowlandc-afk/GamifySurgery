import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { LAYER_ORDER } from '../../standard-atlas/schema-v1.mjs';
import { validateCharacterAtlasV1 } from '../../standard-atlas/validate-atlas-v1.mjs';
import { RIG } from './beanie-rig-v1.mjs';

// One entrypoint imports all five immutable v1 pages from pinned source art.
await import('./prepare-core-v1.mjs');
await import('./prepare-lower-v1.mjs');
await import('./prepare-actions-v1.mjs');
const root=import.meta.dirname,assets=resolve(root,'assets'),core=JSON.parse(readFileSync(resolve(assets,'core-parts-v1.json'),'utf8')),lower=JSON.parse(readFileSync(resolve(assets,'lower-parts-v1.json'),'utf8')),actions=JSON.parse(readFileSync(resolve(assets,'action-parts-v1.json'),'utf8'));
const pages=Object.fromEntries(Object.entries({...core.pages,lower:lower.page,...actions.pages}).map(([name,page])=>[name,{file:`assets/${page.file.split(/[\\/]/).at(-1)}`,sha256:page.sha256}]));
const manifest={schemaVersion:'character-atlas/v1',characterId:'patient.adult.043.brown-beanie-v1',capabilities:{sitting:true,clipboard:true},pages,parts:{...core.parts,...lower.parts,...actions.parts},fallbacks:actions.fallbacks,accessoryPolicy:{},layerOrder:LAYER_ORDER,sourceLineage:{original:core.source,upperGeneration:core.generatedUpper,lower:lower.sourceLineage,actions:actions.sourceLineage,prompts:'assets/generation-prompts.md'},profile:RIG,garment:{sleeveLength:'long',wristCuffOwner:'forearmHand',elbowUnderlapOwner:'upperArm'}};
const validated=await validateCharacterAtlasV1(manifest,{root});
const bytes=Buffer.from(`${JSON.stringify(manifest,null,2)}\n`),sha=createHash('sha256').update(bytes).digest('hex');writeFileSync(resolve(root,'manifest-v1.json'),bytes);
console.log(JSON.stringify({status:validated.ok?'PASS':'FAIL',manifestSha256:sha,pages:Object.fromEntries(Object.entries(pages).map(([k,v])=>[k,v.sha256])),partCount:Object.keys(manifest.parts).length}));
