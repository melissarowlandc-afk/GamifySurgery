// Read the checked-in TS sources with Node's built-in transformer. No build,
// dependency installation, source rewriting or clinical/economic stubs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { registerHooks, stripTypeScriptTypes } from 'node:module';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const aliases = Object.fromEntries(['game-domain', 'balance-config', 'clinical-content'].map(name =>
  [`@gamify-surgery/${name}`, pathToFileURL(path.join(root, 'packages', name, 'src/index.ts')).href]));
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (aliases[specifier]) return { url: aliases[specifier], shortCircuit: true };
    if (specifier.startsWith('.') && context.parentURL?.startsWith('file:')) {
      const location = fileURLToPath(new URL(specifier, context.parentURL));
      if (!path.extname(location)) for (const suffix of ['.ts', '/index.ts', '.json', '.js'])
        if (fs.existsSync(location + suffix)) return { url: pathToFileURL(location + suffix).href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith('file:') && url.endsWith('.ts')) return {
      format: 'module', source: stripTypeScriptTypes(fs.readFileSync(fileURLToPath(url), 'utf8'), { mode: 'transform', sourceUrl: url }), shortCircuit: true,
    };
    if (url.startsWith('file:') && url.endsWith('.json') && fileURLToPath(url).startsWith(root + path.sep)) return {
      format: 'module', source: `export default ${fs.readFileSync(fileURLToPath(url), 'utf8')};`, shortCircuit: true,
    };
    return nextLoad(url, context);
  },
});
