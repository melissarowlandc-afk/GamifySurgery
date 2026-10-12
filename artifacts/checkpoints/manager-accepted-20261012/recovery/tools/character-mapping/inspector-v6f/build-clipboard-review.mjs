// Bind authored visual observations to exact final sources and all 80 poses.
// This packages manual QA; it does not infer anatomy from pixels or approve art.
import assert from 'node:assert/strict';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {relative, resolve} from 'node:path';
import {directions, hash, rel, repo, root, tool, verifyRuntimeBaseline} from './build-roster.mjs';

verifyRuntimeBaseline();
const json = file => JSON.parse(readFileSync(file, 'utf8'));
const notesFile = resolve(tool, 'worker-review-notes.json');
const notes = json(notesFile), staging = json(resolve(root, 'staging-registry.json'));
assert.equal(notes.reviewer, 'sol-v6f-worker');
assert.equal(staging.entries.length, 10);
const receipt = file => ({path: rel(file), sha256: hash(file)});
const entries = staging.entries.map(entry => {
  const manifestFile = resolve(repo, entry.manifest), m = json(manifestFile);
  assert.equal(m.identity.clipboard.hand, 'right');
  const history = m.provenanceValidation.stage2Chain.map(c => c.source);
  const poses = ['stand', 'sit'].flatMap(pose => directions.map(direction => {
    const p = m.poses[pose][direction], observation = notes.clipboardDirectionObservations[pose + '.' + direction];
    assert(observation && observation.length > 80);
    return {pose, direction, file: p.file, sha256: p.sha256,
      manualAssessment: 'worker-visual-QA-pass-with-recorded-occlusion-limitations',
      clipboardHand: 'right', placement: pose === 'sit' ? 'lap' : 'right-front-waist', observation};
  }));
  return {number: entry.number, id: entry.stableId, source: m.source.stage2.png,
    package: receipt(manifestFile), initialStandingSource: m.source.stage1.png,
    retainedEightPoseSources: history, regenerations: history.length - 1,
    identityNote: notes.identities[entry.number].realizationNote, poses};
});
const result = {schemaVersion: 'inspector-v6f-clipboard-review/v1',
  reviewer: notes.reviewer, reviewMethod: 'manual visual inspection; source and pose hash binding only',
  managerAcceptance: 'pending', runtimeReady: false,
  notes: receipt(notesFile), entries,
  limitations: notes.limitations.slice(0, 2),
  summary: {identities: entries.length, reviewedPoses: entries.reduce((n,e) => n + e.poses.length, 0),
    standingRightSide: 40, seatedLap: 40, targetedEdits: entries.reduce((n,e) => n + e.regenerations, 0),
    nativeGenerationOutputs: entries.reduce((n,e) => n + 1 + e.retainedEightPoseSources.length, 0)}};
const review = resolve(root, 'worker-review'); mkdirSync(review, {recursive: true});
writeFileSync(resolve(review, 'clipboard-review.json'), JSON.stringify(result, null, 2) + '\n');
const htmlFile = resolve(root, 'review/clipboard-review.html');
const link = path => relative(resolve(root, 'review'), resolve(repo, path)).replaceAll('\\', '/');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const cards = entries.map(e => '<article><h2>' + e.id + '</h2><p>' + escape(e.identityNote) + '</p><div class="poses">' + e.poses.map(p =>
  '<figure><img src="' + link(p.file) + '" alt="' + e.id + ' ' + p.pose + ' ' + p.direction + '"><figcaption><b>' + p.pose + ' ' + p.direction + '</b><br>' + escape(p.observation) + '</figcaption></figure>').join('') +
  '</div><p>Retained native eight-pose outputs: ' + e.retainedEightPoseSources.map((s,i) => '<a href="' + link(s.path) + '">' + (i ? 'targeted edit ' + i : 'initial sheet') + '</a>').join(' · ') + '</p></article>').join('\n');
writeFileSync(htmlFile, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Inspector v6f clipboard review</title><style>body{margin:16px;background:#20252b;color:#fff;font:15px system-ui}a{color:#67e8f9}article{margin:24px 0;padding:12px;border:1px solid #69717b}h2{font-size:18px}.poses{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,160px),1fr));gap:12px}figure{margin:0;min-width:0}img{display:block;width:160px;max-width:100%;height:auto;image-rendering:pixelated}figcaption{font-size:13px;line-height:1.4}</style></head><body><a href="index.html">Main gallery</a> · <a href="manager/index.html">Manager comparison</a><h1>Clipboard review: ten inspectors, all 80 poses</h1><p>Manual worker visual QA, bound to final source/pose hashes. Every identity uses anatomical right-side carriage; every seated board rests on the lap. W/N grips are partly hidden by the near arm or torso. Rear seated boards show only a small edge and may be hard to recognize at game scale. Hash validation verifies evidence integrity; it does not automatically recognize hands or clipboards. Manager acceptance is pending.</p>' + cards + '</body></html>\n');
verifyRuntimeBaseline();
console.log(JSON.stringify({status: 'PASS', ...result.summary, managerAcceptance: 'pending', runtimeReady: false}));
