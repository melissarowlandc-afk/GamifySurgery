import { serializeCsv } from "./csv.js";
import type { WorkbookTemplateFile } from "./filesystem.js";
import { CLINICAL_AUTHORING_WORKSPACE_SCHEMA_VERSION } from "../workspace.js";

export const CLINICAL_WORKBOOK_FORMAT_VERSION = 1;

export const clinicalWorkbookTables = {
  workspace: {
    fileName: "WORKSPACE.csv",
    headers: [
      "format_version",
      "schema_version",
      "workspace_id",
      "label",
      "created_at",
      "updated_at",
    ],
  },
  definitions: {
    fileName: "CONTROLLED_LISTS.csv",
    headers: [
      "definition_type",
      "id",
      "label",
      "description",
      "ordinal",
    ],
  },
  sources: {
    fileName: "SOURCES.csv",
    headers: [
      "source_id",
      "title",
      "source_type",
      "edition",
      "publication_year",
      "publisher_or_organization",
      "canonical_url_or_identifier",
      "scope_note",
      "rights_status",
      "rights_note",
      "rights_reviewed_by",
      "rights_reviewed_at",
      "rights_basis",
      "private_storage_permitted",
      "local_processing_permitted",
      "external_ai_transfer_permitted",
      "public_source_text_reuse_permitted",
      "project_paraphrase_publication_permitted",
    ],
  },
  sourceSnapshots: {
    fileName: "SOURCE_SNAPSHOTS.csv",
    headers: [
      "snapshot_id",
      "source_id",
      "format_id",
      "access_scope",
      "retrieved_url",
      "retrieved_at",
      "upstream_last_modified",
      "sha256",
    ],
  },
  citations: {
    fileName: "CITATIONS.csv",
    headers: [
      "citation_id",
      "source_snapshot_id",
      "target_kind",
      "target_id",
      "ordinal",
      "usage_kind",
      "locator_kind",
      "locator_label",
      "locator_secondary_label",
      "supported_claim",
      "verification_state",
      "verification_reviewer_id",
      "verification_recorded_at",
      "recorded_at",
    ],
  },
  coverageFrameworks: {
    fileName: "COVERAGE_FRAMEWORKS.csv",
    headers: [
      "framework_id",
      "name",
      "version_label",
      "source_snapshot_id",
      "recorded_at",
    ],
  },
  coverageFrameworkNodes: {
    fileName: "FRAMEWORK_NODES.csv",
    headers: [
      "node_id",
      "framework_id",
      "external_category_id",
      "parent_node_id",
      "ordinal",
      "category_label",
      "source_defined_classification_id",
      "note",
    ],
  },
  topicCoverageMappings: {
    fileName: "TOPIC_COVERAGE_MAPPINGS.csv",
    headers: [
      "mapping_id",
      "coverage_node_id",
      "topic_id",
      "coverage_status",
      "current_game_eligibility",
      "deferred_scope_id",
      "author_id",
      "updated_at",
      "workflow_state",
      "note",
    ],
  },
  topics: {
    fileName: "TOPICS.csv",
    headers: [
      "topic_id",
      "preferred_name",
      "topic_type",
      "current_working_revision_id",
    ],
  },
  topicRevisions: {
    fileName: "TOPIC_REVISIONS.csv",
    headers: [
      "topic_id",
      "revision_id",
      "parent_revision_id",
      "author_id",
      "workflow_state",
      "provenance_kind",
      "provenance_reference",
      "created_at",
      "change_summary",
      "approval_reviewer_id",
      "approval_reviewed_at",
      "approval_checklist_version",
    ],
  },
  topicSections: {
    fileName: "TOPIC_SECTIONS.csv",
    headers: [
      "section_id",
      "topic_revision_id",
      "ordinal",
      "section_type",
      "narrative",
    ],
  },
  structuredFacts: {
    fileName: "STRUCTURED_FACTS.csv",
    headers: [
      "fact_id",
      "topic_revision_id",
      "revision_id",
      "parent_revision_id",
      "author_id",
      "workflow_state",
      "provenance_kind",
      "provenance_reference",
      "created_at",
      "change_summary",
      "approval_reviewer_id",
      "approval_reviewed_at",
      "approval_checklist_version",
      "fact_type_id",
      "value_kind",
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
      "population",
      "clinical_context",
      "applicability",
      "scenario_use_status",
      "conflict_state",
      "conflict_group_id",
    ],
  },
  distributionParameters: {
    fileName: "DISTRIBUTION_PARAMETERS.csv",
    headers: [
      "fact_revision_id",
      "parameter_id",
      "value_type",
      "string_value",
      "number_value",
      "boolean_value",
    ],
  },
  testedConcepts: {
    fileName: "TESTED_CONCEPTS.csv",
    headers: [
      "concept_id",
      "revision_id",
      "parent_revision_id",
      "author_id",
      "workflow_state",
      "provenance_kind",
      "provenance_reference",
      "created_at",
      "change_summary",
      "approval_reviewer_id",
      "approval_reviewed_at",
      "approval_checklist_version",
      "display_name",
      "learning_objective",
      "primary_topic_id",
      "concept_type",
      "educational_difficulty_id",
      "earliest_facility_stage_id",
      "current_game_eligibility",
      "deferred_scope_id",
      "deferred_reason",
    ],
  },
  conceptRelatedTopics: {
    fileName: "CONCEPT_RELATED_TOPICS.csv",
    headers: [
      "concept_revision_id",
      "ordinal",
      "topic_id",
      "relationship_type_id",
    ],
  },
  practiceInbox: {
    fileName: "PRACTICE_INBOX.csv",
    headers: [
      "inbox_item_id",
      "revision_id",
      "parent_revision_id",
      "author_id",
      "workflow_state",
      "provenance_kind",
      "provenance_reference",
      "created_at",
      "change_summary",
      "approval_reviewer_id",
      "approval_reviewed_at",
      "approval_checklist_version",
      "source_snapshot_id",
      "locator_kind",
      "locator_label",
      "locator_secondary_label",
      "content_origin",
      "paraphrased_tested_point",
      "correct_answer_summary",
      "owner_notes",
      "uncertainty_to_investigate",
    ],
  },
  orderedValues: {
    fileName: "ORDERED_VALUES.csv",
    headers: [
      "owner_type",
      "owner_id",
      "field",
      "ordinal",
      "value",
    ],
  },
} as const;

export type ClinicalWorkbookTableName = keyof typeof clinicalWorkbookTables;

export type ClinicalWorkbookInitializationOptions = {
  workspaceId: string;
  label: string;
  timestamp: string;
};

const defaultDefinitionRows = [
  [
    "educational_difficulty",
    "difficulty.unclassified",
    "Unclassified",
    "Temporary value for records not yet classified.",
    "",
  ],
  [
    "clinical_setting",
    "setting.unclassified",
    "Unclassified",
    "Temporary value for records not yet classified.",
    "",
  ],
  [
    "concept_topic_relationship",
    "topic-link.unclassified",
    "Unclassified relationship",
    "Temporary value pending owner review.",
    "",
  ],
  [
    "facility_stage",
    "facility-stage.unassigned",
    "Unassigned",
    "Temporary value for records not yet mapped to facility progression.",
    "0",
  ],
  [
    "source_format",
    "format.unclassified",
    "Unclassified format",
    "Temporary value pending source registration.",
    "",
  ],
  [
    "fact_type",
    "fact-type.unclassified",
    "Unclassified fact type",
    "Temporary value pending authoring-pilot review.",
    "",
  ],
  [
    "distribution_type",
    "distribution.unclassified",
    "Unclassified distribution",
    "Temporary value pending authoring-pilot review.",
    "",
  ],
  [
    "coverage_classification",
    "coverage-classification.unclassified",
    "Unclassified source category",
    "Temporary value pending framework-node import.",
    "",
  ],
] as const;

export function createClinicalWorkbookTemplateFiles(
  options: ClinicalWorkbookInitializationOptions,
): WorkbookTemplateFile[] {
  const files: WorkbookTemplateFile[] = [
    {
      relativePath: "START_HERE.txt",
      contents:
        "Private technical CSV interchange template.\n\n" +
        "This is not the final owner-friendly Google Sheet. It validates the manual-authoring subset and import mapping.\n" +
        "A future sheet/admin UI will protect or automate technical IDs, revisions, and controlled fields.\n\n" +
        "This CSV version does not author extraction batches, AI suggestions, patient variants, questions, or releases.\n\n" +
        "- Do not include PHI.\n" +
        "- Do not paste copyrighted question-bank or textbook text.\n" +
        "- Keep stable IDs unchanged after references exist.\n" +
        "- Every imported clinical record remains subject to human review.\n",
    },
  ];

  for (const table of Object.values(clinicalWorkbookTables)) {
    let rows: readonly (readonly string[])[] = [];
    if (table.fileName === clinicalWorkbookTables.workspace.fileName) {
      rows = [
        [
          String(CLINICAL_WORKBOOK_FORMAT_VERSION),
          String(CLINICAL_AUTHORING_WORKSPACE_SCHEMA_VERSION),
          options.workspaceId,
          options.label,
          options.timestamp,
          options.timestamp,
        ],
      ];
    } else if (
      table.fileName === clinicalWorkbookTables.definitions.fileName
    ) {
      rows = defaultDefinitionRows;
    }
    files.push({
      relativePath: table.fileName,
      contents: serializeCsv(table.headers, rows),
    });
  }

  return files;
}
