// Offline maintenance command. The checked-in derivatives need no Python at build/runtime.
import { build } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const directory = resolve('.local-dev/phone-art-generation');
await mkdir(directory, { recursive: true });
await build({ configFile: false, root: process.cwd(), logLevel: 'warn', build: {
  ssr: true, minify: true, outDir: directory, emptyOutDir: false,
  rolldownOptions: { input: resolve('scripts/art/phone-art-input.ts'), output: { entryFileNames: 'input.mjs' } },
}, ssr: { noExternal: [/^@gamify-surgery\//] } });
const data = await import(pathToFileURL(resolve(directory, 'input.mjs')));
await writeFile(resolve(directory, 'input.json'), JSON.stringify([...data.DESKTOP_FACILITY_ASSETS, ...data.APPROVED_LEVEL5_BITMAP_ASSETS]));
console.log('Wrote .local-dev/phone-art-generation/input.json; next run python scripts/art/generate-phone-art.py');
