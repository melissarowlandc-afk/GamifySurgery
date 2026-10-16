import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { stripTypeScriptTypes } from "node:module";

const root = fileURLToPath(new URL("../../../../../", import.meta.url));
const batch = dirname(fileURLToPath(import.meta.url));
const scratch = join(root, ".local-dev", "variety3-20261010", "samples-build");
const entries = await readdir(batch);
const inputs = [join(root, "packages", "clinical-content", "src", "schema.ts"),
  ...entries.filter(name => name.endsWith(".ts") && !name.endsWith(".test.ts")).map(name => join(batch, name))];
await mkdir(scratch, { recursive: true });
await writeFile(join(scratch, "package.json"), '{"type":"module"}\n', "utf8");
for (const input of inputs) {
  const compiled = stripTypeScriptTypes(await readFile(input, "utf8"), { mode: "strip" })
    .replace(/(from\s+["'])(\.[^"']+)(["'])/g, "$1$2.js$3");
  const output = join(scratch, relative(root, input).replace(/\.ts$/, ".js"));
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, compiled, "utf8");
}
const renderer = await import(pathToFileURL(join(scratch, relative(root, join(batch, "render-samples.ts")).replace(/\.ts$/, ".js"))).href);
await writeFile(join(root, "docs", "handoffs", "VARIETY3_BATCH_SAMPLES.md"), renderer.renderVariety3Samples(), "utf8");
console.log("Wrote docs/handoffs/VARIETY3_BATCH_SAMPLES.md from current variety-3 exports (20 variants; UTF-8 without BOM, LF).");
