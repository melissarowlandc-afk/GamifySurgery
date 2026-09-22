#!/usr/bin/env node
import { executeSynthetic, prepareLocal, resumeSynthetic, validateOffline } from './north-south-runner-lib.mjs';

const modes=['--prepare-local','--validate-only','--execute','--resume'];
if(process.argv.length!==3||!modes.includes(process.argv[2])) throw new Error(`use exactly one fixed mode: ${modes.join(' | ')}`);
if(process.argv[2]==='--prepare-local') process.stdout.write(`${JSON.stringify(prepareLocal(),null,2)}\n`);
else if(process.argv[2]==='--validate-only') process.stdout.write(`${JSON.stringify(validateOffline(),null,2)}\n`);
else if(process.argv[2]==='--execute') process.stdout.write(`${JSON.stringify(await executeSynthetic(),null,2)}\n`);
else process.stdout.write(`${JSON.stringify(await resumeSynthetic(),null,2)}\n`);
