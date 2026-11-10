import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { Worker } from "node:worker_threads";
import { build, type Plugin, type ResolvedConfig } from "vite";
import { parseSync } from "rolldown/utils";
import { encodeRuntimeClinicalGraph, runtimeClinicalModule, type RuntimeClinicalGraph } from "./runtime-clinical-graph";
import { forbidPrivateModules } from "./forbid-private-modules";

const packageName = "@gamify-surgery/clinical-content", virtualId = "\0player-runtime-clinical-data";
const normalize = (path: string) => path.replaceAll("\\", "/");

/** Only runtime imports define the projection. A newly used function or exotic
 * value fails the build, rather than silently dropping a clinical export. */
export async function runtimeClinicalImports(root: string): Promise<string[]> {
  const names = new Set<string>();
  async function visit(directory: string): Promise<void> {
    for (const row of await readdir(directory, { withFileTypes: true })) {
      const file = resolve(directory, row.name);
      if (row.isDirectory()) { await visit(file); continue; }
      if (!/\.tsx?$/.test(row.name) || /\.(test|spec)\./.test(row.name)) continue;
      const source = parseSync(file, await readFile(file, "utf8"));
      if (source.errors.length) throw Error(`Cannot inspect clinical runtime imports: ${file}`);
      for (const statement of source.program.body) {
        if (statement.type !== "ImportDeclaration" || statement.source.value !== packageName || statement.importKind === "type") continue;
        for (const specifier of statement.specifiers) {
          if (specifier.type !== "ImportSpecifier") throw Error(`Use named clinical runtime imports: ${file}`);
          if (specifier.importKind !== "type") names.add(specifier.imported.type === "Identifier" ? specifier.imported.name : specifier.imported.value);
        }
      }
    }
  }
  await visit(resolve(root, "apps/player/src")); await visit(resolve(root, "packages/game-domain/src"));
  return [...names].filter(name => !name.endsWith("Schema")).sort();
}

/** Evaluate the public authoring pipeline once in a short-lived build realm.
 * Validation, manifest gating and retained-version checks run unchanged here.
 * The worker exits, so watch rebuilds cannot retain old catalogue graphs. */
async function evaluate(code: string, names: string[]): Promise<RuntimeClinicalGraph> {
  const worker = new Worker(`const {parentPort,workerData}=require('node:worker_threads');
    import('data:text/javascript;base64,'+Buffer.from(workerData.code).toString('base64')).then(module=>{
      const data=Object.fromEntries(workerData.names.map(name=>{if(module[name]===undefined)throw Error('Missing clinical runtime export: '+name);return [name,module[name]];}));
      parentPort.postMessage((${encodeRuntimeClinicalGraph.toString()})(data));
    }).catch(error=>{throw error;});`,
  { eval: true, workerData: { code, names } });
  try {
    return await new Promise((done, fail) => {
      worker.once("message", done); worker.once("error", fail);
      worker.once("exit", code => { if (code !== 0) fail(Error(`Clinical build evaluation exited ${code}`)); });
    });
  } finally { await worker.terminate(); }
}

export function runtimeClinicalData(repositoryRoot?: string): Plugin {
  let config: ResolvedConfig, source: Promise<string> | undefined;
  const generate = async () => {
    const root = repositoryRoot ?? resolve(config.root, "../.."), names = await runtimeClinicalImports(root);
    const entry = "\0clinical-data-build-entry";
    const result = await build({ configFile: false, root, logLevel: "error", plugins: [forbidPrivateModules(), { name: "clinical-data-build-entry",
      resolveId(id) { if (id === entry) return entry; }, load(id) { if (id === entry) return `export { ${names.join(",")} } from ${JSON.stringify(normalize(resolve(root, "packages/clinical-content/src/index.ts")))};`; } }],
      build: { ssr: true, target: "node22", write: false, minify: false, rolldownOptions: { input: entry } }, ssr: { noExternal: true } });
    if (Array.isArray(result) || !("output" in result)) throw Error("Unexpected clinical projection build result");
    const chunks = result.output.filter(output => output.type === "chunk");
    if (chunks.length !== 1) throw Error("Clinical projection must be a self-contained build module");
    const graph = await evaluate(chunks[0]!.code, names);
    return runtimeClinicalModule(graph, normalize(resolve(root, "packages/clinical-content/src/schema.ts")));
  };
  return { name: "player-runtime-clinical-data", enforce: "pre", apply: "build",
    configResolved(value) { config = value; },
    resolveId(id) { if (id === packageName) return virtualId; },
    load(id) { if (id === virtualId) return source ??= generate(); },
  };
}
