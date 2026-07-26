import { initializeWorkbookDirectory } from "./filesystem.js";
import {
  createClinicalWorkbookTemplateFiles,
  type ClinicalWorkbookInitializationOptions,
} from "./format.js";

export * from "./cells.js";
export * from "./compiler.js";
export * from "./csv.js";
export * from "./filesystem.js";
export * from "./format.js";

export type InitializeClinicalWorkbookOptions =
  Partial<ClinicalWorkbookInitializationOptions>;

export async function initializeClinicalWorkbook(
  targetDirectory: string,
  options: InitializeClinicalWorkbookOptions = {},
): Promise<void> {
  const timestamp = options.timestamp ?? new Date().toISOString();
  await initializeWorkbookDirectory(
    targetDirectory,
    createClinicalWorkbookTemplateFiles({
      workspaceId: options.workspaceId ?? "workspace.local-pilot.v1",
      label: options.label ?? "Local clinical-authoring pilot",
      timestamp,
    }),
  );
}
