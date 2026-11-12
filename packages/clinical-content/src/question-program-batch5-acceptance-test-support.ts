import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {expect} from "vitest";
import type {SyntheticClinicalRelease, AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionShipManifest} from "./question-ship-manifest";
import {QUESTION_SHIP_MANIFEST as currentManifest} from "./question-ship-manifest";
import {SYNTHETIC_CLINICAL_RELEASE as currentRelease} from "./synthetic-content";
import {PROGRAM_BATCH5_ROWS as rows, PROGRAM_BATCH5_VIEWS as views, PROGRAM_BATCH5_REPLACEMENTS as replacements,
  PROGRAM_BATCH5_CONSOLIDATIONS as consolidations, PROGRAM_BATCH5_TIMINGS as timings,
  PROGRAM_BATCH5_RETIRED_CASES as retired} from "./question-program-batch5-accepted-data-20261111";
import {PROGRAM_BATCH1_RETIRED_CASES as retired1} from "./question-program-batch1-accepted-data-20261111";
import {PROGRAM_BATCH2_RETIRED_CASES as retired2} from "./question-program-batch2-accepted-data-20261111";
import {PROGRAM_BATCH3_RETIRED_CASES as retired3} from "./question-program-batch3-accepted-data-20261111";
import {PROGRAM_BATCH4_RETIRED_CASES as retired4} from "./question-program-batch4-accepted-data-20261111";

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

/** Later manager acceptances may change membership without changing authoring.
 * Verify authority against the captured prior manifest plus this exact batch,
 * and verify every resulting case against its frozen accepted serialization. */
export function topicQuestionAcceptance(questionVariantId: string): {accepted: boolean; live: boolean} {
  const authorized = [...before.manifest.accepted, ...rows] as QuestionShipManifest["accepted"];
  const expectedRows = authorized.filter(row => row.questionVariantId === questionVariantId);
  expect(currentManifest.accepted.filter(row => row.questionVariantId === questionVariantId)).toEqual(expectedRows);
  const retiredIds = new Set(retired.map(clinicalCase => clinicalCase.id));
  const freshRows = expectedRows.filter(row => cases.some(clinicalCase => clinicalCase.id === row.caseId) ||
    before.default.caseIds.includes(row.caseId) && !retiredIds.has(row.caseId));
  const actual = currentRelease.cases.flatMap(clinicalCase => clinicalCase.decisionNodes
    .filter(node => node.questionVariantId === questionVariantId)
    .map(node => [clinicalCase.id, node.id, node.questionVariantId, node.primaryConceptId]));
  const expected = freshRows.map(row => [row.caseId, row.nodeId, row.questionVariantId, row.conceptId]);
  expect(actual.sort(), questionVariantId + " exact fresh bindings").toEqual(expected.sort());
  for (const row of freshRows) {
    const clinicalCase = currentRelease.cases.find(candidate => candidate.id === row.caseId)!;
    const acceptedCase = cases.find(candidate => candidate.id === row.caseId);
    expect(digest(clinicalCase), row.caseId + " frozen accepted context")
      .toBe(acceptedCase ? digest(acceptedCase) : before.default.caseHashes[row.caseId]);
  }
  return {accepted: expectedRows.length > 0, live: freshRows.length > 0};
}

export function topicCaseIsExplicitlyLive(caseId: string): boolean {
  const authorized = [...before.manifest.accepted, ...rows] as QuestionShipManifest["accepted"];
  const caseRows = authorized.filter(row => row.caseId === caseId);
  const expected = caseRows.length > 0 && (cases.some(clinicalCase => clinicalCase.id === caseId) ||
    before.default.caseIds.includes(caseId) && !retired.some(clinicalCase => clinicalCase.id === caseId));
  expect(currentRelease.cases.some(clinicalCase => clinicalCase.id === caseId), caseId).toBe(expected);
  for (const row of caseRows) topicQuestionAcceptance(row.questionVariantId);
  return expected;
}

/** An authoring preservation guard may inspect a case later retired from fresh
 * selection. Require an explicit retirement relation and its retained source. */
export function retainedTopicCase(caseId: string): SyntheticClinicalRelease["cases"][number] | undefined {
  const current = currentRelease.cases.find(clinicalCase => clinicalCase.id === caseId);
  if (current) return current;
  const archived = [...retired1, ...retired2, ...retired3, ...retired4, ...retired]
    .find(clinicalCase => clinicalCase.id === caseId);
  const relation = currentManifest.replacements.some(row => row.replaces === caseId) ||
    currentManifest.topicConsolidations.some(row => row.replaces.includes(caseId));
  expect(relation, caseId + " explicit retirement relation").toBe(true);
  expect(archived, caseId + " retained frozen source").toBeDefined();
  for (const node of archived!.decisionNodes)
    expect(currentRelease.concepts.some(concept => concept.id === node.primaryConceptId), node.primaryConceptId).toBe(true);
  return archived;
}

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
  if (!manifest.accepted.some(row => row.sourceView.startsWith("topic-batch5-")))
    return manifest as ReturnType<typeof beforeProgramBatch5AcceptanceManifest>;
  expect(manifest).toEqual({...before.manifest, id:"question-ship.2026-11-11.v14",
    accepted:[...before.manifest.accepted, ...rows], replacements:[...replacements, ...before.manifest.replacements],
    topicConsolidations:[...consolidations, ...(before.manifest.topicConsolidations ?? [])],
    headerSources:{...Object.fromEntries(rows.map(row => [row.caseId, row.sourceView])), ...before.manifest.headerSources}});
  return structuredClone(before.manifest);
}

export function beforeProgramBatch5AcceptanceTimings(actual: readonly AnswerChoiceTimingRegistryEntry[]): AnswerChoiceTimingRegistryEntry[] {
  if (!actual.some(entry => rows.some(row => row.questionVariantId === entry.questionVariantId))) return [...actual];
  expect(actual).toEqual([...before.timing, ...timings]);
  return structuredClone(before.timing);
}

export function beforeProgramBatch5AcceptanceSource(path: string, current: string | undefined): string {
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
