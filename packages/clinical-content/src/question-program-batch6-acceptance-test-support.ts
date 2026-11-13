import {programBatch8HistoricalMembership} from "./question-program-batch8-acceptance-test-support";
import {beforeProgramBatch7AcceptanceRelease,beforeProgramBatch7AcceptanceManifest,beforeProgramBatch7AcceptanceTimings,beforeProgramBatch7AcceptanceSource,topicQuestionAcceptance as batch7QuestionAcceptance,topicCaseIsExplicitlyLive as batch7CaseLive} from "./question-program-batch7-acceptance-test-support";
import {PROGRAM_BATCH7_RETIRED_CASES as retired7} from "./question-program-batch7-accepted-data-20261112";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {expect} from "vitest";
import type {SyntheticClinicalRelease, AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionShipManifest} from "./question-ship-manifest";
import {QUESTION_SHIP_MANIFEST as currentManifest} from "./question-ship-manifest";
import {SYNTHETIC_CLINICAL_RELEASE as currentRelease} from "./synthetic-content";
import {PROGRAM_BATCH6_ROWS as rows, PROGRAM_BATCH6_VIEWS as views, PROGRAM_BATCH6_REPLACEMENTS as replacements,
  PROGRAM_BATCH6_CONSOLIDATIONS as consolidations, PROGRAM_BATCH6_TIMINGS as timings,
  PROGRAM_BATCH6_RETIRED_CASES as retired} from "./question-program-batch6-accepted-data-20261112";
import {QUESTION_PROGRAM_BATCH6_ACCEPTED_FAMILY_CONTEXTS as acceptedFamilies} from "./question-program-batch6-accepted-20261112";
import {PROGRAM_BATCH1_RETIRED_CASES as retired1} from "./question-program-batch1-accepted-data-20261111";
import {PROGRAM_BATCH2_RETIRED_CASES as retired2} from "./question-program-batch2-accepted-data-20261111";
import {PROGRAM_BATCH3_RETIRED_CASES as retired3} from "./question-program-batch3-accepted-data-20261111";
import {PROGRAM_BATCH4_RETIRED_CASES as retired4} from "./question-program-batch4-accepted-data-20261111";

import {PROGRAM_BATCH5_RETIRED_CASES as retired5} from "./question-program-batch5-accepted-data-20261111";

const read = (path: string) => JSON.parse(readFileSync(new URL("../../../" + path, import.meta.url), "utf8"));
const before = read("tools/question-quality/fixtures/question-topic-acceptance-batch6-before-20261112.json");
const additional = read("tools/question-quality/fixtures/question-topic-acceptance-batch6-additional-before-20261112.json");
const supplemental=["narrative","domain","domain-suites","flags2-guard","membership","late-membership"].flatMap(label=>{
  const path="tools/question-quality/fixtures/question-topic-acceptance-batch6-"+label+"-before-20261111.json";
  return existsSync(new URL("../../../"+path,import.meta.url))?read(path).files:[];
});
const migration = read("tools/question-quality/fixtures/question-topic-acceptance-batch6-source-migration-20261112.json") as {
  files: Array<{path: string; beforeSha256: string; afterSha256: string; beforeText: string}>;
};
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const cases = Object.values(views).flatMap(view => view.cases);
const literalNameCorrections = read("tools/question-quality/fixtures/question-topic-acceptance-batch6-literal-name-corrections-20261112.json") as {
  records: Array<{caseId: string; fields: Array<{target: string; path: Array<string | number>; before: string; after: string}>}>;
};

/** Later manager acceptances may change membership without changing authoring.
 * Verify authority against the captured prior manifest plus this exact batch,
 * and verify every resulting case against its frozen accepted serialization. */
export function topicQuestionAcceptance(questionVariantId:string): {accepted:boolean;live:boolean} {
  return batch7QuestionAcceptance(questionVariantId);
}

export function topicCaseIsExplicitlyLive(caseId:string):boolean {
  return batch7CaseLive(caseId);
}

/** An authoring preservation guard may inspect a case later retired from fresh
 * selection. Require an explicit retirement relation and its retained source. */
export function retainedTopicCase(caseId: string): SyntheticClinicalRelease["cases"][number] | undefined {
  const historical=programBatch8HistoricalMembership(currentRelease,currentManifest,{caseId});
  const current = historical.release.cases.find(clinicalCase => clinicalCase.id === caseId);
  if (current) return current;
  const archived = [...retired1, ...retired2, ...retired3, ...retired4, ...retired5, ...retired, ...retired7]
    .find(clinicalCase => clinicalCase.id === caseId);
  const relation = (historical.manifest.replacements??[]).some(row => row.replaces === caseId) ||
    (historical.manifest.topicConsolidations??[]).some(row => row.replaces.includes(caseId)) ||
    (historical.manifest.retirements??[]).some(row => row.caseId === caseId);
  expect(relation, caseId + " explicit retirement relation").toBe(true);
  expect(archived, caseId + " retained frozen source").toBeDefined();
  for (const node of archived!.decisionNodes)
    expect(historical.release.concepts.some(concept => concept.id === node.primaryConceptId), node.primaryConceptId).toBe(true);
  return archived;
}

/** Apply only the manager's recorded presentation substitutions to a reviewed copy. */
export function withProgramBatch6PresentationCorrections<T>(source: T, targetId: string): T {
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

export function beforeProgramBatch6AcceptanceRelease(release: SyntheticClinicalRelease): SyntheticClinicalRelease {
  release = beforeProgramBatch7AcceptanceRelease(release);
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
  expect(digest(restored), "complete batch6 projection delta").toBe(before.default.sha256);
  return restored;
}

export function beforeProgramBatch6AcceptanceManifest(manifest: QuestionShipManifest): QuestionShipManifest & {id: string; clinicalApproval: false} {
  manifest = beforeProgramBatch7AcceptanceManifest(manifest);
  if (!manifest.accepted.some(row => row.sourceView.startsWith("topic-batch6-")))
    return manifest as ReturnType<typeof beforeProgramBatch6AcceptanceManifest>;
  expect(manifest).toEqual({...before.manifest, id:"question-ship.2026-11-12.v15",
    accepted:[...before.manifest.accepted, ...rows], replacements:[...replacements, ...before.manifest.replacements],
    topicConsolidations:[...consolidations, ...(before.manifest.topicConsolidations ?? [])],
    headerSources:{...Object.fromEntries(rows.map(row => [row.caseId, row.sourceView])), ...before.manifest.headerSources}});
  return structuredClone(before.manifest);
}

export function beforeProgramBatch6AcceptanceTimings(actual: readonly AnswerChoiceTimingRegistryEntry[]): AnswerChoiceTimingRegistryEntry[] {
  actual = beforeProgramBatch7AcceptanceTimings(actual);
  if (!actual.some(entry => rows.some(row => row.questionVariantId === entry.questionVariantId))) return [...actual];
  // Exact manager-approved runtime delta; the reviewed no_test source stays frozen.
  const proposals = read("docs/research/question-topic-acceptance-batch6-packet-20261112.json").outsideRecordTestingChoices as Array<{
    caseId: string; nodeId: string; questionVariantId: string; choiceId: string; choiceLabel: string; proposedProfileId: string;
  }>;
  const runtimeTimings: AnswerChoiceTimingRegistryEntry[] = timings.map(entry => {
    const approved = proposals.filter(row => row.caseId === entry.caseId && row.nodeId === entry.nodeId && row.questionVariantId === entry.questionVariantId);
    if (!approved.length) return entry;
    const node = cases.find(cs => cs.id === entry.caseId)!.decisionNodes.find(node => node.id === entry.nodeId && node.questionVariantId === entry.questionVariantId)!;
    return {...entry, classification: {kind: "test_choices", choices: node.answerChoices.map(choice => {
      const proposal = approved.find(row => row.choiceId === choice.id && row.choiceLabel === choice.label);
      return {choiceId: choice.id, choiceLabel: choice.label, timing: proposal
        ? {kind: "test", timingProfileId: proposal.proposedProfileId} : {kind: "no_test"}};
    })}};
  });
  expect(actual).toEqual([...before.timing, ...runtimeTimings]);
  return structuredClone(before.timing);
}

export function beforeProgramBatch6AcceptanceFamilies<T>(actual: readonly T[]): T[] {
  if (digest(actual) === before.familyRegistryBeforeSha256) return [...actual];
  expect(actual).toEqual([...before.familyRegistryBefore,...acceptedFamilies]);
  expect(digest(before.familyRegistryBefore)).toBe(before.familyRegistryBeforeSha256);
  return structuredClone(before.familyRegistryBefore);
}

export function beforeProgramBatch6AcceptanceSource(path: string, current: string | undefined): string {
  if (current !== undefined) current = beforeProgramBatch7AcceptanceSource(path, current);
  const row = migration.files.find(file => file.path === path);
  if (!row) {
    expect(current, path + " required source").toBeDefined();
    return current!;
  }
  const hash = (text: string) => createHash("sha256").update(text).digest("hex");
  const pins = read("tools/question-quality/fixtures/question-program-batch6-release-source-pins-20261112.json") as {
    paths: Array<{path: string; mainBeforeSha256: string; mainAfterSha256: string; requiredReleaseSha256: string | null}>;
  };
  const pin = pins.paths.find(pin => pin.path === path);
  if (pin) {
    expect(pin.mainBeforeSha256).toBe(row.beforeSha256);
    expect(pin.mainAfterSha256).toBe(row.afterSha256);
  }
  if (pin?.requiredReleaseSha256 === null) {
    expect(current, path + " excluded authoring module").toBeUndefined();
    expect(existsSync(new URL("../../../" + path, import.meta.url))).toBe(false);
    const archive = read("tools/question-quality/fixtures/question-topic-batch6-repaired-tests-20261112.json") as {
      records: Array<{path: string; beforeSha256: string; afterSha256: string; afterText: string}>;
    };
    const record = archive.records.find(record => record.path === path);
    expect(record, path + " exact frozen repaired source").toBeDefined();
    expect(record!.beforeSha256).toBe(row.beforeSha256);
    expect(record!.afterSha256).toBe(row.afterSha256);
    expect(hash(record!.afterText)).toBe(row.afterSha256);
  } else {
    expect(current, path + " required source").toBeDefined();
    expect(hash(current!), path + " exact authorized release postimage").toBe(pin?.requiredReleaseSha256 ?? row.afterSha256);
  }
  expect(hash(row.beforeText)).toBe(row.beforeSha256);
  expect(row.beforeSha256).toBe([...before.sourcePreimages, ...additional.files, ...supplemental]
    .find((file: {path: string}) => file.path === path).beforeSha256);
  return row.beforeText;
}
