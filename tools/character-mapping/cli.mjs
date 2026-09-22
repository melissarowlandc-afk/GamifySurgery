#!/usr/bin/env node
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checkRecipeFile, compileRecipeFile, runBatchFile, safeResolve } from "./compiler.mjs";

const toolRoot = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(toolRoot, "..", "..");
const artifactRoot = resolve(repositoryRoot, "artifacts/character-movement/mapping-pipeline");

function argumentsOf(values) {
  const result = { _: [] };
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith("--")) { result._.push(value); continue; }
    const key = value.slice(2), next = values[index + 1];
    if (!next || next.startsWith("--")) throw new Error(`missing value for --${key}`);
    (result[key] ??= []).push(next); index += 1;
  }
  return result;
}
function one(args, key, required = true) {
  const values = args[key];
  if (required && values?.length !== 1) throw new Error(`exactly one --${key} is required`);
  if (values?.length > 1) throw new Error(`--${key} may be supplied once`);
  return values?.[0];
}

const started = process.hrtime.bigint();
try {
  const args = argumentsOf(process.argv.slice(2));
  if (args._.length !== 1) throw new Error(args._.length ? `unexpected positional argument: ${args._.slice(1).join(" ")}` : "exactly one command is required");
  const command = args._[0];
  const allowed = command === "compile" || command === "check" ? new Set(["recipe", "output-root"]) : command === "batch" ? new Set(["manifest", "member", "output-root"]) : null;
  if (!allowed) throw new Error("usage: cli.mjs compile|check --recipe <repo-relative.json> [--output-root worker-runs] OR batch --manifest <repo-relative.json> [--member key]");
  for (const key of Object.keys(args)) if (key !== "_" && !allowed.has(key)) throw new Error(`unsupported option for ${command}: --${key}`);
  const outputRelative = one(args, "output-root", false) ?? "worker-runs";
  const outputRoot = safeResolve(artifactRoot, outputRelative, "output-root");
  let result;
  if (command === "compile" || command === "check") {
    const recipePath = safeResolve(repositoryRoot, one(args, "recipe"), "recipe");
    result = command === "compile"
      ? compileRecipeFile(recipePath, { repositoryRoot, outputRoot })
      : checkRecipeFile(recipePath, { repositoryRoot, outputRoot });
  } else if (command === "batch") {
    const manifestPath = safeResolve(repositoryRoot, one(args, "manifest"), "manifest");
    result = runBatchFile(manifestPath, { repositoryRoot, outputRoot, selectedKeys: args.member });
  }
  const localToolMilliseconds = Number(process.hrtime.bigint() - started) / 1e6;
  console.log(JSON.stringify({ ok: true, command, localToolMilliseconds: Number(localToolMilliseconds.toFixed(3)), unmeasuredManualAndRasterWork: "not measured; no art work was performed", result }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error) }, null, 2));
  process.exitCode = 1;
}
