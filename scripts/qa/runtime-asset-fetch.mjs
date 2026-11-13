/** Offline Node production-harness adapter, including worker --import preload.
 * Browser fetch is native. Never route arbitrary files or network URLs here. */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, relative, isAbsolute, basename } from 'node:path';
const workspace = resolve('.local-dev');
globalThis.fetch = async input => {
  const url = String(input);
  if (!url.startsWith('file:')) throw Error('Offline harness cannot use the network');
  const file = fileURLToPath(url), name = basename(file), rel = relative(workspace, file);
  if (isAbsolute(rel) || rel.startsWith('..') || !/^runtime-clinical-(index|bank)-[\w-]+\.(json|bin)$/.test(name))
    throw Error('Only generated public runtime assets are allowed');
  const bytes = await readFile(file);
  return { ok: true, json: async () => JSON.parse(bytes.toString('utf8')), blob: async () => new Blob([bytes]) };
};
