import {beforeProgramBatch5AcceptanceRelease, beforeProgramBatch5AcceptanceManifest, beforeProgramBatch5AcceptanceTimings, beforeProgramBatch5AcceptanceSource} from "./question-program-batch5-acceptance-test-support";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {expect} from "vitest";
import type {SyntheticClinicalRelease, AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionShipManifest} from "./question-ship-manifest";
import {PROGRAM_BATCH4_ROWS as rows, PROGRAM_BATCH4_VIEWS as views, PROGRAM_BATCH4_REPLACEMENTS as replacements,
  PROGRAM_BATCH4_CONSOLIDATIONS as consolidations, PROGRAM_BATCH4_TIMINGS as timings,
  PROGRAM_BATCH4_RETIRED_CASES as retired} from "./question-program-batch4-accepted-data-20261111";

const read = (path: string) => JSON.parse(readFileSync(new URL("../../../" + path, import.meta.url), "utf8"));
const before = read("tools/question-quality/fixtures/question-topic-acceptance-batch4-before-20261111.json");
const additional = read("tools/question-quality/fixtures/question-topic-acceptance-batch4-additional-before-20261111.json");
const supplemental=["narrative","domain","domain-suites","flags2-guard"].flatMap(label=>{
  const path="tools/question-quality/fixtures/question-topic-acceptance-batch4-"+label+"-before-20261111.json";
  return existsSync(new URL("../../../"+path,import.meta.url))?read(path).files:[];
});
const migration = read("tools/question-quality/fixtures/question-topic-acceptance-batch4-source-migration-20261111.json") as {
  files: Array<{path: string; beforeSha256: string; afterSha256: string; beforeText: string}>;
};
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const cases = Object.values(views).flatMap(view => view.cases);
const literalNameCorrections = read("tools/question-quality/fixtures/question-topic-acceptance-batch4-literal-name-corrections-20261111.json") as {
  records: Array<{caseId: string; fields: Array<{target: string; path: Array<string | number>; before: string; after: string}>}>;
};

/** Apply only the manager's recorded presentation substitutions to a reviewed copy. */
export function withProgramBatch4PresentationCorrections<T>(source: T, targetId: string): T {
  const corrected = structuredClone(source);
  for (const record of literalNameCorrections.records) {
    const fields = record.fields.filter(field =>
      record.caseId === targetId ? field.target === "case" : field.target === targetId);
    for (const field of fields) {
      let parent = corrected as Record<string | number, unknown>;
      for (const segment of field.path.slice(0, -1)) {
        parent = parent[segment] as Record<string | number, unknown>;
      }
      const key = field.path.at(-1)!;
      expect(parent[key], targetId + " presentation source").toBe(field.before);
      parent[key] = field.after;
    }
  }
  return corrected;
}

export function beforeProgramBatch4AcceptanceRelease(release: SyntheticClinicalRelease): SyntheticClinicalRelease {
  release = beforeProgramBatch5AcceptanceRelease(release);
  if (digest(release) === before.default.sha256) return release;
  if (!release.cases.some(cs => cases.some(accepted => accepted.id === cs.id))) return release;
  for (const cs of cases) expect(release.cases.find(actual => actual.id === cs.id), cs.id).toEqual(cs);
  for (const cs of retired) expect(release.cases.some(actual => actual.id === cs.id), cs.id).toBe(false);
  const current = new Map(release.cases.map(cs => [cs.id, cs]));
  for (const cs of retired) current.set(cs.id, cs);
  const known = new Set<string>(before.default.conceptIds);
  const restored = {...release, cases:before.default.caseIds.map((id: string) => current.get(id)!),
    concepts:release.concepts.filter(concept => known.has(concept.id))};
  expect(restored.cases.every((cs: SyntheticClinicalRelease["cases"][number]) => !!cs)).toBe(true);
  for (const concept of restored.concepts) expect(digest(concept), concept.id).toBe(before.default.conceptHashes[concept.id]);
  expect(restored.concepts.map(concept => concept.id)).toEqual(before.default.conceptIds);
  expect(release.concepts.filter(concept => !known.has(concept.id)).map(concept => concept.id))
    .toEqual([...new Set(rows.map(row => row.conceptId))].filter(id => !known.has(id)));
  expect(release.cases.length).toBe(before.default.cases - retired.length + cases.length);
  expect(digest(restored), "complete batch4 projection delta").toBe(before.default.sha256);
  return restored;
}

export function beforeProgramBatch4AcceptanceManifest(manifest: QuestionShipManifest): QuestionShipManifest & {id: string; clinicalApproval: false} {
  manifest = beforeProgramBatch5AcceptanceManifest(manifest);
  if (!manifest.accepted.some(row => row.sourceView.startsWith("topic-batch4-")))
    return manifest as ReturnType<typeof beforeProgramBatch4AcceptanceManifest>;
  expect(manifest).toEqual({...before.manifest, id:"question-ship.2026-11-11.v13",
    accepted:[...before.manifest.accepted, ...rows], replacements:[...replacements, ...before.manifest.replacements],
    topicConsolidations:[...consolidations, ...(before.manifest.topicConsolidations ?? [])],
    headerSources:{...Object.fromEntries(rows.map(row => [row.caseId, row.sourceView])), ...before.manifest.headerSources}});
  return structuredClone(before.manifest);
}

export function beforeProgramBatch4AcceptanceTimings(actual: readonly AnswerChoiceTimingRegistryEntry[]): AnswerChoiceTimingRegistryEntry[] {
  actual = beforeProgramBatch5AcceptanceTimings(actual);
  if (!actual.some(entry => rows.some(row => row.questionVariantId === entry.questionVariantId))) return [...actual];
  expect(actual).toEqual([...before.timing, ...timings]);
  return structuredClone(before.timing);
}

export function beforeProgramBatch4AcceptanceSource(path: string, current: string): string {
  current = beforeProgramBatch5AcceptanceSource(path, current);
  const row = migration.files.find(file => file.path === path);
  if (!row) return current;
  const hash = (text: string) => createHash("sha256").update(text).digest("hex");
  expect(hash(current), path + " batch4 postimage").toBe(row.afterSha256);
  expect(hash(row.beforeText)).toBe(row.beforeSha256);
  expect(row.beforeSha256).toBe([...before.sourcePreimages,...additional.files,...supplemental].find((file: {path: string}) => file.path === path).beforeSha256);
  return row.beforeText;
}
