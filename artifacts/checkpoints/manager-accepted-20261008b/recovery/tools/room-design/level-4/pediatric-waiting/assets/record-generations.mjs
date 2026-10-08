import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadImage } from '@napi-rs/canvas';
const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../../../../..');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
const input = JSON.parse(fs.readFileSync(path.join(here, 'generation-receipts.json'), 'utf8'));
const standins = JSON.parse(fs.readFileSync(path.join(here, '../stand-in/manifest.json'), 'utf8'));
const references = {};
const entries = [];
for (const receipt of input.receipts) {
  const file = path.resolve(here, receipt.file), prompt = path.resolve(here, receipt.prompt);
  if (!file.startsWith(path.join(here, 'originals') + path.sep) || !prompt.startsWith(path.join(here, 'prompts') + path.sep)) throw new Error('Receipt escaped owned paths');
  if (sha(file) !== sha(receipt.generatedSource)) throw new Error(`Original differs from builtin output: ${receipt.file}`);
  // The tool received this exact string without a terminal formatting newline.
  const text = fs.readFileSync(prompt, 'utf8').trimEnd();
  if (fs.readFileSync(prompt, 'utf8') !== text) fs.writeFileSync(prompt, text);
  const image = await loadImage(file), spec = standins[receipt.id];
  for (const relative of receipt.referenceFiles) references[relative] = sha(path.resolve(repo, relative));
  entries.push({ ...receipt, sha256: sha(file), promptSha256: sha(prompt), originalSize: [image.width, image.height], nativeSize: receipt.nativeSize ?? [spec.width * 2, spec.height * 2], generator: 'builtin image_gen', transparentBackground: true, status: receipt.selected ? 'candidate-source-needs-owner-review' : 'preserved-earlier-source' });
}
const manifest = { schemaVersion: 1, task: 'Level 4 Pediatric Waiting Room milestone 2 / owner revision 2', created: '2026-10-07', revised: '2026-10-08', generator: 'builtin image_gen', transparentBackground: true, approval: null, runtimeIntegrated: false, nativeFrameMultiplier: 2, nominalNativePixelsPerTile: 480, frameBasis: 'Original five frames retain twice the stand-in canvas; owner revision2 enlarges east-facing chest/west-facing bin to explicit receipt frames. All shapes fit uniformly; at least 240 native pixels per tile on both axes.', assets: entries.filter(x => x.selected), sourceHistory: entries.filter(x => !x.selected), referenceHashes: references, inputBriefSha256: sha(path.join(here, '../ART_BRIEF.md')), standInManifestSha256: sha(path.join(here, '../stand-in/manifest.json')) };
fs.writeFileSync(path.join(here, 'generation-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`GENERATIONS recorded ${entries.length} original/prompt pairs; ${manifest.assets.length} selected; copied builtin outputs byte-for-byte`);
