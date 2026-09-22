#!/usr/bin/env node
import { executeSynthetic, resumeSynthetic, validateOffline } from './m2-runner-lib.mjs';

const modes = ['--validate-only', '--execute', '--resume'];
if (process.argv.length !== 3 || !modes.includes(process.argv[2])) throw new Error(`use exactly one fixed mode: ${modes.join(' | ')}`);

if (process.argv[2] === '--validate-only') process.stdout.write(`${JSON.stringify(validateOffline(), null, 2)}\n`);
else if (process.argv[2] === '--execute') process.stdout.write(`${JSON.stringify(await executeSynthetic(), null, 2)}\n`);
else process.stdout.write(`${JSON.stringify(await resumeSynthetic(), null, 2)}\n`);
