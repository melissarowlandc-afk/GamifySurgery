import {beforeProgramBatch6AcceptanceRelease,beforeProgramBatch6AcceptanceManifest,beforeProgramBatch6AcceptanceTimings,beforeProgramBatch6AcceptanceSource} from "./question-program-batch6-acceptance-test-support";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {expect} from "vitest";
import type {SyntheticClinicalRelease, AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionShipManifest} from "./question-ship-manifest";
import {PROGRAM_BATCH5_ROWS as rows, PROGRAM_BATCH5_VIEWS as views, PROGRAM_BATCH5_REPLACEMENTS as replacements,
  PROGRAM_BATCH5_CONSOLIDATIONS as consolidations, PROGRAM_BATCH5_TIMINGS as timings,
  PROGRAM_BATCH5_RETIRED_CASES as retired} from "./question-program-batch5-accepted-data-20261111";

const read = (path: string) => JSON.parse(readFileSync(new URL("../../../" + path, import.meta.url), "utf8"));
const before = read("tools/question-quality/fixtures/question-topic-acceptance-batch5-before-20261111.json");
const additional = read("tools/question-quality/fixtures/question-topic-acceptance-batch5-additional-before-20261111.json");
const supplemental=["narrative","domain","domain-suites","flags2-guard","membership","late-membership"].flatMap(label=>{
  const path="tools/question-quality/fixtures/question-topic-acceptance-batch5-"+label+"-before-20261111.json";
  return existsSync(new URL("../../../"+path,import.meta.url))?read(path).files:[];
});
const migration = read("tools/question-quality/fixtures/question-topic-acceptance-batch5-source-migration-20261111.json") as {
  files: Array<{path: string; beforeSha256: string; afterSha256: string; beforeText: string}>;
};
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const cases = Object.values(views).flatMap(view => view.cases);
const literalNameCorrections = read("tools/question-quality/fixtures/question-topic-acceptance-batch5-literal-name-corrections-20261111.json") as {
  records: Array<{caseId: string; fields: Array<{target: string; path: Array<string | number>; before: string; after: string}>}>;
};

export {topicQuestionAcceptance,topicCaseIsExplicitlyLive,retainedTopicCase} from "./question-program-batch6-acceptance-test-support";

/** Apply only the manager's recorded presentation substitutions to a reviewed copy. */
export function withProgramBatch5PresentationCorrections<T>(source: T, targetId: string): T {
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

export function beforeProgramBatch5AcceptanceRelease(release: SyntheticClinicalRelease): SyntheticClinicalRelease {
  release = beforeProgramBatch6AcceptanceRelease(release);
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
  expect(digest(restored), "complete batch5 projection delta").toBe(before.default.sha256);
  return restored;
}

export function beforeProgramBatch5AcceptanceManifest(manifest: QuestionShipManifest): QuestionShipManifest & {id: string; clinicalApproval: false} {
  manifest = beforeProgramBatch6AcceptanceManifest(manifest);
  if (!manifest.accepted.some(row => row.sourceView.startsWith("topic-batch5-")))
    return manifest as ReturnType<typeof beforeProgramBatch5AcceptanceManifest>;
  expect(manifest).toEqual({...before.manifest, id:"question-ship.2026-11-11.v14",
    accepted:[...before.manifest.accepted, ...rows], replacements:[...replacements, ...before.manifest.replacements],
    topicConsolidations:[...consolidations, ...(before.manifest.topicConsolidations ?? [])],
    headerSources:{...Object.fromEntries(rows.map(row => [row.caseId, row.sourceView])), ...before.manifest.headerSources}});
  return structuredClone(before.manifest);
}

export function beforeProgramBatch5AcceptanceTimings(actual: readonly AnswerChoiceTimingRegistryEntry[]): AnswerChoiceTimingRegistryEntry[] {
  actual = beforeProgramBatch6AcceptanceTimings(actual);
  if (!actual.some(entry => rows.some(row => row.questionVariantId === entry.questionVariantId))) return [...actual];
  expect(actual).toEqual([...before.timing, ...timings]);
  return structuredClone(before.timing);
}

export function beforeProgramBatch5AcceptanceSource(path: string, current: string | undefined): string {
  const releaseSourcePins = read("tools/question-quality/fixtures/question-program-batch5-release-source-pins-20261111.json") as {
    paths: Array<{path: string; requiredReleaseSha256: string | null}>;
  };
  const excludedSource = releaseSourcePins.paths.find(pin => pin.path === path)?.requiredReleaseSha256 === null;
  if (!excludedSource) current = beforeProgramBatch6AcceptanceSource(path, current);
  const row = migration.files.find(file => file.path === path);
  if (!row) { expect(current).toBeDefined(); return current!; }
  const hash = (text: string) => createHash("sha256").update(text).digest("hex");
  const releasePins=read("tools/question-quality/fixtures/question-program-batch5-release-source-pins-20261111.json") as {paths:Array<{path:string;mainBeforeSha256:string;mainAfterSha256:string;requiredReleaseSha256:string|null}>};
  const release=releasePins.paths.find(pin=>pin.path===path);
  if(release){expect(release.mainBeforeSha256).toBe(row.beforeSha256);expect(release.mainAfterSha256).toBe(row.afterSha256);}
  if(release?.requiredReleaseSha256===null){
    expect(current,path+" excluded authoring source").toBeUndefined();
    expect(existsSync(new URL("../../../"+path,import.meta.url)),path+" required absence").toBe(false);
    const frozen=read("tools/question-quality/fixtures/question-topic-batches45-repaired-tests-20261112.json") as {records:Array<{path:string;afterText:string;afterSha256:string}>};
    const record=frozen.records.find(record=>record.path===path);expect(record).toBeDefined();
    expect(record!.afterSha256).toBe(row.afterSha256);expect(hash(record!.afterText)).toBe(row.afterSha256);
  }else{
    expect(current,path+" required source").toBeDefined();
    expect(hash(current!),path+" exact authorized release postimage").toBe(release?.requiredReleaseSha256??row.afterSha256);
  }
  expect(hash(row.beforeText)).toBe(row.beforeSha256);
  expect(row.beforeSha256).toBe([...before.sourcePreimages,...additional.files,...supplemental].find((file: {path: string}) => file.path === path).beforeSha256);
  return row.beforeText;
}
