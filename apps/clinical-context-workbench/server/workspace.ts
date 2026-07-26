import {
  validateResearchWorkspace,
  type ResearchWorkspace,
} from "@gamify-surgery/clinical-research";

const LOCAL_ACTOR = "author.local.workbench";
const EXAMPLE_TARGET = {
  kind: "other" as const,
  id: "target.local.unassigned",
};

export function createInitialResearchWorkspace(
  now = new Date().toISOString(),
): ResearchWorkspace {
  return validateResearchWorkspace({
    schemaVersion: 1,
    id: "research.workspace.local.clinical-context",
    createdAt: now,
    updatedAt: now,
    externalReferences: {
      sources: [],
      citations: [],
      clinicalTargets: [EXAMPLE_TARGET],
      clinicalApprovals: [],
    },
    citationVerificationSignals: [],
    evidenceGaps: [
      {
        id: "gap.example.evidence-plan",
        createdAt: now,
        createdBy: LOCAL_ACTOR,
      },
    ],
    evidenceGapRevisions: [
      {
        revisionId: "gap-revision.example.evidence-plan.v1",
        gapId: "gap.example.evidence-plan",
        supersedesRevisionId: null,
        title: "Example: establish an evidence plan",
        clinicalQuestion:
          "What evidence is needed before a proposed clinical learning objective can be synthesized?",
        whyNeeded:
          "This non-clinical workflow example demonstrates how research needs remain separate from supported knowledge.",
        targetContent: [EXAMPLE_TARGET],
        acceptanceCriteria: [
          "At least one candidate has a recorded human screening decision.",
          "Any source use has an operation-specific rights decision.",
          "Expert opinion is labeled separately from formal evidence.",
        ],
        scoutPolicy: {
          mode: "manual_only",
          preferredSourceTypes: [
            "clinical_guideline",
            "systematic_review",
            "journal_article",
          ],
          preferredJurisdictions: [],
          preferredPopulations: [],
          preferredSettings: [],
          providerStrategies: [],
          publicationYearFloor: null,
          includePreprints: false,
          maximumCandidates: 100,
          refreshIntervalDays: null,
          requireHumanScreening: true,
          requireRightsDecisionBeforeFullText: true,
        },
        status: "open",
        resolutionNote: null,
        recordedAt: now,
        recordedBy: LOCAL_ACTOR,
        changeSummary: "Create a non-clinical workflow example.",
      },
    ],
    sourceRelations: [],
    sourceRightsDecisions: [],
    searchRuns: [],
    candidates: [],
    candidateObservations: [],
    screeningDecisions: [],
    contributions: [],
    expertOpinions: [],
    expertOpinionRevisions: [],
    synthesisProposals: [],
    synthesisDecisions: [],
    contentChangeProposals: [],
  });
}
