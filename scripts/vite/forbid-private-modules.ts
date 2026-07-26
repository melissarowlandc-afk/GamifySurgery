import type { Plugin } from "vite";

const forbiddenMarkers = [
  "/apps/clinical-context-workbench/",
  "/packages/clinical-authoring/",
  "/packages/clinical-research/",
  "/.clinical-workbench/",
  "/.private-clinical-data/",
  "/clinical-data/private/",
  "/clinical-data/imports/",
  "/clinical-data/exports/",
  "@gamify-surgery/clinical-authoring",
  "@gamify-surgery/clinical-research",
  "@gamify-surgery/clinical-context-workbench",
] as const;

function normalize(value: string): string {
  return value.replaceAll("\\", "/");
}

function rejectIfPrivate(value: string, context: string): void {
  const normalized = normalize(value);
  const marker = forbiddenMarkers.find((candidate) =>
    normalized.includes(candidate),
  );
  if (marker) {
    throw new Error(
      `Player build ${context} contains authoring-only marker "${marker}": ${normalized}`,
    );
  }
}

export function forbidPrivateModules(): Plugin {
  return {
    name: "forbid-private-clinical-modules",
    enforce: "pre",
    resolveId(source, importer) {
      rejectIfPrivate(source, "import");
      if (importer) {
        rejectIfPrivate(importer, "importer");
      }
      return null;
    },
    generateBundle(_options, bundle) {
      for (const [fileName, output] of Object.entries(bundle)) {
        rejectIfPrivate(fileName, "output path");
        if (output.type === "chunk") {
          rejectIfPrivate(output.code, `chunk ${fileName}`);
          for (const moduleId of Object.keys(output.modules)) {
            rejectIfPrivate(moduleId, `module in ${fileName}`);
          }
        } else {
          const source =
            typeof output.source === "string"
              ? output.source
              : new TextDecoder().decode(output.source);
          rejectIfPrivate(source, `asset ${fileName}`);
        }
      }
    },
  };
}
