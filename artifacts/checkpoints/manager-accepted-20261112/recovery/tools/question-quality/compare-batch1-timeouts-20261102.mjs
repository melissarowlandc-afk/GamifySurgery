// Read-only diagnosis of synthetic repository scenarios. Never a replacement
// for the unmodified Vitest results/deadlines, and no player-data input.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";
import { stripTypeScriptTypes } from "node:module";
import "../economy-audit/source-loader.mjs";

const domain = await import("../../packages/game-domain/src/index.ts");
const content = await import("../../packages/clinical-content/src/index.ts");
const entry = JSON.parse(fs.readFileSync(new URL("./fixtures/round3-batch1-before-20261102.json", import.meta.url), "utf8"));
const root = path.resolve(import.meta.dirname, "../..");
const url = p => pathToFileURL(path.join(root, p)).href;
const hash = value => createHash("sha256").update(value).digest("hex");
const files = ["packages/game-domain/tests/patient-supply.test.ts", "packages/game-domain/tests/periop-nurse-owner-feedback.test.ts"];
const titles = [
  "records the current clinical inventory and exact unseen-patient boundary by stage",
  "covers mixed endoscopy/surgery pre-op and recovery at Level 3, including patients outside a nurse's home room",
];
const assertions = `
import assert from 'node:assert/strict';
let captured;
const expect = value => ({
  toBe: expected => assert.strictEqual(value, expected),
  toHaveLength: expected => assert.strictEqual(value.length, expected),
  toMatchInlineSnapshot: text => {
    const expected = JSON.parse(text.replace(/,\\s*([}\\]])/g, '$1'));
    assert.deepStrictEqual(value, expected);
    captured = value;
  },
});
`;

// Execute the original project-owned callback and its functional assertions.
// Only these explicit matchers are supported; a changed matcher fails closed.
async function compileScenario(index) {
  const source = fs.readFileSync(path.join(root, files[index]), "utf8");
  const marker = `it(${JSON.stringify(titles[index])}, () => {`;
  assert.equal(source.split(marker).length, 2, "The exact source callback must be unique");
  const start = source.indexOf(marker) + marker.length;
  const ending = index === 0 ? "\n  }, hostedTime(10_000));" : "\n  });";
  const end = source.indexOf(ending, start);
  assert(end > start, "The exact top-level callback terminator must exist");
  let prefix = index === 0
    ? source.slice(0, source.indexOf('\ndescribe("routine patient supply"'))
      .replace('import { describe, expect, it } from "vitest";', "")
      .replace('from "../src"', `from ${JSON.stringify(url("packages/game-domain/src/index.ts"))}`)
    : `import { getCurrentPeriopNurseAttention } from ${JSON.stringify(url("packages/game-domain/src/index.ts"))};
       import { periopFlowFixture } from ${JSON.stringify(url("packages/game-domain/tests/periop-nurse-flow-fixture.ts"))};`;
  const body = source.slice(start, end);
  const result = index === 0 ? "captured" : "clinic.state";
  const compiled = stripTypeScriptTypes(assertions + prefix + `\nexport function inspectRun() {${body}\nreturn ${result};}\n`, { mode: "transform" });
  const module = await import("data:text/javascript;base64," + Buffer.from(compiled).toString("base64"));
  return { run: module.inspectRun, sourceHash: hash(source) };
}

const prior = new Map(entry.cases.map(c => [c.id, c]));
const original = domain.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease;
const before = { ...original, cases: original.cases.map(c => prior.get(c.id) ?? c) };
const results = [];
try {
  for (let index = 0; index < files.length; index++) {
    const scenario = await compileScenario(index), runs = {};
    for (const [name, release] of [["before", before], ["current", original]]) {
      domain.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease = release;
      const start = performance.now(), value = scenario.run();
      runs[name] = { elapsedMs: Math.round(performance.now() - start), sha256: hash(JSON.stringify(value)) };
      if (name === "before") runs.beforeValue = value;
      else assert.deepStrictEqual(value, runs.beforeValue, titles[index]);
    }
    delete runs.beforeValue;
    results.push({ file: files[index], title: titles[index], sourceHash: scenario.sourceHash,
      originalDeadlineMs: index === 0 ? 10000 : 5000, functionalAssertions: "passed in both contexts", identicalResult: true, runs });
  }
} finally {
  domain.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease = original;
}
process.stdout.write(JSON.stringify({ checkedOn: "2026-11-02", results,
  scope: "Captured pre-edit versus current clinical cases, same current runtime, exact original callback/functional assertions. Only a disposable process-local context reference changes and is restored. Diagnostic elapsed times are not benchmarks or passing Vitest results. No deadline, source test, runtime file, evidence, save or player data is changed." }, null, 2) + "\n");
