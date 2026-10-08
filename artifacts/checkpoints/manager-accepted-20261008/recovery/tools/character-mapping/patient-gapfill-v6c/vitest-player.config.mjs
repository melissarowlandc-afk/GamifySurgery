import { fileURLToPath } from 'node:url';

// Same full-suite native/threads configuration used for accepted v6a/v6b.
export default {
  root: fileURLToPath(new URL('../../../apps/player/', import.meta.url)),
  test: { pool: 'threads', maxWorkers: 1 },
};
