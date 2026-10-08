import { fileURLToPath } from 'node:url';

// Focused Node tests need no React/dev-server plugins. Native config loading and
// threads avoid sandbox-restricted child-process startup without changing the
// shared player Vite config or the game's opening pathway.
export default {
  root: fileURLToPath(new URL('../../../apps/player/', import.meta.url)),
  test: { pool: 'threads', maxWorkers: 1 },
};
