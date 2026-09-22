import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repo = resolve(import.meta.dirname, '../../..');
const batch = 'artifacts/character-statics/gs-022-new-v1/patient-public20-v1';
const id = (index) => `gs022-new-person-${String(index).padStart(3, '0')}`;
const pendingPoses = () => ({ stand: Object.fromEntries(['south', 'east', 'west', 'north'].map((direction) => [direction, { status: 'pending-source' }])), sit: Object.fromEntries(['south', 'east', 'west', 'north'].map((direction) => [direction, { status: 'pending-source' }])) });
const manifest = { schemaVersion: 1, batchId: 'gs022-new-patient-public20-v1', status: 'awaiting-owner-demographic-specifications-and-source-sheets', runtimeIntegration: { authorized: false, ready: false }, canvas: { production: [160, 320], native: [32, 64], bodyAxisX: 80, floorY: 287 }, demographicPolicy: 'Each character requires an exact intended age, Woman or Man label, and supplied demographic evidence before art extraction. No demographic values are inferred by this package.', records: Array.from({ length: 20 }, (_, offset) => ({ id: id(offset + 1), category: null, appearanceSpec: null, intendedAge: null, intendedSex: null, demographicEvidence: null, ownerApproval: 'pending', runtimeReady: false, source: null, prompt: null, poses: pendingPoses() })) };
if (existsSync(resolve(repo, batch, 'manifest.json'))) throw new Error('Refusing to overwrite existing patient/public manifest. Use a versioned package or an explicit migration.');
mkdirSync(resolve(repo, batch), { recursive: true });
writeFileSync(resolve(repo, batch, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ status: 'INITIALIZED', records: 20, demographicsSpecified: 0, ownerApproved: 0, runtimeReady: false }));
