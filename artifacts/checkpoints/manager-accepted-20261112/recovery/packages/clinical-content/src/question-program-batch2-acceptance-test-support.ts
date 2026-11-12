import {beforeProgramBatch3AcceptanceRelease,beforeProgramBatch3AcceptanceManifest,beforeProgramBatch3AcceptanceTimings,beforeProgramBatch3AcceptanceSource} from "./question-program-batch3-acceptance-test-support";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {expect} from "vitest";
import type {SyntheticClinicalRelease, AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionShipManifest} from "./question-ship-manifest";
import {PROGRAM_BATCH2_ROWS as rows, PROGRAM_BATCH2_VIEWS as views, PROGRAM_BATCH2_REPLACEMENTS as replacements,
  PROGRAM_BATCH2_CONSOLIDATIONS as consolidations, PROGRAM_BATCH2_TIMINGS as timings,
  PROGRAM_BATCH2_RETIRED_CASES as retired} from "./question-program-batch2-accepted-data-20261111";

const read = (path: string) => JSON.parse(readFileSync(new URL("../../../" + path, import.meta.url), "utf8"));
const before = read("tools/question-quality/fixtures/question-topic-acceptance-batch2-before-20261111.json");
const additional = read("tools/question-quality/fixtures/question-topic-acceptance-batch2-additional-before-20261111.json");
const migration = read("tools/question-quality/fixtures/question-topic-acceptance-batch2-source-migration-20261111.json") as {
  files: Array<{path: string; beforeSha256: string; afterSha256: string; beforeText: string}>;
};
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const cases = Object.values(views).flatMap(view => view.cases);

export function beforeProgramBatch2AcceptanceRelease(release: SyntheticClinicalRelease): SyntheticClinicalRelease {
  release = beforeProgramBatch3AcceptanceRelease(release);
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
  expect(digest(restored), "complete batch2 projection delta").toBe(before.default.sha256);
  return restored;
}

export function beforeProgramBatch2AcceptanceManifest(manifest: QuestionShipManifest): QuestionShipManifest & {id: string; clinicalApproval: false} {
  manifest = beforeProgramBatch3AcceptanceManifest(manifest);
  if (!manifest.accepted.some(row => row.sourceView.startsWith("topic-batch2-")))
    return manifest as ReturnType<typeof beforeProgramBatch2AcceptanceManifest>;
  expect(manifest).toEqual({...before.manifest, id:"question-ship.2026-11-11.v11",
    accepted:[...before.manifest.accepted, ...rows], replacements:[...replacements, ...before.manifest.replacements],
    topicConsolidations:[...consolidations, ...(before.manifest.topicConsolidations ?? [])],
    headerSources:{...Object.fromEntries(rows.map(row => [row.caseId, row.sourceView])), ...before.manifest.headerSources}});
  return structuredClone(before.manifest);
}

export function beforeProgramBatch2AcceptanceTimings(actual: readonly AnswerChoiceTimingRegistryEntry[]): AnswerChoiceTimingRegistryEntry[] {
  actual = beforeProgramBatch3AcceptanceTimings(actual);
  if (!actual.some(entry => rows.some(row => row.questionVariantId === entry.questionVariantId))) return [...actual];
  expect(actual).toEqual([...before.timing, ...timings]);
  return structuredClone(before.timing);
}

export function beforeProgramBatch2AcceptanceSource(path: string, current: string): string {
  current = beforeProgramBatch3AcceptanceSource(path, current);
  const row = migration.files.find(file => file.path === path);
  if (!row) return current;
  const hash = (text: string) => createHash("sha256").update(text).digest("hex");
  expect(hash(current), path + " batch2 postimage").toBe(row.afterSha256);
  expect(hash(row.beforeText)).toBe(row.beforeSha256);
  expect(row.beforeSha256).toBe([...before.sourcePreimages,...additional.files].find((file: {path: string}) => file.path === path).beforeSha256);
  return row.beforeText;
}
