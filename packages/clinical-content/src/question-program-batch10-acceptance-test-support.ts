import {beforeProgramBatch11AcceptanceRelease,beforeProgramBatch11AcceptanceManifest,beforeProgramBatch11AcceptanceTimings,beforeProgramBatch11AcceptanceSource,beforeProgramBatch11AcceptanceSourceBytes,beforeProgramBatch11AcceptanceCases,beforeProgramBatch11AcceptanceConcepts} from "./question-program-batch11-acceptance-test-support";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {expect} from "vitest";
import type {SyntheticClinicalRelease, SyntheticClinicalCase, AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionShipManifest} from "./question-ship-manifest";

const read = (path:string) => JSON.parse(readFileSync(new URL("../../../" + path, import.meta.url), "utf8"));
const before = read("tools/question-quality/fixtures/question-intraop-acceptance-batch10-before-20261113.json");
const after = read("tools/question-quality/fixtures/question-intraop-acceptance-batch10-after-20261113.json");
const migration = read("tools/question-quality/fixtures/question-intraop-acceptance-batch10-source-migration-20261113.json") as {
  files:Array<{path:string; beforeText:string; beforeSha256:string; afterSha256:string}>;
};
const schema = read("tools/question-quality/fixtures/question-intraop-acceptance-batch10-schema-pin-20261113.json");
const reconciliation = read("tools/question-quality/fixtures/question-intraop-acceptance-batch10-source-reconciliation-20261113.json") as {
  records:Array<{path:string; beforeText:string; beforeSha256:string; afterSha256:string}>;
};
const batch11CaseIds = new Set<string>(read("tools/question-quality/fixtures/question-intraop-acceptance-batch11-after-20261113.json").newCaseIds);
const sha = (value:string|Buffer) => createHash("sha256").update(value).digest("hex");
const digest = (value:unknown) => sha(JSON.stringify(value));

export function beforeProgramBatch10AcceptanceRelease(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
  if (release.cases.some(row => batch11CaseIds.has(row.id))) release = beforeProgramBatch11AcceptanceRelease(release);
  if (digest(release) === before.defaultSha256) return release;
  expect(digest(release), "complete batch10 release postimage").toBe(after.defaultSha256);
  expect(digest(before.defaultRelease), "immutable batch10 release preimage").toBe(before.defaultSha256);
  return structuredClone(before.defaultRelease);
}

export function beforeProgramBatch10AcceptanceManifest<T extends QuestionShipManifest>(manifest:T):T {
  if(manifest.accepted.some(row=>row.sourceView.startsWith("intraop-batch11-"))) manifest=beforeProgramBatch11AcceptanceManifest(manifest);
  if (digest(manifest) === before.manifestSha256) return manifest;
  expect(digest(manifest), "complete batch10 authority postimage").toBe(after.manifestSha256);
  expect(digest(before.manifest), "immutable batch10 authority preimage").toBe(before.manifestSha256);
  return structuredClone(before.manifest) as T;
}

export function beforeProgramBatch10AcceptanceTimings(entries:readonly AnswerChoiceTimingRegistryEntry[]):AnswerChoiceTimingRegistryEntry[] {
  entries=beforeProgramBatch11AcceptanceTimings(entries);
  if (!entries.some(entry => after.newQuestionIds.includes(entry.questionVariantId))) return [...entries];
  expect(digest(entries), "complete batch10 timing postimage").toBe(after.timingSha256);
  expect(digest(before.timing), "immutable batch10 timing preimage").toBe(before.timingSha256);
  return structuredClone(before.timing);
}

export function beforeProgramBatch10AcceptanceSource(path:string,current:string):string;
export function beforeProgramBatch10AcceptanceSource(path:string,current:undefined):string|undefined;
export function beforeProgramBatch10AcceptanceSource(path:string,current:string|undefined):string|undefined;
export function beforeProgramBatch10AcceptanceSource(path:string,current:string|undefined):string|undefined {
  current=current===undefined?beforeProgramBatch11AcceptanceSource(path,current):beforeProgramBatch11AcceptanceSourceBytes(current);
  const row=migration.files.find(r=>r.path===path);if(!row)return current;
  const pins=read("tools/question-quality/fixtures/question-program-batch10-release-source-pins-20261113.json");
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

export function beforeProgramBatch10AcceptanceSourceBytes(value:string):string;
export function beforeProgramBatch10AcceptanceSourceBytes(value:Buffer):Buffer;
export function beforeProgramBatch10AcceptanceSourceBytes(value:string|Buffer):string|Buffer {
  value=Buffer.isBuffer(value)?beforeProgramBatch11AcceptanceSourceBytes(value):beforeProgramBatch11AcceptanceSourceBytes(value);
  const pins=read("tools/question-quality/fixtures/question-program-batch10-release-source-pins-20261113.json");
  const row=migration.files.find(file=>file.afterSha256===sha(value)||pins.paths.some((p:{path:string;requiredReleaseSha256:string|null})=>p.path===file.path&&p.requiredReleaseSha256===sha(value)));
  if (!row) return value;
  expect(sha(row.beforeText), row.path + " exact prior source bytes").toBe(row.beforeSha256);
  return Buffer.isBuffer(value) ? Buffer.from(row.beforeText) : row.beforeText;
}

/** Reconcile only the exact optional ENG-I01 schema addition. The old hash and
 * old text stay immutable. Any other schema changes fail the original pin. */
export function beforeEngI01Schema(value:Buffer):Buffer {
  if (sha(value) === schema.beforeSha256) return value;
  expect(sha(value), "exact authorized ENG-I01 optional procedure schema").toBe(schema.afterSha256);
  expect(sha(schema.beforeText), "exact original schema pin").toBe(schema.beforeSha256);
  return Buffer.from(schema.beforeText);
}

/** Exact additional authorized postimages. These preserve every original
 * source pin and also bind the complete salvage or ENG source postimage. */
export function beforeAuthorizedBatch10IntegrationPins(value:Buffer):Buffer {
  value=beforeProgramBatch11AcceptanceSourceBytes(value);
  const row = reconciliation.records.find(record => record.afterSha256 === sha(value));
  if (!row) return value;
  expect(sha(row.beforeText), row.path + " exact historical pinned source").toBe(row.beforeSha256);
  return Buffer.from(row.beforeText);
}

export function beforeProgramBatch10AcceptanceCases(cases:readonly SyntheticClinicalCase[]):SyntheticClinicalCase[] {
  cases=beforeProgramBatch11AcceptanceCases(cases);
  const ids = new Set<string>(after.newCaseIds);
  if (!cases.some(clinicalCase => ids.has(clinicalCase.id))) return [...cases];
  for (const id of ids) {
    const matches = cases.filter(clinicalCase => clinicalCase.id === id);
    expect(matches, id + " exact append cardinality").toHaveLength(1);
    expect(digest(matches[0]), id + " exact accepted bytes").toBe(after.caseHashes[id]);
  }
  return cases.filter(clinicalCase => !ids.has(clinicalCase.id));
}

export function beforeProgramBatch10AcceptanceConcepts(concepts:SyntheticClinicalRelease["concepts"]):SyntheticClinicalRelease["concepts"] {
  concepts=beforeProgramBatch11AcceptanceConcepts(concepts);
  const ids = new Set<string>(after.newConceptIds);
  if (!concepts.some(concept => ids.has(concept.id))) return concepts;
  for (const id of ids) {
    const matches = concepts.filter(concept => concept.id === id);
    expect(matches, id + " exact meaning append cardinality").toHaveLength(1);
    expect(digest(matches[0]), id + " exact meaning bytes").toBe(after.conceptHashes[id]);
  }
  return concepts.filter(concept => !ids.has(concept.id));
}
