import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { afterEach, describe, expect, it } from "vitest";

import {
  clinicalWorkbookTables,
  compileClinicalWorkbook,
  initializeClinicalWorkbook,
  serializeCsv,
  type ClinicalWorkbookTableName,
} from "../src/workbook/index.js";

const temporaryRoots: string[] = [];

async function workbookRoot(): Promise<string> {
  const parent = await mkdtemp(join(tmpdir(), "clinical-workbook-compile-"));
  temporaryRoots.push(parent);
  const workbook = join(parent, "pilot");
  await initializeClinicalWorkbook(workbook, {
    workspaceId: "workspace.test.pilot",
    label: "Test pilot",
    timestamp: "2026-07-26T01:00:00Z",
  });
  return workbook;
}

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) =>
      rm(root, { recursive: true, force: true }),
    ),
  );
});

async function writeTable(
  root: string,
  tableName: ClinicalWorkbookTableName,
  records: readonly Record<string, string>[],
): Promise<void> {
  const table = clinicalWorkbookTables[tableName];
  const rows = records.map((record) =>
    table.headers.map((header) => record[header] ?? ""),
  );
  await writeFile(
    join(root, table.fileName),
    serializeCsv(table.headers, rows),
    "utf8",
  );
}

const revisionFields = {
  parent_revision_id: "",
  author_id: "author.test",
  workflow_state: "draft",
  provenance_kind: "manual",
  provenance_reference: "workbook.test",
  created_at: "2026-07-26T01:00:00Z",
  change_summary: "Create test record.",
  approval_reviewer_id: "",
  approval_reviewed_at: "",
  approval_checklist_version: "",
};

describe("clinical workbook compiler", () => {
  it("initializes and compiles a usable empty schema-v2 workspace", async () => {
    const root = await workbookRoot();

    const first = await compileClinicalWorkbook(root);
    const second = await compileClinicalWorkbook(root);

    expect(first.workspace.schemaVersion).toBe(2);
    expect(first.workspace.id).toBe("workspace.test.pilot");
    expect(first.workspace.topics).toEqual([]);
    expect(first.serialized).toBe(second.serialized);
    expect(first.serialized.endsWith("\n")).toBe(true);
  });

  it("merges the immutable official framework registry without rewriting it", async () => {
    const root = await workbookRoot();
    const base = JSON.parse(
      await readFile(
        new URL(
          "../../../clinical-data/public/official-frameworks.json",
          import.meta.url,
        ),
        "utf8",
      ),
    );

    const compiled = await compileClinicalWorkbook(root, {
      baseWorkspace: base,
    });

    expect(compiled.workspace.coverageFrameworks).toHaveLength(2);
    expect(compiled.workspace.sources).toHaveLength(2);
    expect(compiled.workspace.id).toBe("workspace.test.pilot");
  });

  it("rejects duplicate imported records even when their values match", async () => {
    const root = await workbookRoot();
    const duplicateSource = {
      source_id: "source.test.duplicate",
      title: "Duplicate source",
      source_type: "owner_notes",
      edition: "",
      publication_year: "",
      publisher_or_organization: "",
      canonical_url_or_identifier: "",
      scope_note: "Duplicate-record test.",
      rights_status: "synthetic_or_owner_authored",
      rights_note: "Project-owned test metadata.",
      rights_reviewed_by: "reviewer.rights",
      rights_reviewed_at: "2026-07-26T01:00:00Z",
      rights_basis: "Created for this automated test.",
      private_storage_permitted: "TRUE",
      local_processing_permitted: "TRUE",
      external_ai_transfer_permitted: "TRUE",
      public_source_text_reuse_permitted: "TRUE",
      project_paraphrase_publication_permitted: "TRUE",
    };
    await writeTable(root, "sources", [
      duplicateSource,
      duplicateSource,
    ]);

    await expect(compileClinicalWorkbook(root)).rejects.toThrow(
      /Source ID appears more than once/,
    );
  });

  it("rejects duplicate framework-node IDs before deriving paths", async () => {
    const root = await workbookRoot();
    const shared = {
      node_id: "framework-node.test.duplicate",
      framework_id: "framework.test.v1",
      external_category_id: "duplicate",
      parent_node_id: "",
      ordinal: "0",
      source_defined_classification_id: "",
      note: "Duplicate-node test.",
    };
    await writeTable(root, "coverageFrameworkNodes", [
      { ...shared, category_label: "First label" },
      { ...shared, category_label: "Second label" },
    ]);

    await expect(compileClinicalWorkbook(root)).rejects.toThrow(
      /Framework-node ID appears more than once/,
    );
  });

  it("compiles an end-to-end normalized pilot and derives exact citation links", async () => {
    const root = await workbookRoot();

    await writeTable(root, "sources", [
      {
        source_id: "source.test.synthetic",
        title: "Project-owned synthetic source",
        source_type: "synthetic_fixture",
        edition: "1",
        publication_year: "2026",
        publisher_or_organization: "Test project",
        canonical_url_or_identifier: "",
        scope_note: "Synthetic compiler fixture.",
        rights_status: "synthetic_or_owner_authored",
        rights_note: "Project-owned synthetic material.",
        rights_reviewed_by: "reviewer.rights",
        rights_reviewed_at: "2026-07-26T01:00:00Z",
        rights_basis: "Created solely for this automated test.",
        private_storage_permitted: "TRUE",
        local_processing_permitted: "TRUE",
        external_ai_transfer_permitted: "TRUE",
        public_source_text_reuse_permitted: "TRUE",
        project_paraphrase_publication_permitted: "TRUE",
      },
    ]);
    await writeTable(root, "sourceSnapshots", [
      {
        snapshot_id: "snapshot.test.synthetic.v1",
        source_id: "source.test.synthetic",
        format_id: "format.unclassified",
        access_scope: "synthetic_fixture",
        retrieved_url: "",
        retrieved_at: "2026-07-26T01:00:00Z",
        upstream_last_modified: "",
        sha256: "",
      },
    ]);
    await writeTable(root, "coverageFrameworks", [
      {
        framework_id: "framework.test.v1",
        name: "Synthetic framework",
        version_label: "1",
        source_snapshot_id: "snapshot.test.synthetic.v1",
        recorded_at: "2026-07-26T01:00:00Z",
      },
    ]);
    await writeTable(root, "coverageFrameworkNodes", [
      {
        node_id: "framework-node.test.patient-care",
        framework_id: "framework.test.v1",
        external_category_id: "patient-care",
        parent_node_id: "",
        ordinal: "0",
        category_label: "Patient Care",
        source_defined_classification_id:
          "coverage-classification.unclassified",
        note: "Synthetic root.",
      },
      {
        node_id: "framework-node.test.patient-care.abdomen",
        framework_id: "framework.test.v1",
        external_category_id: "abdomen",
        parent_node_id: "framework-node.test.patient-care",
        ordinal: "0",
        category_label: "Abdomen",
        source_defined_classification_id:
          "coverage-classification.unclassified",
        note: "Synthetic child.",
      },
    ]);
    await writeTable(root, "topics", [
      {
        topic_id: "topic.test.example",
        preferred_name: "Synthetic example",
        topic_type: "synthetic_training_topic",
        current_working_revision_id: "topic-revision.test.example.v1",
      },
    ]);
    await writeTable(root, "topicCoverageMappings", [
      {
        mapping_id: "topic-mapping.test.example",
        coverage_node_id: "framework-node.test.patient-care.abdomen",
        topic_id: "topic.test.example",
        coverage_status: "partial",
        current_game_eligibility: "unclassified",
        deferred_scope_id: "",
        author_id: "author.test",
        updated_at: "2026-07-26T01:00:00Z",
        workflow_state: "draft",
        note: "Synthetic mapping.",
      },
    ]);
    await writeTable(root, "topicRevisions", [
      {
        topic_id: "topic.test.example",
        revision_id: "topic-revision.test.example.v1",
        ...revisionFields,
      },
    ]);
    await writeTable(root, "topicSections", [
      {
        section_id: "section.test.example.definition.v1",
        topic_revision_id: "topic-revision.test.example.v1",
        ordinal: "0",
        section_type: "definition",
        narrative: 'Synthetic narrative with comma, "quote", and\nnew line.',
      },
    ]);
    await writeTable(root, "structuredFacts", [
      {
        fact_id: "fact.test.example.definition",
        topic_revision_id: "topic-revision.test.example.v1",
        revision_id: "fact-revision.test.example.definition.v1",
        ...revisionFields,
        fact_type_id: "fact-type.unclassified",
        value_kind: "text",
        text_value: "Synthetic fact value.",
        population: "Synthetic actors.",
        clinical_context: "Compiler testing.",
        applicability: "Automated tests only.",
        scenario_use_status: "descriptive_only",
        conflict_state: "none",
        conflict_group_id: "",
      },
    ]);
    await writeTable(root, "testedConcepts", [
      {
        concept_id: "concept.test.example",
        revision_id: "concept-revision.test.example.v1",
        ...revisionFields,
        display_name: "Synthetic concept",
        learning_objective: "Choose one synthetic action.",
        primary_topic_id: "topic.test.example",
        concept_type: "synthetic_training",
        educational_difficulty_id: "difficulty.unclassified",
        earliest_facility_stage_id: "facility-stage.unassigned",
        current_game_eligibility: "unclassified",
        deferred_scope_id: "",
        deferred_reason: "",
      },
    ]);
    await writeTable(root, "practiceInbox", [
      {
        inbox_item_id: "inbox.test.example",
        revision_id: "inbox-revision.test.example.v1",
        ...revisionFields,
        source_snapshot_id: "snapshot.test.synthetic.v1",
        locator_kind: "synthetic_marker",
        locator_label: "Synthetic question",
        locator_secondary_label: "",
        content_origin: "owner_paraphrase",
        paraphrased_tested_point: "Choose one synthetic action.",
        correct_answer_summary: "Choose it.",
        owner_notes: "Project-owned test.",
        uncertainty_to_investigate: "",
      },
    ]);
    await writeTable(root, "orderedValues", [
      {
        owner_type: "topic",
        owner_id: "topic.test.example",
        field: "aliases",
        ordinal: "0",
        value: "Synthetic alias",
      },
      {
        owner_type: "tested_concept",
        owner_id: "concept-revision.test.example.v1",
        field: "required_clinical_setting_ids",
        ordinal: "0",
        value: "setting.unclassified",
      },
      {
        owner_type: "practice_inbox_item",
        owner_id: "inbox-revision.test.example.v1",
        field: "paraphrased_answer_options",
        ordinal: "0",
        value: "Choose it",
      },
    ]);

    const targets = [
      ["coverage_framework_node", "framework-node.test.patient-care"],
      [
        "coverage_framework_node",
        "framework-node.test.patient-care.abdomen",
      ],
      ["topic_section", "section.test.example.definition.v1"],
      ["structured_fact", "fact-revision.test.example.definition.v1"],
      ["tested_concept", "concept-revision.test.example.v1"],
      ["practice_inbox_item", "inbox-revision.test.example.v1"],
    ] as const;
    const citationRecords = targets.map(([targetKind, targetId], index) => ({
        citation_id: `citation.test.${index}`,
        source_snapshot_id: "snapshot.test.synthetic.v1",
        target_kind: targetKind,
        target_id: targetId,
        ordinal: "0",
        usage_kind: "synthetic_content",
        locator_kind: "synthetic_marker",
        locator_label:
          targetKind === "practice_inbox_item"
            ? "Synthetic question"
            : `Synthetic marker ${index}`,
        locator_secondary_label: "",
        supported_claim: "This is project-owned synthetic test content.",
        verification_state: "unverified",
        verification_reviewer_id: "",
        verification_recorded_at: "",
        recorded_at: "2026-07-26T01:00:00Z",
      }));
    citationRecords.unshift({
      citation_id: "citation.test.fact.second",
      source_snapshot_id: "snapshot.test.synthetic.v1",
      target_kind: "structured_fact",
      target_id: "fact-revision.test.example.definition.v1",
      ordinal: "1",
      usage_kind: "synthetic_content",
      locator_kind: "synthetic_marker",
      locator_label: "Second fact marker",
      locator_secondary_label: "",
      supported_claim: "A second exact citation is preserved.",
      verification_state: "unverified",
      verification_reviewer_id: "",
      verification_recorded_at: "",
      recorded_at: "2026-07-26T01:00:00Z",
    });
    await writeTable(root, "citations", citationRecords);

    const compiled = await compileClinicalWorkbook(root);

    expect(
      compiled.workspace.coverageFrameworkNodes[1]?.categoryPath,
    ).toEqual(["Patient Care", "Abdomen"]);
    expect(compiled.workspace.topicRevisions[0]?.sections[0]).toMatchObject({
      narrative: 'Synthetic narrative with comma, "quote", and\nnew line.',
      citationIds: ["citation.test.2"],
    });
    expect(compiled.workspace.structuredFacts[0]?.citationIds).toEqual([
      "citation.test.3",
      "citation.test.fact.second",
    ]);
    expect(compiled.workspace.concepts[0]?.classification.requiredClinicalSettingIds)
      .toEqual(["setting.unclassified"]);
    expect(compiled.workspace.practiceInbox[0]?.aiSuggestions).toEqual([]);
    expect(compiled.workspace.extractionBatches).toEqual([]);
  });

  it("rejects formulas in stable reference fields", async () => {
    const root = await workbookRoot();
    await writeTable(root, "topics", [
      {
        topic_id: "=LOWER(A1)",
        preferred_name: "Unsafe",
        topic_type: "diagnosis",
        current_working_revision_id: "",
      },
    ]);

    await expect(compileClinicalWorkbook(root)).rejects.toThrow(
      /Formulas are not permitted/,
    );
  });

  it("reports schema drift at the workbook manifest boundary", async () => {
    const root = await workbookRoot();
    const workspacePath = join(root, "WORKSPACE.csv");
    const original = await readFile(workspacePath, "utf8");
    await writeFile(
      workspacePath,
      original.replace(",2,workspace.test.pilot", ",1,workspace.test.pilot"),
      "utf8",
    );

    await expect(compileClinicalWorkbook(root)).rejects.toThrow(
      /Expected workspace schema 2/,
    );
  });
});
