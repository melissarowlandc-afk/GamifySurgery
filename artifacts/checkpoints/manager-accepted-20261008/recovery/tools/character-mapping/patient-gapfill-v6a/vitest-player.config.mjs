import { fileURLToPath } from 'node:url';

// Full player suite, using the proven v5 sandbox-compatible native configuration.
// No React/dev-server plugins or shared Vite configuration changes are needed.
export default {
  root: fileURLToPath(new URL('../../../apps/player/', import.meta.url)),
  test: { pool: 'threads', maxWorkers: 1 },
};
