import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {expect} from "vitest";
import type {SyntheticClinicalRelease, SyntheticClinicalCase, AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionShipManifest} from "./question-ship-manifest";

const read = (path:string) => JSON.parse(readFileSync(new URL("../../../" + path, import.meta.url), "utf8"));
const before = read("tools/question-quality/fixtures/question-intraop-acceptance-batch11-before-20261113.json");
const after = read("tools/question-quality/fixtures/question-intraop-acceptance-batch11-after-20261113.json");
const migration = read("tools/question-quality/fixtures/question-intraop-acceptance-batch11-source-migration-20261113.json") as {
  files:Array<{path:string; beforeText:string; beforeSha256:string; afterSha256:string}>;
};
const eng = read("tools/question-quality/fixtures/question-intraop-acceptance-batch11-eng-i01c-pins-20261113.json") as {records:Array<{path:string;beforeText:string;beforeSha256:string;afterSha256:string}>};
const sha = (value:string|Buffer) => createHash("sha256").update(value).digest("hex");
const digest = (value:unknown) => sha(JSON.stringify(value));

export function beforeProgramBatch11AcceptanceRelease(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
  if (digest(release) === before.defaultSha256) return release;
  expect(digest(release), "complete batch11 release postimage").toBe(after.defaultSha256);
  expect(digest(before.defaultRelease), "immutable batch11 release preimage").toBe(before.defaultSha256);
  return structuredClone(before.defaultRelease);
}

export function beforeProgramBatch11AcceptanceManifest<T extends QuestionShipManifest>(manifest:T):T {
  if (digest(manifest) === before.manifestSha256) return manifest;
  expect(digest(manifest), "complete batch11 authority postimage").toBe(after.manifestSha256);
  expect(digest(before.manifest), "immutable batch11 authority preimage").toBe(before.manifestSha256);
  return structuredClone(before.manifest) as T;
}

export function beforeProgramBatch11AcceptanceTimings(entries:readonly AnswerChoiceTimingRegistryEntry[]):AnswerChoiceTimingRegistryEntry[] {
  if (!entries.some(entry => after.newQuestionIds.includes(entry.questionVariantId))) return [...entries];
  expect(digest(entries), "complete batch11 timing postimage").toBe(after.timingSha256);
  expect(digest(before.timing), "immutable batch11 timing preimage").toBe(before.timingSha256);
  return structuredClone(before.timing);
}

export function beforeProgramBatch11AcceptanceSource(path:string,current:string):string;
export function beforeProgramBatch11AcceptanceSource(path:string,current:undefined):string|undefined;
export function beforeProgramBatch11AcceptanceSource(path:string,current:string|undefined):string|undefined;
export function beforeProgramBatch11AcceptanceSource(path:string,current:string|undefined):string|undefined {
  const row=migration.files.find(r=>r.path===path);if(!row)return current;
  const pins=read("tools/question-quality/fixtures/question-program-batch11-release-source-pins-20261113.json");
  const pin=pins.paths.find((p:{path:string})=>p.path===path);
  expect(pin,path+" exact release delta").toBeDefined();
  expect(pin.mainBeforeSha256).toBe(row.beforeSha256);expect(pin.mainAfterSha256).toBe(row.afterSha256);
  if(current===undefined){
    expect(pin.requiredReleaseSha256).toBeNull();expect(existsSync(new URL("../../../"+path,import.meta.url))).toBe(false);
    const repaired=read(pins.repairedTopicTestArchivePath).records.find((r:{path:string})=>r.path===path);
    expect(repaired.sha256).toBe(row.afterSha256);expect(sha(repaired.sourceText)).toBe(row.afterSha256);
  }else if(sha(current)===row.beforeSha256)return current;
  else expect([row.afterSha256,pin.requiredReleaseSha256],path+" exact authoring/release postimage").toContain(sha(current));
  expect(sha(row.beforeText),path+" immutable captured preimage").toBe(row.beforeSha256);
  return row.beforeText;
}

export function beforeProgramBatch11AcceptanceSourceBytes(value:string):string;
export function beforeProgramBatch11AcceptanceSourceBytes(value:Buffer):Buffer;
export function beforeProgramBatch11AcceptanceSourceBytes(value:string|Buffer):string|Buffer {
  const pins=read("tools/question-quality/fixtures/question-program-batch11-release-source-pins-20261113.json");
  const row=[...migration.files,...eng.records].find(file=>file.afterSha256===sha(value)||pins.paths.some((p:{path:string;requiredReleaseSha256:string|null})=>p.path===file.path&&p.requiredReleaseSha256===sha(value)));
  if (!row) return value;
  expect(sha(row.beforeText), row.path + " exact prior source bytes").toBe(row.beforeSha256);
  return Buffer.isBuffer(value) ? Buffer.from(row.beforeText) : row.beforeText;
}

export function beforeProgramBatch11AcceptanceCases(cases:readonly SyntheticClinicalCase[]):SyntheticClinicalCase[] {
  const ids = new Set<string>(after.newCaseIds);
  if (!cases.some(clinicalCase => ids.has(clinicalCase.id))) return [...cases];
  for (const id of ids) {
    const matches = cases.filter(clinicalCase => clinicalCase.id === id);
    expect(matches, id + " exact append cardinality").toHaveLength(1);
    expect(digest(matches[0]), id + " exact accepted bytes").toBe(after.caseHashes[id]);
  }
  return cases.filter(clinicalCase => !ids.has(clinicalCase.id));
}

export function beforeProgramBatch11AcceptanceConcepts(concepts:SyntheticClinicalRelease["concepts"]):SyntheticClinicalRelease["concepts"] {
  const ids = new Set<string>(after.newConceptIds);
  if (!concepts.some(concept => ids.has(concept.id))) return concepts;
  for (const id of ids) {
    const matches = concepts.filter(concept => concept.id === id);
    expect(matches, id + " exact meaning append cardinality").toHaveLength(1);
    expect(digest(matches[0]), id + " exact meaning bytes").toBe(after.conceptHashes[id]);
  }
  return concepts.filter(concept => !ids.has(concept.id));
}
