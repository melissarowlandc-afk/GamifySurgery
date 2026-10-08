// Current owner-direction receipt; generated only within the private MRI proof.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),read=f=>JSON.parse(fs.readFileSync(path.join(here,f),'utf8'));
const m=read('../assets/prepared/metadata.json'),p=read('proof-manifest.json'),v=read('evidence/validation-report.json'),room=p.revisedLayout;
const receipt={status:'candidate_needs_owner_review',approval:null,runtimeIntegration:false,privateRevision:p.privateRevision,ownerDirection:p.ownerDirection,records:room.records,solids:room.solids,procedural:room.procedural,supports:room.supports,actorSourceHashes:p.actorHashes,patientRegistration:v.core.patientContact,patientSilhouette:v.core.patientSilhouette,seatedPainter:v.core.seatedPainter,northTech:v.core.northTech,bedEntry:v.core.bedEntry,standingApproaches:v.core.supportPaths,validationStatus:v.status,pendingGeometry:v.geometry};
fs.writeFileSync(path.join(here,'registration-contract.json'),JSON.stringify(receipt,null,2)+'\n');
const source=read('../assets/source-integrity.json'),rows=Object.entries(m.assets).map(([id,s])=>'| '+id+' | '+s.canvas.join(' × ')+' | ['+s.source+'](../assets/'+s.source+') | '+(s.measuredRiseProofPixels?.toFixed(3)??'—')+' |').join('\n');
const text=[
'# MRI candidate — north-facing tech and foreground patient',
'Owner review pending. Latest [owner direction](../OWNER_REVISIONS_2026-10-07.md) supersedes operator-east and patient-behind-scanner. The desk is uniformly20% larger. Existing tech sits SOUTH of it facing NORTH on a matching rear-view chair. Existing patient sits WEST at the outer cushion with feet beyond the bed end, and draws IN FRONT of both bed and scanner.',
'Open [MRI proof](http://127.0.0.1:4191/tools/room-design/level-4/mri/proof/index.html). Review origin4191 has no campaign storage. Owner game remains START_GAME.cmd → http://127.0.0.1:4173 in the usual profile; game/saves are unchanged. No runtime integration, release or deployment.',
'## Reproduce',
'Run from the repository root using existing Node, @playwright/test and Chrome, stopping on failure:',
'~~~text\nnode tools/room-design/level-4/mri/assets/prepare-assets.mjs\nnode tools/room-design/level-4/mri/proof/build.mjs\nnode tools/room-design/level-4/mri/proof/validate.cjs\nnode tools/room-design/level-4/mri/proof/capture.cjs\nnode tools/room-design/level-4/mri/proof/write-report.mjs\n~~~',
'## Artwork and presentation',
'Nine genuine-alpha assets. '+source.originalCount+' original/prompt pairs are preserved and hash-verified. New rear-view chair uses builtin image_gen, originals/operator-chair-03.png, with exact prompt saved. All other sources, including the empty bed, remain unchanged. Browser Canvas crops alpha bounds, uniformly fits and pads; source bytes and actor scale/anchors are frozen. Native floor anchors use the edge below the last alpha≥160 opaque foot row. Minimum transparent clearance4px; larger padding remains a candidate exception.',
'| Asset | Native frame | Original | Physical rise at120px/tile |\n| --- | --- | --- | --- |\n'+rows,
'Private bed ground moves east to(2.49,2.42). It draws after the scanner, with its east forepart clipped at the measured bore CENTER; this hides the section inside the casing without repainting the source. The bed cushion edge and bore share a world-height landmark. The patient uses the exact original hip anchor on the outer west cushion and an explicit foreground painter depth, separate from physical ground. Actual shoe alpha extends west of the bed. No generated patient is loaded.',
'Tech uses the original sit.north source at unchanged scale; desk center(1.12,2.14), chair/tech ground(1.12,2.54). Rear worktop96px follows the owner-requested uniform desk enlargement; projected front lip is measured separately. Baseline39.6px and comparison45px support retain existing character contact differences; no pose/scale correction is hidden.',
'## Validation and evidence',
'Focused validator PASS '+v.checks.length+' checks: '+v.core.doorStates+'door/backing states, '+v.core.routes+'coarse routes, '+v.core.routePoints+'actual-base walking samples and '+v.core.supportApproachSamples+'standing approaches. All nine native/alpha/ground/source checks, all16 doors/backings/restore, north-facing tech position, patient hip/feet/foreground, bed-center entrance, keyboard and320px layout pass. Browser errors:'+v.errors.length+'. Standing approaches stop before seating and keep radius/solid checks; seated axes are separate endpoints.',
'[Seated scan](evidence/mri-scan-seated-west.png), [closed backed](evidence/mri-closed-backed.png), [all doors](evidence/mri-all-doors.png), [contacts](evidence/mri-contacts.png), [320px](evidence/mri-320.png), [validation report](evidence/validation-report.json), [registration](registration-contract.json). Current source/prepared/actor hashes are in proof-manifest.json, prepared/metadata.json and assets/source-integrity.json.',
'Previous complete candidate preserved in [v6 history](history/v6-west-tech-seated-patient/README.md). Its worker/diff/reproduction receipts describe that historical milestone. Current ownership and revision receipts describe this directly implemented revision.',
'Candidate limits: portrait MRI proportions, padded frames, existing tech contact residual, simplified patient pose and static seating. Projected2D alpha bands supplement declared solids without proving physical depth. These are software-art measurements, not clinical claims. Design approval remains pending.',
'LOCAL ONLY. Say "push to GitHub" for a scoped audited backup.'
].join('\n\n')+'\n';
fs.writeFileSync(path.join(here,'README.md'),text);
console.log('REPORT current north-tech/bed-center/foreground-patient candidate');
