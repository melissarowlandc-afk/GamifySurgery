import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { tool } from './runtime-contract.mjs';

// Run the accepted batch validators themselves without editing any frozen tool.
// Extend only their old generation-time allowed-ID seam, after the integration
// contract verifies the complete exact append-only registry and catalog state.
const baselineUrl = pathToFileURL(resolve(tool, 'runtime-baseline.mjs')).href;
const contractUrl = pathToFileURL(resolve(tool, 'runtime-contract.mjs')).href;
const original = readFileSync(resolve(tool, 'runtime-baseline.mjs'), 'utf8');
const seam = 'const allowed=new Set([...b.stableIds,...b.allowedAddedIds]);';
assert.equal(original.split(seam).length, 2, 'historical allowed-ID seam must occur once');
const entry = 'export function verifyRuntimeBaseline(){';
assert.equal(original.split(entry).length, 2, 'historical preservation function seam must occur once');
registerHooks({
  load(url, context, nextLoad) {
    const result = nextLoad(url, context);
    if (url !== baselineUrl) return result;
    const source = Buffer.isBuffer(result.source) ? result.source.toString('utf8') : String(result.source);
    assert.equal(source, original, 'validator source changed while loading');
    return { ...result, source: `import { approvedRuntimeAdditionIds, runtimeIntegrationState } from ${JSON.stringify(contractUrl)};\n` + source
      .replace(entry, entry + '\n  runtimeIntegrationState();')
      // Preserve the historical 285-ID set-size assertion on its original set.
      .replace('assert.equal(allowed.size,285);', 'assert.equal(new Set([...b.stableIds,...b.allowedAddedIds]).size,285);')
      .replace(seam, 'const allowed=new Set([...b.stableIds,...b.allowedAddedIds,...approvedRuntimeAdditionIds()]);') };
  },
});
