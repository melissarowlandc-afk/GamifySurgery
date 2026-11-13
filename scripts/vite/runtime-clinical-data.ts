import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import { Worker } from "node:worker_threads";
import { build, type Plugin, type ResolvedConfig } from "vite";
import { parseSync } from "rolldown/utils";
import { decodeRuntimeClinicalGraph, decodeRuntimeClinicalGraphCooperatively, encodeRuntimeClinicalGraph, runtimeClinicalModule, type RuntimeClinicalGraph } from "./runtime-clinical-graph";
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

/** Build-only projection: all unlisted fields fail closed until the owner
 * explicitly loads the full bank. No clinical value or manifest gate changes. */
export function runtimeClinicalIndex(graph: RuntimeClinicalGraph): { index: RuntimeClinicalGraph; full: RuntimeClinicalGraph } {
    const data = decodeRuntimeClinicalGraph(graph), release = data.SYNTHETIC_CLINICAL_RELEASE as { cases: Record<string, unknown>[] };
    if (!release?.cases) throw Error("Missing runtime clinical release");
    const full = encodeRuntimeClinicalGraph({ cases: release.cases });
    const deferred = new WeakMap<object, Map<string, number>>();
    const caseKeys = new Set(["id", "version", "routineEligible", "tutorialEligible", "patientDisplayName", "prototypeDemographics", "approvedInstantiationProfiles", "selectedInstantiationProfileId", "pediatricProfile", "participant", "releasePointId", "earliestFacilityStage", "requiredCapabilityIds", "requiredClinicalSetting", "rewardTierId", "decisionNodes"]);
    const nodeKeys = new Set(["id", "primaryConceptId", "questionVariantId", "answerChoices", "resultGateAfter"]);
    const profileKeys = new Set(["id", "prototypeDemographics", "pediatricProfile"]);
    const choiceKeys = new Set(["id", "label", "serviceRequest"]);
    function project(object: Record<string, unknown>, keep: Set<string>, caseIndex: number): void {
      const keys = Object.keys(object).filter(key => !keep.has(key));
      if (keys.length) deferred.set(object, new Map(keys.map(key => [key, caseIndex])));
      for (const key of keys) object[key] = undefined;
    }
    release.cases.forEach((c, i) => {
      if (c.tutorialEligible) return; // Synchronous new-campaign bootstrap stays exact.
      project(c, caseKeys, i);
      for (const profile of (c.approvedInstantiationProfiles as Record<string, unknown>[] | undefined) ?? [])
        project(profile, profileKeys, i);
      const choicePool = new Map<string, Record<string, unknown>>();
      c.decisionNodes = (c.decisionNodes as Record<string, unknown>[]).map(sourceNode => {
        const node = { ...sourceNode }; project(node, nodeKeys, i);
        node.answerChoices = (sourceNode.answerChoices as Record<string, unknown>[]).map(sourceChoice => {
          // Adult eligibility reads only service requests. Pool equal metadata
          // inside ONE case so every deferred field still identifies its exact
          // owner. Child eligibility also compares authored IDs/labels.
          const keep = c.pediatricProfile ? choiceKeys : new Set(["serviceRequest"]);
          const signature = JSON.stringify(Object.keys(sourceChoice)) + "|" +
            (sourceChoice.serviceRequest === undefined ? "undefined" : JSON.stringify(sourceChoice.serviceRequest));
          if (!c.pediatricProfile && choicePool.has(signature)) return choicePool.get(signature)!;
          const choice = { ...sourceChoice }; project(choice, keep, i);
          if (!c.pediatricProfile) choicePool.set(signature, choice);
          return choice;
        });
        return node;
      });
    });
    const index = encodeRuntimeClinicalGraph(data, deferred);
    return { index, full };
}

export function runtimeClinicalData(repositoryRoot?: string): Plugin {
  let config: ResolvedConfig, source: Promise<{ index: RuntimeClinicalGraph; full: RuntimeClinicalGraph; schema: string; loader: string }> | undefined;
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
    return { ...runtimeClinicalIndex(graph), schema: normalize(resolve(root, "packages/clinical-content/src/schema.ts")),
      loader: normalize(resolve(root, "apps/player/src/mobile/performance/runtimeCatalogue.ts")) };
  };
  return { name: "player-runtime-clinical-data", enforce: "pre", apply: "build",
    configResolved(value) { config = value; },
    resolveId(id) { if (id === packageName) return virtualId; },
    async load(id) {
      if (id !== virtualId) return;
      const { index, full, schema, loader } = await (source ??= generate());
      const offsets: [number, number][] = [], parts: Buffer[] = []; let offset = 0;
      const packet = (text: string) => {
        const input = Buffer.from(text), gzip = gzipSync(input);
        const header = Buffer.alloc(68); header.write(createHash("sha256").update(input).digest("hex"), 0, "ascii");
        header.writeUInt32LE(input.byteLength, 64); return Buffer.concat([header, gzip]);
      };
      for (const clinicalCase of decodeRuntimeClinicalGraph(full).cases as Record<string, unknown>[]) {
        const bytes = packet(JSON.stringify(encodeRuntimeClinicalGraph({ clinicalCase })));
        offsets.push([offset, bytes.byteLength]); parts.push(bytes); offset += bytes.byteLength;
      }
      // One compressed whole-graph compatibility slice makes offline fallback
      // independent of uncached requests, preserving cross-case shared values.
      const bulkText = JSON.stringify(full), bulkOffsets: [number, number][] = [];
      for (let start = 0; start < bulkText.length;) {
        let end = Math.min(start + 1_000_000, bulkText.length);
        if (end < bulkText.length && /[\uD800-\uDBFF]/.test(bulkText[end - 1]!)) end--;
        const bytes = packet(bulkText.slice(start, end)); bulkOffsets.push([offset, bytes.byteLength]);
        parts.push(bytes); offset += bytes.byteLength; start = end;
      }
      const bankAsset = this.emitFile({ type: "asset", name: "runtime-clinical-bank.bin", source: Buffer.concat(parts) });
      const indexAsset = this.emitFile({ type: "asset", name: "runtime-clinical-index.json", source: JSON.stringify(index) });
      const response = `await fetch(import.meta.ROLLUP_FILE_URL_${indexAsset}, { cache: "force-cache", credentials: "same-origin" })`;
      // Keep parsed graph/Response scratch inside a completed function, not a
      // top-level-await module slot that V8/WebKit may retain for module life.
      const initializer = `await (async () => { const response = ${response}; if (!response.ok) throw Error("Runtime clinical index unavailable"); return (${decodeRuntimeClinicalGraph.toString()})(await response.json(), defineRuntimeCatalogueField); })()`;
      return runtimeClinicalModule(index, schema, initializer) + `
import { defineRuntimeCatalogueField, installRuntimeCatalogueIndex, yieldRuntimeTask } from ${JSON.stringify(loader)};
import { readRuntimeCaseBankSlice } from ${JSON.stringify(normalize(resolve(repositoryRoot ?? resolve(config.root, "../.."), "apps/player/src/mobile/performance/runtimeCaseBank.ts")))};
let caseBank, caseBankBytes = 0;
const offsets = ${JSON.stringify(offsets)};
const prepareCaseBank = async () => {
  if (!caseBank) caseBank = fetch(import.meta.ROLLUP_FILE_URL_${bankAsset}, { cache: "force-cache", credentials: "same-origin" })
    .then(response => { if (!response.ok) throw Error("Runtime case bank unavailable"); return response.blob(); }).then(blob => { caseBankBytes = blob.size; return blob; }).catch(error => { caseBank = undefined; throw error; });
  await caseBank;
};
const readCaseText = async ([offset, length]) => {
  await prepareCaseBank();
  return readRuntimeCaseBankSlice(await caseBank, offset, length);
};
installRuntimeCatalogueIndex(data, async () => {
  let text = ""; for (const offset of ${JSON.stringify(bulkOffsets)}) text += await readCaseText(offset);
  return (await (${decodeRuntimeClinicalGraphCooperatively.toString()})(JSON.parse(text), undefined, yieldRuntimeTask)).cases;
}, { prepare: prepareCaseBank, async read(index) {
  return (${decodeRuntimeClinicalGraph.toString()})(JSON.parse(await readCaseText(offsets[index]))).clinicalCase;
}, release() { caseBank = undefined; caseBankBytes = 0; }, bytes() { return caseBankBytes; } });
`;
    },
  };
}
