import { resolve } from "node:path";

import {
  appendSanitizedAuthoringReferences,
  designateServerOwnedAuthoringWorkspacePath,
  loadSanitizedAuthoringContext,
  type SanitizedAuthoringContext,
} from "@gamify-surgery/clinical-research/node";
import type { ResearchWorkspace } from "@gamify-surgery/clinical-research";

const advanceTimestamp = (workspace: ResearchWorkspace): string =>
  new Date(
    Math.max(Date.now(), Date.parse(workspace.updatedAt) + 1),
  ).toISOString();

/**
 * Fixed-path, server-only bridge to the validated local authoring workspace.
 * Request bodies can never choose a source path.
 */
export class LocalAuthoringContextService {
  private readonly ownedPath;

  constructor(repositoryRoot: string) {
    this.ownedPath = designateServerOwnedAuthoringWorkspacePath(
      resolve(
        repositoryRoot,
        ".clinical-workbench",
        "compiled-workspace.json",
      ),
    );
  }

  load(): Promise<SanitizedAuthoringContext> {
    return loadSanitizedAuthoringContext(this.ownedPath);
  }

  async sync(workspace: ResearchWorkspace): Promise<{
    workspace: ResearchWorkspace;
    context: SanitizedAuthoringContext;
  }> {
    const context = await this.load();
    return {
      workspace: appendSanitizedAuthoringReferences(
        workspace,
        context,
        advanceTimestamp(workspace),
      ),
      context,
    };
  }
}
