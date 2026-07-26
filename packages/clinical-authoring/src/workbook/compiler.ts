import { readdir } from "node:fs/promises";
import { join } from "node:path";

import { ZodError } from "zod";

import type { ClinicalAuthoringWorkspace } from "../workspace.js";
import {
  CLINICAL_AUTHORING_WORKSPACE_SCHEMA_VERSION,
  validateClinicalAuthoringWorkspace,
} from "../workspace.js";
import {
  booleanCell,
  controlToken,
  enumCell,
  finiteNumberCell,
  integerCell,
  isoTimestampCell,
  nullableControlToken,
  nullableIntegerCell,
  nullableIsoTimestampCell,
  nullableStableIdCell,
  nullableText,
  ordinalCell,
  requiredText,
  stableIdCell,
  type WorkbookCellContext,
} from "./cells.js";
import {
  parseCsvBytes,
  rowsWithHeaders,
  type CsvObjectRow,
} from "./csv.js";
import {
  clinicalWorkbookTables,
  CLINICAL_WORKBOOK_FORMAT_VERSION,
  type ClinicalWorkbookTableName,
} from "./format.js";
import {
  readRegularWorkbookFile,
  writeNewWorkbookOutput,
} from "./filesystem.js";

type WorkbookRow = {
  sourceName: string;
  startLine: number;
  values: Record<string, string>;
};

type LoadedTables = Record<ClinicalWorkbookTableName, WorkbookRow[]>;

export class ClinicalWorkbookCompileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClinicalWorkbookCompileError";
  }
}

export type CompileClinicalWorkbookOptions = {
  baseWorkspace?: unknown;
};

export type CompiledClinicalWorkbook = {
  workspace: ClinicalAuthoringWorkspace;
  serialized: string;
  reviewWarnings: readonly string[];
};

const sourceTypes = [
  "official_outline",
  "textbook",
  "guideline",
  "journal_article",
  "reference_website",
  "practice_question_source",
  "owner_notes",
  "synthetic_fixture",
] as const;
const rightsStatuses = [
  "synthetic_or_owner_authored",
  "metadata_only",
  "review_required",
  "documented_permission",
] as const;
const accessScopes = [
  "public_web",
  "authenticated_private",
  "owner_local",
  "metadata_only",
  "synthetic_fixture",
] as const;
const citationTargetKinds = [
  "topic_section",
  "structured_fact",
  "tested_concept",
  "coverage_framework_node",
  "practice_inbox_item",
] as const;
const citationUsageKinds = [
  "bibliographic_metadata",
  "project_paraphrase",
  "source_excerpt",
  "synthetic_content",
] as const;
const locatorKinds = [
  "chapter",
  "section",
  "page",
  "paragraph",
  "figure",
  "table",
  "question_reference",
  "owner_note",
  "synthetic_marker",
] as const;
const verificationStates = [
  "unverified",
  "human_verified",
  "conflict_identified",
] as const;
const currentGameEligibilityValues = [
  "unclassified",
  "eligible",
  "deferred",
  "excluded",
] as const;
const coverageStatuses = ["missing", "partial", "complete"] as const;
const topicTypes = [
  "diagnosis",
  "procedure",
  "complication",
  "anatomy",
  "screening",
  "resuscitation",
  "general_principle",
  "synthetic_training_topic",
] as const;
const workflowStates = [
  "draft",
  "needs_clinical_review",
  "changes_requested",
  "clinically_approved",
  "archived",
] as const;
const topicSectionTypes = [
  "definition",
  "pathophysiology",
  "epidemiology",
  "age_and_demographics",
  "risk_factors",
  "typical_presentation",
  "atypical_presentation",
  "history_and_physical",
  "diagnostic_evaluation",
  "management",
  "complications",
  "differential_diagnosis",
  "prognosis",
  "pearls_and_pitfalls",
  "notes",
] as const;
const factValueKinds = [
  "text",
  "category",
  "number",
  "range",
  "distribution",
] as const;
const scenarioUseStatuses = [
  "descriptive_only",
  "scenario_candidate",
  "scenario_approved",
] as const;
const conflictStates = ["none", "unresolved"] as const;
const conceptTypes = [
  "diagnosis",
  "workup",
  "management",
  "anatomy",
  "complication",
  "disposition",
  "applied_science",
  "synthetic_training",
] as const;

function cellContext(row: WorkbookRow, header: string): WorkbookCellContext {
  return {
    sourceName: row.sourceName,
    startLine: row.startLine,
    header,
  };
}

function cell(row: WorkbookRow, header: string): string {
  return row.values[header]!;
}

function id(row: WorkbookRow, header: string): string {
  return stableIdCell(cell(row, header), cellContext(row, header));
}

function nullableId(row: WorkbookRow, header: string): string | null {
  return nullableStableIdCell(cell(row, header), cellContext(row, header));
}

function text(row: WorkbookRow, header: string): string {
  return requiredText(cell(row, header), cellContext(row, header));
}

function nullableToken(row: WorkbookRow, header: string): string | null {
  return nullableControlToken(cell(row, header), cellContext(row, header));
}

function importedEnum<const Value extends readonly [string, ...string[]]>(
  row: WorkbookRow,
  header: string,
  allowed: Value,
): Value[number] {
  return enumCell(cell(row, header), allowed, cellContext(row, header));
}

function assertBlank(row: WorkbookRow, headers: readonly string[]): void {
  for (const header of headers) {
    if (cell(row, header) !== "") {
      throw new ClinicalWorkbookCompileError(
        `${row.sourceName}:${row.startLine}:${header}: This field must be blank for the selected record type.`,
      );
    }
  }
}

async function loadTables(directory: string): Promise<LoadedTables> {
  const directoryEntries = await readdir(directory, { withFileTypes: true });
  const expectedCsvNames = new Set<string>(
    Object.values(clinicalWorkbookTables).map((table) => table.fileName),
  );
  const unexpectedCsv = directoryEntries.find(
    (entry) =>
      entry.name.toLocaleLowerCase("en-US").endsWith(".csv") &&
      !expectedCsvNames.has(entry.name),
  );
  if (unexpectedCsv) {
    throw new ClinicalWorkbookCompileError(
      `Unexpected CSV file (possible misspelled tab name): ${unexpectedCsv.name}`,
    );
  }

  const loaded = {} as LoadedTables;
  for (const [tableName, specification] of Object.entries(
    clinicalWorkbookTables,
  ) as [
    ClinicalWorkbookTableName,
    (typeof clinicalWorkbookTables)[ClinicalWorkbookTableName],
  ][]) {
    const path = join(directory, specification.fileName);
    let bytes: Buffer;
    try {
      bytes = await readRegularWorkbookFile(path);
    } catch (error: unknown) {
      throw new ClinicalWorkbookCompileError(
        `Unable to read required workbook table ${specification.fileName}: ${
          error instanceof Error ? error.message : "unknown error"
        }`,
      );
    }
    const document = parseCsvBytes(bytes, specification.fileName);
    const rows = rowsWithHeaders(document, specification.headers);
    loaded[tableName] = rows.map((row: CsvObjectRow<string>) => ({
      sourceName: specification.fileName,
      startLine: row.startLine,
      values: row.values,
    }));
  }
  return loaded;
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nested]) => [key, canonicalize(nested)]),
    );
  }
  return value;
}

function sameRecord(left: unknown, right: unknown): boolean {
  return JSON.stringify(canonicalize(left)) === JSON.stringify(canonicalize(right));
}

function mergeRecords<T>(
  base: readonly T[],
  imported: readonly T[],
  getKey: (value: T) => string,
  label: string,
): T[] {
  const merged = new Map<string, T>();
  const importedKeys = new Set<string>();
  for (const record of base) {
    merged.set(getKey(record), record);
  }
  for (const record of imported) {
    const key = getKey(record);
    if (importedKeys.has(key)) {
      throw new ClinicalWorkbookCompileError(
        `${label} ID appears more than once in the workbook: ${key}`,
      );
    }
    importedKeys.add(key);
    const existing = merged.get(key);
    if (existing !== undefined && !sameRecord(existing, record)) {
      throw new ClinicalWorkbookCompileError(
        `${label} ID collides with a different base record: ${key}`,
      );
    }
    if (existing === undefined) {
      merged.set(key, record);
    }
  }
  return [...merged.values()].sort((left, right) =>
    getKey(left).localeCompare(getKey(right)),
  );
}

function parseApproval(row: WorkbookRow) {
  const reviewer = cell(row, "approval_reviewer_id");
  const reviewedAt = cell(row, "approval_reviewed_at");
  const checklist = cell(row, "approval_checklist_version");
  const populated = [reviewer, reviewedAt, checklist].filter(
    (value) => value !== "",
  ).length;
  if (populated === 0) {
    return null;
  }
  if (populated !== 3) {
    throw new ClinicalWorkbookCompileError(
      `${row.sourceName}:${row.startLine}:approval_reviewer_id: Approval fields must be all blank or all populated.`,
    );
  }
  return {
    reviewerId: id(row, "approval_reviewer_id"),
    reviewedAt: isoTimestampCell(
      reviewedAt,
      cellContext(row, "approval_reviewed_at"),
    ),
    checklistVersion: id(row, "approval_checklist_version"),
  };
}

function parseRevision(row: WorkbookRow) {
  return {
    revisionId: id(row, "revision_id"),
    parentRevisionId: nullableId(row, "parent_revision_id"),
    authorId: id(row, "author_id"),
    workflowState: importedEnum(row, "workflow_state", workflowStates),
    provenance: {
      kind: importedEnum(row, "provenance_kind", ["manual"] as const),
      reference: controlToken(
        cell(row, "provenance_reference"),
        cellContext(row, "provenance_reference"),
      ),
    },
    createdAt: isoTimestampCell(
      cell(row, "created_at"),
      cellContext(row, "created_at"),
    ),
    changeSummary: text(row, "change_summary"),
    clinicalApproval: parseApproval(row),
  };
}

type OrderedValueGroup = {
  ownerType: string;
  ownerId: string;
  field: string;
  rows: { ordinal: number; value: string; row: WorkbookRow }[];
};

function collectOrderedValues(rows: readonly WorkbookRow[]) {
  const groups = new Map<string, OrderedValueGroup>();
  const allowedPairs = new Set([
    "topic:aliases",
    "structured_fact:exceptions",
    "tested_concept:required_clinical_setting_ids",
    "practice_inbox_item:paraphrased_answer_options",
  ]);

  for (const row of rows) {
    const ownerType = controlToken(
      cell(row, "owner_type"),
      cellContext(row, "owner_type"),
    );
    const ownerId = id(row, "owner_id");
    const field = controlToken(
      cell(row, "field"),
      cellContext(row, "field"),
    );
    if (!allowedPairs.has(`${ownerType}:${field}`)) {
      throw new ClinicalWorkbookCompileError(
        `${row.sourceName}:${row.startLine}:field: Unsupported ordered-value owner/field pair: ${ownerType}:${field}`,
      );
    }
    const key = `${ownerType}:${ownerId}:${field}`;
    const group = groups.get(key) ?? {
      ownerType,
      ownerId,
      field,
      rows: [],
    };
    group.rows.push({
      ordinal: ordinalCell(
        cell(row, "ordinal"),
        cellContext(row, "ordinal"),
      ),
      value: cell(row, "value"),
      row,
    });
    groups.set(key, group);
  }

  for (const group of groups.values()) {
    group.rows.sort((left, right) => left.ordinal - right.ordinal);
    group.rows.forEach((ordered, index) => {
      if (ordered.ordinal !== index) {
        throw new ClinicalWorkbookCompileError(
          `${ordered.row.sourceName}:${ordered.row.startLine}:ordinal: Ordinals for ${group.ownerType}:${group.ownerId}:${group.field} must be unique and contiguous from 0.`,
        );
      }
    });
  }

  const consumed = new Set<string>();
  return {
    values(ownerType: string, ownerId: string, field: string): string[] {
      const key = `${ownerType}:${ownerId}:${field}`;
      consumed.add(key);
      const group = groups.get(key);
      if (!group) {
        return [];
      }
      const values = group.rows.map(({ value, row }) => {
        if (
          field === "required_clinical_setting_ids"
        ) {
          return stableIdCell(value, cellContext(row, "value"));
        }
        return requiredText(value, cellContext(row, "value"));
      });
      if (new Set(values).size !== values.length) {
        throw new ClinicalWorkbookCompileError(
          `${group.rows[0]!.row.sourceName}:${group.rows[0]!.row.startLine}:value: Ordered values must not contain duplicates.`,
        );
      }
      return values;
    },
    assertNoOrphans(): void {
      const orphan = [...groups.keys()].find((key) => !consumed.has(key));
      if (orphan) {
        const group = groups.get(orphan)!;
        throw new ClinicalWorkbookCompileError(
          `${group.rows[0]!.row.sourceName}:${group.rows[0]!.row.startLine}:owner_id: Ordered values reference an unknown owner: ${orphan}`,
        );
      }
    },
  };
}

function groupedOrderedRows(
  rows: readonly WorkbookRow[],
  ownerHeader: string,
): Map<string, WorkbookRow[]> {
  const groups = new Map<
    string,
    { ordinal: number; row: WorkbookRow }[]
  >();
  for (const row of rows) {
    const ownerId = id(row, ownerHeader);
    const group = groups.get(ownerId) ?? [];
    group.push({
      ordinal: ordinalCell(
        cell(row, "ordinal"),
        cellContext(row, "ordinal"),
      ),
      row,
    });
    groups.set(ownerId, group);
  }

  return new Map(
    [...groups.entries()].map(([ownerId, group]) => {
      group.sort((left, right) => left.ordinal - right.ordinal);
      group.forEach((entry, index) => {
        if (entry.ordinal !== index) {
          throw new ClinicalWorkbookCompileError(
            `${entry.row.sourceName}:${entry.row.startLine}:ordinal: Ordinals for ${ownerId} must be unique and contiguous from 0.`,
          );
        }
      });
      return [ownerId, group.map((entry) => entry.row)];
    }),
  );
}

type ImportedCitation = {
  domain: {
    id: string;
    sourceSnapshotId: string;
    targetKind: (typeof citationTargetKinds)[number];
    targetId: string;
    usageKind: (typeof citationUsageKinds)[number];
    locator: {
      kind: (typeof locatorKinds)[number];
      label: string;
      secondaryLabel: string | null;
    };
    supportedClaim: string;
    verificationState: (typeof verificationStates)[number];
    verificationReviewerId: string | null;
    verificationRecordedAt: string | null;
    recordedAt: string;
  };
  ordinal: number;
  row: WorkbookRow;
};

function parseCitations(rows: readonly WorkbookRow[]): ImportedCitation[] {
  const citations = rows.map((row) => ({
    domain: {
      id: id(row, "citation_id"),
      sourceSnapshotId: id(row, "source_snapshot_id"),
      targetKind: importedEnum(row, "target_kind", citationTargetKinds),
      targetId: id(row, "target_id"),
      usageKind: importedEnum(row, "usage_kind", citationUsageKinds),
      locator: {
        kind: importedEnum(row, "locator_kind", locatorKinds),
        label: text(row, "locator_label"),
        secondaryLabel: nullableText(cell(row, "locator_secondary_label")),
      },
      supportedClaim: text(row, "supported_claim"),
      verificationState: importedEnum(
        row,
        "verification_state",
        verificationStates,
      ),
      verificationReviewerId: nullableId(
        row,
        "verification_reviewer_id",
      ),
      verificationRecordedAt: nullableIsoTimestampCell(
        cell(row, "verification_recorded_at"),
        cellContext(row, "verification_recorded_at"),
      ),
      recordedAt: isoTimestampCell(
        cell(row, "recorded_at"),
        cellContext(row, "recorded_at"),
      ),
    },
    ordinal: ordinalCell(
      cell(row, "ordinal"),
      cellContext(row, "ordinal"),
    ),
    row,
  }));

  const groups = new Map<string, ImportedCitation[]>();
  for (const citation of citations) {
    const key = `${citation.domain.targetKind}:${citation.domain.targetId}`;
    const group = groups.get(key) ?? [];
    group.push(citation);
    groups.set(key, group);
  }
  for (const [target, group] of groups) {
    group.sort((left, right) => left.ordinal - right.ordinal);
    group.forEach((citation, index) => {
      if (citation.ordinal !== index) {
        throw new ClinicalWorkbookCompileError(
          `${citation.row.sourceName}:${citation.row.startLine}:ordinal: Citation ordinals for ${target} must be unique and contiguous from 0.`,
        );
      }
    });
  }
  return citations;
}

function importedCitationIds(
  citations: readonly ImportedCitation[],
  targetKind: (typeof citationTargetKinds)[number],
  targetId: string,
): string[] {
  return citations
    .filter(
      (citation) =>
        citation.domain.targetKind === targetKind &&
        citation.domain.targetId === targetId,
    )
    .sort((left, right) => left.ordinal - right.ordinal)
    .map((citation) => citation.domain.id);
}

function parseFactParameters(rows: readonly WorkbookRow[]) {
  const parametersByRevision = new Map<
    string,
    { id: string; value: string | number | boolean; row: WorkbookRow }[]
  >();
  for (const row of rows) {
    const revisionId = id(row, "fact_revision_id");
    const parameterId = id(row, "parameter_id");
    const valueType = importedEnum(row, "value_type", [
      "string",
      "number",
      "boolean",
    ] as const);
    let value: string | number | boolean;
    if (valueType === "string") {
      assertBlank(row, ["number_value", "boolean_value"]);
      value = text(row, "string_value");
    } else if (valueType === "number") {
      assertBlank(row, ["string_value", "boolean_value"]);
      value = finiteNumberCell(
        cell(row, "number_value"),
        cellContext(row, "number_value"),
      );
    } else {
      assertBlank(row, ["string_value", "number_value"]);
      value = booleanCell(
        cell(row, "boolean_value"),
        cellContext(row, "boolean_value"),
      );
    }
    const group = parametersByRevision.get(revisionId) ?? [];
    if (group.some((parameter) => parameter.id === parameterId)) {
      throw new ClinicalWorkbookCompileError(
        `${row.sourceName}:${row.startLine}:parameter_id: Duplicate distribution parameter: ${parameterId}`,
      );
    }
    group.push({ id: parameterId, value, row });
    parametersByRevision.set(revisionId, group);
  }

  const consumed = new Set<string>();
  return {
    parameters(revisionId: string): Record<string, string | number | boolean> {
      consumed.add(revisionId);
      const parameters = parametersByRevision.get(revisionId) ?? [];
      return Object.fromEntries(
        parameters
          .sort((left, right) => left.id.localeCompare(right.id))
          .map((parameter) => [parameter.id, parameter.value]),
      );
    },
    assertNoOrphans(): void {
      const orphan = [...parametersByRevision.keys()].find(
        (key) => !consumed.has(key),
      );
      if (orphan) {
        const row = parametersByRevision.get(orphan)![0]!.row;
        throw new ClinicalWorkbookCompileError(
          `${row.sourceName}:${row.startLine}:fact_revision_id: Distribution parameters reference an unknown or non-distribution fact: ${orphan}`,
        );
      }
    },
  };
}

function factValue(
  row: WorkbookRow,
  parameterLookup: ReturnType<typeof parseFactParameters>,
  revisionId: string,
) {
  const kind = importedEnum(row, "value_kind", factValueKinds);
  const allValueHeaders = [
    "text_value",
    "category_value_id",
    "category_display_label",
    "numeric_value",
    "unit",
    "precision",
    "range_minimum",
    "range_maximum",
    "inclusive_minimum",
    "inclusive_maximum",
    "distribution_type_id",
    "distribution_description",
  ] as const;

  if (kind === "text") {
    assertBlank(
      row,
      allValueHeaders.filter((header) => header !== "text_value"),
    );
    return { kind, value: text(row, "text_value") };
  }
  if (kind === "category") {
    assertBlank(
      row,
      allValueHeaders.filter(
        (header) =>
          header !== "category_value_id" &&
          header !== "category_display_label",
      ),
    );
    return {
      kind,
      value: id(row, "category_value_id"),
      displayLabel: text(row, "category_display_label"),
    };
  }
  if (kind === "number") {
    assertBlank(
      row,
      allValueHeaders.filter(
        (header) =>
          header !== "numeric_value" &&
          header !== "unit" &&
          header !== "precision",
      ),
    );
    return {
      kind,
      value: finiteNumberCell(
        cell(row, "numeric_value"),
        cellContext(row, "numeric_value"),
      ),
      unit: nullableText(cell(row, "unit")),
      precision: integerCell(
        cell(row, "precision"),
        cellContext(row, "precision"),
      ),
    };
  }
  if (kind === "range") {
    assertBlank(
      row,
      allValueHeaders.filter(
        (header) =>
          header !== "range_minimum" &&
          header !== "range_maximum" &&
          header !== "unit" &&
          header !== "inclusive_minimum" &&
          header !== "inclusive_maximum",
      ),
    );
    return {
      kind,
      minimum: finiteNumberCell(
        cell(row, "range_minimum"),
        cellContext(row, "range_minimum"),
      ),
      maximum: finiteNumberCell(
        cell(row, "range_maximum"),
        cellContext(row, "range_maximum"),
      ),
      unit: nullableText(cell(row, "unit")),
      inclusiveMinimum: booleanCell(
        cell(row, "inclusive_minimum"),
        cellContext(row, "inclusive_minimum"),
      ),
      inclusiveMaximum: booleanCell(
        cell(row, "inclusive_maximum"),
        cellContext(row, "inclusive_maximum"),
      ),
    };
  }

  assertBlank(
    row,
    allValueHeaders.filter(
      (header) =>
        header !== "distribution_type_id" &&
        header !== "distribution_description",
    ),
  );
  return {
    kind,
    distributionTypeId: id(row, "distribution_type_id"),
    description: text(row, "distribution_description"),
    parameters: parameterLookup.parameters(revisionId),
  };
}

function requiredSingleRow(rows: readonly WorkbookRow[], tableName: string) {
  if (rows.length !== 1) {
    throw new ClinicalWorkbookCompileError(
      `${tableName} must contain exactly one nonblank data row; found ${rows.length}.`,
    );
  }
  return rows[0]!;
}

function derivedFrameworkNodePaths(
  importedRows: readonly WorkbookRow[],
  baseNodes: ClinicalAuthoringWorkspace["coverageFrameworkNodes"],
) {
  const importedById = new Map<string, WorkbookRow>();
  for (const row of importedRows) {
    const nodeId = id(row, "node_id");
    if (importedById.has(nodeId)) {
      throw new ClinicalWorkbookCompileError(
        `${row.sourceName}:${row.startLine}:node_id: Framework-node ID appears more than once in the workbook: ${nodeId}`,
      );
    }
    importedById.set(nodeId, row);
  }
  const baseById = new Map(baseNodes.map((node) => [node.id, node]));
  const resolved = new Map<string, string[]>();
  const visiting = new Set<string>();

  function pathFor(nodeId: string): string[] {
    const prior = resolved.get(nodeId);
    if (prior) {
      return prior;
    }
    const baseNode = baseById.get(nodeId);
    if (baseNode) {
      resolved.set(nodeId, baseNode.categoryPath);
      return baseNode.categoryPath;
    }
    const row = importedById.get(nodeId);
    if (!row) {
      throw new ClinicalWorkbookCompileError(
        `FRAMEWORK_NODES.csv: Unknown parent node: ${nodeId}`,
      );
    }
    if (visiting.has(nodeId)) {
      throw new ClinicalWorkbookCompileError(
        `${row.sourceName}:${row.startLine}:parent_node_id: Framework-node hierarchy contains a cycle.`,
      );
    }
    visiting.add(nodeId);
    const parentId = nullableId(row, "parent_node_id");
    const label = text(row, "category_label");
    const path = parentId === null ? [label] : [...pathFor(parentId), label];
    visiting.delete(nodeId);
    resolved.set(nodeId, path);
    return path;
  }

  for (const nodeId of importedById.keys()) {
    pathFor(nodeId);
  }
  return resolved;
}

export async function compileClinicalWorkbook(
  workbookDirectory: string,
  options: CompileClinicalWorkbookOptions = {},
): Promise<CompiledClinicalWorkbook> {
  const tables = await loadTables(workbookDirectory);
  const workspaceRow = requiredSingleRow(
    tables.workspace,
    clinicalWorkbookTables.workspace.fileName,
  );
  const formatVersion = integerCell(
    cell(workspaceRow, "format_version"),
    cellContext(workspaceRow, "format_version"),
  );
  if (formatVersion !== CLINICAL_WORKBOOK_FORMAT_VERSION) {
    throw new ClinicalWorkbookCompileError(
      `${workspaceRow.sourceName}:${workspaceRow.startLine}:format_version: Expected workbook format ${CLINICAL_WORKBOOK_FORMAT_VERSION}.`,
    );
  }
  const schemaVersion = integerCell(
    cell(workspaceRow, "schema_version"),
    cellContext(workspaceRow, "schema_version"),
  );
  if (schemaVersion !== CLINICAL_AUTHORING_WORKSPACE_SCHEMA_VERSION) {
    throw new ClinicalWorkbookCompileError(
      `${workspaceRow.sourceName}:${workspaceRow.startLine}:schema_version: Expected workspace schema ${CLINICAL_AUTHORING_WORKSPACE_SCHEMA_VERSION}.`,
    );
  }

  const base =
    options.baseWorkspace === undefined
      ? undefined
      : validateClinicalAuthoringWorkspace(options.baseWorkspace);
  const baseArray = <Key extends keyof ClinicalAuthoringWorkspace>(
    key: Key,
  ): ClinicalAuthoringWorkspace[Key] =>
    (base?.[key] ?? []) as ClinicalAuthoringWorkspace[Key];

  const definitionTypes = [
    "educational_difficulty",
    "clinical_setting",
    "concept_topic_relationship",
    "facility_stage",
    "deferred_scope",
    "source_format",
    "fact_type",
    "distribution_type",
    "coverage_classification",
  ] as const;
  const definitions = new Map<
    (typeof definitionTypes)[number],
    { id: string; label: string; description: string; ordinal?: number }[]
  >(definitionTypes.map((definitionType) => [definitionType, []]));
  for (const row of tables.definitions) {
    const definitionType = importedEnum(
      row,
      "definition_type",
      definitionTypes,
    );
    const ordinalText = cell(row, "ordinal");
    if (definitionType === "facility_stage" && ordinalText === "") {
      throw new ClinicalWorkbookCompileError(
        `${row.sourceName}:${row.startLine}:ordinal: Facility-stage definitions require an ordinal.`,
      );
    }
    if (definitionType !== "facility_stage" && ordinalText !== "") {
      throw new ClinicalWorkbookCompileError(
        `${row.sourceName}:${row.startLine}:ordinal: Only facility-stage definitions may carry an ordinal.`,
      );
    }
    definitions.get(definitionType)!.push({
      id: id(row, "id"),
      label: text(row, "label"),
      description: text(row, "description"),
      ...(definitionType === "facility_stage"
        ? {
            ordinal: ordinalCell(
              ordinalText,
              cellContext(row, "ordinal"),
            ),
          }
        : {}),
    });
  }

  const importedSources = tables.sources.map((row) => ({
    id: id(row, "source_id"),
    title: text(row, "title"),
    sourceType: importedEnum(row, "source_type", sourceTypes),
    edition: nullableText(cell(row, "edition")),
    publicationYear: nullableIntegerCell(
      cell(row, "publication_year"),
      cellContext(row, "publication_year"),
    ),
    publisherOrOrganization: nullableText(
      cell(row, "publisher_or_organization"),
    ),
    canonicalUrlOrIdentifier: nullableToken(
      row,
      "canonical_url_or_identifier",
    ),
    scopeNote: text(row, "scope_note"),
    rightsReview: {
      status: importedEnum(row, "rights_status", rightsStatuses),
      note: text(row, "rights_note"),
      reviewedBy: id(row, "rights_reviewed_by"),
      reviewedAt: isoTimestampCell(
        cell(row, "rights_reviewed_at"),
        cellContext(row, "rights_reviewed_at"),
      ),
      basis: text(row, "rights_basis"),
      privateStoragePermitted: booleanCell(
        cell(row, "private_storage_permitted"),
        cellContext(row, "private_storage_permitted"),
      ),
      localProcessingPermitted: booleanCell(
        cell(row, "local_processing_permitted"),
        cellContext(row, "local_processing_permitted"),
      ),
      externalAiTransferPermitted: booleanCell(
        cell(row, "external_ai_transfer_permitted"),
        cellContext(row, "external_ai_transfer_permitted"),
      ),
      publicSourceTextReusePermitted: booleanCell(
        cell(row, "public_source_text_reuse_permitted"),
        cellContext(row, "public_source_text_reuse_permitted"),
      ),
      projectParaphrasePublicationPermitted: booleanCell(
        cell(row, "project_paraphrase_publication_permitted"),
        cellContext(row, "project_paraphrase_publication_permitted"),
      ),
    },
  }));

  const importedSnapshots = tables.sourceSnapshots.map((row) => ({
    id: id(row, "snapshot_id"),
    sourceId: id(row, "source_id"),
    formatId: id(row, "format_id"),
    accessScope: importedEnum(row, "access_scope", accessScopes),
    retrievedUrl: nullableToken(row, "retrieved_url"),
    retrievedAt: isoTimestampCell(
      cell(row, "retrieved_at"),
      cellContext(row, "retrieved_at"),
    ),
    upstreamLastModified: nullableIsoTimestampCell(
      cell(row, "upstream_last_modified"),
      cellContext(row, "upstream_last_modified"),
    ),
    sha256: nullableToken(row, "sha256"),
  }));

  const importedCitations = parseCitations(tables.citations);
  const importedFrameworks = tables.coverageFrameworks.map((row) => ({
    id: id(row, "framework_id"),
    name: text(row, "name"),
    versionLabel: text(row, "version_label"),
    sourceSnapshotId: id(row, "source_snapshot_id"),
    recordedAt: isoTimestampCell(
      cell(row, "recorded_at"),
      cellContext(row, "recorded_at"),
    ),
  }));

  const nodePaths = derivedFrameworkNodePaths(
    tables.coverageFrameworkNodes,
    baseArray("coverageFrameworkNodes"),
  );
  const importedNodes = tables.coverageFrameworkNodes.map((row) => {
    const nodeId = id(row, "node_id");
    return {
      id: nodeId,
      frameworkId: id(row, "framework_id"),
      externalCategoryId: controlToken(
        cell(row, "external_category_id"),
        cellContext(row, "external_category_id"),
      ),
      parentNodeId: nullableId(row, "parent_node_id"),
      ordinal: ordinalCell(
        cell(row, "ordinal"),
        cellContext(row, "ordinal"),
      ),
      categoryPath: nodePaths.get(nodeId)!,
      sourceDefinedClassificationId: nullableId(
        row,
        "source_defined_classification_id",
      ),
      citationIds: importedCitationIds(
        importedCitations,
        "coverage_framework_node",
        nodeId,
      ),
      note: text(row, "note"),
    };
  });

  const importedMappings = tables.topicCoverageMappings.map((row) => ({
    id: id(row, "mapping_id"),
    coverageNodeId: id(row, "coverage_node_id"),
    topicId: id(row, "topic_id"),
    coverageStatus: importedEnum(row, "coverage_status", coverageStatuses),
    currentGameEligibility: importedEnum(
      row,
      "current_game_eligibility",
      currentGameEligibilityValues,
    ),
    deferredScopeId: nullableId(row, "deferred_scope_id"),
    authorId: id(row, "author_id"),
    updatedAt: isoTimestampCell(
      cell(row, "updated_at"),
      cellContext(row, "updated_at"),
    ),
    workflowState: importedEnum(row, "workflow_state", ["draft"] as const),
    note: text(row, "note"),
  }));

  const orderedValues = collectOrderedValues(tables.orderedValues);
  const importedTopics = tables.topics.map((row) => {
    const topicId = id(row, "topic_id");
    return {
      id: topicId,
      preferredName: text(row, "preferred_name"),
      topicType: importedEnum(row, "topic_type", topicTypes),
      aliases: orderedValues.values("topic", topicId, "aliases"),
      currentWorkingRevisionId: nullableId(
        row,
        "current_working_revision_id",
      ),
    };
  });

  const sectionRows = groupedOrderedRows(
    tables.topicSections,
    "topic_revision_id",
  );
  const consumedSectionGroups = new Set<string>();
  const importedTopicRevisions = tables.topicRevisions.map((row) => {
    const revision = parseRevision(row);
    const sectionGroup = sectionRows.get(revision.revisionId) ?? [];
    consumedSectionGroups.add(revision.revisionId);
    return {
      topicId: id(row, "topic_id"),
      revision,
      sections: sectionGroup.map((sectionRow) => {
        const sectionId = id(sectionRow, "section_id");
        return {
          id: sectionId,
          sectionType: importedEnum(
            sectionRow,
            "section_type",
            topicSectionTypes,
          ),
          narrative: text(sectionRow, "narrative"),
          citationIds: importedCitationIds(
            importedCitations,
            "topic_section",
            sectionId,
          ),
        };
      }),
    };
  });
  const orphanSection = [...sectionRows.keys()].find(
    (revisionId) => !consumedSectionGroups.has(revisionId),
  );
  if (orphanSection) {
    const row = sectionRows.get(orphanSection)![0]!;
    throw new ClinicalWorkbookCompileError(
      `${row.sourceName}:${row.startLine}:topic_revision_id: Topic section references an unknown revision: ${orphanSection}`,
    );
  }

  const parameterLookup = parseFactParameters(tables.distributionParameters);
  const importedFacts = tables.structuredFacts.map((row) => {
    const revision = parseRevision(row);
    const value = factValue(row, parameterLookup, revision.revisionId);
    if (value.kind !== "distribution") {
      const unexpected = parameterLookup.parameters(revision.revisionId);
      if (Object.keys(unexpected).length > 0) {
        throw new ClinicalWorkbookCompileError(
          `${row.sourceName}:${row.startLine}:value_kind: Only distribution facts may have parameter rows.`,
        );
      }
    }
    return {
      id: id(row, "fact_id"),
      topicRevisionId: id(row, "topic_revision_id"),
      revision,
      factTypeId: id(row, "fact_type_id"),
      value,
      population: text(row, "population"),
      clinicalContext: text(row, "clinical_context"),
      applicability: text(row, "applicability"),
      exceptions: orderedValues.values(
        "structured_fact",
        revision.revisionId,
        "exceptions",
      ),
      scenarioUseStatus: importedEnum(
        row,
        "scenario_use_status",
        scenarioUseStatuses,
      ),
      conflict: {
        state: importedEnum(row, "conflict_state", conflictStates),
        conflictGroupId: nullableId(row, "conflict_group_id"),
      },
      citationIds: importedCitationIds(
        importedCitations,
        "structured_fact",
        revision.revisionId,
      ),
    };
  });
  parameterLookup.assertNoOrphans();

  const relatedTopicRows = groupedOrderedRows(
    tables.conceptRelatedTopics,
    "concept_revision_id",
  );
  const consumedRelatedTopics = new Set<string>();
  const importedConcepts = tables.testedConcepts.map((row) => {
    const revision = parseRevision(row);
    const relatedRows = relatedTopicRows.get(revision.revisionId) ?? [];
    consumedRelatedTopics.add(revision.revisionId);
    const deferredScopeId = nullableId(row, "deferred_scope_id");
    const deferredReason = nullableText(cell(row, "deferred_reason"));
    if ((deferredScopeId === null) !== (deferredReason === null)) {
      throw new ClinicalWorkbookCompileError(
        `${row.sourceName}:${row.startLine}:deferred_scope_id: Deferred scope ID and reason must be both blank or both populated.`,
      );
    }
    return {
      id: id(row, "concept_id"),
      revision,
      displayName: text(row, "display_name"),
      learningObjective: text(row, "learning_objective"),
      primaryTopicId: id(row, "primary_topic_id"),
      relatedTopics: relatedRows.map((relatedRow) => ({
        topicId: id(relatedRow, "topic_id"),
        relationshipTypeId: id(relatedRow, "relationship_type_id"),
      })),
      conceptType: importedEnum(row, "concept_type", conceptTypes),
      classification: {
        educationalDifficultyId: id(row, "educational_difficulty_id"),
        earliestFacilityStageId: id(row, "earliest_facility_stage_id"),
        requiredClinicalSettingIds: orderedValues.values(
          "tested_concept",
          revision.revisionId,
          "required_clinical_setting_ids",
        ),
        currentGameEligibility: importedEnum(
          row,
          "current_game_eligibility",
          currentGameEligibilityValues,
        ),
        deferredScope:
          deferredScopeId === null || deferredReason === null
            ? null
            : {
                targetScopeId: deferredScopeId,
                reason: deferredReason,
              },
      },
      citationIds: importedCitationIds(
        importedCitations,
        "tested_concept",
        revision.revisionId,
      ),
    };
  });
  const orphanRelatedTopics = [...relatedTopicRows.keys()].find(
    (revisionId) => !consumedRelatedTopics.has(revisionId),
  );
  if (orphanRelatedTopics) {
    const row = relatedTopicRows.get(orphanRelatedTopics)![0]!;
    throw new ClinicalWorkbookCompileError(
      `${row.sourceName}:${row.startLine}:concept_revision_id: Related-topic row references an unknown concept revision: ${orphanRelatedTopics}`,
    );
  }

  const importedInbox = tables.practiceInbox.map((row) => {
    const revision = parseRevision(row);
    const contentOrigin = importedEnum(
      row,
      "content_origin",
      ["owner_paraphrase"] as const,
    );
    return {
      id: id(row, "inbox_item_id"),
      revision,
      sourceSnapshotId: id(row, "source_snapshot_id"),
      sourceLocator: {
        kind: importedEnum(row, "locator_kind", locatorKinds),
        label: text(row, "locator_label"),
        secondaryLabel: nullableText(cell(row, "locator_secondary_label")),
      },
      contentOrigin,
      paraphrasedTestedPoint: text(row, "paraphrased_tested_point"),
      paraphrasedAnswerOptions: orderedValues.values(
        "practice_inbox_item",
        revision.revisionId,
        "paraphrased_answer_options",
      ),
      correctAnswerSummary: text(row, "correct_answer_summary"),
      ownerNotes: text(row, "owner_notes"),
      uncertaintyToInvestigate: nullableText(
        cell(row, "uncertainty_to_investigate"),
      ),
      citationIds: importedCitationIds(
        importedCitations,
        "practice_inbox_item",
        revision.revisionId,
      ),
      aiSuggestions: [],
    };
  });
  orderedValues.assertNoOrphans();

  const candidate = {
    schemaVersion: CLINICAL_AUTHORING_WORKSPACE_SCHEMA_VERSION,
    id: id(workspaceRow, "workspace_id"),
    label: text(workspaceRow, "label"),
    createdAt: isoTimestampCell(
      cell(workspaceRow, "created_at"),
      cellContext(workspaceRow, "created_at"),
    ),
    updatedAt: isoTimestampCell(
      cell(workspaceRow, "updated_at"),
      cellContext(workspaceRow, "updated_at"),
    ),
    educationalDifficultyDefinitions: mergeRecords(
      baseArray("educationalDifficultyDefinitions"),
      definitions.get("educational_difficulty")!,
      (definition) => definition.id,
      "Educational-difficulty definition",
    ),
    clinicalSettingDefinitions: mergeRecords(
      baseArray("clinicalSettingDefinitions"),
      definitions.get("clinical_setting")!,
      (definition) => definition.id,
      "Clinical-setting definition",
    ),
    conceptTopicRelationshipDefinitions: mergeRecords(
      baseArray("conceptTopicRelationshipDefinitions"),
      definitions.get("concept_topic_relationship")!,
      (definition) => definition.id,
      "Concept-topic relationship definition",
    ),
    facilityStageDefinitions: mergeRecords(
      baseArray("facilityStageDefinitions"),
      definitions.get("facility_stage")! as {
        id: string;
        label: string;
        description: string;
        ordinal: number;
      }[],
      (definition) => definition.id,
      "Facility-stage definition",
    ),
    deferredScopeDefinitions: mergeRecords(
      baseArray("deferredScopeDefinitions"),
      definitions.get("deferred_scope")!,
      (definition) => definition.id,
      "Deferred-scope definition",
    ),
    sourceFormatDefinitions: mergeRecords(
      baseArray("sourceFormatDefinitions"),
      definitions.get("source_format")!,
      (definition) => definition.id,
      "Source-format definition",
    ),
    factTypeDefinitions: mergeRecords(
      baseArray("factTypeDefinitions"),
      definitions.get("fact_type")!,
      (definition) => definition.id,
      "Fact-type definition",
    ),
    distributionTypeDefinitions: mergeRecords(
      baseArray("distributionTypeDefinitions"),
      definitions.get("distribution_type")!,
      (definition) => definition.id,
      "Distribution-type definition",
    ),
    coverageClassificationDefinitions: mergeRecords(
      baseArray("coverageClassificationDefinitions"),
      definitions.get("coverage_classification")!,
      (definition) => definition.id,
      "Coverage-classification definition",
    ),
    sources: mergeRecords(
      baseArray("sources"),
      importedSources,
      (source) => source.id,
      "Source",
    ),
    sourceSnapshots: mergeRecords(
      baseArray("sourceSnapshots"),
      importedSnapshots,
      (snapshot) => snapshot.id,
      "Source Snapshot",
    ),
    citations: mergeRecords(
      baseArray("citations"),
      importedCitations.map((citation) => citation.domain),
      (citation) => citation.id,
      "Citation",
    ),
    coverageFrameworks: mergeRecords(
      baseArray("coverageFrameworks"),
      importedFrameworks,
      (framework) => framework.id,
      "Coverage Framework",
    ),
    coverageFrameworkNodes: mergeRecords(
      baseArray("coverageFrameworkNodes"),
      importedNodes,
      (node) => node.id,
      "Coverage Framework Node",
    ),
    topicCoverageMappings: mergeRecords(
      baseArray("topicCoverageMappings"),
      importedMappings,
      (mapping) => mapping.id,
      "Topic Coverage Mapping",
    ),
    topics: mergeRecords(
      baseArray("topics"),
      importedTopics,
      (topic) => topic.id,
      "Clinical Topic",
    ),
    topicRevisions: mergeRecords(
      baseArray("topicRevisions"),
      importedTopicRevisions,
      (revision) => revision.revision.revisionId,
      "Clinical Topic Revision",
    ),
    structuredFacts: mergeRecords(
      baseArray("structuredFacts"),
      importedFacts,
      (fact) => fact.revision.revisionId,
      "Structured Clinical Fact Revision",
    ),
    concepts: mergeRecords(
      baseArray("concepts"),
      importedConcepts,
      (concept) => concept.revision.revisionId,
      "Tested Concept Revision",
    ),
    practiceInbox: mergeRecords(
      baseArray("practiceInbox"),
      importedInbox,
      (item) => item.revision.revisionId,
      "Practice Inbox Revision",
    ),
    extractionBatches: [...baseArray("extractionBatches")],
  };

  try {
    const workspace = validateClinicalAuthoringWorkspace(candidate);
    return {
      workspace,
      serialized: `${JSON.stringify(workspace, null, 2)}\n`,
      reviewWarnings: [
        "Structural validation cannot determine whether prose was copied from a protected source.",
        "Structural validation cannot detect PHI or establish clinical truth.",
        "Source rights and clinical approval still require human review.",
      ],
    };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const details = error.issues
        .map(
          (issue) =>
            `- ${issue.path.join(".") || "<root>"}: ${issue.message}`,
        )
        .join("\n");
      throw new ClinicalWorkbookCompileError(
        `Compiled workbook failed schema validation:\n${details}`,
      );
    }
    throw error;
  }
}

export async function writeCompiledClinicalWorkbook(
  outputPath: string,
  compiled: CompiledClinicalWorkbook,
): Promise<void> {
  await writeNewWorkbookOutput(outputPath, compiled.serialized);
}
