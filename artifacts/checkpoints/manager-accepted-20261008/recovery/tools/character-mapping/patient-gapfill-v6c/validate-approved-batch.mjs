import assert from 'node:assert/strict';
import './integration-validator-hooks.mjs';
import { assertOwnerApproved, batch, runtimeIntegrationState } from './runtime-contract.mjs';

assertOwnerApproved();
const requested = process.argv.find(value => value.startsWith('--validator='))?.split('=')[1];
const validators = ['roster', 'placement-qa', 'worker-review', 'all-catalog-comparison', batch === 'patient-gapfill-v6c' ? 'adult-revision' : 'navy-correction'];
assert(!requested || validators.includes(requested));
const priorArguments = [...process.argv]; process.argv.push('--require-complete', '--check-only');
try {
  for (const name of requested ? [requested] : validators) {
    if (name === 'adult-revision') (await import('./018-revision-baseline.mjs')).verify018Revision();
    else await import(`./validate-${name}.mjs`);
  }
} finally { process.argv = priorArguments; }
const state = runtimeIntegrationState();
console.log(JSON.stringify({ status: 'PASS', batch, validators: requested ? [requested] : validators, historicalValidatorToolsByteIdentical: true, historicalReviewLabelsFrozen: true, authorized: state.authorized, ready: state.ready, ownerApproval: state.ownerApproval, runtimeIntegrationStatus: state.status }));
